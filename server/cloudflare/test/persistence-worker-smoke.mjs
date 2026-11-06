// Cold-process restart proof using only local Wrangler SQLite/R2 data.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {setTimeout as delay} from 'node:timers/promises';
import WebSocket from 'ws';
const URL_BASE='http://127.0.0.1:8787',ORIGIN='https://party.thiepn.dev';
const SAVE_FILE=process.env.RUNNER_TEMP+'/party-restart-proof.json';
function socket(code){
  const ws=new WebSocket(URL_BASE.replace('http','ws')+'/ws?code='+code,{origin:ORIGIN,handshakeTimeout:12000});
  const messages=[],waiters=[];
  ws.on('message',raw=>{
    const obj=JSON.parse(String(raw));messages.push(obj);
    for(const waiter of [...waiters])if(waiter.predicate(obj)){
      waiters.splice(waiters.indexOf(waiter),1);
      messages.splice(messages.indexOf(obj),1);
      clearTimeout(waiter.timer);waiter.resolve(obj);
    }
  });
  ws.on('error',()=>{});
  return {
    ws,
    ready:()=>new Promise((resolve,reject)=>{ws.once('open',resolve);ws.once('error',reject);}),
    send:o=>ws.send(JSON.stringify(o)),
    next(predicate){
      const index=messages.findIndex(predicate);
      if(index>=0)return Promise.resolve(messages.splice(index,1)[0]);
      return new Promise((resolve,reject)=>{
        const w={predicate,resolve};
        w.timer=setTimeout(()=>{const i=waiters.indexOf(w);if(i>=0)waiters.splice(i,1);reject(new Error('Timed out waiting for room state'));},12000);
        waiters.push(w);
      });
    },
    close:()=>ws.terminate()
  };
}
if(process.argv[2]==='record'){
  const response=await fetch(URL_BASE+'/rooms',{method:'POST',headers:{Origin:ORIGIN},body:'{}'});
  assert.equal(response.status,201);
  const {code,createToken}=await response.json(),clients=[];
  try{
    for(let i=0;i<5;i++){
      const c=socket(code);await c.ready();
      c.send(i?{action:'join',name:'Player'+i,code}:{action:'create',name:'Host',createToken});
      c.joined=await c.next(m=>m.type==='joined');clients.push(c);
    }
    clients[0].send({action:'start',game:'social',mode:'majority',duration:'quick',language:'en'});
    await clients[0].next(m=>m.type==='state'&&m.stage==='answer'&&m.round===0);
    for(let i=0;i<5;i++)clients[i].send({action:'submit',round:0,choice:i<3?0:1});
    const result=await clients[0].next(m=>m.type==='state'&&m.stage==='reveal'&&m.round===0);
    assert.equal(result.completed,1);
    assert.deepEqual(result.players.map(p=>p.points),[1,1,1,0,0]);
    writeFileSync(SAVE_FILE,JSON.stringify({code,id:clients[0].joined.id,token:clients[0].joined.token,players:result.players.map(p=>({id:p.id,points:p.points})),completed:1,round:0,stage:'reveal'}));
  }finally{for(const c of clients)c.close();await delay(500);}
  console.log('LOCAL_STORAGE_RECORD: saved 5-player majority result with three awarded points');
}else if(process.argv[2]==='verify'){
  const saved=JSON.parse(readFileSync(SAVE_FILE,'utf8'));
  const c=socket(saved.code);await c.ready();
  try{
    c.send({action:'resume',code:saved.code,id:saved.id,token:saved.token});
    const joined=await c.next(m=>m.type==='joined');
    assert.equal(joined.id,saved.id);
    assert.notEqual(joined.token,saved.token);
    const state=await c.next(m=>m.type==='state'&&m.stage==='reveal'&&m.round===0);
    assert.equal(state.completed,saved.completed);
    assert.deepEqual(state.players.map(p=>({id:p.id,points:p.points})),saved.players);
    assert.equal(state.you,saved.id);
    assert.equal(state.isHost,true);
    console.log('LOCAL_STORAGE_RESTART: PASS, five persisted seats and scores survived actual workerd process restart');
  }finally{c.close();}
}else{throw new Error('Expected record or verify phase');}

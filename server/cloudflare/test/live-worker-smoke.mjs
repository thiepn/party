// Local Wrangler/workerd smoke test only. Connects to 127.0.0.1; never deploys or calls Cloudflare APIs.
import assert from 'node:assert/strict';
import WebSocket from 'ws';
const API=process.env.PARTY_LOCAL_API||'http://127.0.0.1:8787';
const ORIGIN='https://party.thiepn.dev';
const waitLimit=12000;
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function connection(code){
  const url=API.replace(/^http/,'ws')+'/ws?code='+code;
  const ws=new WebSocket(url,{origin:ORIGIN,handshakeTimeout:waitLimit});
  const messages=[],waiters=[];
  ws.on('message',raw=>{
    const obj=JSON.parse(String(raw));messages.push(obj);
    for(const w of [...waiters])if(w.predicate(obj)){
      const i=waiters.indexOf(w);if(i>=0)waiters.splice(i,1);
      const j=messages.indexOf(obj);if(j>=0)messages.splice(j,1);
      clearTimeout(w.timer);w.resolve(obj);
    }
  });
  ws.on('error',()=>{});
  const ready=new Promise((resolve,reject)=>{ws.once('open',resolve);ws.once('error',reject);});
  function next(predicate,timeout=waitLimit){
    const found=messages.findIndex(predicate);
    if(found>=0)return Promise.resolve(messages.splice(found,1)[0]);
    return new Promise((resolve,reject)=>{
      const w={predicate,resolve,reject};
      w.timer=setTimeout(()=>{const i=waiters.indexOf(w);if(i>=0)waiters.splice(i,1);reject(new Error('Timed out waiting for room message '+code));},timeout);
      waiters.push(w);
    });
  }
  return {ws,ready,next,send:obj=>ws.send(JSON.stringify(obj)),close:()=>ws.terminate()};
}
async function reserve(){
  const r=await fetch(API+'/rooms',{method:'POST',headers:{Origin:ORIGIN,'Content-Type':'application/json'},body:'{}'});
  assert.equal(r.status,201,'room create should succeed');
  const data=await r.json();assert.match(data.code,/^[A-HJ-NP-Z2-9]{8}$/);return data;
}
const results=[];
for(const n of [4,5,6]){
  const allocation=await reserve(),clients=[];
  try{
    for(let i=0;i<n;i++){
      const c=connection(allocation.code);await c.ready;
      c.send(i?{action:'join',code:allocation.code,name:'P'+i}:{action:'create',name:'Host',createToken:allocation.createToken});
      c.joined=await c.next(m=>m.type==='joined');
      clients.push(c);
    }
    const host=clients[0];
    for(const duration of ['toString','constructor','__proto__']){
      host.send({action:'start',game:'social',mode:'majority',duration,language:'en'});
      const error=await host.next(m=>m.type==='error');
      assert.match(error.message,/Invalid game or configuration/);
    }
    host.send({action:'start',game:'social',mode:'majority',duration:'quick',language:'en'});
    await host.next(m=>m.type==='state'&&m.stage==='answer'&&m.round===0);
    for(let i=0;i<n;i++)clients[i].send({action:'submit',round:0,choice:i%2});
    for(const c of clients){
      const view=await c.next(m=>m.type==='state'&&m.stage==='reveal'&&m.round===0);
      assert.equal(view.players.length,n);assert.equal(view.completed,1);
    }
    const replacement=connection(allocation.code);await replacement.ready;clients.push(replacement);
    replacement.send({action:'resume',id:host.joined.id,token:host.joined.token,code:allocation.code});
    const newSeat=await replacement.next(m=>m.type==='joined');
    assert.notEqual(newSeat.token,host.joined.token);
    assert.equal(newSeat.id,host.joined.id);
    const thief=connection(allocation.code);await thief.ready;clients.push(thief);
    thief.send({action:'resume',id:host.joined.id,token:host.joined.token,code:allocation.code});
    assert.match((await thief.next(m=>m.type==='error')).message,/Invalid reconnect/);
    replacement.send({action:'finish'});
    await replacement.next(m=>m.type==='state'&&m.stage==='end');
    replacement.send({action:'lobby'});
    await replacement.next(m=>m.type==='state'&&m.stage==='lobby');
    replacement.send({action:'start',game:'bluff',mode:'fact',duration:'quick',language:'en'});
    await replacement.next(m=>m.type==='state'&&m.stage==='prepare'&&m.round===0);
    for(const c of clients.slice(1,n))c.send({action:'submit',round:0,text:'Wrong '+c.joined.id});
    const voted=await replacement.next(m=>m.type==='state'&&m.stage==='vote'&&m.round===0);
    assert.equal(voted.item.source,undefined,'private source before reveal');
    assert.equal(voted.item.truthIndex,undefined,'private answer position before reveal');
    replacement.send({action:'submit',round:0,choice:0});
    const reveal=await replacement.next(m=>m.type==='state'&&m.stage==='reveal'&&m.round===0);
    assert.ok(reveal.item.source?.url?.startsWith('https://'),'source available after reveal');
    if(n===4){
      replacement.send({action:'transfer',target:clients[1].joined.id});
      await clients[1].next(m=>m.type==='state'&&m.host===clients[1].joined.id&&m.isHost);
      clients[1].close();
      await replacement.next(m=>m.type==='state'&&m.host===host.joined.id&&m.isHost,26000);
      // The first still-connected seat should become host after the 15-second grace period.
    }
    results.push({seats:n,majority:'PASS',malformed_durations:'PASS',reconnect_rotation:'PASS',private_fact_projection:'PASS',host_failover:n===4?'attempted':'not tested'});
  }finally{for(const c of clients)c.close();}
}
console.log('LOCAL_WORKERD_SMOKE',JSON.stringify(results));

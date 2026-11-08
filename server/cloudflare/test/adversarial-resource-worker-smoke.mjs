// Local-only diagnostic: independent WebSockets from one loopback IP and raw
// non-reciprocating Close frames. Never contacts a public endpoint or uses R2.
import assert from 'node:assert/strict';
import net from 'node:net';
import {randomBytes} from 'node:crypto';
import {readFileSync,readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import WebSocket from 'ws';

const API='http://127.0.0.1:8787', ORIGIN='https://party.thiepn.dev';
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function reserve(){
  const r=await fetch(API+'/rooms',{method:'POST',headers:{Origin:ORIGIN,'Content-Type':'application/json'},body:'{}'});
  assert.equal(r.status,201);
  return r.json();
}
function dial(code,protocols){
  const socket=new WebSocket('ws://127.0.0.1:8787/ws?code='+code,protocols,{origin:ORIGIN,handshakeTimeout:5000});
  const queue=[],waiting=[];
  socket.on('message',raw=>{
    const message=JSON.parse(String(raw));
    const i=waiting.findIndex(w=>w.filter(message));
    if(i<0)queue.push(message);
    else {const [w]=waiting.splice(i,1);clearTimeout(w.timer);w.resolve(message);}
  });
  socket.on('error',()=>{});
  const ready=new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error('WebSocket handshake timed out')),6500);
    const done=status=>{clearTimeout(timer);resolve(status);};
    socket.once('open',()=>done(101));
    socket.once('unexpected-response',(_,r)=>{r.resume();done(r.statusCode);});
    socket.once('error',error=>{clearTimeout(timer);reject(error);});
  });
  const next=(filter=()=>true)=>{
    const i=queue.findIndex(filter);
    if(i>=0)return Promise.resolve(queue.splice(i,1)[0]);
    return new Promise((resolve,reject)=>{
      const w={filter,resolve};
      w.timer=setTimeout(()=>{const ix=waiting.indexOf(w);if(ix>=0)waiting.splice(ix,1);reject(new Error('Timed out waiting for joined/state'));},6000);
      waiting.push(w);
    });
  };
  return {socket,ready,next,send:data=>socket.send(JSON.stringify(data))};
}
const clients=[];
async function sixSeatAdmission(){
  const room=await reserve(),players=[];
  for(let i=0;i<6;i++){
    const c=dial(room.code,i===0?['chaos-room.v1','cc-create.'+room.createToken]:undefined);
    clients.push(c);
    assert.equal(await c.ready,101,'first-time seat '+i);
    c.send(i?{action:'join',name:'Seat '+i,code:room.code}:{action:'create',name:'Host',createToken:room.createToken});
    c.seat=await c.next(m=>m.type==='joined');
    players.push(c);
  }
  const flood=[];
  for(let i=0;i<5;i++){
    const x=dial(room.code);clients.push(x);assert.equal(await x.ready,101);
    flood.push(x);
  }
  const rejected=dial(room.code);clients.push(rejected);
  assert.equal(await rejected.ready,429,'an unknown first-time guest remains blocked during a saturated pool');
  const rotated=[];
  for(const old of players){
    const r=dial(room.code,['chaos-room.v1','cc-resume.'+old.seat.id+'.'+old.seat.token]);
    clients.push(r);
    assert.equal(await r.ready,101,'saved seat needs reserved reconnect capacity even behind shared IP');
    r.send({action:'resume',code:room.code,id:old.seat.id,token:old.seat.token});
    const joined=await r.next(m=>m.type==='joined');
    assert.equal(joined.id,old.seat.id);
    assert.notEqual(joined.token,old.seat.token);
    rotated.push(r);
  }
  const state=await rotated.at(-1).next(m=>m.type==='state'&&m.players?.length===6);
  assert.equal(state.players.filter(x=>x.connected).length,6);
  console.log('LOCAL_NAT_SIX_SEAT_DIAG',JSON.stringify({sourceIP:'127.0.0.1',seats:6,unverifiedFlood:5,unknownGuestStatus:429,knownSeatsReconnected:6,tokensRotated:6,knownSeatsConnected:6,limitation:'shared loopback IP, no production WAF/NAT test'}));
}
function runtimeSample(){
  const output=execFileSync('ps',['-eo','pid=,ppid=,rss=,comm='],{encoding:'utf8'});
  const table=new Map();
  for(const line of output.trim().split('\n')){
    const m=/^\s*(\d+)\s+(\d+)\s+(\d+)\s+(.+?)\s*$/.exec(line);
    if(m)table.set(Number(m[1]),{pid:Number(m[1]),parent:Number(m[2]),rssKiB:Number(m[3]),comm:m[4]});
  }
  const root=Number(process.env.WRANGLER_PID);
  assert.ok(root>0&&table.has(root),'Wrangler runtime root PID required');
  const descendant=pid=>{
    const seen=new Set();
    while(table.has(pid)&&!seen.has(pid)){
      if(pid===root)return true;
      seen.add(pid);pid=table.get(pid).parent;
    }
    return false;
  };
  const workers=[...table.values()].filter(p=>/workerd/.test(p.comm)&&descendant(p.pid));
  assert.ok(workers.length>0,'actual local workerd PID not found under Wrangler; cannot report resource measurement');
  return {rssKiB:workers.reduce((n,p)=>n+p.rssKiB,0),
    fdCount:workers.reduce((n,p)=>n+readdirSync('/proc/'+p.pid+'/fd').length,0),
    workerdProcesses:workers.length};
}
function stubbornWebSocket(code){
  const socket=net.createConnection({host:'127.0.0.1',port:8787});
  let accepted=false,closed=false,closeFrame=false,header=Buffer.alloc(0),finished=false;
  const ready=new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>reject(new Error('raw TCP WebSocket handshake timeout')),5000);
    socket.on('connect',()=>{
      const key=randomBytes(16).toString('base64');
      socket.write('GET /ws?code='+code+' HTTP/1.1\r\nHost: 127.0.0.1:8787\r\nOrigin: '+ORIGIN+'\r\nConnection: Upgrade\r\nUpgrade: websocket\r\nSec-WebSocket-Key: '+key+'\r\nSec-WebSocket-Version: 13\r\n\r\n');
    });
    socket.on('data',chunk=>{
      if(!finished){
        header=Buffer.concat([header,chunk]);
        const end=header.indexOf('\r\n\r\n');
        if(end<0)return;
        const status=/^HTTP\/1\.1 (\d+)/.exec(header.toString('utf8',0,end));
        if(!status){clearTimeout(timeout);reject(new Error('No HTTP handshake status'));return;}
        finished=true;accepted=Number(status[1])===101;
        const remaining=header.subarray(end+4);
        if(remaining.length&&(remaining[0]&15)===8)closeFrame=true;
        clearTimeout(timeout);resolve(Number(status[1]));
      }else if(chunk.length&&(chunk[0]&15)===8)closeFrame=true;
      // Deliberately no reciprocal WebSocket Close control frame: hostile peer.
    });
    socket.on('close',()=>{closed=true;if(!finished){clearTimeout(timeout);reject(new Error('TCP peer closed before handshake'));}});
    socket.on('error',e=>{if(!finished){clearTimeout(timeout);reject(e);}});
  });
  return {socket,ready,get accepted(){return accepted;},get closed(){return closed||socket.destroyed;},get closeFrame(){return closeFrame;}};
}
const raw=[];
async function closingResources(){
  const room=await reserve();
  const samples=[{phase:'baseline',...runtimeSample()}];
  for(let wave=1;wave<=3;wave++){
    const group=[];
    for(let i=0;i<5;i++){
      const x=stubbornWebSocket(room.code);raw.push(x);group.push(x);
      assert.equal(await x.ready,101,'new wave must not inherit occupied OPEN admission slots');
    }
    const end=Date.now()+16000;
    while(group.some(x=>!x.closed&&!x.closeFrame)&&Date.now()<end)await delay(250);
    assert.ok(group.every(x=>x.closed||x.closeFrame),'pending sockets must be expired by a real local alarm');
    samples.push({phase:'wave'+wave,seenCloseFrames:raw.filter(x=>x.closeFrame).length,retainedTCP:raw.filter(x=>!x.closed).length,...runtimeSample()});
  }
  for(const x of raw)x.socket.destroy();
  await delay(1500);
  samples.push({phase:'afterClientRelease',retainedTCP:raw.filter(x=>!x.closed).length,...runtimeSample()});
  console.log('LOCAL_CLOSING_RESOURCE_DIAG',JSON.stringify({samples,attempted:raw.length,note:'finite three-wave observation, not proof of a global resource bound'}));
}
try{
  await sixSeatAdmission();
  await closingResources();
}finally{
  for(const x of clients)try{x.socket.terminate();}catch{}
  for(const x of raw)try{x.socket.destroy();}catch{}
}

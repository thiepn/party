// Local-only WebSocket admission regression. No remote endpoints.
import assert from 'node:assert/strict';
import WebSocket from 'ws';
const API='http://127.0.0.1:8787', ORIGIN='https://party.thiepn.dev';
async function dial(code,protocols){
  const url=API.replace('http','ws')+'/ws?code='+code;
  const ws=new WebSocket(url,protocols,{origin:ORIGIN,handshakeTimeout:5000});
  return await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error('Handshake timeout')),6500);
    const finish=result=>{clearTimeout(timer);resolve(result);};
    ws.once('open',()=>finish({status:101,ws}));
    ws.once('unexpected-response',(_,res)=>{res.resume();finish({status:res.statusCode,ws});});
    ws.once('error',error=>finish({status:0,error:error.message,ws}));
  });
}
const created=await fetch(API+'/rooms',{method:'POST',headers:{Origin:ORIGIN,'content-type':'application/json'},body:'{}'});
assert.equal(created.status,201);
const room=await created.json(),opened=[];
try{
  for(let i=0;i<16;i++){
    const result=await dial(room.code);
    if(result.status===101)opened.push(result.ws);
    else assert.equal(result.status,429,'pending room connections must be bounded');
  }
  assert.ok(opened.length<=5,'unverified connections must have an independent limit of five');
  const trusted=await dial(room.code,['chaos-room.v1','cc-create.'+room.createToken]);
  assert.equal(trusted.status,101,'holder of the secret createToken must still connect during an unauthenticated flood');
  opened.push(trusted.ws);
  let sawJoined=false;
  const joined=new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error('Host did not join through reserved capacity')),5000);
    trusted.ws.on('message',m=>{const d=JSON.parse(String(m));if(d.type==='joined'){sawJoined=true;clearTimeout(timer);resolve(d);}else if(d.type==='error'){clearTimeout(timer);reject(new Error(d.message));}});
  });
  trusted.ws.send(JSON.stringify({action:'create',name:'Host',createToken:room.createToken}));
  const seat=await joined;
  assert.equal(seat.code,room.code);assert.equal(sawJoined,true);
  // One alarm, not a recurring JS timer, reclaims idle guest sockets.
  // This also checks that an established host stays usable across an idle span;
  // it is not by itself proof that the Durable Object was actually evicted.
  const startedWaiting=Date.now();
  const timeoutAt=startedWaiting+20000;
  while(opened.slice(0,5).some(ws=>ws.readyState!==WebSocket.CLOSED)&&Date.now()<timeoutAt)
    await new Promise(resolve=>setTimeout(resolve,250));
  const states=opened.slice(0,5).map(ws=>ws.readyState);
  console.log('ADMISSION_IDLE_DIAG',JSON.stringify({waitedMs:Date.now()-startedWaiting,states}));
  assert.ok(states.every(s=>s===WebSocket.CLOSED),
    'idle unauthenticated sockets must close within a bounded alarm interval');
  const reopened=await dial(room.code);
  assert.equal(reopened.status,101,'new guest can connect after idle admission sockets expire');
  opened.push(reopened.ws);
  assert.equal(trusted.ws.readyState,WebSocket.OPEN,'authenticated host must remain connected');
  const stillActive=new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error('Authenticated host stopped responding after idle span')),4000);
    trusted.ws.once('message',raw=>{clearTimeout(timer);resolve(JSON.parse(String(raw)));});
  });
  trusted.ws.send(JSON.stringify({action:'start',game:'social',mode:'majority',duration:'quick'}));
  assert.match((await stillActive).message,/Start requires 4/i);
  console.log('ADMISSION_IDLE_RECOVERY_PASS',JSON.stringify({pendingExpired:5,newGuestAccepted:true,hostResponsive:true}));
  console.log('ADMISSION_FLOOD_PASS',JSON.stringify({unverifiedAccepted:opened.length-1,unverifiedRefused:16-(opened.length-1),hostRecovered:true}));
}finally{for(const ws of opened)try{ws.terminate();}catch{}}

import test from 'node:test';import assert from 'node:assert/strict';
import prompts from '../src/public-prompts.json' with {type:'json'};
const privateData=Object.fromEntries(prompts.bluff.fact.map((f,i)=>[f.factId,{answer:{en:`Fixture answer ${i}`,de:`Testantwort ${i}`},source:{name:'Testing fixture',url:'https://example.invalid/facts'}}]));
class TestSocket {constructor(){this.messages=[];this.attachment={};this.closed=false;}serializeAttachment(a){this.attachment=a;}deserializeAttachment(){return this.attachment;}send(text){this.peer.messages.push(JSON.parse(text));}close(){this.closed=true;}}
globalThis.WebSocketPair=class {constructor(){const client=new TestSocket(),server=new TestSocket();client.peer=server;server.peer=client;return {0:client,1:server};}};
const NativeResponse=globalThis.Response;
globalThis.Response=class extends NativeResponse {constructor(body,opts={}){if(opts.status===101){super(null,{status:200,headers:opts.headers});Object.defineProperty(this,'status',{value:101});this.webSocket=opts.webSocket;}else super(body,opts);}};
const {default:worker,PartyRoom}=await import('../src/worker.mjs');
class FakeStore {constructor(){this.kv=new Map();this.alarm=null;}async get(k){return structuredClone(this.kv.get(k));}async put(k,v){this.kv.set(k,structuredClone(v));}async delete(k){this.kv.delete(k);}async setAlarm(t){this.alarm=t;}async deleteAll(){this.kv.clear();}}
class FakeCtx {constructor(code){this.id={toString:()=>code};this.storage=new FakeStore();this.sockets=[];}blockConcurrencyWhile(fn){return fn();}acceptWebSocket(ws){this.sockets.push(ws);}getWebSockets(){return this.sockets.filter(x=>!x.closed);}}
class TestEnv {constructor(){this.rooms=new Map();this.FACTS={get:async path=>path==='chaos-club/room-facts.json'?{json:async()=>privateData}:null};this.ALLOW_LOCAL_DEV='false';this.ROOMS={idFromName:x=>x,get:code=>{if(!this.rooms.has(code)){const ctx=new FakeCtx(code);this.rooms.set(code,{ctx,room:new PartyRoom(ctx,this)});}return {fetch:req=>this.rooms.get(code).room.fetch(req)};}};}}
function request(url,opts={}){return new Request(url,{...opts,headers:{Origin:'https://party.thiepn.dev',...(opts.headers||{})}});}
async function init(env){const r=await worker.fetch(request('https://rooms.party.thiepn.dev/rooms',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}),env);assert.equal(r.status,201);const obj=await r.json();assert.match(obj.code,/^[A-HJ-NP-Z2-9]{8}$/);return obj;}
async function connect(env,code){const res=await worker.fetch(request(`https://rooms.party.thiepn.dev/ws?code=${code}`,{headers:{Upgrade:'websocket'}}),env);assert.equal(res.status,101);const cli=res.webSocket;const server=cli.peer;const room=env.rooms.get(code).room;const send=async m=>{await room.webSocketMessage(server,JSON.stringify(m));return cli.messages.at(-1);};return {cli,server,room,send};}
function pop(c,type){const found=c.cli.messages.filter(m=>m.type===type);assert.ok(found.length,'Missing '+type);return found.at(-1);}
test('create and join 4–6 via gateway, no accounts, private tokens and no hidden data until reveal',async()=>{const env=new TestEnv();const room=await init(env),clients=[];for(let i=0;i<6;i++){const c=await connect(env,room.code);await c.send(i===0?{action:'create',name:'A',createToken:room.createToken}:{action:'join',name:`Player${i}`,code:room.code});clients.push(c);}const first=pop(clients[0],'joined');assert.ok(first.token.length>=32);const pre=pop(clients[3],'state');assert.equal(pre.players.length,6);assert.ok(!JSON.stringify(pre).includes('createToken'));assert.ok(!JSON.stringify(pre).includes(first.token));await clients[0].send({action:'start',game:'social',mode:'majority',duration:'quick',language:'en'});assert.equal(pop(clients[0],'state').stage,'answer');for(const [i,c] of clients.entries())await c.send({action:'submit',round:0,choice:i%2});assert.equal(pop(clients[2],'state').stage,'reveal');assert.equal(clients[0].room.core.s.completed,1);});
test('strict origin and input constraints reject cross-site room creation',async()=>{const env=new TestEnv();for(const origin of [null,'https://evil.example','http://party.thiepn.dev']){const h=origin?{Origin:origin}:{};const r=await worker.fetch(new Request('https://rooms.party.thiepn.dev/rooms',{method:'POST',headers:h,body:'{}'}),env);assert.equal(r.status,403);}const r=await worker.fetch(request('https://rooms.party.thiepn.dev/ws?code=!!!!!',{headers:{Upgrade:'websocket'}}),env);assert.equal(r.status,400);});
test('resume rotates token and invalidates replaced tab without losing draft or score',async()=>{const env=new TestEnv(),room=await init(env),clients=[];for(let i=0;i<4;i++){const c=await connect(env,room.code);await c.send(i?{action:'join',code:room.code,name:'P'+i}:{action:'create',name:'Host',createToken:room.createToken});clients.push(c);}const host=pop(clients[0],'joined');const replacement=await connect(env,room.code);await replacement.send({action:'resume',code:room.code,id:host.id,token:host.token});const next=pop(replacement,'joined');assert.notEqual(host.token,next.token);assert.equal(clients[0].server.closed,true);await clients[0].send({action:'start',game:'social',mode:'majority',duration:'quick'});assert.equal(pop(clients[0],'error').message,'Connection replaced.');await replacement.send({action:'start',game:'social',mode:'majority',duration:'quick'});assert.equal(pop(replacement,'state').stage,'answer');const theft=await connect(env,room.code);await theft.send({action:'resume',code:room.code,id:host.id,token:host.token});assert.match(pop(theft,'error').message,/Invalid reconnect/);});
test('host transfer and no unmarked client ownership of actions',async()=>{const env=new TestEnv(),room=await init(env),clients=[];for(let i=0;i<4;i++){const c=await connect(env,room.code);await c.send(i?{action:'join',code:room.code,name:'P'+i}:{action:'create',name:'Host',createToken:room.createToken});clients.push(c);}const p1=pop(clients[1],'joined').id;await clients[1].send({action:'start',game:'social',mode:'mixed',duration:'quick'});assert.match(pop(clients[1],'error').message,/host/);await clients[0].send({action:'transfer',target:p1});assert.equal(pop(clients[1],'state').host,p1);await clients[1].send({action:'start',game:'social',mode:'majority',duration:'quick'});assert.equal(pop(clients[0],'state').stage,'answer');});
test('Fact Trap private truth not exposed through public request, is revealed only at end',async()=>{const env=new TestEnv(),room=await init(env),clients=[];for(let i=0;i<4;i++){const c=await connect(env,room.code);await c.send(i?{action:'join',code:room.code,name:'P'+i}:{action:'create',name:'Host',createToken:room.createToken});clients.push(c);}await clients[0].send({action:'start',game:'bluff',mode:'fact',duration:'quick',language:'en'});const s=clients[0].room.core.s,guess=s.featured,truth=s.item.answer.en;const players=s.players;const guessClient=clients[players.findIndex(p=>p.id===guess)];for(const c of clients){if(pop(c,'joined').id!==guess)await c.send({action:'submit',round:0,text:`Bluff-${pop(c,'joined').id}`});}
 for(const c of clients){const st=pop(c,'state');assert.equal(st.stage,'vote');assert.equal(st.item.truthIndex,undefined);assert.equal(st.item.source,undefined);assert.ok(!JSON.stringify(st).includes('answerOwners'));}await guessClient.send({action:'submit',round:0,choice:s.truthAt});const reveal=pop(guessClient,'state');assert.equal(reveal.stage,'reveal');assert.ok(JSON.stringify(reveal.item.choices).includes(truth));});
test('five independent browser seats complete Same Brain scoring with normalization',async()=>{
  const env=new TestEnv(),room=await init(env),clients=[];
  for(let i=0;i<5;i++){const c=await connect(env,room.code);await c.send(i?{action:'join',code:room.code,name:'P'+i}:{action:'create',name:'Host',createToken:room.createToken});clients.push(c);}
  await clients[0].send({action:'start',game:'social',mode:'same',duration:'quick'});
  for(const [i,c] of clients.entries())await c.send({action:'submit',round:0,text:i===4?'Tacos':i===0?'PIZZA!':'pizza'});
  const result=pop(clients[0],'state');assert.equal(result.stage,'reveal');
  for(let i=0;i<5;i++)assert.equal(result.players[i].points,i===4?0:3);
  assert.equal(clients[0].room.core.s.completed,1);
});
test('hibernation reconstruction and 15-second disconnected-host failover recover an active room',async()=>{
  const env=new TestEnv(),room=await init(env),clients=[];
  for(let i=0;i<4;i++){const c=await connect(env,room.code);await c.send(i?{action:'join',code:room.code,name:'P'+i}:{action:'create',name:'Host',createToken:room.createToken});clients.push(c);}
  const originalHost=pop(clients[0],'joined').id;
  await clients[0].send({action:'start',game:'social',mode:'majority',duration:'quick'});
  // Simulate Cloudflare hibernation: persistent room storage and socket attachments survive.
  const ctx=env.rooms.get(room.code).ctx;
  const restored=new PartyRoom(ctx,env);await restored.ready;
  assert.equal(restored.core.s.players.length,4);assert.equal(restored.core.s.host,originalHost);
  assert.equal(restored.core.s.players.every(p=>p.connected),true);
  clients[0].server.close();await restored.webSocketClose(clients[0].server);
  assert.equal(restored.core.s.players[0].connected,false);
  assert.ok(restored.core.s.hostDisconnectedAt);
  restored.core.s.hostDisconnectedAt=Date.now()-16000;
  await restored.alarm();
  assert.equal(restored.core.s.host,pop(clients[1],'joined').id);
  await restored.webSocketMessage(clients[1].server,JSON.stringify({action:'skip'}));
  assert.equal(pop(clients[1],'state').stage,'answer');
  assert.equal(restored.core.s.round,1);
});
 // Regression: connected rooms must not incur an alarm every second after the idle TTL.
test('idle but connected rooms schedule max-age alarm without a one-second loop',async()=>{
  const env=new TestEnv(),reservation=await init(env),clients=[];
  for(let i=0;i<4;i++){const c=await connect(env,reservation.code);await c.send(i?{action:'join',name:'P'+i}:{action:'create',name:'Host',createToken:reservation.createToken});clients.push(c);}
  const room=clients[0].room,now=Date.now();
  room.createdAt=now-2*60*60*1000-60*1000;
  room.core.s.modifiedAt=now-2*60*60*1000-30*1000;
  await room.alarm();
  assert.ok(room.ctx.storage.alarm>now+60*60*1000,'unexpected frequent alarm for an idle room with connected seats');
  assert.equal(room.core.s.players.length,4);
});
test('offline rooms retain idle-TTL cleanup and disconnected hosts keep 15-second grace',async()=>{
  const env=new TestEnv(),reservation=await init(env),clients=[];
  for(let i=0;i<4;i++){const c=await connect(env,reservation.code);await c.send(i?{action:'join',name:'P'+i}:{action:'create',name:'Host',createToken:reservation.createToken});clients.push(c);}
  const room=clients[0].room,now=Date.now();
  await room.handleClose(clients[0].server);
  assert.ok(room.ctx.storage.alarm>=now+14_000&&room.ctx.storage.alarm<=now+16_000,'host handoff needs a 15s alarm');
  for(const c of clients.slice(1))await room.handleClose(c.server);
  assert.ok(room.ctx.storage.alarm>=Date.now()+2*60*60*1000-1500,'all-offline room must retain 2h idle cleanup');
});

test('room client links one-phone play to the Vercel static root',async()=>{
  const {readFileSync}=await import('node:fs');
  const client=readFileSync(new URL('../../../public/room/client.js',import.meta.url),'utf8');
  assert.match(client,/href="\/" class="chip"/,'the static app is deployed at /, not /offline');
  assert.doesNotMatch(client,/href="\/offline"/);
});

test('a guest joining before host creation cannot seize the reserved room',async()=>{
  const env=new TestEnv(),reservation=await init(env);
  const guest=await connect(env,reservation.code);
  await guest.send({action:'join',name:'Early guest'});
  assert.match(pop(guest,'error').message,/host/i);
  assert.equal(guest.room.core.s.players.length,0);
  const host=await connect(env,reservation.code);
  await host.send({action:'create',createToken:reservation.createToken,name:'Host'});
  assert.equal(pop(host,'joined').code,reservation.code);
  await guest.send({action:'join',name:'Early guest'});
  assert.equal(pop(guest,'joined').code,reservation.code);
  assert.equal(host.room.core.s.players.length,2);
});

test('restoration starts host failover when host socket vanished before close could persist',async()=>{
  const env=new TestEnv(),reservation=await init(env),clients=[];
  for(let i=0;i<4;i++){
    const c=await connect(env,reservation.code);
    await c.send(i?{action:'join',name:'P'+i}:{action:'create',name:'Host',createToken:reservation.createToken});
    clients.push(c);
  }
  const hostId=pop(clients[0],'joined').id;
  await clients[0].send({action:'start',game:'social',mode:'majority',duration:'quick'});
  const ctx=env.rooms.get(reservation.code).ctx;
  // Model an unexpected shutdown between the socket loss and a close callback:
  // storage has the prior connected state, but this socket is absent on restart.
  clients[0].server.close();
  const recovered=new PartyRoom(ctx,env);await recovered.ready;
  assert.equal(recovered.core.player(hostId).connected,false);
  assert.ok(recovered.core.s.hostDisconnectedAt,'host failover deadline must be restored');
  assert.ok(ctx.storage.alarm<=Date.now()+16_000,'host failover alarm should be scheduled promptly');
  recovered.core.s.hostDisconnectedAt=Date.now()-16_000;
  await recovered.alarm();
  assert.equal(recovered.core.s.host,pop(clients[1],'joined').id);
});

test('storage write failure must not broadcast an uncommitted host transfer',async()=>{
  const env=new TestEnv(),reservation=await init(env),clients=[];
  for(let i=0;i<4;i++){
    const c=await connect(env,reservation.code);
    await c.send(i?{action:'join',name:'P'+i}:{action:'create',name:'Host',createToken:reservation.createToken});
    clients.push(c);
  }
  const target=pop(clients[1],'joined').id;
  const initial=clients[1].cli.messages.length;
  const store=clients[0].room.ctx.storage;
  const originalPut=store.put.bind(store);
  store.put=async()=>{throw new Error('INJECTED_STORAGE_FAILURE');};
  try{
    await clients[0].send({action:'transfer',target});
    assert.equal(clients[1].cli.messages.slice(initial).filter(m=>m.type==='state'&&m.host===target).length,0,
      'never publish a new host before durable storage confirms it');
    assert.equal(pop(clients[0],'error').message,'Invalid room operation.');
    assert.notEqual(clients[0].room.core.s.host,target,'failed storage write must roll back in-memory host');
  }finally{store.put=originalPut;}
});

test('storage write failure must not disclose an unpersisted seat token',async()=>{
  const env=new TestEnv(),reservation=await init(env);
  const guest=await connect(env,reservation.code);
  const store=guest.room.ctx.storage,originalPut=store.put.bind(store);
  store.put=async()=>{throw new Error('INJECTED_STORAGE_FAILURE');};
  try{
    await guest.send({action:'create',name:'Host',createToken:reservation.createToken});
    assert.equal(guest.cli.messages.filter(m=>m.type==='joined').length,0,
      'do not return a seat credential before persistence succeeds');
    assert.equal(pop(guest,'error').message,'Invalid room operation.');
    assert.equal(guest.room.core.s.players.length,0,'failed seat write must remove unpersisted player');
    assert.equal(guest.room.createToken,reservation.createToken,'failed create must restore reservation credential');
  }finally{store.put=originalPut;}
});

test('unverified socket budget, forged proofs and idle expiry preserve authenticated host capacity',async()=>{
  const env=new TestEnv(),reservation=await init(env),pending=[];
  const wsUrl='https://rooms.party.thiepn.dev/ws?code='+reservation.code;
  for(let i=0;i<5;i++)pending.push(await connect(env,reservation.code));
  const denied=await worker.fetch(request(wsUrl,{headers:{Upgrade:'websocket'}}),env);
  assert.equal(denied.status,429,'sixth unverified socket must not be accepted');
  for(const proof of ['cc-create.'+'f'.repeat(64),'cc-resume.00000000-0000-0000-0000-000000000000.'+'f'.repeat(64)]){
    const rejected=await worker.fetch(request(wsUrl,{headers:{Upgrade:'websocket','Sec-WebSocket-Protocol':'chaos-room.v1, '+proof}}),env);
    assert.equal(rejected.status,403,'forged credential must not receive reserved capacity');
  }
  const hostResponse=await worker.fetch(request(wsUrl,{headers:{Upgrade:'websocket','Sec-WebSocket-Protocol':'chaos-room.v1, cc-create.'+reservation.createToken}}),env);
  assert.equal(hostResponse.status,101,'valid host must bypass five idle unverified sockets');
  assert.equal(hostResponse.headers.get('Sec-WebSocket-Protocol'),'chaos-room.v1');
  const room=env.rooms.get(reservation.code).room,server=hostResponse.webSocket.peer;
  await room.webSocketMessage(server,JSON.stringify({action:'create',name:'Host',createToken:reservation.createToken}));
  assert.equal(hostResponse.webSocket.messages.at(-2)?.type,'joined');
  const id=hostResponse.webSocket.messages.find(m=>m.type==='joined').id;
  const token=hostResponse.webSocket.messages.find(m=>m.type==='joined').token;
  const validResume=await worker.fetch(request(wsUrl,{headers:{Upgrade:'websocket','Sec-WebSocket-Protocol':'chaos-room.v1, cc-resume.'+id+'.'+token}}),env);
  assert.equal(validResume.status,101,'existing seat must be able to reconnect despite pending flood');
  for(const c of pending){
    const old=c.server.deserializeAttachment();
    c.server.serializeAttachment({...old,openedAt:Date.now()-11000});
  }
  await room.alarm();
  assert.ok(pending.every(c=>c.server.closed),'idle unauthenticated WebSockets must be closed by alarm');
  assert.equal(server.closed,false,'host must not be closed by pending-connection cleanup');
  const next=await worker.fetch(request(wsUrl,{headers:{Upgrade:'websocket'}}),env);
  assert.equal(next.status,101,'expired pending sockets must release room capacity');
});

test('slower private R2 loading allows a join without partially starting the room',async()=>{
  const env=new TestEnv(),reservation=await init(env),clients=[];
  for(let i=0;i<4;i++){
    const c=await connect(env,reservation.code);
    await c.send(i?{action:'join',name:'P'+i}:{action:'create',name:'Host',createToken:reservation.createToken});
    clients.push(c);
  }
  let unblock,started;
  const requested=new Promise(resolve=>{started=resolve;});
  env.FACTS.get=async()=>{started();return await new Promise(resolve=>{unblock=()=>resolve({json:async()=>privateData});});};
  const starting=clients[0].send({action:'start',game:'social',mode:'majority',duration:'quick'});
  await requested;
  const guest=await connect(env,reservation.code);
  await guest.send({action:'join',name:'P4'});
  assert.equal(clients[0].room.core.s.stage,'lobby');
  assert.equal(clients[0].room.core.s.players.length,5);
  unblock();await starting;
  assert.equal(clients[0].room.core.s.stage,'answer');
  assert.equal(clients[0].room.core.s.players.length,5);
  assert.equal(pop(guest,'state').players.length,5);
});

test('alarm scheduling failure must not durably orphan a join without credentials',async()=>{
  const env=new TestEnv(),reservation=await init(env),host=await connect(env,reservation.code);
  await host.send({action:'create',name:'Host',createToken:reservation.createToken});
  const first=pop(host,'joined');
  const guest=await connect(env,reservation.code);
  const store=guest.room.ctx.storage,previous=await store.get('room');
  const original=store.setAlarm.bind(store);
  store.setAlarm=async()=>{throw new Error('INJECTED_ALARM_FAILURE');};
  try{
    await guest.send({action:'join',name:'Guest'});
    assert.equal(guest.cli.messages.filter(m=>m.type==='joined').length,0,'failed scheduling must not issue credentials');
    assert.equal(pop(guest,'error').message,'Invalid room operation.');
    assert.equal(guest.room.core.s.players.length,1,'failed join must roll back in memory');
    assert.deepEqual((await store.get('room')).players.map(p=>p.id),previous.players.map(p=>p.id),
      'failed join must not consume a durable seat without returning its token');
    assert.equal(guest.room.core.s.host,first.id,'host must remain unchanged');
  }finally{store.setAlarm=original;}
  await guest.send({action:'join',name:'Guest'});
  assert.equal(pop(guest,'joined').code,reservation.code,'guest can retry after temporary alarm failure');
  assert.equal(guest.room.core.s.players.length,2);
});

test('private R2 outage fails closed without changing game or score and allows recovery',async()=>{
  const env=new TestEnv(),reservation=await init(env),clients=[];
  for(let i=0;i<4;i++){
    const c=await connect(env,reservation.code);
    await c.send(i?{action:'join',name:'P'+i}:{action:'create',name:'Host',createToken:reservation.createToken});
    clients.push(c);
  }
  const room=clients[0].room,before=await room.ctx.storage.get('room');
  const originalGet=env.FACTS.get.bind(env.FACTS);
  env.FACTS.get=async()=>{throw new Error('SYNTHETIC_PRIVATE_R2_UNAVAILABLE');};
  try{
    await clients[0].send({action:'start',game:'bluff',mode:'fact',duration:'quick',language:'en'});
    assert.equal(pop(clients[0],'error').message,'Invalid room operation.');
    assert.equal(room.core.s.stage,'lobby','failed private data load must leave lobby unchanged');
    assert.equal(room.core.s.completed,0);
    const after=await room.ctx.storage.get('room');
    assert.deepEqual(after.players.map(p=>p.points),before.players.map(p=>p.points),'no score mutation on R2 failure');
    assert.equal(after.stage,'lobby','no partially persisted game start');
  }finally{env.FACTS.get=originalGet;}
  await clients[0].send({action:'start',game:'bluff',mode:'fact',duration:'quick',language:'en'});
  const view=pop(clients[0],'state');
  assert.equal(view.stage,'prepare');
  assert.equal(view.players.length,4);
  assert.equal(view.item.source,undefined,'private source must remain hidden before reveal');
});

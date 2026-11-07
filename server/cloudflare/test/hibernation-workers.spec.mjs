// Run only in the isolated Cloudflare Workers Vitest runtime, never against remote resources.
import {env} from 'cloudflare:workers';
import {evictDurableObject} from 'cloudflare:test';
import {test,expect} from 'vitest';
import prompts from '../src/public-prompts.json' with {type:'json'};

function listen(socket) {
  const queued=[],waiting=[];
  socket.addEventListener('message',event=>{
    const m=JSON.parse(event.data);
    const index=waiting.findIndex(w=>w.filter(m));
    if(index>=0){const [w]=waiting.splice(index,1);clearTimeout(w.timer);w.resolve(m);}
    else queued.push(m);
  });
  return {
    socket,
    send:(body)=>socket.send(JSON.stringify(body)),
    next:(filter=()=>true)=>{
      const i=queued.findIndex(filter);
      if(i>=0)return Promise.resolve(queued.splice(i,1)[0]);
      return new Promise((resolve,reject)=>{
        const w={filter,resolve};
        w.timer=setTimeout(()=>{
          const i=waiting.indexOf(w);if(i>=0)waiting.splice(i,1);
          reject(new Error('Timed out waiting for a socket message'));
        },8000);
        waiting.push(w);
      });
    }
  };
}

test('actual workerd eviction preserves four live sockets, attachments and scores',async()=>{
  const code='ABCD2345',createToken='a'.repeat(64);
  const stub=env.ROOMS.get(env.ROOMS.idFromName(code));
  const init=await stub.fetch('https://room.internal/init',{method:'POST',headers:{'X-Create-Token':createToken,'X-Room-Code':code}});
  expect(init.status).toBe(201);
  const fixture=Object.fromEntries(prompts.bluff.fact.map((x,i)=>[
    x.factId,{answer:{en:'Synthetic truth '+i,de:'Synthetisch '+i},source:{name:'Offline fixture',url:'https://example.invalid/test'}}
  ]));
  await env.FACTS.put('chaos-club/room-facts.json',JSON.stringify(fixture));
  const clients=[];
  try{
    for(let i=0;i<4;i++){
      const res=await stub.fetch('https://room.internal/socket',{headers:{Upgrade:'websocket','X-Room-Code':code}});
      expect(res.status).toBe(101);
      const socket=res.webSocket;
      expect(socket).toBeDefined();
      socket.accept();
      const c=listen(socket);
      clients.push(c);
      c.send(i?{action:'join',name:'P'+i}:{action:'create',name:'Host',createToken});
      c.joined=await c.next(m=>m.type==='joined');
      await c.next(m=>m.type==='state'&&m.players.length===i+1);
    }
    clients[0].send({action:'start',game:'social',mode:'majority',duration:'quick',language:'en'});
    await clients[0].next(m=>m.type==='state'&&m.stage==='answer'&&m.round===0);
    // A real runtime teardown (not a manual new PartyRoom in a mock) while
    // WebSocket transport remains open and socket attachments remain valid.
    await evictDurableObject(stub,{webSockets:'hibernate'});
    expect(clients.every(c=>c.socket.readyState===WebSocket.OPEN)).toBe(true);
    for(let i=0;i<4;i++)clients[i].send({action:'submit',round:0,choice:i%2});
    const final=await Promise.all(clients.map(c=>c.next(m=>m.type==='state'&&m.stage==='reveal'&&m.round===0)));
    for(const state of final){
      expect(state.players.length).toBe(4);
      expect(state.completed).toBe(1);
      expect(state.players.every(p=>Number.isInteger(p.points))).toBe(true);
    }
    expect(final.every(m=>JSON.stringify(m.players.map(p=>p.points))===JSON.stringify(final[0].players.map(p=>p.points)))).toBe(true);
    console.log('TRUE_EVICTION_LIVE_WEBSOCKETS_PASS',JSON.stringify({seats:4,completed:1,transportPreserved:true}));
  }finally{
    for(const c of clients)try{c.socket.close(1000,'Test complete');}catch{}
  }
},20000);

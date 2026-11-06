/** CHAOS CLUB online room gateway. NOT deployed: missing private R2 fact bundle & acceptance gates. */
import prompts from './public-prompts.json' with {type:'json'};
import {RoomCore,RoomError,safeString} from './room-core.mjs';
const ROOM_RE=/^[A-HJ-NP-Z2-9]{8}$/;const CHARS='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const TTL=2*60*60*1000,MAX_AGE=12*60*60*1000,FAILOVER=15*1000;
function randomCode(){const bytes=new Uint8Array(8);crypto.getRandomValues(bytes);return [...bytes].map(x=>CHARS[x%CHARS.length]).join('');}
function secret(){const v=new Uint8Array(32);crypto.getRandomValues(v);return [...v].map(x=>x.toString(16).padStart(2,'0')).join('');}
function allowedOrigin(req,env){const v=req.headers.get('Origin');const allowed=new Set(['https://party.thiepn.dev']);if(env.ALLOW_LOCAL_DEV==='true')for(const x of ['http://localhost:8080','http://127.0.0.1:8080'])allowed.add(x);return v&&allowed.has(v)?v:null;}
function response(j,status=200,origin=null){const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};if(origin){headers['Access-Control-Allow-Origin']=origin;headers['Access-Control-Allow-Methods']='POST, OPTIONS';headers['Access-Control-Allow-Headers']='content-type';headers['Vary']='Origin';}return new Response(JSON.stringify(j),{status,headers});}
export default {async fetch(req,env){const url=new URL(req.url);if(url.pathname==='/health'&&req.method==='GET')return response({status:'ok'});
    const origin=allowedOrigin(req,env);if(!origin)return response({error:'Forbidden origin'},403);
    if(url.pathname==='/rooms'&&req.method==='OPTIONS')return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'content-type','Access-Control-Max-Age':'600','Vary':'Origin'}});
    if(url.pathname==='/rooms'&&req.method==='POST'){
      // Local abuse limits cannot be safely implemented with per-isolate memory.
      // Configure Cloudflare WAF / account rate limits before exposing this endpoint.
      if(Number(req.headers.get('content-length')||0)>2048)return response({error:'Request too large'},413,origin);
      for(let attempt=0;attempt<5;attempt++){const code=randomCode(),createToken=secret();const id=env.ROOMS.idFromName(code),stub=env.ROOMS.get(id);const r=await stub.fetch(new Request('https://room.internal/init',{method:'POST',headers:{'X-Create-Token':createToken,'X-Room-Code':code}}));if(r.status===201)return response({code,createToken},201,origin);if(r.status!==409)return response({error:'Room unavailable'},503,origin);}
      return response({error:'Could not allocate a room'},503,origin);
    }
    if(url.pathname==='/ws'&&req.method==='GET'&&req.headers.get('Upgrade')?.toLowerCase()==='websocket'){
      const code=(url.searchParams.get('code')||'').toUpperCase();if(!ROOM_RE.test(code))return response({error:'Invalid room code'},400,origin);
      return env.ROOMS.get(env.ROOMS.idFromName(code)).fetch(new Request('https://room.internal/socket',{headers:{Upgrade:'websocket','X-Room-Code':code}}));
    }
    return response({error:'Not found'},404,origin);
}};
export class PartyRoom {
  constructor(ctx,env){this.ctx=ctx;this.env=env;this.core=null;this.createToken=null;this.createdAt=0;this.facts=null;
    this.ready=ctx.blockConcurrencyWhile(async()=>{const raw=await ctx.storage.get('room'),init=await ctx.storage.get('init');if(raw){this.core=new RoomCore(raw.code,{},raw);this.createdAt=raw.createdAt||Date.now();this.createToken=raw.createToken||null;this.restoreConnections();
      // After a crash/hibernation a host socket can be gone without its close
      // handler having persisted the failover timestamp. Restore the deadline.
      const host=this.core.player(this.core.s.host);
      if(host&&!host.connected&&!this.core.s.hostDisconnectedAt){this.core.s.hostDisconnectedAt=Date.now();await this.save();}
    }else if(init){this.createToken=init.token;this.createdAt=init.createdAt;this.pendingCode=init.code;}});
  }
  restoreConnections(){if(!this.core)return;const s=this.core.s;for(const p of s.players)p.connected=false;
    for(const ws of this.ctx.getWebSockets()){const a=ws.deserializeAttachment();if(!a?.pid||!a?.nonce)continue;const p=this.core.player(a.pid);if(p&&p.nonce===a.nonce)p.connected=true;}
  }
  async getContent(){if(this.content)return this.content;const base=structuredClone(prompts);const file=await this.env.FACTS.get('chaos-club/room-facts.json');if(!file)throw new RoomError('Private Fact Trap content not configured.');const facts=await file.json();for(const x of base.bluff.fact){const f=facts[x.factId];if(!f?.answer?.en||!f?.answer?.de||!f?.source)throw new RoomError('Incomplete private facts.');x.answer=f.answer;x.source=f.source;}this.content=base;return base;}
  async save(){if(!this.core)return;const s=this.core.s;s.createdAt=this.createdAt;s.createToken=this.createToken;await this.ctx.storage.put('room',s);await this.schedule();}
  async schedule(){const s=this.core?.s;if(!s)return;const connected=s.players.some(p=>p.connected);let due=this.createdAt+MAX_AGE;
    // Idle TTL only expires rooms without connected seats. Scheduling it for an active room
    // would cause a repeated one-second alarm after two hours of no state changes.
    if(!connected)due=Math.min(due,s.modifiedAt+TTL);
    if(connected&&s.hostDisconnectedAt)due=Math.min(due,s.hostDisconnectedAt+FAILOVER);
    await this.ctx.storage.setAlarm(Math.max(Date.now()+1000,due));}
  async fetch(req){await this.ready;const url=new URL(req.url);
    if(url.pathname==='/init'&&req.method==='POST'){if(this.core||this.createToken)return new Response(null,{status:409});const t=req.headers.get('X-Create-Token'),code=req.headers.get('X-Room-Code');if(!t||t.length!==64||!ROOM_RE.test(code||''))return new Response(null,{status:400});this.createToken=t;this.pendingCode=code;this.createdAt=Date.now();await this.ctx.storage.put('init',{token:t,createdAt:this.createdAt,code});await this.ctx.storage.setAlarm(Date.now()+TTL);return new Response(null,{status:201});}
    if(url.pathname==='/socket'){const code=req.headers.get('X-Room-Code');if(!ROOM_RE.test(code||''))return new Response('Invalid code',{status:400});if(!this.core){if(!this.createToken||this.pendingCode!==code)return new Response('Room not found',{status:404});this.core=new RoomCore(code,{});await this.ctx.storage.delete('init');await this.save();}if(this.core.s.code!==code)return new Response('Wrong room',{status:403});if(Date.now()-this.createdAt>MAX_AGE)return new Response('Room expired',{status:410});if(this.ctx.getWebSockets().length>12)return new Response('Room connections full',{status:429});const pair=new WebSocketPair(),[client,server]=Object.values(pair);this.ctx.acceptWebSocket(server);server.serializeAttachment({pid:null,nonce:null});return new Response(null,{status:101,webSocket:client});}
    return new Response('Not found',{status:404});
  }
  wsFor(p){return this.ctx.getWebSockets().find(ws=>{const a=ws.deserializeAttachment();return a?.pid===p.id&&a?.nonce===p.nonce;});}
  send(ws,data){try{ws.send(JSON.stringify(data));}catch{}}
  async broadcast(){this.core.tick();for(const p of this.core.s.players){if(p.connected){const ws=this.wsFor(p);if(ws)this.send(ws,this.core.view(p.id));}}await this.save();}
  async webSocketMessage(ws,message){await this.ready;if(typeof message!=='string'||message.length>8192){this.send(ws,{type:'error',message:'Invalid message size.'});return;}
    try{const data=JSON.parse(message);if(!data||typeof data!=='object'||Array.isArray(data))throw new RoomError('Invalid message.');const s=this.core.s,old=ws.deserializeAttachment()||{};const action=data.action;
      if(!old.pid){if(action==='create'){if(s.players.length||this.createToken===null||data.createToken!==this.createToken)throw new RoomError('Invalid room creation credential.');const name=safeString(data.name,24)||'Host',id=crypto.randomUUID(),token=secret(),nonce=crypto.randomUUID();s.players.push({id,token,name,connected:true,nonce});s.host=id;this.createToken=null;ws.serializeAttachment({pid:id,nonce});this.send(ws,{type:'joined',code:s.code,id,token});}
        else if(action==='join'){if(!s.host)throw new RoomError('Wait for the host to create this room.');if(s.stage!=='lobby')throw new RoomError('This session has started. Reconnect with your saved seat.');if(s.players.length>=6)throw new RoomError('Room is full (maximum 6).');const name=safeString(data.name,24);if(!name)throw new RoomError('Enter a name.');const id=crypto.randomUUID(),token=secret(),nonce=crypto.randomUUID();s.players.push({id,token,name,connected:true,nonce});ws.serializeAttachment({pid:id,nonce});this.send(ws,{type:'joined',code:s.code,id,token});}
        else if(action==='resume'){const p=this.core.player(data.id);if(!p||typeof data.token!=='string'||data.token!==p.token)throw new RoomError('Invalid reconnect credentials.');const previous=this.wsFor(p),nonce=crypto.randomUUID();p.token=secret();p.nonce=nonce;p.connected=true;if(s.host===p.id)s.hostDisconnectedAt=null;ws.serializeAttachment({pid:p.id,nonce});if(previous&&previous!==ws)try{previous.close(4001,'Session moved');}catch{}this.send(ws,{type:'joined',code:s.code,id:p.id,token:p.token});}
        else throw new RoomError('Create, join or resume first.');if(s.hostDisconnectedAt&&Date.now()>=s.hostDisconnectedAt+FAILOVER){const oldHost=this.core.player(s.host);if(oldHost&&!oldHost.connected){const replacement=s.players.find(p=>p.connected);if(replacement){s.host=replacement.id;s.hostDisconnectedAt=null;}}}await this.broadcast();return;
      }
      const p=this.core.player(old.pid);if(!p||p.nonce!==old.nonce||!p.connected)throw new RoomError('Connection replaced.');
      if(['start','next','skip','finish','open_vote','lobby','kick','transfer'].includes(action))this.core.hostCheck(p.id);
      if(action==='start'){this.core.content=await this.getContent();this.core.start(p.id,data.game,data.mode,data.duration,data.language||'en');}
      else if(action==='submit'){if(data.round!==s.round)throw new RoomError('Old round. Refresh your screen.');this.core.submit(p.id,data);}
      else if(action==='open_vote')this.core.openLive(p.id);
      else if(action==='next')this.core.next(p.id);
      else if(action==='skip')this.core.skip(p.id);
      else if(action==='finish')this.core.finish(p.id);
      else if(action==='lobby')this.core.lobby(p.id);
      else if(action==='transfer'){const t=this.core.player(data.target);if(!t?.connected)throw new RoomError('Select a connected player.');s.host=t.id;s.hostDisconnectedAt=null;}
      else if(action==='kick'){if(s.stage!=='lobby')throw new RoomError('Seats may be removed only in the lobby.');const t=this.core.player(data.target);if(!t||t.connected||t.id===s.host)throw new RoomError('Only disconnected non-host seats may be removed.');s.players.splice(s.players.indexOf(t),1);}
      else if(action==='ping'){return;}
      else throw new RoomError('Invalid action.');
      await this.broadcast();
    }catch(error){this.send(ws,{type:'error',message:error instanceof RoomError?error.message:'Invalid room operation.'});}
  }
  async webSocketClose(ws,code,reason){
    // Older Workers compatibility dates require an explicit reciprocal Close frame.
    // On runtimes with automatic close replies this is a harmless no-op.
    try{ws.close(code||1000,reason||'');}catch{}
    await this.handleClose(ws);
  }
  async webSocketError(ws){await this.handleClose(ws);}
  async handleClose(ws){await this.ready;if(!this.core)return;const a=ws.deserializeAttachment();if(!a?.pid)return;const p=this.core.player(a.pid);if(!p||p.nonce!==a.nonce)return;p.connected=false;if(p.id===this.core.s.host)this.core.s.hostDisconnectedAt=Date.now();await this.broadcast();}
  async alarm(){await this.ready;if(!this.core){await this.ctx.storage.deleteAll();this.createToken=null;return;}const s=this.core.s,now=Date.now();if(now>this.createdAt+MAX_AGE||(!s.players.some(p=>p.connected)&&now>s.modifiedAt+TTL)){for(const ws of this.ctx.getWebSockets())try{ws.close(4000,'Room expired');}catch{}await this.ctx.storage.deleteAll();this.core=null;return;}
    if(s.hostDisconnectedAt&&now>=s.hostDisconnectedAt+FAILOVER){const old=this.core.player(s.host);if(old&&!old.connected){const replacement=s.players.find(p=>p.connected);if(replacement){s.host=replacement.id;s.hostDisconnectedAt=null;await this.broadcast();return;}}}
    await this.schedule();}
}

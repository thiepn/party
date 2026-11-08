"""CHAOS CLUB V3.7 optional LAN room server. No accounts or persistent player data."""
from __future__ import annotations
import argparse, asyncio, hmac, json, re, secrets, time
from pathlib import Path
from aiohttp import web, WSMsgType

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
CONTENT = json.loads((HERE / 'content.json').read_text(encoding='utf-8'))
ROOMS: dict[str, 'Room'] = {}
RNG = secrets.SystemRandom()
DURATIONS = {'quick': {'social':4,'comedy':3,'bluff':3}, 'standard':{'social':10,'comedy':8,'bluff':7},'long':{'social':20,'comedy':16,'bluff':12}}
MODELS = {'social':('mixed','majority','same','know'), 'comedy':('mixed','punchline','pitch','expert','toast'), 'bluff':('mixed','confession','twotruths','fact')}
CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
HOST_FAILOVER_SECONDS = 15

def safe_string(value, limit):
    return re.sub(r'[\x00-\x1f\x7f]', ' ', value).strip()[:limit] if isinstance(value,str) else ''

def normal(text):
    import unicodedata
    folded=re.sub(r'\s+', ' ',unicodedata.normalize('NFKC',text).casefold()).strip()
    return folded.strip(' .,!?:;…“”„\"\'‘’¡¿。！？')

class RoomError(Exception):
    pass

def duel_schedule(n, rounds):
    """Round-robin schedule: balanced appearances, distinct opponents before rematches."""
    if not 4 <= n <= 6 or rounds < 1: raise ValueError('Unsupported pair schedule')
    ring=list(range(n)) + ([-1] if n%2 else [])
    pairs=[]
    while len(pairs)<rounds:
        for _ in range(len(ring)-1):
            for i in range(len(ring)//2):
                a,b=ring[i],ring[-1-i]
                if a!=-1 and b!=-1:pairs.append((a,b))
            ring=[ring[0],ring[-1]]+ring[1:-1]
    return pairs[:rounds]

class Room:
    def __init__(self, code):
        self.code=code; self.players=[]; self.host=None; self.game='social'; self.mode='mixed'; self.duration='standard'
        self.stage='lobby'; self.round=0; self.total=0; self.deck=[]; self.item=None
        self.featured=None; self.pair=[]; self.options=[]; self.truth_at=None
        self.answers={}; self.votes={}; self.points={}; self.completed=0; self.skipped=0
        self.version=0; self.modified=time.monotonic(); self.lock=asyncio.Lock(); self.lang='en'; self.comedy_pairs=[]; self.host_disconnected_at=None
    def player(self,id):
        return next((p for p in self.players if p['id']==id),None)
    def hostcheck(self,pid):
        if pid!=self.host: raise RoomError('Only the host can do that. / Nur der Host kann das tun.')
    def members(self): return [p['id'] for p in self.players]
    def eligible(self):
        if self.game=='social':return self.members() if self.item['type']!='know' else [i for i in self.members() if i!=self.featured]
        if self.game=='comedy':return [i for i in self.members() if i not in self.pair]
        if self.game=='bluff' and self.item['type']=='fact':return [self.featured]
        return [i for i in self.members() if i!=self.featured]
    def choose_deck(self):
        base=CONTENT[self.game]
        types=list(base) if self.mode=='mixed' else [self.mode]
        groups={t:[dict(x) for x in base[t]] for t in types}
        for group in groups.values():RNG.shuffle(group)
        out=[]
        while any(groups.values()):
            for t in types:
                if groups[t]:out.append(groups[t].pop())
        if len(out)<self.total: raise RoomError('Not enough unique prompts for this session.')
        return out[:self.total]
    def start(self,game,mode,duration,language='en'):
        if self.stage not in ('lobby','end'):raise RoomError('A session is already running.')
        if len(self.players)<4 or len(self.players)>6 or any(not p['connected'] for p in self.players):
            raise RoomError('Start requires 4–6 connected players. / Zum Starten braucht ihr 4–6 verbundene Personen.')
        if game not in MODELS or mode not in MODELS[game] or duration not in DURATIONS or language not in ('en','de'):raise RoomError('Invalid game or configuration.')
        self.game=game;self.mode=mode;self.duration=duration;self.lang=language;self.total=DURATIONS[duration][game]
        self.round=0;self.completed=0;self.skipped=0;self.points={p['id']:0 for p in self.players}
        self.deck=self.choose_deck()
        self.comedy_pairs=duel_schedule(len(self.players),self.total) if game=='comedy' else []
        self.new_round()
    def new_round(self):
        if self.round>=self.total:
            self.stage='end';self.item=None;self.answers={};self.votes={};self.options=[];return
        self.item=self.deck[self.round]; self.answers={};self.votes={}; self.options=[];self.truth_at=None
        self.answer_shared_owners=[]
        ids=self.members()
        self.featured=ids[self.round%len(ids)]
        if self.game=='comedy':
            # Full round-robin pairing avoids repetitive opponents in long sessions.
            left,right=self.comedy_pairs[self.round]
            self.pair=[ids[left],ids[right]]
            if self.pair[0]==self.pair[1]:raise AssertionError('invalid pair')
            self.stage='perform' if self.item['type']=='punchline' else 'live'
        elif self.game=='social':self.stage='answer'
        elif self.game=='bluff':self.stage='prepare'
    def round_ready(self):
        kind=self.item['type']
        if self.game=='social':
            return len(self.answers)==len(self.players)
        if self.game=='comedy':
            return all(pid in self.answers for pid in self.pair)
        if kind=='fact':return all(pid in self.answers for pid in self.members() if pid!=self.featured)
        return self.featured in self.answers
    def submit(self,pid,payload):
        if self.stage not in ('answer','prepare','perform','vote'):raise RoomError('No submission is expected right now.')
        if pid in (self.answers if self.stage!='vote' else self.votes):raise RoomError('Already submitted this round.')
        kind=self.item['type']
        if self.stage=='answer':
            if self.game!='social': raise RoomError('Invalid phase.')
            if kind=='same':
                value=safe_string(payload.get('text'),90)
                # Punctuation-only replies normalize to an empty value; treating them
                # as equal would award points for different non-answers.
                if not value or not normal(value):
                    raise RoomError('Enter a meaningful answer. / Gib eine sinnvolle Antwort ein.')
            else:
                value=payload.get('choice')
                if type(value) is not int or value not in (0,1):raise RoomError('Choose A or B.')
            self.answers[pid]=value
            if self.round_ready():self.stage='reveal';self.score()
            return
        if self.stage=='perform':
            if self.game!='comedy' or pid not in self.pair: raise RoomError('Only performers can submit.')
            value=safe_string(payload.get('text'),240)
            if not value:raise RoomError('Write a punchline.')
            self.answers[pid]=value
            if self.round_ready():self.open_vote()
            return
        if self.stage=='prepare':
            if self.game!='bluff':raise RoomError('Invalid phase.')
            if kind=='confession':
                if pid!=self.featured:raise RoomError('Only the storyteller can set the truth.')
                v=payload.get('truth')
                if type(v) is not bool:raise RoomError('Choose true or fiction privately.')
                self.answers[pid]=v
            elif kind=='twotruths':
                if pid!=self.featured:raise RoomError('Only the storyteller can submit.')
                texts=payload.get('statements'); lie=payload.get('lie')
                if not isinstance(texts,list) or len(texts)!=3 or any(not safe_string(t,140) for t in texts) or type(lie) is not int or lie not in range(3):
                    raise RoomError('Enter three statements and choose the lie.')
                statements=[safe_string(t,140) for t in texts]
                # Equal-looking choices make the marked lie unidentifiable. Check
                # the storyteller's three entries before any private data is stored.
                if len({normal(text) for text in statements})!=3:
                    raise RoomError('Use three different statements. / Verwende drei unterschiedliche Aussagen.')
                self.answers[pid]={'statements':statements, 'lie':lie}
            elif kind=='fact':
                if pid==self.featured:raise RoomError('The guesser cannot submit a bluff.')
                value=safe_string(payload.get('text'),90)
                if not value:raise RoomError('Enter a believable false answer.')
                # Never confirm whether a proposed bluff is correct or already used:
                # rejection would allow probing the hidden truth or other private answers.
                # Merge equal submissions when assembling choices, not at submission time.
                self.answers[pid]=value
            if self.round_ready():self.open_vote()
            return
        if self.stage=='vote':
            if pid not in self.eligible():raise RoomError('This role cannot vote this round.')
            value=payload.get('choice')
            if kind=='fact' or (self.game=='bluff' and kind=='twotruths'):
                n=len(self.options) if kind=='fact' else 3
                if type(value) is not int or value not in range(n):raise RoomError('Choose one option.')
            elif self.game=='comedy':
                if type(value) is not int or value not in (0,1,-1):raise RoomError('Vote A, B, or abstain.')
            else:
                if type(value) is not int or value not in (0,1,-1):raise RoomError('Choose a vote or abstain.')
            self.votes[pid]=value
            if len(self.votes)==len(self.eligible()):self.stage='reveal';self.score()
    def open_vote(self):
        kind=self.item['type'];self.stage='vote'
        if kind=='fact':
            # De-duplicate silently after every player has committed. Exact matches to
            # the truth are not alternative bluffs; shared *false* answers share credit.
            truth_keys={normal(self.item['answer']['en']),normal(self.item['answer']['de'])}
            grouped={}
            for p in self.members():
                if p==self.featured:continue
                value=self.answers[p];key=normal(value)
                if key in truth_keys:continue
                if key not in grouped:grouped[key]=[value,[]]
                grouped[key][1].append(p)
            if not grouped:
                # No deceptive options: do not award free points for a forced choice.
                self.skipped+=1;self.round+=1;self.new_round();return
            raw=[(owners,value) for value,owners in grouped.values()]
            raw.append(([],self.item['answer'][self.lang]))
            RNG.shuffle(raw)
            self.options=[value for _,value in raw]
            self.truth_at=next(i for i,(owners,_) in enumerate(raw) if not owners)
            # Keep the existing answerOwners shape for migrated clients.
            self.answer_owners=[owners[0] if owners else 'truth' for owners,_ in raw]
            self.answer_shared_owners=[owners for owners,_ in raw]
        if self.game=='comedy' and kind=='punchline':
            self.answer_order=self.pair[:];RNG.shuffle(self.answer_order)
    def open_live(self,pid):
        self.hostcheck(pid)
        if self.game!='comedy' or self.stage!='live':raise RoomError('Not a live performance round.')
        self.open_vote()
    def score(self):
        kind=self.item['type']; members=self.members()
        if self.game=='social':
            if kind=='same':
                norm=[normal(self.answers[p]) for p in members]
                for i,p in enumerate(members):self.points[p]+=max(0,norm.count(norm[i])-1)
            elif kind=='majority':
                a=sum(self.answers[p]==0 for p in members);b=len(members)-a
                if a!=b:
                    winning=0 if a>b else 1
                    for p in members:
                        if self.answers[p]==winning:self.points[p]+=1
            elif kind=='know':
                actual=self.answers[self.featured]
                for p in members:
                    if p!=self.featured and self.answers[p]==actual:self.points[p]+=1
        elif self.game=='comedy':
            # Written punchlines are randomized to hide authors until after voting;
            # A/B ballots must score the *displayed* answer order, not performer order.
            candidates=self.answer_order if kind=='punchline' else self.pair
            a=sum(v==0 for v in self.votes.values());b=sum(v==1 for v in self.votes.values())
            if a==b and a>0:
                self.points[candidates[0]]+=1;self.points[candidates[1]]+=1
            elif a!=b:self.points[candidates[0 if a>b else 1]]+=2
        elif kind=='confession':
            true=self.answers[self.featured]
            correct=0
            for p,v in self.votes.items():
                if v!=-1 and v==(0 if true else 1):self.points[p]+=1;correct+=1
            cast=sum(v!=-1 for v in self.votes.values())
            if cast>0 and correct<cast/2:self.points[self.featured]+=2
        elif kind=='twotruths':
            lie=self.answers[self.featured]['lie']; correct=0
            for p,v in self.votes.items():
                if v==lie:self.points[p]+=1;correct+=1
            if correct < len(self.votes)/2:self.points[self.featured]+=2
        elif kind=='fact':
            pick=self.votes[self.featured]
            if pick==self.truth_at:self.points[self.featured]+=2
            else:
                for owner in self.answer_shared_owners[pick]:self.points[owner]+=1
        self.completed+=1
    def next(self,pid):
        self.hostcheck(pid)
        if self.stage!='reveal':raise RoomError('Finish voting before advancing.')
        self.round+=1;self.new_round()
    def skip(self,pid):
        self.hostcheck(pid)
        if self.stage not in ('answer','prepare','perform','live','vote'):raise RoomError('Cannot skip now.')
        self.skipped+=1;self.round+=1;self.new_round()
    def finish(self,pid):
        self.hostcheck(pid)
        if self.stage in ('lobby','end'):raise RoomError('Nothing active to finish.')
        self.stage='end';self.item=None;self.answers={};self.votes={};self.options=[]
    def view(self,pid):
        p=self.player(pid)
        if not p: raise RoomError('Unknown player.')
        cur=self.item or {}; kind=cur.get('type'); item=None
        if self.stage not in ('lobby','end'):
            item={'type':kind,'q':cur['q']}
            if 'options' in cur:item['options']=cur['options']
            if self.stage in ('vote','reveal'):
                if self.game=='bluff' and kind=='twotruths':item['statements']=self.answers[self.featured]['statements']
                if self.game=='bluff' and kind=='fact':item['choices']=self.options
                if self.game=='comedy' and kind=='punchline':item['choices']=[self.answers[x] for x in self.answer_order]
            if self.stage=='reveal':
                item['answers']= {a:self.answers[a] for a in self.answers} if self.game=='social' and kind=='same' else None
                if self.game=='social' and kind!='same':
                    item['counts']=[sum(v==i for pid,v in self.answers.items() if kind!='know' or pid!=self.featured) for i in (0,1)]
                    if kind=='know':item['correct']=self.answers[self.featured]
                if self.game=='comedy' and kind=='punchline':item['authors']=self.answer_order
                if self.game=='bluff':
                    if kind=='confession':item['truth']=self.answers[self.featured]
                    if kind=='twotruths':item['lie']=self.answers[self.featured]['lie']
                    if kind=='fact':item['truthIndex']=self.truth_at;item['answerOwners']=self.answer_owners;item['source']=cur.get('source')
                if self.votes:
                    item['voteCounts']=[sum(v==i for v in self.votes.values()) for i in range(3 if kind=='twotruths' else len(self.options) if kind=='fact' else 2)]
                    item['abstentions']=sum(v==-1 for v in self.votes.values())
        # Privacy: only the owning player sees their own private answer before result.
        mine=self.answers.get(pid) if self.stage!='reveal' else None
        myvote=self.votes.get(pid) if self.stage!='reveal' else None
        return {
            'type':'state','code':self.code,'host':self.host,'you':pid,'isHost':pid==self.host,'game':self.game,'mode':self.mode,
            'duration':self.duration,'roomLanguage':self.lang,'stage':self.stage,'round':self.round,'total':self.total,'completed':self.completed,'skipped':self.skipped,
            'version':self.version,'players':[{'id':m['id'],'name':m['name'],'connected':m['connected'],'points':self.points.get(m['id'],0)} for m in self.players],
            'featured':self.featured,'pair':self.pair,'item':item,'received':len(self.answers),'voted':len(self.votes),
            'required':len(self.players) if self.stage=='answer' else len(self.pair) if self.stage=='perform' else (len(self.eligible()) if self.stage=='vote' else (len(self.players)-1 if kind=='fact' else 1)),
            'mine':mine,'myVote':myvote,
        }
    async def broadcast(self):
        self.version+=1;self.modified=time.monotonic()
        for p in list(self.players):
            if p['ws'] and not p['ws'].closed:
                try:await p['ws'].send_json(self.view(p['id']))
                except Exception:pass

def new_code():
    while True:
        code=''.join(RNG.choices(CODE_CHARS,k=6))
        if code not in ROOMS:return code

def room_from(code):
    room=ROOMS.get(code)
    if not room:raise RoomError('Room not found. / Raum nicht gefunden.')
    return room

async def maybe_transfer_host(room, missing_host, delay=HOST_FAILOVER_SECONDS):
    await asyncio.sleep(delay)
    async with room.lock:
        if room.host!=missing_host:return
        current=room.player(missing_host)
        if not current or current['connected']:return
        replacement=next((p for p in room.players if p['connected']),None)
        if replacement:
            room.host=replacement['id']
            room.host_disconnected_at=None
            await room.broadcast()

async def websocket(request):
    origin=request.headers.get('Origin',''); expected=f'{request.scheme}://{request.host}'
    if origin and origin!=expected and not request.app.get('allow_test_origins',False):raise web.HTTPForbidden(text='Cross-origin WebSocket is disabled.')
    sock=web.WebSocketResponse(max_msg_size=8192,heartbeat=25,receive_timeout=120)
    await sock.prepare(request)
    room=None;pid=None
    try:
        async for msg in sock:
            if msg.type!=WSMsgType.TEXT:continue
            try:
                data=json.loads(msg.data)
                if not isinstance(data,dict):raise RoomError('Invalid message.')
                action=data.get('action')
                if not room:
                    if action=='create':
                        if len(ROOMS)>=80:raise RoomError('Room limit reached.')
                        room=Room(new_code());ROOMS[room.code]=room
                        name=safe_string(data.get('name'),24)
                        if not name:name='Host'
                        pid=secrets.token_hex(8); token=secrets.token_urlsafe(32)
                        room.players.append({'id':pid,'token':token,'name':name,'ws':sock,'connected':True});room.host=pid
                        await sock.send_json({'type':'joined','code':room.code,'id':pid,'token':token})
                    elif action=='join':
                        code=safe_string(data.get('code'),6).upper();room=room_from(code)
                        async with room.lock:
                            if room.stage!='lobby':raise RoomError('This session has started. Reconnect with your saved seat.')
                            if len(room.players)>=6:raise RoomError('Room is full (maximum 6).')
                            name=safe_string(data.get('name'),24)
                            if not name:raise RoomError('Enter a name.')
                            pid=secrets.token_hex(8);token=secrets.token_urlsafe(32)
                            room.players.append({'id':pid,'token':token,'name':name,'ws':sock,'connected':True})
                        await sock.send_json({'type':'joined','code':room.code,'id':pid,'token':token})
                    elif action=='resume':
                        code=safe_string(data.get('code'),6).upper();room=room_from(code)
                        async with room.lock:
                            p=room.player(data.get('id'))
                            if not p or not isinstance(data.get('token'),str) or not hmac.compare_digest(p['token'],data['token']):raise RoomError('Invalid reconnect credentials.')
                            pid=p['id'];previous=p['ws']
                            if pid==room.host:room.host_disconnected_at=None
                            # Rotate the reconnect credential: a replaced tab cannot steal the seat back.
                            p['token']=secrets.token_urlsafe(32);p['ws']=sock;p['connected']=True
                            new_token=p['token']
                        if previous and previous is not sock and not previous.closed:
                            await previous.close(code=4001,message=b'Session moved')
                        await sock.send_json({'type':'joined','code':room.code,'id':pid,'token':new_token})
                    else:raise RoomError('Create, join or resume first.')
                    await room.broadcast()
                    # If everyone was offline when host failover fired, recover once
                    # a guest comes back. Respect the original 15-second grace period.
                    current_host=room.player(room.host)
                    if current_host and not current_host['connected'] and room.host_disconnected_at is not None:
                        remaining=max(0,HOST_FAILOVER_SECONDS-(time.monotonic()-room.host_disconnected_at))
                        asyncio.create_task(maybe_transfer_host(room,room.host,delay=remaining))
                    continue
                p=room.player(pid)
                if not p or p['ws'] is not sock:raise RoomError('Connection replaced.')
                async with room.lock:
                    if action in ('start','next','skip','finish','open_vote','lobby','kick','transfer'):
                        room.hostcheck(pid)
                    if action=='start':room.start(data.get('game'),data.get('mode'),data.get('duration'),data.get('language','en'))
                    elif action=='submit':
                        if data.get('round')!=room.round:raise RoomError('Old round. Refresh your screen.')
                        room.submit(pid,data)
                    elif action=='open_vote':room.open_live(pid)
                    elif action=='next':room.next(pid)
                    elif action=='skip':room.skip(pid)
                    elif action=='finish':room.finish(pid)
                    elif action=='lobby':
                        if room.stage!='end':raise RoomError('End the game first.')
                        room.stage='lobby';room.item=None;room.answers={};room.votes={};room.options=[];room.points={};room.round=0;room.total=0
                    elif action=='transfer':
                        target=room.player(data.get('target'))
                        if not target or not target['connected']:raise RoomError('Select a connected player.')
                        room.host=target['id']
                        room.host_disconnected_at=None
                    elif action=='kick':
                        if room.stage!='lobby':raise RoomError('Seats may be removed only in the lobby.')
                        target=room.player(data.get('target'))
                        if not target or target['connected'] or target['id']==room.host:raise RoomError('Only disconnected non-host seats may be removed.')
                        room.players.remove(target)
                    elif action=='ping':continue
                    else:raise RoomError('Invalid action.')
                    await room.broadcast()
            except (RoomError,ValueError,TypeError,KeyError) as exc:
                await sock.send_json({'type':'error','message':str(exc)[:220]})
    finally:
        if room and pid:
            p=room.player(pid)
            if p and p['ws'] is sock:
                p['ws']=None;p['connected']=False
                await room.broadcast()
                if pid==room.host:
                    room.host_disconnected_at=time.monotonic()
                    asyncio.create_task(maybe_transfer_host(room,pid))
    return sock

async def root(request):raise web.HTTPFound('/room/')
async def room_page(request):return web.FileResponse(HERE/'index.html',headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'})
async def room_asset(request):
    name=request.match_info['name']
    if name not in ('client.js','style.css'):raise web.HTTPNotFound()
    return web.FileResponse(HERE/name,headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'})
async def offline(request):return web.FileResponse(ROOT/'CHAOS-CLUB-3.7-PLAY.html',headers={'X-Content-Type-Options':'nosniff','Cache-Control':'no-store'})
async def prune(app):
    while True:
        await asyncio.sleep(90)
        for k,r in list(ROOMS.items()):
            if time.monotonic()-r.modified>7200 and all(not p['connected'] for p in r.players):ROOMS.pop(k,None)
async def cleanup_ctx(app):
    task=asyncio.create_task(prune(app))
    yield
    task.cancel()
    try:await task
    except asyncio.CancelledError:pass

def create_app(allow_test_origins=False):
    app=web.Application(client_max_size=8192)
    app['allow_test_origins']=allow_test_origins
    app.router.add_get('/',root);app.router.add_get('/room/',room_page);app.router.add_get('/room/{name}',room_asset)
    app.router.add_get('/offline',offline);app.router.add_get('/ws',websocket)
    app.cleanup_ctx.append(cleanup_ctx)
    return app

def suggested_lan_addresses():
    """Best-effort startup hints; no network packets or external service required."""
    import ipaddress, socket
    candidates=set()
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as udp:
            udp.connect(('192.0.2.1', 9))  # local route lookup only, no UDP send
            candidates.add(udp.getsockname()[0])
    except OSError: pass
    try:
        for result in socket.getaddrinfo(socket.gethostname(),None,socket.AF_INET):
            candidates.add(result[4][0])
    except OSError: pass
    return sorted(ip for ip in candidates if (ipaddress.ip_address(ip).is_private
                      and not ipaddress.ip_address(ip).is_link_local
                      and not ipaddress.ip_address(ip).is_loopback))[:4]

if __name__=='__main__':
    parser=argparse.ArgumentParser(description='CHAOS CLUB V3.7 optional private LAN rooms')
    parser.add_argument('--host',default='127.0.0.1',help='127.0.0.1 (local) or 0.0.0.0 (LAN)')
    parser.add_argument('--port',type=int,default=8765)
    args=parser.parse_args()
    print(f'CHAOS CLUB rooms: http://127.0.0.1:{args.port}/room/')
    if args.host=='0.0.0.0':
        addresses=suggested_lan_addresses()
        for ip in addresses:print(f'Possible LAN link: http://{ip}:{args.port}/room/')
        print('Other devices: open http://<computer-LAN-IP>:%s/room/'%args.port)
        print('Choose the address on your Wi-Fi adapter; firewall must allow the port.')
        print('Keep this private on trusted Wi-Fi; HTTP/WebSocket traffic is not encrypted.')
    web.run_app(create_app(),host=args.host,port=args.port,access_log=None)

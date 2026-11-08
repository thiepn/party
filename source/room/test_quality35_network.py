"""V3.5 Fact Trap privacy regression: rejecting guesses must not reveal the true answer.

Uses both deterministic room transitions and four real LAN-protocol WebSocket seats.
"""
import asyncio
from aiohttp import ClientSession, WSMsgType
from aiohttp.test_utils import TestServer
import server


def room_with_players(n=4, language='en'):
    r=server.Room('PRIVACY35')
    r.players=[{'id':str(i),'name':f'Player {i}','token':str(i), 'connected':True,'ws':None} for i in range(n)]
    r.host='0'
    r.start('bluff','fact','quick',language)
    return r


def check_game_logic():
    for language in ('en','de'):
        r=room_with_players(4,language)
        truth=r.item['answer'][language]
        guesser=r.featured
        bluffers=[p for p in r.members() if p!=guesser]
        # Neither the correct answer nor another submitted bluff is an error oracle.
        r.submit(bluffers[0],{'text':truth})
        r.submit(bluffers[1],{'text':'A clever wrong option'})
        r.submit(bluffers[2],{'text':'A clever wrong option'})
        assert r.stage=='vote'
        assert len(r.options)==2, (r.options,language)
        assert sum(server.normal(x)==server.normal(truth) for x in r.options)==1
        assert r.view(guesser)['item'].get('truthIndex') is None
        assert 'source' not in r.view(guesser)['item']
        fake_index=next(i for i,x in enumerate(r.options) if server.normal(x)!=server.normal(truth))
        r.submit(guesser,{'choice':fake_index})
        assert r.stage=='reveal'
        assert r.points[bluffers[0]]==0
        assert r.points[bluffers[1]]==1 and r.points[bluffers[2]]==1
        assert r.points[guesser]==0
        # An all-correct set of 'bluffs' has no playable deception; skip the round.
        t=room_with_players(4,language)
        initial=t.round
        for pid in [p for p in t.members() if p!=t.featured]:
            t.submit(pid,{'text':t.item['answer'][language]})
        assert t.skipped==1 and t.round==initial+1 and t.stage=='prepare'

async def receive(ws,predicate,timeout=7):
    async def wait():
        while True:
            msg=await ws.receive()
            assert msg.type==WSMsgType.TEXT, f'WebSocket error: {msg.type}'
            obj=msg.json()
            if obj.get('type')=='error':raise AssertionError(f'Unexpected server error: {obj["message"]}')
            if predicate(obj):return obj
    return await asyncio.wait_for(wait(),timeout)

async def check_network():
    async with TestServer(server.create_app()) as srv:
        wsurl=str(srv.make_url('/ws')); origin=str(srv.make_url('/')).rstrip('/')
        async with ClientSession() as session:
            sockets=[];seats=[];code=None
            try:
                for i in range(4):
                    ws=await session.ws_connect(wsurl,origin=origin)
                    sockets.append(ws)
                    if i==0:await ws.send_json({'action':'create','name':'Host'})
                    else:await ws.send_json({'action':'join','code':code,'name':f'Guest {i}'})
                    seat=await receive(ws,lambda x:x.get('type')=='joined')
                    code=seat['code'];seats.append(seat)
                    await receive(ws,lambda x:x.get('type')=='state')
                await sockets[0].send_json({'action':'start','game':'bluff','mode':'fact','duration':'quick','language':'en'})
                started=await receive(sockets[0],lambda x:x.get('type')=='state' and x.get('stage')=='prepare')
                r=server.ROOMS[code]
                true_answer=r.item['answer']['en']
                featured_idx=next(i for i,s in enumerate(seats) if s['id']==r.featured)
                writers=[i for i in range(4) if i!=featured_idx]
                for ordinal,i in enumerate(writers):
                    candidate=true_answer if ordinal==0 else 'Believable fake answer'
                    await sockets[i].send_json({'action':'submit','round':0,'text':candidate})
                    await receive(sockets[i],lambda x:x.get('type')=='state' and x.get('received')>=ordinal+1)
                vote=await receive(sockets[featured_idx],lambda x:x.get('type')=='state' and x.get('stage')=='vote')
                assert len(vote['item']['choices'])==2
                assert 'truthIndex' not in vote['item'] and 'source' not in vote['item']
                fake_index=next(i for i,x in enumerate(vote['item']['choices']) if server.normal(x)!=server.normal(true_answer))
                await sockets[featured_idx].send_json({'action':'submit','round':0,'choice':fake_index})
                reveal=await receive(sockets[featured_idx],lambda x:x.get('type')=='state' and x.get('stage')=='reveal')
                assert reveal['item']['truthIndex']!=fake_index
                pts={p['id']:p['points'] for p in reveal['players']}
                assert pts[seats[writers[0]]['id']]==0
                assert pts[seats[writers[1]]['id']]==pts[seats[writers[2]]['id']]==1
                print('PASS V3.5: 4 real WebSockets, no answer/duplicate oracle, unique reveal, correct grouped bluff scoring')
            finally:
                for ws in sockets:
                    if not ws.closed:await ws.close()
                if code:server.ROOMS.pop(code,None)

if __name__=='__main__':
    check_game_logic()
    asyncio.run(check_network())

"""V3.6 regression: Two Truths/One Lie must offer three distinguishable statements.

Uses deterministic 4/5/6-player checks and four real, same-origin WebSockets.
No human or physical-device behavior is asserted.
"""
import asyncio
from aiohttp import ClientSession, WSMsgType
from aiohttp.test_utils import TestServer
import server


def make_room(n=4, language='en'):
    r=server.Room('UNIQUE36')
    r.players=[{'id':str(i),'name':f'P{i}','token':str(i),'connected':True,'ws':None} for i in range(n)]
    r.host='0'
    r.start('bluff','twotruths','quick',language)
    return r


def check_logic():
    for n in (4,5,6):
        for lang in ('en','de'):
            r=make_room(n,lang)
            protagonist=r.featured
            bad={'statements':['I once met a singer.',' i once met a singer! ','I ran a marathon.'],'lie':1}
            try:
                r.submit(protagonist,bad)
            except server.RoomError as exc:
                assert 'different statements' in str(exc)
            else:
                raise AssertionError('Indistinguishable choices became a scored vote.')
            assert r.stage=='prepare' and protagonist not in r.answers
            good={'statements':['I once met a singer.','I ran a marathon.','I rode a horse.'],'lie':1}
            r.submit(protagonist,good)
            assert r.stage=='vote'
            for pid in r.eligible():
                view=r.view(pid)
                assert 'lie' not in view['item']
                assert view['item']['statements']==good['statements']
                r.submit(pid,{'choice':1})
            assert r.stage=='reveal' and r.completed==1
            assert r.points[protagonist]==0
            assert all(r.points[pid]==1 for pid in r.members() if pid!=protagonist)
    print('PASS V3.6: 4/5/6 players, EN/DE duplicates rejected, fixed entry accepted, lie hidden, scoring intact')


async def receive(ws, condition, timeout=7):
    async def until():
        while True:
            msg=await ws.receive()
            assert msg.type==WSMsgType.TEXT, f'Unexpected WebSocket message {msg.type}'
            obj=msg.json()
            if condition(obj):return obj
            if obj.get('type')=='error':raise AssertionError(f'Unexpected server error: {obj}')
    return await asyncio.wait_for(until(),timeout)


async def check_network():
    async with TestServer(server.create_app()) as srv:
        wsurl=str(srv.make_url('/ws'))
        origin=str(srv.make_url('/')).rstrip('/')
        async with ClientSession() as session:
            sockets=[]; ids=[];code=None
            try:
                for index in range(4):
                    ws=await session.ws_connect(wsurl,origin=origin)
                    sockets.append(ws)
                    await ws.send_json({'action':'create','name':'Host'} if index==0 else {'action':'join','code':code,'name':f'Guest{index}'})
                    joined=await receive(ws,lambda m:m.get('type')=='joined')
                    code=joined['code'];ids.append(joined['id'])
                    await receive(ws,lambda m:m.get('type')=='state')
                await sockets[0].send_json({'action':'start','game':'bluff','mode':'twotruths','duration':'quick','language':'de'})
                started=await receive(sockets[0],lambda m:m.get('type')=='state' and m.get('stage')=='prepare')
                who=ids.index(started['featured'])
                await sockets[who].send_json({'action':'submit','round':0,'statements':['Café?', 'CAFÉ!', 'Kaffee ist gut'],'lie':1})
                err=await receive(sockets[who],lambda m:m.get('type')=='error')
                assert 'unterschiedliche Aussagen' in err['message']
                room=server.ROOMS[code]
                assert room.stage=='prepare' and not room.answers
                await sockets[who].send_json({'action':'submit','round':0,'statements':['Café?', 'Kaffee ist gut','Ich war in Berlin'],'lie':1})
                for i,ws in enumerate(sockets):
                    snap=await receive(ws,lambda m:m.get('type')=='state' and m.get('stage')=='vote')
                    assert 'lie' not in snap['item']
                    if i!=who:
                        await ws.send_json({'action':'submit','round':0,'choice':1})
                revealed=await receive(sockets[0],lambda m:m.get('type')=='state' and m.get('stage')=='reveal')
                assert revealed['item']['lie']==1
                assert room.completed==1 and room.stage=='reveal'
                print('PASS V3.6: 4 real same-origin WebSockets reject ambiguous statements, accept correction, keep secret, finish round')
            finally:
                for ws in sockets:
                    if not ws.closed:await ws.close()
                if code:server.ROOMS.pop(code,None)

if __name__=='__main__':
    check_logic()
    asyncio.run(check_network())

"""V3.4: multi-device recovery when every seat drops before host failover.

Exercises real aiohttp WebSocket connections and asserts a returning guest can
continue an in-progress game without the original host reconnecting.
"""
import asyncio
from aiohttp import ClientSession, WSMsgType
from aiohttp.test_utils import TestServer
import server

async def receive(ws, predicate, timeout=5):
    async def wait_message():
        while True:
            message=await ws.receive()
            if message.type!=WSMsgType.TEXT:
                raise AssertionError(f'Unexpected WebSocket frame: {message.type}')
            data=message.json()
            if predicate(data):return data
    return await asyncio.wait_for(wait_message(), timeout)

async def run():
    async with TestServer(server.create_app()) as srv:
        origin=str(srv.make_url('/')).rstrip('/')
        address=str(srv.make_url('/ws'))
        async with ClientSession() as session:
            sockets=[]; seats=[]
            try:
                for idx in range(4):
                    ws=await session.ws_connect(address,origin=origin)
                    sockets.append(ws)
                    if idx==0:await ws.send_json({'action':'create','name':'Host'})
                    else:await ws.send_json({'action':'join','code':code,'name':f'Guest {idx}'})
                    data=await receive(ws,lambda m:m.get('type')=='joined')
                    code=data['code'];seats.append(data)
                    await receive(ws,lambda m:m.get('type')=='state')
                await sockets[0].send_json({'action':'start','game':'social','mode':'majority','duration':'quick'})
                await receive(sockets[0],lambda m:m.get('type')=='state' and m.get('stage')=='answer')
                room=server.ROOMS[code]
                for ws in sockets:await ws.close()
                # Wait for all disconnect handlers to run, then emulate the timed handover.
                for _ in range(50):
                    if all(not p['connected'] for p in room.players):break
                    await asyncio.sleep(.01)
                assert all(not p['connected'] for p in room.players)
                await server.maybe_transfer_host(room,seats[0]['id'],delay=0)
                assert room.host==seats[0]['id'],'No guest was connected at the deadline'
                room.host_disconnected_at=__import__('time').monotonic()-server.HOST_FAILOVER_SECONDS-.1
                # Grace period has elapsed; a guest returns while original host stays offline.
                guest=await session.ws_connect(address,origin=origin)
                sockets.append(guest)
                await guest.send_json({'action':'resume',**seats[1]})
                new_join=await receive(guest,lambda m:m.get('type')=='joined')
                assert new_join['token']!=seats[1]['token']
                await receive(guest,lambda m:m.get('type')=='state' and m['players'][1]['connected'])
                new_state=await receive(guest,lambda m:m.get('type')=='state' and m['isHost'])
                assert new_state['host']==seats[1]['id']
                assert new_state['stage']=='answer' and new_state['round']==0
                await guest.send_json({'action':'skip'})
                state=await receive(guest,lambda m:m.get('type')=='state' and m['round']==1)
                assert state['skipped']==1
                # Former host can reconnect to the reserved seat without reclaiming authority.
                former=await session.ws_connect(address,origin=origin)
                sockets.append(former)
                await former.send_json({'action':'resume',**seats[0]})
                await receive(former,lambda m:m.get('type')=='joined')
                state=await receive(former,lambda m:m.get('type')=='state')
                assert not state['isHost'] and state['host']==seats[1]['id']
                print('PASS V3.4: post-blackout host recovery, continued play, rotating reconnect tokens, former-host return')
            finally:
                for ws in sockets:
                    if not ws.closed:await ws.close()
                server.ROOMS.pop(code,None)

if __name__=='__main__':asyncio.run(run())

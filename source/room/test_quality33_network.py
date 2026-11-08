"""V3.3 real-socket host failover and rotating reconnect token regression."""
import asyncio
from aiohttp import ClientSession, WSMsgType
from aiohttp.test_utils import TestServer
import server

async def receive(ws,predicate,timeout=5):
    async def inner():
        while True:
            message=await ws.receive()
            if message.type!=WSMsgType.TEXT:raise AssertionError(f'Unexpected WS message type {message.type}')
            payload=message.json()
            if predicate(payload):return payload
    return await asyncio.wait_for(inner(),timeout)

async def run():
    async with TestServer(server.create_app()) as srv:
        base=str(srv.make_url('/')).rstrip('/')
        address=str(srv.make_url('/ws'))
        async with ClientSession() as session:
            conns=[];ids=[];tokens=[]
            try:
                for idx in range(4):
                    ws=await session.ws_connect(address,origin=base)
                    conns.append(ws)
                    if idx==0:await ws.send_json({'action':'create','name':'Original host'})
                    else:await ws.send_json({'action':'join','name':f'Guest {idx}','code':code})
                    joined=await receive(ws,lambda v:v.get('type')=='joined')
                    ids.append(joined['id']);tokens.append(joined['token'])
                    code=joined['code']
                    await receive(ws,lambda v:v.get('type')=='state')
                room=server.ROOMS[code]
                await conns[0].send_json({'action':'start','game':'social','mode':'majority','duration':'quick'})
                await receive(conns[0],lambda v:v.get('type')=='state' and v['stage']=='answer')
                await conns[0].close()
                await receive(conns[1],lambda v:v.get('type')=='state' and not v['players'][0]['connected'])
                await server.maybe_transfer_host(room,ids[0],delay=0.01)
                newstate=await receive(conns[1],lambda v:v.get('type')=='state' and v['isHost'])
                assert room.host==ids[1]
                assert newstate['round']==0 and newstate['stage']=='answer'
                # Original host returns, retaining seat but not stealing new host authority.
                resumed=await session.ws_connect(address,origin=base);conns.append(resumed)
                await resumed.send_json({'action':'resume','code':code,'id':ids[0],'token':tokens[0]})
                joined=await receive(resumed,lambda v:v.get('type')=='joined')
                assert joined['id']==ids[0] and joined['token']!=tokens[0]
                state=await receive(resumed,lambda v:v.get('type')=='state')
                assert not state['isHost'] and state['host']==ids[1]
                # Old credentials must not reclaim the seat.
                intruder=await session.ws_connect(address,origin=base);conns.append(intruder)
                await intruder.send_json({'action':'resume','code':code,'id':ids[0],'token':tokens[0]})
                error=await receive(intruder,lambda v:v.get('type')=='error')
                assert 'Invalid reconnect credentials' in error['message']
                # New host can keep playing after failover.
                await conns[1].send_json({'action':'skip'})
                after=await receive(conns[1],lambda v:v.get('type')=='state' and v['round']==1)
                assert after['skipped']==1 and after['isHost']
                print('PASS V3.3: real-origin WebSockets, mid-game host failover, seat recovery, token rotation, old-token rejection, new-host advancement')
            finally:
                for ws in conns:
                    await ws.close()
                server.ROOMS.pop(code,None)

if __name__=='__main__':asyncio.run(run())

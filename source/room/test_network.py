"""Actual concurrent WebSocket clients against the local aiohttp server."""
import asyncio, sys
from aiohttp import ClientSession, WSMsgType
from aiohttp.test_utils import TestServer
from server import create_app

async def receive(ws, test, timeout=6):
    async def get():
        while True:
            msg=await ws.receive()
            if msg.type!=WSMsgType.TEXT:raise AssertionError(f'Unexpected socket message: {msg.type}')
            data=msg.json()
            if test(data):return data
    return await asyncio.wait_for(get(),timeout)

async def run():
    async with TestServer(create_app()) as server:
        url=str(server.make_url('/ws'));origin=str(server.make_url('/')).rstrip('/')
        async with ClientSession() as session:
            # Served assets are explicitly allowlisted; hidden answer sources are private.
            for route in ['/room/','/room/client.js','/room/style.css','/offline']:
                async with session.get(str(server.make_url(route))) as resp:
                    assert resp.status==200,(route,resp.status)
                    assert await resp.read()
            for route in ['/room/content.json','/room/server.py']:
                async with session.get(str(server.make_url(route))) as resp:
                    assert resp.status==404,(route,resp.status)
            # Default production policy rejects a browser Origin from another site.
            try:
                await session.ws_connect(url,origin='https://other.invalid')
                raise AssertionError('Cross-site WebSocket should be rejected')
            except Exception as exc:
                assert '403' in str(exc),repr(exc)
            ws=[]; ids=[]; tokens=[]
            try:
                host=await session.ws_connect(url,origin=origin);ws.append(host)
                await host.send_json({'action':'create','name':'Host <script>'})
                joined=await receive(host,lambda x:x['type']=='joined');code=joined['code'];ids.append(joined['id']);tokens.append(joined['token'])
                await receive(host,lambda x:x['type']=='state')
                for i in range(1,4):
                    w=await session.ws_connect(url,origin=origin);ws.append(w)
                    await w.send_json({'action':'join','code':code,'name':f'Friend {i}'})
                    j=await receive(w,lambda x:x['type']=='joined');ids.append(j['id']);tokens.append(j['token'])
                    state=await receive(w,lambda x:x['type']=='state' and len(x['players'])==i+1)
                # A nonhost must not be able to start a game.
                await ws[1].send_json({'action':'start','game':'social','mode':'majority','duration':'quick'})
                err=await receive(ws[1],lambda x:x['type']=='error')
                assert 'host' in err['message'].lower()
                await host.send_json({'action':'start','game':'social','mode':'majority','duration':'quick','language':'de'})
                await receive(host,lambda x:x.get('type')=='state' and x['stage']=='answer' and x['round']==0)
                for i,w in enumerate(ws):
                    await w.send_json({'action':'submit','round':0,'choice':i%2})
                    await receive(w,lambda x:x.get('type')=='state' and x['stage'] in ('answer','reveal') and x['received']>=i+1)
                res=await receive(host,lambda x:x.get('type')=='state' and x['stage']=='reveal')
                assert res['item']['counts']==[2,2], res['item']
                assert res['item'].get('answers') is None
                assert sum(p['points'] for p in res['players'])==0
                # Spoofing old round and premature progression is rejected.
                await ws[2].send_json({'action':'next'})
                assert (await receive(ws[2],lambda x:x['type']=='error'))['type']=='error'
                await host.send_json({'action':'next'})
                await receive(host,lambda x:x.get('type')=='state' and x['round']==1)
                await host.send_json({'action':'submit','round':0,'choice':0})
                assert 'Old round' in (await receive(host,lambda x:x['type']=='error'))['message']
                # Reconnect a disconnected player without losing their place or identity.
                await ws[3].close()
                await receive(host,lambda x:x.get('type')=='state' and any(not p['connected'] for p in x['players']))
                old=ws[3]
                ws[3]=await session.ws_connect(url,origin=origin)
                await ws[3].send_json({'action':'resume','code':code,'id':ids[3],'token':tokens[3]})
                new_join=await receive(ws[3],lambda x:x.get('type')=='joined')
                assert new_join['id']==ids[3]
                await receive(ws[3],lambda x:x.get('type')=='state' and x['round']==1)
                # No token guessing or seat impersonation.
                intruder=await session.ws_connect(url,origin=origin)
                try:
                    await intruder.send_json({'action':'resume','code':code,'id':ids[3],'token':'bad-token'})
                    assert 'Invalid' in (await receive(intruder,lambda x:x['type']=='error'))['message']
                finally:await intruder.close()
                # Switch to Bluff Club factual scenario and verify no truth leaks before reveal.
                await host.send_json({'action':'finish'})
                await receive(host,lambda x:x.get('type')=='state' and x['stage']=='end')
                await host.send_json({'action':'lobby'})
                await receive(host,lambda x:x.get('type')=='state' and x['stage']=='lobby')
                await host.send_json({'action':'start','game':'bluff','mode':'fact','duration':'quick','language':'en'})
                s=await receive(host,lambda x:x.get('type')=='state' and x['stage']=='prepare')
                featured=s['featured']
                for i,w in enumerate(ws):
                    if ids[i]==featured:continue
                    await w.send_json({'action':'submit','round':0,'text':f'False answer from {i}'})
                # All players see a vote stage, but no truth index or author map.
                views=[]
                for i,w in enumerate(ws):
                    st=await receive(w,lambda x:x.get('type')=='state' and x['stage']=='vote')
                    views.append(st)
                    assert 'truthIndex' not in st['item']
                    assert 'answerOwners' not in st['item']
                    assert all(type(x) is str for x in st['item']['choices'])
                    assert 'False answer from ' not in str(st.get('mine')) if ids[i]==featured else True
                guesser_idx=ids.index(featured)
                await ws[guesser_idx].send_json({'action':'submit','round':0,'choice':0})
                st=await receive(host,lambda x:x.get('type')=='state' and x['stage']=='reveal')
                assert 'truthIndex' in st['item'];assert 'votes' not in st['item']
                assert st['completed']==1
                # Same Brain must not award points to different punctuation-only
                # replies that collapse to the same empty normalized answer.
                await host.send_json({'action':'finish'})
                await receive(host,lambda x:x.get('type')=='state' and x['stage']=='end')
                await host.send_json({'action':'lobby'})
                await receive(host,lambda x:x.get('type')=='state' and x['stage']=='lobby')
                await host.send_json({'action':'start','game':'social','mode':'same','duration':'quick','language':'en'})
                await receive(host,lambda x:x.get('type')=='state' and x['stage']=='answer' and x['round']==0)
                await host.send_json({'action':'submit','round':0,'text':'!!!'})
                invalid=await receive(host,lambda x:x['type']=='error')
                assert 'meaningful' in invalid['message'], invalid
                for i,w in enumerate(ws):
                    await w.send_json({'action':'submit','round':0,'text':'Pizza!' if i%2==0 else ' PIZZA. '})
                matched=await receive(host,lambda x:x.get('type')=='state' and x['stage']=='reveal')
                assert all(p['points']==3 for p in matched['players']), matched['players']
                print('PASS: real WebSocket rejects empty normalized Same Brain answers, allows correction and scores matching answers')
                print('PASS: actual WebSocket create/join, host authorization, private votes, stale messages, reconnect, forgery rejection, bluff secrecy and scoring')
            finally:
                await asyncio.gather(*(w.close() for w in ws),return_exceptions=True)

if __name__=='__main__':asyncio.run(run())

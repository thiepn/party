"""V3.0 regression tests: confession scoring, public results, credentials and host recovery."""
import asyncio, unittest
from aiohttp import ClientSession
from aiohttp.test_utils import TestServer
import server
from test_network import receive

class RuleRegressions(unittest.TestCase):
    def room(self, n):
        r=server.Room('TEST30')
        r.players=[{'id':str(i),'name':f'Player {i}','connected':True,'ws':None,'token':str(i)} for i in range(n)]
        r.host='0'
        return r
    def test_truth_and_fiction_are_not_reversed(self):
        for n in (4,5,6):
            for true in (True,False):
                r=self.room(n);r.start('bluff','confession','quick');r.submit(r.featured,{'truth':true})
                correct_option=0 if true else 1
                for p in r.eligible():r.submit(p,{'choice':correct_option})
                self.assertEqual(r.stage,'reveal')
                self.assertEqual(r.points[r.featured],0)
                self.assertEqual(sum(r.points.values()),n-1)
                self.assertEqual(r.view('0')['item']['truth'],true)
    def test_storyteller_only_scores_if_majority_is_fooled(self):
        for true in (True,False):
            r=self.room(5);r.start('bluff','confession','quick');r.submit(r.featured,{'truth':true})
            wrong_option=1 if true else 0
            for p in r.eligible():r.submit(p,{'choice':wrong_option})
            self.assertEqual(r.points[r.featured],2)
            self.assertEqual(sum(r.points.values()),2)
    def test_known_players_are_not_in_their_own_prediction_results(self):
        r=self.room(4);r.start('social','know','quick')
        r.submit(r.featured,{'choice':0})
        for p in r.eligible():r.submit(p,{'choice':1})
        view=r.view('0')
        self.assertEqual(view['item']['counts'],[0,3]);self.assertEqual(view['item']['correct'],0)
        self.assertEqual(sum(r.points.values()),0)
    def test_private_answers_and_credentials_not_in_room_view(self):
        r=self.room(5);r.start('social','same','quick');r.submit(r.featured,{'text':'personal answer'})
        view=r.view('1')
        self.assertNotIn('personal answer',str(view))
        self.assertNotIn('token',str(view))

async def network():
    async with TestServer(server.create_app()) as srv:
        url=str(srv.make_url('/ws'));origin=str(srv.make_url('/')).rstrip('/')
        async with ClientSession() as session:
            host=await session.ws_connect(url,origin=origin)
            try:
                await host.send_json({'action':'create','name':'First host'})
                joined=await receive(host,lambda x:x.get('type')=='joined')
                code,pid,old=joined['code'],joined['id'],joined['token']
                await receive(host,lambda x:x.get('type')=='state')
                guest=await session.ws_connect(url,origin=origin)
                try:
                    await guest.send_json({'action':'join','name':'Second','code':code})
                    await receive(guest,lambda x:x.get('type')=='joined')
                    await receive(guest,lambda x:x.get('type')=='state')
                    # Replacing a live seat invalidates the old tab's credential.
                    moved=await session.ws_connect(url,origin=origin)
                    try:
                        await moved.send_json({'action':'resume','code':code,'id':pid,'token':old})
                        new=await receive(moved,lambda x:x.get('type')=='joined')
                        selfsame=new['id']==pid
                        assert selfsame and new['token']!=old
                        await receive(moved,lambda x:x.get('type')=='state')
                        stale=await session.ws_connect(url,origin=origin)
                        try:
                            await stale.send_json({'action':'resume','code':code,'id':pid,'token':old})
                            err=await receive(stale,lambda x:x.get('type')=='error')
                            assert 'Invalid reconnect credentials' in err['message']
                        finally:await stale.close()
                        # A genuine host disconnect transfers control to a connected player.
                        await moved.close()
                        room=server.ROOMS[code]
                        for _ in range(50):
                            if not room.player(pid)['connected']:break
                            await asyncio.sleep(0.02)
                        assert not room.player(pid)['connected']
                        # Exercise the exact host-transfer function without waiting 15 seconds.
                        await server.maybe_transfer_host(room,pid,delay=0)
                        state=await receive(guest,lambda x:x.get('type')=='state' and x['isHost'],timeout=4)
                        assert state['host']==state['you']
                        await guest.send_json({'action':'start','game':'social','mode':'majority','duration':'quick'})
                        err=await receive(guest,lambda x:x.get('type')=='error')
                        assert '4' in err['message'] # one connected guest cannot start alone
                    finally:await moved.close()
                finally:await guest.close()
            finally:await host.close()
    print('PASS V3.0 socket handoff: rotated reconnect tokens, old-seat rejection, host failover and permissions')

if __name__=='__main__':
    unittest.main(exit=False,verbosity=2)
    asyncio.run(network())

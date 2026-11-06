"""V3.3 factual provenance, privacy and exact round scoring tests. No external network."""
import json, unittest
from pathlib import Path
from urllib.parse import urlparse
import server

HERE=Path(__file__).resolve().parent

class Quality33(unittest.TestCase):
    def room(self,n):
        room=server.Room('QUALITY33')
        room.players=[{'id':str(i),'name':f'Person {i}','token':str(i),'connected':True,'ws':None} for i in range(n)]
        room.host='0'
        return room

    def test_every_active_fact_has_traceable_https_source(self):
        data=server.CONTENT['bluff']['fact']
        index=json.loads((HERE/'fact-provenance.json').read_text(encoding='utf-8'))
        self.assertEqual(len(data),17)
        self.assertEqual(len(index),17)
        self.assertEqual({x['q']['en'] for x in data},set(index))
        self.assertEqual(json.loads((HERE/'fact-review-hold.json').read_text()),[])
        for card in data:
            source=card['source']
            self.assertEqual([source['name'],source['url']],index[card['q']['en']])
            url=urlparse(source['url'])
            self.assertEqual(url.scheme,'https')
            self.assertTrue(url.hostname and '.' in url.hostname)
            self.assertTrue(card['q']['de'] and card['answer']['de'])

    def test_source_visible_only_after_fact_trap_reveal_in_all_group_sizes(self):
        for n in (4,5,6):
            for language in ('en','de'):
                r=self.room(n)
                r.start('bluff','fact','long',language)
                self.assertEqual(len(r.deck),12)
                for current_round in range(12):
                    self.assertEqual(r.round,current_round)
                    featured=r.featured
                    source=r.item['source']
                    self.assertNotIn('source',r.view(featured)['item'])
                    self.assertNotIn(source['url'],str(r.view(featured)))
                    for idx,pid in enumerate(r.members()):
                        if pid!=featured:
                            r.submit(pid,{'text':f'Invented answer {idx} round {current_round}'})
                    self.assertEqual(r.stage,'vote')
                    for pid in r.members():
                        self.assertNotIn('source',r.view(pid)['item'])
                        self.assertNotIn(source['url'],str(r.view(pid)))
                    r.submit(featured,{'choice':r.truth_at})
                    self.assertEqual(r.stage,'reveal')
                    for pid in r.members():
                        self.assertEqual(r.view(pid)['item']['source'],source)
                        self.assertEqual(r.view(pid)['item']['truthIndex'],r.truth_at)
                    r.next(r.host)
                self.assertEqual(r.stage,'end')
                self.assertEqual(r.completed,12)
                self.assertEqual(sum(r.points.values()),24)

if __name__=='__main__':unittest.main(verbosity=2)

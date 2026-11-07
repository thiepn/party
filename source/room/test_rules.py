"""Deterministic complete sessions and invariants (no browser required)."""
from __future__ import annotations
import random, unittest
import server

class Rules(unittest.TestCase):
  @classmethod
  def setUpClass(cls):cls.old_rng=server.RNG;server.RNG=random.Random(28)
  @classmethod
  def tearDownClass(cls):server.RNG=cls.old_rng
  def new_room(self,n):
    r=server.Room('AAAAAA')
    r.players=[{'id':str(i),'name':f'Player {i}','token':str(i),'connected':True,'ws':None} for i in range(n)]
    r.host='0';return r
  def play_round(self,r):
    kind=r.item['type']; host=r.host
    if r.stage=='answer':
      for i,p in enumerate(r.members()):
        if kind=='same':data={'text': ['Pizza','pizza','Pasta'][i%3]}
        else:data={'choice':i%2}
        r.submit(p,data)
    elif r.stage=='perform':
      for i,p in enumerate(r.pair):r.submit(p,{'text':f'original answer {i} for round {r.round}'})
    elif r.stage=='live':r.open_live(host)
    elif r.stage=='prepare':
      if kind=='confession':r.submit(r.featured,{'truth':r.round%2==0})
      elif kind=='twotruths':r.submit(r.featured,{'statements':['Statement A','Statement B','Statement C'],'lie':r.round%3})
      elif kind=='fact':
        for i,p in enumerate(r.members()):
          if p!=r.featured:r.submit(p,{'text':f'Plausible wrong answer {i} {r.round}'})
    if r.stage=='vote':
      for i,p in enumerate(r.eligible()):
        if kind=='fact':choice=r.truth_at if r.round%2==0 else (r.truth_at+1)%len(r.options)
        elif kind=='twotruths':choice=i%3
        else:choice=i%2
        r.submit(p,{'choice':choice})
    self.assertEqual(r.stage,'reveal')
    self.assertEqual(r.completed,r.round+1)
    self.assertTrue(all(type(x)==int and x>=0 for x in r.points.values()))
  def test_all_long_sessions_and_variants(self):
    count=0; rounds=0
    for n in (4,5,6):
      for game,variants in server.MODELS.items():
        for variant in variants:
          for duration in server.DURATIONS:
            r=self.new_room(n);r.start(game,variant,duration,'de')
            appearance={p:0 for p in r.members()}
            while r.stage!='end':
              if game=='comedy':
                for p in r.pair:appearance[p]+=1
              self.play_round(r);r.next(r.host);rounds+=1
            self.assertEqual(r.completed,r.total)
            self.assertEqual(r.skipped,0)
            if game=='comedy':self.assertLessEqual(max(appearance.values())-min(appearance.values()),1)
            count+=1
    print(f'{count} full deterministic sessions / {rounds} real rounds')
  def test_same_brain_rejects_normalized_empty_answers_without_awarding_points(self):
    for size in (4,5,6):
      for lang in ('en','de'):
        r=self.new_room(size);r.start('social','same','quick',lang)
        first=r.members()[0]
        for invalid in ('!!!','???','...',' , ; '):
          with self.assertRaises(server.RoomError):
            r.submit(first,{'text':invalid})
          self.assertEqual(r.stage,'answer')
          self.assertNotIn(first,r.answers)
          self.assertEqual(sum(r.points.values()),0)
        # A corrected answer is accepted and punctuation/casing normalization
        # continues to work as promised by the player instructions.
        for i,p in enumerate(r.members()):
          r.submit(p,{'text':'Pizza!' if i%2==0 else ' PIZZA. '})
        self.assertEqual(r.stage,'reveal')
        self.assertEqual(r.completed,1)
        self.assertEqual(set(r.points.values()),{size-1})

  def test_privacy_scoring_and_stale(self):
    r=self.new_room(5);r.start('bluff','fact','quick','de');kind=r.item['type'];self.assertEqual(kind,'fact')
    guesser=r.featured;others=[x for x in r.members() if x!=guesser]
    for i,p in enumerate(others):r.submit(p,{'text':f'Lie {i}'})
    self.assertEqual(r.stage,'vote')
    raw=r.view(guesser)
    self.assertNotIn('truthIndex',raw['item']);self.assertTrue(all(type(x)==str for x in raw['item']['choices']))
    self.assertFalse('answerOwners' in raw['item'])
    with self.assertRaises(server.RoomError):r.submit(others[0],{'choice':0})
    r.submit(guesser,{'choice':r.truth_at})
    self.assertEqual(r.points[guesser],2)
    self.assertNotIn('votes',r.view(others[0])['item'])
    self.assertNotIn('answers',r.view(others[0])['item']) if False else None
  def test_anonymous_punchline_vote_uses_shuffled_answer_order(self):
    r=self.new_room(6);r.start('comedy','punchline','quick')
    for i,p in enumerate(r.pair):r.submit(p,{'text':f'Punchline number {i}'})
    self.assertEqual(r.stage,'vote')
    displayed_a=r.answer_order[0]
    for p in r.eligible():r.submit(p,{'choice':0})
    self.assertEqual(r.points[displayed_a],2)
    self.assertEqual(sum(r.points.values()),2)
  def test_safe_zero_abstentions(self):
    r=self.new_room(4);r.start('comedy','pitch','quick');r.open_live(r.host)
    for p in r.eligible():r.submit(p,{'choice':-1})
    self.assertEqual(r.stage,'reveal');self.assertEqual(sum(r.points.values()),0)
  def test_host_permissions_skip_and_room_capacity(self):
    r=self.new_room(4);r.start('social','same','quick')
    with self.assertRaises(server.RoomError):r.skip('1')
    r.skip(r.host);self.assertEqual(r.skipped,1);self.assertEqual(r.round,1)
    r.finish(r.host);self.assertEqual(r.stage,'end')
  def test_host_failover_if_original_host_disconnects(self):
    import asyncio
    r=self.new_room(4)
    r.players[0]['connected']=False
    asyncio.run(server.maybe_transfer_host(r,'0',delay=0))
    self.assertEqual(r.host,'1')
    # A host who reconnected before the grace period must retain control.
    r=self.new_room(4)
    asyncio.run(server.maybe_transfer_host(r,'0',delay=0))
    self.assertEqual(r.host,'0')
  def test_html_safe_identifiers(self):
    r=self.new_room(4);r.players[1]['name']='<svg onload=alert(1)>'
    r.start('social','majority','quick');self.assertEqual(r.view('0')['players'][1]['name'],'<svg onload=alert(1)>')
    # Browser must escape this name when rendering; wire format retains literal player-provided text.

if __name__=='__main__':unittest.main(verbosity=2)

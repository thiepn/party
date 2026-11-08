"""V3.1 deterministic tests for balanced opponents and human-friendly literal matching."""
import unittest
import server

class Quality31(unittest.TestCase):
    def room(self,n):
        room=server.Room('QUALITY31')
        room.players=[{'id':str(i),'name':str(i),'token':str(i),'connected':True,'ws':None} for i in range(n)]
        room.host='0';return room
    def test_long_duels_are_balanced_and_rotate_opponents(self):
        for n in (4,5,6):
            for count in (3,8,16):
                pairs=server.duel_schedule(n,count)
                self.assertEqual(len(pairs),count)
                seen=set();total=n*(n-1)//2
                counts=[0]*n
                for a,b in pairs:
                    self.assertNotEqual(a,b)
                    self.assertTrue((min(a,b),max(a,b)) not in seen or len(seen)==total,
                        f'Early repeated opponents: n={n}, count={count}, pair={(a,b)}')
                    seen.add((min(a,b),max(a,b)))
                    counts[a]+=1;counts[b]+=1
                self.assertLessEqual(max(counts)-min(counts),1)
                r=self.room(n);r.start('comedy','punchline','long')
                self.assertEqual(r.pair,list(map(str,server.duel_schedule(n,r.total)[0])))
                for turn in range(r.total):
                    self.assertEqual(r.pair,list(map(str,server.duel_schedule(n,r.total)[turn])))
                    r.skip(r.host) if r.stage in ('perform','live') else None
                self.assertEqual(r.stage,'end')
    def test_same_brain_punctuation_and_case_do_not_lose_points(self):
        r=self.room(4);r.start('social','same','quick')
        for pid,answer in zip(r.members(),[' Pizza! ','pizza','PIZZA.','pasta']):r.submit(pid,{'text':answer})
        self.assertEqual(r.stage,'reveal')
        self.assertEqual([r.points[p] for p in r.members()],[2,2,2,0])
        self.assertEqual(r.completed,1)
        # No guessed synonyms: two semantically related but distinct words remain separate.
        r=self.room(4);r.start('social','same','quick')
        for pid,answer in zip(r.members(),['Pizza','Pizzas','Pasta','Noodles']):r.submit(pid,{'text':answer})
        self.assertEqual(sum(r.points.values()),0)
    def test_fact_trap_removes_low_challenge_duplicates_without_deleting_sources(self):
        active=server.CONTENT['bluff']['fact']
        questions=[x['q']['en'] for x in active]
        answers=[server.normal(x['answer']['en']) for x in active]
        self.assertEqual(len(active),17)
        self.assertEqual(len(questions),len(set(questions)))
        self.assertEqual(len(answers),len(set(answers)))
        for easy in ('Which organ pumps blood around the body?',
                     'What is the largest planet in our solar system?',
                     'What is the main ingredient in traditional hummus?'):
            self.assertNotIn(easy,questions)
        # The supported Long mode needs twelve usable prompts.
        r=self.room(6);r.start('bluff','fact','long')
        self.assertEqual(len(r.deck),12)

    def test_private_answers_before_reveal_unchanged(self):
        r=self.room(4);r.start('social','same','quick')
        r.submit(r.members()[0],{'text':'Pizza!'})
        for pid in r.members()[1:]:
            self.assertNotIn('Pizza!',str(r.view(pid)))

if __name__=='__main__':unittest.main(verbosity=2)

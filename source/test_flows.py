from playwright.sync_api import sync_playwright, TimeoutError
from pathlib import Path
import os, shutil
CHROMIUM=os.getenv("CHROMIUM_PATH") or shutil.which("chromium") or shutil.which("google-chrome")
HTML=(Path(__file__).resolve().parent.parent/'CHAOS-CLUB-3.7-PLAY.html').read_text()
def click(p,a,val=None):
 sel=f'[data-act="{a}"]'+(f'[data-val="{val}"]' if val is not None else '')
 p.locator(sel).first.click(timeout=3500)
def start(p,id):
 p.set_content(HTML,wait_until='load')
 p.locator('[data-act="legacy-toggle"]').click()
 p.locator(f'[data-act="game"][data-val="{id}"]').click()
assertions=[]
def run(p,id,fn):
 try:
  start(p,id)
  fn(p)
  assertions.append((id,'PASS'))
 except Exception as e:
  assertions.append((id,'FAIL '+str(e)[:220]))
with sync_playwright() as w:
 b=w.chromium.launch(headless=True,executable_path=CHROMIUM,args=['--no-sandbox'])
 p=b.new_page(viewport={'width':390,'height':844})
 errs=[]
 p.on('pageerror',lambda e:errs.append(str(e)))
 run(p,'roulette',lambda p:[click(p,'deck-next') for _ in range(6)])
 def majority(p):
  for i in range(5):
   click(p,'forecast-set',0);click(p,'forecast-lock');p.locator('#count-range').fill('4');click(p,'forecast-reveal');click(p,'forecast-next')
  assert 'All five' in p.locator('.play-card').inner_text()
 run(p,'majority',majority)
 run(p,'most',lambda p:click(p,'deck-next'))
 def spectrum(p):
  for i in range(5):
   click(p,'spectrum-see');click(p,'spectrum-hide');p.locator('#guess-range').fill('7');click(p,'spectrum-result');click(p,'spectrum-next')
 run(p,'spectrum',spectrum)
 run(p,'paranoia',lambda p:(click(p,'para-see'),click(p,'para-hide'),click(p,'para-consent'),click(p,'para-reader-yes'),click(p,'para-nominated-yes'),click(p,'para-next')))
 run(p,'same',lambda p:click(p,'same-next'))
 def know(p):
  click(p,'know-see');click(p,'know-set',2);click(p,'know-hide');click(p,'know-reveal');click(p,'know-next')
 run(p,'know',know)
 def rank(p):
  click(p,'rank-see');click(p,'rank-down',0);click(p,'rank-hide');click(p,'rank-reveal');click(p,'rank-next')
 run(p,'rank',rank)
 run(p,'hot',lambda p:[click(p,'hot-pass') for _ in range(3)])
 run(p,'redflag',lambda p:click(p,'deck-next'))
 def role(p,id):
  for i in range(6):click(p,'role-see');click(p,'role-next')
  if id=='mimic':click(p,'mimic-cue');click(p,'mimic-cue')
  click(p,'role-accuse');[click(p,'role-vote-add',0) for _ in range(6)];click(p,'role-decide')
  if id=='spy':p.locator('#spy-input').fill('airport');click(p,'role-reveal');click(p,'spy-wrong')
  assert p.locator('.play-card').count()==1
 for x in ['undercover','spy','mimic']:run(p,x,lambda p,x=x:role(p,x))
 run(p,'bluff',lambda p:(click(p,'bluff-see'),click(p,'bluff-hide'),click(p,'bluff-reveal'),click(p,'bluff-next')))
 def who(p):
  for i in range(6):click(p,'who-see');p.locator('#private-text').fill('Test answer '+str(i));click(p,'who-save')
  for i in range(6):click(p,'who-reveal');click(p,'who-next')
 run(p,'who',who)
 run(p,'confession',lambda p:(click(p,'confession-real'),click(p,'confession-vote'),p.locator('#count-range').fill('3'),click(p,'confession-reveal'),click(p,'confession-next')))
 def missions(p):
  for i in range(6):click(p,'missions-see');click(p,'missions-next')
  click(p,'mission-claim',0);click(p,'mission-yes');click(p,'mission-new-see');click(p,'mission-new-hide');click(p,'missions-finish')
 run(p,'missions',missions)
 def bad(p):
  click(p,'bad-write')
  for i in range(6):click(p,'bad-see');p.locator('#private-text').fill('Funny line '+str(i));click(p,'bad-save')
  for i in range(6):click(p,'bad-vote-see');click(p,'bad-vote-skip')
  click(p,'bad-next')
 run(p,'bad',bad)
 def perform(p):
  for i in range(4):
   click(p,'perform-see');click(p,'perform-correct');click(p,'perform-pass');click(p,'perform-stop');click(p,'perform-next')
 for x in ['charades','taboo']:run(p,x,perform)
 run(p,'story',lambda p:[click(p,'story-next') for _ in range(12)])
 run(p,'pitch',lambda p:[click(p,'pitch-sold') for _ in range(6)])
 def whisper(p):
  click(p,'whisper-see');click(p,'whisper-hide');click(p,'whisper-last');p.locator('#private-text').fill('What I heard');click(p,'whisper-reveal');click(p,'whisper-next')
 run(p,'whisper',whisper)
 def three(p):
  for ph in range(3):
   click(p,'three-start')
   for x in range(8):click(p,'three-correct')
   click(p,'three-next')
  assert p.locator('.play-card').count()==1
 run(p,'three',three)
 run(p,'expert',lambda p:[click(p,'expert-next') for _ in range(6)])
 def drawing(p):
  p.locator('#private-text').fill('A dog driving a spaceship');click(p,'draw-text')
  for j in range(3):
   c=p.locator('#drawing');c.scroll_into_view_if_needed();box=c.bounding_box();p.mouse.move(box['x']+25,box['y']+25);p.mouse.down();p.mouse.move(box['x']+100,box['y']+120,steps=5);p.mouse.up();click(p,'draw-submit')
   if j<2:p.locator('#private-text').fill('Somebody sees a strange animal '+str(j));click(p,'draw-text')
  assert 'full chain' in p.locator('.play-card').inner_text().lower()
 run(p,'draw',drawing)
 run(p,'never',lambda p:click(p,'deck-next'))
 run(p,'truth',lambda p:(click(p,'truth-dare'),click(p,'truth-another'),click(p,'truth-next')))
 run(p,'sip',lambda p:click(p,'deck-next'))
 def kings(p):
  for i in range(52):click(p,'king-draw');click(p,'king-next')
 run(p,'kings',kings)
 run(p,'house',lambda p:(click(p,'house-add',0),click(p,'house-add',1),click(p,'house-remove',0)))
 def bingo(p):
  for i in [0,1,2]:click(p,'bingo-mark',i);click(p,'bingo-confirm')
  assert 'BINGO' in p.locator('.play-card').inner_text()
 run(p,'bingo',bingo)
 run(p,'toast',lambda p:(click(p,'toast-first'),click(p,'toast-second'),click(p,'toast-tie')))
 run(p,'last',lambda p:(click(p,'length',0),*[click(p,'deck-next') for _ in range(5)]))
 print('RESULTS:')
 for item in assertions: print(*item)
 print('PASSED',sum(x[1]=='PASS' for x in assertions),'/',len(assertions))
 print('PAGE ERRORS:',len(errs),errs[:20])
 b.close()

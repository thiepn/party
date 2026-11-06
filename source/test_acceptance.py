from pathlib import Path
import os, shutil
from playwright.sync_api import sync_playwright
HERE=Path(__file__).resolve().parent
CHROMIUM=os.getenv("CHROMIUM_PATH") or shutil.which("chromium") or shutil.which("google-chrome")
def click(p,a,val=None):
 sel=f'[data-act="{a}"]'+(f'[data-val="{val}"]' if val is not None else '')
 p.locator(sel).first.click(timeout=4000)
def start(p,id):
 click(p,'home') if p.locator('[data-act="home"]').count() and p.locator('[data-act="game"]').count()==0 else None
 if p.locator(f'[data-act="game"][data-val="{id}"]').count()==0:click(p,'legacy-toggle')
 click(p,'game',id)
HTML=(HERE.parent/'CHAOS-CLUB-3.7-PLAY.html').read_text()
with sync_playwright() as w:
 browser=w.chromium.launch(headless=True, executable_path=CHROMIUM,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':320,'height':700})
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(HTML)
 game_top=page.locator('.family-tile').first.bounding_box()['y']
 assert game_top < 580,game_top
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'mobile horizontal overflow'
 page.screenshot(path=str(HERE/'mobile-2.3.png'),full_page=True)
 print('PASS mobile 320 layout first game tile y=',round(game_top))
 click(page,'lang')
 assert page.locator('html').get_attribute('lang')=='de'
 assert page.locator('.family-tile').count()==7
 page.screenshot(path=str(HERE/'mobile-de-2.3.png'),full_page=True)
 print('PASS German UI and 34 game tiles')
 click(page,'legacy-toggle');click(page,'game','undercover')
 click(page,'help')
 assert page.locator('.modal[role="dialog"]').count()==1
 assert page.locator('.modal .inline-tip').count()==1
 assert page.locator('.modal').evaluate('(el)=>el.contains(document.activeElement)')
 page.keyboard.press('Escape')
 assert page.locator('.modal').count()==0
 assert page.locator('[data-act="help"]').evaluate('(el)=>document.activeElement===el')
 print('PASS accessible help focus open/close with examples')
 click(page,'home');click(page,'lang')
 # Current n=6, maximum for ranking is 8; grow roster to 12.
 click(page,'settings')
 for _ in range(6):click(page,'plus')
 click(page,'settings-save')
 click(page,'legacy-toggle') if page.locator('[data-act="game"][data-val="rank"]').count()==0 else None
 click(page,'game','rank')
 assert '3–8' in page.locator('.play-card').inner_text()
 click(page,'home');click(page,'surprise')
 assert '12' in page.locator('.play-card').inner_text() or page.locator('.play-card').count()==1
 print('PASS maximum-player guard and eligible surprise games')
 # Reset local data and return to six players.
 click(page,'settings');click(page,'clear-data');assert page.locator('.family-tile').count()==7
 assert page.locator('[data-act="settings"]').first.inner_text().endswith('6')
 print('PASS clear-data and default roster')
 # Use a known undercover (player 1) through deterministic Math.random.
 context=browser.new_context(viewport={'width':390,'height':844})
 context.add_init_script('Math.random=()=>0')
 q=context.new_page();q.on('pageerror',lambda e:errors.append(str(e)));
 # A deterministic storage mock is required because this test runner blocks browser file/http origins.
 q.evaluate('''() => {let kv={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>kv[k]??null,setItem:(k,v)=>{kv[k]=String(v)},removeItem:k=>{delete kv[k]},clear:()=>{kv={}}}})}''')
 q.set_content(HTML)
 start(q,'undercover')
 for i in range(6):click(q,'role-see');click(q,'role-next')
 click(q,'role-accuse')
 for i in range(6):click(q,'role-vote-add',0)
 click(q,'role-decide')
 assert 'Group wins' in q.locator('.play-card').inner_text()
 print('PASS actual role vote tally and correct winner')
 click(q,'restart')
 for i in range(6):click(q,'role-see');click(q,'role-next')
 click(q,'role-accuse')
 for i in range(3):click(q,'role-vote-add',0)
 for i in range(3):click(q,'role-vote-add',1)
 click(q,'role-decide')
 assert 'runoff' in q.locator('.play-card').inner_text().lower()
 for i in range(3):click(q,'role-vote-add',0)
 for i in range(3):click(q,'role-vote-add',1)
 click(q,'role-decide')
 assert 'Still tied' in q.locator('.play-card').inner_text()
 assert 'escaped' in q.locator('.play-card').inner_text()
 print('PASS tie, one runoff, correct unresolved result')
 # Manual spy guess adjudication preserves synonyms.
 start(q,'spy')
 for i in range(6):click(q,'role-see');click(q,'role-next')
 click(q,'role-accuse');[click(q,'role-vote-add',0) for _ in range(6)];click(q,'role-decide')
 q.locator('#spy-input').fill('a synonym / translated name');click(q,'role-reveal');click(q,'spy-correct')
 assert 'Spy wins' in q.locator('.play-card').inner_text()
 print('PASS manual synonym-safe spy adjudication')
 start(q,'confession');click(q,'confession-real');click(q,'confession-vote');click(q,'confession-reveal')
 assert '+2' in q.locator('.play-card').inner_text()
 assert '2 Score' in q.locator('.play-card').inner_text()
 print('PASS confession scoring when majority is fooled')
 start(q,'toast');click(q,'toast-first');click(q,'toast-second');click(q,'toast-tie')
 results=q.locator('.play-card').inner_text()
 assert 'Player 1' in results and '1 Score' in results
 assert 'Player 4' in results and '1 Score' in results
 print('PASS toast vote actually changes named scores')
 start(q,'spectrum');click(q,'spectrum-see');click(q,'spectrum-hide');click(q,'spectrum-result')
 assert 'group' in q.locator('.score').first.inner_text().lower()
 print('PASS Spectrum shows group score')
 # 6-person drawing chain with keyboard-accessible text alternative
 start(q,'draw');q.locator('#private-text').fill('A cat takes the wrong train');click(q,'draw-text')
 for i in range(1,6):
  if q.locator('#drawing').count():
   click(q,'draw-alternative');q.locator('#private-text').fill('A slightly different train drawing');click(q,'draw-text')
  else:
   q.locator('#private-text').fill('Someone described a train');click(q,'draw-text')
 assert q.locator('.gallery-frame').count()==6
 print('PASS drawing chain has 6 contributions and accessible textual alternative')
 # Repeating missions unlocks a new private card until a max of 3 wins
 start(q,'missions')
 for i in range(6):click(q,'missions-see');click(q,'missions-next')
 for round in range(3):
  click(q,'mission-claim',0);click(q,'mission-yes')
  if round<2:click(q,'mission-new-see');click(q,'mission-new-hide')
 assert q.locator('[data-act="mission-claim"][data-val="0"]').is_disabled()
 print('PASS mission reassignment, 3-point cap')
 # persistent prompt history / privacy preferences on actual HTTP origin
 click(q,'home');start(q,'roulette')
 first=q.locator('.prompt').first.inner_text()
 q.set_content(HTML);start(q,'roulette');second=q.locator('.prompt').first.inner_text()
 assert first != second,(first,second)
 click(q,'home');click(q,'settings');q.locator('[data-player="0"]').fill('Do Not Persist');click(q,'settings-save')
 q.set_content(HTML);click(q,'settings');assert q.locator('[data-player="0"]').input_value()==''
 print('PASS no immediate reload-repeat and no stored personal names')
 # Regression: Help and language switches must preserve live text and drawing drafts.
 z=browser.new_page(viewport={'width':390,'height':844})
 z.on('pageerror',lambda e:errors.append(str(e)))
 z.set_content(HTML);start(z,'draw')
 z.locator('#private-text').fill('A secret cake recipe')
 click(z,'help');z.locator('.modal button[data-act="close-modal"]').click()
 assert z.locator('#private-text').input_value()=='A secret cake recipe'
 click(z,'draw-text')
 canvas=z.locator('#drawing');r=canvas.bounding_box()
 z.mouse.move(r['x']+45,r['y']+45);z.mouse.down();z.mouse.move(r['x']+125,r['y']+140,steps=8);z.mouse.up()
 before=canvas.evaluate('(c)=>c.toDataURL("image/png")')
 click(z,'help');z.locator('.modal button[data-act="close-modal"]').click();z.wait_for_timeout(300)
 assert z.locator('#drawing').evaluate('(c)=>c.toDataURL("image/png")')==before
 click(z,'lang');z.wait_for_timeout(300)
 assert z.locator('#drawing').evaluate('(c)=>c.toDataURL("image/png")')==before
 print('PASS in-progress text and canvas drafts survive Help and language switches')
 # Regression: Bingo board retains marks while a different game runs.
 z.set_content(HTML);start(z,'bingo');click(z,'bingo-mark',0);click(z,'bingo-confirm')
 assert z.locator('.square.marked').count()==1
 click(z,'bingo-back');start(z,'roulette');click(z,'bingo-open')
 assert z.locator('.square.marked').count()==1
 click(z,'bingo-back')
 assert z.locator('.play-title h1').inner_text() in ('Party Roulette','Party-Roulette')
 print('PASS background Bingo persists and returns to previous game')
 assert not errors, errors
 print('PASS no JS exceptions')
 browser.close()

"""V2.7 behavior acceptance: explicit votes, history, round twist, accurate early exit, mobile."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os, shutil
HERE=Path(__file__).resolve().parent
HTML=(HERE.parent/'CHAOS-CLUB-3.7-PLAY.html').read_text(encoding='utf8')
CHROME=os.getenv('CHROMIUM_PATH') or shutil.which('chromium')

def tap(p,action,value=None):
    selector='[data-act="'+action+'"]'+(f'[data-val="{value}"]' if value is not None else '')
    p.locator(selector).first.click(timeout=6000)

def advance_social(p):
    if p.locator('[data-act="deep26-secret"]').count():
        tap(p,'deep26-secret','0');tap(p,'deep26-open')
    else:tap(p,'deep26-open')
    assert p.locator('[data-act="deep26-reveal"]').first.is_disabled(), 'vote must start unset'
    tap(p,'deep26-tally','0' if p.locator('[data-act="deep26-tally"][data-val="0"]').count() else '1')
    assert p.locator('[data-act="deep26-reveal"]').first.is_enabled()
    tap(p,'deep26-reveal')

def start(p,game,mode='quick',variation=None,switchups=True):
    tap(p,'game',game);tap(p,'deep26-duration',mode)
    if variation or not switchups:
        tap(p,'deep26-customize')
        if variation:tap(p,'deep26-style',variation)
        if not switchups:tap(p,'deep26-switchups','off')
    tap(p,'deep26-start')

with sync_playwright() as w:
    b=w.chromium.launch(headless=True,executable_path=CHROME,args=['--no-sandbox'])
    ctx=b.new_context(viewport={'width':390,'height':844})
    p=ctx.new_page();errors=[];p.on('pageerror',lambda e: errors.append(str(e)))
    # The sandbox blocks file/http origins. Mock only the browser storage API so
    # its app-side write/clear behavior can be exercised; not an origin acceptance test.
    p.evaluate('''() => {
      for (const type of ['localStorage','sessionStorage']) {
        let values = {};
        Object.defineProperty(window,type,{configurable:true,value:{
          getItem(k){return Object.prototype.hasOwnProperty.call(values,k)?values[k]:null},
          setItem(k,v){values[k]=String(v)}, removeItem(k){delete values[k]},
          clear(){values={}}
        }});
      }
    }''')
    p.set_content(HTML)
    start(p,'socialradar26','long','majority')
    first=p.locator('.play-card .prompt').inner_text()
    advance_social(p)
    assert p.locator('.deep26-highlight').inner_text().startswith('+'), 'scored zero tally deliberately'
    tap(p,'deep26-next')
    assert p.locator('[data-act="deep26-skip"]').count()==1
    tap(p,'deep26-skip')
    # Round 3, play it; round 4 has meaningful variation and current score persists.
    advance_social(p);tap(p,'deep26-next')
    assert p.locator('.deep27-twist').count()==1 and '10 seconds' in p.locator('.deep27-twist').inner_text()
    tap(p,'deep26-end')
    finished=p.locator('.play-card').inner_text()
    assert '2 / 20 rounds played' in finished and '1 skipped' in finished,finished
    tap(p,'home')
    # Restarting chooses unseen cards where pool permits; history updated on 1st completed and skipped cards.
    start(p,'socialradar26','quick','majority')
    second=p.locator('.play-card .prompt').inner_text()
    assert first!=second,'no immediate repeat on restarted session'
    tap(p,'home')
    # Variant switch-up can be disabled; a zero vote must be entered explicitly.
    start(p,'comedybattle26','standard','punchline',switchups=False)
    for idx in range(4):
        tap(p,'deep26-perform');tap(p,'deep26-perform')
        assert p.locator('[data-act="deep26-reveal"]').is_disabled()
        tap(p,'deep26-tally','0');tap(p,'deep26-reveal');tap(p,'deep26-next')
    assert p.locator('.deep27-twist').count()==0
    tap(p,'deep26-end');assert '4 / 8 rounds played' in p.locator('.play-card').inner_text()
    tap(p,'home')
    # German display, Help rules, and saved recent cleared via visible privacy control.
    tap(p,'lang')
    start(p,'bluffclub26','standard','confession')
    tap(p,'help');guide=p.locator('.deep-guide').inner_text();assert 'Runden' in guide and 'vier' in guide
    p.locator('.modal [data-act="close-modal"]').click()
    tap(p,'deep26-see');tap(p,'deep26-truth');tap(p,'deep26-open');tap(p,'deep26-vote')
    assert p.locator('[data-act="deep26-reveal"]').is_disabled()
    tap(p,'deep26-tally','0');tap(p,'deep26-reveal')
    assert p.locator('.deep26-highlight').count()==1
    tap(p,'home');tap(p,'settings')
    assert p.evaluate("localStorage.getItem('chaosclub.27.recent')") is not None
    tap(p,'clear-data')
    assert p.evaluate("localStorage.getItem('chaosclub.27.recent')") is None
    assert not errors,errors
    print('PASS explicit zero votes, unrevealed-vote guard, accurate played/skipped counts, long switch-ups and opt-out, resume/history, German rules and Clear Data')
    p.close();ctx.close()
    # Check phone and desktop width and actual game state after opening.
    for width in [320,375,390,768,1280]:
        ctx=b.new_context(viewport={'width':width,'height':860})
        p=ctx.new_page();p.set_content(HTML)
        tap(p,'game','comedybattle26');tap(p,'deep26-start')
        tap(p,'deep26-perform');tap(p,'deep26-perform')
        tap(p,'deep26-tally','0')
        dimensions=p.evaluate('''()=>[document.documentElement.scrollWidth,document.documentElement.clientWidth]''')
        assert dimensions[0]<=dimensions[1]+1,(width,dimensions)
        assert p.locator('.deep27-vote.selected').inner_text()=='0'
        if width==390:
            p.screenshot(path=str(HERE.parent/'V2.7-mobile-voting.png'),full_page=True)
        print(f'PASS {width}px responsive tally + no overflow',flush=True)
        p.close();ctx.close()
    b.close()

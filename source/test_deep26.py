"""CHAOS CLUB 2.6 full-session and bilingual gameplay acceptance, Chromium."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,shutil
HERE=Path(__file__).resolve().parent
HTML=(HERE.parent/'CHAOS-CLUB-3.7-PLAY.html').read_text('utf8')
CHROME=os.getenv('CHROMIUM_PATH') or shutil.which('chromium')
IDS={'social':'socialradar26','comedy':'comedybattle26','bluff':'bluffclub26'}
DURATIONS={'social':{'quick':4,'standard':10,'long':20},'comedy':{'quick':3,'standard':8,'long':16},'bluff':{'quick':3,'standard':7,'long':12}}
def tap(p,a,val=None):
    sel='[data-act="'+a+'"]'+(f'[data-val="{val}"]' if val is not None else '')
    p.locator(sel).first.click(timeout=7000)
def count_players(p,n):
    tap(p,'settings')
    for _ in range(12):
        count=int(p.locator('.settings-panel .spaced strong').first.inner_text())
        if count==n:break
        tap(p,'minus' if count>n else 'plus')
    tap(p,'settings-save')
def start(p,k,d='quick',style='mixed'):
    tap(p,'game',IDS[k])
    tap(p,'deep26-duration',d)
    if style!='mixed':
        tap(p,'deep26-customize');tap(p,'deep26-style',style)
    tap(p,'deep26-start')
    assert not p.locator('[data-act="deep26-start"]').count(),f'not started {k}/{d}/{style}'
def play_round(p,k,n,observed):
    if k=='social':
        if p.locator('[data-act="deep26-secret"]').count():
            tap(p,'deep26-secret','0');assert 'Pass' in p.locator('.play-card').inner_text() or 'Gib' in p.locator('.play-card').inner_text() or 'Gebt' in p.locator('.play-card').inner_text()
            tap(p,'deep26-open')
        elif p.locator('[data-act="deep26-open"]').count(): tap(p,'deep26-open')
        assert p.locator('[data-act="deep26-reveal"]').count()==1
        tap(p,'deep26-tally','1')
        tap(p,'deep26-reveal')
    elif k=='comedy':
        tap(p,'deep26-perform');tap(p,'deep26-perform')
        assert p.locator('[data-act="deep26-reveal"]').count()==1
        tap(p,'deep26-tally','1');tap(p,'deep26-reveal')
    else:
        tap(p,'deep26-see')
        if p.locator('[data-act="deep26-hide"]').count(): tap(p,'deep26-hide')
        elif p.locator('[data-act="deep26-truth"]').count(): tap(p,'deep26-truth')
        elif p.locator('[data-act="deep26-lie"]').count(): tap(p,'deep26-lie','2')
        else: raise AssertionError('No correct private choice')
        tap(p,'deep26-open');tap(p,'deep26-vote')
        if p.locator('[data-act="deep26-factyes"]').count():tap(p,'deep26-factyes')
        else:
            tap(p,'deep26-tally','1');tap(p,'deep26-reveal')
    assert p.locator('[data-act="deep26-next"]').count()==1
    observed.append(p.locator('.round-label').first.inner_text())
    tap(p,'deep26-next')

def session(p,k,n,d='quick',style='mixed'):
    count_players(p,n);start(p,k,d,style)
    observed=[]
    for r in range(DURATIONS[k][d]):
        play_round(p,k,n,observed)
    assert p.locator('[data-act="deep26-restart"]').count()==1, f'no results {k}/{n}/{d}/{style}'
    assert len(observed)==DURATIONS[k][d]
    tap(p,'home');print('PASS',k,n,d,style,'full rounds',len(observed),flush=True)

with sync_playwright() as w:
    b=w.chromium.launch(headless=True,executable_path=CHROME,args=['--no-sandbox'])
    p=b.new_page(viewport={'width':390,'height':844})
    errors=[];p.on('pageerror',lambda error:errors.append(str(error)))
    p.set_content(HTML)
    assert p.locator('.family-tile').count()==7
    for k in IDS:
        assert p.locator(f'[data-act="game"][data-val="{IDS[k]}"]').count()==1
    tap(p,'legacy-toggle')
    assert p.locator('.game-tile').count()==34
    print('PASS seven live game families and all 34 originals',flush=True)
    part=os.getenv('CHAOS26_TEST_PART','all')
    if part in ('all','full'):
        for n,d in [(4,'quick'),(5,'standard'),(6,'long')]:
            for k in ['social','comedy','bluff']:
                session(p,k,n,d)
    if part in ('all','variants'):
        for k,variants in [('social',['majority','same','know']),('comedy',['punchline','pitch','expert','toast']),('bluff',['confession','twotruths','fact'])]:
            for style in variants:session(p,k,6,'quick',style)
    if part in ('all','recovery'):
        # Confirm session resume in private state without leaking a secret.
        count_players(p,6);start(p,'social','quick','majority')
        tap(p,'deep26-secret','1')
        assert not p.locator('[data-act="deep26-secret"]').count()
        tap(p,'home');tap(p,'game',IDS['social'])
        assert p.locator('[data-act="deep26-open"]').count()==1
        tap(p,'lang');assert p.locator('html').get_attribute('lang')=='de'
        tap(p,'help');helptext=p.locator('.deep-guide').inner_text()
        assert 'Punkte' in helptext and 'Gruppenmeinung' in helptext
        p.locator('.modal [data-act="close-modal"]').click();tap(p,'deep26-open')
        assert p.locator('[data-act="deep26-reveal"]').count()
        tap(p,'deep26-tally','0');tap(p,'deep26-reveal')
        tap(p,'home');print('PASS resume secret state, localized guides, complete reveal',flush=True)
        start(p,'bluff','quick','fact')
        tap(p,'deep26-skip');assert p.locator('.round-label').inner_text().startswith('2/3')
        tap(p,'deep26-end');assert p.locator('[data-act="deep26-restart"]').count()
        print('PASS skip without penalty and voluntary end',flush=True)
    assert not errors,errors
    b.close();print('PASS zero Chromium page errors',flush=True)

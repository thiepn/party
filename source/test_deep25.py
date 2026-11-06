"""V2.5 rules, role rotation, real game completion and regression acceptance. Uses Chromium."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os, shutil
HTML=(Path(__file__).resolve().parent.parent/'CHAOS-CLUB-3.7-PLAY.html').read_text(encoding='utf-8')
CHROME=os.getenv('CHROMIUM_PATH') or shutil.which('chromium')

def tap(p,a,v=None):
    q=p.locator('[data-act="'+a+'"]'+(f'[data-val="{v}"]' if v is not None else '')).first
    q.click(timeout=6000)

def players(p,count):
    tap(p,'settings')
    while int(p.locator('.settings-panel .spaced strong').first.inner_text()) != count:
        old=int(p.locator('.settings-panel .spaced strong').first.inner_text())
        tap(p,'plus' if old<count else 'minus')
    tap(p,'settings-save')

def start(p,g,mode='quick',style=None):
    tap(p,'game',g)
    tap(p,'deep25-duration',mode)
    if style:
        tap(p,'deep25-customize');tap(p,'deep25-style',style)
    tap(p,'deep25-start')

def role_flow(p,correct=False,alternate=False):
    n=int(p.locator('.deep25-player').first.inner_text().split('/')[-1])
    bad=None
    for _ in range(n):
        tap(p,'imp25-see')
        label=p.locator('.deep25-secret strong').first.inner_text()
        if 'Impostor' in label or 'Betrüger' in label:bad=_
        tap(p,'imp25-hide')
    assert bad is not None
    if p.locator('[data-act="imp25-action"]').count():
        tap(p,'imp25-action');tap(p,'imp25-action')
    tap(p,'imp25-vote')
    assert p.locator('[data-act="imp25-decide"]').is_disabled()
    # One incomplete vote may never produce a result.
    tap(p,'imp25-plus',str(bad if correct else (bad+1)%n))
    assert p.locator('[data-act="imp25-decide"]').is_disabled()
    # Tie 3-3 at 6 players, otherwise enter a full vote for the selected candidate.
    if alternate and n%2==0:
        other=(bad+1)%n
        tap(p,'imp25-minus',str(bad if correct else other))
        for _ in range(n//2):tap(p,'imp25-plus',str(bad))
        for _ in range(n//2):tap(p,'imp25-plus',str(other))
        tap(p,'imp25-decide')
        assert 'runoff' in p.locator('.round-label').inner_text().lower()
        assert p.locator('[data-act="imp25-decide"]').is_disabled()
        for _ in range(n):tap(p,'imp25-plus',str(bad))
    else:
        target=bad if correct else (bad+1)%n
        for _ in range(n-1):tap(p,'imp25-plus',str(target))
    tap(p,'imp25-decide')
    if p.locator('[data-act="imp25-guess"]').count():
        p.locator('#imp25-location').fill('Airport')
        tap(p,'imp25-guess');assert p.locator('[data-act="imp25-correct"]').count()
        tap(p,'imp25-wrong')
    assert p.locator('[data-act="imp25-next"]').count()
    return bad

def team_flow(p,expected_cards,stages):
    seen=[]
    for j in range(expected_cards*stages):
        if p.locator('[data-act="team25-start"]').count():tap(p,'team25-start')
        assert p.locator('[data-act="team25-correct"]').count(),f'missing correct on {j}'
        if j==0:
            seen.append(p.locator('.play-card .prompt').inner_text())
            tap(p,'team25-pass')
            assert p.locator('[data-act="team25-correct"]').count()
        tap(p,'team25-correct')
    assert p.locator('.deep25-scores').count()
    assert 'complete' in p.locator('.play-card').inner_text().lower() or 'beendet' in p.locator('.play-card').inner_text().lower()
    assert sum(int(x) for x in p.locator('.deep25-scores b').all_inner_texts() for x in [x.split()[0]])==expected_cards*stages
    return seen

with sync_playwright() as w:
    b=w.chromium.launch(headless=True,executable_path=CHROME,args=['--no-sandbox'])
    p=b.new_page(viewport={'width':390,'height':844})
    errs=[];p.on('pageerror',lambda e:errs.append(str(e)))
    p.set_content(HTML)
    assert p.locator('.family-tile').count()==7
    for id in ['impostornight25','teamshowdown25']:
        assert p.locator(f'[data-act="game"][data-val="{id}"]').count()==1
    tap(p,'legacy-toggle');assert p.locator('.game-tile').count()==34
    print('PASS 7 family tiles, 34 originals and two live V2.5 entries',flush=True)
    players(p,4);start(p,'impostornight25',style='undercover');role_flow(p,correct=True);tap(p,'imp25-next')
    assert p.locator('[data-act="deep25-restart"]').count()
    print('PASS 4-person Undercover quick mode, full tally and scoring',flush=True)
    tap(p,'home');players(p,5);start(p,'impostornight25','standard','mixed')
    roles=[]
    for i in range(4):
        roles.append(role_flow(p,correct=(i%2==0)))
        tap(p,'imp25-next')
    assert len(set(roles))==4
    print('PASS 5-person mixed 4-match session, rotated roles and outcome score screen',flush=True)
    tap(p,'home');players(p,6);start(p,'impostornight25','long','mixed')
    roles=[]
    for i in range(8):
        roles.append(role_flow(p,correct=(i%2==1),alternate=i==0))
        if i==0:
            tap(p,'home');tap(p,'game','impostornight25');assert p.locator('[data-act="imp25-next"]').count()
        tap(p,'imp25-next')
    assert set(roles)==set(range(6)),roles
    assert p.locator('[data-act="deep25-restart"]').count()
    print('PASS 6-person 8-match session with full role coverage, runoff, and session resume',flush=True)
    tap(p,'home');players(p,4);start(p,'teamshowdown25','quick','classic');team_flow(p,8,1)
    print('PASS 4-person Team Showdown quick, 8 guessed cards',flush=True)
    tap(p,'home');players(p,5);start(p,'teamshowdown25','standard','taboo');
    assert p.locator('[data-act="team25-start"]').count()
    team_flow(p,12,2)
    print('PASS 5-person team rotation and 2-stage Taboo mode',flush=True)
    tap(p,'home');players(p,6);start(p,'teamshowdown25','long','chaos');team_flow(p,18,3)
    print('PASS 6-person 3-stage 54-guess long session with retained scores',flush=True)
    tap(p,'home');start(p,'impostornight25','quick','mimic');tap(p,'help');assert p.locator('.modal ol li').count()>=6
    p.locator('.modal button[data-act="close-modal"]').click();tap(p,'lang');assert p.locator('html').get_attribute('lang')=='de';tap(p,'imp25-see');assert 'Geheime' not in p.locator('.play-card').inner_text() or p.locator('.deep25-secret').count()==1
    print('PASS bilingual game instructions, German role text and privacy handoff',flush=True)
    assert not errs,errs
    print('PASS no JavaScript page exceptions',flush=True)
    b.close()

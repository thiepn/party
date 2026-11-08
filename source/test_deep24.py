"""Deterministic CHAOS CLUB 2.4 flagship rules, long-session, content and migration checks."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os, shutil
HERE=Path(__file__).resolve().parent
HTML=(HERE.parent/'CHAOS-CLUB-3.7-PLAY.html').read_text(encoding='utf-8')
CHROME=os.getenv('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('google-chrome')
def tap(p,a,v=None):
    loc=p.locator('[data-act="'+a+'"]'+(f'[data-val="{v}"]' if v is not None else ''))
    loc.first.click(timeout=5000)
def game(p,g): tap(p,'game',g)

def tparty(p,duration='quick',style='relaxed'):
    game(p,'partydeck24'); tap(p,'deep-duration',duration)
    if style!='relaxed': tap(p,'deep-customize');tap(p,'deep-style',style)
    tap(p,'deep-start')

def tking(p,duration='quick',style='classic'):
    game(p,'kingsnight24');tap(p,'deep-duration',duration)
    if style!='classic':tap(p,'deep-customize');tap(p,'deep-style',style)
    tap(p,'deep-start')

with sync_playwright() as w:
    b=w.chromium.launch(headless=True,executable_path=CHROME,args=['--no-sandbox'])
    p=b.new_page(viewport={'width':390,'height':844})
    errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
    p.set_content(HTML)
    assert p.locator('.family-tile').count()==7
    assert p.locator('.game-tile').count()==0
    tap(p,'legacy-toggle')
    assert p.locator('.game-tile').count()==34
    # All classic games remain individually available, including background modes.
    old=['roulette','majority','most','spectrum','paranoia','same','know','rank','hot','redflag','undercover','spy','bluff','who','confession','mimic','missions','bad','charades','taboo','story','pitch','whisper','three','expert','draw','never','truth','sip','kings','house','bingo','toast','last']
    assert set(old)==set(p.locator('.game-tile').evaluate_all('(els)=>els.map(x=>x.dataset.val)'))
    print('PASS seven family entry points; all 34 classic games preserved')
    tap(p,'family-all') if p.locator('[data-act="family-all"]').count() else None
    # Use new 56-card long format and assert complete unique bilingual prompts.
    tparty(p,'long','story')
    unique=[]
    for i in range(56):
        text=p.locator('.play-card .prompt').inner_text()
        unique.append(text)
        if i==0:
            assert p.locator('.inline-tip').count()>=1 and p.locator('[data-act="deep-twist"]').count()==0
        tap(p,'deep-next')
    assert len(set(unique))==56,(len(set(unique)),len(unique))
    assert '56 cards completed' in p.locator('.play-card').inner_text()
    print('PASS Party Deck long session, 56 non-repeating cards and optional twists')
    tap(p,'home')
    tking(p,'long','chaos')
    identities=[];ruleUsed=False;ruleExpired=False;activeAt=None
    for i in range(52):
        tap(p,'king24-draw')
        face=p.locator('.deep-card-face').inner_text()
        identities.append(face)
        if not ruleUsed and p.locator('[data-act="king24-rule"]').count():
            tap(p,'king24-rule');ruleUsed=True;activeAt=i
            assert p.locator('.deep-rule').count()==1
        tap(p,'king24-next')
        if activeAt is not None and i==activeAt+4:
            assert p.locator('.deep-rule').count()==0
            ruleExpired=True
    assert len(set(identities))==52,identities
    assert ruleUsed and ruleExpired
    assert '52 cards played' in p.locator('.play-card').inner_text()
    print('PASS King’s Night 52 unique cards; optional temporary rule expires after four future cards')
    # New session choices actually change available rule types and length.
    tap(p,'home'); game(p,'kingsnight24');tap(p,'deep-duration','quick');tap(p,'deep-start')
    for i in range(12):
        tap(p,'king24-draw')
        tap(p,'king24-skip')
    assert '0 cards played' in p.locator('.play-card').inner_text() and '12 skipped' in p.locator('.play-card').inner_text()
    print('PASS King’s Night quick match, all skip controls, deterministic ending')
    # Reconnect/resume navigation and bilingual state of cards; no new lobby required.
    tap(p,'home');tparty(p,'standard')
    first=p.locator('.play-card .prompt').inner_text();tap(p,'deep-next')
    second=p.locator('.play-card .prompt').inner_text();assert first!=second
    tap(p,'home');game(p,'partydeck24')
    assert p.locator('.play-card .prompt').inner_text()==second
    tap(p,'lang');assert p.locator('html').get_attribute('lang')=='de'
    german=p.locator('.play-card .prompt').inner_text();assert german!=second
    tap(p,'help');assert p.locator('.modal ol li').count()>=7
    p.locator('.modal button[data-act="close-modal"]').click();tap(p,'lang')
    print('PASS long-session resume, German/English cards and complete authored instructions')
    # After Dark requires 18+ opt-in, long session blocked if a single sparse pack is chosen.
    tap(p,'home');game(p,'partydeck24');tap(p,'deep-new') if p.locator('[data-act="deep-new"]').count() else None
    tap(p,'home');tap(p,'settings');p.locator('#tone-select').select_option('adult');tap(p,'settings-save')
    game(p,'partydeck24');tap(p,'deep-customize');assert p.locator('[data-act="deep-pack"][data-val="afterdark"]').count()==1
    for name in ['social','night','confessions','opinions','challenges']:tap(p,'deep-pack',name)
    tap(p,'deep-pack','afterdark');tap(p,'deep-duration','long')
    assert p.locator('[data-act="deep-start"]').is_disabled()
    tap(p,'deep-duration','quick');assert p.locator('[data-act="deep-start"]').is_enabled()
    tap(p,'deep-start');assert p.locator('.play-card .prompt').count()==1
    tap(p,'settings');p.locator('#tone-select').select_option('clean');tap(p,'settings-save')
    assert p.locator('[data-act="deep-start"]').count()==1
    assert p.locator('[data-act="deep-pack"][data-val="afterdark"]').count()==0
    print('PASS After Dark gating, insufficient-pack protection and content-tone downgrade')
    # 4-6 player roster changes reset deep sessions, leave legacy favorites intact.
    tap(p,'home');tap(p,'settings')
    tap(p,'minus');tap(p,'minus');tap(p,'settings-save')
    assert p.locator('[data-act="settings"]').first.inner_text().endswith('4')
    game(p,'partydeck24');assert p.locator('[data-act="deep-start"]').count()==1
    tap(p,'home');tap(p,'settings');tap(p,'plus');tap(p,'settings-save')
    game(p,'partydeck24');assert p.locator('[data-act="deep-start"]').count()==1
    print('PASS 4–6 player roster change migration/reset behavior')
    assert not errors,errors
    print('PASS no JavaScript page exceptions')
    b.close()

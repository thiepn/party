"""V3.7 exact-build checks: non-decorative mode, truthful King rules and concise controls."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os, shutil
html=(Path(__file__).resolve().parent.parent/'CHAOS-CLUB-3.7-PLAY.html').read_text(encoding='utf-8')
chrome=os.getenv('CHROMIUM_PATH') or shutil.which('chromium')
def click(p, a, value=None):
    sel=f'[data-act="{a}"]'+(f'[data-val="{value}"]' if value is not None else '')
    p.locator('.modal [data-act="close-modal"]').click(timeout=6000) if a=='close-modal' else p.locator(sel).first.click(timeout=6000)
with sync_playwright() as w:
    b=w.chromium.launch(headless=True,executable_path=chrome,args=['--no-sandbox'])
    p=b.new_page(viewport={'width':320,'height':710})
    exceptions=[];p.on('pageerror',lambda e:exceptions.append(str(e)))
    p.set_content(html)
    assert p.locator('.family-tile').count()==7
    assert p.locator('.family-tile small').count()==0, 'redundant common marketing text'
    click(p,'game','partydeck24');click(p,'deep-duration','quick');click(p,'deep-customize');click(p,'deep-style','story');click(p,'deep-start')
    assert p.locator('.inline-tip').count()==1, 'Story mode should show the optional follow-up immediately'
    assert p.locator('[data-act="deep-twist"]').count()==0, 'Story mode must not show a redundant Add twist action'
    assert 'Optional follow-up' in p.locator('.play-card').inner_text()
    click(p,'deep-swap')
    assert p.locator('.inline-tip').count()==1, 'follow-up persists through card substitution'
    click(p,'help')
    assert 'automatically shows' in p.locator('.modal').inner_text()
    click(p,'close-modal');click(p,'lang')
    assert 'Freiwillige Nachfrage' in p.locator('.play-card').inner_text()
    click(p,'help');assert 'automatisch' in p.locator('.modal').inner_text();click(p,'close-modal')
    click(p,'home');click(p,'game','kingsnight24');click(p,'deep-duration','quick');click(p,'deep-start')
    for _ in range(12):
        click(p,'king24-draw');click(p,'king24-skip')
    assert '0 Karten gespielt' in p.locator('.play-card').inner_text()
    assert '12 übersprungen' in p.locator('.play-card').inner_text()
    click(p,'help');assert 'gezogenen Karten' in p.locator('.modal').inner_text();click(p,'close-modal')
    click(p,'home');click(p,'game','socialradar26');click(p,'deep26-duration','quick');click(p,'deep26-start')
    for _ in range(4):
        if p.locator('[data-act="deep26-secret"]').count():click(p,'deep26-secret','0')
        click(p,'deep26-open'); click(p,'deep26-tally','1');click(p,'deep26-reveal')
        if p.locator('.deep26-notice').count():break
        # After final scored round only the final-results control remains.
        if p.locator('[data-act="deep26-next"]').count():
            if 'Final' in p.locator('[data-act="deep26-next"]').inner_text() or 'End' in p.locator('[data-act="deep26-next"]').inner_text():
                assert p.locator('[data-act="deep26-end"]').count()==0
            click(p,'deep26-next')
    assert p.locator('[data-act="deep26-restart"]').count()==1
    assert p.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1')
    assert not exceptions,exceptions
    b.close()
print('PASS V3.7 focused Story-mode, locale, King skip summary, redundant controls and 320px')

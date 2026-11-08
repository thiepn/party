"""V3.1 exact-build Chromium regression for honest Party Deck summary and sustained sessions."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,shutil
ROOT=Path(__file__).resolve().parent.parent
HTML=(ROOT/'CHAOS-CLUB-3.7-PLAY.html').read_text(encoding='utf-8')
CHROME=os.getenv('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('google-chrome')
def tap(page,action,value=None):
    q=f'[data-act="{action}"]'+(f'[data-val="{value}"]' if value else '')
    page.locator(q).first.click(timeout=7000)
with sync_playwright() as browser:
    b=browser.chromium.launch(headless=True,executable_path=CHROME,args=['--no-sandbox'])
    p=b.new_page(viewport={'width':320,'height':720});errors=[]
    p.on('pageerror',lambda e:errors.append(str(e)))
    p.set_content(HTML)
    assert p.locator('.family-tile').count()==7
    tap(p,'game','partydeck24');tap(p,'deep-duration','long');tap(p,'deep-start')
    kinds=[];seen=set()
    for i in range(12):
        phrase=p.locator('.play-card .prompt').inner_text()
        hint=p.locator('.deep-instruction').inner_text()
        assert phrase not in seen,(i,phrase)
        seen.add(phrase);kinds.append(hint)
        tap(p,'deep-next')
    assert all(not (kinds[i]==kinds[i-1]==kinds[i-2]) for i in range(2,len(kinds))),kinds
    tap(p,'deep-end')
    summary=p.locator('.deep-summary').inner_text()
    assert '12/56' in summary and 'cards completed' in summary,summary
    assert not summary.startswith('56 cards completed')
    tap(p,'lang');assert '12/56' in p.locator('.deep-summary').inner_text()
    assert 'Karten gespielt' in p.locator('.deep-summary').inner_text()
    for width in (320,375,390,768,1280):
        p.set_viewport_size({'width':width,'height':720})
        assert not p.evaluate('document.documentElement.scrollWidth > innerWidth'),width
    assert not errors,errors
    print('PASS V3.1 exact-build: 12/56 cards on early exit, no same-session repeats, EN/DE summaries, 5 responsive widths, no JS errors')
    b.close()

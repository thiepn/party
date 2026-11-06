"""Browser regressions for Team Showdown timer pause, return and real expiration."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,shutil
HTML=(Path(__file__).resolve().parent.parent/'CHAOS-CLUB-3.7-PLAY.html').read_text(encoding='utf-8')
CHROME=os.getenv('CHROMIUM_PATH') or shutil.which('chromium')
def tap(p,act,val=None):
    selector=f'[data-act="{act}"]'+(f'[data-val="{val}"]' if val else '')
    p.locator(selector).first.click(timeout=6000)
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,executable_path=CHROME,args=['--no-sandbox'])
    p=browser.new_page(viewport={'width':390,'height':844})
    errs=[];p.on('pageerror',lambda e:errs.append(str(e)))
    p.clock.install()
    p.set_content(HTML)
    tap(p,'game','teamshowdown25');tap(p,'deep25-duration','quick');tap(p,'deep25-start')
    tap(p,'team25-start')
    assert p.locator('[data-act="team25-pause"]').count()
    p.clock.fast_forward(11000)
    tap(p,'team25-pause')
    time_before=int(p.locator('[data-act="team25-start"]').inner_text().split('·')[-1].strip().rstrip('s'))
    assert 32<=time_before<=35,time_before
    tap(p,'home');tap(p,'game','teamshowdown25')
    time_after=int(p.locator('[data-act="team25-start"]').inner_text().split('·')[-1].strip().rstrip('s'))
    assert time_before==time_after,(time_before,time_after)
    tap(p,'team25-start')
    assert int(p.locator('#timer-view').inner_text())==time_before
    p.clock.fast_forward(46000)
    # The interval callback must actually close the turn, not continue at 0.
    assert p.locator('[data-act="team25-start"]').count(),p.locator('.play-card').inner_text()
    assert not p.locator('[data-act="team25-correct"]').count()
    print('PASS real timer expiration and pause/resume after returning from homepage')
    assert not errs,errs
    browser.close()

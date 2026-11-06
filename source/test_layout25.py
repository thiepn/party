"""V2.5 responsive checks on new screens and secret-vote controls."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,shutil
HTML=(Path(__file__).resolve().parent.parent/'CHAOS-CLUB-3.7-PLAY.html').read_text('utf-8')
CHROME=os.getenv('CHROMIUM_PATH') or shutil.which('chromium')
def tap(p,a,v=None):
    p.locator(f'[data-act="{a}"]'+(f'[data-val="{v}"]' if v else '')).first.click(timeout=6000)
def no_overflow(p,label,width):
    sizes=p.evaluate('''() => [document.documentElement.scrollWidth,document.documentElement.clientWidth]''')
    assert sizes[0]<=sizes[1]+1,(label,width,sizes)
with sync_playwright() as pw:
    b=pw.chromium.launch(headless=True,executable_path=CHROME,args=['--no-sandbox'])
    for width in [320,375,390,768,1280]:
        p=b.new_page(viewport={'width':width,'height':850})
        errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
        p.set_content(HTML)
        tap(p,'game','impostornight25');no_overflow(p,'impostor setup',width)
        tap(p,'deep25-start');no_overflow(p,'impostor cover',width)
        n=int(p.locator('.deep25-player').inner_text().split('/')[-1])
        tap(p,'imp25-see');no_overflow(p,'secret word',width)
        for i in range(n):
            tap(p,'imp25-hide')
            if i<n-1:tap(p,'imp25-see')
        tap(p,'imp25-vote');no_overflow(p,'impostor vote',width)
        tap(p,'home');tap(p,'game','teamshowdown25');no_overflow(p,'team setup',width)
        tap(p,'deep25-start');no_overflow(p,'team between',width)
        tap(p,'team25-start');no_overflow(p,'team active',width)
        tap(p,'team25-pause');no_overflow(p,'team paused',width)
        if width==390:
            p.screenshot(path=str(Path(__file__).resolve().parent.parent/'V2.5-team-mobile.png'),full_page=True)
            tap(p,'home');tap(p,'game','impostornight25');
            p.screenshot(path=str(Path(__file__).resolve().parent.parent/'V2.5-impostor-mobile.png'),full_page=True)
        assert not errors,(width,errors)
        print('PASS',width,'px setup, secret, vote, active turn, pause; no overflow/page errors',flush=True)
        p.close()
    b.close()

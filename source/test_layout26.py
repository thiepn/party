"""Responsive and accessibility-smoke checks for all three V2.6 family screens."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,shutil
HERE=Path(__file__).resolve().parent
HTML=(HERE.parent/'CHAOS-CLUB-3.7-PLAY.html').read_text('utf8')
CHROME=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium')
ids=['socialradar26','comedybattle26','bluffclub26']
def tap(p,a,v=None):p.locator('[data-act="'+a+'"]'+(f'[data-val="{v}"]' if v else '')).first.click(timeout=5500)
def no_overflow(p,label,width):
    doc,client=p.evaluate('''()=>[document.documentElement.scrollWidth,document.documentElement.clientWidth]''')
    assert doc<=client+1,f'{width}px {label} overflows: {doc} > {client}'
with sync_playwright() as w:
 b=w.chromium.launch(headless=True,executable_path=CHROME,args=['--no-sandbox'])
 for width in [320,375,390,768,1280]:
    p=b.new_page(viewport={'width':width,'height':850})
    errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
    p.set_content(HTML)
    no_overflow(p,'home',width)
    assert p.locator('.family-tile').count()==7
    for id in ids:
        tap(p,'game',id);no_overflow(p,id+' setup',width)
        tap(p,'deep26-start');no_overflow(p,id+' initial',width)
        if id=='socialradar26':
            if p.locator('[data-act="deep26-secret"]').count():
                tap(p,'deep26-secret','0');no_overflow(p,id+' hidden',width);tap(p,'deep26-open')
            else:tap(p,'deep26-open')
            no_overflow(p,id+' vote',width)
            tap(p,'deep26-tally','1');tap(p,'deep26-reveal');no_overflow(p,id+' result',width)
        elif id=='comedybattle26':
            tap(p,'deep26-perform');tap(p,'deep26-perform');no_overflow(p,id+' tally',width)
            tap(p,'deep26-tally','1');tap(p,'deep26-reveal');no_overflow(p,id+' score',width)
        else:
            tap(p,'deep26-see')
            if p.locator('[data-act="deep26-hide"]').count():tap(p,'deep26-hide')
            elif p.locator('[data-act="deep26-truth"]').count():tap(p,'deep26-truth')
            else:tap(p,'deep26-lie','1')
            no_overflow(p,id+' hidden',width);tap(p,'deep26-open');tap(p,'deep26-vote')
            if p.locator('[data-act="deep26-factyes"]').count():tap(p,'deep26-factyes')
            else:tap(p,'deep26-tally','1');tap(p,'deep26-reveal')
            no_overflow(p,id+' result',width)
        if width==390:p.screenshot(path=str(HERE.parent/f'{id}-mobile.png'),full_page=True)
        tap(p,'home')
    assert not errors,(width,errors)
    print(f'PASS {width}px: 3 families, setup, secret/tally, score; no page errors or overflow',flush=True)
    p.close()
 b.close()

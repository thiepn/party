"""Responsive and UI sanity checks; Chromium only."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os, shutil
HTML=(Path(__file__).resolve().parent.parent/'CHAOS-CLUB-3.7-PLAY.html').read_text(encoding='utf8')
BROWSER=os.getenv('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('google-chrome')
with sync_playwright() as w:
 browser=w.chromium.launch(headless=True,executable_path=BROWSER,args=['--no-sandbox'])
 errs=[]
 for width,height in [(320,700),(375,812),(390,844),(768,1024),(1280,800)]:
  p=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
  p.on('pageerror',lambda e:errs.append(str(e)))
  p.set_content(HTML)
  assert p.locator('.family-tile').count()==7
  dims=p.evaluate('''() => ({scroll: document.documentElement.scrollWidth, inner:innerWidth})''')
  assert dims['scroll']<=dims['inner'],(width,dims)
  y=p.locator('.family-tile').first.bounding_box()['y']
  assert y<530 if width<=390 else True,(width,y)
  if width in [320,1280]:p.screenshot(path=str(Path(__file__).resolve().parent/('preview-mobile-23.png' if width==320 else 'preview-desktop-23.png')),full_page=True)
  p.locator('[data-act="lang"]').click()
  assert p.locator('html').get_attribute('lang')=='de'
  assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
  p.locator('[data-act="legacy-toggle"]').click();p.locator('[data-act="game"][data-val="undercover"]').click()
  p.locator('[data-act="help"]').click()
  assert p.locator('.modal ol li').count()>=3
  p.keyboard.press('Escape')
  assert p.locator('.modal').count()==0
  print('PASS responsive',width,'first tile y',round(y),'no overflow')
  p.close()
 assert not errs,errs
 browser.close()

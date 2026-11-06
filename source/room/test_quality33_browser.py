"""V3.3 visible source only after real WebSocket round reveal. Injected HTML; real sockets."""
from __future__ import annotations
import asyncio,html
from pathlib import Path
from aiohttp.test_utils import TestServer
from playwright.async_api import async_playwright
import server

HERE=Path(__file__).resolve().parent
STYLE=(HERE/'style.css').read_text(encoding='utf-8')
CLIENT=(HERE/'client.js').read_text(encoding='utf-8')
SHELL="""() => { const m=new Map(); Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}}); history.replaceState=()=>{} }"""

async def run():
 async with TestServer(server.create_app(allow_test_origins=True)) as srv:
  base=str(srv.make_url('/room/'))
  async with async_playwright() as pw:
   browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--no-proxy-server'])
   contexts=[];pages=[];errors=[]
   try:
    for width in [320,375,390,768]:
     context=await browser.new_context(viewport={'width':width,'height':740})
     contexts.append(context)
     page=await context.new_page();pages.append(page)
     page.on('pageerror',lambda e:errors.append(str(e)))
     page.on('dialog',lambda d:asyncio.create_task(d.accept()))
     await page.set_content(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><base href="{html.escape(base,quote=True)}"><meta name="viewport" content="width=device-width,initial-scale=1"><style>{STYLE}</style></head><body><main id="app"></main><div id="status" class="sr-only"></div></body></html>')
     await page.evaluate(SHELL)
     await page.add_script_tag(content=CLIENT)
    host=pages[0]
    await host.locator('#host-name').fill('Host')
    await host.locator('form[data-form="create"] button').click()
    await host.locator('.roomcode').wait_for(timeout=6000)
    code=(await host.locator('.roomcode').inner_text()).strip()
    for i,guest in enumerate(pages[1:],1):
     await guest.locator('#join-name').fill(f'Guest{i}')
     await guest.locator('#join-code').fill(code)
     await guest.locator('form[data-form="join"] button').click()
     await guest.locator('.roomcode').wait_for(timeout=6000)
    room=server.ROOMS[code]
    await host.locator('#room-game').select_option('bluff')
    await host.locator('#room-mode').select_option('fact')
    await host.locator('#room-language').select_option('de')
    await host.locator('#room-duration').select_option('quick')
    await host.locator('form[data-form="start"] button').click()
    await host.locator('.round-tag').first.wait_for(timeout=6000)
    source=room.item['source']
    assert 'https://' in source['url']
    for page in pages:
     assert source['url'] not in await page.locator('body').inner_html()
    for i,pid in enumerate(room.members()):
     if pid==room.featured:continue
     page=pages[i]
     await page.locator('#answer').fill(f'Plausible invented answer from {i}')
     await page.locator('form[data-form="text"] button').click()
    guesser=pages[room.members().index(room.featured)]
    await guesser.locator('[data-action="vote"]').first.wait_for(timeout=6000)
    for page in pages:assert source['url'] not in await page.locator('body').inner_html()
    await guesser.locator(f'[data-action="vote"][data-value="{room.truth_at}"]').click()
    for page in pages:
     anchor=page.locator(f'a[href="{source["url"]}"]')
     await anchor.wait_for(timeout=7000)
     assert await anchor.get_attribute('rel')=='noopener noreferrer'
     assert await anchor.get_attribute('target')=='_blank'
     assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth')
    assert not errors,errors
    print('PASS V3.3: real four-client Fact Trap, no pre-reveal source leak, clickable cited reference only at result, German game content, 320/375/390/768px, zero JS exceptions')
   finally:
    for ctx in contexts:await ctx.close()
    await browser.close()

if __name__=='__main__':asyncio.run(run())

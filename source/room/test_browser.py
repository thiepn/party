"""Four independent Chromium phone contexts sharing one real aiohttp WebSocket server.

Container blocks HTTP navigation and file navigation. Therefore HTML/CSS/JS are loaded
with set_content(), localStorage is mocked for opaque about:blank pages, and the test
server explicitly permits the opaque Origin. Browser-to-server WebSocket transport is
REAL, not mocked. This does not constitute production LAN/HTTPS acceptance testing.
"""
from __future__ import annotations
import asyncio, html
from pathlib import Path
from aiohttp.test_utils import TestServer
from playwright.async_api import async_playwright
import server as rooms

HERE=Path(__file__).resolve().parent
STYLE=(HERE/'style.css').read_text();CLIENT=(HERE/'client.js').read_text()
SHELL='''() => { const st=new Map(); Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>st.get(k)??null,setItem:(k,v)=>st.set(k,String(v)),removeItem:k=>st.delete(k)}});history.replaceState=function(){}; }'''

async def main():
  async with TestServer(rooms.create_app(allow_test_origins=True)) as srv:
    base=str(srv.make_url('/room/'))
    async with async_playwright() as pw:
      browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--no-proxy-server'])
      pages=[];ctxs=[];errors=[]
      async def make(width):
        ctx=await browser.new_context(viewport={'width':width,'height':812},accept_downloads=False)
        page=await ctx.new_page();ctxs.append(ctx);pages.append(page)
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('dialog',lambda d:asyncio.create_task(d.accept()))
        await page.set_content(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><base href="{html.escape(base,quote=True)}"><meta name="viewport" content="width=device-width,initial-scale=1"><style>{STYLE}</style></head><body><main id="app"></main><div id="status" class="sr-only" role="status" aria-live="polite"></div></body></html>',wait_until='load')
        await page.evaluate(SHELL)
        await page.add_script_tag(content=CLIENT)
        return page
      async def start(host,game,mode,duration='quick'):
        await host.locator('#room-game').select_option(game)
        await host.locator('#room-mode').select_option(mode)
        await host.locator('#room-duration').select_option(duration)
        await host.locator('form[data-form="start"] button').click()
      async def return_to_lobby(host):
        await host.locator('[data-action="finish"]').click()
        await host.get_by_text('Session complete').wait_for(timeout=7000)
        await host.locator('[data-action="lobby"]').click()
        await host.locator('#room-game').wait_for(timeout=7000)
      try:
        host=await make(320)
        await host.locator('#host-name').fill('Host')
        await host.locator('form[data-form="create"] button').click()
        await host.locator('.roomcode').wait_for(timeout=7000)
        code=(await host.locator('.roomcode').inner_text()).strip()
        guests=[]
        for i in range(1,4):
          page=await make(375 if i<3 else 390);guests.append(page)
          await page.locator('#join-name').fill(f'Friend{i}')
          await page.locator('#join-code').fill(code)
          await page.locator('form[data-form="join"] button').click()
          await page.locator('.roomcode').wait_for(timeout=7000)
        await host.locator('.person').nth(3).wait_for(timeout=7000)
        clients=[host]+guests;room=rooms.ROOMS[code]
        assert len(room.players)==4
        await guests[0].locator('[data-action="language"]').click()
        assert await guests[0].locator('html').get_attribute('lang')=='de'
        # Social Radar: 2-2 tie. No participant may see individual ballots or a score until all submit.
        await start(host,'social','majority')
        for i,page in enumerate(clients[:-1]):
          await page.locator(f'[data-action="choice"][data-value="{i%2}"]').click()
        await asyncio.sleep(.2)
        assert room.stage=='answer', 'Reveal happened before the last private vote.'
        await clients[3].locator('[data-action="choice"][data-value="1"]').click()
        await host.get_by_text('Round result').wait_for(timeout=7000)
        assert 'A: 2 · B: 2' in await host.locator('body').inner_text()
        assert sum(room.points.values())==0
        await host.locator('[data-action="next"]').click()
        await host.get_by_text('Round 2/4').wait_for(timeout=7000)
        # Automatic reconnect: disconnect a guest, verify the same seat reclaims the session.
        original_id=room.players[2]['id'];await room.players[2]['ws'].close()
        for _ in range(50):
          if room.players[2]['connected']:break
          await asyncio.sleep(.12)
        assert room.players[2]['connected'] and room.players[2]['id']==original_id
        print('PASS Social Radar: 4 browser contexts, hidden voting, correct tie, next round and seat reconnect')
        await return_to_lobby(host)
        # Comedy Battle: two private punchlines, two anonymous audience ballots.
        await start(host,'comedy','punchline')
        for pid in room.pair:
          page=clients[room.members().index(pid)]
          await page.locator('#answer').fill('A funny original line for this challenge')
          await page.locator('form[data-form="text"] button').click()
        await host.locator('[data-action="finish"]').wait_for(timeout=7000)
        for i,pid in enumerate(room.eligible()):
          page=clients[room.members().index(pid)]
          await page.locator('[data-action="vote"][data-value="0"]').click()
        await host.get_by_text('Round result').wait_for(timeout=7000)
        assert sum(room.points.values())==2,room.points
        assert 'Audience votes' in await host.locator('body').inner_text()
        await host.screenshot(path=str(HERE/'../../V2.8-comedy-mobile.png'),full_page=True)
        print('PASS Comedy Battle: private written answers, anonymous votes, scoring')
        await return_to_lobby(host)
        # Bluff Club: storyteller marks a lie privately, three players make independent choices.
        await start(host,'bluff','twotruths')
        teller=clients[room.members().index(room.featured)]
        for i in range(3):await teller.locator(f'#statement{i}').fill(f'Statement {i+1} from the storyteller')
        await teller.locator('#lie').select_option(index=1)
        assert await teller.locator('#lie').input_value()=='1';await teller.locator('form[data-form="statements"] button').click()
        for pid in room.eligible()[:-1]:
          await clients[room.members().index(pid)].locator('[data-action="vote"][data-value="1"]').click()
        assert room.stage=='vote','Lie revealed before last private vote.'
        await clients[room.members().index(room.eligible()[-1])].locator('[data-action="vote"][data-value="1"]').click()
        await host.get_by_text('Round result').wait_for(timeout=7000)
        assert sum(room.points.values())==3,room.points
        assert 'The lie was statement 2' in await host.locator('body').inner_text()
        await guests[-1].screenshot(path=str(HERE/'../../V2.8-bluff-mobile.png'),full_page=True)
        print('PASS Bluff Club: private story authoring, complete voting gate, scores and reveal')
        # German UI, 320, 375, 390, 768 and 1280px responsiveness.
        for width in (320,375,390,768,1280):
          await host.set_viewport_size({'width':width,'height':812})
          assert not await host.evaluate('document.documentElement.scrollWidth>innerWidth'),f'Horizontal overflow at {width}px'
        assert not errors,errors
        print('PASS: Chromium responsive widths 320/375/390/768/1280, German UI, zero JS page exceptions')
      finally:
        for ctx in ctxs:await ctx.close()
        await browser.close()
if __name__=='__main__':asyncio.run(main())

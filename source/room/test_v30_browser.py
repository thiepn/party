"""V3.0 four-client Chromium regressions against a real WebSocket room server.
Opaque-page harness limitation is identical to test_browser.py.
"""
import asyncio, html
from aiohttp.test_utils import TestServer
from playwright.async_api import async_playwright
import server as rooms
from test_browser import STYLE, CLIENT, SHELL

async def run():
  async with TestServer(rooms.create_app(allow_test_origins=True)) as srv:
    base=str(srv.make_url('/room/'))
    async with async_playwright() as pw:
      browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--no-proxy-server'])
      contexts=[];errors=[]
      async def page(width):
        ctx=await browser.new_context(viewport={'width':width,'height':812});contexts.append(ctx)
        p=await ctx.new_page();p.on('pageerror',lambda e:errors.append(str(e)))
        p.on('dialog',lambda d:asyncio.create_task(d.accept()))
        await p.set_content(f'<!doctype html><html><head><base href="{html.escape(base,quote=True)}"><meta name="viewport" content="width=device-width,initial-scale=1"><style>{STYLE}</style></head><body><main id="app"></main><div id="status" class="sr-only" role="status" aria-live="polite"></div></body></html>')
        await p.evaluate(SHELL);await p.add_script_tag(content=CLIENT);return p
      try:
        host=await page(320);await host.locator('#host-name').fill('Host');await host.locator('form[data-form="create"] button').click()
        await host.locator('.roomcode').wait_for();code=(await host.locator('.roomcode').inner_text()).strip()
        others=[]
        for i in range(1,4):
          p=await page(375);others.append(p)
          await p.locator('#join-name').fill(f'Guest{i}');await p.locator('#join-code').fill(code)
          await p.locator('form[data-form="join"] button').click();await p.locator('.roomcode').wait_for()
        room=rooms.ROOMS[code];clients=[host]+others
        await host.locator('#room-game').select_option('social')
        await host.locator('#room-mode').select_option('same')
        await host.locator('form[data-form="start"] button').click()
        input_box=host.locator('#answer');await input_box.fill('A distinctive answer from my phone')
        assert await input_box.evaluate('(e)=>document.activeElement===e')
        for i,p in enumerate(others[:2]):
          await p.locator('#answer').fill(f'Different answer {i}')
          await p.locator('form[data-form="text"] button').click()
        await host.wait_for_function("document.querySelector('[data-live-progress]')?.textContent==='2/4'",timeout=7000)
        assert await input_box.input_value()=='A distinctive answer from my phone'
        assert await input_box.evaluate('(e)=>document.activeElement===e'), 'Remote votes stole mobile keyboard focus.'
        await input_box.fill('Distinctive answer');await host.locator('form[data-form="text"] button').click()
        await others[-1].locator('#answer').fill('Another answer');await others[-1].locator('form[data-form="text"] button').click()
        await host.get_by_text('Round result').wait_for()
        await host.locator('[data-action="finish"]').click();await host.locator('[data-action="lobby"]').click()
        print('PASS draft-preserving multi-client answer flow with remote live progress')
        # Both true and invented stories must score guests, not reverse their answers.
        for truth,correct in [(True,0),(False,1)]:
          await host.locator('#room-game').select_option('bluff')
          await host.locator('#room-mode').select_option('confession')
          await host.locator('form[data-form="start"] button').click()
          await host.locator(f'[data-action="truth"][data-value="{str(truth).lower()}"]').click()
          for p in others:await p.locator(f'[data-action="vote"][data-value="{correct}"]').click()
          await host.get_by_text('Round result').wait_for()
          assert sum(room.points.values())==3,(truth,room.points)
          await host.locator('[data-action="finish"]').click();await host.locator('[data-action="lobby"]').click()
        print('PASS actual four-client confession voting: true and fiction both scored correctly')
        await host.locator('#room-game').select_option('comedy')
        await host.locator('#room-mode').select_option('punchline')
        await host.locator('form[data-form="start"] button').click()
        for pid in room.pair:
          p=clients[room.members().index(pid)]
          await p.locator('#answer').fill('One funny response')
          await p.locator('form[data-form="text"] button').click()
        audience=clients[room.members().index(room.eligible()[0])]
        assert 'Answer A' in await audience.locator('[data-action="vote"][data-value="0"]').inner_text()
        assert 'Performer A' not in await audience.locator('[data-action="vote"][data-value="0"]').inner_text()
        for pid in room.eligible():
          await clients[room.members().index(pid)].locator('[data-action="vote"][data-value="0"]').click()
        await host.get_by_text('Round result').wait_for()
        assert sum(room.points.values())==2
        for width in (320,375,390,768,1280):
          await host.set_viewport_size({'width':width,'height':800})
          assert not await host.evaluate('document.documentElement.scrollWidth>innerWidth'),width
        assert not errors,errors
        print('PASS written-answer labels, score, five mobile/desktop widths, zero client exceptions')
      finally:
        for ctx in contexts:await ctx.close()
        await browser.close()

if __name__=='__main__':asyncio.run(run())

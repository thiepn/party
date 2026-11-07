"""V3.6 focused Chromium UI regression using four real local WebSockets.

The test harness injects the page because native URL navigation is administrator-blocked;
this does not certify file://, HTTP browser origin, or physical phones.
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
            async def open_page(width=375):
                context=await browser.new_context(viewport={'width':width,'height':780})
                contexts.append(context)
                page=await context.new_page()
                page.on('pageerror',lambda exc:errors.append(str(exc)))
                page.on('dialog',lambda dlg:asyncio.create_task(dlg.accept()))
                await page.set_content(f'<!doctype html><html><head><base href="{html.escape(base,quote=True)}"><meta name="viewport" content="width=device-width,initial-scale=1"><style>{STYLE}</style></head><body><main id="app"></main><div id="status" class="sr-only" role="status" aria-live="polite"></div></body></html>')
                await page.evaluate(SHELL)
                await page.add_script_tag(content=CLIENT)
                return page
            try:
                host=await open_page(320)
                await host.locator('#host-name').fill('Host')
                await host.locator('form[data-form="create"] button').click()
                await host.locator('.roomcode').wait_for()
                code=(await host.locator('.roomcode').inner_text()).strip()
                guests=[]
                for i in range(3):
                    p=await open_page()
                    await p.locator('#join-name').fill(f'Player{i}')
                    await p.locator('#join-code').fill(code)
                    await p.locator('form[data-form="join"] button').click()
                    await p.locator('.roomcode').wait_for();guests.append(p)
                await host.locator('#room-game').select_option('bluff')
                await host.locator('#room-mode').select_option('twotruths')
                await host.locator('form[data-form="start"] button').click()
                await host.locator('#statement0').wait_for()
                for i,value in enumerate(('I met a singer.','i met a singer!','I saw a volcano.')):
                    await host.locator(f'#statement{i}').fill(value)
                # All clients must be in the same round before an in-flight state
                # refresh can no longer interfere with a selection.
                for guest in guests:
                    await guest.locator('[data-live-progress]').wait_for()
                await host.locator('#lie').select_option(index=1)
                assert await host.locator('#lie').input_value()=='1'
                await host.locator('form[data-form="statements"] button').click()
                await host.get_by_text('Use three different statements.',exact=False).wait_for(timeout=7000)
                assert await host.locator('#statement1').input_value()=='i met a singer!'
                assert await host.locator('#lie').input_value()=='1'
                await host.locator('#statement1').fill('I won a cooking prize.')
                await host.locator('form[data-form="statements"] button').click()
                for guest in guests:
                    await guest.get_by_text('I won a cooking prize.').wait_for(timeout=7000)
                    await guest.locator('[data-action="vote"][data-value="1"]').click()
                await host.get_by_text('Round result',exact=True).wait_for(timeout=7000)
                assert rooms.ROOMS[code].completed==1
                assert not await host.evaluate('document.documentElement.scrollWidth>innerWidth')
                assert not errors,errors
                print('PASS V3.6 browser: 4 real WebSocket Chromium contexts; invalid triple retains draft, correction scores, 320px no overflow, zero JS errors')
            finally:
                for ctx in contexts:await ctx.close()
                await browser.close()

if __name__=='__main__':asyncio.run(run())

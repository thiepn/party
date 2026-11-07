"""V3.2 multi-client Chromium regressions for mobile drafts, submission locks, and host transfer.
Real local WebSocket server; UI injected into an opaque page due browser navigation policy.
"""
import asyncio, html
from aiohttp.test_utils import TestServer
from playwright.async_api import async_playwright
import server as rooms
from test_browser import STYLE,CLIENT,SHELL

async def run():
 async with TestServer(rooms.create_app(allow_test_origins=True)) as srv:
  base=str(srv.make_url('/room/'))
  async with async_playwright() as pw:
   browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--no-proxy-server'])
   contexts=[];errs=[]
   async def open_page(width=375):
    ctx=await browser.new_context(viewport={'width':width,'height':780});contexts.append(ctx)
    p=await ctx.new_page();p.on('pageerror',lambda e:errs.append(str(e)))
    p.on('dialog',lambda d:asyncio.create_task(d.accept()))
    await p.set_content(f'<!doctype html><html><head><base href="{html.escape(base,quote=True)}"><meta name="viewport" content="width=device-width,initial-scale=1"><style>{STYLE}</style></head><body><main id="app"></main><div id="status" class="sr-only" role="status" aria-live="polite"></div></body></html>')
    await p.evaluate(SHELL);await p.add_script_tag(content=CLIENT);return p
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
    await host.locator('#room-game').select_option('social')
    await host.locator('#room-mode').select_option('same')
    await host.locator('form[data-form="start"] button').click()
    await host.locator('#answer').wait_for()
    room=rooms.ROOMS[code]
    # Remote participation must update progress without stealing the live keyboard.
    await host.locator('#answer').fill('Host draft not sent')
    assert await host.locator('#answer').evaluate('(e)=>document.activeElement===e')
    await guests[0].locator('#answer').fill('Answer from first guest')
    # A rapid double tap must not submit the same answer twice.
    await guests[0].evaluate("""() => { const b=document.querySelector('form[data-form="text"] button'); b.click(); b.click(); }""")
    await host.wait_for_function("document.querySelector('[data-live-progress]')?.textContent==='1/4'")
    assert await host.locator('#answer').input_value()=='Host draft not sent'
    assert await guests[0].get_by_text('Already submitted this round.').count()==0
    assert await host.locator('#answer').evaluate('(e)=>document.activeElement===e')
    # Own submission switches from editable form to a locked, read-only confirmation.
    await host.locator('form[data-form="text"] button').click()
    await host.get_by_text('Answer locked.').wait_for(timeout=7000)
    assert await host.locator('#answer').count()==0,'Submitted form remained editable.'
    assert room.answers[room.host]=='Host draft not sent'
    # Another guest has an unsent draft when its socket drops. Reconnect must restore it
    # only to the same seat and round, without storing it in localStorage.
    losing=guests[1]
    await losing.locator('#answer').fill('My unsent private draft')
    assert await losing.locator('#answer').evaluate('(e)=>document.activeElement===e')
    pid=room.members()[2]
    await room.player(pid)['ws'].close()
    await losing.get_by_text('Disconnected. Reconnecting…').wait_for(timeout=5000)
    await losing.locator('#answer').wait_for(timeout=10000)
    assert await losing.locator('#answer').input_value()=='My unsent private draft'
    assert 'My unsent private draft' not in str(room.view(room.host))
    # Host role transfer must update controls even while focused editing is in progress.
    await losing.locator('#answer').fill('Still typing when host changes')
    await host.locator('details.host-handoff summary').click()
    await host.locator(f'[data-action="transfer"][data-value="{pid}"]').click()
    await losing.get_by_text('Host controls',exact=True).wait_for(timeout=7000)
    assert await losing.locator('#answer').input_value()=='Still typing when host changes'
    assert await host.get_by_text('Host controls',exact=True).count()==0
    assert room.host==pid
    # Keep session functional after transferring host. Complete all remaining inputs.
    await losing.locator('form[data-form="text"] button').click()
    await guests[2].locator('#answer').fill('Last entry')
    await guests[2].locator('form[data-form="text"] button').click()
    await losing.get_by_text('Round result').wait_for(timeout=7000)
    for width in (320,375,390,768,1280):
     await losing.set_viewport_size({'width':width,'height':780})
     assert not await losing.evaluate('document.documentElement.scrollWidth>innerWidth'),width
    assert not errs,errs
    print('PASS V3.2: 4 real WebSocket browser clients, remote typing preserved, own answer locked, reconnect draft restored, host transfer updates controls, 5 widths, no JS errors')
   finally:
    for ctx in contexts:await ctx.close()
    await browser.close()

if __name__=='__main__':asyncio.run(run())

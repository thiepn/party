// Browser-only integration test against local public/room and local Wrangler.
// All URLs are loopback; do not use production endpoints or production data.
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';

const origin='http://127.0.0.1:8080',errors=[];
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
let hostContext,guestContext;
try{
  hostContext=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  guestContext=await browser.newContext({viewport:{width:1280,height:900}});
  const host=await hostContext.newPage(),guest=await guestContext.newPage();
  for(const page of [host,guest]){
    page.on('pageerror',e=>errors.push(e.message));
  }
  const lobby=async(page,count)=>{
    await page.waitForFunction(n=>document.querySelectorAll('.person').length===n,count,{timeout:12000});
    assert.equal(await page.locator('.person').count(),count);
  };
  await host.goto(origin+'/room/',{waitUntil:'load'});
  await host.locator('#host-name').fill('Browser Host');
  await host.locator('form[data-form="create"] button').click();
  await host.locator('.roomcode').waitFor({timeout:12000});
  const code=(await host.locator('.roomcode').textContent()).trim();
  assert.match(code,/^[A-HJ-NP-Z2-9]{8}$/);
  await lobby(host,1);
  const hostSeat=await host.evaluate(()=>JSON.parse(localStorage.getItem('chaosclub.28.seat')));
  assert.equal(hostSeat.code,code);
  await guest.goto(origin+'/room/?room='+code,{waitUntil:'load'});
  await guest.locator('#join-name').fill('Browser Guest');
  await guest.locator('form[data-form="join"] button').click();
  await lobby(guest,2);
  await lobby(host,2);
  assert.equal(await guest.locator('.person').filter({hasText:'Browser Guest'}).count(),1);
  const initial=await guest.evaluate(()=>JSON.parse(localStorage.getItem('chaosclub.28.seat')));
  assert.equal(initial.code,code);
  assert.notEqual(initial.id,hostSeat.id);
  await guest.reload({waitUntil:'load'});
  await lobby(guest,2);
  const renewed=await guest.evaluate(()=>JSON.parse(localStorage.getItem('chaosclub.28.seat')));
  assert.equal(renewed.id,initial.id);
  assert.notEqual(renewed.token,initial.token,'browser reconnect must rotate private seat credential');
  assert.equal(await guest.locator('.person').filter({hasText:'Browser Host'}).count(),1);
  assert.equal(errors.length,0,'browser must not throw during creation/join/reconnect: '+errors.join('; '));
  console.log('LOCAL_CHROMIUM_BROWSER_ADMISSION_PASS',JSON.stringify({mobileHost:true,desktopGuest:true,players:2,roomCodeValid:true,reconnectTokenRotated:true,pageErrors:0}));
}finally{
  await guestContext?.close();
  await hostContext?.close();
  await browser.close();
}

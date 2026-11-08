// Browser-only integration test against local public/room and local Wrangler.
// All URLs are loopback; do not use production endpoints or production data.
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright-core';

const origin='http://127.0.0.1:8080',errors=[];
const engine=process.env.CHAOS_BROWSER==='webkit'?'webkit':'chromium';
const browser=await (engine==='webkit'?webkit:chromium).launch(engine==='webkit'
  ?{headless:true}:{channel:'chrome',headless:true,args:['--no-sandbox']});
let hostContext,guestContext;
const extraContexts=[];
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
  const additional=[];
  for(let i=2;i<4;i++){
    const ctx=await browser.newContext({viewport:{width:i===2?390:1280,height:844},isMobile:i===2,hasTouch:i===2});
    extraContexts.push(ctx);
    const page=await ctx.newPage();
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(origin+'/room/?room='+code,{waitUntil:'load'});
    await page.locator('#join-name').fill('Browser '+i);
    await page.locator('form[data-form="join"] button').click();
    await lobby(page,i+1);
    additional.push(page);
  }
  const pages=[host,guest,...additional];
  await Promise.all(pages.map(page=>lobby(page,4)));
  await host.locator('#room-mode').selectOption('majority');
  await host.locator('#room-duration').selectOption('quick');
  await host.locator('form[data-form="start"] button').click();
  await Promise.all(pages.map(page=>page.locator('.option-card[data-value="0"]').waitFor({timeout:12000})));
  await Promise.all(pages.map((page,i)=>page.locator('.option-card[data-value="'+(i===3?1:0)+'"]').click()));
  await Promise.all(pages.map(page=>page.waitForFunction(
    ()=>document.querySelectorAll('.standings .score').length===4,null,{timeout:12000}
  )));
  const scores=await host.locator('.standings .score').evaluateAll(elements=>
    Object.fromEntries(elements.map(el=>[el.querySelector('span').textContent.trim(),Number(el.querySelector('b').textContent)]))
  );
  assert.deepEqual(scores,{'Browser Host':1,'Browser Guest':1,'Browser 2':1,'Browser 3':0},
    'three-vote browser majority must be awarded exactly once');
  assert.equal(errors.length,0,'browser must not throw during creation/join/reconnect: '+errors.join('; '));
  console.log('LOCAL_'+engine.toUpperCase()+'_BROWSER_ADMISSION_PASS',JSON.stringify({engine,mobileHost:true,desktopGuest:true,players:4,roomCodeValid:true,reconnectTokenRotated:true,parallelSubmissions:true,majorityScoring:true,pageErrors:0}));
}finally{
  for(const ctx of extraContexts)await ctx.close();
  await guestContext?.close();
  await hostContext?.close();
  await browser.close();
}

'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const ctx={window:{}};vm.createContext(ctx);
for(const k of ['base-data','content','content-boost','party-packs','editorial-content','guides','club24','club25','club26','club27'])vm.runInContext(fs.readFileSync(__dirname+'/'+k+'.js','utf8'),ctx);
const {CHAOS24:C24,CHAOS25:C25,CHAOS26:C26,CHAOS27:C27,CHAOS_EXTRA:E,PARTY_DATA:D}=ctx.window;
const key=x=>x.en.trim().toLowerCase();
for(const tone of ['clean','party','adult']){
  const cards=C24.pool(tone);assert.equal(new Set(cards.map(x=>key(x))).size,cards.length,'Party Deck exact repeat');
  assert(cards.length>=C24.numberModes.long);
}
for(const [type,groups]of Object.entries(C27.content)){
  for(const item of groups){
    if(['majority','know'].includes(type)){
      assert.equal(item.length,3);for(const q of item)assert(q.en?.trim()&&q.de?.trim(),type+' bilingual');
    }else assert(item.en?.trim()&&item.de?.trim(),type+' bilingual');
  }
}
assert(C25.actions.length>=20&&C25.pairs.length>=36&&C25.locations.length>=26,'Impostor depth');
for(const actions of C25.actions)assert.equal(actions.length,3,'three Mimic actions');
for(const kind of ['social','comedy','bluff']){
  for(const variant of C26.variants[kind]){
    const all=C26.build(kind,variant,E,D,a=>a.slice());
    assert(all.length>=C26.durations.long[kind],`${kind}/${variant} long pool`);
    assert.equal(new Set(all.map(x=>x._key)).size,all.length,'session duplicate');
    for(const it of all)assert(it.q.en&&it.q.de&&typeof it._key==='string');
    const history=all.slice(0,5).map(x=>x._key);
    const seen=C26.build(kind,variant,E,D,a=>a.slice(),history);
    assert(seen.slice(0,5).every(x=>!history.includes(x._key)),'unseen first in each variant');
  }
  for(let r=0;r<16;r++){
    for(const d of ['quick','standard','long']){
      for(const v of C26.variants[kind].filter(v=>v!=='mixed')){
        const expected=d!=='quick'&&(r+1)%4===0;
        assert.equal(!!C27.twist(kind,v,r,d),expected,'switch-ups every fourth round');
        if(expected){const tip=C27.twist(kind,v,r,d);assert(tip.en&&tip.de);}
        assert.equal(C27.twist(kind,v,r,d,false),null);
      }
    }
  }
}
let hist=[];
for(let i=0;i<190;i++)hist=C27.remember(hist,`key-${i}`);
assert.equal(hist.length,160,'bounded history');
assert(!hist.includes('key-0')&&hist.includes('key-189'));
hist=C27.remember(hist,'key-175');assert.equal(hist.length,160);assert.equal(hist.at(-1),'key-175');assert.equal(hist.filter(x=>x==='key-175').length,1);
console.log('PASS V2.7: no duplicate Party Deck prompts, expanded 4–6 player data, EN/DE content, deliberate round twists, recent-content priority and bounded history.');

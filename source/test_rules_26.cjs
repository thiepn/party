'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const ctx={window:{}};vm.createContext(ctx);
for(const k of ['base-data','content','content-boost','party-packs','editorial-content','guides','club24','club25','club26','club27'])vm.runInContext(fs.readFileSync(__dirname+'/'+k+'.js','utf8'),ctx);
const C=ctx.window.CHAOS26,E=ctx.window.CHAOS_EXTRA,D=ctx.window.PARTY_DATA;
const plain=x=>JSON.parse(JSON.stringify(x));
function eq(actual,expected,label){assert.deepEqual(plain(actual),expected,label)}
for(let n=4;n<=6;n++){
  for(const d of ['quick','standard','long']){
    for(const kind of ['social','comedy','bluff']){
      const total=C.durations[d][kind];const variants=C.variants[kind];
      for(const variant of variants){
        const all=C.build(kind,variant,E,D,a=>a.slice());assert(all.length>=total,`${kind}/${variant}/${d} has only ${all.length} prompts`);
        assert(all.slice(0,total).every(x=>x.q&&x.q.en&&x.q.de));
        const unique=new Set(all.map(x=>x.type+'|'+x.q.en));assert.equal(unique.size,all.length,kind+' duplicate prompt');
        if(kind==='bluff')assert(all.every(x=>x.type!=='fact'||(x.answer?.en&&x.answer?.de)));
      }
      if(kind==='comedy'){
        const pairs=C.pairs(n,total);assert.equal(pairs.length,total);
        let appearances=Array(n).fill(0);
        for(const [a,b]of pairs){assert(a!==b);assert(a>=0&&a<n&&b>=0&&b<n);appearances[a]++;appearances[b]++;}
        assert(Math.max(...appearances)-Math.min(...appearances)<=1,`${n} people, ${total} rounds, appearances ${appearances}`);
      }
    }
  }
  eq(C.voteDuel(n,n-2,0),[2,0],`clear A win ${n}`);
  eq(C.voteDuel(n,0,n-2),[0,2],`clear B win ${n}`);
  if((n-2)%2===0)eq(C.voteDuel(n,(n-2)/2,(n-2)/2),[1,1],`tied audience ${n}`);
  assert.throws(()=>C.voteDuel(n,0,0));
  assert.equal(C.scoreSocial('majority',n,0,n-1),2);
  assert.equal(C.scoreSocial('majority',n,1,n-1),0);
  assert.equal(C.scoreSocial('know',n,0,n-1),2);
  assert.equal(C.scoreSocial('know',n,1,n-1),0);
  assert.equal(C.scoreSocial('same',n,0,1),0);
  assert.equal(C.scoreSocial('same',n,0,2),1);
  assert.equal(C.scoreSocial('same',n,0,3),2);
  assert.throws(()=>C.scoreSocial('same',n,0,n+1));
  assert.throws(()=>C.scoreSocial('majority',n,0,n));
  eq(C.scoreBluff('confession',n,'true',n-1),{group:2,bluff:0,correct:n-1});
  eq(C.scoreBluff('confession',n,'fiction',n-1),{group:0,bluff:2,correct:0});
  eq(C.scoreBluff('twotruths',n,2,0),{group:0,bluff:2,correct:0});
  eq(C.scoreBluff('fact',n,null,n-1),{group:2,bluff:0,correct:n-1});
  assert.throws(()=>C.scoreBluff('fact',n,null,n));
}
const bench={};for(const kind of ['social','comedy','bluff']){bench[kind]=Object.fromEntries(C.variants[kind].map(variant=>[variant,C.build(kind,variant,E,D,a=>a.slice()).length]));}
console.log('PASS V2.6 deterministic scoring, full-length content, unbiased 4–6-person pair schedules, complete counts and EN/DE data',JSON.stringify(bench));

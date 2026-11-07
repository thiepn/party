'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const window={};vm.runInNewContext(fs.readFileSync(__dirname+'/club26.js','utf8'),{window}, {filename:'club26.js'});
for(const n of [4,5,6])for(const count of [3,8,16]){
 const pairs=window.CHAOS26.pairs(n,count).map(p=>Array.from(p));
 assert.equal(pairs.length,count);
 const times=Array(n).fill(0),seen=new Set(),full=n*(n-1)/2;
 for(const [a,b] of pairs){
  assert.ok(a!==b&&a>=0&&b>=0&&a<n&&b<n);
  const key=[a,b].sort((x,y)=>x-y).join(':');
  assert.ok(!seen.has(key)||seen.size===full,`rematch before all opponents seen, n=${n} key=${key}`);
  seen.add(key);times[a]++;times[b]++;
 }
 assert.ok(Math.max(...times)-Math.min(...times)<=1,`imbalanced participation n=${n} rounds=${count}: ${times}`);
}
console.log('PASS V3.1 offline Comedy Battle schedules: balanced 4–6 player sessions, unique pairings until full round-robin cycle.');

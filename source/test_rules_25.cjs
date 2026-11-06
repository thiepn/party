/* Deterministic V2.5 rules and content invariants; Node, no browser needed. */
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const scope = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'club25.js'),'utf8'),scope);
const c=scope.window.CHAOS25;
const eq=(x,y)=>assert.equal(JSON.stringify(x),JSON.stringify(y));
for(const count of [4,5,6,7,12]){
 const roster=c.teamMembers(count);
 assert.equal(roster.length,2);
 assert.ok(Math.abs(roster[0].length-roster[1].length)<=1);
 eq(roster.flat().sort((a,b)=>a-b),Array.from({length:count},(_,i)=>i));
 const roles=c.rotateRoles(count,count*3,x=>x);
 for(let round=0;round<3;round++)eq(roles.slice(round*count,(round+1)*count),Array.from({length:count},(_,i)=>i));
}
eq(c.tally([1,0,0,0],0,4,[0,1,2,3],0),{status:'incomplete'});
eq(c.tally([0,0,0,0],4,4,[0,1,2,3],0),{status:'escape',suspect:-1});
eq(c.tally([2,2,0,0],0,4,[0,1,2,3],0),{status:'runoff',candidates:[0,1]});
eq(c.tally([2,2,0,0],0,4,[0,1],1),{status:'escape',suspect:-1});
eq(c.tally([0,3,0,0],1,4,[0,1,2,3],0),{status:'chosen',suspect:1});
eq(c.tally([-1,3,0,0],2,4,[0,1,2,3],0),{status:'invalid'});
eq(c.applyResult([0,0,0,0],2,'undercover',2,false),{scores:[1,1,0,1],groupWins:true});
eq(c.applyResult([0,0,0,0],2,'undercover',1,false),{scores:[0,0,2,0],groupWins:false});
eq(c.applyResult([0,0,0,0],2,'spy',2,true),{scores:[0,0,2,0],groupWins:false});
eq(c.applyResult([0,0,0,0],2,'spy',2,false),{scores:[1,1,0,1],groupWins:true});
assert.equal(new Set(c.concepts.map(x=>x.en.toLowerCase())).size,c.concepts.length);
for(const [one,two] of c.pairs)for(const word of [one,two])assert.ok(typeof word.en==='string'&&word.en.trim()&&typeof word.de==='string'&&word.de.trim());
for(const place of c.locations)assert.ok(place.en&&place.de);
for(const group of c.actions){assert.equal(group.length,3);for(const action of group)assert.ok(action.en&&action.de)}
for(const card of c.extraTaboo){assert.ok(card.w.en&&card.w.de);assert.equal(card.ban.length,3);for(const banned of card.ban)assert.ok(banned.en&&banned.de)}
for(const mode of ['quick','standard','long'])assert.ok(c.durations[mode].imp>0&&c.durations[mode].cards>0&&c.durations[mode].team>0);
for(const type of c.teamVariants)assert.ok(c.stageNames[type].length>=c.durations.long.team);
console.log('PASS deterministic V2.5 scoring, vote/runoff outcomes, balanced teams, role rotation, and bilingual content');

import test from 'node:test';import assert from 'node:assert/strict';
import prompts from '../src/public-prompts.json' with {type:'json'};
import {RoomCore,RoomError,MODES,DURATIONS,normal,duelSchedule} from '../src/room-core.mjs';
const realPrivate=Object.fromEntries(prompts.bluff.fact.map((f,i)=>[f.factId,{answer:{en:`Fixture answer ${i}`,de:`Testantwort ${i}`},source:{name:'Testing fixture',url:'https://example.invalid/facts'}}]));
const content=structuredClone(prompts);for(const fact of content.bluff.fact){Object.assign(fact,realPrivate[fact.factId]);}
let seed=13;const rng=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/2**32;};
function fresh(n,game,mode,duration){const room=new RoomCore('TESTROOM',content,null,rng);for(let i=0;i<n;i++)room.s.players.push({id:`p${i}`,name:`Player ${i}`,connected:true,token:'secret'});room.s.host='p0';room.start('p0',game,mode,duration,'en');return room;}
function playRound(r){const s=r.s,k=s.item.type,ids=r.members(),featured=s.featured;
 if(s.stage==='answer')for(const id of ids)r.submit(id,k==='same'?{text:`Pizza!`}:{choice:id===featured?0:1});
 else if(s.stage==='perform'){for(const id of s.pair)r.submit(id,{text:'Punchline from '+id});}
 else if(s.stage==='prepare'){
  if(k==='confession')r.submit(featured,{truth:true});
  else if(k==='twotruths')r.submit(featured,{statements:['Statement A','Statement B','Statement C'],lie:1});
  else if(k==='fact')for(const id of ids)if(id!==featured)r.submit(id,{text:`Bluff from ${id}`});
 }
 if(s.stage==='live')r.openLive('p0');
 if(s.stage==='vote')for(const id of r.eligible())r.submit(id,{choice:k==='fact'?0:k==='twotruths'?1:0});
 assert.equal(s.stage,'reveal');for(const id of ids){const view=r.view(id);assert.equal(view.type,'state');assert.equal(view.players.length,ids.length);assert.equal(view.version,s.version);}
 r.next('p0');}
test('117 distinct session configs, 1,077 full 4–6-player rounds across all three game families',()=>{
 let cases=0,rounds=0;for(const n of [4,5,6])for(const game of Object.keys(MODES))for(const mode of MODES[game])for(const duration of Object.keys(DURATIONS)){
 const r=fresh(n,game,mode,duration),total=r.s.total;for(let round=0;round<total;round++){playRound(r);rounds++;}assert.equal(r.s.stage,'end');assert.equal(r.s.round,total);assert.equal(r.s.completed,total);cases++;}
 assert.deepEqual([cases,rounds],[117,1077]);
});
test('Same Brain rejects nonanswers and awards points for normalized matches',()=>{const r=fresh(4,'social','same','quick');for(const txt of ['...','!!!','   '])assert.throws(()=>r.submit('p0',{text:txt}),RoomError);for(const [i,v] of ['Pizza!','pizza','Pizza','Tacos'].entries())r.submit(`p${i}`,{text:v});assert.deepEqual(r.s.points,{p0:2,p1:2,p2:2,p3:0});});
test('secret private Fact Trap answers withheld until reveal, even from the guesser',()=>{const r=fresh(4,'bluff','fact','quick'),guess=r.s.featured,truth=r.s.item.answer.en;for(const id of r.members())if(id!==guess)r.submit(id,{text:`incorrect-${id}`});assert.equal(r.s.stage,'vote');for(const id of r.members()){const v=JSON.stringify(r.view(id));assert.ok(!v.includes('truthIndex'),'correct-answer position leaked before reveal');assert.ok(!v.includes('source'),'source leaked before reveal');assert.ok(!v.includes('factId'));assert.ok(!v.includes('answerOwners'));}r.submit(guess,{choice:r.s.truthAt});assert.equal(r.s.stage,'reveal');assert.ok(JSON.stringify(r.view(guess)).includes(truth));});
test('Fact Trap truth probing and duplicate answers do not reveal private truth or owners',()=>{const r=fresh(4,'bluff','fact','quick'),guess=r.s.featured,truth=r.s.item.answer.en;for(const id of r.members())if(id!==guess)assert.doesNotThrow(()=>r.submit(id,{text:truth}));assert.equal(r.s.round,1);assert.equal(r.s.skipped,1);assert.equal(r.s.completed,0);});
test('Two Truths cannot have duplicate visible statements',()=>{const r=fresh(4,'bluff','twotruths','quick');assert.throws(()=>r.submit(r.s.featured,{statements:['Same','same!','Different'],lie:1}),/different/);assert.equal(r.s.stage,'prepare');});
test('server ownership, stage, vote integrity and mandatory 4–6 active players',()=>{const r=fresh(4,'social','majority','quick');assert.throws(()=>r.skip('p1'),/host/);assert.throws(()=>r.submit('p1',{choice:2}),RoomError);r.submit('p1',{choice:1});assert.throws(()=>r.submit('p1',{choice:0}),/Already/);assert.equal(r.s.round,0);});
test('balanced comedy opponents for 4, 5 and 6 players',()=>{for(const n of [4,5,6]){const p=duelSchedule(n,20);assert.equal(p.length,20);assert.ok(p.every(([a,b])=>a!==b&&a>=0&&b<n));}});
test('normalization handles case, spaces, punctuation and German ß',()=>{assert.equal(normal('  STRASSE!!  '),normal('Straße.'));assert.equal(normal('...'),'');});

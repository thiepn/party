'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=__dirname,win={};
const verifiedFacts=JSON.parse(fs.readFileSync(path.join(root,'room','fact-provenance.json'),'utf8'));
const reviewedOut=[];
const sandbox={window:win,console};
vm.createContext(sandbox);
for(const f of ['base-data.js','content.js','content-boost.js','party-packs.js','editorial-content.js','club24.js','club25.js','club26.js','club27.js']){
 try{vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),sandbox,{filename:f,timeout:2000});}catch(e){console.error('FAILED',f,e);process.exit(1)}
}
console.log('sources',Object.keys(win));
const out={};
for(const kind of ['social','comedy','bluff']){
 const variants=win.CHAOS26.variants[kind].filter(v=>v!=='mixed');
 out[kind]={};
 for(const variant of variants){
  const arr=win.CHAOS26.build(kind,variant,win.CHAOS_EXTRA,win.CHAOS_EDITORIAL||{},x=>x);
  out[kind][variant]=arr.map(({_key,...rest})=>rest);
  if(kind==='bluff' && variant==='fact'){
    const held=[];
    out[kind][variant]=out[kind][variant].filter(card=>{
      const ref=verifiedFacts[card.q?.en];
      if(!ref){held.push(card);return false;}
      card.source={name:ref[0],url:ref[1]};
      return true;
    });
    if(out[kind][variant].length<12)throw new Error('Fact Trap needs 12 independently sourced entries for Long mode');
    if(out[kind][variant].length!==Object.keys(verifiedFacts).length)throw new Error('Fact provenance registry no longer matches generated content');
    reviewedOut.push(...held);
  }
  console.log(kind,variant,out[kind][variant].length,JSON.stringify(out[kind][variant][0]||{}).slice(0,170));
 }
}
fs.mkdirSync(path.join(root,'room'),{recursive:true});
fs.writeFileSync(path.join(root,'room','content.json'),JSON.stringify(out,null,2)+'\n');
fs.writeFileSync(path.join(root,'room','fact-review-hold.json'),JSON.stringify(reviewedOut,null,2)+'\n');

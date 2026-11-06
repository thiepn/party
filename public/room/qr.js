/* Self-contained ISO QR Code Model 2, version 5, level L, byte-mode encoder.
 * Fixed 37x37 symbol (108 data + 26 Reed-Solomon parity codewords).
 * Intended solely for short ASCII invite URLs under 100 bytes; no network calls.
 */
(() => {'use strict';
 const N=37,DATA=108,EC=26;const out=(n,i)=>((n>>>i)&1)!==0;
 const multiply=(a,b)=>{let z=0;for(let i=7;i>=0;i--){z=(z<<1)^((z>>>7)*0x11d);z^=((b>>>i)&1)*a;}return z;};
 function encode(text){const bytes=new TextEncoder().encode(text);if(bytes.length>100)throw Error('Invite URL too long');
  const bits=[];const append=(v,n)=>{for(let i=n-1;i>=0;i--)bits.push(out(v,i));};append(4,4);append(bytes.length,8);for(const b of bytes)append(b,8);append(0,Math.min(4,DATA*8-bits.length));while(bits.length%8)bits.push(false);
  const data=[];for(let i=0;i<bits.length;i+=8){let v=0;for(let j=0;j<8;j++)v=(v<<1)|Number(bits[i+j]);data.push(v);}for(let i=0;data.length<DATA;i++)data.push(i%2?0x11:0xec);
  let generator=[1];for(let i=0,root=1;i<EC;i++,root=multiply(root,2)){const next=new Array(generator.length+1).fill(0);generator.forEach((v,j)=>{next[j]^=v;next[j+1]^=multiply(v,root);});generator=next;}
  const rem=new Array(EC).fill(0);for(const v of data){const factor=v^rem.shift();rem.push(0);for(let j=0;j<EC;j++)rem[j]^=multiply(generator[j+1],factor);}
  const all=[...data,...rem],grid=Array.from({length:N},()=>Array(N).fill(false)),fixed=Array.from({length:N},()=>Array(N).fill(false));
  function set(x,y,dark){if(x<0||y<0||x>=N||y>=N)return;grid[y][x]=Boolean(dark);fixed[y][x]=true;}
  function finder(cx,cy){for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const d=Math.max(Math.abs(dx),Math.abs(dy));set(cx+dx,cy+dy,d!==2&&d!==4);}}
  finder(3,3);finder(N-4,3);finder(3,N-4);
  for(let i=8;i<N-8;i++){set(6,i,i%2===0);set(i,6,i%2===0);}
  for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)set(30+dx,30+dy,Math.max(Math.abs(dx),Math.abs(dy))!==1);
  const format=0x77c4;for(let i=0;i<=5;i++)set(8,i,out(format,i));set(8,7,out(format,6));set(8,8,out(format,7));set(7,8,out(format,8));for(let i=9;i<15;i++)set(14-i,8,out(format,i));for(let i=0;i<8;i++)set(N-1-i,8,out(format,i));for(let i=8;i<15;i++)set(8,N-15+i,out(format,i));set(8,N-8,true);
  let bi=0;for(let right=N-1;right>=1;right-=2){if(right===6)right=5;for(let vert=0;vert<N;vert++){const y=((right+1)&2)===0?N-1-vert:vert;for(let j=0;j<2;j++){const x=right-j;if(fixed[y][x])continue;const bit=bi<all.length*8?out(all[bi>>>3],7-(bi&7)):false;grid[y][x]=bit!==((x+y)%2===0);bi++;}}}
  return grid;
 }
 function draw(canvas,text){const g=encode(text),ctx=canvas.getContext('2d');if(!ctx)return;const scale=Math.floor(Math.min(canvas.width,canvas.height)/(N+8)),size=(N+8)*scale,startX=Math.floor((canvas.width-size)/2),startY=Math.floor((canvas.height-size)/2);ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(g[y][x]){ctx.fillStyle='#171027';ctx.fillRect(startX+(x+4)*scale,startY+(y+4)*scale,scale,scale);}}
 window.ChaosQRCode={draw,encode};
})();

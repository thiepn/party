import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const clientScript=readFileSync(new URL('../../../public/room/client.js',import.meta.url),'utf8');
const storeKey='chaosclub.28.seat';
const code='ABCDEFGH',id='seat-1';
function browserHarness(initialToken='old-token'){
  const values=new Map([[storeKey,JSON.stringify({code,id,token:initialToken})]]);
  const storage={
    getItem:key=>values.get(key)??null,
    setItem:(key,value)=>values.set(key,String(value)),
    removeItem:key=>values.delete(key)
  };
  function openTab(){
    const sockets=[],listeners={};
    const root={
      innerHTML:'',
      addEventListener:(type,listener)=>{listeners[type]=listener;},
      querySelector:()=>null,
      querySelectorAll:()=>[]
    };
    const document={
      getElementById:name=>name==='app'?root:{textContent:''},
      querySelectorAll:()=>[],
      querySelector:()=>null,
      activeElement:null,
      documentElement:{}
    };
    class MockSocket{
      constructor(url){this.url=url;this.readyState=0;sockets.push(this);}
      send(message){this.lastSent=JSON.parse(message);}
      close(){this.readyState=3;this.onclose?.();}
    }
    MockSocket.OPEN=1;
    const location={
      hostname:'party.thiepn.dev',
      origin:'https://party.thiepn.dev',
      href:'https://party.thiepn.dev/room/?room='+code,
      pathname:'/room/',
      search:'?room='+code
    };
    runInNewContext(clientScript,{
      document,location,localStorage:storage,WebSocket:MockSocket,
      URL,URLSearchParams,history:{replaceState(){}},
      MutationObserver:class{observe(){}},
      setTimeout:()=>{},window:{},navigator:{},confirm:()=>true,
      fetch:()=>{throw new Error('Unexpected network request');}
    },{timeout:1000});
    assert.equal(sockets.length,1);
    return {socket:sockets[0],listeners};
  }
  return {storage,openTab};
}

test('a stale tab cannot erase the newer rotated credential from shared storage',()=>{
  const {storage,openTab}=browserHarness();
  const stale=openTab(),active=openTab();
  active.socket.onmessage({data:JSON.stringify({type:'joined',code,id,token:'new-token'})});
  assert.equal(JSON.parse(storage.getItem(storeKey)).token,'new-token');
  stale.socket.onmessage({data:JSON.stringify({type:'error',message:'Invalid reconnect credentials.'})});
  assert.equal(JSON.parse(storage.getItem(storeKey)).token,'new-token');
});

test('late events from a forgotten socket cannot resurrect a removed seat',()=>{
  const {storage,openTab}=browserHarness();
  const {socket,listeners}=openTab();
  listeners.click({target:{closest:()=>({dataset:{action:'forget'}})}});
  assert.equal(storage.getItem(storeKey),null);
  socket.onmessage({data:JSON.stringify({type:'joined',code,id,token:'stale-token'})});
  assert.equal(storage.getItem(storeKey),null);
  socket.onopen();
  assert.equal(socket.lastSent,undefined);
});

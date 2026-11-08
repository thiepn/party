(() => {
  'use strict';
  const root=document.getElementById('app'),live=document.getElementById('status');
  const roomApi=(location.hostname==='localhost'||location.hostname==='127.0.0.1')?'http://localhost:8787':'https://rooms.party.thiepn.dev';
  const storeKey='chaosclub.28.seat',localeKey='chaosclub.28.lang';
  let locale=localStorage.getItem(localeKey)==='de'?'de':'en',sock=null,state=null,seat=null,error='',connecting=false,stopReconnect=false,delay=750;
  let cachedForm={},lastKey='',lastScope='',reconnectDraft=null,pendingSubmit=null;
  // Private drafts live only in this tab's memory, never in persistent storage.
  const draftScope=()=>state&&seat?`${state.code}|${state.round}|${state.stage}|${state.item?.type||''}|${seat.id}`:'';
  function rememberDraft(){
    const scope=draftScope();
    if(!scope||!['answer','prepare','perform'].includes(state.stage)||state.mine!=null)return;
    const values={};
    for(const el of document.querySelectorAll('[data-draft]'))values[el.getAttribute('data-draft')]=el.value;
    if(Object.keys(values).length)reconnectDraft={scope,values};
  }
  const T=(en,de)=>locale==='de'?de:en;
  const q=x=>{if(x==null)return '';if(typeof x==='string')return x;return x[state?.roomLanguage||locale]??x.en??x.de??'';};
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const nam=id=>state?.players?.find(p=>p.id===id)?.name||'?';
  const btn=(label,action,opts={})=>`<button class="btn ${opts.secondary?'secondary':''} ${opts.danger?'danger':''}" data-action="${esc(action)}" ${opts.disabled?'disabled':''} ${opts.value!==undefined?`data-value="${esc(opts.value)}"`:''}>${esc(label)}</button>`;
  const titleGame={social:['Social Radar','Social Radar'],comedy:['Comedy Battle','Comedy Battle'],bluff:['Bluff Club','Bluff-Club']};
  const types={majority:['Read the Room','Gruppenmeinung'],same:['Same Brain','Gleich gedacht'],know:['Know Your Friends','Kennt ihr euch?'],punchline:['Punchlines','Pointen'],pitch:['Pitch Battle','Pitch-Battle'],expert:['Fake Experts','Fake-Experten'],toast:['Toast Battle','Toast-Battle'],confession:['Confession or Fiction','Wahr oder erfunden'],twotruths:['Two Truths, One Lie','Zwei Wahrheiten, eine Lüge'],fact:['Fact Trap','Faktenfalle']};
  const modes={social:['mixed','majority','same','know'],comedy:['mixed','punchline','pitch','expert','toast'],bluff:['mixed','confession','twotruths','fact']};
  const roundCounts={social:{quick:4,standard:10,long:20},comedy:{quick:3,standard:8,long:16},bluff:{quick:3,standard:7,long:12}};
  const rules={
    majority:[["Everyone privately picks A or B. No hints until voting finishes.","Alle wählen geheim A oder B. Keine Hinweise bis zur Auflösung."],["After all votes, people in the majority earn 1 point each. A tie earns zero.","Nach allen Stimmen bekommt jede Person in der Mehrheit 1 Punkt. Gleichstand bringt 0."],["Discuss the surprise, then let the host advance.","Sprecht über die Überraschung. Danach startet der Host die nächste Runde."]],
    same:[["Everyone independently writes a short answer to the shared prompt.","Alle schreiben unabhängig eine kurze Antwort auf die gemeinsame Frage."],["Answers that differ only by case, extra spaces or surrounding punctuation match. Synonyms still require different wording and are not automatically merged.","Großschreibung, zusätzliche Leerzeichen und Satzzeichen am Rand zählen nicht als Unterschied. Synonyme werden nicht automatisch zusammengelegt."],["Score 1 point per other player with the same answer. After reveal, explain your choices.","Für jede weitere gleiche Antwort gibt es 1 Punkt. Nach der Auflösung könnt ihr eure Ideen erklären."]],
    know:[["The featured player privately chooses their real preference between A and B.","Die Person am Zug wählt ihre echte Vorliebe geheim zwischen A und B."],["All other players predict the choice privately. The featured player cannot earn a prediction point.","Alle anderen tippen geheim. Die Person am Zug bekommt keinen Punkt fürs eigene Ergebnis."],["Each correct prediction earns 1 point. The featured role rotates next round.","Jeder richtige Tipp bringt 1 Punkt. In der nächsten Runde ist jemand anderes dran."]],
    punchline:[["Two selected players write separate punchlines without showing each other.","Zwei ausgewählte Personen schreiben getrennt je eine Pointe."],["Their responses appear anonymously as shuffled Answer A and Answer B. Everyone else votes privately or abstains.","Die Antworten erscheinen anonym und gemischt als Antwort A und B. Alle anderen stimmen geheim ab oder enthalten sich."],["The author of the winning answer gets 2 points. A voted tie gives 1 each; zero votes give no points.","Der Verfasser der Siegerantwort erhält 2 Punkte. Gleichstand mit Stimmen gibt je 1 Punkt; ohne Stimmen gibt es keine Punkte."]],
    pitch:[["Performers A and B each try to sell the same ridiculous product in short spoken pitches.","A und B versuchen nacheinander, dasselbe absurde Produkt in kurzen mündlichen Vorträgen zu verkaufen."],["The host starts voting once both pitches finish. Performers cannot vote.","Nach beiden Vorträgen eröffnet der Host die Abstimmung. Die Auftretenden stimmen nicht mit."],["Audience winner earns 2 points; a tie with votes on both sides gives 1 each.","Publikumssieg gibt 2 Punkte; Gleichstand mit Stimmen auf beiden Seiten je 1 Punkt."]],
    expert:[["Both performers improvise an expert explanation of the given absurd topic, one at a time.","Beide Auftretenden improvisieren nacheinander eine Experten-Erklärung zum vorgegebenen absurden Thema."],["After both finish, other players privately choose the more entertaining one.","Danach wählen die anderen geheim den unterhaltsameren Beitrag."],["Winner: 2 points. Voted tie: 1 each. No votes: no points.","Sieg: 2 Punkte. Gleichstand mit Stimmen: je 1 Punkt. Ohne Stimmen: keine Punkte."]],
    toast:[["Two performers deliver short playful toasts inspired by the prompt. Nobody needs to drink.","Beide Auftretenden halten kurze, lustige Toasts zum Thema. Niemand muss trinken."],["The host opens voting after both are finished. The other players choose privately.","Nach beiden Beiträgen startet der Host die geheime Abstimmung."],["Winner: 2 points. Voted tie: 1 each; abstention is always allowed.","Sieg: 2 Punkte. Gleichstand mit Stimmen: je 1 Punkt. Enthaltung ist erlaubt."]],
    confession:[["The storyteller privately marks the story as real or invented, then tells it aloud.","Die erzählende Person markiert die Geschichte geheim als wahr oder erfunden und erzählt sie dann laut."],["Other players can ask questions and then privately vote True, Fiction or Abstain.","Die anderen dürfen nachfragen und stimmen dann geheim für Wahr, Erfunden oder Enthaltung."],["Each correct guess earns 1 point. If most cast votes are wrong, the storyteller gets 2 points.","Jeder richtige Tipp bringt 1 Punkt. Liegt die Mehrheit der abgegebenen Stimmen falsch, erhält die erzählende Person 2 Punkte."]],
    twotruths:[["The storyteller privately enters three different statements and marks exactly one as false.","Die erzählende Person schreibt drei unterschiedliche Aussagen und markiert genau eine davon geheim als falsch."],["The three statements appear in order. Others ask questions and independently pick the lie.","Die drei Aussagen werden angezeigt. Die anderen dürfen nachfragen und tippen unabhängig auf die Lüge."],["Correct guesses earn 1 point. If a majority guesses incorrectly, the storyteller gets 2 points.","Richtige Tipps bringen 1 Punkt. Wenn die Mehrheit falsch tippt, gibt es 2 Punkte für die erzählende Person."]],
    fact:[["One person guesses. Everyone else privately invents a plausible wrong answer to the factual question.","Eine Person rät. Alle anderen denken sich geheim plausible falsche Antworten auf die Wissensfrage aus."],["The room shuffles the true answer among the fakes without revealing authors. The guesser picks one.","Der Raum mischt die echte Antwort unter die falschen, ohne die Verfasser zu nennen. Die ratende Person wählt eine."],["Truth chosen: guesser +2. Bluff chosen: each author of that false answer +1. Identical answers are merged; if no false choice remains, the round is skipped. The source appears after reveal.","Echte Antwort: +2 für die ratende Person. Gewählte Lüge: +1 für alle mit derselben falschen Antwort. Gleiche Antworten werden zusammengelegt; ohne falsche Antwort entfällt die Runde. Die Quelle erscheint nach der Auflösung."]]
  };
  const urlJoin=new URLSearchParams(location.search).get('room')?.toUpperCase()||'';
  const guestInviteKey='chaosclub.28.pendingInvite',protectedLinks=new Map();
  const validProof=x=>typeof x==='string'&&/^[0-9a-f]{64}$/.test(x);
  const randomClaim=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
  let pendingGuestInvite=null;
  try{
    const saved=JSON.parse(sessionStorage.getItem(guestInviteKey)||'null');
    if(saved&&saved.code===urlJoin&&validProof(saved.token)&&validProof(saved.claim))pendingGuestInvite=saved;
  }catch{}
  const fragment=new URLSearchParams(typeof location.hash==='string'&&location.hash.startsWith('#')?location.hash.slice(1):'');
  const offered=fragment.get('invite');
  if(offered!==null){
    // Remove bearer token from address bar before rendering any invitation UI.
    history.replaceState(null,'',location.pathname+location.search);
    if(validProof(offered)&&/^[A-HJ-NP-Z2-9]{8}$/.test(urlJoin)){
      if(!pendingGuestInvite||pendingGuestInvite.token!==offered)
        pendingGuestInvite={code:urlJoin,token:offered,claim:randomClaim()};
      sessionStorage.setItem(guestInviteKey,JSON.stringify(pendingGuestInvite));
    }else{
      pendingGuestInvite=null;sessionStorage.removeItem(guestInviteKey);
    }
  }
  try{seat=JSON.parse(localStorage.getItem(storeKey)||'null');}catch{seat=null;}
  const token=()=>seat&&seat.code&&(urlJoin===''||seat.code===urlJoin);
  function socketUrl(code){const url=new URL('/ws',roomApi);url.searchParams.set('code',code);url.protocol=url.protocol==='https:'?'wss:':'ws:';return url.href;}
  async function connect(message){
    let code=(message.code||seat?.code||'').toUpperCase();
    if(message.action==='create'){try{const r=await fetch(roomApi+'/rooms',{method:'POST',headers:{'content-type':'application/json'},body:'{}',cache:'no-store'});if(!r.ok)throw new Error('Room creation unavailable');const created=await r.json();code=created.code;message={...message,code,createToken:created.createToken};}catch{connecting=false;error=T('Online rooms are not available yet.','Online-Räume sind noch nicht verfügbar.');render();return;}}
    if(sock&&sock.readyState===WebSocket.OPEN)sock.close();
    stopReconnect=false;connecting=true;error='';render();
    // Reserve capacity for the real host and reconnecting seats without putting
    // their credentials in the room URL. Anonymous guests use the bounded pool.
    const invited=message.action==='join'&&pendingGuestInvite?.code===code&&
      validProof(pendingGuestInvite.token)&&validProof(pendingGuestInvite.claim);
    const proof=message.action==='create'&&typeof message.createToken==='string'
      ?'cc-create.'+message.createToken
      :message.action==='resume'&&typeof message.id==='string'&&typeof message.token==='string'
        ?'cc-resume.'+message.id+'.'+message.token
        :invited?'cc-invite.'+pendingGuestInvite.token+'.'+pendingGuestInvite.claim:null;
    const ws=proof?new WebSocket(socketUrl(code),['chaos-room.v1',proof]):new WebSocket(socketUrl(code));sock=ws;
    ws.onopen=()=>{if(ws!==sock)return;delay=750;ws.send(JSON.stringify(message));};
    ws.onmessage=(event)=>{
      if(ws!==sock)return;
      let msg;try{msg=JSON.parse(event.data);}catch{return;}
      if(msg.type==='joined'){
        seat={code:msg.code,id:msg.id,token:msg.token};localStorage.setItem(storeKey,JSON.stringify(seat));
        if(pendingGuestInvite?.code===msg.code){pendingGuestInvite=null;sessionStorage.removeItem(guestInviteKey);}
        const newurl=new URL(location.href);newurl.searchParams.set('room',seat.code);history.replaceState(null,'',newurl.pathname+newurl.search);
        error='';connecting=false;
      }else if(msg.type==='invite_created'){
        if(state?.isHost&&state.code&&validProof(msg.token)){
          protectedLinks.set(msg.id,location.origin+'/room/?room='+state.code+'#invite='+msg.token);
          error=T('Private invite ready. Copy its link below.','Private Einladung bereit. Kopiere unten den Link.');
          render();
        }
      }else if(msg.type==='state'){
        state=msg;connecting=false;error='';
        if(!state.isHost)protectedLinks.clear();
        if(pendingSubmit && (msg.stage!==pendingSubmit.stage||msg.round!==pendingSubmit.round||msg.mine!=null||msg.myVote!=null))pendingSubmit=null;
        render();
      }else if(msg.type==='error'){
        if(msg.message==='Invalid reconnect credentials.'){
          // A newer tab may already have rotated this seat's token in shared storage.
          // Only discard credentials that belong to this rejected connection.
          let stored=null;try{stored=JSON.parse(localStorage.getItem(storeKey)||'null');}catch{}
          if(stored&&seat&&stored.code===seat.code&&stored.id===seat.id&&stored.token===seat.token)localStorage.removeItem(storeKey);
          seat=null;state=null;stopReconnect=true;
          error=T('This seat was moved or the room restarted. Join a new seat or ask the host.','Dieser Platz wurde verschoben oder der Raumserver neu gestartet. Tritt neu bei oder frage den Host.');
        }else error=msg.message;
        pendingSubmit=null;connecting=false;render();
      }
    };
    ws.onerror=()=>{
      if(ws!==sock)return;
      error=invited?T('Private invitation unavailable. Use room-code joining instead.','Private Einladung nicht verfügbar. Tritt stattdessen mit dem Raumcode bei.'):
        T('Cannot reach the secure room service.','Der sichere Raumserver ist nicht erreichbar.');
    };
    ws.onclose=()=>{
      if(ws!==sock)return;
      connecting=false;pendingSubmit=null;
      if(!stopReconnect&&seat){
        rememberDraft();
        state=null;error=T('Disconnected. Reconnecting…','Verbindung verloren. Erneuter Verbindungsversuch …');render();
        const wait=delay;delay=Math.min(delay*1.7,8000);
        setTimeout(()=>{if(ws===sock&&!stopReconnect&&seat)connect({action:'resume',...seat});},wait);
      }else{render();}
    };
  }
  const send=(data)=>{
    if(!sock||sock.readyState!==WebSocket.OPEN){error=T('Connection lost. Reconnect first.','Verbindung verloren. Bitte erneut verbinden.');render();return;}
    if(data.action==='submit'){
      if(pendingSubmit&&pendingSubmit.round===data.round&&pendingSubmit.stage===state?.stage)return;
      pendingSubmit={round:data.round,stage:state?.stage};
    }
    sock.send(JSON.stringify(data));
  };
  function identify(){
    if(!seat)return;
    const requested=urlJoin||seat.code;
    if(requested===seat.code)connect({action:'resume',...seat});
  }
  function formValues(){
    const inputs=[...document.querySelectorAll('[data-draft]')];
    for(const element of inputs)cachedForm[element.getAttribute('data-draft')]=element.value;
  }
  function render(){
    const scope=draftScope();
    const key=state?`${scope}|${state.isHost?'host':'guest'}|${state.mine!=null?'answered':'unanswered'}|${state.myVote!=null?'voted':'unvoted'}`:'landing';
    const sameScope=!!scope&&scope===lastScope;
    const active=document.activeElement;
    const draftKey=active?.getAttribute?.('data-draft');
    // Another player's submission updates counts but must not dismiss this player's keyboard.
    if(key===lastKey&&!error&&draftKey&&state?.stage!=='lobby'&&
       (active.tagName==='INPUT'||active.tagName==='TEXTAREA')){
      const progress=document.querySelector('[data-live-progress]');
      if(progress){
        progress.textContent=`${state.stage==='vote'?state.voted:state.received}/${state.required}`;
        live.textContent=T('Participation updated','Teilnahme aktualisiert');
      }
      return;
    }
    let focusRestore=null;
    if(sameScope&&draftKey){
      focusRestore={key:draftKey,start:typeof active.selectionStart==='number'?active.selectionStart:null,
        end:typeof active.selectionEnd==='number'?active.selectionEnd:null};
    }
    if(sameScope)formValues();
    else if(reconnectDraft&&scope===reconnectDraft.scope)cachedForm={...reconnectDraft.values};
    else cachedForm={};
    if(scope&&reconnectDraft&&scope!==reconnectDraft.scope)reconnectDraft=null;
    lastKey=key;lastScope=scope;
    document.documentElement.lang=locale;
    const header=`<header class="top"><div class="brand">✳ CHAOS <span>CLUB</span> </div><div class="header-actions"><button class="chip" data-action="language" aria-label="${T('Switch language','Sprache ändern')}">${locale.toUpperCase()} ⇄</button><a href="/" class="chip">${T('One phone','Ein Handy')}</a></div></header>`;
    const body=!state?landing():game();
    root.innerHTML=`<div class="shell">${header}${error?`<div role="alert" class="notice">${esc(error)}</div>`:''}${body}${(!state||state.stage==='lobby')?`<p class="foot">${T('No accounts. Secure online rooms. Do not share your private reconnect credentials.','Keine Konten. Sichere Online-Räume. Gib deine privaten Zugangsdaten zur Wiederverbindung nicht weiter.')}</p>`:''}</div>`;
    for(const el of document.querySelectorAll('[data-draft]')){
      const value=cachedForm[el.getAttribute('data-draft')];if(value!==undefined)el.value=value;
    }
    live.textContent=state?`${state.stage}, ${state.round+1}`:'';
    const qr=root.querySelector('.room-qr');if(qr&&window.ChaosQRCode?.draw){const invite=`${location.origin}/room/?room=${state.code}`;window.ChaosQRCode.draw(qr,invite);}
    if(focusRestore){
      const restored=[...root.querySelectorAll('[data-draft]')].find(el=>el.getAttribute('data-draft')===focusRestore.key);
      if(restored){
        restored.focus({preventScroll:true});
        if(focusRestore.start!==null&&typeof restored.setSelectionRange==='function'){
          try{restored.setSelectionRange(focusRestore.start,focusRestore.end);}catch{}
        }
      }
    }
  }
  function landing(){return `<section class="hero"><div class="eyebrow">${T('Play together on separate phones','Zusammen auf mehreren Handys')}</div><h1>${T('THE SAME PARTY. ONE ROOM.','EINE PARTY. EIN RAUM.')}</h1><p class="sub">${T('Create a room online, share the link, and play on your own phones. No computer server needed.','Erstelle online einen Raum, teile den Link und spielt auf euren eigenen Handys. Kein Computer-Server nötig.')}</p></section><div class="grid"><section class="panel"><h2>${T('Create room','Raum erstellen')}</h2><form data-form="create"><label class="field" for="host-name">${T('Your name','Dein Name')}</label><input class="input" id="host-name" data-draft="host-name" autocomplete="nickname" maxlength="24" required placeholder="${T('Host','Host')}">${btn(T('Create private room','Privaten Raum erstellen'),'create')}</form></section><section class="panel"><h2>${T('Join room','Raum beitreten')}</h2><form data-form="join"><label class="field" for="join-name">${T('Your name','Dein Name')}</label><input id="join-name" class="input" maxlength="24" data-draft="join-name" autocomplete="nickname" required><label class="field" for="join-code">${T('Room code','Raumcode')}</label><input id="join-code" class="input joincode" maxlength="8" data-draft="join-code" value="${esc(urlJoin)}" required>${btn(T('Join','Beitreten'),'join')}</form></section></div>${pendingGuestInvite?'<div class="panel">'+btn(T('Use room code without invitation','Ohne Einladung mit Raumcode beitreten'),'discard-invite',{secondary:true})+'</div>':''}${token()?`<div class="panel">${btn(T('Reconnect to your saved seat','Gespeicherten Platz wiederherstellen'),'resume',{secondary:true})} ${btn(T('Use a different seat','Anderen Platz verwenden'),'forget',{secondary:true})}</div>`:''}`;}
  function people(){return `<div class="panel"><h2>${T('Players','Spieler')} · ${state.players.length}/6</h2>${state.players.map(p=>`<div class="person"><strong>${esc(p.name)}</strong>${p.id===state.host?`<span class="pill">Host</span>`:''}${p.id===state.you?`<span class="pill">${T('You','Du')}</span>`:''}<span class="pill ${p.connected?'good':'bad'}">${p.connected?T('Connected','Verbunden'):T('Offline','Offline')}</span>${state.isHost&&p.id!==state.host&&p.connected?`<button class="chip" data-action="transfer" data-value="${p.id}">${T('Make host','Host übertragen')}</button>`:''}${state.isHost&&state.stage==='lobby'&&!p.connected&&p.id!==state.host?`<button class="chip" data-action="kick" data-value="${p.id}">${T('Remove','Entfernen')}</button>`:''}</div>`).join('')}</div>`;}
  function invitationPanel(){
    if(!state?.isHost||state.stage!=='lobby')return '';
    const issued=state.invitations||[];
    const remaining=6-state.players.length-issued.length;
    const rows=issued.map((inv,index)=>{
      const link=protectedLinks.get(inv.id);
      const expiry=new Date(inv.expiresAt).toLocaleTimeString(locale==='de'?'de-DE':'en-US',{hour:'2-digit',minute:'2-digit'});
      return '<div class="person"><strong>'+esc(T('Guest invitation ','Gasteinladung ')+(index+1))+'</strong>'+
        '<span class="pill">'+esc(expiry)+'</span>'+
        (link?btn(T('Copy private link','Privaten Link kopieren'),'copy-protected',{value:inv.id,secondary:true}):
          '<span class="pill">'+esc(T('Link only on issuing device','Link nur auf dem erstellenden Gerät'))+'</span>')+
        btn(T('Revoke','Widerrufen'),'invite_revoke',{value:inv.id,secondary:true})+'</div>';
    }).join('');
    return '<section class="panel"><h2>'+T('Protected guest invitations','Geschützte Gasteinladungen')+'</h2>'+
      '<p class="sub">'+T('One private link per guest, even when anonymous slots are full. Share privately.','Ein privater Link pro Gast, auch bei vollen anonymen Plätzen. Nur privat teilen.')+'</p>'+
      rows+'<div class="actions">'+btn(T('Create private invitation','Private Einladung erstellen'),'invite_issue',{disabled:remaining<=0})+'</div></section>';
  }
  function settings(){return `<section class="panel"><h2>${T('Set up your game','Spiel vorbereiten')}</h2><form data-form="start"><label class="field" for="room-game">${T('Game','Spiel')}</label><select id="room-game" class="input" data-draft="game"><option value="social">Social Radar</option><option value="comedy">Comedy Battle</option><option value="bluff">Bluff Club</option></select><label class="field" for="room-mode">${T('Mode','Modus')}</label><select id="room-mode" class="input" data-draft="mode"></select><label class="field" for="room-language">${T('Game content language','Sprache der Spielinhalte')}</label><select id="room-language" class="input" data-draft="language"><option value="en">English</option><option value="de">Deutsch</option></select><label class="field" for="room-duration">${T('Session','Spiellänge')}</label><select id="room-duration" class="input" data-draft="duration"><option value="quick">${T('Quick','Kurz')}</option><option value="standard" selected>${T('Standard','Standard')}</option><option value="long">${T('Long','Lang')}</option></select><details class="setup-guide"><summary>${T('Rules for this game','Regeln für dieses Spiel')}</summary><ol class="step" id="setup-rules"></ol></details><div class="actions">${btn(T('Start with 4–6 connected players','Mit 4–6 verbundenen Personen starten'),'start',{disabled:state.players.length<4||state.players.some(x=>!x.connected)})}</div></form></section>`;}
  function game(){
    const invite=(`${location.origin}/room/?room=${state.code}`);
    let inner=state.stage==='lobby'
      ?`<section class="hero"><div class="row"><div><div class="eyebrow">${T('Private party room','Privater Partyraum')}</div><div class="roomcode">${esc(state.code)}</div></div><span class="pill">${T('Share this code with friends','Code mit Freunden teilen')}</span></div><div class="actions">${btn(T('Copy invite link','Einladungslink kopieren'),'copy',{secondary:true})}</div><p class="sub" style="overflow-wrap:anywhere;font-size:.85rem">${esc(invite)}</p><canvas class="room-qr" width="156" height="156" aria-label="${T('Scannable room invitation QR code','Scanbarer QR-Code für die Raumeinladung')}"></canvas></section>`
      :`<div class="room-mini"><span>${T('Room','Raum')} <b>${esc(state.code)}</b></span><button class="chip" data-action="copy">${T('Invite','Einladen')}</button></div>`;
    if(state.stage==='lobby')return inner+people()+(state.isHost?invitationPanel()+settings():`<div class="panel">${T('Waiting for host to start.','Warten, bis der Host startet.')}</div>`);
    inner+=`<div class="panel"><div class="row"><span class="round-tag">${esc((titleGame[state.game]||[])[locale==='de'?1:0]||state.game)} · ${esc(state.stage==='end'?T('Finished','Beendet'):`${T('Round','Runde')} ${state.round+1}/${state.total}`)}</span><span class="pill">${esc(state.mode==='mixed'?T('Mixed','Gemischt'):T(...(types[state.mode]||[state.mode,state.mode])))}</span></div></div>`;
    if(state.stage==='end')return inner+scoreboard()+`<div class="panel"><div class="big">${T('Session complete','Spiel beendet')}</div><p>${state.completed} ${T('played','gespielt')} · ${state.skipped} ${T('skipped','übersprungen')}</p>${state.isHost?btn(T('Choose another game','Anderes Spiel wählen'),'lobby'):''}</div>`;
    inner+=current()+`<details class="panel"><summary>${T('How to play this round','Spielregeln dieser Runde')}</summary><ol class="step">${(rules[state.item.type]||[]).map(([en,de])=>`<li>${esc(T(en,de))}</li>`).join('')}</ol><p class="step">${T('Quick / Standard / Long changes the round count, not the voting rules. You may skip a round without penalty.','Kurz / Standard / Lang ändert die Rundenzahl, nicht die Regeln. Runden dürfen ohne Strafe übersprungen werden.')}</p></details>`;
    if(state.isHost)inner+=`<div class="panel"><div class="row"><b>${T('Host controls','Host-Steuerung')}</b><span class="pill">${state.completed} ${T('completed','abgeschlossen')}</span></div><div class="actions">${state.stage==='live'?btn(T('Both performed — open voting','Beide fertig — Abstimmung starten'),'open_vote'):''}${state.stage==='reveal'?btn(T('Next round','Nächste Runde'),'next'):btn(T('Skip round','Runde überspringen'),'skip',{secondary:true})}${btn(T('End session','Spiel beenden'),'finish',{danger:true})}</div>${state.players.some(p=>p.connected&&p.id!==state.host)?`<details class="host-handoff"><summary>${T('Hand over host controls','Host-Rechte abgeben')}</summary><div class="actions">${state.players.filter(p=>p.connected&&p.id!==state.host).map(p=>btn(T('Make ','')+p.name+T(' host',' zum Host machen'),'transfer',{value:p.id,secondary:true})).join('')}</div></details>`:''}</div>`;
    return inner;
  }
  function scoreboard(inline=false){return `<${inline?'div':'section'} class="${inline?'standings':'panel'}"><h2>${T('Scoreboard','Punktestand')}</h2>${[...state.players].sort((a,b)=>b.points-a.points).map(p=>`<div class="score"><span>${esc(p.name)}</span><b>${p.points}</b></div>`).join('')}</${inline?'div':'section'}>`;}
  function current(){
    const it=state.item,k=it.type,owner=state.featured===state.you,performer=state.pair.includes(state.you),mine=state.mine!==null&&state.mine!==undefined,voted=state.myVote!==null&&state.myVote!==undefined;
    const base=`<div class="round-tag">${T(...(types[k]||[k,k]))}</div><div class="big">${esc(q(it.q))}</div>`;
    let content='';
    if(state.stage==='answer'){
      content=`<div class="sub">${k==='know'?owner?T('Choose your true preference privately.','Wähle deine echte Vorliebe geheim.'):T(`Guess ${esc(nam(state.featured))}’s choice privately.`,`Rate die Wahl von ${esc(nam(state.featured))} geheim.`):k==='same'?T('Write one short answer. Matching answers score.','Schreib eine kurze Antwort. Übereinstimmende Antworten punkten.'):T('Vote A or B privately.','Wähle A oder B geheim.')}</div>`;
      if(mine)content+=`<div class="answer">${T('Answer locked. Waiting for the others.','Antwort gespeichert. Warten auf die anderen.')}</div>`;
      else if(k==='same')content+=`<form data-form="text"><label class="field" for="answer">${T('Your answer','Deine Antwort')}</label><input id="answer" class="input" maxlength="90" data-draft="answer" required>${btn(T('Submit answer','Antwort abgeben'),'text')}</form>`;
      else content+=`<div class="options-list">${it.options.map((a,i)=>`<button class="option-card" data-action="choice" data-value="${i}"><b>${i===0?'A':'B'}</b>${esc(q(a))}</button>`).join('')}</div>`;
    }else if(state.stage==='perform'){
      content=performer?(mine?`<div class="answer">${T('Punchline locked.','Pointe gespeichert.')}</div>`:`<form data-form="text"><label class="field" for="answer">${T('Write a punchline privately','Schreibe deine Pointe geheim')}</label><textarea id="answer" class="input" maxlength="240" data-draft="answer" required></textarea>${btn(T('Submit','Abgeben'),'text')}</form>`):`<p class="sub">${T('The two performers are writing.','Die beiden Personen schreiben ihre Pointen.')}</p>`;
    }else if(state.stage==='live'){
      content=`<p class="sub">${T('Each performer takes a short turn. After both finish, the host opens private voting.','Beide Personen tragen kurz nacheinander vor. Danach startet der Host die geheime Abstimmung.')}</p><div class="answer"><b>A</b> ${esc(nam(state.pair[0]))}</div><div class="answer"><b>B</b> ${esc(nam(state.pair[1]))}</div>`;
    }else if(state.stage==='prepare'){
      if(k==='fact'){
        content=owner?`<p class="sub">${T('You are the guesser. Others are writing convincing lies.','Du rätst. Die anderen erfinden glaubwürdige Lügen.')}</p>`:mine?`<div class="answer">${T('Bluff saved. Waiting for the others.','Lüge gespeichert. Warten auf die anderen.')}</div>`:`<form data-form="text"><label class="field" for="answer">${T('Your believable false answer','Deine glaubwürdige falsche Antwort')}</label><input id="answer" maxlength="90" class="input" data-draft="answer" required>${btn(T('Submit bluff','Lüge abgeben'),'text')}</form>`;
      }else if(!owner)content=`<p class="sub">${esc(nam(state.featured))} ${T('is preparing the story.','bereitet die Geschichte vor.')}</p>`;
      else if(mine)content=`<p class="sub">${T('Secret saved. Tell your story aloud while others decide.','Geheimnis gespeichert. Erzähle deine Geschichte laut, während die anderen überlegen.')}</p>`;
      else if(k==='confession')content=`<p class="sub">${T('Tell your story aloud. Choose its truth privately.','Erzähle deine Geschichte laut. Markiere die Wahrheit geheim.')}</p><div class="choices">${btn(T('True story','Wahre Geschichte'),'truth',{value:'true'})}${btn(T('Invented','Erfunden'),'truth',{value:'false',secondary:true})}</div>`;
      else content=`<form data-form="statements"><p class="sub">${T('Enter three statements, then select which one is false.','Schreibe drei Aussagen auf und wähle die Lüge.')}</p>${[0,1,2].map(i=>`<label class="field" for="statement${i}">${i+1}</label><input id="statement${i}" data-draft="statement${i}" class="input" maxlength="140" required>`).join('')}<label class="field" for="lie">${T('False statement','Falsche Aussage')}</label><select id="lie" data-draft="lie" class="input"><option value="0">1</option><option value="1">2</option><option value="2">3</option></select>${btn(T('Lock statements','Aussagen speichern'),'statements')}</form>`;
    }else if(state.stage==='vote'){
      const eligible=state.game==='social'?true:state.game==='comedy'?!performer:k==='fact'?owner:!owner;
      if(k==='twotruths')content+=it.statements.map((x,i)=>`<div class="answer"><b>${i+1}</b> ${esc(x)}</div>`).join('');
      if(k==='fact')content+=`<p class="sub">${T('Only the guesser votes. Which answer is real?','Nur die ratende Person stimmt ab. Welche Antwort ist echt?')}</p>`;
      if(k==='punchline')content+=it.choices.map((a,i)=>`<div class="answer"><b>${i===0?'A':'B'}</b> ${esc(a)}</div>`).join('');
      if(k==='fact'&&owner&&!voted)content+=`<div class="options-list">${it.choices.map((x,i)=>`<button class="option-card" data-action="vote" data-value="${i}"><b>${i+1}</b>${esc(q(x))}</button>`).join('')}</div>`;
      else if(k==='twotruths'&&eligible&&!voted)content+=`<div class="options-list">${[0,1,2].map(i=>`<button class="option-card" data-action="vote" data-value="${i}">${T('Statement','Aussage')} ${i+1}</button>`).join('')}</div>`;
      else if(eligible&&!voted&&k!=='fact'&&k!=='twotruths')content+=`<div class="options-list">${[0,1].map(i=>`<button class="option-card" data-action="vote" data-value="${i}"><b>${i===0?'A':'B'}</b>${state.game==='bluff'?(i===0?T('True','Wahr'):T('Invented','Erfunden')):state.game==='comedy'?(k==='punchline'?T(`Answer ${i===0?'A':'B'}`,`Antwort ${i===0?'A':'B'}`):T(`Performer ${i===0?'A':'B'}`,`Person ${i===0?'A':'B'}`)):''}</button>`).join('')}<button class="option-card" data-action="vote" data-value="-1">${T('Abstain','Enthalten')}</button></div>`;
      else if(voted)content+=`<p class="sub">${T('Vote locked.','Stimme gespeichert.')}</p>`;
      else content+=`<p class="sub">${T('Waiting for votes. You cannot vote in this role.','Warten auf Stimmen. Deine Rolle stimmt nicht ab.')}</p>`;
    }else if(state.stage==='reveal'){
      content=results(it);
    }
    const target=state.stage==='vote'?state.required:state.stage==='answer'||state.stage==='perform'||state.stage==='prepare'?state.required:0;
    if(target)content+=`<div class="stat" style="margin-top:14px"><strong data-live-progress>${state.stage==='vote'?state.voted:state.received}/${target}</strong>${state.stage==='vote'?T('Votes received','Stimmen eingegangen'):T('Answers received','Antworten eingegangen')}</div>`;
    if((state.stage==='answer'||state.stage==='prepare'||state.stage==='vote')&&state.players.some(x=>!x.connected))content+=`<p class="sub">${T('A player is disconnected. Their seat remains reserved. Reconnect to finish or ask the host to skip the round.','Eine Person ist offline. Der Platz bleibt reserviert. Zum Beenden wieder verbinden oder den Host die Runde überspringen lassen.')}</p>`;
    return `<section class="panel">${base}${content}</section>`;
  }
  function results(it){
    let body=`<div class="big">${T('Round result','Rundenergebnis')}</div>`;
    if(state.game==='social'){
      if(it.type==='same'){
        for(const p of state.players)body+=`<div class="answer"><b>${esc(p.name)}</b> ${esc(it.answers?.[p.id]||'')}</div>`;
      }else{
        body+=`<div class="answer">${it.type==='know'?T('Friends predicted','Freunde tippten')+': ':''}A: ${it.counts?.[0]||0} · B: ${it.counts?.[1]||0}</div>`;
        if(it.type==='know')body+=`<div class="answer">${T('Featured player chose','Die Person am Zug wählte')}: <b>${it.correct===0?'A':'B'} · ${esc(q(it.options[it.correct]))}</b></div>`;
      }
    }else if(state.game==='comedy'){
      if(it.type==='punchline')body+=it.choices.map((a,i)=>`<div class="answer"><b>${esc(nam(it.authors[i]))}</b> ${esc(a)}</div>`).join('');
      body+=`<div class="answer">${T('Audience votes','Publikumsstimmen')}: A ${it.voteCounts?.[0]||0} · B ${it.voteCounts?.[1]||0}${it.abstentions?` · ${it.abstentions} ${T('abstained','enthalten')}`:''}</div>`;
    }else if(it.type==='confession')body+=`<div class="answer">${it.truth?T('The story was true.','Die Geschichte war wahr.'):T('The story was invented.','Die Geschichte war erfunden.')}</div>`;
    else if(it.type==='twotruths')body+=`<div class="answer">${T('The lie was statement','Die Lüge war Aussage')} ${it.lie+1}.</div>`;
    else if(it.type==='fact'){
      body+=`<div class="answer">${T('Correct answer','Richtige Antwort')}: <strong>${esc(q(it.choices[it.truthIndex]))}</strong></div>`;
      if(it.source?.url?.startsWith('https://'))body+=`<p class="sub">${T('Fact checked against','Fakten geprüft anhand von')}: <a href="${esc(it.source.url)}" target="_blank" rel="noopener noreferrer">${esc(it.source.name||T('Source','Quelle'))}</a></p>`;
    }
    return body+scoreboard(true);
  }
  function fillModes(){
    const game=document.querySelector('#room-game'),mode=document.querySelector('#room-mode');
    if(!game||!mode)return;
    const selected=cachedForm.game||game.value;
    if(modes[selected])game.value=selected;
    const prior=cachedForm.mode||'mixed';
    mode.innerHTML=modes[game.value].map(k=>`<option value="${k}">${k==='mixed'?T('Mixed','Gemischt'):T(...types[k])}</option>`).join('');
    mode.value=modes[game.value].includes(prior)?prior:'mixed';
    const length=document.querySelector('#room-duration');
    if(cachedForm.duration)length.value=cachedForm.duration;
    for(const opt of length.options){
      const word={quick:T('Quick','Kurz'),standard:T('Standard','Standard'),long:T('Long','Lang')}[opt.value];
      opt.textContent=`${word} · ${roundCounts[game.value][opt.value]} ${T('rounds','Runden')}`;
    }
    document.querySelector('#room-language').value=cachedForm.language||locale;
    fillSetupGuide();
  }
  function fillSetupGuide(){
    const mode=document.querySelector('#room-mode'),el=document.querySelector('#setup-rules');
    if(!mode||!el)return;
    const kind=mode.value==='mixed'?modes[document.querySelector('#room-game').value][1]:mode.value;
    const lines=rules[kind]||[];
    el.innerHTML=lines.map(([en,de])=>`<li>${esc(T(en,de))}</li>`).join('');
    if(mode.value==='mixed')el.innerHTML+=`<li>${T('Mixed mode rotates through different round types; read the round-specific rules during play.','Im gemischten Modus wechseln die Rundenarten. Die konkreten Rundenregeln stehen während des Spiels bereit.')}</li>`;
  }
  root.addEventListener('input',e=>{const key=e.target.getAttribute?.('data-draft');if(key)cachedForm[key]=e.target.value;});
  root.addEventListener('change',e=>{const key=e.target.getAttribute?.('data-draft');if(key)cachedForm[key]=e.target.value;if(e.target.id==='room-game'){cachedForm.game=e.target.value;cachedForm.mode='mixed';fillModes();}else if(e.target.id==='room-mode')fillSetupGuide();});
  root.addEventListener('submit',e=>{
    const form=e.target.closest('form');if(!form)return;e.preventDefault();const type=form.dataset.form;
    if(type==='create'){
      const name=form.querySelector('#host-name').value.trim().slice(0,24)||'Host';connect({action:'create',name});
    }else if(type==='join'){
      const code=form.querySelector('#join-code').value.trim().toUpperCase(),name=form.querySelector('#join-name').value.trim();
      if(!/^[A-HJ-NP-Z2-9]{8}$/.test(code)||!name){error=T('Enter an eight-character room code.','Gib einen achtstelligen Raumcode ein.');render();return;}connect({action:'join',code,name});
    }else if(type==='start'){
      send({action:'start',game:form.querySelector('#room-game').value,mode:form.querySelector('#room-mode').value,duration:form.querySelector('#room-duration').value,language:form.querySelector('#room-language').value});
    }else if(type==='text')send({action:'submit',round:state.round,text:form.querySelector('#answer').value.trim()});
    else if(type==='statements')send({action:'submit',round:state.round,statements:[0,1,2].map(i=>form.querySelector(`#statement${i}`).value.trim()),lie:Number(form.querySelector('#lie').value)});
  });
  root.addEventListener('click',async e=>{
    const el=e.target.closest('[data-action]');if(!el)return;
    const act=el.dataset.action,v=el.dataset.value;
    if(act==='language'){locale=locale==='en'?'de':'en';localStorage.setItem(localeKey,locale);render();return;}
    if(act==='copy'){const invite=`${location.origin}/room/?room=${state.code}`;try{await navigator.clipboard.writeText(invite);error=T('Invite copied.','Einladung kopiert.');}catch{error=T('Copy this invite URL: ','Einladungslink zum Kopieren: ')+invite;}render();return;}
    if(act==='copy-protected'){
      const link=protectedLinks.get(v);
      if(link){try{await navigator.clipboard.writeText(link);error=T('Private invite copied.','Private Einladung kopiert.');}
        catch{error=T('Copy this private invitation: ','Diese private Einladung kopieren: ')+link;}}
      render();return;
    }
    if(act==='discard-invite'){
      pendingGuestInvite=null;sessionStorage.removeItem(guestInviteKey);error='';render();return;
    }
    if(act==='resume'){connect({action:'resume',...seat});return;}
    if(act==='forget'){reconnectDraft=null;pendingSubmit=null;stopReconnect=true;if(sock)sock.close();sock=null;seat=null;state=null;localStorage.removeItem(storeKey);error='';render();return;}
    if(act==='create'||act==='join')return;
    if(!state)return;
    if(act==='invite_issue')send({action:'invite_issue'});
    else if(act==='invite_revoke'){
      if(confirm(T('Revoke unused invitation?','Ungenutzte Einladung widerrufen?'))){
        protectedLinks.delete(v);send({action:'invite_revoke',id:v});
      }
    }
    else if(act==='choice')send({action:'submit',round:state.round,choice:Number(v)});
    else if(act==='truth')send({action:'submit',round:state.round,truth:v==='true'});
    else if(act==='vote')send({action:'submit',round:state.round,choice:Number(v)});
    else if(['skip','finish'].includes(act)){
      const msg=act==='skip'?T('Skip this round without points?','Diese Runde ohne Punkte überspringen?'):T('End the current session for everyone?','Aktuelle Runde für alle beenden?');
      if(confirm(msg))send({action:act});
    }else if(act==='kick'){if(confirm(T('Remove disconnected seat?','Offline-Platz entfernen?')))send({action:act,target:v});}
    else if(act==='transfer'){if(confirm(T('Transfer host control?','Host-Rechte übertragen?')))send({action:act,target:v});}
    else if(['open_vote','next','lobby'].includes(act))send({action:act});
  });
  // Track and restore the host's game/mode controls on state updates.
  const observer=new MutationObserver(()=>{if(state?.stage==='lobby'&&state.isHost){
    const el=document.querySelector('#room-mode');if(el&&el.options.length===0)fillModes();
  }});
  observer.observe(root,{childList:true,subtree:false});
  render();identify();
})();

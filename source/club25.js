/* V2.5 original content and deterministic session-state helpers. */
(() => {
  'use strict';
  const P = (en,de) => ({en,de});
  const pairs = [
    ['Hotel','Hostel','Hotel','Hostel'],['Cinema','Theatre','Kino','Theater'],['Dentist','Doctor','Zahnarzt','Arzt'],
    ['Train station','Bus station','Bahnhof','Busbahnhof'],['Birthday party','Wedding reception','Geburtstagsparty','Hochzeitsfeier'],
    ['Camping trip','Music festival','Campingausflug','Musikfestival'],['Swimming pool','Water park','Schwimmbad','Wasserpark'],
    ['Karaoke bar','Nightclub','Karaoke-Bar','Nachtclub'],['Job interview','First date','Vorstellungsgespräch','Erstes Date'],
    ['Airport','Cruise terminal','Flughafen','Kreuzfahrtterminal'],['Gym','Dance studio','Fitnessstudio','Tanzstudio'],
    ['Museum','Art gallery','Museum','Kunstgalerie'],['Wedding planner','Event manager','Hochzeitsplaner','Eventmanager'],
    ['Lost luggage','Missing phone','Verlorenes Gepäck','Verschwundenes Handy'],['Escape room','Haunted house','Escape Room','Geisterhaus'],
    ['Picnic','Barbecue','Picknick','Grillabend'],['Cooking class','Baking class','Kochkurs','Backkurs'],
    ['Birthday cake','Wedding cake','Geburtstagstorte','Hochzeitstorte'],['School reunion','Office party','Klassentreffen','Bürofeier'],
    ['Board game','Card game','Brettspiel','Kartenspiel'],['Taxi','Ride share','Taxi','Mitfahrdienst'],
    ['Beach holiday','City break','Strandurlaub','Städtetrip'],['Surprise party','Farewell party','Überraschungsparty','Abschiedsparty'],
    ['Tour guide','Museum guide','Reiseführer','Museumsführer']
  ].map(([a,b,c,d])=>[P(a,c),P(b,d)]);
  const locations = [
    P('Lost property office','Fundbüro'),P('Night train','Nachtzug'),P('Backstage at a concert','Hinter der Konzertbühne'),
    P('Hotel breakfast buffet','Hotelfrühstücksbuffet'),P('Wedding dance floor','Tanzfläche einer Hochzeit'),
    P('Student dorm kitchen','Küche im Studentenwohnheim'),P('Airport baggage claim','Gepäckausgabe am Flughafen'),
    P('Escape room','Escape Room'),P('Karaoke booth','Karaoke-Kabine'),P('Camping campsite','Campingplatz'),
    P('Late-night diner','Nachtimbiss'),P('Supermarket checkout','Supermarktkasse'),
    P('Photography studio','Fotostudio'),P('Train dining car','Speisewagen'),P('Theatre dressing room','Theatergarderobe'),
    P('Public swimming pool','Öffentliches Schwimmbad'),P('Bowling alley','Bowlingbahn'),P('Amusement park queue','Warteschlange im Freizeitpark')
  ];
  const actions = [
    [P('Adjust an invisible tie.','Richte eine unsichtbare Krawatte.'),P('Brush imaginary crumbs from your shirt.','Streife imaginäre Krümel vom Hemd.'),P('Check your wrist as if wearing a watch.','Sieh auf dein Handgelenk wie auf eine Uhr.')],
    [P('Pretend to take a selfie.','Tu so, als würdest du ein Selfie machen.'),P('Nod very seriously.','Nicke ganz ernst.'),P('Look under the table.','Schau unter den Tisch.')],
    [P('Raise your right hand.','Hebe die rechte Hand.'),P('Wave at someone behind you.','Winke jemandem hinter dir.'),P('Touch your left elbow.','Berühre den linken Ellbogen.')],
    [P('Pretend to open a heavy door.','Tu so, als würdest du eine schwere Tür öffnen.'),P('Scratch your head.','Kratze dich am Kopf.'),P('Point at the ceiling.','Zeige an die Decke.')],
    [P('Brush your hair back.','Streiche die Haare zurück.'),P('Make a tiny bow.','Verbeuge dich leicht.'),P('Fold your arms.','Verschränke die Arme.')],
    [P('Tap your knee twice.','Tippe zweimal ans Knie.'),P('Blink three times.','Blinzle dreimal.'),P('Look at your shoes.','Schau auf deine Schuhe.')],
    [P('Mime putting on sunglasses.','Tu so, als würdest du eine Sonnenbrille aufsetzen.'),P('Turn to the left.','Dreh dich nach links.'),P('Thumbs up.','Zeig den Daumen hoch.')],
    [P('Make a tiny heart with your fingers.','Forme mit den Fingern ein kleines Herz.'),P('Pretend to write a note.','Tu so, als würdest du eine Notiz schreiben.'),P('Cross your ankles.','Überkreuze deine Fußgelenke.')]
  ];
  const concepts = [
    ['Missing the last train','Den letzten Zug verpassen'],['Accidentally entering the wrong group chat','Aus Versehen im falschen Gruppenchat landen'],
    ['A surprise birthday party','Eine Überraschungsparty'],['A spectacularly bad haircut','Ein katastrophaler Haarschnitt'],
    ['Asking for a refund','Eine Rückerstattung verlangen'],['A delayed flight announcement','Eine Durchsage über Flugverspätung'],
    ['Losing your suitcase','Seinen Koffer verlieren'],['An awkward first date','Ein peinliches erstes Date'],
    ['A disastrous cooking class','Ein misslungener Kochkurs'],['The wrong pizza delivery','Die falsche Pizzalieferung'],
    ['A karaoke duet','Ein Karaoke-Duett'],['An unexpected job interview','Ein überraschendes Vorstellungsgespräch'],
    ['A surprise video call','Ein unerwarteter Videoanruf'],['A failed driving lesson','Eine misslungene Fahrstunde'],
    ['Trying to build flat-pack furniture','Versuchen, ein Möbelstück aufzubauen'],['Getting lost in a museum','Sich im Museum verlaufen'],
    ['A train ticket inspection','Eine Fahrkartenkontrolle'],['A forgotten wedding speech','Eine vergessene Hochzeitsrede'],
    ['A birthday cake disaster','Eine Tortenpanne am Geburtstag'],['An embarrassing voicemail','Eine peinliche Mailboxnachricht'],
    ['A very competitive board game','Ein übertrieben ehrgeiziges Brettspiel'],['A restaurant with no menu','Ein Restaurant ohne Speisekarte'],
    ['A missing house key','Ein verschwundener Haustürschlüssel'],['An overpacked backpack','Ein viel zu voller Rucksack'],
    ['Taking a group photo','Ein Gruppenfoto machen'],['A rainy camping weekend','Ein verregnetes Campingwochenende'],
    ['The worst playlist transition','Der schlimmste Playlist-Übergang'],['An unreadable recipe','Ein unleserliches Rezept'],
    ['A broken umbrella','Ein kaputter Regenschirm'],['Giving a toast without notes','Einen Trinkspruch ohne Notizen halten'],
    ['A lost hotel reservation','Eine verschwundene Hotelbuchung'],['A surprise school reunion','Ein unerwartetes Klassentreffen'],
    ['A bowling championship','Eine Bowlingmeisterschaft'],['A badly planned road trip','Ein schlecht geplanter Roadtrip'],
    ['A very slow elevator','Ein unfassbar langsamer Aufzug'],['A confusing parking ticket','Ein rätselhaftes Parkticket'],
    ['A phone battery at one percent','Ein Handy mit einem Prozent Akku'],['A forgotten anniversary','Ein vergessener Jahrestag'],
    ['The wrong train platform','Das falsche Bahngleis'],['An accidental reply-all email','Eine versehentliche Antwort an alle'],
    ['A crowded photo booth','Eine volle Fotokabine'],['An awkward elevator ride','Eine peinliche Aufzugfahrt'],
    ['Hosting a barbecue in the rain','Grillen im Regen'],['A disastrous magic trick','Ein missglückter Zaubertrick'],
    ['A chaotic family dinner','Ein chaotisches Familienessen'],['A nightclub dress code','Die Kleiderordnung im Club'],
    ['A lost shopping list','Ein verlorener Einkaufszettel'],['Trying to whisper in a library','In einer Bibliothek flüstern wollen']
  ].map(([en,de])=>P(en,de));
  const extraTaboo = [
    ['Karaoke','Karaoke','Sing','Microphone','Song','Singen','Mikrofon','Lied'],
    ['Birthday party','Geburtstagsparty','Cake','Presents','Candles','Torte','Geschenke','Kerzen'],
    ['First date','Erstes Date','Romantic','Restaurant','Meet','Romantisch','Restaurant','Treffen'],
    ['Suitcase','Koffer','Travel','Airport','Clothes','Reisen','Flughafen','Kleidung'],
    ['Barbecue','Grillabend','Grill','Food','Fire','Grill','Essen','Feuer'],
    ['Taxi','Taxi','Driver','Car','Ride','Fahrer','Auto','Fahrt'],
    ['Train ticket','Bahnticket','Conductor','Station','Journey','Kontrolleur','Bahnhof','Fahrt'],
    ['Photo booth','Fotokabine','Camera','Picture','Pose','Kamera','Foto','Posieren'],
    ['Wedding','Hochzeit','Bride','Ring','Ceremony','Braut','Ring','Zeremonie'],
    ['Movie night','Filmabend','Screen','Popcorn','Cinema','Bildschirm','Popcorn','Kino'],
    ['Camping','Camping','Tent','Forest','Sleep','Zelt','Wald','Schlafen'],
    ['Coffee machine','Kaffeemaschine','Beans','Drink','Mug','Bohnen','Trinken','Tasse'],
    ['Umbrella','Regenschirm','Rain','Wet','Open','Regen','Nass','Öffnen'],
    ['Group chat','Gruppenchat','Message','Phone','Friends','Nachricht','Handy','Freunde'],
    ['Driving lesson','Fahrstunde','Instructor','Car','Licence','Fahrlehrer','Auto','Führerschein'],
    ['Hotel','Hotel','Reception','Room','Breakfast','Rezeption','Zimmer','Frühstück'],
    ['Board game','Brettspiel','Dice','Rules','Table','Würfel','Regeln','Tisch'],
    ['Concert','Konzert','Music','Stage','Crowd','Musik','Bühne','Menge']
  ].map(([en,de,a,b,c,d,e,f])=>({w:P(en,de),ban:[P(a,d),P(b,e),P(c,f)]}));
  const durations={quick:{imp:1,team:1,cards:8},standard:{imp:4,team:2,cards:12},long:{imp:8,team:3,cards:18}};
  const variants=['mixed','undercover','spy','mimic'];
  const teamVariants=['classic','taboo','chaos'];
  const stageNames={classic:[P('Describe freely','Frei erklären'),P('One-word clues','Ein-Wort-Hinweise'),P('Act silently','Ohne Worte vorspielen')],taboo:[P('Describe without taboo words','Ohne Tabuwörter erklären'),P('One-word clues','Ein-Wort-Hinweise'),P('Act silently','Ohne Worte vorspielen')],chaos:[P('Describe freely','Frei erklären'),P('Act silently','Ohne Worte vorspielen'),P('One-word clues','Ein-Wort-Hinweise')]};
  // Deterministic pure helpers shared with the browser and Node tests.
  function tally(votes,abstain,n,candidates,round){
    if(votes.some(v=>!Number.isInteger(v)||v<0)||!Number.isInteger(abstain)||abstain<0)return {status:'invalid'};
    if(votes.reduce((a,b)=>a+b,0)+abstain!==n)return {status:'incomplete'};
    const maximum=Math.max(...candidates.map(i=>votes[i]||0));
    if(maximum===0)return {status:'escape',suspect:-1};
    const top=candidates.filter(i=>(votes[i]||0)===maximum);
    if(top.length>1 && round===0)return {status:'runoff',candidates:top};
    if(top.length>1)return {status:'escape',suspect:-1};
    return {status:'chosen',suspect:top[0]};
  }
  function applyResult(points,role,variant,accused,spyGuessCorrect){
    const caught=accused===role;const spyWins=variant==='spy'&&caught&&spyGuessCorrect;
    const groupWins=caught&&!spyWins;
    const updated=[...points];
    for(let i=0;i<updated.length;i++)if(i===role){if(!groupWins)updated[i]+=2;}else if(groupWins)updated[i]+=1;
    return {scores:updated,groupWins};
  }
  function rotateRoles(length,count,randomShuffle){
    let out=[];while(out.length<count){out.push(...randomShuffle(Array.from({length},(_,i)=>i)));}
    return out.slice(0,count);
  }
  function teamMembers(count){return [Array.from({length:count},(_,i)=>i).filter(i=>i%2===0),Array.from({length:count},(_,i)=>i).filter(i=>i%2===1)];}
  window.CHAOS25={P,pairs,locations,actions,concepts,extraTaboo,durations,variants,teamVariants,stageNames,tally,applyResult,rotateRoles,teamMembers};
})();

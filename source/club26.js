/* CHAOS CLUB V2.6: curated EN/DE prompts and testable game rules. */
(() => {
  'use strict';
  const P=(en,de)=>({en,de});
  const choices=[
    ['Would you rather be responsible for…','Wofür wärst du lieber verantwortlich?','The group playlist all night','Die Playlist des ganzen Abends','Organising everyone’s ride home','Den Heimweg für alle organisieren'],
    ['Which message is more irritating?','Welche Nachricht nervt mehr?','“We should meet soon” with no date','„Wir müssen uns bald treffen“ ohne Datum','A six-minute voice message','Eine sechsminütige Sprachnachricht'],
    ['Which friend-group job would you rather take?','Welche Aufgabe übernimmst du lieber?','Plan every restaurant','Jedes Restaurant auswählen','Handle every shared expense','Jede gemeinsame Ausgabe abrechnen'],
    ['You must give up one convenience for a month. Which?','Auf welchen Komfort verzichtest du einen Monat?','Food delivery','Lieferdienste','Streaming platforms','Streamingdienste'],
    ['Which social mistake is harder to recover from?','Welche soziale Panne ist schwerer zu retten?','Call someone the wrong name','Jemanden mit falschem Namen ansprechen','Forget why you introduced two friends','Vergessen, warum du zwei Leute vorstellen wolltest'],
    ['Which would make a better spontaneous evening?','Was wäre der bessere spontane Abend?','Karaoke with strangers','Karaoke mit Fremden','A board-game tournament at home','Ein Brettspielturnier zu Hause'],
    ['What would your group rather lose for one night?','Worauf würde eure Runde eher einen Abend verzichten?','Music','Musik','Snacks','Snacks'],
    ['What sounds more stressful?','Was klingt stressiger?','Hosting a surprise party','Eine Überraschungsparty organisieren','Being surprised with a big party','Mit einer großen Party überrascht werden'],
    ['Which awkward moment would you prefer?','Welche peinliche Situation wäre dir lieber?','Laugh at a joke you did not hear','Über einen Witz lachen, den du nicht gehört hast','Realise your mic was on during a call','Im Anruf merken, dass dein Mikro an war'],
    ['Which makes a better group holiday?','Was macht den besseren Gruppenurlaub aus?','A detailed schedule','Ein genauer Zeitplan','Deciding everything spontaneously','Alles spontan entscheiden'],
    ['Which is worse at a gathering?','Was ist bei einem Treffen schlimmer?','Someone changes the music every minute','Jemand wechselt jede Minute die Musik','Nobody can decide where to eat','Niemand kann sich auf ein Restaurant einigen'],
    ['Which skill would help tonight?','Welche Fähigkeit wäre heute hilfreicher?','Remembering every name','Sich jeden Namen merken','Knowing every song lyric','Jeden Liedtext kennen']
  ].map(([a,b,c,d,e,f])=>[P(a,b),P(c,d),P(e,f)]);
  const same=[
    P('Name something guests always search for in a new apartment.','Nennt etwas, das Gäste in einer neuen Wohnung immer suchen.'),
    P('Name a harmless reason people leave a party early.','Nennt einen harmlosen Grund, eine Party früher zu verlassen.'),
    P('Name a snack that disappears before dinner starts.','Nennt einen Snack, der schon vor dem Essen weg ist.'),
    P('Name a sentence that usually means a plan is falling apart.','Nennt einen Satz, an dem man merkt, dass ein Plan scheitert.'),
    P('Name a place where you would never want to lose your phone.','Nennt einen Ort, an dem ihr euer Handy auf keinen Fall verlieren wollt.'),
    P('Name something people bring to a party but never use.','Nennt etwas, das man auf eine Party mitbringt, aber nie benutzt.'),
    P('Name the first task nobody wants on a group holiday.','Nennt die erste Aufgabe, die im Gruppenurlaub niemand übernehmen will.'),
    P('Name a song everyone knows only the chorus of.','Nennt ein Lied, von dem alle nur den Refrain kennen.'),
    P('Name something that becomes more difficult with five opinions.','Nennt etwas, das mit fünf Meinungen plötzlich schwierig wird.'),
    P('Name a tiny annoyance that can ruin a train journey.','Nennt eine Kleinigkeit, die eine Bahnfahrt ruinieren kann.'),
    P('Name a boring thing people suddenly discuss passionately.','Nennt ein langweiliges Thema, über das Menschen plötzlich leidenschaftlich reden.'),
    P('Name a food someone always brings too much of.','Nennt ein Essen, von dem jemand immer zu viel mitbringt.')
  ];
  const know=[
    ['Which invitation would I accept first?','Welche Einladung würde ich eher annehmen?','A last-minute concert','Ein spontanes Konzert','A quiet dinner with friends','Ein ruhiges Essen mit Freunden'],
    ['What is more like me on a trip?','Was passt im Urlaub eher zu mir?','Plan everything','Alles planen','Make it up as I go','Spontan entscheiden'],
    ['When I arrive at a party, I usually…','Wenn ich auf eine Party komme, …','Find the food first','suche ich zuerst das Essen','Look for someone I know','suche ich zuerst ein bekanntes Gesicht'],
    ['What would I rather get as a gift?','Was bekomme ich lieber geschenkt?','Tickets to an experience','Tickets für ein Erlebnis','Something useful every day','Etwas Nützliches für jeden Tag'],
    ['Which job would I hate more?','Welchen Job würde ich weniger mögen?','Making endless phone calls','Den ganzen Tag telefonieren','Doing monotonous paperwork','Ständig monotone Formulare ausfüllen'],
    ['Would I rather spend a free Saturday…','Wie verbringe ich lieber einen freien Samstag?','Out exploring','Draußen unterwegs','At home with a project','Zuhause mit einem Projekt'],
    ['Which minor inconvenience would annoy me more?','Was würde mich eher nerven?','Someone always being late','Jemand kommt ständig zu spät','Someone cancelling last minute','Jemand sagt in letzter Minute ab'],
    ['Which would I prefer to host?','Was würde ich lieber veranstalten?','A dinner with six friends','Ein Essen mit sechs Freunden','A party with twenty people','Eine Party mit zwanzig Leuten'],
    ['Would I be more likely to…','Was würde ich eher tun?','Sing first at karaoke','Beim Karaoke als Erstes singen','Be the last to sing','Beim Karaoke als Letztes singen'],
    ['What would I rather be good at?','Worin wäre ich lieber richtig gut?','Dancing','Tanzen','Public speaking','Vor Leuten reden'],
    ['If plans fall apart, do I usually…','Wenn Pläne platzen, …','Find a plan B immediately','suche ich sofort Plan B','Enjoy the unexpected free time','freue ich mich über freie Zeit'],
    ['Where would I go on a surprise weekend?','Wohin würde ich spontan übers Wochenende fahren?','A busy city','In eine lebendige Stadt','Somewhere quiet in nature','An einen ruhigen Ort in der Natur'],
    ['Which group task suits me better?','Welche Gruppenaufgabe liegt mir eher?','Keeping track of money','Auf das Geld achten','Keeping everyone entertained','Für Unterhaltung sorgen'],
    ['Which matters more for a good evening?','Was ist mir für einen guten Abend wichtiger?','Great music','Gute Musik','Great conversation','Gute Gespräche'],
    ['What would I choose for a shared meal?','Was würde ich für unser gemeinsames Essen wählen?','A familiar favourite','Etwas Bewährtes','Something new to try','Etwas Neues ausprobieren'],
    ['On a long journey, do I prefer…','Auf einer langen Fahrt mag ich lieber …','Talking with people','mich unterhalten','Listening to music in peace','in Ruhe Musik hören']
  ].map(([a,b,c,d,e,f])=>[P(a,b),P(c,d),P(e,f)]);
  const comedy={
    punchline:[
      P('Your group chat gets a warning label. What does it say?','Euer Gruppenchat bekommt einen Warnhinweis. Was steht darauf?'),
      P('Invent the most unconvincing reason to be late for dinner.','Erfindet die unglaubwürdigste Ausrede, warum ihr zu spät zum Essen kommt.'),
      P('Give this party the worst possible five-star review.','Gebt dieser Party die schlechteste denkbare Fünf-Sterne-Bewertung.'),
      P('What should the official rulebook of your friendship group forbid?','Was müsste das offizielle Regelbuch eurer Freundesgruppe verbieten?'),
      P('Invent a terrible slogan for a dating profile.','Erfindet einen schrecklichen Slogan für ein Datingprofil.'),
      P('What would be written in the terms and conditions of this evening?','Was stünde in den AGB für diesen Abend?'),
      P('Make up a one-line complaint about a completely normal restaurant.','Erfindet eine Ein-Satz-Beschwerde über ein völlig normales Restaurant.'),
      P('Invent a message that guarantees everyone leaves a group chat.','Erfindet eine Nachricht, nach der garantiert alle einen Gruppenchat verlassen.'),
      P('What is the worst name for an app that plans parties?','Wie sollte man eine App zur Partyplanung auf keinen Fall nennen?'),
      P('Your friend opens a café. What is the sign that it will fail?','Ein Freund eröffnet ein Café. Welches Schild verrät, dass es scheitern wird?'),
      P('Invent the world’s least reassuring flight announcement.','Erfindet die weltweit beunruhigendste Durchsage im Flugzeug.'),
      P('What is the worst possible first line of a wedding speech?','Was wäre der schlimmste erste Satz einer Hochzeitsrede?')
    ],
    pitch:[
      P('Sell a subscription that decides where your group eats.','Verkauf ein Abo, das für eure Gruppe das Restaurant auswählt.'),
      P('Pitch an alarm clock for people who always hit snooze.','Verkauf einen Wecker für Menschen, die ständig auf Schlummern drücken.'),
      P('Sell a device that translates awkward silence.','Verkauf ein Gerät, das peinliches Schweigen übersetzt.'),
      P('Pitch an app that settles arguments about song choices.','Verkauf eine App, die Streit um die Musikauswahl beendet.'),
      P('Sell a suitcase that chooses your holiday destination.','Verkauf einen Koffer, der dein Reiseziel aussucht.'),
      P('Pitch a restaurant that has exactly one menu item.','Verkauf ein Restaurant mit genau einem Gericht.'),
      P('Sell a calendar that refuses unrealistic plans.','Verkauf einen Kalender, der unrealistische Pläne ablehnt.'),
      P('Pitch an umbrella that only works for two people.','Verkauf einen Regenschirm, der nur zu zweit funktioniert.'),
      P('Sell a doorbell that decides whether visitors are welcome.','Verkauf eine Türklingel, die Gäste selbst auswählt.'),
      P('Pitch a travel guide for people who hate sightseeing.','Verkauf einen Reiseführer für Menschen, die Sehenswürdigkeiten hassen.'),
      P('Sell an app that tells your friends you are five minutes away.','Verkauf eine App, die deinen Freunden immer „Bin in fünf Minuten da“ schreibt.'),
      P('Pitch a party playlist selected by the quietest guest.','Verkauf eine Party-Playlist, die der stillste Gast auswählt.')
    ],
    expert:[
      P('Explain why choosing a restaurant takes longer than eating there.','Erkläre, warum die Restaurantwahl länger dauert als das Essen.'),
      P('Present your theory of why everyone loses their keys at once.','Stelle deine Theorie vor, warum alle gleichzeitig ihre Schlüssel verlieren.'),
      P('Explain the hidden rules of choosing seats on a train.','Erkläre die geheimen Regeln der Sitzplatzwahl im Zug.'),
      P('Give a lecture on the science of group-chat silence.','Halte einen Vortrag über die Wissenschaft der Gruppenchat-Stille.'),
      P('Explain how to appear busy while doing absolutely nothing.','Erkläre, wie man beschäftigt wirkt, ohne etwas zu tun.'),
      P('Describe a formal training program for wedding guests.','Stelle ein offizielles Trainingsprogramm für Hochzeitsgäste vor.'),
      P('Explain why every group needs a friend who reads the menu first.','Erkläre, warum jede Gruppe jemanden braucht, der die Speisekarte vorher liest.'),
      P('Present a serious theory of why plans change after midnight.','Präsentiere eine ernsthafte Theorie über Planänderungen nach Mitternacht.'),
      P('Explain the economics of sharing the last piece of pizza.','Erkläre die Wirtschaftslehre rund um das letzte Stück Pizza.'),
      P('Give an expert briefing on awkward elevator conversations.','Halte ein Expertengespräch über peinliche Unterhaltungen im Aufzug.'),
      P('Explain the etiquette of splitting a restaurant bill.','Erkläre die Etikette beim Teilen einer Restaurantrechnung.'),
      P('Propose a study on why some people take 20 minutes to say goodbye.','Stelle eine Studie darüber vor, warum manche Leute 20 Minuten für den Abschied brauchen.')
    ],
    toast:[
      P('Give a toast to the friend who can never choose a restaurant.','Halte einen Trinkspruch auf die Person, die nie ein Restaurant auswählen kann.'),
      P('Toast the person who always takes the group photos.','Halte eine Ansprache auf die Person, die immer Gruppenfotos macht.'),
      P('Toast the greatest failed plan your group ever made.','Würdige den großartigsten gescheiterten Plan eurer Gruppe.'),
      P('Toast the last person to arrive, in a completely friendly way.','Halte eine freundliche Ansprache auf die Person, die zuletzt gekommen ist.'),
      P('Toast the friend who always remembers to bring snacks.','Würdige die Person, die immer Snacks mitbringt.'),
      P('Give a moving toast to an empty chair.','Halte eine bewegende Ansprache auf einen leeren Stuhl.'),
      P('Toast your group’s most unnecessary shared tradition.','Würdige eure unnötigste Gruppentradition.'),
      P('Toast the person who could turn a short story into an epic.','Würdige jemanden, der aus einer kurzen Geschichte ein Epos macht.'),
      P('Toast your future selves ten years from tonight.','Stoßt mit einer Ansprache auf euch in zehn Jahren an.'),
      P('Toast the smallest victory someone had this week.','Würdige den kleinsten Erfolg dieser Woche.'),
      P('Toast the one time your group made a plan and stuck to it.','Würdige das eine Mal, als eure Gruppe einen Plan eingehalten hat.'),
      P('Toast a snack as if it just won a lifetime achievement award.','Halte eine Dankesrede für einen Snack, als hätte er einen Lebenswerkpreis gewonnen.')
    ]
  };
  comedy.pitch.push(
    P('Pitch a service that tells people how to leave a party politely.','Verkauf einen Dienst, der Menschen zeigt, wie sie sich höflich von einer Party verabschieden.'),
    P('Sell a chair designed for awkward family dinners.','Verkauf einen Stuhl speziell für peinliche Familienessen.'),
    P('Pitch a travel app for friends who never agree on a destination.','Verkauf eine Reise-App für Freunde, die sich nie auf ein Ziel einigen.'),
    P('Sell a phone setting that prevents embarrassing messages.','Verkauf eine Handyeinstellung, die peinliche Nachrichten verhindert.'),
    P('Pitch a gym membership for people who only want the smoothie bar.','Verkauf eine Fitnessstudio-Mitgliedschaft nur für die Smoothie-Bar.'),
    P('Sell an invitation that gently discourages annoying guests.','Verkauf eine Einladung, die nervige Gäste freundlich fernhält.'),
    P('Pitch a hotel room that helps you pack before checkout.','Verkauf ein Hotelzimmer, das dir vor dem Auschecken beim Packen hilft.'),
    P('Sell a polite excuse generator for refusing extra meetings.','Verkauf einen höflichen Ausredengenerator für zusätzliche Meetings.'),
    P('Pitch a kitchen gadget that makes sharing the last slice fair.','Verkauf ein Küchengerät, das das letzte Stück gerecht verteilt.'),
    P('Sell an app that detects when a story has gone on too long.','Verkauf eine App, die merkt, wenn eine Geschichte zu lange dauert.'),
    P('Pitch a jacket that tells you when you have forgotten something.','Verkauf eine Jacke, die merkt, wenn du etwas vergessen hast.'),
    P('Sell a calendar that knows when friends are only saying maybe.','Verkauf einen Kalender, der ein halbherziges „Vielleicht“ erkennt.')
  );
  comedy.expert.push(
    P('Give a scholarly explanation of why people keep the last slice of pizza.','Erkläre wissenschaftlich, warum Leute das letzte Stück Pizza liegen lassen.'),
    P('Explain the unwritten rules for picking a seat at a party.','Erkläre die ungeschriebenen Regeln für die Sitzplatzwahl auf Partys.'),
    P('Describe how someone can take ten minutes to say goodbye.','Erkläre, wie man zehn Minuten für eine Verabschiedung braucht.'),
    P('Present the social psychology of the group photo.','Erkläre die Sozialpsychologie eines Gruppenfotos.'),
    P('Present a theory for why bad weather starts precisely at a barbecue.','Präsentiere eine Theorie, warum es genau zum Grillabend regnet.'),
    P('Explain how people negotiate which song plays next.','Erkläre, wie Menschen über das nächste Lied verhandeln.'),
    P('Describe the invisible hierarchy of shared apartment fridge shelves.','Beschreibe die unsichtbare Hierarchie im Gemeinschaftskühlschrank.'),
    P('Explain why people pretend to know where they are walking.','Erkläre, warum Menschen so tun, als wüssten sie, wo sie hingehen.'),
    P('Present the economics of group taxi fares.','Erkläre die Ökonomie gemeinsamer Taxifahrten.'),
    P('Give an expert overview of why nobody wants to choose the film.','Halte einen Expertenvortrag darüber, warum niemand den Film wählen will.')
  );
  const truthLieTopics=[
    P('Tell three things about your school days. Exactly one must be invented.','Erzähl drei Dinge aus deiner Schulzeit. Genau eines ist erfunden.'),
    P('Tell three things about foods you have tried. One is false.','Erzähl drei Dinge über Essen, das du probiert hast. Eines stimmt nicht.'),
    P('Tell three things about places you have visited. One is made up.','Erzähl drei Dinge über Orte, an denen du warst. Eines ist erfunden.'),
    P('Tell three things about jobs or chores you have done. One is fake.','Erzähl drei Dinge über Jobs oder Aufgaben, die du erledigt hast. Eines ist gelogen.'),
    P('Tell three things about concerts or events. Exactly one is fiction.','Erzähl drei Dinge über Konzerte oder Veranstaltungen. Genau eines ist erfunden.'),
    P('Tell three things about your first impressions of people. One is false.','Erzähl drei Dinge über erste Eindrücke von Menschen. Eines ist gelogen.'),
    P('Tell three things about getting lost or delayed. One did not happen.','Erzähl drei Dinge über Verlaufen oder Verspätungen. Eines ist nie passiert.'),
    P('Tell three things about things you have broken accidentally. One is invented.','Erzähl drei Dinge, die du versehentlich kaputt gemacht hast. Eines ist erfunden.'),
    P('Tell three things about unusual gifts you have received. One is fictional.','Erzähl drei Dinge über ungewöhnliche Geschenke. Eines ist erfunden.'),
    P('Tell three things about childhood hobbies. One is not true.','Erzähl drei Dinge über Hobbys aus deiner Kindheit. Eines stimmt nicht.'),
    P('Tell three things about your travel habits. One is invented.','Erzähl drei Dinge über deine Reisegewohnheiten. Eines ist erfunden.'),
    P('Tell three things about your cooking skills. One is fake.','Erzähl drei Dinge über deine Kochkünste. Eines ist gelogen.'),
    P('Tell three things about small fears you have had. One is invented.','Erzähl drei Dinge über kleine Ängste, die du mal hattest. Eine ist erfunden.'),
    P('Tell three things about surprise encounters. One never happened.','Erzähl drei Dinge über zufällige Begegnungen. Eine hat nie stattgefunden.'),
    P('Tell three things about party experiences. One is fiction.','Erzähl drei Dinge über Partyerlebnisse. Eines ist erfunden.'),
    P('Tell three things about your guilty pleasures. One is made up.','Erzähl drei Dinge über deine heimlichen Vorlieben. Eine ist ausgedacht.'),
    P('Tell three things about moments you felt brave. One is false.','Erzähl drei Dinge über Momente, in denen du mutig warst. Eines ist gelogen.'),
    P('Tell three things about things you have learned from friends. One is invented.','Erzähl drei Dinge, die du von Freunden gelernt hast. Eines ist erfunden.'),
    P('Tell three things about the worst timing you ever experienced. One is fake.','Erzähl drei Dinge über besonders schlechtes Timing. Eines ist ausgedacht.'),
    P('Tell three things about times someone mistook you for another person. One is made up.','Erzähl drei Dinge, bei denen dich jemand verwechselt hat. Eines ist erfunden.')
  ];
  const stories=[
    P('Tell a short story about a plan that failed at the last minute. It can be true or invented.','Erzähl kurz von einem Plan, der in letzter Minute scheiterte. Wahr oder erfunden.'),
    P('Describe the strangest harmless misunderstanding you have had with a stranger.','Erzähl von deinem seltsamsten harmlosen Missverständnis mit Fremden.'),
    P('Tell a story about an invitation you nearly declined.','Erzähl von einer Einladung, die du fast abgesagt hättest.'),
    P('Tell a story about getting completely lost somewhere familiar.','Erzähl davon, wie du dich an einem vertrauten Ort völlig verlaufen hast.'),
    P('Describe a dinner that did not go according to plan.','Erzähl von einem Essen, bei dem alles anders lief als geplant.'),
    P('Tell a story about a surprising conversation on public transport.','Erzähl von einer überraschenden Unterhaltung in Bus oder Bahn.'),
    P('Tell a story about an unexpected guest at a gathering.','Erzähl von einem unerwarteten Gast bei einem Treffen.'),
    P('Describe a time you were convinced you had the right address.','Erzähl von einem Moment, in dem du dir bei einer Adresse völlig sicher warst.'),
    P('Tell a story about a small act of kindness with unexpected consequences.','Erzähl von einer kleinen netten Geste mit überraschenden Folgen.'),
    P('Describe an awkward situation that became funny later.','Erzähl von einer peinlichen Situation, über die du später lachen konntest.'),
    P('Tell a story about a surprise you struggled to keep secret.','Erzähl von einer Überraschung, die du kaum geheim halten konntest.'),
    P('Tell a story about a mistake that actually improved your day.','Erzähl von einem Fehler, der deinen Tag am Ende besser gemacht hat.'),
    P('Describe a moment when you confidently misunderstood instructions.','Erzähl von einem Moment, in dem du eine Anleitung selbstsicher falsch verstanden hast.'),
    P('Tell a story about the most chaotic group decision you witnessed.','Erzähl von der chaotischsten Gruppenentscheidung, die du erlebt hast.'),
    P('Describe the oddest reason a meeting or event was delayed.','Erzähl vom seltsamsten Grund, warum ein Treffen verschoben wurde.'),
    P('Tell a story about a gift that caused unexpected confusion.','Erzähl von einem Geschenk, das unerwartete Verwirrung ausgelöst hat.')
  ];
  const factPairs=[
    ['What is the only country with a non-rectangular national flag?','Welches Land hat als einziges keine rechteckige Nationalflagge?','Nepal','Nepal'],
    ['Which planet rotates almost on its side?','Welcher Planet rotiert fast auf der Seite?','Uranus','Uranus'],
    ['Which animal has three hearts?','Welches Tier hat drei Herzen?','Octopus','Oktopus'],
    ['What is the largest organ of the human body?','Was ist das größte Organ des menschlichen Körpers?','Skin','Haut'],
    ['Which country has the city of Porto?','In welchem Land liegt Porto?','Portugal','Portugal'],
    ['What word means a word spelled the same backwards?','Wie nennt man ein Wort, das rückwärts dasselbe ergibt?','Palindrome','Palindrom'],
    ['Which element has the chemical symbol Au?','Welches Element hat das Symbol Au?','Gold','Gold'],
    ['Which planet has the most prominent ring system visible with a small telescope?','Welcher Planet ist für sein auffälliges Ringsystem bekannt?','Saturn','Saturn'],
    ['What is the capital of New Zealand?','Was ist die Hauptstadt von Neuseeland?','Wellington','Wellington'],
    ['What is the largest species of penguin?','Welche Pinguinart wird am größten?','Emperor penguin','Kaiserpinguin'],
    ['What colour does blue and yellow paint typically produce?','Welche Farbe ergibt meist das Mischen von blauer und gelber Farbe?','Green','Grün'],
    ['What is the main ingredient in traditional hummus?','Was ist die Hauptzutat von traditionellem Hummus?','Chickpeas','Kichererbsen']
  ].map(([a,b,c,d])=>({q:P(a,b),a:P(c,d)}));
  const durations={quick:{social:4,comedy:3,bluff:3},standard:{social:10,comedy:8,bluff:7},long:{social:20,comedy:16,bluff:12}};
  const variants={social:['mixed','majority','same','know'],comedy:['mixed','punchline','pitch','expert','toast'],bluff:['mixed','confession','twotruths','fact']};
  function scoreSocial(kind,n,secret,count){
    if(!Number.isInteger(n)||n<4||!Number.isInteger(count))throw Error('invalid tally');
    if(kind==='same') {if(count<1||count>n)throw Error('invalid match count');return count>=3?2:count===2?1:0;}
    if(count<0||count>n-1||!([0,1].includes(secret)))throw Error('invalid vote count');
    if(kind==='majority'){const a=count,b=n-1-count;if(a===b)return 1;return (secret===0?a>b:b>a)?2:0;}
    if(kind==='know'){const correct=secret===0?count:n-1-count;return correct>(n-1)/2?2:correct>0?1:0;}
    throw Error('invalid kind');
  }
  function voteDuel(n,a,b){if(!Number.isInteger(n)||n<4||!Number.isInteger(a)||!Number.isInteger(b)||a<0||b<0||a+b!==n-2)throw Error('incomplete audience vote');return a===b?[1,1]:a>b?[2,0]:[0,2];}
  function scoreBluff(kind,n,actual,count){if(!Number.isInteger(n)||n<4||!Number.isInteger(count)||count<0||count>n-1)throw Error('invalid jury tally'); const correct=kind==='fact'?count:(kind==='confession'? (actual==='true'?count:n-1-count) : count); const win=correct>(n-1)/2;return {group:win?2:0,bluff:win?0:2,correct};}
  function pairs(n,rounds){
    if(!Number.isInteger(n)||n<4||n>6||!Number.isInteger(rounds)||rounds<1)throw Error('bad pair schedule');
    let ring=Array.from({length:n},(_,i)=>i);if(n%2)ring.push(-1);
    const out=[];
    while(out.length<rounds){
      for(let round=0;round<ring.length-1&&out.length<rounds;round++){
        for(let i=0;i<ring.length/2&&out.length<rounds;i++){
          const a=ring[i],b=ring[ring.length-1-i];
          if(a!==-1&&b!==-1)out.push([a,b]);
        }
        ring=[ring[0],ring[ring.length-1],...ring.slice(1,-1)];
      }
    }
    return out;
  }
  // Keep inherited low-challenge/duplicate fact cards in source, but do not deal them in Fact Trap.
  const heldFactQuestions=new Set([
    'Which animal is the tallest living land animal?',
    'What is the largest planet in our solar system?',
    'Which ocean is the largest on Earth?',
    'Which bird is famous for being unable to fly and native to Antarctica?',
    'What is the chemical symbol for gold?',
    'Which organ pumps blood around the body?',
    'Which country contains the ancient city of Machu Picchu?',
    'Which planet rotates almost on its side?',
    'What is the largest organ of the human body?',
    'Which country has the city of Porto?',
    'Which element has the chemical symbol Au?',
    'Which planet has the most prominent ring system visible with a small telescope?',
    'What colour does blue and yellow paint typically produce?',
    'What is the main ingredient in traditional hummus?'
  ]);
  function build(kind,variant,E,D,shuffle,recent=[]){
    const extra=window.CHAOS27?.content||{};
    const pools={
      social:{majority:[...(E.majority||[]),...(D.majority||[]),...choices,...(extra.majority||[])].filter(x=>Array.isArray(x)&&x.length>=3).map(x=>({type:'majority',q:x[0],options:[x[1],x[2]]})),
        same:[...(E.same||[]),...(D.same||[]),...same,...(extra.same||[])].map(q=>({type:'same',q})),
        know:[...(E.know||[]),...(D.know||[]),...know,...(extra.know||[])].filter(x=>Array.isArray(x)&&x.length>=3).map(x=>({type:'know',q:x[0],options:[x[1],x[2]]}))},
      comedy:{punchline:[...(E.bad||[]),...(D.bad||[]),...comedy.punchline,...(extra.punchline||[])].map(q=>({type:'punchline',q})),
        pitch:[...comedy.pitch,...(extra.pitch||[])].map(q=>({type:'pitch',q})),
        expert:[...comedy.expert,...(extra.expert||[])].map(q=>({type:'expert',q})),
        toast:[...comedy.toast,...(E.toast||[]),...(D.toast||[]),...(extra.toast||[])].map(q=>({type:'toast',q}))},
      bluff:{confession:[...stories,...(extra.confession||[])].map(q=>({type:'confession',q})),twotruths:[...truthLieTopics,...(extra.twotruths||[])].map(q=>({type:'twotruths',q})),fact:[...(E.bluffFacts||[]),...(D.bluffFacts||[]),...factPairs].filter(x=>x&&x.q&&x.a&&!heldFactQuestions.has(x.q.en)).map(x=>({type:'fact',q:x.q,answer:x.a}))}
    };let base=pools[kind]; if(!base)throw Error('invalid family');let seen=new Set(); for(let k of Object.keys(base)){base[k]=shuffle(base[k]).filter(item=>{const key=item.q.en.toLowerCase().trim();if(seen.has(k+'|'+key))return false;seen.add(k+'|'+key);return true;}).map(item=>({...item,_key:`${kind}:${item.type}:${item.q.en.toLowerCase().replace(/\s+/g,' ').trim()}`}));const history=new Set(recent);base[k]=[...base[k].filter(item=>!history.has(item._key)),...base[k].filter(item=>history.has(item._key))];}
    if(variant!=='mixed')return [...base[variant]];
    const types=Object.keys(base), result=[];while(types.some(t=>base[t].length)){for(const t of shuffle(types)){if(base[t].length)result.push(base[t].shift());}}
    return result;
  }
  window.CHAOS26={P,durations,variants,choices,same,know,comedy,stories,factPairs,scoreSocial,voteDuel,scoreBluff,pairs,build};
})();

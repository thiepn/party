/* V2.7: original bilingual party prompts, explicit tally rules, and optional round variations. */
(() => {
  'use strict';
  const P=(en,de)=>({en,de});
  const content={
    majority:[
      ['Which is worse when everyone is hungry?','Was ist schlimmer, wenn alle Hunger haben?','Someone says “anything is fine”','Jemand sagt „Mir ist alles recht“','Someone vetoes every suggestion','Jemand lehnt jeden Vorschlag ab'],
      ['For a spontaneous trip, which matters more?','Was ist bei einem spontanen Ausflug wichtiger?','A great destination','Ein tolles Reiseziel','The right people','Die richtigen Leute'],
      ['Which is more awkward at a party?','Was ist auf einer Party unangenehmer?','Forgetting a name twice','Einen Namen zweimal vergessen','Accidentally interrupting a story','Eine Geschichte versehentlich unterbrechen'],
      ['Which friend-group problem deserves a meeting?','Welches Problem in der Freundesgruppe braucht eine Besprechung?','Always being late','Ständig zu spät kommen','Never making decisions','Nie Entscheidungen treffen'],
      ['What ruins a film night faster?','Was verdirbt einen Filmabend schneller?','Someone narrating every scene','Jemand kommentiert jede Szene','Someone looking at their phone constantly','Jemand schaut ständig aufs Handy'],
      ['If you can only keep one, which stays?','Wenn nur eines bleiben darf: Was wählt ihr?','A group holiday once a year','Ein gemeinsamer Urlaub im Jahr','A regular dinner every month','Ein gemeinsames Essen jeden Monat'],
      ['Which compliment means more?','Welches Kompliment bedeutet mehr?','“You always make me laugh”','„Du bringst mich immer zum Lachen“','“I can depend on you”','„Auf dich ist Verlass“'],
      ['Which makes a better story later?','Worüber lacht man später eher?','A ruined surprise','Eine vermasselte Überraschung','A wildly wrong first impression','Ein völlig falscher erster Eindruck'],
      ['Who has the harder job on a group trip?','Wer hat auf einer Gruppenreise den schwierigeren Job?','The person planning everything','Die Person, die alles plant','The person keeping the peace','Die Person, die Streit verhindert'],
      ['What is the more painful restaurant moment?','Was ist im Restaurant unangenehmer?','Everyone orders the same thing','Alle bestellen das Gleiche','Someone suggests splitting an uneven bill equally','Jemand will eine ungleiche Rechnung gleich teilen'],
      ['Which would your group choose?','Wofür würde sich eure Runde entscheiden?','A surprise guest','Ein Überraschungsgast','A surprise activity','Eine Überraschungsaktion'],
      ['What is harder to admit?','Was gibt man schwerer zu?','You were wrong about a film','Du lagst bei einem Film falsch','You gave terrible directions','Du hast völlig falsch navigiert'],
      ['Which social habit is worse?','Welche Angewohnheit ist schlimmer?','Leaving messages unanswered for days','Tagelang nicht antworten','Sending ten messages instead of one','Zehn Nachrichten statt einer schicken'],
      ['Which is more fun with friends?','Was macht mit Freunden mehr Spaß?','Planning an elaborate surprise','Eine große Überraschung planen','Improvising the whole evening','Den ganzen Abend improvisieren'],
      ['Which would get a bigger reaction?','Was sorgt für mehr Aufregung?','Someone announcing a secret hobby','Jemand erzählt von einem geheimen Hobby','Someone revealing a strange talent','Jemand zeigt ein ungewöhnliches Talent'],
      ['Which is easier to forgive?','Was verzeiht man leichter?','A forgotten birthday','Ein vergessener Geburtstag','A cancelled plan at short notice','Eine kurzfristige Absage'],
      ['Which invitation sounds better?','Welche Einladung klingt besser?','“Come over, we will figure it out”','„Kommt vorbei, wir überlegen dann“','“I planned the whole evening”','„Ich habe den Abend komplett geplant“'],
      ['What is the better party soundtrack?','Was ist die bessere Party-Musik?','Songs everyone can sing','Lieder, die alle mitsingen können','Surprising songs nobody expected','Unerwartete Lieder, mit denen niemand rechnet']
    ].map(([a,b,c,d,e,f])=>[P(a,b),P(c,d),P(e,f)]),
    same:[
      P('Name something that disappears at every party.','Nenne etwas, das auf jeder Party verschwindet.'),
      P('Name a sentence someone says when they are about to leave but do not.','Nenne einen Satz, den jemand beim Abschied sagt, ohne dann zu gehen.'),
      P('Name the one thing everyone forgets to pack.','Nenne etwas, das beim Packen alle vergessen.'),
      P('Name something you always argue about before ordering food.','Nenne etwas, worüber man vor dem Essenbestellen immer diskutiert.'),
      P('Name something that always takes longer than expected.','Nenne etwas, das immer länger dauert als gedacht.'),
      P('Name a harmless thing that makes people competitive.','Nenne etwas Harmloses, bei dem Menschen ehrgeizig werden.'),
      P('Name something people claim they can cook well.','Nenne etwas, das angeblich jeder gut kochen kann.'),
      P('Name a place where you always run into somebody you know.','Nenne einen Ort, an dem man ständig Bekannte trifft.'),
      P('Name a reason why a group photo takes five attempts.','Nenne einen Grund, warum ein Gruppenfoto fünf Versuche braucht.'),
      P('Name an item people always borrow and forget to return.','Nenne etwas, das man ausleiht und vergisst zurückzugeben.'),
      P('Name a phrase used to avoid choosing a restaurant.','Nenne einen Satz, mit dem man die Restaurantwahl vermeidet.'),
      P('Name a classic excuse for being five minutes late.','Nenne eine typische Ausrede für fünf Minuten Verspätung.'),
      P('Name a board game that starts arguments.','Nenne ein Brettspiel, bei dem man sich streitet.'),
      P('Name something that becomes funnier the next day.','Nenne etwas, das am nächsten Tag noch lustiger ist.')
    ],
    know:[
      ['Which would I choose for a surprise evening?','Was würde ich bei einem Überraschungsabend wählen?','A cosy gathering','Eine gemütliche Runde','A crowded event','Ein großes Event'],
      ['When the group cannot decide, do I usually…','Wenn die Runde sich nicht entscheiden kann, …','Suggest a compromise','schlage ich einen Kompromiss vor','Pick something for everyone','entscheide ich für alle'],
      ['Which would embarrass me more?','Was wäre mir peinlicher?','Having to sing solo','Alleine singen zu müssen','Being the centre of a surprise toast','Bei einer Überraschungsrede im Mittelpunkt zu stehen'],
      ['What would I do with one free afternoon?','Was würde ich mit einem freien Nachmittag machen?','Visit friends','Freunde besuchen','Stay home without plans','Ohne Pläne zu Hause bleiben'],
      ['At karaoke, would I…','Beim Karaoke würde ich …','Pick a song everyone knows','ein bekanntes Lied wählen','Choose something unexpected','mit einem unerwarteten Lied überraschen'],
      ['Which group task would I rather take?','Welche Aufgabe übernehme ich lieber?','Organise the budget','Das Budget planen','Plan the activities','Die Aktivitäten planen'],
      ['If I received a surprise gift, would I prefer…','Was wäre mir als Überraschungsgeschenk lieber?','An experience together','Ein gemeinsames Erlebnis','Something useful','Etwas Praktisches'],
      ['Which compliment would make me happier?','Über welches Kompliment würde ich mich mehr freuen?','“You are hilarious”','„Du bist witzig“','“You really listen”','„Du hörst richtig zu“'],
      ['When travelling, would I rather…','Auf Reisen würde ich lieber …','Explore without a map','Ohne Karte losziehen','Follow a well-made plan','Einem guten Plan folgen'],
      ['For our next gathering, would I pick…','Für unser nächstes Treffen würde ich wählen …','Cooking together','Zusammen kochen','Ordering food','Essen bestellen'],
      ['Which challenge would I actually try?','Welche Herausforderung würde ich wirklich versuchen?','An improv scene','Eine Impro-Szene','A short comedy speech','Eine kurze Comedy-Rede'],
      ['At a concert, would I rather…','Bei einem Konzert würde ich lieber …','Be near the stage','Nahe an der Bühne stehen','Have room to move','Genug Platz zum Bewegen haben'],
      ['What matters more to me at a party?','Was ist mir auf einer Party wichtiger?','Good conversations','Gute Gespräche','Great music','Gute Musik'],
      ['Would I rather receive…','Was würde ich lieber bekommen?','A handwritten note','Einen handgeschriebenen Brief','A spontaneous invitation','Eine spontane Einladung']
    ].map(([a,b,c,d,e,f])=>[P(a,b),P(c,d),P(e,f)]),
    punchline:[
      P('Your group needs an official warning sign. What does it say?','Eure Runde braucht ein offizielles Warnschild. Was steht darauf?'),
      P('What is the worst thing to write in a wedding guestbook?','Was ist der schlimmste Satz für ein Hochzeitsgästebuch?'),
      P('Give a terrible name to your group’s next holiday.','Gebt eurem nächsten gemeinsamen Urlaub einen furchtbaren Namen.'),
      P('Invent the most suspicious but harmless excuse for leaving early.','Erfindet die verdächtigste harmlose Ausrede fürs frühe Gehen.'),
      P('What would a brutally honest restaurant menu say?','Was stünde auf einer brutal ehrlichen Speisekarte?'),
      P('Write the worst possible tagline for a friendship app.','Erfindet den schlimmsten Werbespruch für eine Freundschafts-App.'),
      P('What would your group be banned from doing at a hotel?','Was würde eure Freundesgruppe im Hotel verboten bekommen?'),
      P('What should a self-checkout machine say when it judges your groceries?','Was soll eine Selbstbedienungskasse über deinen Einkauf sagen?'),
      P('Write a truly unhelpful travel review in one sentence.','Schreibt eine vollkommen nutzlose Reisebewertung in einem Satz.'),
      P('What is the least inspiring team motto?','Was ist das unmotivierendste Teammotto?'),
      P('Name a television show based on your friend group.','Erfindet einen Serientitel über eure Freundesgruppe.'),
      P('Give the worst possible opening line for a motivational speech.','Erfindet den schlechtesten Einstieg in eine Motivationsrede.')
    ],
    pitch:[
      P('Sell a service that politely ends conversations that are going nowhere.','Verkauf einen Dienst, der endlose Gespräche höflich beendet.'),
      P('Pitch a shared calendar that refuses impossible group plans.','Verkauf einen Gruppenkalender, der unmögliche Pläne ablehnt.'),
      P('Sell a restaurant that serves only the dish the group agrees on.','Verkauf ein Restaurant, das nur Gerichte serviert, auf die sich alle einigen.'),
      P('Pitch a suitcase that packs itself but chooses one random item.','Verkauf einen Koffer, der selbst packt, aber einen Gegenstand zufällig auswählt.'),
      P('Sell a friendship contract with a ridiculous cancellation clause.','Verkauf einen Freundschaftsvertrag mit einer absurden Kündigungsklausel.'),
      P('Pitch an app that turns long voice messages into dramatic trailers.','Verkauf eine App, die lange Sprachnachrichten in dramatische Trailer verwandelt.'),
      P('Sell a smart chair that chooses who sits next to whom.','Verkauf einen Stuhl, der bestimmt, wer neben wem sitzt.'),
      P('Pitch a subscription that delivers one excellent excuse every Friday.','Verkauf ein Abo, das jeden Freitag eine perfekte Ausrede liefert.')
    ],
    expert:[
      P('Explain why groups take longer to say goodbye than to say hello.','Erkläre wissenschaftlich, warum Gruppen länger fürs Verabschieden brauchen als fürs Begrüßen.'),
      P('Give a lecture on the exact point at which a short story becomes too long.','Halte einen Vortrag über den Moment, in dem eine kurze Geschichte zu lang wird.'),
      P('Present the psychology of sharing the last piece of dessert.','Erkläre die Psychologie hinter dem letzten Stück Nachtisch.'),
      P('Explain why a group chat goes quiet as soon as a decision is needed.','Erkläre, warum ein Gruppenchat verstummt, sobald eine Entscheidung ansteht.'),
      P('Defend your theory of the perfect seating arrangement at dinner.','Verteidige deine Theorie über die perfekte Sitzordnung beim Essen.'),
      P('Explain the unspoken rules of joining a conversation halfway through.','Erkläre die ungeschriebenen Regeln, wenn man mitten in ein Gespräch einsteigt.'),
      P('Present the economics of ordering food for a group.','Erkläre die Wirtschaftslehre hinter einer Gruppenbestellung.'),
      P('Explain why every friend group has a designated photographer.','Erkläre, warum jede Freundesgruppe eine feste Person für Fotos hat.')
    ],
    toast:[
      P('Give a toast to a plan that was cancelled but somehow made the evening better.','Halte eine Rede auf einen abgesagten Plan, der den Abend besser gemacht hat.'),
      P('Toast the friend who always remembers the small details.','Würdige die Person, die sich immer an die kleinen Details erinnert.'),
      P('Give a toast to a meal that everyone argued about ordering.','Halte eine Rede auf ein Essen, über dessen Bestellung alle gestritten haben.'),
      P('Toast the courage of the first person to start dancing.','Würdige den Mut der Person, die zuerst tanzt.'),
      P('Toast the group’s most legendary wrong turn.','Würdige euren legendärsten Umweg.'),
      P('Give a formal toast to the friend who always brings something useful.','Halte eine feierliche Rede auf die Person, die immer etwas Nützliches dabeihat.'),
      P('Toast an unexpectedly great ordinary weekday evening.','Würdige einen ganz normalen Wochentag, der unerwartet toll wurde.'),
      P('Give a toast to plans that start with “just one hour”.','Halte eine Rede auf Treffen, die mit „nur eine Stunde“ beginnen.')
    ],
    confession:[
      P('Tell a true or invented story about an invitation you misunderstood.','Erzähl eine wahre oder erfundene Geschichte über eine falsch verstandene Einladung.'),
      P('Tell a true or invented story about accidentally joining the wrong group.','Erzähl eine wahre oder erfundene Geschichte darüber, wie du bei der falschen Gruppe gelandet bist.'),
      P('Describe a true or made-up moment when a tiny favour became a huge task.','Erzähl von einem echten oder erfundenen Moment, in dem aus einem kleinen Gefallen eine Riesenaufgabe wurde.'),
      P('Tell a story about meeting someone twice without recognising them. True or invented.','Erzähl eine wahre oder erfundene Geschichte über jemanden, den du beim zweiten Treffen nicht wiedererkannt hast.'),
      P('Describe a real or fictional surprise that went off-script.','Erzähl von einer echten oder erfundenen Überraschung, die völlig anders lief als geplant.'),
      P('Tell a true or invented story about the most ridiculous timing imaginable.','Erzähl eine wahre oder erfundene Geschichte über unglaublich schlechtes Timing.'),
      P('Describe a genuine or made-up time you offered to help and immediately regretted it.','Erzähl von einem echten oder erfundenen Moment, in dem du Hilfe angeboten und es sofort bereut hast.'),
      P('Tell a true or invented story about a small mistake that became a shared joke.','Erzähl eine wahre oder erfundene Geschichte über einen kleinen Fehler, der zum Insiderwitz wurde.'),
      P('Describe a true or imagined situation where you had to improvise a speech.','Erzähl eine wahre oder erfundene Geschichte über eine spontane Rede, die du halten musstest.'),
      P('Tell a true or invented story about a completely unnecessary detour.','Erzähl eine wahre oder erfundene Geschichte über einen völlig unnötigen Umweg.')
    ],
    twotruths:[
      P('Tell three things you have done to impress somebody. Exactly one is made up.','Nenne drei Dinge, mit denen du jemanden beeindrucken wolltest. Eines ist erfunden.'),
      P('Tell three things you once believed as a child. Exactly one is false.','Nenne drei Dinge, die du als Kind geglaubt hast. Eines ist erfunden.'),
      P('Tell three things about a trip that went wrong. Exactly one is fiction.','Nenne drei Dinge über eine Reise, bei der etwas schiefging. Eines ist erfunden.'),
      P('Tell three things you would be nervous to try. One is not true.','Nenne drei Dinge, vor denen du Respekt hättest. Eines stimmt nicht.'),
      P('Tell three things about a restaurant experience. One is invented.','Nenne drei Dinge über Restaurantbesuche. Eines ist erfunden.'),
      P('Tell three things about gifts you have given. One is false.','Nenne drei Dinge über Geschenke, die du gemacht hast. Eines ist erfunden.'),
      P('Tell three things about friends you made in unexpected places. One is fictional.','Nenne drei Dinge über Freundschaften an unerwarteten Orten. Eines ist erfunden.'),
      P('Tell three things about your most impulsive decisions. One never happened.','Nenne drei deiner spontansten Entscheidungen. Eine ist nie passiert.'),
      P('Tell three things about unusual skills you have tried to learn. One is made up.','Nenne drei ungewöhnliche Fähigkeiten, die du lernen wolltest. Eine ist erfunden.'),
      P('Tell three things you would change about your last holiday. One is a lie.','Nenne drei Dinge, die du am letzten Urlaub ändern würdest. Eines ist gelogen.')
    ]
  };

  // New social content for the existing Impostor Night roles; originals remain unchanged.
  const C25=window.CHAOS25;
  if(C25){
    const extraPairs=[
      ['Bookshop','Library','Buchhandlung','Bibliothek'],
      ['Picnic','Garden party','Picknick','Gartenparty'],
      ['Movie premiere','Film festival','Filmpremiere','Filmfestival'],
      ['Road trip','Train journey','Roadtrip','Zugreise'],
      ['Cooking competition','Baking competition','Kochwettbewerb','Backwettbewerb'],
      ['First apartment','Student dorm','Erste Wohnung','Studentenwohnheim'],
      ['Photography course','Painting course','Fotokurs','Malkurs'],
      ['Farewell dinner','Birthday dinner','Abschiedsessen','Geburtstagsessen'],
      ['Camping site','Holiday home','Campingplatz','Ferienhaus'],
      ['Street musician','Wedding singer','Straßenmusiker','Hochzeitssänger'],
      ['Bus tour','Boat tour','Bustour','Bootstour'],
      ['Weekend market','Food festival','Wochenmarkt','Food-Festival']
    ];
    C25.pairs.push(...extraPairs.map(([a,b,c,d])=>[P(a,c),P(b,d)]));
    C25.locations.push(
      P('Back room of a restaurant','Hinterzimmer eines Restaurants'),
      P('Book fair','Buchmesse'),P('Ferry terminal','Fähranleger'),
      P('University lecture hall','Universitätshörsaal'),
      P('Concert ticket queue','Warteschlange vor der Konzertkasse'),
      P('Wedding photo booth','Fotokabine auf einer Hochzeit'),
      P('Mountain hostel','Berghütte'),P('Outdoor cinema','Freiluftkino')
    );
    C25.actions.push(
      [P('Pretend to check a shopping list.','Prüfe einen imaginären Einkaufszettel.'),P('Adjust your sleeve.','Richte deinen Ärmel.'),P('Glance toward the door.','Blicke zur Tür.')],
      [P('Make a tiny drumroll on your knee.','Trommle kurz auf deinem Knie.'),P('Look over your shoulder.','Schau über die Schulter.'),P('Give an approving nod.','Nicke anerkennend.')],
      [P('Pretend to inspect an invisible ticket.','Prüfe eine unsichtbare Eintrittskarte.'),P('Point at your shoes.','Zeige auf deine Schuhe.'),P('Hold up two fingers.','Halte zwei Finger hoch.')],
      [P('Take an imaginary photo.','Mach ein imaginäres Foto.'),P('Pretend to straighten a picture frame.','Richte einen imaginären Bilderrahmen.'),P('Wave politely.','Winke höflich.')],
      [P('Pretend to stir a cup.','Rühre in einer imaginären Tasse.'),P('Raise one eyebrow.','Ziehe eine Augenbraue hoch.'),P('Put your hands behind your back.','Nimm die Hände hinter den Rücken.')],
      [P('Pretend to answer a phone call.','Nimm einen imaginären Anruf an.'),P('Tilt your head to one side.','Neige den Kopf zur Seite.'),P('Give a small thumbs-up.','Zeige kurz den Daumen hoch.')],
      [P('Pretend to tie a shoelace.','Binde einen imaginären Schnürsenkel.'),P('Clasp your hands.','Falte die Hände.'),P('Look left then right.','Schau nach links und rechts.')],
      [P('Pretend to read a restaurant menu.','Lies eine imaginäre Speisekarte.'),P('Scratch your chin.','Kratze dich am Kinn.'),P('Tap your shoulder gently.','Tippe dir leicht auf die Schulter.')],
      [P('Pretend to open a present.','Öffne ein imaginäres Geschenk.'),P('Cover your mouth in surprise.','Halte überrascht die Hand vor den Mund.'),P('Bow your head once.','Senke kurz den Kopf.')],
      [P('Pretend to look through binoculars.','Schau durch ein imaginäres Fernglas.'),P('Tap the table once.','Tippe einmal auf den Tisch.'),P('Draw a circle in the air.','Zeichne einen Kreis in die Luft.')],
      [P('Pretend to test a microphone.','Teste ein imaginäres Mikrofon.'),P('Raise your left hand.','Hebe die linke Hand.'),P('Mime a short applause.','Imitiere einen kurzen Applaus.')],
      [P('Pretend to zip up a jacket.','Ziehe einen imaginären Reißverschluss zu.'),P('Check your pocket.','Prüfe deine Tasche.'),P('Point to an imaginary sign.','Zeige auf ein imaginäres Schild.')]
    );
  }
  const switchups={
    social:{majority:P('Speed vote: everyone chooses A or B within 10 seconds, without discussion.','Schnellwahl: Alle entscheiden sich innerhalb von zehn Sekunden für A oder B, ohne Diskussion.'),same:P('One-word round: every answer must be a single word.','Ein-Wort-Runde: Jede Antwort besteht aus genau einem Wort.'),know:P('No hints: everyone predicts simultaneously before the featured player speaks.','Keine Tipps: Alle raten gleichzeitig, bevor die Person am Zug etwas sagt.')},
    comedy:{punchline:P('One sentence each. No explanations until after the vote.','Je ein Satz. Erst nach der Abstimmung dürft ihr erklären.'),pitch:P('Both pitches must sound like urgent breaking news.','Beide Pitches müssen wie eine dringende Eilmeldung klingen.'),expert:P('After each explanation, the audience may ask one skeptical question.','Nach jedem Vortrag darf das Publikum eine skeptische Frage stellen.'),toast:P('Both toasts must start seriously and end with a playful twist.','Beide Reden beginnen ernst und enden mit einer lustigen Wendung.')},
    bluff:{confession:P('The storyteller must include one specific sensory detail. The group gets exactly one question.','Die erzählende Person nennt ein konkretes Sinnesdetail. Die Runde darf genau eine Frage stellen.'),twotruths:P('All three statements must be about the same period of your life.','Alle drei Aussagen müssen sich auf denselben Lebensabschnitt beziehen.'),fact:P('Bluffers have 15 seconds to prepare one convincing alternative each.','Alle Bluffenden haben 15 Sekunden für je eine überzeugende Alternative.')}
  };
  function twist(kind,type,round,duration,enabled=true){
    if(!enabled||duration==='quick'||(round+1)%4!==0)return null;
    return switchups[kind]?.[type]||null;
  }
  function remember(recent,keyValue,limit=160){if(!keyValue)return [...recent];return [...recent.filter(x=>x!==keyValue),keyValue].slice(-limit);}
  window.CHAOS27={content,twist,remember};
})();

/* V2.4 deep-game rules and curated bilingual content. No network services. */
(() => {
  'use strict';
  const P=(en,de)=>({en,de});
  const packs={
    social: [
      ['vote','Who would be the worst person to trust with a surprise party, and what would give them away?','Wem würdet ihr eine Überraschungsparty am wenigsten anvertrauen – und wodurch würde die Person sich verraten?'],
      ['discuss','What tiny habit instantly makes a guest memorable for the wrong reason?','Welche winzige Angewohnheit sorgt dafür, dass man einen Gast aus den falschen Gründen nicht vergisst?'],
      ['vote','Who could talk their way into an event they were never invited to?','Wer könnte sich auf eine Veranstaltung reinreden, zu der er gar nicht eingeladen wurde?'],
      ['story','Tell us about a plan that failed before anyone even left the house.','Erzähl von einem Plan, der schon gescheitert ist, bevor jemand das Haus verlassen hat.'],
      ['choose','Would you rather have your group choose your outfits for a week or your ringtone for a year?','Dürfte eure Runde lieber eine Woche eure Outfits oder ein Jahr euren Klingelton bestimmen?'],
      ['vote','Who would insist they are good at directions while clearly walking in circles?','Wer würde darauf bestehen, sich gut auszukennen, während ihr offensichtlich im Kreis lauft?'],
      ['story','What is a completely ordinary skill you are weirdly proud of?','Auf welche völlig alltägliche Fähigkeit bist du überraschend stolz?'],
      ['choose','Would you rather hear every first impression people had of you or every nickname they privately gave you?','Würdest du lieber jeden ersten Eindruck hören, den andere von dir hatten, oder alle Spitznamen, die sie dir heimlich gegeben haben?'],
      ['discuss','Which common social rule would you abolish at parties?','Welche ungeschriebene Regel würdet ihr auf Partys abschaffen?'],
      ['vote','Who could turn a five-minute errand into a two-hour adventure?','Wer könnte aus einer Fünf-Minuten-Besorgung ein zweistündiges Abenteuer machen?'],
      ['story','Describe a misunderstanding that made a conversation much funnier.','Erzähl von einem Missverständnis, das ein Gespräch viel lustiger gemacht hat.'],
      ['choose','Would you rather have every group photo include one stranger or have every photo taken just before you were ready?','Hättest du lieber auf jedem Gruppenfoto einen Fremden dabei, oder würde jedes Foto genau vor deinem besten Moment entstehen?'],
      ['vote','Who is most likely to befriend the host’s pet before meeting the host?','Wer würde erst das Haustier kennenlernen und sich erst danach beim Gastgeber vorstellen?'],
      ['discuss','What everyday situation makes people inexplicably competitive?','Bei welcher Alltagssache werden Menschen völlig grundlos ehrgeizig?'],
      ['story','What was your most dramatic reaction to something completely unimportant?','Wann hast du wegen einer völlig unwichtigen Sache übertrieben dramatisch reagiert?'],
      ['choose','Would you rather always be ten minutes early with no phone or ten minutes late with a perfect excuse?','Wärst du lieber immer zehn Minuten zu früh ohne Handy oder zehn Minuten zu spät mit einer perfekten Ausrede?'],
      ['vote','Who would end up giving a speech at an event they only attended for the food?','Wer würde spontan eine Rede halten, obwohl er eigentlich nur wegen des Essens gekommen ist?'],
      ['discuss','Which small inconvenience can ruin an otherwise excellent day?','Welche kleine Unannehmlichkeit kann einen sonst perfekten Tag ruinieren?'],
      ['story','What is the funniest thing you have misheard in a crowded room?','Was ist das Lustigste, das du in einem lauten Raum falsch verstanden hast?'],
      ['vote','Who would accidentally start a tradition that everyone else follows for years?','Wer würde aus Versehen eine Tradition erfinden, die alle noch jahrelang mitmachen?']
    ],
    night: [
      ['vote','Who would volunteer to control the playlist and immediately divide the room?','Wer würde sich sofort die Playlist schnappen und die halbe Runde gegen sich aufbringen?'],
      ['story','What is the funniest reason you have ever left a gathering early?','Was war der lustigste Grund, warum du eine Feier früher verlassen hast?'],
      ['discuss','What is the one snack that must always be at a house party?','Welcher Snack muss bei jeder Hausparty dabei sein?'],
      ['vote','Who would spend half the evening trying to repair a speaker instead of using another one?','Wer würde den halben Abend eine kaputte Box reparieren, statt eine andere zu nehmen?'],
      ['choose','Would you rather choose the music for everyone or surrender all music decisions for the evening?','Würdest du lieber den ganzen Abend Musik aussuchen oder überhaupt kein Mitspracherecht haben?'],
      ['story','Tell us about a night when the unplanned part turned out best.','Erzähl von einem Abend, an dem das Ungeplante am besten war.'],
      ['vote','Who would become best friends with someone in the snack queue?','Wer würde in der Snackschlange neue beste Freunde finden?'],
      ['discuss','Name a song that always gets at least two people in this room singing.','Nennt einen Song, bei dem hier mindestens zwei Leute mitsingen würden.'],
      ['choose','Would you rather arrive first and set everything up or arrive late and do the final cleanup?','Würdest du lieber als Erster kommen und alles aufbauen oder spät kommen und am Ende aufräumen?'],
      ['vote','Who would be the most entertaining person to give an unprepared toast?','Wer würde spontan die unterhaltsamste Ansprache halten?'],
      ['story','What was your most questionable late-night food combination?','Was war deine fragwürdigste Essenskombination spät am Abend?'],
      ['discuss','Invent the worst possible theme for your next house party.','Erfindet das schlimmstmögliche Motto für eure nächste Hausparty.'],
      ['vote','Who would accidentally invite the entire group to something they had only mentioned casually?','Wer würde die ganze Runde aus Versehen zu einer völlig unverbindlich erwähnten Sache einladen?'],
      ['choose','Would you rather always host but never choose the music, or never host but always choose the music?','Würdest du lieber immer Gastgeber sein, aber nie Musik bestimmen, oder nie Gastgeber sein und immer die Musik bestimmen?'],
      ['story','What was the most unexpected conversation you have had at a party?','Was war das unerwartetste Gespräch, das du je auf einer Party hattest?'],
      ['discuss','What would be the first ridiculous house rule if this group opened a café?','Was wäre die erste absurde Hausregel, wenn diese Runde ein Café eröffnen würde?'],
      ['vote','Who would stay to help tidy up without anyone asking?','Wer würde freiwillig noch beim Aufräumen helfen?'],
      ['story','Describe a party moment that became an inside joke.','Erzähl von einem Partymoment, der zum Insider wurde.'],
      ['discuss','What makes a gathering fun even without planned activities?','Was macht ein Treffen auch ohne geplante Aktionen lustig?'],
      ['vote','Who would arrive with an unnecessarily complicated homemade dip?','Wer würde einen völlig übertrieben aufwendigen selbstgemachten Dip mitbringen?']
    ],
    confessions: [
      ['story','What harmless mistake did you spend far too long trying to hide?','Welchen harmlosen Fehler hast du viel zu lange zu verstecken versucht?'],
      ['story','Which phase of your life still makes you cringe a little?','Welche Phase deines Lebens ist dir heute ein bisschen peinlich?'],
      ['story','When did you pretend to understand something and get caught?','Wann hast du so getan, als würdest du etwas verstehen, und wurdest erwischt?'],
      ['story','What is the most ridiculous thing you have practiced in front of a mirror?','Was ist das Lächerlichste, das du je vor dem Spiegel geübt hast?'],
      ['story','What was your worst attempt at making a great first impression?','Was war dein schlechtester Versuch, einen guten ersten Eindruck zu machen?'],
      ['story','What purchase were you sure would change your life but barely used?','Welcher Kauf sollte dein Leben verändern, wurde dann aber kaum genutzt?'],
      ['story','What is an opinion you used to defend that you now completely disagree with?','Welche Meinung hast du früher verteidigt, die du heute überhaupt nicht mehr vertrittst?'],
      ['story','What is something you misunderstood for an embarrassingly long time?','Was hast du peinlich lange falsch verstanden?'],
      ['story','Tell us about a message you regretted sending immediately. Keep names private.','Erzähl von einer Nachricht, die du sofort bereut hast. Ohne Namen zu nennen.'],
      ['story','What is the pettiest argument you have ever been involved in?','Was war der kleinlichste Streit, an dem du je beteiligt warst?'],
      ['story','Have you ever gone somewhere because you misread the invitation?','Bist du schon mal irgendwo hingegangen, weil du eine Einladung falsch verstanden hast?'],
      ['story','What is your strangest perfectly harmless personal superstition?','Was ist dein seltsamster, völlig harmloser Aberglaube?'],
      ['story','Which tiny lie became harder to correct the longer it went on?','Welche kleine Lüge wurde immer schwerer aufzuklären, je länger sie bestehen blieb?'],
      ['story','What is your most memorable awkward greeting?','Was war deine denkwürdigste peinliche Begrüßung?'],
      ['story','When did you laugh at a joke you did not understand?','Wann hast du über einen Witz gelacht, den du gar nicht verstanden hast?'],
      ['story','Which habit did your friends notice before you did?','Welche Angewohnheit haben deine Freunde vor dir bemerkt?'],
      ['story','What moment made you realize you had been talking to the wrong person?','Wann hast du gemerkt, dass du die ganze Zeit mit der falschen Person geredet hast?'],
      ['story','What ridiculous thing are you still surprisingly competitive about?','Bei welcher lächerlichen Sache bist du immer noch überraschend ehrgeizig?'],
      ['story','When did a harmless prank backfire on you?','Wann ist dir ein harmloser Streich selbst auf die Füße gefallen?'],
      ['story','What do you find funny now that embarrassed you at the time?','Was findest du heute lustig, obwohl es dir damals peinlich war?']
    ],
    opinions: [
      ['choose','Would you rather ban voice messages or group chats for a month?','Würdest du lieber einen Monat lang Sprachnachrichten oder Gruppenchats verbieten?'],
      ['discuss','What food is loved by everyone but completely overrated?','Welches Essen wird von allen geliebt, ist aber völlig überbewertet?'],
      ['choose','Would you rather watch a movie with someone who talks or someone who keeps checking their phone?','Würdest du lieber mit jemandem einen Film schauen, der ständig redet, oder mit jemandem, der dauernd aufs Handy schaut?'],
      ['discuss','Is arriving exactly on time secretly late? Defend your answer.','Ist genau pünktlich kommen eigentlich schon zu spät? Begründet eure Meinung.'],
      ['choose','Would you rather have a perfect memory for faces or for song lyrics?','Würdest du dir lieber jedes Gesicht oder jeden Songtext perfekt merken können?'],
      ['discuss','What should be socially acceptable to leave halfway through?','Was sollte man problemlos mittendrin verlassen dürfen?'],
      ['choose','Would you rather always choose the restaurant or never be allowed to choose it?','Würdest du lieber immer das Restaurant bestimmen oder niemals mitentscheiden dürfen?'],
      ['discuss','Which everyday rule should be decided by majority vote?','Welche Alltagsregel sollte man per Mehrheitsentscheid festlegen?'],
      ['choose','Would you rather be unable to whisper or unable to shout?','Würdest du lieber nicht mehr flüstern oder nicht mehr laut rufen können?'],
      ['discuss','Is a surprise party actually enjoyable for the person being surprised?','Ist eine Überraschungsparty für die überraschte Person wirklich schön?'],
      ['choose','Would you rather always lose at board games or always be accused of cheating when you win?','Würdest du lieber jedes Brettspiel verlieren oder bei jedem Sieg des Schummelns verdächtigt werden?'],
      ['discuss','Which small luxury do you refuse to give up?','Auf welchen kleinen Luxus würdest du niemals verzichten?'],
      ['choose','Would you rather speak only in questions for a day or sing every response for an hour?','Würdest du lieber einen Tag lang nur Fragen stellen oder eine Stunde lang jede Antwort singen?'],
      ['discuss','What unpopular opinion would you defend in front of everyone here?','Welche unpopuläre Meinung würdest du vor dieser Runde verteidigen?'],
      ['choose','Would you rather have every meal be a surprise or have the same breakfast for a year?','Würdest du lieber bei jeder Mahlzeit überrascht werden oder ein Jahr lang dasselbe Frühstück essen?'],
      ['discuss','What is something expensive that is actually worth the money?','Was ist teuer, aber das Geld wirklich wert?'],
      ['choose','Would you rather always be asked for advice or never be asked?','Würdest du lieber ständig um Rat gefragt werden oder nie?'],
      ['discuss','Should someone always be allowed to veto a song on the playlist?','Sollte man jederzeit einen Song auf der Playlist per Veto stoppen dürfen?'],
      ['choose','Would you rather have ten casual friends nearby or one very close friend across the world?','Würdest du lieber zehn lockere Freunde in der Nähe oder einen sehr engen Freund auf der anderen Seite der Welt haben?'],
      ['discuss','Which common inconvenience deserves its own annual holiday?','Welche alltägliche Nervigkeit verdient einen eigenen Feiertag?']
    ],
    challenges: [
      ['perform','Give a 15-second acceptance speech for the award “Most Unnecessary Detour”.','Halte eine 15-Sekunden-Dankesrede für den Preis „Unnötigster Umweg“.'],
      ['perform','Explain why a spoon deserves to be promoted to team leader.','Erkläre, warum ein Löffel Teamleiter werden sollte.'],
      ['perform','Sell the nearest ordinary object as a premium subscription.','Verkaufe den nächsten Alltagsgegenstand als Premium-Abo.'],
      ['perform','Give a weather forecast for the current mood of this room.','Präsentiere einen Wetterbericht zur aktuellen Stimmung im Raum.'],
      ['perform','Describe your journey here as if it were a tense sports final.','Beschreibe deine Anreise wie ein spannendes Sportfinale.'],
      ['perform','Invent a three-line advertisement for leftover pizza.','Erfinde einen dreizeiligen Werbespot für übrig gebliebene Pizza.'],
      ['perform','Mime forgetting your password three times while being watched.','Stelle pantomimisch dar, wie du dreimal dein Passwort vergisst und dabei beobachtet wirst.'],
      ['perform','Let someone pick a harmless word; work it naturally into your next two sentences.','Lass jemanden ein harmloses Wort wählen und baue es natürlich in deine nächsten zwei Sätze ein.'],
      ['perform','Make a sincere public apology to your alarm clock.','Entschuldige dich aufrichtig und öffentlich bei deinem Wecker.'],
      ['perform','Narrate someone pouring water as if it were an action-movie scene.','Kommentiere, wie jemand Wasser einschenkt, als wäre es eine Actionszene.'],
      ['perform','Invent an unforgettable name for a fictional restaurant in ten seconds.','Erfinde in zehn Sekunden einen unvergesslichen Namen für ein erfundenes Restaurant.'],
      ['perform','Give a dramatic introduction to the next person at the table.','Kündige die nächste Person am Tisch völlig übertrieben dramatisch an.'],
      ['perform','Explain your favorite snack using only gestures for twenty seconds.','Erkläre deinen Lieblingssnack zwanzig Sekunden lang nur mit Gesten.'],
      ['perform','Challenge someone to invent a slogan for the room you are in.','Fordere jemanden auf, einen Werbeslogan für diesen Raum zu erfinden.'],
      ['perform','Pretend you are introducing a very boring but extremely important new law about socks.','Stell ein sehr langweiliges, aber angeblich lebenswichtiges neues Sockengesetz vor.'],
      ['perform','Deliver an exciting sports commentary about somebody picking up a pen.','Kommentiere sportlich mitreißend, wie jemand einen Stift aufhebt.'],
      ['perform','Invent a handshake with someone in twenty seconds. Only if both agree.','Erfinde mit jemandem in zwanzig Sekunden einen Handschlag. Nur wenn beide mitmachen möchten.'],
      ['perform','Make up a one-line movie trailer voiceover for this evening.','Erfinde einen Trailer-Satz über diesen Abend mit dramatischer Kinostimme.'],
      ['perform','Describe a fictional job for which you are spectacularly unqualified.','Beschreibe einen erfundenen Job, für den du spektakulär ungeeignet bist.'],
      ['perform','Choose someone to give a five-word review of the evening so far.','Wähle jemanden aus, der den bisherigen Abend in fünf Worten bewertet.']
    ],
    afterdark: [
      ['story','What is a first-date moment that would instantly become a story for your friends?','Welcher Moment beim ersten Date würde sofort zur Geschichte für deine Freunde werden?'],
      ['choose','Would you rather accidentally like an old photo or send a flirty message to the wrong chat?','Würdest du lieber versehentlich ein uraltes Foto liken oder eine Flirtnachricht in den falschen Chat schicken?'],
      ['story','What is the most awkward compliment you have ever received?','Was war das unangenehmste Kompliment, das du je bekommen hast?'],
      ['vote','Who would overthink a simple “hey” message the longest?','Wer würde am längsten über eine einfache „Hey“-Nachricht nachdenken?'],
      ['discuss','What is an instantly unattractive habit that people rarely admit?','Welche Angewohnheit wirkt sofort unattraktiv, ohne dass es jemand offen zugibt?'],
      ['choose','Would you rather have your worst flirting attempt replayed or your old online bio read aloud?','Würdest du lieber deinen schlechtesten Flirtversuch noch mal erleben oder dein altes Online-Profil vorgelesen bekommen?'],
      ['story','What is a harmless dating misconception you once believed?','Welche harmlose Vorstellung über Dating hattest du früher, die sich als Unsinn entpuppt hat?'],
      ['discuss','What is the least romantic place for a grand romantic gesture?','Wo wäre der unromantischste Ort für eine große romantische Geste?'],
      ['vote','Who would spend the most time choosing one dating-profile photo?','Wer würde am längsten ein einziges Dating-Profilfoto auswählen?'],
      ['choose','Would you rather go on a date planned entirely by your friends or plan a date for two strangers?','Würdest du lieber ein Date erleben, das Freunde für dich geplant haben, oder ein Date für zwei Fremde planen?'],
      ['story','What is the most embarrassing innocent text autocorrect ever sent on your behalf?','Was war die peinlichste harmlose Autokorrektur, die du je verschickt hast?'],
      ['discuss','Is a terrible date with an amazing story better than an unremarkable one?','Ist ein schreckliches Date mit einer großartigen Geschichte besser als ein völlig unspektakuläres?'],
      ['vote','Who would be the best wingperson, purely because they talk to absolutely everyone?','Wer wäre die beste Flirthilfe, einfach weil er mit wirklich allen ins Gespräch kommt?'],
      ['story','Which ridiculous romantic cliché do you secretly find charming?','Welches kitschige Liebesklischee findest du insgeheim charmant?'],
      ['choose','Would you rather have to introduce yourself with a dance move or a terrible pickup line?','Würdest du dich lieber mit einem Tanzschritt oder einem schrecklichen Anmachspruch vorstellen müssen?'],
      ['discuss','What would be the funniest slogan for a very unsuccessful dating app?','Was wäre der lustigste Slogan für eine sehr erfolglose Dating-App?'],
      ['story','Tell us about a moment when you completely misread a social signal. No names necessary.','Erzähl von einem Moment, in dem du ein soziales Signal völlig falsch verstanden hast. Ohne Namen.'],
      ['choose','Would you rather be unable to flirt at all or be unaware every time someone flirts with you?','Würdest du lieber überhaupt nicht flirten können oder nie merken, wenn jemand mit dir flirtet?'],
      ['discuss','What is a dating-app profile phrase that should be retired forever?','Welcher Satz in Dating-Profilen gehört für immer abgeschafft?'],
      ['vote','Who could turn a terrible date into a genuinely funny story by the next morning?','Wer könnte aus einem furchtbaren Date bis zum nächsten Morgen eine richtig lustige Geschichte machen?']
    ]
  };
  const names={social:P('Friends & Chaos','Freunde & Chaos'),night:P('Night Out','Partyabend'),confessions:P('Confessions','Geständnisse'),opinions:P('Hot Takes','Heiße Meinungen'),challenges:P('Challenges','Aktionen'),afterdark:P('After Dark · 18+','After Dark · ab 18')};
  const hints={vote:P('Everyone points together. Explain the choice if you like.','Alle zeigen gleichzeitig. Begründet eure Wahl, wenn ihr möchtet.'),discuss:P('Go around the group. There is no right answer.','Geht reihum. Es gibt keine richtige Antwort.'),story:P('Anyone can tell a story or pass. No pressure.','Wer möchte, erzählt. Passen ist jederzeit okay.'),choose:P('Pick a side, then defend it.','Entscheidet euch und begründet eure Wahl.'),perform:P('One volunteer performs; everyone else joins in or judges.','Eine freiwillige Person macht vor, der Rest macht mit oder urteilt.')};
  const legacy={social:[['roulette','vote'],['most','vote'],['last','discuss']],night:[['sip','story']],confessions:[['never','story'],['truth','story']],opinions:[['redflag','discuss']],challenges:[['dare','perform']]};
  const keyItem=(pack,kind,it,i,origin)=>({id:`${origin}:${pack}:${i}`,pack,kind,en:it.en,de:it.de});
  function pool(tone){let result=[]; for(const [pack,items] of Object.entries(packs)){if(pack==='afterdark'&&tone!=='adult')continue;result.push(...items.map(([kind,en,de],i)=>({id:`24:${pack}:${i}`,pack,kind,en,de})));}
    for(const [pack,sources] of Object.entries(legacy))for(const [key,kind] of sources){let arr=window.CHAOS_EXTRA?.[key]||[]; if(!arr.length)arr=window.PARTY_DATA?.[key]||[];result.push(...arr.filter(x=>x&&x.en&&x.de).map((it,i)=>keyItem(pack,kind,it,i,key)));}
    const unique=new Set();return result.filter(x=>{const key=x.en.toLowerCase().replace(/\s+/g,' ').trim();if(unique.has(key))return false;unique.add(key);return true;});
  }
  const numberModes={quick:12,standard:28,long:56};
  const kingModes={quick:12,standard:26,long:52};
  const suits=['♠','♥','♦','♣'];
  const suitNames={ '♠':P('Debate','Debatte'),'♥':P('Friends','Freunde'),'♦':P('Choices','Entscheidungen'),'♣':P('Chaos','Chaos')};
  // Each row describes one rank, with a distinct prompt for each suit.
  const kingData=[
    ['The table chooses a tiny inconvenience to abolish.','Welchen winzigen Alltagsärger würdet ihr abschaffen?','Nominate the kindest spontaneous host.','Bestimmt die spontan gastfreundlichste Person.','Everyone chooses between two awful restaurant concepts.','Wählt gemeinsam zwischen zwei furchtbaren Restaurantideen.','Give a ten-second introduction to someone at the table.','Stell jemanden am Tisch in zehn Sekunden vor.'],
    ['Discuss whether arriving exactly on time counts as late.','Diskutiert, ob auf die Minute pünktlich schon zu spät ist.','Invent a friendly greeting rule until the next four cards.','Erfindet für die nächsten vier Karten eine freundliche Begrüßungsregel.','Choose a word that cannot be used until four more cards are completed.','Legt ein Wort fest, das bis nach vier weiteren Karten tabu ist.','Everyone must begin their next answer with the same silly phrase.','Alle beginnen ihre nächste Antwort mit derselben albernen Formulierung.'],
    ['Tell a story about a plan that fell apart.','Erzählt von einem Plan, der schiefging.','Share a moment when a friend saved the day.','Erzählt von einem Moment, in dem Freunde euch geholfen haben.','Would you rather have a terrible seat or terrible music all evening?','Lieber den schlechtesten Sitzplatz oder den ganzen Abend schreckliche Musik?','Build a story together one sentence at a time.','Erzählt zusammen eine Geschichte, Satz für Satz.'],
    ['Name a harmless argument your group still has.','Nennt einen harmlosen Streitpunkt in der Runde.','Everyone names a thing they appreciate about a shared activity.','Alle nennen etwas, das sie an einer gemeinsamen Aktivität mögen.','Choose an object to take to a desert island; no repeats.','Nennt Gegenstände für eine einsame Insel. Keine Wiederholungen.','Everyone suggests a fake name for this party.','Alle schlagen einen erfundenen Namen für diese Party vor.'],
    ['Defend an unpopular food opinion for fifteen seconds.','Verteidige fünfzehn Sekunden lang eine unpopuläre Essensmeinung.','Name five things that make a great friend; each person adds one.','Nennt fünf Dinge, die gute Freundschaft ausmachen; jeder ergänzt etwas.','Go around naming unique pizza toppings.','Nennt reihum Pizzabeläge, ohne etwas zu wiederholen.','Go around naming things that should never be used as a microphone.','Nennt reihum Dinge, die man nie als Mikrofon benutzen sollte.'],
    ['Toast a habit that deserves to disappear.','Stoßt mit einem lustigen Spruch auf eine Angewohnheit an, die verschwinden sollte.','Offer a sincere twenty-second toast to your friends.','Halte eine ehrliche zwanzigsekündige Ansprache an deine Freunde.','Toast the most unnecessary purchase you have made.','Widme deinem unnötigsten Kauf einen Trinkspruch.','Toast the strangest event that could happen tonight.','Erfinde einen Trinkspruch zum seltsamsten Ereignis, das heute passieren könnte.'],
    ['Choose a ridiculous debate rule for four cards.','Legt für vier Karten eine absurde Diskussionsregel fest.','For the next four cards, address everyone with an invented title.','Nennt euch die nächsten vier Karten mit erfundenen Titeln.','For four cards, no one may say “actually” or “eigentlich”.','Vier Karten lang darf niemand „eigentlich“ sagen.','Until four more cards pass, anyone may demand a silly dramatic recap.','Für vier Karten darf jeder eine albern-dramatische Zusammenfassung verlangen.'],
    ['Give a short speech about the worst queue you can imagine.','Halte eine kurze Rede über die schlimmste Warteschlange.','Two friends act out greeting each other after ten years.','Zwei Leute spielen ein Wiedersehen nach zehn Jahren.','Choose which everyday item should become a luxury product.','Wählt einen Alltagsgegenstand, der plötzlich Luxus sein soll.','Improvise a thirty-second advert for the nearest object.','Improvisiert einen dreißigsekündigen Werbespot für den nächsten Gegenstand.'],
    ['Rhyme around the circle with “night”; change the starting word if playing in German.','Findet reihum Reime auf „Zeit“. Keine Wiederholung.','Rhyme around the circle using “friend” or “Freund”.','Reimt reihum auf „Freund“. Keine Wiederholung.','Rhyme around the circle using “money” or “Geld”.','Reimt reihum auf „Geld“. Keine Wiederholung.','Rhyme around the circle using “party” or “Feier”.','Reimt reihum auf „Feier“. Keine Wiederholung.'],
    ['Which social expectation should be optional? Defend your view.','Welche gesellschaftliche Erwartung sollte freiwillig sein?','What makes a friendship last? Everyone says one thing.','Was hält eine Freundschaft lebendig? Alle nennen etwas.','Which everyday comfort is worth paying extra for?','Für welchen Alltagskomfort lohnt sich ein Aufpreis?','What is the worst possible slogan for a new café?','Was wäre der schlechteste Slogan für ein neues Café?'],
    ['Pick a friendly question-master for the next four cards.','Wählt für vier Karten einen freundlichen Fragemeister.','For four cards, start every question with a compliment.','Beginnt die nächsten vier Karten jede Frage mit einem Kompliment.','For four cards, answer yes/no questions using a full sentence only.','Beantwortet Ja-Nein-Fragen vier Karten lang nur in ganzen Sätzen.','For the next four cards, no one can use the word “okay”.','Für vier Karten darf niemand „okay“ sagen.'],
    ['What is your most harmless unpopular opinion?','Was ist deine harmloseste unpopuläre Meinung?','Tell a short story about someone who surprised you kindly.','Erzähl kurz, wie jemand dich positiv überrascht hat.','Share a purchase you regretted that turned out funny.','Erzähl von einem Fehlkauf, über den du heute lachst.','Confess a very minor social blunder, or invent one.','Gestehe einen kleinen sozialen Fehltritt oder denk dir einen aus.'],
    ['Everyone votes on one rule to retire from the current game.','Die Runde stimmt ab, welche aktive Regel beendet wird.','Give the group a collective compliment.','Mach der ganzen Runde ein Kompliment.','Everyone picks the best of three imaginary holiday ideas.','Alle wählen die beste von drei verrückten Urlaubsideen.','Invent a fifteen-second closing speech for this round.','Erfinde eine fünfzehnsekündige Abschlussrede für diese Runde.']
  ];
  function kingEvent(rank,suit){let ix=suits.indexOf(suit),row=kingData[rank-1];return P(row[ix*2],row[ix*2+1]);}
  const ruleRanks=[2,7,11];
  const houseRules={
    2:{
      '♠':P('Before debating, politely say “I object!”','Vor einer Debatte höflich „Einspruch!“ sagen.'),
      '♥':P('Greet the next speaker with a made-up royal title.','Begrüßt die nächste Person mit einem erfundenen Adelstitel.'),
      '♦':P('Avoid the word “actually” / „eigentlich“.','Vermeidet das Wort „eigentlich“.'),
      '♣':P('Start answers with the phrase “Plot twist: …”.','Beginnt Antworten mit „Plot-Twist: …“.')
    },
    7:{
      '♠':P('For a debate, the second speaker must argue the opposite.','Bei einer Debatte vertritt die zweite Person die Gegenposition.'),
      '♥':P('Address everyone with an invented title.','Sprecht euch mit erfundenen Titeln an.'),
      '♦':P('Avoid saying “yes” and “no” / „ja“ und „nein“.','Verwendet weder „ja“ noch „nein“.'),
      '♣':P('Anyone can request a ten-second dramatic recap.','Jede Person darf eine zehnsekündige dramatische Zusammenfassung verlangen.')
    },
    11:{
      '♠':P('One volunteer becomes Question Master for four cards.','Eine freiwillige Person wird für vier Karten Fragemeister.'),
      '♥':P('Start the next contribution with a kind compliment.','Beginnt den nächsten Beitrag mit einem netten Kompliment.'),
      '♦':P('Answer yes/no questions in complete sentences.','Beantwortet Ja-Nein-Fragen in ganzen Sätzen.'),
      '♣':P('No one may say “okay” for four cards.','Vier Karten lang darf niemand „okay“ sagen.')
    },
    extra:{
      '♠':P('Every opinion gets one follow-up question.','Auf jede Meinung folgt eine Nachfrage.'),
      '♥':P('Give the next speaker a friendly introduction.','Kündigt die nächste Person freundlich an.'),
      '♦':P('Avoid filler words such as “um” / „ähm“.','Vermeidet Füllwörter wie „ähm“.'),
      '♣':P('Give the next answer a dramatic movie title.','Gebt der nächsten Antwort einen dramatischen Filmtitel.')
    }
  };
  function kingRule(card){return (houseRules[card.rank]||houseRules.extra)[card.suit];}
  window.CHAOS24={P,packs,names,hints,pool,kingEvent,kingRule,ruleRanks,suitNames,numberModes,kingModes,suits};
})();

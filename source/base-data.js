(() => {
    // Offline bilingual game content for Instant Party. All prompts are original.
    const P = (en, de) => ({ en, de });
    const text = (en, de) => P(en, de);
    window.PARTY_DATA = {
        roulette: [
            P('Which friend would survive the longest as the accidental mayor of a tiny island? Defend your nomination.', 'Wer würde als versehentlicher Bürgermeister einer winzigen Insel am längsten durchhalten? Begründet eure Wahl.'),
            P('Your group must open a museum of terrible ideas. What is the star exhibit?', 'Ihr müsst ein Museum für schlechte Ideen eröffnen. Was ist das Hauptexponat?'),
            P('Sell a broken umbrella as a luxury product. You have 20 seconds.', 'Verkauf einen kaputten Regenschirm als Luxusprodukt. Du hast 20 Sekunden.'),
            P('Who here would get caught arguing with a self-checkout machine?', 'Wer von euch würde dabei erwischt werden, mit einer Selbstbedienungskasse zu streiten?'),
            P('Every door you open plays an entrance song. Which song would be most embarrassing?', 'Jede Tür spielt beim Öffnen deine Einzugsmusik. Welcher Song wäre am peinlichsten?'),
            P('Give a heartfelt acceptance speech for winning “Most Suspicious Fridge.”', 'Halte eine bewegende Dankesrede für den Preis „Verdächtigster Kühlschrank“.'),
            P('Which two people here would make the worst detective duo? Why?', 'Welche zwei Personen hier wären das schlechteste Detektivduo? Warum?'),
            P('Your phone starts reviewing your decisions out loud. What gets one star?', 'Dein Handy bewertet deine Entscheidungen laut. Welche bekommt nur einen Stern?'),
            P('Invent a conspiracy theory about why socks disappear in the laundry.', 'Erfinde eine Verschwörungstheorie darüber, warum Socken in der Wäsche verschwinden.'),
            P('Who would befriend the villain before noticing they are the villain?', 'Wer würde sich mit dem Bösewicht anfreunden, bevor er merkt, dass es der Bösewicht ist?'),
            P('Describe an ordinary spoon as if you are launching a revolutionary startup.', 'Stell einen gewöhnlichen Löffel vor, als würdest du ein revolutionäres Start-up gründen.'),
            P('Who could turn “going to buy milk” into a seven-hour side quest?', 'Wer würde aus „kurz Milch kaufen“ eine siebenstündige Nebenquest machen?'),
            P('Your group has to represent Earth in a galactic talent show. What is your act?', 'Ihr müsst die Erde bei einer galaktischen Talentshow vertreten. Was führt ihr auf?'),
            P('Pitch the worst possible app that still somehow raises €20 million.', 'Stell die schlechteste App vor, die trotzdem irgendwie 20 Millionen Euro einsammelt.'),
            P('Who would accidentally become famous for something incredibly boring?', 'Wer würde aus Versehen mit etwas unglaublich Langweiligem berühmt werden?'),
            P('Invent the least useful superhero. The group must find them a mission.', 'Erfinde den nutzlosesten Superhelden. Die Gruppe muss ihm eine Mission geben.'),
            P('The group is stranded in IKEA overnight. Who becomes leader?', 'Ihr seid über Nacht bei IKEA eingeschlossen. Wer übernimmt die Führung?'),
            P('Make up a slogan for a restaurant that sells only ice cubes.', 'Erfinde einen Slogan für ein Restaurant, das nur Eiswürfel verkauft.'),
            P('Who is most likely to send a voice message that should have been “ok”?', 'Wer schickt am ehesten eine dreiminütige Sprachnachricht, obwohl „ok“ gereicht hätte?'),
            P('Everyone has 10 seconds to give the person on their right a completely fictional job title.', 'Jeder hat zehn Sekunden, um der Person rechts einen völlig erfundenen Berufstitel zu geben.')
        ],
        never: [
            P('Never have I ever pretended to understand something and nodded confidently.', 'Ich habe noch nie so getan, als würde ich etwas verstehen, und selbstbewusst genickt.'),
            P('Never have I ever opened the fridge, forgotten why, and opened it again.', 'Ich habe noch nie den Kühlschrank geöffnet, vergessen warum und ihn direkt wieder geöffnet.'),
            P('Never have I ever searched for my phone while holding it.', 'Ich habe noch nie mein Handy gesucht, während ich es in der Hand hatte.'),
            P('Never have I ever practiced a conversation that never happened.', 'Ich habe noch nie ein Gespräch geübt, das dann nie stattgefunden hat.'),
            P('Never have I ever laughed at a joke I did not understand.', 'Ich habe noch nie über einen Witz gelacht, den ich nicht verstanden habe.'),
            P('Never have I ever walked confidently in the wrong direction and pretended it was intentional.', 'Ich bin noch nie selbstbewusst in die falsche Richtung gelaufen und habe so getan, als wäre es Absicht.'),
            P('Never have I ever set five alarms and ignored all of them.', 'Ich habe noch nie fünf Wecker gestellt und alle ignoriert.'),
            P('Never have I ever watched a tutorial at double speed and still been confused.', 'Ich habe noch nie ein Tutorial auf doppelter Geschwindigkeit geschaut und trotzdem nichts verstanden.'),
            P('Never have I ever sent a message to the wrong chat.', 'Ich habe noch nie eine Nachricht in den falschen Chat geschickt.'),
            P('Never have I ever googled the meaning of a word during an argument.', 'Ich habe noch nie mitten in einer Diskussion die Bedeutung eines Wortes gegoogelt.'),
            P('Never have I ever pretended to be busy to avoid an awkward conversation.', 'Ich habe noch nie so getan, als wäre ich beschäftigt, um ein unangenehmes Gespräch zu vermeiden.'),
            P('Never have I ever left a store without buying anything and felt like a suspect.', 'Ich habe noch nie einen Laden ohne Einkauf verlassen und mich verdächtig gefühlt.'),
            P('Never have I ever joined a meeting and immediately forgotten why.', 'Ich habe noch nie an einem Treffen teilgenommen und sofort vergessen, worum es ging.'),
            P('Never have I ever said “I am on my way” before leaving home.', 'Ich habe noch nie „Bin unterwegs“ geschrieben, obwohl ich noch zu Hause war.'),
            P('Never have I ever accidentally liked an old social media post.', 'Ich habe noch nie versehentlich einen uralten Social-Media-Beitrag gelikt.')
        ],
        majority: [
            [P('Your daily life gets a strange soundtrack. Which is worse?', 'Dein Alltag bekommt einen seltsamen Soundtrack. Was ist schlimmer?'), P('Every entrance has boss music.', 'Jeder Auftritt bekommt Boss-Musik.'), P('Every exit has an audience booing.', 'Bei jedem Abgang buht ein Publikum.')],
            [P('Pick a deeply inconvenient superpower.', 'Wähle eine ziemlich unpraktische Superkraft.'), P('Teleport only to places you have sneezed.', 'Teleportation nur an Orte, an denen du geniest hast.'), P('Become invisible, but only while singing.', 'Unsichtbar sein, aber nur beim Singen.')],
            [P('Which digital curse would you rather have?', 'Welchen digitalen Fluch würdest du lieber haben?'), P('Your phone narrates every typo.', 'Dein Handy liest jeden Tippfehler laut vor.'), P('Your fridge announces your snacks.', 'Dein Kühlschrank verkündet jeden Snack.')],
            [P('Which awful assistant do you hire?', 'Welchen schrecklichen Assistenten stellst du ein?'), P('A robot who cooks one amazing meal forever.', 'Ein Roboter, der für immer nur ein geniales Gericht kocht.'), P('A robot who cleans, but loudly judges you.', 'Ein Roboter, der putzt, aber dich laut verurteilt.')],
            [P('What would you rather be famous for?', 'Wofür wärst du lieber berühmt?'), P('The world record for slowest high-five.', 'Weltrekord im langsamsten High Five.'), P('Inventing edible shoelaces.', 'Die Erfindung essbarer Schnürsenkel.')],
            [P('Your appliances become sentient. Pick your roommate.', 'Deine Haushaltsgeräte werden lebendig. Wen nimmst du als Mitbewohner?'), P('A dramatic toaster.', 'Einen dramatischen Toaster.'), P('A philosophical vacuum cleaner.', 'Einen philosophischen Staubsauger.')],
            [P('Which terrible public feature should exist?', 'Welche furchtbare öffentliche Funktion soll es geben?'), P('Escalators that ask personal questions.', 'Rolltreppen, die persönliche Fragen stellen.'), P('Traffic lights that rate your outfit.', 'Ampeln, die dein Outfit bewerten.')],
            [P('Pick your permanent inconvenience.', 'Wähle dein dauerhaftes Alltagsproblem.'), P('Always get the best seat, but arrive late.', 'Immer den besten Platz, aber stets zu spät.'), P('Always arrive early, but sit on a squeaky chair.', 'Immer zu früh, aber auf einem quietschenden Stuhl.')],
            [P('Which movie curse sounds less bad?', 'Welcher Filmfluch klingt weniger schlimm?'), P('Your life gets a laugh track.', 'Dein Leben bekommt eingespieltes Gelächter.'), P('Your life gets a very judgmental narrator.', 'Dein Leben bekommt einen sehr wertenden Erzähler.')],
            [P('Pick a ridiculous pet companion.', 'Wähle einen absurden tierischen Begleiter.'), P('A goose who works as your lawyer.', 'Eine Gans, die als dein Anwalt arbeitet.'), P('A raccoon who is your financial adviser.', 'Einen Waschbären als Finanzberater.')],
            [P('Which horrible talent do you prefer?', 'Welches schreckliche Talent hättest du lieber?'), P('Perfectly imitate every printer noise.', 'Jedes Druckergeräusch perfekt imitieren.'), P('Know the exact age of every chair.', 'Das genaue Alter jedes Stuhls kennen.')],
            [P('Which life rule would you choose?', 'Welche Lebensregel würdest du wählen?'), P('Every compliment requires a PowerPoint.', 'Für jedes Kompliment musst du eine PowerPoint halten.'), P('Every complaint must rhyme.', 'Jede Beschwerde muss sich reimen.')]
        ],
        most: [
            P('Who would accidentally become the leader of a strange club?', 'Wer würde versehentlich Anführer eines merkwürdigen Clubs werden?'), P('Who would survive longest on a deserted island with only office supplies?', 'Wer würde mit ausschließlich Büroartikeln auf einer einsamen Insel am längsten überleben?'), P('Who would get lost while following a straight road?', 'Wer würde sich verlaufen, obwohl die Straße geradeaus führt?'), P('Who would be hired as a spy and immediately tell everyone?', 'Wer würde als Spion eingestellt werden und es sofort allen erzählen?'), P('Who would have an argument with an automatic door?', 'Wer würde sich mit einer automatischen Tür streiten?'), P('Who would try to negotiate with a parking meter?', 'Wer würde versuchen, mit einem Parkautomaten zu verhandeln?'), P('Who would accidentally start a food trend?', 'Wer würde versehentlich einen Food-Trend starten?'), P('Who would become famous for an extremely specific hobby?', 'Wer würde mit einem extrem speziellen Hobby berühmt werden?'), P('Who would turn a simple board game into a legal dispute?', 'Wer würde ein einfaches Brettspiel in einen Rechtsstreit verwandeln?'), P('Who would trust a suspiciously friendly pigeon?', 'Wer würde einer verdächtig freundlichen Taube vertrauen?'), P('Who would forget their own secret identity?', 'Wer würde seine eigene Geheimidentität vergessen?'), P('Who would accidentally win a contest they never entered?', 'Wer würde aus Versehen einen Wettbewerb gewinnen, an dem sie nie teilgenommen haben?')
        ],
        truth: [
            P('What harmless thing are you irrationally competitive about?', 'Bei welcher harmlosen Sache bist du völlig unnötig ehrgeizig?'), P('What is the most pointless thing you once researched for an hour?', 'Was ist das Sinnloseste, das du mal eine Stunde lang recherchiert hast?'), P('What is a food combination you defend against all criticism?', 'Welche Essenskombination verteidigst du gegen jede Kritik?'), P('What was your most spectacularly wrong first impression?', 'Was war dein spektakulärster falscher erster Eindruck?'), P('What silly skill do you secretly wish you had?', 'Welche alberne Fähigkeit hättest du heimlich gern?'), P('What is the least convincing excuse you have ever made?', 'Was war deine unglaubwürdigste Ausrede?'), P('Which everyday task do you avoid for no good reason?', 'Welche Alltagsaufgabe schiebst du grundlos vor dir her?'), P('What is a strange opinion you will defend?', 'Welche seltsame Meinung wirst du immer verteidigen?'), P('What tiny event improved your day far more than it should have?', 'Welches winzige Ereignis hat deinen Tag viel stärker verbessert als erwartet?'), P('What is your funniest harmless misunderstanding?', 'Was war dein lustigstes harmloses Missverständnis?')
        ],
        dare: [
            P('Deliver a 20-second motivational speech to a potato.', 'Halte eine 20-sekündige Motivationsrede an eine Kartoffel.'), P('Announce the weather as a dramatic villain.', 'Sage das Wetter wie ein dramatischer Bösewicht an.'), P('Give a product review of your left shoe as if it cost €10,000.', 'Bewerte deinen linken Schuh, als hätte er 10.000 Euro gekostet.'), P('Do a silent commercial for an invisible vacuum cleaner.', 'Dreh eine stumme Werbung für einen unsichtbaren Staubsauger.'), P('Explain how to use a fork as if teaching aliens.', 'Erkläre Außerirdischen, wie man eine Gabel benutzt.'), P('Act like a royal who has just discovered Wi-Fi.', 'Spiele einen König, der gerade WLAN entdeckt hat.'), P('Give a sports commentary for someone opening a bag of chips.', 'Kommentiere das Öffnen einer Chipstüte wie ein Sportreporter.'), P('Invent a handshake with the person to your left in 15 seconds.', 'Erfinde in 15 Sekunden einen Handschlag mit der Person links.'), P('Give an acceptance speech for the award “Best at Waiting for Downloads.”', 'Halte eine Dankesrede für den Preis „Beste Person beim Warten auf Downloads“.'), P('Imitate a robot trying to pass as human at a birthday party.', 'Imitiere einen Roboter, der sich auf einer Geburtstagsparty als Mensch ausgibt.')
        ],
        spectrum: [
            [P('Absolutely useless superpower', 'Völlig nutzlose Superkraft'), P('World-saving superpower', 'Weltrettende Superkraft')],
            [P('Worst possible pizza topping', 'Schlimmster Pizzabelag'), P('Best possible pizza topping', 'Bester Pizzabelag')],
            [P('Horrible place for a first date', 'Furchtbarer Ort fürs erste Date'), P('Perfect place for a first date', 'Perfekter Ort fürs erste Date')],
            [P('Untrustworthy mascot', 'Unglaubwürdiges Maskottchen'), P('Iconic mascot', 'Legendäres Maskottchen')],
            [P('Very minor inconvenience', 'Winzige Unannehmlichkeit'), P('Absolute catastrophe', 'Absolute Katastrophe')],
            [P('Worst superhero sidekick', 'Schlechtester Superhelden-Sidekick'), P('Best superhero sidekick', 'Bester Superhelden-Sidekick')],
            [P('Embarrassing entrance song', 'Peinlichster Auftrittssong'), P('Legendary entrance song', 'Legendärer Auftrittssong')],
            [P('Extremely boring museum', 'Extrem langweiliges Museum'), P('Most fascinating museum', 'Faszinierendstes Museum')],
            [P('Worst animal to be your boss', 'Schlimmstes Tier als Chef'), P('Best animal to be your boss', 'Bestes Tier als Chef')],
            [P('Terrible business idea', 'Furchtbare Geschäftsidee'), P('Brilliant business idea', 'Geniale Geschäftsidee')]
        ],
        undercover: [
            [P('Aquarium', 'Aquarium'), P('Zoo', 'Zoo')], [P('Library', 'Bibliothek'), P('Bookstore', 'Buchhandlung')],
            [P('Airport', 'Flughafen'), P('Train station', 'Bahnhof')], [P('Beach', 'Strand'), P('Pool', 'Schwimmbad')],
            [P('Bakery', 'Bäckerei'), P('Café', 'Café')], [P('Hotel', 'Hotel'), P('Hospital', 'Krankenhaus')],
            [P('Concert', 'Konzert'), P('Festival', 'Festival')], [P('School', 'Schule'), P('University', 'Universität')],
            [P('Cinema', 'Kino'), P('Theater', 'Theater')], [P('Museum', 'Museum'), P('Art gallery', 'Kunstgalerie')],
            [P('Taxi', 'Taxi'), P('Bus', 'Bus')], [P('Camping', 'Camping'), P('Hiking', 'Wandern')],
            [P('Chef', 'Koch'), P('Baker', 'Bäcker')], [P('Detective', 'Detektiv'), P('Police officer', 'Polizist')],
            [P('Wedding', 'Hochzeit'), P('Birthday party', 'Geburtstagsfeier')], [P('Elevator', 'Aufzug'), P('Escalator', 'Rolltreppe')],
            [P('Thunderstorm', 'Gewitter'), P('Snowstorm', 'Schneesturm')], [P('Microwave', 'Mikrowelle'), P('Oven', 'Backofen')]
        ],
        spyLocations: [P('Space station', 'Raumstation'), P('Aquarium', 'Aquarium'), P('Airport security', 'Flughafenkontrolle'), P('Wedding reception', 'Hochzeitsfeier'), P('Ski resort', 'Skigebiet'), P('University lecture', 'Uni-Vorlesung'), P('Pirate ship', 'Piratenschiff'), P('Luxury spa', 'Luxus-Spa'), P('Circus backstage', 'Zirkus hinter der Bühne'), P('Movie set', 'Filmset'), P('Submarine', 'U-Boot'), P('Dentist office', 'Zahnarztpraxis')],
        bad: [
            P('Your refrigerator joins the household group chat. What is its first message?', 'Dein Kühlschrank tritt der Haushaltsgruppe bei. Was ist seine erste Nachricht?'),
            P('What is the worst possible thing for a pilot to announce before landing?', 'Was wäre die schlimmste Durchsage eines Piloten kurz vor der Landung?'),
            P('Invent the least appealing luxury hotel amenity.', 'Erfinde die unattraktivste Luxus-Hotel-Ausstattung.'),
            P('What should never be the slogan of a dentist?', 'Was sollte niemals der Werbeslogan eines Zahnarztes sein?'),
            P('The world’s most useless supervillain reveals their evil plan. What is it?', 'Der nutzloseste Superschurke der Welt verkündet seinen bösen Plan. Wie lautet er?'),
            P('A restaurant only serves disappointment. What is the chef’s special?', 'Ein Restaurant serviert nur Enttäuschung. Was ist die Spezialität des Hauses?'),
            P('Write the warning label for an overconfident robot vacuum.', 'Schreibe den Warnhinweis für einen überheblichen Saugroboter.'),
            P('What is the worst possible first sentence at a job interview?', 'Was ist der schlimmste mögliche erste Satz bei einem Bewerbungsgespräch?'),
            P('Make up a motivational quote from a very tired pigeon.', 'Erfinde ein Motivationszitat einer sehr müden Taube.'),
            P('What is the worst feature for a new smartwatch?', 'Was ist die schlimmste Funktion einer neuen Smartwatch?'),
            P('An alien reviews Earth on a travel website. What is the one-star complaint?', 'Ein Alien bewertet die Erde auf einem Reiseportal. Was steht in der Ein-Stern-Bewertung?'),
            P('Name a subscription service that absolutely nobody asked for.', 'Erfinde einen Abo-Dienst, um den wirklich niemand gebeten hat.'),
            P('What should a fire alarm absolutely never say?', 'Was sollte ein Feueralarm auf keinen Fall sagen?'),
            P('What is the world’s worst icebreaker at a party?', 'Was ist der weltweit schlechteste Eisbrecher auf einer Party?'),
            P('The printer became self-aware. What are its first demands?', 'Der Drucker hat ein Bewusstsein entwickelt. Was fordert er zuerst?')
        ],
        who: [
            P('What is a completely useless talent you secretly have?', 'Welche völlig nutzlose Fähigkeit hast du heimlich?'),
            P('Describe your dream job badly in five words.', 'Beschreibe deinen Traumjob schlecht – in fünf Wörtern.'),
            P('What small inconvenience feels like a personal attack?', 'Welche Kleinigkeit fühlt sich für dich wie ein persönlicher Angriff an?'),
            P('What would your villain origin story be?', 'Was wäre der Auslöser deiner Bösewicht-Geschichte?'),
            P('What ridiculous object would you save first from your home?', 'Welchen lächerlichen Gegenstand würdest du zu Hause zuerst retten?'),
            P('What completely normal thing are you suspicious of?', 'Welcher völlig normalen Sache traust du nicht über den Weg?'),
            P('What would your autobiography be called?', 'Wie würde deine Autobiografie heißen?'),
            P('What is your most specific pet peeve?', 'Welche extrem spezielle Kleinigkeit nervt dich?')
        ],
        charades: [
            P('An astronaut with a hiccup', 'Ein Astronaut mit Schluckauf'), P('A penguin learning to skateboard', 'Ein Pinguin lernt Skateboardfahren'), P('A robot at a wedding', 'Ein Roboter auf einer Hochzeit'), P('A chef fighting invisible spaghetti', 'Ein Koch kämpft mit unsichtbaren Spaghetti'), P('A dramatic yoga instructor', 'Ein dramatischer Yogalehrer'), P('A cat trying to use a printer', 'Eine Katze versucht zu drucken'), P('A detective searching for lost keys', 'Ein Detektiv sucht verlorene Schlüssel'), P('A superhero stuck in an elevator', 'Ein Superheld steckt im Aufzug fest'), P('A confused airport security guard', 'Ein verwirrter Sicherheitsmitarbeiter am Flughafen'), P('A dinosaur using a smartphone', 'Ein Dinosaurier benutzt ein Smartphone'), P('An angry weather reporter', 'Ein wütender Wettermoderator'), P('A dentist afraid of teeth', 'Ein Zahnarzt mit Angst vor Zähnen'), P('An octopus playing drums', 'Ein Oktopus spielt Schlagzeug'), P('Someone assembling IKEA furniture', 'Jemand baut IKEA-Möbel auf'), P('A magician forgetting their trick', 'Ein Zauberer vergisst seinen Trick'), P('A bossy traffic light', 'Eine herrische Ampel'), P('A sleepy ninja', 'Ein müder Ninja'), P('A pigeon running a meeting', 'Eine Taube leitet ein Meeting'), P('A very proud vacuum cleaner', 'Ein sehr stolzer Staubsauger'), P('An influencer photographing soup', 'Ein Influencer fotografiert Suppe')
        ],
        taboo: [
            { w: P('Airport', 'Flughafen'), ban: [P('Plane', 'Flugzeug'), P('Travel', 'Reise'), P('Gate', 'Gate')] },
            { w: P('Birthday', 'Geburtstag'), ban: [P('Cake', 'Kuchen'), P('Party', 'Party'), P('Age', 'Alter')] },
            { w: P('Pizza', 'Pizza'), ban: [P('Cheese', 'Käse'), P('Italy', 'Italien'), P('Slice', 'Stück')] },
            { w: P('Penguin', 'Pinguin'), ban: [P('Bird', 'Vogel'), P('Ice', 'Eis'), P('Black', 'Schwarz')] },
            { w: P('Library', 'Bibliothek'), ban: [P('Book', 'Buch'), P('Read', 'Lesen'), P('Quiet', 'Leise')] },
            { w: P('Wi-Fi', 'WLAN'), ban: [P('Internet', 'Internet'), P('Password', 'Passwort'), P('Router', 'Router')] },
            { w: P('Dentist', 'Zahnarzt'), ban: [P('Teeth', 'Zähne'), P('Doctor', 'Arzt'), P('Pain', 'Schmerz')] },
            { w: P('Vacation', 'Urlaub'), ban: [P('Travel', 'Reisen'), P('Beach', 'Strand'), P('Holiday', 'Ferien')] },
            { w: P('Elevator', 'Aufzug'), ban: [P('Floor', 'Etage'), P('Up', 'Oben'), P('Building', 'Gebäude')] },
            { w: P('Museum', 'Museum'), ban: [P('Art', 'Kunst'), P('History', 'Geschichte'), P('Exhibition', 'Ausstellung')] },
            { w: P('Robot', 'Roboter'), ban: [P('Machine', 'Maschine'), P('AI', 'KI'), P('Metal', 'Metall')] },
            { w: P('Pancake', 'Pfannkuchen'), ban: [P('Breakfast', 'Frühstück'), P('Pan', 'Pfanne'), P('Syrup', 'Sirup')] },
            { w: P('Wedding', 'Hochzeit'), ban: [P('Marriage', 'Ehe'), P('Bride', 'Braut'), P('Ring', 'Ring')] },
            { w: P('Umbrella', 'Regenschirm'), ban: [P('Rain', 'Regen'), P('Wet', 'Nass'), P('Open', 'Öffnen')] },
            { w: P('Karaoke', 'Karaoke'), ban: [P('Sing', 'Singen'), P('Song', 'Lied'), P('Microphone', 'Mikrofon')] },
            { w: P('Superhero', 'Superheld'), ban: [P('Power', 'Kraft'), P('Save', 'Retten'), P('Cape', 'Umhang')] }
        ],
        storyStarts: [
            P('At 3 a.m., the office printer declared itself king.', 'Um drei Uhr morgens erklärte sich der Bürodrucker zum König.'),
            P('A mysterious package arrived with a note: “Please do not feed the moon.”', 'Ein rätselhaftes Paket kam mit dem Hinweis: „Bitte den Mond nicht füttern.“'),
            P('The train conductor announced an unscheduled stop: the year 3026.', 'Der Zugbegleiter kündigte einen ungeplanten Halt an: das Jahr 3026.'),
            P('Everyone at the party discovered they shared the same extremely strange dream.', 'Auf der Party merkten alle, dass sie denselben äußerst seltsamen Traum hatten.'),
            P('An ordinary houseplant sent its first email.', 'Eine gewöhnliche Zimmerpflanze verschickte ihre erste E-Mail.'),
            P('A village accidentally elected a goose as mayor.', 'Ein Dorf wählte versehentlich eine Gans zum Bürgermeister.')
        ],
        storyTwists: [
            P('Someone was secretly working for the villain all along.', 'Jemand arbeitete heimlich die ganze Zeit für den Bösewicht.'),
            P('A completely ordinary object becomes essential to the plot.', 'Ein völlig gewöhnlicher Gegenstand wird plötzlich entscheidend.'),
            P('The main character receives a very inconvenient superpower.', 'Die Hauptfigur erhält eine äußerst unpraktische Superkraft.'),
            P('A tiny misunderstanding causes international chaos.', 'Ein winziges Missverständnis löst internationales Chaos aus.'),
            P('Everything must now be explained by a suspicious narrator.', 'Ab jetzt muss alles ein verdächtiger Erzähler erklären.'),
            P('The villain turns out to be three raccoons in a coat.', 'Der Bösewicht entpuppt sich als drei Waschbären im Mantel.'),
            P('An innocent bystander has a very dramatic confession.', 'Ein Unbeteiligter macht ein äußerst dramatisches Geständnis.'),
            P('Something important has been replaced by a potato.', 'Etwas Wichtiges wurde durch eine Kartoffel ersetzt.')
        ],
        pitchThings: [P('Umbrella', 'Regenschirm'), P('Toaster', 'Toaster'), P('Socks', 'Socken'), P('Chair', 'Stuhl'), P('Fridge', 'Kühlschrank'), P('Backpack', 'Rucksack'), P('Spoon', 'Löffel'), P('Alarm clock', 'Wecker'), P('Shoelace', 'Schnürsenkel'), P('Remote control', 'Fernbedienung'), P('Vacuum', 'Staubsauger'), P('Pillow', 'Kissen')],
        pitchProblems: [P('is afraid of sunlight', 'hat Angst vor Sonnenlicht'), P('only works on Tuesdays', 'funktioniert nur dienstags'), P('gives unrequested advice', 'gibt ungefragt Ratschläge'), P('is extremely dramatic', 'ist unglaublich dramatisch'), P('has a secret identity', 'hat eine Geheimidentität'), P('requires a subscription', 'braucht ein Abo'), P('speaks in riddles', 'spricht in Rätseln'), P('has an attitude problem', 'hat ein Einstellungsproblem')],
        whisper: [
            P('The sleepy penguin stole my disco pineapple.', 'Der schläfrige Pinguin klaute meine Disco-Ananas.'),
            P('Seven tiny detectives interrogated the vacuum cleaner.', 'Sieben winzige Detektive verhörten den Staubsauger.'),
            P('My grandmother secretly manages a dragon bakery.', 'Meine Oma leitet heimlich eine Drachenbäckerei.'),
            P('The moon ordered three pizzas and a bicycle.', 'Der Mond bestellte drei Pizzen und ein Fahrrad.'),
            P('A serious potato is running for president of the fridge.', 'Eine seriöse Kartoffel kandidiert als Kühlschrankpräsidentin.'),
            P('The elevator refuses to move without a compliment.', 'Der Aufzug fährt nur, wenn man ihm ein Kompliment macht.'),
            P('Five suspicious squirrels founded a jazz orchestra.', 'Fünf verdächtige Eichhörnchen gründeten ein Jazzorchester.'),
            P('Someone taught the office printer to speak Latin.', 'Jemand hat dem Bürodrucker Latein beigebracht.')
        ]
    };
})();

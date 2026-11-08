(() => {
    'use strict';
    const D = window.PARTY_DATA, E = window.CHAOS_EXTRA, root = document.getElementById('app');
    const B = (en, de) => ({ en, de }), esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const dict = {
        en: { play: 'Play now', surprise: 'Surprise me', games: 'games', all: 'All games', social: 'Social', secrets: 'Secrets', creative: 'Creative', party: 'Party & drinks', favorites: 'Favorites', find: 'Find a game…', player: 'Player', players: 'players', setup: 'Players & settings', how: 'How to play', lang: 'Language', sound: 'Sound', tone: 'Content', standard: 'Party', clean: 'Clean', adult: 'After Dark (18+)', start: 'Start', next: 'Next', done: 'Done', skip: 'Skip', again: 'Play again', change: 'Change game', back: 'All games', reveal: 'Reveal', hide: 'Hide & pass', ready: 'I’m ready', pass: 'Pass the phone to', vote: 'Vote', finish: 'Finish', results: 'Results', round: 'Round', score: 'Score', scoreboard: 'Scoreboard', winner: 'Winner', tie: 'Tie', none: 'Nobody scores', yes: 'Yes', no: 'No', correct: 'Correct', wrong: 'Not quite', confirm: 'Confirm', cancel: 'Cancel', question: 'Question', secret: 'Private card', privacy: 'Only this person should look at the screen.', restart: 'New round', timer: 'Timer', seconds: 'seconds', prompt: 'Prompt', selected: 'Selected', select: 'Select', first: 'First', second: 'Second', speaker: 'Speaker', thinking: 'Time to think', home: 'Home', retry: 'Another prompt', empty: 'No matching games', more: 'More games', optional: 'Optional', offline: 'One-device edition · No account · Works offline', sober: 'Participation never requires alcohol.', instructions: 'Rules', example: 'Example', safety: 'No drinking penalties. Anyone can skip.', finishRound: 'Show results', playerCount: 'Number of players', quick: 'Quick start', vibe: 'Pick a game. Start in seconds.', group: 'Your group', favoritesOnly: 'Favorites', category: 'Category', passOn: 'Next person', turn: 'Turn', noScore: 'No scores', complete: 'Completed', claim: 'Claim mission', decline: 'Skip question', nextRound: 'Next round', remaining: 'remaining', gameOver: 'Finished', choose: 'Choose', clear: 'Clear', guess: 'Guess', unknown: 'Unknown', noRoom: 'Online multiplayer needs a hosted server. This downloaded version is one-phone pass & play.', cards: 'cards', end: 'End game', discuss: 'Discuss together, then continue.', point: 'Point together on three.', waiting: 'Pass to the next player', shuffle: 'Shuffle', reset: 'Reset', apply: 'Save', limits: 'Best with 4–6 friends', yesConsent: 'Both agree to reveal', silent: 'Sound off', soundOn: 'Sound on' },
        de: { play: 'Jetzt spielen', surprise: 'Überrasch mich', games: 'Spiele', all: 'Alle Spiele', social: 'Social', secrets: 'Geheimnisse', creative: 'Kreativ', party: 'Party & Drinks', favorites: 'Favoriten', find: 'Spiel suchen …', player: 'Spieler', players: 'Personen', setup: 'Spieler & Einstellungen', how: 'Spielregeln', lang: 'Sprache', sound: 'Ton', tone: 'Inhalte', standard: 'Party', clean: 'Harmlos', adult: 'Ab 18', start: 'Starten', next: 'Weiter', done: 'Fertig', skip: 'Überspringen', again: 'Nochmal spielen', change: 'Anderes Spiel', back: 'Alle Spiele', reveal: 'Aufdecken', hide: 'Verbergen & weitergeben', ready: 'Ich bin bereit', pass: 'Gib das Handy an', vote: 'Abstimmen', finish: 'Beenden', results: 'Ergebnis', round: 'Runde', score: 'Punkte', scoreboard: 'Punktestand', winner: 'Gewinner', tie: 'Gleichstand', none: 'Keine Punkte', yes: 'Ja', no: 'Nein', correct: 'Richtig', wrong: 'Nicht ganz', confirm: 'Bestätigen', cancel: 'Abbrechen', question: 'Frage', secret: 'Geheime Karte', privacy: 'Nur diese Person darf den Bildschirm sehen.', restart: 'Neue Runde', timer: 'Timer', seconds: 'Sekunden', prompt: 'Frage', selected: 'Ausgewählt', select: 'Wählen', first: 'Erste', second: 'Zweite', speaker: 'Person am Zug', thinking: 'Bedenkzeit', home: 'Startseite', retry: 'Andere Frage', empty: 'Keine passenden Spiele', more: 'Weitere Spiele', optional: 'Optional', offline: 'Ein-Handy-Version · Ohne Konto · Offline', sober: 'Mitmachen geht immer ohne Alkohol.', instructions: 'Regeln', example: 'Beispiel', safety: 'Keine Trinkstrafen. Alle dürfen passen.', finishRound: 'Ergebnis anzeigen', playerCount: 'Spieleranzahl', quick: 'Sofort loslegen', vibe: 'Spiel auswählen. Direkt loslegen.', group: 'Eure Gruppe', favoritesOnly: 'Favoriten', category: 'Kategorie', passOn: 'Nächste Person', turn: 'Zug', noScore: 'Keine Punkte', complete: 'Abgeschlossen', claim: 'Mission melden', decline: 'Frage überspringen', nextRound: 'Nächste Runde', remaining: 'übrig', gameOver: 'Fertig', choose: 'Auswählen', clear: 'Leeren', guess: 'Raten', unknown: 'Unbekannt', noRoom: 'Online-Multiplayer benötigt einen Server. Die heruntergeladene Version ist für ein gemeinsames Handy.', cards: 'Karten', end: 'Spiel beenden', discuss: 'Sprecht miteinander und macht dann weiter.', point: 'Zeigt gleichzeitig auf drei.', waiting: 'An die nächste Person weitergeben', shuffle: 'Mischen', reset: 'Zurücksetzen', apply: 'Speichern', limits: 'Am besten mit 4–6 Freunden', yesConsent: 'Beide stimmen der Aufdeckung zu', silent: 'Ton aus', soundOn: 'Ton an' }
    };
    const catalog = [
        ['roulette', 'social', '🎲', 'Party Roulette', 'Party-Roulette', 'Funny questions, dares and nominations', 'Lustige Fragen, Aktionen und Abstimmungen', 2, 12, 'deck'],
        ['majority', 'social', '🗳️', 'Majority Madness', 'Mehrheits-Madness', 'Predict how your friends will vote', 'Sag die Entscheidung der Gruppe voraus', 3, 10, 'majority'],
        ['most', 'social', '👀', 'Most Likely To', 'Wer würde eher …', 'Point at the friend who fits', 'Zeigt auf die passende Person', 3, 12, 'deck'],
        ['spectrum', 'social', '🌈', 'The Spectrum', 'Das Spektrum', 'Give a clue for a secret number', 'Gebt Hinweise auf eine geheime Zahl', 3, 10, 'spectrum'],
        ['paranoia', 'social', '🤫', 'Paranoia', 'Flüsterwahl', 'A secret question, a public answer', 'Geheime Frage, öffentliche Antwort', 4, 8, 'paranoia'],
        ['same', 'social', '🧠', 'Same Brain', 'Gleich gedacht', 'Try to say the same answer', 'Versucht, dieselbe Antwort zu geben', 3, 10, 'same'],
        ['know', 'social', '💜', 'Who Knows Me?', 'Wer kennt mich?', 'Guess a friend’s preferences', 'Errate die Vorlieben deiner Freunde', 3, 10, 'know'],
        ['rank', 'social', '📊', 'Guess the Ranking', 'Errate die Reihenfolge', 'Read a friend’s mind', 'Errate die Reihenfolge deiner Freunde', 3, 8, 'rank'],
        ['hot', 'social', '⚖️', 'Hot Take Jury', 'Hot-Take-Gericht', 'Defend an outrageous opinion', 'Verteidige eine absurde Meinung', 3, 8, 'hot'],
        ['redflag', 'social', '🚩', 'Red Flag, Green Flag', 'Red Flag, Green Flag', 'Would you accept this fictional person?', 'Würdet ihr diese fiktive Person akzeptieren?', 3, 10, 'deck'],
        ['undercover', 'secrets', '🕵️', 'Undercover', 'Undercover', 'Find the person with the different word', 'Findet die Person mit dem anderen Wort', 4, 10, 'roles'],
        ['spy', 'secrets', '📍', 'Find the Spy', 'Findet den Spion', 'Who has no idea where you are?', 'Wer kennt euren geheimen Ort nicht?', 4, 10, 'roles'],
        ['bluff', 'secrets', '🤥', 'Bluff Factory', 'Bluff-Fabrik', 'Invent believable answers to real facts', 'Erfindet glaubwürdige Antworten auf Fakten', 3, 8, 'bluff'],
        ['who', 'secrets', '📝', 'Who Said That?', 'Wer war das?', 'Guess the author of anonymous answers', 'Errate, wer die anonyme Antwort schrieb', 4, 8, 'who'],
        ['confession', 'secrets', '🎭', 'Confession or Fiction', 'Wahr oder erfunden', 'A convincing story: true or invented?', 'Echte Geschichte oder frei erfunden?', 3, 8, 'confession'],
        ['mimic', 'secrets', '🫣', 'The Mimic', 'Der Mitmacher', 'Copy the group without knowing the task', 'Mach mit, ohne die Aufgabe zu kennen', 4, 8, 'roles'],
        ['missions', 'secrets', '🎯', 'Secret Missions', 'Geheime Missionen', 'Complete a goal without getting caught', 'Erfülle heimlich ein harmloses Ziel', 4, 8, 'missions'],
        ['bad', 'creative', '😂', 'Bad Answers', 'Schlechte Antworten', 'Write ridiculous answers and vote', 'Erfindet witzige Antworten und stimmt ab', 3, 8, 'bad'],
        ['charades', 'creative', '🎬', 'Charades Chaos', 'Pantomime-Chaos', 'Act it out for your team', 'Spiele Begriffe pantomimisch vor', 4, 10, 'perform'],
        ['taboo', 'creative', '🚫', 'Forbidden Words', 'Verbotene Wörter', 'Describe without the forbidden clues', 'Erkläre ohne verbotene Wörter', 4, 10, 'perform'],
        ['story', 'creative', '📖', 'Plot Twist', 'Plot-Twist', 'Create a story with random twists', 'Erzählt gemeinsam mit wilden Wendungen', 3, 8, 'story'],
        ['pitch', 'creative', '💸', 'Terrible Pitch', 'Furchtbarer Pitch', 'Sell the worst product ever', 'Verkaufe ein katastrophales Produkt', 3, 8, 'pitch'],
        ['whisper', 'creative', '🗣️', 'Whisper Disaster', 'Flüster-Desaster', 'How badly can a sentence change?', 'Wie sehr verändert sich ein Satz?', 4, 10, 'whisper'],
        ['three', 'creative', '🎪', 'Three-Round Madness', 'Drei-Runden-Chaos', 'Describe, one word, then act', 'Erklären, ein Wort, dann Pantomime', 4, 8, 'three'],
        ['expert', 'creative', '🎓', 'Fake Expert', 'Experten-Bluff', 'Lecture confidently about nonsense', 'Doziere selbstbewusst über Unsinn', 3, 8, 'expert'],
        ['draw', 'creative', '🎨', 'Draw & Destroy', 'Zeichnen & Zerlegen', 'Write, draw, describe, and reveal', 'Schreiben, zeichnen, beschreiben, aufdecken', 4, 8, 'draw'],
        ['never', 'party', '🙋', 'Never Have I Ever', 'Ich hab noch nie', 'Stories and familiar confessions', 'Erlebnisse und lustige Geständnisse', 3, 12, 'deck'],
        ['truth', 'party', '🔥', 'Truth or Dare', 'Wahrheit oder Pflicht', 'Questions and harmless challenges', 'Fragen und harmlose Mutproben', 3, 10, 'truth'],
        ['sip', 'party', '🥂', 'Sip If…', 'Trink, wenn …', 'Opt-in drink or simply say yes', 'Freiwillig nippen oder einfach Ja sagen', 3, 12, 'deck'],
        ['kings', 'party', '🃏', 'King’s Deck', 'Königsdeck', '52 cards with 13 different rank-based group rules', '52 Karten mit 13 verschiedenen Aktionen nach Kartenwert', 3, 10, 'kings'],
        ['house', 'party', '👑', 'House Rules', 'Hausregeln', 'Add short, silly party rules', 'Aktiviert kurze lustige Hausregeln', 3, 10, 'house'],
        ['bingo', 'party', '🎉', 'Cheers Bingo', 'Party-Bingo', 'Spot nine real party moments', 'Entdeckt neun Partymomente', 4, 10, 'bingo'],
        ['toast', 'party', '🍾', 'Toast Battle', 'Trinkspruch-Duell', 'Compete with ridiculous toasts', 'Messt euch mit absurden Trinksprüchen', 3, 10, 'toast'],
        ['last', 'party', '🌙', 'Last Call Questions', 'Letzte-Runde-Fragen', 'Five, ten or fifteen rapid questions', 'Fünf, zehn oder fünfzehn kurze Fragen', 3, 10, 'last']
    ].map(([id, cat, icon, en, de, descEn, descDe, min, max, kind]) => ({ id, cat, icon, en, de, descEn, descDe, min, max, kind }));
    catalog.unshift(
        {id:'partydeck24',cat:'party',icon:'🪩',en:'Party Deck',de:'Party-Deck',descEn:'Mix social cards and challenges for 5–60 minutes',descDe:'Fragen, Abstimmungen und Aktionen für lange Runden',min:2,max:12,kind:'partydeck24'},
        {id:'kingsnight24',cat:'party',icon:'🃏',en:'King’s Night',de:'Königsnacht',descEn:'52 cards, evolving group rules and challenges',descDe:'52 Karten, wechselnde Hausregeln und Aktionen',min:3,max:12,kind:'kingsnight24'}
    );
    catalog.unshift(
        {id:'socialradar26',cat:'social',icon:'💬',en:'Social Radar',de:'Social Radar',descEn:'Prediction and group mind-reading across rounds',descDe:'Gruppenmeinungen und Einschätzungen über mehrere Runden',min:4,max:6,kind:'socialradar26'},
        {id:'comedybattle26',cat:'creative',icon:'😂',en:'Comedy Battle',de:'Comedy-Battle',descEn:'Two performers, fair votes and rotating challenges',descDe:'Zwei Personen, faire Abstimmungen, wechselnde Aufgaben',min:4,max:6,kind:'comedybattle26'},
        {id:'bluffclub26',cat:'secrets',icon:'🤫',en:'Bluff Club',de:'Bluff-Club',descEn:'True or fake stories and group interrogation',descDe:'Wahre und erfundene Geschichten mit Nachfragen',min:4,max:6,kind:'bluffclub26'},
        {id:'impostornight25',cat:'secrets',icon:'🕵️',en:'Impostor Night',de:'Impostor-Nacht',descEn:'Undercover, Spy and Mimic across full matches',descDe:'Undercover, Spion und Mitmacher als ganze Match-Serie',min:4,max:12,kind:'impostornight25'},
        {id:'teamshowdown25',cat:'creative',icon:'🎭',en:'Team Showdown',de:'Team-Duell',descEn:'Teams compete across escalating clue stages',descDe:'Teamwettkampf mit wechselnden Hinweisregeln',min:4,max:12,kind:'teamshowdown25'}
    );
    const familyCatalog=[
        {id:'partydeck24',icon:'🪩',en:'Party Deck',de:'Party-Deck',descEn:'Social cards, confessions, choices and challenges',descDe:'Fragen, Geständnisse, Entscheidungen und Aktionen',live:true},
        {id:'kingsnight24',icon:'🃏',en:'King’s Night',de:'Königsnacht',descEn:'A changing card game for the whole table',descDe:'Ein lebendiges Kartenspiel für die ganze Runde',live:true},
        {id:'impostornight25',icon:'🕵️',en:'Impostor Night',de:'Impostor-Nacht',descEn:'Rotating hidden roles, match scoring and variants',descDe:'Geheime Rollen, mehrere Matches und Varianten',live:true},
        {id:'teamshowdown25',icon:'🎭',en:'Team Showdown',de:'Team-Duell',descEn:'Describe, taboo and act across escalating stages',descDe:'Erklären, Tabu und Pantomime über mehrere Phasen',live:true},
        {id:'socialradar26',icon:'💬',en:'Social Radar',de:'Social Radar',descEn:'Predict your friends across full group rounds',descDe:'Sagt die Entscheidungen eurer Freunde voraus',live:true},
        {id:'comedybattle26',icon:'😂',en:'Comedy Battle',de:'Comedy-Battle',descEn:'Funny answers, improvisation and fair audience votes',descDe:'Pointen, Impro und faire Publikumsabstimmungen',live:true},
        {id:'bluffclub26',icon:'🤫',en:'Bluff Club',de:'Bluff-Club',descEn:'Stories, truth or fiction and convincing lies',descDe:'Geschichten, Wahrheit und glaubwürdige Lügen',live:true}
    ];
    let familyFilter=null,libraryOpen=false;
    let prefs = { lang: 'en', players: Array(6).fill(''), tone: 'party', sound: false, favs: [] };
    try {
        const v = JSON.parse(localStorage.getItem('chaosclub.23') || localStorage.getItem('chaosclub.22') || 'null');
        if (v)
            prefs = { ...prefs, lang: v.lang === 'de' ? 'de' : 'en', tone: ['clean', 'party', 'adult'].includes(v.tone) ? v.tone : 'party', sound: !!v.sound, favs: Array.isArray(v.favs) ? v.favs : [], players: Array(Math.min(12, Math.max(2, Number(v.playerCount) || 6))).fill('') };
    }
    catch { }
    let gameId = null, s = null, filter = 'all', search = '', modal = null, elapsedTimer = null, notice = '', modalReturn = null;
    const srStatus = document.createElement('div');
    srStatus.className = 'sr-only';
    srStatus.setAttribute('role', 'status');
    srStatus.setAttribute('aria-live', 'polite');
    document.body.appendChild(srStatus);
    const T = k => (dict[prefs.lang][k] || k), L = () => prefs.lang, tx = x => (x?.[L()] ?? x?.en ?? (typeof x === 'string' ? x : '')), gp = i => prefs.players[i]?.trim() || `${T('player')} ${i + 1}`, n = () => prefs.players.length;
    const save = () => { try {
        localStorage.setItem('chaosclub.23', JSON.stringify({ lang: prefs.lang, playerCount: n(), tone: prefs.tone, sound: prefs.sound, favs: prefs.favs }));
    }
    catch { } }, g = () => catalog.find(x => x.id === gameId), sample = (a) => a[Math.floor(Math.random() * a.length)], mix = a => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [r[i], r[j]] = [r[j], r[i]];
    } return r; }, btn = (action, label, style = 'primary', props = '') => `<button class="btn ${style}" data-act="${esc(action)}" ${props}>${label}</button>`, options = (items, action, sel) => `<div class="options">${items.map((it, i) => action === 'noop' ? `<div class="option option-static">${esc(tx(it))}</div>` : `<button class="option ${sel === i ? 'selected' : ''}" data-act="${action}" data-val="${i}">${esc(tx(it))}</button>`).join('')}</div>`, act = (...x) => `<div class="actions">${x.join('')}</div>`, tag = x => `<p class="round-label">${esc(x)}</p>`, prompt = (x, small = false) => `<h2 class="prompt ${small ? 'small' : ''}">${esc(tx(x))}</h2>`, muted = x => `<p class="subtext">${esc(x)}</p>`, scores = () => `<div class="scores">${s.points.map((p, i) => `<div class="score"><span>${esc(gameId === 'charades' || gameId === 'taboo' || gameId === 'three' ? tx(B('Team', 'Team')) + ' ' + (i + 1) : gameId === 'spectrum' ? T('group') : gp(i))}</span><strong>${p} ${T('score')}</strong></div>`).join('')}</div>`, card = (x) => `<section class="play-card ${g().cat}">${x}</section>`, step = () => `${T('round')} ${s.round + 1}`, dedupe = {};
    let recent = {};
    try {
        const h = JSON.parse(localStorage.getItem('chaosclub.23.recent') || localStorage.getItem('chaosclub.22.recent') || '{}');
        if (h && typeof h === 'object')
            recent = h;
    }
    catch { }
    function draw(key) {
        const arr = content(key);
        if (!arr.length)
            return null;
        const used = dedupe[key] || (dedupe[key] = []), seen = recent[key] || [];
        let eligible = arr.map((item, i) => ({ item, i, id: JSON.stringify(item) })).filter(x => !used.includes(x.i) && !seen.includes(x.id));
        if (!eligible.length) {
            used.length = 0;
            eligible = arr.map((item, i) => ({ item, i, id: JSON.stringify(item) })).filter(x => !seen.includes(x.id));
        }
        if (!eligible.length)
            eligible = arr.map((item, i) => ({ item, i, id: JSON.stringify(item) }));
        const chosen = sample(eligible);
        used.push(chosen.i);
        recent[key] = [...seen.filter(x => x !== chosen.id), chosen.id].slice(-Math.min(12, Math.max(2, Math.floor(arr.length / 2))));
        try {
            localStorage.setItem('chaosclub.23.recent', JSON.stringify(recent));
        }
        catch { }
        return chosen.item;
    }
    function content(key) {
        const base = D[key] || [], fresh = E[key] || [];
        // Choose the edited party catalogue when it has enough variety; keep the lighter originals in Clean.
        let pool = prefs.tone === 'clean' ? (base.length ? base : fresh) : fresh.length >= 10 ? fresh : [...base, ...fresh];
        if (prefs.tone === 'adult' && Array.isArray(E.adult?.[key]))
            pool = [...pool, ...E.adult[key]];
        return pool;
    }
    function beep(freq = 660, duration = .08) { if (!prefs.sound)
        return; try {
        const c = new (window.AudioContext || window.webkitAudioContext)(), o = c.createOscillator(), v = c.createGain();
        o.type = 'sine';
        o.frequency.value = freq;
        v.gain.setValueAtTime(.026, c.currentTime);
        v.gain.exponentialRampToValueAtTime(.001, c.currentTime + duration);
        o.connect(v);
        v.connect(c.destination);
        o.start();
        o.stop(c.currentTime + duration);
        setTimeout(() => c.close(), 300);
    }
    catch { } }
    function resetTimers() { if (elapsedTimer)
        clearInterval(elapsedTimer); elapsedTimer = null; }
    function startGame(id) { resetTimers(); if(deepIds.includes(id) && deepSessions[id] && deepSessions[id].stage!=='end'){
        gameId=id;s=deepSessions[id];if(id==='teamshowdown25'&&s.stage==='active')pauseTeam25();drawScreen();return;
    } if (id === 'missions' && missionState && missionState.stage !== 'finished') {
        gameId = id;
        s = missionState;
        drawScreen();
        return;
    } if (id === 'bingo' && bingoState) { gameId = id; s = bingoState; drawScreen(); return; } gameId = id; notice = ''; s = { stage: 'start', round: 0, i: 0, idx: 0, points: Array(n()).fill(0), player: 0, answer: null, choice: null, data: null, history: [], votes: [], num: 0, limit: 5, phase: 0, targets: [], entries: [], mode: 'spoken' }; initGame(); if (id === 'missions') missionState = s; if (id === 'bingo') bingoState = s; drawScreen(); }
    function initGame() { let k = g().kind; if(deepIds.includes(gameId)){deepInit();return;} s.data = null; s.stage = 'play'; if (k === 'deck')
        s.data = draw(gameId === 'last' ? 'last' : gameId === 'sip' ? 'sip' : gameId === 'redflag' ? 'redflag' : gameId); if (k === 'majority')
        s.data = draw('majority'), s.stage = 'forecast'; if (k === 'spectrum')
        s.data = draw('spectrum'), s.secret = Math.floor(Math.random() * 11), s.guess = 5, s.points = [0], s.stage = 'cover'; if (k === 'paranoia')
        s.data = draw('paranoia'), s.stage = 'cover'; if (k === 'same')
        s.data = draw('same'), s.stage = 'think'; if (k === 'know')
        s.data = draw('know'), s.stage = 'cover'; if (k === 'rank')
        s.data = draw('rank'), s.order = [0, 1, 2, 3], s.stage = 'cover'; if (k === 'hot')
        s.data = draw('hot'), s.stage = 'talk'; if (k === 'roles') {
        s.candidates = Array.from({ length: n() }, (_, i) => i);
        s.roleVotes = Array(n()).fill(0);
        s.abstentions = 0;
        s.runoff = 0;
        s.undercover = Math.floor(Math.random() * n());
        s.word = gameId === 'undercover' ? draw('undercover') : gameId === 'spy' ? draw('spyLocations') : draw('mimic');
        s.stage = 'cover';
        s.player = 0;
        s.votes = [];
        s.spyGuess = '';
    } if (k === 'bluff')
        s.data = draw('bluffFacts'), s.stage = 'cover'; if (k === 'who')
        s.data = draw('who'), s.entries = [], s.stage = 'cover', s.player = 0; if (k === 'confession')
        s.data = draw('storyTheme'), s.stage = 'choose', s.person = 0; if (k === 'missions') {
        s.targets = mix(E.missions).slice(0, n());
        s.stage = 'cover';
        s.player = 0;
        s.claims = [];
        s.usedMissions = [...s.targets];
    } if (k === 'bad')
        s.data = draw('bad'), s.stage = 'style', s.entries = [], s.points = Array(n()).fill(0), s.round = 0; if (k === 'perform')
        s.stage = 'cover', s.turn = 0, s.points = [0, 0], s.data = draw(gameId === 'taboo' ? 'taboo' : 'charades'), s.secs = 45, s.passed = 0; if (k === 'story')
        s.data = draw('storyStarts'), s.phase = 0; if (k === 'pitch')
        s.stage = 'show', s.player = 0, s.data = getPitch(); if (k === 'whisper')
        s.stage = 'cover', s.player = 0, s.data = draw('whisper'); if (k === 'three')
        s.stage = 'cover', s.ph = 0, s.deck = mix(E.three).slice(0, 8), s.todo = [...s.deck], s.team = 0, s.points = [0, 0], s.turn = 0, s.current = null; if (k === 'expert')
        s.data = draw('expert'), s.stage = 'prep', s.player = 0; if (k === 'draw')
        s.stage = 'write', s.player = 0, s.frames = [], s.phase = 0, s.text = ''; if (k === 'truth')
        s.stage = 'choose', s.player = 0; if (k === 'kings')
        s.deck = mix(['♠', '♥', '♦', '♣'].flatMap(suit => Array.from({ length: 13 }, (_, i) => ({ rank: i + 1, suit })))), s.stage = 'draw'; if (k === 'house')
        s.stage = 'rules'; if (k === 'bingo')
        s.board = mix(E.bingo).slice(0, 9), s.mark = Array(9).fill(false), s.stage = 'board'; if (k === 'toast')
        s.data = draw('toast'), s.stage = 'show', s.round = 0, s.total = n() % 2 ? n() : n() / 2, s.points = Array(n()).fill(0), s.results = []; if (k === 'last')
        s.stage = 'chooseLength', s.limit = 5; }
    function getPitch() { const things = D.pitchThings || [], problems = D.pitchProblems || []; return [sample(things), sample(problems)]; }
    function rules() {
        const map = {
            roulette: B('Read the card aloud. Everyone responds; tap Next whenever you want.', 'Lest die Karte vor. Alle machen mit. Weiter, wenn ihr möchtet.'), majority: B('One Forecaster privately chooses A or B. Everyone else votes publicly. Reveal the result; rotate Forecaster.', 'Eine Person tippt heimlich auf A oder B. Alle anderen stimmen sichtbar ab. Ergebnis zeigen, dann wechseln.'), most: B('Read the question. On three, everyone points at one friend.', 'Frage vorlesen. Auf drei zeigen alle auf eine Person.'), spectrum: B('Clue-giver sees a secret 0–10 target and gives a clue. Group guesses; closer means more points.', 'Eine Person sieht heimlich eine Zahl von 0 bis 10 und gibt einen Hinweis. Die Gruppe rät.'), paranoia: B('Read privately, whisper the question to your neighbor. They name someone aloud. Reveal only if both agree.', 'Lies heimlich die Frage und flüstere sie dem Nachbarn zu. Dieser nennt jemanden. Nur mit Einverständnis aufdecken.'), same: B('Think for five seconds, then everyone shouts one answer together. Compare matches.', 'Fünf Sekunden nachdenken, dann rufen alle gleichzeitig eine Antwort. Vergleicht, wer gleich denkt.'), know: B('Featured player privately chooses an answer. Everyone predicts out loud, then reveal and rotate. No automatic scoring.', 'Person am Zug wählt eine Antwort heimlich. Alle anderen raten, dann aufdecken und wechseln.'), rank: B('Featured person secretly ranks four items. Everyone guesses the first and last out loud. No automatic scoring.', 'Die Person am Zug sortiert vier Dinge heimlich. Alle anderen raten Platz 1 und 4.'), hot: B('Speak for 30 seconds in favor of the opinion; take two questions. Everyone votes convinced or not.', 'Verteidige eine Meinung 30 Sekunden, beantworte zwei Fragen. Dann stimmen alle ab.'), redflag: B('Read the fictional profile. Everyone calls Red or Green and explains why.', 'Lest das fiktive Profil. Alle rufen Rot oder Grün und begründen.'), undercover: B('Each player privately sees a word; one gets a related word. Give one clue each, then count the group vote aloud. One runoff breaks ties.', 'Alle lesen heimlich ihr Wort, eine Person hat ein ähnliches Wort. Gebt je einen Hinweis, diskutiert und beschuldigt eine Person.'), spy: B('Everyone except the spy knows the location. Ask questions, count the group vote aloud, then let the spy guess the location.', 'Alle außer dem Spion kennen den Ort. Stellt Fragen und findet den Spion.'), mimic: B('Everyone except the Mimic learns three actions. Perform them together, then tally the group vote aloud.', 'Alle außer dem Mitmacher merken sich drei Aktionen. Führt sie gleichzeitig aus und enttarnt den Mitmacher.'), bluff: B('Oral bluff: one person privately reads the fact, others invent false answers aloud, and a designated guesser chooses. No automatic scoring.', 'Eine Person liest die richtige Antwort heimlich. Andere erfinden falsche Antworten. Ein Ratender sucht die Wahrheit.'), who: B('Everyone writes one answer while passing the phone. Guess authors aloud before revealing. No automatic scoring.', 'Alle schreiben nacheinander heimlich eine Antwort. Deckt die Antworten gemischt auf und erratet die Autoren.'), confession: B('Tell a true or fictional 30-second story. Others ask two questions and vote aloud. Storyteller earns 2 points for fooling the majority.', 'Erzähle in 30 Sekunden eine echte oder erfundene Geschichte. Zwei Nachfragen, Abstimmung, Auflösung.'), missions: B('Privately accept a goal and complete it naturally in conversation. Claim it when done; friends verify.', 'Nimm heimlich eine Aufgabe an. Erfülle sie unauffällig und lass den Erfolg bestätigen.'), bad: B('Speak funny answers aloud instantly, or write them privately for anonymous voting.', 'Antwortet sofort laut und lustig, oder schreibt anonym und stimmt anschließend ab.'), charades: B('Two teams take turns. Actor sees the card, acts silently; each correct guess scores a point.', 'Zwei Teams wechseln sich ab. Eine Person spielt ohne Worte, jeder erratene Begriff bringt einen Punkt.'), taboo: B('Two teams alternate. Describe the target without saying it or the forbidden words.', 'Zwei Teams wechseln sich ab. Erklärt den Begriff, ohne Ziel- oder Tabuwörter zu sagen.'), story: B('Go around the group. Each adds up to two sentences. A twist appears after every second contribution.', 'Geht reihum. Jede Person ergänzt maximal zwei Sätze. Nach jedem zweiten Zug kommt ein Twist.'), pitch: B('You have ten seconds to prepare, then pitch a terrible product for 30 seconds. Audience votes Buy or Pass.', 'Zehn Sekunden planen, dann 30 Sekunden ein schlechtes Produkt verkaufen. Publikum entscheidet: Kaufen oder Nicht.'), whisper: B('First player reads a sentence privately and whispers it once. Pass it around; compare the final sentence with the original.', 'Erste Person liest heimlich einen Satz und flüstert ihn weiter. Vergleicht am Ende mit dem Original.'), three: B('Two teams guess eight repeated cards: first describing freely, then with one word, finally acting.', 'Zwei Teams erraten dieselben acht Karten: erst frei erklären, dann nur ein Wort, dann pantomimisch.'), expert: B('Prepare ten seconds, then lecture for 30 seconds about a fictional topic using three required words.', 'Zehn Sekunden vorbereiten, dann 30 Sekunden über ein erfundenes Thema reden und drei Wörter einbauen.'), draw: B('Pass the phone for one contribution per player: write, draw, describe, and repeat. Reveal the full chain at the end.', 'Eine Person schreibt, die nächste zeichnet, die nächste beschreibt. Vier Umwandlungen, dann alle Ergebnisse zeigen.'), never: B('Read the statement. Anyone who relates can indicate it, with an optional story.', 'Aussage vorlesen. Wer sich wiedererkennt, kann es zeigen und freiwillig erzählen.'), truth: B('Player chooses Truth or Challenge, answers/performs or skips, then passes to the next.', 'Person wählt Wahrheit oder Pflicht, antwortet oder macht die Aktion – oder passt.'), sip: B('Read the statement. Anyone who relates may sip their chosen drink or just say yes.', 'Lest die Aussage. Wer sich wiedererkennt, kann freiwillig nippen oder einfach Ja sagen.'), kings: B('Draw from a 52-card deck. Each rank gives a short original group challenge. Skip freely; stop any time.', 'Zieht eine Karte. Jeder Kartenwert steht für eine Gruppenaktion. Spielen oder überspringen, dann nächste Karte.'), house: B('Activate up to three silly rules. They remain visible until you remove them.', 'Aktiviert bis zu drei lustige Regeln. Sie bleiben sichtbar, bis ihr sie entfernt.'), bingo: B('The shared board stays active when you switch games. Mark real moments; two friends confirm. Three in a row wins.', 'Markiert, was wirklich passiert ist. Zwei Freunde bestätigen. Drei in einer Reihe gewinnen.'), toast: B('Two named players give 20-second toasts. Others choose the funniest by a show of hands; winner receives 1 point. A tie gives no points.', 'Zwei Personen halten je eine zwanzigsekündige Rede zum selben Thema. Das Publikum wählt.'), last: B('Choose five, ten, or fifteen one-sentence questions. Everyone answers; no scoring.', 'Wählt fünf, zehn oder fünfzehn kurze Fragen. Alle antworten; keine Punkte.')
        };
        return map[gameId] || B('Play together.', 'Spielt zusammen.');
    }
    function ensureMin() {
        if (n() >= g().min && n() <= g().max)
            return null;
        return card(prompt(B(`Choose ${g().min}–${g().max} players to play this game.`, `Für dieses Spiel braucht ihr ${g().min}–${g().max} Personen.`)) + act(btn('settings', T('setup')), btn('home', T('back'), 'secondary')));
    }
    let activeRules = [], missionState = null, pausedGame = null, bingoState = null, pausedForBingo = null;
    function missionStrip() { return gameId !== 'missions' && missionState && missionState.stage === 'hub' ? `<div class="active-rules spaced"><span>🎯 ${tx(B('Secret missions are active', 'Geheime Missionen laufen'))}</span><button class="chip-btn" data-act="missions-open">${tx(B('View / claim', 'Ansehen / melden'))}</button></div>` : ''; }
    function bingoStrip() {
      return gameId !== 'bingo' && bingoState ? `<div class="active-rules spaced"><span>${tx(B('Party Bingo is running', 'Party-Bingo läuft'))}</span><button class="chip-btn" data-act="bingo-open">${tx(B('View board', 'Karte ansehen'))}</button></div>` : '';
    }
    function rulesStrip() { return activeRules.length ? `<div class="active-rules">👑 ${activeRules.map(x => esc(tx(x.text))).join(' · ')}</div>` : ''; }
    function baseHeader() { return `<header class="top"><button class="brand" data-act="home"><span class="brand-mark">✳</span> CHAOS <strong>CLUB</strong></button><div class="top-actions"><button class="chip-btn" data-act="lang" aria-label="${esc(deepText('Switch language to German','Sprache zu Englisch wechseln'))}">${L() === 'en' ? 'EN' : 'DE'} ⇄</button><button class="chip-btn" data-act="sound" aria-label="${esc(prefs.sound?T('soundOn'):T('silent'))}" aria-pressed="${prefs.sound}">${prefs.sound ? '♫' : '♪'}</button><button class="chip-btn" data-act="settings" aria-label="${esc(T('setup'))}">☻ ${n()}</button></div></header>`; }
    function home() {
        const cats=['all','social','secrets','creative','party','favorites'];
        const allLegacy=catalog.filter(x=>!deepIds.includes(x.id));
        const group=familyFilter ? familyCatalog.find(f=>f.id===familyFilter) : null;
        const choices=group?.ids?allLegacy.filter(x=>group.ids.includes(x.id)):allLegacy;
        const shown=choices.filter(x=>(filter==='all'||(filter==='favorites'?prefs.favs.includes(x.id):x.cat===filter))&&(`${x.en} ${x.de} ${x.descEn} ${x.descDe}`).toLowerCase().includes(search.toLowerCase()));
        return `<div class="shell">${baseHeader()}
          <section class="hero hero-24"><div><span class="eyebrow">✦ ${deepText('Party games for 4–6 friends','Partyspiele für 4–6 Freunde')}</span>
          <h1>${L()==='en'?'PICK A GAME.<br><em>START THE CHAOS.</em>':'SPIEL WÄHLEN.<br><em>CHAOS STARTEN.</em>'}</h1>
          <p>${deepText('One phone, no accounts. Play together, not alone.','Ein Handy, kein Konto. Gemeinsam spielen statt allein.')}</p>
          <div class="hero-buttons">${btn('quick',deepText('⚡ Play a card now','⚡ Sofort eine Karte spielen'))}${btn('surprise',deepText('🎲 Surprise us','🎲 Überrasch uns'),'secondary')}</div></div>
          <div class="hero-orb" aria-hidden="true">✳</div></section>
          ${location.pathname==='/offline'?`<p class="home-note"><a href="/room/">${deepText('Play together on separate phones (local room server)','Mit mehreren Handys spielen (lokaler Raumserver)')}</a></p>`:''}
          ${notice?`<p class="inline-tip roster-notice" role="status">${esc(notice)}</p>`:''}${bingoStrip()}
          <div class="section-bar" id="games"><h2>${deepText('Choose your game night','Was spielt ihr heute?')}</h2></div>
          <div class="family-grid">${familyCatalog.map(f=>{
              const action=f.live?'game':'family';
              const running=f.live&&deepSessions[f.id]&&deepSessions[f.id].stage!=='end';
              return `<button class="family-tile ${f.live?'featured':''}" data-act="${action}" data-val="${f.id}"><span class="family-icon" aria-hidden="true">${f.icon}</span><strong>${esc(f[L()])}</strong><span>${esc(L()==='en'?f.descEn:f.descDe)}</span>${running?`<small>${deepText('Resume session','Runde fortsetzen')}</small>`:''}</button>`;
          }).join('')}</div>
          <div class="legacy-section"><button class="legacy-toggle" data-act="legacy-toggle" aria-expanded="${libraryOpen}">${libraryOpen?deepText('− Hide classic games','− Bisherige Spiele verbergen'):deepText('+ Browse all 34 original games','+ Alle 34 bisherigen Spiele ansehen')}</button>
          ${libraryOpen?`<div class="legacy-body"><div class="section-bar"><h2>${group?esc(group[L()]):deepText('Original game library','Bisherige Spielesammlung')} <span class="count">${shown.length}</span></h2><label class="search"><span class="sr-only">${T('find')}</span><input id="search-input" placeholder="${T('find')}" value="${esc(search)}" autocomplete="off"></label></div>
          ${group?`<button class="chip-btn" data-act="family-all">${deepText('Show all original games','Alle bisherigen Spiele anzeigen')}</button>`:''}
          <nav class="filters" aria-label="${T('category')}">${cats.map(c=>`<button class="filter ${filter===c?'active':''}" data-act="filter" data-val="${c}">${T(c)}</button>`).join('')}</nav>
          <div class="game-grid">${shown.map(x=>`<article class="legacy-article"><button class="game-tile" data-cat="${x.cat}" data-act="game" data-val="${x.id}" aria-label="${esc(x[L()])}"><div class="tile-head"><span class="tile-icon" aria-hidden="true">${x.icon}</span></div><div class="tile-name">${esc(x[L()])}</div><div class="tile-desc">${esc(L()==='en'?x.descEn:x.descDe)}</div><div class="tile-foot"><span>${x.min}–${x.max} ${T('players')}</span></div></button><button class="fav ${prefs.favs.includes(x.id)?'on':''}" data-act="favorite" data-val="${x.id}" aria-label="${esc(tx(B('Favorite','Favorit')))}: ${esc(x[L()])}">${prefs.favs.includes(x.id)?'★':'☆'}</button></article>`).join('')}</div>
          ${shown.length?'':`<p>${T('empty')}</p>`}</div>`:''}</div>
          <p class="home-note">${deepText('Drinking is optional. Skip anything you do not want to do.','Trinken ist freiwillig. Jede Aufgabe darf übersprungen werden.')}</p>
          </div>`;
    }
    function playPage() { return `<div class="shell">${baseHeader()}<div class="play-wrap"><div class="play-head"><button class="icon-btn" data-act="home" aria-label="${T('back')}">←</button><div class="play-title"><span class="eyebrow">${g().icon} ${T(g().cat)}</span><h1>${esc(g()[L()])}</h1></div><button class="chip-btn" data-act="help">ⓘ ${T('how')}</button></div>${rulesStrip()}${missionStrip()}${bingoStrip()}${ensureMin() || view()}${deepIds.includes(gameId)?'':`<footer class="footer">${btn('home', T('change'), 'secondary small')}</footer>`}</div></div>`; }
    function commonEnd(title, extra = '', withScores = false) { return card(`<div class="center">${tag(T('gameOver'))}<div class="card-icon">🎉</div>${prompt(title)}${extra}${withScores ? scores() : ''}${act(btn('restart', T('again')), btn('home', T('change'), 'secondary'))}</div>`); }
    function publicDeck() { const tips = { roulette: B('Read it aloud. Everyone joins in.', 'Lest laut vor. Alle machen mit.'), most: B('On three, point at one person.', 'Auf drei auf eine Person zeigen.'), redflag: B('Green or red? Vote together.', 'Grün oder Rot? Gemeinsam abstimmen.'), never: B('If it applies, show a finger or share an optional story.', 'Wenn es zutrifft, zeigt einen Finger oder erzählt freiwillig.'), sip: B('Say yes or optionally sip any drink. No penalty for skipping.', 'Sagt Ja oder nehmt freiwillig einen Schluck eures Getränks. Keine Trinkstrafe.'), last: B('One sentence each. You can always pass.', 'Je ein Satz pro Person. Ihr dürft passen.') }; if (gameId === 'last' && s.stage === 'chooseLength')
        return card(tag(T('choose')) + prompt(B('How many questions?', 'Wie viele Fragen?')) + options([B('5 quick questions', '5 kurze Fragen'), B('10 questions', '10 Fragen'), B('15 questions', '15 Fragen')], 'length', null)); if (gameId === 'last' && s.round >= s.limit)
        return commonEnd(B('All questions played.', 'Alle Fragen gespielt.')); return card(tag(`${step()} · ${g().icon}`) + prompt(s.data) + muted(tx(tips[gameId])) + act(btn('deck-next', T('next') + ' →'))); }
    function majorityView() {
        let q = s.data;
        const guide = tx(B('The Forecaster locks a prediction. Everyone else picks A or B out loud.', 'Die ratende Person tippt heimlich auf A/B. Die übrigen wählen laut A oder B.'));
        if (s.round >= 5)
            return commonEnd(B('All five votes are in!', 'Alle fünf Runden gespielt!'), scores(), false);
        if (s.stage === 'forecast')
            return card(tag(`${step()}/5 · ${esc(gp(s.round % n()))} · ${T('secret')}`) + prompt(q[0]) + options([q[1], q[2]], 'forecast-set', s.choice) + muted(guide) + act(btn('forecast-lock', T('hide'), '', s.choice == null ? 'disabled' : '')));
        if (s.stage === 'group')
            return card(tag(`${step()}/5 · ${T('vote')}`) + prompt(q[0]) + options([q[1], q[2]], 'noop', null) + muted(tx(B('Everyone else chooses aloud. Count votes for A.', 'Alle anderen wählen laut. Zählt die Stimmen für A.'))) + `<label class="label">${tx(B('Votes for A (excluding Forecaster)', 'Stimmen für A (ohne ratende Person)'))}: <strong id="vote-display">${s.num}</strong> / ${n() - 1}</label><input class="range" id="count-range" type="range" min="0" max="${n() - 1}" value="${s.num}">` + act(btn('forecast-reveal', T('reveal'))));
        const a = s.num, b = n() - 1 - a, maj = a === b ? -1 : a > b ? 0 : 1, correct = maj === -1 ? null : s.choice === maj;
        return card(tag(T('results')) + prompt(q[0], true) + `<div class="results"><div class="spaced"><b>A · ${esc(tx(q[1]))}</b><b>${a}</b></div><div class="resultbar"><span style="width:${a / (n() - 1) * 100}%"></span></div><div class="spaced"><b>B · ${esc(tx(q[2]))}</b><b>${b}</b></div><div class="resultbar"><span style="width:${b / (n() - 1) * 100}%"></span></div></div>` + `<div class="inline-tip">${esc(gp(s.round % n()))}: ${maj === -1 ? tx(B('Perfect split! +1 point', 'Gleichstand! +1 Punkt')) : correct ? tx(B('Correct prediction! +2 points', 'Richtig getippt! +2 Punkte')) : tx(B('The group surprised you!', 'Die Gruppe hat dich überrascht!'))}</div>` + scores() + act(btn('forecast-next', T('nextRound'))));
    }
    function spectrumView() { let [a, b] = s.data; if (s.round >= 5)
        return commonEnd(B('You found your wavelength.', 'Ihr habt eure Wellenlänge gefunden.'), scores(), false); if (s.stage === 'cover')
        return card(tag(`${step()}/5 · ${esc(gp(s.round % n()))}`) + prompt(B('Only the clue-giver looks.', 'Nur die hinweisgebende Person schaut hin.')) + muted(T('privacy')) + act(btn('spectrum-see', T('reveal')))); if (s.stage === 'see')
        return card(tag(T('secret')) + `<div class="spaced"><span>${esc(tx(a))}</span><span>${esc(tx(b))}</span></div><div class="secret">${s.secret} / 10</div>` + muted(tx(B('Give a clue without saying numbers, then hide the screen.', 'Gib einen Hinweis ohne Zahlen und verstecke den Bildschirm.'))) + act(btn('spectrum-hide', T('hide')))); if (s.stage === 'guess')
        return card(tag(T('question')) + prompt(B('Where does the clue belong?', 'Wo liegt der Hinweis?')) + `<div class="spaced"><span>${esc(tx(a))}</span><span>${esc(tx(b))}</span></div><div class="secret" id="range-val">${s.guess}</div><input class="range" id="guess-range" type="range" min="0" max="10" value="${s.guess}">` + act(btn('spectrum-result', T('reveal')))); return card(tag(T('results')) + `<div class="secret">${s.secret}/10</div><p class="center">${T('group')}: ${s.guess} · +${Math.max(0, 3 - Math.abs(s.guess - s.secret))} ${T('score')}</p>` + scores() + act(btn('spectrum-next', T('nextRound')))); }
    function paranoiaView() {
        if (s.stage === 'cover')
            return card(tag(T('secret')) + prompt(B('The reader looks at the question alone.', 'Die lesende Person schaut sich allein die Frage an.')) + muted(T('privacy')) + act(btn('para-see', T('reveal'))));
        if (s.stage === 'see')
            return card(tag(T('question')) + prompt(s.data) + muted(tx(B('Whisper the question to your neighbor. They name one person aloud.', 'Flüstere die Frage der Person neben dir zu. Sie nennt laut einen Namen.'))) + act(btn('para-hide', T('hide'))));
        if (s.stage === 'hidden')
            return card(tag(T('secret')) + prompt(B('Keep the question secret or ask to reveal it?', 'Frage geheim lassen oder Aufdeckung erfragen?')) + muted(tx(B('Ask the reader and nominated person separately. Both must agree.', 'Fragt die lesende und die genannte Person einzeln. Beide müssen zustimmen.'))) + act(btn('para-consent', tx(B('Ask for consent', 'Zustimmung einholen'))), btn('para-next', T('next'), 'secondary')));
        if (s.stage === 'consent-reader') return card(tag(T('confirm')) + prompt(B('Does the reader agree to reveal?', 'Stimmt die lesende Person der Aufdeckung zu?')) + act(btn('para-reader-yes', T('yes')), btn('para-next', tx(B('Keep secret', 'Geheim lassen')), 'secondary')));
        if (s.stage === 'consent-nominated') return card(tag(T('confirm')) + prompt(B('Does the nominated person agree too?', 'Stimmt die genannte Person ebenfalls zu?')) + act(btn('para-nominated-yes', T('yes')), btn('para-next', tx(B('Keep secret', 'Geheim lassen')), 'secondary')));
        return card(tag(T('reveal')) + prompt(s.data) + act(btn('para-next', T('next'))));
    }
    function sameView() { return card(tag(`${step()} · ${T('group')}`) + prompt(s.data) + muted(tx(B('Think silently, then count down 3–2–1 and say your answers together.', 'Denkt kurz nach. Dann 3–2–1 zählen und gleichzeitig antworten.'))) + `<div class="inline-tip">${tx(B('Matching answers? Celebrate the match; spelling does not matter in this spoken mode.', 'Gleiche Antworten? Freut euch über die Übereinstimmung. In dieser mündlichen Variante gibt es keine Punkte.'))}</div>` + act(btn('same-next', T('nextRound')))); }
    function knowView() {
        const q = s.data;
        if (s.round >= n())
            return commonEnd(B('All preferences revealed.', 'Alle Vorlieben aufgedeckt.'));
        if (s.stage === 'cover')
            return card(tag(gp(s.round % n()) + ' · ' + T('secret')) + prompt(B('Only the featured player looks.', 'Nur die Person am Zug schaut hin.')) + act(btn('know-see', T('reveal'))));
        if (s.stage === 'see')
            return card(tag(gp(s.round % n())) + prompt(q[0]) + options(q.slice(1), 'know-set', s.choice) + act(btn('know-hide', T('hide'), 'primary', s.choice == null ? 'disabled' : '')));
        if (s.stage === 'guess')
            return card(tag(T('question')) + prompt(q[0]) + options(q.slice(1), 'noop', null) + muted(tx(B('Everyone else announces their guess together.', 'Alle anderen sagen ihre Vermutung gleichzeitig.'))) + act(btn('know-reveal', T('reveal'))));
        return card(tag(T('results')) + prompt(q[s.choice + 1]) + act(btn('know-next', T('next'))));
    }
    function rankView() { let q = s.data; if (s.round >= n())
        return commonEnd(B('All rankings revealed.', 'Alle Ranglisten aufgedeckt.')); if (s.stage === 'cover')
        return card(tag(`${esc(gp(s.round % n()))} · ${T('secret')}`) + prompt(B('Keep your ranking private.', 'Halte deine Reihenfolge geheim.')) + act(btn('rank-see', T('reveal')))); if (s.stage === 'see')
        return card(tag(T('secret')) + prompt(q[0], true) + s.order.map((i, p) => `<div class="answer spaced"><b>${p + 1}. ${esc(tx(q[i + 1]))}</b><span><button class="chip-btn" data-act="rank-up" data-val="${p}" ${p === 0 ? 'disabled' : ''}>↑</button> <button class="chip-btn" data-act="rank-down" data-val="${p}" ${p === 3 ? 'disabled' : ''}>↓</button></span></div>`).join('') + act(btn('rank-hide', T('hide')))); if (s.stage === 'guess')
        return card(tag(T('guess')) + prompt(q[0], true) + muted(tx(B('Group: say which option is first and which is last.', 'Gruppe: Ratet, was auf Platz 1 und 4 steht.'))) + q.slice(1).map(x => `<div class="answer">${esc(tx(x))}</div>`).join('') + act(btn('rank-reveal', T('reveal')))); return card(tag(T('results')) + s.order.map((i, p) => `<div class="answer"><b>${p + 1}.</b> ${esc(tx(q[i + 1]))}</div>`).join('') + act(btn('rank-next', T('next')))); }
    function hotView() { if (s.round >= 3)
        return commonEnd(B('All opinions heard.', 'Alle Meinungen gehört.'), scores(), false); return card(tag(`${esc(gp(s.round % n()))} · ${step()}/3`) + prompt(s.data) + muted(tx(B('Defend this opinion for 30 seconds. Then answer two questions.', 'Verteidige diese Meinung 30 Sekunden und beantworte zwei Fragen.'))) + `<div class="inline-tip">${tx(B('The others vote: Convinced or Not convinced.', 'Die anderen stimmen ab: Überzeugt oder Nicht überzeugt.'))}</div>` + act(btn('hot-pass', tx(B('Majority convinced', 'Mehrheit überzeugt'))), btn('hot-fail', tx(B('Not convinced', 'Nicht überzeugt')), 'secondary'))); }
    function roleView() {
        const k = gameId;
        if (s.stage === 'cover')
            return card(tag(T('pass') + ' ' + esc(gp(s.player)) + ' · ' + (s.player + 1) + '/' + n()) + prompt(B('Private role. No peeking.', 'Geheime Rolle. Nicht spicken.')) + act(btn('role-see', T('reveal'))));
        if (s.stage === 'see') {
            const isBad = s.player === s.undercover;
            const role = k === 'undercover' ? (isBad ? B('Undercover', 'Undercover') : B('Civilian', 'Mitwisser')) : k === 'spy' ? (isBad ? B('Spy', 'Spion') : B('Local', 'Ortskundig')) : (isBad ? B('Mimic', 'Mitmacher') : B('In the know', 'Eingeweiht'));
            const word = k === 'undercover' ? tx(s.word[isBad ? 1 : 0]) : k === 'spy' ? (isBad ? '???' : tx(s.word)) : (isBad ? tx(B('Copy the others.', 'Kopiere die anderen.')) : s.word.map(tx).join(' / '));
            return card(tag(T('secret')) + '<div class="secret">' + esc(tx(role)) + '<br><small>' + esc(word) + '</small></div>' + muted(T('privacy')) + act(btn('role-next', T('hide'))));
        }
        if (s.stage === 'discuss') {
            const help = k === 'undercover' ? B('Everyone gives one short clue without saying their word. Then discuss suspects.', 'Alle geben einen kurzen Hinweis, ohne das Wort zu sagen. Danach diskutiert ihr.') : k === 'spy' ? B('Ask each other two rounds of questions without naming the location.', 'Stellt euch zwei Runden Fragen, ohne den Ort zu nennen.') : B('Count down 3–2–1 and perform each action together. The Mimic must copy.', 'Zählt 3–2–1 und macht die Aktionen gemeinsam. Der Mitmacher muss abschauen.');
            const cue = k === 'mimic' ? `<div class="inline-tip">${tx(B('Action', 'Aktion'))} ${s.phase + 1}/3</div>` : '';
            return card(tag(T('group')) + prompt(k === 'mimic' ? B('Who is copying?', 'Wer schaut ab?') : B('Find the impostor.', 'Findet den Betrüger.')) + muted(tx(help)) + cue + act(k === 'mimic' && s.phase < 2 ? btn('mimic-cue', T('next')) : btn('role-accuse', tx(B('Count group votes', 'Gruppenstimmen zählen')))));
        }
        if (s.stage === 'accuse') {
            const total = s.roleVotes.reduce((a, b) => a + b, 0) + s.abstentions;
            return card(tag(`${T('vote')}${s.runoff ? ' · ' + tx(B('Runoff', 'Stichwahl')) : ''}`) + prompt(B('Count votes aloud.', 'Zählt die Stimmen laut.')) + muted(tx(B('Everyone points at one suspect. Tap + to enter the count; − corrects it. This is a public group vote.', 'Alle zeigen auf eine verdächtige Person. Mit + zählt ihr die Stimmen, mit − korrigiert ihr. Die Abstimmung ist öffentlich.'))) +
                s.candidates.map(i => `<div class="answer spaced"><b>${esc(gp(i))}</b><span><button class="chip-btn" data-act="role-vote-minus" data-val="${i}" aria-label="${esc(tx(B('Remove vote', 'Stimme entfernen')))} ${esc(gp(i))}" ${s.roleVotes[i] === 0 ? 'disabled' : ''}>−</button> <strong>${s.roleVotes[i]}</strong> <button class="chip-btn" data-act="role-vote-add" data-val="${i}" aria-label="${esc(tx(B('Add vote', 'Stimme hinzufügen')))} ${esc(gp(i))}" ${total >= n() ? 'disabled' : ''}>+</button></span></div>`).join('') +
                muted(`${total}/${n()} ${T('vote')} · ${tx(B('Abstentions', 'Enthaltungen'))}: ${s.abstentions}`) + act(btn('role-abstain', tx(B('Abstain +', 'Enthaltung +')), 'secondary', total >= n() ? 'disabled' : ''), btn('role-unabstain', tx(B('Undo abstention', 'Enthaltung zurück')), 'secondary', s.abstentions === 0 ? 'disabled' : ''), btn('role-decide', T('reveal'), 'primary', total !== n() ? 'disabled' : '')));
        }
        if (s.stage === 'spyguess')
            return card(tag(T('secret')) + prompt(B('Spy: guess the location.', 'Spion: Rate den Ort.')) + `<input id="spy-input" class="input" maxlength="80" aria-label="${esc(tx(B('Location guess', 'Ortsvermutung')))}" placeholder="${esc(tx(B('Your guess', 'Dein Tipp')))}">` + act(btn('role-reveal', T('reveal'))));
        if (s.stage === 'spyjudge')
            return card(tag(T('results')) + prompt(B('Check the Spy’s guess.', 'Prüft den Tipp des Spions.')) + `<div class="answer">${esc(s.spyGuess || '—')}</div><div class="secret">${esc(tx(s.word))}</div>` + muted(tx(B('As a group, decide whether the guess means the same place. Spelling and synonyms are allowed.', 'Entscheidet gemeinsam, ob die Antwort denselben Ort meint. Synonyme und Schreibweisen sind erlaubt.'))) + act(btn('spy-correct', T('correct')), btn('spy-wrong', T('wrong'), 'secondary')));
        const caught = s.choice === s.undercover, spyCorrect = !!s.spyCorrect;
        const result = k === 'spy' ? (spyCorrect ? B('Spy guessed correctly — Spy wins.', 'Spion hat richtig geraten – Sieg für den Spion.') : caught ? B('Spy caught — group wins.', 'Spion enttarnt – die Gruppe gewinnt.') : B('Spy escaped — Spy wins.', 'Spion entkommen – Sieg für den Spion.')) : caught ? B('Group wins!', 'Die Gruppe gewinnt!') : B('Impostor escaped!', 'Der Betrüger ist entkommen!');
        const secret = k === 'undercover' ? tx(s.word[0]) + ' / ' + tx(s.word[1]) : k === 'spy' ? tx(s.word) : tx(B('The Mimic', 'Der Mitmacher'));
        return card(tag(T('results')) + `<div class="center">${prompt(result)}<div class="secret">${esc(gp(s.undercover))}</div><p>${esc(secret)}</p>${s.choice === -1 ? `<p class="subtext">${tx(B('Still tied after the runoff.', 'Auch nach der Stichwahl Gleichstand.'))}</p>` : ''}</div>` + act(btn('restart', T('again')), btn('home', T('change'), 'secondary')));
    }
    function bluffView() { const q = s.data; if (s.stage === 'cover')
        return card(tag(T('secret')) + prompt(B('Fact-keeper: read the correct answer privately.', 'Faktenhüter: Lies die richtige Antwort heimlich.')) + act(btn('bluff-see', T('reveal')))); if (s.stage === 'see')
        return card(tag(T('secret')) + prompt(q.q, true) + `<div class="secret">${esc(tx(q.a))}</div>` + muted(tx(B('You will say the real answer aloud after the other players invent fake answers.', 'Du sagst die wahre Antwort, nachdem die anderen falsche Antworten erfunden haben.'))) + act(btn('bluff-hide', T('hide')))); if (s.stage === 'group')
        return card(tag(T('question')) + prompt(q.q) + muted(tx(B('Everyone except the fact-keeper and guesser invents plausible false answers. The fact-keeper mixes in the real answer; the guesser chooses.', 'Alle außer Faktenhüter und ratender Person erfinden falsche Antworten. Der Faktenhüter mischt die wahre dazu; die ratende Person wählt.'))) + act(btn('bluff-reveal', T('reveal')))); return card(tag(T('results')) + prompt(q.a) + `<p class="subtext">${L() === 'en' ? 'Fact source' : 'Faktenquelle'}: <a href="${esc(q.src)}" target="_blank" rel="noopener noreferrer">${esc(new URL(q.src).hostname)}</a></p>` + act(btn('bluff-next', T('nextRound')))); }
    function whoView() { if (s.stage === 'cover')
        return card(tag(`${T('pass')} ${esc(gp(s.player))} · ${s.player + 1}/${n()}`) + prompt(B('Write a secret answer.', 'Schreibe heimlich eine Antwort.')) + act(btn('who-see', T('ready')))); if (s.stage === 'write')
        return card(tag(T('question')) + prompt(s.data) + `<textarea id="private-text" class="textinput" maxlength="160" placeholder="${L() === 'en' ? 'One short answer…' : 'Eine kurze Antwort …'}"></textarea>` + act(btn('who-save', T('hide')), btn('who-skip', T('skip'), 'secondary'))); if (s.stage === 'guess')
        return card(tag(`${s.i + 1}/${s.entries.length} · ${T('guess')}`) + prompt(B('Who wrote this?', 'Wer hat das geschrieben?')) + `<div class="secret">“${esc(s.entries[s.i].text)}”</div>` + muted(tx(B('Guess aloud before you reveal the author.', 'Ratet laut, bevor ihr aufdeckt.'))) + act(btn('who-reveal', T('reveal')))); if (s.stage === 'author')
        return card(tag(T('results')) + prompt(gp(s.entries[s.i].author)) + `<div class="answer">“${esc(s.entries[s.i].text)}”</div>` + act(btn('who-next', T('next')))); return commonEnd(B('All authors revealed.', 'Alle Antworten zugeordnet.')); }
    function confessionView() { let p = s.person; if (s.round >= n())
        return commonEnd(B('Everyone has told a story.', 'Alle haben eine Geschichte erzählt.'), scores(), false); if (s.stage === 'choose')
        return card(tag(`${esc(gp(p))} · ${T('secret')}`) + prompt(s.data) + muted(tx(B('Choose privately: your story will be real or invented.', 'Wähle heimlich: Deine Geschichte ist wahr oder erfunden.'))) + act(btn('confession-real', tx(B('Real story', 'Wahre Geschichte'))), btn('confession-fake', tx(B('Fictional story', 'Erfundene Geschichte')), 'secondary'))); if (s.stage === 'tell')
        return card(tag(esc(gp(p))) + prompt(s.data) + muted(tx(B('Tell your story in 30 seconds. Others may ask two questions.', 'Erzähle in 30 Sekunden. Die anderen dürfen zwei Fragen stellen.'))) + act(btn('confession-vote', T('vote')))); if (s.stage === 'vote')
        return card(tag(T('vote')) + prompt(B('How many people voted REAL?', 'Wie viele haben für WAHR gestimmt?')) + `<label class="label">${T('yes')}: <b id="range-val">${s.num}</b> / ${n() - 1}</label><input id="count-range" class="range" type="range" min="0" max="${n() - 1}" value="${s.num}">` + act(btn('confession-reveal', T('reveal')))); return card(tag(T('results')) + prompt(s.real ? B('It was real!', 'Es war wahr!') : B('It was invented!', 'Es war erfunden!')) + muted(`${s.num} ${L() === 'en' ? 'voted real' : 'stimmten für wahr'} · ${s.fooled ? tx(B('Storyteller fooled the majority: +2', 'Erzähler hat die Mehrheit getäuscht: +2')) : tx(B('Majority guessed correctly', 'Mehrheit hat richtig geraten'))}`) + scores() + act(btn('confession-next', T('next')))); }
    function missionsView() {
        if (s.stage === 'finished')
            return commonEnd(B('Mission accomplished!', 'Mission erfüllt!'), scores(), false);
        if (s.stage === 'verify')
            return card(tag(T('confirm')) + prompt(B('Did the player really complete the mission?', 'Wurde die Mission wirklich erfüllt?')) + muted(tx(B('A different player must confirm aloud.', 'Eine andere Person muss mündlich bestätigen.'))) + act(btn('mission-yes', T('confirm')), btn('mission-no', T('cancel'), 'secondary')));
        if (s.stage === 'new-cover')
            return card(tag(T('secret')) + prompt(B('New mission for', 'Neue Mission für')) + `<div class="secret">${esc(gp(s.player))}</div>` + act(btn('mission-new-see', T('reveal'))));
        if (s.stage === 'new-see')
            return card(tag(T('secret')) + prompt(s.targets[s.player]) + act(btn('mission-new-hide', T('hide'))));
        if (s.stage === 'cover')
            return card(tag(`${T('pass')} ${esc(gp(s.player))} · ${s.player + 1}/${n()}`) + prompt(B('Your mission is private.', 'Deine Mission ist geheim.')) + act(btn('missions-see', T('reveal'))));
        if (s.stage === 'see')
            return card(tag(T('secret')) + prompt(s.targets[s.player]) + act(btn('missions-next', T('hide'))));
        return card(tag(T('group')) + prompt(B('Complete your secret missions during the party.', 'Erfüllt eure Missionen während der Party.')) + muted(tx(B('Tap a name when the player claims success. Another player confirms verbally.', 'Tippt auf einen Namen, wenn jemand die Mission erfüllt hat. Eine andere Person bestätigt mündlich.'))) + `<div class="roster">${prefs.players.map((_, i) => `<div class="spaced answer"><span>${esc(gp(i))}</span><button class="chip-btn" data-act="mission-claim" data-val="${i}" ${s.points[i] >= 3 ? 'disabled' : ''}>${s.points[i] >= 3 ? '✓ ' + T('complete') : T('claim') + ' · ' + s.points[i] + '/3'}</button></div>`).join('')}</div>` + act(btn('missions-back', tx(B('Back to game', 'Zurück zum Spiel')), 'secondary'), btn('missions-finish', T('finish')), btn('missions-reset', T('restart'), 'secondary')));
    }
    function badView() { if (s.stage === 'style')
        return card(tag(T('choose')) + prompt(B('How do you want to answer?', 'Wie wollt ihr antworten?')) + muted(tx(B('Spoken is fast. Anonymous means passing the phone for writing and votes.', 'Mündlich geht schnell. Anonym bedeutet: Handy zum Schreiben und Abstimmen weitergeben.'))) + act(btn('bad-spoken', tx(B('Speak together', 'Zusammen sprechen'))), btn('bad-write', tx(B('Anonymous answers', 'Anonym antworten')), 'secondary'))); if (s.stage === 'spoken')
        return card(tag(`${step()} / 3`) + prompt(s.data) + muted(tx(B('Everyone says a punchline. Laugh, debate, choose a favorite — no typing.', 'Alle sagen ihre Pointe. Lacht, diskutiert, wählt euren Favoriten – ohne Tippen.'))) + act(btn('bad-next', T('nextRound')))); if (s.stage === 'cover')
        return card(tag(`${T('pass')} ${esc(gp(s.player))} · ${s.player + 1}/${n()}`) + prompt(B('Write your answer privately.', 'Schreibe deine Antwort heimlich.')) + act(btn('bad-see', T('ready')))); if (s.stage === 'write')
        return card(tag(T('question')) + prompt(s.data) + `<textarea id="private-text" class="textinput" maxlength="120" placeholder="${L() === 'en' ? 'Your funniest answer…' : 'Deine lustigste Antwort …'}"></textarea>` + act(btn('bad-save', T('hide')), btn('bad-skip', T('skip'), 'secondary'))); if (s.stage === 'vote-cover')
        return card(tag(`${T('pass')} ${esc(gp(s.player))} · ${s.player + 1}/${n()}`) + prompt(B('Vote privately. Not for yourself.', 'Stimme heimlich ab. Nicht für dich selbst.')) + act(btn('bad-vote-see', T('ready')))); if (s.stage === 'vote')
        return card(tag(T('vote')) + prompt(s.data, true) + s.entries.filter(e => e.author !== s.player).map(e => `<button class="option" style="display:block;width:100%;margin:9px 0;min-height:52px" data-act="bad-vote" data-val="${e.author}">“${esc(e.text)}”</button>`).join('') + act(btn('bad-vote-skip', T('skip'), 'secondary'))); if (s.stage === 'results')
        return card(tag(T('results')) + prompt(s.data, true) + s.entries.map(e => `<div class="answer spaced"><div>“${esc(e.text)}”<br><span class="smallprint">${esc(gp(e.author))}</span></div><strong>+${s.votes.filter(v => v === e.author).length}</strong></div>`).join('') + scores() + act(btn('bad-next', T('nextRound')))); return commonEnd(B('Three prompts played.', 'Drei Fragen gespielt.'), scores(), false); }
    function performView() { if (s.stage === 'cover')
        return card(tag(`${esc(gp(s.turn % n()))} · ${T('turn')} ${s.turn + 1}/4`) + prompt(B('Pass the phone to the actor/clue-giver.', 'Gib das Handy der spielenden Person.')) + muted(tx(B('Teams alternate. Each correct guess scores one point.', 'Teams wechseln sich ab. Jeder erratene Begriff bringt einen Punkt.'))) + act(btn('perform-see', T('ready'))) + scores()); if (s.stage === 'active') {
        let word = gameId === 'taboo' ? s.data.w : s.data;
        return card(tag(`${tx(B('Team', 'Team'))} ${s.turn % 2 + 1} · ${T('timer')}`) + `<div class="timer"><span id="timer-view">${s.secs}</span>s</div>` + prompt(word) + (gameId === 'taboo' ? `<div class="inline-tip"><span class="tip-label">${tx(B('Forbidden', 'Verboten'))}</span><br>${s.data.ban.map(tx).map(esc).join(' · ')}</div>` : muted(tx(B('Act silently. No talking.', 'Spiele lautlos. Nicht sprechen.')))) + act(btn('perform-correct', T('correct')), btn('perform-pass', T('skip'), 'secondary'), btn('perform-stop', T('done'), 'secondary')) + scores());
    } return card(tag(`${T('results')} · ${T('turn')} ${s.turn + 1}`) + prompt(B('Turn complete.', 'Zug beendet.')) + scores() + act(btn('perform-next', s.turn >= 3 ? T('results') : T('passOn')))); }
    function storyView() {
        if (s.phase >= 2 * n())
            return commonEnd(B('Story complete.', 'Geschichte fertig.'));
        return card(tag(`${T('turn')} ${s.phase + 1}/${2 * n()} · ${esc(gp(s.phase % n()))}`) + (s.phase === 0 ? prompt(s.data) : prompt(B('Add up to two sentences.', 'Ergänze maximal zwei Sätze.'))) + (s.twist ? `<div class="inline-tip"><span class="tip-label">${tx(B('Plot twist', 'Wendung'))}</span><br>${esc(tx(s.twist))}</div>` : '') + act(btn('story-next', s.phase + 1 >= 2 * n() ? T('finish') : T('passOn'))));
    }
    function pitchView() { const [thing, problem] = s.data; if (s.round >= n())
        return commonEnd(B('All product pitches are in.', 'Alle Produktideen wurden vorgestellt.'), scores(), false); return card(tag(`${esc(gp(s.player))} · ${T('turn')} ${s.round + 1}`) + prompt(thing) + `<div class="inline-tip">${tx(B('Problem', 'Problem'))}: ${esc(tx(problem))}</div>` + muted(tx(B('Prepare for 10 seconds, sell it in 30 seconds, take one question. Others vote Buy or Pass.', '10 Sekunden vorbereiten, 30 Sekunden verkaufen, eine Frage beantworten. Die anderen stimmen ab.'))) + act(btn('pitch-sold', tx(B('Majority buys it', 'Mehrheit kauft'))), btn('pitch-pass', tx(B('Nobody buys', 'Niemand kauft')), 'secondary'))); }
    function whisperView() { if (s.stage === 'cover')
        return card(tag(T('secret')) + prompt(B('Only the first player looks.', 'Nur die erste Person schaut hin.')) + act(btn('whisper-see', T('reveal')))); if (s.stage === 'see')
        return card(tag(T('secret')) + prompt(s.data) + muted(tx(B('Whisper the sentence once to the next player. No repeats.', 'Flüstere den Satz einmal der nächsten Person zu. Nicht wiederholen.'))) + act(btn('whisper-hide', T('hide')))); if (s.stage === 'group')
        return card(tag(T('group')) + prompt(B('Whisper clockwise until the last player hears it.', 'Flüstert im Kreis, bis die letzte Person den Satz gehört hat.')) + act(btn('whisper-last', tx(B('Last player is ready', 'Letzte Person ist bereit'))))); if (s.stage === 'type')
        return card(tag(T('question')) + prompt(B('What sentence did you hear?', 'Welchen Satz hast du gehört?')) + `<textarea id="private-text" class="textinput" maxlength="280" placeholder="…"></textarea>` + act(btn('whisper-reveal', T('reveal')))); return card(tag(T('results')) + `<div class="answer">${esc(tx(s.data))}</div><div class="answer"><strong>${esc(s.text || '…')}</strong></div>` + act(btn('whisper-next', T('again')))); }
    function threeView() { if (s.ph >= 3)
        return commonEnd(B('All three rounds complete.', 'Alle drei Runden geschafft.'), scores(), false); if (s.stage === 'cover')
        return card(tag(`${tx(B('Round', 'Runde'))} ${s.ph + 1}/3 · ${tx(B('Team', 'Team'))} ${s.team + 1}`) + prompt(s.ph === 0 ? B('Describe freely.', 'Frei erklären.') : s.ph === 1 ? B('One word only.', 'Nur ein Wort.') : B('Act silently.', 'Nur pantomimisch.')) + muted(tx(B('The same eight cards return each round. Each team has 30 seconds per turn.', 'Dieselben acht Karten kommen in jeder Runde wieder. Pro Team 30 Sekunden.'))) + act(btn('three-start', T('start')))); if (s.stage === 'active')
        return card(tag(`${tx(B('Team', 'Team'))} ${s.team + 1}`) + `<div class="timer"><span id="timer-view">30</span>s</div>` + prompt(s.current) + act(btn('three-correct', T('correct')), btn('three-pass', T('skip'), 'secondary'), btn('three-stop', T('done'), 'secondary')) + scores()); return card(tag(T('results')) + prompt(s.todo.length ? B('Pass to the next team.', 'Weiter an das nächste Team.') : B('All cards guessed!', 'Alle Karten erraten!')) + scores() + act(btn('three-next', T('next')))); }
    function expertView() { if (s.round >= n())
        return commonEnd(B('Everyone has had a turn.', 'Alle waren einmal dran.')); return card(tag(`${esc(gp(s.player))} · ${T('turn')} ${s.round + 1}`) + prompt(s.data[0]) + `<div class="inline-tip">${tx(B('Use all three words', 'Benutze alle drei Wörter'))}: <strong>${esc(tx(s.data[1]))}</strong></div>` + muted(tx(B('Prepare 10 seconds. Give a 30-second lecture, then answer two group questions.', 'Zehn Sekunden vorbereiten. Dann 30 Sekunden vortragen und zwei Fragen beantworten.'))) + act(btn('expert-next', T('next')))); }
    function drawView() { if (s.stage === 'write' || s.stage === 'describe' || s.stage === 'text-alternative') {
        return card(tag(`${T('pass')} ${esc(gp(s.player))} · ${s.phase + 1}/${n()}`) + prompt(s.stage === 'write' ? B('Write a ridiculous scene to draw.', 'Schreibe eine absurde Szene zum Zeichnen.') : s.stage === 'text-alternative' ? B('Write a description instead of drawing.', 'Beschreibe die Szene, statt sie zu zeichnen.') : B('Describe the previous drawing.', 'Beschreibe die letzte Zeichnung.')) + (s.stage === 'describe' ? `<div class="gallery-frame">${s.frames[s.frames.length - 1].image ? `<img src="${s.frames[s.frames.length - 1].image}" alt="Previous drawing">` : `<p>${esc(s.frames[s.frames.length - 1].text)}</p>`}</div>` : '') + `<textarea id="private-text" class="textinput" maxlength="180" placeholder="${L() === 'en' ? 'Your phrase…' : 'Dein Satz …'}"></textarea>` + act(btn('draw-text', T('hide'))));
    } if (s.stage === 'draw')
        return card(tag(`${T('pass')} ${esc(gp(s.player))} · ${s.phase + 1}/${n()}`) + prompt(s.text || B('Draw what the last person described.', 'Zeichne die letzte Beschreibung.'), true) + `<canvas id="drawing" class="draw-canvas" width="720" height="430" aria-label="Drawing canvas"></canvas><div class="draw-controls"><button class="chip-btn" data-act="draw-clear">${T('clear')}</button></div>` + act(btn('draw-submit', T('hide')), btn('draw-alternative', tx(B('Describe instead', 'Stattdessen beschreiben')), 'secondary'))); return card(tag(T('results')) + prompt(B('The full chain', 'Die ganze Kette')) + s.frames.map((f, i) => `<div class="gallery-frame"><div class="smallprint">${i + 1} · ${esc(gp(f.author))}</div>${f.image ? `<img src="${f.image}" alt="Drawing in the chain">` : `<p>${esc(f.text)}</p>`}</div>`).join('') + act(btn('restart', T('again')), btn('home', T('change'), 'secondary'))); }
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const kingRules = [
        B('A — Say one unpopular food opinion. Everyone else votes agree/disagree.', 'Ass — Sag eine unpopuläre Essensmeinung. Die anderen stimmen zu oder dagegen.'),
        B('2 — Choose two players to name three things they have in common in 20 seconds.', '2 — Bestimme zwei Personen: Sie finden in 20 Sekunden drei Gemeinsamkeiten.'),
        B('3 — Name three things you should never say on a first date.', '3 — Nennt drei Dinge, die man beim ersten Date niemals sagen sollte.'),
        B('4 — Everyone points at whoever is most likely to lose their keys tonight.', '4 — Alle zeigen auf die Person, die heute am ehesten den Schlüssel verliert.'),
        B('5 — Go around naming pizza toppings. Repeat one, and the round ends.', '5 — Nennt reihum Pizzabeläge. Bei einer Wiederholung endet die Runde.'),
        B('6 — One volunteer tells a 20-second story about a harmless mix-up.', '6 — Eine freiwillige Person erzählt 20 Sekunden von einem harmlosen Missverständnis.'),
        B('7 — Invent a silly house rule. Activate it in House Rules if everyone agrees.', '7 — Erfindet eine alberne Hausregel. Aktiviert sie, wenn alle einverstanden sind.'),
        B('8 — Two volunteers act out a job interview for a professional napper.', '8 — Zwei Freiwillige spielen ein Bewerbungsgespräch für professionelle Mittagsschläfer.'),
        B('9 — Find as many rhymes for “night” as you can. No repeats.', '9 — Findet möglichst viele Reime auf „Haus“. Keine Wiederholungen.'),
        B('10 — Everyone tries to sell an imaginary umbrella that only works indoors.', '10 — Alle versuchen, einen imaginären Regenschirm zu verkaufen, der nur drinnen funktioniert.'),
        B('J — One volunteer acts like a tourist who has lost their entire group.', 'Bube — Eine Person spielt einen Touristen, der seine ganze Gruppe verloren hat.'),
        B('Q — Each person delivers one sincere or ridiculous compliment to the group.', 'Dame — Jede Person macht der Gruppe ein ernstes oder absurdes Kompliment.'),
        B('K — Raise a toast to the most unexpected thing that happened this week.', 'König — Stoßt auf die überraschendste Sache an, die diese Woche passiert ist.')
    ];
    function kingsView() {
        if (s.stage === 'finished' || (!s.deck.length && s.stage === 'draw'))
            return commonEnd(B('The deck is finished.', 'Der Kartenstapel ist leer.'));
        if (s.stage === 'draw')
            return card(tag(`${52 - s.deck.length}/52`) + prompt(B('Draw a card.', 'Zieh eine Karte.')) + act(btn('king-draw', T('reveal')), btn('king-end', T('end'), 'secondary')));
        return card(tag(`${T('round')} ${s.round + 1} / 52`) + `<div class="secret" style="font-size:3rem">${ranks[s.card.rank - 1]} ${s.card.suit}</div>` + prompt(kingRules[s.card.rank - 1], true) + act(btn('king-next', T('next'))));
    }
    function houseView() { return card(tag(T('group')) + prompt(B('Pick up to three house rules.', 'Wählt bis zu drei Hausregeln.')) + muted(tx(B('Rules appear above other games. Remove them whenever you want.', 'Regeln erscheinen auch in anderen Spielen. Ihr könnt sie jederzeit entfernen.'))) + activeRules.map((r, i) => `<div class="answer spaced"><span>${esc(tx(r.text))}</span><button class="chip-btn" data-act="house-remove" data-val="${i}">×</button></div>`).join('') + `<div class="divider"></div>` + E.house.map((r, i) => `<button class="option" style="width:100%;margin:6px 0" data-act="house-add" data-val="${i}" ${activeRules.length >= 3 ? 'disabled' : ''}>+ ${esc(tx(r))}</button>`).join('') + act(btn('home', T('change'), 'secondary'))); }
    function boardWin() { const m = s.mark; const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]; return lines.some(line => line.every(i => m[i])); }
    function bingoView() { if (s.stage === 'confirm')
        return card(tag(T('confirm')) + prompt(s.board[s.choice]) + muted(tx(B('Did this actually happen? Two other people confirm aloud.', 'Ist das wirklich passiert? Zwei andere Personen bestätigen es mündlich.'))) + act(btn('bingo-confirm', T('confirm')), btn('bingo-cancel', T('cancel'), 'secondary'))); if (s.stage === 'won')
        return card(tag('BINGO!') + `<div class="card-icon center">🎉</div>` + prompt(B('Three in a row! Cheers to your group.', 'Drei in einer Reihe! Ein Hoch auf euch.')) + act(btn('bingo-reset', T('restart')))); return card(tag(T('group')) + prompt(B('Spot these moments during the party.', 'Entdeckt diese Momente während der Party.'), true) + `<div class="board">${s.board.map((item, i) => `<button class="square ${s.mark[i] ? 'marked' : ''}" data-act="bingo-mark" data-val="${i}" ${s.mark[i] ? 'disabled' : ''}>${s.mark[i] ? '✓ ' : ''}${esc(tx(item))}</button>`).join('')}</div>` + act(btn('bingo-reset', T('reset'), 'secondary'),btn('bingo-back',tx(B('Back to party','Zurück zur Runde')),'secondary'))); }
    function toastView() {
        if (s.round >= s.total)
            return card(tag(T('results')) + prompt(B('Favorite toasts', 'Die beliebtesten Ansprachen')) + scores() + act(btn('restart', T('again')), btn('home', T('change'), 'secondary')));
        const first = n() % 2 ? s.round % n() : (s.round * 2) % n(), second = n() % 2 ? (s.round + 1) % n() : (s.round * 2 + 1) % n();
        return card(tag(`${T('round')} ${s.round + 1}/${s.total}`) + prompt(s.data) + muted(tx(B('Each person gives a 20-second toast. Everyone else votes by a show of hands.', 'Beide halten eine 20-sekündige Ansprache. Alle anderen stimmen per Handzeichen ab.'))) +
            `<div class="answer"><strong>1.</strong> ${esc(gp(first))}</div><div class="answer"><strong>2.</strong> ${esc(gp(second))}</div>` +
            act(btn('toast-first', `${esc(gp(first))} +1`), btn('toast-second', `${esc(gp(second))} +1`, 'secondary'), btn('toast-tie', T('tie'), 'secondary')));
    }
    function truthView() { if (s.stage === 'choose')
        return card(tag(`${T('turn')} ${s.round + 1} · ${esc(gp(s.player))}`) + prompt(B('Truth or Challenge?', 'Wahrheit oder Pflicht?')) + act(btn('truth-truth', L() === 'en' ? 'Truth' : 'Wahrheit'), btn('truth-dare', L() === 'en' ? 'Challenge' : 'Pflicht', 'pink'))); return card(tag(`${esc(gp(s.player))} · ${s.choice === 'truth' ? (L() === 'en' ? 'Truth' : 'Wahrheit') : (L() === 'en' ? 'Challenge' : 'Pflicht')}`) + prompt(s.data) + muted(tx(B('Answer or perform if you want. Skipping is always okay.', 'Antworte oder mach mit, wenn du möchtest. Passen ist immer okay.'))) + act(btn('truth-next', T('passOn')), btn('truth-another', T('retry'), 'secondary'))); }
    // Two V2.4 flagship game flows. Legacy controllers remain unchanged.
    const C24 = window.CHAOS24;
    const deepIds = ['partydeck24', 'kingsnight24', 'impostornight25', 'teamshowdown25', 'socialradar26', 'comedybattle26', 'bluffclub26'];
    let deepSessions = {};
    try {
        const cached=JSON.parse(sessionStorage.getItem('chaosclub.24.sessions')||'{}');
        if(cached && cached.count===n() && cached.games && typeof cached.games==='object')deepSessions=cached.games;
    } catch {}
    const deepKey='chaosclub.24.recent';
    const deepText=(en,de)=>tx(B(en,de));
    function deepSave(){
        if(gameId && deepIds.includes(gameId) && s) deepSessions[gameId]=s;
        try { sessionStorage.setItem('chaosclub.24.sessions', JSON.stringify({count:n(),games:deepSessions})); } catch {}
    }
    function deepRecent(){try {const r=JSON.parse(localStorage.getItem(deepKey)||'[]');return Array.isArray(r)?r:[];}catch{return [];}}
    function deepRemember(id){try {const r=deepRecent().filter(x=>x!==id);r.push(id);localStorage.setItem(deepKey,JSON.stringify(r.slice(-65)));}catch{}}
    function deepInit(){
        if(is26()){init26();return;}
        if(is25()){init25();return;}
        s.stage='setup';s.round=0;s.skipped=0;s.twist=false;s.config=gameId==='partydeck24'
            ? {duration:'standard',style:'relaxed',packs:['social','night','confessions','opinions','challenges']}
            : {duration:'standard',style:'classic'};
        s.rules=[];s.card=null;s.deck=[];s.cards=[];s.reserve=[];s.total=0;s.drawn=0;s.ruleActivated=false;s.ruleEvents=0;s.customize=false;
    }
    function deepPick(items){
        const hist=new Set(deepRecent());
        const avoidStreak=(shuffled,tail=[])=>{
            const out=tail.slice();
            while(shuffled.length){
                const last=out.length>=2&&out[out.length-1].kind===out[out.length-2].kind?out[out.length-1].kind:null;
                const next=last===null?0:shuffled.findIndex(item=>item.kind!==last);
                out.push(shuffled.splice(next<0?0:next,1)[0]);
            }
            return out;
        };
        const unseen=mix(items.filter(x=>!hist.has(x.id))),seen=mix(items.filter(x=>hist.has(x.id)));
        return avoidStreak(seen,avoidStreak(unseen));
    }
    function deepPool(){return C24.pool(prefs.tone).filter(c=>s.config.packs.includes(c.pack));}
    function deepBegin(){
        if(is25()){begin25();return;}
        if(gameId==='partydeck24'){
            const all=deepPool();const target=C24.numberModes[s.config.duration];
            if(all.length<target || !s.config.packs.length)return;
            s.cards=deepPick(all).slice(0,Math.min(all.length,target+8));s.reserve=s.cards.slice(target);s.cards=s.cards.slice(0,target);
            s.total=target;s.round=0;s.skipped=0;s.twist=false;s.stage='card';
        }else{
            s.deck=mix(C24.suits.flatMap(suit=>Array.from({length:13},(_,i)=>({rank:i+1,suit}))));
            s.total=C24.kingModes[s.config.duration];s.round=0;s.drawn=0;s.skipped=0;s.rules=[];s.ruleEvents=0;
            s.stage='draw';s.card=null;
        }
        deepSave();drawScreen();
    }
    function deepOption(action,id,title,sub,selected){return `<button class="deep-choice ${selected?'chosen':''}" data-act="${action}" data-val="${esc(id)}" aria-pressed="${selected?'true':'false'}"><strong>${esc(title)}</strong>${sub?`<span>${esc(sub)}</span>`:''}</button>`;}
    function deepDuration(){
        const party=gameId==='partydeck24';
        const amounts=party?C24.numberModes:C24.kingModes;
        const titles={quick:B('Quick','Kurz'),standard:B('Standard','Standard'),long:B('Long','Lang')};
        const times={quick:'~5–10',standard:'~15–30',long:'~30–60'};
        return `<div class="deep-field"><h3>${deepText('Session length','Spiellänge')}</h3><div class="deep-duration-row">${Object.keys(titles).map(x=>deepOption('deep-duration',x,tx(titles[x]),`${amounts[x]} ${deepText('cards','Karten')} · ${times[x]} min`,s.config.duration===x)).join('')}</div></div>`;
    }
    function deepSetup(){
        const party=gameId==='partydeck24';let extras='';
        if(party){
            const styles={relaxed:B('Relaxed','Entspannt'),rapid:B('Quick-fire','Schnellrunde'),story:B('Story mode','Geschichtenrunde')};
            const descriptions={relaxed:B('No forced timer','Ohne Zeitdruck'),rapid:B('Aim for 20 seconds per card','Etwa 20 Sekunden pro Karte'),story:B('Optional follow-up on each card','Freiwillige Nachfrage auf jeder Karte')};
            extras=`<div class="deep-field"><h3>${deepText('Packs · choose any combination','Pakete · beliebig kombinieren')}</h3><div class="deep-packs">${Object.keys(C24.names).filter(x=>x!=='afterdark'||prefs.tone==='adult').map(x=>deepOption('deep-pack',x,tx(C24.names[x]),'',s.config.packs.includes(x))).join('')}</div></div><div class="deep-field"><h3>${deepText('How to play','Spielstil')}</h3><div class="deep-select">${Object.keys(styles).map(x=>deepOption('deep-style',x,tx(styles[x]),tx(descriptions[x]),s.config.style===x)).join('')}</div></div>`;
        }else{
            const options={classic:[B('Classic','Klassisch'),B('Rules on ranks 2, 7 and Jack','Regeln bei 2, 7 und Bube')],rules:[B('House rules','Hausregeln'),B('Extra offer every four cards','Zusatzregel jede vierte Karte')],chaos:[B('Party chaos','Party-Chaos'),B('Extra offer every three cards','Zusatzregel jede dritte Karte')]};
            extras=`<div class="deep-field"><h3>${deepText('Game variation','Spielvariante')}</h3><div class="deep-select">${Object.keys(options).map(x=>deepOption('deep-style',x,tx(options[x][0]),tx(options[x][1]),s.config.style===x)).join('')}</div></div>`;
        }
        const count=party?deepPool().length:52,needed=party?C24.numberModes[s.config.duration]:C24.kingModes[s.config.duration],insufficient=count<needed;
        const summary=party?`${s.config.packs.length} ${deepText('packs','Pakete')} · ${esc(s.config.style==='relaxed'?deepText('Relaxed','Entspannt'):s.config.style==='rapid'?deepText('Quick-fire','Schnellrunde'):deepText('Story mode','Geschichtenrunde'))}`
            :s.config.style==='classic'?deepText('Classic cards','Klassische Karten'):s.config.style==='rules'?deepText('House rules','Hausregeln'):deepText('Party chaos','Party-Chaos');
        return card(`<div class="deep-setup">${tag(deepText('Choose your session','Wählt eure Runde'))}${prompt(party?B('Your evening, your mix.','Euer Abend, eure Mischung.'):B('One deck. Changing rules.','Ein Deck. Immer neue Regeln.'))}${muted(party?deepText('Read a card; everyone responds. No scores or mandatory drinks.','Karte vorlesen, gemeinsam antworten. Keine Punkte oder Trinkpflicht.'):deepText('Draw a card, do the activity together, and optionally activate short-lived rules.','Karte ziehen, Aktion zusammen spielen und freiwillig Hausregeln aktivieren.'))}${deepDuration()}<button class="deep-customize" data-act="deep-customize" aria-expanded="${s.customize?'true':'false'}"><strong>${s.customize?'−':'+'} ${deepText('Customize packs & rules','Pakete & Regeln anpassen')}</strong><span>${summary}</span></button>${s.customize?extras:''}<p class="deep-inventory" role="status">${party?`${count} ${deepText('different prompts available','verschiedene Fragen verfügbar')}`:`52 ${deepText('different cards available','verschiedene Karten verfügbar')}`} · ${needed} ${deepText('draws','Züge')}</p>${insufficient?`<p class="deep-warning">${deepText('Select more packs or a shorter session to avoid repeats.','Wählt mehr Pakete oder eine kürzere Runde, damit keine Karte doppelt kommt.')}</p>`:''}${act(btn('deep-start',T('start'),'primary',insufficient?'disabled':''))}</div>`);
    }
    const deepTwists={vote:B('Ask someone to defend the opposite choice.','Jemand darf die gegenteilige Wahl verteidigen.'),discuss:B('Everyone gets one sentence before anyone can reply.','Jede Person sagt erst einen Satz, bevor jemand antwortet.'),story:B('Ask one follow-up question, but the storyteller may pass.','Stellt eine Nachfrage; die erzählende Person darf passen.'),choose:B('The minority gets ten seconds to defend their choice.','Die Minderheit darf ihre Wahl zehn Sekunden lang verteidigen.'),perform:B('A second volunteer joins and adds a twist.','Eine zweite freiwillige Person steigt ein und macht es schwieriger.')};
    function deepPartyView(){
        if(s.stage==='setup')return deepSetup();
        if(s.stage==='end')return card(tag(deepText('Session finished','Runde beendet'))+prompt(B('Party Deck','Party Deck'))+`<div class="deep-summary">${s.round}/${s.total} ${deepText('cards completed','Karten gespielt')} · ${s.skipped} ${deepText('swaps','Karten getauscht')}</div>`+act(btn('deep-new',T('again')),btn('home',T('change'),'secondary')));
        const current=s.cards[s.round];if(!current)return card(prompt(B('No more cards.','Keine Karten mehr.'))+act(btn('deep-end',T('finish'))));
        const hint=C24.hints[current.kind]||C24.hints.discuss;
        return card(`${tag(`${s.round+1} / ${s.total} · ${esc(tx(C24.names[current.pack]))}`)}${prompt(current)}<div class="deep-instruction">${esc(tx(hint))}${s.config.style==='rapid'?` <strong>${deepText('20-second challenge.','20-Sekunden-Challenge.')}</strong>`:''}</div>${(s.twist||s.config.style==='story')?`<div class="inline-tip"><b>${deepText('Optional follow-up','Freiwillige Nachfrage')}</b><p>${esc(tx(deepTwists[current.kind]||deepTwists.discuss))}</p></div>`:''}${act(btn('deep-next',T('next')+' →'),btn('deep-swap',deepText('Different card','Andere Karte'),'secondary',s.reserve.length?'':'disabled'),(s.twist||s.config.style==='story')?'':btn('deep-twist',deepText('Add a follow-up','Nachfrage hinzufügen'),'secondary small'))}<div class="deep-bottom">${btn('deep-end',deepText('End session','Runde beenden'),'secondary small')}</div>`);
    }
    const kingRanks=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    function deepKingView(){
        if(s.stage==='setup')return deepSetup();
        if(s.stage==='end')return card(tag(deepText('Session complete','Runde beendet'))+prompt(B('King’s Night','King’s Night'))+`<div class="deep-summary">${s.round-s.skipped} ${deepText('cards played','Karten gespielt')} · ${s.skipped} ${deepText('skipped','übersprungen')} · ${s.ruleEvents} ${deepText('rules activated','Regeln aktiviert')}</div>`+act(btn('deep-new',T('again')),btn('home',T('change'),'secondary')));
        const remaining=Math.max(0,s.total-s.round);
        if(s.stage==='draw')return card(tag(`${s.round+1}/${s.total}`)+prompt(B('Draw the next card.','Zieht die nächste Karte.'))+`<p class="deep-instruction">${deepText('One phone stays on the table. Pass the turn to the next person.','Ein Handy bleibt auf dem Tisch. Die nächste Person ist dran.')}</p>${deepRulePanel()}${act(btn('king24-draw',deepText('Draw a card','Karte ziehen')),btn('deep-end',deepText('End session','Runde beenden'),'secondary'))}<p class="smallprint">${remaining} ${T('remaining')}</p>`);
        const c=s.card, canRule=C24.ruleRanks.includes(c.rank)||(s.config.style==='rules'&&s.round%4===3)||(s.config.style==='chaos'&&s.round%3===2);
        const rule=C24.kingRule(c);const canAdd=canRule&&!s.ruleActivated&&s.rules.length<3;
        return card(tag(`${s.round+1}/${s.total} · ${esc(tx(C24.suitNames[c.suit]))}`)+`<div class="deep-card-face" aria-label="${esc(kingRanks[c.rank-1]+' '+c.suit)}">${kingRanks[c.rank-1]} ${c.suit}</div>`+prompt(C24.kingEvent(c.rank,c.suit))+muted(deepText('Do the activity together, or skip it.','Macht die Aktion zusammen – oder passt.'))+deepRulePanel()+`${canRule?`<div class="deep-rule-offer">${esc(deepText('Optional rule for the next four drawn cards (skips count)','Optionale Regel für die nächsten vier gezogenen Karten (auch übersprungene)'))}<p>${esc(tx(rule))}</p>${s.ruleActivated?`<strong>${deepText('Rule active','Regel aktiv')}</strong>`:s.rules.length>=3?`<span>${deepText('Maximum three active rules. Remove one to make room.','Maximal drei Regeln. Entferne zuerst eine.')}</span>`:btn('king24-rule',deepText('Activate rule','Regel aktivieren'),'secondary small')}</div>`:''}`+act(btn('king24-next',deepText('Card complete','Karte erledigt')),btn('king24-skip',T('skip'),'secondary'))+`<div class="deep-bottom">${btn('deep-end',deepText('End session','Runde beenden'),'secondary small')}</div>`);
    }
    function deepRulePanel(){if(!s.rules.length)return '';
        return `<div class="deep-rules"><h3>${deepText('Active house rules','Aktive Hausregeln')}</h3>${s.rules.map((r,i)=>`<div class="deep-rule"><span>${esc(tx(r.text))} <small>· ${Math.max(0,r.expiresAfter-s.round-1)} ${deepText('future cards','weitere Karten')}</small></span><button data-act="king24-remove" data-val="${i}" class="chip-btn" aria-label="${deepText('Remove rule','Regel entfernen')}">×</button></div>`).join('')}</div>`;
    }
    // V2.5 session controllers. One-device group play; the original 34 modes remain untouched.
    const C25=window.CHAOS25;
    const is25=()=>gameId==='impostornight25'||gameId==='teamshowdown25';
    const isImp25=()=>gameId==='impostornight25';
    const q25=(en,de)=>deepText(en,de);
    const t25=p=>esc(tx(p));
    function init25(){
        s.stage='setup';s.round=0;s.config={duration:'standard',style:isImp25()?'mixed':'classic'};
        s.total=0;s.points=Array(n()).fill(0);s.scores=[0,0];s.customize=false;
    }
    function begin25(){
        if(isImp25()){
            s.total=C25.durations[s.config.duration].imp;s.roleOrder=C25.rotateRoles(n(),s.total,mix);
            s.pools={undercover:mix([...(D.undercover||[]),...C25.pairs]),spy:mix([...(D.spyLocations||[]),...C25.locations]),mimic:mix([...(E.mimic||[]),...C25.actions])};
            s.indices={undercover:0,spy:0,mimic:0};s.round=0;s.points=Array(n()).fill(0);nextImp25();
        }else{
            const variant=s.config.style;
            const pool=variant==='taboo'?[...(D.taboo||[]),...C25.extraTaboo].map(x=>({w:x.w,ban:x.ban}))
                :[...(E.three||[]),...(D.charades||[]),...C25.concepts].map(w=>({w,ban:[]}));
            const deduped=[];const seen=new Set();
            for(const item of pool){const key=item.w.en.toLowerCase().trim();if(!seen.has(key)){deduped.push(item);seen.add(key);}}
            const size=C25.durations[s.config.duration].cards;
            if(deduped.length<size)return;
            s.cards=mix(deduped).slice(0,size);s.totalPhases=C25.durations[s.config.duration].team;
            s.phase=0;s.round=0;s.scores=[0,0];s.team=0;s.teamTurns=[0,0];s.members=C25.teamMembers(n());
            s.remaining=mix(s.cards);s.stage='between';s.remainingTime=null;s.correct=0;s.passes=0;s.timedOut=0;
        }
        deepSave();drawScreen();
    }
    function nextImp25(){
        if(s.round>=s.total){s.stage='end';return;}
        s.variant=s.config.style==='mixed'?C25.variants[1+(s.round%3)]:s.config.style;
        const index=s.indices[s.variant]++;
        s.word=s.pools[s.variant][index%s.pools[s.variant].length];
        s.undercover=s.roleOrder[s.round];s.stage='cover';s.player=0;s.phase=0;
        s.candidates=Array.from({length:n()},(_,i)=>i);s.roleVotes=Array(n()).fill(0);
        s.abstentions=0;s.runoff=0;s.accused=null;s.spyGuess='';s.spyCorrect=false;s.lastResult=null;
    }
    function scoreImp25(accused,correct=false){
        s.lastResult=C25.applyResult(s.points,s.undercover,s.variant,accused,correct);
        s.points=s.lastResult.scores;s.accused=accused;s.stage='result';
    }
    function imp25View(){
        if(s.stage==='setup')return setup25();
        if(s.stage==='end')return card(tag(q25('Session complete','Runde beendet'))+prompt(B('Impostor Night','Impostor-Nacht'))+score25(s.points.map((x,i)=>[gp(i),x]))+act(btn('deep25-restart',T('again')),btn('home',T('change'),'secondary')));
        const kind=s.variant;const lab=kind==='undercover'?B('Undercover','Undercover'):kind==='spy'?B('Find the Spy','Findet den Spion'):B('The Mimic','Der Mitmacher');
        const subtitle=`${q25('Match','Match')} ${s.round+1}/${s.total} · ${t25(lab)}`;
        if(s.stage==='cover')return card(tag(subtitle)+prompt(B('Pass the phone privately.','Gebt das Handy verdeckt weiter.'))+`<div class="deep25-player">${esc(gp(s.player))} · ${s.player+1}/${n()}</div>`+muted(q25('Only this player should tap Reveal.','Nur diese Person darf auf Aufdecken tippen.'))+act(btn('imp25-see',T('reveal'))));
        if(s.stage==='see'){
            const bad=s.player===s.undercover;
            let role=bad?B('Impostor','Betrüger'):B('In the know','Eingeweiht');
            let detail='';
            if(kind==='undercover')detail=t25(s.word[bad?1:0]);
            if(kind==='spy')detail=bad?q25('You do not know the location. Blend in.','Du kennst den Ort nicht. Fall nicht auf.'):t25(s.word);
            if(kind==='mimic')detail=bad?q25('You have not seen the actions. Copy the group.','Du kennst die Aktionen nicht. Mach die Gruppe nach.'):s.word.map((w,i)=>`${i+1}. ${t25(w)}`).join('<br>');
            return card(tag(subtitle)+`<div class="deep25-secret"><strong>${t25(role)}</strong><div>${detail}</div></div>`+muted(q25('Remember your clue. Hide the screen before passing.','Merke dir den Hinweis. Verstecke ihn vor dem Weitergeben.'))+act(btn('imp25-hide',T('hide'))));
        }
        if(s.stage==='talk'){
            const messages={undercover:B('Each person gives one clue without saying the secret word. Discuss who sounds different.','Alle geben einen Hinweis, ohne ihr Wort zu sagen. Diskutiert, wer anders klingt.'),spy:B('Ask each other two rounds of questions without naming the location. The Spy must blend in.','Stellt euch zwei Fragerunden, ohne den Ort zu nennen. Der Spion muss mitraten.'),mimic:B('Count down from three. Everyone performs the current secret action at once; the Mimic copies.','Zählt von drei herunter. Alle machen gleichzeitig die geheime Aktion; der Mitmacher kopiert.')};
            return card(tag(subtitle)+prompt(kind==='spy'?B('Who is the Spy?','Wer ist der Spion?'):kind==='mimic'?B('Spot the Mimic.','Enttarnt den Mitmacher.'):B('Who has the different word?','Wer hat das andere Wort?'))+muted(tx(messages[kind]))+(kind==='mimic'?`<div class="deep25-stage">${q25('Action','Aktion')} ${s.phase+1}/3</div>`:'')+act(kind==='mimic'&&s.phase<2?btn('imp25-action',q25('Next action','Nächste Aktion')):btn('imp25-vote',q25('Count group votes','Gruppenstimmen zählen')))+`<div class="deep-bottom">${btn('deep25-end',q25('End session','Runde beenden'),'secondary small')}</div>`);
        }
        if(s.stage==='vote'){
            const total=s.roleVotes.reduce((a,b)=>a+b,0)+s.abstentions;
            const full=total===n();
            return card(tag(subtitle+(s.runoff?' · '+q25('Runoff','Stichwahl'):''))+prompt(B('Who is the impostor?','Wer ist der Betrüger?'))+muted(q25('Everyone points to one suspect. Enter all votes, including abstentions.','Alle zeigen auf eine verdächtige Person. Tragt alle Stimmen und Enthaltungen ein.'))+s.candidates.map(i=>`<div class="answer spaced"><strong>${esc(gp(i))}</strong><span><button class="chip-btn" data-act="imp25-minus" data-val="${i}" ${s.roleVotes[i]? '':'disabled'} aria-label="${q25('Remove vote','Stimme entfernen')}">−</button> <b>${s.roleVotes[i]}</b> <button class="chip-btn" data-act="imp25-plus" data-val="${i}" ${full?'disabled':''} aria-label="${q25('Add vote','Stimme hinzufügen')}">+</button></span></div>`).join('')+`<p class="deep25-progress">${total}/${n()} ${q25('votes recorded','Stimmen eingetragen')} · ${s.abstentions} ${q25('abstentions','Enthaltungen')}</p>`+act(btn('imp25-abstain','+ '+q25('Abstention','Enthaltung'),'secondary',full?'disabled':''),btn('imp25-unabstain','− '+q25('Abstention','Enthaltung'),'secondary',s.abstentions?'':'disabled'),btn('imp25-decide',q25('Reveal vote','Abstimmung auswerten'),'primary',full?'':'disabled')));
        }
        if(s.stage==='spyguess')return card(tag(subtitle)+prompt(B('The Spy was caught! One last chance.','Der Spion ist enttarnt! Eine letzte Chance.'))+muted(q25('The Spy names the location. The group will judge whether the answer matches.','Der Spion nennt den Ort. Die Gruppe entscheidet, ob die Antwort passt.'))+`<input id="imp25-location" class="input" maxlength="80" placeholder="${q25('Location guess','Ortsvermutung')}" aria-label="${q25('Location guess','Ortsvermutung')}">`+act(btn('imp25-guess',q25('Check guess','Tipp prüfen')),btn('imp25-forfeit',q25('No guess','Kein Tipp'),'secondary')));
        if(s.stage==='spyjudge')return card(tag(subtitle)+prompt(B('Does the answer match?','Ist der Tipp richtig?'))+`<div class="answer">${esc(s.spyGuess)}</div><div class="deep25-secret">${t25(s.word)}</div>`+muted(q25('Accept synonyms and different spelling; decide together.','Synonyme und andere Schreibweisen gelten; entscheidet gemeinsam.'))+act(btn('imp25-correct',q25('Yes, correct','Ja, richtig')),btn('imp25-wrong',q25('No, wrong','Nein, falsch'),'secondary')));
        const role=s.undercover, win=s.lastResult.groupWins;
        const reveal=kind==='undercover'?`${t25(s.word[0])} / ${t25(s.word[1])}`:kind==='spy'?t25(s.word):s.word.map(t25).join(' · ');
        return card(tag(subtitle)+prompt(win?B('The group found the impostor!','Die Runde hat den Betrüger enttarnt!'):B('The impostor escaped!','Der Betrüger ist entkommen!'))+`<div class="deep25-secret">${esc(gp(role))}<div class="deep25-smaller">${reveal}</div></div>`+score25(s.points.map((x,i)=>[gp(i),x]))+act(btn('imp25-next',s.round+1===s.total?q25('Final standings','Endstand'):q25('Next match','Nächstes Match')),btn('deep25-end',q25('End session','Runde beenden'),'secondary')));
    }
    function score25(data){return `<div class="deep25-scores">${data.map(([name,score])=>`<div><span>${esc(name)}</span><b>${score} ${q25('pts','Pkt.')}</b></div>`).join('')}</div>`;}
    function team25Stage(){return C25.stageNames[s.config.style][s.phase];}
    function team25View(){
        if(s.stage==='setup')return setup25();
        if(s.stage==='end'){
            const winner=s.scores[0]===s.scores[1]?q25('Tie game','Unentschieden'):s.scores[0]>s.scores[1]?q25('Team A wins','Team A gewinnt'):q25('Team B wins','Team B gewinnt');
            return card(tag(q25('Final results','Endergebnis'))+prompt(B('Team Showdown complete!','Team-Duell beendet!'))+`<div class="deep25-stage">${winner}</div>`+score25([[q25('Team A','Team A'),s.scores[0]],[q25('Team B','Team B'),s.scores[1]]])+muted(`${s.correct} ${q25('correct guesses','richtig erratene Begriffe')} · ${s.passes} ${q25('passes','Übersprungen')}`)+act(btn('deep25-restart',T('again')),btn('home',T('change'),'secondary')));
        }
        const team=s.team,actor=s.members[team][s.teamTurns[team]%s.members[team].length],name=gp(actor);
        const summary=`${q25('Stage','Phase')} ${s.phase+1}/${s.totalPhases} · ${s.remaining.length}/${s.cards.length} ${q25('cards left','Karten übrig')}`;
        const help=team25Stage();
        if(s.stage==='between'||s.stage==='paused'){const paused=s.stage==='paused';return card(tag(summary)+prompt(help)+`<div class="deep25-stage">${q25('Team','Team')} ${team===0?'A':'B'} · ${esc(name)}</div>`+muted(paused?q25('Turn paused. The same clue-giver continues with the remaining time.','Zug pausiert. Dieselbe Person erklärt mit der verbleibenden Zeit weiter.'):q25('Pass the phone to the clue-giver. Their team guesses as many cards as possible in 45 seconds.','Gebt das Handy an die erklärende Person. Das Team errät in 45 Sekunden so viele Begriffe wie möglich.'))+score25([[q25('Team A','Team A'),s.scores[0]],[q25('Team B','Team B'),s.scores[1]]])+act(btn('team25-start',paused?`${q25('Resume','Fortsetzen')} · ${s.remainingTime||45}s`:q25('Start 45-second turn','45-Sekunden-Zug starten')),btn('deep25-end',q25('End session','Runde beenden'),'secondary')));}
        const item=s.remaining[0];
        if(!item)return card(prompt(B('Ready for the next stage.','Bereit für die nächste Phase.')));
        const ban=s.config.style==='taboo'&&s.phase===0&&item.ban?.length?`<div class="deep25-ban"><b>${q25('Do not say','Nicht sagen')}:</b> ${item.ban.map(t25).join(' · ')}</div>`:'';
        return card(tag(summary)+`<div class="deep25-timer" id="timer-view" role="timer">${s.deadline?Math.max(0,Math.ceil((s.deadline-Date.now())/1000)):45}</div>`+`<div class="deep25-stage">${q25('Team','Team')} ${team===0?'A':'B'} · ${esc(name)} · ${t25(help)}</div>`+prompt(item.w)+ban+act(btn('team25-correct',q25('Guessed! +1','Erraten! +1')),btn('team25-pass',T('skip'),'secondary'),btn('team25-pause',q25('Pause','Pause'),'secondary'),btn('team25-finish',q25('Finish turn','Zug beenden'),'secondary')));
    }
    function setup25(){
        const isImp=isImp25(),config=s.config;
        const names=isImp?{mixed:B('Mixed modes','Gemischte Modi'),undercover:B('Undercover','Undercover'),spy:B('Find the Spy','Findet den Spion'),mimic:B('The Mimic','Der Mitmacher')}
            :{classic:B('Classic three stages','Drei klassische Phasen'),taboo:B('Forbidden words first','Zuerst Tabuwörter'),chaos:B('Acting before one-word clues','Pantomime vor Ein-Wort-Hinweisen')};
        const numbers=C25.durations[config.duration],qty=isImp?numbers.imp:numbers.cards,phases=isImp?'':` · ${numbers.team} ${q25('stages','Phasen')}`;
        return card(`<div class="deep-setup">${tag(q25('Choose your session','Wählt eure Runde'))}${prompt(isImp?B('Find the impostor. Again and again.','Enttarnt den Betrüger – Runde für Runde.'):B('The same clues. New restrictions.','Dieselben Begriffe. Neue Regeln.'))}${muted(isImp?q25('One hidden role per match. Rotate, accuse and track the score.','Pro Match eine geheime Rolle. Wechselt euch ab, stimmt ab und sammelt Punkte.'):q25('Two teams explain and guess. The same cards return with harder rules.','Zwei Teams erklären und raten. Dieselben Karten kommen mit schwierigeren Regeln zurück.'))}<div class="deep-field"><h3>${q25('Session length','Spiellänge')}</h3><div class="deep-duration-row">${Object.keys(C25.durations).map(d=>deepOption('deep25-duration',d,d==='quick'?q25('Quick','Kurz'):d==='long'?q25('Long','Lang'):q25('Standard','Standard'),`${isImp?C25.durations[d].imp:C25.durations[d].cards} ${isImp?q25('matches','Matches'):q25('cards','Karten')}${!isImp?' · '+C25.durations[d].team+' '+q25('stages','Phasen'):''}`,config.duration===d)).join('')}</div></div><button class="deep-customize" data-act="deep25-customize" aria-expanded="${s.customize?'true':'false'}"><strong>${s.customize?'−':'+'} ${q25('Choose variation','Variante wählen')}</strong><span>${t25(names[config.style])}</span></button>${s.customize?`<div class="deep-field deep-select">${Object.entries(names).map(([id,title])=>deepOption('deep25-style',id,t25(title),'',config.style===id)).join('')}</div>`:''}<p class="deep-inventory">${qty} ${isImp?q25('matches','Matches'):q25('cards','Karten')}${phases} · ${n()} ${q25('players','Personen')}</p>${act(btn('deep25-start',T('start')))}</div>`);
    }
    function help25(){
        const sections=isImp25()?[
            [B('Quick start','Schnellstart'),[B('Choose a variant and number of matches. Pass the phone privately so everyone can see their role.','Wählt Variante und Matchanzahl. Gebt das Handy verdeckt weiter, damit alle ihre Rolle sehen.'),B('Undercover: give one clue each; Spy: ask questions about the hidden location; Mimic: perform three actions together while one player copies.','Undercover: Gebt je einen Hinweis; Spion: Fragt nach dem geheimen Ort; Mitmacher: Macht drei Aktionen gleichzeitig, während eine Person kopiert.'),B('Everyone points at a suspect. Enter all votes or abstentions; ties get one runoff. Reveal the culprit and scores.','Alle zeigen auf Verdächtige. Tragt alle Stimmen oder Enthaltungen ein; bei Gleichstand gibt es eine Stichwahl. Dann folgt die Auflösung.')]],
            [B('Scoring, variants and ending','Punkte, Varianten und Ende'),[B('A correct accusation gives each non-impostor 1 point. An escaped impostor gains 2 points. A caught Spy can still win by correctly guessing the location.','Bei richtiger Wahl bekommen alle Nicht-Betrüger einen Punkt. Entkommt der Betrüger, gibt es zwei Punkte für ihn. Ein ertappter Spion kann noch durch Erraten des Ortes gewinnen.'),B('Quick: 1 match; Standard: 4; Long: 8. Mixed rotates through Undercover, Spy and Mimic. Different players receive the hidden role across matches.','Kurz: 1 Match; Standard: 4; Lang: 8. Gemischt wechselt zwischen Undercover, Spion und Mitmacher. Die geheime Rolle wandert durch die Runde.'),B('The group judges Spy location guesses and can end the session any time. Drinking is never required.','Die Gruppe bewertet Orts-Tipps und kann die Runde jederzeit beenden. Trinken ist freiwillig.')]]
        ]:[
            [B('Quick start','Schnellstart'),[B('Split into two teams by alternating around the table (players 1,3,5 vs 2,4,6). One clue-giver from the active team holds the phone.','Teilt euch abwechselnd in zwei Teams (Personen 1,3,5 gegen 2,4,6). Eine Person aus dem Team hält das Handy.'),B('Start a 45-second turn. Get as many cards guessed as possible; each guessed card is 1 point. Pass rotates the card to the back without scoring.','Startet einen 45-Sekunden-Zug. Jeder erratene Begriff bringt einen Punkt. Überspringen schiebt die Karte ohne Punkt ans Ende.'),B('When time runs out or you tap Finish turn, the other team plays. All cards return for the next stage under different restrictions.','Nach Zeitablauf oder Zug beenden spielt das andere Team. In der nächsten Phase kommen alle Karten mit neuen Einschränkungen zurück.')]],
            [B('Modes and scoring','Varianten und Punkte'),[B('Classic: describe freely, then one-word clues, then act silently. Taboo: begin by describing without the three forbidden words. Chaos: mime before one-word clues.','Klassisch: frei erklären, dann ein Wort, dann Pantomime. Tabu: zuerst erklären ohne drei verbotene Wörter. Chaos: Pantomime vor Ein-Wort-Hinweisen.'),B('Quick: 8 cards/1 stage; Standard: 12 cards/2 stages; Long: 18 cards/3 stages. The same cards repeat across stages; this is intentional.','Kurz: 8 Begriffe/1 Phase; Standard: 12 Begriffe/2 Phasen; Lang: 18 Begriffe/3 Phasen. Dieselben Karten kehren absichtlich zurück.'),B('Scores carry across stages. The team with more points wins; ties remain ties. With five people, teams have 3 and 2 players; clue-givers rotate within each team.','Punkte werden übernommen. Das Team mit mehr Punkten gewinnt; Gleichstand bleibt bestehen. Bei fünf Personen spielen Teams mit 3 und 2 Mitgliedern; die Erklärenden wechseln sich ab.')]]
        ];
        return `<div class="help deep-guide">${sections.map(([title,steps])=>`<h3>${t25(title)}</h3><ol>${steps.map(x=>`<li>${t25(x)}</li>`).join('')}</ol>`).join('')}</div>`;
    }
    function handle25(action,value){
        if(!s||!is25())return false;
        if(action==='deep25-duration'&&s.stage==='setup'&&C25.durations[value])s.config.duration=value;
        else if(action==='deep25-customize'&&s.stage==='setup')s.customize=!s.customize;
        else if(action==='deep25-style'&&s.stage==='setup'&&(isImp25()?C25.variants:C25.teamVariants).includes(value))s.config.style=value;
        else if(action==='deep25-start'&&s.stage==='setup'){begin25();return true;}
        else if(action==='deep25-restart'){resetTimers();init25();}
        else if(action==='deep25-end'&&s.stage!=='end'){resetTimers();s.stage='end';}
        else if(isImp25()){
            if(action==='imp25-see'&&s.stage==='cover')s.stage='see';
            else if(action==='imp25-hide'&&s.stage==='see'){s.player++;s.stage=s.player===n()?'talk':'cover';}
            else if(action==='imp25-action'&&s.stage==='talk'&&s.variant==='mimic'&&s.phase<2)s.phase++;
            else if(action==='imp25-vote'&&s.stage==='talk'){s.stage='vote';}
            else if(['imp25-plus','imp25-minus'].includes(action)&&s.stage==='vote'){
                const i=Number(value),total=s.roleVotes.reduce((a,b)=>a+b,0)+s.abstentions;
                if(s.candidates.includes(i)&&action==='imp25-plus'&&total<n())s.roleVotes[i]++;
                else if(s.candidates.includes(i)&&action==='imp25-minus'&&s.roleVotes[i]>0)s.roleVotes[i]--;
            }
            else if(action==='imp25-abstain'&&s.stage==='vote'&&s.roleVotes.reduce((a,b)=>a+b,0)+s.abstentions<n())s.abstentions++;
            else if(action==='imp25-unabstain'&&s.stage==='vote'&&s.abstentions>0)s.abstentions--;
            else if(action==='imp25-decide'&&s.stage==='vote'){
                const decision=C25.tally(s.roleVotes,s.abstentions,n(),s.candidates,s.runoff);
                if(decision.status==='incomplete'||decision.status==='invalid')return true;
                if(decision.status==='runoff'){
                    s.runoff=1;s.candidates=decision.candidates;s.roleVotes=Array(n()).fill(0);s.abstentions=0;
                }else if(s.variant==='spy'&&decision.suspect===s.undercover){s.accused=decision.suspect;s.stage='spyguess';}
                else scoreImp25(decision.suspect);
            }
            else if(action==='imp25-guess'&&s.stage==='spyguess'){
                s.spyGuess=document.getElementById('imp25-location')?.value.trim().slice(0,80)||'';
                if(!s.spyGuess)return true;s.stage='spyjudge';
            }
            else if(action==='imp25-forfeit'&&s.stage==='spyguess')scoreImp25(s.accused,false);
            else if(['imp25-correct','imp25-wrong'].includes(action)&&s.stage==='spyjudge')scoreImp25(s.accused,action==='imp25-correct');
            else if(action==='imp25-next'&&s.stage==='result'){s.round++;nextImp25();}
            else return false;
        }else{
            if(action==='team25-start'&&(s.stage==='between'||s.stage==='paused')){
                const left=s.stage==='paused'?Math.max(1,Math.min(45,s.remainingTime||45)):45;
                s.stage='active';s.remainingTime=left;updateTimer(left,()=>{if(gameId==='teamshowdown25'&&s?.stage==='active'){endTeam25Turn(true);deepSave();drawScreen();}});
            }
            else if(action==='team25-correct'&&s.stage==='active'){
                s.scores[s.team]++;s.correct++;s.remaining.shift();
                if(!s.remaining.length){
                    resetTimers();s.phase++;
                    if(s.phase>=s.totalPhases)s.stage='end';
                    else {s.remaining=mix(s.cards);endTeam25Turn(false);}
                }
            }
            else if(action==='team25-pass'&&s.stage==='active'){
                s.passes++;if(s.remaining.length>1)s.remaining.push(s.remaining.shift());
            }
            else if(action==='team25-pause'&&s.stage==='active'){pauseTeam25();}
            else if(action==='team25-finish'&&s.stage==='active'){resetTimers();endTeam25Turn(false);}
            else return false;
        }
        deepSave();drawScreen();return true;
    }
    function pauseTeam25(){
        if(!s||s.stage!=='active')return;
        s.remainingTime=Math.max(1,Math.min(45,Math.ceil(((s.deadline||Date.now())-Date.now())/1000)));
        resetTimers();s.deadline=null;s.stage='paused';
    }
    function endTeam25Turn(timedOut){
        if(s.stage==='end')return;
        if(timedOut)s.timedOut++;
        s.remainingTime=null;
        s.teamTurns[s.team]++;s.team=1-s.team;s.stage='between';s.deadline=null;
    }

    // Seven existing families remain; V2.7 improves choice integrity, variety and pacing.
    const C26=window.CHAOS26, C27=window.CHAOS27;
    const recent26Key='chaosclub.27.recent';
    function recent26(){try{const values=JSON.parse(localStorage.getItem(recent26Key)||'[]');return Array.isArray(values)?values.filter(x=>typeof x==='string').slice(-160):[];}catch{return [];}}
    function remember26(){if(!s?.item?._key)return;try{localStorage.setItem(recent26Key,JSON.stringify(C27.remember(recent26(),s.item._key)));}catch{}}
    const is26=()=>['socialradar26','comedybattle26','bluffclub26'].includes(gameId);
    const type26=()=>gameId==='socialradar26'?'social':gameId==='comedybattle26'?'comedy':'bluff';
    const q26=(en,de)=>deepText(en,de);
    const t26=p=>esc(tx(p));
    const kinds26={social:{mixed:B('Mixed','Gemischt'),majority:B('Read the room','Gruppenmeinung'),same:B('Same brain','Gleich gedacht'),know:B('Know your friends','Freunde kennen')},comedy:{mixed:B('Comedy mix','Comedy-Mix'),punchline:B('Punchlines','Pointen'),pitch:B('Terrible pitches','Schlechte Pitches'),expert:B('Fake experts','Scheinexperten'),toast:B('Toast battle','Trinksprüche')},bluff:{mixed:B('Bluff mix','Bluff-Mix'),confession:B('True or invented','Wahr oder erfunden'),twotruths:B('Two truths, one lie','Zwei Wahrheiten, eine Lüge'),fact:B('Fact trap','Faktenfalle')}};
    const labels26={social:B('Social Radar','Social Radar'),comedy:B('Comedy Battle','Comedy-Battle'),bluff:B('Bluff Club','Bluff-Club')};
    function init26(){s.stage='setup';s.round=0;s.config={duration:'standard',style:'mixed'};s.customize=false;s.items=[];s.total=0;s.groupPoints=0;s.bluffPoints=0;s.scores=Array(n()).fill(0);s.last=null;s.pairs=[];s.played=0;s.skipped=0;s.config.switchups=true;}
    function begin26(){
        const type=type26(), total=C26.durations[s.config.duration][type];
        const items=C26.build(type,s.config.style,E,D,mix,recent26());
        if(items.length<total){s.error=q26('Not enough unique cards. Choose Mixed or a shorter session.','Nicht genügend verschiedene Karten. Wählt Gemischt oder eine kürzere Runde.');return;}
        s.items=items.slice(0,total);s.total=total;s.round=0;s.groupPoints=0;s.bluffPoints=0;s.scores=Array(n()).fill(0);s.last=null;s.error='';s.played=0;s.skipped=0;
        s.pairs=type==='comedy'?C26.pairs(n(),total):[];
        next26();deepSave();drawScreen();
    }
    function next26(){
        if(s.round>=s.total){s.stage='end';return;}
        s.item=s.items[s.round];s.actor=s.round%n();s.count=null;s.privateChoice=null;s.last=null;
        if(type26()==='social')s.stage=s.item.type==='same'?'talk':'private';
        else if(type26()==='comedy')s.stage='performA';
        else s.stage=s.item.type==='fact'?'factCover':s.item.type==='twotruths'?'lieCover':'truthCover';
    }
    function summary26(){const kind=type26();return `${s.round+1}/${s.total} · ${t26(kinds26[kind][s.item.type])}`;}
    function dashboard26(){if(type26()==='social')return `<div class="deep26-score" aria-label="${q26('Group score','Gruppenpunkte')}">${q26('Group points','Gruppenpunkte')}: <strong>${s.groupPoints}</strong></div>`;
        if(type26()==='bluff')return `<div class="deep26-score">${q26('Group deductions','Richtig enttarnt')}: <strong>${s.groupPoints}</strong> · ${q26('Successful bluffs','Gelungene Bluffs')}: <strong>${s.bluffPoints}</strong></div>`;
        return score25(s.scores.map((v,i)=>[gp(i),v]));}
    function tallyInput26(label,max,min=0){return `<div class="deep26-tally"><div>${esc(label)}</div><div class="deep27-votes" role="group" aria-label="${esc(label)}">${Array.from({length:max-min+1},(_,i)=>i+min).map(v=>`<button class="deep27-vote ${s.count===v?'selected':''}" data-act="deep26-tally" data-val="${v}" aria-pressed="${s.count===v}">${v}</button>`).join('')}</div><small>${q26('Choose the number agreed by the group.','Wählt die gemeinsam gezählte Stimmenzahl.')}</small></div>`;}
    function setup26(){const kind=type26(), length=s.config.duration, opts=kinds26[kind];
        const hint=kind==='social'?B('Predict the group. Everyone participates aloud.','Sagt die Gruppenmeinung voraus. Alle machen laut mit.'):kind==='comedy'?B('Two performers, one prompt. The others decide who wins.','Zwei Personen, eine Aufgabe. Die übrigen entscheiden, wer gewinnt.'):B('Tell a story or invent a convincing lie. The group investigates.','Erzählt Geschichten oder erfindet glaubwürdige Lügen. Die Runde ermittelt.');
        const count=C26.build(kind,s.config.style,E,D,mix).length;
        return card(`<div class="deep-setup">${tag(q26('Choose a session','Spiellänge wählen'))}${prompt(labels26[kind])}${muted(tx(hint))}<div class="deep-duration-row">${['quick','standard','long'].map(d=>deepOption('deep26-duration',d,d==='quick'?q26('Quick','Kurz'):d==='long'?q26('Long','Lang'):q26('Standard','Standard'),`${C26.durations[d][kind]} ${q26('rounds','Runden')}`,length===d)).join('')}</div><button class="deep-customize" data-act="deep26-customize" aria-expanded="${s.customize}"><strong>${s.customize?'−':'+'} ${q26('Choose a variation','Variante wählen')}</strong><span>${t26(opts[s.config.style])}</span></button>${s.customize?`<div class="deep-field deep-select">${Object.entries(opts).map(([k,v])=>deepOption('deep26-style',k,t26(v),'',s.config.style===k)).join('')}<div class="deep27-switchup">${deepOption('deep26-switchups',s.config.switchups?'off':'on',q26('Round switch-ups','Rundenwechsel'),q26(s.config.switchups?'On: a different rule every fourth round':'Off: play with the standard rules',s.config.switchups?'An: jede vierte Runde eine neue Regel':'Aus: normale Regeln'),s.config.switchups)}</div></div>`:''}<p class="deep-inventory">${count} ${q26('unique prompts available','verschiedene Aufgaben verfügbar')} · ${n()} ${q26('players','Personen')}</p>${s.error?`<p class="deep-warning">${esc(s.error)}</p>`:''}${act(btn('deep26-start',T('start'),'primary',count<C26.durations[length][kind]?'disabled':''))}</div>`);
    }
    function view26(){
      const kind=type26();if(s.stage==='setup')return setup26();
      if(s.stage==='end')return card(tag(q26('Session finished','Runde beendet'))+prompt(labels26[kind])+dashboard26()+`<p class="deep26-notice">${Number.isInteger(s.played)?s.played:s.round} / ${s.total} ${q26('rounds played','Runden gespielt')} · ${s.skipped||0} ${q26('skipped','übersprungen')}</p>`+act(btn('deep26-restart',T('again')),btn('home',T('change'),'secondary')));
      const item=s.item, special=C27.twist(kind,item.type,s.round,s.config.duration,s.config.switchups!==false);const header=tag(summary26())+(special?`<div class="deep27-twist"><strong>${q26('RULE CHANGE','SONDERRUNDE')}</strong><span>${t26(special)}</span></div>`:'');
      if(kind==='social'){
        if(s.stage==='private')return card(header+prompt(item.q)+`<div class="deep26-speaker">${esc(gp(s.actor))} · ${q26('Choose secretly','Heimlich entscheiden')}</div>`+muted(q26('Only this player looks at the screen. Do not tell the others yet.','Nur diese Person schaut aufs Handy. Verrate deine Wahl noch nicht.'))+`<div class="deep26-choices">${item.options.map((x,i)=>`<button class="btn secondary" data-act="deep26-secret" data-val="${i}">${i===0?'A':'B'} · ${t26(x)}</button>`).join('')}</div>`);
        if(s.stage==='hidden')return card(header+prompt(B('Pass the phone to the group.','Gebt das Handy an die Runde.'))+muted(q26('The secret choice is hidden. Everyone else votes aloud or points together.','Die geheime Wahl ist verborgen. Alle anderen stimmen laut oder mit Handzeichen ab.'))+act(btn('deep26-open',T('ready'))));
        if(s.stage==='talk')return card(header+prompt(item.q)+muted(q26('Think briefly. On three, everyone says one answer at the same time. Then count the largest group with exactly matching answers.','Denkt kurz nach. Auf drei nennen alle gleichzeitig eine Antwort. Zählt anschließend die größte Gruppe mit genau gleichen Antworten.'))+dashboard26()+act(btn('deep26-open',q26('Count the matches','Übereinstimmungen zählen'))));
        if(s.stage==='vote'){
          const same=item.type==='same';const heading=same?q26('Largest matching group','Größte übereinstimmende Gruppe'):q26('Votes for A (not including the featured player)','Stimmen für A (ohne die Person am Zug)');
          return card(header+prompt(item.q)+(!same?`<div class="deep26-options"><span>A · ${t26(item.options[0])}</span><span>B · ${t26(item.options[1])}</span></div>`:'')+tallyInput26(heading,same?n():n()-1,same?1:0)+(same?'':muted(`${q26('Votes for B','Stimmen für B')}: ${s.count==null?'—':n()-1-s.count}`))+dashboard26()+act(btn('deep26-reveal',T('reveal'),'primary',s.count===null?'disabled':'')));
        }
        if(s.stage==='result')return card(header+prompt(B('Group result','Gruppenergebnis'))+`<div class="deep26-highlight">+${s.last.gain} ${q26('group points','Gruppenpunkte')}</div>`+muted(s.last.text)+dashboard26()+act(btn('deep26-next',s.round+1>=s.total?q26('Final results','Endergebnis'):T('nextRound')),...(s.round+1>=s.total?[]:[btn('deep26-end',T('end'),'secondary')])));
      }
      if(kind==='comedy'){
        const pair=s.pairs[s.round];const [a,b]=pair, title=s.item.type==='toast'?q26('20-second toasts','20-Sekunden-Ansprachen'):s.item.type==='punchline'?q26('One great answer','Eine gute Pointe'):s.item.type==='pitch'?q26('30-second sales pitch','30-Sekunden-Verkauf'):q26('30-second expert talk','30-Sekunden-Expertenvortrag');
        if(s.stage==='performA'||s.stage==='performB'){const ix=s.stage==='performA'?a:b;return card(header+prompt(item.q)+`<div class="deep26-speaker">${esc(gp(ix))} · ${title}</div>`+muted(q26('The other performer listens. After both turns, everyone else votes.','Die andere Person hört zu. Nach beiden Auftritten stimmen alle anderen ab.'))+dashboard26()+act(btn('deep26-perform',s.stage==='performA'?q26('Next performer','Nächste Person'):q26('Count votes','Stimmen zählen'))));}
        if(s.stage==='vote')return card(header+prompt(item.q)+`<div class="deep26-options"><span>A · ${esc(gp(a))}</span><span>B · ${esc(gp(b))}</span></div>`+muted(q26('Only non-performers vote. Everyone chooses A or B; include every vote. Ties score one point each.','Nur die anderen stimmen ab. Alle wählen A oder B. Bei Gleichstand bekommen beide je einen Punkt.'))+tallyInput26(q26('Votes for A','Stimmen für A'),n()-2)+muted(`${q26('Votes for B','Stimmen für B')}: ${s.count==null?'—':n()-2-s.count}`)+act(btn('deep26-reveal',T('reveal'),'primary',s.count===null?'disabled':'')));
        if(s.stage==='result')return card(header+prompt(B('Audience verdict','Publikumsurteil'))+`<div class="deep26-highlight">${esc(s.last.text)}</div>`+dashboard26()+act(btn('deep26-next',s.round+1>=s.total?q26('Final standings','Endstand'):T('nextRound')),...(s.round+1>=s.total?[]:[btn('deep26-end',T('end'),'secondary')])));
      }
      if(kind==='bluff'){
        const actor=gp(s.actor),guess=gp((s.actor+1)%n());
        if(['truthCover','lieCover','factCover'].includes(s.stage))return card(header+prompt(B('Secret briefing','Geheimes Briefing'))+`<div class="deep26-speaker">${esc(actor)}</div>`+muted(q26('Only this person should see the next screen.','Nur diese Person darf die nächste Ansicht sehen.'))+act(btn('deep26-see',T('reveal'))));
        if(s.stage==='truthChoose')return card(header+prompt(item.q)+muted(q26('Choose whether your story will be true or invented. Your decision stays secret until voting.','Entscheide, ob du wahr oder erfunden erzählst. Deine Wahl bleibt bis zur Abstimmung geheim.'))+act(btn('deep26-truth',q26('True','Wahr')),btn('deep26-fiction',q26('Invented','Erfunden'),'secondary')));
        if(s.stage==='lieChoose')return card(header+prompt(B('Two truths and one lie','Zwei Wahrheiten und eine Lüge'))+muted(q26('Prepare three short personal statements. Exactly one is invented. Pick its position privately.','Bereite drei kurze Aussagen über dich vor. Genau eine ist erfunden. Wähle ihre Position heimlich.'))+`<div class="deep26-choices">${[1,2,3].map(i=>`<button class="btn secondary" data-act="deep26-lie" data-val="${i}">${q26('Lie','Lüge')} ${i}</button>`).join('')}</div>`);
        if(s.stage==='factSee')return card(header+prompt(item.q)+`<div class="deep26-highlight">${t26(item.answer)}</div>`+muted(q26('Memorise this answer. You will read only the question aloud. Other players invent false answers.','Merke dir diese Antwort. Lies gleich nur die Frage vor. Die anderen denken sich falsche Antworten aus.'))+act(btn('deep26-hide',T('hide'))));
        if(s.stage==='hidden')return card(header+prompt(B('Pass the phone to the group.','Gib das Handy an die Runde.'))+muted(q26('The secret is hidden. Do not show it before the vote.','Die geheime Entscheidung ist verborgen. Nicht vor der Abstimmung zeigen.'))+act(btn('deep26-open',T('ready'))));
        if(s.stage==='talk'){
           let instr=item.type==='confession'?q26('Tell a 30–60-second true or invented story. The group may ask two questions, then everyone except the storyteller votes True or Fiction.','Erzähle eine 30–60-sekündige wahre oder erfundene Geschichte. Die Runde darf zweimal nachfragen. Dann stimmen alle außer dir über Wahr oder erfunden ab.'):
              item.type==='twotruths'?q26('Say three personal statements, numbered 1–3. Exactly one is a lie. Everyone else points at the lie at the same time.','Nenne drei persönliche Aussagen, nummeriert 1–3. Genau eine ist gelogen. Alle anderen zeigen gleichzeitig auf die Lüge.'):
              q26('Read the question aloud, but not the real answer. Everyone except the fact-keeper and guesser invents a believable wrong answer. Then the guesser chooses one answer.','Lies die Frage laut vor, aber nicht die richtige Antwort. Alle außer Faktenwächter und Ratendem erfinden eine glaubwürdige falsche Antwort. Dann entscheidet sich der Ratende für eine Antwort.');
           return card(header+prompt(item.q)+(item.type==='twotruths'?`<div class="deep26-speaker">${esc(actor)} · ${q26('Three statements','Drei Aussagen')}</div>`:'')+(item.type==='fact'?`<p class="deep26-speaker">${q26('Fact-keeper','Faktenwächter')}: ${esc(actor)} · ${q26('Guesser','Ratende Person')}: ${esc(guess)}</p>`:`<p class="deep26-speaker">${esc(actor)}</p>`)+muted(instr)+act(btn('deep26-vote',item.type==='fact'?q26('Reveal true answer','Richtige Antwort zeigen'):q26('Count the votes','Stimmen zählen'))));
        }
        if(s.stage==='vote')return card(header+prompt(item.q)+muted(item.type==='confession'?q26('Count the votes for True. All other players must choose True or Fiction.','Zählt die Stimmen für Wahr. Alle anderen wählen Wahr oder erfunden.'):q26('Count the people who correctly identified the lie, without revealing which statement it was.','Zählt, wie viele die Lüge richtig erkannt haben, ohne sie vorher zu verraten.'))+tallyInput26(item.type==='confession'?q26('Votes for True','Stimmen für Wahr'):q26('Correct guesses','Richtige Tipps'),n()-1)+act(btn('deep26-reveal',T('reveal'),'primary',s.count===null?'disabled':'')));
        if(s.stage==='factReveal')return card(header+prompt(item.q)+`<div class="deep26-highlight">${t26(item.answer)}</div>`+muted(q26('Did the designated guesser choose the correct answer? Decide together.','Hat die ratende Person die richtige Antwort gewählt? Entscheidet gemeinsam.'))+act(btn('deep26-factyes',q26('Guessed correctly','Richtig geraten')),btn('deep26-factno',q26('Fooled by a lie','Auf eine Lüge hereingefallen'),'secondary')));
        if(s.stage==='result')return card(header+prompt(B('Reveal','Auflösung'))+`<div class="deep26-highlight">${esc(s.last.text)}</div>`+dashboard26()+act(btn('deep26-next',s.round+1>=s.total?q26('Final results','Endergebnis'):T('nextRound')),...(s.round+1>=s.total?[]:[btn('deep26-end',T('end'),'secondary')])));
      }
      return card(prompt(B('Invalid session state. Start a new round.','Ungültiger Rundenstand. Startet neu.'))+act(btn('deep26-restart',T('restart'))));
    }
    function handle26(action,value){if(!is26()||!s||!action.startsWith('deep26-'))return false;const kind=type26();let handled=true;
      if(action==='deep26-duration'&&s.stage==='setup'&&C26.durations[value]){s.config.duration=value;s.error='';}
      else if(action==='deep26-customize'&&s.stage==='setup')s.customize=!s.customize;
      else if(action==='deep26-switchups'&&s.stage==='setup')s.config.switchups=value==='on';
      else if(action==='deep26-style'&&s.stage==='setup'&&C26.variants[kind].includes(value)){s.config.style=value;s.error='';}
      else if(action==='deep26-start'&&s.stage==='setup'){begin26();return true;}
      else if(action==='deep26-restart')init26();
      else if(action==='deep26-end'&&s.stage!=='setup'){if(s.stage==='result')remember26();s.stage='end';}
      else if(action==='deep26-next'&&s.stage==='result'){remember26();s.round++;next26();}
      else if(action==='deep26-skip'&&!['setup','end','result'].includes(s.stage)){remember26();s.skipped=(s.skipped||0)+1;s.round++;next26();}
      else if(action==='deep26-see'&&kind==='bluff')s.stage=s.item.type==='fact'?'factSee':s.item.type==='twotruths'?'lieChoose':'truthChoose';
      else if(action==='deep26-secret'&&kind==='social'&&s.stage==='private'&&['0','1'].includes(value)){s.privateChoice=Number(value);s.stage='hidden';}
      else if(action==='deep26-truth'&&kind==='bluff'&&s.stage==='truthChoose'){s.privateChoice='true';s.stage='hidden';}
      else if(action==='deep26-fiction'&&kind==='bluff'&&s.stage==='truthChoose'){s.privateChoice='fiction';s.stage='hidden';}
      else if(action==='deep26-lie'&&kind==='bluff'&&s.stage==='lieChoose'&&['1','2','3'].includes(value)){s.privateChoice=Number(value);s.stage='hidden';}
      else if(action==='deep26-hide'&&kind==='bluff'&&s.stage==='factSee')s.stage='hidden';
      else if(action==='deep26-open'&&s.stage==='hidden')s.stage=kind==='social'?'vote':'talk';
      else if(action==='deep26-open'&&kind==='social'&&s.stage==='talk'){s.stage='vote';s.count=null;}
      else if(action==='deep26-perform'&&kind==='comedy'&&['performA','performB'].includes(s.stage))s.stage=s.stage==='performA'?'performB':'vote';
      else if(action==='deep26-vote'&&kind==='bluff'&&s.stage==='talk')s.stage=s.item.type==='fact'?'factReveal':'vote';
      else if(action==='deep26-tally'&&s.stage==='vote'){
          const max=kind==='social'&&s.item.type==='same'?n():kind==='comedy'?n()-2:n()-1;
          const min=kind==='social'&&s.item.type==='same'?1:0;const count=Number(value);
          if(Number.isInteger(count)&&count>=min&&count<=max)s.count=count;else return true;
      }
      else if(action==='deep26-reveal'&&s.stage==='vote'){
          if(!Number.isInteger(s.count))return true;
          s.played=(s.played||0)+1;
          if(kind==='social'){
              const gain=C26.scoreSocial(s.item.type,n(),s.item.type==='same'?0:s.privateChoice,s.count);
              s.groupPoints+=gain;s.last={gain,text:s.item.type==='same'?q26(`Largest matching group: ${s.count}.`,`Größte Gruppe mit gleicher Antwort: ${s.count}.`):s.item.type==='majority'?q26(`A: ${s.count} · B: ${s.count==null?'—':n()-1-s.count} · Prediction: ${s.privateChoice===0?'A':'B'}`,`A: ${s.count} · B: ${s.count==null?'—':n()-1-s.count} · Tipp: ${s.privateChoice===0?'A':'B'}`):q26(`${s.privateChoice===0?'A':'B'} was the featured player's choice.`,`Die Person am Zug hat ${s.privateChoice===0?'A':'B'} gewählt.`)};
          }else if(kind==='comedy'){
              const [a,b]=s.pairs[s.round],points=C26.voteDuel(n(),s.count,n()-2-s.count);
              s.scores[a]+=points[0];s.scores[b]+=points[1];s.last={text:points[0]===points[1]?q26(`Tie: ${gp(a)} and ${gp(b)} +1 each.`,`Gleichstand: ${gp(a)} und ${gp(b)} bekommen je einen Punkt.`):q26(`Winner: ${gp(points[0]>points[1]?a:b)} (+2)`,`Gewonnen: ${gp(points[0]>points[1]?a:b)} (+2)`)};
          }else if(kind==='bluff'){
              const score=C26.scoreBluff(s.item.type,n(),s.privateChoice,s.count);
              s.groupPoints+=score.group;s.bluffPoints+=score.bluff;
              const truth=s.item.type==='confession'? (s.privateChoice==='true'?q26('The story was true.','Die Geschichte war wahr.'):q26('The story was invented.','Die Geschichte war erfunden.')) :q26(`Statement ${s.privateChoice} was the lie.`,`Aussage ${s.privateChoice} war gelogen.`);
              s.last={text:`${truth} ${q26('Correct guesses','Richtige Tipps')}: ${score.correct}/${n()-1}. ${score.group?q26('Group +2','Runde +2'):q26('Bluff +2','Bluff +2')}`};
          }
          s.stage='result';
      }
      else if(kind==='bluff'&&s.stage==='factReveal'&&['deep26-factyes','deep26-factno'].includes(action)){
          s.played=(s.played||0)+1;const correct=action==='deep26-factyes',score=C26.scoreBluff('fact',n(),null,correct?n()-1:0);s.groupPoints+=score.group;s.bluffPoints+=score.bluff;s.last={text:correct?q26('The guesser found the truth. Group +2.','Die richtige Antwort wurde gefunden. Runde +2.'):q26('A fake answer fooled the guesser. Bluff +2.','Eine falsche Antwort hat überzeugt. Bluff +2.')};s.stage='result';
      }else handled=false;
      if(handled){deepSave();drawScreen();}return handled;
    }
    function help26(){const kind=type26();const sections=kind==='social'?[
      [B('Quick start','Schnellstart'),[B('Choose Mixed or one prediction format. A different featured player takes each round; for Same Brain, everyone plays together.','Wählt Gemischt oder eine Spielform. In jeder Runde ist eine andere Person an der Reihe; bei Gleich gedacht spielen alle mit.'),B('Read the Room: featured player secretly predicts A/B. Everyone else votes by a show of hands; record the number for A. Know Your Friends: featured player secretly picks A/B; others predict that choice.','Gruppenmeinung: Eine Person tippt heimlich A/B. Die anderen stimmen per Handzeichen ab; tragt die A-Stimmen ein. Freunde kennen: Eine Person wählt heimlich A/B; alle anderen raten.'),B('Same Brain: all say one answer at the same time; count the largest group giving the same answer. No anonymous typing or phone passing is required.','Gleich gedacht: Alle sagen gleichzeitig eine Antwort. Zählt die größte Gruppe mit identischer Antwort. Niemand muss anonym tippen oder das Handy weitergeben.')]],
      [B('Scoring and ending','Punkte und Ende'),[B('Read the Room: correct majority prediction +2; an equal split +1; otherwise 0. Know Your Friends: strict majority of correct guesses +2; at least one correct +1; otherwise 0.','Gruppenmeinung: Mehrheit richtig vorhergesagt +2; gleich viele Stimmen +1; sonst 0. Freunde kennen: Mehrheit richtig +2; mindestens ein richtiger Tipp +1; sonst 0.'),B('Same Brain: three or more matching answers +2, exactly two +1, otherwise 0. Only the largest matching group counts. The group shares one score.','Gleich gedacht: Mindestens drei identische Antworten +2, genau zwei +1, sonst 0. Es zählt nur die größte Gruppe. Die Runde sammelt gemeinsam Punkte.'),B('Quick 4, Standard 10, Long 20 rounds. All prompt cards are unique within the session. You can end early or play again.','Kurz: 4, Standard: 10, Lang: 20 Runden. Innerhalb einer Sitzung wiederholt sich keine Karte. Ihr könnt jederzeit aufhören.')]]
    ]:kind==='comedy'?[
      [B('Quick start','Schnellstart'),[B('Each round puts two named performers against each other on the same prompt. Both get a turn while the others listen.','Pro Runde treten zwei Personen mit derselben Aufgabe gegeneinander an. Beide sind nacheinander dran; die übrigen hören zu.'),B('Punchline: one short funny answer. Pitch or Fake Expert: speak for about 30 seconds. Toast: give a 20-second funny or sincere toast. Anyone may decline a prompt.','Pointe: eine kurze lustige Antwort. Pitch oder Expertenvortrag: etwa 30 Sekunden sprechen. Trinkspruch: 20 Sekunden lustig oder ernst. Jede Aufgabe darf abgelehnt werden.'),B('Only the other players vote by a show of hands. Everyone votes A or B; record the total for A, with the rest counted for B.','Nur die anderen stimmen per Handzeichen ab. Alle wählen A oder B; tragt die Stimmen für A ein, der Rest zählt für B.')]],
      [B('Fair scoring and modes','Faire Punkte und Varianten'),[B('Winner gets 2 points. A tied audience vote gives both performers 1 point. Both contenders abstain from voting. The schedule gives everyone as equal a number of appearances as possible.','Wer gewinnt, erhält zwei Punkte. Bei Gleichstand bekommen beide je einen Punkt. Die Auftretenden stimmen nicht mit. Alle kommen möglichst gleich oft dran.'),B('Quick 3, Standard 8, Long 16 duels. Mixed changes performance type each round. Other variants use one type only. Score ties in final standings remain ties.','Kurz: 3, Standard: 8, Lang: 16 Duelle. Gemischt wechselt die Aufgabentypen; andere Varianten bleiben bei einem. Punktgleichstand bleibt Gleichstand.'),B('No alcohol or penalties are required. A toast can be raised with water or another drink, or spoken without lifting a glass.','Kein Alkohol und keine Strafen. Ein Trinkspruch funktioniert auch mit Wasser oder ganz ohne Glas.')]]
    ]:[
      [B('Quick start','Schnellstart'),[B('Confession: a rotating storyteller privately chooses True or Invented, tells a short story and answers two group questions. All other players vote True/Fiction.','Geständnis: Eine Person wählt heimlich Wahr oder erfunden, erzählt kurz und beantwortet zwei Nachfragen. Die anderen stimmen ab.'),B('Two Truths, One Lie: the storyteller creates three personal statements and secretly marks which one is invented. Others point to statement 1, 2, or 3 together. The group enters how many guessed correctly.','Zwei Wahrheiten, eine Lüge: Die Person erfindet drei persönliche Aussagen, markiert heimlich eine Lüge. Alle anderen zeigen auf 1, 2 oder 3. Tragt die Zahl richtiger Tipps ein.'),B('Fact Trap: a fact-keeper reads the correct answer privately, then reads only the question aloud. Everyone except the fact-keeper and designated guesser invents a believable wrong answer. The guesser picks one before the real answer is shown.','Faktenfalle: Ein Faktenwächter liest die Lösung heimlich, dann nur die Frage laut. Alle außer Faktenwächter und Ratendem erfinden glaubwürdige falsche Antworten. Die ratende Person wählt vor der Aufdeckung.')]],
      [B('Score, privacy and modes','Punkte, Geheimnisse und Varianten'),[B('For personal stories, a strict majority of correct guesses earns the group 2 points. Otherwise the bluff side gets 2 points. A 50–50 split does not count as a strict majority.','Bei Geschichten erhält die Gruppe zwei Punkte, wenn eine echte Mehrheit richtig liegt. Sonst gibt es zwei Bluffpunkte. Ein Gleichstand zählt nicht als Mehrheit.'),B('In Fact Trap the guesser choosing the truth gives the group +2; otherwise Bluff +2. There are no individual scores: compare the group score with successful bluffs.','Bei der Faktenfalle bringt ein richtiger Tipp der Gruppe +2, sonst gibt es Bluff +2. Es gibt keine Einzelpunkte: Vergleicht Gruppen- und Bluffpunkte.'),B('Quick 3, Standard 7, Long 12 rounds. Mixed alternates game styles; speakers rotate. Keep secrets off-screen until the reveal. Anyone can pass on personal stories.','Kurz: 3, Standard: 7, Lang: 12 Runden. Gemischt wechselt die Varianten; die Person am Zug wechselt. Geheimnisse bleiben bis zur Aufdeckung verborgen. Persönliche Geschichten sind freiwillig.')]]
    ];sections.push([B('Long-session switch-ups','Abwechslung in langen Runden'),[B('In Standard and Long modes, every fourth round gets one extra rule. It changes the discussion or performance, never the score. Disable switch-ups under Choose a variation if you prefer the classic rules.','In Standard und Lang gibt es jede vierte Runde eine Zusatzregel. Sie verändert das Gespräch oder den Auftritt, nie die Punkte. Unter Variante wählen könnt ihr das ausschalten.'),B('For every public vote, choose the actual count before revealing; there is no assumed default vote. You may skip a round without points.','Wählt bei öffentlichen Abstimmungen zuerst die tatsächliche Stimmenzahl. Es gibt keinen voreingestellten Wert. Ihr dürft jede Runde ohne Punkte überspringen.')]]);return `<div class="help deep-guide">${sections.map(([heading,steps])=>`<h3>${t26(heading)}</h3><ol>${steps.map(x=>`<li>${t26(x)}</li>`).join('')}</ol>`).join('')}</div>`;}

    function deepView(){if(is26())return view26()+(s.stage!=='setup'&&s.stage!=='end'&&s.stage!=='result'?`<div class="deep26-escape">${btn('deep26-skip',q26('Skip this challenge','Aufgabe überspringen'),'secondary small')}${btn('deep26-end',q26('End session','Runde beenden'),'secondary small')}</div>`:'');if(is25())return isImp25()?imp25View():team25View();return gameId==='partydeck24'?deepPartyView():deepKingView();}
    function deepHandle(action,value){
        if(is26())return handle26(action,value);
        if(is25())return handle25(action,value);
        if(!s||!deepIds.includes(gameId))return false;
        if(action==='deep-customize'&&s.stage==='setup')s.customize=!s.customize;
        else if(action==='deep-duration' && s.stage==='setup' && (C24.numberModes[value]||C24.kingModes[value]))s.config.duration=value;
        else if(action==='deep-style'&&s.stage==='setup'&&['relaxed','rapid','story','classic','rules','chaos'].includes(value))s.config.style=value;
        else if(action==='deep-pack'&&s.stage==='setup' && Object.keys(C24.names).includes(value) && (value!=='afterdark'||prefs.tone==='adult')){
            const p=s.config.packs;s.config.packs=p.includes(value)?p.filter(x=>x!==value):[...p,value];
        }else if(action==='deep-start'&&s.stage==='setup')deepBegin();
        else if(action==='deep-next'&&s.stage==='card'&&gameId==='partydeck24'){
            deepRemember(s.cards[s.round].id);s.round++;s.twist=false;if(s.round>=s.total)s.stage='end';
        }else if(action==='deep-swap'&&s.stage==='card'&&gameId==='partydeck24'&&s.reserve.length){
            deepRemember(s.cards[s.round].id);s.cards[s.round]=s.reserve.shift();s.skipped++;s.twist=false;
        }else if(action==='deep-twist'&&s.stage==='card'&&gameId==='partydeck24')s.twist=true;
        else if(action==='deep-end'&&s.stage!=='end')s.stage='end';
        else if(action==='deep-new')deepInit();
        else if(action==='king24-draw'&&gameId==='kingsnight24'&&s.stage==='draw'&&s.round<s.total){s.card=s.deck[s.round];s.stage='card';s.ruleActivated=false;}
        else if(action==='king24-rule'&&gameId==='kingsnight24'&&s.stage==='card'&&!s.ruleActivated&&s.rules.length<3){
            const eligible=C24.ruleRanks.includes(s.card.rank)||(s.config.style==='rules'&&s.round%4===3)||(s.config.style==='chaos'&&s.round%3===2);
            if(eligible){s.rules.push({text:C24.kingRule(s.card),expiresAfter:s.round+5});s.ruleActivated=true;s.ruleEvents++;}
        }else if(action==='king24-remove'&&gameId==='kingsnight24'&&s.rules[Number(value)])s.rules.splice(Number(value),1);
        else if(['king24-next','king24-skip'].includes(action)&&gameId==='kingsnight24'&&s.stage==='card'){
            if(action==='king24-skip')s.skipped++;s.round++;s.card=null;s.rules=s.rules.filter(r=>r.expiresAfter>s.round);s.stage=s.round>=s.total?'end':'draw';
        }else return false;
        deepSave();drawScreen();return true;
    }
    function deepHelp(){
        if(is26())return help26();
        if(is25())return help25();
        const party=gameId==='partydeck24';
        const sections=party?[
            [B('How to play','Spielablauf'),[B('Choose content packs, a session length, and a play style.','Wählt Themenpakete, Spiellänge und Spielstil.'),B('Read the card aloud. All players respond, vote, tell a story or perform according to the short instruction.','Lest die Karte laut vor. Alle antworten, stimmen ab, erzählen oder machen mit – entsprechend der kurzen Anweisung.'),B('Tap Next only when you are ready. Different card replaces the current question; Add a twist offers an optional follow-up.','Drückt Weiter, wenn ihr bereit seid. Andere Karte ersetzt die aktuelle Frage; Zusatzrunde ergänzt eine freiwillige Nachfrage.'),B('The session ends after its configured number of cards, or whenever you choose End session. There are no scores.','Die Runde endet nach der gewählten Kartenzahl oder jederzeit über Runde beenden. Es gibt keine Punkte.')]],
            [B('Modes and content','Varianten und Inhalte'),[B('Quick: 12 cards, Standard: 28, Long: 56. Times depend on conversation; there is no forced countdown.','Kurz: 12 Karten, Standard: 28, Lang: 56. Die Dauer hängt von euren Gesprächen ab; es gibt keinen erzwungenen Countdown.'),B('Relaxed: no hurry. Quick-fire: aim for 20 seconds. Story mode: automatically shows an optional follow-up on every card.','Entspannt: ohne Eile. Schnellrunde: etwa 20 Sekunden pro Karte. Geschichtenrunde: Auf jeder Karte erscheint automatisch eine freiwillige Nachfrage.'),B('After Dark only appears when the adult content setting is explicitly selected. Nobody must drink, disclose, or perform.','After Dark erscheint nur mit ausdrücklich ausgewählter Erwachsenen-Einstellung. Niemand muss trinken, erzählen oder etwas vorführen.')]]
        ]:[
            [B('How to play','Spielablauf'),[B('Pick a session length and one of the three variants. A shuffled standard deck contains 52 distinct cards.','Wählt Spiellänge und eine der drei Varianten. Ein gemischtes Standarddeck enthält 52 verschiedene Karten.'),B('Draw a card, read its challenge and do it together. The suit changes the activity. You may skip any card.','Zieht eine Karte, lest die Aktion und macht gemeinsam mit. Die Kartenfarbe verändert die Aufgabe. Jede Karte darf übersprungen werden.'),B('Certain cards offer a temporary house rule. Activate it only if the group agrees; at most three rules can be active.','Bestimmte Karten bieten eine vorübergehende Hausregel an. Aktiviert sie nur, wenn alle einverstanden sind. Maximal drei Regeln gleichzeitig.'),B('Each rule lasts for the next four drawn cards, including skipped cards, unless removed early. No drinking requirements or penalties.','Jede Regel gilt für die nächsten vier gezogenen Karten, auch wenn ihr eine überspringt, und kann früher entfernt werden. Keine Trinkpflicht oder Strafpunkte.')]],
            [B('Modes and ending','Varianten und Ende'),[B('Quick: 12 draws; Standard: 26; Long: 52. The game ends at the chosen limit or when you end the session.','Kurz: 12 Karten; Standard: 26; Lang: 52. Das Spiel endet nach der gewählten Anzahl oder wenn ihr die Runde beendet.'),B('Classic: only ranks 2, 7 and Jack offer rules. House Rules: an extra offer on every fourth card. Party Chaos: on every third card.','Klassisch: Nur 2, 7 und Bube bieten Regeln an. Hausregeln: zusätzlich jede vierte Karte. Party-Chaos: zusätzlich jede dritte Karte.'),B('Everyone can decline a challenge or toast with any drink, including water. No one loses points for declining.','Alle dürfen Aufgaben ablehnen oder mit einem beliebigen Getränk anstoßen, auch Wasser. Es gibt dafür keine Punktabzüge.')]]
        ];
        return `<div class="help deep-guide">${sections.map(([title,steps])=>`<h3>${esc(tx(title))}</h3><ol>${steps.map(step=>`<li>${esc(tx(step))}</li>`).join('')}</ol>`).join('')}</div>`;
    }

    function view() { if(deepIds.includes(gameId))return deepView();const k = g().kind; const map = { deck: publicDeck, majority: majorityView, spectrum: spectrumView, paranoia: paranoiaView, same: sameView, know: knowView, rank: rankView, hot: hotView, roles: roleView, bluff: bluffView, who: whoView, confession: confessionView, missions: missionsView, bad: badView, perform: performView, story: storyView, pitch: pitchView, whisper: whisperView, three: threeView, expert: expertView, draw: drawView, kings: kingsView, house: houseView, bingo: bingoView, toast: toastView, truth: truthView, last: publicDeck }; return (map[k] || publicDeck)(); }
    function settings() { return `<div class="settings-panel"><div class="spaced"><b>${T('playerCount')}</b><span><button class="chip-btn" data-act="minus" ${n() <= 2 ? 'disabled' : ''}>−</button> <strong>${n()}</strong> <button class="chip-btn" data-act="plus" ${n() >= 12 ? 'disabled' : ''}>+</button></span></div><p class="smallprint">${T('limits')}</p><div class="roster">${prefs.players.map((p, i) => `<label class="rosterline"><span class="avatar">${i + 1}</span><input class="input" data-player="${i}" maxlength="22" value="${esc(p)}" placeholder="${T('player')} ${i + 1}"></label>`).join('')}</div><label class="label">${T('tone')}</label><select id="tone-select" class="input"><option value="clean" ${prefs.tone === 'clean' ? 'selected' : ''}>${T('clean')}</option><option value="party" ${prefs.tone === 'party' ? 'selected' : ''}>${T('standard')}</option><option value="adult" ${prefs.tone === 'adult' ? 'selected' : ''}>${T('adult')}</option></select><p class="smallprint">${T('safety')}</p>${act(btn('settings-save', T('apply')), btn('clear-data', tx(B('Clear all local data', 'Alle lokalen Daten löschen')), 'secondary'))}<p class="smallprint">${tx(B('Names last only until this page is closed.', 'Namen bleiben nur bis zum Schließen der Seite.'))}</p></div>`; }
    const helpExamples = {
        majority: B('Example: predict A; four friends choose A and one chooses B. The Forecaster earns 2 points.', 'Beispiel: Tipp A; vier Freunde wählen A, einer B. Die ratende Person bekommt 2 Punkte.'),
        undercover: B('Example: most see “Aquarium”, one sees “Zoo”. Say clues, discuss, then count votes.', 'Beispiel: Alle sehen „Aquarium“, einer „Zoo“. Hinweise geben, diskutieren und Stimmen zählen.'),
        spy: B('Example: all but one know “Airport”. Ask questions without saying the place; vote, then let the Spy guess.', 'Beispiel: Alle außer einer Person wissen „Flughafen“. Fragen stellen, abstimmen, dann rät der Spion.'),
        mimic: B('Example: everyone else knows to touch their ear. The Mimic must copy without knowing the action.', 'Beispiel: Alle anderen wissen, dass sie ans Ohr fassen. Der Mitmacher muss ohne Vorwissen abschauen.'),
        bad: B('Example: “Worst thing to hear from a pilot?” Write a short punchline, then vote for someone else.', 'Beispiel: „Schlimmster Satz eines Piloten?“ Schreibt eine Pointe und stimmt für jemand anderen.'),
        draw: B('Example: “A cat drives a bus” → drawing → new description → new drawing. Reveal everything at the end.', 'Beispiel: „Katze fährt Bus“ → Zeichnung → neue Beschreibung → neue Zeichnung. Am Ende alles zeigen.'),
        three: B('Use the same eight prompts three times: describe, one word, then pantomime.', 'Dieselben acht Begriffe dreimal: frei erklären, ein Wort, dann pantomimisch.'),
        kings: B('Example: draw a 5 and go around naming unique pizza toppings. Four suits mean each rank appears four times.', 'Beispiel: Zieht eine 5 und nennt reihum verschiedene Pizzabeläge. Jede Zahl kommt viermal vor.'),
        confession: B('The storyteller chooses true or invented privately. If most people guess wrong, the storyteller gains 2 points.', 'Die erzählende Person wählt heimlich wahr oder erfunden. Bei falscher Mehrheit bekommt sie 2 Punkte.'),
        missions: B('Example: discreetly make someone say “suspicious”. Another player confirms success; you receive a new mission.', 'Beispiel: Bring jemanden unauffällig dazu, „verdächtig“ zu sagen. Jemand bestätigt den Erfolg; du bekommst eine neue Mission.'),
        toast: B('Example: two friends give competing toasts about missed trains. The group chooses a winner, who earns 1 point.', 'Beispiel: Zwei Freunde halten Reden über verpasste Züge. Die Gruppe wählt eine Person; sie bekommt einen Punkt.'),
        bluff: B('The fact-keeper privately sees the true answer, everyone else invents plausible lies, and one player guesses aloud.', 'Eine Person sieht die Wahrheit, andere erfinden plausible Lügen, eine Person rät laut.'),
    };
    function helpMarkup() { if(deepIds.includes(gameId)) return deepHelp();
        const steps = window.CHAOS_GUIDES?.[gameId]?.[L()] || [tx(rules())];
        const guide = `<ol>${steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol>`;
        const example = helpExamples[gameId] ? `<div class="inline-tip"><b>${T('example')}</b><p>${esc(tx(helpExamples[gameId]))}</p></div>` : '';
        return `<div class="help">${guide}${example}<p class="smallprint">${T('players')}: ${g().min}–${g().max}</p></div>`;
    }
    function overlay() {
        if (!modal)
            return '';
        const body = modal === 'settings' ? settings() : modal === 'help' ? helpMarkup() : `<p class="subtext">${T('noRoom')}</p>`;
        const title = modal === 'help' ? esc(g()[L()]) : modal === 'settings' ? T('setup') : T('noRoom');
        return `<div class="modalbg" data-act="close-modal"></div><section class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><button class="chip-btn exit" data-act="close-modal" aria-label="${esc(tx(B('Close', 'Schließen')))}">×</button><h2>${title}</h2>${body}</section>`;
    }
    let lastRenderKey=null, preservedDraft=null;
    function render(){
      const key=s&&gameId?`${gameId}|${s.stage}|${s.player}|${s.phase}|${s.round}`:null;
      // Preserve a draft only across UI refreshes of the *same* turn.
      if(key&&key===lastRenderKey){
        const field=root.querySelector('#private-text');
        const canvas=root.querySelector('#drawing');
        preservedDraft={key, text:field?.value??null, image:canvas?.toDataURL('image/png')??null};
      }
      document.documentElement.lang=L();
      root.innerHTML=(gameId?playPage():home())+overlay();
      if(modal){
        root.querySelector('.shell')?.setAttribute('inert','');
        const dialog=root.querySelector('.modal');
        if(dialog){dialog.setAttribute('tabindex','-1');dialog.querySelector('[data-act="close-modal"]')?.focus();}
      }
      if(gameId)srStatus.textContent=tx(B('Game screen updated.','Spielansicht aktualisiert.'));
      if(s?.stage==='active'&&s?.deadline){
        const timer=document.getElementById('timer-view');
        if(timer)timer.textContent=Math.max(0,Math.ceil((s.deadline-Date.now())/1000));
      }
      if(gameId==='draw'&&s?.stage==='draw')prepareCanvas();
      if(key&&preservedDraft?.key===key){
        const field=root.querySelector('#private-text');
        if(field&&preservedDraft.text!==null)field.value=preservedDraft.text;
        const canvas=root.querySelector('#drawing');
        if(canvas&&preservedDraft.image){
          const target=canvas, img=new Image();
          img.onload=()=>{if(target.isConnected)target.getContext('2d').drawImage(img,0,0);};
          img.src=s?.drawingSnapshot||preservedDraft.image;
        }
      }
      lastRenderKey=key;
      if(!key||preservedDraft?.key!==key)preservedDraft=null;
    }
    function drawScreen() { render(); try {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }
    catch { } }
    function updateTimer(sec, cb) { resetTimers(); s.deadline = Date.now() + sec * 1000; elapsedTimer = setInterval(() => { if (!s)
        return resetTimers(); let remain = Math.max(0, Math.ceil((s.deadline - Date.now()) / 1000)); let el = document.getElementById('timer-view'); if (el)
        el.textContent = remain; if (remain <= 0) {
        resetTimers();
        cb();
    } }, 150); }
    function resetGameIfRosterChanged() {
        resetTimers();
        gameId = null;
        s = null;
        missionState = null;
        bingoState = null;
        pausedGame = null;
        pausedForBingo = null;
        activeRules = [];
        deepSessions={};try{sessionStorage.removeItem('chaosclub.24.sessions');}catch{}
        notice = tx(B('Player count changed. Active games were reset.', 'Spielerzahl geändert. Laufende Spiele wurden zurückgesetzt.'));
    }
    function retainSettingsDrafts() {
        document.querySelectorAll('[data-player]').forEach(el => {
            if (Number(el.dataset.player) < n()) prefs.players[Number(el.dataset.player)] = el.value.trim().slice(0, 22);
        });
        const tone = document.getElementById('tone-select')?.value;
        if (['clean', 'party', 'adult'].includes(tone)) prefs.tone = tone;
    }
    function nextData(key) { s.round++; s.data = draw(key); }
    function nextTurn(key) { s.round++; s.player = s.round % n(); s.data = draw(key); }
    function prepareCanvas() { const canvas = document.getElementById('drawing'); if (!canvas)
        return; let ctx = canvas.getContext('2d'); ctx.fillStyle = '#faf3ff'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.strokeStyle = '#321446'; ctx.lineWidth = 7; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; let active = false; const pos = e => { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * canvas.width / r.width, y: (e.clientY - r.top) * canvas.height / r.height }; }; canvas.onpointerdown = e => { active = true; canvas.setPointerCapture(e.pointerId); let p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + .01, p.y + .01); ctx.stroke(); }; canvas.onpointermove = e => { if (!active)
        return; let p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); }; canvas.onpointerup = canvas.onpointercancel = () => { active = false; if(s?.stage==='draw')s.drawingSnapshot=canvas.toDataURL('image/png'); }; }
    function handle(action, value) {
        if(action.startsWith('deep-')||action.startsWith('deep26-')||action.startsWith('king24-')||action.startsWith('deep25-')||action.startsWith('imp25-')||action.startsWith('team25-')) { if(deepHandle(action,value))return; }
        let v = Number(value), k = g()?.kind;
        switch (action) {
            case 'home':
                if(gameId && deepIds.includes(gameId)) deepSave();
                resetTimers();
                gameId = null;
                s = null;
                modal = null;
                drawScreen();
                return;
            case 'quick':
                startGame('partydeck24');
                if(s.stage==='setup'){s.config.duration='quick';deepBegin();}
                return;
            case 'surprise': {
                const choice=sample(['partydeck24','kingsnight24','impostornight25','teamshowdown25','socialradar26','comedybattle26','bluffclub26'].filter(id=>catalog.find(x=>x.id===id&&x.min<=n()&&x.max>=n())));
                startGame(choice);
                if(deepIds.includes(choice)&&s.stage==='setup'){s.config.duration='quick';if(is26())begin26();else deepBegin();}
                return;
            }
            case 'family':
                familyFilter=value;libraryOpen=true;filter='all';search='';drawScreen();return;
            case 'family-all':
                familyFilter=null;filter='all';search='';drawScreen();return;
            case 'legacy-toggle':
                libraryOpen=!libraryOpen;if(!libraryOpen){familyFilter=null;search='';filter='all';}drawScreen();return;
            case 'game':
                startGame(value);
                return;
            case 'restart':
                startGame(gameId);
                return;
            case 'lang':
                prefs.lang = L() === 'en' ? 'de' : 'en';
                save();
                render();
                return;
            case 'sound':
                prefs.sound = !prefs.sound;
                save();
                if (prefs.sound)
                    beep();
                render();
                return;
            case 'settings':
                modalReturn = 'settings';
                modal = 'settings';
                render();
                return;
            case 'help':
                modalReturn = 'help';
                modal = 'help';
                render();
                return;
            case 'close-modal':
                modal = null;
                render();
                document.querySelector(`[data-act="${modalReturn}"]`)?.focus();
                return;
            case 'settings-save':
                document.querySelectorAll('[data-player]').forEach(el => { prefs.players[Number(el.dataset.player)] = el.value.trim().slice(0, 22); });
                const oldTone=prefs.tone;
                prefs.tone = document.getElementById('tone-select')?.value || 'party';
                if(oldTone!==prefs.tone){
                    delete deepSessions.partydeck24;
                    if(gameId==='partydeck24') deepInit();
                    deepSave();
                }
                save();
                modal = null;
                drawScreen();
                return;
            case 'plus':
                if (n() < 12) {
                    retainSettingsDrafts();
                    prefs.players.push('');
                    save();
                    resetGameIfRosterChanged();
                    render();
                }
                return;
            case 'minus':
                if (n() > 2) {
                    retainSettingsDrafts();
                    prefs.players.pop();
                    save();
                    resetGameIfRosterChanged();
                    render();
                }
                return;
            case 'clear-data': {
                try {
                    localStorage.removeItem('chaosclub.23');
                    localStorage.removeItem('chaosclub.23.recent');
                    localStorage.removeItem('chaosclub.22');
                    localStorage.removeItem('chaosclub.22.recent');
                    localStorage.removeItem('chaosclub.21');
                    localStorage.removeItem('chaosclub.24.recent');
                    localStorage.removeItem('chaosclub.27.recent');
                    sessionStorage.removeItem('chaosclub.24.sessions');
                }
                catch { }
                prefs = { lang: L(), players: Array(6).fill(''), tone: 'clean', sound: false, favs: [] };
                recent = {};
                Object.keys(dedupe).forEach(k => delete dedupe[k]);
                missionState = null;
                deepSessions = {};
                pausedGame = null;
                bingoState = null; pausedForBingo = null;
                activeRules = [];
                gameId = null;
                s = null;
                modal = null;
                drawScreen();
                return;
            }
            case 'filter':
                filter = value;
                render();
                return;
            case 'favorite':
                prefs.favs = prefs.favs.includes(value) ? prefs.favs.filter(x => x !== value) : [...prefs.favs, value];
                save();
                render();
                return;
        }
        if (!s)
            return;
        switch (action) {
            case 'deck-next':
            case 'deck-skip': {
                nextData(gameId === 'last' ? 'last' : gameId === 'sip' ? 'sip' : gameId === 'redflag' ? 'redflag' : gameId);
                beep();
                drawScreen();
                return;
            }
            case 'length':
                s.limit = [5, 10, 15][v] || 5;
                s.stage = 'play';
                drawScreen();
                return;
            case 'forecast-set':
                s.choice = v;
                render();
                return;
            case 'forecast-lock':
                if (s.choice == null)
                    return;
                s.stage = 'group';
                s.num = 0;
                drawScreen();
                return;
            case 'forecast-reveal': {
                const a = s.num, b = n() - 1 - a, maj = a === b ? -1 : a > b ? 0 : 1;
                s.points[s.round % n()] += maj === -1 ? 1 : maj === s.choice ? 2 : 0;
                s.stage = 'result';
                beep(770);
                drawScreen();
                return;
            }
            case 'forecast-next':
                s.round++;
                s.stage = 'forecast';
                s.choice = null;
                s.num = 0;
                s.data = draw('majority');
                drawScreen();
                return;
            case 'spectrum-see':
                s.stage = 'see';
                render();
                return;
            case 'spectrum-hide':
                s.stage = 'guess';
                drawScreen();
                return;
            case 'spectrum-result':
                s.points[0] += Math.max(0, 3 - Math.abs(s.guess - s.secret));
                s.stage = 'result';
                beep();
                drawScreen();
                return;
            case 'spectrum-next':
                s.round++;
                s.secret = Math.floor(Math.random() * 11);
                s.guess = 5;
                s.stage = 'cover';
                s.data = draw('spectrum');
                drawScreen();
                return;
            case 'para-see':
                s.stage = 'see';
                render();
                return;
            case 'para-hide':
                s.stage = 'hidden';
                drawScreen();
                return;
            case 'para-consent':
                s.stage = 'consent-reader';
                drawScreen();
                return;
            case 'para-reader-yes':
                s.stage = 'consent-nominated';
                drawScreen();
                return;
            case 'para-nominated-yes':
                s.stage = 'revealed';
                drawScreen();
                return;
            case 'para-next':
                s.round++;
                s.stage = 'cover';
                s.data = draw('paranoia');
                drawScreen();
                return;
            case 'same-next':
                nextData('same');
                beep();
                drawScreen();
                return;
            case 'know-see':
                s.stage = 'see';
                render();
                return;
            case 'know-set':
                s.choice = v;
                render();
                return;
            case 'know-hide':
                if (s.choice == null)
                    return;
                s.stage = 'guess';
                drawScreen();
                return;
            case 'know-reveal':
                s.stage = 'result';
                beep();
                drawScreen();
                return;
            case 'know-next':
                s.round++;
                s.choice = null;
                s.data = draw('know');
                s.stage = 'cover';
                drawScreen();
                return;
            case 'rank-see':
                s.stage = 'see';
                render();
                return;
            case 'rank-up':
                if (v > 0) {
                    [s.order[v], s.order[v - 1]] = [s.order[v - 1], s.order[v]];
                    render();
                }
                return;
            case 'rank-down':
                if (v < 3) {
                    [s.order[v], s.order[v + 1]] = [s.order[v + 1], s.order[v]];
                    render();
                }
                return;
            case 'rank-hide':
                s.stage = 'guess';
                drawScreen();
                return;
            case 'rank-reveal':
                s.stage = 'result';
                beep();
                drawScreen();
                return;
            case 'rank-next':
                s.round++;
                s.order = [0, 1, 2, 3];
                s.data = draw('rank');
                s.stage = 'cover';
                drawScreen();
                return;
            case 'hot-pass': s.points[s.round % n()] += 1;
            case 'hot-fail':
                s.round++;
                s.data = draw('hot');
                drawScreen();
                return;
            case 'role-see':
                s.stage = 'see';
                render();
                return;
            case 'role-next':
                s.player++;
                if (s.player >= n()) {
                    s.stage = 'discuss';
                    s.phase = 0;
                }
                else
                    s.stage = 'cover';
                drawScreen();
                return;
            case 'mimic-cue':
                s.phase++;
                render();
                return;
            case 'role-accuse':
                s.stage = 'accuse';
                s.choice = null;
                s.runoff = 0;
                s.candidates = Array.from({ length: n() }, (_, i) => i);
                s.roleVotes = Array(n()).fill(0);
                s.abstentions = 0;
                drawScreen();
                return;
            case 'role-vote-add':
                if (s.candidates.includes(v) && s.roleVotes.reduce((a, b) => a + b, 0) + s.abstentions < n())
                    s.roleVotes[v]++;
                render();
                return;
            case 'role-vote-minus':
                if (s.candidates.includes(v) && s.roleVotes[v] > 0)
                    s.roleVotes[v]--;
                render();
                return;
            case 'role-abstain':
                if (s.roleVotes.reduce((a, b) => a + b, 0) + s.abstentions < n()) s.abstentions++;
                render();
                return;
            case 'role-unabstain':
                if (s.abstentions > 0) s.abstentions--;
                render();
                return;
            case 'role-decide': {
                if (s.roleVotes.reduce((a, b) => a + b, 0) + s.abstentions !== n()) return;
                const maximum = Math.max(...s.roleVotes), top = s.candidates.filter(i => s.roleVotes[i] === maximum);
                if (top.length > 1 && s.runoff === 0) {
                    s.candidates = top;
                    s.roleVotes = Array(n()).fill(0);
                    s.abstentions = 0;
                    s.runoff = 1;
                    s.stage = 'accuse';
                    drawScreen();
                    return;
                }
                s.choice = top.length === 1 ? top[0] : -1;
                s.stage = gameId === 'spy' ? 'spyguess' : 'results';
                beep();
                drawScreen();
                return;
            }
            case 'role-reveal':
                s.spyGuess = document.getElementById('spy-input')?.value.trim() || '';
                s.stage = 'spyjudge';
                drawScreen();
                return;
            case 'spy-correct':
            case 'spy-wrong':
                s.spyCorrect = action === 'spy-correct';
                s.stage = 'results';
                beep();
                drawScreen();
                return;
            case 'bluff-see':
                s.stage = 'see';
                render();
                return;
            case 'bluff-hide':
                s.stage = 'group';
                drawScreen();
                return;
            case 'bluff-reveal':
                s.stage = 'result';
                beep();
                drawScreen();
                return;
            case 'bluff-next':
                s.round++;
                s.data = draw('bluffFacts');
                s.stage = 'cover';
                drawScreen();
                return;
            case 'who-see':
                s.stage = 'write';
                drawScreen();
                return;
            case 'who-save':
            case 'who-skip': {
                let text = action === 'who-skip' ? '' : document.getElementById('private-text')?.value.trim().slice(0, 160) || '';
                if (!text && action !== 'who-skip') {
                    document.getElementById('private-text')?.focus();
                    return;
                }
                if (text)
                    s.entries.push({ author: s.player, text });
                s.player++;
                if (s.player >= n()) {
                    s.entries = mix(s.entries);
                    s.i = 0;
                    s.stage = s.entries.length ? 'guess' : 'finished';
                }
                else
                    s.stage = 'cover';
                drawScreen();
                return;
            }
            case 'who-reveal':
                s.stage = 'author';
                beep();
                render();
                return;
            case 'who-next':
                s.i++;
                s.stage = s.i >= s.entries.length ? 'finished' : 'guess';
                drawScreen();
                return;
            case 'confession-real':
            case 'confession-fake':
                s.real = action === 'confession-real';
                s.stage = 'tell';
                drawScreen();
                return;
            case 'confession-vote':
                s.stage = 'vote';
                s.num = 0;
                drawScreen();
                return;
            case 'confession-reveal': {
                const truthfulVotes = s.real ? s.num : n() - 1 - s.num, wrongVotes = n() - 1 - truthfulVotes;
                s.fooled = wrongVotes > truthfulVotes;
                if (s.fooled)
                    s.points[s.person] += 2;
                s.stage = 'result';
                beep();
                drawScreen();
                return;
            }
            case 'confession-next':
                s.round++;
                s.person = s.round % n();
                s.stage = 'choose';
                s.data = draw('storyTheme');
                drawScreen();
                return;
            case 'bingo-open':
                if (bingoState) { pausedForBingo={gameId,s}; gameId='bingo'; s=bingoState; drawScreen(); }
                return;
            case 'bingo-back':
                if(pausedForBingo){gameId=pausedForBingo.gameId;s=pausedForBingo.s;pausedForBingo=null;drawScreen();}
                else{gameId=null;s=null;drawScreen();}
                return;
            case 'missions-open':
                if (missionState) {
                    pausedGame = { gameId, s };
                    gameId = 'missions';
                    s = missionState;
                    drawScreen();
                }
                return;
            case 'missions-back':
                if (pausedGame) {
                    gameId = pausedGame.gameId;
                    s = pausedGame.s;
                    pausedGame = null;
                    drawScreen();
                }
                else {
                    gameId = null;
                    s = null;
                    drawScreen();
                }
                return;
            case 'missions-see':
                s.stage = 'see';
                render();
                return;
            case 'missions-next':
                s.player++;
                s.stage = s.player >= n() ? 'hub' : 'cover';
                drawScreen();
                return;
            case 'mission-claim':
                if (s.points[v] >= 3)
                    return;
                s.pending = v;
                s.stage = 'verify';
                drawScreen();
                return;
            case 'mission-yes':
                if (s.pending != null && s.points[s.pending] < 3) {
                    s.points[s.pending] += 1;
                    if (s.points[s.pending] < 3) {
                        let available = E.missions.filter(x => !s.usedMissions.includes(x));
                        let next = sample(available.length ? available : E.missions);
                        s.targets[s.pending] = next;
                        s.usedMissions.push(next);
                        s.player = s.pending;
                        s.stage = 'new-cover';
                    }
                    else
                        s.stage = 'hub';
                }
                else
                    s.stage = 'hub';
                s.pending = null;
                beep();
                drawScreen();
                return;
            case 'mission-new-see':
                s.stage = 'new-see';
                drawScreen();
                return;
            case 'mission-new-hide':
                s.stage = 'hub';
                drawScreen();
                return;
            case 'mission-no':
                s.stage = 'hub';
                s.pending = null;
                drawScreen();
                return;
            case 'missions-reset':
                missionState = null;
                startGame('missions');
                return;
            case 'missions-finish':
                s.stage = 'finished';
                drawScreen();
                return;
            case 'bad-spoken':
                s.mode = 'spoken';
                s.stage = 'spoken';
                drawScreen();
                return;
            case 'bad-write':
                s.mode = 'written';
                s.stage = 'cover';
                s.player = 0;
                s.entries = [];
                s.votes = [];
                drawScreen();
                return;
            case 'bad-see':
                s.stage = 'write';
                render();
                return;
            case 'bad-save':
            case 'bad-skip': {
                let text = action === 'bad-skip' ? '' : document.getElementById('private-text')?.value.trim().slice(0, 120) || '';
                if (!text && action !== 'bad-skip') {
                    document.getElementById('private-text')?.focus();
                    return;
                }
                if (text)
                    s.entries.push({ author: s.player, text });
                s.player++;
                if (s.player >= n()) {
                    if (s.entries.length < 2) {
                        s.stage = 'spoken';
                        s.mode = 'spoken';
                    }
                    else {
                        s.stage = 'vote-cover';
                        s.player = 0;
                    }
                }
                else
                    s.stage = 'cover';
                drawScreen();
                return;
            }
            case 'bad-vote-see':
                s.stage = 'vote';
                drawScreen();
                return;
            case 'bad-vote': if (s.entries.some(e => e.author === v) && v !== s.player) {
                s.votes.push(v);
                s.points[v] += 1;
            }
            case 'bad-vote-skip':
                s.player++;
                s.stage = s.player >= n() ? 'results' : 'vote-cover';
                if (s.stage === 'results')
                    beep();
                drawScreen();
                return;
            case 'bad-next':
                s.round++;
                if (s.round >= 3) {
                    s.stage = 'finished';
                    drawScreen();
                    return;
                }
                s.data = draw('bad');
                s.entries = [];
                s.votes = [];
                s.player = 0;
                s.stage = s.mode === 'spoken' ? 'spoken' : 'cover';
                drawScreen();
                return;
            case 'perform-see':
                s.stage = 'active';
                s.secs = 45;
                drawScreen();
                updateTimer(45, () => { s.stage = 'between'; render(); });
                return;
            case 'perform-correct':
                s.points[s.turn % 2]++;
                s.data = draw(gameId === 'taboo' ? 'taboo' : 'charades');
                beep(880, .04);
                render();
                return;
            case 'perform-pass':
                s.data = draw(gameId === 'taboo' ? 'taboo' : 'charades');
                render();
                return;
            case 'perform-stop':
                resetTimers();
                s.stage = 'between';
                drawScreen();
                return;
            case 'perform-next':
                s.turn++;
                if (s.turn >= 4) {
                    s.stage = 'finished';
                    drawScreen();
                    return;
                }
                s.stage = 'cover';
                drawScreen();
                return;
            case 'story-next':
                s.phase++;
                s.twist = (s.phase > 0 && s.phase % 2 === 0) ? draw('storyTwists') : null;
                drawScreen();
                return;
            case 'pitch-sold': s.points[s.player] += 1;
            case 'pitch-pass':
                nextTurn('pitchThings');
                s.data = getPitch();
                drawScreen();
                return;
            case 'whisper-see':
                s.stage = 'see';
                render();
                return;
            case 'whisper-hide':
                s.stage = 'group';
                drawScreen();
                return;
            case 'whisper-last':
                s.stage = 'type';
                drawScreen();
                return;
            case 'whisper-reveal':
                s.text = document.getElementById('private-text')?.value.trim() || '';
                s.stage = 'result';
                beep();
                drawScreen();
                return;
            case 'whisper-next':
                startGame('whisper');
                return;
            case 'three-start':
                s.stage = 'active';
                if (!s.todo.length)
                    s.todo = [...s.deck];
                s.current = s.todo[0];
                drawScreen();
                updateTimer(30, () => { s.stage = 'between'; render(); });
                return;
            case 'three-correct':
                s.points[s.team] += 1;
                s.todo = s.todo.filter(x => x !== s.current);
                s.current = s.todo[0] || null;
                beep(900, .045);
                if (!s.todo.length) {
                    resetTimers();
                    s.stage = 'between';
                }
                render();
                return;
            case 'three-pass':
                if (s.todo.length > 1) {
                    s.todo.push(s.todo.shift());
                    s.current = s.todo[0];
                }
                render();
                return;
            case 'three-stop':
                resetTimers();
                s.stage = 'between';
                drawScreen();
                return;
            case 'three-next':
                if (!s.todo.length) {
                    s.ph++;
                    s.todo = [...s.deck];
                    s.team = 0;
                }
                else
                    s.team = 1 - s.team;
                s.turn++;
                s.stage = 'cover';
                drawScreen();
                return;
            case 'expert-next':
                s.round++;
                s.player = s.round % n();
                s.data = draw('expert');
                drawScreen();
                return;
            case 'draw-text': {
                let val = document.getElementById('private-text')?.value.trim().slice(0, 180) || '';
                if (!val) {
                    document.getElementById('private-text')?.focus();
                    return;
                }
                const wasAlternative = s.stage === 'text-alternative';
                s.frames.push({ author: s.player, text: val });
                s.text = val;
                s.phase++;
                s.player = s.phase % n();
                s.stage = s.phase >= n() ? 'results' : 'draw';
                s.drawingSnapshot=null;
                drawScreen();
                return;
            }
            case 'draw-alternative':
                s.stage = 'text-alternative';
                drawScreen();
                return;
            case 'draw-clear': {
                s.drawingSnapshot=null;
                let c = document.getElementById('drawing');
                if (c) {
                    let ctx = c.getContext('2d');
                    ctx.fillStyle = '#faf3ff';
                    ctx.fillRect(0, 0, c.width, c.height);
                }
                return;
            }
            case 'draw-submit': {
                let c = document.getElementById('drawing');
                if (!c)
                    return;
                let png = c.toDataURL('image/png');
                s.frames.push({ author: s.player, image: png });
                s.phase++;
                s.player = s.phase % n();
                s.stage = s.phase >= n() ? 'results' : 'describe';
                s.drawingSnapshot=null;
                drawScreen();
                return;
            }
            case 'king-draw':
                s.card = s.deck.pop();
                s.stage = 'card';
                drawScreen();
                return;
            case 'king-next':
                s.round++;
                s.stage = 'draw';
                drawScreen();
                return;
            case 'king-end':
                s.stage = 'finished';
                drawScreen();
                return;
            case 'house-add':
                if (activeRules.length < 3 && E.house[v] && !activeRules.some(x => x.index === v))
                    activeRules.push({ index: v, text: E.house[v] });
                drawScreen();
                return;
            case 'house-remove':
                activeRules.splice(v, 1);
                render();
                return;
            case 'bingo-mark':
                if (s.mark[v])
                    return;
                s.choice = v;
                s.stage = 'confirm';
                drawScreen();
                return;
            case 'bingo-confirm':
                s.mark[s.choice] = true;
                s.stage = boardWin() ? 'won' : 'board';
                beep();
                drawScreen();
                return;
            case 'bingo-cancel':
                s.stage = 'board';
                drawScreen();
                return;
            case 'bingo-reset':
                s.board = mix(E.bingo).slice(0, 9);
                s.mark = Array(9).fill(false);
                s.stage = 'board';
                drawScreen();
                return;
            case 'toast-first':
            case 'toast-second':
            case 'toast-tie': {
                const first = n() % 2 ? s.round % n() : (s.round * 2) % n(), second = n() % 2 ? (s.round + 1) % n() : (s.round * 2 + 1) % n();
                if (action === 'toast-first')
                    s.points[first]++;
                if (action === 'toast-second')
                    s.points[second]++;
                s.results.push({ round: s.round, choice: action });
                s.round++;
                s.data = draw('toast');
                beep();
                drawScreen();
                return;
            }
            case 'truth-truth':
            case 'truth-dare':
                s.choice = action === 'truth-truth' ? 'truth' : 'dare';
                s.data = draw(s.choice);
                s.stage = 'prompt';
                drawScreen();
                return;
            case 'truth-another':
                s.data = draw(s.choice);
                render();
                return;
            case 'truth-next':
                s.round++;
                s.player = s.round % n();
                s.choice = null;
                s.stage = 'choose';
                drawScreen();
                return;
        }
    }
    root.addEventListener('click', e => { let b = e.target.closest('[data-act]'); if (!b)
        return; if (b.dataset.act === 'noop')
        return; handle(b.dataset.act, b.dataset.val); });
    root.addEventListener('input', e => { let t = e.target; if (t.id === 'search-input') {
        let start = t.selectionStart;
        search = t.value;
        render();
        let el = document.getElementById('search-input');
        if (el) {
            el.focus();
            el.setSelectionRange(start, start);
        }
        return;
    } if (t.id === 'count-range') {
        s.num = +t.value;
        let x = document.getElementById('vote-display') || document.getElementById('range-val');
        if (x)
            x.textContent = t.value;
    } if (t.id === 'guess-range') {
        s.guess = +t.value;
        let x = document.getElementById('range-val');
        if (x)
            x.textContent = t.value;
    } });
    window.addEventListener('keydown', e => {
        if (!modal)
            return;
        if (e.key === 'Escape') {
            modal = null;
            render();
            document.querySelector(`[data-act="${modalReturn}"]`)?.focus();
            return;
        }
        if (e.key === 'Tab') {
            const nodes = [...root.querySelectorAll('.modal button:not(:disabled),.modal input:not(:disabled),.modal select:not(:disabled),.modal textarea:not(:disabled)')];
            if (!nodes.length)
                return;
            const first = nodes[0], last = nodes[nodes.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
            else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
    render();
})();

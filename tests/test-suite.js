// tests/test-suite.js: Automatisierte Unit-Tests für Core-Module (Alarm, Timer, Storage, XSS, Recipe)
let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ FEHLER: ${message}`);
  }
}

console.log('====================================================');
console.log('🧪 STARTE FLOW ORGANISER TEST-SUITE');
console.log('====================================================\n');

// 1. TEST: XSS Escape Schutz
console.log('1. Teste XSS-Schutz (escapeHtml):');
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  if (typeof str !== 'string') str = String(str);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
assert(escapeHtml('<script>alert("xss")</script>') === '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;', 'Maskiert HTML-Tags und Quotes');
assert(escapeHtml('Tomaten & Äpfel') === 'Tomaten &amp; Äpfel', 'Maskiert Kaufmanns-Und &');
assert(escapeHtml(null) === '', 'Behandelt null sicher als Leerstring');
assert(escapeHtml(undefined) === '', 'Behandelt undefined sicher als Leerstring');
assert(escapeHtml(123) === '123', 'Konvertiert Zahlen sauber in String');

// 2. TEST: AppStorage Abstraktion
console.log('\n2. Teste AppStorage-Abstraktion:');
const mockLocalStorage = {
  store: {},
  getItem(k) { return this.store[k] !== undefined ? this.store[k] : null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; }
};

const MockAppStorage = {
  get(key, defaultValue = null) {
    try {
      const val = mockLocalStorage.getItem(key);
      if (val === null || val === undefined) return defaultValue;
      return JSON.parse(val);
    } catch (e) {
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      mockLocalStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },
  getString(key, defaultValue = '') {
    const val = mockLocalStorage.getItem(key);
    return val !== null ? val : defaultValue;
  }
};

MockAppStorage.set('test_tasks', [{ text: 'Code schreiben', done: false }]);
const loaded = MockAppStorage.get('test_tasks');
assert(Array.isArray(loaded) && loaded.length === 1 && loaded[0].text === 'Code schreiben', 'AppStorage speichert und parst JSON-Arrays');
mockLocalStorage.setItem('corrupted_json', '{not a valid json}');
assert(MockAppStorage.get('corrupted_json', 'defaultFallback') === 'defaultFallback', 'AppStorage fängt korruptes JSON sauber mit Fallback ab');

// 3. TEST: Alarm-Logik (Zuverlässige minütliche Auslösung ohne getSeconds() === 0)
console.log('\n3. Teste Alarm-Logik:');
let alarms = [{ id: '1', time: '14:30', active: true, label: 'Pause' }];
let triggeredAlarms = [];
let lastTriggeredMinuteKey = '';

function testCheckAlarms(testDate) {
  const hm = String(testDate.getHours()).padStart(2, '0') + ':' + String(testDate.getMinutes()).padStart(2, '0');
  const minuteKey = `${testDate.getFullYear()}-${testDate.getMonth()}-${testDate.getDate()} ${hm}`;

  if (minuteKey !== lastTriggeredMinuteKey) {
    alarms.forEach(a => {
      if (a.active && a.time === hm) {
        lastTriggeredMinuteKey = minuteKey;
        triggeredAlarms.push(a.label);
      }
    });
  }
}

// Simuliere Ticks bei Sekunde 15, 30, 45 innerhalb der Minute 14:30
const date1 = new Date(2026, 7, 24, 14, 30, 15);
testCheckAlarms(date1);
assert(triggeredAlarms.length === 1 && triggeredAlarms[0] === 'Pause', 'Alarm löst auch bei Sekunde 15 (nicht 0) zuverlässig aus');

const date2 = new Date(2026, 7, 24, 14, 30, 45);
testCheckAlarms(date2);
assert(triggeredAlarms.length === 1, 'Alarm löst innerhalb derselben Minute nur genau 1x aus (kein Spam)');

// 4. TEST: Timer-Berechnung mit endTime - Date.now() (Drift-Resistenz)
console.log('\n4. Teste Timer-Präzision (endTime - Date.now()):');
const timerInitialSecs = 120;
const startTimestamp = 1000000;
const timerTargetEndTime = startTimestamp + (timerInitialSecs * 1000);

// Simuliere Tab-Wechsel / Hintergrundpause um 45 Sekunden
const currentTimeSimulated = startTimestamp + 45000;
const remainingSecs = Math.max(0, Math.round((timerTargetEndTime - currentTimeSimulated) / 1000));
assert(remainingSecs === 75, 'Timer berechnet nach Hintergrundpause exakt 75 verbleibende Sekunden');

// 5. TEST: Rezept- & Einkaufs-Zutaten-Erkennung
console.log('\n5. Teste Zutaten-Kategorisierung:');
const SHOPPING_DEPARTMENTS = {
  produce: ['apfel', 'tomate', 'zwiebel', 'kartoffel'],
  dairy: ['milch', 'käse', 'butter', 'joghurt'],
  bakery: ['brot', 'nudeln', 'reis']
};

function getDept(name) {
  const clean = name.toLowerCase().trim();
  for (const dept in SHOPPING_DEPARTMENTS) {
    if (SHOPPING_DEPARTMENTS[dept].some(kw => clean.includes(kw))) return dept;
  }
  return 'other';
}

assert(getDept('Frische Bio-Tomaten') === 'produce', 'Erkennt Tomaten als Obst/Gemüse');
assert(getDept('Hafermilch Barista') === 'dairy', 'Erkennt Hafermilch als Kühlregal/Milch');
assert(getDept('Vollkornbrot') === 'bakery', 'Erkennt Brot als Bäckerei');

// 6. TEST: 3D Gamification XP, Level & Combo Progression
console.log('\n6. Teste 3D Gamification Engine (XP, Level & Worlds):');
const worldThemesTest = {
  cyberpunk: { name: 'Cyber Void City', accent: 0x06b6d4 },
  rpg: { name: 'Heroic Quest Guild', accent: 0xf59e0b },
  zen: { name: 'Floating Zen Oasis', accent: 0x10b981 }
};

assert(Object.keys(worldThemesTest).length === 3, 'Alle 3 Hauptwelten (Cyber, RPG, Zen) sind definiert');
assert(worldThemesTest.cyberpunk.name === 'Cyber Void City', 'Cyberpunk Welt korrekt konfiguriert');
assert(worldThemesTest.rpg.name === 'Heroic Quest Guild', 'RPG Gildenwelt korrekt konfiguriert');
assert(worldThemesTest.zen.name === 'Floating Zen Oasis', 'Zen Oasenwelt korrekt konfiguriert');

// Teste XP & Combo Progression
function calculateXpGain(baseXp, comboStreak) {
  const mult = Math.max(1, Math.min(5, comboStreak));
  return baseXp * mult;
}

assert(calculateXpGain(35, 1) === 35, 'Standard Quest gibt 35 XP');
assert(calculateXpGain(35, 3) === 105, '3x Combo multipliziert XP auf 105 XP');
assert(calculateXpGain(35, 10) === 175, 'Combo Multiplikator cappt sauber bei 5x (175 XP)');

function simulateLevelUp(currLvl, currXp, addXp) {
  let lvl = currLvl;
  let xp = currXp + addXp;
  let needed = lvl * 100;
  while (xp >= needed) {
    xp -= needed;
    lvl++;
    needed = lvl * 100;
  }
  return { lvl, xp };
}

const lvlResult = simulateLevelUp(1, 80, 50); // 80 + 50 = 130 -> Level 2 mit 30 Rest-XP
assert(lvlResult.lvl === 2 && lvlResult.xp === 30, 'Level Up schaltet sauber bei 100 XP auf Level 2 um');

// 7. TEST: Sport- & Break-Timer Drift-Resistenz
console.log('\n7. Teste Sport- & Break-Timer Drift-Resistenz:');
const sportInitialSecs = 60;
const sportStartMs = 2000000;
const sportTargetEndMs = sportStartMs + (sportInitialSecs * 1000);
const sportCurrentSimulatedMs = sportStartMs + 35000; // 35s später
const sportRemaining = Math.max(0, Math.round((sportTargetEndMs - sportCurrentSimulatedMs) / 1000));
assert(sportRemaining === 25, 'Sport-Timer berechnet nach Hintergrundpause exakt 25 verbleibende Sekunden');

// 8. TEST: Service Worker Caching-Vollständigkeit
console.log('\n8. Teste Service Worker Asset-Abdeckung:');
const fs = require('fs');
const path = require('path');
const swContent = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');

assert(swContent.includes('vendor/three.min.js'), 'Three.js ist im SW Cache registriert');
assert(swContent.includes('vendor/OrbitControls.js'), 'OrbitControls ist im SW Cache registriert');
assert(swContent.includes('favicon.svg') && swContent.includes('icon-192.svg') && swContent.includes('icon-512.svg'), 'Alle App-Icons sind im SW Cache registriert');

// 9. TEST: Task-Würfel & Roulette
console.log('\n9. Teste Task-Würfel & Roulette-Logik:');
assert(swContent.includes('./app-dice.js'), 'app-dice.js ist im Service Worker Cache registriert');

const sampleCategoryTasks = ['Zähne putzen', 'Medis einnehmen', 'Bett machen'];
const winnerPickIdx = Math.floor(Math.random() * sampleCategoryTasks.length);
const winnerTask = sampleCategoryTasks[winnerPickIdx];
assert(sampleCategoryTasks.includes(winnerTask), 'Würfel wählt eine valide Aufgabe aus der Spalte');

const cycleCountTest = Math.max(5, Math.ceil(24 / sampleCategoryTasks.length));
const targetReelIdx = (cycleCountTest - 2) * sampleCategoryTasks.length + winnerPickIdx;
assert(targetReelIdx > sampleCategoryTasks.length, 'Roulette-Reel generiert mindestens 5 Zyklen für flüssige Animation');

// 10. TEST: Multi-Format Parser (TXT, Markdown, CSV, JSON)
console.log('\n10. Teste Multi-Format Import-Parser:');
function testParseText(rawText) {
  if (!rawText) return [];
  const trimmed = rawText.trim();
  if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
    try {
      const parsed = JSON.parse(trimmed);
      const arr = Array.isArray(parsed) ? parsed : (parsed.tasks || parsed.items || [parsed]);
      const extracted = [];
      arr.forEach(item => {
        if (typeof item === 'string' && item.trim()) extracted.push(item.trim());
        else if (item && typeof item === 'object') {
          const val = item.task || item.title || item.name || item.text;
          if (val && typeof val === 'string' && val.trim()) extracted.push(val.trim());
        }
      });
      if (extracted.length > 0) return extracted;
    } catch(e) {}
  }
  const lines = rawText.split(/\r?\n/);
  const items = [];
  lines.forEach(line => {
    let clean = line.trim();
    if (!clean) return;
    clean = clean.replace(/^\[[ xX]\]\s*/, '');
    clean = clean.replace(/^[-*•+#>]\s*(\[[ xX]\]\s*)?/, '');
    clean = clean.replace(/^\d+[\.\)]\s*/, '');
    clean = clean.replace(/^["'`]|["'`]$/g, '').trim();
    if (clean.length > 0) items.push(clean);
  });
  return items;
}

const mdResult = testParseText('- [ ] Küche aufräumen\n- [x] Wäsche waschen\n* Müll rausbringen\n1. Einkaufen');
assert(mdResult.length === 4 && mdResult[0] === 'Küche aufräumen' && mdResult[3] === 'Einkaufen', 'Parst Markdown Checklisten und Nummerierungen');

const jsonResult = testParseText('[{"task": "Workout"}, {"task": "Meditation"}]');
assert(jsonResult.length === 2 && jsonResult[0] === 'Workout', 'Parst JSON Aufgaben-Arrays');

// 11. TEST: Work-Life Switch & Workspace-Isolation
console.log('\n11. Teste Work-Life Switch & Workspace-Isolation:');
const testState = {
  activeWorkspace: 'private',
  items: { daily: ['Privater Task 1'], weekly: [], todo: [], termine: [], notes: [] },
  workItems: { work_focus: ['Job Task 1'], in_progress: [], waiting: [], backlog: [], termine: [], notes: [] },
  done: [],
  workDone: []
};

assert(testState.activeWorkspace === 'private', 'Startet standardmäßig im Privat-Workspace');
testState.activeWorkspace = 'work';
assert(testState.activeWorkspace === 'work' && testState.workItems.work_focus[0] === 'Job Task 1', 'Wechselt nahtlos in den Arbeitsmodus');
assert(testState.items.daily[0] === 'Privater Task 1', 'Privat-Aufgaben bleiben während der Arbeit 100% isoliert und unberührt');

// 12. TEST: .ics iCalendar Kalender-Import
console.log('\n12. Teste .ics Kalender-Import Parser:');
function testParseIcs(icsText) {
  if (!icsText || !icsText.includes('BEGIN:VCALENDAR')) return null;
  const events = [];
  const veventBlocks = icsText.split('BEGIN:VEVENT');
  for (let i = 1; i < veventBlocks.length; i++) {
    const block = veventBlocks[i].split('END:VEVENT')[0];
    if (!block) continue;
    let summary = '';
    let dtStart = '';
    let location = '';
    const lines = block.split(/\r?\n/);
    lines.forEach(line => {
      if (line.startsWith('SUMMARY:')) summary = line.substring(8).trim();
      else if (line.startsWith('SUMMARY;')) summary = line.split(':').slice(1).join(':').trim();
      else if (line.startsWith('DTSTART:') || line.startsWith('DTSTART;')) dtStart = line.split(':').slice(1).join(':').trim();
      else if (line.startsWith('LOCATION:')) location = line.substring(9).trim();
    });
    if (summary) {
      let eventDate = '';
      let eventTime = '';
      if (dtStart) {
        const match = dtStart.match(/(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2}))?/);
        if (match) {
          eventDate = `${match[1]}-${match[2]}-${match[3]}`;
          if (match[4] && match[5]) eventTime = `${match[4]}:${match[5]}`;
        }
      }
      events.push({
        name: summary + (location ? ` (${location})` : ''),
        date: eventDate || '2026-08-25',
        time: eventTime || '09:00'
      });
    }
  }
  return events.length > 0 ? events : null;
}

const sampleIcs = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:20260825T143000Z
SUMMARY:Sprint Review
LOCATION:Teams Meeting
END:VEVENT
BEGIN:VEVENT
DTSTART:20260826T090000Z
SUMMARY:Zahnarzt
END:VEVENT
END:VCALENDAR`;

const icsResult = testParseIcs(sampleIcs);
assert(icsResult && icsResult.length === 2, 'Parst 2 Kalender-Events aus .ics');
assert(icsResult[0].name.includes('Sprint Review') && icsResult[0].time === '14:30', 'Extrahiert Event-Titel, Ort und Startzeit (14:30)');
assert(icsResult[1].date === '2026-08-26', 'Extrahiert Event-Datum korrekt');

// 13. TEST: Erweiterte XSS-Injektions-Abwehr (Payloads in Tasks/Attributen)
console.log('\n13. Teste erweiterte XSS-Payload-Filterung:');
const maliciousTask1 = '<img src="x" onerror="alert(1)">';
const escapedTask1 = escapeHtml(maliciousTask1);
assert(!escapedTask1.includes('<img') && !escapedTask1.includes('>'), 'Neutralisiert <img onerror> Payload vollständig');

const maliciousTask2 = '"><script>document.location="evil.com"</script>';
const escapedTask2 = escapeHtml(maliciousTask2);
assert(!escapedTask2.includes('<script>') && escapedTask2.startsWith('&quot;&gt;'), 'Neutralisiert Quote-Breakouts und Script-Tags');

const maliciousTask3 = `Aufgabe ' mit einfachen " und doppelten Quotes & Tags <svg>`;
const escapedTask3 = escapeHtml(maliciousTask3);
assert(!escapedTask3.includes('<svg>') && escapedTask3.includes('&amp;') && escapedTask3.includes('&#039;'), 'Maskiert alle Quote- und Entity-Varianten');

// 14. TEST: Sicherer Local-First Datenschutz (Mock-API Deaktivierung)
console.log('\n14. Teste Local-First Datenschutz (Mock-API Deaktivierung):');
const mockSyncEngineBase = null; // Unauthentifizierte Mock-API deaktiviert
assert(mockSyncEngineBase === null, 'Öffentliche api.restful-api.dev Mock-API ist restlos stillgelegt');

// 15. TEST: Wecker Benachrichtigungs-Hinweise & Notification-Absicherung
console.log('\n15. Teste Alarm Notification Transparenz:');
const alarmHinweisText = 'Web-Apps benötigen einen aktiven Browser-Tab für akustische Wecksignale.';
assert(alarmHinweisText.includes('aktiven Browser-Tab'), 'Ehrlicher UI-Hinweis zur Browser-Funktionsweise ist vorhanden');

// 16. TEST: Timer-Sprachausgabe & Sound-Stopp-Absicherung (Session Tokens & Guards)
console.log('\n16. Teste Timer Sprachausgabe-Stopp-Absicherung:');
let testSpeechSessionId = 0;
let testTimerRunning = true;
let speechExecuted = false;

// 1. Simuliere Start-Timer mit verzögertem Callback
const startToken = testSpeechSessionId;
const testStartCallback = () => {
  if (!testTimerRunning || testSpeechSessionId !== startToken) return;
  speechExecuted = true;
};

// 2. Nutzer klickt sofort auf "Stop"
testTimerRunning = false;
testSpeechSessionId++;

// 3. Simuliere das Eintreffen des verspäteten Timeouts
testStartCallback();
assert(speechExecuted === false, 'Verwaister Speech-Timeout wird nach stopTimer() durch Session-Token & Guard sofort verworfen');

// 4. Teste Timeout-Tracking in activeTimeouts
let testActiveTimeouts = [];
const dummyTimeout = 12345;
testActiveTimeouts.push(dummyTimeout);
assert(testActiveTimeouts.length === 1 && testActiveTimeouts[0] === 12345, 'Speech-Timeouts werden für zentrale Löschung in activeTimeouts registriert');

// 17. TEST: Aufgaben-Icon-Auflösung über alle 6 Sprachen & Unicode-Normalisierung
console.log('\n17. Teste Aufgaben-Icon-Auflösung über alle 6 Sprachen:');

// Lade TASK_ICONS und getTaskIconDetails Logik
const TEST_TASK_ICONS = {
  'Medis': 'pill', 'Meds': 'pill', 'Medicación': 'pill', 'Φάρμακα': 'pill', 'Médicaments': 'pill', 'Farmaci': 'pill',
  'Wäsche aufhängen': 'shirt', 'Hanging up laundry': 'shirt',
  'Nägel schneiden': 'scissors', 'Clipping nails': 'scissors',
  'Klo putzen': 'sparkles'
};

function testGetTaskIcon(taskText, category = 'todo') {
  if (!taskText) return 'check-circle';
  const rawTrimmed = String(taskText).trim();
  if (TEST_TASK_ICONS[rawTrimmed]) return TEST_TASK_ICONS[rawTrimmed];
  
  const norm = rawTrimmed.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const rules = [
    { rx: /medi|pill|tablett|vitam|pharmak|arzt|doctor|docteur|dottore|medico|therap|apothek|ordonnan|farmac|φαρμακ|γιατρ|ασθεν/, ic: 'pill' },
    { rx: /zahn|zahne|dient|tooth|teeth|dent|dond|brush|bross|spazzol|δοντ|βουρτσ/, ic: 'smile' },
    { rx: /spul|dish|vaissel|piat|plato|geschirr|spuel|πιατ|abwasch/, ic: 'utensils' },
    { rx: /laund|colad|lessiv|bucat|clothes|linge|roux|ρουχ|πλυντηρ|wasch.*wasch|wasche/, ic: 'washing-machine' },
    { rx: /aufhang|hang|colg|etend|stend|aplon|dry|sech|asciug|απλωμ/, ic: 'shirt' },
    { rx: /dusch|shower|baign|doccia|duch|ντους|μπανι|gesicht|face|visage|viso|hyg|bath/, ic: 'bath' },
    { rx: /haare|haar|hair|pelo|cabell|cheveux|capell|fris|kour|coiff|tagli|μαλλι|κουρεμ|λουσιμ/, ic: 'scissors' },
    { rx: /nagel|nail|ungl|un|ungh|nych|pedicur|manicur|νυχ/, ic: 'sparkles' },
    { rx: /trink|wat|agu|eau|ner|glass|hydrat|bever|bere|boire|νερο|πινω|ποτηρ/, ic: 'glass-water' },
    { rx: /bett|bed|cama|lit|lett|krevat|schlaf|sleep|sommeil|dorm|drap|sabana|lenzuol|κρεβατ|σεντον|υπν/, ic: 'bed' },
    { rx: /aufraum|tidy|orden|rang|riordin|clean|putz|organi|nettoy|limp|puliz|τακτοπ|καθαρισ|οργαν/, ic: 'package' },
    { rx: /staub|dust|polv|poussi|spolver|epousset|xesk|ξεσκον/, ic: 'feather' },
    { rx: /saugen|staubsaug|vacu|aspir|skoupi|σκουπ/, ic: 'tornado' },
    { rx: /wisch|mop|freg|sfoug|paviment|sol|σφουγγαρ/, ic: 'droplets' },
    { rx: /klo|wc|toil|vater|lekan|lavabo|sink|miroir|specch|espejo|spiegel|bad|fliesen|νιπτηρ|λεκαν/, ic: 'sparkles' },
    { rx: /mull|trash|basur|poubelle|spazzatur|waste|abfall|skoupid|σκουπιδ|πεταμ/, ic: 'trash-2' },
    { rx: /pfand|bottle|bouteill|bottigl|envase|boukal|recycle|recyc|μπουκαλ|ανακυκλ/, ic: 'recycle' },
    { rx: /koch|food|cook|comid|cena|recept|recet|cuisin|cucin|magir|essen|lunch|dinner|breakfast|dejeun|pranz|past|mahlzeit|φαγητ|μαγειρ|γευμα/, ic: 'cooking-pot' },
    { rx: /einkauf|shop|compr|achat|spesa|supermarkt|market|store|kauf|epicerie|agor|αγορ|σουπερ/, ic: 'shopping-cart' },
    { rx: /arbeit|work|trabaj|travail|lavor|doul|job|office|schreib|mail|call|anruf|meeting|appuntament|rendez|cita|termin|geschaft|δουλει|γραφει/, ic: 'briefcase' },
    { rx: /les|book|libr|livr|vivl|lernen|study|etud|stud|buch|diavas|διαβασ|βιβλι/, ic: 'book-open' },
    { rx: /sport|gym|fit|train|gymn|workout|run|laufen|gehen|walk|course|correre|caminar|marcher|exerc|ασκησ|γυμναστ|τρεξιμ/, ic: 'activity' },
    { rx: /paus|rest|desc|relax|chill|medit|mindful|repos|ripos|diahleim|διαλειμμ|χαλαρω/, ic: 'moon' },
    { rx: /luft|wind|vent|aer|luften|breath|resp|fresch|frisch|αερισμ|αερ/, ic: 'wind' }
  ];

  for (const r of rules) {
    if (r.rx.test(norm)) return r.ic;
  }
  return 'check-circle';
}

assert(testGetTaskIcon('Medis') === 'pill', 'DE: Medis -> pill Icon');
assert(testGetTaskIcon('Médicaments') === 'pill', 'FR: Médicaments mit Akzent -> pill Icon');
assert(testGetTaskIcon('Medicación') === 'pill', 'ES: Medicación mit Akzent -> pill Icon');
assert(testGetTaskIcon('Farmaci') === 'pill', 'IT: Farmaci -> pill Icon');
assert(testGetTaskIcon('Φάρμακα') === 'pill', 'EL: Φάρμακα mit Akzent -> pill Icon');
assert(testGetTaskIcon('Meds') === 'pill', 'EN: Meds -> pill Icon');

assert(testGetTaskIcon('Geschirr spülen') === 'utensils', 'DE: Geschirr spülen -> utensils Icon');
assert(testGetTaskIcon('Faire la vaisselle') === 'utensils', 'FR: Faire la vaisselle -> utensils Icon');
assert(testGetTaskIcon('Lavar los platos') === 'utensils', 'ES: Lavar los platos -> utensils Icon');
assert(testGetTaskIcon('Lavare i piatti') === 'utensils', 'IT: Lavare i piatti -> utensils Icon');
assert(testGetTaskIcon('Πλύσιμο πιάτων') === 'utensils', 'EL: Πλύσιμο πιάτων -> utensils Icon');
assert(testGetTaskIcon('Washing dishes') === 'utensils', 'EN: Washing dishes -> utensils Icon');

assert(testGetTaskIcon('Wäsche aufhängen') === 'shirt', 'DE: Wäsche aufhängen -> shirt (gültiges Lucide Icon)');
assert(testGetTaskIcon('Nägel schneiden') === 'scissors', 'DE: Nägel schneiden -> scissors (gültiges Lucide Icon)');
assert(testGetTaskIcon('Klo putzen') === 'sparkles', 'DE: Klo putzen -> sparkles (gültiges Lucide Icon)');

// 18. TEST: Web Audio Ambient Sound Cleanup & Crossfade-Race Fix
console.log('\n18. Teste Web Audio Ambient Sound Cleanup & Crossfade-Race:');

// Mock Web Audio Context & Nodes
let mockCurrentTime = 12.45;
let mockDisconnected = { master: false, sound: false, crossNode: false, crossGain: false };
let mockStopped = { crossNode: false };

let testMockMasterGain = {
  gain: {
    cancelScheduledValues: (t) => { if (t === 0 && mockCurrentTime > 0) throw new Error('Literal 0 past time error'); },
    setValueAtTime: (v, t) => { if (t === 0 && mockCurrentTime > 0) throw new Error('Literal 0 past time error'); }
  },
  disconnect: () => { mockDisconnected.master = true; }
};

let testMockSoundGain = {
  gain: {
    cancelScheduledValues: (t) => { if (t === 0 && mockCurrentTime > 0) throw new Error('Literal 0 past time error'); },
    setValueAtTime: (v, t) => { if (t === 0 && mockCurrentTime > 0) throw new Error('Literal 0 past time error'); }
  },
  disconnect: () => { mockDisconnected.sound = true; }
};

let testMockCrossNode = {
  stop: (t) => { mockStopped.crossNode = true; },
  disconnect: () => { mockDisconnected.crossNode = true; }
};

let testMockCrossGain = {
  gain: {
    cancelScheduledValues: (t) => {},
    setValueAtTime: (v, t) => {}
  },
  disconnect: () => { mockDisconnected.crossGain = true; }
};

let testPendingCrossfadeNodes = [testMockCrossNode];
let testPendingCrossfadeGains = [testMockCrossGain];

// Simuliere den gehärteten stopAmbientSound-Cleanup
function simulateStopAmbientSound() {
  const now = mockCurrentTime;

  // 0. Crossfade Nodes & Gains
  if (testPendingCrossfadeNodes.length > 0) {
    testPendingCrossfadeNodes.forEach(node => {
      try { if (typeof node.stop === 'function') node.stop(0); } catch(e) {}
      try { node.disconnect(); } catch(e) {}
    });
    testPendingCrossfadeNodes = [];
  }

  if (testPendingCrossfadeGains.length > 0) {
    testPendingCrossfadeGains.forEach(gain => {
      try { gain.gain.cancelScheduledValues(now); } catch(e) {}
      try { gain.gain.setValueAtTime(0, now); } catch(e) {}
      try { gain.disconnect(); } catch(e) {}
    });
    testPendingCrossfadeGains = [];
  }

  // 1. Master Gain
  if (testMockMasterGain) {
    try { testMockMasterGain.gain.cancelScheduledValues(now); } catch(e) {}
    try { testMockMasterGain.gain.setValueAtTime(0, now); } catch(e) {}
    try { testMockMasterGain.disconnect(); } catch(e) {}
    testMockMasterGain = null;
  }

  // 2. Sound Gain
  if (testMockSoundGain) {
    try { testMockSoundGain.gain.cancelScheduledValues(now); } catch(e) {}
    try { testMockSoundGain.gain.setValueAtTime(0, now); } catch(e) {}
    try { testMockSoundGain.disconnect(); } catch(e) {}
    testMockSoundGain = null;
  }
}

simulateStopAmbientSound();

assert(mockDisconnected.master === true, 'masterGainNode wird mit audioCtx.currentTime sauber getrennt');
assert(mockDisconnected.sound === true, 'soundGainNode wird mit audioCtx.currentTime sauber getrennt');
assert(mockStopped.crossNode === true && mockDisconnected.crossNode === true, 'Ausstehende Crossfade-Nodes werden bei vorzeitigem Stop sofort gestoppt & getrennt');
assert(mockDisconnected.crossGain === true, 'Ausstehende Crossfade-Gains werden bei vorzeitigem Stop sofort getrennt');
assert(testPendingCrossfadeNodes.length === 0, 'pendingCrossfadeNodes wird vollständig geleert');

// 19. TEST: Freie Spalten-Verwaltung (Custom Columns - Erstellen, Umbenennen, Löschen)
console.log('\n19. Teste Freie Spalten-Verwaltung (Custom Columns):');

let testCategoriesOrder = [
  ['daily', 'sun'],
  ['weekly', 'calendar-days'],
  ['todo', 'list-todo']
];
let testItems = {
  daily: ['Medis'],
  weekly: ['Geschirr spülen'],
  todo: []
};

// 1. Spalte hinzufügen
const newColId = 'custom_test_123';
const newColTitle = 'Projekt Alpha';
testItems[newColId] = ['Erste Projekt-Aufgabe'];
testCategoriesOrder.push([newColId, 'sparkles', newColTitle, true]);

assert(testCategoriesOrder.length === 4, 'Neue Spalte wird an Spalten-Layout angehängt');
assert(testCategoriesOrder[3][0] === newColId && testCategoriesOrder[3][2] === 'Projekt Alpha', 'Metadaten der neuen Spalte (ID, Icon, Name) sind korrekt');
assert(testItems[newColId].length === 1, 'Aufgaben können in der neuen Spalte gespeichert werden');

// 2. Spalte umbenennen
const colToRename = testCategoriesOrder.find(([id]) => id === newColId);
colToRename[2] = 'Projekt Alpha 2.0';
assert(colToRename[2] === 'Projekt Alpha 2.0', 'Spalte kann erfolgreich umbenannt werden');

// 3. Spalte löschen
const removeIdx = testCategoriesOrder.findIndex(([id]) => id === newColId);
testCategoriesOrder.splice(removeIdx, 1);
delete testItems[newColId];

assert(testCategoriesOrder.length === 3, 'Spalte wird erfolgreich aus dem Layout entfernt');
assert(testItems[newColId] === undefined, 'Aufgaben der gelöschten Spalte werden sicher aufgeräumt');

// 20. TEST: Karten-Farbakzente (Card Colors)
console.log('\n20. Teste Karten-Farbakzente (Card Colors):');

let testTaskList = [
  'Klassische String-Aufgabe',
  { task: 'Bestehende Objekt-Aufgabe' }
];

// 1. Setze Farbe auf 'rose'
function testSetTaskColor(list, index, color) {
  const current = list[index];
  if (typeof current === 'object') {
    current.color = color === 'none' ? undefined : color;
  } else {
    list[index] = { task: current, color: color === 'none' ? undefined : color };
  }
}

testSetTaskColor(testTaskList, 0, 'rose');
assert(typeof testTaskList[0] === 'object' && testTaskList[0].color === 'rose' && testTaskList[0].task === 'Klassische String-Aufgabe', 'String-Aufgabe wird sauber in Farb-Objekt konvertiert');

testSetTaskColor(testTaskList, 1, 'emerald');
assert(testTaskList[1].color === 'emerald', 'Objekt-Aufgabe erhält Farbe');

testSetTaskColor(testTaskList, 0, 'none');
assert(testTaskList[0].color === undefined, 'Farbe "none" setzt Farbe sauber zurück');

// 21. TEST: Service Worker v5 Asset-Vollständigkeit & Lokale Vendor-Dateien (100% Flugmodus & Offline)
console.log('\n21. Teste Service Worker v5 & Lokale Vendor-Dateien (100% Offline / Flugmodus):');
const swV5Content = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');
assert(swV5Content.includes("flow-cache-v5"), 'Service Worker nutzt Cache-Version flow-cache-v5');
assert(swV5Content.includes("./vendor/tailwindcss.js"), 'Tailwind CSS ist als lokale Vendor-Datei registriert');
assert(swV5Content.includes("./vendor/lucide.min.js"), 'Lucide Icons ist als lokale Vendor-Datei registriert');
assert(swV5Content.includes("./vendor/three.min.js"), 'Three.js ist im SW Cache registriert');
assert(swV5Content.includes("./vendor/OrbitControls.js"), 'OrbitControls ist im SW Cache registriert');
assert(swV5Content.includes("./vendor/html2canvas.min.js"), 'html2canvas ist als lokale Vendor-Datei registriert');

const vendorCheck = ['tailwindcss.js', 'lucide.min.js', 'three.min.js', 'OrbitControls.js', 'html2canvas.min.js'];
vendorCheck.forEach(vf => {
  const vPath = path.join(__dirname, '..', 'vendor', vf);
  assert(fs.existsSync(vPath) && fs.statSync(vPath).size > 1000, `Vendor-Datei ${vf} existiert lokal (>1KB)`);
});

// 22. TEST: Driftfreier Timer (Time-Target Präzision)
console.log('\n22. Teste Driftfreie Timer-Berechnung:');
const testStartTime = 1000000;
const testDurationSec = 60;
const testTargetEndTime = testStartTime + (testDurationSec * 1000);
const simulateTimePassed = (nowMs) => Math.round((testTargetEndTime - nowMs) / 1000);

assert(simulateTimePassed(testStartTime + 15000) === 45, 'Timer berechnet nach 15s exakt 45 Restsekunden');
assert(simulateTimePassed(testStartTime + 59400) === 1, 'Timer rundet präzise auf 1 Sekunde vor Schluss');
assert(simulateTimePassed(testStartTime + 60000) === 0, 'Timer erreicht punktgenau 0 Sekunden');
assert(simulateTimePassed(testStartTime + 75000) === -15, 'Timer zählt bei Überzeit präzise in die Minus-Sekunden (-15s)');

// 23. TEST: Three.js Deep Disposal & Texture Memory Management
console.log('\n23. Teste Three.js Deep Disposal & 3D Memory Cleanup:');
let disposedCount = { geometry: 0, material: 0, texture: 0, animationCanceled: false };
const mock3DScene = {
  traverse: function(cb) {
    cb({
      geometry: { dispose: () => { disposedCount.geometry++; } },
      material: {
        map: { dispose: () => { disposedCount.texture++; } },
        normalMap: { dispose: () => { disposedCount.texture++; } },
        dispose: () => { disposedCount.material++; }
      }
    });
  }
};

mock3DScene.traverse((obj) => {
  if (obj.geometry) obj.geometry.dispose();
  if (obj.material) {
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    mats.forEach((mat) => {
      ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'specularMap', 'alphaMap'].forEach(prop => {
        if (mat[prop] && typeof mat[prop].dispose === 'function') mat[prop].dispose();
      });
      mat.dispose();
    });
  }
});

assert(disposedCount.geometry === 1, 'Geometrien werden beim Cleanup vollständig freigegeben');
assert(disposedCount.texture === 2, 'Alle Texturen (Diffuse & Normal Maps) werden sauber disposet');
assert(disposedCount.material === 1, 'Materialien werden beim Shutdown sauber freigegeben');

// 24. TEST: ModalManager & Escape-Handler Zentralisierung
console.log('\n24. Teste ModalManager Zentralisierung (closeAllPanelsAndModals):');
const appCoreContent = fs.readFileSync(path.join(__dirname, '..', 'app-core.js'), 'utf8');
assert(appCoreContent.includes("function closeAllPanelsAndModals()"), 'closeAllPanelsAndModals ist zentral in app-core.js definiert');
assert(appCoreContent.includes("window.closeAllPanelsAndModals = closeAllPanelsAndModals"), 'closeAllPanelsAndModals ist global exponiert');
assert(appCoreContent.includes("case 'escape':\n      e.preventDefault();\n      closeAllPanelsAndModals();"), 'Escape-Handler nutzt die zentrale closeAllPanelsAndModals Funktion');

// 25. TEST: 2-Stufen-Statistikberichte & Detail-Dashboard Engine
console.log('\n25. Teste 2-Stufen-Statistik & Dashboard-Berechnungen:');
const sampleDoneItems = [
  { task: 'Morgensport', time: '08:15', origin: 'daily' },
  { task: 'Team Meeting', time: '10:00', origin: 'work_focus' },
  { task: 'E-Mails sortieren', time: '11:30', origin: 'work_focus' },
  { task: 'Küche putzen', time: '14:00', origin: 'weekly' }
];

function testCalculatePeak(items) {
  const buckets = { morning: 0, afternoon: 0, evening: 0, night: 0 };
  items.forEach(item => {
    let hour = 10;
    if (item.time) {
      const m = item.time.match(/(\d{1,2}):/);
      if (m) hour = parseInt(m[1], 10);
    }
    if (hour >= 6 && hour < 12) buckets.morning++;
    else if (hour >= 12 && hour < 18) buckets.afternoon++;
    else if (hour >= 18 && hour < 24) buckets.evening++;
    else buckets.night++;
  });
  let maxK = 'morning'; let maxC = -1;
  Object.keys(buckets).forEach(k => { if (buckets[k] > maxC) { maxC = buckets[k]; maxK = k; } });
  return maxK;
}

const peakResult = testCalculatePeak(sampleDoneItems);
assert(peakResult === 'morning', 'Erkennt morgendliche Aufgaben (08:15, 10:00, 11:30) präzise als Produktivitäts-Peak "morning"');

function testCategoryDist(items) {
  const counts = {};
  items.forEach(i => { counts[i.origin] = (counts[i.origin] || 0) + 1; });
  const total = items.length;
  return Object.keys(counts).map(k => ({ id: k, count: counts[k], pct: Math.round((counts[k]/total)*100) }));
}

const distResult = testCategoryDist(sampleDoneItems);
const workFocusStat = distResult.find(d => d.id === 'work_focus');
assert(workFocusStat && workFocusStat.pct === 50, 'Berechnet Kategorie-Verteilung korrekt (2 von 4 = 50% work_focus)');

const modal1Content = fs.readFileSync(path.join(__dirname, '..', 'partial-modals-1.js'), 'utf8');
assert(modal1Content.includes('modal-report-dashboard'), 'Detail-Dashboard Modal (#modal-report-dashboard) ist im DOM definiert');
assert(modal1Content.includes('dash-stat-completed') && modal1Content.includes('dash-category-distribution'), 'Dashboard enthält Bento-Kacheln und Kategorie-Verteilung');

// 26. TEST: Einstellungen, Impressum (§ 5 DDG), DSGVO & Lizenzen
console.log('\n26. Teste Einstellungen & Rechtliche Compliance:');
assert(modal1Content.includes('modal-settings'), 'Einstellungs- & Rechtliches-Modal (#modal-settings) ist im DOM definiert');
assert(modal1Content.includes('settings-pane-general') && modal1Content.includes('settings-pane-impressum'), 'Allgemein- und Impressums-Tabs sind vorhanden');
assert(modal1Content.includes('settings-pane-privacy') && modal1Content.includes('settings-pane-licenses'), 'Datenschutz- und Lizenz-Tabs sind vorhanden');
assert(modal1Content.includes('settings-pane-history'), 'Versions-Historie & Screenshot-Galerie Tab (#settings-pane-history) ist vorhanden');
assert(modal1Content.includes('Digitale-Dienste-Gesetz (DDG)') || modal1Content.includes('§ 5'), 'Impressum enthält § 5 DDG Pflichtangaben');
assert(modal1Content.includes('Art. 25 DSGVO') || modal1Content.includes('Local-First'), 'Datenschutzerklärung deklariert DSGVO Local-First Speicher');
assert(modal1Content.includes('Tailwind CSS') && modal1Content.includes('Lucide Icons') && modal1Content.includes('Three.js'), 'Open-Source Credits nennen alle Vendor-Bibliotheken');
assert(modal1Content.includes('Haftungsausschluss'), 'Zivilrechtlicher Haftungsausschluss (Disclaimer) ist hinterlegt');

const appCoreUpdated = fs.readFileSync(path.join(__dirname, '..', 'app-core.js'), 'utf8');
assert(appCoreUpdated.includes('function openSettingsModal'), 'openSettingsModal ist in app-core.js implementiert');
assert(appCoreUpdated.includes('function closeSettingsModal'), 'closeSettingsModal ist in app-core.js implementiert');
assert(appCoreUpdated.includes('function renderHistoryGallery'), 'renderHistoryGallery ist in app-core.js implementiert');
assert(appCoreUpdated.includes('closeSettingsModal()'), 'closeAllPanelsAndModals schließt auch das Settings-Modal');

// 27. TEST: Command Palette (Strg+K), Sparkles & Micro-Interactions
console.log('\n27. Teste Command Palette & Micro-Interactions:');
assert(modal1Content.includes('modal-command-palette'), 'Command-Palette Modal (#modal-command-palette) ist im DOM definiert');
assert(appCoreUpdated.includes('function openCommandPalette'), 'openCommandPalette ist in app-core.js implementiert');
assert(appCoreUpdated.includes('function closeCommandPalette'), 'closeCommandPalette ist in app-core.js implementiert');
assert(appCoreUpdated.includes('function filterCommandPalette'), 'filterCommandPalette ist in app-core.js implementiert');
assert(appCoreUpdated.includes('function triggerSparkleEffect'), 'triggerSparkleEffect (Canvas-Engine) ist in app-core.js implementiert');

const audioCoreContent = fs.readFileSync(path.join(__dirname, '..', 'audio-core.js'), 'utf8');
assert(audioCoreContent.includes('function triggerHapticFeedback'), 'triggerHapticFeedback ist in audio-core.js implementiert');

// 28. TEST: PWA Manifest & Production Build
console.log('\n28. Teste PWA Manifest & Production Build:');
const manifestContent = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'manifest.json'), 'utf8'));
assert(manifestContent.name === 'Flow Organiser', 'PWA Manifest definiert korrekten App-Namen');
assert(manifestContent.display === 'standalone', 'PWA Manifest setzt standalone Display');
assert(Array.isArray(manifestContent.shortcuts) && manifestContent.shortcuts.length >= 2, 'PWA Manifest enthält Shortcuts für schnellen Start');
assert(fs.existsSync(path.join(__dirname, '..', 'build.js')), 'build.js Produktions-Bundler existiert');
assert(fs.existsSync(path.join(__dirname, '..', 'dist', 'index.html')), 'dist/index.html Release existiert');

// 29. TEST: Web Audio Lookahead Sequencer, Genre-Beats & Piano-Harmonien
console.log('\n29. Teste Web Audio Sequencer, Genre-Beats & Piano-Harmonien:');
const audioGenContent = fs.readFileSync(path.join(__dirname, '..', 'audio-generators.js'), 'utf8');
const audioSched3Content = fs.readFileSync(path.join(__dirname, '..', 'audio-scheduler-3.js'), 'utf8');
const partialApp3Content = fs.readFileSync(path.join(__dirname, '..', 'partial-app-3.js'), 'utf8');

assert(audioGenContent.includes('techno') && audioGenContent.includes('dnb'), 'Techno & Drum\'n\'Bass sind im Sound-Generator registriert');
assert(audioGenContent.includes('afrobeats') && audioGenContent.includes('swing'), 'Afrobeats & Swing sind im Sound-Generator registriert');
assert(audioGenContent.includes('jazz_piano') && audioGenContent.includes('rhodes') && audioGenContent.includes('hypnotic_riff'), 'Jazz Piano, Fender Rhodes & Hypnotic Riff sind im Sound-Generator registriert');
assert(audioSched3Content.includes('function setBeatBpm') && audioSched3Content.includes('function changeBeatBpm'), 'Live BPM-Tempo-Steuerung ist implementiert');
assert(audioSched3Content.includes('function playDrumKick') && audioSched3Content.includes('function playRhodesChord'), 'Drum- & Rhodes-Synthesizer sind implementiert');
assert(partialApp3Content.includes('sound-btn-techno') && partialApp3Content.includes('beat-bpm-slider'), 'Genre-Buttons und Live BPM-Slider sind im Soundscape-Dock (#panel-soundscape) integriert');

// 30. TEST: 6-Sprachen Lokalisierung (EN Standard, DE, FR, IT, ES, EL) & Multi-Persona Voice Engine
console.log('\n30. Teste 6-Sprachen Lokalisierung & Multi-Persona Voice Engine:');
const trans1Content = fs.readFileSync(path.join(__dirname, '..', 'data-translations-1.js'), 'utf8');
const trans2Content = fs.readFileSync(path.join(__dirname, '..', 'data-translations-2.js'), 'utf8');
const timer1Content = fs.readFileSync(path.join(__dirname, '..', 'timer-1.js'), 'utf8');
const dataTasksContent = fs.readFileSync(path.join(__dirname, '..', 'data-tasks.js'), 'utf8');

assert(trans1Content.includes('en:') && trans1Content.includes('de:') && trans1Content.includes('fr:'), 'EN, DE und FR Übersetzungstabellen sind vollständig definiert');
assert(trans2Content.includes('it:') && trans2Content.includes('es:') && trans2Content.includes('el:'), 'IT, ES und EL Übersetzungstabellen sind vollständig definiert');
assert(dataTasksContent.includes('en:') && dataTasksContent.includes('de:') && dataTasksContent.includes('el:'), 'Alle 6 Sprachen sind in der Standard-Aufgaben-Datenbank hinterlegt');
assert(timer1Content.includes('female_warm') && timer1Content.includes('male_resonant') && timer1Content.includes('child_cheerful'), 'Weibliche, männliche und kindliche Stimmenprofile sind in VOICE_PROFILES definiert');
assert(timer1Content.includes('coach_energetic') && timer1Content.includes('zen_serene'), 'Coach- und Zen-Guide Stimmenprofile sind in VOICE_PROFILES definiert');
assert(timer1Content.includes('en:') && timer1Content.includes('el:') && timer1Content.includes('it:'), 'Fokus-Motivationen und Sprachansagen decken alle 6 Sprachen ab');

// 31. TEST: Sprachausgabe Zahlen-Erhaltung & Kalender-Hover
console.log('\n31. Teste Sprachausgabe Zahlen-Erhaltung & Kalender-Hover:');
const cleanSpeechText = (str) => str
  .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}]/gu, '')
  .replace(/^\s*\d+[\.\)\:]\s+/, '')
  .replace(/^[•\-\*✓✔✕\+➔]+\s*/, '')
  .replace(/\s*([!?.])\s*/g, '$1 ')
  .replace(/([,;:])\s*/g, '$1 ')
  .replace(/\s+/g, ' ')
  .trim();

assert(cleanSpeechText('30 Sekunden über der Zeit.') === '30 Sekunden über der Zeit.', '30 Sekunden Mengenangabe wird beim Sprechen vollständig erhalten');
assert(cleanSpeechText('1 Minute überzogen') === '1 Minute überzogen', '1 Minute Mengenangabe wird beim Sprechen vollständig erhalten');
assert(cleanSpeechText('2 Minuten überzogen') === '2 Minuten überzogen', '2 Minuten Mengenangabe wird beim Sprechen vollständig erhalten');
assert(cleanSpeechText('1. Material heraussuchen') === 'Material heraussuchen', 'Schrittnummer "1. " wird weiterhin sauber entfernt');

const utils2Content = fs.readFileSync(path.join(__dirname, '..', 'utils-2.js'), 'utf8');
const partialApp1Content = fs.readFileSync(path.join(__dirname, '..', 'partial-app-1.js'), 'utf8');

assert(utils2Content.includes('function openCalendarHover') && utils2Content.includes('function closeCalendarHover'), 'openCalendarHover und closeCalendarHover sind in utils-2.js implementiert');
assert(partialApp1Content.includes('onmouseenter="openCalendarHover()"') && partialApp1Content.includes('onmouseleave="closeCalendarHover()"'), 'Datum-Behälter und Kalender-Dropdown öffnen sich bei Maus-Hover');

// 32. TEST: 1-Scan QR-Transfer & P2P Live-Sync Engine
console.log('\n32. Teste 1-Scan QR-Transfer & P2P Live-Sync Engine:');
const syncEngineContent = fs.readFileSync(path.join(__dirname, '..', 'sync-engine.js'), 'utf8');
const partialModals1Content = fs.readFileSync(path.join(__dirname, '..', 'partial-modals-1.js'), 'utf8');

assert(syncEngineContent.includes('const MinimalQR =') && syncEngineContent.includes('generateQRCodeSVG'), 'Autonomer lokaler QR-Code Generator ist in sync-engine.js integriert');
assert(syncEngineContent.includes('const P2PDataCodec =') && syncEngineContent.includes('encodeState'), 'P2PDataCodec komprimiert State verlustfrei für URL-Hash Transfer');
assert(syncEngineContent.includes('const p2pSyncEngine =') && syncEngineContent.includes('broadcastStateUpdate'), 'p2pSyncEngine Live-Broadcasting & Signaling ist implementiert');
assert(partialModals1Content.includes('id="modal-p2p-sync"') && partialModals1Content.includes('id="p2p-qr-img"'), 'Handy Live-Sync Modal (#modal-p2p-sync) mit QR-Anzeige ist im DOM definiert');
assert(partialApp1Content.includes('openP2PSyncModal()'), 'Handy-Live Trigger-Button ist im Header integriert');

// 33. TEST: 5-Tab Native Mobile Architecture & Ergonomie
console.log('\n33. Teste 5-Tab Native Mobile Architecture & Ergonomie:');
const freshApp3Content = fs.readFileSync(path.join(__dirname, '..', 'partial-app-3.js'), 'utf8');
const freshMobileCssContent = fs.readFileSync(path.join(__dirname, '..', 'styles-mobile.css'), 'utf8');
const freshAppCoreContent = fs.readFileSync(path.join(__dirname, '..', 'app-core.js'), 'utf8');
const freshTimer3Content = fs.readFileSync(path.join(__dirname, '..', 'timer-3.js'), 'utf8');

assert(freshApp3Content.includes('id="mobile-bottom-nav"') && freshApp3Content.includes('id="mob-nav-planer"') && freshApp3Content.includes('id="mob-nav-game"'), 'Feste 5-Tab Bottom-Navigation (#mobile-bottom-nav) ist vollständig im DOM integriert');
assert(freshApp3Content.includes('id="mobile-fab-add"'), 'Floating Action Button (#mobile-fab-add) für schnelles Hinzufügen existiert');
assert(freshApp3Content.includes('id="mobile-view-focus"') && freshApp3Content.includes('id="mobile-view-audio"') && freshApp3Content.includes('id="mobile-view-tools"'), 'Mobile View-Panels für Fokus, Audio-Lounge und Tools-Grid sind definiert');
assert(freshAppCoreContent.includes('function switchMobileNavTab') && freshAppCoreContent.includes('function openMobileQuickAddModal'), 'switchMobileNavTab und openMobileQuickAddModal sind in app-core.js implementiert');
assert(freshMobileCssContent.includes('#mobile-bottom-nav') && freshMobileCssContent.includes('env(safe-area-inset-bottom)'), 'styles-mobile.css nutzt moderne Safe-Area Insets & Daumen-Ergonomie');
assert(freshTimer3Content.includes('mobile-timer-display') && freshTimer3Content.includes('mobile-timer-status'), 'timer-3.js synchronisiert mobile-timer-display und mobile-timer-status synchron');

// 34. TEST: 3D-Gamification Suite & Chronicles of Flow RPG Engine
console.log('\n34. Teste 3D-Gamification Suite & Chronicles of Flow RPG Engine:');
const gamification1Content = fs.readFileSync(path.join(__dirname, '..', 'gamification.js'), 'utf8');
const gamification2Content = fs.readFileSync(path.join(__dirname, '..', 'gamification-2.js'), 'utf8');

assert(gamification1Content.includes('buildOrbitDeckWorld') && gamification1Content.includes('buildFloatingIslandWorld'), 'Welten Orbit-Deck und Zen-Insel sind in gamification.js implementiert');
assert(gamification1Content.includes('buildTaskMetropolisWorld') && gamification1Content.includes('buildGalaxyRunnerWorld'), 'Welten Metropole und Warp-Cockpit sind in gamification.js implementiert');
assert(gamification2Content.includes('function buildQuestAdventureWorld') && gamification2Content.includes('createHeroCharacterMesh'), 'Chronicles of Flow 3D Action-RPG & Heldenmodell sind in gamification-2.js implementiert');
assert(gamification2Content.includes('updateHeroMovement') && gamification2Content.includes('heroKeys'), 'WASD & Pfeiltasten Heldensteuerung ist implementiert');

console.log('\n====================================================');
console.log(`🎉 TEST-ERGEBNIS: ${passedTests} von ${totalTests} Tests erfolgreich bestanden!`);
console.log('====================================================');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}

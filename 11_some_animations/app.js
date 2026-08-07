// Dynamische Injektion lokalisierter Übersetzungen für die neuen Bezeichnungen
if (typeof window.TRANSLATIONS === 'undefined') {
  window.TRANSLATIONS = {};
}

const customTranslations = {
  de: {
    minimal_mode: "Focus Mode",
    standard_mode: "Standard Mode",
    next_rec: "Empfehlung - jetzt",
    complete_btn: "Erledigt",
    feedback_greet: "Hey, ich bin Jannis! 👋",
    feedback_alt: "oder sende mir eine E-Mail an jmonke@gmail.com"
  },
  en: {
    minimal_mode: "Focus Mode",
    standard_mode: "Standard Mode",
    next_rec: "Recommendation - now",
    complete_btn: "Done",
    feedback_greet: "Hey, I'm Jannis! 👋",
    feedback_alt: "or send me an email at jmonke@gmail.com"
  },
  es: {
    minimal_mode: "Modo Foco",
    standard_mode: "Modo Estándar",
    next_rec: "Recomendación - ahora",
    complete_btn: "Completado",
    feedback_greet: "¡Hola, soy Jannis! 👋",
    feedback_alt: "o envíame un email a jmonke@gmail.com"
  },
  el: {
    minimal_mode: "Λειτουργία Εστίασης",
    standard_mode: "Τυπική Λειτουργία",
    next_rec: "Πρόταση - τώρα",
    complete_btn: "Ολοκληρώθηκε",
    feedback_greet: "Γεια σας, είμαι ο Γιάννης! 👋",
    feedback_alt: "ή στείλτε μου ένα email στο jmonke@gmail.com"
  }
};

for (const lang in customTranslations) {
  if (!window.TRANSLATIONS[lang]) window.TRANSLATIONS[lang] = {};
  Object.assign(window.TRANSLATIONS[lang], customTranslations[lang]);
}

let currentZenTaskInfo = null;
let lastSelectedSound = 'rain'; // Standardmäßiger Fokus-Sound

// Zusätzliche globale Variable für die Spalten-Verschiebefunktion
let draggedColumnId = null;

// Pool aus zehn harmonischen Farbpaaren für die abwechselnde Erledigungs-Affordanz
const HOVER_COLOR_PAIRS = [
  { hoverIcon: 'group-hover/task:text-emerald-400', text: 'group-hover/task:text-emerald-300' },
  { hoverIcon: 'group-hover/task:text-cyan-400', text: 'group-hover/task:text-cyan-300' },
  { hoverIcon: 'group-hover/task:text-amber-400', text: 'group-hover/task:text-amber-300' },
  { hoverIcon: 'group-hover/task:text-rose-400', text: 'group-hover/task:text-rose-300' },
  { hoverIcon: 'group-hover/task:text-purple-400', text: 'group-hover/task:text-purple-300' },
  { hoverIcon: 'group-hover/task:text-blue-400', text: 'group-hover/task:text-blue-300' },
  { hoverIcon: 'group-hover/task:text-pink-400', text: 'group-hover/task:text-pink-300' },
  { hoverIcon: 'group-hover/task:text-teal-400', text: 'group-hover/task:text-teal-300' },
  { hoverIcon: 'group-hover/task:text-orange-400', text: 'group-hover/task:text-orange-300' },
  { hoverIcon: 'group-hover/task:text-sky-400', text: 'group-hover/task:text-sky-300' }
];

// =========================================================================
// NEU: INTERNE LISTE MIT 41 NEURODIVERSITÄTSFREUNDLICHEN IMPULSEN
// =========================================================================
const INSPIRATION_SAYINGS = {
  de: [
    "Du musst eine Aufgabe nicht perfekt machen. Sie unvollständig zu erledigen, ist unendlich viel besser, als sie gar nicht zu tun.",
    "Wenn dir der Anfang schwerfällt, nimm dir vor, nur eine einzige Minute daran zu arbeiten. Danach darfst du jederzeit aufhören.",
    "Dein Gehirn ist ein Prozessor, kein Datenspeicher. Schreib den Gedanken auf, um wertvollen Arbeitsspeicher im Kopf freizugeben.",
    "Es ist völlig in Ordnung, Kopfhörer aufzusetzen, das Licht zu dimmen oder die Umgebung zu wechseln, wenn dir alles zu laut wird.",
    "Manchmal ist eine Pause kein Luxus, sondern eine notwendige Wartung deines Systems. Gönne dir diesen Moment ohne schlechtes Gewissen.",
    "Wenn du feststeckst, ändere deine physische Haltung. Steh kurz auf, strecke dich oder schau für 20 Sekunden aus dem Fenster.",
    "Dein Energielevel ist keine flache Linie. Es ist völlig normal, dass manche Tage leichter fallen als andere. Passe dein Tempo an.",
    "Du musst nicht den ganzen Berg auf einmal erklimmen. Konzentriere dich nur auf die nächsten fünf Minuten. Der Rest kommt später.",
    "Ein unordentlicher Schreibtisch oder Raum ist kein Zeichen von Schwäche, sondern ein Zeichen dafür, dass dein Fokus gerade woanders war.",
    "Übergänge zwischen verschiedenen Tätigkeiten können mental anstrengend sein. Gib dir selbst zwei Minuten Pufferzeit dazwischen.",
    "Es gibt keine 'richtige' Art, Dinge zu tun. Wenn es für dich funktioniert, im Stehen zu arbeiten oder Aufgaben aufzuteilen, dann ist das dein Weg.",
    "Wenn eine Aufgabe riesig wirkt, brich sie in unverschämt kleine Schritte herunter. So klein, dass es fast lächerlich wirkt.",
    "Verwechsle Erschöpfung oder Überreizung nicht mit mangelnder Disziplin. Dein Körper signalisiert dir einfach, was er gerade braucht.",
    "Du bist nicht faul. Manchmal blockiert dich einfach die schiere Menge an Optionen. Wähle eine beliebige Sache aus – egal welche.",
    "Lass dich nicht von dem Gefühl täuschen, alles gleichzeitig tun zu müssen. Multitasking ist eine Illusion. Atme durch. Nur diese eine Sache.",
    "Es ist okay, unvollendete Projekte zu haben. Jedes davon hat dir in dem Moment, als du es tatest, Freude oder Erkenntnis gebracht.",
    "Achte auf deine Sinne. Brauchst du gerade ein Glas Wasser, frische Luft, eine Gewichtsdecke oder einfach nur absolute Stille?",
    "Wenn dich eine Entscheidung blockiert, wirf eine Münze. Nicht, um ihr zu folgen, sondern um zu spüren, auf welches Ergebnis du hoffst.",
    "Fehler sind einfach nur Datenpunkte. Sie zeigen dir, was nicht funktioniert, und helfen dir, deinen eigenen Weg feinzujustieren.",
    "Deine Produktivität bestimmt nicht deinen Wert als Mensch. Du darfst einfach nur existieren und atmen.",
    "Mach den ersten Schritt so winzig, dass die Hürde verschwindet. Öffne nur das Dokument. Stell nur den Teller in die Spüle.",
    "Es ist okay, visuelle Erinnerungen zu nutzen. Wenn du etwas sehen musst, um dich daran zu erinnern, platziere es bewusst in deinem Sichtfeld.",
    "Zwing dich nicht in Strukturen, die für andere gemacht wurden. Erschaffe Werkzeuge, die zu der Art passen, wie dein Gehirn arbeitet.",
    "Manchmal hilft es, einer Aufgabe spielerische Regeln zu geben. Mach ein kurzes Spiel daraus oder setze dir ein Zeitlimit.",
    "Wenn dein Kopf rast, nimm dir ein Blatt Papier und schreibe alles ungefiltert auf. Niemand außer dir muss diesen Zettel jemals lesen.",
    "Es ist völlig verständlich, wenn Routineaufgaben dich langweilen. Versuche, sie mit einem angenehmen Reiz wie Musik oder einem Hörbuch zu verbinden.",
    "Erlaube dir, unvollkommen zu starten. Der erste Entwurf darf chaotisch sein. Korrigieren ist leichter als neu erschaffen.",
    "Wenn du dich überwältigt fühlst, schließe für eine Minute die Augen und konzentriere dich nur auf das Gefühl deiner Füße auf dem Boden.",
    "Dein Fokus ist wie ein Muskel. Er ermüdet. Wenn er nachlässt, ist das ein biologisches Signal für eine kurze Regeneration.",
    "Lass dich nicht von Perfektionismus lähmen. Ein erledigtes, aber unperfektes Projekt bringt dich weiter als ein perfektes, das nur im Kopf existiert.",
    "Es ist absolut legitim, Aufgaben aufschieben, wenn deine mentale Batterie leer ist. Lade sie zuerst auf, anstatt dich im Kreis zu drehen.",
    "Suche dir Verbündete oder arbeite in der sanften Gegenwart anderer (Body Doubling). Allein im selben Raum zu sein, kann Wunder wirken.",
    "Nimm den Druck heraus. Du musst nicht beweisen, dass du alles allein schaffst. Hilfe anzunehmen oder Tools zu nutzen ist klug.",
    "Manchmal ist das schwerste Stück Arbeit das Loslassen der Schuldgefühle über das, was du heute nicht geschafft hast. Lass es gehen.",
    "Feiere die unsichtbaren Siege. Eine unangenehme E-Mail zu schreiben oder trotz Blockade anzufangen, ist eine riesige Leistung.",
    "Wenn dir der rote Faden verloren geht, mach eine kurze Pause und kehre zu deiner Tagespriorität zurück. Es ist kein Drama, abzuschweifen.",
    "Dein Gehirn liebt Neuartigkeit. Wenn eine alte Methode nicht mehr funktioniert, ist das kein Versagen – probiere einfach ein neues Format aus.",
    "Mach dir bewusst, wie viel Kraft es kostet, in einer reizüberfluteten Welt zu navigieren. Sei stolz auf deinen Weg.",
    "Es gibt keine Pflicht, jede begonnene Sache zu Ende zu bringen. Manche Wege dienen nur dazu, uns eine kleine Lektion zu erteilen.",
    "Atme tief ein. Atme langsam aus. Du bist genau hier, im jetzigen Moment, und das ist absolut ausreichend.",
    "Gib dir selbst die Erlaubnis, Dinge auf deine eigene, unkonventionelle Weise zu tun. Wenn es funktioniert, ist es richtig."
  ],
  en: [
    "You don't have to do a task perfectly. Doing it incompletely is infinitely better than not doing it at all.",
    "If starting feels hard, plan to work on it for just one minute. You can stop at any time after that.",
    "Your brain is a processor, not a storage device. Write thoughts down to free up valuable RAM in your head.",
    "It's completely fine to put on headphones, dim the lights, or change environments if everything gets too loud.",
    "Sometimes a break isn't a luxury, but a necessary maintenance of your system. Enjoy this moment guilt-free.",
    "If you're stuck, change your physical posture. Stand up, stretch, or look out the window for 20 seconds.",
    "Your energy level is not a flat line. It's normal that some days are easier than others. Adjust your pace.",
    "You don't have to climb the whole mountain at once. Just focus on the next five minutes. The rest will follow.",
    "A messy desk or room is not a sign of weakness, but a sign that your focus was simply elsewhere.",
    "Transitions between different activities can be mentally exhausting. Give yourself two minutes of buffer time in between.",
    "There is no 'correct' way to do things. If working while standing or breaking tasks down works for you, that's your way.",
    "If a task feels huge, break it down into ridiculously small steps. So small it almost feels silly.",
    "Don't confuse exhaustion or overstimulation with a lack of discipline. Your body is just signaling what it needs.",
    "You are not lazy. Sometimes the sheer volume of choices paralyzes you. Just choose one random thing—anything.",
    "Don't fall for the illusion of having to do everything at once. Multitasking is a myth. Breathe. Just this one thing.",
    "It's okay to have unfinished projects. Each of them brought you joy or insight at the moment you were doing it.",
    "Pay attention to your senses. Do you need a glass of water, fresh air, a weighted blanket, or just pure silence?",
    "If a decision blocks you, flip a coin. Not to follow it, but to feel which outcome you are secretly hoping for.",
    "Mistakes are simply data points. They show you what doesn't work and help you fine-tune your own path.",
    "Your productivity does not define your worth as a human being. You are allowed to just exist and breathe.",
    "Make the first step so tiny that the friction disappears. Just open the document. Just place one dish in the sink.",
    "It's okay to use visual cues. If you need to see something to remember it, consciously place it in your field of vision.",
    "Don't force yourself into structures built for others. Create tools that fit the way your brain naturally works.",
    "Sometimes it helps to give a task playful rules. Make a quick game out of it or set a fun time limit.",
    "If your head is racing, grab a sheet of paper and write everything down unfiltered. No one else ever has to read it.",
    "It's completely natural to find routine tasks boring. Try pairing them with a pleasant stimulus like music or a podcast.",
    "Allow yourself to start imperfectly. The first draft is allowed to be messy. Editing is much easier than creating.",
    "If you feel overwhelmed, close your eyes for one minute and focus entirely on the feeling of your feet on the floor.",
    "Your focus is like a muscle. It gets tired. When it fades, that's a biological signal for a brief recovery.",
    "Don't let perfectionism paralyze you. A completed but imperfect project gets you further than a perfect one in your head.",
    "It is absolutely legitimate to postpone tasks when your mental battery is empty. Recharge first instead of spinning.",
    "Find allies or work in the gentle presence of others (body doubling). Just being in the same room can work wonders.",
    "Take the pressure off. You don't have to prove you can do everything alone. Accepting help or using tools is smart.",
    "Sometimes the hardest piece of work is letting go of the guilt over what you didn't accomplish today. Let it go.",
    "Celebrate the invisible victories. Writing an uncomfortable email or starting despite a blockade is a huge feat.",
    "If you lose your train of thought, take a quick break and return to your daily priority. Getting sidetracked is okay.",
    "Your brain loves novelty. If an old method stops working, it's not a failure—just try a new format or medium.",
    "Be aware of how much energy it takes to navigate a highly stimulating world. Be proud of your journey.",
    "There is no obligation to finish everything you start. Some paths only exist to teach us a small lesson.",
    "Inhale deeply. Exhale slowly. You are right here, in the present moment, and that is absolutely enough.",
    "Give yourself permission to do things in your own unconventional way. If it works, it's right."
  ]
};

function suggestInspirationQuote() {
  const list = INSPIRATION_SAYINGS[currentLang] || INSPIRATION_SAYINGS['de'] || INSPIRATION_SAYINGS['en'];
  const randomQuote = list[Math.floor(Math.random() * list.length)];
  const box = document.getElementById('inspiration-quote-box');
  if (box) {
    box.innerText = randomQuote;
  }
}

function suggestBoostActivity() {
  const list = BOOST_ACTIVITIES[currentLang] || BOOST_ACTIVITIES['en'];
  const randomActivity = list[Math.floor(Math.random() * list.length)];
  const box = document.getElementById('boost-activity-box');
  if (box) {
    box.innerText = randomActivity;
  }
}

// Direkte Klicks auf Sounds & Musik
function handleSoundsMainClick() {
  if (currentSoundType) {
    stopAmbientSound(); 
  } else {
    playAmbientSound(lastSelectedSound); 
  }
}

function handleMusicMainClick() {
  if (playlistTracks.length === 0) {
    document.getElementById('sound-file-input').click();
  } else {
    togglePlaylistPlayback(); 
  }
}

// Globaler Modal-Schließer für einfache Aufrufe
function closeHelperModal() {
  const m1 = document.getElementById('helper-pick-modal');
  const m2 = document.getElementById('helper-steps-modal');
  if (m1) m1.classList.add('hidden');
  if (m2) m2.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  setTheme(currentTheme);
  setLanguage(currentLang);
  
  const iconEl = document.getElementById('zen-btn-icon');
  const textEl = document.getElementById('minimal-mode-btn-text');
  
  if (isMinimalist) {
    document.body.classList.add('minimalist');
    if (iconEl) iconEl.setAttribute('data-lucide', 'eye-off');
    if (textEl) textEl.innerText = t('standard_mode');
  } else {
    if (iconEl) iconEl.setAttribute('data-lucide', 'eye');
    if (textEl) textEl.innerText = t('minimal_mode');
  }
  
  updateDateAndStreak();
  renderApp();
  updateZenView();
  populateHelperTaskSelect();
  suggestBoostActivity(); // Pre-populate den Energizer
  suggestInspirationQuote(); // Pre-populate die Inspiration
  
  // Automatische Perioden-Berichte prüfen und herunterladen
  checkAndGenerateAutomaticReports();

  const btnHeader = document.getElementById('timer-toggle-btn');
  if (btnHeader) {
    btnHeader.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>';
  }
  
  // GEÄNDERT: Globaler Button-Tanzparty Loop wird beim Laden gestartet
  startGlobalButtonDanceParty();

  if (typeof lucide !== 'undefined') lucide.createIcons();
});

// OPTIMIERT: Entfernt Tailwind bg-Klassen, damit styles.css das Hintergrundrendering ungestört übernimmt
function setTheme(theme) {
  currentTheme = theme;
  document.body.className = `h-full antialiased flex flex-col font-sans select-none overflow-x-hidden text-[#f4f4f5] theme-${theme}`;
  if (isMinimalist) document.body.classList.add('minimalist');
  localStorage.setItem('flowPlannerTheme', theme);
}

function setLanguage(lang) {
  if (!lang || !TRANSLATIONS[lang] || !DEFAULT_TASKS_BY_LANG[lang]) {
    lang = 'en';
  }
  const oldLang = currentLang;
  currentLang = lang;
  localStorage.setItem('flowPlannerLanguage', lang);
  
  document.documentElement.lang = lang;
  
  translateUserTasks(oldLang, lang);
  const flagMap = { de: '🇩🇪', en: '🇬🇧', es: '🇪🇸', el: '🇬🇷' };
  const flagEl = document.getElementById('active-lang-flag');
  if (flagEl) flagEl.innerText = flagMap[lang] || '🇬🇧';
  translateUI();
  
  // Focus-Mode-Buttonübersetzung aktualisieren
  const textEl = document.getElementById('minimal-mode-btn-text');
  if (textEl) {
    textEl.innerText = isMinimalist ? t('standard_mode') : t('minimal_mode');
  }
  
  updateDateAndStreak();
  renderApp();
  updateZenView();
  populateHelperTaskSelect();
}

function translateUI() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (TRANSLATIONS[currentLang]?.[key]) el.innerText = TRANSLATIONS[currentLang][key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (TRANSLATIONS[currentLang]?.[key]) el.setAttribute('placeholder', TRANSLATIONS[currentLang][key]);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (TRANSLATIONS[currentLang]?.[key]) el.setAttribute('title', TRANSLATIONS[currentLang][key]);
  });
}

function translateUserTasks(fromLang, toLang) {
  if (fromLang === toLang) return;
  if (!DEFAULT_TASKS_BY_LANG[fromLang] || !DEFAULT_TASKS_BY_LANG[toLang]) return;
  
  saveHistory();
  const cats = ['daily', 'weekly', 'occasionally'];
  cats.forEach(cat => {
    if (!state.items[cat]) return;
    state.items[cat] = state.items[cat].map(taskItem => {
      const taskName = typeof taskItem === 'object' ? taskItem.task : taskItem;
      const fromList = DEFAULT_TASKS_BY_LANG[fromLang][cat];
      const oList = DEFAULT_TASKS_BY_LANG[toLang][cat];
      const idx = fromList.indexOf(taskName);
      if (idx !== -1) {
        const nextVal = oList[idx];
        return typeof taskItem === 'object' ? { ...taskItem, task: nextVal } : nextVal;
      }
      return taskItem;
    });
  });
  if (state.completedSteps) {
    const nextStepsObj = {};
    for (let key in state.completedSteps) {
      let updatedKey = key;
      cats.forEach(cat => {
        const fromList = DEFAULT_TASKS_BY_LANG[fromLang][cat];
        const oList = DEFAULT_TASKS_BY_LANG[toLang][cat];
        const idx = fromList.indexOf(key);
        if (idx !== -1) updatedKey = oList[idx];
      });
      nextStepsObj[updatedKey] = state.completedSteps[key];
    }
    state.completedSteps = nextStepsObj;
  }
  saveState();
}

function toggleMinimalist() {
  isMinimalist = !isMinimalist;
  localStorage.setItem('flowPlannerMinimalist', String(isMinimalist));
  
  const iconEl = document.getElementById('zen-btn-icon');
  const textEl = document.getElementById('minimal-mode-btn-text');
  
  if (isMinimalist) {
    document.body.classList.add('minimalist');
    if (iconEl) iconEl.setAttribute('data-lucide', 'eye-off');
    if (textEl) textEl.innerText = t('standard_mode');
    updateZenView();
  } else {
    document.body.classList.remove('minimalist');
    if (iconEl) iconEl.setAttribute('data-lucide', 'eye');
    if (textEl) textEl.innerText = t('minimal_mode');
  }
  
  if (typeof lucide !== 'undefined') lucide.createIcons();
  showToast(isMinimalist ? t('minimal_mode') + " aktiv" : t('standard_mode') + " aktiv");
}

function toggleTerminForm(open) {
  isTerminFormOpen = open !== undefined ? open : !isTerminFormOpen;
  renderApp();
  if (isTerminFormOpen) {
    setTimeout(() => {
      const inputTitle = document.getElementById('add-termin-title');
      if (inputTitle) inputTitle.focus();
    }, 50);
  }
}

function handleAddTermin() {
  const titleEl = document.getElementById('add-termin-title');
  const locEl = document.getElementById('add-termin-location');
  const dateEl = document.getElementById('add-termin-date');
  const timeEl = document.getElementById('add-termin-time');
  
  const title = titleEl ? titleEl.value.trim() : '';
  const location = locEl ? locEl.value.trim() : '';
  const date = dateEl ? dateEl.value : '';
  const time = timeEl ? timeEl.value : '';
  
  if (!title) {
    showToast(t('toast_appointment_name_error'));
    return;
  }
  saveHistory();
  if (!state.items.termine) state.items.termine = [];
  
  // Ort ("location") wird im Terminstatus gesichert
  state.items.termine.push({ task: title, date, time, location });
  isTerminFormOpen = false;
  saveState();
  renderApp();
  populateHelperTaskSelect();
  showToast(t('toast_appointment_saved'));
}

// Hilfsfunktion: Gibt ein Objekt mit dem passenden Symbol und der thematischen Textfarbe zurück
function getTaskIconDetails(taskText, category = '') {
  if (!taskText) return { icon: 'check-circle', color: 'text-purple-400' };
  
  if (typeof TASK_ICONS !== 'undefined' && TASK_ICONS[taskText]) {
    return { icon: TASK_ICONS[taskText], color: 'text-purple-300' };
  }
  
  const text = String(taskText).toLowerCase();
  
  // 1. Gesundheit, Pflege, Selbstfürsorge
  if (/medi|pill|medicin|tableta|vitam|pharmak|arzt|doctor|therap/.test(text)) {
    return { icon: 'pill', color: 'text-rose-400' };
  }
  if (/zahn|dient|tooth|dent|toothb|dond|brush/.test(text)) {
    return { icon: 'smile', color: 'text-cyan-400' };
  }
  if (/dusch|bath|shower|duch|ban|ntous|waschen|wash|hyg|gesicht/.test(text)) {
    return { icon: 'shower-head', color: 'text-sky-400' };
  }
  if (/haare|hair|pelo|kour|fris/.test(text)) {
    return { icon: 'scissors', color: 'text-pink-400' };
  }
  if (/nagel|nail|uñ|nych/.test(text)) {
    return { icon: 'sparkles', color: 'text-indigo-400' };
  }
  if (/trink|wat|agu|ner|glass|hydration/.test(text)) {
    return { icon: 'glass-water', color: 'text-blue-400' };
  }
  
  // 2. Haushalt, Reinigung, Organisation
  if (/bett|bed|cama|krevat/.test(text)) {
    return { icon: 'bed', color: 'text-amber-400' };
  }
  if (/aufräum|tidy|orden|takto|clean|putz|organi/.test(text)) {
    return { icon: 'package', color: 'text-yellow-500' };
  }
  if (/staub|dust|polv|xesk|fegen|sweep/.test(text)) {
    return { icon: 'feather', color: 'text-amber-300' };
  }
  if (/saugen|vacu|aspir|skoupi/.test(text)) {
    return { icon: 'tornado', color: 'text-cyan-500' };
  }
  if (/wisch|mop|freg|sfoug|droplets/.test(text)) {
    return { icon: 'droplets', color: 'text-sky-500' };
  }
  if (/spül|dish|plat|piat/.test(text)) {
    return { icon: 'utensils', color: 'text-emerald-400' };
  }
  if (/wasch|laund|colad|roux|clothes|wäsche/.test(text)) {
    return { icon: 'washing-machine', color: 'text-indigo-400' };
  }
  if (/aufhäng|hang|colg|aplon/.test(text)) {
    return { icon: 'shirt', color: 'text-violet-400' };
  }
  if (/klo|wc|toil|vater|lekan/.test(text)) {
    return { icon: 'toilet', color: 'text-teal-500' };
  }
  if (/müll|trash|basur|skoupid|waste/.test(text)) {
    return { icon: 'trash-2', color: 'text-rose-500' };
  }
  if (/pfand|bottle|envase|boukal|recycle/.test(text)) {
    return { icon: 'recycle', color: 'text-emerald-500' };
  }
  
  // 3. Ernährung, Kochen
  if (/koch|food|cook|comid|cena|recept|magir|essen|lunch|dinner|breakfast|mahlzeit/.test(text)) {
    return { icon: 'cooking-pot', color: 'text-orange-400' };
  }
  
  // 4. Einkaufen, Besorgungen
  if (/einkauf|shop|compr|agor|supermarkt|store|kauf/.test(text)) {
    return { icon: 'shopping-cart', color: 'text-emerald-400' };
  }
  
  // 5. Arbeit, Studium, Produktivität
  if (/arbeit|work|trabaj|doul|job|office|schreiben|mail|call|anruf/.test(text)) {
    return { icon: 'briefcase', color: 'text-amber-500' };
  }
  if (/les|book|libr|vivl|lernen|study/.test(text)) {
    return { icon: 'book-open', color: 'text-violet-400' };
  }
  
  // 6. Fitness, Freizeit, Entspannung
  if (/sport|gym|fit|train|gymn|workout|run|laufen|gehen|walk/.test(text)) {
    return { icon: 'activity', color: 'text-green-400' };
  }
  if (/paus|rest|desc|paus|relax|chill|medit|mindful/.test(text)) {
    return { icon: 'moon', color: 'text-indigo-300' };
  }
  if (/luft|wind|vent|aer|lüften|breath/.test(text)) {
    return { icon: 'wind', color: 'text-cyan-300' };
  }
  
  // Rückfallwert basierend auf Spalten-Kategorie
  const defaults = {
    daily: { icon: 'sun', color: 'text-amber-400' },
    weekly: { icon: 'calendar-days', color: 'text-purple-400' },
    todo: { icon: 'list-todo', color: 'text-blue-400' },
    done: { icon: 'check-circle', color: 'text-emerald-400' },
    termine: { icon: 'clock', color: 'text-amber-400' },
    occasionally: { icon: 'calendar-range', color: 'text-pink-400' },
    notes: { icon: 'sticky-note', color: 'text-yellow-400' }
  };
  
  const d = defaults[category] || { icon: 'check-circle', color: 'text-purple-400' };
  return { icon: d.icon, color: d.color };
}

// Abwärtskompatibler Wrapper zur Rückgabe des reinen Icon-Namens
function getTaskIcon(taskText, category = '') {
  return getTaskIconDetails(taskText, category).icon;
}

function renderApp() {
  const main = document.querySelector('main');
  if (!main) return;
  main.innerHTML = '';
  const todayISO = new Date().toISOString().split('T')[0];
  
  categoriesOrder.forEach(([id, iconKey]) => {
    const isDone = id === 'done';
    const isNotes = id === 'notes';
    const isTermine = id === 'termine';
    const activeCount = (state.items[id] || []).length;
    const doneInCat = state.done.filter(t => t.origin === id).length;
    const totalInCat = doneInCat + activeCount;
    let titleText = t(id);
    if (isDone) titleText += ` (${state.done.length})`;
    else if (!isNotes) titleText += ` (${doneInCat}/${totalInCat})`;
    const pct = (!isDone && !isNotes && totalInCat > 0) ? Math.round((doneInCat / totalInCat) * 100) : 0;
    
    const article = document.createElement('article');
    article.className = 'min-h-[380px] h-full flex flex-col p-3 rounded-2xl border border-white/[0.08] bg-[#13131a]/75 backdrop-blur-md shadow-lg hover:border-[var(--accent)]/30 transition duration-300 cursor-default';
    
    article.draggable = true;
    article.ondragstart = (e) => {
      if (draggedItemInfo) {
        return;
      }
      e.dataTransfer.setData('text/column', id);
      e.dataTransfer.effectAllowed = 'move';
      draggedColumnId = id;
      article.classList.add('opacity-40');
    };
    article.ondragend = () => {
      article.classList.remove('opacity-40');
      draggedColumnId = null;
    };
    article.ondragover = (e) => {
      e.preventDefault();
      if (draggedColumnId) {
        e.dataTransfer.dropEffect = 'move';
        article.classList.add('border-dashed', 'border-[var(--accent)]');
      }
    };
    article.ondragleave = () => {
      article.classList.remove('border-dashed', 'border-[var(--accent)]');
    };
    article.ondrop = (e) => {
      e.preventDefault();
      article.classList.remove('border-dashed', 'border-[var(--accent)]');
      if (draggedColumnId) {
        const srcId = draggedColumnId;
        const targetId = id;
        if (srcId !== targetId) {
          const srcIdx = categoriesOrder.findIndex(([catId]) => catId === srcId);
          const targetIdx = categoriesOrder.findIndex(([catId]) => catId === targetId);
          if (srcIdx !== -1 && targetIdx !== -1) {
            saveHistory();
            const [removed] = categoriesOrder.splice(srcIdx, 1);
            categoriesOrder.splice(targetIdx, 0, removed);
            saveCategoriesOrder();
            renderApp();
            showToast(currentLang === 'de' ? 'Spalten-Reihenfolge aktualisiert ↕️' : 'Column order updated ↕️');
          }
        }
        draggedColumnId = null;
      } else {
        handleDrop(e, id);
      }
    };
    
    article.innerHTML = `
      <h2 class="flex justify-center items-center gap-2 mb-2.5 text-gray-400 font-bold font-display text-[10px] tracking-wider uppercase cursor-grab active:cursor-grabbing select-none" title="Spalte durch Ziehen neu anordnen">
        <i data-lucide="${iconKey}" class="w-4 h-4 pointer-events-none"></i>
        <span class="pointer-events-none">${titleText}</span>
      </h2>
      ${!isDone && !isNotes ? `
        <div class="w-full h-1 bg-white/[0.05] rounded-full mb-3.5 overflow-hidden pointer-events-none">
          <div class="h-full bg-gradient-to-r from-[var(--accent)] to-emerald-400 transition-all duration-500" style="width: ${pct}%"></div>
        </div>
      ` : ''}
      <div id="list-${id}" class="flex flex-col gap-2.5 flex-1 min-h-[120px] overflow-y-auto py-0.5 px-0.5"></div>
    `;
    
    const listEl = article.querySelector(`#list-${id}`);
    if (isDone) {
      state.done.slice().reverse().forEach((item, idx) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'group p-2 text-[11px] text-gray-400 hover:text-white border border-dashed border-slate-700 hover:border-purple-500 rounded-lg bg-slate-800/25 hover:bg-purple-900/20 cursor-pointer font-medium transition flex items-center justify-between gap-1';
        itemDiv.onclick = () => handleRestoreDoneTask(idx);
        itemDiv.title = "Klicke hier, um diese erledigte Aufgabe zurück in den Plan zu verschieben";
        itemDiv.innerHTML = `<span class="truncate">${item.task} · ${item.time}</span><i data-lucide="undo" class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-purple-400 shrink-0"></i>`;
        listEl.appendChild(itemDiv);
      });
    } else if (isNotes) {
      const textarea = document.createElement('textarea');
      textarea.className = 'w-full h-full min-h-[220px] flex-1 p-3 bg-black/40 border border-dashed border-white/10 rounded-xl text-gray-200 text-xs leading-relaxed outline-none resize-none focus:border-[var(--accent)] transition';
      textarea.placeholder = t('notesPlaceholder');
      textarea.value = state.items.notes || '';
      textarea.title = "Notizen und Gedanken unstrukturiert festhalten";
      textarea.oninput = (e) => { state.items.notes = e.target.value; saveState(); };
      listEl.appendChild(textarea);
    } else if (isTermine) {
      const rawTermine = state.items.termine || [];
      const itemsWithMeta = rawTermine.map((item, originalIdx) => {
        const obj = typeof item === 'object' ? item : { task: item, date: '', time: '', location: '' };
        return { ...obj, originalIdx };
      });
      itemsWithMeta.sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return `${a.date} ${a.time || '00:00'}`.localeCompare(`${b.date} ${b.time || '00:00'}`);
      });
      
      itemsWithMeta.forEach((item) => {
        const originalIndex = item.originalIdx;
        const isToday = item.date === todayISO;
        
        let fullDateString = "Kein Datum";
        if (item.date) {
          const d = new Date(item.date);
          const weekdaysFull = {
            de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
            en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            es: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            el: ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σαββάτο']
          };
          const weekdayString = weekdaysFull[currentLang]?.[d.getDay()] || weekdaysFull['de'][d.getDay()];
          const parts = item.date.split('-');
          if (parts.length === 3) {
            fullDateString = `${weekdayString}, ${parts[2]}.${parts[1]}.${parts[0]}`;
          } else {
            fullDateString = `${weekdayString}, ${item.date}`;
          }
        }

        const itemDiv = document.createElement('div');
        itemDiv.draggable = true;
        itemDiv.ondragstart = (e) => handleDragStart(e, id, originalIndex);
        
        itemDiv.className = `group relative w-full min-h-[44px] flex items-center justify-between p-2.5 border-0 border-l-[4px] ${isToday ? 'border-amber-400 bg-amber-500/10' : 'border-[var(--accent)] bg-white/[0.03]'} hover:bg-[rgba(255,255,255,0.02)] hover:scale-[1.02] text-gray-300 font-medium leading-tight transition duration-300 rounded-lg`;
        
        // Jedes Element erhält basierend auf seinem Index eine andere Hover-Farbe
        const pair = HOVER_COLOR_PAIRS[(originalIndex + 12) % HOVER_COLOR_PAIRS.length];

        itemDiv.innerHTML = `
          <button onclick="handleCompleteTask('termine', ${originalIndex}, event)" class="task-complete-btn flex items-center gap-2.5 flex-1 min-w-0 text-left bg-transparent border-0 text-inherit cursor-pointer p-0 transition duration-150 pr-2 group/task" title="Diesen Termin als erledigt abhaken">
            <i data-lucide="clock" class="standard-task-icon w-5 h-5 text-amber-400 shrink-0 transition-colors duration-150 ${pair.hoverIcon}"></i>
            <span class="task-text-span block text-xs font-semibold text-white truncate ${pair.text} transition-colors duration-150">${item.task}</span>
          </button>
          
          <div class="absolute right-1 -top-3 flex items-center gap-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 shrink-0 bg-[#13131a] border border-white/10 px-1 py-0.5 rounded-lg shadow-lg z-50 whitespace-nowrap">
            <button onclick="deleteTask('termine', ${originalIndex}, event)" class="p-1 text-gray-500 hover:text-red-400 hover:bg-white/10 rounded transition cursor-pointer" title="Diesen Termin unwiderruflich aus dem Kalender löschen"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
          </div>

          <div class="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 mb-1 w-56 hidden group-hover:block bg-[#111116] border border-amber-400/35 p-3 rounded-xl shadow-2xl z-[9999] pointer-events-none transition-all duration-200">
            <div class="text-[9px] text-amber-400 font-bold uppercase tracking-wider mb-1">Termindetails</div>
            <div class="text-xs font-bold text-white mb-1.5 break-words">${item.task}</div>
            <div class="space-y-1.5 text-[10px] text-gray-300 font-semibold">
              <div class="flex items-center gap-1.5"><i data-lucide="calendar" class="w-3.5 h-3.5 text-amber-400/80 shrink-0"></i><span>${fullDateString}</span></div>
              ${item.time ? `<div class="flex items-center gap-1.5"><i data-lucide="clock" class="w-3.5 h-3.5 text-amber-400/80 shrink-0"></i><span>${item.time} Uhr</span></div>` : ''}
              ${item.location ? `<div class="flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-amber-400/80 shrink-0"></i><span class="truncate">${item.location}</span></div>` : ''}
            </div>
          </div>
        `;
        listEl.appendChild(itemDiv);
      });
      
      if (!isTerminFormOpen) {
        const btnEl = document.createElement('button');
        btnEl.onclick = () => toggleTerminForm(true);
        btnEl.className = 'mt-2 w-full min-h-[38px] p-2 rounded-lg border border-dashed border-white/15 bg-[#0a0a0e] hover:bg-[#13131e] text-center text-xs text-gray-400 hover:text-white font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm';
        const btnT = t('appointment_new_btn');
        btnEl.title = "Formular zur Erstellung eines neuen Termins öffnen";
        btnEl.innerHTML = `<i data-lucide="calendar-plus" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i><span>${btnT}</span>`;
        listEl.appendChild(btnEl);
      } else {
        const formDiv = document.createElement('div');
        formDiv.className = 'mt-2 p-3 bg-[#0e0e14] border border-[var(--accent)]/40 rounded-xl flex flex-col gap-2 shadow-lg';
        const formT = t('appointment_form_title');
        const nameT = t('appointment_form_name_placeholder');
        const dateT = t('appointment_form_date_label');
        const timeT = t('appointment_form_time_label');
        const saveT = t('appointment_form_save_btn');
        const cancelT = t('appointment_form_cancel_btn');
        
        formDiv.innerHTML = `
          <div class="flex items-center justify-between text-xs font-bold text-amber-300">
            <span class="flex items-center gap-1.5"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> ${formT}</span>
            <button onclick="toggleTerminForm(false)" class="text-gray-400 hover:text-white p-0.5 cursor-pointer text-xs" title="Terminformular schließen">✕</button>
          </div>
          <input type="text" id="add-termin-title" placeholder="${nameT}" class="w-full p-2 bg-black/60 border border-white/15 rounded-lg text-xs text-white outline-none focus:border-[var(--accent)] font-semibold placeholder:text-gray-500 mb-2" title="Terminname eingeben" />
          <input type="text" id="add-termin-location" placeholder="Ort (z.B. Zoom, Büro, Park)" class="w-full p-2 bg-black/60 border border-white/15 rounded-lg text-xs text-white outline-none focus:border-[var(--accent)] font-semibold placeholder:text-gray-500 mb-2" title="Ort des Termins eingeben (optional)" />
          <div class="grid grid-cols-2 gap-2 mb-2">
            <div><label class="text-[10px] text-gray-400 mb-0.5 block font-medium">${dateT}</label><input type="date" id="add-termin-date" value="${todayISO}" class="w-full p-1.5 bg-black/60 border border-white/15 rounded-lg text-xs text-gray-200 outline-none focus:border-[var(--accent)] cursor-pointer" title="Termindatum festlegen" /></div>
            <div><label class="text-[10px] text-gray-400 mb-0.5 block font-medium">${timeT}</label><input type="time" id="add-termin-time" value="10:00" class="w-full p-1.5 bg-black/60 border border-white/15 rounded-lg text-xs text-gray-200 outline-none focus:border-[var(--accent)] cursor-pointer" title="Terminuhrzeit festlegen" /></div>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <button onclick="handleAddTermin()" class="flex-1 py-1.5 bg-[var(--accent)] hover:opacity-90 text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm" title="Termin jetzt speichern und eintragen"><i data-lucide="check" class="w-3.5 h-3.5"></i><span>${saveT}</span></button>
            <button onclick="toggleTerminForm(false)" class="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs rounded-lg transition cursor-pointer">${cancelT}</button>
          </div>
        `;
        setTimeout(() => {
          const inputTitle = formDiv.querySelector('#add-termin-title');
          if (inputTitle) {
            inputTitle.onkeydown = (e) => {
              if (e.key === 'Enter' && inputTitle.value.trim()) handleAddTermin();
              if (e.key === 'Escape') toggleTerminForm(false);
            };
          }
        }, 0);
        listEl.appendChild(formDiv);
      }
    } else {
      (state.items[id] || []).forEach((task, index) => {
        const taskText = typeof task === 'object' ? task.task : task;
        const iconDetails = getTaskIconDetails(taskText, id);
        const isTaskActive = activeTimerTask === taskText && timerRunning;
        const itemDiv = document.createElement('div');
        itemDiv.draggable = true;
        itemDiv.ondragstart = (e) => handleDragStart(e, id, index);
        itemDiv.ondragover = (e) => handleDragOver(e);
        itemDiv.ondrop = (e) => handleItemDrop(e, id, index);
        
        itemDiv.className = `group relative w-full min-h-[42px] flex items-center justify-between p-2 border-0 border-l-[4px] ${isTaskActive ? 'border-amber-400 bg-amber-500/15 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'border-[var(--accent)] bg-white/[0.03]'} hover:bg-[rgba(255,255,255,0.02)] text-gray-300 font-medium leading-tight transition duration-200 rounded-lg`;
        const safeTaskEscaped = taskText.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        
        // Jedes Element erhält basierend auf seinem Index und Kategorie-Name eine andere Hover-Farbe
        const pair = HOVER_COLOR_PAIRS[(index + id.charCodeAt(0)) % HOVER_COLOR_PAIRS.length];

        itemDiv.innerHTML = `
          <button onclick="handleCompleteTask('${id}', ${index}, event)" class="task-complete-btn flex items-center gap-2.5 flex-1 min-w-0 text-left bg-transparent border-0 text-inherit cursor-pointer p-0 transition duration-150 pr-2 group/task" title="Diese Aufgabe als erledigt abhaken">
            <i data-lucide="${iconDetails.icon}" class="standard-task-icon w-5 h-5 ${isTaskActive ? 'text-amber-400 animate-pulse' : iconDetails.color} shrink-0 transition-colors duration-150 ${pair.hoverIcon}"></i>
            <span class="task-text-span block text-xs leading-snug min-w-0 flex-1 font-medium text-gray-200 truncate ${isTaskActive ? 'text-amber-200 font-bold' : ''} ${pair.text} transition-colors duration-150" title="${taskText.replace(/"/g, '&quot;')}">${taskText}</span>
          </button>
          
          <div class="absolute right-1 -top-3 flex items-center gap-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 shrink-0 bg-[#13131a] border border-white/10 px-1 py-0.5 rounded-lg shadow-lg z-50 whitespace-nowrap">
            <button onclick="openTaskStepsModal('${id}', ${index}, event)" class="p-1 text-[var(--accent-light)] hover:text-white hover:bg-white/10 rounded transition cursor-pointer" title="Schritt-für-Schritt-Anleitung (Steps) für diese Aufgabe anzeigen"><i data-lucide="footprints" class="w-3.5 h-3.5"></i></button>
            <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
            <button onclick="startTaskTimer('${safeTaskEscaped}', event)" class="p-1 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded transition cursor-pointer" title="Fokus-Timer für diese Aufgabe mit den voreingestellten Minuten starten"><i data-lucide="timer" class="w-3.5 h-3.5"></i></button>
            <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
            <button onclick="deleteTask('${id}', ${index}, event)" class="p-1 text-gray-500 hover:text-red-400 hover:bg-white/10 rounded transition cursor-pointer" title="Diese Aufgabe unwiderruflich aus der Spalte löschen"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
          </div>
        `;
        listEl.appendChild(itemDiv);
      });
      const addInput = document.createElement('input');
      addInput.type = 'text'; addInput.placeholder = '＋';
      addInput.title = "Neue Aufgabe eingeben und mit Enter hinzufügen";
      addInput.className = 'w-full min-h-[38px] p-2 rounded-lg border border-white/10 bg-[#0a0a0e] hover:bg-[#111118] text-center text-xs placeholder:text-gray-500 focus:outline-none focus:border-[var(--accent)] transition cursor-text font-semibold text-gray-300';
      addInput.onkeydown = (e) => {
        if (e.key === 'Enter' && addInput.value.trim()) {
          saveHistory();
          state.items[id].push(addInput.value.trim());
          addInput.value = ''; saveState(); renderApp(); populateHelperTaskSelect(); 
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      };
      listEl.appendChild(addInput);
    }
    main.appendChild(article);
  });
  
  // Synchronisiere das neue Einkauf-Popup mit den aktuellen Daten (skipLucide = true)
  updateShoppingListPopup(true);
  
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function handleCompleteTask(category, index, event) {
  if (event) event.stopPropagation();
  const rawTask = state.items[category][index];
  if (!rawTask) return;
  saveHistory();
  state.items[category].splice(index, 1);
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const todayStr = now.toISOString().split('T')[0];
  let taskText = typeof rawTask === 'object' ? rawTask.task : rawTask;
  if (typeof rawTask === 'object' && rawTask.date) {
    let locInfo = rawTask.location ? ` @ ${rawTask.location}` : '';
    taskText += ` (${formatTerminDate(rawTask.date, rawTask.time)}${locInfo})`;
  }
  state.done.push({ task: taskText, origin: category, date: todayStr, time: timeStr });
  state.streak = (state.streak || 0) + 1;
  if (state.completedSteps) delete state.completedSteps[taskText];
  
  // GEÄNDERT: Genau auf die 12 neuen Themen abgestimmt (sage anstelle von ocean, terracotta anstelle von sahara)
  const themes = ['sage', 'aurora', 'cozy', 'forest', 'architect', 'mono-hand', 'editorial', 'glacier', 'charcoal', 'executive', 'terracotta', 'carbon'];
  let nextTheme;
  do {
    nextTheme = themes[Math.floor(Math.random() * themes.length)];
  } while (nextTheme === currentTheme);
  setTheme(nextTheme);

  saveState(); 
  
  showPraise(); 
  
  renderApp(); 
  updateZenView(); 
  populateHelperTaskSelect();
}

function deleteTask(category, index, event) {
  if (event) event.stopPropagation();
  saveHistory();
  const taskObj = state.items[category][index];
  const taskText = typeof taskObj === 'object' ? taskObj?.task : taskObj;
  state.items[category].splice(index, 1);
  if (taskText && state.completedSteps) delete state.completedSteps[taskText];
  saveState(); showToast(t('toast_task_deleted')); renderApp(); updateZenView(); populateHelperTaskSelect();
}

function handleRestoreDoneTask(doneIndex) {
  saveHistory();
  const reversedIndex = state.done.length - 1 - doneIndex;
  const item = state.done[reversedIndex];
  if (!item) return;
  state.done.splice(reversedIndex, 1);
  const targetCat = state.items[item.origin] ? item.origin : 'daily';
  state.items[targetCat].push(item.task);
  saveState(); showToast(t('toast_task_restored')); renderApp(); updateZenView(); populateHelperTaskSelect();
}

let draggedItemInfo = null;
function handleDragStart(e, category, index) {
  draggedItemInfo = { category, index };
  e.stopPropagation(); 
  e.dataTransfer.setData('text/plain', JSON.stringify({ category, index }));
  e.dataTransfer.effectAllowed = 'move';
}

// Drag & Drop
function handleDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }

function handleItemDrop(e, targetCategory, targetIndex) {
  e.preventDefault(); e.stopPropagation();
  let data = draggedItemInfo;
  try { if (!data) data = JSON.parse(e.dataTransfer.getData('text/plain')); } catch(err) {}
  if (!data || data.category === undefined || data.index === undefined) return;
  const { category: srcCat, index: srcIdx } = data;
  if (srcCat === 'notes' || srcCat === 'done' || targetCategory === 'notes' || targetCategory === 'done') return;
  saveHistory();
  const [item] = state.items[srcCat].splice(srcIdx, 1);
  state.items[targetCategory].splice(targetIndex, 0, item);
  draggedItemInfo = null; saveState(); renderApp(); populateHelperTaskSelect();
}

function handleDrop(e, targetCategory) {
  e.preventDefault();
  let data = draggedItemInfo;
  try { if (!data) data = JSON.parse(e.dataTransfer.getData('text/plain')); } catch(err) {}
  if (!data || data.category === undefined || data.index === undefined) return;
  const { category: srcCat, index: srcIdx } = data;
  if (srcCat === 'notes' || srcCat === 'done' || targetCategory === 'notes' || targetCategory === 'done') return;
  saveHistory();
  const [item] = state.items[srcCat].splice(srcIdx, 1);
  state.items[targetCategory].push(item);
  draggedItemInfo = null; saveState(); renderApp(); populateHelperTaskSelect();
}

// OPTIMIERTES HOVER PANEL SYSTEM GEGEN LAYOUT-THRASHING
let currentlyOpenPanel = null;
let hoverPanelTimeout = null;

function showPanelHover(panelName) {
  clearTimeout(hoverPanelTimeout);
  if (currentlyOpenPanel === panelName) return; // Doppelte Event-Ketten ignorieren
  
  currentlyOpenPanel = panelName;
  ['feedback', 'report', 'settings', 'soundscape', 'language', 'boost', 'music', 'sync', 'theme', 'calendar-dropdown', 'inspiration', 'shopping'].forEach(p => {
    const el = document.getElementById(`panel-${p}`); if (!el) return;
    if (p === panelName) {
      if (el.classList.contains('hidden')) {
        el.classList.remove('hidden'); 
        if (p === 'report') updateReportPanel();
      }
    } else { 
      el.classList.add('hidden'); 
    }
  });
}

function hidePanelHover(panelName) {
  clearTimeout(hoverPanelTimeout);
  hoverPanelTimeout = setTimeout(() => {
    const el = document.getElementById(`panel-${panelName}`); 
    if (el) el.classList.add('hidden');
    if (currentlyOpenPanel === panelName) currentlyOpenPanel = null;
  }, 250);
}

function togglePanel(panelName) {
  clearTimeout(hoverPanelTimeout);
  const el = document.getElementById(`panel-${panelName}`);
  if (!el) return;
  const isCurrentlyHidden = el.classList.contains('hidden');
  
  ['feedback', 'report', 'settings', 'soundscape', 'language', 'boost', 'music', 'sync', 'theme', 'calendar-dropdown', 'inspiration', 'shopping'].forEach(p => {
    if (p !== panelName) {
      const other = document.getElementById(`panel-${p}`);
      if (other) other.classList.add('hidden');
    }
  });

  if (isCurrentlyHidden) {
    el.classList.remove('hidden');
    currentlyOpenPanel = panelName;
    if (panelName === 'report') updateReportPanel();
  } else {
    el.classList.add('hidden');
    if (currentlyOpenPanel === panelName) currentlyOpenPanel = null;
  }
}

let reportTimeframe = 'today';
function setReportTimeframe(tf) {
  reportTimeframe = tf;
  ['today', 'week', 'month'].forEach(t => {
    const btn = document.getElementById(`report-tab-${t}`);
    if (btn) {
      if (t === tf) btn.className = 'px-2 py-0.5 rounded text-[var(--accent-light)] bg-[var(--accent)]/25 cursor-pointer font-bold';
      else btn.className = 'px-2 py-0.5 rounded text-gray-400 hover:text-white cursor-pointer';
    }
  });
  updateReportPanel();
}

function renderWeeklyChart() {
  const chartEl = document.getElementById('report-weekly-chart');
  const totalWeekTasksEl = document.getElementById('report-total-week-tasks');
  if (!chartEl) return;

  chartEl.innerHTML = '';
  const now = new Date();
  const last7Days = [];
  const weekdaysShort = {
    de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    el: ['Κυρ', 'Δευ', 'Τρι', 'Τετ', 'Πεμ', 'Παρ', 'Σαβ']
  };

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const iso = d.toISOString().split('T')[0];
    last7Days.push({
      date: iso,
      label: weekdaysShort[currentLang]?.[d.getDay()] || weekdaysShort['en'][d.getDay()],
      count: 0
    });
  }

  let totalWeekCount = 0;
  (state.done || []).forEach(item => {
    const found = last7Days.find(day => day.date === item.date);
    if (found) {
      found.count++;
      totalWeekCount++;
    }
  });

  if (totalWeekTasksEl) {
    totalWeekTasksEl.innerText = currentLang === 'de' 
      ? `${totalWeekCount} Aufgaben` 
      : `${totalWeekCount} Tasks`;
  }

  const maxCount = Math.max(...last7Days.map(d => d.count), 4);

  last7Days.forEach(day => {
    const pct = (day.count / maxCount) * 100;
    const isToday = day.date === now.toISOString().split('T')[0];
    const barCol = isToday ? 'bg-amber-400' : 'bg-[var(--accent)]';
    const barBg = isToday ? 'bg-amber-500/10 border-amber-400/20' : 'bg-[var(--accent)]/10 border-purple-500/20';

    const barWrapper = document.createElement('div');
    barWrapper.className = 'flex flex-col items-center gap-1.5 flex-1 max-w-[40px]';
    barWrapper.innerHTML = `
      <span class="text-[9px] font-bold font-mono ${day.count > 0 ? 'text-white' : 'text-gray-600'}">${day.count}</span>
      <div class="w-5 h-12 ${barBg} border rounded-md relative flex items-end overflow-hidden" title="${day.date}: ${day.count}">
        <div class="w-full ${barCol} transition-all duration-500 rounded-t animate-slide-up" style="height: ${pct}%"></div>
      </div>
      <span class="text-[9px] font-bold ${isToday ? 'text-amber-300 font-extrabold' : 'text-gray-400'}">${day.label}</span>
    `;
    chartEl.appendChild(barWrapper);
  });
}

function updateReportPanel() {
  const now = new Date();
  const todayISO = now.toISOString().split('T')[0];
  let filteredDone = state.done || [];
  if (reportTimeframe === 'today') filteredDone = filteredDone.filter(item => item.date === todayISO);
  else if (reportTimeframe === 'week') {
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    filteredDone = filteredDone.filter(item => item.date && item.date >= sevenDaysAgo);
  } else if (reportTimeframe === 'month') {
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    filteredDone = filteredDone.filter(item => item.date && item.date >= thirtyDaysAgo);
  }
  const count = filteredDone.length;
  
  let totalPending = 0;
  ['daily', 'weekly', 'todo', 'occasionally', 'termine'].forEach(cat => { totalPending += (state.items[cat] || []).length; });
  const totalAll = count + totalPending;
  const pct = totalAll > 0 ? Math.round((count / totalAll) * 100) : 100;
  const todayEl = document.getElementById('report-today-count'); if (todayEl) todayEl.innerText = count;
  const rateEl = document.getElementById('report-rate-pct'); if (rateEl) rateEl.innerText = `${pct}%`;
  
  renderWeeklyChart();

  const catBarsEl = document.getElementById('report-category-bars');
  if (catBarsEl) {
    catBarsEl.innerHTML = '';
    const catStats = [{ id: 'daily', label: t('daily') }, { id: 'weekly', label: t('weekly') }, { id: 'todo', label: t('todo') }, { id: 'occasionally', label: t('occasionally') }];
    catStats.forEach(({ id, label }) => {
      let pending = (state.items[id] || []).length;
      let completedInCat = filteredDone.filter(item => item.origin === id).length;
      let totalInCat = pending + completedInCat;

      if (reportTimeframe === 'week' || reportTimeframe === 'month') {
        if (id === 'daily') label = currentLang === 'de' ? 'Täglich' : (currentLang === 'es' ? 'Diario' : (currentLang === 'el' ? 'Καθημερινά' : 'Daily'));
        if (id === 'occasionally') label = currentLang === 'de' ? 'Gelegentliche' : (currentLang === 'es' ? 'Ocasionales' : (currentLang === 'el' ? 'Περιστασιακά' : 'Occasionally'));
      }

      if (id === 'daily') {
        if (reportTimeframe === 'week') {
          const baseDailyCount = Math.max(1, (state.items.daily || []).length + (state.done || []).filter(item => item.origin === 'daily' && item.date === todayISO).length);
          totalInCat = baseDailyCount * 7;
          pending = Math.max(0, totalInCat - completedInCat);
        } else if (reportTimeframe === 'month') {
          const baseDailyCount = Math.max(1, (state.items.daily || []).length + (state.done || []).filter(item => item.origin === 'daily' && item.date === todayISO).length);
          totalInCat = baseDailyCount * 30;
          pending = Math.max(0, totalInCat - completedInCat);
        }
      }

      if (totalInCat > 0) {
        const catPct = Math.round((completedInCat / totalInCat) * 100);
        const row = document.createElement('div'); row.className = 'space-y-1';
        row.innerHTML = `<div class="flex justify-between items-center text-[11px]"><span class="text-gray-300 font-medium">${label}</span><span class="text-gray-400 font-mono">${completedInCat}/${totalInCat} (${catPct}%)</span></div><div class="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5"><div class="h-full bg-gradient-to-r from-[var(--accent)] to-emerald-400 transition-all duration-500" style="width: ${catPct}%"></div></div>`;
        catBarsEl.appendChild(row);
      }
    });
  }

  const insightEl = document.getElementById('report-insight-text');
  if (insightEl) {
    if (count === 0) insightEl.innerText = t('loading_stats');
    else if (count < 3) insightEl.innerText = { de: `Guter Anfang! Du hast ${count} Aufgaben geschafft. Bleib dran!`, en: `Good start! You accomplished ${count} tasks. Keep going!`, es: `¡Buen comienzo! Has completado ${count} tareas. ¡Sigue así!`, el: `Καλή αρχή! Ολοκλήρωσες ${count} εργασίες. Συνέχισε έτσι!` }[currentLang];
    else if (count < 8) insightEl.innerText = { de: `Starkes Ergebnis! ${count} Aufgaben erledigt. Du bist voll im Flow! ⚡`, en: `Great result! ${count} tasks completed. You are in the flow! ⚡`, es: `¡Gran resultado! ${count} tareas completadas. ¡Estás in fluxo! ⚡`, el: `Εξαιρετικό obstacle! Ολοκλήρωσες ${count} εργασίες. Είσαι voreilig ροή! ⚡` }[currentLang];
    else insightEl.innerText = { de: `Hervorragende Produktivität! ${count} Aufgaben geschafft. Zeit für eine Pause! 🎉`, en: `Outstanding productivity! ${count} tasks finished. Time for a well-deserved break! 🎉`, es: `¡Productivity sobresaliente! ${count} tareas hechas. ¡Es hora de un descanso! 🎉`, el: `Εξαιρετική παραγωγικότητα! Ολοκλήrovσες ${count} εργασίες. Ώra für einilaemme! 🎉` }[currentLang];
  }

  const list = document.getElementById('report-list');
  if (list) {
    list.innerHTML = '';
    if (filteredDone.length === 0) {
      list.innerHTML = `<div class="text-gray-500 italic text-center py-2 text-xs">${currentLang === 'de' ? 'Keine Protokolleinträge vorhanden.' : 'No logs available.'}</div>`;
    } else {
      filteredDone.slice().reverse().forEach(item => {
        const div = document.createElement('div'); div.className = 'p-2 bg-white/[0.02] border border-white/5 rounded-lg flex justify-between items-center text-gray-300 hover:bg-white/5 transition';
        const catLabel = t(item.origin) || item.origin;
        div.innerHTML = `<div class="flex items-center gap-1.5 overflow-hidden pr-2"><span class="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">${catLabel}</span><span class="truncate font-semibold text-xs text-white">${item.task}</span></div><span class="text-gray-500 font-mono text-[10px] shrink-0">${item.time || ''}</span>`;
        list.appendChild(div);
      });
    }
  }

  updateMissedTasksList();

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ECHTES FEEDBACK-SENDEN PER MAIL AN JANNIS
function submitFeedback() {
  const text = document.getElementById('feedback-text').value;
  if (text.trim()) {
    // Erzeugt einen validen E-Mail-Entwurf an Jannis
    const mailtoUrl = `mailto:jmonke@gmail.com?subject=Flow App Feedback&body=${encodeURIComponent(text)}`;
    window.location.href = mailtoUrl;
    
    showToast({ 
      de: 'E-Mail-Entwurf geöffnet! ❤️', 
      en: 'Email draft opened! ❤️',
      es: '¡Borrador de email abierto! ❤️',
      el: 'Το προσχέδιο email áνοιξε! ❤️'
    }[currentLang] || 'Email draft opened! ❤️');
    
    document.getElementById('feedback-text').value = ''; 
    togglePanel('feedback');
  }
}

function updateZenView() {
  const zenCatEl = document.getElementById('zen-task-cat');
  const zenTextEl = document.getElementById('zen-task-text');
  if (!zenTextEl) return;
  let chosen = null;
  const dailyTasks = (state.items.daily || []).map(t => ({ cat: 'daily', task: typeof t === 'object' ? t.task : t }));
  const weeklyTasks = (state.items.weekly || []).map(t => ({ cat: 'weekly', task: typeof t === 'object' ? t.task : t }));
  const todoTasks = (state.items.todo || []).map(t => ({ cat: 'todo', task: typeof t === 'object' ? t.task : t }));
  const occasionallyTasks = (state.items.occasionally || []).map(t => ({ cat: 'occasionally', task: typeof t === 'object' ? t.task : t }));
  if (dailyTasks.length > 0) chosen = dailyTasks[0];
  else if (weeklyTasks.length > 0 || todoTasks.length > 0) chosen = weeklyTasks[0] || todoTasks[0];
  else if (occasionallyTasks.length > 0) chosen = occasionallyTasks[0];
  currentZenTaskInfo = chosen;
  if (!chosen) {
    if (zenCatEl) zenCatEl.innerText = t('completed');
    const endMsg = { de: '🎉 Alle Aufgaben erledigt! Entspanne dich und genieße deine freie Zeit.', en: '🎉 All tasks completed! Relax and enjoy your free time.', es: '🎉 ¡Todas las tareas completadas! ¡Disfruta de tu tempo libre!', el: '🎉 Όλες οι εργασίες ολοκληρώθηκαν! Χαλαρώστε und απολαύστε τον eλεύθερο χρόνο soaps.' }[currentLang];
    zenTextEl.innerHTML = `<span class="text-emerald-400">${endMsg}</span>`;
  } else {
    const catName = t(chosen.cat); if (zenCatEl) zenCatEl.innerText = `${t('next_rec')} · ${catName}`;
    zenTextEl.innerText = chosen.task;
  }
  updateTimerDisplay(); 
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function zenCompleteCurrentTask() {
  if (!currentZenTaskInfo) {
    showToast(currentLang === 'de' ? 'Keine aktive Aufgabe zum Erledigen.' : 'No active task.'); return;
  }
  const { cat, task } = currentZenTaskInfo;
  const idx = (state.items[cat] || []).findIndex(t => (typeof t === 'object' ? t.task : t) === task);
  if (idx !== -1) handleCompleteTask(cat, idx);
  updateZenView();
}

// TASTATURSTEUERUNG MIT AKTIVEM ESCAPE-MODAL-SCHLIESSER & FOCUS-MODE EXIT LOGIK
document.addEventListener('keydown', (e) => {
  if (e.key === 'z' || e.key === 'Z') {
    if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault(); toggleMinimalist(); return;
    }
  }
  if (e.key === 'Escape') {
    const pickModal = document.getElementById('helper-pick-modal');
    const stepsModal = document.getElementById('helper-steps-modal');
    const compassModal = document.getElementById('helper-compass-modal');
    const safeSpaceModal = document.getElementById('helper-safespace-modal');
    const scriptingModal = document.getElementById('helper-scripting-modal');
    const ringingModal = document.getElementById('timer-ringing-modal');
    
    const isPickModalOpen = pickModal && !pickModal.classList.contains('hidden');
    const isStepsModalOpen = stepsModal && !stepsModal.classList.contains('hidden');
    const isCompassModalOpen = compassModal && !compassModal.classList.contains('hidden');
    const isSafeSpaceModalOpen = safeSpaceModal && !safeSpaceModal.classList.contains('hidden');
    const isScriptingModalOpen = scriptingModal && !scriptingModal.classList.contains('hidden');
    
    // Zuerst prüfen, ob offene Helper-Fenster oder ein aktiver Wecker geschlossen werden müssen
    if (isPickModalOpen || isStepsModalOpen || isCompassModalOpen || isSafeSpaceModalOpen || isScriptingModalOpen || ringingModal) {
      closeHelperModal();
      closeCompassModal();
      closeSafeSpaceModal();
      closeScriptingModal();
      if (typeof stopPleasantRinging === 'function') stopPleasantRinging();
    } else if (isMinimalist) {
      // Wenn kein Modal offen ist, aber der Minimalist/Focus-Modus aktiv ist: Modus beenden!
      toggleMinimalist();
    }
    
    // Schließe alle eventuell offenen Header- & Footer-Dropdowns
    ['feedback', 'report', 'settings', 'soundscape', 'language', 'boost', 'music', 'sync', 'theme', 'calendar-dropdown', 'inspiration', 'shopping'].forEach(p => {
      const el = document.getElementById(`panel-${p}`); if (el) el.classList.add('hidden');
    });
    return;
  }
  if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
    e.preventDefault(); toggleTimer();
  }
});

function exportReportAsImage() {
  const target = document.getElementById('report-export-target');
  if (!target) return;
  
  html2canvas(target, {
    backgroundColor: '#111116',
    scale: 2, 
    useCORS: true
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = `flow-statistik-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL();
    link.click();
  }).catch(err => {
    console.error("Export-Fehler:", err);
    showToast("Export failed.");
  });
}

// =========================================================================
// HILFSFUNKTIONEN FÜR DIE INTELLIGENTE EINKAUFSLISTE IM POPUP-DOCK
// =========================================================================

function updateShoppingListPopup(skipLucide = false) {
  const rowsContainer = document.getElementById('shopping-list-rows');
  const sumEl = document.getElementById('shop-panel-sum');
  const badgeEl = document.getElementById('shop-badge-count');
  
  if (!rowsContainer) return;
  rowsContainer.innerHTML = '';
  
  const list = state.shoppingList || [];
  const totalCost = list.reduce((sum, item) => sum + (item.qty * item.price), 0);
  
  if (sumEl) sumEl.innerText = `${totalCost.toFixed(2)} €`;
  
  if (badgeEl) {
    if (list.length > 0) {
      badgeEl.classList.remove('hidden');
      badgeEl.innerText = list.length;
    } else {
      badgeEl.classList.add('hidden');
    }
  }
  
  if (list.length === 0) {
    rowsContainer.innerHTML = `<div class="text-center text-gray-500 italic py-2.5 text-[10px]">Einkaufsliste leer.</div>`;
  } else {
    list.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'flex items-center justify-between gap-1.5 py-1.5 border-b border-white/[0.03] text-gray-300';
      div.innerHTML = `
        <input type="checkbox" onclick="handleToggleShoppingItem(${idx})" class="w-3.5 h-3.5 rounded bg-black border-white/10 text-emerald-500 accent-emerald-500 cursor-pointer shrink-0" title="Diesen Artikel als eingekauft markieren und ins Protokoll verschieben" />
        <span class="truncate font-semibold flex-1 pl-1 text-[11px] text-white" title="${item.name}">${item.name}</span>
        <span class="font-mono text-gray-400 font-bold shrink-0">${item.qty}x</span>
        <span class="font-mono text-gray-300 font-bold shrink-0 w-12 text-right">${(item.qty * item.price).toFixed(2)} €</span>
        <button onclick="handleDeleteShoppingItem(${idx})" class="p-1 text-gray-500 hover:text-red-400 rounded transition shrink-0 cursor-pointer" title="Diesen Artikel unwiderruflich aus der Liste entfernen"><i data-lucide="trash-2" class="w-3 h-3"></i></button>
      `;
      rowsContainer.appendChild(div);
    });
  }
  
  // Einkaufsprotokoll bestücken falls ausgeklappt
  const historyBox = document.getElementById('shop-history-box');
  const historyList = document.getElementById('shop-history-list');
  const isHistoryVisible = localStorage.getItem('flow_shop_history_visible') === 'true';
  
  if (historyBox) {
    if (isHistoryVisible) historyBox.classList.remove('hidden');
    else historyBox.classList.add('hidden');
  }
  
  if (historyList) {
    historyList.innerHTML = '';
    const hist = state.shoppingHistory || [];
    if (hist.length === 0) {
      historyList.innerHTML = `<div class="text-gray-600 italic text-center py-1 text-[9px]">Noch keine Einkäufe.</div>`;
    } else {
      hist.slice().reverse().forEach(hItem => {
        const hDiv = document.createElement('div');
        hDiv.className = 'flex justify-between items-center py-0.5 border-b border-white/[0.02] text-gray-400 text-[9px]';
        hDiv.innerHTML = `
          <span class="truncate max-w-[120px] line-through decoration-emerald-500/40">${hItem.name} (${hItem.qty}x)</span>
          <span class="font-mono text-[8px] text-gray-500 shrink-0">${hItem.date}</span>
        `;
        historyList.appendChild(hDiv);
      });
    }
  }
  
  // Intelligente Spartipps-Generierung
  const tipBox = document.getElementById('panel-shopping');
  if (tipBox) {
    generateSmartShoppingTips(tipBox);
  }
  
  if (!skipLucide && typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function handleAddShoppingItem() {
  const nameEl = document.getElementById('shop-add-name');
  const qtyEl = document.getElementById('shop-add-qty');
  const priceEl = document.getElementById('shop-add-price');
  
  const name = nameEl ? nameEl.value.trim() : '';
  const qty = qtyEl ? parseInt(qtyEl.value) || 1 : 1;
  const price = priceEl ? parseFloat(priceEl.value) || 0.00 : 0.00;
  
  if (!name) {
    showToast(currentLang === 'de' ? "Artikelnr. angeben!" : "Please specify item name!");
    return;
  }
  
  saveHistory();
  if (!state.shoppingList) state.shoppingList = [];
  state.shoppingList.push({ name, qty, price });
  saveState();
  
  // Reset Input
  if (nameEl) nameEl.value = '';
  if (qtyEl) qtyEl.value = '1';
  if (priceEl) priceEl.value = '';
  
  renderApp();
  showToast(currentLang === 'de' ? `"${name}" hinzugefügt!` : `Added "${name}"!`);
}

function handleDeleteShoppingItem(index) {
  saveHistory();
  const removed = state.shoppingList[index];
  state.shoppingList.splice(index, 1);
  saveState();
  renderApp();
  showToast(currentLang === 'de' ? `"${removed.name}" gelöscht.` : `Deleted "${removed.name}".`);
}

function handleToggleShoppingItem(index) {
  saveHistory();
  const item = state.shoppingList[index];
  state.shoppingList.splice(index, 1);
  
  if (!state.shoppingHistory) state.shoppingHistory = [];
  const todayStr = new Date().toLocaleDateString([], { month: '2-digit', day: '2-digit' });
  state.shoppingHistory.push({ name: item.name, qty: item.qty, price: item.price, date: todayStr });
  
  saveState();
  
  if (typeof playProceduralSound === 'function') playProceduralSound(3); // bubbly POP sound
  showToast(currentLang === 'de' ? `"${item.name}" eingekauft! ✅` : `Bought "${item.name}"! ✅`);
  
  renderApp();
}

function toggleShoppingHistory() {
  const visible = localStorage.getItem('flow_shop_history_visible') === 'true';
  localStorage.setItem('flow_shop_history_visible', String(!visible));
  renderApp();
}

function clearShoppingList() {
  if (confirm(currentLang === 'de' ? "Gesamte Einkaufsliste leeren?" : "Clear entire shopping list?")) {
    saveHistory();
    state.shoppingList = [];
    saveState();
    renderApp();
  }
}

function clearShoppingHistory() {
  if (confirm(currentLang === 'de' ? "Einkaufs-Protokoll leeren?" : "Clear shopping logs?")) {
    saveHistory();
    state.shoppingHistory = [];
    saveState();
    renderApp();
  }
}

function generateSmartShoppingTips(container) {
  const tipTextEl = container.querySelector('#shop-tip-text');
  if (!tipTextEl) return;
  
  if (!state.shoppingList || state.shoppingList.length === 0) {
    const defaultTips = {
      de: "Tipp: Gehe nie hungrig einkaufen & kaufe vorzugsweise saisonal, um bis zu 30% bei Gemüse zu sparen!",
      en: "Tipp: Never go shopping hungry & prioritize seasonal produce to save up to 30%!",
      es: "Consejo: ¡Nunca vayas de compras con hambre und compra alimentos de temporada para ahorrar!",
      el: "Συμβουλή: Μην πηγαίνετε ποτέ πεινασμένοι για ψώνια & επιλέξτε εποχιακά προϊόντα!"
    };
    tipTextEl.innerText = defaultTips[currentLang] || defaultTips.de;
    return;
  }
  
  let hasMeat = false;
  let hasDairy = false;
  let hasVegFruit = false;
  let hasConvenience = false;
  
  const meatKeywords = ['fleisch', 'meat', 'hähnchen', 'chicken', 'beef', 'schwein', 'pork', 'schinken', 'wurst'];
  const dairyKeywords = ['milch', 'milk', 'käse', 'cheese', 'butter', 'quark', 'joghurt', 'joghurt', 'sahne'];
  const vegFruitKeywords = ['tomate', 'apfel', 'apple', 'banan', 'gemüse', 'obst', 'salat', 'gurke', 'paprika', 'kartoffel', 'orange'];
  const convenienceKeywords = ['pizza', 'chips', 'cola', 'fanta', 'snack', 'schoko', 'süss', 'sweet'];

  state.shoppingList.forEach(item => {
    const name = item.name.toLowerCase();
    if (meatKeywords.some(kw => name.includes(kw))) hasMeat = true;
    if (dairyKeywords.some(kw => name.includes(kw))) hasDairy = true;
    if (vegFruitKeywords.some(kw => name.includes(kw))) hasVegFruit = true;
    if (convenienceKeywords.some(kw => name.includes(kw))) hasConvenience = true;
  });
  
  let tip = "";
  if (hasMeat) {
    tip = currentLang === 'de'
      ? "Spartipp: Fleisch lässt sich im Angebot in größeren Mengen kaufen und einfrieren. Das spart bis zu 35%!"
      : "Smart Tip: Buy meat in bulk when on sale and freeze it. Saves up to 35%!";
  } else if (hasDairy) {
    tip = currentLang === 'de'
      ? "Spartipp: Eigenmarken bei Milch, Butter & Quark kommen oft von denselben Herstellern, kosten aber bis zu 40% weniger."
      : "Smart Tip: Store brands for dairy (milk, butter) often come from the same factories but cost up to 40% less.";
  } else if (hasVegFruit) {
    tip = currentLang === 'de'
      ? "Spartipp: Kaufe loses Obst & Gemüse statt Plastik-Verpackungen. Meist frischer und deutlich günstiger im Kilopreis!"
      : "Smart Tip: Buy loose fruits & veggies instead of pre-packaged plastic ones. Usually cheaper per kg!";
  } else if (hasConvenience) {
    tip = currentLang === 'de'
      ? "Spartipp: Snacks und Fertiggerichte treiben den Bon extrem hoch. Selber machen oder Multipacks verringern die Kosten stark."
      : "Smart Tip: Prepared snacks inflate your bill. Buy multipacks or prep your own snacks to save big.";
  } else {
    tip = currentLang === 'de'
      ? "Spartipp: Vergleiche immer den Grundpreis (Preis pro kg/Liter) im Regal, da Packungsgrößen oft täuschen!"
      : "Smart Tip: Always compare the base price (price per kg/liter) on the shelf tags. Packaging sizes can be deceiving!";
  }
  
  tipTextEl.innerText = tip;
}

// =========================================================================
// AUTOMATISCHES BERICHTS-SYSTEM & MANUELLE EXPORT-LOGIK
// =========================================================================

function getYearAndWeek(d) {
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  const weekNum = 1 + Math.ceil((firstThursday - target) / 604800000);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

function updateMissedTasksList() {
  const container = document.getElementById('report-missed-tasks-list');
  if (!container) return;
  container.innerHTML = '';

  const missed = [];
  const todayISO = new Date().toISOString().split('T')[0];

  (state.items.daily || []).forEach(task => {
    missed.push({ task: typeof task === 'object' ? task.task : task, tag: currentLang === 'de' ? 'Täglich' : 'Daily' });
  });

  (state.items.weekly || []).forEach(task => {
    missed.push({ task: typeof task === 'object' ? task.task : task, tag: currentLang === 'de' ? 'Wöchentlich' : 'Weekly' });
  });

  (state.items.todo || []).forEach(task => {
    missed.push({ task: typeof task === 'object' ? task.task : task, tag: 'Todo' });
  });

  (state.items.occasionally || []).forEach(task => {
    missed.push({ task: typeof task === 'object' ? task.task : task, tag: currentLang === 'de' ? 'Gelegentliche' : 'Occasionally' });
  });

  (state.items.termine || []).forEach(task => {
    if (task.date === todayISO) {
      missed.push({ task: task.task, tag: currentLang === 'de' ? 'Termin heute' : 'Appointment' });
    }
  });

  if (missed.length === 0) {
    container.innerHTML = `<div class="text-emerald-400 italic text-[10px] py-1 text-center font-semibold">🎉 Alles erledigt! Großartige Leistung.</div>`;
  } else {
    missed.forEach(item => {
      const div = document.createElement('div');
      div.className = 'flex justify-between items-center gap-1.5 py-1 px-1.5 bg-black/30 rounded border border-white/5 hover:border-rose-500/10 transition';
      div.innerHTML = `
        <span class="truncate font-semibold text-gray-200 text-[10px]">${item.task}</span>
        <span class="text-[8px] px-1 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 shrink-0 font-mono font-bold">${item.tag}</span>
      `;
      container.appendChild(div);
    });
  }
}

function generateReportContent(timeframe, targetDateOrPeriod) {
  const lang = currentLang || 'de';
  const todayISO = new Date().toISOString().split('T')[0];
  let filteredDone = state.done || [];
  
  let title = "";
  let doneTasks = [];
  let missedTasks = [];
  
  if (timeframe === 'daily') {
    const targetDate = targetDateOrPeriod || todayISO;
    title = lang === 'de' ? `TÄGLICHER FOCUS-BERICHT (${targetDate})` : `DAILY FOCUS REPORT (${targetDate})`;
    doneTasks = filteredDone.filter(t => t.date === targetDate);
    
    (state.items.daily || []).forEach(task => { missedTasks.push(typeof task === 'object' ? task.task : task); });
    (state.items.todo || []).forEach(task => { missedTasks.push(typeof task === 'object' ? task.task : task); });
    (state.items.termine || []).forEach(t => { if (t.date === targetDate) missedTasks.push(`${t.task} (Termin)`); });
  } else if (timeframe === 'weekly') {
    const targetWeek = targetDateOrPeriod || getYearAndWeek(new Date());
    title = lang === 'de' ? `WÖCHENTLICHER FOCUS-BERICHT (${targetWeek})` : `WEEKLY FOCUS REPORT (${targetWeek})`;
    
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    doneTasks = filteredDone.filter(t => t.date && t.date >= sevenDaysAgo);
    
    (state.items.weekly || []).forEach(task => { missedTasks.push(typeof task === 'object' ? task.task : task); });
    (state.items.todo || []).forEach(task => { missedTasks.push(typeof task === 'object' ? task.task : task); });
    
    const baseDailyCount = Math.max(1, (state.items.daily || []).length + (state.done || []).filter(item => item.origin === 'daily' && item.date === todayISO).length);
    const targetDailyCount = baseDailyCount * 7;
    const completedDailyCount = doneTasks.filter(item => item.origin === 'daily').length;
    if (completedDailyCount < targetDailyCount) {
      missedTasks.push(lang === 'de' 
        ? `Tägliche Aufgaben: ${targetDailyCount - completedDailyCount} von ${targetDailyCount} wöchentlichen Wiederholungen verpasst`
        : `Daily Tasks: Missed ${targetDailyCount - completedDailyCount} out of ${targetDailyCount} weekly repetitions`);
    }
  } else if (timeframe === 'monthly') {
    const targetMonth = targetDateOrPeriod || todayISO.substring(0, 7);
    title = lang === 'de' ? `MONATLICHER FOCUS-BERICHT (${targetMonth})` : `MONTHLY FOCUS REPORT (${targetMonth})`;
    
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    doneTasks = filteredDone.filter(t => t.date && t.date >= thirtyDaysAgo);
    
    (state.items.occasionally || []).forEach(task => { missedTasks.push(typeof task === 'object' ? task.task : task); });
    (state.items.todo || []).forEach(task => { missedTasks.push(typeof task === 'object' ? task.task : task); });
    
    const baseDailyCount = Math.max(1, (state.items.daily || []).length + (state.done || []).filter(item => item.origin === 'daily' && item.date === todayISO).length);
    const targetDailyCount = baseDailyCount * 30;
    const completedDailyCount = doneTasks.filter(item => item.origin === 'daily').length;
    if (completedDailyCount < targetDailyCount) {
      missedTasks.push(lang === 'de' 
        ? `Tägliche Aufgaben: ${targetDailyCount - completedDailyCount} von ${targetDailyCount} monatlichen Wiederholungen verpasst`
        : `Daily Tasks: Missed ${targetDailyCount - completedDailyCount} out of ${targetDailyCount} monthly repetitions`);
    }
  }

  const successRate = (doneTasks.length + missedTasks.length) > 0 
    ? Math.round((doneTasks.length / (doneTasks.length + missedTasks.length)) * 100) 
    : 100;

  let reportText = `==============================================\n`;
  reportText += `       🌊 FLOW - AUTOMATISCHER BERICHT 🌊     \n`;
  reportText += `==============================================\n\n`;
  reportText += `${title}\n`;
  reportText += `----------------------------------------------\n`;
  reportText += lang === 'de' ? `Erledigte Aufgaben:    ${doneTasks.length}\n` : `Completed Tasks:       ${doneTasks.length}\n`;
  reportText += lang === 'de' ? `Offene Aufgaben:       ${missedTasks.length}\n` : `Pending Tasks:         ${missedTasks.length}\n`;
  reportText += lang === 'de' ? `Erfolgsquote:          ${successRate}%\n` : `Success Rate:          ${successRate}%\n`;
  reportText += `----------------------------------------------\n\n`;
  
  reportText += lang === 'de' ? `✅ ERLEDIGTE AUFGABEN:\n` : `✅ COMPLETED TASKS:\n`;
  if (doneTasks.length === 0) {
    reportText += `   - (Keine)\n`;
  } else {
    doneTasks.forEach((t, i) => {
      reportText += `   ${i + 1}. [${t.origin.toUpperCase()}] ${t.task} (${t.time || ''})\n`;
    });
  }
  reportText += `\n`;
  
  reportText += lang === 'de' ? `❌ NICHT ERLEDIGTE AUFGABEN (OFFEN):\n` : `❌ UNCOMPLETED TASKS (OPEN):\n`;
  if (missedTasks.length === 0) {
    reportText += lang === 'de' ? `   🎉 Erledigt! Alle Ziele wurden erreicht.\n` : `   🎉 Outstanding! All goals achieved.\n`;
  } else {
    missedTasks.forEach((t, i) => {
      reportText += `   ${i + 1}. ${t}\n`;
    });
  }
  
  reportText += `\n==============================================\n`;
  reportText += lang === 'de' ? `Generiert am: ${new Date().toLocaleString()}\n` : `Generated on: ${new Date().toLocaleString()}\n`;
  reportText += `==============================================\n`;
  
  return { title, reportText, filename: `flow-report-${timeframe}-${targetDateOrPeriod || todayISO}.txt` };
}

function triggerManualReportDownload(timeframe) {
  const { reportText, filename = "" } = generateReportContent(timeframe);
  const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast(currentLang === 'de' ? `Bericht heruntergeladen! 📥` : `Report downloaded! 📥`);
}

function checkAndGenerateAutomaticReports() {
  const now = new Date();
  const todayISO = now.toISOString().split('T')[0];
  const lang = currentLang || 'de';

  // 1. Täglicher Berichts-Export bei Tagesübergang
  if (state.lastDate && state.lastDate !== todayISO) {
    const prevDate = state.lastDate;
    const { reportText, filename = "" } = generateReportContent('daily', prevDate);
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    
    showToast(lang === 'de' 
      ? `Automatischer täglicher Bericht für ${prevDate} heruntergeladen! 📊` 
      : `Automatic daily report for ${prevDate} downloaded! 📊`);
      
    state.lastDate = todayISO;
    saveState();
  }

  // 2. Wöchentlicher Berichts-Export bei Wochenwechsel
  const currentWeekStr = getYearAndWeek(now);
  const lastWeeklyReport = localStorage.getItem('flow_last_weekly_report_week');
  if (lastWeeklyReport && lastWeeklyReport !== currentWeekStr) {
    const { reportText, filename = "" } = generateReportContent('weekly', lastWeeklyReport);
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    showToast(lang === 'de'
      ? `Automatischer Wochenbericht (${lastWeeklyReport}) heruntergeladen! 📊`
      : `Automatic weekly report (${lastWeeklyReport}) downloaded! 📊`);
  }
  localStorage.setItem('flow_last_weekly_report_week', currentWeekStr);

  // 3. Monatlicher Berichts-Export bei Monatswechsel
  const currentMonthStr = todayISO.substring(0, 7);
  const lastMonthlyReport = localStorage.getItem('flow_last_monthly_report_month');
  if (lastMonthlyReport && lastMonthlyReport !== currentMonthStr) {
    const { reportText, filename = "" } = generateReportContent('monthly', lastMonthlyReport);
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    showToast(lang === 'de'
      ? `Automatischer Monatsbericht (${lastMonthlyReport}) heruntergeladen! 📊`
      : `Automatic monthly report (${lastMonthlyReport}) downloaded! 📊`);
  }
  localStorage.setItem('flow_last_monthly_report_month', currentMonthStr);
}

// =========================================================================
// NEU: ENTSCHEIDUNGS-KOMPASS INTERAKTIVE ENGINE 🧭
// =========================================================================

let currentCompassQuery = "";
let activeCompassTab = "coin";
let coinVetoTimer = null;
let coinVetoTimeLeft = 10;
let scaleArguments = [];
let spoonOptions = [];

function openCompassModal() {
  // Zurücksetzen der Ansicht auf Schritt 1
  document.getElementById('compass-query-input').value = '';
  document.getElementById('coin-opt-a').value = '';
  document.getElementById('coin-opt-b').value = '';
  document.getElementById('scale-add-text').value = '';
  document.getElementById('coin-toss-result-box').classList.add('hidden');
  document.getElementById('coin-toss-final').classList.add('hidden');
  
  scaleArguments = [];
  spoonOptions = [];
  renderScaleArguments();
  recalculateScaleVerdict();
  renderSpoonOptions();
  recalculateSpoonCheck();
  
  if (coinVetoTimer) {
    clearInterval(coinVetoTimer);
    coinVetoTimer = null;
  }

  document.getElementById('compass-step-tools').classList.add('hidden');
  document.getElementById('compass-step-entry').classList.remove('hidden');

  document.getElementById('helper-compass-modal').classList.remove('hidden');
  
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeCompassModal() {
  document.getElementById('helper-compass-modal').classList.add('hidden');
  if (coinVetoTimer) {
    clearInterval(coinVetoTimer);
    coinVetoTimer = null;
  }
}

function submitCompassQuery() {
  const query = document.getElementById('compass-query-input').value.trim();
  if (!query) {
    showToast(currentLang === 'de' ? "Bitte formuliere zuerst dein Anliegen!" : "Please write down your dilemma first!");
    return;
  }
  
  currentCompassQuery = query;
  document.getElementById('compass-active-dilemma-label').innerText = query;
  
  // Smarte Weichenstellung & automatisches Splitten bei „oder“
  let recommendedTab = "coin";
  const lowerQuery = query.toLowerCase();
  
  // "oder" Splitting (Option A und B automatisch befüllen)
  const deSplit = query.split(/\s+oder\s+/i);
  const enSplit = query.split(/\s+or\s+/i);
  const activeSplit = deSplit.length > 1 ? deSplit : (enSplit.length > 1 ? enSplit : []);
  
  if (activeSplit.length > 1) {
    document.getElementById('coin-opt-a').value = activeSplit[0].replace(/^(soll ich\s+)/i, "").trim();
    document.getElementById('coin-opt-b').value = activeSplit[1].replace(/(\?)$/, "").trim();
    recommendedTab = "coin";
  } else {
    // Keyword-Kategorisierung
    if (/(heute|jetzt|müde|sport|kochen|aufräumen|löffel|spoon|energy|now)/i.test(lowerQuery)) {
      recommendedTab = "spoon";
    } else if (/(job|kündigen|umziehen|kaufen|verkaufen|zukunft|geld|career|quit|move|buy|financial)/i.test(lowerQuery)) {
      recommendedTab = "scale";
    } else if (/(sagen|beichten|streiten|trennen|ansprechen|konflikt)/i.test(lowerQuery)) {
      recommendedTab = "ten";
    } else if (/(angst|sorge|zweifel|schlimmste|worst|panic|fear)/i.test(lowerQuery)) {
      recommendedTab = "fear";
    }
  }

  // Setze dynamische Labels für die 10-10-10 Fragerunde
  document.getElementById('lbl-ten-mins').innerText = currentLang === 'de'
    ? `Wie fühle ich mich in 10 Minuten nach der Entscheidung für: "${query}"?`
    : `How will I feel in 10 minutes after deciding: "${query}"?`;
  document.getElementById('lbl-ten-months').innerText = currentLang === 'de'
    ? `Wie fühle ich mich in 10 Monaten nach der Entscheidung für: "${query}"?`
    : `How will I feel in 10 months after deciding: "${query}"?`;
  document.getElementById('lbl-ten-years').innerText = currentLang === 'de'
    ? `Wie fühle ich mich in 10 Jahren nach der Entscheidung für: "${query}"?`
    : `How will I feel in 10 years after deciding: "${query}"?`;

  document.getElementById('compass-step-entry').classList.add('hidden');
  document.getElementById('compass-step-tools').classList.remove('hidden');
  
  switchCompassTab(recommendedTab);
  showToast(currentLang === 'de' ? `Kompass ausgerichtet! Empfehlung: ${recommendedTab}` : `Compass aligned! Recommended: ${recommendedTab}`);
}

function returnToCompassEntry() {
  if (coinVetoTimer) {
    clearInterval(coinVetoTimer);
    coinVetoTimer = null;
  }
  document.getElementById('compass-step-tools').classList.add('hidden');
  document.getElementById('compass-step-entry').classList.remove('hidden');
}

function switchCompassTab(tabId) {
  activeCompassTab = tabId;
  
  // Tabs umschalten
  ['coin', 'scale', 'spoon', 'ten', 'fear'].forEach(t => {
    const btn = document.getElementById(`tab-btn-${t}`);
    const pane = document.getElementById(`compass-pane-${t}`);
    if (btn && pane) {
      if (t === tabId) {
        btn.className = 'flex-1 py-1.5 px-2 rounded text-[var(--accent-light)] bg-[var(--accent)]/25 border border-[var(--accent)]/30 cursor-pointer font-bold text-center';
        pane.classList.remove('hidden');
      } else {
        btn.className = 'flex-1 py-1.5 px-2 rounded text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer text-center';
        pane.classList.add('hidden');
      }
    }
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// --- TAB 1: BAUCHGEFÜHL LOGIK ---
let coinLastPicked = "";
let coinLastOther = "";

function triggerCoinToss() {
  const optA = document.getElementById('coin-opt-a').value.trim();
  const optB = document.getElementById('coin-opt-b').value.trim();
  
  if (!optA || !optB) {
    showToast(currentLang === 'de' ? "Trage zuerst Option A und B ein!" : "Please enter Option A and B first!");
    return;
  }

  if (coinVetoTimer) clearInterval(coinVetoTimer);

  const resultBox = document.getElementById('coin-toss-result-box');
  const spinningEl = document.getElementById('coin-toss-spinning');
  const finalEl = document.getElementById('coin-toss-final');
  const vetoBtn = document.getElementById('coin-veto-btn');

  resultBox.classList.remove('hidden');
  spinningEl.classList.remove('hidden');
  finalEl.classList.add('hidden');
  vetoBtn.disabled = true;

  if (typeof playProceduralSound === 'function') playProceduralSound(10); // spring bounce sound

  setTimeout(() => {
    spinningEl.classList.add('hidden');
    finalEl.classList.remove('hidden');
    
    const pickedA = Math.random() < 0.5;
    coinLastPicked = pickedA ? optA : optB;
    coinLastOther = pickedA ? optB : optA;
    
    // Backup Absicherung
    if (coinLastOther === undefined || coinLastOther === null || coinLastOther === pickedA) {
      coinLastOther = pickedA ? optB : optA;
    }

    document.getElementById('coin-toss-verdict').innerText = coinLastPicked;
    
    // Countdown für Veto starten
    coinVetoTimeLeft = 10;
    vetoBtn.disabled = false;
    vetoBtn.className = "px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-[10px] font-bold rounded-lg transition cursor-pointer";
    document.getElementById('coin-veto-countdown').innerText = `Veto-Dauer: ${coinVetoTimeLeft}s`;
    
    coinVetoTimer = setInterval(() => {
      coinVetoTimeLeft--;
      if (coinVetoTimeLeft <= 0) {
        clearInterval(coinVetoTimer);
        coinVetoTimer = null;
        vetoBtn.disabled = true;
        vetoBtn.className = "px-3 py-1 bg-white/5 text-gray-500 border border-white/5 text-[10px] font-bold rounded-lg transition cursor-not-allowed";
        document.getElementById('coin-veto-countdown').innerText = currentLang === 'de' ? "Veto abgelaufen" : "Veto expired";
      } else {
        document.getElementById('coin-veto-countdown').innerText = `Veto-Dauer: ${coinVetoTimeLeft}s`;
      }
    }, 1000);

  }, 800);
}

function triggerCoinVeto() {
  if (coinVetoTimer) {
    clearInterval(coinVetoTimer);
    coinVetoTimer = null;
  }
  
  const vetoBtn = document.getElementById('coin-veto-btn');
  vetoBtn.disabled = true;
  vetoBtn.className = "px-3 py-1 bg-white/5 text-gray-500 border border-white/5 text-[10px] font-bold rounded-lg transition cursor-not-allowed";
  
  document.getElementById('coin-toss-verdict').innerText = coinLastOther;
  document.getElementById('coin-veto-countdown').innerText = "VETO EINGELEGT! 🛑";
  
  // Zeige den Lerneffekt an
  const deText = `Veto eingelegt! Du hast dich aktiv gegen den Zufall entschieden. Das beweist: Du wolltest insgeheim Option "${coinLastOther}"! Vertraue deinem Bauchgefühl.`;
  const enText = `Veto submitted! You actively decided against random chance. This proves: You secretly wanted Option "${coinLastOther}" all along! Trust your gut.`;
  
  showToast(currentLang === 'de' ? "Veto registriert!" : "Veto registered!");
  if (typeof playProceduralSound === 'function') playProceduralSound(0); // success chord
}

// --- TAB 2: WERTE-WAAGE LOGIK ---

function handleAddScaleArgument() {
  const textEl = document.getElementById('scale-add-text');
  const typeEl = document.getElementById('scale-add-type');
  const weightEl = document.getElementById('scale-add-weight');

  const text = textEl ? textEl.value.trim() : "";
  const type = typeEl ? typeEl.value : "pro";
  const weight = weightEl ? parseInt(weightEl.value) || 1 : 1;

  if (!text) {
    showToast(currentLang === 'de' ? "Bitte formuliere ein Argument!" : "Please write down an argument!");
    return;
  }

  scaleArguments.push({ text, type, weight });
  textEl.value = '';
  
  renderScaleArguments();
  recalculateScaleVerdict();
}

function renderScaleArguments() {
  const proList = document.getElementById('scale-pro-list');
  const conList = document.getElementById('scale-con-list');
  if (!proList || !conList) return;

  proList.innerHTML = '';
  conList.innerHTML = '';

  scaleArguments.forEach((arg, idx) => {
    const div = document.createElement('div');
    div.className = 'p-1.5 bg-black/40 border border-white/5 rounded-lg flex items-center justify-between gap-1 text-[10px] text-gray-200';
    div.innerHTML = `
      <span class="truncate flex-1 font-semibold">${arg.text} <span class="text-amber-400">(${"⭐".repeat(arg.weight)})</span></span>
      <button onclick="deleteScaleArgument(${idx})" class="p-0.5 text-gray-500 hover:text-red-400 transition cursor-pointer shrink-0"><i data-lucide="x" class="w-3 h-3"></i></button>
    `;
    if (arg.type === 'pro') proList.appendChild(div);
    else conList.appendChild(div);
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function deleteScaleArgument(idx) {
  scaleArguments.splice(idx, 1);
  renderScaleArguments();
  recalculateScaleVerdict();
}

function clearScaleMatrix() {
  scaleArguments = [];
  renderScaleArguments();
  recalculateScaleVerdict();
}

function recalculateScaleVerdict() {
  const box = document.getElementById('scale-verdict-box');
  const txt = document.getElementById('scale-verdict-text');
  if (!txt) return;

  if (scaleArguments.length === 0) {
    txt.innerText = currentLang === 'de' ? "Noch keine Argumente eingetragen." : "No arguments registered yet.";
    box.className = "p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-xs";
    return;
  }

  const proWeight = scaleArguments.filter(a => a.type === 'pro').reduce((sum, a) => sum + a.weight, 0);
  const conWeight = scaleArguments.filter(a => a.type === 'con').reduce((sum, a) => sum + a.weight, 0);

  if (proWeight > conWeight) {
    txt.innerText = currentLang === 'de' 
      ? `PRO überwiegt mit ${proWeight} zu ${conWeight} Sternen! 👍` 
      : `PRO outweighs with ${proWeight} to ${conWeight} stars! 👍`;
    box.className = "p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300 font-bold";
  } else if (conWeight > proWeight) {
    txt.innerText = currentLang === 'de' 
      ? `CONTRA überwiegt mit ${conWeight} zu ${proWeight} Sternen! 👎` 
      : `CONTRA outweighs with ${conWeight} to ${proWeight} stars! 👎`;
    box.className = "p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between text-xs text-rose-300 font-bold";
  } else {
    txt.innerText = currentLang === 'de' 
      ? `Gleichstand! Beide Seiten wiegen exakt ${proWeight} Sterne. ⚖️` 
      : `Tie! Both sides weigh exactly ${proWeight} stars. ⚖️`;
    box.className = "p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-300 font-bold";
  }
}

// --- TAB 3: LÖFFEL-CHECK (Spoon check) LOGIK ---

function handleAddSpoonOptionPrompt() {
  const name = prompt(currentLang === 'de' ? "Name des Vorhabens / der Aktivität:" : "Name of option/activity:");
  if (!name || !name.trim()) return;

  const energy = prompt(currentLang === 'de'
    ? "Benötigte Energie (1 = sehr niedrig/erholsam, 2 = normal, 3 = hoch, 4 = extrem hoch/überwältigend):"
    : "Energy required (1 = very low, 2 = normal, 3 = high, 4 = extremely high):", "2");
  const eVal = parseInt(energy) || 2;

  const energyMap = { 1: "low", 2: "med", 3: "high", 4: "overwhelmed" };
  const energyKey = energyMap[eVal] || "med";

  spoonOptions.push({ name: name.trim(), energy: energyKey });
  
  renderSpoonOptions();
  recalculateSpoonCheck();
}

function renderSpoonOptions() {
  const list = document.getElementById('spoon-options-list');
  if (!list) return;
  list.innerHTML = '';

  if (spoonOptions.length === 0) {
    list.innerHTML = `<div class="text-center text-gray-600 italic text-[10px] py-1">Noch keine Optionen eingetragen.</div>`;
    return;
  }

  const energyLabels = {
    low: currentLang === 'de' ? "Erholsam" : "Restorative",
    med: currentLang === 'de' ? "Normal" : "Normal",
    high: currentLang === 'de' ? "Anstrengend" : "Demanding",
    overwhelmed: currentLang === 'de' ? "Extrem zehrend" : "Overwhelming"
  };

  spoonOptions.forEach((opt, idx) => {
    const div = document.createElement('div');
    div.id = `spoon-option-row-${idx}`;
    div.className = 'p-2 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between gap-1.5 text-xs text-white';
    
    div.innerHTML = `
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <span id="spoon-badge-${idx}" class="shrink-0 font-bold text-[9px] px-2 py-0.5 rounded-full">Lade...</span>
        <span class="truncate font-semibold">${opt.name}</span>
        <span class="text-[9px] text-gray-500 font-bold shrink-0">(${energyLabels[opt.energy]})</span>
      </div>
      <button onclick="deleteSpoonOption(${idx})" class="p-1 text-gray-500 hover:text-rose-400 transition cursor-pointer shrink-0"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
    `;
    list.appendChild(div);
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function deleteSpoonOption(idx) {
  spoonOptions.splice(idx, 1);
  renderSpoonOptions();
  recalculateSpoonCheck();
}

function recalculateSpoonCheck() {
  if (spoonOptions.length === 0) {
    const vTxt = document.getElementById('spoon-verdict-text');
    if (vTxt) vTxt.innerText = currentLang === 'de' ? "Füge Optionen hinzu und wähle deine Energie aus!" : "Add options and select your energy budget!";
    return;
  }

  const batteryVal = document.getElementById('spoon-battery-select').value;
  
  // Energieranking: overwhelmed (4), high (3), med (2), low (1)
  const allowedMax = {
    high: 4,
    med: 2,
    low: 1,
    overwhelmed: 1
  }[batteryVal] || 4;

  const energyScore = { low: 1, med: 2, high: 3, overwhelmed: 4 };

  let allowedCount = 0;

  spoonOptions.forEach((opt, idx) => {
    const score = energyScore[opt.energy] || 2;
    const badge = document.getElementById(`spoon-badge-${idx}`);
    if (!badge) return;

    if (score <= allowedMax) {
      badge.innerText = currentLang === 'de' ? "Empfohlen ✅" : "Safe ✅";
      badge.className = "shrink-0 font-bold text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
      allowedCount++;
    } else {
      badge.innerText = currentLang === 'de' ? "Gesperrt ⚠️" : "Locked ⚠️";
      badge.className = "shrink-0 font-bold text-[9px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30";
    }
  });

  const vTxt = document.getElementById('spoon-verdict-text');
  if (vTxt) {
    if (batteryVal === 'overwhelmed') {
      vTxt.innerText = currentLang === 'de'
        ? "Du bist im roten Bereich (überreizt). Mache JETZT ausschließlich erholsame Dinge. Der Rest hat Pause!"
        : "You are overwhelmed. Do RESTORATIVE things only. Everything else can wait!";
    } else if (allowedCount === 0) {
      vTxt.innerText = currentLang === 'de'
        ? "Keine der eingetragenen Optionen passt zu deiner Energie. Gönne dir echte Ruhe!"
        : "None of the options match your energy. Please take a proper break!";
    } else {
      vTxt.innerText = currentLang === 'de'
        ? `Löffel-Check bereit: Du hast das Energiebudget für ${allowedCount} von ${spoonOptions.length} Vorhaben.`
        : `Spoon-Check ready: You have the energy budget for ${allowedCount} out of ${spoonOptions.length} activities.`;
    }
  }
}

// --- TAB 4 & TAB 5: SPEICHER LOGIK ---

function saveTenPerspective() {
  const m = document.getElementById('ten-input-mins').value.trim();
  const mo = document.getElementById('ten-input-months').value.trim();
  const y = document.getElementById('ten-input-years').value.trim();

  if (!m && !mo && !y) {
    showToast(currentLang === 'de' ? "Bitte trage mindestens eine Perspektive ein!" : "Please write down at least one perspective!");
    return;
  }

  if (typeof playProceduralSound === 'function') playProceduralSound(0); // success chord
  showToast(currentLang === 'de' ? "10-10-10-Perspektive erfolgreich gesichert! 💾" : "10-10-10 perspective successfully saved! 💾");
}

function saveFearSettingPerspective() {
  const w = document.getElementById('fear-worst').value.trim();
  const r = document.getElementById('fear-repair').value.trim();
  const i = document.getElementById('fear-inaction').value.trim();

  if (!w && !r && !i) {
    showToast(currentLang === 'de' ? "Bitte fülle die Angst-Analyse aus!" : "Please fill out the fear analysis first!");
    return;
  }

  if (typeof playProceduralSound === 'function') playProceduralSound(0); // success chord
  showToast(currentLang === 'de' ? "Angst-Analyse (Fear Setting) erfolgreich gesichert! 💾" : "Fear setting analysis successfully saved! 💾");
}

// --- SENSORISCHE REIZPAUSE MODAL LOGIK 🧘 ---

let safeSpaceBreathInterval = null;
let safeSpaceNoiseActive = false;

function openSafeSpaceModal() {
  document.getElementById('helper-safespace-modal').classList.remove('hidden');
  switchSafeSpaceTab('breath');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeSafeSpaceModal() {
  document.getElementById('helper-safespace-modal').classList.add('hidden');
  stopSafeSpaceBreathingCycle();
  if (safeSpaceNoiseActive) {
    toggleSafeSpaceNoise();
  }
}

function switchSafeSpaceTab(tabId) {
  const tabs = ['breath', 'anchor'];
  tabs.forEach(t => {
    const btn = document.getElementById(`safespace-tab-${t}`);
    const pane = document.getElementById(`safespace-pane-${t}`);
    if (btn && pane) {
      if (t === tabId) {
        btn.className = 'flex-1 py-1 px-2 rounded text-[var(--accent-light)] bg-[var(--accent)]/25 border border-[var(--accent)]/30 cursor-pointer font-bold text-center';
        pane.classList.remove('hidden');
      } else {
        btn.className = 'flex-1 py-1 px-2 rounded text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer text-center';
        pane.classList.add('hidden');
      }
    }
  });
  
  if (tabId === 'breath') {
    startSafeSpaceBreathingCycle();
  } else {
    stopSafeSpaceBreathingCycle();
    resetGroundingAnchor();
  }
}

function startSafeSpaceBreathingCycle() {
  stopSafeSpaceBreathingCycle();
  const circle = document.getElementById('safespace-breath-circle');
  const txt = document.getElementById('safespace-breath-text');
  if (!circle || !txt) return;

  let step = 0; // 0: einatmen, 1: halten, 2: ausatmen
  
  const runStep = () => {
    if (step === 0) {
      txt.innerText = currentLang === 'de' ? "Einatmen (4s)" : "Inhale (4s)";
      circle.style.transform = "scale3d(1.3, 1.3, 1)";
      circle.style.borderColor = "rgba(20, 184, 166, 0.8)";
      step = 1;
      safeSpaceBreathInterval = setTimeout(runStep, 4000);
    } else if (step === 1) {
      txt.innerText = currentLang === 'de' ? "Halten (7s)" : "Hold (7s)";
      circle.style.borderColor = "rgba(245, 158, 11, 0.8)";
      step = 2;
      safeSpaceBreathInterval = setTimeout(runStep, 7000);
    } else {
      txt.innerText = currentLang === 'de' ? "Ausatmen (8s)" : "Exhale (8s)";
      circle.style.transform = "scale3d(0.85, 0.85, 1)";
      circle.style.borderColor = "rgba(20, 184, 166, 0.4)";
      step = 0;
      safeSpaceBreathInterval = setTimeout(runStep, 8000);
    }
  };

  runStep();
}

function stopSafeSpaceBreathingCycle() {
  if (safeSpaceBreathInterval) {
    clearTimeout(safeSpaceBreathInterval);
    safeSpaceBreathInterval = null;
  }
}

function toggleSafeSpaceNoise() {
  safeSpaceNoiseActive = !safeSpaceNoiseActive;
  const btn = document.getElementById('safespace-noise-btn');
  if (!btn) return;

  if (safeSpaceNoiseActive) {
    btn.innerText = currentLang === 'de' ? "Stop 🔇" : "Stop 🔇";
    btn.className = "px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-[10px] font-bold rounded-lg transition cursor-pointer";
    if (typeof playAmbientSound === 'function') {
      playAmbientSound('rain', true); // prasselndes Regenrauschen
    }
  } else {
    btn.innerText = currentLang === 'de' ? "Start 🔊" : "Start 🔊";
    btn.className = "px-3 py-1.5 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-300 text-[10px] font-bold rounded-lg transition cursor-pointer";
    if (typeof stopAmbientSound === 'function') {
      stopAmbientSound(true);
    }
  }
}

// --- FOKUS-ANKER (5-4-3-2-1 GROUNDING METHODE) LOGIK ---

let anchorCurrentStep = 1;
const groundingStepsText = {
  de: [
    "Finde 5 Dinge in deiner Umgebung, die du sehen kannst. Lasse dir Zeit.",
    "Finde 4 Dinge um dich herum, die du physisch anfassen/spüren kannst (z.B. den Stuhl oder den Boden).",
    "Konzentriere dich auf 3 Geräusche, die du in diesem Moment hören kannst. Blende den Rest aus.",
    "Atme tief ein und finde 2 Dinge, die du riechen kannst (z.B. Kaffee, Kleidung oder frische Luft).",
    "Nenne 1 positive Eigenschaft, Stärke oder etwas Schönes an dir selbst."
  ],
  en: [
    "Find 5 things in your surroundings that you can see. Take your time.",
    "Find 4 things around you that you can physically touch/feel (e.g., your chair or the floor).",
    "Focus on 3 sounds that you can hear right in this moment. Block out the rest.",
    "Inhale deeply and identify 2 things you can smell (e.g., coffee, clothes, or fresh air).",
    "Acknowledge 1 positive trait, strength, or beautiful thing about yourself."
  ],
  es: [
    "Encuentra 5 cosas a tu alrededor que puedas ver. Tómate tu tiempo.",
    "Encuentra 4 cosas a tu alrededor que puedas tocar/sentir físicamente (ej. tu silla o el suelo).",
    "Concéntrate en 3 sonidos que puedas escuchar en este momento. Bloquea el resto.",
    "Inhala profundamente e identifica 2 cosas que puedas oler (ej. café, ropa o aire fresco).",
    "Reconoce 1 cualidad, fortaleza o cosa hermosa sobre ti mismo."
  ],
  el: [
    "Βρες 5 πράγματα γύρω σου που μπορείς να δεις. Πάρε τον χρόνο σου.",
    "Βρες 4 πράγματα γύρω σου που μπορείς να αγγίξεις/νιώσεις (π.χ. την καρέκλα ή το πάτωμα σου).",
    "Εστίασε σε 3 ήχους που μπορείς να ακούσεις αυτή τη στιγμή. Απομόνωσε τα υπόλοιπα.",
    "Είσπνευσε βαθιά και εντόπισε 2 πράγματα που μπορείς να μυρίσεις (π.χ. καφέ, ρούχα ή καθαρό αέρα).",
    "Αναγνώρισε 1 θετικό χαρακτηριστικό, δύναμη ή κάτι όμορφο στον εαυτό σου."
  ]
};

function resetGroundingAnchor() {
  anchorCurrentStep = 1;
  const steps = groundingStepsText[currentLang] || groundingStepsText['de'] || groundingStepsText['en'];
  document.getElementById('anchor-step-title').innerText = currentLang === 'de' ? "Schritt 1 von 5" : "Step 1 of 5";
  document.getElementById('anchor-step-instruction').innerText = steps[0];
  document.getElementById('anchor-progress-bar').style.width = "20%";
  document.getElementById('anchor-next-btn').classList.remove('hidden');
}

function nextAnchorStep() {
  anchorCurrentStep++;
  const steps = groundingStepsText[currentLang] || groundingStepsText['de'] || groundingStepsText['en'];
  
  if (anchorCurrentStep > 5) {
    // Übung erfolgreich beendet!
    document.getElementById('anchor-step-title').innerText = currentLang === 'de' ? "ÜBUNG BEENDET" : "EXERCISE FINISHED";
    document.getElementById('anchor-step-instruction').innerText = currentLang === 'de'
      ? "🎉 Wunderbar geerdet! Du bist wieder voll im Hier und Jetzt angekommen."
      : "🎉 Beautifully grounded! You are fully back in the present moment.";
    document.getElementById('anchor-progress-bar').style.width = "100%";
    document.getElementById('anchor-next-btn').classList.add('hidden');
    if (typeof playProceduralSound === 'function') playProceduralSound(0); // success chord
    return;
  }

  document.getElementById('anchor-step-title').innerText = currentLang === 'de' 
    ? `Schritt ${anchorCurrentStep} von 5` 
    : `Step ${anchorCurrentStep} of 5`;
  document.getElementById('anchor-step-instruction').innerText = steps[anchorCurrentStep - 1];
  document.getElementById('anchor-progress-bar').style.width = `${anchorCurrentStep * 20}%`;
  if (typeof playProceduralSound === 'function') playProceduralSound(3); // bubble pop sound
}

// --- SOCIAL SCRIPTING MODAL LOGIK 📜 ---

function openScriptingModal() {
  document.getElementById('helper-scripting-modal').classList.remove('hidden');
  document.getElementById('script-result-box').classList.add('hidden');
  onScenarioSelectChange();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeScriptingModal() {
  document.getElementById('helper-scripting-modal').classList.add('hidden');
}

function onScenarioSelectChange() {
  const scenario = document.getElementById('script-scenario-select').value;
  const fieldsContainer = document.getElementById('script-dynamic-fields');
  if (!fieldsContainer) return;
  fieldsContainer.innerHTML = '';

  if (scenario === 'doctor') {
    fieldsContainer.innerHTML = `
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[9px] text-gray-500 font-bold block mb-1">Fachrichtung (z.B. Zahnarzt)</label>
          <input type="text" id="field-doc-specialty" placeholder="Zahnarzt, Hausarzt..." value="Hausarzt" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
        <div>
          <label class="text-[9px] text-gray-500 font-bold block mb-1">Bevorzugter Zeitraum</label>
          <input type="text" id="field-doc-time" placeholder="Morgens, Nächste Woche..." value="Nächste Woche Montag" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
      </div>
    `;
  } else if (scenario === 'cancel') {
    fieldsContainer.innerHTML = `
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[9px] text-gray-500 font-bold block mb-1">Welcher Termin? (Name/Ort)</label>
          <input type="text" id="field-cancel-name" placeholder="Zahnarzttermin" value="Termin am Montag" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
        <div>
          <label class="text-[9px] text-gray-500 font-bold block mb-1">Grund (z.B. Krank, Verschiebung)</label>
          <input type="text" id="field-cancel-reason" placeholder="Krankheit, Terminüberschneidung..." value="akuter Krankheit" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
      </div>
    `;
  } else if (scenario === 'food') {
    fieldsContainer.innerHTML = `
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[9px] text-gray-500 font-bold block mb-1">Deine Bestellung (z.B. Pizza Salami)</label>
          <input type="text" id="field-food-order" value="1x Pizza Margherita und ein Spezi" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
        <div>
          <label class="text-[9px] text-gray-500 font-bold block mb-1">Deine Adresse (Straße / Hausnr.)</label>
          <input type="text" id="field-food-address" placeholder="Musterstraße 12" value="Schillerstraße 15" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
      </div>
    `;
  } else if (scenario === 'handyman') {
    fieldsContainer.innerHTML = `
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[9px] text-gray-500 font-bold block mb-1">Problem (z.B. Heizung kalt)</label>
          <input type="text" id="field-handyman-issue" value="Wasserhahn tropft stark" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
        <div>
          <label class="text-[9px] text-gray-500 font-bold block mb-1">Dringlichkeit</label>
          <input type="text" id="field-handyman-urgency" placeholder="Sehr dringend, diese Woche..." value="Diese Woche noch" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
      </div>
    `;
  } else if (scenario === 'custom') {
    fieldsContainer.innerHTML = `
      <div>
        <label class="text-[9px] text-gray-500 font-bold block mb-1">Eigene Stichpunkte / Vorgaben</label>
        <textarea id="field-custom-text" rows="3" placeholder="Ich möchte kündigen. Mein Vertrag läuft bis..." class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none resize-none leading-normal"></textarea>
      </div>
    `;
  }
}

function generateSocialScript() {
  const scenario = document.getElementById('script-scenario-select').value;
  const userName = document.getElementById('script-user-name').value.trim() || "Jannis";
  const textContainer = document.getElementById('script-text-container');
  if (!textContainer) return;

  let scriptText = "";

  if (scenario === 'doctor') {
    const spec = document.getElementById('field-doc-specialty').value.trim() || "Arzt";
    const time = document.getElementById('field-doc-time').value.trim() || "demnächst";
    scriptText = `„Guten Tag, mein Name ist ${userName}.\nIch würde gerne einen Termin bei Ihnen im Bereich ${spec} vereinbaren.\nHaben Sie freie Termine für ${time}?\n(Warte auf Antwort)\nMeine Daten lauten: ${userName}. Vielen Dank.“`;
  } else if (scenario === 'cancel') {
    const name = document.getElementById('field-cancel-name').value.trim() || "meinem Termin";
    const reason = document.getElementById('field-cancel-reason').value.trim() || "wichtigen Gründen";
    scriptText = `„Guten Tag, mein Name ist ${userName}.\nIch rufe an, weil ich leider ${name} absagen muss.\nDer Grund dafür ist eine ${reason}.\nWäre es möglich, den Termin stattdessen zu verschieben?\n(Warte auf Antwort)\nDanke für Ihr Verständnis.“`;
  } else if (scenario === 'food') {
    const order = document.getElementById('field-food-order').value.trim() || "etwas Essen";
    const addr = document.getElementById('field-food-address').value.trim() || "meine Adresse";
    scriptText = `„Hallo, ich würde gerne eine Bestellung zur Lieferung aufgeben.\nUnd zwar: ${order}.\n(Warte auf Bestätigung)\nGeliefert werden soll das an die folgende Adresse: ${addr}.\nKönnen Sie mir sagen, wie lange es ungefähr dauert?\n(Warte auf Antwort)\nSuper, vielen Dank. Auf Wiederhören.“`;
  } else if (scenario === 'handyman') {
    const issue = document.getElementById('field-handyman-issue').value.trim() || "einem Defekt";
    const urgency = document.getElementById('field-handyman-urgency').value.trim() || "demnächst";
    scriptText = `„Guten Tag, mein Name ist ${userName}.\nIn meiner Wohnung gibt es ein Problem: ${issue}.\nKönnten Sie einen Handwerker schicken, der sich das ansieht?\nEs wäre gut, wenn das ${urgency} klappen könnte.\n(Warte auf Antwort)\nMeine Telefonnummer für Rückfragen ist im System hinterlegt. Vielen Dank.“`;
  } else if (scenario === 'custom') {
    const custom = document.getElementById('field-custom-text').value.trim() || "Keine Vorgaben.";
    scriptText = `„Guten Tag, mein Name ist ${userName}.\n\n[DEINE STICHUNKTE FÜR DAS TELEFONAT]:\n${custom}“`;
  }

  textContainer.innerText = scriptText;
  document.getElementById('script-result-box').classList.remove('hidden');
  
  if (typeof playProceduralSound === 'function') playProceduralSound(0); // success chord
}

function copyGeneratedScript() {
  const container = document.getElementById('script-text-container');
  if (!container) return;

  navigator.clipboard.writeText(container.innerText).then(() => {
    showToast(currentLang === 'de' ? "Skript kopiert! 📋" : "Script copied! 📋");
  }).catch(err => {
    console.error("Fehler beim Kopieren:", err);
  });
}

// --- SENSORTANZPARTY FÜR BUTTONS (BEHOBEN) ---

let currentlyDancingButton = null;
let currentDanceClass = "";

function startGlobalButtonDanceParty() {
  const triggerDance = () => {
    try {
      // Tanz beim vorherigen Button beenden
      if (currentlyDancingButton) {
        currentlyDancingButton.classList.remove(currentDanceClass);
      }

      // Finde alle klickbaren Buttons im DOM, die aktiv sichtbar sind
      const buttons = Array.from(document.querySelectorAll('button:not(.modal-close-btn), [role="button"], .logo-dance'))
                           .filter(btn => btn.offsetWidth > 0 && btn.offsetHeight > 0);
      if (buttons.length === 0) return;

      // Zufälligen Button auswählen
      const randomButton = buttons[Math.floor(Math.random() * buttons.length)];
      
      // Zufällige Tanzanimation würfeln
      const danceClasses = [
        'animate-party-wobble',
        'animate-party-bounce',
        'animate-party-shiver',
        'animate-party-pulse',
        'animate-party-spin'
      ];
      const randomClass = danceClasses[Math.floor(Math.random() * danceClasses.length)];

      currentlyDancingButton = randomButton;
      currentDanceClass = randomClass;
      
      // Tanz starten
      randomButton.classList.add(randomClass);
    } catch (e) {
      console.error("Fehler beim globalen Button-Tanz:", e);
    }
  };

  // Erster Tanz sofort starten, danach alle 20 Sekunden rotieren
  triggerDance();
  setInterval(triggerDance, 20000);
}

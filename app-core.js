// app-core.js: Kernlogik (Theme, Sprache, Icons, UI-Verhalten). Uebersetzungsdaten siehe data-custom-translations.js

let currentZenTaskInfo = null; let lastSelectedSound = 'rain'; let draggedColumnId = null; let selectedCalendarDate = null; 

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

const INSPIRATION_SAYINGS = {
  de: [
    "Du musst eine Aufgabe nicht perfekt machen. Sie unvollständig zu erledigen, ist unendlich viel besser, als sie gar nicht zu tun.",
    "Wenn dir der Anfang schwerfällt, nimm dir vor, nur eine einzige Minute daran zu arbeiten. Danach darfst du jederzeit aufhören.",
    "Dein Gehirn ist ein Prozessor, kein Datenspeicher. Schreib den Gedanken auf, um wertvollen Arbeitsspeicher im Kopf freizugeben.",
    "Manchmal ist eine Pause kein Luxus, sondern eine notwendige Wartung deines Systems. Gönne dir diesen Moment ohne Schuldgefühle.",
    "Fehlentscheidungen sind nur Datenpunkte. Sie zeigen dir, was nicht funktioniert, und helfen dir, deinen Weg feinzujustieren."
  ],
  en: [
    "You don't have to do a task perfectly. Doing it incompletely is infinitely better than not doing it at all.",
    "If starting feels hard, plan to work on it for just one minute. You can stop at any time after that.",
    "Your brain is a storage device. Write thoughts down to free up valuable memory in your head.",
    "Sometimes a break isn't a luxury, but a necessary maintenance of your system. Enjoy this moment guilt-free.",
    "Mistakes are simply data points. They show you what doesn't work and help you fine-tune your own path."
  ],
  es: [
    "No tienes que hacer una tarea a la perfección. Hacerla de forma incompleta es infinitamente mejor que no hacerla en absoluto.",
    "Si empezar te cuesta, plantéate trabajar solo un minuto en ello. Después puedes parar cuando quieras.",
    "Tu cerebro es un procesador, no un almacén de datos. Escribe tus pensamientos para liberar memoria valiosa en tu mente.",
    "A veces un descanso no es un lujo, sino un mantenimiento necesario de tu sistema. Date ese momento sin sentir culpa.",
    "Los errores son solo datos. Te muestran qué no funciona y te ayudan a ajustar tu propio camino."
  ],
  el: [
    "Δεν χρειάζεται να κάνεις μια εργασία τέλεια. Το να την κάνεις ημιτελή είναι απείρως καλύτερο από το να μην την κάνεις καθόλου.",
    "Αν το ξεκίνημα σου φαίνεται δύσκολο, σκέψου να δουλέψεις πάνω της μόνο για ένα λεπτό. Μετά μπορείς να σταματήσεις όποτε θέλεις.",
    "Ο εγκέφαλός σου είναι επεξεργαστής, όχι αποθηκευτικός χώρος. Γράψε τις σκέψεις σου για να ελευθερώσεις πολύτιμη μνήμη στο μυαλό σου.",
    "Μερικές φορές ένα διάλειμμα δεν είναι πολυτέλεια, αλλά απαραίτητη συντήρηση του συστήματός σου. Χάρισε στον εαυτό σου αυτή τη στιγμή χωρίς ενοχές.",
    "Τα λάθη είναι απλώς δεδομένα. Σου δείχνουν τι δεν λειτουργεί και σε βοηθούν να βελτιώσεις τον δικό σου δρόμο."
  ],
  fr: [
    "Tu n'as pas besoin de faire une tâche à la perfection. La faire de façon incomplète est infiniment mieux que ne pas la faire du tout.",
    "Si commencer te semble difficile, prévois de n'y travailler qu'une seule minute. Ensuite, tu peux t'arrêter à tout moment.",
    "Ton cerveau est un processeur, pas un espace de stockage. Note tes pensées pour libérer de la mémoire précieuse dans ta tête.",
    "Parfois, une pause n'est pas un luxe, mais un entretien nécessaire de ton système. Offre-toi ce moment sans culpabilité.",
    "Les erreurs ne sont que des données. Elles te montrent ce qui ne fonctionne pas et t'aident à ajuster ton propre chemin."
  ],
  it: [
    "Non devi fare un'attività alla perfezione. Farla in modo incompleto è infinitamente meglio che non farla affatto.",
    "Se iniziare ti sembra difficile, prevedi di lavorarci solo per un minuto. Dopo puoi fermarti quando vuoi.",
    "Il tuo cervello è un processore, non uno spazio di archiviazione. Scrivi i tuoi pensieri per liberare memoria preziosa nella tua mente.",
    "A volte una pausa non è un lusso, ma una manutenzione necessaria del tuo sistema. Concediti questo momento senza sensi di colpa.",
    "Gli errori sono solo dati. Ti mostrano cosa non funziona e ti aiutano a perfezionare il tuo percorso."
  ]
};

function suggestInspirationQuote() {
  const list = INSPIRATION_SAYINGS[currentLang] || INSPIRATION_SAYINGS['de'] || INSPIRATION_SAYINGS['en'];
  const randomQuote = list[Math.floor(Math.random() * list.length)];
  const box = document.getElementById('inspiration-quote-box'); if (box) box.innerText = randomQuote;
}

function suggestBoostActivity() {
  const list = BOOST_ACTIVITIES[currentLang] || BOOST_ACTIVITIES['en'];
  const randomActivity = list[Math.floor(Math.random() * list.length)];
  const box = document.getElementById('boost-activity-box'); if (box) box.innerText = randomActivity;
}

function handleSoundsMainClick() { if (currentSoundType) stopAmbientSound(); else playAmbientSound(lastSelectedSound); }
function handleMusicMainClick() { if (playlistTracks.length === 0) document.getElementById('sound-file-input').click(); else togglePlaylistPlayback(); }

// PERFORMANCE-FIX: Dieser Observer lief bisher bei JEDER einzelnen DOM-Aenderung im gesamten
// <body> (z.B. jede Sekunde waehrend ein Timer laeuft, oder bei jedem Re-Render einer Liste)
// und durchsuchte dabei jedes Mal das komplette Dokument nach Buttons. Das ist der haeufigste
// Grund fuer spuerbare Ruckler bei Interaktionen. Jetzt werden mehrere Mutationen, die kurz
// hintereinander auftreten, zu maximal einem Scan pro Frame gebuendelt (per requestAnimationFrame).
// Das Ergebnis (welche Buttons am Ende "Erledigt" heissen) ist exakt identisch - es wird nur nicht
// mehr bei jeder einzelnen Mutation sofort und redundant neu gescannt.
let buttonSanitizerScanScheduled = false;
function runButtonSanitizerScan() {
  buttonSanitizerScanScheduled = false;
  document.querySelectorAll('button, [role="button"], .task-complete-btn span, #helper-pick-box button, #zen-chill-view button span').forEach(el => {
    const txt = el.innerText.trim();
    if (txt === 'Erledigen' || txt === 'Als erledigt markieren' || txt === 'als erledigt markieren') { el.innerText = 'Erledigt'; }
  });
}
const buttonSanitizerObserver = new MutationObserver(() => {
  if (buttonSanitizerScanScheduled) return;
  buttonSanitizerScanScheduled = true;
  requestAnimationFrame(runButtonSanitizerScan);
});
buttonSanitizerObserver.observe(document.body, { childList: true, subtree: true });

let activeDancingSpecialButton = 'whatnow'; let currentPremiumDanceIndex = 0;
const premiumDances = ['premium-glow-btn', 'animate-premium-heartbeat', 'animate-premium-orbit', 'animate-premium-float', 'animate-premium-shimmer'];

function rotatePremiumDance() {
  const activeBtn = activeDancingSpecialButton === 'whatnow' ? document.getElementById('btn-whatnow-dance') : document.getElementById('btn-focus-mode');
  const inactiveBtn = activeDancingSpecialButton === 'whatnow' ? document.getElementById('btn-focus-mode') : document.getElementById('btn-whatnow-dance');
  if (inactiveBtn) { premiumDances.forEach(c => inactiveBtn.classList.remove(c)); inactiveBtn.classList.add('bg-purple-500/10', 'border-purple-500/30'); }
  if (activeBtn) {
    premiumDances.forEach(c => activeBtn.classList.remove(c)); activeBtn.classList.remove('bg-purple-500/10', 'border-purple-500/30');
    currentPremiumDanceIndex = (currentPremiumDanceIndex + 1) % premiumDances.length; activeBtn.classList.add(premiumDances[currentPremiumDanceIndex]);
  }
}

document.addEventListener('keydown', (e) => {
  const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
  if (activeTag === 'input' || activeTag === 'textarea' || (document.activeElement && document.activeElement.isContentEditable)) {
    if (e.key === 'Escape') {
      document.activeElement.blur();
    }
    return;
  }

  const key = e.key.toLowerCase();
  switch(key) {
    case 'f':
      e.preventDefault();
      toggleMinimalist();
      break;
    case 't':
      e.preventDefault();
      toggleTimer();
      break;
    case 's':
      e.preventDefault();
      stopTimer();
      break;
    case 'w':
      e.preventDefault();
      openHelperModal('pick');
      break;
    case 'p':
      e.preventDefault();
      togglePanel('pause-dropdown');
      break;
    case 'k':
      e.preventDefault();
      togglePanel('cooking');
      break;
    case 'e':
      e.preventDefault();
      togglePanel('shopping');
      break;
    case 'u':
      e.preventDefault();
      handleUndo();
      break;
    case 'r':
      e.preventDefault();
      togglePanel('report');
      break;
    case 'b':
      e.preventDefault();
      togglePanel('boost');
      break;
    case 'i':
      e.preventDefault();
      togglePanel('inspiration');
      break;
    case 'c':
      e.preventDefault();
      openCompassModal();
      break;
    case 'o':
      e.preventDefault();
      openSportModal();
      break;
    case 'x':
      e.preventDefault();
      openScriptingModal();
      break;
    case 'h':
      e.preventDefault();
      togglePanel('logo-guide');
      break;
    case 'a':
      e.preventDefault();
      toggleTerminForm(true);
      break;
    case 'g':
      e.preventDefault();
      if (typeof toggleGameMode === 'function') toggleGameMode();
      break;
    case 'escape':
      e.preventDefault();
      if (typeof closeHelperModal === 'function') closeHelperModal();
      if (typeof closeSportModal === 'function') closeSportModal();
      if (typeof closeSafeSpaceModal === 'function') closeSafeSpaceModal();
      if (typeof closeCompassModal === 'function') closeCompassModal();
      if (typeof closeScriptingModal === 'function') closeScriptingModal();
      ['feedback', 'report', 'settings', 'soundscape', 'language', 'boost', 'music', 'sync', 'theme', 'calendar-dropdown', 'inspiration', 'shopping', 'cooking', 'pause-dropdown', 'logo-guide'].forEach(p => {
        const el = document.getElementById(`panel-${p}`);
        if (el) el.classList.add('hidden');
      });
      break;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  setTheme(currentTheme); setLanguage(currentLang);
  const iconEl = document.getElementById('zen-btn-icon'); const textEl = document.getElementById('minimal-mode-btn-text');
  if (isMinimalist) {
    document.body.classList.add('minimalist'); if (iconEl) iconEl.setAttribute('data-lucide', 'eye-off');
    if (textEl) textEl.innerText = t('standard_mode');
  } else {
    document.body.classList.remove('minimalist'); if (iconEl) iconEl.setAttribute('data-lucide', 'eye');
    if (textEl) textEl.innerText = t('minimal_mode');
  }
  updateDateAndStreak(); renderApp(); updateZenView(); populateHelperTaskSelect(); suggestBoostActivity(); suggestInspirationQuote(); checkAndGenerateAutomaticReports();
  const btnHeader = document.getElementById('timer-toggle-btn'); if (btnHeader) { btnHeader.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>'; }
  startGlobalButtonDanceParty(); rotatePremiumDance(); setInterval(rotatePremiumDance, 10000);
  setInterval(() => { activeDancingSpecialButton = activeDancingSpecialButton === 'whatnow' ? 'focus' : 'whatnow'; rotatePremiumDance(); }, 180000);
  if (typeof lucide !== 'undefined') lucide.createIcons();
});

// Gruppiert alle Farbschemata nach visueller Verwandtschaft, damit der automatische
// Wechsel nach erledigten Aufgaben immer zwischen ähnlichen Stimmungen bleibt.
const THEME_FAMILIES = {
  'purple-dreams': ['aurora', 'neon-cyber', 'synthwave'],
  'green-nature': ['sage', 'forest'],
  'warm-earthy': ['cozy', 'mono-hand', 'parchment', 'terracotta-light'],
  'cool-icy': ['architect', 'glacier', 'charcoal', 'minimalist-light', 'holo-chrome'],
  'luxury-mono': ['executive', 'carbon']
};

function getThemeFamily(theme) {
  for (const family in THEME_FAMILIES) {
    if (THEME_FAMILIES[family].includes(theme)) return family;
  }
  return null;
}

// Wählt ein zufälliges, aber verwandtes Farbschema zum aktuell aktiven aus
function getSimilarTheme(current) {
  const family = getThemeFamily(current);
  const allThemes = Object.values(THEME_FAMILIES).flat();
  const pool = family ? THEME_FAMILIES[family].filter(t => t !== current) : allThemes.filter(t => t !== current);
  if (pool.length === 0) return current;
  return pool[Math.floor(Math.random() * pool.length)];
}

function setTheme(theme) {
  currentTheme = theme; document.body.className = `h-full antialiased flex flex-col font-sans select-none overflow-x-hidden text-[#f4f4f5] theme-${theme}`;
  if (isMinimalist) document.body.classList.add('minimalist'); localStorage.setItem('flowPlannerTheme', theme);
}

// Sanfter, langsamer Farbwechsel (z.B. nach dem Erledigen einer Aufgabe): aktiviert kurzzeitig
// eine deutlich langsamere Übergangsdauer für den gesamten Seitenbaum und wechselt dann das Theme.
function setThemeSlow(theme) {
  setTheme(theme);
  // Erst NACH setTheme() hinzufügen, da setTheme() den kompletten className ersetzt
  document.body.classList.add('theme-fade-slow');
  setTimeout(() => {
    document.body.classList.remove('theme-fade-slow');
  }, 2600);
}

function setLanguage(lang) {
  if (!lang || !TRANSLATIONS[lang] || !DEFAULT_TASKS_BY_LANG[lang]) { lang = 'en'; }
  const oldLang = currentLang; currentLang = lang; localStorage.setItem('flowPlannerLanguage', lang);
  document.documentElement.lang = lang; translateUserTasks(oldLang, lang);
  const flagMap = { de: '🇩🇪', en: '🇬🇧', es: '🇪🇸', el: '🇬🇷', fr: '🇫🇷', it: '🇮🇹' };
  const flagEl = document.getElementById('active-lang-flag'); if (flagEl) flagEl.innerText = flagMap[lang] || '🇬🇧';
  translateUI(); const textEl = document.getElementById('minimal-mode-btn-text');
  if (textEl) { textEl.innerText = isMinimalist ? t('standard_mode') : t('minimal_mode'); }
  updateDateAndStreak(); renderApp(); updateZenView(); populateHelperTaskSelect();
}

function translateUI() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n'); if (targetTranslations[currentLang]?.[key]) el.innerText = targetTranslations[currentLang][key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder'); if (targetTranslations[currentLang]?.[key]) el.setAttribute('placeholder', targetTranslations[currentLang][key]);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title'); if (targetTranslations[currentLang]?.[key]) el.setAttribute('title', targetTranslations[currentLang][key]);
  });
}

function translateUserTasks(fromLang, toLang) {
  if (fromLang === toLang) return; if (!DEFAULT_TASKS_BY_LANG[fromLang] || !DEFAULT_TASKS_BY_LANG[toLang]) return;
  saveHistory(); const cats = ['daily', 'weekly', 'occasionally'];
  cats.forEach(cat => {
    if (!state.items[cat]) return;
    state.items[cat] = state.items[cat].map(taskItem => {
      const taskName = typeof taskItem === 'object' ? taskItem.task : taskItem;
      const fromList = DEFAULT_TASKS_BY_LANG[fromLang][cat]; const oList = DEFAULT_TASKS_BY_LANG[toLang][cat];
      const idx = fromList.indexOf(taskName);
      if (idx !== -1) { const nextVal = oList[idx]; return typeof taskItem === 'object' ? { ...taskItem, task: nextVal } : nextVal; }
      return taskItem;
    });
  });
  if (state.completedSteps) {
    const nextStepsObj = {};
    for (let key in state.completedSteps) {
      let updatedKey = key;
      cats.forEach(cat => {
        const fromList = DEFAULT_TASKS_BY_LANG[fromLang][cat]; const oList = DEFAULT_TASKS_BY_LANG[toLang][cat];
        const idx = fromList.indexOf(key); if (idx !== -1) updatedKey = oList[idx];
      });
      nextStepsObj[updatedKey] = state.completedSteps[key];
    }
    state.completedSteps = nextStepsObj;
  }
  saveState();
}

function toggleMinimalist() {
  isMinimalist = !isMinimalist; localStorage.setItem('flowPlannerMinimalist', String(isMinimalist));
  const iconEl = document.getElementById('zen-btn-icon'); const textEl = document.getElementById('minimal-mode-btn-text');
  if (isMinimalist) {
    document.body.classList.add('minimalist'); if (iconEl) iconEl.setAttribute('data-lucide', 'eye-off');
    if (textEl) textEl.innerText = t('standard_mode'); updateZenView();
  } else {
    document.body.classList.remove('minimalist'); if (iconEl) iconEl.setAttribute('data-lucide', 'eye');
    if (textEl) textEl.innerText = t('minimal_mode');
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
  showToast(isMinimalist ? t('minimal_mode') + " aktiv" : t('standard_mode') + " aktiv");
}

function toggleTerminForm(open, prefilledDate) {
  isTerminFormOpen = open !== undefined ? open : !isTerminFormOpen;
  if (prefilledDate) { selectedCalendarDate = prefilledDate; } else if (!isTerminFormOpen) { selectedCalendarDate = null; }
  renderApp();
  if (isTerminFormOpen) {
    setTimeout(() => { const inputTitle = document.getElementById('add-termin-title'); if (inputTitle) inputTitle.focus(); }, 50);
  }
}

function handleAddTermin() {
  const titleEl = document.getElementById('add-termin-title'); const locEl = document.getElementById('add-termin-location');
  const dateEl = document.getElementById('add-termin-date'); const timeEl = document.getElementById('add-termin-time');
  const title = titleEl ? titleEl.value.trim() : ''; const location = locEl ? locEl.value.trim() : '';
  const date = dateEl ? dateEl.value : ''; const time = timeEl ? timeEl.value : '';
  if (!title) { showToast(t('toast_appointment_name_error')); return; }
  saveHistory(); if (!state.items.termine) state.items.termine = [];
  state.items.termine.push({ task: title, date, time, location });
  isTerminFormOpen = false; selectedCalendarDate = null; saveState(); renderApp(); populateHelperTaskSelect();
  showToast(t('toast_appointment_saved'));
}

function getTaskIconDetails(taskText, category = '') {
  if (!taskText) return { icon: 'check-circle', color: 'text-purple-400' };
  if (typeof TASK_ICONS !== 'undefined' && TASK_ICONS[taskText]) return { icon: TASK_ICONS[taskText], color: 'text-purple-300' };
  const text = String(taskText).toLowerCase();
  const rules = [
    { rx: /medi|pill|medicin|tableta|vitam|pharmak|arzt|doctor|therap/, ic: 'pill', col: 'text-rose-400' },
    { rx: /zahn|dient|tooth|dent|toothb|dond|brush/, ic: 'smile', col: 'text-cyan-400' },
    { rx: /dusch|bath|shower|duch|ban|ntous|waschen|wash|hyg|gesicht/, ic: 'shower-head', col: 'text-sky-400' },
    { rx: /haare|hair|pelo|kour|fris/, ic: 'scissors', col: 'text-pink-400' },
    { rx: /nagel|nail|uñ|nych/, ic: 'sparkles', col: 'text-indigo-400' },
    { rx: /trink|wat|agu|ner|glass|hydration/, ic: 'glass-water', col: 'text-blue-400' },
    { rx: /bett|bed|cama|krevat/, ic: 'bed', col: 'text-amber-400' },
    { rx: /aufräum|tidy|orden|takto|clean|putz|organi/, ic: 'package', col: 'text-yellow-500' },
    { rx: /staub|dust|polv|xesk|fegen|sweep/, ic: 'feather', col: 'text-amber-300' },
    { rx: /saugen|vacu|aspir|skoupi/, ic: 'tornado', col: 'text-cyan-500' },
    { rx: /wisch|mop|freg|sfoug|droplets/, ic: 'droplets', col: 'text-sky-500' },
    { rx: /spül|dish|plat|piat/, ic: 'utensils', col: 'text-emerald-400' },
    { rx: /wasch|laund|colad|roux|clothes|wäsche/, ic: 'washing-machine', col: 'text-indigo-400' },
    { rx: /aufhäng|hang|colg|aplon/, ic: 'shirt', col: 'text-violet-400' },
    { rx: /klo|wc|toil|vater|lekan/, ic: 'toilet', col: 'text-teal-500' },
    { rx: /müll|trash|basur|skoupid|waste/, ic: 'trash-2', col: 'text-rose-500' },
    { rx: /pfand|bottle|envase|boukal|recycle/, ic: 'recycle', col: 'text-emerald-500' },
    { rx: /koch|food|cook|comid|cena|recept|magir|essen|lunch|dinner|breakfast|mahlzeit/, ic: 'cooking-pot', col: 'text-orange-400' },
    { rx: /einkauf|shop|compr|agor|supermarkt|store|kauf/, ic: 'shopping-cart', col: 'text-emerald-400' },
    { rx: /arbeit|work|trabaj|doul|job|office|schreiben|mail|call|anruf/, ic: 'briefcase', col: 'text-amber-500' },
    { rx: /les|book|libr|vivl|lernen|study/, ic: 'book-open', col: 'text-violet-400' },
    { rx: /sport|gym|fit|train|gymn|workout|run|laufen|gehen|walk/, ic: 'activity', col: 'text-green-400' },
    { rx: /paus|rest|desc|paus|relax|chill|medit|mindful/, ic: 'moon', col: 'text-indigo-300' },
    { rx: /luft|wind|vent|aer|lüften|breath/, ic: 'wind', col: 'text-cyan-300' }
  ];
  for (const r of rules) { if (r.rx.test(text)) return { icon: r.ic, color: r.col }; }
  const defaults = {
    daily: { icon: 'sun', color: 'text-amber-400' }, weekly: { icon: 'calendar-days', color: 'text-purple-400' },
    todo: { icon: 'list-todo', color: 'text-blue-400' }, done: { icon: 'check-circle', color: 'text-emerald-400' },
    termine: { icon: 'clock', color: 'text-amber-400' }, occasionally: { icon: 'calendar-range', color: 'text-pink-400' },
    notes: { icon: 'sticky-note', color: 'text-yellow-400' }
  };
  return defaults[category] || { icon: 'check-circle', color: 'text-purple-400' };
}

function getTaskIcon(taskText, category = '') { return getTaskIconDetails(taskText, category).icon; }

 
 

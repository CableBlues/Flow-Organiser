// CONFIGURATION KEYS AND GLOBAL STATE DEFINITIONS
let currentLang = localStorage.getItem('flowPlannerLanguage') || 'en';
let rawTheme = localStorage.getItem('flowPlannerTheme') || 'aurora';
let currentTheme = ['mono-hand', 'parchment', 'minimalist-light', 'terracotta-light'].includes(rawTheme) ? 'aurora' : rawTheme;
let isMinimalist = localStorage.getItem('flowPlannerMinimalist') === 'true';
let openTaskAddColumns = {};
let categoriesOrder = null;
let state = null;
let historyStack = [];

function loadCategoriesOrder() {
  try {
    const saved = localStorage.getItem('flowPlannerCategoriesOrder');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('[State] loadCategoriesOrder warning:', e);
  }
  
  // Standard-Layout
  return [
    ['daily', 'sun'],
    ['weekly', 'home'],
    ['todo', 'list-todo'],
    ['done', 'check-circle-2'],
    ['termine', 'calendar'],
    ['notes', 'file-text'],
    ['occasionally', 'clock']
  ];
}

function loadWorkCategoriesOrder() {
  try {
    const saved = localStorage.getItem('flowPlannerWorkCategoriesOrder');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('[State] loadWorkCategoriesOrder warning:', e);
  }
  
  return [
    ['work_focus', 'target'],
    ['work_in_progress', 'zap'],
    ['work_waiting', 'hourglass'],
    ['work_backlog', 'folder-kanban'],
    ['done', 'check-circle'],
    ['termine', 'clock'],
    ['notes', 'sticky-note']
  ];
}

let workCategoriesOrder = null;
const WORK_CATEGORIES_ORDER = [
  ['work_focus', 'target'],
  ['work_in_progress', 'zap'],
  ['work_waiting', 'hourglass'],
  ['work_backlog', 'folder-kanban'],
  ['done', 'check-circle'],
  ['termine', 'clock'],
  ['notes', 'sticky-note']
];

const DEFAULT_WORK_TASKS_BY_LANG = {
  de: {
    work_focus: ['Wichtigste Tagesaufgabe (Must-Do)', 'E-Mails & Prioritäten sortieren (15 Min.)'],
    work_in_progress: ['Projekt-Konzept ausarbeiten', 'Kundenanfrage beantworten'],
    work_waiting: ['Feedback von Kollege/Chef zu Entwurf', 'Angebot Freigabe Kunde A'],
    work_backlog: ['Dokumentation aktualisieren', 'Monatsbericht vorbereiten', 'Recherchen Q4'],
    termine: [],
    notes: ['Wichtige Links & Notizen zum aktuellen Sprint...']
  },
  en: {
    work_focus: ['Key priority of the day (Must-Do)', 'Sort emails & daily priorities (15 min)'],
    work_in_progress: ['Draft project concept', 'Answer client inquiry'],
    work_waiting: ['Waiting on design feedback', 'Client invoice approval'],
    work_backlog: ['Update documentation', 'Prepare monthly report', 'Q4 Research'],
    termine: [],
    notes: ['Key links & scratchpad for current sprint...']
  },
  es: {
    work_focus: ['Prioridad clave del día (Must-Do)', 'Revisar correos y prioridades'],
    work_in_progress: ['Elaborar concepto del proyecto', 'Responder consulta de cliente'],
    work_waiting: ['Esperando comentarios de diseño', 'Aprobación de factura'],
    work_backlog: ['Actualizar documentación', 'Preparar informe mensual'],
    termine: [],
    notes: ['Notas clave y enlaces del sprint...']
  },
  fr: {
    work_focus: ['Priorité clé du jour (Must-Do)', 'Trier les e-mails et priorités'],
    work_in_progress: ['Rédiger le concept du projet', 'Répondre à la demande client'],
    work_waiting: ['En attente du retour client', 'Validation du devis'],
    work_backlog: ['Mettre à jour la documentation', 'Préparer le rapport mensuel'],
    termine: [],
    notes: ['Notes et liens importants...']
  },
  it: {
    work_focus: ['Priorità chiave del giorno (Must-Do)', 'Controllare email e priorità'],
    work_in_progress: ['Sviluppare concetto del progetto', 'Rispondere alla richiesta del cliente'],
    work_waiting: ['In attesa di feedback', 'Approvazione preventivo'],
    work_backlog: ['Aggiornare documentazione', 'Preparare report mensile'],
    termine: [],
    notes: ['Note e link importanti...']
  },
  el: {
    work_focus: ['Κύρια προτεραιότητα ημέρας (Must-Do)', 'Έλεγχος email & προτεραιοτήτων'],
    work_in_progress: ['Σύνταξη σχεδίου έργου', 'Απάντηση σε αίτημα πελάτη'],
    work_waiting: ['Αναμονή για σχόλια', 'Έγκριση προσφοράς'],
    work_backlog: ['Ενημέρωση τεκμηρίωσης', 'Προετοιμασία μηνιαίας αναφοράς'],
    termine: [],
    notes: ['Σημειώσεις & σύνδεσμοι...']
  }
};

function createDefaultWorkItems(lang) {
  const curL = lang || (typeof currentLang !== 'undefined' ? currentLang : 'de');
  const defaults = DEFAULT_WORK_TASKS_BY_LANG[curL] || DEFAULT_WORK_TASKS_BY_LANG['de'];
  return {
    work_focus: [...defaults.work_focus],
    work_in_progress: [...defaults.work_in_progress],
    work_waiting: [...defaults.work_waiting],
    work_backlog: [...defaults.work_backlog],
    termine: [],
    notes: [...defaults.notes]
  };
}

function createDefaultCookingState() {
  return {
    pantryItems: [],
    recipes: [
      {
        id: 'pasta-tomate',
        title: 'Schnelle Tomaten-Pasta',
        duration: '15 Min',
        ingredients: ['Pasta', 'Tomaten', 'Knoblauch', 'Olivenöl', 'Basilikum'],
        steps: ['Wasser aufkochen und die Pasta darin garen.', 'Tomaten mit Knoblauch in Öl anschwitzen.', 'Pasta mit den Tomaten vermengen und mit Basilikum servieren.']
      },
      {
        id: 'wrap-huhn',
        title: 'Wrap mit Hähnchen und Gemüse',
        duration: '20 Min',
        ingredients: ['Wraps', 'Hähnchen', 'Salat', 'Gurke', 'Joghurt'],
        steps: ['Hähnchen kurz erwärmen.', 'Salat und Gurke vorbereiten.', 'Alles in den Wrap geben und mit Joghurt abschließen.']
      },
      {
        id: 'omelette',
        title: 'Frühstücks-Omelett',
        duration: '10 Min',
        ingredients: ['Eier', 'Käse', 'Spinat', 'Pfeffer', 'Salz'],
        steps: ['Eier verquirlen und würzen.', 'Spinat kurz in der Pfanne andünsten.', 'Eier hinzugeben, mit Käse füllen und zusammenklappen.']
      },
      {
        id: 'linsen-suppe',
        title: 'Schnelle Linsensuppe',
        duration: '25 Min',
        ingredients: ['Linsen', 'Karotten', 'Zwiebel', 'Gemüsebrühe', 'Kräuter'],
        steps: ['Zwiebel und Karotten anschwitzen.', 'Linsen und Brühe dazugeben und köcheln lassen.', 'Mit Kräutern würzen und servieren.']
      }
    ],
    activeRecipeId: null,
    activeRecipe: null
  };
}

function saveCategoriesOrder() {
  if (state && state.activeWorkspace === 'work') {
    localStorage.setItem('flowPlannerWorkCategoriesOrder', JSON.stringify(workCategoriesOrder || WORK_CATEGORIES_ORDER));
  } else {
    localStorage.setItem('flowPlannerCategoriesOrder', JSON.stringify(categoriesOrder));
  }
}

function migrateState(raw, lang) {
  const currentL = lang || (typeof currentLang !== 'undefined' ? currentLang : 'en');
  const localizedDefaults = (typeof DEFAULT_TASKS_BY_LANG !== 'undefined' && DEFAULT_TASKS_BY_LANG[currentL]) 
    ? DEFAULT_TASKS_BY_LANG[currentL] 
    : ((typeof DEFAULT_TASKS_BY_LANG !== 'undefined' && DEFAULT_TASKS_BY_LANG['en']) ? DEFAULT_TASKS_BY_LANG['en'] : { daily: [], weekly: [], occasionally: [] });
  const todayStr = new Date().toISOString().split('T')[0];

  if (!raw || typeof raw !== 'object') {
    return {
      version: 3,
      lastDate: todayStr,
      activeWorkspace: 'private',
      items: {
        daily: [...(localizedDefaults.daily || [])],
        weekly: [...(localizedDefaults.weekly || [])],
        occasionally: [...(localizedDefaults.occasionally || [])],
        todo: [],
        termine: [],
        notes: []
      },
      done: [],
      archive: [],
      streak: 0,
      completedSteps: {},
      customSteps: {},
      workItems: typeof createDefaultWorkItems === 'function' ? createDefaultWorkItems(currentL) : {},
      workDone: [],
      sampleBannerDismissed: false,
      shoppingList: [],
      shoppingHistory: [],
      cooking: typeof createDefaultCookingState === 'function' ? createDefaultCookingState() : {},
      clarity: { streakDays: 0, lastCheckinDate: null, history: [], savedReasons: [] }
    };
  }

  const s = { ...raw };
  s.version = 3;
  if (!s.lastDate) s.lastDate = todayStr;

  // 1. Items normalisieren
  if (!s.items || typeof s.items !== 'object') {
    s.items = {
      daily: [...(localizedDefaults.daily || [])],
      weekly: [...(localizedDefaults.weekly || [])],
      occasionally: [...(localizedDefaults.occasionally || [])],
      todo: [],
      termine: [],
      notes: []
    };
  } else {
    ['daily', 'weekly', 'occasionally', 'todo', 'termine'].forEach(k => {
      if (!Array.isArray(s.items[k])) s.items[k] = [];
    });
    if (typeof s.items.notes === 'string') {
      s.items.notes = s.items.notes.split('\n').map(x => x.trim()).filter(Boolean);
    } else if (!Array.isArray(s.items.notes)) {
      s.items.notes = [];
    }
  }

  // 2. Arrays & Basis-Eigenschaften
  if (!Array.isArray(s.done)) s.done = [];
  if (!Array.isArray(s.archive)) s.archive = [];
  if (typeof s.streak !== 'number') s.streak = 0;
  if (!s.completedSteps || typeof s.completedSteps !== 'object') s.completedSteps = {};
  if (!s.customSteps || typeof s.customSteps !== 'object') s.customSteps = {};
  if (s.sampleBannerDismissed === undefined) s.sampleBannerDismissed = false;

  // 3. Workspaces
  s.activeWorkspace = (s.activeWorkspace === 'work') ? 'work' : 'private';
  if (!s.workItems || typeof s.workItems !== 'object') {
    s.workItems = typeof createDefaultWorkItems === 'function' ? createDefaultWorkItems(currentL) : {};
  } else {
    ['work_focus', 'work_in_progress', 'work_waiting', 'work_backlog', 'termine', 'notes'].forEach(k => {
      if (!Array.isArray(s.workItems[k])) s.workItems[k] = [];
    });
  }
  if (!Array.isArray(s.workDone)) s.workDone = [];

  // 4. Shopping & Cooking
  if (!Array.isArray(s.shoppingList)) s.shoppingList = [];
  if (!Array.isArray(s.shoppingHistory)) s.shoppingHistory = [];
  if (!s.cooking || typeof s.cooking !== 'object') {
    s.cooking = typeof createDefaultCookingState === 'function' ? createDefaultCookingState() : {};
  } else {
    s.cooking = {
      pantryItems: Array.isArray(s.cooking.pantryItems) ? s.cooking.pantryItems : [],
      recipes: Array.isArray(s.cooking.recipes) && s.cooking.recipes.length ? s.cooking.recipes : (typeof createDefaultCookingState === 'function' ? createDefaultCookingState().recipes : []),
      activeRecipeId: s.cooking.activeRecipeId || null,
      activeRecipe: s.cooking.activeRecipe || null
    };
  }

  // 5. Clarity
  if (!s.clarity || typeof s.clarity !== 'object') {
    s.clarity = { streakDays: 0, lastCheckinDate: null, history: [], savedReasons: [] };
  } else {
    s.clarity.streakDays = s.clarity.streakDays || 0;
    s.clarity.lastCheckinDate = s.clarity.lastCheckinDate || null;
    s.clarity.history = Array.isArray(s.clarity.history) ? s.clarity.history : [];
    s.clarity.savedReasons = Array.isArray(s.clarity.savedReasons) ? s.clarity.savedReasons : [];
  }

  // 6. Deduplizierung daily tasks (Face washing terms)
  if (Array.isArray(s.items.daily)) {
    const faceWashingTerms = [
      'Gesicht waschen', 'Wash face', 'Lavarse la cara', 
      'Πλύσιμο προσώπου', 'Se laver le visage', 'Lavarsi la faccia'
    ];
    let foundFace = false;
    s.items.daily = s.items.daily.filter(item => {
      const taskName = typeof item === 'object' ? item.task : item;
      if (faceWashingTerms.includes(taskName)) {
        if (foundFace) return false;
        foundFace = true;
        return true;
      }
      return true;
    });
  }

  // 7. Migration für Waschbecken & Spiegelschrank putzen
  const renameOldTask = (list) => {
    if (!Array.isArray(list)) return;
    list.forEach((item, i) => {
      if (typeof item === 'string' && item === 'Waschbecken & Spiegelschrank') {
        list[i] = 'Waschbecken & Spiegelschrank putzen';
      } else if (typeof item === 'object' && item && item.task === 'Waschbecken & Spiegelschrank') {
        item.task = 'Waschbecken & Spiegelschrank putzen';
      }
    });
  };
  if (s.items) {
    Object.values(s.items).forEach(renameOldTask);
  }
  if (s.workspaces) {
    Object.values(s.workspaces).forEach(ws => {
      if (ws && ws.items) Object.values(ws.items).forEach(renameOldTask);
    });
  }

  return s;
}
window.migrateState = migrateState;

function loadState() {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed) {
        return migrateState(parsed, typeof currentLang !== 'undefined' ? currentLang : 'de');
      }
    }
  } catch (e) {
    console.warn('[State] loadState parse warning, returning migrated defaults:', e);
  }
  return migrateState(null, typeof currentLang !== 'undefined' ? currentLang : 'de');
}

function setWorkspace(mode) {
  if (mode !== 'private' && mode !== 'work') return;
  state.activeWorkspace = mode;
  saveState();
  updateWorkspaceSwitchUI();
  if (typeof renderApp === 'function') renderApp();
  if (typeof populateHelperTaskSelect === 'function') populateHelperTaskSelect();
  if (typeof showToast === 'function') {
    showToast(mode === 'work' ? tr({
      de: '💼 Arbeitsmodus aktiviert!',
      en: '💼 Work mode activated!',
      es: '💼 ¡Modo trabajo activado!',
      el: '💼 Ενεργοποιήθηκε ο χώρος εργασίας!',
      fr: '💼 Mode travail activé !',
      it: '💼 Modalità lavoro attivata!'
    }) : tr({
      de: '🏠 Privatmodus aktiviert!',
      en: '🏠 Personal mode activated!',
      es: '🏠 ¡Modo personal activado!',
      el: '🏠 Ενεργοποιήθηκε ο προσωπικός χώρος!',
      fr: '🏠 Mode personnel activé !',
      it: '🏠 Modalità personale attivata!'
    }));
  }
}
window.setWorkspace = setWorkspace;

function toggleWorkspace() {
  const nextMode = (state && state.activeWorkspace === 'work') ? 'private' : 'work';
  setWorkspace(nextMode);
}
window.toggleWorkspace = toggleWorkspace;

function updateWorkspaceSwitchUI() {
  const currentWs = (state && state.activeWorkspace) ? state.activeWorkspace : 'private';
  const toggleBtn = document.getElementById('btn-workspace-toggle');
  const iconEl = document.getElementById('ws-toggle-icon');
  const textEl = document.getElementById('ws-toggle-text');
  
  if (toggleBtn && iconEl && textEl) {
    if (currentWs === 'work') {
      iconEl.textContent = '💼';
      textEl.textContent = t('workspace_work');
      textEl.className = 'text-[11px] font-bold text-blue-300';
      toggleBtn.className = 'h-8 px-2.5 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 hover:border-blue-500/60 rounded-xl text-blue-200 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all duration-300 shadow-sm';
      toggleBtn.title = tr({
        de: 'Arbeitsmodus aktiv (Klick zum Wechseln in Privatmodus)',
        en: 'Work mode active (Click to switch to personal mode)',
        es: 'Modo trabajo activo (Clic para cambiar a personal)',
        el: 'Χώρος εργασίας ενεργός (Κλικ για εναλλαγή)',
        fr: 'Mode travail actif (Cliquer pour passer en personnel)',
        it: 'Modalità lavoro attiva (Clicca per passare a personale)'
      });
    } else {
      iconEl.textContent = '🏠';
      textEl.textContent = t('workspace_private');
      textEl.className = 'text-[11px] font-bold text-purple-300';
      toggleBtn.className = 'h-8 px-2.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 hover:border-purple-500/50 rounded-xl text-purple-200 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all duration-300 shadow-sm';
      toggleBtn.title = tr({
        de: 'Privatmodus aktiv (Klick zum Wechseln in Arbeitsmodus)',
        en: 'Personal mode active (Click to switch to work mode)',
        es: 'Modo personal activo (Clic para cambiar a trabajo)',
        el: 'Προσωπικός χώρος ενεργός (Κλικ για εναλλαγή)',
        fr: 'Mode personnel actif (Cliquer pour passer en travail)',
        it: 'Modalità personale attiva (Clicca per passare a lavoro)'
      });
    }
  }
}
window.updateWorkspaceSwitchUI = updateWorkspaceSwitchUI;

function loadHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('[State] loadHistory warning:', e);
  }
  return [];
}

// Initialisierung nach Definition aller Konstruktoren und Konstanten
categoriesOrder = loadCategoriesOrder();
workCategoriesOrder = loadWorkCategoriesOrder();
state = loadState();
historyStack = loadHistory();

// PERFORMANCE-FIX: saveState() wurde bisher bei JEDEM Aufruf (42 Stellen im Code) zusaetzlich
// den kompletten historyStack (bis zu 20 volle State-Kopien) neu serialisiert und geschrieben,
// obwohl sich die History in den allermeisten dieser Faelle gar nicht geaendert hatte. Das
// blockierte den Main-Thread unnoetig bei jeder kleinen Aktion (Task abhaken, Item hinzufuegen...).
// Jetzt wird die History nur noch dann persistiert, wenn sie sich tatsaechlich aendert
// (saveHistory() / handleUndo()). Das Endergebnis in localStorage ist zu jedem Zeitpunkt exakt
// identisch zu vorher - nur die Anzahl unnoetiger Schreibvorgaenge sinkt drastisch.
let syncEngineDebounceTimer = null;

function saveState(skipP2PSync = false) {
  const currentState = (typeof window !== 'undefined' && window.state) ? window.state : state;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(currentState));
  } catch (e) {
    console.warn('[State] Storage quota exceeded or write failed, attempting emergency trim:', e);
    try {
      if (currentState && Array.isArray(currentState.archive) && currentState.archive.length > 50) {
        currentState.archive.splice(0, currentState.archive.length - 30);
      }
      if (currentState && Array.isArray(currentState.shoppingHistory) && currentState.shoppingHistory.length > 50) {
        currentState.shoppingHistory.splice(0, currentState.shoppingHistory.length - 30);
      }
      localStorage.setItem(STORE_KEY, JSON.stringify(currentState));
    } catch (err) {
      console.error('[State] Critical failure writing state to localStorage:', err);
    }
  }
  if (!skipP2PSync && typeof p2pSyncEngine !== 'undefined' && p2pSyncEngine.isConnected()) {
    p2pSyncEngine.broadcastStateUpdate();
  }
  if (!skipP2PSync && typeof cloudSyncEngine !== 'undefined' && typeof FlowAuth !== 'undefined' && FlowAuth.isLoggedIn()) {
    cloudSyncEngine.triggerAutoPush();
  }
}

function persistHistory() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(historyStack));
}

function saveHistory() {
  historyStack.push(JSON.parse(JSON.stringify(state)));
  if (historyStack.length > 20) historyStack.shift();
  persistHistory();
}

function t(key) {
  return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS['en']?.[key] || TRANSLATIONS['de']?.[key] || key;
}

// Kleiner Helfer für lokale, funktionsnahe Textbausteine (Toasts, Inline-Labels),
// die nicht Teil des globalen TRANSLATIONS-Wörterbuchs sind.
// Nutzung: tr({ en: '...', de: '...', fr: '...', it: '...', es: '...', el: '...' })
function tr(map) {
  return map[currentLang] || map.en || map.de || Object.values(map)[0] || '';
}

function getGermanStandardKey(taskName) {
  const cats = ['daily', 'weekly', 'occasionally'];
  for (const cat of cats) {
    for (const lang of ['de', 'en', 'es', 'el', 'fr', 'it']) {
      const list = DEFAULT_TASKS_BY_LANG[lang][cat];
      const idx = list.indexOf(taskName);
      if (idx !== -1) {
        return DEFAULT_TASKS_BY_LANG['de'][cat][idx];
      }
    }
  }
  return taskName;
}

function handleUndo() {
  if (historyStack.length === 0) {
    showToast(t('toast_no_undo'));
    return;
  }
  state = historyStack.pop();
  persistHistory();
  saveState();
  showToast(t('toast_undo_applied'));
  renderApp();
  populateHelperTaskSelect();
}

function handleReset() {
  const confirmMsg = tr({
    de: 'Möchtest du den gesamten Plan wirklich zurücksetzen?',
    en: 'Do you really want to reset your entire plan?',
    fr: 'Veux-tu vraiment réinitialiser tout le plan ?',
    it: 'Vuoi davvero reimpostare l\'intero piano?',
    es: '¿Seguro que quieres reiniciar todo el plan?',
    el: 'Θέλεις πραγματικά να επαναφέρεις ολόκληρο το πλάνο σου;'
  });
  
  if (confirm(confirmMsg)) {
    saveHistory();
    const localizedDefaults = DEFAULT_TASKS_BY_LANG[currentLang] || DEFAULT_TASKS_BY_LANG['en'] || DEFAULT_TASKS_BY_LANG['de'];
    state = {
      version: 3, lastDate: new Date().toISOString().split('T')[0],
      items: { daily: [...localizedDefaults.daily], weekly: [...localizedDefaults.weekly], occasionally: [...localizedDefaults.occasionally], todo: [], termine: [], notes: [] },
      done: [], archive: [], streak: 0, completedSteps: {}, customSteps: {},
      shoppingList: [], shoppingHistory: [],
      cooking: createDefaultCookingState(),
      clarity: { streakDays: 0, lastCheckinDate: null, history: [], savedReasons: [] }
    };
    
    categoriesOrder = [
      ['daily', 'sun'],
      ['weekly', 'calendar-days'],
      ['todo', 'list-todo'],
      ['done', 'check-circle'],
      ['termine', 'clock'],
      ['notes', 'sticky-note'],
      ['occasionally', 'calendar-range']
    ];
    saveCategoriesOrder();
    saveState();
    
    showToast(t('toast_reset_success'));
    renderApp();
    populateHelperTaskSelect();
  }
}

function handleSaveJson() {
  const today = state.lastDate || new Date().toISOString().split('T')[0];
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `flow-backup-${today}.json`; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast(tr({
    de: 'Backup erfolgreich heruntergeladen 💾',
    en: 'Backup successfully exported 💾',
    fr: 'Sauvegarde exportée avec succès 💾',
    it: 'Backup esportato con successo 💾',
    es: 'Copia de seguridad exportada con éxito 💾',
    el: 'Το αντίγραφο ασφαλείας εξήχθη επιτυχώς 💾'
  }));
}

function handleOpenFile(e) {
  const file = e.target.files?.[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (imported) {
        saveHistory();
        state = migrateState(imported, typeof currentLang !== 'undefined' ? currentLang : 'de');
        saveState();
        showToast(t('toast_import_success'));
        renderApp();
        populateHelperTaskSelect();
      }
    } catch(err) { alert(t('toast_import_error')); }
  };
  reader.readAsText(file);
}

function convertNoteToTask(noteIndex, targetCategory = 'todo', event) {
  if (event) event.stopPropagation();
  if (!state.items.notes || !state.items.notes[noteIndex]) return;
  saveHistory();
  const [noteItem] = state.items.notes.splice(noteIndex, 1);
  const noteText = typeof noteItem === 'object' ? noteItem.task : noteItem;
  if (!state.items[targetCategory]) state.items[targetCategory] = [];
  state.items[targetCategory].push(noteText);
  saveState();
  showToast(tr({
    de: `Notiz in "${t(targetCategory)}" umgewandelt! ✨`,
    en: `Note converted to "${t(targetCategory)}"! ✨`,
    es: `¡Nota convertida a "${t(targetCategory)}"! ✨`,
    el: `Η σημείωση μετατράπηκε σε "${t(targetCategory)}"! ✨`,
    fr: `Note convertie en "${t(targetCategory)}" ! ✨`,
    it: `Nota convertita in "${t(targetCategory)}"! ✨`
  }));
  renderApp();
  populateHelperTaskSelect();
}

function copyNoteText(noteIndex, event) {
  if (event) event.stopPropagation();
  if (!state.items.notes || !state.items.notes[noteIndex]) return;
  const noteItem = state.items.notes[noteIndex];
  const noteText = typeof noteItem === 'object' ? noteItem.task : noteItem;
  navigator.clipboard?.writeText(noteText).then(() => {
    showToast(tr({
      de: 'Notiz in Zwischenablage kopiert! 📋',
      en: 'Note copied to clipboard! 📋',
      es: '¡Nota copiada al portapapeles! 📋',
      el: 'Η σημείωση αντιγράφηκε στο πρόχειρο! 📋',
      fr: 'Note copiée dans le presse-papiers ! 📋',
      it: 'Nota copiata negli appunti! 📋'
    }));
  }).catch(() => {});
}

if (typeof window !== 'undefined') {
  window.saveState = saveState;
  window.loadState = loadState;
  window.saveHistory = saveHistory;
  window.loadHistory = loadHistory;
  window.migrateState = migrateState;
  window.handleUndo = handleUndo;
  window.t = t;
  window.tr = tr;
}
if (typeof globalThis !== 'undefined') {
  globalThis.saveState = saveState;
  globalThis.loadState = loadState;
  globalThis.saveHistory = saveHistory;
  globalThis.loadHistory = loadHistory;
  globalThis.migrateState = migrateState;
  globalThis.handleUndo = handleUndo;
  globalThis.t = t;
  globalThis.tr = tr;
}

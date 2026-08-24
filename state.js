// CONFIGURATION KEYS AND GLOBAL STATE DEFINITIONS
let state = loadState();
let historyStack = loadHistory();
let currentLang = localStorage.getItem('flowPlannerLanguage') || 'en';
let rawTheme = localStorage.getItem('flowPlannerTheme') || 'aurora';
let currentTheme = ['mono-hand', 'parchment', 'minimalist-light', 'terracotta-light'].includes(rawTheme) ? 'aurora' : rawTheme;
let isMinimalist = localStorage.getItem('flowPlannerMinimalist') === 'true';
let isTerminFormOpen = false;
// Merkt sich pro Kategorie (id), ob gerade das Eingabefeld fuer "Aufgabe hinzufuegen" offen ist
// (statt eines Buttons mit klarem Text) - analog zu isTerminFormOpen bei Terminen.
let openTaskAddColumns = {};

// Dynamische und persistente Verwaltung der Spaltenreihenfolge
let categoriesOrder = loadCategoriesOrder();

function loadCategoriesOrder() {
  try {
    const saved = localStorage.getItem('flowPlannerCategoriesOrder');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  
  // Standard-Layout
  return [
    ['daily', 'sun'],
    ['weekly', 'calendar-days'],
    ['todo', 'list-todo'],
    ['done', 'check-circle'],
    ['termine', 'clock'],
    ['notes', 'sticky-note'],
    ['occasionally', 'calendar-range']
  ];
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
  localStorage.setItem('flowPlannerCategoriesOrder', JSON.stringify(categoriesOrder));
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.items) {
        if (typeof parsed.items.notes === 'string') {
          parsed.items.notes = parsed.items.notes.split('\n').map(s => s.trim()).filter(Boolean);
        } else if (!Array.isArray(parsed.items.notes)) {
          parsed.items.notes = [];
        }
        if (parsed.streak === undefined) parsed.streak = 0;
        if (!parsed.completedSteps) parsed.completedSteps = {};
        if (!parsed.customSteps) parsed.customSteps = {};
        if (parsed.sampleBannerDismissed === undefined) parsed.sampleBannerDismissed = false;
        
        // Absicherung für Einkaufsliste & Protokoll im geladenen Zustand
        if (!parsed.shoppingList) parsed.shoppingList = [];
        if (!parsed.shoppingHistory) parsed.shoppingHistory = [];
        if (!parsed.cooking) {
          parsed.cooking = createDefaultCookingState();
        } else {
          parsed.cooking = {
            pantryItems: Array.isArray(parsed.cooking.pantryItems) ? parsed.cooking.pantryItems : [],
            recipes: Array.isArray(parsed.cooking.recipes) && parsed.cooking.recipes.length ? parsed.cooking.recipes : createDefaultCookingState().recipes,
            activeRecipeId: parsed.cooking.activeRecipeId || null,
            activeRecipe: parsed.cooking.activeRecipe || null
          };
        }
        
        // Deduplizierung: Falls sowohl 'Gesicht waschen' als auch 'Wash face' oder andere Sprachvarianten in daily liegen
        if (parsed.items && Array.isArray(parsed.items.daily)) {
          const faceWashingTerms = [
            'Gesicht waschen', 'Wash face', 'Lavarse la cara', 
            'Πλύσιμο προσώπου', 'Se laver le visage', 'Lavarsi la faccia'
          ];
          let foundFace = false;
          parsed.items.daily = parsed.items.daily.filter(item => {
            const taskName = typeof item === 'object' ? item.task : item;
            if (faceWashingTerms.includes(taskName)) {
              if (foundFace) return false; // Duplikat entfernen
              foundFace = true;
              return true;
            }
            return true;
          });
        }
        
        return parsed;
      }
    }
  } catch (e) {}
  const todayStr = new Date().toISOString().split('T')[0];
  const initialLang = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'de';
  const localizedDefaults = DEFAULT_TASKS_BY_LANG[initialLang] || DEFAULT_TASKS_BY_LANG['de'];

  return {
    version: 3, lastDate: todayStr,
    items: { daily: [...localizedDefaults.daily], weekly: [...localizedDefaults.weekly], occasionally: [...localizedDefaults.occasionally], todo: [], termine: [], notes: [] },
    done: [], archive: [], streak: 0, completedSteps: {},
    sampleBannerDismissed: false,
    shoppingList: [], shoppingHistory: [],
    cooking: createDefaultCookingState()
  };
}

function loadHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [];
}

// PERFORMANCE-FIX: saveState() wurde bisher bei JEDEM Aufruf (42 Stellen im Code) zusaetzlich
// den kompletten historyStack (bis zu 20 volle State-Kopien) neu serialisiert und geschrieben,
// obwohl sich die History in den allermeisten dieser Faelle gar nicht geaendert hatte. Das
// blockierte den Main-Thread unnoetig bei jeder kleinen Aktion (Task abhaken, Item hinzufuegen...).
// Jetzt wird die History nur noch dann persistiert, wenn sie sich tatsaechlich aendert
// (saveHistory() / handleUndo()). Das Endergebnis in localStorage ist zu jedem Zeitpunkt exakt
// identisch zu vorher - nur die Anzahl unnoetiger Schreibvorgaenge sinkt drastisch.
let syncEngineDebounceTimer = null;

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  if (typeof triggerCloudAutoSave === 'function') triggerCloudAutoSave();
  if (typeof syncEngine !== 'undefined' && syncEngine.account) {
    if (syncEngineDebounceTimer) clearTimeout(syncEngineDebounceTimer);
    syncEngineDebounceTimer = setTimeout(() => syncEngine.pushToCloud(), 1200);
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
      if (imported && imported.items) {
        saveHistory(); state = imported; 
        if (typeof state.items.notes === 'string') {
          state.items.notes = state.items.notes.split('\n').map(s => s.trim()).filter(Boolean);
        } else if (!Array.isArray(state.items.notes)) {
          state.items.notes = [];
        }
        if (!state.completedSteps) state.completedSteps = {};
        if (!state.shoppingList) state.shoppingList = [];
        if (!state.shoppingHistory) state.shoppingHistory = [];
        if (!state.cooking) state.cooking = createDefaultCookingState();
        if (!state.clarity) state.clarity = { streakDays: 0, lastCheckinDate: null, history: [], savedReasons: [] };
        saveState(); showToast(t('toast_import_success')); renderApp(); populateHelperTaskSelect();
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

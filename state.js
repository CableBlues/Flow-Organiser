
// CONFIGURATION KEYS AND GLOBAL STATE DEFINITIONS
let state = loadState();
let historyStack = loadHistory();
let currentLang = localStorage.getItem('flowPlannerLanguage') || 'en';
let currentTheme = localStorage.getItem('flowPlannerTheme') || 'aurora';
let isMinimalist = localStorage.getItem('flowPlannerMinimalist') === 'true';
let isTerminFormOpen = false;

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
        if (!parsed.items.notes || Array.isArray(parsed.items.notes)) {
          parsed.items.notes = Array.isArray(parsed.items.notes) ? parsed.items.notes.join('\n') : '';
        }
        if (parsed.streak === undefined) parsed.streak = 0;
        if (!parsed.completedSteps) parsed.completedSteps = {};
        
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
        
        // Dynamische Injektion: Gesicht waschen direkt nach Zähne morgens platzieren
        if (parsed.items.daily) {
          const dentalGerman = parsed.items.daily.indexOf("Zähne morgens");
          if (dentalGerman !== -1 && !parsed.items.daily.includes("Gesicht waschen")) {
            parsed.items.daily.splice(dentalGerman + 1, 0, "Gesicht waschen");
          }
          const dentalEnglish = parsed.items.daily.indexOf("Brush teeth (morning)");
          if (dentalEnglish !== -1 && !parsed.items.daily.includes("Wash face")) {
            parsed.items.daily.splice(dentalEnglish + 1, 0, "Wash face");
          }
        }
        
        return parsed;
      }
    }
  } catch (e) {}
  const todayStr = new Date().toISOString().split('T')[0];
  const initialLang = 'en';
  const localizedDefaults = DEFAULT_TASKS_BY_LANG[initialLang];
  
  // Ersteinspielung der täglichen Aufgaben inklusive Gesicht waschen
  const initialDaily = [...localizedDefaults.daily];
  const dentalEnglish = initialDaily.indexOf("Brush teeth (morning)");
  if (dentalEnglish !== -1) {
    initialDaily.splice(dentalEnglish + 1, 0, "Wash face");
  }

  return {
    version: 3, lastDate: todayStr,
    items: { daily: initialDaily, weekly: [...localizedDefaults.weekly], occasionally: [...localizedDefaults.occasionally], todo: [], termine: [], notes: '' },
    done: [], archive: [], streak: 0, completedSteps: {},
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

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  localStorage.setItem(HISTORY_KEY, JSON.stringify(historyStack));
}

function saveHistory() {
  historyStack.push(JSON.parse(JSON.stringify(state)));
  if (historyStack.length > 20) historyStack.shift();
}

function t(key) {
  return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.de[key] || key;
}

function getGermanStandardKey(taskName) {
  const cats = ['daily', 'weekly', 'occasionally'];
  for (const cat of cats) {
    for (const lang of ['de', 'en', 'es', 'el']) {
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
  saveState();
  showToast(t('toast_undo_applied'));
  renderApp();
  populateHelperTaskSelect();
}

function handleReset() {
  const confirmMsg = {
    de: 'Möchtest du den gesamten Plan wirklich zurücksetzen?',
    en: 'Do you really want to reset your entire plan?',
    es: '¿Seguro que quieres reiniciar todo el plan?',
    el: 'Θέλεις πραγματικά να επαναφέρεις ολόκληρο το πλάνο σου;'
  }[currentLang] || 'Reset?';
  
  if (confirm(confirmMsg)) {
    saveHistory();
    const localizedDefaults = DEFAULT_TASKS_BY_LANG[currentLang];
    
    const dailyList = [...localizedDefaults.daily];
    const dentalGerman = dailyList.indexOf("Zähne morgens");
    if (dentalGerman !== -1 && !dailyList.includes("Gesicht waschen")) {
      dailyList.splice(dentalGerman + 1, 0, "Gesicht waschen");
    }
    const dentalEnglish = dailyList.indexOf("Brush teeth (morning)");
    if (dentalEnglish !== -1 && !dailyList.includes("Wash face")) {
      dailyList.splice(dentalEnglish + 1, 0, "Wash face");
    }

    state = {
      version: 3, lastDate: new Date().toISOString().split('T')[0],
      items: { daily: dailyList, weekly: [...localizedDefaults.weekly], occasionally: [...localizedDefaults.occasionally], todo: [], termine: [], notes: '' },
      done: [], archive: [], streak: 0, completedSteps: {},
      shoppingList: [], shoppingHistory: [],
      cooking: createDefaultCookingState()
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
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `flow-plan-${state.lastDate}.json`; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function handleOpenFile(e) {
  const file = e.target.files?.[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (imported && imported.items) {
        saveHistory(); state = imported; 
        if (!state.completedSteps) state.completedSteps = {};
        if (!state.shoppingList) state.shoppingList = [];
        if (!state.shoppingHistory) state.shoppingHistory = [];
        saveState(); showToast(t('toast_import_success')); renderApp(); populateHelperTaskSelect();
      }
    } catch(err) { alert(t('toast_import_error')); }
  };
  reader.readAsText(file);
} 

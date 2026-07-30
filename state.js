// CONFIGURATION KEYS AND GLOBAL STATE DEFINITIONS
let state = loadState();
let historyStack = loadHistory();
let currentLang = localStorage.getItem('flowPlannerLanguage') || 'en';
let currentTheme = localStorage.getItem('flowPlannerTheme') || 'aurora';
let isMinimalist = localStorage.getItem('flowPlannerMinimalist') === 'true';
let isTerminFormOpen = false;

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
        return parsed;
      }
    }
  } catch (e) {}
  const todayStr = new Date().toISOString().split('T')[0];
  const initialLang = 'en';
  const localizedDefaults = DEFAULT_TASKS_BY_LANG[initialLang];
  return {
    version: 3, lastDate: todayStr,
    items: { daily: [...localizedDefaults.daily], weekly: [...localizedDefaults.weekly], occasionally: [...localizedDefaults.occasionally], todo: [], termine: [], notes: '' },
    done: [], archive: [], streak: 0, completedSteps: {}
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
      if (idx !== -1) return DEFAULT_TASKS_BY_LANG['de'][cat][idx];
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
  populateAdhdTaskSelect();
}

function handleReset() {
  const confirmMsg = {
    de: 'Möchtest du den gesamten Plan wirklich zurücksetzen?',
    en: 'Do you really want to reset your entire plan?',
    es: '¿Seguro que quieres reiniciar todo el plan?',
    el: 'Θέλετε πραγματικά να επαναφέρετε ολόκληρο το πλάνο σας;'
  }[currentLang] || 'Reset?';
  
  if (confirm(confirmMsg)) {
    saveHistory();
    const localizedDefaults = DEFAULT_TASKS_BY_LANG[currentLang];
    state = {
      version: 3, lastDate: new Date().toISOString().split('T')[0],
      items: { daily: [...localizedDefaults.daily], weekly: [...localizedDefaults.weekly], occasionally: [...localizedDefaults.occasionally], todo: [], termine: [], notes: '' },
      done: [], archive: [], streak: 0, completedSteps: {}
    };
    saveState();
    showToast(t('toast_reset_success'));
    renderApp();
    populateAdhdTaskSelect();
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
        saveHistory(); state = imported; if (!state.completedSteps) state.completedSteps = {};
        saveState(); showToast(t('toast_import_success')); renderApp(); populateAdhdTaskSelect();
      }
    } catch(err) { alert(t('toast_import_error')); }
  };
  reader.readAsText(file);
}
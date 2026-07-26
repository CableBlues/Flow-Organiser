let state = loadState();
let historyStack = loadHistory();
let currentLang = localStorage.getItem('flowPlannerLanguage') || 'en';
let currentTheme = localStorage.getItem('flowPlannerTheme') || 'aurora';
let isMinimalist = localStorage.getItem('flowPlannerMinimalist') === 'true';
let isTerminFormOpen = false;
let currentGeneratedSteps = [];
let timerSeconds = 25 * 60;
let timerRunning = false;
let timerInterval = null;

function detectBrowserLanguage() {
  let lang = navigator.language || navigator.userLanguage || 'en';
  lang = lang.substring(0, 2);
  return ['de', 'en', 'es', 'el'].includes(lang) ? lang : 'en';
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

document.addEventListener('DOMContentLoaded', () => {
  setTheme(currentTheme);
  setLanguage(currentLang);
  if (isMinimalist) document.body.classList.add('minimalist');
  updateDateAndStreak();
  renderApp();
  updateZenView();
  populateAdhdTaskSelect();
  const btnHeader = document.getElementById('timer-toggle-btn');
  if (btnHeader) {
    btnHeader.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>';
  }
  lucide.createIcons();
});

function setTheme(theme) {
  currentTheme = theme;
  document.body.className = `h-full antialiased flex flex-col font-sans select-none overflow-x-hidden text-[#f4f4f5] bg-[#0a0a0f] theme-${theme}`;
  if (isMinimalist) document.body.classList.add('minimalist');
  localStorage.setItem('flowPlannerTheme', theme);
}
function setLanguage(lang) {
  const oldLang = currentLang;
  currentLang = lang;
  localStorage.setItem('flowPlannerLanguage', lang);
  translateUserTasks(oldLang, lang);
  const flagMap = { de: '🇩🇪', en: '🇬🇧', es: '🇪🇸', el: '🇬🇷' };
  const flagEl = document.getElementById('active-lang-flag');
  if (flagEl) flagEl.innerText = flagMap[lang] || '🇬🇧';
  translateUI();
  updateDateAndStreak();
  renderApp();
  updateZenView();
  populateAdhdTaskSelect();
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
}
function translateUserTasks(fromLang, toLang) {
  if (fromLang === toLang) return;
  saveHistory();
  const cats = ['daily', 'weekly', 'occasionally'];
  cats.forEach(cat => {
    if (!state.items[cat]) return;
    state.items[cat] = state.items[cat].map(taskItem => {
      const taskName = typeof taskItem === 'object' ? taskItem.task : taskItem;
      const fromList = DEFAULT_TASKS_BY_LANG[fromLang][cat];
      const toList = DEFAULT_TASKS_BY_LANG[toLang][cat];
      const idx = fromList.indexOf(taskName);
      if (idx !== -1) {
        const nextVal = toList[idx];
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
        const toList = DEFAULT_TASKS_BY_LANG[toLang][cat];
        const idx = fromList.indexOf(key);
        if (idx !== -1) updatedKey = toList[idx];
      });
      nextStepsObj[updatedKey] = state.completedSteps[key];
    }
    state.completedSteps = nextStepsObj;
  }
  saveState();
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
function toggleMinimalist() {
  isMinimalist = !isMinimalist;
  localStorage.setItem('flowPlannerMinimalist', String(isMinimalist));
  if (isMinimalist) {
    document.body.classList.add('minimalist');
    updateZenView();
  } else {
    document.body.classList.remove('minimalist');
  }
  showToast(isMinimalist ? 'Zen-Modus aktiv 🧘' : 'Zen-Modus aus');
}
function updateDateAndStreak() {
  const locales = { de: 'de-DE', en: 'en-GB', el: 'el-GR', es: 'es-ES' };
  try {
    const str = new Intl.DateTimeFormat(locales[currentLang] || 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
    document.getElementById('date-display').innerText = str;
  } catch (e) {
    document.getElementById('date-display').innerText = new Date().toLocaleDateString();
  }
}
function playProceduralSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.35);
  } catch(e) {}
}
function formatTerminDate(dateStr, timeStr) {
  if (!dateStr) return timeStr ? `🕒 ${timeStr}` : '';
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowISO = tomorrow.toISOString().split('T')[0];
  const localizedToday = { de: '📍 Heute', en: '📍 Today', es: '📍 Hoy', el: '📍 Σήμερα' }[currentLang] || 'Today';
  const localizedTomorrow = { de: '🗓️ Morgen', en: '🗓️ Tomorrow', es: '🗓️ Mañana', el: '🗓️ Αύριο' }[currentLang] || 'Tomorrow';
  let label = '';
  if (dateStr === todayISO) label = localizedToday;
  else if (dateStr === tomorrowISO) label = localizedTomorrow;
  else {
    const parts = dateStr.split('-');
    if (parts.length === 3) label = `🗓️ ${parts[2]}.${parts[1]}.`;
    else label = `🗓️ ${dateStr}`;
  }
  return timeStr ? `${label} · ${timeStr}` : label;
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
  const dateEl = document.getElementById('add-termin-date');
  const timeEl = document.getElementById('add-termin-time');
  const title = titleEl ? titleEl.value.trim() : '';
  const date = dateEl ? dateEl.value : '';
  const time = timeEl ? timeEl.value : '';
  if (!title) {
    showToast(currentLang === 'de' ? 'Bitte Name für den Termin eingeben.' : 'Please enter appointment name.');
    return;
  }
  saveHistory();
  if (!state.items.termine) state.items.termine = [];
  state.items.termine.push({ task: title, date, time });
  isTerminFormOpen = false;
  saveState();
  renderApp();
  populateAdhdTaskSelect();
  showToast(currentLang === 'de' ? 'Termin eingetragen! 📅' : 'Appointment saved! 📅');
}
function getTaskIcon(taskText, category = '') {
  if (!taskText) return 'check-circle';
  if (TASK_ICONS[taskText]) return TASK_ICONS[taskText];
  const text = String(taskText).toLowerCase();
  if (/medi|pill|medicin|tableta|vitam|pharmak/.test(text)) return 'pill';
  if (/zahn|dient|tooth|dent|toothb|dond/.test(text)) return 'sparkles';
  if (/bett|bed|cama|krevat/.test(text)) return 'bed';
  if (/luft|wind|vent|aer/.test(text)) return 'wind';
  if (/koch|food|cook|comid|cena|recept|magir/.test(text)) return 'cooking-pot';
  if (/dusch|bath|shower|duch|ban|ntous/.test(text)) return 'shower-head';
  if (/aufräum|tidy|orden|takto/.test(text)) return 'package';
  if (/staub|dust|polv|xesk/.test(text)) return 'feather';
  if (/saugen|vacu|aspir|skoupi/.test(text)) return 'tornado';
  if (/wisch|mop|freg|sfoug/.test(text)) return 'droplets';
  if (/spül|dish|plat|piat/.test(text)) return 'utensils';
  if (/wasch|laund|colad|roux/.test(text)) return 'washing-machine';
  if (/aufhäng|hang|colg|aplon/.test(text)) return 'towel-rack';
  if (/klo|wc|toil|vater|lekan/.test(text)) return 'toilet';
  if (/müll|trash|basur|skoupid/.test(text)) return 'trash-2';
  if (/pfand|bottle|envase|boukal/.test(text)) return 'recycle';
  if (/haare|hair|pelo|kour|fris/.test(text)) return 'scissors';
  if (/nagel|nail|uñ|nych/.test(text)) return 'check-circle-2';
  if (/einkauf|shop|compr|agor/.test(text)) return 'shopping-cart';
  if (/arbeit|work|trabaj|doul/.test(text)) return 'briefcase';
  if (/sport|gym|fit|train|gymn/.test(text)) return 'activity';
  if (/les|book|libr|vivl/.test(text)) return 'book-open';
  if (/trink|wat|agu|ner/.test(text)) return 'glass-water';
  if (/paus|rest|desc|paus/.test(text)) return 'moon';
  const catIcons = { daily: 'sun', weekly: 'calendar-days', todo: 'list-todo', done: 'check-circle', termine: 'clock', occasionally: 'calendar-range', notes: 'sticky-note' };
  return catIcons[category] || 'check-circle';
}

function renderApp() {
  const main = document.querySelector('main');
  main.innerHTML = '';
  const todayISO = new Date().toISOString().split('T')[0];
  CATEGORIES.forEach(([id, iconKey]) => {
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
    article.className = 'min-h-[380px] h-full flex flex-col p-3 rounded-2xl border border-white/[0.08] bg-[#13131a]/75 backdrop-blur-md shadow-lg hover:border-[var(--accent)]/30 transition duration-300';
    article.ondragover = (e) => e.preventDefault();
    article.ondrop = (e) => handleDrop(e, id);
    article.innerHTML = `
      <h2 class="flex justify-center items-center gap-2 mb-2.5 text-gray-400 font-bold font-display text-[10px] tracking-wider uppercase">
        <i data-lucide="${iconKey}" class="w-4 h-4"></i>
        <span>${titleText}</span>
      </h2>
      ${!isDone && !isNotes ? `
        <div class="w-full h-1 bg-white/[0.05] rounded-full mb-3.5 overflow-hidden">
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
        itemDiv.innerHTML = `<span class="truncate">${item.task} · ${item.time}</span><i data-lucide="undo" class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-purple-400 shrink-0"></i>`;
        listEl.appendChild(itemDiv);
      });
    } else if (isNotes) {
      const textarea = document.createElement('textarea');
      textarea.className = 'w-full h-full min-h-[220px] flex-1 p-3 bg-black/40 border border-dashed border-white/10 rounded-xl text-gray-200 text-xs leading-relaxed outline-none resize-none focus:border-[var(--accent)] transition';
      textarea.placeholder = t('notesPlaceholder');
      textarea.value = state.items.notes || '';
      textarea.oninput = (e) => { state.items.notes = e.target.value; saveState(); };
      listEl.appendChild(textarea);
    } else if (isTermine) {
      const rawTermine = state.items.termine || [];
      const itemsWithMeta = rawTermine.map((item, originalIdx) => {
        const obj = typeof item === 'object' ? item : { task: item, date: '', time: '' };
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
        const dateBadge = formatTerminDate(item.date, item.time);
        const isToday = item.date === todayISO;
        const itemDiv = document.createElement('div');
        itemDiv.draggable = true;
        itemDiv.ondragstart = (e) => handleDragStart(e, id, originalIndex);
        itemDiv.className = `group relative w-full min-h-[44px] flex flex-col justify-center gap-1 p-2.5 border-0 border-l-[4px] ${isToday ? 'border-amber-400 bg-amber-500/10' : 'border-[var(--accent)] bg-white/[0.03]'} hover:bg-[rgba(139,92,246,0.18)] hover:scale-[1.02] text-gray-300 font-medium leading-tight transition duration-300 rounded-lg`;
        itemDiv.innerHTML = `
          <div class="flex items-center justify-between gap-2 w-full">
            <button onclick="handleCompleteTask('termine', ${originalIndex}, event)" class="flex items-center gap-2 w-full text-left bg-transparent border-0 text-inherit cursor-pointer p-0 min-w-0 pr-1 transition-all duration-150">
              <i data-lucide="clock" class="w-3.5 h-3.5 text-[var(--accent-light)] shrink-0"></i>
              <span class="block text-xs font-semibold text-white truncate">${item.task}</span>
            </button>
            <div class="absolute right-1.5 -top-3.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition shrink-0 bg-[#13131a]/95 border border-white/15 px-1 py-0.5 rounded-lg shadow-lg z-20">
              <button onclick="deleteTask('termine', ${originalIndex}, event)" class="p-1 text-gray-500 hover:text-red-400 hover:bg-white/10 rounded transition cursor-pointer"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
            </div>
          </div>
          ${dateBadge ? `<div class="flex items-center mt-0.5"><span class="text-[10px] px-1.5 py-0.5 rounded ${isToday ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold' : 'bg-white/5 text-gray-300 border border-white/10'} font-mono">${dateBadge}</span></div>` : ''}
        `;
        listEl.appendChild(itemDiv);
      });
      if (!isTerminFormOpen) {
        const btnEl = document.createElement('button');
        btnEl.onclick = () => toggleTerminForm(true);
        btnEl.className = 'mt-2 w-full min-h-[38px] p-2 rounded-lg border border-dashed border-white/15 bg-[#0a0a0e] hover:bg-[#13131e] text-center text-xs text-gray-400 hover:text-white font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm';
        const btnT = { de: '＋ Termin eintragen', en: '＋ Add Appointment', es: '＋ Añadir Cita', el: '＋ Προσθήκη Ραντεβού' }[currentLang] || '＋ Add';
        btnEl.innerHTML = `<i data-lucide="calendar-plus" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i><span>${btnT}</span>`;
        listEl.appendChild(btnEl);
      } else {
        const formDiv = document.createElement('div');
        formDiv.className = 'mt-2 p-3 bg-[#0e0e14] border border-[var(--accent)]/40 rounded-xl flex flex-col gap-2.5 shadow-lg';
        const formT = { de: 'Neuer Termin', en: 'New Appointment', es: 'Nueva Cita', el: 'Νέο Ραντεβού' }[currentLang] || 'New';
        const nameT = { de: 'Termin Name (z.B. Zahnarzt)...', en: 'Appointment (e.g., Dentist)...', es: 'Nombre de la cita (ej. Dentista)...', el: 'Όνομα ραντεβού (π.χ. Οδοντίατρος)...' }[currentLang] || 'Name';
        const dateT = { de: 'Datum', en: 'Date', es: 'Fecha', el: 'Ημερομηνία' }[currentLang] || 'Date';
        const timeT = { de: 'Uhrzeit', en: 'Time', es: 'Ώρα' }[currentLang] || 'Time';
        const saveT = { de: 'Speichern', en: 'Save', es: 'Guardar', el: 'Αποθήκευση' }[currentLang] || 'Save';
        const cancelT = { de: 'Abbrechen', en: 'Cancel', es: 'Cancelar', el: 'Ακύρωση' }[currentLang] || 'Cancel';
        formDiv.innerHTML = `
          <div class="flex items-center justify-between text-xs font-bold text-amber-300">
            <span class="flex items-center gap-1.5"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> ${formT}</span>
            <button onclick="toggleTerminForm(false)" class="text-gray-400 hover:text-white p-0.5 cursor-pointer text-xs">✕</button>
          </div>
          <input type="text" id="add-termin-title" placeholder="${nameT}" class="w-full p-2 bg-black/60 border border-white/15 rounded-lg text-xs text-white outline-none focus:border-[var(--accent)] font-semibold placeholder:text-gray-500" />
          <div class="grid grid-cols-2 gap-2">
            <div><label class="text-[10px] text-gray-400 mb-0.5 block font-medium">${dateT}</label><input type="date" id="add-termin-date" value="${todayISO}" class="w-full p-1.5 bg-black/60 border border-white/15 rounded-lg text-xs text-gray-200 outline-none focus:border-[var(--accent)] cursor-pointer" /></div>
            <div><label class="text-[10px] text-gray-400 mb-0.5 block font-medium">${timeT}</label><input type="time" id="add-termin-time" value="10:00" class="w-full p-1.5 bg-black/60 border border-white/15 rounded-lg text-xs text-gray-200 outline-none focus:border-[var(--accent)] cursor-pointer" /></div>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <button onclick="handleAddTermin()" class="flex-1 py-1.5 bg-[var(--accent)] hover:opacity-90 text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"><i data-lucide="check" class="w-3.5 h-3.5"></i><span>${saveT}</span></button>
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
        const iconName = getTaskIcon(taskText, id);
        const isTaskActive = activeTimerTask === taskText && timerRunning;
        const itemDiv = document.createElement('div');
        itemDiv.draggable = true;
        itemDiv.ondragstart = (e) => handleDragStart(e, id, index);
        itemDiv.ondragover = (e) => handleDragOver(e);
        itemDiv.ondrop = (e) => handleItemDrop(e, id, index);
        itemDiv.className = `group relative w-full min-h-[42px] flex items-center justify-between p-2 border-0 border-l-[4px] ${isTaskActive ? 'border-amber-400 bg-amber-500/15 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'border-[var(--accent)] bg-white/[0.03]'} hover:bg-[rgba(139,92,246,0.18)] text-gray-300 font-medium leading-tight transition duration-200 rounded-lg`;
        const safeTaskEscaped = taskText.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        itemDiv.innerHTML = `
          <button onclick="handleCompleteTask('${id}', ${index}, event)" class="flex items-center gap-2 w-full text-left bg-transparent border-0 text-inherit cursor-pointer p-0 min-w-0 pr-1 transition-all duration-150">
            <i data-lucide="${iconName}" class="w-3.5 h-3.5 ${isTaskActive ? 'text-amber-400 animate-pulse' : 'text-[var(--accent-light)]'} shrink-0"></i>
            <span class="block text-xs leading-snug min-w-0 flex-1 font-medium text-gray-200 truncate ${isTaskActive ? 'text-amber-200 font-bold' : ''}" title="${taskText.replace(/"/g, '&quot;')}">${taskText}</span>
          </button>
          <div class="absolute right-1.5 -top-3.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition duration-150 shrink-0 bg-[#13131a] border border-white/10 px-1 py-0.5 rounded-lg shadow-lg z-20">
            <button onclick="openTaskStepsModal('${id}', ${index}, event)" class="p-1 text-[var(--accent-light)] hover:text-white hover:bg-white/10 rounded transition cursor-pointer"><i data-lucide="footprints" class="w-3.5 h-3.5"></i></button>
            <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
            <button onclick="startTaskTimer('${safeTaskEscaped}', event)" class="p-1 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded transition cursor-pointer"><i data-lucide="timer" class="w-3.5 h-3.5"></i></button>
            <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
            <button onclick="deleteTask('${id}', ${index}, event)" class="p-1 text-gray-500 hover:text-red-400 hover:bg-white/10 rounded transition cursor-pointer"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
          </div>
        `;
        listEl.appendChild(itemDiv);
      });
      const addInput = document.createElement('input');
      addInput.type = 'text'; addInput.placeholder = '＋';
      addInput.className = 'w-full min-h-[38px] p-2 rounded-lg border border-white/10 bg-[#0a0a0e] hover:bg-[#111118] text-center text-xs placeholder:text-gray-500 focus:outline-none focus:border-[var(--accent)] transition cursor-text font-semibold text-gray-300';
      addInput.onkeydown = (e) => {
        if (e.key === 'Enter' && addInput.value.trim()) {
          saveHistory();
          state.items[id].push(addInput.value.trim());
          addInput.value = ''; saveState(); renderApp(); populateAdhdTaskSelect(); lucide.createIcons();
        }
      };
      listEl.appendChild(addInput);
    }
    main.appendChild(article);
  });
  lucide.createIcons();
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
  if (typeof rawTask === 'object' && rawTask.date) taskText += ` (${formatTerminDate(rawTask.date, rawTask.time)})`;
  state.done.push({ task: taskText, origin: category, date: todayStr, time: timeStr });
  state.streak = (state.streak || 0) + 1;
  if (state.completedSteps) delete state.completedSteps[taskText];
  saveState(); playProceduralSound(); triggerConfetti(); showPraise(); renderApp(); updateZenView(); populateAdhdTaskSelect();
}
function deleteTask(category, index, event) {
  if (event) event.stopPropagation();
  saveHistory();
  const taskObj = state.items[category][index];
  const taskText = typeof taskObj === 'object' ? taskObj?.task : taskObj;
  state.items[category].splice(index, 1);
  if (taskText && state.completedSteps) delete state.completedSteps[taskText];
  saveState(); showToast(currentLang === 'de' ? 'Aufgabe gelöscht' : 'Task deleted'); renderApp(); updateZenView(); populateAdhdTaskSelect();
}
function handleRestoreDoneTask(doneIndex) {
  saveHistory();
  const reversedIndex = state.done.length - 1 - doneIndex;
  const item = state.done[reversedIndex];
  if (!item) return;
  state.done.splice(reversedIndex, 1);
  const targetCat = state.items[item.origin] ? item.origin : 'daily';
  state.items[targetCat].push(item.task);
  saveState(); showToast(currentLang === 'de' ? 'Aufgabe wiederhergestellt' : 'Task restored'); renderApp(); updateZenView(); populateAdhdTaskSelect();
}
function handleUndo() {
  if (historyStack.length === 0) {
    showToast(currentLang === 'de' ? 'Keine Änderungen zum Rückgängig machen.' : 'Nothing to undo.');
    return;
  }
  state = historyStack.pop(); saveState(); showToast(currentLang === 'de' ? 'Rückgängig gemacht.' : 'Undo applied.'); renderApp(); populateAdhdTaskSelect();
}
function handleReset() {
  const confirmMsg = { de: 'Möchtest du den gesamten Plan wirklich zurücksetzen?', en: 'Do you really want to reset your entire plan?', es: '¿Seguro que quieres reiniciar todo el plan?', el: 'Θέλετε πραγματικά να επαναφέρετε ολόκληρο το πλάνο σας;' }[currentLang] || 'Reset?';
  if (confirm(confirmMsg)) {
    saveHistory();
    const localizedDefaults = DEFAULT_TASKS_BY_LANG[currentLang];
    state = {
      version: 3, lastDate: new Date().toISOString().split('T')[0],
      items: { daily: [...localizedDefaults.daily], weekly: [...localizedDefaults.weekly], occasionally: [...localizedDefaults.occasionally], todo: [], termine: [], notes: '' },
      done: [], archive: [], streak: 0, completedSteps: {}
    };
    saveState(); showToast(currentLang === 'de' ? 'Zurückgesetzt!' : 'Reset complete!'); renderApp(); populateAdhdTaskSelect();
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
        saveState(); showToast(currentLang === 'de' ? 'Plan erfolgreich importiert!' : 'Plan imported successfully!'); renderApp(); populateAdhdTaskSelect();
      }
    } catch(err) { alert('Error importing file.'); }
  };
  reader.readAsText(file);
}

let draggedItemInfo = null;
function handleDragStart(e, category, index) {
  draggedItemInfo = { category, index };
  e.dataTransfer.setData('text/plain', JSON.stringify({ category, index }));
  e.dataTransfer.effectAllowed = 'move';
}
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
  draggedItemInfo = null; saveState(); renderApp(); populateAdhdTaskSelect();
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
  draggedItemInfo = null; saveState(); renderApp(); populateAdhdTaskSelect();
}

function showToast(msg) {
  const overlay = document.getElementById('toast-overlay');
  const card = document.getElementById('toast-card');
  card.innerText = msg; overlay.classList.remove('hidden');
  setTimeout(() => overlay.classList.add('hidden'), 2200);
}

let hoverPanelTimeout = null;
function showPanelHover(panelName) {
  clearTimeout(hoverPanelTimeout);
  ['feedback', 'report', 'settings', 'soundscape', 'language'].forEach(p => {
    const el = document.getElementById(`panel-${p}`); if (!el) return;
    if (p === panelName) {
      el.classList.remove('hidden'); if (p === 'report') updateReportPanel();
    } else { el.classList.add('hidden'); }
  });
}
function hidePanelHover(panelName) {
  clearTimeout(hoverPanelTimeout);
  hoverPanelTimeout = setTimeout(() => {
    const el = document.getElementById(`panel-${panelName}`); if (el) el.classList.add('hidden');
  }, 250);
}
function togglePanel(panelName) {
  clearTimeout(hoverPanelTimeout);
  ['feedback', 'report', 'settings', 'soundscape', 'language'].forEach(p => {
    const el = document.getElementById(`panel-${p}`); if (!el) return;
    if (p === panelName) {
      el.classList.toggle('hidden');
      if (p === 'report' && !el.classList.contains('hidden')) updateReportPanel();
    } else { el.classList.add('hidden'); }
  });
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
  const totalDoneAllTime = (state.done || []).length;
  const totalXp = totalDoneAllTime * 25;
  const userLevel = Math.floor(totalXp / 100) + 1;
  const currentLevelXp = totalXp % 100;
  const levelsList = TRANSLATIONS[currentLang]?.levels || TRANSLATIONS.de.levels;
  const userTitle = levelsList[Math.min(userLevel - 1, levelsList.length - 1)];
  const badgeEl = document.getElementById('user-level-badge'); if (badgeEl) badgeEl.innerText = `Lv.${userLevel}`;
  const titleEl = document.getElementById('user-level-title'); if (titleEl) titleEl.innerText = userTitle;
  const xpTextEl = document.getElementById('user-xp-text'); if (xpTextEl) xpTextEl.innerText = `${currentLevelXp} / 100 XP`;
  const xpBarEl = document.getElementById('user-xp-bar'); if (xpBarEl) xpBarEl.style.width = `${currentLevelXp}%`;
  let totalPending = 0;
  ['daily', 'weekly', 'todo', 'occasionally', 'termine'].forEach(cat => { totalPending += (state.items[cat] || []).length; });
  const totalAll = count + totalPending;
  const pct = totalAll > 0 ? Math.round((count / totalAll) * 100) : 100;
  const todayEl = document.getElementById('report-today-count'); if (todayEl) todayEl.innerText = count;
  const rateEl = document.getElementById('report-rate-pct'); if (rateEl) rateEl.innerText = `${pct}%`;
  const catBarsEl = document.getElementById('report-category-bars');
  if (catBarsEl) {
    catBarsEl.innerHTML = '';
    const catStats = [{ id: 'daily', label: t('daily') }, { id: 'weekly', label: t('weekly') }, { id: 'todo', label: t('todo') }, { id: 'occasionally', label: t('occasionally') }];
    catStats.forEach(({ id, label }) => {
      const pending = (state.items[id] || []).length;
      const completedInCat = filteredDone.filter(item => item.origin === id).length;
      const totalInCat = pending + completedInCat;
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
    if (count === 0) insightEl.innerText = { de: 'Noch keine erledigten Aufgaben in diesem Zeitraum. Starte jetzt mit einer kleinen Aufgabe!', en: 'No completed tasks in this timeframe yet. Start with a small task now!', es: 'Aún no hay tareas completadas en este período. ¡Empieza con una tarea pequeña!', el: 'Δεν υπάρχουν ολοκληρωμένες εργασίες για αυτήν την περίοδο ακόμα. Ξεκίνησε με μια μικρή εργασία τώρα!' }[currentLang];
    else if (count < 3) insightEl.innerText = { de: `Guter Anfang! Du hast ${count} Aufgaben geschafft. Bleib dran!`, en: `Good start! You accomplished ${count} tasks. Keep going!`, es: `¡Buen comienzo! Has completado ${count} tareas. ¡Sigue así!`, el: `Καλή αρχή! Ολοκλήρωσες εργασίες. Συνέχισε έτσι!` }[currentLang];
    else if (count < 8) insightEl.innerText = { de: `Starkes Ergebnis! ${count} Aufgaben erledigt. Du bist voll im Flow! ⚡`, en: `Great result! ${count} tasks completed. You are in the flow! ⚡`, es: `¡Gran resultado! ${count} tareas completadas. ¡Estás en racha! ⚡`, el: `Εξαιρετικό αποτέλεσμα! Ολοκλήρωσες εργασίες. Είσαι σε πλήρη ροή! ⚡` }[currentLang];
    else insightEl.innerText = { de: `Hervorragende Produktivität! ${count} Aufgaben geschafft. Zeit für eine Pause! 🎉`, en: `Outstanding productivity! ${count} tasks finished. Time for a well-deserved break! 🎉`, es: `¡Productividad sobresaliente! ${count} tareas hechas. ¡Es hora de un descanso! 🎉`, el: `Εξαιρετική παραγωγικότητα! Ολοκλήρωσες εργασίες. Ώρα für ein διάλειμμα! 🎉` }[currentLang];
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
        div.innerHTML = `<div class="flex items-center gap-1.5 overflow-hidden pr-2"><span class="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">${catLabel}</span><span class="truncate font-medium text-xs text-white">${item.task}</span></div><span class="text-gray-500 font-mono text-[10px] shrink-0">${item.time || ''}</span>`;
        list.appendChild(div);
      });
    }
  }
}
function submitFeedback() {
  const text = document.getElementById('feedback-text').value;
  if (text.trim()) {
    showToast({ de: 'Vielen Dank für dein Feedback! ❤️', en: 'Thank you so much for your feedback! ❤️', es: '¡Muchas gracias por tus comentarios! ❤️', el: 'Σας ευχαριστούμε πολύ για τα σχόλιά σας! ❤️' }[currentLang]);
    document.getElementById('feedback-text').value = ''; togglePanel('feedback');
  }
}

let activeTimerTask = null;
function startTaskTimer(taskName, event) {
  if (event) event.stopPropagation(); if (!taskName) return;
  activeTimerTask = taskName; timerSeconds = 25 * 60;
  if (!timerRunning) toggleTimer(); else updateTimerDisplay();
  updateActiveTimerBadge(); renderApp(); showToast(`⏱️ ${t('timer_title')}: "${taskName}"`);
}
function updateActiveTimerBadge() {
  const badge = document.getElementById('active-timer-badge');
  if (badge) {
    if (activeTimerTask && timerRunning) {
      badge.classList.remove('hidden'); badge.innerText = `🎯 ${activeTimerTask}`; badge.title = `Fokus: ${activeTimerTask}`;
    } else if (activeTimerTask) {
      badge.classList.remove('hidden'); badge.innerText = `⏸️ ${activeTimerTask}`;
    } else { badge.classList.add('hidden'); }
  }
}
function setTimerPreset(mins) {
  clearInterval(timerInterval); timerRunning = false; timerSeconds = mins * 60;
  const btnHeader = document.getElementById('timer-toggle-btn');
  const zenLabel = document.getElementById('zen-timer-btn-label');
  const presetSel = document.getElementById('timer-preset-select');
  if (presetSel) presetSel.value = String(mins);
  if (btnHeader) {
    btnHeader.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>'; lucide.createIcons();
  }
  if (zenLabel) zenLabel.innerText = t('start');
  updateTimerDisplay(); updateActiveTimerBadge(); renderApp(); showToast(`⏱️ ${mins}m`);
}
function toggleTimer() {
  const btnHeader = document.getElementById('timer-toggle-btn');
  const zenLabel = document.getElementById('zen-timer-btn-label');
  const labelPause = { de: 'Pause', en: 'Pause', es: 'Pausa', el: 'Παύση' }[currentLang] || 'Pause';
  if (timerRunning) {
    clearInterval(timerInterval); timerRunning = false;
    if (btnHeader) {
      btnHeader.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>'; lucide.createIcons();
    }
    if (zenLabel) zenLabel.innerText = t('start');
    updateActiveTimerBadge(); renderApp();
  } else {
    timerRunning = true;
    if (btnHeader) {
      btnHeader.innerHTML = '<i data-lucide="pause" class="w-3.5 h-3.5 text-amber-400 animate-pulse"></i>'; lucide.createIcons();
    }
    if (zenLabel) zenLabel.innerText = labelPause;
    updateActiveTimerBadge(); renderApp();
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--; updateTimerDisplay();
      } else {
        clearInterval(timerInterval); timerRunning = false; playProceduralSound();
        showToast({ de: 'Fokus-Zeit abgelaufen! Zeit für eine Pause! ☕', en: 'Focus timer finished! Time for a short break! ☕', es: '¡Tiempo de enfoque terminado! ¡Tómate un descanso! ☕', el: 'Ο χρόνος εστίασης τελείωσε! Ώρα για ένα μικρό διάλειμμα! ☕' }[currentLang]);
        if (btnHeader) {
          btnHeader.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>'; lucide.createIcons();
        }
        if (zenLabel) zenLabel.innerText = t('start');
        updateActiveTimerBadge(); renderApp();
      }
    }, 1000);
  }
}
function resetTimer() {
  clearInterval(timerInterval); timerRunning = false; timerSeconds = 25 * 60; activeTimerTask = null;
  const btnHeader = document.getElementById('timer-toggle-btn');
  const zenLabel = document.getElementById('zen-timer-btn-label');
  if (btnHeader) {
    btnHeader.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>'; lucide.createIcons();
  }
  if (zenLabel) zenLabel.innerText = t('start');
  updateTimerDisplay(); updateActiveTimerBadge(); renderApp();
}
function updateTimerDisplay() {
  const mins = Math.floor(timerSeconds / 60); const secs = timerSeconds % 60;
  const str = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const headerDisp = document.getElementById('timer-display'); if (headerDisp) headerDisp.innerText = str;
  const zenDisp = document.getElementById('zen-timer-display'); if (zenDisp) zenDisp.innerText = str;
}

let currentZenTaskInfo = null;
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
    const endMsg = { de: '🎉 Alle Aufgaben erledigt! Entspanne dich und genieße deine freie Zeit.', en: '🎉 All tasks completed! Relax and enjoy your free time.', es: '🎉 ¡Todas las Aufgaben erledigt! ¡Disfruta de tu día!', el: '🎉 Όλες οι εργασίες ολοκληρώθηκαν! Χαλαρώστε και απολαύστε τον ελεύθερο χρόνο σας.' }[currentLang];
    zenTextEl.innerHTML = `<span class="text-emerald-400">${endMsg}</span>`;
  } else {
    const catName = t(chosen.cat); if (zenCatEl) zenCatEl.innerText = `${t('next_rec')} · ${catName}`;
    zenTextEl.innerText = chosen.task;
  }
  updateTimerDisplay(); lucide.createIcons();
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

let currentActiveTaskRef = null;
function openAdhdModal(type) {
  if (type === 'pick') {
    const modal = document.getElementById('adhd-pick-modal');
    if (modal) modal.classList.remove('hidden');
    pickRandomTask();
  } else if (type === 'steps') {
    const modal = document.getElementById('adhd-steps-modal');
    if (modal) modal.classList.remove('hidden');
    populateAdhdTaskSelect();
  }
}
function openTaskStepsModal(category, index, event) {
  if (event) event.stopPropagation();
  const task = state.items[category]?.[index]; if (!task) return;
  currentActiveTaskRef = { category, index, task };
  openAdhdModal('steps');
  const select = document.getElementById('adhd-task-select');
  if (select) {
    let found = false;
    for (let opt of select.options) {
      if (opt.value === task) { select.value = task; found = true; break; }
    }
    if (!found) select.value = '';
  }
  generateTaskSteps(task);
}
function closeAdhdModal() {
  const pickModal = document.getElementById('adhd-pick-modal');
  const stepsModal = document.getElementById('adhd-steps-modal');
  if (pickModal) pickModal.classList.add('hidden');
  if (stepsModal) stepsModal.classList.add('hidden');
}
function populateAdhdTaskSelect() {
  const select = document.getElementById('adhd-task-select'); if (!select) return;
  select.innerHTML = `<option value="">${t('dropdown_placeholder')}</option>`;
  const allTasks = [];
  ['daily', 'weekly', 'todo', 'occasionally'].forEach(cat => {
    (state.items[cat] || []).forEach(task => { if (!allTasks.includes(task)) allTasks.push(task); });
  });
  const standardPresetsInCurrentLang = [...DEFAULT_TASKS_BY_LANG[currentLang].daily, ...DEFAULT_TASKS_BY_LANG[currentLang].weekly, ...DEFAULT_TASKS_BY_LANG[currentLang].occasionally];
  standardPresetsInCurrentLang.forEach(task => { if (!allTasks.includes(task)) allTasks.push(task); });
  allTasks.forEach(task => {
    const opt = document.createElement('option'); opt.value = task; opt.innerText = task; select.appendChild(opt);
  });
}
function onAdhdSelectTask() {
  const select = document.getElementById('adhd-task-select');
  const val = select ? select.value : '';
  if (val) { currentActiveTaskRef = { task: val }; generateTaskSteps(val); }
}
function pickRandomTask() {
  let chosen = null;
  const dailyTasks = (state.items.daily || []).map(t => ({ cat: 'daily', task: typeof t === 'object' ? t.task : t }));
  const weeklyTasks = (state.items.weekly || []).map(t => ({ cat: 'weekly', task: typeof t === 'object' ? t.task : t }));
  const todoTasks = (state.items.todo || []).map(t => ({ cat: 'todo', task: typeof t === 'object' ? t.task : t }));
  const occasionallyTasks = (state.items.occasionally || []).map(t => ({ cat: 'occasionally', task: typeof t === 'object' ? t.task : t }));
  if (dailyTasks.length > 0) chosen = dailyTasks[Math.floor(Math.random() * dailyTasks.length)];
  else {
    const mixedMidPriority = []; const maxLen = Math.max(todoTasks.length, weeklyTasks.length);
    for (let i = 0; i < maxLen; i++) {
      if (todoTasks[i]) mixedMidPriority.push(todoTasks[i]); if (weeklyTasks[i]) mixedMidPriority.push(weeklyTasks[i]);
    }
    if (mixedMidPriority.length > 0) chosen = mixedMidPriority[Math.floor(Math.random() * Math.min(mixedMidPriority.length, 3))];
    else if (occasionallyTasks.length > 0) chosen = occasionallyTasks[Math.floor(Math.random() * occasionallyTasks.length)];
  }
  const box = document.getElementById('adhd-pick-box');
  if (!chosen) {
    const doneMsg = { de: '🎉 Alle Aufgaben erledigt! Fantastisch, genieß deinen Tag!', en: '🎉 All tasks completed! Fantastic, enjoy your day!', es: '🎉 ¡Todas las Aufgaben erledigt! ¡Disfruta de tu día!', el: '🎉 Όλες οι εργασίες ολοκληρώθηκαν! Απολαύστε τη μέρα σας!' }[currentLang];
    box.innerHTML = `<div class="text-emerald-400 font-bold">${doneMsg}</div>`;
  } else {
    const catName = t(chosen.cat);
    const taskIdx = (state.items[chosen.cat] || []).findIndex(item => (typeof item === 'object' ? item.task : item) === chosen.task);
    const stepsBtnLabel = t('open_steps'); const doneBtnLabel = t('completed');
    box.innerHTML = `
      <div class="flex flex-col items-center gap-2 w-full py-1">
        <div class="text-[11px] font-semibold text-amber-400/90 uppercase tracking-wider">${t('next_rec')} (${catName})</div>
        <div class="text-base font-bold text-white px-2 break-words text-center">${chosen.task}</div>
        <div class="flex flex-wrap items-center justify-center gap-2 mt-2 w-full">
          <button onclick="startTaskTimer('${chosen.task.replace(/'/g, "\\'")}')" class="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1 hover:scale-105 active:scale-95"><i data-lucide="timer" class="w-3.5 h-3.5"></i><span>Timer</span></button>
          <button onclick="openTaskStepsModal('${chosen.cat}', ${taskIdx})" class="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1"><i data-lucide="footprints" class="w-3.5 h-3.5"></i><span>${stepsBtnLabel}</span></button>
          <button onclick="handleCompleteTask('${chosen.cat}', ${taskIdx}); pickRandomTask();" class="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1"><i data-lucide="check" class="w-3.5 h-3.5"></i><span>${doneBtnLabel}</span></button>
        </div>
      </div>
    `;
    lucide.createIcons();
  }
}
function generateTaskSteps(specificTask) {
  let val = specificTask;
  if (!val) {
    const select = document.getElementById('adhd-task-select'); val = select ? select.value : '';
  }
  if (!val) {
    const resBox = document.getElementById('adhd-steps-result');
    if (resBox) resBox.innerHTML = `<p class="text-xs text-gray-400 italic text-center py-4">${currentLang === 'de' ? 'Bitte wähle oben eine Aufgabe aus.' : 'Please select a task.'}</p>`;
    return;
  }
  if (!currentActiveTaskRef || currentActiveTaskRef.task !== val) currentActiveTaskRef = { task: val };
  const resBox = document.getElementById('adhd-steps-result'); if (!resBox) return;
  const deKey = getGermanStandardKey(val);
  let steps = TASK_STEPS_DATABASE[deKey]?.[currentLang];
  if (!steps || steps.length === 0) {
    const template = FALLBACK_STEPS[currentLang] || FALLBACK_STEPS['en'];
    steps = template.map(step => step.replace('{task}', val));
  }
  currentGeneratedSteps = steps; resBox.innerHTML = '';
  if (!state.completedSteps) state.completedSteps = {};
  const completedIndices = state.completedSteps[val] || [];
  steps.forEach((stepText, idx) => {
    const isChecked = completedIndices.includes(idx);
    const label = document.createElement('label');
    label.className = 'flex items-start gap-2.5 p-2.5 bg-white/[0.03] hover:bg-white/[0.07] rounded-xl border border-white/5 cursor-pointer transition text-gray-200 leading-snug my-1';
    label.innerHTML = `
      <input type="checkbox" onchange="toggleStepCheck(this, ${idx})" ${isChecked ? 'checked' : ''} class="mt-0.5 h-4 w-4 rounded border-gray-600 bg-black/50 text-[var(--accent)] focus:ring-0 accent-purple-500 cursor-pointer">
      <span class="step-text flex-1 ${isChecked ? 'line-through text-gray-500' : ''}">${stepText}</span>
    `;
    resBox.appendChild(label);
  });
  lucide.createIcons();
}
function toggleStepCheck(checkbox, stepIndex) {
  const label = checkbox.closest('label');
  const textSpan = label.querySelector('.step-text');
  let targetTask = currentActiveTaskRef?.task;
  if (!targetTask) {
    const select = document.getElementById('adhd-task-select'); targetTask = select ? select.value : '';
  }
  if (!state.completedSteps) state.completedSteps = {};
  if (!state.completedSteps[targetTask]) state.completedSteps[targetTask] = [];
  if (checkbox.checked) {
    textSpan.classList.add('line-through', 'text-gray-500');
    if (!state.completedSteps[targetTask].includes(stepIndex)) state.completedSteps[targetTask].push(stepIndex);
    playProceduralSound();
  } else {
    textSpan.classList.remove('line-through', 'text-gray-500');
    state.completedSteps[targetTask] = state.completedSteps[targetTask].filter(i => i !== stepIndex);
  }
  saveState();
  const resBox = document.getElementById('adhd-steps-result');
  const checkboxes = Array.from(resBox.querySelectorAll('input[type="checkbox"]'));
  if (checkboxes.length > 0 && checkboxes.every(cb => cb.checked)) {
    let targetCat = currentActiveTaskRef?.category;
    if (targetTask) {
      let catToUse = targetCat; let idxToUse = -1;
      if (catToUse && state.items[catToUse]) idxToUse = state.items[catToUse].indexOf(targetTask);
      if (idxToUse === -1) {
        for (const cat of ['daily', 'weekly', 'todo', 'occasionally', 'termine']) {
          const idx = (state.items[cat] || []).indexOf(targetTask);
          if (idx !== -1) { catToUse = cat; idxToUse = idx; break; }
        }
      }
      setTimeout(() => {
        closeAdhdModal(); delete state.completedSteps[targetTask]; saveState();
        if (catToUse && idxToUse !== -1) handleCompleteTask(catToUse, idxToUse);
        else {
          playProceduralSound(); showPraise();
          showToast({
            de: `🎉 Alle Schritte gelöst! "${targetTask}" ist erledigt!`,
            en: `🎉 All steps completed! "${targetTask}" is done!`,
            es: `🎉 ¡Todos los pasos completados! ¡"${targetTask}" está terminado!`,
            el: `🎉 Όλα τα βήματα ολοκληρώθηκαν! Η εργασία "${targetTask}" έγινε!`
          }[currentLang]);
        }
      }, 350);
    }
  }
}

let audioCtx = null;
let currentSoundType = null;
let soundGainNode = null;
let soundOscillators = [];
let soundMasterVolume = 0.5;
let activeUserAudio = null;

function initAudioContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}
function playAmbientSound(type) {
  initAudioContext(); stopAmbientSound(true);
  currentSoundType = type; soundGainNode = audioCtx.createGain();
  soundGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  soundGainNode.connect(audioCtx.destination);
  soundGainNode.gain.linearRampToValueAtTime(soundMasterVolume * 0.25, audioCtx.currentTime + 1.5);
  if (type === 'rain' || type === 'wind' || type === 'ocean') {
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'rain') {
        lastOut = (lastOut * 0.95) + (white * 0.05); output[i] = lastOut * 3;
      } else if (type === 'ocean') {
        lastOut = (lastOut * 0.98) + (white * 0.02); output[i] = lastOut * 4;
      } else output[i] = white * 0.15;
    }
    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer; whiteNoise.loop = true;
    const filter = audioCtx.createBiquadFilter(); filter.type = 'lowpass';
    filter.frequency.setValueAtTime(type === 'rain' ? 800 : (type === 'ocean' ? 400 : 1200), audioCtx.currentTime);
    whiteNoise.connect(filter); filter.connect(soundGainNode); whiteNoise.start();
    soundOscillators.push(whiteNoise);
  } else if (type === 'alpha') {
    const oscL = audioCtx.createOscillator(); const oscR = audioCtx.createOscillator();
    const merger = audioCtx.createChannelMerger(2);
    oscL.frequency.setValueAtTime(200, audioCtx.currentTime);
    oscR.frequency.setValueAtTime(210, audioCtx.currentTime);
    oscL.connect(merger, 0, 0); oscR.connect(merger, 0, 1);
    merger.connect(soundGainNode); oscL.start(); oscR.start();
    soundOscillators.push(oscL, oscR);
  }
  updateSoundscapeUI();
  const toastLabel = { de: 'Focus Sound: gestartet 🎧', en: 'Focus Sound: started 🎧', es: 'Sonido de Enfoque: iniciado 🎧', el: 'Ήχος Εστίασης: ξεκίνησε 🎧' }[currentLang];
  showToast(`${toastLabel}`);
}
function stopAmbientSound(silent = false) {
  if (soundGainNode && audioCtx) {
    const activeGain = soundGainNode; const activeOscs = [...soundOscillators];
    const activeAudio = activeUserAudio;
    activeGain.gain.setValueAtTime(activeGain.gain.value, audioCtx.currentTime);
    activeGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);
    setTimeout(() => {
      activeOscs.forEach(osc => { try { osc.stop(); } catch(e) {} });
      if (activeAudio) {
        try {
          activeAudio.pause();
          activeAudio.src = "";
        } catch(e) {}
      }
    }, 850);
  }
  soundOscillators = []; activeUserAudio = null; currentSoundType = null; updateSoundscapeUI();
  const nameLabel = document.getElementById('user-sound-name'); if (nameLabel) nameLabel.classList.add('hidden');
  if (!silent) {
    const toastLabel = { de: 'Focus Sound gestoppt', en: 'Focus Sound stopped', es: 'Sonido de enfoque detenido', el: 'Ήχος εστίασης σταμάτησε' }[currentLang];
    showToast(toastLabel);
  }
}
function handleUserSoundFile(event) {
  const file = event.target.files?.[0]; if (!file) return;
  initAudioContext(); stopAmbientSound(true);
  const fileUrl = URL.createObjectURL(file);
  const audio = new Audio(fileUrl); audio.loop = true; activeUserAudio = audio;
  currentSoundType = 'custom'; soundGainNode = audioCtx.createGain();
  soundGainNode.gain.setValueAtTime(0, audioCtx.currentTime); soundGainNode.connect(audioCtx.destination);
  soundGainNode.gain.linearRampToValueAtTime(soundMasterVolume * 0.25, audioCtx.currentTime + 1.5);
  const source = audioCtx.createMediaElementSource(audio); source.connect(soundGainNode);
  audio.play().catch(e => { showToast("Fehler beim Abspielen der Datei."); });
  const nameLabel = document.getElementById('user-sound-name');
  if (nameLabel) { nameLabel.innerText = `🎵 ${file.name}`; nameLabel.classList.remove('hidden'); }
  updateSoundscapeUI(); showToast(currentLang === 'de' ? `Eigener Sound gestartet: ${file.name}` : `Custom sound started: ${file.name}`);
}
function setSoundVolume(val) {
  soundMasterVolume = parseFloat(val);
  if (soundGainNode && audioCtx) soundGainNode.gain.setValueAtTime(soundMasterVolume * 0.25, audioCtx.currentTime);
}
function updateSoundscapeUI() {
  ['rain', 'ocean', 'alpha', 'wind'].forEach(st => {
    const btn = document.getElementById(`sound-btn-${st}`);
    if (btn) {
      if (st === currentSoundType) btn.className = 'p-2 bg-blue-500/30 border border-blue-400 rounded-xl text-left text-xs text-white font-bold transition cursor-pointer flex items-center gap-2 shadow-sm animate-pulse';
      else btn.className = 'p-2 bg-white/5 hover:bg-blue-500/20 border border-white/10 rounded-xl text-left text-xs text-gray-200 font-semibold transition cursor-pointer flex items-center gap-2';
    }
  });
  const indicator = document.getElementById('soundscape-indicator');
  if (indicator) {
    if (currentSoundType) indicator.classList.remove('hidden');
    else indicator.classList.add('hidden');
  }
}

function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const particles = []; const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#38bdf8', '#a855f7'];
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200, y: canvas.height / 3 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.8) * 12, size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)], life: 1, decay: Math.random() * 0.02 + 0.015,
      rotation: Math.random() * Math.PI * 2, vRot: (Math.random() - 0.5) * 0.2
    });
  }
  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); let active = false;
    particles.forEach(p => {
      if (p.life > 0) {
        active = true; p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.life -= p.decay; p.rotation += p.vRot;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation); ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life); ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size); ctx.restore();
      }
    });
    if (active) requestAnimationFrame(frame); else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(frame);
}
function showPraise() {
  const praises = TRANSLATIONS[currentLang]?.praise || TRANSLATIONS.de.praise;
  const msg = praises[Math.floor(Math.random() * praises.length)];
  const overlay = document.getElementById('praise-overlay');
  const card = document.getElementById('praise-card');
  card.innerText = msg; overlay.classList.remove('hidden');
  card.style.animation = 'scaleBounce 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
  setTimeout(() => overlay.classList.add('hidden'), 1100);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'z' || e.key === 'Z') {
    if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault(); toggleMinimalist(); return;
    }
  }
  if (e.key === 'Escape') {
    closeAdhdModal();
    ['feedback', 'report', 'settings', 'soundscape', 'language'].forEach(p => {
      const el = document.getElementById(`panel-${p}`); if (el) el.classList.add('hidden');
    });
    return;
  }
  if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
    e.preventDefault(); toggleTimer();
  }
});

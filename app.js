// Globale Standardwertänderung auf 5 Minuten (300 Sekunden)
timerSeconds = 5 * 60;
timerInitialSeconds = 5 * 60;

// Eigene Audio Playlist für sequentielles Crossfading
let customPlaylist = [];
let customPlaylistIndex = 0;
let audioA = null;
let audioB = null;
let currentChannel = 'A';
const CROSSFADE_TIME = 4; // Sekunden für den Crossfade
let crossfadeCheckInterval = null;
let isPlaylistPaused = false;
let isAmbientPaused = false;
let ambientFadeInterval = null;
let playlistFadeInterval = null;
let customPlaylistObjectUrls = [];

// Wikimedia Commons Pfade für Ambiences (Naturgeräusche)
const AMBIENT_SOUNDS = {
  rain: "https://upload.wikimedia.org/wikipedia/commons/8/80/Bourne_woods_rain_2020-05-10_0757.mp3",
  ocean: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Het_kabbelen_van_water_-_SoundCloud_-_Beeld_en_Geluid.ogg",
  wind: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Bourne_woods_windy_2020-05-05_0753.mp3",
  forest: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Bourne_Woods_2020-05-29_0758.mp3",
  fire: "https://upload.wikimedia.org/wikipedia/commons/5/52/Campfire_sound_ambience.ogg",
  cafe: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Bertoldsbrunnen_mit_Tram.mp3",
  crickets: "https://upload.wikimedia.org/wikipedia/commons/1/12/Cicada_calling_in_Irving%2C_TX_in_June_of_2012.ogg",
  birds: "https://upload.wikimedia.org/wikipedia/commons/1/10/Chaffinch_singing_2013-05-25.mp3",
  thunder: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Thunder_storm_ambience.mp3"
};

// Farbwert-Hintergründe für Premium-Kontraste
const THEME_BACKGROUNDS = {
  ocean: '#0b1329',
  aurora: '#0f0e26',
  pal: '#1f0d19',
  cozy: '#18130e',
  emerald: '#0c1b15',
  rose: '#1f0d12',
  cyber: '#0f1115',
  midnight: '#0b0c16'
};

// Antrieb Mikro-Aktivitäten
const BOOST_ACTIVITIES_DE = [
  "Trinke 3 Schlucke frisches, eiskaltes Wasser 💧",
  "Strecke deine Arme 10 Sekunden lang fest Richtung Decke 🙋‍♂️",
  "Räume einen einzigen Gegenstand auf deinem Tisch auf 🧹",
  "Schüttle deine Hände 15 Sekunden lang ganz locker aus 🫨",
  "Atme 3-mal ganz tief durch die Nase ein und den Mund aus 🌬️",
  "Rolle deine Schultern 5-mal langsam nach hinten 🧘",
  "Lächle dich selbst auf dem ausgeschalteten Bildschirm für 10 Sekunden an! 😁",
  "Kreise deine Fußgelenke 5-mal in beide Richtungen 🦶",
  "Lüfte einmal kurz stoß für 30 Sekunden dein Zimmer durch 🍃",
  "Mache 5 schnelle Kniebeugen oder Hampelmänner 🏃‍♂️",
  "Schließe die Augen und zähle langsam von 10 rückwärts 🤫",
  "Blicke für 20 Sekunden auf den am weitesten entfernten Punkt aus dem Fenster 🪟",
  "Lies eine einzige Buchseite oder einen kurzen Artikelabsatz 📖",
  "Klopfe sanft mit den Fingerspitzen deine Kopfhaut ab (Mikro-Massage) 💆",
  "Summe 10 Sekunden lang deine Lieblingsmelodie vor dich hin 🎵",
  "Richte deine Haltung auf und nimm einen tiefen, bewussten Atemzug 🧍"
];

const BOOST_ACTIVITIES_EN = [
  "Drink 3 sips of fresh, ice-cold water 💧",
  "Stretch your arms tightly towards the ceiling for 10 seconds 🙋‍♂️",
  "Tidy up a single object on your desk 🧹",
  "Vigorously shake out your hands for 15 seconds 🫨",
  "Take 3 deep breaths in through your nose and out through your mouth 🌬️",
  "Roll your shoulders slowly backwards 5 times 🧘",
  "Smile at yourself on your black screen for 10 seconds! 😁",
  "Rotate your ankles 5 times in both directions 🦶",
  "Air out your room for 30 seconds 🍃",
  "Do 5 quick squats or jumping jacks 🏃‍♂️",
  "Close your eyes and count backwards slowly from 10 🤫",
  "Look out the window at the furthest point for 20 seconds 🪟",
  "Read a single page of a book or a short paragraph 📖",
  "Gently tap your scalp with your fingertips (micro-massage) 💆",
  "Hum your favorite tune for 10 seconds 🎵",
  "Correct your posture and take a deep, conscious breath 🧍"
];

// ISO-Kalenderwoche berechnen
function getISOWeekKey(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1)/7);
  return `${date.getUTCFullYear()}-W${weekNo}`;
}

document.addEventListener('DOMContentLoaded', () => {
  setTheme(currentTheme);
  setLanguage(currentLang);
  updateDateAndStreak();
  renderApp();
  populateAdhdTaskSelect();
  const btnHeader = document.getElementById('timer-toggle-btn');
  if (btnHeader) {
    btnHeader.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>';
  }
  lucide.createIcons();
  
  checkMondayReset();
  checkAndTriggerAutoExports();
});

function setTheme(theme) {
  currentTheme = theme;
  document.body.className = `h-full antialiased flex flex-col font-sans select-none overflow-x-hidden text-[#f4f4f5] theme-${theme}`;
  
  // Setzt dynamisch den passenden dunklen Hintergrund für perfektes Kontrastverhältnis
  if (THEME_BACKGROUNDS[theme]) {
    document.body.style.backgroundColor = THEME_BACKGROUNDS[theme];
  }
  
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
  populateAdhdTaskSelect();
}

function translateUI() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (TRANSLATIONS[currentLang]?.[key] && key !== 'report') el.innerText = TRANSLATIONS[currentLang][key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (TRANSLATIONS[currentLang]?.[key]) el.setAttribute('placeholder', TRANSLATIONS[currentLang][key]);
  });
  
  const reportBtn = document.getElementById('btn-label-report');
  if (reportBtn) {
    reportBtn.innerText = currentLang === 'de' ? 'Statistik' : 'Statistics';
  }
  const reportTitle = document.getElementById('report-title');
  if (reportTitle) {
    reportTitle.innerText = currentLang === 'de' ? 'Statistik' : 'Statistics';
  }
  
  // Energizer Button Übersetzung anpassen
  const boostBtn = document.getElementById('btn-label-boost');
  if (boostBtn) {
    boostBtn.innerText = currentLang === 'de' ? 'Energizer' : 'Energizer';
  }
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
    article.className = 'min-h-[380px] h-full flex flex-col p-3 rounded-2xl border border-white/[0.08] bg-[#13131a]/75 backdrop-blur-md shadow-lg hover:border-[var(--accent)]/30 transition-all duration-300';
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
        itemDiv.className = 'group p-2 text-[11px] text-gray-400 hover:text-white border border-dashed border-slate-700 hover:border-purple-500 rounded-lg bg-slate-800/25 hover:bg-purple-900/20 cursor-pointer font-medium hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 ease-out flex items-center justify-between gap-1 shadow-sm';
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
        itemDiv.className = `group relative w-full min-h-[44px] flex flex-col justify-center gap-1 p-2.5 border-0 border-l-[4px] ${isToday ? 'border-amber-400 bg-amber-500/10' : 'border-[var(--accent)] bg-white/[0.03]'} hover:bg-[rgba(139,92,246,0.18)] hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.99] text-gray-300 font-medium leading-tight hover:shadow-lg transition-all duration-200 ease-out rounded-lg cursor-pointer`;
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
        btnEl.className = 'mt-2 w-full min-h-[38px] p-2 rounded-lg border border-dashed border-white/15 bg-[#0a0a0e] hover:bg-[#13131e] text-center text-xs text-gray-400 hover:text-white font-semibold hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm';
        const btnT = { de: '＋ Termin eintragen', en: '＋ Add Appointment', es: '＋ Añadir Cita', el: '＋ Προσθήκη Ραντεβού' }[currentLang] || '＋ Add';
        btnEl.innerHTML = `<i data-lucide="calendar-plus" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i><span>${btnT}</span>`;
        listEl.appendChild(btnEl);
      } else {
        const formDiv = document.createElement('div');
        formDiv.className = 'mt-2 p-3 bg-[#0e0e14] border border-[var(--accent)]/40 rounded-xl flex flex-col gap-2.5 shadow-lg';
        const formT = { de: 'Neuer Termin', en: 'New Appointment', es: 'Nueva Cita', el: 'Νέο Ραντεβού' }[currentLang] || 'New';
        const nameT = { de: 'Termin Name (z.B. Zahnarzt)...', en: 'Appointment (e.g., Dentist)...', es: 'Nombre de la cita (ej. Dentista)...', el: 'Όνομα ραντεβού (π.χ. Οδοντίατρος)...' }[currentLang] || 'Name';
        const dateT = { de: 'Datum', en: 'Date', es: 'Fecha', el: 'Ημερομηnía' }[currentLang] || 'Date';
        const timeT = { de: 'Uhrzeit', en: 'Time', es: 'Ώρα' }[currentLang] || 'Time';
        const saveT = { de: 'Speichern', en: 'Save', es: 'Guardar', el: 'Αποθήкеυση' }[currentLang] || 'Save';
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
        itemDiv.className = `group relative w-full min-h-[42px] flex items-center justify-between p-2 border-0 border-l-[4px] ${isTaskActive ? 'border-amber-400 bg-amber-500/15 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'border-[var(--accent)] bg-white/[0.03]'} hover:bg-[rgba(139,92,246,0.18)] text-gray-300 font-medium leading-tight hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.99] hover:shadow-lg hover:border-[var(--accent)]/30 transition-all duration-200 ease-out rounded-lg cursor-pointer`;
        const safeTaskEscaped = taskText.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        itemDiv.innerHTML = `
          <button onclick="handleCompleteTask('${id}', ${index}, event)" class="flex items-center gap-2 w-full text-left bg-transparent border-0 text-inherit cursor-pointer p-0 min-w-0 pr-1 transition-all duration-150">
            <i data-lucide="${iconName}" class="w-3.5 h-3.5 ${isTaskActive ? 'text-amber-400 animate-pulse' : 'text-[var(--accent-light)]'} shrink-0"></i>
            <span class="block text-xs leading-snug min-w-0 flex-1 font-medium text-gray-200 truncate ${isTaskActive ? 'text-amber-200 font-bold' : ''}" title="${taskText.replace(/"/g, '&quot;')}">${taskText}</span>
          </button>
          <div class="absolute right-[2px] top-[-18px] flex items-center gap-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition duration-150 shrink-0 bg-[#13131a] border border-white/10 px-1 py-0.5 rounded-lg shadow-lg z-20">
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
      addInput.className = 'w-full min-h-[38px] p-2 rounded-lg border border-white/10 bg-[#0a0a0e] hover:bg-[#111118] text-center text-xs placeholder:text-gray-500 focus:outline-none focus:border-[var(--accent)] hover:scale-[1.01] transition-all duration-150 cursor-text font-semibold text-gray-300';
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
  
  // Automatischer Farbwechsel beim Erledigen einer Aufgabe
  const themesList = ['ocean', 'aurora', 'pal', 'cozy', 'emerald', 'rose', 'cyber', 'midnight'];
  const availableThemes = themesList.filter(t => t !== currentTheme);
  const randomTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
  setTheme(randomTheme);
  
  // WICHTIG: Timer wird beim Erledigen gestoppt und zurückgesetzt
  resetTimer();
  
  saveState(); playProceduralSound(); triggerConfetti(); showPraise(); renderApp(); populateAdhdTaskSelect();
}

// Global Panels management
let hoverPanelTimeout = null;
function showPanelHover(panelName) {
  clearTimeout(hoverPanelTimeout);
  ['feedback', 'report', 'settings', 'soundscape', 'language', 'theme', 'sync', 'music', 'boost'].forEach(p => {
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
  ['feedback', 'report', 'settings', 'soundscape', 'language', 'theme', 'sync', 'music', 'boost'].forEach(p => {
    const el = document.getElementById(`panel-${p}`); if (!el) return;
    if (p === panelName) {
      el.classList.toggle('hidden');
      if (p === 'report' && !el.classList.contains('hidden')) updateReportPanel();
    } else { el.classList.add('hidden'); }
  });
}

function deleteTask(category, index, event) {
  if (event) event.stopPropagation();
  saveHistory();
  const taskObj = state.items[category][index];
  const taskText = typeof taskObj === 'object' ? taskObj?.task : taskObj;
  state.items[category].splice(index, 1);
  if (taskText && state.completedSteps) delete state.completedSteps[taskText];
  saveState(); showToast(currentLang === 'de' ? 'Aufgabe gelöscht' : 'Task deleted'); renderApp(); populateAdhdTaskSelect();
}

function handleRestoreDoneTask(doneIndex) {
  saveHistory();
  const reversedIndex = state.done.length - 1 - doneIndex;
  const item = state.done[reversedIndex];
  if (!item) return;
  state.done.splice(reversedIndex, 1);
  const targetCat = state.items[item.origin] ? item.origin : 'daily';
  state.items[targetCat].push(item.task);
  saveState(); showToast(currentLang === 'de' ? 'Aufgabe wiederhergestellt' : 'Task restored'); renderApp(); populateAdhdTaskSelect();
}

let draggedItemInfo = null;
function handleDragStart(e, category, index) {
  draggedItemInfo = { category, index };
  e.dataTransfer.setData('text/plain', JSON.stringify({ category, index }));
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }

// DnD Drop-Handler für Drag & Drop von Listenelementen
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

let reportTimeframe = 'today';
function setReportTimeframe(tf) {
  reportTimeframe = tf;
  ['today', 'week', 'month'].forEach(t => {
    const btn = document.getElementById(`report-tab-${t}`);
    if (btn) {
      if (t === tf) btn.className = 'px-2.5 py-1 rounded text-[var(--accent-light)] bg-[var(--accent)]/25 cursor-pointer font-bold';
      else btn.className = 'px-2.5 py-1 rounded text-gray-400 hover:text-white cursor-pointer';
    }
  });
  updateReportPanel();
}

// 7-Tage-Produktivitätsdiagramm (Woche von Montag bis Sonntag)
function renderWeeklyChart() {
  const chartEl = document.getElementById('report-weekly-chart');
  const totalWeekTasksEl = document.getElementById('report-total-week-tasks');
  if (!chartEl) return;

  chartEl.innerHTML = '';
  const now = new Date();
  
  // Bestimmt den aktuellen Montag der Woche
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0,0,0,0);
  
  const weekdaysShort = {
    de: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
    en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };

  const currentWeekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    currentWeekDays.push({
      date: iso,
      label: weekdaysShort[currentLang]?.[i] || weekdaysShort['en'][i],
      count: 0
    });
  }

  let totalWeekCount = 0;
  (state.done || []).forEach(item => {
    const found = currentWeekDays.find(day => day.date === item.date);
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

  const maxCount = Math.max(...currentWeekDays.map(d => d.count), 4);

  currentWeekDays.forEach(day => {
    const pct = (day.count / maxCount) * 100;
    const isToday = day.date === now.toISOString().split('T')[0];
    const barCol = isToday ? 'bg-amber-400' : 'bg-[var(--accent)]';
    const barBg = isToday ? 'bg-amber-500/10 border-amber-400/20' : 'bg-[var(--accent)]/10 border-purple-500/20';

    const barWrapper = document.createElement('div');
    barWrapper.className = 'flex flex-col items-center gap-1.5 flex-1 max-w-[40px]';
    barWrapper.innerHTML = `
      <span class="text-[9px] font-bold font-mono ${day.count > 0 ? 'text-white' : 'text-gray-600'}">${day.count}</span>
      <div class="w-5 h-12 ${barBg} border rounded-md relative flex items-end overflow-hidden" title="${day.date}: ${day.count}">
        <div class="w-full ${barCol} transition-all duration-500 rounded-t" style="height: ${pct}%"></div>
      </div>
      <span class="text-[9px] font-bold ${isToday ? 'text-amber-300 font-extrabold' : 'text-gray-400'}">${day.label}</span>
    `;
    chartEl.appendChild(barWrapper);
  });
}

// Bild-Export der Statistik
function exportReportAsImage() {
  const target = document.getElementById('report-export-target');
  if (!target) return;
  
  showToast(currentLang === 'de' ? 'Grafik wird erstellt... 📸' : 'Generating card... 📸');
  
  html2canvas(target, {
    backgroundColor: '#111116',
    scale: 2,
    useCORS: true,
    logging: false
  }).then(canvas => {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const timeframeLabel = reportTimeframe === 'today' ? 'heute' : (reportTimeframe === 'week' ? 'woche' : 'monat');
    link.download = `flow-stats-${timeframeLabel}-${new Date().toISOString().split('T')[0]}.png`;
    link.href = dataUrl;
    link.click();
    showToast(currentLang === 'de' ? 'Statistik-Bild gespeichert!' : 'Stats card saved successfully!');
  }).catch(err => {
    console.error(err);
    showToast(currentLang === 'de' ? 'Fehler beim Erstellen der Grafik.' : 'Failed to export image.');
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
  
  // Timeframe Indikator auf dem Export-Bild aktualisieren
  const badgeEl = document.getElementById('report-export-timeframe-badge');
  if (badgeEl) {
    if (reportTimeframe === 'today') badgeEl.innerText = currentLang === 'de' ? 'Heute' : 'Today';
    else if (reportTimeframe === 'week') badgeEl.innerText = currentLang === 'de' ? 'Woche' : 'Week';
    else if (reportTimeframe === 'month') badgeEl.innerText = currentLang === 'de' ? 'Monat' : 'Month';
  }

  // 7-Tage-Aktivität nur anzeigen, wenn der Wochen-Tab ausgewählt ist
  const chartContainer = document.getElementById('report-chart-container');
  if (chartContainer) {
    if (reportTimeframe === 'week') {
      chartContainer.classList.remove('hidden');
      renderWeeklyChart();
    } else {
      chartContainer.classList.add('hidden');
    }
  }

  const catBarsEl = document.getElementById('report-category-bars');
  if (catBarsEl) {
    catBarsEl.innerHTML = '';
    const catStats = [
      { 
        id: 'daily', 
        label: (reportTimeframe === 'week' || reportTimeframe === 'month') 
          ? (currentLang === 'de' ? 'Tägliche' : 'Daily') 
          : t('daily') 
      },
      { id: 'weekly', label: t('weekly') },
      { id: 'todo', label: t('todo') },
      { 
        id: 'occasionally', 
        label: (currentLang === 'de' ? 'Gelegentliche' : t('occasionally')) 
      }
    ];
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

  // Strenges & intelligentes Feedback
  const insightEl = document.getElementById('report-insight-text');
  if (insightEl) {
    if (reportTimeframe === 'today') {
      if (count === 0) {
        insightEl.innerText = currentLang === 'de'
          ? '0 Aufgaben? Der Tag ist fast vorbei und du hast noch nichts geschafft! Such dir sofort eine kleine Aufgabe und fang an! 😤'
          : '0 tasks? The day is slipping away and you achieved nothing! Pick a small task right now! 😤';
      } else if (count < 3) {
        insightEl.innerText = currentLang === 'de'
          ? `Erst ${count} Aufgaben erledigt. Das geht besser! Lass dich nicht ablenken, der Tag hat noch Stunden. 🦾`
          : `Only ${count} tasks completed. You can do better! Avoid distractions, the day is not over. 🦾`;
      } else {
        insightEl.innerText = currentLang === 'de'
          ? `Ordentlich, ${count} Aufgaben geschafft. Aber ruh dich nicht zu früh aus – zieh noch eine durch! ⚡`
          : `Decent, ${count} tasks done. Don't rest too early – push for one more! ⚡`;
      }
    } else if (reportTimeframe === 'week') {
      const pendingTasks = [];
      ['daily', 'weekly', 'todo'].forEach(cat => {
        (state.items[cat] || []).forEach(t => {
          const name = typeof t === 'object' ? t.task : t;
          if (!pendingTasks.includes(name)) pendingTasks.push(name);
        });
      });
      
      let pendingStr = '';
      if (pendingTasks.length > 0) {
        const maxShow = 3;
        const slice = pendingTasks.slice(0, maxShow);
        pendingStr = slice.map(t => `"${t}"`).join(', ');
        if (pendingTasks.length > maxShow) pendingStr += ` und ${pendingTasks.length - maxShow} weitere`;
      }
      
      if (count === 0) {
        insightEl.innerText = currentLang === 'de'
          ? `Ganze Woche faul gewesen? 0 erledigte Aufgaben! Diese wichtigen Dinge stehen noch aus: ${pendingStr || 'Keine Aufgaben'}. Ändere das! 😠`
          : `Lazy week? 0 completed tasks! These crucial tasks are still pending: ${pendingStr || 'None'}. Change this! 😠`;
      } else {
        insightEl.innerText = currentLang === 'de'
          ? `Wochenbilanz: ${count} erledigt. Aber Achtung! Diese Aufgaben wurden ignoriert: ${pendingStr || 'keine'}. Bring das in Ordnung! ⚠️`
          : `Weekly balance: ${count} completed. But beware! These vital tasks were ignored: ${pendingStr || 'none'}. Fix this! ⚠️`;
      }
    } else if (reportTimeframe === 'month') {
      if (count < 10) {
        insightEl.innerText = currentLang === 'de'
          ? `Unterdurchschnittlicher Monat! Nur ${count} Aufgaben erledigt. Setz dich hin und strukturiere deinen Plan neu. Keine Ausreden mehr! 🔍`
          : `Subpar month! Only ${count} tasks completed. Sit down and restructure your plan. No more excuses! 🔍`;
      } else {
        insightEl.innerText = currentLang === 'de'
          ? `Monatsbilanz: ${count} Aufgaben geschafft. Akzeptabel, aber du weißt genau, dass du dein volles Potenzial noch nicht ausgeschöpft hast! 🚀`
          : `Monthly stats: ${count} tasks completed. Acceptable, but you know you haven't reached your full potential yet! 🚀`;
      }
    }
  }

  const list = document.getElementById('report-list');
  if (list) {
    list.innerHTML = '';
    if (filteredDone.length > 0) {
      filteredDone.slice().reverse().forEach(item => {
        const div = document.createElement('div'); div.className = 'p-2 bg-white/[0.02] border border-white/5 rounded-lg flex justify-between items-center text-gray-300 hover:bg-white/5 hover:scale-[1.01] transition-all duration-150';
        const catLabel = t(item.origin) || item.origin;
        div.innerHTML = `<div class="flex items-center gap-1.5 overflow-hidden pr-2"><span class="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">${catLabel}</span><span class="truncate font-medium text-xs text-white">${item.task}</span></div><span class="text-gray-500 font-mono text-[10px] shrink-0">${item.time || ''}</span>`;
        list.appendChild(div);
      });
    }
  }
}

// Besser gestaltetes, freundliches Feedback per Mail-Versand
function submitFeedback() {
  const text = document.getElementById('feedback-text').value;
  if (text.trim()) {
    showToast(currentLang === 'de' ? 'Sende Feedback an jmonke@gmail.com... 📬' : 'Sending feedback to jmonke@gmail.com... 📬');
    
    setTimeout(() => {
      const subject = encodeURIComponent("Flow Planner Feedback");
      const body = encodeURIComponent(text);
      window.location.href = `mailto:jmonke@gmail.com?subject=${subject}&body=${body}`;
      
      showToast(currentLang === 'de' ? 'Vielen Dank für deine Ideen und Kritik! ❤️' : 'Thank you so much for your feedback! ❤️');
      document.getElementById('feedback-text').value = '';
      togglePanel('feedback');
    }, 1200);
  }
}

// -------------------------------------------------------------
// ADAPTIVE OVERRIDES (ADHD Steps, Click-To-Dismiss & Inline Timer Sync)
// -------------------------------------------------------------

function generateTaskSteps(specificTask) {
  let val = specificTask;
  if (!val) {
    const select = document.getElementById('adhd-task-select'); 
    val = select ? select.value : '';
  }
  if (!val) {
    const resBox = document.getElementById('adhd-steps-result');
    if (resBox) resBox.innerHTML = `<p class="text-xs text-gray-400 italic text-center py-4">${currentLang === 'de' ? 'Bitte wähle oben eine Aufgabe aus.' : 'Please select a task.'}</p>`;
    return;
  }
  
  if (!currentActiveTaskRef || currentActiveTaskRef.task !== val) {
    currentActiveTaskRef = { task: val };
  }
  
  const resBox = document.getElementById('adhd-steps-result'); 
  if (!resBox) return;
  
  const deKey = getGermanStandardKey(val);
  let steps = TASK_STEPS_DATABASE[deKey]?.[currentLang];
  if (!steps || steps.length === 0) {
    const template = FALLBACK_STEPS[currentLang] || FALLBACK_STEPS['en'];
    steps = template.map(step => step.replace('{task}', val));
  }
  
  currentGeneratedSteps = [...steps]; 
  resBox.innerHTML = '';
  
  if (!state.completedSteps) state.completedSteps = {};
  const completedIndices = state.completedSteps[val] || [];
  
  const remainingSteps = steps.map((text, idx) => ({ text, originalIdx: idx }))
                               .filter(item => !completedIndices.includes(item.originalIdx));
  
  if (remainingSteps.length === 0) {
    resBox.innerHTML = `<p class="text-xs text-emerald-400 font-bold text-center py-4">${currentLang === 'de' ? '🎉 Alle Schritte für diese Aufgabe sind erledigt!' : '🎉 All steps for this task are completed!'}</p>`;
    return;
  }
  
  remainingSteps.forEach((item) => {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'group relative flex items-start gap-2.5 p-3 bg-white/[0.03] hover:bg-purple-500/10 rounded-xl border border-white/5 cursor-pointer transform transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 shadow-sm';
    
    const hoverHint = currentLang === 'de' ? 'Klicken zum Erledigen ✕' : 'Click to complete ✕';
    
    stepDiv.innerHTML = `
      <div class="flex-1 text-gray-200 leading-snug pr-8 transition-colors group-hover:text-purple-200">
        ${item.text}
      </div>
      <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md">
        ${hoverHint}
      </span>
    `;
    
    stepDiv.onclick = () => {
      playProceduralSound();
      stepDiv.classList.add('opacity-0', 'scale-95', '-translate-y-1');
      setTimeout(() => {
        dismissStep(val, item.originalIdx);
      }, 200);
    };
    
    resBox.appendChild(stepDiv);
  });
  
  lucide.createIcons();
}

function dismissStep(taskName, originalIdx) {
  if (!state.completedSteps) state.completedSteps = {};
  if (!state.completedSteps[taskName]) state.completedSteps[taskName] = [];
  
  if (!state.completedSteps[taskName].includes(originalIdx)) {
    state.completedSteps[taskName].push(originalIdx);
  }
  saveState();
  
  const deKey = getGermanStandardKey(taskName);
  let totalStepsCount = TASK_STEPS_DATABASE[deKey]?.[currentLang]?.length;
  if (!totalStepsCount) {
    totalStepsCount = (FALLBACK_STEPS[currentLang] || FALLBACK_STEPS['en']).length;
  }
  
  const completedCount = state.completedSteps[taskName].length;
  
  if (completedCount >= totalStepsCount) {
    delete state.completedSteps[taskName];
    saveState();
    
    let catToUse = currentActiveTaskRef?.category;
    let idxToUse = -1;
    if (catToUse && state.items[catToUse]) {
      idxToUse = state.items[catToUse].indexOf(taskName);
    }
    if (idxToUse === -1) {
      for (const cat of ['daily', 'weekly', 'todo', 'occasionally', 'termine']) {
        const idx = (state.items[cat] || []).indexOf(taskName);
        if (idx !== -1) { catToUse = cat; idxToUse = idx; break; }
      }
    }
    
    closeAdhdModal();
    
    if (catToUse && idxToUse !== -1) {
      handleCompleteTask(catToUse, idxToUse);
    } else {
      playProceduralSound();
      triggerConfetti();
      showPraise();
      showToast({
        de: `🎉 Alle Schritte gelöst! "${taskName}" ist erledigt!`,
        en: `🎉 All steps completed! "${taskName}" is done!`
      }[currentLang]);
    }
  } else {
    generateTaskSteps(taskName);
  }
}

function startTaskTimer(taskName, event) {
  if (event) event.stopPropagation(); 
  if (!taskName) return;
  
  activeTimerTask = taskName; 
  timerSeconds = 5 * 60; // Standardwert auf 5 Min angepasst
  timerInitialSeconds = 5 * 60;
  
  if (!timerRunning) {
    toggleTimer(); 
  } else {
    updateTimerDisplay();
  }
  
  updateActiveTimerBadge(); 
  renderApp(); 
  showToast(`⏱️ ${t('timer_title')}: "${taskName}"`);
  syncStepsTimerWidget();
}

function syncStepsTimerWidget() {
  const widget = document.getElementById('adhd-steps-timer-widget');
  const taskLabel = document.getElementById('adhd-steps-timer-task');
  
  if (widget && taskLabel) {
    if (activeTimerTask && currentActiveTaskRef && activeTimerTask === currentActiveTaskRef.task) {
      widget.classList.remove('hidden');
      taskLabel.innerText = activeTimerTask;
      taskLabel.title = activeTimerTask;
    } else {
      widget.classList.add('hidden');
    }
  }
  updateTimerDisplay();
}

function updateActiveTimerBadge() {
  const badge = document.getElementById('active-timer-badge');
  if (badge) {
    if (activeTimerTask) {
      badge.classList.remove('hidden'); 
      // Das kleine Symbol vor der Aufgabe wurde vollständig entfernt!
      badge.innerText = activeTimerTask;
      badge.title = `Fokus: ${activeTimerTask}`;
    } else { 
      badge.classList.add('hidden'); 
    }
  }
}

function updateTimerDisplay() {
  const mins = Math.floor(timerSeconds / 60); 
  const secs = timerSeconds % 60;
  const str = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  
  const headerDisp = document.getElementById('timer-display'); 
  if (headerDisp) headerDisp.innerText = str;
  
  const stepsDisp = document.getElementById('adhd-steps-timer-display');
  if (stepsDisp) stepsDisp.innerText = str;
  
  const progressBar = document.getElementById('timer-progress-bar');
  if (progressBar) {
    const pct = (timerSeconds / timerInitialSeconds) * 100;
    progressBar.style.width = `${pct}%`;
  }
  
  const stepsToggleBtn = document.getElementById('adhd-steps-timer-toggle');
  if (stepsToggleBtn) {
    if (timerRunning) {
      stepsToggleBtn.innerHTML = '<i data-lucide="pause" class="w-3.5 h-3.5 text-amber-400"></i>';
    } else {
      stepsToggleBtn.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 text-amber-300"></i>';
    }
    lucide.createIcons();
  }
}

function toggleTimer() {
  const btnHeader = document.getElementById('timer-toggle-btn');
  const labelPause = { de: 'Pause', en: 'Pause', es: 'Pausa', el: 'Παύση' }[currentLang] || 'Pause';
  
  if (timerRunning) {
    clearInterval(timerInterval); 
    timerRunning = false;
    if (btnHeader) {
      btnHeader.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>'; 
      lucide.createIcons();
    }
    updateActiveTimerBadge(); 
    renderApp();
  } else {
    timerRunning = true;
    if (btnHeader) {
      btnHeader.innerHTML = '<i data-lucide="pause" class="w-3.5 h-3.5 text-amber-400 animate-pulse"></i>'; 
      lucide.createIcons();
    }
    updateActiveTimerBadge(); 
    renderApp();
    
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--; 
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval); 
        timerRunning = false; 
        playProceduralSound();
        
        const tips = currentLang === 'de' ? BREAK_TIPS_DE : BREAK_TIPS_EN;
        const tip = tips[Math.floor(Math.random() * tips.length)];
        
        const breakTitle = currentLang === 'de' ? 'Fokus-Zeit abgelaufen! ☕' : 'Focus session finished! ☕';
        const breakTipLabel = currentLang === 'de' ? 'Empfehlung für deine Pause' : 'Break recommendation';
        alert(`🎉 ${breakTitle}\n\n${breakTipLabel}:\n👉 ${tip}`);
        
        if (btnHeader) {
          btnHeader.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>'; 
          lucide.createIcons();
        }
        updateActiveTimerBadge(); 
        renderApp();
        syncStepsTimerWidget();
      }
    }, 1000);
  }
  updateTimerDisplay();
}

function resetTimer() {
  clearInterval(timerInterval); 
  timerRunning = false; 
  timerSeconds = 5 * 60; // Standardwert 5 Min
  timerInitialSeconds = 5 * 60; 
  activeTimerTask = null;
  
  const btnHeader = document.getElementById('timer-toggle-btn');
  if (btnHeader) {
    btnHeader.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>';
    lucide.createIcons();
  }
  
  updateTimerDisplay(); 
  updateActiveTimerBadge(); 
  renderApp();
  syncStepsTimerWidget();
}

function openAdhdModal(type) {
  if (type === 'pick') {
    const modal = document.getElementById('adhd-pick-modal');
    if (modal) modal.classList.remove('hidden');
    pickRandomTask();
  } else if (type === 'steps') {
    const modal = document.getElementById('adhd-steps-modal');
    if (modal) modal.classList.remove('hidden');
    populateAdhdTaskSelect();
    syncStepsTimerWidget();
  }
}

function openTaskStepsModal(category, index, event) {
  if (event) event.stopPropagation();
  const task = state.items[category]?.[index]; 
  if (!task) return;
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
  syncStepsTimerWidget();
}

function onAdhdSelectTask() {
  const select = document.getElementById('adhd-task-select');
  const val = select ? select.value : '';
  if (val) { 
    currentActiveTaskRef = { task: val }; 
    generateTaskSteps(val); 
  }
  syncStepsTimerWidget();
}

// -------------------------------------------------------------
// WECHSELNDE PROC-SOUNDS, LOB-ANZEIGE & IMMER WECHSELNDE EFFEKTE
// -------------------------------------------------------------

function playProceduralSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    
    // 5 verschiedene akustische Muster (Arpeggios, Akkorde, Glitzereffekte)
    const soundMuster = Math.floor(Math.random() * 5);
    
    if (soundMuster === 0) {
      // Klassisches aufsteigendes C-Dur Arpeggio (Chimes)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const start = now + (idx * 0.08);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
        osc.start(start); osc.stop(start + 0.4);
      });
    } else if (soundMuster === 1) {
      // Glitzernder, harmonischer Doppelklang (Magic Bell)
      const freqs = [587.33, 880.00, 1174.66];
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now); osc.stop(now + 0.55);
      });
    } else if (soundMuster === 2) {
      // Voller, warmer Akkord
      const freqs = [329.63, 392.00, 523.25, 659.25];
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now); osc.stop(now + 0.45);
      });
    } else if (soundMuster === 3) {
      // Schnelle Glissando-Fanfare
      const notes = [392.00, 523.25, 783.99, 1567.98];
      notes.forEach((freq, idx) => {
        const start = now + (idx * 0.06);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.1, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
        osc.start(start); osc.stop(start + 0.3);
      });
    } else {
      // Filter-Sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440.00, now);
      osc.frequency.exponentialRampToValueAtTime(1760.00, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now); osc.stop(now + 0.4);
    }
  } catch(e) {}
}

function showPraise() {
  const praises = TRANSLATIONS[currentLang]?.praise || TRANSLATIONS.de.praise || ['Super gemacht!', 'Großartig!', 'Wunderbar!', 'Fantastisch!'];
  const msg = praises[Math.floor(Math.random() * praises.length)];
  const overlay = document.getElementById('praise-overlay');
  const card = document.getElementById('praise-card');
  if (card && overlay) {
    // Lob ein bisschen tiefer zeigen (Verringert den Abstand von oben)
    overlay.className = "hidden fixed inset-0 z-[1000] flex items-start justify-center pt-[25vh] pointer-events-none";
    
    card.innerText = msg; 
    overlay.classList.remove('hidden');
    card.style.animation = 'scaleBounce 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    
    // Ganz bisschen länger auf dem Bildschirm halten (3200ms statt 2500ms)
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 3200); 
  }
}

// Dynamischer Partikeleffekt-Generator (Zufälliger Wechsel zwischen Konfetti, Sternen, Seifenblasen & Raketen)
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  
  const effectType = Math.floor(Math.random() * 4); // 4 wechselnde Effekte
  const particles = [];
  const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#38bdf8', '#a855f7'];
  
  if (effectType === 0) {
    // 1. Klassisches Konfetti
    for (let i = 0; i < 65; i++) {
      particles.push({
        type: 'confetti',
        x: canvas.width / 2 + (Math.random() - 0.5) * 200, y: canvas.height / 3 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.8) * 12, size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)], life: 1, decay: Math.random() * 0.02 + 0.015,
        rotation: Math.random() * Math.PI * 2, vRot: (Math.random() - 0.5) * 0.2
      });
    }
  } else if (effectType === 1) {
    // 2. Funkelnder Sternenschauer
    for (let i = 0; i < 50; i++) {
      particles.push({
        type: 'star',
        x: canvas.width / 2 + (Math.random() - 0.5) * 100, y: canvas.height / 3,
        vx: (Math.random() - 0.5) * 14, vy: (Math.random() - 0.5) * 14, size: Math.random() * 6 + 4,
        color: '#fffa00', life: 1, decay: 0.022,
        rotation: Math.random() * Math.PI * 2, vRot: 0.1
      });
    }
  } else if (effectType === 2) {
    // 3. Aufsteigende Seifenblasen
    for (let i = 0; i < 40; i++) {
      particles.push({
        type: 'bubble',
        x: Math.random() * canvas.width, y: canvas.height + 20,
        vx: (Math.random() - 0.5) * 1.8, vy: -(Math.random() * 3.5 + 2), size: Math.random() * 11 + 5,
        color: colors[Math.floor(Math.random() * colors.length)], life: 1, decay: 0.009
      });
    }
  } else {
    // 4. Raketen-Feuerwerk (Pixel-Explosion)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 3.5;
    for (let i = 0; i < 75; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2.5;
      particles.push({
        type: 'pixel',
        x: centerX, y: centerY,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, size: Math.random() * 3.5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)], life: 1, decay: 0.018
      });
    }
  }
  
  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); let active = false;
    particles.forEach(p => {
      if (p.life > 0) {
        active = true; p.x += p.vx; p.y += p.vy; 
        if (p.type === 'confetti' || p.type === 'pixel') {
          p.vy += 0.3; // Schwerkraft-Simulation
        }
        p.life -= p.decay;
        ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        
        if (p.type === 'star') {
          ctx.beginPath();
          for (let j = 0; j < 5; j++) {
            ctx.lineTo(Math.cos((18 + j * 72) * Math.PI / 180) * p.size, -Math.sin((18 + j * 72) * Math.PI / 180) * p.size);
            ctx.lineTo(Math.cos((54 + j * 72) * Math.PI / 180) * (p.size/2), -Math.sin((54 + j * 72) * Math.PI / 180) * (p.size/2));
          }
          ctx.closePath(); ctx.fill();
        } else if (p.type === 'bubble') {
          ctx.strokeStyle = p.color; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.beginPath(); ctx.arc(-p.size/3, -p.size/3, p.size/4, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }
        ctx.restore();
      }
    });
    if (active) requestAnimationFrame(frame); else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(frame);
}

// -------------------------------------------------------------
// PLAYLIST MULTI-FILE UPLOADER MIT SEQUENTIELLEM CROSSFADING
// -------------------------------------------------------------

function handleUserSoundFile(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;
  
  stopAmbientSound(true); 
  
  // Vorherige URLs freigeben, um Speicherlecks zu verhindern
  customPlaylistObjectUrls.forEach(url => URL.revokeObjectURL(url));
  customPlaylistObjectUrls = [];
  
  customPlaylist = [];
  customPlaylistIndex = 0;
  isPlaylistPaused = false;
  
  for (let i = 0; i < files.length; i++) {
    const url = URL.createObjectURL(files[i]);
    customPlaylistObjectUrls.push(url);
    customPlaylist.push({
      name: files[i].name,
      url: url
    });
  }
  
  const playerWidget = document.getElementById('custom-playlist-player');
  if (playerWidget) playerWidget.classList.remove('hidden');

  const nameLabel = document.getElementById('user-sound-name');
  if (nameLabel) {
    nameLabel.innerText = `🎵 Playliste: ${files.length} Titel`;
    nameLabel.classList.remove('hidden');
  }
  
  showToast(currentLang === 'de' ? `${files.length} Titel zur Playlist hinzugefügt!` : `${files.length} tracks added to playlist!`);
  
  playPlaylistTrack(0);
}

function playPlaylistTrack(index) {
  if (customPlaylist.length === 0) return;
  
  if (index >= customPlaylist.length) index = 0;
  if (index < 0) index = customPlaylist.length - 1;
  customPlaylistIndex = index;
  
  const track = customPlaylist[index];
  const targetVolume = soundMasterVolume * 0.5;
  
  clearInterval(crossfadeCheckInterval);
  isPlaylistPaused = false;
  updatePlayerPlayPauseUI();
  
  if (currentChannel === 'A') {
    if (audioA) { audioA.pause(); audioA.src = ""; }
    audioA = new Audio(track.url);
    audioA.volume = targetVolume;
    activeUserAudio = audioA;
    
    audioA.play().catch(e => console.log("Abspielverzögerung:", e));
    
    if (audioB) {
      fadeAudioOut(audioB, CROSSFADE_TIME);
    }
    
    monitorCrossfade(audioA);
    currentChannel = 'B';
  } else {
    if (audioB) { audioB.pause(); audioB.src = ""; }
    audioB = new Audio(track.url);
    audioB.volume = targetVolume;
    activeUserAudio = audioB;
    
    audioB.play().catch(e => console.log("Abspielverzögerung:", e));
    
    if (audioA) {
      fadeAudioOut(audioA, CROSSFADE_TIME);
    }
    
    monitorCrossfade(audioB);
    currentChannel = 'A';
  }
  
  const nameLabel = document.getElementById('user-sound-name');
  if (nameLabel) {
    nameLabel.innerText = `🎵 Track ${customPlaylistIndex + 1}: ${track.name}`;
  }
}

function playNextTrackWithCrossfade() {
  if (customPlaylist.length === 0) return;
  const nextIdx = (customPlaylistIndex + 1) % customPlaylist.length;
  playPlaylistTrack(nextIdx);
}

function togglePlaylistPlayback() {
  const currentAudio = activeUserAudio;
  if (!currentAudio) return;
  
  clearInterval(playlistFadeInterval);
  const targetVolume = soundMasterVolume * 0.5;

  if (isPlaylistPaused) {
    // Schneller, kurzer Fade-In beim Fortsetzen
    currentAudio.volume = 0;
    currentAudio.play().catch(e => console.log(e));
    let vol = 0;
    playlistFadeInterval = setInterval(() => {
      vol += 0.05;
      if (vol >= targetVolume) {
        currentAudio.volume = targetVolume;
        clearInterval(playlistFadeInterval);
      } else {
        currentAudio.volume = vol;
      }
    }, 50);
    
    isPlaylistPaused = false;
    showToast(currentLang === 'de' ? "Musik eingeblendet ⏯️" : "Music faded in ⏯️");
  } else {
    // Sanftes, langsames Ausblenden beim Pausieren
    let vol = currentAudio.volume;
    playlistFadeInterval = setInterval(() => {
      vol -= 0.02;
      if (vol <= 0.01) {
        currentAudio.volume = 0;
        currentAudio.pause();
        clearInterval(playlistFadeInterval);
        isPlaylistPaused = true;
        showToast(currentLang === 'de' ? "Musik ausgeblendet ⏸️" : "Music faded out ⏸️");
        updatePlayerPlayPauseUI();
      } else {
        currentAudio.volume = vol;
      }
    }, 100);
  }
  updatePlayerPlayPauseUI();
  updateHeaderAmbiencesOpacity();
}

function updatePlayerPlayPauseUI() {
  const btn = document.getElementById('player-play-pause-btn');
  if (btn) {
    if (isPlaylistPaused) {
      btn.innerHTML = '<i data-lucide="play" class="w-4 h-4 text-blue-300"></i>';
    } else {
      btn.innerHTML = '<i data-lucide="pause" class="w-4 h-4 text-blue-300"></i>';
    }
    lucide.createIcons();
  }
}

function fadeAudioOut(audioEl, duration) {
  if (!audioEl) return;
  const startVol = audioEl.volume;
  const steps = 20;
  const intervalTime = (duration * 1000) / steps;
  let currentStep = 0;
  
  const fadeInterval = setInterval(() => {
    currentStep++;
    const nextVol = startVol * (1 - (currentStep / steps));
    if (nextVol <= 0.01 || currentStep >= steps) {
      clearInterval(fadeInterval);
      audioEl.pause();
      audioEl.src = "";
    } else {
      audioEl.volume = nextVol;
    }
  }, intervalTime);
}

function monitorCrossfade(audioEl) {
  crossfadeCheckInterval = setInterval(() => {
    if (!audioEl || audioEl.paused) return;
    
    const timeLeft = audioEl.duration - audioEl.currentTime;
    
    if (!isNaN(timeLeft) && timeLeft <= CROSSFADE_TIME) {
      clearInterval(crossfadeCheckInterval);
      const nextIdx = (customPlaylistIndex + 1) % customPlaylist.length;
      playPlaylistTrack(nextIdx);
    }
  }, 500);
}

function stopAmbientSound(silent = false) {
  if (soundGainNode && audioCtx) {
    const activeGain = soundGainNode;
    const activeOscs = [...soundOscillators];
    activeGain.gain.setValueAtTime(activeGain.gain.value, audioCtx.currentTime);
    activeGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
    setTimeout(() => {
      activeOscs.forEach(osc => { try { osc.stop(); } catch(e) {} });
    }, 350);
  }
  soundOscillators = [];

  if (activeUserAudio) {
    try {
      activeUserAudio.pause();
      activeUserAudio.src = "";
    } catch(e) {}
    activeUserAudio = null;
  }
  
  clearInterval(crossfadeCheckInterval);
  if (audioA) { try { audioA.pause(); audioA.src = ""; } catch(e) {} audioA = null; }
  if (audioB) { try { audioB.pause(); audioB.src = ""; } catch(e) {} audioB = null; }
  
  // Freigabe der URLs beim Stoppen
  customPlaylistObjectUrls.forEach(url => URL.revokeObjectURL(url));
  customPlaylistObjectUrls = [];
  
  customPlaylist = [];
  customPlaylistIndex = 0;
  currentChannel = 'A';
  isPlaylistPaused = false;
  isAmbientPaused = false;

  currentSoundType = null;
  updateSoundscapeUI();
  updateHeaderAmbiencesOpacity();
  
  const playerWidget = document.getElementById('custom-playlist-player');
  if (playerWidget) playerWidget.classList.add('hidden');

  const nameLabel = document.getElementById('user-sound-name'); 
  if (nameLabel) nameLabel.classList.add('hidden');
  
  if (!silent) {
    const toastLabel = { de: 'Focus Sound gestoppt', en: 'Focus Sound stopped' }[currentLang] || 'Stopped';
    showToast(toastLabel);
  }
}

// -------------------------------------------------------------
// AUTOMATISCHER EXPORT & RESET SYSTEM
// -------------------------------------------------------------

function checkMondayReset() {
  const now = new Date();
  if (now.getDay() !== 1) return; // Reset nur am Montag
  
  const weekKey = getISOWeekKey(now);
  
  if (state.lastMondayReset !== weekKey) {
    saveHistory();
    
    // 1. Erledigt-Liste leeren
    state.done = [];
    
    // 2. Haushaltsaufgaben (Standardpresets) neu laden
    const localizedDefaults = DEFAULT_TASKS_BY_LANG[currentLang] || DEFAULT_TASKS_BY_LANG['de'];
    state.items.daily = [...localizedDefaults.daily];
    state.items.weekly = [...localizedDefaults.weekly];
    state.items.occasionally = [...localizedDefaults.occasionally];
    state.completedSteps = {};
    
    state.lastMondayReset = weekKey;
    saveState();
    
    setTimeout(() => {
      showToast(currentLang === 'de' 
        ? '🧹 Neuer Montag! Haushaltsaufgaben geladen und Erledigt-Liste leer.' 
        : '🧹 New Monday! Household plan loaded and Done list cleared.');
      renderApp();
    }, 1200);
  }
}

function checkAndTriggerAutoExports() {
  const now = new Date();
  const todayISO = now.toISOString().split('T')[0];
  
  if (!state.lastExports) {
    state.lastExports = { day: '', week: '', month: '' };
  }
  
  let triggered = false;
  let targetLabel = '';
  
  // 1. Tägliche automatische Sicherung
  if (state.lastExports.day !== todayISO) {
    state.lastExports.day = todayISO;
    targetLabel = 'today';
    triggered = true;
  }
  
  // 2. Wochenend-Sicherung (ISO-Wochenberechnung)
  const weekKey = getISOWeekKey(now);
  if (state.lastExports.week !== weekKey && now.getDay() === 1) {
    state.lastExports.week = weekKey;
    targetLabel = 'week';
    triggered = true;
  }
  
  // 3. Monatsend-Sicherung
  const monthKey = `${now.getFullYear()}-M${now.getMonth() + 1}`;
  if (state.lastExports.month !== monthKey && now.getDate() === 1) {
    state.lastExports.month = monthKey;
    targetLabel = 'month';
    triggered = true;
  }
  
  if (triggered && targetLabel) {
    saveState();
    setTimeout(() => {
      setReportTimeframe(targetLabel);
      const target = document.getElementById('report-export-target');
      if (target) {
        html2canvas(target, {
          backgroundColor: '#111116',
          scale: 1.5,
          useCORS: true,
          logging: false
        }).then(canvas => {
          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `flow-auto-stats-${targetLabel}-${todayISO}.png`;
          link.href = dataUrl;
          link.click();
          showToast(`💾 Auto-Export (${targetLabel}) gespeichert!`);
        }).catch(e => console.log("Auto-Export fehlgeschlagen:", e));
      }
    }, 2000); 
  }
}

// Erweitertes playAmbientSound, um die neuen Naturgeräusche (Vögel & Gewitter) zu unterstützen
function playAmbientSound(type) {
  stopAmbientSound(true); 
  currentSoundType = type;
  isAmbientPaused = false;

  if (type === 'alpha') {
    initAudioContext();
    soundGainNode = audioCtx.createGain();
    soundGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    soundGainNode.connect(audioCtx.destination);
    soundGainNode.gain.linearRampToValueAtTime(soundMasterVolume * 0.25, audioCtx.currentTime + 1.5);

    const oscL = audioCtx.createOscillator(); const oscR = audioCtx.createOscillator();
    const merger = audioCtx.createChannelMerger(2);
    oscL.frequency.setValueAtTime(200, audioCtx.currentTime);
    oscR.frequency.setValueAtTime(210, audioCtx.currentTime);
    oscL.connect(merger, 0, 0); oscR.connect(merger, 0, 1);
    merger.connect(soundGainNode); oscL.start(); oscR.start();
    soundOscillators.push(oscL, oscR);
  } else if (AMBIENT_SOUNDS[type]) {
    const audio = new Audio(AMBIENT_SOUNDS[type]);
    audio.loop = true;
    audio.volume = soundMasterVolume * 0.5; 
    activeUserAudio = audio;
    
    audio.play().catch(e => {
      console.log("Audio-Wiedergabe verzögert:", e);
      showToast(currentLang === 'de' ? "Sound wird geladen..." : "Loading sound...");
    });
  }

  updateSoundscapeUI();
  updateHeaderAmbiencesOpacity();
  const toastLabel = { de: 'Natur-Sound gestartet 🍃', en: 'Nature sound started 🍃' }[currentLang] || 'Sound started';
  showToast(toastLabel);
}

// Synchronisiert das Sounds-UI (Unterstützt alle Ambiences)
function updateSoundscapeUI() {
  ['rain', 'ocean', 'birds', 'thunder', 'wind', 'fire', 'alpha'].forEach(st => {
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

// -------------------------------------------------------------
// ANTRIEB & VORSCHLAGSSYSTEM
// -------------------------------------------------------------

function suggestBoostActivity() {
  const list = currentLang === 'de' ? BOOST_ACTIVITIES_DE : BOOST_ACTIVITIES_EN;
  const randomActivity = list[Math.floor(Math.random() * list.length)];
  const box = document.getElementById('boost-activity-box');
  if (box) {
    box.innerText = randomActivity;
  }
}

// Überschreiben von pickRandomTask, um den Steps-Button direkt zu benennen
function pickRandomTask() {
  let chosen = null;
  const dailyTasks = (state.items.daily || []).map(t => ({ cat: 'daily', task: typeof t === 'object' ? t.task : t }));
  const weeklyTasks = (state.items.weekly || []).map(t => ({ cat: 'weekly', task: typeof t === 'object' ? t.task : t }));
  const todoTasks = (state.items.todo || []).map(t => ({ cat: 'todo', task: typeof t === 'object' ? t.task : t }));
  const occasionallyTasks = (state.items.occasionally || []).map(t => ({ cat: 'occasionally', task: typeof t === 'object' ? t.task : t }));
  if (dailyTasks.length > 0) chosen = dailyTasks[Math.floor(Math.random() * dailyTasks.length)];
  else {
    const mixedMidPriority = []; 
    const maxLen = Math.max(todoTasks.length, weeklyTasks.length); // Verfeinerter Überlaufschutz
    for (let i = 0; i < maxLen; i++) {
      if (todoTasks[i]) mixedMidPriority.push(todoTasks[i]); if (weeklyTasks[i]) mixedMidPriority.push(weeklyTasks[i]);
    }
    if (mixedMidPriority.length > 0) chosen = mixedMidPriority[Math.floor(Math.random() * Math.min(mixedMidPriority.length, 3))];
    else if (occasionallyTasks.length > 0) chosen = occasionallyTasks[Math.floor(Math.random() * occasionallyTasks.length)];
  }
  const box = document.getElementById('adhd-pick-box');
  if (!chosen) {
    const doneMsg = { de: '🎉 Alle Aufgaben erledigt! Fantastisch, genieß deinen Tag!', en: '🎉 All tasks completed! Fantastic, enjoy your day!' }[currentLang] || 'All tasks done!';
    box.innerHTML = `<div class="text-emerald-400 font-bold">${doneMsg}</div>`;
  } else {
    const catName = t(catName);
    const taskIdx = (state.items[chosen.cat] || []).findIndex(item => (typeof item === 'object' ? item.task : item) === chosen.task);
    const doneBtnLabel = t('completed');
    const stepsBtnLabel = "Steps"; // Festgelegter Name "Steps"
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

// -------------------------------------------------------------
// PLAYBACK FADE IN / FADE OUT & AKTIVER INTENSITÄTS-ZUSTAND
// -------------------------------------------------------------

function toggleAmbientSoundPlayback() {
  if (!activeUserAudio && !currentSoundType) return;
  
  if (currentSoundType === 'alpha') {
    if (soundGainNode) {
      if (audioCtx.state === 'running') {
        audioCtx.suspend();
        isAmbientPaused = true;
      } else {
        audioCtx.resume();
        isAmbientPaused = false;
      }
    }
    updateHeaderAmbiencesOpacity();
    return;
  }

  if (!activeUserAudio) return;

  clearInterval(ambientFadeInterval);

  if (isAmbientPaused) {
    // Schnelles Einblenden (ca. 500ms)
    activeUserAudio.play().catch(e => console.log(e));
    const targetVol = soundMasterVolume * 0.5;
    activeUserAudio.volume = 0;
    let vol = 0;
    ambientFadeInterval = setInterval(() => {
      vol += 0.05;
      if (vol >= targetVol) {
        activeUserAudio.volume = targetVol;
        clearInterval(ambientFadeInterval);
      } else {
        activeUserAudio.volume = vol;
      }
    }, 50);
    
    isAmbientPaused = false;
    showToast(currentLang === 'de' ? 'Natur-Sound eingeblendet 🍃' : 'Sound faded in 🍃');
  } else {
    // Sanftes, langsames Ausblenden (ca. 1.5s)
    const startVol = activeUserAudio.volume;
    let vol = startVol;
    ambientFadeInterval = setInterval(() => {
      vol -= 0.02;
      if (vol <= 0.01) {
        activeUserAudio.volume = 0;
        activeUserAudio.pause();
        clearInterval(ambientFadeInterval);
        isAmbientPaused = true;
        showToast(currentLang === 'de' ? 'Natur-Sound ausgeblendet ⏸️' : 'Sound faded out ⏸️');
        updateHeaderAmbiencesOpacity();
      } else {
        activeUserAudio.volume = vol;
      }
    }, 100);
  }
  updateHeaderAmbiencesOpacity();
}

function handleSoundsMainClick() {
  if (currentSoundType) {
    toggleAmbientSoundPlayback();
  } else {
    togglePanel('soundscape');
  }
}

function handleMusicMainClick() {
  if (customPlaylist.length > 0) {
    togglePlaylistPlayback();
  } else {
    togglePanel('music');
  }
}

function updateHeaderAmbiencesOpacity() {
  // Sounds-Schnittstelle
  const soundContainer = document.getElementById('sound-trigger-container');
  if (soundContainer) {
    if (currentSoundType && !isAmbientPaused) {
      soundContainer.style.opacity = "1";
      soundContainer.classList.add('border-blue-500/50', 'bg-blue-500/10');
    } else {
      soundContainer.style.opacity = "";
      soundContainer.classList.remove('border-blue-500/50', 'bg-blue-500/10');
    }
  }

  // Musik-Schnittstelle
  const musicContainer = document.getElementById('music-trigger-container');
  if (musicContainer) {
    if (customPlaylist.length > 0 && !isPlaylistPaused) {
      musicContainer.style.opacity = "1";
      musicContainer.classList.add('border-purple-500/50', 'bg-purple-500/10');
    } else {
      musicContainer.style.opacity = "";
      musicContainer.classList.remove('border-purple-500/50', 'bg-purple-500/10');
    }
  }
}

// Integriert die Opazitätsprüfung in die originalen Soundfunktionen
const originalPlayAmbientSound = playAmbientSound;
playAmbientSound = function(type) {
  originalPlayAmbientSound(type);
  isAmbientPaused = false;
  updateHeaderAmbiencesOpacity();
};

const originalStopAmbientSound = stopAmbientSound;
stopAmbientSound = function(silent) {
  originalStopAmbientSound(silent);
  isAmbientPaused = false;
  updateHeaderAmbiencesOpacity();
};

// Keydown-Zuweisung aktualisieren
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAdhdModal();
    ['feedback', 'report', 'settings', 'soundscape', 'language', 'theme', 'sync', 'music', 'boost'].forEach(p => {
      const el = document.getElementById(`panel-${p}`); if (el) el.classList.add('hidden');
    });
    return;
  }
  if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
    e.preventDefault(); toggleTimer();
  }
});

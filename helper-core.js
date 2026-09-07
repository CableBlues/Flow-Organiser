// helper-core.js Teil 1/2: State-Variablen & Kernfunktionen (Modal, Sprachausgabe, Task-Auswahl)
let currentActiveTaskRef = null;
let currentGeneratedSteps = [];
let currentDopamineTask = null;

let suggestionCycleCount = 0;
let lastSuggestionThemeIndex = -1;

let suggestedTaskNamesInCurrentRun = [];
let currentSpeechUtterance = null;

let compassActiveDilemma = "";
let coinVetoInterval = null;
let coinVetoCountdownValue = 10;
let coinWinningOption = "";
let coinLosingOption = "";

let brainDumpThoughts = [];
let brainDumpCurrentIndex = 0;

function getNextNonRepeatingTheme() {
  let themeIndex;
  do {
    themeIndex = Math.floor(Math.random() * SUGGESTION_THEMES.length);
  } while (themeIndex === lastSuggestionThemeIndex && SUGGESTION_THEMES.length > 1);
  lastSuggestionThemeIndex = themeIndex;
  return SUGGESTION_THEMES[themeIndex];
}

function speakText(text, index = 0) {
  if (typeof speakWithProfile === 'function') {
    speakWithProfile(text, index);
  } else {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const langMap = { de: 'de-DE', en: 'en-US', es: 'es-ES', el: 'el-GR', fr: 'fr-FR', it: 'it-IT' };
        const targetLang = langMap[currentLang] || 'de-DE';
        utterance.lang = targetLang;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error(e);
      }
    }
  }
}

function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

function cleanStepText(text) {
  if (!text) return '';
  let cleaned = text.replace(/^(?:schritt|step|schritte|steps|paso|etapa|βήμα|βημα)?\s*\d+[\s.:)\-]*\s*/i, '');
  cleaned = cleaned.replace(/^[\s.\-\u2022\u25CF\u25CB\u25AA\u25AB]+\s*/, '');
  return cleaned.trim();
}

function openHelperModal(type) {
  if (type === 'pick') {
    const modal = document.getElementById('helper-pick-modal');
    if (modal) modal.classList.remove('hidden');
    suggestedTaskNamesInCurrentRun = []; 
    resetDopamineBox(); 
    pickRandomTask();
  } else if (type === 'steps') {
    const modal = document.getElementById('helper-steps-modal');
    if (modal) modal.classList.remove('hidden');
    populateHelperTaskSelect();
  }
}

function openTaskStepsModal(category, index, event) {
  if (event) event.stopPropagation();
  const raw = state?.items?.[category]?.[index]; if (!raw) return;
  const task = typeof raw === 'object' ? raw.task : raw;
  currentActiveTaskRef = { category, index, task };
  openHelperModal('steps');
  const select = document.getElementById('helper-task-select');
  if (select) {
    let found = false;
    for (let opt of select.options) {
      if (opt.value === task) { select.value = task; found = true; break; }
    }
    if (!found) select.value = '';
  }
  generateTaskSteps(task);
}

function closeHelperModal() {
  const pickModal = document.getElementById('helper-pick-modal');
  const stepsModal = document.getElementById('helper-steps-modal');
  if (pickModal) pickModal.classList.add('hidden');
  if (stepsModal) stepsModal.classList.add('hidden');
  stopSpeaking();
}

let _lastPopulatedHelperTaskKey = null;

function populateHelperTaskSelect(force = false) {
  const select = document.getElementById('helper-task-select'); if (!select) return;
  
  const pickModal = document.getElementById('helper-pick-modal');
  const stepsModal = document.getElementById('helper-steps-modal');
  const isModalVisible = (pickModal && !pickModal.classList.contains('hidden')) || (stepsModal && !stepsModal.classList.contains('hidden'));

  if (!isModalVisible && !force) return;

  const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';
  const totalItemCount = state?.items ? Object.values(state.items).reduce((acc, l) => acc + (Array.isArray(l) ? l.length : 0), 0) : 0;
  const stateKey = `${lang}-${totalItemCount}`;

  if (!force && _lastPopulatedHelperTaskKey === stateKey && select.options.length > 1) {
    return;
  }
  _lastPopulatedHelperTaskKey = stateKey;

  select.innerHTML = `<option value="">${safeTranslate('dropdown_placeholder')}</option>`;
  const allTasks = [];
  ['daily', 'weekly', 'todo', 'occasionally'].forEach(cat => {
    (state?.items?.[cat] || []).filter(Boolean).forEach(task => { 
      const name = typeof task === 'object' ? task.task : task;
      if (name && !allTasks.includes(name)) allTasks.push(name); 
    });
  });
  
  const presetsExist = typeof DEFAULT_TASKS_BY_LANG !== 'undefined' && DEFAULT_TASKS_BY_LANG[lang];
  const standardPresetsInCurrentLang = presetsExist 
    ? [...(DEFAULT_TASKS_BY_LANG[lang].daily || []), ...(DEFAULT_TASKS_BY_LANG[lang].weekly || []), ...(DEFAULT_TASKS_BY_LANG[lang].occasionally || [])]
    : [];
    
  standardPresetsInCurrentLang.forEach(task => { if (task && !allTasks.includes(task)) allTasks.push(task); });
  allTasks.forEach(task => {
    const opt = document.createElement('option'); opt.value = task; opt.innerText = task; select.appendChild(opt);
  });
}

function onHelperSelectTask() {
  const select = document.getElementById('helper-task-select');
  const val = select ? select.value : '';
  if (val) { 
    currentActiveTaskRef = { task: val }; 
    generateTaskSteps(val); 
    activeTimerTask = val;
    updateActiveTimerLabels();
  }
}

function isEveningTeethTask(taskText) {
  const text = String(taskText).toLowerCase();
  return text.includes('zähne abends') || 
         text.includes('teeth (evening)') || 
         text.includes('dientes (noche)') || 
         text.includes('δόντια βράδυ');
}

function isHouseworkTask(taskText) {
  const text = String(taskText).toLowerCase();
  return /saugen|wischen|spül|wasch|müll|aufräum|tidy|clean|dust|laundry|dish|cook|trash|staub|freg|aspir|sfoug|skoupi|piat|roux|organi|clean/.test(text);
}

let currentWhatNowEnergyLevel = 'med';
let currentWhatNowChosen = null;

function switchWhatNowTab(tabName) {
  const normTab = (tabName === 'energy' || tabName === 'micro' || tabName === 'zen') ? 'suggestion' : tabName;
  const TABS = ['suggestion', 'dilemma', 'braindump'];
  
  TABS.forEach(t => {
    const pane = document.getElementById(`whatnow-pane-${t}`);
    const tabBtn = document.getElementById(`whatnow-tab-${t}`);
    if (pane) {
      if (t === normTab) pane.classList.remove('hidden');
      else pane.classList.add('hidden');
    }
    if (tabBtn) {
      if (t === normTab) {
        tabBtn.className = 'py-2 px-2 rounded-xl bg-gradient-to-r from-amber-500/30 to-amber-600/30 border border-amber-400/50 text-amber-200 text-center transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm font-bold';
      } else {
        tabBtn.className = 'py-2 px-2 rounded-xl text-gray-400 hover:text-white text-center transition cursor-pointer flex items-center justify-center gap-1.5 border border-transparent font-bold';
      }
    }
  });

  if (normTab === 'dilemma') {
    populateWhatNowDilemmaDefaults();
  }
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

function setWhatNowEnergyLevel(level) {
  currentWhatNowEnergyLevel = level;
  ['low', 'med', 'high', 'random'].forEach(l => {
    const btn = document.getElementById(`whatnow-energy-${l}`);
    if (!btn) return;
    if (l === level) {
      btn.className = 'py-1.5 px-1.5 rounded-xl text-[10px] font-bold text-amber-200 bg-amber-500/20 border border-amber-500/40 transition cursor-pointer flex flex-col items-center gap-0.5 shadow-sm';
    } else {
      btn.className = 'py-1.5 px-1.5 rounded-xl text-[10px] font-bold text-gray-400 hover:text-white transition cursor-pointer flex flex-col items-center gap-0.5 border border-transparent';
    }
  });
  suggestedTaskNamesInCurrentRun = [];
  pickRandomTask();
}

function startZenWithTask(taskText, cat = 'todo') {
  closeHelperModal();
  if (!isMinimalist) {
    toggleMinimalist();
  }
  currentZenTaskInfo = { cat, task: taskText };
  const zenTaskText = document.getElementById('zen-task-text');
  const zenCatEl = document.getElementById('zen-task-cat');
  if (zenTaskText) zenTaskText.innerText = taskText;
  if (zenCatEl) zenCatEl.innerText = `${t(cat)}`;
  
  setTimerPreset(25);
  startTimer();
  renderZenSubtasks(taskText);
  
  showToast(tr({
    de: `Fokus gestartet: "${taskText}" 🧘`,
    en: `Focus started: "${taskText}" 🧘`,
    es: `Enfoque iniciado: "${taskText}" 🧘`,
    el: `Η εστίαση ξεκίνησε: "${taskText}" 🧘`,
    fr: `Focus démarré : "${taskText}" 🧘`,
    it: `Focus avviato: "${taskText}" 🧘`
  }));
}

function start2MinKickstart(taskText, cat = 'todo') {
  closeHelperModal();
  if (!isMinimalist) {
    toggleMinimalist();
  }
  currentZenTaskInfo = { cat, task: taskText };
  const zenTaskText = document.getElementById('zen-task-text');
  const zenCatEl = document.getElementById('zen-task-cat');
  if (zenTaskText) zenTaskText.innerText = taskText;
  if (zenCatEl) zenCatEl.innerText = `${t(cat)} · 2-Min Kickstart`;
  
  setTimerPreset(2);
  startTimer();
  renderZenSubtasks(taskText);
  
  showToast(tr({
    de: `2-Minuten-Kickstart: Nur anfangen! ⏱️`,
    en: `2-Minute Kickstart: Just start! ⏱️`,
    es: `¡Inicio de 2 minutos: solo empieza! ⏱️`,
    el: `Εκκίνηση 2 λεπτών: Απλά ξεκίνα! ⏱️`,
    fr: `Démarrage 2 min : Juste commencer ! ⏱️`,
    it: `Kickstart di 2 minuti: Inizia subito! ⏱️`
  }));
}

function completeWhatNowTask(cat, taskIndex) {
  if (typeof handleCompleteTask === 'function') {
    handleCompleteTask(cat, taskIndex);
  }
  if (typeof playProceduralSound === 'function') playProceduralSound(3);
  if (typeof triggerCelebration === 'function') triggerCelebration();
  
  showToast(tr({
    de: `Stark gemacht! +30 XP Belohnung 🎉`,
    en: `Great job! +30 XP Reward 🎉`,
    fr: `Bravo ! +30 XP Récompense 🎉`,
    it: `Ottimo lavoro! +30 XP Ricompensa 🎉`,
    es: `¡Excelente! +30 XP Recompensa 🎉`,
    el: `Υπέροχα! +30 XP Επιβράβευση 🎉`
  }));

  setTimeout(() => {
    pickRandomTask();
  }, 200);
}

function populateWhatNowDilemmaDefaults() {
  const inputA = document.getElementById('whatnow-dilemma-a');
  const inputB = document.getElementById('whatnow-dilemma-b');
  if (!inputA || !inputB) return;

  if (!inputA.value.trim() && !inputB.value.trim()) {
    const all = [];
    ['daily', 'todo', 'weekly', 'occasionally'].forEach(cat => {
      (state?.items?.[cat] || []).filter(Boolean).forEach(t => {
        const text = typeof t === 'object' ? t.task : t;
        if (text && !all.includes(text)) all.push(text);
      });
    });

    if (all.length >= 2) {
      inputA.value = all[0];
      inputB.value = all[1];
    } else if (all.length === 1) {
      inputA.value = all[0];
      inputB.value = tr({ de: '30 Min Pause & Spaziergang', en: '30 min break & walk' });
    }
  }
}

function flipWhatNowDilemma() {
  const optA = document.getElementById('whatnow-dilemma-a')?.value.trim() || 'Option A';
  const optB = document.getElementById('whatnow-dilemma-b')?.value.trim() || 'Option B';
  const resBox = document.getElementById('whatnow-dilemma-result');
  if (!resBox) return;
  
  resBox.classList.remove('hidden');
  resBox.innerHTML = `
    <div class="flex items-center justify-center gap-2 py-3 text-amber-300 font-bold">
      <span class="text-xl animate-spin">🪙</span>
      <span class="text-xs">Münze dreht sich in der Luft...</span>
    </div>
  `;

  if (typeof playProceduralSound === 'function') playProceduralSound(6);

  setTimeout(() => {
    const winner = Math.random() < 0.5 ? optA : optB;
    const loser = (winner === optA) ? optB : optA;
    const safeWinner = winner.replace(/'/g, "\\'");

    resBox.innerHTML = `
      <div class="space-y-2.5 text-center">
        <div class="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-mono">Die Münze hat entschieden:</div>
        <div class="text-base sm:text-lg font-display font-black text-white px-2 break-words">🏆 ${escapeHtml(winner)}</div>
        <p class="text-[11px] text-gray-300 italic px-2 leading-relaxed">
          Spürst du Erleichterung? Dann starte sofort! Fühlt es sich falsch an? Dann nimm dein echtes Ziel: <strong>${escapeHtml(loser)}</strong>.
        </p>
        <button onclick="startZenWithTask('${safeWinner}', 'todo')" class="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-95">
          <i data-lucide="play" class="w-3.5 h-3.5 fill-black"></i>
          <span>Mit "${escapeHtml(winner)}" im Fokus starten ➔</span>
        </button>
      </div>
    `;
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  }, 650);
}

function launchBrainDumpAsFocus() {
  const input = document.getElementById('whatnow-braindump-input');
  const text = input ? input.value.trim() : '';
  if (!text) {
    showToast(tr({ de: 'Bitte zuerst einen Gedanken eingeben!', en: 'Please enter a thought first!' }));
    return;
  }

  saveHistory();
  if (!state.items.todo) state.items.todo = [];
  state.items.todo.unshift({
    task: text,
    created: new Date().toISOString(),
    id: 'task-' + Date.now()
  });
  saveState();
  renderApp();

  input.value = '';
  startZenWithTask(text, 'todo');
}

function saveBrainDumpAsTask() {
  const input = document.getElementById('whatnow-braindump-input');
  const text = input ? input.value.trim() : '';
  if (!text) return;

  saveHistory();
  if (!state.items.todo) state.items.todo = [];
  state.items.todo.unshift({
    task: text,
    created: new Date().toISOString(),
    id: 'task-' + Date.now()
  });
  saveState();
  renderApp();

  input.value = '';
  showToast(tr({ de: `Als Aufgabe gesichert! 📋`, en: `Saved as task! 📋` }));
  switchWhatNowTab('suggestion');
  pickRandomTask();
}

function pickRandomTask() {
  const box = document.getElementById('helper-pick-box');
  if (!box) return;

  const incompleteDailies = (state?.items?.daily || [])
    .filter(Boolean)
    .map(t => ({ cat: 'daily', task: typeof t === 'object' ? t.task : t }))
    .filter(t => t.task && !isEveningTeethTask(t.task));

  const houseworkTasks = [];
  const todoTasks = [];
  const otherTasks = [];

  ['weekly', 'todo', 'occasionally', 'termine'].forEach(cat => {
    (state?.items?.[cat] || []).filter(Boolean).forEach(t => {
      const taskText = typeof t === 'object' ? t.task : t;
      if (!taskText) return;
      const taskObj = { cat, task: taskText };
      if (isHouseworkTask(taskText)) {
        houseworkTasks.push(taskObj);
      } else if (cat === 'todo') {
        todoTasks.push(taskObj);
      } else {
        otherTasks.push(taskObj);
      }
    });
  });

  let poolDailies = incompleteDailies.filter(t => !suggestedTaskNamesInCurrentRun.includes(t.task));
  let poolHousework = houseworkTasks.filter(t => !suggestedTaskNamesInCurrentRun.includes(t.task));
  let poolTodo = todoTasks.filter(t => !suggestedTaskNamesInCurrentRun.includes(t.task));
  let poolOther = otherTasks.filter(t => !suggestedTaskNamesInCurrentRun.includes(t.task));

  const totalAvailable = poolDailies.length + poolHousework.length + poolTodo.length + poolOther.length;
  if (totalAvailable === 0) {
    suggestedTaskNamesInCurrentRun = [];
    poolDailies = incompleteDailies;
    poolHousework = houseworkTasks;
    poolTodo = todoTasks;
    poolOther = otherTasks;
  }

  let chosen = null;
  let estimatedMin = 15;

  if (currentWhatNowEnergyLevel === 'low') {
    estimatedMin = 5;
    if (poolDailies.length > 0) chosen = poolDailies[0];
    else if (poolHousework.length > 0) chosen = poolHousework[0];
    else if (poolTodo.length > 0) chosen = poolTodo[0];
    else chosen = poolOther[0] || null;
  } else if (currentWhatNowEnergyLevel === 'high') {
    estimatedMin = 45;
    if (poolTodo.length > 0) chosen = poolTodo[0];
    else if (poolOther.length > 0) chosen = poolOther[0];
    else if (poolDailies.length > 0) chosen = poolDailies[0];
    else chosen = poolHousework[0] || null;
  } else if (currentWhatNowEnergyLevel === 'random') {
    const all = [...poolDailies, ...poolHousework, ...poolTodo, ...poolOther];
    if (all.length > 0) {
      chosen = all[Math.floor(Math.random() * all.length)];
      estimatedMin = (chosen.cat === 'daily' || isHouseworkTask(chosen.task)) ? 10 : 25;
    }
  } else {
    // Standard 'med' (Fokus)
    estimatedMin = 20;
    if (poolDailies.length > 0 && Math.random() < 0.5) {
      chosen = poolDailies[0];
    } else if (poolTodo.length > 0) {
      chosen = poolTodo[0];
    } else if (poolHousework.length > 0) {
      chosen = poolHousework[0];
    } else {
      chosen = poolOther[0] || poolDailies[0] || null;
    }
  }

  currentWhatNowChosen = chosen;

  if (!chosen) {
    const doneMsg = tr({ 
      de: '🎉 Alle Aufgaben für heute erledigt! Fantastisch, genieß deinen Tag!', 
      en: '🎉 All tasks completed! Fantastic, enjoy your day!', 
      es: '🎉 ¡Todas las tareas completadas! ¡Disfruta de tu día!', 
      el: '🎉 Όλες οι εργασίες ολοκληρώθηκαν! Απολαύστε τη μέρα σας!' 
    });

    box.className = "p-6 rounded-2xl bg-black/40 border border-emerald-500/30 text-center space-y-3";
    box.innerHTML = `
      <div class="text-3xl animate-bounce">🏆</div>
      <div class="text-emerald-300 font-display font-bold text-sm leading-snug">${doneMsg}</div>
      <button onclick="startZenWithTask('Freie Fokus-Session', 'todo')" class="mt-2 py-2 px-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition cursor-pointer">
        Freie Fokus-Session starten 🧘
      </button>
    `;
    activeTimerTask = "";
    updateActiveTimerLabels();
  } else {
    suggestedTaskNamesInCurrentRun.push(chosen.task);

    const taskIdx = (state?.items?.[chosen.cat] || []).findIndex(item => {
      if (!item) return false;
      const taskVal = typeof item === 'object' ? item.task : item;
      return taskVal === chosen.task;
    });

    activeTimerTask = chosen.task;
    updateActiveTimerLabels();

    // Ermittle den ersten Kickstart-Schritt
    let firstStep = "Schritt 1: Bereite alles vor und starte mit nur 2 Minuten.";
    const steps = getTaskStepsList(chosen.task);
    if (steps && steps.length > 0) {
      firstStep = cleanStepText(steps[0]);
    }

    const safeTask = chosen.task.replace(/'/g, "\\'");
    const catLabel = typeof t === 'function' ? t(chosen.cat) : chosen.cat;

    box.className = "p-5 rounded-2xl bg-gradient-to-br from-[#16121c] to-[#0d0d14] border border-amber-500/40 shadow-xl space-y-4 text-left transition-all duration-300";
    box.innerHTML = `
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/35 text-amber-300 font-bold text-[10px] uppercase tracking-wider font-mono">
            ${escapeHtml(catLabel)}
          </span>
          <span class="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] font-mono">
            ⏱️ ~${estimatedMin} Min
          </span>
        </div>
        <span class="text-[9px] text-gray-400 font-mono">Empfehlung #1</span>
      </div>

      <!-- Task Title -->
      <div>
        <h2 class="text-xl sm:text-2xl font-display font-black text-white leading-tight tracking-tight break-words">
          ${escapeHtml(chosen.task)}
        </h2>
        <div class="mt-2 flex items-start gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-gray-300 font-medium">
          <span class="text-amber-400 shrink-0">🪜</span>
          <span class="leading-relaxed"><strong class="text-white">Kickstart:</strong> ${escapeHtml(firstStep)}</span>
        </div>
      </div>

      <!-- Primary Action Buttons -->
      <div class="space-y-2 pt-1">
        <button onclick="startZenWithTask('${safeTask}', '${chosen.cat}')" class="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition transform active:scale-98 cursor-pointer flex items-center justify-center gap-2">
          <i data-lucide="play" class="w-4 h-4 fill-black"></i>
          <span>Im Fokus starten [Space] 🧘</span>
        </button>

        <div class="grid grid-cols-2 gap-2">
          <button onclick="start2MinKickstart('${safeTask}', '${chosen.cat}')" class="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer" title="2-Minuten-Timer starten">
            <i data-lucide="timer" class="w-3.5 h-3.5 text-cyan-400"></i>
            <span>2-Min Start</span>
          </button>

          <button onclick="completeWhatNowTask('${chosen.cat}', ${taskIdx})" class="py-2.5 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer" title="Als erledigt markieren (+XP)">
            <i data-lucide="check" class="w-3.5 h-3.5"></i>
            <span>Erledigt (+XP)</span>
          </button>
        </div>
      </div>
    `;
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  }
}




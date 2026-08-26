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

function populateHelperTaskSelect() {
  const select = document.getElementById('helper-task-select'); if (!select) return;
  select.innerHTML = `<option value="">${safeTranslate('dropdown_placeholder')}</option>`;
  const allTasks = [];
  ['daily', 'weekly', 'todo', 'occasionally'].forEach(cat => {
    (state?.items?.[cat] || []).filter(Boolean).forEach(task => { 
      const name = typeof task === 'object' ? task.task : task;
      if (name && !allTasks.includes(name)) allTasks.push(name); 
    });
  });
  
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';
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
  ['energy', 'triple', 'micro', 'coin'].forEach(t => {
    const pane = document.getElementById(`whatnow-pane-${t}`);
    const tabBtn = document.getElementById(`whatnow-tab-${t}`);
    if (pane) {
      if (t === tabName) pane.classList.remove('hidden');
      else pane.classList.add('hidden');
    }
    if (tabBtn) {
      if (t === tabName) {
        tabBtn.className = 'py-1.5 px-1 rounded-lg bg-purple-600 text-white text-center transition cursor-pointer flex items-center justify-center gap-1 font-bold';
      } else {
        tabBtn.className = 'py-1.5 px-1 rounded-lg text-gray-400 hover:text-white text-center transition cursor-pointer flex items-center justify-center gap-1 font-bold';
      }
    }
  });

  if (tabName === 'triple') {
    generateTripleTaskChoices();
  } else if (tabName === 'micro') {
    if (currentWhatNowChosen) {
      prepareWhatNowMicroStep(currentWhatNowChosen.task);
    } else {
      pickRandomTask();
      if (currentWhatNowChosen) prepareWhatNowMicroStep(currentWhatNowChosen.task);
    }
  }
}

function setWhatNowEnergyLevel(level) {
  currentWhatNowEnergyLevel = level;
  ['low', 'med', 'high'].forEach(l => {
    const btn = document.getElementById(`whatnow-energy-${l}`);
    if (!btn) return;
    if (l === level) {
      btn.className = 'flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold text-purple-200 transition cursor-pointer bg-purple-500/20 border border-purple-500/40 flex items-center justify-center gap-1 shadow-sm';
    } else {
      btn.className = 'flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold text-gray-400 hover:text-white transition cursor-pointer bg-white/5 flex items-center justify-center gap-1';
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
    de: `Fokus gestartet: ${taskText} 🧘`,
    en: `Focus started: ${taskText} 🧘`,
    es: `Enfoque iniciado: ${taskText} 🧘`,
    el: `Η εστίαση ξεκίνησε: ${taskText} 🧘`,
    fr: `Focus démarré : ${taskText} 🧘`,
    it: `Focus avviato: ${taskText} 🧘`
  }));
}

function generateTripleTaskChoices() {
  const container = document.getElementById('whatnow-triple-cards');
  if (!container) return;
  container.innerHTML = '';
  
  const allTasks = [];
  ['daily', 'todo', 'weekly', 'occasionally', 'termine'].forEach(cat => {
    (state?.items?.[cat] || []).filter(Boolean).forEach(t => {
      const taskText = typeof t === 'object' ? t.task : t;
      allTasks.push({ cat, task: taskText });
    });
  });
  
  if (allTasks.length === 0) {
    container.innerHTML = `<div class="p-4 text-center text-emerald-400 text-xs font-bold bg-white/5 rounded-xl">🎉 Keine offenen Aufgaben vorhanden!</div>`;
    return;
  }
  
  const shuffled = [...allTasks].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);
  
  selected.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'group p-3 bg-white/[0.03] hover:bg-purple-950/20 border border-white/10 hover:border-purple-500/50 rounded-xl transition cursor-pointer flex items-center justify-between gap-2 shadow-sm';
    card.onclick = () => {
      startZenWithTask(item.task, item.cat);
    };
    card.innerHTML = `
      <div class="flex items-center gap-2.5 flex-1 min-w-0">
        <span class="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 font-display font-bold text-xs flex items-center justify-center shrink-0">${idx + 1}</span>
        <div class="flex flex-col min-w-0 flex-1">
          <span class="text-xs font-bold text-white group-hover:text-purple-200 truncate transition">${escapeHtml(item.task)}</span>
          <span class="text-[9px] text-gray-500 uppercase font-mono tracking-wider">${escapeHtml(t(item.cat))}</span>
        </div>
      </div>
      <button class="px-2.5 py-1 bg-purple-600/80 group-hover:bg-purple-500 text-white text-[10px] font-bold rounded-lg transition shrink-0 flex items-center gap-1">
        <span>Starten</span>
        <i data-lucide="arrow-right" class="w-3 h-3"></i>
      </button>
    `;
    container.appendChild(card);
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function prepareWhatNowMicroStep(taskText) {
  const titleEl = document.getElementById('whatnow-micro-task-title');
  const stepEl = document.getElementById('whatnow-micro-first-step');
  if (titleEl) titleEl.innerText = taskText;
  
  let firstStep = "Schritt 1: Bereite alles vor und starte mit nur 2 Minuten.";
  const standardKey = typeof getGermanStandardKey === 'function' ? getGermanStandardKey(taskText) : taskText;
  const predefinedSteps = (typeof TASK_STEPS_BY_TASK !== 'undefined' && TASK_STEPS_BY_TASK[standardKey]) || null;
  if (predefinedSteps && predefinedSteps.length > 0) {
    firstStep = `Schritt 1: ${predefinedSteps[0]}`;
  }
  if (stepEl) stepEl.innerText = firstStep;
}

function startMicroStepInFocus() {
  if (currentWhatNowChosen) {
    startZenWithTask(currentWhatNowChosen.task, currentWhatNowChosen.cat);
  } else {
    toggleMinimalist();
  }
}

function flipWhatNowCoin() {
  const optA = document.getElementById('whatnow-coin-a')?.value.trim() || 'Option A';
  const optB = document.getElementById('whatnow-coin-b')?.value.trim() || 'Option B';
  const resBox = document.getElementById('whatnow-coin-result');
  if (!resBox) return;
  resBox.classList.remove('hidden');
  resBox.innerHTML = `<span class="animate-spin inline-block">🪙</span> Münze dreht sich...`;
  
  setTimeout(() => {
    const winner = Math.random() < 0.5 ? optA : optB;
    const safeWinner = winner.replace(/'/g, "\\'");
    resBox.innerHTML = `
      <div class="space-y-2">
        <div class="text-amber-300 font-display font-black text-sm">Gewählt: ${winner} 🎉</div>
        <button onclick="startZenWithTask('${safeWinner}', 'todo')" class="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded-lg text-xs font-bold transition cursor-pointer">
          Jetzt mit ${winner} im Fokus-Modus starten ➔
        </button>
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }, 600);
}

function pickRandomTask() {
  const box = document.getElementById('helper-pick-box');
  if (!box) return;

  const incompleteDailies = (state?.items?.daily || [])
    .filter(Boolean)
    .map(t => ({ cat: 'daily', task: typeof t === 'object' ? t.task : t }))
    .filter(t => !isEveningTeethTask(t.task));

  const houseworkTasks = [];
  const otherFallbackTasks = [];

  ['weekly', 'todo', 'occasionally', 'termine'].forEach(cat => {
    (state?.items?.[cat] || []).filter(Boolean).forEach(t => {
      const taskText = typeof t === 'object' ? t.task : t;
      const taskObj = { cat, task: taskText };
      if (isHouseworkTask(taskText)) {
        houseworkTasks.push(taskObj);
      } else {
        otherFallbackTasks.push(taskObj);
      }
    });
  });

  let poolDailies = incompleteDailies.filter(t => !suggestedTaskNamesInCurrentRun.includes(t.task));
  let poolHousework = houseworkTasks.filter(t => !suggestedTaskNamesInCurrentRun.includes(t.task));
  let poolOthers = otherFallbackTasks.filter(t => !suggestedTaskNamesInCurrentRun.includes(t.task));

  if (poolDailies.length === 0 && poolHousework.length === 0 && poolOthers.length === 0) {
    if (incompleteDailies.length > 0 || houseworkTasks.length > 0 || otherFallbackTasks.length > 0) {
      suggestedTaskNamesInCurrentRun = [];
      poolDailies = incompleteDailies;
      poolHousework = houseworkTasks;
      poolOthers = otherFallbackTasks;
    }
  }

  let chosen = null;

  if (currentWhatNowEnergyLevel === 'low') {
    if (poolDailies.length > 0) chosen = poolDailies[0];
    else if (poolHousework.length > 0) chosen = poolHousework[0];
    else if (poolOthers.length > 0) chosen = poolOthers[0];
  } else if (currentWhatNowEnergyLevel === 'high') {
    if (poolOthers.length > 0) chosen = poolOthers[0];
    else if (poolHousework.length > 0) chosen = poolHousework[0];
    else if (poolDailies.length > 0) chosen = poolDailies[0];
  } else {
    if (poolHousework.length > 0 && Math.random() < 0.4) {
      chosen = poolHousework[0];
    } else if (poolDailies.length > 0) {
      chosen = poolDailies[0];
    } else {
      chosen = poolOthers[0] || null;
    }
  }

  currentWhatNowChosen = chosen;

  if (!chosen) {
    const doneMsg = { 
      de: '🎉 Alle Aufgaben erledigt! Fantastisch, genieß deinen Tag!', 
      en: '🎉 All tasks completed! Fantastic, enjoy your day!', 
      es: '🎉 ¡Todas las tareas completadas! ¡Disfruta de tu día!', 
      el: '🎉 Όλες οι εργασίες ολοκληρώθηκαν! Απολαύστε τη μέρα σας!' 
    }[currentLang] || '🎉 All tasks completed!';

    box.className = "p-6 rounded-2xl bg-[#111116] border border-white/10 text-center font-display shadow-inner";
    box.innerHTML = `<div class="text-emerald-400 font-bold py-4 text-center font-display">${doneMsg}</div>`;
    
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
    
    const theme = getNextNonRepeatingTheme();
    box.className = `p-5 rounded-2xl border transition-all duration-300 helper-suggestion-card-active ${theme.box}`;
    
    const safeTask = chosen.task.replace(/'/g, "\\'");

    box.innerHTML = `
      <div class="flex flex-col items-center gap-3 w-full py-1">
        <span class="text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300 font-mono">${t(chosen.cat)}</span>
        <div class="text-xl md:text-2xl font-display font-black px-2 break-words text-center leading-tight tracking-tight text-white">${chosen.task}</div>
        
        <div class="flex flex-col sm:flex-row items-center gap-2 mt-2 w-full">
          <button onclick="startZenWithTask('${safeTask}', '${chosen.cat}')" class="flex-1 w-full py-2.5 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer">
            <i data-lucide="play" class="w-3.5 h-3.5"></i>
            <span>Im Fokus-Modus starten 🧘</span>
          </button>
          <button onclick="openTaskStepsModal('${chosen.cat}', ${taskIdx})" class="py-2.5 px-3 bg-white/10 hover:bg-white/15 text-gray-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer">
            <i data-lucide="footprints" class="w-3.5 h-3.5"></i>
            <span>Steps</span>
          </button>
          <button onclick="handleCompleteTask('${chosen.cat}', ${taskIdx}); pickRandomTask();" class="py-2.5 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer">
            <i data-lucide="check" class="w-3.5 h-3.5"></i>
            <span>Erledigt</span>
          </button>
        </div>
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}



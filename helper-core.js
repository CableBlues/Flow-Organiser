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
  const task = state?.items?.[category]?.[index]; if (!task) return;
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

  if (poolDailies.length === 0 && poolHousework.length === 0 && poolOthers.length === 0) {
    chosen = null;
  } else {
    if (suggestionCycleCount < 2) {
      if (poolDailies.length > 0) {
        chosen = poolDailies[0];
        suggestionCycleCount++;
      } else if (poolHousework.length > 0) {
        chosen = poolHousework[0];
        suggestionCycleCount = 0;
      } else {
        chosen = poolOthers[0];
        suggestionCycleCount = 0;
      }
    } else {
      if (poolHousework.length > 0) {
        chosen = poolHousework[0];
        suggestionCycleCount = 0;
      } else if (poolDailies.length > 0) {
        chosen = poolDailies[0];
        suggestionCycleCount = 1;
      } else {
        chosen = poolOthers[0];
        suggestionCycleCount = 0;
      }
    }
  }

  if (!chosen) {
    const doneMsg = { 
      de: '🎉 Alle Aufgaben erledigt! Fantastisch, genieß deinen Tag!', 
      en: '🎉 All tasks completed! Fantastic, enjoy your day!', 
      es: '🎉 ¡Todas las Aufgaben erledigt! ¡Disfruta de tu día!', 
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

    const doneBtnLabel = {
      de: 'Erledigen',
      en: 'Complete',
      es: 'Completar',
      el: 'Ολοκλήρωση'
    }[currentLang] || 'Complete';

    activeTimerTask = chosen.task;
    updateActiveTimerLabels();
    
    const theme = getNextNonRepeatingTheme();
    
    box.className = `p-6 rounded-2xl border transition-all duration-300 helper-suggestion-card-active ${theme.box}`;
    
    const card = document.getElementById('helper-pick-card');
    if (card) {
      card.className = `w-full max-w-lg bg-[#111116]/95 border p-6 rounded-2xl shadow-2xl backdrop-blur-xl text-white relative transition-all duration-300 ${theme.cardBorder}`;
    }
    
    const icon = document.getElementById('helper-pick-icon');
    if (icon) {
      icon.className = `w-4 h-4 animate-pulse transition-all duration-300 ${theme.accentText}`;
    }
    
    const display = document.getElementById('helper-pick-timer-display');
    if (display) {
      display.className = `font-display font-black text-xs tracking-wider leading-none transition-all duration-300 ${theme.accentText}`;
    }
    
    const progressBar = document.getElementById('helper-pick-timer-progress-bar');
    if (progressBar) {
      progressBar.className = `h-full transition-all duration-300 ${theme.progressBarBg}`;
    }
    
    const nextBtn = document.getElementById('helper-pick-next-btn');
    if (nextBtn) {
      nextBtn.className = `w-full py-3 text-white font-bold text-xs rounded-xl shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 transform active:scale-95 ${theme.btnNext}`;
      const rawText = safeTranslate('next_suggestion') || 'Nächster Vorschlag';
      const cleanText = rawText.replace('🎲', '').trim();
      nextBtn.innerHTML = `<i data-lucide="arrow-right-circle" class="w-4 h-4"></i><span>${cleanText}</span>`;
    }
    
    box.innerHTML = `
      <div class="flex flex-col items-center gap-3.5 w-full py-1">
        <div class="text-2xl md:text-3xl font-display font-black px-2 break-words text-center leading-tight tracking-tight ${theme.text}">${chosen.task}</div>
        <div class="flex items-center justify-between gap-2.5 mt-2 w-full">
          <button onclick="openTaskStepsModal('${chosen.cat}', ${taskIdx})" class="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition duration-150 flex items-center gap-1.5 hover:scale-[1.02] ${theme.btnSteps}">
            <i data-lucide="footprints" class="w-3.5 h-3.5 shrink-0"></i>
            <span>Steps</span>
          </button>
          <button onclick="handleCompleteTask('${chosen.cat}', ${taskIdx}); pickRandomTask();" class="px-4 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition duration-150 flex items-center gap-1.5 hover:scale-[1.02] ${theme.btnDone}">
            <i data-lucide="check" class="w-3.5 h-3.5 shrink-0"></i>
            <span>${doneBtnLabel}</span>
          </button>
        </div>
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}


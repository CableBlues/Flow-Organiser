let currentActiveTaskRef = null;
let currentGeneratedSteps = [];
let currentDopamineTask = null;

// Zykluszähler für die Vorschlagsreihenfolge
let suggestionCycleCount = 0;
let lastSuggestionThemeIndex = -1;

// Liste bereits vorgeschlagener Aufgaben in der aktuellen Sitzung
let suggestedTaskNamesInCurrentRun = [];

// Referenz für die Sprachausgabe
let currentSpeechUtterance = null;

// 6 hochmoderne Farbthemen (ohne Sternensymbole)
const SUGGESTION_THEMES = [
  {
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500',
    box: 'border-cyan-500/20 bg-cyan-950/10 shadow-[0_4px_30px_rgba(6,182,212,0.05)]',
    cardBorder: 'border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.15)]',
    accentText: 'text-cyan-400',
    progressBarBg: 'bg-cyan-500',
    btnNext: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500',
    btnSteps: 'border-cyan-500/25 bg-cyan-500/5 text-cyan-300 hover:bg-cyan-500/15 hover:border-cyan-400/40',
    btnDone: 'bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 hover:border-cyan-400 text-cyan-200'
  },
  {
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400',
    box: 'border-indigo-500/20 bg-indigo-950/10 shadow-[0_4px_30px_rgba(99,102,241,0.05)]',
    cardBorder: 'border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.15)]',
    accentText: 'text-indigo-400',
    progressBarBg: 'bg-indigo-500',
    btnNext: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500',
    btnSteps: 'border-indigo-500/25 bg-indigo-500/5 text-indigo-300 hover:bg-indigo-500/15 hover:border-indigo-400/40',
    btnDone: 'bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 hover:border-indigo-400 text-indigo-200'
  },
  {
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500',
    box: 'border-purple-500/20 bg-purple-950/10 shadow-[0_4px_30px_rgba(168,85,247,0.05)]',
    cardBorder: 'border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.15)]',
    accentText: 'text-purple-400',
    progressBarBg: 'bg-purple-500',
    btnNext: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500',
    btnSteps: 'border-purple-500/25 bg-purple-500/5 text-purple-300 hover:bg-purple-500/15 hover:border-purple-400/40',
    btnDone: 'bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 hover:border-purple-400 text-cyan-200'
  },
  {
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400',
    box: 'border-teal-500/20 bg-[#0f1f18]/30 shadow-[0_4px_30px_rgba(20,184,166,0.05)]',
    cardBorder: 'border-teal-500/20 shadow-[0_0_40px_rgba(20,184,166,0.15)]',
    accentText: 'text-teal-400',
    progressBarBg: 'bg-teal-500',
    btnNext: 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-600',
    btnSteps: 'border-teal-500/25 bg-teal-500/5 text-teal-300 hover:bg-teal-500/15 hover:border-teal-400/40',
    btnDone: 'bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/25 hover:border-teal-400 text-teal-200'
  },
  {
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500',
    box: 'border-blue-500/20 bg-[#111325]/30 shadow-[0_4px_30px_rgba(59,130,246,0.05)]',
    cardBorder: 'border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.15)]',
    accentText: 'text-blue-400',
    progressBarBg: 'bg-blue-500',
    btnNext: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500',
    btnSteps: 'border-blue-500/25 bg-blue-500/5 text-blue-300 hover:bg-blue-500/15 hover:border-blue-400/40',
    btnDone: 'bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 hover:border-blue-400 text-teal-200'
  },
  {
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500',
    box: 'border-fuchsia-500/20 bg-[#1f111a]/30 shadow-[0_4px_30px_rgba(217,70,239,0.05)]',
    cardBorder: 'border-fuchsia-500/20 shadow-[0_0_40px_rgba(217,70,239,0.15)]',
    accentText: 'text-fuchsia-400',
    progressBarBg: 'bg-fuchsia-500',
    btnNext: 'bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500',
    btnSteps: 'border-fuchsia-500/25 bg-fuchsia-500/5 text-fuchsia-300 hover:bg-fuchsia-500/15 hover:border-fuchsia-400/40',
    btnDone: 'bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border border-fuchsia-500/25 hover:border-fuchsia-400 text-fuchsia-200'
  }
];

function getNextNonRepeatingTheme() {
  let themeIndex;
  do {
    themeIndex = Math.floor(Math.random() * SUGGESTION_THEMES.length);
  } while (themeIndex === lastSuggestionThemeIndex && SUGGESTION_THEMES.length > 1);
  lastSuggestionThemeIndex = themeIndex;
  return SUGGESTION_THEMES[themeIndex];
}

function safeTranslate(key) {
  if (typeof TRANSLATIONS === 'undefined') return key;
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.de?.[key] || key;
}

// Integrierte Sprachvorlesefunktion mit modularem Rollenzugriff
function speakText(text, index = 0) {
  if (typeof speakWithProfile === 'function') {
    // Ruft das rollenspezifische Sprachmuster aus timer.js auf
    speakWithProfile(text, index);
  } else {
    // Lokaler Fallback
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const langMap = { de: 'de-DE', en: 'en-US', es: 'es-ES', el: 'el-GR' };
        const targetLang = langMap[currentLang] || 'de-DE';
        utterance.lang = targetLang;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error("Fehler bei Fallback speakText:", e);
      }
    }
  }
}

// Bricht die Sprachausgabe beim Verlassen des Hovers ab
function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Hilfsfunktion: Bereinigt Text von führenden Zahlen und Punkten
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
        <div class="flex items-center justify-center gap-2.5 mt-2 w-full">
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

function generateTaskSteps(specificTask) {
  let val = specificTask;
  if (!val) {
    const select = document.getElementById('helper-task-select'); val = select ? select.value : '';
  }
  if (!val) {
    const resBox = document.getElementById('helper-steps-result');
    if (resBox) resBox.innerHTML = `<p class="text-xs text-gray-400 italic text-center py-4">${currentLang === 'de' ? 'Bitte wähle oben eine Aufgabe aus.' : 'Please select a task.'}</p>`;
    return;
  }
  if (!currentActiveTaskRef || currentActiveTaskRef.task !== val) currentActiveTaskRef = { task: val };
  const resBox = document.getElementById('helper-steps-result'); if (!resBox) return;
  
  const deKey = (typeof getGermanStandardKey === 'function') ? getGermanStandardKey(val) : val;
  const dbExists = typeof TASK_STEPS_DATABASE !== 'undefined' && TASK_STEPS_DATABASE[deKey];
  let steps = dbExists ? TASK_STEPS_DATABASE[deKey][currentLang] : null;
  
  if (!steps || steps.length === 0) {
    const templates = (typeof FALLBACK_STEPS !== 'undefined') ? FALLBACK_STEPS : null;
    const template = templates ? (templates[currentLang] || templates['en']) : ["Step 1: {task}"];
    steps = template.map(step => step.replace('{task}', val));
  }
  
  currentGeneratedSteps = steps; resBox.innerHTML = '';
  if (!state.completedSteps) state.completedSteps = {};
  const completedIndices = state.completedSteps[val] || [];
  
  const clickToCompleteText = {
    de: 'Klicken zum Erledigen',
    en: 'Click to complete',
    es: 'Clic para completar',
    el: 'Κλικ για ολοκλήρωση'
  }[currentLang] || 'Click to complete';
  
  steps.forEach((stepText, idx) => {
    const isChecked = completedIndices.includes(idx);
    
    if (isChecked) return;
    
    const cleanedText = cleanStepText(stepText);
    
    const stepDiv = document.createElement('div');
    const activeClasses = 'border-l-2 border-l-[var(--accent)] bg-white/[0.02] border-y border-r border-white/5 text-gray-200 hover:bg-[var(--accent)]/5 hover:border-[var(--accent)]/20';
      
    stepDiv.className = `group relative flex items-center justify-between gap-3 p-3.5 rounded-r-lg rounded-l-sm border-0 transition-all duration-200 ${activeClasses} my-2 cursor-pointer`;
    
    stepDiv.onclick = () => {
      stopSpeaking();
      handleStepClick(idx);
    };
    
    // Vorlesen des bereinigten Textes beim Hovern mit indexbasierter Stimmenrotation
    stepDiv.onmouseenter = () => speakText(cleanedText, idx);
    stepDiv.onmouseleave = () => stopSpeaking();
    
    stepDiv.innerHTML = `
      <span class="step-text flex-1 text-xs leading-snug break-words">${cleanedText}</span>
      <span class="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-[var(--accent-light)] select-none transition-all duration-150 shrink-0 pr-1 tracking-wide font-sans">
        ${clickToCompleteText}
      </span>
    `;
    resBox.appendChild(stepDiv);
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function handleStepClick(stepIndex) {
  let targetTask = currentActiveTaskRef?.task;
  if (!targetTask) {
    const select = document.getElementById('helper-task-select'); 
    targetTask = select ? select.value : '';
  }
  if (!targetTask) return;
  
  if (!state.completedSteps) state.completedSteps = {};
  if (!state.completedSteps[targetTask]) state.completedSteps[targetTask] = [];
  
  const isCompleted = state.completedSteps[targetTask].includes(stepIndex);
  
  if (!isCompleted) {
    state.completedSteps[targetTask].push(stepIndex);
    if (typeof playProceduralSound === 'function') playProceduralSound();
  } else {
    state.completedSteps[targetTask] = state.completedSteps[targetTask].filter(i => i !== stepIndex);
  }
  
  saveState();
  generateTaskSteps(targetTask);
  
  const deKey = (typeof getGermanStandardKey === 'function') ? getGermanStandardKey(targetTask) : targetTask;
  const dbExists = typeof TASK_STEPS_DATABASE !== 'undefined' && TASK_STEPS_DATABASE[deKey];
  let steps = dbExists ? TASK_STEPS_DATABASE[deKey][currentLang] : null;
  
  if (!steps || steps.length === 0) {
    const templates = (typeof FALLBACK_STEPS !== 'undefined') ? FALLBACK_STEPS : null;
    const template = templates ? (templates[currentLang] || templates['en']) : ["Step 1: {task}"];
    steps = template.map(step => step.replace('{task}', targetTask));
  }
  
  const completedCount = state.completedSteps[targetTask].length;
  if (steps.length > 0 && completedCount === steps.length) {
    let targetCat = currentActiveTaskRef?.category;
    let catToUse = targetCat; 
    let idxToUse = -1;
    
    if (catToUse && state.items[catToUse]) {
      idxToUse = state.items[catToUse].indexOf(targetTask);
    }
    
    if (idxToUse === -1) {
      for (const cat of ['daily', 'weekly', 'todo', 'occasionally', 'termine']) {
        const idx = (state?.items?.[cat] || []).indexOf(targetTask);
        if (idx !== -1) { catToUse = cat; idxToUse = idx; break; }
      }
    }
    
    setTimeout(() => {
      closeHelperModal(); 
      delete state.completedSteps[targetTask]; 
      saveState();
      if (catToUse && idxToUse !== -1) {
        handleCompleteTask(catToUse, idxToUse);
      } else {
        if (typeof playProceduralSound === 'function') playProceduralSound(); 
        if (typeof triggerConfetti === 'function') triggerConfetti();
        if (typeof showPraise === 'function') showPraise();
        showToast({
          de: `🎉 Alle Schritte gelöst! "${targetTask}" ist erledigt!`,
          en: `🎉 All steps completed! "${targetTask}" is done!`,
          es: `🎉 ¡Todos los steps completed! ¡"${targetTask}" ist erledigt!`,
          el: `🎉 Όλα τα βήματα ολοκληρώθηκαν! Η εργασία "${targetTask}" έγινε!`
        }[currentLang]);
      }
    }, 350);
  }
}

function triggerDopamineKick() {
  const dopamineTasksObj = (typeof DOPAMINE_TASKS !== 'undefined') ? DOPAMINE_TASKS : null;
  const tips = dopamineTasksObj ? (dopamineTasksObj[currentLang] || dopamineTasksObj['en']) : ["Do 5 jumping jacks."];
  const randomTask = tips[Math.floor(Math.random() * tips.length)];
  currentDopamineTask = randomTask;
  
  const boxEl = document.getElementById('dopamine-task-box');
  if (boxEl) {
    const doneBtnLabel = safeTranslate('dopamine_kick_done');
    const rerollLabel = safeTranslate('dopamine_kick_other');
    
    boxEl.innerHTML = `
      <span id="dopamine-task-text" class="font-bold text-pink-300 text-sm animate-pulse">${randomTask}</span>
      <div class="flex items-center gap-2 w-full mt-2 justify-center">
        <button onclick="completeDopamineKick()" class="px-4 py-1.5 bg-pink-500 hover:bg-pink-400 text-white rounded-lg text-xs font-bold transition cursor-pointer font-sans shadow-md">
          ${doneBtnLabel}
        </button>
        <button onclick="triggerDopamineKick()" class="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-[10px] font-semibold transition cursor-pointer font-sans">
          ${rerollLabel}
        </button>
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

function completeDopamineKick() {
  if (!currentDopamineTask) return;
  saveHistory();
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const todayStr = now.toISOString().split('T')[0];
  const logText = `${safeTranslate('dopamine_kick_success_log')} ${currentDopamineTask}`;
    
  state.done.push({ task: logText, origin: 'adhd', date: todayStr, time: timeStr });
  saveState();
  if (typeof playProceduralSound === 'function') playProceduralSound();
  if (typeof triggerConfetti === 'function') triggerConfetti();
  if (typeof showPraise === 'function') showPraise();
  resetDopamineBox();
  if (typeof updateReportPanel === 'function') updateReportPanel();
  showToast(safeTranslate('dopamine_kick_completed_toast'));
}

function resetDopamineBox() {
  currentDopamineTask = null;
  const boxEl = document.getElementById('dopamine-task-box');
  if (boxEl) {
    const title = safeTranslate('dopamine_kick_title');
    const btnLabel = safeTranslate('dopamine_kick_start');
    boxEl.innerHTML = `
      <span id="dopamine-task-text" class="font-bold">${title}</span>
      <div class="flex items-center gap-2 w-full mt-1 justify-center">
        <button onclick="triggerDopamineKick()" class="px-3 py-1.5 bg-pink-500/25 hover:bg-pink-500/40 border border-pink-500/40 text-pink-100 rounded-lg text-[10px] font-bold transition cursor-pointer font-sans">
          ${btnLabel}
        </button>
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}
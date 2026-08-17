// helper-core.js Teil 2/2: Schritt-Generierung & Dopamin-Kick-Logik
function generateTaskSteps(specificTask) {
  let val = specificTask;
  if (!val) {
    const select = document.getElementById('helper-task-select'); val = select ? select.value : '';
  }
  if (!val) {
    const resBox = document.getElementById('helper-steps-result');
    if (resBox) resBox.innerHTML = `<p class="text-xs text-gray-400 italic text-center py-4">${tr({ de: 'Bitte wähle oben eine Aufgabe aus.', en: 'Please select a task.', es: 'Por favor, selecciona una tarea arriba.', el: 'Παρακαλώ επίλεξε μια εργασία παραπάνω.', fr: 'Merci de choisir une tâche ci-dessus.', it: "Seleziona un'attività qui sopra." })}</p>`;
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
    if (typeof playProceduralSound === 'function') playProceduralSound(3);
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
        if (typeof playProceduralSound === 'function') playProceduralSound(3); 
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
  if (typeof playProceduralSound === 'function') playProceduralSound(3);
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

 
 

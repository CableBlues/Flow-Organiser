let currentActiveTaskRef = null;
let currentGeneratedSteps = [];
let currentDopamineTask = null;

function openAdhdModal(type) {
  if (type === 'pick') {
    const modal = document.getElementById('adhd-pick-modal');
    if (modal) modal.classList.remove('hidden');
    resetDopamineBox(); // Startet den Dopamin-Bereich frisch
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
    const doneMsg = { de: '🎉 Alle Aufgaben erledigt! Fantastisch, genieß deinen Tag!', en: '🎉 All tasks completed! Fantastic, enjoy your day!', es: '🎉 ¡Todas las tareas completadas! ¡Disfruta de tu día!', el: '🎉 Όλες οι εργασίες ολοκληρώθηκαν! Απολαύστε τη μέρα σας!' }[currentLang];
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

function triggerDopamineKick() {
  const tips = DOPAMINE_TASKS[currentLang] || DOPAMINE_TASKS['en'];
  const randomTask = tips[Math.floor(Math.random() * tips.length)];
  currentDopamineTask = randomTask;
  
  const boxEl = document.getElementById('dopamine-task-box');
  if (boxEl) {
    const doneBtnLabel = t('dopamine_kick_done');
    const rerollLabel = t('dopamine_kick_other');
    
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
    lucide.createIcons();
  }
}

function completeDopamineKick() {
  if (!currentDopamineTask) return;
  saveHistory();
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const todayStr = now.toISOString().split('T')[0];
  const logText = `${t('dopamine_kick_success_log')} ${currentDopamineTask}`;
    
  state.done.push({ task: logText, origin: 'adhd', date: todayStr, time: timeStr });
  saveState();
  playProceduralSound();
  triggerConfetti();
  showPraise();
  resetDopamineBox();
  if (typeof updateReportPanel === 'function') updateReportPanel();
  showToast(t('dopamine_kick_completed_toast'));
}

function resetDopamineBox() {
  currentDopamineTask = null;
  const boxEl = document.getElementById('dopamine-task-box');
  if (boxEl) {
    const title = t('dopamine_kick_title');
    const btnLabel = t('dopamine_kick_start');
    boxEl.innerHTML = `
      <span id="dopamine-task-text" class="font-bold">${title}</span>
      <div class="flex items-center gap-2 w-full mt-1 justify-center">
        <button onclick="triggerDopamineKick()" class="px-3 py-1.5 bg-pink-500/25 hover:bg-pink-500/40 border border-pink-500/40 text-pink-100 rounded-lg text-[10px] font-bold transition cursor-pointer font-sans">
          ${btnLabel}
        </button>
      </div>
    `;
    lucide.createIcons();
  }
}
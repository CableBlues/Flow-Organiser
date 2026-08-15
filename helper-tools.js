function openCompassModal() {
  const modal = document.getElementById('helper-compass-modal');
  if (modal) modal.classList.remove('hidden');
  
  returnToCompassEntry();
  
  const textarea = document.getElementById('compass-query-input');
  if (textarea) {
    textarea.value = compassActiveDilemma;
    textarea.focus();
  }
}

function closeCompassModal() {
  const modal = document.getElementById('helper-compass-modal');
  if (modal) modal.classList.add('hidden');
  if (coinVetoInterval) {
    clearInterval(coinVetoInterval);
    coinVetoInterval = null;
  }
}

function submitCompassQuery() {
  const textarea = document.getElementById('compass-query-input');
  const query = textarea ? textarea.value.trim() : '';
  
  if (!query) {
    showToast(currentLang === 'de' ? "Formuliere bitte dein Dilemma!" : "Please write down your dilemma!");
    return;
  }
  
  compassActiveDilemma = query;
  const label = document.getElementById('compass-active-dilemma-label');
  if (label) label.innerText = query;
  
  document.getElementById('compass-step-entry').classList.add('hidden');
  document.getElementById('compass-step-tools').classList.remove('hidden');
  
  switchCompassTab('coin');
  
  const optA = document.getElementById('coin-opt-a');
  const optB = document.getElementById('coin-opt-b');
  if (optA && optB) {
    optA.value = currentLang === 'de' ? "Option A (Tu es)" : "Option A (Do it)";
    optB.value = currentLang === 'de' ? "Option B (Lass es)" : "Option B (Don't do it)";
  }
}

function returnToCompassEntry() {
  document.getElementById('compass-step-entry').classList.remove('hidden');
  document.getElementById('compass-step-tools').classList.add('hidden');
  if (coinVetoInterval) {
    clearInterval(coinVetoInterval);
    coinVetoInterval = null;
  }
}

function switchCompassTab(tab) {
  const tabs = ['coin', 'scale', 'spoon', 'prioritizer', 'splitter', 'braindump', 'ten', 'fear'];
  
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-btn-${t}`);
    const pane = document.getElementById(`compass-pane-${t}`);
    
    if (btn && pane) {
      if (t === tab) {
        btn.className = "py-1 rounded text-rose-300 bg-rose-500/10 border border-rose-500/20";
        pane.classList.remove('hidden');
      } else {
        btn.className = "py-1 rounded text-gray-400 hover:text-white";
        pane.classList.add('hidden');
      }
    }
  });
  
  if (tab === 'scale') {
    renderScaleArguments();
  } else if (tab === 'spoon') {
    renderSpoonOptions();
  } else if (tab === 'prioritizer') {
    renderPrioritizerResults();
  } else if (tab === 'splitter') {
    const input = document.getElementById('splitter-task-input');
    if (input) input.value = compassActiveDilemma;
    renderSplitterSteps([]);
  } else if (tab === 'braindump') {
    resetBrainDumpSorter();
  } else if (tab === 'ten') {
    loadTenPerspectiveData();
  } else if (tab === 'fear') {
    loadFearSettingData();
  }
}

function triggerCoinToss() {
  const optA = document.getElementById('coin-opt-a').value.trim();
  const optB = document.getElementById('coin-opt-b').value.trim();
  
  if (!optA || !optB) {
    showToast(currentLang === 'de' ? "Bitte trage beide Optionen ein!" : "Please fill in both options!");
    return;
  }
  
  const resultBox = document.getElementById('coin-toss-result-box');
  const spinning = document.getElementById('coin-toss-spinning');
  const finalDiv = document.getElementById('coin-toss-final');
  const verdict = document.getElementById('coin-toss-verdict');
  const vetoCountdown = document.getElementById('coin-veto-countdown');
  const vetoBtn = document.getElementById('coin-veto-btn');
  
  if (coinVetoInterval) {
    clearInterval(coinVetoInterval);
    coinVetoInterval = null;
  }
  
  resultBox.classList.remove('hidden');
  spinning.classList.remove('hidden');
  finalDiv.classList.add('hidden');
  vetoBtn.classList.remove('hidden');
  
  if (typeof playProceduralSound === 'function') {
    playProceduralSound(10);
  }
  
  setTimeout(() => {
    spinning.classList.add('hidden');
    finalDiv.classList.remove('hidden');
    
    const random = Math.random() < 0.5;
    coinWinningOption = random ? optA : optB;
    coinLosingOption = random ? optB : optA;
    
    verdict.innerText = coinWinningOption;
    
    coinVetoCountdownValue = 10;
    vetoCountdown.innerText = currentLang === 'de' ? `Veto-Dauer: ${coinVetoCountdownValue}s` : `Veto duration: ${coinVetoCountdownValue}s`;
    
    coinVetoInterval = setInterval(() => {
      coinVetoCountdownValue--;
      if (coinVetoCountdownValue <= 0) {
        clearInterval(coinVetoInterval);
        coinVetoInterval = null;
        vetoCountdown.innerText = currentLang === 'de' ? "Veto-Zeit abgelaufen." : "Veto time expired.";
        vetoBtn.classList.add('hidden');
      } else {
        vetoCountdown.innerText = currentLang === 'de' ? `Veto-Dauer: ${coinVetoCountdownValue}s` : `Veto duration: ${coinVetoCountdownValue}s`;
      }
    }, 1000);
  }, 1200);
}

function triggerCoinVeto() {
  if (coinVetoInterval) {
    clearInterval(coinVetoInterval);
    coinVetoInterval = null;
  }
  
  const verdict = document.getElementById('coin-toss-verdict');
  const vetoCountdown = document.getElementById('coin-veto-countdown');
  const vetoBtn = document.getElementById('coin-veto-btn');
  
  const temp = coinWinningOption;
  coinWinningOption = coinLosingOption;
  coinLosingOption = temp;
  
  verdict.innerText = coinWinningOption;
  
  const message = currentLang === 'de' 
    ? `VETO EINLEGEN! Dein Unterbewusstsein wollte also insgeheim doch: ${coinWinningOption}!` 
    : `VETO ACTIVATED! Your subconscious secretly wanted: ${coinWinningOption}!`;
    
  vetoCountdown.innerHTML = `<span class="text-amber-400 font-bold">${message}</span>`;
  vetoBtn.classList.add('hidden');
  
  if (typeof playProceduralSound === 'function') {
    playProceduralSound(0);
  }
  if (typeof triggerConfetti === 'function') {
    triggerConfetti();
  }
}

function handleAddScaleArgument() {
  const textInput = document.getElementById('scale-add-text');
  const typeSelect = document.getElementById('scale-add-type');
  const weightSelect = document.getElementById('scale-add-weight');
  
  const text = textInput ? textInput.value.trim() : '';
  const type = typeSelect ? typeSelect.value : 'pro';
  const weight = weightSelect ? parseInt(weightSelect.value) : 1;
  
  if (!text) {
    showToast(currentLang === 'de' ? "Argument eintragen!" : "Write down an argument!");
    return;
  }
  
  if (!state.compassScaleArguments) {
    state.compassScaleArguments = [];
  }
  
  state.compassScaleArguments.push({ text, type, weight });
  saveState();
  
  if (textInput) textInput.value = '';
  renderScaleArguments();
  
  if (typeof playProceduralSound === 'function') {
    playProceduralSound(3);
  }
}

function removeScaleArgument(index) {
  if (state.compassScaleArguments) {
    state.compassScaleArguments.splice(index, 1);
    saveState();
    renderScaleArguments();
  }
}

function clearScaleMatrix() {
  state.compassScaleArguments = [];
  saveState();
  renderScaleArguments();
}

function renderScaleArguments() {
  const proList = document.getElementById('scale-pro-list');
  const conList = document.getElementById('scale-con-list');
  const verdictBox = document.getElementById('scale-verdict-box');
  
  if (!proList || !conList || !verdictBox) return;
  
  proList.innerHTML = '';
  conList.innerHTML = '';
  
  const args = state.compassScaleArguments || [];
  
  let scorePro = 0;
  let scoreCon = 0;
  
  args.forEach((arg, idx) => {
    const item = document.createElement('div');
    item.className = "flex justify-between items-center bg-white/[0.03] border border-white/5 p-1 rounded text-[10px] text-gray-200 leading-normal";
    
    const stars = "⭐".repeat(arg.weight);
    item.innerHTML = `
      <span class="truncate pr-1">${arg.text} ${stars}</span>
      <button onclick="removeScaleArgument(${idx})" class="text-gray-500 hover:text-red-400 font-bold transition text-xs shrink-0 p-0.5">×</button>
    `;
    
    if (arg.type === 'pro') {
      scorePro += arg.weight;
      proList.appendChild(item);
    } else {
      scoreCon += arg.weight;
      conList.appendChild(item);
    }
  });
  
  if (args.length === 0) {
    verdictBox.innerHTML = `<span>${currentLang === 'de' ? "Noch keine Argumente eingetragen." : "No arguments registered yet."}</span><button onclick="clearScaleMatrix()" class="hidden"></button>`;
  } else {
    let verdictText = "";
    if (scorePro > scoreCon) {
      verdictText = currentLang === 'de' 
        ? `<span class="text-emerald-400 font-bold">PRO überwiegt (${scorePro} vs ${scoreCon}) · Tu es! 🎉</span>` 
        : `<span class="text-emerald-400 font-bold">PRO wins (${scorePro} vs ${scoreCon}) · Do it! 🎉</span>`;
    } else if (scoreCon > scorePro) {
      verdictText = currentLang === 'de' 
        ? `<span class="text-rose-400 font-bold">CONTRA überwiegt (${scorePro} vs ${scoreCon}) · Lass es lieber! 🛑</span>` 
        : `<span class="text-rose-400 font-bold">CONTRA wins (${scorePro} vs ${scoreCon}) · Skip it! 🛑</span>`;
    } else {
      verdictText = currentLang === 'de' 
        ? `<span class="text-amber-400 font-bold">Unentschieden (${scorePro} vs ${scoreCon}) · Beide Wege sind gleichwertig.</span>` 
        : `<span class="text-amber-400 font-bold">Tie (${scorePro} vs ${scoreCon}) · Both paths are equally weighted.</span>`;
    }
    
    verdictBox.innerHTML = `
      ${verdictText}
      <button onclick="clearScaleMatrix()" class="text-[9px] text-gray-500 hover:text-red-400 font-bold shrink-0">Zurücksetzen</button>
    `;
  }
}

function renderSpoonOptions() {
  const container = document.getElementById('spoon-options-list');
  if (!container) return;
  container.innerHTML = '';
  
  if (!state.compassSpoonOptions) {
    state.compassSpoonOptions = JSON.parse(JSON.stringify(DEFAULT_SPOON_OPTIONS));
  }
  
  const options = state.compassSpoonOptions;
  if (!state.compassCheckedSpoonIndices) {
    state.compassCheckedSpoonIndices = [];
  }
  
  options.forEach((opt, idx) => {
    const isChecked = state.compassCheckedSpoonIndices.includes(idx);
    const label = document.createElement('label');
    label.className = "flex items-center justify-between p-1.5 bg-white/[0.02] border border-white/5 rounded-lg text-[10px] text-gray-300 hover:bg-white/[0.05] cursor-pointer transition select-none";
    
    const spoonsStr = "🥄".repeat(opt.cost);
    label.innerHTML = `
      <div class="flex items-center gap-2">
        <input type="checkbox" onchange="toggleSpoonOption(${idx})" ${isChecked ? 'checked' : ''} class="w-3.5 h-3.5 rounded bg-black border-white/10 text-rose-500 accent-rose-500 cursor-pointer" />
        <span class="font-semibold text-white">${opt.name}</span>
      </div>
      <span class="text-rose-300 font-mono font-bold">${spoonsStr}</span>
    `;
    container.appendChild(label);
  });
  
  recalculateSpoonCheck();
}

function toggleSpoonOption(index) {
  if (!state.compassCheckedSpoonIndices) {
    state.compassCheckedSpoonIndices = [];
  }
  const idxOf = state.compassCheckedSpoonIndices.indexOf(index);
  if (idxOf === -1) {
    state.compassCheckedSpoonIndices.push(index);
  } else {
    state.compassCheckedSpoonIndices.splice(idxOf, 1);
  }
  saveState();
  recalculateSpoonCheck();
}

function handleAddSpoonOptionPrompt() {
  const name = prompt(currentLang === 'de' ? "Name des Vorhabens:" : "Name of target task:");
  if (!name) return;
  const cost = parseInt(prompt(currentLang === 'de' ? "Aufwand in Löffeln (1-4):" : "Spoon cost (1-4):", "2"));
  if (isNaN(cost) || cost < 1 || cost > 4) {
    showToast(currentLang === 'de' ? "Zahl zwischen 1 und 4 eintragen!" : "Enter a number between 1 and 4!");
    return;
  }
  
  if (!state.compassSpoonOptions) {
    state.compassSpoonOptions = JSON.parse(JSON.stringify(DEFAULT_SPOON_OPTIONS));
  }
  
  state.compassSpoonOptions.push({ name, cost });
  saveState();
  renderSpoonOptions();
}

function recalculateSpoonCheck() {
  const batterySelect = document.getElementById('spoon-battery-select');
  const verdictText = document.getElementById('spoon-verdict-text');
  
  if (!batterySelect || !verdictText) return;
  
  const level = batterySelect.value;
  let budget = 2;
  if (level === 'high') budget = 4;
  else if (level === 'med') budget = 2;
  else if (level === 'low') budget = 1;
  else if (level === 'overwhelmed') budget = 0;
  
  const options = state.compassSpoonOptions || DEFAULT_SPOON_OPTIONS;
  const checkedIndices = state.compassCheckedSpoonIndices || [];
  
  let totalCost = 0;
  checkedIndices.forEach(idx => {
    if (options[idx]) totalCost += options[idx].cost;
  });
  
  if (level === 'overwhelmed') {
    verdictText.innerHTML = currentLang === 'de' 
      ? `<span class="text-rose-400 font-bold">Schutzmodus aktiv! Heute bitte gar keine anstrengenden Aktivitäten. Nur ausruhen!</span>` 
      : `<span class="text-rose-400 font-bold">Protection mode active! No exhausting activities today. Rest up!</span>`;
  } else {
    const diff = budget - totalCost;
    if (diff >= 0) {
      verdictText.innerHTML = currentLang === 'de' 
        ? `<span class="text-emerald-400 font-bold">Energie reicht aus! Du hast noch ${diff} von ${budget} Löffeln übrig.</span>` 
        : `<span class="text-emerald-400 font-bold">Energy is sufficient! You have ${diff} out of ${budget} spoons remaining.</span>`;
    } else {
      verdictText.innerHTML = currentLang === 'de' 
        ? `<span class="text-rose-400 font-bold">Achtung! Deine Energie reicht nicht aus. Du überlastest dich um ${Math.abs(diff)} Löffel. Streiche unwichtige Dinge!</span>` 
        : `<span class="text-rose-400 font-bold">Caution! Your energy is insufficient. You are overloaded by ${Math.abs(diff)} spoons. Cut non-essentials!</span>`;
    }
  }
}

function handleAddPrioritizerTask() {
  const textInput = document.getElementById('prioritizer-task-input');
  const effortSelect = document.getElementById('prioritizer-effort');
  const funSelect = document.getElementById('prioritizer-fun');
  
  const text = textInput ? textInput.value.trim() : '';
  const effort = effortSelect ? parseInt(effortSelect.value) : 3;
  const fun = funSelect ? parseInt(funSelect.value) : 3;
  
  if (!text) {
    showToast(currentLang === 'de' ? "Vorhaben eintragen!" : "Specify your task!");
    return;
  }
  
  if (!state.compassPrioritizerTasks) {
    state.compassPrioritizerTasks = [];
  }
  
  state.compassPrioritizerTasks.push({ text, effort, fun });
  saveState();
  
  if (textInput) textInput.value = '';
  renderPrioritizerResults();
  
  if (typeof playProceduralSound === 'function') {
    playProceduralSound(3);
  }
}

function removePrioritizerTask(index) {
  if (state.compassPrioritizerTasks) {
    state.compassPrioritizerTasks.splice(index, 1);
    saveState();
    renderPrioritizerResults();
  }
}

function addPrioritizedTaskToTodo(index) {
  if (!state.compassPrioritizerTasks || !state.compassPrioritizerTasks[index]) return;
  const task = state.compassPrioritizerTasks[index];
  
  saveHistory();
  if (!state.items.todo) state.items.todo = [];
  state.items.todo.push(task.text);
  
  state.compassPrioritizerTasks.splice(index, 1);
  saveState();
  
  renderPrioritizerResults();
  if (typeof renderApp === 'function') renderApp();
  
  showToast(currentLang === 'de' ? `"${task.text}" zum Todo-Board hinzugefügt! 🚀` : `Added "${task.text}" to your Todo board! 🚀`);
  if (typeof playProceduralSound === 'function') playProceduralSound(0);
}

function renderPrioritizerResults() {
  const container = document.getElementById('prioritizer-results-list');
  if (!container) return;
  container.innerHTML = '';
  
  const list = state.compassPrioritizerTasks || [];
  if (list.length === 0) {
    container.innerHTML = `<div class="text-center text-gray-500 italic py-4 text-[10px]">${currentLang === 'de' ? "Noch keine Aufgaben priorisiert." : "No tasks prioritized yet."}</div>`;
    return;
  }
  
  const calculatedList = list.map((item, originalIndex) => {
    const score = item.fun - item.effort;
    return { ...item, score, originalIndex };
  }).sort((a, b) => b.score - a.score);
  
  calculatedList.forEach((item) => {
    const row = document.createElement('div');
    row.className = "flex justify-between items-center bg-white/[0.02] border border-white/5 p-2 rounded-xl text-[10px] text-gray-300 leading-normal";
    
    let badgeClass = "bg-gray-500/20 text-gray-300";
    let badgeText = currentLang === 'de' ? "Standard" : "Normal";
    
    if (item.score >= 2) {
      badgeClass = "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
      badgeText = currentLang === 'de' ? "EASY WIN! ⚡" : "EASY WIN! ⚡";
    } else if (item.score <= -2) {
      badgeClass = "bg-rose-500/20 text-rose-300 border border-rose-500/30";
      badgeText = currentLang === 'de' ? "Hürde ⛰️" : "Heavy Task ⛰️";
    }
    
    row.innerHTML = `
      <div class="flex items-center gap-2 overflow-hidden flex-1">
        <span class="px-1.5 py-0.5 rounded text-[8px] font-bold ${badgeClass} shrink-0">${badgeText}</span>
        <span class="truncate font-semibold text-white" title="${item.text}">${item.text}</span>
      </div>
      <div class="flex items-center gap-2 shrink-0 pl-1">
        <span class="text-gray-500 font-mono text-[8px]">Effort: ${item.effort} | Fun: ${item.fun}</span>
        <button onclick="addPrioritizedTaskToTodo(${item.originalIndex})" class="px-2 py-0.5 bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white rounded font-bold transition text-[9px]">Einplanen</button>
        <button onclick="removePrioritizerTask(${item.originalIndex})" class="text-gray-500 hover:text-red-400 font-bold transition text-xs p-0.5">×</button>
      </div>
    `;
    container.appendChild(row);
  });
}

function getGenericSplitterSteps(task) {
  if (currentLang === 'de') {
    return [
      `1. Definiere das genaue Ziel für "${task}" schriftlich auf Papier.`,
      `2. Sammle alle benötigten Werkzeuge oder Dokumente für "${task}" zusammen.`,
      `3. Erledige einen ersten, extrem winzigen 2-Minuten-Schritt für "${task}".`,
      `4. Arbeite für genau 15 Minuten ungestört an "${task}" (Timer nutzen!).`,
      `5. Atme durch, hake den Zwischenschritt ab und plane die nächste Phase.`
    ];
  } else {
    return [
      `1. Write down the exact goal of "${task}" clearly on paper.`,
      `2. Gather all tools, links, or documents needed for "${task}".`,
      `3. Do one tiny, immediate 2-minute starting step for "${task}".`,
      `4. Work undisturbed on "${task}" for exactly 15 minutes (use timer!).`,
      `5. Take a deep breath, mark this milestone, and plan the next phase.`
    ];
  }
}

function generateMicroSteps() {
  const input = document.getElementById('splitter-task-input');
  const task = input ? input.value.trim() : '';
  
  if (!task) {
    showToast(currentLang === 'de' ? "Trage ein Vorhaben ein!" : "Please write a task name!");
    return;
  }
  
  let breakdown = null;
  const norm = task.toLowerCase();
  const db = PROCEDURAL_BREAKDOWNS[currentLang] || PROCEDURAL_BREAKDOWNS['de'];
  
  for (const key in db) {
    if (norm.includes(key)) {
      breakdown = db[key];
      break;
    }
  }
  
  if (!breakdown) {
    breakdown = getGenericSplitterSteps(task);
  }
  
  renderSplitterSteps(breakdown);
  
  if (typeof playProceduralSound === 'function') {
    playProceduralSound(0);
  }
}

function renderSplitterSteps(steps) {
  const container = document.getElementById('splitter-steps-list');
  if (!container) return;
  container.innerHTML = '';
  
  if (steps.length === 0) {
    container.innerHTML = `<div class="text-center text-gray-500 italic py-5 text-[10px]">${currentLang === 'de' ? "Gib oben eine Aufgabe ein." : "Type a task name above."}</div>`;
    return;
  }
  
  steps.forEach((step, idx) => {
    const row = document.createElement('div');
    row.className = "flex justify-between items-center bg-white/[0.02] border border-white/5 p-2 rounded-xl text-[10px] text-gray-300 leading-normal gap-2";
    
    row.innerHTML = `
      <span class="flex-1 break-words font-medium">${step}</span>
      <button onclick="addMicroStepToTodo('${step.replace(/'/g, "\\'")}')" class="px-2 py-1 bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white rounded font-bold transition text-[8px] whitespace-nowrap shrink-0">In Todo Board</button>
    `;
    container.appendChild(row);
  });
}

function addMicroStepToTodo(stepText) {
  const cleaned = cleanStepText(stepText);
  saveHistory();
  if (!state.items.todo) state.items.todo = [];
  state.items.todo.push(cleaned);
  saveState();
  
  if (typeof renderApp === 'function') renderApp();
  showToast(currentLang === 'de' ? "Schritt zum Todo-Board hinzugefügt! ⚡" : "Step added to your Todo board! ⚡");
  
  if (typeof playProceduralSound === 'function') {
    playProceduralSound(3);
  }
}

function resetBrainDumpSorter() {
  const text = document.getElementById('braindump-textarea');
  if (text) text.value = '';
  
  document.getElementById('braindump-input-container').classList.remove('hidden');
  document.getElementById('braindump-sorting-container').classList.add('hidden');
  
  brainDumpThoughts = [];
  brainDumpCurrentIndex = 0;
}

function analyzeBrainDump() {
  const text = document.getElementById('braindump-textarea');
  const val = text ? text.value.trim() : '';
  
  if (!val) {
    showToast(currentLang === 'de' ? "Schreibe zuerst Gedanken auf!" : "Write down some thoughts first!");
    return;
  }
  
  brainDumpThoughts = val.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
    
  if (brainDumpThoughts.length === 0) {
    showToast(currentLang === 'de' ? "Keine gültigen Zeilen gefunden." : "No valid lines found.");
    return;
  }
  
  brainDumpCurrentIndex = 0;
  
  document.getElementById('braindump-input-container').classList.add('hidden');
  document.getElementById('braindump-sorting-container').classList.remove('hidden');
  
  updateBrainDumpUI();
  
  if (typeof playProceduralSound === 'function') {
    playProceduralSound(0);
  }
}

function updateBrainDumpUI() {
  const thoughtEl = document.getElementById('braindump-active-thought');
  const progressEl = document.getElementById('braindump-progress-counter');
  
  if (!thoughtEl || !progressEl) return;
  
  if (brainDumpCurrentIndex >= brainDumpThoughts.length) {
    showToast(currentLang === 'de' ? "Alle Gedanken einsortiert! Wunderbar aufgeräumt. 🧠" : "All thoughts sorted! Perfectly decluttered. 🧠");
    resetBrainDumpSorter();
    return;
  }
  
  const currentThought = brainDumpThoughts[brainDumpCurrentIndex];
  thoughtEl.innerText = currentThought;
  
  const left = brainDumpThoughts.length - brainDumpCurrentIndex;
  progressEl.innerText = currentLang === 'de' ? `Noch ${left} Gedanken` : `${left} thoughts left`;
}

function sortBrainDump(category) {
  const currentThought = brainDumpThoughts[brainDumpCurrentIndex];
  if (!currentThought) return;
  
  saveHistory();
  if (category === 'shopping') {
    if (!state.shoppingList) state.shoppingList = [];
    state.shoppingList.push({ name: currentThought });
  } else {
    if (!state.items[category]) state.items[category] = [];
    state.items[category].push(currentThought);
  }
  saveState();
  
  if (typeof renderApp === 'function') renderApp();
  
  if (typeof playProceduralSound === 'function') {
    playProceduralSound(3);
  }
  
  brainDumpCurrentIndex++;
  updateBrainDumpUI();
}

function skipBrainDumpThought() {
  brainDumpCurrentIndex++;
  updateBrainDumpUI();
}

function loadTenPerspectiveData() {
  const mins = document.getElementById('ten-input-mins');
  const months = document.getElementById('ten-input-months');
  const years = document.getElementById('ten-input-years');
  
  if (mins && months && years && state.compassTenPerspective) {
    mins.value = state.compassTenPerspective.mins || '';
    months.value = state.compassTenPerspective.months || '';
    years.value = state.compassTenPerspective.years || '';
  }
}

function saveTenPerspective() {
  const mins = document.getElementById('ten-input-mins').value.trim();
  const months = document.getElementById('ten-input-months').value.trim();
  const years = document.getElementById('ten-input-years').value.trim();
  
  state.compassTenPerspective = { mins, months, years };
  saveState();
  showToast(currentLang === 'de' ? "10-10-10 Perspektive gesichert! 💾" : "10-10-10 perspective saved! 💾");
}

function clearTenPerspective() {
  const mins = document.getElementById('ten-input-mins');
  const months = document.getElementById('ten-input-months');
  const years = document.getElementById('ten-input-years');
  
  if (mins) mins.value = '';
  if (months) months.value = '';
  if (years) years.value = '';
  
  state.compassTenPerspective = {};
  saveState();
}

function loadFearSettingData() {
  const worst = document.getElementById('fear-worst');
  const repair = document.getElementById('fear-repair');
  const inaction = document.getElementById('fear-inaction');
  
  if (worst && repair && inaction && state.compassFearSetting) {
    worst.value = state.compassFearSetting.worst || '';
    repair.value = state.compassFearSetting.repair || '';
    inaction.value = state.compassFearSetting.inaction || '';
  }
}

function saveFearSettingPerspective() {
  const worst = document.getElementById('fear-worst').value.trim();
  const repair = document.getElementById('fear-repair').value.trim();
  const inaction = document.getElementById('fear-inaction').value.trim();
  
  state.compassFearSetting = { worst, repair, inaction };
  saveState();
  showToast(currentLang === 'de' ? "Worst-Case Matrix gesichert! 💾" : "Worst-case matrix saved! 💾");
}

function clearFearSetting() {
  const worst = document.getElementById('fear-worst');
  const repair = document.getElementById('fear-repair');
  const inaction = document.getElementById('fear-inaction');
  
  if (worst) worst.value = '';
  if (repair) repair.value = '';
  if (inaction) inaction.value = '';
  
  state.compassFearSetting = {};
  saveState();
} 

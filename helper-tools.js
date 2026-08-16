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
    showToast(tr({ de: "Formuliere bitte dein Dilemma!", en: "Please write down your dilemma!", es: "¡Por favor, describe tu dilema!", el: "Παρακαλώ διατύπωσε το δίλημμά σου!", fr: "Formule ton dilemme, s'il te plaît !", it: "Formula il tuo dilemma, per favore!" }));
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
    optA.value = tr({ de: "Option A (Tu es)", en: "Option A (Do it)", es: "Opción A (Hazlo)", el: "Επιλογή A (Κάν' το)", fr: "Option A (Fais-le)", it: "Opzione A (Fallo)" });
    optB.value = tr({ de: "Option B (Lass es)", en: "Option B (Don't do it)", es: "Opción B (No lo hagas)", el: "Επιλογή B (Μην το κάνεις)", fr: "Option B (Ne le fais pas)", it: "Opzione B (Non farlo)" });
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
    showToast(tr({ de: "Bitte trage beide Optionen ein!", en: "Please fill in both options!", es: "¡Por favor, rellena ambas opciones!", el: "Παρακαλώ συμπλήρωσε και τις δύο επιλογές!", fr: "Merci de remplir les deux options !", it: "Compila entrambe le opzioni, per favore!" }));
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
    vetoCountdown.innerText = tr({ de: `Veto-Dauer: ${coinVetoCountdownValue}s`, en: `Veto duration: ${coinVetoCountdownValue}s`, es: `Duración del veto: ${coinVetoCountdownValue}s`, el: `Διάρκεια βέτο: ${coinVetoCountdownValue}s`, fr: `Durée du veto : ${coinVetoCountdownValue}s`, it: `Durata veto: ${coinVetoCountdownValue}s` });
    
    coinVetoInterval = setInterval(() => {
      coinVetoCountdownValue--;
      if (coinVetoCountdownValue <= 0) {
        clearInterval(coinVetoInterval);
        coinVetoInterval = null;
        vetoCountdown.innerText = tr({ de: "Veto-Zeit abgelaufen.", en: "Veto time expired.", es: "Tiempo de veto agotado.", el: "Ο χρόνος βέτο έληξε.", fr: "Temps de veto écoulé.", it: "Tempo per il veto scaduto." });
        vetoBtn.classList.add('hidden');
      } else {
        vetoCountdown.innerText = tr({ de: `Veto-Dauer: ${coinVetoCountdownValue}s`, en: `Veto duration: ${coinVetoCountdownValue}s`, es: `Duración del veto: ${coinVetoCountdownValue}s`, el: `Διάρκεια βέτο: ${coinVetoCountdownValue}s`, fr: `Durée du veto : ${coinVetoCountdownValue}s`, it: `Durata veto: ${coinVetoCountdownValue}s` });
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
  
  const message = tr({
    de: `VETO EINLEGEN! Dein Unterbewusstsein wollte also insgeheim doch: ${coinWinningOption}!`,
    en: `VETO ACTIVATED! Your subconscious secretly wanted: ${coinWinningOption}!`,
    es: `¡VETO ACTIVADO! Tu subconsciente en realidad quería: ${coinWinningOption}!`,
    el: `ΒΕΤΟ ΕΝΕΡΓΟΠΟΙΗΘΗΚΕ! Το υποσυνείδητό σου ήθελε στην πραγματικότητα: ${coinWinningOption}!`,
    fr: `VETO ACTIVÉ ! Ton inconscient voulait secrètement : ${coinWinningOption} !`,
    it: `VETO ATTIVATO! Il tuo inconscio voleva segretamente: ${coinWinningOption}!`
  });
    
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
    showToast(tr({ de: "Argument eintragen!", en: "Write down an argument!", es: "¡Escribe un argumento!", el: "Καταχώρησε ένα επιχείρημα!", fr: "Note un argument !", it: "Scrivi un argomento!" }));
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
    verdictBox.innerHTML = `<span>${tr({ de: "Noch keine Argumente eingetragen.", en: "No arguments registered yet.", es: "Aún no se han añadido argumentos.", el: "Δεν έχουν καταχωρηθεί ακόμη επιχειρήματα.", fr: "Aucun argument n'a encore été ajouté.", it: "Nessun argomento ancora inserito." })}</span><button onclick="clearScaleMatrix()" class="hidden"></button>`;
  } else {
    let verdictText = "";
    if (scorePro > scoreCon) {
      verdictText = tr({
        de: `<span class="text-emerald-400 font-bold">PRO überwiegt (${scorePro} vs ${scoreCon}) · Tu es! 🎉</span>`,
        en: `<span class="text-emerald-400 font-bold">PRO wins (${scorePro} vs ${scoreCon}) · Do it! 🎉</span>`,
        es: `<span class="text-emerald-400 font-bold">Gana el PRO (${scorePro} vs ${scoreCon}) · ¡Hazlo! 🎉</span>`,
        el: `<span class="text-emerald-400 font-bold">Νικά το ΥΠΕΡ (${scorePro} vs ${scoreCon}) · Κάν' το! 🎉</span>`,
        fr: `<span class="text-emerald-400 font-bold">Le POUR l'emporte (${scorePro} vs ${scoreCon}) · Fais-le ! 🎉</span>`,
        it: `<span class="text-emerald-400 font-bold">Vince il PRO (${scorePro} vs ${scoreCon}) · Fallo! 🎉</span>`
      });
    } else if (scoreCon > scorePro) {
      verdictText = tr({
        de: `<span class="text-rose-400 font-bold">CONTRA überwiegt (${scorePro} vs ${scoreCon}) · Lass es lieber! 🛑</span>`,
        en: `<span class="text-rose-400 font-bold">CONTRA wins (${scorePro} vs ${scoreCon}) · Skip it! 🛑</span>`,
        es: `<span class="text-rose-400 font-bold">Gana el CONTRA (${scorePro} vs ${scoreCon}) · Mejor no lo hagas! 🛑</span>`,
        el: `<span class="text-rose-400 font-bold">Νικά το ΚΑΤΑ (${scorePro} vs ${scoreCon}) · Καλύτερα μην το κάνεις! 🛑</span>`,
        fr: `<span class="text-rose-400 font-bold">Le CONTRE l'emporte (${scorePro} vs ${scoreCon}) · Mieux vaut ne pas le faire ! 🛑</span>`,
        it: `<span class="text-rose-400 font-bold">Vince il CONTRO (${scorePro} vs ${scoreCon}) · Meglio non farlo! 🛑</span>`
      });
    } else {
      verdictText = tr({
        de: `<span class="text-amber-400 font-bold">Unentschieden (${scorePro} vs ${scoreCon}) · Beide Wege sind gleichwertig.</span>`,
        en: `<span class="text-amber-400 font-bold">Tie (${scorePro} vs ${scoreCon}) · Both paths are equally weighted.</span>`,
        es: `<span class="text-amber-400 font-bold">Empate (${scorePro} vs ${scoreCon}) · Ambos caminos tienen el mismo peso.</span>`,
        el: `<span class="text-amber-400 font-bold">Ισοπαλία (${scorePro} vs ${scoreCon}) · Και οι δύο δρόμοι έχουν την ίδια βαρύτητα.</span>`,
        fr: `<span class="text-amber-400 font-bold">Égalité (${scorePro} vs ${scoreCon}) · Les deux options se valent.</span>`,
        it: `<span class="text-amber-400 font-bold">Pareggio (${scorePro} vs ${scoreCon}) · Entrambe le strade hanno lo stesso peso.</span>`
      });
    }
    
    verdictBox.innerHTML = `
      ${verdictText}
      <button onclick="clearScaleMatrix()" class="text-[9px] text-gray-500 hover:text-red-400 font-bold shrink-0">${tr({ de: 'Zurücksetzen', en: 'Reset', es: 'Restablecer', el: 'Επαναφορά', fr: 'Réinitialiser', it: 'Reimposta' })}</button>
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
  const name = prompt(tr({ de: "Name des Vorhabens:", en: "Name of target task:", es: "Nombre de la tarea:", el: "Όνομα εργασίας:", fr: "Nom de la tâche :", it: "Nome dell'attività:" }));
  if (!name) return;
  const cost = parseInt(prompt(tr({ de: "Aufwand in Löffeln (1-4):", en: "Spoon cost (1-4):", es: "Coste en cucharas (1-4):", el: "Κόστος σε κουτάλια (1-4):", fr: "Coût en cuillères (1-4) :", it: "Costo in cucchiai (1-4):" }), "2"));
  if (isNaN(cost) || cost < 1 || cost > 4) {
    showToast(tr({ de: "Zahl zwischen 1 und 4 eintragen!", en: "Enter a number between 1 and 4!", es: "¡Introduce un número entre 1 y 4!", el: "Δώσε έναν αριθμό μεταξύ 1 και 4!", fr: "Indique un nombre entre 1 et 4 !", it: "Inserisci un numero tra 1 e 4!" }));
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
    verdictText.innerHTML = tr({
      de: `<span class="text-rose-400 font-bold">Schutzmodus aktiv! Heute bitte gar keine anstrengenden Aktivitäten. Nur ausruhen!</span>`,
      en: `<span class="text-rose-400 font-bold">Protection mode active! No exhausting activities today. Rest up!</span>`,
      es: `<span class="text-rose-400 font-bold">¡Modo protección activado! Hoy nada de actividades agotadoras. ¡Solo descansar!</span>`,
      el: `<span class="text-rose-400 font-bold">Λειτουργία προστασίας ενεργή! Σήμερα καμία κουραστική δραστηριότητα. Μόνο ξεκούραση!</span>`,
      fr: `<span class="text-rose-400 font-bold">Mode protection activé ! Aucune activité épuisante aujourd'hui. Repose-toi !</span>`,
      it: `<span class="text-rose-400 font-bold">Modalità protezione attiva! Oggi niente attività faticose. Solo riposo!</span>`
    });
  } else {
    const diff = budget - totalCost;
    if (diff >= 0) {
      verdictText.innerHTML = tr({
        de: `<span class="text-emerald-400 font-bold">Energie reicht aus! Du hast noch ${diff} von ${budget} Löffeln übrig.</span>`,
        en: `<span class="text-emerald-400 font-bold">Energy is sufficient! You have ${diff} out of ${budget} spoons remaining.</span>`,
        es: `<span class="text-emerald-400 font-bold">¡Energía suficiente! Te quedan ${diff} de ${budget} cucharas.</span>`,
        el: `<span class="text-emerald-400 font-bold">Η ενέργεια επαρκεί! Σου απομένουν ${diff} από ${budget} κουτάλια.</span>`,
        fr: `<span class="text-emerald-400 font-bold">Énergie suffisante ! Il te reste ${diff} cuillères sur ${budget}.</span>`,
        it: `<span class="text-emerald-400 font-bold">Energia sufficiente! Ti restano ${diff} cucchiai su ${budget}.</span>`
      });
    } else {
      verdictText.innerHTML = tr({
        de: `<span class="text-rose-400 font-bold">Achtung! Deine Energie reicht nicht aus. Du überlastest dich um ${Math.abs(diff)} Löffel. Streiche unwichtige Dinge!</span>`,
        en: `<span class="text-rose-400 font-bold">Caution! Your energy is insufficient. You are overloaded by ${Math.abs(diff)} spoons. Cut non-essentials!</span>`,
        es: `<span class="text-rose-400 font-bold">¡Cuidado! Tu energía no es suficiente. Te sobrecargas en ${Math.abs(diff)} cucharas. ¡Elimina lo no esencial!</span>`,
        el: `<span class="text-rose-400 font-bold">Προσοχή! Η ενέργειά σου δεν επαρκεί. Υπερφορτώνεσαι κατά ${Math.abs(diff)} κουτάλια. Αφαίρεσε τα μη απαραίτητα!</span>`,
        fr: `<span class="text-rose-400 font-bold">Attention ! Ton énergie est insuffisante. Tu es en surcharge de ${Math.abs(diff)} cuillères. Élimine le superflu !</span>`,
        it: `<span class="text-rose-400 font-bold">Attenzione! La tua energia non basta. Sei sovraccarico di ${Math.abs(diff)} cucchiai. Elimina il superfluo!</span>`
      });
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
    showToast(tr({ de: "Vorhaben eintragen!", en: "Specify your task!", es: "¡Indica tu tarea!", el: "Καταχώρησε την εργασία σου!", fr: "Indique ta tâche !", it: "Indica la tua attività!" }));
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
  
  showToast(tr({ de: `"${task.text}" zum Todo-Board hinzugefügt! 🚀`, en: `Added "${task.text}" to your Todo board! 🚀`, es: `¡"${task.text}" añadido a tu tablero! 🚀`, el: `Το "${task.text}" προστέθηκε στον πίνακα! 🚀`, fr: `"${task.text}" ajouté à ton tableau ! 🚀`, it: `"${task.text}" aggiunto alla tua bacheca! 🚀` }));
  if (typeof playProceduralSound === 'function') playProceduralSound(0);
}

function renderPrioritizerResults() {
  const container = document.getElementById('prioritizer-results-list');
  if (!container) return;
  container.innerHTML = '';
  
  const list = state.compassPrioritizerTasks || [];
  if (list.length === 0) {
    container.innerHTML = `<div class="text-center text-gray-500 italic py-4 text-[10px]">${tr({ de: "Noch keine Aufgaben priorisiert.", en: "No tasks prioritized yet.", es: "Aún no hay tareas priorizadas.", el: "Δεν έχουν ταξινομηθεί ακόμη εργασίες.", fr: "Aucune tâche priorisée pour le moment.", it: "Nessuna attività ancora prioritizzata." })}</div>`;
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
    let badgeText = tr({ de: "Standard", en: "Normal", es: "Normal", el: "Κανονικό", fr: "Normal", it: "Normale" });
    
    if (item.score >= 2) {
      badgeClass = "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
      badgeText = tr({ de: "EASY WIN! ⚡", en: "EASY WIN! ⚡", es: "¡FÁCIL! ⚡", el: "ΕΥΚΟΛΟ! ⚡", fr: "FACILE ! ⚡", it: "FACILE! ⚡" });
    } else if (item.score <= -2) {
      badgeClass = "bg-rose-500/20 text-rose-300 border border-rose-500/30";
      badgeText = tr({ de: "Hürde ⛰️", en: "Heavy Task ⛰️", es: "Tarea pesada ⛰️", el: "Δύσκολο ⛰️", fr: "Tâche lourde ⛰️", it: "Attività pesante ⛰️" });
    }
    
    const effortFunLabel = tr({ de: `Aufwand: ${item.effort} | Spaß: ${item.fun}`, en: `Effort: ${item.effort} | Fun: ${item.fun}`, es: `Esfuerzo: ${item.effort} | Diversión: ${item.fun}`, el: `Προσπάθεια: ${item.effort} | Διασκέδαση: ${item.fun}`, fr: `Effort : ${item.effort} | Plaisir : ${item.fun}`, it: `Sforzo: ${item.effort} | Divertimento: ${item.fun}` });
    const scheduleLabel = tr({ de: "Einplanen", en: "Schedule", es: "Planificar", el: "Προγραμματισμός", fr: "Planifier", it: "Pianifica" });

    row.innerHTML = `
      <div class="flex items-center gap-2 overflow-hidden flex-1">
        <span class="px-1.5 py-0.5 rounded text-[8px] font-bold ${badgeClass} shrink-0">${badgeText}</span>
        <span class="truncate font-semibold text-white" title="${item.text}">${item.text}</span>
      </div>
      <div class="flex items-center gap-2 shrink-0 pl-1">
        <span class="text-gray-500 font-mono text-[8px]">${effortFunLabel}</span>
        <button onclick="addPrioritizedTaskToTodo(${item.originalIndex})" class="px-2 py-0.5 bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white rounded font-bold transition text-[9px]">${scheduleLabel}</button>
        <button onclick="removePrioritizerTask(${item.originalIndex})" class="text-gray-500 hover:text-red-400 font-bold transition text-xs p-0.5">×</button>
      </div>
    `;
    container.appendChild(row);
  });
}

function getGenericSplitterSteps(task) {
  const stepsByLang = {
    de: [
      `1. Definiere das genaue Ziel für "${task}" schriftlich auf Papier.`,
      `2. Sammle alle benötigten Werkzeuge oder Dokumente für "${task}" zusammen.`,
      `3. Erledige einen ersten, extrem winzigen 2-Minuten-Schritt für "${task}".`,
      `4. Arbeite für genau 15 Minuten ungestört an "${task}" (Timer nutzen!).`,
      `5. Atme durch, hake den Zwischenschritt ab und plane die nächste Phase.`
    ],
    en: [
      `1. Write down the exact goal of "${task}" clearly on paper.`,
      `2. Gather all tools, links, or documents needed for "${task}".`,
      `3. Do one tiny, immediate 2-minute starting step for "${task}".`,
      `4. Work undisturbed on "${task}" for exactly 15 minutes (use timer!).`,
      `5. Take a deep breath, mark this milestone, and plan the next phase.`
    ],
    es: [
      `1. Escribe en papel el objetivo exacto de "${task}".`,
      `2. Reúne todas las herramientas, enlaces o documentos necesarios para "${task}".`,
      `3. Haz un primer paso minúsculo de 2 minutos para "${task}".`,
      `4. Trabaja sin interrupciones en "${task}" durante exactamente 15 minutos (¡usa un temporizador!).`,
      `5. Respira hondo, marca este hito y planifica la siguiente fase.`
    ],
    el: [
      `1. Γράψε καθαρά τον ακριβή στόχο για "${task}" σε χαρτί.`,
      `2. Συγκέντρωσε όλα τα εργαλεία, τους συνδέσμους ή τα έγγραφα που χρειάζεσαι για "${task}".`,
      `3. Κάνε ένα πολύ μικρό, άμεσο βήμα 2 λεπτών για "${task}".`,
      `4. Δούλεψε απερίσπαστος στο "${task}" για ακριβώς 15 λεπτά (χρησιμοποίησε χρονόμετρο!).`,
      `5. Πάρε μια βαθιά ανάσα, σημείωσε αυτό το ορόσημο και σχεδίασε την επόμενη φάση.`
    ],
    fr: [
      `1. Note l'objectif précis de "${task}" clairement sur papier.`,
      `2. Rassemble tous les outils, liens ou documents nécessaires pour "${task}".`,
      `3. Fais un tout petit premier pas de 2 minutes pour "${task}".`,
      `4. Travaille sans interruption sur "${task}" pendant exactement 15 minutes (utilise un minuteur !).`,
      `5. Respire profondément, marque cette étape et planifie la phase suivante.`
    ],
    it: [
      `1. Scrivi chiaramente su carta l'obiettivo esatto di "${task}".`,
      `2. Raduna tutti gli strumenti, link o documenti necessari per "${task}".`,
      `3. Fai un primo piccolissimo passo di 2 minuti per "${task}".`,
      `4. Lavora indisturbato su "${task}" per esattamente 15 minuti (usa un timer!).`,
      `5. Fai un respiro profondo, segna questo traguardo e pianifica la fase successiva.`
    ]
  };
  return stepsByLang[currentLang] || stepsByLang.de;
}

function generateMicroSteps() {
  const input = document.getElementById('splitter-task-input');
  const task = input ? input.value.trim() : '';
  
  if (!task) {
    showToast(tr({ de: "Trage ein Vorhaben ein!", en: "Please write a task name!", es: "¡Escribe el nombre de una tarea!", el: "Γράψε ένα όνομα εργασίας!", fr: "Écris le nom d'une tâche !", it: "Scrivi il nome di un'attività!" }));
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
    container.innerHTML = `<div class="text-center text-gray-500 italic py-5 text-[10px]">${tr({ de: "Gib oben eine Aufgabe ein.", en: "Type a task name above.", es: "Escribe una tarea arriba.", el: "Γράψε μια εργασία παραπάνω.", fr: "Écris une tâche ci-dessus.", it: "Scrivi un'attività qui sopra." })}</div>`;
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
  showToast(tr({ de: "Schritt zum Todo-Board hinzugefügt! ⚡", en: "Step added to your Todo board! ⚡", es: "¡Paso añadido a tu tablero! ⚡", el: "Το βήμα προστέθηκε στον πίνακα! ⚡", fr: "Étape ajoutée à ton tableau ! ⚡", it: "Passaggio aggiunto alla tua bacheca! ⚡" }));
  
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
    showToast(tr({ de: "Schreibe zuerst Gedanken auf!", en: "Write down some thoughts first!", es: "¡Escribe primero algunas ideas!", el: "Γράψε πρώτα μερικές σκέψεις!", fr: "Écris d'abord quelques pensées !", it: "Scrivi prima qualche pensiero!" }));
    return;
  }
  
  brainDumpThoughts = val.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
    
  if (brainDumpThoughts.length === 0) {
    showToast(tr({ de: "Keine gültigen Zeilen gefunden.", en: "No valid lines found.", es: "No se encontraron líneas válidas.", el: "Δεν βρέθηκαν έγκυρες γραμμές.", fr: "Aucune ligne valide trouvée.", it: "Nessuna riga valida trovata." }));
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
    showToast(tr({ de: "Alle Gedanken einsortiert! Wunderbar aufgeräumt. 🧠", en: "All thoughts sorted! Perfectly decluttered. 🧠", es: "¡Todas las ideas organizadas! Mente despejada. 🧠", el: "Όλες οι σκέψεις ταξινομήθηκαν! Υπέροχα οργανωμένο. 🧠", fr: "Toutes les pensées triées ! Parfaitement rangé. 🧠", it: "Tutti i pensieri organizzati! Perfettamente in ordine. 🧠" }));
    resetBrainDumpSorter();
    return;
  }
  
  const currentThought = brainDumpThoughts[brainDumpCurrentIndex];
  thoughtEl.innerText = currentThought;
  
  const left = brainDumpThoughts.length - brainDumpCurrentIndex;
  progressEl.innerText = tr({ de: `Noch ${left} Gedanken`, en: `${left} thoughts left`, es: `${left} ideas restantes`, el: `${left} σκέψεις απομένουν`, fr: `${left} pensées restantes`, it: `${left} pensieri rimasti` });
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
  showToast(tr({ de: "10-10-10 Perspektive gesichert! 💾", en: "10-10-10 perspective saved! 💾", es: "¡Perspectiva 10-10-10 guardada! 💾", el: "Η προοπτική 10-10-10 αποθηκεύτηκε! 💾", fr: "Perspective 10-10-10 enregistrée ! 💾", it: "Prospettiva 10-10-10 salvata! 💾" }));
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
  showToast(tr({ de: "Worst-Case Matrix gesichert! 💾", en: "Worst-case matrix saved! 💾", es: "¡Matriz del peor caso guardada! 💾", el: "Ο πίνακας χειρότερης περίπτωσης αποθηκεύτηκε! 💾", fr: "Matrice du pire scénario enregistrée ! 💾", it: "Matrice del caso peggiore salvata! 💾" }));
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

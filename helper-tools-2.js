// helper-tools.js Teil 2/3: Loeffel-Check, ADHD-Prioritizer, Projekt-Zerteiler

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


// helper-tools.js Teil 3/3: Brain-Dump-Organizer & 10-Perspektiven/Fear-Setting

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

// ==========================================
// SOCIAL-SKRIPTER LOGIK & MODAL-HANDLING
// ==========================================

function openScriptingModal() {
  const modal = document.getElementById('helper-scripting-modal');
  if (modal) modal.classList.remove('hidden');
  onScenarioSelectChange();
}

function closeScriptingModal() {
  const modal = document.getElementById('helper-scripting-modal');
  if (modal) modal.classList.add('hidden');
}

function onScenarioSelectChange() {
  const select = document.getElementById('script-scenario-select');
  const fieldsContainer = document.getElementById('script-fields-container');
  const resultBox = document.getElementById('script-result-box');
  if (!select || !fieldsContainer) return;
  if (resultBox) resultBox.classList.add('hidden');

  const scenario = select.value;
  if (scenario === 'doctor') {
    fieldsContainer.innerHTML = `
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[9px] text-gray-500 font-bold block mb-1">Fachrichtung / Grund</label>
          <input type="text" id="field-doc-specialty" placeholder="Zahnarzt, Hausarzt..." value="Hausarzt" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
        <div>
          <label class="text-[9px] text-gray-500 font-bold block mb-1">Bevorzugter Zeitraum</label>
          <input type="text" id="field-doc-time" placeholder="Morgens, Nächste Woche..." value="Nächste Woche Montag" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
      </div>
    `;
  } else if (scenario === 'cancel') {
    fieldsContainer.innerHTML = `
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[9px] text-gray-500 font-bold block mb-1">Welcher Termin? (Name/Ort)</label>
          <input type="text" id="field-cancel-name" placeholder="Zahnarzttermin" value="Termin am Montag" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
        <div>
          <label class="text-[9px] text-gray-500 font-bold block mb-1">Grund (z.B. Krank, Verschiebung)</label>
          <input type="text" id="field-cancel-reason" placeholder="Krankheit, Terminüberschneidung..." value="akuter Krankheit" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
      </div>
    `;
  } else if (scenario === 'food') {
    fieldsContainer.innerHTML = `
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[9px] text-gray-500 font-bold block mb-1">Deine Bestellung (z.B. Pizza Salami)</label>
          <input type="text" id="field-food-order" value="1x Pizza Margherita und ein Spezi" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
        <div>
          <label class="text-[9px] text-gray-500 font-bold block mb-1">Lieferadresse</label>
          <input type="text" id="field-food-address" placeholder="Musterstraße 1, 2. Stock..." value="Musterstraße 1" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
      </div>
    `;
  } else if (scenario === 'handyman') {
    fieldsContainer.innerHTML = `
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[9px] text-gray-500 font-bold block mb-1">Was ist defekt?</label>
          <input type="text" id="field-handyman-issue" placeholder="Tropfender Wasserhahn, Heizung kalt..." value="Tropfender Wasserhahn im Bad" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
        <div>
          <label class="text-[9px] text-gray-500 font-bold block mb-1">Dringlichkeit</label>
          <input type="text" id="field-handyman-urgency" placeholder="Dringend, diese Woche..." value="diese Woche" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
      </div>
    `;
  } else if (scenario === 'custom') {
    fieldsContainer.innerHTML = `
      <div>
        <label class="text-[9px] text-gray-500 font-bold block mb-1">Eigene Stichpunkte / Anliegen</label>
        <textarea id="field-custom-text" placeholder="Schreibe hier die wichtigsten Punkte auf..." class="w-full h-16 p-2 bg-black/60 border border-white/10 rounded text-xs text-white outline-none resize-none">Ich rufe an wegen der Rückfrage zu meiner Bestellung.</textarea>
      </div>
    `;
  }
}

function generateSocialScript() {
  const scenarioSelect = document.getElementById('script-scenario-select');
  const nameInput = document.getElementById('script-user-name');
  const scenario = scenarioSelect ? scenarioSelect.value : 'doctor';
  const userName = nameInput ? (nameInput.value.trim() || "Jannis") : "Jannis";
  const textContainer = document.getElementById('script-text-container');
  if (!textContainer) return;

  let scriptText = "";

  if (scenario === 'doctor') {
    const specEl = document.getElementById('field-doc-specialty');
    const timeEl = document.getElementById('field-doc-time');
    const spec = specEl ? (specEl.value.trim() || "Arzt") : "Arzt";
    const time = timeEl ? (timeEl.value.trim() || "demnächst") : "demnächst";
    scriptText = `„Guten Tag, mein Name ist ${userName}.\nIch würde gerne einen Termin bei Ihnen im Bereich ${spec} vereinbaren.\nHaben Sie freie Termine für ${time}?\n(Warte auf Antwort)\nMeine Daten lauten: ${userName}. Vielen Dank.“`;
  } else if (scenario === 'cancel') {
    const nameEl = document.getElementById('field-cancel-name');
    const reasonEl = document.getElementById('field-cancel-reason');
    const name = nameEl ? (nameEl.value.trim() || "meinem Termin") : "meinem Termin";
    const reason = reasonEl ? (reasonEl.value.trim() || "wichtigen Gründen") : "wichtigen Gründen";
    scriptText = `„Guten Tag, mein Name ist ${userName}.\nIch rufe an, weil ich leider ${name} absagen muss.\nDer Grund dafür ist eine ${reason}.\nWäre es möglich, den Termin stattdessen zu verschieben?\n(Warte auf Antwort)\nDanke für Ihr Verständnis.“`;
  } else if (scenario === 'food') {
    const orderEl = document.getElementById('field-food-order');
    const addrEl = document.getElementById('field-food-address');
    const order = orderEl ? (orderEl.value.trim() || "etwas Essen") : "etwas Essen";
    const addr = addrEl ? (addrEl.value.trim() || "meine Adresse") : "meine Adresse";
    scriptText = `„Hallo, ich würde gerne eine Bestellung zur Lieferung aufgeben.\nUnd zwar: ${order}.\n(Warte auf Bestätigung)\nGeliefert werden soll das an die folgende Adresse: ${addr}.\nKönnen Sie mir sagen, wie lange es ungefähr dauert?\n(Warte auf Antwort)\nSuper, vielen Dank. Auf Wiederhören.“`;
  } else if (scenario === 'handyman') {
    const issueEl = document.getElementById('field-handyman-issue');
    const urgEl = document.getElementById('field-handyman-urgency');
    const issue = issueEl ? (issueEl.value.trim() || "einem Defekt") : "einem Defekt";
    const urgency = urgEl ? (urgEl.value.trim() || "demnächst") : "demnächst";
    scriptText = `„Guten Tag, mein Name ist ${userName}.\nIn meiner Wohnung gibt es ein Problem: ${issue}.\nKönnten Sie einen Handwerker schicken, der sich das ansieht?\nEs wäre gut, wenn das ${urgency} klappen könnte.\n(Warte auf Antwort)\nMeine Telefonnummer für Rückfragen ist im System hinterlegt. Vielen Dank.“`;
  } else if (scenario === 'custom') {
    const customEl = document.getElementById('field-custom-text');
    const custom = customEl ? (customEl.value.trim() || "Keine Vorgaben.") : "Keine Vorgaben.";
    scriptText = `„Guten Tag, mein Name ist ${userName}.\n\n[DEINE STICHPUNKTE FÜR DAS TELEFONAT]:\n${custom}“`;
  }

  textContainer.innerText = scriptText;
  const resultBox = document.getElementById('script-result-box');
  if (resultBox) resultBox.classList.remove('hidden');
  
  if (typeof playProceduralSound === 'function') playProceduralSound(0);
}

function copyGeneratedScript() {
  const container = document.getElementById('script-text-container');
  if (!container) return;

  navigator.clipboard.writeText(container.innerText).then(() => {
    showToast(currentLang === 'de' ? "Skript kopiert! 📋" : "Script copied! 📋");
  }).catch(err => {
    console.error("Fehler beim Kopieren:", err);
  });
}


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
          <label class="text-[9px] text-gray-400 font-bold block mb-1">${tr({ en: 'Specialty / Reason', de: 'Fachrichtung / Grund', fr: 'Spécialité / Motif', it: 'Specialità / Motivo', es: 'Especialidad / Motivo', el: 'Ειδικότητα / Αιτία' })}</label>
          <input type="text" id="field-doc-specialty" placeholder="${tr({ en: 'GP, Dentist...', de: 'Hausarzt, Zahnarzt...', fr: 'Généraliste, Dentiste...', it: 'Medico di base, Dentista...', es: 'Médico de cabecera, Dentista...', el: 'Παθολόγος, Οδοντίατρος...' })}" value="${tr({ en: 'GP', de: 'Hausarzt', fr: 'Médecin généraliste', it: 'Medico di base', es: 'Médico de cabecera', el: 'Παθολόγος' })}" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
        <div>
          <label class="text-[9px] text-gray-400 font-bold block mb-1">${tr({ en: 'Preferred timeframe', de: 'Bevorzugter Zeitraum', fr: 'Période souhaitée', it: 'Periodo preferito', es: 'Periodo preferido', el: 'Επιθυμητό διάστημα' })}</label>
          <input type="text" id="field-doc-time" placeholder="${tr({ en: 'Next week, Morning...', de: 'Nächste Woche, Vormittags...', fr: 'La semaine prochaine, Matin...', it: 'La prossima settimana, Mattina...', es: 'La próxima semana, Mañana...', el: 'Την επόμενη εβδομάδα, Πρωί...' })}" value="${tr({ en: 'Next Monday morning', de: 'Nächste Woche Montag', fr: 'Lundi prochain', it: 'Lunedì prossimo', es: 'El próximo lunes', el: 'Την επόμενη Δευτέρα' })}" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
      </div>
    `;
  } else if (scenario === 'cancel') {
    fieldsContainer.innerHTML = `
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[9px] text-gray-400 font-bold block mb-1">${tr({ en: 'Which appointment?', de: 'Welcher Termin?', fr: 'Quel rendez-vous ?', it: 'Quale appuntamento?', es: '¿Qué cita?', el: 'Ποιο ραντεβού;' })}</label>
          <input type="text" id="field-cancel-name" placeholder="${tr({ en: 'Dentist appointment', de: 'Zahnarzttermin', fr: 'Rendez-vous dentiste', it: 'Visita dentistica', es: 'Cita con el dentista', el: 'Ραντεβού οδοντιάτρου' })}" value="${tr({ en: 'Appointment on Monday', de: 'Termin am Montag', fr: 'Rendez-vous de lundi', it: 'Appuntamento di lunedì', es: 'Cita del lunes', el: 'Ραντεβού της Δευτέρας' })}" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
        <div>
          <label class="text-[9px] text-gray-400 font-bold block mb-1">${tr({ en: 'Reason (e.g. Sickness)', de: 'Grund (z.B. Krank)', fr: 'Motif (ex. Maladie)', it: 'Motivo (es. Malattia)', es: 'Motivo (ej. Enfermedad)', el: 'Αιτία (π.χ. Ασθένεια)' })}</label>
          <input type="text" id="field-cancel-reason" placeholder="${tr({ en: 'Illness, schedule conflict...', de: 'Krankheit, Überschneidung...', fr: 'Maladie, empêchement...', it: 'Malattia, contrattempo...', es: 'Enfermedad, imprevisto...', el: 'Ασθένεια, σύγκρουση προγράμματος...' })}" value="${tr({ en: 'sudden illness', de: 'akuter Krankheit', fr: 'maladie soudaine', it: 'malattia improvvisa', es: 'enfermedad repentina', el: 'ξαφνικής ασθένειας' })}" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
      </div>
    `;
  } else if (scenario === 'food') {
    fieldsContainer.innerHTML = `
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[9px] text-gray-400 font-bold block mb-1">${tr({ en: 'Your order', de: 'Deine Bestellung', fr: 'Ta commande', it: 'Il tuo ordine', es: 'Tu pedido', el: 'Η παραγγελία σου' })}</label>
          <input type="text" id="field-food-order" value="${tr({ en: '1x Pizza Margherita and a Soda', de: '1x Pizza Margherita und ein Spezi', fr: '1x Pizza Margherita et une boisson', it: '1x Pizza Margherita e una bibita', es: '1x Pizza Margarita y un refresco', el: '1x Πίτσα Μαργαρίτα και ένα αναψυκτικό' })}" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
        <div>
          <label class="text-[9px] text-gray-400 font-bold block mb-1">${tr({ en: 'Delivery address', de: 'Lieferadresse', fr: 'Adresse de livraison', it: 'Indirizzo di consegna', es: 'Dirección de entrega', el: 'Διεύθυνση παράδοσης' })}</label>
          <input type="text" id="field-food-address" placeholder="${tr({ en: '123 Main Street, Apt 4...', de: 'Musterstraße 1, 2. Stock...', fr: '12 Rue de la Paix...', it: 'Via Roma 10...', es: 'Calle Mayor 1...', el: 'Οδός Ειρήνης 10...' })}" value="${tr({ en: '123 Main Street', de: 'Musterstraße 1', fr: '12 Rue de la Paix', it: 'Via Roma 10', es: 'Calle Mayor 1', el: 'Οδός Ειρήνης 10' })}" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
      </div>
    `;
  } else if (scenario === 'handyman') {
    fieldsContainer.innerHTML = `
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="text-[9px] text-gray-400 font-bold block mb-1">${tr({ en: 'What needs fixing?', de: 'Was ist defekt?', fr: 'Quel est le problème ?', it: 'Cosa è guasto?', es: '¿Qué avería hay?', el: 'Τι έχει χαλάσει;' })}</label>
          <input type="text" id="field-handyman-issue" placeholder="${tr({ en: 'Dripping tap, heater off...', de: 'Tropfender Wasserhahn...', fr: 'Robinet qui fuit...', it: 'Rubinetto che perde...', es: 'Grifo goteando...', el: 'Βρύση που στάζει...' })}" value="${tr({ en: 'Dripping tap in the bathroom', de: 'Tropfender Wasserhahn im Bad', fr: 'Robinet qui fuit dans la salle de bain', it: 'Rubinetto che perde in bagno', es: 'Grifo que gotea en el baño', el: 'Βρύση που στάζει στο μπάνιο' })}" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
        <div>
          <label class="text-[9px] text-gray-400 font-bold block mb-1">${tr({ en: 'Urgency', de: 'Dringlichkeit', fr: 'Urgence', it: 'Urgenza', es: 'Urgencia', el: 'Επείγον' })}</label>
          <input type="text" id="field-handyman-urgency" placeholder="${tr({ en: 'Urgent, this week...', de: 'Dringend, diese Woche...', fr: 'Urgent, cette semaine...', it: 'Urgente, questa settimana...', es: 'Urgente, esta semana...', el: 'Επείγον, αυτή την εβδομάδα...' })}" value="${tr({ en: 'this week', de: 'diese Woche', fr: 'cette semaine', it: 'questa settimana', es: 'esta semana', el: 'αυτή την εβδομάδα' })}" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
        </div>
      </div>
    `;
  } else if (scenario === 'custom') {
    fieldsContainer.innerHTML = `
      <div>
        <label class="text-[9px] text-gray-400 font-bold block mb-1">${tr({ en: 'Your key points / notes', de: 'Eigene Stichpunkte / Anliegen', fr: 'Points clés / Message', it: 'Punti chiave / Note', es: 'Puntos clave / Mensaje', el: 'Βασικά σημεία / Σημειώσεις' })}</label>
        <textarea id="field-custom-text" placeholder="${tr({ en: 'Write down key bullet points...', de: 'Schreibe hier die wichtigsten Punkte auf...', fr: 'Note les points clés ici...', it: 'Scrivi qui i punti principali...', es: 'Apunta los puntos clave aquí...', el: 'Γράψε εδώ τα βασικά σημεία...' })}" class="w-full h-16 p-2 bg-black/60 border border-white/10 rounded text-xs text-white outline-none resize-none">${tr({ en: 'I am calling regarding a question about my order.', de: 'Ich rufe an wegen der Rückfrage zu meiner Bestellung.', fr: 'Je vous appelle au sujet d\'une question sur ma commande.', it: 'Chiamo per avere informazioni sul mio ordine.', es: 'Llamo para consultar una duda sobre mi pedido.', el: 'Καλώ σχετικά με μια ερώτηση για την παραγγελία μου.' })}</textarea>
      </div>
    `;
  }
}

function generateSocialScript() {
  const scenarioSelect = document.getElementById('script-scenario-select');
  const nameInput = document.getElementById('script-user-name');
  const scenario = scenarioSelect ? scenarioSelect.value : 'doctor';
  const userName = nameInput ? (nameInput.value.trim() || "Alex") : "Alex";
  const textContainer = document.getElementById('script-text-container');
  if (!textContainer) return;

  let scriptText = "";

  if (scenario === 'doctor') {
    const specEl = document.getElementById('field-doc-specialty');
    const timeEl = document.getElementById('field-doc-time');
    const spec = specEl ? (specEl.value.trim() || "Doctor") : "Doctor";
    const time = timeEl ? (timeEl.value.trim() || "soon") : "soon";
    
    scriptText = tr({
      en: `“Hello, my name is ${userName}.\nI would like to schedule an appointment with you for ${spec}.\nDo you have any availability for ${time}?\n(Pause for reply)\nMy contact information is ${userName}. Thank you very much.”`,
      de: `„Guten Tag, mein Name ist ${userName}.\nIch würde gerne einen Termin bei Ihnen im Bereich ${spec} vereinbaren.\nHaben Sie freie Termine für ${time}?\n(Warte auf Antwort)\nMeine Daten lauten: ${userName}. Vielen Dank.“`,
      fr: `« Bonjour, je m'appelle ${userName}.\nJe souhaiterais prendre rendez-vous pour ${spec}.\nAuriez-vous des disponibilités pour ${time} ?\n(Attendre la réponse)\nMes coordonnées sont ${userName}. Merci beaucoup. »`,
      it: `“Buongiorno, sono ${userName}.\nVorrei fissare un appuntamento con voi per ${spec}.\nAvete disponibilità per ${time}?\n(Attendi la risposta)\nI miei recapiti sono ${userName}. Grazie mille.”`,
      es: `«Hola, me llamo ${userName}.\nMe gustaría concertar una cita para ${spec}.\n¿Tienen disponibilidad para ${time}?\n(Pausa para escuchar respuesta)\nMis datos son ${userName}. Muchas gracias.»`,
      el: `«Γεια σας, ονομάζομαι ${userName}.\nΘα ήθελα να κλείσω ένα ραντεβού για ${spec}.\nΈχετε διαθεσιμότητα για ${time};\n(Περιμένετε απάντηση)\nΤα στοιχεία μου είναι ${userName}. Σας ευχαριστώ πολύ.»`
    });
  } else if (scenario === 'cancel') {
    const nameEl = document.getElementById('field-cancel-name');
    const reasonEl = document.getElementById('field-cancel-reason');
    const name = nameEl ? (nameEl.value.trim() || "my appointment") : "my appointment";
    const reason = reasonEl ? (reasonEl.value.trim() || "unforeseen circumstances") : "unforeseen circumstances";
    
    scriptText = tr({
      en: `“Hello, my name is ${userName}.\nI am calling because I unfortunately need to cancel ${name}.\nThe reason is due to ${reason}.\nWould it be possible to reschedule for another time?\n(Pause for reply)\nThank you for your understanding.”`,
      de: `„Guten Tag, mein Name ist ${userName}.\nIch rufe an, weil ich leider ${name} absagen muss.\nDer Grund dafür ist eine ${reason}.\nWäre es möglich, den Termin stattdessen zu verschieben?\n(Warte auf Antwort)\nDanke für Ihr Verständnis.“`,
      fr: `« Bonjour, je m'appelle ${userName}.\nJe vous appelle car je dois malheureusement annuler ${name}.\nLa raison est ${reason}.\nSerait-il possible de reporter le rendez-vous à une autre date ?\n(Attendre la réponse)\nMerci de votre compréhension. »`,
      it: `“Buongiorno, sono ${userName}.\nVi chiamo perché purtroppo devo annullare ${name}.\nIl motivo è ${reason}.\nSarebbe possibile riprogrammare per un'altra data?\n(Attendi la risposta)\nGrazie per la comprensione.”`,
      es: `«Hola, me llamo ${userName}.\nLlamo porque lamentablemente tengo que cancelar ${name}.\nEl motivo es por ${reason}.\n¿Sería posible reprogramar la cita para otra fecha?\n(Pausa para escuchar respuesta)\nGracias por su comprensión.»`,
      el: `«Γεια σας, ονομάζομαι ${userName}.\nΚαλώ γιατί δυστυχώς πρέπει να ακυρώσω ${name}.\nΟ λόγος είναι ${reason}.\nΘα ήταν δυνατό να μεταφέρουμε το ραντεβού σε άλλη ημερομηνία;\n(Περιμένετε απάντηση)\nΕυχαριστώ για την κατανόηση.»`
    });
  } else if (scenario === 'food') {
    const orderEl = document.getElementById('field-food-order');
    const addrEl = document.getElementById('field-food-address');
    const order = orderEl ? (orderEl.value.trim() || "food delivery") : "food delivery";
    const addr = addrEl ? (addrEl.value.trim() || "my address") : "my address";
    
    scriptText = tr({
      en: `“Hello, I would like to place a delivery order.\nI'd like: ${order}.\n(Pause for confirmation)\nDelivery address: ${addr}.\nCould you let me know estimated time?\n(Pause for reply)\nAwesome, thank you very much.”`,
      de: `„Hallo, ich würde gerne eine Bestellung zur Lieferung aufgeben.\nUnd zwar: ${order}.\n(Warte auf Bestätigung)\nGeliefert werden soll das an die folgende Adresse: ${addr}.\nKönnen Sie mir sagen, wie lange es ungefähr dauert?\n(Warte auf Antwort)\nSuper, vielen Dank. Auf Wiederhören.“`,
      fr: `« Bonjour, je souhaiterais passer une commande en livraison.\nCe sera : ${order}.\n(Attendre confirmation)\nÀ livrer à l'adresse suivante : ${addr}.\nPouvez-vous me dire combien de temps cela prendra environ ?\n(Attendre la réponse)\nSuper, merci beaucoup. Au revoir. »`,
      it: `“Salve, vorrei fare un ordine a domicilio.\nVorrei: ${order}.\n(Attendi conferma)\nL'indirizzo di consegna è: ${addr}.\nSaprebbe dirmi all'incirca quanto tempo ci vorrà?\n(Attendi risposta)\nPerfetto, grazie mille. Arrivederci.”`,
      es: `«Hola, me gustaría hacer un pedido a domicilio.\nSería: ${order}.\n(Pausa para confirmación)\nLa dirección de entrega es: ${addr}.\n¿Podrían decirme cuánto tardará aproximadamente?\n(Pausa para respuesta)\nGenial, muchas gracias. Adiós.»`,
      el: `«Γεια σας, θα ήθελα να κάνω μια παραγγελία για διανομή.\nΘα ήθελα: ${order}.\n(Περιμένετε επιβεβαίωση)\nΔιεύθυνση παράδοσης: ${addr}.\nΜπορείτε να μου πείτε περίπου πόση ώρα θα χρειαστεί;\n(Περιμένετε απάντηση)\nΤέλεια, ευχαριστώ πολύ. Γεια σας.»`
    });
  } else if (scenario === 'handyman') {
    const issueEl = document.getElementById('field-handyman-issue');
    const urgEl = document.getElementById('field-handyman-urgency');
    const issue = issueEl ? (issueEl.value.trim() || "a maintenance issue") : "a maintenance issue";
    const urgency = urgEl ? (urgEl.value.trim() || "soon") : "soon";
    
    scriptText = tr({
      en: `“Hello, my name is ${userName}.\nThere is a maintenance issue at my apartment: ${issue}.\nCould you send a technician to inspect it?\nIt would be wonderful if this could be scheduled ${urgency}.\n(Pause for reply)\nMy phone number is on file. Thank you very much.”`,
      de: `„Guten Tag, mein Name ist ${userName}.\nIn meiner Wohnung gibt es ein Problem: ${issue}.\nKönnten Sie einen Handwerker schicken, der sich das ansieht?\nEs wäre gut, wenn das ${urgency} klappen könnte.\n(Warte auf Antwort)\nMeine Telefonnummer für Rückfragen ist im System hinterlegt. Vielen Dank.“`,
      fr: `« Bonjour, je m'appelle ${userName}.\nIl y a un problème dans mon logement : ${issue}.\nPourriez-vous envoyer un technicien pour vérifier ?\nCe serait parfait si cela pouvait se faire ${urgency}.\n(Attendre la réponse)\nMes coordonnées sont enregistrées. Merci beaucoup. »`,
      it: `“Buongiorno, sono ${userName}.\nNel mio appartamento c'è un problema: ${issue}.\nPotreste inviare un tecnico a verificare?\nSarebbe ottimo se fosse possibile ${urgency}.\n(Attendi risposta)\nI miei recapiti sono registrati. Grazie mille.”`,
      es: `«Hola, me llamo ${userName}.\nEn mi vivienda hay una avería: ${issue}.\n¿Podrían enviar a un técnico para revisarlo?\nSería estupendo si pudiera ser ${urgency}.\n(Pausa para respuesta)\nMis datos de contacto están en el sistema. Muchas gracias.»`,
      el: `«Γεια σας, ονομάζομαι ${userName}.\nΥπάρχει μια βλάβη στο σπίτι μου: ${issue}.\nΘα μπορούσατε να στείλετε έναν τεχνικό να το ελέγξει;\nΘα ήταν εξαιρετικό αν μπορούσε να γίνει ${urgency}.\n(Περιμένετε απάντηση)\nΤα στοιχεία επικοινωνίας μου είναι καταχωρημένα. Σας ευχαριστώ πολύ.»`
    });
  } else if (scenario === 'custom') {
    const customEl = document.getElementById('field-custom-text');
    const custom = customEl ? (customEl.value.trim() || "") : "";
    
    scriptText = tr({
      en: `“Hello, my name is ${userName}.\n\n[KEY POINTS FOR YOUR CALL]:\n${custom}”`,
      de: `„Guten Tag, mein Name ist ${userName}.\n\n[DEINE STICHPUNKTE FÜR DAS TELEFONAT]:\n${custom}“`,
      fr: `« Bonjour, je m'appelle ${userName}.\n\n[POINTS CLÉS DE VOTRE APPEL] :\n${custom} »`,
      it: `“Buongiorno, sono ${userName}.\n\n[PUNTI CHIAVE PER LA CHIAMATA]:\n${custom}”`,
      es: `«Hola, me llamo ${userName}.\n\n[PUNTOS CLAVE PARA LA LLAMADA]:\n${custom}»`,
      el: `«Γεια σας, ονομάζομαι ${userName}.\n\n[ΒΑΣΙΚΑ ΣΗΜΕΙΑ ΓΙΑ ΤΗ ΣΥΝΟΜΙΛΙΑ ΣΑΣ]:\n${custom}»`
    });
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
    showToast(t('toast_copied'));
  }).catch(err => {
    console.error("Fehler beim Kopieren:", err);
  });
}


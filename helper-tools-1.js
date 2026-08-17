// helper-tools.js Teil 1/3: Entscheidungskompass (Bauchgefuehl, Muenzwurf, Werte-Waage)

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


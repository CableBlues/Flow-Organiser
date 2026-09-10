// app-dice.js: Dezent-elegantes Aufgaben-Glücksspiel (Schicksals-Würfel & Task-Roulette)

let isDiceRolling = false;
let currentDiceColumn = null;
let currentDiceWinner = null;
let diceTickInterval = null;
let currentFortuneMode = 'dice'; // 'dice' | 'roulette'

function getColumnFortuneMode(columnId) {
  const timeBlock = Math.floor(Date.now() / 180000); // Tauscht alle 3 Minuten
  let charSum = 0;
  for (let i = 0; i < (columnId || '').length; i++) {
    charSum += columnId.charCodeAt(i);
  }
  return ((timeBlock + charSum) % 2 === 0) ? 'dice' : 'roulette';
}

function renderColumnFortuneIconHTML(columnId) {
  const mode = getColumnFortuneMode(columnId);
  if (mode === 'dice') {
    return `
      <button onclick="rollTaskDice('${columnId}', event)" aria-label="${typeof tr === 'function' ? tr({ de: 'Aufgabe auswürfeln 🎲', en: 'Roll task 🎲' }) : 'Aufgabe auswürfeln 🎲'}" class="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-400 hover:from-amber-400 hover:to-rose-300 border border-amber-300/60 shadow-[0_0_12px_rgba(245,158,11,0.45)] flex items-center justify-center text-slate-950 cursor-pointer transition-all duration-300 hover:scale-115 active:scale-90 group/fortune shrink-0" title="${typeof tr === 'function' ? tr({ de: 'Aufgabe auswürfeln 🎲 (Klicken zum Starten)', en: 'Roll a task 🎲' }) : 'Aufgabe auswürfeln 🎲'}">
        <svg class="w-3.5 h-3.5 text-slate-950 group-hover/fortune:rotate-12 transition-transform shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" fill-opacity="0.2" stroke="currentColor" />
          <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </button>
    `;
  } else {
    return `
      <button onclick="rollTaskRoulette('${columnId}', event)" aria-label="${typeof tr === 'function' ? tr({ de: 'Aufgaben-Roulette drehen 🎡', en: 'Spin task roulette 🎡' }) : 'Aufgaben-Roulette drehen 🎡'}" class="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-500 via-cyan-500 to-purple-500 hover:from-emerald-400 hover:to-purple-400 border border-cyan-300/60 shadow-[0_0_12px_rgba(6,182,212,0.45)] flex items-center justify-center text-slate-950 cursor-pointer transition-all duration-300 hover:scale-115 active:scale-90 group/fortune shrink-0" title="${typeof tr === 'function' ? tr({ de: 'Aufgaben-Roulette drehen 🎡 (Klicken zum Starten)', en: 'Spin task roulette 🎡' }) : 'Aufgaben-Roulette drehen 🎡'}">
        <svg class="w-3.5 h-3.5 text-slate-950 group-hover/fortune:rotate-45 transition-transform shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9" stroke="currentColor" fill="currentColor" fill-opacity="0.15" />
          <path d="M12 3v18" stroke="currentColor" />
          <path d="M3 12h18" stroke="currentColor" />
          <path d="M5.6 5.6l12.8 12.8" stroke="currentColor" />
          <path d="M18.4 5.6L5.6 18.4" stroke="currentColor" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      </button>
    `;
  }
}

function rollTaskDice(columnId, event) {
  startFortuneRoll(columnId, event, 'dice');
}

function rollTaskRoulette(columnId, event) {
  startFortuneRoll(columnId, event, 'roulette');
}

function startFortuneRoll(columnId, event, mode = 'dice') {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  if (isDiceRolling) return;

  currentDiceColumn = columnId;
  currentFortuneMode = mode;
  const rawItems = (typeof getCurrentWorkspaceItems === 'function' ? getCurrentWorkspaceItems() : state?.items)?.[columnId] || [];
  const tasks = rawItems
    .map((item, idx) => {
      const text = typeof item === 'object' ? item.task : item;
      return text ? { index: idx, text: String(text).trim(), category: columnId } : null;
    })
    .filter(Boolean);

  if (tasks.length === 0) {
    const emptyMsg = {
      de: 'Keine Aufgaben in dieser Liste zum Auslosen 🎯',
      en: 'No tasks in this list to choose from 🎯',
      es: 'No hay tareas en esta lista 🎯',
      fr: 'Aucune tâche dans cette liste 🎯',
      it: 'Nessuna attività in questa lista 🎯',
      el: 'Δεν υπάρχουν εργασίες σε αυτήν τη λίστα 🎯'
    }[currentLang] || 'No tasks in this list 🎯';
    showToast(emptyMsg);
    return;
  }

  ensureDiceModalExists();
  const modal = document.getElementById('task-dice-modal');
  if (!modal) return;

  modal.classList.remove('hidden');
  isDiceRolling = true;

  // Header-Titel anpassen je nach Modus
  const catName = typeof t === 'function' ? t(columnId) : columnId.toUpperCase();
  const catBadge = document.getElementById('dice-modal-category-badge');
  if (catBadge) catBadge.innerText = catName;

  const modeTitle = document.getElementById('dice-modal-title-text');
  const modeSubtitle = document.getElementById('dice-modal-subtitle-text');
  const visualIcon = document.getElementById('dice-3d-visual');

  if (mode === 'roulette') {
    if (modeTitle) modeTitle.innerText = typeof tr === 'function' ? tr({ de: 'Aufgaben-Roulette', en: 'Task Roulette' }) : 'Aufgaben-Roulette';
    if (modeSubtitle) modeSubtitle.innerText = typeof tr === 'function' ? tr({ de: 'Das Glücksrad ermittelt deine nächste Aufgabe', en: 'The wheel picks your next focus task' }) : 'Das Glücksrad ermittelt deine nächste Aufgabe';
    if (visualIcon) {
      visualIcon.className = 'w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 border-2 border-cyan-200/60 flex items-center justify-center text-slate-950 font-black shadow-[0_0_25px_rgba(6,182,212,0.45)] transition-all duration-300 shrink-0';
      visualIcon.innerHTML = `
        <svg class="w-7 h-7 text-slate-950 animate-spin [animation-duration:1.5s]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9" stroke="currentColor" fill="currentColor" fill-opacity="0.15" />
          <path d="M12 3v18" stroke="currentColor" />
          <path d="M3 12h18" stroke="currentColor" />
          <path d="M5.6 5.6l12.8 12.8" stroke="currentColor" />
          <path d="M18.4 5.6L5.6 18.4" stroke="currentColor" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      `;
    }
  } else {
    if (modeTitle) modeTitle.innerText = typeof tr === 'function' ? tr({ de: 'Schicksals-Würfel', en: 'Fortune Dice' }) : 'Schicksals-Würfel';
    if (modeSubtitle) modeSubtitle.innerText = typeof tr === 'function' ? tr({ de: 'Der 3D-Zufall entscheidet deinen nächsten Schritt', en: 'Pure randomness picks your next step' }) : 'Der 3D-Zufall entscheidet deinen nächsten Schritt';
    if (visualIcon) {
      visualIcon.className = 'w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-400 to-amber-300 border-2 border-amber-200/60 flex items-center justify-center text-slate-950 font-black shadow-[0_0_25px_rgba(245,158,11,0.45)] transition-all duration-300 shrink-0';
      visualIcon.innerHTML = `
        <svg class="w-7 h-7 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" fill-opacity="0.1" stroke="currentColor" />
          <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      `;
    }
  }

  const resultArea = document.getElementById('dice-result-container');
  const actionArea = document.getElementById('dice-actions-container');
  const rouletteViewport = document.getElementById('dice-roulette-viewport');
  const reel = document.getElementById('dice-roulette-reel');

  if (resultArea) resultArea.classList.add('hidden');
  if (actionArea) actionArea.classList.add('hidden');
  if (rouletteViewport) rouletteViewport.classList.remove('hidden');

  // Wähle einen zufälligen Gewinner
  const winnerIndex = Math.floor(Math.random() * tasks.length);
  currentDiceWinner = tasks[winnerIndex];

  // Baue ein langes, scrollendes Band auf (Reel mit 4-8 Zyklen)
  const cycleCount = Math.max(5, Math.ceil(24 / tasks.length));
  let reelItemsHTML = '';
  const totalItems = [];

  for (let c = 0; c < cycleCount; c++) {
    tasks.forEach(taskObj => {
      totalItems.push(taskObj);
    });
  }
  // Am Ende landet das Rad auf dem Gewinner
  const targetReelIndex = (cycleCount - 2) * tasks.length + winnerIndex;

  totalItems.forEach((item, idx) => {
    const isTarget = idx === targetReelIndex;
    const itemColorClass = mode === 'roulette' 
      ? (idx % 2 === 0 ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-purple-500/10 border-purple-500/20')
      : 'bg-white/[0.04] border-white/10';
    const dotColorClass = mode === 'roulette'
      ? (idx % 2 === 0 ? 'bg-cyan-400' : 'bg-fuchsia-400')
      : 'bg-amber-400/80';

    reelItemsHTML += `
      <div class="dice-reel-item h-[68px] flex items-center justify-center px-4 py-2 my-1.5 rounded-2xl ${itemColorClass} border transition-all duration-300 select-none ${isTarget ? 'target-winner' : ''}">
        <div class="flex items-center gap-2.5 max-w-full truncate">
          <span class="w-2.5 h-2.5 rounded-full ${dotColorClass} shrink-0 shadow-xs"></span>
          <span class="text-sm font-semibold text-gray-100 truncate font-display">${escapeHtml(item.text)}</span>
        </div>
      </div>
    `;
  });

  if (reel) {
    reel.style.transition = 'none';
    reel.style.transform = 'translateY(0px)';
    reel.innerHTML = reelItemsHTML;
  }

  // Taktiles Klick-Geräusch starten
  playDiceSpinAudio();

  // Starte das sanfte, filmreife Ausrollen (Deceleration über 3.2s)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (!reel) return;
      const itemHeight = 68 + 12; // Höhe + Margin
      const finalTranslateY = -(targetReelIndex * itemHeight) + (itemHeight * 1); // Zentriert im Slot-Fenster

      reel.style.transition = 'transform 3.4s cubic-bezier(0.12, 0.85, 0.28, 1)';
      reel.style.transform = `translateY(${finalTranslateY}px)`;

      // Nach Abschluss der Drehung Gewinner präsentieren
      setTimeout(() => {
        finishDiceRoll(currentDiceWinner);
      }, 3450);
    });
  });
}

function playDiceSpinAudio() {
  let tickCount = 0;
  const maxTicks = 18;
  
  function nextTick() {
    if (!isDiceRolling || tickCount >= maxTicks) return;
    if (typeof playTactileClickSound === 'function') {
      try { playTactileClickSound(); } catch (e) { console.warn('[Dice] playTactileClickSound warning:', e); }
    }
    tickCount++;
    const nextDelay = 70 + Math.pow(tickCount / maxTicks, 2) * 260;
    diceTickInterval = setTimeout(nextTick, nextDelay);
  }
  nextTick();
}

function finishDiceRoll(winnerTask) {
  isDiceRolling = false;
  if (diceTickInterval) clearTimeout(diceTickInterval);

  const visualIcon = document.getElementById('dice-3d-visual');
  if (visualIcon) {
    visualIcon.classList.remove('dice-spinning-fast');
    visualIcon.classList.add('dice-winner-pulse');
  }

  // Erfolgs-Sound & visuelle Partikel
  if (typeof playProceduralSound === 'function') {
    try { playProceduralSound(0); } catch (e) { console.warn('[Dice] playProceduralSound warning:', e); }
  } else if (typeof playRhodesChime === 'function') {
    try { playRhodesChime(); } catch (e) { console.warn('[Dice] playRhodesChime warning:', e); }
  }

  const resultArea = document.getElementById('dice-result-container');
  const actionArea = document.getElementById('dice-actions-container');
  const resultText = document.getElementById('dice-winner-task-text');

  if (resultText && winnerTask) {
    resultText.innerText = winnerTask.text;
  }
  if (resultArea) {
    resultArea.classList.remove('hidden');
    resultArea.classList.add('animate-scale-up');
  }
  if (actionArea) {
    actionArea.classList.remove('hidden');
    actionArea.classList.add('animate-fade-in');
  }
  if (typeof renderLucideIcons === 'function') renderLucideIcons();
}

function startDiceWinnerTimer() {
  if (!currentDiceWinner) return;
  const taskText = currentDiceWinner.text;
  const cat = currentDiceWinner.category;

  closeDiceModal();

  if (typeof startZenWithTask === 'function') {
    startZenWithTask(taskText, cat);
  } else {
    activeTimerTask = taskText;
    if (typeof updateActiveTimerLabels === 'function') updateActiveTimerLabels();
    if (typeof startTimer === 'function') startTimer();
    showToast(tr({
      de: `Timer gestartet für: "${taskText}" ⚡`,
      en: `Timer started for: "${taskText}" ⚡`,
      es: `Temporizador iniciado para: "${taskText}" ⚡`,
      fr: `Minuteur démarré pour : "${taskText}" ⚡`,
      it: `Timer avviato per: "${taskText}" ⚡`,
      el: `Το χρονόμετρο ξεκίνησε για: "${taskText}" ⚡`
    }));
  }
}

function completeDiceWinnerTask() {
  if (!currentDiceWinner) return;
  const cat = currentDiceWinner.category;
  const idx = currentDiceWinner.index;

  if (typeof handleCompleteTask === 'function') {
    handleCompleteTask(cat, idx);
  }
  closeDiceModal();
  if (typeof renderApp === 'function') renderApp();
  showToast(tr({
    de: 'Aufgabe erfolgreich erledigt! 🎉',
    en: 'Task completed successfully! 🎉',
    es: '¡Tarea completada con éxito! 🎉',
    fr: 'Tâche terminée avec succès ! 🎉',
    it: 'Attività completata con successo! 🎉',
    el: 'Η εργασία ολοκληρώθηκε με επιτυχία! 🎉'
  }));
}

function closeDiceModal() {
  if (diceTickInterval) clearTimeout(diceTickInterval);
  isDiceRolling = false;
  const modal = document.getElementById('task-dice-modal');
  if (modal) modal.classList.add('hidden');
}

function ensureDiceModalExists() {
  if (document.getElementById('task-dice-modal')) return;

  const modalHtml = `
    <div id="task-dice-modal" class="hidden fixed inset-0 z-[120000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div class="w-full max-w-md bg-[#111118]/98 border border-amber-500/30 rounded-3xl p-5 md:p-6 shadow-2xl backdrop-blur-2xl flex flex-col items-center gap-4 text-center relative overflow-hidden">
        
        <!-- Ambient Glow FX -->
        <div class="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-amber-500/15 blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-purple-500/15 blur-3xl pointer-events-none"></div>

        <!-- Schließen Button -->
        <button onclick="closeDiceModal()" aria-label="Fenster schließen" class="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg transition cursor-pointer text-lg font-bold">✕</button>

        <!-- Top Header & Visual Badge -->
        <div class="flex flex-col items-center gap-2 pt-1">
          <div class="flex items-center gap-3">
            <div id="dice-3d-visual" class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-400 to-amber-300 border-2 border-amber-200/60 flex items-center justify-center text-slate-950 font-black shadow-[0_0_25px_rgba(245,158,11,0.45)] transition-all duration-300 shrink-0">
              <svg class="w-7 h-7 text-slate-950 overflow-visible" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" fill-opacity="0.1" stroke="currentColor" />
                <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <div class="text-left">
              <h3 class="text-base font-bold font-display text-white flex items-center gap-1.5">
                <span id="dice-modal-title-text" data-i18n="dice_title">Schicksals-Würfel</span>
                <span id="dice-modal-category-badge" class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold tracking-wider uppercase">HEUTE</span>
              </h3>
              <p id="dice-modal-subtitle-text" class="text-[11px] text-gray-400" data-i18n="dice_subtitle">Der Zufall entscheidet deinen nächsten Fokus-Schritt</p>
            </div>
          </div>
        </div>

        <!-- Slot-Machine Roulette Viewport -->
        <div id="dice-roulette-viewport" class="w-full relative h-[180px] overflow-hidden rounded-2xl bg-black/40 border border-white/10 shadow-inner">
          <!-- Top & Bottom Glass Fade Masks -->
          <div class="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#111118] via-[#111118]/80 to-transparent z-10 pointer-events-none"></div>
          <div class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#111118] via-[#111118]/80 to-transparent z-10 pointer-events-none"></div>
          
          <!-- Center Winner Indicator Line -->
          <div class="absolute top-1/2 left-2 right-2 -translate-y-1/2 h-[72px] rounded-2xl border-2 border-amber-400/70 bg-amber-500/10 shadow-[0_0_20px_rgba(251,191,36,0.25)] pointer-events-none z-10"></div>

          <!-- Rolling Reel List -->
          <div id="dice-roulette-reel" class="flex flex-col px-3 py-10 will-change-transform"></div>
        </div>

        <!-- Winner Card Container (wird nach Stopp eingeblendet) -->
        <div id="dice-result-container" class="hidden w-full p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-purple-500/10 to-transparent border border-amber-400/40 shadow-lg">
          <div class="text-[10px] text-amber-300 font-bold uppercase tracking-widest font-mono mb-1">🎯 Dein nächster Schritt:</div>
          <div id="dice-winner-task-text" class="text-lg md:text-xl font-bold font-display text-white break-words py-1 leading-snug">...</div>
        </div>

        <!-- Action Controls -->
        <div id="dice-actions-container" class="hidden w-full flex flex-col gap-2 pt-1">
          <button onclick="startDiceWinnerTimer()" class="w-full py-3 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-98">
            <i data-lucide="play" class="w-4 h-4 text-emerald-300"></i>
            <span data-i18n="dice_start_focus">Jetzt anpacken (Fokus-Timer) ⚡</span>
          </button>

          <div class="grid grid-cols-2 gap-2">
            <button onclick="startFortuneRoll(currentDiceColumn, event, currentFortuneMode)" class="py-2.5 px-3 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer">
              <i data-lucide="rotate-cw" class="w-3.5 h-3.5"></i>
              <span data-i18n="dice_reroll">Nochmal drehen 🎲</span>
            </button>
            <button onclick="completeDiceWinnerTask()" class="py-2.5 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer">
              <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
              <span data-i18n="dice_complete">Erledigt abhaken ✓</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  if (typeof renderLucideIcons === 'function') renderLucideIcons();
}

// Periodischer Tausch-Check (alle 3 Minuten) für frischen Würfel/Roulette Wechsel
if (typeof window !== 'undefined') {
  setInterval(() => {
    if (typeof renderApp === 'function' && !isDiceRolling) {
      renderApp();
    }
  }, 180000);
}

if (typeof window !== 'undefined') {
  window.getColumnFortuneMode = getColumnFortuneMode;
  window.renderColumnFortuneIconHTML = renderColumnFortuneIconHTML;
  window.rollTaskDice = rollTaskDice;
  window.rollTaskRoulette = rollTaskRoulette;
  window.startFortuneRoll = startFortuneRoll;
  window.closeDiceModal = closeDiceModal;
  window.startDiceWinnerTimer = startDiceWinnerTimer;
  window.completeDiceWinnerTask = completeDiceWinnerTask;
}

if (typeof globalThis !== 'undefined') {
  globalThis.getColumnFortuneMode = getColumnFortuneMode;
  globalThis.renderColumnFortuneIconHTML = renderColumnFortuneIconHTML;
  globalThis.rollTaskDice = rollTaskDice;
  globalThis.rollTaskRoulette = rollTaskRoulette;
  globalThis.startFortuneRoll = startFortuneRoll;
  globalThis.closeDiceModal = closeDiceModal;
  globalThis.startDiceWinnerTimer = startDiceWinnerTimer;
  globalThis.completeDiceWinnerTask = completeDiceWinnerTask;
}

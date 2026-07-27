let timerSeconds = 25 * 60;
let timerInitialSeconds = 25 * 60;
let timerRunning = false;
let timerInterval = null;
let activeTimerTask = null;

// Warmherzige Pausen-Empfehlungen für ADHD (Ablenkung & Bewegung)
const BREAK_TIPS_DE = [
  "Mache 5 Kniebeugen oder strecke deinen Körper einmal kräftig durch!",
  "Trinke ein großes Glas frisches, kaltes Wasser!",
  "Blicke für 1 Minute aus dem Fenster in die Ferne, um deine Augen zu entspannen!",
  "Schüttle deine Arme und Beine für 15 Sekunden kräftig aus (Dopamin-Reset)!",
  "Atme 5-mal ganz tief durch die Nase ein und langsam durch den Mund wieder aus!"
];

const BREAK_TIPS_EN = [
  "Do 5 squats or stretch your body vigorously!",
  "Drink a large glass of fresh, cold water!",
  "Look out the window into the distance for 1 minute to relax your eyes!",
  "Shake out your arms and legs for 15 seconds (dopamine reset)!",
  "Take 5 deep breaths in through your nose and slowly out through your mouth!"
];

function startTaskTimer(taskName, event) {
  if (event) event.stopPropagation(); if (!taskName) return;
  activeTimerTask = taskName; 
  timerSeconds = 25 * 60;
  timerInitialSeconds = 25 * 60;
  if (!timerRunning) toggleTimer(); else updateTimerDisplay();
  updateActiveTimerBadge(); renderApp(); showToast(`⏱️ ${t('timer_title')}: "${taskName}"`);
}

function updateActiveTimerBadge() {
  const badge = document.getElementById('active-timer-badge');
  if (badge) {
    if (activeTimerTask && timerRunning) {
      badge.classList.remove('hidden'); badge.innerText = `🎯 ${activeTimerTask}`; badge.title = `Fokus: ${activeTimerTask}`;
    } else if (activeTimerTask) {
      badge.classList.remove('hidden'); badge.innerText = `⏸️ ${activeTimerTask}`;
    } else { badge.classList.add('hidden'); }
  }
}

function setTimerPreset(mins) {
  clearInterval(timerInterval); timerRunning = false; 
  timerSeconds = mins * 60;
  timerInitialSeconds = mins * 60;
  const btnHeader = document.getElementById('timer-toggle-btn');
  const zenLabel = document.getElementById('zen-timer-btn-label');
  const presetSel = document.getElementById('timer-preset-select');
  if (presetSel) presetSel.value = String(mins);
  if (btnHeader) {
    btnHeader.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>'; lucide.createIcons();
  }
  if (zenLabel) zenLabel.innerText = t('start');
  updateTimerDisplay(); updateActiveTimerBadge(); renderApp(); showToast(`⏱️ ${mins}m`);
}

function toggleTimer() {
  const btnHeader = document.getElementById('timer-toggle-btn');
  const zenLabel = document.getElementById('zen-timer-btn-label');
  const labelPause = { de: 'Pause', en: 'Pause', es: 'Pausa', el: 'Παύση' }[currentLang] || 'Pause';
  if (timerRunning) {
    clearInterval(timerInterval); timerRunning = false;
    if (btnHeader) {
      btnHeader.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>'; lucide.createIcons();
    }
    if (zenLabel) zenLabel.innerText = t('start');
    updateActiveTimerBadge(); renderApp();
  } else {
    timerRunning = true;
    if (btnHeader) {
      btnHeader.innerHTML = '<i data-lucide="pause" class="w-3.5 h-3.5 text-amber-400 animate-pulse"></i>'; lucide.createIcons();
    }
    if (zenLabel) zenLabel.innerText = labelPause;
    updateActiveTimerBadge(); renderApp();
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--; updateTimerDisplay();
      } else {
        clearInterval(timerInterval); timerRunning = false; playProceduralSound();
        
        // Zufälligen Pausen-Tipp auswählen
        const tips = currentLang === 'de' ? BREAK_TIPS_DE : BREAK_TIPS_EN;
        const tip = tips[Math.floor(Math.random() * tips.length)];
        
        // Dialogfenster (sorgt dafür, dass der Browser sich meldet, selbst wenn der Tab im Hintergrund ist)
        const breakTitle = currentLang === 'de' ? 'Fokus-Zeit abgelaufen! ☕' : 'Focus session finished! ☕';
        const breakTipLabel = currentLang === 'de' ? 'Empfehlung für deine Pause' : 'Break recommendation';
        alert(`🎉 ${breakTitle}\n\n${breakTipLabel}:\n👉 ${tip}`);
        
        if (btnHeader) {
          btnHeader.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>'; lucide.createIcons();
        }
        if (zenLabel) zenLabel.innerText = t('start');
        updateActiveTimerBadge(); renderApp();
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval); timerRunning = false; 
  timerSeconds = 25 * 60; 
  timerInitialSeconds = 25 * 60; 
  activeTimerTask = null;
  const btnHeader = document.getElementById('timer-toggle-btn');
  const zenLabel = document.getElementById('zen-timer-btn-label');
  if (btnHeader) {
    btnHeader.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>'; lucide.createIcons();
  }
  if (zenLabel) zenLabel.innerText = t('start');
  updateTimerDisplay(); updateActiveTimerBadge(); renderApp();
}

function updateTimerDisplay() {
  const mins = Math.floor(timerSeconds / 60); const secs = timerSeconds % 60;
  const str = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const headerDisp = document.getElementById('timer-display'); if (headerDisp) headerDisp.innerText = str;
  const zenDisp = document.getElementById('zen-timer-display'); if (zenDisp) zenDisp.innerText = str;
  
  // Statusbalken-Fortschritt im Header aktualisieren
  const progressBar = document.getElementById('timer-progress-bar');
  if (progressBar) {
    const pct = (timerSeconds / timerInitialSeconds) * 100;
    progressBar.style.width = `${pct}%`;
  }
}
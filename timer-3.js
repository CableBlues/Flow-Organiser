// timer.js Teil 3/3: Timer-Start/Stop/Pause & UI-Updates

function startTaskTimer(taskName, event) {
  if (event) event.stopPropagation();
  if (!taskName) return;
  activeTimerTask = taskName; 
  
  const mins = getCurrentPresetMinutes();
  timerSeconds = mins * 60;
  timerInitialSeconds = mins * 60;
  
  updateActiveTimerLabels();
  startTimer();
  updateTimerDisplay();
  updateTimerUI();
  showToast(`⏱️ Task Focus: "${taskName}" (${mins}m)`);
}

function updateActiveTimerLabels() {
  const text = activeTimerTask || "";
  const pickLabel = document.getElementById('helper-pick-timer-task');
  if (pickLabel) pickLabel.innerText = text;
  const stepsLabel = document.getElementById('helper-steps-timer-task');
  if (stepsLabel) stepsLabel.innerText = text;
}

function updateActiveTimerBadge() {
  const badge = document.getElementById('active-timer-badge');
  if (badge) {
    if (activeTimerTask && timerRunning) {
      badge.classList.remove('hidden');
      badge.innerText = `🎯 ${activeTimerTask}`;
      badge.title = `Fokus: ${activeTimerTask}`;
    } else if (activeTimerTask) {
      badge.classList.remove('hidden');
      badge.innerText = `⏸️ ${activeTimerTask}`;
    } else {
      badge.classList.add('hidden');
    }
  }
}

function setTimerPreset(mins) {
  clearInterval(timerInterval);
  timerRunning = false; 
  timerSeconds = mins * 60;
  timerInitialSeconds = mins * 60;
  
  const dropdowns = ['timer-preset-select-real', 'helper-pick-timer-preset-select-real', 'helper-steps-timer-preset-select-real'];
  dropdowns.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = String(mins);
  });
  
  updateTimerDisplay();
  updateTimerUI();
  if (typeof renderApp === 'function') renderApp();
  showToast(`⏱️ ${mins}m`);
}

function startTimer() {
  if (timerRunning) return;
  
  const isFreshStart = timerSeconds <= 0 || timerSeconds === timerInitialSeconds;
  
  if (timerSeconds <= 0) {
    const mins = getCurrentPresetMinutes();
    timerSeconds = mins * 60;
    timerInitialSeconds = mins * 60;
    updateTimerDisplay();
  }
  
  timerRunning = true;
  updateTimerUI();
  updateMuteButtonsUI();
  
  playRandomTimerAmbient();

  // Zeitansage zu Beginn einer frischen Sitzung (nicht beim Fortsetzen nach Pause), je nach Sound-Einstellung
  if (isFreshStart && timerSoundEnabled) {
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'de';
    const startMins = Math.round(timerInitialSeconds / 60);
    const phraseList = SESSION_START_PHRASES[lang] || SESSION_START_PHRASES.de;
    const phrase = pickWithoutImmediateRepeat(phraseList, lastSessionStartPhrase);
    lastSessionStartPhrase = phrase;
    const startText = phrase.replace('{mins}', startMins);
    setTimeout(() => speakSoftlyDynamic(startText, timerSeconds, timerInitialSeconds), 400);
  }
  
  timerInterval = setInterval(() => {
    timerSeconds--;
    
    if (timerSeconds === 0) {
      if (typeof playProceduralSound === 'function') playProceduralSound();
      
      startPleasantRinging();
      
      if (typeof fadeOutAmbientSound === 'function') {
        fadeOutAmbientSound(5.0);
      }
    }
    
    // Countdown-Phase: bei jeder vollen Minute abwechselnd sprechen oder einen sanften Glockenton spielen
    if (timerSeconds > 0 && timerSeconds % 60 === 0 && timerSeconds !== timerInitialSeconds) {
      const minsLeft = timerSeconds / 60;
      const shouldSpeak = (minsLeft % 2 === 1); // jede zweite Minute wird gesprochen

      if (shouldSpeak) {
        let speechText = "";
        const lang = typeof currentLang !== 'undefined' ? currentLang : 'de';
        
        if (minsLeft === 1) {
          if (lang === 'de') speechText = "Noch eine Minute";
          else if (lang === 'es') speechText = "Queda un minuto";
          else if (lang === 'el') speechText = "Απομένει ένα λεπτό";
          else if (lang === 'fr') speechText = "Il reste une minute";
          else if (lang === 'it') speechText = "Resta un minuto";
          else speechText = "One minute remaining";
        } else {
          if (lang === 'de') speechText = `Noch ${minsLeft} Minuten`;
          else if (lang === 'es') speechText = `Quedan ${minsLeft} minutos`;
          else if (lang === 'el') speechText = `Απομένουν ${minsLeft} λεπτά`;
          else if (lang === 'fr') speechText = `Il reste ${minsLeft} minutes`;
          else if (lang === 'it') speechText = `Restano ${minsLeft} minuti`;
          else speechText = `${minsLeft} minutes remaining`;
        }
        
        if (Math.random() < 0.55) {
          const motiv = getContextMotivation(timerSeconds, timerInitialSeconds);
          speechText += `. ${motiv}`;
        }
        
        speakSoftlyDynamic(speechText, timerSeconds, timerInitialSeconds);
      } else {
        playMinuteChime();
      }
      
      playRandomTimerAmbient(true);
    }

    // Überzeit-Phase: jede volle Minute über die eingestellte Zeit hinaus wird zuverlässig angesagt
    if (timerSeconds < 0 && timerSeconds % 60 === 0) {
      const lang = typeof currentLang !== 'undefined' ? currentLang : 'de';
      const overdueMins = Math.abs(timerSeconds) / 60;
      const labelFn = OVERDUE_MINUTE_LABELS[lang] || OVERDUE_MINUTE_LABELS.de;
      let speechText = labelFn(overdueMins);
      const overdueList = (MOTIVATIONAL_CHUNKS[lang] || MOTIVATIONAL_CHUNKS.de).overdue;
      const motiv = pickWithoutImmediateRepeat(overdueList, lastMotivationByTier['overdue']);
      lastMotivationByTier['overdue'] = motiv;
      speechText += `. ${motiv}`;
      speakSoftlyDynamic(speechText, timerSeconds, timerInitialSeconds);
    }
    
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerRunning = false;
  updateTimerUI();
  
  if (typeof fadeOutAmbientSound === 'function') {
    fadeOutAmbientSound(2.0);
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerSeconds = timerInitialSeconds; 
  activeTimerTask = null;
  
  stopPleasantRinging();
  updateActiveTimerLabels();
  updateTimerDisplay();
  updateTimerUI();
  if (typeof renderApp === 'function') renderApp();
  
  if (typeof fadeOutAmbientSound === 'function') {
    fadeOutAmbientSound(1.5);
  }
}

function toggleTimer() {
  if (timerRunning) pauseTimer();
  else startTimer();
}

function resetTimer() {
  stopTimer();
}

function updateTimerUI() {
  const playBtns = ['timer-play-btn', 'helper-pick-timer-play-btn', 'helper-steps-timer-play'];
  const pauseBtns = ['timer-pause-btn', 'helper-pick-timer-pause-btn', 'helper-steps-timer-pause'];
  const muteBtns = ['timer-mute-btn', 'helper-pick-timer-mute-btn', 'helper-steps-timer-mute'];
  
  playBtns.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (timerRunning) el.classList.add('hidden');
      else el.classList.remove('hidden');
    }
  });
  
  pauseBtns.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (timerRunning) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  });
  
  // Zeige die Lautstärketasten (Sound-Buttons) NUR dann, wenn der Timer aktiv läuft
  muteBtns.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (timerRunning) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  });
  
  // Steuerung des gemeinsamen Start/Pause-Buttons in der Zen-Ansicht
  const zenPlayPauseBtn = document.querySelector('#zen-chill-view button[onclick="toggleTimer()"]');
  if (zenPlayPauseBtn) {
    if (timerRunning) {
      zenPlayPauseBtn.innerHTML = '<i data-lucide="pause" class="w-4 h-4 text-[var(--accent-light)] animate-pulse"></i>';
    } else {
      zenPlayPauseBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4 text-emerald-400"></i>';
    }
  }

  updateActiveTimerBadge();
  updateMuteButtonsUI();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function updateTimerDisplay() {
  const isNegative = timerSeconds < 0;
  const absoluteSeconds = Math.abs(timerSeconds);
  const mins = Math.floor(absoluteSeconds / 60);
  const secs = absoluteSeconds % 60;
  
  const sign = isNegative ? '-' : '';
  const str = `${sign}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  
  // Überzeit wird nicht nur im Modal, sondern überall wo der Timer sichtbar ist, klar farblich hervorgehoben
  const displays = ['timer-display', 'helper-pick-timer-display', 'helper-steps-timer-display', 'zen-timer-display'];
  displays.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.innerText = str;
      el.classList.toggle('text-rose-400', isNegative);
      el.classList.toggle('animate-pulse', isNegative);
    }
  });
  
  const pct = timerInitialSeconds > 0 ? Math.max(0, (timerSeconds / timerInitialSeconds) * 100) : 100;
  const progressBars = ['timer-progress-bar', 'helper-pick-timer-progress-bar', 'helper-steps-timer-progress-bar'];
  progressBars.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.width = `${pct}%`;
      el.classList.toggle('bg-rose-500', isNegative);
    }
  });

  const countEl = document.getElementById('ringing-live-counter');
  if (countEl && isNegative) {
    countEl.innerText = str;
  }
} 
 
 

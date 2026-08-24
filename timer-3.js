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

      if (timerSoundEnabled) {
        const lang = typeof currentLang !== 'undefined' ? currentLang : 'de';
        const timeUp = (typeof TIME_UP_PHRASES !== 'undefined' && TIME_UP_PHRASES[lang]) 
          ? TIME_UP_PHRASES[lang] 
          : "Die Zeit ist abgelaufen!";
        setTimeout(() => speakSoftlyDynamic(timeUp, 0, timerInitialSeconds), 800);
      }
    }
    
    // Countdown-Phase (positive Restzeit)
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

    // Überzeit-Phase (negative Zeit läuft weiter & erinnert den Nutzer regelmäßig)
    if (timerSeconds < 0) {
      const absSec = Math.abs(timerSeconds);
      const lang = typeof currentLang !== 'undefined' ? currentLang : 'de';

      // Erste Ansage nach 30 Sekunden Überzeit
      if (absSec === 30) {
        const text30 = (typeof OVERDUE_30S_LABELS !== 'undefined' && OVERDUE_30S_LABELS[lang]) 
          ? OVERDUE_30S_LABELS[lang] 
          : "30 Sekunden über der Zeit.";
        speakSoftlyDynamic(text30, timerSeconds, timerInitialSeconds);
      }
      // Jede volle Minute Überzeit (-60s, -120s, -180s...)
      else if (absSec % 60 === 0) {
        const overdueMins = absSec / 60;
        const labelFn = (typeof OVERDUE_MINUTE_LABELS !== 'undefined' && OVERDUE_MINUTE_LABELS[lang]) 
          ? OVERDUE_MINUTE_LABELS[lang] 
          : ((n) => `${n} Minuten überzogen`);
        let speechText = labelFn(overdueMins);
        const overdueList = (typeof MOTIVATIONAL_CHUNKS !== 'undefined' && (MOTIVATIONAL_CHUNKS[lang] || MOTIVATIONAL_CHUNKS.de)) 
          ? (MOTIVATIONAL_CHUNKS[lang] || MOTIVATIONAL_CHUNKS.de).overdue 
          : [];
        if (overdueList && overdueList.length > 0) {
          const motiv = pickWithoutImmediateRepeat(overdueList, lastMotivationByTier['overdue']);
          lastMotivationByTier['overdue'] = motiv;
          if (motiv) speechText += `. ${motiv}`;
        }
        speakSoftlyDynamic(speechText, timerSeconds, timerInitialSeconds);
      }
      // Zwischen-Signalton alle 30s bei halben Minuten (-90s, -150s, -210s...)
      else if (absSec % 30 === 0) {
        playMinuteChime();
      }
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
  timerInterval = null;
  timerRunning = false;
  timerSeconds = timerInitialSeconds; 
  activeTimerTask = null;
  
  // Nur Modal + Alarm-Sound stoppen – KEIN stopPleasantRinging() (würde Endlosschleife auslösen)
  if (typeof dismissRingingModalOnly === 'function') dismissRingingModalOnly();
  document.title = 'Flow - Dein Alltagsbegleiter';
  
  updateActiveTimerLabels();
  updateTimerDisplay();
  updateTimerUI();
  if (typeof renderApp === 'function') renderApp();
  
  if (typeof fadeOutAmbientSound === 'function') {
    fadeOutAmbientSound(1.5);
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
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
  
  muteBtns.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (timerRunning) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  });
  
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
  
  // Überzeit in allen Displays farblich und animiert hervorheben
  const displays = ['timer-display', 'helper-pick-timer-display', 'helper-steps-timer-display', 'zen-timer-display'];
  displays.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.innerText = str;
      el.classList.toggle('text-rose-400', isNegative);
      el.classList.toggle('animate-pulse', isNegative);
    }
  });
  
  // Browser-Tab-Titel bei laufendem Timer & Überzeit aktualisieren
  if (timerRunning) {
    if (isNegative) {
      document.title = `(${str}) ⚠️ Überzeit - Flow`;
    } else {
      document.title = `(${str}) Flow`;
    }
  } else {
    document.title = 'Flow - Dein Alltagsbegleiter';
  }
  
  const pct = timerInitialSeconds > 0 ? Math.max(0, (timerSeconds / timerInitialSeconds) * 100) : 100;
  const progressBars = ['timer-progress-bar', 'helper-pick-timer-progress-bar', 'helper-steps-timer-progress-bar'];
  progressBars.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.width = isNegative ? '100%' : `${pct}%`;
      el.classList.toggle('bg-rose-500', isNegative);
    }
  });

  const countEl = document.getElementById('ringing-live-counter');
  if (countEl) {
    countEl.innerText = str;
  }
} 
 
 

// timer.js Teil 3/3: Timer-Start/Stop/Pause & UI-Updates

let timerTargetEndTime = null;
let timerHasTriggeredZero = false;

function startTaskTimer(taskName, event) {
  if (event) event.stopPropagation();
  if (!taskName) return;
  activeTimerTask = taskName; 
  
  const mins = getCurrentPresetMinutes();
  timerSeconds = mins * 60;
  timerInitialSeconds = mins * 60;
  timerHasTriggeredZero = false;
  
  updateActiveTimerLabels();
  startTimer();
  updateTimerDisplay();
  updateTimerUI();
  showToast(`⏱️ Focus: "${taskName}" (${mins}m)`);
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
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerRunning = false; 
  timerTargetEndTime = null;
  timerHasTriggeredZero = false;
  timerSeconds = mins * 60;
  timerInitialSeconds = mins * 60;
  
  if (typeof stopAmbientSound === 'function') stopAmbientSound(true);
  if (typeof stopLookaheadSequencer === 'function') stopLookaheadSequencer();
  if ('speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }
  
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

function syncTimerWithTimestamp() {
  if (!timerRunning || !timerTargetEndTime) return;
  const now = Date.now();
  timerSeconds = Math.round((timerTargetEndTime - now) / 1000);
  updateTimerDisplay();
}

// Hintergrund-Synchronisierung bei Tab-Fokus / Display-Entsperrung
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      syncTimerWithTimestamp();
    }
  });
  window.addEventListener('focus', () => {
    syncTimerWithTimestamp();
  });
}

function startTimer() {
  if (timerRunning) return;
  
  // Wenn der Timer bei 0 stand und neu gestartet wird, Preset-Minuten nutzen
  if (timerSeconds === 0 && !timerTargetEndTime) {
    const mins = getCurrentPresetMinutes();
    timerSeconds = mins * 60;
    timerInitialSeconds = mins * 60;
    timerHasTriggeredZero = false;
  }
  
  const isFreshStart = timerSeconds === timerInitialSeconds;
  if (isFreshStart) {
    timerHasTriggeredZero = false;
  }
  
  timerRunning = true;
  timerTargetEndTime = Date.now() + (timerSeconds * 1000);
  updateTimerDisplay();
  updateTimerUI();
  updateMuteButtonsUI();
  
  try {
    playRandomTimerAmbient();
  } catch(e) {
    console.warn("Ambient play notice:", e);
  }

  // Zeitansage zu Beginn einer frischen Sitzung (nicht beim Fortsetzen nach Pause), je nach Sound-Einstellung
  if (isFreshStart && timerSoundEnabled) {
    try {
      const lang = typeof currentLang !== 'undefined' ? currentLang : 'de';
      const startMins = Math.round(timerInitialSeconds / 60);
      const phraseList = SESSION_START_PHRASES[lang] || SESSION_START_PHRASES.de;
      const phrase = pickWithoutImmediateRepeat(phraseList, lastSessionStartPhrase);
      lastSessionStartPhrase = phrase;
      let startText = phrase.replace('{mins}', startMins);
      if (startMins === 1) {
        startText = startText.replace('Minuten', 'Minute').replace('minutes', 'minute').replace('minutos', 'minuto').replace('λεπτά', 'λεπτό');
      }
      const startSessionToken = currentSpeechSessionId;
      const startTimeout = setTimeout(() => {
        if (!timerRunning || currentSpeechSessionId !== startSessionToken) return;
        speakSoftlyDynamic(startText, timerSeconds, timerInitialSeconds);
      }, 400);
      if (typeof activeTimeouts !== 'undefined' && Array.isArray(activeTimeouts)) {
        activeTimeouts.push(startTimeout);
      }
    } catch(e) {}
  }
  
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!timerRunning || !timerTargetEndTime) return;
    
    const now = Date.now();
    const prevSecs = timerSeconds;
    timerSeconds = Math.round((timerTargetEndTime - now) / 1000);
    
    // Punktgenauer Null-Übergang (wird exakt einmal ausgelöst!)
    if (timerSeconds <= 0 && !timerHasTriggeredZero && prevSecs > 0) {
      timerHasTriggeredZero = true;
      if (typeof playProceduralSound === 'function') playProceduralSound();
      
      startPleasantRinging();
      
      if (typeof stopAmbientSound === 'function') {
        stopAmbientSound(true);
      }

      if (timerSoundEnabled) {
        const lang = typeof currentLang !== 'undefined' ? currentLang : 'de';
        const timeUp = (typeof TIME_UP_PHRASES !== 'undefined' && TIME_UP_PHRASES[lang]) 
          ? TIME_UP_PHRASES[lang] 
          : "Die Zeit ist abgelaufen!";
        const timeUpSessionToken = currentSpeechSessionId;
        const timeUpTimeout = setTimeout(() => {
          if (!timerRunning || currentSpeechSessionId !== timeUpSessionToken) return;
          speakSoftlyDynamic(timeUp, 0, timerInitialSeconds);
        }, 600);
        if (typeof activeTimeouts !== 'undefined' && Array.isArray(activeTimeouts)) {
          activeTimeouts.push(timeUpTimeout);
        }
      }
    }
    
    // Countdown-Phase (positive Restzeit)
    if (timerSeconds > 0 && timerSeconds % 60 === 0 && timerSeconds !== prevSecs && timerSeconds !== timerInitialSeconds) {
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
      
      try { playRandomTimerAmbient(true); } catch(e) {}
    }

    // Überzeit-Phase (negative Zeit läuft nahtlos weiter: -1, -2, -3, -30, -60, -120...)
    if (timerSeconds < 0 && timerSeconds !== prevSecs) {
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
  }, 250);
}

function pauseTimer() {
  if (!timerRunning) return;
  if (typeof currentSpeechSessionId !== 'undefined') {
    currentSpeechSessionId++;
  }
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerTargetEndTime = null;
  timerRunning = false;
  updateTimerUI();
  
  if (typeof stopPleasantRinging === 'function') {
    stopPleasantRinging();
  }
  if (typeof ringInterval !== 'undefined' && ringInterval) {
    clearTimeout(ringInterval);
    clearInterval(ringInterval);
    ringInterval = null;
  }
  if (typeof ringTimeout !== 'undefined' && ringTimeout) {
    clearTimeout(ringTimeout);
    ringTimeout = null;
  }
  if (typeof activeTimeouts !== 'undefined' && Array.isArray(activeTimeouts)) {
    activeTimeouts.forEach(t => clearTimeout(t));
    activeTimeouts.length = 0;
  }
  
  if (typeof stopAmbientSound === 'function') {
    stopAmbientSound(true);
  }
  if (typeof stopLookaheadSequencer === 'function') {
    stopLookaheadSequencer();
  }
  if ('speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch (e) { console.warn('[Timer] pause speech cancel warning:', e); }
    setTimeout(() => { try { window.speechSynthesis.cancel(); } catch (e) {} }, 0);
    setTimeout(() => { try { window.speechSynthesis.cancel(); } catch (e) {} }, 50);
  }
  updateTimerDisplay();
}

function stopTimer() {
  if (typeof currentSpeechSessionId !== 'undefined') {
    currentSpeechSessionId++;
  }
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerTargetEndTime = null;
  timerRunning = false;
  timerHasTriggeredZero = false;
  timerSeconds = timerInitialSeconds; 
  activeTimerTask = null;
  
  if (typeof stopPleasantRinging === 'function') {
    stopPleasantRinging();
  } else if (typeof dismissRingingModalOnly === 'function') {
    dismissRingingModalOnly();
  }
  if (typeof ringInterval !== 'undefined' && ringInterval) {
    clearTimeout(ringInterval);
    clearInterval(ringInterval);
    ringInterval = null;
  }
  if (typeof ringTimeout !== 'undefined' && ringTimeout) {
    clearTimeout(ringTimeout);
    ringTimeout = null;
  }
  if (typeof activeTimeouts !== 'undefined' && Array.isArray(activeTimeouts)) {
    activeTimeouts.forEach(t => clearTimeout(t));
    activeTimeouts.length = 0;
  }
  
  document.title = 'Flow - Dein Alltagsbegleiter';
  
  updateActiveTimerLabels();
  updateTimerDisplay();
  updateTimerUI();
  if (typeof renderApp === 'function') renderApp();
  
  // Alle Ambient-Sounds, Sequencer, User-Audios und Sprachausgaben SOFORT stoppen
  if (typeof stopAmbientSound === 'function') {
    stopAmbientSound(true);
  }
  if (typeof stopLookaheadSequencer === 'function') {
    stopLookaheadSequencer();
  }
  if ('speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch (e) { console.warn('[Timer] stop speech cancel warning:', e); }
    setTimeout(() => { try { window.speechSynthesis.cancel(); } catch (e) {} }, 0);
    setTimeout(() => { try { window.speechSynthesis.cancel(); } catch (e) {} }, 50);
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
  
  const zenPlay = document.getElementById('zen-play-btn');
  const zenPause = document.getElementById('zen-pause-btn');
  if (zenPlay && zenPause) {
    if (timerRunning) {
      zenPlay.classList.add('hidden');
      zenPause.classList.remove('hidden');
    } else {
      zenPlay.classList.remove('hidden');
      zenPause.classList.add('hidden');
    }
  }

  updateActiveTimerBadge();
  updateMuteButtonsUI();

  const timerContainers = [
    document.getElementById('timer-trigger-container'),
    document.getElementById('helper-pick-timer-box'),
    document.getElementById('helper-steps-timer-box')
  ];
  timerContainers.forEach(el => {
    if (el) el.classList.toggle('timer-active-glow', !!timerRunning);
  });

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
  const displays = ['timer-display', 'helper-pick-timer-display', 'helper-steps-timer-display', 'zen-timer-display', 'game-hud-timer-display', 'mobile-timer-display'];
  displays.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.innerText = str;
      el.classList.toggle('text-rose-400', isNegative);
      el.classList.toggle('animate-pulse', isNegative);
    }
  });
  
  // Zen & Mobile Timer Status Labels
  const zenStatus = document.getElementById('zen-timer-status');
  const mobStatus = document.getElementById('mobile-timer-status');
  [zenStatus, mobStatus].forEach(st => {
    if (st) {
      if (timerRunning) {
        st.innerText = isNegative ? '⚠️ Überzeit' : 'Fokus aktiv';
        st.className = isNegative ? 'text-[10px] text-rose-400 font-bold uppercase tracking-wider animate-pulse' : 'text-[10px] text-emerald-400 font-bold uppercase tracking-wider';
      } else {
        st.innerText = 'Bereit';
        st.className = 'text-[10px] text-gray-400 font-bold uppercase tracking-wider';
      }
    }
  });

  // Mobile Timer Play/Pause Buttons
  const mobPlayBtn = document.getElementById('mobile-timer-play-btn');
  const mobPauseBtn = document.getElementById('mobile-timer-pause-btn');
  if (mobPlayBtn && mobPauseBtn) {
    if (timerRunning) {
      mobPlayBtn.classList.add('hidden');
      mobPauseBtn.classList.remove('hidden');
    } else {
      mobPlayBtn.classList.remove('hidden');
      mobPauseBtn.classList.add('hidden');
    }
  }

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
 
 

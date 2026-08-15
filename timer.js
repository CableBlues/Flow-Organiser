
let timerSeconds = 2 * 60; // Standardmäßig auf 2 Minuten initialisiert
let timerInitialSeconds = 2 * 60;
let timerRunning = false;
let timerInterval = null;
let activeTimerTask = null;

let timerSoundEnabled = localStorage.getItem('flowTimerSoundEnabled') !== 'false';
let timerVoiceRotationIndex = 0;
let lastSelectedTimerAmbient = null;

// Audio-Intervalle für die harmonischen Synthesizer-Loops am Ende
let ringInterval = null;
let ringTimeout = null;
let currentEndingPatternIndex = 0;

// Tracker für die im Modal angezeigte Alarm-Klingelzeit
let ringingSeconds = 0;
let ringingSecondsInterval = null;

// Konstante Liste aller integrierten Ambient-Sounds zum Durchmischen
const TIMER_AMBIENTS = ['rain', 'ocean', 'campfire', 'birds', 'stream', 'temple', 'cafe', 'clock', 'purr', 'train', 'space', 'arcade', 'waterfall', 'guitarpad', 'monastery', 'keyboard', 'storm', 'frogs'];

// VERBESSERUNG: Junge, sympathische, warme und freundliche Profile mit natürlichem Sprechtempo (keine Extreme)
const VOICE_PROFILES = [
  { id: 'freundlich_weiblich_1', pitch: 1.12, rate: 0.98, gender: 'female' },
  { id: 'warm_maennlich_1', pitch: 1.02, rate: 1.00, gender: 'male' },
  { id: 'jung_weiblich_1', pitch: 1.18, rate: 1.02, gender: 'female' },
  { id: 'sympathisch_maennlich_1', pitch: 0.98, rate: 0.98, gender: 'male' },
  { id: 'sanft_weiblich_1', pitch: 1.10, rate: 0.96, gender: 'female' },
  { id: 'herzlich_maennlich_1', pitch: 1.05, rate: 1.00, gender: 'male' },
  { id: 'frisch_weiblich_1', pitch: 1.16, rate: 1.01, gender: 'female' },
  { id: 'ruhig_maennlich_1', pitch: 0.96, rate: 0.97, gender: 'male' },
  { id: 'hell_weiblich_1', pitch: 1.22, rate: 1.02, gender: 'female' },
  { id: 'klar_maennlich_1', pitch: 1.04, rate: 0.99, gender: 'male' },
  { id: 'milde_weiblich_1', pitch: 1.08, rate: 0.98, gender: 'female' },
  { id: 'modern_maennlich_1', pitch: 1.01, rate: 1.01, gender: 'male' }
];

// Motivierende Sätze, passend zum Fortschritt der Fokussitzung
const MOTIVATIONAL_CHUNKS = {
  de: {
    start: ["Super Start! Konzentriere dich auf diesen ersten Schritt.", "Sehr gut, der Anfang ist gemacht!", "Schritt für Schritt. Du hast das im Griff!"],
    halfway: ["Schon die Hälfte geschafft! Du machst das fantastisch.", "Bleib im Rhythmus, du bist voll auf Kurs!", "Ausgezeichneter Fokus! Atme kurz durch und mach weiter."],
    end: ["Fast geschafft! Jetzt kommt der Endspurt.", "Wunderbar! Die Ziellinie ist in Sicht.", "Hervorragend, nur noch ein kleiner Moment!"],
    overdue: ["Zeit zu wechseln!", "Nimm dir eine Pause.", "Die Sitzung ist vorbei."]
  },
  en: {
    start: ["Great start! Focus on this initial step.", "Perfect, you've made the first move!", "One step at a time. You've got this!"],
    halfway: ["Halfway there! You are doing absolutely amazing.", "Keep up this momentum, you are doing great!", "Superb progress! Take a breath and keep flowing."],
    end: ["Almost done! Just a tiny final stretch.", "Brilliant! The finish line is within reach.", "Outstanding, just a moment left!"],
    overdue: ["Time to switch!", "Take a quick break.", "Focus session completed."]
  },
  es: {
    start: ["¡Buen comienzo! Concéntrate en este primer paso.", "¡Excelente, ya has dado el primer paso!", "Paso a paso. ¡Tú puedes!"],
    halfway: ["¡Mitad de camino! Lo estás haciendo increíble.", "¡Sigue con este ritmo, vas por buen camino!", "¡Excelente progreso! Respira hondo y continúa."],
    end: ["¡Casi terminado! Solo queda un último effort.", "¡Brillante! La meta está a la vista.", "¡Espectacular, ya casi lo logras!"],
    overdue: ["¡Hora de cambiar!", "Tómate un descanso.", "Sesión terminada."]
  },
  el: {
    start: ["Υπέροχη αρχή! Εστίασε σε αυτό το πρώτο βήμα.", "Τέλεια, έκανες το πρώτο βήμα!", "Ένα βήμα τη φορά. Μπορείς να τα καταφέρεις!"],
    halfway: ["Στα μισά του δρόμου! Τα πηγαίνεις απολύτως φανταστικά.", "Κράτα αυτόν τον ρυθμό, είσαι σε τέλεια πορεία!", "Υπέροχη πρόοδος! Πάρε μια βαθιά ανάσα και συνέχισε."],
    end: ["Σχεδόν έφτασες! Μόνο μια μικρή τελική προσπάθεια.", "Φανταστικά! Ο τερματισμός είναι πλέον ορατός.", "Εξαιρετικά, έμεινε μόνο μια στιγμή!"],
    overdue: ["Ώρα για αλλαγή!", "Κάνε ένα διάλειμμα.", "Η συνεδρία ολοκληρώθηκε."]
  }
};

function safeTranslate(key) {
  if (typeof TRANSLATIONS === 'undefined') return key;
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.de?.[key] || key;
}

function getCurrentPresetMinutes() {
  const presetReal = document.getElementById('timer-preset-select-real');
  return presetReal ? (parseInt(presetReal.value) || 2) : 2;
}

// Synchronisiert den Timer-Zustand beim Laden
document.addEventListener('DOMContentLoaded', () => {
  const mins = getCurrentPresetMinutes();
  timerSeconds = mins * 60;
  timerInitialSeconds = mins * 60;
  updateTimerDisplay();
  updateTimerUI();
  updateMuteButtonsUI();
});

// Stummschaltung toggeln und Buttons aktualisieren
function toggleTimerSound() {
  timerSoundEnabled = !timerSoundEnabled;
  localStorage.setItem('flowTimerSoundEnabled', String(timerSoundEnabled));
  
  if (!timerSoundEnabled) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    stopAmbientSound(true);
    if (ringInterval) {
      clearInterval(ringInterval);
      ringInterval = null;
    }
    showToast(currentLang === 'de' ? "Timer-Sound stummgeschaltet 🔇" : "Timer sound muted 🔇");
  } else {
    showToast(currentLang === 'de' ? "Timer-Sound eingeschaltet 🔊" : "Timer sound unmuted 🔊");
    if (timerRunning) {
      playRandomTimerAmbient();
    }
  }
  updateMuteButtonsUI();
}

function updateMuteButtonsUI() {
  const muteBtnIds = ['timer-mute-btn', 'helper-pick-timer-mute-btn', 'helper-steps-timer-mute'];
  muteBtnIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (timerSoundEnabled) {
        el.innerHTML = '<i data-lucide="volume-2" class="w-3.5 h-3.5 text-gray-300 hover:text-white"></i>';
        el.title = currentLang === 'de' ? "Stummschalten" : "Mute";
      } else {
        el.innerHTML = '<i data-lucide="volume-x" class="w-3.5 h-3.5 text-rose-400"></i>';
        el.title = currentLang === 'de' ? "Ton einschalten" : "Unmute";
      }
    }
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Startet bei jedem Timer-Start einen neuen Natursound im Hintergrund
function playRandomTimerAmbient(crossfade = false) {
  if (!timerSoundEnabled) return;
  
  let chosen;
  do {
    chosen = TIMER_AMBIENTS[Math.floor(Math.random() * TIMER_AMBIENTS.length)];
  } while (chosen === lastSelectedTimerAmbient && TIMER_AMBIENTS.length > 1);
  
  lastSelectedTimerAmbient = chosen;
  
  if (typeof playAmbientSound === 'function') {
    playAmbientSound(chosen, crossfade);
    if (!crossfade) {
      setTimeout(() => {
        if (typeof soundGainNode !== 'undefined' && soundGainNode && audioCtx) {
          soundGainNode.gain.setValueAtTime(soundGainNode.gain.value, audioCtx.currentTime);
          soundGainNode.gain.linearRampToValueAtTime(soundMasterVolume * 1.0, audioCtx.currentTime + 1.2);
        }
      }, 60);
    }
  }
}

// Globale Sprach-Synthese mit variierenden, schnellen Profilen
function speakWithProfile(text, profileIndex) {
  if (!timerSoundEnabled) return;
  if (!('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'de';
    const langMap = { de: 'de-DE', en: 'en-US', es: 'es-ES', el: 'el-GR' };
    const targetLang = langMap[lang] || 'de-DE';
    utterance.lang = targetLang;

    const allVoices = window.speechSynthesis.getVoices();
    const matchingVoices = allVoices.filter(v => v.lang.startsWith(targetLang));

    const index = Math.abs(profileIndex) % VOICE_PROFILES.length;
    const profile = VOICE_PROFILES[index];

    utterance.rate = profile.rate;
    utterance.pitch = profile.pitch;

    const femaleKeywords = ['hedda', 'anna', 'zira', 'petra', 'elena', 'hazel', 'susan', 'samantha', 'moira', 'tessa', 'deutsch', 'female', 'google'];
    const maleKeywords = ['stefan', 'yannick', 'markus', 'david', 'george', 'ravi', 'stefanos', 'male'];

    const femaleVoices = matchingVoices.filter(v => 
      femaleKeywords.some(kw => v.name.toLowerCase().includes(kw)) &&
      !maleKeywords.some(kw => v.name.toLowerCase().includes(kw))
    );
    const maleVoices = matchingVoices.filter(v => 
      maleKeywords.some(kw => v.name.toLowerCase().includes(kw))
    );

    let selectedVoice = null;
    if (profile.gender === 'female' && femaleVoices.length > 0) {
      selectedVoice = femaleVoices[profileIndex % femaleVoices.length];
    } else if (profile.gender === 'male' && maleVoices.length > 0) {
      selectedVoice = maleVoices[profileIndex % maleVoices.length];
    } else if (matchingVoices.length > 0) {
      selectedVoice = matchingVoices[profileIndex % matchingVoices.length];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    if (typeof currentSoundType !== 'undefined' && currentSoundType) {
      if (typeof duckAmbientVolume === 'function') duckAmbientVolume(1.0); 
      utterance.onend = () => {
        if (typeof restoreAmbientVolume === 'function') restoreAmbientVolume();
      };
      utterance.onerror = () => {
        if (typeof restoreAmbientVolume === 'function') restoreAmbientVolume();
      };
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error("Fehler bei der speakWithProfile Ausführung:", e);
  }
}

// Jede Minute wechselnde Stimmenprofile im Timer
function speakSoftlyDynamic(text, remSec, totSec) {
  const minsLeft = Math.floor(remSec / 60);
  speakWithProfile(text, minsLeft);
}

// Liefert kontextbezogene Motivationen basierend auf der vergangenen Zeit
function getContextMotivation(remSec, totSec) {
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'de';
  const list = MOTIVATIONAL_CHUNKS[lang] || MOTIVATIONAL_CHUNKS['de'];
  const pct = (remSec / totSec) * 100;
  
  if (pct > 72) {
    return list.start[Math.floor(Math.random() * list.start.length)];
  } else if (pct > 28) {
    return list.halfway[Math.floor(Math.random() * list.halfway.length)];
  } else {
    return list.end[Math.floor(Math.random() * list.end.length)];
  }
}

// Weckruf mit prozeduralen Synthesizer-Mustern
function startPleasantRinging() {
  stopPleasantRinging();
  if (!timerSoundEnabled) return;
  
  currentEndingPatternIndex = (currentEndingPatternIndex + 1) % 3;
  const patternId = currentEndingPatternIndex;

  const playSynthPattern = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      if (patternId === 0) {
        const notes = [174.61, 220.00, 261.63, 329.63];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.12);
          
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.06, now + i * 0.12 + 0.15);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
          
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          osc.start(now);
          osc.stop(now + 3.0);
        });
      } else if (patternId === 1) {
        const notes = [392.00, 440.00, 523.25, 587.33, 659.25];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.05, now + i * 0.08 + 0.03);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
          
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          osc.start(now);
          osc.stop(now + 1.5);
        });
      } else {
        const notes = [110.00, 220.00, 330.00];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gainNode = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(90, now);
          filter.frequency.exponentialRampToValueAtTime(750, now + 1.2);

          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.1, now + 0.8);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

          osc.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 3.0);
        });
      }
    } catch (e) {
      console.error("Synthesizer-Wiedergabefehler:", e);
    }
  };
  
  playSynthPattern();
  ringInterval = setInterval(playSynthPattern, 3800);
  
  ringTimeout = setTimeout(() => {
    stopPleasantRinging();
  }, 120000);
  
  showRingingModal();
}

function stopPleasantRinging() {
  if (ringInterval) {
    clearInterval(ringInterval);
    ringInterval = null;
  }
  if (ringTimeout) {
    clearTimeout(ringTimeout);
    ringTimeout = null;
  }
  hideRingingModal();

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerRunning = false;
  timerSeconds = timerInitialSeconds;
  activeTimerTask = null;
  updateActiveTimerLabels();
  updateTimerDisplay();
  updateTimerUI();
  if (typeof renderApp === 'function') renderApp();
}

function showRingingModal() {
  if (document.getElementById('timer-ringing-modal')) return;
  
  const modal = document.createElement('div');
  modal.id = 'timer-ringing-modal';
  modal.className = 'fixed inset-0 z-[200000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md';
  
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'de';
  
  const title = {
    de: 'Fokus-Sitzung beendet! 🎉',
    en: 'Focus Session Finished! 🎉',
    es: '¡Sesión de enfoque terminada! 🎉',
    el: 'Η συνεδρία εστίασης ολοκληρώθηκε! 🎉'
  }[lang] || 'Session Finished! 🎉';

  const initialMins = Math.floor(timerInitialSeconds / 60);
  const initialSecs = timerInitialSeconds % 60;
  const totalDurationStr = `${initialMins}:${String(initialSecs).padStart(2, '0')}`;

  const durationLabel = {
    de: `Gesamte Fokusdauer: ${totalDurationStr} Min.`,
    en: `Total focus duration: ${totalDurationStr} Min.`,
    es: `Duración total de enfoque: ${totalDurationStr} Min.`,
    el: `Συνολική διάρκεια εστίασης: ${totalDurationStr} λεπτά.`
  }[lang];

  const btnText = {
    de: 'Timer stoppen 🔕',
    en: 'Stop Alarm 🔕',
    es: 'Detener Alarma 🔕',
    el: 'Διακοπή Ξυπνητηριού 🔕'
  }[lang] || 'Stop Alarm 🔕';

  modal.innerHTML = `
    <div class="w-full max-w-sm bg-[#111116] border border-[var(--accent)] p-6 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.3)] text-center text-white flex flex-col items-center gap-4">
      <div class="h-16 w-16 bg-[var(--accent)]/10 rounded-full flex items-center justify-center text-3xl animate-bounce">
        ✨
      </div>
      <h2 class="font-display font-black text-lg tracking-tight text-white">${title}</h2>
      
      <div class="space-y-1 my-1">
        <p class="text-xs text-purple-300 font-bold tracking-wide">${durationLabel}</p>
        <p id="ringing-live-counter" class="text-[11px] text-gray-400 font-medium">Überfällig seit: -00:00</p>
      </div>

      <button onclick="stopPleasantRinging()" class="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition duration-150 transform active:scale-95 cursor-pointer">
        ${btnText}
      </button>
    </div>
  `;
  document.body.appendChild(modal);
}

function hideRingingModal() {
  const modal = document.getElementById('timer-ringing-modal');
  if (modal) modal.remove();
}

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
  
  timerInterval = setInterval(() => {
    timerSeconds--;
    
    if (timerSeconds === 0) {
      if (typeof playProceduralSound === 'function') playProceduralSound();
      
      startPleasantRinging();
      
      if (typeof fadeOutAmbientSound === 'function') {
        fadeOutAmbientSound(5.0);
      }
    }
    
    if (timerSeconds > 0 && timerSeconds % 60 === 0 && timerSeconds !== timerInitialSeconds) {
      const minsLeft = timerSeconds / 60;
      let speechText = "";
      const lang = typeof currentLang !== 'undefined' ? currentLang : 'de';
      
      if (minsLeft === 1) {
        if (lang === 'de') speechText = "Noch eine Minute";
        else if (lang === 'es') speechText = "Queda un minuto";
        else if (lang === 'el') speechText = "Απομένει ένα λεπτό";
        else speechText = "One minute remaining";
      } else {
        if (lang === 'de') speechText = `Noch ${minsLeft} Minuten`;
        else if (lang === 'es') speechText = `Quedan ${minsLeft} minutos`;
        else if (lang === 'el') speechText = `Απομένουν ${minsLeft} λεπτά`;
        else speechText = `${minsLeft} minutes remaining`;
      }
      
      if (Math.random() < 0.40) {
        const motiv = getContextMotivation(timerSeconds, timerInitialSeconds);
        speechText += `. ${motiv}`;
      }
      
      speakSoftlyDynamic(speechText, timerSeconds, timerInitialSeconds);
      playRandomTimerAmbient(true);
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
  
  const displays = ['timer-display', 'helper-pick-timer-display', 'helper-steps-timer-display', 'zen-timer-display'];
  displays.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerText = str;
  });
  
  const pct = timerInitialSeconds > 0 ? Math.max(0, (timerSeconds / timerInitialSeconds) * 100) : 100;
  const progressBars = ['timer-progress-bar', 'helper-pick-timer-progress-bar', 'helper-steps-timer-progress-bar'];
  progressBars.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.width = `${pct}%`;
  });

  const countEl = document.getElementById('ringing-live-counter');
  if (countEl && isNegative) {
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'de';
    const activeText = {
      de: `Überfällig seit: ${str}`,
      en: `Overdue by: ${str}`,
      es: `Atrasado por: ${str}`,
      el: `Καθυστέρηση κατά: ${str}`
    }[lang] || `Overdue by: ${str}`;
    countEl.innerText = activeText;
  }
} 

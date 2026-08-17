// timer.js Teil 2/3: Klingel-/Chime-Logik & Ringing-Modal

function playMinuteChime() {
  if (!timerSoundEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // 5 unterschiedliche, sanfte Klangmuster – wechseln ohne Sofort-Wiederholung
    let patternIdx;
    do {
      patternIdx = Math.floor(Math.random() * 5);
    } while (patternIdx === lastChimePatternIndex && 5 > 1);
    lastChimePatternIndex = patternIdx;

    const playTone = (freq, startAt, dur, type, peakGain) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + startAt);
      gainNode.gain.setValueAtTime(0, now + startAt);
      gainNode.gain.linearRampToValueAtTime(peakGain, now + startAt + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + startAt + dur);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now + startAt);
      osc.stop(now + startAt + dur + 0.05);
    };

    if (patternIdx === 0) {
      // Sanfte Glocke, zwei Töne
      playTone(523.25, 0, 1.1, 'sine', 0.045);
      playTone(659.25, 0.1, 1.0, 'sine', 0.03);
    } else if (patternIdx === 1) {
      // Weicher Marimba-Pluck
      playTone(392.00, 0, 0.6, 'triangle', 0.05);
      playTone(587.33, 0.09, 0.5, 'triangle', 0.035);
    } else if (patternIdx === 2) {
      // Luftiger Funkeln-Akkord
      playTone(783.99, 0, 0.9, 'sine', 0.025);
      playTone(987.77, 0.05, 0.8, 'sine', 0.02);
      playTone(1174.66, 0.11, 0.7, 'sine', 0.015);
    } else if (patternIdx === 3) {
      // Warmer, tiefer Blip
      playTone(220.00, 0, 0.8, 'sine', 0.05);
      playTone(329.63, 0.14, 0.65, 'triangle', 0.03);
    } else {
      // Windspiel-Flick
      playTone(880.00, 0, 0.5, 'sine', 0.03);
      playTone(1046.50, 0.07, 0.45, 'sine', 0.022);
      playTone(1318.51, 0.14, 0.4, 'sine', 0.016);
    }
  } catch (e) {
    console.error("Fehler beim Minuten-Glockenton:", e);
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
    el: 'Η συνεδρία εστίασης ολοκληρώθηκε! 🎉',
    fr: 'Session de focus terminée ! 🎉',
    it: 'Sessione di focus terminata! 🎉'
  }[lang] || 'Session Finished! 🎉';

  const initialMins = Math.floor(timerInitialSeconds / 60);
  const initialSecs = timerInitialSeconds % 60;
  const totalDurationStr = `${initialMins}:${String(initialSecs).padStart(2, '0')}`;

  const durationLabel = {
    de: `Gesamte Fokusdauer: ${totalDurationStr} Min.`,
    en: `Total focus duration: ${totalDurationStr} Min.`,
    es: `Duración total de enfoque: ${totalDurationStr} Min.`,
    el: `Συνολική διάρκεια εστίασης: ${totalDurationStr} λεπτά.`,
    fr: `Durée totale de concentration : ${totalDurationStr} min.`,
    it: `Durata totale della concentrazione: ${totalDurationStr} min.`
  }[lang];

  const overdueHint = {
    de: 'Läuft weiter mit, bis du stoppst',
    en: 'Keeps counting until you stop it',
    es: 'Sigue contando hasta que lo detengas',
    el: 'Συνεχίζει να μετρά μέχρι να το σταματήσεις',
    fr: 'Continue de compter jusqu\'à ce que tu l\'arrêtes',
    it: 'Continua a contare finché non lo fermi'
  }[lang] || 'Keeps counting until you stop it';

  const btnText = {
    de: 'Timer stoppen 🔕',
    en: 'Stop Alarm 🔕',
    es: 'Detener Alarma 🔕',
    el: 'Διακοπή Ξυπνητηριού 🔕',
    fr: 'Arrêter l\'alarme 🔕',
    it: 'Ferma la sveglia 🔕'
  }[lang] || 'Stop Alarm 🔕';

  modal.innerHTML = `
    <div class="w-full max-w-sm bg-[#111116] border border-[var(--accent)] p-6 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.3)] text-center text-white flex flex-col items-center gap-4">
      <div class="h-16 w-16 bg-[var(--accent)]/10 rounded-full flex items-center justify-center text-3xl animate-bounce">
        ✨
      </div>
      <h2 class="font-display font-black text-lg tracking-tight text-white">${title}</h2>
      
      <div class="space-y-1.5 my-1">
        <p class="text-xs text-purple-300 font-bold tracking-wide">${durationLabel}</p>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30">
          <span class="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse"></span>
          <p id="ringing-live-counter" class="text-[11px] text-rose-300 font-bold font-mono tracking-wide">-00:00</p>
        </div>
        <p class="text-[10px] text-gray-500">${overdueHint}</p>
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


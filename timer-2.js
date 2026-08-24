// timer.js Teil 2/3: Klingel-/Chime-Logik & Ringing-Modal

let lastChimePatternIndex = -1;

function playMinuteChime() {
  if (!timerSoundEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // 8 unterschiedliche, sanfte Klangmuster – wechseln zufällig ohne Sofort-Wiederholung
    let patternIdx;
    do {
      patternIdx = Math.floor(Math.random() * 8);
    } while (patternIdx === lastChimePatternIndex && 8 > 1);
    lastChimePatternIndex = patternIdx;

    const playTone = (freq, startAt, dur, type = 'sine', peakGain = 0.05) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + startAt);
      gainNode.gain.setValueAtTime(0, now + startAt);
      gainNode.gain.linearRampToValueAtTime(peakGain, now + startAt + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + startAt + dur);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now + startAt);
      osc.stop(now + startAt + dur + 0.05);
    };

    if (patternIdx === 0) {
      // 1. Sanfte Glocke (C5 -> E5)
      playTone(523.25, 0, 1.1, 'sine', 0.045);
      playTone(659.25, 0.1, 1.0, 'sine', 0.03);
    } else if (patternIdx === 1) {
      // 2. Weicher Marimba-Pluck (G4 -> D5)
      playTone(392.00, 0, 0.6, 'triangle', 0.05);
      playTone(587.33, 0.09, 0.5, 'triangle', 0.035);
    } else if (patternIdx === 2) {
      // 3. Luftiger Funkeln-Akkord (G5 -> B5 -> D6)
      playTone(783.99, 0, 0.9, 'sine', 0.025);
      playTone(987.77, 0.05, 0.8, 'sine', 0.02);
      playTone(1174.66, 0.11, 0.7, 'sine', 0.015);
    } else if (patternIdx === 3) {
      // 4. Warmer Rhodes-Blip (A3 -> E4)
      playTone(220.00, 0, 0.8, 'sine', 0.05);
      playTone(329.63, 0.14, 0.65, 'triangle', 0.03);
    } else if (patternIdx === 4) {
      // 5. Windspiel-Flick (A5 -> C6 -> E6)
      playTone(880.00, 0, 0.5, 'sine', 0.03);
      playTone(1046.50, 0.07, 0.45, 'sine', 0.022);
      playTone(1318.51, 0.14, 0.4, 'sine', 0.016);
    } else if (patternIdx === 5) {
      // 6. Zarte Harfen-Noten (D5 -> F#5 -> A5)
      playTone(587.33, 0, 0.7, 'sine', 0.035);
      playTone(739.99, 0.08, 0.7, 'sine', 0.03);
      playTone(880.00, 0.16, 0.9, 'sine', 0.025);
    } else if (patternIdx === 6) {
      // 7. Tibetische Klangschalen-Harmonik (432Hz Resonanz)
      playTone(432.00, 0, 1.8, 'sine', 0.04);
      playTone(864.00, 0.02, 1.2, 'sine', 0.015);
    } else {
      // 8. Hauchzarte Spieluhr (E6 -> G6 -> C7)
      playTone(1318.51, 0, 0.6, 'sine', 0.025);
      playTone(1567.98, 0.09, 0.6, 'sine', 0.02);
      playTone(2093.00, 0.18, 0.8, 'sine', 0.015);
    }
  } catch (e) {
    console.error("Fehler beim Minuten-Glockenton:", e);
  }
}

// Weckruf mit prozeduralen Synthesizer-Mustern (wechselt zufällig)
function startPleasantRinging() {
  stopPleasantRinging();
  if (!timerSoundEnabled) return;
  
  // Wechselt durch 6 sanfte Melodien
  currentEndingPatternIndex = (currentEndingPatternIndex + 1) % 6;
  const patternId = currentEndingPatternIndex;

  const playSynthPattern = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      if (patternId === 0) {
        // 1. Sanfter Fmaj7-Akkord (Rhodes Tape Style)
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
        // 2. Pentatonisches Glockenspiel (G4, A4, C5, D5, E5)
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
      } else if (patternId === 2) {
        // 3. Warmer Ambient-Pad Swell mit Filter (432Hz)
        const notes = [108.00, 216.00, 324.00, 432.00];
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
          gainNode.gain.linearRampToValueAtTime(0.07, now + 0.8);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

          osc.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 3.0);
        });
      } else if (patternId === 3) {
        // 4. Spieluhr & Celesta Arpeggios (C-Dur / F-Dur)
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.1);
          
          gainNode.gain.setValueAtTime(0, now + i * 0.1);
          gainNode.gain.linearRampToValueAtTime(0.04, now + i * 0.1 + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 1.8);
          
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 2.0);
        });
      } else if (patternId === 4) {
        // 5. Tibetische Gong- & Klangschalen-Harmonie
        const notes = [216.00, 432.00, 648.00];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.06 / (i + 1), now + 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
          
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          osc.start(now);
          osc.stop(now + 3.6);
        });
      } else {
        // 6. Zartes Neo-Klassik Piano-Motiv (Am7 / Cmaj7)
        const notes = [220.00, 261.63, 329.63, 392.00, 523.25];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gainNode = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.09);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(600, now);

          gainNode.gain.setValueAtTime(0, now + i * 0.09);
          gainNode.gain.linearRampToValueAtTime(0.05, now + i * 0.09 + 0.04);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 2.4);

          osc.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc.start(now + i * 0.09);
          osc.stop(now + i * 0.09 + 2.5);
        });
      }
    } catch (e) {
      console.error("Synthesizer-Wiedergabefehler:", e);
    }
  };
  
  playSynthPattern();
  // Zweites kurzes Signal nach 3.5 Sekunden, danach Ton beenden (damit Sprache frei ist)
  ringInterval = setTimeout(playSynthPattern, 3500);
  
  showRingingModal();
}

// Schließt nur das Modal und stoppt den Alarmton – Timer läuft im Minus weiter
function dismissRingingModalOnly() {
  if (ringInterval) {
    clearTimeout(ringInterval);
    clearInterval(ringInterval);
    ringInterval = null;
  }
  if (ringTimeout) {
    clearTimeout(ringTimeout);
    ringTimeout = null;
  }
  hideRingingModal();
}

// Stoppt Alarmton, Modal UND setzt Timer-Audio zurück (KEIN stopTimer-Aufruf!)
function stopPleasantRinging() {
  dismissRingingModalOnly();
  // Sound stoppen – KEIN stopTimer() hier um Endlosschleife zu vermeiden
  if (typeof fadeOutAmbientSound === 'function') {
    fadeOutAmbientSound(1.5);
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

function showRingingModal() {
  if (document.getElementById('timer-ringing-modal')) return;
  
  const modal = document.createElement('div');
  modal.id = 'timer-ringing-modal';
  modal.className = 'fixed inset-0 z-[200000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in';
  
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
    de: `Geplante Fokusdauer: ${totalDurationStr} Min.`,
    en: `Target focus duration: ${totalDurationStr} Min.`,
    es: `Duración prevista: ${totalDurationStr} Min.`,
    el: `Προβλεπόμενη διάρκεια: ${totalDurationStr} λεπτά.`,
    fr: `Durée prévue : ${totalDurationStr} min.`,
    it: `Durata prevista: ${totalDurationStr} min.`
  }[lang] || `Focus: ${totalDurationStr}`;

  const overdueHint = {
    de: 'Timer zählt im Minus weiter & erinnert dich regelmäßig',
    en: 'Timer keeps counting in overtime & reminds you',
    es: 'El temporizador sigue contando en exceso y te recuerda',
    el: 'Το χρονόμετρο συνεχίζει να μετρά και σε υπενθυμίζει',
    fr: 'Le minuteur continue en dépassement et te rappelle',
    it: 'Il timer continua in straordinario e ti ricorda'
  }[lang] || 'Timer keeps counting in overtime';

  const keepWorkingText = {
    de: 'Weiterarbeiten (Überzeit zählen ⏳)',
    en: 'Keep working (count overtime ⏳)',
    es: 'Seguir trabajando (contar exceso ⏳)',
    el: 'Συνέχιση εργασίας (μέτρηση καθυστέρησης ⏳)',
    fr: 'Continuer à travailler (compter le surplus ⏳)',
    it: 'Continua a lavorare (conta straordinario ⏳)'
  }[lang] || 'Keep working (count overtime ⏳)';

  const stopBtnText = {
    de: 'Timer stoppen & Reset 🔕',
    en: 'Stop & Reset Timer 🔕',
    es: 'Detener y reiniciar 🔕',
    el: 'Διακοπή & Επαναφορά 🔕',
    fr: 'Arrêter et réinitialiser 🔕',
    it: 'Ferma e ripristina 🔕'
  }[lang] || 'Stop & Reset Timer 🔕';

  modal.innerHTML = `
    <div class="relative w-full max-w-sm bg-[#111116] border border-purple-500/50 p-6 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.3)] text-center text-white flex flex-col items-center gap-4 animate-scale-up">
      <button onclick="dismissRingingModalOnly()" class="absolute top-3 right-3 text-gray-400 hover:text-white text-base font-bold p-1 cursor-pointer" title="Schließen (Timer läuft im Minus weiter)">✕</button>
      
      <div class="h-16 w-16 bg-purple-500/10 border border-purple-500/30 rounded-full flex items-center justify-center text-3xl animate-bounce">
        ✨
      </div>
      <h2 class="font-display font-black text-lg tracking-tight text-white">${title}</h2>
      
      <div class="space-y-1.5 my-1 w-full">
        <p class="text-xs text-purple-300 font-bold tracking-wide">${durationLabel}</p>
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/40">
          <span class="h-2 w-2 rounded-full bg-rose-400 animate-ping"></span>
          <p id="ringing-live-counter" class="text-xs text-rose-300 font-bold font-mono tracking-widest">-00:00</p>
        </div>
        <p class="text-[10px] text-gray-400 mt-1">${overdueHint}</p>
      </div>

      <div class="w-full flex flex-col gap-2 pt-1">
        <button onclick="dismissRingingModalOnly()" class="w-full py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition duration-150 transform active:scale-95 cursor-pointer">
          ${keepWorkingText}
        </button>
        <button onclick="stopTimer()" class="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-rose-300 border border-white/10 text-xs font-semibold rounded-xl transition cursor-pointer">
          ${stopBtnText}
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function hideRingingModal() {
  const modal = document.getElementById('timer-ringing-modal');
  if (modal) modal.remove();
}


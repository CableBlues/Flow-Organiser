
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

// Motivierende Sätze, passend zum Fortschritt der Fokussitzung (6 Varianten je Phase, damit sich nichts zu schnell wiederholt)
const MOTIVATIONAL_CHUNKS = {
  de: {
    start: ["Super Start! Konzentriere dich auf diesen ersten Schritt.", "Sehr gut, der Anfang ist gemacht!", "Schritt für Schritt. Du hast das im Griff!", "Los geht's, du hast die Kontrolle.", "Jeder Anfang zählt – weiter so!", "Dein Fokus ist bereit, leg los!"],
    halfway: ["Schon die Hälfte geschafft! Du machst das fantastisch.", "Bleib im Rhythmus, du bist voll auf Kurs!", "Ausgezeichneter Fokus! Atme kurz durch und mach weiter.", "Die Mitte ist erreicht, dein Momentum trägt dich.", "Weiter so, du bist im Flow!", "Klasse Tempo, bleib dran!"],
    end: ["Fast geschafft! Jetzt kommt der Endspurt.", "Wunderbar! Die Ziellinie ist in Sicht.", "Hervorragend, nur noch ein kleiner Moment!", "Gleich hast du es geschafft!", "Der letzte Abschnitt, gib nochmal alles!", "So kurz vorm Ziel, durchhalten!"],
    overdue: ["Zeit zu wechseln!", "Nimm dir eine Pause.", "Die Sitzung ist vorbei.", "Kurze Pause gefällig?", "Du darfst jetzt loslassen.", "Zeit für einen Szenenwechsel."]
  },
  en: {
    start: ["Great start! Focus on this initial step.", "Perfect, you've made the first move!", "One step at a time. You've got this!", "Let's go, you're in control.", "Every beginning counts – keep going!", "Your focus is ready, dive in!"],
    halfway: ["Halfway there! You are doing absolutely amazing.", "Keep up this momentum, you are doing great!", "Superb progress! Take a breath and keep flowing.", "Midpoint reached, your momentum is carrying you.", "Keep it up, you're in the flow!", "Great pace, stay with it!"],
    end: ["Almost done! Just a tiny final stretch.", "Brilliant! The finish line is within reach.", "Outstanding, just a moment left!", "You're almost there!", "Final stretch, give it your all!", "So close to the finish, hang in there!"],
    overdue: ["Time to switch!", "Take a quick break.", "Focus session completed.", "Fancy a quick break?", "You're allowed to let go now.", "Time for a change of scenery."]
  },
  es: {
    start: ["¡Buen comienzo! Concéntrate en este primer paso.", "¡Excelente, ya has dado el primer paso!", "Paso a paso. ¡Tú puedes!", "Vamos, tú tienes el control.", "Cada comienzo cuenta, ¡sigue así!", "Tu enfoque está listo, ¡adelante!"],
    halfway: ["¡Mitad de camino! Lo estás haciendo increíble.", "¡Sigue con este ritmo, vas por buen camino!", "¡Excelente progreso! Respira hondo y continúa.", "Punto medio alcanzado, tu impulso te lleva.", "¡Sigue así, estás en tu flow!", "¡Buen ritmo, no lo sueltes!"],
    end: ["¡Casi terminado! Solo queda un último esfuerzo.", "¡Brillante! La meta está a la vista.", "¡Espectacular, ya casi lo logras!", "¡Ya casi lo consigues!", "Último tramo, ¡dalo todo!", "Tan cerca de la meta, ¡aguanta!"],
    overdue: ["¡Hora de cambiar!", "Tómate un descanso.", "Sesión terminada.", "¿Te apetece una pausa rápida?", "Ahora puedes soltarlo.", "Hora de cambiar de escenario."]
  },
  el: {
    start: ["Υπέροχη αρχή! Εστίασε σε αυτό το πρώτο βήμα.", "Τέλεια, έκανες το πρώτο βήμα!", "Ένα βήμα τη φορά. Μπορείς να τα καταφέρεις!", "Πάμε, έχεις τον έλεγχο.", "Κάθε αρχή μετράει – συνέχισε!", "Η συγκέντρωσή σου είναι έτοιμη, ξεκίνα!"],
    halfway: ["Στα μισά του δρόμου! Τα πηγαίνεις απολύτως φανταστικά.", "Κράτα αυτόν τον ρυθμό, είσαι σε τέλεια πορεία!", "Υπέροχη πρόοδος! Πάρε μια βαθιά ανάσα και συνέχισε.", "Έφτασες στη μέση, η ορμή σε κρατάει.", "Συνέχισε έτσι, είσαι μέσα στη ροή!", "Υπέροχος ρυθμός, κράτα τον!"],
    end: ["Σχεδόν έφτασες! Μόνο μια μικρή τελική προσπάθεια.", "Φανταστικά! Ο τερματισμός είναι πλέον ορατός.", "Εξαιρετικά, έμεινε μόνο μια στιγμή!", "Σχεδόν τα κατάφερες!", "Τελευταίο κομμάτι, δώσε τα όλα!", "Τόσο κοντά στο τέλος, κράτα γερά!"],
    overdue: ["Ώρα για αλλαγή!", "Κάνε ένα διάλειμμα.", "Η συνεδρία ολοκληρώθηκε.", "Σου αρέσει η ιδέα ενός σύντομου διαλείμματος;", "Μπορείς τώρα να το αφήσεις.", "Ώρα για αλλαγή σκηνικού."]
  },
  fr: {
    start: ["Beau départ ! Concentre-toi sur ce premier pas.", "Parfait, tu as fait le premier pas !", "Étape par étape. Tu gères ça !", "C'est parti, tu as le contrôle.", "Chaque début compte – continue !", "Ton focus est prêt, lance-toi !"],
    halfway: ["Déjà à mi-chemin ! Tu t'en sors incroyablement bien.", "Garde ce rythme, tu es sur la bonne voie !", "Progrès superbe ! Respire un coup et continue.", "Mi-parcours atteint, ton élan te porte.", "Continue comme ça, tu es dans le flow !", "Superbe rythme, garde-le !"],
    end: ["Presque fini ! Encore un tout petit effort.", "Brillant ! La ligne d'arrivée est en vue.", "Excellent, il ne reste qu'un instant !", "Tu y es presque !", "Dernière ligne droite, donne tout !", "Si près du but, tiens bon !"],
    overdue: ["Il est temps de changer !", "Accorde-toi une pause.", "La session est terminée.", "Envie d'une petite pause ?", "Tu peux lâcher prise maintenant.", "Il est temps de changer de décor."]
  },
  it: {
    start: ["Ottimo inizio! Concentrati su questo primo passo.", "Perfetto, hai fatto il primo passo!", "Un passo alla volta. Ce la puoi fare!", "Si parte, hai il controllo.", "Ogni inizio conta – continua così!", "Il tuo focus è pronto, tuffati!"],
    halfway: ["Sei già a metà strada! Stai andando alla grande.", "Mantieni questo ritmo, sei sulla strada giusta!", "Progresso eccellente! Fai un respiro e continua.", "Metà strada raggiunta, il tuo slancio ti porta avanti.", "Continua così, sei nel flow!", "Ottimo ritmo, mantienilo!"],
    end: ["Quasi fatto! Manca solo un ultimo piccolo sforzo.", "Fantastico! Il traguardo è ormai in vista.", "Straordinario, resta solo un attimo!", "Ci sei quasi!", "Ultimo tratto, dai tutto!", "Così vicino al traguardo, resisti!"],
    overdue: ["È ora di cambiare!", "Concediti una pausa.", "La sessione è terminata.", "Ti va una breve pausa?", "Ora puoi lasciare andare.", "È ora di cambiare scenario."]
  }
};

// Kurze Ansagen beim Start einer frischen Fokus-Sitzung (mehrere Varianten, damit es nie stumpf gleich klingt)
const SESSION_START_PHRASES = {
  de: ["Fokus-Sitzung gestartet, {mins} Minuten. Los geht's!", "{mins} Minuten Fokuszeit beginnen jetzt. Viel Erfolg!", "Timer läuft, {mins} Minuten bis zur Pause. Bleib dran!", "Los geht's! {mins} Minuten volle Konzentration."],
  en: ["Focus session started, {mins} minutes. Let's go!", "{mins} minutes of focus time begin now. Good luck!", "Timer running, {mins} minutes until your break. Stay with it!", "Here we go! {mins} minutes of full focus."],
  es: ["Sesión de enfoque iniciada, {mins} minutos. ¡Vamos!", "Comienzan {mins} minutos de enfoque. ¡Mucho éxito!", "Temporizador en marcha, {mins} minutos hasta tu pausa. ¡No te rindas!", "¡Allá vamos! {mins} minutos de concentración total."],
  el: ["Η συνεδρία εστίασης ξεκίνησε, {mins} λεπτά. Πάμε!", "Ξεκινούν {mins} λεπτά εστίασης. Καλή επιτυχία!", "Το χρονόμετρο τρέχει, {mins} λεπτά μέχρι το διάλειμμα. Κράτα γερά!", "Πάμε! {mins} λεπτά πλήρους συγκέντρωσης."],
  fr: ["Session de focus démarrée, {mins} minutes. C'est parti !", "{mins} minutes de concentration commencent maintenant. Bonne réussite !", "Minuteur lancé, {mins} minutes avant ta pause. Tiens bon !", "C'est parti ! {mins} minutes de concentration totale."],
  it: ["Sessione di focus avviata, {mins} minuti. Si parte!", "Iniziano {mins} minuti di concentrazione. Buon lavoro!", "Timer avviato, {mins} minuti fino alla pausa. Resisti!", "Si parte! {mins} minuti di piena concentrazione."]
};

// Ansagen für die Minuten, die über die eingestellte Zeit hinaus verstreichen ("Überzeit")
const OVERDUE_MINUTE_LABELS = {
  de: (n) => n === 1 ? "1 Minute drüber" : `${n} Minuten drüber`,
  en: (n) => n === 1 ? "1 minute over" : `${n} minutes over`,
  es: (n) => n === 1 ? "1 minuto de más" : `${n} minutos de más`,
  el: (n) => n === 1 ? "1 λεπτό παραπάνω" : `${n} λεπτά παραπάνω`,
  fr: (n) => n === 1 ? "1 minute de dépassement" : `${n} minutes de dépassement`,
  it: (n) => n === 1 ? "1 minuto in più" : `${n} minuti in più`
};

// Zuletzt verwendete Sprüche merken, damit sich innerhalb einer Sitzung nichts unmittelbar wiederholt
let lastMotivationByTier = {};
let lastSessionStartPhrase = null;
let lastChimePatternIndex = -1;

function pickWithoutImmediateRepeat(list, lastValue) {
  if (!list || list.length === 0) return "";
  if (list.length === 1) return list[0];
  let choice;
  do {
    choice = list[Math.floor(Math.random() * list.length)];
  } while (choice === lastValue);
  return choice;
}

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
    showToast(tr({ de: "Timer-Sound stummgeschaltet 🔇", en: "Timer sound muted 🔇", es: "Sonido del temporizador silenciado 🔇", el: "Ο ήχος του χρονομέτρου σίγασε 🔇", fr: "Son du minuteur coupé 🔇", it: "Audio del timer disattivato 🔇" }));
  } else {
    showToast(tr({ de: "Timer-Sound eingeschaltet 🔊", en: "Timer sound unmuted 🔊", es: "Sonido del temporizador activado 🔊", el: "Ο ήχος του χρονομέτρου ενεργοποιήθηκε 🔊", fr: "Son du minuteur activé 🔊", it: "Audio del timer attivato 🔊" }));
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
        el.title = tr({ de: "Stummschalten", en: "Mute", es: "Silenciar", el: "Σίγαση", fr: "Couper le son", it: "Disattiva audio" });
      } else {
        el.innerHTML = '<i data-lucide="volume-x" class="w-3.5 h-3.5 text-rose-400"></i>';
        el.title = tr({ de: "Ton einschalten", en: "Unmute", es: "Activar sonido", el: "Ενεργοποίηση ήχου", fr: "Activer le son", it: "Attiva audio" });
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
    const langMap = { de: 'de-DE', en: 'en-US', es: 'es-ES', el: 'el-GR', fr: 'fr-FR', it: 'it-IT' };
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

// Liefert kontextbezogene Motivationen basierend auf der vergangenen Zeit (ohne Sofort-Wiederholung)
function getContextMotivation(remSec, totSec) {
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'de';
  const list = MOTIVATIONAL_CHUNKS[lang] || MOTIVATIONAL_CHUNKS['de'];
  const pct = (remSec / totSec) * 100;
  
  let tier = 'end';
  if (pct > 72) tier = 'start';
  else if (pct > 28) tier = 'halfway';
  
  const chosen = pickWithoutImmediateRepeat(list[tier], lastMotivationByTier[tier]);
  lastMotivationByTier[tier] = chosen;
  return chosen;
}

// Angenehmer, dezenter Glockenton für die Minuten "dazwischen" (kein Sprechen, viel Klang-Varianz)
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

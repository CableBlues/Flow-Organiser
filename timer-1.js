// timer.js Teil 1/3: State, Konstanten & Sound/Sprach-Hilfsfunktionen

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

// Konstante Liste aller integrierten sanften Ambient-Sounds & Melodien zum Durchmischen
const TIMER_AMBIENTS = ['piano', 'lofi', 'chimes', 'space', 'guitar', 'singingbowl', 'musicbox', 'breeze', 'campfire', 'birds', 'cafe', 'clock', 'lofi_sunshine', 'summer_meadow', 'bossa_nova'];

// VIELFÄLTIGE NATÜRLICHE STIMMPROFILE: Weiblich, Männlich, Kindlich/Lebhaft, Achtsam & Coach
const VOICE_PROFILES = [
  { id: 'female_warm', name: 'Warm Friendly Female', pitch: 1.04, rate: 0.96, gender: 'female' },
  { id: 'male_calm', name: 'Calm Grounded Male', pitch: 0.90, rate: 0.94, gender: 'male' },
  { id: 'child_cheerful', name: 'Cheerful Lively Child', pitch: 1.36, rate: 1.04, gender: 'child' },
  { id: 'female_gentle', name: 'Gentle Mindful Female', pitch: 1.08, rate: 0.92, gender: 'female' },
  { id: 'male_coach', name: 'Inspiring Coach Male', pitch: 0.94, rate: 0.98, gender: 'male' },
  { id: 'child_playful', name: 'Sunny Playful Child', pitch: 1.40, rate: 1.06, gender: 'child' },
  { id: 'female_fresh', name: 'Upbeat Young Female', pitch: 1.15, rate: 1.00, gender: 'female' },
  { id: 'male_warm', name: 'Friendly Warm Male', pitch: 0.98, rate: 0.96, gender: 'male' }
];

let globalVoiceTurnIndex = 0;

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

// Ansagen beim Erreichen von 00:00
const TIME_UP_PHRASES = {
  de: "Die Zeit ist abgelaufen!",
  en: "Time is up!",
  es: "¡El tiempo ha terminado!",
  el: "Ο χρόνος τελείωσε!",
  fr: "Le temps est écoulé !",
  it: "Il tempo è scaduto!"
};

// Ansagen bei 30 Sekunden Überzeit
const OVERDUE_30S_LABELS = {
  de: "30 Sekunden über der Zeit.",
  en: "30 seconds overtime.",
  es: "30 segundos de exceso.",
  el: "30 δευτερόλεπτα καθυστέρηση.",
  fr: "30 secondes de dépassement.",
  it: "30 secondi di ritardo."
};

// Ansagen für die Minuten, die über die eingestellte Zeit hinaus verstreichen ("Überzeit")
const OVERDUE_MINUTE_LABELS = {
  de: (n) => n === 1 ? "1 Minute überzogen" : `${n} Minuten überzogen`,
  en: (n) => n === 1 ? "1 minute overtime" : `${n} minutes overtime`,
  es: (n) => n === 1 ? "1 minuto de exceso" : `${n} minutos de exceso`,
  el: (n) => n === 1 ? "1 λεπτό καθυστέρηση" : `${n} λεπτά καθυστέρηση`,
  fr: (n) => n === 1 ? "1 minute de dépassement" : `${n} minutes de dépassement`,
  it: (n) => n === 1 ? "1 minuto di ritardo" : `${n} minuti di ritardo`
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

// Globale, hochqualitative Sprach-Synthese mit abwechselnden weiblichen, männlichen und kindlich-lebhaften Profilen
function speakWithProfile(text, profileIndex = null) {
  if (!timerSoundEnabled) return;
  if (!('speechSynthesis' in window)) return;
  if (!text || typeof text !== 'string') return;

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();

    // 1. Text für natürliche Intonation und Redefluss aufbereiten (Pausen & saubere Satzzeichen)
    let naturalText = text
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // Emojis entfernen
      .replace(/^\s*\d+[\s.:)\-]+\s*/i, '') // Schrittnummern am Anfang entfernen
      .replace(/^[•\-\*]+\s*/, '')
      .replace(/([!?.])\s+/g, '$1, ') // Sanftere Atempausen zwischen Sätzen
      .trim();

    if (!naturalText) naturalText = text;

    const utterance = new SpeechSynthesisUtterance(naturalText);
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';
    const langMap = { en: 'en-US', de: 'de-DE', es: 'es-ES', el: 'el-GR', fr: 'fr-FR', it: 'it-IT' };
    const targetLang = langMap[lang] || 'en-US';
    utterance.lang = targetLang;
    utterance.volume = 1.0;

    // 2. Stimmen-Rotation bestimmen
    if (profileIndex === null || profileIndex === undefined) {
      profileIndex = globalVoiceTurnIndex++;
    }
    const profile = VOICE_PROFILES[Math.abs(profileIndex) % VOICE_PROFILES.length] || VOICE_PROFILES[0];

    utterance.rate = profile.rate || 0.98;
    utterance.pitch = profile.pitch || 1.0;

    // 3. Verfügbare Systemstimmen abfragen und nach Qualität & Geschlecht filtern
    const allVoices = window.speechSynthesis.getVoices();
    const langPrefix = targetLang.split('-')[0].toLowerCase();
    const matchingVoices = allVoices.filter(v => v.lang && v.lang.toLowerCase().replace('_', '-').startsWith(langPrefix));

    // Bevorzuge hochqualitative "Natural", "Neural", "Google", "Apple", "Premium" Stimmen
    const premiumVoices = matchingVoices.filter(v => 
      /natural|neural|online|google|siri|apple|premium|enhanced/i.test(v.name)
    );

    const pool = premiumVoices.length > 0 ? premiumVoices : matchingVoices;

    const femaleKeywords = ['hedda', 'anna', 'zira', 'petra', 'elena', 'hazel', 'susan', 'samantha', 'moira', 'tessa', 'deutsch', 'female', 'julie', 'hortense', 'clara', 'paola', 'lucia', 'monica', 'victoria', 'audrey', 'alice', 'federica'];
    const maleKeywords = ['stefan', 'yannick', 'markus', 'david', 'george', 'ravi', 'stefanos', 'male', 'paul', 'henri', 'alvaro', 'jorge', 'cosimo', 'thomas', 'daniel', 'oliver', 'arthur'];

    const femaleVoices = pool.filter(v => 
      femaleKeywords.some(kw => v.name.toLowerCase().includes(kw)) &&
      !maleKeywords.some(kw => v.name.toLowerCase().includes(kw))
    );
    const maleVoices = pool.filter(v => 
      maleKeywords.some(kw => v.name.toLowerCase().includes(kw))
    );

    let selectedVoice = null;
    if (profile.gender === 'female' && femaleVoices.length > 0) {
      selectedVoice = femaleVoices[Math.abs(profileIndex) % femaleVoices.length];
    } else if (profile.gender === 'male' && maleVoices.length > 0) {
      selectedVoice = maleVoices[Math.abs(profileIndex) % maleVoices.length];
    } else if (profile.gender === 'child') {
      // Kindlich: Bevorzuge helle/weibliche Stimme mit erhöhtem Pitch
      selectedVoice = femaleVoices.length > 0 
        ? femaleVoices[Math.abs(profileIndex) % femaleVoices.length]
        : (pool[Math.abs(profileIndex) % pool.length] || null);
    } else if (pool.length > 0) {
      selectedVoice = pool[Math.abs(profileIndex) % pool.length];
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

    setTimeout(() => {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn("speechSynthesis.speak error:", err);
      }
    }, 60);
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

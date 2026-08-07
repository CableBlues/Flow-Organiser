// =========================================================================
// SENSITIVE MOVEMENT & GENTLE ACTIVATION MODULE ("Sport")
// =========================================================================

let currentSportExercise = null;
let sportTimerInterval = null;
let sportTimerSeconds = 60;
let sportTimerRunning = false;

// Lokale Übersetzungen für sportbezogene Systemmeldungen
const SPORT_TRANSLATIONS = {
  de: {
    no_exercise: "Keine Übung aktiv.",
    exercise_started: "Übungs-Timer gestartet! ⏱️",
    exercise_paused: "Übungs-Timer pausiert. ⏸️",
    exercise_skipped: "Übung übersprungen.",
    exercise_completed: "Wunderbar bewegt! 🎉 Dein Kreislauf dankt es dir.",
    energy_label: "Benötigtes Level: Löffel",
    next_suggestion: "Anderer Vorschlag 🔄"
  },
  en: {
    no_exercise: "No exercise active.",
    exercise_started: "Exercise timer started! ⏱️",
    exercise_paused: "Exercise timer paused. ⏸️",
    exercise_skipped: "Exercise skipped.",
    exercise_completed: "Wonderfully moved! 🎉 Your body appreciates it.",
    energy_label: "Required level: Spoons",
    next_suggestion: "Another Suggestion 🔄"
  },
  es: {
    no_exercise: "Ningún ejercicio activo.",
    exercise_started: "¡Temporizador de ejercicio iniciado! ⏱️",
    exercise_paused: "Temporizador de ejercicio pausado. ⏸️",
    exercise_skipped: "Ejercicio omitido.",
    exercise_completed: "¡Maravilloso movimiento! 🎉 Tu cuerpo te lo agradece.",
    energy_label: "Nivel requerido: Cucharas",
    next_suggestion: "Siguiente sugerencia 🔄"
  },
  el: {
    no_exercise: "Δεν υπάρχει ενεργή άσκηση.",
    exercise_started: "Το χρονόμετρο άσκησης ξεκίνησε! ⏱️",
    exercise_paused: "Το χronόμετρο άσκησης σταμάτησε. ⏸️",
    exercise_skipped: "Η άσκηση παραλείφθηκε.",
    exercise_completed: "Υπέροχη κίνηση! 🎉 Το σώμα σου σε ευχαριστεί.",
    energy_label: "Απαιτούμενο επίπεδο: Κουτάλια",
    next_suggestion: "Επόμενη πρόταση 🔄"
  }
};

// Die Übungsdatenbank – sanfte Übungen für jeden Energiezustand
const SPORT_EXERCISES = {
  de: {
    1: [
      { name: "Nacken-Entlastung 🧘‍♀️", desc: "Setze dich aufrecht hin. Lasse den Kopf langsam zur rechten Schulter sinken. Halte für 30s, dann wechsle die Seite. Atme tief ein.", duration: 60 },
      { name: "Handgelenk-Lockerung 👐", desc: "Kreise deine Handgelenke ganz sanft 30s nach links, dann 30s nach rechts. Perfekt, um Schreibtischanspannung zu lösen.", duration: 60 },
      { name: "Schulter-Kreisen 🔄", desc: "Zieh deine Schultern sanft nach oben zu den Ohren, kreise sie nach hinten und lasse sie sinken. Wiederhole das entspannt für 1 Minute.", duration: 60 },
      { name: "Katze-Kuh im Sitzen 🪑", desc: "Lege die Hände auf deine Knie. Beim Einatmen schiebst du die Brust sanft nach vorne (leichtes Hohlkreuz), beim Ausatmen machst du den Rücken ganz rund.", duration: 60 }
    ],
    2: [
      { name: "Brustöffner im Stehen 👐", desc: "Stelle dich aufrecht hin. Verschränke deine Hände hinter dem Rücken und ziehe sie sanft nach unten weg. Spüre die Dehnung in Brust und Schultern.", duration: 60 },
      { name: "Sanftes Wirbelsäulen-Pendeln 🌿", desc: "Lasse deine Arme im Stehen locker an den Seiten hängen. Drehe deinen Oberkörper ganz entspannt von links nach rechts, sodass die Arme locker mitschwingen.", duration: 60 },
      { name: "Himmels-Streckung 🌌", desc: "Strecke dich abwechselnd mit dem linken und rechten Arm so weit wie möglich nach oben, als würdest du Sterne pflücken. Atme gleichmäßig.", duration: 60 },
      { name: "Beckenkreisen 🌀", desc: "Stelle dich hüftbreit hin, lege die Hände auf die Hüften und ziehe ganz langsame, sanfte Kreise mit deinem Becken. Wechsel nach der Hälfte die Richtung.", duration: 60 }
    ],
    3: [
      { name: "Küchen-Kniebeugen 🪑", desc: "Halte dich optional an einer Stuhllehne oder Arbeitsplatte fest. Senke dein Becken kontrolliert nach hinten ab (wie beim Hinsetzen) und richte dich wieder auf.", duration: 60 },
      { name: "Wadenheben (Venenpresse) 🦵", desc: "Drücke dich im Stehen kontrolliert auf die Zehenspitzen hoch, halte kurz die Balance und senke die Fersen langsam wieder ab. Wiederhole dies gleichmäßig.", duration: 60 },
      { name: "Wand-Liegestütze 🧱", desc: "Stelle dich einen Schritt entfernt vor eine Wand. Lege die Hände flach auf, senke deine Brust kontrolliert zur Wand ab und drücke dich sanft wieder weg.", duration: 60 },
      { name: "Hampelmann für Faule (Low Impact) 🤸‍♂️", desc: "Mache einen Schritt zur Seite und nimm den Arm der gleichen Seite mit nach oben. Wechsle rhythmisch die Seiten, ohne zu springen. Sehr gelenkschonend.", duration: 60 }
    ]
  },
  en: {
    1: [
      { name: "Neck Release 🧘‍♀️", desc: "Sit up straight. Gently let your head drop toward your right shoulder. Hold for 30s, then switch sides. Breathe deeply.", duration: 60 },
      { name: "Wrist Rolls 👐", desc: "Roll your wrists gently in circles for 30s to the left, then 30s to the right. Perfect for relieving desk fatigue.", duration: 60 },
      { name: "Shoulder Circles 🔄", desc: "Gently shrug your shoulders up to your ears, roll them backward, and let them drop. Repeat in a relaxed rhythm for 1 minute.", duration: 60 },
      { name: "Seated Cat-Cow 🪑", desc: "Place hands on your knees. Inhale as you push your chest forward (gentle backbend), exhale as you round your spine fully.", duration: 60 }
    ],
    2: [
      { name: "Standing Chest Opener 👐", desc: "Stand tall. Interlace your fingers behind your back and gently pull them downward. Feel the stretch in your chest and shoulders.", duration: 60 },
      { name: "Gentle Spinal Twists 🌿", desc: "Stand with your feet shoulder-width apart, arms hanging loose. Gently rotate your torso left to right, letting your arms swing freely.", duration: 60 },
      { name: "Reach for the Stars 🌌", desc: "Alternate reaching up with your left and right arms as high as possible, as if picking stars from the sky. Breathe evenly.", duration: 60 },
      { name: "Hip Circles 🌀", desc: "Stand with hands on hips. Draw slow, gentle circles with your pelvis. Reverse the direction after 30 seconds.", duration: 60 }
    ],
    3: [
      { name: "Kitchen-Counter Squats 🪑", desc: "Optionally hold onto a chair or counter for balance. Lower your hips back and down in a controlled motion, then stand back up.", duration: 60 },
      { name: "Calf Raises 🦵", desc: "Stand tall. Slowly push up onto your tiptoes, hold the balance briefly, and slowly lower your heels. Repeat in a steady rhythm.", duration: 60 },
      { name: "Wall Push-Ups 🧱", desc: "Stand an arm's length from a wall. Place hands flat, slowly lower your chest toward the wall, and gently push yourself back.", duration: 60 },
      { name: "Lazy Jack (Low Impact) 🤸‍♂️", desc: "Step out to the side while raising the arm on the same side. Change sides rhythmically without jumping. Very gentle on the joints.", duration: 60 }
    ]
  },
  es: {
    1: [
      { name: "Alivio del Cuello 🧘‍♀️", desc: "Siéntate derecho. Deja caer suavemente la cabeza hacia el hombro derecho. Sostén por 30s, luego cambia de lado. Respira profundo.", duration: 60 },
      { name: "Rotación de Muñecas 👐", desc: "Gira tus muñecas suavemente en círculos durante 30s a la izquierda, luego 30s a la derecha. Perfecto para aliviar la fatiga de escritorio.", duration: 60 },
      { name: "Círculos de Hombros 🔄", desc: "Sube suavemente los hombros hacia las orejas, muévelos hacia atrás y déjalos caer. Repite de forma relajada durante 1 minuto.", duration: 60 },
      { name: "Gato-Vaca Sentado 🪑", desc: "Coloca tus manos en las rodillas. Inhala empujando el pecho hacia delante, exhala redondeando completamente la espalda.", duration: 60 }
    ],
    2: [
      { name: "Apertura de Pecho de Pie 👐", desc: "Párate derecho. Cruza tus dedos detrás de la espalda und tira suavemente hacia abajo. Siente el estiramiento en pecho und hombros.", duration: 60 },
      { name: "Giro de Columna Suave 🌿", desc: "Párate con los pies separados, los brazos sueltos. Gira suavemente tu torso de izquierda a derecha de forma relajada.", duration: 60 },
      { name: "Estiramiento al Cielo 🌌", desc: "Estira alternadamente los brazos izquierdo und derecho hacia arriba lo más alto posible, como si quisieras alcanzar las estrellas.", duration: 60 },
      { name: "Círculos de Cadera 🌀", desc: "Coloca las manos en las caderas. Dibuja círculos lentos y suaves con la pelvis. Cambia de dirección a los 30 segundos.", duration: 60 }
    ],
    3: [
      { name: "Sentadillas de Cocina 🪑", desc: "Apóyate en el respaldo de una silla si lo necesitas. Baja la cadera de forma controlada hacia atrás und vuelve a subir.", duration: 60 },
      { name: "Elevación de Talones 🦵", desc: "Ponte de pie. Sube despacio sobre las puntas de los pies, mantén el equilibrio und baja lentamente. Repite de forma constante.", duration: 60 },
      { name: "Flexiones en la Pared 🧱", desc: "Apoya las manos planas en la pared a la distancia de tus brazos. Baja el pecho hacia la pared de forma controlada und empuja hacia atrás.", duration: 60 },
      { name: "Jack de Bajo Impacto 🤸‍♂️", desc: "Da un paso lateral mientras subes el brazo del mismo lado. Cambia rítmicamente de lado sin saltar. Muy suave para las articulaciones.", duration: 60 }
    ]
  },
  el: {
    1: [
      { name: "Χαλάρωση Αυχένα 🧘‍♀️", desc: "Καθίστε ίσια. Αφήστε το κεφάλι να γείρει απαλά προς τον δεξιό ώμο για 30 δευτερόλεπτα, μετά αλλάξτε πλευρά. Αναπνεύστε βαθιά.", duration: 60 },
      { name: "Κύκλοι Καρπών 👐", desc: "Κάντε απαλούς κύκλους με τους καρπούς σας για 30 δευτερόλεπτα αριστερά και 30 δεξιά. Ιδανικό για την ένταση του γραφείου.", duration: 60 },
      { name: "Κύκλοι Ώμων 🔄", desc: "Σηκώστε απαλά τους ώμους προς τα αυτιά, γυρίστε τους προς τα πίσω και αφήστε τους να πέσουν. Επαναλάβετε χαλαρά για 1 λεπτό.", duration: 60 },
      { name: "Καθιστή Γάτα-Αγελάδα 🪑", desc: "Τοποθετήστε τα χέρια στα γόνατα. Εισπνεύστε σπρώχνοντας το στήθος μπροστά, εκπνεύστε καμπυλώνοντας πλήρως την πλάτη σας.", duration: 60 }
    ],
    2: [
      { name: "Άνοιγμα Στήθους σε Όρθια Στάση 👐", desc: "Σταθείτε όρθιοι. Πλέξτε τα δάχτυλα πίσω από την πλάτη σας και τραβήξτε απαλά προς τα κάτω. Νιώστε το άνοιγμα στο στήθος.", duration: 60 },
      { name: "Απαλές Στροφές Σπονδυλικής Στήλης 🌿", desc: "Σταθείτε με τα πόδια ανοιχτά και τα χέρια χαλαρά. Στρίψτε απαλά τον κορμό σας δεξιά και αριστερά, αφήνοντας τα χέρια να αιωρούνται.", duration: 60 },
      { name: "Τέντωμα στον Ουρανό 🌌", desc: "Τεντώστε εναλλάξ το αριστερό και το δεξί χέρι όσο πιο ψηλά γίνεται, σαν να μαζεύετε αστέρια. Αναπνεύστε ομοιόμορφα.", duration: 60 },
      { name: "Κύκλοι Λεκάνης 🌀", desc: "Τοποθετήστε τα χέρια στους γοφούς. Σχεδιάστε αργούς και απαλούς κύκλους με τη λεκάνη. Αλλάξτε κατεύθυνση μετά από 30 δευτερόλεπτα.", duration: 60 }
    ],
    3: [
      { name: "Ημικαθίσματα με Υποστήριξη 🪑", desc: "Κρατηθείτε από μια καρέκλα ή πάγκο για ισορροπία αν χρειάζεται. Χαμηλώστε τη λεκάνη σας ελεγχόμενα προς τα πίσω και σηκωθείτε.", duration: 60 },
      { name: "Ανυψώσεις Φτερών 🦵", desc: "Σταθείτε όρθιοι. Σηκωθείτε αργά στις μύτες των ποδιών, κρατήστε την ισορροπία σας και κατεβάστε αργά τις φτέρνες. Επαναλάβετε ρυθμικά.", duration: 60 },
      { name: "Push-ups στον Τοίχο 🧱", desc: "Σταθείτε σε απόσταση ενός χεριού από τον τοίχο. Τοποθετήστε τις παλάμες επίπεδα, χαμηλώστε το στήθος προς τον τοίχο και σπρώξτε απαλά πίσω.", duration: 60 },
      { name: "Ήπια Πλάγια Βήματα 🤸‍♂️", desc: "Κάντε ένα βήμα στο πλάι σηκώνοντας ταυτόχρονα το χέρι της ίδιας πλευράς. Αλλάξτε ρυθμικά πλευρές χωρίς αναπηδήσεις.", duration: 60 }
    ]
  }
};

function getSportT(key) {
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'de';
  return SPORT_TRANSLATIONS[lang]?.[key] || SPORT_TRANSLATIONS.de[key] || key;
}

// Open / Close Modals
function openSportModal() {
  document.getElementById('helper-sport-modal').classList.remove('hidden');
  resetSportTimer();
  generateSportSuggestion();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeSportModal() {
  document.getElementById('helper-sport-modal').classList.add('hidden');
  resetSportTimer();
}

// Generate Exercise Suggestions
function generateSportSuggestion() {
  const energySelect = document.getElementById('sport-energy-select');
  if (!energySelect) return;
  const level = parseInt(energySelect.value) || 2;
  
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'de';
  const list = SPORT_EXERCISES[lang]?.[level] || SPORT_EXERCISES['de'][level];
  
  // Pick random item from list
  const randomExercise = list[Math.floor(Math.random() * list.length)];
  currentSportExercise = randomExercise;

  const box = document.getElementById('sport-suggestion-box');
  if (box) {
    box.innerHTML = `
      <h4 class="text-white font-bold text-sm font-display mb-1">${randomExercise.name}</h4>
      <p class="text-xs text-gray-300 leading-relaxed font-semibold">${randomExercise.desc}</p>
      <div class="flex items-center justify-center gap-1.5 pt-2 text-[10px] text-orange-400 font-bold uppercase tracking-wider">
        <i data-lucide="clock" class="w-3.5 h-3.5"></i>
        <span>${randomExercise.duration}s</span>
      </div>
    `;
  }
  
  // Prepare Timer
  sportTimerSeconds = randomExercise.duration;
  updateSportTimerDisplay();
  document.getElementById('sport-timer-container').classList.remove('hidden');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Timer Logic
function updateSportTimerDisplay() {
  const display = document.getElementById('sport-timer-display');
  const progress = document.getElementById('sport-timer-progress');
  
  if (display) {
    const mins = Math.floor(sportTimerSeconds / 60);
    const secs = sportTimerSeconds % 60;
    display.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  
  if (progress && currentSportExercise) {
    const pct = (sportTimerSeconds / currentSportExercise.duration) * 100;
    progress.style.width = `${pct}%`;
  }
}

function startSportTimer() {
  if (sportTimerRunning) return;
  sportTimerRunning = true;
  
  document.getElementById('sport-timer-play-btn').classList.add('hidden');
  document.getElementById('sport-timer-pause-btn').classList.remove('hidden');

  showToast(getSportT('exercise_started'));

  sportTimerInterval = setInterval(() => {
    sportTimerSeconds--;
    updateSportTimerDisplay();
    
    if (sportTimerSeconds > 0 && sportTimerSeconds <= 3) {
      if (typeof playProceduralSound === 'function') playProceduralSound(6);
    }

    if (sportTimerSeconds <= 0) {
      clearInterval(sportTimerInterval);
      sportTimerRunning = false;
      completeSportActivity();
    }
  }, 1000);
}

function pauseSportTimer() {
  if (!sportTimerRunning) return;
  clearInterval(sportTimerInterval);
  sportTimerRunning = false;
  
  document.getElementById('sport-timer-play-btn').classList.remove('hidden');
  document.getElementById('sport-timer-pause-btn').classList.add('hidden');
  
  showToast(getSportT('exercise_paused'));
}

function skipSportTimer() {
  resetSportTimer();
  showToast(getSportT('exercise_skipped'));
  generateSportSuggestion();
}

function resetSportTimer() {
  if (sportTimerInterval) {
    clearInterval(sportTimerInterval);
    sportTimerInterval = null;
  }
  sportTimerRunning = false;
  
  const playBtn = document.getElementById('sport-timer-play-btn');
  const pauseBtn = document.getElementById('sport-timer-pause-btn');
  if (playBtn) playBtn.classList.remove('hidden');
  if (pauseBtn) pauseBtn.classList.add('hidden');

  if (currentSportExercise) {
    sportTimerSeconds = currentSportExercise.duration;
  }
  updateSportTimerDisplay();
}

// Complete Exercise Unit
function completeSportActivity() {
  resetSportTimer();
  
  if (typeof playProceduralSound === 'function') {
    playProceduralSound(0);
  }

  if (typeof triggerConfetti === 'function') {
    triggerConfetti();
  }

  if (typeof showPraise === 'function') {
    showPraise();
  }

  showToast(getSportT('exercise_completed'));
  
  if (typeof state !== 'undefined') {
    state.streak = (state.streak || 0) + 1;
    saveState();
  }

  closeSportModal();
}

// Tastatur-Listener zum Schließen des Modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const sportModal = document.getElementById('helper-sport-modal');
    if (sportModal && !sportModal.classList.contains('hidden')) {
      closeSportModal();
    }
  }
});
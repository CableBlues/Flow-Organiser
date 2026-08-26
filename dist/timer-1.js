// timer.js Teil 1/3: State, Konstanten & Sound/Sprach-Hilfsfunktionen

let timerSeconds = 2 * 60; // Standardmäßig auf 2 Minuten initialisiert
let timerInitialSeconds = 2 * 60;
let timerRunning = false;
let timerInterval = null;
let activeTimerTask = null;

let currentSpeechSessionId = 0;
window.currentSpeechSessionId = currentSpeechSessionId;

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

// VIELFÄLTIGE NATÜRLICHE STIMMPROFILE: Weiblich, Männlich, Kindlich/Lebhaft, Coach & Zen-Guide
const VOICE_PROFILES = [
  { id: 'female_warm', name: 'Warm Empathetic Female', pitch: 1.06, rate: 0.96, gender: 'female', style: 'warm' },
  { id: 'male_resonant', name: 'Calm Resonant Male', pitch: 0.88, rate: 0.94, gender: 'male', style: 'grounded' },
  { id: 'child_cheerful', name: 'Cheerful Sunny Child', pitch: 1.38, rate: 1.06, gender: 'child', style: 'joyful' },
  { id: 'coach_energetic', name: 'Inspiring Coach', pitch: 1.00, rate: 1.08, gender: 'male', style: 'upbeat' },
  { id: 'zen_serene', name: 'Serene Zen Guide', pitch: 0.92, rate: 0.86, gender: 'female', style: 'mindful' },
  { id: 'female_sparkle', name: 'Joyful Bright Female', pitch: 1.18, rate: 1.02, gender: 'female', style: 'sparkle' },
  { id: 'male_flow', name: 'Steady Flow Male', pitch: 0.94, rate: 0.98, gender: 'male', style: 'focus' },
  { id: 'child_playful', name: 'Playful Little Explorer', pitch: 1.42, rate: 1.04, gender: 'child', style: 'playful' }
];

let globalVoiceTurnIndex = 0;

// Motivierende Sätze, passend zum Fortschritt der Fokussitzung (hochqualitativ lokalisiert für alle 6 Sprachen)
const MOTIVATIONAL_CHUNKS = {
  en: {
    start: [
      "Great start! Take a deep breath and focus on this first gentle step.",
      "You've taken the first step. You have full control over your time.",
      "One small action at a time. You've got this completely!",
      "Let's go! Your momentum begins right here and now.",
      "Every moment of focus counts. Enjoy the smooth flow.",
      "Clear mind, open focus. Dive right into your work!",
      "A fantastic beginning. Let's make this session count.",
      "Settling into the rhythm. You are doing wonderfully!"
    ],
    halfway: [
      "Halfway there! You are doing absolutely incredible.",
      "Keep this calm, steady rhythm. You are totally on track!",
      "Superb progress! Take a tiny shoulder stretch and continue.",
      "Midpoint reached! Your focused momentum is carrying you forward.",
      "Keep flowing effortlessly, you are in your natural element!",
      "Great pace and dedication. Stay with this peaceful rhythm!",
      "You've built real traction. The hardest part is behind you.",
      "Wonderful concentration! Glide smoothly through the rest."
    ],
    end: [
      "Almost done! Just a beautiful, short final stretch.",
      "Brilliant dedication! The finish line is glowing in sight.",
      "Outstanding work, just a few moments of focus left!",
      "You are right at the threshold of success. Keep going!",
      "Final stretch! Let's wrap this up with joy and pride.",
      "So close to victory. Savor this rewarding feeling!",
      "Phenomenal effort. You're practically there!",
      "Finishing strong! You can feel proud of your focus today."
    ],
    overdue: [
      "Session complete! Time for a well-deserved stretch.",
      "Take a deep breath and let go. Wonderful session!",
      "Your focus time is fulfilled. Time to rest your mind.",
      "How about a refreshing glass of water and a pause?",
      "You've accomplished a lot. Step back and relax now.",
      "Time for a gentle change of scenery. Great job today!"
    ]
  },
  de: {
    start: [
      "Super Start! Atme tief durch und nimm dir ganz entspannt diesen ersten Schritt vor.",
      "Sehr gut, der Anfang ist gemacht! Du hast die volle Kontrolle.",
      "Schritt für Schritt. Du schaffst das mit Leichtigkeit!",
      "Los geht's! Dein Momentum entsteht genau jetzt.",
      "Jeder einzelne Augenblick zählt. Genieße den klaren Fluss.",
      "Dein Fokus ist bereit. Tauche ganz in deine Aufgabe ein!",
      "Ein wunderbarer Beginn. Lass uns diese Zeit genießen.",
      "Du findest deinen Takt. Das machst du wirklich großartig!"
    ],
    halfway: [
      "Schon die Hälfte geschafft! Du machst das absolut fantastisch.",
      "Bleib in deinem ruhigen Rhythmus, du bist voll auf Erfolgskurs!",
      "Ausgezeichneter Fokus! Schultern kurz lockern und weiterfließen.",
      "Die Mitte ist erreicht, dein Schwung trägt dich von selbst voran.",
      "Weiter so, du bist mitten in deinem natürlichen Flow!",
      "Klasse Ausdauer und Klarheit. Bleib einfach dran!",
      "Das Schwierigste liegt hinter dir. Jetzt läuft es wie von allein.",
      "Wunderbare Konzentration! Gleite entspannt durch die zweite Hälfte."
    ],
    end: [
      "Fast geschafft! Jetzt kommt der leichte, schöne Endspurt.",
      "Großartig! Die Ziellinie ist bereits in greifbarer Nähe.",
      "Hervorragend gemeistert, nur noch ein kleiner Moment!",
      "Gleich hast du es vollbracht! Sei stolz auf deinen Einsatz.",
      "Der letzte Abschnitt – mach ihn mit Leichtigkeit fertig!",
      "So nah am Ziel. Spüre die Freude des Erfolgs!",
      "Phänomenaler Einsatz, du hast es fast in der Tasche!",
      "Wunderbar durchgehalten. Ein echter Triumph für heute!"
    ],
    overdue: [
      "Fokuszeit erfüllt! Zeit für eine wohlverdiente Bewegungspause.",
      "Atme tief durch und lass locker. Großartige Arbeit!",
      "Deine Sitzung ist geschafft. Gönn deinen Augen etwas Ruhe.",
      "Wie wäre es mit einem Glas frischem Wasser und einer Pause?",
      "Du hast viel bewegt. Tritt kurz zurück und entspanne dich.",
      "Zeit für einen sanften Szenenwechsel. Danke für deinen Fokus!"
    ]
  },
  fr: {
    start: [
      "Superbe départ ! Respire profondément et aborde ce premier pas avec sérénité.",
      "Magnifique, le premier pas est franchi ! Tu as le plein contrôle.",
      "Une étape après l'autre. Tu maîtrises parfaitement la situation !",
      "C'est parti ! Ton élan se crée ici et maintenant.",
      "Chaque instant de concentration compte. Savoure cette fluidité.",
      "Esprit clair et attentif. Plonge avec plaisir dans ton travail !",
      "Un départ remarquable. Faisons de cette session un franc succès.",
      "Tu trouves ton propre tempo. Tu te débrouilles à merveille !"
    ],
    halfway: [
      "Déjà à mi-parcours ! Tu accomplis cela avec un brio formidable.",
      "Garde ce rythme doux et régulier, tu es parfaitement sur la bonne voie !",
      "Superbe concentration ! Détends un instant tes épaules et continue.",
      "Mi-chemin franchi, ton élan naturel te porte vers l'avant.",
      "Continue ainsi, tu es en plein cœur de ton flow !",
      "Une belle constance et beaucoup de clarté. Reste dans cet état !",
      "Le plus difficile est fait. La suite se déroule avec aisance.",
      "Concentration exemplaire ! Glisse tranquillement vers la fin."
    ],
    end: [
      "Presque terminé ! Il ne reste qu'une toute petite ligne droite.",
      "Brillant travail ! La ligne d'arrivée brille à l'horizon.",
      "Exceptionnel, plus que quelques instants de concentration !",
      "Tu y es presque ! Savoure la fierté de cet accomplissement.",
      "Dernier effort tout en douceur, mène cela à terme avec le sourire !",
      "Si près du but. Ressens la satisfaction du travail bien fait !",
      "Effort remarquable, la victoire est à portée de main !",
      "Magnifique persévérance. Sois très fier de ta session aujourd'hui."
    ],
    overdue: [
      "Temps de focus accompli ! Place à une pause bien méritée.",
      "Prends une grande inspiration et relâche la pression. Bravo !",
      "Ta session est finie. Offre un doux repos à tes yeux.",
      "Que dirais-tu d'un verre d'eau fraîche et de quelques pas ?",
      "Tu as fait un travail formidable. Recule un peu et détends-toi.",
      "Il est temps de changer de décor. Félicitations pour tes efforts !"
    ]
  },
  it: {
    start: [
      "Ottimo inizio! Fai un respiro profondo e affronta questo primo passo con calma.",
      "Perfetto, hai iniziato alla grande! Sei tu al timone.",
      "Un piccolo passo alla volta. Ce la farai con assoluta scioltezza!",
      "Si parte! Il tuo ritmo comincia proprio adesso.",
      "Ogni istante di concentrazione conta. Goditi il flusso naturale.",
      "Mente lucida e serena. Immergiti con entusiasmo nel tuo compito!",
      "Una partenza splendida. Rendiamo questa sessione memorabile.",
      "Stai trovando la tua cadenza ideale. Stai andando benissimo!"
    ],
    halfway: [
      "Sei già a metà strada! Stai facendo un lavoro davvero straordinario.",
      "Mantieni questa andatura armoniosa, sei perfettamente in carreggiata!",
      "Progresso eccellente! Sciogli un momento le spalle e continua.",
      "Metà percorso raggiunto, la tua carica positiva ti guida in avanti.",
      "Continua così, sei nel pieno del tuo flow naturale!",
      "Fantastica determinazione e lucidità. Resta con questa energia!",
      "La parte più impegnativa è alle spalle. Ora tutto scorre fluido.",
      "Concentrazione meravigliosa! Accompagna la sessione fino al termine."
    ],
    end: [
      "Quasi fatto! Manca solo un piccolissimo e piacevole sprint finale.",
      "Lavoro brillante! Il traguardo è ormai a un passo da te.",
      "Straordinario impegno, restano solo pochi istanti di focus!",
      "Ci sei quasi arrivato! Assapora la gioia di avercela fatta.",
      "Ultimo tratto: chiudi questo momento con orgoglio e serenità!",
      "A un passo dalla vittoria. Senti la bella soddisfazione nel petto!",
      "Impegno impeccabile, hai conquistato il tuo obiettivo!",
      "Resistenza da applausi. Puoi essere davvero fiero di te oggi."
    ],
    overdue: [
      "Sessione completata! È giunto il momento per una pausa rigenerante.",
      "Fai un respiro profondo e rilassati. Hai fatto un gran lavoro!",
      "Il tuo tempo di focus è terminato. Concedi riposo alla tua mente.",
      "Che ne dici di un bicchiere d'acqua fresca e due passi distensivi?",
      "Hai ottenuto grandi risultati. Stacca la spina e rilassati.",
      "È tempo di cambiare visuale. Bravissimo per la tua dedizione!"
    ]
  },
  es: {
    start: [
      "¡Excelente comienzo! Respira profundo y da este primer paso con total calma.",
      "¡Muy bien, ya diste el primer paso! Tienes el control absoluto.",
      "Paso a pasito, con calma. ¡Lo vas a lograr con total soltura!",
      "¡Vamos allá! Tu impulso ganador empieza aquí y ahora.",
      "Cada segundo de concentración suma. Disfruta de esta fluidez.",
      "Mente despejada y lista. ¡Sumérgete con alegría en tu tarea!",
      "Un inicio fantástico. Hagamos que esta sesión sea maravillosa.",
      "Encontraste tu propio ritmo. ¡Lo estás haciendo de maravilla!"
    ],
    halfway: [
      "¡Ya estás a mitad de camino! Lo estás haciendo de forma espectacular.",
      "Mantén este ritmo sereno y constante, ¡vas directo al éxito!",
      "¡Progreso fabuloso! Suelta los hombros un momento y continúa.",
      "¡Punto medio conquistado! Tu propia inercia te lleva hacia adelante.",
      "¡Sigue fluyendo así, estás en tu estado de flow ideal!",
      "Gran constancia y claridad mental. ¡Sigue con esa bella energía!",
      "Lo más difícil ya quedó atrás. Ahora todo marcha sobre ruedas.",
      "¡Concentración de diez! Deslízate suavemente hacia el final."
    ],
    end: [
      "¡Casi listo! Solo queda un tramo final muy breve y gratificante.",
      "¡Trabajo brillante! La meta resplandece justo frente a ti.",
      "¡Extraordinario esfuerzo, solo faltan unos instantes de enfoque!",
      "¡Ya estás prácticamente ahí! Siente el orgullo de lograrlo.",
      "Último detalle: ¡remata esta sesión con alegría y satisfacción!",
      "A pasitos de la meta. ¡Disfruta la sensación de triunfo!",
      "Dedicación fenomenal, ¡el objetivo ya es todo tuyo!",
      "Perseverancia admirable. Siéntete muy orgulloso de tu día."
    ],
    overdue: [
      "¡Tiempo de enfoque cumplido! Momento ideal para una pausa reconfortante.",
      "Respira hondo y suelta la tensión. ¡Hiciste un trabajo grandioso!",
      "Tu sesión ha concluido. Dale un merecido descanso a tu mirada.",
      "¿Qué tal un vaso de agua fresca y estirar un poco las piernas?",
      "Avanzaste muchísimo hoy. Tómate un respiro y desconecta.",
      "Hora de un suave cambio de ambiente. ¡Felicidades por tu enfoque!"
    ]
  },
  el: {
    start: [
      "Υπέροχο ξεκίνημα! Πάρε μια βαθιά ανάσα και κάνε αυτό το πρώτο βήμα με ηρεμία.",
      "Πολύ όμορφα, η αρχή έγινε! Έχεις τον απόλυτο έλεγχο του χρόνου σου.",
      "Βήμα προς βήμα, ήρεμα. Μπορείς να το πετύχεις με απόλυτη ευκολία!",
      "Πάμε δυνατά! Η θετική σου ορμή γεννιέται εδώ και τώρα.",
      "Κάθε στιγμή συγκέντρωσης μετράει. Απόλαυσε την καθαρή ροή.",
      "Καθαρό μυαλό και όμορφη διάθεση. Βυθίσου με χαρά στη δουλειά σου!",
      "Ένα εξαιρετικό ξεκίνημα. Ας κάνουμε αυτό το διάστημα πραγματικά αποδοτικό.",
      "Βρίσκεις τον ιδανικό σου ρυθμό. Τα πηγαίνεις περίφημα!"
    ],
    halfway: [
      "Έφτασες ήδη στα μισά του δρόμου! Τα καταφέρνεις απολύτως φανταστικά.",
      "Κράτα αυτόν τον γαλήνιο ρυθμό, είσαι σε ιδανική πορεία επιτυχίας!",
      "Υπέροχη πρόοδος! Χαλάρωσε λίγο τους ώμους σου και συνέχισε.",
      "Η μέση κατακτήθηκε, η δική σου ορμή σε οδηγεί μπροστά με ευκολία.",
      "Συνέχισε έτσι, βρίσκεσαι μέσα στην απόλυτη φυσική σου ροή!",
      "Σπουδαία επιμονή και διαύγεια. Μείνε συντονισμένος σε αυτή την ενέργεια!",
      "Το δυσκολότερο κομμάτι πέρασε. Τώρα όλα κυλούν αβίαστα.",
      "Εξαιρετική συγκέντρωση! Γλίστρησε όμορφα προς το τέλος."
    ],
    end: [
      "Σχεδόν τελείωσες! Απομένει μόνο μια μικρή, ευχάριστη τελική ευθεία.",
      "Λαμπρή προσπάθεια! Η γραμμή του τερματισμού λάμπει μπροστά σου.",
      "Εξαιρετική δουλειά, έμειναν μόνο ελάχιστες στιγμές εστίασης!",
      "Έφτασες σχεδόν στην κορυφή! Νιώσε την περηφάνια της επιτυχίας.",
      "Τελική πινελιά: ολοκλήρωσε αυτό το βήμα με χαμόγελο και ικανοποίηση!",
      "Τόσο κοντά στον στόχο σου. Απόλαυσε τη γλυκιά αίσθηση του επιτεύγματος!",
      "Φαινομενική αφοσίωση, το κατάφερες με τον καλύτερο τρόπο!",
      "Αξιοθαύμαστη αντοχή. Μπορείς να νιώθεις περήφανος για τη σημερινή σου μέρα."
    ],
    overdue: [
      "Ο χρόνος εστίασης ολοκληρώθηκε! Ώρα για ένα καλοδεχούμενο διάλειμμα.",
      "Πάρε μια βαθιά ανάσα και άφησε την ένταση. Έκανες σπουδαία δουλειά!",
      "Η συνεδρία σου τελείωσε. Χάρισε λίγη ξεκούραση στα μάτια και στο μυαλό σου.",
      "Τι θα έλεγες για ένα ποτήρι δροσερό νερό και λίγες διατάσεις;",
      "Πέτυχες πάρα πολλά σήμερα. Κάνε ένα βήμα πίσω και χαλάρωσε.",
      "Ώρα για μια όμορφη αλλαγή παραστάσεων. Συγχαρητήρια για την προσπάθεια!"
    ]
  }
};

// Kurze, herzliche Ansagen beim Start einer Fokus-Sitzung (für alle 6 Sprachen)
const SESSION_START_PHRASES = {
  en: [
    "Focus session started, {mins} minutes. Let's make it wonderful!",
    "{mins} minutes of peaceful focus begin now. Enjoy the flow!",
    "Timer running, {mins} minutes until your gentle break. Stay with it!",
    "Here we go! {mins} minutes of dedicated concentration. You've got this.",
    "A fresh {mins}-minute focus block is underway. Breathe and begin."
  ],
  de: [
    "Fokus-Sitzung gestartet, {mins} Minuten. Lass es uns wunderbar gestalten!",
    "{mins} Minuten entspannte Fokuszeit beginnen jetzt. Viel Freude im Flow!",
    "Timer läuft, {mins} Minuten bis zu deiner Pause. Bleib ganz ruhig dran!",
    "Auf geht's! {mins} Minuten volle, klare Konzentration. Du schaffst das.",
    "Ein frischer {mins}-Minuten Block läuft. Durchatmen und loslegen."
  ],
  fr: [
    "Session de focus démarrée, {mins} minutes. Faisons de belles choses !",
    "{mins} minutes de concentration sereine commencent maintenant. Bon flow !",
    "Minuteur lancé, {mins} minutes avant ta pause douceur. Tiens bon !",
    "C'est parti ! {mins} minutes de pleine attention. Tu gères cela à merveille.",
    "Un bloc de {mins} minutes commence. Respire et savoure l'instant."
  ],
  it: [
    "Sessione di focus avviata, {mins} minuti. Rendiamola speciale!",
    "Iniziano ora {mins} minuti di serena concentrazione. Buon lavoro nel flow!",
    "Timer avviato, {mins} minuti fino alla tua meritata pausa. Avanti così!",
    "Si parte! {mins} minuti di pura concentrazione. Sei pronto a dare il meglio.",
    "Un fresco blocco da {mins} minuti è iniziato. Respira e comincia con calma."
  ],
  es: [
    "Sesión de enfoque iniciada, {mins} minutos. ¡Hagamos magia hoy!",
    "Comienzan {mins} minutos de enfoque tranquilo. ¡Disfruta del flow!",
    "Temporizador en marcha, {mins} minutos hasta tu descanso. ¡Tú puedes!",
    "¡Allá vamos! {mins} minutos de concentración total. Lo harás genial.",
    "Un nuevo bloque de {mins} minutos está en marcha. Respira y adelante."
  ],
  el: [
    "Η συνεδρία εστίασης ξεκίνησε, {mins} λεπτά. Ας την κάνουμε υπέροχη!",
    "Ξεκινούν {mins} λεπτά γαλήνιας συγκέντρωσης. Απόλαυσε τη ροή σου!",
    "Το χρονόμετρο τρέχει, {mins} λεπτά μέχρι το διάλειμμα. Κράτα γερά!",
    "Πάμε δυνατά! {mins} λεπτά απόλυτης εστίασης. Μπορείς να τα καταφέρεις τέλεια.",
    "Ένα φρέσκο διάστημα {mins} λεπτών μόλις άρχισε. Πάρε ανάσα και ξεκίνα."
  ]
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
  if (!timerSoundEnabled || !timerRunning) return;
  
  let chosen;
  do {
    chosen = TIMER_AMBIENTS[Math.floor(Math.random() * TIMER_AMBIENTS.length)];
  } while (chosen === lastSelectedTimerAmbient && TIMER_AMBIENTS.length > 1);
  
  lastSelectedTimerAmbient = chosen;
  
  if (typeof playAmbientSound === 'function') {
    playAmbientSound(chosen, crossfade);
  }
}

// Caching der Systemstimmen & dynamisches Re-Loading
let cachedVoices = [];
function updateSpeechVoices() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices() || [];
  }
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  updateSpeechVoices();
  window.speechSynthesis.onvoiceschanged = updateSpeechVoices;
}

// Globale, hochqualitative Sprach-Synthese mit abwechselnden weiblichen, männlichen, kindlichen und motivierenden Profilen
function speakWithProfile(text, profileIndex = null) {
  if (!timerSoundEnabled) return;
  if (!('speechSynthesis' in window)) return;
  if (!text || typeof text !== 'string') return;

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();

    // 1. Text für organische menschliche Sprachmelodie, fließenden Rhythmus und natürliche Atempausen aufbereiten
    let naturalText = text
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}]/gu, '') // Emojis entfernen
      .replace(/^\s*\d+[\.\)\:]\s+/, '') // Nur echte Schrittnummern wie "1. ", "2) " entfernen, aber Mengenangaben wie "30 Sekunden" oder "1 Minute" behalten
      .replace(/^[•\-\*✓✔✕\+➔]+\s*/, '')
      .replace(/\s*([!?.])\s*/g, '$1 ') // Saubere Satzenden mit kleiner Atemluft
      .replace(/([,;:])\s*/g, '$1 ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!naturalText) naturalText = text;

    const utterance = new SpeechSynthesisUtterance(naturalText);
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';
    const langMap = { en: 'en-US', de: 'de-DE', es: 'es-ES', el: 'el-GR', fr: 'fr-FR', it: 'it-IT' };
    const targetLang = langMap[lang] || 'en-US';
    utterance.lang = targetLang;
    utterance.volume = 1.0;

    // 2. Stimmen-Persona deterministisch oder abwechselnd rotieren
    if (profileIndex === null || profileIndex === undefined) {
      profileIndex = globalVoiceTurnIndex++;
    }
    const profile = VOICE_PROFILES[Math.abs(profileIndex) % VOICE_PROFILES.length] || VOICE_PROFILES[0];

    utterance.rate = profile.rate || 0.96;
    utterance.pitch = profile.pitch || 1.0;

    // 3. Verfügbare Stimmen laden & nach Sprach-Code und Audio-Qualität filtern
    if (cachedVoices.length === 0) updateSpeechVoices();
    const allVoices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
    const langPrefix = targetLang.split('-')[0].toLowerCase();
    const matchingVoices = allVoices.filter(v => v.lang && v.lang.toLowerCase().replace('_', '-').startsWith(langPrefix));

    // Bevorzuge hochqualitative "Natural", "Neural", "Google", "Apple", "Premium", "Siri", "Enhanced" Stimmen
    const premiumVoices = matchingVoices.filter(v => 
      /natural|neural|online|google|siri|apple|premium|enhanced|wavenet/i.test(v.name)
    );

    const pool = premiumVoices.length > 0 ? premiumVoices : (matchingVoices.length > 0 ? matchingVoices : allVoices);

    const femaleKeywords = [
      'hedda', 'katja', 'anna', 'zira', 'petra', 'elena', 'hazel', 'susan', 'samantha', 'moira',
      'tessa', 'deutsch', 'female', 'julie', 'hortense', 'clara', 'paola', 'lucia', 'monica',
      'victoria', 'audrey', 'alice', 'federica', 'denise', 'jenny', 'sonia', 'isabella', 'athina',
      'elli', 'marta', 'laura', 'chiara', 'serena', 'ava', 'karen'
    ];
    const maleKeywords = [
      'stefan', 'yannick', 'markus', 'david', 'george', 'ravi', 'stefanos', 'male', 'paul',
      'henri', 'alvaro', 'jorge', 'cosimo', 'thomas', 'daniel', 'oliver', 'arthur', 'claude',
      'guy', 'diego', 'nestoras', 'nikos', 'paulino', 'matteo'
    ];

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
      // Kindlich / Lebhaft: Bevorzuge freundliche Stimme mit erhöhter Resonanz & Pitch
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

    const speakSessionToken = currentSpeechSessionId;
    const speakTimeout = setTimeout(() => {
      if (currentSpeechSessionId !== speakSessionToken) return;
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn("speechSynthesis.speak error:", err);
      }
    }, 50);
    if (typeof activeTimeouts !== 'undefined' && Array.isArray(activeTimeouts)) {
      activeTimeouts.push(speakTimeout);
    }
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

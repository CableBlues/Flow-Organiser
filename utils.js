
// Shuffler-Pools zur vollständigen Absicherung gegen Wiederholungen
let praisePool = [];
let soundPool = [];
let animationPool = [];

// Abgestuftes Lob-System (Skaliert mit dem Fortschritt des Tages)
// Merkt sich den zuletzt gezeigten Lob-Spruch, damit er nicht sofort wiederholt wird
let lastPraiseMsg = null;

const TIERED_PRAISES = {
  de: {
    // Stufe 1: Erster Einstieg (1 Aufgabe geschafft)
    tier1: [
      "Guter Start! Der Anfang ist gemacht. Weiter so!",
      "Schöner Einstieg! Schritt für Schritt geht es voran.",
      "Erster Schritt geschafft! Die Trägheit hat verloren.",
      "Klasse! Ein wunderbarer erster Haken heute.",
      "Sehr gut! Der erste Dominostein ist gefallen. Welcher kommt als nächstes?",
      "Ein schöner, ruhiger Anfang. Geh entspannt zur nächsten Aufgabe über.",
      "Der erste Haken sitzt. Atme kurz durch und bleib im Fluss!"
    ],
    // Stufe 2: Erste Dynamik (2 bis 4 Aufgaben geschafft)
    tier2: [
      "Du bist im Rhythmus! Dranbleiben lohnt sich.",
      "Klasse Fortschritt! Jede kleine Aufgabe summiert sich.",
      "Ganz stark! Du baust gerade richtig Schwung auf.",
      "Sehr fleißig! Spürst du, wie es im Kopf leichter wird?",
      "Wunderbar! Du machst heute tolle Fortschritte.",
      "Dein Fokus stabilisiert sich. Ein Schritt nach dem anderen!",
      "Sehr diszipliniert. Du hast das heute fest im Griff."
    ],
    // Stufe 3: Hohe Ausdauer (5 bis 8 Aufgaben geschafft)
    tier3: [
      "Richtig starker Fokus! Du ziehst das super durch.",
      "Klasse Leistung! Du hast heute schon richtig viel bewegt.",
      "Sehr ausdauernd! Dein Fokus ist heute wirklich bemerkenswert.",
      "Hut ab! Du beweist echtes Durchhaltevermögen.",
      "Großartig gemacht! Du bist voll in deinem Element.",
      "Dein Tag nimmt richtig Form an. Sehr inspirierend!",
      "Hervorragende Arbeit. Du meisterst deine To-Dos heute souverän."
    ],
    // Stufe 4: Meisterstufe (9+ Aufgaben geschafft)
    tier4: [
      "Sensationell! Du hast heute unglaublich viel geschafft.",
      "Einfach meisterhaft! Du darfst richtig stolz auf dich sein.",
      "Phänomenaler Tag! Dein Flow ist heute unaufhaltbar.",
      "Absolute Spitzenklasse! Gönn dir ruhig auch mal eine wohlverdiente Pause.",
      "Was für ein produktiver Tag! Du hast heute alles gegeben.",
      "Gigantische Leistung! Dein Kopf darf jetzt langsam in den Feierabend gehen.",
      "Das war weltklasse! Ein echter Triumph über deine To-Do-Liste."
    ]
  },
  en: {
    tier1: [
      "Great start! The beginning is made. Keep it up!",
      "Nice entry! Step by step, you are moving forward.",
      "First step achieved! Inertia has lost.",
      "Great! A wonderful first checkmark today.",
      "Very good! The first domino has fallen. Which one is next?",
      "A nice, calm start. Gently move on to your next task.",
      "The first task is checked. Take a breath and stay in your flow!"
    ],
    tier2: [
      "You are in the rhythm! Staying on track is paying off.",
      "Great progress! Every small task adds up.",
      "So strong! You are building real momentum right now.",
      "Excellent work! Do you feel your mind getting lighter?",
      "Wonderful! You are making great strides today.",
      "Your focus is stabilizing. One step at a time!",
      "Very disciplined. You have a firm grip on your day."
    ],
    tier3: [
      "Outstanding focus! You are pushing through beautifully.",
      "Splendid job! You've already moved so much today.",
      "Highly persistent! Your determination today is truly remarkable.",
      "Hats off! You are showing incredible willpower.",
      "Magnificently done! You are fully in your zone.",
      "Your day is shaping up beautifully. Highly inspiring!",
      "Superb work. You are mastering your to-dos with ease."
    ],
    tier4: [
      "Sensational! You have accomplished an incredible amount today.",
      "Simply masterful! You should be really proud of yourself.",
      "Phenomenal day! Your flow is absolutely unstoppable.",
      "Top-tier productivity! Feel free to treat yourself to a well-deserved break.",
      "What a productive day! You've given it your absolute all.",
      "Gigantic achievement! Your mind can slowly transition to rest now.",
      "That was world-class! A true triumph over your to-do list."
    ]
  },
  es: {
    tier1: [
      "¡Buen comienzo! El primer paso ya está dado. ¡Sigue así!",
      "¡Bonito inicio! Vas avanzando paso a paso.",
      "¡Primer paso conseguido! La inercia ha perdido.",
      "¡Genial! Una primera tarea marcada hoy.",
      "¡Muy bien! Ha caído la primera ficha de dominó. ¿Cuál sigue?",
      "Un comienzo tranquilo y agradable. Pasa relajado a la siguiente tarea.",
      "La primera tarea está lista. Respira hondo y mantén el ritmo."
    ],
    tier2: [
      "¡Estás en racha! Seguir así merece la pena.",
      "¡Gran progreso! Cada pequeña tarea suma.",
      "¡Qué fuerza! Estás ganando mucho impulso ahora mismo.",
      "¡Muy aplicado! ¿Notas cómo tu mente se siente más ligera?",
      "¡Maravilloso! Hoy estás avanzando de verdad.",
      "Tu enfoque se está estabilizando. ¡Un paso tras otro!",
      "Muy disciplinado. Hoy tienes el control total."
    ],
    tier3: [
      "¡Un enfoque realmente fuerte! Lo estás llevando genial.",
      "¡Gran rendimiento! Hoy ya has hecho muchísimo.",
      "¡Mucha constancia! Tu concentración de hoy es realmente notable.",
      "¡Chapó! Estás demostrando una gran fuerza de voluntad.",
      "¡Estupendamente hecho! Estás totalmente en tu elemento.",
      "Tu día está tomando muy buena forma. ¡Muy inspirador!",
      "Trabajo excelente. Estás dominando tus tareas hoy con soltura."
    ],
    tier4: [
      "¡Sensacional! Hoy has logrado una cantidad increíble.",
      "¡Simplemente magistral! Puedes estar muy orgulloso de ti.",
      "¡Día fenomenal! Tu flow hoy es imparable.",
      "¡Nivel absoluto! Date el gusto de una pausa bien merecida.",
      "¡Qué día tan productivo! Hoy has dado todo de ti.",
      "¡Logro gigantesco! Tu mente ya puede ir entrando en modo descanso.",
      "¡Eso fue de primer nivel! Un auténtico triunfo sobre tu lista de tareas."
    ]
  },
  el: {
    tier1: [
      "Καλή αρχή! Το πρώτο βήμα έγινε. Συνέχισε έτσι!",
      "Ωραία αρχή! Προχωράς βήμα βήμα.",
      "Πρώτο βήμα ολοκληρώθηκε! Η αδράνεια έχασε.",
      "Τέλεια! Ένα υπέροχο πρώτο τικ σήμερα.",
      "Πολύ καλά! Το πρώτο ντόμινο έπεσε. Ποιο είναι το επόμενο;",
      "Μια ήρεμη, ωραία αρχή. Πέρνα χαλαρά στην επόμενη εργασία.",
      "Το πρώτο τικ μπήκε. Πάρε μια ανάσα και μείνε στη ροή σου!"
    ],
    tier2: [
      "Είσαι μέσα στον ρυθμό! Αξίζει να συνεχίσεις.",
      "Υπέροχη πρόοδος! Κάθε μικρή εργασία προστίθεται.",
      "Πολύ δυνατά! Χτίζεις πραγματική φόρα αυτή τη στιγμή.",
      "Πολύ επιμελής! Νιώθεις πώς το μυαλό σου γίνεται πιο ελαφρύ;",
      "Υπέροχα! Κάνεις σήμερα εκπληκτική πρόοδο.",
      "Η εστίασή σου σταθεροποιείται. Ένα βήμα τη φορά!",
      "Πολύ πειθαρχημένος! Έχεις σήμερα τον απόλυτο έλεγχο."
    ],
    tier3: [
      "Πραγματικά δυνατή εστίαση! Το πας υπέροχα.",
      "Σπουδαία απόδοση! Έχεις ήδη κάνει πάρα πολλά σήμερα.",
      "Πολύ επίμονος! Η αποφασιστικότητά σου σήμερα είναι εντυπωσιακή.",
      "Μπράβο σου! Δείχνεις πραγματική δύναμη θέλησης.",
      "Υπέροχη δουλειά! Είσαι απόλυτα μέσα στο στοιχείο σου.",
      "Η μέρα σου παίρνει πολύ ωραία μορφή. Πολύ εμπνευστικό!",
      "Εξαιρετική δουλειά. Κατακτάς σήμερα τις εργασίες σου με άνεση."
    ],
    tier4: [
      "Εντυπωσιακό! Έχεις καταφέρει απίστευτα πολλά σήμερα.",
      "Απλά μαεστρικό! Μπορείς να είσαι πολύ περήφανος για σένα.",
      "Φαινομενική μέρα! Η ροή σου σήμερα είναι ασταμάτητη.",
      "Απόλυτη κορυφή! Χάρισε στον εαυτό σου ένα καλά αξιοποιημένο διάλειμμα.",
      "Τι παραγωγική μέρα! Έδωσες σήμερα τον καλύτερό σου εαυτό.",
      "Γιγάντια επίτευξη! Το μυαλό σου μπορεί τώρα σιγά σιγά να ξεκουραστεί.",
      "Αυτό ήταν παγκόσμιας κλάσης! Ένας πραγματικός θρίαμβος πάνω στη λίστα εργασιών σου."
    ]
  },
  fr: {
    tier1: [
      "Beau départ ! Le premier pas est fait. Continue comme ça !",
      "Joli début ! Tu avances pas à pas.",
      "Premier pas franchi ! L'inertie a perdu.",
      "Génial ! Une belle première tâche cochée aujourd'hui.",
      "Très bien ! Le premier domino est tombé. Lequel est le prochain ?",
      "Un début calme et agréable. Passe tranquillement à la tâche suivante.",
      "La première tâche est cochée. Respire un coup et reste dans ton élan !"
    ],
    tier2: [
      "Tu es dans le rythme ! Ça vaut le coup de continuer.",
      "Super progrès ! Chaque petite tâche s'additionne.",
      "Quelle force ! Tu prends vraiment de l'élan en ce moment.",
      "Très appliqué ! Tu sens ton esprit s'alléger ?",
      "Formidable ! Tu fais de vrais progrès aujourd'hui.",
      "Ta concentration se stabilise. Un pas après l'autre !",
      "Très discipliné. Tu maîtrises parfaitement ta journée."
    ],
    tier3: [
      "Une concentration vraiment forte ! Tu gères ça à merveille.",
      "Belle performance ! Tu as déjà accompli énormément aujourd'hui.",
      "Très persévérant ! Ta détermination aujourd'hui est vraiment remarquable.",
      "Chapeau bas ! Tu fais preuve d'une réelle force de volonté.",
      "Magnifiquement fait ! Tu es pleinement dans ton élément.",
      "Ta journée prend une belle forme. Très inspirant !",
      "Travail remarquable. Tu maîtrises tes tâches aujourd'hui avec brio."
    ],
    tier4: [
      "Sensationnel ! Tu as accompli une quantité incroyable aujourd'hui.",
      "Tout simplement magistral ! Tu peux être vraiment fier de toi.",
      "Journée phénoménale ! Ton flow est aujourd'hui totalement inarrêtable.",
      "Niveau absolu ! Offre-toi une pause bien méritée.",
      "Quelle journée productive ! Tu as tout donné aujourd'hui.",
      "Exploit gigantesque ! Ton esprit peut maintenant doucement passer en mode repos.",
      "C'était du grand art ! Un vrai triomphe sur ta liste de tâches."
    ]
  },
  it: {
    tier1: [
      "Ottimo inizio! Il primo passo è fatto. Continua così!",
      "Bell'inizio! Stai andando avanti passo dopo passo.",
      "Primo passo raggiunto! L'inerzia ha perso.",
      "Fantastico! Un primo bel segno di spunta oggi.",
      "Molto bene! È caduto il primo domino. Quale sarà il prossimo?",
      "Un inizio calmo e piacevole. Passa con serenità all'attività successiva.",
      "Il primo compito è spuntato. Fai un respiro e resta nel flusso!"
    ],
    tier2: [
      "Sei nel ritmo giusto! Vale la pena continuare così.",
      "Ottimo progresso! Ogni piccola attività fa la differenza.",
      "Che forza! Stai prendendo davvero slancio in questo momento.",
      "Molto diligente! Senti come la mente si alleggerisce?",
      "Meraviglioso! Oggi stai facendo grandi progressi.",
      "La tua concentrazione si sta stabilizzando. Un passo alla volta!",
      "Molto disciplinato. Oggi hai il pieno controllo della giornata."
    ],
    tier3: [
      "Una concentrazione davvero forte! Ce la stai facendo alla grande.",
      "Ottima prestazione! Hai già fatto tantissimo oggi.",
      "Molto costante! La tua determinazione oggi è davvero notevole.",
      "Tanto di cappello! Stai dimostrando una vera forza di volontà.",
      "Fatto magnificamente! Sei pienamente nel tuo elemento.",
      "La tua giornata sta prendendo una bella forma. Molto ispirante!",
      "Lavoro eccellente. Oggi domini le tue attività con grande scioltezza."
    ],
    tier4: [
      "Sensazionale! Oggi hai realizzato una quantità incredibile di cose.",
      "Semplicemente magistrale! Puoi essere davvero orgoglioso di te.",
      "Giornata fenomenale! Il tuo flow oggi è assolutamente inarrestabile.",
      "Livello assoluto! Concediti pure una pausa ben meritata.",
      "Che giornata produttiva! Oggi hai dato veramente il massimo.",
      "Impresa gigantesca! La tua mente può ora piano piano entrare in modalità riposo.",
      "Roba da fuoriclasse! Un vero trionfo sulla tua lista di cose da fare."
    ]
  }
};

// Hilfsfunktion: Liefert den nächsten nicht-wiederholenden Index
function getNextFromPool(poolArray, limit) {
  if (poolArray.length === 0) {
    for (let i = 0; i < limit; i++) poolArray.push(i);
    for (let i = poolArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [poolArray[i], poolArray[j]] = [poolArray[j], poolArray[i]];
    }
  }
  return poolArray.pop();
}

function showToast(msg) {
  const overlay = document.getElementById('toast-overlay');
  const card = document.getElementById('toast-card');
  if (card && overlay) {
    card.innerText = msg; overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.add('hidden'), 2200);
  }
}

// Integrierte performante Canvas-Konfetti-Engine
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#8b5cf6', '#38bdf8', '#10b981', '#ec4899', '#f59e0b', '#fb7185'];
  const particles = [];

  for (let i = 0; i < 110; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 22,
      vy: (Math.random() - 0.5) * 22 - 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    particles.forEach(p => {
      if (p.opacity > 0) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.45; 
        p.vx *= 0.98; 
        p.opacity -= 0.012;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        active = true;
      }
    });

    if (active) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  animate();
}

function showPraise() {
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'de';
  const todayISO = new Date().toISOString().split('T')[0];
  
  // Zähle die heute erledigten Aufgaben
  const completedToday = (state.done || []).filter(item => item.date === todayISO).length;
  
  // Bestimme die passende Stufe des Lobes
  let activeTier = 'tier1';
  if (completedToday >= 9) {
    activeTier = 'tier4';
  } else if (completedToday >= 5) {
    activeTier = 'tier3';
  } else if (completedToday >= 2) {
    activeTier = 'tier2';
  }
  
  const list = (TIERED_PRAISES[lang] || TIERED_PRAISES['de'])[activeTier];
  
  // Hole einen zufälligen Spruch aus der gewählten Stufe, ohne den zuletzt gezeigten sofort zu wiederholen
  let praiseIdx = Math.floor(Math.random() * list.length);
  if (list.length > 1) {
    while (list[praiseIdx] === lastPraiseMsg) {
      praiseIdx = Math.floor(Math.random() * list.length);
    }
  }
  const msg = list[praiseIdx];
  lastPraiseMsg = msg;

  const overlay = document.getElementById('praise-overlay');
  const card = document.getElementById('praise-card');
  if (card && overlay) {
    card.innerText = msg; overlay.classList.remove('hidden');
    card.style.animation = 'scaleBounce 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    
    // VERBESSERUNG: Bleibt nun 5000ms statt 2800ms auf dem Bildschirm
    setTimeout(() => overlay.classList.add('hidden'), 5000); 
  }

  if (typeof speakWithProfile === 'function') {
    const randomProfileIdx = Math.floor(Math.random() * 12);
    speakWithProfile(msg, randomProfileIdx);
  }

  const soundIdx = getNextFromPool(soundPool, 12);
  playProceduralSound(soundIdx);

  const animIdx = getNextFromPool(animationPool, 10);
  triggerPraiseAnimation(animIdx);
}

// Erzeugt 12 mathematisch unterschiedliche Belohnungsklänge über die Web Audio API
function playProceduralSound(idx = 0) {
  try {
    initAudioContext();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const ctx = audioCtx;

    const playNode = (freq, type, duration, delay = 0, vol = 0.08) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gainNode.gain.setValueAtTime(0, now + delay);
      gainNode.gain.linearRampToValueAtTime(vol, now + delay + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now + delay);
      osc.stop(now + delay + duration + 0.1);
    };

    switch (idx) {
      case 0: // 1. Ascending Major Arpeggio (C4 -> E4 -> G4 -> C5)
        playNode(261.63, 'sine', 0.6, 0);
        playNode(329.63, 'sine', 0.6, 0.07);
        playNode(392.00, 'sine', 0.6, 0.14);
        playNode(523.25, 'sine', 1.0, 0.21, 0.1);
        break;
      case 1: // 2. Kristallklare Resonanzglocke
        playNode(880, 'sine', 1.6, 0, 0.12);
        playNode(1320, 'sine', 0.9, 0.02, 0.04);
        break;
      case 2: // 3. Fanfare (Dreiklang-Swell)
        playNode(329.63, 'triangle', 1.2, 0, 0.06); 
        playNode(392.00, 'triangle', 1.2, 0, 0.06); 
        playNode(523.25, 'triangle', 1.2, 0, 0.06); 
        break;
      case 3: // 4. Bubbly Liquid POPs
        playNode(550, 'sine', 0.12, 0);
        playNode(780, 'sine', 0.10, 0.05);
        playNode(1050, 'sine', 0.08, 0.10);
        break;
      case 4: // 5. Cosmic Shimmer Sweep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.7);
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(320, now);
        filter.frequency.exponentialRampToValueAtTime(1600, now + 0.7);
        filter.Q.setValueAtTime(6, now);
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
        break;
      case 5: // 6. Jazz Major 7th Warm Swell
        playNode(196.00, 'sine', 1.8, 0, 0.1); 
        playNode(246.94, 'sine', 1.8, 0.04, 0.08); 
        playNode(293.66, 'sine', 1.8, 0.08, 0.06); 
        playNode(370.00, 'sine', 1.8, 0.12, 0.05); 
        break;
      case 6: // 7. Retro 8-bit Coin Up
        playNode(523.25, 'square', 0.08, 0, 0.04);
        playNode(1046.50, 'square', 0.35, 0.06, 0.04);
        break;
      case 7: // 8. Zen Wind Chimes
        playNode(1150, 'sine', 1.5, 0, 0.05);
        playNode(1350, 'sine', 1.3, 0.15, 0.04);
        playNode(1550, 'sine', 1.1, 0.3, 0.04);
        break;
      case 8: // 9. Bass Thump & Echo
        playNode(65.41, 'sine', 0.5, 0, 0.22); 
        playNode(130.81, 'sine', 0.8, 0.10, 0.08); 
        break;
      case 9: // 10. Harfen-Glissando (Fairy Harp)
        const harpScale = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
        harpScale.forEach((f, i) => {
          playNode(f, 'sine', 0.5, i * 0.04, 0.05);
        });
        break;
      case 10: // 11. Spring Jump Bounce (Boing-Modulator)
        const bOsc = ctx.createOscillator();
        const bGain = ctx.createGain();
        bOsc.type = 'triangle';
        bOsc.frequency.setValueAtTime(140, now);
        bOsc.frequency.linearRampToValueAtTime(420, now + 0.28);
        bOsc.frequency.linearRampToValueAtTime(95, now + 0.55);
        
        bGain.gain.setValueAtTime(0.1, now);
        bGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
        
        bOsc.connect(bGain);
        bGain.connect(ctx.destination);
        bOsc.start(now);
        bOsc.stop(now + 0.6);
        break;
      case 11: // 12. Tribal Woodblock Sequence
        playNode(440, 'triangle', 0.06, 0, 0.12);
        playNode(554, 'triangle', 0.06, 0.07, 0.10);
        playNode(659, 'triangle', 0.06, 0.14, 0.08);
        playNode(880, 'triangle', 0.10, 0.21, 0.12);
        break;
    }
  } catch (e) {
    console.error("Fehler beim prozeduralen Sound:", e);
  }
}

// Führt 10 verschiedene visuelle Belohnungs-Animationen aus
function triggerPraiseAnimation(idx) {
  switch (idx) {
    case 0: // 1. Konfetti-Explosion
      triggerConfetti();
      break;
    case 1: // 2. Intensiveres Bildschirmwackeln & Skalierungs-Pop
      document.body.classList.add('animate-screen-shake');
      document.body.style.transform = 'scale(1.025)';
      setTimeout(() => {
        document.body.classList.remove('animate-screen-shake');
        document.body.style.transform = 'none';
      }, 450);
      break;
    case 2: // 3. Randglühen-Flash (Full Overlay)
      const flash = document.createElement('div');
      flash.className = 'fixed inset-0 z-[190000] pointer-events-none animate-glow-flash';
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 1200);
      break;
    case 3: // 4. Floating Emoji Rain (Thumbs up / Popper)
      const emojis = ['👍', '🎉', '✔️', '🚀', '🔥', '💪', '🧠', '🎈', '🤩'];
      for (let i = 0; i < 16; i++) {
        const el = document.createElement('div');
        el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        el.className = 'fixed text-4xl z-[190000] pointer-events-none animate-float-item select-none';
        el.style.left = `${Math.random() * 90 + 5}vw`;
        el.style.animationDelay = `${Math.random() * 0.5}s`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3200);
      }
      break;
    case 4: // 5. Shimmering Dopamine Bubbles (Schillernde Blasen)
      for (let i = 0; i < 35; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'fixed rounded-full pointer-events-none z-[190000]';
        const size = Math.random() * 45 + 15;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6) 0%, rgba(168, 85, 247, 0.15) 40%, rgba(56, 189, 248, 0.45) 80%, rgba(255, 255, 255, 0) 100%)`;
        bubble.style.boxShadow = 'inset 0 0 12px rgba(255, 255, 255, 0.65), 0 4px 15px rgba(56, 189, 248, 0.25)';
        bubble.style.left = `${Math.random() * 100}vw`;
        bubble.style.bottom = `-60px`;
        
        const duration = Math.random() * 2.5 + 2.0;
        bubble.style.transition = `transform ${duration}s cubic-bezier(0.1, 0.8, 0.3, 1), opacity ${duration}s ease-out`;
        document.body.appendChild(bubble);
        
        requestAnimationFrame(() => {
          bubble.style.transform = `translateY(-${window.innerHeight + 120}px) translateX(${(Math.random() - 0.5) * 200}px) scale(1.4)`;
          bubble.style.opacity = '0';
        });
        
        setTimeout(() => bubble.remove(), duration * 1000);
      }
      break;
    case 5: // 6. Säulen-Sprung (Column Jump-Bounce)
      document.querySelectorAll('article').forEach(el => {
        el.classList.add('animate-spring-bounce');
        setTimeout(() => el.classList.remove('animate-spring-bounce'), 600);
      });
      break;
    case 6: // 7. Regenbogen-Fluss (Rainbow Sweep)
      const sweep = document.createElement('div');
      sweep.className = 'fixed inset-0 z-[190000] pointer-events-none animate-rainbow-sweep';
      document.body.appendChild(sweep);
      setTimeout(() => sweep.remove(), 1400);
      break;
    case 7: // 8. Sternschnuppen-Staub (Meteor-Shower)
      for (let i = 0; i < 22; i++) {
        const spark = document.createElement('div');
        spark.className = 'fixed w-2 h-2 rounded-full z-[190000] pointer-events-none animate-dust';
        spark.style.backgroundColor = i % 2 === 0 ? '#10b981' : '#a855f7';
        spark.style.left = `${Math.random() * 100}vw`;
        spark.style.top = `0px`;
        spark.style.animationDelay = `${Math.random() * 0.4}s`;
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 1500);
      }
      break;
    case 8: // 9. Floating Text Pop (Schwebender Fokus-Ausruf)
      const pop = document.createElement('div');
      const words = tr({ de: ["KLASSE!", "FLOW!", "PRODUKTIV!", "FOKUS!", "STARK!"], en: ["GREAT!", "FLOW!", "DOPAMINE!", "FOCUS!", "BOOM!"], es: ["GENIAL!", "FLOW!", "PRODUCTIVO!", "ENFOQUE!", "FUERTE!"], el: ["ΤΕΛΕΙΑ!", "FLOW!", "ΠΑΡΑΓΩΓΙΚΟΣ!", "ΕΣΤΙΑΣΗ!", "ΔΥΝΑΤΑ!"], fr: ["GÉNIAL!", "FLOW!", "PRODUCTIF!", "FOCUS!", "FORT!"], it: ["FANTASTICO!", "FLOW!", "PRODUTTIVO!", "FOCUS!", "FORTE!"] });
      pop.innerText = words[Math.floor(Math.random() * words.length)];
      pop.className = 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl md:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 z-[190000] pointer-events-none scale-0 opacity-0 transition-all duration-700 select-none';
      pop.style.textShadow = '0 10px 30px rgba(139,92,246,0.3)';
      document.body.appendChild(pop);
      requestAnimationFrame(() => {
        pop.style.transform = 'translate(-50%, -85%) scale(1.2)';
        pop.style.opacity = '1';
      });
      setTimeout(() => {
        pop.style.opacity = '0';
        setTimeout(() => pop.remove(), 700);
      }, 1100);
      break;
    case 9: // 10. Diagonal Lens Flare Sweep (Laser-Blitz)
      const flare = document.createElement('div');
      flare.className = 'fixed inset-0 z-[190000] pointer-events-none bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full transition-transform duration-700 ease-out';
      document.body.appendChild(flare);
      requestAnimationFrame(() => {
        flare.style.transform = 'translateX(200%)';
      });
      setTimeout(() => flare.remove(), 800);
      break;
  }
}

function renderMiniCalendar() {
  const grid = document.getElementById('cal-days-grid');
  const title = document.getElementById('cal-month-title');
  if (!grid || !title) return;

  grid.innerHTML = '';
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const locales = { de: 'de-DE', en: 'en-US', el: 'el-GR', es: 'es-ES', fr: 'fr-FR', it: 'it-IT' };
  const monthName = new Intl.DateTimeFormat(locales[currentLang] || 'en-US', { month: 'long', year: 'numeric' }).format(now);
  title.innerText = monthName;

  const firstDayOfMonth = new Date(year, month, 1);
  let firstDayIndex = firstDayOfMonth.getDay();
  firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDayIndex; i++) {
    const empty = document.createElement('span');
    empty.className = 'text-transparent select-none pointer-events-none';
    empty.innerText = '';
    grid.appendChild(empty);
  }

  const todayDate = now.getDate();
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();

  for (let day = 1; day <= daysInMonth; day++) {
    const daySpan = document.createElement('span');
    daySpan.innerText = day;
    
    const isToday = day === todayDate && month === todayMonth && year === todayYear;
    if (isToday) {
      daySpan.className = 'flex items-center justify-center h-5 w-5 bg-[var(--accent)] text-white font-bold rounded-lg shadow-[0_0_8px_rgba(139,92,246,0.5)] border border-[var(--accent-light)]/20 animate-pulse';
    } else {
      daySpan.className = 'flex items-center justify-center h-5 w-5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-all duration-150';
    }
    
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayAppointments = (state.items && state.items.termine) 
      ? state.items.termine.filter(t => t.date === dateStr) 
      : [];
      
    if (dayAppointments.length > 0) {
      daySpan.className += ' border border-amber-400/40 relative shadow-[0_0_10px_rgba(245,158,11,0.15)]';
      
      const dot = document.createElement('span');
      dot.className = 'absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_4px_rgba(245,158,11,0.8)] animate-pulse';
      daySpan.appendChild(dot);
    }

    // Tooltip-Beschriftung: Standardhinweis plus optionale Terminliste, falls vorhanden
    const tooltipAction = tr({ de: "Auf ein Datum klicken, um einen Termin einzutragen", en: "Click on a date to enter an appointment", es: "Haz clic en una fecha para añadir una cita", el: "Κάνε κλικ σε μια ημερομηνία για να καταχωρήσεις ραντεβού", fr: "Clique sur une date pour ajouter un rendez-vous", it: "Clicca su una data per inserire un appuntamento" });

    if (dayAppointments.length > 0) {
      const listStr = dayAppointments.map(t => {
        let loc = t.location ? ` (@ ${t.location})` : '';
        return `${t.time || 'Ganztägig'} · ${t.task}${loc}`;
      }).join('\n');
      daySpan.title = `${tooltipAction}\n\nTermine:\n${listStr}`;
    } else {
      daySpan.title = tooltipAction;
    }

    // Interaktiver Klick-Listener: Öffnet direkt das integrierte Formular
    daySpan.onclick = (e) => {
      e.stopPropagation();
      if (typeof toggleTerminForm === 'function') {
        toggleTerminForm(true, dateStr);
      }
    };
    
    grid.appendChild(daySpan);
  }
}

function updateDateAndStreak() {
  const locales = { de: 'de-DE', en: 'en-GB', el: 'el-GR', es: 'es-ES', fr: 'fr-FR', it: 'it-IT' };
  try {
    const str = new Intl.DateTimeFormat(locales[currentLang] || 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
    const displayEl = document.getElementById('date-display');
    if (displayEl) displayEl.innerText = str;
  } catch (e) {
    const displayEl = document.getElementById('date-display');
    if (displayEl) displayEl.innerText = new Date().toLocaleDateString();
  }

  renderMiniCalendar();
} 

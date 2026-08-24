// helper-clarity.js: Intelligentes Werkzeug für Klarheit, Impulskontrolle & gesunde Gewohnheiten
let clarityUrgeInterval = null;
let clarityUrgeSecondsLeft = 90;
let clarityUrgeTotalSeconds = 90;
let clarityUrgeRunning = false;

function getClarityState() {
  if (!state.clarity) {
    state.clarity = {
      streakDays: 0,
      lastCheckinDate: null,
      history: [],
      savedReasons: []
    };
  }
  return state.clarity;
}

function openClarityModal() {
  const modal = document.getElementById('clarity-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  switchClarityTab('urge');
  updateClarityStreakUI();
  if (typeof playProceduralSound === 'function') playProceduralSound(0);
}

function closeClarityModal() {
  const modal = document.getElementById('clarity-modal');
  if (modal) modal.classList.add('hidden');
  stopClarityUrgeTimer();
}

function switchClarityTab(tabName) {
  const tabs = ['urge', 'halt', 'shift', 'future', 'tracker'];
  tabs.forEach(t => {
    const pane = document.getElementById(`clarity-pane-${t}`);
    const btn = document.getElementById(`clarity-tab-${t}`);
    if (pane) {
      if (t === tabName) pane.classList.remove('hidden');
      else pane.classList.add('hidden');
    }
    if (btn) {
      if (t === tabName) {
        btn.classList.add('bg-teal-500/20', 'text-teal-300', 'border-teal-500/40');
        btn.classList.remove('text-gray-400', 'border-transparent');
      } else {
        btn.classList.remove('bg-teal-500/20', 'text-teal-300', 'border-teal-500/40');
        btn.classList.add('text-gray-400', 'border-transparent');
      }
    }
  });

  if (tabName === 'tracker') {
    updateClarityStreakUI();
  }
}

// -------------------------------------------------------------
// MODUL 1: URGE SURFING (90-SEKUNDEN WELLE)
// -------------------------------------------------------------
const URGE_PHRASES = {
  en: [
    "Notice the sensation without judgment. You are the ocean, not the wave.",
    "Breathe slowly. In for 4 seconds, hold for 2, out for 6.",
    "The peak is passing. Cravings are temporary neurochemical signals.",
    "You are in complete control of your actions. Stay grounded.",
    "Almost there. Feel the tension naturally melting away."
  ],
  de: [
    "Nimm das Verlangen wahr, ohne zu urteilen. Du bist der Ozean, nicht die Welle.",
    "Atme ruhig. 4 Sekunden ein, 2 Sekunden halten, 6 Sekunden aus.",
    "Der Scheitelpunkt zieht vorüber. Dieser Drang ist nur ein chemisches Signal.",
    "Du hast die volle Kontrolle über dein Handeln. Bleib bei dir.",
    "Fast geschafft. Spüre, wie die Anspannung ganz von allein nachlässt."
  ],
  fr: [
    "Observe la sensation sans jugement. Tu es l'océan, pas la vague.",
    "Respire calmement : 4 secondes d'inspiration, 2 de pause, 6 d'expiration.",
    "Le pic s'estompe. Cette envie n'est qu'un signal passager.",
    "Tu as le plein contrôle de tes choix. Reste ancré.",
    "Presque terminé. Ressens la tension qui s'évacue naturellement."
  ],
  it: [
    "Osserva la sensazione senza giudizio. Tu sei l'oceano, non l'onda.",
    "Respira con calma : 4 secondi dentro, 2 trattieni, 6 fuori.",
    "Il picco sta passando. Questo impulso è solo un segnale temporaneo.",
    "Sei tu ad avere il pieno controllo delle tue azioni.",
    "Quasi fatto. Senti la tensione che si dissolve dolcemente."
  ],
  es: [
    "Observa la sensación sin juzgar. Eres el océano, no la ola.",
    "Respira hondo : 4 segundos dentro, 2 mantén, 6 fuera.",
    "El pico está pasando. Este impulso es solo una señal pasajera.",
    "Tienes el control total de tus decisiones. Mantente presente.",
    "Casi terminado. Siente cómo la tensión se disuelve sola."
  ],
  el: [
    "Παρατήρησε την αίσθηση χωρίς κριτική. Είσαι ο ωκεανός, όχι το κύμα.",
    "Ανάπνευσε ήρεμα : 4 δευτερόλεπτα εισπνοή, 2 κράτημα, 6 εκπνοή.",
    "Η κορύφωση υποχωρεί. Αυτή η παρόρμηση είναι απλώς ένα παροδικό σήμα.",
    "Έχεις τον απόλυτο έλεγχο των πράξεών σου.",
    "Σχεδόν τα κατάφερες. Νιώσε την ένταση να φεύγει φυσικά."
  ]
};

function toggleClarityUrgeTimer() {
  if (clarityUrgeRunning) {
    stopClarityUrgeTimer();
  } else {
    startClarityUrgeTimer();
  }
}

function startClarityUrgeTimer() {
  clarityUrgeRunning = true;
  clarityUrgeSecondsLeft = 90;
  clarityUrgeTotalSeconds = 90;

  const btn = document.getElementById('clarity-urge-toggle-btn');
  if (btn) {
    btn.innerHTML = `<i data-lucide="square" class="w-4 h-4"></i> <span>${tr({ en: 'Stop Wave', de: 'Welle anhalten', fr: 'Arrêter la vague', it: 'Ferma onda', es: 'Detener ola', el: 'Διακοπή κύματος' })}</span>`;
    btn.classList.add('bg-red-500/20', 'text-red-300', 'border-red-500/40');
    btn.classList.remove('bg-teal-500', 'text-black');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  updateUrgeDisplay();

  const phraseList = URGE_PHRASES[currentLang] || URGE_PHRASES.en;
  const initialText = phraseList[0];
  const phraseEl = document.getElementById('clarity-urge-phrase');
  if (phraseEl) phraseEl.innerText = initialText;

  if (typeof speakWithProfile === 'function') {
    speakWithProfile(initialText);
  }

  clearInterval(clarityUrgeInterval);
  clarityUrgeInterval = setInterval(() => {
    clarityUrgeSecondsLeft--;
    updateUrgeDisplay();

    // Dynamischer Zuspruch alle 20 Sekunden
    if (clarityUrgeSecondsLeft % 20 === 0 && clarityUrgeSecondsLeft > 0) {
      const idx = Math.floor((90 - clarityUrgeSecondsLeft) / 20) % phraseList.length;
      const text = phraseList[idx];
      if (phraseEl) phraseEl.innerText = text;
      if (typeof speakWithProfile === 'function') {
        speakWithProfile(text);
      }
    }

    if (clarityUrgeSecondsLeft <= 0) {
      stopClarityUrgeTimer();
      onUrgeSurfingComplete();
    }
  }, 1000);
}

function stopClarityUrgeTimer() {
  clarityUrgeRunning = false;
  clearInterval(clarityUrgeInterval);
  const btn = document.getElementById('clarity-urge-toggle-btn');
  if (btn) {
    btn.innerHTML = `<i data-lucide="play" class="w-4 h-4"></i> <span>${tr({ en: 'Ride the 90s Wave 🌊', de: '90s Welle reiten 🌊', fr: 'Surfer la vague 90s 🌊', it: 'Cavalca l\'onda di 90s 🌊', es: 'Surfear la ola de 90s 🌊', el: 'Δαμάστε το κύμα 90δ 🌊' })}</span>`;
    btn.classList.remove('bg-red-500/20', 'text-red-300', 'border-red-500/40');
    btn.classList.add('bg-teal-500', 'text-black');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

function updateUrgeDisplay() {
  const timeEl = document.getElementById('clarity-urge-time');
  const barEl = document.getElementById('clarity-urge-bar');
  const breathEl = document.getElementById('clarity-urge-breath-guide');
  if (timeEl) {
    const mins = Math.floor(clarityUrgeSecondsLeft / 60);
    const secs = clarityUrgeSecondsLeft % 60;
    timeEl.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  if (barEl) {
    const pct = ((clarityUrgeTotalSeconds - clarityUrgeSecondsLeft) / clarityUrgeTotalSeconds) * 100;
    barEl.style.width = `${pct}%`;
  }

  // 12-Sekunden Atem-Zyklus (4s Einatmen, 2s Halten, 6s Ausatmen)
  if (breathEl) {
    const cycle = (90 - clarityUrgeSecondsLeft) % 12;
    if (cycle < 4) {
      breathEl.innerText = tr({ en: '💨 Inhale slowly (4s)...', de: '💨 Langsam einatmen (4s)...', fr: '💨 Inspire lentement (4s)...', it: '💨 Inspira lentamente (4s)...', es: '💨 Inhala despacio (4s)...', el: '💨 Εισπνεύστε αργά (4δ)...' });
      breathEl.className = 'text-xs font-bold text-teal-300 transition-colors animate-pulse';
    } else if (cycle < 6) {
      breathEl.innerText = tr({ en: '⏸️ Hold gently (2s)...', de: '⏸️ Sanft halten (2s)...', fr: '⏸️ Maintiens doucement (2s)...', it: '⏸️ Trattieni (2s)...', es: '⏸️ Mantén (2s)...', el: '⏸️ Κράτημα (2δ)...' });
      breathEl.className = 'text-xs font-bold text-cyan-300 transition-colors';
    } else {
      breathEl.innerText = tr({ en: '🌊 Exhale completely (6s)...', de: '🌊 Vollständig ausatmen (6s)...', fr: '🌊 Expire profondément (6s)...', it: '🌊 Espira a fondo (6s)...', es: '🌊 Exhala por completo (6s)...', el: '🌊 Εκπνεύστε πλήρως (6δ)...' });
      breathEl.className = 'text-xs font-bold text-emerald-300 transition-colors';
    }
  }
}

function onUrgeSurfingComplete() {
  const phraseEl = document.getElementById('clarity-urge-phrase');
  const winMsg = tr({
    en: "🎉 Outstanding victory! The neurological wave has passed. You chose clarity.",
    de: "🎉 Großartiger Sieg! Die neurologische Welle ist vorübergezogen. Du hast dich für Klarheit entschieden.",
    fr: "🎉 Victoire remarquable ! La vague est passée. Tu as choisi la clarté.",
    it: "🎉 Vittoria straordinaria! L'onda è passata. Hai scelto la chiarezza.",
    es: "🎉 ¡Victoria sobresaliente! La ola ha pasado. Elegiste la claridad.",
    el: "🎉 Εξαιρετική νίκη! Το κύμα πέρασε. Επέλεξες τη διαύγεια."
  });
  if (phraseEl) phraseEl.innerText = winMsg;
  if (typeof speakWithProfile === 'function') speakWithProfile(winMsg);
  if (typeof triggerCelebration === 'function') triggerCelebration();
  showToast(tr({
    en: "Wave surmounted! +50 XP Clarity 🌟",
    de: "Welle gemeistert! +50 XP Klarheit 🌟",
    fr: "Vague surmontée ! +50 XP Clarté 🌟",
    it: "Onda superata! +50 XP Chiarezza 🌟",
    es: "¡Ola superada! +50 XP Claridad 🌟",
    el: "Το κύμα ξεπεράστηκε! +50 XP 🌟"
  }));
}

// -------------------------------------------------------------
// MODUL 2: HALT-CHECK (BEDÜRFNIS-DIAGNOSE)
// -------------------------------------------------------------
const HALT_DATA = {
  hungry: {
    icon: 'utensils',
    color: 'amber',
    title: { en: 'Hungry (Low Blood Sugar)', de: 'Hunger (Unterzuckert / Energiemangel)', fr: 'Faim (Baisse d\'énergie)', it: 'Fame (Calo di zuccheri)', es: 'Hambre (Baja glucosa)', el: 'Πείνα (Χαμηλή ενέργεια)' },
    insight: {
      en: 'When blood sugar drops, the brain seeks instant high-dopamine stimulation. Your body might just need real fuel.',
      de: 'Bei sinkendem Blutzucker sucht das Gehirn nach schnellem Belohnungs-Dopamin. Dein Körper braucht gerade schlicht echte Energie.',
      fr: 'En hypoglycémie, le cerveau réclame de la dopamine immédiate. Ton corps a simplement besoin de vrai carburant.',
      it: 'Con il calo di zuccheri, il cervello cerca gratificazione immediata. Il corpo ha solo bisogno di nutrimento.',
      es: 'Con la bajada de azúcar, el cerebro busca dopamina rápida. Tu cuerpo solo necesita nutrientes reales.',
      el: 'Όταν πέφτει το σάκχαρο, ο εγκέφαλος αναζητά άμεση ντοπαμίνη. Το σώμα σου χρειάζεται πραγματική τροφή.'
    },
    action: {
      en: '👉 Action: Drink a large glass of water and eat a healthy snack (nuts, fruit, or a balanced meal) right now.',
      de: '👉 Sofort-Aktion: Trinke ein großes Glas Wasser und iss einen nahrhaften Snack (Nüsse, Obst oder eine Mahlzeit).',
      fr: '👉 Action immédiate : Bois un grand verre d\'eau et prends un encas sain (fruits, noix ou repas).',
      it: '👉 Azione immediata : Bevi un bicchiere d\'acqua e mangia uno spuntino sano (frutta secca o pasto).',
      es: '👉 Acción inmediata : Bebe un vaso de agua y toma un snack saludable (frutos secos, fruta o comida).',
      el: '👉 Άμεση δράση : Πιες ένα μεγάλο ποτήρι νερό και φάε ένα υγιεινό σνακ.'
    }
  },
  angry: {
    icon: 'flame',
    color: 'rose',
    title: { en: 'Angry / Frustrated / Stressed', de: 'Wut / Frust / Akuter Stress', fr: 'Colère / Frustration / Stress', it: 'Rabbia / Frustrazione / Stress', es: 'Rabia / Frustración / Estrés', el: 'Θυμός / Απογοήτευση / Στρες' },
    insight: {
      en: 'The impulse is acting as an escape valve to numb unpleasant emotional tension or feeling overwhelmed.',
      de: 'Der Drang fungiert als Fluchtventil, um unangenehme Spannungen oder Überforderung kurzfristig zu betäuben.',
      fr: 'L\'envie sert de soupape d\'échappement pour anesthésier une tension émotionnelle ou une surcharge.',
      it: 'L\'impulso agisce come valvola di sfogo per anestetizzare tensioni spiacevoli o stress.',
      es: 'El impulso actúa como válvula de escape para adormecer el estrés o la frustración.',
      el: 'Η παρόρμηση λειτουργεί ως βαλβίδα διαφυγής για να μουδιάσει τη συναισθηματική ένταση.'
    },
    action: {
      en: '👉 Action: Do 15 vigorous push-ups/squats or write down the exact frustration on paper and tear it up.',
      de: '👉 Sofort-Aktion: Mache 15 intensive Kniebeugen/Liegestütze oder schreibe den Ärger ungefiltert auf einen Zettel und zerreiß ihn.',
      fr: '👉 Action immédiate : Fais 15 squats vigoureux ou écris ta frustration sur papier puis déchire-la.',
      it: '👉 Azione immediata : Fai 15 piegamenti o scrivi la frustrazione su un foglio e strappalo.',
      es: '👉 Acción inmediata : Haz 15 sentadillas o escribe tu frustración en un papel y rómpelo.',
      el: '👉 Άμεση δράση : Κάνε 15 καθίσματα ή γράψε τον θυμό σου σε ένα χαρτί και σκίσε το.'
    }
  },
  lonely: {
    icon: 'heart-crack',
    color: 'purple',
    title: { en: 'Lonely / Bored / Disconnected', de: 'Einsamkeit / Langeweile / Unterstimulation', fr: 'Solitude / Ennui / Sous-stimulation', it: 'Solitudine / Noia / Mancanza di stimoli', es: 'Soledad / Aburrimiento / Falta de estímulo', el: 'Μοναξιά / Ανία / Έλλειψη ερεθίσματος' },
    insight: {
      en: 'Your brain is craving connection or stimulation. Unhealthy habits pretend to fill this void with artificial spikes.',
      de: 'Dein Gehirn sucht nach emotionaler Nähe oder Sinn. Schädliche Gewohnheiten täuschen diese Verbindung nur vor.',
      fr: 'Ton cerveau recherche de la connexion ou du sens. Les mauvaises habitudes ne font qu\'imiter artificiellement ce lien.',
      it: 'Il cervello cerca connessione o stimoli. Le cattive abitudini simulano solo una falsa gratificazione.',
      es: 'Tu cerebro busca conexión o sentido. Los malos hábitos solo imitan artificialmente esa necesidad.',
      el: 'Ο εγκέφαλός σου αναζητά επαφή ή νόημα. Οι βλαβερές συνήθειες προσφέρουν μόνο τεχνητά υποκατάστατα.'
    },
    action: {
      en: '👉 Action: Send a genuine kind message to a friend, step outside for fresh air, or put on uplifting music.',
      de: '👉 Sofort-Aktion: Schicke einer befreundeten Person eine nette kurze Nachricht oder gehe für 5 Minuten an die frische Luft.',
      fr: '👉 Action immédiate : Envoie un message bienveillant à un ami ou sors prendre l\'air 5 minutes.',
      it: '👉 Azione immediata : Manda un messaggio affettuoso a un amico o esci 5 minuti all\'aria aperta.',
      es: '👉 Acción inmediata : Envía un mensaje amable a un amigo o sal 5 minutos a tomar aire fresco.',
      el: '👉 Άμεση δράση : Στείλε ένα ευγενικό μήνυμα σε έναν φίλο ή βγες για 5 λεπτά έξω.'
    }
  },
  tired: {
    icon: 'moon',
    color: 'blue',
    title: { en: 'Tired / Mentally Drained', de: 'Müdigkeit / Mentale Erschöpfung', fr: 'Fatigue / Épuisement mental', it: 'Stanchezza / Sovraffaticamento', es: 'Cansancio / Agotamiento mental', el: 'Κούραση / Πνευματική εξάντληση' },
    insight: {
      en: 'When your prefrontal cortex is exhausted, self-regulation drops drastically. Your body is screaming for rest.',
      de: 'Wenn der präfrontale Kortex erschöpft ist, sinkt die Selbstkontrolle rapide. Dein Körper verlangt echte Erholung.',
      fr: 'Quand le cerveau est épuisé, l\'autodiscipline s\'effondre. Ton corps a besoin d\'un vrai repos.',
      it: 'Quando la mente è esausta, l\'autocontrollo crolla. Il tuo corpo ha solo bisogno di riposo vero.',
      es: 'Con el cerebro agotado, la fuerza de voluntad cae en picado. Tu cuerpo pide descanso auténtico.',
      el: 'Όταν το μυαλό είναι εξαντλημένο, η αυτοσυγκράτηση μειώνεται. Το σώμα σου ζητά αληθινή ανάπαυση.'
    },
    action: {
      en: '👉 Action: Lay down with your eyes closed for a 10-minute power rest, wash your face with cool water, or go to sleep.',
      de: '👉 Sofort-Aktion: Lege dich 10 Minuten ohne Bildschirm hin, wasche dein Gesicht mit kaltem Wasser oder gehe schlafen.',
      fr: '👉 Action immédiate : Allonge-toi 10 min les yeux fermés sans écran, rince ton visage à l\'eau fraîche ou dors.',
      it: '👉 Azione immediata : Sdraiati 10 minuti a occhi chiusi senza schermi o rinfrescati il viso.',
      es: '👉 Acción inmediata : Túmbate 10 min con los ojos cerrados sin pantallas o lávate la cara con agua fresca.',
      el: '👉 Άμεση δράση : Ξάπλωσε για 10 λεπτά με κλειστά μάτια χωρίς οθόνη ή πλύνε το πρόσωπό σου με δροσερό νερό.'
    }
  }
};

function selectHaltCategory(key) {
  const item = HALT_DATA[key];
  if (!item) return;

  const resBox = document.getElementById('clarity-halt-result');
  if (!resBox) return;

  const title = item.title[currentLang] || item.title.en;
  const insight = item.insight[currentLang] || item.insight.en;
  const action = item.action[currentLang] || item.action.en;

  resBox.innerHTML = `
    <div class="p-3 bg-white/[0.03] border border-teal-500/30 rounded-xl space-y-2 text-left animate-fade-in">
      <div class="flex items-center gap-2 font-bold text-xs text-teal-300">
        <i data-lucide="${item.icon}" class="w-4 h-4 text-teal-400"></i>
        <span>${title}</span>
      </div>
      <p class="text-[11px] text-gray-300 leading-relaxed">${insight}</p>
      <div class="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-lg text-xs font-semibold text-teal-200">
        ${action}
      </div>
    </div>
  `;
  resBox.classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// -------------------------------------------------------------
// MODUL 3: DOPAMIN-SHIFT & GESUNDE ERSATZHANDLUNGEN
// -------------------------------------------------------------
const SHIFT_ACTIVITIES = [
  {
    icon: 'snowflake',
    title: { en: 'Cold Face Splash (Mammalian Dive Reflex)', de: 'Kaltwasser-Reiz (Tauchreflex)', fr: 'Eau glacée sur le visage', it: 'Acqua fredda sul viso', es: 'Agua fría en el rostro', el: 'Κρύο νερό στο πρόσωπο' },
    desc: {
      en: 'Splash ice-cold water onto your face for 20 seconds. This instantly activates the vagus nerve and lowers heart rate.',
      de: 'Wasche dein Gesicht 20 Sekunden mit eiskaltem Wasser. Das aktiviert den Vagusnerv und senkt die Erregung sofort.',
      fr: 'Passe de l\'eau glacée sur ton visage pendant 20s. Cela stimule le nerf vague et calme le rythme cardiaque.',
      it: 'Bagna il viso con acqua ghiacciata per 20s. Attiva il nervo vago e riduce subito l\'eccitazione.',
      es: 'Échate agua helada en la cara durante 20s. Estimula el nervio vago y calma el pulso al instante.',
      el: 'Βρέξε το πρόσωπό σου με παγωμένο νερό για 20δ. Ηρεμεί άμεσα το νευρικό σύστημα.'
    }
  },
  {
    icon: 'activity',
    title: { en: '20 Fast Bodyweight Reps', de: '20 schnelle Kniebeugen oder Hampelmänner', fr: '20 squats ou jumping jacks', it: '20 squat veloci o jumping jack', es: '20 sentadillas o saltos', el: '20 γρήγορα καθίσματα' },
    desc: {
      en: 'Burn off the restless physical tension immediately through quick, natural exertion.',
      de: 'Baue die rastlose nervliche Energie direkt durch kurze, intensive Muskelarbeit ab.',
      fr: 'Évacue la tension nerveuse immédiatement grâce à un effort musculaire court et franc.',
      it: 'Scarica la tensione nervosa con un breve sforzo muscolare intenso.',
      es: 'Quema la inquietud física de inmediato con un esfuerzo muscular breve.',
      el: 'Εκτονώστε τη νευρική ενέργεια με μια σύντομη έντονη κίνηση.'
    }
  },
  {
    icon: 'smartphone',
    title: { en: 'Physical Separation (Device in other room)', de: 'Räumliche Trennung (Handy in anderes Zimmer)', fr: 'Séparation physique (Téléphone ailleurs)', it: 'Separazione fisica (Telefono altrove)', es: 'Distancia física (Móvil en otra habitación)', el: 'Απομάκρυνση συσκευής σε άλλο δωμάτιο' },
    desc: {
      en: 'Stand up immediately. Place your phone or laptop in another room and step away for 10 minutes.',
      de: 'Stehe sofort auf. Lege dein Handy/Gerät in einen anderen Raum und verlasse den Platz für 10 Minuten.',
      fr: 'Lève-toi tout de suite. Dépose ton appareil dans une autre pièce et éloigne-toi 10 minutes.',
      it: 'Alzati subito. Metti il telefono in un\'altra stanza e allontanati per 10 minuti.',
      es: 'Levántate de inmediato. Deja el dispositivo en otra habitación y aléjate 10 minutos.',
      el: 'Σηκώσου αμέσως. Άφησε τη συσκευή σε άλλο δωμάτιο για 10 λεπτά.'
    }
  },
  {
    icon: 'droplets',
    title: { en: 'Mindful Glass of Water', de: 'Ein großes Glas Wasser in Ruhe trinken', fr: 'Un grand verre d\'eau en pleine conscience', it: 'Un bicchiere d\'acqua con calma', es: 'Un vaso de agua despacio', el: 'Ένα μεγάλο ποτήρι νερό με ηρεμία' },
    desc: {
      en: 'Drink a full glass of cool water in slow, intentional sips. Feel the temperature and hydration.',
      de: 'Trinke ein volles Glas kühles Wasser in langsamen, bewussten Schlucken. Spüre die Frische.',
      fr: 'Bois un grand verre d\'eau fraîche en petites gorgées lentes. Ressens l\'hydratation.',
      it: 'Bevi un bicchiere d\'acqua fresca a piccoli sorsi lenti.',
      es: 'Bebe un vaso de agua fresca a sorbos lentos y conscientes.',
      el: 'Πιες ένα ποτήρι δροσερό νερό με αργές γουλιές.'
    }
  }
];

function suggestClarityShift() {
  const container = document.getElementById('clarity-shift-content');
  if (!container) return;
  const idx = Math.floor(Math.random() * SHIFT_ACTIVITIES.length);
  const act = SHIFT_ACTIVITIES[idx];

  const title = act.title[currentLang] || act.title.en;
  const desc = act.desc[currentLang] || act.desc.en;

  container.innerHTML = `
    <div class="p-4 bg-teal-500/10 border border-teal-500/30 rounded-2xl text-left space-y-2 animate-fade-in">
      <div class="flex items-center gap-2 font-bold text-sm text-teal-300">
        <i data-lucide="${act.icon}" class="w-5 h-5 text-teal-400"></i>
        <span>${title}</span>
      </div>
      <p class="text-xs text-gray-200 leading-relaxed">${desc}</p>
    </div>
  `;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// -------------------------------------------------------------
// MODUL 4: ZUKUNFTS-ICH (REALITÄTS-CHECK)
// -------------------------------------------------------------
function saveClarityReason() {
  const input = document.getElementById('clarity-reason-input');
  if (!input || !input.value.trim()) return;
  const cState = getClarityState();
  if (!Array.isArray(cState.savedReasons)) cState.savedReasons = [];
  cState.savedReasons.unshift(input.value.trim());
  input.value = '';
  saveState();
  renderClarityReasonsList();
  showToast(t('toast_appointment_saved'));
}

function renderClarityReasonsList() {
  const listEl = document.getElementById('clarity-reasons-list');
  if (!listEl) return;
  const cState = getClarityState();
  const reasons = cState.savedReasons || [];
  if (reasons.length === 0) {
    listEl.innerHTML = `<p class="text-[10px] text-gray-500 italic text-center">${tr({ en: 'No personal reasons saved yet.', de: 'Noch keine persönlichen Gründe gespeichert.', fr: 'Aucune raison personnelle enregistrée.', it: 'Nessun motivo salvato.', es: 'Sin motivos guardados.', el: 'Δεν έχουν αποθηκευτεί λόγοι ακόμα.' })}</p>`;
    return;
  }
  listEl.innerHTML = reasons.slice(0, 5).map((r, i) => `
    <div class="p-2 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-xs text-gray-300">
      <span class="truncate">💡 ${r}</span>
      <button onclick="removeClarityReason(${i})" class="text-gray-500 hover:text-red-400 text-xs px-1.5 cursor-pointer">✕</button>
    </div>
  `).join('');
}

function removeClarityReason(index) {
  const cState = getClarityState();
  if (!Array.isArray(cState.savedReasons)) return;
  cState.savedReasons.splice(index, 1);
  saveState();
  renderClarityReasonsList();
}

// -------------------------------------------------------------
// MODUL 5: TAGE DER KLARHEIT (FREIHEITS-TRACKER)
// -------------------------------------------------------------
function updateClarityStreakUI() {
  const cState = getClarityState();
  const countEl = document.getElementById('clarity-streak-count');
  if (countEl) countEl.innerText = String(cState.streakDays || 0);

  renderClarityReasonsList();
}

function incrementClarityStreak() {
  const cState = getClarityState();
  cState.streakDays = (cState.streakDays || 0) + 1;
  cState.lastCheckinDate = new Date().toISOString();
  saveState();
  updateClarityStreakUI();
  if (typeof triggerCelebration === 'function') triggerCelebration();
  showToast(tr({
    en: "Clarity streak increased! Keep shining 🌟",
    de: "Klarheits-Tag erfolgreich geloggt! Weiter so 🌟",
    fr: "Jour de clarté enregistré ! Continue ainsi 🌟",
    it: "Giorno di chiarezza registrato! Avanti così 🌟",
    es: "¡Día de claridad registrado! Sigue así 🌟",
    el: "Ημέρα διαύγειας καταγράφηκε! Συνεχίστε έτσι 🌟"
  }));
}

function resetClarityStreak() {
  const confirmMsg = tr({
    en: "Resetting your streak is a compassionate learning moment, not a defeat. Reset counter to 0?",
    de: "Ein Neustart ist kein Versagen, sondern ein wertvoller Lernmoment. Zähler auf 0 setzen?",
    fr: "Un nouveau départ n'est pas un échec, mais un apprentissage. Réinitialiser à 0 ?",
    it: "Ricominciare non è una sconfitta, ma un momento per imparare. Azzerare il contatore?",
    es: "Un nuevo comienzo no es un fracaso, sino un aprendizaje. ¿Reiniciar a 0?",
    el: "Μια νέα αρχή δεν είναι αποτυχία, αλλά μάθημα. Επαναφορά στο 0;"
  });

  if (confirm(confirmMsg)) {
    const cState = getClarityState();
    cState.streakDays = 0;
    saveState();
    updateClarityStreakUI();
    showToast(tr({
      en: "Counter reset. Be kind to yourself – today is a brand new day! 🌱",
      de: "Zähler zurückgesetzt. Sei sanft zu dir selbst – heute ist ein neuer Tag! 🌱",
      fr: "Compteur réinitialisé. Sois bienveillant avec toi-même – aujourd'hui est un nouveau jour ! 🌱",
      it: "Contatore azzerato. Sii gentile con te stesso – oggi è un nuovo giorno! 🌱",
      es: "Contador reiniciado. Sé amable contigo mismo, ¡hoy es un nuevo día! 🌱",
      el: "Ο μετρητής μηδενίστηκε. Να είστε ευγενικοί με τον εαυτό σας – σήμερα είναι μια νέα μέρα! 🌱"
    }));
  }
}

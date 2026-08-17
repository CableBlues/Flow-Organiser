// CONFIGURATION KEYS FOR LOCALSTORAGE
const STORE_KEY = 'flowPlannerV3';
const HISTORY_KEY = 'flowPlannerV3History';

// 4-LANGUAGE DEFAULT LIST DICTIONARY
const DEFAULT_TASKS_BY_LANG = {
  en: {
    daily: ['Meds', 'Brush teeth (morning)', 'Make bed', 'Air out room', 'Cook a meal', 'Brush teeth (evening)', 'Take a shower', 'Tidy up'],
    weekly: ['Dusting', 'Vacuuming', 'Mopping', 'Washing dishes', 'Washing laundry', 'Hanging up laundry', 'Cleaning sink & mirror cabinet', 'Tiles & bathtub', 'Cleaning the toilet', 'Taking out the trash', 'Returning deposit bottles'],
    occasionally: ['Washing hair', 'Cutting hair', 'Changing bedsheets', 'Clipping nails', 'Cleaning doors & windows', 'Cleaning stove & fridge']
  },
  de: {
    daily: ['Medis', 'Zähne morgens', 'Bett machen', 'Durchlüften', 'Kochen', 'Zähne abends', 'Duschen', 'Aufräumen'],
    weekly: ['Staub wischen', 'Staubsaugen', 'Boden wischen', 'Geschirr spülen', 'Wäsche waschen', 'Wäsche aufhängen', 'Waschbecken & Spiegelschrank putzen', 'Fliesen & Badewanne', 'Klo putzen', 'Müll wegbringen', 'Pfandflaschen wegbringen'],
    occasionally: ['Haare waschen', 'Haare schneiden', 'Bettwäsche tauschen', 'Nägel schneiden', 'Türe/Fenster putzen', 'Herd & Kühlschrank putzen']
  },
  es: {
    daily: ['Medicación', 'Cepillarse los dientes (mañana)', 'Hacer la cama', 'Ventilar', 'Cocinar', 'Cepillarse los dientes (noche)', 'Ducharse', 'Ordenar'],
    weekly: ['Quitar el polvo', 'Pasar la aspiradora', 'Fregar el suelo', 'Lavar los platos', 'Hacer la colada', 'Colgar la ropa', 'Limpiar el lavabo y espejo', 'Azulejos y bañera', 'Limpiar el váter', 'Sacar la basura', 'Llevar botellas retornables'],
    occasionally: ['Lavarse el pelo', 'Cortarse el pelo', 'Cambiar las sábanas', 'Cortarse las uñas', 'Limpiar puertas y ventanas', 'Limpiar cocina y nevera']
  },
  el: {
    daily: ['Φάρμακα', 'Πλύσιμο δοντιών (πρωί)', 'Στρώσιμο κρεβατιού', 'Αερισμός χώρου', 'Μαγειρική', 'Πλύσιμο δοντιών (βράδυ)', 'Ντους', 'Τακτοποίηση'],
    weekly: ['Ξεσκόνισμα', 'Σκούπισμα', 'Σφουγγάρισμα', 'Πλύσιμο πιάτων', 'Πλύσιμο ρούχων', 'Άπλωμα ρούχων', 'Καθαρισμός νιπτήρα & καθρέφτη', 'Πλακάκια & μπανιέρα', 'Καθαρισμός λεκάνης', 'Πέταμα σκουπιδιών', 'Επιστροφή άδειων μπουκαλιών'],
    occasionally: ['Λούσιμο', 'Κούρεμα', 'Αλλαγή σεντονιών', 'Κόψιμο νυχιών', 'Καθαρισμός πορτών & παραθύρων', 'Καθαρισμός κουζίνας & ψυγείου']
  },
  fr: {
    daily: ['Médicaments', 'Brossage des dents (matin)', 'Faire le lit', 'Aérer la pièce', 'Préparer un repas', 'Brossage des dents (soir)', 'Prendre une douche', 'Ranger'],
    weekly: ['Épousseter', 'Passer l\'aspirateur', 'Laver le sol', 'Faire la vaisselle', 'Faire une lessive', 'Étendre le linge', 'Nettoyer lavabo & armoire à miroir', 'Carrelage & baignoire', 'Nettoyer les toilettes', 'Sortir les poubelles', 'Rapporter les bouteilles consignées'],
    occasionally: ['Se laver les cheveux', 'Se couper les cheveux', 'Changer les draps', 'Se couper les ongles', 'Nettoyer portes & fenêtres', 'Nettoyer cuisinière & réfrigérateur']
  },
  it: {
    daily: ['Farmaci', 'Lavare i denti (mattina)', 'Rifare il letto', 'Arieggiare la stanza', 'Preparare un pasto', 'Lavare i denti (sera)', 'Fare la doccia', 'Riordinare'],
    weekly: ['Spolverare', 'Passare l\'aspirapolvere', 'Lavare i pavimenti', 'Lavare i piatti', 'Fare il bucato', 'Stendere il bucato', 'Pulire lavandino e armadietto specchio', 'Piastrelle e vasca', 'Pulire il WC', 'Portare fuori la spazzatura', 'Riportare le bottiglie con vuoto a rendere'],
    occasionally: ['Lavare i capelli', 'Tagliare i capelli', 'Cambiare le lenzuola', 'Tagliare le unghie', 'Pulire porte e finestre', 'Pulire fornelli e frigorifero']
  }
};

// HUMANE STEP-BY-STEP TRANSLATED PRESET DATABASE (Mapped internally to German key standard)
const TASK_STEPS_DATABASE = Object.assign({},
  typeof TASK_STEPS_DATABASE_PART1 !== 'undefined' ? TASK_STEPS_DATABASE_PART1 : {},
  typeof TASK_STEPS_DATABASE_PART2 !== 'undefined' ? TASK_STEPS_DATABASE_PART2 : {},
  typeof TASK_STEPS_DATABASE_PART3 !== 'undefined' ? TASK_STEPS_DATABASE_PART3 : {}
);


const FALLBACK_STEPS = {
  en: [
    '1. Gather all materials and items needed for "{task}"',
    '2. Reduce distractions and silence your phone',
    '3. Complete the first small starting step immediately (2-5 mins)',
    '4. Focus on working through the main part of "{task}"',
    '5. Clean up your workspace, put away materials, and check it off! 🎉'
  ],
  de: [
    '1. Material & benötigte Gegenstände für "{task}" heraussuchen',
    '2. Ablenkungen reduzieren & Handy stummschalten',
    '3. Den ersten konkreten Anfangsschritt direkt ausführen (2-5 Min)',
    '4. Hauptteil von "{task}" fokussiert abarbeiten',
    '5. Arbeitsplatz säubern, Material verstauen & Aufgabe als erledigt abhaken! 🎉'
  ],
  es: [
    '1. Reunir todos los materiales y objetos necesarios para "{task}"',
    '2. Reducir las distracciones y silenciar el móvil',
    '3. Realizar el primer paso pequeño de inmediato (2-5 min)',
    '4. Concentrarse en avanzar la parte principal de "{task}"',
    '5. Limpiar el espacio de trabajo, guardar los materiales y marcar como hecho. 🎉'
  ],
  el: [
    '1. Συγκέντρωσε όλα τα απαραίτητα υλικά και αντικείμενα για την εργασία "{task}"',
    '2. Μείωσε τους περισπασμούς και βάλε το τηλέφωνο στο αθόρυβο',
    '3. Κάνε αμέσως το πρώτο μικρό βήμα για να ξεκινήσεις (2-5 λεπτά)',
    '4. Εστίασε στην ολοκλήρωση του κύριου μέρους της εργασίας "{task}"',
    '5. Καθάρισε τον χώρο εργασίας, μάζεψε τα υλικά και σημείωσε την ως ολοκληρωμένη! 🎉'
  ],
  fr: [
    '1. Rassemble tout le matériel et les objets nécessaires pour "{task}"',
    '2. Réduis les distractions et mets ton téléphone en silencieux',
    '3. Fais immédiatement le premier petit pas pour commencer (2-5 min)',
    '4. Concentre-toi pour avancer sur l\'essentiel de "{task}"',
    '5. Range ton espace de travail, range le matériel et coche la tâche ! 🎉'
  ],
  it: [
    '1. Raduna tutto il materiale e gli oggetti necessari per "{task}"',
    '2. Riduci le distrazioni e silenzia il telefono',
    '3. Fai subito il primo piccolo passo per iniziare (2-5 min)',
    '4. Concentrati per portare avanti la parte principale di "{task}"',
    '5. Riordina lo spazio di lavoro, riponi il materiale e spunta l\'attività! 🎉'
  ]
};

const CATEGORIES = [
  ['daily', 'sun'],
  ['weekly', 'calendar-days'],
  ['todo', 'list-todo'],
  ['termine', 'clock'],
  ['occasionally', 'calendar-range'],
  ['notes', 'sticky-note'],
  ['done', 'check-circle']
];

const TASK_ICONS = {
  'Medis': 'pill', 'Meds': 'pill', 'Medicación': 'pill', 'Φάρμακα': 'pill',
  'Zähne morgens': 'sun', 'Brush teeth (morning)': 'sun', 'Cepillarse los dientes (mañana)': 'sun', 'Πλύσιμο δοντιών (πρωί)': 'sun',
  'Bett machen': 'bed', 'Make bed': 'bed', 'Hacer la cama': 'bed', 'Στρώσιμο κρεβατιού': 'bed',
  'Durchlüften': 'wind', 'Air out room': 'wind', 'Ventilar': 'wind', 'Αερισμός χώρου': 'wind',
  'Kochen': 'cooking-pot', 'Cook a meal': 'cooking-pot', 'Cocinar': 'cooking-pot', 'Μαγειρική': 'cooking-pot',
  'Zähne abends': 'moon', 'Brush teeth (evening)': 'moon', 'Cepillarse los dientes (noche)': 'moon', 'Πλύσιμο δοντιών (βράδυ)': 'moon',
  'Duschen': 'shower-head', 'Take a shower': 'shower-head', 'Ducharse': 'shower-head', 'Ντους': 'shower-head',
  'Aufräumen': 'package', 'Tidy up': 'package', 'Ordenar': 'package', 'Τακτοποίηση': 'package',
  'Staub wischen': 'feather', 'Dusting': 'feather', 'Quitar el polvo': 'feather', 'Ξεσκόνισμα': 'feather',
  'Staubsaugen': 'tornado', 'Vacuuming': 'tornado', 'Pasar la aspiradora': 'tornado', 'Σκούπισμα': 'tornado',
  'Boden wischen': 'droplets', 'Mopping': 'droplets', 'Fregar el suelo': 'droplets', 'Σφουγγάρισμα': 'droplets',
  'Geschirr spülen': 'utensils', 'Washing dishes': 'utensils', 'Lavar los platos': 'utensils', 'Πλύσιμο πιάτων': 'utensils',
  'Wäsche waschen': 'washing-machine', 'Washing laundry': 'washing-machine', 'Hacer la colada': 'washing-machine', 'Πλύσιμο ρούχων': 'washing-machine',
  'Wäsche aufhängen': 'towel-rack', 'Hanging up laundry': 'towel-rack', 'Colgar la ropa': 'towel-rack', 'Άπλωμα ρούχων': 'towel-rack',
  'Waschbecken & Spiegelschrank putzen': 'sparkles', 'Cleaning sink & mirror cabinet': 'sparkles', 'Limpiar el lavabo y espejo': 'sparkles', 'Καθαρισμός νιπτήρα & καθρέφτη': 'sparkles',
  'Fliesen & Badewanne': 'bath', 'Tiles & bathtub': 'bath', 'Azulejos y bañera': 'bath', 'Πλακάκια & μπανιέρα': 'bath',
  'Klo putzen': 'toilet', 'Cleaning the toilet': 'toilet', 'Limpiar el váter': 'toilet', 'Καθαρισμός λεκάνης': 'toilet',
  'Müll wegbringen': 'trash-2', 'Taking out the trash': 'trash-2', 'Sacar la basura': 'trash-2', 'Πέταμα σκουπιδιών': 'trash-2',
  'Pfandflaschen wegbringen': 'recycle', 'Returning deposit bottles': 'recycle', 'Llevar botellas retornables': 'recycle', 'Επιστροφή άδειων μπουκαλιών': 'recycle',
  'Haare waschen': 'droplet', 'Washing hair': 'droplet', 'Lavarse el pelo': 'droplet', 'Λούσιμο': 'droplet',
  'Haare schneiden': 'scissors', 'Cutting hair': 'scissors', 'Cortarse el pelo': 'scissors', 'Κούρεμα': 'scissors',
  'Bettwäsche tauschen': 'refresh-cw', 'Changing bedsheets': 'refresh-cw', 'Cambiar las sábanas': 'refresh-cw', 'Αλλαγή σεντονιών': 'refresh-cw',
  'Nägel schneiden': 'check-circle-2', 'Clipping nails': 'check-circle-2', 'Cortarse las uñas': 'check-circle-2', 'Κόψιμο νυχιών': 'check-circle-2',
  'Türe/Fenster putzen': 'sparkles', 'Cleaning doors & windows': 'sparkles', 'Limpiar puertas y ventanas': 'sparkles', 'Καθαρισμός πορτών & παραθύρων': 'sparkles',
  'Herd & Kühlschrank putzen': 'sparkles', 'Cleaning stove & fridge': 'sparkles', 'Limpiar cocina y nevera': 'sparkles', 'Καθαρισμός κουζίνας & ψυγείου': 'sparkles'
};

// COMPLETE HUMAN TRANSLATIONS DICTIONARY (UI & SYSTEM)
 
 

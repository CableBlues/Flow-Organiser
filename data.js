// CONFIGURATION KEYS FOR LOCALSTORAGE
const STORE_KEY = 'flowPlannerV3';
const HISTORY_KEY = 'flowPlannerV3History';

// 4-LANGUAGE DEFAULT LIST DICTIONARY
const DEFAULT_TASKS_BY_LANG = {
  de: {
    daily: ['Medis', 'Zähne morgens', 'Bett machen', 'Durchlüften', 'Kochen', 'Zähne abends', 'Duschen', 'Aufräumen'],
    weekly: ['Staub wischen', 'Staubsaugen', 'Boden wischen', 'Geschirr spülen', 'Wäsche waschen', 'Wäsche aufhängen', 'Waschbecken & Spiegelschrank putzen', 'Fliesen & Badewanne', 'Klo putzen', 'Müll wegbringen', 'Pfandflaschen wegbringen'],
    occasionally: ['Haare waschen', 'Haare schneiden', 'Bettwäsche tauschen', 'Nägel schneiden', 'Türe/Fenster putzen', 'Herd & Kühlschrank putzen']
  },
  en: {
    daily: ['Meds', 'Brush teeth (morning)', 'Make bed', 'Air out room', 'Cook a meal', 'Brush teeth (evening)', 'Take a shower', 'Tidy up'],
    weekly: ['Dusting', 'Vacuuming', 'Mopping', 'Washing dishes', 'Washing laundry', 'Hanging up laundry', 'Cleaning sink & mirror cabinet', 'Tiles & bathtub', 'Cleaning the toilet', 'Taking out the trash', 'Returning deposit bottles'],
    occasionally: ['Washing hair', 'Cutting hair', 'Changing bedsheets', 'Clipping nails', 'Cleaning doors & windows', 'Cleaning stove & fridge']
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
  }
};

// HUMANE STEP-BY-STEP TRANSLATED PRESET DATABASE (Mapped internally to German key standard)
const TASK_STEPS_DATABASE = {
  'Medis': {
    de: [
      '1. Glas frisches Wasser einschenken',
      '2. Medikamentenbox / Blister zur Hand nehmen',
      '3. Richtige Tagesdosis entnehmen',
      '4. Mit einem Schluck Wasser einnehmen',
      '5. Verpackung/Box wieder an ihren festen Platz legen',
      '6. Einnahme kurz verinnerlichen / in der App abhaken'
    ],
    en: [
      '1. Pour a glass of fresh water',
      '2. Grab your pill box or blister pack',
      '3. Retrieve the correct daily dose',
      '4. Swallow with a sip of water',
      '5. Put the packaging/box back in its designated place',
      '6. Take a moment to register that you took it / check it off in the app'
    ],
    es: [
      '1. Servir un vaso de agua fresca',
      '2. Coger la caja de pastillas o el blíster',
      '3. Extraer la dosis diaria correcta',
      '4. Tomar con un sorbo de agua',
      '5. Guardar el envase de nuevo en su sitio asignado',
      '6. Tomar conciencia de la toma / marcarlo en la aplicación'
    ],
    el: [
      '1. Γεμίστε ένα ποτήρι με φρέσκο νερό',
      '2. Πάρτε το κουτί των φαρμάκων ή την καρτέλα',
      '3. Αφαιρέστε τη σωστή ημερήσια δόση',
      '4. Καταπιείτε με μια γουλιά νερό',
      '5. Τοποθετήστε τη συσκευασία πίσω στη θέση της',
      '6. Επιβεβαιώστε τη λήψη στον εαυτό σας / σημειώστε το στην εφαρμογή'
    ]
  },
  'Zähne morgens': {
    de: [
      '1. Ins Badezimmer gehen und Licht einschalten',
      '2. Zahnbürste und Zahnpasta greifen',
      '3. Erbsengroße Menge Zahnpasta auftragen',
      '4. 2 Minuten gründlich alle Zahnreihen putzen',
      '5. Mund und Zahnbürste gut ausspülen',
      '6. Gesicht mit kaltem Wasser erfrischen & abtrocknen'
    ],
    en: [
      '1. Go to the bathroom and turn on the light',
      '2. Grab your toothbrush and toothpaste',
      '3. Apply a pea-sized amount of toothpaste',
      '4. Brush all sections of your teeth thoroughly for 2 minutes',
      '5. Rinse your mouth and toothbrush well',
      '6. Refresh your face with cold water and pat dry'
    ],
    es: [
      '1. Ir al baño y encender la luz',
      '2. Coger el cepillo y la pasta de dientes',
      '3. Aplicar una cantidad de pasta del tamaño de un guisante',
      '4. Cepillar bien todas las zonas durante 2 minutos',
      '5. Enjuagar bien la boca y el cepillo de dientes',
      '6. Refrescarse la cara con agua fría y secarse con una toalla'
    ],
    el: [
      '1. Πηγαίνετε στο μπάνιο και ανάψτε το φως',
      '2. Πάρτε την οδοντόβουρτσα και την οδοντόκρεμα',
      '3. Βάλτε μια ποσότητα οδοντόκρεμας μεγέθους μπιζελιού',
      '4. Βουρτρίστε σχολαστικά όλα τα δόντια για 2 λεπτά',
      '5. Ξεπλύνετε καλά το στόμα και την οδοντόβουρτσα',
      '6. Φρεσκάρετε το πρόσκοπό σας με κρύο νερό και σκουπιστείτε'
    ]
  },
  'Bett machen': {
    de: [
      '1. Bettdecke kräftig aufschütteln',
      '2. Kissen aufklopfen und an das Kopfende legen',
      '3. Decke glatt über die Matratze ausbreiten',
      '4. Eventuelle Kuscheltiere oder Decken nett platzieren',
      '5. Einen kurzen Moment das aufgeräumte Bett genießen'
    ],
    en: [
      '1. Shake out your duvet or blanket vigorously',
      '2. Plump up the pillows and place them at the head of the bed',
      '3. Spread the duvet smoothly over the mattress',
      '4. Neatly arrange any decorative pillows or blankets',
      '5. Take a brief moment to appreciate the tidy bed'
    ],
    es: [
      '1. Sacudir la manta o edredón con energía',
      '2. Ahuecar las almohadas y colocarlas en el cabecero',
      '3. Extender la colcha suavemente sobre el colchón',
      '4. Colocar con gusto los cojines decorativos si los hay',
      '5. Disfrutar un breve momento contemplando la cama ordenada'
    ],
    el: [
      '1. Τινάξτε καλά το πάπλωμα ή την κουβέρτα',
      '2. Χτυπήστε ελαφρά τα μαξιλάρια και βάλτε τα στο κεφαλάρι',
      '3. Στρώστε το πάπλωμα ομοιόμορφα πάνω στο στρώμα',
      '4. Τοποθετήστε όμορφα διακοσμητικά μαξιλάρια ή κουβέρτες',
      '5. Απολαύστε για μια στιγμή το τακτοποιημένο σας κρεβάτι'
    ]
  },
  'Durchlüften': {
    de: [
      '1. Fenster im ersten Raum komplett weit öffnen (Stoßlüften)',
      '2. Zimmertüren öffnen für angenehmen Durchzug',
      '3. Fenster in weiteren Räumen öffnen',
      '4. Timer auf 5 bis 10 Minuten stellen',
      '5. Nach Ablauf alle Fenster wieder dicht schließen'
    ],
    en: [
      '1. Open the windows in the first room fully wide (cross-ventilation)',
      '2. Open interior doors to let the air circulate',
      '3. Open windows in the remaining rooms',
      '4. Set a timer for 5 to 10 minutes',
      '5. When the timer rings, shut all windows tightly'
    ],
    es: [
      '1. Abrir de par en par la ventana de la primera habitación',
      '2. Abrir las puertas interiores para crear corriente',
      '3. Abrir las ventanas de las demás habitaciones',
      '4. Poner un temporizador de 5 a 10 minutos',
      '5. Al terminar, cerrar bien todas las ventanas'
    ],
    el: [
      '1. Ανοίξτε διάπλατα το παράθυρο στο πρώτο δωμάτιο',
      '2. Ανοίξτε τις εσωτερικές πόρτες για να δημιουργηθεί ρεύμα',
      '3. Ανοίξτε τα παράθυρα στα υπόλοιπα δωμάτια',
      '4. Ρυθμίστε το χρονόμετρο για 5 έως 10 λεπτά',
      '5. Μόλις τελειώσει ο χρόνος, κλείστε καλά όλα τα παράθυρα'
    ]
  },
  'Kochen': {
    de: [
      '1. Rezept oder Gericht auswählen',
      '2. Alle benötigten Zutaten aus Schrank & Kühlschrank holen',
      '3. Schneidebrett, Messer & Töpfe bereitstellen',
      '4. Gemüse & Zutaten waschen, schälen und schneiden',
      '5. Herd/Ofen einschalten & Zutaten anbraten oder kochen',
      '6. Nach Geschmack abschmecken & würzen',
      '7. Essen auf den teller füllen',
      '8. Herd ausschalten & Pfanne auf kalte Platte schieben'
    ],
    en: [
      '1. Decide on a recipe or meal',
      '2. Gather all required ingredients from cupboards and fridge',
      '3. Get your cutting board, knife, and pots ready',
      '4. Wash, peel, and chop the ingredients',
      '5. Turn on the stove/oven and start cooking',
      '6. Taste and season as desired',
      '7. Plate your food',
      '8. Turn off the stove and slide hot cookware to a cool burner'
    ],
    es: [
      '1. Elegir una receta o plato',
      '2. Sacar todos los ingredientes necesarios de la despensa y nevera',
      '3. Preparar la tabla de cortar, un cuchillo y las ollas',
      '4. Lavar, pelar y cortar los ingredientes',
      '5. Encender el fuego u horno y cocinar los alimentos',
      '6. Probar y sazonar al gusto',
      '7. Servir la comida en el plato',
      '8. Apagar el fuego y mover la olla a una zona fría de la cocina'
    ],
    el: [
      '1. Επιλέξτε μια συνταγή ή ένα γεύμα',
      '2. Συγκεντρώστε τα υλικά από τα ντουλάπια και το ψυγείο',
      '3. Προετοιμάστε την επιφάνεια κοπής, το μαχαίρι και τις κατσαρόλες',
      '4. Πλύνετε, καθαρίστε και κόψτε τα υλικά',
      '5. Ανάψτε την εστία/φούρνο και ξεκινήστε το μαγείρεμα',
      '6. Δοκιμάστε και προσθέστε μπαχαρικά κατά προτίμηση',
      '7. Σερβίρετε το φαγητό στο πιάτο',
      '8. Σβήστε την εστία και μετακινήστε το σκεύος σε κρύο μάτι'
    ]
  },
  'Zähne abends': {
    de: [
      '1. Ins Badezimmer gehen',
      '2. Zahnseide oder Interdentalbürste benutzen',
      '3. Zahnpasta auf die Zahnbürste geben',
      '4. 2 Minuten sanft kreisend alle Zähne putzen',
      '5. Mund ausspülen & Zunge sanft reinigen',
      '6. Becher ausspülen & Handtuch aufhängen'
    ],
    en: [
      '1. Go to the bathroom',
      '2. Use dental floss or an interdental brush first',
      '3. Squeeze toothpaste onto your toothbrush',
      '4. Brush gently in circular motions for 2 minutes',
      '5. Rinse your mouth and gently brush your tongue',
      '6. Rinse your cup and hang up your towel'
    ],
    es: [
      '1. Ir al cuarto de baño',
      '2. Utilizar primero hilo dental o cepillo interdental',
      '3. Poner pasta de dientes en el cepillo',
      '4. Cepillar suavemente con movimientos circulares durante 2 minutos',
      '5. Enjuagar la boca y cepillar la lengua con cuidado',
      '6. Enjuagar el vaso de dientes y colgar la toalla'
    ],
    el: [
      '1. Πηγαίνετε στο μπάνιο',
      '2. Χρησιμοποιήστε πρώτα οδοντικό νήμα ή μεσοδόντιο βουρτσάκι',
      '3. Βάλτε οδοντόκρεμα στην οδοντόβουρτσα',
      '4. Βουρτσίστε απαλά με κυκλικές κινήσεις για 2 λεπτά',
      '5. Ξεπλύνετε το στόμα και καθαρίστε απαλά τη γλώσσα',
      '6. Ξεπλύνετε το ποτήρι και κρεμάστε την πετσέτα'
    ]
  },
  'Duschen': {
    de: [
      '1. Sauberes Handtuch und frische Kleidung bereitlegen',
      '2. Dusche anstellen & Wassertemperatur prüfen',
      '3. Einsteigen & Körper sowie Haare nass machen',
      '4. Shampoo in die Haare einmassieren & gründlich ausspülen',
      '5. Körper mit Duschgel einschäumen & abbrausen',
      '6. Wasser abdrehen & im Stehen vorsichtig abtrocknen',
      '7. Frische Kleidung anziehen & Duschwand kurz abziehen'
    ],
    en: [
      '1. Get a clean towel and fresh clothes ready',
      '2. Turn on the shower and check the water temperature',
      '3. Step in and wet your body and hair thoroughly',
      '4. Massage shampoo into your hair and rinse it out well',
      '5. Soap up your body with shower gel and rinse off',
      '6. Turn off the water and dry yourself off before stepping out',
      '7. Put on fresh clothes and quickly wipe down the shower glass'
    ],
    es: [
      '1. Preparar una toalla limpia y ropa limpia para después',
      '2. Encender la ducha y verificar la temperatura del agua',
      '3. Entrar y mojarse bien el cuerpo y el cabello',
      '4. Masajear el champú en el cabello y aclararlo por completo',
      '5. Enjabonar el cuerpo con gel y aclararse con la alcachofa',
      '6. Cerrar el grifo y secarse con cuidado antes de salir',
      '7. Ponerse la ropa limpia y secar la mampara con la escobilla'
    ],
    el: [
      '1. Ετοιμάστε μια καθαρή πετσέτα και καθαρά ρούχα',
      '2. Ανοίξτε το ντους και ελέγξτε τη θερμοκρασία του νερού',
      '3. Μπείτε στο ντους και βρέξτε το σώμα και τα μαλλιά σας',
      '4. Κάντε μασάζ με σαμπουάν στα μαλλιά και ξεπλύνετε καλά',
      '5. Σαπουνίστε το σώμα με αφρόλουτρο και ξεπλυθείτε',
      '6. Κλείστε το νερό και σκουπιστείτε προσεκτικά',
      '7. Φορέστε καθαρά ρούχα και περάστε γρήγορα το τζάμι του ντους'
    ]
  },
  'Aufräumen': {
    de: [
      '1. Wäschekorb & Mülltüte in die Raummitte stellen',
      '2. Offensichtlichen Müll sofort einsammeln & wegschmeißen',
      '3. Herumliegende Kleidung in den Wäschekorb werfen',
      '4. Geschirr & Becher in die Küche bringen',
      '5. Verbleibende Gegenstände an ihren festen Platz stellen',
      '6. Einmal durchatmen: Der Raum ist wieder frei!'
    ],
    en: [
      '1. Place a laundry basket and trash bag in the center of the room',
      '2. Collect obvious trash immediately and throw it away',
      '3. Toss scattered clothes into the laundry basket',
      '4. Carry any plates, cups, or mugs to the kitchen',
      '5. Put remaining objects back in their designated spots',
      '6. Take a deep breath: your room is free again!'
    ],
    es: [
      '1. Colocar el cesto de la ropa y una bolsa de basura en el centro',
      '2. Recoger la basura evidente de inmediato y tirarla',
      '3. Echar la ropa esparcida al cesto de la colada',
      '4. Llevar los platos y vasos acumulados a la cocina',
      '5. Devolver los objetos restantes a sus lugares correspondientes',
      '6. Respirar hondo: ¡la habitación vuelve a respirar!'
    ],
    el: [
      '1. Τοποθετήστε το καλάθι απλύτων και μια σακούλα σκουπιδιών στο κέντρο',
      '2. Μαζέψτε αμέσως τα εμφανή σκουπίδια και πετάξτε τα',
      '3. Ρίξτε τα διάσπαρτα ρούχα στο καλάθι απλύτων',
      '4. Μεταφέρετε τα πιάτα και τα ποτήρια στην κουζίνα',
      '5. Τοποθετήστε τα υπόλοιπα αντικείμενα στις θέσεις τους',
      '6. Πάρτε μια βαθιά ανάσα: ο χώρος είναι πλέον ελεύθερος!'
    ]
  }
};

const FALLBACK_STEPS = {
  de: [
    '1. Material & benötigte Gegenstände für "{task}" heraussuchen',
    '2. Ablenkungen reduzieren & Handy stummschalten',
    '3. Den ersten konkreten Anfangsschritt direkt ausführen (2-5 Min)',
    '4. Hauptteil von "{task}" fokussiert abarbeiten',
    '5. Arbeitsplatz säubern, Material verstauen & Aufgabe als erledigt abhaken! 🎉'
  ],
  en: [
    '1. Gather all materials and items needed for "{task}"',
    '2. Reduce distractions and silence your phone',
    '3. Complete the first small starting step immediately (2-5 mins)',
    '4. Focus on working through the main part of "{task}"',
    '5. Clean up your workspace, put away materials, and check it off! 🎉'
  ],
  es: [
    '1. Reunir todos los materiales y objetos necesarios para "{task}"',
    '2. Reducir las distracciones y silenciar el móvil',
    '3. Realizar el primer paso pequeño de inmediato (2-5 min)',
    '4. Concentrarse en avanzar la parte principal de "{task}"',
    '5. Limpiar el espacio de trabajo, guardar los materiales y marcar como hecho. 🎉'
  ],
  el: [
    '1. Συγκεντρώστε όλα τα απαραίτητα υλικά και αντικείμενα για την εργασία "{task}"',
    '2. Μειώστε τους περισπασμούς και βάλτε το τηλέφωνο στο αθόρυβο',
    '3. Κάντε αμέσως το πρώτο μικρό βήμα για να ξεκινήσετε (2-5 λεπτά)',
    '4. Εστιάστε στην ολοκλήρωση του κύριου μέρους της εργασίας "{task}"',
    '5. Καθαρίστε τον χώρο εργασίας, μαζέψτε τα υλικά και σημειώστε την ως ολοκληρωμένη! 🎉'
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
  'Türe/Fenster putzen': 'sparkles', 'Cleaning doors & windows': 'sparkles', 'Limpiar doors & windows': 'sparkles', 'Καθαρισμός πορτών & παραθύρων': 'sparkles',
  'Herd & Kühlschrank putzen': 'sparkles', 'Cleaning stove & fridge': 'sparkles', 'Limpiar cocina y nevera': 'sparkles', 'Καθαρισμός κουζίνας & ψυγείου': 'sparkles'
};

// COMPLETE HUMAN TRANSLATIONS DICTIONARY (UI & SYSTEM)
const TRANSLATIONS = {
  de: {
    weekly: 'Haushalt',
    daily: 'Heute',
    todo: 'To-do',
    done: 'Erledigt',
    termine: 'Termine',
    occasionally: 'Gelegentlich',
    notes: 'Notizen',
    add: 'Aufgabe hinzufügen',
    report: 'Protokoll',
    report_title: 'Protokoll & Statistiken',
    settings: 'Optionen',
    whatnow: 'Was nun?',
    notesPlaceholder: 'Schreibe hier deine Notizen auf...',
    give_feedback: 'Feedback geben',
    feedback: 'Feedback',
    feedback_desc: 'Wie gefällt dir Flow? Deine Meinung hilft uns sehr!',
    feedback_placeholder: 'Deine Nachricht...',
    send: 'Senden',
    zen_title: 'Zen Fokus',
    next_rec: 'Empfehlung',
    start_focus: 'Fokus starten',
    other_suggestion: 'Anderer Vorschlag',
    open_steps: 'Steps öffnen',
    completed: 'Erledigt!',
    timer_title: 'Fokus-Timer',
    start: 'Start',
    stop: 'Stop',
    steps_btn: 'Steps',
    steps_tab: 'Steps',
    pick_desc: 'Überfordert von zu vielen Aufgaben? Lass dir eine passende Aufgabe basierend auf deiner Tagespriorität vorschlagen:',
    next_suggestion: '🎲 Nächster Vorschlag',
    steps_desc: 'Wähle eine Aufgabe aus, um die Schritt-für-Schritt-Anleitung anzuzeigen:',
    start_timer: 'Timer starten',
    dropdown_placeholder: '-- Aufgabe aus deinem Plan auswählen --',
    today: 'Heute',
    week: 'Woche',
    month: 'Monat',
    completed_stat: 'Erledigt',
    rate_stat: 'Tasa/Quote',
    options_title: 'Optionen & Einstellungen',
    theme_select: 'Farbschema (Theme)',
    lang_select: 'Sprache',
    sounds: 'Sounds',
    soundscape_title: 'Fokus-Sounds',
    sound_rain: 'Regen',
    sound_rain_desc: 'Pink Noise',
    sound_ocean: 'Ozean',
    sound_ocean_desc: 'Brown Waves',
    sound_alpha: 'Alpha-Beats',
    sound_alpha_desc: '10Hz Focus',
    sound_wind: 'Sanfter Wind',
    sound_wind_desc: 'White Noise',
    levels: ['Fokus-Starter', 'Flow-Entdecker', 'Produktivitäts-Profi', 'Dopamin-Meister', 'Zen-Großmeister'],
    praise: [
      'Stark!', 'Erledigt!', 'Sauber!', 'Top!', 'Meisterhaft!', 'Unglaublich!',
      'Genial!', 'Fantastisch!', 'Wunderbar!', 'Einfach magisch!', 'Boom, geschafft!',
      'Level up!', 'Produktivitäts-Held:in!', 'Hervorragend!', 'Ausgezeichnet!',
      'Keks verdient! 🍪', 'Und wech! 🪄', 'Schon wieder fertig? Angeber! 😜'
    ]
  },
  en: {
    weekly: 'Household',
    daily: 'Today',
    todo: 'To-do',
    done: 'Done',
    termine: 'Appointments',
    occasionally: 'Occasionally',
    notes: 'Notes',
    add: 'Add task',
    report: 'Protocol',
    report_title: 'Protocol & Statistics',
    settings: 'Options',
    whatnow: 'What now?',
    notesPlaceholder: 'Write your notes here...',
    give_feedback: 'Give Feedback',
    feedback: 'Feedback',
    feedback_desc: 'How do you like Flow? Your feedback helps us a lot!',
    feedback_placeholder: 'Your message...',
    send: 'Send',
    zen_title: 'Zen Focus',
    next_rec: 'Recommendation',
    start_focus: 'Start Focus',
    other_suggestion: 'Other Suggestion',
    open_steps: 'Open Steps',
    completed: 'Completed!',
    timer_title: 'Focus Timer',
    start: 'Start',
    stop: 'Stop',
    steps_btn: 'Steps',
    steps_tab: 'Steps',
    pick_desc: 'Overwhelmed by too many tasks? Let us suggest a suitable task based on your daily priority:',
    next_suggestion: '🎲 Next Suggestion',
    steps_desc: 'Select a task to view the step-by-step guide:',
    start_timer: 'Start Timer',
    dropdown_placeholder: '-- Select a task from your plan --',
    today: 'Today',
    week: 'Week',
    month: 'Month',
    completed_stat: 'Done',
    rate_stat: 'Rate',
    options_title: 'Options & Settings',
    theme_select: 'Color Theme',
    lang_select: 'Language',
    sounds: 'Sounds',
    soundscape_title: 'Focus Sounds',
    sound_rain: 'Rain',
    sound_rain_desc: 'Pink Noise',
    sound_ocean: 'Ocean',
    sound_ocean_desc: 'Brown Waves',
    sound_alpha: 'Alpha Beats',
    sound_alpha_desc: '10Hz Focus',
    sound_wind: 'Soft Wind',
    sound_wind_desc: 'White Noise',
    levels: ['Focus Starter', 'Flow Explorer', 'Productivity Pro', 'Dopamine Master', 'Zen Grandmaster'],
    praise: [
      'Awesome!', 'Done!', 'Clean!', 'Top notch!', 'Nice work!', 'Brilliant!',
      'Outstanding!', 'Incredible!', 'Phenomenal!', 'Boom, done!', 'Level up!',
      'Pure magic!', 'Keep it up!', 'Fabulous!', 'Excellent!', 'Productivity monster!'
    ]
  },
  es: {
    weekly: 'Hogar',
    daily: 'Hoy',
    todo: 'Pendientes',
    done: 'Hecho',
    termine: 'Citas',
    occasionally: 'Ocasional',
    notes: 'Notas',
    add: 'Añadir tarea',
    report: 'Informe',
    report_title: 'Historial y Estadísticas',
    settings: 'Opciones',
    whatnow: '¿Y ahora qué?',
    notesPlaceholder: 'Escribe tus notas aquí...',
    give_feedback: 'Enviar Comentarios',
    feedback: 'Comentarios',
    feedback_desc: '¿Qué te parece Flow? ¡Tu opinión nos ayuda mucho!',
    feedback_placeholder: 'Tu mensaje...',
    send: 'Enviar',
    zen_title: 'Enfoque Zen',
    next_rec: 'Siguiente Recomendación',
    start_focus: 'Iniciar Enfoque',
    other_suggestion: 'Otra Sugerencia',
    open_steps: 'Abrir Pasos',
    completed: '¡Hecho!',
    timer_title: 'Temporizador',
    start: 'Iniciar',
    stop: 'Parar',
    steps_btn: 'Pasos',
    steps_tab: 'Pasos',
    pick_desc: '¿Abrumado por demasiadas tareas? Te sugerimos una tarea adecuada según tu prioridad del día:',
    next_suggestion: '🎲 Siguiente Propuesta',
    steps_desc: 'Selecciona una tarea para ver la guía paso a paso:',
    start_timer: 'Iniciar Temporizador',
    dropdown_placeholder: '-- Seleccionar tarea de tu plan --',
    today: 'Hoy',
    week: 'Semana',
    month: 'Mes',
    completed_stat: 'Hecho',
    rate_stat: 'Tasa',
    options_title: 'Opciones y Ajustes',
    theme_select: 'Tema de Color',
    lang_select: 'Idioma',
    sounds: 'Sonidos',
    soundscape_title: 'Sonidos de Enfoque',
    sound_rain: 'Lluvia',
    sound_rain_desc: 'Ruido Rosa',
    sound_ocean: 'Océano',
    sound_ocean_desc: 'Ondas Marinas',
    sound_alpha: 'Pulsos Alfa',
    sound_alpha_desc: 'Enfoque 10Hz',
    sound_wind: 'Viento Suave',
    sound_wind_desc: 'Ruido Blanco',
    levels: ['Principiante de Enfoque', 'Explorador de Flow', 'Profesional de Productividad', 'Maestro de Dopamina', 'Gran Maestro Zen'],
    praise: [
      '¡Fantástico!', '¡Hecho!', '¡Excelente!', '¡Genial!', '¡Nivel arriba!', '¡Increíble!',
      '¡Sensacional!', '¡Qué productivo!', '¡A por la siguiente!', '¡Dominado! ⚡'
    ]
  },
  el: {
    weekly: 'Σπίτι',
    daily: 'Σήμερα',
    todo: 'Λίστα',
    done: 'Ολοκληρώθηκαν',
    termine: 'Ραντεβού',
    occasionally: 'Περιστασιακά',
    notes: 'Σημειώσεις',
    add: 'Προσθήκη',
    report: 'Αναφορά',
    report_title: 'Ιστορικό & Στατιστικά',
    settings: 'Επιλογές',
    whatnow: 'Και τώρα τι;',
    notesPlaceholder: 'Γράψτε τις σημειώσεις σας...',
    give_feedback: 'Αποστολή Σχολίων',
    feedback: 'Σχόλια',
    feedback_desc: 'Πώς σας φαίνεται το Flow; Η γνώμη σας μας βοηθάει πολύ!',
    feedback_placeholder: 'Το μήνυμά σας...',
    send: 'Αποστολή',
    zen_title: 'Ζεν Εστίαση',
    next_rec: 'Επόμενη Πρόταση',
    start_focus: 'Έναρξη Εστίασης',
    other_suggestion: 'Άλλη Πρόταση',
    open_steps: 'Άνοιγμα Βημάτων',
    completed: 'Ολοκληρώθηκε!',
    timer_title: 'Χρονόμετρο Εστίασης',
    start: 'Έναρξη',
    stop: 'Διακοπή',
    steps_btn: 'Βήματα',
    steps_tab: 'Βήματα',
    pick_desc: 'Πελαγωμένος από πολλές εργασίες; Αφήστε μας να σας προτείνουμε μια κατάλληλη εργασία με βάση την προτεραιότητά σας:',
    next_suggestion: '🎲 Επόμενη Πρόταση',
    steps_desc: 'Επιλέξτε μια εργασία για να δείτε τον οδηγό βήμα προς βήμα:',
    start_timer: 'Έναρξη Χρονομέτρου',
    dropdown_placeholder: '-- Επιλέξτε εργασία από το πλάνο σας --',
    today: 'Σήμερα',
    week: 'Εβδομάδα',
    month: 'Μήνας',
    completed_stat: 'Έγινε',
    rate_stat: 'Ποσοστό',
    options_title: 'Επιλογές & Ρυθμίσεις',
    theme_select: 'Θέμα Εμφάνισης',
    lang_select: 'Γλώσσα',
    sounds: 'Ήχοι',
    soundscape_title: 'Ήχοι Εστίασης',
    sound_rain: 'Βροχή',
    sound_rain_desc: 'Ροζ Θόρυβος',
    sound_ocean: 'Ωκεανός',
    sound_ocean_desc: 'Καφέ Θόρυβος',
    sound_alpha: 'Κύματα Άλφα',
    sound_alpha_desc: 'Εστίαση 10Hz',
    sound_wind: 'Απαλός Άνεμος',
    sound_wind_desc: 'Λευκός Θόρυβος',
    levels: ['Αρχάριος Εστίασης', 'Εξερευνητής Ροής', 'Επαγγελματίας Παραγωγικότητας', 'Κυρίαρχος Ντοπαμίνης', 'Μέγας Δάσκαλος Ζεν'],
    praise: [
      'Μπράβο!', 'Έγινε!', 'Τέλεια!', 'Εξαιρετικά!', 'Level up!', 'Φανταστικά!',
      'Απίστευτο!', 'Είσαι μηχανή παραγωγικότητας!', 'Συνέχισε έτσι! ⚡'
    ]
  }
};
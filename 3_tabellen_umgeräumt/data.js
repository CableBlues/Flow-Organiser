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
  }
};

// HUMANE STEP-BY-STEP TRANSLATED PRESET DATABASE (Mapped internally to German key standard)
const TASK_STEPS_DATABASE = {
  // DAILY TASKS
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
      '1. Γέμισε ένα ποτήρι με φρέσκο νερό',
      '2. Πάρε το κουτί των φαρμάκων ή την καρτέλα',
      '3. Βγάλε τη σωστή ημερήσια δόση',
      '4. Πιες το με μια γουλιά νερό',
      '5. Τοποθέτησε τη συσκευασία πίσω στη θέση της',
      '6. Επιβεβαίωσε τη λήψη στον εαυτό σου / σημείωσε το στην εφαρμογή'
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
      '1. Πήγαινε στο μπάνιο και άναψε το φως',
      '2. Πάρε την οδοντόβουρτσα και την οδοντόκρεμα',
      '3. Βάλε μια ποσότητα οδοντόκρεμας μεγέθους μπιζελιού',
      '4. Βούρτσισε σχολαστικά όλα τα δόντια για 2 λεπτά',
      '5. Ξέπλυνε καλά το στόμα και την οδοντόβουρτσα',
      '6. Φρέσκαρε το πρόσωπό σου με κρύο νερό και σκουπίσου'
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
      '1. Τίναξε καλά το πάπλωμα ή την κουβέρτα',
      '2. Χτύπησε ελαφρά τα μαξιλάρια και βάλ\' τα στο κεφαλάρι',
      '3. Στρώσε το πάπλωμα ομοιόμορφα πάνω στο στρώμα',
      '4. Τοποθέτησε όμορφα διακοσμητικά μαξιλάρια ή κουβέρτες',
      '5. Απόλαυσε για μια στιγμή το τακτοποιημένο σου κρεβάτι'
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
      '1. Άνοιξε διάπλατα το παράθυρο στο πρώτο δωμάτιο',
      '2. Άνοιξε τις εσωτερικές πόρτες για να δημιουργηθεί ρεύμα',
      '3. Άνοιξε τα παράθυρα στα υπόλοιπα δωμάτια',
      '4. Ρύθμισε το χρονόμετρο για 5 έως 10 λεπτά',
      '5. Κλείσε καλά όλα τα παράθυρα'
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
      '1. Επίλεξε μια συνταγή ή ένα γεύμα',
      '2. Συγκέντρωσε τα υλικά από τα ντουλάπια και το ψυγείο',
      '3. Προετοίμασε την επιφάνεια κοπής, το μαχαίρι και τις κατσαρόλες',
      '4. Πλύνε, καθαρίσε και κόψε τα υλικά',
      '5. Άναψε την εστία/φούρνο και ξεκίνα το μαγείρεμα',
      '6. Δοκίμασε και πρόσθεσε μπαχαρικά κατά προτίμηση',
      '7. Σερβίρισε το φαγητό στο πιάτο',
      '8. Σβήσε την εστία και μετακίνησε το σκεύος σε κρύο μάτι'
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
      '1. Πήγαινε στο μπάνιο',
      '2. Χρησιμοποίησε πρώτα οδοντικό νήμα ή μεσοδόντιο βουρτσάκι',
      '3. Βάλε οδοντόκρεμα στην οδοντόβουρτσα',
      '4. Βούρτσισε απαλά με κυκλικές κινήσεις για 2 λεπτά',
      '5. Ξέπλυνε το στόμα και καθάρισε απαλά τη γλώσσα',
      '6. Ξέπλυνε το ποτήρι και κρέμασε την πετσέτα'
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
      '1. Ετοίμασε μια καθαρή πετσέτα και καθαρά ρούχα',
      '2. Άνοιξε το ντους και έλεγξε τη θερμοκρασία του νερού',
      '3. Μπες στο ντους και βρέξε το σώμα και τα μαλλιά σου',
      '4. Κάνε μασάζ με σαμπουάν στα μαλλιά και ξέπλυνε καλά',
      '5. Σαπούνισε το σώμα με αφρόλουτρο και ξεπλύσου',
      '6. Κλείσε το νερό και σκουπίσου προσεκτικά',
      '7. Φόρεσε καθαρά ρούχα και πέρασε γρήγορα το τζάμι του ντους'
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
      '1. Τοποθέτησε το καλάθι απλύτων και μια σακούλα σκουπιδιών στο κέντρο',
      '2. Μάζεψε αμέσως τα εμφανή σκουπίδια και πέταξέ τα',
      '3. Ρίξε τα διάσπαρτα ρούχα στο καλάθι απλύτων',
      '4. Μετάφερε τα πιάτα και τα ποτήρια στην κουζίνα',
      '5. Τοποθέτησε τα υπόλοιπα αντικείμενα στις θέσεις τους',
      '6. Πάρε μια βαθιά ανάσα: ο χώρος είναι πλέον ελεύθερος!'
    ]
  },

  // WEEKLY TASKS
  'Staub wischen': {
    de: [
      '1. Staubtuch oder Staubwedel bereitlegen',
      '2. Alle freien Oberflächen abwischen',
      '3. Dekorationsgegenstände anheben und darunter wischen',
      '4. Staubwedel draußen ausklopfen oder Tuch waschen'
    ],
    en: [
      '1. Get a dust cloth or feather duster ready',
      '2. Wipe down all accessible surfaces',
      '3. Lift up decorations and dust underneath them',
      '4. Shake out the duster outside or wash the cloth'
    ],
    es: [
      '1. Preparar un plumero o paño para el polvo',
      '2. Limpiar todas las superficies accesibles',
      '3. Levantar los adornos y limpiar debajo de ellos',
      '4. Sacudir el plumero fuera o lavar el paño'
    ],
    el: [
      '1. Πάρε ένα ξεσκονόπανο',
      '2. Σκούπισε όλες τις ελεύθερες επιφάνειες',
      '3. Σήκωσε τα διακοσμητικά και σκούπισε από κάτω',
      '4. Τίναξε το πανί έξω'
    ]
  },
  'Staubsaugen': {
    de: [
      '1. Staubsauger holen und Kabel abrollen',
      '2. Den Staubsauger an das Stromnetz anschließen',
      '3. Alle Räume systematisch saugen',
      '4. Den Filter leeren oder Staubbeutel prüfen'
    ],
    en: [
      '1. Get the vacuum cleaner and unroll the cord',
      '2. Plug the vacuum into the electrical outlet',
      '3. Vacuum all rooms systematically',
      '4. Empty the canister or check the dust bag'
    ],
    es: [
      '1. Traer la aspiradora y desenrollar el cable',
      '2. Enchufar la aspiradora a la corriente',
      '3. Aspirar todas las habitaciones de forma sistemática',
      '4. Vaciar el depósito o revisar la bolsa de polvo'
    ],
    el: [
      '1. Φέρε την ηλεκτρική σκούπα και ξετύλιξε το καλώδιο',
      '2. Βάλ\' την στην πρίζα',
      '3. Σκούπισε όλα τα δωμάτια συστηματικά',
      '4. Άδειασε το φίλτρο ή έλεγξε τη σακούλα'
    ]
  },
  'Boden wischen': {
    de: [
      '1. Einen Eimer mit warmem Wasser füllen',
      '2. Einen Schuss Bodenreiniger hinzugeben',
      '3. Den Wischmop nass machen und gut auswringen',
      '4. Die Böden feucht wischen und trocknen lassen'
    ],
    en: [
      '1. Fill a bucket with warm water',
      '2. Add a splash of floor cleaner',
      '3. Wet the mop and wring it out thoroughly',
      '4. Mop the floors and let them dry completely'
    ],
    es: [
      '1. Llenar un cubo con agua templada',
      '2. Añadir un chorro de limpiador de suelos',
      '3. Mojar la fregona y escurrirla muy bien',
      '4. Fregar los suelos y dejar secar por completo'
    ],
    el: [
      '1. Γέμισε έναν κουβά με ζεστό νερό',
      '2. Πρόσθεσε λίγο καθαριστικό πατώματος',
      '3. Βρέξε τη σφουγγαρίστρα και στύψε τη καλά',
      '4. Σφουγγάρισε τα πατώματα και άφησέ τα να στεγνώσουν'
    ]
  },
  'Geschirr spülen': {
    de: [
      '1. Spülbecken mit heißem Wasser und Spülmittel füllen',
      '2. Geschirr von grobem Schmutz befreien',
      '3. Geschirr gründlich mit dem Schwamm abwaschen',
      '4. Klarspülen, abtrocknen und in den Schrank einsortieren'
    ],
    en: [
      '1. Fill the sink with hot water and dish soap',
      '2. Scrap food residue off the dishes',
      '3. Scrub the dishes thoroughly with a sponge',
      '4. Rinse, dry, and put them away in the cupboards'
    ],
    es: [
      '1. Llenar el fregadero con agua caliente y lavavajillas',
      '2. Quitar los restos gruesos de comida de la vajilla',
      '3. Fregar los platos a fondo con una esponja',
      '4. Aclarar con agua, secar y colocar en los armarios'
    ],
    el: [
      '1. Γέμισε τον νεροχύτη με ζεστό νερό και υγρό πιάτων',
      '2. Καθάρισε τα υπολείμματα φαγητού από τα πιάτα',
      '3. Τρίψε τα πιάτα σχολαστικά με ένα σφουγγάρι',
      '4. Ξέπλυνε, στέγνωσε και βάλε τα στη θέση τους'
    ]
  },
  'Wäsche waschen': {
    de: [
      '1. Schmutzwäsche nach Farben und Temperatur sortieren',
      '2. Die Wäschetrommel befüllen und Tür schließen',
      '3. Waschmittel und Weichspüler einfüllen',
      '4. Das passende Waschprogramm auswählen und starten'
    ],
    en: [
      '1. Sort dirty laundry by colors and temperature',
      '2. Fill the washing machine drum and close the door',
      '3. Add laundry detergent and fabric softener',
      '4. Select the correct wash cycle and start the program'
    ],
    es: [
      '1. Clasificar la ropa sucia por colores y temperatura',
      '2. Llenar el tambor de la lavadora y cerrar la puerta',
      '3. Añadir detergente y suavizante',
      '4. Seleccionar el programa adecuado e iniciar la colada'
    ],
    el: [
      '1. Ξεχώρισε τα ρούχα ανάλογα με τα χρώματα και τη θερμοκρασία',
      '2. Γέμισε τον κάδο του πλυντηρίου και κλείσε την πόρτα',
      '3. Πρόσθεσε απορρυπαντικό και μαλακτικό',
      '4. Επίλεξε το κατάλληλο πρόγραμμα και ξεκίνα την πλύση'
    ]
  },
  'Wäsche aufhängen': {
    de: [
      '1. Den Wäscheständer an einem gut belüfteten Ort aufstellen',
      '2. Kleidungsstücke kräftig ausschütteln, um Falten zu mindern',
      '3. Kleidung ordentlich aufhängen und bei Bedarf Klammern nutzen',
      '4. Vollständig trocknen lassen, bevor sie abgehängt wird'
    ],
    en: [
      '1. Set up the drying rack in a well-ventilated spot',
      '2. Shake out each clothing item to reduce wrinkles',
      '3. Hang clothes neatly and use clothespins if needed',
      '4. Let dry completely before taking them down'
    ],
    es: [
      '1. Colocar el tendedero en un lugar bien ventilado',
      '2. Sacudir bien cada prenda para reducir las arrugas',
      '3. Colgar la ropa de forma ordenada usando pinzas si hace falta',
      '4. Dejar secar por completo antes de recogerla'
    ],
    el: [
      '1. Στήσε την απλώστρα σε ένα μέρος που αερίζεται καλά',
      '2. Τίναξε καλά κάθε ρούχο για να μειώσεις τις ζάρες',
      '3. Άπλωσε τα ρούχα και χρησιμοποίησε μανταλάκια αν χρειάζεται',
      '4. Άφησέ τα να στεγνώσουν τελείως πριν τα μαζέψεις'
    ]
  },
  'Waschbecken & Spiegelschrank putzen': {
    de: [
      '1. Spiegelflächen mit Glasreiniger einsprühen und trockenreiben',
      '2. Das Waschbecken mit Badreiniger einsprühen',
      '3. Becken und Armaturen mit einem Schwamm sauber schrubben',
      '4. Mit Wasser nachspülen und alles glänzend polieren'
    ],
    en: [
      '1. Spray mirror surfaces with glass cleaner and wipe dry',
      '2. Spray the sink with bathroom cleaner',
      '3. Scrub the sink basin and faucets clean with a sponge',
      '4. Rinse with water and buff dry for a sparkling shine'
    ],
    es: [
      '1. Rociar los espejos con limpiacristales y secar bien',
      '2. Rociar el lavabo con limpiador de baños',
      '3. Fregar el lavabo y los grifos con una esponja',
      '4. Aclarar con agua y secar con un paño para dar brillo'
    ],
    el: [
      '1. Ψέκασε τον καθρέφτη με καθαριστικό τζαμιών και σκούπισέ τον',
      '2. Ψέκασε τον νιπτήρα με καθαριστικό μπάνιου',
      '3. Τρίψε τον νιπτήρα και τις μπαταρίες με ένα σφουγγάρι',
      '4. Ξέπλυνε με νερό και γυάλισε με ένα πανί'
    ]
  },
  'Fliesen & Badewanne': {
    de: [
      '1. Badewanne und Fliesen mit Antikalk-Reiniger einsprühen',
      '2. Kurz einwirken lassen, um Seifenreste zu lösen',
      '3. Oberflächen mit einem Reinigungsschwamm gründlich schrubben',
      '4. Mit klarem, kaltem Wasser abspülen und abziehen'
    ],
    en: [
      '1. Spray bathtub and tiles with limescale cleaner',
      '2. Let it sit briefly to dissolve soap scum',
      '3. Scrub all surfaces thoroughly with a sponge',
      '4. Rinse with clean, cold water and wipe dry'
    ],
    es: [
      '1. Rociar la bañera y los azulejos con limpiador antical',
      '2. Dejar actuar brevemente para disolver los restos de jabón',
      '3. Fregar bien todas las superficies con una esponja',
      '4. Aclarar con agua fría limpia y secar'
    ],
    el: [
      '1. Ψέκασε την μπανιέρα και τα πλακάκια με καθαριστικό για άλατα',
      '2. Άφησέ το να δράσει για λίγο για να λιώσουν τα υπολείμματα σαπουνιού',
      '3. Τρίψε όλες τις επιφάνειες σχολαστικά με ένα σφουγγάρι',
      '4. Ξέπλυνε με καθαρό, κρύο νερό και σκούπισε'
    ]
  },
  'Klo putzen': {
    de: [
      '1. WC-Reiniger unter den Rand der Toilette verteilen',
      '2. Mit die Toilettenbürste die Schüssel gründlich schrubben',
      '3. WC-Sitz, Deckel und Außenflächen desinfizieren',
      '4. Außen trocken nachwischen und einmal abspülen'
    ],
    en: [
      '1. Apply toilet cleaner under the rim of the bowl',
      '2. Scrub the inside of the bowl thoroughly with the brush',
      '3. Disinfect the seat, lid, and outside surfaces',
      '4. Wipe the exterior dry and flush the toilet'
    ],
    es: [
      '1. Aplicar limpiador de inodoros bajo el borde de la taza',
      '2. Fregar bien el interior de la taza con la escobilla',
      '3. Desinfectar el asiento, la tapa y las superficies exteriores',
      '4. Secar el exterior con papel o paño y tirar de la cadena'
    ],
    el: [
      '1. Βάλε καθαριστικό λεκάνης κάτω από το χείλος',
      '2. Τρίψε καλά το εσωτερικό της λεκάνης με το βουρτσάκι',
      '3. Απολύμανε το κάθισμα, το καπάκι και τις εξωτερικές επιφάνειες',
      '4. Σκούπισε το εξωτερικό για να στεγνώσει και τράβηξε το καζανάκι'
    ]
  },
  'Müll wegbringen': {
    de: [
      '1. Volle Müllbeutel fest zuknoten',
      '2. Die Beutel zu den entsprechenden Abfalltonnen draußen bringen',
      '3. Den leeren Mülleimer bei Bedarf kurz auswischen',
      '4. Eine frische Mülltüte in den Eimer einsetzen'
    ],
    en: [
      '1. Tie up the full trash bags tightly',
      '2. Carry the bags outside to the appropriate garbage bins',
      '3. Quickly wipe down the inside of the empty bin if needed',
      '4. Place a fresh, clean liner into the bin'
    ],
    es: [
      '1. Atar fuerte las bolsas de basura llenas',
      '2. Llevar las bolsas fuera a los contenedores correspondientes',
      '3. Limpiar brevemente el interior del cubo vacío si es necesario',
      '4. Colocar una bolsa de basura limpia en el cubo'
    ],
    el: [
      '1. Δέσε καλά τις γεμάτες σακούλες σκουπιδιών',
      '2. Μετάφερε τις σακούλες έξω στους κατάλληλους κάδους',
      '3. Σκούπισε γρήγορα το εσωτερικό του άδειου κάδου αν χρειάζεται',
      '4. Τοποθέτησε μια νέα, καθαρή σακούλα στον κάδο'
    ]
  },
  'Pfandflaschen wegbringen': {
    de: [
      '1. Alle leeren Pfandflaschen in einer Tragetasche sammeln',
      '2. Die Tasche mit zum nächsten Supermarkt nehmen',
      '3. Flaschen einzeln in den Pfandautomaten einschieben',
      '4. Den ausgedruckten Pfandbon an der Kasse einlösen'
    ],
    en: [
      '1. Gather all empty deposit bottles in a tote bag',
      '2. Take the bag of bottles to the nearest supermarket',
      '3. Insert the bottles one by one into the return machine',
      '4. Hand the printed voucher to the cashier to redeem it'
    ],
    es: [
      '1. Reunir todas las botellas con depósito vacías en una bolsa',
      '2. Llevar la bolsa de botellas al supermercado más cercano',
      '3. Introducir las botellas una a una en la máquina de devolución',
      '4. Entregar el ticket impreso en la caja para cobrarlo'
    ],
    el: [
      '1. Μάζεψε όλα τα άδεια μπουκάλια σε μια τσάντα μεταφοράς',
      '2. Πάρε την τσάντα μαζί σου στο πλησιέστερο σούπερ μάρκετ',
      '3. Βάλε τα μπουκάλια ένα-ένα στο μηχάνημα επιστροφής',
      '4. Δώσε την εκτυπωμένη απόδειξη στο ταμείο για να την εξαργυρώσεις'
    ]
  },

  // OCCASIONAL TASKS
  'Haare waschen': {
    de: [
      '1. Haare unter der Dusche gründlich nass machen',
      '2. Eine Portion Shampoo sanft in die Kopfhaut einmassieren',
      '3. Den Schaum mit warmem Wasser restlos ausspülen',
      '4. Bei Bedarf Conditioner in die Spitzen geben und ausspülen'
    ],
    en: [
      '1. Wet hair thoroughly under the warm shower',
      '2. Gently massage a dollop of shampoo into your scalp',
      '3. Rinse the suds out completely with warm water',
      '4. Apply conditioner to the ends if needed and rinse well'
    ],
    es: [
      '1. Mojar el cabello por completo bajo la ducha templada',
      '2. Masajear suavemente una porción de champú en el cuero cabelludo',
      '3. Aclarar la espuma por completo con agua templada',
      '4. Aplicar acondicionador en las puntas si es necesario y aclarar bien'
    ],
    el: [
      '1. Βρέξε καλά τα μαλλιά σου κάτω από το ντους',
      '2. Κάνε απαλό μασάζ με μια ποσότητα σαμπουάν στο τριχωτό της κεφαλής',
      '3. Ξέπλυνε τελείως τον αφρό με ζεστό νερό',
      '4. Βάλε κρέμα μαλλιών στις άκρες αν χρειάζεται και ξέπλυνε καλά'
    ]
  },
  'Haare schneiden': {
    de: [
      '1. Haare gut kämmen und glätten',
      '2. Eine Haarschneideschere und Handtuch bereitlegen',
      '3. Die Spitzen oder gewünschte Partien vorsichtig schneiden',
      '4. Lose Haare vom Hals abpinseln und den Boden fegen'
    ],
    en: [
      '1. Comb and straighten hair thoroughly',
      '2. Get hair cutting scissors and a towel ready',
      '3. Carefully trim the split ends or desired sections',
      '4. Brush loose hairs off your neck and sweep the floor'
    ],
    es: [
      '1. Peinar y alisar el cabello por completo',
      '2. Preparar unas tijeras de peluquería y una toalla',
      '3. Cortar con cuidado las puntas o las zonas deseadas',
      '4. Sacudir los pelos sueltos del cuello y barrer el suelo'
    ],
    el: [
      '1. Χτένισε καλά τα μαλλιά σου',
      '2. Ετοίμασε ένα ψαλίδι κουρέματος και μια πετσέτα',
      '3. Κόψε προσεκτικά τις άκρες ή τα σημεία που θέλεις',
      '4. Καθάρισε τις τρίχες από τον λαιμό σου και σκούπισε το πάτωμα'
    ]
  },
  'Bettwäsche tauschen': {
    de: [
      '1. Kopfkissen- und Bettdeckenbezug abziehen',
      '2. Das alte Bettlaken vorsichtig von der Matratze entfernen',
      '3. Die gebrauchte Wäsche direkt in die Waschmaschine bringen',
      '4. Die Matratze und Bettdecken mit frischen Bezügen beziehen'
    ],
    en: [
      '1. Remove the pillowcases and the duvet cover',
      '2. Carefully pull the old sheet off the mattress',
      '3. Take the dirty bedsheets straight to the laundry room',
      '4. Put fresh, clean sheets, cases, and covers on the bed'
    ],
    es: [
      '1. Quitar las fundas de almohada y la funda del edredón',
      '2. Retirar con cuidado la sábana bajera antigua del colchón',
      '3. Llevar la ropa de cama sucia directa al cesto de lavar',
      '4. Colocar sábanas y fundas limpias y frescas en la cama'
    ],
    el: [
      '1. Βγάλε τις μαξιλαροθήκες και το πάπλωμα από τις θήκες τους',
      '2. Αφαίρεσε προσεκτικά το παλιό σεντόνι από το στρώμα',
      '3. Πήγαινε τα λερωμένα σεντόνια κατευθείαν για πλύσιμο',
      '4. Στρώσε καθαρά σεντόνια και βάλε καθαρές θήκες στα μαξιλάρια και το πάπλωμα'
    ]
  },
  'Nägel schneiden': {
    de: [
      '1. Den Nagelknipser oder eine Nagelschere holen',
      '2. Die Fingernägel und Fußnägel vorsichtig kürzen',
      '3. Eventuelle scharfe Ecken mit einer Feile glätten',
      '4. Hände und Füße mit feuchtigkeitsspendender Creme pflegen'
    ],
    en: [
      '1. Get your nail clippers or manicure scissors',
      '2. Carefully trim your fingernails and toenails',
      '3. Smooth out any sharp edges using a nail file',
      '4. Apply a moisturizing lotion to your hands and feet'
    ],
    es: [
      '1. Coger el cortaúñas o unas tijeras de manicura',
      '2. Cortar con cuidado las uñas de las manos y de los pies',
      '3. Suavizar los bordes afilados con una lima de uñas',
      '4. Aplicar crema hidratante en las manos y en los pies'
    ],
    el: [
      '1. Πάρε τον νυχοκόπτη ή ένα ψαλιδάκι νυχιών',
      '2. Κόψε προσεκτικά τα νύχια των χεριών και των ποδιών σου',
      '3. Λίμαρε τις αιχμηρές άκρες με μια λίμα',
      '4. Βάλε ενυδατική κρέμα στα χέρια και στα πόδια σου'
    ]
  },
  'Türe/Fenster putzen': {
    de: [
      '1. Glasflächen mit Fensterreiniger großzügig einsprühen',
      '2. Mit einem Gummiabzieher die Flächen streifenfrei abziehen',
      '3. Fensterrahmen und Türgriffe feucht abwischen',
      '4. Die Kanten mit einem Mikrofasertuch trockenpolieren'
    ],
    en: [
      '1. Spray glass surfaces generously with window cleaner',
      '2. Use a rubber squeegee to wipe the glass streak-free',
      '3. Wipe down the window frames and door handles with a damp cloth',
      '4. Polish the edges dry using a clean microfiber cloth'
    ],
    es: [
      '1. Rociar los cristales generosamente con limpiacristales',
      '2. Pasar una rasqueta de goma para secar sin dejar marcas',
      '3. Limpiar los marcos de las ventanas y pomos con un paño húmedo',
      '4. Secar y repasar los bordes con un paño de microfibra'
    ],
    el: [
      '1. Ψέκασε τις γυάλινες επιφάνειες με καθαριστικό τζαμιών',
      '2. Χρησιμοποίησε έναν υαλοκαθαριστήρα για να μην αφήσεις θαμπάδες',
      '3. Σκούπισε τα κουφώματα και τα πόμολα με ένα υγρό πανί',
      '4. Γύρισε τις άκρες με ένα καθαρό πανί μικροϊνών για να στεγνώσουν'
    ]
  },
  'Herd & Kühlschrank putzen': {
    de: [
      '1. Das Kochfeld einsprühen, einwirken lassen und abwischen',
      '2. Abgelaufene Lebensmittel aus dem Kühlschrank entsorgen',
      '3. Alle Fächer und Fächerwände im Kühlschrank feucht auswischen',
      '4. Alles wieder ordentlich einräumen und Außenflächen abwischen'
    ],
    en: [
      '1. Spray the stovetop, let it sit, then wipe it clean',
      '2. Empty the fridge and discard any expired food items',
      '3. Wipe down all shelves and compartments in the fridge with a damp cloth',
      '4. Organize everything back inside and wipe down the exterior'
    ],
    es: [
      '1. Rociar la placa de la cocina, dejar actuar y limpiar',
      '2. Vaciar la nevera y desechar los alimentos caducados',
      '3. Limpiar todos los estantes y cajones de la nevera con un paño húmedo',
      '4. Volver a colocar todo bien ordenado y limpiar el exterior'
    ],
    el: [
      '1. Ψέκασε τις εστίες της κουζίνας, άφησέ το να δράσει και σκούπισε',
      '2. Άδειασε το ψυγείο και πέταξε τα ληγμένα τρόφιμα',
      '3. Σκούπισε όλα τα ράφια και τις θήκες του ψυγείου με ένα υγρό πανί',
      '4. Τακτοποίησε τα τρόφιμα πάλι μέσα και σκούπισε το εξωτερικό μέρος'
    ]
  }
};

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
const TRANSLATIONS = {
  en: {
    weekly: 'Household',
    daily: 'Today',
    todo: 'To-do',
    done: 'Done',
    termine: 'Appointments',
    occasionally: 'Occasionally',
    notes: 'Notes',
    add: 'Add task',
    report: 'Stats',
    report_title: 'Protocol & Statistics',
    settings: 'Options',
    whatnow: 'What now?',
    notesPlaceholder: 'Write your notes here...',
    give_feedback: 'Give Feedback',
    feedback: 'Feedback',
    feedback_desc: 'How do you like Flow? Your feedback helps us a lot!',
    feedback_placeholder: 'Your message...',
    feedback_greet: 'Hey, I\'m jmonke! 👋',
    feedback_prompt: 'Do you have criticism, corrections, or new ideas for Flow? Shoot me a message, I\'m always happy to hear from you!',
    feedback_alt: 'Or email directly to jmonke@gmail.com',
    feedback_send_tooltip: 'Or send directly to jmonke@gmail.com',
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
    weekly_activity: '7-Day Activity (Mon-Sun)',
    export: 'Export',
    loading_stats: 'Loading stats...',
    login_btn: 'Log in',
    sync_title: 'Device Sync',
    sync_desc: 'Seamlessly transfer and back up your plan across all your devices.',
    login: 'Log In',
    register: 'Register',
    title_undo: 'Undo',
    title_open: 'Open Plan',
    title_save: 'Save Plan',
    title_reset: 'Reset All',
    title_theme: 'Color Theme',
    options_title: 'Options & Settings',
    theme_select: 'Color Theme',
    lang_select: 'Language',
    sounds: 'Sounds',
    soundscape_title: 'Focus Sounds',
    music: 'Music',
    music_player: 'Music Player',
    custom_tracks: 'Play Custom Tracks',
    no_tracks: 'No tracks loaded',
    boost_btn: 'Spark',
    boost_desc: 'Feeling blocked? Treat yourself to a tiny 30-second activity to refocus your mind:',
    boost_placeholder: 'Click below for a suggestion!',
    boost_new: 'New Suggestion 🔄',
    sound_rain: 'Rain',
    sound_rain_desc: 'Pink Noise',
    sound_ocean: 'Ocean',
    sound_ocean_desc: 'Brown Waves',
    sound_birds: 'Birds',
    sound_birds_desc: 'Forest Chirp',
    sound_thunder: 'Storm',
    sound_thunder_desc: 'Thunderstorm',
    sound_wind: 'Soft Wind',
    sound_wind_desc: 'White Noise',
    sound_fire: 'Fire',
    sound_fire_desc: 'Warm Crackle',
    sound_cafe: 'Café',
    sound_cafe_desc: 'Cozy Chatter',
    sound_crickets: 'Meadow',
    sound_crickets_desc: 'Crickets Chirping',
    sound_white: 'Static',
    sound_white_desc: 'White Noise',
    sound_purr: 'Purring',
    sound_purr_desc: 'Cat Sound',
    sound_jungle: 'Jungle',
    sound_jungle_desc: 'Nature & Birds',
    sound_train: 'Train Ride',
    sound_train_desc: 'Track Loop',
    sound_library: 'Library',
    sound_library_desc: 'Rustling Pages',
    sound_keyboard: 'Keyboard',
    sound_keyboard_desc: 'Typing Sound',
    sound_spaceship: 'Spaceship',
    sound_spaceship_desc: 'Cockpit Hum',
    sound_sub: 'Submarine',
    sound_sub_desc: 'Underwater',
    levels: ['Focus Starter', 'Flow Explorer', 'Productivity Pro', 'Dopamine Master', 'Zen Grandmaster'],
    praise: [
      'Awesome!', 'Done!', 'Clean!', 'Top notch!', 'Nice work!', 'Brilliant!',
      'Outstanding!', 'Incredible!', 'Phenomenal!', 'Boom, done!', 'Level up!',
      'Pure magic!', 'Keep it up!', 'Fabulous!', 'Excellent!', 'Productivity monster!'
    ],
    zen: 'Focus',

    // TOASTS, ALERTS & DETAILED MESSAGES
    toast_no_undo: 'Nothing to undo.',
    toast_undo_applied: 'Undo applied.',
    toast_import_success: 'Plan imported successfully!',
    toast_import_error: 'Error importing file.',
    toast_reset_success: 'Reset complete!',
    toast_appointment_saved: 'Appointment saved! 📅',
    toast_appointment_name_error: 'Please enter appointment name.',
    toast_task_deleted: 'Task deleted',
    toast_task_restored: 'Task restored',
    toast_zen_active: 'Zen Focus active 🧘',
    toast_zen_inactive: 'Zen Focus off',
    timer_session_finished: 'Focus session finished! ☕',
    timer_recommendation: 'Break recommendation',
    timer_started_toast: 'Focus Timer started ⏱️',
    sound_started_toast: 'Focus Sound started 🎧',
    sound_stopped_toast: 'Focus Sound stopped',
    music_playing_toast: 'Playing music:',
    dopamine_kick_title: 'Need a quick boost of motivation?',
    dopamine_kick_start: '⚡ Start Kick',
    dopamine_kick_done: 'Done! 🎉 (+25 XP)',
    dopamine_kick_other: 'Other Kick 🔄',
    dopamine_kick_success_log: '⚡ Dopamine Kick:',
    dopamine_kick_completed_toast: 'Dopamine kick completed! ⚡',
    appointment_new_btn: '＋ Add Appointment',
    appointment_form_title: 'New Appointment',
    appointment_form_name_placeholder: 'Appointment (e.g., Dentist)...',
    appointment_form_date_label: 'Date',
    appointment_form_time_label: 'Time',
    appointment_form_save_btn: 'Save',
    appointment_form_cancel_btn: 'Cancel',
    date_badge_today: '📍 Today',
    date_badge_tomorrow: '🗓️ Tomorrow'
  },
  de: {
    weekly: 'Haushalt',
    daily: 'Heute',
    todo: 'To-do',
    done: 'Erledigt',
    termine: 'Termine',
    occasionally: 'Gelegentlich',
    notes: 'Notizen',
    add: 'Aufgabe hinzufügen',
    report: 'Statistik',
    report_title: 'Protokoll & Statistiken',
    settings: 'Optionen',
    whatnow: 'Was nun?',
    notesPlaceholder: 'Schreibe hier deine Notizen auf...',
    give_feedback: 'Feedback geben',
    feedback: 'Feedback',
    feedback_desc: 'Wie gefällt dir Flow? Deine Meinung hilft uns sehr!',
    feedback_placeholder: 'Deine Nachricht...',
    feedback_greet: 'Hey, ich bin jmonke! 👋',
    feedback_prompt: 'Hast du Kritik, Korrekturen oder neue Ideen für Flow? Schreib mir kurz, ich freue mich über jede Rückmeldung!',
    feedback_alt: 'Alternativ direkt an jmonke@gmail.com',
    feedback_send_tooltip: 'Oder schicke direkt eine Mail an jmonke@gmail.com',
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
    rate_stat: 'Quote',
    weekly_activity: '7-Tage-Aktivität (Mo-So)',
    export: 'Export',
    loading_stats: 'Statistiken werden geladen...',
    login_btn: 'Anmelden',
    sync_title: 'Geräte-Synchronisation',
    sync_desc: 'Übertrage und sichere deinen Plan nahtlos auf all deinen Geräten.',
    login: 'Einloggen',
    register: 'Registrieren',
    title_undo: 'Rückgängig',
    title_open: 'Plan öffnen',
    title_save: 'Plan speichern',
    title_reset: 'Zurücksetzen',
    title_theme: 'Farbschema',
    options_title: 'Optionen & Einstellungen',
    theme_select: 'Farbschema (Theme)',
    lang_select: 'Sprache',
    sounds: 'Sounds',
    soundscape_title: 'Fokus-Sounds',
    music: 'Musik',
    music_player: 'Musik-Player',
    custom_tracks: 'Eigene Tracks abspielen',
    no_tracks: 'Keine Titel geladen',
    boost_btn: 'Funke',
    boost_desc: 'Fühlst du dich blockiert? Gönn dir eine winzige, 30-sekündige Aktivität, um deinen Fokus neu auszurichten:',
    boost_placeholder: 'Klicke unten für einen Vorschlag!',
    boost_new: 'Neuer Vorschlag 🔄',
    sound_rain: 'Regen',
    sound_rain_desc: 'Pink Noise',
    sound_ocean: 'Ozean',
    sound_ocean_desc: 'Brown Waves',
    sound_birds: 'Vögel',
    sound_birds_desc: 'Waldgezwitscher',
    sound_thunder: 'Gewitter',
    sound_thunder_desc: 'Sturmsound',
    sound_wind: 'Sanfter Wind',
    sound_wind_desc: 'White Noise',
    sound_fire: 'Feuer',
    sound_fire_desc: 'Warmes Knistern',
    sound_cafe: 'Café',
    sound_cafe_desc: 'Cozy Gemurmel',
    sound_crickets: 'Wiese',
    sound_crickets_desc: 'Grillenzirpen',
    sound_white: 'Rauschen',
    sound_white_desc: 'Weißes Rauschen',
    sound_purr: 'Schnurren',
    sound_purr_desc: 'Katzensound',
    sound_jungle: 'Dschungel',
    sound_jungle_desc: 'Natur & Vögel',
    sound_train: 'Zugfahrt',
    sound_train_desc: 'Gleis-Loop',
    sound_library: 'Bibliothek',
    sound_library_desc: 'Seitenrascheln',
    sound_keyboard: 'Tastatur',
    sound_keyboard_desc: 'Tippgeräusche',
    sound_spaceship: 'Spaceship',
    sound_spaceship_desc: 'Cockpit-Brummen',
    sound_sub: 'U-Boot',
    sound_sub_desc: 'Unterwasser',
    levels: ['Fokus-Starter', 'Flow-Entdecker', 'Produktivitäts-Profi', 'Dopamin-Meister', 'Zen-Großmeister'],
    praise: [
      'Stark!', 'Erledigt!', 'Sauber!', 'Top!', 'Meisterhaft!', 'Unglaublich!',
      'Genial!', 'Fantastisch!', 'Wunderbar!', 'Einfach magisch!', 'Boom, geschafft!',
      'Level up!', 'Produktivitäts-Held:in!', 'Hervorragend!', 'Ausgezeichnet!',
      'Keks verdient! 🍪', 'Und wech! 🪄', 'Schon wieder fertig? Angeber! 😜'
    ],
    zen: 'Fokus',

    // TOASTS, ALERTS & DETAILED MESSAGES
    toast_no_undo: 'Keine Änderungen zum Rückgängig machen.',
    toast_undo_applied: 'Rückgängig gemacht.',
    toast_import_success: 'Plan erfolgreich importiert!',
    toast_import_error: 'Fehler beim Importieren der Datei.',
    toast_reset_success: 'Zurückgesetzt!',
    toast_appointment_saved: 'Termin eingetragen! 📅',
    toast_appointment_name_error: 'Bitte Name für den Termin eingeben.',
    toast_task_deleted: 'Aufgabe gelöscht',
    toast_task_restored: 'Aufgabe wiederhergestellt',
    toast_zen_active: 'Zen-Modus aktiv 🧘',
    toast_zen_inactive: 'Zen-Modus aus',
    timer_session_finished: 'Fokus-Zeit abgelaufen! ☕',
    timer_recommendation: 'Empfehlung für deine Pause',
    timer_started_toast: 'Fokus-Timer gestartet ⏱️',
    sound_started_toast: 'Focus Sound gestartet 🎧',
    sound_stopped_toast: 'Focus Sound gestoppt',
    music_playing_toast: 'Spiele Musik:',
    dopamine_kick_title: 'Brauchst du einen schnellen Motivationsschub?',
    dopamine_kick_start: '⚡ Kick starten',
    dopamine_kick_done: 'Erledigt! 🎉 (+25 XP)',
    dopamine_kick_other: 'Anderer Kick 🔄',
    dopamine_kick_success_log: '⚡ Dopamin-Kick:',
    dopamine_kick_completed_toast: 'Dopamin-Kick geschafft! ⚡',
    appointment_new_btn: '＋ Termin eintragen',
    appointment_form_title: 'Neuer Termin',
    appointment_form_name_placeholder: 'Termin Name (z.B. Zahnarzt)...',
    appointment_form_date_label: 'Datum',
    appointment_form_time_label: 'Uhrzeit',
    appointment_form_save_btn: 'Speichern',
    appointment_form_cancel_btn: 'Abbrechen',
    date_badge_today: '📍 Heute',
    date_badge_tomorrow: '🗓️ Morgen'
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
    report: 'Estadísticas',
    report_title: 'Historial y Estadísticas',
    settings: 'Opciones',
    whatnow: '¿Y ahora qué?',
    notesPlaceholder: 'Escribe tus notas aquí...',
    give_feedback: 'Enviar Comentarios',
    feedback: 'Comentarios',
    feedback_desc: '¿Qué te parece Flow? ¡Tu opinión nos ayuda mucho!',
    feedback_placeholder: 'Tu mensaje...',
    feedback_greet: '¡Hola, soy jmonke! 👋',
    feedback_prompt: '¿Tienes críticas, correcciones o nuevas ideas para Flow? ¡Escríbeme, siempre me alegra saber de ti!',
    feedback_alt: 'O envía un correo a jmonke@gmail.com',
    feedback_send_tooltip: 'O escribe directamente a jmonke@gmail.com',
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
    weekly_activity: 'Actividad semanal (Lun-Dom)',
    export: 'Exportar',
    loading_stats: 'Cargando estadísticas...',
    login_btn: 'Acceder',
    sync_title: 'Sincronización',
    sync_desc: 'Transfiere y guarda tu plan de forma segura en todos tus dispositivos.',
    login: 'Iniciar sesión',
    register: 'Registrarse',
    title_undo: 'Deshacer',
    title_open: 'Abrir plan',
    title_save: 'Guardar plan',
    title_reset: 'Restablecer todo',
    title_theme: 'Tema de color',
    options_title: 'Opciones y Ajustes',
    theme_select: 'Tema de Color',
    lang_select: 'Idioma',
    sounds: 'Sonidos',
    soundscape_title: 'Sonidos de Enfoque',
    music: 'Música',
    music_player: 'Reproductor de Música',
    custom_tracks: 'Reproducir pistas propias',
    no_tracks: 'Sin pistas cargadas',
    boost_btn: 'Chispa',
    boost_desc: '¿Te sientes bloqueado? Haz una microactividad de 30 segundos para reenfocar tu mente:',
    boost_placeholder: '¡Haz clic abajo para recibir una sugerencia!',
    boost_new: 'Nueva Propuesta 🔄',
    sound_rain: 'Lluvia',
    sound_rain_desc: 'Ruido Rosa',
    sound_ocean: 'Océano',
    sound_ocean_desc: 'Ondas Marinas',
    sound_birds: 'Aves',
    sound_birds_desc: 'Canto de Bosque',
    sound_thunder: 'Tormenta',
    sound_thunder_desc: 'Truenos',
    sound_wind: 'Viento',
    sound_wind_desc: 'Ruido Blanco',
    sound_fire: 'Fuego',
    sound_fire_desc: 'Crujido Cálido',
    sound_cafe: 'Cafetería',
    sound_cafe_desc: 'Gemurmul Acogedor',
    sound_crickets: 'Prado',
    sound_crickets_desc: 'Grillo Cantando',
    sound_white: 'Estática',
    sound_white_desc: 'Ruido Blanco',
    sound_purr: 'Ronroneo',
    sound_purr_desc: 'Sonido de Gato',
    sound_jungle: 'Selva',
    sound_jungle_desc: 'Naturaleza y Aves',
    sound_train: 'Tren',
    sound_train_desc: 'Bucle de Vías',
    sound_library: 'Biblioteca',
    sound_library_desc: 'Hojas Crujientes',
    sound_keyboard: 'Teclado',
    sound_keyboard_desc: 'Sonido de Teclas',
    sound_spaceship: 'Astronave',
    sound_spaceship_desc: 'Zumbido de Cabina',
    sound_sub: 'Submarino',
    sound_sub_desc: 'Bajo el Agua',
    levels: ['Principiante de Enfoque', 'Explorador de Flow', 'Profesional de Productividad', 'Maestro de Dopamina', 'Gran Maestro Zen'],
    praise: [
      '¡Fantástico!', '¡Hecho!', '¡Excelente!', '¡Genial!', '¡Nivel arriba!', '¡Increíble!',
      '¡Sensacional!', '¡Qué productivo!', '¡A por la siguiente!', '¡Dominado! ⚡'
    ],
    zen: 'Enfoque',

    // TOASTS, ALERTS & DETAILED MESSAGES
    toast_no_undo: 'Nada que deshacer.',
    toast_undo_applied: 'Deshacer aplicado.',
    toast_import_success: '¡Plan importado con éxito!',
    toast_import_error: 'Error al importar el archivo.',
    toast_reset_success: '¡Restablecimiento completo!',
    toast_appointment_saved: '¡Cita guardada! 📅',
    toast_appointment_name_error: 'Por favor, introduce el nombre de la cita.',
    toast_task_deleted: 'Tarea eliminada',
    toast_task_restored: 'Tarea restaurada',
    toast_zen_active: 'Enfoque Zen activo 🧘',
    toast_zen_inactive: 'Enfoque Zen desactivado',
    timer_session_finished: '¡Sesión de enfoque terminada! ☕',
    timer_recommendation: 'Recomendación de descanso',
    timer_started_toast: 'Temporizador iniciado ⏱️',
    sound_started_toast: 'Sonido iniciado 🎧',
    sound_stopped_toast: 'Sonido detenido',
    music_playing_toast: 'Reproduciendo música:',
    dopamine_kick_title: '¿Necesitas un impulso rápido de motivación?',
    dopamine_kick_start: '⚡ Iniciar impulso',
    dopamine_kick_done: '¡Hecho! 🎉 (+25 XP)',
    dopamine_kick_other: 'Otro impulso 🔄',
    dopamine_kick_success_log: '⚡ Impulso de dopamina:',
    dopamine_kick_completed_toast: '¡Impulso completado! ⚡',
    appointment_new_btn: '＋ Añadir cita',
    appointment_form_title: 'Nueva Cita',
    appointment_form_name_placeholder: 'Cita (ej. Dentista)...',
    appointment_form_date_label: 'Fecha',
    appointment_form_time_label: 'Hora',
    appointment_form_save_btn: 'Guardar',
    appointment_form_cancel_btn: 'Cancelar',
    date_badge_today: '📍 Hoy',
    date_badge_tomorrow: '🗓️ Mañana'
  },
  el: {
    // GRIECHISCHE CAPITAL TRANSLATIONS OHNE TONOI (GEMÄSS USER-ABSPRACHE)
    weekly: 'ΣΠΙΤΙ',
    daily: 'ΣΗΜΕΡΑ',
    todo: 'ΛΙΣΤΑ',
    done: 'ΟΛΟΚΛΗΡΩΘΗΚΑΝ',
    termine: 'ΡΑΝΤΕΒΟΥ',
    occasionally: 'ΠΕΡΙΣΤΑΣΙΑΚΑ',
    notes: 'ΣΗΜΕΙΩΣΕΙΣ',
    report_title: 'ΙΣΤΟΡΙΚΟ & ΣΤΑΤΙΣΤΙΚΑ',
    zen_title: 'ΖΕΝ ΕΣΤΙΑΣΗ',
    soundscape_title: 'ΗΧΟΙ ΕΣΤΙΑΣΗΣ',
    timer_title: 'ΧΡΟΝΟΜΕΤΡΟ ΕΣΤΙΑΣΗΣ',
    options_title: 'ΕΠΙΛΟΓΕΣ & ΡΥΘΜΙΣΕΙΣ',
    date_badge_today: '📍 ΣΗΜΕΡΑ',
    date_badge_tomorrow: '🗓️ ΑΥΡΙΟ',
    
    // Normale gemischte Groß- und Kleinschreibung (inkl. korrekter Akzente)
    add: 'Προσθήκη',
    report: 'Στατιστικά',
    settings: 'Επιλογές',
    whatnow: 'Και τώρα τι;',
    notesPlaceholder: 'Γράψε τις σημειώσεις σου...',
    give_feedback: 'Αποστολή Σχολίων',
    feedback: 'Σχόλια',
    feedback_desc: 'Πώς σου φαίνεται το Flow; Η γνώμη σου μας βοηθάει πολύ!',
    feedback_placeholder: 'Το μήνυμά σου...',
    feedback_greet: 'Γεια, είμαι ο jmonke! 👋',
    feedback_prompt: 'Έχεις σχόλια, διορθώσεις ή νέες ιδέες για το Flow; Γράψε μου σύντομα, χαίρομαι για κάθε μήνυμα!',
    feedback_alt: 'Εναλλακτικά απευθείας στο jmonke@gmail.com',
    feedback_send_tooltip: 'Ή στείλε απευθείας email στο jmonke@gmail.com',
    send: 'Αποστολή',
    next_rec: 'Επόμενη Πρόταση',
    start_focus: 'Έναρξη Εστίασης',
    other_suggestion: 'Άλλη Πρόταση',
    open_steps: 'Άνοιγμα Βημάτων',
    completed: 'Ολοκληρώθηκε!',
    start: 'Έναρξη',
    stop: 'Διακοπή',
    steps_btn: 'Βήματα',
    steps_tab: 'Βήματα',
    pick_desc: 'Πελαγωμένος από πολλές εργασίες; Άφησε να σου προτείνω μια κατάλληλη εργασία με βάση την προτεραιότητά σου:',
    next_suggestion: '🎲 Επόμενη Πρόταση',
    steps_desc: 'Επίλεξε μια εργασία για να δεις τον οδηγό βήμα προς βήμα:',
    start_timer: 'Έναρξη Χρονομέτρου',
    dropdown_placeholder: '-- Επιλογή εργασίας από το πλάνο σου --',
    today: 'Σήμερα',
    week: 'Εβδομάδα',
    month: 'Μήνας',
    completed_stat: 'Έγινε',
    rate_stat: 'Ποσοστό',
    weekly_activity: 'Δραστηριότητα 7 ημερών (Δευ-Κυρ)',
    export: 'Εξαγωγή',
    loading_stats: 'Φόρτωση στατιστικών...',
    login_btn: 'Είσοδος',
    sync_title: 'Συγχρονισμός Συσκευών',
    sync_desc: 'Μετάφερε και δημιούργησε αντίγραφα ασφαλείας του πλάνου σου με ασφάλεια σε όλες τις συσκευές σου.',
    login: 'Σύνδεση',
    register: 'Εγγραφή',
    title_undo: 'Αναίρεση',
    title_open: 'Άνοιγμα Πλάνου',
    title_save: 'Αποθήκευση Πλάνου',
    title_reset: 'Επαναφορά',
    title_theme: 'Θέμα Εμφάνισης',
    theme_select: 'Θέμα Εμφάνισης',
    lang_select: 'Γλώσσα',
    sounds: 'Ήχοι',
    music: 'Μουσική',
    music_player: 'Αναπαραγωγή Μουσικής',
    custom_tracks: 'Αναπαραγωγή δικών σου κομματιών',
    no_tracks: 'Δεν φορτώθηκαν κομμάτια',
    boost_btn: 'Σπίθα',
    boost_desc: 'Νιώθεις κολλημένος; Κάνε μια μικρή δραστηριότητα 30 δευτερολέπτων για να επανεστιαστείς:',
    boost_placeholder: 'Κάνε κλικ παρακάτω για μια πρόταση!',
    boost_new: 'Νέα Πρόταση 🔄',
    sound_rain: 'Βροχή',
    sound_rain_desc: 'Ροζ Θόρυβος',
    sound_ocean: 'Ωκεανός',
    sound_ocean_desc: 'Καφέ Θόρυβος',
    sound_birds: 'Πουλιά',
    sound_birds_desc: 'Κελάηδισμα Δάσους',
    sound_thunder: 'Καταιγίδα',
    sound_thunder_desc: 'Ήχοι Θύελλας',
    sound_wind: 'Άνεμος',
    sound_wind_desc: 'Λευκός Θόρυβος',
    sound_fire: 'Φωτιά',
    sound_fire_desc: 'Ζεστό Τρίξιμο',
    sound_cafe: 'Καφετέρια',
    sound_cafe_desc: 'Ζεστό Ψίθυρο',
    sound_crickets: 'Λιβάδι',
    sound_crickets_desc: 'Τριζόνια',
    sound_white: 'Παράσιτα',
    sound_white_desc: 'Λευκός Θόρυβος',
    sound_purr: 'Γουργούρισμα',
    sound_purr_desc: 'Ήχος Γάτας',
    sound_jungle: 'Ζούγκλα',
    sound_jungle_desc: 'Φύση & Πουλιά',
    sound_train: 'Τρένο',
    sound_train_desc: 'Ήχος Ραγών',
    sound_library: 'Βιβλιοθήκη',
    sound_library_desc: 'Θρόισμα Σελίδων',
    sound_keyboard: 'Πληκτρολόγιο',
    sound_keyboard_desc: 'Ήχος Πλήκτρων',
    sound_spaceship: 'Διαστημόπλοιο',
    sound_spaceship_desc: 'Βουητό Θαλάμου',
    sound_sub: 'Υποβρύχιο',
    sound_sub_desc: 'Κάτω από το Νερό',
    levels: ['Αρχάριος Εστίασης', 'Εξερευνητής Ροής', 'Επαγγελματίας Παραγωγικότητας', 'Κυρίαρχος Ντοπαμίνης', 'Μέγας Δάσκαλος Ζεν'],
    praise: [
      'Μπράβο!', 'Έγινε!', 'Τέλεια!', 'Εξαιρετικά!', 'Level up!', 'Φανταστικά!',
      'Απίστευτο!', 'Είσαι μηχανή παραγωγικότητας!', 'Συνέχισε έτσι! ⚡'
    ],
    zen: 'Εστίαση',

    // TOASTS, ALERTS & DETAILED MESSAGES
    toast_no_undo: 'Δεν υπάρχει κάτι για αναίρεση.',
    toast_undo_applied: 'Η αναίρεση εφαρμόστηκε.',
    toast_import_success: 'Το πλάνο εισήχθη με επιτυχία!',
    toast_import_error: 'Σφάλμα κατά την εισαγωγή του αρχείου.',
    toast_reset_success: 'Η επαναφορά ολοκληρώθηκε!',
    toast_appointment_saved: 'Το ραντεβού αποθηκεύτηκε! 📅',
    toast_appointment_name_error: 'Παρακαλώ εισάγετε όνομα ραντεβού.',
    toast_task_deleted: 'Η εργασία διαγράφηκε',
    toast_task_restored: 'Η εργασία επαναφέρθηκε',
    toast_zen_active: 'Η εστίαση Ζεν είναι ενεργή 🧘',
    toast_zen_inactive: 'Η εστίαση Ζεν απενεργοποιήθηκε',
    timer_session_finished: 'Η συνεδρία εστίασης ολοκληρώθηκε! ☕',
    timer_recommendation: 'Πρόταση για διάλειμμα',
    timer_started_toast: 'Το χρονόμετρο ξεκίνησε ⏱️',
    sound_started_toast: 'Ο ήχος ξεκίνησε 🎧',
    sound_stopped_toast: 'Ο ήχος σταμάτησε',
    music_playing_toast: 'Αναπαραγωγή μουσικής:',
    dopamine_kick_title: 'Χρειάζεσαι μια γρήγορη δόση παρακίνησης;',
    dopamine_kick_start: '⚡ Έναρξη',
    dopamine_kick_done: 'Έγινε! 🎉 (+25 XP)',
    dopamine_kick_other: 'Άλλη επιλογή 🔄',
    dopamine_kick_success_log: '⚡ Δόση ντοπαμίνης:',
    dopamine_kick_completed_toast: 'Η δόση ντοπαμίνης ολοκληρώθηκε! ⚡',
    appointment_new_btn: '＋ Προσθήκη Ραντεβού',
    appointment_form_title: 'Νέο Ραντεβού',
    appointment_form_name_placeholder: 'Ραντεβού (π.χ. Οδοντίατρος)...',
    appointment_form_date_label: 'Ημερομηνία',
    appointment_form_time_label: 'Ώρα',
    appointment_form_save_btn: 'Αποθήκευση',
    appointment_form_cancel_btn: 'Ακύρωση'
  }
};

// Warmherzige Pausen-Empfehlungen für ADHD (Ablenkung & Bewegung)
const BREAK_TIPS = {
  de: [
    "Mache 5 Kniebeugen oder strecke deinen Körper einmal kräftig durch!",
    "Trinke ein großes Glas frisches, kaltes Wasser!",
    "Blicke für 1 Minute aus dem Fenster in die Ferne, um deine Augen zu entspannen!",
    "Schüttle deine Arme und Beine für 15 Sekunden kräftig aus (Dopamin-Reset)!",
    "Atme 5-mal ganz tief durch die Nase ein und langsam durch den Mund wieder aus!"
  ],
  en: [
    "Do 5 squats or stretch your body vigorously!",
    "Drink a large glass of fresh, cold water!",
    "Look out the window into the distance for 1 minute to relax your eyes!",
    "Shake out your arms and legs for 15 seconds (dopamine reset)!",
    "Take 5 deep breaths in through your nose and slowly out through your mouth!"
  ],
  es: [
    "¡Haz 5 sentadillas o estira tu cuerpo con fuerza!",
    "¡Bebe un vaso grande de agua fresca y fría!",
    "¡Mira por la ventana hacia el horizonte durante 1 minuto para relajar los ojos!",
    "¡Sacude tus brazos y piernas con fuerza durante 15 segundos (reajuste de dopamina)!",
    "¡Inhala profundamente 5 veces por la nariz y exhala lentamente por la boca!"
  ],
  el: [
    "Κάνε 5 βαθιά καθίσματα ή τέντωσε το σώμα σου καλά!",
    "Πιες ένα μεγάλο ποτήρι φρέσκο, κρύο νερό!",
    "Κοίταξε έξω από το παράθυρο στο βάθος για 1 λεπτό για να χαλαρώσεις τα μάτια σου!",
    "Τίναξε τα χέρια και τα πόδια σου δυνατά για 15 δευτερόλεπτα (επαναφορά ντοπαμίνης)!",
    "Πάρε 5 βαθιές ανάσες από τη μύτη και εξέπνευσε αργά από το στόμα!"
  ]
};

// Psychologische Micro-Steps zur Überwindung von Blockaden
const DOPAMINE_TASKS = {
  de: [
    "Trinke 3 Schlucke frisches Wasser 💧",
    "Strecke deine Arme 10 Sekunden lang fest Richtung Decke 🙋‍♂️",
    "Räume einen einzigen Gegenstand auf deinem Tisch auf 🧹",
    "Schüttle deine Hände 15 Sekunden lang ganz locker aus 🫨",
    "Atme 3-mal ganz tief durch deine Nase ein und den Mund aus 🌬️",
    "Rolle deine Schultern 5-mal langsam nach hinten 🧘",
    "Lächle dich selbst im Spiegel oder auf dem ausgeschalteten Bildschirm für 10 Sekunden an! 😁",
    "Kreise deine Fußgelenke 5-mal in beide Richtungen 🦶"
  ],
  en: [
    "Drink 3 sips of fresh water 💧",
    "Stretch your arms tightly towards the ceiling for 10 seconds 🙋‍♂️",
    "Tidy up a single object on your desk 🧹",
    "Vigorously shake out your hands for 15 seconds 🫨",
    "Take 3 deep breaths in through your nose and out through your mouth 🌬️",
    "Roll your shoulders slowly backwards 5 times 🧘",
    "Smile at yourself in the mirror or on your black screen for 10 seconds! 😁",
    "Rotate your ankles 5 times in both directions 🦶"
  ],
  es: [
    "Bebe 3 sorbos de agua fresca 💧",
    "Estira tus brazos firmemente hacia el techo durante 10 segundos 🙋‍♂️",
    "Ordena un solo objeto en tu escritorio 🧹",
    "Sacude tus manos muy relajadamente durante 15 segundos 🫨",
    "Inhala profundamente 3 veces por la nariz y exhala por la boca 🌬️",
    "Gira tus hombros lentamente hacia atrás 5 veces 🧘",
    "¡Sonríete al espejo o a tu pantalla apagada durante 10 segundos! 😁",
    "Gira tus tobillos 5 veces en ambas direcciones 🦶"
  ],
  el: [
    "Πιες 3 γουλιές φρέσκο νερό 💧",
    "Τέντωσε τα χέρια σου ψηλά προς το ταβάνι για 10 δευτερόλεπτα 🙋‍♂️",
    "Τακτοποίησε ένα μόνο αντικείμενο στο γραφείο σου 🧹",
    "Τίναξε τα χέρια σου πολύ χαλαρά για 15 δευτερόλεπτα 🫨",
    "Πάρε 3 βαθιές ανάσες από τη μύτη και εξέπνευσε από το στόμα 🌬️",
    "Κύλισε τους ώμους σου αργά προς τα πίσω 5 φορές 🧘",
    "Χαμογέλασε στον εαυτό σου στον καθρέφτη ή στην κλειστή οθόνη για 10 δευτερόλεπτα! 😁",
    "Κάνε κύκλους με τους αστραγάλους σου 5 φορές και προς τις δύο κατευθύνσεις 🦶"
  ]
};

// 40 psychologische und abwechslungsreiche ADHD-Kurzaktivitäten für den Dopamin-Funken
const BOOST_ACTIVITIES = {
  de: [
    "Atme 3-mal tief durch deine Nase ein und gaaaaanz langsam durch deinen Mund wieder aus. 🌬️",
    "Trinke ein großes Glas frisches, kaltes Wasser, um deine Gehirnzellen aufzuwecken! 💧",
    "Rolle deine Schultern 5-mal langsam nach hinten. 🧘",
    "Steh kurz auf, strecke deine Arme fest Richtung Decke aus und mach dich ganz lang. 🙋‍♂️",
    "Kreise deine Hand- und Fußgelenke 5-mal in beide Richtungen. 🦶",
    "Schüttle deine Hände 15 Sekunden lang ganz locker aus (Dopamin-Reset)! 🫨",
    "Blicke für 15 Sekunden aus dem Fenster auf den am weitesten entfernten Punkt. 🌲",
    "Laufe einmal quer durch den Raum, tipp kurz an die Wand und komm wieder zurück! 🏃",
    "Lächle dich selbst im Spiegel oder auf dem schwarzen Bildschirm für 10 Sekunden an! 😁",
    "Massiere deine Ohrmuscheln sanft für 10 Sekunden von oben nach unten. 👂",
    "Schließe deine Augen und nimm 3 verschiedene Geräusche um dich herum bewusst wahr. 🎧",
    "Schneide eine super lustige Grimasse, um deine gesamte Gesichtsmuskulatur zu entspannen! 🤪",
    "Klopfe deine Arme und Beine von oben nach unten sanft ab (Aktivierung). 🫳",
    "Knülle ein Papier zusammen und wirf es als Zielwurf in deinen Papierkorb! 🏀",
    "Tu für 10 Sekunden so, als würdest du ein Musikinstrument wie Luftgitarre spielen! 🎸",
    "Zähle rückwärts von 20 auf 0 in Dreierschritten (20, 17, 14...). 🧠",
    "Öffne deinen Kiefer weit und gähne einmal tief, um Gesichtsspannungen zu lösen! 🥱",
    "Reibe deine Handflächen kräftig aneinander, bis sie richtig schön warm werden! 👐",
    "Trommle deine Finger für 10 Sekunden wie auf einem Klavier auf den Tisch. 🎹",
    "Hüpfe für 10 Sekunden leicht federnd auf der Stelle. ⚡",
    "Summe deine Lieblingsmelodie für 15 Sekunden vor dich hin. 🎵",
    "Umfasse deine Hände hinter dem Rücken und zieh deine Brust nach vorne auf (Dehnen). 🙆‍♀️",
    "Suche einen roten Gegenstand in deiner direkten Umgebung und fokussiere ihn für 5 Sekunden. 🔴",
    "Drücke deine Zungenspitze für 10 Sekunden fest gegen deinen Gaumen. 👅",
    "Mache 5 langsame Kniebeugen, um das Blut in deine Beine zu bringen. 🏋️",
    "Balanciere für 10 Sekunden auf einem Bein und schließe dabei die Augen! 🤸",
    "Knete oder massiere deine Nackenmuskeln mit beiden Händen für 15 Sekunden. 💆‍♂️",
    "Finde einen kreisförmigen Gegenstand im Raum und fahre seine Konturen mit den Augen ab. ⭕",
    "Nimm dir ein Buch oder Magazin und lies ein einziges zufälliges Wort laut vor. 📖",
    "Reibe deine Daumen- und Zeigefingerspitzen für 10 Sekunden aneinander (Sinnreiz). 🤌",
    "Verändere deine Sitzposition um 90 Grad oder sitze für 20 Sekunden kerzengerade aufrecht. 🪑",
    "Mach deine Augen ganz weit auf, kneife sie dann fest zusammen und öffne sie wieder. 👁️",
    "Führe deinen Ellenbogen für 5 Sekunden zum diagonalen Knie (Cross-Crawl). 🏃‍♂️",
    "Bewege deine Zehen in deinen Schuhen oder Socken ganz wild hin und her. 🧦",
    "Nenne 3 Dinge in deinem Kopf, für die du heute dankbar bist. 🌸",
    "Klopfe mit deinen Fingerspitzen ganz sanft dein Gesicht ab (Tapping). 💆‍♀️",
    "Denke an ein Tier, das mit dem Anfangsbuchstaben deines Namens beginnt. 🦁",
    "Atme tief ein, halte die Luft für 4 Sekunden an, und atme langsam wieder aus (Box-Breathing). 🫁",
    "Klopfe dir einmal kräftig selbst auf die Schulter! Das machst du gut. 👏",
    "Spreize deine Finger so weit wie möglich, halte sie für 5 Sekunden und entspanne sie. 🖐️"
  ],
  en: [
    "Take 3 deep breaths in through your nose and exhale veeeery slowly. 🌬️",
    "Drink a large glass of cold water to awaken your brain cells! 💧",
    "Roll your shoulders slowly backwards 5 times. 🧘",
    "Stand up, stretch your arms tightly towards the ceiling and make yourself tall. 🙋‍♂️",
    "Rotate your wrist and ankle joints 5 times in both directions. 🦶",
    "Vigorously shake out your hands for 15 seconds (dopamine reset)! 🫨",
    "Look out the window at the furthest point for 15 seconds. 🌲",
    "Walk once across the room, tap the wall, and come back! 🏃",
    "Smile at yourself in the mirror or black screen for 10 seconds! 😁",
    "Gently massage your earlobes from top to bottom for 10 seconds. 👂",
    "Close your eyes and try to identify 3 different sounds around you. 🎧",
    "Make a funny face to completely relax all your muscles! 🤪",
    "Gently pat down your arms and legs from top to bottom (activation). 🫳",
    "Crumple a piece of paper and throw it into the trash can as a target practice! 🏀",
    "Pretend to play a musical instrument like an air guitar for 10 seconds! 🎸",
    "Count backwards from 20 to 0 in steps of 3 (20, 17, 14...). 🧠",
    "Open your jaw wide and yawn deeply to release facial tension! 🥱",
    "Rub your palms vigorously together until they get really warm! 👐",
    "Drum your fingers on the desk for 10 seconds like on a piano. 🎹",
    "Bounce lightly on the spot for 10 seconds. ⚡",
    "Hum your favorite melody for 15 seconds. 🎵",
    "Clasp your hands behind your back and open up your chest (stretch). 🙆‍♀️",
    "Find a red object in your immediate vicinity and focus on it for 5 seconds. 🔴",
    "Press the tip of your tongue firmly against the roof of your mouth for 10 seconds. 👅",
    "Do 5 slow squats to get the blood pumping into your legs. 🏋️",
    "Balance on one leg for 10 seconds and close your eyes! 🤸",
    "Knead or massage your neck muscles with both hands for 15 seconds. 💆‍♂️",
    "Find a circular object in the room and trace its contours with your eyes. ⭕",
    "Grab a book or magazine and read a single random word out loud. 📖",
    "Rub your thumb and index finger tips together for 10 seconds (sensory stimulation). 🤌",
    "Change your sitting position by 90 degrees or sit up perfectly straight for 20 seconds. 🪑",
    "Open your eyes very wide, squeeze them shut tightly, and open them again. 👁️",
    "Touch your elbow to your opposite knee (cross-crawl exercise) 5 times. 🏃‍♂️",
    "Wiggle your toes inside your shoes or socks wildly back and forth. 🧦",
    "Name 3 things in your mind that you are grateful for today. 🌸",
    "Gently tap your face with your fingertips (tapping technique). 💆‍♀️",
    "Think of an animal that starts with the first letter of your name. 🦁",
    "Inhale deeply, hold your breath for 4 seconds, and exhale slowly (box breathing). 🫁",
    "Give yourself a firm pat on the back! You are doing great. 👏",
    "Spread your fingers as wide as possible, hold for 5 seconds, then relax. 🖐️"
  ],
  es: [
    "Inhala profundamente 3 veces por la nariz y exhala muuuuy despacio por la boca. 🌬️",
    "¡Bebe un vaso grande de agua fresca y fría para despertar tus neuronas! 💧",
    "Gira tus hombros lentamente hacia atrás 5 veces. 🧘",
    "Ponte de pie, estira los brazos con fuerza hacia el techo y hazte alto. 🙋‍♂️",
    "Gira las articulaciones de la muñeca y el tobillo 5 veces en ambas direcciones. 🦶",
    "¡Sacude vigorosamente tus manos durante 15 segundos (reajuste de dopamina)! 🫨",
    "Mira por la ventana hacia el punto más lejano durante 15 segundos. 🌲",
    "¡Camina una vez por la habitación, toca la pared y regresa! 🏃",
    "¡Sonríete a ti mismo en el espejo o en la pantalla apagada durante 10 segundos! 😁",
    "Masajea suavemente los lóbulos de tus orejas de arriba a abajo durante 10 segundos. 👂",
    "Cierra los ojos e intenta identificar 3 sonidos diferentes a tu alrededor. 🎧",
    "¡Haz una mueca divertida para relajar por completo todos tus músculos faciales! 🤪",
    "Golpea suavemente tus brazos y piernas de arriba a abajo (activación). 🫳",
    "¡Arruga un trozo de papel y lánzalo a la papelera como práctica de tiro! 🏀",
    "¡Imagina tocar un instrumento musical como la guitarra de aire durante 10 segundos! 🎸",
    "Cuenta regresivamente de 20 a 0 en pasos de 3 (20, 17, 14...). 🧠",
    "¡Abre bien la mandíbula y bosteza profundamente para liberar la tensión facial! 🥱",
    "¡Frota tus palmas vigorosamente hasta que se calienten bien! 👐",
    "Golpea tus dedos en el escritorio durante 10 segundos como si tocaras el piano. 🎹",
    "Rebota suavemente en el lugar durante 10 segundos. ⚡",
    "Tararea tu melodía favorita durante 15 segundos. 🎵",
    "Junta tus manos detrás de tu espalda y abre el pecho (estiramiento). 🙆‍♀️",
    "Encuentra un objeto rojo en tu entorno inmediato y enfócate en él durante 5 segundos. 🔴",
    "Presiona firmemente la punta de la lengua contra el paladar durante 10 segundos. 👅",
    "Haz 5 sentadillas lentas para bombear sangre a tus piernas. 🏋️",
    "¡Mantén el equilibrio sobre una pierna durante 10 segundos y cierra los ojos! 🤸",
    "Amasa o masajea los músculos del cuello con ambas manos durante 15 segundos. 💆‍♂️",
    "Encuentra un objeto circular en la habitación y sigue sus contornos con los ojos. ⭕",
    "Toma un libro o revista y lee una sola palabra al azar en voz alta. 📖",
    "Frota las yemas de tus pulgares e índices durante 10 segundos (estímulo sensorial). 🤌",
    "Cambia tu posición al sentarte 90 grados o siéntate perfectamente derecho por 20 segundos. 🪑",
    "Abre bien los ojos, apriétalos con fuerza y vuelve a abrirlos. 👁️",
    "Toca tu codo con la rodilla opuesta (ejercicio cruzado) 5 times. 🏃‍♂️",
    "Muebe los dedos de los pies dentro de tus zapatos o calcetines de un lado a otro. 🧦",
    "Menciona mentalmente 3 cosas por las que estés agradecido hoy. 🌸",
    "Golpea suavemente tu rostro con las yemas de tus dedos (técnica de tapping). 💆‍♀️",
    "Piensa en un animal que comience con la primera letra de tu nombre. 🦁",
    "Inhala profundamente, sostén el aire 4 segundos y exhala lentamente (respiración en caja). 🫁",
    "¡Date una palmadita firme en la espalda! Lo estás haciendo genial. 👏",
    "Separa tus dedos lo más posible, mantén la posición 5 segundos y relájate. 🖐️"
  ],
  el: [
    "Πάρε 3 βαθιές ανάσες από τη μύτη και εξέπνευσε πάαααρα πολύ αργά από το στόμα. 🌬️",
    "Πιες ένα μεγάλο ποτήρι κρύο νερό για να ξυπνήσεις τα εγκεφαλικά σου κύτταρα! 💧",
    "Κύλισε τους ώμους σου αργά προς τα πίσω 5 φορές. 🧘",
    "Σήκω όρθιος, τέντωσε τα χέρια σου ψηλά προς το ταβάνι και κάνε το σώμα σου μακρύ. 🙋‍♂️",
    "Περιστρέψτε τις αρθρώσεις των καρπών και των αστραγάλων 5 φορές και προς τις δύο κατευθύνσεις. 🦶",
    "Τίναξε τα χέρια σου δυνατά για 15 δευτερόλεπτα (επαναφορά ντοπαμίνης)! 🫨",
    "Κοίταξε έξω από το παράθυρο στο πιο μακρινό σημείο για 15 δευτερόλεπτα. 🌲",
    "Περπάτησε μια φορά μέσα στο δωμάτιο, άγγιξε τον τοίχο και επέστρεψε! 🏃",
    "Χαμογέλασε στον εαυτό σου στον καθρέφτη ή στην κλειστή οθόνη για 10 δευτερόλεπτα! 😁",
    "Κάνε απαλό μασάζ στους λοβούς των αυτιών σου από πάνω προς τα κάτω για 10 δευτερόλεπτα. 👂",
    "Κλείσε τα μάτια σου και προσπάθησε να αναγνωρίσεις 3 διαφορετικούς ήχους γύρω σου. 🎧",
    "Κάνε μια αστεία γκριμάτσα για να χαλαρώσεις εντελώς όλους τους μυς του προσώπου σου! 🤪",
    "Χτύπησε απαλά τα χέρια και τα πόδια σου από πάνω προς τα κάτω (ενεργοποίηση). 🫳",
    "Τσαλάκωσε ένα χαρτί και πέταξέ το στο καλάθι των αχρήστων ως άσκηση στόχου! 🏀",
    "Προσποιήσου ότι παίζεις ένα μουσικό όργανο όπως αεροκιθάρα για 10 δευτερόλεπτα! 🎸",
    "Μέτρησε αντίστροφα από το 20 έως το 0 με βήματα των 3 (20, 17, 14...). 🧠",
    "Άνοιξε καλά το σαγόνι σου και χασμουρήσου βαθιά για να απελευθερώσεις την ένταση του προσώπου! 🥱",
    "Τρίψε τις παλάμες σου δυνατά μεταξύ τους μέχρι να ζεσταθούν καλά! 👐",
    "Χτύπησε τα δάχτυλά σου στο γραφείο για 10 δευτερόλεπτα σαν να παίζεις πιάνο. 🎹",
    "Αναπήδησε απαλά στο σημείο για 10 δευτερόλεπτα. ⚡",
    "Σιγοτραγούδησε την αγαπημένη σου μελωδία για 15 δευτερόλεπτα. 🎵",
    "Πλέξε τα χέρια σου πίσω από την πλάτη σου και άνοιξε το στήθος σου (διάταση). 🙆‍♀️",
    "Βρες ένα κόκκινο αντικείμενο στον άμεσο χώρο σου και εστίασε σε αυτό για 5 δευτερόλεπτα. 🔴",
    "Πίεσε σταθερά την άκρη της γλώσσας σου στον ουρανίσκο για 10 δευτερόλεπτα. 👅",
    "Κάνε 5 αργά βαθιά καθίσματα για να στείλεις αίμα στα πόδια σου. 🏋️",
    "Ισορρόπησε στο ένα πόδι για 10 δευτερόλεπτα και κλείσε τα μάτια σου! 🤸",
    "Τρίψε ή κάνε μασάζ στους μυς του αυχένα σου και με τα δύο χέρια για 15 δευτερόλεπτα. 💆‍♂️",
    "Βρες ένα κυκλικό αντικείμενο στο δωμάτιο και ακολούθησε το περίγραμμά του με τα μάτια σου. ⭕",
    "Πάρε ένα βιβλίο ή περιοδικό και διάβασε μια τυχαία λέξη δυνατά. 📖",
    "Τρίψε τις άκρες των αντίχειρων και των δεικτών σου για 10 δευτερόλεπτα (αισθητηριακή διέγερση). 🤌",
    "Άλλαξε τη θέση σου στο κάθισμα κατά 90 μοίρες ή κάθισε εντελώς όρθιος για 20 δευτερόλεπτα. 🪑",
    "Άνοιξε διάπλατα τα μάτια σου, σφίξε τα δυνατά και άνοιξέ τα ξανά. 👁️",
    "Άγγιξε τον αγκώνα σου στο αντίθετο γόνατο (σταυρωτή άσκηση) 5 φορές. 🏃‍♂️",
    "Κούνησε τα δάχτυλα των ποδιών σου μέσα στα παπούχσια ή τις κάλτσες σου πέρα δώθε. 🧦",
    "Σκέψου 3 πράγματα για τα οποία είσαι ευγνώμων σήμερα. 🌸",
    "Χτύπησε απαλά το πρόσωπό σου με τις άκρες των δαχτύλων σου (τεχνική tapping). 💆‍♀️",
    "Σκέψου ένα ζώο που αρχίζει με το πρώτο γράμμα του ονόματός σου. 🦁",
    "Είσπνευσε βαθιά, κράτησε την ανάσα σου για 4 δευτερόλεπτα και εξέπνευσε αργά. 🫁",
    "Δώσε ένα χτύπημα επιβράβευσης στην πλάτη σου! Τα πας εξαιρετικά. 👏",
    "Άπλωσε τα δάχτυλά σου όσο το δυνατόν περισσότερο, κράτησέ τα για 5 δευτερόλεπτα και χαλάρωσε. 🖐️"
  ]
};
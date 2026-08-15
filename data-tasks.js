
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

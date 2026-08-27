(() => {
  // data-tasks.js
  var STORE_KEY2 = "flowPlannerV3";
  var HISTORY_KEY2 = "flowPlannerV3History";
  window.STORE_KEY = STORE_KEY2;
  window.HISTORY_KEY = HISTORY_KEY2;
  var DEFAULT_TASKS_BY_LANG2 = {
    en: {
      daily: ["Meds", "Brush teeth (morning)", "Wash face", "Make bed", "Air out room", "Cook a meal", "Brush teeth (evening)", "Take a shower", "Tidy up"],
      weekly: ["Dusting", "Vacuuming", "Mopping", "Washing dishes", "Washing laundry", "Hanging up laundry", "Cleaning sink & mirror cabinet", "Tiles & bathtub", "Cleaning the toilet", "Taking out the trash", "Returning deposit bottles"],
      occasionally: ["Washing hair", "Cutting hair", "Changing bedsheets", "Clipping nails", "Cleaning doors & windows", "Cleaning stove & fridge"]
    },
    de: {
      daily: ["Medis", "Z\xE4hne morgens", "Gesicht waschen", "Bett machen", "Durchl\xFCften", "Kochen", "Z\xE4hne abends", "Duschen", "Aufr\xE4umen"],
      weekly: ["Staub wischen", "Staubsaugen", "Boden wischen", "Geschirr sp\xFClen", "W\xE4sche waschen", "W\xE4sche aufh\xE4ngen", "Waschbecken & Spiegelschrank putzen", "Fliesen & Badewanne", "Klo putzen", "M\xFCll wegbringen", "Pfandflaschen wegbringen"],
      occasionally: ["Haare waschen", "Haare schneiden", "Bettw\xE4sche tauschen", "N\xE4gel schneiden", "T\xFCre/Fenster putzen", "Herd & K\xFChlschrank putzen"]
    },
    es: {
      daily: ["Medicaci\xF3n", "Cepillarse los dientes (ma\xF1ana)", "Lavarse la cara", "Hacer la cama", "Ventilar", "Cocinar", "Cepillarse los dientes (noche)", "Ducharse", "Ordenar"],
      weekly: ["Quitar el polvo", "Pasar la aspiradora", "Fregar el suelo", "Lavar los platos", "Hacer la colada", "Colgar la ropa", "Limpiar el lavabo y espejo", "Azulejos y ba\xF1era", "Limpiar el v\xE1ter", "Sacar la basura", "Llevar botellas retornables"],
      occasionally: ["Lavarse el pelo", "Cortarse el pelo", "Cambiar las s\xE1banas", "Cortarse las u\xF1as", "Limpiar puertas y ventanas", "Limpiar cocina y nevera"]
    },
    el: {
      daily: ["\u03A6\u03AC\u03C1\u03BC\u03B1\u03BA\u03B1", "\u03A0\u03BB\u03CD\u03C3\u03B9\u03BC\u03BF \u03B4\u03BF\u03BD\u03C4\u03B9\u03CE\u03BD (\u03C0\u03C1\u03C9\u03AF)", "\u03A0\u03BB\u03CD\u03C3\u03B9\u03BC\u03BF \u03C0\u03C1\u03BF\u03C3\u03CE\u03C0\u03BF\u03C5", "\u03A3\u03C4\u03C1\u03CE\u03C3\u03B9\u03BC\u03BF \u03BA\u03C1\u03B5\u03B2\u03B1\u03C4\u03B9\u03BF\u03CD", "\u0391\u03B5\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2 \u03C7\u03CE\u03C1\u03BF\u03C5", "\u039C\u03B1\u03B3\u03B5\u03B9\u03C1\u03B9\u03BA\u03AE", "\u03A0\u03BB\u03CD\u03C3\u03B9\u03BC\u03BF \u03B4\u03BF\u03BD\u03C4\u03B9\u03CE\u03BD (\u03B2\u03C1\u03AC\u03B4\u03C5)", "\u039D\u03C4\u03BF\u03C5\u03C2", "\u03A4\u03B1\u03BA\u03C4\u03BF\u03C0\u03BF\u03AF\u03B7\u03C3\u03B7"],
      weekly: ["\u039E\u03B5\u03C3\u03BA\u03CC\u03BD\u03B9\u03C3\u03BC\u03B1", "\u03A3\u03BA\u03BF\u03CD\u03C0\u03B9\u03C3\u03BC\u03B1", "\u03A3\u03C6\u03BF\u03C5\u03B3\u03B3\u03AC\u03C1\u03B9\u03C3\u03BC\u03B1", "\u03A0\u03BB\u03CD\u03C3\u03B9\u03BC\u03BF \u03C0\u03B9\u03AC\u03C4\u03C9\u03BD", "\u03A0\u03BB\u03CD\u03C3\u03B9\u03BC\u03BF \u03C1\u03BF\u03CD\u03C7\u03C9\u03BD", "\u0386\u03C0\u03BB\u03C9\u03BC\u03B1 \u03C1\u03BF\u03CD\u03C7\u03C9\u03BD", "\u039A\u03B1\u03B8\u03B1\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2 \u03BD\u03B9\u03C0\u03C4\u03AE\u03C1\u03B1 & \u03BA\u03B1\u03B8\u03C1\u03AD\u03C6\u03C4\u03B7", "\u03A0\u03BB\u03B1\u03BA\u03AC\u03BA\u03B9\u03B1 & \u03BC\u03C0\u03B1\u03BD\u03B9\u03AD\u03C1\u03B1", "\u039A\u03B1\u03B8\u03B1\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2 \u03BB\u03B5\u03BA\u03AC\u03BD\u03B7\u03C2", "\u03A0\u03AD\u03C4\u03B1\u03BC\u03B1 \u03C3\u03BA\u03BF\u03C5\u03C0\u03B9\u03B4\u03B9\u03CE\u03BD", "\u0395\u03C0\u03B9\u03C3\u03C4\u03C1\u03BF\u03C6\u03AE \u03AC\u03B4\u03B5\u03B9\u03C9\u03BD \u03BC\u03C0\u03BF\u03C5\u03BA\u03B1\u03BB\u03B9\u03CE\u03BD"],
      occasionally: ["\u039B\u03BF\u03CD\u03C3\u03B9\u03BC\u03BF", "\u039A\u03BF\u03CD\u03C1\u03B5\u03BC\u03B1", "\u0391\u03BB\u03BB\u03B1\u03B3\u03AE \u03C3\u03B5\u03BD\u03C4\u03BF\u03BD\u03B9\u03CE\u03BD", "\u039A\u03CC\u03C8\u03B9\u03BC\u03BF \u03BD\u03C5\u03C7\u03B9\u03CE\u03BD", "\u039A\u03B1\u03B8\u03B1\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2 \u03C0\u03BF\u03C1\u03C4\u03CE\u03BD & \u03C0\u03B1\u03C1\u03B1\u03B8\u03CD\u03C1\u03C9\u03BD", "\u039A\u03B1\u03B8\u03B1\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2 \u03BA\u03BF\u03C5\u03B6\u03AF\u03BD\u03B1\u03C2 & \u03C8\u03C5\u03B3\u03B5\u03AF\u03BF\u03C5"]
    },
    fr: {
      daily: ["M\xE9dicaments", "Brossage des dents (matin)", "Se laver le visage", "Faire le lit", "A\xE9rer la pi\xE8ce", "Pr\xE9parer un repas", "Brossage des dents (soir)", "Prendre une douche", "Ranger"],
      weekly: ["\xC9pousseter", "Passer l'aspirateur", "Laver le sol", "Faire la vaisselle", "Faire une lessive", "\xC9tendre le linge", "Nettoyer lavabo & armoire \xE0 miroir", "Carrelage & baignoire", "Nettoyer les toilettes", "Sortir les poubelles", "Rapporter les bouteilles consign\xE9es"],
      occasionally: ["Se laver les cheveux", "Se couper les cheveux", "Changer les draps", "Se couper les ongles", "Nettoyer portes & fen\xEAtres", "Nettoyer cuisini\xE8re & r\xE9frig\xE9rateur"]
    },
    it: {
      daily: ["Farmaci", "Lavare i denti (mattina)", "Lavarsi la faccia", "Rifare il letto", "Arieggiare la stanza", "Preparare un pasto", "Lavare i denti (sera)", "Fare la doccia", "Riordinare"],
      weekly: ["Spolverare", "Passare l'aspirapolvere", "Lavare i pavimenti", "Lavare i piatti", "Fare il bucato", "Stendere il bucato", "Pulire lavandino e armadietto specchio", "Piastrelle e vasca", "Pulire il WC", "Portare fuori la spazzatura", "Riportare le bottiglie con vuoto a rendere"],
      occasionally: ["Lavare i capelli", "Tagliare i capelli", "Cambiare le lenzuola", "Tagliare le unghie", "Pulire porte e finestre", "Pulire fornelli e frigorifero"]
    }
  };
  var TASK_STEPS_DATABASE2 = Object.assign(
    {},
    typeof TASK_STEPS_DATABASE_PART1 !== "undefined" ? TASK_STEPS_DATABASE_PART1 : {},
    typeof TASK_STEPS_DATABASE_PART2 !== "undefined" ? TASK_STEPS_DATABASE_PART2 : {},
    typeof TASK_STEPS_DATABASE_PART3 !== "undefined" ? TASK_STEPS_DATABASE_PART3 : {}
  );
  var FALLBACK_STEPS2 = {
    en: [
      '1. Gather all materials and items needed for "{task}"',
      "2. Reduce distractions and silence your phone",
      "3. Complete the first small starting step immediately (2-5 mins)",
      '4. Focus on working through the main part of "{task}"',
      "5. Clean up your workspace, put away materials, and check it off! \u{1F389}"
    ],
    de: [
      '1. Material & ben\xF6tigte Gegenst\xE4nde f\xFCr "{task}" heraussuchen',
      "2. Ablenkungen reduzieren & Handy stummschalten",
      "3. Den ersten konkreten Anfangsschritt direkt ausf\xFChren (2-5 Min)",
      '4. Hauptteil von "{task}" fokussiert abarbeiten',
      "5. Arbeitsplatz s\xE4ubern, Material verstauen & Aufgabe als erledigt abhaken! \u{1F389}"
    ],
    es: [
      '1. Reunir todos los materiales y objetos necesarios para "{task}"',
      "2. Reducir las distracciones y silenciar el m\xF3vil",
      "3. Realizar el primer paso peque\xF1o de inmediato (2-5 min)",
      '4. Concentrarse en avanzar la parte principal de "{task}"',
      "5. Limpiar el espacio de trabajo, guardar los materiales y marcar como hecho. \u{1F389}"
    ],
    el: [
      '1. \u03A3\u03C5\u03B3\u03BA\u03AD\u03BD\u03C4\u03C1\u03C9\u03C3\u03B5 \u03CC\u03BB\u03B1 \u03C4\u03B1 \u03B1\u03C0\u03B1\u03C1\u03B1\u03AF\u03C4\u03B7\u03C4\u03B1 \u03C5\u03BB\u03B9\u03BA\u03AC \u03BA\u03B1\u03B9 \u03B1\u03BD\u03C4\u03B9\u03BA\u03B5\u03AF\u03BC\u03B5\u03BD\u03B1 \u03B3\u03B9\u03B1 \u03C4\u03B7\u03BD \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1 "{task}"',
      "2. \u039C\u03B5\u03AF\u03C9\u03C3\u03B5 \u03C4\u03BF\u03C5\u03C2 \u03C0\u03B5\u03C1\u03B9\u03C3\u03C0\u03B1\u03C3\u03BC\u03BF\u03CD\u03C2 \u03BA\u03B1\u03B9 \u03B2\u03AC\u03BB\u03B5 \u03C4\u03BF \u03C4\u03B7\u03BB\u03AD\u03C6\u03C9\u03BD\u03BF \u03C3\u03C4\u03BF \u03B1\u03B8\u03CC\u03C1\u03C5\u03B2\u03BF",
      "3. \u039A\u03AC\u03BD\u03B5 \u03B1\u03BC\u03AD\u03C3\u03C9\u03C2 \u03C4\u03BF \u03C0\u03C1\u03CE\u03C4\u03BF \u03BC\u03B9\u03BA\u03C1\u03CC \u03B2\u03AE\u03BC\u03B1 \u03B3\u03B9\u03B1 \u03BD\u03B1 \u03BE\u03B5\u03BA\u03B9\u03BD\u03AE\u03C3\u03B5\u03B9\u03C2 (2-5 \u03BB\u03B5\u03C0\u03C4\u03AC)",
      '4. \u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B5 \u03C3\u03C4\u03B7\u03BD \u03BF\u03BB\u03BF\u03BA\u03BB\u03AE\u03C1\u03C9\u03C3\u03B7 \u03C4\u03BF\u03C5 \u03BA\u03CD\u03C1\u03B9\u03BF\u03C5 \u03BC\u03AD\u03C1\u03BF\u03C5\u03C2 \u03C4\u03B7\u03C2 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1\u03C2 "{task}"',
      "5. \u039A\u03B1\u03B8\u03AC\u03C1\u03B9\u03C3\u03B5 \u03C4\u03BF\u03BD \u03C7\u03CE\u03C1\u03BF \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1\u03C2, \u03BC\u03AC\u03B6\u03B5\u03C8\u03B5 \u03C4\u03B1 \u03C5\u03BB\u03B9\u03BA\u03AC \u03BA\u03B1\u03B9 \u03C3\u03B7\u03BC\u03B5\u03AF\u03C9\u03C3\u03B5 \u03C4\u03B7\u03BD \u03C9\u03C2 \u03BF\u03BB\u03BF\u03BA\u03BB\u03B7\u03C1\u03C9\u03BC\u03AD\u03BD\u03B7! \u{1F389}"
    ],
    fr: [
      '1. Rassemble tout le mat\xE9riel et les objets n\xE9cessaires pour "{task}"',
      "2. R\xE9duis les distractions et mets ton t\xE9l\xE9phone en silencieux",
      "3. Fais imm\xE9diatement le premier petit pas pour commencer (2-5 min)",
      `4. Concentre-toi pour avancer sur l'essentiel de "{task}"`,
      "5. Range ton espace de travail, range le mat\xE9riel et coche la t\xE2che ! \u{1F389}"
    ],
    it: [
      '1. Raduna tutto il materiale e gli oggetti necessari per "{task}"',
      "2. Riduci le distrazioni e silenzia il telefono",
      "3. Fai subito il primo piccolo passo per iniziare (2-5 min)",
      '4. Concentrati per portare avanti la parte principale di "{task}"',
      "5. Riordina lo spazio di lavoro, riponi il materiale e spunta l'attivit\xE0! \u{1F389}"
    ]
  };
  var CATEGORIES = [
    ["daily", "sun"],
    ["weekly", "calendar-days"],
    ["todo", "list-todo"],
    ["termine", "clock"],
    ["occasionally", "calendar-range"],
    ["notes", "sticky-note"],
    ["done", "check-circle"]
  ];
  var TASK_ICONS2 = {
    "Medis": "pill",
    "Meds": "pill",
    "Medicaci\xF3n": "pill",
    "\u03A6\u03AC\u03C1\u03BC\u03B1\u03BA\u03B1": "pill",
    "M\xE9dicaments": "pill",
    "Farmaci": "pill",
    "Z\xE4hne morgens": "sun",
    "Brush teeth (morning)": "sun",
    "Cepillarse los dientes (ma\xF1ana)": "sun",
    "\u03A0\u03BB\u03CD\u03C3\u03B9\u03BC\u03BF \u03B4\u03BF\u03BD\u03C4\u03B9\u03CE\u03BD (\u03C0\u03C1\u03C9\u03AF)": "sun",
    "Brossage des dents (matin)": "sun",
    "Lavare i denti (mattina)": "sun",
    "Gesicht waschen": "bath",
    "Wash face": "bath",
    "Lavarse la cara": "bath",
    "\u03A0\u03BB\u03CD\u03C3\u03B9\u03BC\u03BF \u03C0\u03C1\u03BF\u03C3\u03CE\u03C0\u03BF\u03C5": "bath",
    "Se laver le visage": "bath",
    "Lavarsi la faccia": "bath",
    "Bett machen": "bed",
    "Make bed": "bed",
    "Hacer la cama": "bed",
    "\u03A3\u03C4\u03C1\u03CE\u03C3\u03B9\u03BC\u03BF \u03BA\u03C1\u03B5\u03B2\u03B1\u03C4\u03B9\u03BF\u03CD": "bed",
    "Faire le lit": "bed",
    "Rifare il letto": "bed",
    "Durchl\xFCften": "wind",
    "Air out room": "wind",
    "Ventilar": "wind",
    "\u0391\u03B5\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2 \u03C7\u03CE\u03C1\u03BF\u03C5": "wind",
    "A\xE9rer la pi\xE8ce": "wind",
    "Arieggiare la stanza": "wind",
    "Kochen": "cooking-pot",
    "Cook a meal": "cooking-pot",
    "Cocinar": "cooking-pot",
    "\u039C\u03B1\u03B3\u03B5\u03B9\u03C1\u03B9\u03BA\u03AE": "cooking-pot",
    "Pr\xE9parer un repas": "cooking-pot",
    "Preparare un pasto": "cooking-pot",
    "Z\xE4hne abends": "moon",
    "Brush teeth (evening)": "moon",
    "Cepillarse los dientes (noche)": "moon",
    "\u03A0\u03BB\u03CD\u03C3\u03B9\u03BC\u03BF \u03B4\u03BF\u03BD\u03C4\u03B9\u03CE\u03BD (\u03B2\u03C1\u03AC\u03B4\u03C5)": "moon",
    "Brossage des dents (soir)": "moon",
    "Lavare i denti (sera)": "moon",
    "Duschen": "bath",
    "Take a shower": "bath",
    "Ducharse": "bath",
    "\u039D\u03C4\u03BF\u03C5\u03C2": "bath",
    "Prendre une douche": "bath",
    "Fare la doccia": "bath",
    "Aufr\xE4umen": "package",
    "Tidy up": "package",
    "Ordenar": "package",
    "\u03A4\u03B1\u03BA\u03C4\u03BF\u03C0\u03BF\u03AF\u03B7\u03C3\u03B7": "package",
    "Ranger": "package",
    "Riordinare": "package",
    "Staub wischen": "feather",
    "Dusting": "feather",
    "Quitar el polvo": "feather",
    "\u039E\u03B5\u03C3\u03BA\u03CC\u03BD\u03B9\u03C3\u03BC\u03B1": "feather",
    "\xC9pousseter": "feather",
    "Spolverare": "feather",
    "Staubsaugen": "tornado",
    "Vacuuming": "tornado",
    "Pasar la aspiradora": "tornado",
    "\u03A3\u03BA\u03BF\u03CD\u03C0\u03B9\u03C3\u03BC\u03B1": "tornado",
    "Passer l'aspirateur": "tornado",
    "Passare l'aspirapolvere": "tornado",
    "Boden wischen": "droplets",
    "Mopping": "droplets",
    "Fregar el suelo": "droplets",
    "\u03A3\u03C6\u03BF\u03C5\u03B3\u03B3\u03AC\u03C1\u03B9\u03C3\u03BC\u03B1": "droplets",
    "Laver le sol": "droplets",
    "Lavare i pavimenti": "droplets",
    "Geschirr sp\xFClen": "utensils",
    "Washing dishes": "utensils",
    "Lavar los platos": "utensils",
    "\u03A0\u03BB\u03CD\u03C3\u03B9\u03BC\u03BF \u03C0\u03B9\u03AC\u03C4\u03C9\u03BD": "utensils",
    "Faire la vaisselle": "utensils",
    "Lavare i piatti": "utensils",
    "W\xE4sche waschen": "washing-machine",
    "Washing laundry": "washing-machine",
    "Hacer la colada": "washing-machine",
    "\u03A0\u03BB\u03CD\u03C3\u03B9\u03BC\u03BF \u03C1\u03BF\u03CD\u03C7\u03C9\u03BD": "washing-machine",
    "Faire une lessive": "washing-machine",
    "Fare il bucato": "washing-machine",
    "W\xE4sche aufh\xE4ngen": "shirt",
    "Hanging up laundry": "shirt",
    "Colgar la ropa": "shirt",
    "\u0386\u03C0\u03BB\u03C9\u03BC\u03B1 \u03C1\u03BF\u03CD\u03C7\u03C9\u03BD": "shirt",
    "\xC9tendre le linge": "shirt",
    "Stendere il bucato": "shirt",
    "Waschbecken & Spiegelschrank putzen": "sparkles",
    "Cleaning sink & mirror cabinet": "sparkles",
    "Limpiar el lavabo y espejo": "sparkles",
    "\u039A\u03B1\u03B8\u03B1\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2 \u03BD\u03B9\u03C0\u03C4\u03AE\u03C1\u03B1 & \u03BA\u03B1\u03B8\u03C1\u03AD\u03C6\u03C4\u03B7": "sparkles",
    "Nettoyer lavabo & armoire \xE0 miroir": "sparkles",
    "Pulire lavandino e armadietto specchio": "sparkles",
    "Fliesen & Badewanne": "bath",
    "Tiles & bathtub": "bath",
    "Azulejos y ba\xF1era": "bath",
    "\u03A0\u03BB\u03B1\u03BA\u03AC\u03BA\u03B9\u03B1 & \u03BC\u03C0\u03B1\u03BD\u03B9\u03AD\u03C1\u03B1": "bath",
    "Carrelage & baignoire": "bath",
    "Piastrelle e vasca": "bath",
    "Klo putzen": "sparkles",
    "Cleaning the toilet": "sparkles",
    "Limpiar el v\xE1ter": "sparkles",
    "\u039A\u03B1\u03B8\u03B1\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2 \u03BB\u03B5\u03BA\u03AC\u03BD\u03B7\u03C2": "sparkles",
    "Nettoyer les toilettes": "sparkles",
    "Pulire il WC": "sparkles",
    "M\xFCll wegbringen": "trash-2",
    "Taking out the trash": "trash-2",
    "Sacar la basura": "trash-2",
    "\u03A0\u03AD\u03C4\u03B1\u03BC\u03B1 \u03C3\u03BA\u03BF\u03C5\u03C0\u03B9\u03B4\u03B9\u03CE\u03BD": "trash-2",
    "Sortir les poubelles": "trash-2",
    "Portare fuori la spazzatura": "trash-2",
    "Pfandflaschen wegbringen": "recycle",
    "Returning deposit bottles": "recycle",
    "Llevar botellas retornables": "recycle",
    "\u0395\u03C0\u03B9\u03C3\u03C4\u03C1\u03BF\u03C6\u03AE \u03AC\u03B4\u03B5\u03B9\u03C9\u03BD \u03BC\u03C0\u03BF\u03C5\u03BA\u03B1\u03BB\u03B9\u03CE\u03BD": "recycle",
    "Rapporter les bouteilles consign\xE9es": "recycle",
    "Riportare le bottiglie con vuoto a rendere": "recycle",
    "Haare waschen": "droplet",
    "Washing hair": "droplet",
    "Lavarse el pelo": "droplet",
    "\u039B\u03BF\u03CD\u03C3\u03B9\u03BC\u03BF": "droplet",
    "Se laver les cheveux": "droplet",
    "Lavare i capelli": "droplet",
    "Haare schneiden": "scissors",
    "Cutting hair": "scissors",
    "Cortarse el pelo": "scissors",
    "\u039A\u03BF\u03CD\u03C1\u03B5\u03BC\u03B1": "scissors",
    "Se couper les cheveux": "scissors",
    "Tagliare i capelli": "scissors",
    "Bettw\xE4sche tauschen": "refresh-cw",
    "Changing bedsheets": "refresh-cw",
    "Cambiar las s\xE1banas": "refresh-cw",
    "\u0391\u03BB\u03BB\u03B1\u03B3\u03AE \u03C3\u03B5\u03BD\u03C4\u03BF\u03BD\u03B9\u03CE\u03BD": "refresh-cw",
    "Changer les draps": "refresh-cw",
    "Cambiare le lenzuola": "refresh-cw",
    "N\xE4gel schneiden": "scissors",
    "Clipping nails": "scissors",
    "Cortarse las u\xF1as": "scissors",
    "\u039A\u03CC\u03C8\u03B9\u03BC\u03BF \u03BD\u03C5\u03C7\u03B9\u03CE\u03BD": "scissors",
    "Se couper les ongles": "scissors",
    "Tagliare le unghie": "scissors",
    "T\xFCre/Fenster putzen": "sparkles",
    "Cleaning doors & windows": "sparkles",
    "Limpiar puertas y ventanas": "sparkles",
    "\u039A\u03B1\u03B8\u03B1\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2 \u03C0\u03BF\u03C1\u03C4\u03CE\u03BD & \u03C0\u03B1\u03C1\u03B1\u03B8\u03CD\u03C1\u03C9\u03BD": "sparkles",
    "Nettoyer portes & fen\xEAtres": "sparkles",
    "Pulire porte e finestre": "sparkles"
  };
  if (typeof window !== "undefined") {
    window.STORE_KEY = STORE_KEY2;
    window.HISTORY_KEY = HISTORY_KEY2;
    window.DEFAULT_TASKS_BY_LANG = DEFAULT_TASKS_BY_LANG2;
    window.TASK_ICONS = TASK_ICONS2;
    window.CATEGORIES = CATEGORIES;
    window.FALLBACK_STEPS = FALLBACK_STEPS2;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.STORE_KEY = STORE_KEY2;
    globalThis.HISTORY_KEY = HISTORY_KEY2;
    globalThis.DEFAULT_TASKS_BY_LANG = DEFAULT_TASKS_BY_LANG2;
    globalThis.TASK_ICONS = TASK_ICONS2;
    globalThis.CATEGORIES = CATEGORIES;
    globalThis.FALLBACK_STEPS = FALLBACK_STEPS2;
  }

  // data-translations-1.js
  var TRANSLATIONS_PART12 = {
    "en": {
      "weekly": "Household",
      "daily": "Today",
      "todo": "To-do",
      "done": "Done",
      "termine": "Appointments",
      "occasionally": "Occasionally",
      "notes": "Notes",
      "notesPlaceholder": "Type your notes, ideas, and quick reminders here...",
      "add": "Add task",
      "add_task": "Add task",
      "add_column": "Add column",
      "column_name": "Column title",
      "delete_column": "Delete column",
      "rename_column": "Rename column",
      "choose_icon": "Choose icon",
      "card_color": "Card color",
      "confirm_delete_column": "Are you sure you want to delete this column and all its tasks?",
      "new_task_placeholder": "What needs to be done?",
      "report": "Stats",
      "report_title": "Productivity & Statistics",
      "report_today": "Today",
      "report_week": "Week",
      "report_month": "Month",
      "report_open_full": "Open Full Dashboard \u2197",
      "open_dashboard": "Open Full Dashboard \u2197",
      "dashboard_title": "Analytics & Insights Dashboard",
      "focus_time": "Focus Time",
      "peak_hours": "Peak Productivity",
      "category_balance": "Category Balance",
      "search_history": "Search completed tasks...",
      "morning_peak": "Morning (06:00 - 12:00)",
      "afternoon_peak": "Afternoon (12:00 - 18:00)",
      "evening_peak": "Evening (18:00 - 24:00)",
      "night_peak": "Night (00:00 - 06:00)",
      "export_image": "Export as Image (PNG)",
      "copy_report": "Copy Summary",
      "settings": "Options",
      "tab_general": "General",
      "tab_history": "Version History",
      "tab_impressum": "Legal Notice (\xA7 5 DDG)",
      "tab_privacy": "Privacy & GDPR",
      "tab_licenses": "Licenses & Disclaimer",
      "history_subtitle": "Visual timeline and milestones of Flow development",
      "settings_modal_title": "Settings & Legal Compliance",
      "settings_modal_subtitle": "Configuration, privacy policy and open-source licenses",
      "setting_default_workspace": "Default Workspace on Startup",
      "setting_default_timer": "Default Focus Duration",
      "setting_clear_data": "Clear All Local App Data",
      "setting_clear_data_confirm": "Are you sure you want to completely erase all local data and reset the app?",
      "cmd_search_placeholder": "Type a command or search tasks... (Ctrl+K)",
      "cmd_actions": "Quick Actions",
      "cmd_tasks": "Matching Tasks",
      "cmd_no_results": "No matching commands or tasks found",
      "cmd_shortcut_hint": "Use \u2191 \u2193 to navigate, Enter to select, Esc to close",
      "recurrence_label": "Repeat Task",
      "recurrence_none": "No repeat",
      "recurrence_daily": "Daily",
      "recurrence_weekdays": "Weekdays (Mon-Fri)",
      "recurrence_weekly": "Weekly",
      "whatnow": "What now?",
      "minimal_mode": "Focus Mode",
      "standard_mode": "Standard View",
      "pause_btn": "Pause",
      "give_feedback": "Feedback",
      "feedback": "Feedback",
      "feedback_desc": "How do you like Flow? Your suggestions help us improve!",
      "feedback_placeholder": "Share your thoughts, ideas, or feature requests...",
      "feedback_greet": "Hey there! \u{1F44B}",
      "feedback_prompt": "Do you have feedback, ideas, or suggestions for Flow? Feel free to drop a message!",
      "feedback_alt": "or send an email to support@flow-planner.app",
      "feedback_send_tooltip": "Send feedback directly to the creator",
      "send": "Send",
      "login_btn": "Sign In",
      "sync_title": "Sync Devices",
      "sync_desc": "Back up your plan and seamlessly sync it across all your devices.",
      "login": "Sign In",
      "register": "Sign Up",
      "title_undo": "Undo",
      "title_open": "Open Plan",
      "title_save": "Save Plan",
      "title_reset": "Reset All",
      "title_theme": "Color Theme",
      "options_title": "Options & Settings",
      "theme_select": "Theme",
      "lang_select": "Language",
      "workspace_private": "Personal",
      "workspace_work": "Work",
      "work_focus": "Focus Today",
      "work_in_progress": "In Progress",
      "work_waiting": "Waiting / Review",
      "work_backlog": "Backlog",
      "dock_sounds": "Sounds",
      "dock_music": "Music",
      "dock_shop": "Shopping",
      "dock_cook": "Cooking",
      "dock_scripts": "Scripts",
      "dock_alarm": "Alarms",
      "dock_weather": "Weather",
      "dock_news": "News",
      "dock_spark": "Spark",
      "dock_inspire": "Inspire",
      "dock_clarity": "Clarity",
      "dock_impulse": "Drive",
      "dock_audio": "Audio",
      "dock_daily": "Lifestyle",
      "dock_beats": "Beats",
      "dock_workout": "Workout",
      "dock_matrix": "Matrix",
      "dock_gamification": "Arcade",
      "weather_title": "Local Weather",
      "news_title": "Daily Digest",
      "clarity_title": "Clarity & Impulse Control",
      "clarity_subtitle": "Overcome cravings, resist unwanted impulses & strengthen self-regulation",
      "sounds": "Sounds",
      "soundscape_title": "Focus & Nature Soundscapes",
      "music": "Music",
      "music_player": "Audio Player",
      "custom_tracks": "Play Your Own Audio Files",
      "no_tracks": "No audio tracks loaded yet",
      "shopping": "Shopping List",
      "cooking": "Smart Cooking",
      "scripts": "Social Scripts",
      "alarm": "Alarms & Reminders",
      "spark": "Quick Spark",
      "inspire": "Inspiration",
      "inspire_title": "Daily Inspiration",
      "zen_title": "Zen Focus",
      "next_rec": "Suggested Task",
      "start_focus": "Start Focus",
      "other_suggestion": "Another Idea",
      "open_steps": "Step-by-Step Guide",
      "completed": "Done!",
      "complete_btn": "Mark as Done",
      "complete": "Done",
      "complete_task": "Task Completed",
      "timer_title": "Focus Timer",
      "start": "Start",
      "stop": "Stop",
      "steps_btn": "Steps",
      "steps_tab": "Steps",
      "pick_desc": "Feeling overwhelmed? Let Flow pick the best next task for you based on current priority:",
      "next_suggestion": "\u{1F3B2} Next Task",
      "steps_desc": "Select a task to view its detailed step-by-step breakdown:",
      "start_timer": "Start Focus Timer",
      "dropdown_placeholder": "-- Select a task from your board --",
      "boost_btn": "Spark",
      "boost_desc": "Stuck in analysis paralysis? Try this 30-second micro-action to reset momentum:",
      "boost_placeholder": "Click below to generate an instant action impulse!",
      "boost_new": "Another Idea \u{1F504}",
      "dopamine_kick_title": "Ready for a quick dopamine kick? \u26A1",
      "dopamine_kick_start": "\u26A1 Give me one!",
      "dopamine_kick_done": "Done! \u{1F389} (+25 XP)",
      "dopamine_kick_other": "Different Action \u{1F504}",
      "dopamine_kick_completed_toast": "Dopamine kick completed! Great job starting.",
      "dopamine_kick_success_log": "\u26A1 Dopamine kick completed:",
      "whatnow_kickstart": "\u{1FA9C} Kickstart",
      "cook_add_ingredient": "Add",
      "cook_add_ingredient_placeholder": "Enter an ingredient (e.g. Pasta, Eggs)...",
      "cook_suggest": "Suggest Recipe \u{1F373}",
      "cook_pantry_empty": "Your pantry is empty. Add ingredients above!",
      "cook_suggestion_title": "Recipe Suggestion",
      "cook_steps": "Instructions",
      "cook_ingredients": "Your Pantry",
      "cook_quick_staples": "Quick Staples",
      "cook_recipe_ingredients": "Required Ingredients",
      "cook_placeholder_empty": "Add pantry ingredients above to receive tailored recipe suggestions.",
      "cook_time": "Time",
      "cook_tags": "Tags",
      "cook_add_to_shop": "Add missing ingredients to shopping list \u{1F6D2}",
      "shop_add_placeholder": "Add item (e.g. 2x oat milk, bread)...",
      "shop_add_btn": "Add",
      "shop_history": "History",
      "shop_clear": "Clear",
      "shop_recent_bought": "Recently purchased",
      "shop_empty": "Your shopping list is clear!",
      "supermarket_mode_btn": "Supermarket Mode \u{1F6D2}",
      "supermarket_title": "Supermarket Mode \u{1F6D2}",
      "sample_banner_title": "\u{1F4A1} These are sample tasks to give you inspiration.",
      "sample_banner_desc": "Customize them, keep what you want, or clear the board completely to start fresh.",
      "sample_keep_all": "Keep All \u2713",
      "sample_customize_btn": "Choose & Customize \u270F\uFE0F",
      "sample_clear_btn": "Clear All \u{1F5D1}\uFE0F",
      "sample_modal_title": "Manage Sample Tasks",
      "sample_modal_subtitle": "Choose which templates to load or clear your board completely",
      "sample_cat_daily": "Daily Routine",
      "sample_cat_weekly": "Household & Cleaning",
      "sample_cat_occasionally": "Occasional & Maintenance",
      "sample_select_all": "Select All",
      "sample_deselect_all": "Deselect All",
      "sample_apply_btn": "Load Selected Tasks",
      "sample_toast_loaded": "Selected sample tasks loaded successfully!",
      "sample_toast_cleared": "Board cleared completely!",
      "toast_no_undo": "Nothing left to undo.",
      "toast_undo_applied": "Last action undone.",
      "toast_reset_success": "Your board has been reset to defaults.",
      "toast_import_success": "Plan successfully imported!",
      "toast_import_error": "Failed to read the backup file.",
      "toast_task_deleted": "Task deleted.",
      "toast_task_restored": "Task restored.",
      "toast_appointment_name_error": "Please enter a name for the appointment.",
      "toast_appointment_saved": "Appointment saved successfully!",
      "appointment_new_btn": "New Appointment",
      "appointment_form_title": "Add Appointment",
      "appointment_form_name_placeholder": "What is scheduled? (e.g. Dentist)",
      "appointment_form_date_label": "Date",
      "appointment_form_time_label": "Time",
      "appointment_form_save_btn": "Save",
      "appointment_form_cancel_btn": "Cancel",
      "sound_rain": "Gentle Rain",
      "sound_forest": "Deep Forest",
      "sound_waves": "Ocean Waves",
      "sound_fire": "Cozy Fireplace",
      "sound_whitenoise": "White Noise",
      "sound_pinknoise": "Pink Noise",
      "sound_brownnoise": "Brown Noise",
      "sound_binaural_alpha": "Alpha Waves (Focus)",
      "sound_binaural_theta": "Theta Waves (Calm)",
      "sound_cafe": "Cozy Caf\xE9",
      "sound_lofi": "Lo-Fi Chords",
      "sound_space": "Cosmic Ambient",
      "sound_stream": "Mountain Stream",
      "sound_night": "Night Crickets",
      "sound_train": "Night Train",
      "sound_wind": "Gentle Wind",
      "sound_underwater": "Underwater Float",
      "sound_fan": "Ceiling Fan",
      "sound_clock": "Soft Clockwork",
      "sound_monastery": "Tibetan Bowls",
      "sound_lofi_sunshine": "Lofi Sunshine",
      "sound_bossa_nova": "Bossa Nova",
      "sound_jazz_piano": "Jazz Voicings",
      "sound_rhodes": "Fender Rhodes",
      "sound_hypnotic_riff": "Hypnotic Riff",
      "sound_techno": "Techno 128",
      "sound_dnb": "Drum & Bass",
      "sound_afrobeats": "Afrobeats",
      "sound_swing": "Swing & Jazz",
      "sound_boombap": "Boom-Bap",
      "guide_title": "Flow Quickstart Guide",
      "guide_desc": "Click any feature to open it directly. Use keyboard shortcuts anytime outside of text inputs!",
      "guide_focus_mode_title": "Focus Mode",
      "guide_focus_mode_desc": "Hides distracting columns to show only your single most important task in a peaceful Zen view.",
      "guide_focus_mode_key": "Key [F]",
      "guide_timer_title": "Focus Timer",
      "guide_timer_desc": "Start structured work intervals with periodic motivational voice prompts and ambient audio.",
      "guide_timer_key_start": "Start/Pause [T]",
      "guide_timer_key_stop": "Stop [S]",
      "guide_whatnow_title": "What now?",
      "guide_whatnow_desc": "Overcomes cognitive decision fatigue by proposing a random task based on your priority.",
      "guide_whatnow_key": "Key [W]",
      "guide_break_title": "Sensory Break & Reset",
      "guide_break_desc": "Relieves sensory overload with guided 4-4-4 breathing, 5-4-3-2-1 grounding, or a 20-min power nap.",
      "guide_break_key": "Key [P]",
      "guide_cooking_title": "Smart Cooking & Pantry",
      "guide_cooking_desc": "Input available ingredients to generate delicious, step-by-step recipes on the fly.",
      "guide_cooking_key": "Key [K]",
      "guide_shopping_title": "Shopping List",
      "guide_shopping_desc": "Organize your grocery list with full-screen Supermarket Mode and auto-suggestions.",
      "guide_shopping_key": "Key [E]",
      "guide_sport_title": "Sport & Movement",
      "guide_sport_desc": "Gently activate your body with 1-minute exercises tailored to your current energy spoons.",
      "guide_sport_key": "Key [O]",
      "guide_report_title": "Stats & Achievements",
      "guide_report_desc": "Track daily progress, weekly productivity curves, and export visual share cards.",
      "guide_report_key": "Key [R]",
      "guide_sample_title": "Manage Sample Tasks",
      "guide_sample_desc": "Load pre-made household routines, customize them, or clear your entire board.",
      "guide_sample_key": "Templates",
      "guide_shortcuts_title": "More Shortcuts",
      "guide_shortcuts_desc": "\u2022 <b>Key [U]</b>: Undo last action<br>\u2022 <b>Key [A]</b>: Add appointment<br>\u2022 <b>Key [B]</b>: Open Drive/Momentum<br>\u2022 <b>Key [I]</b>: Daily Inspiration<br>\u2022 <b>Key [H]</b>: Open/close this guide<br>\u2022 <b>Key [Esc]</b>: Close all modals",
      "guide_shortcuts_key": "Multiple",
      "guide_footer_local": "Flow Suite \xB7 Local-First",
      "guide_footer_privacy": "Privacy & Legal Notice",
      "pause_panel_title": "Sensory Break & Reset",
      "pause_breath_title": "4-4-4 Box Breathing",
      "pause_breath_sub": "Calms nervous system in 60s",
      "pause_grounding_title": "5-4-3-2-1 Grounding",
      "pause_grounding_sub": "Brings you immediately to the present",
      "pause_stretch_title": "Body & Neck Stretch",
      "pause_stretch_sub": "2 minutes gentle loosening",
      "pause_nap_title": "Power Nap (20 Min) \u{1F634}",
      "pause_nap_sub": "Rest with gentle background rain",
      "settings_dropdown_title": "Settings",
      "settings_btn_fullscreen": "Full view \u2197",
      "settings_section_theme": "\u{1F3A8} Color Theme (16 Themes)",
      "settings_section_lang": "\u{1F310} Select Language",
      "settings_p2p_sync": "Phone Live-Sync",
      "settings_privacy_btn": "Privacy",
      "audio_center_title": "Audio Center",
      "audio_center_subtitle": "Focus, Beats & Mix Studio",
      "audio_tab_ambient": "Soundscapes",
      "audio_tab_beats": "Beats & Lo-Fi",
      "audio_tab_dj": "Mix Studio",
      "cal_mo": "Mo",
      "cal_di": "Tu",
      "cal_mi": "We",
      "cal_do": "Th",
      "cal_fr": "Fr",
      "cal_sa": "Sa",
      "cal_so": "Su",
      "month_jan": "January",
      "month_feb": "February",
      "month_mar": "March",
      "month_apr": "April",
      "month_may": "May",
      "month_jun": "June",
      "month_jul": "July",
      "month_aug": "August",
      "month_sep": "September",
      "month_oct": "October",
      "month_nov": "November",
      "month_dec": "December",
      "mobile_nav_tools": "Tools",
      "mobile_nav_planner": "Planner",
      "mobile_nav_focus": "Focus",
      "mobile_nav_audio": "Audio",
      "mobile_nav_game": "Arcade",
      "mobile_fab_title": "Add new task",
      "mobile_quick_title": "Quick Menu & Options",
      "mobile_quick_desc": "Essential functions on the go",
      "mobile_quick_sync_title": "Live-Sync",
      "mobile_quick_sync_sub": "QR & P2P Transfer",
      "mobile_quick_stats_title": "Stats",
      "mobile_quick_stats_sub": "Weekly insights",
      "mobile_quick_theme_title": "Color Theme",
      "mobile_quick_theme_sub": "16 Themes",
      "mobile_quick_lang_title": "Language",
      "mobile_quick_lang_sub": "6 Languages",
      "mobile_quick_whatnow_title": "What now?",
      "mobile_quick_whatnow_sub": "Random prompt",
      "mobile_quick_break_title": "Sensory Break",
      "mobile_quick_break_sub": "Breathing & Calm",
      "mobile_quick_save_title": "Save Plan",
      "mobile_quick_save_sub": "JSON Backup",
      "mobile_quick_settings_title": "Settings",
      "mobile_quick_settings_sub": "Options & Privacy",
      "mobile_tools_section": "\u{1F6E0}\uFE0F Lifestyle & Productivity",
      "mobile_tools_sync_badge": "1-Click",
      "mobile_tools_sync_title": "Live-Sync & QR",
      "mobile_tools_sync_sub": "PC \u2194 Phone",
      "mobile_tools_opt_badge": "Options",
      "mobile_tools_opt_title": "Design & Language",
      "mobile_tools_opt_sub": "Themes & Backup",
      "mobile_tools_shop_badge": "Loot",
      "mobile_tools_shop_title": "Shopping List",
      "mobile_tools_shop_sub": "Items & Quantities",
      "mobile_tools_cook_badge": "Pot",
      "mobile_tools_cook_title": "Smart Cooking",
      "mobile_tools_cook_sub": "Step-by-Step",
      "mobile_tools_sport_badge": "Active",
      "mobile_tools_sport_title": "Movement Break",
      "mobile_tools_sport_sub": "Micro-Workouts",
      "mobile_tools_alarm_badge": "Alarm",
      "mobile_tools_alarm_title": "Alarms & Timers",
      "mobile_tools_alarm_sub": "Precise Timers",
      "mobile_tools_stats_badge": "Stats",
      "mobile_tools_stats_title": "Productivity",
      "mobile_tools_stats_sub": "Weekly Report",
      "mobile_tools_whatnow_badge": "Spark",
      "mobile_tools_whatnow_title": "What now?",
      "mobile_tools_whatnow_sub": "Energy-based Pick",
      "mobile_audio_synth_title": "Synthesizer Beats"
    },
    "de": {
      "weekly": "Haushalt",
      "daily": "Heute",
      "todo": "To-do",
      "done": "Erledigt",
      "termine": "Termine",
      "occasionally": "Gelegentlich",
      "notes": "Notizen",
      "notesPlaceholder": "Hier ist Platz f\xFCr deine Notizen, Gedanken und spontane Ideen...",
      "add": "Aufgabe hinzuf\xFCgen",
      "add_task": "Aufgabe hinzuf\xFCgen",
      "add_column": "Spalte hinzuf\xFCgen",
      "column_name": "Spaltentitel",
      "delete_column": "Spalte l\xF6schen",
      "rename_column": "Spalte umbenennen",
      "choose_icon": "Symbol w\xE4hlen",
      "card_color": "Kartenfarbe",
      "confirm_delete_column": "M\xF6chtest du diese Spalte und alle darin enthaltenen Aufgaben wirklich l\xF6schen?",
      "new_task_placeholder": "Was steht an?",
      "report": "Statistik",
      "report_title": "Produktivit\xE4t & Statistiken",
      "report_today": "Heute",
      "report_week": "Woche",
      "report_month": "Monat",
      "report_open_full": "Gro\xDFes Dashboard \xF6ffnen \u2197",
      "open_dashboard": "Gro\xDFes Dashboard \xF6ffnen \u2197",
      "dashboard_title": "Analyse & Erfolgs-Dashboard",
      "focus_time": "Fokuszeit",
      "peak_hours": "Produktivste Phase",
      "category_balance": "Kategorien-Balance",
      "search_history": "Erledigte Aufgaben durchsuchen...",
      "morning_peak": "Morgen (06:00 - 12:00)",
      "afternoon_peak": "Nachmittag (12:00 - 18:00)",
      "evening_peak": "Abend (18:00 - 24:00)",
      "night_peak": "Nacht (00:00 - 06:00)",
      "export_image": "Als Bild sichern (PNG)",
      "copy_report": "Zusammenfassung kopieren",
      "settings": "Optionen",
      "tab_general": "Allgemein",
      "tab_history": "Versionshistorie",
      "tab_impressum": "Impressum (\xA7 5 DDG)",
      "tab_privacy": "Datenschutz & DSGVO",
      "tab_licenses": "Lizenzen & Haftung",
      "history_subtitle": "Visuelle Meilensteine und Entwicklung von Flow",
      "settings_modal_title": "Einstellungen & Rechtliches",
      "settings_modal_subtitle": "Konfiguration, Datenschutzerkl\xE4rung und Open-Source-Lizenzen",
      "setting_default_workspace": "Standard-Bereich beim Start",
      "setting_default_timer": "Standard-Fokusdauer",
      "setting_clear_data": "Alle lokalen App-Daten l\xF6schen",
      "setting_clear_data_confirm": "M\xF6chtest du wirklich alle lokalen Daten unwiderruflich l\xF6schen und die App zur\xFCcksetzen?",
      "cmd_search_placeholder": "Befehl tippen oder Aufgaben suchen... (Strg+K)",
      "cmd_actions": "Schnellaktionen",
      "cmd_tasks": "Passende Aufgaben",
      "cmd_no_results": "Keine passenden Befehle oder Aufgaben gefunden",
      "cmd_shortcut_hint": "Nutze \u2191 \u2193 zur Navigation, Enter zum Ausw\xE4hlen, Esc zum Schlie\xDFen",
      "recurrence_label": "Aufgabe wiederholen",
      "recurrence_none": "Keine Wiederholung",
      "recurrence_daily": "T\xE4glich",
      "recurrence_weekdays": "Werktags (Mo-Fr)",
      "recurrence_weekly": "W\xF6chentlich",
      "whatnow": "Was nun?",
      "minimal_mode": "Fokus-Modus",
      "standard_mode": "Standard-Modus",
      "pause_btn": "Pause",
      "give_feedback": "Feedback",
      "feedback": "Feedback",
      "feedback_desc": "Wie gef\xE4llt dir Flow? Deine R\xFCckmeldungen helfen uns, die App stetig zu verbessern!",
      "feedback_placeholder": "Teile deine Gedanken, Ideen oder W\xFCnsche...",
      "feedback_greet": "Hey, ich bin Jannis! \u{1F44B}",
      "feedback_prompt": "Hast du Feedback, Kritik oder neue Ideen f\xFCr Flow? Schreib mir gerne eine kurze Nachricht!",
      "feedback_alt": "oder sende eine E-Mail an support@flow-planner.app",
      "feedback_send_tooltip": "Feedback direkt absenden",
      "send": "Senden",
      "login_btn": "Anmelden",
      "sync_title": "Ger\xE4te synchronisieren",
      "sync_desc": "Sichere deinen Plan und nutze ihn nahtlos auf all deinen Ger\xE4ten.",
      "login": "Anmelden",
      "register": "Registrieren",
      "title_undo": "R\xFCckg\xE4ngig machen",
      "title_open": "Plan \xF6ffnen",
      "title_save": "Plan sichern",
      "title_reset": "Alles zur\xFCcksetzen",
      "title_theme": "Farbschema",
      "options_title": "Optionen & Einstellungen",
      "theme_select": "Farbschema",
      "lang_select": "Sprache",
      "workspace_private": "Privat",
      "workspace_work": "Arbeit",
      "work_focus": "Fokus Heute",
      "work_in_progress": "In Bearbeitung",
      "work_waiting": "Wartend / Review",
      "work_backlog": "Backlog",
      "dock_sounds": "Sounds",
      "dock_music": "Musik",
      "dock_shop": "Einkauf",
      "dock_cook": "Kochen",
      "dock_scripts": "Skripte",
      "dock_alarm": "Wecker",
      "dock_weather": "Wetter",
      "dock_news": "Nachrichten",
      "dock_spark": "Impuls",
      "dock_inspire": "Inspire",
      "dock_clarity": "Klarheit",
      "dock_impulse": "Schwung",
      "dock_audio": "Audio",
      "dock_daily": "Alltag",
      "dock_beats": "Beats",
      "dock_workout": "Workout",
      "dock_matrix": "Matrix",
      "dock_gamification": "Arcade",
      "weather_title": "Lokales Wetter",
      "news_title": "Daily Digest",
      "clarity_title": "Klarheit & Impulskontrolle",
      "clarity_subtitle": "Gel\xFCste \xFCberwinden, unerw\xFCnschte Gewohnheiten stoppen & Selbststeuerung st\xE4rken",
      "sounds": "Sounds",
      "soundscape_title": "Naturger\xE4usche & Klangkulissen",
      "music": "Musik",
      "music_player": "Audioplayer",
      "custom_tracks": "Eigene Audiodateien abspielen",
      "no_tracks": "Noch keine Audiotitel geladen",
      "shopping": "Einkaufsliste",
      "cooking": "Kochen & Vorrat",
      "scripts": "Soziale Skripte",
      "alarm": "Wecker & Erinnerungen",
      "spark": "Schneller Impuls",
      "inspire": "Inspiration",
      "inspire_title": "Tages-Inspiration",
      "zen_title": "Zen-Fokus",
      "next_rec": "Empfohlene Aufgabe",
      "start_focus": "Fokus starten",
      "other_suggestion": "Anderer Vorschlag",
      "open_steps": "Schritt-f\xFCr-Schritt-Anleitung",
      "completed": "Geschafft!",
      "complete_btn": "Erledigt",
      "complete": "Erledigt",
      "complete_task": "Aufgabe erledigt",
      "timer_title": "Fokus-Timer",
      "start": "Start",
      "stop": "Stopp",
      "steps_btn": "Schritte",
      "steps_tab": "Schritte",
      "pick_desc": "F\xFChlst du dich blockiert? Lass Flow die passende n\xE4chste Aufgabe nach Priorit\xE4t f\xFCr dich ausw\xE4hlen:",
      "next_suggestion": "\u{1F3B2} N\xE4chste Aufgabe",
      "steps_desc": "W\xE4hle eine Aufgabe, um die detaillierte Schritt-f\xFCr-Schritt-Anleitung anzuzeigen:",
      "start_timer": "Fokus-Timer starten",
      "dropdown_placeholder": "-- W\xE4hle eine Aufgabe aus deinem Plan --",
      "boost_btn": "Impuls",
      "boost_desc": "Festgefahren? Probiere diese 30-Sekunden-Aktion aus, um wieder in Schwung zu kommen:",
      "boost_placeholder": "Klicke unten, um einen sofortigen Handlungsimpuls zu erhalten!",
      "boost_new": "Neuer Impuls \u{1F504}",
      "dopamine_kick_title": "Lust auf einen schnellen Dopamin-Kick? \u26A1",
      "dopamine_kick_start": "\u26A1 Gib mir einen!",
      "dopamine_kick_done": "Erledigt! \u{1F389} (+25 XP)",
      "dopamine_kick_other": "Andere Aktion \u{1F504}",
      "dopamine_kick_completed_toast": "Dopamin-Kick abgeschlossen! Starker Start.",
      "dopamine_kick_success_log": "\u26A1 Dopamin-Kick ausgef\xFChrt:",
      "whatnow_kickstart": "\u{1FA9C} Kickstart",
      "cook_add_ingredient": "Hinzuf\xFCgen",
      "cook_add_ingredient_placeholder": "Zutat eingeben (z.B. Nudeln, Eier)...",
      "cook_suggest": "Rezept vorschlagen \u{1F373}",
      "cook_pantry_empty": "Dein Vorrat ist leer. F\xFCge oben Zutaten hinzu!",
      "cook_suggestion_title": "Rezept-Vorschlag",
      "cook_steps": "Zubereitungsschritte",
      "cook_ingredients": "Dein Vorrat",
      "cook_quick_staples": "Schnelle Vorratszutaten",
      "cook_recipe_ingredients": "Ben\xF6tigte Zutaten",
      "cook_placeholder_empty": "Trage deine Zutaten ein, um passende Rezeptvorschl\xE4ge zu erhalten.",
      "cook_time": "Zeit",
      "cook_tags": "Tags",
      "cook_add_to_shop": "Fehlende Zutaten auf Einkaufsliste setzen \u{1F6D2}",
      "shop_add_placeholder": "Artikel hinzuf\xFCgen (z.B. 2x Hafermilch, Brot)...",
      "shop_add_btn": "Hinzuf\xFCgen",
      "shop_history": "Verlauf",
      "shop_clear": "Leeren",
      "shop_recent_bought": "Zuletzt gekauft",
      "shop_empty": "Deine Einkaufsliste ist leer!",
      "supermarket_mode_btn": "Supermarkt-Modus \u{1F6D2}",
      "supermarket_title": "Supermarkt-Modus \u{1F6D2}",
      "sample_banner_title": "\u{1F4A1} Das sind vorgefertigte Beispiel-Aufgaben zur Orientierung.",
      "sample_banner_desc": "Du kannst sie individuell anpassen, behalten oder das Board komplett leeren.",
      "sample_keep_all": "Alle behalten \u2713",
      "sample_customize_btn": "Ausw\xE4hlen & Anpassen \u270F\uFE0F",
      "sample_clear_btn": "Board leeren \u{1F5D1}\uFE0F",
      "sample_modal_title": "Beispiel-Aufgaben verwalten",
      "sample_modal_subtitle": "W\xE4hle Vorlagen zum Laden aus oder leere dein Board vollst\xE4ndig",
      "sample_cat_daily": "Tagesroutine",
      "sample_cat_weekly": "Haushalt & Reinigung",
      "sample_cat_occasionally": "Gelegentliche Pflege",
      "sample_select_all": "Alle ausw\xE4hlen",
      "sample_deselect_all": "Alle abw\xE4hlen",
      "sample_apply_btn": "Ausgew\xE4hlte Aufgaben laden",
      "sample_toast_loaded": "Ausgew\xE4hlte Vorlagen wurden erfolgreich geladen!",
      "sample_toast_cleared": "Board wurde vollst\xE4ndig geleert!",
      "toast_no_undo": "Es gibt nichts mehr r\xFCckg\xE4ngig zu machen.",
      "toast_undo_applied": "Letzter Schritt wurde r\xFCckg\xE4ngig gemacht.",
      "toast_reset_success": "Dein Plan wurde komplett zur\xFCckgesetzt.",
      "toast_import_success": "Dein Plan wurde erfolgreich geladen!",
      "toast_import_error": "Das Laden der Datei ist leider fehlgeschlagen.",
      "toast_task_deleted": "Aufgabe gel\xF6scht.",
      "toast_task_restored": "Aufgabe wurde wiederhergestellt.",
      "toast_appointment_name_error": "Bitte trag einen Namen f\xFCr den Termin ein.",
      "toast_appointment_saved": "Dein Termin wurde erfolgreich eingetragen!",
      "appointment_new_btn": "Neuer Termin",
      "appointment_form_title": "Termin eintragen",
      "appointment_form_name_placeholder": "Was steht an? (z.B. Zahnarzt)",
      "appointment_form_date_label": "Wann",
      "appointment_form_time_label": "Uhrzeit",
      "appointment_form_save_btn": "Sichern",
      "appointment_form_cancel_btn": "Abbrechen",
      "sound_rain": "Sanfter Regen",
      "sound_forest": "Tiefer Wald",
      "sound_waves": "Meeresrauschen",
      "sound_fire": "Kaminfeuer",
      "sound_whitenoise": "Wei\xDFes Rauschen",
      "sound_pinknoise": "Rosa Rauschen",
      "sound_brownnoise": "Braunes Rauschen",
      "sound_binaural_alpha": "Alpha-Wellen (Fokus)",
      "sound_binaural_theta": "Theta-Wellen (Ruhe)",
      "sound_cafe": "Gem\xFCtliches Caf\xE9",
      "sound_lofi": "Lofi-Akkorde",
      "sound_space": "Kosmischer Raum",
      "sound_stream": "Gebirgsbach",
      "sound_night": "Nachtgrillen",
      "sound_train": "Nachtzug",
      "sound_wind": "Sanfter Wind",
      "sound_underwater": "Unterwasser",
      "sound_fan": "Ventilator",
      "sound_clock": "Sanftes Uhrwerk",
      "sound_monastery": "Tibetische Klangschalen",
      "sound_lofi_sunshine": "Lofi Sunshine",
      "sound_bossa_nova": "Bossa Nova",
      "sound_jazz_piano": "Jazz Voicings",
      "sound_rhodes": "Fender Rhodes",
      "sound_hypnotic_riff": "Hypnotic Riff",
      "sound_techno": "Techno 128",
      "sound_dnb": "Drum & Bass",
      "sound_afrobeats": "Afrobeats",
      "sound_swing": "Swing & Jazz",
      "sound_boombap": "Boom-Bap",
      "guide_title": "Flow Schnellstart-Guide",
      "guide_desc": "Klicke auf ein Element, um die Funktion direkt zu \xF6ffnen. Nutze die Tasten au\xDFerhalb von Eingabefeldern!",
      "guide_focus_mode_title": "Fokus-Modus",
      "guide_focus_mode_desc": "Blendet das ablenkende Hauptboard aus und zeigt ausschlie\xDFlich deine aktuell wichtigste To-Do-Aufgabe in einer minimalistischen Zen-Ansicht.",
      "guide_focus_mode_key": "Taste [F]",
      "guide_timer_title": "Fokus-Timer",
      "guide_timer_desc": "Starte fokussierte Arbeitssitzungen mit motivierender, periodischer Sprachbegleitung und stimmungsvoller Hintergrundmusik.",
      "guide_timer_key_start": "Start/Pause [T]",
      "guide_timer_key_stop": "Stop [S]",
      "guide_whatnow_title": "Was nun?",
      "guide_whatnow_desc": "Verringert kognitive Blockaden, indem eine zuf\xE4llige Aufgabe basierend auf deiner aktuellen Tagespriorit\xE4t vorgeschlagen wird.",
      "guide_whatnow_key": "Taste [W]",
      "guide_break_title": "Reizpause & Erholung",
      "guide_break_desc": "Unterst\xFCtzt dich bei Reiz\xFCberflutung mit gef\xFChrten Atemtakt-Rhythmen, 5-4-3-2-1 Achtsamkeits-Erdung oder schnellen Entspannungspausen.",
      "guide_break_key": "Taste [P]",
      "guide_cooking_title": "Kochen & Vorrat",
      "guide_cooking_desc": "Trage deine vorhandenen Zutaten ein und lass dir ein passendes Rezept samt strukturierter Schritt-f\xFCr-Schritt-Anleitung generieren.",
      "guide_cooking_key": "Taste [K]",
      "guide_shopping_title": "Einkaufsliste",
      "guide_shopping_desc": "Verwalte deine Eink\xE4ufe und nutze den Vollbild-Supermarktmodus f\xFCr entspanntes Einkaufen.",
      "guide_shopping_key": "Taste [E]",
      "guide_sport_title": "Sport & Bewegung",
      "guide_sport_desc": "Aktiviere deinen K\xF6rper sanft mit 1-Minuten-\xDCbungen, die perfekt auf dein aktuelles Energieniveau (Spoons) abgestimmt sind.",
      "guide_sport_key": "Taste [O]",
      "guide_report_title": "Statistik & Erfolge",
      "guide_report_desc": "Analysiere deine Fortschritte, sieh dir deine w\xF6chentliche Aktivit\xE4t an und exportiere deine t\xE4glichen Haken als Bild-Report.",
      "guide_report_key": "Taste [R]",
      "guide_sample_title": "Beispiel-Aufgaben verwalten",
      "guide_sample_desc": "Beispiel-Aufgaben f\xFCr Haushalt & Tag neu laden, individuell anpassen oder Board komplett leeren.",
      "guide_sample_key": "Vorlagen",
      "guide_shortcuts_title": "Weitere Abk\xFCrzungen",
      "guide_shortcuts_desc": "\u2022 <b>Taste [U]</b>: Letzte Aktion r\xFCckg\xE4ngig machen<br>\u2022 <b>Taste [A]</b>: Neuen Kalendertermin hinzuf\xFCgen<br>\u2022 <b>Taste [B]</b>: Schwung & Fokus \xF6ffnen<br>\u2022 <b>Taste [I]</b>: Inspirierenden Impuls \xF6ffnen<br>\u2022 <b>Taste [H]</b>: Diese Kurzanleitung \xF6ffnen/schlie\xDFen<br>\u2022 <b>Taste [Esc]</b>: Alle Modale schlie\xDFen",
      "guide_shortcuts_key": "Mehrere",
      "guide_footer_local": "Flow Suite \xB7 Local-First",
      "guide_footer_privacy": "Datenschutz & Impressum",
      "pause_panel_title": "Reizpause & Erholung",
      "pause_breath_title": "4-4-4 Atemtakt",
      "pause_breath_sub": "Beruhigt das Nervensystem in 60s",
      "pause_grounding_title": "5-4-3-2-1 Erdung",
      "pause_grounding_sub": "Holt dich sofort ins Hier & Jetzt",
      "pause_stretch_title": "K\xF6rper & Nacken lockern",
      "pause_stretch_sub": "2 Minuten sanfte Dehnung",
      "pause_nap_title": "Power Nap (20 Min) \u{1F634}",
      "pause_nap_sub": "Kurzschlaf bei leisem Regen",
      "settings_dropdown_title": "Einstellungen",
      "settings_btn_fullscreen": "Vollbild \u2197",
      "settings_section_theme": "\u{1F3A8} Farbschema (16 Themes)",
      "settings_section_lang": "\u{1F310} Sprache w\xE4hlen",
      "settings_p2p_sync": "Handy Live-Sync",
      "settings_privacy_btn": "Datenschutz",
      "audio_center_title": "Audio-Center",
      "audio_center_subtitle": "Fokus, Beats & Mix-Studio",
      "audio_tab_ambient": "Naturger\xE4usche",
      "audio_tab_beats": "Beats & LoFi",
      "audio_tab_dj": "Mix-Studio",
      "cal_mo": "Mo",
      "cal_di": "Di",
      "cal_mi": "Mi",
      "cal_do": "Do",
      "cal_fr": "Fr",
      "cal_sa": "Sa",
      "cal_so": "So",
      "month_jan": "Januar",
      "month_feb": "Februar",
      "month_mar": "M\xE4rz",
      "month_apr": "April",
      "month_may": "Mai",
      "month_jun": "Juni",
      "month_jul": "Juli",
      "month_aug": "August",
      "month_sep": "September",
      "month_oct": "Oktober",
      "month_nov": "November",
      "month_dec": "Dezember",
      "mobile_nav_tools": "Tools",
      "mobile_nav_planner": "Planer",
      "mobile_nav_focus": "Fokus",
      "mobile_nav_audio": "Audio",
      "mobile_nav_game": "3D-Game",
      "mobile_fab_title": "Neue Aufgabe hinzuf\xFCgen",
      "mobile_quick_title": "Schnellmen\xFC & Optionen",
      "mobile_quick_desc": "Alle Funktionen f\xFCr unterwegs griffbereit",
      "mobile_quick_sync_title": "Live-Sync",
      "mobile_quick_sync_sub": "QR & P2P Transfer",
      "mobile_quick_stats_title": "Statistik",
      "mobile_quick_stats_sub": "Wochenauswertung",
      "mobile_quick_theme_title": "Farbschema",
      "mobile_quick_theme_sub": "16 Themes w\xE4hlen",
      "mobile_quick_lang_title": "Sprache",
      "mobile_quick_lang_sub": "6 Sprachen (EN/DE/...)",
      "mobile_quick_whatnow_title": "Was nun?",
      "mobile_quick_whatnow_sub": "Impuls-Vorschlag",
      "mobile_quick_break_title": "Reizpause",
      "mobile_quick_break_sub": "Atem\xFCbungen & Ruhe",
      "mobile_quick_save_title": "Plan sichern",
      "mobile_quick_save_sub": "JSON-Export",
      "mobile_quick_settings_title": "Einstellungen",
      "mobile_quick_settings_sub": "Optionen & DSGVO",
      "mobile_tools_section": "\u{1F6E0}\uFE0F Lifestyle & Produktivit\xE4t",
      "mobile_tools_sync_badge": "1-Klick",
      "mobile_tools_sync_title": "Live-Sync & QR",
      "mobile_tools_sync_sub": "PC \u2194 Smartphone",
      "mobile_tools_opt_badge": "Optionen",
      "mobile_tools_opt_title": "Design & Sprache",
      "mobile_tools_opt_sub": "Themes & Backup",
      "mobile_tools_shop_badge": "Loot",
      "mobile_tools_shop_title": "Einkaufsliste",
      "mobile_tools_shop_sub": "Kategorien & Mengen",
      "mobile_tools_cook_badge": "Kessel",
      "mobile_tools_cook_title": "Rezepte & Prep",
      "mobile_tools_cook_sub": "Schritt-f\xFCr-Schritt",
      "mobile_tools_sport_badge": "Aktiv",
      "mobile_tools_sport_title": "Bewegungspause",
      "mobile_tools_sport_sub": "Mikro-Workouts",
      "mobile_tools_alarm_badge": "Alarm",
      "mobile_tools_alarm_title": "Wecker & Timer",
      "mobile_tools_alarm_sub": "Punktgenaue Wecker",
      "mobile_tools_stats_badge": "Stats",
      "mobile_tools_stats_title": "Produktivit\xE4t",
      "mobile_tools_stats_sub": "Wochenauswertung",
      "mobile_tools_whatnow_badge": "Impuls",
      "mobile_tools_whatnow_title": "Was nun?",
      "mobile_tools_whatnow_sub": "Energie-Vorschlag",
      "mobile_audio_synth_title": "Synthesizer Beats"
    },
    "fr": {
      "weekly": "Maison",
      "daily": "Aujourd'hui",
      "todo": "\xC0 faire",
      "done": "Termin\xE9",
      "termine": "Rendez-vous",
      "occasionally": "Occasionnel",
      "notes": "Notes",
      "notesPlaceholder": "\xC9cris tes notes, pens\xE9es et id\xE9es spontan\xE9es ici...",
      "add": "Ajouter une t\xE2che",
      "add_task": "Ajouter une t\xE2che",
      "add_column": "Ajouter une colonne",
      "column_name": "Titre de la colonne",
      "delete_column": "Supprimer la colonne",
      "rename_column": "Renommer la colonne",
      "choose_icon": "Choisir une ic\xF4ne",
      "card_color": "Couleur de la carte",
      "confirm_delete_column": "Es-tu s\xFBr de vouloir supprimer cette colonne et toutes ses t\xE2ches ?",
      "new_task_placeholder": "Que dois-tu faire ?",
      "report": "Statistiques",
      "report_title": "Productivit\xE9 & Statistiques",
      "report_today": "Aujourd'hui",
      "report_week": "Semaine",
      "report_month": "Mois",
      "report_open_full": "Ouvrir le Tableau de bord \u2197",
      "open_dashboard": "Ouvrir le Tableau de bord \u2197",
      "dashboard_title": "Tableau de bord Analytique",
      "focus_time": "Temps de Focus",
      "peak_hours": "P\xE9riode Productive",
      "category_balance": "\xC9quilibre des Cat\xE9gories",
      "search_history": "Rechercher des t\xE2ches termin\xE9es...",
      "morning_peak": "Matin (06h00 - 12h00)",
      "afternoon_peak": "Apr\xE8s-midi (12h00 - 18h00)",
      "evening_peak": "Soir (18h00 - 24h00)",
      "night_peak": "Nuit (00h00 - 06h00)",
      "export_image": "Enregistrer en image (PNG)",
      "copy_report": "Copier le r\xE9sum\xE9",
      "settings": "Options",
      "tab_general": "G\xE9n\xE9ral",
      "tab_history": "Historique des versions",
      "tab_impressum": "Mentions L\xE9gales (\xA7 5 DDG)",
      "tab_privacy": "Confidentialit\xE9 & RGPD",
      "tab_licenses": "Licences & Responsabilit\xE9",
      "history_subtitle": "Chronologie visuelle et \xE9tapes de d\xE9veloppement de Flow",
      "settings_modal_title": "Param\xE8tres & Mentions L\xE9gales",
      "settings_modal_subtitle": "Configuration, politique de confidentialit\xE9 et licences libres",
      "setting_default_workspace": "Espace par d\xE9faut au d\xE9marrage",
      "setting_default_timer": "Dur\xE9e de concentration par d\xE9faut",
      "setting_clear_data": "Effacer toutes les donn\xE9es locales",
      "setting_clear_data_confirm": "Es-tu s\xFBr de vouloir effacer d\xE9finitivement toutes les donn\xE9es locales et r\xE9initialiser l'application ?",
      "cmd_search_placeholder": "Taper une commande ou rechercher... (Ctrl+K)",
      "cmd_actions": "Actions rapides",
      "cmd_tasks": "T\xE2ches correspondantes",
      "cmd_no_results": "Aucune commande ou t\xE2che trouv\xE9e",
      "cmd_shortcut_hint": "Utilise \u2191 \u2193 pour naviguer, Entr\xE9e pour valider, \xC9chap pour fermer",
      "recurrence_label": "R\xE9p\xE9ter la t\xE2che",
      "recurrence_none": "Pas de r\xE9p\xE9tition",
      "recurrence_daily": "Tous les jours",
      "recurrence_weekdays": "Jours ouvr\xE9s (Lun-Ven)",
      "recurrence_weekly": "Hebdomadaire",
      "whatnow": "Et maintenant ?",
      "minimal_mode": "Mode Focus",
      "standard_mode": "Vue Standard",
      "pause_btn": "Pause",
      "give_feedback": "Avis",
      "feedback": "Avis",
      "feedback_desc": "Que penses-tu de Flow ? Tes retours nous aident \xE0 l'am\xE9liorer !",
      "feedback_placeholder": "Partage tes pens\xE9es, id\xE9es ou souhaits...",
      "feedback_greet": "Salut ! \u{1F44B}",
      "feedback_prompt": "As-tu des retours, critiques ou id\xE9es pour Flow ? Envoie-nous un message !",
      "feedback_alt": "ou \xE9cris-nous \xE0 support@flow-planner.app",
      "feedback_send_tooltip": "Envoyer directement tes retours",
      "send": "Envoyer",
      "login_btn": "Connexion",
      "sync_title": "Synchronisation des Appareils",
      "sync_desc": "Sauvegarde ton plan et utilise-le facilement sur tous tes \xE9crans.",
      "login": "Connexion",
      "register": "Inscription",
      "title_undo": "Annuler",
      "title_open": "Ouvrir le plan",
      "title_save": "Sauvegarder le plan",
      "title_reset": "Tout r\xE9initialiser",
      "title_theme": "Th\xE8me de couleur",
      "options_title": "Options & Param\xE8tres",
      "theme_select": "Th\xE8me",
      "lang_select": "Langue",
      "workspace_private": "Personnel",
      "workspace_work": "Travail",
      "work_focus": "Focus Aujourd'hui",
      "work_in_progress": "En Cours",
      "work_waiting": "En Attente",
      "work_backlog": "Backlog",
      "dock_sounds": "Sons",
      "dock_music": "Musique",
      "dock_shop": "Courses",
      "dock_cook": "Cuisine",
      "dock_scripts": "Scripts",
      "dock_alarm": "R\xE9veil",
      "dock_weather": "M\xE9t\xE9o",
      "dock_news": "Actualit\xE9s",
      "dock_spark": "\xC9tincelle",
      "dock_inspire": "Inspiration",
      "dock_clarity": "Clart\xE9",
      "dock_impulse": "\xC9lan",
      "dock_audio": "Audio",
      "dock_daily": "Quotidien",
      "dock_beats": "Beats",
      "dock_workout": "Entra\xEEnement",
      "dock_matrix": "Matrice",
      "dock_gamification": "Arcade",
      "weather_title": "M\xE9t\xE9o Locale",
      "news_title": "Daily Digest",
      "clarity_title": "Clart\xE9 & Contr\xF4le des Pulsions",
      "clarity_subtitle": "Surmonter les envies, briser les automatismes et renforcer la ma\xEEtrise de soi",
      "sounds": "Sons",
      "soundscape_title": "Sons de la Nature & Concentration",
      "music": "Musique",
      "music_player": "Lecteur Audio",
      "custom_tracks": "\xC9couter tes propres fichiers audio",
      "no_tracks": "Aucun morceau charg\xE9",
      "shopping": "Liste de Courses",
      "cooking": "Cuisine Intelligente",
      "scripts": "Scripts Sociaux",
      "alarm": "R\xE9veils & Rappels",
      "spark": "\xC9tincelle Rapide",
      "inspire": "Inspiration",
      "inspire_title": "Inspiration du Jour",
      "zen_title": "Focus Zen",
      "next_rec": "T\xE2che Recommand\xE9e",
      "start_focus": "D\xE9marrer le Focus",
      "other_suggestion": "Autre Suggestion",
      "open_steps": "Guide \xC9tape par \xC9tape",
      "completed": "Termin\xE9 !",
      "complete_btn": "Termin\xE9",
      "complete": "Termin\xE9",
      "complete_task": "T\xE2che termin\xE9e",
      "timer_title": "Minuteur de Focus",
      "start": "D\xE9marrer",
      "stop": "Arr\xEAter",
      "steps_btn": "\xC9tapes",
      "steps_tab": "\xC9tapes",
      "pick_desc": "Tu te sens submerg\xE9 ? Laisse Flow choisir la meilleure t\xE2che selon tes priorit\xE9s :",
      "next_suggestion": "\u{1F3B2} T\xE2che Suivante",
      "steps_desc": "S\xE9lectionne une t\xE2che pour voir son d\xE9coupage d\xE9taill\xE9 pas \xE0 pas :",
      "start_timer": "D\xE9marrer le minuteur",
      "dropdown_placeholder": "-- S\xE9lectionne une t\xE2che de ton tableau --",
      "boost_btn": "\xC9tincelle",
      "boost_desc": "Bloqu\xE9 dans l'action ? Tente cette micro-action de 30 secondes pour relancer ton \xE9lan :",
      "boost_placeholder": "Clique ci-dessous pour recevoir une impulsion imm\xE9diate !",
      "boost_new": "Autre Id\xE9e \u{1F504}",
      "dopamine_kick_title": "Pr\xEAt pour un coup de dopamine ? \u26A1",
      "dopamine_kick_start": "\u26A1 Donne-moi une action !",
      "dopamine_kick_done": "C'est fait ! \u{1F389} (+25 XP)",
      "dopamine_kick_other": "Autre Action \u{1F504}",
      "dopamine_kick_completed_toast": "Action termin\xE9e ! Bravo pour ce d\xE9marrage.",
      "dopamine_kick_success_log": "\u26A1 Coup de dopamine valid\xE9 :",
      "whatnow_kickstart": "\u{1FA9C} \xC9lan",
      "cook_add_ingredient": "Ajouter",
      "cook_add_ingredient_placeholder": "Entrer un ingr\xE9dient (ex. P\xE2tes, \u0152ufs)...",
      "cook_suggest": "Proposer une Recette \u{1F373}",
      "cook_pantry_empty": "Ton placard est vide. Ajoute des ingr\xE9dients ci-dessus !",
      "cook_suggestion_title": "Id\xE9e de Recette",
      "cook_steps": "Instructions de Pr\xE9paration",
      "cook_ingredients": "Tes Ingr\xE9dients",
      "cook_quick_staples": "Ingr\xE9dients de Base",
      "cook_recipe_ingredients": "Ingr\xE9dients Requis",
      "cook_placeholder_empty": "Ajoute tes ingr\xE9dients pour recevoir des suggestions sur mesure.",
      "cook_time": "Temps",
      "cook_tags": "Tags",
      "cook_add_to_shop": "Ajouter les ingr\xE9dients manquants \xE0 la liste de courses \u{1F6D2}",
      "shop_add_placeholder": "Ajouter un article (ex. 2x lait d'avoine, pain)...",
      "shop_add_btn": "Ajouter",
      "shop_history": "Historique",
      "shop_clear": "Vider",
      "shop_recent_bought": "Achet\xE9 r\xE9cemment",
      "shop_empty": "Ta liste de courses est vide !",
      "supermarket_mode_btn": "Mode Supermarch\xE9 \u{1F6D2}",
      "supermarket_title": "Mode Supermarch\xE9 \u{1F6D2}",
      "sample_banner_title": "\u{1F4A1} Ce sont des exemples de t\xE2ches pour t'inspirer.",
      "sample_banner_desc": "Tu peux les personnaliser, garder ce qui t'int\xE9resse ou tout effacer.",
      "sample_keep_all": "Tout garder \u2713",
      "sample_customize_btn": "Choisir & Personnaliser \u270F\uFE0F",
      "sample_clear_btn": "Vider le tableau \u{1F5D1}\uFE0F",
      "sample_modal_title": "G\xE9rer les T\xE2ches Mod\xE8les",
      "sample_modal_subtitle": "Choisis les mod\xE8les \xE0 charger ou vide enti\xE8rement ton tableau",
      "sample_cat_daily": "Routine Quotidienne",
      "sample_cat_weekly": "M\xE9nage & Entretien",
      "sample_cat_occasionally": "Entretien P\xE9riodique",
      "sample_select_all": "Tout s\xE9lectionner",
      "sample_deselect_all": "Tout d\xE9s\xE9lectionner",
      "sample_apply_btn": "Charger les t\xE2ches s\xE9lectionn\xE9es",
      "sample_toast_loaded": "Les mod\xE8les s\xE9lectionn\xE9s ont \xE9t\xE9 charg\xE9s avec succ\xE8s !",
      "sample_toast_cleared": "Le tableau a \xE9t\xE9 enti\xE8rement vid\xE9 !",
      "toast_no_undo": "Rien d'autre \xE0 annuler.",
      "toast_undo_applied": "Derni\xE8re action annul\xE9e.",
      "toast_reset_success": "Ton plan a \xE9t\xE9 enti\xE8rement r\xE9initialis\xE9.",
      "toast_import_success": "Plan import\xE9 avec succ\xE8s !",
      "toast_import_error": "\xC9chec de la lecture du fichier de sauvegarde.",
      "toast_task_deleted": "T\xE2che supprim\xE9e.",
      "toast_task_restored": "T\xE2che restaur\xE9e.",
      "toast_appointment_name_error": "Veuillez saisir un nom pour le rendez-vous.",
      "toast_appointment_saved": "Rendez-vous enregistr\xE9 avec succ\xE8s !",
      "appointment_new_btn": "Nouveau Rendez-vous",
      "appointment_form_title": "Ajouter un Rendez-vous",
      "appointment_form_name_placeholder": "De quoi s'agit-il ? (ex. Dentiste)",
      "appointment_form_date_label": "Date",
      "appointment_form_time_label": "Heure",
      "appointment_form_save_btn": "Enregistrer",
      "appointment_form_cancel_btn": "Annuler",
      "sound_rain": "Pluie Douce",
      "sound_forest": "For\xEAt Profonde",
      "sound_waves": "Vagues de l'Oc\xE9an",
      "sound_fire": "Feu de Bois",
      "sound_whitenoise": "Bruit Blanc",
      "sound_pinknoise": "Bruit Rose",
      "sound_brownnoise": "Bruit Brun",
      "sound_binaural_alpha": "Ondes Alpha (Focus)",
      "sound_binaural_theta": "Ondes Th\xEAta (Calme)",
      "sound_cafe": "Caf\xE9 Confortable",
      "sound_lofi": "Accords Lo-Fi",
      "sound_space": "Ambiance Cosmique",
      "sound_stream": "Ruisseau de Montagne",
      "sound_night": "Grillons Nocturnes",
      "sound_train": "Train de Nuit",
      "sound_wind": "Vent L\xE9ger",
      "sound_underwater": "Immersion Sous-Marine",
      "sound_fan": "Ventilateur",
      "sound_clock": "Horloge Douce",
      "sound_monastery": "Bols Tib\xE9tains",
      "sound_lofi_sunshine": "Lofi Sunshine",
      "sound_bossa_nova": "Bossa Nova",
      "sound_jazz_piano": "Jazz Voicings",
      "sound_rhodes": "Fender Rhodes",
      "sound_hypnotic_riff": "Riff Hypnotique",
      "sound_techno": "Techno 128",
      "sound_dnb": "Drum & Bass",
      "sound_afrobeats": "Afrobeats",
      "sound_swing": "Swing & Jazz",
      "sound_boombap": "Boom-Bap",
      "guide_title": "Guide de D\xE9marrage Rapide Flow",
      "guide_desc": "Clique sur un \xE9l\xE9ment pour l'ouvrir directement. Utilise les raccourcis clavier hors des zones de saisie !",
      "guide_focus_mode_title": "Mode Focus",
      "guide_focus_mode_desc": "Masque les \xE9l\xE9ments distrayants pour afficher uniquement ta t\xE2che prioritaire dans une vue Zen \xE9pur\xE9e.",
      "guide_focus_mode_key": "Touche [F]",
      "guide_timer_title": "Minuteur de Focus",
      "guide_timer_desc": "D\xE9marre des sessions de travail rythm\xE9es par des encouragements vocaux et des ambiances sonores.",
      "guide_timer_key_start": "D\xE9marrer/Pause [T]",
      "guide_timer_key_stop": "Arr\xEAter [S]",
      "guide_whatnow_title": "Et maintenant ?",
      "guide_whatnow_desc": "Surmonte l'ind\xE9cision en tirant au sort la prochaine t\xE2che recommand\xE9e selon ta priorit\xE9.",
      "guide_whatnow_key": "Touche [W]",
      "guide_break_title": "Pause Sensorielle & R\xE9cup\xE9ration",
      "guide_break_desc": "Soulage la surcharge mentale gr\xE2ce \xE0 la respiration 4-4-4, l'ancrage 5-4-3-2-1 ou une micro-sieste.",
      "guide_break_key": "Touche [P]",
      "guide_cooking_title": "Cuisine & Placard",
      "guide_cooking_desc": "Saisis les ingr\xE9dients disponibles pour g\xE9n\xE9rer des recettes \xE9tape par \xE9tape instantan\xE9ment.",
      "guide_cooking_key": "Touche [K]",
      "guide_shopping_title": "Liste de Courses",
      "guide_shopping_desc": "G\xE8re tes emplettes facilement gr\xE2ce au Mode Supermarch\xE9 plein \xE9cran.",
      "guide_shopping_key": "Touche [E]",
      "guide_sport_title": "Sport & Mouvement",
      "guide_sport_desc": "Active ton corps en douceur avec des exercices d'une minute adapt\xE9s \xE0 ton niveau d'\xE9nergie.",
      "guide_sport_key": "Touche [O]",
      "guide_report_title": "Statistiques & Victoires",
      "guide_report_desc": "Consulte ton activit\xE9 quotidienne, tes courbes hebdomadaires et exporte tes rapports en image.",
      "guide_report_key": "Touche [R]",
      "guide_sample_title": "G\xE9rer les Mod\xE8les de T\xE2ches",
      "guide_sample_desc": "Recharge des routines types pour la maison, adapte-les ou vide ton tableau \xE0 tout moment.",
      "guide_sample_key": "Mod\xE8les",
      "guide_shortcuts_title": "Autres Raccourcis",
      "guide_shortcuts_desc": "\u2022 <b>Touche [U]</b> : Annuler la derni\xE8re action<br>\u2022 <b>Touche [A]</b> : Ajouter un rendez-vous<br>\u2022 <b>Touche [B]</b> : Ouvrir \xC9lan & Focus<br>\u2022 <b>Touche [I]</b> : Inspiration du jour<br>\u2022 <b>Touche [H]</b> : Ouvrir/fermer ce guide<br>\u2022 <b>Touche [\xC9chap]</b> : Fermer les fen\xEAtres",
      "guide_shortcuts_key": "Multiples",
      "guide_footer_local": "Flow Suite \xB7 Local-First",
      "guide_footer_privacy": "Confidentialit\xE9 & Mentions L\xE9gales",
      "pause_panel_title": "Pause Sensorielle & R\xE9cup\xE9ration",
      "pause_breath_title": "Respiration 4-4-4",
      "pause_breath_sub": "Apaise le syst\xE8me nerveux en 60s",
      "pause_grounding_title": "Ancrage 5-4-3-2-1",
      "pause_grounding_sub": "Te ram\xE8ne imm\xE9diatement au pr\xE9sent",
      "pause_stretch_title": "\xC9tirement du Corps & Cou",
      "pause_stretch_sub": "2 minutes d'\xE9tirement doux",
      "pause_nap_title": "Micro-Sieste (20 Min) \u{1F634}",
      "pause_nap_sub": "Repos r\xE9parateur sous une pluie douce",
      "settings_dropdown_title": "Param\xE8tres",
      "settings_btn_fullscreen": "Plein \xE9cran \u2197",
      "settings_section_theme": "\u{1F3A8} Th\xE8me de Couleur (16 Th\xE8mes)",
      "settings_section_lang": "\u{1F310} Choisir la Langue",
      "settings_p2p_sync": "Synchro Mobile Directe",
      "settings_privacy_btn": "Confidentialit\xE9",
      "audio_center_title": "Centre Audio",
      "audio_center_subtitle": "Focus, Beats & Studio Mix",
      "audio_tab_ambient": "Ambiances Nature",
      "audio_tab_beats": "Beats & Lo-Fi",
      "audio_tab_dj": "Studio Mix",
      "cal_mo": "Lu",
      "cal_di": "Ma",
      "cal_mi": "Me",
      "cal_do": "Je",
      "cal_fr": "Ve",
      "cal_sa": "Sa",
      "cal_so": "Di",
      "month_jan": "Janvier",
      "month_feb": "F\xE9vrier",
      "month_mar": "Mars",
      "month_apr": "Avril",
      "month_may": "Mai",
      "month_jun": "Juin",
      "month_jul": "Juillet",
      "month_aug": "Ao\xFBt",
      "month_sep": "Septembre",
      "month_oct": "Octobre",
      "month_nov": "Novembre",
      "month_dec": "D\xE9cembre",
      "mobile_nav_tools": "Outils",
      "mobile_nav_planner": "Planning",
      "mobile_nav_focus": "Focus",
      "mobile_nav_audio": "Audio",
      "mobile_nav_game": "Jeu",
      "mobile_fab_title": "Ajouter une t\xE2che",
      "mobile_quick_title": "Menu Rapide & Options",
      "mobile_quick_desc": "Toutes les fonctions \xE0 port\xE9e de main",
      "mobile_quick_sync_title": "Synchro Live",
      "mobile_quick_sync_sub": "Transfert QR & P2P",
      "mobile_quick_stats_title": "Statistiques",
      "mobile_quick_stats_sub": "Analyse hebdo",
      "mobile_quick_theme_title": "Th\xE8me",
      "mobile_quick_theme_sub": "16 Th\xE8mes",
      "mobile_quick_lang_title": "Langue",
      "mobile_quick_lang_sub": "6 Langues",
      "mobile_quick_whatnow_title": "Et maintenant ?",
      "mobile_quick_whatnow_sub": "Action spontan\xE9e",
      "mobile_quick_break_title": "Pause Sensorielle",
      "mobile_quick_break_sub": "Respiration & Calme",
      "mobile_quick_save_title": "Sauvegarder",
      "mobile_quick_save_sub": "Export JSON",
      "mobile_quick_settings_title": "Param\xE8tres",
      "mobile_quick_settings_sub": "Options & RGPD",
      "mobile_tools_section": "\u{1F6E0}\uFE0F Lifestyle & Productivit\xE9",
      "mobile_tools_sync_badge": "1-Clic",
      "mobile_tools_sync_title": "Synchro Live & QR",
      "mobile_tools_sync_sub": "PC \u2194 Mobile",
      "mobile_tools_opt_badge": "Options",
      "mobile_tools_opt_title": "Design & Langue",
      "mobile_tools_opt_sub": "Th\xE8mes & Sauvegarde",
      "mobile_tools_shop_badge": "Courses",
      "mobile_tools_shop_title": "Liste de Courses",
      "mobile_tools_shop_sub": "Articles & Quantit\xE9s",
      "mobile_tools_cook_badge": "Marmite",
      "mobile_tools_cook_title": "Recettes & Prep",
      "mobile_tools_cook_sub": "\xC9tape par \xC9tape",
      "mobile_tools_sport_badge": "Actif",
      "mobile_tools_sport_title": "Pause Mouvement",
      "mobile_tools_sport_sub": "Micro-Entra\xEEnements",
      "mobile_tools_alarm_badge": "Alarme",
      "mobile_tools_alarm_title": "Alarmes & Minuteurs",
      "mobile_tools_alarm_sub": "Rappels Pr\xE9cis",
      "mobile_tools_stats_badge": "Stats",
      "mobile_tools_stats_title": "Productivit\xE9",
      "mobile_tools_stats_sub": "Rapport Hebdo",
      "mobile_tools_whatnow_badge": "\xC9lan",
      "mobile_tools_whatnow_title": "Et maintenant ?",
      "mobile_tools_whatnow_sub": "Choix par \xC9nergie",
      "mobile_audio_synth_title": "Beats Synth\xE9tiseur"
    }
  };
  if (typeof window !== "undefined") {
    window.TRANSLATIONS_PART1 = TRANSLATIONS_PART12;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.TRANSLATIONS_PART1 = TRANSLATIONS_PART12;
  }

  // data-translations-2.js
  var TRANSLATIONS_PART22 = {
    "it": {
      "weekly": "Casa",
      "daily": "Oggi",
      "todo": "Da fare",
      "done": "Fatto",
      "termine": "Appuntamenti",
      "occasionally": "Occasionale",
      "notes": "Note",
      "notesPlaceholder": "Scrivi qui le tue note, idee e promemoria rapidi...",
      "add": "Aggiungi attivit\xE0",
      "add_task": "Aggiungi attivit\xE0",
      "add_column": "Aggiungi colonna",
      "column_name": "Titolo colonna",
      "delete_column": "Elimina colonna",
      "rename_column": "Rinomina colonna",
      "choose_icon": "Scegli icona",
      "card_color": "Colore scheda",
      "confirm_delete_column": "Sei sicuro di voler eliminare questa colonna e tutte le sue attivit\xE0?",
      "new_task_placeholder": "Cosa c'\xE8 da fare?",
      "report": "Statistiche",
      "report_title": "Produttivit\xE0 & Statistiche",
      "report_today": "Oggi",
      "report_week": "Settimana",
      "report_month": "Mese",
      "report_open_full": "Apri Dashboard Completa \u2197",
      "open_dashboard": "Apri Dashboard Completa \u2197",
      "dashboard_title": "Dashboard Analitica",
      "focus_time": "Tempo di Focus",
      "peak_hours": "Ore Pi\xF9 Produttive",
      "category_balance": "Bilanciamento Categorie",
      "search_history": "Cerca attivit\xE0 completate...",
      "morning_peak": "Mattina (06:00 - 12:00)",
      "afternoon_peak": "Pomeriggio (12:00 - 18:00)",
      "evening_peak": "Sera (18:00 - 24:00)",
      "night_peak": "Notte (00:00 - 06:00)",
      "export_image": "Salva come immagine (PNG)",
      "copy_report": "Copia riepilogo",
      "settings": "Opzioni",
      "tab_general": "Generale",
      "tab_history": "Cronologia versioni",
      "tab_impressum": "Note Legali (\xA7 5 DDG)",
      "tab_privacy": "Privacy & GDPR",
      "tab_licenses": "Licenze & Disclaimer",
      "history_subtitle": "Cronologia visiva e traguardi dello sviluppo di Flow",
      "settings_modal_title": "Impostazioni & Conformit\xE0",
      "settings_modal_subtitle": "Configurazione, informativa privacy e licenze open-source",
      "setting_default_workspace": "Area di lavoro predefinita all'avvio",
      "setting_default_timer": "Durata del focus predefinita",
      "setting_clear_data": "Cancella tutti i dati locali",
      "setting_clear_data_confirm": "Sei sicuro di voler cancellare definitivamente tutti i dati locali e ripristinare l'app?",
      "cmd_search_placeholder": "Digita un comando o cerca attivit\xE0... (Ctrl+K)",
      "cmd_actions": "Azioni rapide",
      "cmd_tasks": "Attivit\xE0 corrispondenti",
      "cmd_no_results": "Nessun comando o attivit\xE0 trovata",
      "cmd_shortcut_hint": "Usa \u2191 \u2193 per navigare, Invio per selezionare, Esc per uscire",
      "recurrence_label": "Ripeti attivit\xE0",
      "recurrence_none": "Nessuna ripetizione",
      "recurrence_daily": "Ogni giorno",
      "recurrence_weekdays": "Giorni feriali (Lun-Ven)",
      "recurrence_weekly": "Settimanale",
      "whatnow": "E adesso?",
      "minimal_mode": "Modalit\xE0 Focus",
      "standard_mode": "Vista Standard",
      "pause_btn": "Pausa",
      "give_feedback": "Feedback",
      "feedback": "Feedback",
      "feedback_desc": "Come trovi Flow? I tuoi suggerimenti ci aiutano a migliorare costantemente!",
      "feedback_placeholder": "Condividi pensieri, idee o suggerimenti...",
      "feedback_greet": "Ciao! \u{1F44B}",
      "feedback_prompt": "Hai feedback, idee o suggerimenti per Flow? Scrivici un messaggio!",
      "feedback_alt": "o invia un'email a support@flow-planner.app",
      "feedback_send_tooltip": "Invia feedback direttamente al creatore",
      "send": "Invia",
      "login_btn": "Accedi",
      "sync_title": "Sincronizzazione Dispositivi",
      "sync_desc": "Salva il tuo piano e usalo comodamente su tutti i tuoi schermi.",
      "login": "Accedi",
      "register": "Registrati",
      "title_undo": "Annulla",
      "title_open": "Apri piano",
      "title_save": "Salva piano",
      "title_reset": "Ripristina tutto",
      "title_theme": "Tema Colore",
      "options_title": "Opzioni & Impostazioni",
      "theme_select": "Tema",
      "lang_select": "Lingua",
      "workspace_private": "Personale",
      "workspace_work": "Lavoro",
      "work_focus": "Focus Oggi",
      "work_in_progress": "In Corso",
      "work_waiting": "In Attesa",
      "work_backlog": "Backlog",
      "dock_sounds": "Suoni",
      "dock_music": "Musica",
      "dock_shop": "Spesa",
      "dock_cook": "Cucina",
      "dock_scripts": "Script",
      "dock_alarm": "Sveglia",
      "dock_weather": "Meteo",
      "dock_news": "Notizie",
      "dock_spark": "Scintilla",
      "dock_inspire": "Ispirazione",
      "dock_clarity": "Chiarezza",
      "dock_impulse": "Slancio",
      "dock_audio": "Audio",
      "dock_daily": "Quotidiano",
      "dock_beats": "Beat",
      "dock_workout": "Workout",
      "dock_matrix": "Matrice",
      "dock_gamification": "Arcade",
      "weather_title": "Meteo Locale",
      "news_title": "Daily Digest",
      "clarity_title": "Chiarezza & Controllo Impulsi",
      "clarity_subtitle": "Supera le tentazioni, interrompi le abitudini indesiderate e rafforza l'autocontrollo",
      "sounds": "Suoni",
      "soundscape_title": "Suoni della Natura & Concentrazione",
      "music": "Musica",
      "music_player": "Lettore Audio",
      "custom_tracks": "Riproduci i tuoi file audio",
      "no_tracks": "Nessun brano caricato",
      "shopping": "Lista della Spesa",
      "cooking": "Cucina Intelligente",
      "scripts": "Script Sociali",
      "alarm": "Sveglie & Promemoria",
      "spark": "Scintilla Rapida",
      "inspire": "Ispirazione",
      "inspire_title": "Ispirazione del Giorno",
      "zen_title": "Focus Zen",
      "next_rec": "Attivit\xE0 Consigliata",
      "start_focus": "Inizia Focus",
      "other_suggestion": "Altro Suggerimento",
      "open_steps": "Guida Passo Passo",
      "completed": "Completato!",
      "complete_btn": "Completato",
      "complete": "Completato",
      "complete_task": "Attivit\xE0 completata",
      "timer_title": "Timer di Focus",
      "start": "Avvia",
      "stop": "Ferma",
      "steps_btn": "Passaggi",
      "steps_tab": "Passaggi",
      "pick_desc": "Ti senti bloccato? Lascia che Flow scelga la prossima attivit\xE0 migliore in base alle tue priorit\xE0:",
      "next_suggestion": "\u{1F3B2} Prossima Attivit\xE0",
      "steps_desc": "Seleziona un'attivit\xE0 per visualizzare la suddivisione dettagliata passo dopo passo:",
      "start_timer": "Avvia Timer",
      "dropdown_placeholder": "-- Seleziona un'attivit\xE0 dalla tua lavagna --",
      "boost_btn": "Scintilla",
      "boost_desc": "Bloccato nell'azione? Prova questa micro-azione di 30 secondi per ritrovare lo slancio:",
      "boost_placeholder": "Fai clic qui sotto per generare un impulso immediato!",
      "boost_new": "Nuovo Impulso \u{1F504}",
      "dopamine_kick_title": "Pronto per una dose rapida di dopamina? \u26A1",
      "dopamine_kick_start": "\u26A1 Dammi un'azione!",
      "dopamine_kick_done": "Fatto! \u{1F389} (+25 XP)",
      "dopamine_kick_other": "Altra Azione \u{1F504}",
      "dopamine_kick_completed_toast": "Azione completata! Ottimo inizio.",
      "dopamine_kick_success_log": "\u26A1 Spinta di dopamina completata:",
      "whatnow_kickstart": "\u{1FA9C} Slancio",
      "cook_add_ingredient": "Aggiungi",
      "cook_add_ingredient_placeholder": "Inserisci un ingrediente (es. Pasta, Uova)...",
      "cook_suggest": "Proponi Ricetta \u{1F373}",
      "cook_pantry_empty": "La tua dispensa \xE8 vuota. Aggiungi ingredienti sopra!",
      "cook_suggestion_title": "Proposta di Ricetta",
      "cook_steps": "Istruzioni di Preparazione",
      "cook_ingredients": "I Tuoi Ingredienti",
      "cook_quick_staples": "Ingredienti di Base",
      "cook_recipe_ingredients": "Ingredienti Richiesti",
      "cook_placeholder_empty": "Inserisci gli ingredienti per ricevere ricette su misura.",
      "cook_time": "Tempo",
      "cook_tags": "Tag",
      "cook_add_to_shop": "Aggiungi ingredienti mancanti alla lista della spesa \u{1F6D2}",
      "shop_add_placeholder": "Aggiungi articolo (es. 2x latte d'avena, pane)...",
      "shop_add_btn": "Aggiungi",
      "shop_history": "Cronologia",
      "shop_clear": "Svuota",
      "shop_recent_bought": "Acquistati di recente",
      "shop_empty": "La tua lista della spesa \xE8 pulita!",
      "supermarket_mode_btn": "Modalit\xE0 Supermercato \u{1F6D2}",
      "supermarket_title": "Modalit\xE0 Supermercato \u{1F6D2}",
      "sample_banner_title": "\u{1F4A1} Queste sono attivit\xE0 di esempio per darti ispirazione.",
      "sample_banner_desc": "Puoi personalizzarle, tenere quelle che desideri o svuotare la lavagna per iniziare da zero.",
      "sample_keep_all": "Tieni Tutto \u2713",
      "sample_customize_btn": "Scegli & Personalizza \u270F\uFE0F",
      "sample_clear_btn": "Svuota Lavagna \u{1F5D1}\uFE0F",
      "sample_modal_title": "Gestisci Attivit\xE0 di Esempio",
      "sample_modal_subtitle": "Scegli quali modelli caricare o svuota completamente la lavagna",
      "sample_cat_daily": "Routine Quotidiana",
      "sample_cat_weekly": "Casa & Pulizie",
      "sample_cat_occasionally": "Manutenzione Periodica",
      "sample_select_all": "Seleziona Tutto",
      "sample_deselect_all": "Deseleziona Tutto",
      "sample_apply_btn": "Carica Attivit\xE0 Selezionate",
      "sample_toast_loaded": "Modelli selezionati caricati con successo!",
      "sample_toast_cleared": "Lavagna svuotata completamente!",
      "toast_no_undo": "Niente da annullare.",
      "toast_undo_applied": "Ultima azione annullata.",
      "toast_reset_success": "Il tuo piano \xE8 stato ripristinato ai valori predefiniti.",
      "toast_import_success": "Piano importato con successo!",
      "toast_import_error": "Impossibile leggere il file di backup.",
      "toast_task_deleted": "Attivit\xE0 eliminata.",
      "toast_task_restored": "Attivit\xE0 ripristinata.",
      "toast_appointment_name_error": "Inserisci un nome per l'appuntamento.",
      "toast_appointment_saved": "Appuntamento salvato con successo!",
      "appointment_new_btn": "Nuovo Appuntamento",
      "appointment_form_title": "Aggiungi Appuntamento",
      "appointment_form_name_placeholder": "Di cosa si tratta? (es. Dentista)",
      "appointment_form_date_label": "Data",
      "appointment_form_time_label": "Ora",
      "appointment_form_save_btn": "Salva",
      "appointment_form_cancel_btn": "Annulla",
      "sound_rain": "Pioggia Leggera",
      "sound_forest": "Foresta Profonda",
      "sound_waves": "Onde del Mare",
      "sound_fire": "Camino Acceso",
      "sound_whitenoise": "Rumore Bianco",
      "sound_pinknoise": "Rumore Rosa",
      "sound_brownnoise": "Rumore Marrone",
      "sound_binaural_alpha": "Onde Alpha (Focus)",
      "sound_binaural_theta": "Onde Theta (Calma)",
      "sound_cafe": "Caff\xE8 Accogliente",
      "sound_lofi": "Accordi Lo-Fi",
      "sound_space": "Ambiente Cosmico",
      "sound_stream": "Ruscello di Montagna",
      "sound_night": "Grilli Notturni",
      "sound_train": "Treno Notturno",
      "sound_wind": "Vento Leggero",
      "sound_underwater": "Immersione Subacquea",
      "sound_fan": "Ventilatore",
      "sound_clock": "Orologio Delicato",
      "sound_monastery": "Campane Tibetane",
      "sound_lofi_sunshine": "Lofi Sunshine",
      "sound_bossa_nova": "Bossa Nova",
      "sound_jazz_piano": "Jazz Voicings",
      "sound_rhodes": "Fender Rhodes",
      "sound_hypnotic_riff": "Riff Ipnotico",
      "sound_techno": "Techno 128",
      "sound_dnb": "Drum & Bass",
      "sound_afrobeats": "Afrobeats",
      "sound_swing": "Swing & Jazz",
      "sound_boombap": "Boom-Bap",
      "guide_title": "Guida Rapida di Flow",
      "guide_desc": "Fai clic su un elemento per aprirlo direttamente. Usa le scorciatoie da tastiera fuori dai campi di testo!",
      "guide_focus_mode_title": "Modalit\xE0 Focus",
      "guide_focus_mode_desc": "Nasconde le distrazioni per mostrare solo l'attivit\xE0 prioritaria in una visualizzazione Zen serena.",
      "guide_focus_mode_key": "Tasto [F]",
      "guide_timer_title": "Timer di Focus",
      "guide_timer_desc": "Avvia sessioni di lavoro con incoraggiamenti vocali periodici e suoni ambientali.",
      "guide_timer_key_start": "Avvia/Pausa [T]",
      "guide_timer_key_stop": "Ferma [S]",
      "guide_whatnow_title": "E adesso?",
      "guide_whatnow_desc": "Supera l'indecisione suggerendo una singola attivit\xE0 basata sulla priorit\xE0 corrente.",
      "guide_whatnow_key": "Tasto [W]",
      "guide_break_title": "Pausa Sensoriale & Recupero",
      "guide_break_desc": "Allevia il sovraccarico sensoriale con respirazione 4-4-4, radicamento 5-4-3-2-1 o un power nap.",
      "guide_break_key": "Tasto [P]",
      "guide_cooking_title": "Cucina & Dispensa",
      "guide_cooking_desc": "Inserisci gli ingredienti disponibili per generare istantaneamente ricette passo passo.",
      "guide_cooking_key": "Tasto [K]",
      "guide_shopping_title": "Lista della Spesa",
      "guide_shopping_desc": "Gestisci la spesa con facilit\xE0 grazie alla Modalit\xE0 Supermercato a schermo intero.",
      "guide_shopping_key": "Tasto [E]",
      "guide_sport_title": "Sport & Movimento",
      "guide_sport_desc": "Attiva dolcemente il corpo con esercizi da 1 minuto adatti al tuo livello di energia (Spoons).",
      "guide_sport_key": "Tasto [O]",
      "guide_report_title": "Statistiche & Risultati",
      "guide_report_desc": "Traccia i progressi quotidiani, visualizza i grafici settimanali ed esporta riepiloghi in immagine.",
      "guide_report_key": "Tasto [R]",
      "guide_sample_title": "Gestisci Attivit\xE0 di Esempio",
      "guide_sample_desc": "Ricarica le routine domestiche tipo, personalizzale o svuota completamente la lavagna.",
      "guide_sample_key": "Modelli",
      "guide_shortcuts_title": "Altre Scorciatoie",
      "guide_shortcuts_desc": "\u2022 <b>Tasto [U]</b>: Annulla ultima azione<br>\u2022 <b>Tasto [A]</b>: Aggiungi appuntamento<br>\u2022 <b>Tasto [B]</b>: Apri Slancio & Focus<br>\u2022 <b>Tasto [I]</b>: Ispirazione quotidiana<br>\u2022 <b>Tasto [H]</b>: Apri/chiudi questa guida<br>\u2022 <b>Tasto [Esc]</b>: Chiudi tutte le finestre",
      "guide_shortcuts_key": "Multiple",
      "guide_footer_local": "Flow Suite \xB7 Local-First",
      "guide_footer_privacy": "Privacy & Note Legali",
      "pause_panel_title": "Pausa Sensoriale & Recupero",
      "pause_breath_title": "Respirazione 4-4-4",
      "pause_breath_sub": "Calma il sistema nervoso in 60s",
      "pause_grounding_title": "Radicamento 5-4-3-2-1",
      "pause_grounding_sub": "Ti riporta subito al momento presente",
      "pause_stretch_title": "Stretching Corpo & Collo",
      "pause_stretch_sub": "2 minuti di allungamento dolce",
      "pause_nap_title": "Power Nap (20 Min) \u{1F634}",
      "pause_nap_sub": "Riposo breve con pioggia leggera",
      "settings_dropdown_title": "Impostazioni",
      "settings_btn_fullscreen": "Schermo intero \u2197",
      "settings_section_theme": "\u{1F3A8} Tema Colore (16 Temi)",
      "settings_section_lang": "\u{1F310} Scegli Lingua",
      "settings_p2p_sync": "Sincronizzazione Live",
      "settings_privacy_btn": "Privacy",
      "audio_center_title": "Centro Audio",
      "audio_center_subtitle": "Focus, Beat & Mix Studio",
      "audio_tab_ambient": "Suoni della Natura",
      "audio_tab_beats": "Beat & Lo-Fi",
      "audio_tab_dj": "Mix Studio",
      "cal_mo": "Lu",
      "cal_di": "Ma",
      "cal_mi": "Me",
      "cal_do": "Gi",
      "cal_fr": "Ve",
      "cal_sa": "Sa",
      "cal_so": "Do",
      "month_jan": "Gennaio",
      "month_feb": "Febbraio",
      "month_mar": "Marzo",
      "month_apr": "Aprile",
      "month_may": "Maggio",
      "month_jun": "Giugno",
      "month_jul": "Luglio",
      "month_aug": "Agosto",
      "month_sep": "Settembre",
      "month_oct": "Ottobre",
      "month_nov": "Novembre",
      "month_dec": "Dicembre",
      "mobile_nav_tools": "Strumenti",
      "mobile_nav_planner": "Pianificatore",
      "mobile_nav_focus": "Focus",
      "mobile_nav_audio": "Audio",
      "mobile_nav_game": "Gioco",
      "mobile_fab_title": "Aggiungi nuova attivit\xE0",
      "mobile_quick_title": "Menu Rapido & Opzioni",
      "mobile_quick_desc": "Tutte le funzioni a portata di mano",
      "mobile_quick_sync_title": "Live-Sync",
      "mobile_quick_sync_sub": "Trasferimento QR & P2P",
      "mobile_quick_stats_title": "Statistiche",
      "mobile_quick_stats_sub": "Report settimanale",
      "mobile_quick_theme_title": "Tema Colore",
      "mobile_quick_theme_sub": "16 Temi",
      "mobile_quick_lang_title": "Lingua",
      "mobile_quick_lang_sub": "6 Lingue",
      "mobile_quick_whatnow_title": "E adesso?",
      "mobile_quick_whatnow_sub": "Azione spontanea",
      "mobile_quick_break_title": "Pausa Sensoriale",
      "mobile_quick_break_sub": "Respirazione & Calma",
      "mobile_quick_save_title": "Salva piano",
      "mobile_quick_save_sub": "Esportazione JSON",
      "mobile_quick_settings_title": "Impostazioni",
      "mobile_quick_settings_sub": "Opzioni & GDPR",
      "mobile_tools_section": "\u{1F6E0}\uFE0F Stile di vita & Produttivit\xE0",
      "mobile_tools_sync_badge": "1-Clic",
      "mobile_tools_sync_title": "Live-Sync & QR",
      "mobile_tools_sync_sub": "PC \u2194 Smartphone",
      "mobile_tools_opt_badge": "Opzioni",
      "mobile_tools_opt_title": "Design & Lingua",
      "mobile_tools_opt_sub": "Temi & Backup",
      "mobile_tools_shop_badge": "Spesa",
      "mobile_tools_shop_title": "Lista della Spesa",
      "mobile_tools_shop_sub": "Categorie & Quantit\xE0",
      "mobile_tools_cook_badge": "Cucina",
      "mobile_tools_cook_title": "Ricette & Prep",
      "mobile_tools_cook_sub": "Passo dopo Passo",
      "mobile_tools_sport_badge": "Attivo",
      "mobile_tools_sport_title": "Pausa Movimento",
      "mobile_tools_sport_sub": "Micro-Allenamenti",
      "mobile_tools_alarm_badge": "Sveglia",
      "mobile_tools_alarm_title": "Sveglie & Timer",
      "mobile_tools_alarm_sub": "Promemoria Precisi",
      "mobile_tools_stats_badge": "Stats",
      "mobile_tools_stats_title": "Produttivit\xE0",
      "mobile_tools_stats_sub": "Report Settimanale",
      "mobile_tools_whatnow_badge": "Slancio",
      "mobile_tools_whatnow_title": "E adesso?",
      "mobile_tools_whatnow_sub": "Suggerimento Energetico",
      "mobile_audio_synth_title": "Beat Sintetizzatore"
    },
    "es": {
      "weekly": "Hogar",
      "daily": "Hoy",
      "todo": "Por hacer",
      "done": "Hecho",
      "termine": "Citas",
      "occasionally": "Ocasional",
      "notes": "Notas",
      "notesPlaceholder": "Escribe aqu\xED tus notas, ideas y recordatorios r\xE1pidos...",
      "add": "A\xF1adir tarea",
      "add_task": "A\xF1adir tarea",
      "add_column": "A\xF1adir columna",
      "column_name": "T\xEDtulo de columna",
      "delete_column": "Eliminar columna",
      "rename_column": "Renombrar columna",
      "choose_icon": "Elegir icono",
      "card_color": "Color de tarjeta",
      "confirm_delete_column": "\xBFEst\xE1s seguro de que deseas eliminar esta columna y todas sus tareas?",
      "new_task_placeholder": "\xBFQu\xE9 hay que hacer?",
      "report": "Estad\xEDsticas",
      "report_title": "Productividad y Estad\xEDsticas",
      "report_today": "Hoy",
      "report_week": "Semana",
      "report_month": "Mes",
      "report_open_full": "Abrir Panel Completo \u2197",
      "open_dashboard": "Abrir Panel Completo \u2197",
      "dashboard_title": "Panel Anal\xEDtico y de Progreso",
      "focus_time": "Tiempo de Concentraci\xF3n",
      "peak_hours": "Horas M\xE1s Productivas",
      "category_balance": "Equilibrio de Categor\xEDas",
      "search_history": "Buscar tareas completadas...",
      "morning_peak": "Ma\xF1ana (06:00 - 12:00)",
      "afternoon_peak": "Tarde (12:00 - 18:00)",
      "evening_peak": "Noche (18:00 - 24:00)",
      "night_peak": "Madrugada (00:00 - 06:00)",
      "export_image": "Guardar como imagen (PNG)",
      "copy_report": "Copiar resumen",
      "settings": "Opciones",
      "tab_general": "General",
      "tab_history": "Historial de versiones",
      "tab_impressum": "Aviso Legal (\xA7 5 DDG)",
      "tab_privacy": "Privacidad y RGPD",
      "tab_licenses": "Licencias y Descargo",
      "history_subtitle": "L\xEDnea de tiempo visual y avances en el desarrollo de Flow",
      "settings_modal_title": "Ajustes y Cumplimiento Legal",
      "settings_modal_subtitle": "Configuraci\xF3n, pol\xEDtica de privacidad y licencias de c\xF3digo abierto",
      "setting_default_workspace": "\xC1rea de trabajo por defecto al iniciar",
      "setting_default_timer": "Duraci\xF3n de concentraci\xF3n por defecto",
      "setting_clear_data": "Borrar todos los datos locales",
      "setting_clear_data_confirm": "\xBFEst\xE1s seguro de que deseas borrar definitivamente todos los datos locales y restablecer la app?",
      "cmd_search_placeholder": "Escribe un comando o busca tareas... (Ctrl+K)",
      "cmd_actions": "Acciones r\xE1pidas",
      "cmd_tasks": "Tareas coincidentes",
      "cmd_no_results": "No se encontraron comandos o tareas",
      "cmd_shortcut_hint": "Usa \u2191 \u2193 para navegar, Enter para seleccionar, Esc para cerrar",
      "recurrence_label": "Repetir tarea",
      "recurrence_none": "Sin repetici\xF3n",
      "recurrence_daily": "Todos los d\xEDas",
      "recurrence_weekdays": "D\xEDas laborables (Lun-Vie)",
      "recurrence_weekly": "Semanalmente",
      "whatnow": "\xBFY ahora qu\xE9?",
      "minimal_mode": "Modo Enfoque",
      "standard_mode": "Vista Est\xE1ndar",
      "pause_btn": "Pausa",
      "give_feedback": "Opini\xF3n",
      "feedback": "Opini\xF3n",
      "feedback_desc": "\xBFQu\xE9 te parece Flow? \xA1Tus sugerencias nos ayudan a seguir mejorando!",
      "feedback_placeholder": "Comparte tus pensamientos, ideas o propuestas...",
      "feedback_greet": "\xA1Hola! \u{1F44B}",
      "feedback_prompt": "\xBFTienes comentarios, cr\xEDticas o ideas para Flow? \xA1Escr\xEDbenos un mensaje!",
      "feedback_alt": "o env\xEDa un correo a support@flow-planner.app",
      "feedback_send_tooltip": "Enviar comentarios directamente al creador",
      "send": "Enviar",
      "login_btn": "Iniciar sesi\xF3n",
      "sync_title": "Sincronizar Dispositivos",
      "sync_desc": "Guarda tu plan y \xFAsalo f\xE1cilmente en todos tus dispositivos.",
      "login": "Iniciar sesi\xF3n",
      "register": "Registrarse",
      "title_undo": "Deshacer",
      "title_open": "Abrir plan",
      "title_save": "Guardar plan",
      "title_reset": "Restablecer todo",
      "title_theme": "Tema de Color",
      "options_title": "Opciones y Ajustes",
      "theme_select": "Tema",
      "lang_select": "Idioma",
      "workspace_private": "Personal",
      "workspace_work": "Trabajo",
      "work_focus": "Enfoque Hoy",
      "work_in_progress": "En Curso",
      "work_waiting": "En Espera",
      "work_backlog": "Pendientes",
      "dock_sounds": "Sonidos",
      "dock_music": "M\xFAsica",
      "dock_shop": "Compras",
      "dock_cook": "Cocina",
      "dock_scripts": "Guiones",
      "dock_alarm": "Alarma",
      "dock_weather": "Clima",
      "dock_news": "Noticias",
      "dock_spark": "Chispa",
      "dock_inspire": "Inspiraci\xF3n",
      "dock_clarity": "Claridad",
      "dock_impulse": "Impulso",
      "dock_audio": "Audio",
      "dock_daily": "Cotidiano",
      "dock_beats": "Ritmos",
      "dock_workout": "Entrenamiento",
      "dock_matrix": "Matriz",
      "dock_gamification": "Arcade",
      "weather_title": "Clima Local",
      "news_title": "Daily Digest",
      "clarity_title": "Claridad y Control de Impulsos",
      "clarity_subtitle": "Supera los antojos, frena impulsos no deseados y fortalece el autocontrol",
      "sounds": "Sonidos",
      "soundscape_title": "Sonidos de la Naturaleza y Enfoque",
      "music": "M\xFAsica",
      "music_player": "Reproductor de Audio",
      "custom_tracks": "Reproducir tus propios archivos de audio",
      "no_tracks": "A\xFAn no hay canciones cargadas",
      "shopping": "Lista de la Compra",
      "cooking": "Cocina Inteligente",
      "scripts": "Guiones Sociales",
      "alarm": "Alarmas y Recordatorios",
      "spark": "Chispa R\xE1pida",
      "inspire": "Inspiraci\xF3n",
      "inspire_title": "Inspiraci\xF3n del D\xEDa",
      "zen_title": "Enfoque Zen",
      "next_rec": "Tarea Recomendada",
      "start_focus": "Iniciar Enfoque",
      "other_suggestion": "Otra Sugerencia",
      "open_steps": "Gu\xEDa Paso a Paso",
      "completed": "\xA1Completado!",
      "complete_btn": "Hecho",
      "complete": "Hecho",
      "complete_task": "Tarea completada",
      "timer_title": "Temporizador de Enfoque",
      "start": "Iniciar",
      "stop": "Detener",
      "steps_btn": "Pasos",
      "steps_tab": "Pasos",
      "pick_desc": "\xBFTe sientes bloqueado? Deja que Flow elija la mejor tarea seg\xFAn tu prioridad actual:",
      "next_suggestion": "\u{1F3B2} Siguiente Tarea",
      "steps_desc": "Selecciona una tarea para ver el desglose detallado paso a paso:",
      "start_timer": "Iniciar Temporizador",
      "dropdown_placeholder": "-- Selecciona una tarea de tu tablero --",
      "boost_btn": "Chispa",
      "boost_desc": "\xBFBloqueado? Prueba esta microacci\xF3n de 30 segundos para recuperar el impulso:",
      "boost_placeholder": "\xA1Haz clic abajo para recibir un impulso inmediato!",
      "boost_new": "Nuevo Impulso \u{1F504}",
      "dopamine_kick_title": "\xBFListo para un toque r\xE1pido de dopamina? \u26A1",
      "dopamine_kick_start": "\u26A1 \xA1Dame una acci\xF3n!",
      "dopamine_kick_done": "\xA1Hecho! \u{1F389} (+25 XP)",
      "dopamine_kick_other": "Otra Acci\xF3n \u{1F504}",
      "dopamine_kick_completed_toast": "\xA1Acci\xF3n completada! Excelente comienzo.",
      "dopamine_kick_success_log": "\u26A1 Impulso de dopamina completado:",
      "whatnow_kickstart": "\u{1FA9C} Impulso",
      "cook_add_ingredient": "A\xF1adir",
      "cook_add_ingredient_placeholder": "Introduce un ingrediente (ej. Pasta, Huevos)...",
      "cook_suggest": "Sugerir Receta \u{1F373}",
      "cook_pantry_empty": "Tu despensa est\xE1 vac\xEDa. \xA1A\xF1ade ingredientes arriba!",
      "cook_suggestion_title": "Propuesta de Receta",
      "cook_steps": "Pasos de Preparaci\xF3n",
      "cook_ingredients": "Tus Ingredientes",
      "cook_quick_staples": "Ingredientes B\xE1sicos",
      "cook_recipe_ingredients": "Ingredientes Necesarios",
      "cook_placeholder_empty": "A\xF1ade ingredientes para recibir recetas a medida.",
      "cook_time": "Tiempo",
      "cook_tags": "Etiquetas",
      "cook_add_to_shop": "A\xF1adir ingredientes faltantes a la lista de compras \u{1F6D2}",
      "shop_add_placeholder": "A\xF1adir art\xEDculo (ej. 2x leche de avena, pan)...",
      "shop_add_btn": "A\xF1adir",
      "shop_history": "Historial",
      "shop_clear": "Vaciar",
      "shop_recent_bought": "Comprado recientemente",
      "shop_empty": "\xA1Tu lista de compras est\xE1 limpia!",
      "supermarket_mode_btn": "Modo Supermercado \u{1F6D2}",
      "supermarket_title": "Modo Supermercado \u{1F6D2}",
      "sample_banner_title": "\u{1F4A1} Estas son tareas de ejemplo para inspirarte.",
      "sample_banner_desc": "Puedes personalizarlas, quedarte con las que desees o vaciar el tablero para empezar de cero.",
      "sample_keep_all": "Conservar todo \u2713",
      "sample_customize_btn": "Elegir y Personalizar \u270F\uFE0F",
      "sample_clear_btn": "Vaciar tablero \u{1F5D1}\uFE0F",
      "sample_modal_title": "Gestionar Tareas de Ejemplo",
      "sample_modal_subtitle": "Elige qu\xE9 plantillas cargar o vac\xEDa completamente tu tablero",
      "sample_cat_daily": "Rutina Diaria",
      "sample_cat_weekly": "Hogar y Limpieza",
      "sample_cat_occasionally": "Mantenimiento Peri\xF3dico",
      "sample_select_all": "Seleccionar todo",
      "sample_deselect_all": "Deseleccionar todo",
      "sample_apply_btn": "Cargar tareas seleccionadas",
      "sample_toast_loaded": "\xA1Plantillas seleccionadas cargadas con \xE9xito!",
      "sample_toast_cleared": "\xA1Tablero vaciado por completo!",
      "toast_no_undo": "No hay nada que deshacer.",
      "toast_undo_applied": "\xDAltima acci\xF3n deshecha.",
      "toast_reset_success": "Tu plan se ha restablecido a los valores predeterminados.",
      "toast_import_success": "\xA1Plan importado con \xE9xito!",
      "toast_import_error": "Error al leer el archivo de respaldo.",
      "toast_task_deleted": "Tarea eliminada.",
      "toast_task_restored": "Tarea restaurada.",
      "toast_appointment_name_error": "Por favor, introduce un nombre para la cita.",
      "toast_appointment_saved": "\xA1Cita guardada con \xE9xito!",
      "appointment_new_btn": "Nueva Cita",
      "appointment_form_title": "A\xF1adir Cita",
      "appointment_form_name_placeholder": "\xBFDe qu\xE9 se trata? (ej. Dentista)",
      "appointment_form_date_label": "Fecha",
      "appointment_form_time_label": "Hora",
      "appointment_form_save_btn": "Guardar",
      "appointment_form_cancel_btn": "Cancelar",
      "sound_rain": "Lluvia Suave",
      "sound_forest": "Bosque Profundo",
      "sound_waves": "Olas del Mar",
      "sound_fire": "Fuego de Chimenea",
      "sound_whitenoise": "Ruido Blanco",
      "sound_pinknoise": "Ruido Rosa",
      "sound_brownnoise": "Ruido Marr\xF3n",
      "sound_binaural_alpha": "Ondas Alfa (Enfoque)",
      "sound_binaural_theta": "Ondas Theta (Calma)",
      "sound_cafe": "Caf\xE9 Acogedor",
      "sound_lofi": "Acordes Lo-Fi",
      "sound_space": "Ambiente C\xF3smico",
      "sound_stream": "Arroyo de Monta\xF1a",
      "sound_night": "Grillos Nocturnos",
      "sound_train": "Tren Nocturno",
      "sound_wind": "Viento Suave",
      "sound_underwater": "Inmersi\xF3n Submarina",
      "sound_fan": "Ventilador",
      "sound_clock": "Reloj Suave",
      "sound_monastery": "Cuencos Tibetanos",
      "sound_lofi_sunshine": "Lofi Sunshine",
      "sound_bossa_nova": "Bossa Nova",
      "sound_jazz_piano": "Jazz Voicings",
      "sound_rhodes": "Fender Rhodes",
      "sound_hypnotic_riff": "Riff Hipn\xF3tico",
      "sound_techno": "Techno 128",
      "sound_dnb": "Drum & Bass",
      "sound_afrobeats": "Afrobeats",
      "sound_swing": "Swing & Jazz",
      "sound_boombap": "Boom-Bap",
      "guide_title": "Gu\xEDa de Inicio R\xE1pido de Flow",
      "guide_desc": "Haz clic en un elemento para abrirlo directamente. \xA1Usa los atajos de teclado fuera de los campos de texto!",
      "guide_focus_mode_title": "Modo Enfoque",
      "guide_focus_mode_desc": "Oculta las distracciones para mostrar solo tu tarea prioritaria en una vista Zen tranquila.",
      "guide_focus_mode_key": "Tecla [F]",
      "guide_timer_title": "Temporizador de Enfoque",
      "guide_timer_desc": "Inicia sesiones de trabajo con mensajes de voz motivacionales peri\xF3dicos y m\xFAsica ambiental.",
      "guide_timer_key_start": "Iniciar/Pausa [T]",
      "guide_timer_key_stop": "Detener [S]",
      "guide_whatnow_title": "\xBFY ahora qu\xE9?",
      "guide_whatnow_desc": "Reduce la fatiga mental proponiendo una sola tarea adecuada seg\xFAn tu prioridad actual.",
      "guide_whatnow_key": "Tecla [W]",
      "guide_break_title": "Pausa Sensorial y Recuperaci\xF3n",
      "guide_break_desc": "Alivia la sobrecarga sensorial con respiraci\xF3n 4-4-4, anclaje 5-4-3-2-1 o una siesta reparadora.",
      "guide_break_key": "Tecla [P]",
      "guide_cooking_title": "Cocina y Despensa",
      "guide_cooking_desc": "Introduce los ingredientes disponibles para generar deliciosas recetas paso a paso al instante.",
      "guide_cooking_key": "Tecla [K]",
      "guide_shopping_title": "Lista de Compras",
      "guide_shopping_desc": "Organiza tus compras f\xE1cilmente gracias al Modo Supermercado a pantalla completa.",
      "guide_shopping_key": "Tecla [E]",
      "guide_sport_title": "Deporte y Movimiento",
      "guide_sport_desc": "Activa tu cuerpo suavemente con ejercicios de 1 minuto adaptados a tu energ\xEDa (Spoons).",
      "guide_sport_key": "Tecla [O]",
      "guide_report_title": "Estad\xEDsticas y Logros",
      "guide_report_desc": "Sigue tu actividad diaria, visualiza curvas semanales y exporta informes en imagen.",
      "guide_report_key": "Tecla [R]",
      "guide_sample_title": "Gestionar Tareas de Ejemplo",
      "guide_sample_desc": "Recarga rutinas modelo para el hogar, ad\xE1ptalas o vac\xEDa tu tablero cuando quieras.",
      "guide_sample_key": "Plantillas",
      "guide_shortcuts_title": "M\xE1s Atajos",
      "guide_shortcuts_desc": "\u2022 <b>Tecla [U]</b>: Deshacer \xFAltima acci\xF3n<br>\u2022 <b>Tecla [A]</b>: A\xF1adir cita<br>\u2022 <b>Tecla [B]</b>: Abrir Impulso y Enfoque<br>\u2022 <b>Tecla [I]</b>: Inspiraci\xF3n diaria<br>\u2022 <b>Tecla [H]</b>: Abrir/cerrar esta gu\xEDa<br>\u2022 <b>Tecla [Esc]</b>: Cerrar ventanas",
      "guide_shortcuts_key": "M\xFAltiples",
      "guide_footer_local": "Flow Suite \xB7 Local-First",
      "guide_footer_privacy": "Privacidad y Aviso Legal",
      "pause_panel_title": "Pausa Sensorial y Recuperaci\xF3n",
      "pause_breath_title": "Respiraci\xF3n 4-4-4",
      "pause_breath_sub": "Calma el sistema nervioso en 60s",
      "pause_grounding_title": "Anclaje 5-4-3-2-1",
      "pause_grounding_sub": "Te devuelve al momento presente",
      "pause_stretch_title": "Estiramiento de Cuerpo y Cuello",
      "pause_stretch_sub": "2 minutos de estiramiento suave",
      "pause_nap_title": "Power Nap (20 Min) \u{1F634}",
      "pause_nap_sub": "Descanso breve con lluvia suave",
      "settings_dropdown_title": "Ajustes",
      "settings_btn_fullscreen": "Pantalla completa \u2197",
      "settings_section_theme": "\u{1F3A8} Tema de Color (16 Temas)",
      "settings_section_lang": "\u{1F310} Elegir Idioma",
      "settings_p2p_sync": "Sincronizaci\xF3n M\xF3vil",
      "settings_privacy_btn": "Privacidad",
      "audio_center_title": "Centro de Audio",
      "audio_center_subtitle": "Enfoque, Ritmos y Estudio Mix",
      "audio_tab_ambient": "Sonidos de la Naturaleza",
      "audio_tab_beats": "Ritmos y Lo-Fi",
      "audio_tab_dj": "Estudio Mix",
      "cal_mo": "Lu",
      "cal_di": "Ma",
      "cal_mi": "Mi",
      "cal_do": "Ju",
      "cal_fr": "Vi",
      "cal_sa": "S\xE1",
      "cal_so": "Do",
      "month_jan": "Enero",
      "month_feb": "Febrero",
      "month_mar": "Marzo",
      "month_apr": "Abril",
      "month_may": "Mayo",
      "month_jun": "Junio",
      "month_jul": "Julio",
      "month_aug": "Agosto",
      "month_sep": "Septiembre",
      "month_oct": "Octubre",
      "month_nov": "Noviembre",
      "month_dec": "Diciembre",
      "mobile_nav_tools": "Herramientas",
      "mobile_nav_planner": "Planificador",
      "mobile_nav_focus": "Enfoque",
      "mobile_nav_audio": "Audio",
      "mobile_nav_game": "Juego",
      "mobile_fab_title": "A\xF1adir nueva tarea",
      "mobile_quick_title": "Men\xFA R\xE1pido y Opciones",
      "mobile_quick_desc": "Todas las funciones a mano",
      "mobile_quick_sync_title": "Sincro Live",
      "mobile_quick_sync_sub": "Transferencia QR y P2P",
      "mobile_quick_stats_title": "Estad\xEDsticas",
      "mobile_quick_stats_sub": "Resumen semanal",
      "mobile_quick_theme_title": "Tema de Color",
      "mobile_quick_theme_sub": "16 Temas",
      "mobile_quick_lang_title": "Idioma",
      "mobile_quick_lang_sub": "6 Idiomas",
      "mobile_quick_whatnow_title": "\xBFY ahora qu\xE9?",
      "mobile_quick_whatnow_sub": "Acci\xF3n espont\xE1nea",
      "mobile_quick_break_title": "Pausa Sensorial",
      "mobile_quick_break_sub": "Respiraci\xF3n y Calma",
      "mobile_quick_save_title": "Guardar plan",
      "mobile_quick_save_sub": "Copia JSON",
      "mobile_quick_settings_title": "Ajustes",
      "mobile_quick_settings_sub": "Ajustes y RGPD",
      "mobile_tools_section": "\u{1F6E0}\uFE0F Estilo de vida y Productividad",
      "mobile_tools_sync_badge": "1-Clic",
      "mobile_tools_sync_title": "Sincro Live y QR",
      "mobile_tools_sync_sub": "PC \u2194 M\xF3vil",
      "mobile_tools_opt_badge": "Opciones",
      "mobile_tools_opt_title": "Dise\xF1o e Idioma",
      "mobile_tools_opt_sub": "Temas y Copia",
      "mobile_tools_shop_badge": "Compras",
      "mobile_tools_shop_title": "Lista de Compras",
      "mobile_tools_shop_sub": "Categor\xEDas y Cantidades",
      "mobile_tools_cook_badge": "Cocina",
      "mobile_tools_cook_title": "Recetas y Prep",
      "mobile_tools_cook_sub": "Paso a Paso",
      "mobile_tools_sport_badge": "Activo",
      "mobile_tools_sport_title": "Pausa de Movimiento",
      "mobile_tools_sport_sub": "Micro-Ejercicios",
      "mobile_tools_alarm_badge": "Alarma",
      "mobile_tools_alarm_title": "Alarmas y Temporizadores",
      "mobile_tools_alarm_sub": "Recordatorios Precisos",
      "mobile_tools_stats_badge": "Stats",
      "mobile_tools_stats_title": "Productividad",
      "mobile_tools_stats_sub": "Informe Semanal",
      "mobile_tools_whatnow_badge": "Impulso",
      "mobile_tools_whatnow_title": "\xBFY ahora qu\xE9?",
      "mobile_tools_whatnow_sub": "Sugerencia por Energ\xEDa",
      "mobile_audio_synth_title": "Ritmos de Sintetizador"
    },
    "el": {
      "weekly": "\u03A3\u03C0\u03AF\u03C4\u03B9",
      "daily": "\u03A3\u03AE\u03BC\u03B5\u03C1\u03B1",
      "todo": "\u0395\u03BA\u03BA\u03C1\u03B5\u03BC\u03CC\u03C4\u03B7\u03C4\u03B5\u03C2",
      "done": "\u039F\u03BB\u03BF\u03BA\u03BB\u03B7\u03C1\u03C9\u03BC\u03AD\u03BD\u03B1",
      "termine": "\u03A1\u03B1\u03BD\u03C4\u03B5\u03B2\u03BF\u03CD",
      "occasionally": "\u03A0\u03B5\u03C1\u03B9\u03BF\u03B4\u03B9\u03BA\u03AC",
      "notes": "\u03A3\u03B7\u03BC\u03B5\u03B9\u03CE\u03C3\u03B5\u03B9\u03C2",
      "notesPlaceholder": "\u0393\u03C1\u03AC\u03C8\u03B5 \u03B5\u03B4\u03CE \u03C4\u03B9\u03C2 \u03C3\u03BA\u03AD\u03C8\u03B5\u03B9\u03C2, \u03B9\u03B4\u03AD\u03B5\u03C2 \u03BA\u03B1\u03B9 \u03C5\u03C0\u03B5\u03BD\u03B8\u03C5\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2 \u03C3\u03BF\u03C5...",
      "add": "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1\u03C2",
      "add_task": "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1\u03C2",
      "add_column": "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u03C3\u03C4\u03AE\u03BB\u03B7\u03C2",
      "column_name": "\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2 \u03C3\u03C4\u03AE\u03BB\u03B7\u03C2",
      "delete_column": "\u0394\u03B9\u03B1\u03B3\u03C1\u03B1\u03C6\u03AE \u03C3\u03C4\u03AE\u03BB\u03B7\u03C2",
      "rename_column": "\u039C\u03B5\u03C4\u03BF\u03BD\u03BF\u03BC\u03B1\u03C3\u03AF\u03B1 \u03C3\u03C4\u03AE\u03BB\u03B7\u03C2",
      "choose_icon": "\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE \u03B5\u03B9\u03BA\u03BF\u03BD\u03B9\u03B4\u03AF\u03BF\u03C5",
      "card_color": "\u03A7\u03C1\u03CE\u03BC\u03B1 \u03BA\u03AC\u03C1\u03C4\u03B1\u03C2",
      "confirm_delete_column": "\u0395\u03AF\u03C3\u03B1\u03B9 \u03C3\u03AF\u03B3\u03BF\u03C5\u03C1\u03BF\u03C2 \u03CC\u03C4\u03B9 \u03B8\u03AD\u03BB\u03B5\u03B9\u03C2 \u03BD\u03B1 \u03B4\u03B9\u03B1\u03B3\u03C1\u03AC\u03C8\u03B5\u03B9\u03C2 \u03B1\u03C5\u03C4\u03AE \u03C4\u03B7 \u03C3\u03C4\u03AE\u03BB\u03B7 \u03BA\u03B1\u03B9 \u03CC\u03BB\u03B5\u03C2 \u03C4\u03B9\u03C2 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B5\u03C2 \u03C4\u03B7\u03C2;",
      "new_task_placeholder": "\u03A4\u03B9 \u03C7\u03C1\u03B5\u03B9\u03AC\u03B6\u03B5\u03C4\u03B1\u03B9 \u03BD\u03B1 \u03B3\u03AF\u03BD\u03B5\u03B9;",
      "report": "\u03A3\u03C4\u03B1\u03C4\u03B9\u03C3\u03C4\u03B9\u03BA\u03AC",
      "report_title": "\u03A0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03B9\u03BA\u03CC\u03C4\u03B7\u03C4\u03B1 & \u03A3\u03C4\u03B1\u03C4\u03B9\u03C3\u03C4\u03B9\u03BA\u03AC",
      "report_today": "\u03A3\u03AE\u03BC\u03B5\u03C1\u03B1",
      "report_week": "\u0395\u03B2\u03B4\u03BF\u03BC\u03AC\u03B4\u03B1",
      "report_month": "\u039C\u03AE\u03BD\u03B1\u03C2",
      "report_open_full": "\u0386\u03BD\u03BF\u03B9\u03B3\u03BC\u03B1 \u03A0\u03BB\u03AE\u03C1\u03BF\u03C5\u03C2 \u03A0\u03AF\u03BD\u03B1\u03BA\u03B1 \u2197",
      "open_dashboard": "\u0386\u03BD\u03BF\u03B9\u03B3\u03BC\u03B1 \u03A0\u03BB\u03AE\u03C1\u03BF\u03C5\u03C2 \u03A0\u03AF\u03BD\u03B1\u03BA\u03B1 \u2197",
      "dashboard_title": "\u03A0\u03AF\u03BD\u03B1\u03BA\u03B1\u03C2 \u0391\u03BD\u03B1\u03BB\u03CD\u03C3\u03B5\u03C9\u03BD & \u03A0\u03C1\u03BF\u03CC\u03B4\u03BF\u03C5",
      "focus_time": "\u03A7\u03C1\u03CC\u03BD\u03BF\u03C2 \u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7\u03C2",
      "peak_hours": "\u038F\u03C1\u03B5\u03C2 \u039A\u03BF\u03C1\u03C5\u03C6\u03B1\u03AF\u03B1\u03C2 \u0391\u03C0\u03CC\u03B4\u03BF\u03C3\u03B7\u03C2",
      "category_balance": "\u0399\u03C3\u03BF\u03C1\u03C1\u03BF\u03C0\u03AF\u03B1 \u039A\u03B1\u03C4\u03B7\u03B3\u03BF\u03C1\u03B9\u03CE\u03BD",
      "search_history": "\u0391\u03BD\u03B1\u03B6\u03AE\u03C4\u03B7\u03C3\u03B7 \u03BF\u03BB\u03BF\u03BA\u03BB\u03B7\u03C1\u03C9\u03BC\u03AD\u03BD\u03C9\u03BD \u03B5\u03C1\u03B3\u03B1\u03C3\u03B9\u03CE\u03BD...",
      "morning_peak": "\u03A0\u03C1\u03C9\u03AF (06:00 - 12:00)",
      "afternoon_peak": "\u0391\u03C0\u03CC\u03B3\u03B5\u03C5\u03BC\u03B1 (12:00 - 18:00)",
      "evening_peak": "\u0392\u03C1\u03AC\u03B4\u03C5 (18:00 - 24:00)",
      "night_peak": "\u039D\u03CD\u03C7\u03C4\u03B1 (00:00 - 06:00)",
      "export_image": "\u0391\u03C0\u03BF\u03B8\u03AE\u03BA\u03B5\u03C5\u03C3\u03B7 \u03C9\u03C2 \u03B5\u03B9\u03BA\u03CC\u03BD\u03B1 (PNG)",
      "copy_report": "\u0391\u03BD\u03C4\u03B9\u03B3\u03C1\u03B1\u03C6\u03AE \u03C3\u03CD\u03BD\u03BF\u03C8\u03B7\u03C2",
      "settings": "\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2",
      "tab_general": "\u0393\u03B5\u03BD\u03B9\u03BA\u03AC",
      "tab_history": "\u0399\u03C3\u03C4\u03BF\u03C1\u03B9\u03BA\u03CC \u03B5\u03BA\u03B4\u03CC\u03C3\u03B5\u03C9\u03BD",
      "tab_impressum": "\u039D\u03BF\u03BC\u03B9\u03BA\u03AE \u03A3\u03B7\u03BC\u03B5\u03AF\u03C9\u03C3\u03B7 (\xA7 5 DDG)",
      "tab_privacy": "\u03A0\u03C1\u03BF\u03C3\u03C4\u03B1\u03C3\u03AF\u03B1 \u0394\u03B5\u03B4\u03BF\u03BC\u03AD\u03BD\u03C9\u03BD & GDPR",
      "tab_licenses": "\u0386\u03B4\u03B5\u03B9\u03B5\u03C2 \u03A7\u03C1\u03AE\u03C3\u03B7\u03C2 & \u0391\u03C0\u03BF\u03C0\u03BF\u03AF\u03B7\u03C3\u03B7",
      "history_subtitle": "\u039F\u03C0\u03C4\u03B9\u03BA\u03CC \u03C7\u03C1\u03BF\u03BD\u03BF\u03BB\u03CC\u03B3\u03B9\u03BF \u03BA\u03B1\u03B9 \u03BF\u03C1\u03CC\u03C3\u03B7\u03BC\u03B1 \u03B1\u03BD\u03AC\u03C0\u03C4\u03C5\u03BE\u03B7\u03C2 \u03C4\u03BF\u03C5 Flow",
      "settings_modal_title": "\u03A1\u03C5\u03B8\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2 & \u039D\u03BF\u03BC\u03B9\u03BA\u03AE \u03A3\u03C5\u03BC\u03BC\u03CC\u03C1\u03C6\u03C9\u03C3\u03B7",
      "settings_modal_subtitle": "\u0394\u03B9\u03B1\u03BC\u03CC\u03C1\u03C6\u03C9\u03C3\u03B7, \u03C0\u03BF\u03BB\u03B9\u03C4\u03B9\u03BA\u03AE \u03B1\u03C0\u03BF\u03C1\u03C1\u03AE\u03C4\u03BF\u03C5 \u03BA\u03B1\u03B9 \u03AC\u03B4\u03B5\u03B9\u03B5\u03C2 \u03B1\u03BD\u03BF\u03B9\u03C7\u03C4\u03BF\u03CD \u03BA\u03CE\u03B4\u03B9\u03BA\u03B1",
      "setting_default_workspace": "\u03A0\u03C1\u03BF\u03B5\u03C0\u03B9\u03BB\u03B5\u03B3\u03BC\u03AD\u03BD\u03BF\u03C2 \u03C7\u03CE\u03C1\u03BF\u03C2 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1\u03C2 \u03BA\u03B1\u03C4\u03AC \u03C4\u03B7\u03BD \u03B5\u03BA\u03BA\u03AF\u03BD\u03B7\u03C3\u03B7",
      "setting_default_timer": "\u03A0\u03C1\u03BF\u03B5\u03C0\u03B9\u03BB\u03B5\u03B3\u03BC\u03AD\u03BD\u03B7 \u03B4\u03B9\u03AC\u03C1\u03BA\u03B5\u03B9\u03B1 \u03B5\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7\u03C2",
      "setting_clear_data": "\u0394\u03B9\u03B1\u03B3\u03C1\u03B1\u03C6\u03AE \u03CC\u03BB\u03C9\u03BD \u03C4\u03C9\u03BD \u03C4\u03BF\u03C0\u03B9\u03BA\u03CE\u03BD \u03B4\u03B5\u03B4\u03BF\u03BC\u03AD\u03BD\u03C9\u03BD",
      "setting_clear_data_confirm": "\u0395\u03AF\u03C3\u03B1\u03B9 \u03C3\u03AF\u03B3\u03BF\u03C5\u03C1\u03BF\u03C2 \u03CC\u03C4\u03B9 \u03B8\u03AD\u03BB\u03B5\u03B9\u03C2 \u03BD\u03B1 \u03B4\u03B9\u03B1\u03B3\u03C1\u03AC\u03C8\u03B5\u03B9\u03C2 \u03BF\u03C1\u03B9\u03C3\u03C4\u03B9\u03BA\u03AC \u03CC\u03BB\u03B1 \u03C4\u03B1 \u03C4\u03BF\u03C0\u03B9\u03BA\u03AC \u03B4\u03B5\u03B4\u03BF\u03BC\u03AD\u03BD\u03B1 \u03BA\u03B1\u03B9 \u03BD\u03B1 \u03B5\u03C0\u03B1\u03BD\u03B1\u03C6\u03AD\u03C1\u03B5\u03B9\u03C2 \u03C4\u03B7\u03BD \u03B5\u03C6\u03B1\u03C1\u03BC\u03BF\u03B3\u03AE;",
      "cmd_search_placeholder": "\u03A0\u03BB\u03B7\u03BA\u03C4\u03C1\u03BF\u03BB\u03CC\u03B3\u03B7\u03C3\u03B5 \u03B5\u03BD\u03C4\u03BF\u03BB\u03AE \u03AE \u03B1\u03BD\u03B1\u03B6\u03AE\u03C4\u03B7\u03C3\u03B5 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B5\u03C2... (Ctrl+K)",
      "cmd_actions": "\u0393\u03C1\u03AE\u03B3\u03BF\u03C1\u03B5\u03C2 \u03B5\u03BD\u03AD\u03C1\u03B3\u03B5\u03B9\u03B5\u03C2",
      "cmd_tasks": "\u0391\u03C0\u03BF\u03C4\u03B5\u03BB\u03AD\u03C3\u03BC\u03B1\u03C4\u03B1 \u03B5\u03C1\u03B3\u03B1\u03C3\u03B9\u03CE\u03BD",
      "cmd_no_results": "\u0394\u03B5\u03BD \u03B2\u03C1\u03AD\u03B8\u03B7\u03BA\u03B1\u03BD \u03B5\u03BD\u03C4\u03BF\u03BB\u03AD\u03C2 \u03AE \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B5\u03C2",
      "cmd_shortcut_hint": "\u03A7\u03C1\u03B7\u03C3\u03B9\u03BC\u03BF\u03C0\u03BF\u03AF\u03B7\u03C3\u03B5 \u2191 \u2193 \u03B3\u03B9\u03B1 \u03C0\u03BB\u03BF\u03AE\u03B3\u03B7\u03C3\u03B7, Enter \u03B3\u03B9\u03B1 \u03B5\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE, Esc \u03B3\u03B9\u03B1 \u03AD\u03BE\u03BF\u03B4\u03BF",
      "recurrence_label": "\u0395\u03C0\u03B1\u03BD\u03AC\u03BB\u03B7\u03C8\u03B7 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1\u03C2",
      "recurrence_none": "\u03A7\u03C9\u03C1\u03AF\u03C2 \u03B5\u03C0\u03B1\u03BD\u03AC\u03BB\u03B7\u03C8\u03B7",
      "recurrence_daily": "\u039A\u03B1\u03B8\u03B7\u03BC\u03B5\u03C1\u03B9\u03BD\u03AC",
      "recurrence_weekdays": "\u039A\u03B1\u03B8\u03B7\u03BC\u03B5\u03C1\u03B9\u03BD\u03AD\u03C2 (\u0394\u03B5\u03C5\u03C4-\u03A0\u03B1\u03C1)",
      "recurrence_weekly": "\u0395\u03B2\u03B4\u03BF\u03BC\u03B1\u03B4\u03B9\u03B1\u03AF\u03B1",
      "whatnow": "\u039A\u03B1\u03B9 \u03C4\u03CE\u03C1\u03B1 \u03C4\u03B9;",
      "minimal_mode": "\u039B\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03AF\u03B1 \u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7\u03C2",
      "standard_mode": "\u0392\u03B1\u03C3\u03B9\u03BA\u03AE \u03A0\u03C1\u03BF\u03B2\u03BF\u03BB\u03AE",
      "pause_btn": "\u03A0\u03B1\u03CD\u03C3\u03B7",
      "give_feedback": "\u03A3\u03C7\u03CC\u03BB\u03B9\u03B1",
      "feedback": "\u03A3\u03C7\u03CC\u03BB\u03B9\u03B1",
      "feedback_desc": "\u03A0\u03CE\u03C2 \u03C3\u03BF\u03C5 \u03C6\u03B1\u03AF\u03BD\u03B5\u03C4\u03B1\u03B9 \u03C4\u03BF Flow; \u039F\u03B9 \u03C0\u03B1\u03C1\u03B1\u03C4\u03B7\u03C1\u03AE\u03C3\u03B5\u03B9\u03C2 \u03C3\u03BF\u03C5 \u03BC\u03B1\u03C2 \u03B2\u03BF\u03B7\u03B8\u03BF\u03CD\u03BD \u03BD\u03B1 \u03C4\u03BF \u03B5\u03BE\u03B5\u03BB\u03AF\u03C3\u03C3\u03BF\u03C5\u03BC\u03B5 \u03B4\u03B9\u03B1\u03C1\u03BA\u03CE\u03C2!",
      "feedback_placeholder": "\u039C\u03BF\u03B9\u03C1\u03AC\u03C3\u03BF\u03C5 \u03C4\u03B9\u03C2 \u03C3\u03BA\u03AD\u03C8\u03B5\u03B9\u03C2, \u03B9\u03B4\u03AD\u03B5\u03C2 \u03AE \u03C0\u03C1\u03BF\u03C4\u03AC\u03C3\u03B5\u03B9\u03C2 \u03C3\u03BF\u03C5...",
      "feedback_greet": "\u0393\u03B5\u03B9\u03B1 \u03C3\u03BF\u03C5! \u{1F44B}",
      "feedback_prompt": "\u0388\u03C7\u03B5\u03B9\u03C2 \u03C3\u03C7\u03CC\u03BB\u03B9\u03B1, \u03C0\u03B1\u03C1\u03B1\u03C4\u03B7\u03C1\u03AE\u03C3\u03B5\u03B9\u03C2 \u03AE \u03BD\u03AD\u03B5\u03C2 \u03B9\u03B4\u03AD\u03B5\u03C2 \u03B3\u03B9\u03B1 \u03C4\u03BF Flow; \u03A3\u03C4\u03B5\u03AF\u03BB\u03B5 \u03BC\u03B1\u03C2 \u03BC\u03AE\u03BD\u03C5\u03BC\u03B1 \u2013 \u03C7\u03B1\u03B9\u03C1\u03CC\u03BC\u03B1\u03C3\u03C4\u03B5 \u03B3\u03B9\u03B1 \u03BA\u03AC\u03B8\u03B5 \u03B5\u03C0\u03B9\u03BA\u03BF\u03B9\u03BD\u03C9\u03BD\u03AF\u03B1!",
      "feedback_alt": "\u03AE \u03C3\u03C4\u03B5\u03AF\u03BB\u03B5 email \u03C3\u03C4\u03BF support@flow-planner.app",
      "feedback_send_tooltip": "\u0391\u03C0\u03BF\u03C3\u03C4\u03BF\u03BB\u03AE \u03C3\u03C7\u03BF\u03BB\u03AF\u03C9\u03BD \u03B1\u03C0\u03B5\u03C5\u03B8\u03B5\u03AF\u03B1\u03C2 \u03C3\u03C4\u03BF\u03BD \u03B4\u03B7\u03BC\u03B9\u03BF\u03C5\u03C1\u03B3\u03CC",
      "send": "\u0391\u03C0\u03BF\u03C3\u03C4\u03BF\u03BB\u03AE",
      "login_btn": "\u03A3\u03CD\u03BD\u03B4\u03B5\u03C3\u03B7",
      "sync_title": "\u03A3\u03C5\u03B3\u03C7\u03C1\u03BF\u03BD\u03B9\u03C3\u03BC\u03CC\u03C2 \u03A3\u03C5\u03C3\u03BA\u03B5\u03C5\u03CE\u03BD",
      "sync_desc": "\u0391\u03C0\u03BF\u03B8\u03AE\u03BA\u03B5\u03C5\u03C3\u03B5 \u03C4\u03BF \u03C0\u03BB\u03AC\u03BD\u03BF \u03C3\u03BF\u03C5 \u03BA\u03B1\u03B9 \u03C7\u03C1\u03B7\u03C3\u03B9\u03BC\u03BF\u03C0\u03BF\u03AF\u03B7\u03C3\u03AD \u03C4\u03BF \u03BC\u03B5 \u03B1\u03C3\u03C6\u03AC\u03BB\u03B5\u03B9\u03B1 \u03C3\u03B5 \u03CC\u03BB\u03B5\u03C2 \u03C4\u03B9\u03C2 \u03C3\u03C5\u03C3\u03BA\u03B5\u03C5\u03AD\u03C2 \u03C3\u03BF\u03C5.",
      "login": "\u03A3\u03CD\u03BD\u03B4\u03B5\u03C3\u03B7",
      "register": "\u0395\u03B3\u03B3\u03C1\u03B1\u03C6\u03AE",
      "title_undo": "\u0391\u03BD\u03B1\u03AF\u03C1\u03B5\u03C3\u03B7",
      "title_open": "\u0386\u03BD\u03BF\u03B9\u03B3\u03BC\u03B1 \u03C0\u03BB\u03AC\u03BD\u03BF\u03C5",
      "title_save": "\u0391\u03C0\u03BF\u03B8\u03AE\u03BA\u03B5\u03C5\u03C3\u03B7 \u03C0\u03BB\u03AC\u03BD\u03BF\u03C5",
      "title_reset": "\u0395\u03C0\u03B1\u03BD\u03B1\u03C6\u03BF\u03C1\u03AC \u03CC\u03BB\u03C9\u03BD",
      "title_theme": "\u03A7\u03C1\u03C9\u03BC\u03B1\u03C4\u03B9\u03BA\u03CC \u0398\u03AD\u03BC\u03B1",
      "options_title": "\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2 & \u03A1\u03C5\u03B8\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2",
      "theme_select": "\u0398\u03AD\u03BC\u03B1",
      "lang_select": "\u0393\u03BB\u03CE\u03C3\u03C3\u03B1",
      "workspace_private": "\u03A0\u03C1\u03BF\u03C3\u03C9\u03C0\u03B9\u03BA\u03AC",
      "workspace_work": "\u0395\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1",
      "work_focus": "\u03A3\u03B7\u03BC\u03B5\u03C1\u03B9\u03BD\u03AE \u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7",
      "work_in_progress": "\u03A3\u03B5 \u0395\u03BE\u03AD\u03BB\u03B9\u03BE\u03B7",
      "work_waiting": "\u03A3\u03B5 \u0391\u03BD\u03B1\u03BC\u03BF\u03BD\u03AE",
      "work_backlog": "\u0395\u03BA\u03BA\u03C1\u03B5\u03BC\u03CC\u03C4\u03B7\u03C4\u03B5\u03C2",
      "dock_sounds": "\u0389\u03C7\u03BF\u03B9",
      "dock_music": "\u039C\u03BF\u03C5\u03C3\u03B9\u03BA\u03AE",
      "dock_shop": "\u03A8\u03CE\u03BD\u03B9\u03B1",
      "dock_cook": "\u039C\u03B1\u03B3\u03B5\u03B9\u03C1\u03B9\u03BA\u03AE",
      "dock_scripts": "\u03A3\u03B5\u03BD\u03AC\u03C1\u03B9\u03B1",
      "dock_alarm": "\u039E\u03C5\u03C0\u03BD\u03B7\u03C4\u03AE\u03C1\u03B9",
      "dock_weather": "\u039A\u03B1\u03B9\u03C1\u03CC\u03C2",
      "dock_news": "\u0395\u03B9\u03B4\u03AE\u03C3\u03B5\u03B9\u03C2",
      "dock_spark": "\u03A3\u03C0\u03AF\u03B8\u03B1",
      "dock_inspire": "\u0388\u03BC\u03C0\u03BD\u03B5\u03C5\u03C3\u03B7",
      "dock_clarity": "\u0394\u03B9\u03B1\u03CD\u03B3\u03B5\u03B9\u03B1",
      "dock_impulse": "\u038F\u03B8\u03B7\u03C3\u03B7",
      "dock_audio": "\u0389\u03C7\u03BF\u03C2",
      "dock_daily": "\u039A\u03B1\u03B8\u03B7\u03BC\u03B5\u03C1\u03B9\u03BD\u03AC",
      "dock_beats": "\u03A1\u03C5\u03B8\u03BC\u03BF\u03AF",
      "dock_workout": "\u0386\u03C3\u03BA\u03B7\u03C3\u03B7",
      "dock_matrix": "\u039C\u03AE\u03C4\u03C1\u03B1",
      "dock_gamification": "Arcade",
      "weather_title": "\u03A4\u03BF\u03C0\u03B9\u03BA\u03CC\u03C2 \u039A\u03B1\u03B9\u03C1\u03CC\u03C2",
      "news_title": "Daily Digest",
      "clarity_title": "\u0394\u03B9\u03B1\u03CD\u03B3\u03B5\u03B9\u03B1 & \u0388\u03BB\u03B5\u03B3\u03C7\u03BF\u03C2 \u03A0\u03B1\u03C1\u03BF\u03C1\u03BC\u03AE\u03C3\u03B5\u03C9\u03BD",
      "clarity_subtitle": "\u039E\u03B5\u03C0\u03AD\u03C1\u03B1\u03C3\u03B5 \u03C4\u03B9\u03C2 \u03C0\u03B1\u03C1\u03BF\u03C1\u03BC\u03AE\u03C3\u03B5\u03B9\u03C2, \u03C3\u03C4\u03B1\u03BC\u03AC\u03C4\u03B1 \u03B1\u03BD\u03B5\u03C0\u03B9\u03B8\u03CD\u03BC\u03B7\u03C4\u03B5\u03C2 \u03C3\u03C5\u03BD\u03AE\u03B8\u03B5\u03B9\u03B5\u03C2 & \u03B5\u03BD\u03AF\u03C3\u03C7\u03C5\u03C3\u03B5 \u03C4\u03B7\u03BD \u03B1\u03C5\u03C4\u03BF\u03BA\u03C5\u03C1\u03B9\u03B1\u03C1\u03C7\u03AF\u03B1",
      "sounds": "\u0389\u03C7\u03BF\u03B9",
      "soundscape_title": "\u0389\u03C7\u03BF\u03B9 \u03A6\u03CD\u03C3\u03B7\u03C2 & \u03A3\u03C5\u03B3\u03BA\u03AD\u03BD\u03C4\u03C1\u03C9\u03C3\u03B7\u03C2",
      "music": "\u039C\u03BF\u03C5\u03C3\u03B9\u03BA\u03AE",
      "music_player": "\u0391\u03BD\u03B1\u03C0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03AE \u0389\u03C7\u03BF\u03C5",
      "custom_tracks": "\u0391\u03BD\u03B1\u03C0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03AE \u03B4\u03B9\u03BA\u03CE\u03BD \u03C3\u03BF\u03C5 \u03B1\u03C1\u03C7\u03B5\u03AF\u03C9\u03BD \u03AE\u03C7\u03BF\u03C5",
      "no_tracks": "\u0394\u03B5\u03BD \u03AD\u03C7\u03BF\u03C5\u03BD \u03C6\u03BF\u03C1\u03C4\u03C9\u03B8\u03B5\u03AF \u03BA\u03BF\u03BC\u03BC\u03AC\u03C4\u03B9\u03B1 \u03B1\u03BA\u03CC\u03BC\u03B1",
      "shopping": "\u039B\u03AF\u03C3\u03C4\u03B1 \u0391\u03B3\u03BF\u03C1\u03CE\u03BD",
      "cooking": "\u0388\u03BE\u03C5\u03C0\u03BD\u03B7 \u039C\u03B1\u03B3\u03B5\u03B9\u03C1\u03B9\u03BA\u03AE",
      "scripts": "\u039A\u03BF\u03B9\u03BD\u03C9\u03BD\u03B9\u03BA\u03AC \u03A3\u03B5\u03BD\u03AC\u03C1\u03B9\u03B1",
      "alarm": "\u039E\u03C5\u03C0\u03BD\u03B7\u03C4\u03AE\u03C1\u03B9\u03B1 & \u03A5\u03C0\u03B5\u03BD\u03B8\u03C5\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2",
      "spark": "\u0393\u03C1\u03AE\u03B3\u03BF\u03C1\u03B7 \u03A3\u03C0\u03AF\u03B8\u03B1",
      "inspire": "\u0388\u03BC\u03C0\u03BD\u03B5\u03C5\u03C3\u03B7",
      "inspire_title": "\u0397\u03BC\u03B5\u03C1\u03AE\u03C3\u03B9\u03B1 \u0388\u03BC\u03C0\u03BD\u03B5\u03C5\u03C3\u03B7",
      "zen_title": "\u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7 Zen",
      "next_rec": "\u03A0\u03C1\u03BF\u03C4\u03B5\u03B9\u03BD\u03CC\u03BC\u03B5\u03BD\u03B7 \u0395\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1",
      "start_focus": "\u0388\u03BD\u03B1\u03C1\u03BE\u03B7 \u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7\u03C2",
      "other_suggestion": "\u0386\u03BB\u03BB\u03B7 \u03A0\u03C1\u03CC\u03C4\u03B1\u03C3\u03B7",
      "open_steps": "\u039F\u03B4\u03B7\u03B3\u03CC\u03C2 \u0392\u03AE\u03BC\u03B1-\u0392\u03AE\u03BC\u03B1",
      "completed": "\u039F\u03BB\u03BF\u03BA\u03BB\u03B7\u03C1\u03CE\u03B8\u03B7\u03BA\u03B5!",
      "complete_btn": "\u039F\u03BB\u03BF\u03BA\u03BB\u03AE\u03C1\u03C9\u03C3\u03B7",
      "complete": "\u039F\u03BB\u03BF\u03BA\u03BB\u03AE\u03C1\u03C9\u03C3\u03B7",
      "complete_task": "\u0397 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1 \u03BF\u03BB\u03BF\u03BA\u03BB\u03B7\u03C1\u03CE\u03B8\u03B7\u03BA\u03B5",
      "timer_title": "\u03A7\u03C1\u03BF\u03BD\u03CC\u03BC\u03B5\u03C4\u03C1\u03BF \u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7\u03C2",
      "start": "\u0388\u03BD\u03B1\u03C1\u03BE\u03B7",
      "stop": "\u0394\u03B9\u03B1\u03BA\u03BF\u03C0\u03AE",
      "steps_btn": "\u0392\u03AE\u03BC\u03B1\u03C4\u03B1",
      "steps_tab": "\u0392\u03AE\u03BC\u03B1\u03C4\u03B1",
      "pick_desc": "\u039D\u03B9\u03CE\u03B8\u03B5\u03B9\u03C2 \u03C0\u03AF\u03B5\u03C3\u03B7 \u03B1\u03C0\u03CC \u03C0\u03BF\u03BB\u03BB\u03AD\u03C2 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B5\u03C2; \u0386\u03C6\u03B7\u03C3\u03B5 \u03C4\u03BF Flow \u03BD\u03B1 \u03C3\u03BF\u03C5 \u03C0\u03C1\u03BF\u03C4\u03B5\u03AF\u03BD\u03B5\u03B9 \u03C4\u03B7\u03BD \u03BA\u03B1\u03C4\u03AC\u03BB\u03BB\u03B7\u03BB\u03B7 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1 \u03B2\u03AC\u03C3\u03B5\u03B9 \u03C0\u03C1\u03BF\u03C4\u03B5\u03C1\u03B1\u03B9\u03CC\u03C4\u03B7\u03C4\u03B1\u03C2:",
      "next_suggestion": "\u{1F3B2} \u0395\u03C0\u03CC\u03BC\u03B5\u03BD\u03B7 \u0395\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1",
      "steps_desc": "\u0395\u03C0\u03AF\u03BB\u03B5\u03BE\u03B5 \u03BC\u03B9\u03B1 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1 \u03B3\u03B9\u03B1 \u03BD\u03B1 \u03B4\u03B5\u03B9\u03C2 \u03C4\u03B7 \u03BB\u03B5\u03C0\u03C4\u03BF\u03BC\u03B5\u03C1\u03AE \u03BA\u03B1\u03B8\u03BF\u03B4\u03AE\u03B3\u03B7\u03C3\u03B7 \u03B2\u03AE\u03BC\u03B1 \u03C0\u03C1\u03BF\u03C2 \u03B2\u03AE\u03BC\u03B1:",
      "start_timer": "\u0388\u03BD\u03B1\u03C1\u03BE\u03B7 \u03A7\u03C1\u03BF\u03BD\u03BF\u03BC\u03AD\u03C4\u03C1\u03BF\u03C5",
      "dropdown_placeholder": "-- \u0395\u03C0\u03AF\u03BB\u03B5\u03BE\u03B5 \u03BC\u03B9\u03B1 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1 \u03B1\u03C0\u03CC \u03C4\u03BF\u03BD \u03C0\u03AF\u03BD\u03B1\u03BA\u03AC \u03C3\u03BF\u03C5 --",
      "boost_btn": "\u03A3\u03C0\u03AF\u03B8\u03B1",
      "boost_desc": "\u039A\u03CC\u03BB\u03BB\u03B7\u03C3\u03B5\u03C2 \u03C3\u03C4\u03B7 \u03C3\u03BA\u03AD\u03C8\u03B7; \u0394\u03BF\u03BA\u03AF\u03BC\u03B1\u03C3\u03B5 \u03B1\u03C5\u03C4\u03AE \u03C4\u03B7 \u03BC\u03B9\u03BA\u03C1\u03BF-\u03B4\u03C1\u03AC\u03C3\u03B7 30 \u03B4\u03B5\u03C5\u03C4\u03B5\u03C1\u03BF\u03BB\u03AD\u03C0\u03C4\u03C9\u03BD \u03B3\u03B9\u03B1 \u03BD\u03B1 \u03BE\u03B1\u03BD\u03B1\u03B2\u03C1\u03B5\u03AF\u03C2 \u03C4\u03B7 \u03C1\u03BF\u03AE \u03C3\u03BF\u03C5:",
      "boost_placeholder": "\u039A\u03AC\u03BD\u03B5 \u03BA\u03BB\u03B9\u03BA \u03C0\u03B1\u03C1\u03B1\u03BA\u03AC\u03C4\u03C9 \u03B3\u03B9\u03B1 \u03BC\u03B9\u03B1 \u03AC\u03BC\u03B5\u03C3\u03B7 \u03C0\u03C1\u03CC\u03C4\u03B1\u03C3\u03B7 \u03B4\u03C1\u03AC\u03C3\u03B7\u03C2!",
      "boost_new": "\u039D\u03AD\u03B1 \u03A0\u03C1\u03CC\u03C4\u03B1\u03C3\u03B7 \u{1F504}",
      "dopamine_kick_title": "\u0398\u03AD\u03BB\u03B5\u03B9\u03C2 \u03BC\u03B9\u03B1 \u03B3\u03C1\u03AE\u03B3\u03BF\u03C1\u03B7 \u03CE\u03B8\u03B7\u03C3\u03B7 \u03BD\u03C4\u03BF\u03C0\u03B1\u03BC\u03AF\u03BD\u03B7\u03C2; \u26A1",
      "dopamine_kick_start": "\u26A1 \u0394\u03CE\u03C3\u03B5 \u03BC\u03BF\u03C5 \u03BC\u03AF\u03B1!",
      "dopamine_kick_done": "\u0388\u03B3\u03B9\u03BD\u03B5! \u{1F389} (+25 XP)",
      "dopamine_kick_other": "\u0386\u03BB\u03BB\u03B7 \u0394\u03C1\u03AC\u03C3\u03B7 \u{1F504}",
      "dopamine_kick_completed_toast": "\u0397 \u03CE\u03B8\u03B7\u03C3\u03B7 \u03BF\u03BB\u03BF\u03BA\u03BB\u03B7\u03C1\u03CE\u03B8\u03B7\u03BA\u03B5! \u0395\u03BE\u03B1\u03B9\u03C1\u03B5\u03C4\u03B9\u03BA\u03CC \u03BE\u03B5\u03BA\u03AF\u03BD\u03B7\u03BC\u03B1.",
      "dopamine_kick_success_log": "\u26A1 \u039F\u03BB\u03BF\u03BA\u03BB\u03AE\u03C1\u03C9\u03C3\u03B7 \u03CE\u03B8\u03B7\u03C3\u03B7\u03C2 \u03BA\u03B9\u03BD\u03AE\u03C4\u03C1\u03BF\u03C5:",
      "whatnow_kickstart": "\u{1FA9C} \u038F\u03B8\u03B7\u03C3\u03B7",
      "cook_add_ingredient": "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7",
      "cook_add_ingredient_placeholder": "\u0393\u03C1\u03AC\u03C8\u03B5 \u03AD\u03BD\u03B1 \u03C5\u03BB\u03B9\u03BA\u03CC (\u03C0.\u03C7. \u0396\u03C5\u03BC\u03B1\u03C1\u03B9\u03BA\u03AC, \u0391\u03C5\u03B3\u03AC)...",
      "cook_suggest": "\u03A0\u03C1\u03CC\u03C4\u03B1\u03C3\u03B7 \u03A3\u03C5\u03BD\u03C4\u03B1\u03B3\u03AE\u03C2 \u{1F373}",
      "cook_pantry_empty": "\u03A4\u03BF \u03BD\u03C4\u03BF\u03C5\u03BB\u03AC\u03C0\u03B9 \u03C3\u03BF\u03C5 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03AC\u03B4\u03B5\u03B9\u03BF. \u03A0\u03C1\u03CC\u03C3\u03B8\u03B5\u03C3\u03B5 \u03C5\u03BB\u03B9\u03BA\u03AC \u03C0\u03B1\u03C1\u03B1\u03C0\u03AC\u03BD\u03C9!",
      "cook_suggestion_title": "\u03A0\u03C1\u03CC\u03C4\u03B1\u03C3\u03B7 \u03A3\u03C5\u03BD\u03C4\u03B1\u03B3\u03AE\u03C2",
      "cook_steps": "\u039F\u03B4\u03B7\u03B3\u03AF\u03B5\u03C2 \u0395\u03BA\u03C4\u03AD\u03BB\u03B5\u03C3\u03B7\u03C2",
      "cook_ingredients": "\u03A4\u03B1 \u03A5\u03BB\u03B9\u03BA\u03AC \u03A3\u03BF\u03C5",
      "cook_quick_staples": "\u0392\u03B1\u03C3\u03B9\u03BA\u03AC \u03A5\u03BB\u03B9\u03BA\u03AC",
      "cook_recipe_ingredients": "\u0391\u03C0\u03B1\u03B9\u03C4\u03BF\u03CD\u03BC\u03B5\u03BD\u03B1 \u03A5\u03BB\u03B9\u03BA\u03AC",
      "cook_placeholder_empty": "\u039A\u03B1\u03C4\u03B1\u03C7\u03CE\u03C1\u03B9\u03C3\u03B5 \u03C4\u03B1 \u03C5\u03BB\u03B9\u03BA\u03AC \u03C3\u03BF\u03C5 \u03B3\u03B9\u03B1 \u03BD\u03B1 \u03BB\u03AC\u03B2\u03B5\u03B9\u03C2 \u03C0\u03C1\u03BF\u03C3\u03B1\u03C1\u03BC\u03BF\u03C3\u03BC\u03AD\u03BD\u03B5\u03C2 \u03C3\u03C5\u03BD\u03C4\u03B1\u03B3\u03AD\u03C2.",
      "cook_time": "\u03A7\u03C1\u03CC\u03BD\u03BF\u03C2",
      "cook_tags": "\u0395\u03C4\u03B9\u03BA\u03AD\u03C4\u03B5\u03C2",
      "cook_add_to_shop": "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u03C5\u03BB\u03B9\u03BA\u03CE\u03BD \u03C0\u03BF\u03C5 \u03BB\u03B5\u03AF\u03C0\u03BF\u03C5\u03BD \u03C3\u03C4\u03B7 \u03BB\u03AF\u03C3\u03C4\u03B1 \u03B1\u03B3\u03BF\u03C1\u03CE\u03BD \u{1F6D2}",
      "shop_add_placeholder": "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u03C0\u03C1\u03BF\u03CA\u03CC\u03BD\u03C4\u03BF\u03C2 (\u03C0.\u03C7. 2x \u03B3\u03AC\u03BB\u03B1 \u03B2\u03C1\u03CE\u03BC\u03B7\u03C2, \u03C8\u03C9\u03BC\u03AF)...",
      "shop_add_btn": "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7",
      "shop_history": "\u0399\u03C3\u03C4\u03BF\u03C1\u03B9\u03BA\u03CC",
      "shop_clear": "\u039A\u03B1\u03B8\u03B1\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2",
      "shop_recent_bought": "\u03A0\u03C1\u03CC\u03C3\u03C6\u03B1\u03C4\u03B1 \u03B1\u03B3\u03BF\u03C1\u03B1\u03C3\u03BC\u03AD\u03BD\u03B1",
      "shop_empty": "\u0397 \u03BB\u03AF\u03C3\u03C4\u03B1 \u03B1\u03B3\u03BF\u03C1\u03CE\u03BD \u03C3\u03BF\u03C5 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03BA\u03B1\u03B8\u03B1\u03C1\u03AE!",
      "supermarket_mode_btn": "\u039B\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03AF\u03B1 \u03A3\u03BF\u03CD\u03C0\u03B5\u03C1 \u039C\u03AC\u03C1\u03BA\u03B5\u03C4 \u{1F6D2}",
      "supermarket_title": "\u039B\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03AF\u03B1 \u03A3\u03BF\u03CD\u03C0\u03B5\u03C1 \u039C\u03AC\u03C1\u03BA\u03B5\u03C4 \u{1F6D2}",
      "sample_banner_title": "\u{1F4A1} \u0391\u03C5\u03C4\u03AD\u03C2 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03B5\u03BD\u03B4\u03B5\u03B9\u03BA\u03C4\u03B9\u03BA\u03AD\u03C2 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B5\u03C2 \u03B3\u03B9\u03B1 \u03AD\u03BC\u03C0\u03BD\u03B5\u03C5\u03C3\u03B7.",
      "sample_banner_desc": "\u039C\u03C0\u03BF\u03C1\u03B5\u03AF\u03C2 \u03BD\u03B1 \u03C4\u03B9\u03C2 \u03C0\u03C1\u03BF\u03C3\u03B1\u03C1\u03BC\u03CC\u03C3\u03B5\u03B9\u03C2, \u03BD\u03B1 \u03BA\u03C1\u03B1\u03C4\u03AE\u03C3\u03B5\u03B9\u03C2 \u03CC\u03C3\u03B5\u03C2 \u03B8\u03AD\u03BB\u03B5\u03B9\u03C2 \u03AE \u03BD\u03B1 \u03B1\u03B4\u03B5\u03B9\u03AC\u03C3\u03B5\u03B9\u03C2 \u03B5\u03BD\u03C4\u03B5\u03BB\u03CE\u03C2 \u03C4\u03BF\u03BD \u03C0\u03AF\u03BD\u03B1\u03BA\u03B1.",
      "sample_keep_all": "\u0394\u03B9\u03B1\u03C4\u03AE\u03C1\u03B7\u03C3\u03B7 \u03CC\u03BB\u03C9\u03BD \u2713",
      "sample_customize_btn": "\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE & \u03A0\u03C1\u03BF\u03C3\u03B1\u03C1\u03BC\u03BF\u03B3\u03AE \u270F\uFE0F",
      "sample_clear_btn": "\u039A\u03B1\u03B8\u03B1\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2 \u03C0\u03AF\u03BD\u03B1\u03BA\u03B1 \u{1F5D1}\uFE0F",
      "sample_modal_title": "\u0394\u03B9\u03B1\u03C7\u03B5\u03AF\u03C1\u03B9\u03C3\u03B7 \u0395\u03BD\u03B4\u03B5\u03B9\u03BA\u03C4\u03B9\u03BA\u03CE\u03BD \u0395\u03C1\u03B3\u03B1\u03C3\u03B9\u03CE\u03BD",
      "sample_modal_subtitle": "\u0395\u03C0\u03AF\u03BB\u03B5\u03BE\u03B5 \u03C0\u03BF\u03B9\u03B1 \u03C0\u03C1\u03CC\u03C4\u03C5\u03C0\u03B1 \u03B8\u03AD\u03BB\u03B5\u03B9\u03C2 \u03BD\u03B1 \u03C6\u03BF\u03C1\u03C4\u03CE\u03C3\u03B5\u03B9\u03C2 \u03AE \u03AC\u03B4\u03B5\u03B9\u03B1\u03C3\u03B5 \u03B5\u03BD\u03C4\u03B5\u03BB\u03CE\u03C2 \u03C4\u03BF\u03BD \u03C0\u03AF\u03BD\u03B1\u03BA\u03B1",
      "sample_cat_daily": "\u039A\u03B1\u03B8\u03B7\u03BC\u03B5\u03C1\u03B9\u03BD\u03AE \u03A1\u03BF\u03C5\u03C4\u03AF\u03BD\u03B1",
      "sample_cat_weekly": "\u03A3\u03C0\u03AF\u03C4\u03B9 & \u039A\u03B1\u03B8\u03B1\u03C1\u03B9\u03CC\u03C4\u03B7\u03C4\u03B1",
      "sample_cat_occasionally": "\u03A0\u03B5\u03C1\u03B9\u03BF\u03B4\u03B9\u03BA\u03AE \u03A6\u03C1\u03BF\u03BD\u03C4\u03AF\u03B4\u03B1",
      "sample_select_all": "\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE \u03CC\u03BB\u03C9\u03BD",
      "sample_deselect_all": "\u0391\u03C0\u03BF\u03B5\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE \u03CC\u03BB\u03C9\u03BD",
      "sample_apply_btn": "\u03A6\u03CC\u03C1\u03C4\u03C9\u03C3\u03B7 \u03B5\u03C0\u03B9\u03BB\u03B5\u03B3\u03BC\u03AD\u03BD\u03C9\u03BD \u03B5\u03C1\u03B3\u03B1\u03C3\u03B9\u03CE\u03BD",
      "sample_toast_loaded": "\u03A4\u03B1 \u03B5\u03C0\u03B9\u03BB\u03B5\u03B3\u03BC\u03AD\u03BD\u03B1 \u03C0\u03C1\u03CC\u03C4\u03C5\u03C0\u03B1 \u03C6\u03BF\u03C1\u03C4\u03CE\u03B8\u03B7\u03BA\u03B1\u03BD \u03BC\u03B5 \u03B5\u03C0\u03B9\u03C4\u03C5\u03C7\u03AF\u03B1!",
      "sample_toast_cleared": "\u039F \u03C0\u03AF\u03BD\u03B1\u03BA\u03B1\u03C2 \u03BA\u03B1\u03B8\u03B1\u03C1\u03AF\u03C3\u03C4\u03B7\u03BA\u03B5 \u03C0\u03BB\u03AE\u03C1\u03C9\u03C2!",
      "toast_no_undo": "\u0394\u03B5\u03BD \u03C5\u03C0\u03AC\u03C1\u03C7\u03B5\u03B9 \u03BA\u03AC\u03C4\u03B9 \u03AC\u03BB\u03BB\u03BF \u03C0\u03C1\u03BF\u03C2 \u03B1\u03BD\u03B1\u03AF\u03C1\u03B5\u03C3\u03B7.",
      "toast_undo_applied": "\u0397 \u03C4\u03B5\u03BB\u03B5\u03C5\u03C4\u03B1\u03AF\u03B1 \u03B5\u03BD\u03AD\u03C1\u03B3\u03B5\u03B9\u03B1 \u03B1\u03BD\u03B1\u03B9\u03C1\u03AD\u03B8\u03B7\u03BA\u03B5.",
      "toast_reset_success": "\u03A4\u03BF \u03C0\u03BB\u03AC\u03BD\u03BF \u03C3\u03BF\u03C5 \u03B5\u03C0\u03B1\u03BD\u03AE\u03BB\u03B8\u03B5 \u03C3\u03C4\u03B9\u03C2 \u03C0\u03C1\u03BF\u03B5\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2.",
      "toast_import_success": "\u03A4\u03BF \u03C0\u03BB\u03AC\u03BD\u03BF \u03C6\u03BF\u03C1\u03C4\u03CE\u03B8\u03B7\u03BA\u03B5 \u03BC\u03B5 \u03B5\u03C0\u03B9\u03C4\u03C5\u03C7\u03AF\u03B1!",
      "toast_import_error": "\u0397 \u03C6\u03CC\u03C1\u03C4\u03C9\u03C3\u03B7 \u03C4\u03BF\u03C5 \u03B1\u03C1\u03C7\u03B5\u03AF\u03BF\u03C5 \u03B1\u03C0\u03AD\u03C4\u03C5\u03C7\u03B5.",
      "toast_task_deleted": "\u0397 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1 \u03B4\u03B9\u03B1\u03B3\u03C1\u03AC\u03C6\u03B7\u03BA\u03B5.",
      "toast_task_restored": "\u0397 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1 \u03B5\u03C0\u03B1\u03BD\u03B1\u03C6\u03AD\u03C1\u03B8\u03B7\u03BA\u03B5.",
      "toast_appointment_name_error": "\u03A0\u03B1\u03C1\u03B1\u03BA\u03B1\u03BB\u03CE \u03C0\u03BB\u03B7\u03BA\u03C4\u03C1\u03BF\u03BB\u03CC\u03B3\u03B7\u03C3\u03B5 \u03AD\u03BD\u03B1 \u03CC\u03BD\u03BF\u03BC\u03B1 \u03B3\u03B9\u03B1 \u03C4\u03BF \u03C1\u03B1\u03BD\u03C4\u03B5\u03B2\u03BF\u03CD.",
      "toast_appointment_saved": "\u03A4\u03BF \u03C1\u03B1\u03BD\u03C4\u03B5\u03B2\u03BF\u03CD \u03B1\u03C0\u03BF\u03B8\u03B7\u03BA\u03B5\u03CD\u03C4\u03B7\u03BA\u03B5 \u03BC\u03B5 \u03B5\u03C0\u03B9\u03C4\u03C5\u03C7\u03AF\u03B1!",
      "appointment_new_btn": "\u039D\u03AD\u03BF \u03A1\u03B1\u03BD\u03C4\u03B5\u03B2\u03BF\u03CD",
      "appointment_form_title": "\u039A\u03B1\u03C4\u03B1\u03C7\u03CE\u03C1\u03B9\u03C3\u03B7 \u03A1\u03B1\u03BD\u03C4\u03B5\u03B2\u03BF\u03CD",
      "appointment_form_name_placeholder": "\u03A0\u03BF\u03B9\u03BF \u03B5\u03AF\u03BD\u03B1\u03B9 \u03C4\u03BF \u03C1\u03B1\u03BD\u03C4\u03B5\u03B2\u03BF\u03CD; (\u03C0.\u03C7. \u039F\u03B4\u03BF\u03BD\u03C4\u03AF\u03B1\u03C4\u03C1\u03BF\u03C2)",
      "appointment_form_date_label": "\u0397\u03BC\u03B5\u03C1\u03BF\u03BC\u03B7\u03BD\u03AF\u03B1",
      "appointment_form_time_label": "\u038F\u03C1\u03B1",
      "appointment_form_save_btn": "\u0391\u03C0\u03BF\u03B8\u03AE\u03BA\u03B5\u03C5\u03C3\u03B7",
      "appointment_form_cancel_btn": "\u0391\u03BA\u03CD\u03C1\u03C9\u03C3\u03B7",
      "sound_rain": "\u0391\u03C0\u03B1\u03BB\u03AE \u0392\u03C1\u03BF\u03C7\u03AE",
      "sound_forest": "\u0392\u03B1\u03B8\u03CD \u0394\u03AC\u03C3\u03BF\u03C2",
      "sound_waves": "\u039A\u03CD\u03BC\u03B1\u03C4\u03B1 \u0398\u03AC\u03BB\u03B1\u03C3\u03C3\u03B1\u03C2",
      "sound_fire": "\u0396\u03B5\u03C3\u03C4\u03CC \u03A4\u03B6\u03AC\u03BA\u03B9",
      "sound_whitenoise": "\u039B\u03B5\u03C5\u03BA\u03CC\u03C2 \u0398\u03CC\u03C1\u03C5\u03B2\u03BF\u03C2",
      "sound_pinknoise": "\u03A1\u03BF\u03B6 \u0398\u03CC\u03C1\u03C5\u03B2\u03BF\u03C2",
      "sound_brownnoise": "\u039A\u03B1\u03C6\u03AD \u0398\u03CC\u03C1\u03C5\u03B2\u03BF\u03C2",
      "sound_binaural_alpha": "\u039A\u03CD\u03BC\u03B1\u03C4\u03B1 \u0386\u03BB\u03C6\u03B1 (\u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7)",
      "sound_binaural_theta": "\u039A\u03CD\u03BC\u03B1\u03C4\u03B1 \u0398\u03AE\u03C4\u03B1 (\u0397\u03C1\u03B5\u03BC\u03AF\u03B1)",
      "sound_cafe": "\u0396\u03B5\u03C3\u03C4\u03CC \u039A\u03B1\u03C6\u03AD",
      "sound_lofi": "\u0391\u03C1\u03BC\u03BF\u03BD\u03AF\u03B5\u03C2 Lo-Fi",
      "sound_space": "\u039A\u03BF\u03C3\u03BC\u03B9\u03BA\u03CC \u03A0\u03B5\u03C1\u03B9\u03B2\u03AC\u03BB\u03BB\u03BF\u03BD",
      "sound_stream": "\u039F\u03C1\u03B5\u03B9\u03BD\u03CC \u03A1\u03C5\u03AC\u03BA\u03B9",
      "sound_night": "\u039D\u03C5\u03C7\u03C4\u03B5\u03C1\u03B9\u03BD\u03AC \u03A4\u03C1\u03B9\u03B6\u03CC\u03BD\u03B9\u03B1",
      "sound_train": "\u039D\u03C5\u03C7\u03C4\u03B5\u03C1\u03B9\u03BD\u03CC \u03A4\u03C1\u03AD\u03BD\u03BF",
      "sound_wind": "\u0391\u03C0\u03B1\u03BB\u03CC\u03C2 \u0386\u03BD\u03B5\u03BC\u03BF\u03C2",
      "sound_underwater": "\u03A5\u03C0\u03BF\u03B2\u03C1\u03CD\u03C7\u03B9\u03B1 \u0397\u03C1\u03B5\u03BC\u03AF\u03B1",
      "sound_fan": "\u0391\u03BD\u03B5\u03BC\u03B9\u03C3\u03C4\u03AE\u03C1\u03B1\u03C2",
      "sound_clock": "\u0389\u03C3\u03C5\u03C7\u03BF \u03A1\u03BF\u03BB\u03CC\u03B9",
      "sound_monastery": "\u0398\u03B9\u03B2\u03B5\u03C4\u03B9\u03B1\u03BD\u03AC \u039C\u03C0\u03BF\u03BB",
      "sound_lofi_sunshine": "Lofi Sunshine",
      "sound_bossa_nova": "Bossa Nova",
      "sound_jazz_piano": "Jazz Voicings",
      "sound_rhodes": "Fender Rhodes",
      "sound_hypnotic_riff": "\u03A5\u03C0\u03BD\u03C9\u03C4\u03B9\u03BA\u03CC Riff",
      "sound_techno": "Techno 128",
      "sound_dnb": "Drum & Bass",
      "sound_afrobeats": "Afrobeats",
      "sound_swing": "Swing & Jazz",
      "sound_boombap": "Boom-Bap",
      "guide_title": "\u039F\u03B4\u03B7\u03B3\u03CC\u03C2 \u0393\u03C1\u03AE\u03B3\u03BF\u03C1\u03B7\u03C2 \u0395\u03BA\u03BA\u03AF\u03BD\u03B7\u03C3\u03B7\u03C2 Flow",
      "guide_desc": "\u039A\u03AC\u03BD\u03B5 \u03BA\u03BB\u03B9\u03BA \u03C3\u03B5 \u03BF\u03C0\u03BF\u03B9\u03B1\u03B4\u03AE\u03C0\u03BF\u03C4\u03B5 \u03BB\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03AF\u03B1 \u03B3\u03B9\u03B1 \u03AC\u03BC\u03B5\u03C3\u03BF \u03AC\u03BD\u03BF\u03B9\u03B3\u03BC\u03B1. \u03A7\u03C1\u03B7\u03C3\u03B9\u03BC\u03BF\u03C0\u03BF\u03AF\u03B7\u03C3\u03B5 \u03C4\u03B9\u03C2 \u03C3\u03C5\u03BD\u03C4\u03BF\u03BC\u03B5\u03CD\u03C3\u03B5\u03B9\u03C2 \u03C0\u03BB\u03B7\u03BA\u03C4\u03C1\u03BF\u03BB\u03BF\u03B3\u03AF\u03BF\u03C5 \u03CC\u03C0\u03BF\u03C4\u03B5 \u03B2\u03C1\u03AF\u03C3\u03BA\u03B5\u03C3\u03B1\u03B9 \u03B5\u03BA\u03C4\u03CC\u03C2 \u03C0\u03B5\u03B4\u03AF\u03C9\u03BD \u03BA\u03B5\u03B9\u03BC\u03AD\u03BD\u03BF\u03C5!",
      "guide_focus_mode_title": "\u039B\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03AF\u03B1 \u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7\u03C2",
      "guide_focus_mode_desc": "\u039A\u03C1\u03CD\u03B2\u03B5\u03B9 \u03C4\u03BF\u03C5\u03C2 \u03C0\u03B5\u03C1\u03B9\u03C3\u03C0\u03B1\u03C3\u03BC\u03BF\u03CD\u03C2 \u03BA\u03B1\u03B9 \u03C0\u03C1\u03BF\u03B2\u03AC\u03BB\u03BB\u03B5\u03B9 \u03B1\u03C0\u03BF\u03BA\u03BB\u03B5\u03B9\u03C3\u03C4\u03B9\u03BA\u03AC \u03C4\u03B7 \u03C3\u03B7\u03BC\u03B1\u03BD\u03C4\u03B9\u03BA\u03CC\u03C4\u03B5\u03C1\u03B7 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1 \u03C3\u03BF\u03C5 \u03C3\u03B5 \u03AD\u03BD\u03B1 \u03AE\u03C1\u03B5\u03BC\u03BF \u03C0\u03B5\u03C1\u03B9\u03B2\u03AC\u03BB\u03BB\u03BF\u03BD Zen.",
      "guide_focus_mode_key": "\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [F]",
      "guide_timer_title": "\u03A7\u03C1\u03BF\u03BD\u03CC\u03BC\u03B5\u03C4\u03C1\u03BF \u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7\u03C2",
      "guide_timer_desc": "\u039E\u03B5\u03BA\u03AF\u03BD\u03B7\u03C3\u03B5 \u03C3\u03C5\u03B3\u03BA\u03B5\u03BD\u03C4\u03C1\u03C9\u03BC\u03AD\u03BD\u03B5\u03C2 \u03C0\u03B5\u03C1\u03B9\u03CC\u03B4\u03BF\u03C5\u03C2 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1\u03C2 \u03BC\u03B5 \u03C6\u03C9\u03BD\u03B7\u03C4\u03B9\u03BA\u03AE \u03B5\u03BD\u03B8\u03AC\u03C1\u03C1\u03C5\u03BD\u03C3\u03B7 \u03BA\u03B1\u03B9 \u03B1\u03C4\u03BC\u03BF\u03C3\u03C6\u03B1\u03B9\u03C1\u03B9\u03BA\u03CC \u03AE\u03C7\u03BF.",
      "guide_timer_key_start": "\u0388\u03BD\u03B1\u03C1\u03BE\u03B7/\u03A0\u03B1\u03CD\u03C3\u03B7 [T]",
      "guide_timer_key_stop": "\u0394\u03B9\u03B1\u03BA\u03BF\u03C0\u03AE [S]",
      "guide_whatnow_title": "\u039A\u03B1\u03B9 \u03C4\u03CE\u03C1\u03B1 \u03C4\u03B9;",
      "guide_whatnow_desc": "\u039C\u03B5\u03B9\u03CE\u03BD\u03B5\u03B9 \u03C4\u03B7\u03BD \u03BA\u03CC\u03C0\u03C9\u03C3\u03B7 \u03B1\u03C0\u03BF\u03C6\u03AC\u03C3\u03B5\u03C9\u03BD \u03C0\u03C1\u03BF\u03C4\u03B5\u03AF\u03BD\u03BF\u03BD\u03C4\u03B1\u03C2 \u03C4\u03C5\u03C7\u03B1\u03AF\u03B1 \u03BC\u03B9\u03B1 \u03BA\u03B1\u03C4\u03AC\u03BB\u03BB\u03B7\u03BB\u03B7 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1 \u03B2\u03AC\u03C3\u03B5\u03B9 \u03C4\u03B7\u03C2 \u03C0\u03C1\u03BF\u03C4\u03B5\u03C1\u03B1\u03B9\u03CC\u03C4\u03B7\u03C4\u03AC\u03C2 \u03C3\u03BF\u03C5.",
      "guide_whatnow_key": "\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [W]",
      "guide_break_title": "\u03A0\u03B1\u03CD\u03C3\u03B7 & \u0391\u03B9\u03C3\u03B8\u03B7\u03C4\u03B7\u03C1\u03B9\u03B1\u03BA\u03AE \u03A7\u03B1\u03BB\u03AC\u03C1\u03C9\u03C3\u03B7",
      "guide_break_desc": "\u0391\u03BD\u03B1\u03BA\u03BF\u03C5\u03C6\u03AF\u03B6\u03B5\u03B9 \u03B1\u03C0\u03CC \u03C4\u03B7\u03BD \u03C5\u03C0\u03B5\u03C1\u03C6\u03CC\u03C1\u03C4\u03C9\u03C3\u03B7 \u03BC\u03B5 \u03C1\u03C5\u03B8\u03BC\u03CC \u03B1\u03BD\u03B1\u03C0\u03BD\u03BF\u03AE\u03C2 4-4-4, \u03B3\u03B5\u03AF\u03C9\u03C3\u03B7 5-4-3-2-1 \u03AE \u03B1\u03BD\u03B1\u03B6\u03C9\u03BF\u03B3\u03BF\u03BD\u03B7\u03C4\u03B9\u03BA\u03CC power nap.",
      "guide_break_key": "\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [P]",
      "guide_cooking_title": "\u039C\u03B1\u03B3\u03B5\u03B9\u03C1\u03B9\u03BA\u03AE & \u03A0\u03C1\u03BF\u03BC\u03AE\u03B8\u03B5\u03B9\u03B5\u03C2",
      "guide_cooking_desc": "\u039A\u03B1\u03C4\u03B1\u03C7\u03CE\u03C1\u03B9\u03C3\u03B5 \u03C4\u03B1 \u03B4\u03B9\u03B1\u03B8\u03AD\u03C3\u03B9\u03BC\u03B1 \u03C5\u03BB\u03B9\u03BA\u03AC \u03C3\u03BF\u03C5 \u03BA\u03B1\u03B9 \u03B4\u03B7\u03BC\u03B9\u03BF\u03CD\u03C1\u03B3\u03B7\u03C3\u03B5 \u03AC\u03BC\u03B5\u03C3\u03B1 \u03BD\u03CC\u03C3\u03C4\u03B9\u03BC\u03B5\u03C2 \u03C3\u03C5\u03BD\u03C4\u03B1\u03B3\u03AD\u03C2 \u03B2\u03AE\u03BC\u03B1 \u03C0\u03C1\u03BF\u03C2 \u03B2\u03AE\u03BC\u03B1.",
      "guide_cooking_key": "\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [K]",
      "guide_shopping_title": "\u039B\u03AF\u03C3\u03C4\u03B1 \u0391\u03B3\u03BF\u03C1\u03CE\u03BD",
      "guide_shopping_desc": "\u039F\u03C1\u03B3\u03AC\u03BD\u03C9\u03C3\u03B5 \u03C4\u03B9\u03C2 \u03B1\u03B3\u03BF\u03C1\u03AD\u03C2 \u03C3\u03BF\u03C5 \u03BC\u03B5 \u03B5\u03B9\u03B4\u03B9\u03BA\u03AE \u03BB\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03AF\u03B1 \u03C0\u03BB\u03AE\u03C1\u03BF\u03C5\u03C2 \u03BF\u03B8\u03CC\u03BD\u03B7\u03C2 \u03B3\u03B9\u03B1 \u03AC\u03BD\u03B5\u03C4\u03B1 \u03C8\u03CE\u03BD\u03B9\u03B1 \u03C3\u03C4\u03BF \u03A3\u03BF\u03CD\u03C0\u03B5\u03C1 \u039C\u03AC\u03C1\u03BA\u03B5\u03C4.",
      "guide_shopping_key": "\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [E]",
      "guide_sport_title": "\u0386\u03C3\u03BA\u03B7\u03C3\u03B7 & \u039A\u03AF\u03BD\u03B7\u03C3\u03B7",
      "guide_sport_desc": "\u0395\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03AF\u03B7\u03C3\u03B5 \u03B1\u03C0\u03B1\u03BB\u03AC \u03C4\u03BF \u03C3\u03CE\u03BC\u03B1 \u03C3\u03BF\u03C5 \u03BC\u03B5 \u03B1\u03C3\u03BA\u03AE\u03C3\u03B5\u03B9\u03C2 1 \u03BB\u03B5\u03C0\u03C4\u03BF\u03CD, \u03C0\u03C1\u03BF\u03C3\u03B1\u03C1\u03BC\u03BF\u03C3\u03BC\u03AD\u03BD\u03B5\u03C2 \u03C3\u03C4\u03BF \u03B5\u03C0\u03AF\u03C0\u03B5\u03B4\u03BF \u03B5\u03BD\u03AD\u03C1\u03B3\u03B5\u03B9\u03AC\u03C2 \u03C3\u03BF\u03C5 (Spoons).",
      "guide_sport_key": "\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [O]",
      "guide_report_title": "\u03A3\u03C4\u03B1\u03C4\u03B9\u03C3\u03C4\u03B9\u03BA\u03AC & \u0395\u03C0\u03B9\u03C4\u03B5\u03CD\u03B3\u03BC\u03B1\u03C4\u03B1",
      "guide_report_desc": "\u03A0\u03B1\u03C1\u03B1\u03BA\u03BF\u03BB\u03BF\u03CD\u03B8\u03B7\u03C3\u03B5 \u03C4\u03B7\u03BD \u03BA\u03B1\u03B8\u03B7\u03BC\u03B5\u03C1\u03B9\u03BD\u03AE \u03C3\u03BF\u03C5 \u03C0\u03C1\u03CC\u03BF\u03B4\u03BF, \u03B4\u03B5\u03C2 \u03C4\u03B7\u03BD \u03B5\u03B2\u03B4\u03BF\u03BC\u03B1\u03B4\u03B9\u03B1\u03AF\u03B1 \u03B4\u03C1\u03B1\u03C3\u03C4\u03B7\u03C1\u03B9\u03CC\u03C4\u03B7\u03C4\u03B1 \u03BA\u03B1\u03B9 \u03B5\u03BE\u03AE\u03B3\u03B1\u03B3\u03B5 \u03B1\u03BD\u03B1\u03C6\u03BF\u03C1\u03AD\u03C2 \u03C3\u03B5 \u03B5\u03B9\u03BA\u03CC\u03BD\u03B1.",
      "guide_report_key": "\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [R]",
      "guide_sample_title": "\u0394\u03B9\u03B1\u03C7\u03B5\u03AF\u03C1\u03B9\u03C3\u03B7 \u03A0\u03C1\u03BF\u03C4\u03CD\u03C0\u03C9\u03BD",
      "guide_sample_desc": "\u03A6\u03CC\u03C1\u03C4\u03C9\u03C3\u03B5 \u03AD\u03C4\u03BF\u03B9\u03BC\u03B5\u03C2 \u03C1\u03BF\u03C5\u03C4\u03AF\u03BD\u03B5\u03C2 \u03B3\u03B9\u03B1 \u03C4\u03BF \u03C3\u03C0\u03AF\u03C4\u03B9, \u03C0\u03C1\u03BF\u03C3\u03AC\u03C1\u03BC\u03BF\u03C3\u03AD \u03C4\u03B5\u03C2 \u03AE \u03AC\u03B4\u03B5\u03B9\u03B1\u03C3\u03B5 \u03C4\u03BF\u03BD \u03C0\u03AF\u03BD\u03B1\u03BA\u03B1 \u03B1\u03BD\u03AC \u03C0\u03AC\u03C3\u03B1 \u03C3\u03C4\u03B9\u03B3\u03BC\u03AE.",
      "guide_sample_key": "\u03A0\u03C1\u03CC\u03C4\u03C5\u03C0\u03B1",
      "guide_shortcuts_title": "\u03A0\u03B5\u03C1\u03B9\u03C3\u03C3\u03CC\u03C4\u03B5\u03C1\u03B5\u03C2 \u03A3\u03C5\u03BD\u03C4\u03BF\u03BC\u03B5\u03CD\u03C3\u03B5\u03B9\u03C2",
      "guide_shortcuts_desc": "\u2022 <b>\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [U]</b>: \u0391\u03BD\u03B1\u03AF\u03C1\u03B5\u03C3\u03B7 \u03C4\u03B5\u03BB\u03B5\u03C5\u03C4\u03B1\u03AF\u03B1\u03C2 \u03B5\u03BD\u03AD\u03C1\u03B3\u03B5\u03B9\u03B1\u03C2<br>\u2022 <b>\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [A]</b>: \u039D\u03AD\u03BF \u03C1\u03B1\u03BD\u03C4\u03B5\u03B2\u03BF\u03CD<br>\u2022 <b>\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [B]</b>: \u0386\u03BD\u03BF\u03B9\u03B3\u03BC\u03B1 \u038F\u03B8\u03B7\u03C3\u03B7\u03C2 & \u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7\u03C2<br>\u2022 <b>\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [I]</b>: \u0397\u03BC\u03B5\u03C1\u03AE\u03C3\u03B9\u03B1 \u03AD\u03BC\u03C0\u03BD\u03B5\u03C5\u03C3\u03B7<br>\u2022 <b>\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [H]</b>: \u0386\u03BD\u03BF\u03B9\u03B3\u03BC\u03B1/\u03BA\u03BB\u03B5\u03AF\u03C3\u03B9\u03BC\u03BF \u03BF\u03B4\u03B7\u03B3\u03BF\u03CD<br>\u2022 <b>\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [Esc]</b>: \u039A\u03BB\u03B5\u03AF\u03C3\u03B9\u03BC\u03BF \u03CC\u03BB\u03C9\u03BD \u03C4\u03C9\u03BD \u03C0\u03B1\u03C1\u03B1\u03B8\u03CD\u03C1\u03C9\u03BD",
      "guide_shortcuts_key": "\u03A0\u03BF\u03BB\u03BB\u03B1\u03C0\u03BB\u03AC",
      "guide_footer_local": "Flow Suite \xB7 Local-First",
      "guide_footer_privacy": "\u03A0\u03C1\u03BF\u03C3\u03C4\u03B1\u03C3\u03AF\u03B1 \u0394\u03B5\u03B4\u03BF\u03BC\u03AD\u03BD\u03C9\u03BD & \u038C\u03C1\u03BF\u03B9",
      "pause_panel_title": "\u03A0\u03B1\u03CD\u03C3\u03B7 & \u0391\u03B9\u03C3\u03B8\u03B7\u03C4\u03B7\u03C1\u03B9\u03B1\u03BA\u03AE \u03A7\u03B1\u03BB\u03AC\u03C1\u03C9\u03C3\u03B7",
      "pause_breath_title": "\u0391\u03BD\u03B1\u03C0\u03BD\u03BF\u03AE 4-4-4",
      "pause_breath_sub": "\u0397\u03C1\u03B5\u03BC\u03B5\u03AF \u03C4\u03BF \u03BD\u03B5\u03C5\u03C1\u03B9\u03BA\u03CC \u03C3\u03CD\u03C3\u03C4\u03B7\u03BC\u03B1 \u03C3\u03B5 60\u03B4",
      "pause_grounding_title": "\u0393\u03B5\u03AF\u03C9\u03C3\u03B7 5-4-3-2-1",
      "pause_grounding_sub": "\u03A3\u03B5 \u03B5\u03C0\u03B1\u03BD\u03B1\u03C6\u03AD\u03C1\u03B5\u03B9 \u03AC\u03BC\u03B5\u03C3\u03B1 \u03C3\u03C4\u03BF \u03C0\u03B1\u03C1\u03CC\u03BD",
      "pause_stretch_title": "\u0394\u03B9\u03AC\u03C4\u03B1\u03C3\u03B7 \u03A3\u03CE\u03BC\u03B1\u03C4\u03BF\u03C2 & \u0391\u03C5\u03C7\u03AD\u03BD\u03B1",
      "pause_stretch_sub": "2 \u03BB\u03B5\u03C0\u03C4\u03AC \u03B1\u03C0\u03B1\u03BB\u03AE\u03C2 \u03C7\u03B1\u03BB\u03AC\u03C1\u03C9\u03C3\u03B7\u03C2",
      "pause_nap_title": "Power Nap (20 \u039B\u03B5\u03C0\u03C4\u03AC) \u{1F634}",
      "pause_nap_sub": "\u03A3\u03CD\u03BD\u03C4\u03BF\u03BC\u03BF\u03C2 \u03CD\u03C0\u03BD\u03BF\u03C2 \u03C5\u03C0\u03CC \u03AE\u03C7\u03BF \u03B1\u03C0\u03B1\u03BB\u03AE\u03C2 \u03B2\u03C1\u03BF\u03C7\u03AE\u03C2",
      "settings_dropdown_title": "\u03A1\u03C5\u03B8\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2",
      "settings_btn_fullscreen": "\u03A0\u03BB\u03AE\u03C1\u03B7\u03C2 \u03C0\u03C1\u03BF\u03B2\u03BF\u03BB\u03AE \u2197",
      "settings_section_theme": "\u{1F3A8} \u03A7\u03C1\u03C9\u03BC\u03B1\u03C4\u03B9\u03BA\u03CC \u0398\u03AD\u03BC\u03B1 (16 \u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2)",
      "settings_section_lang": "\u{1F310} \u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE \u0393\u03BB\u03CE\u03C3\u03C3\u03B1\u03C2",
      "settings_p2p_sync": "\u0396\u03C9\u03BD\u03C4\u03B1\u03BD\u03CC\u03C2 \u03A3\u03C5\u03B3\u03C7\u03C1\u03BF\u03BD\u03B9\u03C3\u03BC\u03CC\u03C2",
      "settings_privacy_btn": "\u03A0\u03C1\u03BF\u03C3\u03C4\u03B1\u03C3\u03AF\u03B1 \u0394\u03B5\u03B4\u03BF\u03BC\u03AD\u03BD\u03C9\u03BD",
      "audio_center_title": "\u039A\u03AD\u03BD\u03C4\u03C1\u03BF \u0389\u03C7\u03BF\u03C5",
      "audio_center_subtitle": "\u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7, \u03A1\u03C5\u03B8\u03BC\u03BF\u03AF & Mix Studio",
      "audio_tab_ambient": "\u0389\u03C7\u03BF\u03B9 \u03A6\u03CD\u03C3\u03B7\u03C2",
      "audio_tab_beats": "Beats & LoFi",
      "audio_tab_dj": "Mix Studio",
      "cal_mo": "\u0394\u03B5",
      "cal_di": "\u03A4\u03C1",
      "cal_mi": "\u03A4\u03B5",
      "cal_do": "\u03A0\u03AD",
      "cal_fr": "\u03A0\u03B1",
      "cal_sa": "\u03A3\u03AC",
      "cal_so": "\u039A\u03C5",
      "month_jan": "\u0399\u03B1\u03BD\u03BF\u03C5\u03AC\u03C1\u03B9\u03BF\u03C2",
      "month_feb": "\u03A6\u03B5\u03B2\u03C1\u03BF\u03C5\u03AC\u03C1\u03B9\u03BF\u03C2",
      "month_mar": "\u039C\u03AC\u03C1\u03C4\u03B9\u03BF\u03C2",
      "month_apr": "\u0391\u03C0\u03C1\u03AF\u03BB\u03B9\u03BF\u03C2",
      "month_may": "\u039C\u03AC\u03B9\u03BF\u03C2",
      "month_jun": "\u0399\u03BF\u03CD\u03BD\u03B9\u03BF\u03C2",
      "month_jul": "\u0399\u03BF\u03CD\u03BB\u03B9\u03BF\u03C2",
      "month_aug": "\u0391\u03CD\u03B3\u03BF\u03C5\u03C3\u03C4\u03BF\u03C2",
      "month_sep": "\u03A3\u03B5\u03C0\u03C4\u03AD\u03BC\u03B2\u03C1\u03B9\u03BF\u03C2",
      "month_oct": "\u039F\u03BA\u03C4\u03CE\u03B2\u03C1\u03B9\u03BF\u03C2",
      "month_nov": "\u039D\u03BF\u03AD\u03BC\u03B2\u03C1\u03B9\u03BF\u03C2",
      "month_dec": "\u0394\u03B5\u03BA\u03AD\u03BC\u03B2\u03C1\u03B9\u03BF\u03C2",
      "mobile_nav_tools": "\u0395\u03C1\u03B3\u03B1\u03BB\u03B5\u03AF\u03B1",
      "mobile_nav_planner": "\u03A0\u03BB\u03AC\u03BD\u03BF",
      "mobile_nav_focus": "\u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7",
      "mobile_nav_audio": "\u0389\u03C7\u03BF\u03C2",
      "mobile_nav_game": "\u03A0\u03B1\u03B9\u03C7\u03BD\u03AF\u03B4\u03B9",
      "mobile_fab_title": "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u03BD\u03AD\u03B1\u03C2 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1\u03C2",
      "mobile_quick_title": "\u0393\u03C1\u03AE\u03B3\u03BF\u03C1\u03BF \u039C\u03B5\u03BD\u03BF\u03CD & \u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2",
      "mobile_quick_desc": "\u038C\u03BB\u03B5\u03C2 \u03BF\u03B9 \u03BB\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03AF\u03B5\u03C2 \u03AC\u03BC\u03B5\u03C3\u03B1 \u03B4\u03B9\u03B1\u03B8\u03AD\u03C3\u03B9\u03BC\u03B5\u03C2",
      "mobile_quick_sync_title": "\u0396\u03C9\u03BD\u03C4\u03B1\u03BD\u03CC\u03C2 \u03A3\u03C5\u03B3\u03C7\u03C1\u03BF\u03BD\u03B9\u03C3\u03BC\u03CC\u03C2",
      "mobile_quick_sync_sub": "\u039C\u03B5\u03C4\u03B1\u03C6\u03BF\u03C1\u03AC QR & P2P",
      "mobile_quick_stats_title": "\u03A3\u03C4\u03B1\u03C4\u03B9\u03C3\u03C4\u03B9\u03BA\u03AC",
      "mobile_quick_stats_sub": "\u0395\u03B2\u03B4\u03BF\u03BC\u03B1\u03B4\u03B9\u03B1\u03AF\u03B1 \u03B1\u03BD\u03AC\u03BB\u03C5\u03C3\u03B7",
      "mobile_quick_theme_title": "\u03A7\u03C1\u03C9\u03BC\u03B1\u03C4\u03B9\u03BA\u03CC \u0398\u03AD\u03BC\u03B1",
      "mobile_quick_theme_sub": "16 \u0398\u03AD\u03BC\u03B1\u03C4\u03B1",
      "mobile_quick_lang_title": "\u0393\u03BB\u03CE\u03C3\u03C3\u03B1",
      "mobile_quick_lang_sub": "6 \u0393\u03BB\u03CE\u03C3\u03C3\u03B5\u03C2",
      "mobile_quick_whatnow_title": "\u039A\u03B1\u03B9 \u03C4\u03CE\u03C1\u03B1 \u03C4\u03B9;",
      "mobile_quick_whatnow_sub": "\u03A0\u03C1\u03CC\u03C4\u03B1\u03C3\u03B7 \u03B4\u03C1\u03AC\u03C3\u03B7\u03C2",
      "mobile_quick_break_title": "\u03A0\u03B1\u03CD\u03C3\u03B7 \u03A7\u03B1\u03BB\u03AC\u03C1\u03C9\u03C3\u03B7\u03C2",
      "mobile_quick_break_sub": "\u0391\u03BD\u03B1\u03C0\u03BD\u03BF\u03AE & \u0397\u03C1\u03B5\u03BC\u03AF\u03B1",
      "mobile_quick_save_title": "\u0391\u03C0\u03BF\u03B8\u03AE\u03BA\u03B5\u03C5\u03C3\u03B7 \u03C0\u03BB\u03AC\u03BD\u03BF\u03C5",
      "mobile_quick_save_sub": "\u0395\u03BE\u03B1\u03B3\u03C9\u03B3\u03AE JSON",
      "mobile_quick_settings_title": "\u03A1\u03C5\u03B8\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2",
      "mobile_quick_settings_sub": "\u03A1\u03C5\u03B8\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2 & GDPR",
      "mobile_tools_section": "\u{1F6E0}\uFE0F \u03A4\u03C1\u03CC\u03C0\u03BF\u03C2 \u0396\u03C9\u03AE\u03C2 & \u03A0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03B9\u03BA\u03CC\u03C4\u03B7\u03C4\u03B1",
      "mobile_tools_sync_badge": "1-\u039A\u03BB\u03B9\u03BA",
      "mobile_tools_sync_title": "\u0396\u03C9\u03BD\u03C4\u03B1\u03BD\u03CC\u03C2 \u03A3\u03C5\u03B3\u03C7\u03C1\u03BF\u03BD\u03B9\u03C3\u03BC\u03CC\u03C2 & QR",
      "mobile_tools_sync_sub": "\u03A5\u03C0\u03BF\u03BB\u03BF\u03B3\u03B9\u03C3\u03C4\u03AE\u03C2 \u2194 \u039A\u03B9\u03BD\u03B7\u03C4\u03CC",
      "mobile_tools_opt_badge": "\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2",
      "mobile_tools_opt_title": "\u0395\u03BC\u03C6\u03AC\u03BD\u03B9\u03C3\u03B7 & \u0393\u03BB\u03CE\u03C3\u03C3\u03B1",
      "mobile_tools_opt_sub": "\u0398\u03AD\u03BC\u03B1\u03C4\u03B1 & \u0391\u03BD\u03C4\u03AF\u03B3\u03C1\u03B1\u03C6\u03B1",
      "mobile_tools_shop_badge": "\u03A8\u03CE\u03BD\u03B9\u03B1",
      "mobile_tools_shop_title": "\u039B\u03AF\u03C3\u03C4\u03B1 \u0391\u03B3\u03BF\u03C1\u03CE\u03BD",
      "mobile_tools_shop_sub": "\u039A\u03B1\u03C4\u03B7\u03B3\u03BF\u03C1\u03AF\u03B5\u03C2 & \u03A0\u03BF\u03C3\u03CC\u03C4\u03B7\u03C4\u03B5\u03C2",
      "mobile_tools_cook_badge": "\u039C\u03B1\u03B3\u03B5\u03B9\u03C1\u03B9\u03BA\u03AE",
      "mobile_tools_cook_title": "\u03A3\u03C5\u03BD\u03C4\u03B1\u03B3\u03AD\u03C2 & \u03A0\u03C1\u03BF\u03B5\u03C4\u03BF\u03B9\u03BC\u03B1\u03C3\u03AF\u03B1",
      "mobile_tools_cook_sub": "\u0392\u03AE\u03BC\u03B1-\u0392\u03AE\u03BC\u03B1",
      "mobile_tools_sport_badge": "\u0395\u03BD\u03B5\u03C1\u03B3\u03CC",
      "mobile_tools_sport_title": "\u0394\u03B9\u03AC\u03BB\u03B5\u03B9\u03BC\u03BC\u03B1 \u039A\u03AF\u03BD\u03B7\u03C3\u03B7\u03C2",
      "mobile_tools_sport_sub": "\u039C\u03B9\u03BA\u03C1\u03BF-\u0391\u03C3\u03BA\u03AE\u03C3\u03B5\u03B9\u03C2",
      "mobile_tools_alarm_badge": "\u039E\u03C5\u03C0\u03BD\u03B7\u03C4\u03AE\u03C1\u03B9",
      "mobile_tools_alarm_title": "\u039E\u03C5\u03C0\u03BD\u03B7\u03C4\u03AE\u03C1\u03B9\u03B1 & \u03A7\u03C1\u03BF\u03BD\u03CC\u03BC\u03B5\u03C4\u03C1\u03B1",
      "mobile_tools_alarm_sub": "\u0391\u03BA\u03C1\u03B9\u03B2\u03B5\u03AF\u03C2 \u03A5\u03C0\u03B5\u03BD\u03B8\u03C5\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2",
      "mobile_tools_stats_badge": "\u03A3\u03C4\u03B1\u03C4\u03B9\u03C3\u03C4\u03B9\u03BA\u03AC",
      "mobile_tools_stats_title": "\u03A0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03B9\u03BA\u03CC\u03C4\u03B7\u03C4\u03B1",
      "mobile_tools_stats_sub": "\u0395\u03B2\u03B4\u03BF\u03BC\u03B1\u03B4\u03B9\u03B1\u03AF\u03B1 \u0391\u03BD\u03B1\u03C6\u03BF\u03C1\u03AC",
      "mobile_tools_whatnow_badge": "\u038F\u03B8\u03B7\u03C3\u03B7",
      "mobile_tools_whatnow_title": "\u039A\u03B1\u03B9 \u03C4\u03CE\u03C1\u03B1 \u03C4\u03B9;",
      "mobile_tools_whatnow_sub": "\u03A0\u03C1\u03CC\u03C4\u03B1\u03C3\u03B7 \u03B2\u03AC\u03C3\u03B5\u03B9 \u0395\u03BD\u03AD\u03C1\u03B3\u03B5\u03B9\u03B1\u03C2",
      "mobile_audio_synth_title": "\u03A1\u03C5\u03B8\u03BC\u03BF\u03AF \u03A3\u03C5\u03BD\u03B8\u03B5\u03C3\u03AC\u03B9\u03B6\u03B5\u03C1"
    }
  };
  if (typeof window !== "undefined") {
    window.TRANSLATIONS_PART2 = TRANSLATIONS_PART22;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.TRANSLATIONS_PART2 = TRANSLATIONS_PART22;
  }

  // data-translations.js
  var TRANSLATIONS2 = Object.assign(
    {},
    typeof TRANSLATIONS_PART1 !== "undefined" ? TRANSLATIONS_PART1 : {},
    typeof TRANSLATIONS_PART2 !== "undefined" ? TRANSLATIONS_PART2 : {}
  );

  // data-custom-translations.js
  if (typeof window.TRANSLATIONS === "undefined") {
    window.TRANSLATIONS = {};
  }
  var customTranslations2 = {
    "en": {
      "weekly": "Household",
      "daily": "Today",
      "todo": "To-do",
      "done": "Done",
      "termine": "Appointments",
      "occasionally": "Occasionally",
      "notes": "Notes",
      "notesPlaceholder": "Type your notes, ideas, and quick reminders here...",
      "add": "Add task",
      "add_task": "Add task",
      "add_column": "Add column",
      "column_name": "Column title",
      "delete_column": "Delete column",
      "rename_column": "Rename column",
      "choose_icon": "Choose icon",
      "card_color": "Card color",
      "confirm_delete_column": "Are you sure you want to delete this column and all its tasks?",
      "new_task_placeholder": "What needs to be done?",
      "report": "Stats",
      "report_title": "Productivity & Statistics",
      "report_today": "Today",
      "report_week": "Week",
      "report_month": "Month",
      "report_open_full": "Open Full Dashboard \u2197",
      "open_dashboard": "Open Full Dashboard \u2197",
      "dashboard_title": "Analytics & Insights Dashboard",
      "focus_time": "Focus Time",
      "peak_hours": "Peak Productivity",
      "category_balance": "Category Balance",
      "search_history": "Search completed tasks...",
      "morning_peak": "Morning (06:00 - 12:00)",
      "afternoon_peak": "Afternoon (12:00 - 18:00)",
      "evening_peak": "Evening (18:00 - 24:00)",
      "night_peak": "Night (00:00 - 06:00)",
      "export_image": "Export as Image (PNG)",
      "copy_report": "Copy Summary",
      "settings": "Options",
      "tab_general": "General",
      "tab_history": "Version History",
      "tab_impressum": "Legal Notice (\xA7 5 DDG)",
      "tab_privacy": "Privacy & GDPR",
      "tab_licenses": "Licenses & Disclaimer",
      "history_subtitle": "Visual timeline and milestones of Flow development",
      "settings_modal_title": "Settings & Legal Compliance",
      "settings_modal_subtitle": "Configuration, privacy policy and open-source licenses",
      "setting_default_workspace": "Default Workspace on Startup",
      "setting_default_timer": "Default Focus Duration",
      "setting_clear_data": "Clear All Local App Data",
      "setting_clear_data_confirm": "Are you sure you want to completely erase all local data and reset the app?",
      "cmd_search_placeholder": "Type a command or search tasks... (Ctrl+K)",
      "cmd_actions": "Quick Actions",
      "cmd_tasks": "Matching Tasks",
      "cmd_no_results": "No matching commands or tasks found",
      "cmd_shortcut_hint": "Use \u2191 \u2193 to navigate, Enter to select, Esc to close",
      "recurrence_label": "Repeat Task",
      "recurrence_none": "No repeat",
      "recurrence_daily": "Daily",
      "recurrence_weekdays": "Weekdays (Mon-Fri)",
      "recurrence_weekly": "Weekly",
      "whatnow": "What now?",
      "minimal_mode": "Focus Mode",
      "standard_mode": "Standard View",
      "pause_btn": "Pause",
      "give_feedback": "Feedback",
      "feedback": "Feedback",
      "feedback_desc": "How do you like Flow? Your suggestions help us improve!",
      "feedback_placeholder": "Share your thoughts, ideas, or feature requests...",
      "feedback_greet": "Hey there! \u{1F44B}",
      "feedback_prompt": "Do you have feedback, ideas, or suggestions for Flow? Feel free to drop a message!",
      "feedback_alt": "or send an email to support@flow-planner.app",
      "feedback_send_tooltip": "Send feedback directly to the creator",
      "send": "Send",
      "login_btn": "Sign In",
      "sync_title": "Sync Devices",
      "sync_desc": "Back up your plan and seamlessly sync it across all your devices.",
      "login": "Sign In",
      "register": "Sign Up",
      "title_undo": "Undo",
      "title_open": "Open Plan",
      "title_save": "Save Plan",
      "title_reset": "Reset All",
      "title_theme": "Color Theme",
      "options_title": "Options & Settings",
      "theme_select": "Theme",
      "lang_select": "Language",
      "workspace_private": "Personal",
      "workspace_work": "Work",
      "work_focus": "Focus Today",
      "work_in_progress": "In Progress",
      "work_waiting": "Waiting / Review",
      "work_backlog": "Backlog",
      "dock_sounds": "Sounds",
      "dock_music": "Music",
      "dock_shop": "Shopping",
      "dock_cook": "Cooking",
      "dock_scripts": "Scripts",
      "dock_alarm": "Alarms",
      "dock_weather": "Weather",
      "dock_news": "News",
      "dock_spark": "Spark",
      "dock_inspire": "Inspire",
      "dock_clarity": "Clarity",
      "dock_impulse": "Drive",
      "dock_audio": "Audio",
      "dock_daily": "Lifestyle",
      "dock_beats": "Beats",
      "dock_workout": "Workout",
      "dock_matrix": "Matrix",
      "dock_gamification": "Arcade",
      "weather_title": "Local Weather",
      "news_title": "Daily Digest",
      "clarity_title": "Clarity & Impulse Control",
      "clarity_subtitle": "Overcome cravings, resist unwanted impulses & strengthen self-regulation",
      "sounds": "Sounds",
      "soundscape_title": "Focus & Nature Soundscapes",
      "music": "Music",
      "music_player": "Audio Player",
      "custom_tracks": "Play Your Own Audio Files",
      "no_tracks": "No audio tracks loaded yet",
      "shopping": "Shopping List",
      "cooking": "Smart Cooking",
      "scripts": "Social Scripts",
      "alarm": "Alarms & Reminders",
      "spark": "Quick Spark",
      "inspire": "Inspiration",
      "inspire_title": "Daily Inspiration",
      "zen_title": "Zen Focus",
      "next_rec": "Suggested Task",
      "start_focus": "Start Focus",
      "other_suggestion": "Another Idea",
      "open_steps": "Step-by-Step Guide",
      "completed": "Done!",
      "complete_btn": "Mark as Done",
      "complete": "Done",
      "complete_task": "Task Completed",
      "timer_title": "Focus Timer",
      "start": "Start",
      "stop": "Stop",
      "steps_btn": "Steps",
      "steps_tab": "Steps",
      "pick_desc": "Feeling overwhelmed? Let Flow pick the best next task for you based on current priority:",
      "next_suggestion": "\u{1F3B2} Next Task",
      "steps_desc": "Select a task to view its detailed step-by-step breakdown:",
      "start_timer": "Start Focus Timer",
      "dropdown_placeholder": "-- Select a task from your board --",
      "boost_btn": "Spark",
      "boost_desc": "Stuck in analysis paralysis? Try this 30-second micro-action to reset momentum:",
      "boost_placeholder": "Click below to generate an instant action impulse!",
      "boost_new": "Another Idea \u{1F504}",
      "dopamine_kick_title": "Ready for a quick dopamine kick? \u26A1",
      "dopamine_kick_start": "\u26A1 Give me one!",
      "dopamine_kick_done": "Done! \u{1F389} (+25 XP)",
      "dopamine_kick_other": "Different Action \u{1F504}",
      "dopamine_kick_completed_toast": "Dopamine kick completed! Great job starting.",
      "dopamine_kick_success_log": "\u26A1 Dopamine kick completed:",
      "whatnow_kickstart": "\u{1FA9C} Kickstart",
      "cook_add_ingredient": "Add",
      "cook_add_ingredient_placeholder": "Enter an ingredient (e.g. Pasta, Eggs)...",
      "cook_suggest": "Suggest Recipe \u{1F373}",
      "cook_pantry_empty": "Your pantry is empty. Add ingredients above!",
      "cook_suggestion_title": "Recipe Suggestion",
      "cook_steps": "Instructions",
      "cook_ingredients": "Your Pantry",
      "cook_quick_staples": "Quick Staples",
      "cook_recipe_ingredients": "Required Ingredients",
      "cook_placeholder_empty": "Add pantry ingredients above to receive tailored recipe suggestions.",
      "cook_time": "Time",
      "cook_tags": "Tags",
      "cook_add_to_shop": "Add missing ingredients to shopping list \u{1F6D2}",
      "shop_add_placeholder": "Add item (e.g. 2x oat milk, bread)...",
      "shop_add_btn": "Add",
      "shop_history": "History",
      "shop_clear": "Clear",
      "shop_recent_bought": "Recently purchased",
      "shop_empty": "Your shopping list is clear!",
      "supermarket_mode_btn": "Supermarket Mode \u{1F6D2}",
      "supermarket_title": "Supermarket Mode \u{1F6D2}",
      "sample_banner_title": "\u{1F4A1} These are sample tasks to give you inspiration.",
      "sample_banner_desc": "Customize them, keep what you want, or clear the board completely to start fresh.",
      "sample_keep_all": "Keep All \u2713",
      "sample_customize_btn": "Choose & Customize \u270F\uFE0F",
      "sample_clear_btn": "Clear All \u{1F5D1}\uFE0F",
      "sample_modal_title": "Manage Sample Tasks",
      "sample_modal_subtitle": "Choose which templates to load or clear your board completely",
      "sample_cat_daily": "Daily Routine",
      "sample_cat_weekly": "Household & Cleaning",
      "sample_cat_occasionally": "Occasional & Maintenance",
      "sample_select_all": "Select All",
      "sample_deselect_all": "Deselect All",
      "sample_apply_btn": "Load Selected Tasks",
      "sample_toast_loaded": "Selected sample tasks loaded successfully!",
      "sample_toast_cleared": "Board cleared completely!",
      "toast_no_undo": "Nothing left to undo.",
      "toast_undo_applied": "Last action undone.",
      "toast_reset_success": "Your board has been reset to defaults.",
      "toast_import_success": "Plan successfully imported!",
      "toast_import_error": "Failed to read the backup file.",
      "toast_task_deleted": "Task deleted.",
      "toast_task_restored": "Task restored.",
      "toast_appointment_name_error": "Please enter a name for the appointment.",
      "toast_appointment_saved": "Appointment saved successfully!",
      "appointment_new_btn": "New Appointment",
      "appointment_form_title": "Add Appointment",
      "appointment_form_name_placeholder": "What is scheduled? (e.g. Dentist)",
      "appointment_form_date_label": "Date",
      "appointment_form_time_label": "Time",
      "appointment_form_save_btn": "Save",
      "appointment_form_cancel_btn": "Cancel",
      "sound_rain": "Gentle Rain",
      "sound_forest": "Deep Forest",
      "sound_waves": "Ocean Waves",
      "sound_fire": "Cozy Fireplace",
      "sound_whitenoise": "White Noise",
      "sound_pinknoise": "Pink Noise",
      "sound_brownnoise": "Brown Noise",
      "sound_binaural_alpha": "Alpha Waves (Focus)",
      "sound_binaural_theta": "Theta Waves (Calm)",
      "sound_cafe": "Cozy Caf\xE9",
      "sound_lofi": "Lo-Fi Chords",
      "sound_space": "Cosmic Ambient",
      "sound_stream": "Mountain Stream",
      "sound_night": "Night Crickets",
      "sound_train": "Night Train",
      "sound_wind": "Gentle Wind",
      "sound_underwater": "Underwater Float",
      "sound_fan": "Ceiling Fan",
      "sound_clock": "Soft Clockwork",
      "sound_monastery": "Tibetan Bowls",
      "sound_lofi_sunshine": "Lofi Sunshine",
      "sound_bossa_nova": "Bossa Nova",
      "sound_jazz_piano": "Jazz Voicings",
      "sound_rhodes": "Fender Rhodes",
      "sound_hypnotic_riff": "Hypnotic Riff",
      "sound_techno": "Techno 128",
      "sound_dnb": "Drum & Bass",
      "sound_afrobeats": "Afrobeats",
      "sound_swing": "Swing & Jazz",
      "sound_boombap": "Boom-Bap",
      "guide_title": "Flow Quickstart Guide",
      "guide_desc": "Click any feature to open it directly. Use keyboard shortcuts anytime outside of text inputs!",
      "guide_focus_mode_title": "Focus Mode",
      "guide_focus_mode_desc": "Hides distracting columns to show only your single most important task in a peaceful Zen view.",
      "guide_focus_mode_key": "Key [F]",
      "guide_timer_title": "Focus Timer",
      "guide_timer_desc": "Start structured work intervals with periodic motivational voice prompts and ambient audio.",
      "guide_timer_key_start": "Start/Pause [T]",
      "guide_timer_key_stop": "Stop [S]",
      "guide_whatnow_title": "What now?",
      "guide_whatnow_desc": "Overcomes cognitive decision fatigue by proposing a random task based on your priority.",
      "guide_whatnow_key": "Key [W]",
      "guide_break_title": "Sensory Break & Reset",
      "guide_break_desc": "Relieves sensory overload with guided 4-4-4 breathing, 5-4-3-2-1 grounding, or a 20-min power nap.",
      "guide_break_key": "Key [P]",
      "guide_cooking_title": "Smart Cooking & Pantry",
      "guide_cooking_desc": "Input available ingredients to generate delicious, step-by-step recipes on the fly.",
      "guide_cooking_key": "Key [K]",
      "guide_shopping_title": "Shopping List",
      "guide_shopping_desc": "Organize your grocery list with full-screen Supermarket Mode and auto-suggestions.",
      "guide_shopping_key": "Key [E]",
      "guide_sport_title": "Sport & Movement",
      "guide_sport_desc": "Gently activate your body with 1-minute exercises tailored to your current energy spoons.",
      "guide_sport_key": "Key [O]",
      "guide_report_title": "Stats & Achievements",
      "guide_report_desc": "Track daily progress, weekly productivity curves, and export visual share cards.",
      "guide_report_key": "Key [R]",
      "guide_sample_title": "Manage Sample Tasks",
      "guide_sample_desc": "Load pre-made household routines, customize them, or clear your entire board.",
      "guide_sample_key": "Templates",
      "guide_shortcuts_title": "More Shortcuts",
      "guide_shortcuts_desc": "\u2022 <b>Key [U]</b>: Undo last action<br>\u2022 <b>Key [A]</b>: Add appointment<br>\u2022 <b>Key [B]</b>: Open Drive/Momentum<br>\u2022 <b>Key [I]</b>: Daily Inspiration<br>\u2022 <b>Key [H]</b>: Open/close this guide<br>\u2022 <b>Key [Esc]</b>: Close all modals",
      "guide_shortcuts_key": "Multiple",
      "guide_footer_local": "Flow Suite \xB7 Local-First",
      "guide_footer_privacy": "Privacy & Legal Notice",
      "pause_panel_title": "Sensory Break & Reset",
      "pause_breath_title": "4-4-4 Box Breathing",
      "pause_breath_sub": "Calms nervous system in 60s",
      "pause_grounding_title": "5-4-3-2-1 Grounding",
      "pause_grounding_sub": "Brings you immediately to the present",
      "pause_stretch_title": "Body & Neck Stretch",
      "pause_stretch_sub": "2 minutes gentle loosening",
      "pause_nap_title": "Power Nap (20 Min) \u{1F634}",
      "pause_nap_sub": "Rest with gentle background rain",
      "settings_dropdown_title": "Settings",
      "settings_btn_fullscreen": "Full view \u2197",
      "settings_section_theme": "\u{1F3A8} Color Theme (16 Themes)",
      "settings_section_lang": "\u{1F310} Select Language",
      "settings_p2p_sync": "Phone Live-Sync",
      "settings_privacy_btn": "Privacy",
      "audio_center_title": "Audio Center",
      "audio_center_subtitle": "Focus, Beats & Mix Studio",
      "audio_tab_ambient": "Soundscapes",
      "audio_tab_beats": "Beats & Lo-Fi",
      "audio_tab_dj": "Mix Studio",
      "cal_mo": "Mo",
      "cal_di": "Tu",
      "cal_mi": "We",
      "cal_do": "Th",
      "cal_fr": "Fr",
      "cal_sa": "Sa",
      "cal_so": "Su",
      "month_jan": "January",
      "month_feb": "February",
      "month_mar": "March",
      "month_apr": "April",
      "month_may": "May",
      "month_jun": "June",
      "month_jul": "July",
      "month_aug": "August",
      "month_sep": "September",
      "month_oct": "October",
      "month_nov": "November",
      "month_dec": "December",
      "mobile_nav_tools": "Tools",
      "mobile_nav_planner": "Planner",
      "mobile_nav_focus": "Focus",
      "mobile_nav_audio": "Audio",
      "mobile_nav_game": "Arcade",
      "mobile_fab_title": "Add new task",
      "mobile_quick_title": "Quick Menu & Options",
      "mobile_quick_desc": "Essential functions on the go",
      "mobile_quick_sync_title": "Live-Sync",
      "mobile_quick_sync_sub": "QR & P2P Transfer",
      "mobile_quick_stats_title": "Stats",
      "mobile_quick_stats_sub": "Weekly insights",
      "mobile_quick_theme_title": "Color Theme",
      "mobile_quick_theme_sub": "16 Themes",
      "mobile_quick_lang_title": "Language",
      "mobile_quick_lang_sub": "6 Languages",
      "mobile_quick_whatnow_title": "What now?",
      "mobile_quick_whatnow_sub": "Random prompt",
      "mobile_quick_break_title": "Sensory Break",
      "mobile_quick_break_sub": "Breathing & Calm",
      "mobile_quick_save_title": "Save Plan",
      "mobile_quick_save_sub": "JSON Backup",
      "mobile_quick_settings_title": "Settings",
      "mobile_quick_settings_sub": "Options & Privacy",
      "mobile_tools_section": "\u{1F6E0}\uFE0F Lifestyle & Productivity",
      "mobile_tools_sync_badge": "1-Click",
      "mobile_tools_sync_title": "Live-Sync & QR",
      "mobile_tools_sync_sub": "PC \u2194 Phone",
      "mobile_tools_opt_badge": "Options",
      "mobile_tools_opt_title": "Design & Language",
      "mobile_tools_opt_sub": "Themes & Backup",
      "mobile_tools_shop_badge": "Loot",
      "mobile_tools_shop_title": "Shopping List",
      "mobile_tools_shop_sub": "Items & Quantities",
      "mobile_tools_cook_badge": "Pot",
      "mobile_tools_cook_title": "Smart Cooking",
      "mobile_tools_cook_sub": "Step-by-Step",
      "mobile_tools_sport_badge": "Active",
      "mobile_tools_sport_title": "Movement Break",
      "mobile_tools_sport_sub": "Micro-Workouts",
      "mobile_tools_alarm_badge": "Alarm",
      "mobile_tools_alarm_title": "Alarms & Timers",
      "mobile_tools_alarm_sub": "Precise Timers",
      "mobile_tools_stats_badge": "Stats",
      "mobile_tools_stats_title": "Productivity",
      "mobile_tools_stats_sub": "Weekly Report",
      "mobile_tools_whatnow_badge": "Spark",
      "mobile_tools_whatnow_title": "What now?",
      "mobile_tools_whatnow_sub": "Energy-based Pick",
      "mobile_audio_synth_title": "Synthesizer Beats"
    },
    "de": {
      "weekly": "Haushalt",
      "daily": "Heute",
      "todo": "To-do",
      "done": "Erledigt",
      "termine": "Termine",
      "occasionally": "Gelegentlich",
      "notes": "Notizen",
      "notesPlaceholder": "Hier ist Platz f\xFCr deine Notizen, Gedanken und spontane Ideen...",
      "add": "Aufgabe hinzuf\xFCgen",
      "add_task": "Aufgabe hinzuf\xFCgen",
      "add_column": "Spalte hinzuf\xFCgen",
      "column_name": "Spaltentitel",
      "delete_column": "Spalte l\xF6schen",
      "rename_column": "Spalte umbenennen",
      "choose_icon": "Symbol w\xE4hlen",
      "card_color": "Kartenfarbe",
      "confirm_delete_column": "M\xF6chtest du diese Spalte und alle darin enthaltenen Aufgaben wirklich l\xF6schen?",
      "new_task_placeholder": "Was steht an?",
      "report": "Statistik",
      "report_title": "Produktivit\xE4t & Statistiken",
      "report_today": "Heute",
      "report_week": "Woche",
      "report_month": "Monat",
      "report_open_full": "Gro\xDFes Dashboard \xF6ffnen \u2197",
      "open_dashboard": "Gro\xDFes Dashboard \xF6ffnen \u2197",
      "dashboard_title": "Analyse & Erfolgs-Dashboard",
      "focus_time": "Fokuszeit",
      "peak_hours": "Produktivste Phase",
      "category_balance": "Kategorien-Balance",
      "search_history": "Erledigte Aufgaben durchsuchen...",
      "morning_peak": "Morgen (06:00 - 12:00)",
      "afternoon_peak": "Nachmittag (12:00 - 18:00)",
      "evening_peak": "Abend (18:00 - 24:00)",
      "night_peak": "Nacht (00:00 - 06:00)",
      "export_image": "Als Bild sichern (PNG)",
      "copy_report": "Zusammenfassung kopieren",
      "settings": "Optionen",
      "tab_general": "Allgemein",
      "tab_history": "Versionshistorie",
      "tab_impressum": "Impressum (\xA7 5 DDG)",
      "tab_privacy": "Datenschutz & DSGVO",
      "tab_licenses": "Lizenzen & Haftung",
      "history_subtitle": "Visuelle Meilensteine und Entwicklung von Flow",
      "settings_modal_title": "Einstellungen & Rechtliches",
      "settings_modal_subtitle": "Konfiguration, Datenschutzerkl\xE4rung und Open-Source-Lizenzen",
      "setting_default_workspace": "Standard-Bereich beim Start",
      "setting_default_timer": "Standard-Fokusdauer",
      "setting_clear_data": "Alle lokalen App-Daten l\xF6schen",
      "setting_clear_data_confirm": "M\xF6chtest du wirklich alle lokalen Daten unwiderruflich l\xF6schen und die App zur\xFCcksetzen?",
      "cmd_search_placeholder": "Befehl tippen oder Aufgaben suchen... (Strg+K)",
      "cmd_actions": "Schnellaktionen",
      "cmd_tasks": "Passende Aufgaben",
      "cmd_no_results": "Keine passenden Befehle oder Aufgaben gefunden",
      "cmd_shortcut_hint": "Nutze \u2191 \u2193 zur Navigation, Enter zum Ausw\xE4hlen, Esc zum Schlie\xDFen",
      "recurrence_label": "Aufgabe wiederholen",
      "recurrence_none": "Keine Wiederholung",
      "recurrence_daily": "T\xE4glich",
      "recurrence_weekdays": "Werktags (Mo-Fr)",
      "recurrence_weekly": "W\xF6chentlich",
      "whatnow": "Was nun?",
      "minimal_mode": "Fokus-Modus",
      "standard_mode": "Standard-Modus",
      "pause_btn": "Pause",
      "give_feedback": "Feedback",
      "feedback": "Feedback",
      "feedback_desc": "Wie gef\xE4llt dir Flow? Deine R\xFCckmeldungen helfen uns, die App stetig zu verbessern!",
      "feedback_placeholder": "Teile deine Gedanken, Ideen oder W\xFCnsche...",
      "feedback_greet": "Hey, ich bin Jannis! \u{1F44B}",
      "feedback_prompt": "Hast du Feedback, Kritik oder neue Ideen f\xFCr Flow? Schreib mir gerne eine kurze Nachricht!",
      "feedback_alt": "oder sende eine E-Mail an support@flow-planner.app",
      "feedback_send_tooltip": "Feedback direkt absenden",
      "send": "Senden",
      "login_btn": "Anmelden",
      "sync_title": "Ger\xE4te synchronisieren",
      "sync_desc": "Sichere deinen Plan und nutze ihn nahtlos auf all deinen Ger\xE4ten.",
      "login": "Anmelden",
      "register": "Registrieren",
      "title_undo": "R\xFCckg\xE4ngig machen",
      "title_open": "Plan \xF6ffnen",
      "title_save": "Plan sichern",
      "title_reset": "Alles zur\xFCcksetzen",
      "title_theme": "Farbschema",
      "options_title": "Optionen & Einstellungen",
      "theme_select": "Farbschema",
      "lang_select": "Sprache",
      "workspace_private": "Privat",
      "workspace_work": "Arbeit",
      "work_focus": "Fokus Heute",
      "work_in_progress": "In Bearbeitung",
      "work_waiting": "Wartend / Review",
      "work_backlog": "Backlog",
      "dock_sounds": "Sounds",
      "dock_music": "Musik",
      "dock_shop": "Einkauf",
      "dock_cook": "Kochen",
      "dock_scripts": "Skripte",
      "dock_alarm": "Wecker",
      "dock_weather": "Wetter",
      "dock_news": "Nachrichten",
      "dock_spark": "Impuls",
      "dock_inspire": "Inspire",
      "dock_clarity": "Klarheit",
      "dock_impulse": "Schwung",
      "dock_audio": "Audio",
      "dock_daily": "Alltag",
      "dock_beats": "Beats",
      "dock_workout": "Workout",
      "dock_matrix": "Matrix",
      "dock_gamification": "Arcade",
      "weather_title": "Lokales Wetter",
      "news_title": "Daily Digest",
      "clarity_title": "Klarheit & Impulskontrolle",
      "clarity_subtitle": "Gel\xFCste \xFCberwinden, unerw\xFCnschte Gewohnheiten stoppen & Selbststeuerung st\xE4rken",
      "sounds": "Sounds",
      "soundscape_title": "Naturger\xE4usche & Klangkulissen",
      "music": "Musik",
      "music_player": "Audioplayer",
      "custom_tracks": "Eigene Audiodateien abspielen",
      "no_tracks": "Noch keine Audiotitel geladen",
      "shopping": "Einkaufsliste",
      "cooking": "Kochen & Vorrat",
      "scripts": "Soziale Skripte",
      "alarm": "Wecker & Erinnerungen",
      "spark": "Schneller Impuls",
      "inspire": "Inspiration",
      "inspire_title": "Tages-Inspiration",
      "zen_title": "Zen-Fokus",
      "next_rec": "Empfohlene Aufgabe",
      "start_focus": "Fokus starten",
      "other_suggestion": "Anderer Vorschlag",
      "open_steps": "Schritt-f\xFCr-Schritt-Anleitung",
      "completed": "Geschafft!",
      "complete_btn": "Erledigt",
      "complete": "Erledigt",
      "complete_task": "Aufgabe erledigt",
      "timer_title": "Fokus-Timer",
      "start": "Start",
      "stop": "Stopp",
      "steps_btn": "Schritte",
      "steps_tab": "Schritte",
      "pick_desc": "F\xFChlst du dich blockiert? Lass Flow die passende n\xE4chste Aufgabe nach Priorit\xE4t f\xFCr dich ausw\xE4hlen:",
      "next_suggestion": "\u{1F3B2} N\xE4chste Aufgabe",
      "steps_desc": "W\xE4hle eine Aufgabe, um die detaillierte Schritt-f\xFCr-Schritt-Anleitung anzuzeigen:",
      "start_timer": "Fokus-Timer starten",
      "dropdown_placeholder": "-- W\xE4hle eine Aufgabe aus deinem Plan --",
      "boost_btn": "Impuls",
      "boost_desc": "Festgefahren? Probiere diese 30-Sekunden-Aktion aus, um wieder in Schwung zu kommen:",
      "boost_placeholder": "Klicke unten, um einen sofortigen Handlungsimpuls zu erhalten!",
      "boost_new": "Neuer Impuls \u{1F504}",
      "dopamine_kick_title": "Lust auf einen schnellen Dopamin-Kick? \u26A1",
      "dopamine_kick_start": "\u26A1 Gib mir einen!",
      "dopamine_kick_done": "Erledigt! \u{1F389} (+25 XP)",
      "dopamine_kick_other": "Andere Aktion \u{1F504}",
      "dopamine_kick_completed_toast": "Dopamin-Kick abgeschlossen! Starker Start.",
      "dopamine_kick_success_log": "\u26A1 Dopamin-Kick ausgef\xFChrt:",
      "whatnow_kickstart": "\u{1FA9C} Kickstart",
      "cook_add_ingredient": "Hinzuf\xFCgen",
      "cook_add_ingredient_placeholder": "Zutat eingeben (z.B. Nudeln, Eier)...",
      "cook_suggest": "Rezept vorschlagen \u{1F373}",
      "cook_pantry_empty": "Dein Vorrat ist leer. F\xFCge oben Zutaten hinzu!",
      "cook_suggestion_title": "Rezept-Vorschlag",
      "cook_steps": "Zubereitungsschritte",
      "cook_ingredients": "Dein Vorrat",
      "cook_quick_staples": "Schnelle Vorratszutaten",
      "cook_recipe_ingredients": "Ben\xF6tigte Zutaten",
      "cook_placeholder_empty": "Trage deine Zutaten ein, um passende Rezeptvorschl\xE4ge zu erhalten.",
      "cook_time": "Zeit",
      "cook_tags": "Tags",
      "cook_add_to_shop": "Fehlende Zutaten auf Einkaufsliste setzen \u{1F6D2}",
      "shop_add_placeholder": "Artikel hinzuf\xFCgen (z.B. 2x Hafermilch, Brot)...",
      "shop_add_btn": "Hinzuf\xFCgen",
      "shop_history": "Verlauf",
      "shop_clear": "Leeren",
      "shop_recent_bought": "Zuletzt gekauft",
      "shop_empty": "Deine Einkaufsliste ist leer!",
      "supermarket_mode_btn": "Supermarkt-Modus \u{1F6D2}",
      "supermarket_title": "Supermarkt-Modus \u{1F6D2}",
      "sample_banner_title": "\u{1F4A1} Das sind vorgefertigte Beispiel-Aufgaben zur Orientierung.",
      "sample_banner_desc": "Du kannst sie individuell anpassen, behalten oder das Board komplett leeren.",
      "sample_keep_all": "Alle behalten \u2713",
      "sample_customize_btn": "Ausw\xE4hlen & Anpassen \u270F\uFE0F",
      "sample_clear_btn": "Board leeren \u{1F5D1}\uFE0F",
      "sample_modal_title": "Beispiel-Aufgaben verwalten",
      "sample_modal_subtitle": "W\xE4hle Vorlagen zum Laden aus oder leere dein Board vollst\xE4ndig",
      "sample_cat_daily": "Tagesroutine",
      "sample_cat_weekly": "Haushalt & Reinigung",
      "sample_cat_occasionally": "Gelegentliche Pflege",
      "sample_select_all": "Alle ausw\xE4hlen",
      "sample_deselect_all": "Alle abw\xE4hlen",
      "sample_apply_btn": "Ausgew\xE4hlte Aufgaben laden",
      "sample_toast_loaded": "Ausgew\xE4hlte Vorlagen wurden erfolgreich geladen!",
      "sample_toast_cleared": "Board wurde vollst\xE4ndig geleert!",
      "toast_no_undo": "Es gibt nichts mehr r\xFCckg\xE4ngig zu machen.",
      "toast_undo_applied": "Letzter Schritt wurde r\xFCckg\xE4ngig gemacht.",
      "toast_reset_success": "Dein Plan wurde komplett zur\xFCckgesetzt.",
      "toast_import_success": "Dein Plan wurde erfolgreich geladen!",
      "toast_import_error": "Das Laden der Datei ist leider fehlgeschlagen.",
      "toast_task_deleted": "Aufgabe gel\xF6scht.",
      "toast_task_restored": "Aufgabe wurde wiederhergestellt.",
      "toast_appointment_name_error": "Bitte trag einen Namen f\xFCr den Termin ein.",
      "toast_appointment_saved": "Dein Termin wurde erfolgreich eingetragen!",
      "appointment_new_btn": "Neuer Termin",
      "appointment_form_title": "Termin eintragen",
      "appointment_form_name_placeholder": "Was steht an? (z.B. Zahnarzt)",
      "appointment_form_date_label": "Wann",
      "appointment_form_time_label": "Uhrzeit",
      "appointment_form_save_btn": "Sichern",
      "appointment_form_cancel_btn": "Abbrechen",
      "sound_rain": "Sanfter Regen",
      "sound_forest": "Tiefer Wald",
      "sound_waves": "Meeresrauschen",
      "sound_fire": "Kaminfeuer",
      "sound_whitenoise": "Wei\xDFes Rauschen",
      "sound_pinknoise": "Rosa Rauschen",
      "sound_brownnoise": "Braunes Rauschen",
      "sound_binaural_alpha": "Alpha-Wellen (Fokus)",
      "sound_binaural_theta": "Theta-Wellen (Ruhe)",
      "sound_cafe": "Gem\xFCtliches Caf\xE9",
      "sound_lofi": "Lofi-Akkorde",
      "sound_space": "Kosmischer Raum",
      "sound_stream": "Gebirgsbach",
      "sound_night": "Nachtgrillen",
      "sound_train": "Nachtzug",
      "sound_wind": "Sanfter Wind",
      "sound_underwater": "Unterwasser",
      "sound_fan": "Ventilator",
      "sound_clock": "Sanftes Uhrwerk",
      "sound_monastery": "Tibetische Klangschalen",
      "sound_lofi_sunshine": "Lofi Sunshine",
      "sound_bossa_nova": "Bossa Nova",
      "sound_jazz_piano": "Jazz Voicings",
      "sound_rhodes": "Fender Rhodes",
      "sound_hypnotic_riff": "Hypnotic Riff",
      "sound_techno": "Techno 128",
      "sound_dnb": "Drum & Bass",
      "sound_afrobeats": "Afrobeats",
      "sound_swing": "Swing & Jazz",
      "sound_boombap": "Boom-Bap",
      "guide_title": "Flow Schnellstart-Guide",
      "guide_desc": "Klicke auf ein Element, um die Funktion direkt zu \xF6ffnen. Nutze die Tasten au\xDFerhalb von Eingabefeldern!",
      "guide_focus_mode_title": "Fokus-Modus",
      "guide_focus_mode_desc": "Blendet das ablenkende Hauptboard aus und zeigt ausschlie\xDFlich deine aktuell wichtigste To-Do-Aufgabe in einer minimalistischen Zen-Ansicht.",
      "guide_focus_mode_key": "Taste [F]",
      "guide_timer_title": "Fokus-Timer",
      "guide_timer_desc": "Starte fokussierte Arbeitssitzungen mit motivierender, periodischer Sprachbegleitung und stimmungsvoller Hintergrundmusik.",
      "guide_timer_key_start": "Start/Pause [T]",
      "guide_timer_key_stop": "Stop [S]",
      "guide_whatnow_title": "Was nun?",
      "guide_whatnow_desc": "Verringert kognitive Blockaden, indem eine zuf\xE4llige Aufgabe basierend auf deiner aktuellen Tagespriorit\xE4t vorgeschlagen wird.",
      "guide_whatnow_key": "Taste [W]",
      "guide_break_title": "Reizpause & Erholung",
      "guide_break_desc": "Unterst\xFCtzt dich bei Reiz\xFCberflutung mit gef\xFChrten Atemtakt-Rhythmen, 5-4-3-2-1 Achtsamkeits-Erdung oder schnellen Entspannungspausen.",
      "guide_break_key": "Taste [P]",
      "guide_cooking_title": "Kochen & Vorrat",
      "guide_cooking_desc": "Trage deine vorhandenen Zutaten ein und lass dir ein passendes Rezept samt strukturierter Schritt-f\xFCr-Schritt-Anleitung generieren.",
      "guide_cooking_key": "Taste [K]",
      "guide_shopping_title": "Einkaufsliste",
      "guide_shopping_desc": "Verwalte deine Eink\xE4ufe und nutze den Vollbild-Supermarktmodus f\xFCr entspanntes Einkaufen.",
      "guide_shopping_key": "Taste [E]",
      "guide_sport_title": "Sport & Bewegung",
      "guide_sport_desc": "Aktiviere deinen K\xF6rper sanft mit 1-Minuten-\xDCbungen, die perfekt auf dein aktuelles Energieniveau (Spoons) abgestimmt sind.",
      "guide_sport_key": "Taste [O]",
      "guide_report_title": "Statistik & Erfolge",
      "guide_report_desc": "Analysiere deine Fortschritte, sieh dir deine w\xF6chentliche Aktivit\xE4t an und exportiere deine t\xE4glichen Haken als Bild-Report.",
      "guide_report_key": "Taste [R]",
      "guide_sample_title": "Beispiel-Aufgaben verwalten",
      "guide_sample_desc": "Beispiel-Aufgaben f\xFCr Haushalt & Tag neu laden, individuell anpassen oder Board komplett leeren.",
      "guide_sample_key": "Vorlagen",
      "guide_shortcuts_title": "Weitere Abk\xFCrzungen",
      "guide_shortcuts_desc": "\u2022 <b>Taste [U]</b>: Letzte Aktion r\xFCckg\xE4ngig machen<br>\u2022 <b>Taste [A]</b>: Neuen Kalendertermin hinzuf\xFCgen<br>\u2022 <b>Taste [B]</b>: Schwung & Fokus \xF6ffnen<br>\u2022 <b>Taste [I]</b>: Inspirierenden Impuls \xF6ffnen<br>\u2022 <b>Taste [H]</b>: Diese Kurzanleitung \xF6ffnen/schlie\xDFen<br>\u2022 <b>Taste [Esc]</b>: Alle Modale schlie\xDFen",
      "guide_shortcuts_key": "Mehrere",
      "guide_footer_local": "Flow Suite \xB7 Local-First",
      "guide_footer_privacy": "Datenschutz & Impressum",
      "pause_panel_title": "Reizpause & Erholung",
      "pause_breath_title": "4-4-4 Atemtakt",
      "pause_breath_sub": "Beruhigt das Nervensystem in 60s",
      "pause_grounding_title": "5-4-3-2-1 Erdung",
      "pause_grounding_sub": "Holt dich sofort ins Hier & Jetzt",
      "pause_stretch_title": "K\xF6rper & Nacken lockern",
      "pause_stretch_sub": "2 Minuten sanfte Dehnung",
      "pause_nap_title": "Power Nap (20 Min) \u{1F634}",
      "pause_nap_sub": "Kurzschlaf bei leisem Regen",
      "settings_dropdown_title": "Einstellungen",
      "settings_btn_fullscreen": "Vollbild \u2197",
      "settings_section_theme": "\u{1F3A8} Farbschema (16 Themes)",
      "settings_section_lang": "\u{1F310} Sprache w\xE4hlen",
      "settings_p2p_sync": "Handy Live-Sync",
      "settings_privacy_btn": "Datenschutz",
      "audio_center_title": "Audio-Center",
      "audio_center_subtitle": "Fokus, Beats & Mix-Studio",
      "audio_tab_ambient": "Naturger\xE4usche",
      "audio_tab_beats": "Beats & LoFi",
      "audio_tab_dj": "Mix-Studio",
      "cal_mo": "Mo",
      "cal_di": "Di",
      "cal_mi": "Mi",
      "cal_do": "Do",
      "cal_fr": "Fr",
      "cal_sa": "Sa",
      "cal_so": "So",
      "month_jan": "Januar",
      "month_feb": "Februar",
      "month_mar": "M\xE4rz",
      "month_apr": "April",
      "month_may": "Mai",
      "month_jun": "Juni",
      "month_jul": "Juli",
      "month_aug": "August",
      "month_sep": "September",
      "month_oct": "Oktober",
      "month_nov": "November",
      "month_dec": "Dezember",
      "mobile_nav_tools": "Tools",
      "mobile_nav_planner": "Planer",
      "mobile_nav_focus": "Fokus",
      "mobile_nav_audio": "Audio",
      "mobile_nav_game": "3D-Game",
      "mobile_fab_title": "Neue Aufgabe hinzuf\xFCgen",
      "mobile_quick_title": "Schnellmen\xFC & Optionen",
      "mobile_quick_desc": "Alle Funktionen f\xFCr unterwegs griffbereit",
      "mobile_quick_sync_title": "Live-Sync",
      "mobile_quick_sync_sub": "QR & P2P Transfer",
      "mobile_quick_stats_title": "Statistik",
      "mobile_quick_stats_sub": "Wochenauswertung",
      "mobile_quick_theme_title": "Farbschema",
      "mobile_quick_theme_sub": "16 Themes w\xE4hlen",
      "mobile_quick_lang_title": "Sprache",
      "mobile_quick_lang_sub": "6 Sprachen (EN/DE/...)",
      "mobile_quick_whatnow_title": "Was nun?",
      "mobile_quick_whatnow_sub": "Impuls-Vorschlag",
      "mobile_quick_break_title": "Reizpause",
      "mobile_quick_break_sub": "Atem\xFCbungen & Ruhe",
      "mobile_quick_save_title": "Plan sichern",
      "mobile_quick_save_sub": "JSON-Export",
      "mobile_quick_settings_title": "Einstellungen",
      "mobile_quick_settings_sub": "Optionen & DSGVO",
      "mobile_tools_section": "\u{1F6E0}\uFE0F Lifestyle & Produktivit\xE4t",
      "mobile_tools_sync_badge": "1-Klick",
      "mobile_tools_sync_title": "Live-Sync & QR",
      "mobile_tools_sync_sub": "PC \u2194 Smartphone",
      "mobile_tools_opt_badge": "Optionen",
      "mobile_tools_opt_title": "Design & Sprache",
      "mobile_tools_opt_sub": "Themes & Backup",
      "mobile_tools_shop_badge": "Loot",
      "mobile_tools_shop_title": "Einkaufsliste",
      "mobile_tools_shop_sub": "Kategorien & Mengen",
      "mobile_tools_cook_badge": "Kessel",
      "mobile_tools_cook_title": "Rezepte & Prep",
      "mobile_tools_cook_sub": "Schritt-f\xFCr-Schritt",
      "mobile_tools_sport_badge": "Aktiv",
      "mobile_tools_sport_title": "Bewegungspause",
      "mobile_tools_sport_sub": "Mikro-Workouts",
      "mobile_tools_alarm_badge": "Alarm",
      "mobile_tools_alarm_title": "Wecker & Timer",
      "mobile_tools_alarm_sub": "Punktgenaue Wecker",
      "mobile_tools_stats_badge": "Stats",
      "mobile_tools_stats_title": "Produktivit\xE4t",
      "mobile_tools_stats_sub": "Wochenauswertung",
      "mobile_tools_whatnow_badge": "Impuls",
      "mobile_tools_whatnow_title": "Was nun?",
      "mobile_tools_whatnow_sub": "Energie-Vorschlag",
      "mobile_audio_synth_title": "Synthesizer Beats"
    },
    "fr": {
      "weekly": "Maison",
      "daily": "Aujourd'hui",
      "todo": "\xC0 faire",
      "done": "Termin\xE9",
      "termine": "Rendez-vous",
      "occasionally": "Occasionnel",
      "notes": "Notes",
      "notesPlaceholder": "\xC9cris tes notes, pens\xE9es et id\xE9es spontan\xE9es ici...",
      "add": "Ajouter une t\xE2che",
      "add_task": "Ajouter une t\xE2che",
      "add_column": "Ajouter une colonne",
      "column_name": "Titre de la colonne",
      "delete_column": "Supprimer la colonne",
      "rename_column": "Renommer la colonne",
      "choose_icon": "Choisir une ic\xF4ne",
      "card_color": "Couleur de la carte",
      "confirm_delete_column": "Es-tu s\xFBr de vouloir supprimer cette colonne et toutes ses t\xE2ches ?",
      "new_task_placeholder": "Que dois-tu faire ?",
      "report": "Statistiques",
      "report_title": "Productivit\xE9 & Statistiques",
      "report_today": "Aujourd'hui",
      "report_week": "Semaine",
      "report_month": "Mois",
      "report_open_full": "Ouvrir le Tableau de bord \u2197",
      "open_dashboard": "Ouvrir le Tableau de bord \u2197",
      "dashboard_title": "Tableau de bord Analytique",
      "focus_time": "Temps de Focus",
      "peak_hours": "P\xE9riode Productive",
      "category_balance": "\xC9quilibre des Cat\xE9gories",
      "search_history": "Rechercher des t\xE2ches termin\xE9es...",
      "morning_peak": "Matin (06h00 - 12h00)",
      "afternoon_peak": "Apr\xE8s-midi (12h00 - 18h00)",
      "evening_peak": "Soir (18h00 - 24h00)",
      "night_peak": "Nuit (00h00 - 06h00)",
      "export_image": "Enregistrer en image (PNG)",
      "copy_report": "Copier le r\xE9sum\xE9",
      "settings": "Options",
      "tab_general": "G\xE9n\xE9ral",
      "tab_history": "Historique des versions",
      "tab_impressum": "Mentions L\xE9gales (\xA7 5 DDG)",
      "tab_privacy": "Confidentialit\xE9 & RGPD",
      "tab_licenses": "Licences & Responsabilit\xE9",
      "history_subtitle": "Chronologie visuelle et \xE9tapes de d\xE9veloppement de Flow",
      "settings_modal_title": "Param\xE8tres & Mentions L\xE9gales",
      "settings_modal_subtitle": "Configuration, politique de confidentialit\xE9 et licences libres",
      "setting_default_workspace": "Espace par d\xE9faut au d\xE9marrage",
      "setting_default_timer": "Dur\xE9e de concentration par d\xE9faut",
      "setting_clear_data": "Effacer toutes les donn\xE9es locales",
      "setting_clear_data_confirm": "Es-tu s\xFBr de vouloir effacer d\xE9finitivement toutes les donn\xE9es locales et r\xE9initialiser l'application ?",
      "cmd_search_placeholder": "Taper une commande ou rechercher... (Ctrl+K)",
      "cmd_actions": "Actions rapides",
      "cmd_tasks": "T\xE2ches correspondantes",
      "cmd_no_results": "Aucune commande ou t\xE2che trouv\xE9e",
      "cmd_shortcut_hint": "Utilise \u2191 \u2193 pour naviguer, Entr\xE9e pour valider, \xC9chap pour fermer",
      "recurrence_label": "R\xE9p\xE9ter la t\xE2che",
      "recurrence_none": "Pas de r\xE9p\xE9tition",
      "recurrence_daily": "Tous les jours",
      "recurrence_weekdays": "Jours ouvr\xE9s (Lun-Ven)",
      "recurrence_weekly": "Hebdomadaire",
      "whatnow": "Et maintenant ?",
      "minimal_mode": "Mode Focus",
      "standard_mode": "Vue Standard",
      "pause_btn": "Pause",
      "give_feedback": "Avis",
      "feedback": "Avis",
      "feedback_desc": "Que penses-tu de Flow ? Tes retours nous aident \xE0 l'am\xE9liorer !",
      "feedback_placeholder": "Partage tes pens\xE9es, id\xE9es ou souhaits...",
      "feedback_greet": "Salut ! \u{1F44B}",
      "feedback_prompt": "As-tu des retours, critiques ou id\xE9es pour Flow ? Envoie-nous un message !",
      "feedback_alt": "ou \xE9cris-nous \xE0 support@flow-planner.app",
      "feedback_send_tooltip": "Envoyer directement tes retours",
      "send": "Envoyer",
      "login_btn": "Connexion",
      "sync_title": "Synchronisation des Appareils",
      "sync_desc": "Sauvegarde ton plan et utilise-le facilement sur tous tes \xE9crans.",
      "login": "Connexion",
      "register": "Inscription",
      "title_undo": "Annuler",
      "title_open": "Ouvrir le plan",
      "title_save": "Sauvegarder le plan",
      "title_reset": "Tout r\xE9initialiser",
      "title_theme": "Th\xE8me de couleur",
      "options_title": "Options & Param\xE8tres",
      "theme_select": "Th\xE8me",
      "lang_select": "Langue",
      "workspace_private": "Personnel",
      "workspace_work": "Travail",
      "work_focus": "Focus Aujourd'hui",
      "work_in_progress": "En Cours",
      "work_waiting": "En Attente",
      "work_backlog": "Backlog",
      "dock_sounds": "Sons",
      "dock_music": "Musique",
      "dock_shop": "Courses",
      "dock_cook": "Cuisine",
      "dock_scripts": "Scripts",
      "dock_alarm": "R\xE9veil",
      "dock_weather": "M\xE9t\xE9o",
      "dock_news": "Actualit\xE9s",
      "dock_spark": "\xC9tincelle",
      "dock_inspire": "Inspiration",
      "dock_clarity": "Clart\xE9",
      "dock_impulse": "\xC9lan",
      "dock_audio": "Audio",
      "dock_daily": "Quotidien",
      "dock_beats": "Beats",
      "dock_workout": "Entra\xEEnement",
      "dock_matrix": "Matrice",
      "dock_gamification": "Arcade",
      "weather_title": "M\xE9t\xE9o Locale",
      "news_title": "Daily Digest",
      "clarity_title": "Clart\xE9 & Contr\xF4le des Pulsions",
      "clarity_subtitle": "Surmonter les envies, briser les automatismes et renforcer la ma\xEEtrise de soi",
      "sounds": "Sons",
      "soundscape_title": "Sons de la Nature & Concentration",
      "music": "Musique",
      "music_player": "Lecteur Audio",
      "custom_tracks": "\xC9couter tes propres fichiers audio",
      "no_tracks": "Aucun morceau charg\xE9",
      "shopping": "Liste de Courses",
      "cooking": "Cuisine Intelligente",
      "scripts": "Scripts Sociaux",
      "alarm": "R\xE9veils & Rappels",
      "spark": "\xC9tincelle Rapide",
      "inspire": "Inspiration",
      "inspire_title": "Inspiration du Jour",
      "zen_title": "Focus Zen",
      "next_rec": "T\xE2che Recommand\xE9e",
      "start_focus": "D\xE9marrer le Focus",
      "other_suggestion": "Autre Suggestion",
      "open_steps": "Guide \xC9tape par \xC9tape",
      "completed": "Termin\xE9 !",
      "complete_btn": "Termin\xE9",
      "complete": "Termin\xE9",
      "complete_task": "T\xE2che termin\xE9e",
      "timer_title": "Minuteur de Focus",
      "start": "D\xE9marrer",
      "stop": "Arr\xEAter",
      "steps_btn": "\xC9tapes",
      "steps_tab": "\xC9tapes",
      "pick_desc": "Tu te sens submerg\xE9 ? Laisse Flow choisir la meilleure t\xE2che selon tes priorit\xE9s :",
      "next_suggestion": "\u{1F3B2} T\xE2che Suivante",
      "steps_desc": "S\xE9lectionne une t\xE2che pour voir son d\xE9coupage d\xE9taill\xE9 pas \xE0 pas :",
      "start_timer": "D\xE9marrer le minuteur",
      "dropdown_placeholder": "-- S\xE9lectionne une t\xE2che de ton tableau --",
      "boost_btn": "\xC9tincelle",
      "boost_desc": "Bloqu\xE9 dans l'action ? Tente cette micro-action de 30 secondes pour relancer ton \xE9lan :",
      "boost_placeholder": "Clique ci-dessous pour recevoir une impulsion imm\xE9diate !",
      "boost_new": "Autre Id\xE9e \u{1F504}",
      "dopamine_kick_title": "Pr\xEAt pour un coup de dopamine ? \u26A1",
      "dopamine_kick_start": "\u26A1 Donne-moi une action !",
      "dopamine_kick_done": "C'est fait ! \u{1F389} (+25 XP)",
      "dopamine_kick_other": "Autre Action \u{1F504}",
      "dopamine_kick_completed_toast": "Action termin\xE9e ! Bravo pour ce d\xE9marrage.",
      "dopamine_kick_success_log": "\u26A1 Coup de dopamine valid\xE9 :",
      "whatnow_kickstart": "\u{1FA9C} \xC9lan",
      "cook_add_ingredient": "Ajouter",
      "cook_add_ingredient_placeholder": "Entrer un ingr\xE9dient (ex. P\xE2tes, \u0152ufs)...",
      "cook_suggest": "Proposer une Recette \u{1F373}",
      "cook_pantry_empty": "Ton placard est vide. Ajoute des ingr\xE9dients ci-dessus !",
      "cook_suggestion_title": "Id\xE9e de Recette",
      "cook_steps": "Instructions de Pr\xE9paration",
      "cook_ingredients": "Tes Ingr\xE9dients",
      "cook_quick_staples": "Ingr\xE9dients de Base",
      "cook_recipe_ingredients": "Ingr\xE9dients Requis",
      "cook_placeholder_empty": "Ajoute tes ingr\xE9dients pour recevoir des suggestions sur mesure.",
      "cook_time": "Temps",
      "cook_tags": "Tags",
      "cook_add_to_shop": "Ajouter les ingr\xE9dients manquants \xE0 la liste de courses \u{1F6D2}",
      "shop_add_placeholder": "Ajouter un article (ex. 2x lait d'avoine, pain)...",
      "shop_add_btn": "Ajouter",
      "shop_history": "Historique",
      "shop_clear": "Vider",
      "shop_recent_bought": "Achet\xE9 r\xE9cemment",
      "shop_empty": "Ta liste de courses est vide !",
      "supermarket_mode_btn": "Mode Supermarch\xE9 \u{1F6D2}",
      "supermarket_title": "Mode Supermarch\xE9 \u{1F6D2}",
      "sample_banner_title": "\u{1F4A1} Ce sont des exemples de t\xE2ches pour t'inspirer.",
      "sample_banner_desc": "Tu peux les personnaliser, garder ce qui t'int\xE9resse ou tout effacer.",
      "sample_keep_all": "Tout garder \u2713",
      "sample_customize_btn": "Choisir & Personnaliser \u270F\uFE0F",
      "sample_clear_btn": "Vider le tableau \u{1F5D1}\uFE0F",
      "sample_modal_title": "G\xE9rer les T\xE2ches Mod\xE8les",
      "sample_modal_subtitle": "Choisis les mod\xE8les \xE0 charger ou vide enti\xE8rement ton tableau",
      "sample_cat_daily": "Routine Quotidienne",
      "sample_cat_weekly": "M\xE9nage & Entretien",
      "sample_cat_occasionally": "Entretien P\xE9riodique",
      "sample_select_all": "Tout s\xE9lectionner",
      "sample_deselect_all": "Tout d\xE9s\xE9lectionner",
      "sample_apply_btn": "Charger les t\xE2ches s\xE9lectionn\xE9es",
      "sample_toast_loaded": "Les mod\xE8les s\xE9lectionn\xE9s ont \xE9t\xE9 charg\xE9s avec succ\xE8s !",
      "sample_toast_cleared": "Le tableau a \xE9t\xE9 enti\xE8rement vid\xE9 !",
      "toast_no_undo": "Rien d'autre \xE0 annuler.",
      "toast_undo_applied": "Derni\xE8re action annul\xE9e.",
      "toast_reset_success": "Ton plan a \xE9t\xE9 enti\xE8rement r\xE9initialis\xE9.",
      "toast_import_success": "Plan import\xE9 avec succ\xE8s !",
      "toast_import_error": "\xC9chec de la lecture du fichier de sauvegarde.",
      "toast_task_deleted": "T\xE2che supprim\xE9e.",
      "toast_task_restored": "T\xE2che restaur\xE9e.",
      "toast_appointment_name_error": "Veuillez saisir un nom pour le rendez-vous.",
      "toast_appointment_saved": "Rendez-vous enregistr\xE9 avec succ\xE8s !",
      "appointment_new_btn": "Nouveau Rendez-vous",
      "appointment_form_title": "Ajouter un Rendez-vous",
      "appointment_form_name_placeholder": "De quoi s'agit-il ? (ex. Dentiste)",
      "appointment_form_date_label": "Date",
      "appointment_form_time_label": "Heure",
      "appointment_form_save_btn": "Enregistrer",
      "appointment_form_cancel_btn": "Annuler",
      "sound_rain": "Pluie Douce",
      "sound_forest": "For\xEAt Profonde",
      "sound_waves": "Vagues de l'Oc\xE9an",
      "sound_fire": "Feu de Bois",
      "sound_whitenoise": "Bruit Blanc",
      "sound_pinknoise": "Bruit Rose",
      "sound_brownnoise": "Bruit Brun",
      "sound_binaural_alpha": "Ondes Alpha (Focus)",
      "sound_binaural_theta": "Ondes Th\xEAta (Calme)",
      "sound_cafe": "Caf\xE9 Confortable",
      "sound_lofi": "Accords Lo-Fi",
      "sound_space": "Ambiance Cosmique",
      "sound_stream": "Ruisseau de Montagne",
      "sound_night": "Grillons Nocturnes",
      "sound_train": "Train de Nuit",
      "sound_wind": "Vent L\xE9ger",
      "sound_underwater": "Immersion Sous-Marine",
      "sound_fan": "Ventilateur",
      "sound_clock": "Horloge Douce",
      "sound_monastery": "Bols Tib\xE9tains",
      "sound_lofi_sunshine": "Lofi Sunshine",
      "sound_bossa_nova": "Bossa Nova",
      "sound_jazz_piano": "Jazz Voicings",
      "sound_rhodes": "Fender Rhodes",
      "sound_hypnotic_riff": "Riff Hypnotique",
      "sound_techno": "Techno 128",
      "sound_dnb": "Drum & Bass",
      "sound_afrobeats": "Afrobeats",
      "sound_swing": "Swing & Jazz",
      "sound_boombap": "Boom-Bap",
      "guide_title": "Guide de D\xE9marrage Rapide Flow",
      "guide_desc": "Clique sur un \xE9l\xE9ment pour l'ouvrir directement. Utilise les raccourcis clavier hors des zones de saisie !",
      "guide_focus_mode_title": "Mode Focus",
      "guide_focus_mode_desc": "Masque les \xE9l\xE9ments distrayants pour afficher uniquement ta t\xE2che prioritaire dans une vue Zen \xE9pur\xE9e.",
      "guide_focus_mode_key": "Touche [F]",
      "guide_timer_title": "Minuteur de Focus",
      "guide_timer_desc": "D\xE9marre des sessions de travail rythm\xE9es par des encouragements vocaux et des ambiances sonores.",
      "guide_timer_key_start": "D\xE9marrer/Pause [T]",
      "guide_timer_key_stop": "Arr\xEAter [S]",
      "guide_whatnow_title": "Et maintenant ?",
      "guide_whatnow_desc": "Surmonte l'ind\xE9cision en tirant au sort la prochaine t\xE2che recommand\xE9e selon ta priorit\xE9.",
      "guide_whatnow_key": "Touche [W]",
      "guide_break_title": "Pause Sensorielle & R\xE9cup\xE9ration",
      "guide_break_desc": "Soulage la surcharge mentale gr\xE2ce \xE0 la respiration 4-4-4, l'ancrage 5-4-3-2-1 ou une micro-sieste.",
      "guide_break_key": "Touche [P]",
      "guide_cooking_title": "Cuisine & Placard",
      "guide_cooking_desc": "Saisis les ingr\xE9dients disponibles pour g\xE9n\xE9rer des recettes \xE9tape par \xE9tape instantan\xE9ment.",
      "guide_cooking_key": "Touche [K]",
      "guide_shopping_title": "Liste de Courses",
      "guide_shopping_desc": "G\xE8re tes emplettes facilement gr\xE2ce au Mode Supermarch\xE9 plein \xE9cran.",
      "guide_shopping_key": "Touche [E]",
      "guide_sport_title": "Sport & Mouvement",
      "guide_sport_desc": "Active ton corps en douceur avec des exercices d'une minute adapt\xE9s \xE0 ton niveau d'\xE9nergie.",
      "guide_sport_key": "Touche [O]",
      "guide_report_title": "Statistiques & Victoires",
      "guide_report_desc": "Consulte ton activit\xE9 quotidienne, tes courbes hebdomadaires et exporte tes rapports en image.",
      "guide_report_key": "Touche [R]",
      "guide_sample_title": "G\xE9rer les Mod\xE8les de T\xE2ches",
      "guide_sample_desc": "Recharge des routines types pour la maison, adapte-les ou vide ton tableau \xE0 tout moment.",
      "guide_sample_key": "Mod\xE8les",
      "guide_shortcuts_title": "Autres Raccourcis",
      "guide_shortcuts_desc": "\u2022 <b>Touche [U]</b> : Annuler la derni\xE8re action<br>\u2022 <b>Touche [A]</b> : Ajouter un rendez-vous<br>\u2022 <b>Touche [B]</b> : Ouvrir \xC9lan & Focus<br>\u2022 <b>Touche [I]</b> : Inspiration du jour<br>\u2022 <b>Touche [H]</b> : Ouvrir/fermer ce guide<br>\u2022 <b>Touche [\xC9chap]</b> : Fermer les fen\xEAtres",
      "guide_shortcuts_key": "Multiples",
      "guide_footer_local": "Flow Suite \xB7 Local-First",
      "guide_footer_privacy": "Confidentialit\xE9 & Mentions L\xE9gales",
      "pause_panel_title": "Pause Sensorielle & R\xE9cup\xE9ration",
      "pause_breath_title": "Respiration 4-4-4",
      "pause_breath_sub": "Apaise le syst\xE8me nerveux en 60s",
      "pause_grounding_title": "Ancrage 5-4-3-2-1",
      "pause_grounding_sub": "Te ram\xE8ne imm\xE9diatement au pr\xE9sent",
      "pause_stretch_title": "\xC9tirement du Corps & Cou",
      "pause_stretch_sub": "2 minutes d'\xE9tirement doux",
      "pause_nap_title": "Micro-Sieste (20 Min) \u{1F634}",
      "pause_nap_sub": "Repos r\xE9parateur sous une pluie douce",
      "settings_dropdown_title": "Param\xE8tres",
      "settings_btn_fullscreen": "Plein \xE9cran \u2197",
      "settings_section_theme": "\u{1F3A8} Th\xE8me de Couleur (16 Th\xE8mes)",
      "settings_section_lang": "\u{1F310} Choisir la Langue",
      "settings_p2p_sync": "Synchro Mobile Directe",
      "settings_privacy_btn": "Confidentialit\xE9",
      "audio_center_title": "Centre Audio",
      "audio_center_subtitle": "Focus, Beats & Studio Mix",
      "audio_tab_ambient": "Ambiances Nature",
      "audio_tab_beats": "Beats & Lo-Fi",
      "audio_tab_dj": "Studio Mix",
      "cal_mo": "Lu",
      "cal_di": "Ma",
      "cal_mi": "Me",
      "cal_do": "Je",
      "cal_fr": "Ve",
      "cal_sa": "Sa",
      "cal_so": "Di",
      "month_jan": "Janvier",
      "month_feb": "F\xE9vrier",
      "month_mar": "Mars",
      "month_apr": "Avril",
      "month_may": "Mai",
      "month_jun": "Juin",
      "month_jul": "Juillet",
      "month_aug": "Ao\xFBt",
      "month_sep": "Septembre",
      "month_oct": "Octobre",
      "month_nov": "Novembre",
      "month_dec": "D\xE9cembre",
      "mobile_nav_tools": "Outils",
      "mobile_nav_planner": "Planning",
      "mobile_nav_focus": "Focus",
      "mobile_nav_audio": "Audio",
      "mobile_nav_game": "Jeu",
      "mobile_fab_title": "Ajouter une t\xE2che",
      "mobile_quick_title": "Menu Rapide & Options",
      "mobile_quick_desc": "Toutes les fonctions \xE0 port\xE9e de main",
      "mobile_quick_sync_title": "Synchro Live",
      "mobile_quick_sync_sub": "Transfert QR & P2P",
      "mobile_quick_stats_title": "Statistiques",
      "mobile_quick_stats_sub": "Analyse hebdo",
      "mobile_quick_theme_title": "Th\xE8me",
      "mobile_quick_theme_sub": "16 Th\xE8mes",
      "mobile_quick_lang_title": "Langue",
      "mobile_quick_lang_sub": "6 Langues",
      "mobile_quick_whatnow_title": "Et maintenant ?",
      "mobile_quick_whatnow_sub": "Action spontan\xE9e",
      "mobile_quick_break_title": "Pause Sensorielle",
      "mobile_quick_break_sub": "Respiration & Calme",
      "mobile_quick_save_title": "Sauvegarder",
      "mobile_quick_save_sub": "Export JSON",
      "mobile_quick_settings_title": "Param\xE8tres",
      "mobile_quick_settings_sub": "Options & RGPD",
      "mobile_tools_section": "\u{1F6E0}\uFE0F Lifestyle & Productivit\xE9",
      "mobile_tools_sync_badge": "1-Clic",
      "mobile_tools_sync_title": "Synchro Live & QR",
      "mobile_tools_sync_sub": "PC \u2194 Mobile",
      "mobile_tools_opt_badge": "Options",
      "mobile_tools_opt_title": "Design & Langue",
      "mobile_tools_opt_sub": "Th\xE8mes & Sauvegarde",
      "mobile_tools_shop_badge": "Courses",
      "mobile_tools_shop_title": "Liste de Courses",
      "mobile_tools_shop_sub": "Articles & Quantit\xE9s",
      "mobile_tools_cook_badge": "Marmite",
      "mobile_tools_cook_title": "Recettes & Prep",
      "mobile_tools_cook_sub": "\xC9tape par \xC9tape",
      "mobile_tools_sport_badge": "Actif",
      "mobile_tools_sport_title": "Pause Mouvement",
      "mobile_tools_sport_sub": "Micro-Entra\xEEnements",
      "mobile_tools_alarm_badge": "Alarme",
      "mobile_tools_alarm_title": "Alarmes & Minuteurs",
      "mobile_tools_alarm_sub": "Rappels Pr\xE9cis",
      "mobile_tools_stats_badge": "Stats",
      "mobile_tools_stats_title": "Productivit\xE9",
      "mobile_tools_stats_sub": "Rapport Hebdo",
      "mobile_tools_whatnow_badge": "\xC9lan",
      "mobile_tools_whatnow_title": "Et maintenant ?",
      "mobile_tools_whatnow_sub": "Choix par \xC9nergie",
      "mobile_audio_synth_title": "Beats Synth\xE9tiseur"
    },
    "it": {
      "weekly": "Casa",
      "daily": "Oggi",
      "todo": "Da fare",
      "done": "Fatto",
      "termine": "Appuntamenti",
      "occasionally": "Occasionale",
      "notes": "Note",
      "notesPlaceholder": "Scrivi qui le tue note, idee e promemoria rapidi...",
      "add": "Aggiungi attivit\xE0",
      "add_task": "Aggiungi attivit\xE0",
      "add_column": "Aggiungi colonna",
      "column_name": "Titolo colonna",
      "delete_column": "Elimina colonna",
      "rename_column": "Rinomina colonna",
      "choose_icon": "Scegli icona",
      "card_color": "Colore scheda",
      "confirm_delete_column": "Sei sicuro di voler eliminare questa colonna e tutte le sue attivit\xE0?",
      "new_task_placeholder": "Cosa c'\xE8 da fare?",
      "report": "Statistiche",
      "report_title": "Produttivit\xE0 & Statistiche",
      "report_today": "Oggi",
      "report_week": "Settimana",
      "report_month": "Mese",
      "report_open_full": "Apri Dashboard Completa \u2197",
      "open_dashboard": "Apri Dashboard Completa \u2197",
      "dashboard_title": "Dashboard Analitica",
      "focus_time": "Tempo di Focus",
      "peak_hours": "Ore Pi\xF9 Produttive",
      "category_balance": "Bilanciamento Categorie",
      "search_history": "Cerca attivit\xE0 completate...",
      "morning_peak": "Mattina (06:00 - 12:00)",
      "afternoon_peak": "Pomeriggio (12:00 - 18:00)",
      "evening_peak": "Sera (18:00 - 24:00)",
      "night_peak": "Notte (00:00 - 06:00)",
      "export_image": "Salva come immagine (PNG)",
      "copy_report": "Copia riepilogo",
      "settings": "Opzioni",
      "tab_general": "Generale",
      "tab_history": "Cronologia versioni",
      "tab_impressum": "Note Legali (\xA7 5 DDG)",
      "tab_privacy": "Privacy & GDPR",
      "tab_licenses": "Licenze & Disclaimer",
      "history_subtitle": "Cronologia visiva e traguardi dello sviluppo di Flow",
      "settings_modal_title": "Impostazioni & Conformit\xE0",
      "settings_modal_subtitle": "Configurazione, informativa privacy e licenze open-source",
      "setting_default_workspace": "Area di lavoro predefinita all'avvio",
      "setting_default_timer": "Durata del focus predefinita",
      "setting_clear_data": "Cancella tutti i dati locali",
      "setting_clear_data_confirm": "Sei sicuro di voler cancellare definitivamente tutti i dati locali e ripristinare l'app?",
      "cmd_search_placeholder": "Digita un comando o cerca attivit\xE0... (Ctrl+K)",
      "cmd_actions": "Azioni rapide",
      "cmd_tasks": "Attivit\xE0 corrispondenti",
      "cmd_no_results": "Nessun comando o attivit\xE0 trovata",
      "cmd_shortcut_hint": "Usa \u2191 \u2193 per navigare, Invio per selezionare, Esc per uscire",
      "recurrence_label": "Ripeti attivit\xE0",
      "recurrence_none": "Nessuna ripetizione",
      "recurrence_daily": "Ogni giorno",
      "recurrence_weekdays": "Giorni feriali (Lun-Ven)",
      "recurrence_weekly": "Settimanale",
      "whatnow": "E adesso?",
      "minimal_mode": "Modalit\xE0 Focus",
      "standard_mode": "Vista Standard",
      "pause_btn": "Pausa",
      "give_feedback": "Feedback",
      "feedback": "Feedback",
      "feedback_desc": "Come trovi Flow? I tuoi suggerimenti ci aiutano a migliorare costantemente!",
      "feedback_placeholder": "Condividi pensieri, idee o suggerimenti...",
      "feedback_greet": "Ciao! \u{1F44B}",
      "feedback_prompt": "Hai feedback, idee o suggerimenti per Flow? Scrivici un messaggio!",
      "feedback_alt": "o invia un'email a support@flow-planner.app",
      "feedback_send_tooltip": "Invia feedback direttamente al creatore",
      "send": "Invia",
      "login_btn": "Accedi",
      "sync_title": "Sincronizzazione Dispositivi",
      "sync_desc": "Salva il tuo piano e usalo comodamente su tutti i tuoi schermi.",
      "login": "Accedi",
      "register": "Registrati",
      "title_undo": "Annulla",
      "title_open": "Apri piano",
      "title_save": "Salva piano",
      "title_reset": "Ripristina tutto",
      "title_theme": "Tema Colore",
      "options_title": "Opzioni & Impostazioni",
      "theme_select": "Tema",
      "lang_select": "Lingua",
      "workspace_private": "Personale",
      "workspace_work": "Lavoro",
      "work_focus": "Focus Oggi",
      "work_in_progress": "In Corso",
      "work_waiting": "In Attesa",
      "work_backlog": "Backlog",
      "dock_sounds": "Suoni",
      "dock_music": "Musica",
      "dock_shop": "Spesa",
      "dock_cook": "Cucina",
      "dock_scripts": "Script",
      "dock_alarm": "Sveglia",
      "dock_weather": "Meteo",
      "dock_news": "Notizie",
      "dock_spark": "Scintilla",
      "dock_inspire": "Ispirazione",
      "dock_clarity": "Chiarezza",
      "dock_impulse": "Slancio",
      "dock_audio": "Audio",
      "dock_daily": "Quotidiano",
      "dock_beats": "Beat",
      "dock_workout": "Workout",
      "dock_matrix": "Matrice",
      "dock_gamification": "Arcade",
      "weather_title": "Meteo Locale",
      "news_title": "Daily Digest",
      "clarity_title": "Chiarezza & Controllo Impulsi",
      "clarity_subtitle": "Supera le tentazioni, interrompi le abitudini indesiderate e rafforza l'autocontrollo",
      "sounds": "Suoni",
      "soundscape_title": "Suoni della Natura & Concentrazione",
      "music": "Musica",
      "music_player": "Lettore Audio",
      "custom_tracks": "Riproduci i tuoi file audio",
      "no_tracks": "Nessun brano caricato",
      "shopping": "Lista della Spesa",
      "cooking": "Cucina Intelligente",
      "scripts": "Script Sociali",
      "alarm": "Sveglie & Promemoria",
      "spark": "Scintilla Rapida",
      "inspire": "Ispirazione",
      "inspire_title": "Ispirazione del Giorno",
      "zen_title": "Focus Zen",
      "next_rec": "Attivit\xE0 Consigliata",
      "start_focus": "Inizia Focus",
      "other_suggestion": "Altro Suggerimento",
      "open_steps": "Guida Passo Passo",
      "completed": "Completato!",
      "complete_btn": "Completato",
      "complete": "Completato",
      "complete_task": "Attivit\xE0 completata",
      "timer_title": "Timer di Focus",
      "start": "Avvia",
      "stop": "Ferma",
      "steps_btn": "Passaggi",
      "steps_tab": "Passaggi",
      "pick_desc": "Ti senti bloccato? Lascia che Flow scelga la prossima attivit\xE0 migliore in base alle tue priorit\xE0:",
      "next_suggestion": "\u{1F3B2} Prossima Attivit\xE0",
      "steps_desc": "Seleziona un'attivit\xE0 per visualizzare la suddivisione dettagliata passo dopo passo:",
      "start_timer": "Avvia Timer",
      "dropdown_placeholder": "-- Seleziona un'attivit\xE0 dalla tua lavagna --",
      "boost_btn": "Scintilla",
      "boost_desc": "Bloccato nell'azione? Prova questa micro-azione di 30 secondi per ritrovare lo slancio:",
      "boost_placeholder": "Fai clic qui sotto per generare un impulso immediato!",
      "boost_new": "Nuovo Impulso \u{1F504}",
      "dopamine_kick_title": "Pronto per una dose rapida di dopamina? \u26A1",
      "dopamine_kick_start": "\u26A1 Dammi un'azione!",
      "dopamine_kick_done": "Fatto! \u{1F389} (+25 XP)",
      "dopamine_kick_other": "Altra Azione \u{1F504}",
      "dopamine_kick_completed_toast": "Azione completata! Ottimo inizio.",
      "dopamine_kick_success_log": "\u26A1 Spinta di dopamina completata:",
      "whatnow_kickstart": "\u{1FA9C} Slancio",
      "cook_add_ingredient": "Aggiungi",
      "cook_add_ingredient_placeholder": "Inserisci un ingrediente (es. Pasta, Uova)...",
      "cook_suggest": "Proponi Ricetta \u{1F373}",
      "cook_pantry_empty": "La tua dispensa \xE8 vuota. Aggiungi ingredienti sopra!",
      "cook_suggestion_title": "Proposta di Ricetta",
      "cook_steps": "Istruzioni di Preparazione",
      "cook_ingredients": "I Tuoi Ingredienti",
      "cook_quick_staples": "Ingredienti di Base",
      "cook_recipe_ingredients": "Ingredienti Richiesti",
      "cook_placeholder_empty": "Inserisci gli ingredienti per ricevere ricette su misura.",
      "cook_time": "Tempo",
      "cook_tags": "Tag",
      "cook_add_to_shop": "Aggiungi ingredienti mancanti alla lista della spesa \u{1F6D2}",
      "shop_add_placeholder": "Aggiungi articolo (es. 2x latte d'avena, pane)...",
      "shop_add_btn": "Aggiungi",
      "shop_history": "Cronologia",
      "shop_clear": "Svuota",
      "shop_recent_bought": "Acquistati di recente",
      "shop_empty": "La tua lista della spesa \xE8 pulita!",
      "supermarket_mode_btn": "Modalit\xE0 Supermercato \u{1F6D2}",
      "supermarket_title": "Modalit\xE0 Supermercato \u{1F6D2}",
      "sample_banner_title": "\u{1F4A1} Queste sono attivit\xE0 di esempio per darti ispirazione.",
      "sample_banner_desc": "Puoi personalizzarle, tenere quelle che desideri o svuotare la lavagna per iniziare da zero.",
      "sample_keep_all": "Tieni Tutto \u2713",
      "sample_customize_btn": "Scegli & Personalizza \u270F\uFE0F",
      "sample_clear_btn": "Svuota Lavagna \u{1F5D1}\uFE0F",
      "sample_modal_title": "Gestisci Attivit\xE0 di Esempio",
      "sample_modal_subtitle": "Scegli quali modelli caricare o svuota completamente la lavagna",
      "sample_cat_daily": "Routine Quotidiana",
      "sample_cat_weekly": "Casa & Pulizie",
      "sample_cat_occasionally": "Manutenzione Periodica",
      "sample_select_all": "Seleziona Tutto",
      "sample_deselect_all": "Deseleziona Tutto",
      "sample_apply_btn": "Carica Attivit\xE0 Selezionate",
      "sample_toast_loaded": "Modelli selezionati caricati con successo!",
      "sample_toast_cleared": "Lavagna svuotata completamente!",
      "toast_no_undo": "Niente da annullare.",
      "toast_undo_applied": "Ultima azione annullata.",
      "toast_reset_success": "Il tuo piano \xE8 stato ripristinato ai valori predefiniti.",
      "toast_import_success": "Piano importato con successo!",
      "toast_import_error": "Impossibile leggere il file di backup.",
      "toast_task_deleted": "Attivit\xE0 eliminata.",
      "toast_task_restored": "Attivit\xE0 ripristinata.",
      "toast_appointment_name_error": "Inserisci un nome per l'appuntamento.",
      "toast_appointment_saved": "Appuntamento salvato con successo!",
      "appointment_new_btn": "Nuovo Appuntamento",
      "appointment_form_title": "Aggiungi Appuntamento",
      "appointment_form_name_placeholder": "Di cosa si tratta? (es. Dentista)",
      "appointment_form_date_label": "Data",
      "appointment_form_time_label": "Ora",
      "appointment_form_save_btn": "Salva",
      "appointment_form_cancel_btn": "Annulla",
      "sound_rain": "Pioggia Leggera",
      "sound_forest": "Foresta Profonda",
      "sound_waves": "Onde del Mare",
      "sound_fire": "Camino Acceso",
      "sound_whitenoise": "Rumore Bianco",
      "sound_pinknoise": "Rumore Rosa",
      "sound_brownnoise": "Rumore Marrone",
      "sound_binaural_alpha": "Onde Alpha (Focus)",
      "sound_binaural_theta": "Onde Theta (Calma)",
      "sound_cafe": "Caff\xE8 Accogliente",
      "sound_lofi": "Accordi Lo-Fi",
      "sound_space": "Ambiente Cosmico",
      "sound_stream": "Ruscello di Montagna",
      "sound_night": "Grilli Notturni",
      "sound_train": "Treno Notturno",
      "sound_wind": "Vento Leggero",
      "sound_underwater": "Immersione Subacquea",
      "sound_fan": "Ventilatore",
      "sound_clock": "Orologio Delicato",
      "sound_monastery": "Campane Tibetane",
      "sound_lofi_sunshine": "Lofi Sunshine",
      "sound_bossa_nova": "Bossa Nova",
      "sound_jazz_piano": "Jazz Voicings",
      "sound_rhodes": "Fender Rhodes",
      "sound_hypnotic_riff": "Riff Ipnotico",
      "sound_techno": "Techno 128",
      "sound_dnb": "Drum & Bass",
      "sound_afrobeats": "Afrobeats",
      "sound_swing": "Swing & Jazz",
      "sound_boombap": "Boom-Bap",
      "guide_title": "Guida Rapida di Flow",
      "guide_desc": "Fai clic su un elemento per aprirlo direttamente. Usa le scorciatoie da tastiera fuori dai campi di testo!",
      "guide_focus_mode_title": "Modalit\xE0 Focus",
      "guide_focus_mode_desc": "Nasconde le distrazioni per mostrare solo l'attivit\xE0 prioritaria in una visualizzazione Zen serena.",
      "guide_focus_mode_key": "Tasto [F]",
      "guide_timer_title": "Timer di Focus",
      "guide_timer_desc": "Avvia sessioni di lavoro con incoraggiamenti vocali periodici e suoni ambientali.",
      "guide_timer_key_start": "Avvia/Pausa [T]",
      "guide_timer_key_stop": "Ferma [S]",
      "guide_whatnow_title": "E adesso?",
      "guide_whatnow_desc": "Supera l'indecisione suggerendo una singola attivit\xE0 basata sulla priorit\xE0 corrente.",
      "guide_whatnow_key": "Tasto [W]",
      "guide_break_title": "Pausa Sensoriale & Recupero",
      "guide_break_desc": "Allevia il sovraccarico sensoriale con respirazione 4-4-4, radicamento 5-4-3-2-1 o un power nap.",
      "guide_break_key": "Tasto [P]",
      "guide_cooking_title": "Cucina & Dispensa",
      "guide_cooking_desc": "Inserisci gli ingredienti disponibili per generare istantaneamente ricette passo passo.",
      "guide_cooking_key": "Tasto [K]",
      "guide_shopping_title": "Lista della Spesa",
      "guide_shopping_desc": "Gestisci la spesa con facilit\xE0 grazie alla Modalit\xE0 Supermercato a schermo intero.",
      "guide_shopping_key": "Tasto [E]",
      "guide_sport_title": "Sport & Movimento",
      "guide_sport_desc": "Attiva dolcemente il corpo con esercizi da 1 minuto adatti al tuo livello di energia (Spoons).",
      "guide_sport_key": "Tasto [O]",
      "guide_report_title": "Statistiche & Risultati",
      "guide_report_desc": "Traccia i progressi quotidiani, visualizza i grafici settimanali ed esporta riepiloghi in immagine.",
      "guide_report_key": "Tasto [R]",
      "guide_sample_title": "Gestisci Attivit\xE0 di Esempio",
      "guide_sample_desc": "Ricarica le routine domestiche tipo, personalizzale o svuota completamente la lavagna.",
      "guide_sample_key": "Modelli",
      "guide_shortcuts_title": "Altre Scorciatoie",
      "guide_shortcuts_desc": "\u2022 <b>Tasto [U]</b>: Annulla ultima azione<br>\u2022 <b>Tasto [A]</b>: Aggiungi appuntamento<br>\u2022 <b>Tasto [B]</b>: Apri Slancio & Focus<br>\u2022 <b>Tasto [I]</b>: Ispirazione quotidiana<br>\u2022 <b>Tasto [H]</b>: Apri/chiudi questa guida<br>\u2022 <b>Tasto [Esc]</b>: Chiudi tutte le finestre",
      "guide_shortcuts_key": "Multiple",
      "guide_footer_local": "Flow Suite \xB7 Local-First",
      "guide_footer_privacy": "Privacy & Note Legali",
      "pause_panel_title": "Pausa Sensoriale & Recupero",
      "pause_breath_title": "Respirazione 4-4-4",
      "pause_breath_sub": "Calma il sistema nervoso in 60s",
      "pause_grounding_title": "Radicamento 5-4-3-2-1",
      "pause_grounding_sub": "Ti riporta subito al momento presente",
      "pause_stretch_title": "Stretching Corpo & Collo",
      "pause_stretch_sub": "2 minuti di allungamento dolce",
      "pause_nap_title": "Power Nap (20 Min) \u{1F634}",
      "pause_nap_sub": "Riposo breve con pioggia leggera",
      "settings_dropdown_title": "Impostazioni",
      "settings_btn_fullscreen": "Schermo intero \u2197",
      "settings_section_theme": "\u{1F3A8} Tema Colore (16 Temi)",
      "settings_section_lang": "\u{1F310} Scegli Lingua",
      "settings_p2p_sync": "Sincronizzazione Live",
      "settings_privacy_btn": "Privacy",
      "audio_center_title": "Centro Audio",
      "audio_center_subtitle": "Focus, Beat & Mix Studio",
      "audio_tab_ambient": "Suoni della Natura",
      "audio_tab_beats": "Beat & Lo-Fi",
      "audio_tab_dj": "Mix Studio",
      "cal_mo": "Lu",
      "cal_di": "Ma",
      "cal_mi": "Me",
      "cal_do": "Gi",
      "cal_fr": "Ve",
      "cal_sa": "Sa",
      "cal_so": "Do",
      "month_jan": "Gennaio",
      "month_feb": "Febbraio",
      "month_mar": "Marzo",
      "month_apr": "Aprile",
      "month_may": "Maggio",
      "month_jun": "Giugno",
      "month_jul": "Luglio",
      "month_aug": "Agosto",
      "month_sep": "Settembre",
      "month_oct": "Ottobre",
      "month_nov": "Novembre",
      "month_dec": "Dicembre",
      "mobile_nav_tools": "Strumenti",
      "mobile_nav_planner": "Pianificatore",
      "mobile_nav_focus": "Focus",
      "mobile_nav_audio": "Audio",
      "mobile_nav_game": "Gioco",
      "mobile_fab_title": "Aggiungi nuova attivit\xE0",
      "mobile_quick_title": "Menu Rapido & Opzioni",
      "mobile_quick_desc": "Tutte le funzioni a portata di mano",
      "mobile_quick_sync_title": "Live-Sync",
      "mobile_quick_sync_sub": "Trasferimento QR & P2P",
      "mobile_quick_stats_title": "Statistiche",
      "mobile_quick_stats_sub": "Report settimanale",
      "mobile_quick_theme_title": "Tema Colore",
      "mobile_quick_theme_sub": "16 Temi",
      "mobile_quick_lang_title": "Lingua",
      "mobile_quick_lang_sub": "6 Lingue",
      "mobile_quick_whatnow_title": "E adesso?",
      "mobile_quick_whatnow_sub": "Azione spontanea",
      "mobile_quick_break_title": "Pausa Sensoriale",
      "mobile_quick_break_sub": "Respirazione & Calma",
      "mobile_quick_save_title": "Salva piano",
      "mobile_quick_save_sub": "Esportazione JSON",
      "mobile_quick_settings_title": "Impostazioni",
      "mobile_quick_settings_sub": "Opzioni & GDPR",
      "mobile_tools_section": "\u{1F6E0}\uFE0F Stile di vita & Produttivit\xE0",
      "mobile_tools_sync_badge": "1-Clic",
      "mobile_tools_sync_title": "Live-Sync & QR",
      "mobile_tools_sync_sub": "PC \u2194 Smartphone",
      "mobile_tools_opt_badge": "Opzioni",
      "mobile_tools_opt_title": "Design & Lingua",
      "mobile_tools_opt_sub": "Temi & Backup",
      "mobile_tools_shop_badge": "Spesa",
      "mobile_tools_shop_title": "Lista della Spesa",
      "mobile_tools_shop_sub": "Categorie & Quantit\xE0",
      "mobile_tools_cook_badge": "Cucina",
      "mobile_tools_cook_title": "Ricette & Prep",
      "mobile_tools_cook_sub": "Passo dopo Passo",
      "mobile_tools_sport_badge": "Attivo",
      "mobile_tools_sport_title": "Pausa Movimento",
      "mobile_tools_sport_sub": "Micro-Allenamenti",
      "mobile_tools_alarm_badge": "Sveglia",
      "mobile_tools_alarm_title": "Sveglie & Timer",
      "mobile_tools_alarm_sub": "Promemoria Precisi",
      "mobile_tools_stats_badge": "Stats",
      "mobile_tools_stats_title": "Produttivit\xE0",
      "mobile_tools_stats_sub": "Report Settimanale",
      "mobile_tools_whatnow_badge": "Slancio",
      "mobile_tools_whatnow_title": "E adesso?",
      "mobile_tools_whatnow_sub": "Suggerimento Energetico",
      "mobile_audio_synth_title": "Beat Sintetizzatore"
    },
    "es": {
      "weekly": "Hogar",
      "daily": "Hoy",
      "todo": "Por hacer",
      "done": "Hecho",
      "termine": "Citas",
      "occasionally": "Ocasional",
      "notes": "Notas",
      "notesPlaceholder": "Escribe aqu\xED tus notas, ideas y recordatorios r\xE1pidos...",
      "add": "A\xF1adir tarea",
      "add_task": "A\xF1adir tarea",
      "add_column": "A\xF1adir columna",
      "column_name": "T\xEDtulo de columna",
      "delete_column": "Eliminar columna",
      "rename_column": "Renombrar columna",
      "choose_icon": "Elegir icono",
      "card_color": "Color de tarjeta",
      "confirm_delete_column": "\xBFEst\xE1s seguro de que deseas eliminar esta columna y todas sus tareas?",
      "new_task_placeholder": "\xBFQu\xE9 hay que hacer?",
      "report": "Estad\xEDsticas",
      "report_title": "Productividad y Estad\xEDsticas",
      "report_today": "Hoy",
      "report_week": "Semana",
      "report_month": "Mes",
      "report_open_full": "Abrir Panel Completo \u2197",
      "open_dashboard": "Abrir Panel Completo \u2197",
      "dashboard_title": "Panel Anal\xEDtico y de Progreso",
      "focus_time": "Tiempo de Concentraci\xF3n",
      "peak_hours": "Horas M\xE1s Productivas",
      "category_balance": "Equilibrio de Categor\xEDas",
      "search_history": "Buscar tareas completadas...",
      "morning_peak": "Ma\xF1ana (06:00 - 12:00)",
      "afternoon_peak": "Tarde (12:00 - 18:00)",
      "evening_peak": "Noche (18:00 - 24:00)",
      "night_peak": "Madrugada (00:00 - 06:00)",
      "export_image": "Guardar como imagen (PNG)",
      "copy_report": "Copiar resumen",
      "settings": "Opciones",
      "tab_general": "General",
      "tab_history": "Historial de versiones",
      "tab_impressum": "Aviso Legal (\xA7 5 DDG)",
      "tab_privacy": "Privacidad y RGPD",
      "tab_licenses": "Licencias y Descargo",
      "history_subtitle": "L\xEDnea de tiempo visual y avances en el desarrollo de Flow",
      "settings_modal_title": "Ajustes y Cumplimiento Legal",
      "settings_modal_subtitle": "Configuraci\xF3n, pol\xEDtica de privacidad y licencias de c\xF3digo abierto",
      "setting_default_workspace": "\xC1rea de trabajo por defecto al iniciar",
      "setting_default_timer": "Duraci\xF3n de concentraci\xF3n por defecto",
      "setting_clear_data": "Borrar todos los datos locales",
      "setting_clear_data_confirm": "\xBFEst\xE1s seguro de que deseas borrar definitivamente todos los datos locales y restablecer la app?",
      "cmd_search_placeholder": "Escribe un comando o busca tareas... (Ctrl+K)",
      "cmd_actions": "Acciones r\xE1pidas",
      "cmd_tasks": "Tareas coincidentes",
      "cmd_no_results": "No se encontraron comandos o tareas",
      "cmd_shortcut_hint": "Usa \u2191 \u2193 para navegar, Enter para seleccionar, Esc para cerrar",
      "recurrence_label": "Repetir tarea",
      "recurrence_none": "Sin repetici\xF3n",
      "recurrence_daily": "Todos los d\xEDas",
      "recurrence_weekdays": "D\xEDas laborables (Lun-Vie)",
      "recurrence_weekly": "Semanalmente",
      "whatnow": "\xBFY ahora qu\xE9?",
      "minimal_mode": "Modo Enfoque",
      "standard_mode": "Vista Est\xE1ndar",
      "pause_btn": "Pausa",
      "give_feedback": "Opini\xF3n",
      "feedback": "Opini\xF3n",
      "feedback_desc": "\xBFQu\xE9 te parece Flow? \xA1Tus sugerencias nos ayudan a seguir mejorando!",
      "feedback_placeholder": "Comparte tus pensamientos, ideas o propuestas...",
      "feedback_greet": "\xA1Hola! \u{1F44B}",
      "feedback_prompt": "\xBFTienes comentarios, cr\xEDticas o ideas para Flow? \xA1Escr\xEDbenos un mensaje!",
      "feedback_alt": "o env\xEDa un correo a support@flow-planner.app",
      "feedback_send_tooltip": "Enviar comentarios directamente al creador",
      "send": "Enviar",
      "login_btn": "Iniciar sesi\xF3n",
      "sync_title": "Sincronizar Dispositivos",
      "sync_desc": "Guarda tu plan y \xFAsalo f\xE1cilmente en todos tus dispositivos.",
      "login": "Iniciar sesi\xF3n",
      "register": "Registrarse",
      "title_undo": "Deshacer",
      "title_open": "Abrir plan",
      "title_save": "Guardar plan",
      "title_reset": "Restablecer todo",
      "title_theme": "Tema de Color",
      "options_title": "Opciones y Ajustes",
      "theme_select": "Tema",
      "lang_select": "Idioma",
      "workspace_private": "Personal",
      "workspace_work": "Trabajo",
      "work_focus": "Enfoque Hoy",
      "work_in_progress": "En Curso",
      "work_waiting": "En Espera",
      "work_backlog": "Pendientes",
      "dock_sounds": "Sonidos",
      "dock_music": "M\xFAsica",
      "dock_shop": "Compras",
      "dock_cook": "Cocina",
      "dock_scripts": "Guiones",
      "dock_alarm": "Alarma",
      "dock_weather": "Clima",
      "dock_news": "Noticias",
      "dock_spark": "Chispa",
      "dock_inspire": "Inspiraci\xF3n",
      "dock_clarity": "Claridad",
      "dock_impulse": "Impulso",
      "dock_audio": "Audio",
      "dock_daily": "Cotidiano",
      "dock_beats": "Ritmos",
      "dock_workout": "Entrenamiento",
      "dock_matrix": "Matriz",
      "dock_gamification": "Arcade",
      "weather_title": "Clima Local",
      "news_title": "Daily Digest",
      "clarity_title": "Claridad y Control de Impulsos",
      "clarity_subtitle": "Supera los antojos, frena impulsos no deseados y fortalece el autocontrol",
      "sounds": "Sonidos",
      "soundscape_title": "Sonidos de la Naturaleza y Enfoque",
      "music": "M\xFAsica",
      "music_player": "Reproductor de Audio",
      "custom_tracks": "Reproducir tus propios archivos de audio",
      "no_tracks": "A\xFAn no hay canciones cargadas",
      "shopping": "Lista de la Compra",
      "cooking": "Cocina Inteligente",
      "scripts": "Guiones Sociales",
      "alarm": "Alarmas y Recordatorios",
      "spark": "Chispa R\xE1pida",
      "inspire": "Inspiraci\xF3n",
      "inspire_title": "Inspiraci\xF3n del D\xEDa",
      "zen_title": "Enfoque Zen",
      "next_rec": "Tarea Recomendada",
      "start_focus": "Iniciar Enfoque",
      "other_suggestion": "Otra Sugerencia",
      "open_steps": "Gu\xEDa Paso a Paso",
      "completed": "\xA1Completado!",
      "complete_btn": "Hecho",
      "complete": "Hecho",
      "complete_task": "Tarea completada",
      "timer_title": "Temporizador de Enfoque",
      "start": "Iniciar",
      "stop": "Detener",
      "steps_btn": "Pasos",
      "steps_tab": "Pasos",
      "pick_desc": "\xBFTe sientes bloqueado? Deja que Flow elija la mejor tarea seg\xFAn tu prioridad actual:",
      "next_suggestion": "\u{1F3B2} Siguiente Tarea",
      "steps_desc": "Selecciona una tarea para ver el desglose detallado paso a paso:",
      "start_timer": "Iniciar Temporizador",
      "dropdown_placeholder": "-- Selecciona una tarea de tu tablero --",
      "boost_btn": "Chispa",
      "boost_desc": "\xBFBloqueado? Prueba esta microacci\xF3n de 30 segundos para recuperar el impulso:",
      "boost_placeholder": "\xA1Haz clic abajo para recibir un impulso inmediato!",
      "boost_new": "Nuevo Impulso \u{1F504}",
      "dopamine_kick_title": "\xBFListo para un toque r\xE1pido de dopamina? \u26A1",
      "dopamine_kick_start": "\u26A1 \xA1Dame una acci\xF3n!",
      "dopamine_kick_done": "\xA1Hecho! \u{1F389} (+25 XP)",
      "dopamine_kick_other": "Otra Acci\xF3n \u{1F504}",
      "dopamine_kick_completed_toast": "\xA1Acci\xF3n completada! Excelente comienzo.",
      "dopamine_kick_success_log": "\u26A1 Impulso de dopamina completado:",
      "whatnow_kickstart": "\u{1FA9C} Impulso",
      "cook_add_ingredient": "A\xF1adir",
      "cook_add_ingredient_placeholder": "Introduce un ingrediente (ej. Pasta, Huevos)...",
      "cook_suggest": "Sugerir Receta \u{1F373}",
      "cook_pantry_empty": "Tu despensa est\xE1 vac\xEDa. \xA1A\xF1ade ingredientes arriba!",
      "cook_suggestion_title": "Propuesta de Receta",
      "cook_steps": "Pasos de Preparaci\xF3n",
      "cook_ingredients": "Tus Ingredientes",
      "cook_quick_staples": "Ingredientes B\xE1sicos",
      "cook_recipe_ingredients": "Ingredientes Necesarios",
      "cook_placeholder_empty": "A\xF1ade ingredientes para recibir recetas a medida.",
      "cook_time": "Tiempo",
      "cook_tags": "Etiquetas",
      "cook_add_to_shop": "A\xF1adir ingredientes faltantes a la lista de compras \u{1F6D2}",
      "shop_add_placeholder": "A\xF1adir art\xEDculo (ej. 2x leche de avena, pan)...",
      "shop_add_btn": "A\xF1adir",
      "shop_history": "Historial",
      "shop_clear": "Vaciar",
      "shop_recent_bought": "Comprado recientemente",
      "shop_empty": "\xA1Tu lista de compras est\xE1 limpia!",
      "supermarket_mode_btn": "Modo Supermercado \u{1F6D2}",
      "supermarket_title": "Modo Supermercado \u{1F6D2}",
      "sample_banner_title": "\u{1F4A1} Estas son tareas de ejemplo para inspirarte.",
      "sample_banner_desc": "Puedes personalizarlas, quedarte con las que desees o vaciar el tablero para empezar de cero.",
      "sample_keep_all": "Conservar todo \u2713",
      "sample_customize_btn": "Elegir y Personalizar \u270F\uFE0F",
      "sample_clear_btn": "Vaciar tablero \u{1F5D1}\uFE0F",
      "sample_modal_title": "Gestionar Tareas de Ejemplo",
      "sample_modal_subtitle": "Elige qu\xE9 plantillas cargar o vac\xEDa completamente tu tablero",
      "sample_cat_daily": "Rutina Diaria",
      "sample_cat_weekly": "Hogar y Limpieza",
      "sample_cat_occasionally": "Mantenimiento Peri\xF3dico",
      "sample_select_all": "Seleccionar todo",
      "sample_deselect_all": "Deseleccionar todo",
      "sample_apply_btn": "Cargar tareas seleccionadas",
      "sample_toast_loaded": "\xA1Plantillas seleccionadas cargadas con \xE9xito!",
      "sample_toast_cleared": "\xA1Tablero vaciado por completo!",
      "toast_no_undo": "No hay nada que deshacer.",
      "toast_undo_applied": "\xDAltima acci\xF3n deshecha.",
      "toast_reset_success": "Tu plan se ha restablecido a los valores predeterminados.",
      "toast_import_success": "\xA1Plan importado con \xE9xito!",
      "toast_import_error": "Error al leer el archivo de respaldo.",
      "toast_task_deleted": "Tarea eliminada.",
      "toast_task_restored": "Tarea restaurada.",
      "toast_appointment_name_error": "Por favor, introduce un nombre para la cita.",
      "toast_appointment_saved": "\xA1Cita guardada con \xE9xito!",
      "appointment_new_btn": "Nueva Cita",
      "appointment_form_title": "A\xF1adir Cita",
      "appointment_form_name_placeholder": "\xBFDe qu\xE9 se trata? (ej. Dentista)",
      "appointment_form_date_label": "Fecha",
      "appointment_form_time_label": "Hora",
      "appointment_form_save_btn": "Guardar",
      "appointment_form_cancel_btn": "Cancelar",
      "sound_rain": "Lluvia Suave",
      "sound_forest": "Bosque Profundo",
      "sound_waves": "Olas del Mar",
      "sound_fire": "Fuego de Chimenea",
      "sound_whitenoise": "Ruido Blanco",
      "sound_pinknoise": "Ruido Rosa",
      "sound_brownnoise": "Ruido Marr\xF3n",
      "sound_binaural_alpha": "Ondas Alfa (Enfoque)",
      "sound_binaural_theta": "Ondas Theta (Calma)",
      "sound_cafe": "Caf\xE9 Acogedor",
      "sound_lofi": "Acordes Lo-Fi",
      "sound_space": "Ambiente C\xF3smico",
      "sound_stream": "Arroyo de Monta\xF1a",
      "sound_night": "Grillos Nocturnos",
      "sound_train": "Tren Nocturno",
      "sound_wind": "Viento Suave",
      "sound_underwater": "Inmersi\xF3n Submarina",
      "sound_fan": "Ventilador",
      "sound_clock": "Reloj Suave",
      "sound_monastery": "Cuencos Tibetanos",
      "sound_lofi_sunshine": "Lofi Sunshine",
      "sound_bossa_nova": "Bossa Nova",
      "sound_jazz_piano": "Jazz Voicings",
      "sound_rhodes": "Fender Rhodes",
      "sound_hypnotic_riff": "Riff Hipn\xF3tico",
      "sound_techno": "Techno 128",
      "sound_dnb": "Drum & Bass",
      "sound_afrobeats": "Afrobeats",
      "sound_swing": "Swing & Jazz",
      "sound_boombap": "Boom-Bap",
      "guide_title": "Gu\xEDa de Inicio R\xE1pido de Flow",
      "guide_desc": "Haz clic en un elemento para abrirlo directamente. \xA1Usa los atajos de teclado fuera de los campos de texto!",
      "guide_focus_mode_title": "Modo Enfoque",
      "guide_focus_mode_desc": "Oculta las distracciones para mostrar solo tu tarea prioritaria en una vista Zen tranquila.",
      "guide_focus_mode_key": "Tecla [F]",
      "guide_timer_title": "Temporizador de Enfoque",
      "guide_timer_desc": "Inicia sesiones de trabajo con mensajes de voz motivacionales peri\xF3dicos y m\xFAsica ambiental.",
      "guide_timer_key_start": "Iniciar/Pausa [T]",
      "guide_timer_key_stop": "Detener [S]",
      "guide_whatnow_title": "\xBFY ahora qu\xE9?",
      "guide_whatnow_desc": "Reduce la fatiga mental proponiendo una sola tarea adecuada seg\xFAn tu prioridad actual.",
      "guide_whatnow_key": "Tecla [W]",
      "guide_break_title": "Pausa Sensorial y Recuperaci\xF3n",
      "guide_break_desc": "Alivia la sobrecarga sensorial con respiraci\xF3n 4-4-4, anclaje 5-4-3-2-1 o una siesta reparadora.",
      "guide_break_key": "Tecla [P]",
      "guide_cooking_title": "Cocina y Despensa",
      "guide_cooking_desc": "Introduce los ingredientes disponibles para generar deliciosas recetas paso a paso al instante.",
      "guide_cooking_key": "Tecla [K]",
      "guide_shopping_title": "Lista de Compras",
      "guide_shopping_desc": "Organiza tus compras f\xE1cilmente gracias al Modo Supermercado a pantalla completa.",
      "guide_shopping_key": "Tecla [E]",
      "guide_sport_title": "Deporte y Movimiento",
      "guide_sport_desc": "Activa tu cuerpo suavemente con ejercicios de 1 minuto adaptados a tu energ\xEDa (Spoons).",
      "guide_sport_key": "Tecla [O]",
      "guide_report_title": "Estad\xEDsticas y Logros",
      "guide_report_desc": "Sigue tu actividad diaria, visualiza curvas semanales y exporta informes en imagen.",
      "guide_report_key": "Tecla [R]",
      "guide_sample_title": "Gestionar Tareas de Ejemplo",
      "guide_sample_desc": "Recarga rutinas modelo para el hogar, ad\xE1ptalas o vac\xEDa tu tablero cuando quieras.",
      "guide_sample_key": "Plantillas",
      "guide_shortcuts_title": "M\xE1s Atajos",
      "guide_shortcuts_desc": "\u2022 <b>Tecla [U]</b>: Deshacer \xFAltima acci\xF3n<br>\u2022 <b>Tecla [A]</b>: A\xF1adir cita<br>\u2022 <b>Tecla [B]</b>: Abrir Impulso y Enfoque<br>\u2022 <b>Tecla [I]</b>: Inspiraci\xF3n diaria<br>\u2022 <b>Tecla [H]</b>: Abrir/cerrar esta gu\xEDa<br>\u2022 <b>Tecla [Esc]</b>: Cerrar ventanas",
      "guide_shortcuts_key": "M\xFAltiples",
      "guide_footer_local": "Flow Suite \xB7 Local-First",
      "guide_footer_privacy": "Privacidad y Aviso Legal",
      "pause_panel_title": "Pausa Sensorial y Recuperaci\xF3n",
      "pause_breath_title": "Respiraci\xF3n 4-4-4",
      "pause_breath_sub": "Calma el sistema nervioso en 60s",
      "pause_grounding_title": "Anclaje 5-4-3-2-1",
      "pause_grounding_sub": "Te devuelve al momento presente",
      "pause_stretch_title": "Estiramiento de Cuerpo y Cuello",
      "pause_stretch_sub": "2 minutos de estiramiento suave",
      "pause_nap_title": "Power Nap (20 Min) \u{1F634}",
      "pause_nap_sub": "Descanso breve con lluvia suave",
      "settings_dropdown_title": "Ajustes",
      "settings_btn_fullscreen": "Pantalla completa \u2197",
      "settings_section_theme": "\u{1F3A8} Tema de Color (16 Temas)",
      "settings_section_lang": "\u{1F310} Elegir Idioma",
      "settings_p2p_sync": "Sincronizaci\xF3n M\xF3vil",
      "settings_privacy_btn": "Privacidad",
      "audio_center_title": "Centro de Audio",
      "audio_center_subtitle": "Enfoque, Ritmos y Estudio Mix",
      "audio_tab_ambient": "Sonidos de la Naturaleza",
      "audio_tab_beats": "Ritmos y Lo-Fi",
      "audio_tab_dj": "Estudio Mix",
      "cal_mo": "Lu",
      "cal_di": "Ma",
      "cal_mi": "Mi",
      "cal_do": "Ju",
      "cal_fr": "Vi",
      "cal_sa": "S\xE1",
      "cal_so": "Do",
      "month_jan": "Enero",
      "month_feb": "Febrero",
      "month_mar": "Marzo",
      "month_apr": "Abril",
      "month_may": "Mayo",
      "month_jun": "Junio",
      "month_jul": "Julio",
      "month_aug": "Agosto",
      "month_sep": "Septiembre",
      "month_oct": "Octubre",
      "month_nov": "Noviembre",
      "month_dec": "Diciembre",
      "mobile_nav_tools": "Herramientas",
      "mobile_nav_planner": "Planificador",
      "mobile_nav_focus": "Enfoque",
      "mobile_nav_audio": "Audio",
      "mobile_nav_game": "Juego",
      "mobile_fab_title": "A\xF1adir nueva tarea",
      "mobile_quick_title": "Men\xFA R\xE1pido y Opciones",
      "mobile_quick_desc": "Todas las funciones a mano",
      "mobile_quick_sync_title": "Sincro Live",
      "mobile_quick_sync_sub": "Transferencia QR y P2P",
      "mobile_quick_stats_title": "Estad\xEDsticas",
      "mobile_quick_stats_sub": "Resumen semanal",
      "mobile_quick_theme_title": "Tema de Color",
      "mobile_quick_theme_sub": "16 Temas",
      "mobile_quick_lang_title": "Idioma",
      "mobile_quick_lang_sub": "6 Idiomas",
      "mobile_quick_whatnow_title": "\xBFY ahora qu\xE9?",
      "mobile_quick_whatnow_sub": "Acci\xF3n espont\xE1nea",
      "mobile_quick_break_title": "Pausa Sensorial",
      "mobile_quick_break_sub": "Respiraci\xF3n y Calma",
      "mobile_quick_save_title": "Guardar plan",
      "mobile_quick_save_sub": "Copia JSON",
      "mobile_quick_settings_title": "Ajustes",
      "mobile_quick_settings_sub": "Ajustes y RGPD",
      "mobile_tools_section": "\u{1F6E0}\uFE0F Estilo de vida y Productividad",
      "mobile_tools_sync_badge": "1-Clic",
      "mobile_tools_sync_title": "Sincro Live y QR",
      "mobile_tools_sync_sub": "PC \u2194 M\xF3vil",
      "mobile_tools_opt_badge": "Opciones",
      "mobile_tools_opt_title": "Dise\xF1o e Idioma",
      "mobile_tools_opt_sub": "Temas y Copia",
      "mobile_tools_shop_badge": "Compras",
      "mobile_tools_shop_title": "Lista de Compras",
      "mobile_tools_shop_sub": "Categor\xEDas y Cantidades",
      "mobile_tools_cook_badge": "Cocina",
      "mobile_tools_cook_title": "Recetas y Prep",
      "mobile_tools_cook_sub": "Paso a Paso",
      "mobile_tools_sport_badge": "Activo",
      "mobile_tools_sport_title": "Pausa de Movimiento",
      "mobile_tools_sport_sub": "Micro-Ejercicios",
      "mobile_tools_alarm_badge": "Alarma",
      "mobile_tools_alarm_title": "Alarmas y Temporizadores",
      "mobile_tools_alarm_sub": "Recordatorios Precisos",
      "mobile_tools_stats_badge": "Stats",
      "mobile_tools_stats_title": "Productividad",
      "mobile_tools_stats_sub": "Informe Semanal",
      "mobile_tools_whatnow_badge": "Impulso",
      "mobile_tools_whatnow_title": "\xBFY ahora qu\xE9?",
      "mobile_tools_whatnow_sub": "Sugerencia por Energ\xEDa",
      "mobile_audio_synth_title": "Ritmos de Sintetizador"
    },
    "el": {
      "weekly": "\u03A3\u03C0\u03AF\u03C4\u03B9",
      "daily": "\u03A3\u03AE\u03BC\u03B5\u03C1\u03B1",
      "todo": "\u0395\u03BA\u03BA\u03C1\u03B5\u03BC\u03CC\u03C4\u03B7\u03C4\u03B5\u03C2",
      "done": "\u039F\u03BB\u03BF\u03BA\u03BB\u03B7\u03C1\u03C9\u03BC\u03AD\u03BD\u03B1",
      "termine": "\u03A1\u03B1\u03BD\u03C4\u03B5\u03B2\u03BF\u03CD",
      "occasionally": "\u03A0\u03B5\u03C1\u03B9\u03BF\u03B4\u03B9\u03BA\u03AC",
      "notes": "\u03A3\u03B7\u03BC\u03B5\u03B9\u03CE\u03C3\u03B5\u03B9\u03C2",
      "notesPlaceholder": "\u0393\u03C1\u03AC\u03C8\u03B5 \u03B5\u03B4\u03CE \u03C4\u03B9\u03C2 \u03C3\u03BA\u03AD\u03C8\u03B5\u03B9\u03C2, \u03B9\u03B4\u03AD\u03B5\u03C2 \u03BA\u03B1\u03B9 \u03C5\u03C0\u03B5\u03BD\u03B8\u03C5\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2 \u03C3\u03BF\u03C5...",
      "add": "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1\u03C2",
      "add_task": "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1\u03C2",
      "add_column": "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u03C3\u03C4\u03AE\u03BB\u03B7\u03C2",
      "column_name": "\u03A4\u03AF\u03C4\u03BB\u03BF\u03C2 \u03C3\u03C4\u03AE\u03BB\u03B7\u03C2",
      "delete_column": "\u0394\u03B9\u03B1\u03B3\u03C1\u03B1\u03C6\u03AE \u03C3\u03C4\u03AE\u03BB\u03B7\u03C2",
      "rename_column": "\u039C\u03B5\u03C4\u03BF\u03BD\u03BF\u03BC\u03B1\u03C3\u03AF\u03B1 \u03C3\u03C4\u03AE\u03BB\u03B7\u03C2",
      "choose_icon": "\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE \u03B5\u03B9\u03BA\u03BF\u03BD\u03B9\u03B4\u03AF\u03BF\u03C5",
      "card_color": "\u03A7\u03C1\u03CE\u03BC\u03B1 \u03BA\u03AC\u03C1\u03C4\u03B1\u03C2",
      "confirm_delete_column": "\u0395\u03AF\u03C3\u03B1\u03B9 \u03C3\u03AF\u03B3\u03BF\u03C5\u03C1\u03BF\u03C2 \u03CC\u03C4\u03B9 \u03B8\u03AD\u03BB\u03B5\u03B9\u03C2 \u03BD\u03B1 \u03B4\u03B9\u03B1\u03B3\u03C1\u03AC\u03C8\u03B5\u03B9\u03C2 \u03B1\u03C5\u03C4\u03AE \u03C4\u03B7 \u03C3\u03C4\u03AE\u03BB\u03B7 \u03BA\u03B1\u03B9 \u03CC\u03BB\u03B5\u03C2 \u03C4\u03B9\u03C2 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B5\u03C2 \u03C4\u03B7\u03C2;",
      "new_task_placeholder": "\u03A4\u03B9 \u03C7\u03C1\u03B5\u03B9\u03AC\u03B6\u03B5\u03C4\u03B1\u03B9 \u03BD\u03B1 \u03B3\u03AF\u03BD\u03B5\u03B9;",
      "report": "\u03A3\u03C4\u03B1\u03C4\u03B9\u03C3\u03C4\u03B9\u03BA\u03AC",
      "report_title": "\u03A0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03B9\u03BA\u03CC\u03C4\u03B7\u03C4\u03B1 & \u03A3\u03C4\u03B1\u03C4\u03B9\u03C3\u03C4\u03B9\u03BA\u03AC",
      "report_today": "\u03A3\u03AE\u03BC\u03B5\u03C1\u03B1",
      "report_week": "\u0395\u03B2\u03B4\u03BF\u03BC\u03AC\u03B4\u03B1",
      "report_month": "\u039C\u03AE\u03BD\u03B1\u03C2",
      "report_open_full": "\u0386\u03BD\u03BF\u03B9\u03B3\u03BC\u03B1 \u03A0\u03BB\u03AE\u03C1\u03BF\u03C5\u03C2 \u03A0\u03AF\u03BD\u03B1\u03BA\u03B1 \u2197",
      "open_dashboard": "\u0386\u03BD\u03BF\u03B9\u03B3\u03BC\u03B1 \u03A0\u03BB\u03AE\u03C1\u03BF\u03C5\u03C2 \u03A0\u03AF\u03BD\u03B1\u03BA\u03B1 \u2197",
      "dashboard_title": "\u03A0\u03AF\u03BD\u03B1\u03BA\u03B1\u03C2 \u0391\u03BD\u03B1\u03BB\u03CD\u03C3\u03B5\u03C9\u03BD & \u03A0\u03C1\u03BF\u03CC\u03B4\u03BF\u03C5",
      "focus_time": "\u03A7\u03C1\u03CC\u03BD\u03BF\u03C2 \u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7\u03C2",
      "peak_hours": "\u038F\u03C1\u03B5\u03C2 \u039A\u03BF\u03C1\u03C5\u03C6\u03B1\u03AF\u03B1\u03C2 \u0391\u03C0\u03CC\u03B4\u03BF\u03C3\u03B7\u03C2",
      "category_balance": "\u0399\u03C3\u03BF\u03C1\u03C1\u03BF\u03C0\u03AF\u03B1 \u039A\u03B1\u03C4\u03B7\u03B3\u03BF\u03C1\u03B9\u03CE\u03BD",
      "search_history": "\u0391\u03BD\u03B1\u03B6\u03AE\u03C4\u03B7\u03C3\u03B7 \u03BF\u03BB\u03BF\u03BA\u03BB\u03B7\u03C1\u03C9\u03BC\u03AD\u03BD\u03C9\u03BD \u03B5\u03C1\u03B3\u03B1\u03C3\u03B9\u03CE\u03BD...",
      "morning_peak": "\u03A0\u03C1\u03C9\u03AF (06:00 - 12:00)",
      "afternoon_peak": "\u0391\u03C0\u03CC\u03B3\u03B5\u03C5\u03BC\u03B1 (12:00 - 18:00)",
      "evening_peak": "\u0392\u03C1\u03AC\u03B4\u03C5 (18:00 - 24:00)",
      "night_peak": "\u039D\u03CD\u03C7\u03C4\u03B1 (00:00 - 06:00)",
      "export_image": "\u0391\u03C0\u03BF\u03B8\u03AE\u03BA\u03B5\u03C5\u03C3\u03B7 \u03C9\u03C2 \u03B5\u03B9\u03BA\u03CC\u03BD\u03B1 (PNG)",
      "copy_report": "\u0391\u03BD\u03C4\u03B9\u03B3\u03C1\u03B1\u03C6\u03AE \u03C3\u03CD\u03BD\u03BF\u03C8\u03B7\u03C2",
      "settings": "\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2",
      "tab_general": "\u0393\u03B5\u03BD\u03B9\u03BA\u03AC",
      "tab_history": "\u0399\u03C3\u03C4\u03BF\u03C1\u03B9\u03BA\u03CC \u03B5\u03BA\u03B4\u03CC\u03C3\u03B5\u03C9\u03BD",
      "tab_impressum": "\u039D\u03BF\u03BC\u03B9\u03BA\u03AE \u03A3\u03B7\u03BC\u03B5\u03AF\u03C9\u03C3\u03B7 (\xA7 5 DDG)",
      "tab_privacy": "\u03A0\u03C1\u03BF\u03C3\u03C4\u03B1\u03C3\u03AF\u03B1 \u0394\u03B5\u03B4\u03BF\u03BC\u03AD\u03BD\u03C9\u03BD & GDPR",
      "tab_licenses": "\u0386\u03B4\u03B5\u03B9\u03B5\u03C2 \u03A7\u03C1\u03AE\u03C3\u03B7\u03C2 & \u0391\u03C0\u03BF\u03C0\u03BF\u03AF\u03B7\u03C3\u03B7",
      "history_subtitle": "\u039F\u03C0\u03C4\u03B9\u03BA\u03CC \u03C7\u03C1\u03BF\u03BD\u03BF\u03BB\u03CC\u03B3\u03B9\u03BF \u03BA\u03B1\u03B9 \u03BF\u03C1\u03CC\u03C3\u03B7\u03BC\u03B1 \u03B1\u03BD\u03AC\u03C0\u03C4\u03C5\u03BE\u03B7\u03C2 \u03C4\u03BF\u03C5 Flow",
      "settings_modal_title": "\u03A1\u03C5\u03B8\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2 & \u039D\u03BF\u03BC\u03B9\u03BA\u03AE \u03A3\u03C5\u03BC\u03BC\u03CC\u03C1\u03C6\u03C9\u03C3\u03B7",
      "settings_modal_subtitle": "\u0394\u03B9\u03B1\u03BC\u03CC\u03C1\u03C6\u03C9\u03C3\u03B7, \u03C0\u03BF\u03BB\u03B9\u03C4\u03B9\u03BA\u03AE \u03B1\u03C0\u03BF\u03C1\u03C1\u03AE\u03C4\u03BF\u03C5 \u03BA\u03B1\u03B9 \u03AC\u03B4\u03B5\u03B9\u03B5\u03C2 \u03B1\u03BD\u03BF\u03B9\u03C7\u03C4\u03BF\u03CD \u03BA\u03CE\u03B4\u03B9\u03BA\u03B1",
      "setting_default_workspace": "\u03A0\u03C1\u03BF\u03B5\u03C0\u03B9\u03BB\u03B5\u03B3\u03BC\u03AD\u03BD\u03BF\u03C2 \u03C7\u03CE\u03C1\u03BF\u03C2 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1\u03C2 \u03BA\u03B1\u03C4\u03AC \u03C4\u03B7\u03BD \u03B5\u03BA\u03BA\u03AF\u03BD\u03B7\u03C3\u03B7",
      "setting_default_timer": "\u03A0\u03C1\u03BF\u03B5\u03C0\u03B9\u03BB\u03B5\u03B3\u03BC\u03AD\u03BD\u03B7 \u03B4\u03B9\u03AC\u03C1\u03BA\u03B5\u03B9\u03B1 \u03B5\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7\u03C2",
      "setting_clear_data": "\u0394\u03B9\u03B1\u03B3\u03C1\u03B1\u03C6\u03AE \u03CC\u03BB\u03C9\u03BD \u03C4\u03C9\u03BD \u03C4\u03BF\u03C0\u03B9\u03BA\u03CE\u03BD \u03B4\u03B5\u03B4\u03BF\u03BC\u03AD\u03BD\u03C9\u03BD",
      "setting_clear_data_confirm": "\u0395\u03AF\u03C3\u03B1\u03B9 \u03C3\u03AF\u03B3\u03BF\u03C5\u03C1\u03BF\u03C2 \u03CC\u03C4\u03B9 \u03B8\u03AD\u03BB\u03B5\u03B9\u03C2 \u03BD\u03B1 \u03B4\u03B9\u03B1\u03B3\u03C1\u03AC\u03C8\u03B5\u03B9\u03C2 \u03BF\u03C1\u03B9\u03C3\u03C4\u03B9\u03BA\u03AC \u03CC\u03BB\u03B1 \u03C4\u03B1 \u03C4\u03BF\u03C0\u03B9\u03BA\u03AC \u03B4\u03B5\u03B4\u03BF\u03BC\u03AD\u03BD\u03B1 \u03BA\u03B1\u03B9 \u03BD\u03B1 \u03B5\u03C0\u03B1\u03BD\u03B1\u03C6\u03AD\u03C1\u03B5\u03B9\u03C2 \u03C4\u03B7\u03BD \u03B5\u03C6\u03B1\u03C1\u03BC\u03BF\u03B3\u03AE;",
      "cmd_search_placeholder": "\u03A0\u03BB\u03B7\u03BA\u03C4\u03C1\u03BF\u03BB\u03CC\u03B3\u03B7\u03C3\u03B5 \u03B5\u03BD\u03C4\u03BF\u03BB\u03AE \u03AE \u03B1\u03BD\u03B1\u03B6\u03AE\u03C4\u03B7\u03C3\u03B5 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B5\u03C2... (Ctrl+K)",
      "cmd_actions": "\u0393\u03C1\u03AE\u03B3\u03BF\u03C1\u03B5\u03C2 \u03B5\u03BD\u03AD\u03C1\u03B3\u03B5\u03B9\u03B5\u03C2",
      "cmd_tasks": "\u0391\u03C0\u03BF\u03C4\u03B5\u03BB\u03AD\u03C3\u03BC\u03B1\u03C4\u03B1 \u03B5\u03C1\u03B3\u03B1\u03C3\u03B9\u03CE\u03BD",
      "cmd_no_results": "\u0394\u03B5\u03BD \u03B2\u03C1\u03AD\u03B8\u03B7\u03BA\u03B1\u03BD \u03B5\u03BD\u03C4\u03BF\u03BB\u03AD\u03C2 \u03AE \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B5\u03C2",
      "cmd_shortcut_hint": "\u03A7\u03C1\u03B7\u03C3\u03B9\u03BC\u03BF\u03C0\u03BF\u03AF\u03B7\u03C3\u03B5 \u2191 \u2193 \u03B3\u03B9\u03B1 \u03C0\u03BB\u03BF\u03AE\u03B3\u03B7\u03C3\u03B7, Enter \u03B3\u03B9\u03B1 \u03B5\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE, Esc \u03B3\u03B9\u03B1 \u03AD\u03BE\u03BF\u03B4\u03BF",
      "recurrence_label": "\u0395\u03C0\u03B1\u03BD\u03AC\u03BB\u03B7\u03C8\u03B7 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1\u03C2",
      "recurrence_none": "\u03A7\u03C9\u03C1\u03AF\u03C2 \u03B5\u03C0\u03B1\u03BD\u03AC\u03BB\u03B7\u03C8\u03B7",
      "recurrence_daily": "\u039A\u03B1\u03B8\u03B7\u03BC\u03B5\u03C1\u03B9\u03BD\u03AC",
      "recurrence_weekdays": "\u039A\u03B1\u03B8\u03B7\u03BC\u03B5\u03C1\u03B9\u03BD\u03AD\u03C2 (\u0394\u03B5\u03C5\u03C4-\u03A0\u03B1\u03C1)",
      "recurrence_weekly": "\u0395\u03B2\u03B4\u03BF\u03BC\u03B1\u03B4\u03B9\u03B1\u03AF\u03B1",
      "whatnow": "\u039A\u03B1\u03B9 \u03C4\u03CE\u03C1\u03B1 \u03C4\u03B9;",
      "minimal_mode": "\u039B\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03AF\u03B1 \u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7\u03C2",
      "standard_mode": "\u0392\u03B1\u03C3\u03B9\u03BA\u03AE \u03A0\u03C1\u03BF\u03B2\u03BF\u03BB\u03AE",
      "pause_btn": "\u03A0\u03B1\u03CD\u03C3\u03B7",
      "give_feedback": "\u03A3\u03C7\u03CC\u03BB\u03B9\u03B1",
      "feedback": "\u03A3\u03C7\u03CC\u03BB\u03B9\u03B1",
      "feedback_desc": "\u03A0\u03CE\u03C2 \u03C3\u03BF\u03C5 \u03C6\u03B1\u03AF\u03BD\u03B5\u03C4\u03B1\u03B9 \u03C4\u03BF Flow; \u039F\u03B9 \u03C0\u03B1\u03C1\u03B1\u03C4\u03B7\u03C1\u03AE\u03C3\u03B5\u03B9\u03C2 \u03C3\u03BF\u03C5 \u03BC\u03B1\u03C2 \u03B2\u03BF\u03B7\u03B8\u03BF\u03CD\u03BD \u03BD\u03B1 \u03C4\u03BF \u03B5\u03BE\u03B5\u03BB\u03AF\u03C3\u03C3\u03BF\u03C5\u03BC\u03B5 \u03B4\u03B9\u03B1\u03C1\u03BA\u03CE\u03C2!",
      "feedback_placeholder": "\u039C\u03BF\u03B9\u03C1\u03AC\u03C3\u03BF\u03C5 \u03C4\u03B9\u03C2 \u03C3\u03BA\u03AD\u03C8\u03B5\u03B9\u03C2, \u03B9\u03B4\u03AD\u03B5\u03C2 \u03AE \u03C0\u03C1\u03BF\u03C4\u03AC\u03C3\u03B5\u03B9\u03C2 \u03C3\u03BF\u03C5...",
      "feedback_greet": "\u0393\u03B5\u03B9\u03B1 \u03C3\u03BF\u03C5! \u{1F44B}",
      "feedback_prompt": "\u0388\u03C7\u03B5\u03B9\u03C2 \u03C3\u03C7\u03CC\u03BB\u03B9\u03B1, \u03C0\u03B1\u03C1\u03B1\u03C4\u03B7\u03C1\u03AE\u03C3\u03B5\u03B9\u03C2 \u03AE \u03BD\u03AD\u03B5\u03C2 \u03B9\u03B4\u03AD\u03B5\u03C2 \u03B3\u03B9\u03B1 \u03C4\u03BF Flow; \u03A3\u03C4\u03B5\u03AF\u03BB\u03B5 \u03BC\u03B1\u03C2 \u03BC\u03AE\u03BD\u03C5\u03BC\u03B1 \u2013 \u03C7\u03B1\u03B9\u03C1\u03CC\u03BC\u03B1\u03C3\u03C4\u03B5 \u03B3\u03B9\u03B1 \u03BA\u03AC\u03B8\u03B5 \u03B5\u03C0\u03B9\u03BA\u03BF\u03B9\u03BD\u03C9\u03BD\u03AF\u03B1!",
      "feedback_alt": "\u03AE \u03C3\u03C4\u03B5\u03AF\u03BB\u03B5 email \u03C3\u03C4\u03BF support@flow-planner.app",
      "feedback_send_tooltip": "\u0391\u03C0\u03BF\u03C3\u03C4\u03BF\u03BB\u03AE \u03C3\u03C7\u03BF\u03BB\u03AF\u03C9\u03BD \u03B1\u03C0\u03B5\u03C5\u03B8\u03B5\u03AF\u03B1\u03C2 \u03C3\u03C4\u03BF\u03BD \u03B4\u03B7\u03BC\u03B9\u03BF\u03C5\u03C1\u03B3\u03CC",
      "send": "\u0391\u03C0\u03BF\u03C3\u03C4\u03BF\u03BB\u03AE",
      "login_btn": "\u03A3\u03CD\u03BD\u03B4\u03B5\u03C3\u03B7",
      "sync_title": "\u03A3\u03C5\u03B3\u03C7\u03C1\u03BF\u03BD\u03B9\u03C3\u03BC\u03CC\u03C2 \u03A3\u03C5\u03C3\u03BA\u03B5\u03C5\u03CE\u03BD",
      "sync_desc": "\u0391\u03C0\u03BF\u03B8\u03AE\u03BA\u03B5\u03C5\u03C3\u03B5 \u03C4\u03BF \u03C0\u03BB\u03AC\u03BD\u03BF \u03C3\u03BF\u03C5 \u03BA\u03B1\u03B9 \u03C7\u03C1\u03B7\u03C3\u03B9\u03BC\u03BF\u03C0\u03BF\u03AF\u03B7\u03C3\u03AD \u03C4\u03BF \u03BC\u03B5 \u03B1\u03C3\u03C6\u03AC\u03BB\u03B5\u03B9\u03B1 \u03C3\u03B5 \u03CC\u03BB\u03B5\u03C2 \u03C4\u03B9\u03C2 \u03C3\u03C5\u03C3\u03BA\u03B5\u03C5\u03AD\u03C2 \u03C3\u03BF\u03C5.",
      "login": "\u03A3\u03CD\u03BD\u03B4\u03B5\u03C3\u03B7",
      "register": "\u0395\u03B3\u03B3\u03C1\u03B1\u03C6\u03AE",
      "title_undo": "\u0391\u03BD\u03B1\u03AF\u03C1\u03B5\u03C3\u03B7",
      "title_open": "\u0386\u03BD\u03BF\u03B9\u03B3\u03BC\u03B1 \u03C0\u03BB\u03AC\u03BD\u03BF\u03C5",
      "title_save": "\u0391\u03C0\u03BF\u03B8\u03AE\u03BA\u03B5\u03C5\u03C3\u03B7 \u03C0\u03BB\u03AC\u03BD\u03BF\u03C5",
      "title_reset": "\u0395\u03C0\u03B1\u03BD\u03B1\u03C6\u03BF\u03C1\u03AC \u03CC\u03BB\u03C9\u03BD",
      "title_theme": "\u03A7\u03C1\u03C9\u03BC\u03B1\u03C4\u03B9\u03BA\u03CC \u0398\u03AD\u03BC\u03B1",
      "options_title": "\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2 & \u03A1\u03C5\u03B8\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2",
      "theme_select": "\u0398\u03AD\u03BC\u03B1",
      "lang_select": "\u0393\u03BB\u03CE\u03C3\u03C3\u03B1",
      "workspace_private": "\u03A0\u03C1\u03BF\u03C3\u03C9\u03C0\u03B9\u03BA\u03AC",
      "workspace_work": "\u0395\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1",
      "work_focus": "\u03A3\u03B7\u03BC\u03B5\u03C1\u03B9\u03BD\u03AE \u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7",
      "work_in_progress": "\u03A3\u03B5 \u0395\u03BE\u03AD\u03BB\u03B9\u03BE\u03B7",
      "work_waiting": "\u03A3\u03B5 \u0391\u03BD\u03B1\u03BC\u03BF\u03BD\u03AE",
      "work_backlog": "\u0395\u03BA\u03BA\u03C1\u03B5\u03BC\u03CC\u03C4\u03B7\u03C4\u03B5\u03C2",
      "dock_sounds": "\u0389\u03C7\u03BF\u03B9",
      "dock_music": "\u039C\u03BF\u03C5\u03C3\u03B9\u03BA\u03AE",
      "dock_shop": "\u03A8\u03CE\u03BD\u03B9\u03B1",
      "dock_cook": "\u039C\u03B1\u03B3\u03B5\u03B9\u03C1\u03B9\u03BA\u03AE",
      "dock_scripts": "\u03A3\u03B5\u03BD\u03AC\u03C1\u03B9\u03B1",
      "dock_alarm": "\u039E\u03C5\u03C0\u03BD\u03B7\u03C4\u03AE\u03C1\u03B9",
      "dock_weather": "\u039A\u03B1\u03B9\u03C1\u03CC\u03C2",
      "dock_news": "\u0395\u03B9\u03B4\u03AE\u03C3\u03B5\u03B9\u03C2",
      "dock_spark": "\u03A3\u03C0\u03AF\u03B8\u03B1",
      "dock_inspire": "\u0388\u03BC\u03C0\u03BD\u03B5\u03C5\u03C3\u03B7",
      "dock_clarity": "\u0394\u03B9\u03B1\u03CD\u03B3\u03B5\u03B9\u03B1",
      "dock_impulse": "\u038F\u03B8\u03B7\u03C3\u03B7",
      "dock_audio": "\u0389\u03C7\u03BF\u03C2",
      "dock_daily": "\u039A\u03B1\u03B8\u03B7\u03BC\u03B5\u03C1\u03B9\u03BD\u03AC",
      "dock_beats": "\u03A1\u03C5\u03B8\u03BC\u03BF\u03AF",
      "dock_workout": "\u0386\u03C3\u03BA\u03B7\u03C3\u03B7",
      "dock_matrix": "\u039C\u03AE\u03C4\u03C1\u03B1",
      "dock_gamification": "Arcade",
      "weather_title": "\u03A4\u03BF\u03C0\u03B9\u03BA\u03CC\u03C2 \u039A\u03B1\u03B9\u03C1\u03CC\u03C2",
      "news_title": "Daily Digest",
      "clarity_title": "\u0394\u03B9\u03B1\u03CD\u03B3\u03B5\u03B9\u03B1 & \u0388\u03BB\u03B5\u03B3\u03C7\u03BF\u03C2 \u03A0\u03B1\u03C1\u03BF\u03C1\u03BC\u03AE\u03C3\u03B5\u03C9\u03BD",
      "clarity_subtitle": "\u039E\u03B5\u03C0\u03AD\u03C1\u03B1\u03C3\u03B5 \u03C4\u03B9\u03C2 \u03C0\u03B1\u03C1\u03BF\u03C1\u03BC\u03AE\u03C3\u03B5\u03B9\u03C2, \u03C3\u03C4\u03B1\u03BC\u03AC\u03C4\u03B1 \u03B1\u03BD\u03B5\u03C0\u03B9\u03B8\u03CD\u03BC\u03B7\u03C4\u03B5\u03C2 \u03C3\u03C5\u03BD\u03AE\u03B8\u03B5\u03B9\u03B5\u03C2 & \u03B5\u03BD\u03AF\u03C3\u03C7\u03C5\u03C3\u03B5 \u03C4\u03B7\u03BD \u03B1\u03C5\u03C4\u03BF\u03BA\u03C5\u03C1\u03B9\u03B1\u03C1\u03C7\u03AF\u03B1",
      "sounds": "\u0389\u03C7\u03BF\u03B9",
      "soundscape_title": "\u0389\u03C7\u03BF\u03B9 \u03A6\u03CD\u03C3\u03B7\u03C2 & \u03A3\u03C5\u03B3\u03BA\u03AD\u03BD\u03C4\u03C1\u03C9\u03C3\u03B7\u03C2",
      "music": "\u039C\u03BF\u03C5\u03C3\u03B9\u03BA\u03AE",
      "music_player": "\u0391\u03BD\u03B1\u03C0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03AE \u0389\u03C7\u03BF\u03C5",
      "custom_tracks": "\u0391\u03BD\u03B1\u03C0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03AE \u03B4\u03B9\u03BA\u03CE\u03BD \u03C3\u03BF\u03C5 \u03B1\u03C1\u03C7\u03B5\u03AF\u03C9\u03BD \u03AE\u03C7\u03BF\u03C5",
      "no_tracks": "\u0394\u03B5\u03BD \u03AD\u03C7\u03BF\u03C5\u03BD \u03C6\u03BF\u03C1\u03C4\u03C9\u03B8\u03B5\u03AF \u03BA\u03BF\u03BC\u03BC\u03AC\u03C4\u03B9\u03B1 \u03B1\u03BA\u03CC\u03BC\u03B1",
      "shopping": "\u039B\u03AF\u03C3\u03C4\u03B1 \u0391\u03B3\u03BF\u03C1\u03CE\u03BD",
      "cooking": "\u0388\u03BE\u03C5\u03C0\u03BD\u03B7 \u039C\u03B1\u03B3\u03B5\u03B9\u03C1\u03B9\u03BA\u03AE",
      "scripts": "\u039A\u03BF\u03B9\u03BD\u03C9\u03BD\u03B9\u03BA\u03AC \u03A3\u03B5\u03BD\u03AC\u03C1\u03B9\u03B1",
      "alarm": "\u039E\u03C5\u03C0\u03BD\u03B7\u03C4\u03AE\u03C1\u03B9\u03B1 & \u03A5\u03C0\u03B5\u03BD\u03B8\u03C5\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2",
      "spark": "\u0393\u03C1\u03AE\u03B3\u03BF\u03C1\u03B7 \u03A3\u03C0\u03AF\u03B8\u03B1",
      "inspire": "\u0388\u03BC\u03C0\u03BD\u03B5\u03C5\u03C3\u03B7",
      "inspire_title": "\u0397\u03BC\u03B5\u03C1\u03AE\u03C3\u03B9\u03B1 \u0388\u03BC\u03C0\u03BD\u03B5\u03C5\u03C3\u03B7",
      "zen_title": "\u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7 Zen",
      "next_rec": "\u03A0\u03C1\u03BF\u03C4\u03B5\u03B9\u03BD\u03CC\u03BC\u03B5\u03BD\u03B7 \u0395\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1",
      "start_focus": "\u0388\u03BD\u03B1\u03C1\u03BE\u03B7 \u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7\u03C2",
      "other_suggestion": "\u0386\u03BB\u03BB\u03B7 \u03A0\u03C1\u03CC\u03C4\u03B1\u03C3\u03B7",
      "open_steps": "\u039F\u03B4\u03B7\u03B3\u03CC\u03C2 \u0392\u03AE\u03BC\u03B1-\u0392\u03AE\u03BC\u03B1",
      "completed": "\u039F\u03BB\u03BF\u03BA\u03BB\u03B7\u03C1\u03CE\u03B8\u03B7\u03BA\u03B5!",
      "complete_btn": "\u039F\u03BB\u03BF\u03BA\u03BB\u03AE\u03C1\u03C9\u03C3\u03B7",
      "complete": "\u039F\u03BB\u03BF\u03BA\u03BB\u03AE\u03C1\u03C9\u03C3\u03B7",
      "complete_task": "\u0397 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1 \u03BF\u03BB\u03BF\u03BA\u03BB\u03B7\u03C1\u03CE\u03B8\u03B7\u03BA\u03B5",
      "timer_title": "\u03A7\u03C1\u03BF\u03BD\u03CC\u03BC\u03B5\u03C4\u03C1\u03BF \u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7\u03C2",
      "start": "\u0388\u03BD\u03B1\u03C1\u03BE\u03B7",
      "stop": "\u0394\u03B9\u03B1\u03BA\u03BF\u03C0\u03AE",
      "steps_btn": "\u0392\u03AE\u03BC\u03B1\u03C4\u03B1",
      "steps_tab": "\u0392\u03AE\u03BC\u03B1\u03C4\u03B1",
      "pick_desc": "\u039D\u03B9\u03CE\u03B8\u03B5\u03B9\u03C2 \u03C0\u03AF\u03B5\u03C3\u03B7 \u03B1\u03C0\u03CC \u03C0\u03BF\u03BB\u03BB\u03AD\u03C2 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B5\u03C2; \u0386\u03C6\u03B7\u03C3\u03B5 \u03C4\u03BF Flow \u03BD\u03B1 \u03C3\u03BF\u03C5 \u03C0\u03C1\u03BF\u03C4\u03B5\u03AF\u03BD\u03B5\u03B9 \u03C4\u03B7\u03BD \u03BA\u03B1\u03C4\u03AC\u03BB\u03BB\u03B7\u03BB\u03B7 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1 \u03B2\u03AC\u03C3\u03B5\u03B9 \u03C0\u03C1\u03BF\u03C4\u03B5\u03C1\u03B1\u03B9\u03CC\u03C4\u03B7\u03C4\u03B1\u03C2:",
      "next_suggestion": "\u{1F3B2} \u0395\u03C0\u03CC\u03BC\u03B5\u03BD\u03B7 \u0395\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1",
      "steps_desc": "\u0395\u03C0\u03AF\u03BB\u03B5\u03BE\u03B5 \u03BC\u03B9\u03B1 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1 \u03B3\u03B9\u03B1 \u03BD\u03B1 \u03B4\u03B5\u03B9\u03C2 \u03C4\u03B7 \u03BB\u03B5\u03C0\u03C4\u03BF\u03BC\u03B5\u03C1\u03AE \u03BA\u03B1\u03B8\u03BF\u03B4\u03AE\u03B3\u03B7\u03C3\u03B7 \u03B2\u03AE\u03BC\u03B1 \u03C0\u03C1\u03BF\u03C2 \u03B2\u03AE\u03BC\u03B1:",
      "start_timer": "\u0388\u03BD\u03B1\u03C1\u03BE\u03B7 \u03A7\u03C1\u03BF\u03BD\u03BF\u03BC\u03AD\u03C4\u03C1\u03BF\u03C5",
      "dropdown_placeholder": "-- \u0395\u03C0\u03AF\u03BB\u03B5\u03BE\u03B5 \u03BC\u03B9\u03B1 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1 \u03B1\u03C0\u03CC \u03C4\u03BF\u03BD \u03C0\u03AF\u03BD\u03B1\u03BA\u03AC \u03C3\u03BF\u03C5 --",
      "boost_btn": "\u03A3\u03C0\u03AF\u03B8\u03B1",
      "boost_desc": "\u039A\u03CC\u03BB\u03BB\u03B7\u03C3\u03B5\u03C2 \u03C3\u03C4\u03B7 \u03C3\u03BA\u03AD\u03C8\u03B7; \u0394\u03BF\u03BA\u03AF\u03BC\u03B1\u03C3\u03B5 \u03B1\u03C5\u03C4\u03AE \u03C4\u03B7 \u03BC\u03B9\u03BA\u03C1\u03BF-\u03B4\u03C1\u03AC\u03C3\u03B7 30 \u03B4\u03B5\u03C5\u03C4\u03B5\u03C1\u03BF\u03BB\u03AD\u03C0\u03C4\u03C9\u03BD \u03B3\u03B9\u03B1 \u03BD\u03B1 \u03BE\u03B1\u03BD\u03B1\u03B2\u03C1\u03B5\u03AF\u03C2 \u03C4\u03B7 \u03C1\u03BF\u03AE \u03C3\u03BF\u03C5:",
      "boost_placeholder": "\u039A\u03AC\u03BD\u03B5 \u03BA\u03BB\u03B9\u03BA \u03C0\u03B1\u03C1\u03B1\u03BA\u03AC\u03C4\u03C9 \u03B3\u03B9\u03B1 \u03BC\u03B9\u03B1 \u03AC\u03BC\u03B5\u03C3\u03B7 \u03C0\u03C1\u03CC\u03C4\u03B1\u03C3\u03B7 \u03B4\u03C1\u03AC\u03C3\u03B7\u03C2!",
      "boost_new": "\u039D\u03AD\u03B1 \u03A0\u03C1\u03CC\u03C4\u03B1\u03C3\u03B7 \u{1F504}",
      "dopamine_kick_title": "\u0398\u03AD\u03BB\u03B5\u03B9\u03C2 \u03BC\u03B9\u03B1 \u03B3\u03C1\u03AE\u03B3\u03BF\u03C1\u03B7 \u03CE\u03B8\u03B7\u03C3\u03B7 \u03BD\u03C4\u03BF\u03C0\u03B1\u03BC\u03AF\u03BD\u03B7\u03C2; \u26A1",
      "dopamine_kick_start": "\u26A1 \u0394\u03CE\u03C3\u03B5 \u03BC\u03BF\u03C5 \u03BC\u03AF\u03B1!",
      "dopamine_kick_done": "\u0388\u03B3\u03B9\u03BD\u03B5! \u{1F389} (+25 XP)",
      "dopamine_kick_other": "\u0386\u03BB\u03BB\u03B7 \u0394\u03C1\u03AC\u03C3\u03B7 \u{1F504}",
      "dopamine_kick_completed_toast": "\u0397 \u03CE\u03B8\u03B7\u03C3\u03B7 \u03BF\u03BB\u03BF\u03BA\u03BB\u03B7\u03C1\u03CE\u03B8\u03B7\u03BA\u03B5! \u0395\u03BE\u03B1\u03B9\u03C1\u03B5\u03C4\u03B9\u03BA\u03CC \u03BE\u03B5\u03BA\u03AF\u03BD\u03B7\u03BC\u03B1.",
      "dopamine_kick_success_log": "\u26A1 \u039F\u03BB\u03BF\u03BA\u03BB\u03AE\u03C1\u03C9\u03C3\u03B7 \u03CE\u03B8\u03B7\u03C3\u03B7\u03C2 \u03BA\u03B9\u03BD\u03AE\u03C4\u03C1\u03BF\u03C5:",
      "whatnow_kickstart": "\u{1FA9C} \u038F\u03B8\u03B7\u03C3\u03B7",
      "cook_add_ingredient": "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7",
      "cook_add_ingredient_placeholder": "\u0393\u03C1\u03AC\u03C8\u03B5 \u03AD\u03BD\u03B1 \u03C5\u03BB\u03B9\u03BA\u03CC (\u03C0.\u03C7. \u0396\u03C5\u03BC\u03B1\u03C1\u03B9\u03BA\u03AC, \u0391\u03C5\u03B3\u03AC)...",
      "cook_suggest": "\u03A0\u03C1\u03CC\u03C4\u03B1\u03C3\u03B7 \u03A3\u03C5\u03BD\u03C4\u03B1\u03B3\u03AE\u03C2 \u{1F373}",
      "cook_pantry_empty": "\u03A4\u03BF \u03BD\u03C4\u03BF\u03C5\u03BB\u03AC\u03C0\u03B9 \u03C3\u03BF\u03C5 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03AC\u03B4\u03B5\u03B9\u03BF. \u03A0\u03C1\u03CC\u03C3\u03B8\u03B5\u03C3\u03B5 \u03C5\u03BB\u03B9\u03BA\u03AC \u03C0\u03B1\u03C1\u03B1\u03C0\u03AC\u03BD\u03C9!",
      "cook_suggestion_title": "\u03A0\u03C1\u03CC\u03C4\u03B1\u03C3\u03B7 \u03A3\u03C5\u03BD\u03C4\u03B1\u03B3\u03AE\u03C2",
      "cook_steps": "\u039F\u03B4\u03B7\u03B3\u03AF\u03B5\u03C2 \u0395\u03BA\u03C4\u03AD\u03BB\u03B5\u03C3\u03B7\u03C2",
      "cook_ingredients": "\u03A4\u03B1 \u03A5\u03BB\u03B9\u03BA\u03AC \u03A3\u03BF\u03C5",
      "cook_quick_staples": "\u0392\u03B1\u03C3\u03B9\u03BA\u03AC \u03A5\u03BB\u03B9\u03BA\u03AC",
      "cook_recipe_ingredients": "\u0391\u03C0\u03B1\u03B9\u03C4\u03BF\u03CD\u03BC\u03B5\u03BD\u03B1 \u03A5\u03BB\u03B9\u03BA\u03AC",
      "cook_placeholder_empty": "\u039A\u03B1\u03C4\u03B1\u03C7\u03CE\u03C1\u03B9\u03C3\u03B5 \u03C4\u03B1 \u03C5\u03BB\u03B9\u03BA\u03AC \u03C3\u03BF\u03C5 \u03B3\u03B9\u03B1 \u03BD\u03B1 \u03BB\u03AC\u03B2\u03B5\u03B9\u03C2 \u03C0\u03C1\u03BF\u03C3\u03B1\u03C1\u03BC\u03BF\u03C3\u03BC\u03AD\u03BD\u03B5\u03C2 \u03C3\u03C5\u03BD\u03C4\u03B1\u03B3\u03AD\u03C2.",
      "cook_time": "\u03A7\u03C1\u03CC\u03BD\u03BF\u03C2",
      "cook_tags": "\u0395\u03C4\u03B9\u03BA\u03AD\u03C4\u03B5\u03C2",
      "cook_add_to_shop": "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u03C5\u03BB\u03B9\u03BA\u03CE\u03BD \u03C0\u03BF\u03C5 \u03BB\u03B5\u03AF\u03C0\u03BF\u03C5\u03BD \u03C3\u03C4\u03B7 \u03BB\u03AF\u03C3\u03C4\u03B1 \u03B1\u03B3\u03BF\u03C1\u03CE\u03BD \u{1F6D2}",
      "shop_add_placeholder": "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u03C0\u03C1\u03BF\u03CA\u03CC\u03BD\u03C4\u03BF\u03C2 (\u03C0.\u03C7. 2x \u03B3\u03AC\u03BB\u03B1 \u03B2\u03C1\u03CE\u03BC\u03B7\u03C2, \u03C8\u03C9\u03BC\u03AF)...",
      "shop_add_btn": "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7",
      "shop_history": "\u0399\u03C3\u03C4\u03BF\u03C1\u03B9\u03BA\u03CC",
      "shop_clear": "\u039A\u03B1\u03B8\u03B1\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2",
      "shop_recent_bought": "\u03A0\u03C1\u03CC\u03C3\u03C6\u03B1\u03C4\u03B1 \u03B1\u03B3\u03BF\u03C1\u03B1\u03C3\u03BC\u03AD\u03BD\u03B1",
      "shop_empty": "\u0397 \u03BB\u03AF\u03C3\u03C4\u03B1 \u03B1\u03B3\u03BF\u03C1\u03CE\u03BD \u03C3\u03BF\u03C5 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03BA\u03B1\u03B8\u03B1\u03C1\u03AE!",
      "supermarket_mode_btn": "\u039B\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03AF\u03B1 \u03A3\u03BF\u03CD\u03C0\u03B5\u03C1 \u039C\u03AC\u03C1\u03BA\u03B5\u03C4 \u{1F6D2}",
      "supermarket_title": "\u039B\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03AF\u03B1 \u03A3\u03BF\u03CD\u03C0\u03B5\u03C1 \u039C\u03AC\u03C1\u03BA\u03B5\u03C4 \u{1F6D2}",
      "sample_banner_title": "\u{1F4A1} \u0391\u03C5\u03C4\u03AD\u03C2 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03B5\u03BD\u03B4\u03B5\u03B9\u03BA\u03C4\u03B9\u03BA\u03AD\u03C2 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B5\u03C2 \u03B3\u03B9\u03B1 \u03AD\u03BC\u03C0\u03BD\u03B5\u03C5\u03C3\u03B7.",
      "sample_banner_desc": "\u039C\u03C0\u03BF\u03C1\u03B5\u03AF\u03C2 \u03BD\u03B1 \u03C4\u03B9\u03C2 \u03C0\u03C1\u03BF\u03C3\u03B1\u03C1\u03BC\u03CC\u03C3\u03B5\u03B9\u03C2, \u03BD\u03B1 \u03BA\u03C1\u03B1\u03C4\u03AE\u03C3\u03B5\u03B9\u03C2 \u03CC\u03C3\u03B5\u03C2 \u03B8\u03AD\u03BB\u03B5\u03B9\u03C2 \u03AE \u03BD\u03B1 \u03B1\u03B4\u03B5\u03B9\u03AC\u03C3\u03B5\u03B9\u03C2 \u03B5\u03BD\u03C4\u03B5\u03BB\u03CE\u03C2 \u03C4\u03BF\u03BD \u03C0\u03AF\u03BD\u03B1\u03BA\u03B1.",
      "sample_keep_all": "\u0394\u03B9\u03B1\u03C4\u03AE\u03C1\u03B7\u03C3\u03B7 \u03CC\u03BB\u03C9\u03BD \u2713",
      "sample_customize_btn": "\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE & \u03A0\u03C1\u03BF\u03C3\u03B1\u03C1\u03BC\u03BF\u03B3\u03AE \u270F\uFE0F",
      "sample_clear_btn": "\u039A\u03B1\u03B8\u03B1\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2 \u03C0\u03AF\u03BD\u03B1\u03BA\u03B1 \u{1F5D1}\uFE0F",
      "sample_modal_title": "\u0394\u03B9\u03B1\u03C7\u03B5\u03AF\u03C1\u03B9\u03C3\u03B7 \u0395\u03BD\u03B4\u03B5\u03B9\u03BA\u03C4\u03B9\u03BA\u03CE\u03BD \u0395\u03C1\u03B3\u03B1\u03C3\u03B9\u03CE\u03BD",
      "sample_modal_subtitle": "\u0395\u03C0\u03AF\u03BB\u03B5\u03BE\u03B5 \u03C0\u03BF\u03B9\u03B1 \u03C0\u03C1\u03CC\u03C4\u03C5\u03C0\u03B1 \u03B8\u03AD\u03BB\u03B5\u03B9\u03C2 \u03BD\u03B1 \u03C6\u03BF\u03C1\u03C4\u03CE\u03C3\u03B5\u03B9\u03C2 \u03AE \u03AC\u03B4\u03B5\u03B9\u03B1\u03C3\u03B5 \u03B5\u03BD\u03C4\u03B5\u03BB\u03CE\u03C2 \u03C4\u03BF\u03BD \u03C0\u03AF\u03BD\u03B1\u03BA\u03B1",
      "sample_cat_daily": "\u039A\u03B1\u03B8\u03B7\u03BC\u03B5\u03C1\u03B9\u03BD\u03AE \u03A1\u03BF\u03C5\u03C4\u03AF\u03BD\u03B1",
      "sample_cat_weekly": "\u03A3\u03C0\u03AF\u03C4\u03B9 & \u039A\u03B1\u03B8\u03B1\u03C1\u03B9\u03CC\u03C4\u03B7\u03C4\u03B1",
      "sample_cat_occasionally": "\u03A0\u03B5\u03C1\u03B9\u03BF\u03B4\u03B9\u03BA\u03AE \u03A6\u03C1\u03BF\u03BD\u03C4\u03AF\u03B4\u03B1",
      "sample_select_all": "\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE \u03CC\u03BB\u03C9\u03BD",
      "sample_deselect_all": "\u0391\u03C0\u03BF\u03B5\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE \u03CC\u03BB\u03C9\u03BD",
      "sample_apply_btn": "\u03A6\u03CC\u03C1\u03C4\u03C9\u03C3\u03B7 \u03B5\u03C0\u03B9\u03BB\u03B5\u03B3\u03BC\u03AD\u03BD\u03C9\u03BD \u03B5\u03C1\u03B3\u03B1\u03C3\u03B9\u03CE\u03BD",
      "sample_toast_loaded": "\u03A4\u03B1 \u03B5\u03C0\u03B9\u03BB\u03B5\u03B3\u03BC\u03AD\u03BD\u03B1 \u03C0\u03C1\u03CC\u03C4\u03C5\u03C0\u03B1 \u03C6\u03BF\u03C1\u03C4\u03CE\u03B8\u03B7\u03BA\u03B1\u03BD \u03BC\u03B5 \u03B5\u03C0\u03B9\u03C4\u03C5\u03C7\u03AF\u03B1!",
      "sample_toast_cleared": "\u039F \u03C0\u03AF\u03BD\u03B1\u03BA\u03B1\u03C2 \u03BA\u03B1\u03B8\u03B1\u03C1\u03AF\u03C3\u03C4\u03B7\u03BA\u03B5 \u03C0\u03BB\u03AE\u03C1\u03C9\u03C2!",
      "toast_no_undo": "\u0394\u03B5\u03BD \u03C5\u03C0\u03AC\u03C1\u03C7\u03B5\u03B9 \u03BA\u03AC\u03C4\u03B9 \u03AC\u03BB\u03BB\u03BF \u03C0\u03C1\u03BF\u03C2 \u03B1\u03BD\u03B1\u03AF\u03C1\u03B5\u03C3\u03B7.",
      "toast_undo_applied": "\u0397 \u03C4\u03B5\u03BB\u03B5\u03C5\u03C4\u03B1\u03AF\u03B1 \u03B5\u03BD\u03AD\u03C1\u03B3\u03B5\u03B9\u03B1 \u03B1\u03BD\u03B1\u03B9\u03C1\u03AD\u03B8\u03B7\u03BA\u03B5.",
      "toast_reset_success": "\u03A4\u03BF \u03C0\u03BB\u03AC\u03BD\u03BF \u03C3\u03BF\u03C5 \u03B5\u03C0\u03B1\u03BD\u03AE\u03BB\u03B8\u03B5 \u03C3\u03C4\u03B9\u03C2 \u03C0\u03C1\u03BF\u03B5\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2.",
      "toast_import_success": "\u03A4\u03BF \u03C0\u03BB\u03AC\u03BD\u03BF \u03C6\u03BF\u03C1\u03C4\u03CE\u03B8\u03B7\u03BA\u03B5 \u03BC\u03B5 \u03B5\u03C0\u03B9\u03C4\u03C5\u03C7\u03AF\u03B1!",
      "toast_import_error": "\u0397 \u03C6\u03CC\u03C1\u03C4\u03C9\u03C3\u03B7 \u03C4\u03BF\u03C5 \u03B1\u03C1\u03C7\u03B5\u03AF\u03BF\u03C5 \u03B1\u03C0\u03AD\u03C4\u03C5\u03C7\u03B5.",
      "toast_task_deleted": "\u0397 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1 \u03B4\u03B9\u03B1\u03B3\u03C1\u03AC\u03C6\u03B7\u03BA\u03B5.",
      "toast_task_restored": "\u0397 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1 \u03B5\u03C0\u03B1\u03BD\u03B1\u03C6\u03AD\u03C1\u03B8\u03B7\u03BA\u03B5.",
      "toast_appointment_name_error": "\u03A0\u03B1\u03C1\u03B1\u03BA\u03B1\u03BB\u03CE \u03C0\u03BB\u03B7\u03BA\u03C4\u03C1\u03BF\u03BB\u03CC\u03B3\u03B7\u03C3\u03B5 \u03AD\u03BD\u03B1 \u03CC\u03BD\u03BF\u03BC\u03B1 \u03B3\u03B9\u03B1 \u03C4\u03BF \u03C1\u03B1\u03BD\u03C4\u03B5\u03B2\u03BF\u03CD.",
      "toast_appointment_saved": "\u03A4\u03BF \u03C1\u03B1\u03BD\u03C4\u03B5\u03B2\u03BF\u03CD \u03B1\u03C0\u03BF\u03B8\u03B7\u03BA\u03B5\u03CD\u03C4\u03B7\u03BA\u03B5 \u03BC\u03B5 \u03B5\u03C0\u03B9\u03C4\u03C5\u03C7\u03AF\u03B1!",
      "appointment_new_btn": "\u039D\u03AD\u03BF \u03A1\u03B1\u03BD\u03C4\u03B5\u03B2\u03BF\u03CD",
      "appointment_form_title": "\u039A\u03B1\u03C4\u03B1\u03C7\u03CE\u03C1\u03B9\u03C3\u03B7 \u03A1\u03B1\u03BD\u03C4\u03B5\u03B2\u03BF\u03CD",
      "appointment_form_name_placeholder": "\u03A0\u03BF\u03B9\u03BF \u03B5\u03AF\u03BD\u03B1\u03B9 \u03C4\u03BF \u03C1\u03B1\u03BD\u03C4\u03B5\u03B2\u03BF\u03CD; (\u03C0.\u03C7. \u039F\u03B4\u03BF\u03BD\u03C4\u03AF\u03B1\u03C4\u03C1\u03BF\u03C2)",
      "appointment_form_date_label": "\u0397\u03BC\u03B5\u03C1\u03BF\u03BC\u03B7\u03BD\u03AF\u03B1",
      "appointment_form_time_label": "\u038F\u03C1\u03B1",
      "appointment_form_save_btn": "\u0391\u03C0\u03BF\u03B8\u03AE\u03BA\u03B5\u03C5\u03C3\u03B7",
      "appointment_form_cancel_btn": "\u0391\u03BA\u03CD\u03C1\u03C9\u03C3\u03B7",
      "sound_rain": "\u0391\u03C0\u03B1\u03BB\u03AE \u0392\u03C1\u03BF\u03C7\u03AE",
      "sound_forest": "\u0392\u03B1\u03B8\u03CD \u0394\u03AC\u03C3\u03BF\u03C2",
      "sound_waves": "\u039A\u03CD\u03BC\u03B1\u03C4\u03B1 \u0398\u03AC\u03BB\u03B1\u03C3\u03C3\u03B1\u03C2",
      "sound_fire": "\u0396\u03B5\u03C3\u03C4\u03CC \u03A4\u03B6\u03AC\u03BA\u03B9",
      "sound_whitenoise": "\u039B\u03B5\u03C5\u03BA\u03CC\u03C2 \u0398\u03CC\u03C1\u03C5\u03B2\u03BF\u03C2",
      "sound_pinknoise": "\u03A1\u03BF\u03B6 \u0398\u03CC\u03C1\u03C5\u03B2\u03BF\u03C2",
      "sound_brownnoise": "\u039A\u03B1\u03C6\u03AD \u0398\u03CC\u03C1\u03C5\u03B2\u03BF\u03C2",
      "sound_binaural_alpha": "\u039A\u03CD\u03BC\u03B1\u03C4\u03B1 \u0386\u03BB\u03C6\u03B1 (\u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7)",
      "sound_binaural_theta": "\u039A\u03CD\u03BC\u03B1\u03C4\u03B1 \u0398\u03AE\u03C4\u03B1 (\u0397\u03C1\u03B5\u03BC\u03AF\u03B1)",
      "sound_cafe": "\u0396\u03B5\u03C3\u03C4\u03CC \u039A\u03B1\u03C6\u03AD",
      "sound_lofi": "\u0391\u03C1\u03BC\u03BF\u03BD\u03AF\u03B5\u03C2 Lo-Fi",
      "sound_space": "\u039A\u03BF\u03C3\u03BC\u03B9\u03BA\u03CC \u03A0\u03B5\u03C1\u03B9\u03B2\u03AC\u03BB\u03BB\u03BF\u03BD",
      "sound_stream": "\u039F\u03C1\u03B5\u03B9\u03BD\u03CC \u03A1\u03C5\u03AC\u03BA\u03B9",
      "sound_night": "\u039D\u03C5\u03C7\u03C4\u03B5\u03C1\u03B9\u03BD\u03AC \u03A4\u03C1\u03B9\u03B6\u03CC\u03BD\u03B9\u03B1",
      "sound_train": "\u039D\u03C5\u03C7\u03C4\u03B5\u03C1\u03B9\u03BD\u03CC \u03A4\u03C1\u03AD\u03BD\u03BF",
      "sound_wind": "\u0391\u03C0\u03B1\u03BB\u03CC\u03C2 \u0386\u03BD\u03B5\u03BC\u03BF\u03C2",
      "sound_underwater": "\u03A5\u03C0\u03BF\u03B2\u03C1\u03CD\u03C7\u03B9\u03B1 \u0397\u03C1\u03B5\u03BC\u03AF\u03B1",
      "sound_fan": "\u0391\u03BD\u03B5\u03BC\u03B9\u03C3\u03C4\u03AE\u03C1\u03B1\u03C2",
      "sound_clock": "\u0389\u03C3\u03C5\u03C7\u03BF \u03A1\u03BF\u03BB\u03CC\u03B9",
      "sound_monastery": "\u0398\u03B9\u03B2\u03B5\u03C4\u03B9\u03B1\u03BD\u03AC \u039C\u03C0\u03BF\u03BB",
      "sound_lofi_sunshine": "Lofi Sunshine",
      "sound_bossa_nova": "Bossa Nova",
      "sound_jazz_piano": "Jazz Voicings",
      "sound_rhodes": "Fender Rhodes",
      "sound_hypnotic_riff": "\u03A5\u03C0\u03BD\u03C9\u03C4\u03B9\u03BA\u03CC Riff",
      "sound_techno": "Techno 128",
      "sound_dnb": "Drum & Bass",
      "sound_afrobeats": "Afrobeats",
      "sound_swing": "Swing & Jazz",
      "sound_boombap": "Boom-Bap",
      "guide_title": "\u039F\u03B4\u03B7\u03B3\u03CC\u03C2 \u0393\u03C1\u03AE\u03B3\u03BF\u03C1\u03B7\u03C2 \u0395\u03BA\u03BA\u03AF\u03BD\u03B7\u03C3\u03B7\u03C2 Flow",
      "guide_desc": "\u039A\u03AC\u03BD\u03B5 \u03BA\u03BB\u03B9\u03BA \u03C3\u03B5 \u03BF\u03C0\u03BF\u03B9\u03B1\u03B4\u03AE\u03C0\u03BF\u03C4\u03B5 \u03BB\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03AF\u03B1 \u03B3\u03B9\u03B1 \u03AC\u03BC\u03B5\u03C3\u03BF \u03AC\u03BD\u03BF\u03B9\u03B3\u03BC\u03B1. \u03A7\u03C1\u03B7\u03C3\u03B9\u03BC\u03BF\u03C0\u03BF\u03AF\u03B7\u03C3\u03B5 \u03C4\u03B9\u03C2 \u03C3\u03C5\u03BD\u03C4\u03BF\u03BC\u03B5\u03CD\u03C3\u03B5\u03B9\u03C2 \u03C0\u03BB\u03B7\u03BA\u03C4\u03C1\u03BF\u03BB\u03BF\u03B3\u03AF\u03BF\u03C5 \u03CC\u03C0\u03BF\u03C4\u03B5 \u03B2\u03C1\u03AF\u03C3\u03BA\u03B5\u03C3\u03B1\u03B9 \u03B5\u03BA\u03C4\u03CC\u03C2 \u03C0\u03B5\u03B4\u03AF\u03C9\u03BD \u03BA\u03B5\u03B9\u03BC\u03AD\u03BD\u03BF\u03C5!",
      "guide_focus_mode_title": "\u039B\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03AF\u03B1 \u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7\u03C2",
      "guide_focus_mode_desc": "\u039A\u03C1\u03CD\u03B2\u03B5\u03B9 \u03C4\u03BF\u03C5\u03C2 \u03C0\u03B5\u03C1\u03B9\u03C3\u03C0\u03B1\u03C3\u03BC\u03BF\u03CD\u03C2 \u03BA\u03B1\u03B9 \u03C0\u03C1\u03BF\u03B2\u03AC\u03BB\u03BB\u03B5\u03B9 \u03B1\u03C0\u03BF\u03BA\u03BB\u03B5\u03B9\u03C3\u03C4\u03B9\u03BA\u03AC \u03C4\u03B7 \u03C3\u03B7\u03BC\u03B1\u03BD\u03C4\u03B9\u03BA\u03CC\u03C4\u03B5\u03C1\u03B7 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1 \u03C3\u03BF\u03C5 \u03C3\u03B5 \u03AD\u03BD\u03B1 \u03AE\u03C1\u03B5\u03BC\u03BF \u03C0\u03B5\u03C1\u03B9\u03B2\u03AC\u03BB\u03BB\u03BF\u03BD Zen.",
      "guide_focus_mode_key": "\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [F]",
      "guide_timer_title": "\u03A7\u03C1\u03BF\u03BD\u03CC\u03BC\u03B5\u03C4\u03C1\u03BF \u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7\u03C2",
      "guide_timer_desc": "\u039E\u03B5\u03BA\u03AF\u03BD\u03B7\u03C3\u03B5 \u03C3\u03C5\u03B3\u03BA\u03B5\u03BD\u03C4\u03C1\u03C9\u03BC\u03AD\u03BD\u03B5\u03C2 \u03C0\u03B5\u03C1\u03B9\u03CC\u03B4\u03BF\u03C5\u03C2 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1\u03C2 \u03BC\u03B5 \u03C6\u03C9\u03BD\u03B7\u03C4\u03B9\u03BA\u03AE \u03B5\u03BD\u03B8\u03AC\u03C1\u03C1\u03C5\u03BD\u03C3\u03B7 \u03BA\u03B1\u03B9 \u03B1\u03C4\u03BC\u03BF\u03C3\u03C6\u03B1\u03B9\u03C1\u03B9\u03BA\u03CC \u03AE\u03C7\u03BF.",
      "guide_timer_key_start": "\u0388\u03BD\u03B1\u03C1\u03BE\u03B7/\u03A0\u03B1\u03CD\u03C3\u03B7 [T]",
      "guide_timer_key_stop": "\u0394\u03B9\u03B1\u03BA\u03BF\u03C0\u03AE [S]",
      "guide_whatnow_title": "\u039A\u03B1\u03B9 \u03C4\u03CE\u03C1\u03B1 \u03C4\u03B9;",
      "guide_whatnow_desc": "\u039C\u03B5\u03B9\u03CE\u03BD\u03B5\u03B9 \u03C4\u03B7\u03BD \u03BA\u03CC\u03C0\u03C9\u03C3\u03B7 \u03B1\u03C0\u03BF\u03C6\u03AC\u03C3\u03B5\u03C9\u03BD \u03C0\u03C1\u03BF\u03C4\u03B5\u03AF\u03BD\u03BF\u03BD\u03C4\u03B1\u03C2 \u03C4\u03C5\u03C7\u03B1\u03AF\u03B1 \u03BC\u03B9\u03B1 \u03BA\u03B1\u03C4\u03AC\u03BB\u03BB\u03B7\u03BB\u03B7 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1 \u03B2\u03AC\u03C3\u03B5\u03B9 \u03C4\u03B7\u03C2 \u03C0\u03C1\u03BF\u03C4\u03B5\u03C1\u03B1\u03B9\u03CC\u03C4\u03B7\u03C4\u03AC\u03C2 \u03C3\u03BF\u03C5.",
      "guide_whatnow_key": "\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [W]",
      "guide_break_title": "\u03A0\u03B1\u03CD\u03C3\u03B7 & \u0391\u03B9\u03C3\u03B8\u03B7\u03C4\u03B7\u03C1\u03B9\u03B1\u03BA\u03AE \u03A7\u03B1\u03BB\u03AC\u03C1\u03C9\u03C3\u03B7",
      "guide_break_desc": "\u0391\u03BD\u03B1\u03BA\u03BF\u03C5\u03C6\u03AF\u03B6\u03B5\u03B9 \u03B1\u03C0\u03CC \u03C4\u03B7\u03BD \u03C5\u03C0\u03B5\u03C1\u03C6\u03CC\u03C1\u03C4\u03C9\u03C3\u03B7 \u03BC\u03B5 \u03C1\u03C5\u03B8\u03BC\u03CC \u03B1\u03BD\u03B1\u03C0\u03BD\u03BF\u03AE\u03C2 4-4-4, \u03B3\u03B5\u03AF\u03C9\u03C3\u03B7 5-4-3-2-1 \u03AE \u03B1\u03BD\u03B1\u03B6\u03C9\u03BF\u03B3\u03BF\u03BD\u03B7\u03C4\u03B9\u03BA\u03CC power nap.",
      "guide_break_key": "\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [P]",
      "guide_cooking_title": "\u039C\u03B1\u03B3\u03B5\u03B9\u03C1\u03B9\u03BA\u03AE & \u03A0\u03C1\u03BF\u03BC\u03AE\u03B8\u03B5\u03B9\u03B5\u03C2",
      "guide_cooking_desc": "\u039A\u03B1\u03C4\u03B1\u03C7\u03CE\u03C1\u03B9\u03C3\u03B5 \u03C4\u03B1 \u03B4\u03B9\u03B1\u03B8\u03AD\u03C3\u03B9\u03BC\u03B1 \u03C5\u03BB\u03B9\u03BA\u03AC \u03C3\u03BF\u03C5 \u03BA\u03B1\u03B9 \u03B4\u03B7\u03BC\u03B9\u03BF\u03CD\u03C1\u03B3\u03B7\u03C3\u03B5 \u03AC\u03BC\u03B5\u03C3\u03B1 \u03BD\u03CC\u03C3\u03C4\u03B9\u03BC\u03B5\u03C2 \u03C3\u03C5\u03BD\u03C4\u03B1\u03B3\u03AD\u03C2 \u03B2\u03AE\u03BC\u03B1 \u03C0\u03C1\u03BF\u03C2 \u03B2\u03AE\u03BC\u03B1.",
      "guide_cooking_key": "\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [K]",
      "guide_shopping_title": "\u039B\u03AF\u03C3\u03C4\u03B1 \u0391\u03B3\u03BF\u03C1\u03CE\u03BD",
      "guide_shopping_desc": "\u039F\u03C1\u03B3\u03AC\u03BD\u03C9\u03C3\u03B5 \u03C4\u03B9\u03C2 \u03B1\u03B3\u03BF\u03C1\u03AD\u03C2 \u03C3\u03BF\u03C5 \u03BC\u03B5 \u03B5\u03B9\u03B4\u03B9\u03BA\u03AE \u03BB\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03AF\u03B1 \u03C0\u03BB\u03AE\u03C1\u03BF\u03C5\u03C2 \u03BF\u03B8\u03CC\u03BD\u03B7\u03C2 \u03B3\u03B9\u03B1 \u03AC\u03BD\u03B5\u03C4\u03B1 \u03C8\u03CE\u03BD\u03B9\u03B1 \u03C3\u03C4\u03BF \u03A3\u03BF\u03CD\u03C0\u03B5\u03C1 \u039C\u03AC\u03C1\u03BA\u03B5\u03C4.",
      "guide_shopping_key": "\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [E]",
      "guide_sport_title": "\u0386\u03C3\u03BA\u03B7\u03C3\u03B7 & \u039A\u03AF\u03BD\u03B7\u03C3\u03B7",
      "guide_sport_desc": "\u0395\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03AF\u03B7\u03C3\u03B5 \u03B1\u03C0\u03B1\u03BB\u03AC \u03C4\u03BF \u03C3\u03CE\u03BC\u03B1 \u03C3\u03BF\u03C5 \u03BC\u03B5 \u03B1\u03C3\u03BA\u03AE\u03C3\u03B5\u03B9\u03C2 1 \u03BB\u03B5\u03C0\u03C4\u03BF\u03CD, \u03C0\u03C1\u03BF\u03C3\u03B1\u03C1\u03BC\u03BF\u03C3\u03BC\u03AD\u03BD\u03B5\u03C2 \u03C3\u03C4\u03BF \u03B5\u03C0\u03AF\u03C0\u03B5\u03B4\u03BF \u03B5\u03BD\u03AD\u03C1\u03B3\u03B5\u03B9\u03AC\u03C2 \u03C3\u03BF\u03C5 (Spoons).",
      "guide_sport_key": "\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [O]",
      "guide_report_title": "\u03A3\u03C4\u03B1\u03C4\u03B9\u03C3\u03C4\u03B9\u03BA\u03AC & \u0395\u03C0\u03B9\u03C4\u03B5\u03CD\u03B3\u03BC\u03B1\u03C4\u03B1",
      "guide_report_desc": "\u03A0\u03B1\u03C1\u03B1\u03BA\u03BF\u03BB\u03BF\u03CD\u03B8\u03B7\u03C3\u03B5 \u03C4\u03B7\u03BD \u03BA\u03B1\u03B8\u03B7\u03BC\u03B5\u03C1\u03B9\u03BD\u03AE \u03C3\u03BF\u03C5 \u03C0\u03C1\u03CC\u03BF\u03B4\u03BF, \u03B4\u03B5\u03C2 \u03C4\u03B7\u03BD \u03B5\u03B2\u03B4\u03BF\u03BC\u03B1\u03B4\u03B9\u03B1\u03AF\u03B1 \u03B4\u03C1\u03B1\u03C3\u03C4\u03B7\u03C1\u03B9\u03CC\u03C4\u03B7\u03C4\u03B1 \u03BA\u03B1\u03B9 \u03B5\u03BE\u03AE\u03B3\u03B1\u03B3\u03B5 \u03B1\u03BD\u03B1\u03C6\u03BF\u03C1\u03AD\u03C2 \u03C3\u03B5 \u03B5\u03B9\u03BA\u03CC\u03BD\u03B1.",
      "guide_report_key": "\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [R]",
      "guide_sample_title": "\u0394\u03B9\u03B1\u03C7\u03B5\u03AF\u03C1\u03B9\u03C3\u03B7 \u03A0\u03C1\u03BF\u03C4\u03CD\u03C0\u03C9\u03BD",
      "guide_sample_desc": "\u03A6\u03CC\u03C1\u03C4\u03C9\u03C3\u03B5 \u03AD\u03C4\u03BF\u03B9\u03BC\u03B5\u03C2 \u03C1\u03BF\u03C5\u03C4\u03AF\u03BD\u03B5\u03C2 \u03B3\u03B9\u03B1 \u03C4\u03BF \u03C3\u03C0\u03AF\u03C4\u03B9, \u03C0\u03C1\u03BF\u03C3\u03AC\u03C1\u03BC\u03BF\u03C3\u03AD \u03C4\u03B5\u03C2 \u03AE \u03AC\u03B4\u03B5\u03B9\u03B1\u03C3\u03B5 \u03C4\u03BF\u03BD \u03C0\u03AF\u03BD\u03B1\u03BA\u03B1 \u03B1\u03BD\u03AC \u03C0\u03AC\u03C3\u03B1 \u03C3\u03C4\u03B9\u03B3\u03BC\u03AE.",
      "guide_sample_key": "\u03A0\u03C1\u03CC\u03C4\u03C5\u03C0\u03B1",
      "guide_shortcuts_title": "\u03A0\u03B5\u03C1\u03B9\u03C3\u03C3\u03CC\u03C4\u03B5\u03C1\u03B5\u03C2 \u03A3\u03C5\u03BD\u03C4\u03BF\u03BC\u03B5\u03CD\u03C3\u03B5\u03B9\u03C2",
      "guide_shortcuts_desc": "\u2022 <b>\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [U]</b>: \u0391\u03BD\u03B1\u03AF\u03C1\u03B5\u03C3\u03B7 \u03C4\u03B5\u03BB\u03B5\u03C5\u03C4\u03B1\u03AF\u03B1\u03C2 \u03B5\u03BD\u03AD\u03C1\u03B3\u03B5\u03B9\u03B1\u03C2<br>\u2022 <b>\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [A]</b>: \u039D\u03AD\u03BF \u03C1\u03B1\u03BD\u03C4\u03B5\u03B2\u03BF\u03CD<br>\u2022 <b>\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [B]</b>: \u0386\u03BD\u03BF\u03B9\u03B3\u03BC\u03B1 \u038F\u03B8\u03B7\u03C3\u03B7\u03C2 & \u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7\u03C2<br>\u2022 <b>\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [I]</b>: \u0397\u03BC\u03B5\u03C1\u03AE\u03C3\u03B9\u03B1 \u03AD\u03BC\u03C0\u03BD\u03B5\u03C5\u03C3\u03B7<br>\u2022 <b>\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [H]</b>: \u0386\u03BD\u03BF\u03B9\u03B3\u03BC\u03B1/\u03BA\u03BB\u03B5\u03AF\u03C3\u03B9\u03BC\u03BF \u03BF\u03B4\u03B7\u03B3\u03BF\u03CD<br>\u2022 <b>\u03A0\u03BB\u03AE\u03BA\u03C4\u03C1\u03BF [Esc]</b>: \u039A\u03BB\u03B5\u03AF\u03C3\u03B9\u03BC\u03BF \u03CC\u03BB\u03C9\u03BD \u03C4\u03C9\u03BD \u03C0\u03B1\u03C1\u03B1\u03B8\u03CD\u03C1\u03C9\u03BD",
      "guide_shortcuts_key": "\u03A0\u03BF\u03BB\u03BB\u03B1\u03C0\u03BB\u03AC",
      "guide_footer_local": "Flow Suite \xB7 Local-First",
      "guide_footer_privacy": "\u03A0\u03C1\u03BF\u03C3\u03C4\u03B1\u03C3\u03AF\u03B1 \u0394\u03B5\u03B4\u03BF\u03BC\u03AD\u03BD\u03C9\u03BD & \u038C\u03C1\u03BF\u03B9",
      "pause_panel_title": "\u03A0\u03B1\u03CD\u03C3\u03B7 & \u0391\u03B9\u03C3\u03B8\u03B7\u03C4\u03B7\u03C1\u03B9\u03B1\u03BA\u03AE \u03A7\u03B1\u03BB\u03AC\u03C1\u03C9\u03C3\u03B7",
      "pause_breath_title": "\u0391\u03BD\u03B1\u03C0\u03BD\u03BF\u03AE 4-4-4",
      "pause_breath_sub": "\u0397\u03C1\u03B5\u03BC\u03B5\u03AF \u03C4\u03BF \u03BD\u03B5\u03C5\u03C1\u03B9\u03BA\u03CC \u03C3\u03CD\u03C3\u03C4\u03B7\u03BC\u03B1 \u03C3\u03B5 60\u03B4",
      "pause_grounding_title": "\u0393\u03B5\u03AF\u03C9\u03C3\u03B7 5-4-3-2-1",
      "pause_grounding_sub": "\u03A3\u03B5 \u03B5\u03C0\u03B1\u03BD\u03B1\u03C6\u03AD\u03C1\u03B5\u03B9 \u03AC\u03BC\u03B5\u03C3\u03B1 \u03C3\u03C4\u03BF \u03C0\u03B1\u03C1\u03CC\u03BD",
      "pause_stretch_title": "\u0394\u03B9\u03AC\u03C4\u03B1\u03C3\u03B7 \u03A3\u03CE\u03BC\u03B1\u03C4\u03BF\u03C2 & \u0391\u03C5\u03C7\u03AD\u03BD\u03B1",
      "pause_stretch_sub": "2 \u03BB\u03B5\u03C0\u03C4\u03AC \u03B1\u03C0\u03B1\u03BB\u03AE\u03C2 \u03C7\u03B1\u03BB\u03AC\u03C1\u03C9\u03C3\u03B7\u03C2",
      "pause_nap_title": "Power Nap (20 \u039B\u03B5\u03C0\u03C4\u03AC) \u{1F634}",
      "pause_nap_sub": "\u03A3\u03CD\u03BD\u03C4\u03BF\u03BC\u03BF\u03C2 \u03CD\u03C0\u03BD\u03BF\u03C2 \u03C5\u03C0\u03CC \u03AE\u03C7\u03BF \u03B1\u03C0\u03B1\u03BB\u03AE\u03C2 \u03B2\u03C1\u03BF\u03C7\u03AE\u03C2",
      "settings_dropdown_title": "\u03A1\u03C5\u03B8\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2",
      "settings_btn_fullscreen": "\u03A0\u03BB\u03AE\u03C1\u03B7\u03C2 \u03C0\u03C1\u03BF\u03B2\u03BF\u03BB\u03AE \u2197",
      "settings_section_theme": "\u{1F3A8} \u03A7\u03C1\u03C9\u03BC\u03B1\u03C4\u03B9\u03BA\u03CC \u0398\u03AD\u03BC\u03B1 (16 \u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2)",
      "settings_section_lang": "\u{1F310} \u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE \u0393\u03BB\u03CE\u03C3\u03C3\u03B1\u03C2",
      "settings_p2p_sync": "\u0396\u03C9\u03BD\u03C4\u03B1\u03BD\u03CC\u03C2 \u03A3\u03C5\u03B3\u03C7\u03C1\u03BF\u03BD\u03B9\u03C3\u03BC\u03CC\u03C2",
      "settings_privacy_btn": "\u03A0\u03C1\u03BF\u03C3\u03C4\u03B1\u03C3\u03AF\u03B1 \u0394\u03B5\u03B4\u03BF\u03BC\u03AD\u03BD\u03C9\u03BD",
      "audio_center_title": "\u039A\u03AD\u03BD\u03C4\u03C1\u03BF \u0389\u03C7\u03BF\u03C5",
      "audio_center_subtitle": "\u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7, \u03A1\u03C5\u03B8\u03BC\u03BF\u03AF & Mix Studio",
      "audio_tab_ambient": "\u0389\u03C7\u03BF\u03B9 \u03A6\u03CD\u03C3\u03B7\u03C2",
      "audio_tab_beats": "Beats & LoFi",
      "audio_tab_dj": "Mix Studio",
      "cal_mo": "\u0394\u03B5",
      "cal_di": "\u03A4\u03C1",
      "cal_mi": "\u03A4\u03B5",
      "cal_do": "\u03A0\u03AD",
      "cal_fr": "\u03A0\u03B1",
      "cal_sa": "\u03A3\u03AC",
      "cal_so": "\u039A\u03C5",
      "month_jan": "\u0399\u03B1\u03BD\u03BF\u03C5\u03AC\u03C1\u03B9\u03BF\u03C2",
      "month_feb": "\u03A6\u03B5\u03B2\u03C1\u03BF\u03C5\u03AC\u03C1\u03B9\u03BF\u03C2",
      "month_mar": "\u039C\u03AC\u03C1\u03C4\u03B9\u03BF\u03C2",
      "month_apr": "\u0391\u03C0\u03C1\u03AF\u03BB\u03B9\u03BF\u03C2",
      "month_may": "\u039C\u03AC\u03B9\u03BF\u03C2",
      "month_jun": "\u0399\u03BF\u03CD\u03BD\u03B9\u03BF\u03C2",
      "month_jul": "\u0399\u03BF\u03CD\u03BB\u03B9\u03BF\u03C2",
      "month_aug": "\u0391\u03CD\u03B3\u03BF\u03C5\u03C3\u03C4\u03BF\u03C2",
      "month_sep": "\u03A3\u03B5\u03C0\u03C4\u03AD\u03BC\u03B2\u03C1\u03B9\u03BF\u03C2",
      "month_oct": "\u039F\u03BA\u03C4\u03CE\u03B2\u03C1\u03B9\u03BF\u03C2",
      "month_nov": "\u039D\u03BF\u03AD\u03BC\u03B2\u03C1\u03B9\u03BF\u03C2",
      "month_dec": "\u0394\u03B5\u03BA\u03AD\u03BC\u03B2\u03C1\u03B9\u03BF\u03C2",
      "mobile_nav_tools": "\u0395\u03C1\u03B3\u03B1\u03BB\u03B5\u03AF\u03B1",
      "mobile_nav_planner": "\u03A0\u03BB\u03AC\u03BD\u03BF",
      "mobile_nav_focus": "\u0395\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7",
      "mobile_nav_audio": "\u0389\u03C7\u03BF\u03C2",
      "mobile_nav_game": "\u03A0\u03B1\u03B9\u03C7\u03BD\u03AF\u03B4\u03B9",
      "mobile_fab_title": "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u03BD\u03AD\u03B1\u03C2 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1\u03C2",
      "mobile_quick_title": "\u0393\u03C1\u03AE\u03B3\u03BF\u03C1\u03BF \u039C\u03B5\u03BD\u03BF\u03CD & \u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2",
      "mobile_quick_desc": "\u038C\u03BB\u03B5\u03C2 \u03BF\u03B9 \u03BB\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03AF\u03B5\u03C2 \u03AC\u03BC\u03B5\u03C3\u03B1 \u03B4\u03B9\u03B1\u03B8\u03AD\u03C3\u03B9\u03BC\u03B5\u03C2",
      "mobile_quick_sync_title": "\u0396\u03C9\u03BD\u03C4\u03B1\u03BD\u03CC\u03C2 \u03A3\u03C5\u03B3\u03C7\u03C1\u03BF\u03BD\u03B9\u03C3\u03BC\u03CC\u03C2",
      "mobile_quick_sync_sub": "\u039C\u03B5\u03C4\u03B1\u03C6\u03BF\u03C1\u03AC QR & P2P",
      "mobile_quick_stats_title": "\u03A3\u03C4\u03B1\u03C4\u03B9\u03C3\u03C4\u03B9\u03BA\u03AC",
      "mobile_quick_stats_sub": "\u0395\u03B2\u03B4\u03BF\u03BC\u03B1\u03B4\u03B9\u03B1\u03AF\u03B1 \u03B1\u03BD\u03AC\u03BB\u03C5\u03C3\u03B7",
      "mobile_quick_theme_title": "\u03A7\u03C1\u03C9\u03BC\u03B1\u03C4\u03B9\u03BA\u03CC \u0398\u03AD\u03BC\u03B1",
      "mobile_quick_theme_sub": "16 \u0398\u03AD\u03BC\u03B1\u03C4\u03B1",
      "mobile_quick_lang_title": "\u0393\u03BB\u03CE\u03C3\u03C3\u03B1",
      "mobile_quick_lang_sub": "6 \u0393\u03BB\u03CE\u03C3\u03C3\u03B5\u03C2",
      "mobile_quick_whatnow_title": "\u039A\u03B1\u03B9 \u03C4\u03CE\u03C1\u03B1 \u03C4\u03B9;",
      "mobile_quick_whatnow_sub": "\u03A0\u03C1\u03CC\u03C4\u03B1\u03C3\u03B7 \u03B4\u03C1\u03AC\u03C3\u03B7\u03C2",
      "mobile_quick_break_title": "\u03A0\u03B1\u03CD\u03C3\u03B7 \u03A7\u03B1\u03BB\u03AC\u03C1\u03C9\u03C3\u03B7\u03C2",
      "mobile_quick_break_sub": "\u0391\u03BD\u03B1\u03C0\u03BD\u03BF\u03AE & \u0397\u03C1\u03B5\u03BC\u03AF\u03B1",
      "mobile_quick_save_title": "\u0391\u03C0\u03BF\u03B8\u03AE\u03BA\u03B5\u03C5\u03C3\u03B7 \u03C0\u03BB\u03AC\u03BD\u03BF\u03C5",
      "mobile_quick_save_sub": "\u0395\u03BE\u03B1\u03B3\u03C9\u03B3\u03AE JSON",
      "mobile_quick_settings_title": "\u03A1\u03C5\u03B8\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2",
      "mobile_quick_settings_sub": "\u03A1\u03C5\u03B8\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2 & GDPR",
      "mobile_tools_section": "\u{1F6E0}\uFE0F \u03A4\u03C1\u03CC\u03C0\u03BF\u03C2 \u0396\u03C9\u03AE\u03C2 & \u03A0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03B9\u03BA\u03CC\u03C4\u03B7\u03C4\u03B1",
      "mobile_tools_sync_badge": "1-\u039A\u03BB\u03B9\u03BA",
      "mobile_tools_sync_title": "\u0396\u03C9\u03BD\u03C4\u03B1\u03BD\u03CC\u03C2 \u03A3\u03C5\u03B3\u03C7\u03C1\u03BF\u03BD\u03B9\u03C3\u03BC\u03CC\u03C2 & QR",
      "mobile_tools_sync_sub": "\u03A5\u03C0\u03BF\u03BB\u03BF\u03B3\u03B9\u03C3\u03C4\u03AE\u03C2 \u2194 \u039A\u03B9\u03BD\u03B7\u03C4\u03CC",
      "mobile_tools_opt_badge": "\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2",
      "mobile_tools_opt_title": "\u0395\u03BC\u03C6\u03AC\u03BD\u03B9\u03C3\u03B7 & \u0393\u03BB\u03CE\u03C3\u03C3\u03B1",
      "mobile_tools_opt_sub": "\u0398\u03AD\u03BC\u03B1\u03C4\u03B1 & \u0391\u03BD\u03C4\u03AF\u03B3\u03C1\u03B1\u03C6\u03B1",
      "mobile_tools_shop_badge": "\u03A8\u03CE\u03BD\u03B9\u03B1",
      "mobile_tools_shop_title": "\u039B\u03AF\u03C3\u03C4\u03B1 \u0391\u03B3\u03BF\u03C1\u03CE\u03BD",
      "mobile_tools_shop_sub": "\u039A\u03B1\u03C4\u03B7\u03B3\u03BF\u03C1\u03AF\u03B5\u03C2 & \u03A0\u03BF\u03C3\u03CC\u03C4\u03B7\u03C4\u03B5\u03C2",
      "mobile_tools_cook_badge": "\u039C\u03B1\u03B3\u03B5\u03B9\u03C1\u03B9\u03BA\u03AE",
      "mobile_tools_cook_title": "\u03A3\u03C5\u03BD\u03C4\u03B1\u03B3\u03AD\u03C2 & \u03A0\u03C1\u03BF\u03B5\u03C4\u03BF\u03B9\u03BC\u03B1\u03C3\u03AF\u03B1",
      "mobile_tools_cook_sub": "\u0392\u03AE\u03BC\u03B1-\u0392\u03AE\u03BC\u03B1",
      "mobile_tools_sport_badge": "\u0395\u03BD\u03B5\u03C1\u03B3\u03CC",
      "mobile_tools_sport_title": "\u0394\u03B9\u03AC\u03BB\u03B5\u03B9\u03BC\u03BC\u03B1 \u039A\u03AF\u03BD\u03B7\u03C3\u03B7\u03C2",
      "mobile_tools_sport_sub": "\u039C\u03B9\u03BA\u03C1\u03BF-\u0391\u03C3\u03BA\u03AE\u03C3\u03B5\u03B9\u03C2",
      "mobile_tools_alarm_badge": "\u039E\u03C5\u03C0\u03BD\u03B7\u03C4\u03AE\u03C1\u03B9",
      "mobile_tools_alarm_title": "\u039E\u03C5\u03C0\u03BD\u03B7\u03C4\u03AE\u03C1\u03B9\u03B1 & \u03A7\u03C1\u03BF\u03BD\u03CC\u03BC\u03B5\u03C4\u03C1\u03B1",
      "mobile_tools_alarm_sub": "\u0391\u03BA\u03C1\u03B9\u03B2\u03B5\u03AF\u03C2 \u03A5\u03C0\u03B5\u03BD\u03B8\u03C5\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2",
      "mobile_tools_stats_badge": "\u03A3\u03C4\u03B1\u03C4\u03B9\u03C3\u03C4\u03B9\u03BA\u03AC",
      "mobile_tools_stats_title": "\u03A0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03B9\u03BA\u03CC\u03C4\u03B7\u03C4\u03B1",
      "mobile_tools_stats_sub": "\u0395\u03B2\u03B4\u03BF\u03BC\u03B1\u03B4\u03B9\u03B1\u03AF\u03B1 \u0391\u03BD\u03B1\u03C6\u03BF\u03C1\u03AC",
      "mobile_tools_whatnow_badge": "\u038F\u03B8\u03B7\u03C3\u03B7",
      "mobile_tools_whatnow_title": "\u039A\u03B1\u03B9 \u03C4\u03CE\u03C1\u03B1 \u03C4\u03B9;",
      "mobile_tools_whatnow_sub": "\u03A0\u03C1\u03CC\u03C4\u03B1\u03C3\u03B7 \u03B2\u03AC\u03C3\u03B5\u03B9 \u0395\u03BD\u03AD\u03C1\u03B3\u03B5\u03B9\u03B1\u03C2",
      "mobile_audio_synth_title": "\u03A1\u03C5\u03B8\u03BC\u03BF\u03AF \u03A3\u03C5\u03BD\u03B8\u03B5\u03C3\u03AC\u03B9\u03B6\u03B5\u03C1"
    }
  };
  if (typeof window !== "undefined") {
    window.customTranslations = customTranslations2;
    if (window.TRANSLATIONS) {
      for (let lang in customTranslations2) {
        window.TRANSLATIONS[lang] = Object.assign({}, window.TRANSLATIONS[lang] || {}, customTranslations2[lang]);
      }
    }
  }
  if (typeof globalThis !== "undefined") {
    globalThis.customTranslations = customTranslations2;
    if (globalThis.TRANSLATIONS) {
      for (let lang in customTranslations2) {
        globalThis.TRANSLATIONS[lang] = Object.assign({}, globalThis.TRANSLATIONS[lang] || {}, customTranslations2[lang]);
      }
    }
  }

  // storage.js
  var AppStorage2 = {
    get(key, defaultValue = null) {
      try {
        const val = localStorage.getItem(key);
        if (val === null || val === void 0) return defaultValue;
        return JSON.parse(val);
      } catch (e) {
        console.warn(`[AppStorage] Fehler beim Lesen von '${key}':`, e);
        return defaultValue;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error(`[AppStorage] Fehler beim Schreiben von '${key}':`, e);
        return false;
      }
    },
    getString(key, defaultValue = "") {
      try {
        const val = localStorage.getItem(key);
        return val !== null ? val : defaultValue;
      } catch (e) {
        console.warn(`[AppStorage] Fehler beim Lesen des Strings '${key}':`, e);
        return defaultValue;
      }
    },
    setString(key, value) {
      try {
        localStorage.setItem(key, String(value));
        return true;
      } catch (e) {
        console.error(`[AppStorage] Fehler beim Schreiben des Strings '${key}':`, e);
        return false;
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.warn(`[AppStorage] Fehler beim L\xF6schen von '${key}':`, e);
        return false;
      }
    }
  };
  window.addEventListener("error", (event) => {
    console.error("[Flow Global Error Boundary]:", event.error || event.message);
    const appContainer = document.getElementById("app");
    if (appContainer && appContainer.innerHTML.trim() === "") {
      showCrashRecoveryScreen(event.message);
    }
  });
  window.addEventListener("unhandledrejection", (event) => {
    console.warn("[Flow Unhandled Promise Rejection]:", event.reason);
  });
  function showCrashRecoveryScreen(errorMsg = "") {
    let overlay = document.getElementById("flow-crash-recovery-overlay");
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.id = "flow-crash-recovery-overlay";
    overlay.style.cssText = "position:fixed;inset:0;background:#0d0d14;color:#fff;z-index:999999;display:flex;align-items:center;justify-content:center;padding:24px;font-family:sans-serif;text-align:center;";
    overlay.innerHTML = `
    <div style="max-width:440px;background:#151522;border:1px solid rgba(168,85,247,0.3);padding:32px;border-radius:24px;box-shadow:0 20px 40px rgba(0,0,0,0.8);">
      <div style="font-size:3rem;margin-bottom:12px;">\u{1F30A}</div>
      <h2 style="font-size:1.3rem;font-weight:bold;margin-bottom:8px;">Flow sicher neu starten</h2>
      <p style="font-size:0.85rem;color:#a1a1aa;margin-bottom:20px;line-height:1.5;">Ein Browser-Skript hat sich kurz verschluckt. Deine Aufgaben und Daten sind sicher gespeichert.</p>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <button onclick="window.location.reload()" style="padding:12px 20px;background:linear-gradient(135deg,#06b6d4,#10b981);color:#000;border:none;border-radius:12px;font-weight:bold;cursor:pointer;font-size:0.9rem;">App neu laden \u{1F504}</button>
        <button onclick="window.location.reload(true)" style="padding:10px 16px;background:rgba(255,255,255,0.06);color:#ccc;border:1px solid rgba(255,255,255,0.12);border-radius:12px;cursor:pointer;font-size:0.8rem;">Sicherer Neustart \u{1F6E1}\uFE0F</button>
      </div>
    </div>
  `;
    document.body.appendChild(overlay);
  }
  if (typeof window !== "undefined") {
    window.AppStorage = AppStorage2;
    window.showCrashRecoveryScreen = showCrashRecoveryScreen;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.AppStorage = AppStorage2;
    globalThis.showCrashRecoveryScreen = showCrashRecoveryScreen;
  }

  // state.js
  var currentLang2 = localStorage.getItem("flowPlannerLanguage") || "en";
  var rawTheme = localStorage.getItem("flowPlannerTheme") || "aurora";
  var currentTheme2 = ["mono-hand", "parchment", "minimalist-light", "terracotta-light"].includes(rawTheme) ? "aurora" : rawTheme;
  var isMinimalist2 = localStorage.getItem("flowPlannerMinimalist") === "true";
  var categoriesOrder2 = null;
  var state2 = null;
  var historyStack = [];
  function loadCategoriesOrder() {
    try {
      const saved = localStorage.getItem("flowPlannerCategoriesOrder");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("[State] loadCategoriesOrder warning:", e);
    }
    return [
      ["daily", "sun"],
      ["weekly", "calendar-days"],
      ["todo", "list-todo"],
      ["done", "check-circle"],
      ["termine", "clock"],
      ["notes", "sticky-note"],
      ["occasionally", "calendar-range"]
    ];
  }
  function loadWorkCategoriesOrder() {
    try {
      const saved = localStorage.getItem("flowPlannerWorkCategoriesOrder");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("[State] loadWorkCategoriesOrder warning:", e);
    }
    return [
      ["work_focus", "target"],
      ["work_in_progress", "zap"],
      ["work_waiting", "hourglass"],
      ["work_backlog", "folder-kanban"],
      ["done", "check-circle"],
      ["termine", "clock"],
      ["notes", "sticky-note"]
    ];
  }
  var workCategoriesOrder2 = null;
  var DEFAULT_WORK_TASKS_BY_LANG = {
    de: {
      work_focus: ["Wichtigste Tagesaufgabe (Must-Do)", "E-Mails & Priorit\xE4ten sortieren (15 Min.)"],
      work_in_progress: ["Projekt-Konzept ausarbeiten", "Kundenanfrage beantworten"],
      work_waiting: ["Feedback von Kollege/Chef zu Entwurf", "Angebot Freigabe Kunde A"],
      work_backlog: ["Dokumentation aktualisieren", "Monatsbericht vorbereiten", "Recherchen Q4"],
      termine: [],
      notes: ["Wichtige Links & Notizen zum aktuellen Sprint..."]
    },
    en: {
      work_focus: ["Key priority of the day (Must-Do)", "Sort emails & daily priorities (15 min)"],
      work_in_progress: ["Draft project concept", "Answer client inquiry"],
      work_waiting: ["Waiting on design feedback", "Client invoice approval"],
      work_backlog: ["Update documentation", "Prepare monthly report", "Q4 Research"],
      termine: [],
      notes: ["Key links & scratchpad for current sprint..."]
    },
    es: {
      work_focus: ["Prioridad clave del d\xEDa (Must-Do)", "Revisar correos y prioridades"],
      work_in_progress: ["Elaborar concepto del proyecto", "Responder consulta de cliente"],
      work_waiting: ["Esperando comentarios de dise\xF1o", "Aprobaci\xF3n de factura"],
      work_backlog: ["Actualizar documentaci\xF3n", "Preparar informe mensual"],
      termine: [],
      notes: ["Notas clave y enlaces del sprint..."]
    },
    fr: {
      work_focus: ["Priorit\xE9 cl\xE9 du jour (Must-Do)", "Trier les e-mails et priorit\xE9s"],
      work_in_progress: ["R\xE9diger le concept du projet", "R\xE9pondre \xE0 la demande client"],
      work_waiting: ["En attente du retour client", "Validation du devis"],
      work_backlog: ["Mettre \xE0 jour la documentation", "Pr\xE9parer le rapport mensuel"],
      termine: [],
      notes: ["Notes et liens importants..."]
    },
    it: {
      work_focus: ["Priorit\xE0 chiave del giorno (Must-Do)", "Controllare email e priorit\xE0"],
      work_in_progress: ["Sviluppare concetto del progetto", "Rispondere alla richiesta del cliente"],
      work_waiting: ["In attesa di feedback", "Approvazione preventivo"],
      work_backlog: ["Aggiornare documentazione", "Preparare report mensile"],
      termine: [],
      notes: ["Note e link importanti..."]
    },
    el: {
      work_focus: ["\u039A\u03CD\u03C1\u03B9\u03B1 \u03C0\u03C1\u03BF\u03C4\u03B5\u03C1\u03B1\u03B9\u03CC\u03C4\u03B7\u03C4\u03B1 \u03B7\u03BC\u03AD\u03C1\u03B1\u03C2 (Must-Do)", "\u0388\u03BB\u03B5\u03B3\u03C7\u03BF\u03C2 email & \u03C0\u03C1\u03BF\u03C4\u03B5\u03C1\u03B1\u03B9\u03BF\u03C4\u03AE\u03C4\u03C9\u03BD"],
      work_in_progress: ["\u03A3\u03CD\u03BD\u03C4\u03B1\u03BE\u03B7 \u03C3\u03C7\u03B5\u03B4\u03AF\u03BF\u03C5 \u03AD\u03C1\u03B3\u03BF\u03C5", "\u0391\u03C0\u03AC\u03BD\u03C4\u03B7\u03C3\u03B7 \u03C3\u03B5 \u03B1\u03AF\u03C4\u03B7\u03BC\u03B1 \u03C0\u03B5\u03BB\u03AC\u03C4\u03B7"],
      work_waiting: ["\u0391\u03BD\u03B1\u03BC\u03BF\u03BD\u03AE \u03B3\u03B9\u03B1 \u03C3\u03C7\u03CC\u03BB\u03B9\u03B1", "\u0388\u03B3\u03BA\u03C1\u03B9\u03C3\u03B7 \u03C0\u03C1\u03BF\u03C3\u03C6\u03BF\u03C1\u03AC\u03C2"],
      work_backlog: ["\u0395\u03BD\u03B7\u03BC\u03AD\u03C1\u03C9\u03C3\u03B7 \u03C4\u03B5\u03BA\u03BC\u03B7\u03C1\u03AF\u03C9\u03C3\u03B7\u03C2", "\u03A0\u03C1\u03BF\u03B5\u03C4\u03BF\u03B9\u03BC\u03B1\u03C3\u03AF\u03B1 \u03BC\u03B7\u03BD\u03B9\u03B1\u03AF\u03B1\u03C2 \u03B1\u03BD\u03B1\u03C6\u03BF\u03C1\u03AC\u03C2"],
      termine: [],
      notes: ["\u03A3\u03B7\u03BC\u03B5\u03B9\u03CE\u03C3\u03B5\u03B9\u03C2 & \u03C3\u03CD\u03BD\u03B4\u03B5\u03C3\u03BC\u03BF\u03B9..."]
    }
  };
  function createDefaultWorkItems2(lang) {
    const curL = lang || (typeof currentLang2 !== "undefined" ? currentLang2 : "de");
    const defaults = DEFAULT_WORK_TASKS_BY_LANG[curL] || DEFAULT_WORK_TASKS_BY_LANG["de"];
    return {
      work_focus: [...defaults.work_focus],
      work_in_progress: [...defaults.work_in_progress],
      work_waiting: [...defaults.work_waiting],
      work_backlog: [...defaults.work_backlog],
      termine: [],
      notes: [...defaults.notes]
    };
  }
  function createDefaultCookingState2() {
    return {
      pantryItems: [],
      recipes: [
        {
          id: "pasta-tomate",
          title: "Schnelle Tomaten-Pasta",
          duration: "15 Min",
          ingredients: ["Pasta", "Tomaten", "Knoblauch", "Oliven\xF6l", "Basilikum"],
          steps: ["Wasser aufkochen und die Pasta darin garen.", "Tomaten mit Knoblauch in \xD6l anschwitzen.", "Pasta mit den Tomaten vermengen und mit Basilikum servieren."]
        },
        {
          id: "wrap-huhn",
          title: "Wrap mit H\xE4hnchen und Gem\xFCse",
          duration: "20 Min",
          ingredients: ["Wraps", "H\xE4hnchen", "Salat", "Gurke", "Joghurt"],
          steps: ["H\xE4hnchen kurz erw\xE4rmen.", "Salat und Gurke vorbereiten.", "Alles in den Wrap geben und mit Joghurt abschlie\xDFen."]
        },
        {
          id: "omelette",
          title: "Fr\xFChst\xFCcks-Omelett",
          duration: "10 Min",
          ingredients: ["Eier", "K\xE4se", "Spinat", "Pfeffer", "Salz"],
          steps: ["Eier verquirlen und w\xFCrzen.", "Spinat kurz in der Pfanne and\xFCnsten.", "Eier hinzugeben, mit K\xE4se f\xFCllen und zusammenklappen."]
        },
        {
          id: "linsen-suppe",
          title: "Schnelle Linsensuppe",
          duration: "25 Min",
          ingredients: ["Linsen", "Karotten", "Zwiebel", "Gem\xFCsebr\xFChe", "Kr\xE4uter"],
          steps: ["Zwiebel und Karotten anschwitzen.", "Linsen und Br\xFChe dazugeben und k\xF6cheln lassen.", "Mit Kr\xE4utern w\xFCrzen und servieren."]
        }
      ],
      activeRecipeId: null,
      activeRecipe: null
    };
  }
  function migrateState(raw, lang) {
    const currentL = lang || (typeof currentLang2 !== "undefined" ? currentLang2 : "en");
    const localizedDefaults = typeof DEFAULT_TASKS_BY_LANG !== "undefined" && DEFAULT_TASKS_BY_LANG[currentL] ? DEFAULT_TASKS_BY_LANG[currentL] : typeof DEFAULT_TASKS_BY_LANG !== "undefined" && DEFAULT_TASKS_BY_LANG["en"] ? DEFAULT_TASKS_BY_LANG["en"] : { daily: [], weekly: [], occasionally: [] };
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    if (!raw || typeof raw !== "object") {
      return {
        version: 3,
        lastDate: todayStr,
        activeWorkspace: "private",
        items: {
          daily: [...localizedDefaults.daily || []],
          weekly: [...localizedDefaults.weekly || []],
          occasionally: [...localizedDefaults.occasionally || []],
          todo: [],
          termine: [],
          notes: []
        },
        done: [],
        archive: [],
        streak: 0,
        completedSteps: {},
        customSteps: {},
        workItems: typeof createDefaultWorkItems2 === "function" ? createDefaultWorkItems2(currentL) : {},
        workDone: [],
        sampleBannerDismissed: false,
        shoppingList: [],
        shoppingHistory: [],
        cooking: typeof createDefaultCookingState2 === "function" ? createDefaultCookingState2() : {},
        clarity: { streakDays: 0, lastCheckinDate: null, history: [], savedReasons: [] }
      };
    }
    const s = { ...raw };
    s.version = 3;
    if (!s.lastDate) s.lastDate = todayStr;
    if (!s.items || typeof s.items !== "object") {
      s.items = {
        daily: [...localizedDefaults.daily || []],
        weekly: [...localizedDefaults.weekly || []],
        occasionally: [...localizedDefaults.occasionally || []],
        todo: [],
        termine: [],
        notes: []
      };
    } else {
      ["daily", "weekly", "occasionally", "todo", "termine"].forEach((k) => {
        if (!Array.isArray(s.items[k])) s.items[k] = [];
      });
      if (typeof s.items.notes === "string") {
        s.items.notes = s.items.notes.split("\n").map((x) => x.trim()).filter(Boolean);
      } else if (!Array.isArray(s.items.notes)) {
        s.items.notes = [];
      }
    }
    if (!Array.isArray(s.done)) s.done = [];
    if (!Array.isArray(s.archive)) s.archive = [];
    if (typeof s.streak !== "number") s.streak = 0;
    if (!s.completedSteps || typeof s.completedSteps !== "object") s.completedSteps = {};
    if (!s.customSteps || typeof s.customSteps !== "object") s.customSteps = {};
    if (s.sampleBannerDismissed === void 0) s.sampleBannerDismissed = false;
    s.activeWorkspace = s.activeWorkspace === "work" ? "work" : "private";
    if (!s.workItems || typeof s.workItems !== "object") {
      s.workItems = typeof createDefaultWorkItems2 === "function" ? createDefaultWorkItems2(currentL) : {};
    } else {
      ["work_focus", "work_in_progress", "work_waiting", "work_backlog", "termine", "notes"].forEach((k) => {
        if (!Array.isArray(s.workItems[k])) s.workItems[k] = [];
      });
    }
    if (!Array.isArray(s.workDone)) s.workDone = [];
    if (!Array.isArray(s.shoppingList)) s.shoppingList = [];
    if (!Array.isArray(s.shoppingHistory)) s.shoppingHistory = [];
    if (!s.cooking || typeof s.cooking !== "object") {
      s.cooking = typeof createDefaultCookingState2 === "function" ? createDefaultCookingState2() : {};
    } else {
      s.cooking = {
        pantryItems: Array.isArray(s.cooking.pantryItems) ? s.cooking.pantryItems : [],
        recipes: Array.isArray(s.cooking.recipes) && s.cooking.recipes.length ? s.cooking.recipes : typeof createDefaultCookingState2 === "function" ? createDefaultCookingState2().recipes : [],
        activeRecipeId: s.cooking.activeRecipeId || null,
        activeRecipe: s.cooking.activeRecipe || null
      };
    }
    if (!s.clarity || typeof s.clarity !== "object") {
      s.clarity = { streakDays: 0, lastCheckinDate: null, history: [], savedReasons: [] };
    } else {
      s.clarity.streakDays = s.clarity.streakDays || 0;
      s.clarity.lastCheckinDate = s.clarity.lastCheckinDate || null;
      s.clarity.history = Array.isArray(s.clarity.history) ? s.clarity.history : [];
      s.clarity.savedReasons = Array.isArray(s.clarity.savedReasons) ? s.clarity.savedReasons : [];
    }
    if (Array.isArray(s.items.daily)) {
      const faceWashingTerms = [
        "Gesicht waschen",
        "Wash face",
        "Lavarse la cara",
        "\u03A0\u03BB\u03CD\u03C3\u03B9\u03BC\u03BF \u03C0\u03C1\u03BF\u03C3\u03CE\u03C0\u03BF\u03C5",
        "Se laver le visage",
        "Lavarsi la faccia"
      ];
      let foundFace = false;
      s.items.daily = s.items.daily.filter((item2) => {
        const taskName = typeof item2 === "object" ? item2.task : item2;
        if (faceWashingTerms.includes(taskName)) {
          if (foundFace) return false;
          foundFace = true;
          return true;
        }
        return true;
      });
    }
    return s;
  }
  window.migrateState = migrateState;
  function loadState() {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          return migrateState(parsed, typeof currentLang2 !== "undefined" ? currentLang2 : "de");
        }
      }
    } catch (e) {
      console.warn("[State] loadState parse warning, returning migrated defaults:", e);
    }
    return migrateState(null, typeof currentLang2 !== "undefined" ? currentLang2 : "de");
  }
  function setWorkspace(mode) {
    if (mode !== "private" && mode !== "work") return;
    state2.activeWorkspace = mode;
    saveState2();
    updateWorkspaceSwitchUI2();
    if (typeof renderApp === "function") renderApp();
    if (typeof populateHelperTaskSelect === "function") populateHelperTaskSelect();
    if (typeof showToast === "function") {
      showToast(mode === "work" ? tr2({
        de: "\u{1F4BC} Arbeitsmodus aktiviert!",
        en: "\u{1F4BC} Work mode activated!",
        es: "\u{1F4BC} \xA1Modo trabajo activado!",
        el: "\u{1F4BC} \u0395\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03B9\u03AE\u03B8\u03B7\u03BA\u03B5 \u03BF \u03C7\u03CE\u03C1\u03BF\u03C2 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1\u03C2!",
        fr: "\u{1F4BC} Mode travail activ\xE9 !",
        it: "\u{1F4BC} Modalit\xE0 lavoro attivata!"
      }) : tr2({
        de: "\u{1F3E0} Privatmodus aktiviert!",
        en: "\u{1F3E0} Personal mode activated!",
        es: "\u{1F3E0} \xA1Modo personal activado!",
        el: "\u{1F3E0} \u0395\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03B9\u03AE\u03B8\u03B7\u03BA\u03B5 \u03BF \u03C0\u03C1\u03BF\u03C3\u03C9\u03C0\u03B9\u03BA\u03CC\u03C2 \u03C7\u03CE\u03C1\u03BF\u03C2!",
        fr: "\u{1F3E0} Mode personnel activ\xE9 !",
        it: "\u{1F3E0} Modalit\xE0 personale attivata!"
      }));
    }
  }
  window.setWorkspace = setWorkspace;
  function toggleWorkspace2() {
    const nextMode = state2 && state2.activeWorkspace === "work" ? "private" : "work";
    setWorkspace(nextMode);
  }
  window.toggleWorkspace = toggleWorkspace2;
  function updateWorkspaceSwitchUI2() {
    const currentWs = state2 && state2.activeWorkspace ? state2.activeWorkspace : "private";
    const toggleBtn = document.getElementById("btn-workspace-toggle");
    const iconEl = document.getElementById("ws-toggle-icon");
    const textEl = document.getElementById("ws-toggle-text");
    if (toggleBtn && iconEl && textEl) {
      if (currentWs === "work") {
        iconEl.textContent = "\u{1F4BC}";
        textEl.textContent = t2("workspace_work");
        textEl.className = "text-[11px] font-bold text-blue-300";
        toggleBtn.className = "h-8 px-2.5 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 hover:border-blue-500/60 rounded-xl text-blue-200 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all duration-300 shadow-sm";
        toggleBtn.title = tr2({
          de: "Arbeitsmodus aktiv (Klick zum Wechseln in Privatmodus)",
          en: "Work mode active (Click to switch to personal mode)",
          es: "Modo trabajo activo (Clic para cambiar a personal)",
          el: "\u03A7\u03CE\u03C1\u03BF\u03C2 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1\u03C2 \u03B5\u03BD\u03B5\u03C1\u03B3\u03CC\u03C2 (\u039A\u03BB\u03B9\u03BA \u03B3\u03B9\u03B1 \u03B5\u03BD\u03B1\u03BB\u03BB\u03B1\u03B3\u03AE)",
          fr: "Mode travail actif (Cliquer pour passer en personnel)",
          it: "Modalit\xE0 lavoro attiva (Clicca per passare a personale)"
        });
      } else {
        iconEl.textContent = "\u{1F3E0}";
        textEl.textContent = t2("workspace_private");
        textEl.className = "text-[11px] font-bold text-purple-300";
        toggleBtn.className = "h-8 px-2.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 hover:border-purple-500/50 rounded-xl text-purple-200 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all duration-300 shadow-sm";
        toggleBtn.title = tr2({
          de: "Privatmodus aktiv (Klick zum Wechseln in Arbeitsmodus)",
          en: "Personal mode active (Click to switch to work mode)",
          es: "Modo personal activo (Clic para cambiar a trabajo)",
          el: "\u03A0\u03C1\u03BF\u03C3\u03C9\u03C0\u03B9\u03BA\u03CC\u03C2 \u03C7\u03CE\u03C1\u03BF\u03C2 \u03B5\u03BD\u03B5\u03C1\u03B3\u03CC\u03C2 (\u039A\u03BB\u03B9\u03BA \u03B3\u03B9\u03B1 \u03B5\u03BD\u03B1\u03BB\u03BB\u03B1\u03B3\u03AE)",
          fr: "Mode personnel actif (Cliquer pour passer en travail)",
          it: "Modalit\xE0 personale attiva (Clicca per passare a lavoro)"
        });
      }
    }
  }
  window.updateWorkspaceSwitchUI = updateWorkspaceSwitchUI2;
  function loadHistory() {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("[State] loadHistory warning:", e);
    }
    return [];
  }
  categoriesOrder2 = loadCategoriesOrder();
  workCategoriesOrder2 = loadWorkCategoriesOrder();
  state2 = loadState();
  historyStack = loadHistory();
  function saveState2(skipP2PSync = false) {
    const currentState = typeof window !== "undefined" && window.state ? window.state : state2;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(currentState));
    } catch (e) {
      console.warn("[State] Storage quota exceeded or write failed, attempting emergency trim:", e);
      try {
        if (currentState && Array.isArray(currentState.archive) && currentState.archive.length > 50) {
          currentState.archive.splice(0, currentState.archive.length - 30);
        }
        if (currentState && Array.isArray(currentState.shoppingHistory) && currentState.shoppingHistory.length > 50) {
          currentState.shoppingHistory.splice(0, currentState.shoppingHistory.length - 30);
        }
        localStorage.setItem(STORE_KEY, JSON.stringify(currentState));
      } catch (err) {
        console.error("[State] Critical failure writing state to localStorage:", err);
      }
    }
    if (!skipP2PSync && typeof p2pSyncEngine !== "undefined" && p2pSyncEngine.isConnected()) {
      p2pSyncEngine.broadcastStateUpdate();
    }
  }
  function persistHistory() {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(historyStack));
  }
  function saveHistory2() {
    historyStack.push(JSON.parse(JSON.stringify(state2)));
    if (historyStack.length > 20) historyStack.shift();
    persistHistory();
  }
  function t2(key) {
    return TRANSLATIONS[currentLang2]?.[key] || TRANSLATIONS["en"]?.[key] || TRANSLATIONS["de"]?.[key] || key;
  }
  function tr2(map) {
    return map[currentLang2] || map.en || map.de || Object.values(map)[0] || "";
  }
  function handleUndo2() {
    if (historyStack.length === 0) {
      showToast(t2("toast_no_undo"));
      return;
    }
    state2 = historyStack.pop();
    persistHistory();
    saveState2();
    showToast(t2("toast_undo_applied"));
    renderApp();
    populateHelperTaskSelect();
  }
  if (typeof window !== "undefined") {
    window.saveState = saveState2;
    window.loadState = loadState;
    window.saveHistory = saveHistory2;
    window.loadHistory = loadHistory;
    window.migrateState = migrateState;
    window.handleUndo = handleUndo2;
    window.t = t2;
    window.tr = tr2;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.saveState = saveState2;
    globalThis.loadState = loadState;
    globalThis.saveHistory = saveHistory2;
    globalThis.loadHistory = loadHistory;
    globalThis.migrateState = migrateState;
    globalThis.handleUndo = handleUndo2;
    globalThis.t = t2;
    globalThis.tr = tr2;
  }

  // sync-engine.js
  var MinimalQR = /* @__PURE__ */ (function() {
    function generateQRCodeSVG(text, size = 220) {
      if (!text) return "";
      try {
        const qrLib = typeof QRCode !== "undefined" ? QRCode : typeof window !== "undefined" ? window.QRCode : typeof globalThis !== "undefined" ? globalThis.QRCode : null;
        if (qrLib) {
          let svgOut = "";
          qrLib.toString(text, { type: "svg", margin: 2, width: size, errorCorrectionLevel: "M" }, (err, svg) => {
            if (!err && svg) svgOut = svg;
          });
          if (svgOut) {
            return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgOut)}`;
          }
        }
      } catch (e) {
        console.warn("[QR Engine] Error generating QR with QRCode vendor:", e);
      }
      return "";
    }
    return {
      generateQRCodeSVG
    };
  })();
  var P2PDataCodec = {
    encodeState(stateObj) {
      try {
        if (!stateObj) return "";
        const minimalState = {
          w: stateObj.activeWorkspace === "work" ? 1 : 0,
          i: stateObj.items || {},
          d: (stateObj.done || []).slice(0, 15),
          wi: stateObj.workItems || {},
          wd: (stateObj.workDone || []).slice(0, 15)
        };
        const json = JSON.stringify(minimalState);
        return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      } catch (e) {
        console.error("[P2P] Encode error:", e);
        return "";
      }
    },
    decodeState(encodedStr) {
      try {
        if (!encodedStr) return null;
        let base64 = String(encodedStr).replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4 !== 0) base64 += "=";
        const json = decodeURIComponent(escape(atob(base64)));
        const parsed = JSON.parse(json);
        if (parsed.w !== void 0 || parsed.i !== void 0) {
          return {
            items: parsed.i || {},
            done: parsed.d || [],
            workItems: parsed.wi || {},
            workDone: parsed.wd || [],
            ws: parsed.w === 1 ? "work" : "private"
          };
        }
        return parsed;
      } catch (e) {
        console.error("[P2P] Decode error:", e);
        return null;
      }
    }
  };
  window.MinimalQR = MinimalQR;
  window.P2PDataCodec = P2PDataCodec;
  var p2pSyncEngine2 = {
    roomId: null,
    isHost: false,
    peerConnection: null,
    dataChannel: null,
    connected: false,
    signalingChannel: null,
    lastBroadcastTime: 0,
    customBaseUrl: "",
    discoveredLanUrl: "",
    init() {
      this.checkUrlForIncomingSync();
      this.detectLocalLanIp();
    },
    detectLocalLanIp() {
      try {
        if (typeof window === "undefined" || typeof RTCPeerConnection === "undefined") return;
        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel("");
        pc.createOffer().then((o) => pc.setLocalDescription(o)).catch(() => {
        });
        pc.onicecandidate = (e) => {
          if (!e || !e.candidate || !e.candidate.candidate) return;
          const match = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(e.candidate.candidate);
          if (match && match[1] && !match[1].startsWith("127.")) {
            const lanIp = match[1];
            const port = window.location.port ? `:${window.location.port}` : "";
            const path = window.location.pathname || "/";
            const fullLan = `http://${lanIp}${port}${path}`;
            this.discoveredLanUrl = fullLan;
            const ipInput = document.getElementById("p2p-custom-ip-input");
            if (ipInput && !ipInput.value) {
              ipInput.value = fullLan;
            }
            pc.onicecandidate = null;
            try {
              pc.close();
            } catch (err) {
            }
          }
        };
        setTimeout(() => {
          try {
            pc.close();
          } catch (err) {
          }
        }, 1800);
      } catch (e) {
      }
    },
    isConnected() {
      return this.connected;
    },
    generateRoomId() {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let id = "FLOW-";
      for (let i = 0; i < 4; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
    },
    startHost(customUrl = null) {
      this.isHost = true;
      if (!this.roomId) {
        this.roomId = this.generateRoomId();
      }
      let baseUrl = customUrl || this.customBaseUrl;
      if (!baseUrl) {
        if (typeof window !== "undefined") {
          if (window.location.protocol === "file:") {
            baseUrl = "https://cableblues.github.io/Flow-Organiser/";
          } else if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            baseUrl = this.discoveredLanUrl || window.location.origin + window.location.pathname;
          } else {
            baseUrl = window.location.origin + window.location.pathname;
          }
        } else {
          baseUrl = "https://cableblues.github.io/Flow-Organiser/";
        }
      }
      const ipHelper = document.getElementById("p2p-ip-helper");
      if (ipHelper && typeof window !== "undefined") {
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:";
        ipHelper.classList.toggle("hidden", !isLocal);
      }
      const payload = P2PDataCodec.encodeState(state);
      const cleanBase = baseUrl.replace(/\/+$/, "");
      const shareUrl = `${cleanBase}/#sync=${this.roomId}&data=${payload}`;
      const codeDisplay = document.getElementById("p2p-room-code");
      if (codeDisplay) codeDisplay.innerText = this.roomId;
      const qrImg = document.getElementById("p2p-qr-img");
      if (qrImg) {
        qrImg.src = MinimalQR.generateQRCodeSVG(shareUrl, 260);
      }
      const shareInput = document.getElementById("p2p-share-link-input");
      if (shareInput) shareInput.value = shareUrl;
      const rawCodeInput = document.getElementById("p2p-raw-payload-input");
      if (rawCodeInput) rawCodeInput.value = payload;
      this.setupSignaling(this.roomId, true);
      this.updateStatusBadge("waiting");
    },
    connectAsClient(targetRoomId, compressedData) {
      this.isHost = false;
      this.roomId = targetRoomId;
      if (compressedData) {
        const imported = P2PDataCodec.decodeState(compressedData);
        if (imported && imported.items) {
          state.items = imported.items;
          if (imported.done) state.done = imported.done;
          if (imported.workItems) state.workItems = imported.workItems;
          if (imported.workDone) state.workDone = imported.workDone;
          if (imported.ws) state.activeWorkspace = imported.ws;
          if (typeof saveState === "function") saveState(true);
          if (typeof renderApp === "function") renderApp();
          if (typeof showToast === "function") {
            showToast(tr({
              de: "\u{1F4F1} Plan erfolgreich vom PC \xFCbertragen! \u26A1",
              en: "\u{1F4F1} Plan successfully transferred from PC! \u26A1",
              es: "\u{1F4F1} \xA1Plan transferido con \xE9xito desde el PC! \u26A1",
              el: "\u{1F4F1} \u03A4\u03BF \u03C0\u03BB\u03AC\u03BD\u03BF \u03BC\u03B5\u03C4\u03B1\u03C6\u03AD\u03C1\u03B8\u03B7\u03BA\u03B5 \u03B5\u03C0\u03B9\u03C4\u03C5\u03C7\u03CE\u03C2! \u26A1",
              fr: "\u{1F4F1} Plan transf\xE9r\xE9 avec succ\xE8s depuis le PC ! \u26A1",
              it: "\u{1F4F1} Piano trasferito con successo dal PC! \u26A1"
            }));
          }
        }
      }
      this.setupSignaling(targetRoomId, false);
    },
    setupSignaling(roomId, isHost) {
      try {
        if (typeof BroadcastChannel !== "undefined") {
          if (this.signalingChannel) this.signalingChannel.close();
          this.signalingChannel = new BroadcastChannel(`flow_p2p_${roomId}`);
          this.signalingChannel.onmessage = (event) => {
            const msg = event.data;
            if (!msg) return;
            if (msg.type === "PEER_PING" && isHost) {
              this.signalingChannel.postMessage({ type: "PEER_PONG", state });
              this.setConnectedState(true);
            } else if (msg.type === "PEER_PONG" && !isHost) {
              this.setConnectedState(true);
            } else if (msg.type === "SYNC_DELTA") {
              this.applyIncomingUpdate(msg.data);
            }
          };
          if (!isHost) {
            this.signalingChannel.postMessage({ type: "PEER_PING" });
          }
        }
      } catch (e) {
        console.warn("[P2P] Signaling notice:", e);
      }
    },
    setConnectedState(isConnected) {
      this.connected = isConnected;
      this.updateStatusBadge(isConnected ? "connected" : "waiting");
      if (isConnected && typeof showToast === "function") {
        showToast(tr({
          de: "\u{1F7E2} Handy & PC verbunden! Live-Sync aktiv.",
          en: "\u{1F7E2} Phone & PC connected! Live-sync active.",
          es: "\u{1F7E2} \xA1Dispositivos conectados! Sincronizaci\xF3n en vivo.",
          el: "\u{1F7E2} \u03A3\u03C5\u03BD\u03B4\u03AD\u03B8\u03B7\u03BA\u03B5! \u0396\u03C9\u03BD\u03C4\u03B1\u03BD\u03CC\u03C2 \u03C3\u03C5\u03B3\u03C7\u03C1\u03BF\u03BD\u03B9\u03C3\u03BC\u03CC\u03C2 \u03B5\u03BD\u03B5\u03C1\u03B3\u03CC\u03C2.",
          fr: "\u{1F7E2} Connect\xE9 ! Synchronisation en direct active.",
          it: "\u{1F7E2} Dispositivi connessi! Sincronizzazione attiva."
        }));
      }
    },
    updateStatusBadge(status) {
      const badge = document.getElementById("p2p-status-badge");
      if (!badge) return;
      if (status === "connected") {
        badge.className = "px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-sm";
        badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span><span>\u{1F7E2} Live-Sync aktiv</span>';
      } else {
        badge.className = "px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium font-mono flex items-center justify-center gap-2";
        badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span><span>Warte auf QR-Scan...</span>';
      }
    },
    broadcastStateUpdate() {
      const now = Date.now();
      if (now - this.lastBroadcastTime < 200) return;
      this.lastBroadcastTime = now;
      if (this.signalingChannel) {
        this.signalingChannel.postMessage({
          type: "SYNC_DELTA",
          data: {
            items: state.items,
            done: state.done,
            workItems: state.workItems,
            workDone: state.workDone,
            activeWorkspace: state.activeWorkspace
          }
        });
      }
    },
    applyIncomingUpdate(data) {
      if (!data) return;
      let changed = false;
      if (data.items) {
        state.items = data.items;
        changed = true;
      }
      if (data.done) {
        state.done = data.done;
        changed = true;
      }
      if (data.workItems) {
        state.workItems = data.workItems;
        changed = true;
      }
      if (data.workDone) {
        state.workDone = data.workDone;
        changed = true;
      }
      if (data.activeWorkspace) {
        state.activeWorkspace = data.activeWorkspace;
        changed = true;
      }
      if (changed) {
        localStorage.setItem("flowPlannerState", JSON.stringify(state));
        if (typeof renderApp === "function") renderApp();
        if (typeof triggerSparkleEffect === "function") triggerSparkleEffect();
      }
    },
    checkUrlForIncomingSync() {
      if (typeof window === "undefined" || !window.location.hash) return;
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const syncRoom = params.get("sync");
      const syncData = params.get("data");
      if (syncRoom || syncData) {
        try {
          history.replaceState(null, document.title, window.location.pathname + window.location.search);
        } catch (e) {
        }
        this.connectAsClient(syncRoom, syncData);
      }
    }
  };
  window.p2pSyncEngine = p2pSyncEngine2;
  function openP2PSyncModal() {
    const modal = document.getElementById("modal-p2p-sync");
    if (modal) {
      modal.classList.remove("hidden");
      p2pSyncEngine2.startHost();
      if (typeof lucide !== "undefined") lucide.createIcons();
    }
  }
  window.openP2PSyncModal = openP2PSyncModal;
  function closeP2PSyncModal2() {
    const modal = document.getElementById("modal-p2p-sync");
    if (modal) modal.classList.add("hidden");
  }
  window.closeP2PSyncModal = closeP2PSyncModal2;
  function copyP2PShareLink() {
    const input = document.getElementById("p2p-share-link-input");
    if (input && input.value) {
      navigator.clipboard.writeText(input.value).then(() => {
        if (typeof showToast === "function") {
          showToast(tr({
            de: "\u{1F4CB} Link kopiert! Auf dem Smartphone \xF6ffnen.",
            en: "\u{1F4CB} Link copied! Open on your smartphone.",
            es: "\u{1F4CB} \xA1Enlace copiado! Abrir en el smartphone.",
            el: "\u{1F4CB} \u039F \u03C3\u03CD\u03BD\u03B4\u03B5\u03C3\u03BC\u03BF\u03C2 \u03B1\u03BD\u03C4\u03B9\u03B3\u03C1\u03AC\u03C6\u03B7\u03BA\u03B5!",
            fr: "\u{1F4CB} Lien copi\xE9 ! Ouvrir sur smartphone.",
            it: "\u{1F4CB} Link copiato! Apri sullo smartphone."
          }));
        }
      });
    }
  }
  window.copyP2PShareLink = copyP2PShareLink;
  function updateP2PCustomUrl(newUrl) {
    if (!newUrl) return;
    p2pSyncEngine2.customBaseUrl = newUrl.trim();
    p2pSyncEngine2.startHost(newUrl.trim());
  }
  window.updateP2PCustomUrl = updateP2PCustomUrl;
  function copyP2PRawPayload() {
    const input = document.getElementById("p2p-raw-payload-input");
    if (input && input.value) {
      navigator.clipboard.writeText(input.value).then(() => {
        if (typeof showToast === "function") {
          showToast(tr({
            de: "\u{1F4CB} Transfer-Code kopiert!",
            en: "\u{1F4CB} Transfer code copied!",
            es: "\u{1F4CB} \xA1C\xF3digo de transferencia copiado!",
            el: "\u{1F4CB} \u039F \u03BA\u03C9\u03B4\u03B9\u03BA\u03CC\u03C2 \u03B1\u03BD\u03C4\u03B9\u03B3\u03C1\u03AC\u03C6\u03B7\u03BA\u03B5!",
            fr: "\u{1F4CB} Code de transfert copi\xE9 !",
            it: "\u{1F4CB} Codice di trasferimento copiato!"
          }));
        }
      });
    }
  }
  window.copyP2PRawPayload = copyP2PRawPayload;
  function importP2PCode() {
    const raw = prompt(tr({
      de: "F\xFCge den Transfer-Code oder die Sync-URL ein:",
      en: "Paste the transfer code or sync URL:",
      es: "Pega el c\xF3digo de transferencia o URL de sincronizaci\xF3n:",
      el: "\u0395\u03C0\u03B9\u03BA\u03BF\u03BB\u03BB\u03AE\u03C3\u03C4\u03B5 \u03C4\u03BF\u03BD \u03BA\u03C9\u03B4\u03B9\u03BA\u03CC \u03BC\u03B5\u03C4\u03B1\u03C6\u03BF\u03C1\u03AC\u03C2 \u03AE \u03C4\u03B7 \u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 URL:",
      fr: "Collez le code de transfert ou l'URL de synchronisation :",
      it: "Incolla il codice di trasferimento o l'URL di sincronizzazione:"
    }));
    if (!raw || !raw.trim()) return;
    const trimmed = raw.trim();
    let syncData = null;
    let syncRoom = null;
    if (trimmed.includes("#")) {
      const hash = trimmed.split("#")[1] || "";
      const params = new URLSearchParams(hash);
      syncRoom = params.get("sync");
      syncData = params.get("data");
    } else if (trimmed.includes("=")) {
      const params = new URLSearchParams(trimmed);
      syncRoom = params.get("sync");
      syncData = params.get("data") || trimmed;
    } else {
      syncData = trimmed;
      syncRoom = "FLOW-MANUAL";
    }
    if (syncData) {
      p2pSyncEngine2.connectAsClient(syncRoom || "FLOW-MANUAL", syncData);
      closeP2PSyncModal2();
    } else {
      alert("Ung\xFCltiger Code!");
    }
  }
  window.importP2PCode = importP2PCode;
  function switchP2PTab(tab) {
    const paneQr = document.getElementById("p2p-pane-qr");
    const paneManual = document.getElementById("p2p-pane-manual");
    const btnQr = document.getElementById("p2p-tab-btn-qr");
    const btnManual = document.getElementById("p2p-tab-btn-manual");
    if (paneQr && paneManual && btnQr && btnManual) {
      const isQr = tab === "qr";
      paneQr.classList.toggle("hidden", !isQr);
      paneManual.classList.toggle("hidden", isQr);
      btnQr.className = isQr ? "flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 transition" : "flex-1 py-1.5 px-3 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition";
      btnManual.className = !isQr ? "flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 transition" : "flex-1 py-1.5 px-3 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition";
    }
  }
  if (typeof window !== "undefined") {
    window.MinimalQR = MinimalQR;
    window.P2PDataCodec = P2PDataCodec;
    window.p2pSyncEngine = p2pSyncEngine2;
    window.openP2PSyncModal = openP2PSyncModal;
    window.closeP2PSyncModal = closeP2PSyncModal2;
    window.switchP2PTab = switchP2PTab;
    window.addEventListener("DOMContentLoaded", () => {
      p2pSyncEngine2.init();
    });
  }
  if (typeof globalThis !== "undefined") {
    globalThis.MinimalQR = MinimalQR;
    globalThis.P2PDataCodec = P2PDataCodec;
    globalThis.p2pSyncEngine = p2pSyncEngine2;
    globalThis.openP2PSyncModal = openP2PSyncModal;
    globalThis.closeP2PSyncModal = closeP2PSyncModal2;
    globalThis.switchP2PTab = switchP2PTab;
  }

  // utils.js
  function escapeHtml2(str) {
    if (str === null || str === void 0) return "";
    if (typeof str !== "string") str = String(str);
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  window.escapeHtml = escapeHtml2;
  var PanelManager = {
    panels: ["feedback", "report", "settings", "soundscape", "language", "boost", "music", "theme", "calendar-dropdown", "inspiration", "shopping", "cooking", "alarm", "weather", "news", "pause-dropdown", "logo-guide"],
    open(name) {
      this.panels.forEach((p) => {
        const el = document.getElementById(`panel-${p}`);
        if (el) {
          if (p === name) el.classList.remove("hidden");
          else el.classList.add("hidden");
        }
      });
      window.currentlyOpenPanel = name;
    },
    close(name) {
      const el = document.getElementById(`panel-${name}`);
      if (el) el.classList.add("hidden");
      if (window.currentlyOpenPanel === name) window.currentlyOpenPanel = null;
    },
    closeAll() {
      this.panels.forEach((p) => {
        const el = document.getElementById(`panel-${p}`);
        if (el) el.classList.add("hidden");
      });
      window.currentlyOpenPanel = null;
    },
    toggle(name) {
      const el = document.getElementById(`panel-${name}`);
      if (!el) return;
      if (el.classList.contains("hidden")) this.open(name);
      else this.close(name);
    }
  };
  window.PanelManager = PanelManager;
  var ModalManager = {
    modals: ["helper-whatnow-modal", "helper-sport-modal", "clarity-modal", "feierabend-modal", "game-mode-container", "mobile-menu-drawer", "mobile-tools-sheet"],
    open(id) {
      const el = document.getElementById(id);
      if (el) el.classList.remove("hidden");
    },
    close(id) {
      const el = document.getElementById(id);
      if (el) el.classList.add("hidden");
    },
    closeAll() {
      this.modals.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
      });
    }
  };
  window.ModalManager = ModalManager;
  if (typeof document !== "undefined") {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        PanelManager.closeAll();
        ModalManager.closeAll();
      }
    });
  }
  var lucideBatchScheduled = false;
  function doRenderLucideIcons() {
    if (typeof lucide === "undefined" || !lucide.createIcons) {
      if (typeof window !== "undefined") {
        [50, 150, 350, 800].forEach((delay) => {
          setTimeout(() => {
            if (typeof lucide !== "undefined" && lucide.createIcons) {
              try {
                lucide.createIcons();
              } catch (e) {
              }
            }
          }, delay);
        });
      }
      return;
    }
    try {
      lucide.createIcons();
    } catch (e) {
      console.warn("[Lucide] Batch createIcons notice:", e);
      try {
        const iconNodes = document.querySelectorAll("[data-lucide]");
        iconNodes.forEach((node) => {
          const name = node.getAttribute("data-lucide");
          if (!name) return;
          try {
            if (lucide.icons && lucide.icons[name]) {
              const svg = lucide.icons[name].toSvg({ class: node.className });
              node.outerHTML = svg;
            }
          } catch (err) {
          }
        });
      } catch (err2) {
      }
    }
  }
  function renderLucideIcons2(immediate = false) {
    if (immediate) {
      doRenderLucideIcons();
      return;
    }
    if (lucideBatchScheduled) return;
    lucideBatchScheduled = true;
    if (typeof requestAnimationFrame !== "undefined") {
      requestAnimationFrame(() => {
        lucideBatchScheduled = false;
        doRenderLucideIcons();
      });
    } else {
      setTimeout(() => {
        lucideBatchScheduled = false;
        doRenderLucideIcons();
      }, 0);
    }
  }
  window.renderLucideIcons = renderLucideIcons2;
  var celebrationParticleIndex = 0;
  function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;
      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }
  function triggerCelebrationParticles2(customX, customY) {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const effectType = celebrationParticleIndex % 5;
    celebrationParticleIndex++;
    const startX = typeof customX === "number" && customX > 0 ? customX : canvas.width / 2;
    const startY = typeof customY === "number" && customY > 0 ? customY : effectType === 3 ? canvas.height * 0.85 : canvas.height * 0.45;
    const particles = [];
    const particleCount = effectType === 3 ? 45 : 85;
    const colorPalettes = {
      0: ["#8b5cf6", "#38bdf8", "#10b981", "#ec4899", "#f59e0b", "#fb7185", "#facc15"],
      // Konfetti
      1: ["#f472b6", "#fbcfe8", "#fb7185", "#fda4af", "#f43f5e", "#fff1f2", "#e879f9"],
      // Sakura-Blüten
      2: ["#facc15", "#fde047", "#fef08a", "#fbbf24", "#f59e0b", "#ffffff", "#e2e8f0"],
      // Goldene Sterne
      3: ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"],
      // Bunte Ballons
      4: ["#38bdf8", "#818cf8", "#c084fc", "#f472b6", "#67e8f9", "#a7f3d0", "#fde047"]
      // Schillernde Seifenblasen
    };
    const colors = colorPalettes[effectType];
    for (let i = 0; i < particleCount; i++) {
      let vx = (Math.random() - 0.5) * (effectType === 3 ? 10 : 22);
      let vy = effectType === 3 ? -(Math.random() * 8 + 6) : (Math.random() - 0.5) * 20 - 10;
      particles.push({
        x: startX + (Math.random() - 0.5) * 60,
        y: startY + (Math.random() - 0.5) * 40,
        vx,
        vy,
        gravity: effectType === 3 ? -0.06 : effectType === 1 ? 0.22 : 0.42,
        friction: effectType === 3 ? 0.99 : 0.975,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: effectType === 3 ? Math.random() * 12 + 14 : effectType === 1 ? Math.random() * 8 + 6 : Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * (effectType === 3 ? 2 : 10),
        opacity: 1,
        sway: Math.random() * 10,
        swaySpeed: Math.random() * 0.08 + 0.03
      });
    }
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      particles.forEach((p) => {
        if (p.opacity > 0 && p.y > -80 && p.y < canvas.height + 80) {
          p.sway += p.swaySpeed;
          p.x += p.vx + Math.sin(p.sway) * (effectType === 1 ? 1.5 : 0.6);
          p.y += p.vy;
          p.vy += p.gravity;
          p.vx *= p.friction;
          p.opacity -= effectType === 3 ? 7e-3 : 0.011;
          p.rotation += p.rotationSpeed;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation * Math.PI / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          if (effectType === 0) {
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          } else if (effectType === 1) {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.moveTo(0, -p.size);
            ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
            ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
            ctx.fill();
          } else if (effectType === 2) {
            ctx.fillStyle = p.color;
            drawStar(ctx, 0, 0, 5, p.size, p.size * 0.5);
          } else if (effectType === 3) {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 0.75, p.size, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,0.4)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, p.size);
            ctx.lineTo(Math.sin(p.sway) * 4, p.size + 14);
            ctx.stroke();
          } else if (effectType === 4) {
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1.5;
            ctx.fillStyle = "rgba(255,255,255,0.06)";
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.beginPath();
            ctx.arc(-p.size * 0.35, -p.size * 0.35, p.size * 0.25, 0, Math.PI * 2);
            ctx.fill();
          }
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
  function triggerConfetti2(x, y) {
    triggerCelebrationParticles2(x, y);
  }
  window.triggerCelebrationParticles = triggerCelebrationParticles2;
  window.triggerConfetti = triggerConfetti2;
  function openPrivacyModal() {
    const modal = document.getElementById("privacy-legal-modal");
    if (modal) {
      modal.classList.remove("hidden");
      if (typeof lucide !== "undefined") lucide.createIcons();
    }
  }
  function closePrivacyModal2() {
    const modal = document.getElementById("privacy-legal-modal");
    if (modal) modal.classList.add("hidden");
  }
  if (typeof window !== "undefined") {
    window.escapeHtml = escapeHtml2;
    window.PanelManager = PanelManager;
    window.ModalManager = ModalManager;
    window.openPrivacyModal = openPrivacyModal;
    window.closePrivacyModal = closePrivacyModal2;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.escapeHtml = escapeHtml2;
    globalThis.PanelManager = PanelManager;
    globalThis.ModalManager = ModalManager;
    globalThis.openPrivacyModal = openPrivacyModal;
    globalThis.closePrivacyModal = closePrivacyModal2;
  }

  // utils-2.js
  function renderMiniCalendar() {
    const grid = document.getElementById("cal-days-grid");
    const title = document.getElementById("cal-month-title");
    if (!grid || !title) return;
    grid.innerHTML = "";
    const now = /* @__PURE__ */ new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const locales = { de: "de-DE", en: "en-US", el: "el-GR", es: "es-ES", fr: "fr-FR", it: "it-IT" };
    const monthName = new Intl.DateTimeFormat(locales[currentLang] || "en-US", { month: "long", year: "numeric" }).format(now);
    title.innerText = monthName;
    const firstDayOfMonth = new Date(year, month, 1);
    let firstDayIndex = firstDayOfMonth.getDay();
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < firstDayIndex; i++) {
      const empty = document.createElement("span");
      empty.className = "text-transparent select-none pointer-events-none";
      empty.innerText = "";
      grid.appendChild(empty);
    }
    const todayDate = now.getDate();
    const todayMonth = now.getMonth();
    const todayYear = now.getFullYear();
    for (let day = 1; day <= daysInMonth; day++) {
      const daySpan = document.createElement("span");
      daySpan.innerText = day;
      const isToday = day === todayDate && month === todayMonth && year === todayYear;
      if (isToday) {
        daySpan.className = "flex items-center justify-center h-5 w-5 bg-[var(--accent)] text-white font-bold rounded-lg shadow-[0_0_8px_rgba(139,92,246,0.5)] border border-[var(--accent-light)]/20 animate-pulse";
      } else {
        daySpan.className = "flex items-center justify-center h-5 w-5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-all duration-150";
      }
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayAppointments = state.items && state.items.termine ? state.items.termine.filter((t3) => t3.date === dateStr) : [];
      if (dayAppointments.length > 0) {
        daySpan.className += " border border-amber-400/40 relative shadow-[0_0_10px_rgba(245,158,11,0.15)]";
        const dot = document.createElement("span");
        dot.className = "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_4px_rgba(245,158,11,0.8)] animate-pulse";
        daySpan.appendChild(dot);
      }
      const tooltipAction = tr({ de: "Auf ein Datum klicken, um einen Termin einzutragen", en: "Click on a date to enter an appointment", es: "Haz clic en una fecha para a\xF1adir una cita", el: "\u039A\u03AC\u03BD\u03B5 \u03BA\u03BB\u03B9\u03BA \u03C3\u03B5 \u03BC\u03B9\u03B1 \u03B7\u03BC\u03B5\u03C1\u03BF\u03BC\u03B7\u03BD\u03AF\u03B1 \u03B3\u03B9\u03B1 \u03BD\u03B1 \u03BA\u03B1\u03C4\u03B1\u03C7\u03C9\u03C1\u03AE\u03C3\u03B5\u03B9\u03C2 \u03C1\u03B1\u03BD\u03C4\u03B5\u03B2\u03BF\u03CD", fr: "Clique sur une date pour ajouter un rendez-vous", it: "Clicca su una data per inserire un appuntamento" });
      if (dayAppointments.length > 0) {
        const listStr = dayAppointments.map((t3) => {
          let loc = t3.location ? ` (@ ${t3.location})` : "";
          const allDayLabel = tr({ de: "Ganzt\xE4gig", en: "All day", es: "Todo el d\xEDa", el: "\u039F\u03BB\u03BF\u03AE\u03BC\u03B5\u03C1\u03BF", fr: "Toute la journ\xE9e", it: "Tutto il giorno" });
          return `${t3.time || allDayLabel} \xB7 ${t3.task}${loc}`;
        }).join("\n");
        daySpan.title = `${tooltipAction}

Termine:
${listStr}`;
      } else {
        daySpan.title = tooltipAction;
      }
      daySpan.onclick = (e) => {
        e.stopPropagation();
        if (typeof toggleTerminForm === "function") {
          toggleTerminForm(true, dateStr);
        }
      };
      grid.appendChild(daySpan);
    }
  }
  var calendarHoverTimeout = null;
  function openCalendarHover() {
    if (calendarHoverTimeout) {
      clearTimeout(calendarHoverTimeout);
      calendarHoverTimeout = null;
    }
    const el = document.getElementById("panel-calendar-dropdown");
    if (el) {
      el.classList.remove("hidden");
      renderMiniCalendar();
    }
  }
  window.openCalendarHover = openCalendarHover;
  function closeCalendarHover() {
    if (calendarHoverTimeout) clearTimeout(calendarHoverTimeout);
    calendarHoverTimeout = setTimeout(() => {
      const el = document.getElementById("panel-calendar-dropdown");
      const container = document.getElementById("date-container");
      const isOverEl = el && el.matches(":hover");
      const isOverContainer = container && container.matches(":hover");
      if (el && !isOverEl && !isOverContainer) {
        el.classList.add("hidden");
      }
    }, 250);
  }
  window.closeCalendarHover = closeCalendarHover;

  // audio-core.js
  var audioCtx2 = null;
  var currentSoundType2 = null;
  var soundMasterVolume2 = 0.5;
  var activeUserAudio2 = null;
  var isPlayerMuted2 = false;
  var masterGainNode2 = null;
  function getMasterAudioDestination2() {
    initAudioContext2();
    if (!audioCtx2) return null;
    if (!masterGainNode2) {
      masterGainNode2 = audioCtx2.createGain();
      masterGainNode2.gain.setValueAtTime(1, audioCtx2.currentTime);
      masterGainNode2.connect(audioCtx2.destination);
    }
    return masterGainNode2;
  }
  window.getMasterAudioDestination = getMasterAudioDestination2;
  function initAudioContext2() {
    try {
      if (!audioCtx2 || audioCtx2.state === "closed") {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtx2 = new AudioContextClass();
        }
      }
      if (audioCtx2 && audioCtx2.state === "suspended") {
        audioCtx2.resume().catch(() => {
        });
      }
      if (audioCtx2 && !masterGainNode2) {
        masterGainNode2 = audioCtx2.createGain();
        masterGainNode2.gain.setValueAtTime(1, audioCtx2.currentTime);
        masterGainNode2.connect(audioCtx2.destination);
      }
    } catch (e) {
      console.warn("AudioContext init warning:", e);
    }
  }
  if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
    const unlockMobileAudio = () => {
      initAudioContext2();
      if (typeof window.removeEventListener === "function") {
        window.removeEventListener("touchstart", unlockMobileAudio);
        window.removeEventListener("touchend", unlockMobileAudio);
        window.removeEventListener("pointerdown", unlockMobileAudio);
        window.removeEventListener("click", unlockMobileAudio);
      }
    };
    window.addEventListener("touchstart", unlockMobileAudio, { passive: true, once: true });
    window.addEventListener("touchend", unlockMobileAudio, { passive: true, once: true });
    window.addEventListener("pointerdown", unlockMobileAudio, { passive: true, once: true });
    window.addEventListener("click", unlockMobileAudio, { passive: true, once: true });
    if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible" && audioCtx2 && audioCtx2.state === "suspended" && (currentSoundType2 || activeUserAudio2 && !activeUserAudio2.paused)) {
          audioCtx2.resume().catch(() => {
          });
        }
      });
    }
  }
  function playCheerfulSuccessJingle2() {
    initAudioContext2();
    if (!audioCtx2 || isPlayerMuted2) return;
    try {
      const now = audioCtx2.currentTime;
      const chordProgressions = [
        [523.25, 659.25, 783.99, 1046.5],
        // C5, E5, G5, C6 (C-Dur)
        [587.33, 739.99, 880, 1174.66],
        // D5, F#5, A5, D6 (D-Dur)
        [698.46, 880, 1046.5, 1396.91],
        // F5, A5, C6, F6 (F-Dur)
        [783.99, 987.77, 1174.66, 1567.98]
        // G5, B5, D6, G6 (G-Dur)
      ];
      const notes = chordProgressions[Math.floor(Math.random() * chordProgressions.length)];
      notes.forEach((freq, i) => {
        const startTime = now + i * 0.065;
        const osc = audioCtx2.createOscillator();
        const gain = audioCtx2.createGain();
        osc.type = i % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, startTime);
        const vol = 0.22 * (soundMasterVolume2 || 0.5);
        gain.gain.setValueAtTime(1e-4, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(1e-4, startTime + 0.45);
        osc.connect(gain);
        gain.connect(audioCtx2.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } catch (e) {
      console.warn("[Audio] playCheerfulSuccessJingle warning:", e);
    }
  }
  window.playCheerfulSuccessJingle = playCheerfulSuccessJingle2;
  function triggerHapticFeedback2(pattern = [15, 30, 15]) {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch (e) {
    }
  }
  window.triggerHapticFeedback = triggerHapticFeedback2;
  function updateSoundscapeUI2() {
    const sounds = [
      "piano",
      "lofi",
      "chimes",
      "space",
      "guitar",
      "singingbowl",
      "musicbox",
      "breeze",
      "campfire",
      "birds",
      "cafe",
      "clock",
      "lofi_sunshine",
      "summer_meadow",
      "bossa_nova",
      "techno",
      "drumnbass",
      "afrobeats",
      "swing",
      "jazz_piano",
      "rhodes",
      "hypnotic_riff"
    ];
    sounds.forEach((st) => {
      const btn = document.getElementById("sound-btn-" + st);
      if (btn) {
        if (typeof currentSoundType2 !== "undefined" && st === currentSoundType2) {
          btn.className = "p-1.5 bg-purple-500/30 border border-purple-400 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5 shadow-[0_0_12px_rgba(168,85,247,0.3)] animate-pulse";
        } else {
          btn.className = "p-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5";
        }
      }
    });
    const indicator = document.getElementById("soundscape-indicator");
    if (indicator) {
      if (typeof currentSoundType2 !== "undefined" && currentSoundType2) indicator.classList.remove("hidden");
      else indicator.classList.add("hidden");
    }
  }
  if (typeof window !== "undefined") {
    window.getMasterAudioDestination = getMasterAudioDestination2;
    window.initAudioContext = initAudioContext2;
    window.playCheerfulSuccessJingle = playCheerfulSuccessJingle2;
    window.triggerHapticFeedback = triggerHapticFeedback2;
    window.updateSoundscapeUI = updateSoundscapeUI2;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.getMasterAudioDestination = getMasterAudioDestination2;
    globalThis.initAudioContext = initAudioContext2;
    globalThis.playCheerfulSuccessJingle = playCheerfulSuccessJingle2;
    globalThis.triggerHapticFeedback = triggerHapticFeedback2;
    globalThis.updateSoundscapeUI = updateSoundscapeUI2;
  }

  // audio-generators.js
  function playTactileClickSound2() {
    if (typeof initAudio === "function") initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.015);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(1e-4, now + 0.018);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.02);
  }
  function playRhodesChime2() {
    if (typeof initAudio === "function") initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.5];
    chord.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.035);
      gain.gain.setValueAtTime(0, now + idx * 0.035);
      gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.035 + 0.01);
      gain.gain.exponentialRampToValueAtTime(1e-4, now + idx * 0.035 + 0.75);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.035);
      osc.stop(now + idx * 0.035 + 0.8);
    });
  }
  window.playTactileClickSound = playTactileClickSound2;
  window.playRhodesChime = playRhodesChime2;

  // audio-scheduler-3.js
  var currentBeatBpm = 120;
  var beatStepIndex = 0;
  var nextBeatTime = 0;
  var beatSchedulerTimer = null;
  var lookaheadIntervalMs = 25;
  var scheduleAheadSec = 0.12;
  function setBeatBpm(bpm) {
    var val = parseInt(bpm, 10);
    if (isNaN(val)) val = 120;
    currentBeatBpm = Math.max(60, Math.min(220, val));
    var display = document.getElementById("beat-bpm-val");
    if (display) display.innerText = currentBeatBpm + " BPM";
    var slider = document.getElementById("beat-bpm-slider");
    if (slider) slider.value = currentBeatBpm;
  }
  window.setBeatBpm = setBeatBpm;
  function changeBeatBpm(delta) {
    setBeatBpm((currentBeatBpm || 120) + delta);
  }
  window.changeBeatBpm = changeBeatBpm;
  function playDrumKick(time, punch = true, pitch = 135, decay = 0.28, vol = 0.45) {
    if (!audioCtx || !soundGainNode) return;
    try {
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(punch ? pitch : 90, time);
      osc.frequency.exponentialRampToValueAtTime(38, time + 0.08);
      var v = vol * (soundMasterVolume || 0.5);
      gain.gain.setValueAtTime(v, time);
      gain.gain.exponentialRampToValueAtTime(1e-4, time + decay);
      osc.connect(gain);
      gain.connect(soundGainNode);
      osc.start(time);
      osc.stop(time + decay + 0.02);
      activeNodes.push(osc);
    } catch (e) {
      console.warn("playDrumKick error:", e);
    }
  }
  function playDrumSnare(time, isClap = false, vol = 0.3) {
    if (!audioCtx || !soundGainNode) return;
    try {
      var source = audioCtx.createBufferSource();
      source.buffer = getNoiseBuffer("pink");
      var filter = audioCtx.createBiquadFilter();
      filter.type = isClap ? "bandpass" : "highpass";
      filter.frequency.setValueAtTime(isClap ? 1200 : 1800, time);
      if (isClap) filter.Q.setValueAtTime(2.5, time);
      var gain = audioCtx.createGain();
      var v = vol * (soundMasterVolume || 0.5);
      gain.gain.setValueAtTime(v, time);
      gain.gain.exponentialRampToValueAtTime(1e-4, time + (isClap ? 0.16 : 0.18));
      source.connect(filter);
      filter.connect(gain);
      gain.connect(soundGainNode);
      source.start(time);
      source.stop(time + 0.2);
      activeNodes.push(source);
      if (!isClap) {
        var body = audioCtx.createOscillator();
        var bodyGain = audioCtx.createGain();
        body.type = "triangle";
        body.frequency.setValueAtTime(180, time);
        body.frequency.exponentialRampToValueAtTime(80, time + 0.06);
        bodyGain.gain.setValueAtTime(v * 0.5, time);
        bodyGain.gain.exponentialRampToValueAtTime(1e-4, time + 0.1);
        body.connect(bodyGain);
        bodyGain.connect(soundGainNode);
        body.start(time);
        body.stop(time + 0.12);
        activeNodes.push(body);
      }
    } catch (e) {
      console.warn("playDrumSnare error:", e);
    }
  }
  function playDrumHiHat(time, open = false, isRide = false, vol = 0.22) {
    if (!audioCtx || !soundGainNode) return;
    try {
      var source = audioCtx.createBufferSource();
      source.buffer = getNoiseBuffer("pink");
      var filter = audioCtx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(isRide ? 5500 : 7800, time);
      var gain = audioCtx.createGain();
      var v = vol * (soundMasterVolume || 0.5);
      var dur = isRide ? 0.35 : open ? 0.28 : 0.045;
      gain.gain.setValueAtTime(v, time);
      gain.gain.exponentialRampToValueAtTime(1e-4, time + dur);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(soundGainNode);
      source.start(time);
      source.stop(time + dur + 0.02);
      activeNodes.push(source);
    } catch (e) {
      console.warn("playDrumHiHat error:", e);
    }
  }
  function playSynthBass(time, freq, dur = 0.25, vol = 0.35) {
    if (!audioCtx || !soundGainNode) return;
    try {
      var osc = audioCtx.createOscillator();
      var filter = audioCtx.createBiquadFilter();
      var gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, time);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(320, time);
      filter.frequency.exponentialRampToValueAtTime(90, time + dur);
      var v = vol * (soundMasterVolume || 0.5);
      gain.gain.setValueAtTime(v, time);
      gain.gain.exponentialRampToValueAtTime(1e-4, time + dur);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(soundGainNode);
      osc.start(time);
      osc.stop(time + dur + 0.02);
      activeNodes.push(osc);
    } catch (e) {
      console.warn("playSynthBass error:", e);
    }
  }
  function playRhodesChord(time, notes, dur = 1.4, vol = 0.28) {
    if (!audioCtx || !soundGainNode) return;
    try {
      var v = vol / notes.length * (soundMasterVolume || 0.5);
      notes.forEach((freq, idx) => {
        var t3 = time + idx * 0.015;
        var osc1 = audioCtx.createOscillator();
        var osc2 = audioCtx.createOscillator();
        var filter = audioCtx.createBiquadFilter();
        var gain = audioCtx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(freq, t3);
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(freq * 4, t3);
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(900, t3);
        filter.frequency.exponentialRampToValueAtTime(350, t3 + dur);
        gain.gain.setValueAtTime(0, t3);
        gain.gain.linearRampToValueAtTime(v, t3 + 0.012);
        gain.gain.exponentialRampToValueAtTime(1e-4, t3 + dur);
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(soundGainNode);
        osc1.start(t3);
        osc2.start(t3);
        osc1.stop(t3 + dur + 0.05);
        osc2.stop(t3 + dur + 0.05);
        activeNodes.push(osc1, osc2);
      });
    } catch (e) {
      console.warn("playRhodesChord error:", e);
    }
  }
  function playJazzPianoChord(time, notes, dur = 1.8, vol = 0.32) {
    if (!audioCtx || !soundGainNode) return;
    try {
      var v = vol / notes.length * (soundMasterVolume || 0.5);
      notes.forEach((freq, idx) => {
        var t3 = time + idx * 0.025;
        var osc = audioCtx.createOscillator();
        var osc2 = audioCtx.createOscillator();
        var filter = audioCtx.createBiquadFilter();
        var gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t3);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(freq * 2, t3);
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1400, t3);
        filter.frequency.exponentialRampToValueAtTime(450, t3 + dur);
        gain.gain.setValueAtTime(0, t3);
        gain.gain.linearRampToValueAtTime(v, t3 + 0.02);
        gain.gain.exponentialRampToValueAtTime(1e-4, t3 + dur);
        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(soundGainNode);
        osc.start(t3);
        osc2.start(t3);
        osc.stop(t3 + dur + 0.05);
        osc2.stop(t3 + dur + 0.05);
        activeNodes.push(osc, osc2);
      });
    } catch (e) {
      console.warn("playJazzPianoChord error:", e);
    }
  }
  function playHypnoticNote(time, freq, dur = 0.38, vol = 0.25) {
    if (!audioCtx || !soundGainNode) return;
    try {
      var osc = audioCtx.createOscillator();
      var filter = audioCtx.createBiquadFilter();
      var gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, time);
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, time);
      filter.frequency.exponentialRampToValueAtTime(300, time + dur);
      filter.Q.setValueAtTime(4, time);
      var v = vol * (soundMasterVolume || 0.5);
      gain.gain.setValueAtTime(v, time);
      gain.gain.exponentialRampToValueAtTime(1e-4, time + dur);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(soundGainNode);
      osc.start(time);
      osc.stop(time + dur + 0.02);
      activeNodes.push(osc);
    } catch (e) {
      console.warn("playHypnoticNote error:", e);
    }
  }
  var JAZZ_VOICINGS = [
    [220, 261.63, 329.63, 392, 493.88],
    // Am9
    [146.83, 220, 261.63, 311.13, 392],
    // D9(b13)
    [130.81, 196, 246.94, 329.63, 392],
    // Gmaj9
    [164.81, 246.94, 329.63, 392, 440]
    // Em11
  ];
  var RHODES_PROGRESSIONS = [
    [174.61, 220, 261.63, 329.63, 440],
    // Fmaj9
    [164.81, 196, 246.94, 293.66, 392],
    // Em9
    [146.83, 174.61, 220, 261.63, 329.63],
    // Dm9
    [130.81, 164.81, 196, 246.94, 329.63]
    // Cmaj9
  ];
  var HYPNOTIC_NOTES = [
    220,
    261.63,
    329.63,
    392,
    440,
    523.25,
    440,
    329.63,
    196,
    246.94,
    293.66,
    392,
    493.88,
    587.33,
    493.88,
    293.66
  ];
  function scheduleBeat16thStep(step, time) {
    var st = currentSoundType;
    if (!st) return;
    if (st === "techno") {
      if (step % 4 === 0) playDrumKick(time, true, 145, 0.28, 0.5);
      if (step % 4 === 2) playDrumHiHat(time, true, false, 0.28);
      if (step % 2 === 1) playDrumHiHat(time, false, false, 0.12);
      if (step === 4 || step === 12) playDrumSnare(time, true, 0.32);
      var bassNotes = [55, 55, 65.4, 55, 55, 55, 73.4, 55, 55, 55, 65.4, 55, 55, 55, 82.4, 73.4];
      playSynthBass(time, bassNotes[step], 0.18, 0.28);
    } else if (st === "dnb") {
      if (step === 0 || step === 10) playDrumKick(time, true, 160, 0.2, 0.52);
      if (step === 4 || step === 12) playDrumSnare(time, false, 0.42);
      playDrumHiHat(time, step % 4 === 2, true, step % 2 === 0 ? 0.22 : 0.14);
      if (step === 7 || step === 15) playDrumSnare(time, false, 0.12);
      if (step % 8 === 0) playSynthBass(time, 43.65, 0.5, 0.45);
    } else if (st === "afrobeats") {
      if (step === 0 || step === 6 || step === 10) playDrumKick(time, false, 110, 0.32, 0.48);
      if (step === 4 || step === 10 || step === 13) playDrumSnare(time, true, 0.28);
      playDrumHiHat(time, false, false, step % 2 === 1 ? 0.2 : 0.1);
      if (step === 0 || step === 8) playSynthBass(time, 65.4, 0.3, 0.32);
    } else if (st === "swing") {
      if (step % 4 === 0) playDrumHiHat(time, false, true, 0.3);
      if (step % 4 === 3) playDrumHiHat(time, true, true, 0.22);
      if (step === 4 || step === 12) playDrumSnare(time, false, 0.2);
      if (step % 4 === 0) {
        var walkNotes = [110, 123.47, 130.81, 146.83];
        playSynthBass(time, walkNotes[step / 4 % walkNotes.length], 0.35, 0.35);
      }
    } else if (st === "boombap") {
      if (step === 0 || step === 8 || step === 11) playDrumKick(time, true, 130, 0.3, 0.5);
      if (step === 4 || step === 12) playDrumSnare(time, false, 0.38);
      if (step % 2 === 0) playDrumHiHat(time, false, false, 0.18);
      if (step % 4 === 2) playDrumHiHat(time, true, false, 0.12);
    } else if (st === "jazz_piano") {
      if (step === 0 || step === 8) {
        var chordIdx = Math.floor(step / 8) % JAZZ_VOICINGS.length;
        playJazzPianoChord(time, JAZZ_VOICINGS[chordIdx], 1.8, 0.35);
      }
    } else if (st === "rhodes") {
      if (step === 0 || step === 8) {
        var rIdx = Math.floor(step / 8) % RHODES_PROGRESSIONS.length;
        playRhodesChord(time, RHODES_PROGRESSIONS[rIdx], 1.7, 0.32);
      }
    } else if (st === "hypnotic_riff") {
      var noteFreq = HYPNOTIC_NOTES[step % HYPNOTIC_NOTES.length];
      playHypnoticNote(time, noteFreq, 0.32, 0.28);
      if (step % 4 === 0) playDrumKick(time, false, 100, 0.2, 0.22);
    }
  }
  function runBeatLookaheadScheduler() {
    if (!audioCtx || !currentSoundType) return;
    var isBeatType = ["techno", "dnb", "afrobeats", "swing", "boombap", "jazz_piano", "rhodes", "hypnotic_riff"].includes(currentSoundType);
    if (!isBeatType) return;
    var secPer16th = 60 / (currentBeatBpm || 120) / 4;
    while (nextBeatTime < audioCtx.currentTime + scheduleAheadSec) {
      scheduleBeat16thStep(beatStepIndex, nextBeatTime);
      nextBeatTime += secPer16th;
      beatStepIndex = (beatStepIndex + 1) % 16;
    }
    beatSchedulerTimer = setTimeout(runBeatLookaheadScheduler, lookaheadIntervalMs);
    activeTimeouts.push(beatSchedulerTimer);
  }
  function startBeatLookaheadLoop2(type, defaultBpm) {
    if (!audioCtx) return;
    if (defaultBpm && !document.getElementById("beat-bpm-slider")?.dataset?.userTouched) {
      setBeatBpm(defaultBpm);
    }
    beatStepIndex = 0;
    nextBeatTime = audioCtx.currentTime + 0.05;
    runBeatLookaheadScheduler();
  }
  window.startBeatLookaheadLoop = startBeatLookaheadLoop2;

  // audio-player.js
  var currentMusicViewMode = "standard";
  var isCrossfadeEnabled = true;
  var crossfadeDuration = 8;
  var djPlaybackSpeed = 1;
  var djCrossfaderPosition = 0.5;
  var djDecks = {
    a: {
      audio: null,
      track: null,
      isPlaying: false,
      volume: 0.8,
      pitch: 1,
      bpm: 128,
      eqLow: 0,
      eqMid: 0,
      eqHigh: 0,
      filter: 0,
      // -100 to +100
      loopActive: false,
      loopBeats: 4,
      sourceNode: null,
      gainNode: null,
      filterNode: null,
      eqLowNode: null,
      eqMidNode: null,
      eqHighNode: null
    },
    b: {
      audio: null,
      track: null,
      isPlaying: false,
      volume: 0.8,
      pitch: 1,
      bpm: 128,
      eqLow: 0,
      eqMid: 0,
      eqHigh: 0,
      filter: 0,
      loopActive: false,
      loopBeats: 4,
      sourceNode: null,
      gainNode: null,
      filterNode: null,
      eqLowNode: null,
      eqMidNode: null,
      eqHighNode: null
    }
  };
  function switchMusicView(mode) {
    currentMusicViewMode = mode;
    var stdPane = document.getElementById("music-view-standard");
    var djPane = document.getElementById("music-view-dj");
    var btnStd = document.getElementById("music-view-toggle-std");
    var btnDj = document.getElementById("music-view-toggle-dj");
    var panel = document.getElementById("panel-music");
    if (mode === "dj") {
      if (stdPane) stdPane.classList.add("hidden");
      if (djPane) djPane.classList.remove("hidden");
      if (btnStd) btnStd.className = "flex-1 py-1.5 rounded-xl text-gray-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer text-xs font-semibold";
      if (btnDj) btnDj.className = "flex-1 py-1.5 rounded-xl text-white bg-purple-600/40 border border-purple-500/50 transition flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold shadow-md";
      if (panel) {
        panel.classList.remove("w-[390px]", "sm:w-[450px]");
        panel.classList.add("w-[390px]", "sm:w-[560px]", "md:w-[620px]");
      }
      initDjDecks();
    } else {
      if (djPane) djPane.classList.add("hidden");
      if (stdPane) stdPane.classList.remove("hidden");
      if (btnDj) btnDj.className = "flex-1 py-1.5 rounded-xl text-gray-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer text-xs font-semibold";
      if (btnStd) btnStd.className = "flex-1 py-1.5 rounded-xl text-white bg-purple-600/40 border border-purple-500/50 transition flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold shadow-md";
      if (panel) {
        panel.classList.remove("w-[390px]", "sm:w-[560px]", "md:w-[620px]");
        panel.classList.add("w-[390px]", "sm:w-[450px]");
      }
    }
    if (typeof renderLucideIcons === "function") renderLucideIcons();
    if (typeof AppStorage !== "undefined") AppStorage.set("flow_music_view_mode", mode);
  }
  window.switchMusicView = switchMusicView;
  function handleUserSoundFile(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const wasEmpty = playlistTracks.length === 0;
    const newTracks = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name.replace(/\.[^/.]+$/, ""),
      fullName: file.name,
      duration: null
    }));
    playlistTracks = playlistTracks.concat(newTracks);
    newTracks.forEach(preloadTrackDuration);
    const playerContainer = document.getElementById("custom-playlist-player");
    if (playerContainer) playerContainer.classList.remove("hidden");
    populateDjDeckSelectors();
    if (wasEmpty) {
      stopAmbientSound(true);
      currentTrackIndex = isPlayerShuffleEnabled && playlistTracks.length > 1 ? Math.floor(Math.random() * playlistTracks.length) : 0;
      playTrack(currentTrackIndex);
    } else {
      renderTrackList();
      updatePlayerHeaderInfo();
      showToast(`${newTracks.length} Track(s) geladen! \u{1F3A7}`);
    }
    event.target.value = "";
  }
  window.handleUserSoundFile = handleUserSoundFile;
  function preloadTrackDuration(track) {
    const probe = new Audio();
    probe.preload = "metadata";
    probe.addEventListener("loadedmetadata", () => {
      track.duration = probe.duration;
      renderTrackList();
      updatePlayerHeaderInfo();
    });
    probe.src = track.url;
  }
  function removeTrackFromPlaylist(idx, event) {
    if (event) event.stopPropagation();
    if (idx < 0 || idx >= playlistTracks.length) return;
    const wasPlayingRemoved = idx === currentTrackIndex && activeUserAudio && !activeUserAudio.paused;
    playlistTracks.splice(idx, 1);
    if (playlistTracks.length === 0) {
      clearPlaylist();
      return;
    }
    if (idx < currentTrackIndex) currentTrackIndex--;
    else if (idx === currentTrackIndex) currentTrackIndex = Math.min(currentTrackIndex, playlistTracks.length - 1);
    populateDjDeckSelectors();
    if (wasPlayingRemoved) {
      playTrack(currentTrackIndex);
    } else {
      renderTrackList();
      updatePlayerHeaderInfo();
    }
  }
  window.removeTrackFromPlaylist = removeTrackFromPlaylist;
  function clearPlaylist() {
    if (activeUserAudio) {
      activeUserAudio.pause();
      activeUserAudio = null;
    }
    playlistTracks = [];
    currentTrackIndex = 0;
    const playerContainer = document.getElementById("custom-playlist-player");
    if (playerContainer) playerContainer.classList.add("hidden");
    updatePlayPauseButtonUI(false);
    renderTrackList();
    populateDjDeckSelectors();
  }
  window.clearPlaylist = clearPlaylist;
  function attachAudioEvents(audio) {
    audio.addEventListener("timeupdate", () => {
      if (activeUserAudio !== audio) return;
      const pct = audio.currentTime / audio.duration * 100 || 0;
      const bar = document.getElementById("player-progress-bar");
      if (bar) bar.style.width = `${pct}%`;
      const currentEl = document.getElementById("player-time-current");
      if (currentEl) currentEl.innerText = formatAudioTime(audio.currentTime);
      const remainingEl = document.getElementById("player-time-remaining");
      if (remainingEl && audio.duration) {
        const rem = Math.max(0, audio.duration - audio.currentTime);
        remainingEl.innerText = `-${formatAudioTime(rem)}`;
      }
    });
    audio.addEventListener("loadedmetadata", () => {
      if (activeUserAudio !== audio) return;
      const durationEl = document.getElementById("player-time-duration");
      if (durationEl) durationEl.innerText = formatAudioTime(audio.duration);
    });
  }
  function formatAudioTime(secs) {
    if (isNaN(secs) || secs < 0) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  window.formatAudioTime = formatAudioTime;
  function handleProgressBarClick(event) {
    if (!activeUserAudio || !activeUserAudio.duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    activeUserAudio.currentTime = ratio * activeUserAudio.duration;
  }
  window.handleProgressBarClick = handleProgressBarClick;
  function playTrack(index) {
    if (playlistTracks.length === 0) return;
    if (index < 0 || index >= playlistTracks.length) index = 0;
    currentTrackIndex = index;
    const track = playlistTracks[currentTrackIndex];
    let oldAudio = activeUserAudio;
    const audio = new Audio(track.url);
    audio.loop = false;
    audio.playbackRate = djPlaybackSpeed;
    const targetVolume = isPlayerMuted ? 0 : soundMasterVolume * 0.75;
    const willCrossfade = isCrossfadeEnabled && crossfadeDuration > 0 && oldAudio && !oldAudio.paused;
    audio.volume = willCrossfade ? 0 : targetVolume;
    activeUserAudio = audio;
    attachAudioEvents(audio);
    audio.addEventListener("ended", () => {
      if (playerRepeatMode === "one") {
        playTrack(currentTrackIndex);
      } else if (playerRepeatMode === "off" && !isPlayerShuffleEnabled && currentTrackIndex === playlistTracks.length - 1) {
        updatePlayPauseButtonUI(false);
      } else {
        playNextTrackWithCrossfade();
      }
    });
    audio.play().then(() => {
      updatePlayPauseButtonUI(true);
      if (willCrossfade) {
        const fadeDurationMs = crossfadeDuration * 1e3;
        const steps = 30;
        const stepTime = fadeDurationMs / steps;
        const stepVol = targetVolume / steps;
        let fadeInInterval = setInterval(() => {
          if (activeUserAudio === audio) {
            if (audio.volume < targetVolume - stepVol) {
              audio.volume = Math.min(targetVolume, audio.volume + stepVol);
            } else {
              audio.volume = targetVolume;
              clearInterval(fadeInInterval);
            }
          } else {
            clearInterval(fadeInInterval);
          }
        }, stepTime);
      }
    }).catch((e) => {
      console.warn("Audio play error:", e);
    });
    if (oldAudio && oldAudio !== audio) {
      if (willCrossfade) {
        const fadeDurationMs = crossfadeDuration * 1e3;
        const steps = 30;
        const stepTime = fadeDurationMs / steps;
        const stepVol = oldAudio.volume / steps;
        let fadeOutInterval = setInterval(() => {
          try {
            if (oldAudio.volume > stepVol) {
              oldAudio.volume = Math.max(0, oldAudio.volume - stepVol);
            } else {
              oldAudio.volume = 0;
              oldAudio.pause();
              clearInterval(fadeOutInterval);
            }
          } catch (e) {
            clearInterval(fadeOutInterval);
          }
        }, stepTime);
      } else {
        try {
          oldAudio.pause();
        } catch (e) {
        }
      }
    }
    const nameLabel = document.getElementById("user-sound-name");
    if (nameLabel) nameLabel.innerText = track.name;
    renderTrackList();
    updatePlayerHeaderInfo();
    updateSoundscapeUI();
    updateVinylAnimation(true);
  }
  window.playTrack = playTrack;
  function togglePlaylistPlayback() {
    if (!activeUserAudio) {
      if (playlistTracks.length > 0) playTrack(currentTrackIndex);
      return;
    }
    if (activeUserAudio.paused) {
      activeUserAudio.play();
      updatePlayPauseButtonUI(true);
      updateVinylAnimation(true);
    } else {
      activeUserAudio.pause();
      updatePlayPauseButtonUI(false);
      updateVinylAnimation(false);
    }
  }
  window.togglePlaylistPlayback = togglePlaylistPlayback;
  function updatePlayPauseButtonUI(isPlaying) {
    const btn = document.getElementById("player-play-pause-btn");
    if (btn) {
      btn.innerHTML = isPlaying ? '<i data-lucide="pause" class="w-5 h-5"></i>' : '<i data-lucide="play" class="w-5 h-5 text-purple-300 ml-0.5"></i>';
      if (typeof renderLucideIcons === "function") renderLucideIcons();
    }
    updateVinylAnimation(isPlaying);
  }
  function updateVinylAnimation(isPlaying) {
    const vinylEl = document.getElementById("dj-turntable-vinyl");
    const waveBars = document.querySelectorAll(".dj-vu-bar");
    if (vinylEl) {
      if (isPlaying) {
        vinylEl.classList.add("animate-spin");
        vinylEl.style.animationDuration = "4s";
      } else {
        vinylEl.classList.remove("animate-spin");
      }
    }
    waveBars.forEach((bar, idx) => {
      if (isPlaying) {
        bar.classList.add("animate-pulse");
        bar.style.animationDuration = `${0.3 + idx % 4 * 0.15}s`;
      } else {
        bar.classList.remove("animate-pulse");
      }
    });
  }
  function playNextTrackWithCrossfade() {
    if (playlistTracks.length === 0) return;
    let nextIndex = currentTrackIndex;
    if (isPlayerShuffleEnabled && playlistTracks.length > 1) {
      do {
        nextIndex = Math.floor(Math.random() * playlistTracks.length);
      } while (nextIndex === currentTrackIndex);
    } else {
      nextIndex = currentTrackIndex + 1;
      if (nextIndex >= playlistTracks.length) nextIndex = 0;
    }
    playTrack(nextIndex);
  }
  window.playNextTrackWithCrossfade = playNextTrackWithCrossfade;
  function playPreviousTrack() {
    if (playlistTracks.length === 0) return;
    if (activeUserAudio && activeUserAudio.currentTime > 3) {
      activeUserAudio.currentTime = 0;
      return;
    }
    let prevIndex;
    if (isPlayerShuffleEnabled && playlistTracks.length > 1) {
      do {
        prevIndex = Math.floor(Math.random() * playlistTracks.length);
      } while (prevIndex === currentTrackIndex);
    } else {
      prevIndex = currentTrackIndex - 1;
      if (prevIndex < 0) prevIndex = playlistTracks.length - 1;
    }
    playTrack(prevIndex);
  }
  window.playPreviousTrack = playPreviousTrack;
  function cueTrackStart() {
    if (activeUserAudio) {
      activeUserAudio.currentTime = 0;
      if (activeUserAudio.paused) {
        activeUserAudio.play();
        updatePlayPauseButtonUI(true);
      }
    } else if (playlistTracks.length > 0) {
      playTrack(currentTrackIndex);
    }
  }
  window.cueTrackStart = cueTrackStart;
  function togglePlayerShuffle() {
    isPlayerShuffleEnabled = !isPlayerShuffleEnabled;
    const btn = document.getElementById("player-shuffle-toggle-btn");
    if (btn) {
      btn.className = isPlayerShuffleEnabled ? "p-1.5 bg-purple-500/30 text-purple-300 rounded-xl cursor-pointer transition border border-purple-400/50" : "p-1.5 bg-white/5 text-gray-400 rounded-xl cursor-pointer transition border border-white/10";
    }
  }
  window.togglePlayerShuffle = togglePlayerShuffle;
  function cyclePlayerRepeatMode() {
    if (playerRepeatMode === "all") playerRepeatMode = "one";
    else if (playerRepeatMode === "one") playerRepeatMode = "off";
    else playerRepeatMode = "all";
    const btn = document.getElementById("player-repeat-toggle-btn");
    const icon = document.getElementById("player-repeat-icon");
    if (btn && icon) {
      if (playerRepeatMode === "all") {
        btn.className = "p-1.5 bg-purple-500/30 text-purple-300 rounded-xl cursor-pointer transition border border-purple-400/50";
        icon.setAttribute("data-lucide", "repeat");
      } else if (playerRepeatMode === "one") {
        btn.className = "p-1.5 bg-purple-500/40 text-purple-200 rounded-xl cursor-pointer transition border border-purple-400 font-bold";
        icon.setAttribute("data-lucide", "repeat-1");
      } else {
        btn.className = "p-1.5 bg-white/5 text-gray-400 rounded-xl cursor-pointer transition border border-white/10";
        icon.setAttribute("data-lucide", "repeat");
      }
      if (typeof renderLucideIcons === "function") renderLucideIcons();
    }
  }
  window.cyclePlayerRepeatMode = cyclePlayerRepeatMode;
  function renderTrackList() {
    const container = document.getElementById("track-list-container");
    if (!container) return;
    if (playlistTracks.length === 0) {
      container.innerHTML = `<div class="text-[11px] text-gray-500 text-center py-3">Keine Tracks in der Playlist</div>`;
      return;
    }
    container.innerHTML = playlistTracks.map((track, idx) => {
      const isActive = idx === currentTrackIndex;
      const durStr = track.duration ? formatAudioTime(track.duration) : "--:--";
      return `
      <div onclick="playTrack(${idx})" class="p-1.5 rounded-xl border transition flex items-center justify-between gap-2 cursor-pointer ${isActive ? "bg-purple-500/20 border-purple-500/40 text-white shadow-sm" : "bg-black/30 hover:bg-white/5 border-white/5 text-gray-300"}" data-track-active="${isActive}">
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-[10px] font-mono text-gray-500 w-4 shrink-0">${idx + 1}.</span>
          <div class="truncate text-xs font-semibold">${track.name}</div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-[9px] font-mono text-gray-400">${durStr}</span>
          <button onclick="removeTrackFromPlaylist(${idx}, event)" class="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-300 transition" title="L\xF6schen">
            <i data-lucide="x" class="w-3 h-3"></i>
          </button>
        </div>
      </div>
    `;
    }).join("");
    if (typeof renderLucideIcons === "function") renderLucideIcons();
  }
  function updatePlayerHeaderInfo() {
    const countEl = document.getElementById("player-track-count");
    if (!countEl) return;
    countEl.innerText = `${playlistTracks.length} Tracks`;
  }
  function setSoundVolume(val) {
    soundMasterVolume = parseFloat(val);
    if (soundMasterVolume < 0.02) soundMasterVolume = 0;
    isPlayerMuted = false;
    if (activeUserAudio) {
      activeUserAudio.volume = soundMasterVolume * 0.75;
    }
    if (soundGainNode && audioCtx) {
      try {
        soundGainNode.gain.setValueAtTime(soundMasterVolume * 1, audioCtx.currentTime);
      } catch (e) {
      }
    }
    applyDjMixerGains();
  }
  window.setSoundVolume = setSoundVolume;
  function togglePlayerMute() {
    isPlayerMuted = !isPlayerMuted;
    if (activeUserAudio) {
      activeUserAudio.volume = isPlayerMuted ? 0 : soundMasterVolume * 0.75;
    }
    applyDjMixerGains();
    const muteBtn = document.getElementById("player-mute-toggle-btn");
    if (muteBtn) {
      muteBtn.innerHTML = isPlayerMuted ? '<i data-lucide="volume-x" class="w-3.5 h-3.5 text-red-400"></i>' : '<i data-lucide="volume-2" class="w-3.5 h-3.5"></i>';
      if (typeof renderLucideIcons === "function") renderLucideIcons();
    }
  }
  window.togglePlayerMute = togglePlayerMute;
  function initDjDecks() {
    initAudioContext();
    populateDjDeckSelectors();
  }
  function populateDjDeckSelectors() {
    ["a", "b"].forEach((deckId) => {
      const sel = document.getElementById(`dj-track-select-${deckId}`);
      if (!sel) return;
      const currentVal = sel.value;
      sel.innerHTML = `<option value="">-- Track ausw\xE4hlen --</option>` + playlistTracks.map((t3, idx) => `<option value="${idx}">${idx + 1}. ${t3.name}</option>`).join("");
      if (currentVal !== "") sel.value = currentVal;
    });
  }
  function handleDeckTrackSelect(deckId, trackIdx) {
    if (trackIdx === "" || isNaN(parseInt(trackIdx, 10))) return;
    const idx = parseInt(trackIdx, 10);
    if (idx < 0 || idx >= playlistTracks.length) return;
    loadTrackToDeck(deckId, playlistTracks[idx]);
  }
  window.handleDeckTrackSelect = handleDeckTrackSelect;
  function handleDeckFileUpload(deckId, event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const track = {
      url: URL.createObjectURL(file),
      name: file.name.replace(/\.[^/.]+$/, ""),
      fullName: file.name
    };
    playlistTracks.push(track);
    populateDjDeckSelectors();
    loadTrackToDeck(deckId, track);
    event.target.value = "";
  }
  window.handleDeckFileUpload = handleDeckFileUpload;
  function loadTrackToDeck(deckId, track) {
    const deck = djDecks[deckId];
    if (!deck) return;
    if (deck.audio) {
      deck.audio.pause();
      deck.audio.src = "";
    }
    deck.track = track;
    deck.audio = new Audio(track.url);
    deck.audio.loop = false;
    deck.audio.playbackRate = deck.pitch;
    deck.audio.addEventListener("timeupdate", () => {
      updateDeckTimeDisplay(deckId);
    });
    deck.audio.addEventListener("ended", () => {
      deck.isPlaying = false;
      updateDeckPlayBtn(deckId);
      updateDeckVinylAnim(deckId);
    });
    setupDeckAudioNodes(deckId);
    const titleEl = document.getElementById(`dj-deck-${deckId}-title`);
    if (titleEl) titleEl.innerText = track.name;
    applyDjMixerGains();
    showToast(`Track in Deck ${deckId.toUpperCase()} geladen! \u{1F39B}\uFE0F`);
  }
  window.loadTrackToDeck = loadTrackToDeck;
  function setupDeckAudioNodes(deckId) {
    if (!audioCtx) initAudioContext();
    if (!audioCtx) return;
    const deck = djDecks[deckId];
    if (!deck || !deck.audio) return;
    try {
      applyDjMixerGains();
    } catch (e) {
      console.warn("Deck node setup note:", e);
    }
  }
  function toggleDeck(deckId) {
    const deck = djDecks[deckId];
    if (!deck || !deck.audio) {
      if (playlistTracks.length > 0) {
        loadTrackToDeck(deckId, playlistTracks[deckId === "a" ? 0 : Math.min(1, playlistTracks.length - 1)]);
      } else {
        document.getElementById(`dj-file-input-${deckId}`)?.click();
        return;
      }
    }
    if (deck.audio.paused) {
      initAudioContext();
      deck.audio.play();
      deck.isPlaying = true;
    } else {
      deck.audio.pause();
      deck.isPlaying = false;
    }
    updateDeckPlayBtn(deckId);
    updateDeckVinylAnim(deckId);
  }
  window.toggleDeck = toggleDeck;
  function cueDeck(deckId) {
    const deck = djDecks[deckId];
    if (!deck || !deck.audio) return;
    deck.audio.currentTime = 0;
    if (deck.audio.paused) {
      deck.audio.play();
      deck.isPlaying = true;
      updateDeckPlayBtn(deckId);
      updateDeckVinylAnim(deckId);
    }
  }
  window.cueDeck = cueDeck;
  function syncDeck(deckId) {
    const otherDeckId = deckId === "a" ? "b" : "a";
    const thisDeck = djDecks[deckId];
    const otherDeck = djDecks[otherDeckId];
    if (!thisDeck) return;
    thisDeck.pitch = otherDeck ? otherDeck.pitch : 1;
    thisDeck.bpm = otherDeck ? otherDeck.bpm : 128;
    if (thisDeck.audio) thisDeck.audio.playbackRate = thisDeck.pitch;
    const slider = document.getElementById(`dj-pitch-slider-${deckId}`);
    if (slider) slider.value = Math.round((thisDeck.pitch - 1) * 100);
    const bpmVal = document.getElementById(`dj-bpm-val-${deckId}`);
    if (bpmVal) bpmVal.innerText = `${Math.round(128 * thisDeck.pitch)} BPM`;
    showToast(`Deck ${deckId.toUpperCase()} BPM synchronisiert! \u26A1`);
  }
  window.syncDeck = syncDeck;
  function setDeckPitch(deckId, val) {
    const deck = djDecks[deckId];
    if (!deck) return;
    const pct = parseFloat(val);
    deck.pitch = 1 + pct / 100;
    if (deck.audio) deck.audio.playbackRate = deck.pitch;
    const bpmVal = document.getElementById(`dj-bpm-val-${deckId}`);
    if (bpmVal) bpmVal.innerText = `${Math.round(128 * deck.pitch)} BPM`;
  }
  window.setDeckPitch = setDeckPitch;
  function setDeckVolume(deckId, val) {
    const deck = djDecks[deckId];
    if (!deck) return;
    deck.volume = parseFloat(val);
    applyDjMixerGains();
  }
  window.setDeckVolume = setDeckVolume;
  function setDjCrossfader(val) {
    djCrossfaderPosition = parseFloat(val);
    applyDjMixerGains();
    const slider = document.getElementById("dj-crossfader-slider");
    if (slider) slider.value = djCrossfaderPosition;
  }
  window.setDjCrossfader = setDjCrossfader;
  function quickCrossfade(pos) {
    setDjCrossfader(pos);
  }
  window.quickCrossfade = quickCrossfade;
  function applyDjMixerGains() {
    const angle = djCrossfaderPosition * 0.5 * Math.PI;
    const crossGainA = Math.cos(angle);
    const crossGainB = Math.sin(angle);
    const master = isPlayerMuted ? 0 : soundMasterVolume || 0.5;
    if (djDecks.a.audio) {
      djDecks.a.audio.volume = Math.max(0, Math.min(1, djDecks.a.volume * crossGainA * master));
    }
    if (djDecks.b.audio) {
      djDecks.b.audio.volume = Math.max(0, Math.min(1, djDecks.b.volume * crossGainB * master));
    }
  }
  function updateDeckTimeDisplay(deckId) {
    const deck = djDecks[deckId];
    if (!deck || !deck.audio) return;
    const curEl = document.getElementById(`dj-time-${deckId}`);
    if (curEl) curEl.innerText = formatAudioTime(deck.audio.currentTime);
  }
  function updateDeckPlayBtn(deckId) {
    const deck = djDecks[deckId];
    const btn = document.getElementById(`dj-play-btn-${deckId}`);
    if (btn) {
      btn.innerHTML = deck.isPlaying ? '<i data-lucide="pause" class="w-4 h-4"></i>' : '<i data-lucide="play" class="w-4 h-4 ml-0.5"></i>';
      if (typeof renderLucideIcons === "function") renderLucideIcons();
    }
  }
  function updateDeckVinylAnim(deckId) {
    const deck = djDecks[deckId];
    const vinyl = document.getElementById(`dj-vinyl-${deckId}`);
    if (vinyl) {
      if (deck.isPlaying) {
        vinyl.classList.add("animate-spin");
        vinyl.style.animationDuration = `${3 / (deck.pitch || 1)}s`;
      } else {
        vinyl.classList.remove("animate-spin");
      }
    }
  }
  function playDjSfx(type) {
    initAudioContext();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    if (type === "airhorn") {
      const hornPitches = [466.16, 622.25, 932.33];
      hornPitches.forEach((freq) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq * 0.96, now);
        osc.frequency.linearRampToValueAtTime(freq, now + 0.04);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.85, now + 0.5);
        const vol = 0.28 * (soundMasterVolume || 0.5);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.02);
        gain.gain.setValueAtTime(vol, now + 0.35);
        gain.gain.exponentialRampToValueAtTime(1e-4, now + 0.55);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
        activeNodes.push(osc);
      });
      showToast("\u{1F4E2} AIRHORN BLAST!");
    } else if (type === "scratch") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.16);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.28);
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1e3, now);
      filter.Q.setValueAtTime(3, now);
      const vol = 0.4 * (soundMasterVolume || 0.5);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(1e-4, now + 0.32);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
      activeNodes.push(osc);
      showToast("\u26A1 VINYL SCRATCH!");
    } else if (type === "laser") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(2400, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.3);
      const vol = 0.35 * (soundMasterVolume || 0.5);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(1e-4, now + 0.32);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
      activeNodes.push(osc);
      showToast("\u{1F6A8} LASER SWEEP!");
    } else if (type === "subdrop") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(34, now + 0.7);
      const vol = 0.55 * (soundMasterVolume || 0.5);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(1e-4, now + 0.85);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.9);
      activeNodes.push(osc);
      showToast("\u{1F4A5} 808 SUB DROP!");
    }
  }
  window.playDjSfx = playDjSfx;
  function switchMusicSourceTab(tab) {
    const tabs = ["dj", "spotify", "youtube"];
    tabs.forEach((t3) => {
      const btn = document.getElementById(`music-tab-btn-${t3}`);
      const pane = document.getElementById(`music-pane-${t3}`);
      if (btn) {
        btn.className = t3 === tab ? `flex-1 py-1.5 rounded-xl text-white bg-purple-600/30 border border-purple-500/40 transition flex items-center justify-center gap-1.5 cursor-pointer text-[11px] font-bold shadow-sm` : `flex-1 py-1.5 rounded-xl text-gray-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer text-[11px] font-medium`;
      }
      if (pane) {
        pane.classList.toggle("hidden", t3 !== tab);
      }
    });
    if (typeof AppStorage !== "undefined") {
      AppStorage.set("flow_music_active_tab", tab);
    }
    if (typeof renderLucideIcons === "function") renderLucideIcons();
  }
  window.switchMusicSourceTab = switchMusicSourceTab;
  function loadSpotifyEmbed(urlOrId) {
    const container = document.getElementById("spotify-embed-container");
    if (!container) return;
    container.innerHTML = `
    <iframe style="border-radius:16px" src="https://open.spotify.com/embed/playlist/${urlOrId}?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
  `;
    if (typeof AppStorage !== "undefined") {
      AppStorage.set("flow_spotify_url", urlOrId);
    }
    showToast("Spotify Playlist geladen! \u{1F7E2}");
  }
  window.loadSpotifyEmbed = loadSpotifyEmbed;
  function loadYouTubeEmbed(urlOrId) {
    const container = document.getElementById("youtube-embed-container");
    if (!container) return;
    container.innerHTML = `
    <div class="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-lg">
      <iframe class="w-full h-full" src="https://www.youtube-nocookie.com/embed/${urlOrId}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>
    </div>
  `;
    if (typeof AppStorage !== "undefined") {
      AppStorage.set("flow_youtube_url", urlOrId);
    }
    showToast("YouTube Stream geladen! \u{1F534}");
  }
  window.loadYouTubeEmbed = loadYouTubeEmbed;

  // timer-1.js
  var timerSeconds2 = 2 * 60;
  var timerInitialSeconds2 = 2 * 60;
  var timerRunning2 = false;
  var timerInterval2 = null;
  var activeTimerTask2 = null;
  var timerTargetEndTime2 = null;
  var currentSpeechSessionId2 = 0;
  if (typeof window !== "undefined") {
    window.timerSeconds = timerSeconds2;
    window.timerInitialSeconds = timerInitialSeconds2;
    window.timerRunning = timerRunning2;
    window.timerInterval = timerInterval2;
    window.activeTimerTask = activeTimerTask2;
    window.timerTargetEndTime = timerTargetEndTime2;
    window.currentSpeechSessionId = currentSpeechSessionId2;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.timerSeconds = timerSeconds2;
    globalThis.timerInitialSeconds = timerInitialSeconds2;
    globalThis.timerRunning = timerRunning2;
    globalThis.timerInterval = timerInterval2;
    globalThis.activeTimerTask = activeTimerTask2;
    globalThis.timerTargetEndTime = timerTargetEndTime2;
    globalThis.currentSpeechSessionId = currentSpeechSessionId2;
  }
  var timerSoundEnabled2 = (typeof localStorage !== "undefined" ? localStorage.getItem("flowTimerSoundEnabled") : null) !== "false";
  var lastSelectedTimerAmbient = null;
  var ringInterval2 = null;
  var TIMER_AMBIENTS = ["piano", "lofi", "chimes", "space", "guitar", "singingbowl", "musicbox", "breeze", "campfire", "birds", "cafe", "clock", "lofi_sunshine", "summer_meadow", "bossa_nova"];
  var VOICE_PROFILES = [
    { id: "female_warm", name: "Warm Empathetic Female", pitch: 1.06, rate: 0.96, gender: "female", style: "warm" },
    { id: "male_resonant", name: "Calm Resonant Male", pitch: 0.88, rate: 0.94, gender: "male", style: "grounded" },
    { id: "child_cheerful", name: "Cheerful Sunny Child", pitch: 1.38, rate: 1.06, gender: "child", style: "joyful" },
    { id: "coach_energetic", name: "Inspiring Coach", pitch: 1, rate: 1.08, gender: "male", style: "upbeat" },
    { id: "zen_serene", name: "Serene Zen Guide", pitch: 0.92, rate: 0.86, gender: "female", style: "mindful" },
    { id: "female_sparkle", name: "Joyful Bright Female", pitch: 1.18, rate: 1.02, gender: "female", style: "sparkle" },
    { id: "male_flow", name: "Steady Flow Male", pitch: 0.94, rate: 0.98, gender: "male", style: "focus" },
    { id: "child_playful", name: "Playful Little Explorer", pitch: 1.42, rate: 1.04, gender: "child", style: "playful" }
  ];
  var globalVoiceTurnIndex = 0;
  var MOTIVATIONAL_CHUNKS2 = {
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
        "Schritt f\xFCr Schritt. Du schaffst das mit Leichtigkeit!",
        "Los geht's! Dein Momentum entsteht genau jetzt.",
        "Jeder einzelne Augenblick z\xE4hlt. Genie\xDFe den klaren Fluss.",
        "Dein Fokus ist bereit. Tauche ganz in deine Aufgabe ein!",
        "Ein wunderbarer Beginn. Lass uns diese Zeit genie\xDFen.",
        "Du findest deinen Takt. Das machst du wirklich gro\xDFartig!"
      ],
      halfway: [
        "Schon die H\xE4lfte geschafft! Du machst das absolut fantastisch.",
        "Bleib in deinem ruhigen Rhythmus, du bist voll auf Erfolgskurs!",
        "Ausgezeichneter Fokus! Schultern kurz lockern und weiterflie\xDFen.",
        "Die Mitte ist erreicht, dein Schwung tr\xE4gt dich von selbst voran.",
        "Weiter so, du bist mitten in deinem nat\xFCrlichen Flow!",
        "Klasse Ausdauer und Klarheit. Bleib einfach dran!",
        "Das Schwierigste liegt hinter dir. Jetzt l\xE4uft es wie von allein.",
        "Wunderbare Konzentration! Gleite entspannt durch die zweite H\xE4lfte."
      ],
      end: [
        "Fast geschafft! Jetzt kommt der leichte, sch\xF6ne Endspurt.",
        "Gro\xDFartig! Die Ziellinie ist bereits in greifbarer N\xE4he.",
        "Hervorragend gemeistert, nur noch ein kleiner Moment!",
        "Gleich hast du es vollbracht! Sei stolz auf deinen Einsatz.",
        "Der letzte Abschnitt \u2013 mach ihn mit Leichtigkeit fertig!",
        "So nah am Ziel. Sp\xFCre die Freude des Erfolgs!",
        "Ph\xE4nomenaler Einsatz, du hast es fast in der Tasche!",
        "Wunderbar durchgehalten. Ein echter Triumph f\xFCr heute!"
      ],
      overdue: [
        "Fokuszeit erf\xFCllt! Zeit f\xFCr eine wohlverdiente Bewegungspause.",
        "Atme tief durch und lass locker. Gro\xDFartige Arbeit!",
        "Deine Sitzung ist geschafft. G\xF6nn deinen Augen etwas Ruhe.",
        "Wie w\xE4re es mit einem Glas frischem Wasser und einer Pause?",
        "Du hast viel bewegt. Tritt kurz zur\xFCck und entspanne dich.",
        "Zeit f\xFCr einen sanften Szenenwechsel. Danke f\xFCr deinen Fokus!"
      ]
    },
    fr: {
      start: [
        "Superbe d\xE9part ! Respire profond\xE9ment et aborde ce premier pas avec s\xE9r\xE9nit\xE9.",
        "Magnifique, le premier pas est franchi ! Tu as le plein contr\xF4le.",
        "Une \xE9tape apr\xE8s l'autre. Tu ma\xEEtrises parfaitement la situation !",
        "C'est parti ! Ton \xE9lan se cr\xE9e ici et maintenant.",
        "Chaque instant de concentration compte. Savoure cette fluidit\xE9.",
        "Esprit clair et attentif. Plonge avec plaisir dans ton travail !",
        "Un d\xE9part remarquable. Faisons de cette session un franc succ\xE8s.",
        "Tu trouves ton propre tempo. Tu te d\xE9brouilles \xE0 merveille !"
      ],
      halfway: [
        "D\xE9j\xE0 \xE0 mi-parcours ! Tu accomplis cela avec un brio formidable.",
        "Garde ce rythme doux et r\xE9gulier, tu es parfaitement sur la bonne voie !",
        "Superbe concentration ! D\xE9tends un instant tes \xE9paules et continue.",
        "Mi-chemin franchi, ton \xE9lan naturel te porte vers l'avant.",
        "Continue ainsi, tu es en plein c\u0153ur de ton flow !",
        "Une belle constance et beaucoup de clart\xE9. Reste dans cet \xE9tat !",
        "Le plus difficile est fait. La suite se d\xE9roule avec aisance.",
        "Concentration exemplaire ! Glisse tranquillement vers la fin."
      ],
      end: [
        "Presque termin\xE9 ! Il ne reste qu'une toute petite ligne droite.",
        "Brillant travail ! La ligne d'arriv\xE9e brille \xE0 l'horizon.",
        "Exceptionnel, plus que quelques instants de concentration !",
        "Tu y es presque ! Savoure la fiert\xE9 de cet accomplissement.",
        "Dernier effort tout en douceur, m\xE8ne cela \xE0 terme avec le sourire !",
        "Si pr\xE8s du but. Ressens la satisfaction du travail bien fait !",
        "Effort remarquable, la victoire est \xE0 port\xE9e de main !",
        "Magnifique pers\xE9v\xE9rance. Sois tr\xE8s fier de ta session aujourd'hui."
      ],
      overdue: [
        "Temps de focus accompli ! Place \xE0 une pause bien m\xE9rit\xE9e.",
        "Prends une grande inspiration et rel\xE2che la pression. Bravo !",
        "Ta session est finie. Offre un doux repos \xE0 tes yeux.",
        "Que dirais-tu d'un verre d'eau fra\xEEche et de quelques pas ?",
        "Tu as fait un travail formidable. Recule un peu et d\xE9tends-toi.",
        "Il est temps de changer de d\xE9cor. F\xE9licitations pour tes efforts !"
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
        "Sei gi\xE0 a met\xE0 strada! Stai facendo un lavoro davvero straordinario.",
        "Mantieni questa andatura armoniosa, sei perfettamente in carreggiata!",
        "Progresso eccellente! Sciogli un momento le spalle e continua.",
        "Met\xE0 percorso raggiunto, la tua carica positiva ti guida in avanti.",
        "Continua cos\xEC, sei nel pieno del tuo flow naturale!",
        "Fantastica determinazione e lucidit\xE0. Resta con questa energia!",
        "La parte pi\xF9 impegnativa \xE8 alle spalle. Ora tutto scorre fluido.",
        "Concentrazione meravigliosa! Accompagna la sessione fino al termine."
      ],
      end: [
        "Quasi fatto! Manca solo un piccolissimo e piacevole sprint finale.",
        "Lavoro brillante! Il traguardo \xE8 ormai a un passo da te.",
        "Straordinario impegno, restano solo pochi istanti di focus!",
        "Ci sei quasi arrivato! Assapora la gioia di avercela fatta.",
        "Ultimo tratto: chiudi questo momento con orgoglio e serenit\xE0!",
        "A un passo dalla vittoria. Senti la bella soddisfazione nel petto!",
        "Impegno impeccabile, hai conquistato il tuo obiettivo!",
        "Resistenza da applausi. Puoi essere davvero fiero di te oggi."
      ],
      overdue: [
        "Sessione completata! \xC8 giunto il momento per una pausa rigenerante.",
        "Fai un respiro profondo e rilassati. Hai fatto un gran lavoro!",
        "Il tuo tempo di focus \xE8 terminato. Concedi riposo alla tua mente.",
        "Che ne dici di un bicchiere d'acqua fresca e due passi distensivi?",
        "Hai ottenuto grandi risultati. Stacca la spina e rilassati.",
        "\xC8 tempo di cambiare visuale. Bravissimo per la tua dedizione!"
      ]
    },
    es: {
      start: [
        "\xA1Excelente comienzo! Respira profundo y da este primer paso con total calma.",
        "\xA1Muy bien, ya diste el primer paso! Tienes el control absoluto.",
        "Paso a pasito, con calma. \xA1Lo vas a lograr con total soltura!",
        "\xA1Vamos all\xE1! Tu impulso ganador empieza aqu\xED y ahora.",
        "Cada segundo de concentraci\xF3n suma. Disfruta de esta fluidez.",
        "Mente despejada y lista. \xA1Sum\xE9rgete con alegr\xEDa en tu tarea!",
        "Un inicio fant\xE1stico. Hagamos que esta sesi\xF3n sea maravillosa.",
        "Encontraste tu propio ritmo. \xA1Lo est\xE1s haciendo de maravilla!"
      ],
      halfway: [
        "\xA1Ya est\xE1s a mitad de camino! Lo est\xE1s haciendo de forma espectacular.",
        "Mant\xE9n este ritmo sereno y constante, \xA1vas directo al \xE9xito!",
        "\xA1Progreso fabuloso! Suelta los hombros un momento y contin\xFAa.",
        "\xA1Punto medio conquistado! Tu propia inercia te lleva hacia adelante.",
        "\xA1Sigue fluyendo as\xED, est\xE1s en tu estado de flow ideal!",
        "Gran constancia y claridad mental. \xA1Sigue con esa bella energ\xEDa!",
        "Lo m\xE1s dif\xEDcil ya qued\xF3 atr\xE1s. Ahora todo marcha sobre ruedas.",
        "\xA1Concentraci\xF3n de diez! Desl\xEDzate suavemente hacia el final."
      ],
      end: [
        "\xA1Casi listo! Solo queda un tramo final muy breve y gratificante.",
        "\xA1Trabajo brillante! La meta resplandece justo frente a ti.",
        "\xA1Extraordinario esfuerzo, solo faltan unos instantes de enfoque!",
        "\xA1Ya est\xE1s pr\xE1cticamente ah\xED! Siente el orgullo de lograrlo.",
        "\xDAltimo detalle: \xA1remata esta sesi\xF3n con alegr\xEDa y satisfacci\xF3n!",
        "A pasitos de la meta. \xA1Disfruta la sensaci\xF3n de triunfo!",
        "Dedicaci\xF3n fenomenal, \xA1el objetivo ya es todo tuyo!",
        "Perseverancia admirable. Si\xE9ntete muy orgulloso de tu d\xEDa."
      ],
      overdue: [
        "\xA1Tiempo de enfoque cumplido! Momento ideal para una pausa reconfortante.",
        "Respira hondo y suelta la tensi\xF3n. \xA1Hiciste un trabajo grandioso!",
        "Tu sesi\xF3n ha concluido. Dale un merecido descanso a tu mirada.",
        "\xBFQu\xE9 tal un vaso de agua fresca y estirar un poco las piernas?",
        "Avanzaste much\xEDsimo hoy. T\xF3mate un respiro y desconecta.",
        "Hora de un suave cambio de ambiente. \xA1Felicidades por tu enfoque!"
      ]
    },
    el: {
      start: [
        "\u03A5\u03C0\u03AD\u03C1\u03BF\u03C7\u03BF \u03BE\u03B5\u03BA\u03AF\u03BD\u03B7\u03BC\u03B1! \u03A0\u03AC\u03C1\u03B5 \u03BC\u03B9\u03B1 \u03B2\u03B1\u03B8\u03B9\u03AC \u03B1\u03BD\u03AC\u03C3\u03B1 \u03BA\u03B1\u03B9 \u03BA\u03AC\u03BD\u03B5 \u03B1\u03C5\u03C4\u03CC \u03C4\u03BF \u03C0\u03C1\u03CE\u03C4\u03BF \u03B2\u03AE\u03BC\u03B1 \u03BC\u03B5 \u03B7\u03C1\u03B5\u03BC\u03AF\u03B1.",
        "\u03A0\u03BF\u03BB\u03CD \u03CC\u03BC\u03BF\u03C1\u03C6\u03B1, \u03B7 \u03B1\u03C1\u03C7\u03AE \u03AD\u03B3\u03B9\u03BD\u03B5! \u0388\u03C7\u03B5\u03B9\u03C2 \u03C4\u03BF\u03BD \u03B1\u03C0\u03CC\u03BB\u03C5\u03C4\u03BF \u03AD\u03BB\u03B5\u03B3\u03C7\u03BF \u03C4\u03BF\u03C5 \u03C7\u03C1\u03CC\u03BD\u03BF\u03C5 \u03C3\u03BF\u03C5.",
        "\u0392\u03AE\u03BC\u03B1 \u03C0\u03C1\u03BF\u03C2 \u03B2\u03AE\u03BC\u03B1, \u03AE\u03C1\u03B5\u03BC\u03B1. \u039C\u03C0\u03BF\u03C1\u03B5\u03AF\u03C2 \u03BD\u03B1 \u03C4\u03BF \u03C0\u03B5\u03C4\u03CD\u03C7\u03B5\u03B9\u03C2 \u03BC\u03B5 \u03B1\u03C0\u03CC\u03BB\u03C5\u03C4\u03B7 \u03B5\u03C5\u03BA\u03BF\u03BB\u03AF\u03B1!",
        "\u03A0\u03AC\u03BC\u03B5 \u03B4\u03C5\u03BD\u03B1\u03C4\u03AC! \u0397 \u03B8\u03B5\u03C4\u03B9\u03BA\u03AE \u03C3\u03BF\u03C5 \u03BF\u03C1\u03BC\u03AE \u03B3\u03B5\u03BD\u03BD\u03B9\u03AD\u03C4\u03B1\u03B9 \u03B5\u03B4\u03CE \u03BA\u03B1\u03B9 \u03C4\u03CE\u03C1\u03B1.",
        "\u039A\u03AC\u03B8\u03B5 \u03C3\u03C4\u03B9\u03B3\u03BC\u03AE \u03C3\u03C5\u03B3\u03BA\u03AD\u03BD\u03C4\u03C1\u03C9\u03C3\u03B7\u03C2 \u03BC\u03B5\u03C4\u03C1\u03AC\u03B5\u03B9. \u0391\u03C0\u03CC\u03BB\u03B1\u03C5\u03C3\u03B5 \u03C4\u03B7\u03BD \u03BA\u03B1\u03B8\u03B1\u03C1\u03AE \u03C1\u03BF\u03AE.",
        "\u039A\u03B1\u03B8\u03B1\u03C1\u03CC \u03BC\u03C5\u03B1\u03BB\u03CC \u03BA\u03B1\u03B9 \u03CC\u03BC\u03BF\u03C1\u03C6\u03B7 \u03B4\u03B9\u03AC\u03B8\u03B5\u03C3\u03B7. \u0392\u03C5\u03B8\u03AF\u03C3\u03BF\u03C5 \u03BC\u03B5 \u03C7\u03B1\u03C1\u03AC \u03C3\u03C4\u03B7 \u03B4\u03BF\u03C5\u03BB\u03B5\u03B9\u03AC \u03C3\u03BF\u03C5!",
        "\u0388\u03BD\u03B1 \u03B5\u03BE\u03B1\u03B9\u03C1\u03B5\u03C4\u03B9\u03BA\u03CC \u03BE\u03B5\u03BA\u03AF\u03BD\u03B7\u03BC\u03B1. \u0391\u03C2 \u03BA\u03AC\u03BD\u03BF\u03C5\u03BC\u03B5 \u03B1\u03C5\u03C4\u03CC \u03C4\u03BF \u03B4\u03B9\u03AC\u03C3\u03C4\u03B7\u03BC\u03B1 \u03C0\u03C1\u03B1\u03B3\u03BC\u03B1\u03C4\u03B9\u03BA\u03AC \u03B1\u03C0\u03BF\u03B4\u03BF\u03C4\u03B9\u03BA\u03CC.",
        "\u0392\u03C1\u03AF\u03C3\u03BA\u03B5\u03B9\u03C2 \u03C4\u03BF\u03BD \u03B9\u03B4\u03B1\u03BD\u03B9\u03BA\u03CC \u03C3\u03BF\u03C5 \u03C1\u03C5\u03B8\u03BC\u03CC. \u03A4\u03B1 \u03C0\u03B7\u03B3\u03B1\u03AF\u03BD\u03B5\u03B9\u03C2 \u03C0\u03B5\u03C1\u03AF\u03C6\u03B7\u03BC\u03B1!"
      ],
      halfway: [
        "\u0388\u03C6\u03C4\u03B1\u03C3\u03B5\u03C2 \u03AE\u03B4\u03B7 \u03C3\u03C4\u03B1 \u03BC\u03B9\u03C3\u03AC \u03C4\u03BF\u03C5 \u03B4\u03C1\u03CC\u03BC\u03BF\u03C5! \u03A4\u03B1 \u03BA\u03B1\u03C4\u03B1\u03C6\u03AD\u03C1\u03BD\u03B5\u03B9\u03C2 \u03B1\u03C0\u03BF\u03BB\u03CD\u03C4\u03C9\u03C2 \u03C6\u03B1\u03BD\u03C4\u03B1\u03C3\u03C4\u03B9\u03BA\u03AC.",
        "\u039A\u03C1\u03AC\u03C4\u03B1 \u03B1\u03C5\u03C4\u03CC\u03BD \u03C4\u03BF\u03BD \u03B3\u03B1\u03BB\u03AE\u03BD\u03B9\u03BF \u03C1\u03C5\u03B8\u03BC\u03CC, \u03B5\u03AF\u03C3\u03B1\u03B9 \u03C3\u03B5 \u03B9\u03B4\u03B1\u03BD\u03B9\u03BA\u03AE \u03C0\u03BF\u03C1\u03B5\u03AF\u03B1 \u03B5\u03C0\u03B9\u03C4\u03C5\u03C7\u03AF\u03B1\u03C2!",
        "\u03A5\u03C0\u03AD\u03C1\u03BF\u03C7\u03B7 \u03C0\u03C1\u03CC\u03BF\u03B4\u03BF\u03C2! \u03A7\u03B1\u03BB\u03AC\u03C1\u03C9\u03C3\u03B5 \u03BB\u03AF\u03B3\u03BF \u03C4\u03BF\u03C5\u03C2 \u03CE\u03BC\u03BF\u03C5\u03C2 \u03C3\u03BF\u03C5 \u03BA\u03B1\u03B9 \u03C3\u03C5\u03BD\u03AD\u03C7\u03B9\u03C3\u03B5.",
        "\u0397 \u03BC\u03AD\u03C3\u03B7 \u03BA\u03B1\u03C4\u03B1\u03BA\u03C4\u03AE\u03B8\u03B7\u03BA\u03B5, \u03B7 \u03B4\u03B9\u03BA\u03AE \u03C3\u03BF\u03C5 \u03BF\u03C1\u03BC\u03AE \u03C3\u03B5 \u03BF\u03B4\u03B7\u03B3\u03B5\u03AF \u03BC\u03C0\u03C1\u03BF\u03C3\u03C4\u03AC \u03BC\u03B5 \u03B5\u03C5\u03BA\u03BF\u03BB\u03AF\u03B1.",
        "\u03A3\u03C5\u03BD\u03AD\u03C7\u03B9\u03C3\u03B5 \u03AD\u03C4\u03C3\u03B9, \u03B2\u03C1\u03AF\u03C3\u03BA\u03B5\u03C3\u03B1\u03B9 \u03BC\u03AD\u03C3\u03B1 \u03C3\u03C4\u03B7\u03BD \u03B1\u03C0\u03CC\u03BB\u03C5\u03C4\u03B7 \u03C6\u03C5\u03C3\u03B9\u03BA\u03AE \u03C3\u03BF\u03C5 \u03C1\u03BF\u03AE!",
        "\u03A3\u03C0\u03BF\u03C5\u03B4\u03B1\u03AF\u03B1 \u03B5\u03C0\u03B9\u03BC\u03BF\u03BD\u03AE \u03BA\u03B1\u03B9 \u03B4\u03B9\u03B1\u03CD\u03B3\u03B5\u03B9\u03B1. \u039C\u03B5\u03AF\u03BD\u03B5 \u03C3\u03C5\u03BD\u03C4\u03BF\u03BD\u03B9\u03C3\u03BC\u03AD\u03BD\u03BF\u03C2 \u03C3\u03B5 \u03B1\u03C5\u03C4\u03AE \u03C4\u03B7\u03BD \u03B5\u03BD\u03AD\u03C1\u03B3\u03B5\u03B9\u03B1!",
        "\u03A4\u03BF \u03B4\u03C5\u03C3\u03BA\u03BF\u03BB\u03CC\u03C4\u03B5\u03C1\u03BF \u03BA\u03BF\u03BC\u03BC\u03AC\u03C4\u03B9 \u03C0\u03AD\u03C1\u03B1\u03C3\u03B5. \u03A4\u03CE\u03C1\u03B1 \u03CC\u03BB\u03B1 \u03BA\u03C5\u03BB\u03BF\u03CD\u03BD \u03B1\u03B2\u03AF\u03B1\u03C3\u03C4\u03B1.",
        "\u0395\u03BE\u03B1\u03B9\u03C1\u03B5\u03C4\u03B9\u03BA\u03AE \u03C3\u03C5\u03B3\u03BA\u03AD\u03BD\u03C4\u03C1\u03C9\u03C3\u03B7! \u0393\u03BB\u03AF\u03C3\u03C4\u03C1\u03B7\u03C3\u03B5 \u03CC\u03BC\u03BF\u03C1\u03C6\u03B1 \u03C0\u03C1\u03BF\u03C2 \u03C4\u03BF \u03C4\u03AD\u03BB\u03BF\u03C2."
      ],
      end: [
        "\u03A3\u03C7\u03B5\u03B4\u03CC\u03BD \u03C4\u03B5\u03BB\u03B5\u03AF\u03C9\u03C3\u03B5\u03C2! \u0391\u03C0\u03BF\u03BC\u03AD\u03BD\u03B5\u03B9 \u03BC\u03CC\u03BD\u03BF \u03BC\u03B9\u03B1 \u03BC\u03B9\u03BA\u03C1\u03AE, \u03B5\u03C5\u03C7\u03AC\u03C1\u03B9\u03C3\u03C4\u03B7 \u03C4\u03B5\u03BB\u03B9\u03BA\u03AE \u03B5\u03C5\u03B8\u03B5\u03AF\u03B1.",
        "\u039B\u03B1\u03BC\u03C0\u03C1\u03AE \u03C0\u03C1\u03BF\u03C3\u03C0\u03AC\u03B8\u03B5\u03B9\u03B1! \u0397 \u03B3\u03C1\u03B1\u03BC\u03BC\u03AE \u03C4\u03BF\u03C5 \u03C4\u03B5\u03C1\u03BC\u03B1\u03C4\u03B9\u03C3\u03BC\u03BF\u03CD \u03BB\u03AC\u03BC\u03C0\u03B5\u03B9 \u03BC\u03C0\u03C1\u03BF\u03C3\u03C4\u03AC \u03C3\u03BF\u03C5.",
        "\u0395\u03BE\u03B1\u03B9\u03C1\u03B5\u03C4\u03B9\u03BA\u03AE \u03B4\u03BF\u03C5\u03BB\u03B5\u03B9\u03AC, \u03AD\u03BC\u03B5\u03B9\u03BD\u03B1\u03BD \u03BC\u03CC\u03BD\u03BF \u03B5\u03BB\u03AC\u03C7\u03B9\u03C3\u03C4\u03B5\u03C2 \u03C3\u03C4\u03B9\u03B3\u03BC\u03AD\u03C2 \u03B5\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7\u03C2!",
        "\u0388\u03C6\u03C4\u03B1\u03C3\u03B5\u03C2 \u03C3\u03C7\u03B5\u03B4\u03CC\u03BD \u03C3\u03C4\u03B7\u03BD \u03BA\u03BF\u03C1\u03C5\u03C6\u03AE! \u039D\u03B9\u03CE\u03C3\u03B5 \u03C4\u03B7\u03BD \u03C0\u03B5\u03C1\u03B7\u03C6\u03AC\u03BD\u03B9\u03B1 \u03C4\u03B7\u03C2 \u03B5\u03C0\u03B9\u03C4\u03C5\u03C7\u03AF\u03B1\u03C2.",
        "\u03A4\u03B5\u03BB\u03B9\u03BA\u03AE \u03C0\u03B9\u03BD\u03B5\u03BB\u03B9\u03AC: \u03BF\u03BB\u03BF\u03BA\u03BB\u03AE\u03C1\u03C9\u03C3\u03B5 \u03B1\u03C5\u03C4\u03CC \u03C4\u03BF \u03B2\u03AE\u03BC\u03B1 \u03BC\u03B5 \u03C7\u03B1\u03BC\u03CC\u03B3\u03B5\u03BB\u03BF \u03BA\u03B1\u03B9 \u03B9\u03BA\u03B1\u03BD\u03BF\u03C0\u03BF\u03AF\u03B7\u03C3\u03B7!",
        "\u03A4\u03CC\u03C3\u03BF \u03BA\u03BF\u03BD\u03C4\u03AC \u03C3\u03C4\u03BF\u03BD \u03C3\u03C4\u03CC\u03C7\u03BF \u03C3\u03BF\u03C5. \u0391\u03C0\u03CC\u03BB\u03B1\u03C5\u03C3\u03B5 \u03C4\u03B7 \u03B3\u03BB\u03C5\u03BA\u03B9\u03AC \u03B1\u03AF\u03C3\u03B8\u03B7\u03C3\u03B7 \u03C4\u03BF\u03C5 \u03B5\u03C0\u03B9\u03C4\u03B5\u03CD\u03B3\u03BC\u03B1\u03C4\u03BF\u03C2!",
        "\u03A6\u03B1\u03B9\u03BD\u03BF\u03BC\u03B5\u03BD\u03B9\u03BA\u03AE \u03B1\u03C6\u03BF\u03C3\u03AF\u03C9\u03C3\u03B7, \u03C4\u03BF \u03BA\u03B1\u03C4\u03AC\u03C6\u03B5\u03C1\u03B5\u03C2 \u03BC\u03B5 \u03C4\u03BF\u03BD \u03BA\u03B1\u03BB\u03CD\u03C4\u03B5\u03C1\u03BF \u03C4\u03C1\u03CC\u03C0\u03BF!",
        "\u0391\u03BE\u03B9\u03BF\u03B8\u03B1\u03CD\u03BC\u03B1\u03C3\u03C4\u03B7 \u03B1\u03BD\u03C4\u03BF\u03C7\u03AE. \u039C\u03C0\u03BF\u03C1\u03B5\u03AF\u03C2 \u03BD\u03B1 \u03BD\u03B9\u03CE\u03B8\u03B5\u03B9\u03C2 \u03C0\u03B5\u03C1\u03AE\u03C6\u03B1\u03BD\u03BF\u03C2 \u03B3\u03B9\u03B1 \u03C4\u03B7 \u03C3\u03B7\u03BC\u03B5\u03C1\u03B9\u03BD\u03AE \u03C3\u03BF\u03C5 \u03BC\u03AD\u03C1\u03B1."
      ],
      overdue: [
        "\u039F \u03C7\u03C1\u03CC\u03BD\u03BF\u03C2 \u03B5\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7\u03C2 \u03BF\u03BB\u03BF\u03BA\u03BB\u03B7\u03C1\u03CE\u03B8\u03B7\u03BA\u03B5! \u038F\u03C1\u03B1 \u03B3\u03B9\u03B1 \u03AD\u03BD\u03B1 \u03BA\u03B1\u03BB\u03BF\u03B4\u03B5\u03C7\u03BF\u03CD\u03BC\u03B5\u03BD\u03BF \u03B4\u03B9\u03AC\u03BB\u03B5\u03B9\u03BC\u03BC\u03B1.",
        "\u03A0\u03AC\u03C1\u03B5 \u03BC\u03B9\u03B1 \u03B2\u03B1\u03B8\u03B9\u03AC \u03B1\u03BD\u03AC\u03C3\u03B1 \u03BA\u03B1\u03B9 \u03AC\u03C6\u03B7\u03C3\u03B5 \u03C4\u03B7\u03BD \u03AD\u03BD\u03C4\u03B1\u03C3\u03B7. \u0388\u03BA\u03B1\u03BD\u03B5\u03C2 \u03C3\u03C0\u03BF\u03C5\u03B4\u03B1\u03AF\u03B1 \u03B4\u03BF\u03C5\u03BB\u03B5\u03B9\u03AC!",
        "\u0397 \u03C3\u03C5\u03BD\u03B5\u03B4\u03C1\u03AF\u03B1 \u03C3\u03BF\u03C5 \u03C4\u03B5\u03BB\u03B5\u03AF\u03C9\u03C3\u03B5. \u03A7\u03AC\u03C1\u03B9\u03C3\u03B5 \u03BB\u03AF\u03B3\u03B7 \u03BE\u03B5\u03BA\u03BF\u03CD\u03C1\u03B1\u03C3\u03B7 \u03C3\u03C4\u03B1 \u03BC\u03AC\u03C4\u03B9\u03B1 \u03BA\u03B1\u03B9 \u03C3\u03C4\u03BF \u03BC\u03C5\u03B1\u03BB\u03CC \u03C3\u03BF\u03C5.",
        "\u03A4\u03B9 \u03B8\u03B1 \u03AD\u03BB\u03B5\u03B3\u03B5\u03C2 \u03B3\u03B9\u03B1 \u03AD\u03BD\u03B1 \u03C0\u03BF\u03C4\u03AE\u03C1\u03B9 \u03B4\u03C1\u03BF\u03C3\u03B5\u03C1\u03CC \u03BD\u03B5\u03C1\u03CC \u03BA\u03B1\u03B9 \u03BB\u03AF\u03B3\u03B5\u03C2 \u03B4\u03B9\u03B1\u03C4\u03AC\u03C3\u03B5\u03B9\u03C2;",
        "\u03A0\u03AD\u03C4\u03C5\u03C7\u03B5\u03C2 \u03C0\u03AC\u03C1\u03B1 \u03C0\u03BF\u03BB\u03BB\u03AC \u03C3\u03AE\u03BC\u03B5\u03C1\u03B1. \u039A\u03AC\u03BD\u03B5 \u03AD\u03BD\u03B1 \u03B2\u03AE\u03BC\u03B1 \u03C0\u03AF\u03C3\u03C9 \u03BA\u03B1\u03B9 \u03C7\u03B1\u03BB\u03AC\u03C1\u03C9\u03C3\u03B5.",
        "\u038F\u03C1\u03B1 \u03B3\u03B9\u03B1 \u03BC\u03B9\u03B1 \u03CC\u03BC\u03BF\u03C1\u03C6\u03B7 \u03B1\u03BB\u03BB\u03B1\u03B3\u03AE \u03C0\u03B1\u03C1\u03B1\u03C3\u03C4\u03AC\u03C3\u03B5\u03C9\u03BD. \u03A3\u03C5\u03B3\u03C7\u03B1\u03C1\u03B7\u03C4\u03AE\u03C1\u03B9\u03B1 \u03B3\u03B9\u03B1 \u03C4\u03B7\u03BD \u03C0\u03C1\u03BF\u03C3\u03C0\u03AC\u03B8\u03B5\u03B9\u03B1!"
      ]
    }
  };
  var lastMotivationByTier2 = {};
  function pickWithoutImmediateRepeat2(list, lastValue) {
    if (!list || list.length === 0) return "";
    if (list.length === 1) return list[0];
    let choice;
    do {
      choice = list[Math.floor(Math.random() * list.length)];
    } while (choice === lastValue);
    return choice;
  }
  function getCurrentPresetMinutes2() {
    const presetReal = document.getElementById("timer-preset-select-real");
    return presetReal ? parseInt(presetReal.value) || 2 : 2;
  }
  document.addEventListener("DOMContentLoaded", () => {
    const mins = getCurrentPresetMinutes2();
    timerSeconds2 = mins * 60;
    timerInitialSeconds2 = mins * 60;
    updateTimerDisplay();
    updateTimerUI();
    updateMuteButtonsUI2();
  });
  function toggleTimerSound() {
    timerSoundEnabled2 = !timerSoundEnabled2;
    localStorage.setItem("flowTimerSoundEnabled", String(timerSoundEnabled2));
    if (!timerSoundEnabled2) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      stopAmbientSound(true);
      if (ringInterval2) {
        clearInterval(ringInterval2);
        ringInterval2 = null;
      }
      showToast(tr({ de: "Timer-Sound stummgeschaltet \u{1F507}", en: "Timer sound muted \u{1F507}", es: "Sonido del temporizador silenciado \u{1F507}", el: "\u039F \u03AE\u03C7\u03BF\u03C2 \u03C4\u03BF\u03C5 \u03C7\u03C1\u03BF\u03BD\u03BF\u03BC\u03AD\u03C4\u03C1\u03BF\u03C5 \u03C3\u03AF\u03B3\u03B1\u03C3\u03B5 \u{1F507}", fr: "Son du minuteur coup\xE9 \u{1F507}", it: "Audio del timer disattivato \u{1F507}" }));
    } else {
      showToast(tr({ de: "Timer-Sound eingeschaltet \u{1F50A}", en: "Timer sound unmuted \u{1F50A}", es: "Sonido del temporizador activado \u{1F50A}", el: "\u039F \u03AE\u03C7\u03BF\u03C2 \u03C4\u03BF\u03C5 \u03C7\u03C1\u03BF\u03BD\u03BF\u03BC\u03AD\u03C4\u03C1\u03BF\u03C5 \u03B5\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03B9\u03AE\u03B8\u03B7\u03BA\u03B5 \u{1F50A}", fr: "Son du minuteur activ\xE9 \u{1F50A}", it: "Audio del timer attivato \u{1F50A}" }));
      if (timerRunning2) {
        playRandomTimerAmbient2();
      }
    }
    updateMuteButtonsUI2();
  }
  function updateMuteButtonsUI2() {
    const muteBtnIds = ["timer-mute-btn", "helper-pick-timer-mute-btn", "helper-steps-timer-mute"];
    muteBtnIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        if (timerSoundEnabled2) {
          el.innerHTML = '<i data-lucide="volume-2" class="w-3.5 h-3.5 text-gray-300 hover:text-white"></i>';
          el.title = tr({ de: "Stummschalten", en: "Mute", es: "Silenciar", el: "\u03A3\u03AF\u03B3\u03B1\u03C3\u03B7", fr: "Couper le son", it: "Disattiva audio" });
        } else {
          el.innerHTML = '<i data-lucide="volume-x" class="w-3.5 h-3.5 text-rose-400"></i>';
          el.title = tr({ de: "Ton einschalten", en: "Unmute", es: "Activar sonido", el: "\u0395\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03AF\u03B7\u03C3\u03B7 \u03AE\u03C7\u03BF\u03C5", fr: "Activer le son", it: "Attiva audio" });
        }
      }
    });
    if (typeof lucide !== "undefined") lucide.createIcons();
  }
  function playRandomTimerAmbient2(crossfade = false) {
    if (!timerSoundEnabled2 || !timerRunning2) return;
    let chosen;
    do {
      chosen = TIMER_AMBIENTS[Math.floor(Math.random() * TIMER_AMBIENTS.length)];
    } while (chosen === lastSelectedTimerAmbient && TIMER_AMBIENTS.length > 1);
    lastSelectedTimerAmbient = chosen;
    if (typeof playAmbientSound === "function") {
      playAmbientSound(chosen, crossfade);
    }
  }
  var cachedVoices = [];
  function updateSpeechVoices() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      cachedVoices = window.speechSynthesis.getVoices() || [];
    }
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    updateSpeechVoices();
    window.speechSynthesis.onvoiceschanged = updateSpeechVoices;
  }
  function speakWithProfile2(text, profileIndex = null) {
    if (!timerSoundEnabled2) return;
    if (!("speechSynthesis" in window)) return;
    if (!text || typeof text !== "string") return;
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();
      let naturalText = text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}]/gu, "").replace(/^\s*\d+[\.\)\:]\s+/, "").replace(/^[•\-\*✓✔✕\+➔]+\s*/, "").replace(/\s*([!?.])\s*/g, "$1 ").replace(/([,;:])\s*/g, "$1 ").replace(/\s+/g, " ").trim();
      if (!naturalText) naturalText = text;
      const utterance = new SpeechSynthesisUtterance(naturalText);
      const lang = typeof currentLang !== "undefined" ? currentLang : "en";
      const langMap = { en: "en-US", de: "de-DE", es: "es-ES", el: "el-GR", fr: "fr-FR", it: "it-IT" };
      const targetLang = langMap[lang] || "en-US";
      utterance.lang = targetLang;
      utterance.volume = 1;
      if (profileIndex === null || profileIndex === void 0) {
        profileIndex = globalVoiceTurnIndex++;
      }
      const profile = VOICE_PROFILES[Math.abs(profileIndex) % VOICE_PROFILES.length] || VOICE_PROFILES[0];
      utterance.rate = profile.rate || 0.96;
      utterance.pitch = profile.pitch || 1;
      if (cachedVoices.length === 0) updateSpeechVoices();
      const allVoices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
      const langPrefix = targetLang.split("-")[0].toLowerCase();
      const matchingVoices = allVoices.filter((v) => v.lang && v.lang.toLowerCase().replace("_", "-").startsWith(langPrefix));
      const premiumVoices = matchingVoices.filter(
        (v) => /natural|neural|online|google|siri|apple|premium|enhanced|wavenet/i.test(v.name)
      );
      const pool = premiumVoices.length > 0 ? premiumVoices : matchingVoices.length > 0 ? matchingVoices : allVoices;
      const femaleKeywords = [
        "hedda",
        "katja",
        "anna",
        "zira",
        "petra",
        "elena",
        "hazel",
        "susan",
        "samantha",
        "moira",
        "tessa",
        "deutsch",
        "female",
        "julie",
        "hortense",
        "clara",
        "paola",
        "lucia",
        "monica",
        "victoria",
        "audrey",
        "alice",
        "federica",
        "denise",
        "jenny",
        "sonia",
        "isabella",
        "athina",
        "elli",
        "marta",
        "laura",
        "chiara",
        "serena",
        "ava",
        "karen"
      ];
      const maleKeywords = [
        "stefan",
        "yannick",
        "markus",
        "david",
        "george",
        "ravi",
        "stefanos",
        "male",
        "paul",
        "henri",
        "alvaro",
        "jorge",
        "cosimo",
        "thomas",
        "daniel",
        "oliver",
        "arthur",
        "claude",
        "guy",
        "diego",
        "nestoras",
        "nikos",
        "paulino",
        "matteo"
      ];
      const femaleVoices = pool.filter(
        (v) => femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw)) && !maleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      );
      const maleVoices = pool.filter(
        (v) => maleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
      );
      let selectedVoice = null;
      if (profile.gender === "female" && femaleVoices.length > 0) {
        selectedVoice = femaleVoices[Math.abs(profileIndex) % femaleVoices.length];
      } else if (profile.gender === "male" && maleVoices.length > 0) {
        selectedVoice = maleVoices[Math.abs(profileIndex) % maleVoices.length];
      } else if (profile.gender === "child") {
        selectedVoice = femaleVoices.length > 0 ? femaleVoices[Math.abs(profileIndex) % femaleVoices.length] : pool[Math.abs(profileIndex) % pool.length] || null;
      } else if (pool.length > 0) {
        selectedVoice = pool[Math.abs(profileIndex) % pool.length];
      }
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      if (typeof currentSoundType !== "undefined" && currentSoundType) {
        if (typeof duckAmbientVolume === "function") duckAmbientVolume(1);
        utterance.onend = () => {
          if (typeof restoreAmbientVolume === "function") restoreAmbientVolume();
        };
        utterance.onerror = () => {
          if (typeof restoreAmbientVolume === "function") restoreAmbientVolume();
        };
      }
      const speakSessionToken = currentSpeechSessionId2;
      const speakTimeout = setTimeout(() => {
        if (currentSpeechSessionId2 !== speakSessionToken) return;
        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.warn("speechSynthesis.speak error:", err);
        }
      }, 50);
      if (typeof activeTimeouts !== "undefined" && Array.isArray(activeTimeouts)) {
        activeTimeouts.push(speakTimeout);
      }
    } catch (e) {
      console.error("Fehler bei der speakWithProfile Ausf\xFChrung:", e);
    }
  }
  function speakSoftlyDynamic2(text, remSec, totSec) {
    const minsLeft = Math.floor(remSec / 60);
    speakWithProfile2(text, minsLeft);
  }
  function getContextMotivation2(remSec, totSec) {
    const lang = typeof currentLang !== "undefined" ? currentLang : "de";
    const list = MOTIVATIONAL_CHUNKS2[lang] || MOTIVATIONAL_CHUNKS2["de"];
    const pct = remSec / totSec * 100;
    let tier = "end";
    if (pct > 72) tier = "start";
    else if (pct > 28) tier = "halfway";
    const chosen = pickWithoutImmediateRepeat2(list[tier], lastMotivationByTier2[tier]);
    lastMotivationByTier2[tier] = chosen;
    return chosen;
  }
  if (typeof window !== "undefined") {
    window.toggleTimerSound = toggleTimerSound;
    window.speakWithProfile = speakWithProfile2;
    window.speakSoftlyDynamic = speakSoftlyDynamic2;
    window.getContextMotivation = getContextMotivation2;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.toggleTimerSound = toggleTimerSound;
    globalThis.speakWithProfile = speakWithProfile2;
    globalThis.speakSoftlyDynamic = speakSoftlyDynamic2;
    globalThis.getContextMotivation = getContextMotivation2;
  }

  // timer-3.js
  function syncTimerWithTimestamp() {
    const isRunning = typeof timerRunning !== "undefined" ? timerRunning : typeof window !== "undefined" ? window.timerRunning : false;
    const targetEnd = typeof timerTargetEndTime !== "undefined" ? timerTargetEndTime : typeof window !== "undefined" ? window.timerTargetEndTime : null;
    if (!isRunning || !targetEnd) return;
    const now = Date.now();
    timerSeconds = Math.round((targetEnd - now) / 1e3);
    updateTimerDisplay2();
  }
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        syncTimerWithTimestamp();
      }
    });
    window.addEventListener("focus", () => {
      syncTimerWithTimestamp();
    });
  }
  function updateTimerDisplay2() {
    const isNegative = timerSeconds < 0;
    const absoluteSeconds = Math.abs(timerSeconds);
    const mins = Math.floor(absoluteSeconds / 60);
    const secs = absoluteSeconds % 60;
    const sign = isNegative ? "-" : "";
    const str = `${sign}${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    const displays = ["timer-display", "helper-pick-timer-display", "helper-steps-timer-display", "zen-timer-display", "game-hud-timer-display", "mobile-timer-display"];
    displays.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.innerText = str;
        el.classList.toggle("text-rose-400", isNegative);
        el.classList.toggle("animate-pulse", isNegative);
      }
    });
    const zenStatus = document.getElementById("zen-timer-status");
    const mobStatus = document.getElementById("mobile-timer-status");
    [zenStatus, mobStatus].forEach((st) => {
      if (st) {
        if (timerRunning) {
          st.innerText = isNegative ? "\u26A0\uFE0F \xDCberzeit" : "Fokus aktiv";
          st.className = isNegative ? "text-[10px] text-rose-400 font-bold uppercase tracking-wider animate-pulse" : "text-[10px] text-emerald-400 font-bold uppercase tracking-wider";
        } else {
          st.innerText = "Bereit";
          st.className = "text-[10px] text-gray-400 font-bold uppercase tracking-wider";
        }
      }
    });
    const mobPlayBtn = document.getElementById("mobile-timer-play-btn");
    const mobPauseBtn = document.getElementById("mobile-timer-pause-btn");
    if (mobPlayBtn && mobPauseBtn) {
      if (timerRunning) {
        mobPlayBtn.classList.add("hidden");
        mobPauseBtn.classList.remove("hidden");
      } else {
        mobPlayBtn.classList.remove("hidden");
        mobPauseBtn.classList.add("hidden");
      }
    }
    if (timerRunning) {
      if (isNegative) {
        document.title = `(${str}) \u26A0\uFE0F \xDCberzeit - Flow`;
      } else {
        document.title = `(${str}) Flow`;
      }
    } else {
      document.title = "Flow - Dein Alltagsbegleiter";
    }
    const pct = timerInitialSeconds > 0 ? Math.max(0, timerSeconds / timerInitialSeconds * 100) : 100;
    const progressBars = ["timer-progress-bar", "helper-pick-timer-progress-bar", "helper-steps-timer-progress-bar"];
    progressBars.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.width = isNegative ? "100%" : `${pct}%`;
        el.classList.toggle("bg-rose-500", isNegative);
      }
    });
    const countEl = document.getElementById("ringing-live-counter");
    if (countEl) {
      countEl.innerText = str;
    }
  }

  // sport.js
  var currentSportExercise = null;
  var sportTimerInterval = null;
  var sportTimerSeconds = 60;
  var sportTimerRunning = false;
  function closeSportModal2() {
    document.getElementById("helper-sport-modal").classList.add("hidden");
    resetSportTimer();
  }
  function updateSportTimerDisplay() {
    const display = document.getElementById("sport-timer-display");
    const progress = document.getElementById("sport-timer-progress");
    if (display) {
      const mins = Math.floor(sportTimerSeconds / 60);
      const secs = sportTimerSeconds % 60;
      display.innerText = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    if (progress && currentSportExercise) {
      const pct = sportTimerSeconds / currentSportExercise.duration * 100;
      progress.style.width = `${pct}%`;
    }
  }
  function resetSportTimer() {
    if (sportTimerInterval) {
      clearInterval(sportTimerInterval);
      sportTimerInterval = null;
    }
    sportTimerRunning = false;
    const playBtn = document.getElementById("sport-timer-play-btn");
    const pauseBtn = document.getElementById("sport-timer-pause-btn");
    if (playBtn) playBtn.classList.remove("hidden");
    if (pauseBtn) pauseBtn.classList.add("hidden");
    if (currentSportExercise) {
      sportTimerSeconds = currentSportExercise.duration;
    }
    updateSportTimerDisplay();
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const sportModal = document.getElementById("helper-sport-modal");
      if (sportModal && !sportModal.classList.contains("hidden")) {
        closeSportModal2();
      }
    }
  });

  // gamification.js
  var gameScene2;
  var gameCamera2;
  var gameRenderer;
  var gameControls2;
  var gameActive2 = false;
  var gameInteractiveObjects2 = [];
  var currentGameWorld2 = "orbit_deck";
  var gameSfxEnabled = true;
  var gameFrameId = null;
  var gameParticles = [];
  var gameExplosionParticles = [];
  var gameAnimatedObjects2 = [];
  var gameTime = 0;
  var gameRaycaster;
  var gameMouse;
  var gameHoveredObject = null;
  var gameActiveTaskItem = null;
  var playerLevel = parseInt(localStorage.getItem("flow_game_level")) || 1;
  var playerXp = parseInt(localStorage.getItem("flow_game_xp")) || 0;
  var worldPresets = {
    orbit_deck: {
      name: "Sci-Fi Orbit-Deck",
      icon: "\u{1F30C}",
      bg: 197388,
      fog: 328984,
      ambient: 1579578,
      primaryLight: 3718648,
      accentLight: 11032055,
      groundColor: 658462
    },
    floating_island: {
      name: "Cozy Floating Island",
      icon: "\u{1F3DD}\uFE0F",
      bg: 661807,
      fog: 795456,
      ambient: 2245734,
      primaryLight: 16638023,
      accentLight: 3462041,
      groundColor: 1461859
    },
    task_metropolis: {
      name: "3D Task-Metropole",
      icon: "\u{1F3D9}\uFE0F",
      bg: 526612,
      fog: 790048,
      ambient: 2106432,
      primaryLight: 6333946,
      accentLight: 16096779,
      groundColor: 1120295
    },
    galaxy_runner: {
      name: "Galaxy Runner Cockpit",
      icon: "\u{1F680}",
      bg: 131592,
      fog: 263186,
      ambient: 1184814,
      primaryLight: 15485081,
      accentLight: 440020,
      groundColor: 0
    },
    quest_adventure: {
      name: "Chronicles of Flow (RPG)",
      icon: "\u2694\uFE0F",
      bg: 723220,
      fog: 920346,
      ambient: 3022653,
      primaryLight: 16498468,
      accentLight: 8490232,
      groundColor: 1841431
    }
  };
  window.worldPresets = worldPresets;
  var threeJsLoadPromise = null;
  function ensureThreeJsLoaded() {
    if (typeof window !== "undefined" && window.THREE && (window.THREE.OrbitControls || typeof THREE !== "undefined" && THREE.OrbitControls)) {
      return Promise.resolve();
    }
    if (threeJsLoadPromise) return threeJsLoadPromise;
    threeJsLoadPromise = new Promise((resolve, reject) => {
      if (typeof window !== "undefined" && window.THREE && (window.THREE.OrbitControls || typeof THREE !== "undefined" && THREE.OrbitControls)) {
        resolve();
        return;
      }
      function loadScript(src) {
        return new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = src;
          s.onload = () => res();
          s.onerror = (e) => rej(e);
          document.head.appendChild(s);
        });
      }
      loadScript("vendor/three.min.js").catch(() => loadScript("./vendor/three.min.js")).catch(() => loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js")).then(() => {
        return loadScript("vendor/OrbitControls.js").catch(() => loadScript("./vendor/OrbitControls.js")).catch(() => loadScript("https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"));
      }).then(() => {
        resolve();
      }).catch((err) => {
        threeJsLoadPromise = null;
        reject(err);
      });
    });
    return threeJsLoadPromise;
  }
  function toggleGameMode2() {
    const container = document.getElementById("game-mode-container");
    if (!container) return;
    gameActive2 = !gameActive2;
    if (gameActive2) {
      container.classList.remove("hidden");
      ensureThreeJsLoaded().then(() => {
        initGameEngine();
        updateGameHud();
        playSynthGameSound("enter");
        if (typeof stopAmbientSound === "function") stopAmbientSound(true);
      }).catch((err) => {
        console.warn("Game engine load error:", err);
        if (typeof showToast === "function") showToast("3D-Spielmodus konnte nicht geladen werden.");
        gameActive2 = false;
        container.classList.add("hidden");
      });
    } else {
      container.classList.add("hidden");
      shutdownGameEngine();
      playSynthGameSound("exit");
      if (typeof renderBoard === "function") renderBoard();
    }
  }
  window.toggleGameMode = toggleGameMode2;
  function switchGameWorld(worldId) {
    if (!worldPresets[worldId]) return;
    currentGameWorld2 = worldId;
    document.querySelectorAll("[data-world-tab]").forEach((tab) => {
      const isActive = tab.getAttribute("data-world-tab") === worldId;
      tab.className = isActive ? "px-3 py-1.5 rounded-xl bg-purple-600 border border-purple-400 text-white font-bold text-xs transition cursor-pointer shadow-md flex items-center gap-1.5" : "px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5";
    });
    if (gameActive2) {
      shutdownGameEngine();
      initGameEngine();
      updateGameHud();
      playSynthGameSound("warp");
    }
  }
  window.switchGameWorld = switchGameWorld;
  function initGameEngine() {
    const parent = document.getElementById("game-canvas-parent");
    if (!parent) return;
    parent.innerHTML = "";
    gameRaycaster = new THREE.Raycaster();
    gameMouse = new THREE.Vector2();
    const cfg = worldPresets[currentGameWorld2] || worldPresets.orbit_deck;
    gameScene2 = new THREE.Scene();
    gameScene2.background = new THREE.Color(cfg.bg);
    gameScene2.fog = new THREE.FogExp2(cfg.fog, 0.015);
    gameCamera2 = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 300);
    gameCamera2.position.set(0, 16, 28);
    gameCamera2.lookAt(0, 2, 0);
    gameRenderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    gameRenderer.setSize(window.innerWidth, window.innerHeight);
    gameRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gameRenderer.shadowMap.enabled = true;
    gameRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    parent.appendChild(gameRenderer.domElement);
    gameControls2 = new THREE.OrbitControls(gameCamera2, gameRenderer.domElement);
    gameControls2.enableDamping = true;
    gameControls2.dampingFactor = 0.06;
    gameControls2.target.set(0, 2, 0);
    gameControls2.maxPolarAngle = Math.PI / 2 - 0.01;
    gameControls2.minDistance = 3;
    gameControls2.maxDistance = 100;
    gameControls2.update();
    const ambientLight = new THREE.AmbientLight(16777215, 0.85);
    gameScene2.add(ambientLight);
    const hemiLight = new THREE.HemisphereLight(cfg.primaryLight || 3718648, 1118498, 1.2);
    gameScene2.add(hemiLight);
    const dirLight = new THREE.DirectionalLight(16777215, 1.6);
    dirLight.position.set(20, 35, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    gameScene2.add(dirLight);
    const pointLight = new THREE.PointLight(cfg.accentLight || 11032055, 2, 50);
    pointLight.position.set(-10, 10, -5);
    gameScene2.add(pointLight);
    window.addEventListener("resize", onGameResize);
    gameRenderer.domElement.addEventListener("pointermove", onGamePointerMove);
    gameRenderer.domElement.addEventListener("pointerdown", onGameCanvasClick);
    if (currentGameWorld2 === "orbit_deck") {
      buildOrbitDeckWorld();
    } else if (currentGameWorld2 === "floating_island") {
      buildFloatingIslandWorld();
    } else if (currentGameWorld2 === "task_metropolis") {
      buildTaskMetropolisWorld();
    } else if (currentGameWorld2 === "galaxy_runner") {
      buildGalaxyRunnerWorld();
    } else if (currentGameWorld2 === "quest_adventure") {
      if (typeof buildQuestAdventureWorld === "function") {
        buildQuestAdventureWorld();
      } else {
        buildOrbitDeckWorld();
      }
    }
    gameActive2 = true;
    animateGameLoop();
  }
  function buildOrbitDeckWorld() {
    gameInteractiveObjects2 = [];
    gameParticles = [];
    gameExplosionParticles = [];
    const floorGeo = new THREE.CylinderGeometry(40, 42, 2, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 657944,
      roughness: 0.15,
      metalness: 0.85
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -1;
    floor.receiveShadow = true;
    gameScene2.add(floor);
    const grid = new THREE.GridHelper(70, 35, 62206, 8490232);
    grid.position.y = 0.02;
    gameScene2.add(grid);
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(38 + i * 8, 39 + i * 8, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i === 0 ? 62206 : i === 1 ? 8490232 : 15485081,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.05 + i * 0.02;
      gameScene2.add(ring);
    }
    for (let i = 0; i < 12; i++) {
      const h = 8 + i % 3 * 4;
      const pillarGeo = new THREE.BoxGeometry(2, h, 2);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: 1184294,
        roughness: 0.2,
        metalness: 0.9
      });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      const angle = i / 12 * Math.PI * 2;
      const dist = 32;
      pillar.position.set(Math.cos(angle) * dist, h / 2, Math.sin(angle) * dist);
      pillar.castShadow = true;
      gameScene2.add(pillar);
      const capGeo = new THREE.BoxGeometry(2.1, 0.4, 2.1);
      const capMat = new THREE.MeshBasicMaterial({ color: 62206 });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(pillar.position.x, h, pillar.position.z);
      gameScene2.add(cap);
    }
    createAmbientParticles(62206, 8490232, 1200);
    generate3DInteractiveTasks();
  }
  function buildFloatingIslandWorld() {
    gameInteractiveObjects2 = [];
    gameParticles = [];
    gameExplosionParticles = [];
    const islandGeo = new THREE.CylinderGeometry(26, 16, 8, 36);
    const islandMat = new THREE.MeshStandardMaterial({
      color: 862232,
      roughness: 0.8,
      metalness: 0.1
    });
    const island = new THREE.Mesh(islandGeo, islandMat);
    island.position.y = -4;
    island.receiveShadow = true;
    gameScene2.add(island);
    const lakeGeo = new THREE.CircleGeometry(14, 32);
    const lakeMat = new THREE.MeshStandardMaterial({
      color: 1096065,
      roughness: 0.05,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85
    });
    const lake = new THREE.Mesh(lakeGeo, lakeMat);
    lake.rotation.x = -Math.PI / 2;
    lake.position.y = 0.03;
    gameScene2.add(lake);
    for (let i = 0; i < 8; i++) {
      const crystalGeo = new THREE.OctahedronGeometry(1.5 + Math.random() * 0.8, 0);
      const crystalMat = new THREE.MeshStandardMaterial({
        color: 3462041,
        emissive: 366185,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.7
      });
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      const angle = i / 8 * Math.PI * 2;
      const dist = 19;
      crystal.position.set(Math.cos(angle) * dist, 4 + Math.sin(i) * 1.5, Math.sin(angle) * dist);
      gameScene2.add(crystal);
      gameParticles.push(crystal);
    }
    createAmbientParticles(3462041, 7268279, 1e3);
    generate3DInteractiveTasks();
  }
  function buildTaskMetropolisWorld() {
    gameInteractiveObjects2 = [];
    gameParticles = [];
    gameExplosionParticles = [];
    const floorGeo = new THREE.PlaneGeometry(160, 160);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 328973,
      roughness: 0.1,
      metalness: 0.9
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    gameScene2.add(floor);
    const grid = new THREE.GridHelper(160, 80, 62206, 15485081);
    grid.position.y = 0.02;
    gameScene2.add(grid);
    for (let i = 0; i < 30; i++) {
      const h = 16 + Math.random() * 38;
      const w = 3.5 + Math.random() * 4;
      const spireGeo = new THREE.BoxGeometry(w, h, w);
      const spireMat = new THREE.MeshStandardMaterial({
        color: 657942,
        roughness: 0.2,
        metalness: 0.8
      });
      const spire = new THREE.Mesh(spireGeo, spireMat);
      const angle = i / 30 * Math.PI * 2;
      const dist = 36 + Math.random() * 24;
      spire.position.set(Math.cos(angle) * dist, h / 2, Math.sin(angle) * dist);
      spire.castShadow = true;
      gameScene2.add(spire);
      const trimGeo = new THREE.BoxGeometry(w * 1.04, 0.6, w * 1.04);
      const trimMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 62206 : 15485081 });
      const trim = new THREE.Mesh(trimGeo, trimMat);
      trim.position.set(spire.position.x, h - 0.3, spire.position.z);
      gameScene2.add(trim);
    }
    createAmbientParticles(62206, 15485081, 1500);
    generate3DInteractiveTasks();
  }
  function buildGalaxyRunnerWorld() {
    gameInteractiveObjects2 = [];
    gameParticles = [];
    gameExplosionParticles = [];
    for (let i = 0; i < 15; i++) {
      const ringGeo = new THREE.TorusGeometry(12 + i * 1.5, 0.4, 16, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 15485081 : 9133302,
        transparent: true,
        opacity: 0.85
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.z = -50 + i * 15;
      gameScene2.add(ring);
      gameParticles.push(ring);
    }
    const geom = new THREE.BufferGeometry();
    const count = 2e3;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 80;
      pos[i + 1] = (Math.random() - 0.5) * 40;
      pos[i + 2] = (Math.random() - 0.5) * 120;
    }
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 3718648,
      size: 0.4,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const warpStars = new THREE.Points(geom, mat);
    gameScene2.add(warpStars);
    gameParticles.push(warpStars);
    generate3DInteractiveTasks();
  }
  function createAmbientParticles(col1, col2, count) {
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 90;
      pos[i + 1] = Math.random() * 30;
      pos[i + 2] = (Math.random() - 0.5) * 90;
    }
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: col1,
      size: 0.3,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const system = new THREE.Points(geom, mat);
    gameScene2.add(system);
    gameParticles.push(system);
  }
  function getAllOpenTasksList2() {
    const result = [];
    const curItems = typeof getCurrentWorkspaceItems === "function" ? getCurrentWorkspaceItems() : typeof state !== "undefined" && state && state.items ? state.items : {};
    if (curItems && typeof curItems === "object") {
      Object.keys(curItems).forEach((cat) => {
        if (cat === "done") return;
        const list = curItems[cat];
        if (!Array.isArray(list)) return;
        list.forEach((item2, idx) => {
          const taskText = typeof item2 === "string" ? item2 : item2 && item2.task ? item2.task : "";
          if (taskText && taskText.trim()) {
            result.push({
              id: `${cat}_${idx}`,
              cat,
              index: idx,
              text: taskText.trim()
            });
          }
        });
      });
    }
    if (result.length === 0) {
      result.push(
        { id: "daily_0", cat: "daily", index: 0, text: "Tagesfokus setzen \u{1F3AF}" },
        { id: "todo_0", cat: "todo", index: 0, text: "Wichtige Aufgabe erledigen \u26A1" },
        { id: "weekly_0", cat: "weekly", index: 0, text: "Wochenziel erreichen \u{1F3C6}" },
        { id: "notes_0", cat: "notes", index: 0, text: "Gedanken notieren \u{1F4A1}" }
      );
    }
    return result;
  }
  function generate3DInteractiveTasks() {
    if (currentGameWorld2 === "floating_island") {
      spawn3DTasksAsLanterns();
    } else if (currentGameWorld2 === "task_metropolis") {
      spawn3DTasksAsCityProjects();
    } else if (currentGameWorld2 === "galaxy_runner") {
      spawn3DTasksAsFlightBeacons();
    } else {
      spawn3DTasksInOrbit();
    }
  }
  function create3DTaskCardTexture2(taskText, category) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(10, 10, 24, 0.96)";
    if (ctx.roundRect) {
      ctx.roundRect(16, 16, 992, 480, 40);
    } else {
      ctx.rect(16, 16, 992, 480);
    }
    ctx.fill();
    ctx.strokeStyle = "#00f2fe";
    ctx.lineWidth = 8;
    if (ctx.roundRect) {
      ctx.roundRect(16, 16, 992, 480, 40);
    } else {
      ctx.rect(16, 16, 992, 480);
    }
    ctx.stroke();
    ctx.fillStyle = "rgba(6, 182, 212, 0.35)";
    if (ctx.roundRect) ctx.roundRect(40, 36, 320, 64, 18);
    else ctx.rect(40, 36, 320, 64);
    ctx.fill();
    ctx.fillStyle = "#67e8f9";
    ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
    const catLabel = typeof t === "function" ? t(category) : category;
    ctx.fillText(`[ ${String(catLabel || category).toUpperCase()} ]`, 60, 80);
    ctx.fillStyle = "rgba(236, 72, 153, 0.35)";
    if (ctx.roundRect) ctx.roundRect(700, 36, 280, 64, 18);
    else ctx.rect(700, 36, 280, 64);
    ctx.fill();
    ctx.fillStyle = "#f472b6";
    ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillText("+35 XP \u{1F31F}", 730, 80);
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
    ctx.shadowBlur = 12;
    const rawText = String(taskText || "").trim();
    const fontSize = rawText.length > 35 ? 42 : 52;
    ctx.font = `bold ${fontSize}px "Plus Jakarta Sans", sans-serif`;
    const words = rawText.split(" ");
    let line = "";
    let y = 190;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 900 && n > 0) {
        ctx.fillText(line, 50, y);
        line = words[n] + " ";
        y += fontSize + 16;
        if (y > 360) {
          line += "...";
          break;
        }
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 50, y);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    if (ctx.roundRect) ctx.roundRect(40, 400, 944, 70, 16);
    else ctx.rect(40, 400, 944, 70);
    ctx.fill();
    ctx.fillStyle = "#a5f3fc";
    ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText("\u26A1 Klick zum L\xF6sen / Fokus starten", 60, 446);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }
  function spawn3DTasksInOrbit() {
    gameInteractiveObjects2 = [];
    const tasks = getAllOpenTasksList2();
    if (tasks.length === 0) return;
    const count = tasks.length;
    tasks.forEach((t3, i) => {
      const angle = i / count * Math.PI * 2;
      const r = count > 8 ? 12 + i % 2 * 5.5 : 13;
      const yOffset = 3.2 + i % 3 * 1.5;
      const group = new THREE.Group();
      group.position.set(Math.cos(angle) * r, yOffset, Math.sin(angle) * r);
      group.lookAt(0, yOffset, 0);
      const crystalGeo = new THREE.OctahedronGeometry(1.4, 0);
      const crystalMat = new THREE.MeshStandardMaterial({
        color: 9133302,
        emissive: 4988309,
        emissiveIntensity: 0.7,
        roughness: 0.1,
        metalness: 0.9
      });
      const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
      crystalMesh.castShadow = true;
      group.add(crystalMesh);
      const cardTex = create3DTaskCardTexture2(t3.text, t3.cat);
      const cardGeo = new THREE.PlaneGeometry(6, 3);
      const cardMat = new THREE.MeshBasicMaterial({
        map: cardTex,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const cardMesh2 = new THREE.Mesh(cardGeo, cardMat);
      cardMesh2.position.y = 2.6;
      group.add(cardMesh2);
      group.userData = {
        taskData: t3,
        baseY: group.position.y,
        seed: i,
        mainMesh: crystalMesh,
        cardMesh: cardMesh2
      };
      gameScene2.add(group);
      gameInteractiveObjects2.push(group);
    });
  }
  function spawn3DTasksAsLanterns() {
    gameInteractiveObjects2 = [];
    const tasks = getAllOpenTasksList2();
    if (tasks.length === 0) return;
    tasks.forEach((t3, i) => {
      const angle = i / tasks.length * Math.PI * 2;
      const r = 8 + i % 2 * 4;
      const yOffset = 2.8 + i % 3 * 1.2;
      const group = new THREE.Group();
      group.position.set(Math.cos(angle) * r, yOffset, Math.sin(angle) * r);
      const lanternGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.6, 8);
      const lanternMat = new THREE.MeshStandardMaterial({
        color: 16638023,
        emissive: 14251782,
        emissiveIntensity: 0.9,
        roughness: 0.3
      });
      const lanternMesh = new THREE.Mesh(lanternGeo, lanternMat);
      group.add(lanternMesh);
      const cardTex = create3DTaskCardTexture2(t3.text, t3.cat);
      const cardGeo = new THREE.PlaneGeometry(5.6, 2.8);
      const cardMat = new THREE.MeshBasicMaterial({
        map: cardTex,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const cardMesh2 = new THREE.Mesh(cardGeo, cardMat);
      cardMesh2.position.y = 2.4;
      group.add(cardMesh2);
      group.userData = {
        taskData: t3,
        baseY: group.position.y,
        seed: i,
        mainMesh: lanternMesh,
        cardMesh: cardMesh2
      };
      gameScene2.add(group);
      gameInteractiveObjects2.push(group);
    });
  }
  function spawn3DTasksAsCityProjects() {
    gameInteractiveObjects2 = [];
    const tasks = getAllOpenTasksList2();
    if (tasks.length === 0) return;
    const cols = Math.ceil(Math.sqrt(tasks.length));
    tasks.forEach((t3, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const posX = (col - cols / 2) * 8 + 4;
      const posZ = (row - cols / 2) * 8 + 4;
      const group = new THREE.Group();
      group.position.set(posX, 0, posZ);
      const height = 4 + i % 4 * 2.5;
      const bldgGeo = new THREE.BoxGeometry(3.6, height, 3.6);
      const bldgMat = new THREE.MeshStandardMaterial({
        color: 3900150,
        emissive: 1981066,
        roughness: 0.3,
        metalness: 0.7
      });
      const bldgMesh = new THREE.Mesh(bldgGeo, bldgMat);
      bldgMesh.position.y = height / 2;
      bldgMesh.castShadow = true;
      bldgMesh.receiveShadow = true;
      group.add(bldgMesh);
      const cardTex = create3DTaskCardTexture2(t3.text, t3.cat);
      const cardGeo = new THREE.PlaneGeometry(5.8, 2.9);
      const cardMat = new THREE.MeshBasicMaterial({
        map: cardTex,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const cardMesh2 = new THREE.Mesh(cardGeo, cardMat);
      cardMesh2.position.y = height + 1.8;
      group.add(cardMesh2);
      group.userData = {
        taskData: t3,
        baseY: 0,
        seed: i,
        mainMesh: bldgMesh,
        cardMesh: cardMesh2
      };
      gameScene2.add(group);
      gameInteractiveObjects2.push(group);
    });
  }
  function spawn3DTasksAsFlightBeacons() {
    gameInteractiveObjects2 = [];
    const tasks = getAllOpenTasksList2();
    if (tasks.length === 0) return;
    tasks.forEach((t3, i) => {
      const group = new THREE.Group();
      const lane = (i % 3 - 1) * 7;
      const dist = -15 - i * 16;
      group.position.set(lane, 3 + i % 2 * 1.8, dist);
      const beaconGeo = new THREE.DodecahedronGeometry(1.6, 0);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: 15485081,
        emissive: 12458077,
        emissiveIntensity: 0.9,
        roughness: 0.2,
        metalness: 0.8
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      group.add(beaconMesh);
      const cardTex = create3DTaskCardTexture2(t3.text, t3.cat);
      const cardGeo = new THREE.PlaneGeometry(6.2, 3.1);
      const cardMat = new THREE.MeshBasicMaterial({
        map: cardTex,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const cardMesh2 = new THREE.Mesh(cardGeo, cardMat);
      cardMesh2.position.y = 2.8;
      group.add(cardMesh2);
      group.userData = {
        taskData: t3,
        baseY: group.position.y,
        seed: i,
        mainMesh: beaconMesh,
        cardMesh: cardMesh2
      };
      gameScene2.add(group);
      gameInteractiveObjects2.push(group);
    });
  }
  function animateGameLoop() {
    if (!gameActive2 || !gameRenderer || !gameScene2 || !gameCamera2) return;
    gameTime += 0.016;
    gameInteractiveObjects2.forEach((group) => {
      if (!group || !group.userData) return;
      const baseY = typeof group.userData.baseY === "number" ? group.userData.baseY : 0;
      const seed = typeof group.userData.seed === "number" ? group.userData.seed : 0;
      const mainMesh = group.userData.mainMesh;
      const cardMesh2 = group.userData.cardMesh;
      group.position.y = baseY + Math.sin(gameTime * 2 + seed) * 0.25;
      if (mainMesh) {
        mainMesh.rotation.y += 0.015;
        mainMesh.rotation.x += 8e-3;
      }
      if (cardMesh2 && gameCamera2) {
        cardMesh2.lookAt(gameCamera2.position);
      }
      if (gameHoveredObject === group) {
        group.scale.lerp(new THREE.Vector3(1.4, 1.4, 1.4), 0.2);
      } else {
        group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    });
    gameAnimatedObjects2.forEach((obj) => {
      if (obj && typeof obj.update === "function") {
        try {
          obj.update(gameTime);
        } catch (e) {
        }
      }
    });
    for (let i = gameExplosionParticles.length - 1; i >= 0; i--) {
      const p = gameExplosionParticles[i];
      p.mesh.position.add(p.velocity);
      p.mesh.scale.multiplyScalar(0.94);
      p.life -= 0.03;
      if (p.life <= 0) {
        gameScene2.remove(p.mesh);
        if (p.mesh.geometry) p.mesh.geometry.dispose();
        if (p.mesh.material) p.mesh.material.dispose();
        gameExplosionParticles.splice(i, 1);
      }
    }
    if (gameControls2) gameControls2.update();
    gameRenderer.render(gameScene2, gameCamera2);
    gameFrameId = requestAnimationFrame(animateGameLoop);
  }
  function onGamePointerMove(event) {
    if (!gameActive2 || !gameCamera2 || !gameScene2) return;
    const rect = gameRenderer.domElement.getBoundingClientRect();
    gameMouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    gameMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    gameRaycaster.setFromCamera(gameMouse, gameCamera2);
    const intersects = gameRaycaster.intersectObjects(gameInteractiveObjects2, true);
    if (intersects.length > 0) {
      let topGroup = intersects[0].object;
      while (topGroup.parent && topGroup.parent !== gameScene2) {
        topGroup = topGroup.parent;
      }
      gameHoveredObject = topGroup;
      document.body.style.cursor = "pointer";
    } else {
      gameHoveredObject = null;
      document.body.style.cursor = "default";
    }
  }
  function onGameCanvasClick(event) {
    if (!gameActive2 || !gameCamera2 || !gameScene2) return;
    const rect = gameRenderer.domElement.getBoundingClientRect();
    gameMouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    gameMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    gameRaycaster.setFromCamera(gameMouse, gameCamera2);
    const intersects = gameRaycaster.intersectObjects(gameInteractiveObjects2, true);
    if (intersects.length > 0) {
      let topGroup = intersects[0].object;
      while (topGroup.parent && topGroup.parent !== gameScene2) {
        topGroup = topGroup.parent;
      }
      handle3DTaskClick(topGroup, intersects[0].point);
    }
  }
  function handle3DTaskClick(taskGroup, hitPoint) {
    const data = taskGroup.userData.taskData;
    if (!data) return;
    gameActiveTaskItem = data;
    if (gameControls2) {
      gameControls2.target.lerp(taskGroup.position, 0.4);
    }
    playSynthGameSound("select");
    createExplosionVFX(hitPoint || taskGroup.position, 11032055, 16);
    const bannerText = document.getElementById("game-active-quest-text");
    if (bannerText) {
      bannerText.innerHTML = `
      <div class="flex items-center justify-between gap-3 text-left">
        <div>
          <span class="text-[10px] text-purple-300 font-mono uppercase font-bold">[ ${escapeHtml(t(data.cat))} ]</span>
          <h3 class="text-sm font-bold text-white leading-tight">${escapeHtml(data.text)}</h3>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button onclick="completeTaskIn3D('${data.cat}', ${data.index})" class="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl transition cursor-pointer shadow-md flex items-center gap-1">
            <span>\u2713 Erledigen</span>
          </button>
          <button onclick="startFocusFor3DTask('${escapeHtml(data.text)}', '${data.cat}')" class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md flex items-center gap-1">
            <span>\u26A1 Fokus</span>
          </button>
        </div>
      </div>
    `;
    }
  }
  function completeTaskIn3D(cat, idx) {
    if (typeof toggleItem === "function") {
      toggleItem(cat, idx);
      playSynthGameSound("complete");
      addGameXP(120);
      if (typeof triggerSparkleEffect === "function") triggerSparkleEffect();
      setTimeout(() => {
        if (gameActive2) {
          shutdownGameEngine();
          initGameEngine();
        }
      }, 400);
    }
  }
  window.completeTaskIn3D = completeTaskIn3D;
  function startFocusFor3DTask(taskText, cat) {
    if (typeof startZenWithTask === "function") {
      startZenWithTask(taskText, cat);
    }
    if (typeof toggleGameMode2 === "function") {
      toggleGameMode2();
    }
  }
  window.startFocusFor3DTask = startFocusFor3DTask;
  function createExplosionVFX(pos, colorHex, count = 20) {
    for (let i = 0; i < count; i++) {
      const geo = new THREE.SphereGeometry(0.12, 6, 6);
      const mat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      gameScene2.add(mesh);
      gameExplosionParticles.push({
        mesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.2) * 0.4,
          (Math.random() - 0.5) * 0.4
        ),
        life: 1
      });
    }
  }
  function onGameResize() {
    if (!gameCamera2 || !gameRenderer) return;
    gameCamera2.aspect = window.innerWidth / window.innerHeight;
    gameCamera2.updateProjectionMatrix();
    gameRenderer.setSize(window.innerWidth, window.innerHeight);
  }
  function addGameXP(amount) {
    playerXp += amount;
    const needed = playerLevel * 250;
    if (playerXp >= needed) {
      playerXp -= needed;
      playerLevel++;
      playSynthGameSound("levelup");
      if (typeof showToast === "function") {
        showToast(`\u{1F389} Level Up! Du bist jetzt Level ${playerLevel}! \u{1F451}`);
      }
    }
    localStorage.setItem("flow_game_level", playerLevel);
    localStorage.setItem("flow_game_xp", playerXp);
    updateGameHud();
  }
  function updateGameHud() {
    const lvlEl = document.getElementById("game-player-level");
    const barEl = document.getElementById("game-player-xp-bar");
    if (lvlEl) lvlEl.innerText = `LVL ${playerLevel}`;
    if (barEl) {
      const pct = Math.min(100, Math.round(playerXp / (playerLevel * 250) * 100));
      barEl.style.width = `${pct}%`;
    }
  }
  function playSynthGameSound(type) {
    if (!gameSfxEnabled || typeof window.AudioContext === "undefined" && typeof window.webkitAudioContext === "undefined") return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      if (type === "enter") {
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === "warp") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "select") {
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === "complete") {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        osc.frequency.setValueAtTime(1046.5, now + 0.3);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === "levelup") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.5);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch (e) {
    }
  }
  function shutdownGameEngine() {
    gameActive2 = false;
    if (gameFrameId) {
      cancelAnimationFrame(gameFrameId);
      gameFrameId = null;
    }
    window.removeEventListener("resize", onGameResize);
    if (gameRenderer && gameRenderer.domElement) {
      gameRenderer.domElement.removeEventListener("pointermove", onGamePointerMove);
      gameRenderer.domElement.removeEventListener("pointerdown", onGameCanvasClick);
    }
    if (gameScene2) {
      gameScene2.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((mat) => {
            ["map", "normalMap", "roughnessMap", "metalnessMap", "emissiveMap", "specularMap", "alphaMap"].forEach((prop) => {
              if (mat[prop] && typeof mat[prop].dispose === "function") mat[prop].dispose();
            });
            mat.dispose();
          });
        }
      });
    }
    if (gameRenderer) {
      try {
        gameRenderer.dispose();
      } catch (e) {
      }
    }
    gameInteractiveObjects2 = [];
    gameParticles = [];
    gameExplosionParticles = [];
    gameAnimatedObjects2 = [];
    gameScene2 = null;
    gameCamera2 = null;
    gameRenderer = null;
    gameControls2 = null;
    gameHoveredObject = null;
    document.body.style.cursor = "default";
  }
  if (typeof window !== "undefined") {
    window.worldPresets = worldPresets;
    window.toggleGameMode = toggleGameMode2;
    window.switchGameWorld = switchGameWorld;
    window.addGameXP = addGameXP;
    window.updateGameHud = updateGameHud;
    window.shutdownGameEngine = shutdownGameEngine;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.worldPresets = worldPresets;
    globalThis.toggleGameMode = toggleGameMode2;
    globalThis.switchGameWorld = switchGameWorld;
    globalThis.addGameXP = addGameXP;
    globalThis.updateGameHud = updateGameHud;
    globalThis.shutdownGameEngine = shutdownGameEngine;
  }

  // gamification-2.js
  var heroMesh = null;
  var heroTargetPos = null;
  var heroSpeed = 0.35;
  var heroKeys = { forward: false, backward: false, left: false, right: false };
  function buildQuestAdventureWorld2() {
    if (gameCamera) {
      gameCamera.position.set(0, 14, 22);
      gameCamera.lookAt(0, 2, 4);
    }
    if (gameControls) {
      gameControls.target.set(0, 2, 4);
      gameControls.update();
    }
    const courtyardGeo = new THREE.CylinderGeometry(26, 26, 1.2, 32);
    const courtyardMat = new THREE.MeshStandardMaterial({
      color: 1841431,
      roughness: 0.85,
      metalness: 0.15
    });
    const courtyard = new THREE.Mesh(courtyardGeo, courtyardMat);
    courtyard.position.y = -0.6;
    courtyard.receiveShadow = true;
    gameScene.add(courtyard);
    const wallMat = new THREE.MeshStandardMaterial({ color: 2696484, roughness: 0.9 });
    for (let i = 0; i < 12; i++) {
      const angle = i / 12 * Math.PI * 2;
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 8, 12), wallMat);
      pillar.position.set(Math.cos(angle) * 24, 3.4, Math.sin(angle) * 24);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      gameScene.add(pillar);
      if (i % 2 === 0) {
        const torchLight = new THREE.PointLight(16096779, 1.8, 18);
        torchLight.position.set(Math.cos(angle) * 23, 6.5, Math.sin(angle) * 23);
        gameScene.add(torchLight);
        gameAnimatedObjects.push({
          update(time) {
            torchLight.intensity = 1.6 + Math.sin(time * 12 + i) * 0.4;
          }
        });
      }
    }
    const portalGroup = createQuestPortalMesh();
    portalGroup.position.set(0, 0, -16);
    gameScene.add(portalGroup);
    const obeliskGroup = createQuestObeliskMesh();
    obeliskGroup.position.set(0, 0, 0);
    gameScene.add(obeliskGroup);
    heroMesh = createHeroCharacterMesh();
    heroMesh.position.set(0, 0, 8);
    gameScene.add(heroMesh);
    heroTargetPos = heroMesh.position.clone();
    spawn3DTasksAsQuestArtifacts();
    initHeroControls();
    gameAnimatedObjects.push({
      update(time) {
        updateHeroMovement(time);
      }
    });
    if (typeof showToast === "function") {
      showToast("\u2694\uFE0F Willkommen in den Chronicles of Flow! Bewege deinen Helden mit WASD oder Pfeiltasten.");
    }
  }
  window.buildQuestAdventureWorld = buildQuestAdventureWorld2;
  function createHeroCharacterMesh() {
    const heroGroup = new THREE.Group();
    const bodyGeo = new THREE.CylinderGeometry(0.5, 0.4, 1.4, 12);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 6514417, roughness: 0.3, metalness: 0.7 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.1;
    body.castShadow = true;
    heroGroup.add(body);
    const headGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 16638023, metalness: 0.9, roughness: 0.1 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.1;
    head.castShadow = true;
    heroGroup.add(head);
    const crownGeo = new THREE.TorusGeometry(0.35, 0.06, 8, 24);
    const crownMat = new THREE.MeshStandardMaterial({
      color: 16498468,
      emissive: 14251782,
      emissiveIntensity: 0.8
    });
    const crown = new THREE.Mesh(crownGeo, crownMat);
    crown.rotation.x = Math.PI / 2;
    crown.position.y = 2.4;
    heroGroup.add(crown);
    const staffGroup = new THREE.Group();
    const staffShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 2.2, 8),
      new THREE.MeshStandardMaterial({ color: 7877903, roughness: 0.8 })
    );
    staffShaft.position.y = 1.1;
    staffGroup.add(staffShaft);
    const staffOrb = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.25, 0),
      new THREE.MeshStandardMaterial({
        color: 3718648,
        emissive: 165063,
        emissiveIntensity: 1.2
      })
    );
    staffOrb.position.y = 2.2;
    staffGroup.add(staffOrb);
    staffGroup.position.set(0.7, 0, 0.2);
    heroGroup.add(staffGroup);
    return heroGroup;
  }
  function initHeroControls() {
    window.addEventListener("keydown", onHeroKeyDown);
    window.addEventListener("keyup", onHeroKeyUp);
  }
  function onHeroKeyDown(e) {
    if (!gameActive || currentGameWorld !== "quest_adventure") return;
    const k = e.key.toLowerCase();
    if (k === "w" || k === "arrowup") heroKeys.forward = true;
    if (k === "s" || k === "arrowdown") heroKeys.backward = true;
    if (k === "a" || k === "arrowleft") heroKeys.left = true;
    if (k === "d" || k === "arrowright") heroKeys.right = true;
  }
  function onHeroKeyUp(e) {
    const k = e.key.toLowerCase();
    if (k === "w" || k === "arrowup") heroKeys.forward = false;
    if (k === "s" || k === "arrowdown") heroKeys.backward = false;
    if (k === "a" || k === "arrowleft") heroKeys.left = false;
    if (k === "d" || k === "arrowright") heroKeys.right = false;
  }
  function updateHeroMovement(time) {
    if (!heroMesh) return;
    const moveVector = new THREE.Vector3();
    if (heroKeys.forward) moveVector.z -= 1;
    if (heroKeys.backward) moveVector.z += 1;
    if (heroKeys.left) moveVector.x -= 1;
    if (heroKeys.right) moveVector.x += 1;
    if (moveVector.lengthSq() > 0) {
      moveVector.normalize().multiplyScalar(heroSpeed);
      heroMesh.position.add(moveVector);
      const angle = Math.atan2(moveVector.x, moveVector.z);
      heroMesh.rotation.y = angle;
      heroMesh.position.y = Math.abs(Math.sin(time * 12)) * 0.15;
      if (gameControls) {
        gameControls.target.lerp(heroMesh.position, 0.1);
      }
    }
    const dist = Math.sqrt(heroMesh.position.x * heroMesh.position.x + heroMesh.position.z * heroMesh.position.z);
    if (dist > 22) {
      heroMesh.position.x = heroMesh.position.x / dist * 22;
      heroMesh.position.z = heroMesh.position.z / dist * 22;
    }
  }
  function createQuestObeliskMesh() {
    const group = new THREE.Group();
    const obeliskMat = new THREE.MeshStandardMaterial({
      color: 4988309,
      emissive: 3018853,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2
    });
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 7, 6), obeliskMat);
    pillar.position.y = 3.5;
    pillar.castShadow = true;
    group.add(pillar);
    const rune = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.9, 0),
      new THREE.MeshStandardMaterial({ color: 11032055, emissive: 9647082, emissiveIntensity: 1.2 })
    );
    rune.position.y = 8;
    group.add(rune);
    gameAnimatedObjects.push({
      update(time) {
        rune.rotation.y += 0.02;
        rune.position.y = 8 + Math.sin(time * 3) * 0.3;
      }
    });
    return group;
  }
  function createQuestPortalMesh() {
    const group = new THREE.Group();
    const archMat = new THREE.MeshStandardMaterial({ color: 2696484, roughness: 0.8 });
    const arch = new THREE.Mesh(new THREE.TorusGeometry(4.5, 0.6, 12, 32, Math.PI), archMat);
    arch.position.y = 0;
    group.add(arch);
    const swirlGeo = new THREE.CircleGeometry(3.8, 32);
    const swirlMat = new THREE.MeshBasicMaterial({
      color: 3718648,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    const swirl = new THREE.Mesh(swirlGeo, swirlMat);
    swirl.position.y = 2.5;
    group.add(swirl);
    gameAnimatedObjects.push({
      update(time) {
        swirl.rotation.z -= 0.02;
        swirl.scale.set(1 + Math.sin(time * 4) * 0.05, 1 + Math.sin(time * 4) * 0.05, 1);
      }
    });
    return group;
  }
  function spawn3DTasksAsQuestArtifacts() {
    gameInteractiveObjects = [];
    const tasks = typeof getAllOpenTasksList === "function" ? getAllOpenTasksList() : [];
    if (tasks.length === 0) return;
    tasks.forEach((t3, i) => {
      const angle = i / tasks.length * Math.PI * 2;
      const r = 11 + i % 2 * 4;
      const group = new THREE.Group();
      group.position.set(Math.cos(angle) * r, 2.2 + Math.sin(i * 1.5) * 0.5, Math.sin(angle) * r);
      const relicGeo = new THREE.BoxGeometry(1.4, 0.4, 1);
      const relicMat = new THREE.MeshStandardMaterial({
        color: 16096779,
        emissive: 11817737,
        emissiveIntensity: 0.6,
        roughness: 0.3
      });
      const relicMesh = new THREE.Mesh(relicGeo, relicMat);
      group.add(relicMesh);
      const cardTex = typeof create3DTaskCardTexture === "function" ? create3DTaskCardTexture(t3.text, t3.cat) : null;
      if (cardTex) {
        const cardGeo = new THREE.PlaneGeometry(5.6, 2.8);
        const cardMat = new THREE.MeshBasicMaterial({
          map: cardTex,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false
        });
        const cardMesh2 = new THREE.Mesh(cardGeo, cardMat);
        cardMesh2.position.y = 2.4;
        group.add(cardMesh2);
      }
      group.userData = {
        taskData: t3,
        baseY: group.position.y,
        seed: i,
        mainMesh: relicMesh,
        cardMesh
      };
      gameScene.add(group);
      gameInteractiveObjects.push(group);
    });
  }
  function syncGame3DDock() {
    const timer3d = document.getElementById("game-hud-timer-display");
    if (timer3d && typeof timerSeconds !== "undefined") {
      const mins = Math.floor(Math.abs(timerSeconds) / 60);
      const secs = Math.abs(timerSeconds) % 60;
      timer3d.innerText = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
  }
  window.syncGame3DDock = syncGame3DDock;
  function game3DQuickTimerToggle() {
    if (typeof toggleTimer === "function") {
      toggleTimer();
      syncGame3DDock();
    }
  }
  window.game3DQuickTimerToggle = game3DQuickTimerToggle;
  function game3DOpenDockTool(panelName) {
    if (typeof toggleGameMode === "function") toggleGameMode();
    setTimeout(() => {
      if (panelName === "sport" && typeof openSportModal === "function") openSportModal();
      else if (panelName === "whatnow" && typeof openWhatNowModal === "function") openWhatNowModal();
      else if (typeof togglePanel === "function") togglePanel(panelName);
    }, 100);
  }
  window.game3DOpenDockTool = game3DOpenDockTool;

  // app-shopping.js
  var SHOPPING_DEPARTMENTS = {
    produce: {
      icon: "apple",
      color: "emerald",
      title: { en: "Produce (Fruits & Veggies)", de: "Obst & Gem\xFCse", fr: "Fruits & L\xE9gumes", it: "Frutta & Verdura", es: "Frutas & Verduras", el: "\u03A6\u03C1\u03BF\u03CD\u03C4\u03B1 & \u039B\u03B1\u03C7\u03B1\u03BD\u03B9\u03BA\u03AC" },
      keywords: [
        "apfel",
        "apple",
        "banan",
        "tomate",
        "salat",
        "gurke",
        "paprika",
        "kartoffel",
        "potato",
        "zwiebel",
        "onion",
        "knoblauch",
        "garlic",
        "beere",
        "berry",
        "erdbeer",
        "orange",
        "zitrone",
        "lemon",
        "limette",
        "avocado",
        "karotte",
        "carrot",
        "spinat",
        "spinach",
        "pilz",
        "mushroom",
        "brokkoli",
        "broccoli",
        "blumenkohl",
        "kohl",
        "lauch",
        "ingwer",
        "ginger",
        "k\xFCrbis",
        "pumpkin",
        "trauben",
        "grape",
        "birne",
        "pear",
        "mango",
        "ananas",
        "pineapple",
        "kr\xE4uter",
        "herbs",
        "petersilie",
        "basilikum",
        "basil",
        "rosmarin",
        "rosemary",
        "melone",
        "melon",
        "zucchini",
        "aubergine",
        "radieschen",
        "pfirsich",
        "peach",
        "pflaume",
        "plum",
        "kirsche",
        "cherry",
        "kiwi",
        "feige",
        "fig"
      ]
    },
    dairy: {
      icon: "milk",
      color: "sky",
      title: { en: "Dairy & Eggs", de: "K\xFChlregal, Milch & Eier", fr: "Produits Laitiers & \u0152ufs", it: "Latticini & Uova", es: "L\xE1cteos & Huevos", el: "\u0393\u03B1\u03BB\u03B1\u03BA\u03C4\u03BF\u03BA\u03BF\u03BC\u03B9\u03BA\u03AC & \u0391\u03C5\u03B3\u03AC" },
      keywords: [
        "milch",
        "milk",
        "lait",
        "leche",
        "latte",
        "\u03B3\u03AC\u03BB\u03B1",
        "hafermilch",
        "oat milk",
        "sojamilch",
        "mandelmilch",
        "k\xE4se",
        "cheese",
        "fromage",
        "formaggio",
        "queso",
        "\u03C4\u03C5\u03C1\u03AF",
        "butter",
        "beurre",
        "mantequilla",
        "burro",
        "\u03B2\u03BF\u03CD\u03C4\u03C5\u03C1\u03BF",
        "joghurt",
        "yogurt",
        "yaourt",
        "\u03B3\u03B9\u03B1\u03BF\u03CD\u03C1\u03C4\u03B9",
        "quark",
        "cottage",
        "eier",
        "egg",
        "oeuf",
        "uova",
        "huevo",
        "\u03B1\u03C5\u03B3\u03AC",
        "sahne",
        "cream",
        "cr\xE8me",
        "panna",
        "nata",
        "sour cream",
        "schmand",
        "frischk\xE4se",
        "cream cheese",
        "mozzarella",
        "parmesan",
        "feta",
        "gouda",
        "cheddar",
        "tofu"
      ]
    },
    bakery: {
      icon: "croissant",
      color: "amber",
      title: { en: "Bakery & Grains", de: "B\xE4ckerei & Getreide", fr: "Boulangerie & C\xE9r\xE9ales", it: "Panetteria & Cereali", es: "Panader\xEDa & Cereales", el: "\u0391\u03C1\u03C4\u03BF\u03C0\u03BF\u03B9\u03B5\u03AF\u03BF & \u0394\u03B7\u03BC\u03B7\u03C4\u03C1\u03B9\u03B1\u03BA\u03AC" },
      keywords: [
        "brot",
        "bread",
        "pain",
        "pane",
        "pan",
        "\u03C8\u03C9\u03BC\u03AF",
        "br\xF6tchen",
        "roll",
        "bun",
        "baguette",
        "toast",
        "croissant",
        "haferflocken",
        "oats",
        "avoine",
        "avena",
        "m\xFCsli",
        "granola",
        "pasta",
        "nudeln",
        "spaghetti",
        "penne",
        "reis",
        "rice",
        "riz",
        "riso",
        "arroz",
        "\u03C1\u03CD\u03B6\u03B9",
        "mehl",
        "flour",
        "farine",
        "harina",
        "farina",
        "\u03B1\u03BB\u03B5\u03CD\u03C1\u03B9",
        "kuchen",
        "cake",
        "wrap",
        "tortilla",
        "quinoa",
        "couscous",
        "bulgur"
      ]
    },
    meat: {
      icon: "beef",
      color: "rose",
      title: { en: "Meat & Seafood", de: "Fleisch & Fisch", fr: "Viande & Poisson", it: "Carne & Pesce", es: "Carne & Pescado", el: "\u039A\u03C1\u03AD\u03B1\u03C2 & \u03A8\u03AC\u03C1\u03B9\u03B1" },
      keywords: [
        "fleisch",
        "meat",
        "viande",
        "carne",
        "\u03BA\u03C1\u03AD\u03B1\u03C2",
        "h\xE4hnchen",
        "chicken",
        "poulet",
        "pollo",
        "\u03BA\u03BF\u03C4\u03CC\u03C0\u03BF\u03C5\u03BB\u03BF",
        "rind",
        "beef",
        "boeuf",
        "manzo",
        "schwein",
        "pork",
        "porc",
        "cerdo",
        "maiale",
        "hackfleisch",
        "mince",
        "viande hach\xE9e",
        "macinato",
        "wurst",
        "sausage",
        "saucisse",
        "salchicha",
        "schinken",
        "ham",
        "jambon",
        "jam\xF3n",
        "prosciutto",
        "fisch",
        "fish",
        "poisson",
        "pesce",
        "pescado",
        "\u03C8\u03AC\u03C1\u03B9",
        "lachs",
        "salmon",
        "saumon",
        "salmone",
        "salm\xF3n",
        "thunfisch",
        "tuna",
        "garnelen",
        "shrimp",
        "crevette",
        "gamberi"
      ]
    },
    pantry: {
      icon: "soup",
      color: "orange",
      title: { en: "Pantry & Spices", de: "Vorrat & Gew\xFCrze", fr: "\xC9picerie & \xC9pices", it: "Dispensa & Spezie", es: "Despensa & Especias", el: "\u03A4\u03C1\u03CC\u03C6\u03B9\u03BC\u03B1 & \u039C\u03C0\u03B1\u03C7\u03B1\u03C1\u03B9\u03BA\u03AC" },
      keywords: [
        "\xF6l",
        "oil",
        "huile",
        "olio",
        "aceite",
        "\u03BB\u03AC\u03B4\u03B9",
        "oliven\xF6l",
        "olive oil",
        "essig",
        "vinegar",
        "vinaigre",
        "aceto",
        "vinagre",
        "\u03BE\u03CD\u03B4\u03B9",
        "salz",
        "salt",
        "sel",
        "sale",
        "\u03B1\u03BB\u03AC\u03C4\u03B9",
        "pfeffer",
        "pepper",
        "poivre",
        "pepe",
        "pimienta",
        "\u03C0\u03B9\u03C0\u03AD\u03C1\u03B9",
        "zucker",
        "sugar",
        "sucre",
        "zucchero",
        "az\xFAcar",
        "\u03B6\u03AC\u03C7\u03B1\u03C1\u03B7",
        "honig",
        "honey",
        "miel",
        "miele",
        "\u03BC\u03AD\u03BB\u03B9",
        "senf",
        "mustard",
        "moutarde",
        "senape",
        "mostaza",
        "ketchup",
        "mayo",
        "mayonnaise",
        "tomatenmark",
        "tomato paste",
        "dose",
        "can",
        "kichererbsen",
        "chickpeas",
        "linsen",
        "lentils",
        "bohnen",
        "beans",
        "pesto",
        "gew\xFCrz",
        "spice",
        "sauce",
        "so\xDFe",
        "passierte tomaten",
        "br\xFChe",
        "broth",
        "bouillon",
        "n\xFCsse",
        "nuts",
        "mandeln",
        "almonds",
        "schokolade",
        "chocolate",
        "chips",
        "snack"
      ]
    },
    drinks: {
      icon: "cup-soda",
      color: "cyan",
      title: { en: "Beverages", de: "Getr\xE4nke", fr: "Boissons", it: "Bevande", es: "Bebidas", el: "\u03A0\u03BF\u03C4\u03AC & \u03A1\u03BF\u03C6\u03AE\u03BC\u03B1\u03C4\u03B1" },
      keywords: [
        "wasser",
        "water",
        "eau",
        "acqua",
        "agua",
        "\u03BD\u03B5\u03C1\u03CC",
        "mineralwasser",
        "sprudel",
        "saft",
        "juice",
        "jus",
        "succo",
        "zumo",
        "\u03C7\u03C5\u03BC\u03CC\u03C2",
        "kaffee",
        "coffee",
        "caf\xE9",
        "caff\xE8",
        "\u03BA\u03B1\u03C6\u03AD\u03C2",
        "espresso",
        "tee",
        "tea",
        "th\xE9",
        "t\xE9",
        "\u03C4\u03C3\u03AC\u03B9",
        "cola",
        "limonade",
        "soda",
        "bier",
        "beer",
        "bi\xE8re",
        "birra",
        "cerveza",
        "\u03BC\u03C0\u03CD\u03C1\u03B1",
        "wein",
        "wine",
        "vin",
        "vino",
        "vino",
        "\u03BA\u03C1\u03B1\u03C3\u03AF"
      ]
    },
    household: {
      icon: "sparkle",
      color: "purple",
      title: { en: "Household & Care", de: "Drogerie & Haushalt", fr: "Maison & Soins", it: "Casa & Cura", es: "Hogar & Cuidado", el: "\u03A3\u03C0\u03AF\u03C4\u03B9 & \u03A6\u03C1\u03BF\u03BD\u03C4\u03AF\u03B4\u03B1" },
      keywords: [
        "toilettenpapier",
        "toilet paper",
        "papier toilette",
        "carta igienica",
        "papel higi\xE9nico",
        "\u03C7\u03B1\u03C1\u03C4\u03AF \u03C5\u03B3\u03B5\u03AF\u03B1\u03C2",
        "k\xFCchenrolle",
        "paper towels",
        "seife",
        "soap",
        "savon",
        "sapone",
        "jab\xF3n",
        "\u03C3\u03B1\u03C0\u03BF\u03CD\u03BD\u03B9",
        "shampoo",
        "duschgel",
        "zahnpasta",
        "toothpaste",
        "dentifrice",
        "dentifricio",
        "pasta de dientes",
        "\u03BF\u03B4\u03BF\u03BD\u03C4\u03CC\u03BA\u03C1\u03B5\u03BC\u03B1",
        "sp\xFClmittel",
        "dish soap",
        "liquide vaisselle",
        "detersivo piatti",
        "lavavajillas",
        "waschmittel",
        "detergent",
        "lessive",
        "detersivo",
        "m\xFCllbeutel",
        "trash bags",
        "sacs poubelle",
        "sacchetti spazzatura",
        "bolsas de basura",
        "schwamm",
        "sponge",
        "\xE9ponge",
        "spugna",
        "esponja",
        "alufolie",
        "backpapier",
        "baking paper"
      ]
    }
  };
  function getDepartmentForItem(name) {
    if (!name) return "other";
    const clean = name.toLowerCase().trim();
    for (const deptKey in SHOPPING_DEPARTMENTS) {
      const dept = SHOPPING_DEPARTMENTS[deptKey];
      if (dept.keywords.some((kw) => clean.includes(kw))) {
        return deptKey;
      }
    }
    return "other";
  }
  window.SHOPPING_DEPARTMENTS = SHOPPING_DEPARTMENTS;
  window.getDepartmentForItem = getDepartmentForItem;
  function handleAddShoppingItem(explicitName = null) {
    let rawInput = explicitName;
    if (!rawInput) {
      const inputEl = document.getElementById("shop-add-name") || document.getElementById("supermarket-add-input");
      rawInput = inputEl ? inputEl.value.trim() : "";
      if (inputEl) inputEl.value = "";
    }
    if (!rawInput) {
      showToast(tr({
        de: "Bitte Artikelname eingeben!",
        en: "Please enter an item name!",
        fr: "Veuillez entrer un article !",
        it: "Inserisci il nome dell'articolo!",
        es: "\xA1Introduce un art\xEDculo!",
        el: "\u03A0\u03B1\u03C1\u03B1\u03BA\u03B1\u03BB\u03CE \u03B5\u03B9\u03C3\u03AC\u03B3\u03B5\u03C4\u03B5 \u03AD\u03BD\u03B1 \u03C0\u03C1\u03BF\u03CA\u03CC\u03BD!"
      }));
      return;
    }
    saveHistory();
    if (!Array.isArray(state.shoppingList)) state.shoppingList = [];
    const itemsToAdd = rawInput.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    itemsToAdd.forEach((text) => {
      let name = text;
      let qty = 1;
      let unit = "";
      const qtyMatch = text.match(/^(\d+)\s*(x|kg|g|l|ml|bund|stk|packung|dose|gläser|glas)?\s+(.+)$/i);
      if (qtyMatch) {
        qty = parseInt(qtyMatch[1], 10) || 1;
        unit = qtyMatch[2] || "";
        name = qtyMatch[3].trim();
      }
      const dept = getDepartmentForItem(name);
      const existingIndex = state.shoppingList.findIndex((item2) => item2.name.toLowerCase() === name.toLowerCase());
      if (existingIndex !== -1) {
        state.shoppingList[existingIndex].qty = (state.shoppingList[existingIndex].qty || 1) + qty;
        if (unit) state.shoppingList[existingIndex].unit = unit;
      } else {
        state.shoppingList.push({
          id: "shop-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
          name,
          qty,
          unit,
          dept,
          addedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    });
    saveState();
    renderApp();
    renderSupermarketModal();
    if (itemsToAdd.length === 1) {
      showToast(tr({
        de: `"${itemsToAdd[0]}" hinzugef\xFCgt! \u{1F6D2}`,
        en: `Added "${itemsToAdd[0]}"! \u{1F6D2}`,
        fr: `"${itemsToAdd[0]}" ajout\xE9 ! \u{1F6D2}`,
        it: `"${itemsToAdd[0]}" aggiunto! \u{1F6D2}`,
        es: `\xA1"${itemsToAdd[0]}" a\xF1adido! \u{1F6D2}`,
        el: `\u03A4\u03BF "${itemsToAdd[0]}" \u03C0\u03C1\u03BF\u03C3\u03C4\u03AD\u03B8\u03B7\u03BA\u03B5! \u{1F6D2}`
      }));
    } else {
      showToast(tr({
        de: `${itemsToAdd.length} Artikel hinzugef\xFCgt! \u{1F6D2}`,
        en: `${itemsToAdd.length} items added! \u{1F6D2}`,
        fr: `${itemsToAdd.length} articles ajout\xE9s ! \u{1F6D2}`,
        it: `${itemsToAdd.length} articoli aggiunti ! \u{1F6D2}`,
        es: `\xA1${itemsToAdd.length} art\xEDculos a\xF1adidos! \u{1F6D2}`,
        el: `${itemsToAdd.length} \u03C0\u03C1\u03BF\u03CA\u03CC\u03BD\u03C4\u03B1 \u03C0\u03C1\u03BF\u03C3\u03C4\u03AD\u03B8\u03B7\u03BA\u03B1\u03BD! \u{1F6D2}`
      }));
    }
  }
  function generateSmartShoppingTips(container) {
    const tipEl = document.getElementById("shopping-smart-tip-text");
    if (!tipEl) return;
    const tips = [
      "Tipp: Kaufe frisches Obst & Gem\xFCse zuerst und K\xFChlwaren ganz zum Schluss!",
      "Tipp: Nutze den Supermarkt-Modus f\xFCr gro\xDFe Tasten zum schnellen Abhaken.",
      "Tipp: Sortiere deine Liste nach Regal-G\xE4ngen, um Zeit zu sparen."
    ];
    tipEl.innerText = tips[Math.floor(Math.random() * tips.length)];
  }
  window.generateSmartShoppingTips = generateSmartShoppingTips;
  function openSupermarketModal() {
    const modal = document.getElementById("supermarket-modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    renderSupermarketModal();
    if (typeof playProceduralSound === "function") playProceduralSound(0);
  }
  function closeSupermarketModal() {
    const modal = document.getElementById("supermarket-modal");
    if (modal) modal.classList.add("hidden");
  }
  function renderSupermarketModal() {
    const container = document.getElementById("supermarket-content");
    const progressEl = document.getElementById("supermarket-progress-bar");
    const countEl = document.getElementById("supermarket-progress-text");
    if (!container) return;
    const list = state.shoppingList || [];
    const hist = state.shoppingHistory || [];
    const total = list.length + hist.length;
    const boughtCount = hist.length;
    if (countEl) {
      countEl.innerText = `${list.length} ${tr({ en: "items to buy", de: "Artikel im Plan", fr: "articles \xE0 acheter", it: "da comprare", es: "por comprar", el: "\u03B3\u03B9\u03B1 \u03B1\u03B3\u03BF\u03C1\u03AC" })} (${boughtCount} ${tr({ en: "in cart", de: "im Wagen", fr: "dans le panier", it: "nel carrello", es: "en el carrito", el: "\u03C3\u03C4\u03BF \u03BA\u03B1\u03BB\u03AC\u03B8\u03B9" })})`;
    }
    if (progressEl && total > 0) {
      const pct = Math.round(boughtCount / total * 100);
      progressEl.style.width = `${pct}%`;
    }
    if (list.length === 0 && hist.length === 0) {
      container.innerHTML = `
      <div class="text-center py-10 space-y-3">
        <div class="text-4xl">\u{1F6D2}</div>
        <h4 class="font-bold text-base text-white">${tr({ en: "Your cart is clear!", de: "Dein Einkaufswagen ist leer!", fr: "Ton panier est vide !", it: "Il tuo carrello \xE8 vuoto!", es: "\xA1Tu carrito est\xE1 vac\xEDo!", el: "\u03A4\u03BF \u03BA\u03B1\u03BB\u03AC\u03B8\u03B9 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03AC\u03B4\u03B5\u03B9\u03BF!" })}</h4>
        <p class="text-xs text-gray-400">${tr({ en: "Add groceries above to start your organized shopping trip.", de: "F\xFCge oben Artikel hinzu, um deinen geordneten Einkauf zu starten.", fr: "Ajoute des articles ci-dessus pour pr\xE9parer tes courses.", it: "Aggiungi articoli qui sopra per iniziare la spesa.", es: "A\xF1ade art\xEDculos arriba para organizar tu compra.", el: "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AD\u03C3\u03C4\u03B5 \u03C0\u03C1\u03BF\u03CA\u03CC\u03BD\u03C4\u03B1 \u03C0\u03B1\u03C1\u03B1\u03C0\u03AC\u03BD\u03C9 \u03B3\u03B9\u03B1 \u03BD\u03B1 \u03BE\u03B5\u03BA\u03B9\u03BD\u03AE\u03C3\u03B5\u03C4\u03B5." })}</p>
      </div>
    `;
      return;
    }
    const grouped = {};
    list.forEach((item2, originalIdx) => {
      const dept = item2.dept || getDepartmentForItem(item2.name);
      if (!grouped[dept]) grouped[dept] = [];
      grouped[dept].push({ item: item2, originalIdx });
    });
    let html = '<div class="space-y-4">';
    for (const deptKey in grouped) {
      const deptInfo = SHOPPING_DEPARTMENTS[deptKey] || { icon: "box", color: "gray", title: { en: "Other" } };
      const deptTitle = deptInfo.title[currentLang] || deptInfo.title.en || deptKey;
      html += `
      <div class="p-3 bg-white/[0.02] border border-white/10 rounded-2xl space-y-2">
        <div class="flex items-center gap-2 font-bold text-xs text-${deptInfo.color}-300 pb-1 border-b border-white/5">
          <i data-lucide="${deptInfo.icon}" class="w-4 h-4 text-${deptInfo.color}-400"></i>
          <span>${deptTitle}</span>
          <span class="text-[10px] text-gray-500 font-mono">(${grouped[deptKey].length})</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
    `;
      grouped[deptKey].forEach(({ item: item2, originalIdx }) => {
        const qtyLabel = item2.qty && item2.qty > 1 ? `<span class="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs">${item2.qty}${item2.unit ? " " + item2.unit : "x"}</span>` : "";
        html += `
        <div class="flex items-center justify-between p-3 bg-black/40 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/40 rounded-xl transition cursor-pointer group" onclick="handleToggleShoppingItem(${originalIdx})">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-6 h-6 rounded-lg border-2 border-white/30 group-hover:border-emerald-400 flex items-center justify-center transition">
              <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400 opacity-0 group-hover:opacity-100 transition"></i>
            </div>
            <span class="font-bold text-sm text-white truncate">${escapeHtml(item2.name)}</span>
          </div>
          <div class="flex items-center gap-2" onclick="event.stopPropagation()">
            ${qtyLabel}
            <button onclick="handleDeleteShoppingItem(${originalIdx})" class="p-1.5 text-gray-500 hover:text-red-400 rounded-lg transition cursor-pointer">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `;
      });
      html += `</div></div>`;
    }
    if (hist.length > 0) {
      html += `
      <div class="pt-3 border-t border-white/10">
        <div class="flex items-center justify-between text-xs text-gray-400 font-bold mb-2">
          <span class="flex items-center gap-1.5 text-emerald-400">
            <i data-lucide="check-circle-2" class="w-4 h-4"></i>
            <span>${tr({ en: "In Cart (Bought)", de: "Bereits im Einkaufswagen", fr: "Dans le panier", it: "Nel carrello", es: "En el carrito", el: "\u03A3\u03C4\u03BF \u03BA\u03B1\u03BB\u03AC\u03B8\u03B9" })} (${hist.length})</span>
          </span>
          <button onclick="clearShoppingHistory()" class="text-[10px] text-gray-500 hover:text-red-400 cursor-pointer">${tr({ en: "Clear", de: "Leeren", fr: "Vider", it: "Svuota", es: "Vaciar", el: "\u039A\u03B1\u03B8\u03B1\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2" })}</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 opacity-60">
    `;
      hist.slice().reverse().forEach((hItem, hIdx) => {
        const realIdx = hist.length - 1 - hIdx;
        html += `
        <div class="flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-gray-400">
          <span class="line-through truncate">${hItem.name}</span>
          <button onclick="restoreShoppingHistoryItem(${realIdx})" class="px-2 py-0.5 bg-white/5 hover:bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-semibold cursor-pointer">
            \u21A9 ${tr({ en: "Undo", de: "Zur\xFCck", fr: "Annuler", it: "Ripristina", es: "Deshacer", el: "\u0391\u03BD\u03B1\u03AF\u03C1\u03B5\u03C3\u03B7" })}
          </button>
        </div>
      `;
      });
      html += `</div></div>`;
    }
    html += "</div>";
    container.innerHTML = html;
    renderLucideIcons();
  }
  if (typeof window !== "undefined") {
    window.SHOPPING_DEPARTMENTS = SHOPPING_DEPARTMENTS;
    window.getDepartmentForItem = getDepartmentForItem;
    window.handleAddShoppingItem = handleAddShoppingItem;
    window.openSupermarketModal = openSupermarketModal;
    window.closeSupermarketModal = closeSupermarketModal;
    window.renderSupermarketModal = renderSupermarketModal;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.SHOPPING_DEPARTMENTS = SHOPPING_DEPARTMENTS;
    globalThis.getDepartmentForItem = getDepartmentForItem;
    globalThis.handleAddShoppingItem = handleAddShoppingItem;
    globalThis.openSupermarketModal = openSupermarketModal;
    globalThis.closeSupermarketModal = closeSupermarketModal;
    globalThis.renderSupermarketModal = renderSupermarketModal;
  }

  // app-alarm.js
  var alarmState = { alarms: [], reminders: [] };
  function initAlarmReminder() {
    try {
      const defaultData = {
        alarms: [{ id: "1", time: "08:00", label: "Fokus-Start", active: true }],
        reminders: [{ id: "101", text: "Wasser trinken \u{1F4A7}", time: Date.now() + 6e5, completed: false }]
      };
      if (typeof AppStorage !== "undefined") {
        alarmState = AppStorage.get("flow_alarms_reminders", defaultData);
      } else {
        const s = localStorage.getItem("flow_alarms_reminders");
        alarmState = s ? JSON.parse(s) : defaultData;
      }
    } catch (e) {
      console.warn("[Alarm] Fehler beim Laden der Alarme:", e);
    }
    updateAlarmBadge();
  }
  function saveAlarmState() {
    try {
      if (typeof AppStorage !== "undefined") {
        AppStorage.set("flow_alarms_reminders", alarmState);
      } else {
        localStorage.setItem("flow_alarms_reminders", JSON.stringify(alarmState));
      }
      updateAlarmBadge();
    } catch (e) {
      console.warn("[Alarm] Fehler beim Speichern der Alarme:", e);
    }
  }
  function updateAlarmBadge() {
    const b = document.getElementById("alarm-active-badge");
    if (!b) return;
    const active = (alarmState.alarms || []).some((a) => a.active) || (alarmState.reminders || []).some((r) => !r.completed);
    b.classList.toggle("hidden", !active);
  }
  function requestAlarmNotificationPermission() {
    if ("Notification" in window) {
      Notification.requestPermission().then(() => {
        renderAlarmPanel2();
      });
    }
  }
  window.requestAlarmNotificationPermission = requestAlarmNotificationPermission;
  function sendBrowserNotification(title, body) {
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then((reg) => {
            reg.showNotification(title, {
              body,
              icon: "icon-192.png",
              badge: "icon-192.png",
              vibrate: [200, 100, 200]
            });
          });
        } else {
          new Notification(title, { body, icon: "icon-192.png" });
        }
      } catch (e) {
        console.warn("[Alarm] Notification dispatch warning:", e);
      }
    }
  }
  var currentAlarmTab = "alarms";
  function switchAlarmTab(tab) {
    currentAlarmTab = tab;
    renderAlarmPanel2();
  }
  window.switchAlarmTab = switchAlarmTab;
  function openAlarmModal(tab = "alarms") {
    currentAlarmTab = tab;
    if (typeof togglePanel === "function") {
      togglePanel("alarm");
    }
    renderAlarmPanel2();
  }
  window.openAlarmModal = openAlarmModal;
  function renderAlarmPanel2() {
    const panel = document.getElementById("panel-alarm");
    if (!panel) return;
    panel.style.width = "380px";
    panel.style.maxWidth = "95vw";
    const nowStr = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const safeEscape = typeof escapeHtml === "function" ? escapeHtml : (str) => String(str || "");
    const hasNotif = "Notification" in window;
    const notifPerm = hasNotif ? Notification.permission : "unsupported";
    const alarmCount = (alarmState.alarms || []).filter((a) => a.active).length;
    const reminderCount = (alarmState.reminders || []).filter((r) => !r.completed).length;
    const tabAlarmsText = typeof tr === "function" ? tr({
      en: "Alarms",
      de: "Wecker",
      fr: "R\xE9veils",
      it: "Sveglie",
      es: "Alarmas",
      el: "\u039E\u03C5\u03C0\u03BD\u03B7\u03C4\u03AE\u03C1\u03B9\u03B1"
    }) : "Wecker";
    const tabRemindersText = typeof tr === "function" ? tr({
      en: "Reminders",
      de: "Reminder",
      fr: "Rappels",
      it: "Promemoria",
      es: "Recordatorios",
      el: "\u03A5\u03C0\u03B5\u03BD\u03B8\u03C5\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2"
    }) : "Reminder";
    panel.innerHTML = `
    <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
      <h4 class="font-bold text-sm font-display text-white flex items-center gap-2">
        <i data-lucide="${currentAlarmTab === "alarms" ? "alarm-clock" : "bell-ring"}" class="w-4 h-4 text-cyan-400"></i>
        <span>${tabAlarmsText} & ${tabRemindersText}</span>
      </h4>
      <button onclick="togglePanel('alarm')" class="text-gray-400 hover:text-white text-xs font-bold p-1 cursor-pointer">\u2715</button>
    </div>

    <!-- Segmented Tab Switcher (Wecker vs Reminder) -->
    <div class="grid grid-cols-2 gap-1.5 p-1 bg-black/60 border border-white/10 rounded-2xl text-xs font-bold mt-1">
      <button onclick="switchAlarmTab('alarms')" class="py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${currentAlarmTab === "alarms" ? "bg-cyan-600 text-white shadow-md" : "text-gray-400 hover:text-white"}">
        <i data-lucide="alarm-clock" class="w-3.5 h-3.5 ${currentAlarmTab === "alarms" ? "text-white" : "text-cyan-400"}"></i>
        <span>\u23F0 ${tabAlarmsText}</span>
        ${alarmCount > 0 ? `<span class="px-1.5 py-0.2 rounded-full text-[9px] bg-white/20 font-mono">${alarmCount}</span>` : ""}
      </button>
      <button onclick="switchAlarmTab('reminders')" class="py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${currentAlarmTab === "reminders" ? "bg-amber-600 text-white shadow-md" : "text-gray-400 hover:text-white"}">
        <i data-lucide="bell" class="w-3.5 h-3.5 ${currentAlarmTab === "reminders" ? "text-white" : "text-amber-400"}"></i>
        <span>\u{1F514} ${tabRemindersText}</span>
        ${reminderCount > 0 ? `<span class="px-1.5 py-0.2 rounded-full text-[9px] bg-white/20 font-mono">${reminderCount}</span>` : ""}
      </button>
    </div>

    <!-- Tab 1: WECKER (Feste Uhrzeiten) -->
    <div id="alarm-subpane-alarms" class="${currentAlarmTab === "alarms" ? "block" : "hidden"} space-y-3 pt-2">
      <!-- Ehrlicher Hinweis zur Browser-Funktionsweise & Benachrichtigungen -->
      <div class="p-2 bg-cyan-950/20 border border-cyan-500/20 rounded-xl text-[10px] text-cyan-200/90 flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-1 font-semibold">
            <i data-lucide="info" class="w-3 h-3 text-cyan-400 shrink-0"></i>
            <span>Aktiv bei ge\xF6ffnetem Tab</span>
          </span>
          ${notifPerm === "granted" ? `
            <span class="text-emerald-400 font-mono text-[9px] font-bold">\u{1F514} Erlaubt</span>
          ` : hasNotif ? `
            <button onclick="requestAlarmNotificationPermission()" class="px-2 py-0.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 rounded text-[9px] font-bold cursor-pointer transition">Erlauben</button>
          ` : ""}
        </div>
        <div class="text-[9px] text-gray-400 leading-tight">
          Spielt einen akustischen Weckton zur gew\xFCnschten Uhrzeit.
        </div>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-[10px] font-bold uppercase tracking-wider text-cyan-400">\u23F0 Neuer Wecker</span>
        <span class="text-[9px] text-gray-400 font-mono">Uhrzeit: <b class="text-white">${nowStr}</b></span>
      </div>
      <div class="flex gap-2 bg-black/40 p-2 rounded-2xl border border-white/5">
        <input type="time" id="new-alarm-time" value="09:00" class="p-2 bg-[#12121c] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-cyan-500 font-semibold cursor-pointer" />
        <input type="text" id="new-alarm-label" placeholder="Bezeichnung (z.B. Fokus)..." class="flex-1 p-2 bg-[#12121c] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-cyan-500 font-semibold placeholder:text-gray-500" />
        <button onclick="handleAddAlarm()" class="px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center shadow-sm">
          <i data-lucide="plus" class="w-4 h-4"></i>
        </button>
      </div>

      <div class="space-y-1.5 pt-1 max-h-[260px] overflow-y-auto pr-1">
        ${!alarmState.alarms || alarmState.alarms.length === 0 ? `
          <div class="text-center py-6 text-gray-500 text-xs font-medium">Keine Wecker gestellt</div>
        ` : (alarmState.alarms || []).map((a) => `
          <div class="flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-cyan-500/30 transition">
            <div class="flex items-center gap-2.5">
              <input type="checkbox" ${a.active ? "checked" : ""} onchange="handleToggleAlarm('${a.id}')" class="w-4 h-4 accent-cyan-500 cursor-pointer rounded" />
              <div>
                <div class="text-xs font-bold text-white font-mono leading-none mb-0.5">${safeEscape(a.time)}</div>
                <div class="text-[10px] text-gray-400 leading-none">${safeEscape(a.label || "Wecker")}</div>
              </div>
            </div>
            <button onclick="handleDeleteAlarm('${a.id}')" class="text-gray-500 hover:text-rose-400 p-1 transition cursor-pointer" title="L\xF6schen">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Tab 2: REMINDER (Timer / Countdown) -->
    <div id="alarm-subpane-reminders" class="${currentAlarmTab === "reminders" ? "block" : "hidden"} space-y-3 pt-2">
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400">\u{1F514} Neue Erinnerung</span>
        <span class="text-[9px] text-gray-400">Countdown-Timer</span>
      </div>
      <div class="flex gap-2 bg-black/40 p-2 rounded-2xl border border-white/5">
        <input type="text" id="new-reminder-text" placeholder="Erinnerung (z.B. Wasser trinken)..." class="flex-1 p-2 bg-[#12121c] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-amber-500 font-semibold placeholder:text-gray-500" />
        <select id="new-reminder-mins" class="p-2 bg-[#12121c] border border-white/10 rounded-xl text-xs text-amber-300 font-bold outline-none cursor-pointer">
          <option value="5">in 5m</option>
          <option value="10" selected>in 10m</option>
          <option value="15">in 15m</option>
          <option value="20">in 20m</option>
          <option value="30">in 30m</option>
          <option value="45">in 45m</option>
          <option value="60">in 60m</option>
        </select>
        <button onclick="handleAddReminder()" class="px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center shadow-sm">
          <i data-lucide="plus" class="w-4 h-4"></i>
        </button>
      </div>

      <div class="space-y-1.5 pt-1 max-h-[260px] overflow-y-auto pr-1">
        ${!alarmState.reminders || alarmState.reminders.length === 0 ? `
          <div class="text-center py-6 text-gray-500 text-xs font-medium">Keine Erinnerungen aktiv</div>
        ` : (alarmState.reminders || []).map((r) => {
      const leftMin = Math.max(0, Math.round((r.time - Date.now()) / 6e4));
      return `
            <div class="flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/5 rounded-xl ${r.completed ? "opacity-40 line-through" : ""}">
              <div class="flex items-center gap-2.5 min-w-0">
                <input type="checkbox" ${r.completed ? "checked" : ""} onchange="handleToggleReminder('${r.id}')" class="w-4 h-4 accent-amber-500 cursor-pointer rounded" />
                <span class="text-xs font-semibold text-gray-200 truncate">${safeEscape(r.text)}</span>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-[9px] font-mono text-amber-400 font-bold">${r.completed ? "Erledigt" : `${leftMin}m`}</span>
                <button onclick="handleDeleteReminder('${r.id}')" class="text-gray-500 hover:text-rose-400 p-1 transition cursor-pointer" title="L\xF6schen">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>
          `;
    }).join("")}
      </div>
    </div>
  `;
    renderLucideIcons();
  }
  var lastTriggeredMinuteKey = "";
  function checkAlarmsLoop() {
    const now = /* @__PURE__ */ new Date();
    const hm = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
    const minuteKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${hm}`;
    if (minuteKey !== lastTriggeredMinuteKey) {
      (alarmState.alarms || []).forEach((a) => {
        if (a.active && a.time === hm) {
          lastTriggeredMinuteKey = minuteKey;
          triggerAlarmModal(a.label, a.time);
          sendBrowserNotification(`\u23F0 Wecker: ${a.label || "Wecker"} (${a.time})`, "Dein Wecker ist jetzt f\xE4llig!");
        }
      });
    }
    const nowMs = Date.now();
    (alarmState.reminders || []).forEach((r) => {
      if (!r.completed && r.time <= nowMs) {
        r.completed = true;
        saveAlarmState();
        renderAlarmPanel2();
        const safeEscape = typeof escapeHtml === "function" ? escapeHtml : (str) => String(str || "");
        if (typeof showToast === "function") showToast(`\u{1F514} Erinnerung: "${safeEscape(r.text)}"`);
        if (typeof playProceduralSound === "function") playProceduralSound(1);
        sendBrowserNotification("\u{1F514} Flow Reminder", r.text);
      }
    });
  }
  function triggerAlarmModal(title, time) {
    if (typeof playProceduralSound === "function") {
      playProceduralSound(0);
      setTimeout(() => playProceduralSound(2), 500);
    }
    const existing = document.getElementById("alarm-modal");
    if (existing) existing.remove();
    const safeEscape = typeof escapeHtml === "function" ? escapeHtml : (str) => String(str || "");
    const d = document.createElement("div");
    d.id = "alarm-modal";
    d.className = "fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4";
    d.innerHTML = `
    <div class="w-full max-w-sm bg-[#161622] border-2 border-cyan-500 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center gap-4">
      <div class="w-16 h-16 rounded-2xl bg-cyan-500/25 border border-cyan-500/40 flex items-center justify-center text-cyan-400 animate-bounce">
        <i data-lucide="alarm-clock" class="w-8 h-8"></i>
      </div>
      <div>
        <div class="text-[10px] uppercase font-bold tracking-widest text-cyan-400 mb-1">Wecker (${safeEscape(time)})</div>
        <h3 class="text-xl font-bold text-white">${safeEscape(title)}</h3>
      </div>
      <div class="flex gap-2 w-full mt-2">
        <button onclick="document.getElementById('alarm-modal').remove(); snoozeAlarm();" class="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-gray-200 font-bold text-xs rounded-xl cursor-pointer">Snooze \u{1F4A4}</button>
        <button onclick="document.getElementById('alarm-modal').remove();" class="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl cursor-pointer">Stoppen \u{1F515}</button>
      </div>
    </div>
  `;
    document.body.appendChild(d);
    renderLucideIcons();
  }
  function snoozeAlarm() {
    alarmState.reminders.push({
      id: Date.now().toString(),
      text: "Snooze Wecker \u23F0",
      time: Date.now() + 5 * 6e4,
      completed: false
    });
    saveAlarmState();
    renderAlarmPanel2();
    if (typeof showToast === "function") showToast("Wecker f\xFCr 5 Minuten pausiert (Snooze) \u{1F4A4}");
  }
  var alarmLoopStarted = false;
  function startAlarmLoopOnce() {
    if (alarmLoopStarted) return;
    alarmLoopStarted = true;
    initAlarmReminder();
    setInterval(checkAlarmsLoop, 5e3);
  }
  document.addEventListener("DOMContentLoaded", startAlarmLoopOnce);
  if (document.readyState === "complete" || document.readyState === "interactive") {
    startAlarmLoopOnce();
  }
  if (typeof window !== "undefined") {
    window.alarmState = alarmState;
    window.initAlarmReminder = initAlarmReminder;
    window.saveAlarmState = saveAlarmState;
    window.renderAlarmPanel = renderAlarmPanel2;
    window.checkAlarmsLoop = checkAlarmsLoop;
    window.triggerAlarmModal = triggerAlarmModal;
    window.snoozeAlarm = snoozeAlarm;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.alarmState = alarmState;
    globalThis.initAlarmReminder = initAlarmReminder;
    globalThis.saveAlarmState = saveAlarmState;
    globalThis.renderAlarmPanel = renderAlarmPanel2;
    globalThis.checkAlarmsLoop = checkAlarmsLoop;
    globalThis.triggerAlarmModal = triggerAlarmModal;
    globalThis.snoozeAlarm = snoozeAlarm;
  }

  // app-tasks.js
  var inlineEditingTaskInfo = null;
  var TASK_COLOR_MAP = {
    rose: {
      border: "border-l-rose-500",
      bg: "bg-rose-500/10 hover:bg-rose-500/15",
      text: "text-rose-200",
      iconColor: "text-rose-400",
      shadow: "shadow-[0_0_12px_rgba(244,63,94,0.18)]"
    },
    orange: {
      border: "border-l-orange-500",
      bg: "bg-orange-500/10 hover:bg-orange-500/15",
      text: "text-orange-200",
      iconColor: "text-orange-400",
      shadow: "shadow-[0_0_12px_rgba(249,115,22,0.18)]"
    },
    amber: {
      border: "border-l-amber-500",
      bg: "bg-amber-500/10 hover:bg-amber-500/15",
      text: "text-amber-200",
      iconColor: "text-amber-400",
      shadow: "shadow-[0_0_12px_rgba(245,158,11,0.18)]"
    },
    emerald: {
      border: "border-l-emerald-500",
      bg: "bg-emerald-500/10 hover:bg-emerald-500/15",
      text: "text-emerald-200",
      iconColor: "text-emerald-400",
      shadow: "shadow-[0_0_12px_rgba(16,185,129,0.18)]"
    },
    sky: {
      border: "border-l-sky-500",
      bg: "bg-sky-500/10 hover:bg-sky-500/15",
      text: "text-sky-200",
      iconColor: "text-sky-400",
      shadow: "shadow-[0_0_12px_rgba(14,165,233,0.18)]"
    },
    purple: {
      border: "border-l-purple-500",
      bg: "bg-purple-500/10 hover:bg-purple-500/15",
      text: "text-purple-200",
      iconColor: "text-purple-400",
      shadow: "shadow-[0_0_12px_rgba(168,85,247,0.18)]"
    },
    none: {
      border: "border-[var(--accent)]",
      bg: "bg-white/[0.035] hover:bg-white/[0.07]",
      text: "text-gray-200",
      iconColor: "",
      shadow: ""
    }
  };
  function getCurrentWorkspaceItems2() {
    if (typeof state !== "undefined" && state && state.activeWorkspace === "work") {
      if (!state.workItems) state.workItems = createDefaultWorkItems(typeof currentLang !== "undefined" ? currentLang : "en");
      return state.workItems;
    }
    return state.items;
  }
  function getCurrentWorkspaceDone() {
    if (typeof state !== "undefined" && state && state.activeWorkspace === "work") {
      if (!state.workDone) state.workDone = [];
      return state.workDone;
    }
    return state.done;
  }
  function renderApp2() {
    const main = document.querySelector("main");
    if (!main) return;
    main.innerHTML = "";
    const fragment = document.createDocumentFragment();
    const now = /* @__PURE__ */ new Date();
    const todayISO = now.toISOString().split("T")[0];
    const dayOfWeek = now.getDay();
    const distanceToMonday = (dayOfWeek + 6) % 7;
    const mondayDate = new Date(now.getTime() - distanceToMonday * 24 * 60 * 60 * 1e3);
    const mondayISO = mondayDate.toISOString().split("T")[0];
    const currentItems = getCurrentWorkspaceItems2();
    const doneList = getCurrentWorkspaceDone();
    const isWork = state.activeWorkspace === "work";
    const activeOrder = isWork ? WORK_CATEGORIES_ORDER : categoriesOrder;
    activeOrder.forEach(([id, iconKey]) => {
      const isDone = id === "done";
      const isNotes = id === "notes";
      const isTermine = id === "termine";
      const isDaily = id === "daily" || id === "work_focus";
      const isWeekly = id === "weekly" || id === "work_in_progress";
      const activeCount = (currentItems[id] || []).length;
      let doneInCat = 0;
      if (isDaily) {
        doneInCat = doneList.filter((t3) => (t3.origin === "daily" || t3.origin === "work_focus") && t3.date === todayISO).length;
      } else if (isWeekly) {
        doneInCat = doneList.filter((t3) => (t3.origin === "weekly" || t3.origin === "work_in_progress") && t3.date >= mondayISO).length;
      } else {
        doneInCat = doneList.filter((t3) => t3.origin === id).length;
      }
      const totalInCat = doneInCat + activeCount;
      const catCustomTitle = Array.isArray(activeOrder) && activeOrder.find(([cid]) => cid === id) ? activeOrder.find(([cid]) => cid === id)[2] : null;
      const isCustomCol = Array.isArray(activeOrder) && activeOrder.find(([cid]) => cid === id) ? activeOrder.find(([cid]) => cid === id)[3] === true || id.startsWith("custom_") : false;
      const catName = catCustomTitle || t(id);
      const pct = !isDone && !isNotes && totalInCat > 0 ? Math.round(doneInCat / totalInCat * 100) : 0;
      let countBadgeHTML = "";
      if (isDone) {
        countBadgeHTML = `<span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 text-gray-400 border border-white/10 shadow-xs">${doneList.length}</span>`;
      } else if (!isNotes) {
        const isComplete = totalInCat > 0 && doneInCat === totalInCat;
        const badgeBg = isComplete ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : doneInCat > 0 ? "bg-[var(--accent)]/15 text-[var(--accent-light)] border-[var(--accent)]/25" : "bg-white/5 text-gray-400 border-white/10";
        countBadgeHTML = `<span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border shadow-xs ${badgeBg} transition-all duration-300">${doneInCat}/${totalInCat}</span>`;
      } else {
        const noteCount = (currentItems.notes || []).length;
        countBadgeHTML = `<span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 text-gray-400 border border-white/10 shadow-xs">${noteCount}</span>`;
      }
      const article = document.createElement("article");
      article.dataset.category = id;
      article.className = "min-h-[380px] h-full flex flex-col p-3 rounded-2xl border border-white/[0.08] bg-[#13131a]/75 backdrop-blur-md shadow-lg hover:border-[var(--accent)]/30 transition duration-300 cursor-default column-card-breathing";
      article.draggable = true;
      article.ondragstart = (e) => {
        if (draggedItemInfo) return;
        e.dataTransfer.setData("text/column", id);
        e.dataTransfer.effectAllowed = "move";
        draggedColumnId = id;
        article.classList.add("opacity-40");
      };
      article.ondragend = () => {
        article.classList.remove("opacity-40");
        draggedColumnId = null;
      };
      article.ondragover = (e) => {
        e.preventDefault();
        if (draggedColumnId) {
          e.dataTransfer.dropEffect = "move";
          article.classList.add("border-dashed", "border-[var(--accent)]");
        }
      };
      article.ondragleave = () => {
        article.classList.remove("border-dashed", "border-[var(--accent)]");
      };
      article.ondrop = (e) => {
        e.preventDefault();
        article.classList.remove("border-dashed", "border-[var(--accent)]");
        if (draggedColumnId) {
          const srcId = draggedColumnId;
          const targetId = id;
          if (srcId !== targetId) {
            const targetList = isWork ? workCategoriesOrder || WORK_CATEGORIES_ORDER : categoriesOrder;
            const srcIdx = targetList.findIndex(([catId]) => catId === srcId);
            const targetIdx = targetList.findIndex(([catId]) => catId === targetId);
            if (srcIdx !== -1 && targetIdx !== -1) {
              saveHistory();
              const [removed] = targetList.splice(srcIdx, 1);
              targetList.splice(targetIdx, 0, removed);
              saveCategoriesOrder();
              renderApp2();
              showToast(tr({ de: "Spalten-Reihenfolge aktualisiert \u2195\uFE0F", en: "Column order updated \u2195\uFE0F", es: "Orden de columnas actualizado \u2195\uFE0F", el: "\u0397 \u03C3\u03B5\u03B9\u03C1\u03AC \u03C3\u03C4\u03B7\u03BB\u03CE\u03BD \u03B5\u03BD\u03B7\u03BC\u03B5\u03C1\u03CE\u03B8\u03B7\u03BA\u03B5 \u2195\uFE0F", fr: "Ordre des colonnes mis \xE0 jour \u2195\uFE0F", it: "Ordine delle colonne aggiornato \u2195\uFE0F" }));
            }
          }
          draggedColumnId = null;
        } else {
          handleDrop(e, id);
        }
      };
      const hasDice = id === "daily" || id === "weekly" || id === "todo" || id === "occasionally" || id === "work_focus" || id === "work_in_progress" || id === "work_backlog" || id === "work_waiting";
      let columnIconHTML = "";
      if (hasDice) {
        columnIconHTML = `
        <span onclick="rollTaskDice('${id}', event)" class="text-[15.5px] leading-none cursor-pointer hover:scale-125 active:scale-90 transition-transform duration-200 shrink-0 select-none inline-flex items-center justify-center" title="${tr({ de: "Aufgabe ausw\xFCrfeln \u{1F3B2}", en: "Roll a task \u{1F3B2}", es: "Tirar dado para tarea \u{1F3B2}", el: "\u03A1\u03AF\u03BE\u03B5 \u03C4\u03BF \u03B6\u03AC\u03C1\u03B9 \u{1F3B2}", fr: "Tirer au sort \u{1F3B2}", it: "Lancia il dado \u{1F3B2}" })}">
          \u{1F3B2}
        </span>
      `;
      } else {
        columnIconHTML = `
        <span class="w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[var(--accent-light)] shadow-xs pointer-events-none shrink-0">
          <i data-lucide="${iconKey}" class="w-3 h-3"></i>
        </span>
      `;
      }
      article.innerHTML = `
      <div class="flex items-center justify-between gap-2 mb-2 pb-1">
        <div class="flex items-center gap-2 select-none min-w-0">
          ${columnIconHTML}
          <h2 class="text-gray-300 hover:text-white font-bold font-display text-[11px] tracking-wider uppercase cursor-grab active:cursor-grabbing transition truncate" title="Spalte durch Ziehen neu anordnen">
            ${catName}
          </h2>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          ${countBadgeHTML}
          ${isCustomCol ? `
            <button onclick="renameColumn('${id}', event)" class="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition cursor-pointer" title="${t("rename_column") || "Umbenennen"}"><i data-lucide="edit-3" class="w-3 h-3"></i></button>
            <button onclick="deleteColumn('${id}', event)" class="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/15 rounded transition cursor-pointer" title="${t("delete_column") || "L\xF6schen"}"><i data-lucide="trash-2" class="w-3 h-3"></i></button>
          ` : ""}
        </div>
      </div>
      ${!isDone && !isNotes ? `
        <div class="w-full h-1.5 bg-white/[0.06] rounded-full mb-3 overflow-hidden pointer-events-none p-0.5">
          <div class="h-full rounded-full bg-gradient-to-r from-[var(--accent)] via-emerald-400 to-teal-300 transition-all duration-500 shadow-sm" style="width: ${pct}%"></div>
        </div>
      ` : ""}
      <div id="list-${id}" class="flex flex-col gap-2.5 flex-1 min-h-[120px] overflow-y-auto py-0.5 px-0.5"></div>
      ${!isDone ? `
        <div class="flex items-center justify-start pt-1 px-0.5 mt-auto">
          <button onclick="openTextImportModal('${id}', event)" class="p-1 rounded-md bg-transparent hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-500 hover:text-gray-200 opacity-40 hover:opacity-100 transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0" title="${isNotes ? tr({ de: "Notizen importieren (.txt, .md, .csv, .json oder Zwischenablage)", en: "Import notes (.txt, .md, .csv, .json or clipboard)", es: "Importar notas (.txt, .md, .csv, .json o portapapeles)", el: "\u0395\u03B9\u03C3\u03B1\u03B3\u03C9\u03B3\u03AE \u03C3\u03B7\u03BC\u03B5\u03B9\u03CE\u03C3\u03B5\u03C9\u03BD (.txt, .md, .csv, .json \u03AE \u03C0\u03C1\u03CC\u03C7\u03B5\u03B9\u03C1\u03BF)", fr: "Importer des notes (.txt, .md, .csv, .json ou presse-papiers)", it: "Importa note (.txt, .md, .csv, .json o appunti)" }) : isTermine ? tr({ de: "Termine aus Kalenderdatei (.ics) oder Text importieren", en: "Import appointments from calendar file (.ics) or text", es: "Importar citas desde archivo (.ics) o texto", el: "\u0395\u03B9\u03C3\u03B1\u03B3\u03C9\u03B3\u03AE \u03C1\u03B1\u03BD\u03C4\u03B5\u03B2\u03BF\u03CD \u03B1\u03C0\u03CC \u03B7\u03BC\u03B5\u03C1\u03BF\u03BB\u03CC\u03B3\u03B9\u03BF (.ics) \u03AE \u03BA\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF", fr: "Importer des rendez-vous depuis un fichier (.ics) ou texte", it: "Importa appuntamenti da file (.ics) o testo" }) : tr({ de: "Aufgaben importieren (.txt, .md, .csv, .json oder Zwischenablage)", en: "Import tasks (.txt, .md, .csv, .json or clipboard)", es: "Importar tareas (.txt, .md, .csv, .json o portapapeles)", el: "\u0395\u03B9\u03C3\u03B1\u03B3\u03C9\u03B3\u03AE \u03B5\u03C1\u03B3\u03B1\u03C3\u03B9\u03CE\u03BD (.txt, .md, .csv, .json \u03AE \u03C0\u03C1\u03CC\u03C7\u03B5\u03B9\u03C1\u03BF)", fr: "Importer des t\xE2ches (.txt, .md, .csv, .json ou presse-papiers)", it: "Importa attivit\xE0 (.txt, .md, .csv, .json o appunti)" })}">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <polyline points="9 15 12 12 15 15"/>
            </svg>
          </button>
        </div>
      ` : ""}
    `;
      const listEl = article.querySelector(`#list-${id}`);
      if (isDone) {
        doneList.slice().reverse().forEach((item2, idx) => {
          const itemDiv = document.createElement("div");
          itemDiv.className = "group p-2 text-[11px] text-gray-400 hover:text-white border border-dashed border-slate-700 hover:border-purple-500 rounded-lg bg-slate-800/25 hover:bg-purple-950/20 cursor-pointer font-medium transition flex items-center justify-between gap-1";
          itemDiv.onclick = () => handleRestoreDoneTask(idx);
          itemDiv.title = "Zur\xFCck in den Plan verschieben";
          itemDiv.innerHTML = `<span class="truncate">${escapeHtml(item2.task)} \xB7 ${escapeHtml(item2.time)}</span><i data-lucide="undo" class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-purple-400 shrink-0"></i>`;
          listEl.appendChild(itemDiv);
        });
      } else if (isNotes) {
        const notesList = currentItems.notes || [];
        notesList.forEach((note, index) => {
          const noteText = typeof note === "object" ? note.task : note;
          const safeNoteEscaped = escapeHtml(noteText);
          const itemDiv = document.createElement("div");
          itemDiv.draggable = true;
          itemDiv.ondragstart = (e) => handleDragStart(e, "notes", index);
          itemDiv.ondragover = (e) => handleDragOver(e);
          itemDiv.ondrop = (e) => handleItemDrop(e, "notes", index);
          itemDiv.className = `group relative w-full h-auto min-h-[44px] max-h-[85px] overflow-hidden flex items-center justify-between p-2.5 border-0 border-l-[3.5px] border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-gray-100 font-medium transition-all duration-200 ease-out rounded-xl shadow-sm cursor-pointer`;
          itemDiv.onclick = () => openNoteDetailModal(index);
          itemDiv.innerHTML = `
          <div class="flex items-center gap-2.5 flex-1 min-w-0 pr-2 pointer-events-none">
            <i data-lucide="sticky-note" class="w-4 h-4 text-amber-400 shrink-0"></i>
            <span class="text-xs text-amber-100 font-normal leading-snug line-clamp-2 break-words flex-1 select-text" title="${safeNoteEscaped}">${safeNoteEscaped}</span>
          </div>
          <div class="absolute right-1 -top-3 flex items-center gap-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 shrink-0 bg-[#13131a] border border-white/10 px-1 py-0.5 rounded-lg shadow-lg z-50 whitespace-nowrap" onclick="event.stopPropagation()">
            <button onclick="convertNoteToTask(${index}, 'todo', event)" class="p-1 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded transition cursor-pointer" title="${tr({ de: "In To-Do umwandeln", en: "Convert to To-Do", es: "Convertir a To-Do", el: "\u039C\u03B5\u03C4\u03B1\u03C4\u03C1\u03BF\u03C0\u03AE \u03C3\u03B5 To-Do", fr: "Convertir en To-Do", it: "Converti in To-Do" })}">
              <i data-lucide="arrow-right-circle" class="w-3.5 h-3.5"></i>
            </button>
            <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
            <button onclick="copyNoteText(${index}, event)" class="p-1 text-gray-300 hover:text-white hover:bg-white/10 rounded transition cursor-pointer" title="${tr({ de: "Kopieren", en: "Copy", es: "Copiar", el: "\u0391\u03BD\u03C4\u03B9\u03B3\u03C1\u03B1\u03C6\u03AE", fr: "Copier", it: "Copia" })}">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i>
            </button>
            <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
            <button onclick="openNoteDetailModal(${index}, event)" class="p-1 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded transition cursor-pointer" title="Bearbeiten">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            </button>
            <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
            <button onclick="deleteTask('notes', ${index}, event)" class="p-1 text-gray-500 hover:text-red-400 hover:bg-white/10 rounded transition cursor-pointer" title="L\xF6schen">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        `;
          listEl.appendChild(itemDiv);
        });
        const addBtn = document.createElement("button");
        addBtn.onclick = () => {
          openTaskAddColumns["notes"] = true;
          renderApp2();
        };
        addBtn.className = "w-full min-h-[38px] p-2 rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-center text-xs text-amber-300/80 hover:text-amber-200 font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm";
        addBtn.innerHTML = `<i data-lucide="plus" class="w-3.5 h-3.5 text-amber-400"></i><span>${tr({ de: "Notiz hinzuf\xFCgen", en: "Add note", es: "A\xF1adir nota", el: "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u03C3\u03B7\u03BC\u03B5\u03AF\u03C9\u03C3\u03B7\u03C2", fr: "Ajouter une note", it: "Aggiungi nota" })}</span>`;
        const addInput = document.createElement("textarea");
        addInput.rows = 2;
        addInput.placeholder = t("notesPlaceholder");
        addInput.className = "w-full min-h-[50px] p-2 px-3 rounded-lg border border-amber-500/60 bg-[#0a0a0e] text-left text-xs placeholder:text-gray-500 focus:outline-none focus:border-amber-400 transition cursor-text font-medium text-amber-100 shadow-inner resize-none";
        addInput.onkeydown = (e) => {
          if (e.key === "Enter" && !e.shiftKey && addInput.value.trim()) {
            e.preventDefault();
            saveHistory();
            const curItems = getCurrentWorkspaceItems2();
            if (!curItems.notes) curItems.notes = [];
            curItems.notes.push(addInput.value.trim());
            addInput.value = "";
            openTaskAddColumns["notes"] = false;
            saveState();
            renderApp2();
            if (typeof lucide !== "undefined") lucide.createIcons();
          }
          if (e.key === "Escape") {
            openTaskAddColumns["notes"] = false;
            renderApp2();
          }
        };
        if (openTaskAddColumns["notes"]) {
          listEl.appendChild(addInput);
          setTimeout(() => addInput.focus(), 0);
        } else {
          listEl.appendChild(addBtn);
        }
      } else if (isTermine) {
        const rawTermine = currentItems.termine || [];
        const itemsWithMeta = rawTermine.map((item2, originalIdx) => {
          const obj = typeof item2 === "object" ? item2 : { task: item2, date: "", time: "", location: "" };
          return { ...obj, originalIdx };
        });
        itemsWithMeta.sort((a, b) => {
          if (!a.date && !b.date) return 0;
          if (!a.date) return 1;
          if (!b.date) return -1;
          return `${a.date} ${a.time || "00:00"}`.localeCompare(`${b.date} ${b.time || "00:00"}`);
        });
        itemsWithMeta.forEach((item2) => {
          const originalIndex = item2.originalIdx;
          const isToday = item2.date === todayISO;
          let fullDateString = "No Date";
          if (item2.date) {
            try {
              const parts = item2.date.split("-");
              if (parts.length === 3) {
                const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                fullDateString = d.toLocaleDateString(currentLang, { weekday: "short", day: "numeric", month: "short" });
              }
            } catch (e) {
              console.warn("[Tasks] Date parsing warning:", e);
            }
          }
          let locHTML = item2.location ? `<span class="text-[9px] text-gray-400 truncate max-w-[100px] inline-flex items-center gap-0.5"><i data-lucide="map-pin" class="w-2.5 h-2.5 shrink-0 text-gray-500"></i>${escapeHtml(item2.location)}</span>` : "";
          const itemDiv = document.createElement("div");
          itemDiv.className = `group relative w-full h-auto min-h-[44px] flex items-center justify-between p-2.5 border-0 border-l-[3.5px] ${isToday ? "border-amber-400 bg-amber-500/10" : "border-amber-500/40 bg-white/[0.035]"} hover:bg-white/[0.07] text-gray-200 font-medium transition-all duration-200 ease-out rounded-xl shadow-sm cursor-pointer`;
          itemDiv.onclick = () => editTermin(originalIndex);
          itemDiv.innerHTML = `
          <button onclick="handleCompleteTask('termine', ${originalIndex}, event)" class="flex items-center gap-2.5 flex-1 min-w-0 text-left bg-transparent border-0 text-inherit cursor-pointer p-0 pr-2 group/task" title="Termin als erledigt markieren">
            <i data-lucide="clock" class="w-4 h-4 text-amber-400 shrink-0 group-hover/task:text-emerald-400 transition-colors"></i>
            <div class="flex flex-col min-w-0 flex-1">
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="text-xs leading-snug font-semibold text-amber-100 truncate">${escapeHtml(item2.task || item2.name || "Termin")}</span>
                ${item2.time ? `<span class="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">${escapeHtml(item2.time)}</span>` : ""}
              </div>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[9px] font-mono text-gray-400">${escapeHtml(fullDateString)}</span>
                ${locHTML}
              </div>
            </div>
          </button>
          <div class="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 shrink-0 bg-[#13131e]/95 border border-white/15 px-1.5 py-1 rounded-xl shadow-xl z-50 whitespace-nowrap backdrop-blur-md">
            <button onclick="editTermin(${originalIndex}, event)" class="p-1 text-amber-400 hover:text-amber-300 hover:bg-amber-500/15 rounded-lg transition cursor-pointer" title="${tr({ de: "Bearbeiten", en: "Edit", fr: "Modifier", it: "Modifica", es: "Editar", el: "\u0395\u03C0\u03B5\u03BE\u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1" })}"><i data-lucide="edit-3" class="w-3.5 h-3.5"></i></button>
            <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
            <button onclick="deleteTask('termine', ${originalIndex}, event)" class="p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/15 rounded-lg transition cursor-pointer" title="L\xF6schen"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
          </div>
        `;
          listEl.appendChild(itemDiv);
        });
        if (!isTerminFormOpen) {
          const btnEl = document.createElement("button");
          btnEl.onclick = () => toggleTerminForm(true);
          btnEl.className = "mt-2 w-full min-h-[38px] p-2 rounded-lg border border-dashed border-white/15 bg-[#0a0a0e] hover:bg-[#13131e] text-center text-xs text-gray-400 hover:text-white font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm";
          const btnT = t("appointment_new_btn");
          btnEl.innerHTML = `<i data-lucide="calendar-plus" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i><span>${btnT}</span>`;
          listEl.appendChild(btnEl);
        } else {
          const formDiv = document.createElement("div");
          formDiv.className = "mt-2 p-3 bg-[#0e0e14] border border-[var(--accent)]/40 rounded-xl flex flex-col gap-2 shadow-lg";
          const formT = t("appointment_form_title");
          const nameT = t("appointment_form_name_placeholder");
          const dateT = t("appointment_form_date_label");
          const timeT = t("appointment_form_time_label");
          const saveT = t("appointment_form_save_btn");
          const cancelT = t("appointment_form_cancel_btn");
          const dateValue = selectedCalendarDate || todayISO;
          formDiv.innerHTML = `
          <div class="flex items-center justify-between text-xs font-bold text-amber-300">
            <span class="flex items-center gap-1.5"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> ${formT}</span>
            <button onclick="toggleTerminForm(false)" class="text-gray-400 hover:text-white p-0.5 cursor-pointer text-xs">\u2715</button>
          </div>
          <input type="text" id="add-termin-title" placeholder="${nameT}" class="w-full p-2 bg-black/60 border border-white/15 rounded-lg text-xs text-white outline-none focus:border-[var(--accent)] font-semibold placeholder:text-gray-500 mb-2" />
          <input type="text" id="add-termin-location" placeholder="Ort (z.B. Zoom, B\xFCro, Park)" class="w-full p-2 bg-black/60 border border-white/15 rounded-lg text-xs text-white outline-none focus:border-[var(--accent)] font-semibold placeholder:text-gray-500 mb-2" />
          <div class="grid grid-cols-2 gap-2 mb-2">
            <div><label class="text-[10px] text-gray-400 mb-0.5 block font-medium">${dateT}</label><input type="date" id="add-termin-date" value="${dateValue}" class="w-full p-1.5 bg-black/60 border border-white/15 rounded-lg text-xs text-gray-200 outline-none focus:border-[var(--accent)] cursor-pointer" /></div>
            <div><label class="text-[10px] text-gray-400 mb-0.5 block font-medium">${timeT}</label><input type="time" id="add-termin-time" value="10:00" class="w-full p-1.5 bg-black/60 border border-white/15 rounded-lg text-xs text-gray-200 outline-none focus:border-[var(--accent)] cursor-pointer" /></div>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <button onclick="handleAddTermin()" class="flex-1 py-1.5 bg-[var(--accent)] hover:opacity-90 text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"><i data-lucide="check" class="w-3.5 h-3.5"></i><span>${saveT}</span></button>
            <button onclick="toggleTerminForm(false)" class="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs rounded-lg transition cursor-pointer">${cancelT}</button>
          </div>
        `;
          setTimeout(() => {
            const inputTitle = formDiv.querySelector("#add-termin-title");
            if (inputTitle) {
              inputTitle.onkeydown = (e) => {
                if (e.key === "Enter" && inputTitle.value.trim()) handleAddTermin();
                if (e.key === "Escape") toggleTerminForm(false);
              };
            }
          }, 0);
          listEl.appendChild(formDiv);
        }
      } else {
        (currentItems[id] || []).forEach((task, index) => {
          const taskObj = typeof task === "object" ? task : { task };
          const taskText = taskObj.task;
          const taskColor = taskObj.color || "none";
          const colorStyle = TASK_COLOR_MAP[taskColor] || TASK_COLOR_MAP.none;
          const iconDetails = getTaskIconDetails(taskText, id);
          const isTaskActive = activeTimerTask === taskText && timerRunning;
          const itemDiv = document.createElement("div");
          itemDiv.draggable = true;
          itemDiv.ondragstart = (e) => handleDragStart(e, id, index);
          itemDiv.ondragover = (e) => handleDragOver(e);
          itemDiv.ondrop = (e) => handleItemDrop(e, id, index);
          const randomVal = Math.random();
          let subtleAnimClass = "";
          if (randomVal < 0.1) subtleAnimClass = "task-anim-float";
          else if (randomVal < 0.2) subtleAnimClass = "task-anim-shift";
          else if (randomVal < 0.3) subtleAnimClass = "task-anim-pulse";
          const borderBgClass = isTaskActive ? "border-amber-400 bg-amber-500/15 shadow-[0_0_18px_rgba(251,191,36,0.25)]" : taskColor !== "none" ? `${colorStyle.border} ${colorStyle.bg} ${colorStyle.shadow}` : "border-[var(--accent)] bg-white/[0.035] hover:bg-white/[0.07]";
          itemDiv.className = `group relative w-full min-h-[44px] flex items-center justify-between p-2.5 border-0 border-l-[4px] ${borderBgClass} text-gray-200 font-medium leading-tight transition-all duration-200 ease-out rounded-xl ${subtleAnimClass}`;
          const safeTaskEscaped = escapeHtml(taskText);
          const pair = HOVER_COLOR_PAIRS[(index + id.charCodeAt(0)) % HOVER_COLOR_PAIRS.length];
          const isInlineEditing = inlineEditingTaskInfo && inlineEditingTaskInfo.cat === id && inlineEditingTaskInfo.index === index;
          if (isInlineEditing) {
            itemDiv.innerHTML = `
            <div class="flex items-center gap-1.5 w-full" onclick="event.stopPropagation()">
              <input type="text" id="inline-edit-input" value="${safeTaskEscaped}" class="flex-1 p-1.5 px-2.5 bg-black/80 border border-[var(--accent)] rounded-lg text-xs text-white outline-none font-medium shadow-inner" onkeydown="if(event.key==='Enter') saveInlineEdit('${id}', ${index}); if(event.key==='Escape') cancelInlineEdit();" />
              <button onclick="saveInlineEdit('${id}', ${index}, event)" class="p-1.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg transition cursor-pointer shrink-0" title="Speichern"><i data-lucide="check" class="w-3.5 h-3.5"></i></button>
              <button onclick="cancelInlineEdit(event)" class="p-1.5 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg transition cursor-pointer shrink-0" title="Abbrechen"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>
            </div>
          `;
            setTimeout(() => {
              const inp = itemDiv.querySelector("#inline-edit-input");
              if (inp) {
                inp.focus();
                inp.select();
              }
            }, 20);
          } else {
            const recurrenceBadge = typeof item === "object" && item.recurrence && item.recurrence !== "none" ? `<span class="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0 ml-1">\u{1F501} ${t("recurrence_" + item.recurrence) || item.recurrence}</span>` : "";
            itemDiv.innerHTML = `
            <button onclick="handleCompleteTask('${id}', ${index}, event)" class="task-complete-btn flex items-center gap-2.5 flex-1 min-w-0 text-left bg-transparent border-0 text-inherit cursor-pointer p-0 transition duration-150 pr-2 group/task" title="Abhaken">
              <i data-lucide="${iconDetails.icon}" class="standard-task-icon w-4 h-4 ${isTaskActive ? "text-amber-400 animate-pulse" : taskColor !== "none" ? colorStyle.iconColor : iconDetails.color} shrink-0 transition-colors duration-150 ${pair.hoverIcon}"></i>
              <span ondblclick="editTaskInline('${id}', ${index}, event)" class="task-text-span block text-xs leading-snug min-w-0 flex-1 font-medium text-gray-200 truncate ${isTaskActive ? "text-amber-200 font-bold" : taskColor !== "none" ? colorStyle.text : ""} ${pair.text} transition-colors duration-150" title="${safeTaskEscaped} (Doppelklick zum Bearbeiten)">${safeTaskEscaped}</span>
              ${recurrenceBadge}
            </button>
            <div class="absolute right-1.5 -top-3.5 flex items-center gap-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 shrink-0 bg-[#13131e]/95 border border-white/15 px-1.5 py-1 rounded-xl shadow-xl z-50 whitespace-nowrap backdrop-blur-md">
              <div class="relative group/color inline-flex items-center">
                <button onclick="event.stopPropagation()" class="p-1 text-pink-400 hover:text-pink-300 hover:bg-pink-500/15 rounded-lg transition cursor-pointer" title="${tr({ de: "Farbe w\xE4hlen \u{1F3A8}", en: "Card color \u{1F3A8}", es: "Elegir color \u{1F3A8}", el: "\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE \u03C7\u03C1\u03CE\u03BC\u03B1\u03C4\u03BF\u03C2 \u{1F3A8}", fr: "Couleur \u{1F3A8}", it: "Colore \u{1F3A8}" })}"><i data-lucide="palette" class="w-3.5 h-3.5"></i></button>
                <div class="hidden group-hover/color:flex absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 p-1 px-1.5 bg-[#161622] border border-white/20 rounded-xl shadow-2xl gap-1.5 z-50 items-center backdrop-blur-md">
                  <button onclick="setTaskColor('${id}', ${index}, 'none', event)" class="w-3.5 h-3.5 rounded-full border border-gray-400 bg-transparent hover:scale-125 transition cursor-pointer" title="Standard"></button>
                  <button onclick="setTaskColor('${id}', ${index}, 'rose', event)" class="w-3.5 h-3.5 rounded-full bg-rose-500 hover:scale-125 transition cursor-pointer shadow-sm" title="Rot"></button>
                  <button onclick="setTaskColor('${id}', ${index}, 'orange', event)" class="w-3.5 h-3.5 rounded-full bg-orange-500 hover:scale-125 transition cursor-pointer shadow-sm" title="Orange"></button>
                  <button onclick="setTaskColor('${id}', ${index}, 'amber', event)" class="w-3.5 h-3.5 rounded-full bg-amber-500 hover:scale-125 transition cursor-pointer shadow-sm" title="Gelb"></button>
                  <button onclick="setTaskColor('${id}', ${index}, 'emerald', event)" class="w-3.5 h-3.5 rounded-full bg-emerald-500 hover:scale-125 transition cursor-pointer shadow-sm" title="Gr\xFCn"></button>
                  <button onclick="setTaskColor('${id}', ${index}, 'sky', event)" class="w-3.5 h-3.5 rounded-full bg-sky-500 hover:scale-125 transition cursor-pointer shadow-sm" title="Blau"></button>
                  <button onclick="setTaskColor('${id}', ${index}, 'purple', event)" class="w-3.5 h-3.5 rounded-full bg-purple-500 hover:scale-125 transition cursor-pointer shadow-sm" title="Lila"></button>
                </div>
              </div>
              <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
              <button onclick="editTaskInline('${id}', ${index}, event)" class="p-1 text-purple-400 hover:text-purple-300 hover:bg-purple-500/15 rounded-lg transition cursor-pointer" title="${tr({ de: "Bearbeiten", en: "Edit", fr: "Modifier", it: "Modifica", es: "Editar", el: "\u0395\u03C0\u03B5\u03BE\u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1" })}"><i data-lucide="edit-3" class="w-3.5 h-3.5"></i></button>
              <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
              <button onclick="openTaskStepsModal('${id}', ${index}, event)" class="p-1 text-[var(--accent-light)] hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer" title="${tr({ de: "In Teilschritte zerlegen", en: "Break into subtasks", fr: "D\xE9couper en \xE9tapes", it: "Dividi in passaggi", es: "Dividir en pasos", el: "\u0391\u03BD\u03AC\u03BB\u03C5\u03C3\u03B7 \u03C3\u03B5 \u03B2\u03AE\u03BC\u03B1\u03C4\u03B1" })}"><i data-lucide="footprints" class="w-3.5 h-3.5"></i></button>
              <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
              <button onclick="copyTaskTextByIndex('${id}', ${index}, event)" class="p-1 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer" title="${tr({ de: "Text kopieren", en: "Copy text", fr: "Copier texte", it: "Copia testo", es: "Copiar testo", el: "\u0391\u03BD\u03C4\u03B9\u03B3\u03C1\u03B1\u03C6\u03AE \u03BA\u03B5\u03B9\u03BC\u03AD\u03BD\u03BF\u03C5" })}"><i data-lucide="copy" class="w-3.5 h-3.5"></i></button>
              <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
              <button onclick="startTaskTimerByIndex('${id}', ${index}, event)" class="p-1 text-amber-400 hover:text-amber-300 hover:bg-amber-500/15 rounded-lg transition cursor-pointer" title="Timer starten"><i data-lucide="timer" class="w-3.5 h-3.5"></i></button>
              <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
              <button onclick="deleteTask('${id}', ${index}, event)" class="p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/15 rounded-lg transition cursor-pointer" title="L\xF6schen"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
            </div>
          `;
          }
          listEl.appendChild(itemDiv);
        });
        const addBtn = document.createElement("button");
        addBtn.onclick = () => {
          openTaskAddColumns[id] = true;
          renderApp2();
        };
        addBtn.className = "w-full min-h-[38px] p-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/25 text-center text-xs text-gray-400 hover:text-white font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm";
        addBtn.innerHTML = `<i data-lucide="plus" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i><span>${t("add")}</span>`;
        const addInput = document.createElement("input");
        addInput.type = "text";
        addInput.placeholder = t("add");
        addInput.className = "w-full min-h-[38px] p-2 px-3 rounded-xl border border-[var(--accent)]/60 bg-[#0e0e16] text-left text-xs placeholder:text-gray-500 focus:outline-none focus:border-[var(--accent)] transition cursor-text font-semibold text-white shadow-inner";
        addInput.onkeydown = (e) => {
          if (e.key === "Enter" && addInput.value.trim()) {
            saveHistory();
            const curItems = getCurrentWorkspaceItems2();
            if (!curItems[id]) curItems[id] = [];
            curItems[id].push(addInput.value.trim());
            addInput.value = "";
            openTaskAddColumns[id] = false;
            saveState();
            renderApp2();
            populateHelperTaskSelect();
            if (typeof lucide !== "undefined") lucide.createIcons();
          }
          if (e.key === "Escape") {
            openTaskAddColumns[id] = false;
            renderApp2();
          }
        };
        if (openTaskAddColumns[id]) {
          listEl.appendChild(addInput);
          setTimeout(() => addInput.focus(), 0);
        } else {
          listEl.appendChild(addBtn);
        }
      }
      fragment.appendChild(article);
    });
    main.appendChild(fragment);
    checkSampleBannerVisibility();
    updateShoppingListPopup(true);
    renderCookingPanel(true);
    renderLucideIcons();
    renderMobileCategoryTabs();
  }
  function renderMobileCategoryTabs() {
    const bar = document.getElementById("mobile-category-tabs");
    if (!bar) return;
    const curItems = getCurrentWorkspaceItems2();
    const doneList = getCurrentWorkspaceDone();
    const isWork = state && state.activeWorkspace === "work";
    const activeOrder = isWork ? workCategoriesOrder || WORK_CATEGORIES_ORDER : categoriesOrder;
    let activeCat = localStorage.getItem("flowPlannerMobileCategory");
    if (!activeCat || !activeOrder.some(([id]) => id === activeCat)) {
      activeCat = activeOrder[0] ? activeOrder[0][0] : isWork ? "work_focus" : "daily";
    }
    document.body.dataset.mobileCat = activeCat;
    bar.innerHTML = activeOrder.map(([id, iconKey, customTitle]) => {
      const isActive = id === activeCat;
      const isDone = id === "done";
      const activeCount = (curItems[id] || []).length;
      const count = isDone ? doneList.length : activeCount;
      const shortLabel = (customTitle || t(id)).replace(/\s*\(.*?\)\s*$/, "");
      return `
      <button onclick="setMobileCategory('${id}')" class="mobile-tab-btn ${isActive ? "mobile-tab-active" : ""}" data-cat="${id}">
        <i data-lucide="${iconKey}" class="w-3.5 h-3.5"></i>
        <span>${shortLabel}</span>
        <span class="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${isActive ? "bg-white/25 text-white" : "bg-white/10 text-gray-400"}">${count}</span>
      </button>
    `;
    }).join("");
    renderLucideIcons();
  }
  function openFeierabendModal() {
    const modal = document.getElementById("feierabend-celebration-modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    renderLucideIcons();
    if (typeof triggerCelebrationParticles === "function") triggerCelebrationParticles();
  }
  function closeFeierabendModal() {
    const modal = document.getElementById("feierabend-celebration-modal");
    if (modal) modal.classList.add("hidden");
  }
  function startFeierabendChillMode() {
    closeFeierabendModal();
    showToast(tr({
      de: "Feierabend-Modus aktiviert! \u{1F379} Entspanne dich!",
      en: "Chill mode activated! \u{1F379} Relax and enjoy!",
      fr: "Mode d\xE9tente activ\xE9 ! \u{1F379} Profite bien !",
      it: "Modalit\xE0 relax attivata! \u{1F379} Buon riposo!",
      es: "\xA1Modo relax activado! \u{1F379} \xA1A descansar!",
      el: "\u039B\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03AF\u03B1 \u03C7\u03B1\u03BB\u03AC\u03C1\u03C9\u03C3\u03B7\u03C2 \u03B5\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03B9\u03AE\u03B8\u03B7\u03BA\u03B5! \u{1F379}"
    }));
    if (typeof startAmbientSound === "function") {
      startAmbientSound("lofi_sunshine");
    }
  }
  window.openFeierabendModal = openFeierabendModal;
  window.closeFeierabendModal = closeFeierabendModal;
  window.startFeierabendChillMode = startFeierabendChillMode;
  function deleteTask(category, index, event) {
    if (event) event.stopPropagation();
    saveHistory();
    const curItems = getCurrentWorkspaceItems2();
    const taskObj = curItems[category]?.[index];
    const taskText = typeof taskObj === "object" ? taskObj?.task : taskObj;
    if (curItems[category]) curItems[category].splice(index, 1);
    if (taskText && state.completedSteps) delete state.completedSteps[taskText];
    saveState();
    showToast(t("toast_task_deleted"), { undo: true, duration: 5e3 });
    renderApp2();
    updateZenView();
    populateHelperTaskSelect();
  }
  function handleRestoreDoneTask(doneIndex) {
    saveHistory();
    const curDone = getCurrentWorkspaceDone();
    const curItems = getCurrentWorkspaceItems2();
    const reversedIndex = curDone.length - 1 - doneIndex;
    const item2 = curDone[reversedIndex];
    if (!item2) return;
    curDone.splice(reversedIndex, 1);
    const fallbackCat = state.activeWorkspace === "work" ? "work_focus" : "daily";
    const targetCat = curItems[item2.origin] ? item2.origin : fallbackCat;
    if (!curItems[targetCat]) curItems[targetCat] = [];
    curItems[targetCat].push(item2.task);
    saveState();
    showToast(t("toast_task_restored"));
    renderApp2();
    updateZenView();
    populateHelperTaskSelect();
  }
  var draggedItemInfo = null;
  function handleDragStart(e, category, index) {
    draggedItemInfo = { category, index };
    e.stopPropagation();
    e.dataTransfer.setData("text/plain", JSON.stringify({ category, index }));
    e.dataTransfer.effectAllowed = "move";
  }
  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }
  function handleItemDrop(e, targetCategory, targetIndex) {
    e.preventDefault();
    e.stopPropagation();
    let data = draggedItemInfo;
    try {
      if (!data) data = JSON.parse(e.dataTransfer.getData("text/plain"));
    } catch (err) {
    }
    if (!data || data.category === void 0 || data.index === void 0) return;
    const { category: srcCat, index: srcIdx } = data;
    if (srcCat === "done" || targetCategory === "done") return;
    const curItems = getCurrentWorkspaceItems2();
    if (!curItems[srcCat] || !curItems[targetCategory]) return;
    saveHistory();
    const [item2] = curItems[srcCat].splice(srcIdx, 1);
    curItems[targetCategory].splice(targetIndex, 0, item2);
    draggedItemInfo = null;
    saveState();
    renderApp2();
    populateHelperTaskSelect();
  }
  function handleDrop(e, targetCategory) {
    e.preventDefault();
    let data = draggedItemInfo;
    try {
      if (!data) data = JSON.parse(e.dataTransfer.getData("text/plain"));
    } catch (err) {
    }
    if (!data || data.category === void 0 || data.index === void 0) return;
    const { category: srcCat, index: srcIdx } = data;
    if (srcCat === "done" || targetCategory === "done") return;
    const curItems = getCurrentWorkspaceItems2();
    if (!curItems[srcCat] || !curItems[targetCategory]) return;
    saveHistory();
    const [item2] = curItems[srcCat].splice(srcIdx, 1);
    curItems[targetCategory].push(item2);
    draggedItemInfo = null;
    saveState();
    renderApp2();
    populateHelperTaskSelect();
  }
  var currentlyOpenPanel2 = null;
  document.addEventListener("pointerdown", (e) => {
    if (!currentlyOpenPanel2) return;
    const openPanelEl = document.getElementById(`panel-${currentlyOpenPanel2}`);
    if (!openPanelEl || openPanelEl.classList.contains("hidden")) return;
    if (openPanelEl.contains(e.target)) return;
    const clickedTrigger = e.target.closest(`[onclick*="togglePanel('${currentlyOpenPanel2}')"]`) || e.target.closest(`[onclick*="togglePanel("${currentlyOpenPanel2}")"]`) || e.target.closest(`[onclick*="handleSoundsMainClick"]`) || e.target.closest(`[onclick*="handleMusicMainClick"]`);
    if (clickedTrigger) return;
    openPanelEl.classList.add("hidden");
    currentlyOpenPanel2 = null;
  });
  var currentImportTargetCat = "todo";
  function closeTextImportModal() {
    const modal = document.getElementById("text-import-modal");
    if (modal) modal.classList.add("hidden");
  }
  function parseTextIntoItems(rawText) {
    if (!rawText) return [];
    const trimmed = rawText.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]") || trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        const parsed = JSON.parse(trimmed);
        const arr = Array.isArray(parsed) ? parsed : parsed.tasks || parsed.items || parsed.todos || [parsed];
        const extracted = [];
        arr.forEach((item2) => {
          if (typeof item2 === "string" && item2.trim()) {
            extracted.push(item2.trim());
          } else if (item2 && typeof item2 === "object") {
            const val = item2.task || item2.title || item2.name || item2.text || item2.content;
            if (val && typeof val === "string" && val.trim()) {
              extracted.push(val.trim());
            }
          }
        });
        if (extracted.length > 0) return extracted;
      } catch (e) {
        console.warn("[Tasks] parseImportedText JSON attempt failed, falling back to line parser:", e);
      }
    }
    const lines = rawText.split(/\r?\n/);
    const items2 = [];
    lines.forEach((line) => {
      let clean = line.trim();
      if (!clean) return;
      clean = clean.replace(/^\[[ xX]\]\s*/, "");
      clean = clean.replace(/^[-*•+#>]\s*(\[[ xX]\]\s*)?/, "");
      clean = clean.replace(/^\d+[\.\)]\s*/, "");
      clean = clean.replace(/^["'`]|["'`]$/g, "").trim();
      if (clean.length > 0) {
        items2.push(clean);
      }
    });
    return items2;
  }
  function parseIcsCalendar(icsText) {
    if (!icsText || !icsText.includes("BEGIN:VCALENDAR")) return null;
    const events = [];
    const veventBlocks = icsText.split("BEGIN:VEVENT");
    for (let i = 1; i < veventBlocks.length; i++) {
      const block = veventBlocks[i].split("END:VEVENT")[0];
      if (!block) continue;
      let summary = "";
      let dtStart = "";
      let location2 = "";
      const lines = block.split(/\r?\n/);
      lines.forEach((line) => {
        if (line.startsWith("SUMMARY:")) {
          summary = line.substring(8).trim();
        } else if (line.startsWith("SUMMARY;")) {
          summary = line.split(":").slice(1).join(":").trim();
        } else if (line.startsWith("DTSTART:") || line.startsWith("DTSTART;")) {
          dtStart = line.split(":").slice(1).join(":").trim();
        } else if (line.startsWith("LOCATION:")) {
          location2 = line.substring(9).trim();
        }
      });
      if (summary) {
        let eventDate = "";
        let eventTime = "";
        if (dtStart) {
          const match = dtStart.match(/(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2}))?/);
          if (match) {
            eventDate = `${match[1]}-${match[2]}-${match[3]}`;
            if (match[4] && match[5]) {
              eventTime = `${match[4]}:${match[5]}`;
            }
          }
        }
        events.push({
          name: summary + (location2 ? ` (${location2})` : ""),
          date: eventDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          time: eventTime || "09:00"
        });
      }
    }
    return events.length > 0 ? events : null;
  }
  window.parseTextIntoItems = parseTextIntoItems;
  window.parseIcsCalendar = parseIcsCalendar;
  function executeTextImport() {
    const textarea = document.getElementById("text-import-textarea");
    const text = textarea ? textarea.value : "";
    if (text.includes("BEGIN:VCALENDAR") || currentImportTargetCat === "termine") {
      const icsEvents = parseIcsCalendar(text);
      if (icsEvents && icsEvents.length > 0) {
        saveHistory();
        const currentItems2 = getCurrentWorkspaceItems2();
        if (!currentItems2.termine) currentItems2.termine = [];
        icsEvents.forEach((ev) => currentItems2.termine.push(ev));
        currentItems2.termine.sort((a, b) => (a.date || "").localeCompare(b.date || "") || (a.time || "").localeCompare(b.time || ""));
        saveState();
        closeTextImportModal();
        renderApp2();
        showToast(tr({
          de: `\u{1F4C5} ${icsEvents.length} Termine aus Kalenderdatei (.ics) importiert!`,
          en: `\u{1F4C5} ${icsEvents.length} appointments imported from calendar file (.ics)!`,
          es: `\u{1F4C5} \xA1${icsEvents.length} citas importadas de archivo de calendario (.ics)!`,
          el: `\u{1F4C5} ${icsEvents.length} \u03C1\u03B1\u03BD\u03C4\u03B5\u03B2\u03BF\u03CD \u03B5\u03B9\u03C3\u03AE\u03C7\u03B8\u03B7\u03C3\u03B1\u03BD \u03B1\u03C0\u03CC \u03B1\u03C1\u03C7\u03B5\u03AF\u03BF \u03B7\u03BC\u03B5\u03C1\u03BF\u03BB\u03BF\u03B3\u03AF\u03BF\u03C5 (.ics)!`,
          fr: `\u{1F4C5} ${icsEvents.length} rendez-vous import\xE9s depuis le calendrier (.ics) !`,
          it: `\u{1F4C5} ${icsEvents.length} appuntamenti importati dal file calendario (.ics)!`
        }));
        return;
      }
    }
    const items2 = parseTextIntoItems(text);
    if (items2.length === 0) {
      showToast(tr({
        de: "Bitte Text eingeben oder Datei ausw\xE4hlen!",
        en: "Please enter text or select a file!",
        es: "\xA1Introduce texto o selecciona un archivo!",
        el: "\u0395\u03B9\u03C3\u03AC\u03B3\u03B5\u03C4\u03B5 \u03BA\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF \u03AE \u03B5\u03C0\u03B9\u03BB\u03AD\u03BE\u03C4\u03B5 \u03B1\u03C1\u03C7\u03B5\u03AF\u03BF!",
        fr: "Veuillez saisir du texte ou choisir un fichier !",
        it: "Inserisci testo o seleziona un file!"
      }));
      return;
    }
    saveHistory();
    const currentItems = getCurrentWorkspaceItems2();
    if (!currentItems[currentImportTargetCat]) {
      currentItems[currentImportTargetCat] = [];
    }
    items2.forEach((item2) => {
      currentItems[currentImportTargetCat].push(item2);
    });
    saveState();
    closeTextImportModal();
    renderApp2();
    populateHelperTaskSelect();
    showToast(tr({
      de: `\u2705 ${items2.length} Eintr\xE4ge in "${t(currentImportTargetCat)}" importiert!`,
      en: `\u2705 ${items2.length} items imported into "${t(currentImportTargetCat)}"!`,
      es: `\u2705 \xA1${items2.length} elementos importados en "${t(currentImportTargetCat)}"!`,
      el: `\u2705 ${items2.length} \u03C3\u03C4\u03BF\u03B9\u03C7\u03B5\u03AF\u03B1 \u03B5\u03B9\u03C3\u03AE\u03C7\u03B8\u03B7\u03C3\u03B1\u03BD \u03C3\u03C4\u03BF "${t(currentImportTargetCat)}"!`,
      fr: `\u2705 ${items2.length} \xE9l\xE9ments import\xE9s dans "${t(currentImportTargetCat)}" !`,
      it: `\u2705 ${items2.length} elementi importati in "${t(currentImportTargetCat)}"!`
    }));
  }
  function openNoteDetailModal(index, event) {
    if (event) event.stopPropagation();
    const notesList = state.items.notes || [];
    if (index < 0 || index >= notesList.length) return;
    const note = notesList[index];
    const noteText = typeof note === "object" ? note.task : note;
    const modal = document.getElementById("note-detail-modal");
    const indexInput = document.getElementById("note-detail-index");
    const textarea = document.getElementById("note-detail-textarea");
    if (indexInput) indexInput.value = index;
    if (textarea) textarea.value = noteText || "";
    if (modal) modal.classList.remove("hidden");
    if (textarea) setTimeout(() => textarea.focus(), 50);
  }
  function copyTaskText(text, event) {
    if (event) event.stopPropagation();
    if (!text) return;
    navigator.clipboard?.writeText(text).then(() => {
      showToast(tr({
        de: "Aufgabentext kopiert! \u{1F4CB}",
        en: "Task text copied! \u{1F4CB}",
        es: "\xA1Texto de tarea copiado! \u{1F4CB}",
        el: "\u03A4\u03BF \u03BA\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF \u03B1\u03BD\u03C4\u03B9\u03B3\u03C1\u03AC\u03C6\u03B7\u03BA\u03B5! \u{1F4CB}",
        fr: "Texte copi\xE9 ! \u{1F4CB}",
        it: "Testo copiato! \u{1F4CB}"
      }));
    }).catch(() => {
    });
  }
  window.copyTaskText = copyTaskText;
  function copyTaskTextByIndex(cat, index, event) {
    if (event) event.stopPropagation();
    const curItems = getCurrentWorkspaceItems2();
    const item2 = curItems[cat]?.[index];
    if (!item2) return;
    const text = typeof item2 === "object" ? item2.task : item2;
    copyTaskText(text, event);
  }
  window.copyTaskTextByIndex = copyTaskTextByIndex;
  function startTaskTimerByIndex2(cat, index, event) {
    if (event) event.stopPropagation();
    const curItems = getCurrentWorkspaceItems2();
    const item2 = curItems[cat]?.[index];
    if (!item2) return;
    const text = typeof item2 === "object" ? item2.task : item2;
    if (typeof startTaskTimer === "function") {
      startTaskTimer(text, event);
    }
  }
  window.startTaskTimerByIndex = startTaskTimerByIndex2;
  function checkSampleBannerVisibility() {
    const banner = document.getElementById("sample-tasks-banner");
    if (!banner) return;
    banner.classList.remove("sample-banner-visible");
    if (typeof lucide !== "undefined") lucide.createIcons();
  }
  if (typeof window !== "undefined") {
    window.parseTextIntoItems = parseTextIntoItems;
    window.parseIcsCalendar = parseIcsCalendar;
    window.executeTextImport = executeTextImport;
    window.deleteTask = deleteTask;
    window.handleRestoreDoneTask = handleRestoreDoneTask;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.parseTextIntoItems = parseTextIntoItems;
    globalThis.parseIcsCalendar = parseIcsCalendar;
    globalThis.executeTextImport = executeTextImport;
    globalThis.deleteTask = deleteTask;
    globalThis.handleRestoreDoneTask = handleRestoreDoneTask;
  }

  // app-reports.js
  function generateComprehensiveReportText() {
    const now = /* @__PURE__ */ new Date();
    const dateStr = now.toLocaleDateString(currentLang === "de" ? "de-DE" : "en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const todayISO = now.toISOString().split("T")[0];
    const dayOfWeek = now.getDay();
    const distanceToMonday = (dayOfWeek + 6) % 7;
    const mondayDate = new Date(now.getTime() - distanceToMonday * 24 * 60 * 60 * 1e3);
    const mondayISO = mondayDate.toISOString().split("T")[0];
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0];
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0];
    const doneAll = state.done || [];
    const doneToday = doneAll.filter((item2) => item2.date === todayISO);
    const doneWeek = doneAll.filter((item2) => item2.date && item2.date >= sevenDaysAgo);
    const doneMonth = doneAll.filter((item2) => item2.date && item2.date >= thirtyDaysAgo);
    const weeklyItems = state.items.weekly || [];
    const weeklyDoneThisWeek = doneAll.filter((item2) => item2.origin === "weekly" && item2.date >= mondayISO);
    let text = `========================================
`;
    text += `\u{1F4CA} FLOW-ORGANISER: STATISTIK- & FORTSCHRITTSBERICHT
`;
    text += `Erstellt am: ${dateStr}
`;
    text += `========================================

`;
    text += `\u{1F4C5} 1. HEUTE (${todayISO})
`;
    text += `----------------------------------------
`;
    text += `\u2022 Erledigte Aufgaben heute: ${doneToday.length}
`;
    if (doneToday.length > 0) {
      doneToday.forEach((t3) => {
        text += `  \u2713 [${t3.origin ? t3.origin.toUpperCase() : "TASK"}] ${t3.task} (${t3.time || ""})
`;
      });
    } else {
      text += `  (Noch keine Aufgaben heute abgeschlossen)
`;
    }
    text += `
`;
    text += `\u{1F3C6} 2. WOCHEN-\xDCBERSICHT (Letzte 7 Tage)
`;
    text += `----------------------------------------
`;
    text += `\u2022 Gesamte Aufgaben in 7 Tagen: ${doneWeek.length}
`;
    text += `\u2022 Davon Tagesaufgaben: ${doneWeek.filter((t3) => t3.origin === "daily").length}
`;
    text += `\u2022 Davon Haushaltsaufgaben: ${doneWeek.filter((t3) => t3.origin === "weekly").length}
`;
    text += `\u2022 Davon To-Dos / Sonstiges: ${doneWeek.filter((t3) => t3.origin === "todo" || t3.origin === "notes").length}

`;
    text += `\u{1F9F9} 3. HAUSHALTSAUFGABEN (Status dieser Woche)
`;
    text += `----------------------------------------
`;
    text += `\u2022 Abgeschlossen diese Woche: ${weeklyDoneThisWeek.length} von ${weeklyDoneThisWeek.length + weeklyItems.length}
`;
    if (weeklyDoneThisWeek.length > 0) {
      weeklyDoneThisWeek.forEach((t3) => text += `  \u2713 Erledigt: ${t3.task} (${t3.date})
`);
    }
    if (weeklyItems.length > 0) {
      weeklyItems.forEach((t3) => {
        const name = typeof t3 === "object" ? t3.task : t3;
        text += `  \u25FB Offen: ${name}
`;
      });
    }
    text += `
`;
    text += `\u{1F4C8} 4. MONATS-\xDCBERSICHT (Letzte 30 Tage)
`;
    text += `----------------------------------------
`;
    text += `\u2022 Gesamte Aufgaben in 30 Tagen: ${doneMonth.length}
`;
    text += `\u2022 Durchschnitt pro Tag: ${(doneMonth.length / 30).toFixed(1)} Aufgaben

`;
    text += `\u{1F4CC} 5. AKTUELLE OFFENE AUFGABEN & NOTIZEN
`;
    text += `----------------------------------------
`;
    text += `\u2022 Offene Tagesaufgaben: ${(state.items.daily || []).length}
`;
    text += `\u2022 Offene To-Dos: ${(state.items.todo || []).length}
`;
    (state.items.todo || []).forEach((t3) => {
      const name = typeof t3 === "object" ? t3.task : t3;
      text += `  \u25FB ${name}
`;
    });
    text += `\u2022 Gespeicherte Notizen: ${(state.items.notes || []).length}
`;
    (state.items.notes || []).forEach((n, idx) => {
      const name = typeof n === "object" ? n.task : n;
      text += `  \u{1F4DD} [${idx + 1}] ${name}
`;
    });
    text += `
========================================
`;
    return text;
  }
  function generateReportContent(timeframe = "comprehensive", targetDate = "") {
    const reportText = typeof generateComprehensiveReportText === "function" ? generateComprehensiveReportText() : "";
    const now = /* @__PURE__ */ new Date();
    const dateStr = targetDate || now.toISOString().split("T")[0];
    const filename = `Flow-Organiser-Report-${timeframe}-${dateStr}.txt`;
    return { reportText, filename };
  }
  if (typeof window !== "undefined") {
    window.generateReportContent = generateReportContent;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.generateReportContent = generateReportContent;
  }

  // app-weather-news.js
  var currentWeatherLocation = JSON.parse(localStorage.getItem("flow_weather_loc") || "null") || {
    name: "Berlin",
    country: "Deutschland",
    lat: 52.52,
    lon: 13.41
  };
  var cachedWeatherData = typeof AppStorage !== "undefined" ? AppStorage.get("flow_weather_cache", null) : typeof localStorage !== "undefined" ? JSON.parse(localStorage.getItem("flow_weather_cache") || "null") : null;
  var weatherUnit = localStorage.getItem("flow_weather_unit") || "c";
  var WEATHER_CODES = {
    0: { label: { de: "Klarer Himmel", en: "Clear sky", fr: "Ciel d\xE9gag\xE9", it: "Cielo sereno", es: "Cielo despejado", el: "\u039A\u03B1\u03B8\u03B1\u03C1\u03CC\u03C2 \u03BF\u03C5\u03C1\u03B1\u03BD\u03CC\u03C2" }, icon: "sun", emoji: "\u2600\uFE0F" },
    1: { label: { de: "\xDCberwiegend klar", en: "Mainly clear", fr: "Plut\xF4t d\xE9gag\xE9", it: "Prevalentemente sereno", es: "Mayormente despejado", el: "\u039A\u03C5\u03C1\u03AF\u03C9\u03C2 \u03B1\u03AF\u03B8\u03C1\u03B9\u03BF\u03C2" }, icon: "sun-medium", emoji: "\u{1F324}\uFE0F" },
    2: { label: { de: "Teilweise bew\xF6lkt", en: "Partly cloudy", fr: "Partiellement nuageux", it: "Parzialmente nuvoloso", es: "Parcialmente nublado", el: "\u039C\u03B5\u03C1\u03B9\u03BA\u03CE\u03C2 \u03C3\u03C5\u03BD\u03BD\u03B5\u03C6\u03B9\u03B1\u03C3\u03BC\u03AD\u03BD\u03BF\u03C2" }, icon: "cloud-sun", emoji: "\u26C5" },
    3: { label: { de: "Bedeckt", en: "Overcast", fr: "Couvert", it: "Coperto", es: "Nublado", el: "\u03A3\u03C5\u03BD\u03BD\u03B5\u03C6\u03B9\u03B1\u03C3\u03BC\u03AD\u03BD\u03BF\u03C2" }, icon: "cloud", emoji: "\u2601\uFE0F" },
    45: { label: { de: "Nebel", en: "Fog", fr: "Brouillard", it: "Nebbia", es: "Niebla", el: "\u039F\u03BC\u03AF\u03C7\u03BB\u03B7" }, icon: "cloud-fog", emoji: "\u{1F32B}\uFE0F" },
    48: { label: { de: "Reifnebel", en: "Depositing rime fog", fr: "Brouillard givrant", it: "Nebbia con brina", es: "Niebla con escarcha", el: "\u03A0\u03B1\u03B3\u03C9\u03BC\u03AD\u03BD\u03B7 \u03BF\u03BC\u03AF\u03C7\u03BB\u03B7" }, icon: "cloud-fog", emoji: "\u{1F32B}\uFE0F" },
    51: { label: { de: "Leichter Nieselregen", en: "Light drizzle", fr: "Bruine l\xE9g\xE8re", it: "Pioggerella leggera", es: "Llovizna ligera", el: "\u0395\u03BB\u03B1\u03C6\u03C1\u03CD \u03C8\u03B9\u03C7\u03AC\u03BB\u03B9\u03C3\u03BC\u03B1" }, icon: "cloud-drizzle", emoji: "\u{1F326}\uFE0F" },
    53: { label: { de: "Nieselregen", en: "Moderate drizzle", fr: "Bruine mod\xE9r\xE9e", it: "Pioggerella", es: "Llovizna moderada", el: "\u039C\u03AD\u03C4\u03C1\u03B9\u03BF \u03C8\u03B9\u03C7\u03AC\u03BB\u03B9\u03C3\u03BC\u03B1" }, icon: "cloud-drizzle", emoji: "\u{1F327}\uFE0F" },
    55: { label: { de: "Starker Nieselregen", en: "Dense drizzle", fr: "Bruine dense", it: "Pioggerella fitta", es: "Llovizna densa", el: "\u03A0\u03C5\u03BA\u03BD\u03CC \u03C8\u03B9\u03C7\u03AC\u03BB\u03B9\u03C3\u03BC\u03B1" }, icon: "cloud-rain", emoji: "\u{1F327}\uFE0F" },
    61: { label: { de: "Leichter Regen", en: "Slight rain", fr: "Pluie faible", it: "Pioggia debole", es: "Lluvia d\xE9bil", el: "\u0395\u03BB\u03B1\u03C6\u03C1\u03B9\u03AC \u03B2\u03C1\u03BF\u03C7\u03AE" }, icon: "cloud-rain", emoji: "\u{1F326}\uFE0F" },
    63: { label: { de: "M\xE4\xDFiger Regen", en: "Moderate rain", fr: "Pluie mod\xE9r\xE9e", it: "Pioggia moderata", es: "Lluvia moderada", el: "\u039C\u03AD\u03C4\u03C1\u03B9\u03B1 \u03B2\u03C1\u03BF\u03C7\u03AE" }, icon: "cloud-rain", emoji: "\u{1F327}\uFE0F" },
    65: { label: { de: "Starker Regen", en: "Heavy rain", fr: "Forte pluie", it: "Pioggia forte", es: "Lluvia fuerte", el: "\u0394\u03C5\u03BD\u03B1\u03C4\u03AE \u03B2\u03C1\u03BF\u03C7\u03AE" }, icon: "cloud-rain", emoji: "\u{1F327}\uFE0F" },
    71: { label: { de: "Leichter Schneefall", en: "Slight snowfall", fr: "Faible chute de neige", it: "Nevicata debole", es: "Nevada ligera", el: "\u0395\u03BB\u03B1\u03C6\u03C1\u03B9\u03AC \u03C7\u03B9\u03BF\u03BD\u03CC\u03C0\u03C4\u03C9\u03C3\u03B7" }, icon: "snowflake", emoji: "\u{1F328}\uFE0F" },
    73: { label: { de: "M\xE4\xDFiger Schneefall", en: "Moderate snowfall", fr: "Chute de neige mod\xE9r\xE9e", it: "Nevicata moderata", es: "Nevada moderada", el: "\u039C\u03AD\u03C4\u03C1\u03B9\u03B1 \u03C7\u03B9\u03BF\u03BD\u03CC\u03C0\u03C4\u03C9\u03C3\u03B7" }, icon: "snowflake", emoji: "\u2744\uFE0F" },
    75: { label: { de: "Starker Schneefall", en: "Heavy snowfall", fr: "Forte chute de neige", it: "Nevicata intensa", es: "Nevada intensa", el: "\u03A0\u03C5\u03BA\u03BD\u03AE \u03C7\u03B9\u03BF\u03BD\u03CC\u03C0\u03C4\u03C9\u03C3\u03B7" }, icon: "snowflake", emoji: "\u2744\uFE0F" },
    80: { label: { de: "Regenschauer", en: "Rain showers", fr: "Averses de pluie", it: "Rovescio di pioggia", es: "Chubascos de lluvia", el: "\u039C\u03C0\u03CC\u03C1\u03B5\u03C2 \u03B2\u03C1\u03BF\u03C7\u03AE\u03C2" }, icon: "cloud-rain", emoji: "\u{1F326}\uFE0F" },
    81: { label: { de: "Kr\xE4ftige Schauer", en: "Heavy showers", fr: "Fortes averses", it: "Forti rovesci", es: "Fuertes chubascos", el: "\u0388\u03BD\u03C4\u03BF\u03BD\u03B5\u03C2 \u03BC\u03C0\u03CC\u03C1\u03B5\u03C2" }, icon: "cloud-rain", emoji: "\u{1F327}\uFE0F" },
    82: { label: { de: "Sintflutartige Schauer", en: "Violent showers", fr: "Averses violentes", it: "Nubifragio", es: "Chubascos violentos", el: "\u039A\u03B1\u03C4\u03B1\u03C1\u03C1\u03B1\u03BA\u03C4\u03CE\u03B4\u03B7\u03C2 \u03B2\u03C1\u03BF\u03C7\u03AE" }, icon: "cloud-lightning", emoji: "\u26C8\uFE0F" },
    95: { label: { de: "Gewitter", en: "Thunderstorm", fr: "Orage", it: "Temporale", es: "Tormenta", el: "\u039A\u03B1\u03C4\u03B1\u03B9\u03B3\u03AF\u03B4\u03B1" }, icon: "cloud-lightning", emoji: "\u26A1" }
  };
  function getWeatherInfo(code) {
    const lang = typeof currentLang !== "undefined" ? currentLang : "en";
    const item2 = WEATHER_CODES[code] || {
      label: { de: "Heiter", en: "Fair", fr: "Clair", it: "Sereno", es: "Despejado", el: "\u0391\u03AF\u03B8\u03C1\u03B9\u03BF\u03C2" },
      icon: "sun",
      emoji: "\u2600\uFE0F"
    };
    return {
      text: item2.label[lang] || item2.label.en || "Clear",
      icon: item2.icon,
      emoji: item2.emoji
    };
  }
  async function fetchLocalWeather2(force = false) {
    const container = document.getElementById("weather-content-area");
    if (!container) return;
    if (cachedWeatherData && !force) {
      renderWeatherData(cachedWeatherData);
      return;
    }
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      if (cachedWeatherData) {
        renderWeatherData(cachedWeatherData);
      } else {
        renderWeatherFallback();
      }
      return;
    }
    container.innerHTML = `
    <div class="py-10 text-center text-gray-400 space-y-2">
      <div class="w-8 h-8 mx-auto border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
      <div class="text-xs font-semibold">${tr({ de: "Lade lokales Wetter...", en: "Fetching local weather...", fr: "Chargement m\xE9t\xE9o...", it: "Caricamento meteo...", es: "Cargando clima...", el: "\u03A6\u03CC\u03C1\u03C4\u03C9\u03C3\u03B7 \u03BA\u03B1\u03B9\u03C1\u03BF\u03CD..." })}</div>
    </div>
  `;
    try {
      const lat = currentWeatherLocation.lat;
      const lon = currentWeatherLocation.lon;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6e3);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error("Weather API error");
      const data = await res.json();
      cachedWeatherData = data;
      if (typeof AppStorage !== "undefined") {
        AppStorage.set("flow_weather_cache", data);
      } else {
        localStorage.setItem("flow_weather_cache", JSON.stringify(data));
      }
      renderWeatherData(data);
    } catch (err) {
      console.warn("Wetter-Ladefehler (Offline oder Timeout):", err.message);
      if (cachedWeatherData) {
        renderWeatherData(cachedWeatherData);
      } else {
        renderWeatherFallback();
      }
    }
  }
  function renderWeatherData(data) {
    const container = document.getElementById("weather-content-area");
    if (!container || !data || !data.current) return;
    const current = data.current;
    const daily = data.daily || {};
    const hourly = data.hourly || {};
    let temp = current.temperature_2m;
    let feels = current.apparent_temperature;
    let maxTemp = daily.temperature_2m_max ? daily.temperature_2m_max[0] : temp + 3;
    let minTemp = daily.temperature_2m_min ? daily.temperature_2m_min[0] : temp - 4;
    if (weatherUnit === "f") {
      temp = temp * 9 / 5 + 32;
      feels = feels * 9 / 5 + 32;
      maxTemp = maxTemp * 9 / 5 + 32;
      minTemp = minTemp * 9 / 5 + 32;
    }
    const unitSymbol = weatherUnit === "f" ? "\xB0F" : "\xB0C";
    const info = getWeatherInfo(current.weather_code);
    let flowTip = {
      de: "Angenehmes Wetter f\xFCr fokussiertes Arbeiten. Vergiss nicht, regelm\xE4\xDFig zu l\xFCften! \u{1F33F}",
      en: "Great conditions for deep work. Remember to open the window for fresh air! \u{1F33F}",
      fr: "Conditions agr\xE9ables pour travailler. A\xE8re ta pi\xE8ce de temps en temps ! \u{1F33F}",
      it: "Ottimo clima per concentrarsi. Ricordati di arieggiare la stanza! \u{1F33F}",
      es: "Buen clima para concentrarse. \xA1Acu\xE9rdate de ventilar la habitaci\xF3n! \u{1F33F}",
      el: "\u0399\u03B4\u03B1\u03BD\u03B9\u03BA\u03AD\u03C2 \u03C3\u03C5\u03BD\u03B8\u03AE\u03BA\u03B5\u03C2 \u03B3\u03B9\u03B1 \u03B5\u03C3\u03C4\u03AF\u03B1\u03C3\u03B7. \u0398\u03C5\u03BC\u03AE\u03C3\u03BF\u03C5 \u03BD\u03B1 \u03B1\u03B5\u03C1\u03AF\u03C3\u03B5\u03B9\u03C2 \u03C4\u03BF\u03BD \u03C7\u03CE\u03C1\u03BF! \u{1F33F}"
    };
    if (current.precipitation > 0 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95].includes(current.weather_code)) {
      flowTip = {
        de: "Drau\xDFen regnet es \u{1F327}\uFE0F Perfektes Gem\xFCtlichkeitswetter, um eine Aufgabe von der Liste zu streichen!",
        en: "Rainy outside \u{1F327}\uFE0F Perfect cozy vibe to check off high-focus tasks from your board!",
        fr: "Il pleut dehors \u{1F327}\uFE0F Ambiance id\xE9ale pour rayer des t\xE2ches de ta liste !",
        it: "Piove fuori \u{1F327}\uFE0F Atmosfera perfetta per completare le tue attivit\xE0 con calma!",
        es: "Llueve afuera \u{1F327}\uFE0F \xA1Ambiente acogedor para tachar tareas pendientes!",
        el: "\u0392\u03C1\u03AD\u03C7\u03B5\u03B9 \u03AD\u03BE\u03C9 \u{1F327}\uFE0F \u0399\u03B4\u03B1\u03BD\u03B9\u03BA\u03AE \u03C3\u03C4\u03B9\u03B3\u03BC\u03AE \u03B3\u03B9\u03B1 \u03C3\u03C5\u03B3\u03BA\u03AD\u03BD\u03C4\u03C1\u03C9\u03C3\u03B7 \u03BA\u03B1\u03B9 \u03BF\u03BB\u03BF\u03BA\u03BB\u03AE\u03C1\u03C9\u03C3\u03B7 \u03B5\u03C1\u03B3\u03B1\u03C3\u03B9\u03CE\u03BD!"
      };
    } else if (temp > 27) {
      flowTip = {
        de: "Es ist warm! \u2600\uFE0F Trinke genug Wasser und halte deine Konzentrationsphasen kurz & knackig.",
        en: "Warm day! \u2600\uFE0F Stay hydrated and keep your focus sprints short & energetic.",
        fr: "Il fait chaud ! \u2600\uFE0F Bois de l'eau et garde tes sessions de travail courtes et dynamiques.",
        it: "Fa caldo! \u2600\uFE0F Bevi molta acqua e mantieni le tue sessioni di lavoro brevi e fresche.",
        es: "\xA1Hace calor! \u2600\uFE0F Mantente hidratado y haz sesiones de trabajo breves y enfocadas.",
        el: "\u039A\u03AC\u03BD\u03B5\u03B9 \u03B6\u03AD\u03C3\u03C4\u03B7! \u2600\uFE0F \u03A0\u03B9\u03B5\u03C2 \u03AC\u03C6\u03B8\u03BF\u03BD\u03BF \u03BD\u03B5\u03C1\u03CC \u03BA\u03B1\u03B9 \u03BA\u03AC\u03BD\u03B5 \u03C3\u03CD\u03BD\u03C4\u03BF\u03BC\u03B1 \u03B4\u03B9\u03B1\u03BB\u03B5\u03AF\u03BC\u03BC\u03B1\u03C4\u03B1."
      };
    }
    let hourlyPills = "";
    if (hourly.time && hourly.temperature_2m) {
      const currentHour = (/* @__PURE__ */ new Date()).getHours();
      for (let i = currentHour; i < currentHour + 6 && i < hourly.time.length; i++) {
        const timeStr = `${String(i % 24).padStart(2, "0")}:00`;
        let hTemp = hourly.temperature_2m[i];
        if (weatherUnit === "f") hTemp = hTemp * 9 / 5 + 32;
        const hInfo = getWeatherInfo(hourly.weather_code[i]);
        hourlyPills += `
        <div class="flex flex-col items-center gap-1 p-2 bg-white/5 rounded-xl min-w-[52px] border border-white/5 shrink-0">
          <span class="text-[9px] text-gray-400 font-mono">${timeStr}</span>
          <span class="text-sm">${hInfo.emoji}</span>
          <span class="text-[10px] font-bold text-white">${Math.round(hTemp)}\xB0</span>
        </div>
      `;
      }
    }
    let dailyCards = "";
    if (daily.time && daily.temperature_2m_max) {
      const daysDE = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
      const daysEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const lang = typeof currentLang !== "undefined" ? currentLang : "en";
      const dayNames = lang === "en" ? daysEN : daysDE;
      for (let i = 1; i < 5 && i < daily.time.length; i++) {
        const dDate = new Date(daily.time[i]);
        const dName = dayNames[dDate.getDay()];
        let dMax = daily.temperature_2m_max[i];
        let dMin = daily.temperature_2m_min[i];
        if (weatherUnit === "f") {
          dMax = dMax * 9 / 5 + 32;
          dMin = dMin * 9 / 5 + 32;
        }
        const dInfo = getWeatherInfo(daily.weather_code[i]);
        dailyCards += `
        <div class="flex items-center justify-between p-2 bg-black/30 rounded-xl border border-white/5 text-xs">
          <span class="font-bold text-gray-300 w-8 font-mono">${dName}</span>
          <div class="flex items-center gap-1.5 text-gray-200">
            <span>${dInfo.emoji}</span>
            <span class="text-[10px] text-gray-400 truncate max-w-[90px]">${dInfo.text}</span>
          </div>
          <div class="font-mono text-[10px] space-x-1">
            <span class="text-white font-bold">${Math.round(dMax)}\xB0</span>
            <span class="text-gray-500">${Math.round(dMin)}\xB0</span>
          </div>
        </div>
      `;
      }
    }
    container.innerHTML = `
    <!-- Haupt-Wetterkarte -->
    <div class="bg-gradient-to-br from-sky-500/20 via-indigo-950/40 to-black/60 border border-sky-500/30 rounded-2xl p-3.5 flex flex-col gap-3 shadow-lg">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-1.5 text-white font-bold text-sm">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-sky-400"></i>
            <span>${currentWeatherLocation.name}</span>
            <span class="text-[10px] text-gray-400 font-normal">(${currentWeatherLocation.country || ""})</span>
          </div>
          <div class="text-[11px] text-sky-300 font-medium mt-0.5 flex items-center gap-1">
            <span>${info.emoji}</span>
            <span>${info.text}</span>
          </div>
        </div>

        <div class="text-right">
          <div class="text-3xl font-display font-black text-white leading-none">${Math.round(temp)}${unitSymbol}</div>
          <div class="text-[9px] text-gray-400 font-mono mt-1">
            H: ${Math.round(maxTemp)}\xB0 \xB7 T: ${Math.round(minTemp)}\xB0
          </div>
        </div>
      </div>

      <!-- Details (Wind, Feuchte, Gef\xFChlt) -->
      <div class="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
        <div class="p-1.5 bg-black/40 rounded-xl border border-white/5">
          <div class="text-[8px] text-gray-400 uppercase font-mono">${tr({ de: "Gef\xFChlt", en: "Feels like", fr: "Ressenti", it: "Percepita", es: "Sensaci\xF3n", el: "\u0391\u03AF\u03C3\u03B8\u03B7\u03C3\u03B7" })}</div>
          <div class="text-xs font-bold text-white font-mono mt-0.5">${Math.round(feels)}${unitSymbol}</div>
        </div>
        <div class="p-1.5 bg-black/40 rounded-xl border border-white/5">
          <div class="text-[8px] text-gray-400 uppercase font-mono">${tr({ de: "Wind", en: "Wind", fr: "Vent", it: "Vento", es: "Viento", el: "\u0386\u03BD\u03B5\u03BC\u03BF\u03C2" })}</div>
          <div class="text-xs font-bold text-white font-mono mt-0.5">${Math.round(current.wind_speed_10m)} km/h</div>
        </div>
        <div class="p-1.5 bg-black/40 rounded-xl border border-white/5">
          <div class="text-[8px] text-gray-400 uppercase font-mono">${tr({ de: "Feuchte", en: "Humidity", fr: "Humidit\xE9", it: "Umidit\xE0", es: "Humedad", el: "\u03A5\u03B3\u03C1\u03B1\u03C3\u03AF\u03B1" })}</div>
          <div class="text-xs font-bold text-white font-mono mt-0.5">${current.relative_humidity_2m}%</div>
        </div>
      </div>
    </div>

    <!-- Smarter Flow-Tipp -->
    <div class="p-2.5 bg-sky-500/10 border border-sky-500/25 rounded-xl flex items-center gap-2 text-sky-200 text-xs leading-normal">
      <i data-lucide="sparkles" class="w-4 h-4 text-sky-400 shrink-0"></i>
      <span>${tr(flowTip)}</span>
    </div>

    <!-- St\xFCndlicher Verlauf -->
    <div class="space-y-1.5">
      <div class="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">${tr({ de: "St\xFCndliche Vorschau", en: "Hourly Forecast", fr: "Pr\xE9visions par heure", it: "Previsioni orarie", es: "Pron\xF3stico por hora", el: "\u03A9\u03C1\u03B9\u03B1\u03AF\u03B1 \u03C0\u03C1\u03CC\u03B3\u03BD\u03C9\u03C3\u03B7" })}</div>
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">${hourlyPills}</div>
    </div>

    <!-- 5-Tage-Vorschau -->
    <div class="space-y-1.5">
      <div class="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">${tr({ de: "Kommende Tage", en: "Next Days", fr: "Prochains jours", it: "Prossimi giorni", es: "Pr\xF3ximos d\xEDas", el: "\u0395\u03C0\u03CC\u03BC\u03B5\u03BD\u03B5\u03C2 \u03B7\u03BC\u03AD\u03C1\u03B5\u03C2" })}</div>
      <div class="flex flex-col gap-1.5">${dailyCards}</div>
    </div>
  `;
    renderLucideIcons();
  }
  function renderWeatherFallback() {
    const container = document.getElementById("weather-content-area");
    if (!container) return;
    container.innerHTML = `
    <div class="p-4 bg-sky-500/10 border border-sky-500/30 rounded-2xl text-center space-y-3">
      <span class="text-3xl">\u{1F324}\uFE0F</span>
      <div class="text-xs font-bold text-white">${currentWeatherLocation.name} \xB7 21\xB0C</div>
      <p class="text-[11px] text-gray-300">${tr({ de: "\xDCberwiegend heiter & angenehme 21\xB0C. Perfekte Bedingungen f\xFCr deinen Arbeitstag!", en: "Mostly pleasant & 21\xB0C. Great conditions for your productivity!", fr: "Agr\xE9able et 21\xB0C. Parfait pour ta journ\xE9e !", it: "Sereno e 21\xB0C. Ottimo per la tua giornata!", es: "Agradable y 21\xB0C. \xA1Ideal para tu jornada!", el: "\u0395\u03C5\u03C7\u03AC\u03C1\u03B9\u03C3\u03C4\u03BF\u03C2 \u03BA\u03B1\u03B9\u03C1\u03CC\u03C2 \u03C3\u03C4\u03BF\u03C5\u03C2 21\xB0C." })}</p>
      <button onclick="fetchLocalWeather(true)" class="px-3 py-1.5 bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded-xl text-xs font-bold transition cursor-pointer">
        ${tr({ de: "Erneut versuchen \u{1F504}", en: "Retry \u{1F504}", fr: "R\xE9essayer \u{1F504}", it: "Riprova \u{1F504}", es: "Reintentar \u{1F504}", el: "\u0394\u03BF\u03BA\u03AF\u03BC\u03B1\u03C3\u03B5 \u03BE\u03B1\u03BD\u03AC \u{1F504}" })}
      </button>
    </div>
  `;
  }
  var currentNewsLocation = localStorage.getItem("flow_news_loc") || "de_all";
  var currentNewsCategory = "all";
  var newsSearchKeyword = "";
  var bookmarkedNews = JSON.parse(localStorage.getItem("flow_bookmarked_news") || "[]");
  var NEWS_LOCATIONS = {
    de: [
      { id: "de_all", name: "\u{1F1E9}\u{1F1EA} Deutschlandweit (D-A-CH)" },
      { id: "de_berlin", name: "\u{1F3DB}\uFE0F Berlin & Brandenburg" },
      { id: "de_munich", name: "\u{1F968} M\xFCnchen & Bayern" },
      { id: "de_hamburg", name: "\u2693 Hamburg & Norddeutschland" },
      { id: "de_nrw", name: "\u{1F3F0} K\xF6ln, D\xFCsseldorf & NRW" },
      { id: "de_frankfurt", name: "\u{1F4BC} Frankfurt & Hessen" },
      { id: "de_stuttgart", name: "\u2699\uFE0F Stuttgart & Baden-W\xFCrttemberg" },
      { id: "de_leipzig", name: "\u{1F3A8} Leipzig & Dresden" },
      { id: "at_vienna", name: "\u{1F1E6}\u{1F1F9} Wien & \xD6sterreich" },
      { id: "ch_zurich", name: "\u{1F1E8}\u{1F1ED} Z\xFCrich & Schweiz" },
      { id: "global", name: "\u{1F30D} International & Global" }
    ],
    en: [
      { id: "global", name: "\u{1F30D} Global & Worldwide" },
      { id: "en_london", name: "\u{1F1EC}\u{1F1E7} London & UK" },
      { id: "en_ny", name: "\u{1F1FA}\u{1F1F8} New York & East Coast" },
      { id: "en_sf", name: "\u{1F309} San Francisco & Silicon Valley" },
      { id: "en_eu", name: "\u{1F1EA}\u{1F1FA} Europe & International" }
    ],
    fr: [
      { id: "fr_all", name: "\u{1F1EB}\u{1F1F7} France Nationale" },
      { id: "fr_paris", name: "\u{1F5FC} Paris & \xCEle-de-France" },
      { id: "fr_lyon", name: "\u{1F981} Lyon & Auvergne-Rh\xF4ne-Alpes" },
      { id: "global", name: "\u{1F30D} International & Monde" }
    ],
    it: [
      { id: "it_all", name: "\u{1F1EE}\u{1F1F9} Italia Nazionale" },
      { id: "it_rome", name: "\u{1F3DB}\uFE0F Roma & Centro" },
      { id: "it_milan", name: "\u{1F3D9}\uFE0F Milano & Lombardia" },
      { id: "global", name: "\u{1F30D} Internazionale & Mondo" }
    ],
    es: [
      { id: "es_all", name: "\u{1F1EA}\u{1F1F8} Espa\xF1a Nacional" },
      { id: "es_madrid", name: "\u{1F3DB}\uFE0F Madrid & Centro" },
      { id: "es_barcelona", name: "\u{1F3D6}\uFE0F Barcelona & Catalu\xF1a" },
      { id: "global", name: "\u{1F30D} Internacional & Global" }
    ],
    el: [
      { id: "el_all", name: "\u{1F1EC}\u{1F1F7} \u0395\u03BB\u03BB\u03AC\u03B4\u03B1 \u03A0\u03B1\u03BD\u03B5\u03BB\u03BB\u03B1\u03B4\u03B9\u03BA\u03AC" },
      { id: "el_athens", name: "\u{1F3DB}\uFE0F \u0391\u03B8\u03AE\u03BD\u03B1 & \u0391\u03C4\u03C4\u03B9\u03BA\u03AE" },
      { id: "el_thessaloniki", name: "\u{1F30A} \u0398\u03B5\u03C3\u03C3\u03B1\u03BB\u03BF\u03BD\u03AF\u03BA\u03B7 & \u0392\u03CC\u03C1\u03B5\u03B9\u03B1 \u0395\u03BB\u03BB\u03AC\u03B4\u03B1" },
      { id: "global", name: "\u{1F30D} \u0394\u03B9\u03B5\u03B8\u03BD\u03AE & \u039A\u03CC\u03C3\u03BC\u03BF\u03C2" }
    ]
  };
  var COMPREHENSIVE_NEWS_DATABASE = [
    // --- DEUTSCHLANDWEIT & THEMEN ---
    { id: "de_n1", loc: "de_all", category: "positive", tag: "\u{1F331} Nachhaltigkeit", time: "Vor 1 Std.", title: "Rekord: \xDCber 56% des Stroms im Bundesnetz aus erneuerbaren Quellen", summary: "Sonne und Windkraft erzielten im aktuellen Monat einen neuen Spitzenwert bei der sauberen Stromversorgung in Deutschland.", source: "Bundesnetz Monitor", lang: "de" },
    { id: "de_n2", loc: "de_all", category: "economy", tag: "\u{1F4BC} Wirtschaft", time: "Vor 2 Std.", title: "4-Tage-Woche-Studie in Deutschland zeigt: H\xF6here Produktivit\xE4t und Zufriedenheit", summary: "Nach 6 Monaten Pilotphase berichten 85% der teilnehmenden Firmen von stabilen Ums\xE4tzen bei signifikant geringerem Krankenstand.", source: "WirtschaftsWoche" },
    { id: "de_n3", loc: "de_all", category: "tech", tag: "\u{1F4A1} Innovation", time: "Vor 3 Std.", title: "Europ\xE4isches KI-Modell f\xFCr Medizin erreicht Weltklasse-Diagnostik", summary: "Ein Forschungsverbund stellt ein Open-Source-Modell vor, das MRT-Scans doppelt so schnell und pr\xE4zise auswertet.", source: "Tech Germany" },
    { id: "de_n4", loc: "de_all", category: "life", tag: "\u26A1 Fokus & Alltag", time: "Vor 4 Std.", title: "Die 90-Minuten-Regel: Warum Arbeitsbl\xF6cke den Flow revolutionieren", summary: "Kognitionswissenschaftler empfehlen, Konzentrationsphasen an biologische Ultradian-Rhythmen anzupassen.", source: "Mind & Focus" },
    { id: "de_n5", loc: "de_all", category: "science", tag: "\u{1F52D} Wissenschaft", time: "Vor 5 Std.", title: "Durchbruch bei Feststoff-Batterien: Doppelte Reichweite in Sicht", summary: "Materialforscher entwickeln eine keramische Schutzschicht, die Ladezeiten auf unter 10 Minuten verk\xFCrzt.", source: "Science Journal" },
    // --- BERLIN & BRANDENBURG ---
    { id: "ber_1", loc: "de_berlin", category: "local", tag: "\u{1F4CD} Berlin Lokal", time: "Vor 45 Min.", title: "Berlin baut 35 neue Fahrradstra\xDFen und gr\xFCne Quartiere aus", summary: "Der Senat beschlie\xDFt den beschleunigten Ausbau verkehrsberuhigter Zonen in Mitte, Kreuzberg und Charlottenburg.", source: "Berlin Tagesspiegel" },
    { id: "ber_2", loc: "de_berlin", category: "local", tag: "\u{1F3AD} Kultur & Stadt", time: "Vor 2 Std.", title: "Lange Nacht der Museen & Open-Air-Konzerte auf der Museumsinsel", summary: "\xDCber 75 Museen und historische St\xE4tten \xF6ffnen am Wochenende mit Sonderf\xFChrungen und Lichtinstallationen.", source: "RBB News" },
    { id: "ber_3", loc: "de_berlin", category: "economy", tag: "\u{1F4BC} Startup Hub", time: "Vor 4 Std.", title: "Berliner Startup-\xD6kosystem verzeichnet Rekord-Investitionen in Greentech", summary: "\xDCber 1,2 Milliarden Euro flossen in den letzten Monaten in nachhaltige Berliner Klimatechnologie-Unternehmen.", source: "Gr\xFCnderszene Berlin" },
    // --- MÜNCHEN & BAYERN ---
    { id: "muc_1", loc: "de_munich", category: "local", tag: "\u{1F4CD} M\xFCnchen Lokal", time: "Vor 1 Std.", title: "Neues 365-Euro-Ticket f\xFCr Azubis und Ausbau der U9-Stammstrecke", summary: "M\xFCnchen investiert massiv in den \xF6ffentlichen Nahverkehr und beschleunigt die Entlastung des Hauptbahnhofs.", source: "S\xFCddeutsche Zeitung" },
    { id: "muc_2", loc: "de_munich", category: "economy", tag: "\u{1F4BC} Tech & Forschung", time: "Vor 3 Std.", title: "M\xFCnchner Quantencomputing-Campus er\xF6ffnet internationales Exzellenzzentrum", summary: "Die TU M\xFCnchen und Partnerunternehmen weihen eines der fortschrittlichsten Quantenlabore Europas in Garching ein.", source: "Bayern Innovativ" },
    { id: "muc_3", loc: "de_munich", category: "positive", tag: "\u{1F332} Natur & Isar", time: "Vor 5 Std.", title: "Isar-Renaturierung erfolgreich: Seltene Tier- und Pflanzenarten kehren zur\xFCck", summary: "Der Abschluss der Flussbett-Sanierung s\xFCdlich von M\xFCnchen sorgt f\xFCr kristallklares Wasser und neue Naherholungsr\xE4ume.", source: "M\xFCnchner Merkur" },
    // --- HAMBURG & NORDDEUTSCHLAND ---
    { id: "ham_1", loc: "de_hamburg", category: "local", tag: "\u{1F4CD} Hamburg Lokal", time: "Vor 1 Std.", title: "Hamburger Hafen startet vollautomatisierte, emissionsfreie Wasserstoff-Schuten", summary: "Die Hansestadt setzt weltweit neue Ma\xDFst\xE4be f\xFCr klimaneutrale Binnenschifffahrt und saubere Hafenbecken.", source: "Hamburger Abendblatt" },
    { id: "ham_2", loc: "de_hamburg", category: "local", tag: "\u2693 Elbphilharmonie", time: "Vor 3 Std.", title: "Kostenlose Akustik-Konzerte auf dem Elbphilharmonie-Vorplatz begeistern Tausende", summary: "Ein neues Kulturprogramm verbindet klassische Orchesterkl\xE4nge mit modernen Ambient-Kl\xE4ngen direkt an der Elbe.", source: "NDR Kultur" },
    // --- NRW (KÖLN, DÜSSELDORF, RUHRGEBIET) ---
    { id: "nrw_1", loc: "de_nrw", category: "local", tag: "\u{1F4CD} NRW Lokal", time: "Vor 2 Std.", title: "Radschnellweg Ruhr (RS1) erh\xE4lt 20 neue Kilometer durchs Ruhrgebiet", summary: "Die direkte, kreuzungsfreie Verbindung zwischen Dortmund, Bochum und Essen wird f\xFCr Pendler weiter freigegeben.", source: "WDR Aktuell" },
    { id: "nrw_2", loc: "de_nrw", category: "economy", tag: "\u{1F3ED} Transformation", time: "Vor 4 Std.", title: "Duisburg weiht erste Direktreduktionsanlage f\xFCr gr\xFCnen Stahl ein", summary: "Ein historischer Schritt f\xFCr NRW: Industrieproduktion ohne CO2-Aussto\xDF geht in den regul\xE4ren Testbetrieb.", source: "Rheinische Post" },
    // --- FRANKFURT & HESSEN ---
    { id: "fra_1", loc: "de_frankfurt", category: "local", tag: "\u{1F4CD} Frankfurt Lokal", time: "Vor 1 Std.", title: "Frankfurter Gr\xFCng\xFCrtel wird um neue Uferpromenaden am Main erweitert", summary: "Mehr schattige Parkfl\xE4chen, Brunnen und Erholungszonen f\xFCr hei\xDFe Sommertage in der Innenstadt beschlossen.", source: "Frankfurter Allgemeine" },
    { id: "fra_2", loc: "de_frankfurt", category: "tech", tag: "\u{1F310} Data Capital", time: "Vor 3 Std.", title: "DE-CIX Frankfurt bricht weltweiten Datendurchsatz-Rekord bei 17 Tbit/s", summary: "Der weltgr\xF6\xDFte Internetknoten in Frankfurt meldet stabilen H\xF6chstbetrieb bei sinkendem Energieverbrauch.", source: "Hessen Digital" },
    // --- STUTTGART & BAWÜ ---
    { id: "str_1", loc: "de_stuttgart", category: "local", tag: "\u{1F4CD} Stuttgart Lokal", time: "Vor 2 Std.", title: "Stuttgarts neue Stadtbegr\xFCnung senkt Temperatur im Talkessel messbar", summary: "Vertikale G\xE4rten und bepflanzte D\xE4cher reduzieren Hitzestaus und verbessern das Mikroklima sp\xFCrbar.", source: "Stuttgarter Zeitung" },
    // --- LEIPZIG & DRESDEN ---
    { id: "lei_1", loc: "de_leipzig", category: "local", tag: "\u{1F4CD} Leipzig & Dresden", time: "Vor 2 Std.", title: "Silicon Saxony: Drei neue Halbleiter-Chipwerke sichern Tausende Zukunftsjobs", summary: "Der Raum Dresden-Leipzig baut seine Spitzenposition als Europas wichtigste Mikrochip-Region weiter aus.", source: "MDR Sachsen" },
    // --- WIEN & ÖSTERREICH ---
    { id: "vie_1", loc: "at_vienna", category: "local", tag: "\u{1F4CD} Wien Lokal", time: "Vor 1 Std.", title: "Wien erneut zur lebenswertesten Stadt der Welt gew\xE4hlt", summary: "\xD6ffentlicher Nahverkehr, soziale Wohnbauprojekte und gro\xDFfl\xE4chige Gr\xFCnzonen sichern Wien die weltweite Spitzenposition.", source: "Der Standard Wien" },
    { id: "vie_2", loc: "at_vienna", category: "positive", tag: "\u{1F1E6}\u{1F1F9} Alpen & Natur", time: "Vor 3 Std.", title: "\xD6sterreichischer Klimaticket-Erfolg: 300.000 aktive Nutzer im gesamten Bundesgebiet", summary: "Immer mehr Pendler steigen dauerhaft vom Auto auf die Bahn um \u2013 CO2-Einsparungen \xFCbertreffen alle Prognosen.", source: "ORF News" },
    // --- ZÜRICH & SCHWEIZ ---
    { id: "zrh_1", loc: "ch_zurich", category: "local", tag: "\u{1F4CD} Z\xFCrich Lokal", time: "Vor 1 Std.", title: "ETH Z\xFCrich entwickelt ultraleichte Solarzellen mit 32% Wirkungsgrad", summary: "Die neue Technologie kann flexibel auf Fassaden und Fenstern angebracht werden und liefert doppelte Energie.", source: "NZZ Z\xFCrich" },
    { id: "zrh_2", loc: "ch_zurich", category: "local", tag: "\u{1F1E8}\u{1F1ED} Z\xFCrichsee", time: "Vor 3 Std.", title: "Erweiterung des Seeuferwegs und neue solarbetriebene F\xE4hren auf dem Z\xFCrichsee", summary: "Z\xFCrich treibt die CO2-freie Seeschifffahrt voran und schafft durchgehende Fu\xDFg\xE4nger- und Fahrradwege.", source: "Tages-Anzeiger" },
    // --- GLOBAL (ENGLISH & INTERNATIONAL) ---
    { id: "gl_1", loc: "global", category: "positive", tag: "\u{1F331} Global Eco", time: "1h ago", title: "Global Milestone: Over 40% of World Electricity Now Powered by Renewables", summary: "Clean energy generation achieved a historic quarterly milestone across major international grids.", source: "Global Green Monitor", lang: "en" },
    { id: "gl_2", loc: "global", category: "tech", tag: "\u{1F4A1} AI & Tech", time: "2h ago", title: "New Optical Microchips Process Data at the Speed of Light with 90% Less Energy", summary: "Photonic computing reaches commercial testing, promising massive breakthroughs for everyday computers.", source: "Tech Frontiers", lang: "en" },
    { id: "gl_3", loc: "global", category: "life", tag: "\u26A1 Productivity", time: "3h ago", title: "Deep Work Research: How Calmer Workspaces Double Creative Problem Solving", summary: "Limiting continuous notifications and establishing rhythmic focus sprints protects long-term cognitive health.", source: "Harvard Productivity Review", lang: "en" },
    { id: "gl_4", loc: "global", category: "science", tag: "\u{1F52D} Astronomy", time: "4h ago", title: "James Webb Telescope Maps Potential Ocean World in Nearby Star System", summary: "Atmospheric spectroscopy reveals signatures of deep liquid water beneath protective cloud layers.", source: "Astro Journal", lang: "en" },
    // --- LONDON & UK ---
    { id: "lon_1", loc: "en_london", category: "local", tag: "\u{1F4CD} London Local", time: "1h ago", title: "London Expands Ultra-Low Emission Zones and Green Bus Fleets", summary: "Air quality in central London hits its highest cleanliness scores in over four decades.", source: "Evening Standard", lang: "en" },
    { id: "lon_2", loc: "en_london", category: "economy", tag: "\u{1F4BC} FinTech", time: "3h ago", title: "Tech City Hub Welcomes 120 Sustainable AI Startups in East London", summary: "New venture incubator launches to support ethical computing and green technology.", source: "London Tech Daily", lang: "en" },
    // --- NEW YORK & US ---
    { id: "ny_1", loc: "en_ny", category: "local", tag: "\u{1F4CD} NYC Local", time: "1h ago", title: "High Line Expansion: New Elevated Green Corridor Opens to the Public", summary: "The iconic park connects Hudson Yards directly with Manhattan West with native flora and seating.", source: "NY Times Local", lang: "en" },
    { id: "ny_2", loc: "en_ny", category: "tech", tag: "\u{1F4A1} Innovation", time: "3h ago", title: "Brooklyn Tech Triangle Launches Urban Farming and Solar Roof Network", summary: "Rooftop gardens across DUMBO and Downtown Brooklyn will supply local community markets.", source: "NYC Daily News", lang: "en" },
    // --- PARIS & FRANCE ---
    { id: "par_1", loc: "fr_paris", category: "local", tag: "\u{1F4CD} Paris Local", time: "Il y a 1h", title: "Paris p\xE9rennise 60 km de nouvelles pistes cyclables et espaces pi\xE9tons", summary: "La capitale poursuit sa transformation urbaine avec de nouvelles rues v\xE9g\xE9talis\xE9es.", source: "Le Parisien", lang: "fr" },
    { id: "fr_1", loc: "fr_all", category: "positive", tag: "\u{1F331} \xC9cologie", time: "Il y a 2h", title: "Production d'\xE9nergie propre record en France gr\xE2ce aux parcs \xE9oliens et solaires", summary: "Les \xE9nergies renouvelables couvrent d\xE9sormais une part historique des besoins nationaux.", source: "Le Figaro", lang: "fr" },
    // --- ROMA & MILANO (ITALIA) ---
    { id: "it_1", loc: "it_all", category: "positive", tag: "\u{1F331} Sostenibilit\xE0", time: "1 ora fa", title: "Italia: raddoppiano gli investimenti nei treni ad alta velocit\xE0 ecologici", summary: "Nuovi collegamenti veloci riducono l'uso di aerei e automobili in tutta la penisola.", source: "Corriere della Sera", lang: "it" },
    { id: "rom_1", loc: "it_rome", category: "local", tag: "\u{1F4CD} Roma Locale", time: "2 ore fa", title: "Roma inaugura il nuovo anello verde ciclabile attorno ai Fori Imperiali", summary: "Nuovi percorsi dedicati alla mobilit\xE0 dolce valorizzano il patrimonio storico.", source: "La Repubblica Roma", lang: "it" },
    // --- MADRID & BARCELONA (ESPAÑA) ---
    { id: "es_1", loc: "es_all", category: "positive", tag: "\u{1F331} Sostenibilidad", time: "Hace 1h", title: "Espa\xF1a lidera la producci\xF3n de energ\xEDa solar en el sur de Europa", summary: "Las plantas solares proporcionan m\xE1s del 50% de la demanda en las horas centrales del d\xEDa.", source: "El Pa\xEDs", lang: "es" },
    { id: "mad_1", loc: "es_madrid", category: "local", tag: "\u{1F4CD} Madrid Local", time: "Hace 2h", title: "Madrid R\xEDo ampl\xEDa sus zonas arboladas y fuentes de agua p\xFAblica", summary: "Nuevos espacios de sombra y recreo se incorporan a lo largo del curso del r\xEDo Manzanares.", source: "El Mundo Madrid", lang: "es" },
    // --- ATHENS & THESSALONIKI (GREECE) ---
    { id: "el_1", loc: "el_all", category: "positive", tag: "\u{1F331} \u0392\u03B9\u03C9\u03C3\u03B9\u03BC\u03CC\u03C4\u03B7\u03C4\u03B1", time: "\u03A0\u03C1\u03B9\u03BD 1 \u03CE\u03C1\u03B1", title: "\u0399\u03C3\u03C4\u03BF\u03C1\u03B9\u03BA\u03CC \u03C1\u03B5\u03BA\u03CC\u03C1 \u03C0\u03C1\u03AC\u03C3\u03B9\u03BD\u03B7\u03C2 \u03B5\u03BD\u03AD\u03C1\u03B3\u03B5\u03B9\u03B1\u03C2 \u03C3\u03C4\u03B7\u03BD \u0395\u03BB\u03BB\u03AC\u03B4\u03B1 \u03B1\u03C0\u03CC \u03B1\u03B9\u03BF\u03BB\u03B9\u03BA\u03AC \u03BA\u03B1\u03B9 \u03C6\u03C9\u03C4\u03BF\u03B2\u03BF\u03BB\u03C4\u03B1\u03CA\u03BA\u03AC", summary: "\u039F\u03B9 \u03B1\u03BD\u03B1\u03BD\u03B5\u03CE\u03C3\u03B9\u03BC\u03B5\u03C2 \u03C0\u03B7\u03B3\u03AD\u03C2 \u03BA\u03AC\u03BB\u03C5\u03C8\u03B1\u03BD \u03C0\u03AC\u03BD\u03C9 \u03B1\u03C0\u03CC \u03C4\u03BF 60% \u03C4\u03C9\u03BD \u03B1\u03BD\u03B1\u03B3\u03BA\u03CE\u03BD \u03C3\u03B5 \u03CE\u03C1\u03B5\u03C2 \u03B1\u03B9\u03C7\u03BC\u03AE\u03C2.", source: "\u0397 \u039A\u03B1\u03B8\u03B7\u03BC\u03B5\u03C1\u03B9\u03BD\u03AE", lang: "el" },
    { id: "ath_1", loc: "el_athens", category: "local", tag: "\u{1F4CD} \u0391\u03B8\u03AE\u03BD\u03B1 \u03A4\u03BF\u03C0\u03B9\u03BA\u03AC", time: "\u03A0\u03C1\u03B9\u03BD 2 \u03CE\u03C1\u03B5\u03C2", title: "\u0391\u03BD\u03AC\u03C0\u03BB\u03B1\u03C3\u03B7 \u03BA\u03B1\u03B9 \u03B4\u03B7\u03BC\u03B9\u03BF\u03C5\u03C1\u03B3\u03AF\u03B1 \u03BD\u03AD\u03C9\u03BD \u03C0\u03AC\u03C1\u03BA\u03C9\u03BD \u03C4\u03C3\u03AD\u03C0\u03B7\u03C2 \u03C3\u03C4\u03BF \u03BA\u03AD\u03BD\u03C4\u03C1\u03BF \u03C4\u03B7\u03C2 \u0391\u03B8\u03AE\u03BD\u03B1\u03C2", summary: "\u03A0\u03B5\u03C1\u03B9\u03C3\u03C3\u03CC\u03C4\u03B5\u03C1\u03BF \u03C0\u03C1\u03AC\u03C3\u03B9\u03BD\u03BF \u03BA\u03B1\u03B9 \u03B4\u03C1\u03BF\u03C3\u03B9\u03AC \u03C3\u03B5 \u03B3\u03B5\u03B9\u03C4\u03BF\u03BD\u03B9\u03AD\u03C2 \u03C4\u03B7\u03C2 \u03C0\u03CC\u03BB\u03B7\u03C2.", source: "Athens Voice", lang: "el" }
  ];
  function getAvailableLocationsForLang() {
    const lang = typeof currentLang !== "undefined" ? currentLang : "en";
    return NEWS_LOCATIONS[lang] || NEWS_LOCATIONS.en || NEWS_LOCATIONS.de;
  }
  function renderNewsBriefing2() {
    const container = document.getElementById("news-content-area");
    const locSelect = document.getElementById("news-location-select");
    if (!container) return;
    const lang = typeof currentLang !== "undefined" ? currentLang : "en";
    if (locSelect) {
      const locOptions = getAvailableLocationsForLang();
      const currentLocExists = locOptions.some((l) => l.id === currentNewsLocation);
      if (!currentLocExists) {
        currentNewsLocation = locOptions[0].id;
        localStorage.setItem("flow_news_loc", currentNewsLocation);
      }
      locSelect.innerHTML = locOptions.map((l) => `
      <option value="${l.id}" ${l.id === currentNewsLocation ? "selected" : ""}>${l.name}</option>
    `).join("");
    }
    let articles = COMPREHENSIVE_NEWS_DATABASE.filter((item2) => {
      if (currentNewsCategory === "bookmarked") {
        return bookmarkedNews.includes(item2.id);
      }
      const matchesLoc = currentNewsLocation === "global" ? true : item2.loc === currentNewsLocation || currentNewsLocation.startsWith("de_") && item2.loc === "de_all" || item2.loc === "global";
      const matchesCat = currentNewsCategory === "all" ? true : item2.category === currentNewsCategory;
      const matchesSearch = !newsSearchKeyword || item2.title.toLowerCase().includes(newsSearchKeyword.toLowerCase()) || item2.summary.toLowerCase().includes(newsSearchKeyword.toLowerCase()) || item2.tag.toLowerCase().includes(newsSearchKeyword.toLowerCase());
      return matchesLoc && matchesCat && matchesSearch;
    });
    if (articles.length === 0) {
      const isBookmarkedView = currentNewsCategory === "bookmarked";
      container.innerHTML = `
      <div class="py-10 text-center text-gray-400 space-y-2">
        <div class="text-2xl">${isBookmarkedView ? "\u{1F516}" : "\u{1F50D}"}</div>
        <div class="text-xs font-semibold text-gray-300">
          ${isBookmarkedView ? tr({ de: "Noch keine gemerkten Artikel vorhanden.", en: "No bookmarked articles yet.", fr: "Aucun article enregistr\xE9.", it: "Nessun articolo salvato.", es: "Sin art\xEDculos guardados.", el: "\u0394\u03B5\u03BD \u03C5\u03C0\u03AC\u03C1\u03C7\u03BF\u03C5\u03BD \u03B1\u03C0\u03BF\u03B8\u03B7\u03BA\u03B5\u03C5\u03BC\u03AD\u03BD\u03B1 \u03AC\u03C1\u03B8\u03C1\u03B1." }) : tr({ de: "Keine Nachrichten f\xFCr diesen Filter gefunden.", en: "No news found for this filter.", fr: "Aucune actualit\xE9 trouv\xE9e.", it: "Nessuna notizia trovata.", es: "No se encontraron noticias.", el: "\u0394\u03B5\u03BD \u03B2\u03C1\u03AD\u03B8\u03B7\u03BA\u03B1\u03BD \u03B5\u03B9\u03B4\u03AE\u03C3\u03B5\u03B9\u03C2." })}
        </div>
        <p class="text-[10px] text-gray-500">
          ${isBookmarkedView ? tr({ de: "Tippe auf das Lesezeichen-Symbol bei Artikeln, um sie hier zu speichern.", en: "Click the bookmark icon on any article to save it here." }) : tr({ de: "W\xE4hle eine andere Kategorie oder setze den Suchbegriff zur\xFCck.", en: "Try selecting another category or clear your search query." })}
        </p>
      </div>
    `;
      return;
    }
    container.innerHTML = articles.map((item2) => {
      const isBookmarked = bookmarkedNews.includes(item2.id);
      return `
      <article class="p-3 bg-black/40 hover:bg-white/[0.04] border border-white/5 hover:border-amber-500/30 rounded-2xl transition flex flex-col gap-1.5 group">
        <div class="flex items-center justify-between text-[9px] font-mono text-gray-400">
          <span class="px-2 py-0.5 rounded-md bg-white/5 text-amber-300 font-semibold border border-white/5 flex items-center gap-1">
            ${item2.tag}
          </span>
          <div class="flex items-center gap-2">
            <span>${item2.time}</span>
            <button onclick="toggleBookmarkNews('${item2.id}', event)" class="hover:text-amber-400 transition cursor-pointer p-1" title="Artikel merken">
              <i data-lucide="${isBookmarked ? "bookmark-check" : "bookmark"}" class="w-3.5 h-3.5 ${isBookmarked ? "text-amber-400 fill-amber-400/20" : "text-gray-500"}"></i>
            </button>
          </div>
        </div>
        <h5 class="text-xs font-bold text-white group-hover:text-amber-200 transition leading-snug">${item2.title}</h5>
        <p class="text-[11px] text-gray-300 leading-relaxed">${item2.summary}</p>
        <div class="flex items-center justify-between text-[8px] text-gray-500 font-mono pt-1 border-t border-white/5">
          <span>Quelle: ${item2.source}</span>
          <span class="text-gray-600">${item2.loc.replace("de_", "").replace("en_", "").toUpperCase()}</span>
        </div>
      </article>
    `;
    }).join("");
    renderLucideIcons();
  }
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      if (document.getElementById("weather-content-area")) {
        fetchLocalWeather2();
      }
      if (document.getElementById("news-content-area")) {
        renderNewsBriefing2();
      }
    }, 1e3);
  });

  // app-dice.js
  var isDiceRolling = false;
  var currentDiceColumn = null;
  var currentDiceWinner = null;
  var diceTickInterval = null;
  function rollTaskDice(columnId, event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (isDiceRolling) return;
    currentDiceColumn = columnId;
    const rawItems = state?.items?.[columnId] || [];
    const tasks = rawItems.map((item2, idx) => {
      const text = typeof item2 === "object" ? item2.task : item2;
      return text ? { index: idx, text: String(text).trim(), category: columnId } : null;
    }).filter(Boolean);
    if (tasks.length === 0) {
      const emptyMsg = {
        de: "Keine Aufgaben in dieser Liste zum Ausw\xFCrfeln \u{1F3B2}",
        en: "No tasks in this list to roll \u{1F3B2}",
        es: "No hay tareas en esta lista para tirar \u{1F3B2}",
        fr: "Aucune t\xE2che dans cette liste \xE0 tirer au sort \u{1F3B2}",
        it: "Nessuna attivit\xE0 in questa lista da sorteggiare \u{1F3B2}",
        el: "\u0394\u03B5\u03BD \u03C5\u03C0\u03AC\u03C1\u03C7\u03BF\u03C5\u03BD \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B5\u03C2 \u03C3\u03B5 \u03B1\u03C5\u03C4\u03AE\u03BD \u03C4\u03B7 \u03BB\u03AF\u03C3\u03C4\u03B1 \u03B3\u03B9\u03B1 \u03B6\u03AC\u03C1\u03B9 \u{1F3B2}"
      }[currentLang] || "No tasks in this list to roll \u{1F3B2}";
      showToast(emptyMsg);
      return;
    }
    ensureDiceModalExists();
    const modal = document.getElementById("task-dice-modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    isDiceRolling = true;
    const catName = typeof t === "function" ? t(columnId) : columnId.toUpperCase();
    const catBadge = document.getElementById("dice-modal-category-badge");
    if (catBadge) catBadge.innerText = catName;
    const diceCube = document.getElementById("dice-3d-visual");
    if (diceCube) {
      diceCube.classList.remove("dice-winner-pulse");
      diceCube.classList.add("dice-spinning-fast");
    }
    const resultArea = document.getElementById("dice-result-container");
    const actionArea = document.getElementById("dice-actions-container");
    const rouletteViewport = document.getElementById("dice-roulette-viewport");
    const reel = document.getElementById("dice-roulette-reel");
    if (resultArea) resultArea.classList.add("hidden");
    if (actionArea) actionArea.classList.add("hidden");
    if (rouletteViewport) rouletteViewport.classList.remove("hidden");
    const winnerIndex = Math.floor(Math.random() * tasks.length);
    currentDiceWinner = tasks[winnerIndex];
    const cycleCount = Math.max(5, Math.ceil(24 / tasks.length));
    let reelItemsHTML = "";
    const totalItems = [];
    for (let c = 0; c < cycleCount; c++) {
      tasks.forEach((taskObj) => {
        totalItems.push(taskObj);
      });
    }
    const targetReelIndex = (cycleCount - 2) * tasks.length + winnerIndex;
    totalItems.forEach((item2, idx) => {
      const isTarget = idx === targetReelIndex;
      reelItemsHTML += `
      <div class="dice-reel-item h-[68px] flex items-center justify-center px-4 py-2 my-1.5 rounded-2xl bg-white/[0.04] border border-white/10 transition-all duration-300 select-none ${isTarget ? "target-winner" : ""}">
        <div class="flex items-center gap-2.5 max-w-full truncate">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400/80 shrink-0 shadow-xs"></span>
          <span class="text-sm font-semibold text-gray-100 truncate font-display">${escapeHtml(item2.text)}</span>
        </div>
      </div>
    `;
    });
    if (reel) {
      reel.style.transition = "none";
      reel.style.transform = "translateY(0px)";
      reel.innerHTML = reelItemsHTML;
    }
    playDiceSpinAudio();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!reel) return;
        const itemHeight = 68 + 12;
        const finalTranslateY = -(targetReelIndex * itemHeight) + itemHeight * 1;
        reel.style.transition = "transform 3.4s cubic-bezier(0.12, 0.85, 0.28, 1)";
        reel.style.transform = `translateY(${finalTranslateY}px)`;
        setTimeout(() => {
          finishDiceRoll(currentDiceWinner);
        }, 3450);
      });
    });
  }
  function playDiceSpinAudio() {
    let tickCount = 0;
    const maxTicks = 18;
    function nextTick() {
      if (!isDiceRolling || tickCount >= maxTicks) return;
      if (typeof playTactileClickSound === "function") {
        try {
          playTactileClickSound();
        } catch (e) {
          console.warn("[Dice] playTactileClickSound warning:", e);
        }
      }
      tickCount++;
      const nextDelay = 70 + Math.pow(tickCount / maxTicks, 2) * 260;
      diceTickInterval = setTimeout(nextTick, nextDelay);
    }
    nextTick();
  }
  function finishDiceRoll(winnerTask) {
    isDiceRolling = false;
    if (diceTickInterval) clearTimeout(diceTickInterval);
    const diceCube = document.getElementById("dice-3d-visual");
    if (diceCube) {
      diceCube.classList.remove("dice-spinning-fast");
      diceCube.classList.add("dice-winner-pulse");
    }
    if (typeof playProceduralSound === "function") {
      try {
        playProceduralSound(0);
      } catch (e) {
        console.warn("[Dice] playProceduralSound warning:", e);
      }
    } else if (typeof playRhodesChime === "function") {
      try {
        playRhodesChime();
      } catch (e) {
        console.warn("[Dice] playRhodesChime warning:", e);
      }
    }
    const resultArea = document.getElementById("dice-result-container");
    const actionArea = document.getElementById("dice-actions-container");
    const resultText = document.getElementById("dice-winner-task-text");
    if (resultText && winnerTask) {
      resultText.innerText = winnerTask.text;
    }
    if (resultArea) {
      resultArea.classList.remove("hidden");
      resultArea.classList.add("animate-scale-up");
    }
    if (actionArea) {
      actionArea.classList.remove("hidden");
      actionArea.classList.add("animate-fade-in");
    }
    if (typeof renderLucideIcons === "function") renderLucideIcons();
  }
  function startDiceWinnerTimer() {
    if (!currentDiceWinner) return;
    const taskText = currentDiceWinner.text;
    const cat = currentDiceWinner.category;
    closeDiceModal2();
    if (typeof startZenWithTask === "function") {
      startZenWithTask(taskText, cat);
    } else {
      activeTimerTask = taskText;
      if (typeof updateActiveTimerLabels === "function") updateActiveTimerLabels();
      if (typeof startTimer === "function") startTimer();
      showToast(tr({
        de: `Timer gestartet f\xFCr: "${taskText}" \u26A1`,
        en: `Timer started for: "${taskText}" \u26A1`,
        es: `Temporizador iniciado para: "${taskText}" \u26A1`,
        fr: `Minuteur d\xE9marr\xE9 pour : "${taskText}" \u26A1`,
        it: `Timer avviato per: "${taskText}" \u26A1`,
        el: `\u03A4\u03BF \u03C7\u03C1\u03BF\u03BD\u03CC\u03BC\u03B5\u03C4\u03C1\u03BF \u03BE\u03B5\u03BA\u03AF\u03BD\u03B7\u03C3\u03B5 \u03B3\u03B9\u03B1: "${taskText}" \u26A1`
      }));
    }
  }
  function completeDiceWinnerTask() {
    if (!currentDiceWinner) return;
    const cat = currentDiceWinner.category;
    const idx = currentDiceWinner.index;
    if (typeof handleCompleteTask === "function") {
      handleCompleteTask(cat, idx);
    }
    closeDiceModal2();
    if (typeof renderApp === "function") renderApp();
    showToast(tr({
      de: "Aufgabe erfolgreich erledigt! \u{1F389}",
      en: "Task completed successfully! \u{1F389}",
      es: "\xA1Tarea completada con \xE9xito! \u{1F389}",
      fr: "T\xE2che termin\xE9e avec succ\xE8s ! \u{1F389}",
      it: "Attivit\xE0 completata con successo! \u{1F389}",
      el: "\u0397 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1 \u03BF\u03BB\u03BF\u03BA\u03BB\u03B7\u03C1\u03CE\u03B8\u03B7\u03BA\u03B5 \u03BC\u03B5 \u03B5\u03C0\u03B9\u03C4\u03C5\u03C7\u03AF\u03B1! \u{1F389}"
    }));
  }
  function closeDiceModal2() {
    if (diceTickInterval) clearTimeout(diceTickInterval);
    isDiceRolling = false;
    const modal = document.getElementById("task-dice-modal");
    if (modal) modal.classList.add("hidden");
  }
  function ensureDiceModalExists() {
    if (document.getElementById("task-dice-modal")) return;
    const modalHtml = `
    <div id="task-dice-modal" class="hidden fixed inset-0 z-[120000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div class="w-full max-w-md bg-[#111118]/98 border border-amber-500/30 rounded-3xl p-5 md:p-6 shadow-2xl backdrop-blur-2xl flex flex-col items-center gap-4 text-center relative overflow-hidden">
        
        <!-- Ambient Glow FX -->
        <div class="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-amber-500/15 blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-purple-500/15 blur-3xl pointer-events-none"></div>

        <!-- Schlie\xDFen Button -->
        <button onclick="closeDiceModal()" class="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg transition cursor-pointer text-lg font-bold">\u2715</button>

        <!-- Top Header & 3D W\xFCrfel Badge -->
        <div class="flex flex-col items-center gap-2 pt-1">
          <div class="flex items-center gap-2">
            <div id="dice-3d-visual" class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 border border-amber-300/40 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/25 text-xl">
              \u{1F3B2}
            </div>
            <div class="text-left">
              <h3 class="text-base font-bold font-display text-white flex items-center gap-1.5">
                <span data-i18n="dice_title">Schicksals-W\xFCrfel</span>
                <span id="dice-modal-category-badge" class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold tracking-wider uppercase">HEUTE</span>
              </h3>
              <p class="text-[11px] text-gray-400" data-i18n="dice_subtitle">Der Zufall entscheidet deinen n\xE4chsten Fokus-Schritt</p>
            </div>
          </div>
        </div>

        <!-- Slot-Machine Roulette Viewport -->
        <div id="dice-roulette-viewport" class="w-full relative h-[180px] overflow-hidden rounded-2xl bg-black/40 border border-white/10 shadow-inner">
          <!-- Top & Bottom Glass Fade Masks -->
          <div class="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#111118] via-[#111118]/80 to-transparent z-10 pointer-events-none"></div>
          <div class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#111118] via-[#111118]/80 to-transparent z-10 pointer-events-none"></div>
          
          <!-- Center Winner Indicator Line -->
          <div class="absolute top-1/2 left-2 right-2 -translate-y-1/2 h-[72px] rounded-2xl border-2 border-amber-400/70 bg-amber-500/10 shadow-[0_0_20px_rgba(251,191,36,0.25)] pointer-events-none z-10"></div>

          <!-- Rolling Reel List -->
          <div id="dice-roulette-reel" class="flex flex-col px-3 py-10 will-change-transform"></div>
        </div>

        <!-- Winner Card Container (wird nach Stopp eingeblendet) -->
        <div id="dice-result-container" class="hidden w-full p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-purple-500/10 to-transparent border border-amber-400/40 shadow-lg">
          <div class="text-[10px] text-amber-300 font-bold uppercase tracking-widest font-mono mb-1">\u{1F3AF} Dein n\xE4chster Schritt:</div>
          <div id="dice-winner-task-text" class="text-lg md:text-xl font-bold font-display text-white break-words py-1 leading-snug">...</div>
        </div>

        <!-- Action Controls -->
        <div id="dice-actions-container" class="hidden w-full flex flex-col gap-2 pt-1">
          <button onclick="startDiceWinnerTimer()" class="w-full py-3 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-98">
            <i data-lucide="play" class="w-4 h-4 text-emerald-300"></i>
            <span data-i18n="dice_start_focus">Jetzt anpacken (Fokus-Timer) \u26A1</span>
          </button>

          <div class="grid grid-cols-2 gap-2">
            <button onclick="rollTaskDice(currentDiceColumn)" class="py-2.5 px-3 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer">
              <i data-lucide="rotate-cw" class="w-3.5 h-3.5"></i>
              <span data-i18n="dice_reroll">Nochmal w\xFCrfeln \u{1F3B2}</span>
            </button>
            <button onclick="completeDiceWinnerTask()" class="py-2.5 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer">
              <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
              <span data-i18n="dice_complete">Erledigt abhaken \u2713</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
    if (typeof renderLucideIcons === "function") renderLucideIcons();
  }
  window.rollTaskDice = rollTaskDice;
  window.closeDiceModal = closeDiceModal2;
  window.startDiceWinnerTimer = startDiceWinnerTimer;
  window.completeDiceWinnerTask = completeDiceWinnerTask;

  // app-core.js
  window.addEventListener("error", (event) => {
    console.warn("[Flow Global Error Boundary Guard]", event.error || event.message);
  });
  window.addEventListener("unhandledrejection", (event) => {
    console.warn("[Flow Unhandled Promise Guard]", event.reason);
  });
  var selectedCalendarDate2 = null;
  var INSPIRATION_SAYINGS = {
    de: [
      "Du musst eine Aufgabe nicht perfekt machen. Sie unvollst\xE4ndig zu erledigen, ist unendlich viel besser, als sie gar nicht zu tun.",
      "Wenn dir der Anfang schwerf\xE4llt, nimm dir vor, nur eine einzige Minute daran zu arbeiten. Danach darfst du jederzeit aufh\xF6ren.",
      "Dein Gehirn ist ein Prozessor, kein Datenspeicher. Schreib den Gedanken auf, um wertvollen Arbeitsspeicher im Kopf freizugeben.",
      "Manchmal ist eine Pause kein Luxus, sondern eine notwendige Wartung deines Systems. G\xF6nne dir diesen Moment ohne Schuldgef\xFChle.",
      "Fehlentscheidungen sind nur Datenpunkte. Sie zeigen dir, was nicht funktioniert, und helfen dir, deinen Weg feinzujustieren."
    ],
    en: [
      "You don't have to do a task perfectly. Doing it incompletely is infinitely better than not doing it at all.",
      "If starting feels hard, plan to work on it for just one minute. You can stop at any time after that.",
      "Your brain is a storage device. Write thoughts down to free up valuable memory in your head.",
      "Sometimes a break isn't a luxury, but a necessary maintenance of your system. Enjoy this moment guilt-free.",
      "Mistakes are simply data points. They show you what doesn't work and help you fine-tune your own path."
    ],
    es: [
      "No tienes que hacer una tarea a la perfecci\xF3n. Hacerla de forma incompleta es infinitamente mejor que no hacerla en absoluto.",
      "Si empezar te cuesta, plant\xE9ate trabajar solo un minuto en ello. Despu\xE9s puedes parar cuando quieras.",
      "Tu cerebro es un procesador, no un almac\xE9n de datos. Escribe tus pensamientos para liberar memoria valiosa en tu mente.",
      "A veces un descanso no es un lujo, sino un mantenimiento necesario de tu sistema. Date ese momento sin sentir culpa.",
      "Los errores son solo datos. Te muestran qu\xE9 no funciona y te ayudan a ajustar tu propio camino."
    ],
    el: [
      "\u0394\u03B5\u03BD \u03C7\u03C1\u03B5\u03B9\u03AC\u03B6\u03B5\u03C4\u03B1\u03B9 \u03BD\u03B1 \u03BA\u03AC\u03BD\u03B5\u03B9\u03C2 \u03BC\u03B9\u03B1 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1 \u03C4\u03AD\u03BB\u03B5\u03B9\u03B1. \u03A4\u03BF \u03BD\u03B1 \u03C4\u03B7\u03BD \u03BA\u03AC\u03BD\u03B5\u03B9\u03C2 \u03B7\u03BC\u03B9\u03C4\u03B5\u03BB\u03AE \u03B5\u03AF\u03BD\u03B1\u03B9 \u03B1\u03C0\u03B5\u03AF\u03C1\u03C9\u03C2 \u03BA\u03B1\u03BB\u03CD\u03C4\u03B5\u03C1\u03BF \u03B1\u03C0\u03CC \u03C4\u03BF \u03BD\u03B1 \u03BC\u03B7\u03BD \u03C4\u03B7\u03BD \u03BA\u03AC\u03BD\u03B5\u03B9\u03C2 \u03BA\u03B1\u03B8\u03CC\u03BB\u03BF\u03C5.",
      "\u0391\u03BD \u03C4\u03BF \u03BE\u03B5\u03BA\u03AF\u03BD\u03B7\u03BC\u03B1 \u03C3\u03BF\u03C5 \u03C6\u03B1\u03AF\u03BD\u03B5\u03C4\u03B1\u03B9 \u03B4\u03CD\u03C3\u03BA\u03BF\u03BB\u03BF, \u03C3\u03BA\u03AD\u03C8\u03BF\u03C5 \u03BD\u03B1 \u03B4\u03BF\u03C5\u03BB\u03AD\u03C8\u03B5\u03B9\u03C2 \u03C0\u03AC\u03BD\u03C9 \u03C4\u03B7\u03C2 \u03BC\u03CC\u03BD\u03BF \u03B3\u03B9\u03B1 \u03AD\u03BD\u03B1 \u03BB\u03B5\u03C0\u03C4\u03CC. \u039C\u03B5\u03C4\u03AC \u03BC\u03C0\u03BF\u03C1\u03B5\u03AF\u03C2 \u03BD\u03B1 \u03C3\u03C4\u03B1\u03BC\u03B1\u03C4\u03AE\u03C3\u03B5\u03B9\u03C2 \u03CC\u03C0\u03BF\u03C4\u03B5 \u03B8\u03AD\u03BB\u03B5\u03B9\u03C2.",
      "\u039F \u03B5\u03B3\u03BA\u03AD\u03C6\u03B1\u03BB\u03CC\u03C2 \u03C3\u03BF\u03C5 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03B5\u03C0\u03B5\u03BE\u03B5\u03C1\u03B3\u03B1\u03C3\u03C4\u03AE\u03C2, \u03CC\u03C7\u03B9 \u03B1\u03C0\u03BF\u03B8\u03B7\u03BA\u03B5\u03C5\u03C4\u03B9\u03BA\u03CC\u03C2 \u03C7\u03CE\u03C1\u03BF\u03C2. \u0393\u03C1\u03AC\u03C8\u03B5 \u03C4\u03B9\u03C2 \u03C3\u03BA\u03AD\u03C8\u03B5\u03B9\u03C2 \u03C3\u03BF\u03C5 \u03B3\u03B9\u03B1 \u03BD\u03B1 \u03B5\u03BB\u03B5\u03C5\u03B8\u03B5\u03C1\u03CE\u03C3\u03B5\u03B9\u03C2 \u03C0\u03BF\u03BB\u03CD\u03C4\u03B9\u03BC\u03B7 \u03BC\u03BD\u03AE\u03BC\u03B7 \u03C3\u03C4\u03BF \u03BC\u03C5\u03B1\u03BB\u03CC \u03C3\u03BF\u03C5.",
      "\u039C\u03B5\u03C1\u03B9\u03BA\u03AD\u03C2 \u03C6\u03BF\u03C1\u03AD\u03C2 \u03AD\u03BD\u03B1 \u03B4\u03B9\u03AC\u03BB\u03B5\u03B9\u03BC\u03BC\u03B1 \u03B4\u03B5\u03BD \u03B5\u03AF\u03BD\u03B1\u03B9 \u03C0\u03BF\u03BB\u03C5\u03C4\u03AD\u03BB\u03B5\u03B9\u03B1, \u03B1\u03BB\u03BB\u03AC \u03B1\u03C0\u03B1\u03C1\u03B1\u03AF\u03C4\u03B7\u03C4\u03B7 \u03C3\u03C5\u03BD\u03C4\u03AE\u03C1\u03B7\u03C3\u03B7 \u03C4\u03BF\u03C5 \u03C3\u03C5\u03C3\u03C4\u03AE\u03BC\u03B1\u03C4\u03CC\u03C2 \u03C3\u03BF\u03C5. \u03A7\u03AC\u03C1\u03B9\u03C3\u03B5 \u03C3\u03C4\u03BF\u03BD \u03B5\u03B1\u03C5\u03C4\u03CC \u03C3\u03BF\u03C5 \u03B1\u03C5\u03C4\u03AE \u03C4\u03B7 \u03C3\u03C4\u03B9\u03B3\u03BC\u03AE \u03C7\u03C9\u03C1\u03AF\u03C2 \u03B5\u03BD\u03BF\u03C7\u03AD\u03C2.",
      "\u03A4\u03B1 \u03BB\u03AC\u03B8\u03B7 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03B1\u03C0\u03BB\u03CE\u03C2 \u03B4\u03B5\u03B4\u03BF\u03BC\u03AD\u03BD\u03B1. \u03A3\u03BF\u03C5 \u03B4\u03B5\u03AF\u03C7\u03BD\u03BF\u03C5\u03BD \u03C4\u03B9 \u03B4\u03B5\u03BD \u03BB\u03B5\u03B9\u03C4\u03BF\u03C5\u03C1\u03B3\u03B5\u03AF \u03BA\u03B1\u03B9 \u03C3\u03B5 \u03B2\u03BF\u03B7\u03B8\u03BF\u03CD\u03BD \u03BD\u03B1 \u03B2\u03B5\u03BB\u03C4\u03B9\u03CE\u03C3\u03B5\u03B9\u03C2 \u03C4\u03BF\u03BD \u03B4\u03B9\u03BA\u03CC \u03C3\u03BF\u03C5 \u03B4\u03C1\u03CC\u03BC\u03BF."
    ],
    fr: [
      "Tu n'as pas besoin de faire une t\xE2che \xE0 la perfection. La faire de fa\xE7on incompl\xE8te est infiniment mieux que ne pas la faire du tout.",
      "Si commencer te semble difficile, pr\xE9vois de n'y travailler qu'une seule minute. Ensuite, tu peux t'arr\xEAter \xE0 tout moment.",
      "Ton cerveau est un processeur, pas un espace de stockage. Note tes pens\xE9es pour lib\xE9rer de la m\xE9moire pr\xE9cieuse dans ta t\xEAte.",
      "Parfois, une pause n'est pas un luxe, mais un entretien n\xE9cessaire de ton syst\xE8me. Offre-toi ce moment sans culpabilit\xE9.",
      "Les erreurs ne sont que des donn\xE9es. Elles te montrent ce qui ne fonctionne pas et t'aident \xE0 ajuster ton propre chemin."
    ],
    it: [
      "Non devi fare un'attivit\xE0 alla perfezione. Farla in modo incompleto \xE8 infinitamente meglio che non farla affatto.",
      "Se iniziare ti sembra difficile, prevedi di lavorarci solo per un minuto. Dopo puoi fermarti quando vuoi.",
      "Il tuo cervello \xE8 un processore, non uno spazio di archiviazione. Scrivi i tuoi pensieri per liberare memoria preziosa nella tua mente.",
      "A volte una pausa non \xE8 un lusso, ma una manutenzione necessaria del tuo sistema. Concediti questo momento senza sensi di colpa.",
      "Gli errori sono solo dati. Ti mostrano cosa non funziona e ti aiutano a perfezionare il tuo percorso."
    ]
  };
  function suggestInspirationQuote2() {
    const list = INSPIRATION_SAYINGS[currentLang] || INSPIRATION_SAYINGS["en"] || INSPIRATION_SAYINGS["de"];
    const randomQuote = list[Math.floor(Math.random() * list.length)];
    const box = document.getElementById("inspiration-quote-box");
    if (box) box.innerText = randomQuote;
  }
  function suggestBoostActivity2() {
    const list = BOOST_ACTIVITIES[currentLang] || BOOST_ACTIVITIES["en"];
    const randomActivity = list[Math.floor(Math.random() * list.length)];
    const box = document.getElementById("boost-activity-box");
    if (box) box.innerText = randomActivity;
  }
  function switchImpulseTab(tabName) {
    const tabs = ["spark", "inspire", "clarity"];
    tabs.forEach((t3) => {
      const btn = document.getElementById(`impulse-tab-btn-${t3}`);
      const pane = document.getElementById(`impulse-pane-${t3}`);
      if (btn) {
        if (t3 === tabName) {
          btn.className = "flex-1 py-1.5 rounded-xl text-white bg-amber-500/30 border border-amber-500/50 transition flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold shadow-md";
        } else {
          btn.className = "flex-1 py-1.5 rounded-xl text-gray-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer text-xs font-medium";
        }
      }
      if (pane) {
        if (t3 === tabName) {
          pane.classList.remove("hidden");
        } else {
          pane.classList.add("hidden");
        }
      }
    });
    if (tabName === "spark") suggestBoostActivity2();
    if (tabName === "inspire") suggestInspirationQuote2();
    if (typeof lucide !== "undefined") lucide.createIcons();
  }
  window.switchImpulseTab = switchImpulseTab;
  function switchAudioTab(tabName) {
    const tabs = ["ambient", "beats", "music"];
    tabs.forEach((t3) => {
      const btn = document.getElementById(`audio-tab-btn-${t3}`);
      const pane = document.getElementById(`audio-pane-${t3}`);
      if (btn) {
        if (t3 === tabName) {
          btn.className = "flex-1 py-1.5 rounded-xl text-white bg-purple-600/30 border border-purple-500/50 transition flex items-center justify-center gap-1 cursor-pointer text-[11px] font-bold shadow-sm";
        } else {
          btn.className = "flex-1 py-1.5 rounded-xl text-gray-400 hover:text-white transition flex items-center justify-center gap-1 cursor-pointer text-[11px] font-medium";
        }
      }
      if (pane) {
        if (t3 === tabName) {
          pane.classList.remove("hidden");
        } else {
          pane.classList.add("hidden");
        }
      }
    });
    if (typeof lucide !== "undefined") lucide.createIcons();
  }
  window.switchAudioTab = switchAudioTab;
  function switchDailyTab(tabName) {
    const tabs = ["shopping", "cooking"];
    tabs.forEach((t3) => {
      const btn = document.getElementById(`daily-tab-btn-${t3}`);
      const pane = document.getElementById(`daily-pane-${t3}`);
      if (btn) {
        if (t3 === tabName) {
          btn.className = "flex-1 py-1.5 rounded-xl text-white bg-emerald-600/30 border border-emerald-500/50 transition flex items-center justify-center gap-1 cursor-pointer text-[11px] font-bold shadow-sm";
        } else {
          btn.className = "flex-1 py-1.5 rounded-xl text-gray-400 hover:text-white transition flex items-center justify-center gap-1 cursor-pointer text-[11px] font-medium";
        }
      }
      if (pane) {
        if (t3 === tabName) {
          pane.classList.remove("hidden");
        } else {
          pane.classList.add("hidden");
        }
      }
    });
    if (tabName === "cooking" && typeof renderCookingPanel === "function") {
      renderCookingPanel(true);
    }
    if (typeof lucide !== "undefined") lucide.createIcons();
  }
  window.switchDailyTab = switchDailyTab;
  document.addEventListener("keydown", (e) => {
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
    if (activeTag === "input" || activeTag === "textarea" || document.activeElement && document.activeElement.isContentEditable) {
      if (e.key === "Escape") {
        document.activeElement.blur();
      }
      return;
    }
    const key = e.key.toLowerCase();
    switch (key) {
      case "f":
        e.preventDefault();
        toggleMinimalist2();
        break;
      case "t":
        e.preventDefault();
        toggleTimer();
        break;
      case "s":
        e.preventDefault();
        stopTimer();
        break;
      case "w":
        e.preventDefault();
        openHelperModal("pick");
        break;
      case "p":
        e.preventDefault();
        togglePanel("pause-dropdown");
        break;
      case "k":
        e.preventDefault();
        togglePanel("cooking");
        break;
      case "e":
        e.preventDefault();
        togglePanel("shopping");
        break;
      case "u":
        e.preventDefault();
        handleUndo();
        break;
      case "r":
        e.preventDefault();
        togglePanel("report");
        break;
      case "b":
        e.preventDefault();
        togglePanel("impulse");
        switchImpulseTab("spark");
        break;
      case "i":
        e.preventDefault();
        togglePanel("impulse");
        switchImpulseTab("inspire");
        break;
      case "o":
        e.preventDefault();
        openSportModal();
        break;
      case "h":
        e.preventDefault();
        togglePanel("logo-guide");
        break;
      case "a":
        e.preventDefault();
        toggleTerminForm2(true);
        break;
      case "g":
        e.preventDefault();
        if (typeof toggleGameMode === "function") toggleGameMode();
        break;
      case "escape":
        e.preventDefault();
        closeAllPanelsAndModals();
        break;
    }
  });
  function closeAllPanelsAndModals() {
    if (typeof closeHelperModal === "function") closeHelperModal();
    if (typeof closeSportModal === "function") closeSportModal();
    if (typeof closeSafeSpaceModal === "function") closeSafeSpaceModal();
    if (typeof closeCustomItemModal === "function") closeCustomItemModal();
    if (typeof closePrivacyModal === "function") closePrivacyModal();
    if (typeof closeArchiveModal === "function") closeArchiveModal();
    if (typeof closeExportModal === "function") closeExportModal();
    if (typeof closeImportModal === "function") closeImportModal();
    if (typeof closeDiceModal === "function") closeDiceModal();
    if (typeof closeRouletteModal === "function") closeRouletteModal();
    if (typeof closeGameModal === "function") closeGameModal();
    if (typeof closeReportDashboard === "function") closeReportDashboard();
    if (typeof closeSettingsModal === "function") closeSettingsModal();
    if (typeof closeCommandPalette === "function") closeCommandPalette();
    if (typeof closeKeyboardShortcuts === "function") closeKeyboardShortcuts();
    if (typeof closeP2PSyncModal === "function") closeP2PSyncModal();
    if (typeof closeMobileQuickMenu === "function") closeMobileQuickMenu();
    const allPanels = document.querySelectorAll('[id^="panel-"]');
    allPanels.forEach((p) => p.classList.add("hidden"));
  }
  window.closeAllPanelsAndModals = closeAllPanelsAndModals;
  function openMobileQuickMenu() {
    const modal = document.getElementById("modal-mobile-quick-menu");
    if (modal) {
      modal.classList.remove("hidden");
      if (typeof lucide !== "undefined") lucide.createIcons();
    }
  }
  window.openMobileQuickMenu = openMobileQuickMenu;
  function closeMobileQuickMenu() {
    const modal = document.getElementById("modal-mobile-quick-menu");
    if (modal) modal.classList.add("hidden");
  }
  window.closeMobileQuickMenu = closeMobileQuickMenu;
  function triggerSparkleEffect2(x, y) {
    try {
      let animate = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.18;
          p.life -= 0.024;
          p.alpha = Math.max(0, p.life);
          if (p.alpha > 0) {
            alive = true;
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });
        frame++;
        if (alive && frame < 90) {
          requestAnimationFrame(animate);
        } else {
          canvas.remove();
        }
      };
      const canvas = document.createElement("canvas");
      canvas.className = "fixed inset-0 pointer-events-none z-[150000]";
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        canvas.remove();
        return;
      }
      const originX = x || window.innerWidth / 2;
      const originY = y || window.innerHeight / 3;
      const particles = [];
      const colors = ["#a855f7", "#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#ffffff", "#c084fc"];
      for (let i = 0; i < 36; i++) {
        const angle = Math.PI * 2 * i / 36 + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 7 + 2.5;
        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          radius: Math.random() * 3 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          life: 1
        });
      }
      let frame = 0;
      requestAnimationFrame(animate);
    } catch (e) {
      console.warn("triggerSparkleEffect error:", e);
    }
  }
  window.triggerSparkleEffect = triggerSparkleEffect2;
  var commandPaletteActiveIndex = 0;
  function openCommandPalette() {
    const modal = document.getElementById("modal-command-palette");
    const input = document.getElementById("cmd-palette-input");
    if (!modal || !input) return;
    modal.classList.remove("hidden");
    input.value = "";
    filterCommandPalette("");
    setTimeout(() => input.focus(), 50);
  }
  function closeCommandPalette() {
    const modal = document.getElementById("modal-command-palette");
    if (modal) modal.classList.add("hidden");
  }
  function getAvailableCommands() {
    return [
      { id: "timer_25", title: "\u23F1\uFE0F Fokus-Timer: 25 Minuten starten", action: () => {
        if (typeof setTimer === "function") setTimer(25);
        if (typeof startTimer === "function") startTimer();
      } },
      { id: "timer_15", title: "\u23F1\uFE0F Fokus-Timer: 15 Minuten starten", action: () => {
        if (typeof setTimer === "function") setTimer(15);
        if (typeof startTimer === "function") startTimer();
      } },
      { id: "timer_45", title: "\u23F1\uFE0F Fokus-Timer: 45 Minuten starten", action: () => {
        if (typeof setTimer === "function") setTimer(45);
        if (typeof startTimer === "function") startTimer();
      } },
      { id: "ws_switch", title: "\u{1F504} Workspace wechseln (Privat / Arbeit)", action: () => {
        if (typeof toggleWorkspace === "function") toggleWorkspace();
      } },
      { id: "dashboard", title: "\u{1F4CA} Detail-Statistik & Analyse-Dashboard", action: () => {
        if (typeof openReportDashboard === "function") openReportDashboard();
      } },
      { id: "dice", title: "\u{1F3B2} Zufalls-Aufgabe w\xFCrfeln", action: () => {
        if (typeof openDiceModal === "function") openDiceModal();
      } },
      { id: "zen", title: "\u{1F9D8} Minimalistischen Fokus-Modus umschalten", action: () => {
        if (typeof toggleMinimalMode === "function") toggleMinimalMode();
      } },
      { id: "theme_aurora", title: "\u{1F3A8} Theme: Aurora (Lila)", action: () => {
        setTheme("aurora");
      } },
      { id: "theme_sage", title: "\u{1F3A8} Theme: Sage (Salbeigr\xFCn)", action: () => {
        setTheme("sage");
      } },
      { id: "theme_forest", title: "\u{1F3A8} Theme: Forest (Gr\xFCn)", action: () => {
        setTheme("forest");
      } },
      { id: "theme_charcoal", title: "\u{1F3A8} Theme: Charcoal (Graphit)", action: () => {
        setTheme("charcoal");
      } },
      { id: "backup_export", title: "\u{1F4BE} Datensicherung: Plan als JSON exportieren", action: () => {
        if (typeof exportData === "function") exportData();
        else if (typeof handleSaveJson === "function") handleSaveJson();
      } },
      { id: "backup_import", title: "\u{1F4E5} Datensicherung: Backup wiederherstellen", action: () => {
        if (typeof importData === "function") importData();
      } },
      { id: "settings", title: "\u2699\uFE0F Einstellungen, Impressum & Datenschutz", action: () => {
        openSettingsModal("general");
      } },
      { id: "history", title: "\u{1F4F7} Screenshot- & Versions-Galerie", action: () => {
        openSettingsModal("history");
      } },
      { id: "undo", title: "\u21A9\uFE0F Letzte Aktion r\xFCckg\xE4ngig machen", action: () => {
        if (typeof handleUndo === "function") handleUndo();
      } }
    ];
  }
  function filterCommandPalette(query = "") {
    const resultsContainer = document.getElementById("cmd-palette-results");
    if (!resultsContainer) return;
    resultsContainer.innerHTML = "";
    const q = (query || "").toLowerCase().trim();
    const allCommands = getAvailableCommands();
    const matchedCommands = allCommands.filter((c) => c.title.toLowerCase().includes(q));
    const curItems = typeof getCurrentWorkspaceItems === "function" ? getCurrentWorkspaceItems() : typeof state !== "undefined" ? state.items : {};
    const matchedTasks = [];
    if (curItems && typeof curItems === "object") {
      Object.keys(curItems).forEach((col) => {
        const items2 = curItems[col] || [];
        items2.forEach((item2, idx) => {
          const text = typeof item2 === "object" ? item2.task : item2;
          if (text && (!q || text.toLowerCase().includes(q))) {
            matchedTasks.push({
              title: `\u{1F4CC} [${typeof t === "function" ? t(col) : col}] ${text}`,
              action: () => {
                if (typeof startTaskTimerByIndex === "function") startTaskTimerByIndex(col, idx);
                else {
                  if (typeof setTimer === "function") setTimer(25);
                  if (typeof startTimer === "function") startTimer();
                }
              }
            });
          }
        });
      });
    }
    const combined = [];
    if (matchedCommands.length > 0) {
      combined.push({ isHeader: true, label: typeof t === "function" ? t("cmd_actions") : "Schnell-Aktionen" });
      matchedCommands.slice(0, 6).forEach((c) => combined.push({ ...c, isAction: true }));
    }
    if (matchedTasks.length > 0) {
      combined.push({ isHeader: true, label: typeof t === "function" ? t("cmd_tasks") : "Gefundene Aufgaben" });
      matchedTasks.slice(0, 8).forEach((t3) => combined.push({ ...t3, isAction: true }));
    }
    if (combined.filter((c) => c.isAction).length === 0) {
      resultsContainer.innerHTML = `
      <div class="p-6 text-center text-gray-500 text-xs">
        <i data-lucide="search-x" class="w-6 h-6 mx-auto mb-1 opacity-50"></i>
        <span>Keine passenden Befehle oder Aufgaben gefunden</span>
      </div>
    `;
      renderLucideIcons();
      return;
    }
    let actionIdx = 0;
    combined.forEach((item2) => {
      if (item2.isHeader) {
        const h = document.createElement("div");
        h.className = "px-3 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono";
        h.innerText = item2.label;
        resultsContainer.appendChild(h);
      } else {
        const thisIdx = actionIdx++;
        const btn = document.createElement("button");
        btn.className = `w-full px-3 py-2 text-left rounded-xl flex items-center justify-between text-xs transition cursor-pointer ${thisIdx === 0 ? "bg-purple-600/30 border border-purple-500/40 text-white font-semibold" : "text-gray-300 hover:bg-white/5 hover:text-white"}`;
        btn.setAttribute("data-cmd-idx", thisIdx);
        btn.innerHTML = `
        <span class="truncate">${escapeHtml(item2.title)}</span>
        <i data-lucide="arrow-right" class="w-3.5 h-3.5 opacity-40 shrink-0"></i>
      `;
        btn.onclick = () => {
          closeCommandPalette();
          item2.action();
        };
        resultsContainer.appendChild(btn);
      }
    });
    commandPaletteActiveIndex = 0;
    renderLucideIcons();
  }
  window.openCommandPalette = openCommandPalette;
  window.closeCommandPalette = closeCommandPalette;
  window.filterCommandPalette = filterCommandPalette;
  function openSettingsModal(tab = "general") {
    const modal = document.getElementById("modal-settings");
    if (!modal) return;
    modal.classList.remove("hidden");
    switchSettingsTab(tab);
    renderLucideIcons();
  }
  function closeSettingsModal() {
    const modal = document.getElementById("modal-settings");
    if (modal) modal.classList.add("hidden");
  }
  function switchSettingsTab(tabName) {
    const tabs = ["general", "history", "impressum", "privacy", "licenses"];
    tabs.forEach((t3) => {
      const btn = document.getElementById(`settings-tab-${t3}`);
      const pane = document.getElementById(`settings-pane-${t3}`);
      if (btn) {
        if (t3 === tabName) {
          btn.className = "py-2 px-2.5 rounded-xl bg-purple-600 text-white transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md";
        } else {
          btn.className = "py-2 px-2.5 rounded-xl text-gray-400 hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5";
        }
      }
      if (pane) {
        if (t3 === tabName) pane.classList.remove("hidden");
        else pane.classList.add("hidden");
      }
    });
    if (tabName === "history") renderHistoryGallery();
    renderLucideIcons();
  }
  function getHistoryScreenshots() {
    try {
      const saved = localStorage.getItem("flow_history_screenshots");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn("getHistoryScreenshots error:", e);
      return [];
    }
  }
  function saveHistoryScreenshots(list) {
    try {
      localStorage.setItem("flow_history_screenshots", JSON.stringify(list));
    } catch (e) {
      console.warn("saveHistoryScreenshots error:", e);
    }
  }
  function renderHistoryGallery() {
    const grid = document.getElementById("history-gallery-grid");
    const countEl = document.getElementById("history-gallery-count");
    if (!grid) return;
    grid.innerHTML = "";
    const customShots = getHistoryScreenshots();
    if (countEl) countEl.innerText = `${customShots.length} ${customShots.length === 1 ? "Bild" : "Bilder"}`;
    if (customShots.length === 0) {
      grid.innerHTML = `
      <div class="col-span-full p-8 text-center border border-dashed border-white/10 rounded-2xl text-gray-400 space-y-2">
        <i data-lucide="image" class="w-8 h-8 text-gray-500 mx-auto mb-1"></i>
        <div class="font-bold text-xs text-gray-300">Noch keine Screenshots hinterlegt</div>
        <div class="text-[11px] text-gray-500 max-w-sm mx-auto leading-normal">Klicke oben auf \u201EScreenshot hinzuf\xFCgen \u{1F4F7}\u201C, um Bilder fr\xFCherer Versionen und Meilensteine hier zu sammeln.</div>
      </div>
    `;
      renderLucideIcons();
      return;
    }
    customShots.forEach((shot) => {
      const card = document.createElement("div");
      card.className = "group relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 hover:border-purple-500/50 transition flex flex-col justify-between";
      card.innerHTML = `
      <div class="relative overflow-hidden bg-black/60 cursor-pointer" onclick="window.open('${escapeHtml(shot.data)}', '_blank')">
        <img src="${escapeHtml(shot.data)}" alt="${escapeHtml(shot.title)}" class="w-full h-32 object-cover transition transform duration-300 group-hover:scale-105" />
        <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
          <i data-lucide="maximize-2" class="w-4 h-4"></i>
          <span>\xD6ffnen</span>
        </div>
      </div>
      <div class="p-2.5 flex items-center justify-between text-[11px] bg-[#111116]/90 border-t border-white/5 gap-2">
        <div class="truncate">
          <span class="truncate font-semibold text-white block">${escapeHtml(shot.title)}</span>
          <span class="text-[9px] text-gray-500 font-mono">${escapeHtml(shot.date || "")}</span>
        </div>
        <button onclick="deleteHistoryScreenshot('${escapeHtml(shot.id)}')" class="p-1 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-300 transition cursor-pointer shrink-0" title="Screenshot l\xF6schen">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `;
      grid.appendChild(card);
    });
    renderLucideIcons();
  }
  document.addEventListener("DOMContentLoaded", () => {
    setTheme(currentTheme);
    setLanguage(currentLang);
    const iconEl = document.getElementById("zen-btn-icon");
    const textEl = document.getElementById("minimal-mode-btn-text");
    const zenView = document.getElementById("zen-chill-view");
    const mainEl = document.querySelector("main");
    if (isMinimalist) {
      document.body.classList.add("minimalist");
      if (iconEl) iconEl.setAttribute("data-lucide", "eye-off");
      if (textEl) textEl.innerText = t("standard_mode");
      if (zenView) {
        zenView.classList.remove("hidden");
        zenView.classList.add("flex");
      }
      if (mainEl) {
        mainEl.classList.add("hidden");
      }
      updateZenView();
    } else {
      document.body.classList.remove("minimalist");
      if (iconEl) iconEl.setAttribute("data-lucide", "eye");
      if (textEl) textEl.innerText = t("minimal_mode");
      if (zenView) {
        zenView.classList.add("hidden");
        zenView.classList.remove("flex");
      }
      if (mainEl) {
        mainEl.classList.remove("hidden");
      }
    }
    updateDateAndStreak();
    updateWorkspaceSwitchUI();
    renderApp();
    updateZenView();
    populateHelperTaskSelect();
    suggestBoostActivity2();
    suggestInspirationQuote2();
    checkAndGenerateAutomaticReports();
    const btnHeader = document.getElementById("timer-toggle-btn");
    if (btnHeader) {
      btnHeader.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>';
    }
    renderLucideIcons();
  });
  function setTheme(theme) {
    const validThemes = ["aurora", "sage", "cozy", "forest", "architect", "neon-cyber", "glacier", "synthwave", "charcoal", "executive", "holo-chrome", "carbon"];
    if (!validThemes.includes(theme)) theme = "aurora";
    currentTheme = theme;
    document.body.className = `h-full antialiased flex flex-col font-sans select-none overflow-x-hidden text-[#f4f4f5] theme-${theme}`;
    if (isMinimalist) document.body.classList.add("minimalist");
    localStorage.setItem("flowPlannerTheme", theme);
  }
  function setLanguage(lang) {
    if (!lang || !TRANSLATIONS[lang] || !DEFAULT_TASKS_BY_LANG[lang]) {
      lang = "en";
    }
    const oldLang = currentLang;
    currentLang = lang;
    localStorage.setItem("flowPlannerLanguage", lang);
    document.documentElement.lang = lang;
    translateUserTasks(oldLang, lang);
    const flagMap = { de: "\u{1F1E9}\u{1F1EA}", en: "\u{1F1EC}\u{1F1E7}", es: "\u{1F1EA}\u{1F1F8}", el: "\u{1F1EC}\u{1F1F7}", fr: "\u{1F1EB}\u{1F1F7}", it: "\u{1F1EE}\u{1F1F9}" };
    const flagEl = document.getElementById("current-lang-flag") || document.getElementById("active-lang-flag");
    if (flagEl) flagEl.innerText = flagMap[lang] || "\u{1F1EC}\u{1F1E7}";
    translateUI();
    const textEl = document.getElementById("minimal-mode-btn-text");
    if (textEl) {
      textEl.innerText = isMinimalist ? t("standard_mode") : t("minimal_mode");
    }
    updateDateAndStreak();
    renderApp();
    updateZenView();
    populateHelperTaskSelect();
    renderLucideIcons();
  }
  function translateUI() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const translated = TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS["en"]?.[key] || TRANSLATIONS["de"]?.[key];
      if (translated) {
        const icon = el.querySelector("i, svg");
        if (icon) {
          const textSpan = el.querySelector("span:not(.icon)");
          if (textSpan) {
            textSpan.innerText = translated;
          } else {
            const iconHTML = icon.outerHTML;
            el.innerHTML = `${iconHTML} <span>${translated}</span>`;
          }
        } else {
          el.innerText = translated;
        }
      }
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const translated = TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS["en"]?.[key] || TRANSLATIONS["de"]?.[key];
      if (translated) el.setAttribute("placeholder", translated);
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      const translated = TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS["en"]?.[key] || TRANSLATIONS["de"]?.[key];
      if (translated) el.setAttribute("title", translated);
    });
  }
  function translateUserTasks(fromLang, toLang) {
    if (fromLang === toLang) return;
    if (!DEFAULT_TASKS_BY_LANG[fromLang] || !DEFAULT_TASKS_BY_LANG[toLang]) return;
    saveHistory();
    const cats = ["daily", "weekly", "occasionally"];
    cats.forEach((cat) => {
      if (!state.items[cat]) return;
      state.items[cat] = state.items[cat].map((taskItem) => {
        const taskName = typeof taskItem === "object" ? taskItem.task : taskItem;
        const fromList = DEFAULT_TASKS_BY_LANG[fromLang][cat];
        const oList = DEFAULT_TASKS_BY_LANG[toLang][cat];
        const idx = fromList.indexOf(taskName);
        if (idx !== -1) {
          const nextVal = oList[idx];
          return typeof taskItem === "object" ? { ...taskItem, task: nextVal } : nextVal;
        }
        return taskItem;
      });
    });
    if (state.completedSteps) {
      const nextStepsObj = {};
      for (let key in state.completedSteps) {
        let updatedKey = key;
        cats.forEach((cat) => {
          const fromList = DEFAULT_TASKS_BY_LANG[fromLang][cat];
          const oList = DEFAULT_TASKS_BY_LANG[toLang][cat];
          const idx = fromList.indexOf(key);
          if (idx !== -1) updatedKey = oList[idx];
        });
        nextStepsObj[updatedKey] = state.completedSteps[key];
      }
      state.completedSteps = nextStepsObj;
    }
    saveState();
  }
  function toggleMinimalist2() {
    isMinimalist = !isMinimalist;
    localStorage.setItem("flowPlannerMinimalist", String(isMinimalist));
    const iconEl = document.getElementById("zen-btn-icon");
    const textEl = document.getElementById("minimal-mode-btn-text");
    const zenView = document.getElementById("zen-chill-view");
    const mainEl = document.querySelector("main");
    if (isMinimalist) {
      document.body.classList.add("minimalist");
      if (iconEl) iconEl.setAttribute("data-lucide", "eye-off");
      if (textEl) textEl.innerText = t("standard_mode");
      if (zenView) {
        zenView.classList.remove("hidden");
        zenView.classList.add("flex");
      }
      if (mainEl) {
        mainEl.classList.add("hidden");
      }
      updateZenView();
    } else {
      document.body.classList.remove("minimalist");
      if (iconEl) iconEl.setAttribute("data-lucide", "eye");
      if (textEl) textEl.innerText = t("minimal_mode");
      if (zenView) {
        zenView.classList.add("hidden");
        zenView.classList.remove("flex");
      }
      if (mainEl) {
        mainEl.classList.remove("hidden");
      }
    }
    renderLucideIcons();
    showToast(isMinimalist ? t("toast_zen_active") : t("toast_zen_inactive"));
  }
  var editingTerminIndex = null;
  function toggleTerminForm2(open, prefilledDate) {
    isTerminFormOpen = open !== void 0 ? open : !isTerminFormOpen;
    if (!isTerminFormOpen) {
      editingTerminIndex = null;
      selectedCalendarDate2 = null;
    } else if (prefilledDate) {
      selectedCalendarDate2 = prefilledDate;
    }
    renderApp();
    if (isTerminFormOpen) {
      setTimeout(() => {
        const inputTitle = document.getElementById("add-termin-title");
        if (inputTitle) inputTitle.focus();
      }, 50);
    }
  }
  function getTaskIconDetails2(taskText, category = "") {
    if (!taskText) return { icon: "check-circle", color: "text-purple-400" };
    const rawTrimmed = String(taskText).trim();
    if (typeof TASK_ICONS !== "undefined" && TASK_ICONS[rawTrimmed]) {
      return { icon: TASK_ICONS[rawTrimmed], color: "text-purple-300" };
    }
    const norm = rawTrimmed.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const rules = [
      // 1. Medikamente / Gesundheit / Arzt
      { rx: /medi|pill|tablett|vitam|pharmak|arzt|doctor|docteur|dottore|medico|therap|apothek|ordonnan|farmac|φαρμακ|γιατρ|ασθεν/, ic: "pill", col: "text-rose-400" },
      // 2. Zähne / Mundhygiene
      { rx: /zahn|zahne|dient|tooth|teeth|dent|dond|brush|bross|spazzol|δοντ|βουρτσ/, ic: "smile", col: "text-cyan-400" },
      // 3. Geschirr spülen / Küche / Abwasch
      { rx: /spul|dish|vaissel|piat|plato|geschirr|spuel|πιατ|abwasch/, ic: "utensils", col: "text-emerald-400" },
      // 4. Wäsche waschen / Waschmaschine
      { rx: /laund|colad|lessiv|bucat|clothes|linge|roux|ρουχ|πλυντηρ|wasch.*wasch|wasche/, ic: "washing-machine", col: "text-indigo-400" },
      // 5. Wäsche aufhängen / Trocknen
      { rx: /aufhang|hang|colg|etend|stend|aplon|dry|sech|asciug|απλωμ/, ic: "shirt", col: "text-violet-400" },
      // 6. Duschen / Baden / Gesicht waschen
      { rx: /dusch|shower|baign|doccia|duch|ντους|μπανι|gesicht|face|visage|viso|hyg|bath/, ic: "bath", col: "text-sky-400" },
      // 7. Haare / Frisur / Schneiden
      { rx: /haare|haar|hair|pelo|cabell|cheveux|capell|fris|kour|coiff|tagli|μαλλι|κουρεμ|λουσιμ/, ic: "scissors", col: "text-pink-400" },
      // 8. Nägel / Maniküre
      { rx: /nagel|nail|ungl|un|ungh|nych|pedicur|manicur|νυχ/, ic: "sparkles", col: "text-indigo-400" },
      // 9. Trinken / Wasser / Hydration
      { rx: /trink|wat|agu|eau|ner|glass|hydrat|bever|bere|boire|νερο|πινω|ποτηρ/, ic: "glass-water", col: "text-blue-400" },
      // 10. Bett / Schlafen / Bettwäsche
      { rx: /bett|bed|cama|lit|lett|krevat|schlaf|sleep|sommeil|dorm|drap|sabana|lenzuol|κρεβατ|σεντον|υπν/, ic: "bed", col: "text-amber-400" },
      // 11. Aufräumen / Ordnung / Organisation
      { rx: /aufraum|tidy|orden|rang|riordin|clean|putz|organi|nettoy|limp|puliz|τακτοπ|καθαρισ|οργαν/, ic: "package", col: "text-yellow-500" },
      // 12. Staub wischen / Abstauben
      { rx: /staub|dust|polv|poussi|spolver|epousset|xesk|ξεσκον/, ic: "feather", col: "text-amber-300" },
      // 13. Staubsaugen / Saugen
      { rx: /saugen|staubsaug|vacu|aspir|skoupi|σκουπ/, ic: "tornado", col: "text-cyan-500" },
      // 14. Boden wischen / Feuchtwischen
      { rx: /wisch|mop|freg|sfoug|paviment|sol|σφουγγαρ/, ic: "droplets", col: "text-sky-500" },
      // 15. Bad / WC / Sanitär / Spiegel
      { rx: /klo|wc|toil|vater|lekan|lavabo|sink|miroir|specch|espejo|spiegel|bad|fliesen|νιπτηρ|λεκαν/, ic: "sparkles", col: "text-teal-500" },
      // 16. Müll wegbringen / Entsorgung
      { rx: /mull|trash|basur|poubelle|spazzatur|waste|abfall|skoupid|σκουπιδ|πεταμ/, ic: "trash-2", col: "text-rose-500" },
      // 17. Pfandflaschen / Recycling
      { rx: /pfand|bottle|bouteill|bottigl|envase|boukal|recycle|recyc|μπουκαλ|ανακυκλ/, ic: "recycle", col: "text-emerald-500" },
      // 18. Kochen / Mahlzeiten / Rezepte
      { rx: /koch|food|cook|comid|cena|recept|recet|cuisin|cucin|magir|essen|lunch|dinner|breakfast|dejeun|pranz|past|mahlzeit|φαγητ|μαγειρ|γευμα/, ic: "cooking-pot", col: "text-orange-400" },
      // 19. Einkauf / Supermarkt / Laden
      { rx: /einkauf|shop|compr|achat|spesa|supermarkt|market|store|kauf|epicerie|agor|αγορ|σουπερ/, ic: "shopping-cart", col: "text-emerald-400" },
      // 20. Arbeit / Job / Büro / Termine / Meetings
      { rx: /arbeit|work|trabaj|travail|lavor|doul|job|office|schreib|mail|call|anruf|meeting|appuntament|rendez|cita|termin|geschaft|δουλει|γραφει/, ic: "briefcase", col: "text-amber-500" },
      // 21. Lesen / Buch / Lernen / Studium
      { rx: /les|book|libr|livr|vivl|lernen|study|etud|stud|buch|diavas|διαβασ|βιβλι/, ic: "book-open", col: "text-violet-400" },
      // 22. Sport / Fitness / Training / Laufen / Spazieren
      { rx: /sport|gym|fit|train|gymn|workout|run|laufen|gehen|walk|course|correre|caminar|marcher|exerc|ασκησ|γυμναστ|τρεξιμ/, ic: "activity", col: "text-green-400" },
      // 23. Pause / Ausruhen / Erholen / Meditation
      { rx: /paus|rest|desc|relax|chill|medit|mindful|repos|ripos|diahleim|διαλειμμ|χαλαρω/, ic: "moon", col: "text-indigo-300" },
      // 24. Lüften / Frische Luft / Durchatmen
      { rx: /luft|wind|vent|aer|luften|breath|resp|fresch|frisch|αερισμ|αερ/, ic: "wind", col: "text-cyan-300" }
    ];
    for (const r of rules) {
      if (r.rx.test(norm)) return { icon: r.ic, color: r.col };
    }
    const defaults = {
      daily: { icon: "sun", color: "text-amber-400" },
      weekly: { icon: "calendar-days", color: "text-purple-400" },
      todo: { icon: "list-todo", color: "text-blue-400" },
      done: { icon: "check-circle", color: "text-emerald-400" },
      termine: { icon: "clock", color: "text-amber-400" },
      occasionally: { icon: "calendar-range", color: "text-pink-400" },
      notes: { icon: "sticky-note", color: "text-yellow-400" },
      work_focus: { icon: "target", color: "text-amber-400" },
      work_in_progress: { icon: "zap", color: "text-blue-400" },
      work_waiting: { icon: "hourglass", color: "text-purple-400" },
      work_backlog: { icon: "folder-kanban", color: "text-indigo-400" }
    };
    return defaults[category] || { icon: "check-circle", color: "text-purple-400" };
  }
  function getTaskIcon(taskText, category = "") {
    return getTaskIconDetails2(taskText, category).icon;
  }
  window.getTaskIconDetails = getTaskIconDetails2;
  window.getTaskIcon = getTaskIcon;
  function openKeyboardShortcuts() {
    const m = document.getElementById("modal-keyboard-shortcuts");
    if (m) {
      m.classList.remove("hidden");
      renderLucideIcons();
    }
  }
  window.openKeyboardShortcuts = openKeyboardShortcuts;
  function closeKeyboardShortcuts() {
    const m = document.getElementById("modal-keyboard-shortcuts");
    if (m) m.classList.add("hidden");
  }
  window.closeKeyboardShortcuts = closeKeyboardShortcuts;
  function downloadFullBackup() {
    try {
      const backupData = {
        app: "Flow Organiser",
        version: "2.5.0",
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        items: typeof items !== "undefined" ? items : {},
        categoriesOrder: typeof categoriesOrder !== "undefined" ? categoriesOrder : [],
        currentWorkspace: typeof currentWorkspace !== "undefined" ? currentWorkspace : "private",
        historyScreenshots: getHistoryScreenshots(),
        customTranslations: typeof customTranslations !== "undefined" ? customTranslations : {},
        theme: localStorage.getItem("flow_theme") || "dark",
        currentLang: typeof currentLang !== "undefined" ? currentLang : "en"
      };
      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      a.href = url;
      a.download = `flow-organiser-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      if (typeof showToast === "function") {
        showToast(typeof tr === "function" ? tr({ de: "Backup erfolgreich heruntergeladen! \u{1F4BE}", en: "Backup successfully downloaded! \u{1F4BE}" }) : "Backup heruntergeladen! \u{1F4BE}");
      }
    } catch (e) {
      console.error("Backup download error:", e);
      alert("Fehler beim Erstellen des Backups: " + e.message);
    }
  }
  window.downloadFullBackup = downloadFullBackup;
  function handleRestoreBackupFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        if (!data || !data.items && !data.daily && !Array.isArray(data)) {
          throw new Error("Ung\xFCltiges Flow Organiser Backup-Format");
        }
        if (confirm("M\xF6chtest du dieses Backup wirklich wiederherstellen? Bestehende Daten werden aktualisiert.")) {
          if (data.items) {
            items = data.items;
            localStorage.setItem("flow_items_v2", JSON.stringify(items));
          }
          if (data.categoriesOrder && Array.isArray(data.categoriesOrder)) {
            categoriesOrder = data.categoriesOrder;
            localStorage.setItem("flow_categories_order", JSON.stringify(categoriesOrder));
          }
          if (data.historyScreenshots && Array.isArray(data.historyScreenshots)) {
            saveHistoryScreenshots(data.historyScreenshots);
          }
          if (typeof renderBoard === "function") renderBoard();
          if (typeof renderLucideIcons === "function") renderLucideIcons();
          if (typeof closeSettingsModal === "function") closeSettingsModal();
          if (typeof showToast === "function") {
            showToast("Backup erfolgreich wiederhergestellt! \u2728");
          }
        }
      } catch (err) {
        alert("Fehler beim Wiederherstellen: " + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }
  window.handleRestoreBackupFile = handleRestoreBackupFile;
  window.deferredPwaPrompt = null;
  if (typeof window !== "undefined") {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      window.deferredPwaPrompt = e;
      const banner = document.getElementById("pwa-install-banner");
      if (banner && !sessionStorage.getItem("pwa_dismissed")) {
        banner.classList.remove("hidden");
        renderLucideIcons();
      }
    });
    window.addEventListener("appinstalled", () => {
      window.deferredPwaPrompt = null;
      const banner = document.getElementById("pwa-install-banner");
      if (banner) banner.classList.add("hidden");
      if (typeof showToast === "function") {
        showToast("Flow Organiser erfolgreich installiert! \u{1F389}");
      }
    });
  }
  function triggerPwaInstall() {
    const banner = document.getElementById("pwa-install-banner");
    if (banner) banner.classList.add("hidden");
    if (window.deferredPwaPrompt) {
      window.deferredPwaPrompt.prompt();
      window.deferredPwaPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the PWA install prompt");
        }
        window.deferredPwaPrompt = null;
      });
    } else {
      if (typeof showToast === "function") {
        showToast("Installiere Flow \xFCber das Browsermen\xFC (\u201EZum Startbildschirm hinzuf\xFCgen\u201C)");
      }
    }
  }
  window.triggerPwaInstall = triggerPwaInstall;
  function dismissPwaBanner() {
    const banner = document.getElementById("pwa-install-banner");
    if (banner) banner.classList.add("hidden");
    sessionStorage.setItem("pwa_dismissed", "true");
  }
  window.dismissPwaBanner = dismissPwaBanner;
  if (typeof document !== "undefined") {
    document.addEventListener("keydown", (e) => {
      const targetTag = e.target.tagName?.toLowerCase();
      const isEditing = targetTag === "input" || targetTag === "textarea" || targetTag === "select" || e.target.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        if (typeof openCommandPalette === "function") openCommandPalette();
        return;
      }
      if (isEditing) return;
      if (e.key === "?" || e.shiftKey && e.key === "/") {
        e.preventDefault();
        openKeyboardShortcuts();
      } else if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        if (typeof openTaskModal === "function") openTaskModal("daily");
      } else if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        if (typeof toggleTimer === "function") toggleTimer();
      } else if (e.key === "z" || e.key === "Z") {
        e.preventDefault();
        if (typeof toggleMinimalist2 === "function") toggleMinimalist2();
      } else if (e.key === "1") {
        e.preventDefault();
        if (typeof switchWorkspace === "function") switchWorkspace("private");
      } else if (e.key === "2") {
        e.preventDefault();
        if (typeof switchWorkspace === "function") switchWorkspace("work");
      }
    });
  }
  function switchMobileNavTab(tabName) {
    if (tabName === "game") {
      if (typeof toggleGameMode === "function") {
        toggleGameMode();
      }
      return;
    }
    if (typeof gameActive !== "undefined" && gameActive) {
      if (typeof toggleGameMode === "function") toggleGameMode();
    }
    document.body.dataset.mobileNav = tabName;
    localStorage.setItem("flow_active_mobile_tab", tabName);
    const navTabs = ["planer", "focus", "audio", "tools", "game"];
    navTabs.forEach((t3) => {
      const btn = document.getElementById(`mob-nav-${t3}`);
      if (btn) {
        btn.classList.toggle("active", t3 === tabName);
      }
    });
    if (tabName === "planer") {
      const activeCat = document.body.dataset.mobileCat || localStorage.getItem("flowPlannerMobileCategory") || "daily";
      if (typeof setMobileCategory === "function") setMobileCategory(activeCat);
    } else if (tabName === "focus") {
      if (typeof updateTimerDisplay === "function") updateTimerDisplay();
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    if (typeof renderLucideIcons === "function") renderLucideIcons();
    else if (typeof lucide !== "undefined" && lucide.createIcons) lucide.createIcons();
  }
  window.switchMobileNavTab = switchMobileNavTab;
  function openMobileQuickAddModal() {
    const activeCat = document.body.dataset.mobileCat || "daily";
    const inputEl = document.querySelector(`main article[data-category="${activeCat}"] input[type="text"]`);
    if (inputEl) {
      inputEl.focus();
      inputEl.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const taskText = prompt(tr({
      en: "Add new task:",
      de: "Neue Aufgabe eingeben:",
      fr: "Ajouter une nouvelle t\xE2che :",
      it: "Aggiungi nuova attivit\xE0:",
      es: "A\xF1adir nueva tarea:",
      el: "\u03A0\u03C1\u03BF\u03C3\u03B8\u03AE\u03BA\u03B7 \u03BD\u03AD\u03B1\u03C2 \u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1\u03C2:"
    }));
    if (taskText && taskText.trim()) {
      if (typeof addTaskDirectly === "function") {
        addTaskDirectly(activeCat, taskText.trim());
      } else if (typeof state !== "undefined" && state.items) {
        if (!state.items[activeCat]) state.items[activeCat] = [];
        state.items[activeCat].unshift({ task: taskText.trim(), done: false, date: (/* @__PURE__ */ new Date()).toISOString() });
        if (typeof saveState === "function") saveState();
        if (typeof renderBoard === "function") renderBoard();
      }
    }
  }
  window.openMobileQuickAddModal = openMobileQuickAddModal;
  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
      if (window.innerWidth <= 768) {
        const savedTab = localStorage.getItem("flow_active_mobile_tab") || "planer";
        switchMobileNavTab(savedTab);
      }
    });
  }
  if (typeof window !== "undefined") {
    window.setTheme = setTheme;
    window.setLanguage = setLanguage;
    window.toggleMinimalist = toggleMinimalist2;
    window.closeAllPanelsAndModals = closeAllPanelsAndModals;
    window.getTaskIconDetails = getTaskIconDetails2;
    window.getTaskIcon = getTaskIcon;
    window.openCommandPalette = openCommandPalette;
    window.closeCommandPalette = closeCommandPalette;
    window.switchMobileNavTab = switchMobileNavTab;
    window.openMobileQuickAddModal = openMobileQuickAddModal;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.setTheme = setTheme;
    globalThis.setLanguage = setLanguage;
    globalThis.toggleMinimalist = toggleMinimalist2;
    globalThis.closeAllPanelsAndModals = closeAllPanelsAndModals;
    globalThis.getTaskIconDetails = getTaskIconDetails2;
    globalThis.getTaskIcon = getTaskIcon;
    globalThis.openCommandPalette = openCommandPalette;
    globalThis.closeCommandPalette = closeCommandPalette;
    globalThis.switchMobileNavTab = switchMobileNavTab;
    globalThis.openMobileQuickAddModal = openMobileQuickAddModal;
  }

  // main.js
  console.log("\u26A1 [Flow Organiser] Alle Module erfolgreich initialisiert.");
})();

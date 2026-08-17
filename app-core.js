
if (typeof window.TRANSLATIONS === 'undefined') { window.TRANSLATIONS = {}; }

const customTranslations = {
  de: {
    minimal_mode: "Fokus-Modus",
    pause_btn: "Pause",
    standard_mode: "Standard-Modus",
    next_rec: "Deine Empfehlung für jetzt",
    complete_btn: "Erledigt",
    complete: "Erledigt",
    complete_task: "Erledigt",
    feedback_greet: "Hey, ich bin Jannis! 👋",
    feedback_prompt: "Hast du Feedback, Kritik oder neue Ideen für Flow? Schreib mir gerne eine kurze Nachricht – ich freue mich über jeden Impuls!",
    feedback_alt: "oder sende mir eine E-Mail an jmonke@gmail.com",
    feedback_placeholder: "Deine Gedanken, Wünsche oder Ideen...",
    send: "Senden",
    whatnow: "Was jetzt?",
    cooking: "Kochen",
    cook_add_ingredient: "Hinzufügen",
    cook_add_ingredient_placeholder: "Zutat eingeben...",
    cook_suggest: "Rezept vorschlagen 🍳",
    cook_pantry_empty: "Dein Vorrat ist leer. Füge oben Zutaten hinzu!",
    cook_suggestion_title: "Rezept-Vorschlag",
    cook_steps: "Zubereitungsschritte",
    cook_ingredients: "Dein Vorrat",
    cook_time: "Zeit",
    cook_tags: "Tags",
    report: "Statistik",
    report_title: "Deine Erfolge",
    completed_stat: "Geschafft",
    rate_stat: "Erfolgsquote",
    weekly_activity: "Aktivität der letzten 7 Tage",
    loading_stats: "Deine Erfolge werden geladen...",
    export: "Als Bild sichern",
    login_btn: "Anmelden",
    sync_title: "Geräte abgleichen",
    sync_desc: "Sichere deinen Plan und nutze ihn nahtlos auf all deinen Geräten.",
    notesPlaceholder: "Hier ist Platz für deine Notizen, spontanen Gedanken oder Geistesblitze...",
    toast_no_undo: "Es gibt nichts mehr rückgängig zu machen.",
    toast_undo_applied: "Letzter Schritt wurde rückgängig gemacht.",
    toast_reset_success: "Dein Plan wurde komplett zurückgesetzt.",
    toast_import_success: "Dein Plan wurde erfolgreich geladen!",
    toast_import_error: "Das Laden der Datei ist leider fehlgeschlagen.",
    toast_task_deleted: "Aufgabe gelöscht.",
    toast_task_restored: "Aufgabe wurde wiederhergestellt.",
    toast_appointment_name_error: "Bitte trag einen Namen für den Termin ein.",
    toast_appointment_saved: "Dein Termin wurde eingetragen!",
    appointment_new_btn: "Neuer Termin",
    appointment_form_title: "Termin eintragen",
    appointment_form_name_placeholder: "Was steht an? (z.B. Zahnarzt)",
    appointment_form_date_label: "Wann",
    appointment_form_time_label: "Uhrzeit",
    appointment_form_save_btn: "Sichern",
    appointment_form_cancel_btn: "Abbrechen",
    dropdown_placeholder: "Wähle eine Aufgabe...",
    next_suggestion: "Nächster Vorschlag",
    dopamine_kick_title: "Lust auf einen schnellen Dopamin-Kick? ⚡",
    dopamine_kick_start: "Gib mir einen!",
    dopamine_kick_done: "Erledigt!",
    dopamine_kick_other: "Anderer Vorschlag",
    dopamine_kick_completed_toast: "Dopamin-Kick geschafft! Sehr gut gemacht.",
    dopamine_kick_success_log: "Dopamin-Kick gemeistert:"
  },
  en: {
    minimal_mode: "Focus Mode",
    pause_btn: "Pause",
    standard_mode: "Standard Mode",
    next_rec: "Your recommendation for now",
    complete_btn: "Done",
    complete: "Done",
    complete_task: "Done",
    feedback_greet: "Hey, I'm Jannis! 👋",
    feedback_prompt: "Do you have any feedback, suggestions, or new ideas for Flow? Feel free to drop me a quick message – I appreciate every input!",
    feedback_alt: "or send me an email at jmonke@gmail.com",
    feedback_placeholder: "Your thoughts, wishes, or ideas...",
    send: "Send",
    whatnow: "What next?",
    cooking: "Cooking",
    cook_add_ingredient: "Add",
    cook_add_ingredient_placeholder: "Add ingredient...",
    cook_suggest: "Suggest Recipe 🍳",
    cook_pantry_empty: "Your pantry is empty. Add ingredients above!",
    cook_suggestion_title: "Recipe Suggestion",
    cook_steps: "Preparation Steps",
    cook_ingredients: "Your Pantry",
    cook_time: "Time",
    cook_tags: "Tags",
    report: "Stats",
    report_title: "Your Achievements",
    completed_stat: "Completed",
    rate_stat: "Success Rate",
    weekly_activity: "Last 7 Days Activity",
    loading_stats: "Loading your achievements...",
    export: "Save as Image",
    login_btn: "Login",
    sync_title: "Sync Devices",
    sync_desc: "Secure your plan and access it seamlessly on all of your devices.",
    notesPlaceholder: "A cozy space for your notes, drafts, or sudden ideas...",
    toast_no_undo: "There is nothing left to undo.",
    toast_undo_applied: "Last step undone.",
    toast_reset_success: "Your plan has been completely reset.",
    toast_import_success: "Your plan was successfully loaded!",
    toast_import_error: "Oops! Failed to import the file.",
    toast_task_deleted: "Task deleted.",
    toast_task_restored: "Task restored.",
    toast_appointment_name_error: "Please enter a name for the appointment.",
    toast_appointment_saved: "Your appointment has been saved!",
    appointment_new_btn: "New Appointment",
    appointment_form_title: "Add Appointment",
    appointment_form_name_placeholder: "What's happening? (e.g. dentist)",
    appointment_form_date_label: "When",
    appointment_form_time_label: "Time",
    appointment_form_save_btn: "Save",
    appointment_form_cancel_btn: "Cancel",
    dropdown_placeholder: "Select a task...",
    next_suggestion: "Next suggestion",
    dopamine_kick_title: "Need a quick dopamine boost? ⚡",
    dopamine_kick_start: "Give me one!",
    dopamine_kick_done: "Done!",
    dopamine_kick_other: "Show another",
    dopamine_kick_completed_toast: "Dopamine boost complete! Awesome job.",
    dopamine_kick_success_log: "Mastered dopamine boost:"
  },
  es: {
    minimal_mode: "Modo enfoque",
    pause_btn: "Pausa",
    standard_mode: "Modo estándar",
    next_rec: "Te recomendamos hacer esto ahora",
    complete_btn: "Hecho",
    complete: "Hecho",
    complete_task: "Hecho",
    feedback_greet: "¡Hola, soy Jannis! 👋",
    feedback_prompt: "¿Tienes sugerencias, críticas o nuevas ideas para Flow? Escríbeme un mensaje corto; ¡me encanta escuchar tus comentarios!",
    feedback_alt: "o envíame un correo electrónico a jmonke@gmail.com",
    feedback_placeholder: "Tus pensamientos, deseos o ideas...",
    send: "Enviar",
    whatnow: "¿Y ahora qué?",
    cooking: "Cocina",
    cook_add_ingredient: "Añadir",
    cook_add_ingredient_placeholder: "Añade un ingrediente...",
    cook_suggest: "Sugerir Receta 🍳",
    cook_pantry_empty: "Tu despensa está vacía. ¡Añade ingredientes arriba!",
    cook_suggestion_title: "Sugerencia de hoy",
    cook_steps: "Pasos de preparación",
    cook_ingredients: "Tu Despensa",
    cook_time: "Tiempo",
    cook_tags: "Etiquetas",
    report: "Progreso",
    report_title: "Tus Logros",
    completed_stat: "Completadas",
    rate_stat: "Tasa de éxito",
    weekly_activity: "Actividad de los últimos 7 días",
    loading_stats: "Cargando tus logros...",
    export: "Guardar imagen",
    login_btn: "Iniciar sesión",
    sync_title: "Sincronizar",
    sync_desc: "Asegura tu plan y accédelo sin problemas en todos tus dispositivos.",
    notesPlaceholder: "Un rincón tranquilo para tus notas, borradores o ideas repentinas...",
    toast_no_undo: "No hay nada más que deshacer.",
    toast_undo_applied: "Último paso deshecho.",
    toast_reset_success: "Tu plan ha sido restablecido por completco.",
    toast_import_success: "¡Tu plan se cargó correctamente!",
    toast_import_error: "No se pudo importar el archivo.",
    toast_task_deleted: "Tarea eliminada.",
    toast_task_restored: "Tarea restaurada.",
    toast_appointment_name_error: "Por favor, escribe un título para la cita.",
    toast_appointment_saved: "¡Tu cita ha sido guardada!",
    appointment_new_btn: "Nueva cita",
    appointment_form_title: "Añadir cita",
    appointment_form_name_placeholder: "¿Qué hay que hacer? (ej. dentista)",
    appointment_form_date_label: "Cuándo",
    appointment_form_time_label: "Hora",
    appointment_form_save_btn: "Guardar",
    appointment_form_cancel_btn: "Cancelar",
    dropdown_placeholder: "Selecciona una tarea...",
    next_suggestion: "Siguiente propuesta",
    dopamine_kick_title: "¿Necesitas un impulso rápido de dopamina? ⚡",
    dopamine_kick_start: "¡Dame uno!",
    dopamine_kick_done: "¡Listo!",
    dopamine_kick_other: "Mostrar otra",
    dopamine_kick_completed_toast: "¡Impulso de dopamina completado! Gran trabajo.",
    dopamine_kick_success_log: "Impulso de dopamina superado:"
  },
  el: {
    minimal_mode: "Λειτουργία συγκέντρωσης",
    pause_btn: "Παύση",
    standard_mode: "Κανονική λειτουργία",
    next_rec: "Η πρότασή σου για τώρα",
    complete_btn: "Έγινε",
    complete: "Έγινε",
    complete_task: "Έγινε",
    feedback_greet: "Γεια σου, είμαι ο Γιάννης! 👋",
    feedback_prompt: "Έχεις κάποιες παρατηρήσεις, διορθώσεις ή νέες ιδέες για το Flow; Στείλε μου ένα σύντομο μήνυμα – χαίρομαι πραγματικά με κάθε σου σχόλιο!",
    feedback_alt: "ή στείλε μου ένα email στο jmonke@gmail.com",
    feedback_placeholder: "Οι σκέψεις, οι επιθυμίες ή οι ιδέες σου...",
    send: "Αποστολή",
    whatnow: "Τι κάνουμε τώρα;",
    cooking: "Μαγείρεμα",
    cook_add_ingredient: "Προσθήκη",
    cook_add_ingredient_placeholder: "Προσθέστε υλικό...",
    cook_suggest: "Πρόταση συνταγής 🍳",
    cook_pantry_empty: "Το ντουλάπι σας είναι άδειο. Προσθέστε υλικά παραπάνω!",
    cook_suggestion_title: "Η πρόταση της ημέρας",
    cook_steps: "Βήματα προετοιμασίας",
    cook_ingredients: "Τα υλικά σας",
    cook_time: "Χρόνος",
    cook_tags: "Ετικέτες",
    report: "Πρόοδος",
    report_title: "Τα επιτεύγματά σου",
    completed_stat: "Ολοκληρωμένα",
    rate_stat: "Ποσοστό επιτυχίας",
    weekly_activity: "Δραστηριότητα τελευταίων 7 ημερών",
    loading_stats: "Φόρτωση των επιτευμάτων σου...",
    export: "Αποθήκευση ως εικόνα",
    login_btn: "Σύνδεση",
    sync_title: "Συγχρονισμός συσκευών",
    sync_desc: "Αποθήκευσε το πλάνο σου με ασφάλεια και χρησιμοποίησέ το σε όλες σου τις συσκευές.",
    notesPlaceholder: "Ένας ήσυχος χώρος για τις σημειώσεις, τα προσχέδια ή τις ξαφνικές ιδέες σου...",
    toast_no_undo: "Δεν υπάρχει τίποτα άλλο για αναίρεση.",
    toast_undo_applied: "Η τελευταία ενέργεια αναιρέθηκε.",
    toast_reset_success: "Το πλάνο σου επαναφέρθηκε πλήρως.",
    toast_import_success: "Το πλάνο σου φορτώθηκε με επιτυχία!",
    toast_import_error: "Δυστυχώς, η εισαγωγή του αρχείου απέτυχε.",
    toast_task_deleted: "Η εργασία διαγράφηκε.",
    toast_task_restored: "Η εργασία επαναφέρθηκε.",
    toast_appointment_name_error: "Παρακαλώ όρισε έναν τίτλο για το ραντεβού.",
    toast_appointment_saved: "Το ραντεβού σου αποθηκεύτηκε!",
    appointment_new_btn: "Νέο ραντεβού",
    appointment_form_title: "Προσθήκη ραντεβού",
    appointment_form_name_placeholder: "Τι έχεις να κάνεις; (π.χ. οδοντίατρος)",
    appointment_form_date_label: "Πότε",
    appointment_form_time_label: "Ώρα",
    appointment_form_save_btn: "Αποθήκευση",
    appointment_form_cancel_btn: "Ακύρωση",
    dropdown_placeholder: "Επίλεξε μια εργασία...",
    next_suggestion: "Επόμενη πρόταση",
    dopamine_kick_title: "Χρειάζεσαι μια γρήγορη δόση ντοπαμίνης; ⚡",
    dopamine_kick_start: "Δώσε μου μία!",
    dopamine_kick_done: "Έτοιμο!",
    dopamine_kick_other: "Εμφάνιση άλλης",
    dopamine_kick_completed_toast: "Η δόση ντοπαμίνης ολοκληρώθηκε! Εξαιρετική δουλειά.",
    dopamine_kick_success_log: "Κατάφερα τη δόση ντοπαμίνης:"
  },
  fr: {
    minimal_mode: "Mode Focus",
    pause_btn: "Pause",
    standard_mode: "Mode Standard",
    next_rec: "Ta recommandation pour maintenant",
    complete_btn: "Fait",
    complete: "Fait",
    complete_task: "Fait",
    feedback_greet: "Salut, je suis Jannis ! 👋",
    feedback_prompt: "Tu as un avis, une critique ou une nouvelle idée pour Flow ? Écris-moi un petit message, j'apprécie chaque retour !",
    feedback_alt: "ou envoie-moi un email à jmonke@gmail.com",
    feedback_placeholder: "Tes pensées, souhaits ou idées...",
    send: "Envoyer",
    whatnow: "Et maintenant ?",
    cooking: "Cuisine",
    cook_add_ingredient: "Ajouter",
    cook_add_ingredient_placeholder: "Ajouter un ingrédient...",
    cook_suggest: "Suggérer une recette 🍳",
    cook_pantry_empty: "Ton garde-manger est vide. Ajoute des ingrédients ci-dessus !",
    cook_suggestion_title: "Suggestion du jour",
    cook_steps: "Étapes de préparation",
    cook_ingredients: "Ton garde-manger",
    cook_time: "Temps",
    cook_tags: "Étiquettes",
    report: "Statistiques",
    report_title: "Tes réussites",
    completed_stat: "Accomplies",
    rate_stat: "Taux de réussite",
    weekly_activity: "Activité des 7 derniers jours",
    loading_stats: "Chargement de tes réussites...",
    export: "Enregistrer en image",
    login_btn: "Connexion",
    sync_title: "Synchroniser les appareils",
    sync_desc: "Sécurise ton plan et accède-y facilement sur tous tes appareils.",
    notesPlaceholder: "Un espace tranquille pour tes notes, brouillons ou idées soudaines...",
    toast_no_undo: "Il n'y a plus rien à annuler.",
    toast_undo_applied: "Dernière étape annulée.",
    toast_reset_success: "Ton plan a été entièrement réinitialisé.",
    toast_import_success: "Ton plan a été chargé avec succès !",
    toast_import_error: "Oups ! Échec de l'importation du fichier.",
    toast_task_deleted: "Tâche supprimée.",
    toast_task_restored: "Tâche restaurée.",
    toast_appointment_name_error: "Merci d'indiquer un nom pour le rendez-vous.",
    toast_appointment_saved: "Ton rendez-vous a été enregistré !",
    appointment_new_btn: "Nouveau rendez-vous",
    appointment_form_title: "Ajouter un rendez-vous",
    appointment_form_name_placeholder: "Qu'y a-t-il de prévu ? (ex. dentiste)",
    appointment_form_date_label: "Quand",
    appointment_form_time_label: "Heure",
    appointment_form_save_btn: "Enregistrer",
    appointment_form_cancel_btn: "Annuler",
    dropdown_placeholder: "Choisis une tâche...",
    next_suggestion: "Suggestion suivante",
    dopamine_kick_title: "Envie d'un petit coup de dopamine rapide ? ⚡",
    dopamine_kick_start: "Donne-m'en un !",
    dopamine_kick_done: "Fait !",
    dopamine_kick_other: "En montrer un autre",
    dopamine_kick_completed_toast: "Coup de dopamine réussi ! Excellent travail.",
    dopamine_kick_success_log: "Coup de dopamine maîtrisé :"
  },
  it: {
    minimal_mode: "Modalità Focus",
    pause_btn: "Pausa",
    standard_mode: "Modalità Standard",
    next_rec: "Il tuo consiglio per ora",
    complete_btn: "Fatto",
    complete: "Fatto",
    complete_task: "Fatto",
    feedback_greet: "Ciao, sono Jannis! 👋",
    feedback_prompt: "Hai un feedback, una critica o una nuova idea per Flow? Scrivimi un breve messaggio, apprezzo ogni input!",
    feedback_alt: "oppure scrivimi un'email a jmonke@gmail.com",
    feedback_placeholder: "I tuoi pensieri, desideri o idee...",
    send: "Invia",
    whatnow: "E adesso?",
    cooking: "Cucina",
    cook_add_ingredient: "Aggiungi",
    cook_add_ingredient_placeholder: "Aggiungi un ingrediente...",
    cook_suggest: "Suggerisci ricetta 🍳",
    cook_pantry_empty: "La tua dispensa è vuota. Aggiungi ingredienti qui sopra!",
    cook_suggestion_title: "Suggerimento del giorno",
    cook_steps: "Passaggi di preparazione",
    cook_ingredients: "La tua dispensa",
    cook_time: "Tempo",
    cook_tags: "Tag",
    report: "Statistiche",
    report_title: "I tuoi risultati",
    completed_stat: "Completate",
    rate_stat: "Tasso di successo",
    weekly_activity: "Attività degli ultimi 7 giorni",
    loading_stats: "Caricamento dei tuoi risultati...",
    export: "Salva come immagine",
    login_btn: "Accedi",
    sync_title: "Sincronizza dispositivi",
    sync_desc: "Proteggi il tuo piano e accedi senza problemi su tutti i tuoi dispositivi.",
    notesPlaceholder: "Uno spazio tranquillo per i tuoi appunti, bozze o idee improvvise...",
    toast_no_undo: "Non c'è più nulla da annullare.",
    toast_undo_applied: "Ultimo passaggio annullato.",
    toast_reset_success: "Il tuo piano è stato completamente reimpostato.",
    toast_import_success: "Il tuo piano è stato caricato con successo!",
    toast_import_error: "Ops! Importazione del file non riuscita.",
    toast_task_deleted: "Attività eliminata.",
    toast_task_restored: "Attività ripristinata.",
    toast_appointment_name_error: "Inserisci un nome per l'appuntamento.",
    toast_appointment_saved: "Il tuo appuntamento è stato salvato!",
    appointment_new_btn: "Nuovo appuntamento",
    appointment_form_title: "Aggiungi appuntamento",
    appointment_form_name_placeholder: "Cosa c'è in programma? (es. dentista)",
    appointment_form_date_label: "Quando",
    appointment_form_time_label: "Ora",
    appointment_form_save_btn: "Salva",
    appointment_form_cancel_btn: "Annulla",
    dropdown_placeholder: "Seleziona un'attività...",
    next_suggestion: "Suggerimento successivo",
    dopamine_kick_title: "Vuoi una rapida carica di dopamina? ⚡",
    dopamine_kick_start: "Dammene una!",
    dopamine_kick_done: "Fatto!",
    dopamine_kick_other: "Mostrane un'altra",
    dopamine_kick_completed_toast: "Carica di dopamina completata! Ottimo lavoro.",
    dopamine_kick_success_log: "Carica di dopamina superata:"
  }
};

const targetTranslations = typeof TRANSLATIONS !== 'undefined' ? TRANSLATIONS : (window.TRANSLATIONS || {});
if (typeof window.TRANSLATIONS === 'undefined') { window.TRANSLATIONS = targetTranslations; }
for (const lang in customTranslations) {
  if (!targetTranslations[lang]) { targetTranslations[lang] = {}; }
  Object.assign(targetTranslations[lang], customTranslations[lang]);
}

let currentZenTaskInfo = null; let lastSelectedSound = 'rain'; let draggedColumnId = null; let selectedCalendarDate = null; 

const HOVER_COLOR_PAIRS = [
  { hoverIcon: 'group-hover/task:text-emerald-400', text: 'group-hover/task:text-emerald-300' },
  { hoverIcon: 'group-hover/task:text-cyan-400', text: 'group-hover/task:text-cyan-300' },
  { hoverIcon: 'group-hover/task:text-amber-400', text: 'group-hover/task:text-amber-300' },
  { hoverIcon: 'group-hover/task:text-rose-400', text: 'group-hover/task:text-rose-300' },
  { hoverIcon: 'group-hover/task:text-purple-400', text: 'group-hover/task:text-purple-300' },
  { hoverIcon: 'group-hover/task:text-blue-400', text: 'group-hover/task:text-blue-300' },
  { hoverIcon: 'group-hover/task:text-pink-400', text: 'group-hover/task:text-pink-300' },
  { hoverIcon: 'group-hover/task:text-teal-400', text: 'group-hover/task:text-teal-300' },
  { hoverIcon: 'group-hover/task:text-orange-400', text: 'group-hover/task:text-orange-300' },
  { hoverIcon: 'group-hover/task:text-sky-400', text: 'group-hover/task:text-sky-300' }
];

const INSPIRATION_SAYINGS = {
  de: [
    "Du musst eine Aufgabe nicht perfekt machen. Sie unvollständig zu erledigen, ist unendlich viel besser, als sie gar nicht zu tun.",
    "Wenn dir der Anfang schwerfällt, nimm dir vor, nur eine einzige Minute daran zu arbeiten. Danach darfst du jederzeit aufhören.",
    "Dein Gehirn ist ein Prozessor, kein Datenspeicher. Schreib den Gedanken auf, um wertvollen Arbeitsspeicher im Kopf freizugeben.",
    "Manchmal ist eine Pause kein Luxus, sondern eine notwendige Wartung deines Systems. Gönne dir diesen Moment ohne Schuldgefühle.",
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
    "No tienes que hacer una tarea a la perfección. Hacerla de forma incompleta es infinitamente mejor que no hacerla en absoluto.",
    "Si empezar te cuesta, plantéate trabajar solo un minuto en ello. Después puedes parar cuando quieras.",
    "Tu cerebro es un procesador, no un almacén de datos. Escribe tus pensamientos para liberar memoria valiosa en tu mente.",
    "A veces un descanso no es un lujo, sino un mantenimiento necesario de tu sistema. Date ese momento sin sentir culpa.",
    "Los errores son solo datos. Te muestran qué no funciona y te ayudan a ajustar tu propio camino."
  ],
  el: [
    "Δεν χρειάζεται να κάνεις μια εργασία τέλεια. Το να την κάνεις ημιτελή είναι απείρως καλύτερο από το να μην την κάνεις καθόλου.",
    "Αν το ξεκίνημα σου φαίνεται δύσκολο, σκέψου να δουλέψεις πάνω της μόνο για ένα λεπτό. Μετά μπορείς να σταματήσεις όποτε θέλεις.",
    "Ο εγκέφαλός σου είναι επεξεργαστής, όχι αποθηκευτικός χώρος. Γράψε τις σκέψεις σου για να ελευθερώσεις πολύτιμη μνήμη στο μυαλό σου.",
    "Μερικές φορές ένα διάλειμμα δεν είναι πολυτέλεια, αλλά απαραίτητη συντήρηση του συστήματός σου. Χάρισε στον εαυτό σου αυτή τη στιγμή χωρίς ενοχές.",
    "Τα λάθη είναι απλώς δεδομένα. Σου δείχνουν τι δεν λειτουργεί και σε βοηθούν να βελτιώσεις τον δικό σου δρόμο."
  ],
  fr: [
    "Tu n'as pas besoin de faire une tâche à la perfection. La faire de façon incomplète est infiniment mieux que ne pas la faire du tout.",
    "Si commencer te semble difficile, prévois de n'y travailler qu'une seule minute. Ensuite, tu peux t'arrêter à tout moment.",
    "Ton cerveau est un processeur, pas un espace de stockage. Note tes pensées pour libérer de la mémoire précieuse dans ta tête.",
    "Parfois, une pause n'est pas un luxe, mais un entretien nécessaire de ton système. Offre-toi ce moment sans culpabilité.",
    "Les erreurs ne sont que des données. Elles te montrent ce qui ne fonctionne pas et t'aident à ajuster ton propre chemin."
  ],
  it: [
    "Non devi fare un'attività alla perfezione. Farla in modo incompleto è infinitamente meglio che non farla affatto.",
    "Se iniziare ti sembra difficile, prevedi di lavorarci solo per un minuto. Dopo puoi fermarti quando vuoi.",
    "Il tuo cervello è un processore, non uno spazio di archiviazione. Scrivi i tuoi pensieri per liberare memoria preziosa nella tua mente.",
    "A volte una pausa non è un lusso, ma una manutenzione necessaria del tuo sistema. Concediti questo momento senza sensi di colpa.",
    "Gli errori sono solo dati. Ti mostrano cosa non funziona e ti aiutano a perfezionare il tuo percorso."
  ]
};

function suggestInspirationQuote() {
  const list = INSPIRATION_SAYINGS[currentLang] || INSPIRATION_SAYINGS['de'] || INSPIRATION_SAYINGS['en'];
  const randomQuote = list[Math.floor(Math.random() * list.length)];
  const box = document.getElementById('inspiration-quote-box'); if (box) box.innerText = randomQuote;
}

function suggestBoostActivity() {
  const list = BOOST_ACTIVITIES[currentLang] || BOOST_ACTIVITIES['en'];
  const randomActivity = list[Math.floor(Math.random() * list.length)];
  const box = document.getElementById('boost-activity-box'); if (box) box.innerText = randomActivity;
}

function handleSoundsMainClick() { if (currentSoundType) stopAmbientSound(); else playAmbientSound(lastSelectedSound); }
function handleMusicMainClick() { if (playlistTracks.length === 0) document.getElementById('sound-file-input').click(); else togglePlaylistPlayback(); }

const buttonSanitizerObserver = new MutationObserver(() => {
  document.querySelectorAll('button, [role="button"], .task-complete-btn span, #helper-pick-box button, #zen-chill-view button span').forEach(el => {
    const txt = el.innerText.trim();
    if (txt === 'Erledigen' || txt === 'Als erledigt markieren' || txt === 'als erledigt markieren') { el.innerText = 'Erledigt'; }
  });
});
buttonSanitizerObserver.observe(document.body, { childList: true, subtree: true });

let activeDancingSpecialButton = 'whatnow'; let currentPremiumDanceIndex = 0;
const premiumDances = ['premium-glow-btn', 'animate-premium-heartbeat', 'animate-premium-orbit', 'animate-premium-float', 'animate-premium-shimmer'];

function rotatePremiumDance() {
  const activeBtn = activeDancingSpecialButton === 'whatnow' ? document.getElementById('btn-whatnow-dance') : document.getElementById('btn-focus-mode');
  const inactiveBtn = activeDancingSpecialButton === 'whatnow' ? document.getElementById('btn-focus-mode') : document.getElementById('btn-whatnow-dance');
  if (inactiveBtn) { premiumDances.forEach(c => inactiveBtn.classList.remove(c)); inactiveBtn.classList.add('bg-purple-500/10', 'border-purple-500/30'); }
  if (activeBtn) {
    premiumDances.forEach(c => activeBtn.classList.remove(c)); activeBtn.classList.remove('bg-purple-500/10', 'border-purple-500/30');
    currentPremiumDanceIndex = (currentPremiumDanceIndex + 1) % premiumDances.length; activeBtn.classList.add(premiumDances[currentPremiumDanceIndex]);
  }
}

document.addEventListener('keydown', (e) => {
  const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
  if (activeTag === 'input' || activeTag === 'textarea' || (document.activeElement && document.activeElement.isContentEditable)) {
    if (e.key === 'Escape') {
      document.activeElement.blur();
    }
    return;
  }

  const key = e.key.toLowerCase();
  switch(key) {
    case 'f':
      e.preventDefault();
      toggleMinimalist();
      break;
    case 't':
      e.preventDefault();
      toggleTimer();
      break;
    case 's':
      e.preventDefault();
      stopTimer();
      break;
    case 'w':
      e.preventDefault();
      openHelperModal('pick');
      break;
    case 'p':
      e.preventDefault();
      togglePanel('pause-dropdown');
      break;
    case 'k':
      e.preventDefault();
      togglePanel('cooking');
      break;
    case 'e':
      e.preventDefault();
      togglePanel('shopping');
      break;
    case 'u':
      e.preventDefault();
      handleUndo();
      break;
    case 'r':
      e.preventDefault();
      togglePanel('report');
      break;
    case 'b':
      e.preventDefault();
      togglePanel('boost');
      break;
    case 'i':
      e.preventDefault();
      togglePanel('inspiration');
      break;
    case 'c':
      e.preventDefault();
      openCompassModal();
      break;
    case 'o':
      e.preventDefault();
      openSportModal();
      break;
    case 'x':
      e.preventDefault();
      openScriptingModal();
      break;
    case 'h':
      e.preventDefault();
      togglePanel('logo-guide');
      break;
    case 'a':
      e.preventDefault();
      toggleTerminForm(true);
      break;
    case 'g':
      e.preventDefault();
      if (typeof toggleGameMode === 'function') toggleGameMode();
      break;
    case 'escape':
      e.preventDefault();
      if (typeof closeHelperModal === 'function') closeHelperModal();
      if (typeof closeSportModal === 'function') closeSportModal();
      if (typeof closeSafeSpaceModal === 'function') closeSafeSpaceModal();
      if (typeof closeCompassModal === 'function') closeCompassModal();
      if (typeof closeScriptingModal === 'function') closeScriptingModal();
      ['feedback', 'report', 'settings', 'soundscape', 'language', 'boost', 'music', 'sync', 'theme', 'calendar-dropdown', 'inspiration', 'shopping', 'cooking', 'pause-dropdown', 'logo-guide'].forEach(p => {
        const el = document.getElementById(`panel-${p}`);
        if (el) el.classList.add('hidden');
      });
      break;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  setTheme(currentTheme); setLanguage(currentLang);
  const iconEl = document.getElementById('zen-btn-icon'); const textEl = document.getElementById('minimal-mode-btn-text');
  if (isMinimalist) {
    document.body.classList.add('minimalist'); if (iconEl) iconEl.setAttribute('data-lucide', 'eye-off');
    if (textEl) textEl.innerText = t('standard_mode');
  } else {
    document.body.classList.remove('minimalist'); if (iconEl) iconEl.setAttribute('data-lucide', 'eye');
    if (textEl) textEl.innerText = t('minimal_mode');
  }
  updateDateAndStreak(); renderApp(); updateZenView(); populateHelperTaskSelect(); suggestBoostActivity(); suggestInspirationQuote(); checkAndGenerateAutomaticReports();
  const btnHeader = document.getElementById('timer-toggle-btn'); if (btnHeader) { btnHeader.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>'; }
  startGlobalButtonDanceParty(); rotatePremiumDance(); setInterval(rotatePremiumDance, 10000);
  setInterval(() => { activeDancingSpecialButton = activeDancingSpecialButton === 'whatnow' ? 'focus' : 'whatnow'; rotatePremiumDance(); }, 180000);
  if (typeof lucide !== 'undefined') lucide.createIcons();
});

// Gruppiert alle Farbschemata nach visueller Verwandtschaft, damit der automatische
// Wechsel nach erledigten Aufgaben immer zwischen ähnlichen Stimmungen bleibt.
const THEME_FAMILIES = {
  'purple-dreams': ['aurora', 'neon-cyber', 'synthwave'],
  'green-nature': ['sage', 'forest'],
  'warm-earthy': ['cozy', 'mono-hand', 'parchment', 'terracotta-light'],
  'cool-icy': ['architect', 'glacier', 'charcoal', 'minimalist-light', 'holo-chrome'],
  'luxury-mono': ['executive', 'carbon']
};

function getThemeFamily(theme) {
  for (const family in THEME_FAMILIES) {
    if (THEME_FAMILIES[family].includes(theme)) return family;
  }
  return null;
}

// Wählt ein zufälliges, aber verwandtes Farbschema zum aktuell aktiven aus
function getSimilarTheme(current) {
  const family = getThemeFamily(current);
  const allThemes = Object.values(THEME_FAMILIES).flat();
  const pool = family ? THEME_FAMILIES[family].filter(t => t !== current) : allThemes.filter(t => t !== current);
  if (pool.length === 0) return current;
  return pool[Math.floor(Math.random() * pool.length)];
}

function setTheme(theme) {
  currentTheme = theme; document.body.className = `h-full antialiased flex flex-col font-sans select-none overflow-x-hidden text-[#f4f4f5] theme-${theme}`;
  if (isMinimalist) document.body.classList.add('minimalist'); localStorage.setItem('flowPlannerTheme', theme);
}

// Sanfter, langsamer Farbwechsel (z.B. nach dem Erledigen einer Aufgabe): aktiviert kurzzeitig
// eine deutlich langsamere Übergangsdauer für den gesamten Seitenbaum und wechselt dann das Theme.
function setThemeSlow(theme) {
  setTheme(theme);
  // Erst NACH setTheme() hinzufügen, da setTheme() den kompletten className ersetzt
  document.body.classList.add('theme-fade-slow');
  setTimeout(() => {
    document.body.classList.remove('theme-fade-slow');
  }, 2600);
}

function setLanguage(lang) {
  if (!lang || !TRANSLATIONS[lang] || !DEFAULT_TASKS_BY_LANG[lang]) { lang = 'en'; }
  const oldLang = currentLang; currentLang = lang; localStorage.setItem('flowPlannerLanguage', lang);
  document.documentElement.lang = lang; translateUserTasks(oldLang, lang);
  const flagMap = { de: '🇩🇪', en: '🇬🇧', es: '🇪🇸', el: '🇬🇷', fr: '🇫🇷', it: '🇮🇹' };
  const flagEl = document.getElementById('active-lang-flag'); if (flagEl) flagEl.innerText = flagMap[lang] || '🇬🇧';
  translateUI(); const textEl = document.getElementById('minimal-mode-btn-text');
  if (textEl) { textEl.innerText = isMinimalist ? t('standard_mode') : t('minimal_mode'); }
  updateDateAndStreak(); renderApp(); updateZenView(); populateHelperTaskSelect();
}

function translateUI() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n'); if (targetTranslations[currentLang]?.[key]) el.innerText = targetTranslations[currentLang][key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder'); if (targetTranslations[currentLang]?.[key]) el.setAttribute('placeholder', targetTranslations[currentLang][key]);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title'); if (targetTranslations[currentLang]?.[key]) el.setAttribute('title', targetTranslations[currentLang][key]);
  });
}

function translateUserTasks(fromLang, toLang) {
  if (fromLang === toLang) return; if (!DEFAULT_TASKS_BY_LANG[fromLang] || !DEFAULT_TASKS_BY_LANG[toLang]) return;
  saveHistory(); const cats = ['daily', 'weekly', 'occasionally'];
  cats.forEach(cat => {
    if (!state.items[cat]) return;
    state.items[cat] = state.items[cat].map(taskItem => {
      const taskName = typeof taskItem === 'object' ? taskItem.task : taskItem;
      const fromList = DEFAULT_TASKS_BY_LANG[fromLang][cat]; const oList = DEFAULT_TASKS_BY_LANG[toLang][cat];
      const idx = fromList.indexOf(taskName);
      if (idx !== -1) { const nextVal = oList[idx]; return typeof taskItem === 'object' ? { ...taskItem, task: nextVal } : nextVal; }
      return taskItem;
    });
  });
  if (state.completedSteps) {
    const nextStepsObj = {};
    for (let key in state.completedSteps) {
      let updatedKey = key;
      cats.forEach(cat => {
        const fromList = DEFAULT_TASKS_BY_LANG[fromLang][cat]; const oList = DEFAULT_TASKS_BY_LANG[toLang][cat];
        const idx = fromList.indexOf(key); if (idx !== -1) updatedKey = oList[idx];
      });
      nextStepsObj[updatedKey] = state.completedSteps[key];
    }
    state.completedSteps = nextStepsObj;
  }
  saveState();
}

function toggleMinimalist() {
  isMinimalist = !isMinimalist; localStorage.setItem('flowPlannerMinimalist', String(isMinimalist));
  const iconEl = document.getElementById('zen-btn-icon'); const textEl = document.getElementById('minimal-mode-btn-text');
  if (isMinimalist) {
    document.body.classList.add('minimalist'); if (iconEl) iconEl.setAttribute('data-lucide', 'eye-off');
    if (textEl) textEl.innerText = t('standard_mode'); updateZenView();
  } else {
    document.body.classList.remove('minimalist'); if (iconEl) iconEl.setAttribute('data-lucide', 'eye');
    if (textEl) textEl.innerText = t('minimal_mode');
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
  showToast(isMinimalist ? t('minimal_mode') + " aktiv" : t('standard_mode') + " aktiv");
}

function toggleTerminForm(open, prefilledDate) {
  isTerminFormOpen = open !== undefined ? open : !isTerminFormOpen;
  if (prefilledDate) { selectedCalendarDate = prefilledDate; } else if (!isTerminFormOpen) { selectedCalendarDate = null; }
  renderApp();
  if (isTerminFormOpen) {
    setTimeout(() => { const inputTitle = document.getElementById('add-termin-title'); if (inputTitle) inputTitle.focus(); }, 50);
  }
}

function handleAddTermin() {
  const titleEl = document.getElementById('add-termin-title'); const locEl = document.getElementById('add-termin-location');
  const dateEl = document.getElementById('add-termin-date'); const timeEl = document.getElementById('add-termin-time');
  const title = titleEl ? titleEl.value.trim() : ''; const location = locEl ? locEl.value.trim() : '';
  const date = dateEl ? dateEl.value : ''; const time = timeEl ? timeEl.value : '';
  if (!title) { showToast(t('toast_appointment_name_error')); return; }
  saveHistory(); if (!state.items.termine) state.items.termine = [];
  state.items.termine.push({ task: title, date, time, location });
  isTerminFormOpen = false; selectedCalendarDate = null; saveState(); renderApp(); populateHelperTaskSelect();
  showToast(t('toast_appointment_saved'));
}

function getTaskIconDetails(taskText, category = '') {
  if (!taskText) return { icon: 'check-circle', color: 'text-purple-400' };
  if (typeof TASK_ICONS !== 'undefined' && TASK_ICONS[taskText]) return { icon: TASK_ICONS[taskText], color: 'text-purple-300' };
  const text = String(taskText).toLowerCase();
  const rules = [
    { rx: /medi|pill|medicin|tableta|vitam|pharmak|arzt|doctor|therap/, ic: 'pill', col: 'text-rose-400' },
    { rx: /zahn|dient|tooth|dent|toothb|dond|brush/, ic: 'smile', col: 'text-cyan-400' },
    { rx: /dusch|bath|shower|duch|ban|ntous|waschen|wash|hyg|gesicht/, ic: 'shower-head', col: 'text-sky-400' },
    { rx: /haare|hair|pelo|kour|fris/, ic: 'scissors', col: 'text-pink-400' },
    { rx: /nagel|nail|uñ|nych/, ic: 'sparkles', col: 'text-indigo-400' },
    { rx: /trink|wat|agu|ner|glass|hydration/, ic: 'glass-water', col: 'text-blue-400' },
    { rx: /bett|bed|cama|krevat/, ic: 'bed', col: 'text-amber-400' },
    { rx: /aufräum|tidy|orden|takto|clean|putz|organi/, ic: 'package', col: 'text-yellow-500' },
    { rx: /staub|dust|polv|xesk|fegen|sweep/, ic: 'feather', col: 'text-amber-300' },
    { rx: /saugen|vacu|aspir|skoupi/, ic: 'tornado', col: 'text-cyan-500' },
    { rx: /wisch|mop|freg|sfoug|droplets/, ic: 'droplets', col: 'text-sky-500' },
    { rx: /spül|dish|plat|piat/, ic: 'utensils', col: 'text-emerald-400' },
    { rx: /wasch|laund|colad|roux|clothes|wäsche/, ic: 'washing-machine', col: 'text-indigo-400' },
    { rx: /aufhäng|hang|colg|aplon/, ic: 'shirt', col: 'text-violet-400' },
    { rx: /klo|wc|toil|vater|lekan/, ic: 'toilet', col: 'text-teal-500' },
    { rx: /müll|trash|basur|skoupid|waste/, ic: 'trash-2', col: 'text-rose-500' },
    { rx: /pfand|bottle|envase|boukal|recycle/, ic: 'recycle', col: 'text-emerald-500' },
    { rx: /koch|food|cook|comid|cena|recept|magir|essen|lunch|dinner|breakfast|mahlzeit/, ic: 'cooking-pot', col: 'text-orange-400' },
    { rx: /einkauf|shop|compr|agor|supermarkt|store|kauf/, ic: 'shopping-cart', col: 'text-emerald-400' },
    { rx: /arbeit|work|trabaj|doul|job|office|schreiben|mail|call|anruf/, ic: 'briefcase', col: 'text-amber-500' },
    { rx: /les|book|libr|vivl|lernen|study/, ic: 'book-open', col: 'text-violet-400' },
    { rx: /sport|gym|fit|train|gymn|workout|run|laufen|gehen|walk/, ic: 'activity', col: 'text-green-400' },
    { rx: /paus|rest|desc|paus|relax|chill|medit|mindful/, ic: 'moon', col: 'text-indigo-300' },
    { rx: /luft|wind|vent|aer|lüften|breath/, ic: 'wind', col: 'text-cyan-300' }
  ];
  for (const r of rules) { if (r.rx.test(text)) return { icon: r.ic, color: r.col }; }
  const defaults = {
    daily: { icon: 'sun', color: 'text-amber-400' }, weekly: { icon: 'calendar-days', color: 'text-purple-400' },
    todo: { icon: 'list-todo', color: 'text-blue-400' }, done: { icon: 'check-circle', color: 'text-emerald-400' },
    termine: { icon: 'clock', color: 'text-amber-400' }, occasionally: { icon: 'calendar-range', color: 'text-pink-400' },
    notes: { icon: 'sticky-note', color: 'text-yellow-400' }
  };
  return defaults[category] || { icon: 'check-circle', color: 'text-purple-400' };
}

function getTaskIcon(taskText, category = '') { return getTaskIconDetails(taskText, category).icon; }


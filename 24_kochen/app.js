if (typeof window.TRANSLATIONS === 'undefined') { window.TRANSLATIONS = {}; }

// Komplett per Hand geschriebene, natürliche & warmherzige Lokalisierung
const customTranslations = {
  de: {
    minimal_mode: "Fokus-Modus",
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
    toast_reset_success: "Tu plan ha sido restablecido por completo.",
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
    loading_stats: "Φόρτωση των επιτευγμάτων σου...",
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
  }
};

// Robustes Übersetzungs-Merge (umgeht Scope-Bug)
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
    "Fehlentscheidungen sild nur Datenpunkte. Sie zeigen dir, was nicht funktioniert, und helfen dir, deinen Weg feinzujustieren."
  ],
  en: [
    "You don't have to do a task perfectly. Doing it incompletely is infinitely better than not doing it at all.",
    "If starting feels hard, plan to work on it for just one minute. You can stop at any time after that.",
    "Your brain is a storage device. Write thoughts down to free up valuable memory in your head.",
    "Sometimes a break isn't a luxury, but a necessary maintenance of your system. Enjoy this moment guilt-free.",
    "Mistakes are simply data points. They show you what doesn't work and help you fine-tune your own path."
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

function setTheme(theme) {
  currentTheme = theme; document.body.className = `h-full antialiased flex flex-col font-sans select-none overflow-x-hidden text-[#f4f4f5] theme-${theme}`;
  if (isMinimalist) document.body.classList.add('minimalist'); localStorage.setItem('flowPlannerTheme', theme);
}

function setLanguage(lang) {
  if (!lang || !TRANSLATIONS[lang] || !DEFAULT_TASKS_BY_LANG[lang]) { lang = 'en'; }
  const oldLang = currentLang; currentLang = lang; localStorage.setItem('flowPlannerLanguage', lang);
  document.documentElement.lang = lang; translateUserTasks(oldLang, lang);
  const flagMap = { de: '🇩🇪', en: '🇬🇧', es: '🇪🇸', el: '🇬🇷' };
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

// ==========================================
// KOCHEN UTILS & RENDERING (HOCHPROFESSIONELL)
// ==========================================

function getCookingState() {
  if (!state.cooking) state.cooking = createDefaultCookingState();
  return state.cooking;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function addCookingIngredient(value) {
  const text = String(value || '').trim();
  if (!text) return false;
  const cooking = getCookingState();
  const normalized = text.toLowerCase();
  const exists = (cooking.pantryItems || []).some(item => String(item).trim().toLowerCase() === normalized);
  if (exists) return false;
  if (!Array.isArray(cooking.pantryItems)) cooking.pantryItems = [];
  cooking.pantryItems.push(text);
  saveState();
  return true;
}

function removeCookingIngredient(index) {
  const cooking = getCookingState();
  if (!Array.isArray(cooking.pantryItems) || index < 0 || index >= cooking.pantryItems.length) return;
  cooking.pantryItems.splice(index, 1);
  saveState();
  suggestCookingRecipe();
}

// Hochintelligenter Dynamic Recipe Builder für jede beliebige Kombination
function buildDynamicRecipeFromPantry(pantry) {
  const items = pantry.map(i => i.trim().toLowerCase()).filter(Boolean);
  if (items.length === 0) return null;

  // Kategorisierung der eingegebenen Zutaten
  const carbs = items.filter(i => /(pasta|nudel|reis|kartoffel|brot|wrap|toast|fladen|grieß|hafer|baguette)/i.test(i));
  const proteins = items.filter(i => /(hähnchen|huhn|fleisch|rind|schwein|fisch|lachs|tuna|thunfisch|ei|tofu|bohnen|linsen|kichererbsen|quark)/i.test(i));
  const veggies = items.filter(i => /(tomate|gurke|paprika|zucchini|aubergine|spinat|pilz|champignon|zwiebel|knoblauch|karotte|möhre|brokkoli)/i.test(i));
  const dairy = items.filter(i => /(käse|feta|parmesan|mozzarella|butter|sahne|joghurt|frischkäse|schmand)/i.test(i));

  let title = "Kreative Restepfanne";
  let steps = [];
  let duration = "15 Min";

  const primaryCarb = carbs[0] || null;
  const primaryProtein = proteins[0] || null;
  const primaryVeggie = veggies[0] || null;
  const primaryDairy = dairy[0] || null;

  // Dynamische Titel-Generierung basierend auf Dominanz
  if (primaryCarb && primaryProtein && primaryVeggie) {
    title = `Herzhafte ${capitalize(primaryCarb)}-Pfanne mit ${capitalize(primaryProtein)} und ${capitalize(primaryVeggie)}`;
  } else if (primaryCarb && primaryDairy) {
    title = `Cremiges ${capitalize(primaryCarb)}-Gericht mit geschmolzenem ${capitalize(primaryDairy)}`;
  } else if (primaryProtein && primaryVeggie) {
    title = `Pfannengerührtes ${capitalize(primaryProtein)} mit frischem ${capitalize(primaryVeggie)}`;
  } else if (primaryCarb && primaryVeggie) {
    title = `${capitalize(primaryCarb)} mit gedünstetem ${capitalize(primaryVeggie)}`;
  } else if (primaryProtein && primaryDairy) {
    title = `Herzhaftes ${capitalize(primaryProtein)} überbacken mit ${capitalize(primaryDairy)}`;
  } else if (primaryProtein) {
    title = `Schnelles Protein-Gericht (${capitalize(primaryProtein)})`;
  } else if (primaryCarb) {
    title = `Sättigende ${capitalize(primaryCarb)}-Kreation`;
  } else if (primaryVeggie) {
    title = `Bunte ${capitalize(primaryVeggie)}-Pfanne`;
  } else {
    title = `Zutaten-Kombination: ${items.map(capitalize).join(' & ')}`;
  }

  // Strukturierter Schritt-für-Schritt Aufbau
  steps.push("Vorbereitung: Reinige deine Arbeitsfläche und wasche frische Zutaten gründlich ab.");

  let prepIngredients = [...veggies, ...proteins].filter(i => !/(ei|linsen|bohnen)/i.test(i));
  if (prepIngredients.length > 0) {
    steps.push(`Schneide ${prepIngredients.map(i => `${capitalize(i)}`).join(', ')} in gleichmäßige, mundgerechte Stücke.`);
  }

  if (primaryCarb) {
    if (/(pasta|nudel|reis|grieß|linsen)/i.test(primaryCarb)) {
      steps.push(`Bringe gesalzenes Wasser zum Kochen und bereite ${capitalize(primaryCarb)} bissfest nach Packungsanleitung zu.`);
    } else if (/(kartoffel)/i.test(primaryCarb)) {
      steps.push(`Vorkoche die ${capitalize(primaryCarb)} kurz oder brate sie direkt in feinen Spalten mit etwas Öl goldgelb an.`);
    } else if (/(brot|wrap|toast|fladen|baguette)/i.test(primaryCarb)) {
      steps.push(`Erwärme ${capitalize(primaryCarb)} kurz in einer trockenen Pfanne oder im Toaster für das beste Aroma.`);
    }
  }

  let panItems = [...proteins, ...veggies].filter(i => !/(pasta|nudel|reis|brot|wrap|toast|fladen|baguette)/i.test(i));
  if (panItems.length > 0) {
    let verb = proteins.length > 0 ? "Brate zuerst die Proteinquelle scharf an und füge kurz darauf das Gemüse hinzu" : "Dünste das Gemüse mit etwas gutem Öl in einer heißen Pfanne an";
    steps.push(`${verb} (${panItems.map(capitalize).join(', ')}).`);
  }

  if (primaryCarb && panItems.length > 0) {
    steps.push(`Vermenge das Gekochte (${capitalize(primaryCarb)}) direkt in der warmen Pfanne mit den übrigen Zutaten.`);
  }

  if (primaryDairy) {
    steps.push(`Füge ${capitalize(primaryDairy)} hinzu. Lasse ihn kurz mitschmelzen oder ziehe ihn sanft unter die heiße Masse.`);
  }

  steps.push("Abschluss: Schmecke dein Gericht mit Salz, Pfeffer und Kräutern ab. Frisch servieren!");

  return {
    id: 'dynamic-generated',
    title,
    duration,
    ingredients: items.map(capitalize),
    steps
  };
}

function suggestCookingRecipe() {
  const cooking = getCookingState();
  const pantry = (cooking.pantryItems || []).map(item => String(item).trim().toLowerCase()).filter(Boolean);
  const recipes = Array.isArray(cooking.recipes) && cooking.recipes.length ? cooking.recipes : createDefaultCookingState().recipes;

  cooking.activeRecipe = null;
  cooking.activeRecipeId = null;

  if (!pantry.length) {
    saveState();
    return null;
  }

  // Predefined Recipe Matching (mit prozentualem Treffer-Score)
  const ranked = recipes.map(recipe => {
    let score = 0;
    let directMatches = 0;
    const recipeIngredients = (recipe.ingredients || []).map(item => String(item).trim().toLowerCase());
    
    recipeIngredients.forEach(ingredient => {
      if (pantry.includes(ingredient)) {
        score += 10;
        directMatches += 1;
      } else if (pantry.some(item => item.includes(ingredient) || ingredient.includes(item))) {
        score += 4;
      }
    });
    
    return { ...recipe, score, directMatches, recipeIngredients };
  }).sort((a, b) => b.score - a.score);

  // Bestes Match wählen (ab mindestens 2 soliden Treffern), andernfalls Dynamic Generator
  const bestPredefined = ranked[0];
  const best = (bestPredefined && bestPredefined.directMatches >= 2) ? bestPredefined : buildDynamicRecipeFromPantry(pantry);

  if (best) {
    cooking.activeRecipeId = best.id;
    cooking.activeRecipe = best;
  }
  
  saveState();
  return best;
}

function handleCookingAddIngredient() {
  const input = document.getElementById('cooking-ingredient-input');
  if (!input) return;
  const added = addCookingIngredient(input.value);
  if (added) {
    input.value = '';
    suggestCookingRecipe();
    renderCookingPanel(true);
    if (typeof playProceduralSound === 'function') playProceduralSound(3); // Klick-Sound
  }
}

function handleQuickAddStaple(name) {
  const added = addCookingIngredient(name);
  if (added) {
    suggestCookingRecipe();
    renderCookingPanel(true);
    if (typeof playProceduralSound === 'function') playProceduralSound(3);
  }
}

function handleCookingSuggest() {
  const recipe = suggestCookingRecipe();
  if (recipe) {
    renderCookingPanel(true);
    if (typeof playProceduralSound === 'function') playProceduralSound(0); // Fanfaren-Sound für Erfolg
  }
}

function toggleCookingStepCheckbox(stepIndex) {
  if (typeof playProceduralSound === 'function') playProceduralSound(6); // Snappy Click
  const checkbox = document.getElementById(`cook-step-${stepIndex}`);
  const label = document.getElementById(`cook-step-label-${stepIndex}`);
  if (checkbox && label) {
    if (checkbox.checked) {
      label.classList.add('line-through', 'text-gray-500', 'opacity-60');
    } else {
      label.classList.remove('line-through', 'text-gray-500', 'opacity-60');
    }
  }
}

function renderCookingPanel(skipLucide = false) {
  const panel = document.getElementById('panel-cooking');
  if (!panel) return;

  // Panel-Breite dynamisch für perfekte UX vergrößern
  panel.style.width = "380px";
  panel.style.maxWidth = "95vw";

  const cooking = getCookingState();
  const activeRecipe = cooking.activeRecipe;
  const pantry = cooking.pantryItems || [];

  // Grundzutaten für den Schnellzugriff (Pills)
  const staples = [
    { label: 'Pasta 🍝', val: 'Pasta' },
    { label: 'Reis 🍚', val: 'Reis' },
    { label: 'Ei 🥚', val: 'Eier' },
    { label: 'Käse 🧀', val: 'Käse' },
    { label: 'Hähnchen 🍗', val: 'Hähnchen' },
    { label: 'Tomate 🍅', val: 'Tomaten' },
    { label: 'Zwiebel 🧅', val: 'Zwiebeln' },
    { label: 'Gemüse 🥦', val: 'Gemüse' }
  ];

  panel.innerHTML = `
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
      <h4 class="font-bold text-sm font-display text-white flex items-center gap-2">
        <i data-lucide="cooking-pot" class="w-4 h-4 text-orange-400"></i>
        <span data-i18n="cooking">Kochen</span>
      </h4>
      <button onclick="togglePanel('cooking')" class="text-gray-400 hover:text-white text-xs font-bold p-1 cursor-pointer">✕</button>
    </div>

    <div class="space-y-4 pt-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
      
      <!-- Input Area -->
      <div class="flex gap-2">
        <input id="cooking-ingredient-input" type="text" placeholder="${t('cook_add_ingredient_placeholder')}" class="flex-1 min-h-[36px] rounded-xl border border-white/10 bg-[#0a0a0f] px-3 text-xs text-gray-200 placeholder:text-gray-500 outline-none focus:border-orange-500 font-semibold" />
        <button onclick="handleCookingAddIngredient()" class="min-h-[36px] rounded-xl bg-orange-600 px-4 text-xs font-bold text-white transition hover:bg-orange-500 cursor-pointer shadow-md">${t('cook_add_ingredient')}</button>
      </div>

      <!-- Quick Add Staples Area -->
      <div class="space-y-1">
        <div class="text-[9px] font-bold uppercase tracking-wider text-gray-400">Schnellauswahl</div>
        <div class="flex flex-wrap gap-1.5">
          ${staples.map(s => `
            <button onclick="handleQuickAddStaple('${s.val}')" class="px-2 py-1 bg-white/[0.03] hover:bg-orange-500/10 border border-white/5 hover:border-orange-500/30 rounded-lg text-[10px] text-gray-300 transition cursor-pointer font-medium hover:scale-105 active:scale-95">
              ${s.label}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Vorrat (Pantry Items) -->
      <div class="rounded-2xl border border-white/5 bg-[#0a0a0e]/40 p-3 shadow-inner">
        <div class="mb-2 text-[9px] font-bold uppercase tracking-wider text-gray-400">${t('cook_ingredients')}</div>
        ${pantry.length ? `
          <div class="flex flex-wrap gap-1.5">
            ${pantry.map((item, index) => `
              <span class="inline-flex items-center gap-1.5 rounded-lg border border-orange-500/10 bg-orange-500/5 px-2.5 py-1 text-[11px] text-orange-200 font-semibold">
                ${capitalize(item)}
                <button type="button" onclick="removeCookingIngredient(${index}); renderCookingPanel(true);" class="ml-1 text-orange-400/60 hover:text-red-400 font-bold transition cursor-pointer text-xs">×</button>
              </span>
            `).join('')}
          </div>
        ` : `
          <div class="text-[11px] text-gray-500 italic py-1">${t('cook_pantry_empty')}</div>
        `}
      </div>

      <!-- Action Row -->
      <div class="flex gap-2">
        <button onclick="handleCookingSuggest()" class="flex-1 min-h-[36px] rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs shadow-md transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5">
          <i data-lucide="cooking-pot" class="w-4 h-4"></i>
          <span>${t('cook_suggest')}</span>
        </button>
        <button onclick="resetCookingPantry()" class="px-3 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/[0.08] transition cursor-pointer">
          Leeren
        </button>
      </div>

      <!-- Suggestion Panel (Zubereitung) -->
      <div class="rounded-2xl border border-orange-500/20 bg-orange-950/5 p-3.5 shadow-inner">
        <div class="mb-2.5 flex items-center justify-between">
          <span class="text-[9px] font-bold uppercase tracking-widest text-orange-400">${t('cook_suggestion_title')}</span>
          ${activeRecipe ? `
            <span class="text-[9px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-300 font-bold border border-orange-500/20">${activeRecipe.duration}</span>
          ` : ''}
        </div>

        ${activeRecipe ? `
          <div class="text-sm font-black text-white leading-tight font-display mb-2">${activeRecipe.title}</div>
          
          <!-- Pantry Ingredient Checker Map -->
          <div class="mb-3 space-y-1">
            <div class="text-[9px] font-bold uppercase tracking-wider text-gray-400">Rezept-Zutaten</div>
            <div class="flex flex-wrap gap-1.5 text-[10px]">
              ${(activeRecipe.ingredients || []).map(ing => {
                const normalized = ing.toLowerCase();
                const matched = pantry.some(p => p.toLowerCase().includes(normalized) || normalized.includes(p.toLowerCase()));
                return `
                  <span class="px-2 py-0.5 rounded-md ${matched ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'} font-semibold">
                    ${matched ? '✔️' : '❌'} ${capitalize(ing)}
                  </span>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Interactive Steps Checklist -->
          <div class="space-y-1.5 border-t border-white/5 pt-3">
            <div class="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">${t('cook_steps')}</div>
            <div class="space-y-2">
              ${(activeRecipe.steps || []).map((step, idx) => `
                <label class="flex items-start gap-2.5 cursor-pointer select-none group/step">
                  <input type="checkbox" id="cook-step-${idx}" onchange="toggleCookingStepCheckbox(${idx})" class="w-4 h-4 rounded border-white/10 bg-[#0a0a0f] text-orange-500 focus:ring-0 accent-orange-500 shrink-0 mt-0.5 cursor-pointer" />
                  <span id="cook-step-label-${idx}" class="text-[11px] text-gray-300 group-hover/step:text-white leading-normal font-medium transition duration-150">
                    ${step}
                  </span>
                </label>
              `).join('')}
            </div>
          </div>
        ` : `
          <div class="text-xs text-gray-400 italic text-center py-4">Gib deine Zutaten ein, um eine passende Anleitung zu erhalten.</div>
        `}
      </div>

    </div>
  `;

  // Enter-Taste im Input-Feld abfangen
  const input = panel.querySelector('#cooking-ingredient-input');
  if (input) {
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCookingAddIngredient();
      }
    };
  }

  if (!skipLucide && typeof lucide !== 'undefined') lucide.createIcons();
}

function resetCookingPantry() {
  const cooking = getCookingState();
  cooking.pantryItems = [];
  cooking.activeRecipeId = null;
  cooking.activeRecipe = null;
  saveState();
  renderCookingPanel(true);
  if (typeof playProceduralSound === 'function') playProceduralSound(11); // Reset Sound
}

// ==========================================
// RENDER APP CORE
// ==========================================

function renderApp() {
  const main = document.querySelector('main'); if (!main) return;
  main.innerHTML = ''; const todayISO = new Date().toISOString().split('T')[0];
  categoriesOrder.forEach(([id, iconKey]) => {
    const isDone = id === 'done'; const isNotes = id === 'notes'; const isTermine = id === 'termine';
    const activeCount = (state.items[id] || []).length; const doneInCat = state.done.filter(t => t.origin === id).length;
    const totalInCat = doneInCat + activeCount; let titleText = t(id);
    if (isDone) titleText += ` (${state.done.length})`; else if (!isNotes) titleText += ` (${doneInCat}/${totalInCat})`;
    const pct = (!isDone && !isNotes && totalInCat > 0) ? Math.round((doneInCat / totalInCat) * 100) : 0;
    const article = document.createElement('article');
    article.className = 'min-h-[380px] h-full flex flex-col p-3 rounded-2xl border border-white/[0.08] bg-[#13131a]/75 backdrop-blur-md shadow-lg hover:border-[var(--accent)]/30 transition duration-300 cursor-default';
    article.draggable = true;
    article.ondragstart = (e) => {
      if (draggedItemInfo) return; e.dataTransfer.setData('text/column', id); e.dataTransfer.effectAllowed = 'move';
      draggedColumnId = id; article.classList.add('opacity-40');
    };
    article.ondragend = () => { article.classList.remove('opacity-40'); draggedColumnId = null; };
    article.ondragover = (e) => {
      e.preventDefault(); if (draggedColumnId) { e.dataTransfer.dropEffect = 'move'; article.classList.add('border-dashed', 'border-[var(--accent)]'); }
    };
    article.ondragleave = () => { article.classList.remove('border-dashed', 'border-[var(--accent)]'); };
    article.ondrop = (e) => {
      e.preventDefault(); article.classList.remove('border-dashed', 'border-[var(--accent)]');
      if (draggedColumnId) {
        const srcId = draggedColumnId; const targetId = id;
        if (srcId !== targetId) {
          const srcIdx = categoriesOrder.findIndex(([catId]) => catId === srcId);
          const targetIdx = categoriesOrder.findIndex(([catId]) => catId === targetId);
          if (srcIdx !== -1 && targetIdx !== -1) {
            saveHistory(); const [removed] = categoriesOrder.splice(srcIdx, 1);
            categoriesOrder.splice(targetIdx, 0, removed); saveCategoriesOrder(); renderApp();
            showToast(currentLang === 'de' ? 'Spalten-Reihenfolge aktualisiert ↕️' : 'Column order updated ↕️');
          }
        }
        draggedColumnId = null;
      } else { handleDrop(e, id); }
    };
    article.innerHTML = `
      <h2 class="flex justify-center items-center gap-2 mb-2.5 text-gray-400 font-bold font-display text-[10px] tracking-wider uppercase cursor-grab active:cursor-grabbing select-none" title="Spalte durch Ziehen neu anordnen">
        <i data-lucide="${iconKey}" class="w-4 h-4 pointer-events-none"></i> <span class="pointer-events-none">${titleText}</span>
      </h2>
      ${!isDone && !isNotes ? `
        <div class="w-full h-1 bg-white/[0.05] rounded-full mb-3.5 overflow-hidden pointer-events-none">
          <div class="h-full bg-gradient-to-r from-[var(--accent)] to-emerald-400 transition-all duration-500" style="width: ${pct}%"></div>
        </div>
      ` : ''}
      <div id="list-${id}" class="flex flex-col gap-2.5 flex-1 min-h-[120px] overflow-y-auto py-0.5 px-0.5"></div>
    `;
    const listEl = article.querySelector(`#list-${id}`);
    if (isDone) {
      state.done.slice().reverse().forEach((item, idx) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'group p-2 text-[11px] text-gray-400 hover:text-white border border-dashed border-slate-700 hover:border-purple-500 rounded-lg bg-slate-800/25 hover:bg-purple-950/20 cursor-pointer font-medium transition flex items-center justify-between gap-1';
        itemDiv.onclick = () => handleRestoreDoneTask(idx); itemDiv.title = "Zurück in den Plan verschieben";
        itemDiv.innerHTML = `<span class="truncate">${item.task} · ${item.time}</span><i data-lucide="undo" class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-purple-400 shrink-0"></i>`;
        listEl.appendChild(itemDiv);
      });
    } else if (isNotes) {
      const textarea = document.createElement('textarea');
      textarea.className = 'w-full h-full min-h-[220px] flex-1 p-3 bg-black/40 border border-dashed border-white/10 rounded-xl text-gray-200 text-xs leading-relaxed outline-none resize-none focus:border-[var(--accent)] transition';
      textarea.placeholder = t('notesPlaceholder'); textarea.value = state.items.notes || '';
      textarea.oninput = (e) => { state.items.notes = e.target.value; saveState(); }; listEl.appendChild(textarea);
    } else if (isTermine) {
      const rawTermine = state.items.termine || [];
      const itemsWithMeta = rawTermine.map((item, originalIdx) => {
        const obj = typeof item === 'object' ? item : { task: item, date: '', time: '', location: '' };
        return { ...obj, originalIdx };
      });
      itemsWithMeta.sort((a, b) => {
        if (!a.date && !b.date) return 0; if (!a.date) return 1; if (!b.date) return -1;
        return `${a.date} ${a.time || '00:00'}`.localeCompare(`${b.date} ${b.time || '00:00'}`);
      });
      itemsWithMeta.forEach((item) => {
        const originalIndex = item.originalIdx; const isToday = item.date === todayISO;
        let fullDateString = "Kein Datum";
        if (item.date) {
          const d = new Date(item.date);
          const weekdaysFull = {
            de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
            en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            es: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            el: ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σαββάτο']
          };
          const weekdayString = weekdaysFull[currentLang]?.[d.getDay()] || weekdaysFull['de'][d.getDay()];
          const parts = item.date.split('-');
          if (parts.length === 3) { fullDateString = `${weekdayString}, ${parts[2]}.${parts[1]}.${parts[0]}`; } 
          else { fullDateString = `${weekdayString}, ${item.date}`; }
        }
        const itemDiv = document.createElement('div'); itemDiv.draggable = true;
        itemDiv.ondragstart = (e) => handleDragStart(e, id, originalIndex);
        itemDiv.className = `group relative w-full min-h-[50px] flex items-center justify-between p-2.5 border-0 border-l-[4px] ${isToday ? 'border-amber-400 bg-amber-500/10' : 'border-[var(--accent)] bg-white/[0.03]'} hover:bg-[rgba(255,255,255,0.02)] hover:scale-[1.02] text-gray-300 font-medium leading-tight transition duration-300 rounded-lg`;
        const pair = HOVER_COLOR_PAIRS[(originalIndex + 12) % HOVER_COLOR_PAIRS.length];
        
        itemDiv.innerHTML = `
          <button onclick="handleCompleteTask('termine', ${originalIndex}, event)" class="task-complete-btn flex flex-col gap-1.5 flex-1 min-w-0 text-left bg-transparent border-0 text-inherit cursor-pointer p-0 transition duration-150 pr-2 group/task" title="Abhaken">
            <div class="flex items-center gap-2.5 w-full">
              <i data-lucide="clock" class="standard-task-icon w-5 h-5 text-amber-400 shrink-0 transition-colors duration-150 ${pair.hoverIcon}"></i>
              <span class="task-text-span block text-xs font-bold text-white truncate ${pair.text} transition-colors duration-150">${item.task}</span>
            </div>
            ${(item.date || item.time || item.location) ? `
              <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 pl-7 text-[10px] text-gray-400 font-semibold leading-none">
                ${item.time ? `<span class="flex items-center gap-0.5 text-amber-300/90"><i data-lucide="clock" class="w-3 h-3"></i>${item.time}</span>` : ''}
                ${item.date ? `<span class="flex items-center gap-0.5"><i data-lucide="calendar" class="w-3 h-3"></i>${item.date.split('-').reverse().join('.')}</span>` : ''}
                ${item.location ? `<span class="flex items-center gap-0.5 text-cyan-400/80 truncate max-w-[100px]" title="${item.location}"><i data-lucide="map-pin" class="w-3 h-3 text-cyan-400/80"></i>${item.location}</span>` : ''}
              </div>
            ` : ''}
          </button>
          <div class="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 shrink-0 bg-[#13131a] border border-white/10 px-1 py-0.5 rounded-lg shadow-lg z-50 whitespace-nowrap">
            <button onclick="deleteTask('termine', ${originalIndex}, event)" class="p-1 text-gray-500 hover:text-red-400 hover:bg-white/10 rounded transition cursor-pointer" title="Löschen"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
          </div>
        `;
        listEl.appendChild(itemDiv);
      });
      if (!isTerminFormOpen) {
        const btnEl = document.createElement('button'); btnEl.onclick = () => toggleTerminForm(true);
        btnEl.className = 'mt-2 w-full min-h-[38px] p-2 rounded-lg border border-dashed border-white/15 bg-[#0a0a0e] hover:bg-[#13131e] text-center text-xs text-gray-400 hover:text-white font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm';
        const btnT = t('appointment_new_btn'); btnEl.innerHTML = `<i data-lucide="calendar-plus" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i><span>${btnT}</span>`;
        listEl.appendChild(btnEl);
      } else {
        const formDiv = document.createElement('div'); formDiv.className = 'mt-2 p-3 bg-[#0e0e14] border border-[var(--accent)]/40 rounded-xl flex flex-col gap-2 shadow-lg';
        const formT = t('appointment_form_title'); const nameT = t('appointment_form_name_placeholder');
        const dateT = t('appointment_form_date_label'); const timeT = t('appointment_form_time_label');
        const saveT = t('appointment_form_save_btn'); const cancelT = t('appointment_form_cancel_btn');
        const dateValue = selectedCalendarDate || todayISO;
        formDiv.innerHTML = `
          <div class="flex items-center justify-between text-xs font-bold text-amber-300">
            <span class="flex items-center gap-1.5"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> ${formT}</span>
            <button onclick="toggleTerminForm(false)" class="text-gray-400 hover:text-white p-0.5 cursor-pointer text-xs">✕</button>
          </div>
          <input type="text" id="add-termin-title" placeholder="${nameT}" class="w-full p-2 bg-black/60 border border-white/15 rounded-lg text-xs text-white outline-none focus:border-[var(--accent)] font-semibold placeholder:text-gray-500 mb-2" />
          <input type="text" id="add-termin-location" placeholder="Ort (z.B. Zoom, Büro, Park)" class="w-full p-2 bg-black/60 border border-white/15 rounded-lg text-xs text-white outline-none focus:border-[var(--accent)] font-semibold placeholder:text-gray-500 mb-2" />
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
          const inputTitle = formDiv.querySelector('#add-termin-title');
          if (inputTitle) {
            inputTitle.onkeydown = (e) => {
              if (e.key === 'Enter' && inputTitle.value.trim()) handleAddTermin();
              if (e.key === 'Escape') toggleTerminForm(false);
            };
          }
        }, 0);
        listEl.appendChild(formDiv);
      }
    } else {
      (state.items[id] || []).forEach((task, index) => {
        const taskText = typeof task === 'object' ? task.task : task;
        const iconDetails = getTaskIconDetails(taskText, id); const isTaskActive = activeTimerTask === taskText && timerRunning;
        const itemDiv = document.createElement('div'); itemDiv.draggable = true;
        itemDiv.ondragstart = (e) => handleDragStart(e, id, index); itemDiv.ondragover = (e) => handleDragOver(e);
        itemDiv.ondrop = (e) => handleItemDrop(e, id, index);
        const randomVal = Math.random(); let subtleAnimClass = "";
        if (randomVal < 0.1) subtleAnimClass = "task-anim-float";
        else if (randomVal < 0.2) subtleAnimClass = "task-anim-shift";
        else if (randomVal < 0.3) subtleAnimClass = "task-anim-pulse";
        itemDiv.className = `group relative w-full min-h-[42px] flex items-center justify-between p-2 border-0 border-l-[4px] ${isTaskActive ? 'border-amber-400 bg-amber-500/15 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'border-[var(--accent)] bg-white/[0.03]'} hover:bg-[rgba(255,255,255,0.02)] text-gray-300 font-medium leading-tight transition duration-200 rounded-lg ${subtleAnimClass}`;
        const safeTaskEscaped = taskText.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const pair = HOVER_COLOR_PAIRS[(index + id.charCodeAt(0)) % HOVER_COLOR_PAIRS.length];
        itemDiv.innerHTML = `
          <button onclick="handleCompleteTask('${id}', ${index}, event)" class="task-complete-btn flex items-center gap-2.5 flex-1 min-w-0 text-left bg-transparent border-0 text-inherit cursor-pointer p-0 transition duration-150 pr-2 group/task" title="Abhaken">
            <i data-lucide="${iconDetails.icon}" class="standard-task-icon w-5 h-5 ${isTaskActive ? 'text-amber-400 animate-pulse' : iconDetails.color} shrink-0 transition-colors duration-150 ${pair.hoverIcon}"></i>
            <span class="task-text-span block text-xs leading-snug min-w-0 flex-1 font-medium text-gray-200 truncate ${isTaskActive ? 'text-amber-200 font-bold' : ''} ${pair.text} transition-colors duration-150" title="${taskText.replace(/"/g, '&quot;')}">${taskText}</span>
          </button>
          <div class="absolute right-1 -top-3 flex items-center gap-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 shrink-0 bg-[#13131a] border border-white/10 px-1 py-0.5 rounded-lg shadow-lg z-50 whitespace-nowrap">
            <button onclick="openTaskStepsModal('${id}', ${index}, event)" class="p-1 text-[var(--accent-light)] hover:text-white hover:bg-white/10 rounded transition cursor-pointer" title="Anleitung"><i data-lucide="footprints" class="w-3.5 h-3.5"></i></button>
            <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
            <button onclick="startTaskTimer('${safeTaskEscaped}', event)" class="p-1 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded transition cursor-pointer" title="Timer starten"><i data-lucide="timer" class="w-3.5 h-3.5"></i></button>
            <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
            <button onclick="deleteTask('${id}', ${index}, event)" class="p-1 text-gray-500 hover:text-red-400 hover:bg-white/10 rounded transition cursor-pointer" title="Löschen"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
          </div>
        `;
        listEl.appendChild(itemDiv);
      });
      const addInput = document.createElement('input'); addInput.type = 'text'; addInput.placeholder = '＋';
      addInput.className = 'w-full min-h-[38px] p-2 rounded-lg border border-white/10 bg-[#0a0a0e] hover:bg-[#111118] text-center text-xs placeholder:text-gray-500 focus:outline-none focus:border-[var(--accent)] transition cursor-text font-semibold text-gray-300';
      addInput.onkeydown = (e) => {
        if (e.key === 'Enter' && addInput.value.trim()) {
          saveHistory(); state.items[id].push(addInput.value.trim()); addInput.value = ''; saveState(); renderApp(); populateHelperTaskSelect();
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      };
      listEl.appendChild(addInput);
    }
    main.appendChild(article);
  });
  updateShoppingListPopup(true); renderCookingPanel(true); if (typeof lucide !== 'undefined') { lucide.createIcons(); }
}

function animateTaskToDone(taskEl, targetSelector, onComplete) {
  const rect = taskEl.getBoundingClientRect(); const targetCol = document.querySelector(targetSelector);
  if (!targetCol) { onComplete(); return; }
  const targetRect = targetCol.getBoundingClientRect(); const ghost = taskEl.cloneNode(true);
  ghost.style.position = 'fixed'; ghost.style.left = `${rect.left}px`; ghost.style.top = `${rect.top}px`;
  ghost.style.width = `${rect.width}px`; ghost.style.height = `${rect.height}px`; ghost.style.zIndex = '999999'; ghost.style.pointerEvents = 'none';
  ghost.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)'; ghost.style.opacity = '1'; ghost.style.boxShadow = '0 12px 30px rgba(139, 92, 246, 0.3)';
  document.body.appendChild(ghost); taskEl.style.opacity = '0'; taskEl.style.pointerEvents = 'none'; ghost.offsetWidth;
  const destX = targetRect.left + (targetRect.width - rect.width) / 2; const destY = targetRect.top + 20;
  ghost.style.left = `${destX}px`; ghost.style.top = `${destY}px`; ghost.style.transform = 'scale(0.8) rotate(4deg)'; ghost.style.opacity = '0.3';
  setTimeout(() => { ghost.remove(); onComplete(); }, 1200);
}

function handleCompleteTask(category, index, event) {
  if (event) event.stopPropagation();
  let taskEl = null; if (event && event.currentTarget) { taskEl = event.currentTarget.closest('div[draggable="true"]'); }
  const onComplete = () => {
    const rawTask = state.items[category][index]; if (!rawTask) return;
    saveHistory(); state.items[category].splice(index, 1); const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); const todayStr = now.toISOString().split('T')[0];
    let taskText = typeof rawTask === 'object' ? rawTask.task : rawTask;
    if (typeof rawTask === 'object' && rawTask.date) {
      let locInfo = rawTask.location ? ` @ ${rawTask.location}` : ''; taskText += ` (${formatTerminDate(rawTask.date, rawTask.time)}${locInfo})`;
    }
    state.done.push({ task: taskText, origin: category, date: todayStr, time: timeStr });
    state.streak = (state.streak || 0) + 1; if (state.completedSteps) delete state.completedSteps[taskText];
    const themes = ['sage', 'aurora', 'cozy', 'forest', 'architect', 'mono-hand', 'editorial', 'glacier', 'charcoal', 'executive', 'terracotta', 'carbon'];
    let nextTheme; do { nextTheme = themes[Math.floor(Math.random() * themes.length)]; } while (nextTheme === currentTheme);
    setTheme(nextTheme); saveState(); showPraise(); renderApp(); updateZenView(); populateHelperTaskSelect();
  };
  if (taskEl) { animateTaskToDone(taskEl, '#list-done', onComplete); } else { onComplete(); }
}

function deleteTask(category, index, event) {
  if (event) event.stopPropagation(); saveHistory();
  const taskObj = state.items[category][index]; const taskText = typeof taskObj === 'object' ? taskObj?.task : taskObj;
  state.items[category].splice(index, 1); if (taskText && state.completedSteps) delete state.completedSteps[taskText];
  saveState(); showToast(t('toast_task_deleted')); renderApp(); updateZenView(); populateHelperTaskSelect();
}

function handleRestoreDoneTask(doneIndex) {
  saveHistory(); const reversedIndex = state.done.length - 1 - doneIndex; const item = state.done[reversedIndex]; if (!item) return;
  state.done.splice(reversedIndex, 1); const targetCat = state.items[item.origin] ? item.origin : 'daily';
  state.items[targetCat].push(item.task); saveState(); showToast(t('toast_task_restored')); renderApp(); updateZenView(); populateHelperTaskSelect();
}

let draggedItemInfo = null;
function handleDragStart(e, category, index) {
  draggedItemInfo = { category, index }; e.stopPropagation();
  e.dataTransfer.setData('text/plain', JSON.stringify({ category, index })); e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }

function handleItemDrop(e, targetCategory, targetIndex) {
  e.preventDefault(); e.stopPropagation(); let data = draggedItemInfo;
  try { if (!data) data = JSON.parse(e.dataTransfer.getData('text/plain')); } catch(err) {}
  if (!data || data.category === undefined || data.index === undefined) return;
  const { category: srcCat, index: srcIdx } = data;
  if (srcCat === 'notes' || srcCat === 'done' || targetCategory === 'notes' || targetCategory === 'done') return;
  saveHistory(); const [item] = state.items[srcCat].splice(srcIdx, 1);
  state.items[targetCategory].splice(targetIndex, 0, item); draggedItemInfo = null; saveState(); renderApp(); populateHelperTaskSelect();
}

function handleDrop(e, targetCategory) {
  e.preventDefault(); let data = draggedItemInfo;
  try { if (!data) data = JSON.parse(e.dataTransfer.getData('text/plain')); } catch(err) {}
  if (!data || data.category === undefined || data.index === undefined) return;
  const { category: srcCat, index: srcIdx } = data;
  if (srcCat === 'notes' || srcCat === 'done' || targetCategory === 'notes' || targetCategory === 'done') return;
  saveHistory(); const [item] = state.items[srcCat].splice(srcIdx, 1);
  state.items[targetCategory].push(item); draggedItemInfo = null; saveState(); renderApp(); populateHelperTaskSelect();
}

let currentlyOpenPanel = null; let hoverPanelTimeout = null;

function showPanelHover(panelName) {
  clearTimeout(hoverPanelTimeout); if (currentlyOpenPanel === panelName) return;
  currentlyOpenPanel = panelName;
  ['feedback', 'report', 'settings', 'soundscape', 'language', 'boost', 'music', 'sync', 'theme', 'calendar-dropdown', 'inspiration', 'shopping', 'cooking', 'pause-dropdown'].forEach(p => {
    const el = document.getElementById(`panel-${p}`); if (!el) return;
    if (p === panelName) { if (el.classList.contains('hidden')) { el.classList.remove('hidden'); if (p === 'report') updateReportPanel(); if (p === 'cooking') renderCookingPanel(true); } } 
    else { el.classList.add('hidden'); }
  });
}

function hidePanelHover(panelName) {
  clearTimeout(hoverPanelTimeout);
  hoverPanelTimeout = setTimeout(() => {
    const el = document.getElementById(`panel-${panelName}`); if (el) el.classList.add('hidden');
    if (currentlyOpenPanel === panelName) currentlyOpenPanel = null;
  }, 250);
}

function togglePanel(panelName) {
  clearTimeout(hoverPanelTimeout); const el = document.getElementById(`panel-${panelName}`); if (!el) return;
  const isCurrentlyHidden = el.classList.contains('hidden');
  ['feedback', 'report', 'settings', 'soundscape', 'language', 'boost', 'music', 'sync', 'theme', 'calendar-dropdown', 'inspiration', 'shopping', 'cooking', 'pause-dropdown'].forEach(p => {
    if (p !== panelName) { const other = document.getElementById(`panel-${p}`); if (other) other.classList.add('hidden'); }
  });
  if (isCurrentlyHidden) { el.classList.remove('hidden'); currentlyOpenPanel = panelName; if (panelName === 'report') updateReportPanel(); if (panelName === 'cooking') renderCookingPanel(true); } 
  else { el.classList.add('hidden'); if (currentlyOpenPanel === panelName) currentlyOpenPanel = null; }
}

let reportTimeframe = 'today';
function setReportTimeframe(tf) {
  reportTimeframe = tf;
  ['today', 'week', 'month'].forEach(t => {
    const btn = document.getElementById(`report-tab-${t}`);
    if (btn) {
      if (t === tf) btn.className = 'px-2 py-0.5 rounded text-[var(--accent-light)] bg-[var(--accent)]/25 cursor-pointer font-bold';
      else btn.className = 'px-2 py-0.5 rounded text-gray-400 hover:text-white cursor-pointer';
    }
  });
  updateReportPanel();
}

function renderWeeklyChart() {
  const chartEl = document.getElementById('report-weekly-chart'); const totalWeekTasksEl = document.getElementById('report-total-week-tasks');
  if (!chartEl) return; chartEl.innerHTML = ''; const now = new Date(); const last7Days = [];
  const weekdaysShort = {
    de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'], el: ['Κυρ', 'Δευ', 'Τρι', 'Τετ', 'Πεμ', 'Παρ', 'Σαβ']
  };
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(now.getDate() - i); const iso = d.toISOString().split('T')[0];
    last7Days.push({ date: iso, label: weekdaysShort[currentLang]?.[d.getDay()] || weekdaysShort['en'][d.getDay()], count: 0 });
  }
  let totalWeekCount = 0;
  (state.done || []).forEach(item => { const found = last7Days.find(day => day.date === item.date); if (found) { found.count++; totalWeekCount++; } });
  if (totalWeekTasksEl) { totalWeekTasksEl.innerText = currentLang === 'de' ? `${totalWeekCount} Aufgaben` : `${totalWeekCount} Tasks`; }
  const maxCount = Math.max(...last7Days.map(d => d.count), 4);
  last7Days.forEach(day => {
    const pct = (day.count / maxCount) * 100; const isToday = day.date === now.toISOString().split('T')[0];
    const barCol = isToday ? 'bg-amber-400' : 'bg-[var(--accent)]';
    const barBg = isToday ? 'bg-amber-500/10 border-amber-400/20' : 'bg-[var(--accent)]/10 border-purple-500/20';
    const barWrapper = document.createElement('div'); barWrapper.className = 'flex flex-col items-center gap-1.5 flex-1 max-w-[40px]';
    barWrapper.innerHTML = `
      <span class="text-[9px] font-bold font-mono ${day.count > 0 ? 'text-white' : 'text-gray-600'}">${day.count}</span>
      <div class="w-5 h-12 ${barBg} border rounded-md relative flex items-end overflow-hidden" title="${day.date}: ${day.count}">
        <div class="w-full ${barCol} transition-all duration-500 rounded-t animate-slide-up" style="height: ${pct}%"></div>
      </div>
      <span class="text-[9px] font-bold ${isToday ? 'text-amber-300 font-extrabold' : 'text-gray-400'}">${day.label}</span>
    `;
    chartEl.appendChild(barWrapper);
  });
}

function updateReportPanel() {
  const now = new Date(); const todayISO = now.toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  let filteredDone = state.done || [];
  if (reportTimeframe === 'today') filteredDone = filteredDone.filter(item => item.date === todayISO);
  else if (reportTimeframe === 'week') {
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    filteredDone = filteredDone.filter(item => item.date && item.date >= sevenDaysAgo);
  } else if (reportTimeframe === 'month') { filteredDone = filteredDone.filter(item => item.date && item.date >= thirtyDaysAgo); }
  const count = filteredDone.length; let totalPending = 0;
  ['daily', 'weekly', 'todo', 'occasionally', 'termine'].forEach(cat => { totalPending += (state.items[cat] || []).length; });
  const totalAll = count + totalPending; const pct = totalAll > 0 ? Math.round((count / totalAll) * 100) : 100;
  const todayEl = document.getElementById('report-today-count'); if (todayEl) todayEl.innerText = count;
  const rateEl = document.getElementById('report-rate-pct'); if (rateEl) rateEl.innerText = `${pct}%`;
  renderWeeklyChart();
  const catBarsEl = document.getElementById('report-category-bars');
  if (catBarsEl) {
    catBarsEl.innerHTML = ''; const catStats = [{ id: 'daily', label: t('daily') }, { id: 'weekly', label: t('weekly') }, { id: 'todo', label: t('todo') }, { id: 'occasionally', label: t('occasionally') }];
    catStats.forEach(({ id, label }) => {
      let pending = (state.items[id] || []).length; let completedInCat = filteredDone.filter(item => item.origin === id).length; let totalInCat = pending + completedInCat;
      if (reportTimeframe === 'week' || reportTimeframe === 'month') {
        if (id === 'daily') label = currentLang === 'de' ? 'Täglich' : (currentLang === 'es' ? 'Diario' : (currentLang === 'el' ? 'Καθημερινά' : 'Daily'));
        if (id === 'occasionally') label = currentLang === 'de' ? 'Gelegentliche' : (currentLang === 'es' ? 'Ocasionales' : (currentLang === 'el' ? 'Περιστασιακά' : 'Occasionally'));
      }
      if (id === 'daily') {
        if (reportTimeframe === 'week') {
          const baseDailyCount = Math.max(1, (state.items.daily || []).length + (state.done || []).filter(item => item.origin === 'daily' && item.date === todayISO).length);
          totalInCat = baseDailyCount * 7; pending = Math.max(0, totalInCat - completedInCat);
        } else if (reportTimeframe === 'month') {
          const baseDailyCount = Math.max(1, (state.items.daily || []).length + (state.done || []).filter(item => item.origin === 'daily' && item.date === todayISO).length);
          totalInCat = baseDailyCount * 30; pending = Math.max(0, totalInCat - completedInCat);
        }
      }
      if (id === 'weekly' && reportTimeframe === 'month') {
        const baseWeeklyCount = Math.max(1, (state.items.weekly || []).length + (state.done || []).filter(item => item.origin === 'weekly' && item.date && item.date >= thirtyDaysAgo).length / 4);
        totalInCat = Math.round(baseWeeklyCount * 4); pending = Math.max(0, totalInCat - completedInCat);
      }
      if (totalInCat > 0) {
        const catPct = Math.round((completedInCat / totalInCat) * 100); const row = document.createElement('div'); row.className = 'space-y-1';
        row.innerHTML = `<div class="flex justify-between items-center text-[11px]"><span class="text-gray-300 font-medium">${label}</span><span class="text-gray-400 font-mono">${completedInCat}/${totalInCat} (${catPct}%)</span></div><div class="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5"><div class="h-full bg-gradient-to-r from-[var(--accent)] to-emerald-400 transition-all duration-500" style="width: ${catPct}%"></div></div>`;
        catBarsEl.appendChild(row);
      }
    });
  }
  const insightEl = document.getElementById('report-insight-text');
  if (insightEl) {
    if (count === 0) { insightEl.innerText = t('loading_stats'); }
    else if (count < 3) { insightEl.innerText = t('loading_stats'); }
    else if (count < 8) { insightEl.innerText = targetTranslations[currentLang]?.loading_stats || t('loading_stats'); }
    else { insightEl.innerText = targetTranslations[currentLang]?.loading_stats || t('loading_stats'); }
  }
  const list = document.getElementById('report-list');
  if (list) {
    list.innerHTML = ''; if (filteredDone.length === 0) { list.innerHTML = `<div class="text-gray-500 italic text-center py-2 text-xs">${currentLang === 'de' ? 'Keine Protokolleinträge vorhanden.' : 'No logs available.'}</div>`; } 
    else {
      filteredDone.slice().reverse().forEach(item => {
        const div = document.createElement('div'); div.className = 'p-2 bg-white/[0.02] border border-white/5 rounded-lg flex justify-between items-center text-gray-300 hover:bg-white/5 transition';
        const catLabel = t(item.origin) || item.origin;
        div.innerHTML = `<div class="flex items-center gap-1.5 overflow-hidden pr-2"><span class="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">${catLabel}</span><span class="truncate font-semibold text-xs text-white">${item.task}</span></div><span class="text-gray-500 font-mono text-[10px] shrink-0">${item.time || ''}</span>`;
        list.appendChild(div);
      });
    }
  }
  updateMissedTasksList(); if (typeof lucide !== 'undefined') lucide.createIcons();
}

function submitFeedback() {
  const text = document.getElementById('feedback-text').value;
  if (text.trim()) {
    const mailtoUrl = `mailto:jmonke@gmail.com?subject=Flow App Feedback&body=${encodeURIComponent(text)}`;
    window.location.href = mailtoUrl;
    showToast({ de: 'E-Mail-Entwurf geöffnet! ❤️', en: 'Email draft opened! ❤️', es: '¡Borrador de email aberto! ❤️', el: 'Το προσχέδιο email άνοιξε! ❤️' }[currentLang] || 'Email draft opened! ❤️');
    document.getElementById('feedback-text').value = ''; togglePanel('feedback');
  }
}

function updateZenView() {
  const zenCatEl = document.getElementById('zen-task-cat'); const zenTextEl = document.getElementById('zen-task-text');
  if (!zenTextEl) return; let chosen = null;
  const dailyTasks = (state.items.daily || []).map(t => ({ cat: 'daily', task: typeof t === 'object' ? t.task : t }));
  const weeklyTasks = (state.items.weekly || []).map(t => ({ cat: 'weekly', task: typeof t === 'object' ? t.task : t }));
  const todoTasks = (state.items.todo || []).map(t => ({ cat: 'todo', task: typeof t === 'object' ? t.task : t }));
  const occasionallyTasks = (state.items.occasionally || []).map(t => ({ cat: 'occasionally', task: typeof t === 'object' ? t.task : t }));
  if (dailyTasks.length > 0) chosen = dailyTasks[0];
  else if (weeklyTasks.length > 0 || todoTasks.length > 0) chosen = weeklyTasks[0] || todoTasks[0];
  else if (occasionallyTasks.length > 0) chosen = occasionallyTasks[0];
  currentZenTaskInfo = chosen;
  if (!chosen) {
    if (zenCatEl) zenCatEl.innerText = t('completed');
    const endMsg = { de: '🎉 Alle Aufgaben erledigt! Entspanne dich und genieße deine freie Zeit.', en: '🎉 All tasks completed! Relax and enjoy your free time.', es: '🎉 ¡Todas las tareas completadas! ¡Disfruta de tu tempo libre!', el: '🎉 Όλες οι εργασίες ολοκληρώθηκαν! Χαλαρώστε και απολαύστε τον ελεύθερο χρόνο σας.' }[currentLang];
    zenTextEl.innerHTML = `<span class="text-emerald-400">${endMsg}</span>`;
  } else {
    const catName = t(chosen.cat); if (zenCatEl) zenCatEl.innerText = `${t('next_rec')} · ${catName}`;
    zenTextEl.innerText = chosen.task;
  }
  updateTimerDisplay(); if (typeof lucide !== 'undefined') lucide.createIcons();
}

function updateShoppingListPopup(skipLucide = false) {
  const rowsContainer = document.getElementById('shopping-list-rows'); const badgeEl = document.getElementById('shop-badge-count');
  if (!rowsContainer) return; rowsContainer.innerHTML = ''; const list = state.shoppingList || [];
  if (badgeEl) {
    if (list.length > 0) { badgeEl.classList.remove('hidden'); badgeEl.innerText = list.length; } 
    else { badgeEl.classList.add('hidden'); }
  }
  if (list.length === 0) { rowsContainer.innerHTML = `<div class="text-center text-gray-500 italic py-2.5 text-[10px]">Einkaufsliste leer.</div>`; } 
  else {
    list.forEach((item, idx) => {
      const div = document.createElement('div'); div.className = 'flex items-center justify-between gap-1.5 py-1.5 border-b border-white/[0.03] text-gray-300';
      div.innerHTML = `
        <input type="checkbox" onclick="handleToggleShoppingItem(${idx})" class="w-4 h-4 rounded bg-black border-white/10 text-emerald-500 accent-emerald-500 cursor-pointer shrink-0" />
        <span class="truncate font-semibold flex-1 pl-1.5 text-xs text-white" title="${item.name}">${item.name}</span>
        <button onclick="handleDeleteShoppingItem(${idx})" class="p-1 text-gray-500 hover:text-red-400 rounded transition shrink-0 cursor-pointer"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
      `;
      rowsContainer.appendChild(div);
    });
  }
  const historyBox = document.getElementById('shop-history-box'); const historyList = document.getElementById('shop-history-list');
  const isHistoryVisible = localStorage.getItem('flow_shop_history_visible') === 'true';
  if (historyBox) { if (isHistoryVisible) historyBox.classList.remove('hidden'); else historyBox.classList.add('hidden'); }
  if (historyList) {
    historyList.innerHTML = ''; const hist = state.shoppingHistory || [];
    if (hist.length === 0) { historyList.innerHTML = `<div class="text-gray-600 italic text-center py-1 text-[9px]">Noch keine Einkäufe.</div>`; } 
    else {
      hist.slice().reverse().forEach(hItem => {
        const hDiv = document.createElement('div'); hDiv.className = 'flex justify-between items-center py-0.5 border-b border-white/[0.02] text-gray-400 text-[9px]';
        hDiv.innerHTML = `<span class="truncate max-w-[150px] line-through">${hItem.name}</span><span class="font-mono text-[8px] text-gray-500 shrink-0">${hItem.date}</span>`;
        historyList.appendChild(hDiv);
      });
    }
  }
  const tipBox = document.getElementById('panel-shopping'); if (tipBox) { generateSmartShoppingTips(tipBox); }
  if (!skipLucide && typeof lucide !== 'undefined') { lucide.createIcons(); }
}

function handleAddShoppingItem() {
  const nameEl = document.getElementById('shop-add-name'); const name = nameEl ? nameEl.value.trim() : '';
  if (!name) { showToast(currentLang === 'de' ? "Artikelnamen angeben!" : "Please specify item name!"); return; }
  saveHistory(); if (!state.shoppingList) state.shoppingList = [];
  state.shoppingList.push({ name }); saveState(); if (nameEl) nameEl.value = '';
  renderApp(); showToast(currentLang === 'de' ? `"${name}" hinzugefügt!` : `Added "${name}"!`);
}

function handleDeleteShoppingItem(index) {
  saveHistory(); const removed = state.shoppingList[index]; state.shoppingList.splice(index, 1);
  saveState(); renderApp(); showToast(currentLang === 'de' ? `"${removed.name}" gelöscht.` : `Deleted "${removed.name}".`);
}

function handleToggleShoppingItem(index) {
  saveHistory(); const item = state.shoppingList[index]; state.shoppingList.splice(index, 1);
  if (!state.shoppingHistory) state.shoppingHistory = [];
  const todayStr = new Date().toLocaleDateString([], { month: '2-digit', day: '2-digit' });
  state.shoppingHistory.push({ name: item.name, date: todayStr });
  saveState(); if (typeof playProceduralSound === 'function') playProceduralSound(3); 
  showToast(currentLang === 'de' ? `"${item.name}" eingekauft! ✅` : `Bought "${item.name}"! ✅`); renderApp();
}

function toggleShoppingHistory() {
  const visible = localStorage.getItem('flow_shop_history_visible') === 'true';
  localStorage.setItem('flow_shop_history_visible', String(!visible)); renderApp();
}

function clearShoppingList() {
  if (confirm(currentLang === 'de' ? "Gesamte Einkaufsliste leeren?" : "Clear entire shopping list?")) {
    saveHistory(); state.shoppingList = []; saveState(); renderApp();
  }
}

function clearShoppingHistory() {
  if (confirm(currentLang === 'de' ? "Einkaufs-Protokoll leeren?" : "Clear shopping logs?")) {
    saveHistory(); state.shoppingHistory = []; saveState(); renderApp();
  }
}

function generateSmartShoppingTips(container) {
  const tipTextEl = container.querySelector('#shop-tip-text'); if (!tipTextEl) return;
  if (!state.shoppingList || state.shoppingList.length === 0) {
    const defaultTips = {
      de: "Tipp: Gehe nie hungrig einkaufen & kaufe vorzugsweise saisonal, um bis zu 30% bei Gemüse zu sparen!",
      en: "Tipp: Never go shopping hungry & prioritize seasonal produce to save up to 30%!",
      es: "Consejo: ¡Nunca vayas de compras con hambre und compra alimentos de temporada para ahorrar!",
      el: "Συμβουλή: Μην πηγαίνετε ποτέ πεινασμένοι για ψώνια & επιλέξτε εποχιακά προϊόντα!"
    };
    tipTextEl.innerText = defaultTips[currentLang] || defaultTips.de; return;
  }
  let hasMeat = false, hasDairy = false, hasVegFruit = false, hasConvenience = false;
  const meatKeywords = ['fleisch', 'meat', 'hähnchen', 'chicken', 'beef', 'schwein', 'pork', 'schinken', 'wurst'];
  const dairyKeywords = ['milch', 'milk', 'käse', 'cheese', 'butter', 'quark', 'joghurt', 'sahne'];
  const vegFruitKeywords = ['tomate', 'apfel', 'apple', 'banan', 'gemüse', 'obst', 'salat', 'gurke', 'paprika', 'kartoffel', 'orange'];
  const convenienceKeywords = ['pizza', 'chips', 'cola', 'fanta', 'snack', 'schoko', 'süss', 'sweet'];
  state.shoppingList.forEach(item => {
    const name = item.name.toLowerCase();
    if (meatKeywords.some(kw => name.includes(kw))) hasMeat = true;
    if (dairyKeywords.some(kw => name.includes(kw))) hasDairy = true;
    if (vegFruitKeywords.some(kw => name.includes(kw))) hasVegFruit = true;
    if (convenienceKeywords.some(kw => name.includes(kw))) hasConvenience = true;
  });
  let tip = "";
  if (hasMeat) { tip = currentLang === 'de' ? "Spartipp: Fleisch lässt sich im Angebot in größeren Mengen kaufen und einfrieren. Das spart bis zu 35%!" : "Smart Tip: Buy meat in bulk when on sale and freeze it. Saves up to 35%!"; } 
  else if (hasDairy) { tip = currentLang === 'de' ? "Spartipp: Eigenmarken bei Milch, Butter & Quark kommen oft von denselben Herstellern, kosten aber bis zu 40% weniger." : "Smart Tip: Store brands for dairy (milk, butter) often come from the same factories but cost up to 40% less."; } 
  else if (hasVegFruit) { tip = currentLang === 'de' ? "Spartipp: Kaufe loses Obst & Gemüse statt Plastik-Verpackungen. Meist frischer und deutlich günstiger im Kilopreis!" : "Smart Tip: Buy loose fruits & veggies instead of pre-packaged plastic ones. Usually cheaper per kg!"; } 
  else if (hasConvenience) { tip = currentLang === 'de' ? "Spartipp: Snacks und Fertiggerichte treiben den Bon extrem hoch. Selber machen oder Multipacks verringern die Kosten stark." : "Smart Tip: Prepared snacks inflate your bill. Buy multipacks or prep your own snacks to save big."; } 
  else { tip = currentLang === 'de' ? "Spartipp: Vergleiche immer den Grundpreis (Preis pro kg/Liter) im Regal, da Packungsgrößen oft täuschen!" : "Smart Tip: Always compare the base price (price per kg/liter) on the shelf tags."; }
  tipTextEl.innerText = tip;
}

function updateMissedTasksList() {
  const container = document.getElementById('report-missed-tasks-list'); if (!container) return; container.innerHTML = '';
  const missed = []; const todayISO = new Date().toISOString().split('T')[0];
  (state.items.daily || []).forEach(task => { missed.push({ task: typeof task === 'object' ? task.task : task, tag: currentLang === 'de' ? 'Täglich' : 'Daily' }); });
  (state.items.weekly || []).forEach(task => { missed.push({ task: typeof task === 'object' ? task.task : task, tag: currentLang === 'de' ? 'Wöchentlich' : 'Weekly' }); });
  (state.items.todo || []).forEach(task => { missed.push({ task: typeof task === 'object' ? task.task : task, tag: 'Todo' }); });
  (state.items.occasionally || []).forEach(task => { missed.push({ task: typeof task === 'object' ? task.task : task, tag: currentLang === 'de' ? 'Gelegentliche' : 'Occasionally' }); });
  (state.items.termine || []).forEach(task => { if (task.date === todayISO) { missed.push({ task: task.task, tag: currentLang === 'de' ? 'Termin heute' : 'Appointment' }); } });
  if (missed.length === 0) { container.innerHTML = `<div class="text-emerald-400 italic text-[10px] py-1 text-center font-semibold">🎉 Alles erledigt! Großartige Leistung.</div>`; } 
  else {
    missed.forEach(item => {
      const div = document.createElement('div'); div.className = 'flex justify-between items-center gap-1.5 py-1 px-1.5 bg-black/30 rounded border border-white/5 hover:border-rose-500/10 transition';
      div.innerHTML = `<span class="truncate font-semibold text-gray-200 text-[10px]">${item.task}</span><span class="text-[8px] px-1 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 shrink-0 font-mono font-bold">${item.tag}</span>`;
      container.appendChild(div);
    });
  }
}

function triggerAutomaticDownload(reportText, filename) {
  const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function checkAndGenerateAutomaticReports() {
  const now = new Date(); const todayISO = now.toISOString().split('T')[0]; const lang = currentLang || 'de';
  if (state.lastDate && state.lastDate !== todayISO) {
    const prevDate = state.lastDate; const { reportText, filename } = generateReportContent('daily', prevDate);
    triggerAutomaticDownload(reportText, filename); state.lastDate = todayISO; saveState();
  }
  const currentWeekStr = getYearAndWeek(now); const lastWeeklyReport = localStorage.getItem('flow_last_weekly_report_week');
  const isSundayEvening = now.getDay() === 0 && now.getHours() >= 18;
  const weeklyReportTriggeredThisWeek = localStorage.getItem('flow_weekly_report_triggered_' + currentWeekStr) === 'true';
  if ((lastWeeklyReport && lastWeeklyReport !== currentWeekStr) || (isSundayEvening && !weeklyReportTriggeredThisWeek)) {
    const weekToReport = (isSundayEvening && !weeklyReportTriggeredThisWeek) ? currentWeekStr : (lastWeeklyReport || currentWeekStr);
    const { reportText, filename } = generateReportContent('weekly', weekToReport); triggerAutomaticDownload(reportText, filename);
    localStorage.setItem('flow_last_weekly_report_week', currentWeekStr); localStorage.setItem('flow_weekly_report_triggered_' + currentWeekStr, 'true');
    showToast(lang === 'de' ? `Automatischer Wochenbericht (${weekToReport}) heruntergeladen! 📊` : `Automatic weekly report (${weekToReport}) downloaded! 📊`);
  }
  const currentMonthStr = todayISO.substring(0, 7); const lastMonthlyReport = localStorage.getItem('flow_last_monthly_report_month');
  if (lastMonthlyReport && lastMonthlyReport !== currentMonthStr) {
    const { reportText, filename } = generateReportContent('monthly', lastMonthlyReport); triggerAutomaticDownload(reportText, filename);
    localStorage.setItem('flow_last_monthly_report_month', currentMonthStr);
    showToast(lang === 'de' ? `Automatischer Monatsbericht (${lastMonthlyReport}) heruntergeladen! 📊` : `Automatic monthly report (${lastMonthlyReport}) downloaded! 📊`);
  }
}

function triggerManualReportDownload(timeframe) {
  const { reportText, filename } = generateReportContent(timeframe); triggerAutomaticDownload(reportText, filename);
  showToast(currentLang === 'de' ? `Bericht heruntergeladen! 📥` : `Report downloaded! 📥`);
}

// === INTERAKTIVER INTELLIGENTER COACH-CHAT (FLOW-COACH JANNIS) ===
let chatHistory = [];

function toggleCoachChat() {
  const widget = document.getElementById('coach-chat-widget'); if (!widget) return;
  const isHidden = widget.classList.contains('hidden');
  if (isHidden) {
    widget.classList.remove('hidden'); const msgBox = document.getElementById('chat-messages-box');
    if (msgBox && msgBox.children.length === 0) { appendCoachMessage("Hallo! Ich bin dein Flow-Coach Jannis. 🧠 Wie kann ich dir heute helfen?\n\nSchreib mir einfach, wenn du abgelenkt bist, deine Aufgaben strukturieren möchtest, oder Hilfe bei einer Aufgabe suchst!"); }
  } else { widget.classList.add('hidden'); }
}

function appendCoachMessage(text) {
  const msgBox = document.getElementById('chat-messages-box'); if (!msgBox) return;
  const el = document.createElement('div'); el.className = 'chat-msg-coach animate-fade-in whitespace-pre-line'; el.innerText = text;
  msgBox.appendChild(el); msgBox.scrollTop = msgBox.scrollHeight;
}

function appendUserMessage(text) {
  const msgBox = document.getElementById('chat-messages-box'); if (!msgBox) return;
  const el = document.createElement('div'); el.className = 'chat-msg-user animate-fade-in'; el.innerText = text;
  msgBox.appendChild(el); msgBox.scrollTop = msgBox.scrollHeight;
}

function sendCoachMessage() {
  const input = document.getElementById('chat-user-input'); if (!input) return; const text = input.value.trim(); if (!text) return;
  appendUserMessage(text); input.value = '';
  setTimeout(() => { const reply = getCoachReply(text); appendCoachMessage(reply); }, 750);
}

function getCoachReply(query) {
  const q = query.toLowerCase(); const lang = currentLang || 'de';
  const openDailies = (state.items?.daily || []).filter(Boolean); const openTodos = (state.items?.todo || []).filter(Boolean);
  const openTermine = (state.items?.termine || []).filter(Boolean); const totalOpen = openDailies.length + openTodos.length + openTermine.length;
  if (lang === 'de') {
    if (q.includes('hallo') || q.includes('hi ') || q.includes('hey') || q.includes('guten tag')) {
      if (totalOpen > 0) { return `Hallo! Schön, dass du da bist. 🌊 Du hast aktuell ${totalOpen} offene Aufgaben auf deinem Board.\n\nWomit möchtest du heute starten? Frag mich einfach, wenn ich dir helfen soll, eine dieser Aufgaben in kleine Teilschritte aufzuteilen!`; }
      return "Hallo! Schön, dass du da bist. 🌊 Dein Board ist im Moment wunderbar leer und erledigt. Gibt es etwas, das du für die Zukunft planen möchtest, oder willst du dich einfach entspannen?";
    }
    if (q.includes('überfordert') || q.includes('zuviel') || q.includes('zu viel') || q.includes('stress') || q.includes('panik')) {
      return "Atme erst einmal tief durch. 🧘‍♂️ Bei Überforderung hilft es, alles auszublenden.\n\nKlicke oben im Header auf 'Pause' für eine sensorische Reizpause, geführte Atemübungen, Muskeldehnen oder eine gemütliche 5-Minuten-Auszeit. Mach langsam.";
    }
    if (q.includes('was soll ich') || q.includes('was tun') || q.includes('was jetzt') || q.includes('was nun') || q.includes('hilfe')) {
      if (openDailies.length > 0) {
        const firstTask = typeof openDailies[0] === 'object' ? openDailies[0].task : openDailies[0];
        return `Ich empfehle dir, mit einer kleinen Routine zu starten. Wie wäre es mit:\n\n👉 „${firstTask}“?\n\nIch kann dir auch über den 'Was nun?'-Knopf oben rechts jederzeit eine zufällige Aufgabe vorschlagen, um dir die Entscheidung abzunehmen!`;
      } else if (openTodos.length > 0) {
        const firstTask = typeof openTodos[0] === 'object' ? openTodos[0].task : openTodos[0];
        return `Wie wäre es, wenn wir uns heute um diese Aufgabe kümmern:\n\n👉 „${firstTask}“?\n\nDu kannst im Dock auch den Social-Skripter oder den Entscheidungs-Kompass nutzen, falls du Unterstützung brauchst.`;
      }
      return "Du hast gerade keine dringenden Aufgaben auf deinem Board! Perfekte Zeit für einen sanften Bewegungs-Impuls (Dumbbell-Symbol im Dock) oder ein wenig wohlverdiente Ruhe. 🌳";
    }
    if (q.includes('müde') || q.includes('erschöpft') || q.includes('keine kraft') || q.includes('löffel') || q.includes('spoons')) {
      return "Respektiere deine Grenzen. 🔋 Wenn deine Energie ('Spoons') niedrig ist, passe dein Board an.\n\nNutze das Sport-Symbol im Dock auf Stufe 1 (Liegend/Sitzend) oder den Entscheidungs-Kompass mit dem 'Löffel-Check', um nur das absolut Nötigste einzuplanen.";
    }
    if (q.includes('aufschieben') || q.includes('prokrastination') || q.includes('keine lust') || q.includes('unmotiviert') || q.includes('blockiert')) {
      return "Das kenne ich nur zu gut! 🧠 Versuche die 5-Minuten-Regel:\n\nStelle dir einen Timer auf 5 Minuten (oben einstellbar) und fange einfach an. Wenn du danach aufhören willst, darfst du das jederzeit! Meistens kommt man so aber direkt in den Fluss.";
    }
    if (q.includes('einkauf') || q.includes('kauf') || q.includes('shopping')) { return "Deine Einkaufsliste findest du direkt unten im macOS-Dock unter dem Korb-Symbol! Dort kannst du Artikel hinzufügen, abhaken und clevere Spartipps erhalten."; }
    if (q.includes('danke') || q.includes('super') || q.includes('toll') || q.includes('klasse') || q.includes('cool')) { return "Sehr gerne! Ich bin jederzeit hier, um dich im Fluss zu halten. Du machst das großartig! 🚀"; }
    return "Ich verstehe. Lass uns einen Schritt nach dem anderen gehen. Wenn du dich blockiert fühlst, frage mich nach der '5-Minuten-Regel' oder klicke auf 'Was nun?' für eine automatische Empfehlung.";
  } else {
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      if (totalOpen > 0) { return `Hello! Great to have you here. 🌊 You currently have ${totalOpen} open tasks on your board.\n\nWhere would you like to start? I can help you break a task down into steps!`; }
      return "Hello! Great to have you here. 🌊 Your board is beautifully clear right now. Is there anything you'd like to plan, or do you just want to relax?";
    }
    if (q.includes('overwhelm') || q.includes('stress') || q.includes('too much') || q.includes('panic')) {
      return "Take a deep breath first. 🧘‍♂️ When overwhelmed, it helps to block out the noise.\n\nClick the 'Pause' button in the header for a sensory pause or breathing exercise.";
    }
    if (q.includes('what should i') || q.includes('what to do') || q.includes('help')) {
      if (openDailies.length > 0) {
        const firstTask = typeof openDailies[0] === 'object' ? openDailies[0].task : openDailies[0];
        return `I suggest starting with a small routine. How about:\n\n👉 "${firstTask}"?\n\nYou can also click the 'What now?' button at the top for a random suggestion!`;
      }
      return "No urgent tasks on your board right now! Perfect time for a gentle stretch (dumbbell icon in the dock) or some rest. 🌳";
    }
    if (q.includes('tired') || q.includes('exhausted') || q.includes('no energy') || q.includes('spoon')) {
      return "Respect your boundaries. 🔋 If your energy (spoons) is low, adjust your plans: use the dumbbell icon on level 1 (seated/lying) or use the Compass tool in the dock for a 'Spoon Check'.";
    }
    if (q.includes('procrastinat') || q.includes('stuck') || q.includes('lazy') || q.includes('no motivation')) {
      return "I hear you! 🧠 Try the 5-minute rule:\n\nSet a timer for 5 minutes and just start. If you want to stop after 5 minutes, you are absolutely allowed to. Often, you will want to keep going!";
    }
    if (q.includes('thank')) { return "You are very welcome! I'm always here to help keep you in your flow. You are doing great! 🚀"; }
    return "I understand. Let's take it one step at a time. If you feel stuck, ask me about the '5-minute rule' or use 'What now?' for a smart recommendation.";
  }
}

function startGlobalButtonDanceParty() {
  const triggerDance = () => {
    try {
      activeDanceTimeouts.forEach(clearTimeout); activeDanceTimeouts = [];
      currentlyDancingButtons.forEach(item => { if (item.element) { item.element.classList.remove(item.className); } }); currentlyDancingButtons = [];
      const allVisibleButtons = Array.from(document.querySelectorAll('button:not(.modal-close-btn), [role="button"], .logo-dance')).filter(btn => btn.offsetWidth > 0 && btn.offsetHeight > 0);
      if (allVisibleButtons.length === 0) return;
      const dockContainer = document.querySelector('.fixed.bottom-6');
      const dockButtons = allVisibleButtons.filter(btn => dockContainer && dockContainer.contains(btn));
      const otherButtons = allVisibleButtons.filter(btn => !dockContainer || !dockContainer.contains(btn));
      const selectedButtons = [];
      if (dockButtons.length > 0) { const randomDockBtn = dockButtons[Math.floor(Math.random() * dockButtons.length)]; selectedButtons.push(randomDockBtn); }
      const shuffledOthers = [...otherButtons].sort(() => 0.5 - Math.random());
      while (selectedButtons.length < 3 && shuffledOthers.length > 0) { const nextBtn = shuffledOthers.pop(); if (!selectedButtons.includes(nextBtn)) { selectedButtons.push(nextBtn); } }
      const danceClasses = ['animate-party-wobble', 'animate-party-bounce', 'animate-party-glow', 'animate-party-pulse', 'animate-party-swing'];
      selectedButtons.forEach((btn, idx) => {
        const randomClass = danceClasses[Math.floor(Math.random() * danceClasses.length)]; const delay = idx * 220;
        const timeoutId = setTimeout(() => { btn.classList.add(randomClass); currentlyDancingButtons.push({ element: btn, className: randomClass }); }, delay);
        activeDanceTimeouts.push(timeoutId);
      });
    } catch (e) { console.error("Fehler beim globalen Button-Tanz:", e); }
  };
  triggerDance(); setInterval(triggerDance, 5000);
}

// === PAUSE-DROPDOWN-LOGIK (HEADER-FUNKTIONEN) ===
function openSafeSpaceWithTab(tab) { openSafeSpaceModal(); switchSafeSpaceTab(tab); togglePanel('pause-dropdown'); }

function triggerQuickStretch() {
  if (typeof openSportModal === 'function') {
    openSportModal(); const select = document.getElementById('sport-energy-select');
    if (select) { select.value = "1"; if (typeof generateSportSuggestion === 'function') { generateSportSuggestion(); } }
  }
  togglePanel('pause-dropdown');
}

function triggerFiveMinTeaBreak() {
  if (typeof setTimerPreset === 'function') { setTimerPreset(5); }
  if (typeof startTimer === 'function') { startTimer(); }
  if (typeof playAmbientSound === 'function') { playAmbientSound('cafe', true); }
  togglePanel('pause-dropdown');
}

function triggerBoxBreathing() { openSafeSpaceWithTab('breath'); startSafeSpaceBoxBreathingCycle(); }

function triggerEyeRelaxation() {
  openSafeSpaceModal(); switchSafeSpaceTab('breath'); stopSafeSpaceBreathCycle();
  const circle = document.getElementById('safespace-breath-circle'); const text = document.getElementById('safespace-breath-text');
  if (circle && text) {
    circle.style.transform = "scale(1.1)"; circle.style.borderColor = "rgba(20, 184, 166, 0.6)";
    text.innerHTML = currentLang === 'de' ? "<b>Warmes Palming</b><br><br>Reibe deine Hände warm & lege sie für 1 Min. über die geschlossenen Augen." : "<b>Warm Palming</b><br><br>Rub your hands warm & cup them over your closed eyes for 1 min.";
  }
  if (typeof setTimerPreset === 'function') { setTimerPreset(1); }
  if (typeof startTimer === 'function') { startTimer(); }
  togglePanel('pause-dropdown');
}

function triggerNatureBirds() {
  if (typeof setTimerPreset === 'function') { setTimerPreset(3); }
  if (typeof startTimer === 'function') { startTimer(); }
  if (typeof playAmbientSound === 'function') { playAmbientSound('birds', true); }
  togglePanel('pause-dropdown');
}

function triggerPowerNap() {
  if (typeof setTimerPreset === 'function') { setTimerPreset(20); }
  if (typeof startTimer === 'function') { startTimer(); }
  if (typeof playAmbientSound === 'function') { playAmbientSound('rain', true); }
  togglePanel('pause-dropdown');
}

function triggerShoulderSqueeze() {
  if (typeof openSportModal === 'function') {
    openSportModal(); const select = document.getElementById('sport-energy-select');
    if (select) {
      select.value = "2"; if (typeof generateSportSuggestion === 'function') { generateSportSuggestion(); }
      const box = document.getElementById('sport-suggestion-box');
      if (box) {
        const isDe = currentLang === 'de';
        box.innerHTML = `
          <h4 class="text-white font-bold text-sm font-display mb-1">${isDe ? "Schulterblatt-Squeeze 🏋️" : "Shoulder Blade Squeeze 🏋️"}</h4>
          <p class="text-xs text-gray-300 leading-relaxed font-semibold">
            ${isDe ? "Stelle dich aufrecht hin, beuge die Ellbogen im 90-Grad-Winkel. Ziehe deine Schulterblätter hinten kraftvoll zusammen, halte für 3s und lockere wieder." : "Stand tall, elbows bent at a 90-degree angle. Pull your shoulder blades firmly together behind you, hold for 3s, then release."}
          </p>
          <div class="flex items-center justify-center gap-1.5 pt-2 text-[10px] text-orange-400 font-bold uppercase tracking-wider"><i data-lucide="clock" class="w-3.5 h-3.5"></i><span>60s</span></div>
        `;
        if (typeof lucide !== 'undefined') { lucide.createIcons(); }
      }
    }
  }
  togglePanel('pause-dropdown');
}

// === SENSORISCHE REIZPAUSE (SAFE SPACE) SYSTEM-LOGIK ===
let safeSpaceBreathInterval = null; let safeSpaceBreathStep = 0; let safeSpaceNoiseActive = false; let anchorStep = 1;

const ANCHOR_STEPS = {
  de: [
    { title: "Schritt 1 von 5", text: "Finde 5 Dinge in deiner Umgebung, die du SEHEN kannst. Nimm dir Zeit, sie genau zu betrachten." },
    { title: "Schritt 2 von 5", text: "Finde 4 Dinge, die du ANFASSEN kannst (z. B. die Textur deines Pullis, eine kühle Tischplatte)." },
    { title: "Schritt 3 von 5", text: "Finde 3 Dinge, die du HÖREN kannst (z. B. das Summen des Kühlschranks, Vögel draußen)." },
    { title: "Schritt 4 von 5", text: "Finde 2 Dinge, die du RIECHEN kannst (oder Gerüche, die du in der Umgebung magst)." },
    { title: "Schritt 5 von 5", text: "Finde 1 Ding, das du SCHMECKEN kannst (oder nimm einen bewussten Schluck Wasser)." }
  ],
  en: [
    { title: "Step 1 of 5", text: "Find 5 things in your surroundings that you can SEE. Take your time to study them." },
    { title: "Step 2 of 5", text: "Find 4 things you can TOUCH (e.g., the texture of your shirt, a cool tabletop)." },
    { title: "Step 3 of 5", text: "Find 3 things you can HEAR (e.g., the hum of the computer, birds chirping)." },
    { title: "Step 4 of 5", text: "Find 2 things you can SMELL (or scents in your environment you like)." },
    { title: "Step 5 of 5", text: "Find 1 thing you can TASTE (or take a conscious sip of water)." }
  ]
};

function openSafeSpaceModal() { const modal = document.getElementById('helper-safespace-modal'); if (modal) modal.classList.remove('hidden'); startSafeSpaceBreathCycle(); }
function closeSafeSpaceModal() { const modal = document.getElementById('helper-safespace-modal'); if (modal) modal.classList.add('hidden'); stopSafeSpaceBreathCycle(); if (safeSpaceNoiseActive) { toggleSafeSpaceNoise(); } }

function switchSafeSpaceTab(tab) {
  const breathTab = document.getElementById('safespace-tab-breath'); const anchorTab = document.getElementById('safespace-tab-anchor');
  const breathPane = document.getElementById('safespace-pane-breath'); const anchorPane = document.getElementById('safespace-pane-anchor');
  if (tab === 'breath') {
    if (breathTab) breathTab.className = "flex-1 py-1.5 rounded text-teal-300 bg-teal-500/10 border border-teal-500/20";
    if (anchorTab) anchorTab.className = "flex-1 py-1.5 rounded text-gray-400 hover:text-white";
    if (breathPane) breathPane.classList.remove('hidden'); if (anchorPane) anchorPane.classList.add('hidden'); startSafeSpaceBreathCycle();
  } else {
    if (breathTab) breathTab.className = "flex-1 py-1.5 rounded text-gray-400 hover:text-white";
    if (anchorTab) anchorTab.className = "flex-1 py-1.5 rounded text-teal-300 bg-teal-500/10 border border-teal-500/20";
    if (breathPane) breathPane.classList.add('hidden'); if (anchorPane) anchorPane.classList.remove('hidden'); stopSafeSpaceBreathCycle(); resetAnchorSteps();
  }
}

function startSafeSpaceBreathCycle() {
  stopSafeSpaceBreathCycle(); const circle = document.getElementById('safespace-breath-circle'); const text = document.getElementById('safespace-breath-text');
  if (!circle || !text) return; safeSpaceBreathStep = 0;
  const runCycle = () => {
    if (safeSpaceBreathStep === 0) { text.innerText = currentLang === 'de' ? "Einatmen... (4s)" : "Inhale... (4s)"; circle.style.transform = "scale(1.35)"; circle.style.borderColor = "rgba(20, 184, 166, 0.8)"; safeSpaceBreathStep = 1; } 
    else if (safeSpaceBreathStep === 1) { text.innerText = currentLang === 'de' ? "Anhalten... (4s)" : "Hold... (4s)"; circle.style.transform = "scale(1.35)"; circle.style.borderColor = "rgba(245, 158, 11, 0.6)"; safeSpaceBreathStep = 2; } 
    else { text.innerText = currentLang === 'de' ? "Ausatmen... (4s)" : "Exhale... (4s)"; circle.style.transform = "scale(0.95)"; circle.style.borderColor = "rgba(20, 184, 166, 0.4)"; safeSpaceBreathStep = 0; }
  };
  runCycle(); safeSpaceBreathInterval = setInterval(runCycle, 4000);
}

function startSafeSpaceBoxBreathingCycle() {
  stopSafeSpaceBreathCycle(); const circle = document.getElementById('safespace-breath-circle'); const text = document.getElementById('safespace-breath-text');
  if (!circle || !text) return; safeSpaceBreathStep = 0;
  const runBoxCycle = () => {
    if (safeSpaceBreathStep === 0) { text.innerText = currentLang === 'de' ? "Einatmen... (4s)" : "Inhale... (4s)"; circle.style.transform = "scale(1.35)"; circle.style.borderColor = "rgba(20, 184, 166, 0.8)"; safeSpaceBreathStep = 1; } 
    else if (safeSpaceBreathStep === 1) { text.innerText = currentLang === 'de' ? "Halten... (4s)" : "Hold... (4s)"; circle.style.transform = "scale(1.35)"; circle.style.borderColor = "rgba(245, 158, 11, 0.6)"; safeSpaceBreathStep = 2; } 
    else if (safeSpaceBreathStep === 2) { text.innerText = currentLang === 'de' ? "Ausatmen... (4s)" : "Exhale... (4s)"; circle.style.transform = "scale(0.95)"; circle.style.borderColor = "rgba(20, 184, 166, 0.4)"; safeSpaceBreathStep = 3; } 
    else { text.innerText = currentLang === 'de' ? "Leere halten... (4s)" : "Hold empty... (4s)"; circle.style.transform = "scale(0.95)"; circle.style.borderColor = "rgba(239, 68, 68, 0.4)"; safeSpaceBreathStep = 0; }
  };
  runBoxCycle(); safeSpaceBreathInterval = setInterval(runBoxCycle, 4000);
}

function stopSafeSpaceBreathCycle() { if (safeSpaceBreathInterval) { clearInterval(safeSpaceBreathInterval); safeSpaceBreathInterval = null; } }

function toggleSafeSpaceNoise() {
  safeSpaceNoiseActive = !safeSpaceNoiseActive; const btn = document.getElementById('safespace-noise-btn'); if (!btn) return;
  if (safeSpaceNoiseActive) {
    btn.innerText = currentLang === 'de' ? "Regen-Sound aus" : "Stop Rain Sound"; btn.className = "px-3.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 text-xs font-bold rounded-lg transition";
    if (typeof playAmbientSound === 'function') { playAmbientSound('rain', true); }
  } else {
    btn.innerText = currentLang === 'de' ? "Regen-Sound ein" : "Start Rain Sound"; btn.className = "px-3.5 py-1.5 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-300 text-xs font-bold rounded-lg transition";
    if (typeof stopAmbientSound === 'function') { stopAmbientSound(true); }
  }
}

function resetAnchorSteps() { anchorStep = 1; updateAnchorStepUI(); }
function nextAnchorStep() { anchorStep++; if (anchorStep > 5) { showToast(currentLang === 'de' ? "Erdung erfolgreich abgeschlossen! 🧘‍♂️" : "Grounding completed successfully! 🧘‍♂️"); closeSafeSpaceModal(); } else { updateAnchorStepUI(); if (typeof playProceduralSound === 'function') { playProceduralSound(3); } } }

function updateAnchorStepUI() {
  const titleEl = document.getElementById('anchor-step-title'); const textEl = document.getElementById('anchor-step-instruction');
  const progressEl = document.getElementById('anchor-progress-bar'); if (!titleEl || !textEl || !progressEl) return;
  const lang = currentLang === 'de' ? 'de' : 'en'; const steps = ANCHOR_STEPS[lang]; const stepData = steps[anchorStep - 1];
  titleEl.innerText = stepData.title; textEl.innerText = stepData.text; progressEl.style.width = `${anchorStep * 20}%`;
}

function getYearAndWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7; d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function generateReportContent(timeframe, targetVal) {
  const now = new Date(); const todayISO = now.toISOString().split('T')[0];
  let title = "Bericht"; let filename = "report.txt"; let filtered = [];
  if (timeframe === 'daily') {
    title = `Tagesbericht (${targetVal || todayISO})`; filename = `flow-daily-${targetVal || todayISO}.txt`;
    filtered = (state.done || []).filter(item => item.date === (targetVal || todayISO));
  } else if (timeframe === 'weekly') {
    title = `Wochenbericht (KW ${targetVal || getYearAndWeek(now)})`; filename = `flow-weekly-${targetVal || getYearAndWeek(now)}.txt`;
    const last7Days = []; for (let i = 0; i < 7; i++) { const d = new Date(); d.setDate(now.getDate() - i); last7Days.push(d.toISOString().split('T')[0]); }
    filtered = (state.done || []).filter(item => last7Days.includes(item.date));
  } else if (timeframe === 'monthly') {
    title = `Monatsbericht (${targetVal || todayISO.substring(0, 7)})`; filename = `flow-monthly-${targetVal || todayISO.substring(0, 7)}.txt`;
    const targetMonth = targetVal || todayISO.substring(0, 7); filtered = (state.done || []).filter(item => item.date && item.date.startsWith(targetMonth));
  }
  let text = `========================================\n   FLOW ADHD PLANNER - ${title.toUpperCase()}\n========================================\n\n`;
  text += `Generiert am: ${now.toLocaleString()}\n\nERLEDIGTE AUFGABEN (${filtered.length}):\n----------------------------------------\n`;
  if (filtered.length === 0) { text += `Keine Aufgaben erledigt.\n`; } 
  else { filtered.forEach((item, idx) => { text += `${idx + 1}. [${item.time || 'xx:xx'}] [${item.origin || 'general'}] ${item.task}\n`; }); }
  text += `\n========================================\nEnde des Berichts. Bleib im Flow!\n========================================\n`;
  return { reportText: text, filename };
}

function exportReportAsImage() {
  const target = document.getElementById('report-export-target'); if (!target) return;
  html2canvas(target, { backgroundColor: '#111116', scale: 2, logging: false, useCORS: true }).then(canvas => {
    const a = document.createElement('a'); a.href = canvas.toDataURL('image/png');
    a.download = `flow-report-${reportTimeframe}-${new Date().toISOString().split('T')[0]}.png`; a.click();
  });
}

function formatTerminDate(dateStr, timeStr) {
  if (!dateStr) return ''; const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0'); const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear(); const time = timeStr ? ` ${timeStr}` : ''; return `${day}.${month}.${year}${time}`;
}

// app-feedback.js - Intuitives & hochwertiges Feedback- & Bewertungssystem
// ============================================================================

let currentFeedbackCategories = new Set(['rating', 'idea']);
let currentFeedbackRating = 5;
let isSubmittingFeedback = false;

function getFeedbackTranslations() {
  const lang = (typeof currentLang !== 'undefined') ? currentLang : 'de';
  const dict = {
    de: {
      title: 'Feedback, Bewertung & Wünsche',
      subtitle: 'Deine Meinung formt Noodle — direkt & unkompliziert',
      cat_rating: '⭐ Bewertung',
      cat_idea: '💡 Feature-Idee',
      cat_bug: '🐛 Fehler melden',
      cat_hello: '💬 Hallo & Sonstiges',
      rating_label: 'Deine Gesamtbewertung:',
      rating_1: 'Verbesserungsfähig',
      rating_2: 'Geht so',
      rating_3: 'Gut & nützlich',
      rating_4: 'Sehr gut & hilfreich',
      rating_5: 'Absolut fantastisch! ✨',
      msg_placeholder_default: 'Teile deine Gedanken, neue Feature-Wünsche oder was dir besonders gut gefällt...',
      msg_placeholder_bug: 'Was ist passiert? Welche Schritte führen zum Fehler?',
      msg_placeholder_idea: 'Welche Funktion oder Verbesserung würde deinen Workflow bereichern?',
      msg_placeholder_hello: 'Schreib mir einfach einen kurzen Gruß oder Feedback zum Alltag mit Noodle...',
      contact_label: 'Name oder E-Mail (optional für Rückfragen)',
      contact_placeholder: 'z.B. name@beispiel.de (kann frei bleiben)',
      send_btn: 'Feedback jetzt absenden 🚀',
      sending_btn: 'Wird übertragen... ✨',
      success_title: 'Vielen Dank für dein Feedback! ❤️',
      success_desc: 'Deine Nachricht wurde direkt übertragen und hilft, Noodle noch besser zu machen.',
      direct_email_hint: 'Alternativ erreichst du mich direkt per E-Mail unter',
      close_btn: 'Schließen',
      err_empty: 'Bitte wähle eine Bewertung oder schreibe eine kurze Nachricht.'
    },
    en: {
      title: 'Feedback, Rating & Ideas',
      subtitle: 'Your thoughts shape Noodle — fast & straightforward',
      cat_rating: '⭐ Rating',
      cat_idea: '💡 Feature Idea',
      cat_bug: '🐛 Report Bug',
      cat_hello: '💬 Say Hello / Other',
      rating_label: 'Your Overall Rating:',
      rating_1: 'Needs improvement',
      rating_2: 'Fair',
      rating_3: 'Good & useful',
      rating_4: 'Very good & helpful',
      rating_5: 'Absolutely fantastic! ✨',
      msg_placeholder_default: 'Share your thoughts, feature requests, or what you love most...',
      msg_placeholder_bug: 'What happened? What steps lead to the issue?',
      msg_placeholder_idea: 'What feature or improvement would enhance your workflow?',
      msg_placeholder_hello: 'Drop a friendly hello or thoughts on your daily routine with Noodle...',
      contact_label: 'Name or Email (optional for replies)',
      contact_placeholder: 'e.g. name@example.com (optional)',
      send_btn: 'Send Feedback Now 🚀',
      sending_btn: 'Sending... ✨',
      success_title: 'Thank you for your feedback! ❤️',
      success_desc: 'Your message was delivered directly and helps make Noodle even better.',
      direct_email_hint: 'Alternatively, email me directly at',
      close_btn: 'Close',
      err_empty: 'Please select a rating or enter a brief message.'
    },
    fr: {
      title: 'Avis, Évaluation & Idées',
      subtitle: 'Tes retours façonnent Noodle — simple & direct',
      cat_rating: '⭐ Évaluation',
      cat_idea: '💡 Idée / Fonctionnalité',
      cat_bug: '🐛 Signaler un bug',
      cat_hello: '💬 Bonjour / Autre',
      rating_label: 'Ton évaluation globale :',
      rating_1: 'À améliorer',
      rating_2: 'Moyen',
      rating_3: 'Bon & utile',
      rating_4: 'Très bon',
      rating_5: 'Absolument fantastique ! ✨',
      msg_placeholder_default: 'Partage tes pensées, idées ou ce qui te plaît...',
      msg_placeholder_bug: 'Que s\'est-il passé ? Quelles étapes mènent au problème ?',
      msg_placeholder_idea: 'Quelle fonctionnalité enrichirait ton flux de travail ?',
      msg_placeholder_hello: 'Envoie un petit mot ou tes réflexions sur Noodle...',
      contact_label: 'Nom ou E-mail (facultatif)',
      contact_placeholder: 'ex. nom@exemple.fr (facultatif)',
      send_btn: 'Envoyer mes retours 🚀',
      sending_btn: 'Envoi en cours... ✨',
      success_title: 'Merci beaucoup pour tes retours ! ❤️',
      success_desc: 'Ton message a bien été transmis directement.',
      direct_email_hint: 'Tu peux aussi m\'écrire directement par e-mail à',
      close_btn: 'Fermer',
      err_empty: 'Veuillez sélectionner une note ou écrire un court message.'
    },
    es: {
      title: 'Opinión, Valoración & Ideas',
      subtitle: 'Tus sugerencias mejoran Noodle — directo e intuitivo',
      cat_rating: '⭐ Valoración',
      cat_idea: '💡 Nueva idea',
      cat_bug: '🐛 Reportar fallo',
      cat_hello: '💬 Saludar / Otro',
      rating_label: 'Tu valoración general:',
      rating_1: 'Mejorable',
      rating_2: 'Regular',
      rating_3: 'Bueno y útil',
      rating_4: 'Muy bueno',
      rating_5: '¡Totalmente fantástico! ✨',
      msg_placeholder_default: 'Comparte tus pensamientos, propuestas o lo que más te guste...',
      msg_placeholder_bug: '¿Qué ocurrió? ¿Qué pasos reproducen el error?',
      msg_placeholder_idea: '¿Qué función mejoraría tu rutina diaria?',
      msg_placeholder_hello: 'Manda un saludo o tus comentarios sobre Noodle...',
      contact_label: 'Nombre o Email (opcional)',
      contact_placeholder: 'ej. nombre@ejemplo.com (opcional)',
      send_btn: 'Enviar opinión ahora 🚀',
      sending_btn: 'Enviando... ✨',
      success_title: '¡Muchas gracias por tu opinión! ❤️',
      success_desc: 'Tu mensaje ha sido enviado directamente.',
      direct_email_hint: 'Alternativamente puedes escribirme directamente a',
      close_btn: 'Cerrar',
      err_empty: 'Por favor selecciona una valoración o escribe un mensaje.'
    },
    it: {
      title: 'Feedback, Valutazione & Idee',
      subtitle: 'La tua opinione migliora Noodle — veloce e diretto',
      cat_rating: '⭐ Valutazione',
      cat_idea: '💡 Idea / Feature',
      cat_bug: '🐛 Segnala errore',
      cat_hello: '💬 Ciao / Altro',
      rating_label: 'La tua valutazione:',
      rating_1: 'Migliorabile',
      rating_2: 'Così così',
      rating_3: 'Buono e utile',
      rating_4: 'Ottimo',
      rating_5: 'Davvero fantastico! ✨',
      msg_placeholder_default: 'Condividi pensieri, desideri o cosa ti piace di più...',
      msg_placeholder_bug: 'Cosa è successo? Quali passaggi portano all\'errore?',
      msg_placeholder_idea: 'Quale funzionalità arricchirebbe il tuo flusso di lavoro?',
      msg_placeholder_hello: 'Scrivi un saluto o una riflessione su Noodle...',
      contact_label: 'Nome o Email (opzionale)',
      contact_placeholder: 'es. nome@esempio.it (opzionale)',
      send_btn: 'Invia feedback 🚀',
      sending_btn: 'Invio in corso... ✨',
      success_title: 'Grazie mille per il tuo feedback! ❤️',
      success_desc: 'Il tuo messaggio è stato trasmesso direttamente.',
      direct_email_hint: 'In alternativa puoi scrivermi direttamente a',
      close_btn: 'Chiudi',
      err_empty: 'Seleziona una valutazione o scrivi un messaggio.'
    },
    el: {
      title: 'Σχόλια, Αξιολόγηση & Ιδέες',
      subtitle: 'Η γνώμη σου εξελίσσει το Noodle — άμεσα & απλά',
      cat_rating: '⭐ Αξιολόγηση',
      cat_idea: '💡 Νέα ιδέα / Feature',
      cat_bug: '🐛 Αναφορά σφάλματος',
      cat_hello: '💬 Χαιρετισμός / Άλλο',
      rating_label: 'Η συνολική σου αξιολόγηση:',
      rating_1: 'Επιδέχεται βελτίωση',
      rating_2: 'Μέτριο',
      rating_3: 'Καλό & χρήσιμο',
      rating_4: 'Πολύ καλό',
      rating_5: 'Απολύτως φανταστικό! ✨',
      msg_placeholder_default: 'Μοιράσου σκέψεις, ιδέες ή τι σου αρέσει περισσότερο...',
      msg_placeholder_bug: 'Τι συνέβη; Ποια βήματα οδηγούν στο σφάλμα;',
      msg_placeholder_idea: 'Ποια λειτουργία θα βελτίωνε τη ροή εργασίας σου;',
      msg_placeholder_hello: 'Στείλε έναν χαιρετισμό ή σχόλια για το Noodle...',
      contact_label: 'Όνομα ή Email (προαιρετικό)',
      contact_placeholder: 'π.χ. name@example.gr (προαιρετικό)',
      send_btn: 'Αποστολή σχολίων 🚀',
      sending_btn: 'Αποστολή... ✨',
      success_title: 'Ευχαριστούμε θερμά για τα σχόλιά σου! ❤️',
      success_desc: 'Το μήνυμά σου στάλθηκε επιτυχώς.',
      direct_email_hint: 'Εναλλακτικά μπορείς να μου στείλεις email στο',
      close_btn: 'Κλείσιμο',
      err_empty: 'Παρακαλώ επίλεξε αξιολόγηση ή γράψε ένα σύντομο μήνυμα.'
    }
  };
  return dict[lang] || dict.de;
}

function openFeedbackModal(defaultCategory = null) {
  if (defaultCategory) {
    currentFeedbackCategories = new Set([defaultCategory]);
  }
  let modal = document.getElementById('app-feedback-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'app-feedback-modal';
    modal.className = 'fixed inset-0 z-[170000] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fade-in select-none';
    document.body.appendChild(modal);
  }

  renderFeedbackModalContent();
  modal.classList.remove('hidden');

  if (typeof triggerHapticFeedback === 'function') triggerHapticFeedback('light');
}

function closeFeedbackModal() {
  const modal = document.getElementById('app-feedback-modal');
  if (modal) modal.classList.add('hidden');
}

function toggleFeedbackCategory(catKey) {
  if (currentFeedbackCategories.has(catKey)) {
    if (currentFeedbackCategories.size > 1) {
      currentFeedbackCategories.delete(catKey);
    }
  } else {
    currentFeedbackCategories.add(catKey);
  }
  renderFeedbackModalContent();
}

function setFeedbackRating(stars) {
  currentFeedbackRating = Math.max(1, Math.min(5, stars));
  if (!currentFeedbackCategories.has('rating')) {
    currentFeedbackCategories.add('rating');
  }
  renderFeedbackModalContent();
}

function renderFeedbackModalContent(isSuccess = false) {
  const modal = document.getElementById('app-feedback-modal');
  if (!modal) return;
  const T = getFeedbackTranslations();

  if (isSuccess) {
    modal.innerHTML = `
      <div class="mobile-modal-card animate-spring-modal w-full max-w-lg bg-[#0f0f18]/98 border border-emerald-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden flex flex-col items-center">
        <div class="absolute -top-24 -left-24 w-52 h-52 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center text-3xl mb-4 shadow-lg animate-bounce">
          ❤️
        </div>
        <h3 class="text-xl font-black font-display text-white mb-2">${T.success_title}</h3>
        <p class="text-xs text-gray-300 max-w-md mb-6 leading-relaxed">${T.success_desc}</p>
        <button onclick="closeFeedbackModal()" class="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition cursor-pointer">
          ${T.close_btn}
        </button>
      </div>
    `;
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    return;
  }

  // Determine dynamic placeholder
  let placeholder = T.msg_placeholder_default;
  if (currentFeedbackCategories.has('bug') && !currentFeedbackCategories.has('idea')) {
    placeholder = T.msg_placeholder_bug;
  } else if (currentFeedbackCategories.has('idea') && !currentFeedbackCategories.has('bug')) {
    placeholder = T.msg_placeholder_idea;
  } else if (currentFeedbackCategories.has('hello') && currentFeedbackCategories.size === 1) {
    placeholder = T.msg_placeholder_hello;
  }

  const ratingDesc = T['rating_' + currentFeedbackRating] || '';
  const prevText = document.getElementById('feedback-modal-msg')?.value || '';
  const prevContact = document.getElementById('feedback-modal-contact')?.value || '';

  modal.innerHTML = `
    <div class="mobile-modal-card animate-spring-modal w-full max-w-lg bg-[#10101a]/98 border border-purple-500/40 rounded-3xl shadow-2xl p-5 sm:p-7 text-left relative overflow-hidden flex flex-col max-h-[92vh]">
      
      <!-- Background Aura Glows -->
      <div class="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Top Header -->
      <div class="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-sm shrink-0">
            <i data-lucide="sparkles" class="w-4 h-4 text-purple-300"></i>
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-black font-display text-white leading-tight">${T.title}</h3>
            <p class="text-[11px] text-purple-300/80">${T.subtitle}</p>
          </div>
        </div>
        <button onclick="closeFeedbackModal()" class="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer font-bold text-base">✕</button>
      </div>

      <!-- Scrollable Form Body -->
      <div class="overflow-y-auto py-3 space-y-3.5 custom-scrollbar pr-0.5">
        
        <!-- Category Multi-Select Chips -->
        <div>
          <label class="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1.5">Wähle oder kombiniere Themen:</label>
          <div class="flex flex-wrap gap-1.5">
            <button type="button" onclick="toggleFeedbackCategory('rating')" class="px-2.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${currentFeedbackCategories.has('rating') ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 shadow-sm' : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200'}">
              ${T.cat_rating}
            </button>
            <button type="button" onclick="toggleFeedbackCategory('idea')" class="px-2.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${currentFeedbackCategories.has('idea') ? 'bg-purple-500/25 border-purple-400/60 text-purple-200 shadow-sm' : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200'}">
              ${T.cat_idea}
            </button>
            <button type="button" onclick="toggleFeedbackCategory('bug')" class="px-2.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${currentFeedbackCategories.has('bug') ? 'bg-rose-500/20 border-rose-400/60 text-rose-200 shadow-sm' : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200'}">
              ${T.cat_bug}
            </button>
            <button type="button" onclick="toggleFeedbackCategory('hello')" class="px-2.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${currentFeedbackCategories.has('hello') ? 'bg-teal-500/20 border-teal-400/60 text-teal-200 shadow-sm' : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200'}">
              ${T.cat_hello}
            </button>
          </div>
        </div>

        <!-- 5-Star Interactive Rating -->
        <div class="p-3 bg-black/40 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span class="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-0.5">${T.rating_label}</span>
            <span class="text-xs font-bold text-amber-300">${currentFeedbackRating} / 5 Sterne · ${ratingDesc}</span>
          </div>
          <div class="flex items-center gap-1">
            ${[1, 2, 3, 4, 5].map(star => `
              <button type="button" onclick="setFeedbackRating(${star})" class="text-xl sm:text-2xl transition-transform hover:scale-125 active:scale-95 cursor-pointer p-0.5" title="${star} / 5 Sterne">
                ${star <= currentFeedbackRating ? '⭐' : '☆'}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Message Textarea -->
        <div>
          <label for="feedback-modal-msg" class="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">Deine Nachricht / Vorschlag:</label>
          <textarea id="feedback-modal-msg" rows="4" placeholder="${placeholder}" class="w-full p-3 bg-black/60 border border-white/15 focus:border-purple-400/80 rounded-2xl text-xs text-white placeholder:text-gray-500 outline-none transition custom-scrollbar font-sans resize-y leading-relaxed">${prevText}</textarea>
        </div>

        <!-- Optional Contact Field -->
        <div>
          <label for="feedback-modal-contact" class="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">${T.contact_label}:</label>
          <input type="text" id="feedback-modal-contact" value="${prevContact}" placeholder="${T.contact_placeholder}" class="w-full p-2.5 px-3 bg-black/60 border border-white/15 focus:border-purple-400/80 rounded-xl text-xs text-white placeholder:text-gray-500 outline-none transition" />
        </div>

      </div>

      <!-- Footer & Direct Send Action -->
      <div class="pt-3 border-t border-white/10 shrink-0 flex flex-col gap-2">
        <button id="feedback-submit-btn" onclick="submitAppFeedback()" class="w-full py-3 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl text-xs font-black shadow-lg hover:shadow-purple-500/25 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2">
          <span>${T.send_btn}</span>
        </button>

        <!-- Subtle Direct Mail Notice -->
        <p class="text-[10.5px] text-gray-400 text-center leading-normal">
          ${T.direct_email_hint} <a href="mailto:jmonke@gmail.com" class="text-purple-300 hover:text-purple-200 underline font-mono">jmonke@gmail.com</a>
        </p>
      </div>

    </div>
  `;

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

async function submitAppFeedback() {
  if (isSubmittingFeedback) return;
  const T = getFeedbackTranslations();
  const msgEl = document.getElementById('feedback-modal-msg');
  const contactEl = document.getElementById('feedback-modal-contact');
  const submitBtn = document.getElementById('feedback-submit-btn');

  const message = msgEl ? msgEl.value.trim() : '';
  const contact = contactEl ? contactEl.value.trim() : 'Anonym';
  const categories = Array.from(currentFeedbackCategories);
  const rating = currentFeedbackRating;

  if (!message && rating <= 0 && categories.length === 0) {
    if (typeof showToast === 'function') showToast(T.err_empty);
    return;
  }

  isSubmittingFeedback = true;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>${T.sending_btn}</span>`;
  }

  const payload = {
    rating: rating,
    categories: categories,
    message: message || `Bewertung: ${rating} / 5 Sterne`,
    contact: contact || 'Anonym',
    app: 'Noodle',
    timestamp: new Date().toISOString()
  };

  let isSent = false;

  // Client-Side Webhook (FormSubmit - sendet zuverlässig auch bei statischem Hosting / GitHub Pages)
  try {
    const fsRes = await fetch('https://formsubmit.co/ajax/jmonke@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `Noodle App Feedback: [${categories.join(', ')}] (${rating}/5 ⭐)`,
        Rating: `${rating} / 5 Sterne`,
        Kategorien: categories.join(', '),
        Nachricht: message,
        Kontakt: contact,
        App: 'Noodle'
      })
    });
    if (fsRes.ok) {
      isSent = true;
    }
  } catch (fsErr) {
    console.warn('[Feedback] Webhook notice:', fsErr);
  }

  isSubmittingFeedback = false;
  renderFeedbackModalContent(true);
  if (typeof triggerPraise === 'function') triggerPraise();

  // Automatisches Schließen nach 2 Sekunden
  setTimeout(() => {
    closeFeedbackModal();
    currentFeedbackCategories = new Set(['rating', 'idea']);
    currentFeedbackRating = 5;
  }, 2200);
}

if (typeof window !== 'undefined') {
  window.openFeedbackModal = openFeedbackModal;
  window.closeFeedbackModal = closeFeedbackModal;
  window.toggleFeedbackCategory = toggleFeedbackCategory;
  window.setFeedbackRating = setFeedbackRating;
  window.submitAppFeedback = submitAppFeedback;
}
if (typeof globalThis !== 'undefined') {
  globalThis.openFeedbackModal = openFeedbackModal;
  globalThis.closeFeedbackModal = closeFeedbackModal;
  globalThis.submitAppFeedback = submitAppFeedback;
}

async function submitAppFeedbackDirect() {
  const quickInput = document.getElementById('feedback-text');
  const msg = quickInput ? quickInput.value.trim() : '';
  if (!msg) {
    if (typeof showToast === 'function') {
      showToast((typeof tr === 'function') ? tr({ de: 'Bitte gib eine kurze Nachricht ein.', en: 'Please enter a short message.' }) : 'Bitte Nachricht eingeben.');
    }
    return;
  }

  try {
    fetch('https://formsubmit.co/ajax/jmonke@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: 'Noodle Feedback (Logo Popover)',
        Rating: '5 / 5 Sterne',
        Nachricht: msg,
        App: 'Noodle',
        Quelle: 'Logo Popover'
      })
    }).catch(err => console.warn('[Feedback] Direct fetch error:', err));
  } catch(e) {
    console.warn('[Feedback] submitAppFeedbackDirect exception:', e);
  }

  if (quickInput) quickInput.value = '';
  if (typeof togglePanel === 'function') togglePanel('feedback');
  if (typeof showToast === 'function') {
    showToast((typeof tr === 'function') ? tr({ de: 'Vielen Dank für dein Feedback! ❤️', en: 'Thank you for your feedback! ❤️' }) : 'Vielen Dank für dein Feedback! ❤️');
  }
  if (typeof triggerPraise === 'function') triggerPraise();
}
window.submitAppFeedbackDirect = submitAppFeedbackDirect;
if (typeof globalThis !== 'undefined') globalThis.submitAppFeedbackDirect = submitAppFeedbackDirect;

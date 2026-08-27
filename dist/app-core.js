// app-core.js: Kernlogik (Theme, Sprache, Icons, UI-Verhalten). Uebersetzungsdaten siehe data-custom-translations.js

// Global Error Boundary & Crash-Protection (Produktionsreife)
window.addEventListener('error', (event) => {
  console.warn('[Flow Global Error Boundary Guard]', event.error || event.message);
});
window.addEventListener('unhandledrejection', (event) => {
  console.warn('[Flow Unhandled Promise Guard]', event.reason);
});

let currentZenTaskInfo = null; let lastSelectedSound = 'birds'; let draggedColumnId = null; let selectedCalendarDate = null; 

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

function switchImpulseTab(tabName) {
  const tabs = ['spark', 'inspire', 'clarity'];
  tabs.forEach(t => {
    const btn = document.getElementById(`impulse-tab-btn-${t}`);
    const pane = document.getElementById(`impulse-pane-${t}`);
    if (btn) {
      if (t === tabName) {
        btn.className = 'flex-1 py-1.5 rounded-xl text-white bg-amber-500/30 border border-amber-500/50 transition flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold shadow-md';
      } else {
        btn.className = 'flex-1 py-1.5 rounded-xl text-gray-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer text-xs font-medium';
      }
    }
    if (pane) {
      if (t === tabName) {
        pane.classList.remove('hidden');
      } else {
        pane.classList.add('hidden');
      }
    }
  });
  if (tabName === 'spark') suggestBoostActivity();
  if (tabName === 'inspire') suggestInspirationQuote();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
window.switchImpulseTab = switchImpulseTab;

function handleSoundsMainClick() { togglePanel('soundscape'); }
function handleMusicMainClick() { togglePanel('music'); }

// Performance: MutationObserver komplett entfernt, da redundant und Hauptursache für UI-Verzögerungen.

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
      togglePanel('impulse');
      switchImpulseTab('spark');
      break;
    case 'i':
      e.preventDefault();
      togglePanel('impulse');
      switchImpulseTab('inspire');
      break;
    case 'o':
      e.preventDefault();
      openSportModal();
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
      closeAllPanelsAndModals();
      break;
  }
});

function closeAllPanelsAndModals() {
  if (typeof closeHelperModal === 'function') closeHelperModal();
  if (typeof closeSportModal === 'function') closeSportModal();
  if (typeof closeSafeSpaceModal === 'function') closeSafeSpaceModal();
  if (typeof closeCustomItemModal === 'function') closeCustomItemModal();
  if (typeof closePrivacyModal === 'function') closePrivacyModal();
  if (typeof closeArchiveModal === 'function') closeArchiveModal();
  if (typeof closeExportModal === 'function') closeExportModal();
  if (typeof closeImportModal === 'function') closeImportModal();
  if (typeof closeDiceModal === 'function') closeDiceModal();
  if (typeof closeRouletteModal === 'function') closeRouletteModal();
  if (typeof closeGameModal === 'function') closeGameModal();
  if (typeof closeReportDashboard === 'function') closeReportDashboard();
  if (typeof closeSettingsModal === 'function') closeSettingsModal();
  if (typeof closeCommandPalette === 'function') closeCommandPalette();
  if (typeof closeKeyboardShortcuts === 'function') closeKeyboardShortcuts();
  if (typeof closeP2PSyncModal === 'function') closeP2PSyncModal();
  if (typeof closeMobileQuickMenu === 'function') closeMobileQuickMenu();

  const allPanels = document.querySelectorAll('[id^="panel-"]');
  allPanels.forEach(p => p.classList.add('hidden'));
}
window.closeAllPanelsAndModals = closeAllPanelsAndModals;

function openMobileQuickMenu() {
  const modal = document.getElementById('modal-mobile-quick-menu');
  if (modal) {
    modal.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}
window.openMobileQuickMenu = openMobileQuickMenu;

function closeMobileQuickMenu() {
  const modal = document.getElementById('modal-mobile-quick-menu');
  if (modal) modal.classList.add('hidden');
}
window.closeMobileQuickMenu = closeMobileQuickMenu;

// SPARKLES & CELEBRATION CANVAS PARTICLES (PURE VANILLA JS)
function triggerSparkleEffect(x, y) {
  try {
    const canvas = document.createElement('canvas');
    canvas.className = 'fixed inset-0 pointer-events-none z-[150000]';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) { canvas.remove(); return; }

    const originX = x || (window.innerWidth / 2);
    const originY = y || (window.innerHeight / 3);

    const particles = [];
    const colors = ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ffffff', '#c084fc'];
    for (let i = 0; i < 36; i++) {
      const angle = (Math.PI * 2 * i) / 36 + (Math.random() - 0.5) * 0.5;
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
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18; // Gravity
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
    }
    requestAnimationFrame(animate);
  } catch (e) {
    console.warn('triggerSparkleEffect error:', e);
  }
}
window.triggerSparkleEffect = triggerSparkleEffect;

// COMMAND PALETTE (STRG+K / CMD+K) CONTROLLER
let commandPaletteActiveIndex = 0;

function openCommandPalette() {
  const modal = document.getElementById('modal-command-palette');
  const input = document.getElementById('cmd-palette-input');
  if (!modal || !input) return;
  modal.classList.remove('hidden');
  input.value = '';
  filterCommandPalette('');
  setTimeout(() => input.focus(), 50);
}

function closeCommandPalette() {
  const modal = document.getElementById('modal-command-palette');
  if (modal) modal.classList.add('hidden');
}

function getAvailableCommands() {
  return [
    { id: 'timer_25', title: '⏱️ Fokus-Timer: 25 Minuten starten', action: () => { if (typeof setTimer === 'function') setTimer(25); if (typeof startTimer === 'function') startTimer(); } },
    { id: 'timer_15', title: '⏱️ Fokus-Timer: 15 Minuten starten', action: () => { if (typeof setTimer === 'function') setTimer(15); if (typeof startTimer === 'function') startTimer(); } },
    { id: 'timer_45', title: '⏱️ Fokus-Timer: 45 Minuten starten', action: () => { if (typeof setTimer === 'function') setTimer(45); if (typeof startTimer === 'function') startTimer(); } },
    { id: 'ws_switch', title: '🔄 Workspace wechseln (Privat / Arbeit)', action: () => { if (typeof toggleWorkspace === 'function') toggleWorkspace(); } },
    { id: 'dashboard', title: '📊 Detail-Statistik & Analyse-Dashboard', action: () => { if (typeof openReportDashboard === 'function') openReportDashboard(); } },
    { id: 'dice', title: '🎲 Zufalls-Aufgabe würfeln', action: () => { if (typeof openDiceModal === 'function') openDiceModal(); } },
    { id: 'zen', title: '🧘 Minimalistischen Fokus-Modus umschalten', action: () => { if (typeof toggleMinimalMode === 'function') toggleMinimalMode(); } },
    { id: 'theme_aurora', title: '🎨 Theme: Aurora (Lila)', action: () => { setTheme('aurora'); } },
    { id: 'theme_sage', title: '🎨 Theme: Sage (Salbeigrün)', action: () => { setTheme('sage'); } },
    { id: 'theme_forest', title: '🎨 Theme: Forest (Grün)', action: () => { setTheme('forest'); } },
    { id: 'theme_charcoal', title: '🎨 Theme: Charcoal (Graphit)', action: () => { setTheme('charcoal'); } },
    { id: 'backup_export', title: '💾 Datensicherung: Plan als JSON exportieren', action: () => { if (typeof exportData === 'function') exportData(); else if (typeof handleSaveJson === 'function') handleSaveJson(); } },
    { id: 'backup_import', title: '📥 Datensicherung: Backup wiederherstellen', action: () => { if (typeof importData === 'function') importData(); } },
    { id: 'settings', title: '⚙️ Einstellungen, Impressum & Datenschutz', action: () => { openSettingsModal('general'); } },
    { id: 'history', title: '📷 Screenshot- & Versions-Galerie', action: () => { openSettingsModal('history'); } },
    { id: 'undo', title: '↩️ Letzte Aktion rückgängig machen', action: () => { if (typeof handleUndo === 'function') handleUndo(); } }
  ];
}

function filterCommandPalette(query = '') {
  const resultsContainer = document.getElementById('cmd-palette-results');
  if (!resultsContainer) return;
  resultsContainer.innerHTML = '';
  const q = (query || '').toLowerCase().trim();

  // 1. Matched Commands
  const allCommands = getAvailableCommands();
  const matchedCommands = allCommands.filter(c => c.title.toLowerCase().includes(q));

  // 2. Open Tasks matching query
  const curItems = typeof getCurrentWorkspaceItems === 'function' ? getCurrentWorkspaceItems() : (typeof state !== 'undefined' ? state.items : {});
  const matchedTasks = [];
  if (curItems && typeof curItems === 'object') {
    Object.keys(curItems).forEach(col => {
      const items = curItems[col] || [];
      items.forEach((item, idx) => {
        const text = typeof item === 'object' ? item.task : item;
        if (text && (!q || text.toLowerCase().includes(q))) {
          matchedTasks.push({
            title: `📌 [${typeof t === 'function' ? t(col) : col}] ${text}`,
            action: () => {
              if (typeof startTaskTimerByIndex === 'function') startTaskTimerByIndex(col, idx);
              else { if (typeof setTimer === 'function') setTimer(25); if (typeof startTimer === 'function') startTimer(); }
            }
          });
        }
      });
    });
  }

  const combined = [];
  if (matchedCommands.length > 0) {
    combined.push({ isHeader: true, label: typeof t === 'function' ? t('cmd_actions') : 'Schnell-Aktionen' });
    matchedCommands.slice(0, 6).forEach(c => combined.push({ ...c, isAction: true }));
  }

  if (matchedTasks.length > 0) {
    combined.push({ isHeader: true, label: typeof t === 'function' ? t('cmd_tasks') : 'Gefundene Aufgaben' });
    matchedTasks.slice(0, 8).forEach(t => combined.push({ ...t, isAction: true }));
  }

  if (combined.filter(c => c.isAction).length === 0) {
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
  combined.forEach(item => {
    if (item.isHeader) {
      const h = document.createElement('div');
      h.className = 'px-3 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono';
      h.innerText = item.label;
      resultsContainer.appendChild(h);
    } else {
      const thisIdx = actionIdx++;
      const btn = document.createElement('button');
      btn.className = `w-full px-3 py-2 text-left rounded-xl flex items-center justify-between text-xs transition cursor-pointer ${
        thisIdx === 0 ? 'bg-purple-600/30 border border-purple-500/40 text-white font-semibold' : 'text-gray-300 hover:bg-white/5 hover:text-white'
      }`;
      btn.setAttribute('data-cmd-idx', thisIdx);
      btn.innerHTML = `
        <span class="truncate">${escapeHtml(item.title)}</span>
        <i data-lucide="arrow-right" class="w-3.5 h-3.5 opacity-40 shrink-0"></i>
      `;
      btn.onclick = () => {
        closeCommandPalette();
        item.action();
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

function openSettingsModal(tab = 'general') {
  const modal = document.getElementById('modal-settings');
  if (!modal) return;
  modal.classList.remove('hidden');
  switchSettingsTab(tab);
  renderLucideIcons();
}

function closeSettingsModal() {
  const modal = document.getElementById('modal-settings');
  if (modal) modal.classList.add('hidden');
}

function switchSettingsTab(tabName) {
  const tabs = ['general', 'history', 'impressum', 'privacy', 'licenses'];
  tabs.forEach(t => {
    const btn = document.getElementById(`settings-tab-${t}`);
    const pane = document.getElementById(`settings-pane-${t}`);
    if (btn) {
      if (t === tabName) {
        btn.className = 'py-2 px-2.5 rounded-xl bg-purple-600 text-white transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md';
      } else {
        btn.className = 'py-2 px-2.5 rounded-xl text-gray-400 hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5';
      }
    }
    if (pane) {
      if (t === tabName) pane.classList.remove('hidden');
      else pane.classList.add('hidden');
    }
  });
  if (tabName === 'history') renderHistoryGallery();
  renderLucideIcons();
}

function getHistoryScreenshots() {
  try {
    const saved = localStorage.getItem('flow_history_screenshots');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.warn('getHistoryScreenshots error:', e);
    return [];
  }
}

function saveHistoryScreenshots(list) {
  try {
    localStorage.setItem('flow_history_screenshots', JSON.stringify(list));
  } catch (e) {
    console.warn('saveHistoryScreenshots error:', e);
  }
}

function handleHistoryScreenshotUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64 = e.target.result;
    const defaultTitle = 'Screenshot ' + new Date().toLocaleDateString();
    const promptMsg = typeof tr === 'function' ? tr({
      de: 'Titel oder Notiz für diesen Screenshot (z. B. "Früher Prototyp"):',
      en: 'Title or note for this screenshot (e.g. "Early Prototype"):'
    }) : 'Titel oder Notiz für diesen Screenshot:';
    
    const userTitle = prompt(promptMsg, defaultTitle) || defaultTitle;
    const list = getHistoryScreenshots();
    list.unshift({
      id: 'shot_' + Date.now(),
      title: userTitle.trim(),
      date: new Date().toLocaleDateString(),
      data: base64
    });
    saveHistoryScreenshots(list);
    renderHistoryGallery();
  };
  reader.readAsDataURL(file);
}

function deleteHistoryScreenshot(id) {
  let list = getHistoryScreenshots();
  list = list.filter(item => item.id !== id);
  saveHistoryScreenshots(list);
  renderHistoryGallery();
}

function renderHistoryGallery() {
  const grid = document.getElementById('history-gallery-grid');
  const countEl = document.getElementById('history-gallery-count');
  if (!grid) return;
  grid.innerHTML = '';

  const customShots = getHistoryScreenshots();
  if (countEl) countEl.innerText = `${customShots.length} ${customShots.length === 1 ? 'Bild' : 'Bilder'}`;

  if (customShots.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full p-8 text-center border border-dashed border-white/10 rounded-2xl text-gray-400 space-y-2">
        <i data-lucide="image" class="w-8 h-8 text-gray-500 mx-auto mb-1"></i>
        <div class="font-bold text-xs text-gray-300">Noch keine Screenshots hinterlegt</div>
        <div class="text-[11px] text-gray-500 max-w-sm mx-auto leading-normal">Klicke oben auf „Screenshot hinzufügen 📷“, um Bilder früherer Versionen und Meilensteine hier zu sammeln.</div>
      </div>
    `;
    renderLucideIcons();
    return;
  }

  customShots.forEach(shot => {
    const card = document.createElement('div');
    card.className = 'group relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 hover:border-purple-500/50 transition flex flex-col justify-between';
    card.innerHTML = `
      <div class="relative overflow-hidden bg-black/60 cursor-pointer" onclick="window.open('${escapeHtml(shot.data)}', '_blank')">
        <img src="${escapeHtml(shot.data)}" alt="${escapeHtml(shot.title)}" class="w-full h-32 object-cover transition transform duration-300 group-hover:scale-105" />
        <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
          <i data-lucide="maximize-2" class="w-4 h-4"></i>
          <span>Öffnen</span>
        </div>
      </div>
      <div class="p-2.5 flex items-center justify-between text-[11px] bg-[#111116]/90 border-t border-white/5 gap-2">
        <div class="truncate">
          <span class="truncate font-semibold text-white block">${escapeHtml(shot.title)}</span>
          <span class="text-[9px] text-gray-500 font-mono">${escapeHtml(shot.date || '')}</span>
        </div>
        <button onclick="deleteHistoryScreenshot('${escapeHtml(shot.id)}')" class="p-1 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-300 transition cursor-pointer shrink-0" title="Screenshot löschen">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
  renderLucideIcons();
}

function saveGeneralSetting(key, val) {
  try {
    if (key === 'defaultWorkspace') {
      localStorage.setItem('flow_default_ws', val);
      const wsP = document.getElementById('setting-ws-private');
      const wsW = document.getElementById('setting-ws-work');
      if (wsP && wsW) {
        if (val === 'private') {
          wsP.className = 'flex-1 py-2 px-3 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold transition cursor-pointer';
          wsW.className = 'flex-1 py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white font-bold transition cursor-pointer';
        } else {
          wsW.className = 'flex-1 py-2 px-3 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold transition cursor-pointer';
          wsP.className = 'flex-1 py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white font-bold transition cursor-pointer';
        }
      }
    } else if (key === 'defaultTimer') {
      localStorage.setItem('flow_default_timer_min', val);
      [15, 25, 45, 60].forEach(m => {
        const b = document.getElementById(`setting-timer-${m}`);
        if (b) {
          if (m === val) b.className = 'py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono font-bold cursor-pointer';
          else b.className = 'py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-mono font-bold hover:text-white cursor-pointer';
        }
      });
      if (typeof timerMinutes !== 'undefined' && (typeof isTimerRunning === 'undefined' || !isTimerRunning)) {
        timerMinutes = val;
        timerSeconds = val * 60;
        if (typeof updateTimerDisplay === 'function') updateTimerDisplay();
      }
    }
  } catch (e) {
    console.warn('saveGeneralSetting error:', e);
  }
}

function clearAllApplicationData() {
  const msg = typeof tr === 'function' ? tr({
    de: 'Möchtest du wirklich alle lokalen Daten unwiderruflich löschen und die App zurücksetzen?',
    en: 'Are you sure you want to completely erase all local data and reset the app?'
  }) : 'Möchtest du wirklich alle lokalen Daten unwiderruflich löschen und die App zurücksetzen?';

  if (confirm(msg)) {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch (e) {
      console.warn('clearAllApplicationData error:', e);
      window.location.reload();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTheme(currentTheme); setLanguage(currentLang);
  const iconEl = document.getElementById('zen-btn-icon'); const textEl = document.getElementById('minimal-mode-btn-text');
  const zenView = document.getElementById('zen-chill-view');
  const mainEl = document.querySelector('main');
  if (isMinimalist) {
    document.body.classList.add('minimalist'); if (iconEl) iconEl.setAttribute('data-lucide', 'eye-off');
    if (textEl) textEl.innerText = t('standard_mode');
    if (zenView) { zenView.classList.remove('hidden'); zenView.classList.add('flex'); }
    if (mainEl) { mainEl.classList.add('hidden'); }
    updateZenView();
  } else {
    document.body.classList.remove('minimalist'); if (iconEl) iconEl.setAttribute('data-lucide', 'eye');
    if (textEl) textEl.innerText = t('minimal_mode');
    if (zenView) { zenView.classList.add('hidden'); zenView.classList.remove('flex'); }
    if (mainEl) { mainEl.classList.remove('hidden'); }
  }
  updateDateAndStreak(); updateWorkspaceSwitchUI(); renderApp(); updateZenView(); populateHelperTaskSelect(); suggestBoostActivity(); suggestInspirationQuote(); checkAndGenerateAutomaticReports();
  const btnHeader = document.getElementById('timer-toggle-btn'); if (btnHeader) { btnHeader.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>'; }
  renderLucideIcons();
});

// Gruppiert alle Farbschemata nach visueller Verwandtschaft, damit der automatische
// Gruppiert alle Farbschemata nach visueller Verwandtschaft
const THEME_FAMILIES = {
  'purple-dreams': ['aurora', 'neon-cyber', 'synthwave', 'sakura'],
  'green-nature': ['sage', 'forest', 'matcha'],
  'warm-earthy': ['cozy', 'citrus'],
  'cool-icy': ['architect', 'glacier', 'charcoal', 'holo-chrome', 'lagoon'],
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
  const validThemes = ['aurora', 'sage', 'cozy', 'forest', 'architect', 'neon-cyber', 'glacier', 'synthwave', 'charcoal', 'executive', 'holo-chrome', 'carbon'];
  if (!validThemes.includes(theme)) theme = 'aurora';
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
  const flagEl = document.getElementById('current-lang-flag') || document.getElementById('active-lang-flag');
  if (flagEl) flagEl.innerText = flagMap[lang] || '🇬🇧';
  translateUI(); const textEl = document.getElementById('minimal-mode-btn-text');
  if (textEl) { textEl.innerText = isMinimalist ? t('standard_mode') : t('minimal_mode'); }
  updateDateAndStreak(); renderApp(); updateZenView(); populateHelperTaskSelect();
  renderLucideIcons();
}

function translateUI() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS['en']?.[key] || TRANSLATIONS['de']?.[key];
    if (translated) {
      const icon = el.querySelector('i, svg');
      if (icon) {
        const textSpan = el.querySelector('span:not(.icon)');
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
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const translated = TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS['en']?.[key] || TRANSLATIONS['de']?.[key];
    if (translated) el.setAttribute('placeholder', translated);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const translated = TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS['en']?.[key] || TRANSLATIONS['de']?.[key];
    if (translated) el.setAttribute('title', translated);
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
  const zenView = document.getElementById('zen-chill-view');
  const mainEl = document.querySelector('main');
  if (isMinimalist) {
    document.body.classList.add('minimalist'); if (iconEl) iconEl.setAttribute('data-lucide', 'eye-off');
    if (textEl) textEl.innerText = t('standard_mode'); 
    if (zenView) { zenView.classList.remove('hidden'); zenView.classList.add('flex'); }
    if (mainEl) { mainEl.classList.add('hidden'); }
    updateZenView();
  } else {
    document.body.classList.remove('minimalist'); if (iconEl) iconEl.setAttribute('data-lucide', 'eye');
    if (textEl) textEl.innerText = t('minimal_mode');
    if (zenView) { zenView.classList.add('hidden'); zenView.classList.remove('flex'); }
    if (mainEl) { mainEl.classList.remove('hidden'); }
  }
  renderLucideIcons();
  showToast(isMinimalist ? t('toast_zen_active') : t('toast_zen_inactive'));
}

function zenCompleteCurrentTask() {
  if (!currentZenTaskInfo || !currentZenTaskInfo.cat || !currentZenTaskInfo.task) {
    showToast(tr({ de: 'Keine aktive Aufgabe ausgewählt', en: 'No active task selected', es: 'Ninguna tarea activa seleccionada', el: 'Δεν επιλέχθηκε ενεργή εργασία', fr: 'Aucune tâche active sélectionnée', it: 'Nessuna attività attiva selezionata' }));
    return;
  }
  const cat = currentZenTaskInfo.cat;
  const taskTextToFind = currentZenTaskInfo.task;
  if (!state.items[cat]) return;
  const index = state.items[cat].findIndex(item => {
    const tStr = typeof item === 'object' ? item.task : item;
    return tStr === taskTextToFind;
  });
  if (index !== -1) {
    handleCompleteTask(cat, index);
  } else if (state.items[cat].length > 0) {
    handleCompleteTask(cat, 0);
  }
}

let editingTerminIndex = null;

function toggleTerminForm(open, prefilledDate) {
  isTerminFormOpen = open !== undefined ? open : !isTerminFormOpen;
  if (!isTerminFormOpen) {
    editingTerminIndex = null;
    selectedCalendarDate = null;
  } else if (prefilledDate) {
    selectedCalendarDate = prefilledDate;
  }
  renderApp();
  if (isTerminFormOpen) {
    setTimeout(() => { const inputTitle = document.getElementById('add-termin-title'); if (inputTitle) inputTitle.focus(); }, 50);
  }
}

function editTermin(index, event) {
  if (event) event.stopPropagation();
  const termin = state.items.termine?.[index];
  if (!termin) return;
  editingTerminIndex = index;
  isTerminFormOpen = true;
  renderApp();
  setTimeout(() => {
    const titleEl = document.getElementById('add-termin-title');
    const locEl = document.getElementById('add-termin-location');
    const dateEl = document.getElementById('add-termin-date');
    const timeEl = document.getElementById('add-termin-time');
    if (titleEl) titleEl.value = termin.task || '';
    if (locEl) locEl.value = termin.location || '';
    if (dateEl) dateEl.value = termin.date || '';
    if (timeEl) timeEl.value = termin.time || '10:00';
    if (titleEl) titleEl.focus();
  }, 50);
}

function handleAddTermin() {
  const titleEl = document.getElementById('add-termin-title'); const locEl = document.getElementById('add-termin-location');
  const dateEl = document.getElementById('add-termin-date'); const timeEl = document.getElementById('add-termin-time');
  const title = titleEl ? titleEl.value.trim() : ''; const location = locEl ? locEl.value.trim() : '';
  const date = dateEl ? dateEl.value : ''; const time = timeEl ? timeEl.value : '';
  if (!title) { showToast(t('toast_appointment_name_error')); return; }
  saveHistory(); if (!state.items.termine) state.items.termine = [];
  
  if (editingTerminIndex !== null && editingTerminIndex >= 0 && state.items.termine[editingTerminIndex]) {
    state.items.termine[editingTerminIndex] = { task: title, date, time, location };
    editingTerminIndex = null;
    showToast(tr({
      de: 'Termin aktualisiert 📅',
      en: 'Appointment updated 📅',
      fr: 'Rendez-vous mis à jour 📅',
      it: 'Appuntamento aggiornato 📅',
      es: 'Cita actualizada 📅',
      el: 'Το ραντεβού ενημερώθηκε 📅'
    }));
  } else {
    state.items.termine.push({ task: title, date, time, location });
    showToast(t('toast_appointment_saved'));
  }
  isTerminFormOpen = false; selectedCalendarDate = null; saveState(); renderApp(); populateHelperTaskSelect();
}

function getTaskIconDetails(taskText, category = '') {
  if (!taskText) return { icon: 'check-circle', color: 'text-purple-400' };
  const rawTrimmed = String(taskText).trim();
  if (typeof TASK_ICONS !== 'undefined' && TASK_ICONS[rawTrimmed]) {
    return { icon: TASK_ICONS[rawTrimmed], color: 'text-purple-300' };
  }
  
  // Unicode-Normalisierung: Entfernt Akzente/Diakritika (z. B. é -> e, ά -> α, ñ -> n) für 100% verlässliche Spracherkennung
  const norm = rawTrimmed.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const rules = [
    // 1. Medikamente / Gesundheit / Arzt
    { rx: /medi|pill|tablett|vitam|pharmak|arzt|doctor|docteur|dottore|medico|therap|apothek|ordonnan|farmac|φαρμακ|γιατρ|ασθεν/, ic: 'pill', col: 'text-rose-400' },
    // 2. Zähne / Mundhygiene
    { rx: /zahn|zahne|dient|tooth|teeth|dent|dond|brush|bross|spazzol|δοντ|βουρτσ/, ic: 'smile', col: 'text-cyan-400' },
    // 3. Geschirr spülen / Küche / Abwasch
    { rx: /spul|dish|vaissel|piat|plato|geschirr|spuel|πιατ|abwasch/, ic: 'utensils', col: 'text-emerald-400' },
    // 4. Wäsche waschen / Waschmaschine
    { rx: /laund|colad|lessiv|bucat|clothes|linge|roux|ρουχ|πλυντηρ|wasch.*wasch|wasche/, ic: 'washing-machine', col: 'text-indigo-400' },
    // 5. Wäsche aufhängen / Trocknen
    { rx: /aufhang|hang|colg|etend|stend|aplon|dry|sech|asciug|απλωμ/, ic: 'shirt', col: 'text-violet-400' },
    // 6. Duschen / Baden / Gesicht waschen
    { rx: /dusch|shower|baign|doccia|duch|ντους|μπανι|gesicht|face|visage|viso|hyg|bath/, ic: 'bath', col: 'text-sky-400' },
    // 7. Haare / Frisur / Schneiden
    { rx: /haare|haar|hair|pelo|cabell|cheveux|capell|fris|kour|coiff|tagli|μαλλι|κουρεμ|λουσιμ/, ic: 'scissors', col: 'text-pink-400' },
    // 8. Nägel / Maniküre
    { rx: /nagel|nail|ungl|un|ungh|nych|pedicur|manicur|νυχ/, ic: 'sparkles', col: 'text-indigo-400' },
    // 9. Trinken / Wasser / Hydration
    { rx: /trink|wat|agu|eau|ner|glass|hydrat|bever|bere|boire|νερο|πινω|ποτηρ/, ic: 'glass-water', col: 'text-blue-400' },
    // 10. Bett / Schlafen / Bettwäsche
    { rx: /bett|bed|cama|lit|lett|krevat|schlaf|sleep|sommeil|dorm|drap|sabana|lenzuol|κρεβατ|σεντον|υπν/, ic: 'bed', col: 'text-amber-400' },
    // 11. Aufräumen / Ordnung / Organisation
    { rx: /aufraum|tidy|orden|rang|riordin|clean|putz|organi|nettoy|limp|puliz|τακτοπ|καθαρισ|οργαν/, ic: 'package', col: 'text-yellow-500' },
    // 12. Staub wischen / Abstauben
    { rx: /staub|dust|polv|poussi|spolver|epousset|xesk|ξεσκον/, ic: 'feather', col: 'text-amber-300' },
    // 13. Staubsaugen / Saugen
    { rx: /saugen|staubsaug|vacu|aspir|skoupi|σκουπ/, ic: 'tornado', col: 'text-cyan-500' },
    // 14. Boden wischen / Feuchtwischen
    { rx: /wisch|mop|freg|sfoug|paviment|sol|σφουγγαρ/, ic: 'droplets', col: 'text-sky-500' },
    // 15. Bad / WC / Sanitär / Spiegel
    { rx: /klo|wc|toil|vater|lekan|lavabo|sink|miroir|specch|espejo|spiegel|bad|fliesen|νιπτηρ|λεκαν/, ic: 'sparkles', col: 'text-teal-500' },
    // 16. Müll wegbringen / Entsorgung
    { rx: /mull|trash|basur|poubelle|spazzatur|waste|abfall|skoupid|σκουπιδ|πεταμ/, ic: 'trash-2', col: 'text-rose-500' },
    // 17. Pfandflaschen / Recycling
    { rx: /pfand|bottle|bouteill|bottigl|envase|boukal|recycle|recyc|μπουκαλ|ανακυκλ/, ic: 'recycle', col: 'text-emerald-500' },
    // 18. Kochen / Mahlzeiten / Rezepte
    { rx: /koch|food|cook|comid|cena|recept|recet|cuisin|cucin|magir|essen|lunch|dinner|breakfast|dejeun|pranz|past|mahlzeit|φαγητ|μαγειρ|γευμα/, ic: 'cooking-pot', col: 'text-orange-400' },
    // 19. Einkauf / Supermarkt / Laden
    { rx: /einkauf|shop|compr|achat|spesa|supermarkt|market|store|kauf|epicerie|agor|αγορ|σουπερ/, ic: 'shopping-cart', col: 'text-emerald-400' },
    // 20. Arbeit / Job / Büro / Termine / Meetings
    { rx: /arbeit|work|trabaj|travail|lavor|doul|job|office|schreib|mail|call|anruf|meeting|appuntament|rendez|cita|termin|geschaft|δουλει|γραφει/, ic: 'briefcase', col: 'text-amber-500' },
    // 21. Lesen / Buch / Lernen / Studium
    { rx: /les|book|libr|livr|vivl|lernen|study|etud|stud|buch|diavas|διαβασ|βιβλι/, ic: 'book-open', col: 'text-violet-400' },
    // 22. Sport / Fitness / Training / Laufen / Spazieren
    { rx: /sport|gym|fit|train|gymn|workout|run|laufen|gehen|walk|course|correre|caminar|marcher|exerc|ασκησ|γυμναστ|τρεξιμ/, ic: 'activity', col: 'text-green-400' },
    // 23. Pause / Ausruhen / Erholen / Meditation
    { rx: /paus|rest|desc|relax|chill|medit|mindful|repos|ripos|diahleim|διαλειμμ|χαλαρω/, ic: 'moon', col: 'text-indigo-300' },
    // 24. Lüften / Frische Luft / Durchatmen
    { rx: /luft|wind|vent|aer|luften|breath|resp|fresch|frisch|αερισμ|αερ/, ic: 'wind', col: 'text-cyan-300' }
  ];

  for (const r of rules) {
    if (r.rx.test(norm)) return { icon: r.ic, color: r.col };
  }

  const defaults = {
    daily: { icon: 'sun', color: 'text-amber-400' },
    weekly: { icon: 'calendar-days', color: 'text-purple-400' },
    todo: { icon: 'list-todo', color: 'text-blue-400' },
    done: { icon: 'check-circle', color: 'text-emerald-400' },
    termine: { icon: 'clock', color: 'text-amber-400' },
    occasionally: { icon: 'calendar-range', color: 'text-pink-400' },
    notes: { icon: 'sticky-note', color: 'text-yellow-400' },
    work_focus: { icon: 'target', color: 'text-amber-400' },
    work_in_progress: { icon: 'zap', color: 'text-blue-400' },
    work_waiting: { icon: 'hourglass', color: 'text-purple-400' },
    work_backlog: { icon: 'folder-kanban', color: 'text-indigo-400' }
  };
  return defaults[category] || { icon: 'check-circle', color: 'text-purple-400' };
}

function getTaskIcon(taskText, category = '') { return getTaskIconDetails(taskText, category).icon; }
window.getTaskIconDetails = getTaskIconDetails;
window.getTaskIcon = getTaskIcon;

// ===== KEYBOARD SHORTCUTS MODAL (?) =====
function openKeyboardShortcuts() {
  const m = document.getElementById('modal-keyboard-shortcuts');
  if (m) {
    m.classList.remove('hidden');
    renderLucideIcons();
  }
}
window.openKeyboardShortcuts = openKeyboardShortcuts;

function closeKeyboardShortcuts() {
  const m = document.getElementById('modal-keyboard-shortcuts');
  if (m) m.classList.add('hidden');
}
window.closeKeyboardShortcuts = closeKeyboardShortcuts;

// ===== FULL LOCAL-FIRST BACKUP & RESTORE HUB =====
function downloadFullBackup() {
  try {
    const backupData = {
      app: 'Flow Organiser',
      version: '2.5.0',
      exportedAt: new Date().toISOString(),
      items: typeof items !== 'undefined' ? items : {},
      categoriesOrder: typeof categoriesOrder !== 'undefined' ? categoriesOrder : [],
      currentWorkspace: typeof currentWorkspace !== 'undefined' ? currentWorkspace : 'private',
      historyScreenshots: getHistoryScreenshots(),
      customTranslations: typeof customTranslations !== 'undefined' ? customTranslations : {},
      theme: localStorage.getItem('flow_theme') || 'dark',
      currentLang: typeof currentLang !== 'undefined' ? currentLang : 'de'
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `flow-organiser-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    if (typeof showToast === 'function') {
      showToast(typeof tr === 'function' ? tr({ de: 'Backup erfolgreich heruntergeladen! 💾', en: 'Backup successfully downloaded! 💾' }) : 'Backup heruntergeladen! 💾');
    }
  } catch (e) {
    console.error('Backup download error:', e);
    alert('Fehler beim Erstellen des Backups: ' + e.message);
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
      if (!data || (!data.items && !data.daily && !Array.isArray(data))) {
        throw new Error('Ungültiges Flow Organiser Backup-Format');
      }

      if (confirm('Möchtest du dieses Backup wirklich wiederherstellen? Bestehende Daten werden aktualisiert.')) {
        if (data.items) {
          items = data.items;
          localStorage.setItem('flow_items_v2', JSON.stringify(items));
        }
        if (data.categoriesOrder && Array.isArray(data.categoriesOrder)) {
          categoriesOrder = data.categoriesOrder;
          localStorage.setItem('flow_categories_order', JSON.stringify(categoriesOrder));
        }
        if (data.historyScreenshots && Array.isArray(data.historyScreenshots)) {
          saveHistoryScreenshots(data.historyScreenshots);
        }

        if (typeof renderBoard === 'function') renderBoard();
        if (typeof renderLucideIcons === 'function') renderLucideIcons();
        if (typeof closeSettingsModal === 'function') closeSettingsModal();

        if (typeof showToast === 'function') {
          showToast('Backup erfolgreich wiederhergestellt! ✨');
        }
      }
    } catch (err) {
      alert('Fehler beim Wiederherstellen: ' + err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}
window.handleRestoreBackupFile = handleRestoreBackupFile;

// ===== PWA INSTALLATION ENGINE =====
window.deferredPwaPrompt = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPwaPrompt = e;
    const banner = document.getElementById('pwa-install-banner');
    if (banner && !sessionStorage.getItem('pwa_dismissed')) {
      banner.classList.remove('hidden');
      renderLucideIcons();
    }
  });

  window.addEventListener('appinstalled', () => {
    window.deferredPwaPrompt = null;
    const banner = document.getElementById('pwa-install-banner');
    if (banner) banner.classList.add('hidden');
    if (typeof showToast === 'function') {
      showToast('Flow Organiser erfolgreich installiert! 🎉');
    }
  });
}

function triggerPwaInstall() {
  const banner = document.getElementById('pwa-install-banner');
  if (banner) banner.classList.add('hidden');
  if (window.deferredPwaPrompt) {
    window.deferredPwaPrompt.prompt();
    window.deferredPwaPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
      }
      window.deferredPwaPrompt = null;
    });
  } else {
    if (typeof showToast === 'function') {
      showToast('Installiere Flow über das Browsermenü („Zum Startbildschirm hinzufügen“)');
    }
  }
}
window.triggerPwaInstall = triggerPwaInstall;

function dismissPwaBanner() {
  const banner = document.getElementById('pwa-install-banner');
  if (banner) banner.classList.add('hidden');
  sessionStorage.setItem('pwa_dismissed', 'true');
}
window.dismissPwaBanner = dismissPwaBanner;

// ===== GLOBAL KEYBOARD SHORTCUTS LISTENER =====
if (typeof document !== 'undefined') {
  document.addEventListener('keydown', (e) => {
    const targetTag = e.target.tagName?.toLowerCase();
    const isEditing = targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select' || e.target.isContentEditable;

    // Strg+K / Cmd+K Spotlight Command Palette
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (typeof openCommandPalette === 'function') openCommandPalette();
      return;
    }

    if (isEditing) return;

    // '?' -> Keyboard shortcuts cheat sheet
    if (e.key === '?' || (e.shiftKey && e.key === '/')) {
      e.preventDefault();
      openKeyboardShortcuts();
    }
    // 'N' or 'n' -> New task modal
    else if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      if (typeof openTaskModal === 'function') openTaskModal('daily');
    }
    // 'T' or 't' -> Toggle Pomodoro focus timer
    else if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      if (typeof toggleTimer === 'function') toggleTimer();
    }
    // 'Z' or 'z' -> Toggle Minimalist / Zen mode
    else if (e.key === 'z' || e.key === 'Z') {
      e.preventDefault();
      if (typeof toggleMinimalist === 'function') toggleMinimalist();
    }
    // '1' -> Switch to Private workspace
    else if (e.key === '1') {
      e.preventDefault();
      if (typeof switchWorkspace === 'function') switchWorkspace('private');
    }
    // '2' -> Switch to Work workspace
    else if (e.key === '2') {
      e.preventDefault();
      if (typeof switchWorkspace === 'function') switchWorkspace('work');
    }
  });
}

// ===== AMBIENT BACKGROUND STARDUST & IDLE FLOW ENGINE =====
function initAmbientFlowCanvas() {
  const canvas = document.getElementById('ambient-flow-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let particles = [];
  const particleCount = Math.min(45, Math.floor((width * height) / 28000));

  class FlowParticle {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.radius = 1 + Math.random() * 1.8;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = -0.15 - Math.random() * 0.35;
      this.baseAlpha = 0.15 + Math.random() * 0.35;
      this.alpha = this.baseAlpha;
      this.color = Math.random() > 0.5 ? 'rgba(56, 189, 248,' : 'rgba(192, 132, 252,';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color} ${this.alpha})`;
      ctx.shadowColor = this.color.includes('56') ? '#38bdf8' : '#c084fc';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new FlowParticle());
  }

  let animId = null;
  function renderAmbient() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting faint energy lines between nearby nodes
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          const lineAlpha = (1 - dist / 110) * 0.08;
          ctx.strokeStyle = `rgba(129, 140, 248, ${lineAlpha})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    animId = requestAnimationFrame(renderAmbient);
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animId) cancelAnimationFrame(animId);
    } else {
      animId = requestAnimationFrame(renderAmbient);
    }
  });

  animId = requestAnimationFrame(renderAmbient);
}

// ============================================================================
// NATIVE MOBILE NAVIGATION CONTROLLER (5 TABS & FAB)
// ============================================================================

function switchMobileNavTab(tabName) {
  if (tabName === 'game') {
    if (typeof toggleGameMode === 'function') {
      toggleGameMode();
    }
    return;
  }

  // Falls das 3D-Game aktiv war, schließen
  if (typeof gameActive !== 'undefined' && gameActive) {
    if (typeof toggleGameMode === 'function') toggleGameMode();
  }

  document.body.dataset.mobileNav = tabName;
  localStorage.setItem('flow_active_mobile_tab', tabName);

  // Update Nav-Bar Buttons
  const navTabs = ['planer', 'focus', 'audio', 'tools', 'game'];
  navTabs.forEach(t => {
    const btn = document.getElementById(`mob-nav-${t}`);
    if (btn) {
      btn.classList.toggle('active', t === tabName);
    }
  });

  // Tab-spezifische Initialisierungen
  if (tabName === 'planer') {
    const activeCat = document.body.dataset.mobileCat || localStorage.getItem('flowPlannerMobileCategory') || 'daily';
    if (typeof setMobileCategory === 'function') setMobileCategory(activeCat);
  } else if (tabName === 'focus') {
    if (typeof updateTimerDisplay === 'function') updateTimerDisplay();
  }

  // Scroll nach oben
  window.scrollTo({ top: 0, behavior: 'instant' });

  if (typeof renderLucideIcons === 'function') renderLucideIcons();
  else if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}
window.switchMobileNavTab = switchMobileNavTab;

function openMobileQuickAddModal() {
  const activeCat = document.body.dataset.mobileCat || 'daily';
  
  // Prüfe, ob das Desktop-Input-Feld existiert, und fokussiere es
  const inputEl = document.querySelector(`main article[data-category="${activeCat}"] input[type="text"]`);
  if (inputEl) {
    inputEl.focus();
    inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Fallback: Eleganter nativer Dialog
  const taskText = prompt(tr({
    en: 'Add new task:',
    de: 'Neue Aufgabe eingeben:',
    fr: 'Ajouter une nouvelle tâche :',
    it: 'Aggiungi nuova attività:',
    es: 'Añadir nueva tarea:',
    el: 'Προσθήκη νέας εργασίας:'
  }));

  if (taskText && taskText.trim()) {
    if (typeof addTaskDirectly === 'function') {
      addTaskDirectly(activeCat, taskText.trim());
    } else if (typeof state !== 'undefined' && state.items) {
      if (!state.items[activeCat]) state.items[activeCat] = [];
      state.items[activeCat].unshift({ task: taskText.trim(), done: false, date: new Date().toISOString() });
      if (typeof saveState === 'function') saveState();
      if (typeof renderBoard === 'function') renderBoard();
    }
  }
}
window.openMobileQuickAddModal = openMobileQuickAddModal;

// Auto-Wiederherstellung des letzten mobilen Tabs beim Start
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 768) {
      const savedTab = localStorage.getItem('flow_active_mobile_tab') || 'planer';
      switchMobileNavTab(savedTab);
    }
  });
}

if (typeof window !== 'undefined') {
  window.setTheme = setTheme;
  window.setLanguage = setLanguage;
  window.toggleMinimalist = toggleMinimalist;
  window.closeAllPanelsAndModals = closeAllPanelsAndModals;
  window.getTaskIconDetails = getTaskIconDetails;
  window.getTaskIcon = getTaskIcon;
  window.openCommandPalette = openCommandPalette;
  window.closeCommandPalette = closeCommandPalette;
  window.switchMobileNavTab = switchMobileNavTab;
  window.openMobileQuickAddModal = openMobileQuickAddModal;
}
if (typeof globalThis !== 'undefined') {
  globalThis.setTheme = setTheme;
  globalThis.setLanguage = setLanguage;
  globalThis.toggleMinimalist = toggleMinimalist;
  globalThis.closeAllPanelsAndModals = closeAllPanelsAndModals;
  globalThis.getTaskIconDetails = getTaskIconDetails;
  globalThis.getTaskIcon = getTaskIcon;
  globalThis.openCommandPalette = openCommandPalette;
  globalThis.closeCommandPalette = closeCommandPalette;
  globalThis.switchMobileNavTab = switchMobileNavTab;
  globalThis.openMobileQuickAddModal = openMobileQuickAddModal;
}


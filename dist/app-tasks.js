/**
 * ============================================================================
 * Noodle - Aufgaben- & Board-Management (app-tasks.js)
 * ============================================================================
 * Dieses Modul steuert die Kernlogik des Kanban-Boards:
 * - Rendering der Spalten und Aufgabenkarten (Personal & Work Workspace)
 * - Aufgaben-Lebenszyklus: Erstellen, Inline-Editieren, Abhaken, Löschen & Wiederherstellen
 * - Drag & Drop Sortierung (Spalten und Karten)
 * - Kontextmenü für Fokus-Timer, Task-Steps und Farbmarkierungen
 * - Mobile Touch-Navigation & Kalender-Terminverwaltung
 * ============================================================================
 */

let inlineEditingTaskInfo = null;
let openTaskMenuMeta = null;
let taskMenuCloseTimer = null;

/**
 * Plant das automatische Schließen des Aufgaben-Kontextmenüs nach einer kurzen Verzögerung.
 */
function scheduleCloseTaskMenu(delay = 650) {
  if (taskMenuCloseTimer) clearTimeout(taskMenuCloseTimer);
  taskMenuCloseTimer = setTimeout(() => {
    closeTaskOptionsMenu();
  }, delay);
}

function cancelCloseTaskMenu() {
  if (taskMenuCloseTimer) {
    clearTimeout(taskMenuCloseTimer);
    taskMenuCloseTimer = null;
  }
}

function toggleTaskOptionsMenu(colId, index, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const existing = document.getElementById('task-context-dropdown');
  if (openTaskMenuMeta && openTaskMenuMeta.colId === colId && openTaskMenuMeta.index === index && existing && !existing.classList.contains('hidden')) {
    closeTaskOptionsMenu();
    return;
  }
  openTaskOptionsMenu(colId, index, event ? event.currentTarget : null);
}

function closeTaskOptionsMenu() {
  cancelCloseTaskMenu();
  const el = document.getElementById('task-context-dropdown');
  if (el) el.classList.add('hidden');
  openTaskMenuMeta = null;
}

function openTaskOptionsMenu(colId, index, anchorBtn) {
  cancelCloseTaskMenu();
  openTaskMenuMeta = { colId, index };
  let menu = document.getElementById('task-context-dropdown');
  if (!menu) {
    menu = document.createElement('div');
    menu.id = 'task-context-dropdown';
    document.body.appendChild(menu);
  }

  menu.onmouseenter = cancelCloseTaskMenu;
  menu.onmouseleave = scheduleCloseTaskMenu;

  const curItems = getCurrentWorkspaceItems();
  const rawTask = curItems[colId]?.[index];
  if (!rawTask) return;
  const taskObj = typeof rawTask === 'object' ? rawTask : { task: rawTask };
  const taskColor = taskObj.color || 'none';

  menu.className = 'fixed z-[999999] w-[138px] p-1.5 bg-[#141422]/95 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col gap-0.5 text-xs text-gray-200';
  
  menu.innerHTML = `
    <!-- Focus & Steps ganz oben -->
    <button onclick="startTaskTimerByIndex('${colId}', ${index}, event); closeTaskOptionsMenu();" class="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/10 text-amber-300 hover:text-amber-200 transition cursor-pointer text-left font-medium">
      <i data-lucide="timer" class="w-3.5 h-3.5 text-amber-400"></i>
      <span>Focus</span>
    </button>
    <button onclick="openTaskStepsModal('${colId}', ${index}, event); closeTaskOptionsMenu();" class="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/10 text-[var(--accent-light)] hover:text-white transition cursor-pointer text-left font-medium">
      <i data-lucide="footprints" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>
      <span>Steps</span>
    </button>
    
    <div class="h-[1px] bg-white/10 my-0.5"></div>

    <!-- Standard-Aktionen -->
    <button onclick="editTaskInline('${colId}', ${index}, event); closeTaskOptionsMenu();" class="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition cursor-pointer text-left font-medium">
      <i data-lucide="edit-3" class="w-3.5 h-3.5 text-purple-400"></i>
      <span>${tr({ de: 'Bearbeiten', en: 'Edit', fr: 'Modifier', it: 'Modifica', es: 'Editar', el: 'Επεξεργασία' })}</span>
    </button>
    <button onclick="deleteTask('${colId}', ${index}, event); closeTaskOptionsMenu();" class="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-red-500/20 text-rose-400 hover:text-rose-300 transition cursor-pointer text-left font-medium">
      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
      <span>${tr({ de: 'Löschen', en: 'Delete', fr: 'Supprimer', it: 'Elimina', es: 'Eliminar', el: 'Διαγραφή' })}</span>
    </button>

    <div class="h-[1px] bg-white/10 my-0.5"></div>

    <!-- Farbpalette (unten, extra klein & dezent) -->
    <div class="px-1.5 pt-0.5 pb-0.5">
      <span class="text-[8px] font-bold text-gray-400 uppercase tracking-wider block mb-1">${tr({ de: 'Farbe 🎨', en: 'Color 🎨', fr: 'Couleur 🎨', it: 'Colore 🎨', es: 'Color 🎨', el: 'Χρώμα 🎨' })}</span>
      <div class="flex items-center gap-1 justify-between">
        <button onclick="setTaskColor('${colId}', ${index}, 'none', event); closeTaskOptionsMenu();" aria-label="${tr({ de: 'Standard', en: 'Default', fr: 'Par défaut', it: 'Predefinito', es: 'Por defecto', el: 'Προεπιλογή' })}" class="w-2.5 h-2.5 rounded-full border border-gray-400 bg-transparent hover:scale-125 transition cursor-pointer ${taskColor === 'none' ? 'ring-1 ring-white' : ''}" title="${tr({ de: 'Standard', en: 'Default', fr: 'Par défaut', it: 'Predefinito', es: 'Por defecto', el: 'Προεπιλογή' })}"></button>
        <button onclick="setTaskColor('${colId}', ${index}, 'rose', event); closeTaskOptionsMenu();" aria-label="${tr({ de: 'Rot', en: 'Red', fr: 'Rouge', it: 'Rosso', es: 'Rojo', el: 'Κόκκινο' })}" class="w-2.5 h-2.5 rounded-full bg-rose-500 hover:scale-125 transition cursor-pointer shadow-sm ${taskColor === 'rose' ? 'ring-1 ring-white' : ''}" title="${tr({ de: 'Rot', en: 'Red', fr: 'Rouge', it: 'Rosso', es: 'Rojo', el: 'Κόκκινο' })}"></button>
        <button onclick="setTaskColor('${colId}', ${index}, 'orange', event); closeTaskOptionsMenu();" aria-label="${tr({ de: 'Orange', en: 'Orange', fr: 'Orange', it: 'Arancione', es: 'Naranja', el: 'Πορτοκαλί' })}" class="w-2.5 h-2.5 rounded-full bg-orange-500 hover:scale-125 transition cursor-pointer shadow-sm ${taskColor === 'orange' ? 'ring-1 ring-white' : ''}" title="${tr({ de: 'Orange', en: 'Orange', fr: 'Orange', it: 'Arancione', es: 'Naranja', el: 'Πορτοκαλί' })}"></button>
        <button onclick="setTaskColor('${colId}', ${index}, 'amber', event); closeTaskOptionsMenu();" aria-label="${tr({ de: 'Gelb', en: 'Yellow', fr: 'Jaune', it: 'Giallo', es: 'Amarillo', el: 'Κίτρινο' })}" class="w-2.5 h-2.5 rounded-full bg-amber-500 hover:scale-125 transition cursor-pointer shadow-sm ${taskColor === 'amber' ? 'ring-1 ring-white' : ''}" title="${tr({ de: 'Gelb', en: 'Yellow', fr: 'Jaune', it: 'Giallo', es: 'Amarillo', el: 'Κίτρινο' })}"></button>
        <button onclick="setTaskColor('${colId}', ${index}, 'emerald', event); closeTaskOptionsMenu();" aria-label="${tr({ de: 'Grün', en: 'Green', fr: 'Vert', it: 'Verde', es: 'Verde', el: 'Πράσινο' })}" class="w-2.5 h-2.5 rounded-full bg-emerald-500 hover:scale-125 transition cursor-pointer shadow-sm ${taskColor === 'emerald' ? 'ring-1 ring-white' : ''}" title="${tr({ de: 'Grün', en: 'Green', fr: 'Vert', it: 'Verde', es: 'Verde', el: 'Πράσινο' })}"></button>
        <button onclick="setTaskColor('${colId}', ${index}, 'sky', event); closeTaskOptionsMenu();" aria-label="${tr({ de: 'Blau', en: 'Blue', fr: 'Bleu', it: 'Blu', es: 'Azul', el: 'Μπλε' })}" class="w-2.5 h-2.5 rounded-full bg-sky-500 hover:scale-125 transition cursor-pointer shadow-sm ${taskColor === 'sky' ? 'ring-1 ring-white' : ''}" title="${tr({ de: 'Blau', en: 'Blue', fr: 'Bleu', it: 'Blu', es: 'Azul', el: 'Μπλε' })}"></button>
        <button onclick="setTaskColor('${colId}', ${index}, 'purple', event); closeTaskOptionsMenu();" aria-label="${tr({ de: 'Lila', en: 'Purple', fr: 'Violet', it: 'Viola', es: 'Morado', el: 'Μωβ' })}" class="w-2.5 h-2.5 rounded-full bg-purple-500 hover:scale-125 transition cursor-pointer shadow-sm ${taskColor === 'purple' ? 'ring-1 ring-white' : ''}" title="${tr({ de: 'Lila', en: 'Purple', fr: 'Violet', it: 'Viola', es: 'Morado', el: 'Μωβ' })}"></button>
      </div>
    </div>
  `;

  if (anchorBtn) {
    const rect = anchorBtn.getBoundingClientRect();
    let top = rect.bottom + 4;
    let left = rect.right - 138;
    if (left < 10) left = 10;
    if (top + 200 > window.innerHeight) {
      top = rect.top - 200;
    }
    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
  }
  menu.classList.remove('hidden');
  renderLucideIcons();
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('task-context-dropdown');
    if (menu && !menu.classList.contains('hidden')) {
      if (!menu.contains(e.target) && !e.target.closest('button[onclick*="toggleTaskOptionsMenu"]')) {
        closeTaskOptionsMenu();
      }
    }
  });
}

const TASK_COLOR_MAP = {
  rose: {
    border: 'border-l-rose-500',
    bg: 'bg-rose-500/10 hover:bg-rose-500/15',
    text: 'text-rose-200',
    iconColor: 'text-rose-400',
    shadow: 'shadow-[0_0_12px_rgba(244,63,94,0.18)]'
  },
  orange: {
    border: 'border-l-orange-500',
    bg: 'bg-orange-500/10 hover:bg-orange-500/15',
    text: 'text-orange-200',
    iconColor: 'text-orange-400',
    shadow: 'shadow-[0_0_12px_rgba(249,115,22,0.18)]'
  },
  amber: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-500/10 hover:bg-amber-500/15',
    text: 'text-amber-200',
    iconColor: 'text-amber-400',
    shadow: 'shadow-[0_0_12px_rgba(245,158,11,0.18)]'
  },
  emerald: {
    border: 'border-l-emerald-500',
    bg: 'bg-emerald-500/10 hover:bg-emerald-500/15',
    text: 'text-emerald-200',
    iconColor: 'text-emerald-400',
    shadow: 'shadow-[0_0_12px_rgba(16,185,129,0.18)]'
  },
  sky: {
    border: 'border-l-sky-500',
    bg: 'bg-sky-500/10 hover:bg-sky-500/15',
    text: 'text-sky-200',
    iconColor: 'text-sky-400',
    shadow: 'shadow-[0_0_12px_rgba(14,165,233,0.18)]'
  },
  purple: {
    border: 'border-l-purple-500',
    bg: 'bg-purple-500/10 hover:bg-purple-500/15',
    text: 'text-purple-200',
    iconColor: 'text-purple-400',
    shadow: 'shadow-[0_0_12px_rgba(168,85,247,0.18)]'
  },
  none: {
    border: 'border-[var(--accent)]',
    bg: 'bg-white/[0.035] hover:bg-white/[0.07]',
    text: 'text-gray-200',
    iconColor: '',
    shadow: ''
  }
};

function setTaskColor(columnId, index, color, e) {
  if (e) e.stopPropagation();
  saveHistory();
  const curItems = getCurrentWorkspaceItems();
  if (!curItems[columnId] || !curItems[columnId][index]) return;
  const current = curItems[columnId][index];
  if (typeof current === 'object') {
    if (color === 'none') {
      delete curItems[columnId][index].color;
    } else {
      curItems[columnId][index].color = color;
    }
    curItems[columnId][index].updatedAt = new Date().toISOString();
  } else {
    curItems[columnId][index] = (typeof ensureItemIdentity === 'function') 
      ? ensureItemIdentity({ task: current, color: color === 'none' ? undefined : color }, `task_${columnId}`)
      : { task: current, color: color === 'none' ? undefined : color };
  }
  saveState();
  renderApp();
}

function renameColumn(colId, e) {
  if (e) e.stopPropagation();
  const isWork = state && state.activeWorkspace === 'work';
  const activeOrder = isWork ? (workCategoriesOrder || WORK_CATEGORIES_ORDER) : categoriesOrder;
  const entry = activeOrder.find(([id]) => id === colId);
  if (!entry) return;
  const currentTitle = entry[2] || t(colId);
  const newTitle = prompt(t('rename_column') || 'Spalte umbenennen:', currentTitle);
  if (newTitle && newTitle.trim()) {
    saveHistory();
    entry[2] = newTitle.trim();
    entry[3] = true;
    saveCategoriesOrder();
    renderApp();
    showToast(tr({ de: 'Spalte umbenannt ✏️', en: 'Column renamed ✏️', es: 'Columna renombrada ✏️', el: 'Η στήλη μετονομάστηκε ✏️', fr: 'Colonne renommée ✏️', it: 'Colonna rinominata ✏️' }));
  }
}

async function deleteColumn(colId, e) {
  if (e) e.stopPropagation();
  const isWork = state && state.activeWorkspace === 'work';
  const activeOrder = isWork ? (workCategoriesOrder || WORK_CATEGORIES_ORDER) : categoriesOrder;
  const idx = activeOrder.findIndex(([id]) => id === colId);
  if (idx === -1) return;
  const curItems = getCurrentWorkspaceItems();
  const taskCount = (curItems[colId] || []).length;
  
  const confirmMsg = (t('confirm_delete_column') || 'Möchtest du diese Spalte wirklich löschen?') + (taskCount > 0 ? ` (${taskCount} Aufgaben)` : '');
  const confirmed = typeof showConfirmDialog === 'function' ? await showConfirmDialog({
    title: typeof tr === 'function' ? tr({ de: 'Spalte löschen?', en: 'Delete column?' }) : 'Spalte löschen?',
    message: confirmMsg,
    confirmText: typeof tr === 'function' ? tr({ de: 'Löschen', en: 'Delete' }) : 'Löschen',
    isDanger: true,
    icon: 'trash-2'
  }) : confirm(confirmMsg);

  if (confirmed) {
    saveHistory();
    activeOrder.splice(idx, 1);
    delete curItems[colId];
    saveCategoriesOrder();
    saveState();
    renderApp();
    showToast(tr({ de: 'Spalte gelöscht 🗑️', en: 'Column deleted 🗑️', es: 'Columna eliminada 🗑️', el: 'Η στήλη διαγράφηκε 🗑️', fr: 'Colonne supprimée 🗑️', it: 'Colonna eliminata 🗑️' }));
  }
}

function quickAddTaskTop(colId, e) {
  if (e) e.stopPropagation();
  if (colId === 'notes') {
    openTaskAddColumns['notes'] = true;
    renderApp();
    return;
  }
  if (colId === 'termine') {
    toggleTerminForm(true);
    return;
  }
  openTaskAddColumns[colId] = true;
  renderApp();
}

const COLUMN_THEMES = {
  daily: { color: 'text-amber-300', bg: 'bg-amber-500/15 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]' },
  work_focus: { color: 'text-amber-300', bg: 'bg-amber-500/15 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]' },
  weekly: { color: 'text-purple-300', bg: 'bg-purple-500/15 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.15)]' },
  work_in_progress: { color: 'text-purple-300', bg: 'bg-purple-500/15 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.15)]' },
  todo: { color: 'text-cyan-300', bg: 'bg-cyan-500/15 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]' },
  work_backlog: { color: 'text-cyan-300', bg: 'bg-cyan-500/15 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]' },
  occasionally: { color: 'text-indigo-300', bg: 'bg-indigo-500/15 border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.15)]' },
  work_waiting: { color: 'text-indigo-300', bg: 'bg-indigo-500/15 border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.15)]' },
  done: { color: 'text-emerald-300', bg: 'bg-emerald-500/15 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]' },
  termine: { color: 'text-orange-300', bg: 'bg-orange-500/15 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.15)]' },
  notes: { color: 'text-amber-300', bg: 'bg-amber-500/15 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]' }
};

function getCurrentWorkspaceItems() {
  if (typeof state !== 'undefined' && state && state.activeWorkspace === 'work') {
    if (!state.workItems) state.workItems = createDefaultWorkItems(typeof currentLang !== 'undefined' ? currentLang : 'en');
    return state.workItems;
  }
  return state.items;
}

function getCurrentWorkspaceDone() {
  if (typeof state !== 'undefined' && state && state.activeWorkspace === 'work') {
    if (!state.workDone) state.workDone = [];
    return state.workDone;
  }
  return state.done;
}

function renderApp() {
  const main = document.querySelector('main'); if (!main) return;
  main.innerHTML = '';
  const fragment = document.createDocumentFragment();
  const now = new Date();
  const todayISO = now.toISOString().split('T')[0];
  const dayOfWeek = now.getDay();
  const distanceToMonday = (dayOfWeek + 6) % 7;
  const mondayDate = new Date(now.getTime() - distanceToMonday * 24 * 60 * 60 * 1000);
  const mondayISO = mondayDate.toISOString().split('T')[0];
  
  const currentItems = getCurrentWorkspaceItems() || {};
  const doneList = getCurrentWorkspaceDone() || [];
  const isWork = state && state.activeWorkspace === 'work';
  const activeOrder = isWork 
    ? (workCategoriesOrder || (typeof WORK_CATEGORIES_ORDER !== 'undefined' ? WORK_CATEGORIES_ORDER : [])) 
    : (categoriesOrder || (typeof CATEGORIES_ORDER !== 'undefined' ? CATEGORIES_ORDER : []));

  (activeOrder || []).forEach(([id, iconKey]) => {
    const isDone = id === 'done'; const isNotes = id === 'notes'; const isTermine = id === 'termine';
    const isDaily = (id === 'daily' || id === 'work_focus');
    const isWeekly = (id === 'weekly' || id === 'work_in_progress');
    const activeCount = (currentItems[id] || []).length;
    let doneInCat = 0;

    if (isDaily) {
      doneInCat = doneList.filter(t => (t.origin === 'daily' || t.origin === 'work_focus') && t.date === todayISO).length;
    } else if (isWeekly) {
      doneInCat = doneList.filter(t => (t.origin === 'weekly' || t.origin === 'work_in_progress') && t.date >= mondayISO).length;
    } else {
      doneInCat = doneList.filter(t => t.origin === id).length;
    }

    const totalInCat = doneInCat + activeCount;
    const catCustomTitle = (Array.isArray(activeOrder) && activeOrder.find(([cid]) => cid === id)) ? activeOrder.find(([cid]) => cid === id)[2] : null;
    const isCustomCol = (Array.isArray(activeOrder) && activeOrder.find(([cid]) => cid === id)) ? (activeOrder.find(([cid]) => cid === id)[3] === true || id.startsWith('custom_')) : false;
    const catName = catCustomTitle || t(id);
    const pct = (!isDone && !isNotes && totalInCat > 0) ? Math.round((doneInCat / totalInCat) * 100) : 0;
    const isComplete = totalInCat > 0 && doneInCat === totalInCat;
    let countBadgeHTML = '';
    const svgFn = (typeof getLucideSvg === 'function') ? getLucideSvg : ((name, cls) => `<i data-lucide="${name}" class="${cls}"></i>`);
    if (isDone) {
      countBadgeHTML = `
        <div class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-xs flex items-center gap-1 shrink-0" title="${doneList.length} erledigte Aufgaben">
          ${svgFn('check', 'w-3 h-3 text-emerald-400')}
          <span>${doneList.length}</span>
        </div>
      `;
    } else if (isNotes) {
      const noteCount = (currentItems.notes || []).length;
      countBadgeHTML = `
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-xs shrink-0" title="${noteCount} Notizen">
          ${noteCount}
        </span>
      `;
    } else {
      let badgeStyle = 'bg-white/5 text-gray-400 border-white/10';
      let checkSuffix = '';
      if (isComplete) {
        badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.25)]';
        checkSuffix = ' ✓';
      } else if (doneInCat > 0) {
        badgeStyle = 'bg-[var(--accent)]/15 text-[var(--accent-light)] border-[var(--accent)]/30';
      }
      
      countBadgeHTML = `
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border shadow-xs ${badgeStyle} transition-all duration-300 shrink-0" title="${doneInCat} von ${totalInCat} erledigt (${pct}%)">
          ${doneInCat}/${totalInCat}${checkSuffix}
        </span>
      `;
    }

    const article = document.createElement('article');
    article.dataset.category = id;
    article.dataset.columnType = isCustomCol ? 'custom' : 'system';
    article.className = `group/col relative min-h-[380px] h-full flex flex-col p-3 pt-3.5 rounded-2xl transition-all duration-300 cursor-default column-card-breathing overflow-hidden ${isCustomCol ? 'border border-dashed border-purple-500/25' : ''}`;

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
          const targetList = isWork ? (workCategoriesOrder || WORK_CATEGORIES_ORDER) : categoriesOrder;
          const srcIdx = targetList.findIndex(([catId]) => catId === srcId);
          const targetIdx = targetList.findIndex(([catId]) => catId === targetId);
          if (srcIdx !== -1 && targetIdx !== -1) {
            saveHistory(); const [removed] = targetList.splice(srcIdx, 1);
            targetList.splice(targetIdx, 0, removed);
            saveCategoriesOrder();
            renderApp();
            showToast(tr({ de: 'Spalten-Reihenfolge aktualisiert ↕️', en: 'Column order updated ↕️', es: 'Orden de columnas actualizado ↕️', el: 'Η σειρά στηλών ενημερώθηκε ↕️', fr: 'Ordre des colonnes mis à jour ↕️', it: 'Ordine delle colonne aggiornato ↕️' }));
          }
        }
        draggedColumnId = null;
      } else { handleDrop(e, id); }
    };
    const hasDice = (id === 'daily' || id === 'weekly' || id === 'todo' || id === 'occasionally' || id === 'work_focus' || id === 'work_in_progress' || id === 'work_backlog' || id === 'work_waiting');

    const COLUMN_ICONS_DEFAULT = {
      daily: 'sun',
      work_focus: 'sun',
      weekly: 'home',
      work_in_progress: 'home',
      todo: 'list-todo',
      work_backlog: 'list-todo',
      occasionally: 'clock',
      work_waiting: 'clock',
      done: 'check-circle-2',
      termine: 'calendar',
      notes: 'file-text'
    };
    const finalIcon = COLUMN_ICONS_DEFAULT[id] || iconKey || 'layers';
    const theme = COLUMN_THEMES[id] || { color: 'text-[var(--accent-light)]', bg: 'bg-white/5 border-white/10 shadow-xs' };

    const columnIconHTML = `
      <span class="w-5 h-5 rounded-md border ${theme.bg} flex items-center justify-center ${theme.color} shrink-0 pointer-events-none transition-transform group-hover/col:scale-105">
        ${svgFn(finalIcon, 'w-3 h-3')}
      </span>
    `;

    article.innerHTML = `
      ${(!isDone && !isNotes) ? `
        <div class="absolute top-0 left-0 right-0 h-[2.5px] bg-white/[0.04] overflow-hidden pointer-events-none">
          <div class="h-full bg-gradient-to-r from-[var(--accent)] via-cyan-400 to-emerald-400 transition-all duration-500 ${isComplete ? 'shadow-[0_0_12px_rgba(16,185,129,0.8)]' : ''}" style="width: ${pct}%"></div>
        </div>
      ` : ''}
      
      <!-- Floating Action Mini-Capsule on Hover -->
      <div class="absolute right-2 top-2 hidden sm:group-hover/col:flex items-center gap-1 bg-[#13131e]/95 border border-white/15 px-1.5 py-1 rounded-xl shadow-xl z-20 backdrop-blur-md">
        ${hasDice ? `
          <button onclick="rollTaskDice('${id}', event)" aria-label="${tr({ de: 'Aufgabe auswürfeln 🎲', en: 'Roll a task 🎲', es: 'Tirar dado 🎲', el: 'Ρίξε το ζάρι 🎲', fr: 'Tirer au sort 🎲', it: 'Lancia il dado 🎲' })}" class="p-1 px-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/15 hover:from-purple-500/35 hover:to-pink-500/30 border border-purple-400/30 hover:border-purple-300 text-purple-200 hover:text-white rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 group/dice" title="${tr({ de: 'Aufgabe auswürfeln 🎲', en: 'Roll a task 🎲', es: 'Tirar dado 🎲', el: 'Ρίξε το ζάρι 🎲', fr: 'Tirer au sort 🎲', it: 'Lancia il dado 🎲' })}">
            <svg class="w-3.5 h-3.5 text-purple-300 group-hover/dice:text-white group-hover/dice:scale-110 group-hover/dice:rotate-6 transition-all duration-200 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" fill-opacity="0.15" stroke="currentColor" />
              <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </button>
        ` : ''}
        ${(id === 'weekly' || id === 'work_in_progress') ? `
          <button onclick="if(typeof openCleaningGuideModal === 'function') openCleaningGuideModal(); if(event) event.stopPropagation();" aria-label="${tr({ de: 'Grundreinigung', en: 'Deep Cleaning', es: 'Limpieza a fondo', el: 'Γενική καθαριότητα', fr: 'Nettoyage en profondeur', it: 'Pulizia profonda' })}" class="p-1 px-1.5 bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/30 text-emerald-300 hover:text-white rounded-lg shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1" title="${tr({ de: 'Grundreinigung', en: 'Deep Cleaning', es: 'Limpieza a fondo', el: 'Γενική καθαριότητα', fr: 'Nettoyage en profondeur', it: 'Pulizia profonda' })}">
            ${svgFn('sparkles', 'w-3.5 h-3.5 text-emerald-400')}
          </button>
        ` : ''}
        ${!isDone ? `
          <button onclick="quickAddTaskTop('${id}', event)" aria-label="${tr({ de: 'Aufgabe hinzufügen ➕', en: 'Add task ➕', es: 'Añadir tarea ➕', el: 'Προσθήκη εργασίας ➕', fr: 'Ajouter tâche ➕', it: 'Aggiungi attività ➕' })}" class="p-1 text-gray-300 hover:text-[var(--accent-light)] hover:bg-white/10 rounded-lg transition cursor-pointer flex items-center justify-center" title="${tr({ de: 'Aufgabe hinzufügen ➕', en: 'Add task ➕', es: 'Añadir tarea ➕', el: 'Προσθήκη εργασίας ➕', fr: 'Ajouter tâche ➕', it: 'Aggiungi Aktivitäten ➕' })}">
            ${svgFn('plus', 'w-3.5 h-3.5')}
          </button>
        ` : ''}
        ${isCustomCol ? `
          <button onclick="renameColumn('${id}', event)" aria-label="${t('rename_column') || 'Umbenennen'}" class="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer flex items-center justify-center" title="${t('rename_column') || 'Umbenennen'}">${svgFn('edit-3', 'w-3 h-3')}</button>
          <button onclick="deleteColumn('${id}', event)" aria-label="${t('delete_column') || 'Löschen'}" class="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/15 rounded-lg transition cursor-pointer flex items-center justify-center" title="${t('delete_column') || 'Löschen'}">${svgFn('trash-2', 'w-3 h-3')}</button>
        ` : ''}
      </div>

      <div class="flex items-center justify-between gap-1.5 mb-2 pb-1.5 border-b border-white/[0.04]">
        <div class="flex items-center gap-1.5 select-none min-w-0 flex-1 cursor-grab active:cursor-grabbing" title="${tr({ de: 'Spalte durch Ziehen neu anordnen', en: 'Drag to reorder column', fr: 'Glisser pour réorganiser la colonne', it: 'Trascina per riordinare la colonna', es: 'Arrastrar para reordenar columna', el: 'Σύρετε για αναδιάταξη στήλης' })}">
          ${columnIconHTML}
          <h2 class="text-gray-200 hover:text-white font-bold font-display text-xs tracking-wide uppercase transition whitespace-nowrap">
            ${catName}
          </h2>
        </div>
        <div class="flex items-center gap-1 shrink-0 ml-1">
          ${id === 'weekly' ? `
            <button onclick="if(typeof openCleaningGuideModal === 'function') openCleaningGuideModal(); if(event) event.stopPropagation();" aria-label="${tr({ de: 'Grundreinigung', en: 'Deep Cleaning', es: 'Limpieza a fondo', el: 'Γενική καθαριότητα', fr: 'Nettoyage en profondeur', it: 'Pulizia profonda' })}" class="p-1 px-1.5 bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/30 text-emerald-300 hover:text-white rounded-lg shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1" title="${tr({ de: 'Grundreinigung', en: 'Deep Cleaning', es: 'Limpieza a fondo', el: 'Γενική καθαριότητα', fr: 'Nettoyage en profondeur', it: 'Pulizia profonda' })}">
              ${svgFn('sparkles', 'w-3.5 h-3.5 text-emerald-400')}
            </button>
          ` : ''}
          ${countBadgeHTML}
        </div>
      </div>
      <div id="list-${id}" class="flex flex-col gap-1.5 flex-1 min-h-[100px] overflow-y-auto py-0.5 px-0.5 custom-scrollbar"></div>
      ${(!isDone) ? `
        <div class="flex items-center justify-start pt-1 px-0.5 mt-auto">
          <button onclick="openTextImportModal('${id}', event)" aria-label="${isNotes ? 'Notizen importieren' : (isTermine ? 'Termine importieren' : 'Aufgaben importieren')}" class="p-1 rounded-md bg-transparent hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-500 hover:text-gray-200 opacity-40 hover:opacity-100 transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0" title="${isNotes ? tr({ de: 'Notizen importieren (.txt, .md, .csv, .json oder Zwischenablage)', en: 'Import notes (.txt, .md, .csv, .json or clipboard)', es: 'Importar notas (.txt, .md, .csv, .json o portapapeles)', el: 'Εισαγωγή σημειώσεων (.txt, .md, .csv, .json ή πρόχειρο)', fr: 'Importer des notes (.txt, .md, .csv, .json ou presse-papiers)', it: 'Importa note (.txt, .md, .csv, .json o appunti)' }) : (isTermine ? tr({ de: 'Termine aus Kalenderdatei (.ics) oder Text importieren', en: 'Import appointments from calendar file (.ics) or text', es: 'Importar citas desde archivo (.ics) o texto', el: 'Εισαγωγή ραντεβού από ημερολόγιο (.ics) ή κείμενο', fr: 'Importer des rendez-vous depuis un fichier (.ics) ou texte', it: 'Importa appuntamenti da file (.ics) o testo' }) : tr({ de: 'Aufgaben importieren (.txt, .md, .csv, .json oder Zwischenablage)', en: 'Import tasks (.txt, .md, .csv, .json or clipboard)', es: 'Importar tareas (.txt, .md, .csv, .json o portapapeles)', el: 'Εισαγωγή εργασιών (.txt, .md, .csv, .json ή πρόχειρο)', fr: 'Importer des tâches (.txt, .md, .csv, .json ou presse-papiers)', it: 'Importa attività (.txt, .md, .csv, .json o appunti)' }))}">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <polyline points="9 15 12 12 15 15"/>
            </svg>
          </button>
        </div>
      ` : ''}
    `;
    const listEl = article.querySelector(`#list-${id}`);
    if (isDone) {
      doneList.slice().reverse().forEach((item, idx) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'group p-1.5 px-2.5 text-[11px] min-h-[28px] text-gray-400 hover:text-white border border-dashed border-slate-700/80 hover:border-purple-500 rounded-lg bg-slate-800/25 hover:bg-purple-950/20 cursor-pointer font-medium transition flex items-center justify-between gap-1';
        itemDiv.onclick = () => handleRestoreDoneTask(idx); itemDiv.title = "Zurück in den Plan verschieben";
        itemDiv.innerHTML = `<span class="truncate leading-tight">${escapeHtml(item.task)} · ${escapeHtml(item.time)}</span><i data-lucide="undo" class="w-3 h-3 opacity-0 group-hover:opacity-100 text-purple-400 shrink-0"></i>`;
        listEl.appendChild(itemDiv);
      });
    } else if (isNotes) {
      const notesList = currentItems.notes || [];
      notesList.forEach((note, index) => {
        const noteText = typeof note === 'object' ? note.task : note;
        const safeNoteEscaped = escapeHtml(noteText);
        const itemDiv = document.createElement('div');
        itemDiv.draggable = true;
        itemDiv.ondragstart = (e) => handleDragStart(e, 'notes', index);
        itemDiv.ondragover = (e) => handleDragOver(e);
        itemDiv.ondragleave = (e) => handleDragLeave(e);
        itemDiv.ondragend = (e) => handleDragEnd(e);
        itemDiv.ondrop = (e) => handleItemDrop(e, 'notes', index);
        itemDiv.className = `group relative w-full h-auto min-h-[32px] flex items-center justify-between py-1.5 px-2.5 border-0 border-l-[3.5px] border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-gray-100 font-medium transition-all duration-150 ease-out rounded-xl shadow-xs cursor-pointer`;
        itemDiv.onclick = () => openNoteDetailModal(index);
        
        itemDiv.innerHTML = `
          <div class="flex items-center gap-1.5 flex-1 min-w-0 pr-2 pointer-events-none">
            <i data-lucide="sticky-note" class="w-3.5 h-3.5 text-amber-400 shrink-0"></i>
            <span class="text-xs text-amber-100 font-normal leading-snug break-normal whitespace-normal flex-1 select-text" title="${safeNoteEscaped}">${safeNoteEscaped}</span>
          </div>
          <div class="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 shrink-0 bg-[#141420]/95 border border-white/10 p-0.5 rounded-lg shadow-md z-40 backdrop-blur-md" onclick="event.stopPropagation()">
            <button onclick="openNoteDetailModal(${index}, event)" aria-label="${tr({ de: 'Notiz öffnen & bearbeiten', en: 'Open & edit note', fr: 'Ouvrir et modifier la note', it: 'Apri e modifica nota', es: 'Abrir y editar nota', el: 'Άνοιγμα & επεξεργασία σημείωσης' })}" class="p-1 text-amber-400 hover:text-amber-300 hover:bg-white/10 rounded-md transition cursor-pointer" title="${tr({ de: 'Notiz öffnen & bearbeiten', en: 'Open & edit note', fr: 'Ouvrir et modifier la note', it: 'Apri e modifica nota', es: 'Abrir y editar nota', el: 'Άνοιγμα & επεξεργασία σημείωσης' })}">
              <i data-lucide="edit-3" class="w-3 h-3"></i>
            </button>
            <button onclick="copyNoteText(${index}, event)" aria-label="${tr({ de: 'Kopieren', en: 'Copy', es: 'Copiar', el: 'Αντιγραφή', fr: 'Copier', it: 'Copia' })}" class="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition cursor-pointer" title="${tr({ de: 'Kopieren', en: 'Copy', es: 'Copiar', el: 'Αντιγραφή', fr: 'Copier', it: 'Copia' })}">
              <i data-lucide="copy" class="w-3 h-3"></i>
            </button>
            <button onclick="deleteTask('notes', ${index}, event)" aria-label="${tr({ de: 'Notiz löschen', en: 'Delete note', fr: 'Supprimer la note', it: 'Elimina nota', es: 'Eliminar nota', el: 'Διαγραφή σημείωσης' })}" class="p-1 text-gray-500 hover:text-red-400 hover:bg-white/10 rounded-md transition cursor-pointer" title="${tr({ de: 'Notiz löschen', en: 'Delete note', fr: 'Supprimer la note', it: 'Elimina nota', es: 'Eliminar nota', el: 'Διαγραφή σημείωσης' })}">
              <i data-lucide="trash-2" class="w-3 h-3"></i>
            </button>
          </div>
        `;
        listEl.appendChild(itemDiv);
      });

      const addBtn = document.createElement('button');
      addBtn.onclick = () => { openTaskAddColumns['notes'] = true; renderApp(); };
      addBtn.className = 'w-full min-h-[30px] p-1.5 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/15 hover:border-amber-400/60 text-center text-xs text-amber-300/90 hover:text-amber-200 font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs group/addbtn mt-1';
      addBtn.innerHTML = `${svgFn('plus', 'w-3.5 h-3.5 text-amber-400 group-hover/addbtn:scale-110 transition-transform')}<span>${tr({ de: 'Notiz hinzufügen', en: 'Add note', es: 'Añadir nota', el: 'Προσθήκη σημείωσης', fr: 'Ajouter une note', it: 'Aggiungi nota' })}</span>`;

      const addInput = document.createElement('textarea');
      addInput.rows = 2;
      addInput.placeholder = t('notesPlaceholder') || tr({ de: 'Neue Notiz tippen (Enter zum Speichern)...', en: 'Type new note (Enter to save)...' });
      addInput.className = 'w-full min-h-[44px] p-1.5 px-2.5 rounded-xl border border-amber-500/60 bg-[#0a0a0e] text-left text-xs placeholder:text-gray-500 focus:outline-none focus:border-amber-400 transition cursor-text font-medium text-amber-100 shadow-inner resize-none mt-1';
      addInput.onkeydown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && addInput.value.trim()) {
          e.preventDefault();
          saveHistory();
          const curItems = getCurrentWorkspaceItems();
          if (!curItems.notes) curItems.notes = [];
          curItems.notes.push(addInput.value.trim());
          addInput.value = '';
          openTaskAddColumns['notes'] = false;
          saveState(); renderApp();
        }
        if (e.key === 'Escape') { openTaskAddColumns['notes'] = false; renderApp(); }
      };
      if (openTaskAddColumns['notes']) {
        listEl.appendChild(addInput);
        setTimeout(() => {
          if (typeof addInput.focus === 'function') addInput.focus();
          try { addInput.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch(e) {}
        }, 0);
      } else {
        listEl.appendChild(addBtn);
      }
    } else if (isTermine) {
      const rawTermine = currentItems.termine || [];
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
        let fullDateString = "No Date";
        if (item.date) {
          try {
            const parts = item.date.split('-');
            if (parts.length === 3) {
              const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
              fullDateString = d.toLocaleDateString(currentLang, { weekday: 'short', day: 'numeric', month: 'short' });
            }
          } catch (e) {
            console.warn('[Tasks] Date parsing warning:', e);
          }
        }
        let locHTML = item.location ? `<span class="text-[9px] text-gray-400 truncate max-w-[90px] inline-flex items-center gap-0.5">${svgFn('map-pin', 'w-3 h-3 shrink-0 text-gray-500')}${escapeHtml(item.location)}</span>` : '';
        const itemDiv = document.createElement('div');
        itemDiv.className = `group relative w-full h-auto min-h-[34px] flex items-center justify-between py-1.5 px-2.5 border-0 border-l-[3.5px] ${isToday ? 'border-amber-400 bg-amber-500/10' : 'border-amber-500/40 bg-white/[0.035]'} hover:bg-white/[0.07] text-gray-200 font-medium transition-all duration-150 ease-out rounded-xl shadow-xs cursor-pointer`;
        itemDiv.onclick = () => editTermin(originalIndex);
        itemDiv.innerHTML = `
          <div class="flex items-center gap-2 flex-1 min-w-0 pr-10 select-none">
            <button onclick="handleCompleteTask('termine', ${originalIndex}, event)" aria-label="${tr({ de: 'Termin als erledigt markieren', en: 'Mark appointment as completed', fr: 'Marquer le rendez-vous comme terminé', it: 'Segna appuntamento come completato', es: 'Marcar cita como completada', el: 'Σήμανση ραντεβού ως ολοκληρωμένο' })}" class="task-check-btn p-0 bg-transparent border-0 cursor-pointer shrink-0" title="${tr({ de: 'Termin als erledigt markieren', en: 'Mark appointment as completed', fr: 'Marquer le rendez-vous comme terminé', it: 'Segna appuntamento come completato', es: 'Marcar cita como completada', el: 'Σήμανση ραντεβού ως ολοκληρωμένο' })}">
              <span class="task-check-circle relative flex items-center justify-center w-5.5 h-5.5 rounded-full border border-orange-400/30 bg-orange-500/10 hover:border-emerald-400 hover:bg-emerald-500/20 hover:scale-110 active:scale-90 transition-all duration-200 shrink-0 shadow-xs group/check">
                ${svgFn('clock', 'task-default-icon w-3.5 h-3.5 text-orange-400 transition-all duration-200 group-hover/check:opacity-0 group-hover/check:scale-50')}
                ${svgFn('check', 'task-hover-check w-3.5 h-3.5 text-emerald-400 opacity-0 scale-50 group-hover/check:opacity-100 group-hover/check:scale-100 transition-all duration-200 absolute')}
              </span>
            </button>
            <div class="flex flex-col min-w-0 flex-1 cursor-pointer" onclick="editTermin(${originalIndex}, event)">
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="text-xs leading-snug font-semibold text-amber-100 break-normal whitespace-normal">${escapeHtml(item.task || item.name || 'Termin')}</span>
                ${item.time ? `<span class="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">${escapeHtml(item.time)}</span>` : ''}
              </div>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span class="text-[9px] font-mono text-gray-400">${escapeHtml(fullDateString)}</span>
                ${locHTML}
              </div>
            </div>
          </div>
          <div class="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 shrink-0 bg-[#141420]/95 border border-white/10 p-0.5 rounded-lg shadow-md z-40 backdrop-blur-md">
            <button onclick="editTermin(${originalIndex}, event)" aria-label="${tr({ de: 'Termin bearbeiten', en: 'Edit appointment', fr: 'Modifier le rendez-vous', it: 'Modifica appuntamento', es: 'Editar cita', el: 'Επεξεργασία ραντεβού' })}" class="p-1 text-amber-400 hover:text-amber-300 hover:bg-white/10 rounded-md transition cursor-pointer" title="${tr({ de: 'Termin bearbeiten', en: 'Edit appointment', fr: 'Modifier le rendez-vous', it: 'Modifica appuntamento', es: 'Editar cita', el: 'Επεξεργασία ραντεβού' })}">${svgFn('edit-3', 'w-3 h-3')}</button>
            <button onclick="deleteTask('termine', ${originalIndex}, event)" aria-label="${tr({ de: 'Termin löschen', en: 'Delete appointment', fr: 'Supprimer le rendez-vous', it: 'Elimina appuntamento', es: 'Eliminar cita', el: 'Διαγραφή ραντεβού' })}" class="p-1 text-gray-500 hover:text-red-400 hover:bg-white/10 rounded-md transition cursor-pointer" title="${tr({ de: 'Termin löschen', en: 'Delete appointment', fr: 'Supprimer le rendez-vous', it: 'Elimina appuntamento', es: 'Eliminar cita', el: 'Διαγραφή ραντεβού' })}">${svgFn('trash-2', 'w-3 h-3')}</button>
          </div>
        `;
        listEl.appendChild(itemDiv);
      });
      const isFormOpen = (typeof isTerminFormOpen !== 'undefined') ? isTerminFormOpen : (window.isTerminFormOpen || false);
      if (!isFormOpen) {
        const btnEl = document.createElement('button'); btnEl.onclick = () => toggleTerminForm(true);
        btnEl.className = 'w-full min-h-[30px] p-1.5 rounded-xl border border-dashed border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/15 hover:border-orange-400/60 text-center text-xs text-orange-300/90 hover:text-orange-200 font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs group/addbtn mt-1';
        const btnT = t('appointment_new_btn') || tr({ de: 'Neuer Termin', en: 'New appointment', es: 'Nueva cita', el: 'Νέο ραντεβού', fr: 'Nouveau rendez-vous', it: 'Nuovo appuntamento' });
        btnEl.innerHTML = `${svgFn('calendar-plus', 'w-3.5 h-3.5 text-orange-400 group-hover/addbtn:scale-110 transition-transform')}<span>${btnT}</span>`;
        listEl.appendChild(btnEl);
      } else {
        const formDiv = document.createElement('div'); formDiv.className = 'mt-1 p-3 bg-[#0e0e14] border border-[var(--accent)]/40 rounded-xl flex flex-col gap-2 shadow-lg';
        const formT = t('appointment_form_title'); const nameT = t('appointment_form_name_placeholder');
        const dateT = t('appointment_form_date_label'); const timeT = t('appointment_form_time_label');
        const saveT = t('appointment_form_save_btn'); const cancelT = t('appointment_form_cancel_btn');
        const locPlaceholder = t('appointment_form_location_placeholder') || tr({
          de: "Ort (z.B. Zoom, Büro, Praxis, Park)",
          en: "Location (e.g. Zoom, Office, Clinic, Park)",
          fr: "Lieu (ex. Zoom, Bureau, Cabinet, Parc)",
          it: "Luogo (es. Zoom, Ufficio, Studio, Parco)",
          es: "Lugar (ej. Zoom, Oficina, Consulta, Parque)",
          el: "Τοποθεσία (π.χ. Zoom, Γραφείο, Ιατρείο, Πάρκο)"
        });
        const dateValue = selectedCalendarDate || todayISO;
        formDiv.innerHTML = `
          <div class="flex items-center justify-between text-xs font-bold text-amber-300">
            <span class="flex items-center gap-1.5">${svgFn('calendar', 'w-3.5 h-3.5')} ${formT}</span>
            <button onclick="toggleTerminForm(false)" aria-label="Termin-Formular schließen" class="text-gray-400 hover:text-white p-0.5 cursor-pointer text-xs">✕</button>
          </div>
          <input type="text" id="add-termin-title" placeholder="${nameT}" class="w-full p-2 bg-black/60 border border-white/15 rounded-lg text-xs text-white outline-none focus:border-[var(--accent)] font-semibold placeholder:text-gray-500 mb-2" />
          <input type="text" id="add-termin-location" placeholder="${locPlaceholder}" class="w-full p-2 bg-black/60 border border-white/15 rounded-lg text-xs text-white outline-none focus:border-[var(--accent)] font-semibold placeholder:text-gray-500 mb-2" />
          <div class="grid grid-cols-2 gap-2 mb-2">
            <div><label class="text-[10px] text-gray-400 mb-0.5 block font-medium">${dateT}</label><input type="date" id="add-termin-date" value="${dateValue}" class="w-full p-1.5 bg-black/60 border border-white/15 rounded-lg text-xs text-gray-200 outline-none focus:border-[var(--accent)] cursor-pointer" /></div>
            <div><label class="text-[10px] text-gray-400 mb-0.5 block font-medium">${timeT}</label><input type="time" id="add-termin-time" value="10:00" class="w-full p-1.5 bg-black/60 border border-white/15 rounded-lg text-xs text-gray-200 outline-none focus:border-[var(--accent)] cursor-pointer" /></div>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <button onclick="handleAddTermin()" class="flex-1 py-1.5 bg-[var(--accent)] hover:opacity-90 text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm">${svgFn('check', 'w-3.5 h-3.5')}<span>${saveT}</span></button>
            <button onclick="toggleTerminForm(false)" class="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs rounded-lg transition cursor-pointer">${cancelT}</button>
          </div>
        `;
        setTimeout(() => {
          const inputTitle = formDiv.querySelector('#add-termin-title');
          if (inputTitle) {
            if (typeof inputTitle.focus === 'function') inputTitle.focus();
            try { formDiv.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch(e) {}
            inputTitle.onkeydown = (e) => {
              if (e.key === 'Enter' && inputTitle.value.trim()) handleAddTermin();
              if (e.key === 'Escape') toggleTerminForm(false);
            };
          }
        }, 0);
        listEl.appendChild(formDiv);
      }
    } else {
      (currentItems[id] || []).forEach((task, index) => {
        const taskObj = typeof task === 'object' ? task : { task: task };
        const taskText = taskObj.task;
        const taskColor = taskObj.color || 'none';
        const colorStyle = TASK_COLOR_MAP[taskColor] || TASK_COLOR_MAP.none;
        const iconDetails = (typeof getTaskIconDetails === 'function') ? getTaskIconDetails(taskText, id) : { icon: 'check-circle', color: 'text-purple-400' };
        const isTaskActive = (typeof activeTimerTask !== 'undefined' && activeTimerTask && activeTimerTask.category === id && activeTimerTask.index === index);
        const itemDiv = document.createElement('div');
        itemDiv.draggable = true;
        itemDiv.ondragstart = (e) => handleDragStart(e, id, index);
        itemDiv.ondragover = (e) => handleDragOver(e);
        itemDiv.ondragleave = (e) => handleDragLeave(e);
        itemDiv.ondragend = (e) => handleDragEnd(e);
        itemDiv.ondrop = (e) => handleItemDrop(e, id, index);
        const borderBgClass = isTaskActive 
          ? 'border-amber-400 bg-amber-500/15 shadow-[0_0_18px_rgba(251,191,36,0.25)]' 
          : (taskColor !== 'none' ? `${colorStyle.border} ${colorStyle.bg} ${colorStyle.shadow}` : 'border-[var(--accent)] bg-white/[0.035] hover:bg-white/[0.07]');
        itemDiv.className = `group relative w-full h-auto min-h-[34px] flex items-center justify-between py-1.5 px-2.5 border-0 border-l-[3.5px] ${borderBgClass} text-gray-200 font-medium rounded-xl transition-colors`;
        const safeTaskEscaped = escapeHtml(taskText);
        const formattedTaskHtml = safeTaskEscaped.replace(/ &amp; /g, '&nbsp;&amp; ').replace(/ & /g, '&nbsp;& ');
        const pair = HOVER_COLOR_PAIRS[(index + id.charCodeAt(0)) % HOVER_COLOR_PAIRS.length];
        const recurrenceBadge = (taskObj.recurrence && taskObj.recurrence !== 'none')
          ? `<span class="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0 ml-auto mr-1">🔁 ${t('recurrence_' + taskObj.recurrence) || taskObj.recurrence}</span>`
          : '';
        const editTooltip = tr({ de: 'Klicken zum Bearbeiten', en: 'Click to edit', fr: 'Cliquer pour modifier', it: 'Clicca per modificare', es: 'Clic para editar', el: 'Κλικ για επεξεργασία' });
        itemDiv.innerHTML = `
          <div class="flex items-center gap-2 flex-1 min-w-0 pr-6 select-none">
            <button onclick="handleCompleteTask('${id}', ${index}, event)" aria-label="${tr({ de: 'Als erledigt markieren', en: 'Mark as completed', fr: 'Marquer comme terminé', it: 'Segna come completato', es: 'Marcar como completada', el: 'Σήμανση ως ολοκληρωμένο' })}" class="task-check-btn p-0 bg-transparent border-0 cursor-pointer shrink-0" title="${tr({ de: 'Als erledigt markieren', en: 'Mark as completed', fr: 'Marquer comme terminé', it: 'Segna come completato', es: 'Marcar como completada', el: 'Σήμανση ως ολοκληρωμένο' })}">
              <span class="task-check-circle relative flex items-center justify-center w-5.5 h-5.5 rounded-full border border-white/20 bg-white/[0.04] hover:border-emerald-400 hover:bg-emerald-500/20 hover:scale-110 active:scale-90 transition-all duration-200 shrink-0 shadow-xs group/check">
                ${svgFn(iconDetails.icon, `task-default-icon w-3.5 h-3.5 ${isTaskActive ? 'text-amber-400 animate-pulse' : (taskColor !== 'none' ? colorStyle.iconColor : iconDetails.color)} transition-all duration-200 group-hover/check:opacity-0 group-hover/check:scale-50`)}
                ${svgFn('check', 'task-hover-check w-3.5 h-3.5 text-emerald-400 opacity-0 scale-50 group-hover/check:opacity-100 group-hover/check:scale-100 transition-all duration-200 absolute')}
              </span>
            </button>
            <span data-task-span="${id}-${index}" onclick="editTaskInline('${id}', ${index}, event)" class="task-text-span block text-xs leading-snug py-0.5 min-w-0 flex-1 font-medium text-gray-200 hover:text-white break-normal whitespace-normal cursor-pointer active:cursor-text ${isTaskActive ? 'text-amber-200 font-bold' : (taskColor !== 'none' ? colorStyle.text : '')} ${pair.text} transition-colors duration-150" title="${safeTaskEscaped} (${editTooltip})">${formattedTaskHtml}</span>
            ${recurrenceBadge}
          </div>
          <div class="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 shrink-0 z-40">
            <button onmouseenter="cancelCloseTaskMenu(); openTaskOptionsMenu('${id}', ${index}, this);" onmouseleave="scheduleCloseTaskMenu();" onclick="toggleTaskOptionsMenu('${id}', ${index}, event)" aria-label="${tr({ de: 'Aufgabenoptionen öffnen', en: 'Open task options', fr: 'Ouvrir options', it: 'Apri opzioni', es: 'Abrir opciones', el: 'Επιλογές' })}" class="p-1 px-1.5 text-gray-200 hover:text-white bg-[#1a1a28] hover:bg-[#252538] border border-white/20 rounded-lg shadow-md transition cursor-pointer" title="${tr({ de: 'Optionen (Steps, Focus, etc.)', en: 'Options (Steps, Focus, etc.)', fr: 'Options (Steps, Focus, etc.)', it: 'Opzioni (Steps, Focus, etc.)', es: 'Opciones (Steps, Focus, etc.)', el: 'Επιλογές (Steps, Focus, etc.)' })}">
              ${svgFn('more-horizontal', 'w-3.5 h-3.5 text-gray-200 hover:text-white')}
            </button>
          </div>
        `;
        listEl.appendChild(itemDiv);
      });
      const addBtn = document.createElement('button'); addBtn.onclick = () => { openTaskAddColumns[id] = true; renderApp(); };
      addBtn.className = 'w-full min-h-[30px] p-1.5 rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.06] hover:border-[var(--accent)]/40 text-center text-xs text-gray-400 hover:text-white font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs group/addbtn mt-1';
      addBtn.innerHTML = `${svgFn('plus', 'w-3.5 h-3.5 text-[var(--accent-light)] group-hover/addbtn:scale-110 transition-transform')}<span>${t('add')}</span>`;

      const addInput = document.createElement('input'); addInput.type = 'text';
      addInput.placeholder = t('add');
      addInput.className = 'w-full min-h-[32px] p-1.5 px-2.5 rounded-xl border border-[var(--accent)]/60 bg-[#0e0e16] text-left text-xs placeholder:text-gray-500 focus:outline-none focus:border-[var(--accent)] transition cursor-text font-semibold text-white shadow-inner mt-1';
      addInput.onkeydown = (e) => {
        if (e.key === 'Enter' && addInput.value.trim()) {
          saveHistory();
          const taskText = addInput.value.trim();
          const taskObj = (typeof ensureItemIdentity === 'function') 
            ? ensureItemIdentity(taskText, `task_${id}`)
            : { task: taskText };
          curItems[id].push(taskObj);
          addInput.value = '';
          openTaskAddColumns[id] = false;
          saveState(); renderApp(); populateHelperTaskSelect();
        }
        if (e.key === 'Escape') { openTaskAddColumns[id] = false; renderApp(); }
      };
      if (openTaskAddColumns[id]) {
        listEl.appendChild(addInput);
        setTimeout(() => {
          if (typeof addInput.focus === 'function') addInput.focus();
          try { addInput.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch(e) {}
        }, 0);
      } else {
        listEl.appendChild(addBtn);
      }
    }
    fragment.appendChild(article);
  });

  main.appendChild(fragment);
  updateShoppingListPopup(true); renderCookingPanel(true);
  renderLucideIcons(false, main);
  renderMobileCategoryTabs();
}

function renderMobileCategoryTabs() {
  const bar = document.getElementById('mobile-category-tabs');
  if (!bar) return;

  const curItems = getCurrentWorkspaceItems();
  const doneList = getCurrentWorkspaceDone();
  const isWork = state && state.activeWorkspace === 'work';
  const activeOrder = isWork ? (workCategoriesOrder || WORK_CATEGORIES_ORDER) : categoriesOrder;

  let activeCat = localStorage.getItem('flowPlannerMobileCategory');
  if (!activeCat || !activeOrder.some(([id]) => id === activeCat)) {
    activeCat = activeOrder[0] ? activeOrder[0][0] : (isWork ? 'work_focus' : 'daily');
  }
  document.body.dataset.mobileCat = activeCat;

  bar.innerHTML = activeOrder.map(([id, iconKey, customTitle]) => {
    const isActive = id === activeCat;
    const isDone = id === 'done';
    const activeCount = (curItems[id] || []).length;
    const count = isDone ? doneList.length : activeCount;
    const shortLabel = (customTitle || t(id)).replace(/\s*\(.*?\)\s*$/, '');

    return `
      <button onclick="setMobileCategory('${id}')" class="mobile-tab-btn ${isActive ? 'mobile-tab-active' : ''}" data-cat="${id}">
        <i data-lucide="${iconKey}" class="w-3.5 h-3.5"></i>
        <span>${shortLabel}</span>
        <span class="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${isActive ? 'bg-white/25 text-white' : 'bg-white/10 text-gray-400'}">${count}</span>
      </button>
    `;
  }).join('');

  renderLucideIcons();
}

function setMobileCategory(id) {
  document.body.dataset.mobileCat = id;
  localStorage.setItem('flowPlannerMobileCategory', id);
  document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
    const isAct = btn.dataset.cat === id;
    btn.classList.toggle('mobile-tab-active', isAct);
    if (isAct) {
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });
  const main = document.querySelector('main');
  if (main) main.scrollIntoView({ behavior: 'instant', block: 'start' });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function stepMobileCategory(direction = 1) {
  const isWork = state && state.activeWorkspace === 'work';
  const activeOrder = isWork ? (workCategoriesOrder || WORK_CATEGORIES_ORDER) : categoriesOrder;
  const currentCat = document.body.dataset.mobileCat || (activeOrder[0] ? activeOrder[0][0] : 'daily');
  const idx = activeOrder.findIndex(([id]) => id === currentCat);
  if (idx === -1) return;
  const nextIdx = (idx + direction + activeOrder.length) % activeOrder.length;
  setMobileCategory(activeOrder[nextIdx][0]);
}
window.setMobileCategory = setMobileCategory;
window.stepMobileCategory = stepMobileCategory;

function animateTaskToDone(taskEl, targetSelector, onComplete) {
  if (!taskEl) { onComplete(); return; }
  taskEl.classList.add('task-completing-anim');
  setTimeout(() => {
    onComplete();
  }, 260);
}

function handleCompleteTask(category, index, event) {
  if (event) event.stopPropagation();
  let taskEl = null; if (event && event.currentTarget) { taskEl = event.currentTarget.closest('div[draggable="true"]'); }
  const clientX = event?.clientX || (taskEl ? taskEl.getBoundingClientRect().left + 40 : null);
  const clientY = event?.clientY || (taskEl ? taskEl.getBoundingClientRect().top + 20 : null);

  const onComplete = () => {
    const curItems = getCurrentWorkspaceItems();
    const curDone = getCurrentWorkspaceDone();
    const rawTask = curItems[category]?.[index]; if (!rawTask) return;
    saveHistory(); 
    curItems[category].splice(index, 1); 
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 
    const todayStr = now.toISOString().split('T')[0];
    let taskText = typeof rawTask === 'object' ? rawTask.task : rawTask;
    if (typeof rawTask === 'object' && rawTask.date) {
      let locInfo = rawTask.location ? ` @ ${rawTask.location}` : ''; taskText += ` (${formatTerminDate(rawTask.date, rawTask.time)}${locInfo})`;
    }
    curDone.push({ task: taskText, origin: category, date: todayStr, time: timeStr });
    if (state.completedSteps) delete state.completedSteps[taskText];
    
    setThemeSlow(getSimilarTheme(currentTheme)); 
    saveState(); 
    if (typeof CollabEngine !== 'undefined') {
      CollabEngine.broadcastBoardEvent(`hat Aufgabe erledigt: "${taskText.substring(0, 32)}" ✅`);
    }
    showPraise(); 
    renderApp(); 
    updateZenView(); 
    populateHelperTaskSelect();

    // 100% Celebration Check: Wenn Heute/Fokus komplett erledigt ist -> Feierabend-Erlebnis
    const isDailyCat = category === 'daily' || category === 'work_focus';
    if (isDailyCat && (curItems[category] || []).length === 0) {
      setTimeout(() => openFeierabendModal(), 450);
    } else if ((curItems[category] || []).length === 0) {
      // 100% Spalten-Badge Glow
      showToast(tr({
        de: `Spalte "${t(category)}" zu 100% erledigt! 🌟`,
        en: `Column "${t(category)}" 100% completed! 🌟`,
        fr: `Colonne "${t(category)}" terminée à 100% ! 🌟`,
        it: `Colonna "${t(category)}" completata al 100%! 🌟`,
        es: `¡Columna "${t(category)}" completada al 100%! 🌟`,
        el: `Η στήλη "${t(category)}" ολοκληρώθηκε 100%! 🌟`
      }));
    }
  };

  // Taktiler Leica-Klick & Fröhlicher Dur-Akkord & wechselnde Celebration-Partikel & Haptik & Canvas Sparkles
  if (typeof triggerHapticFeedback === 'function') triggerHapticFeedback();
  if (typeof triggerSparkleEffect === 'function') triggerSparkleEffect(clientX, clientY);
  if (typeof playTactileClickSound === 'function') playTactileClickSound();
  if (typeof playCheerfulSuccessJingle === 'function') playCheerfulSuccessJingle();
  if (typeof triggerCelebrationParticles === 'function') triggerCelebrationParticles(clientX, clientY);

  if (taskEl) { 
    spawnFloatingBubbles(event);
    animateTaskToDone(taskEl, '#list-done', onComplete); 
  } else { 
    spawnFloatingBubbles(event);
    onComplete(); 
  }
}

function openFeierabendModal() {
  const modal = document.getElementById('feierabend-celebration-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  renderLucideIcons();
  if (typeof triggerCelebrationParticles === 'function') triggerCelebrationParticles();
}

function closeFeierabendModal() {
  const modal = document.getElementById('feierabend-celebration-modal');
  if (modal) modal.classList.add('hidden');
}

function startFeierabendChillMode() {
  closeFeierabendModal();
  showToast(tr({
    de: 'Feierabend-Modus aktiviert! 🍹 Entspanne dich!',
    en: 'Chill mode activated! 🍹 Relax and enjoy!',
    fr: 'Mode détente activé ! 🍹 Profite bien !',
    it: 'Modalità relax attivata! 🍹 Buon riposo!',
    es: '¡Modo relax activado! 🍹 ¡A descansar!',
    el: 'Λειτουργία χαλάρωσης ενεργοποιήθηκε! 🍹'
  }));
  if (typeof startAmbientSound === 'function') {
    startAmbientSound('lofi_sunshine');
  }
}
window.openFeierabendModal = openFeierabendModal;
window.closeFeierabendModal = closeFeierabendModal;
window.startFeierabendChillMode = startFeierabendChillMode;

function deleteTask(category, index, event) {
  if (event) event.stopPropagation();
  saveHistory();
  const curItems = getCurrentWorkspaceItems();
  const taskObj = curItems[category]?.[index];
  const taskText = typeof taskObj === 'object' ? taskObj?.task : taskObj;
  const taskId = (taskObj && typeof taskObj === 'object' && taskObj.id) 
    ? taskObj.id 
    : ((typeof getStableId === 'function') ? getStableId(taskObj, `task_${category}`) : null);
  if (taskId && typeof trackTombstone === 'function') {
    trackTombstone(taskId);
  }

  if (curItems[category]) curItems[category].splice(index, 1);
  if (taskText && state.completedSteps) delete state.completedSteps[taskText];
  saveState();
  showToast(t('toast_task_deleted'), { undo: true, duration: 5000 });
  renderApp();
  updateZenView();
  populateHelperTaskSelect();
}


function handleRestoreDoneTask(doneIndex) {
  saveHistory();
  const curDone = getCurrentWorkspaceDone();
  const curItems = getCurrentWorkspaceItems();
  const reversedIndex = curDone.length - 1 - doneIndex;
  const item = curDone[reversedIndex]; if (!item) return;
  curDone.splice(reversedIndex, 1);
  const fallbackCat = state.activeWorkspace === 'work' ? 'work_focus' : 'daily';
  const targetCat = curItems[item.origin] ? item.origin : fallbackCat;
  if (!curItems[targetCat]) curItems[targetCat] = [];
  curItems[targetCat].push(item.task);
  saveState(); showToast(t('toast_task_restored')); renderApp(); updateZenView(); populateHelperTaskSelect();
}

let draggedItemInfo = null;

function cleanupDragIndicators() {
  document.querySelectorAll('.dragging, .drag-insert-top, .drag-insert-bottom, .drag-over').forEach(el => {
    el.classList.remove('dragging', 'drag-insert-top', 'drag-insert-bottom', 'drag-over');
  });
}

function handleDragStart(e, category, index) {
  draggedItemInfo = { category, index, element: e.currentTarget };
  e.stopPropagation();
  e.dataTransfer.setData('text/plain', JSON.stringify({ category, index }));
  e.dataTransfer.effectAllowed = 'move';
  const target = e.currentTarget;
  setTimeout(() => {
    if (target) target.classList.add('dragging');
  }, 10);
}

function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = 'move';
  
  const target = e.currentTarget;
  if (target && target.classList.contains('group')) {
    const rect = target.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const isTopHalf = relY < rect.height / 2;
    
    document.querySelectorAll('.drag-insert-top, .drag-insert-bottom').forEach(el => {
      if (el !== target) el.classList.remove('drag-insert-top', 'drag-insert-bottom');
    });
    
    if (isTopHalf) {
      target.classList.add('drag-insert-top');
      target.classList.remove('drag-insert-bottom');
    } else {
      target.classList.add('drag-insert-bottom');
      target.classList.remove('drag-insert-top');
    }
  }
}

function handleDragLeave(e) {
  const target = e.currentTarget;
  if (target) {
    target.classList.remove('drag-insert-top', 'drag-insert-bottom');
  }
}

function handleDragEnd(e) {
  cleanupDragIndicators();
  draggedItemInfo = null;
}

function rebindListDragHandlers(colId) {
  const list = document.getElementById(`list-${colId}`);
  if (!list) return;
  const items = Array.from(list.querySelectorAll(':scope > div.group'));
  items.forEach((itemDiv, idx) => {
    itemDiv.ondragstart = (e) => handleDragStart(e, colId, idx);
    itemDiv.ondragover = (e) => handleDragOver(e);
    itemDiv.ondragleave = (e) => handleDragLeave(e);
    itemDiv.ondragend = (e) => handleDragEnd(e);
    itemDiv.ondrop = (e) => handleItemDrop(e, colId, idx);
    
    const span = itemDiv.querySelector('.task-text-span');
    if (span) {
      span.setAttribute('data-task-span', `${colId}-${idx}`);
      span.onclick = (e) => editTaskInline(colId, idx, e);
    }
    const checkBtn = itemDiv.querySelector('.task-check-btn');
    if (checkBtn) {
      checkBtn.onclick = (e) => handleCompleteTask(colId, idx, e);
    }
    const optBtn = itemDiv.querySelector('button[onclick*="toggleTaskOptionsMenu"]');
    if (optBtn) {
      optBtn.onmouseenter = function() { cancelCloseTaskMenu(); openTaskOptionsMenu(colId, idx, this); };
      optBtn.onclick = (e) => toggleTaskOptionsMenu(colId, idx, e);
    }
  });
  
  const curItems = getCurrentWorkspaceItems();
  const count = (curItems[colId] || []).length;
  const article = list.closest('article');
  const badgeEl = article ? article.querySelector('.cat-count-badge') : null;
  if (badgeEl) {
    badgeEl.textContent = count;
  }
}

function moveTaskDOM(srcCat, srcIdx, targetCat, insertIdx) {
  const srcList = document.getElementById(`list-${srcCat}`);
  const targetList = document.getElementById(`list-${targetCat}`);
  if (!srcList || !targetList) return false;
  
  const srcItems = Array.from(srcList.querySelectorAll(':scope > div.group'));
  const targetItems = Array.from(targetList.querySelectorAll(':scope > div.group'));
  
  const draggedEl = srcItems[srcIdx];
  if (!draggedEl) return false;
  
  draggedEl.classList.remove('dragging', 'drag-insert-top', 'drag-insert-bottom');
  
  const addBtn = targetList.querySelector('button.group\\/addbtn, input');
  if (srcCat === targetCat) {
    if (insertIdx >= targetItems.length - 1) {
      if (addBtn) targetList.insertBefore(draggedEl, addBtn);
      else targetList.appendChild(draggedEl);
    } else {
      const refEl = targetItems[insertIdx];
      if (refEl && refEl !== draggedEl) {
        targetList.insertBefore(draggedEl, (srcIdx < insertIdx) ? refEl.nextSibling : refEl);
      }
    }
  } else {
    if (insertIdx >= targetItems.length) {
      if (addBtn) targetList.insertBefore(draggedEl, addBtn);
      else targetList.appendChild(draggedEl);
    } else {
      const refEl = targetItems[insertIdx];
      if (refEl) {
        targetList.insertBefore(draggedEl, refEl);
      } else {
        if (addBtn) targetList.insertBefore(draggedEl, addBtn);
        else targetList.appendChild(draggedEl);
      }
    }
  }
  
  rebindListDragHandlers(srcCat);
  if (srcCat !== targetCat) rebindListDragHandlers(targetCat);
  return true;
}

function handleItemDrop(e, targetCategory, targetIndex) {
  e.preventDefault();
  e.stopPropagation();
  
  const target = e.currentTarget;
  let isTopHalf = true;
  if (target && target.getBoundingClientRect) {
    const rect = target.getBoundingClientRect();
    isTopHalf = (e.clientY - rect.top) < (rect.height / 2);
  }
  
  cleanupDragIndicators();
  
  let data = draggedItemInfo;
  try { if (!data) data = JSON.parse(e.dataTransfer.getData('text/plain')); } catch (err) { /* Non-JSON drag data is expected for custom column drags */ }
  if (!data || data.category === undefined || data.index === undefined) return;
  const { category: srcCat, index: srcIdx } = data;
  if (srcCat === 'done' || targetCategory === 'done') return;
  const curItems = getCurrentWorkspaceItems();
  if (!curItems[srcCat] || !curItems[targetCategory]) return;
  
  let insertIdx = isTopHalf ? targetIndex : targetIndex + 1;
  saveHistory();
  const [item] = curItems[srcCat].splice(srcIdx, 1);
  if (srcCat === targetCategory && srcIdx < insertIdx) {
    insertIdx--;
  }
  if (insertIdx < 0) insertIdx = 0;
  if (insertIdx > curItems[targetCategory].length) insertIdx = curItems[targetCategory].length;
  
  curItems[targetCategory].splice(insertIdx, 0, item);
  draggedItemInfo = null;
  saveState();
  
  const moved = moveTaskDOM(srcCat, srcIdx, targetCategory, insertIdx);
  if (!moved) renderApp();
  populateHelperTaskSelect();
}

function handleDrop(e, targetCategory) {
  e.preventDefault();
  cleanupDragIndicators();
  let data = draggedItemInfo;
  try { if (!data) data = JSON.parse(e.dataTransfer.getData('text/plain')); } catch (err) { /* Non-JSON drag data is expected for custom column drags */ }
  if (!data || data.category === undefined || data.index === undefined) return;
  const { category: srcCat, index: srcIdx } = data;
  if (srcCat === 'done' || targetCategory === 'done') return;
  const curItems = getCurrentWorkspaceItems();
  if (!curItems[srcCat] || !curItems[targetCategory]) return;
  
  const insertIdx = curItems[targetCategory].length;
  saveHistory();
  const [item] = curItems[srcCat].splice(srcIdx, 1);
  curItems[targetCategory].push(item);
  draggedItemInfo = null;
  saveState();
  
  const moved = moveTaskDOM(srcCat, srcIdx, targetCategory, insertIdx);
  if (!moved) renderApp();
  populateHelperTaskSelect();
}

if (typeof window !== 'undefined' && typeof window.currentlyOpenPanel === 'undefined') window.currentlyOpenPanel = null;
var currentlyOpenPanel = (typeof window !== 'undefined' && window.currentlyOpenPanel) ? window.currentlyOpenPanel : null;
var pinnedPanel = (typeof window !== 'undefined' && window.pinnedPanel) ? window.pinnedPanel : null;
let hoverPanelShowTimeout = null;
let hoverPanelHideTimeout = null;

function showPanelHover(panelName, delay = 160) {
  if (hoverPanelHideTimeout) {
    clearTimeout(hoverPanelHideTimeout);
    hoverPanelHideTimeout = null;
  }
  if (hoverPanelShowTimeout) {
    clearTimeout(hoverPanelShowTimeout);
    hoverPanelShowTimeout = null;
  }

  // Header-Tools Popover beim Logo sofort ohne Verzögerung anzeigen
  if (panelName === 'header-tools') {
    delay = 0;
  }

  const TOOL_SUBPANELS = ['shopping', 'cooking', 'radio', 'news', 'audio', 'alarm', 'daily', 'impulse', 'inspiration'];
  // Wenn ein anderes Panel fest angeklickt (gepinnt) ist, nicht durch reines Drüberfahren schließen
  if (pinnedPanel && pinnedPanel !== panelName) {
    if (!(pinnedPanel === 'header-tools' && TOOL_SUBPANELS.includes(panelName))) {
      return;
    }
  }

  const el = document.getElementById(`panel-${panelName}`);
  if (!el) return;

  if (!el.classList.contains('hidden')) {
    currentlyOpenPanel = panelName;
    if (typeof window !== 'undefined') window.currentlyOpenPanel = panelName;
    return;
  }

  hoverPanelShowTimeout = setTimeout(() => {
    // Nochmals prüfen ob zwischenzeitlich gepinnt wurde
    if (pinnedPanel && pinnedPanel !== panelName) {
      if (!(pinnedPanel === 'header-tools' && TOOL_SUBPANELS.includes(panelName))) {
        return;
      }
    }

    const ALL_POPOVER_PANELS = [
      'header-tools', 'feedback', 'report', 'settings', 'settings-dropdown', 'soundscape', 'language',
      'boost', 'music', 'theme', 'calendar-dropdown', 'inspiration', 'impulse',
      'shopping', 'cooking', 'alarm', 'weather', 'news', 'radio', 'pause-dropdown', 'timer-presets',
      'audio', 'daily', 'logo-guide', 'collab-chat', 'radio-news'
    ];
    const isSubpanelOfTools = TOOL_SUBPANELS.includes(panelName);

    ALL_POPOVER_PANELS.forEach(p => {
      // Wenn wir ein Tool-Untermenü öffnen, darf das übergeordnete Tools-Menü nicht geschlossen werden!
      if (isSubpanelOfTools && p === 'header-tools') return;
      if (p !== panelName && p !== pinnedPanel) {
        // Falls wir im Header-Tools Hub sind, nur andere Tool-Flyouts schließen, nicht aber fremde Panels
        const other = document.getElementById(`panel-${p}`);
        if (other) other.classList.add('hidden');
      }
    });

    el.classList.remove('hidden');
    currentlyOpenPanel = panelName;
    if (typeof window !== 'undefined') window.currentlyOpenPanel = panelName;

    const dockContainer = document.querySelector('.desktop-tools-sidebar, .mac-dock-container');
    if (dockContainer && ['audio', 'daily', 'alarm', 'radio-news', 'shopping', 'cooking', 'radio', 'news'].includes(panelName)) {
      dockContainer.classList.add('is-active');
    }

    if (panelName === 'report' && typeof updateReportPanel === 'function') updateReportPanel();
    if (panelName === 'weather' && typeof fetchLocalWeather === 'function') fetchLocalWeather();
    if (panelName === 'shopping' && typeof renderShoppingList === 'function') renderShoppingList();
    if (panelName === 'cooking' && typeof renderCookingPanel === 'function') renderCookingPanel(true);
    if (panelName === 'news') {
      if (typeof RadioNewsEngine !== 'undefined' && typeof RadioNewsEngine.initNewsPanel === 'function') {
        RadioNewsEngine.initNewsPanel();
      } else if (typeof renderNewsBriefing === 'function') {
        renderNewsBriefing();
      }
    }
    if (panelName === 'radio' && typeof RadioNewsEngine !== 'undefined' && typeof RadioNewsEngine.initRadioPanel === 'function') {
      RadioNewsEngine.initRadioPanel();
    }
    if (panelName === 'radio-news' && typeof RadioNewsEngine !== 'undefined' && typeof RadioNewsEngine.initPanel === 'function') {
      RadioNewsEngine.initPanel();
    }
    if (panelName === 'alarm' && typeof renderAlarmPanel === 'function') renderAlarmPanel();
    if (panelName === 'daily') {
      if (typeof renderCookingPanel === 'function') renderCookingPanel(true);
      if (typeof renderShoppingList === 'function') renderShoppingList();
      if (typeof switchDailyTab === 'function') switchDailyTab('shopping');
    }
    if (panelName === 'audio') {
      const savedTab = (typeof window !== 'undefined' && window._lastActiveAudioTab) ? window._lastActiveAudioTab : 'ambient';
      if (typeof switchAudioTab === 'function') switchAudioTab(savedTab);
    }
    if (panelName === 'impulse') {
      if (typeof suggestBoostActivity === 'function') suggestBoostActivity();
      if (typeof suggestInspirationQuote === 'function') suggestInspirationQuote();
    }
    if (typeof renderLucideIcons === 'function') renderLucideIcons();
  }, delay);
}
window.showPanelHover = showPanelHover;

function hidePanelHover(panelName, gracePeriod = 900) {
  if (hoverPanelShowTimeout) {
    clearTimeout(hoverPanelShowTimeout);
    hoverPanelShowTimeout = null;
  }
  if (hoverPanelHideTimeout) {
    clearTimeout(hoverPanelHideTimeout);
  }

  // Wenn Panel per Klick fixiert (pinned) ist, niemals durch Mausbewegung schließen!
  if (panelName && (pinnedPanel === panelName || (typeof window !== 'undefined' && window.pinnedPanel === panelName))) {
    return;
  }
  if (!panelName && pinnedPanel) {
    return;
  }

  hoverPanelHideTimeout = setTimeout(() => {
    // Nach Ablauf der Karenzzeit nochmals prüfen
    if (panelName && (pinnedPanel === panelName || (typeof window !== 'undefined' && window.pinnedPanel === panelName))) {
      return;
    }
    if (!panelName && pinnedPanel) {
      return;
    }

    if (panelName === 'header-tools') {
      const toolsPanel = document.getElementById('panel-header-tools');
      if (toolsPanel) {
        const isHovered = toolsPanel.matches(':hover');
        const isWrapperHovered = document.getElementById('header-tools-wrapper')?.matches(':hover');
        const openSubpanelHovered = document.querySelector('#panel-header-tools .dock-popover-panel:not(.hidden):hover');
        if (isHovered || isWrapperHovered || openSubpanelHovered) {
          return;
        }
        toolsPanel.classList.add('hidden');
        document.querySelectorAll('#panel-header-tools .dock-popover-panel').forEach(p => p.classList.add('hidden'));
        if (currentlyOpenPanel === 'header-tools' || ['shopping', 'cooking', 'radio', 'news', 'audio', 'alarm'].includes(currentlyOpenPanel)) {
          currentlyOpenPanel = null;
          if (typeof window !== 'undefined') window.currentlyOpenPanel = null;
        }
      }
      return;
    }

    if (panelName) {
      const el = document.getElementById(`panel-${panelName}`);
      if (el) {
        if (el.matches(':hover')) return;
        const toolsPanel = document.getElementById('panel-header-tools');
        if (['shopping', 'cooking', 'radio', 'news', 'audio', 'alarm'].includes(panelName)) {
          if (el.matches(':hover') || (toolsPanel && toolsPanel.matches(':hover'))) {
            return;
          }
        }
        el.classList.add('hidden');
        if (currentlyOpenPanel === panelName) {
          currentlyOpenPanel = null;
          if (typeof window !== 'undefined') window.currentlyOpenPanel = null;
        }
      }
    } else if (currentlyOpenPanel && currentlyOpenPanel !== pinnedPanel) {
      const el = document.getElementById(`panel-${currentlyOpenPanel}`);
      if (el) {
        if (el.matches(':hover')) return;
        el.classList.add('hidden');
      }
      currentlyOpenPanel = null;
      if (typeof window !== 'undefined') window.currentlyOpenPanel = null;
    }
    
    // Check if any dock panel remains open
    const openDockPanel = document.querySelector('.dock-popover-panel:not(.hidden)');
    if (!openDockPanel) {
      const dockContainer = document.querySelector('.desktop-tools-sidebar, .mac-dock-container');
      if (dockContainer) dockContainer.classList.remove('is-active');
    }
  }, gracePeriod);
}
window.hidePanelHover = hidePanelHover;

// Globaler zuverlässiger Click-Away Listener für alle Popups/Panels
document.addEventListener('pointerdown', (e) => {
  // 1. Wenn der Klick innerhalb des Tools-Hubs oder seines Wrappers ist: niemals schließen!
  const toolsPanel = document.getElementById('panel-header-tools');
  const toolsWrapper = document.getElementById('header-tools-wrapper');
  if (toolsPanel && toolsPanel.contains(e.target)) return;
  if (toolsWrapper && toolsWrapper.contains(e.target)) return;

  const activeName = pinnedPanel || currentlyOpenPanel;
  if (!activeName) return;

  const openPanelEl = document.getElementById(`panel-${activeName}`);
  if (!openPanelEl || openPanelEl.classList.contains('hidden')) return;

  // Wenn der Klick innerhalb des Panels war: offen lassen!
  if (openPanelEl.contains(e.target)) return;

  // Wenn der Trigger-Button geklickt wurde: togglePanel übernimmt die Umschaltung
  const clickedTrigger = e.target.closest(`[onclick*="togglePanel('${activeName}')"]`) ||
                         e.target.closest(`[onclick*="togglePanel(\"${activeName}\")"]`) ||
                         e.target.closest(`[onclick*="showPanelHover('${activeName}')"]`) ||
                         e.target.closest(`[onclick*="showPanelHover(\"${activeName}\")"]`) ||
                         e.target.closest(`[onclick*="handleSoundsMainClick"]`) ||
                         e.target.closest(`[onclick*="handleMusicMainClick"]`);
  if (clickedTrigger) return;

  // Andernfalls: Panel stabil schließen & Pin aufheben
  openPanelEl.classList.add('hidden');
  currentlyOpenPanel = null;
  pinnedPanel = null;
  if (typeof window !== 'undefined') {
    window.currentlyOpenPanel = null;
    window.pinnedPanel = null;
  }
  const dockContainer = document.querySelector('.desktop-tools-sidebar, .mac-dock-container');
  if (dockContainer) dockContainer.classList.remove('is-active');
});

let currentImportTargetCat = 'todo';

function openTextImportModal(cat, event) {
  if (event) event.stopPropagation();
  currentImportTargetCat = cat || 'todo';
  const modal = document.getElementById('text-import-modal');
  const catLabel = document.getElementById('text-import-cat-label');
  const textarea = document.getElementById('text-import-textarea');
  if (catLabel) catLabel.innerText = t(currentImportTargetCat);
  if (textarea) textarea.value = '';
  updateTextImportPreview();
  if (modal) modal.classList.remove('hidden');
  if (textarea) setTimeout(() => textarea.focus(), 50);
}

function closeTextImportModal() {
  const modal = document.getElementById('text-import-modal');
  if (modal) modal.classList.add('hidden');
}

function handleTextFileSelected(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result || '';
    const textarea = document.getElementById('text-import-textarea');
    if (textarea) {
      textarea.value = content;
      updateTextImportPreview();
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function updateTextImportPreview() {
  const textarea = document.getElementById('text-import-textarea');
  const countBadge = document.getElementById('text-import-count-badge');
  const text = textarea ? textarea.value : '';
  const items = parseTextIntoItems(text);
  if (countBadge) {
    countBadge.innerText = `${items.length} ${items.length === 1 ? 'Eintrag' : 'Einträge'}`;
  }
}

function parseTextIntoItems(rawText) {
  if (!rawText) return [];
  const trimmed = rawText.trim();

  // 1. JSON-Unterstützung (Array von Strings oder Aufgaben-Objekten)
  if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
    try {
      const parsed = JSON.parse(trimmed);
      const arr = Array.isArray(parsed) ? parsed : (parsed.tasks || parsed.items || parsed.todos || [parsed]);
      const extracted = [];
      arr.forEach(item => {
        if (typeof item === 'string' && item.trim()) {
          extracted.push(item.trim());
        } else if (item && typeof item === 'object') {
          const val = item.task || item.title || item.name || item.text || item.content;
          if (val && typeof val === 'string' && val.trim()) {
            extracted.push(val.trim());
          }
        }
      });
      if (extracted.length > 0) return extracted;
    } catch (e) {
      console.warn('[Tasks] parseImportedText JSON attempt failed, falling back to line parser:', e);
    }
  }

  // 2. Zeilenbasierte Analyse (TXT, Markdown, CSV, TSV)
  const lines = rawText.split(/\r?\n/);
  const items = [];
  lines.forEach(line => {
    let clean = line.trim();
    if (!clean) return;

    // Markdown Checkboxen & Aufzählungszeichen (- [ ], - [x], *, +, #, 1.)
    clean = clean.replace(/^\[[ xX]\]\s*/, '');
    clean = clean.replace(/^[-*•+#>]\s*(\[[ xX]\]\s*)?/, '');
    clean = clean.replace(/^\d+[\.\)]\s*/, '');
    clean = clean.replace(/^["'`]|["'`]$/g, '').trim();

    if (clean.length > 0) {
      items.push(clean);
    }
  });
  return items;
}

function parseIcsCalendar(icsText) {
  if (!icsText || !icsText.includes('BEGIN:VCALENDAR')) return null;
  const events = [];
  const veventBlocks = icsText.split('BEGIN:VEVENT');

  for (let i = 1; i < veventBlocks.length; i++) {
    const block = veventBlocks[i].split('END:VEVENT')[0];
    if (!block) continue;

    let summary = '';
    let dtStart = '';
    let location = '';

    const lines = block.split(/\r?\n/);
    lines.forEach(line => {
      if (line.startsWith('SUMMARY:')) {
        summary = line.substring(8).trim();
      } else if (line.startsWith('SUMMARY;')) {
        summary = line.split(':').slice(1).join(':').trim();
      } else if (line.startsWith('DTSTART:') || line.startsWith('DTSTART;')) {
        dtStart = line.split(':').slice(1).join(':').trim();
      } else if (line.startsWith('LOCATION:')) {
        location = line.substring(9).trim();
      }
    });

    if (summary) {
      let eventDate = '';
      let eventTime = '';
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
        name: summary + (location ? ` (${location})` : ''),
        date: eventDate || new Date().toISOString().split('T')[0],
        time: eventTime || '09:00'
      });
    }
  }
  return events.length > 0 ? events : null;
}
window.parseTextIntoItems = parseTextIntoItems;
window.parseIcsCalendar = parseIcsCalendar;

function executeTextImport() {
  const textarea = document.getElementById('text-import-textarea');
  const text = textarea ? textarea.value : '';
  
  // 1. .ics Kalenderdatei-Erkennung
  if (text.includes('BEGIN:VCALENDAR') || currentImportTargetCat === 'termine') {
    const icsEvents = parseIcsCalendar(text);
    if (icsEvents && icsEvents.length > 0) {
      saveHistory();
      const currentItems = getCurrentWorkspaceItems();
      if (!currentItems.termine) currentItems.termine = [];
      icsEvents.forEach(ev => currentItems.termine.push(ev));
      // Chronologische Sortierung
      currentItems.termine.sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.time || '').localeCompare(b.time || ''));
      saveState();
      closeTextImportModal();
      renderApp();
      showToast(tr({
        de: `📅 ${icsEvents.length} Termine aus Kalenderdatei (.ics) importiert!`,
        en: `📅 ${icsEvents.length} appointments imported from calendar file (.ics)!`,
        es: `📅 ¡${icsEvents.length} citas importadas de archivo de calendario (.ics)!`,
        el: `📅 ${icsEvents.length} ραντεβού εισήχθησαν από αρχείο ημερολογίου (.ics)!`,
        fr: `📅 ${icsEvents.length} rendez-vous importés depuis le calendrier (.ics) !`,
        it: `📅 ${icsEvents.length} appuntamenti importati dal file calendario (.ics)!`
      }));
      return;
    }
  }

  const items = parseTextIntoItems(text);
  if (items.length === 0) {
    showToast(tr({
      de: 'Bitte Text eingeben oder Datei auswählen!',
      en: 'Please enter text or select a file!',
      es: '¡Introduce texto o selecciona un archivo!',
      el: 'Εισάγετε κείμενο ή επιλέξτε αρχείο!',
      fr: 'Veuillez saisir du texte ou choisir un fichier !',
      it: 'Inserisci testo o seleziona un file!'
    }));
    return;
  }
  
  saveHistory();
  const currentItems = getCurrentWorkspaceItems();
  if (!currentItems[currentImportTargetCat]) {
    currentItems[currentImportTargetCat] = [];
  }
  
  items.forEach(item => {
    currentItems[currentImportTargetCat].push(item);
  });
  
  saveState();
  closeTextImportModal();
  renderApp();
  populateHelperTaskSelect();
  
  showToast(tr({
    de: `✅ ${items.length} Einträge in "${t(currentImportTargetCat)}" importiert!`,
    en: `✅ ${items.length} items imported into "${t(currentImportTargetCat)}"!`,
    es: `✅ ¡${items.length} elementos importados en "${t(currentImportTargetCat)}"!`,
    el: `✅ ${items.length} στοιχεία εισήχθησαν στο "${t(currentImportTargetCat)}"!`,
    fr: `✅ ${items.length} éléments importés dans "${t(currentImportTargetCat)}" !`,
    it: `✅ ${items.length} elementi importati in "${t(currentImportTargetCat)}"!`
  }));
}

function openNoteDetailModal(index, event) {
  if (event) event.stopPropagation();
  const notesList = state.items.notes || [];
  if (index < 0 || index >= notesList.length) return;
  const note = notesList[index];
  const noteText = typeof note === 'object' ? note.task : note;
  
  const modal = document.getElementById('note-detail-modal');
  const indexInput = document.getElementById('note-detail-index');
  const textarea = document.getElementById('note-detail-textarea');
  
  if (indexInput) indexInput.value = index;
  if (textarea) textarea.value = noteText || '';
  if (modal) modal.classList.remove('hidden');
  if (textarea) setTimeout(() => textarea.focus(), 50);
}

function closeNoteDetailModal() {
  const modal = document.getElementById('note-detail-modal');
  if (modal) modal.classList.add('hidden');
}

function saveNoteDetailModal() {
  const indexInput = document.getElementById('note-detail-index');
  const textarea = document.getElementById('note-detail-textarea');
  const index = parseInt(indexInput ? indexInput.value : '-1');
  const curItems = getCurrentWorkspaceItems();
  if (index >= 0 && curItems.notes && curItems.notes[index] !== undefined) {
    const val = textarea ? textarea.value.trim() : '';
    if (val) {
      saveHistory();
      curItems.notes[index] = val;
      saveState();
      renderApp();
      closeNoteDetailModal();
      showToast(tr({ de: 'Notiz gespeichert! 📝', en: 'Note saved! 📝' }));
    } else {
      deleteTask('notes', index);
      closeNoteDetailModal();
    }
  }
}

function convertCurrentNoteDetailToTask() {
  const indexInput = document.getElementById('note-detail-index');
  const index = parseInt(indexInput ? indexInput.value : '-1');
  if (index >= 0) {
    convertNoteToTask(index, 'todo');
    closeNoteDetailModal();
  }
}

function copyCurrentNoteDetailText() {
  const textarea = document.getElementById('note-detail-textarea');
  const val = textarea ? textarea.value : '';
  if (val) {
    navigator.clipboard?.writeText(val).then(() => {
      showToast(tr({ de: 'Notiz in Zwischenablage kopiert! 📋', en: 'Note copied to clipboard! 📋' }));
    }).catch(() => {});
  }
}

function deleteCurrentNoteDetail() {
  const indexInput = document.getElementById('note-detail-index');
  const index = parseInt(indexInput ? indexInput.value : '-1');
  if (index >= 0) {
    deleteTask('notes', index);
    closeNoteDetailModal();
  }
}

function copyTaskText(text, event) {
  if (event) event.stopPropagation();
  if (!text) return;
  navigator.clipboard?.writeText(text).then(() => {
    showToast(tr({
      de: 'Aufgabentext kopiert! 📋',
      en: 'Task text copied! 📋',
      es: '¡Texto de tarea copiado! 📋',
      el: 'Το κείμενο αντιγράφηκε! 📋',
      fr: 'Texte copié ! 📋',
      it: 'Testo copiato! 📋'
    }));
  }).catch(() => {});
}
window.copyTaskText = copyTaskText;

function copyTaskTextByIndex(cat, index, event) {
  if (event) event.stopPropagation();
  const curItems = getCurrentWorkspaceItems();
  const item = curItems[cat]?.[index];
  if (!item) return;
  const text = typeof item === 'object' ? item.task : item;
  copyTaskText(text, event);
}
window.copyTaskTextByIndex = copyTaskTextByIndex;

function startTaskTimerByIndex(cat, index, event) {
  if (event) event.stopPropagation();
  const curItems = getCurrentWorkspaceItems();
  const item = curItems[cat]?.[index];
  if (!item) return;
  const text = typeof item === 'object' ? item.task : item;
  if (typeof startTaskTimer === 'function') {
    startTaskTimer(text, event);
  }
}
window.startTaskTimerByIndex = startTaskTimerByIndex;

function editTaskInline(cat, index, event) {
  if (event) {
    event.stopPropagation();
  }
  
  const span = (event && event.currentTarget && event.currentTarget.hasAttribute('data-task-span'))
    ? event.currentTarget
    : document.querySelector(`[data-task-span="${cat}-${index}"]`);
  if (!span) return;
  
  if (span.isContentEditable) return;
  
  const itemDiv = span.closest('.group');
  if (itemDiv) itemDiv.draggable = false;
  
  const curItems = getCurrentWorkspaceItems();
  const rawTask = curItems[cat]?.[index];
  if (!rawTask) return;
  const originalText = typeof rawTask === 'object' ? rawTask.task : rawTask;
  
  // Clean plain text for editing
  span.textContent = originalText;
  span.contentEditable = 'true';
  span.style.outline = 'none';
  span.style.borderBottom = '1.5px solid var(--accent, #a855f7)';
  span.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
  span.style.borderRadius = '4px';
  span.focus();
  
  // Select all text in span immediately
  try {
    const range = document.createRange();
    range.selectNodeContents(span);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } catch (e) {}
  
  let isDoneEditing = false;
  
  function finishEdit(save) {
    if (isDoneEditing) return;
    isDoneEditing = true;
    
    span.contentEditable = 'false';
    span.style.outline = '';
    span.style.borderBottom = '';
    span.style.backgroundColor = '';
    span.style.borderRadius = '';
    if (itemDiv) itemDiv.draggable = true;
    
    const newText = span.textContent.trim();
    if (save && newText && newText !== originalText) {
      saveHistory();
      if (typeof curItems[cat][index] === 'object') {
        curItems[cat][index].task = newText;
        curItems[cat][index].updatedAt = new Date().toISOString();
      } else {
        curItems[cat][index] = (typeof ensureItemIdentity === 'function')
          ? ensureItemIdentity(newText, `task_${cat}`)
          : { task: newText };
      }
      saveState();

      const safeEscaped = escapeHtml(newText);
      span.innerHTML = safeEscaped.replace(/ &amp; /g, '&nbsp;&amp; ').replace(/ & /g, '&nbsp;& ');
      span.title = `${newText} (${tr({ de: 'Klicken zum Bearbeiten', en: 'Click to edit', fr: 'Cliquer pour modifier', it: 'Clicca per modificare', es: 'Clic para editar', el: 'Κλικ για επεξεργασία' })})`;
      if (typeof populateHelperTaskSelect === 'function') populateHelperTaskSelect();
      showToast(tr({
        de: 'Aufgabe aktualisiert ✏️',
        en: 'Task updated ✏️',
        fr: 'Tâche mise à jour ✏️',
        it: 'Attività aggiornata ✏️',
        es: 'Tarea actualizada ✏️',
        el: 'Η εργασία ενημερώθηκε ✏️'
      }));
    } else {
      const safeEscaped = escapeHtml(originalText);
      span.innerHTML = safeEscaped.replace(/ &amp; /g, '&nbsp;&amp; ').replace(/ & /g, '&nbsp;& ');
    }
    span.onkeydown = null;
    span.onblur = null;
  }
  
  span.onkeydown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishEdit(true);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      finishEdit(false);
    }
  };
  
  span.onblur = () => {
    finishEdit(true);
  };
}

function openSampleManagerModal() {
  const modal = document.getElementById('sample-manager-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  renderSampleManagerContent();
  if (typeof playProceduralSound === 'function') playProceduralSound(0);
}

function closeSampleManagerModal() {
  const modal = document.getElementById('sample-manager-modal');
  if (modal) modal.classList.add('hidden');
}

function renderSampleManagerContent() {
  const container = document.getElementById('sample-manager-content');
  if (!container) return;

  const defaults = DEFAULT_TASKS_BY_LANG[currentLang] || DEFAULT_TASKS_BY_LANG['en'] || DEFAULT_TASKS_BY_LANG['de'];
  const sections = [
    { id: 'daily', title: t('daily'), icon: 'sun', color: 'amber', items: defaults.daily || [] },
    { id: 'weekly', title: t('weekly'), icon: 'calendar-days', color: 'purple', items: defaults.weekly || [] },
    { id: 'occasionally', title: t('occasionally'), icon: 'calendar-range', color: 'blue', items: defaults.occasionally || [] }
  ];

  let html = '';
  sections.forEach(sec => {
    const currentTasksInCat = (state.items[sec.id] || []).map(t => typeof t === 'object' ? t.task : t);
    
    html += `
      <div class="p-3.5 bg-white/[0.02] border border-white/10 rounded-2xl space-y-2">
        <div class="flex items-center gap-2 font-bold text-xs text-${sec.color}-300 pb-1 border-b border-white/5">
          <i data-lucide="${sec.icon}" class="w-4 h-4 text-${sec.color}-400"></i>
          <span>${sec.title}</span>
          <span class="text-[10px] text-gray-500 font-normal">(${sec.items.length} ${tr({ en: 'samples', de: 'Beispiele', fr: 'exemples', it: 'esempi', es: 'ejemplos', el: 'δείγματα' })})</span>
        </div>
        <div class="space-y-1.5 pt-1">
    `;

    sec.items.forEach((itemText, idx) => {
      // Wenn das Board noch aktiv Items hat, prüfen ob dieses drin ist, sonst standardmäßig checked
      const isChecked = currentTasksInCat.length === 0 || currentTasksInCat.includes(itemText);
      const safeEscaped = itemText.replace(/"/g, '&quot;');
      html += `
        <label class="flex items-center gap-2.5 p-2 bg-black/40 hover:bg-white/[0.04] border border-white/5 hover:border-purple-500/30 rounded-xl transition cursor-pointer text-xs group">
          <input type="checkbox" data-sample-cat="${sec.id}" data-sample-text="${safeEscaped}" ${isChecked ? 'checked' : ''} onchange="updateSampleSelectedCount()" class="w-4 h-4 rounded text-purple-600 bg-black/60 border-white/20 focus:ring-0 cursor-pointer accent-purple-500" />
          <span class="text-gray-200 group-hover:text-white flex-1 font-medium select-none">${itemText}</span>
        </label>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  if (typeof lucide !== 'undefined') lucide.createIcons();
  updateSampleSelectedCount();
}

function toggleAllSampleCheckboxes(checkedState) {
  const container = document.getElementById('sample-manager-content');
  if (!container) return;
  const checkboxes = container.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = checkedState);
  updateSampleSelectedCount();
}

function updateSampleSelectedCount() {
  const container = document.getElementById('sample-manager-content');
  const countEl = document.getElementById('sample-selected-counter');
  if (!container || !countEl) return;
  const total = container.querySelectorAll('input[type="checkbox"]').length;
  const checked = container.querySelectorAll('input[type="checkbox"]:checked').length;
  countEl.innerText = `${checked} / ${total} ${tr({ en: 'selected', de: 'ausgewählt', fr: 'sélectionné(s)', it: 'selezionati', es: 'seleccionados', el: 'επιλεγμένα' })}`;
}

function applySampleManagerSelection() {
  const container = document.getElementById('sample-manager-content');
  if (!container) return;
  
  saveHistory();
  const checkboxes = container.querySelectorAll('input[type="checkbox"]');
  
  // Zuerst Kategorien für die Übernahme leeren
  state.items.daily = [];
  state.items.weekly = [];
  state.items.occasionally = [];

  checkboxes.forEach(cb => {
    if (cb.checked) {
      const cat = cb.dataset.sampleCat;
      const text = cb.dataset.sampleText;
      if (cat && text && Array.isArray(state.items[cat])) {
        state.items[cat].push(text);
      }
    }
  });

  state.sampleBannerDismissed = true;
  saveState();
  closeSampleManagerModal();
  renderApp();
  populateHelperTaskSelect();
  if (typeof triggerCelebration === 'function') triggerCelebration();

  showToast(tr({
    de: 'Auswahl erfolgreich ins Board übernommen! ✨',
    en: 'Selection successfully applied to board! ✨',
    fr: 'Sélection appliquée avec succès au tableau ! ✨',
    it: 'Selezione applicata con successo alla bacheca! ✨',
    es: '¡Selección aplicada con éxito al tablero! ✨',
    el: 'Η επιλογή εφαρμόστηκε με επιτυχία στον πίνακα! ✨'
  }));
}

let dragDemoTimer = null;
function triggerDragDemonstration() {
  try {
    if (typeof document === 'undefined') return;
    if (draggedItemInfo || window.isEditingTaskInline || (typeof state !== 'undefined' && state && state.timerRunning)) return;
    if (document.hidden) return;

    const articles = Array.from(document.querySelectorAll('main article')).filter(a => !a.classList.contains('hidden'));
    if (!articles.length) return;

    const mode = Math.floor(Math.random() * 3); // 0: vertical, 1: horizontal, 2: column

    if (mode === 0) {
      const tasks = Array.from(document.querySelectorAll('main article div[draggable="true"]'));
      if (!tasks.length) return;
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
      randomTask.classList.add('demo-anim-vertical');
      setTimeout(() => randomTask.classList.remove('demo-anim-vertical'), 1500);
    } else if (mode === 1) {
      const tasks = Array.from(document.querySelectorAll('main article div[draggable="true"]'));
      if (!tasks.length) return;
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
      randomTask.classList.add('demo-anim-horizontal');
      setTimeout(() => randomTask.classList.remove('demo-anim-horizontal'), 1600);
    } else {
      const randomCol = articles[Math.floor(Math.random() * articles.length)];
      randomCol.classList.add('demo-anim-column');
      setTimeout(() => randomCol.classList.remove('demo-anim-column'), 1700);
    }
  } catch (err) {}
}

function initDragDemonstrationEngine() {
  if (typeof window === 'undefined') return;
  if (dragDemoTimer) clearInterval(dragDemoTimer);
  setTimeout(triggerDragDemonstration, 5000);
  dragDemoTimer = setInterval(triggerDragDemonstration, 120000);
}

if (typeof document !== 'undefined') {
  const initTasksUI = () => {
    if (typeof renderApp === 'function') renderApp();
    initDragDemonstrationEngine();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTasksUI);
  } else {
    initTasksUI();
  }
}

if (typeof window !== 'undefined') {
  window.renderApp = renderApp;
  window.getCurrentWorkspaceItems = getCurrentWorkspaceItems;
  window.getCurrentWorkspaceDone = getCurrentWorkspaceDone;
  window.handleCompleteTask = handleCompleteTask;
  window.handleDragStart = handleDragStart;
  window.handleDragOver = handleDragOver;
  window.handleDragLeave = handleDragLeave;
  window.handleDragEnd = handleDragEnd;
  window.handleDrop = handleDrop;
  window.handleItemDrop = handleItemDrop;
  window.editTaskInline = editTaskInline;
  window.parseTextIntoItems = parseTextIntoItems;
  window.parseIcsCalendar = parseIcsCalendar;
  window.executeTextImport = executeTextImport;
  window.deleteTask = deleteTask;
  window.handleRestoreDoneTask = handleRestoreDoneTask;
  window.triggerDragDemonstration = triggerDragDemonstration;
}
if (typeof globalThis !== 'undefined') {
  globalThis.renderApp = renderApp;
  globalThis.getCurrentWorkspaceItems = getCurrentWorkspaceItems;
  globalThis.getCurrentWorkspaceDone = getCurrentWorkspaceDone;
  globalThis.handleCompleteTask = handleCompleteTask;
  globalThis.handleDragStart = handleDragStart;
  globalThis.handleDragOver = handleDragOver;
  globalThis.handleDragLeave = handleDragLeave;
  globalThis.handleDragEnd = handleDragEnd;
  globalThis.handleDrop = handleDrop;
  globalThis.handleItemDrop = handleItemDrop;
  globalThis.editTaskInline = editTaskInline;
  globalThis.parseTextIntoItems = parseTextIntoItems;
  globalThis.parseIcsCalendar = parseIcsCalendar;
  globalThis.executeTextImport = executeTextImport;
  globalThis.deleteTask = deleteTask;
  globalThis.handleRestoreDoneTask = handleRestoreDoneTask;
  globalThis.triggerDragDemonstration = triggerDragDemonstration;
}

let inlineEditingTaskInfo = null;

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
    current.color = color === 'none' ? undefined : color;
  } else {
    curItems[columnId][index] = { task: current, color: color === 'none' ? undefined : color };
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

function deleteColumn(colId, e) {
  if (e) e.stopPropagation();
  const isWork = state && state.activeWorkspace === 'work';
  const activeOrder = isWork ? (workCategoriesOrder || WORK_CATEGORIES_ORDER) : categoriesOrder;
  const idx = activeOrder.findIndex(([id]) => id === colId);
  if (idx === -1) return;
  const curItems = getCurrentWorkspaceItems();
  const taskCount = (curItems[colId] || []).length;
  
  const confirmMsg = (t('confirm_delete_column') || 'Möchtest du diese Spalte wirklich löschen?') + (taskCount > 0 ? ` (${taskCount} Aufgaben)` : '');
  if (confirm(confirmMsg)) {
    saveHistory();
    activeOrder.splice(idx, 1);
    delete curItems[colId];
    saveCategoriesOrder();
    saveState();
    renderApp();
    showToast(tr({ de: 'Spalte gelöscht 🗑️', en: 'Column deleted 🗑️', es: 'Columna eliminada 🗑️', el: 'Η στήλη διαγράφηκε 🗑️', fr: 'Colonne supprimée 🗑️', it: 'Colonna eliminata 🗑️' }));
  }
}

function getCurrentWorkspaceItems() {
  if (typeof state !== 'undefined' && state && state.activeWorkspace === 'work') {
    if (!state.workItems) state.workItems = createDefaultWorkItems(typeof currentLang !== 'undefined' ? currentLang : 'de');
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
  
  const currentItems = getCurrentWorkspaceItems();
  const doneList = getCurrentWorkspaceDone();
  const isWork = state.activeWorkspace === 'work';
  const activeOrder = isWork ? WORK_CATEGORIES_ORDER : categoriesOrder;

  activeOrder.forEach(([id, iconKey]) => {
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
    
    let countBadgeHTML = '';
    if (isDone) {
      countBadgeHTML = `<span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 text-gray-400 border border-white/10 shadow-xs">${doneList.length}</span>`;
    } else if (!isNotes) {
      const isComplete = totalInCat > 0 && doneInCat === totalInCat;
      const badgeBg = isComplete ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : (doneInCat > 0 ? 'bg-[var(--accent)]/15 text-[var(--accent-light)] border-[var(--accent)]/25' : 'bg-white/5 text-gray-400 border-white/10');
      countBadgeHTML = `<span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border shadow-xs ${badgeBg} transition-all duration-300">${doneInCat}/${totalInCat}</span>`;
    } else {
      const noteCount = (currentItems.notes || []).length;
      countBadgeHTML = `<span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 text-gray-400 border border-white/10 shadow-xs">${noteCount}</span>`;
    }

    const article = document.createElement('article');
    article.dataset.category = id;
    article.className = 'min-h-[380px] h-full flex flex-col p-3 rounded-2xl border border-white/[0.08] bg-[#13131a]/75 backdrop-blur-md shadow-lg hover:border-[var(--accent)]/30 transition duration-300 cursor-default column-card-breathing';

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

    let columnIconHTML = '';
    if (hasDice) {
      columnIconHTML = `
        <span onclick="rollTaskDice('${id}', event)" class="text-[15.5px] leading-none cursor-pointer hover:scale-125 active:scale-90 transition-transform duration-200 shrink-0 select-none inline-flex items-center justify-center" title="${tr({ de: 'Aufgabe auswürfeln 🎲', en: 'Roll a task 🎲', es: 'Tirar dado para tarea 🎲', el: 'Ρίξε το ζάρι 🎲', fr: 'Tirer au sort 🎲', it: 'Lancia il dado 🎲' })}">
          🎲
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
            <button onclick="renameColumn('${id}', event)" class="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition cursor-pointer" title="${t('rename_column') || 'Umbenennen'}"><i data-lucide="edit-3" class="w-3 h-3"></i></button>
            <button onclick="deleteColumn('${id}', event)" class="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/15 rounded transition cursor-pointer" title="${t('delete_column') || 'Löschen'}"><i data-lucide="trash-2" class="w-3 h-3"></i></button>
          ` : ''}
        </div>
      </div>
      ${!isDone && !isNotes ? `
        <div class="w-full h-1.5 bg-white/[0.06] rounded-full mb-3 overflow-hidden pointer-events-none p-0.5">
          <div class="h-full rounded-full bg-gradient-to-r from-[var(--accent)] via-emerald-400 to-teal-300 transition-all duration-500 shadow-sm" style="width: ${pct}%"></div>
        </div>
      ` : ''}
      <div id="list-${id}" class="flex flex-col gap-2.5 flex-1 min-h-[120px] overflow-y-auto py-0.5 px-0.5"></div>
      ${(!isDone) ? `
        <div class="flex items-center justify-start pt-1 px-0.5 mt-auto">
          <button onclick="openTextImportModal('${id}', event)" class="p-1 rounded-md bg-transparent hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-500 hover:text-gray-200 opacity-40 hover:opacity-100 transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0" title="${isNotes ? tr({ de: 'Notizen importieren (.txt, .md, .csv, .json oder Zwischenablage)', en: 'Import notes (.txt, .md, .csv, .json or clipboard)', es: 'Importar notas (.txt, .md, .csv, .json o portapapeles)', el: 'Εισαγωγή σημειώσεων (.txt, .md, .csv, .json ή πρόχειρο)', fr: 'Importer des notes (.txt, .md, .csv, .json ou presse-papiers)', it: 'Importa note (.txt, .md, .csv, .json o appunti)' }) : (isTermine ? tr({ de: 'Termine aus Kalenderdatei (.ics) oder Text importieren', en: 'Import appointments from calendar file (.ics) or text', es: 'Importar citas desde archivo (.ics) o texto', el: 'Εισαγωγή ραντεβού από ημερολόγιο (.ics) ή κείμενο', fr: 'Importer des rendez-vous depuis un fichier (.ics) ou texte', it: 'Importa appuntamenti da file (.ics) o testo' }) : tr({ de: 'Aufgaben importieren (.txt, .md, .csv, .json oder Zwischenablage)', en: 'Import tasks (.txt, .md, .csv, .json or clipboard)', es: 'Importar tareas (.txt, .md, .csv, .json o portapapeles)', el: 'Εισαγωγή εργασιών (.txt, .md, .csv, .json ή πρόχειρο)', fr: 'Importer des tâches (.txt, .md, .csv, .json ou presse-papiers)', it: 'Importa attività (.txt, .md, .csv, .json o appunti)' }))}">
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
        itemDiv.className = 'group p-2 text-[11px] text-gray-400 hover:text-white border border-dashed border-slate-700 hover:border-purple-500 rounded-lg bg-slate-800/25 hover:bg-purple-950/20 cursor-pointer font-medium transition flex items-center justify-between gap-1';
        itemDiv.onclick = () => handleRestoreDoneTask(idx); itemDiv.title = "Zurück in den Plan verschieben";
        itemDiv.innerHTML = `<span class="truncate">${escapeHtml(item.task)} · ${escapeHtml(item.time)}</span><i data-lucide="undo" class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-purple-400 shrink-0"></i>`;
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
        itemDiv.ondrop = (e) => handleItemDrop(e, 'notes', index);
        itemDiv.className = `group relative w-full h-auto min-h-[44px] max-h-[85px] overflow-hidden flex items-center justify-between p-2.5 border-0 border-l-[3.5px] border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-gray-100 font-medium transition-all duration-200 ease-out rounded-xl shadow-sm cursor-pointer`;
        itemDiv.onclick = () => openNoteDetailModal(index);
        
        itemDiv.innerHTML = `
          <div class="flex items-center gap-2.5 flex-1 min-w-0 pr-2 pointer-events-none">
            <i data-lucide="sticky-note" class="w-4 h-4 text-amber-400 shrink-0"></i>
            <span class="text-xs text-amber-100 font-normal leading-snug line-clamp-2 break-words flex-1 select-text" title="${safeNoteEscaped}">${safeNoteEscaped}</span>
          </div>
          <div class="absolute right-1 -top-3 flex items-center gap-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 shrink-0 bg-[#13131a] border border-white/10 px-1 py-0.5 rounded-lg shadow-lg z-50 whitespace-nowrap" onclick="event.stopPropagation()">
            <button onclick="convertNoteToTask(${index}, 'todo', event)" class="p-1 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded transition cursor-pointer" title="${tr({ de: 'In To-Do umwandeln', en: 'Convert to To-Do', es: 'Convertir a To-Do', el: 'Μετατροπή σε To-Do', fr: 'Convertir en To-Do', it: 'Converti in To-Do' })}">
              <i data-lucide="arrow-right-circle" class="w-3.5 h-3.5"></i>
            </button>
            <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
            <button onclick="copyNoteText(${index}, event)" class="p-1 text-gray-300 hover:text-white hover:bg-white/10 rounded transition cursor-pointer" title="${tr({ de: 'Kopieren', en: 'Copy', es: 'Copiar', el: 'Αντιγραφή', fr: 'Copier', it: 'Copia' })}">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i>
            </button>
            <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
            <button onclick="openNoteDetailModal(${index}, event)" class="p-1 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded transition cursor-pointer" title="Bearbeiten">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            </button>
            <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
            <button onclick="deleteTask('notes', ${index}, event)" class="p-1 text-gray-500 hover:text-red-400 hover:bg-white/10 rounded transition cursor-pointer" title="Löschen">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        `;
        listEl.appendChild(itemDiv);
      });

      const addBtn = document.createElement('button');
      addBtn.onclick = () => { openTaskAddColumns['notes'] = true; renderApp(); };
      addBtn.className = 'w-full min-h-[38px] p-2 rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-center text-xs text-amber-300/80 hover:text-amber-200 font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm';
      addBtn.innerHTML = `<i data-lucide="plus" class="w-3.5 h-3.5 text-amber-400"></i><span>${tr({ de: 'Notiz hinzufügen', en: 'Add note', es: 'Añadir nota', el: 'Προσθήκη σημείωσης', fr: 'Ajouter une note', it: 'Aggiungi nota' })}</span>`;

      const addInput = document.createElement('textarea');
      addInput.rows = 2;
      addInput.placeholder = t('notesPlaceholder');
      addInput.className = 'w-full min-h-[50px] p-2 px-3 rounded-lg border border-amber-500/60 bg-[#0a0a0e] text-left text-xs placeholder:text-gray-500 focus:outline-none focus:border-amber-400 transition cursor-text font-medium text-amber-100 shadow-inner resize-none';
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
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
        if (e.key === 'Escape') { openTaskAddColumns['notes'] = false; renderApp(); }
      };
      if (openTaskAddColumns['notes']) {
        listEl.appendChild(addInput);
        setTimeout(() => addInput.focus(), 0);
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
        let locHTML = item.location ? `<span class="text-[9px] text-gray-400 truncate max-w-[100px] inline-flex items-center gap-0.5"><i data-lucide="map-pin" class="w-2.5 h-2.5 shrink-0 text-gray-500"></i>${escapeHtml(item.location)}</span>` : '';
        const itemDiv = document.createElement('div');
        itemDiv.className = `group relative w-full h-auto min-h-[44px] flex items-center justify-between p-2.5 border-0 border-l-[3.5px] ${isToday ? 'border-amber-400 bg-amber-500/10' : 'border-amber-500/40 bg-white/[0.035]'} hover:bg-white/[0.07] text-gray-200 font-medium transition-all duration-200 ease-out rounded-xl shadow-sm cursor-pointer`;
        itemDiv.onclick = () => editTermin(originalIndex);
        itemDiv.innerHTML = `
          <button onclick="handleCompleteTask('termine', ${originalIndex}, event)" class="flex items-center gap-2.5 flex-1 min-w-0 text-left bg-transparent border-0 text-inherit cursor-pointer p-0 pr-2 group/task" title="Termin als erledigt markieren">
            <i data-lucide="clock" class="w-4 h-4 text-amber-400 shrink-0 group-hover/task:text-emerald-400 transition-colors"></i>
            <div class="flex flex-col min-w-0 flex-1">
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="text-xs leading-snug font-semibold text-amber-100 truncate">${escapeHtml(item.task || item.name || 'Termin')}</span>
                ${item.time ? `<span class="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">${escapeHtml(item.time)}</span>` : ''}
              </div>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[9px] font-mono text-gray-400">${escapeHtml(fullDateString)}</span>
                ${locHTML}
              </div>
            </div>
          </button>
          <div class="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 shrink-0 bg-[#13131e]/95 border border-white/15 px-1.5 py-1 rounded-xl shadow-xl z-50 whitespace-nowrap backdrop-blur-md">
            <button onclick="editTermin(${originalIndex}, event)" class="p-1 text-amber-400 hover:text-amber-300 hover:bg-amber-500/15 rounded-lg transition cursor-pointer" title="${tr({ de: 'Bearbeiten', en: 'Edit', fr: 'Modifier', it: 'Modifica', es: 'Editar', el: 'Επεξεργασία' })}"><i data-lucide="edit-3" class="w-3.5 h-3.5"></i></button>
            <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
            <button onclick="deleteTask('termine', ${originalIndex}, event)" class="p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/15 rounded-lg transition cursor-pointer" title="Löschen"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
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
      (currentItems[id] || []).forEach((task, index) => {
        const taskObj = typeof task === 'object' ? task : { task: task };
        const taskText = taskObj.task;
        const taskColor = taskObj.color || 'none';
        const colorStyle = TASK_COLOR_MAP[taskColor] || TASK_COLOR_MAP.none;
        const iconDetails = getTaskIconDetails(taskText, id); const isTaskActive = activeTimerTask === taskText && timerRunning;
        const itemDiv = document.createElement('div'); itemDiv.draggable = true;
        itemDiv.ondragstart = (e) => handleDragStart(e, id, index); itemDiv.ondragover = (e) => handleDragOver(e);
        itemDiv.ondrop = (e) => handleItemDrop(e, id, index);
        const randomVal = Math.random(); let subtleAnimClass = "";
        if (randomVal < 0.1) subtleAnimClass = "task-anim-float";
        else if (randomVal < 0.2) subtleAnimClass = "task-anim-shift";
        else if (randomVal < 0.3) subtleAnimClass = "task-anim-pulse";

        const borderBgClass = isTaskActive 
          ? 'border-amber-400 bg-amber-500/15 shadow-[0_0_18px_rgba(251,191,36,0.25)]' 
          : (taskColor !== 'none' ? `${colorStyle.border} ${colorStyle.bg} ${colorStyle.shadow}` : 'border-[var(--accent)] bg-white/[0.035] hover:bg-white/[0.07]');

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
            const inp = itemDiv.querySelector('#inline-edit-input');
            if (inp) { inp.focus(); inp.select(); }
          }, 20);
        } else {
          const recurrenceBadge = (typeof item === 'object' && item.recurrence && item.recurrence !== 'none')
            ? `<span class="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0 ml-1">🔁 ${t('recurrence_' + item.recurrence) || item.recurrence}</span>`
            : '';
          itemDiv.innerHTML = `
            <button onclick="handleCompleteTask('${id}', ${index}, event)" class="task-complete-btn flex items-center gap-2.5 flex-1 min-w-0 text-left bg-transparent border-0 text-inherit cursor-pointer p-0 transition duration-150 pr-2 group/task" title="Abhaken">
              <i data-lucide="${iconDetails.icon}" class="standard-task-icon w-4 h-4 ${isTaskActive ? 'text-amber-400 animate-pulse' : (taskColor !== 'none' ? colorStyle.iconColor : iconDetails.color)} shrink-0 transition-colors duration-150 ${pair.hoverIcon}"></i>
              <span ondblclick="editTaskInline('${id}', ${index}, event)" class="task-text-span block text-xs leading-snug min-w-0 flex-1 font-medium text-gray-200 truncate ${isTaskActive ? 'text-amber-200 font-bold' : (taskColor !== 'none' ? colorStyle.text : '')} ${pair.text} transition-colors duration-150" title="${safeTaskEscaped} (Doppelklick zum Bearbeiten)">${safeTaskEscaped}</span>
              ${recurrenceBadge}
            </button>
            <div class="absolute right-1.5 -top-3.5 flex items-center gap-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 shrink-0 bg-[#13131e]/95 border border-white/15 px-1.5 py-1 rounded-xl shadow-xl z-50 whitespace-nowrap backdrop-blur-md">
              <div class="relative group/color inline-flex items-center">
                <button onclick="event.stopPropagation()" class="p-1 text-pink-400 hover:text-pink-300 hover:bg-pink-500/15 rounded-lg transition cursor-pointer" title="${tr({ de: 'Farbe wählen 🎨', en: 'Card color 🎨', es: 'Elegir color 🎨', el: 'Επιλογή χρώματος 🎨', fr: 'Couleur 🎨', it: 'Colore 🎨' })}"><i data-lucide="palette" class="w-3.5 h-3.5"></i></button>
                <div class="hidden group-hover/color:flex absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 p-1 px-1.5 bg-[#161622] border border-white/20 rounded-xl shadow-2xl gap-1.5 z-50 items-center backdrop-blur-md">
                  <button onclick="setTaskColor('${id}', ${index}, 'none', event)" class="w-3.5 h-3.5 rounded-full border border-gray-400 bg-transparent hover:scale-125 transition cursor-pointer" title="Standard"></button>
                  <button onclick="setTaskColor('${id}', ${index}, 'rose', event)" class="w-3.5 h-3.5 rounded-full bg-rose-500 hover:scale-125 transition cursor-pointer shadow-sm" title="Rot"></button>
                  <button onclick="setTaskColor('${id}', ${index}, 'orange', event)" class="w-3.5 h-3.5 rounded-full bg-orange-500 hover:scale-125 transition cursor-pointer shadow-sm" title="Orange"></button>
                  <button onclick="setTaskColor('${id}', ${index}, 'amber', event)" class="w-3.5 h-3.5 rounded-full bg-amber-500 hover:scale-125 transition cursor-pointer shadow-sm" title="Gelb"></button>
                  <button onclick="setTaskColor('${id}', ${index}, 'emerald', event)" class="w-3.5 h-3.5 rounded-full bg-emerald-500 hover:scale-125 transition cursor-pointer shadow-sm" title="Grün"></button>
                  <button onclick="setTaskColor('${id}', ${index}, 'sky', event)" class="w-3.5 h-3.5 rounded-full bg-sky-500 hover:scale-125 transition cursor-pointer shadow-sm" title="Blau"></button>
                  <button onclick="setTaskColor('${id}', ${index}, 'purple', event)" class="w-3.5 h-3.5 rounded-full bg-purple-500 hover:scale-125 transition cursor-pointer shadow-sm" title="Lila"></button>
                </div>
              </div>
              <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
              <button onclick="editTaskInline('${id}', ${index}, event)" class="p-1 text-purple-400 hover:text-purple-300 hover:bg-purple-500/15 rounded-lg transition cursor-pointer" title="${tr({ de: 'Bearbeiten', en: 'Edit', fr: 'Modifier', it: 'Modifica', es: 'Editar', el: 'Επεξεργασία' })}"><i data-lucide="edit-3" class="w-3.5 h-3.5"></i></button>
              <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
              <button onclick="openTaskStepsModal('${id}', ${index}, event)" class="p-1 text-[var(--accent-light)] hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer" title="${tr({ de: 'In Teilschritte zerlegen', en: 'Break into subtasks', fr: 'Découper en étapes', it: 'Dividi in passaggi', es: 'Dividir en pasos', el: 'Ανάλυση σε βήματα' })}"><i data-lucide="footprints" class="w-3.5 h-3.5"></i></button>
              <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
              <button onclick="copyTaskTextByIndex('${id}', ${index}, event)" class="p-1 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer" title="${tr({ de: 'Text kopieren', en: 'Copy text', fr: 'Copier texte', it: 'Copia testo', es: 'Copiar testo', el: 'Αντιγραφή κειμένου' })}"><i data-lucide="copy" class="w-3.5 h-3.5"></i></button>
              <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
              <button onclick="startTaskTimerByIndex('${id}', ${index}, event)" class="p-1 text-amber-400 hover:text-amber-300 hover:bg-amber-500/15 rounded-lg transition cursor-pointer" title="Timer starten"><i data-lucide="timer" class="w-3.5 h-3.5"></i></button>
              <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
              <button onclick="deleteTask('${id}', ${index}, event)" class="p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/15 rounded-lg transition cursor-pointer" title="Löschen"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
            </div>
          `;
        }
        listEl.appendChild(itemDiv);
      });
      const addBtn = document.createElement('button'); addBtn.onclick = () => { openTaskAddColumns[id] = true; renderApp(); };
      addBtn.className = 'w-full min-h-[38px] p-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/25 text-center text-xs text-gray-400 hover:text-white font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm';
      addBtn.innerHTML = `<i data-lucide="plus" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i><span>${t('add')}</span>`;

      const addInput = document.createElement('input'); addInput.type = 'text';
      addInput.placeholder = t('add');
      addInput.className = 'w-full min-h-[38px] p-2 px-3 rounded-xl border border-[var(--accent)]/60 bg-[#0e0e16] text-left text-xs placeholder:text-gray-500 focus:outline-none focus:border-[var(--accent)] transition cursor-text font-semibold text-white shadow-inner';
      addInput.onkeydown = (e) => {
        if (e.key === 'Enter' && addInput.value.trim()) {
          saveHistory();
          const curItems = getCurrentWorkspaceItems();
          if (!curItems[id]) curItems[id] = [];
          curItems[id].push(addInput.value.trim());
          addInput.value = '';
          openTaskAddColumns[id] = false;
          saveState(); renderApp(); populateHelperTaskSelect();
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
        if (e.key === 'Escape') { openTaskAddColumns[id] = false; renderApp(); }
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
  updateShoppingListPopup(true); renderCookingPanel(true);
  renderLucideIcons();
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
    btn.classList.toggle('mobile-tab-active', btn.dataset.cat === id);
  });
  const main = document.querySelector('main');
  if (main) main.scrollIntoView({ behavior: 'instant', block: 'start' });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

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
  if (event) event.stopPropagation(); saveHistory();
  const curItems = getCurrentWorkspaceItems();
  const taskObj = curItems[category]?.[index]; const taskText = typeof taskObj === 'object' ? taskObj?.task : taskObj;
  if (curItems[category]) curItems[category].splice(index, 1);
  if (taskText && state.completedSteps) delete state.completedSteps[taskText];
  saveState(); showToast(t('toast_task_deleted'), { undo: true, duration: 5000 }); renderApp(); updateZenView(); populateHelperTaskSelect();
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
function handleDragStart(e, category, index) {
  draggedItemInfo = { category, index }; e.stopPropagation();
  e.dataTransfer.setData('text/plain', JSON.stringify({ category, index })); e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }

function handleItemDrop(e, targetCategory, targetIndex) {
  e.preventDefault(); e.stopPropagation(); let data = draggedItemInfo;
  try { if (!data) data = JSON.parse(e.dataTransfer.getData('text/plain')); } catch (err) { /* Non-JSON drag data is expected for custom column drags */ }
  if (!data || data.category === undefined || data.index === undefined) return;
  const { category: srcCat, index: srcIdx } = data;
  if (srcCat === 'done' || targetCategory === 'done') return;
  const curItems = getCurrentWorkspaceItems();
  if (!curItems[srcCat] || !curItems[targetCategory]) return;
  saveHistory(); const [item] = curItems[srcCat].splice(srcIdx, 1);
  curItems[targetCategory].splice(targetIndex, 0, item); draggedItemInfo = null; saveState(); renderApp(); populateHelperTaskSelect();
}

function handleDrop(e, targetCategory) {
  e.preventDefault();
  let data = draggedItemInfo;
  try { if (!data) data = JSON.parse(e.dataTransfer.getData('text/plain')); } catch (err) { /* Non-JSON drag data is expected for custom column drags */ }
  if (!data || data.category === undefined || data.index === undefined) return;
  const { category: srcCat, index: srcIdx } = data;
  if (srcCat === 'done' || targetCategory === 'done') return;
  const curItems = getCurrentWorkspaceItems();
  if (!curItems[srcCat] || !curItems[targetCategory]) return;
  saveHistory(); const [item] = curItems[srcCat].splice(srcIdx, 1);
  curItems[targetCategory].push(item); draggedItemInfo = null; saveState(); renderApp(); populateHelperTaskSelect();
}

let currentlyOpenPanel = null; let hoverPanelTimeout = null;

function showPanelHover(panelName) {
  // Deaktiviert: Panels öffnen stabil und sicher per Klick statt bei kleinster Mausbewegung nervös zu flackern
}

function hidePanelHover(panelName) {
  // Deaktiviert: Panels bleiben stabil offen, bis der Nutzer bewusst daneben klickt oder schließt
}

// Globaler zuverlässiger Click-Away Listener für alle Popups/Panels
document.addEventListener('pointerdown', (e) => {
  if (!currentlyOpenPanel) return;
  const openPanelEl = document.getElementById(`panel-${currentlyOpenPanel}`);
  if (!openPanelEl || openPanelEl.classList.contains('hidden')) return;

  // Wenn der Klick innerhalb des Panels war: offen lassen!
  if (openPanelEl.contains(e.target)) return;

  // Wenn der Trigger-Button geklickt wurde: togglePanel übernimmt die Umschaltung
  const clickedTrigger = e.target.closest(`[onclick*="togglePanel('${currentlyOpenPanel}')"]`) ||
                         e.target.closest(`[onclick*="togglePanel(\"${currentlyOpenPanel}\")"]`) ||
                         e.target.closest(`[onclick*="handleSoundsMainClick"]`) ||
                         e.target.closest(`[onclick*="handleMusicMainClick"]`);
  if (clickedTrigger) return;

  // Andernfalls: Panel stabil schließen
  openPanelEl.classList.add('hidden');
  currentlyOpenPanel = null;
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
  if (event) event.stopPropagation();
  inlineEditingTaskInfo = { cat, index };
  renderApp();
}

function saveInlineEdit(cat, index, event) {
  if (event) event.stopPropagation();
  const inputEl = document.getElementById('inline-edit-input');
  const newText = inputEl ? inputEl.value.trim() : '';
  const curItems = getCurrentWorkspaceItems();
  const currentTask = curItems[cat]?.[index];
  const currentText = typeof currentTask === 'object' ? currentTask.task : currentTask;
  
  if (newText && newText !== currentText) {
    saveHistory();
    if (typeof curItems[cat][index] === 'object') {
      curItems[cat][index].task = newText;
    } else {
      curItems[cat][index] = newText;
    }
    saveState();
    showToast(tr({
      de: 'Aufgabe aktualisiert ✏️',
      en: 'Task updated ✏️',
      fr: 'Tâche mise à jour ✏️',
      it: 'Attività aggiornata ✏️',
      es: 'Tarea actualizada ✏️',
      el: 'Η εργασία ενημερώθηκε ✏️'
    }));
  }
  inlineEditingTaskInfo = null;
  renderApp();
  populateHelperTaskSelect();
}

function cancelInlineEdit(event) {
  if (event) event.stopPropagation();
  inlineEditingTaskInfo = null;
  renderApp();
}

// -------------------------------------------------------------
// SAMPLE TASKS BANNER & SELECTION MANAGER
// -------------------------------------------------------------
let sampleBannerHoverTimer = null;

function showSampleBannerOnHover(show) {
  const banner = document.getElementById('sample-tasks-banner');
  if (!banner) return;
  clearTimeout(sampleBannerHoverTimer);
  if (show) {
    banner.classList.add('sample-banner-visible');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  } else {
    sampleBannerHoverTimer = setTimeout(() => {
      banner.classList.remove('sample-banner-visible');
    }, 280);
  }
}

function checkSampleBannerVisibility() {
  const banner = document.getElementById('sample-tasks-banner');
  if (!banner) return;
  banner.classList.remove('sample-banner-visible');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function dismissSampleBanner(showConfirmationToast = true) {
  state.sampleBannerDismissed = true;
  saveState();
  const banner = document.getElementById('sample-tasks-banner');
  if (banner) banner.classList.remove('sample-banner-visible');
  if (showConfirmationToast) {
    showToast(tr({
      de: 'Beispiel-Aufgaben übernommen! ✨',
      en: 'Sample tasks kept! ✨',
      fr: 'Tâches d\'exemple conservées ! ✨',
      it: 'Attività di esempio mantenute! ✨',
      es: '¡Tareas de ejemplo conservadas! ✨',
      el: 'Οι παραδειγματικές εργασίες διατηρήθηκαν! ✨'
    }));
  }
}

function clearAllSampleTasks() {
  const confirmMsg = tr({
    de: 'Möchtest du wirklich alle Beispiel-Aufgaben entfernen und mit einem leeren Board starten?',
    en: 'Do you really want to clear all sample tasks and start with an empty board?',
    fr: 'Veux-tu vraiment effacer toutes les tâches d\'exemple et partir d\'un tableau vide ?',
    it: 'Vuoi davvero cancellare tutte le attività di esempio e iniziare con una bacheca vuota?',
    es: '¿Seguro que quieres borrar todas las tareas de ejemplo y empezar de cero?',
    el: 'Θέλεις πραγματικά να διαγράψεις όλες τις εργασίες και να ξεκινήσεις με κενό πίνακα;'
  });

  if (confirm(confirmMsg)) {
    saveHistory();
    state.items.daily = [];
    state.items.weekly = [];
    state.items.occasionally = [];
    state.items.todo = [];
    state.sampleBannerDismissed = true;
    saveState();
    renderApp();
    populateHelperTaskSelect();
    showToast(tr({
      de: 'Alle Aufgaben geleert. Dein Board ist bereit für dich! 🌱',
      en: 'All tasks cleared. Your board is fresh and ready! 🌱',
      fr: 'Toutes les tâches ont été effacées. Ton tableau est prêt ! 🌱',
      it: 'Tutte le attività cancellate. La tua bacheca è pronta! 🌱',
      es: 'Todas las tareas eliminadas. ¡Tu tablero está listo! 🌱',
      el: 'Όλες οι εργασίες καθαρίστηκαν. Ο πίνακας είναι έτοιμος! 🌱'
    }));
  }
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

if (typeof window !== 'undefined') {
  window.parseTextIntoItems = parseTextIntoItems;
  window.parseIcsCalendar = parseIcsCalendar;
  window.executeTextImport = executeTextImport;
  window.deleteTask = deleteTask;
  window.handleRestoreDoneTask = handleRestoreDoneTask;
}
if (typeof globalThis !== 'undefined') {
  globalThis.parseTextIntoItems = parseTextIntoItems;
  globalThis.parseIcsCalendar = parseIcsCalendar;
  globalThis.executeTextImport = executeTextImport;
  globalThis.deleteTask = deleteTask;
  globalThis.handleRestoreDoneTask = handleRestoreDoneTask;
}

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
    article.dataset.category = id;
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
            showToast(tr({ de: 'Spalten-Reihenfolge aktualisiert ↕️', en: 'Column order updated ↕️', es: 'Orden de columnas actualizado ↕️', el: 'Η σειρά στηλών ενημερώθηκε ↕️', fr: 'Ordre des colonnes mis à jour ↕️', it: 'Ordine delle colonne aggiornato ↕️' }));
          }
        }
        draggedColumnId = null;
      } else { handleDrop(e, id); }
    };
    article.innerHTML = `
      <div class="flex items-center justify-between gap-1 mb-2.5">
        <h2 class="flex items-center gap-1.5 text-gray-400 font-bold font-display text-[10px] tracking-wider uppercase cursor-grab active:cursor-grabbing select-none" title="Spalte durch Ziehen neu anordnen">
          <i data-lucide="${iconKey}" class="w-3.5 h-3.5 pointer-events-none"></i> <span class="pointer-events-none">${titleText}</span>
        </h2>
        ${(id === 'todo' || id === 'notes' || id === 'daily' || id === 'weekly' || id === 'occasionally') ? `
          <button onclick="openTextImportModal('${id}', event)" class="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer opacity-30 hover:opacity-100" title="${id === 'notes' ? 'Notizen aus Textdatei (.txt) oder Zwischenablage importieren' : 'Aufgaben aus Textdatei (.txt) oder Zwischenablage importieren'}">
            <i data-lucide="file-input" class="w-3.5 h-3.5"></i>
          </button>
        ` : ''}
      </div>
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
      const notesList = state.items.notes || [];
      notesList.forEach((note, index) => {
        const noteText = typeof note === 'object' ? note.task : note;
        const safeNoteEscaped = String(noteText || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const itemDiv = document.createElement('div');
        itemDiv.draggable = true;
        itemDiv.ondragstart = (e) => handleDragStart(e, 'notes', index);
        itemDiv.ondragover = (e) => handleDragOver(e);
        itemDiv.ondrop = (e) => handleItemDrop(e, 'notes', index);
        itemDiv.className = `group relative w-full h-auto min-h-[42px] max-h-[85px] overflow-hidden flex items-center justify-between p-2.5 border-0 border-l-[4px] border-amber-400 bg-amber-500/10 hover:bg-amber-500/15 text-gray-200 font-medium transition duration-150 rounded-lg shadow-sm cursor-pointer`;
        itemDiv.onclick = () => openNoteDetailModal(index);
        
        itemDiv.innerHTML = `
          <div class="flex items-center gap-2.5 flex-1 min-w-0 pr-2 pointer-events-none">
            <i data-lucide="sticky-note" class="w-4 h-4 text-amber-400 shrink-0"></i>
            <span class="text-xs text-amber-100 font-normal leading-snug line-clamp-2 break-words flex-1 select-text" title="${safeNoteEscaped}">${noteText}</span>
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
          if (!state.items.notes) state.items.notes = [];
          state.items.notes.push(addInput.value.trim());
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
            <button onclick="openTaskStepsModal('${id}', ${index}, event)" class="p-1 text-[var(--accent-light)] hover:text-white hover:bg-white/10 rounded transition cursor-pointer" title="${tr({ de: 'In Teilschritte zerlegen', en: 'Break into subtasks' })}"><i data-lucide="footprints" class="w-3.5 h-3.5"></i></button>
            <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
            <button onclick="copyTaskText('${safeTaskEscaped}', event)" class="p-1 text-gray-300 hover:text-white hover:bg-white/10 rounded transition cursor-pointer" title="${tr({ de: 'Text kopieren', en: 'Copy text' })}"><i data-lucide="copy" class="w-3.5 h-3.5"></i></button>
            <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
            <button onclick="startTaskTimer('${safeTaskEscaped}', event)" class="p-1 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded transition cursor-pointer" title="Timer starten"><i data-lucide="timer" class="w-3.5 h-3.5"></i></button>
            <div class="w-[1px] h-3 bg-white/15 my-auto"></div>
            <button onclick="deleteTask('${id}', ${index}, event)" class="p-1 text-gray-500 hover:text-red-400 hover:bg-white/10 rounded transition cursor-pointer" title="Löschen"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
          </div>
        `;
        listEl.appendChild(itemDiv);
      });
      const addBtn = document.createElement('button'); addBtn.onclick = () => { openTaskAddColumns[id] = true; renderApp(); };
      addBtn.className = 'w-full min-h-[38px] p-2 rounded-lg border border-dashed border-white/15 bg-[#0a0a0e] hover:bg-[#13131e] text-center text-xs text-gray-400 hover:text-white font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm';
      addBtn.innerHTML = `<i data-lucide="plus" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i><span>${t('add')}</span>`;
      const addInput = document.createElement('input'); addInput.type = 'text';
      addInput.placeholder = t('add');
      addInput.className = 'w-full min-h-[38px] p-2 px-3 rounded-lg border border-[var(--accent)]/60 bg-[#0a0a0e] text-left text-xs placeholder:text-gray-500 focus:outline-none focus:border-[var(--accent)] transition cursor-text font-semibold text-gray-300 shadow-inner';
      addInput.onkeydown = (e) => {
        if (e.key === 'Enter' && addInput.value.trim()) {
          saveHistory(); state.items[id].push(addInput.value.trim()); addInput.value = '';
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
    main.appendChild(article);
  });
  updateShoppingListPopup(true); renderCookingPanel(true); if (typeof lucide !== 'undefined') { lucide.createIcons(); }
  renderMobileCategoryTabs();
}

function renderMobileCategoryTabs() {
  const bar = document.getElementById('mobile-category-tabs');
  if (!bar) return;

  let activeCat = localStorage.getItem('flowPlannerMobileCategory');
  if (!activeCat || !categoriesOrder.some(([id]) => id === activeCat)) {
    activeCat = categoriesOrder[0] ? categoriesOrder[0][0] : 'daily';
  }
  document.body.dataset.mobileCat = activeCat;

  bar.innerHTML = categoriesOrder.map(([id, iconKey]) => {
    const isActive = id === activeCat;
    const shortLabel = t(id).replace(/\s*\(.*?\)\s*$/, '');
    return `
      <button onclick="setMobileCategory('${id}')" class="mobile-tab-btn ${isActive ? 'mobile-tab-active' : ''}" data-cat="${id}">
        <i data-lucide="${iconKey}" class="w-[18px] h-[18px]"></i>
        <span>${shortLabel}</span>
      </button>
    `;
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
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
    setThemeSlow(getSimilarTheme(currentTheme)); saveState(); showPraise(); renderApp(); updateZenView(); populateHelperTaskSelect();
  };
  if (taskEl) { 
    spawnFloatingBubbles(event);
    animateTaskToDone(taskEl, '#list-done', onComplete); 
  } else { 
    spawnFloatingBubbles(event);
    onComplete(); 
  }
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
  if (srcCat === 'done' || targetCategory === 'done') return;
  if (!state.items[srcCat] || !state.items[targetCategory]) return;
  saveHistory(); const [item] = state.items[srcCat].splice(srcIdx, 1);
  state.items[targetCategory].splice(targetIndex, 0, item); draggedItemInfo = null; saveState(); renderApp(); populateHelperTaskSelect();
}

function handleDrop(e, targetCategory) {
  e.preventDefault(); let data = draggedItemInfo;
  try { if (!data) data = JSON.parse(e.dataTransfer.getData('text/plain')); } catch(err) {}
  if (!data || data.category === undefined || data.index === undefined) return;
  const { category: srcCat, index: srcIdx } = data;
  if (srcCat === 'done' || targetCategory === 'done') return;
  if (!state.items[srcCat] || !state.items[targetCategory]) return;
  saveHistory(); const [item] = state.items[srcCat].splice(srcIdx, 1);
  state.items[targetCategory].push(item); draggedItemInfo = null; saveState(); renderApp(); populateHelperTaskSelect();
}

let currentlyOpenPanel = null; let hoverPanelTimeout = null;

function showPanelHover(panelName) {
  clearTimeout(hoverPanelTimeout); if (currentlyOpenPanel === panelName) return;
  currentlyOpenPanel = panelName;
  ['feedback', 'report', 'settings', 'soundscape', 'language', 'boost', 'music', 'sync', 'theme', 'calendar-dropdown', 'inspiration', 'shopping', 'cooking', 'pause-dropdown', 'logo-guide'].forEach(p => {
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
  const lines = rawText.split(/\r?\n/);
  const items = [];
  lines.forEach(line => {
    let clean = line.trim();
    clean = clean.replace(/^[-*•\d.)\]\s]+/, '').trim();
    if (clean.length > 0) {
      items.push(clean);
    }
  });
  return items;
}

function executeTextImport() {
  const textarea = document.getElementById('text-import-textarea');
  const text = textarea ? textarea.value : '';
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
  if (!state.items[currentImportTargetCat]) {
    state.items[currentImportTargetCat] = [];
  }
  
  items.forEach(item => {
    state.items[currentImportTargetCat].push(item);
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
  if (index >= 0 && state.items.notes && state.items.notes[index] !== undefined) {
    const val = textarea ? textarea.value.trim() : '';
    if (val) {
      saveHistory();
      state.items.notes[index] = val;
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

function togglePanel(panelName) {
  clearTimeout(hoverPanelTimeout); const el = document.getElementById(`panel-${panelName}`); if (!el) return;
  const isCurrentlyHidden = el.classList.contains('hidden');
  ['feedback', 'report', 'settings', 'soundscape', 'language', 'boost', 'music', 'sync', 'theme', 'calendar-dropdown', 'inspiration', 'shopping', 'cooking', 'pause-dropdown', 'logo-guide'].forEach(p => {
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
      return "Hallo! Schön, dass du da bist. 🌊 Dein Board is im Moment wunderbar leer und erledigt. Gibt es etwas, das du für die Zukunft planen möchtest, oder willst du dich einfach entspannen?";
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

let activeDanceTimeouts = []; let currentlyDancingButtons = [];

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

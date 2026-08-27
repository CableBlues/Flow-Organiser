// app-alarm.js: Wecker & Reminder (Zuverlässige minütliche Auslösung)
let alarmState = { alarms: [], reminders: [] };

function initAlarmReminder() {
  try {
    const defaultData = {
      alarms: [{ id: '1', time: '08:00', label: 'Fokus-Start', active: true }],
      reminders: [{ id: '101', text: 'Wasser trinken 💧', time: Date.now() + 600000, completed: false }]
    };
    if (typeof AppStorage !== 'undefined') {
      alarmState = AppStorage.get('flow_alarms_reminders', defaultData);
    } else {
      const s = localStorage.getItem('flow_alarms_reminders');
      alarmState = s ? JSON.parse(s) : defaultData;
    }
  } catch(e) {
    console.warn('[Alarm] Fehler beim Laden der Alarme:', e);
  }
  updateAlarmBadge();
}

function saveAlarmState() {
  try {
    if (typeof AppStorage !== 'undefined') {
      AppStorage.set('flow_alarms_reminders', alarmState);
    } else {
      localStorage.setItem('flow_alarms_reminders', JSON.stringify(alarmState));
    }
    updateAlarmBadge();
  } catch(e) {
    console.warn('[Alarm] Fehler beim Speichern der Alarme:', e);
  }
}

function updateAlarmBadge() {
  const b = document.getElementById('alarm-active-badge');
  if (!b) return;
  const active = (alarmState.alarms || []).some(a => a.active) || (alarmState.reminders || []).some(r => !r.completed);
  b.classList.toggle('hidden', !active);
}

function requestAlarmNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(() => {
      renderAlarmPanel();
    });
  }
}
window.requestAlarmNotificationPermission = requestAlarmNotificationPermission;

function sendBrowserNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification(title, {
            body: body,
            icon: 'icon-192.png',
            badge: 'icon-192.png',
            vibrate: [200, 100, 200]
          });
        });
      } else {
        new Notification(title, { body: body, icon: 'icon-192.png' });
      }
    } catch (e) {
      console.warn('[Alarm] Notification dispatch warning:', e);
    }
  }
}

let currentAlarmTab = 'alarms'; // 'alarms' | 'reminders'

function switchAlarmTab(tab) {
  currentAlarmTab = tab;
  renderAlarmPanel();
}
window.switchAlarmTab = switchAlarmTab;

function openAlarmModal(tab = 'alarms') {
  currentAlarmTab = tab;
  if (typeof togglePanel === 'function') {
    togglePanel('alarm');
  }
  renderAlarmPanel();
}
window.openAlarmModal = openAlarmModal;

function renderAlarmPanel() {
  const panel = document.getElementById('panel-alarm');
  if (!panel) return;
  panel.style.width = "380px";
  panel.style.maxWidth = "95vw";
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const safeEscape = typeof escapeHtml === 'function' ? escapeHtml : (str) => String(str || '');
  const hasNotif = 'Notification' in window;
  const notifPerm = hasNotif ? Notification.permission : 'unsupported';

  const alarmCount = (alarmState.alarms || []).filter(a => a.active).length;
  const reminderCount = (alarmState.reminders || []).filter(r => !r.completed).length;

  const tabAlarmsText = typeof tr === 'function' ? tr({
    en: 'Alarms',
    de: 'Wecker',
    fr: 'Réveils',
    it: 'Sveglie',
    es: 'Alarmas',
    el: 'Ξυπνητήρια'
  }) : 'Wecker';

  const tabRemindersText = typeof tr === 'function' ? tr({
    en: 'Reminders',
    de: 'Reminder',
    fr: 'Rappels',
    it: 'Promemoria',
    es: 'Recordatorios',
    el: 'Υπενθυμίσεις'
  }) : 'Reminder';

  panel.innerHTML = `
    <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
      <h4 class="font-bold text-sm font-display text-white flex items-center gap-2">
        <i data-lucide="${currentAlarmTab === 'alarms' ? 'alarm-clock' : 'bell-ring'}" class="w-4 h-4 text-cyan-400"></i>
        <span>${tabAlarmsText} & ${tabRemindersText}</span>
      </h4>
      <button onclick="togglePanel('alarm')" class="text-gray-400 hover:text-white text-xs font-bold p-1 cursor-pointer">✕</button>
    </div>

    <!-- Segmented Tab Switcher (Wecker vs Reminder) -->
    <div class="grid grid-cols-2 gap-1.5 p-1 bg-black/60 border border-white/10 rounded-2xl text-xs font-bold mt-1">
      <button onclick="switchAlarmTab('alarms')" class="py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${currentAlarmTab === 'alarms' ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}">
        <i data-lucide="alarm-clock" class="w-3.5 h-3.5 ${currentAlarmTab === 'alarms' ? 'text-white' : 'text-cyan-400'}"></i>
        <span>⏰ ${tabAlarmsText}</span>
        ${alarmCount > 0 ? `<span class="px-1.5 py-0.2 rounded-full text-[9px] bg-white/20 font-mono">${alarmCount}</span>` : ''}
      </button>
      <button onclick="switchAlarmTab('reminders')" class="py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${currentAlarmTab === 'reminders' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}">
        <i data-lucide="bell" class="w-3.5 h-3.5 ${currentAlarmTab === 'reminders' ? 'text-white' : 'text-amber-400'}"></i>
        <span>🔔 ${tabRemindersText}</span>
        ${reminderCount > 0 ? `<span class="px-1.5 py-0.2 rounded-full text-[9px] bg-white/20 font-mono">${reminderCount}</span>` : ''}
      </button>
    </div>

    <!-- Tab 1: WECKER (Feste Uhrzeiten) -->
    <div id="alarm-subpane-alarms" class="${currentAlarmTab === 'alarms' ? 'block' : 'hidden'} space-y-3 pt-2">
      <!-- Ehrlicher Hinweis zur Browser-Funktionsweise & Benachrichtigungen -->
      <div class="p-2 bg-cyan-950/20 border border-cyan-500/20 rounded-xl text-[10px] text-cyan-200/90 flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-1 font-semibold">
            <i data-lucide="info" class="w-3 h-3 text-cyan-400 shrink-0"></i>
            <span>Aktiv bei geöffnetem Tab</span>
          </span>
          ${notifPerm === 'granted' ? `
            <span class="text-emerald-400 font-mono text-[9px] font-bold">🔔 Erlaubt</span>
          ` : (hasNotif ? `
            <button onclick="requestAlarmNotificationPermission()" class="px-2 py-0.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 rounded text-[9px] font-bold cursor-pointer transition">Erlauben</button>
          ` : '')}
        </div>
        <div class="text-[9px] text-gray-400 leading-tight">
          Spielt einen akustischen Weckton zur gewünschten Uhrzeit.
        </div>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-[10px] font-bold uppercase tracking-wider text-cyan-400">⏰ Neuer Wecker</span>
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
        ${(!alarmState.alarms || alarmState.alarms.length === 0) ? `
          <div class="text-center py-6 text-gray-500 text-xs font-medium">Keine Wecker gestellt</div>
        ` : (alarmState.alarms || []).map(a => `
          <div class="flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-cyan-500/30 transition">
            <div class="flex items-center gap-2.5">
              <input type="checkbox" ${a.active ? 'checked' : ''} onchange="handleToggleAlarm('${a.id}')" class="w-4 h-4 accent-cyan-500 cursor-pointer rounded" />
              <div>
                <div class="text-xs font-bold text-white font-mono leading-none mb-0.5">${safeEscape(a.time)}</div>
                <div class="text-[10px] text-gray-400 leading-none">${safeEscape(a.label || 'Wecker')}</div>
              </div>
            </div>
            <button onclick="handleDeleteAlarm('${a.id}')" class="text-gray-500 hover:text-rose-400 p-1 transition cursor-pointer" title="Löschen">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Tab 2: REMINDER (Timer / Countdown) -->
    <div id="alarm-subpane-reminders" class="${currentAlarmTab === 'reminders' ? 'block' : 'hidden'} space-y-3 pt-2">
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400">🔔 Neue Erinnerung</span>
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
        ${(!alarmState.reminders || alarmState.reminders.length === 0) ? `
          <div class="text-center py-6 text-gray-500 text-xs font-medium">Keine Erinnerungen aktiv</div>
        ` : (alarmState.reminders || []).map(r => {
          const leftMin = Math.max(0, Math.round((r.time - Date.now()) / 60000));
          return `
            <div class="flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/5 rounded-xl ${r.completed ? 'opacity-40 line-through' : ''}">
              <div class="flex items-center gap-2.5 min-w-0">
                <input type="checkbox" ${r.completed ? 'checked' : ''} onchange="handleToggleReminder('${r.id}')" class="w-4 h-4 accent-amber-500 cursor-pointer rounded" />
                <span class="text-xs font-semibold text-gray-200 truncate">${safeEscape(r.text)}</span>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-[9px] font-mono text-amber-400 font-bold">${r.completed ? 'Erledigt' : `${leftMin}m`}</span>
                <button onclick="handleDeleteReminder('${r.id}')" class="text-gray-500 hover:text-rose-400 p-1 transition cursor-pointer" title="Löschen">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  renderLucideIcons();
}

function handleAddAlarm() {
  const time = document.getElementById('new-alarm-time')?.value;
  const label = document.getElementById('new-alarm-label')?.value || 'Wecker';
  if (!time) return;
  alarmState.alarms.push({ id: Date.now().toString(), time, label, active: true });
  saveAlarmState();
  renderAlarmPanel();
  if (typeof showToast === 'function') showToast(`Wecker für ${time} aktiviert ⏰`);
}

function handleToggleAlarm(id) {
  const a = alarmState.alarms.find(x => x.id === id);
  if (a) { a.active = !a.active; saveAlarmState(); renderAlarmPanel(); }
}

function handleDeleteAlarm(id) {
  alarmState.alarms = alarmState.alarms.filter(x => x.id !== id);
  saveAlarmState();
  renderAlarmPanel();
}

function handleAddReminder() {
  const txt = document.getElementById('new-reminder-text');
  const sel = document.getElementById('new-reminder-mins');
  if (!txt || !txt.value.trim()) return;
  const mins = parseInt(sel.value) || 10;
  alarmState.reminders.push({
    id: Date.now().toString(),
    text: txt.value.trim(),
    time: Date.now() + mins * 60000,
    completed: false
  });
  saveAlarmState();
  renderAlarmPanel();
  if (typeof showToast === 'function') showToast(`Erinnerung in ${mins} Min gesetzt! 🔔`);
  txt.value = '';
}

function handleToggleReminder(id) {
  const r = alarmState.reminders.find(x => x.id === id);
  if (r) { r.completed = !r.completed; saveAlarmState(); renderAlarmPanel(); }
}

function handleDeleteReminder(id) {
  alarmState.reminders = alarmState.reminders.filter(x => x.id !== id);
  saveAlarmState();
  renderAlarmPanel();
}

let lastTriggeredMinuteKey = '';
function checkAlarmsLoop() {
  const now = new Date();
  const hm = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  const minuteKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${hm}`;
  
  if (minuteKey !== lastTriggeredMinuteKey) {
    (alarmState.alarms || []).forEach(a => {
      if (a.active && a.time === hm) {
        lastTriggeredMinuteKey = minuteKey;
        triggerAlarmModal(a.label, a.time);
        sendBrowserNotification(`⏰ Wecker: ${a.label || 'Wecker'} (${a.time})`, 'Dein Wecker ist jetzt fällig!');
      }
    });
  }

  const nowMs = Date.now();
  (alarmState.reminders || []).forEach(r => {
    if (!r.completed && r.time <= nowMs) {
      r.completed = true;
      saveAlarmState();
      renderAlarmPanel();
      const safeEscape = typeof escapeHtml === 'function' ? escapeHtml : (str) => String(str || '');
      if (typeof showToast === 'function') showToast(`🔔 Erinnerung: "${safeEscape(r.text)}"`);
      if (typeof playProceduralSound === 'function') playProceduralSound(1);
      sendBrowserNotification('🔔 Flow Reminder', r.text);
    }
  });
}

function triggerAlarmModal(title, time) {
  if (typeof playProceduralSound === 'function') {
    playProceduralSound(0);
    setTimeout(() => playProceduralSound(2), 500);
  }
  const existing = document.getElementById('alarm-modal');
  if (existing) existing.remove();

  const safeEscape = typeof escapeHtml === 'function' ? escapeHtml : (str) => String(str || '');

  const d = document.createElement('div');
  d.id = 'alarm-modal';
  d.className = 'fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4';
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
        <button onclick="document.getElementById('alarm-modal').remove(); snoozeAlarm();" class="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-gray-200 font-bold text-xs rounded-xl cursor-pointer">Snooze 💤</button>
        <button onclick="document.getElementById('alarm-modal').remove();" class="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl cursor-pointer">Stoppen 🔕</button>
      </div>
    </div>
  `;
  document.body.appendChild(d);
  renderLucideIcons();
}

function snoozeAlarm() {
  alarmState.reminders.push({
    id: Date.now().toString(),
    text: 'Snooze Wecker ⏰',
    time: Date.now() + 5 * 60000,
    completed: false
  });
  saveAlarmState();
  renderAlarmPanel();
  if (typeof showToast === 'function') showToast('Wecker für 5 Minuten pausiert (Snooze) 💤');
}

let alarmLoopStarted = false;
function startAlarmLoopOnce() {
  if (alarmLoopStarted) return;
  alarmLoopStarted = true;
  initAlarmReminder();
  setInterval(checkAlarmsLoop, 5000);
}

document.addEventListener('DOMContentLoaded', startAlarmLoopOnce);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  startAlarmLoopOnce();
}

if (typeof window !== 'undefined') {
  window.alarmState = alarmState;
  window.initAlarmReminder = initAlarmReminder;
  window.saveAlarmState = saveAlarmState;
  window.renderAlarmPanel = renderAlarmPanel;
  window.checkAlarmsLoop = checkAlarmsLoop;
  window.triggerAlarmModal = triggerAlarmModal;
  window.snoozeAlarm = snoozeAlarm;
}
if (typeof globalThis !== 'undefined') {
  globalThis.alarmState = alarmState;
  globalThis.initAlarmReminder = initAlarmReminder;
  globalThis.saveAlarmState = saveAlarmState;
  globalThis.renderAlarmPanel = renderAlarmPanel;
  globalThis.checkAlarmsLoop = checkAlarmsLoop;
  globalThis.triggerAlarmModal = triggerAlarmModal;
  globalThis.snoozeAlarm = snoozeAlarm;
}

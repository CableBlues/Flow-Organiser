// app-alarm.js: Wecker & Reminder
let alarmState = { alarms: [], reminders: [] };

function initAlarmReminder() {
  try {
    const s = localStorage.getItem('flow_alarms_reminders');
    if (s) alarmState = JSON.parse(s);
    else {
      alarmState = {
        alarms: [{ id: '1', time: '08:00', label: 'Fokus-Start', active: true }],
        reminders: [{ id: '101', text: 'Wasser trinken 💧', time: Date.now() + 600000, completed: false }]
      };
      saveAlarmState();
    }
  } catch(e) {}
  updateAlarmBadge();
}

function saveAlarmState() {
  try {
    localStorage.setItem('flow_alarms_reminders', JSON.stringify(alarmState));
    updateAlarmBadge();
  } catch(e) {}
}

function updateAlarmBadge() {
  const b = document.getElementById('alarm-active-badge');
  if (!b) return;
  const active = (alarmState.alarms || []).some(a => a.active) || (alarmState.reminders || []).some(r => !r.completed);
  b.classList.toggle('hidden', !active);
}

function renderAlarmPanel() {
  const panel = document.getElementById('panel-alarm');
  if (!panel) return;
  panel.style.width = "380px";
  panel.style.maxWidth = "95vw";
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  panel.innerHTML = `
    <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
      <h4 class="font-bold text-sm font-display text-white flex items-center gap-2">
        <i data-lucide="alarm-clock" class="w-4 h-4 text-cyan-400"></i>
        <span>Wecker & Reminder</span>
      </h4>
      <button onclick="togglePanel('alarm')" class="text-gray-400 hover:text-white text-xs font-bold p-1 cursor-pointer">✕</button>
    </div>

    <div class="space-y-4 pt-3 max-h-[460px] overflow-y-auto pr-1">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold uppercase tracking-wider text-cyan-400">⏰ Wecker</span>
          <span class="text-[9px] text-gray-400 font-mono">Uhrzeit: <b class="text-white">${nowStr}</b></span>
        </div>
        <div class="flex gap-2 bg-black/40 p-2 rounded-2xl border border-white/5">
          <input type="time" id="new-alarm-time" value="09:00" class="p-2 bg-[#12121c] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-cyan-500 font-semibold cursor-pointer" />
          <input type="text" id="new-alarm-label" placeholder="Bezeichnung (z.B. Pause)" class="flex-1 p-2 bg-[#12121c] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-cyan-500 font-semibold placeholder:text-gray-500" />
          <button onclick="handleAddAlarm()" class="px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center">
            <i data-lucide="plus" class="w-4 h-4"></i>
          </button>
        </div>
        <div class="space-y-1.5 max-h-[130px] overflow-y-auto">
          ${(alarmState.alarms||[]).length === 0 ? '<div class="text-center py-2 text-xs text-gray-500 italic">Keine Wecker.</div>' : ''}
          ${(alarmState.alarms||[]).map(a => `
            <div class="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
              <div class="flex items-center gap-2.5">
                <input type="checkbox" ${a.active?'checked':''} onchange="handleToggleAlarm('${a.id}')" class="w-4 h-4 accent-cyan-500 cursor-pointer rounded" />
                <div>
                  <div class="text-sm font-bold font-mono ${a.active?'text-white':'text-gray-500 line-through'}">${a.time}</div>
                  <div class="text-[10px] text-gray-400">${a.label}</div>
                </div>
              </div>
              <button onclick="handleDeleteAlarm('${a.id}')" class="text-gray-500 hover:text-red-400 p-1 cursor-pointer" title="Löschen">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="h-[1px] bg-white/10"></div>

      <div class="space-y-2">
        <div class="text-[10px] font-bold uppercase tracking-wider text-cyan-400">🔔 Erinnerungen</div>
        <div class="flex flex-col gap-2 bg-black/40 p-2 rounded-2xl border border-white/5">
          <input type="text" id="new-reminder-text" placeholder="Woran erinnern? (z.B. Dehnen, Trinken)" class="w-full p-2 bg-[#12121c] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-cyan-500 font-semibold placeholder:text-gray-500" />
          <div class="flex gap-2">
            <select id="new-reminder-delay" class="flex-1 p-2 bg-[#12121c] border border-white/10 rounded-xl text-xs text-gray-200 outline-none cursor-pointer">
              <option value="5">In 5 Minuten</option>
              <option value="15" selected>In 15 Minuten</option>
              <option value="30">In 30 Minuten</option>
              <option value="45">In 45 Minuten</option>
              <option value="60">In 1 Stunde</option>
            </select>
            <button onclick="handleAddReminder()" class="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition cursor-pointer">Setzen</button>
          </div>
        </div>
        <div class="space-y-1.5 max-h-[140px] overflow-y-auto">
          ${(alarmState.reminders||[]).length === 0 ? '<div class="text-center py-2 text-xs text-gray-500 italic">Keine Erinnerungen.</div>' : ''}
          ${(alarmState.reminders||[]).map(r => {
            const minLeft = Math.max(0, Math.ceil((r.time - Date.now())/60000));
            return `
              <div class="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
                <div class="flex items-center gap-2.5">
                  <input type="checkbox" ${r.completed?'checked':''} onchange="handleToggleReminder('${r.id}')" class="w-4 h-4 accent-cyan-500 cursor-pointer rounded" />
                  <div>
                    <div class="text-xs font-bold ${r.completed?'text-gray-500 line-through':'text-gray-200'}">${r.text}</div>
                    <div class="text-[9px] text-cyan-400 font-mono">${r.completed?'Erledigt':`in ${minLeft} Min`}</div>
                  </div>
                </div>
                <button onclick="handleDeleteReminder('${r.id}')" class="text-gray-500 hover:text-red-400 p-1 cursor-pointer" title="Löschen">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function handleAddAlarm() {
  const t = document.getElementById('new-alarm-time');
  const l = document.getElementById('new-alarm-label');
  if (!t || !t.value) return;
  alarmState.alarms.push({
    id: Date.now().toString(),
    time: t.value,
    label: l ? l.value.trim() || 'Wecker' : 'Wecker',
    active: true
  });
  saveAlarmState();
  renderAlarmPanel();
  if (typeof showToast === 'function') showToast(`Wecker für ${t.value} gestellt! ⏰`);
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
  const delay = document.getElementById('new-reminder-delay');
  if (!txt || !txt.value.trim()) return;
  const mins = parseInt(delay ? delay.value : '15', 10);
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

let lastTriggeredHM = '';
function checkAlarmsLoop() {
  const now = new Date();
  const hm = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  
  if (hm !== lastTriggeredHM && now.getSeconds() === 0) {
    (alarmState.alarms || []).forEach(a => {
      if (a.active && a.time === hm) {
        lastTriggeredHM = hm;
        triggerAlarmModal(a.label, a.time);
      }
    });
  }

  const nowMs = Date.now();
  (alarmState.reminders || []).forEach(r => {
    if (!r.completed && r.time <= nowMs) {
      r.completed = true;
      saveAlarmState();
      renderAlarmPanel();
      if (typeof showToast === 'function') showToast(`🔔 Erinnerung: "${r.text}"`);
      if (typeof playProceduralSound === 'function') playProceduralSound(1);
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

  const d = document.createElement('div');
  d.id = 'alarm-modal';
  d.className = 'fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4';
  d.innerHTML = `
    <div class="w-full max-w-sm bg-[#161622] border-2 border-cyan-500 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center gap-4">
      <div class="w-16 h-16 rounded-2xl bg-cyan-500/25 border border-cyan-500/40 flex items-center justify-center text-cyan-400 animate-bounce">
        <i data-lucide="alarm-clock" class="w-8 h-8"></i>
      </div>
      <div>
        <div class="text-[10px] uppercase font-bold tracking-widest text-cyan-400 mb-1">Wecker (${time})</div>
        <h3 class="text-xl font-bold text-white">${title}</h3>
      </div>
      <div class="flex gap-2 w-full mt-2">
        <button onclick="document.getElementById('alarm-modal').remove(); snoozeAlarm();" class="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-gray-200 font-bold text-xs rounded-xl cursor-pointer">Snooze 💤</button>
        <button onclick="document.getElementById('alarm-modal').remove();" class="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl cursor-pointer">Stoppen 🔕</button>
      </div>
    </div>
  `;
  document.body.appendChild(d);
  if (typeof lucide !== 'undefined') lucide.createIcons();
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

document.addEventListener('DOMContentLoaded', () => {
  initAlarmReminder();
  setInterval(checkAlarmsLoop, 1000);
});
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initAlarmReminder();
  setInterval(checkAlarmsLoop, 1000);
}

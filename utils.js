function showToast(msg) {
  const overlay = document.getElementById('toast-overlay');
  const card = document.getElementById('toast-card');
  if (card && overlay) {
    card.innerText = msg; overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.add('hidden'), 2200);
  }
}

function showPraise() {
  const praises = TRANSLATIONS[currentLang]?.praise || TRANSLATIONS.de.praise;
  const msg = praises[Math.floor(Math.random() * praises.length)];
  const overlay = document.getElementById('praise-overlay');
  const card = document.getElementById('praise-card');
  if (card && overlay) {
    card.innerText = msg; overlay.classList.remove('hidden');
    card.style.animation = 'scaleBounce 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    setTimeout(() => overlay.classList.add('hidden'), 1100);
  }
}

function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const particles = []; const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#38bdf8', '#a855f7'];
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200, y: canvas.height / 3 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.8) * 12, size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)], life: 1, decay: Math.random() * 0.02 + 0.015,
      rotation: Math.random() * Math.PI * 2, vRot: (Math.random() - 0.5) * 0.2
    });
  }
  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); let active = false;
    particles.forEach(p => {
      if (p.life > 0) {
        active = true; p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.life -= p.decay; p.rotation += p.vRot;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation); ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life); ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size); ctx.restore();
      }
    });
    if (active) requestAnimationFrame(frame); else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(frame);
}

function playProceduralSound() {
  try {
    initAudioContext(); // Verwendet den globalen Kontext aus audio.js
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15);
    
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc.start(now);
    osc.stop(now + 0.35);
  } catch(e) {
    console.error("Fehler beim Energiser-Feedback:", e);
  }
}

function formatTerminDate(dateStr, timeStr) {
  if (!dateStr) return timeStr ? `🕒 ${timeStr}` : '';
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowISO = tomorrow.toISOString().split('T')[0];
  const localizedToday = t('date_badge_today');
  const localizedTomorrow = t('date_badge_tomorrow');
  let label = '';
  if (dateStr === todayISO) label = localizedToday;
  else if (dateStr === tomorrowISO) label = localizedTomorrow;
  else {
    const parts = dateStr.split('-');
    if (parts.length === 3) label = `🗓️ ${parts[2]}.${parts[1]}.`;
    else label = `🗓️ ${dateStr}`;
  }
  return timeStr ? `${label} · ${timeStr}` : label;
}

function updateDateAndStreak() {
  const locales = { de: 'de-DE', en: 'en-GB', el: 'el-GR', es: 'es-ES' };
  try {
    const str = new Intl.DateTimeFormat(locales[currentLang] || 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
    const displayEl = document.getElementById('date-display');
    if (displayEl) displayEl.innerText = str;
  } catch (e) {
    const displayEl = document.getElementById('date-display');
    if (displayEl) displayEl.innerText = new Date().toLocaleDateString();
  }
}
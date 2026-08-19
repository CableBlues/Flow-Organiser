// utils.js Teil 1/2: State, Toast/Konfetti/Praise-Anzeige, Sound-Effekte
// Shuffler-Pools zur vollständigen Absicherung gegen Wiederholungen
let praisePool = [];
let soundPool = [];
let animationPool = [];

// Abgestuftes Lob-System (Skaliert mit dem Fortschritt des Tages)
// Merkt sich den zuletzt gezeigten Lob-Spruch, damit er nicht sofort wiederholt wird
let lastPraiseMsg = null;

function getNextFromPool(poolArray, limit) {
  if (poolArray.length === 0) {
    for (let i = 0; i < limit; i++) poolArray.push(i);
    for (let i = poolArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [poolArray[i], poolArray[j]] = [poolArray[j], poolArray[i]];
    }
  }
  return poolArray.pop();
}

function showToast(msg) {
  const overlay = document.getElementById('toast-overlay');
  const card = document.getElementById('toast-card');
  if (card && overlay) {
    card.innerText = msg; overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.add('hidden'), 2200);
  }
}

// Integrierte performante Canvas-Konfetti-Engine
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#8b5cf6', '#38bdf8', '#10b981', '#ec4899', '#f59e0b', '#fb7185'];
  const particles = [];

  for (let i = 0; i < 110; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 22,
      vy: (Math.random() - 0.5) * 22 - 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    particles.forEach(p => {
      if (p.opacity > 0) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.45; 
        p.vx *= 0.98; 
        p.opacity -= 0.012;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        active = true;
      }
    });

    if (active) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  animate();
}

function showPraise() {
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'de';
  const todayISO = new Date().toISOString().split('T')[0];
  
  // Zähle die heute erledigten Aufgaben
  const completedToday = (state.done || []).filter(item => item.date === todayISO).length;
  
  // Bestimme die passende Stufe des Lobes
  let activeTier = 'tier1';
  if (completedToday >= 9) {
    activeTier = 'tier4';
  } else if (completedToday >= 5) {
    activeTier = 'tier3';
  } else if (completedToday >= 2) {
    activeTier = 'tier2';
  }
  
  const list = (TIERED_PRAISES[lang] || TIERED_PRAISES['de'])[activeTier];
  
  // Hole einen zufälligen Spruch aus der gewählten Stufe, ohne den zuletzt gezeigten sofort zu wiederholen
  let praiseIdx = Math.floor(Math.random() * list.length);
  if (list.length > 1) {
    while (list[praiseIdx] === lastPraiseMsg) {
      praiseIdx = Math.floor(Math.random() * list.length);
    }
  }
  const msg = list[praiseIdx];
  lastPraiseMsg = msg;

  const overlay = document.getElementById('praise-overlay');
  const card = document.getElementById('praise-card');
  if (card && overlay) {
    card.innerText = msg; overlay.classList.remove('hidden');
    card.style.animation = 'scaleBounce 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    
    // VERBESSERUNG: Bleibt nun 5000ms statt 2800ms auf dem Bildschirm
    setTimeout(() => overlay.classList.add('hidden'), 5000); 
  }

  if (typeof speakWithProfile === 'function') {
    const randomProfileIdx = Math.floor(Math.random() * 12);
    speakWithProfile(msg, randomProfileIdx);
  }

  const soundIdx = getNextFromPool(soundPool, 12);
  playProceduralSound(soundIdx);

  const animIdx = getNextFromPool(animationPool, 10);
  triggerPraiseAnimation(animIdx);
}

// Erzeugt 12 mathematisch unterschiedliche Belohnungsklänge über die Web Audio API
function playProceduralSound(idx = 0) {
  try {
    initAudioContext();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const ctx = audioCtx;

    const playNode = (freq, type, duration, delay = 0, vol = 0.08) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gainNode.gain.setValueAtTime(0, now + delay);
      gainNode.gain.linearRampToValueAtTime(vol, now + delay + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now + delay);
      osc.stop(now + delay + duration + 0.1);
    };

    switch (idx) {
      case 0: // 1. Ascending Major Arpeggio (C4 -> E4 -> G4 -> C5)
        playNode(261.63, 'sine', 0.6, 0);
        playNode(329.63, 'sine', 0.6, 0.07);
        playNode(392.00, 'sine', 0.6, 0.14);
        playNode(523.25, 'sine', 1.0, 0.21, 0.1);
        break;
      case 1: // 2. Kristallklare Resonanzglocke
        playNode(880, 'sine', 1.6, 0, 0.12);
        playNode(1320, 'sine', 0.9, 0.02, 0.04);
        break;
      case 2: // 3. Fanfare (Dreiklang-Swell)
        playNode(329.63, 'triangle', 1.2, 0, 0.06); 
        playNode(392.00, 'triangle', 1.2, 0, 0.06); 
        playNode(523.25, 'triangle', 1.2, 0, 0.06); 
        break;
      case 3: // 4. Bubbly Liquid POPs
        playNode(550, 'sine', 0.12, 0);
        playNode(780, 'sine', 0.10, 0.05);
        playNode(1050, 'sine', 0.08, 0.10);
        break;
      case 4: // 5. Cosmic Shimmer Sweep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.7);
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(320, now);
        filter.frequency.exponentialRampToValueAtTime(1600, now + 0.7);
        filter.Q.setValueAtTime(6, now);
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
        break;
      case 5: // 6. Jazz Major 7th Warm Swell
        playNode(196.00, 'sine', 1.8, 0, 0.1); 
        playNode(246.94, 'sine', 1.8, 0.04, 0.08); 
        playNode(293.66, 'sine', 1.8, 0.08, 0.06); 
        playNode(370.00, 'sine', 1.8, 0.12, 0.05); 
        break;
      case 6: // 7. Retro 8-bit Coin Up
        playNode(523.25, 'square', 0.08, 0, 0.04);
        playNode(1046.50, 'square', 0.35, 0.06, 0.04);
        break;
      case 7: // 8. Zen Wind Chimes
        playNode(1150, 'sine', 1.5, 0, 0.05);
        playNode(1350, 'sine', 1.3, 0.15, 0.04);
        playNode(1550, 'sine', 1.1, 0.3, 0.04);
        break;
      case 8: // 9. Bass Thump & Echo
        playNode(65.41, 'sine', 0.5, 0, 0.22); 
        playNode(130.81, 'sine', 0.8, 0.10, 0.08); 
        break;
      case 9: // 10. Harfen-Glissando (Fairy Harp)
        const harpScale = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
        harpScale.forEach((f, i) => {
          playNode(f, 'sine', 0.5, i * 0.04, 0.05);
        });
        break;
      case 10: // 11. Spring Jump Bounce (Boing-Modulator)
        const bOsc = ctx.createOscillator();
        const bGain = ctx.createGain();
        bOsc.type = 'triangle';
        bOsc.frequency.setValueAtTime(140, now);
        bOsc.frequency.linearRampToValueAtTime(420, now + 0.28);
        bOsc.frequency.linearRampToValueAtTime(95, now + 0.55);
        
        bGain.gain.setValueAtTime(0.1, now);
        bGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
        
        bOsc.connect(bGain);
        bGain.connect(ctx.destination);
        bOsc.start(now);
        bOsc.stop(now + 0.6);
        break;
      case 11: // 12. Tribal Woodblock Sequence
        playNode(440, 'triangle', 0.06, 0, 0.12);
        playNode(554, 'triangle', 0.06, 0.07, 0.10);
        playNode(659, 'triangle', 0.06, 0.14, 0.08);
        playNode(880, 'triangle', 0.10, 0.21, 0.12);
        break;
    }
  } catch (e) {
    console.error("Fehler beim prozeduralen Sound:", e);
  }
}


// Interaktiver Logo-Klick-Effekt mit Wellen-Ausbreitung und Sound
function triggerLogoReloadFlow(element) {
  if (!element) {
    location.reload();
    return;
  }
  
  // 1. Visuelle Klick-Animation auf dem Logo auslösen
  element.classList.add('logo-clicked-flow');

  // 2. Bubbly Liquid Sound abspielen
  try {
    playProceduralSound(3);
  } catch (e) {}

  // 3. Vollbild-Wellen-Ripple erzeugen
  const ripple = document.createElement('div');
  const rect = element.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  ripple.style.position = 'fixed';
  ripple.style.left = `${x - 50}px`;
  ripple.style.top = `${y - 50}px`;
  ripple.style.width = '100px';
  ripple.style.height = '100px';
  ripple.style.borderRadius = '50%';
  ripple.style.pointerEvents = 'none';
  ripple.style.zIndex = '999999';
  ripple.style.background = 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, rgba(20,184,166,0.2) 50%, rgba(16,185,129,0) 80%)';
  ripple.style.transform = 'scale(0)';
  ripple.style.transition = 'transform 0.75s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.75s ease-out';
  ripple.style.opacity = '1';

  document.body.appendChild(ripple);

  requestAnimationFrame(() => {
    ripple.style.transform = 'scale(45)';
    ripple.style.opacity = '0';
  });

  // 4. Nach Abschluss der Animation Seite neu laden
  setTimeout(() => {
    location.reload();
  }, 680);
}


// ==========================================
// INTERAKTIVES PAUSEN- & TIMER-MODAL SYSTEM
// ==========================================

const BREAK_CONFIGS = {
  breath: {
    title: 'Atemtakt-Übung 🧘‍♀️',
    subtitle: '4-4-4 Atmen zur Tiefenentspannung',
    desc: 'Atme 4 Sekunden tief ein, halte 4 Sekunden inne, und atme 4 Sekunden sanft aus. Finde deine innere Ruhe.',
    duration: 120,
    icon: 'wind'
  },
  box: {
    title: 'Box-Breathing (Atembox) 📦',
    subtitle: 'Strukturierte Vierfach-Atmung',
    desc: 'Bewährte Methode von Profis und Astronauten: Einatmen, Halten, Ausatmen, Halten – jeweils im 4-Sekunden-Takt.',
    duration: 180,
    icon: 'box'
  },
  anchor: {
    title: 'Erdungs-Anker ⚓',
    subtitle: '5-4-3-2-1 Achtsamkeits-Übung',
    desc: 'Nimm bewusst deine Umgebung wahr: 5 Dinge sehen, 4 spüren, 3 hören, 2 riechen, 1 schmecken.',
    duration: 180,
    icon: 'anchor'
  },
  eyes: {
    title: 'Augen-Entspannung (Palming) 👀',
    subtitle: 'Wärme für gestresste Bildschirm-Augen',
    desc: 'Reibe deine Hände aneinander, bis sie warm sind, und lege sie sanft und ohne Druck auf deine geschlossenen Augen.',
    duration: 60,
    icon: 'eye'
  },
  stretch: {
    title: 'Schneller Ganzkörper-Stretch 🧘',
    subtitle: 'Muskeln lockern & Energie tanken',
    desc: 'Strecke die Arme weit nach oben, kreise die Schultern und bewege deinen Nacken ganz behutsam von Seite zu Seite.',
    duration: 60,
    icon: 'dumbbell'
  },
  squeeze: {
    title: 'Nacken- & Schulter-Squeeze 🏋️',
    subtitle: 'Anspannen & bewusst loslassen',
    desc: 'Ziehe deine Schultern für 5 Sekunden fest zu den Ohren hoch – und lass sie beim Ausatmen schlagartig und schwer sinken.',
    duration: 60,
    icon: 'shield'
  },
  tea: {
    title: '5-Minuten Teepause ☕',
    subtitle: 'Bewusste Genuss-Auszeit',
    desc: 'Hole dir ein Glas Wasser oder Tee. Schlürfe langsam und spüre ganz bewusst die Wärme und den Geschmack.',
    duration: 300,
    icon: 'coffee'
  },
  nature: {
    title: 'Wald-Auszeit (Vogelstimmen) 🐦',
    subtitle: 'Akustischer Rückzug ins Grün',
    desc: 'Schließe die Augen, lausche den inneren Naturklängen und stelle dir vor, du sitzt auf einer ruhigen Lichtung im Wald.',
    duration: 180,
    icon: 'trees'
  }
};

let currentBreakId = null;
let breakTotalSecs = 120;
let breakRemainingSecs = 120;
let breakTimerInterval = null;
let isBreakRunning = false;

function openBreakModal(breakId) {
  const config = BREAK_CONFIGS[breakId] || BREAK_CONFIGS.breath;
  currentBreakId = breakId;
  breakTotalSecs = config.duration;
  breakRemainingSecs = config.duration;
  isBreakRunning = false;
  if (breakTimerInterval) clearInterval(breakTimerInterval);

  const titleEl = document.getElementById('break-modal-title');
  const subEl = document.getElementById('break-modal-subtitle');
  const descEl = document.getElementById('break-modal-desc');
  
  if (titleEl) titleEl.innerText = config.title;
  if (subEl) subEl.innerText = config.subtitle;
  if (descEl) descEl.innerText = config.desc;
  
  const iconEl = document.getElementById('break-modal-lucide');
  if (iconEl) {
    iconEl.setAttribute('data-lucide', config.icon);
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  }

  updateBreakTimerDisplay();

  const modal = document.getElementById('helper-break-modal');
  if (modal) modal.classList.remove('hidden');

  const panel = document.getElementById('panel-pause-dropdown');
  if (panel) panel.classList.add('hidden');
}

function closeBreakModal() {
  if (breakTimerInterval) clearInterval(breakTimerInterval);
  isBreakRunning = false;
  const modal = document.getElementById('helper-break-modal');
  if (modal) modal.classList.add('hidden');
}


function toggleBreakTimer() {
  const toggleBtn = document.getElementById('break-toggle-btn');
  
  if (isBreakRunning) {
    clearInterval(breakTimerInterval);
    isBreakRunning = false;
    if (toggleBtn) toggleBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4"></i> <span id="break-toggle-label">Fortsetzen</span>';
  } else {
    isBreakRunning = true;
    if (toggleBtn) toggleBtn.innerHTML = '<i data-lucide="pause" class="w-4 h-4"></i> <span id="break-toggle-label">Pause</span>';
    
    breakTimerInterval = setInterval(() => {
      if (breakRemainingSecs > 0) {
        breakRemainingSecs--;
        updateBreakTimerDisplay();
      } else {
        clearInterval(breakTimerInterval);
        isBreakRunning = false;
        finishBreakSuccessfully();
      }
    }, 1000);
  }
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  updateBreakTimerDisplay();
}

function resetBreakTimer() {
  if (breakTimerInterval) clearInterval(breakTimerInterval);
  isBreakRunning = false;
  const config = BREAK_CONFIGS[currentBreakId] || BREAK_CONFIGS.breath;
  breakRemainingSecs = config.duration;
  updateBreakTimerDisplay();
  const toggleBtn = document.getElementById('break-toggle-btn');
  if (toggleBtn) toggleBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4"></i> <span id="break-toggle-label">Pause starten</span>';
  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

function finishBreakEarly() {
  if (breakTimerInterval) clearInterval(breakTimerInterval);
  isBreakRunning = false;
  finishBreakSuccessfully();
}

function finishBreakSuccessfully() {
  if (typeof playProceduralSound === 'function') {
    try { playProceduralSound(0); } catch(e){}
  }
  if (typeof triggerConfetti === 'function') {
    try { triggerConfetti(); } catch(e){}
  }
  if (typeof showToast === 'function') {
    showToast(tr({
      de: 'Wunderbare Pause abgeschlossen! Du hast neue Energie getankt. 🌿✨',
      en: 'Wonderful break completed! You recharged your energy. 🌿✨',
      es: '¡Pausa maravillosa completada! Has recargado energía. 🌿✨'
    }));
  }
  closeBreakModal();
}

function updateBreakTimerDisplay() {
  const mins = Math.floor(breakRemainingSecs / 60);
  const secs = breakRemainingSecs % 60;
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  
  const timerEl = document.getElementById('break-timer-display');
  if (timerEl) timerEl.innerText = display;

  const pct = ((breakTotalSecs - breakRemainingSecs) / breakTotalSecs) * 100;
  const barEl = document.getElementById('break-progress-bar');
  if (barEl) barEl.style.width = `${pct}%`;

  const statusEl = document.getElementById('break-status-text');
  if (statusEl) {
    if (breakRemainingSecs === breakTotalSecs) {
      statusEl.innerText = 'Bereit';
    } else if (isBreakRunning) {
      statusEl.innerText = 'Atmen & Entspannen... 🧘';
    } else {
      statusEl.innerText = 'Pausiert';
    }
  }
}


// ==========================================
// KOSTENLOSES GERÄTE-SYNC & ANMELDEN SYSTEM
// ==========================================

function openSyncModal() {
  const modal = document.getElementById('helper-sync-modal');
  if (modal) modal.classList.remove('hidden');

  const savedName = localStorage.getItem('flow_sync_profile_name') || 'Mein Flow-Gerät';
  const savedCode = localStorage.getItem('flow_sync_passphrase') || 'flow-' + Math.random().toString(36).substring(2, 8);
  
  const nameInput = document.getElementById('sync-profile-name-input');
  const codeInput = document.getElementById('sync-passphrase-input');
  if (nameInput) nameInput.value = savedName;
  if (codeInput && !codeInput.value) codeInput.value = savedCode;

  const statusText = document.getElementById('sync-user-status-text');
  const isLoggedIn = localStorage.getItem('flow_sync_logged_in') === 'true';
  if (statusText) {
    statusText.innerText = isLoggedIn ? `Angemeldet als "${savedName}" (Kostenlos aktiv 🔒)` : 'Als Gast auf diesem Gerät aktiv';
  }

  const panel = document.getElementById('panel-sync');
  if (panel) panel.classList.add('hidden');

  if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
}

function closeSyncModal() {
  const modal = document.getElementById('helper-sync-modal');
  if (modal) modal.classList.add('hidden');
}

function generateSyncPassphrase() {
  const codeInput = document.getElementById('sync-passphrase-input');
  if (codeInput) {
    const randomCode = 'flow-' + Math.random().toString(36).substring(2, 9) + '-' + Math.random().toString(36).substring(2, 6);
    codeInput.value = randomCode;
    if (typeof showToast === 'function') {
      showToast('Neuer geheimer Sync-Code generiert! 🔑');
    }
  }
}

function exportDataForSync() {
  const nameInput = document.getElementById('sync-profile-name-input');
  const codeInput = document.getElementById('sync-passphrase-input');
  
  const profileName = nameInput ? nameInput.value.trim() : 'Mein Flow-Gerät';
  const passphrase = codeInput ? codeInput.value.trim() : '';

  localStorage.setItem('flow_sync_profile_name', profileName);
  localStorage.setItem('flow_sync_passphrase', passphrase);
  localStorage.setItem('flow_sync_logged_in', 'true');

  const appState = {
    profile: profileName,
    passphrase: passphrase,
    timestamp: new Date().toISOString(),
    tasks: typeof tasks !== 'undefined' ? tasks : [],
    completedToday: typeof completedToday !== 'undefined' ? completedToday : 0,
    storeState: localStorage.getItem('flowPlannerState') || '{}'
  };

  const jsonString = JSON.stringify(appState);
  const syncToken = btoa(encodeURIComponent(jsonString));

  navigator.clipboard.writeText(syncToken).then(() => {
    if (typeof showToast === 'function') {
      showToast('Sync-Code in Zwischenablage kopiert! 📋 Auf anderem Gerät einfügen.');
    }
    const statusText = document.getElementById('sync-user-status-text');
    if (statusText) statusText.innerText = `Angemeldet als "${profileName}" (Sync aktiv 🔒)`;
  }).catch(() => {
    prompt('Dein kostenloser Sync-Code:', syncToken);
  });
}

function importDataFromSync() {
  const token = prompt('Bitte füge hier den Sync-Code von deinem anderen Gerät ein:');
  if (!token || !token.trim()) return;

  try {
    const jsonString = decodeURIComponent(atob(token.trim()));
    const data = JSON.parse(jsonString);

    if (data && data.tasks) {
      if (typeof tasks !== 'undefined') {
        tasks = data.tasks;
      }
      if (data.storeState) {
        localStorage.setItem('flowPlannerState', data.storeState);
      }
      if (typeof saveState === 'function') saveState();
      if (typeof renderApp === 'function') renderApp();

      if (typeof showToast === 'function') {
        showToast('Erfolgreich mit anderem Gerät synchronisiert! 🎉');
      }
      if (typeof triggerConfetti === 'function') triggerConfetti();
      closeSyncModal();
    } else {
      alert('Ungültiger Sync-Code.');
    }
  } catch (e) {
    alert('Fehler beim Einlesen des Sync-Codes. Bitte überprüfe die Eingabe.');
  }
}

// Führt 10 verschiedene visuelle Belohnungs-Animationen aus

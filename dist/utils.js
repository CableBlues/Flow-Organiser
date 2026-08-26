// utils.js Teil 1/2: State, Toast/Konfetti/Praise-Anzeige, Sound-Effekte

// XSS-Schutz: Sichere HTML-Maskierung für Benutzereingaben
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  if (typeof str !== 'string') str = String(str);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
window.escapeHtml = escapeHtml;

// Zentraler Panel-Manager (für Dropdowns & Werkzeug-Panels)
const PanelManager = {
  panels: ['feedback', 'report', 'settings', 'soundscape', 'language', 'boost', 'music', 'theme', 'calendar-dropdown', 'inspiration', 'shopping', 'cooking', 'alarm', 'weather', 'news', 'pause-dropdown', 'logo-guide'],
  open(name) {
    this.panels.forEach(p => {
      const el = document.getElementById(`panel-${p}`);
      if (el) {
        if (p === name) el.classList.remove('hidden');
        else el.classList.add('hidden');
      }
    });
    window.currentlyOpenPanel = name;
  },
  close(name) {
    const el = document.getElementById(`panel-${name}`);
    if (el) el.classList.add('hidden');
    if (window.currentlyOpenPanel === name) window.currentlyOpenPanel = null;
  },
  closeAll() {
    this.panels.forEach(p => {
      const el = document.getElementById(`panel-${p}`);
      if (el) el.classList.add('hidden');
    });
    window.currentlyOpenPanel = null;
  },
  toggle(name) {
    const el = document.getElementById(`panel-${name}`);
    if (!el) return;
    if (el.classList.contains('hidden')) this.open(name);
    else this.close(name);
  }
};
window.PanelManager = PanelManager;

// Zentraler Modal-Manager (für Dialoge & Overlays)
const ModalManager = {
  modals: ['helper-whatnow-modal', 'helper-sport-modal', 'clarity-modal', 'feierabend-modal', 'game-mode-container', 'mobile-menu-drawer', 'mobile-tools-sheet'],
  open(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  },
  close(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  },
  closeAll() {
    this.modals.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
  }
};
window.ModalManager = ModalManager;

// Globaler Escape-Key Handler
if (typeof document !== 'undefined') {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      PanelManager.closeAll();
      ModalManager.closeAll();
    }
  });
}

function renderLucideIcons() {
  if (typeof lucide === 'undefined' || !lucide.createIcons) {
    if (typeof window !== 'undefined') {
      [50, 150, 350, 800, 1500].forEach(delay => {
        setTimeout(() => {
          if (typeof lucide !== 'undefined' && lucide.createIcons) {
            try { lucide.createIcons(); } catch(e) {}
          }
        }, delay);
      });
    }
    return;
  }
  try {
    lucide.createIcons();
  } catch (e) {
    console.warn('[Lucide] Batch createIcons notice:', e);
    // Fallback: Einzel-Element-Verarbeitung, damit ein einzelner fehlerhafter Icon-Name nicht alle anderen blockiert
    try {
      const iconNodes = document.querySelectorAll('[data-lucide]');
      iconNodes.forEach(node => {
        const name = node.getAttribute('data-lucide');
        if (!name) return;
        try {
          if (lucide.icons && lucide.icons[name]) {
            const svg = lucide.icons[name].toSvg({ class: node.className });
            node.outerHTML = svg;
          }
        } catch(err) {}
      });
    } catch(err2) {}
  }
}
window.renderLucideIcons = renderLucideIcons;

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

let _toastHideTimer = null;
function showToast(msg, options = {}) {
  const overlay = document.getElementById('toast-overlay');
  const card = document.getElementById('toast-card');
  if (!card || !overlay) return;
  
  clearTimeout(_toastHideTimer);
  
  if (options && options.undo) {
    const undoText = (typeof tr === 'function') 
      ? tr({ de: 'Rückgängig ↩️', en: 'Undo ↩️', fr: 'Annuler ↩️', it: 'Annulla ↩️', es: 'Deshacer ↩️', el: 'Αναίρεση ↩️' })
      : 'Rückgängig ↩️';
    card.innerHTML = `
      <div class="flex items-center justify-between gap-3">
        <span>${msg}</span>
        <button id="toast-undo-btn" class="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1 border border-white/25 shadow-sm shrink-0">
          <span>${undoText}</span>
        </button>
      </div>
    `;
    const undoBtn = card.querySelector('#toast-undo-btn');
    if (undoBtn) {
      undoBtn.onclick = (e) => {
        e.stopPropagation();
        overlay.classList.add('hidden');
        if (typeof undoLastAction === 'function') undoLastAction();
      };
    }
    overlay.classList.remove('hidden');
    _toastHideTimer = setTimeout(() => overlay.classList.add('hidden'), options.duration || 5000);
  } else {
    card.innerText = msg;
    overlay.classList.remove('hidden');
    _toastHideTimer = setTimeout(() => overlay.classList.add('hidden'), options.duration || 2200);
  }
}

// Integrierte performante Canvas-Celebration-Engine mit 5 wechselnden Partikel-Effekten
let celebrationParticleIndex = 0;

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  let step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;
    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

function triggerCelebrationParticles(customX, customY) {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const effectType = celebrationParticleIndex % 5;
  celebrationParticleIndex++;

  const startX = (typeof customX === 'number' && customX > 0) ? customX : canvas.width / 2;
  const startY = (typeof customY === 'number' && customY > 0) ? customY : (effectType === 3 ? canvas.height * 0.85 : canvas.height * 0.45);

  const particles = [];
  const particleCount = effectType === 3 ? 45 : 85; // Ballons etwas weniger, sonst zu voll

  const colorPalettes = {
    0: ['#8b5cf6', '#38bdf8', '#10b981', '#ec4899', '#f59e0b', '#fb7185', '#facc15'], // Konfetti
    1: ['#f472b6', '#fbcfe8', '#fb7185', '#fda4af', '#f43f5e', '#fff1f2', '#e879f9'], // Sakura-Blüten
    2: ['#facc15', '#fde047', '#fef08a', '#fbbf24', '#f59e0b', '#ffffff', '#e2e8f0'], // Goldene Sterne
    3: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'], // Bunte Ballons
    4: ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#67e8f9', '#a7f3d0', '#fde047']  // Schillernde Seifenblasen
  };
  const colors = colorPalettes[effectType];

  for (let i = 0; i < particleCount; i++) {
    let vx = (Math.random() - 0.5) * (effectType === 3 ? 10 : 22);
    let vy = effectType === 3 
      ? -(Math.random() * 8 + 6) // Ballons steigen nach oben
      : ((Math.random() - 0.5) * 20 - 10);

    particles.push({
      x: startX + (Math.random() - 0.5) * 60,
      y: startY + (Math.random() - 0.5) * 40,
      vx: vx,
      vy: vy,
      gravity: effectType === 3 ? -0.06 : (effectType === 1 ? 0.22 : 0.42),
      friction: effectType === 3 ? 0.99 : 0.975,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: effectType === 3 ? Math.random() * 12 + 14 : (effectType === 1 ? Math.random() * 8 + 6 : Math.random() * 8 + 4),
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * (effectType === 3 ? 2 : 10),
      opacity: 1,
      sway: Math.random() * 10,
      swaySpeed: Math.random() * 0.08 + 0.03
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    particles.forEach(p => {
      if (p.opacity > 0 && p.y > -80 && p.y < canvas.height + 80) {
        p.sway += p.swaySpeed;
        p.x += p.vx + Math.sin(p.sway) * (effectType === 1 ? 1.5 : 0.6);
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.friction;
        p.opacity -= (effectType === 3 ? 0.007 : 0.011);
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);

        if (effectType === 0) {
          // 1. Konfetti (Rechteckig)
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else if (effectType === 1) {
          // 2. Sakura-Blütenblatt (Geschwungene Blüte)
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
          ctx.fill();
        } else if (effectType === 2) {
          // 3. Sterne (Gold/Funkeln)
          ctx.fillStyle = p.color;
          drawStar(ctx, 0, 0, 5, p.size, p.size * 0.5);
        } else if (effectType === 3) {
          // 4. Bunte Mini-Ballons
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.75, p.size, 0, 0, Math.PI * 2);
          ctx.fill();
          // Schnur
          ctx.strokeStyle = 'rgba(255,255,255,0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, p.size);
          ctx.lineTo(Math.sin(p.sway) * 4, p.size + 14);
          ctx.stroke();
        } else if (effectType === 4) {
          // 5. Schillernde Seifenblasen
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          ctx.fillStyle = 'rgba(255,255,255,0.06)';
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Lichtglanz
          ctx.fillStyle = 'rgba(255,255,255,0.6)';
          ctx.beginPath();
          ctx.arc(-p.size * 0.35, -p.size * 0.35, p.size * 0.25, 0, Math.PI * 2);
          ctx.fill();
        }

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

function triggerConfetti(x, y) {
  triggerCelebrationParticles(x, y);
}
window.triggerCelebrationParticles = triggerCelebrationParticles;
window.triggerConfetti = triggerConfetti;


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

let lastProceduralSoundIndex = -1;

// Erzeugt 12 mathematisch unterschiedliche Belohnungsklänge über die Web Audio API (wechselt zufällig)
function playProceduralSound(idx = null) {
  try {
    initAudioContext();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const ctx = audioCtx;

    // Wenn kein Index übergeben oder 'random', wechsle zufällig ohne direkte Wiederholung
    if (idx === null || idx === undefined || idx === 'random') {
      do {
        idx = Math.floor(Math.random() * 12);
      } while (idx === lastProceduralSoundIndex && 12 > 1);
    }
    lastProceduralSoundIndex = idx;

    const playNode = (freq, type, duration, delay = 0, vol = 0.08) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gainNode.gain.setValueAtTime(0, now + delay);
      gainNode.gain.linearRampToValueAtTime(vol, now + delay + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);
      
      osc.connect(gainNode);
      const dest = typeof getMasterAudioDestination === 'function' ? getMasterAudioDestination() : ctx.destination;
      if (dest) gainNode.connect(dest);
      
      osc.start(now + delay);
      osc.stop(now + delay + duration + 0.1);
      if (typeof activeNodes !== 'undefined') activeNodes.push(osc);
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
  },
  nap: {
    title: 'Power Nap (20 Min) 😴',
    subtitle: 'Kurzschlaf zur Regeneration',
    desc: 'Schließe die Augen, entspanne deinen Körper und gleite für 20 Minuten in einen erholsamen Kurzschlaf.',
    duration: 1200,
    icon: 'bed'
  }
};

let currentBreakId = null;
let breakTotalSecs = 120;
let breakRemainingSecs = 120;
let breakTimerInterval = null;
let isBreakRunning = false;

function triggerPowerNap() {
  openBreakModal('nap');
}

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
    renderLucideIcons();
  }

  updateBreakTimerDisplay();

  const modal = document.getElementById('helper-break-modal');
  if (modal) modal.classList.remove('hidden');

  const panel = document.getElementById('panel-pause-dropdown');
  if (panel) panel.classList.add('hidden');
}

function closeBreakModal() {
  if (breakTimerInterval) clearInterval(breakTimerInterval);
  breakTimerInterval = null;
  isBreakRunning = false;
  breakTargetEndTime = null;
  const modal = document.getElementById('helper-break-modal');
  if (modal) modal.classList.add('hidden');
}

let breakTargetEndTime = null;

function toggleBreakTimer() {
  const toggleBtn = document.getElementById('break-toggle-btn');
  
  if (isBreakRunning) {
    if (breakTimerInterval) clearInterval(breakTimerInterval);
    breakTimerInterval = null;
    isBreakRunning = false;
    breakTargetEndTime = null;
    if (toggleBtn) toggleBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4"></i> <span id="break-toggle-label">Fortsetzen</span>';
  } else {
    isBreakRunning = true;
    breakTargetEndTime = Date.now() + (breakRemainingSecs * 1000);
    if (toggleBtn) toggleBtn.innerHTML = '<i data-lucide="pause" class="w-4 h-4"></i> <span id="break-toggle-label">Pause</span>';
    
    if (breakTimerInterval) clearInterval(breakTimerInterval);
    breakTimerInterval = setInterval(() => {
      if (breakTargetEndTime) {
        breakRemainingSecs = Math.max(0, Math.round((breakTargetEndTime - Date.now()) / 1000));
        updateBreakTimerDisplay();
      }
      if (breakRemainingSecs <= 0) {
        if (breakTimerInterval) clearInterval(breakTimerInterval);
        breakTimerInterval = null;
        isBreakRunning = false;
        breakTargetEndTime = null;
        finishBreakSuccessfully();
      }
    }, 1000);
  }
  renderLucideIcons();
  updateBreakTimerDisplay();
}

function resetBreakTimer() {
  if (breakTimerInterval) clearInterval(breakTimerInterval);
  breakTimerInterval = null;
  isBreakRunning = false;
  breakTargetEndTime = null;
  const config = BREAK_CONFIGS[currentBreakId] || BREAK_CONFIGS.breath;
  breakRemainingSecs = config.duration;
  updateBreakTimerDisplay();
  const toggleBtn = document.getElementById('break-toggle-btn');
  if (toggleBtn) toggleBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4"></i> <span id="break-toggle-label">Pause starten</span>';
  renderLucideIcons();
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




/* --- NATIVE MOBILE DRAWER & TOOLS SHEET HANDLERS --- */
function openMobileMenuDrawer() {
  const drawer = document.getElementById('mobile-menu-drawer');
  if (drawer) {
    drawer.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

function closeMobileMenuDrawer() {
  const drawer = document.getElementById('mobile-menu-drawer');
  if (drawer) drawer.classList.add('hidden');
}

function openMobileToolsSheet() {
  const sheet = document.getElementById('mobile-tools-sheet');
  if (sheet) {
    sheet.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

function closeMobileToolsSheet() {
  const sheet = document.getElementById('mobile-tools-sheet');
  if (sheet) sheet.classList.add('hidden');
}

function openPrivacyModal() {
  const modal = document.getElementById('privacy-legal-modal');
  if (modal) {
    modal.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

function closePrivacyModal() {
  const modal = document.getElementById('privacy-legal-modal');
  if (modal) modal.classList.add('hidden');
}

window.openPrivacyModal = openPrivacyModal;
window.closePrivacyModal = closePrivacyModal;



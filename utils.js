// Shuffler-Pools zur vollständigen Absicherung gegen Wiederholungen
let praisePool = [];
let soundPool = [];
let animationPool = [];

const EXTENDED_PRAISES = {
  de: [
    "Hervorragend gemacht!",
    "Spitzenklasse!",
    "Du bist unaufhaltbar!",
    "Ganz starker Fokus!",
    "Du rockst das!",
    "Dein Flow ist sensationell!",
    "Einfach meisterhaft!",
    "Unglaubliche Produktivität!",
    "Das nenne ich Fokus!",
    "Wunderbar erledigt!",
    "Ein gigantischer Schritt nach vorn!",
    "Fantastische Leistung!",
    "Du bist voll in deinem Element!",
    "Unfassbar produktiv!",
    "Dein Einsatz zahlt sich aus!",
    "Phänomenal!",
    "Absolut großartig!",
    "Ein echter Triumph!",
    "Du machst das überragend!",
    "Einfach klasse!",
    "Fokus-Meisterstufe erreicht!",
    "Genialer Erfolg, weiter so!",
    "Das war weltklasse!",
    "Unglaubliche Willensstärke!",
    "Du machst unaufhaltsame Fortschritte!",
    "Wieder ein Haken dran - stark!",
    "Das lief wie geschmiert!",
    "Sehr diszipliniert gelöst!",
    "Dein Fokus is messerscharf!",
    "Hut ab vor dieser Leistung!",
    "Du übertreffst dich selbst!",
    "Perfekt durchgezogen!",
    "Das war pure Meisterleistung!",
    "Wieder einen Schritt näher am Ziel!",
    "So geht Produktivität!",
    "Auf dich ist Verlass!",
    "Hervorragende Arbeit geleistet!",
    "Du bist heute richtig produktiv!",
    "Das war einfach exzellent!",
    "Mit Vollgas voran, super!",
    "Erstklassig gemeistert!",
    "Du beweist echten Kampfgeist!",
    "Da hatte Trägheit keine Chance!",
    "Ein herrlicher Erfolg!",
    "Schritt für Schritt zum Ziel!",
    "Du machst das unglaublich gut!",
    "Dein Durchhaltevermögen inspiriert!",
    "Einfach sensationell fokussiert!",
    "Die Produktivität strömt durch dich!",
    "Du meisterst jede Hürde!",
    "Das war absolut vorbildlich!",
    "Du ziehst das einfach durch, genial!",
    "Richtig gut gemacht!",
    "Wunderbarer Fokus auf das Wesentliche!",
    "Wieder ein großer Erfolg!",
    "Deine Disziplin ist bewundernswert!",
    "Du bist voll auf Erfolgskurs!",
    "Großartige Willenskraft gezeigt!",
    "Du bringst die Dinge zu Ende, stark!",
    "Ein echtes Vorbild an Produktivität!",
    "Du meisterst deinen Tag bravourös!",
    "Fantastisch fokussiert geblieben!",
    "Dein Flow ist heute legendär!",
    "Sehr stark gelöst!",
    "Unschlagbarer Fokus, großartig!"
  ],
  en: [
    "Outstanding job!",
    "Unstoppable progress!",
    "You are rocking this!",
    "Sensational focus!",
    "Phenomenal execution!",
    "Masterfully done!",
    "Incredible productivity!",
    "Your flow is amazing!",
    "Fabulous work!",
    "A giant leap forward!",
    "Stunning performance!",
    "Locked in and killing it!",
    "Absolutely brilliant!",
    "You make this look easy!",
    "Spectacular effort!",
    "Triumphant execution!",
    "Top-tier focus!",
    "Magnificent productivity!",
    "You are in the zone!",
    "Pure greatness!",
    "Focus level maxed out!",
    "Incredible work ethic!",
    "A masterpiece of productivity!",
    "You crushed that task!",
    "Simply magnificent!",
    "Superb discipline shown!",
    "You're building real momentum!",
    "An absolute home run!",
    "Laser-focused and unstoppable!",
    "Flawless execution right there!",
    "Way to get things done!",
    "You are on absolute fire!",
    "Tremendous effort, well done!",
    "Another win in the books!",
    "You are making waves today!",
    "Brilliant drive and focus!",
    "You've completely conquered that!",
    "Pure dedication in action!",
    "Excellent attention to detail!",
    "You are soaring to new heights!",
    "Absolutely outstanding resolve!",
    "A spectacular display of willpower!",
    "You are mastering your day!",
    "Unbelievably good progress!",
    "You keep pushing boundaries!",
    "Masterful display of efficiency!",
    "Your work rate is inspiring!",
    "Beautifully handled!",
    "You did that with absolute style!",
    "Phenomenally focused effort!",
    "Highly impressive productivity!",
    "You make progress look simple!",
    "Truly great determination!",
    "You are steering straight to success!",
    "Nothing can hold you back!",
    "Magnificent execution once again!",
    "You are owning this day!",
    "Incredible perseverance!",
    "First-class work done!",
    "Your flow state is unmatched!",
    "You are executing at the highest level!",
    "Superb drive and focus today!",
    "You made light work of that!",
    "Outstanding grit and discipline!",
    "You are a focus legend!"
  ]
};

// Hilfsfunktion: Liefert den nächsten nicht-wiederholenden Index
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
  const list = EXTENDED_PRAISES[lang] || EXTENDED_PRAISES['de'];
  
  const praiseIdx = getNextFromPool(praisePool, list.length);
  const msg = list[praiseIdx];

  const overlay = document.getElementById('praise-overlay');
  const card = document.getElementById('praise-card');
  if (card && overlay) {
    card.innerText = msg; overlay.classList.remove('hidden');
    card.style.animation = 'scaleBounce 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    setTimeout(() => overlay.classList.add('hidden'), 2800); 
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

// Führt 10 verschiedene visuelle Belohnungs-Animationen aus
function triggerPraiseAnimation(idx) {
  switch (idx) {
    case 0: // 1. Konfetti-Explosion
      triggerConfetti();
      break;
    case 1: // 2. Intensiveres Bildschirmwackeln & Skalierungs-Pop
      document.body.classList.add('animate-screen-shake');
      document.body.style.transform = 'scale(1.025)';
      setTimeout(() => {
        document.body.classList.remove('animate-screen-shake');
        document.body.style.transform = 'none';
      }, 450);
      break;
    case 2: // 3. Randglühen-Flash (Full Overlay)
      const flash = document.createElement('div');
      flash.className = 'fixed inset-0 z-[190000] pointer-events-none animate-glow-flash';
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 1200);
      break;
    case 3: // 4. Floating Emoji Rain (Thumbs up / Popper)
      const emojis = ['👍', '🎉', '✔️', '🚀', '🔥', '💪', '🧠', '🎈', '🤩'];
      for (let i = 0; i < 16; i++) {
        const el = document.createElement('div');
        el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        el.className = 'fixed text-4xl z-[190000] pointer-events-none animate-float-item select-none';
        el.style.left = `${Math.random() * 90 + 5}vw`;
        el.style.animationDelay = `${Math.random() * 0.5}s`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3200);
      }
      break;
    case 4: // 5. Shimmering Dopamine Bubbles (Schillernde Blasen)
      for (let i = 0; i < 35; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'fixed rounded-full pointer-events-none z-[190000]';
        const size = Math.random() * 45 + 15;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6) 0%, rgba(168, 85, 247, 0.15) 40%, rgba(56, 189, 248, 0.45) 80%, rgba(255, 255, 255, 0) 100%)`;
        bubble.style.boxShadow = 'inset 0 0 12px rgba(255, 255, 255, 0.65), 0 4px 15px rgba(56, 189, 248, 0.25)';
        bubble.style.left = `${Math.random() * 100}vw`;
        bubble.style.bottom = `-60px`;
        
        const duration = Math.random() * 2.5 + 2.0;
        bubble.style.transition = `transform ${duration}s cubic-bezier(0.1, 0.8, 0.3, 1), opacity ${duration}s ease-out`;
        document.body.appendChild(bubble);
        
        requestAnimationFrame(() => {
          bubble.style.transform = `translateY(-${window.innerHeight + 120}px) translateX(${(Math.random() - 0.5) * 200}px) scale(1.4)`;
          bubble.style.opacity = '0';
        });
        
        setTimeout(() => bubble.remove(), duration * 1000);
      }
      break;
    case 5: // 6. Säulen-Sprung (Column Jump-Bounce)
      document.querySelectorAll('article').forEach(el => {
        el.classList.add('animate-spring-bounce');
        setTimeout(() => el.classList.remove('animate-spring-bounce'), 600);
      });
      break;
    case 6: // 7. Regenbogen-Fluss (Rainbow Sweep)
      const sweep = document.createElement('div');
      sweep.className = 'fixed inset-0 z-[190000] pointer-events-none animate-rainbow-sweep';
      document.body.appendChild(sweep);
      setTimeout(() => sweep.remove(), 1400);
      break;
    case 7: // 8. Sternschnuppen-Staub (Meteor-Shower)
      for (let i = 0; i < 22; i++) {
        const spark = document.createElement('div');
        spark.className = 'fixed w-2 h-2 rounded-full z-[190000] pointer-events-none animate-dust';
        spark.style.backgroundColor = i % 2 === 0 ? '#10b981' : '#a855f7';
        spark.style.left = `${Math.random() * 100}vw`;
        spark.style.top = `0px`;
        spark.style.animationDelay = `${Math.random() * 0.4}s`;
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 1500);
      }
      break;
    case 8: // 9. Floating Text Pop (Schwebender Fokus-Ausruf)
      const pop = document.createElement('div');
      const words = currentLang === 'de' ? ["KLASSE!", "FLOW!", "PRODUKTIV!", "FOKUS!", "STARK!"] : ["GREAT!", "FLOW!", "DOPAMINE!", "FOCUS!", "BOOM!"];
      pop.innerText = words[Math.floor(Math.random() * words.length)];
      pop.className = 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl md:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 z-[190000] pointer-events-none scale-0 opacity-0 transition-all duration-700 select-none';
      pop.style.textShadow = '0 10px 30px rgba(139,92,246,0.3)';
      document.body.appendChild(pop);
      requestAnimationFrame(() => {
        pop.style.transform = 'translate(-50%, -85%) scale(1.2)';
        pop.style.opacity = '1';
      });
      setTimeout(() => {
        pop.style.opacity = '0';
        setTimeout(() => pop.remove(), 700);
      }, 1100);
      break;
    case 9: // 10. Diagonal Lens Flare Sweep (Laser-Blitz)
      const flare = document.createElement('div');
      flare.className = 'fixed inset-0 z-[190000] pointer-events-none bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full transition-transform duration-700 ease-out';
      document.body.appendChild(flare);
      requestAnimationFrame(() => {
        flare.style.transform = 'translateX(200%)';
      });
      setTimeout(() => flare.remove(), 800);
      break;
  }
}

function renderMiniCalendar() {
  const grid = document.getElementById('cal-days-grid');
  const title = document.getElementById('cal-month-title');
  if (!grid || !title) return;

  grid.innerHTML = '';
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const locales = { de: 'de-DE', en: 'en-US', el: 'el-GR', es: 'es-ES' };
  const monthName = new Intl.DateTimeFormat(locales[currentLang] || 'en-US', { month: 'long', year: 'numeric' }).format(now);
  title.innerText = monthName;

  const firstDayOfMonth = new Date(year, month, 1);
  let firstDayIndex = firstDayOfMonth.getDay();
  firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDayIndex; i++) {
    const empty = document.createElement('span');
    empty.className = 'text-transparent select-none';
    empty.innerText = '';
    grid.appendChild(empty);
  }

  const todayDate = now.getDate();
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();

  for (let day = 1; day <= daysInMonth; day++) {
    const daySpan = document.createElement('span');
    daySpan.innerText = day;
    
    const isToday = day === todayDate && month === todayMonth && year === todayYear;
    if (isToday) {
      daySpan.className = 'flex items-center justify-center h-5 w-5 bg-[var(--accent)] text-white font-bold rounded-lg shadow-[0_0_8px_rgba(139,92,246,0.5)] border border-[var(--accent-light)]/20 animate-pulse';
    } else {
      daySpan.className = 'flex items-center justify-center h-5 w-5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-all duration-150';
    }
    
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayAppointments = (state.items && state.items.termine) 
      ? state.items.termine.filter(t => t.date === dateStr) 
      : [];
      
    if (dayAppointments.length > 0) {
      daySpan.className += ' border border-amber-400/40 relative shadow-[0_0_10px_rgba(245,158,11,0.15)]';
      
      const dot = document.createElement('span');
      dot.className = 'absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_4px_rgba(245,158,11,0.8)] animate-pulse';
      daySpan.appendChild(dot);
      
      const listStr = dayAppointments.map(t => {
        let loc = t.location ? ` (@ ${t.location})` : '';
        return `${t.time || 'Ganztägig'} · ${t.task}${loc}`;
      }).join('\n');
      daySpan.title = listStr;
    }
    
    grid.appendChild(daySpan);
  }
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

  renderMiniCalendar();
}
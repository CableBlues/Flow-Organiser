// utils.js Teil 2/2: Praise-Animation, Mini-Kalender & Datum/Streak-Update
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
      const words = tr({ de: ["KLASSE!", "FLOW!", "PRODUKTIV!", "FOKUS!", "STARK!"], en: ["GREAT!", "FLOW!", "DOPAMINE!", "FOCUS!", "BOOM!"], es: ["GENIAL!", "FLOW!", "PRODUCTIVO!", "ENFOQUE!", "FUERTE!"], el: ["ΤΕΛΕΙΑ!", "FLOW!", "ΠΑΡΑΓΩΓΙΚΟΣ!", "ΕΣΤΙΑΣΗ!", "ΔΥΝΑΤΑ!"], fr: ["GÉNIAL!", "FLOW!", "PRODUCTIF!", "FOCUS!", "FORT!"], it: ["FANTASTICO!", "FLOW!", "PRODUTTIVO!", "FOCUS!", "FORTE!"] });
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

  const locales = { de: 'de-DE', en: 'en-US', el: 'el-GR', es: 'es-ES', fr: 'fr-FR', it: 'it-IT' };
  const monthName = new Intl.DateTimeFormat(locales[currentLang] || 'en-US', { month: 'long', year: 'numeric' }).format(now);
  title.innerText = monthName;

  const firstDayOfMonth = new Date(year, month, 1);
  let firstDayIndex = firstDayOfMonth.getDay();
  firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDayIndex; i++) {
    const empty = document.createElement('span');
    empty.className = 'text-transparent select-none pointer-events-none';
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
    }

    // Tooltip-Beschriftung: Standardhinweis plus optionale Terminliste, falls vorhanden
    const tooltipAction = tr({ de: "Auf ein Datum klicken, um einen Termin einzutragen", en: "Click on a date to enter an appointment", es: "Haz clic en una fecha para añadir una cita", el: "Κάνε κλικ σε μια ημερομηνία για να καταχωρήσεις ραντεβού", fr: "Clique sur une date pour ajouter un rendez-vous", it: "Clicca su una data per inserire un appuntamento" });

    if (dayAppointments.length > 0) {
      const listStr = dayAppointments.map(t => {
        let loc = t.location ? ` (@ ${t.location})` : '';
        return `${t.time || 'Ganztägig'} · ${t.task}${loc}`;
      }).join('\n');
      daySpan.title = `${tooltipAction}\n\nTermine:\n${listStr}`;
    } else {
      daySpan.title = tooltipAction;
    }

    // Interaktiver Klick-Listener: Öffnet direkt das integrierte Formular
    daySpan.onclick = (e) => {
      e.stopPropagation();
      if (typeof toggleTerminForm === 'function') {
        toggleTerminForm(true, dateStr);
      }
    };
    
    grid.appendChild(daySpan);
  }
}

function updateDateAndStreak() {
  const locales = { de: 'de-DE', en: 'en-GB', el: 'el-GR', es: 'es-ES', fr: 'fr-FR', it: 'it-IT' };
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
 
 

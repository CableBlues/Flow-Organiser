// helper-cleaning.js: Interaktiver Wohnungs-Reset & Level-Putz-Guide für Noodle

const CLEANING_LEVELS_DATA = {
  express: {
    id: 'express',
    title: '15-Minuten Blitz-Reset',
    subtitle: 'Schnelle optische Ordnung & frischer Wohlfühl-Effekt',
    icon: 'zap',
    color: 'amber',
    durationMin: 15,
    badge: 'Express',
    introTip: 'Perfekt für spontanen Besuch oder wenn der Kopf voll ist. Wir fokussieren uns nur auf das, was sofort Ruhe ins Auge bringt!',
    steps: [
      {
        id: 'exp_1',
        title: 'Müll & Leergut-Runde (3 Min)',
        desc: 'Mit einer Mülltüte einmal durch alle Zimmer gehen: Papier, Verpackungen, Flaschen und Leergut direkt einsammeln und in den Mülleimer werfen.',
        why: 'Müll nimmt unbemerkt viel visuellen Raum ein. Wenn er weg ist, wirkt der Raum sofort 50 % aufgeräumter.',
        icon: 'trash-2'
      },
      {
        id: 'exp_2',
        title: 'Geschirr in die Küche bringen (3 Min)',
        desc: 'Alle Tassen, Teller und Gläser von Schreibtisch, Couchtisch und Nachttisch in die Spülmaschine oder Spüle stellen.',
        why: 'Kein stehendes Geschirr = kein Geruch und freie Tische.',
        icon: 'coffee'
      },
      {
        id: 'exp_3',
        title: 'Oberflächen freiräumen (4 Min)',
        desc: 'Dinge, die herumliegen (Klamotten, Kabel, Post), an ihren Platz legen oder kurz im „Verirrte-Dinge-Korb“ sammeln.',
        why: 'Freie Tische und Böden signalisieren dem Gehirn sofortige Entspannung.',
        icon: 'layers'
      },
      {
        id: 'exp_4',
        title: 'Kissen aufschütteln & Decken falten (2 Min)',
        desc: 'Bett kurz glattziehen, Sofakissen aufschütteln und Kuscheldecke ordentlich zusammenlegen.',
        why: 'Kostet nur 1 Minute, lässt Schlaf- und Wohnzimmer aber sofort wie neu aussehen.',
        icon: 'bed-double'
      },
      {
        id: 'exp_5',
        title: '5 Minuten Stoßlüften & Frische-Finish (3 Min)',
        desc: 'Fenster für 3-5 Minuten weit öffnen (Durchzug). Frische Luft hineinlassen – fertig!',
        why: 'Verbrauchte Luft macht müde. Frische Luft bringt neuen Schwung und hebt die Stimmung.',
        icon: 'wind'
      }
    ]
  },
  standard: {
    id: 'standard',
    title: '45-Minuten Standard-Grundreinigung',
    subtitle: 'Alle Kernzonen frisch, sauber & hygienisch',
    icon: 'sparkles',
    color: 'emerald',
    durationMin: 45,
    badge: 'Beliebt',
    introTip: 'Die solide Grundreinigung nach der goldenen Regel: Von oben nach unten, von innen nach außen, trocken vor nass!',
    steps: [
      {
        id: 'std_1',
        title: 'Vorbereitung & Einwirken lassen (5 Min)',
        desc: 'Badreiniger/Kalklöser in Dusche, Waschbecken & WC sprühen. Fettlöser/Spülmittel auf Herd & Küchenspüle geben. NICHT sofort schrubben, sondern einwirken lassen!',
        why: 'Profi-Trick: Der Reiniger zersetzt Kalk und Fett von selbst. Während er wirkt, putzt du woanders – das spart 80 % Kraft!',
        icon: 'spray-can'
      },
      {
        id: 'std_2',
        title: 'Entrümpeln & Müll entsorgen (5 Min)',
        desc: 'Mit Korb und Mülltüte durch alle Räume: Alles an seinen Platz räumen und Müll einsacken.',
        why: 'Putzen auf zugestellten Flächen ist anstrengend. Erst frei räumen, dann wischen.',
        icon: 'trash-2'
      },
      {
        id: 'std_3',
        title: 'Staubwischen & Tische feucht abwischen (10 Min)',
        desc: 'Mit einem leicht feuchten Mikrofasertuch von oben nach unten wischen: Regale, Fensterbänke, Tische, Schreibtisch und Sideboards.',
        why: 'Immer von oben nach unten arbeiten, damit herabfallender Staub später einfach aufgesaugt wird.',
        icon: 'feather'
      },
      {
        id: 'std_4',
        title: 'Küche fertigstellen (7 Min)',
        desc: 'Der Reiniger hat gewirkt: Herd, Arbeitsplatten und Spüle mit gelbem Tuch abwischen, mit Wasser nachspülen und trockenreiben.',
        why: 'Trockenreiben verhindert Wasserflecken und lässt Edelstahl sofort glänzen.',
        icon: 'utensils'
      },
      {
        id: 'std_5',
        title: 'Bad & Sanitär fertigstellen (8 Min)',
        desc: 'Waschbecken, Armaturen und Dusche mit rotem/blauem Tuch abspülen. WC-Bürste durchs WC führen und Toilettensitz desinfizieren/abwischen.',
        why: 'Eigenes Tuch für WC nutzen (Hygiene-Farbleitsystem: Rot = WC!).',
        icon: 'bath'
      },
      {
        id: 'std_6',
        title: 'Böden saugen & Wischen (10 Min)',
        desc: 'Von der hintersten Zimmerecke rückwärts Richtung Flur/Wohnungstür staubsaugen. Bei Hartböden kurz feucht nachwischen und Fenster öffnen.',
        why: 'Wenn du rückwärts Richtung Tür saugst, trittst du nicht auf die frisch geputzte Fläche.',
        icon: 'sparkles'
      }
    ]
  },
  deep: {
    id: 'deep',
    title: '90-Minuten Tiefenreinigung (Deep Clean)',
    subtitle: 'Der komplette Wohlfühl-Reset für die ganze Wohnung',
    icon: 'gem',
    color: 'indigo',
    durationMin: 90,
    badge: 'Intensiv',
    introTip: 'Gönn deiner Wohnung und dir selbst einen echten Neuanfang. Nimm dir ein Kaltgetränk, schalte gute Musik ein und freue dich auf das frischeste Gefühl der Woche!',
    steps: [
      {
        id: 'deep_1',
        title: 'Textilien-Start & Betten abziehen (10 Min)',
        desc: 'Bettwäsche, Handtücher und Badematten abziehen und direkt die Waschmaschine starten. Frische Bettwäsche bereitlegen.',
        why: 'Die Waschmaschine wäscht im Hintergrund, während du den Rest erledigst.',
        icon: 'shirt'
      },
      {
        id: 'deep_2',
        title: 'Kühlschrank & Mülleimer Grundreinigung (15 Min)',
        desc: 'Abgelaufene Lebensmittel aussortieren. Kühlschrank-Fächer kurz auswischen. Mülleimer leeren, mit Spülmittel auswaschen und neue Beutel einsetzen.',
        why: 'Saubere Mülleimer und Kühlschränke neutralisieren 90 % aller Gerüche im Haushalt.',
        icon: 'refrigerator'
      },
      {
        id: 'deep_3',
        title: 'Sanitär & Küche Intensiv-Einwirkzeit (10 Min)',
        desc: 'Kalklöser auf Duschwände, Fliesen und Armaturen sprühen. Backofen/Mikrowelle einsprühen. WC-Reiniger unter den Rand geben.',
        why: 'Lange Einwirkzeit löst hartnäckigen Kalk ganz ohne Schrubben.',
        icon: 'spray-can'
      },
      {
        id: 'deep_4',
        title: 'High & Low Dusting (Spinnweben & Leisten) (15 Min)',
        desc: 'Zuerst Decken-Ecken nach Spinnweben absuchen. Danach Lampen, Bilderrahmen, Monitore, Schalter und Fußleisten feucht abwischen.',
        why: 'Saubere Sockelleisten und Schalter lassen eine Wohnung sofort hochwertig und gepflegt wirken.',
        icon: 'layers'
      },
      {
        id: 'deep_5',
        title: 'Küche & Bad auf Hochglanz polieren (15 Min)',
        desc: 'Duschkabine, Waschbecken, Küchenspüle und Herd abspülen. Spiegel mit Glasreiniger streifenfrei polieren.',
        why: 'Glänzende Spiegel und Armaturen sind das optische Highlight jedes Raumes.',
        icon: 'sparkles'
      },
      {
        id: 'deep_6',
        title: 'Polster & Matratzen absaugen (10 Min)',
        desc: 'Sofa-Ritzen mit der Polsterdüse absaugen. Matratze kurz wenden/absaugen und das frische Bett beziehen.',
        why: 'Entfernt Milben und Staub – herrlich frisches Gefühl beim nächsten Einschlafen.',
        icon: 'bed-double'
      },
      {
        id: 'deep_7',
        title: 'Böden intensiv saugen & feucht wischen (15 Min)',
        desc: 'Gründlich auch unter Sofas und Betten saugen. Danach mit warmem Wasser und Bodenreiniger von hinten nach vorn wischen. 10 Min durchlüften.',
        why: 'Der krönende Abschluss: Der Duft von frischem Bodenwischwasser erfüllt die ganze Wohnung.',
        icon: 'sparkles'
      }
    ]
  }
};

let activeCleaningLevel = 'standard';
let activeCleaningCompletedSteps = {};
let cleaningTimerInterval = null;
let cleaningTimerSecondsLeft = 45 * 60;
let isCleaningTimerRunning = false;
let isCleaningLoFiActive = false;

function openCleaningGuideModal(defaultLevel = null) {
  const modal = document.getElementById('helper-cleaning-modal');
  if (!modal) return;
  
  if (defaultLevel && CLEANING_LEVELS_DATA[defaultLevel]) {
    activeCleaningLevel = defaultLevel;
  }
  
  // Gespeicherten Zustand aus localStorage laden
  try {
    const saved = localStorage.getItem('flow_cleaning_state');
    if (saved) {
      activeCleaningCompletedSteps = JSON.parse(saved);
    }
  } catch (e) {}

  modal.classList.remove('hidden');
  renderCleaningGuideUI();
}

function closeCleaningGuideModal() {
  const modal = document.getElementById('helper-cleaning-modal');
  if (modal) modal.classList.add('hidden');
  pauseCleaningTimer();
}

function switchCleaningLevel(levelKey) {
  if (!CLEANING_LEVELS_DATA[levelKey]) return;
  activeCleaningLevel = levelKey;
  resetCleaningTimer(CLEANING_LEVELS_DATA[levelKey].durationMin * 60);
  renderCleaningGuideUI();
}

function toggleCleaningStep(stepId, event) {
  if (event) event.stopPropagation();
  activeCleaningCompletedSteps[stepId] = !activeCleaningCompletedSteps[stepId];
  
  try {
    localStorage.setItem('flow_cleaning_state', JSON.stringify(activeCleaningCompletedSteps));
  } catch (e) {}
  
  renderCleaningGuideUI();
}

function resetCleaningProgress() {
  const data = CLEANING_LEVELS_DATA[activeCleaningLevel];
  if (!data) return;
  data.steps.forEach(s => {
    delete activeCleaningCompletedSteps[s.id];
  });
  try {
    localStorage.setItem('flow_cleaning_state', JSON.stringify(activeCleaningCompletedSteps));
  } catch (e) {}
  renderCleaningGuideUI();
  if (typeof showToast === 'function') {
    showToast('Fortschritt zurückgesetzt');
  }
}

function renderCleaningGuideUI() {
  const data = CLEANING_LEVELS_DATA[activeCleaningLevel];
  if (!data) return;

  // 1. Level-Tabs stylen
  ['express', 'standard', 'deep'].forEach(lvl => {
    const btn = document.getElementById(`cleaning-tab-btn-${lvl}`);
    if (btn) {
      if (lvl === activeCleaningLevel) {
        btn.className = 'py-2 px-3 rounded-2xl text-white bg-[var(--accent)]/30 border border-[var(--accent)]/60 font-bold transition flex items-center justify-center gap-1.5 shadow-md text-xs cursor-pointer';
      } else {
        btn.className = 'py-2 px-3 rounded-2xl text-gray-400 hover:text-white bg-white/5 border border-white/5 font-medium transition flex items-center justify-center gap-1.5 text-xs cursor-pointer';
      }
    }
  });

  // 2. Header & Intro
  const titleEl = document.getElementById('cleaning-guide-title');
  const subtitleEl = document.getElementById('cleaning-guide-subtitle');
  const tipEl = document.getElementById('cleaning-guide-intro-tip');
  
  if (titleEl) titleEl.innerText = data.title;
  if (subtitleEl) subtitleEl.innerText = data.subtitle;
  if (tipEl) tipEl.innerText = data.introTip;

  // 3. Schritte & Fortschritt berechnen
  const listContainer = document.getElementById('cleaning-guide-steps-list');
  if (!listContainer) return;

  let completedCount = 0;
  listContainer.innerHTML = '';

  data.steps.forEach((step, idx) => {
    const isDone = !!activeCleaningCompletedSteps[step.id];
    if (isDone) completedCount++;

    const card = document.createElement('div');
    card.className = `p-3 sm:p-4 rounded-2xl border transition-all duration-200 ${isDone ? 'bg-emerald-500/10 border-emerald-500/30 opacity-75' : 'bg-white/[0.03] border-white/10 hover:border-white/20'}`;
    
    card.innerHTML = `
      <div class="flex items-start gap-3">
        <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleCleaningStep('${step.id}', event)" class="w-5 h-5 mt-0.5 rounded text-[var(--accent)] cursor-pointer accent-[var(--accent)] shrink-0" />
        <div class="flex-1 space-y-1.5 cursor-pointer" onclick="toggleCleaningStep('${step.id}', event)">
          <div class="flex items-center justify-between gap-2">
            <h4 class="text-xs sm:text-sm font-bold ${isDone ? 'line-through text-emerald-200' : 'text-white'} flex items-center gap-1.5">
              <span class="w-5 h-5 rounded-full bg-white/10 text-[10px] font-mono flex items-center justify-center text-gray-300 font-bold shrink-0">${idx + 1}</span>
              <span>${step.title}</span>
            </h4>
            <span class="text-[10px] px-2 py-0.5 rounded-full ${isDone ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'bg-white/5 text-gray-400'} font-mono shrink-0">
              ${isDone ? '✓ Erledigt' : 'Schritt ' + (idx + 1)}
            </span>
          </div>
          <p class="text-xs text-gray-300 leading-relaxed font-normal">${step.desc}</p>
          <div class="bg-black/40 border border-white/5 p-2 rounded-xl text-[11px] text-amber-200/90 flex items-start gap-2 mt-1">
            <span class="text-amber-400 font-bold shrink-0">💡 Warum:</span>
            <span>${step.why}</span>
          </div>
        </div>
      </div>
    `;
    listContainer.appendChild(card);
  });

  // 4. Fortschrittsbalken aktualisieren
  const total = data.steps.length;
  const pct = Math.round((completedCount / total) * 100);
  const progressBar = document.getElementById('cleaning-progress-bar');
  const progressText = document.getElementById('cleaning-progress-text');
  const progressStatus = document.getElementById('cleaning-progress-status');

  if (progressBar) progressBar.style.width = `${pct}%`;
  if (progressText) progressText.innerText = `${pct}% (${completedCount}/${total})`;
  
  if (progressStatus) {
    if (pct === 100) {
      progressStatus.innerHTML = '<span class="text-emerald-400 font-bold animate-pulse">🎉 Großartig! Deine Wohnung ist komplett erfrischt!</span>';
    } else if (pct >= 50) {
      progressStatus.innerHTML = '<span class="text-amber-300 font-medium">💪 Mehr als die Hälfte geschafft – weiter so!</span>';
    } else if (pct > 0) {
      progressStatus.innerHTML = '<span class="text-purple-300 font-medium">✨ Schöner Start – Schritt für Schritt!</span>';
    } else {
      progressStatus.innerHTML = '<span class="text-gray-400 font-medium">Bereit? Wähle einen Schritt oder starte den Timer!</span>';
    }
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ============================================================================
// TIMER & SOUND STEUERUNG
// ============================================================================
function formatTimeMinSec(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateCleaningTimerDisplay() {
  const display = document.getElementById('cleaning-timer-display');
  if (display) {
    display.innerText = formatTimeMinSec(cleaningTimerSecondsLeft);
  }
}

function startCleaningTimer() {
  if (isCleaningTimerRunning) return;
  isCleaningTimerRunning = true;
  
  const playBtn = document.getElementById('cleaning-timer-play');
  const pauseBtn = document.getElementById('cleaning-timer-pause');
  if (playBtn) playBtn.classList.add('hidden');
  if (pauseBtn) pauseBtn.classList.remove('hidden');

  cleaningTimerInterval = setInterval(() => {
    if (cleaningTimerSecondsLeft > 0) {
      cleaningTimerSecondsLeft--;
      updateCleaningTimerDisplay();
    } else {
      pauseCleaningTimer();
      if (typeof showToast === 'function') {
        showToast('⏰ Zeit abgelaufen! Großartige Arbeit!', { duration: 6000 });
      }
      if (typeof playSoundEffect === 'function') {
        playSoundEffect('success');
      }
    }
  }, 1000);
}

function pauseCleaningTimer() {
  isCleaningTimerRunning = false;
  if (cleaningTimerInterval) {
    clearInterval(cleaningTimerInterval);
    cleaningTimerInterval = null;
  }
  const playBtn = document.getElementById('cleaning-timer-play');
  const pauseBtn = document.getElementById('cleaning-timer-pause');
  if (playBtn) playBtn.classList.remove('hidden');
  if (pauseBtn) pauseBtn.classList.add('hidden');
}

function resetCleaningTimer(newSeconds = null) {
  pauseCleaningTimer();
  if (newSeconds !== null) {
    cleaningTimerSecondsLeft = newSeconds;
  } else {
    const data = CLEANING_LEVELS_DATA[activeCleaningLevel];
    cleaningTimerSecondsLeft = (data ? data.durationMin : 45) * 60;
  }
  updateCleaningTimerDisplay();
}

function toggleCleaningLoFi() {
  if (typeof startAmbientSound === 'function') {
    if (!isCleaningLoFiActive) {
      startAmbientSound('lofi_sunshine');
      isCleaningLoFiActive = true;
      if (typeof showToast === 'function') showToast('🎵 LoFi-Putz-Musik gestartet');
    } else {
      if (typeof stopAmbientSound === 'function') stopAmbientSound();
      isCleaningLoFiActive = false;
      if (typeof showToast === 'function') showToast('🔇 Musik pausiert');
    }
  }
  const lofiBtn = document.getElementById('cleaning-lofi-btn');
  if (lofiBtn) {
    lofiBtn.classList.toggle('text-emerald-400', isCleaningLoFiActive);
    lofiBtn.classList.toggle('border-emerald-500/50', isCleaningLoFiActive);
  }
}

// ============================================================================
// 1-KLICK TRANSFER INS NOODLE BOARD
// ============================================================================
function transferCleaningStepsToBoard(targetCategory = 'weekly') {
  const data = CLEANING_LEVELS_DATA[activeCleaningLevel];
  if (!data) return;

  const curState = (typeof window !== 'undefined' && window.state) ? window.state : state;
  if (!curState || !curState.items) return;

  const cat = (curState.items[targetCategory]) ? targetCategory : 'weekly';
  if (!curState.items[cat]) curState.items[cat] = [];

  let addedCount = 0;
  const nowISO = new Date().toISOString();

  data.steps.forEach((step, idx) => {
    // Falls noch nicht als erledigt markiert
    if (!activeCleaningCompletedSteps[step.id]) {
      const taskText = `🧹 ${step.title.split('(')[0].trim()}`;
      // Prüfen ob bereits vorhanden
      const exists = curState.items[cat].some(item => (typeof item === 'object' ? item.task === taskText : item === taskText));
      if (!exists) {
        curState.items[cat].push({
          id: `clean_${step.id}_${Date.now()}_${idx}`,
          task: taskText,
          createdAt: nowISO,
          updatedAt: nowISO
        });
        addedCount++;
      }
    }
  });

  if (typeof saveState === 'function') saveState();
  if (typeof renderApp === 'function') renderApp();

  closeCleaningGuideModal();
  if (typeof showToast === 'function') {
    showToast(`✨ ${addedCount} Schritte in deine Haushalts-Kategorie übernommen!`);
  }
}

// Globale Bereitstellung
if (typeof window !== 'undefined') {
  window.openCleaningGuideModal = openCleaningGuideModal;
  window.closeCleaningGuideModal = closeCleaningGuideModal;
  window.switchCleaningLevel = switchCleaningLevel;
  window.toggleCleaningStep = toggleCleaningStep;
  window.resetCleaningProgress = resetCleaningProgress;
  window.startCleaningTimer = startCleaningTimer;
  window.pauseCleaningTimer = pauseCleaningTimer;
  window.resetCleaningTimer = resetCleaningTimer;
  window.toggleCleaningLoFi = toggleCleaningLoFi;
  window.transferCleaningStepsToBoard = transferCleaningStepsToBoard;
}
if (typeof globalThis !== 'undefined') {
  globalThis.openCleaningGuideModal = openCleaningGuideModal;
  globalThis.closeCleaningGuideModal = closeCleaningGuideModal;
  globalThis.switchCleaningLevel = switchCleaningLevel;
  globalThis.toggleCleaningStep = toggleCleaningStep;
  globalThis.resetCleaningProgress = resetCleaningProgress;
  globalThis.startCleaningTimer = startCleaningTimer;
  globalThis.pauseCleaningTimer = pauseCleaningTimer;
  globalThis.resetCleaningTimer = resetCleaningTimer;
  globalThis.toggleCleaningLoFi = toggleCleaningLoFi;
  globalThis.transferCleaningStepsToBoard = transferCleaningStepsToBoard;
}

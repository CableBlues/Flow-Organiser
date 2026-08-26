// Ausgelagert aus index.html: Wird per document.write an der Original-Position eingefuegt
document.write(`  <div id="praise-overlay" class="hidden fixed inset-0 z-[100000] flex items-start justify-center pt-[10vh] pointer-events-none">
    <div id="praise-card" class="px-8 py-4 rounded-2xl bg-[#111116]/95 border-2 border-[var(--accent)] shadow-[0_8px_30px_rgba(139,92,246,0.3)] text-white text-[22px] font-bold font-display text-center backdrop-blur-md max-w-[90%] break-words"></div>
  </div>

  <!-- TOAST ALERTS OVERLAY -->
  <div id="toast-overlay" class="hidden fixed inset-0 z-[100000] flex items-start justify-center pt-[10vh] pointer-events-none">
    <div id="toast-card" class="px-8 py-4 rounded-xl bg-[#111116]/95 border border-[var(--accent)] text-white text-base font-bold font-display text-center backdrop-blur-md shadow-2xl"></div>
  </div>

  <!-- NEUTRALES HELPER WAS NUN? MODAL / ENTSCHEIDUNGS- & START-ASSISTENT -->
  <div id="helper-pick-modal" class="hidden fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
    <div id="helper-pick-card" class="mobile-modal-card animate-spring-modal w-full max-w-lg bg-[#111116]/95 border border-purple-500/30 p-6 rounded-2xl shadow-2xl backdrop-blur-xl text-white relative transition-all duration-300">
      <span onclick="closeHelperModal()" class="modal-close-btn text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer transition">✕</span>

      <div class="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
        <h3 class="text-white font-bold text-sm font-display flex items-center gap-2">
          <i id="helper-pick-icon" data-lucide="compass" class="w-4 h-4 text-purple-400 animate-pulse"></i>
          <span data-i18n="whatnow">Was nun?</span>
          <span class="text-[10px] text-purple-300 font-mono font-normal">· Tages-Fokus</span>
        </h3>
      </div>

      <!-- ENERGIE-FILTER & AUFGABENVORSCHLAG -->
      <div id="whatnow-pane-energy" class="space-y-4">
        <div class="flex items-center justify-between gap-1.5 bg-white/[0.02] border border-white/5 p-1 rounded-xl">
          <button onclick="setWhatNowEnergyLevel('low')" id="whatnow-energy-low" class="flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold text-gray-300 hover:text-white transition cursor-pointer bg-white/5 flex items-center justify-center gap-1">
            <span data-i18n="whatnow_low">🔋 Wenig (2-5m)</span>
          </button>
          <button onclick="setWhatNowEnergyLevel('med')" id="whatnow-energy-med" class="flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold text-purple-200 transition cursor-pointer bg-purple-500/20 border border-purple-500/40 flex items-center justify-center gap-1">
            <span data-i18n="whatnow_med">⚡ Normal</span>
          </button>
          <button onclick="setWhatNowEnergyLevel('high')" id="whatnow-energy-high" class="flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold text-gray-300 hover:text-white transition cursor-pointer bg-white/5 flex items-center justify-center gap-1">
            <span data-i18n="whatnow_high">🔥 High Focus</span>
          </button>
        </div>
        
        <div id="helper-pick-box" class="p-5 rounded-2xl transition-all duration-300"></div>

        <button id="helper-pick-next-btn" onclick="pickRandomTask()" class="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-2 transform active:scale-95">
          <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
          <span data-i18n="next_suggestion">Anderer Vorschlag</span>
        </button>
      </div>

    </div>
  </div>

  <!-- SANFTER BEWEGUNGS-IMPULS MODAL -->
  <div id="helper-sport-modal" class="hidden fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
    <div id="helper-sport-card" class="mobile-modal-card animate-spring-modal w-full max-w-md bg-[#111116]/95 border border-orange-500/30 p-6 rounded-2xl shadow-2xl backdrop-blur-xl text-white relative transition-all duration-300">
      <span onclick="closeSportModal()" class="modal-close-btn text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer transition">✕</span>

      <h3 class="text-white font-bold text-sm font-display mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
        <i data-lucide="dumbbell" class="w-4 h-4 text-orange-400 animate-bounce"></i>
        <span data-i18n="sport_modal_title">Sanfter Bewegungs-Impuls 🏃</span>
      </h3>

      <div class="space-y-4">
        <p class="text-xs text-gray-400 leading-relaxed font-semibold" data-i18n="sport_modal_desc">
          Ganz entspannt bewegen: Wähle einfach dein aktuelles Energie-Level, um eine perfekt passende, wohltuende Bewegung zu erhalten:
        </p>

        <div>
          <label class="text-[9px] text-gray-500 font-bold block mb-1" data-i18n="sport_modal_desc">Dein aktuelles Energie-Level</label>
          <select id="sport-energy-select" onchange="generateSportSuggestion()" class="w-full p-2.5 bg-[#12121e]/80 border border-white/10 rounded-xl text-xs text-orange-300 font-semibold outline-none focus:border-orange-500 cursor-pointer">
            <option value="1" data-i18n="sport_level_1">🔋 1 Löffel · Liegend oder sitzend (Extrem sanft)</option>
            <option value="2" selected data-i18n="sport_level_2">🔋 2 Löffel · Im Stehen dehnen & lockern (Moderat)</option>
            <option value="3" data-i18n="sport_level_3">🔋 3 Löffel · Aktivierender Mini-Boost (Effektiv)</option>
          </select>
        </div>

        <div id="sport-suggestion-box" class="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl space-y-2 text-center"></div>

        <div id="sport-timer-container" class="hidden p-3 bg-black/40 border border-white/5 rounded-xl flex flex-col items-center gap-2.5">
          <div class="flex items-center gap-3">
            <span id="sport-timer-display" class="font-display font-black text-2xl tracking-wider text-orange-300">01:00</span>
            <div class="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div id="sport-timer-progress" class="h-full bg-orange-400 transition-all duration-300" style="width: 100%"></div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button id="sport-timer-play-btn" onclick="startSportTimer()" class="px-3 py-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 text-[10px] font-bold rounded-xl transition cursor-pointer" data-i18n="sport_start_btn">Start</button>
            <button id="sport-timer-pause-btn" onclick="pauseSportTimer()" class="hidden px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold rounded-xl transition cursor-pointer" data-i18n="pause_btn">Pause</button>
            <button onclick="skipSportTimer()" class="px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold rounded-xl transition cursor-pointer" data-i18n="sport_skip_btn">Überspringen</button>
          </div>
        </div>

        <button id="sport-complete-btn" onclick="completeSportActivity()" class="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs rounded-xl shadow-lg transition duration-150 transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5">
          <i data-lucide="dumbbell" class="w-4 h-4"></i> <span data-i18n="sport_complete_btn">Übung absolviert</span>
        </button>
      </div>
    </div>
  </div>

  <!-- INTERAKTIVES PAUSEN- & ENTSPANNUNGS-MODAL (MIT TIMER & ANLEITUNG) -->
  <div id="helper-break-modal" class="hidden fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
    <div id="helper-break-card" class="mobile-modal-card animate-spring-modal w-full max-w-md bg-[#111116]/95 border border-teal-500/40 p-6 rounded-2xl shadow-2xl backdrop-blur-xl text-white relative transition-all duration-300">
      <span onclick="closeBreakModal()" class="modal-close-btn text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer transition">✕</span>

      <div class="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/10">
        <div id="break-modal-icon-wrap" class="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
          <i id="break-modal-lucide" data-lucide="shield" class="w-5 h-5"></i>
        </div>
        <div>
          <h3 id="break-modal-title" class="text-white font-bold text-sm md:text-base font-display">Pause & Erholung</h3>
          <p id="break-modal-subtitle" class="text-[11px] text-teal-300 font-medium">Nimm dir einen Moment für dich selbst</p>
        </div>
      </div>

      <!-- Modal Body / Timer Section -->
      <div class="flex flex-col items-center justify-center py-5 space-y-6">
        <!-- Friendly Guidance Text -->
        <div id="break-modal-desc" class="text-xs text-gray-300 text-center px-2 leading-relaxed">
          Atme tief ein und lass den Alltagsstress für einen kurzen Augenblick los. Du machst das großartig! 🌿
        </div>

        <!-- Animated Breathing / Relaxation Circle with Timer inside -->
        <div class="relative flex items-center justify-center">
          <div id="break-pulse-ring" class="absolute w-40 h-40 rounded-full border border-teal-500/30 animate-ping opacity-25 pointer-events-none"></div>
          <div class="w-36 h-36 rounded-full bg-gradient-to-br from-teal-500/20 via-[#132228] to-[#111116] border-2 border-teal-500/50 shadow-[0_0_30px_rgba(20,184,166,0.3)] flex flex-col items-center justify-center p-2 text-center">
            <span id="break-timer-display" class="text-2xl md:text-3xl font-black font-mono text-teal-300 tracking-tight">02:00</span>
            <span id="break-status-text" class="text-[10px] text-teal-400 font-bold uppercase tracking-wider mt-1">Bereit</span>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/10">
          <div id="break-progress-bar" class="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300" style="width: 0%"></div>
        </div>

        <!-- Timer Control Buttons -->
        <div class="flex items-center gap-2.5 w-full pt-1">
          <button id="break-toggle-btn" onclick="toggleBreakTimer()" class="flex-1 py-2.5 bg-teal-500 hover:bg-teal-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer">
            <i data-lucide="play" class="w-4 h-4"></i> <span id="break-toggle-label">Pause starten</span>
          </button>
          <button onclick="resetBreakTimer()" class="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer" title="Zurücksetzen">
            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
          </button>
          <button onclick="finishBreakEarly()" class="px-3.5 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer" title="Frühzeitig beenden & belohnen">
            <i data-lucide="check" class="w-3.5 h-3.5"></i> Fertig
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 1-SCAN QR-TRANSFER & P2P LIVE-SYNC MODAL -->
  <div id="modal-p2p-sync" class="hidden fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
    <div class="mobile-modal-card animate-spring-modal w-full max-w-sm bg-[#111116]/95 border border-emerald-500/40 p-5 rounded-3xl shadow-[0_10px_50px_rgba(16,185,129,0.25)] backdrop-blur-xl text-white relative transition-all duration-300 flex flex-col items-center gap-3 text-center">
      <button onclick="closeP2PSyncModal()" class="absolute top-3.5 right-3.5 text-gray-400 hover:text-white p-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>

      <!-- Header -->
      <div class="flex items-center gap-3 w-full pr-6 text-left border-b border-white/10 pb-3">
        <div class="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-md shrink-0">
          <i data-lucide="smartphone" class="w-5 h-5"></i>
        </div>
        <div>
          <h3 class="text-white font-bold text-sm font-display">Handy Live-Verbindung ⚡</h3>
          <p class="text-[10px] text-emerald-400 font-medium">1x QR scannen & sofort synchron</p>
        </div>
      </div>

      <!-- QR-Code Card -->
      <div class="p-3 bg-white rounded-2xl shadow-xl my-1 flex items-center justify-center">
        <img id="p2p-qr-img" src="" alt="QR Code" class="w-44 h-44 rounded-lg select-none" />
      </div>

      <div class="w-full space-y-2">
        <div class="flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs">
          <span class="text-[10px] text-gray-400 uppercase font-mono">Raum-Code:</span>
          <span id="p2p-room-code" class="font-mono font-black text-emerald-400 text-xs tracking-wider">FLOW-...</span>
        </div>

        <div id="p2p-status-badge" class="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium font-mono flex items-center justify-center gap-2">
          <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>Warte auf QR-Scan...</span>
        </div>

        <input type="hidden" id="p2p-share-link-input" />
        <div class="grid grid-cols-2 gap-2 pt-1">
          <button onclick="copyP2PShareLink()" class="py-2 px-3 bg-white/5 hover:bg-white/10 text-emerald-300 hover:text-emerald-200 border border-white/10 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i>
            <span>Link kopieren</span>
          </button>
          <button onclick="closeP2PSyncModal()" class="py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition cursor-pointer shadow-md">
            Fertig ✓
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- SENSORISCHE REIZPAUSE (SAFE SPACE) MODAL -->
  <div id="helper-safespace-modal" class="hidden fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
    <div id="helper-safespace-card" class="mobile-modal-card animate-spring-modal w-full max-w-md bg-[#111116]/95 border border-teal-500/30 p-6 rounded-2xl shadow-2xl backdrop-blur-xl text-white relative transition-all duration-300">
      <span onclick="closeSafeSpaceModal()" class="modal-close-btn text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer transition">✕</span>

      <h3 class="text-white font-bold text-sm font-display mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
        <i data-lucide="shield" class="w-4 h-4 text-teal-400"></i>
        <span>Sensorische Reizpause 🧘</span>
      </h3>

      <div class="space-y-4">
        <div class="flex bg-black/40 p-1 rounded-xl border border-white/5 text-xs font-bold">
          <button id="safespace-tab-breath" onclick="switchSafeSpaceTab('breath')" class="flex-1 py-1.5 rounded text-teal-300 bg-teal-500/10 border border-teal-500/20">Atemtakt</button>
          <button id="safespace-tab-anchor" onclick="switchSafeSpaceTab('anchor')" class="flex-1 py-1.5 rounded text-gray-400 hover:text-white">Erdungs-Anker</button>
        </div>

        <!-- Atemübung -->
        <div id="safespace-pane-breath" class="flex flex-col items-center justify-center py-6 gap-6">
          <div id="safespace-breath-circle" class="w-28 h-28 rounded-full border-4 border-teal-500/40 flex items-center justify-center transition-all duration-1000 ease-in-out">
            <span id="safespace-breath-text" class="text-xs font-bold text-teal-300 tracking-wide">Lade...</span>
          </div>
          <div class="flex items-center gap-2.5">
            <button id="safespace-noise-btn" onclick="toggleSafeSpaceNoise()" class="px-3.5 py-1.5 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-300 text-xs font-bold rounded-xl transition">Regen-Sound ein</button>
          </div>
        </div>

        <!-- Erdungstabelle -->
        <div id="safespace-pane-anchor" class="hidden space-y-4">
          <div class="p-4 bg-teal-500/5 border border-teal-500/20 rounded-xl">
            <div id="anchor-step-title" class="text-xs uppercase font-mono font-bold text-teal-400 mb-1">Schritt 1 von 5</div>
            <div id="anchor-step-instruction" class="text-xs text-gray-200 font-semibold leading-relaxed">Finde 5 Dinge...</div>
          </div>
          <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
            <div id="anchor-progress-bar" class="h-full bg-teal-400 transition-all duration-300" style="width: 20%"></div>
          </div>
          <div class="flex gap-2">
            <button id="anchor-next-btn" onclick="nextAnchorStep()" class="flex-1 py-2 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-200 text-xs font-bold rounded-xl transition">Verstanden & Weiter</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ENTSCHEIDUNGSKOMPASS MODAL -->
  <div id="helper-compass-modal" class="hidden fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
    <div id="helper-compass-card" class="mobile-modal-card animate-spring-modal w-full max-w-lg bg-[#111116]/95 border border-rose-500/30 p-6 rounded-2xl shadow-2xl backdrop-blur-xl text-white relative transition-all duration-300">
      <span onclick="closeCompassModal()" class="modal-close-btn text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer transition">✕</span>

      <h3 class="text-white font-bold text-sm font-display mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
        <i data-lucide="compass" class="w-4 h-4 text-rose-400 animate-spin"></i>
        <span>Entscheidungs-Kompass 🧭</span>
      </h3>

      <!-- Step 1: Query Entry -->
      <div id="compass-step-entry" class="space-y-4">
        <p class="text-xs text-gray-400 leading-relaxed font-semibold">
          Welches Dilemma, Projekt oder Gedanken-Chaos beschäftigt dich? Formuliere dein Anliegen:
        </p>
        <textarea id="compass-query-input" rows="3" placeholder="Z.B.: Soll ich heute Sport machen oder entspannen? / Mein unaufgeräumtes Zimmer..." class="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-rose-500 font-semibold placeholder:text-gray-600 leading-relaxed"></textarea>
        <button onclick="submitCompassQuery()" class="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition">Kompass ausrichten 🗺️</button>
      </div>

      <!-- Step 2: Decision Tools (Tabbed) -->
      <div id="compass-step-tools" class="hidden space-y-4">
        <div class="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-xs text-gray-300 font-semibold">
          <span class="truncate flex-1"><b>Anliegen:</b> <span id="compass-active-dilemma-label" class="italic text-rose-300">Anliegen</span></span>
          <button onclick="returnToCompassEntry()" class="text-[10px] text-gray-500 hover:text-white font-bold shrink-0 pl-2">Ändern 🔄</button>
        </div>

        <!-- Tabbed buttons (expanded grid) -->
        <div class="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-white/5 text-[9px] font-bold">
          <button id="tab-btn-coin" onclick="switchCompassTab('coin')" class="py-1 rounded text-rose-300 bg-rose-500/10 border border-rose-500/20">Bauchgefühl</button>
          <button id="tab-btn-scale" onclick="switchCompassTab('scale')" class="py-1 rounded text-gray-400 hover:text-white">Werte-Waage</button>
          <button id="tab-btn-spoon" onclick="switchCompassTab('spoon')" class="py-1 rounded text-gray-400 hover:text-white">Löffel-Check</button>
          <button id="tab-btn-prioritizer" onclick="switchCompassTab('prioritizer')" class="py-1 rounded text-gray-400 hover:text-white">Smart-Priorität</button>
          <button id="tab-btn-splitter" onclick="switchCompassTab('splitter')" class="py-1 rounded text-gray-400 hover:text-white">Zerteiler</button>
          <button id="tab-btn-braindump" onclick="switchCompassTab('braindump')" class="py-1 rounded text-gray-400 hover:text-white">Brain-Dump</button>
          <button id="tab-btn-ten" onclick="switchCompassTab('ten')" class="py-1 rounded text-gray-400 hover:text-white">10-10-10</button>
          <button id="tab-btn-fear" onclick="switchCompassTab('fear')" class="py-1 rounded text-gray-400 hover:text-white">Worst Case</button>
        </div>

        <!-- PANES -->
        <!-- Bauchgefühl -->
        <div id="compass-pane-coin" class="space-y-3">
          <p class="text-[10px] text-gray-400 leading-normal">
            Wir werfen eine Münze für dich. <b>Beobachte deine Emotionen</b> im Moment des Ergebnisses. Spürst du Erleichterung oder Enttäuschung?
          </p>
          <div class="grid grid-cols-2 gap-2">
            <input type="text" id="coin-opt-a" placeholder="Option A" class="p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
            <input type="text" id="coin-opt-b" placeholder="Option B" class="p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
          </div>
          <button onclick="triggerCoinToss()" class="w-full py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-bold rounded-xl transition">Münze werfen 🪙</button>
          
          <div id="coin-toss-result-box" class="hidden p-3 bg-black/60 border border-white/5 rounded-xl flex flex-col items-center justify-center gap-2">
            <div id="coin-toss-spinning" class="text-xs text-rose-400 font-bold animate-pulse">Münze rotiert im Orbit...</div>
            <div id="coin-toss-final" class="hidden text-center space-y-2 w-full">
              <div class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Ergebnis:</div>
              <div id="coin-toss-verdict" class="text-sm font-black text-rose-300">Option A</div>
              <div class="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
                <span id="coin-veto-countdown" class="text-[9px] text-gray-500 font-bold">Veto-Dauer: 10s</span>
                <button id="coin-veto-btn" onclick="triggerCoinVeto()" class="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-[10px] font-bold rounded-xl transition">VETO EINLEGEN! 🛑</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Werte-Waage -->
        <div id="compass-pane-scale" class="hidden space-y-3">
          <p class="text-[10px] text-gray-400 leading-normal">
            Trage Argumente ein und gewichte sie mit Sternen (1-3). Die Waage ermittelt rational den Sieger.
          </p>
          <div class="flex gap-1.5">
            <input type="text" id="scale-add-text" placeholder="Argument..." class="flex-1 p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
            <select id="scale-add-type" class="p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none">
              <option value="pro">Pro</option>
              <option value="con">Contra</option>
            </select>
            <select id="scale-add-weight" class="p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none">
              <option value="1">⭐</option>
              <option value="2">⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
            </select>
            <button onclick="handleAddScaleArgument()" class="px-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded border border-rose-500/40 flex items-center justify-center transition">+</button>
          </div>
          
          <div class="grid grid-cols-2 gap-2 h-24 overflow-y-auto pr-1">
            <div class="space-y-1">
              <div class="text-[9px] uppercase font-bold text-emerald-400 border-b border-emerald-500/10 pb-1">PRO</div>
              <div id="scale-pro-list" class="space-y-1"></div>
            </div>
            <div class="space-y-1">
              <div class="text-[9px] uppercase font-bold text-rose-400 border-b border-rose-500/10 pb-1">CONTRA</div>
              <div id="scale-con-list" class="space-y-1"></div>
            </div>
          </div>

          <div id="scale-verdict-box" class="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-xs">
            <span id="scale-verdict-text">Noch keine Argumente eingetragen.</span>
            <button onclick="clearScaleMatrix()" class="text-[9px] text-gray-500 hover:text-red-400 font-bold shrink-0">Zurücksetzen</button>
          </div>
        </div>

        <!-- Löffel-Check -->
        <div id="compass-pane-spoon" class="hidden space-y-3">
          <p class="text-[10px] text-gray-400 leading-normal">
            Gegenüberstellung deines Energiebudgets mit den Anforderungen deiner geplanten Vorhaben.
          </p>
          <div class="grid grid-cols-2 gap-2 items-center">
            <div>
              <label class="text-[9px] text-gray-500 font-bold block mb-1">Energielevel (Spoons)</label>
              <select id="spoon-battery-select" onchange="recalculateSpoonCheck()" class="w-full p-2 bg-[#12121e]/80 border border-white/10 rounded-xl text-xs text-rose-300 font-semibold outline-none focus:border-rose-500">
                <option value="high">🔋 Hoch (4 Spoons)</option>
                <option value="med" selected>🔋 Normal (2 Spoons)</option>
                <option value="low">🔋 Niedrig (1 Spoon)</option>
                <option value="overwhelmed">⚠️ Reizüberflutet (Schutzmodus)</option>
              </select>
            </div>
            <div>
              <label class="text-[9px] text-gray-500 font-bold block mb-1">Aktivitäten hinzufügen</label>
              <button onclick="handleAddSpoonOptionPrompt()" class="w-full py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-bold rounded-xl transition">Optionen pflegen</button>
            </div>
          </div>

          <div id="spoon-options-list" class="space-y-1.5 h-20 overflow-y-auto pr-1"></div>

          <div class="p-2 bg-rose-500/5 border border-rose-500/20 rounded-xl text-center text-[10px] font-bold text-rose-300">
            <span id="spoon-verdict-text">Wähle Optionen aus.</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL: DETAIL-STATISTIK & ANALYSE-DASHBOARD (STUFE 2) -->
  <div id="modal-report-dashboard" class="hidden fixed inset-0 z-[120000] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in" onclick="if(event.target === this) closeReportDashboard()">
    <div class="relative w-full max-w-4xl bg-[#111118] border border-purple-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto" onclick="event.stopPropagation()">
      
      <!-- Dashboard Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
            <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="font-bold text-base sm:text-lg font-display text-white" data-i18n="dashboard_title">Analyse- & Statistik-Center</h3>
            <p class="text-xs text-gray-400">Detaillierte Auswertungen deiner Produktivität & Gewohnheiten</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Timeframe Selector -->
          <div class="flex items-center bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-bold">
            <button onclick="setDashboardTimeframe('today')" id="dash-tab-today" class="px-3 py-1.5 rounded-lg text-gray-400 hover:text-white transition cursor-pointer" data-i18n="today">Heute</button>
            <button onclick="setDashboardTimeframe('week')" id="dash-tab-week" class="px-3 py-1.5 rounded-lg text-purple-300 bg-purple-500/20 font-bold transition cursor-pointer" data-i18n="week">7 Tage</button>
            <button onclick="setDashboardTimeframe('month')" id="dash-tab-month" class="px-3 py-1.5 rounded-lg text-gray-400 hover:text-white transition cursor-pointer" data-i18n="month">30 Tage</button>
          </div>

          <button onclick="closeReportDashboard()" class="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
      </div>

      <!-- Bento-Grid Top Metrics (4 Kacheln) -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div class="p-4 rounded-2xl bg-white/[0.025] border border-white/10 relative overflow-hidden">
          <div class="text-[11px] font-bold text-gray-400 mb-1 flex items-center justify-between">
            <span data-i18n="completed_stat">Abgeschlossen</span>
            <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-400"></i>
          </div>
          <div id="dash-stat-completed" class="text-2xl font-black font-display text-emerald-400">0</div>
          <div id="dash-stat-trend" class="text-[10px] text-emerald-300/80 mt-1 font-medium">100% Erfolgsquote</div>
        </div>

        <div class="p-4 rounded-2xl bg-white/[0.025] border border-white/10 relative overflow-hidden">
          <div class="text-[11px] font-bold text-gray-400 mb-1 flex items-center justify-between">
            <span data-i18n="focus_time">Fokus-Zeit</span>
            <i data-lucide="timer" class="w-3.5 h-3.5 text-purple-400"></i>
          </div>
          <div id="dash-stat-focus" class="text-2xl font-black font-display text-purple-300">0m</div>
          <div id="dash-stat-sessions" class="text-[10px] text-purple-200/80 mt-1 font-medium">0 Sitzungen</div>
        </div>

        <div class="p-4 rounded-2xl bg-white/[0.025] border border-white/10 relative overflow-hidden">
          <div class="text-[11px] font-bold text-gray-400 mb-1 flex items-center justify-between">
            <span data-i18n="peak_hours">Produktivitäts-Peak</span>
            <i data-lucide="sun" class="w-3.5 h-3.5 text-amber-400"></i>
          </div>
          <div id="dash-stat-peak" class="text-base font-bold font-display text-amber-300 mt-1 truncate">Morgens</div>
          <div id="dash-stat-peakhour-detail" class="text-[10px] text-amber-200/80 mt-1 font-medium">06:00 - 12:00 Uhr</div>
        </div>

        <div class="p-4 rounded-2xl bg-white/[0.025] border border-white/10 relative overflow-hidden">
          <div class="text-[11px] font-bold text-gray-400 mb-1 flex items-center justify-between">
            <span>Balance-Index</span>
            <i data-lucide="scale" class="w-3.5 h-3.5 text-sky-400"></i>
          </div>
          <div id="dash-stat-balance" class="text-base font-bold font-display text-sky-300 mt-1 truncate">Ausgeglichen</div>
          <div id="dash-stat-topcat" class="text-[10px] text-sky-200/80 mt-1 font-medium">Top: Tagesroutine</div>
        </div>
      </div>

      <!-- Mitte: 7-Tage-Aktivitätsverlauf & Kategorie-Verteilung -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 7-Tage Aktivitäts-Chart -->
        <div class="md:col-span-2 p-4.5 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold text-gray-200 flex items-center gap-2">
              <i data-lucide="trending-up" class="w-4 h-4 text-purple-400"></i>
              <span>Aktivitäts-Trend</span>
            </h4>
            <span id="dash-chart-total" class="text-xs font-mono font-bold text-purple-300">0 Tasks</span>
          </div>
          <div id="dash-weekly-chart" class="flex items-end justify-between h-28 pt-4 px-2 border-b border-white/5 pb-2"></div>
        </div>

        <!-- Kategorie-Verteilung (Segmentbalken) -->
        <div class="p-4.5 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
          <h4 class="text-xs font-bold text-gray-200 flex items-center gap-2" data-i18n="category_balance">
            <i data-lucide="pie-chart" class="w-4 h-4 text-emerald-400"></i>
            <span>Kategorie-Verteilung</span>
          </h4>
          <div id="dash-category-distribution" class="space-y-2.5 text-xs"></div>
        </div>
      </div>

      <!-- Historie & Suche -->
      <div class="p-4.5 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <h4 class="text-xs font-bold text-gray-200 flex items-center gap-2">
            <i data-lucide="list-checks" class="w-4 h-4 text-purple-400"></i>
            <span>Erledigte Aufgaben</span>
            <span id="dash-history-badge" class="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-300 font-mono">0</span>
          </h4>
          <div class="relative w-full sm:w-64">
            <input type="text" id="dash-search-input" oninput="filterDashboardHistory(this.value)" placeholder="Aufgaben durchsuchen..." class="w-full pl-8 pr-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-purple-500 font-medium" />
            <i data-lucide="search" class="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5"></i>
          </div>
        </div>
        <div id="dash-history-list" class="space-y-1.5 max-h-56 overflow-y-auto pr-1 text-xs"></div>
      </div>

      <!-- Footer Actions -->
      <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
        <div class="text-[11px] text-gray-400 flex items-center gap-1.5">
          <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-400"></i>
          <span>Alle Daten 100% lokal auf deinem Gerät gespeichert</span>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="copyComprehensiveReportText()" class="px-4 py-2 bg-white/10 hover:bg-white/15 text-gray-200 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i>
            <span data-i18n="copy_report">Bericht kopieren</span>
          </button>
          <button onclick="openReportExportModal()" class="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-purple-900/30">
            <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
            <span data-i18n="export_image">Als Bild exportieren</span>
          </button>
        </div>
      </div>

    </div>
  </div>

  <!-- MODAL: EINSTELLUNGEN & RECHTLICHES (IMPRESSUM, DATENSCHUTZ, LIZENZEN) -->
  <div id="modal-settings" class="hidden fixed inset-0 z-[120000] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in" onclick="if(event.target === this) closeSettingsModal()">
    <div class="relative w-full max-w-3xl bg-[#111118] border border-purple-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto" onclick="event.stopPropagation()">
      
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-white/10 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
            <i data-lucide="settings" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="font-bold text-base sm:text-lg font-display text-white" data-i18n="settings_modal_title">Einstellungen & Rechtliches</h3>
            <p class="text-xs text-gray-400" data-i18n="settings_modal_subtitle">App-Optionen, Datenschutzerklärung und Open-Source-Transparenz</p>
          </div>
        </div>
        <button onclick="closeSettingsModal()" class="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Navigation Tabs (5 Tabs) -->
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-black/60 border border-white/10 rounded-2xl text-xs font-bold">
        <button onclick="switchSettingsTab('general')" id="settings-tab-general" class="py-2 px-2.5 rounded-xl bg-purple-600 text-white transition cursor-pointer flex items-center justify-center gap-1.5">
          <i data-lucide="sliders" class="w-3.5 h-3.5"></i>
          <span data-i18n="tab_general">Allgemein</span>
        </button>
        <button onclick="switchSettingsTab('history')" id="settings-tab-history" class="py-2 px-2.5 rounded-xl text-gray-400 hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5">
          <i data-lucide="history" class="w-3.5 h-3.5"></i>
          <span data-i18n="tab_history">History</span>
        </button>
        <button onclick="switchSettingsTab('impressum')" id="settings-tab-impressum" class="py-2 px-2.5 rounded-xl text-gray-400 hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5">
          <i data-lucide="scale" class="w-3.5 h-3.5"></i>
          <span data-i18n="tab_impressum">Impressum</span>
        </button>
        <button onclick="switchSettingsTab('privacy')" id="settings-tab-privacy" class="py-2 px-2.5 rounded-xl text-gray-400 hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5">
          <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
          <span data-i18n="tab_privacy">Datenschutz</span>
        </button>
        <button onclick="switchSettingsTab('licenses')" id="settings-tab-licenses" class="py-2 px-2.5 rounded-xl text-gray-400 hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5">
          <i data-lucide="code-2" class="w-3.5 h-3.5"></i>
          <span data-i18n="tab_licenses">Lizenzen</span>
        </button>
      </div>

      <!-- TAB 1: ALLGEMEINE EINSTELLUNGEN -->
      <div id="settings-pane-general" class="space-y-4 text-xs">
        
        <!-- Standard Workspace -->
        <div class="p-4 rounded-2xl bg-white/[0.025] border border-white/10 space-y-2">
          <label class="font-bold text-gray-200 block text-xs" data-i18n="setting_default_workspace">Standard-Bereich beim Start</label>
          <p class="text-[11px] text-gray-400">Wähle, ob die App beim Öffnen standardmäßig den privaten oder beruflichen Bereich anzeigt.</p>
          <div class="flex gap-2">
            <button onclick="saveGeneralSetting('defaultWorkspace', 'private')" id="setting-ws-private" class="flex-1 py-2 px-3 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold transition cursor-pointer">🏠 Privat</button>
            <button onclick="saveGeneralSetting('defaultWorkspace', 'work')" id="setting-ws-work" class="flex-1 py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white font-bold transition cursor-pointer">💼 Arbeit</button>
          </div>
        </div>

        <!-- Standard Timer-Dauer -->
        <div class="p-4 rounded-2xl bg-white/[0.025] border border-white/10 space-y-2">
          <label class="font-bold text-gray-200 block text-xs" data-i18n="setting_default_timer">Standard Fokus-Dauer</label>
          <p class="text-[11px] text-gray-400">Voreingestellte Minuten für neue Timer-Sitzungen.</p>
          <div class="grid grid-cols-4 gap-2">
            <button onclick="saveGeneralSetting('defaultTimer', 15)" id="setting-timer-15" class="py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-mono font-bold hover:text-white cursor-pointer">15 Min</button>
            <button onclick="saveGeneralSetting('defaultTimer', 25)" id="setting-timer-25" class="py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono font-bold cursor-pointer">25 Min</button>
            <button onclick="saveGeneralSetting('defaultTimer', 45)" id="setting-timer-45" class="py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-mono font-bold hover:text-white cursor-pointer">45 Min</button>
            <button onclick="saveGeneralSetting('defaultTimer', 60)" id="setting-timer-60" class="py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-mono font-bold hover:text-white cursor-pointer">60 Min</button>
          </div>
        </div>

        <!-- Daten-Backup & Wiederherstellung (Local-First Sicherheit) -->
        <div class="p-4 rounded-2xl bg-white/[0.025] border border-white/10 space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <span class="font-bold text-gray-200 text-xs flex items-center gap-1.5">
                <i data-lucide="database" class="w-3.5 h-3.5 text-purple-400"></i>
                <span data-i18n="backup_hub_title">Lokale Datensicherung & Backup</span>
              </span>
              <p class="text-[11px] text-gray-400 mt-0.5">Sichere alle deine Aufgaben, Workspaces, Einstellungen und Historie in eine Datei oder stelle sie wieder her.</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 pt-1">
            <button onclick="downloadFullBackup()" class="py-2 px-3.5 bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 text-xs shadow-sm">
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
              <span data-i18n="backup_download_btn">Backup exportieren (.json)</span>
            </button>
            <label class="py-2 px-3.5 bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 hover:text-white rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 text-xs">
              <i data-lucide="upload" class="w-3.5 h-3.5"></i>
              <span data-i18n="backup_restore_btn">Backup wiederherstellen (.json)</span>
              <input type="file" id="backup-restore-file-input" accept=".json" onchange="handleRestoreBackupFile(event)" class="hidden" />
            </label>
            <button onclick="openKeyboardShortcuts()" class="py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 text-xs">
              <i data-lucide="keyboard" class="w-3.5 h-3.5"></i>
              <span>Shortcuts (?)</span>
            </button>
          </div>
        </div>

        <!-- Gefahrenbereich: Reset -->
        <div class="p-4 rounded-2xl bg-red-500/[0.03] border border-red-500/20 space-y-3">
          <div>
            <span class="font-bold text-red-300 text-xs">Gefahrenbereich: Lokale Datenbereinigung</span>
            <p class="text-[11px] text-gray-400 mt-0.5">Setzt den Browser-Speicher vollständig auf den Ursprungszustand zurück.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button onclick="clearAllApplicationData()" class="py-2 px-3 bg-red-600/80 hover:bg-red-600 text-white rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              <span data-i18n="setting_clear_data">Alle lokalen App-Daten löschen</span>
            </button>
          </div>
        </div>

      </div>

      <!-- TAB: SCREENSHOT- & VERSIONS-GALERIE -->
      <div id="settings-pane-history" class="hidden space-y-4 text-xs">
        <div class="p-4 rounded-2xl bg-white/[0.025] border border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 class="font-bold text-sm text-white flex items-center gap-2">
              <i data-lucide="image" class="w-4 h-4 text-purple-400"></i>
              <span>Screenshot- & Versions-Galerie</span>
            </h4>
            <p class="text-[11px] text-gray-400 mt-0.5" data-i18n="history_subtitle">Sammle und betrachte Screenshots früherer Versionen und Entwicklungsstände</p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="document.getElementById('history-screenshot-input').click()" class="py-2 px-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-purple-900/30">
              <i data-lucide="image-plus" class="w-4 h-4"></i>
              <span>Screenshot hinzufügen 📷</span>
            </button>
            <input type="file" id="history-screenshot-input" onchange="handleHistoryScreenshotUpload(event)" accept="image/*" class="hidden" />
          </div>
        </div>

        <!-- Galerie-Kacheln für Screenshots -->
        <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
          <div class="flex items-center justify-between border-b border-white/5 pb-2">
            <h5 class="text-xs font-bold text-gray-200 flex items-center gap-2">
              <i data-lucide="images" class="w-4 h-4 text-purple-400"></i>
              <span>Gespeicherte Screenshots</span>
            </h5>
            <span id="history-gallery-count" class="text-[10px] font-mono text-purple-300 font-bold">0 Bilder</span>
          </div>
          <div id="history-gallery-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <!-- Dynamisch befüllte Galerie-Bilder -->
          </div>
        </div>

      </div>

      <!-- TAB 2: IMPRESSUM (§ 5 DDG) -->
      <div id="settings-pane-impressum" class="hidden space-y-4 text-xs leading-relaxed text-gray-300">
        <div class="p-4 rounded-2xl bg-white/[0.025] border border-white/10 space-y-3">
          <h4 class="font-bold text-sm text-white flex items-center gap-2">
            <i data-lucide="building" class="w-4 h-4 text-purple-400"></i>
            <span>Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)</span>
          </h4>
          <div class="space-y-1.5 text-gray-300">
            <p class="font-semibold text-white">Flow Organiser</p>
            <p>Ein Projekt für barrierefreie, strukturierte Alltags- und Arbeitsorganisation.</p>
            <p class="pt-2 text-gray-400"><strong>Dienstanbieter / Betreiber:</strong></p>
            <p>Flow Organiser Entwicklerteam</p>
            <p>Musterstraße 12, 10115 Berlin, Deutschland</p>
            <p class="pt-2 text-gray-400"><strong>Kontakt:</strong></p>
            <p>E-Mail: <a href="mailto:support@flow-planner.app" class="text-purple-300 hover:underline">support@flow-planner.app</a></p>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-white/[0.025] border border-white/10 space-y-2">
          <h4 class="font-bold text-xs text-white">EU-Streitschlichtung & Verbraucherstreitbeilegung</h4>
          <p class="text-[11px] text-gray-400">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener" class="text-purple-300 hover:underline">https://ec.europa.eu/consumers/odr</a>.<br>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </div>
      </div>

      <!-- TAB 3: DATENSCHUTZERKLÄRUNG (DSGVO) -->
      <div id="settings-pane-privacy" class="hidden space-y-4 text-xs leading-relaxed text-gray-300">
        
        <div class="p-4 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-2">
          <h4 class="font-bold text-sm text-emerald-300 flex items-center gap-2">
            <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
            <span>Local-First Prinzip & Datenschutz by Design (Art. 25 DSGVO)</span>
          </h4>
          <p class="text-gray-300 text-[11px]">
            Deine Privatsphäre hat höchste Priorität. Flow Organiser speichert deine Aufgaben, Notizen, Einkaufslisten, Timer und Einstellungen <strong>ausschließlich lokal im Speicher deines Browsers (localStorage & IndexedDB)</strong>. Wir betreiben kein Nutzer-Tracking und binden keine Werbenetzwerke oder Analyse-Cookies ein.
          </p>
        </div>

        <div class="p-4 rounded-2xl bg-white/[0.025] border border-white/10 space-y-3">
          <h4 class="font-bold text-xs text-white">1. Technische Speicherung & Cookies (TDDDG / TTDSG)</h4>
          <p class="text-[11px] text-gray-400">
            Es werden keine einwilligungspflichtigen Marketing-Cookies gesetzt. Der lokale Speicher (<code class="bg-black/40 px-1 py-0.5 rounded text-purple-300">localStorage</code>) dient rein der Bereitstellung der Kernfunktionen (Zustand der Aufgaben, Sprachwahl, Farbthemen).
          </p>

          <h4 class="font-bold text-xs text-white pt-1">2. Externe technische Schnittstellen (APIs)</h4>
          <ul class="list-disc pl-4 space-y-1 text-[11px] text-gray-400">
            <li><strong>Wetterdaten (Open-Meteo):</strong> Bei aktiver Nutzung des Wetter-Widgets wird die Open-Meteo API kontaktiert. Es werden keine personenbezogenen Profile erstellt.</li>
            <li><strong>Cloud-Synchronisation (Optional):</strong> Nutzt du die freiwillige Multi-Device Synchronisation (Supabase), werden deine verschlüsselten Board-Daten auf Servern innerhalb der Europäischen Union übertragen.</li>
          </ul>

          <h4 class="font-bold text-xs text-white pt-1">3. Deine Rechte (Art. 15–21 DSGVO)</h4>
          <p class="text-[11px] text-gray-400">
            Da alle Daten auf deinem Gerät liegen, hast du jederzeit die vollständige Kontrolle: Über den Reiter <em>„Allgemein“</em> oder die Backup-Buttons kannst du deine Daten jederzeit exportieren (JSON) oder mit einem Klick unwiderruflich löschen.
          </p>
        </div>

      </div>

      <!-- TAB 4: LIZENZEN & HAFTUNG -->
      <div id="settings-pane-licenses" class="hidden space-y-4 text-xs leading-relaxed text-gray-300">
        
        <!-- Haftungsausschluss -->
        <div class="p-4 rounded-2xl bg-amber-500/[0.04] border border-amber-500/20 space-y-2">
          <h4 class="font-bold text-xs text-amber-300 flex items-center gap-2">
            <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-400"></i>
            <span>Haftungsausschluss & Nutzungshinweis</span>
          </h4>
          <p class="text-[11px] text-gray-300">
            Flow Organiser ist ein persönliches Organisations- und Strukturierungswerkzeug. Für das zuverlässige Auslösen von browserbasierten Weck- und Terminsignalen bei geschlossenen Browser-Tabs, aktiviertem Ruhezustand, Hardware-Energiesparmodi oder Betriebssystembeschränkungen wird keine Gewähr oder Haftung übernommen.
          </p>
        </div>

        <!-- Open Source Lizenzen -->
        <div class="p-4 rounded-2xl bg-white/[0.025] border border-white/10 space-y-3">
          <h4 class="font-bold text-xs text-white flex items-center gap-2">
            <i data-lucide="heart" class="w-4 h-4 text-rose-400"></i>
            <span>Open-Source Danksagung & Third-Party Lizenzen</span>
          </h4>
          <p class="text-[11px] text-gray-400">
            Diese Anwendung verwendet freie Open-Source Software unter der MIT / ISC Lizenz:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div class="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span class="font-bold text-white block">Tailwind CSS</span>
              <span class="text-gray-400">© Tailwind Labs Inc. (MIT License)</span>
            </div>
            <div class="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span class="font-bold text-white block">Lucide Icons</span>
              <span class="text-gray-400">© Lucide Contributors (ISC License)</span>
            </div>
            <div class="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span class="font-bold text-white block">Three.js & OrbitControls</span>
              <span class="text-gray-400">© Ricardo Cabello / mrdoob (MIT License)</span>
            </div>
            <div class="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span class="font-bold text-white block">Supabase Client</span>
              <span class="text-gray-400">© Supabase Inc. (MIT License)</span>
            </div>
            <div class="p-2.5 rounded-xl bg-black/40 border border-white/5 sm:col-span-2">
              <span class="font-bold text-white block">html2canvas</span>
              <span class="text-gray-400">© Niklas von Hertzen (MIT License)</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="flex justify-end pt-2 border-t border-white/10">
        <button onclick="closeSettingsModal()" class="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-lg shadow-purple-900/30">
          Fertig / Schließen
        </button>
      </div>

    </div>
  </div>

  <!-- MODAL: SPOTLIGHT COMMAND PALETTE (STRG+K / CMD+K) -->
  <div id="modal-command-palette" class="hidden fixed inset-0 z-[130000] bg-black/75 backdrop-blur-md flex items-start justify-center pt-[12vh] p-3 sm:p-4 animate-fade-in" onclick="if(event.target === this) closeCommandPalette()">
    <div class="relative w-full max-w-xl bg-[#111118]/95 border border-purple-500/30 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[75vh]" onclick="event.stopPropagation()">
      
      <!-- Search Input Bar -->
      <div class="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-black/40">
        <i data-lucide="search" class="w-5 h-5 text-purple-400 shrink-0"></i>
        <input type="text" id="cmd-palette-input" oninput="filterCommandPalette(this.value)" placeholder="Befehl eingeben oder Aufgaben suchen... (Strg+K)" class="w-full bg-transparent border-0 outline-none text-white text-sm placeholder:text-gray-500 font-medium" />
        <span class="px-2 py-0.5 rounded-lg bg-white/10 text-[10px] font-mono text-gray-400 shrink-0">ESC</span>
      </div>

      <!-- Results & Action List -->
      <div id="cmd-palette-results" class="p-2 space-y-1 overflow-y-auto max-h-[55vh] text-xs">
        <!-- Dynamically rendered commands and tasks -->
      </div>

      <!-- Footer Info -->
      <div class="px-4 py-2 border-t border-white/5 bg-black/60 flex items-center justify-between text-[10px] text-gray-400 font-mono">
        <span class="flex items-center gap-2">
          <span>↑↓ Navigieren</span>
          <span>↵ Ausführen</span>
        </span>
        <span onclick="openKeyboardShortcuts()" class="hover:text-purple-300 transition cursor-pointer">Tastaturkürzel (?)</span>
        <span>Flow Spotlight ⌘K</span>
      </div>

    </div>
  </div>

  <!-- MODAL: KEYBOARD SHORTCUTS CHEAT SHEET (?) -->
  <div id="modal-keyboard-shortcuts" class="hidden fixed inset-0 z-[135000] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in" onclick="if(event.target === this) closeKeyboardShortcuts()">
    <div class="relative w-full max-w-md bg-[#111118]/98 border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col p-5 text-white" onclick="event.stopPropagation()">
      
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-mono font-bold">⌨️</div>
          <div>
            <h3 class="font-bold text-sm text-white" data-i18n="shortcuts_title">Tastaturkürzel & Shortcuts</h3>
            <p class="text-[10px] text-gray-400">Schnellere Bedienung ohne Maus</p>
          </div>
        </div>
        <button onclick="closeKeyboardShortcuts()" class="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Shortcuts Grid -->
      <div class="space-y-2 text-xs">
        <div class="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
          <span class="text-gray-300">Spotlight Befehls-Palette</span>
          <kbd class="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 font-mono text-[10px] font-bold text-purple-300">Strg + K</kbd>
        </div>
        <div class="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
          <span class="text-gray-300">Neue Aufgabe erstellen</span>
          <kbd class="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 font-mono text-[10px] font-bold text-purple-300">N</kbd>
        </div>
        <div class="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
          <span class="text-gray-300">Fokus-Timer umschalten</span>
          <kbd class="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 font-mono text-[10px] font-bold text-purple-300">T</kbd>
        </div>
        <div class="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
          <span class="text-gray-300">Zen-Fokusmodus an / aus</span>
          <kbd class="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 font-mono text-[10px] font-bold text-purple-300">Z</kbd>
        </div>
        <div class="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
          <span class="text-gray-300">Privat / Arbeit Workspace</span>
          <div class="flex gap-1">
            <kbd class="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/20 font-mono text-[10px] font-bold text-purple-300">1</kbd>
            <kbd class="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/20 font-mono text-[10px] font-bold text-purple-300">2</kbd>
          </div>
        </div>
        <div class="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
          <span class="text-gray-300">Diese Übersicht öffnen</span>
          <kbd class="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 font-mono text-[10px] font-bold text-purple-300">?</kbd>
        </div>
        <div class="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
          <span class="text-gray-300">Modals & Popups schließen</span>
          <kbd class="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 font-mono text-[10px] font-bold text-purple-300">ESC</kbd>
        </div>
      </div>

      <!-- Footer Button -->
      <div class="mt-4 pt-3 border-t border-white/10 flex justify-end">
        <button onclick="closeKeyboardShortcuts()" class="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition cursor-pointer">
          Verstanden ✓
        </button>
      </div>

    </div>
  </div>

  <!-- PWA INSTALL BANNER / PROMPT -->
  <div id="pwa-install-banner" class="hidden fixed bottom-6 right-6 z-[140000] max-w-sm bg-[#161622]/95 border border-purple-500/40 p-4 rounded-2xl shadow-2xl backdrop-blur-xl animate-spring-modal text-white">
    <div class="flex items-start gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-purple-500/30 shrink-0">
        ✨
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-xs text-white" data-i18n="pwa_install_title">App installieren</h4>
          <button onclick="dismissPwaBanner()" class="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer">
            <i data-lucide="x" class="w-3.5 h-3.5"></i>
          </button>
        </div>
        <p class="text-[11px] text-gray-300 mt-1 leading-snug" data-i18n="pwa_install_desc">
          Installiere Flow Organiser als Desktop- oder Homescreen-App für blitzschnellen Offline-Zugriff.
        </p>
        <div class="flex items-center gap-2 mt-3">
          <button onclick="triggerPwaInstall()" class="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-md shadow-purple-900/30" data-i18n="pwa_install_btn">
            Installieren ⬇️
          </button>
          <button onclick="dismissPwaBanner()" class="px-2.5 py-1.5 text-gray-400 hover:text-gray-200 text-xs font-semibold rounded-xl hover:bg-white/5 transition cursor-pointer" data-i18n="later">
            Später
          </button>
        </div>
      </div>
    </div>
  </div>
`);


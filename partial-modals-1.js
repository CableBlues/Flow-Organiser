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

      <div class="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <h3 class="text-white font-bold text-sm font-display flex items-center gap-2">
          <i id="helper-pick-icon" data-lucide="compass" class="w-4 h-4 text-purple-400 animate-pulse"></i>
          <span data-i18n="whatnow">Was nun?</span>
          <span class="text-[10px] text-purple-300 font-mono font-normal">· Entscheidungs-Assistent</span>
        </h3>
      </div>

      <!-- WAS NUN MODE TABS -->
      <div class="grid grid-cols-4 gap-1 p-1 bg-black/40 border border-white/10 rounded-xl mb-4 text-[10px] font-bold">
        <button id="whatnow-tab-energy" onclick="switchWhatNowTab('energy')" class="py-1.5 px-1 rounded-lg bg-purple-600 text-white text-center transition cursor-pointer flex items-center justify-center gap-1">
          <span>⚡ Energie</span>
        </button>
        <button id="whatnow-tab-triple" onclick="switchWhatNowTab('triple')" class="py-1.5 px-1 rounded-lg text-gray-400 hover:text-white text-center transition cursor-pointer flex items-center justify-center gap-1">
          <span>🎲 1-aus-3</span>
        </button>
        <button id="whatnow-tab-micro" onclick="switchWhatNowTab('micro')" class="py-1.5 px-1 rounded-lg text-gray-400 hover:text-white text-center transition cursor-pointer flex items-center justify-center gap-1">
          <span>🪜 Kickstart</span>
        </button>
        <button id="whatnow-tab-coin" onclick="switchWhatNowTab('coin')" class="py-1.5 px-1 rounded-lg text-gray-400 hover:text-white text-center transition cursor-pointer flex items-center justify-center gap-1">
          <span>🪙 Münze</span>
        </button>
      </div>

      <!-- PANE 1: ENERGIE-FILTER -->
      <div id="whatnow-pane-energy" class="space-y-3">
        <div class="flex items-center justify-between gap-1.5 bg-white/[0.02] border border-white/5 p-1 rounded-xl">
          <button onclick="setWhatNowEnergyLevel('low')" id="whatnow-energy-low" class="flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold text-gray-300 hover:text-white transition cursor-pointer bg-white/5 flex items-center justify-center gap-1">
            <span>🔋 Wenig (2-5m)</span>
          </button>
          <button onclick="setWhatNowEnergyLevel('med')" id="whatnow-energy-med" class="flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold text-purple-200 transition cursor-pointer bg-purple-500/20 border border-purple-500/40 flex items-center justify-center gap-1">
            <span>⚡ Normal</span>
          </button>
          <button onclick="setWhatNowEnergyLevel('high')" id="whatnow-energy-high" class="flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold text-gray-300 hover:text-white transition cursor-pointer bg-white/5 flex items-center justify-center gap-1">
            <span>🔥 High Focus</span>
          </button>
        </div>
        
        <div id="helper-pick-box" class="p-5 rounded-2xl transition-all duration-300"></div>

        <button id="helper-pick-next-btn" onclick="pickRandomTask()" class="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-2 transform active:scale-95">
          <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
          <span data-i18n="next_suggestion">Anderer Vorschlag</span>
        </button>
      </div>

      <!-- PANE 2: 1-AUS-3 AUSWAHL -->
      <div id="whatnow-pane-triple" class="hidden space-y-3">
        <p class="text-[11px] text-gray-400 text-center leading-relaxed">
          Wähle intuitiv <strong>eine</strong> der 3 Aufgaben aus, um sofort zu starten:
        </p>
        <div id="whatnow-triple-cards" class="space-y-2"></div>
        <button onclick="generateTripleTaskChoices()" class="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-semibold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5">
          <i data-lucide="shuffle" class="w-3.5 h-3.5"></i>
          <span>Neu mischen</span>
        </button>
      </div>

      <!-- PANE 3: MICRO-STEP KICKSTART -->
      <div id="whatnow-pane-micro" class="hidden space-y-3">
        <p class="text-[11px] text-gray-400 text-center leading-relaxed">
          Große Hürde im Kopf? Zerteile die Aufgabe in ihren <strong>allerersten 30-Sekunden-Minischritt</strong>:
        </p>
        <div id="whatnow-micro-container" class="p-4 bg-white/[0.02] border border-white/10 rounded-2xl space-y-2.5">
          <div class="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Aktuelle Hürde</div>
          <div id="whatnow-micro-task-title" class="font-display font-bold text-sm text-white">Lade Aufgabe...</div>
          <div class="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl space-y-1">
            <div class="text-[10px] text-purple-300 font-bold">✨ Dein erster Minischritt:</div>
            <div id="whatnow-micro-first-step" class="text-xs text-white font-medium">Nur die Datei öffnen oder den Arbeitsplatz freiräumen.</div>
          </div>
          <button onclick="startMicroStepInFocus()" class="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer">
            <i data-lucide="play" class="w-3.5 h-3.5"></i>
            <span>Diesen Minischritt im Fokus-Modus starten</span>
          </button>
        </div>
      </div>

      <!-- PANE 4: MÜNZWURF / DILEMMA -->
      <div id="whatnow-pane-coin" class="hidden space-y-3">
        <p class="text-[11px] text-gray-400 text-center leading-relaxed">
          Kannst du dich nicht zwischen zwei Aufgaben entscheiden? Lass den Zufall entscheiden:
        </p>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-[9px] text-gray-400 font-bold block mb-1">Option A</label>
            <input type="text" id="whatnow-coin-a" placeholder="Aufgabe A..." class="w-full p-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white outline-none font-semibold" />
          </div>
          <div>
            <label class="text-[9px] text-gray-400 font-bold block mb-1">Option B</label>
            <input type="text" id="whatnow-coin-b" placeholder="Aufgabe B..." class="w-full p-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white outline-none font-semibold" />
          </div>
        </div>
        <div id="whatnow-coin-result" class="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center text-xs text-gray-400 italic hidden"></div>
        <button onclick="flipWhatNowCoin()" class="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5">
          <span>🪙 Münze werfen & entscheiden</span>
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
        <span>Sanfter Bewegungs-Impuls 🏃</span>
      </h3>

      <div class="space-y-4">
        <p class="text-xs text-gray-400 leading-relaxed font-semibold">
          Ganz entspannt bewegen: Wähle einfach dein aktuelles Energie-Level, um eine perfekt passende, wohltuende Bewegung zu erhalten:
        </p>

        <div>
          <label class="text-[9px] text-gray-500 font-bold block mb-1">Dein aktuelles Energie-Level</label>
          <select id="sport-energy-select" onchange="generateSportSuggestion()" class="w-full p-2.5 bg-[#12121e]/80 border border-white/10 rounded-xl text-xs text-orange-300 font-semibold outline-none focus:border-orange-500 cursor-pointer">
            <option value="1">🔋 1 Löffel · Liegend oder sitzend (Extrem sanft)</option>
            <option value="2" selected>🔋 2 Löffel · Im Stehen dehnen & lockern (Moderat)</option>
            <option value="3">🔋 3 Löffel · Aktivierender Mini-Boost (Effektiv)</option>
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
            <button id="sport-timer-play-btn" onclick="startSportTimer()" class="px-3 py-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 text-[10px] font-bold rounded-xl transition">Start</button>
            <button id="sport-timer-pause-btn" onclick="pauseSportTimer()" class="hidden px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold rounded-xl transition">Pause</button>
            <button onclick="skipSportTimer()" class="px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold rounded-xl transition">Überspringen</button>
          </div>
        </div>

        <button id="sport-complete-btn" onclick="completeSportActivity()" class="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs rounded-xl shadow-lg transition duration-150 transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5">
          <i data-lucide="dumbbell" class="w-4 h-4"></i> <span>Übung absolviert</span>
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
  <!-- KOSTENLOSE CLOUD-SYNC & NUTZER-ANMELDUNG -->
  <div id="helper-sync-modal" class="hidden fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
    <div id="helper-sync-card" class="mobile-modal-card animate-spring-modal w-full max-w-md max-h-[88vh] overflow-y-auto bg-[#111116]/95 border border-emerald-500/40 p-4 sm:p-6 rounded-3xl shadow-2xl backdrop-blur-xl text-white relative transition-all duration-300">
      <button onclick="closeSyncModal()" class="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
      
      <!-- Header -->
      <div class="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
        <div class="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-md shrink-0">
          <i data-lucide="smartphone" class="w-5 h-5"></i>
        </div>
        <div>
          <h3 class="text-white font-bold text-base font-display">PC & Handy Synchronisation</h3>
          <p class="text-[11px] text-emerald-400 font-medium">Live & ohne Registrierungszwang</p>
        </div>
      </div>

      <!-- STATUS: WENN BEREITS VERBUNDEN -->
      <div id="sync-modal-logged-box" class="space-y-4 hidden">
        <div class="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-base font-bold shrink-0">
              ✓
            </div>
            <div class="min-w-0">
              <div id="sync-modal-user-text" class="text-xs font-bold text-white truncate">Verbundenes Gerät</div>
              <div id="sync-modal-status-badge" class="text-[10px] text-emerald-300 font-mono mt-0.5">🟢 Live-Sync aktiv</div>
            </div>
          </div>
          <div class="text-right shrink-0">
            <span class="text-[9px] text-gray-400 block">Zuletzt:</span>
            <span id="sync-modal-last-time" class="font-mono text-emerald-300 text-xs font-bold">Gerade eben</span>
          </div>
        </div>

        <button onclick="syncEngine.syncNow();" class="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
          <i data-lucide="refresh-cw" class="w-4 h-4"></i>
          <span>Jetzt manuell abgleichen 🔄</span>
        </button>

        <button onclick="syncEngine.signOut();" class="w-full py-2.5 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-300 text-xs font-semibold rounded-xl border border-white/5 hover:border-red-500/30 transition cursor-pointer">
          Verbindung trennen
        </button>
      </div>

      <!-- STATUS: WENN NOCH NICHT VERBUNDEN -->
      <div id="sync-modal-not-logged-box" class="space-y-4">
        <!-- Sync Tabs -->
        <div class="flex bg-black/50 p-1 rounded-2xl border border-white/10 text-xs font-bold">
          <button id="sync-tab-btn-pair" onclick="switchSyncModalTab('pair')" class="flex-1 py-2 rounded-xl text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 transition flex items-center justify-center gap-1.5 cursor-pointer">
            <i data-lucide="smartphone" class="w-3.5 h-3.5"></i>
            <span>1-Klick Kopplung</span>
          </button>
          <button id="sync-tab-btn-account" onclick="switchSyncModalTab('account')" class="flex-1 py-2 rounded-xl text-gray-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer">
            <i data-lucide="user" class="w-3.5 h-3.5"></i>
            <span>Benutzerkonto</span>
          </button>
        </div>

        <!-- TAB 1: 1-KLICK KOPPLUNG (CODE & QR) -->
        <div id="sync-pane-pair" class="space-y-3.5">
          <!-- Code Anzeige für dieses Gerät -->
          <div class="p-3.5 bg-black/60 border border-emerald-500/30 rounded-2xl text-center flex flex-col items-center gap-2">
            <span class="text-[10px] text-gray-400 uppercase tracking-widest font-mono font-semibold">Kopplungs-Code für dein Smartphone</span>
            <div id="sync-pairing-code-display" class="font-mono font-black text-xs sm:text-sm text-emerald-400 tracking-wider px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl select-all break-all max-w-full">
              Lade Sync-Code...
            </div>
            
            <div class="p-2 bg-white rounded-2xl shadow-lg my-1">
              <img id="sync-qr-code-img" src="" alt="QR Code" class="w-28 h-28 mx-auto" />
            </div>
            <span class="text-[10px] text-gray-400">📷 Mit Handykamera scannen zum direkten Öffnen & Koppeln</span>

            <input type="hidden" id="sync-copy-link-input" />
            <button onclick="navigator.clipboard.writeText(document.getElementById('sync-copy-link-input').value); showToast('Link in Zwischenablage kopiert! 📋');" class="py-1.5 px-3 bg-white/5 hover:bg-white/10 text-emerald-400 text-[11px] font-semibold rounded-xl border border-white/10 transition cursor-pointer flex items-center gap-1.5 mt-0.5">
              <i data-lucide="copy" class="w-3 h-3"></i>
              <span>Link kopieren</span>
            </button>
          </div>

          <!-- Code eingeben vom anderen Gerät -->
          <div class="p-3 bg-white/[0.03] border border-white/10 rounded-2xl space-y-2">
            <label class="text-[10px] text-gray-300 font-bold uppercase tracking-wider block">Oder Code / Link vom PC hier eingeben:</label>
            <div class="flex items-center gap-2">
              <input type="text" id="sync-pair-input" placeholder="Code oder Link einfügen" class="flex-1 p-2.5 bg-black/60 border border-white/15 rounded-xl text-xs text-white outline-none focus:border-emerald-400 font-mono font-bold text-center" onkeydown="if(event.key==='Enter') handlePairWithCodeInput();" />
              <button onclick="handlePairWithCodeInput()" class="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition cursor-pointer shrink-0 shadow-md">
                Verbinden 🔗
              </button>
            </div>
          </div>
        </div>

        <!-- TAB 2: BENUTZERKONTO -->
        <div id="sync-pane-account" class="space-y-3 hidden">
          <p class="text-xs text-gray-400 leading-normal">
            Erstelle ein Benutzerkonto, um deine Aufgaben mit Benutzername & Passwort zu sichern:
          </p>
          <div class="space-y-2.5">
            <div>
              <label class="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Benutzername</label>
              <input type="text" id="sync-username-input" placeholder="z. B. Max" class="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-emerald-400 font-medium" />
            </div>
            <div>
              <label class="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Passwort</label>
              <input type="password" id="sync-password-input" placeholder="Mindestens 4 Zeichen" class="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-emerald-400 font-medium" onkeydown="if(event.key==='Enter') handleSyncSignIn();" />
            </div>
            <div class="grid grid-cols-2 gap-2 pt-1">
              <button onclick="handleSyncSignIn()" class="py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5">
                <i data-lucide="log-in" class="w-3.5 h-3.5"></i>
                <span>Anmelden</span>
              </button>
              <button onclick="handleSyncSignUp()" class="py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition cursor-pointer font-bold shadow-lg flex items-center justify-center gap-1.5">
                <i data-lucide="user-plus" class="w-3.5 h-3.5"></i>
                <span>Konto erstellen</span>
              </button>
            </div>
          </div>
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

`);

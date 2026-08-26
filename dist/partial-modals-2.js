// Ausgelagert aus index.html: Wird per document.write an der Original-Position eingefuegt
document.write(`        <!-- Smart-Prioritizer (MODUL 1) -->
        <div id="compass-pane-prioritizer" class="hidden space-y-3">
          <p class="text-[10px] text-gray-400 leading-normal">
            Bewerte Vorhaben nach Motivation & Aufwand, um deine schnellsten Erfolge („Quick Wins“) zur Überwindung von Hürden zu identifizieren.
          </p>
          <div class="flex gap-1.5 items-end">
            <div class="flex-1">
              <label class="text-[8px] text-gray-500 font-bold block mb-0.5">Aufgabe</label>
              <input type="text" id="prioritizer-task-input" placeholder="Aufgabe eingeben..." class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none" />
            </div>
            <div class="w-20">
              <label class="text-[8px] text-gray-500 font-bold block mb-0.5">Aufwand (1-5)</label>
              <select id="prioritizer-effort" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none">
                <option value="1">1 (Easy)</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5 (Schwer)</option>
              </select>
            </div>
            <div class="w-20">
              <label class="text-[8px] text-gray-500 font-bold block mb-0.5">Spaß (1-5)</label>
              <select id="prioritizer-fun" class="w-full p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none">
                <option value="1">1 (Öde)</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5 (Geil!)</option>
              </select>
            </div>
            <button onclick="handleAddPrioritizerTask()" class="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded border border-rose-500/40 flex items-center justify-center transition font-bold text-xs">+</button>
          </div>
          <div id="prioritizer-results-list" class="space-y-1.5 h-24 overflow-y-auto pr-1"></div>
        </div>

        <!-- Projekt-Zerteiler (NEUES MODUL 2) -->
        <div id="compass-pane-splitter" class="hidden space-y-3">
          <p class="text-[10px] text-gray-400 leading-normal">
            Große Vorhaben blockieren oft das Gehirn. Zerteile sie hier direkt in winzige, sofort machbare Teilschritte:
          </p>
          <div class="flex gap-1.5">
            <input type="text" id="splitter-task-input" placeholder="Z.B. Zimmer aufräumen..." class="flex-1 p-1.5 bg-black/60 border border-white/10 rounded text-xs text-white outline-none font-semibold" />
            <button onclick="generateMicroSteps()" class="px-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded border border-rose-500/40 text-xs font-bold transition">Zerteilen ⚡</button>
          </div>
          <div id="splitter-steps-list" class="space-y-1.5 h-28 overflow-y-auto pr-1"></div>
        </div>

        <!-- Brain-Dump Organizer (NEUES MODUL 3) -->
        <div id="compass-pane-braindump" class="hidden space-y-3">
          <p class="text-[10px] text-gray-400 leading-normal">
            Schreibe alles ungefiltert auf (jede Zeile eine Aufgabe). Sortiere die Gedanken anschließend mit schnellen Klicks direkt in dein System:
          </p>
          <div id="braindump-input-container" class="space-y-2">
            <textarea id="braindump-textarea" rows="3" placeholder="Wäsche waschen&#10;Arzt anrufen&#10;Milch kaufen..." class="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-rose-500 font-semibold placeholder:text-gray-600 leading-relaxed"></textarea>
            <button onclick="analyzeBrainDump()" class="w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition">Dump analysieren 🧠</button>
          </div>
          <div id="braindump-sorting-container" class="hidden space-y-2">
            <div class="p-2 bg-white/[0.03] border border-white/5 rounded-xl text-center text-xs">
              <span class="text-gray-400 font-bold block mb-1">Aktueller Gedanke:</span>
              <span id="braindump-active-thought" class="text-rose-300 font-black text-sm">Gedanke</span>
            </div>
            <div class="grid grid-cols-4 gap-1.5 text-[9px] font-bold">
              <button onclick="sortBrainDump('daily')" class="py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25 rounded">Täglich</button>
              <button onclick="sortBrainDump('weekly')" class="py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/25 rounded">Wöchentlich</button>
              <button onclick="sortBrainDump('todo')" class="py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/25 rounded">Todo</button>
              <button onclick="sortBrainDump('shopping')" class="py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 rounded">Kauf</button>
            </div>
            <div class="flex justify-between items-center text-[9px] text-gray-500 pt-1">
              <span id="braindump-progress-counter">Noch 0 Gedanken</span>
              <button onclick="skipBrainDumpThought()" class="hover:text-white transition">Überspringen ⏭️</button>
            </div>
          </div>
        </div>

        <!-- 10-10-10 -->
        <div id="compass-pane-ten" class="hidden space-y-3">
          <p class="text-[10px] text-gray-400 leading-normal">
            Bewerte die Langzeitfolgen deiner Entscheidung mit die wissenschaftlich erprobten 10-10-10 Methode.
          </p>
          <div class="space-y-2 text-xs">
            <div class="flex items-center gap-2 bg-[#12121e]/80 border border-white/10 rounded-xl p-2">
              <span class="font-bold text-rose-400 shrink-0 min-w-[50px]">10 Min:</span>
              <input type="text" id="ten-input-mins" placeholder="Schreibe auf..." class="flex-1 bg-transparent border-0 outline-none text-xs text-white" />
            </div>
            <div class="flex items-center gap-2 bg-[#12121e]/80 border border-white/10 rounded-xl p-2">
              <span class="font-bold text-rose-400 shrink-0 min-w-[50px]">10 Mon:</span>
              <input type="text" id="ten-input-months" placeholder="Schreibe auf..." class="flex-1 bg-transparent border-0 outline-none text-xs text-white" />
            </div>
            <div class="flex items-center gap-2 bg-[#12121e]/80 border border-white/10 rounded-xl p-2">
              <span class="font-bold text-rose-400 shrink-0 min-w-[50px]">10 Jah:</span>
              <input type="text" id="ten-input-years" placeholder="Schreibe auf..." class="flex-1 bg-transparent border-0 outline-none text-xs text-white" />
            </div>
          </div>
          <div class="flex gap-2">
            <button onclick="saveTenPerspective()" class="flex-1 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-bold rounded-xl transition">Perspektive sichern 💾</button>
            <button onclick="clearTenPerspective()" class="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl text-xs font-semibold transition">Leeren</button>
          </div>
        </div>

        <!-- Worst Case -->
        <div id="compass-pane-fear" class="hidden space-y-3">
          <p class="text-[10px] text-gray-400 leading-normal">
            <b>Fear Setting</b> nach Tim Ferriss: Analysiere und entmystifiziere deine stärkste Blockade.
          </p>
          <div class="space-y-2 text-[11px]">
            <div>
              <label class="text-[9px] text-gray-500 font-bold block mb-1">Was ist das Schlimmste, das passieren könnte?</label>
              <input type="text" id="fear-worst" placeholder="Worst-Case Szenario" class="w-full p-2 bg-[#12121e]/80 border border-white/10 rounded-xl text-xs text-white outline-none" />
            </div>
            <div>
              <label class="text-[9px] text-gray-500 font-bold block mb-1">Wie könnte ich den Schaden reparieren?</label>
              <input type="text" id="fear-repair" placeholder="Gegenmaßnahmen" class="w-full p-2 bg-[#12121e]/80 border border-white/10 rounded-xl text-xs text-white outline-none" />
            </div>
            <div>
              <label class="text-[9px] text-gray-500 font-bold block mb-1">Welche Nachteile bringt Untätigkeit auf Dauer?</label>
              <input type="text" id="fear-inaction" placeholder="Verpasste Chancen" class="w-full p-2 bg-[#12121e]/80 border border-white/10 rounded-xl text-xs text-white outline-none" />
            </div>
          </div>
          <div class="flex gap-2">
            <button onclick="saveFearSettingPerspective()" class="flex-1 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-bold rounded-xl transition">Angst-Matrix sichern 💾</button>
            <button onclick="clearFearSetting()" class="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl text-xs font-semibold transition">Leeren</button>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- SOCIAL SCRIPTING MODAL -->
  <div id="helper-scripting-modal" class="hidden fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
    <div id="helper-scripting-card" class="mobile-modal-card animate-spring-modal w-full max-w-md bg-[#111116]/95 border border-indigo-500/30 p-6 rounded-2xl shadow-2xl backdrop-blur-xl text-white relative transition-all duration-300">
      <span onclick="closeScriptingModal()" class="modal-close-btn text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer transition">✕</span>

      <h3 class="text-white font-bold text-sm font-display mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
        <i data-lucide="scroll" class="w-4 h-4 text-indigo-400"></i>
        <span>Social-Skripter 📜</span>
      </h3>

      <div class="space-y-4">
        <p class="text-xs text-gray-400 leading-relaxed font-semibold">
          Ermöglicht das unkomplizierte Vorformulieren schwieriger Alltagstelefonate. Wähle eine Vorlage:
        </p>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-[9px] text-gray-500 font-bold block mb-1">Vorlagen-Auswahl</label>
            <select id="script-scenario-select" onchange="onScenarioSelectChange()" class="w-full p-2.5 bg-[#12121e]/80 border border-white/10 rounded-xl text-xs text-indigo-300 font-semibold outline-none focus:border-indigo-500 cursor-pointer">
              <option value="doctor">🩺 Arzttermin vereinbaren</option>
              <option value="cancel">❌ Termin absagen/verschieben</option>
              <option value="food">🍕 Essen bestellen (Lieferdienst)</option>
              <option value="handyman">🔧 Handwerker rufen</option>
              <option value="custom">✍️ Eigene Stichpunkte</option>
            </select>
          </div>
          <div>
            <label class="text-[9px] text-gray-500 font-bold block mb-1">Dein Vorname</label>
            <input type="text" id="script-user-name" placeholder="Dein Name" value="Jannis" class="w-full p-2.5 bg-[#12121e]/80 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-indigo-500 font-semibold" />
          </div>
        </div>

        <!-- Dynamic Fields populated via JS -->
        <div id="script-dynamic-fields" class="space-y-2.5"></div>

        <button onclick="generateSocialScript()" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition">Skript entwerfen 📝</button>

        <div id="script-result-box" class="hidden p-3.5 bg-indigo-950/20 border border-indigo-500/25 rounded-xl space-y-2">
          <div class="text-[9px] uppercase font-bold tracking-wider text-indigo-400">Telefon-Skript (Sprechvorlage):</div>
          <div id="script-text-container" class="p-2.5 bg-black/40 border border-white/5 rounded-xl text-xs leading-relaxed text-gray-200 select-all font-semibold whitespace-pre-line max-h-36 overflow-y-auto"></div>
          <button onclick="copyGeneratedScript()" class="w-full py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[10px] font-bold rounded-xl transition">In Zwischenablage kopieren 📋</button>
        </div>
      </div>
    </div>
  </div>

  <!-- HELPER STEP-BY-STEP & CUSTOM SUBTASKS MODAL -->
  <div id="helper-steps-modal" class="hidden fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
    <div class="mobile-modal-card animate-spring-modal w-full max-w-lg bg-[#111116]/95 border border-[var(--accent)]/30 p-6 rounded-2xl shadow-2xl backdrop-blur-xl text-white relative transition-all duration-300">
      <span onclick="closeHelperModal()" class="modal-close-btn text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer transition">✕</span>

      <div class="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <h3 class="text-white font-bold text-sm font-display flex items-center gap-2">
          <i data-lucide="footprints" class="w-4 h-4 text-[var(--accent-light)]"></i>
          <span>Teilschritte & Checkliste</span>
        </h3>
        <button onclick="loadDefaultStepSuggestions()" class="text-[10px] px-2.5 py-1 bg-white/5 hover:bg-white/10 hover:text-[var(--accent-light)] border border-white/10 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1" title="Vordefinierte Flow-Vorschläge laden">
          <i data-lucide="sparkles" class="w-3 h-3 text-amber-400"></i>
          <span>Vorschläge laden</span>
        </button>
      </div>

      <div class="space-y-3">
        <!-- Selected Task Selector -->
        <div>
          <label class="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Aufgabe</label>
          <select id="helper-task-select" onchange="onHelperSelectTask()" class="w-full p-2.5 bg-[#12121e]/90 border border-white/10 rounded-xl text-xs text-purple-200 font-semibold outline-none focus:border-[var(--accent)] cursor-pointer"></select>
        </div>

        <!-- Custom Steps List Container -->
        <div id="helper-steps-result" class="max-h-[220px] overflow-y-auto pr-1 space-y-1.5 min-h-[60px]"></div>

        <!-- Add Custom Step Input -->
        <div class="flex items-center gap-2 pt-1">
          <input type="text" id="helper-new-step-input" placeholder="Eigenen Teilschritt eingeben (Enter)..." onkeydown="if(event.key==='Enter') addCustomStepToActiveTask()" class="flex-1 p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-gray-200 outline-none focus:border-[var(--accent)] placeholder:text-gray-500 font-medium" />
          <button onclick="addCustomStepToActiveTask()" class="px-3.5 py-2.5 bg-[var(--accent)] hover:opacity-90 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 shrink-0 shadow-md">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            <span>Schritt</span>
          </button>
        </div>

        <!-- Focus Mode & Timer Actions -->
        <div class="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
          <button onclick="startZenFromStepsModal()" class="px-3 py-1.5 bg-gradient-to-r from-[var(--accent)] to-indigo-600 hover:opacity-90 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md">
            <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-300"></i>
            <span>Im Fokus-Modus starten</span>
          </button>
          
          <div id="helper-steps-timer-widget" class="flex items-center gap-1.5 bg-black/40 border border-white/10 px-2 py-1 rounded-xl">
            <span id="helper-steps-timer-task" class="hidden"></span>
            <span id="helper-steps-timer-display" class="font-mono font-bold text-xs text-gray-300">02:00</span>
            <button id="helper-steps-timer-play" onclick="startTimer()" class="p-1 hover:bg-emerald-500/20 text-emerald-400 rounded transition cursor-pointer">
              <i data-lucide="play" class="w-3.5 h-3.5"></i>
            </button>
            <button id="helper-steps-timer-pause" onclick="pauseTimer()" class="p-1 hover:bg-amber-500/20 text-amber-400 rounded transition cursor-pointer hidden">
              <i data-lucide="pause" class="w-3.5 h-3.5"></i>
            </button>
            <button id="helper-steps-timer-stop" onclick="stopTimer()" class="p-1 hover:bg-rose-500/20 text-rose-400 rounded transition cursor-pointer">
              <i data-lucide="square" class="w-3 h-3"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- NOTIZ-DETAIL / BEARBEITEN MODAL -->
  <div id="note-detail-modal" class="hidden fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
    <div class="mobile-modal-card animate-spring-modal w-full max-w-lg bg-[#111116]/95 border border-amber-500/30 p-6 rounded-2xl shadow-2xl backdrop-blur-xl text-white relative transition-all duration-300">
      <span onclick="closeNoteDetailModal()" class="modal-close-btn text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer transition">✕</span>

      <div class="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <h3 class="text-white font-bold text-sm font-display flex items-center gap-2">
          <i data-lucide="sticky-note" class="w-4 h-4 text-amber-400"></i>
          <span>Notiz bearbeiten</span>
        </h3>
      </div>

      <div class="space-y-3.5">
        <input type="hidden" id="note-detail-index" value="-1" />
        <textarea id="note-detail-textarea" rows="7" placeholder="Notiztext hier bearbeiten..." class="w-full p-3.5 bg-black/50 border border-amber-500/30 rounded-xl text-xs text-amber-100 outline-none focus:border-amber-400 font-medium leading-relaxed resize-none shadow-inner"></textarea>

        <div class="flex items-center justify-between gap-2 pt-1">
          <div class="flex items-center gap-1.5">
            <button onclick="convertCurrentNoteDetailToTask()" class="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1">
              <i data-lucide="arrow-right-circle" class="w-3.5 h-3.5"></i>
              <span>In To-Do umwandeln</span>
            </button>
            <button onclick="copyCurrentNoteDetailText()" class="p-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl transition cursor-pointer" title="Kopieren">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="deleteCurrentNoteDetail()" class="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition cursor-pointer" title="Löschen">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="closeNoteDetailModal()" class="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer">Abbrechen</button>
            <button onclick="saveNoteDetailModal()" class="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center gap-1">
              <i data-lucide="check" class="w-4 h-4"></i>
              <span>Speichern</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <canvas id="confetti-canvas" class="fixed inset-0 z-[99999] pointer-events-none w-full h-full"></canvas>

  <!-- GAMIFICATION TOGGLE BUTTON -->
  <div id="game-mode-toggle-wrapper" class="fixed bottom-4 right-4 z-[100001] flex items-center gap-2">
    <button id="game-mode-toggle" onclick="toggleGameMode()" class="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 border border-white/20 shadow-[0_0_20px_rgba(236,72,153,0.4)] flex items-center justify-center text-white cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95" title="Spielmodus (3D) starten / beenden">
      <i data-lucide="gamepad-2" id="game-mode-icon" class="w-6 h-6 animate-pulse text-white"></i>
    </button>
  </div>

  <!-- 3D GAME MODE VIEWPORT & HOLOGRAPHIC GAMER HUD ("FLOW NEXUS 3D SUITE") -->
  <div id="game-mode-container" class="hidden fixed inset-0 z-[99998] bg-[#070712] select-none font-sans overflow-hidden">
    <!-- Three.js Canvas gets injected here -->
    <div id="game-canvas-parent" class="w-full h-full absolute inset-0"></div>
    
    <!-- HUD OVERLAY -->
    <div class="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5">
      
      <!-- TOP BAR: Hero Level, XP, 5 3D Worlds Selector, Exit -->
      <div class="flex items-center justify-between gap-2 pointer-events-auto w-full z-20 bg-[#0d0d18]/95 backdrop-blur-xl border border-white/10 p-2.5 sm:p-3 rounded-2xl shadow-2xl flex-wrap">
        <!-- Hero Stats -->
        <div class="flex items-center gap-2.5">
          <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg shadow-lg border border-white/20">
            👑
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span class="text-xs font-black text-white" id="game-player-level">LVL 1</span>
              <span id="game-player-combo-badge" class="hidden px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black font-mono border border-rose-500/40 animate-pulse">🔥 2x COMBO</span>
            </div>
            <div class="w-24 sm:w-32 bg-white/10 h-1.5 rounded-full overflow-hidden border border-white/5 relative mt-1">
              <div id="game-player-xp-bar" class="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-300" style="width: 0%"></div>
            </div>
          </div>
        </div>

        <!-- 5 QUALITATIVE 3D WORLDS & STORY RPG SELECTOR -->
        <div class="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 overflow-x-auto max-w-full">
          <button onclick="switchGameWorld('orbit_deck')" class="px-2.5 py-1.5 rounded-lg text-xs font-bold transition hover:bg-purple-600/30 text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer" title="Sci-Fi Orbit-Deck & Holo-Zentrale">
            <span>🌌</span> <span class="hidden md:inline">Orbit-Deck</span>
          </button>
          <button onclick="switchGameWorld('floating_island')" class="px-2.5 py-1.5 rounded-lg text-xs font-bold transition hover:bg-emerald-600/30 text-emerald-300 hover:text-white flex items-center gap-1 cursor-pointer" title="Cozy Floating Island & Zen-Garten">
            <span>🏝️</span> <span class="hidden md:inline">Zen-Insel</span>
          </button>
          <button onclick="switchGameWorld('task_metropolis')" class="px-2.5 py-1.5 rounded-lg text-xs font-bold transition hover:bg-blue-600/30 text-blue-300 hover:text-white flex items-center gap-1 cursor-pointer" title="3D Task-Metropole">
            <span>🏙️</span> <span class="hidden md:inline">Metropole</span>
          </button>
          <button onclick="switchGameWorld('galaxy_runner')" class="px-2.5 py-1.5 rounded-lg text-xs font-bold transition hover:bg-pink-600/30 text-pink-300 hover:text-white flex items-center gap-1 cursor-pointer" title="Galaxy Runner Cockpit">
            <span>🚀</span> <span class="hidden md:inline">Warp-Cockpit</span>
          </button>
          <button onclick="switchGameWorld('quest_adventure')" class="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer" title="Chronicles of Flow 3D Action-RPG">
            <span>⚔️</span> <span class="hidden md:inline">RPG-Abenteuer</span>
          </button>
        </div>

        <!-- Exit 3D Game -->
        <button onclick="toggleGameMode()" class="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md">
          <i data-lucide="log-out" class="w-3.5 h-3.5 text-rose-400"></i>
          <span class="hidden sm:inline">Planer</span>
        </button>
      </div>

      <!-- MIDDLE CONTENT AREA: ACTIVE QUEST BANNER -->
      <div class="flex justify-center items-center w-full z-10">
        <div class="bg-black/80 backdrop-blur-xl border border-purple-500/40 px-5 py-3 rounded-2xl pointer-events-auto text-center max-w-xl w-full shadow-2xl relative transition duration-300">
          <div id="game-active-quest-text" class="text-xs sm:text-sm font-black text-purple-200 leading-snug">🎯 Klicke auf ein 3D-Aufgabenobjekt oder steuere deinen Helden mit WASD!</div>
        </div>
      </div>

      <!-- BOTTOM: INTEGRATED HOLOGRAPHIC 3D DOCK & GAMER TOOLS -->
      <div class="flex flex-col items-center gap-2 w-full z-10 pointer-events-auto">
        <div class="flex items-center gap-1.5 p-1.5 bg-[#0d0d18]/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl flex-wrap justify-center">
          
          <!-- 3D Timer Control -->
          <div class="flex items-center gap-1.5 px-2.5 py-1 bg-purple-950/40 border border-purple-500/30 rounded-xl">
            <i data-lucide="timer" class="w-3.5 h-3.5 text-purple-400"></i>
            <span id="game-hud-timer-display" class="font-mono font-black text-xs text-purple-200">00:00</span>
            <button onclick="game3DQuickTimerToggle()" class="p-1 hover:bg-purple-500/20 text-purple-300 rounded-lg transition cursor-pointer" title="Timer Start / Stop">
              <i data-lucide="play" class="w-3 h-3"></i>
            </button>
          </div>

          <div class="h-5 w-[1px] bg-white/10 mx-0.5 hidden sm:block"></div>

          <!-- Dock Tools in 3D -->
          <button onclick="game3DOpenDockTool('sounds')" class="px-2.5 py-1.5 bg-white/5 hover:bg-purple-500/20 text-gray-300 hover:text-purple-300 border border-white/5 hover:border-purple-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer" title="Musik & Lo-Fi Sounds">
            <i data-lucide="headphones" class="w-3.5 h-3.5 text-purple-400"></i>
            <span class="hidden md:inline">Audio</span>
          </button>

          <button onclick="game3DOpenDockTool('shopping')" class="px-2.5 py-1.5 bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300 border border-white/5 hover:border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer" title="Einkaufsliste & Loot">
            <i data-lucide="shopping-bag" class="w-3.5 h-3.5 text-emerald-400"></i>
            <span class="hidden md:inline">Loot / Einkauf</span>
          </button>

          <button onclick="game3DOpenDockTool('cooking')" class="px-2.5 py-1.5 bg-white/5 hover:bg-amber-500/20 text-gray-300 hover:text-amber-300 border border-white/5 hover:border-amber-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer" title="Rezepte & Kessel">
            <i data-lucide="utensils" class="w-3.5 h-3.5 text-amber-400"></i>
            <span class="hidden md:inline">Rezepte</span>
          </button>

          <button onclick="game3DOpenDockTool('sport')" class="px-2.5 py-1.5 bg-white/5 hover:bg-orange-500/20 text-gray-300 hover:text-orange-300 border border-white/5 hover:border-orange-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer" title="Sport & Vitality">
            <i data-lucide="dumbbell" class="w-3.5 h-3.5 text-orange-400"></i>
            <span class="hidden md:inline">Sport</span>
          </button>

          <button onclick="game3DOpenDockTool('report')" class="px-2.5 py-1.5 bg-white/5 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer" title="Quest-Statistik">
            <i data-lucide="bar-chart-3" class="w-3.5 h-3.5 text-cyan-400"></i>
            <span class="hidden md:inline">Stats</span>
          </button>
        </div>

        <div class="text-[9px] text-gray-500 font-mono text-center">
          🎮 <b>Klick</b>: Aufgabe wählen / Fokus starten | <b>WASD / Pfeile</b>: Held steuern | <b>Rechtsklick/Ziehen</b>: Kamera drehen | <b>Scroll</b>: Zoom
        </div>
      </div>

    </div>
  </div>

  <!-- SAMMEL-IMPORT MODAL (FÜR TO-DO, NOTIZEN & CO) -->
  <div id="text-import-modal" class="hidden fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
    <div class="mobile-modal-card animate-spring-modal w-full max-w-lg bg-[#111116]/95 border border-[var(--accent)]/30 p-6 rounded-2xl shadow-2xl backdrop-blur-xl text-white relative transition-all duration-300">
      <span onclick="closeTextImportModal()" class="modal-close-btn text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer transition">✕</span>

      <div class="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <h3 class="text-white font-bold text-sm font-display flex items-center gap-2">
          <i data-lucide="file-text" class="w-4 h-4 text-[var(--accent-light)]"></i>
          <span>Sammel-Import</span>
          <span class="text-xs text-gray-400 font-normal">➔ Ziel:</span>
          <span id="text-import-cat-label" class="px-2 py-0.5 rounded-full bg-[var(--accent)]/20 text-[var(--accent-light)] text-[10px] font-bold uppercase tracking-wider font-mono">To-Do</span>
        </h3>
      </div>

      <div class="space-y-3.5">
        <p class="text-xs text-gray-400 leading-relaxed">
          Wähle eine Datei (<strong>.txt, .md, .csv, .json, .ics</strong>) aus oder füge Text direkt ein. Kalendereinladungen (.ics), Listen und Checkboxen werden automatisch erkannt:
        </p>

        <!-- FILE UPLOAD TRIGGER -->
        <div class="flex items-center gap-2">
          <label class="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[var(--accent)]/40 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition cursor-pointer flex items-center justify-center gap-2">
            <i data-lucide="upload-cloud" class="w-4 h-4 text-[var(--accent-light)]"></i>
            <span>Datei laden (.txt, .md, .csv, .json, .ics)</span>
            <input type="file" id="text-import-file-input" accept=".txt,.text,.md,.markdown,.csv,.json,.tsv,.ics,.log,.rtf" onchange="handleTextFileSelected(event)" class="hidden" />
          </label>
          <span id="text-import-count-badge" class="px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-[10px] font-mono text-emerald-400 font-bold shrink-0">0 Einträge</span>
        </div>

        <!-- PASTE TEXTAREA -->
        <div>
          <textarea id="text-import-textarea" oninput="updateTextImportPreview()" rows="6" placeholder="Aufgaben oder Notizen hier einfügen...&#10;&#10;Beispiel:&#10;Milch und Obst einkaufen&#10;Steuerunterlagen sortieren&#10;Fahrrad aufpumpen" class="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-xs text-gray-200 outline-none focus:border-[var(--accent)] font-medium leading-relaxed resize-none"></textarea>
        </div>

        <!-- ACTION BUTTONS -->
        <div class="flex items-center justify-end gap-2 pt-1">
          <button onclick="closeTextImportModal()" class="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer">Abbrechen</button>
          <button onclick="executeTextImport()" class="px-5 py-2 bg-[var(--accent)] hover:opacity-90 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center gap-1.5">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>Importieren</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- BERICHT-EXPORT MODAL (WOCHE & MONAT) -->
  <div id="report-export-modal" class="hidden fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
    <div class="mobile-modal-card animate-spring-modal w-full max-w-2xl bg-[#111116]/95 border border-purple-500/30 p-6 rounded-2xl shadow-2xl backdrop-blur-xl text-white relative transition-all duration-300">
      <span onclick="closeReportExportModal()" class="modal-close-btn text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer transition">✕</span>

      <div class="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <h3 class="text-white font-bold text-sm md:text-base font-display flex items-center gap-2">
          <i data-lucide="file-text" class="w-4 h-4 text-purple-400"></i>
          <span>Statistik- & Fortschrittsbericht</span>
          <span class="text-xs text-purple-300 font-mono font-normal">(Woche & Monat)</span>
        </h3>
      </div>

      <div class="space-y-3.5">
        <div class="relative">
          <textarea id="report-export-text-area" rows="12" readonly class="w-full p-4 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-gray-200 leading-relaxed outline-none focus:border-purple-400 select-all resize-none"></textarea>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div class="flex items-center gap-2">
            <button onclick="copyReportText()" class="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i>
              <span>Text kopieren</span>
            </button>
            <button onclick="downloadReportFile()" class="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5">
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
              <span>Als .txt herunterladen</span>
            </button>
            <button onclick="printReport()" class="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5">
              <i data-lucide="printer" class="w-3.5 h-3.5"></i>
              <span>Drucken / PDF</span>
            </button>
          </div>

          <button onclick="closeReportExportModal()" class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition cursor-pointer">
            Schließen
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- NATIVES MOBILE MENÜ DRAWER -->
  <div id="mobile-menu-drawer" class="hidden fixed inset-0 z-[100002] flex items-end justify-center bg-black/75 backdrop-blur-md animate-fade-in" onclick="if(event.target === this) closeMobileMenuDrawer();">
    <div class="mobile-modal-card w-full max-w-lg bg-[#14141e] border-t border-white/15 rounded-t-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 class="font-display font-bold text-base text-white flex items-center gap-2">
          <i data-lucide="menu" class="w-4 h-4 text-purple-400"></i>
          <span>Menü & Einstellungen</span>
        </h3>
        <button onclick="closeMobileMenuDrawer()" class="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <div class="space-y-2">
        <div class="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-mono">Datensicherung & Export</div>
        <div class="grid grid-cols-2 gap-2">
          <button onclick="closeMobileMenuDrawer(); exportData();" class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-left hover:bg-emerald-500/20 transition flex items-center gap-2.5 text-xs font-bold text-emerald-300 cursor-pointer">
            <i data-lucide="download" class="w-4 h-4 text-emerald-400"></i>
            <span>Backup Export</span>
          </button>
          <button onclick="closeMobileMenuDrawer(); importData();" class="p-3 bg-white/[0.04] border border-white/10 rounded-2xl text-left hover:bg-white/[0.08] transition flex items-center gap-2.5 text-xs font-bold text-gray-200 cursor-pointer">
            <i data-lucide="upload" class="w-4 h-4 text-purple-400"></i>
            <span>Wiederherstellen</span>
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <div class="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-mono">Ansicht & Auswertung</div>
        <div class="grid grid-cols-2 gap-2">
          <button onclick="closeMobileMenuDrawer(); togglePanel('report');" class="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-left hover:bg-purple-500/20 transition flex items-center gap-2.5 text-xs font-bold text-purple-200">
            <i data-lucide="bar-chart-3" class="w-4 h-4 shrink-0 text-purple-400"></i>
            <span>Statistik / Bericht</span>
          </button>
          <button onclick="closeMobileMenuDrawer(); togglePanel('theme');" class="p-3 bg-white/[0.04] border border-white/10 rounded-2xl text-left hover:bg-white/[0.08] transition flex items-center gap-2.5 text-xs font-bold text-gray-200">
            <i data-lucide="palette" class="w-4 h-4 shrink-0 text-purple-300"></i>
            <span>Farbschemas</span>
          </button>
          <button onclick="closeMobileMenuDrawer(); togglePanel('language');" class="p-3 bg-white/[0.04] border border-white/10 rounded-2xl text-left hover:bg-white/[0.08] transition flex items-center gap-2.5 text-xs font-bold text-gray-200">
            <i data-lucide="globe" class="w-4 h-4 shrink-0 text-blue-400"></i>
            <span>Sprache</span>
          </button>
          <button onclick="closeMobileMenuDrawer(); togglePanel('pause-dropdown');" class="p-3 bg-teal-500/10 border border-teal-500/20 rounded-2xl text-left hover:bg-teal-500/20 transition flex items-center gap-2.5 text-xs font-bold text-teal-300">
            <i data-lucide="shield" class="w-4 h-4 shrink-0 text-teal-400"></i>
            <span>Reizpause</span>
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <div class="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-mono">Aktionen & Daten</div>
        <div class="grid grid-cols-2 gap-2">
          <button onclick="closeMobileMenuDrawer(); handleUndo();" class="p-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-left hover:bg-white/[0.08] transition flex items-center gap-2 text-xs font-semibold text-gray-200">
            <i data-lucide="undo" class="w-3.5 h-3.5 text-amber-400"></i>
            <span>Rückgängig</span>
          </button>
          <button onclick="closeMobileMenuDrawer(); handleSaveJson();" class="p-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-left hover:bg-white/[0.08] transition flex items-center gap-2 text-xs font-semibold text-gray-200">
            <i data-lucide="save" class="w-3.5 h-3.5 text-emerald-400"></i>
            <span>Plan sichern</span>
          </button>
          <button onclick="closeMobileMenuDrawer(); document.getElementById('file-input').click();" class="p-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-left hover:bg-white/[0.08] transition flex items-center gap-2 text-xs font-semibold text-gray-200">
            <i data-lucide="folder-open" class="w-3.5 h-3.5 text-amber-300"></i>
            <span>Plan laden</span>
          </button>
          <button onclick="closeMobileMenuDrawer(); handleReset();" class="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-left hover:bg-rose-500/20 transition flex items-center gap-2 text-xs font-semibold text-rose-300">
            <i data-lucide="refresh-cw" class="w-3.5 h-3.5 text-rose-400"></i>
            <span>Zurücksetzen</span>
          </button>
        </div>
      </div>

      <div class="pt-2 border-t border-white/10 flex flex-col gap-2">
        <div class="flex gap-2">
          <button onclick="closeMobileMenuDrawer(); togglePanel('feedback');" class="flex-1 py-2.5 bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-pink-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2">
            <i data-lucide="message-square-heart" class="w-3.5 h-3.5"></i>
            <span>Feedback</span>
          </button>
          <button onclick="closeMobileMenuDrawer(); togglePanel('logo-guide');" class="py-2.5 px-4 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2">
            <i data-lucide="help-circle" class="w-3.5 h-3.5"></i>
            <span>Guide</span>
          </button>
        </div>
        <button onclick="closeMobileMenuDrawer(); openPrivacyModal();" class="w-full py-2 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 text-emerald-400 hover:text-emerald-300 rounded-xl text-[11px] font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer">
          <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
          <span>Datenschutz & Impressum (100% Local-First)</span>
        </button>
      </div>
    </div>
  </div>

  <!-- NATIVES MOBILE TOOLS SHEET -->
  <div id="mobile-tools-sheet" class="hidden fixed inset-0 z-[100002] flex items-end justify-center bg-black/75 backdrop-blur-md animate-fade-in" onclick="if(event.target === this) closeMobileToolsSheet();">
    <div class="mobile-modal-card w-full max-w-lg bg-[#14141e] border-t border-white/15 rounded-t-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 class="font-display font-bold text-base text-white flex items-center gap-2">
          <i data-lucide="sparkles" class="w-4 h-4 text-amber-400"></i>
          <span>Werkzeuge & Flow-Helfer</span>
        </h3>
        <button onclick="closeMobileToolsSheet()" class="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <div class="grid grid-cols-2 gap-2.5">
        <button onclick="closeMobileToolsSheet(); togglePanel('soundscape');" class="p-3 bg-white/[0.03] border border-white/10 rounded-2xl text-left hover:bg-white/[0.08] active:scale-95 transition flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
            <i data-lucide="volume-2" class="w-4 h-4"></i>
          </div>
          <div>
            <div class="text-xs font-bold text-white leading-tight">Soundscapes</div>
            <div class="text-[10px] text-gray-400">Regen, Café, Kamin</div>
          </div>
        </button>

        <button onclick="closeMobileToolsSheet(); togglePanel('music');" class="p-3 bg-white/[0.03] border border-white/10 rounded-2xl text-left hover:bg-white/[0.08] active:scale-95 transition flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-300 shrink-0">
            <i data-lucide="music" class="w-4 h-4"></i>
          </div>
          <div>
            <div class="text-xs font-bold text-white leading-tight">Musik</div>
            <div class="text-[10px] text-gray-400">Lofi & Ambient</div>
          </div>
        </button>

        <button onclick="closeMobileToolsSheet(); togglePanel('alarm');" class="p-3 bg-white/[0.03] border border-white/10 rounded-2xl text-left hover:bg-white/[0.08] active:scale-95 transition flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
            <i data-lucide="alarm-clock" class="w-4 h-4"></i>
          </div>
          <div>
            <div class="text-xs font-bold text-white leading-tight">Wecker</div>
            <div class="text-[10px] text-gray-400">Termine & Alarme</div>
          </div>
        </button>

        <button onclick="closeMobileToolsSheet(); togglePanel('cooking');" class="p-3 bg-white/[0.03] border border-white/10 rounded-2xl text-left hover:bg-white/[0.08] active:scale-95 transition flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-300 shrink-0">
            <i data-lucide="cooking-pot" class="w-4 h-4"></i>
          </div>
          <div>
            <div class="text-xs font-bold text-white leading-tight">Kochen</div>
            <div class="text-[10px] text-gray-400">Vorrat & Rezepte</div>
          </div>
        </button>

        <button onclick="closeMobileToolsSheet(); togglePanel('shopping');" class="p-3 bg-white/[0.03] border border-white/10 rounded-2xl text-left hover:bg-white/[0.08] active:scale-95 transition flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
            <i data-lucide="shopping-basket" class="w-4 h-4"></i>
          </div>
          <div>
            <div class="text-xs font-bold text-white leading-tight">Einkauf</div>
            <div class="text-[10px] text-gray-400">Einkaufsliste</div>
          </div>
        </button>

        <button onclick="closeMobileToolsSheet(); openCompassModal();" class="p-3 bg-white/[0.03] border border-white/10 rounded-2xl text-left hover:bg-white/[0.08] active:scale-95 transition flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 shrink-0">
            <i data-lucide="compass" class="w-4 h-4"></i>
          </div>
          <div>
            <div class="text-xs font-bold text-white leading-tight">Kompass</div>
            <div class="text-[10px] text-gray-400">Entscheidungshilfe</div>
          </div>
        </button>

        <button onclick="closeMobileToolsSheet(); togglePanel('boost');" class="p-3 bg-white/[0.03] border border-white/10 rounded-2xl text-left hover:bg-white/[0.08] active:scale-95 transition flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-300 shrink-0">
            <i data-lucide="zap" class="w-4 h-4"></i>
          </div>
          <div>
            <div class="text-xs font-bold text-white leading-tight">Schwung-Impuls</div>
            <div class="text-[10px] text-gray-400">30s Überwindung</div>
          </div>
        </button>

        <button onclick="closeMobileToolsSheet(); openClarityModal();" class="p-3 bg-white/[0.03] border border-white/10 rounded-2xl text-left hover:bg-white/[0.08] active:scale-95 transition flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0">
            <i data-lucide="anchor" class="w-4 h-4"></i>
          </div>
          <div>
            <div class="text-xs font-bold text-white leading-tight" data-i18n="dock_clarity">Klarheit</div>
            <div class="text-[10px] text-gray-400" data-i18n="clarity_subtitle">Impulskontrolle & Reflexion</div>
          </div>
        </button>

        <button onclick="closeMobileToolsSheet(); openSportModal();" class="p-3 bg-white/[0.03] border border-white/10 rounded-2xl text-left hover:bg-white/[0.08] active:scale-95 transition flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
            <i data-lucide="dumbbell" class="w-4 h-4"></i>
          </div>
          <div>
            <div class="text-xs font-bold text-white leading-tight">Sport & Körper</div>
            <div class="text-[10px] text-gray-400">1-Minuten Workouts</div>
          </div>
        </button>

        <button onclick="closeMobileToolsSheet(); togglePanel('weather'); fetchLocalWeather();" class="p-3 bg-white/[0.03] border border-white/10 rounded-2xl text-left hover:bg-white/[0.08] active:scale-95 transition flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-300 shrink-0">
            <i data-lucide="cloud-sun" class="w-4 h-4"></i>
          </div>
          <div>
            <div class="text-xs font-bold text-white leading-tight" data-i18n="dock_weather">Wetter</div>
            <div class="text-[10px] text-gray-400">Live & 5-Tage Trend</div>
          </div>
        </button>

        <button onclick="closeMobileToolsSheet(); togglePanel('news'); renderNewsBriefing();" class="p-3 bg-white/[0.03] border border-white/10 rounded-2xl text-left hover:bg-white/[0.08] active:scale-95 transition flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
            <i data-lucide="newspaper" class="w-4 h-4"></i>
          </div>
          <div>
            <div class="text-xs font-bold text-white leading-tight" data-i18n="dock_news">Nachrichten</div>
            <div class="text-[10px] text-gray-400">Daily Digest & Positives</div>
          </div>
        </button>
      </div>
    </div>
  </div>

  <!-- KLARHEIT & IMPULSKONTROLLE MODAL -->
  <div id="clarity-modal" class="hidden fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
    <div class="bg-[#111118] border border-teal-500/40 rounded-3xl max-w-lg w-full p-5 shadow-2xl relative text-white flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
      
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
            <i data-lucide="anchor" class="w-4 h-4"></i>
          </div>
          <div>
            <h3 class="font-bold text-base font-display text-white flex items-center gap-1.5" data-i18n="clarity_title">
              Klarheit & Impulskontrolle
            </h3>
            <p class="text-[10px] text-gray-400" data-i18n="clarity_subtitle">
              Muster durchbrechen, Drang meistern & gesunde Gewohnheiten stärken
            </p>
          </div>
        </div>
        <button onclick="closeClarityModal()" class="text-gray-400 hover:text-white p-1 rounded-lg transition cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Navigation Tabs -->
      <div class="grid grid-cols-5 gap-1 bg-black/40 p-1 rounded-2xl border border-white/5 text-[10px] font-bold text-center">
        <button onclick="switchClarityTab('urge')" id="clarity-tab-urge" class="py-1.5 px-1 rounded-xl transition cursor-pointer flex flex-col items-center gap-0.5">
          <span>🌊</span>
          <span class="truncate">Urge Surfing</span>
        </button>
        <button onclick="switchClarityTab('halt')" id="clarity-tab-halt" class="py-1.5 px-1 rounded-xl transition cursor-pointer flex flex-col items-center gap-0.5">
          <span>🔍</span>
          <span class="truncate">HALT</span>
        </button>
        <button onclick="switchClarityTab('shift')" id="clarity-tab-shift" class="py-1.5 px-1 rounded-xl transition cursor-pointer flex flex-col items-center gap-0.5">
          <span>⚡</span>
          <span class="truncate">Shift</span>
        </button>
        <button onclick="switchClarityTab('future')" id="clarity-tab-future" class="py-1.5 px-1 rounded-xl transition cursor-pointer flex flex-col items-center gap-0.5">
          <span>🧭</span>
          <span class="truncate">Zukunft</span>
        </button>
        <button onclick="switchClarityTab('tracker')" id="clarity-tab-tracker" class="py-1.5 px-1 rounded-xl transition cursor-pointer flex flex-col items-center gap-0.5">
          <span>🛡️</span>
          <span class="truncate">Tracker</span>
        </button>
      </div>

      <!-- TAB 1: URGE SURFING (90-SEKUNDEN-WELLE) -->
      <div id="clarity-pane-urge" class="space-y-3.5 text-center">
        <div class="p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl space-y-2">
          <div class="text-3xl font-black font-mono text-teal-300" id="clarity-urge-time">1:30</div>
          <div class="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/10">
            <div id="clarity-urge-bar" class="bg-gradient-to-r from-teal-400 to-cyan-400 h-full w-0 transition-all duration-300"></div>
          </div>
          <div id="clarity-urge-breath-guide" class="text-xs font-bold text-teal-300">💨 Langsam einatmen (4s)...</div>
        </div>

        <div class="p-3 bg-black/40 border border-white/5 rounded-2xl min-h-[54px] flex items-center justify-center">
          <p id="clarity-urge-phrase" class="text-xs text-gray-300 italic leading-relaxed">
            Ein Verlangen ist wie eine Meereswelle: Es steigt an, erreicht seinen Scheitelpunkt und flacht ganz von allein ab. Du musst ihm nicht nachgeben.
          </p>
        </div>

        <button onclick="toggleClarityUrgeTimer()" id="clarity-urge-toggle-btn" class="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-black text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md">
          <i data-lucide="play" class="w-4 h-4"></i>
          <span>90s Welle reiten 🌊</span>
        </button>
      </div>

      <!-- TAB 2: HALT-CHECK (BEDÜRFNIS-DIAGNOSE) -->
      <div id="clarity-pane-halt" class="hidden space-y-3">
        <p class="text-xs text-gray-400 text-left">
          Der Drang ist fast immer ein Deckmantel für ein unbefriedigtes Grundbedürfnis. Welcher Zustand trifft gerade am ehesten zu?
        </p>

        <div class="grid grid-cols-2 gap-2">
          <button onclick="selectHaltCategory('hungry')" class="p-3 bg-white/[0.03] hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/40 rounded-2xl text-left transition cursor-pointer flex items-center gap-2.5">
            <span class="text-lg">🍎</span>
            <div>
              <div class="text-xs font-bold text-amber-300">Hunger</div>
              <div class="text-[9px] text-gray-400">Unterzuckert / leer</div>
            </div>
          </button>

          <button onclick="selectHaltCategory('angry')" class="p-3 bg-white/[0.03] hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/40 rounded-2xl text-left transition cursor-pointer flex items-center gap-2.5">
            <span class="text-lg">🔥</span>
            <div>
              <div class="text-xs font-bold text-rose-300">Frust & Wut</div>
              <div class="text-[9px] text-gray-400">Stress / Anspannung</div>
            </div>
          </button>

          <button onclick="selectHaltCategory('lonely')" class="p-3 bg-white/[0.03] hover:bg-purple-500/15 border border-white/10 hover:border-purple-500/40 rounded-2xl text-left transition cursor-pointer flex items-center gap-2.5">
            <span class="text-lg">💜</span>
            <div>
              <div class="text-xs font-bold text-purple-300">Einsamkeit</div>
              <div class="text-[9px] text-gray-400">Langeweile / Leere</div>
            </div>
          </button>

          <button onclick="selectHaltCategory('tired')" class="p-3 bg-white/[0.03] hover:bg-blue-500/15 border border-white/10 hover:border-blue-500/40 rounded-2xl text-left transition cursor-pointer flex items-center gap-2.5">
            <span class="text-lg">🌙</span>
            <div>
              <div class="text-xs font-bold text-blue-300">Müdigkeit</div>
              <div class="text-[9px] text-gray-400">Mentale Erschöpfung</div>
            </div>
          </button>
        </div>

        <div id="clarity-halt-result" class="hidden"></div>
      </div>

      <!-- TAB 3: DOPAMIN-SHIFT & GESUNDE ALTERNATIVEN -->
      <div id="clarity-pane-shift" class="hidden space-y-3 text-center">
        <p class="text-xs text-gray-400 text-left">
          Dein Gehirn will gerade eine Handlung ausführen. Lenke diesen Impuls in eine sofortige, gesunde Ersatzhandlung um:
        </p>

        <div id="clarity-shift-content" class="min-h-[100px] flex items-center justify-center">
          <div class="p-4 bg-teal-500/10 border border-teal-500/30 rounded-2xl text-left space-y-2 w-full">
            <div class="flex items-center gap-2 font-bold text-sm text-teal-300">
              <i data-lucide="snowflake" class="w-5 h-5 text-teal-400"></i>
              <span>Kaltwasser-Reiz (Tauchreflex)</span>
            </div>
            <p class="text-xs text-gray-200 leading-relaxed">
              Wasche dein Gesicht 20 Sekunden mit eiskaltem Wasser. Das aktiviert den Vagusnerv, senkt die Herzfrequenz und dämpft den Drang sofort ab.
            </p>
          </div>
        </div>

        <button onclick="suggestClarityShift()" class="w-full py-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5">
          <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
          <span>Andere Alternative vorschlagen 🔄</span>
        </button>
      </div>

      <!-- TAB 4: ZUKUNFTS-ICH (PERSPEKTIVEN-FILTER) -->
      <div id="clarity-pane-future" class="hidden space-y-3 text-left">
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl space-y-1">
            <div class="font-bold text-red-300 flex items-center gap-1">
              <span>⏳</span> 10 Minuten DANACH:
            </div>
            <p class="text-[11px] text-gray-300 leading-relaxed">
              Kurzer Dopamin-Flash ist verpufft. Gefühle von Erschöpfung, Bedauern, Kontrollverlust und innerer Leere.
            </p>
          </div>

          <div class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-1">
            <div class="font-bold text-emerald-300 flex items-center gap-1">
              <span>🌅</span> Morgen früh:
            </div>
            <p class="text-[11px] text-gray-300 leading-relaxed">
              Stolz, gestärkte Willenskraft, klare Gedanken und das erhebende Gefühl, selbstbestimmt geblieben zu sein.
            </p>
          </div>
        </div>

        <div class="space-y-2 pt-1 border-t border-white/10">
          <label class="text-[10px] text-gray-400 font-bold block">Dein persönlicher Ankergrund (Warum lohnt es sich standhaft zu bleiben?):</label>
          <div class="flex gap-1.5">
            <input type="text" id="clarity-reason-input" placeholder="Z.B. Meine Gesundheit, mentale Freiheit, Stolz..." class="flex-1 p-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-teal-500 font-semibold" />
            <button onclick="saveClarityReason()" class="px-3 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 rounded-xl text-xs font-bold border border-teal-500/30 transition cursor-pointer">Sichern 💾</button>
          </div>
          <div id="clarity-reasons-list" class="space-y-1.5 pt-1"></div>
        </div>
      </div>

      <!-- TAB 5: TAGE DER KLARHEIT (FREIHEITS-TRACKER) -->
      <div id="clarity-pane-tracker" class="hidden space-y-3 text-center">
        <div class="p-5 bg-gradient-to-b from-teal-500/20 via-teal-500/5 to-transparent border border-teal-500/30 rounded-3xl space-y-2">
          <div class="text-[10px] uppercase font-bold tracking-widest text-teal-400 font-mono">Deine Tage in bewusster Klarheit</div>
          <div class="text-5xl font-black font-display text-white drop-shadow-md" id="clarity-streak-count">0</div>
          <div class="text-xs text-gray-300">Tage der Freiheit & Selbstbestimmung</div>
        </div>

        <div class="grid grid-cols-3 gap-1.5 text-[10px] font-bold text-left">
          <div class="p-2 bg-white/[0.02] border border-white/5 rounded-xl">
            <span class="text-teal-400 block mb-0.5">🌱 Tag 1</span>
            <span class="text-gray-400 font-normal text-[9px]">Erster Sieg</span>
          </div>
          <div class="p-2 bg-white/[0.02] border border-white/5 rounded-xl">
            <span class="text-teal-400 block mb-0.5">⚡ Tag 7</span>
            <span class="text-gray-400 font-normal text-[9px]">Neuer Rhythmus</span>
          </div>
          <div class="p-2 bg-white/[0.02] border border-white/5 rounded-xl">
            <span class="text-teal-400 block mb-0.5">🏆 Tag 30</span>
            <span class="text-gray-400 font-normal text-[9px]">Starke Freiheit</span>
          </div>
        </div>

        <div class="flex gap-2 pt-1">
          <button onclick="incrementClarityStreak()" class="flex-1 py-2 bg-teal-500 hover:bg-teal-400 text-black text-xs font-bold rounded-xl transition cursor-pointer shadow-md">
            +1 Tag geschafft! 🎉
          </button>
          <button onclick="resetClarityStreak()" class="px-3 py-2 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-300 rounded-xl text-xs font-semibold border border-white/10 hover:border-red-500/30 transition cursor-pointer" title="Schamfreier Neustart">
            Neustart 🌱
          </button>
        </div>
      </div>

    </div>
  </div>

  <!-- SAMPLE TASK MANAGER MODAL -->
  <div id="sample-manager-modal" class="hidden fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
    <div class="bg-[#111118] border border-purple-500/40 rounded-3xl max-w-xl w-full p-5 shadow-2xl relative text-white flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
      
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <i data-lucide="sparkles" class="w-4 h-4"></i>
          </div>
          <div>
            <h3 class="font-bold text-base font-display text-white flex items-center gap-1.5" data-i18n="sample_modal_title">
              Beispiel-Aufgaben anpassen
            </h3>
            <p class="text-[10px] text-gray-400" data-i18n="sample_modal_subtitle">
              Wähle aus, welche Beispiel-Aufgaben du in dein Board übernehmen möchtest.
            </p>
          </div>
        </div>
        <button onclick="closeSampleManagerModal()" class="text-gray-400 hover:text-white p-1 rounded-lg transition cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center justify-between text-xs pt-1">
        <div class="flex items-center gap-2">
          <button onclick="toggleAllSampleCheckboxes(true)" class="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-purple-300 rounded-lg font-semibold text-[11px] border border-white/10 transition cursor-pointer">
            ✓ Alle anwählen
          </button>
          <button onclick="toggleAllSampleCheckboxes(false)" class="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg font-semibold text-[11px] border border-white/10 transition cursor-pointer">
            ✕ Alle abwählen
          </button>
        </div>
        <span id="sample-selected-counter" class="text-[11px] text-gray-400 font-mono">0 ausgewählt</span>
      </div>

      <!-- Categories Container -->
      <div id="sample-manager-content" class="space-y-4 max-h-[50vh] overflow-y-auto pr-1"></div>

      <!-- Footer Buttons -->
      <div class="flex gap-2 border-t border-white/10 pt-3">
        <button onclick="applySampleManagerSelection()" class="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-lg flex items-center justify-center gap-2">
          <i data-lucide="check" class="w-4 h-4"></i>
          <span data-i18n="sample_apply_btn">Auswahl ins Board übernehmen ✨</span>
        </button>
        <button onclick="closeSampleManagerModal()" class="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer" data-i18n="cancel">
          Abbrechen
        </button>
      </div>

    </div>
  </div>

  <!-- SUPERMARKT MODUS MODAL (Vollbild / Touch-Fokus Ansicht) -->
  <div id="supermarket-modal" class="hidden fixed inset-0 z-[100000] flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-lg animate-fade-in">
    <div class="bg-[#111118] border border-emerald-500/40 rounded-3xl max-w-2xl w-full p-4 md:p-6 shadow-2xl relative text-white flex flex-col gap-4 max-h-[92vh] overflow-hidden">
      
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <i data-lucide="shopping-cart" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg font-display text-white flex items-center gap-2" data-i18n="supermarket_title">
              Supermarkt-Modus 🛒
            </h3>
            <p class="text-xs text-gray-400" id="supermarket-progress-text">
              Lade Einkaufsliste...
            </p>
          </div>
        </div>
        <button onclick="closeSupermarketModal()" class="text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Progress Bar -->
      <div class="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/10">
        <div id="supermarket-progress-bar" class="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-300" style="width: 0%"></div>
      </div>

      <!-- Quick Add Input -->
      <div class="flex gap-2">
        <input type="text" id="supermarket-add-input" placeholder="Schnell hinzufügen (z.B. 2x Hafermilch, Tomaten)..." class="flex-1 p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-emerald-500 font-semibold" onkeydown="if(event.key==='Enter') handleAddShoppingItem();" />
        <button onclick="handleAddShoppingItem()" class="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md">
          <i data-lucide="plus" class="w-4 h-4"></i>
          <span data-i18n="add">Hinzufügen</span>
        </button>
      </div>

      <!-- Supermarket Content (Scrollable) -->
      <div id="supermarket-content" class="flex-1 overflow-y-auto pr-1 space-y-3"></div>

      <!-- Footer Buttons -->
      <div class="flex items-center justify-between border-t border-white/10 pt-3 text-xs">
        <button onclick="clearShoppingList()" class="px-3 py-2 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-300 rounded-xl border border-white/10 hover:border-red-500/30 transition cursor-pointer">
          Liste leeren 🗑️
        </button>
        <button onclick="closeSupermarketModal()" class="px-5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold rounded-xl transition cursor-pointer">
          Fertig / Schließen ✓
        </button>
      </div>

    </div>
  </div>

  <!-- Feierabend & Tagesabschluss-Celebration-Modal -->
  <div id="feierabend-celebration-modal" class="hidden fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-[10000] animate-fadeIn">
    <div class="bg-gradient-to-b from-[#1c182a] to-[#12101c] border border-amber-500/40 p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl relative flex flex-col items-center text-center space-y-4">
      <button onclick="closeFeierabendModal()" class="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>

      <!-- Feier-Icon / Badge mit sanftem Pulsieren -->
      <div class="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500/30 to-rose-500/30 border border-amber-400/50 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20">
        🍹
      </div>

      <div class="space-y-1.5">
        <span class="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Tagesziel Erreicht 🌟
        </span>
        <h3 class="text-2xl font-black font-display text-white" data-i18n="celebration_title">
          Du hast heute alles gerockt! 🎉
        </h3>
        <p class="text-xs text-gray-300 leading-relaxed max-w-xs mx-auto" data-i18n="celebration_desc">
          Alle heutigen Aufgaben sind vollständig erledigt. Gönn dir was Schönes, schalte ab und genieße deinen wohlverdienten Feierabend!
        </p>
      </div>

      <!-- Schnelle Feierabend-Aktionen -->
      <div class="w-full pt-2 flex flex-col gap-2">
        <button onclick="startFeierabendChillMode()" class="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-black font-black text-xs rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20">
          <i data-lucide="sparkles" class="w-4 h-4"></i>
          <span data-i18n="celebration_btn_chill">Feierabend-Modus & Relax-Sounds 🎶</span>
        </button>

        <button onclick="closeFeierabendModal()" class="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-xl border border-white/10 transition cursor-pointer">
          <span data-i18n="celebration_btn_later">Planer weiter ansehen ✓</span>
        </button>
      </div>
    </div>
  </div>

  <!-- DATENSCHUTZ & IMPRESSUM MODAL (DSGVO / PRIVACY BY DESIGN) -->
  <div id="privacy-legal-modal" class="hidden fixed inset-0 z-[200000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in" onclick="if(event.target===this) closePrivacyModal();">
    <div class="w-full max-w-lg bg-[#111118]/95 border border-purple-500/40 p-5 sm:p-6 rounded-3xl shadow-2xl backdrop-blur-2xl text-white flex flex-col gap-4 max-h-[85vh] overflow-y-auto" onclick="event.stopPropagation()">
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
          </div>
          <div>
            <h3 class="font-bold text-sm font-display text-white">Datenschutz & Impressum</h3>
            <span class="text-[10px] text-emerald-400 font-mono">100% Local-First · Zero Tracking</span>
          </div>
        </div>
        <button onclick="closePrivacyModal()" class="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <div class="space-y-3.5 text-xs text-gray-300 leading-relaxed">
        <div class="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
          <b class="text-white block mb-1">🛡️ Privacy by Design (Datenschutzversprechen):</b>
          Flow speichert alle deine Aufgaben, Einkaufslisten und Notizen <b>ausschließlich lokal in deinem Webbrowser (Local Storage)</b>. Es findet kein Tracking, keine Weitergabe an Werbenetzwerke und keine serverseitige Profilbildung statt.
        </div>

        <div>
          <h4 class="font-bold text-white mb-1">1. Datenspeicherung & Offline-Betrieb</h4>
          <p>Die Anwendung funktioniert vollständig offline. Deine Daten verbleiben auf deinem Gerät. Wenn du den optionalen Peer-to-Peer Cloud-Sync nutzt, werden Daten Ende-zu-Ende verschlüsselt ausgetauscht.</p>
        </div>

        <div>
          <h4 class="font-bold text-white mb-1">2. Externe Dienste & Medien</h4>
          <p>Eingebettete Medien (wie Spotify oder YouTube) unterliegen den Datenschutzbestimmungen der jeweiligen Anbieter und werden nur auf deine ausdrückliche Interaktion hin geladen.</p>
        </div>

        <div>
          <h4 class="font-bold text-white mb-1">3. Angaben gemäß § 5 TMG / Impressum</h4>
          <p class="text-gray-400">Flow Organiser Suite — Entwickelt als datenschutzfreundliche Open-Web Progressive Web App.</p>
        </div>
      </div>

      <div class="border-t border-white/10 pt-3 flex justify-end">
        <button onclick="closePrivacyModal()" class="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-xs transition cursor-pointer">
          Verstanden & Schließen
        </button>
      </div>
    </div>
  </div>
`);


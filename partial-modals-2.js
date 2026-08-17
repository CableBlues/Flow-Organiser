// Ausgelagert aus index.html: Wird per document.write an der Original-Position eingefuegt
document.write(`        <!-- ADHD-Prioritizer (NEUES MODUL 1) -->
        <div id="compass-pane-prioritizer" class="hidden space-y-3">
          <p class="text-[10px] text-gray-400 leading-normal">
            Bewerte Vorhaben nach Spaß (Dopamin) & Aufwand (Effort), um deine "Easy Wins" (leichte Erfolge) zur Überwindung von Blockaden zu identifizieren.
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
    <div id="helper-scripting-card" class="mobile-modal-card w-full max-w-md bg-[#111116]/95 border border-indigo-500/30 p-6 rounded-2xl shadow-2xl backdrop-blur-xl text-white relative transition-all duration-300">
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

  <!-- HELPER STEP-BY-STEP MODAL -->
  <div id="helper-steps-modal" class="hidden fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
    <div class="mobile-modal-card w-full max-w-lg bg-[#111116]/95 border p-6 rounded-2xl shadow-2xl backdrop-blur-xl text-white relative transition-all duration-300">
      <span onclick="closeHelperModal()" class="modal-close-btn text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer transition">✕</span>

      <h3 class="text-white font-bold text-sm font-display mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
        <i data-lucide="footprints" class="w-4 h-4 text-purple-400 animate-pulse"></i>
        <span>Schritt-für-Schritt-Anleitung</span>
      </h3>

      <div class="space-y-4">
        <!-- Dopamin-Ablenkungskiste -->
        <div id="dopamine-task-box" class="p-3 bg-pink-500/5 border border-pink-500/20 rounded-xl text-center flex flex-col gap-1.5 transition-all duration-300"></div>

        <div>
          <label class="text-[9px] text-gray-500 font-bold block mb-1">Ausgewählte Aufgabe</label>
          <select id="helper-task-select" onchange="onHelperSelectTask()" class="w-full p-2.5 bg-[#12121e]/80 border border-white/10 rounded-xl text-xs text-purple-300 font-semibold outline-none focus:border-purple-500 cursor-pointer"></select>
        </div>

        <div id="helper-steps-result" class="max-h-[190px] overflow-y-auto pr-1 space-y-2"></div>

        <div id="helper-steps-timer-widget" class="mx-auto max-w-[270px] w-full p-1.5 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-center gap-2.5 shadow-md">
          <span id="helper-steps-timer-task" class="hidden"></span>
          <div class="flex items-center gap-2 shrink-0">
            <div class="flex flex-col items-center justify-center min-w-[38px]">
              <span id="helper-steps-timer-display" class="font-display font-black text-xs tracking-wider leading-none">02:00</span>
              <div class="w-full h-0.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                <div id="helper-steps-timer-progress-bar" class="h-full bg-[var(--accent)] transition-all duration-300" style="width: 100%"></div>
              </div>
            </div>

            <select id="helper-steps-timer-preset-select-real" onchange="setTimerPreset(parseInt(this.value))" class="px-1 py-0.5 bg-black/60 border border-white/30 rounded text-[10px] font-bold text-gray-300 outline-none cursor-pointer transition shrink-0">
              <option value="2" selected>2m</option>
              <option value="5">5m</option>
              <option value="10">10m</option>
              <option value="12">12m</option>
              <option value="15">15m</option>
              <option value="20">20m</option>
              <option value="25">25m</option>
              <option value="30">30m</option>
              <option value="45">45m</option>
              <option value="60">60m</option>
            </select>

            <div class="flex items-center gap-1 shrink-0">
              <button id="helper-steps-timer-play" onclick="startTimer()" class="p-1 hover:bg-emerald-500/10 rounded transition cursor-pointer">
                <i data-lucide="play" class="w-3.5 h-3.5 text-emerald-400"></i>
              </button>
              <button id="helper-steps-timer-pause" onclick="pauseTimer()" class="p-1 hover:bg-amber-500/10 rounded transition cursor-pointer hidden animate-pulse">
                <i data-lucide="pause" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>
              </button>
              <button id="helper-steps-timer-stop" onclick="stopTimer()" class="p-1 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition cursor-pointer">
                <i data-lucide="square" class="w-3.5 h-3.5"></i>
              </button>
              <button id="helper-steps-timer-mute" onclick="toggleTimerSound()" class="p-1 hover:bg-white/10 text-gray-400 rounded transition cursor-pointer">
                <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <canvas id="confetti-canvas" class="fixed inset-0 z-[99999] pointer-events-none w-full h-full"></canvas>

  <!-- GAMIFICATION TOGGLE BUTTON -->
  <div class="fixed bottom-4 right-4 z-[100001] flex items-center gap-2">
    <button id="game-mode-toggle" onclick="toggleGameMode()" class="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 border border-white/20 shadow-[0_0_20px_rgba(236,72,153,0.4)] flex items-center justify-center text-white cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95" title="Spielmodus (3D) starten / beenden">
      <i data-lucide="gamepad-2" id="game-mode-icon" class="w-6 h-6 animate-pulse text-white"></i>
    </button>
  </div>

  <!-- 3D GAME MODE VIEWPORT & HUD -->
  <div id="game-mode-container" class="hidden fixed inset-0 z-[99998] bg-black select-none font-sans overflow-hidden">
    <!-- Three.js Canvas gets injected here -->
    <div id="game-canvas-parent" class="w-full h-full absolute inset-0"></div>
    
    <!-- HUD OVERLAY -->
    <div class="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6">
      <!-- TOP BAR: Stats, Environment Selector, XP -->
      <div class="flex flex-wrap items-center justify-between gap-4 pointer-events-auto w-full z-10 bg-[#13131c]/90 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
        <!-- Player Stats / RPG indicators -->
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xl shadow-inner">
            👑
          </div>
          <div class="flex flex-col">
            <div class="text-[10px] uppercase font-bold tracking-wider text-purple-300 font-mono">Flow Adventurer</div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-black text-white" id="game-player-level">LVL 1</span>
              <div class="w-28 bg-white/10 h-2 rounded-full overflow-hidden border border-white/5 relative">
                <div id="game-player-xp-bar" class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500" style="width: 0%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Environment Selector -->
        <div class="flex items-center gap-2">
          <span class="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-mono hidden sm:inline">3D World:</span>
          <select id="game-world-select" onchange="switchGameWorld(this.value)" class="px-3 py-1.5 bg-black border border-white/20 rounded-xl text-xs font-bold text-pink-300 outline-none cursor-pointer focus:border-pink-500 transition">
            <option value="space">🌌 Space Odyssey</option>
            <option value="nature">🌳 Zen Nature Sanctuary</option>
            <option value="rpg">⚔️ Heroic Quest Guild</option>
            <option value="erotik">💋 Neon Cabaret Lounge</option>
          </select>
        </div>

        <!-- Back to Reality button -->
        <button onclick="toggleGameMode()" class="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md">
          <i data-lucide="log-out" class="w-4 h-4 text-red-400"></i>
          <span>Normal Mode</span>
        </button>
      </div>

      <!-- MIDDLE BLOCK: Active Task Information Card / Quest log -->
      <div class="flex justify-center items-center w-full z-10">
        <div class="bg-black/60 backdrop-blur-md border border-pink-500/20 p-4 rounded-2xl pointer-events-auto text-center max-w-md w-full shadow-2xl relative transition duration-300 hover:border-pink-500/50">
          <span class="absolute top-1.5 right-2 px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[8px] font-bold font-mono tracking-widest uppercase">Target Quest</span>
          <div class="text-[10px] uppercase font-bold tracking-widest text-pink-400 font-mono mb-1">Active Adventure</div>
          <h3 id="game-active-quest-text" class="text-sm md:text-base font-black text-white leading-relaxed max-w-sm mx-auto">Klicke auf ein 3D Objekt um deine Quest abzuschließen!</h3>
        </div>
      </div>

      <!-- BOTTOM BAR: Instruction Tips / Quick controls -->
      <div class="flex items-center justify-between w-full z-10 pointer-events-auto">
        <div class="text-[10px] text-gray-400 font-medium font-mono bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
          🖱️ Links-Klick: Rotieren / Auswählen | Rechts-Klick: Verschieben | Scrollen: Zoom
        </div>
        <!-- Mini Game Music or sound trigger -->
        <button onclick="toggleGameMute()" id="game-sound-btn" class="h-8 px-3 bg-black/60 border border-white/10 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer shadow-sm">
          <i data-lucide="volume-2" id="game-sound-icon" class="w-4 h-4"></i>
          <span id="game-sound-text">Game SFX An</span>
        </button>
      </div>
    </div>
  </div>

`);

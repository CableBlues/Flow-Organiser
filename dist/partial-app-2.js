// Ausgelagert aus index.html: Wird per document.write an der Original-Position eingefuegt
document.write(`
    <!-- MOBILE: Horizontale Wisch-Leiste für Kategorie-Pills (nur auf Touch/Mobile sichtbar) -->
    <nav id="mobile-category-tabs" class="mobile-category-tabs mb-2" aria-label="Kategorien"></nav>

    <!-- DASHBOARD 7-COLUMN GRID -->
    <main class="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5 flex-1 w-full min-h-0 items-start">
      <!-- Generated columns via JS -->
    </main>

    <!-- ZEN CHILL VIEW / DEEP WORK CANVAS -->
    <div id="zen-chill-view" class="hidden flex-col items-center justify-center flex-1 max-w-3xl mx-auto w-full p-4 md:p-8 my-auto animate-fade-in select-none">
      <div class="relative bg-[#13131c]/90 border border-purple-500/30 rounded-3xl p-6 md:p-10 shadow-[0_0_60px_rgba(139,92,246,0.2)] backdrop-blur-2xl w-full flex flex-col items-center gap-5 transition-all duration-300">
        
        <!-- TOP STATUS BAR -->
        <div class="w-full flex items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Deep Work Focus
            </span>
            <span id="zen-task-cat" class="text-[10px] uppercase font-bold tracking-widest text-[var(--accent-light)] font-mono px-2.5 py-0.5 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-full">
              Empfehlung
            </span>
          </div>
          <button onclick="toggleMinimalist()" class="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer text-xs flex items-center gap-1" title="Focus Mode beenden (Esc)">
            <span class="text-[11px] font-semibold hidden sm:inline">Schließen</span>
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>
        
        <!-- FOCUSED TASK TITLE -->
        <div class="w-full text-center my-1">
          <h1 id="zen-task-text" class="font-display font-black text-2xl md:text-4xl text-white tracking-tight leading-tight max-w-xl mx-auto min-h-[3.5rem] flex items-center justify-center break-words">
            Lade Fokus-Aufgabe...
          </h1>
        </div>

        <!-- DYNAMIC SUBTASKS / CHECKLIST CONTAINER -->
        <div id="zen-task-steps-container" class="w-full max-w-lg bg-black/30 border border-white/5 rounded-2xl p-3 text-left space-y-1.5 max-h-40 overflow-y-auto hidden"></div>
        
        <!-- POMODORO TIMER BAR -->
        <div class="w-full max-w-lg flex flex-col items-center gap-2 bg-black/40 border border-white/10 p-3.5 rounded-2xl shadow-inner">
          <div class="flex items-center justify-between w-full px-2">
            <div class="flex items-center gap-3">
              <span id="zen-timer-display" class="font-display font-black text-2xl md:text-3xl tracking-wider text-[var(--accent-light)] leading-none">25:00</span>
              <span id="zen-timer-status" class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Bereit</span>
            </div>
            
            <div class="flex items-center gap-1.5">
              <button onclick="startTimer()" id="zen-play-btn" class="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl border border-emerald-500/40 transition cursor-pointer" title="Timer starten">
                <i data-lucide="play" class="w-4 h-4"></i>
              </button>
              <button onclick="pauseTimer()" id="zen-pause-btn" class="p-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl border border-amber-500/40 transition cursor-pointer hidden" title="Timer pausieren">
                <i data-lucide="pause" class="w-4 h-4"></i>
              </button>
              <button onclick="stopTimer()" class="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30 transition cursor-pointer" title="Timer zurücksetzen">
                <i data-lucide="square" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <!-- Timer Presets -->
          <div class="flex items-center gap-1.5 pt-2 border-t border-white/5 w-full justify-center flex-wrap">
            <button onclick="setTimerPreset(1)" class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold transition cursor-pointer hover:text-white">1m Micro</button>
            <button onclick="setTimerPreset(5)" class="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[10px] font-bold transition cursor-pointer border border-emerald-500/20">5m Pause</button>
            <button onclick="setTimerPreset(15)" class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold transition cursor-pointer hover:text-white">15m Sprint</button>
            <button onclick="setTimerPreset(25)" class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold transition cursor-pointer hover:text-white">25m Fokus</button>
            <button onclick="setTimerPreset(50)" class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold transition cursor-pointer hover:text-white">50m Deep Work</button>
          </div>
        </div>

        <!-- INTEGRATED AMBIENT SOUND BAR -->
        <div class="w-full max-w-lg flex items-center justify-between gap-1 p-2 bg-white/[0.02] border border-white/5 rounded-2xl text-xs">
          <span class="text-[10px] text-gray-400 font-bold px-2 flex items-center gap-1 shrink-0">
            <i data-lucide="headphones" class="w-3.5 h-3.5 text-purple-400"></i>
            Sound:
          </span>
          <div class="flex items-center gap-1 overflow-x-auto py-0.5">
            <button onclick="playAmbientSound('birds')" class="px-2 py-1 bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300 rounded-lg text-[10px] font-semibold transition cursor-pointer flex items-center gap-1 shrink-0">🐦 Vögel</button>
            <button onclick="playAmbientSound('campfire')" class="px-2 py-1 bg-white/5 hover:bg-amber-500/20 text-gray-300 hover:text-amber-300 rounded-lg text-[10px] font-semibold transition cursor-pointer flex items-center gap-1 shrink-0">🔥 Feuer</button>
            <button onclick="playAmbientSound('binaural_alpha')" class="px-2 py-1 bg-white/5 hover:bg-purple-500/20 text-gray-300 hover:text-purple-300 rounded-lg text-[10px] font-semibold transition cursor-pointer flex items-center gap-1 shrink-0">🧠 Alpha Beats</button>
            <button onclick="playAmbientSound('whitenoise')" class="px-2 py-1 bg-white/5 hover:bg-zinc-500/20 text-gray-300 hover:text-white rounded-lg text-[10px] font-semibold transition cursor-pointer flex items-center gap-1 shrink-0">📻 White Noise</button>
            <button onclick="stopAmbientSound()" class="p-1 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer shrink-0" title="Sound stoppen">
              <i data-lucide="volume-x" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>

        <!-- DISTRACTION SCRATCHPAD / GEDANKEN-PARKPLATZ -->
        <div class="w-full max-w-lg relative">
          <div class="flex items-center gap-2 p-2 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
            <i data-lucide="lightbulb" class="w-4 h-4 text-amber-400 shrink-0 ml-1"></i>
            <input type="text" id="zen-distraction-input" onkeydown="handleZenDistractionInput(event)" placeholder="Gedanken parken: Idee oder Ablenkung tippen (Enter) ➔ landet in Notizen..." class="flex-1 bg-transparent border-0 text-xs text-amber-100 placeholder:text-amber-300/40 outline-none font-medium" />
            <button onclick="submitZenDistraction()" class="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold rounded-lg transition cursor-pointer shrink-0">Parken 📌</button>
          </div>
        </div>

        <!-- BOTTOM ACTION BUTTONS -->
        <div class="w-full max-w-lg flex items-center justify-between gap-3 pt-2">
          <button onclick="zenCompleteCurrentTask()" class="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transform active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer">
            <i data-lucide="check-circle" class="w-4 h-4"></i>
            <span data-i18n="complete_btn">Als erledigt markieren</span>
          </button>
          <button onclick="updateZenViewNextTask()" class="py-3 px-4 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold text-xs rounded-xl border border-white/10 transition flex items-center justify-center gap-1.5 cursor-pointer">
            <i data-lucide="skip-forward" class="w-4 h-4"></i>
            <span>Nächste Aufgabe</span>
          </button>
        </div>

      </div>
    </div>
`);

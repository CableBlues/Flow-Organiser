// Ausgelagert aus index.html: Wird per document.write an der Original-Position eingefuegt
document.write(`  <div id="app" class="min-h-screen max-w-[1920px] w-full mx-auto flex flex-col p-3 md:p-5 select-none justify-between">
    
    <!-- HEADER BAR -->
    <header class="relative z-[9999] flex flex-nowrap items-center justify-between gap-x-1 md:gap-x-1.5 mb-6 w-full bg-[#13131c]/90 p-1.5 md:p-2 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl">
      
      <!-- BEHÄLTER 1: Feedback & Logo -->
      <div class="flex items-center gap-1.5 md:gap-2 p-1 bg-white/[0.02] border border-white/5 rounded-xl shadow-sm shrink-0">
        <!-- Feedback Icon Button -->
        <div class="relative group zen-hide" onmouseenter="showPanelHover('feedback')" onmouseleave="hidePanelHover('feedback')">
          <button onclick="togglePanel('feedback')" class="h-7 w-7 flex items-center justify-center border border-pink-500/30 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 cursor-pointer transition shadow-sm" title="Feedback & Verbesserungsvorschläge an den Entwickler senden">
            <i data-lucide="message-square-heart" class="w-3.5 h-3.5 text-pink-400"></i>
          </button>
          
          <div id="panel-feedback" class="hidden absolute left-0 top-[calc(100%+8px)] z-[110] w-[280px] sm:w-[320px] bg-[#111116] border border-purple-500/40 p-4 rounded-2xl shadow-2xl">
            <h4 class="font-bold text-sm font-display mb-1 text-white" data-i18n="feedback_greet">Hey, ich bin Jannis! 👋</h4>
            <p class="text-[11px] text-gray-400 mb-3 leading-relaxed" data-i18n="feedback_prompt">
              Hast du Feedback, Kritik oder neue Ideen für Flow? Schreib mir gerne eine kurze Nachricht – ich freue mich über jeden Impuls!
            </p>
            <textarea id="feedback-text" rows="3" class="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[var(--accent)] mb-3 leading-relaxed placeholder:text-gray-600" data-i18n-placeholder="feedback_placeholder" placeholder="Deine Gedanken..."></textarea>
            
            <button onclick="submitFeedback()" class="w-full py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:opacity-90 transition whitespace-nowrap cursor-pointer" data-i18n="send">Senden</button>
            <div class="text-[11px] text-gray-400/80 text-center mt-2.5 font-medium leading-relaxed" data-i18n="feedback_alt">oder sende mir eine E-Mail an <span class="text-gray-200 font-semibold underline">jmonke@gmail.com</span></div>
          </div>
        </div>

        <!-- Logo & Hover Popup -->
        <div class="relative inline-block" onmouseenter="showPanelHover('logo-guide')" onmouseleave="hidePanelHover('logo-guide')">
          <div onclick="location.reload()" class="logo-dance logo-shiver relative inline-flex items-center gap-2 px-3 py-1.5 border border-purple-500/30 rounded-xl bg-gradient-to-br from-[#1c1c2b] to-[#12121c] text-sm font-bold font-display text-white transition-all duration-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:border-purple-400 group cursor-pointer" title="Flow-Anwendung neu laden">
            <svg class="w-5 h-5 text-purple-300 transition-transform duration-700 group-hover:rotate-[360deg] shrink-0" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round">
              <path d="M15 50 C 35 20, 65 80, 85 50" />
              <path d="M15 50 C 35 80, 65 20, 85 50" opacity="0.3" stroke-width="6" stroke-dasharray="2 15" />
            </svg>
            <span class="tracking-tight leading-none text-gray-100 select-none text-sm md:text-base">Flow</span>
          </div>

          <!-- DYNAMISCHES HOVER POPUP (SCHNELLSTART-GUIDE & TASTENKÜRZEL) -->
          <div id="panel-logo-guide" class="hidden absolute left-0 top-[calc(100%+8px)] z-[110] w-[340px] sm:w-[380px] bg-[#111116] border border-purple-500/40 p-4 rounded-2xl shadow-2xl transition duration-300 animate-fade-in text-left">
            <h4 class="font-bold text-sm font-display mb-2 text-white flex items-center gap-2">
              <i data-lucide="help-circle" class="w-4 h-4 text-purple-400"></i>
              <span>Flow Schnellstart-Guide</span>
            </h4>
            <p class="text-[11px] text-gray-400 mb-3 leading-relaxed">
              Klicke auf ein Element, um die Funktion direkt zu öffnen. Nutze die Tasten außerhalb von Eingabefeldern!
            </p>
            
            <!-- List of Functions -->
            <div class="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
              <!-- Item 1: Focus Mode -->
              <div onclick="toggleMinimalist(); document.getElementById('panel-logo-guide').classList.add('hidden');" class="group/guide-item p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/50 hover:bg-purple-950/10 active:scale-[0.98] transition-all flex flex-col gap-1 cursor-pointer">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white flex items-center gap-1.5">
                    <i data-lucide="eye" class="w-3.5 h-3.5 text-purple-400"></i> Fokus-Modus
                  </span>
                  <span class="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold font-mono">Taste [F]</span>
                </div>
                <p class="hidden group-hover/guide-item:block text-[10px] text-gray-300 leading-normal animate-fade-in">
                  Blendet das ablenkende Hauptboard aus und zeigt ausschließlich deine aktuell wichtigste To-Do-Aufgabe in einer minimalistischen Zen-Ansicht.
                </p>
              </div>

              <!-- Item 2: Focus Timer -->
              <div onclick="toggleTimer(); document.getElementById('panel-logo-guide').classList.add('hidden');" class="group/guide-item p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/50 hover:bg-purple-950/10 active:scale-[0.98] transition-all flex flex-col gap-1 cursor-pointer">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white flex items-center gap-1.5">
                    <i data-lucide="timer" class="w-3.5 h-3.5 text-amber-400"></i> Fokus-Timer
                  </span>
                  <div class="flex gap-1">
                    <span class="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[9px] font-bold font-mono">Start/Pause [T]</span>
                    <span class="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 text-[9px] font-bold font-mono">Stop [S]</span>
                  </div>
                </div>
                <p class="hidden group-hover/guide-item:block text-[10px] text-gray-300 leading-normal animate-fade-in">
                  Starte fokussierte Arbeitssitzungen mit motivierender, periodischer Sprachbegleitung und stimmungsvoller Hintergrundmusik.
                </p>
              </div>

              <!-- Item 3: Was nun? -->
              <div onclick="openHelperModal('pick'); document.getElementById('panel-logo-guide').classList.add('hidden');" class="group/guide-item p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/50 hover:bg-purple-950/10 active:scale-[0.98] transition-all flex flex-col gap-1 cursor-pointer">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white flex items-center gap-1.5">
                    <i data-lucide="lightbulb" class="w-3.5 h-3.5 text-purple-300"></i> Was nun?
                  </span>
                  <span class="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold font-mono">Taste [W]</span>
                </div>
                <p class="hidden group-hover/guide-item:block text-[10px] text-gray-300 leading-normal animate-fade-in">
                  Verringert kognitive Blockaden, indem eine zufällige Aufgabe basierend auf deiner aktuellen Tagespriorität vorgeschlagen wird.
                </p>
              </div>

              <!-- Item 4: Pause & Reizpause -->
              <div onclick="togglePanel('pause-dropdown'); document.getElementById('panel-logo-guide').classList.add('hidden');" class="group/guide-item p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/50 hover:bg-purple-950/10 active:scale-[0.98] transition-all flex flex-col gap-1 cursor-pointer">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white flex items-center gap-1.5">
                    <i data-lucide="shield" class="w-3.5 h-3.5 text-teal-400"></i> Reizpause & Erholung
                  </span>
                  <span class="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[9px] font-bold font-mono">Taste [P]</span>
                </div>
                <p class="hidden group-hover/guide-item:block text-[10px] text-gray-300 leading-normal animate-fade-in">
                  Unterstützt dich bei Reizüberflutung mit geführten Atemtakt-Rhythmen, 5-4-3-2-1 Achtsamkeits-Erdung oder schnellen Entspannungspausen.
                </p>
              </div>

              <!-- Item 5: Kochen -->
              <div onclick="togglePanel('cooking'); document.getElementById('panel-logo-guide').classList.add('hidden');" class="group/guide-item p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/50 hover:bg-purple-950/10 active:scale-[0.98] transition-all flex flex-col gap-1 cursor-pointer">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white flex items-center gap-1.5">
                    <i data-lucide="cooking-pot" class="w-3.5 h-3.5 text-orange-400"></i> Kochen & Vorrat
                  </span>
                  <span class="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 text-[9px] font-bold font-mono">Taste [K]</span>
                </div>
                <p class="hidden group-hover/guide-item:block text-[10px] text-gray-300 leading-normal animate-fade-in">
                  Trage deine vorhandenen Zutaten ein und lass dir ein passendes Rezept samt strukturierter Schritt-für-Schritt-Anleitung generieren.
                </p>
              </div>

              <!-- Item 6: Einkauf -->
              <div onclick="togglePanel('shopping'); document.getElementById('panel-logo-guide').classList.add('hidden');" class="group/guide-item p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/50 hover:bg-purple-950/10 active:scale-[0.98] transition-all flex flex-col gap-1 cursor-pointer">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white flex items-center gap-1.5">
                    <i data-lucide="shopping-basket" class="w-3.5 h-3.5 text-emerald-400"></i> Einkaufsliste
                  </span>
                  <span class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold font-mono">Taste [E]</span>
                </div>
                <p class="hidden group-hover/guide-item:block text-[10px] text-gray-300 leading-normal animate-fade-in">
                  Verwalte deine Einkäufe und sieh dir kluge Spartipps an, die auf den Inhalten deines Einkaufskorbs basieren.
                </p>
              </div>

              <!-- Item 7: Kompass -->
              <div onclick="openCompassModal(); document.getElementById('panel-logo-guide').classList.add('hidden');" class="group/guide-item p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/50 hover:bg-purple-950/10 active:scale-[0.98] transition-all flex flex-col gap-1 cursor-pointer">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white flex items-center gap-1.5">
                    <i data-lucide="compass" class="w-3.5 h-3.5 text-rose-400"></i> Entscheidungs-Kompass
                  </span>
                  <span class="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold font-mono">Taste [C]</span>
                </div>
                <p class="hidden group-hover/guide-item:block text-[10px] text-gray-300 leading-normal animate-fade-in">
                  Triff schwierige Entscheidungen rational oder intuitiv mithilfe von Münzwürfen, Werte-Waagen, Löffel-Checks oder Angst-Analysen.
                </p>
              </div>

              <!-- Item 8: Sport -->
              <div onclick="openSportModal(); document.getElementById('panel-logo-guide').classList.add('hidden');" class="group/guide-item p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/50 hover:bg-purple-950/10 active:scale-[0.98] transition-all flex flex-col gap-1 cursor-pointer">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white flex items-center gap-1.5">
                    <i data-lucide="dumbbell" class="w-3.5 h-3.5 text-orange-400 animate-pulse"></i> Sport & Bewegung
                  </span>
                  <span class="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 text-[9px] font-bold font-mono">Taste [O]</span>
                </div>
                <p class="hidden group-hover/guide-item:block text-[10px] text-gray-300 leading-normal animate-fade-in">
                  Aktiviere deinen Körper sanft mit 1-Minuten-Übungen, die perfekt auf dein aktuelles Energieniveau (Spoons) abgestimmt sind.
                </p>
              </div>

              <!-- Item 9: Skripte -->
              <div onclick="openScriptingModal(); document.getElementById('panel-logo-guide').classList.add('hidden');" class="group/guide-item p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/50 hover:bg-purple-950/10 active:scale-[0.98] transition-all flex flex-col gap-1 cursor-pointer">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white flex items-center gap-1.5">
                    <i data-lucide="scroll" class="w-3.5 h-3.5 text-indigo-400"></i> Social-Skripter
                  </span>
                  <span class="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-bold font-mono">Taste [X]</span>
                </div>
                <p class="hidden group-hover/guide-item:block text-[10px] text-gray-300 leading-normal animate-fade-in">
                  Formuliere schwierige Telefonate oder E-Mails (Arzttermine, Absagen, Bestellungen) stressfrei mit strukturierten Skriptvorlagen vor.
                </p>
              </div>

              <!-- Item 10: Statistik -->
              <div onclick="togglePanel('report'); document.getElementById('panel-logo-guide').classList.add('hidden');" class="group/guide-item p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/50 hover:bg-purple-950/10 active:scale-[0.98] transition-all flex flex-col gap-1 cursor-pointer">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white flex items-center gap-1.5">
                    <i data-lucide="bar-chart-3" class="w-3.5 h-3.5 text-purple-300"></i> Statistik & Erfolge
                  </span>
                  <span class="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold font-mono">Taste [R]</span>
                </div>
                <p class="hidden group-hover/guide-item:block text-[10px] text-gray-300 leading-normal animate-fade-in">
                  Analysiere deine Fortschritte, sieh dir deine wöchentliche Aktivität an und exportiere deine täglichen Haken als Bild-Report.
                </p>
              </div>

              <!-- Item 11: Sonstige Abkürzungen -->
              <div class="group/guide-item p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition flex flex-col gap-1 cursor-default">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white flex items-center gap-1.5">
                    <i data-lucide="keyboard" class="w-3.5 h-3.5 text-gray-300"></i> Weitere Abkürzungen
                  </span>
                  <span class="px-1.5 py-0.5 rounded bg-white/10 text-gray-300 text-[9px] font-bold font-mono">Mehrere</span>
                </div>
                <p class="hidden group-hover/guide-item:block text-[10px] text-gray-300 leading-normal animate-fade-in">
                  • <b>Taste [U]</b>: Letzte Aktion rückgängig machen (Undo)<br>
                  • <b>Taste [A]</b>: Neuen Kalendertermin/Termin hinzufügen<br>
                  • <b>Taste [B]</b>: "Funke" (30s Überwindungstipp) öffnen<br>
                  • <b>Taste [I]</b>: Inspirierenden Impuls öffnen<br>
                  • <b>Taste [H]</b>: Diese Kurzanleitung öffnen/schließen<br>
                  • <b>Taste [Esc]</b>: Alle geöffneten Modale oder Panels schließen
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- BEHÄLTER 2: Timer -->
      <div class="flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-xl shadow-sm shrink-0">
        <div id="timer-trigger-container" class="flex items-center gap-1 h-8 md:h-10 px-1 bg-white/[0.02] border border-white/5 rounded-xl">
          <div class="flex flex-col items-center justify-center min-w-[36px] md:min-w-[42px]">
            <span id="timer-display" class="font-display font-black text-[10px] md:text-xs tracking-wider text-[var(--accent-light)] leading-none">02:00</span>
            <div class="w-full h-0.5 md:h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
              <div id="timer-progress-bar" class="h-full bg-[var(--accent)] transition-all duration-300" style="width: 100%"></div>
            </div>
          </div>
          
          <select id="timer-preset-select" onchange="setTheme(currentTheme)" class="hidden"></select>
          <select id="timer-preset-select-real" onchange="setTimerPreset(parseInt(this.value))" class="px-1 py-0.5 bg-black/60 border border-white/15 hover:border-[var(--accent)]/50 rounded text-[9px] font-bold text-[var(--accent-light)] outline-none cursor-pointer transition shrink-0" title="Voreingestellte Timer-Minuten auswählen">
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

          <!-- Start / Pause / Stop / Mute Buttons -->
          <div class="flex items-center gap-0.5 shrink-0 pr-1.5 border-r border-white/10">
            <button id="timer-play-btn" onclick="startTimer()" class="p-0.5 hover:bg-white/10 rounded transition cursor-pointer" title="Fokus-Timer starten">
              <i data-lucide="play" class="w-3.5 h-3.5 text-emerald-400"></i>
            </button>
            <button id="timer-pause-btn" onclick="pauseTimer()" class="p-0.5 hover:bg-white/10 rounded transition cursor-pointer hidden" title="Fokus-Timer pausieren">
              <i data-lucide="pause" class="w-3.5 h-3.5 text-[var(--accent-light)] animate-pulse"></i>
            </button>
            <button id="timer-stop-btn" onclick="stopTimer()" class="p-0.5 hover:bg-white/10 rounded transition text-rose-400 hover:text-rose-300 cursor-pointer" title="Timer stoppen und Zeit zurücksetzen">
              <i data-lucide="square" class="w-3.5 h-3.5"></i>
            </button>
            <button id="timer-mute-btn" onclick="toggleTimerSound()" class="p-0.5 hover:bg-white/10 rounded transition text-gray-400 hover:text-white cursor-pointer" title="Timer-Töne ein- oder ausschalten">
              <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
          <span id="active-timer-badge" class="hidden text-[9px] text-[var(--accent-light)] font-semibold border-l border-white/15 pl-1.5 truncate max-w-[50px]"></span>
        </div>
      </div>

      <!-- BEHÄLTER 3: Focus Mode Toggle -->
      <div class="flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-xl shadow-sm shrink-0">
        <button onclick="toggleMinimalist()" class="h-8 px-2 md:h-10 md:px-3.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/60 rounded-xl text-purple-200 flex items-center gap-1.5 text-[10px] md:text-xs font-bold cursor-pointer transition-all duration-300 shadow-[0_0_12px_rgba(139,92,246,0.15)] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]" title="Minimalistischen Fokus-Modus ein- oder ausschalten">
          <i id="zen-btn-icon" data-lucide="eye" class="w-3.5 h-3.5 text-purple-400 animate-pulse"></i>
          <span class="hidden 2xl:inline" id="minimal-mode-btn-text" data-i18n="minimal_mode">Focus Mode</span>
        </button>
      </div>

      <!-- BEHÄLTER 4: Datum -->
      <div id="date-container" class="hidden 2xl:flex items-center justify-center p-0.5 border rounded-xl shadow-sm shrink-0 mx-1 transition-all duration-300 relative group cursor-pointer" onmouseenter="showPanelHover('calendar-dropdown')" onmouseleave="hidePanelHover('calendar-dropdown')">
        <div class="flex items-center gap-1.5 px-2 py-1 h-8">
          <button onclick="togglePanel('calendar-dropdown')" id="date-calendar-btn" class="group/date h-7 w-7 flex items-center justify-center rounded-xl hover:bg-white/10 transition-all duration-300" title="Monatskalender und Termine anzeigen">
            <i id="date-icon" data-lucide="calendar-days" class="w-4 h-4 shrink-0 transition-all duration-300"></i>
          </button>
          <span id="date-display" class="whitespace-nowrap"></span>
        </div>

        <!-- MINIMAL MONTH CALENDAR PANEL -->
        <div id="panel-calendar-dropdown" class="hidden absolute top-[calc(100%+8px)] left-0 z-[110] w-[220px] bg-[#111116] border border-white/10 p-3 rounded-2xl shadow-2xl flex flex-col gap-2 animate-fade-in">
          <div class="flex items-center justify-between text-xs font-bold text-gray-200 border-b border-white/5 pb-1.5">
            <span id="cal-month-title" class="font-display">August 2026</span>
          </div>
          <div class="grid grid-cols-7 gap-1 text-[9px] font-bold text-gray-500 text-center uppercase tracking-wider">
            <span>Mo</span><span>Di</span><span>Mi</span><span>Do</span><span>Fr</span><span>Sa</span><span>So</span>
          </div>
          <div id="cal-days-grid" class="grid grid-cols-7 gap-1 text-[10px] text-center font-semibold font-mono"></div>
        </div>
      </div>

      <!-- BEHÄLTER 5: Was nun? -->
      <div class="flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-xl shadow-sm shrink-0">
        <button id="btn-whatnow-dance" onclick="openHelperModal('pick')" class="h-8 px-2 md:h-10 md:px-4 rounded-xl text-white flex items-center gap-2 text-xs md:text-sm font-bold cursor-pointer transition-all duration-300 shrink-0 premium-glow-btn" title="Zufällige Aufgabe basierend auf deiner Tagespriorität vorschlagen lassen">
          <i data-lucide="lightbulb" class="w-4 h-4 text-[var(--accent-light)]"></i>
          <span class="hidden 2xl:inline" id="btn-label-whatnow" data-i18n="whatnow">Was nun?</span>
        </button>
      </div>

`);

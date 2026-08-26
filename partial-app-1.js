// Ausgelagert aus index.html: Wird per document.write an der Original-Position eingefuegt
document.write(`
    <!-- AMBIENT DYNAMIC BACKGROUND AURORA & IDLE PARTICLES -->
    <div class="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      <div class="ambient-orb ambient-orb-1"></div>
      <div class="ambient-orb ambient-orb-2"></div>
      <div class="ambient-orb ambient-orb-3"></div>
      <canvas id="ambient-flow-canvas" class="w-full h-full opacity-60"></canvas>
    </div>

    <!-- HEADER BAR -->
    <header class="relative z-[9999] flex flex-nowrap items-center justify-between gap-x-1 md:gap-x-1.5 mb-2 w-full bg-[#13131c]/90 p-1.5 md:p-2 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl">
      
      <!-- Subtile Wave-Bewegung im Hintergrund -->
      <div class="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none opacity-20 zen-hide">
        <svg class="absolute bottom-[-10px] left-0 w-[200%] h-[40px] water-wave-element" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C150,90 350,30 600,60 C850,90 1050,30 1200,60 L1200,120 L0,120 Z" fill="rgba(56, 189, 248, 0.2)"></path>
        </svg>
      </div>

      
      <!-- BEHÄLTER 1: Flow Logo & Feedback -->
      <div class="flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-xl shadow-sm shrink-0">
        
        <!-- Logo & Hover Popup -->
        <div class="relative inline-block group" onmouseenter="document.getElementById('panel-logo-guide').classList.remove('hidden')" onmouseleave="document.getElementById('panel-logo-guide').classList.add('hidden')">
          <div onclick="triggerLogoReloadFlow(this)" class="flow-logo-container relative inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-[#0d1527] via-[#10101e] to-[#180d24] text-xs md:text-sm font-bold font-display text-white transition-all duration-300 group cursor-pointer overflow-hidden border border-cyan-500/30" title="Flow-Anwendung neu laden (mit Wellen-Effekt)">
            
            <!-- Kinetic Infinity Ribbon SVG Icon -->
            <svg class="w-5 h-5 shrink-0 flow-logo-svg" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="flowGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#00f2fe" />
                  <stop offset="50%" stop-color="#38bdf8" />
                  <stop offset="100%" stop-color="#818cf8" />
                </linearGradient>
                <linearGradient id="flowGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#c084fc" />
                  <stop offset="50%" stop-color="#ec4899" />
                  <stop offset="100%" stop-color="#f43f5e" />
                </linearGradient>
                <radialGradient id="flowCoreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
                  <stop offset="40%" stop-color="#06b6d4" stop-opacity="0.6" />
                  <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0" />
                </radialGradient>
                <filter id="flowGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <!-- Ambient Glow Core -->
              <circle cx="22" cy="22" r="13" fill="url(#flowCoreGlow)" opacity="0.45" />

              <!-- Wave 1 (Cyan -> Indigo Primary Flow Ribbon) -->
              <path d="M 7,22 C 12,10 20,34 28,22 C 32,16 36,17 37,22 C 38,27 34,28 30,22 C 22,10 14,34 7,22 Z" 
                    fill="url(#flowGrad1)" 
                    opacity="0.95" 
                    filter="url(#flowGlowFilter)" />

              <!-- Wave 2 (Violet -> Rose Intertwined Counter Ribbon) -->
              <path d="M 37,22 C 32,34 24,10 16,22 C 12,28 8,27 7,22 C 6,17 10,16 14,22 C 22,34 30,10 37,22 Z" 
                    fill="url(#flowGrad2)" 
                    opacity="0.85" 
                    style="mix-blend-mode: screen;" />

              <!-- Dynamic Orbiting Light Spark -->
              <g class="flow-orb-node">
                <circle cx="22" cy="22" r="2.2" fill="#ffffff" filter="drop-shadow(0 0 4px #38bdf8)" />
              </g>
            </svg>

            <!-- Holographic Shimmer Brand Text -->
            <span class="tracking-tight leading-none flow-logo-text font-black select-none text-sm md:text-base tracking-wide">Flow</span>
            
            <!-- Subtle Live Sparkle Pill -->
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping opacity-75 shrink-0"></span>
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

              <!-- Item 11: Beispiel-Aufgaben verwalten -->
              <div onclick="openSampleManagerModal(); document.getElementById('panel-logo-guide').classList.add('hidden');" class="group/guide-item p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-amber-500/50 hover:bg-amber-950/10 active:scale-[0.98] transition-all flex flex-col gap-1 cursor-pointer">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white flex items-center gap-1.5">
                    <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-400"></i> Beispiel-Aufgaben verwalten
                  </span>
                  <span class="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold font-mono">Vorlagen</span>
                </div>
                <p class="hidden group-hover/guide-item:block text-[10px] text-gray-300 leading-normal animate-fade-in">
                  Beispiel-Aufgaben für Haushalt & Tag neu laden, individuell anpassen oder Board komplett leeren.
                </p>
              </div>

              <!-- Item 12: Sonstige Abkürzungen -->
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

            <!-- Panel Footer: Privacy & Version -->
            <div class="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-500">
              <span class="font-mono">Flow Suite · Local-First</span>
              <button onclick="openPrivacyModal(); document.getElementById('panel-logo-guide').classList.add('hidden');" class="text-emerald-400 hover:text-emerald-300 font-semibold transition cursor-pointer hover:underline flex items-center gap-1">
                <i data-lucide="shield-check" class="w-3 h-3"></i>
                <span>Datenschutz & Impressum</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Feedback Icon Button (Dezent, rechts neben Flow-Logo) -->
        <div class="hidden md:inline-block relative group zen-hide">
          <button onclick="togglePanel('feedback')" class="h-6 w-6 flex items-center justify-center border border-white/10 hover:border-pink-500/40 rounded-lg bg-white/[0.03] hover:bg-pink-500/15 text-gray-400 hover:text-pink-300 cursor-pointer transition-all shadow-none" title="Feedback & Ideen senden">
            <i data-lucide="message-square-heart" class="w-3 h-3 text-gray-400 group-hover:text-pink-300 transition-colors"></i>
          </button>
          
          <div id="panel-feedback" class="hidden absolute left-0 top-[calc(100%+8px)] z-[110] w-[280px] sm:w-[320px] bg-[#111116] border border-purple-500/40 p-4 rounded-2xl shadow-2xl">
            <h4 class="font-bold text-sm font-display mb-1 text-white" data-i18n="feedback_greet">Hey, schön dass du da bist! 👋</h4>
            <p class="text-[11px] text-gray-400 mb-3 leading-relaxed" data-i18n="feedback_prompt">
              Hast du Feedback, Kritik oder neue Ideen für Flow? Schreib uns gerne eine kurze Nachricht!
            </p>
            <textarea id="feedback-text" rows="3" class="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[var(--accent)] mb-3 leading-relaxed placeholder:text-gray-600" data-i18n-placeholder="feedback_placeholder" placeholder="Deine Gedanken..."></textarea>
            
            <button onclick="submitFeedback()" class="w-full py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:opacity-90 transition whitespace-nowrap cursor-pointer" data-i18n="send">Senden</button>
            <div class="text-[11px] text-gray-400/80 text-center mt-2.5 font-medium leading-relaxed" data-i18n="feedback_alt">oder sende eine E-Mail an <span class="text-gray-200 font-semibold underline">support@flow-planner.app</span></div>
            
            <div class="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-500">
              <button onclick="openPrivacyModal(); togglePanel('feedback');" class="text-emerald-400 hover:text-emerald-300 font-semibold transition cursor-pointer hover:underline flex items-center gap-1">
                <i data-lucide="shield-check" class="w-3 h-3"></i>
                <span>Datenschutz & Impressum</span>
              </button>
              <span class="font-mono">100% Local-First</span>
            </div>
          </div>
        </div>

      </div>

      <!-- MOBILE-ONLY HEADER ACTIONS (Workspace, Suche, Live-Sync & Quick-Menü) -->
      <div class="flex md:hidden items-center gap-1.5 shrink-0">
        <button onclick="toggleWorkspace()" class="h-8 px-2.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 rounded-xl flex items-center gap-1 text-xs font-bold transition cursor-pointer shadow-sm" title="Zwischen Privat und Arbeit umschalten">
          <span class="text-xs">🏠</span>
          <span class="text-[11px] font-bold text-purple-300">Privat</span>
        </button>
        <button onclick="openCommandPalette()" class="h-8 w-8 bg-white/10 hover:bg-white/15 border border-white/15 text-purple-300 rounded-xl flex items-center justify-center transition cursor-pointer shadow-sm" title="Suche & Befehle" aria-label="Suche">
          <i data-lucide="search" class="w-3.5 h-3.5"></i>
        </button>
        <button onclick="openP2PSyncModal()" class="h-8 w-8 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 rounded-xl flex items-center justify-center transition cursor-pointer shadow-sm relative" title="Handy Live-Verbindung ⚡" aria-label="Handy Live-Verbindung">
          <i data-lucide="smartphone" class="w-3.5 h-3.5 text-emerald-400"></i>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping absolute top-1 right-1 opacity-75"></span>
        </button>
        <button onclick="openMobileQuickMenu()" class="h-8 w-8 bg-white/10 hover:bg-white/15 border border-white/15 text-gray-200 rounded-xl flex items-center justify-center transition cursor-pointer shadow-sm" title="Schnellmenü" aria-label="Schnellmenü">
          <i data-lucide="more-vertical" class="w-4 h-4 text-gray-300"></i>
        </button>
      </div>

      <!-- BEHÄLTER 1.5: WORK-LIFE COMPACT SWITCH (Vor dem Timer) -->
      <div class="hidden sm:flex items-center p-1 bg-white/[0.025] border border-white/[0.07] rounded-2xl shadow-sm shrink-0 zen-hide">
        <button id="btn-workspace-toggle" onclick="toggleWorkspace()" class="h-8 px-2.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 hover:border-purple-500/50 rounded-xl text-purple-200 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all duration-300 shadow-sm" title="Zwischen Privat und Arbeit umschalten">
          <span id="ws-toggle-icon" class="text-xs">🏠</span>
          <span id="ws-toggle-text" class="text-[11px] font-bold text-purple-300" data-i18n="workspace_private">Privat</span>
        </button>
      </div>

      <!-- BEHÄLTER 2: Timer (Zentral & Elegant) -->
      <div class="hidden md:flex items-center gap-1.5 p-1 bg-white/[0.025] border border-white/[0.07] rounded-2xl shadow-sm shrink-0">
        <div id="timer-trigger-container" class="flex items-center gap-2 h-8 px-2 bg-black/30 border border-white/5 rounded-xl">
          <div class="flex flex-col items-center justify-center min-w-[36px]">
            <span id="timer-display" class="font-display font-black text-xs tracking-wider text-[var(--accent-light)] leading-none">02:00</span>
            <div class="w-full h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
              <div id="timer-progress-bar" class="h-full bg-[var(--accent)] transition-all duration-300" style="width: 100%"></div>
            </div>
          </div>
          
          <select id="timer-preset-select" onchange="setTheme(currentTheme)" class="hidden"></select>
          <select id="timer-preset-select-real" onchange="setTimerPreset(parseInt(this.value))" class="px-1.5 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold text-[var(--accent-light)] outline-none cursor-pointer transition shrink-0" title="Voreingestellte Timer-Minuten auswählen">
            <option value="1">1m</option>
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
          <div class="flex items-center gap-1 shrink-0 pl-1 border-l border-white/10">
            <button id="timer-play-btn" onclick="startTimer()" class="p-1 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition cursor-pointer" title="Fokus-Timer starten" aria-label="Fokus-Timer starten">
              <i data-lucide="play" class="w-3.5 h-3.5"></i>
            </button>
            <button id="timer-pause-btn" onclick="pauseTimer()" class="p-1 hover:bg-white/10 text-[var(--accent-light)] rounded-lg transition cursor-pointer hidden" title="Fokus-Timer pausieren" aria-label="Fokus-Timer pausieren">
              <i data-lucide="pause" class="w-3.5 h-3.5 animate-pulse"></i>
            </button>
            <button id="timer-stop-btn" onclick="stopTimer()" class="p-1 hover:bg-rose-500/20 text-rose-400 rounded-lg transition cursor-pointer" title="Timer stoppen und Zeit zurücksetzen" aria-label="Timer stoppen und Zeit zurücksetzen">
              <i data-lucide="square" class="w-3.5 h-3.5"></i>
            </button>
            <button id="timer-mute-btn" onclick="toggleTimerSound()" class="p-1 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition cursor-pointer" title="Timer-Töne ein- oder ausschalten" aria-label="Timer-Töne ein- oder ausschalten">
              <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
          <span id="active-timer-badge" class="hidden text-[9px] text-[var(--accent-light)] font-semibold border-l border-white/15 pl-1.5 truncate max-w-[60px]"></span>
        </div>
      </div>

      <!-- BEHÄLTER 3: Focus Mode Toggle -->
      <div class="hidden md:flex items-center gap-1.5 p-1 bg-white/[0.025] border border-white/[0.07] rounded-2xl shadow-sm shrink-0">
        <button id="btn-focus-mode" onclick="toggleMinimalist()" class="h-8 px-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/60 rounded-xl text-purple-200 flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-all duration-300 shadow-sm" title="Minimalistischen Fokus-Modus ein- oder ausschalten" aria-label="Minimalistischen Fokus-Modus ein- oder ausschalten">
          <i id="zen-btn-icon" data-lucide="eye" class="w-3.5 h-3.5 text-purple-400 animate-pulse"></i>
          <span class="hidden 2xl:inline" id="minimal-mode-btn-text" data-i18n="minimal_mode">Focus Mode</span>
        </button>
      </div>

      <!-- BEHÄLTER 4: Datum -->
      <div id="date-container" onmouseenter="openCalendarHover()" onmouseleave="closeCalendarHover()" class="hidden 2xl:flex items-center justify-center p-1 bg-white/[0.025] border border-white/[0.07] rounded-2xl shadow-sm shrink-0 transition-all duration-300 relative group cursor-pointer">
        <div class="flex items-center gap-1.5 px-2.5 h-8">
          <button onclick="togglePanel('calendar-dropdown')" id="date-calendar-btn" class="h-6 w-6 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all duration-300" title="Monatskalender und Termine anzeigen" aria-label="Monatskalender und Termine anzeigen">
            <i id="date-icon" data-lucide="calendar-days" class="w-3.5 h-3.5 shrink-0"></i>
          </button>
          <span id="date-display" class="whitespace-nowrap text-xs font-semibold text-gray-200"></span>
        </div>

        <!-- MINIMAL MONTH CALENDAR PANEL -->
        <div id="panel-calendar-dropdown" onmouseenter="openCalendarHover()" onmouseleave="closeCalendarHover()" class="hidden absolute top-[calc(100%+8px)] left-0 z-[110] w-[230px] bg-[#111116] border border-white/10 p-3.5 rounded-2xl shadow-2xl flex flex-col gap-2 animate-fade-in">
          <div class="flex items-center justify-between text-xs font-bold text-gray-200 border-b border-white/5 pb-1.5">
            <span id="cal-month-title" class="font-display">August 2026</span>
          </div>
          <div class="grid grid-cols-7 gap-1 text-[9px] font-bold text-gray-500 text-center uppercase tracking-wider">
            <span>Mo</span><span>Di</span><span>Mi</span><span>Do</span><span>Fr</span><span>Sa</span><span>So</span>
          </div>
          <div id="cal-days-grid" class="grid grid-cols-7 gap-1 text-[10px] text-center font-semibold font-mono"></div>
        </div>
      </div>

      <!-- BEHÄLTER 5: Was nun? (Kompakter Icon-Button mit Tooltip) -->
      <div class="hidden md:flex desktop-only-header items-center p-1 bg-white/[0.025] border border-white/[0.07] rounded-2xl shadow-sm shrink-0">
        <button id="btn-whatnow-dance" onclick="openHelperModal('pick')" class="h-8 w-8 flex items-center justify-center rounded-xl text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 cursor-pointer transition-all duration-300 shrink-0 shadow-sm" title="Was nun? – Zufällige Aufgabe nach Energie-Level vorschlagen lassen" aria-label="Was nun? – Zufällige Aufgabe vorschlagen">
          <i data-lucide="lightbulb" class="w-3.5 h-3.5 text-amber-300 animate-pulse"></i>
        </button>
      </div>

      <!-- BEHÄLTER 8: Statistik & Pause (Insights & Recovery) -->
      <div class="hidden md:flex desktop-only-header items-center gap-1.5 p-1 bg-white/[0.025] border border-white/[0.07] rounded-2xl shadow-sm shrink-0 zen-hide">
        <div class="relative group cursor-pointer">
          <button onclick="togglePanel('report')" class="h-8 px-2.5 border border-white/10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] hover:border-purple-500/30 text-gray-200 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition whitespace-nowrap shadow-sm" title="Erledigungsstatistiken und Diagramme einsehen">
            <i data-lucide="bar-chart-3" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>
            <span class="hidden 2xl:inline" id="btn-label-report" data-i18n="report">Statistik</span>
          </button>
          
          <div id="panel-report" class="hidden absolute right-0 top-[calc(100%+8px)] z-[110] w-[320px] sm:w-[440px] bg-[#111116] border border-purple-500/40 p-4 rounded-2xl shadow-2xl overflow-visible">
            <div id="report-export-target" class="p-3 bg-[#111116] rounded-xl border border-white/5 space-y-3">
              <div class="flex items-center justify-between border-b border-white/10 pb-2">
                <h4 class="font-bold text-sm font-display text-white flex items-center gap-2">
                  <i data-lucide="bar-chart-3" class="w-4 h-4 text-purple-400"></i>
                  <span id="report-title" data-i18n="report_title">Statistik</span>
                </h4>
                
                <!-- Timeframe Tabs -->
                <div class="flex items-center bg-black/50 p-0.5 rounded-xl border border-white/10 text-[11px] font-bold">
                  <button onclick="setReportTimeframe('today')" id="report-tab-today" class="px-2.5 py-1 rounded text-purple-300 bg-purple-500/25 cursor-pointer transition" data-i18n="today">Today</button>
                  <button onclick="setReportTimeframe('week')" id="report-tab-week" class="px-2.5 py-1 rounded text-gray-400 hover:text-white cursor-pointer transition" data-i18n="week">Week</button>
                  <button onclick="setReportTimeframe('month')" id="report-tab-month" class="px-2.5 py-1 rounded text-gray-400 hover:text-white cursor-pointer transition" data-i18n="month">Month</button>
                </div>
              </div>

              <!-- 3-Bento Stat Cards -->
              <div class="grid grid-cols-3 gap-2">
                <div class="p-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-center shadow-inner">
                  <div class="text-[10px] text-gray-400 mb-0.5 whitespace-nowrap" data-i18n="completed_stat">Erledigt</div>
                  <div id="report-today-count" class="text-base font-bold font-display text-emerald-400">0</div>
                </div>
                <div class="p-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-center shadow-inner">
                  <div class="text-[10px] text-gray-400 mb-0.5 whitespace-nowrap" data-i18n="focus_time">Fokus-Zeit</div>
                  <div id="report-focus-time" class="text-base font-bold font-display text-purple-300">0m</div>
                </div>
                <div class="p-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-center shadow-inner">
                  <div class="text-[10px] text-gray-400 mb-0.5 whitespace-nowrap" data-i18n="peak_hours">Peak</div>
                  <div id="report-peak-hour" class="text-xs font-bold font-display text-amber-300 mt-1 truncate">Morgens</div>
                </div>
              </div>

              <!-- 7-Tage-Aktivität -->
              <div id="report-chart-container" class="p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-[10px] uppercase font-bold tracking-wider text-gray-400" data-i18n="weekly_activity">7-Tage Aktivität</span>
                  <span id="report-total-week-tasks" class="font-mono text-purple-300 font-bold text-xs">0 Tasks</span>
                </div>
                <div id="report-weekly-chart" class="flex items-end justify-between h-14 pt-1 px-1 animate-fade-in"></div>
              </div>

              <!-- Intelligent Insights Tip -->
              <div id="report-insight-box" class="p-2.5 border border-purple-500/20 rounded-xl text-xs text-purple-200 flex items-start gap-2 bg-[#1c1c28]">
                <i data-lucide="lightbulb" class="w-4 h-4 text-purple-400 shrink-0 mt-0.5"></i>
                <span id="report-insight-text" data-i18n="loading_stats">Analysiere Produktivität...</span>
              </div>
            </div>

            <!-- Primärer Button: Großes Detail-Dashboard öffnen -->
            <button onclick="openReportDashboard()" class="w-full mt-3 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition cursor-pointer">
              <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
              <span data-i18n="open_dashboard">Detail-Analyse & Center öffnen ↗</span>
            </button>
          </div>
        </div>

        <!-- Pause -->
        <div class="relative group cursor-pointer">
          <button onclick="togglePanel('pause-dropdown')" class="h-8 px-2.5 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 hover:border-teal-500/60 rounded-xl text-teal-200 flex items-center gap-1.5 text-xs font-bold cursor-pointer transition shadow-sm" title="Reizpause & Entspannungs-Optionen öffnen">
            <i data-lucide="shield" class="w-3.5 h-3.5 text-teal-400"></i>
            <span class="hidden 2xl:inline" data-i18n="pause_btn">Pause</span>
          </button>
          
          <div id="panel-pause-dropdown" class="hidden absolute left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 top-[calc(100%+8px)] z-[110] w-[290px] bg-[#111116] border border-teal-500/40 p-3.5 rounded-2xl shadow-2xl flex flex-col gap-2 max-h-[440px] overflow-y-auto scrollbar-thin">
            <div class="text-[10px] uppercase font-bold tracking-wider text-teal-400 font-mono flex items-center gap-1"><i data-lucide="shield" class="w-3.5 h-3.5"></i> Reizpause & Erholung</div>
            <p class="text-[10px] text-gray-400 leading-normal mb-1">Methoden zur sensorischen Pause:</p>
            
            <!-- Option 1: Atemtakt -->
            <button onclick="openBreakModal('breath')" class="w-full py-1.5 px-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-left text-xs font-bold rounded-xl text-teal-300 transition flex items-center gap-2 cursor-pointer">
              <i data-lucide="wind" class="w-4 h-4 shrink-0 text-teal-400"></i>
              <div>
                <div class="leading-none mb-0.5">Atemtakt-Übung 🧘‍♀️</div>
                <div class="text-[9px] text-gray-400 font-normal">4-4-4 Atmen zur Beruhigung</div>
              </div>
            </button>

            <!-- Option 2: Box Breathing -->
            <button onclick="openBreakModal('box')" class="w-full py-1.5 px-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-left text-xs font-bold rounded-xl text-teal-300 transition flex items-center gap-2 cursor-pointer">
              <i data-lucide="box" class="w-4 h-4 shrink-0 text-teal-400"></i>
              <div>
                <div class="leading-none mb-0.5">Box-Breathing (Atembox) 📦</div>
                <div class="text-[9px] text-gray-400 font-normal">Ein, halten, aus, halten im Takt</div>
              </div>
            </button>
            
            <!-- Option 3: Erdungs-Anker -->
            <button onclick="openBreakModal('anchor')" class="w-full py-1.5 px-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-left text-xs font-bold rounded-xl text-teal-300 transition flex items-center gap-2 cursor-pointer">
              <i data-lucide="anchor" class="w-4 h-4 shrink-0 text-teal-400"></i>
              <div>
                <div class="leading-none mb-0.5">Erdungs-Anker ⚓</div>
                <div class="text-[9px] text-gray-400 font-normal">5-4-3-2-1 Achtsamkeit</div>
              </div>
            </button>

            <!-- Option 4: Augen-Entspannung -->
            <button onclick="openBreakModal('eyes')" class="w-full py-1.5 px-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-left text-xs font-bold rounded-xl text-teal-300 transition flex items-center gap-2 cursor-pointer">
              <i data-lucide="eye" class="w-4 h-4 shrink-0 text-teal-400"></i>
              <div>
                <div class="leading-none mb-0.5">Augen-Entspannung 👀</div>
                <div class="text-[9px] text-gray-400 font-normal">Warmes Hand-Palming für 1 Minute</div>
              </div>
            </button>
            
            <!-- Option 5: Schneller Stretch -->
            <button onclick="openBreakModal('stretch')" class="w-full py-1.5 px-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-left text-xs font-bold rounded-xl text-teal-300 transition flex items-center gap-2 cursor-pointer">
              <i data-lucide="dumbbell" class="w-4 h-4 shrink-0 text-teal-400"></i>
              <div>
                <div class="leading-none mb-0.5">Schneller Stretch 🙆‍♂️</div>
                <div class="text-[9px] text-gray-400 font-normal">Sanfte Dehnung für Schultern & Rücken</div>
              </div>
            </button>
            
            <!-- Option 6: Nacken-Squeeze -->
            <button onclick="openBreakModal('neck')" class="w-full py-1.5 px-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-left text-xs font-bold rounded-xl text-teal-300 transition flex items-center gap-2 cursor-pointer">
              <i data-lucide="activity" class="w-4 h-4 shrink-0 text-teal-400"></i>
              <div>
                <div class="leading-none mb-0.5">Nacken-Squeeze (1 Min) 🏋️</div>
                <div class="text-[9px] text-gray-400 font-normal">Muskeln anspannen & befreien</div>
              </div>
            </button>
            
            <!-- Option 7: 5-Minuten Teepause -->
            <button onclick="openBreakModal('tea')" class="w-full py-1.5 px-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-left text-xs font-bold rounded-xl text-teal-300 transition flex items-center gap-2 cursor-pointer">
              <i data-lucide="coffee" class="w-4 h-4 shrink-0 text-teal-400"></i>
              <div>
                <div class="leading-none mb-0.5">5-Minuten Teepause ☕</div>
                <div class="text-[9px] text-gray-400 font-normal">Fokus-Auszeit mit Café-Klängen</div>
              </div>
            </button>

            <!-- Option 8: Wald-Auszeit -->
            <button onclick="openBreakModal('nature')" class="w-full py-1.5 px-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-left text-xs font-bold rounded-xl text-teal-300 transition flex items-center gap-2 cursor-pointer">
              <i data-lucide="trees" class="w-4 h-4 shrink-0 text-teal-400"></i>
              <div>
                <div class="leading-none mb-0.5">Wald-Auszeit (3 Min) 🐦</div>
                <div class="text-[9px] text-gray-400 font-normal">Abschalten bei Natur-Vogelstimmen</div>
              </div>
            </button>

            <!-- Option 9: Power Nap -->
            <button onclick="triggerPowerNap()" class="w-full py-1.5 px-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-left text-xs font-bold rounded-xl text-teal-300 transition flex items-center gap-2">
              <i data-lucide="bed" class="w-4 h-4 shrink-0 text-teal-400"></i>
              <div>
                <div class="leading-none mb-0.5">Power Nap (20 Min) 😴</div>
                <div class="text-[9px] text-gray-400 font-normal">Kurzschlaf bei leisem Regen</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- BEHÄLTER 7: Aktionen (Undo, Open, Save, Reset) -->
      <div class="hidden md:flex desktop-only-header items-center gap-1 p-1 bg-white/[0.025] border border-white/[0.07] rounded-2xl shadow-sm shrink-0">
        <button onclick="handleUndo()" class="h-8 w-8 flex items-center justify-center bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-xl text-gray-300 hover:text-white cursor-pointer transition shadow-sm" title="Letzte Aktion rückgängig machen">
          <i data-lucide="undo" class="w-3.5 h-3.5"></i>
        </button>
        <button onclick="document.getElementById('file-input').click()" class="h-8 w-8 flex items-center justify-center bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-xl text-amber-400 hover:text-amber-300 cursor-pointer transition shadow-sm zen-hide" title="Gespeicherten Plan aus einer .json-Datei laden">
          <i data-lucide="folder-open" class="w-3.5 h-3.5"></i>
        </button>
        <input type="file" id="file-input" onchange="handleOpenFile(event)" accept="application/json" class="hidden" />
        <button onclick="handleSaveJson()" class="h-8 w-8 flex items-center justify-center bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-xl text-emerald-400 hover:text-emerald-300 cursor-pointer transition shadow-sm" title="Aktuellen Plan als .json-Datei auf dem Gerät sichern">
          <i data-lucide="save" class="w-3.5 h-3.5"></i>
        </button>
        <button onclick="handleReset()" class="h-8 w-8 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 hover:text-red-200 cursor-pointer transition shadow-sm zen-hide" title="Gesamten Plan auf die Standardeinstellungen zurücksetzen">
          <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
        </button>
      </div>

      <!-- BEHÄLTER 9: Preferences & Sync -->
      <div class="hidden md:flex desktop-only-header items-center gap-1 p-1 bg-white/[0.025] border border-white/[0.07] rounded-2xl shadow-sm shrink-0">

        <!-- Quick Search & Command Palette (Strg+K) -->
        <div class="relative group cursor-pointer zen-hide">
          <button onclick="openCommandPalette()" class="h-8 w-8 flex items-center justify-center border border-white/10 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-purple-300 hover:text-white cursor-pointer transition shadow-sm" title="Suche & Befehle (Strg+K)" aria-label="Suche & Befehle">
            <i data-lucide="search" class="w-3.5 h-3.5 text-purple-300"></i>
          </button>
        </div>

        <!-- Theme Selector Dropdown (4x4 Grid - 16 Themes) -->
        <div class="relative group cursor-pointer">
          <button onclick="togglePanel('theme')" class="h-8 w-8 flex items-center justify-center border border-white/10 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-gray-200 cursor-pointer transition shadow-sm" title="Farbschema und Hintergrund der App ändern">
            <i data-lucide="palette" class="w-3.5 h-3.5 text-purple-300"></i>
          </button>
          
          <div id="panel-theme" class="hidden absolute right-0 top-[calc(100%+8px)] z-[110] bg-[#111116] border border-purple-500/40 p-2.5 rounded-2xl shadow-2xl grid grid-cols-4 gap-2 w-[120px] origin-top">
            <!-- Reihe 1 -->
            <button onclick="setTheme('aurora')" class="w-3.5 h-3.5 rounded-full bg-[#a855f7] border border-white/10 hover:scale-125 transition" title="Aurora (Mystical Purple)"></button>
            <button onclick="setTheme('sage')" class="w-3.5 h-3.5 rounded-full bg-[#86efac] border border-white/10 hover:scale-125 transition" title="Sage (Earthy Sage Green)"></button>
            <button onclick="setTheme('cozy')" class="w-3.5 h-3.5 rounded-full bg-[#f59e0b] border border-white/10 hover:scale-125 transition" title="Cozy (Warm Amber)"></button>
            <button onclick="setTheme('forest')" class="w-3.5 h-3.5 rounded-full bg-[#22c55e] border border-white/10 hover:scale-125 transition" title="Forest (Pine Green)"></button>
            <!-- Reihe 2 -->
            <button onclick="setTheme('architect')" class="w-3.5 h-3.5 rounded-full bg-[#64748b] border border-white/10 hover:scale-125 transition" title="Architect (Steel Grey)"></button>
            <button onclick="setTheme('neon-cyber')" class="w-3.5 h-3.5 rounded-full bg-[#ff2fd0] border border-white/10 hover:scale-125 transition" title="Neon Cyber (Futuristic Magenta)"></button>
            <button onclick="setTheme('glacier')" class="w-3.5 h-3.5 rounded-full bg-[#a5f3fc] border border-white/10 hover:scale-125 transition" title="Glacier (Nordic Ice)"></button>
            <button onclick="setTheme('synthwave')" class="w-3.5 h-3.5 rounded-full bg-[#ff5f9e] border border-white/10 hover:scale-125 transition" title="Synthwave (Futuristic Retro Sunset)"></button>
            <!-- Reihe 3 -->
            <button onclick="setTheme('charcoal')" class="w-3.5 h-3.5 rounded-full bg-[#475569] border border-white/10 hover:scale-125 transition" title="Charcoal (Pure Graphite)"></button>
            <button onclick="setTheme('executive')" class="w-3.5 h-3.5 rounded-full bg-[#b5a642] border border-white/10 hover:scale-125 transition" title="Executive (Navy & Gold)"></button>
            <button onclick="setTheme('holo-chrome')" class="w-3.5 h-3.5 rounded-full bg-[#22e5d4] border border-white/10 hover:scale-125 transition" title="Holo Chrome (Futuristic Cyan HUD)"></button>
            <button onclick="setTheme('carbon')" class="w-3.5 h-3.5 rounded-full bg-[#1e293b] border border-white/10 hover:scale-125 transition" title="Carbon (Ultra-Minimal)"></button>
            <!-- Reihe 4 (Fröhlich & Vital) -->
            <button onclick="setTheme('citrus')" class="w-3.5 h-3.5 rounded-full bg-[#facc15] border border-white/10 hover:scale-125 transition" title="Citrus Sunshine (Sonnengelb)"></button>
            <button onclick="setTheme('sakura')" class="w-3.5 h-3.5 rounded-full bg-[#f472b6] border border-white/10 hover:scale-125 transition" title="Sakura Spring (Kirschblüte)"></button>
            <button onclick="setTheme('lagoon')" class="w-3.5 h-3.5 rounded-full bg-[#06b6d4] border border-white/10 hover:scale-125 transition" title="Tropical Lagoon (Türkis)"></button>
            <button onclick="setTheme('matcha')" class="w-3.5 h-3.5 rounded-full bg-[#84cc16] border border-white/10 hover:scale-125 transition" title="Matcha Latte (Matcha-Grün)"></button>
          </div>
        </div>

        <!-- Language Selector Dropdown -->
        <div class="relative group cursor-pointer">
          <button onclick="togglePanel('language')" class="h-8 w-8 flex items-center justify-center border border-white/10 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-gray-200 cursor-pointer transition shadow-sm" title="Sprache ändern / Change Language">
            <span id="current-lang-flag" class="text-xs">🇬🇧</span>
          </button>
          
          <div id="panel-language" class="hidden absolute right-0 top-[calc(100%+8px)] z-[110] bg-[#111116] border border-purple-500/40 p-1.5 rounded-2xl shadow-2xl flex flex-col gap-1 w-[46px]">
            <button onclick="setLanguage('de')" class="p-1 hover:bg-white/10 rounded-lg text-sm flex items-center justify-center transition cursor-pointer" title="Deutsch">🇩🇪</button>
            <button onclick="setLanguage('en')" class="p-1 hover:bg-white/10 rounded-lg text-sm flex items-center justify-center transition cursor-pointer" title="English">🇬🇧</button>
            <button onclick="setLanguage('es')" class="p-1 hover:bg-white/10 rounded-lg text-sm flex items-center justify-center transition cursor-pointer" title="Español">🇪🇸</button>
            <button onclick="setLanguage('el')" class="p-1 hover:bg-white/10 rounded-lg text-sm flex items-center justify-center transition cursor-pointer" title="Ελληνικά">🇬🇷</button>
            <button onclick="setLanguage('fr')" class="p-1 hover:bg-white/10 rounded-lg text-sm flex items-center justify-center transition cursor-pointer" title="Français">🇫🇷</button>
            <button onclick="setLanguage('it')" class="p-1 hover:bg-white/10 rounded-lg text-sm flex items-center justify-center transition cursor-pointer" title="Italiano">🇮🇹</button>
          </div>
        </div>

        <!-- Handy Live-Verbindung (1-Klick QR) -->
        <div class="relative group cursor-pointer zen-hide">
          <button onclick="openP2PSyncModal()" class="h-8 w-8 flex items-center justify-center border border-emerald-500/30 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 cursor-pointer transition shadow-sm" title="Handy Live-Verbindung ⚡ (1x QR scannen & sofort synchron)" aria-label="Handy Live-Verbindung">
            <i data-lucide="smartphone" class="w-3.5 h-3.5 text-emerald-400"></i>
          </button>
        </div>

        <!-- Settings & Rechtliches (1-Klick Öffnen) -->
        <div class="relative group cursor-pointer zen-hide">
          <button onclick="openSettingsModal()" class="h-8 w-8 flex items-center justify-center border border-white/10 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-purple-300 hover:text-white cursor-pointer transition shadow-sm" title="Optionen, Impressum & Datenschutz">
            <i data-lucide="settings" class="w-3.5 h-3.5 text-purple-300"></i>
          </button>
        </div>

      </div>

    </header>
`);



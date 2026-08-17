// Ausgelagert aus index.html: Wird per document.write an der Original-Position eingefuegt
document.write(`      <!-- BEHÄLTER 8: Statistik -->
      <div class="flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-xl shadow-sm shrink-0 zen-hide">
        <div class="relative group cursor-pointer" onmouseenter="showPanelHover('report')" onmouseleave="hidePanelHover('report')">
          <button onclick="togglePanel('report')" class="h-8 px-2 md:px-3 border border-white/10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] hover:border-purple-500/30 text-gray-200 flex items-center gap-1 text-[10px] md:text-xs font-semibold cursor-pointer transition whitespace-nowrap shadow-sm" title="Erledigungsstatistiken und Diagramme einsehen">
            <i data-lucide="bar-chart-3" class="w-3.5 h-3.5 text-[var(--accent-light)]"></i>
            <span class="hidden 2xl:inline" id="btn-label-report" data-i18n="report">Statistik</span>
          </button>
          
          <div id="panel-report" class="hidden absolute right-0 top-[calc(100%+8px)] z-[110] w-[300px] sm:w-[420px] bg-[#111116] border border-purple-500/40 p-4 rounded-2xl shadow-2xl overflow-visible">
            <div id="report-export-target" class="p-3 bg-[#111116] rounded-xl border border-white/5 overflow-y-auto max-h-[380px]">
              <div class="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                <h4 class="font-bold text-sm font-display text-white flex items-center gap-2">
                  <i data-lucide="bar-chart-3" class="w-4 h-4 text-[var(--accent)]"></i>
                  <span id="report-title" data-i18n="report_title">Statistik</span>
                </h4>
                
                <!-- Timeframe Tabs -->
                <div class="flex items-center bg-black/50 p-0.5 rounded-xl border border-white/10 text-[11px] font-bold">
                  <button onclick="setTheme(currentTheme)" class="hidden"></button>
                  <button onclick="setReportTimeframe('today')" id="report-tab-today" class="px-2 py-1 rounded text-[var(--accent-light)] bg-[var(--accent)]/25 cursor-pointer transition">Heute</button>
                  <button onclick="setReportTimeframe('week')" id="report-tab-week" class="px-2 py-1 rounded text-gray-400 hover:text-white cursor-pointer transition">Woche</button>
                  <button onclick="setReportTimeframe('month')" id="report-tab-month" class="px-2 py-1 rounded text-gray-400 hover:text-white cursor-pointer transition">Monat</button>
                </div>
              </div>

              <!-- Stats Grid -->
              <div class="grid grid-cols-2 gap-2 mb-3">
                <div class="p-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-center shadow-inner">
                  <div class="text-[10px] text-gray-400 mb-0.5 whitespace-nowrap" data-i18n="completed_stat">Erledigt</div>
                  <div id="report-today-count" class="text-lg font-bold font-display text-[var(--accent-light)]">0</div>
                </div>
                <div class="p-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-center shadow-inner">
                  <div class="text-[10px] text-gray-400 mb-0.5 whitespace-nowrap" data-i18n="rate_stat">Erfolgsquote</div>
                  <div id="report-rate-pct" class="text-lg font-bold font-display text-emerald-400">100%</div>
                </div>
              </div>

              <!-- 7-Tage-Aktivität -->
              <div id="report-chart-container" class="mb-3 p-3 bg-white/[0.02] border border-white/10 rounded-xl hidden">
                <h5 class="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2 flex items-center justify-between">
                  <span data-i18n="weekly_activity">7-Tage-Aktivität (Mo-So)</span>
                  <span id="report-total-week-tasks" class="font-mono text-purple-300 font-bold">0 Tasks</span>
                </h5>
                <div id="report-weekly-chart" class="flex items-end justify-between h-16 pt-2 px-1 animate-fade-in"></div>
              </div>

              <!-- Category Progress Bars -->
              <div id="report-category-bars" class="space-y-2.5 mb-3 text-xs"></div>

              <!-- Intelligent Insights Tip -->
              <div id="report-insight-box" class="p-2.5 border rounded-xl text-xs text-purple-200 flex items-start gap-2 bg-[#1c1c28]">
                <i data-lucide="lightbulb" class="w-4 h-4 text-purple-400 shrink-0 mt-0.5"></i>
                <span id="report-insight-text" data-i18n="loading_stats">Lade deine Statistiken...</span>
              </div>
            </div>

            <!-- Export Button -->
            <button onclick="exportReportAsImage()" class="w-full mt-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer">
              <i data-lucide="image" class="w-3.5 h-3.5"></i>
              <span data-i18n="export">Export</span>
            </button>

            <!-- Completed Items Log -->
            <div id="report-list" class="mt-3 space-y-1.5 max-h-[150px] overflow-y-auto text-xs pr-1 border-t border-white/5 pt-3"></div>
          </div>
        </div>
      </div>

      <!-- BEHÄLTER 3.5: Pause -->
      <div class="flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-xl shadow-sm shrink-0">
        <div class="relative group cursor-pointer" onmouseenter="showPanelHover('pause-dropdown')" onmouseleave="hidePanelHover('pause-dropdown')">
          <button onclick="togglePanel('pause-dropdown')" class="h-8 px-2.5 md:h-10 md:px-3.5 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 hover:border-teal-500/60 rounded-xl text-teal-200 flex items-center gap-1.5 text-[10px] md:text-xs font-bold cursor-pointer transition shadow-sm" title="Reizpause & Entspannungs-Optionen öffnen">
            <i data-lucide="shield" class="w-3.5 h-3.5 text-teal-400"></i>
            <span class="hidden 2xl:inline" data-i18n="pause_btn">Pause</span>
          </button>
          
          <div id="panel-pause-dropdown" class="hidden absolute left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 top-[calc(100%+8px)] z-[110] w-[290px] bg-[#111116] border border-teal-500/40 p-3 rounded-2xl shadow-2xl flex flex-col gap-2 max-h-[440px] overflow-y-auto scrollbar-thin">
            <div class="text-[10px] uppercase font-bold tracking-wider text-teal-400 font-mono flex items-center gap-1"><i data-lucide="shield" class="w-3.5 h-3.5"></i> Reizpause & Erholung</div>
            <p class="text-[10px] text-gray-400 leading-normal mb-1">Methoden zur sensorischen Pause:</p>
            
            <!-- Option 1: Atemtakt -->
            <button onclick="openSafeSpaceWithTab('breath')" class="w-full py-1.5 px-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-left text-xs font-bold rounded-xl text-teal-300 transition flex items-center gap-2">
              <i data-lucide="wind" class="w-4 h-4 shrink-0 text-teal-400"></i>
              <div>
                <div class="leading-none mb-0.5">Atemtakt-Übung 🧘‍♀️</div>
                <div class="text-[9px] text-gray-400 font-normal">4-4-4 Atmen zur Beruhigung</div>
              </div>
            </button>

            <!-- Option 2: Box Breathing -->
            <button onclick="triggerBoxBreathing()" class="w-full py-1.5 px-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-left text-xs font-bold rounded-xl text-teal-300 transition flex items-center gap-2">
              <i data-lucide="box" class="w-4 h-4 shrink-0 text-teal-400"></i>
              <div>
                <div class="leading-none mb-0.5">Box-Breathing (Atembox) 📦</div>
                <div class="text-[9px] text-gray-400 font-normal">Ein, halten, aus, halten im Takt</div>
              </div>
            </button>
            
            <!-- Option 3: Erdungs-Anker -->
            <button onclick="openSafeSpaceWithTab('anchor')" class="w-full py-1.5 px-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-left text-xs font-bold rounded-xl text-teal-300 transition flex items-center gap-2">
              <i data-lucide="anchor" class="w-4 h-4 shrink-0 text-teal-400"></i>
              <div>
                <div class="leading-none mb-0.5">Erdungs-Anker ⚓</div>
                <div class="text-[9px] text-gray-400 font-normal">5-4-3-2-1 Achtsamkeit</div>
              </div>
            </button>

            <!-- Option 4: Augen-Entspannung -->
            <button onclick="triggerEyeRelaxation()" class="w-full py-1.5 px-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-left text-xs font-bold rounded-xl text-teal-300 transition flex items-center gap-2">
              <i data-lucide="eye" class="w-4 h-4 shrink-0 text-teal-400"></i>
              <div>
                <div class="leading-none mb-0.5">Augen-Entspannung 👀</div>
                <div class="text-[9px] text-gray-400 font-normal">Warmes Hand-Palming für 1 Minute</div>
              </div>
            </button>
            
            <!-- Option 5: Schneller Stretch -->
            <button onclick="triggerQuickStretch()" class="w-full py-1.5 px-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-left text-xs font-bold rounded-xl text-teal-300 transition flex items-center gap-2">
              <i data-lucide="dumbbell" class="w-4 h-4 shrink-0 text-teal-400"></i>
              <div>
                <div class="leading-none mb-0.5">Schneller Stretch 🧘</div>
                <div class="text-[9px] text-gray-400 font-normal">1 Minute entspannt lockern</div>
              </div>
            </button>

            <!-- Option 6: Schulter-Squeeze -->
            <button onclick="triggerShoulderSqueeze()" class="w-full py-1.5 px-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-left text-xs font-bold rounded-xl text-teal-300 transition flex items-center gap-2">
              <i data-lucide="dumbbell" class="w-4 h-4 shrink-0 text-teal-400 animate-pulse"></i>
              <div>
                <div class="leading-none mb-0.5">Nacken-Squeeze (1 Min) 🏋️</div>
                <div class="text-[9px] text-gray-400 font-normal">Muskeln anspannen & befreien</div>
              </div>
            </button>
            
            <!-- Option 7: 5-Minuten Teepause -->
            <button onclick="triggerFiveMinTeaBreak()" class="w-full py-1.5 px-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-left text-xs font-bold rounded-xl text-teal-300 transition flex items-center gap-2">
              <i data-lucide="coffee" class="w-4 h-4 shrink-0 text-teal-400"></i>
              <div>
                <div class="leading-none mb-0.5">5-Minuten Teepause ☕</div>
                <div class="text-[9px] text-gray-400 font-normal">Fokus-Auszeit mit Café-Klängen</div>
              </div>
            </button>

            <!-- Option 8: Wald-Auszeit -->
            <button onclick="triggerNatureBirds()" class="w-full py-1.5 px-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-left text-xs font-bold rounded-xl text-teal-300 transition flex items-center gap-2">
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

      <!-- BEHÄLTER 6: Anmelden -->
      <div class="flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-xl shadow-sm shrink-0">
        <div class="relative group cursor-pointer zen-hide" onmouseenter="showPanelHover('sync')" onmouseleave="hidePanelHover('sync')">
          <button onclick="togglePanel('sync')" class="h-8 px-2 md:px-3 border border-emerald-500/30 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 flex items-center gap-1.5 text-[10px] md:text-xs font-bold cursor-pointer transition shadow-sm" title="Geräte-Synchronisierung einrichten">
            <i data-lucide="user-round" class="w-3.5 h-3.5 text-emerald-400"></i>
            <span class="hidden 2xl:inline" data-i18n="login_btn">Anmelden</span>
          </button>
          
          <div id="panel-sync" class="hidden absolute right-0 top-[calc(100%+8px)] z-[110] w-[200px] bg-[#111116] border border-emerald-500/40 p-3 rounded-2xl shadow-2xl flex flex-col gap-2">
            <div class="text-[10px] uppercase font-bold tracking-wider text-emerald-400 font-mono" data-i18n="sync_title">Geräte-Sync</div>
            <p class="text-[10px] text-gray-400 leading-normal mb-1" data-i18n="sync_desc">Übertrage deinen Plan nahtlos auf all deine Geräte.</p>
            <button onclick="showToast('Schnittstelle folgt in Kürze... 🔒')" class="w-full py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl transition">Einloggen</button>
            <button onclick="showToast('Schnittstelle folgt in Kürze... 🔒')" class="w-full py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-xl transition">Registrieren</button>
          </div>
        </div>
      </div>

      <!-- BEHÄLTER 7: Aktionen -->
      <div class="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/5 rounded-xl shadow-sm shrink-0">
        <button onclick="handleUndo()" class="h-8 w-8 flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 rounded-xl text-gray-300 cursor-pointer transition shadow-sm" title="Letzte Aktion rückgängig machen">
          <i data-lucide="undo" class="w-4 h-4"></i>
        </button>
        <button onclick="document.getElementById('file-input').click()" class="h-8 w-8 flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 rounded-xl text-amber-400 cursor-pointer transition shadow-sm zen-hide" title="Gespeicherten Plan aus einer .json-Datei laden">
          <i data-lucide="folder-open" class="w-4 h-4"></i>
        </button>
        <input type="file" id="file-input" onchange="handleOpenFile(event)" accept="application/json" class="hidden" />
        <button onclick="handleSaveJson()" class="h-8 w-8 flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 rounded-xl text-emerald-400 cursor-pointer transition shadow-sm" title="Aktuellen Plan als .json-Datei auf dem Gerät sichern">
          <i data-lucide="save" class="w-4 h-4"></i>
        </button>
        <button onclick="handleReset()" class="h-8 w-8 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 cursor-pointer transition shadow-sm zen-hide" title="Gesamten Plan auf die Standardeinstellungen zurücksetzen">
          <i data-lucide="refresh-cw" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- BEHÄLTER 9: Farbschemas & Sprache -->
      <div class="flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-xl shadow-sm bg-black/40 shrink-0">

        <!-- Theme Selector Dropdown (4x4 Grid - 16 Themes) -->
        <div class="relative group cursor-pointer" onmouseenter="showPanelHover('theme')" onmouseleave="hidePanelHover('theme')">
          <button onclick="togglePanel('theme')" class="h-8 w-8 flex items-center justify-center border border-white/5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-200 cursor-pointer transition shadow-sm" title="Farbschema und Hintergrund der App ändern">
            <i data-lucide="palette" class="w-4 h-4 text-purple-300"></i>
          </button>
          
          <div id="panel-theme" class="hidden absolute right-0 top-[calc(100%+8px)] z-[110] bg-[#111116] border border-purple-500/40 p-2.5 rounded-xl shadow-2xl grid grid-cols-4 gap-2 w-[120px] origin-top">
            <!-- Reihe 1 -->
            <button onclick="setTheme('aurora')" class="w-3.5 h-3.5 rounded-full bg-[#a855f7] border border-white/10 hover:scale-125 transition" title="Aurora (Mystical Purple)"></button>
            <button onclick="setTheme('sage')" class="w-3.5 h-3.5 rounded-full bg-[#86efac] border border-white/10 hover:scale-125 transition" title="Sage (Earthy Sage Green)"></button>
            <button onclick="setTheme('cozy')" class="w-3.5 h-3.5 rounded-full bg-[#f59e0b] border border-white/10 hover:scale-125 transition" title="Cozy (Warm Amber)"></button>
            <button onclick="setTheme('forest')" class="w-3.5 h-3.5 rounded-full bg-[#22c55e] border border-white/10 hover:scale-125 transition" title="Forest (Pine Green)"></button>
            <!-- Reihe 2 -->
            <button onclick="setTheme('architect')" class="w-3.5 h-3.5 rounded-full bg-[#64748b] border border-white/10 hover:scale-125 transition" title="Architect (Steel Grey)"></button>
            <button onclick="setTheme('mono-hand')" class="w-3.5 h-3.5 rounded-full bg-[#d2b48c] border border-stone-800 hover:scale-125 transition" title="Mono Hand (Antique Paper)"></button>
            <button onclick="setTheme('neon-cyber')" class="w-3.5 h-3.5 rounded-full bg-[#ff2fd0] border border-white/10 hover:scale-125 transition" title="Neon Cyber (Futuristic Magenta)"></button>
            <button onclick="setTheme('glacier')" class="w-3.5 h-3.5 rounded-full bg-[#a5f3fc] border border-white/10 hover:scale-125 transition" title="Glacier (Nordic Ice)"></button>
            <!-- Reihe 3 -->
            <button onclick="setTheme('charcoal')" class="w-3.5 h-3.5 rounded-full bg-[#475569] border border-white/10 hover:scale-125 transition" title="Charcoal (Pure Graphite)"></button>
            <button onclick="setTheme('executive')" class="w-3.5 h-3.5 rounded-full bg-[#b5a642] border border-white/10 hover:scale-125 transition" title="Executive (Navy & Gold)"></button>
            <button onclick="setTheme('holo-chrome')" class="w-3.5 h-3.5 rounded-full bg-[#22e5d4] border border-white/10 hover:scale-125 transition" title="Holo Chrome (Futuristic Cyan HUD)"></button>
            <button onclick="setTheme('carbon')" class="w-3.5 h-3.5 rounded-full bg-[#1e293b] border border-white/10 hover:scale-125 transition" title="Carbon (Ultra-Minimal)"></button>
            <!-- Reihe 4 (Neue Premium Paper-Themen) -->
            <button onclick="setTheme('parchment')" class="w-3.5 h-3.5 rounded-full bg-[#8d5b34] border border-stone-800 hover:scale-125 transition" title="Parchment (Espresso & Parchment)"></button>
            <button onclick="setTheme('minimalist-light')" class="w-3.5 h-3.5 rounded-full bg-[#f8fafc] border border-stone-400 hover:scale-125 transition" title="Minimalist Light (Scandinavian White)"></button>
            <button onclick="setTheme('terracotta-light')" class="w-3.5 h-3.5 rounded-full bg-[#9a4c24] border border-stone-800 hover:scale-125 transition" title="Terracotta Light (Sand & Clay)"></button>
            <button onclick="setTheme('synthwave')" class="w-3.5 h-3.5 rounded-full bg-[#ff5f9e] border border-white/10 hover:scale-125 transition" title="Synthwave (Futuristic Retro Sunset)"></button>
          </div>
        </div>

        <!-- Language Dropdown Menu -->
        <div class="relative group cursor-pointer" onmouseenter="showPanelHover('language')" onmouseleave="hidePanelHover('language')">
          <button onclick="togglePanel('language')" class="h-8 px-2 border border-white/5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-200 flex items-center gap-1 text-xs font-semibold cursor-pointer transition shadow-sm">
            <span id="active-lang-flag" class="text-xs md:text-sm">🇬🇧</span>
            <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-gray-400"></i>
          </button>
          
          <div id="panel-language" class="hidden absolute right-0 top-[calc(100%+8px)] z-[110] w-[48px] bg-[#111116] border border-purple-500/40 p-1.5 rounded-xl shadow-2xl flex flex-col gap-1.5 items-center">
            <button onclick="setLanguage('de')" class="text-sm hover:scale-110 active:scale-95 transition">🇩🇪</button>
            <button onclick="setLanguage('en')" class="text-sm hover:scale-110 active:scale-95 transition">🇬🇧</button>
            <button onclick="setLanguage('es')" class="text-sm hover:scale-110 active:scale-95 transition">🇪🇸</button>
            <button onclick="setLanguage('el')" class="text-sm hover:scale-110 active:scale-95 transition">🇬🇷</button>
            <button onclick="setLanguage('fr')" class="text-sm hover:scale-110 active:scale-95 transition">🇫🇷</button>
            <button onclick="setLanguage('it')" class="text-sm hover:scale-110 active:scale-95 transition">🇮🇹</button>
          </div>
        </div>
      </div>

    </header>

    <!-- DASHBOARD 7-COLUMN GRID -->
    <main class="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5 flex-1 w-full min-h-0 items-start">
      <!-- Generated columns via JS -->
    </main>

    <!-- MOBILE: Bottom-Tab-Leiste für Kategorie-Navigation (nur auf Touch/Mobile sichtbar, siehe styles-mobile.css) -->
    <nav id="mobile-category-tabs" class="mobile-category-tabs" aria-label="Kategorien"></nav>

    <!-- ZEN CHILL VIEW -->
    <div id="zen-chill-view" class="hidden flex-col items-center justify-center flex-1 max-w-2xl mx-auto w-full text-center p-6 md:p-10 my-auto animate-fade-in select-none">
      <div class="relative bg-[#13131c]/80 border border-purple-500/20 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(139,92,246,0.15)] backdrop-blur-2xl w-full flex flex-col items-center gap-6 transition-all duration-300">
        
        <span onclick="toggleMinimalist()" class="modal-close-btn text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer transition" title="Focus Mode beenden (Esc)">✕</span>
        
        <div class="h-16 w-16 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(139,92,246,0.15)] animate-pulse">
          🧘
        </div>
        
        <div id="zen-task-cat" class="text-xs uppercase font-bold tracking-widest text-[var(--accent-light)] font-mono px-3 py-1 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-full" data-i18n="recommendation_now">
          Empfehlung - jetzt
        </div>
        
        <h1 id="zen-task-text" class="font-display font-black text-2xl md:text-4xl text-white tracking-tight leading-relaxed max-w-lg min-h-[5rem] flex items-center justify-center">
          Lade deine nächste Fokus-Aufgabe...
        </h1>
        
        <div class="flex items-center gap-4 bg-black/40 border border-white/5 py-2.5 px-5 rounded-2xl shadow-inner mt-2">
          <div class="flex flex-col items-center justify-center min-w-[50px]">
            <span id="zen-timer-display" class="font-display font-black text-xl tracking-wider text-[var(--accent-light)] leading-none">02:00</span>
          </div>
          <div class="h-5 w-[1px] bg-white/10"></div>
          <div class="flex items-center gap-2">
            <button onclick="toggleTimer()" class="p-1.5 hover:bg-white/5 rounded-xl transition text-emerald-400" title="Start/Pause">
              <i data-lucide="play" class="w-4 h-4"></i>
            </button>
            <button onclick="stopTimer()" class="p-1.5 hover:bg-white/5 rounded-xl transition text-rose-400" title="Stop">
              <i data-lucide="square" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <button onclick="zenCompleteCurrentTask()" class="mt-4 px-8 py-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-purple-500/30 text-gray-300 hover:text-white font-semibold text-sm rounded-xl shadow-md transform active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer" title="Diese Aufgabe jetzt als erledigt markieren">
          <i data-lucide="check" class="w-4.5 h-4.5 text-emerald-400"></i>
          <span data-i18n="complete_btn">Als erledigt markieren</span>
        </button>
      </div>
    </div>

`);

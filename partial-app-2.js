// Ausgelagert aus index.html: Wird per document.write an der Original-Position eingefuegt
document.write(`      <!-- BEHÄLTER 8: Statistik & Pause (Insights & Recovery) -->
      <div class="desktop-only-header flex items-center gap-1.5 p-1 bg-white/[0.025] border border-white/[0.07] rounded-2xl shadow-sm shrink-0 zen-hide">
        <div class="relative group cursor-pointer">
          <button onclick="togglePanel('report')" class="h-8 px-2.5 border border-white/10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] hover:border-purple-500/30 text-gray-200 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition whitespace-nowrap shadow-sm" title="Erledigungsstatistiken und Diagramme einsehen">
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
                  <button onclick="setReportTimeframe('today')" id="report-tab-today" class="px-2 py-1 rounded text-[var(--accent-light)] bg-[var(--accent)]/25 cursor-pointer transition" data-i18n="today">Today</button>
                  <button onclick="setReportTimeframe('week')" id="report-tab-week" class="px-2 py-1 rounded text-gray-400 hover:text-white cursor-pointer transition" data-i18n="week">Week</button>
                  <button onclick="setReportTimeframe('month')" id="report-tab-month" class="px-2 py-1 rounded text-gray-400 hover:text-white cursor-pointer transition" data-i18n="month">Month</button>
                </div>
              </div>

              <!-- Stats Grid -->
              <div class="grid grid-cols-2 gap-2 mb-3">
                <div class="p-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-center shadow-inner">
                  <div class="text-[10px] text-gray-400 mb-0.5 whitespace-nowrap" data-i18n="completed_stat">Completed</div>
                  <div id="report-today-count" class="text-lg font-bold font-display text-emerald-400">0</div>
                </div>
                <div class="p-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-center shadow-inner">
                  <div class="text-[10px] text-gray-400 mb-0.5 whitespace-nowrap" data-i18n="pending_stat">Remaining</div>
                  <div id="report-pending-count" class="text-lg font-bold font-display text-amber-400">0</div>
                </div>
              </div>

              <!-- 7-Tage-Aktivität -->
              <div id="report-chart-container" class="mb-3 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                <h5 class="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2 flex items-center justify-between">
                  <span data-i18n="weekly_activity">7-Day Activity (Mon-Sun)</span>
                  <span id="report-total-week-tasks" class="font-mono text-purple-300 font-bold">0 Tasks</span>
                </h5>
                <div id="report-weekly-chart" class="flex items-end justify-between h-16 pt-2 px-1 animate-fade-in"></div>
              </div>

              <!-- Category Progress Bars -->
              <div id="report-category-bars" class="space-y-2.5 mb-3 text-xs"></div>

              <!-- Intelligent Insights Tip -->
              <div id="report-insight-box" class="p-2.5 border border-purple-500/20 rounded-xl text-xs text-purple-200 flex items-start gap-2 bg-[#1c1c28]">
                <i data-lucide="lightbulb" class="w-4 h-4 text-purple-400 shrink-0 mt-0.5"></i>
                <span id="report-insight-text" data-i18n="loading_stats">Loading your achievements...</span>
              </div>
            </div>

            <!-- Export Button -->
            <button onclick="openReportExportModal()" class="w-full mt-3 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer">
              <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
              <span data-i18n="stat_export_btn">Export Report (Week & Month) 📑</span>
            </button>

            <!-- Completed Items Log -->
            <div id="report-list" class="mt-3 space-y-1.5 max-h-[150px] overflow-y-auto text-xs pr-1 border-t border-white/5 pt-3"></div>
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
      <div class="desktop-only-header flex items-center gap-1 p-1 bg-white/[0.025] border border-white/[0.07] rounded-2xl shadow-sm shrink-0">
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
      <div class="desktop-only-header flex items-center gap-1 p-1 bg-white/[0.025] border border-white/[0.07] rounded-2xl shadow-sm shrink-0">

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

        <!-- Sync (1-Klick Öffnen) -->
        <div class="relative group cursor-pointer zen-hide">
          <button onclick="openSyncModal()" class="h-8 w-8 flex items-center justify-center border border-emerald-500/30 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 cursor-pointer transition shadow-sm" title="Geräte-Synchronisation & Handy koppeln">
            <i data-lucide="cloud" id="header-sync-btn-icon" class="w-3.5 h-3.5 text-emerald-400"></i>
          </button>
        </div>

      </div>

      <!-- MOBILE-ONLY MENÜ-TRIGGER -->
      <div class="mobile-only flex items-center shrink-0">
        <button onclick="openMobileMenuDrawer()" class="h-8 w-8 flex items-center justify-center border border-white/10 rounded-xl bg-white/[0.06] text-white active:scale-95 transition" title="Menü & Einstellungen">
          <i data-lucide="menu" class="w-4 h-4 text-purple-400"></i>
        </button>
      </div>

    </header>

    <!-- SAMPLE-TASKS BANNER (Wird rein über Hover auf Heute/Haushalt eingeblendet) -->
    <div id="sample-tasks-banner" onmouseenter="showSampleBannerOnHover(true)" onmouseleave="showSampleBannerOnHover(false)" class="bg-gradient-to-r from-purple-950/50 via-[#161622]/95 to-cyan-950/50 border border-purple-500/30 rounded-2xl backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs zen-hide">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
          <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
        </div>
        <div>
          <span class="font-bold text-white block text-xs" data-i18n="sample_banner_title">💡 Dies sind Beispiel-Aufgaben zur Inspiration.</span>
          <span class="text-[11px] text-gray-400" data-i18n="sample_banner_desc">Du kannst sie anpassen, nur gewünschte behalten oder mit einem leeren Plan starten.</span>
        </div>
      </div>
      <div class="flex items-center gap-2 w-full md:w-auto flex-wrap">
        <button onclick="dismissSampleBanner(true)" class="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl font-bold transition cursor-pointer flex-1 md:flex-none text-center" data-i18n="sample_keep_all">
          Alle behalten ✓
        </button>
        <button onclick="openSampleManagerModal()" class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition cursor-pointer flex-1 md:flex-none text-center" data-i18n="sample_customize_btn">
          Auswählen & Anpassen ✏️
        </button>
        <button onclick="clearAllSampleTasks()" class="px-3 py-1.5 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-300 border border-white/10 hover:border-red-500/30 rounded-xl font-semibold transition cursor-pointer flex-1 md:flex-none text-center" data-i18n="sample_clear_all">
          Leer starten 🗑️
        </button>
      </div>
    </div>

    <!-- DASHBOARD 7-COLUMN GRID -->
    <main class="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5 flex-1 w-full min-h-0 items-start">
      <!-- Generated columns via JS -->
    </main>

    <!-- MOBILE: Bottom-Tab-Leiste für Kategorie-Navigation (nur auf Touch/Mobile sichtbar, siehe styles-mobile.css) -->
    <nav id="mobile-category-tabs" class="mobile-category-tabs" aria-label="Kategorien"></nav>

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

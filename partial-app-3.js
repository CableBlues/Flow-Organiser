// Ausgelagert aus index.html: Wird per document.write an der Original-Position eingefuegt
document.write(`    <!-- CENTRAL DOCK (macOS 3D Floating-Stil) -->
    <div class="mac-floating-wrapper z-[9999] zen-hide">
      <div class="mac-dock-container relative">
        <div class="mac-dock-floor"></div>
        
        <button class="mac-tools-trigger flex flex-col items-center justify-center gap-0.5">
          <span class="text-[8px] opacity-75 font-sans tracking-[0.15em] font-semibold uppercase leading-none">Flow</span>
          <span class="text-[9px] opacity-60 font-display tracking-[0.05em] font-medium uppercase leading-none">Tools</span>
        </button>
        
        <div class="mac-dock flex items-center p-2 rounded-2xl relative z-10 border select-none transition-all duration-300">
          
          <!-- FACH 1: Geist & Entspannung -->
          <div class="flex items-center gap-1.5 px-1 bg-transparent relative">
            <div class="relative group cursor-pointer mac-dock-item-wrapper" onmouseenter="showPanelHover('soundscape')" onmouseleave="hidePanelHover('soundscape')">
              <button onclick="handleSoundsMainClick()" class="mac-dock-btn balloon-sounds h-12 w-12 md:h-14 md:w-14 rounded-2xl text-zinc-200 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="Naturgeräusche ein- oder ausschalten">
                <i data-lucide="leaf" class="w-5 h-5 text-zinc-400"></i>
                <span class="dock-label">Sounds</span>
                <span id="soundscape-indicator" class="hidden w-1.5 h-1.5 rounded-full bg-zinc-400 animate-ping absolute top-1 right-1"></span>
              </button>
              
              <div id="panel-soundscape" class="hidden absolute left-0 bottom-[calc(100%+10px)] z-[110] w-[280px] sm:w-[410px] bg-[#111116]/95 border border-zinc-500/40 p-3 rounded-2xl shadow-2xl backdrop-blur-md">
                <div class="flex items-center justify-between mb-2 pb-1 border-b border-white/10">
                  <h4 class="font-bold text-xs font-display text-white flex items-center gap-1.5">
                    <i data-lucide="leaf" class="w-3.5 h-3.5 text-zinc-400"></i>
                    <span data-i18n="soundscape_title">Naturgeräusche</span>
                  </h4>
                  <button onclick="togglePanel('soundscape')" class="text-gray-400 hover:text-white text-[10px] font-bold p-0.5">✕</button>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-2.5">
                  <button onclick="playAmbientSound('rain')" id="sound-btn-rain" class="p-1 bg-white/5 hover:bg-zinc-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8">
                    <span class="text-xs shrink-0">🌧️</span>
                    <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_rain">Sommerregen</span>
                  </button>
                  <button onclick="playAmbientSound('ocean')" id="sound-btn-ocean" class="p-1 bg-white/5 hover:bg-zinc-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8">
                    <span class="text-xs shrink-0">🌊</span>
                    <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_ocean">Ozeanwellen</span>
                  </button>
                  <button onclick="playAmbientSound('campfire')" id="sound-btn-campfire" class="p-1 bg-white/5 hover:bg-zinc-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8">
                    <span class="text-xs shrink-0">🔥</span>
                    <span class="text-white font-bold text-[9px] truncate">Lagerfeuer</span>
                  </button>
                  <button onclick="playAmbientSound('birds')" id="sound-btn-birds" class="p-1 bg-white/5 hover:bg-zinc-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8">
                    <span class="text-xs shrink-0">🐦</span>
                    <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_birds">Waldvögel</span>
                  </button>
                  <button onclick="playAmbientSound('stream')" id="sound-btn-stream" class="p-1 bg-white/5 hover:bg-zinc-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8">
                    <span class="text-xs shrink-0">🏔️</span>
                    <span class="text-white font-bold text-[9px] truncate">Gebirgsbach</span>
                  </button>
                  <button onclick="playAmbientSound('temple')" id="sound-btn-temple" class="p-1 bg-white/5 hover:bg-zinc-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8">
                    <span class="text-xs shrink-0">🎋</span>
                    <span class="text-white font-bold text-[9px] truncate">Zen-Tempel</span>
                  </button>
                  <button onclick="playAmbientSound('cafe')" id="sound-btn-cafe" class="p-1 bg-white/5 hover:bg-zinc-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8">
                    <span class="text-xs shrink-0">☕</span>
                    <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_cafe">Cozy Café</span>
                  </button>
                  <button onclick="playAmbientSound('clock')" id="sound-btn-clock" class="p-1 bg-white/5 hover:bg-zinc-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8">
                    <span class="text-xs shrink-0">🕰️</span>
                    <span class="text-white font-bold text-[9px] truncate">Uhrenladen</span>
                  </button>
                  <button onclick="playAmbientSound('purr')" id="sound-btn-purr" class="p-1 bg-white/5 hover:bg-zinc-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8">
                    <span class="text-xs shrink-0">🐱</span>
                    <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_purr">Katzen-Schnurren</span>
                  </button>
                </div>

                <div class="flex items-center gap-2 pt-1.5 border-t border-white/10 text-xs">
                  <i data-lucide="volume-2" class="w-3.5 h-3.5 text-zinc-400 shrink-0"></i>
                  <input type="range" min="0" max="1" step="0.05" value="0.5" oninput="setSoundVolume(this.value)" class="master-volume-slider w-full accent-[var(--accent)] cursor-pointer h-1 bg-black/50 rounded-xl">
                  <button onclick="stopAmbientSound()" class="px-2 py-0.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 rounded text-[10px] font-bold transition shrink-0 cursor-pointer" data-i18n="stop">Stop</button>
                </div>
              </div>
            </div>

            <!-- Musik -->
            <div class="relative group cursor-pointer mac-dock-item-wrapper" onmouseenter="showPanelHover('music')" onmouseleave="hidePanelHover('music')">
              <button onclick="handleMusicMainClick()" class="mac-dock-btn balloon-music h-12 w-12 md:h-14 md:w-14 rounded-2xl text-purple-200 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="Eigene Audio-Tracks laden, abspielen oder pausieren">
                <i data-lucide="waves" class="w-5 h-5 text-purple-400"></i>
                <span class="dock-label">Musik</span>
              </button>
              
              <div id="panel-music" class="hidden absolute left-0 bottom-[calc(100%+10px)] z-[110] w-[380px] bg-[#111116]/95 border border-purple-500/40 p-4 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col gap-3">
                <div class="flex flex-col gap-3">
                  <div class="flex items-center justify-between border-b border-white/10 pb-2">
                    <h4 class="font-bold text-sm font-display text-white flex items-center gap-2">
                      <i data-lucide="disc-3" class="w-4 h-4 text-purple-400 animate-spin"></i>
                      <span>Audio-Tracks</span>
                      <span id="player-track-count" class="text-[9px] text-gray-500 font-mono font-normal"></span>
                    </h4>
                    <span id="player-shuffle-badge" class="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase tracking-wider font-mono">Shuffle On</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <button onclick="document.getElementById('sound-file-input').click()" class="flex-1 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-dashed border-purple-400/30 text-purple-300 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm">
                      <i data-lucide="folder-symlink" class="w-3.5 h-3.5"></i>
                      <span>Tracks laden</span>
                    </button>
                    <button onclick="clearPlaylist()" title="Playlist leeren" class="shrink-0 p-2.5 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-300 rounded-xl transition cursor-pointer">
                      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                  <input type="file" id="sound-file-input" accept="audio/*" onchange="handleUserSoundFile(event)" class="hidden" multiple />

                  <div id="custom-playlist-player" class="hidden p-3 bg-black/60 border border-white/10 rounded-xl flex flex-col gap-2.5">
                    <div class="flex flex-col gap-0.5">
                      <div id="user-sound-name" class="text-[11px] text-purple-300 font-bold truncate tracking-wide italic text-center">Keine Titel geladen</div>
                      <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-1.5 relative cursor-pointer group" onclick="handleProgressBarClick(event)">
                        <div id="player-progress-bar" class="h-full bg-purple-400 group-hover:bg-purple-300 transition-all duration-150" style="width: 0%"></div>
                      </div>
                      <div class="flex justify-between items-center text-[8px] text-gray-500 font-mono mt-0.5">
                        <span id="player-time-current">00:00</span>
                        <span id="player-time-duration">00:00</span>
                      </div>
                    </div>

                    <div class="flex items-center justify-center gap-2.5 mt-1">
                      <button onclick="togglePlayerShuffle()" id="player-shuffle-toggle-btn" title="Zufällige Wiedergabe" class="p-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 rounded-lg cursor-pointer transition">
                        <i data-lucide="shuffle" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="playPreviousTrack()" title="Vorheriger Track" class="p-1.5 bg-white/5 hover:bg-white/10 text-purple-400 rounded-lg cursor-pointer transition">
                        <i data-lucide="skip-back" class="w-3.5 h-3.5"></i>
                      </button>
                      <button id="player-play-pause-btn" onclick="togglePlaylistPlayback()" title="Abspielen/Pause" class="p-2.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 rounded-xl cursor-pointer transition shadow-md">
                        <i data-lucide="pause" class="w-4 h-4"></i>
                      </button>
                      <button onclick="playNextTrackWithCrossfade()" title="Nächster Track" class="p-1.5 bg-white/5 hover:bg-white/10 text-purple-400 rounded-lg cursor-pointer transition">
                        <i data-lucide="skip-forward" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="cyclePlayerRepeatMode()" id="player-repeat-toggle-btn" title="Wiederholen: Playlist" class="p-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 rounded-lg cursor-pointer transition">
                        <i id="player-repeat-icon" data-lucide="repeat" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>

                    <div class="flex items-center gap-2 pt-1 border-t border-white/5 mt-0.5">
                      <button onclick="togglePlayerMute()" id="player-mute-toggle-btn" title="Stumm schalten" class="shrink-0 p-1 text-gray-400 hover:text-white transition cursor-pointer">
                        <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                      </button>
                      <input type="range" min="0" max="1" step="0.05" value="0.5" oninput="setSoundVolume(this.value)" class="master-volume-slider w-full accent-purple-400 cursor-pointer h-1 bg-black/50 rounded-xl">
                    </div>

                    <div id="track-list-container" class="mt-1 text-left flex flex-col gap-1 max-h-[260px] overflow-y-auto pr-1 border-t border-white/5 pt-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="h-8 w-[1px] bg-white/10 mx-1 align-middle self-center"></div>

          <!-- FACH 2: Alltag & Utility -->
          <div class="flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-xl shadow-sm shrink-0">
            <!-- Einkauf -->
            <div class="relative group cursor-pointer mac-dock-item-wrapper" onmouseenter="showPanelHover('shopping')" onmouseleave="hidePanelHover('shopping')">
              <button onclick="togglePanel('shopping')" class="mac-dock-btn balloon-shopping h-12 w-12 md:h-14 md:w-14 rounded-2xl text-emerald-200 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="Interaktive Einkaufsliste und Spartipps öffnen">
                <i data-lucide="shopping-basket" class="w-5 h-5 text-emerald-400"></i>
                <span class="dock-label">Kauf</span>
                <span id="shop-badge-count" class="hidden px-1 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[8px] font-bold absolute top-1 right-1">0</span>
              </button>
              
              <div id="panel-shopping" class="hidden absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+10px)] z-[110] w-[290px] sm:w-[330px] bg-[#111116]/95 border border-emerald-500/40 p-4 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col gap-3">
                <div class="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 class="font-bold text-sm font-display text-white flex items-center gap-1.5">
                    <i data-lucide="shopping-basket" class="w-4 h-4 text-emerald-400"></i>
                    <span>Einkaufsliste</span>
                  </h4>
                </div>
                
                <div class="max-h-[140px] overflow-y-auto pr-1 flex flex-col gap-1.5 text-xs text-gray-300" id="shopping-list-rows"></div>

                <div class="flex gap-1.5 p-1 bg-black/40 border border-white/5 rounded-xl">
                  <input type="text" id="shop-add-name" placeholder="Artikel hinzufügen..." class="flex-1 p-2 bg-[#12121c] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-emerald-500 font-semibold" />
                  <button onclick="handleAddShoppingItem()" class="px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl flex items-center justify-center transition cursor-pointer">
                    <i data-lucide="plus" class="w-4 h-4"></i>
                  </button>
                </div>

                <div id="shop-tip-box" class="p-2 bg-emerald-500/5 border border-emerald-500/20 text-[9px] text-emerald-200 rounded-xl flex items-start gap-1.5 leading-normal">
                  <i data-lucide="sparkles" class="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse"></i>
                  <span id="shop-tip-text">Spartipps werden geladen...</span>
                </div>

                <div class="flex items-center justify-between text-[9px] text-gray-500 pt-1 border-t border-white/5">
                  <button onclick="toggleShoppingHistory()" class="hover:text-gray-300 flex items-center gap-1 transition cursor-pointer"><i data-lucide="history" class="w-3.5 h-3.5"></i>  Protokoll</button>
                  <button onclick="clearShoppingList()" class="hover:text-red-400 transition cursor-pointer">Leeren 🗑️</button>
                </div>

                <div id="shop-history-box" class="hidden p-2 bg-black/60 border border-white/5 rounded-xl text-[9px] flex flex-col gap-1 max-h-[80px] overflow-y-auto">
                  <div class="flex items-center justify-between border-b border-white/5 pb-1 mb-1 font-bold text-gray-500">
                    <span>Zuletzt gekauft</span>
                    <button onclick="clearShoppingHistory()" class="hover:text-red-400 text-[8px] uppercase tracking-wider font-mono">Leeren</button>
                  </div>
                  <div id="shop-history-list" class="flex flex-col gap-1"></div>
                </div>
              </div>
            </div>

            <!-- Kochen -->
            <div class="relative group cursor-pointer mac-dock-item-wrapper" onmouseenter="showPanelHover('cooking')" onmouseleave="hidePanelHover('cooking')">
              <button onclick="togglePanel('cooking')" class="mac-dock-btn balloon-cooking h-12 w-12 md:h-14 md:w-14 border border-orange-500/30 rounded-2xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-200 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="Kochen: Zutaten verwalten und Rezeptvorschläge nach dem vorhandenen Vorrat erhalten">
                <i data-lucide="cooking-pot" class="w-5 h-5 text-orange-400"></i>
                <span class="dock-label">Kochen</span>
              </button>

              <div id="panel-cooking" class="hidden absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+10px)] z-[110] w-[300px] bg-[#111116]/95 border border-orange-500/40 p-4 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col gap-3">
                <div class="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 class="font-bold text-sm font-display text-white flex items-center gap-1.5">
                    <i data-lucide="cooking-pot" class="w-4 h-4 text-orange-400"></i>
                    <span>Kochen</span>
                  </h4>
                </div>
              </div>
            </div>

            <!-- Skripte -->
            <div class="mac-dock-item-wrapper">
              <button id="scripting-trigger-btn" onclick="openScriptingModal()" class="mac-dock-btn balloon-scripting h-12 w-12 md:h-14 md:w-14 rounded-2xl text-indigo-200 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="Social-Skripter: Telefonskripte & soziale Vorlagen">
                <i data-lucide="scroll" class="w-5 h-5 text-indigo-400"></i>
                <span class="dock-label">Skripte</span>
              </button>
            </div>
          </div>

          <div class="h-8 w-[1px] bg-white/10 mx-1 align-middle self-center"></div>

          <!-- FACH 3: Fokus & Entscheidung -->
          <div class="flex items-center gap-1.5 px-1 bg-transparent relative">
            <!-- Funke -->
            <div class="relative group mac-dock-item-wrapper" onmouseenter="showPanelHover('boost'); suggestBoostActivity();" onmouseleave="hidePanelHover('boost')">
              <button onclick="togglePanel('boost')" class="mac-dock-btn balloon-boost h-12 w-12 md:h-14 md:w-14 rounded-2xl text-amber-300 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="30-Sekunden-Aktivität zur Überwindung von Blockaden erhalten">
                <i data-lucide="zap" class="w-5 h-5 text-amber-400"></i>
                <span class="dock-label">Funke</span>
              </button>
              
              <div id="panel-boost" class="hidden absolute bottom-[calc(100%+10px)] right-0 z-[110] w-[280px] bg-[#111116]/95 border border-amber-500/40 p-4 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col gap-3">
                <p class="text-[11px] text-gray-400 leading-normal" data-i18n="boost_desc">
                  Fühlst du dich blockiert? Gönn dir eine winzige, 30-sekündige Aktivität, um deinen Fokus neu auszurichten:
                </p>
                <div id="boost-activity-box" class="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center text-xs font-semibold text-amber-200 min-h-[48px] flex items-center justify-center" data-i18n="boost_placeholder">
                  Klicke unten für einen Vorschlag!
                </div>
                <button onclick="suggestBoostActivity()" class="w-full py-1.5 bg-amber-500 text-black text-xs font-bold rounded-xl hover:opacity-90 transition cursor-pointer" data-i18n="boost_new">Neuer Vorschlag 🔄</button>
              </div>
            </div>

            <!-- Inspiration -->
            <div class="relative group cursor-pointer mac-dock-item-wrapper" onmouseenter="showPanelHover('inspiration')" onmouseleave="hidePanelHover('inspiration')">
              <button onclick="togglePanel('inspiration')" class="mac-dock-btn balloon-inspire h-12 w-12 md:h-14 md:w-14 rounded-2xl text-violet-300 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="Inspirierenden Impuls für den Geist anzeigen">
                <i data-lucide="sparkles" class="w-5 h-5 text-violet-400"></i>
                <span class="dock-label">Inspire</span>
              </button>
              
              <div id="panel-inspiration" class="hidden absolute bottom-[calc(100%+10px)] right-0 z-[110] w-[320px] sm:w-[360px] bg-[#111116]/95 border border-violet-500/40 p-4 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col gap-3">
                <div class="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <span class="text-[11px] uppercase font-bold tracking-wider text-violet-400 flex items-center gap-1.5 font-mono">
                    <i data-lucide="sparkles" class="w-3.5 h-3.5 text-violet-400"></i> Inspiration
                  </span>
                  <button onclick="togglePanel('inspiration')" class="text-gray-400 hover:text-white text-xs">✕</button>
                </div>
                <p class="text-[11px] text-gray-400 leading-normal">
                  Ein kleiner Impuls für deinen Geist. Manchmal hilft ein Perspektivwechsel:
                </p>
                <div id="inspiration-quote-box" class="p-3.5 bg-violet-500/5 border border-violet-500/20 rounded-xl text-left text-xs font-semibold text-violet-200 min-h-[72px] flex items-center justify-center italic leading-relaxed">
                  <p class="p-3.5 bg-violet-500/5 border border-violet-500/20 rounded-xl text-left text-xs font-semibold text-violet-200 min-h-[72px] flex items-center justify-center italic leading-relaxed">Klicke unten für einen inspirierenden Impuls!</p>
                </div>
                <button onclick="suggestInspirationQuote()" class="w-full py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1">
                  <span>Nächster Impuls</span> <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>

            <!-- Kompass -->
            <div class="mac-dock-item-wrapper">
              <button onclick="openCompassModal()" class="mac-dock-btn balloon-compass h-12 w-12 md:h-14 md:w-14 rounded-2xl text-rose-200 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="Entscheidungs-Kompass: Intuitive, rationale & psychologische Lebensentscheidungen treffen">
                <i data-lucide="compass" class="w-5 h-5 text-rose-400"></i>
                <span class="dock-label">Kompass</span>
              </button>
            </div>

            <!-- Sport -->
            <div class="mac-dock-item-wrapper">
              <button id="sport-trigger-btn" onclick="openSportModal()" class="mac-dock-btn balloon-sport h-12 w-12 md:h-14 md:w-14 rounded-2xl text-orange-200 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="Sport & Aktivierung: Wohltuende Mikrobewegung für jeden Energiezustand">
                <i data-lucide="dumbbell" class="w-5 h-5 text-orange-400 animate-pulse"></i>
                <span class="dock-label">Sport</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>

  <!-- CELEBRATION OVERLAY -->
`);

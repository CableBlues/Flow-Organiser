// Ausgelagert aus index.html: Wird per document.write an der Original-Position eingefuegt
document.write(`    <!-- CENTRAL DOCK (macOS 3D Floating-Stil) -->
    <div class="mac-floating-wrapper z-40 zen-hide">
      <div class="mac-dock-container relative">
        <div class="mac-dock-floor"></div>
        
        <button class="mac-tools-trigger flex flex-col items-center justify-center gap-0.5">
          <span class="text-[8px] opacity-75 font-sans tracking-[0.15em] font-semibold uppercase leading-none">Flow</span>
          <span class="text-[9px] opacity-60 font-display tracking-[0.05em] font-medium uppercase leading-none">Tools</span>
        </button>
        
        <div class="mac-dock flex items-center p-2 rounded-2xl relative z-10 border select-none transition-all duration-300">
          
          <!-- FACH 1: Geist & Entspannung -->
          <div class="flex items-center gap-1.5 px-1 bg-transparent relative">
            <div class="relative group cursor-pointer mac-dock-item-wrapper">
              <button onclick="handleSoundsMainClick()" class="mac-dock-btn balloon-sounds h-12 w-12 md:h-14 md:w-14 rounded-2xl text-zinc-200 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="Naturgeräusche ein- oder ausschalten">
                <i data-lucide="leaf" class="w-5 h-5 text-zinc-400"></i>
                <span class="dock-label" data-i18n="dock_sounds">Sounds</span>
                <span id="soundscape-indicator" class="hidden w-1.5 h-1.5 rounded-full bg-zinc-400 animate-ping absolute top-1 right-1"></span>
              </button>
              
              <div id="panel-soundscape" class="dock-popover-panel hidden absolute left-0 w-[280px] sm:w-[410px] bg-[#111116]/95 border border-zinc-500/40 p-3 rounded-2xl shadow-2xl backdrop-blur-md">
                <div class="flex items-center justify-between mb-2 pb-1 border-b border-white/10">
                  <h4 class="font-bold text-xs font-display text-white flex items-center gap-1.5">
                    <i data-lucide="leaf" class="w-3.5 h-3.5 text-zinc-400"></i>
                    <span data-i18n="soundscape_title">Naturgeräusche</span>
                  </h4>
                  <button onclick="togglePanel('soundscape')" class="text-gray-400 hover:text-white text-[10px] font-bold p-0.5">✕</button>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-2.5">
                  <button onclick="playAmbientSound('piano')" id="sound-btn-piano" class="p-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                    <span class="text-xs shrink-0">🎹</span>
                    <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_piano">Sanftes Piano</span>
                  </button>
                  <button onclick="playAmbientSound('lofi')" id="sound-btn-lofi" class="p-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                    <span class="text-xs shrink-0">🎶</span>
                    <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_lofi">Lofi Chords</span>
                  </button>
                  <button onclick="playAmbientSound('chimes')" id="sound-btn-chimes" class="p-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                    <span class="text-xs shrink-0">🎐</span>
                    <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_chimes">Windspiel</span>
                  </button>
                  <button onclick="playAmbientSound('space')" id="sound-btn-space" class="p-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                    <span class="text-xs shrink-0">🌌</span>
                    <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_space">Cosmic Ambient</span>
                  </button>
                  <button onclick="playAmbientSound('guitar')" id="sound-btn-guitar" class="p-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                    <span class="text-xs shrink-0">🪕</span>
                    <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_guitar">Akustik-Gitarre</span>
                  </button>
                  <button onclick="playAmbientSound('singingbowl')" id="sound-btn-singingbowl" class="p-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                    <span class="text-xs shrink-0">🥣</span>
                    <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_singingbowl">Klangschale</span>
                  </button>
                  <button onclick="playAmbientSound('musicbox')" id="sound-btn-musicbox" class="p-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                    <span class="text-xs shrink-0">🌙</span>
                    <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_musicbox">Spieluhr</span>
                  </button>
                  <button onclick="playAmbientSound('breeze')" id="sound-btn-breeze" class="p-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                    <span class="text-xs shrink-0">🍃</span>
                    <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_breeze">Blättersäuseln</span>
                  </button>
                  <button onclick="playAmbientSound('campfire')" id="sound-btn-campfire" class="p-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                    <span class="text-xs shrink-0">🔥</span>
                    <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_campfire">Kaminfeuer</span>
                  </button>
                  <button onclick="playAmbientSound('birds')" id="sound-btn-birds" class="p-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                    <span class="text-xs shrink-0">🐦</span>
                    <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_birds">Waldvögel</span>
                  </button>
                  <button onclick="playAmbientSound('cafe')" id="sound-btn-cafe" class="p-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                    <span class="text-xs shrink-0">☕</span>
                    <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_cafe">Cozy Café</span>
                  </button>
                  <button onclick="playAmbientSound('clock')" id="sound-btn-clock" class="p-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                    <span class="text-xs shrink-0">🕰️</span>
                    <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_clock">Pendeluhr</span>
                  </button>
                  <button onclick="playAmbientSound('lofi_sunshine')" id="sound-btn-lofi_sunshine" class="p-1.5 bg-white/5 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                    <span class="text-xs shrink-0">☀️</span>
                    <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_lofi_sunshine">Lofi Sunshine</span>
                  </button>
                  <button onclick="playAmbientSound('summer_meadow')" id="sound-btn-summer_meadow" class="p-1.5 bg-white/5 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                    <span class="text-xs shrink-0">🌻</span>
                    <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_summer_meadow">Sommerwiese</span>
                  </button>
                  <button onclick="playAmbientSound('bossa_nova')" id="sound-btn-bossa_nova" class="p-1.5 bg-white/5 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                    <span class="text-xs shrink-0">🎸</span>
                    <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_bossa_nova">Bossa Nova</span>
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
            <div class="relative group cursor-pointer mac-dock-item-wrapper">
              <button onclick="handleMusicMainClick()" class="mac-dock-btn balloon-music h-12 w-12 md:h-14 md:w-14 rounded-2xl text-purple-200 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="Eigene Audio-Tracks laden, abspielen oder pausieren">
                <i data-lucide="waves" class="w-5 h-5 text-purple-400"></i>
                <span class="dock-label" data-i18n="dock_music">Musik</span>
              </button>
              
              <div id="panel-music" class="dock-popover-panel hidden absolute left-0 w-[390px] sm:w-[440px] bg-[#101017]/98 border border-purple-500/40 p-4 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col gap-3">
                <div class="flex flex-col gap-3">
                  
                  <!-- DJ Deck Header -->
                  <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                        <i data-lucide="disc-3" class="w-4 h-4 text-purple-400"></i>
                      </div>
                      <div>
                        <h4 class="font-bold text-xs font-display text-white flex items-center gap-1.5">
                          <span>DJ Studio Deck</span>
                          <span id="player-track-count" class="text-[9px] text-gray-400 font-mono font-normal"></span>
                        </h4>
                        <div class="flex items-center gap-1.5 mt-0.5">
                          <span id="player-crossfade-badge" class="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold font-mono uppercase">Crossfade 8s</span>
                          <span id="player-shuffle-badge" class="text-[8px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold font-mono uppercase">Shuffle On</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center gap-1">
                      <button onclick="toggleDjControlsPanel()" id="dj-pro-controls-toggle-btn" class="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-[10px] font-bold border border-white/10 transition cursor-pointer flex items-center gap-1" title="DJ Pitch & Crossfade Konfiguration">
                        <i data-lucide="sliders" class="w-3.5 h-3.5"></i>
                        <span>FX</span>
                      </button>
                      <button onclick="document.getElementById('sound-file-input').click()" class="p-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 rounded-xl text-[10px] font-bold transition cursor-pointer flex items-center gap-1" title="Tracks hinzufügen">
                        <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                  </div>

                  <input type="file" id="sound-file-input" accept="audio/*" onchange="handleUserSoundFile(event)" class="hidden" multiple />

                  <!-- DJ TURNTABLE & MAIN PLAYER DISPLAY -->
                  <div id="custom-playlist-player" class="hidden p-3.5 bg-black/60 border border-white/10 rounded-2xl flex flex-col gap-3">
                    
                    <!-- Turntable Disk, Track Info & Vertical Volume Fader -->
                    <div class="flex items-center gap-2.5 bg-gradient-to-r from-purple-950/30 to-black/40 p-2.5 rounded-xl border border-white/5 relative">
                      <!-- Spinning Vinyl Disc -->
                      <div class="relative w-11 h-11 shrink-0 flex items-center justify-center">
                        <div id="dj-turntable-vinyl" class="w-11 h-11 rounded-full border-2 border-purple-500/40 bg-[#12121c] flex items-center justify-center shadow-md">
                          <div class="w-3.5 h-3.5 rounded-full bg-purple-500/30 border border-purple-400/50 flex items-center justify-center">
                            <div class="w-1 h-1 rounded-full bg-white"></div>
                          </div>
                        </div>
                      </div>

                      <!-- Track Title & Live LED Spectrum -->
                      <div class="min-w-0 flex-1 flex flex-col gap-1">
                        <div id="user-sound-name" class="text-xs text-white font-bold truncate">Keine Titel geladen</div>
                        
                        <!-- Animated DJ VU Bars -->
                        <div class="flex items-center gap-0.5 h-2.5">
                          <div class="dj-vu-bar w-1 h-1.5 bg-emerald-400 rounded-full"></div>
                          <div class="dj-vu-bar w-1 h-2.5 bg-emerald-400 rounded-full"></div>
                          <div class="dj-vu-bar w-1 h-1 bg-emerald-400 rounded-full"></div>
                          <div class="dj-vu-bar w-1 h-2 bg-teal-400 rounded-full"></div>
                          <div class="dj-vu-bar w-1 h-2.5 bg-teal-400 rounded-full"></div>
                          <div class="dj-vu-bar w-1 h-1.5 bg-yellow-400 rounded-full"></div>
                          <div class="dj-vu-bar w-1 h-1 bg-amber-400 rounded-full"></div>
                          <div class="dj-vu-bar w-1 h-2 bg-purple-400 rounded-full"></div>
                          <div class="dj-vu-bar w-1 h-2.5 bg-purple-400 rounded-full"></div>
                        </div>
                      </div>

                      <!-- KOMPAKTER VERTIKALER DJ-LAUTSTÄRKEN-FADER -->
                      <div class="flex flex-col items-center gap-0.5 pl-2 border-l border-white/10 shrink-0">
                        <button onclick="togglePlayerMute()" id="player-mute-toggle-btn" title="Stumm schalten" class="p-0.5 text-gray-400 hover:text-purple-300 transition cursor-pointer">
                          <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                        </button>
                        <div class="h-10 w-4 flex items-center justify-center relative">
                          <input type="range" min="0" max="1" step="0.05" value="0.5" oninput="setSoundVolume(this.value)" 
                            class="master-volume-slider vertical-slider accent-purple-400 cursor-pointer w-9 h-1 bg-black/60 rounded-full" 
                            title="Lautstärke">
                        </div>
                        <span class="text-[7px] text-gray-500 font-mono font-bold">VOL</span>
                      </div>
                    </div>

                    <!-- Progress Bar & Clocks -->
                    <div class="flex flex-col gap-1">
                      <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden relative cursor-pointer group" onclick="handleProgressBarClick(event)">
                        <div id="player-progress-bar" class="h-full bg-gradient-to-r from-purple-500 to-indigo-400 group-hover:from-purple-400 group-hover:to-indigo-300 transition-all duration-150" style="width: 0%"></div>
                      </div>
                      <div class="flex justify-between items-center text-[9px] text-gray-400 font-mono">
                        <span id="player-time-current">00:00</span>
                        <span id="player-time-remaining" class="text-purple-300">-00:00</span>
                      </div>
                    </div>

                    <!-- DJ TRANSPORT CONTROLS -->
                    <div class="flex items-center justify-between gap-1 pt-1">
                      <button onclick="cueTrackStart()" title="Cue (Track-Start)" class="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl cursor-pointer transition text-[10px] font-bold font-mono">
                        CUE
                      </button>
                      <button onclick="skipAudioTime(-10)" title="10s zurück" class="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl cursor-pointer transition">
                        <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="playPreviousTrack()" title="Vorheriger Track" class="p-2 bg-white/5 hover:bg-white/10 text-purple-300 rounded-xl cursor-pointer transition">
                        <i data-lucide="skip-back" class="w-4 h-4"></i>
                      </button>
                      <button id="player-play-pause-btn" onclick="togglePlaylistPlayback()" title="Play / Pause" class="p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl cursor-pointer transition shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center">
                        <i data-lucide="pause" class="w-5 h-5"></i>
                      </button>
                      <button onclick="playNextTrackWithCrossfade()" title="Nächster Track (mit Crossfade)" class="p-2 bg-white/5 hover:bg-white/10 text-purple-300 rounded-xl cursor-pointer transition">
                        <i data-lucide="skip-forward" class="w-4 h-4"></i>
                      </button>
                      <button onclick="skipAudioTime(10)" title="10s vor" class="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl cursor-pointer transition">
                        <i data-lucide="rotate-cw" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="togglePlayerShuffle()" id="player-shuffle-toggle-btn" title="Zufallswiedergabe" class="p-2 bg-purple-500/20 text-purple-300 rounded-xl cursor-pointer transition border border-purple-500/30">
                        <i data-lucide="shuffle" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="cyclePlayerRepeatMode()" id="player-repeat-toggle-btn" title="Wiederholung" class="p-2 bg-purple-500/20 text-purple-300 rounded-xl cursor-pointer transition border border-purple-500/30">
                        <i id="player-repeat-icon" data-lucide="repeat" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>

                    <!-- PRO DJ DRAWER: CROSSFADE & PITCH CONTROLS -->
                    <div id="dj-pro-controls-drawer" class="hidden space-y-2.5 p-3 bg-black/80 border border-purple-500/30 rounded-xl animate-fade-in text-[10px]">
                      
                      <!-- Crossfade Options -->
                      <div class="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                        <div class="flex items-center gap-1.5">
                          <span class="font-bold text-white uppercase tracking-wider font-mono">⚡ Crossfade:</span>
                          <button onclick="toggleCrossfade()" id="dj-crossfade-toggle-btn" class="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg font-bold cursor-pointer">
                            Aktiv
                          </button>
                        </div>
                        <select id="dj-crossfade-select" onchange="setCrossfadeDuration(this.value)" class="bg-[#181824] border border-white/15 text-white rounded-lg p-1 text-[10px] outline-none cursor-pointer">
                          <option value="4">4s (Quick Mix)</option>
                          <option value="8" selected>8s (Club Mix)</option>
                          <option value="11">11s (Default Flow)</option>
                          <option value="16">16s (Deep Ambient)</option>
                          <option value="0">0s (Aus / Hard Cut)</option>
                        </select>
                      </div>

                      <!-- Pitch / Tempo Speed -->
                      <div class="flex items-center justify-between gap-2">
                        <span class="font-bold text-white uppercase tracking-wider font-mono">⏱️ Tempo (Speed):</span>
                        <div class="flex items-center gap-1">
                          <button onclick="setPlaybackSpeed(0.85)" class="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded text-[9px] cursor-pointer">0.85x</button>
                          <button onclick="setPlaybackSpeed(1.0)" class="px-2 py-0.5 bg-purple-500/20 text-purple-300 font-bold rounded text-[9px] cursor-pointer">1.0x</button>
                          <button onclick="setPlaybackSpeed(1.15)" class="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded text-[9px] cursor-pointer">1.15x</button>
                          <button onclick="setPlaybackSpeed(1.25)" class="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded text-[9px] cursor-pointer">1.25x</button>
                        </div>
                      </div>
                    </div>

                    <!-- Track Playlist Container -->
                    <div id="track-list-container" class="mt-0.5 text-left flex flex-col gap-1.5 max-h-[190px] overflow-y-auto pr-1 border-t border-white/5 pt-2"></div>
                  </div>

                  <!-- Empty State Track Loader -->
                  <div id="player-empty-loader-box" class="flex items-center justify-between gap-2 pt-1">
                    <button onclick="document.getElementById('sound-file-input').click()" class="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-purple-300 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5">
                      <i data-lucide="folder-symlink" class="w-3.5 h-3.5"></i>
                      <span data-i18n="load_tracks">Dateien hinzufügen</span>
                    </button>
                    <button onclick="clearPlaylist()" title="Playlist leeren" class="px-3 py-2 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-300 border border-white/10 hover:border-red-500/30 rounded-xl text-xs transition cursor-pointer" data-i18n="clear">
                      Leeren
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div class="h-8 w-[1px] bg-white/10 mx-1 align-middle self-center"></div>

          <!-- FACH 2: Alltag & Utility -->
          <div class="flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-xl shadow-sm shrink-0">
            <!-- Einkauf -->
            <div class="relative group cursor-pointer mac-dock-item-wrapper">
              <button onclick="togglePanel('shopping')" class="mac-dock-btn balloon-shopping h-12 w-12 md:h-14 md:w-14 rounded-2xl text-emerald-200 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="Interaktive Einkaufsliste und Spartipps öffnen">
                <i data-lucide="shopping-basket" class="w-5 h-5 text-emerald-400"></i>
                <span class="dock-label" data-i18n="dock_shop">Kauf</span>
                <span id="shop-badge-count" class="hidden px-1 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[8px] font-bold absolute top-1 right-1">0</span>
              </button>
              
              <div id="panel-shopping" class="dock-popover-panel hidden absolute left-1/2 -translate-x-1/2 w-[310px] sm:w-[360px] bg-[#111116]/95 border border-emerald-500/40 p-4 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col gap-3">
                <div class="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 class="font-bold text-sm font-display text-white flex items-center gap-1.5">
                    <i data-lucide="shopping-basket" class="w-4 h-4 text-emerald-400"></i>
                    <span data-i18n="shopping">Einkaufsliste</span>
                  </h4>
                  <button onclick="openSupermarketModal()" class="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-[10px] font-bold border border-emerald-500/30 transition cursor-pointer flex items-center gap-1">
                    <i data-lucide="scan" class="w-3 h-3"></i>
                    <span data-i18n="supermarket_mode_btn">Supermarkt-Modus</span>
                  </button>
                </div>

                <!-- Schnell-Eingabe Chips -->
                <div class="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none" id="shop-quick-chips"></div>

                <div class="flex gap-1.5 p-1 bg-black/40 border border-white/5 rounded-xl">
                  <input type="text" id="shop-add-name" placeholder="Artikel hinzufügen (z.B. 2x Milch, Brot)..." data-i18n-placeholder="shop_add_placeholder" class="flex-1 p-2 bg-[#12121c] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-emerald-500 font-semibold" onkeydown="if(event.key==='Enter') handleAddShoppingItem();" />
                  <button onclick="handleAddShoppingItem()" class="px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl flex items-center justify-center transition cursor-pointer font-bold text-xs">
                    <i data-lucide="plus" class="w-4 h-4"></i>
                  </button>
                </div>
                
                <div class="max-h-[190px] overflow-y-auto pr-1 flex flex-col gap-2 text-xs text-gray-300" id="shopping-list-rows"></div>

                <div id="shop-tip-box" class="p-2.5 bg-emerald-500/5 border border-emerald-500/20 text-[10px] text-emerald-200 rounded-xl flex items-start gap-1.5 leading-normal">
                  <i data-lucide="sparkles" class="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse"></i>
                  <span id="shop-tip-text">Spartipps werden geladen...</span>
                </div>

                <div class="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-white/5">
                  <button onclick="toggleShoppingHistory()" class="hover:text-gray-300 flex items-center gap-1 transition cursor-pointer"><i data-lucide="history" class="w-3.5 h-3.5"></i> <span data-i18n="shop_history">Protokoll</span></button>
                  <button onclick="clearShoppingList()" class="hover:text-red-400 transition cursor-pointer"><span data-i18n="shop_clear">Leeren</span> 🗑️</button>
                </div>

                <div id="shop-history-box" class="hidden p-2.5 bg-black/60 border border-white/5 rounded-xl text-[10px] flex flex-col gap-1 max-h-[100px] overflow-y-auto">
                  <div class="flex items-center justify-between border-b border-white/5 pb-1 mb-1 font-bold text-gray-500">
                    <span data-i18n="shop_recent_bought">Zuletzt gekauft</span>
                    <button onclick="clearShoppingHistory()" class="hover:text-red-400 text-[8px] uppercase tracking-wider font-mono cursor-pointer" data-i18n="clear">Leeren</button>
                  </div>
                  <div id="shop-history-list" class="flex flex-col gap-1"></div>
                </div>
              </div>
            </div>

            <!-- Kochen -->
            <div class="relative group cursor-pointer mac-dock-item-wrapper">
              <button onclick="togglePanel('cooking')" class="mac-dock-btn balloon-cooking h-12 w-12 md:h-14 md:w-14 border border-orange-500/30 rounded-2xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-200 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="Kochen: Zutaten verwalten und Rezeptvorschläge nach dem vorhandenen Vorrat erhalten">
                <i data-lucide="cooking-pot" class="w-5 h-5 text-orange-400"></i>
                <span class="dock-label" data-i18n="dock_cook">Kochen</span>
              </button>

              <div id="panel-cooking" class="dock-popover-panel hidden absolute left-1/2 -translate-x-1/2 w-[300px] bg-[#111116]/95 border border-orange-500/40 p-4 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col gap-3">
                <div class="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 class="font-bold text-sm font-display text-white flex items-center gap-1.5">
                    <i data-lucide="cooking-pot" class="w-4 h-4 text-orange-400"></i>
                    <span data-i18n="cooking">Kochen</span>
                  </h4>
                </div>
              </div>
            </div>

            <!-- Skripte -->
            <div class="mac-dock-item-wrapper">
              <button id="scripting-trigger-btn" onclick="openScriptingModal()" class="mac-dock-btn balloon-scripting h-12 w-12 md:h-14 md:w-14 rounded-2xl text-indigo-200 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="Social-Skripter: Telefonskripte & soziale Vorlagen">
                <i data-lucide="scroll" class="w-5 h-5 text-indigo-400"></i>
                <span class="dock-label" data-i18n="dock_scripts">Skripte</span>
              </button>
            </div>

            <!-- Wecker & Reminder -->
            <div class="relative group cursor-pointer mac-dock-item-wrapper">
              <button onclick="togglePanel('alarm')" class="mac-dock-btn balloon-alarm h-12 w-12 md:h-14 md:w-14 border border-cyan-500/30 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="Wecker & Reminder: Verwalte Alarme und zeitbasierte Erinnerungen mit Alarm-Ton">
                <i data-lucide="alarm-clock" class="w-5 h-5 text-cyan-400"></i>
                <span class="dock-label" data-i18n="dock_alarm">Wecker</span>
                <span id="alarm-active-badge" class="hidden w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute top-1 right-1"></span>
              </button>

              <div id="panel-alarm" class="dock-popover-panel hidden absolute left-1/2 -translate-x-1/2 w-[340px] bg-[#111116]/95 border border-cyan-500/40 p-4 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col gap-3 text-left">
                <div class="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 class="font-bold text-sm font-display text-white flex items-center gap-1.5">
                    <i data-lucide="alarm-clock" class="w-4 h-4 text-cyan-400"></i>
                    <span data-i18n="alarm">Wecker & Reminder</span>
                  </h4>
                  <button onclick="togglePanel('alarm')" class="text-gray-400 hover:text-white text-xs font-bold p-1 cursor-pointer">✕</button>
                </div>
              </div>
            </div>

            <!-- Wetter -->
            <div class="relative group cursor-pointer mac-dock-item-wrapper">
              <button onclick="togglePanel('weather'); fetchLocalWeather();" class="mac-dock-btn balloon-weather h-12 w-12 md:h-14 md:w-14 border border-sky-500/30 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-200 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="Lokales Wetter & Vorhersage anzeigen">
                <i data-lucide="cloud-sun" class="w-5 h-5 text-sky-400"></i>
                <span class="dock-label" data-i18n="dock_weather">Wetter</span>
              </button>

              <div id="panel-weather" class="dock-popover-panel hidden absolute left-1/2 -translate-x-1/2 w-[330px] sm:w-[370px] bg-[#111116]/98 border border-sky-500/40 p-3.5 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col gap-2.5 text-left">
                <div class="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-300">
                      <i data-lucide="cloud-sun" class="w-4 h-4 text-sky-400"></i>
                    </div>
                    <h4 class="font-bold text-xs font-display text-white" data-i18n="weather_title">Lokales Wetter</h4>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <button onclick="toggleWeatherUnit()" class="px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 text-sky-300 rounded-lg text-[9px] font-mono font-bold transition cursor-pointer" title="Einheit wechseln">°C / °F</button>
                    <button onclick="useDeviceLocationWeather()" class="p-1.5 bg-white/5 hover:bg-white/10 text-sky-400 rounded-lg transition cursor-pointer" title="Mein Standort (GPS)">
                      <i data-lucide="crosshair" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="togglePanel('weather')" class="text-gray-400 hover:text-white text-xs font-bold p-1 cursor-pointer">✕</button>
                  </div>
                </div>

                <!-- Ort eingeben oder aus Dropdown wählen (Combobox) -->
                <div class="relative">
                  <div class="flex items-center gap-1.5 p-1 bg-black/50 border border-sky-500/30 rounded-xl focus-within:border-sky-400 transition">
                    <i data-lucide="map-pin" class="w-3.5 h-3.5 text-sky-400 shrink-0 ml-1"></i>
                    <input type="text" id="weather-city-input" list="weather-city-presets" placeholder="Stadt eintippen oder auswählen..." 
                      class="flex-1 bg-transparent text-xs text-white placeholder-gray-500 font-semibold outline-none" 
                      oninput="searchWeatherCity(this.value)" 
                      onchange="searchWeatherCityInstant(this.value)" 
                      onkeydown="if(event.key==='Enter') searchWeatherCityInstant(this.value)" />
                    <datalist id="weather-city-presets">
                      <option value="Berlin">
                      <option value="München">
                      <option value="Hamburg">
                      <option value="Köln">
                      <option value="Frankfurt am Main">
                      <option value="Stuttgart">
                      <option value="Düsseldorf">
                      <option value="Dortmund">
                      <option value="Essen">
                      <option value="Leipzig">
                      <option value="Bremen">
                      <option value="Dresden">
                      <option value="Hannover">
                      <option value="Nürnberg">
                      <option value="Wien">
                      <option value="Salzburg">
                      <option value="Innsbruck">
                      <option value="Graz">
                      <option value="Zürich">
                      <option value="Basel">
                      <option value="Bern">
                      <option value="London">
                      <option value="Paris">
                      <option value="Rom">
                      <option value="Madrid">
                      <option value="Athen">
                      <option value="New York">
                    </datalist>
                    <button onclick="searchWeatherCityInstant(document.getElementById('weather-city-input').value)" class="p-1 px-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-lg text-[10px] font-bold transition cursor-pointer">
                      <i data-lucide="search" class="w-3 h-3"></i>
                    </button>
                  </div>
                  <div id="weather-search-results" class="hidden absolute top-full left-0 right-0 z-30 mt-1 bg-[#181824] border border-sky-500/40 rounded-xl p-1 shadow-2xl space-y-0.5 max-h-[140px] overflow-y-auto backdrop-blur-md"></div>
                </div>

                <!-- Live Wetterinhalt -->
                <div id="weather-content-area" class="space-y-2.5"></div>
              </div>
            </div>

            <!-- Nachrichten -->
            <div class="relative group cursor-pointer mac-dock-item-wrapper">
              <button onclick="togglePanel('news'); renderNewsBriefing();" class="mac-dock-btn balloon-news h-12 w-12 md:h-14 md:w-14 border border-amber-500/30 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="Tägliches Nachrichten-Briefing">
                <i data-lucide="newspaper" class="w-5 h-5 text-amber-400"></i>
                <span class="dock-label" data-i18n="dock_news">News</span>
              </button>

              <div id="panel-news" class="dock-popover-panel hidden absolute left-1/2 -translate-x-1/2 w-[340px] sm:w-[410px] bg-[#111116]/98 border border-amber-500/40 p-3.5 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col gap-2 text-left">
                <!-- Header mit Titel & Close -->
                <div class="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                      <i data-lucide="newspaper" class="w-4 h-4 text-amber-400"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-xs font-display text-white" data-i18n="news_title">Daily Digest</h4>
                      <div class="text-[8px] text-gray-400 font-mono">Regionale & kuratierte News</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <button onclick="refreshNewsFeed()" class="p-1.5 bg-white/5 hover:bg-amber-500/20 text-amber-300 rounded-lg transition cursor-pointer" title="Aktualisieren">
                      <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="togglePanel('news')" class="text-gray-400 hover:text-white text-xs font-bold p-1 cursor-pointer">✕</button>
                  </div>
                </div>

                <!-- Ort / Region eintippen oder aus Dropdown wählen (Combobox) -->
                <div class="relative">
                  <div class="flex items-center gap-1.5 p-1 bg-black/50 border border-amber-500/30 rounded-xl focus-within:border-amber-400 transition">
                    <i data-lucide="map-pin" class="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1"></i>
                    <input type="text" id="news-location-input" list="news-location-presets" placeholder="Ort eintippen (z.B. Berlin, München, Wien)..." 
                      class="flex-1 bg-transparent text-xs text-white placeholder-gray-500 font-semibold outline-none" 
                      oninput="handleNewsLocationInput(this.value)" 
                      onchange="handleNewsLocationSelect(this.value)" />
                    <datalist id="news-location-presets">
                      <option value="Deutschlandweit (D-A-CH)">
                      <option value="Berlin & Brandenburg">
                      <option value="München & Bayern">
                      <option value="Hamburg & Norddeutschland">
                      <option value="Köln, Düsseldorf & NRW">
                      <option value="Frankfurt & Hessen">
                      <option value="Stuttgart & Baden-Württemberg">
                      <option value="Leipzig & Dresden">
                      <option value="Wien & Österreich">
                      <option value="Zürich & Schweiz">
                      <option value="London & UK">
                      <option value="New York & US">
                      <option value="Paris & France">
                      <option value="Rom & Milano">
                      <option value="Madrid & Barcelona">
                      <option value="Athen & Thessaloniki">
                      <option value="International & Global">
                    </datalist>
                  </div>
                </div>

                <!-- Suchfeld für Stichworte -->
                <div class="flex items-center gap-1.5 px-2 py-1 bg-[#161622] border border-white/10 rounded-xl">
                  <i data-lucide="search" class="w-3 h-3 text-gray-400 shrink-0"></i>
                  <input type="text" id="news-search-input" placeholder="Thema / Stichwort filtern..." oninput="searchNewsKeywords(this.value)" class="flex-1 bg-transparent text-xs text-white placeholder-gray-500 outline-none" />
                </div>

                <!-- Themen- & Kategorien-Filterleiste -->
                <div class="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                  <button onclick="setNewsCategory('all')" data-category="all" class="news-category-pill px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-500/25 text-amber-300 border border-amber-500/40 cursor-pointer transition shrink-0">🌟 Alle</button>
                  <button onclick="setNewsCategory('local')" data-category="local" class="news-category-pill px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-white/5 text-gray-400 hover:text-white border border-white/5 cursor-pointer transition shrink-0">📍 Lokales</button>
                  <button onclick="setNewsCategory('positive')" data-category="positive" class="news-category-pill px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-white/5 text-gray-400 hover:text-white border border-white/5 cursor-pointer transition shrink-0">🌿 Positives</button>
                  <button onclick="setNewsCategory('economy')" data-category="economy" class="news-category-pill px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-white/5 text-gray-400 hover:text-white border border-white/5 cursor-pointer transition shrink-0">💼 Wirtschaft</button>
                  <button onclick="setNewsCategory('tech')" data-category="tech" class="news-category-pill px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-white/5 text-gray-400 hover:text-white border border-white/5 cursor-pointer transition shrink-0">💡 Tech</button>
                  <button onclick="setNewsCategory('life')" data-category="life" class="news-category-pill px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-white/5 text-gray-400 hover:text-white border border-white/5 cursor-pointer transition shrink-0">⚡ Alltag</button>
                  <button onclick="setNewsCategory('science')" data-category="science" class="news-category-pill px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-white/5 text-gray-400 hover:text-white border border-white/5 cursor-pointer transition shrink-0">🔬 Wissen</button>
                  <button onclick="setNewsCategory('bookmarked')" data-category="bookmarked" class="news-category-pill px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-white/5 text-gray-400 hover:text-white border border-white/5 cursor-pointer transition shrink-0 flex items-center gap-1">🔖 Gemerkt</button>
                </div>

                <!-- Nachrichtenliste -->
                <div id="news-content-area" class="flex flex-col gap-1.5 max-h-[250px] overflow-y-auto pr-1"></div>
              </div>
            </div>

          </div>

          <div class="h-8 w-[1px] bg-white/10 mx-1 align-middle self-center"></div>

          <!-- FACH 3: Fokus & Entscheidung -->
          <div class="flex items-center gap-1.5 px-1 bg-transparent relative">
            <!-- Funke -->
            <div class="relative group mac-dock-item-wrapper">
              <button onclick="togglePanel('boost'); suggestBoostActivity();" class="mac-dock-btn balloon-boost h-12 w-12 md:h-14 md:w-14 rounded-2xl text-amber-300 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="30-Sekunden-Aktivität zur Überwindung von Blockaden erhalten">
                <i data-lucide="zap" class="w-5 h-5 text-amber-400"></i>
                <span class="dock-label" data-i18n="dock_spark">Funke</span>
              </button>
              
              <div id="panel-boost" class="dock-popover-panel hidden absolute bottom-[calc(100%+10px)] right-0 w-[280px] bg-[#111116]/95 border border-amber-500/40 p-4 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col gap-3">
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
            <div class="relative group cursor-pointer mac-dock-item-wrapper">
              <button onclick="togglePanel('inspiration')" class="mac-dock-btn balloon-inspire h-12 w-12 md:h-14 md:w-14 rounded-2xl text-violet-300 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="Inspirierenden Impuls für den Geist anzeigen">
                <i data-lucide="sparkles" class="w-5 h-5 text-violet-400"></i>
                <span class="dock-label" data-i18n="dock_inspire">Inspire</span>
              </button>
              
              <div id="panel-inspiration" class="dock-popover-panel hidden absolute bottom-[calc(100%+10px)] right-0 w-[320px] sm:w-[360px] bg-[#111116]/95 border border-violet-500/40 p-4 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col gap-3">
                <div class="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <span class="text-[11px] uppercase font-bold tracking-wider text-violet-400 flex items-center gap-1.5 font-mono">
                    <i data-lucide="sparkles" class="w-3.5 h-3.5 text-violet-400"></i> <span data-i18n="inspire">Inspiration</span>
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
                <span class="dock-label" data-i18n="dock_compass">Kompass</span>
              </button>
            </div>

            <!-- Klarheit & Impuls-Bremse -->
            <div class="mac-dock-item-wrapper">
              <button id="clarity-trigger-btn" onclick="openClarityModal()" class="mac-dock-btn balloon-clarity h-12 w-12 md:h-14 md:w-14 rounded-2xl text-teal-200 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="Klarheit: Impulskontrolle, Muster durchbrechen & gesunde Gewohnheiten stärken">
                <i data-lucide="anchor" class="w-5 h-5 text-teal-400"></i>
                <span class="dock-label" data-i18n="dock_clarity">Klarheit</span>
              </button>
            </div>

            <!-- Sport -->
            <div class="mac-dock-item-wrapper">
              <button id="sport-trigger-btn" onclick="openSportModal()" class="mac-dock-btn balloon-sport h-12 w-12 md:h-14 md:w-14 rounded-2xl text-orange-200 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition shadow-sm" title="Sport & Aktivierung: Wohltuende Mikrobewegung für jeden Energiezustand">
                <i data-lucide="dumbbell" class="w-5 h-5 text-orange-400 animate-pulse"></i>
                <span class="dock-label" data-i18n="dock_sport">Sport</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>

  <!-- CELEBRATION OVERLAY -->
`);

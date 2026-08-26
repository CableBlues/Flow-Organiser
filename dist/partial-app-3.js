// Ausgelagert aus index.html: Wird per document.write an der Original-Position eingefuegt
document.write(`    <!-- CENTRAL DOCK (macOS 3D Floating-Stil) -->
    <div class="mac-floating-wrapper hidden md:block z-[200] zen-hide">
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
                </div>

                <!-- 2. JAZZ PIANO, FENDER RHODES & HYPNOTISCHE LOOPS -->
                <div class="mb-2.5 pt-2 border-t border-white/10">
                  <div class="text-[10px] font-bold text-amber-300 mb-1.5 flex items-center gap-1.5">
                    <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-400"></i>
                    <span data-i18n="sound_harmonics_title">Piano-Harmonien & Hypnotische Riffs</span>
                  </div>
                  <div class="grid grid-cols-3 gap-1.5">
                    <button onclick="playAmbientSound('jazz_piano')" id="sound-btn-jazz_piano" class="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                      <span class="text-xs shrink-0">🎹</span>
                      <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_jazz_piano">Jazz Voicings</span>
                    </button>
                    <button onclick="playAmbientSound('rhodes')" id="sound-btn-rhodes" class="p-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                      <span class="text-xs shrink-0">🪕</span>
                      <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_rhodes">Fender Rhodes</span>
                    </button>
                    <button onclick="playAmbientSound('hypnotic_riff')" id="sound-btn-hypnotic_riff" class="p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                      <span class="text-xs shrink-0">🔮</span>
                      <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_hypnotic_riff">Hypnotic Riff</span>
                    </button>
                  </div>
                </div>

                <!-- 3. RHYTHMEN & ECHTE GENRE-BEATS -->
                <div class="mb-2.5 pt-2 border-t border-white/10">
                  <div class="text-[10px] font-bold text-purple-300 mb-1.5 flex items-center justify-between">
                    <span class="flex items-center gap-1.5">
                      <i data-lucide="music-2" class="w-3.5 h-3.5 text-purple-400"></i>
                      <span data-i18n="sound_beats_title">Genre-Beats & Rhythmus</span>
                    </span>
                    <span id="beat-bpm-val" class="font-mono text-emerald-400 text-[10px] font-bold bg-emerald-500/15 px-2 py-0.5 rounded-lg border border-emerald-500/30">120 BPM</span>
                  </div>
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-2">
                    <button onclick="playAmbientSound('techno')" id="sound-btn-techno" class="p-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                      <span class="text-xs shrink-0">⚡</span>
                      <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_techno">Techno 128</span>
                    </button>
                    <button onclick="playAmbientSound('dnb')" id="sound-btn-dnb" class="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                      <span class="text-xs shrink-0">🥁</span>
                      <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_dnb">Drum & Bass</span>
                    </button>
                    <button onclick="playAmbientSound('afrobeats')" id="sound-btn-afrobeats" class="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                      <span class="text-xs shrink-0">🌴</span>
                      <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_afrobeats">Afrobeats</span>
                    </button>
                    <button onclick="playAmbientSound('swing')" id="sound-btn-swing" class="p-1.5 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                      <span class="text-xs shrink-0">🎷</span>
                      <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_swing">Swing & Jazz</span>
                    </button>
                    <button onclick="playAmbientSound('boombap')" id="sound-btn-boombap" class="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                      <span class="text-xs shrink-0">🎤</span>
                      <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_boombap">Boom-Bap</span>
                    </button>
                    <button onclick="playAmbientSound('bossa_nova')" id="sound-btn-bossa_nova" class="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5">
                      <span class="text-xs shrink-0">🎸</span>
                      <span class="text-white font-bold text-[9px] truncate" data-i18n="sound_bossa_nova">Bossa Nova</span>
                    </button>
                  </div>

                  <!-- LIVE TEMPO BPM SLIDER & STEPPER -->
                  <div class="flex items-center gap-2 p-1.5 rounded-xl bg-black/40 border border-white/10 text-xs">
                    <button onclick="changeBeatBpm(-5)" class="px-2 py-0.5 bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg text-gray-300 hover:text-white font-bold text-[10px] cursor-pointer transition">-5</button>
                    <span class="text-[9px] font-mono text-gray-400 font-bold shrink-0">BPM</span>
                    <input type="range" id="beat-bpm-slider" min="60" max="200" step="1" value="120" oninput="this.dataset.userTouched='true'; setBeatBpm(this.value);" class="w-full accent-emerald-400 cursor-pointer h-1 bg-black/50 rounded-xl">
                    <button onclick="changeBeatBpm(5)" class="px-2 py-0.5 bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg text-gray-300 hover:text-white font-bold text-[10px] cursor-pointer transition">+5</button>
                  </div>
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
              
              <div id="panel-music" class="dock-popover-panel hidden absolute left-0 w-[390px] sm:w-[450px] bg-[#101017]/98 border border-purple-500/40 p-4 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col gap-3">
                
                <!-- TOP MODE SWITCHER: STANDARD PLAYER VS. 2-DECK DJ STUDIO -->
                <div class="flex items-center bg-black/70 p-1 rounded-2xl border border-white/10 text-xs font-bold gap-1 shadow-inner">
                  <button id="music-view-toggle-std" onclick="switchMusicView('standard')" class="flex-1 py-1.5 rounded-xl text-white bg-purple-600/40 border border-purple-500/50 transition flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold shadow-md">
                    <i data-lucide="headphones" class="w-3.5 h-3.5 text-purple-300"></i>
                    <span>Standard Player</span>
                  </button>
                  <button id="music-view-toggle-dj" onclick="switchMusicView('dj')" class="flex-1 py-1.5 rounded-xl text-gray-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer text-xs font-semibold">
                    <i data-lucide="disc-3" class="w-3.5 h-3.5 text-cyan-400"></i>
                    <span>DJ Studio (2-Decks)</span>
                  </button>
                </div>

                <!-- ================= VIEW 1: STANDARD PLAYER ================= -->
                <div id="music-view-standard" class="flex flex-col gap-3">
                  
                  <!-- Source Tabs: DJ Deck, Spotify, YouTube -->
                  <div class="flex bg-black/60 p-1 rounded-2xl border border-white/10 text-xs font-bold gap-1">
                    <button id="music-tab-btn-dj" onclick="switchMusicSourceTab('dj')" class="flex-1 py-1.5 rounded-xl text-white bg-purple-600/30 border border-purple-500/40 transition flex items-center justify-center gap-1.5 cursor-pointer text-[11px] font-bold shadow-sm">
                      <i data-lucide="music" class="w-3.5 h-3.5 text-purple-400"></i>
                      <span>Eigene Tracks</span>
                    </button>
                    <button id="music-tab-btn-spotify" onclick="switchMusicSourceTab('spotify')" class="flex-1 py-1.5 rounded-xl text-gray-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer text-[11px] font-medium">
                      <span class="text-emerald-400 font-bold text-xs">●</span>
                      <span>Spotify</span>
                    </button>
                    <button id="music-tab-btn-youtube" onclick="switchMusicSourceTab('youtube')" class="flex-1 py-1.5 rounded-xl text-gray-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer text-[11px] font-medium">
                      <i data-lucide="youtube" class="w-3.5 h-3.5 text-rose-400"></i>
                      <span>YouTube</span>
                    </button>
                  </div>

                  <!-- ================= TAB 1: LOCAL TRACKS PLAYLIST ================= -->
                  <div id="music-pane-dj" class="space-y-3">
                    <div class="flex items-center justify-between border-b border-white/10 pb-2">
                      <div class="flex items-center gap-2">
                        <div class="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                          <i data-lucide="list-music" class="w-3.5 h-3.5 text-purple-400"></i>
                        </div>
                        <div>
                          <h4 class="font-bold text-xs font-display text-white flex items-center gap-1.5">
                            <span>Lokale Playlist & Crossfade</span>
                            <span id="player-track-count" class="text-[9px] text-gray-400 font-mono font-normal"></span>
                          </h4>
                        </div>
                      </div>

                      <div class="flex items-center gap-1">
                        <button onclick="document.getElementById('sound-file-input').click()" class="p-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 rounded-xl text-[10px] font-bold transition cursor-pointer flex items-center gap-1" title="Tracks hinzufügen">
                          <i data-lucide="plus" class="w-3 h-3"></i>
                          <span>Audio laden</span>
                        </button>
                      </div>
                    </div>

                    <input type="file" id="sound-file-input" accept="audio/*" onchange="handleUserSoundFile(event)" class="hidden" multiple />

                    <!-- STANDARD TURNTABLE & MAIN PLAYER DISPLAY -->
                    <div id="custom-playlist-player" class="p-3 bg-black/60 border border-white/10 rounded-2xl flex flex-col gap-2.5">
                      
                      <!-- Turntable Disk, Track Info & Vertical Volume Fader -->
                      <div class="flex items-center gap-2.5 bg-gradient-to-r from-purple-950/30 to-black/40 p-2 rounded-xl border border-white/5 relative">
                        <!-- Spinning Vinyl Disc -->
                        <div class="relative w-10 h-10 shrink-0 flex items-center justify-center">
                          <div id="dj-turntable-vinyl" class="w-10 h-10 rounded-full border-2 border-purple-500/40 bg-[#12121c] flex items-center justify-center shadow-md">
                            <div class="w-3 h-3 rounded-full bg-purple-500/30 border border-purple-400/50 flex items-center justify-center">
                              <div class="w-1 h-1 rounded-full bg-white"></div>
                            </div>
                          </div>
                        </div>

                        <!-- Track Title & Live LED Spectrum -->
                        <div class="min-w-0 flex-1 flex flex-col gap-1">
                          <div id="user-sound-name" class="text-xs text-white font-bold truncate">Keine Titel geladen</div>
                          
                          <!-- Animated VU Bars -->
                          <div class="flex items-center gap-0.5 h-2">
                            <div class="dj-vu-bar w-1 h-1 bg-emerald-400 rounded-full"></div>
                            <div class="dj-vu-bar w-1 h-2 bg-emerald-400 rounded-full"></div>
                            <div class="dj-vu-bar w-1 h-1 bg-teal-400 rounded-full"></div>
                            <div class="dj-vu-bar w-1 h-2 bg-yellow-400 rounded-full"></div>
                            <div class="dj-vu-bar w-1 h-1 bg-amber-400 rounded-full"></div>
                            <div class="dj-vu-bar w-1 h-2 bg-purple-400 rounded-full"></div>
                          </div>
                        </div>

                        <!-- KOMPAKTER LAUTSTÄRKEN-FADER -->
                        <div class="flex flex-col items-center gap-0.5 pl-2 border-l border-white/10 shrink-0">
                          <button onclick="togglePlayerMute()" id="player-mute-toggle-btn" title="Stumm schalten" class="p-0.5 text-gray-400 hover:text-purple-300 transition cursor-pointer">
                            <i data-lucide="volume-2" class="w-3 h-3"></i>
                          </button>
                          <div class="h-8 w-4 flex items-center justify-center relative">
                            <input type="range" min="0" max="1" step="0.05" value="0.5" oninput="setSoundVolume(this.value)" 
                              class="master-volume-slider vertical-slider accent-purple-400 cursor-pointer w-8 h-1 bg-black/60 rounded-full" 
                              title="Lautstärke">
                          </div>
                          <span class="text-[7px] text-gray-500 font-mono font-bold">VOL</span>
                        </div>
                      </div>

                      <!-- Progress Bar & Clocks -->
                      <div class="flex flex-col gap-1">
                        <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative cursor-pointer group" onclick="handleProgressBarClick(event)">
                          <div id="player-progress-bar" class="h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-150" style="width: 0%"></div>
                        </div>
                        <div class="flex justify-between items-center text-[9px] text-gray-400 font-mono">
                          <span id="player-time-current">00:00</span>
                          <span id="player-time-remaining" class="text-purple-300">-00:00</span>
                        </div>
                      </div>

                      <!-- TRANSPORT CONTROLS -->
                      <div class="flex items-center justify-between gap-1 pt-0.5">
                        <button onclick="cueTrackStart()" title="Cue (Track-Start)" class="p-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl cursor-pointer transition text-[9px] font-bold font-mono">
                          CUE
                        </button>
                        <button onclick="playPreviousTrack()" title="Vorheriger Track" class="p-1.5 bg-white/5 hover:bg-white/10 text-purple-300 rounded-xl cursor-pointer transition">
                          <i data-lucide="skip-back" class="w-3.5 h-3.5"></i>
                        </button>
                        <button id="player-play-pause-btn" onclick="togglePlaylistPlayback()" title="Play / Pause" class="p-2.5 bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl cursor-pointer transition shadow-md flex items-center justify-center">
                          <i data-lucide="play" class="w-4 h-4 text-purple-200 ml-0.5"></i>
                        </button>
                        <button onclick="playNextTrackWithCrossfade()" title="Nächster Track (mit Crossfade)" class="p-1.5 bg-white/5 hover:bg-white/10 text-purple-300 rounded-xl cursor-pointer transition">
                          <i data-lucide="skip-forward" class="w-3.5 h-3.5"></i>
                        </button>
                        <button onclick="togglePlayerShuffle()" id="player-shuffle-toggle-btn" title="Zufallswiedergabe" class="p-1.5 bg-purple-500/20 text-purple-300 rounded-xl cursor-pointer transition border border-purple-500/30">
                          <i data-lucide="shuffle" class="w-3.5 h-3.5"></i>
                        </button>
                        <button onclick="cyclePlayerRepeatMode()" id="player-repeat-toggle-btn" title="Wiederholung" class="p-1.5 bg-purple-500/20 text-purple-300 rounded-xl cursor-pointer transition border border-purple-500/30">
                          <i id="player-repeat-icon" data-lucide="repeat" class="w-3.5 h-3.5"></i>
                        </button>
                      </div>

                      <!-- Track Playlist Container -->
                      <div id="track-list-container" class="mt-0.5 text-left flex flex-col gap-1.5 max-h-[170px] overflow-y-auto pr-1 border-t border-white/5 pt-2"></div>
                    </div>
                  </div>

                  <!-- ================= TAB 2: SPOTIFY PLAYER ================= -->
                  <div id="music-pane-spotify" class="hidden space-y-3">
                    <div class="space-y-1.5">
                      <span class="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Empfohlene Fokus-Playlists:</span>
                      <div class="grid grid-cols-2 gap-1.5">
                        <button onclick="loadSpotifyEmbed('37i9dQZF1DXdLEN7aqioXM')" class="p-2 rounded-xl bg-white/[0.03] hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/40 text-left transition flex items-center gap-2 cursor-pointer">
                          <span class="text-base">🧠</span>
                          <div>
                            <div class="text-[11px] font-bold text-white leading-tight">Deep Focus</div>
                            <div class="text-[9px] text-gray-400">Konzentration & Flow</div>
                          </div>
                        </button>
                        <button onclick="loadSpotifyEmbed('37i9dQZF1DX8Uebhn9wzrS')" class="p-2 rounded-xl bg-white/[0.03] hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/40 text-left transition flex items-center gap-2 cursor-pointer">
                          <span class="text-base">🎹</span>
                          <div>
                            <div class="text-[11px] font-bold text-white leading-tight">Peaceful Piano</div>
                            <div class="text-[9px] text-gray-400">Sanfte Tastenklänge</div>
                          </div>
                        </button>
                        <button onclick="loadSpotifyEmbed('37i9dQZF1DWWQRwui0ExPn')" class="p-2 rounded-xl bg-white/[0.03] hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/40 text-left transition flex items-center gap-2 cursor-pointer">
                          <span class="text-base">☕</span>
                          <div>
                            <div class="text-[11px] font-bold text-white leading-tight">Lofi Beats</div>
                            <div class="text-[9px] text-gray-400">Ruhiger Hip-Hop Beat</div>
                          </div>
                        </button>
                        <button onclick="loadSpotifyEmbed('37i9dQZF1DX4WYpdgoIcn6')" class="p-2 rounded-xl bg-white/[0.03] hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/40 text-left transition flex items-center gap-2 cursor-pointer">
                          <span class="text-base">🌿</span>
                          <div>
                            <div class="text-[11px] font-bold text-white leading-tight">Chill Tracks</div>
                            <div class="text-[9px] text-gray-400">Ambient & Ausklang</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div class="p-2.5 bg-black/50 border border-white/10 rounded-2xl space-y-1.5">
                      <label class="text-[10px] text-gray-300 font-bold uppercase tracking-wider block">Eigene Spotify-Playlist / Track-Link:</label>
                      <div class="flex items-center gap-1.5">
                        <input type="text" id="spotify-custom-url" placeholder="https://open.spotify.com/playlist/..." class="flex-1 p-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white outline-none focus:border-emerald-400 font-mono text-[11px]" onkeydown="if(event.key==='Enter') loadSpotifyEmbed(this.value);" />
                        <button onclick="loadSpotifyEmbed(document.getElementById('spotify-custom-url').value)" class="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition cursor-pointer shrink-0">
                          Laden ➔
                        </button>
                      </div>
                    </div>

                    <div id="spotify-embed-container" class="rounded-2xl overflow-hidden shadow-xl">
                      <iframe style="border-radius:16px" src="https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                    </div>
                  </div>

                  <!-- ================= TAB 3: YOUTUBE STREAMS ================= -->
                  <div id="music-pane-youtube" class="hidden space-y-3">
                    <div class="space-y-1.5">
                      <span class="text-[10px] text-rose-400 font-bold uppercase tracking-wider block">24/7 Live Fokus & Lo-Fi Streams:</span>
                      <div class="grid grid-cols-2 gap-1.5">
                        <button onclick="loadYouTubeEmbed('jfKfPfyJRdk')" class="p-2 rounded-xl bg-white/[0.03] hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/40 text-left transition flex items-center gap-2 cursor-pointer">
                          <span class="text-base">🎧</span>
                          <div>
                            <div class="text-[11px] font-bold text-white leading-tight">Lofi Girl (24/7)</div>
                            <div class="text-[9px] text-gray-400">Study & Chill Beats</div>
                          </div>
                        </button>
                        <button onclick="loadYouTubeEmbed('5qap5aO4i9A')" class="p-2 rounded-xl bg-white/[0.03] hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/40 text-left transition flex items-center gap-2 cursor-pointer">
                          <span class="text-base">☕</span>
                          <div>
                            <div class="text-[11px] font-bold text-white leading-tight">Coffee Shop Radio</div>
                            <div class="text-[9px] text-gray-400">Relaxing Jazz / Lo-Fi</div>
                          </div>
                        </button>
                        <button onclick="loadYouTubeEmbed('4xDzrJKXOOY')" class="p-2 rounded-xl bg-white/[0.03] hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/40 text-left transition flex items-center gap-2 cursor-pointer">
                          <span class="text-base">🌌</span>
                          <div>
                            <div class="text-[11px] font-bold text-white leading-tight">Synthwave Chill</div>
                            <div class="text-[9px] text-gray-400">Retro Electro Flow</div>
                          </div>
                        </button>
                        <button onclick="loadYouTubeEmbed('-5KAN9_CzSA')" class="p-2 rounded-xl bg-white/[0.03] hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/40 text-left transition flex items-center gap-2 cursor-pointer">
                          <span class="text-base">🌧️</span>
                          <div>
                            <div class="text-[11px] font-bold text-white leading-tight">Piano & Regen</div>
                            <div class="text-[9px] text-gray-400">Sanfte Beruhigung</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div class="p-2.5 bg-black/50 border border-white/10 rounded-2xl space-y-1.5">
                      <label class="text-[10px] text-gray-300 font-bold uppercase tracking-wider block">Eigener YouTube Video- / Playlist-Link:</label>
                      <div class="flex items-center gap-1.5">
                        <input type="text" id="youtube-custom-url" placeholder="https://www.youtube.com/watch?v=..." class="flex-1 p-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white outline-none focus:border-rose-400 font-mono text-[11px]" onkeydown="if(event.key==='Enter') loadYouTubeEmbed(this.value);" />
                        <button onclick="loadYouTubeEmbed(document.getElementById('youtube-custom-url').value)" class="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0">
                          Abspielen ➔
                        </button>
                      </div>
                    </div>

                    <div id="youtube-embed-container" class="rounded-2xl overflow-hidden shadow-xl">
                      <div class="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-lg">
                        <iframe class="w-full h-full" src="https://www.youtube-nocookie.com/embed/jfKfPfyJRdk" title="YouTube video player" frameborder="0" allow="encrypted-media; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>
                      </div>
                    </div>
                  </div>

                </div>

                <!-- ================= VIEW 2: 2-DECK PROFESSIONAL DJ STUDIO ================= -->
                <div id="music-view-dj" class="hidden flex flex-col gap-3">
                  
                  <!-- DUAL DECK WORKSTATION (DECK A | MIXER | DECK B) -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-2.5 items-start">
                    
                    <!-- ========== DECK A (LEFT, CYAN ACCENTS) ========== -->
                    <div class="md:col-span-3 p-3 rounded-2xl bg-black/70 border border-cyan-500/30 flex flex-col gap-2 shadow-lg relative overflow-hidden">
                      <div class="flex items-center justify-between border-b border-cyan-500/20 pb-1.5">
                        <span class="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[10px] tracking-wider border border-cyan-500/40">DECK A</span>
                        <span id="dj-bpm-val-a" class="font-mono text-cyan-400 text-xs font-bold">128 BPM</span>
                      </div>

                      <!-- Track Selector & Upload -->
                      <div class="flex items-center gap-1.5">
                        <select id="dj-track-select-a" onchange="handleDeckTrackSelect('a', this.value)" class="flex-1 p-1.5 bg-black/80 border border-white/15 rounded-xl text-[11px] text-white outline-none focus:border-cyan-400 truncate font-medium cursor-pointer">
                          <option value="">-- Track auswählen --</option>
                        </select>
                        <button onclick="document.getElementById('dj-file-input-a').click()" class="p-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-[10px] font-bold cursor-pointer transition shrink-0" title="Eigenen Track für Deck A laden">
                          <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                        </button>
                        <input type="file" id="dj-file-input-a" accept="audio/*" onchange="handleDeckFileUpload('a', event)" class="hidden" />
                      </div>

                      <div id="dj-deck-a-title" class="text-xs text-white font-bold truncate h-4">Kein Track geladen</div>

                      <!-- Turntable Disk A -->
                      <div class="flex items-center justify-center py-1">
                        <div id="dj-vinyl-a" class="w-14 h-14 rounded-full border-2 border-cyan-400/50 bg-[#0d1520] flex items-center justify-center shadow-lg relative cursor-pointer" onclick="toggleDeck('a')">
                          <div class="w-5 h-5 rounded-full bg-cyan-500/30 border border-cyan-400/60 flex items-center justify-center">
                            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
                          </div>
                        </div>
                      </div>

                      <!-- Deck A Time & Pitch Controls -->
                      <div class="flex items-center justify-between text-[10px] font-mono text-gray-400">
                        <span id="dj-time-a">00:00</span>
                        <div class="flex items-center gap-1">
                          <span>Pitch:</span>
                          <input type="range" id="dj-pitch-slider-a" min="-16" max="16" step="0.5" value="0" oninput="setDeckPitch('a', this.value)" class="w-16 accent-cyan-400 cursor-pointer h-1 bg-black/60 rounded-full" />
                        </div>
                      </div>

                      <!-- Deck A Volume Fader -->
                      <div class="flex items-center gap-2 pt-1 border-t border-white/5 text-[10px]">
                        <span class="font-bold text-gray-400">VOL</span>
                        <input type="range" min="0" max="1" step="0.05" value="0.8" oninput="setDeckVolume('a', this.value)" class="w-full accent-cyan-400 cursor-pointer h-1.5 bg-black/60 rounded-full" />
                      </div>

                      <!-- Deck A Transport Buttons -->
                      <div class="flex items-center justify-between gap-1 pt-1">
                        <button onclick="cueDeck('a')" class="flex-1 py-1.5 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-cyan-300 rounded-xl font-bold font-mono text-[10px] transition cursor-pointer">CUE</button>
                        <button id="dj-play-btn-a" onclick="toggleDeck('a')" class="flex-1 py-1.5 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/60 text-cyan-100 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center">
                          <i data-lucide="play" class="w-4 h-4 ml-0.5"></i>
                        </button>
                        <button onclick="syncDeck('a')" class="flex-1 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl font-bold font-mono text-[10px] transition cursor-pointer">SYNC</button>
                      </div>
                    </div>

                    <!-- ========== CENTER MIXER & FX PADS (1 COL ON MD) ========== -->
                    <div class="md:col-span-1 p-2 rounded-2xl bg-black/80 border border-white/10 flex flex-col justify-between gap-2 shadow-lg">
                      <!-- Center Label -->
                      <div class="text-center">
                        <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">MIXER</span>
                      </div>

                      <!-- DJ SFX PADS -->
                      <div class="grid grid-cols-2 gap-1">
                        <button onclick="playDjSfx('airhorn')" class="p-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 rounded-xl font-bold text-[9px] transition cursor-pointer flex flex-col items-center gap-0.5" title="Airhorn Blast">
                          <span>📢</span>
                          <span class="text-[8px] font-mono">HORN</span>
                        </button>
                        <button onclick="playDjSfx('scratch')" class="p-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 rounded-xl font-bold text-[9px] transition cursor-pointer flex flex-col items-center gap-0.5" title="Vinyl Scratch">
                          <span>⚡</span>
                          <span class="text-[8px] font-mono">SCRTCH</span>
                        </button>
                        <button onclick="playDjSfx('laser')" class="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 rounded-xl font-bold text-[9px] transition cursor-pointer flex flex-col items-center gap-0.5" title="Club Laser">
                          <span>🚨</span>
                          <span class="text-[8px] font-mono">LASER</span>
                        </button>
                        <button onclick="playDjSfx('subdrop')" class="p-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 rounded-xl font-bold text-[9px] transition cursor-pointer flex flex-col items-center gap-0.5" title="808 Sub Drop">
                          <span>💥</span>
                          <span class="text-[8px] font-mono">808</span>
                        </button>
                      </div>

                      <!-- Quick Cut Buttons -->
                      <div class="flex items-center justify-between gap-0.5 pt-1 border-t border-white/5">
                        <button onclick="quickCrossfade(0.0)" class="p-1 bg-white/5 hover:bg-cyan-500/20 text-cyan-300 text-[8px] font-mono rounded font-bold transition cursor-pointer">◄ A</button>
                        <button onclick="quickCrossfade(0.5)" class="p-1 bg-white/5 hover:bg-white/15 text-gray-300 text-[8px] font-mono rounded font-bold transition cursor-pointer">MID</button>
                        <button onclick="quickCrossfade(1.0)" class="p-1 bg-white/5 hover:bg-purple-500/20 text-purple-300 text-[8px] font-mono rounded font-bold transition cursor-pointer">B ►</button>
                      </div>
                    </div>

                    <!-- ========== DECK B (RIGHT, PURPLE ACCENTS) ========== -->
                    <div class="md:col-span-3 p-3 rounded-2xl bg-black/70 border border-purple-500/30 flex flex-col gap-2 shadow-lg relative overflow-hidden">
                      <div class="flex items-center justify-between border-b border-purple-500/20 pb-1.5">
                        <span class="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-bold text-[10px] tracking-wider border border-purple-500/40">DECK B</span>
                        <span id="dj-bpm-val-b" class="font-mono text-purple-400 text-xs font-bold">128 BPM</span>
                      </div>

                      <!-- Track Selector & Upload -->
                      <div class="flex items-center gap-1.5">
                        <select id="dj-track-select-b" onchange="handleDeckTrackSelect('b', this.value)" class="flex-1 p-1.5 bg-black/80 border border-white/15 rounded-xl text-[11px] text-white outline-none focus:border-purple-400 truncate font-medium cursor-pointer">
                          <option value="">-- Track auswählen --</option>
                        </select>
                        <button onclick="document.getElementById('dj-file-input-b').click()" class="p-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-xl text-[10px] font-bold cursor-pointer transition shrink-0" title="Eigenen Track für Deck B laden">
                          <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                        </button>
                        <input type="file" id="dj-file-input-b" accept="audio/*" onchange="handleDeckFileUpload('b', event)" class="hidden" />
                      </div>

                      <div id="dj-deck-b-title" class="text-xs text-white font-bold truncate h-4">Kein Track geladen</div>

                      <!-- Turntable Disk B -->
                      <div class="flex items-center justify-center py-1">
                        <div id="dj-vinyl-b" class="w-14 h-14 rounded-full border-2 border-purple-400/50 bg-[#160d20] flex items-center justify-center shadow-lg relative cursor-pointer" onclick="toggleDeck('b')">
                          <div class="w-5 h-5 rounded-full bg-purple-500/30 border border-purple-400/60 flex items-center justify-center">
                            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
                          </div>
                        </div>
                      </div>

                      <!-- Deck B Time & Pitch Controls -->
                      <div class="flex items-center justify-between text-[10px] font-mono text-gray-400">
                        <span id="dj-time-b">00:00</span>
                        <div class="flex items-center gap-1">
                          <span>Pitch:</span>
                          <input type="range" id="dj-pitch-slider-b" min="-16" max="16" step="0.5" value="0" oninput="setDeckPitch('b', this.value)" class="w-16 accent-purple-400 cursor-pointer h-1 bg-black/60 rounded-full" />
                        </div>
                      </div>

                      <!-- Deck B Volume Fader -->
                      <div class="flex items-center gap-2 pt-1 border-t border-white/5 text-[10px]">
                        <span class="font-bold text-gray-400">VOL</span>
                        <input type="range" min="0" max="1" step="0.05" value="0.8" oninput="setDeckVolume('b', this.value)" class="w-full accent-purple-400 cursor-pointer h-1.5 bg-black/60 rounded-full" />
                      </div>

                      <!-- Deck B Transport Buttons -->
                      <div class="flex items-center justify-between gap-1 pt-1">
                        <button onclick="cueDeck('b')" class="flex-1 py-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 text-purple-300 rounded-xl font-bold font-mono text-[10px] transition cursor-pointer">CUE</button>
                        <button id="dj-play-btn-b" onclick="toggleDeck('b')" class="flex-1 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/60 text-purple-100 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center">
                          <i data-lucide="play" class="w-4 h-4 ml-0.5"></i>
                        </button>
                        <button onclick="syncDeck('b')" class="flex-1 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl font-bold font-mono text-[10px] transition cursor-pointer">SYNC</button>
                      </div>
                    </div>

                  </div>

                  <!-- ========== HORIZONTAL CONTINUOUS CROSSFADER SECTION ========== -->
                  <div class="p-3 bg-black/80 border border-white/10 rounded-2xl flex flex-col gap-1.5 shadow-inner">
                    <div class="flex justify-between items-center text-[10px] font-mono font-bold">
                      <span class="text-cyan-400">◄ DECK A</span>
                      <span class="text-gray-400 uppercase tracking-widest text-[9px]">EQUAL POWER CROSSFADER</span>
                      <span class="text-purple-400">DECK B ►</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-[9px] font-mono text-cyan-300 font-bold">A</span>
                      <input type="range" id="dj-crossfader-slider" min="0" max="1" step="0.01" value="0.5" oninput="setDjCrossfader(this.value)" class="w-full h-2.5 bg-gradient-to-r from-cyan-500/40 via-purple-500/30 to-purple-500/40 rounded-xl accent-white cursor-pointer" />
                      <span class="text-[9px] font-mono text-purple-300 font-bold">B</span>
                    </div>
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

    <!-- ====================================================================== -->
    <!-- NATIVE MOBILE TAB PANELS (Fokus, Audio & Tools) -->
    <!-- ====================================================================== -->

    <!-- PANEL 2: MOBILE HERO FOKUS-TIMER -->
    <div id="mobile-view-focus" class="mobile-view-pane select-none">
      <div class="flex flex-col items-center justify-center p-4 max-w-md mx-auto min-h-[calc(100dvh-150px)]">
        
        <!-- Timer Card -->
        <div class="w-full bg-gradient-to-b from-[#181828]/95 to-[#0e0e18]/95 border border-purple-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl text-center relative overflow-hidden flex flex-col items-center">
          
          <div class="text-[11px] font-black tracking-widest uppercase text-purple-400 mb-2 flex items-center gap-1.5">
            <i data-lucide="flame" class="w-4 h-4 text-purple-400 animate-pulse"></i>
            <span>Deep Focus Timer</span>
          </div>

          <!-- Hero Timer Display -->
          <div class="my-6 relative flex items-center justify-center">
            <div class="w-56 h-56 rounded-full border-4 border-purple-500/20 flex flex-col items-center justify-center relative shadow-[0_0_50px_rgba(168,85,247,0.2)] bg-black/40">
              <span id="mobile-timer-display" class="font-display font-black text-5xl tracking-wider text-white">02:00</span>
              <span id="mobile-timer-status" class="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Bereit</span>
            </div>
          </div>

          <!-- Preset Pills -->
          <div class="w-full flex items-center justify-center gap-1.5 flex-wrap mb-6">
            <button onclick="setTimerPreset(2); switchMobileNavTab('focus');" class="px-3 py-1.5 rounded-full bg-white/5 hover:bg-purple-500/20 border border-white/10 text-xs font-bold text-gray-300 active:scale-95 transition">2m</button>
            <button onclick="setTimerPreset(5); switchMobileNavTab('focus');" class="px-3 py-1.5 rounded-full bg-white/5 hover:bg-purple-500/20 border border-white/10 text-xs font-bold text-gray-300 active:scale-95 transition">5m</button>
            <button onclick="setTimerPreset(15); switchMobileNavTab('focus');" class="px-3 py-1.5 rounded-full bg-white/5 hover:bg-purple-500/20 border border-white/10 text-xs font-bold text-gray-300 active:scale-95 transition">15m</button>
            <button onclick="setTimerPreset(25); switchMobileNavTab('focus');" class="px-3 py-1.5 rounded-full bg-purple-600/30 border border-purple-400 text-xs font-bold text-white active:scale-95 transition">25m</button>
            <button onclick="setTimerPreset(45); switchMobileNavTab('focus');" class="px-3 py-1.5 rounded-full bg-white/5 hover:bg-purple-500/20 border border-white/10 text-xs font-bold text-gray-300 active:scale-95 transition">45m</button>
            <button onclick="setTimerPreset(60); switchMobileNavTab('focus');" class="px-3 py-1.5 rounded-full bg-white/5 hover:bg-purple-500/20 border border-white/10 text-xs font-bold text-gray-300 active:scale-95 transition">60m</button>
          </div>

          <!-- Action Controls -->
          <div class="flex items-center gap-3 w-full justify-center">
            <button id="mobile-timer-play-btn" onclick="startTimer()" class="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-sm transition shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
              <i data-lucide="play" class="w-4 h-4 fill-current"></i>
              <span>Starten</span>
            </button>
            <button id="mobile-timer-pause-btn" onclick="pauseTimer()" class="hidden flex-1 py-3.5 px-6 rounded-2xl bg-amber-500 text-black font-black text-sm transition shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
              <i data-lucide="pause" class="w-4 h-4"></i>
              <span>Pause</span>
            </button>
            <button onclick="stopTimer()" class="p-3.5 rounded-2xl bg-white/10 hover:bg-rose-500/20 text-gray-300 hover:text-rose-300 border border-white/10 transition active:scale-95 cursor-pointer" title="Zurücksetzen">
              <i data-lucide="rotate-ccw" class="w-5 h-5"></i>
            </button>
            <button onclick="toggleMinimalist()" class="p-3.5 rounded-2xl bg-white/10 hover:bg-purple-500/20 text-gray-300 hover:text-purple-300 border border-white/10 transition active:scale-95 cursor-pointer" title="Zen Vollbild">
              <i data-lucide="maximize-2" class="w-5 h-5"></i>
            </button>
          </div>

        </div>

      </div>
    </div>

    <!-- PANEL 3: MOBILE AUDIO LOUNGE -->
    <div id="mobile-view-audio" class="mobile-view-pane select-none">
      <div class="p-4 max-w-md mx-auto space-y-4">
        
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-950/60 to-pink-950/60 border border-purple-500/30 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <h3 class="text-sm font-black text-white flex items-center gap-2">
              <i data-lucide="headphones" class="w-4 h-4 text-purple-400"></i>
              <span>Audio-Lounge & Beats</span>
            </h3>
            <p class="text-[11px] text-gray-400">Konzentrations-Soundscapes & Live-BPM</p>
          </div>
          <button onclick="stopAllSounds()" class="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold active:scale-95 transition">
            Stopp ⏹
          </button>
        </div>

        <!-- 1. Naturklänge (12 Sounds) -->
        <div class="bg-[#141420]/90 border border-white/10 p-4 rounded-2xl shadow-xl">
          <h4 class="text-xs font-bold text-gray-300 mb-2.5 flex items-center gap-1.5">
            <span>🍃</span> <span>Natur & Atmosphäre</span>
          </h4>
          <div class="grid grid-cols-3 gap-2">
            <button onclick="playAmbientSound('piano')" class="p-2 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-center active:scale-95 transition">
              <div class="text-lg">🎹</div>
              <div class="text-[10px] font-bold text-gray-200 mt-1 truncate">Piano</div>
            </button>
            <button onclick="playAmbientSound('lofi')" class="p-2 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-center active:scale-95 transition">
              <div class="text-lg">🎶</div>
              <div class="text-[10px] font-bold text-gray-200 mt-1 truncate">Lo-Fi</div>
            </button>
            <button onclick="playAmbientSound('space')" class="p-2 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-center active:scale-95 transition">
              <div class="text-lg">🌌</div>
              <div class="text-[10px] font-bold text-gray-200 mt-1 truncate">Cosmic</div>
            </button>
            <button onclick="playAmbientSound('guitar')" class="p-2 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-center active:scale-95 transition">
              <div class="text-lg">🪕</div>
              <div class="text-[10px] font-bold text-gray-200 mt-1 truncate">Gitarre</div>
            </button>
            <button onclick="playAmbientSound('campfire')" class="p-2 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-center active:scale-95 transition">
              <div class="text-lg">🔥</div>
              <div class="text-[10px] font-bold text-gray-200 mt-1 truncate">Kamin</div>
            </button>
            <button onclick="playAmbientSound('birds')" class="p-2 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-center active:scale-95 transition">
              <div class="text-lg">🐦</div>
              <div class="text-[10px] font-bold text-gray-200 mt-1 truncate">Wald</div>
            </button>
            <button onclick="playAmbientSound('cafe')" class="p-2 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-center active:scale-95 transition">
              <div class="text-lg">☕</div>
              <div class="text-[10px] font-bold text-gray-200 mt-1 truncate">Café</div>
            </button>
            <button onclick="playAmbientSound('chimes')" class="p-2 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-center active:scale-95 transition">
              <div class="text-lg">🎐</div>
              <div class="text-[10px] font-bold text-gray-200 mt-1 truncate">Windspiel</div>
            </button>
            <button onclick="playAmbientSound('singingbowl')" class="p-2 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-center active:scale-95 transition">
              <div class="text-lg">🥣</div>
              <div class="text-[10px] font-bold text-gray-200 mt-1 truncate">Klangschale</div>
            </button>
          </div>
        </div>

        <!-- 2. Beat Sequencer & BPM -->
        <div class="bg-[#141420]/90 border border-white/10 p-4 rounded-2xl shadow-xl">
          <h4 class="text-xs font-bold text-pink-300 mb-2.5 flex items-center justify-between">
            <span class="flex items-center gap-1.5"><span>🥁</span> <span>Synthesizer Beats</span></span>
            <span id="mobile-bpm-val" class="font-mono text-xs text-pink-400 font-bold">120 BPM</span>
          </h4>
          <div class="grid grid-cols-2 gap-2 mb-3">
            <button onclick="toggleGenreBeat('techno')" class="p-2.5 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 rounded-xl text-xs font-bold text-pink-200 active:scale-95 transition">⚡ Techno</button>
            <button onclick="toggleGenreBeat('dnb')" class="p-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-xs font-bold text-cyan-200 active:scale-95 transition">🚀 Drum'n'Bass</button>
            <button onclick="toggleGenreBeat('afrobeat')" class="p-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-200 active:scale-95 transition">🌴 Afrobeats</button>
            <button onclick="toggleGenreBeat('swing')" class="p-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl text-xs font-bold text-purple-200 active:scale-95 transition">🎷 Swing</button>
          </div>
          <input type="range" min="60" max="160" value="120" oninput="setSequencerBpm(this.value); document.getElementById('mobile-bpm-val').innerText = this.value + ' BPM';" class="w-full accent-pink-500" />
        </div>

      </div>
    </div>

    <!-- PANEL 4: MOBILE TOOLS & LIFESTYLE BENTO GRID -->
    <div id="mobile-view-tools" class="mobile-view-pane select-none">
      <div class="p-4 max-w-md mx-auto space-y-3">
        
        <div class="text-xs font-black uppercase tracking-wider text-gray-400 mb-1">
          🛠️ Lifestyle & Produktivität
        </div>

        <div class="grid grid-cols-2 gap-3">
          
          <!-- Live-Sync ⚡ -->
          <div onclick="openP2PSyncModal()" class="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-[#12121a] border border-emerald-500/40 shadow-lg cursor-pointer active:scale-95 transition flex flex-col justify-between h-28">
            <div class="flex items-center justify-between">
              <span class="text-2xl">📱</span>
              <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">1-Klick</span>
            </div>
            <div>
              <h4 class="text-xs font-bold text-white leading-tight">Live-Sync & QR</h4>
              <p class="text-[10px] text-emerald-400 mt-0.5">PC ↔ Smartphone</p>
            </div>
          </div>

          <!-- Schnellmenü & Themes -->
          <div onclick="openMobileQuickMenu()" class="p-4 rounded-2xl bg-gradient-to-br from-purple-950/50 to-[#12121a] border border-purple-500/40 shadow-lg cursor-pointer active:scale-95 transition flex flex-col justify-between h-28">
            <div class="flex items-center justify-between">
              <span class="text-2xl">⚡</span>
              <span class="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">Optionen</span>
            </div>
            <div>
              <h4 class="text-xs font-bold text-white leading-tight">Design & Sprache</h4>
              <p class="text-[10px] text-purple-300 mt-0.5">Themes & Backup</p>
            </div>
          </div>

          <!-- Einkauf -->
          <div onclick="openShoppingModal()" class="p-4 rounded-2xl bg-gradient-to-br from-teal-950/50 to-[#12121a] border border-teal-500/30 shadow-lg cursor-pointer active:scale-95 transition flex flex-col justify-between h-28">
            <div class="flex items-center justify-between">
              <span class="text-2xl">🛒</span>
              <span class="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold">Loot</span>
            </div>
            <div>
              <h4 class="text-xs font-bold text-white leading-tight">Einkaufsliste</h4>
              <p class="text-[10px] text-gray-400 mt-0.5">Kategorien & Mengen</p>
            </div>
          </div>

          <!-- Kochen -->
          <div onclick="openRecipeModal()" class="p-4 rounded-2xl bg-gradient-to-br from-amber-950/50 to-[#12121a] border border-amber-500/30 shadow-lg cursor-pointer active:scale-95 transition flex flex-col justify-between h-28">
            <div class="flex items-center justify-between">
              <span class="text-2xl">🍳</span>
              <span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">Kessel</span>
            </div>
            <div>
              <h4 class="text-xs font-bold text-white leading-tight">Rezepte & Prep</h4>
              <p class="text-[10px] text-gray-400 mt-0.5">Schritt-für-Schritt</p>
            </div>
          </div>

          <!-- Sport -->
          <div onclick="openSportModal()" class="p-4 rounded-2xl bg-gradient-to-br from-orange-950/50 to-[#12121a] border border-orange-500/30 shadow-lg cursor-pointer active:scale-95 transition flex flex-col justify-between h-28">
            <div class="flex items-center justify-between">
              <span class="text-2xl">🏃</span>
              <span class="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-bold">Aktiv</span>
            </div>
            <div>
              <h4 class="text-xs font-bold text-white leading-tight">Bewegungspause</h4>
              <p class="text-[10px] text-gray-400 mt-0.5">Mikro-Workouts</p>
            </div>
          </div>

          <!-- Wecker & Erinnerung -->
          <div onclick="openAlarmModal()" class="p-4 rounded-2xl bg-gradient-to-br from-pink-950/50 to-[#12121a] border border-pink-500/30 shadow-lg cursor-pointer active:scale-95 transition flex flex-col justify-between h-28">
            <div class="flex items-center justify-between">
              <span class="text-2xl">⏰</span>
              <span class="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold">Alarm</span>
            </div>
            <div>
              <h4 class="text-xs font-bold text-white leading-tight">Wecker & Timer</h4>
              <p class="text-[10px] text-gray-400 mt-0.5">Punktgenaue Wecker</p>
            </div>
          </div>

          <!-- Statistik & Reports -->
          <div onclick="openReportDashboard()" class="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/50 to-[#12121a] border border-cyan-500/30 shadow-lg cursor-pointer active:scale-95 transition flex flex-col justify-between h-28">
            <div class="flex items-center justify-between">
              <span class="text-2xl">📊</span>
              <span class="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">Stats</span>
            </div>
            <div>
              <h4 class="text-xs font-bold text-white leading-tight">Produktivität</h4>
              <p class="text-[10px] text-gray-400 mt-0.5">Wochenauswertung</p>
            </div>
          </div>

          <!-- "Was nun?" Helper -->
          <div onclick="openWhatNowModal()" class="p-4 rounded-2xl bg-gradient-to-br from-rose-950/50 to-[#12121a] border border-rose-500/30 shadow-lg cursor-pointer active:scale-95 transition flex flex-col justify-between h-28">
            <div class="flex items-center justify-between">
              <span class="text-2xl">🎲</span>
              <span class="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">Impuls</span>
            </div>
            <div>
              <h4 class="text-xs font-bold text-white leading-tight">Was nun?</h4>
              <p class="text-[10px] text-gray-400 mt-0.5">Energie-Vorschlag</p>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- FLOATING ACTION BUTTON (FAB: + NEUE AUFGABE) -->
    <button id="mobile-fab-add" onclick="openMobileQuickAddModal()" title="Neue Aufgabe hinzufügen" aria-label="Neue Aufgabe hinzufügen">
      <i data-lucide="plus" class="w-6 h-6 stroke-[2.5]"></i>
    </button>

    <!-- NATIVE MOBILE BOTTOM NAVIGATION BAR (5 TABS) -->
    <nav id="mobile-bottom-nav">
      <button onclick="switchMobileNavTab('planer')" id="mob-nav-planer" class="mobile-nav-item active">
        <i data-lucide="layout-grid"></i>
        <span>Planer</span>
      </button>
      <button onclick="switchMobileNavTab('focus')" id="mob-nav-focus" class="mobile-nav-item">
        <i data-lucide="timer"></i>
        <span>Fokus</span>
      </button>
      <button onclick="switchMobileNavTab('audio')" id="mob-nav-audio" class="mobile-nav-item">
        <i data-lucide="headphones"></i>
        <span>Sounds</span>
      </button>
      <button onclick="switchMobileNavTab('tools')" id="mob-nav-tools" class="mobile-nav-item">
        <i data-lucide="wrench"></i>
        <span>Tools</span>
      </button>
      <button onclick="switchMobileNavTab('game')" id="mob-nav-game" class="mobile-nav-item">
        <i data-lucide="gamepad-2"></i>
        <span>3D-Game</span>
      </button>
    </nav>
`);

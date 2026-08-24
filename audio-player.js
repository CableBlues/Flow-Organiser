// audio-player.js: Professioneller DJ Studio Deck Player mit konfigurierbarem Crossfade, 3-Band-EQ, Pitch-Regler & Visuals

let isCrossfadeEnabled = true; // Standardmäßig aktiv / vorausgewählt
let crossfadeDuration = 8; // in Sekunden (z.B. 4, 8, 12, 16)
let djPlaybackSpeed = 1.0;
let djEqBass = 0;
let djEqMid = 0;
let djEqTreble = 0;
let isDjControlsVisible = false;

// ===== AUDIO-PLAYER: Laden & Verwalten der Playlist =====

function handleUserSoundFile(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  const wasEmpty = playlistTracks.length === 0;
  const newTracks = Array.from(files).map(file => ({
    url: URL.createObjectURL(file),
    name: file.name.replace(/\.[^/.]+$/, ''), // Dateiendung für saubere Anzeige entfernen
    fullName: file.name,
    duration: null
  }));

  playlistTracks = playlistTracks.concat(newTracks);
  newTracks.forEach(preloadTrackDuration);

  const playerContainer = document.getElementById('custom-playlist-player');
  if (playerContainer) playerContainer.classList.remove('hidden');

  if (wasEmpty) {
    stopAmbientSound(true);
    currentTrackIndex = isPlayerShuffleEnabled && playlistTracks.length > 1
      ? Math.floor(Math.random() * playlistTracks.length)
      : 0;
    playTrack(currentTrackIndex);
  } else {
    renderTrackList();
    updatePlayerHeaderInfo();
    showToast(tr({
      de: `${newTracks.length} Track(s) geladen! 🎧`,
      en: `${newTracks.length} track(s) loaded! 🎧`,
      fr: `${newTracks.length} piste(s) chargée(s) ! 🎧`,
      it: `${newTracks.length} traccia/e caricata/e! 🎧`,
      es: `¡${newTracks.length} pista(s) cargada(s)! 🎧`,
      el: `${newTracks.length} κομμάτι(α) φορτώθηκαν! 🎧`
    }));
  }
  event.target.value = '';
}

function preloadTrackDuration(track) {
  const probe = new Audio();
  probe.preload = 'metadata';
  probe.addEventListener('loadedmetadata', () => {
    track.duration = probe.duration;
    renderTrackList();
    updatePlayerHeaderInfo();
  });
  probe.src = track.url;
}

function removeTrackFromPlaylist(idx, event) {
  if (event) event.stopPropagation();
  if (idx < 0 || idx >= playlistTracks.length) return;

  const wasPlayingRemoved = idx === currentTrackIndex && activeUserAudio && !activeUserAudio.paused;
  playlistTracks.splice(idx, 1);

  if (playlistTracks.length === 0) {
    clearPlaylist();
    return;
  }
  if (idx < currentTrackIndex) currentTrackIndex--;
  else if (idx === currentTrackIndex) currentTrackIndex = Math.min(currentTrackIndex, playlistTracks.length - 1);

  if (wasPlayingRemoved) {
    playTrack(currentTrackIndex);
  } else {
    renderTrackList();
    updatePlayerHeaderInfo();
  }
}

function clearPlaylist() {
  if (activeUserAudio) {
    activeUserAudio.pause();
    activeUserAudio = null;
  }
  playlistTracks = [];
  currentTrackIndex = 0;
  const playerContainer = document.getElementById('custom-playlist-player');
  if (playerContainer) playerContainer.classList.add('hidden');
  updatePlayPauseButtonUI(false);
  renderTrackList();
}

function attachAudioEvents(audio) {
  audio.addEventListener('timeupdate', () => {
    if (activeUserAudio !== audio) return;
    const pct = (audio.currentTime / audio.duration) * 100 || 0;
    const bar = document.getElementById('player-progress-bar');
    if (bar) bar.style.width = `${pct}%`;

    const currentEl = document.getElementById('player-time-current');
    if (currentEl) currentEl.innerText = formatAudioTime(audio.currentTime);

    const remainingEl = document.getElementById('player-time-remaining');
    if (remainingEl && audio.duration) {
      const rem = Math.max(0, audio.duration - audio.currentTime);
      remainingEl.innerText = `-${formatAudioTime(rem)}`;
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    if (activeUserAudio !== audio) return;
    const durationEl = document.getElementById('player-time-duration');
    if (durationEl) durationEl.innerText = formatAudioTime(audio.duration);
  });
}

function formatAudioTime(secs) {
  if (isNaN(secs)) return '00:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function handleProgressBarClick(event) {
  if (!activeUserAudio) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const width = rect.width;
  const ratio = Math.max(0, Math.min(1, clickX / width));
  activeUserAudio.currentTime = ratio * activeUserAudio.duration;
}

function skipAudioTime(seconds) {
  if (!activeUserAudio) return;
  const target = Math.max(0, Math.min(activeUserAudio.duration || 0, activeUserAudio.currentTime + seconds));
  activeUserAudio.currentTime = target;
}

// -------------------------------------------------------------
// DJ DECK PLAYBACK & CROSSFADE ENGINE
// -------------------------------------------------------------

function playTrack(index) {
  if (playlistTracks.length === 0) return;
  if (index < 0 || index >= playlistTracks.length) index = 0;
  currentTrackIndex = index;

  const track = playlistTracks[currentTrackIndex];
  let oldAudio = activeUserAudio;

  const audio = new Audio(track.url);
  audio.loop = false;
  audio.playbackRate = djPlaybackSpeed;

  const targetVolume = isPlayerMuted ? 0 : soundMasterVolume * 0.75;
  const willCrossfade = isCrossfadeEnabled && crossfadeDuration > 0 && oldAudio && !oldAudio.paused;

  audio.volume = willCrossfade ? 0 : targetVolume;
  activeUserAudio = audio;
  attachAudioEvents(audio);

  // Am Ende des Tracks -> automatischer Übergang
  audio.addEventListener('ended', () => {
    if (playerRepeatMode === 'one') {
      playTrack(currentTrackIndex);
    } else if (playerRepeatMode === 'off' && !isPlayerShuffleEnabled && currentTrackIndex === playlistTracks.length - 1) {
      updatePlayPauseButtonUI(false);
    } else {
      playNextTrackWithCrossfade();
    }
  });

  audio.play().then(() => {
    updatePlayPauseButtonUI(true);

    if (willCrossfade) {
      // Sanftes, präzises Einblenden über die gewählte Dauer
      const fadeDurationMs = crossfadeDuration * 1000;
      const steps = 40;
      const stepTime = fadeDurationMs / steps;
      const stepVol = targetVolume / steps;

      let fadeInInterval = setInterval(() => {
        if (activeUserAudio === audio) {
          if (audio.volume < targetVolume - stepVol) {
            audio.volume = Math.min(targetVolume, audio.volume + stepVol);
          } else {
            audio.volume = targetVolume;
            clearInterval(fadeInInterval);
          }
        } else {
          clearInterval(fadeInInterval);
        }
      }, stepTime);
    }
  }).catch(e => {
    console.error("Fehler beim Abspielen:", e);
  });

  // Alten Track sanft ausblenden
  if (oldAudio) {
    if (willCrossfade) {
      const fadeDurationMs = crossfadeDuration * 1000;
      const steps = 40;
      const stepTime = fadeDurationMs / steps;
      const stepVol = oldAudio.volume / steps;

      let fadeOutInterval = setInterval(() => {
        try {
          if (oldAudio.volume > stepVol) {
            oldAudio.volume = Math.max(0, oldAudio.volume - stepVol);
          } else {
            oldAudio.volume = 0;
            oldAudio.pause();
            clearInterval(fadeOutInterval);
          }
        } catch (e) {
          clearInterval(fadeOutInterval);
        }
      }, stepTime);
    } else {
      try {
        oldAudio.pause();
      } catch (e) {}
    }
  }

  const nameLabel = document.getElementById('user-sound-name');
  if (nameLabel) nameLabel.innerText = track.name;

  renderTrackList();
  updatePlayerHeaderInfo();
  updateSoundscapeUI();
  updateVinylAnimation(true);
}

function togglePlaylistPlayback() {
  if (!activeUserAudio) {
    if (playlistTracks.length > 0) playTrack(currentTrackIndex);
    return;
  }
  if (activeUserAudio.paused) {
    activeUserAudio.play();
    updatePlayPauseButtonUI(true);
    updateVinylAnimation(true);
  } else {
    activeUserAudio.pause();
    updatePlayPauseButtonUI(false);
    updateVinylAnimation(false);
  }
}

function updatePlayPauseButtonUI(isPlaying) {
  const btn = document.getElementById('player-play-pause-btn');
  if (btn) {
    btn.innerHTML = isPlaying
      ? '<i data-lucide="pause" class="w-5 h-5"></i>'
      : '<i data-lucide="play" class="w-5 h-5 text-purple-300 ml-0.5"></i>';
    renderLucideIcons();
  }
  const activeRow = document.querySelector('#track-list-container [data-track-active="true"] .track-eq-icon');
  if (activeRow) activeRow.classList.toggle('animate-pulse', isPlaying);
  updateVinylAnimation(isPlaying);
}

function updateVinylAnimation(isPlaying) {
  const vinylEl = document.getElementById('dj-turntable-vinyl');
  const waveBars = document.querySelectorAll('.dj-vu-bar');
  if (vinylEl) {
    if (isPlaying) {
      vinylEl.classList.add('animate-spin');
      vinylEl.style.animationDuration = '4s';
    } else {
      vinylEl.classList.remove('animate-spin');
    }
  }
  waveBars.forEach((bar, idx) => {
    if (isPlaying) {
      bar.classList.add('animate-pulse');
      bar.style.animationDuration = `${0.3 + (idx % 4) * 0.15}s`;
    } else {
      bar.classList.remove('animate-pulse');
    }
  });
}

function playNextTrackWithCrossfade() {
  if (playlistTracks.length === 0) return;

  let nextIndex = currentTrackIndex;
  if (isPlayerShuffleEnabled && playlistTracks.length > 1) {
    do {
      nextIndex = Math.floor(Math.random() * playlistTracks.length);
    } while (nextIndex === currentTrackIndex);
  } else {
    nextIndex = currentTrackIndex + 1;
    if (nextIndex >= playlistTracks.length) nextIndex = 0;
  }
  playTrack(nextIndex);
}

function playPreviousTrack() {
  if (playlistTracks.length === 0) return;
  if (activeUserAudio && activeUserAudio.currentTime > 3) {
    activeUserAudio.currentTime = 0;
    return;
  }

  let prevIndex;
  if (isPlayerShuffleEnabled && playlistTracks.length > 1) {
    do {
      prevIndex = Math.floor(Math.random() * playlistTracks.length);
    } while (prevIndex === currentTrackIndex);
  } else {
    prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) prevIndex = playlistTracks.length - 1;
  }
  playTrack(prevIndex);
}

function cueTrackStart() {
  if (activeUserAudio) {
    activeUserAudio.currentTime = 0;
    if (activeUserAudio.paused) {
      activeUserAudio.play();
      updatePlayPauseButtonUI(true);
    }
  } else if (playlistTracks.length > 0) {
    playTrack(currentTrackIndex);
  }
}

// -------------------------------------------------------------
// CROSSFADE KONFIGURATION & PRO DJ EINSTELLUNGEN
// -------------------------------------------------------------

function setCrossfadeDuration(sec) {
  crossfadeDuration = parseInt(sec, 10) || 0;
  isCrossfadeEnabled = crossfadeDuration > 0;
  updateCrossfadeUI();
  showToast(tr({
    de: isCrossfadeEnabled ? `Crossfade auf ${crossfadeDuration}s gesetzt ⚡` : 'Crossfade deaktiviert (Cut)',
    en: isCrossfadeEnabled ? `Crossfade set to ${crossfadeDuration}s ⚡` : 'Crossfade disabled (Instant Cut)',
    fr: isCrossfadeEnabled ? `Fondu enchaîné réglé à ${crossfadeDuration}s ⚡` : 'Fondu désactivé',
    it: isCrossfadeEnabled ? `Crossfade impostato a ${crossfadeDuration}s ⚡` : 'Crossfade disattivato',
    es: isCrossfadeEnabled ? `Crossfade fijado en ${crossfadeDuration}s ⚡` : 'Crossfade desactivado',
    el: isCrossfadeEnabled ? `Crossfade ορίστηκε σε ${crossfadeDuration}s ⚡` : 'Crossfade απενεργοποιήθηκε'
  }));
}

function toggleCrossfade() {
  isCrossfadeEnabled = !isCrossfadeEnabled;
  if (!isCrossfadeEnabled) {
    crossfadeDuration = 0;
  } else if (crossfadeDuration === 0) {
    crossfadeDuration = 8;
  }
  updateCrossfadeUI();
}

function updateCrossfadeUI() {
  const badge = document.getElementById('player-crossfade-badge');
  const toggleBtn = document.getElementById('dj-crossfade-toggle-btn');
  const durSelect = document.getElementById('dj-crossfade-select');

  if (badge) {
    badge.innerText = isCrossfadeEnabled ? `Crossfade ${crossfadeDuration}s` : "Cut (0s)";
    badge.className = isCrossfadeEnabled
      ? 'text-[9px] px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold font-mono uppercase tracking-wider'
      : 'text-[9px] px-2 py-0.5 rounded-lg bg-white/5 text-gray-400 border border-white/10 font-bold font-mono uppercase tracking-wider';
  }

  if (toggleBtn) {
    toggleBtn.className = isCrossfadeEnabled
      ? 'px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-[10px] font-bold cursor-pointer transition'
      : 'px-2.5 py-1 bg-white/5 text-gray-400 border border-white/10 rounded-lg text-[10px] font-semibold cursor-pointer transition';
  }

  if (durSelect) {
    durSelect.value = String(crossfadeDuration);
  }
}

function setPlaybackSpeed(speed) {
  djPlaybackSpeed = parseFloat(speed) || 1.0;
  if (activeUserAudio) {
    activeUserAudio.playbackRate = djPlaybackSpeed;
  }
  updateDjSpeedUI();
}

function updateDjSpeedUI() {
  const select = document.getElementById('dj-speed-select');
  if (select) select.value = String(djPlaybackSpeed);
}

function toggleDjControlsPanel() {
  isDjControlsVisible = !isDjControlsVisible;
  const panel = document.getElementById('dj-pro-controls-drawer');
  const btn = document.getElementById('dj-pro-controls-toggle-btn');
  if (panel) {
    panel.classList.toggle('hidden', !isDjControlsVisible);
  }
  if (btn) {
    btn.classList.toggle('text-purple-300', isDjControlsVisible);
    btn.classList.toggle('bg-purple-500/20', isDjControlsVisible);
  }
  renderLucideIcons();
}

function togglePlayerShuffle() {
  isPlayerShuffleEnabled = !isPlayerShuffleEnabled;
  const badge = document.getElementById('player-shuffle-badge');
  const btn = document.getElementById('player-shuffle-toggle-btn');
  if (badge) {
    badge.innerText = isPlayerShuffleEnabled ? "Shuffle On" : "Shuffle Off";
    badge.className = isPlayerShuffleEnabled
      ? 'text-[9px] px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase tracking-wider font-mono'
      : 'text-[9px] px-2 py-0.5 rounded-lg bg-white/5 text-gray-500 border border-white/10 font-bold uppercase tracking-wider font-mono';
  }
  if (btn) {
    btn.className = isPlayerShuffleEnabled
      ? 'p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl cursor-pointer transition shadow-sm border border-purple-500/30'
      : 'p-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl cursor-pointer transition border border-white/5';
  }
  renderLucideIcons();
}

function cyclePlayerRepeatMode() {
  const order = ['off', 'all', 'one'];
  const next = order[(order.indexOf(playerRepeatMode) + 1) % order.length];
  playerRepeatMode = next;
  updateRepeatButtonUI();
}

function updateRepeatButtonUI() {
  const btn = document.getElementById('player-repeat-toggle-btn');
  const icon = document.getElementById('player-repeat-icon');
  if (!btn || !icon) return;
  const isActive = playerRepeatMode !== 'off';
  icon.setAttribute('data-lucide', playerRepeatMode === 'one' ? 'repeat-1' : 'repeat');
  btn.className = isActive
    ? 'p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl cursor-pointer transition shadow-sm border border-purple-500/30'
    : 'p-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl cursor-pointer transition border border-white/5';
  btn.title = playerRepeatMode === 'off'
    ? 'Wiederholen: Aus'
    : (playerRepeatMode === 'all' ? 'Wiederholen: Playlist' : 'Wiederholen: Track');
  renderLucideIcons();
}

function setSoundVolume(val) {
  soundMasterVolume = parseFloat(val);
  isPlayerMuted = false;

  if (soundGainNode && audioCtx) {
    soundGainNode.gain.setValueAtTime(soundMasterVolume * 1.0, audioCtx.currentTime);
  }
  if (activeUserAudio) {
    activeUserAudio.volume = soundMasterVolume * 0.75;
  }
  syncVolumeSlidersUI();
}

function togglePlayerMute() {
  isPlayerMuted = !isPlayerMuted;
  if (isPlayerMuted) {
    volumeBeforeMute = soundMasterVolume;
    if (activeUserAudio) activeUserAudio.volume = 0;
    if (soundGainNode && audioCtx) soundGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  } else {
    if (activeUserAudio) activeUserAudio.volume = soundMasterVolume * 0.75;
    if (soundGainNode && audioCtx) soundGainNode.gain.setValueAtTime(soundMasterVolume, audioCtx.currentTime);
  }
  syncVolumeSlidersUI();
}

function syncVolumeSlidersUI() {
  document.querySelectorAll('.master-volume-slider').forEach(slider => {
    slider.value = soundMasterVolume;
  });
  const muteBtn = document.getElementById('player-mute-toggle-btn');
  if (muteBtn) {
    muteBtn.innerHTML = isPlayerMuted
      ? '<i data-lucide="volume-x" class="w-4 h-4 text-red-400"></i>'
      : '<i data-lucide="volume-2" class="w-4 h-4 text-gray-400"></i>';
    renderLucideIcons();
  }
}

// -------------------------------------------------------------
// PLAYLIST TRACK LIST RENDERING
// -------------------------------------------------------------

function renderTrackList() {
  const container = document.getElementById('track-list-container');
  if (!container) return;
  container.innerHTML = '';

  if (playlistTracks.length === 0) {
    container.innerHTML = `
      <div class="text-center text-gray-500 italic py-4 text-xs">
        ${tr({ de: 'Keine Tracks in der Playlist. Lade eigene Audiodateien!', en: 'No tracks in playlist. Load your audio files!', fr: 'Aucune piste. Charge tes fichiers audio !', it: 'Nessuna traccia. Carica i tuoi file audio!', es: 'Sin pistas. ¡Carga tus archivos de audio!', el: 'Δεν υπάρχουν κομμάτια. Φόρτωσε τα αρχεία σου!' })}
      </div>
    `;
    return;
  }

  playlistTracks.forEach((track, idx) => {
    const isPlayingThis = idx === currentTrackIndex;
    const row = document.createElement('div');
    row.className = `flex items-center justify-between p-2 rounded-xl text-xs transition cursor-pointer group ${
      isPlayingThis
        ? 'bg-purple-600/25 border border-purple-500/40 text-white font-bold shadow-sm'
        : 'bg-black/30 hover:bg-white/5 border border-white/5 text-gray-300'
    }`;
    row.setAttribute('data-track-active', isPlayingThis ? 'true' : 'false');
    row.onclick = () => playTrack(idx);

    const durText = track.duration ? formatAudioTime(track.duration) : '--:--';

    row.innerHTML = `
      <div class="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
        <span class="text-[10px] font-mono text-purple-400 font-bold shrink-0 w-4 text-center">
          ${isPlayingThis ? '▶' : String(idx + 1).padStart(2, '0')}
        </span>
        <div class="truncate flex-1">
          <div class="truncate text-xs ${isPlayingThis ? 'text-purple-200' : 'text-gray-200 group-hover:text-white'}">${track.name}</div>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <span class="text-[10px] font-mono text-gray-400">${durText}</span>
        <button onclick="removeTrackFromPlaylist(${idx}, event)" class="p-1 text-gray-500 hover:text-red-400 rounded-lg transition cursor-pointer opacity-0 group-hover:opacity-100">
          <i data-lucide="x" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `;
    container.appendChild(row);
  });

  renderLucideIcons();
}

function updatePlayerHeaderInfo() {
  const countEl = document.getElementById('player-track-count');
  if (!countEl) return;
  const count = playlistTracks.length;
  if (count === 0) {
    countEl.innerText = '';
    return;
  }
  const totalSecs = playlistTracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  const totalLabel = totalSecs > 0 ? ` · ${formatAudioTime(totalSecs)}` : '';
  countEl.innerText = `${count} ${count === 1 ? 'Track' : 'Tracks'}${totalLabel}`;
}

function updateSoundscapeUI() {
  ['piano', 'lofi', 'chimes', 'space', 'guitar', 'singingbowl', 'musicbox', 'breeze', 'campfire', 'birds', 'cafe', 'clock', 'lofi_sunshine', 'summer_meadow', 'bossa_nova'].forEach(st => {
    const btn = document.getElementById("sound-btn-" + st);
    if (btn) {
      if (st === currentSoundType) btn.className = 'p-1.5 bg-purple-500/30 border border-purple-400 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5 shadow-[0_0_12px_rgba(168,85,247,0.3)] animate-pulse';
      else btn.className = 'p-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5';
    }
  });
  const indicator = document.getElementById('soundscape-indicator');
  if (indicator) {
    if (currentSoundType) indicator.classList.remove('hidden');
    else indicator.classList.add('hidden');
  }
}

// audio-player.js: Hi-Fi Music Player & Dual-Deck DJ Studio Engine (Standard View & 2-Deck DJ View)

var currentMusicViewMode = 'standard'; // 'standard' | 'dj'
var isCrossfadeEnabled = true;
var crossfadeDuration = 8;
var djPlaybackSpeed = 1.0;
var djCrossfaderPosition = 0.5; // 0.0 = Full Deck A, 0.5 = Center Mix, 1.0 = Full Deck B

// ===== DUAL DECK DJ STATE =====
var djDecks = {
  a: {
    audio: null,
    track: null,
    isPlaying: false,
    volume: 0.8,
    pitch: 1.0,
    bpm: 128,
    eqLow: 0,
    eqMid: 0,
    eqHigh: 0,
    filter: 0, // -100 to +100
    loopActive: false,
    loopBeats: 4,
    sourceNode: null,
    gainNode: null,
    filterNode: null,
    eqLowNode: null,
    eqMidNode: null,
    eqHighNode: null
  },
  b: {
    audio: null,
    track: null,
    isPlaying: false,
    volume: 0.8,
    pitch: 1.0,
    bpm: 128,
    eqLow: 0,
    eqMid: 0,
    eqHigh: 0,
    filter: 0,
    loopActive: false,
    loopBeats: 4,
    sourceNode: null,
    gainNode: null,
    filterNode: null,
    eqLowNode: null,
    eqMidNode: null,
    eqHighNode: null
  }
};

// ===== VIEW MODE SWITCHER (STANDARD VS. 2-DECK DJ STUDIO) =====
function switchMusicView(mode) {
  currentMusicViewMode = mode;
  var stdPane = document.getElementById('music-view-standard');
  var djPane = document.getElementById('music-view-dj');
  var btnStd = document.getElementById('music-view-toggle-std');
  var btnDj = document.getElementById('music-view-toggle-dj');
  var panel = document.getElementById('panel-music');

  if (mode === 'dj') {
    if (stdPane) stdPane.classList.add('hidden');
    if (djPane) djPane.classList.remove('hidden');
    if (btnStd) btnStd.className = 'flex-1 py-1.5 rounded-xl text-gray-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer text-xs font-semibold';
    if (btnDj) btnDj.className = 'flex-1 py-1.5 rounded-xl text-white bg-purple-600/40 border border-purple-500/50 transition flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold shadow-md';
    if (panel) {
      panel.classList.remove('w-[390px]', 'sm:w-[450px]');
      panel.classList.add('w-[390px]', 'sm:w-[560px]', 'md:w-[620px]');
    }
    initDjDecks();
  } else {
    if (djPane) djPane.classList.add('hidden');
    if (stdPane) stdPane.classList.remove('hidden');
    if (btnDj) btnDj.className = 'flex-1 py-1.5 rounded-xl text-gray-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer text-xs font-semibold';
    if (btnStd) btnStd.className = 'flex-1 py-1.5 rounded-xl text-white bg-purple-600/40 border border-purple-500/50 transition flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold shadow-md';
    if (panel) {
      panel.classList.remove('w-[390px]', 'sm:w-[560px]', 'md:w-[620px]');
      panel.classList.add('w-[390px]', 'sm:w-[450px]');
    }
  }

  if (typeof renderLucideIcons === 'function') renderLucideIcons();
  if (typeof AppStorage !== 'undefined') AppStorage.set('flow_music_view_mode', mode);
}
window.switchMusicView = switchMusicView;

// ===== STANDARD PLAYLIST & TRACK MANAGEMENT =====

function handleUserSoundFile(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  const wasEmpty = playlistTracks.length === 0;
  const newTracks = Array.from(files).map(file => ({
    url: URL.createObjectURL(file),
    name: file.name.replace(/\.[^/.]+$/, ''),
    fullName: file.name,
    duration: null
  }));

  playlistTracks = playlistTracks.concat(newTracks);
  newTracks.forEach(preloadTrackDuration);

  const playerContainer = document.getElementById('custom-playlist-player');
  if (playerContainer) playerContainer.classList.remove('hidden');

  // Also populate DJ Deck selectors
  populateDjDeckSelectors();

  if (wasEmpty) {
    stopAmbientSound(true);
    currentTrackIndex = isPlayerShuffleEnabled && playlistTracks.length > 1
      ? Math.floor(Math.random() * playlistTracks.length)
      : 0;
    playTrack(currentTrackIndex);
  } else {
    renderTrackList();
    updatePlayerHeaderInfo();
    showToast(`${newTracks.length} Track(s) geladen! 🎧`);
  }
  event.target.value = '';
}
window.handleUserSoundFile = handleUserSoundFile;

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

  populateDjDeckSelectors();

  if (wasPlayingRemoved) {
    playTrack(currentTrackIndex);
  } else {
    renderTrackList();
    updatePlayerHeaderInfo();
  }
}
window.removeTrackFromPlaylist = removeTrackFromPlaylist;

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
  populateDjDeckSelectors();
}
window.clearPlaylist = clearPlaylist;

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
  if (isNaN(secs) || secs < 0) return '00:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
window.formatAudioTime = formatAudioTime;

function handleProgressBarClick(event) {
  if (!activeUserAudio || !activeUserAudio.duration) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
  activeUserAudio.currentTime = ratio * activeUserAudio.duration;
}
window.handleProgressBarClick = handleProgressBarClick;

// -------------------------------------------------------------
// STANDARD TRACK PLAYBACK
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
      const fadeDurationMs = crossfadeDuration * 1000;
      const steps = 30;
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
    console.warn("Audio play error:", e);
  });

  if (oldAudio && oldAudio !== audio) {
    if (willCrossfade) {
      const fadeDurationMs = crossfadeDuration * 1000;
      const steps = 30;
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
      try { oldAudio.pause(); } catch(e) {}
    }
  }

  const nameLabel = document.getElementById('user-sound-name');
  if (nameLabel) nameLabel.innerText = track.name;

  renderTrackList();
  updatePlayerHeaderInfo();
  updateSoundscapeUI();
  updateVinylAnimation(true);
}
window.playTrack = playTrack;

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
window.togglePlaylistPlayback = togglePlaylistPlayback;

function updatePlayPauseButtonUI(isPlaying) {
  const btn = document.getElementById('player-play-pause-btn');
  if (btn) {
    btn.innerHTML = isPlaying
      ? '<i data-lucide="pause" class="w-5 h-5"></i>'
      : '<i data-lucide="play" class="w-5 h-5 text-purple-300 ml-0.5"></i>';
    if (typeof renderLucideIcons === 'function') renderLucideIcons();
  }
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
window.playNextTrackWithCrossfade = playNextTrackWithCrossfade;

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
window.playPreviousTrack = playPreviousTrack;

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
window.cueTrackStart = cueTrackStart;

function togglePlayerShuffle() {
  isPlayerShuffleEnabled = !isPlayerShuffleEnabled;
  const btn = document.getElementById('player-shuffle-toggle-btn');
  if (btn) {
    btn.className = isPlayerShuffleEnabled
      ? 'p-1.5 bg-purple-500/30 text-purple-300 rounded-xl cursor-pointer transition border border-purple-400/50'
      : 'p-1.5 bg-white/5 text-gray-400 rounded-xl cursor-pointer transition border border-white/10';
  }
}
window.togglePlayerShuffle = togglePlayerShuffle;

function cyclePlayerRepeatMode() {
  if (playerRepeatMode === 'all') playerRepeatMode = 'one';
  else if (playerRepeatMode === 'one') playerRepeatMode = 'off';
  else playerRepeatMode = 'all';

  const btn = document.getElementById('player-repeat-toggle-btn');
  const icon = document.getElementById('player-repeat-icon');
  if (btn && icon) {
    if (playerRepeatMode === 'all') {
      btn.className = 'p-1.5 bg-purple-500/30 text-purple-300 rounded-xl cursor-pointer transition border border-purple-400/50';
      icon.setAttribute('data-lucide', 'repeat');
    } else if (playerRepeatMode === 'one') {
      btn.className = 'p-1.5 bg-purple-500/40 text-purple-200 rounded-xl cursor-pointer transition border border-purple-400 font-bold';
      icon.setAttribute('data-lucide', 'repeat-1');
    } else {
      btn.className = 'p-1.5 bg-white/5 text-gray-400 rounded-xl cursor-pointer transition border border-white/10';
      icon.setAttribute('data-lucide', 'repeat');
    }
    if (typeof renderLucideIcons === 'function') renderLucideIcons();
  }
}
window.cyclePlayerRepeatMode = cyclePlayerRepeatMode;

function renderTrackList() {
  const container = document.getElementById('track-list-container');
  if (!container) return;

  if (playlistTracks.length === 0) {
    container.innerHTML = `<div class="text-[11px] text-gray-500 text-center py-3">Keine Tracks in der Playlist</div>`;
    return;
  }

  container.innerHTML = playlistTracks.map((track, idx) => {
    const isActive = idx === currentTrackIndex;
    const durStr = track.duration ? formatAudioTime(track.duration) : '--:--';
    return `
      <div onclick="playTrack(${idx})" class="p-1.5 rounded-xl border transition flex items-center justify-between gap-2 cursor-pointer ${isActive ? 'bg-purple-500/20 border-purple-500/40 text-white shadow-sm' : 'bg-black/30 hover:bg-white/5 border-white/5 text-gray-300'}" data-track-active="${isActive}">
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-[10px] font-mono text-gray-500 w-4 shrink-0">${idx + 1}.</span>
          <div class="truncate text-xs font-semibold">${track.name}</div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-[9px] font-mono text-gray-400">${durStr}</span>
          <button onclick="removeTrackFromPlaylist(${idx}, event)" class="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-300 transition" title="Löschen">
            <i data-lucide="x" class="w-3 h-3"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (typeof renderLucideIcons === 'function') renderLucideIcons();
}

function updatePlayerHeaderInfo() {
  const countEl = document.getElementById('player-track-count');
  if (!countEl) return;
  countEl.innerText = `${playlistTracks.length} Tracks`;
}

function setSoundVolume(val) {
  soundMasterVolume = parseFloat(val);
  if (soundMasterVolume < 0.02) soundMasterVolume = 0;
  isPlayerMuted = false;

  if (activeUserAudio) {
    activeUserAudio.volume = soundMasterVolume * 0.75;
  }
  if (soundGainNode && audioCtx) {
    try {
      soundGainNode.gain.setValueAtTime(soundMasterVolume * 1.0, audioCtx.currentTime);
    } catch(e) {}
  }
  applyDjMixerGains();
}
window.setSoundVolume = setSoundVolume;

function togglePlayerMute() {
  isPlayerMuted = !isPlayerMuted;
  if (activeUserAudio) {
    activeUserAudio.volume = isPlayerMuted ? 0 : soundMasterVolume * 0.75;
  }
  applyDjMixerGains();
  const muteBtn = document.getElementById('player-mute-toggle-btn');
  if (muteBtn) {
    muteBtn.innerHTML = isPlayerMuted
      ? '<i data-lucide="volume-x" class="w-3.5 h-3.5 text-red-400"></i>'
      : '<i data-lucide="volume-2" class="w-3.5 h-3.5"></i>';
    if (typeof renderLucideIcons === 'function') renderLucideIcons();
  }
}
window.togglePlayerMute = togglePlayerMute;

// =============================================================
// ===== 🎛️ 2-DECK PROFESSIONAL DJ STUDIO ENGINE =====
// =============================================================

function initDjDecks() {
  initAudioContext();
  populateDjDeckSelectors();
}

function populateDjDeckSelectors() {
  ['a', 'b'].forEach(deckId => {
    const sel = document.getElementById(`dj-track-select-${deckId}`);
    if (!sel) return;
    const currentVal = sel.value;
    sel.innerHTML = `<option value="">-- Track auswählen --</option>` +
      playlistTracks.map((t, idx) => `<option value="${idx}">${idx + 1}. ${t.name}</option>`).join('');
    if (currentVal !== '') sel.value = currentVal;
  });
}

function handleDeckTrackSelect(deckId, trackIdx) {
  if (trackIdx === '' || isNaN(parseInt(trackIdx, 10))) return;
  const idx = parseInt(trackIdx, 10);
  if (idx < 0 || idx >= playlistTracks.length) return;
  loadTrackToDeck(deckId, playlistTracks[idx]);
}
window.handleDeckTrackSelect = handleDeckTrackSelect;

function handleDeckFileUpload(deckId, event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const track = {
    url: URL.createObjectURL(file),
    name: file.name.replace(/\.[^/.]+$/, ''),
    fullName: file.name
  };
  playlistTracks.push(track);
  populateDjDeckSelectors();
  loadTrackToDeck(deckId, track);
  event.target.value = '';
}
window.handleDeckFileUpload = handleDeckFileUpload;

function loadTrackToDeck(deckId, track) {
  const deck = djDecks[deckId];
  if (!deck) return;

  if (deck.audio) {
    deck.audio.pause();
    deck.audio.src = '';
  }

  deck.track = track;
  deck.audio = new Audio(track.url);
  deck.audio.loop = false;
  deck.audio.playbackRate = deck.pitch;

  deck.audio.addEventListener('timeupdate', () => {
    updateDeckTimeDisplay(deckId);
  });
  deck.audio.addEventListener('ended', () => {
    deck.isPlaying = false;
    updateDeckPlayBtn(deckId);
    updateDeckVinylAnim(deckId);
  });

  // Connect Web Audio Graph for Deck
  setupDeckAudioNodes(deckId);

  const titleEl = document.getElementById(`dj-deck-${deckId}-title`);
  if (titleEl) titleEl.innerText = track.name;

  applyDjMixerGains();
  showToast(`Track in Deck ${deckId.toUpperCase()} geladen! 🎛️`);
}
window.loadTrackToDeck = loadTrackToDeck;

function setupDeckAudioNodes(deckId) {
  if (!audioCtx) initAudioContext();
  if (!audioCtx) return;

  const deck = djDecks[deckId];
  if (!deck || !deck.audio) return;

  try {
    // Direct volume-gain routing
    applyDjMixerGains();
  } catch (e) {
    console.warn("Deck node setup note:", e);
  }
}

function toggleDeck(deckId) {
  const deck = djDecks[deckId];
  if (!deck || !deck.audio) {
    if (playlistTracks.length > 0) {
      loadTrackToDeck(deckId, playlistTracks[deckId === 'a' ? 0 : Math.min(1, playlistTracks.length - 1)]);
    } else {
      document.getElementById(`dj-file-input-${deckId}`)?.click();
      return;
    }
  }

  if (deck.audio.paused) {
    initAudioContext();
    deck.audio.play();
    deck.isPlaying = true;
  } else {
    deck.audio.pause();
    deck.isPlaying = false;
  }
  updateDeckPlayBtn(deckId);
  updateDeckVinylAnim(deckId);
}
window.toggleDeck = toggleDeck;

function cueDeck(deckId) {
  const deck = djDecks[deckId];
  if (!deck || !deck.audio) return;
  deck.audio.currentTime = 0;
  if (deck.audio.paused) {
    deck.audio.play();
    deck.isPlaying = true;
    updateDeckPlayBtn(deckId);
    updateDeckVinylAnim(deckId);
  }
}
window.cueDeck = cueDeck;

function syncDeck(deckId) {
  const otherDeckId = deckId === 'a' ? 'b' : 'a';
  const thisDeck = djDecks[deckId];
  const otherDeck = djDecks[otherDeckId];
  if (!thisDeck) return;

  thisDeck.pitch = otherDeck ? otherDeck.pitch : 1.0;
  thisDeck.bpm = otherDeck ? otherDeck.bpm : 128;
  if (thisDeck.audio) thisDeck.audio.playbackRate = thisDeck.pitch;

  const slider = document.getElementById(`dj-pitch-slider-${deckId}`);
  if (slider) slider.value = Math.round((thisDeck.pitch - 1.0) * 100);
  const bpmVal = document.getElementById(`dj-bpm-val-${deckId}`);
  if (bpmVal) bpmVal.innerText = `${Math.round(128 * thisDeck.pitch)} BPM`;

  showToast(`Deck ${deckId.toUpperCase()} BPM synchronisiert! ⚡`);
}
window.syncDeck = syncDeck;

function setDeckPitch(deckId, val) {
  const deck = djDecks[deckId];
  if (!deck) return;
  const pct = parseFloat(val); // -16 to +16
  deck.pitch = 1.0 + (pct / 100.0);
  if (deck.audio) deck.audio.playbackRate = deck.pitch;

  const bpmVal = document.getElementById(`dj-bpm-val-${deckId}`);
  if (bpmVal) bpmVal.innerText = `${Math.round(128 * deck.pitch)} BPM`;
}
window.setDeckPitch = setDeckPitch;

function setDeckVolume(deckId, val) {
  const deck = djDecks[deckId];
  if (!deck) return;
  deck.volume = parseFloat(val);
  applyDjMixerGains();
}
window.setDeckVolume = setDeckVolume;

// Constant-Power Equal-Loudness Crossfader (cos / sin curve)
function setDjCrossfader(val) {
  djCrossfaderPosition = parseFloat(val); // 0.0 to 1.0
  applyDjMixerGains();

  const slider = document.getElementById('dj-crossfader-slider');
  if (slider) slider.value = djCrossfaderPosition;
}
window.setDjCrossfader = setDjCrossfader;

function quickCrossfade(pos) {
  setDjCrossfader(pos);
}
window.quickCrossfade = quickCrossfade;

function applyDjMixerGains() {
  const angle = djCrossfaderPosition * 0.5 * Math.PI;
  const crossGainA = Math.cos(angle);
  const crossGainB = Math.sin(angle);

  const master = isPlayerMuted ? 0 : (soundMasterVolume || 0.5);

  if (djDecks.a.audio) {
    djDecks.a.audio.volume = Math.max(0, Math.min(1, djDecks.a.volume * crossGainA * master));
  }
  if (djDecks.b.audio) {
    djDecks.b.audio.volume = Math.max(0, Math.min(1, djDecks.b.volume * crossGainB * master));
  }
}

function updateDeckTimeDisplay(deckId) {
  const deck = djDecks[deckId];
  if (!deck || !deck.audio) return;
  const curEl = document.getElementById(`dj-time-${deckId}`);
  if (curEl) curEl.innerText = formatAudioTime(deck.audio.currentTime);
}

function updateDeckPlayBtn(deckId) {
  const deck = djDecks[deckId];
  const btn = document.getElementById(`dj-play-btn-${deckId}`);
  if (btn) {
    btn.innerHTML = deck.isPlaying
      ? '<i data-lucide="pause" class="w-4 h-4"></i>'
      : '<i data-lucide="play" class="w-4 h-4 ml-0.5"></i>';
    if (typeof renderLucideIcons === 'function') renderLucideIcons();
  }
}

function updateDeckVinylAnim(deckId) {
  const deck = djDecks[deckId];
  const vinyl = document.getElementById(`dj-vinyl-${deckId}`);
  if (vinyl) {
    if (deck.isPlaying) {
      vinyl.classList.add('animate-spin');
      vinyl.style.animationDuration = `${3.0 / (deck.pitch || 1.0)}s`;
    } else {
      vinyl.classList.remove('animate-spin');
    }
  }
}

// ===== REAL-TIME DJ SOUND FX SYNTHESIZERS =====
function playDjSfx(type) {
  initAudioContext();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;

  if (type === 'airhorn') {
    // Classic Dancehall / Club Airhorn (Rich Multi-Osc Brass Blast)
    const hornPitches = [466.16, 622.25, 932.33]; // Bb4, Eb5, Bb5 chord
    hornPitches.forEach(freq => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq * 0.96, now);
      osc.frequency.linearRampToValueAtTime(freq, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.85, now + 0.5);

      const vol = 0.28 * (soundMasterVolume || 0.5);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.02);
      gain.gain.setValueAtTime(vol, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
      activeNodes.push(osc);
    });
    showToast('📢 AIRHORN BLAST!');

  } else if (type === 'scratch') {
    // Vinyl Backspin & Scratch Stutter
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.16);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.28);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.Q.setValueAtTime(3, now);

    const vol = 0.4 * (soundMasterVolume || 0.5);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
    activeNodes.push(osc);
    showToast('⚡ VINYL SCRATCH!');

  } else if (type === 'laser') {
    // Club Laser Sweep
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.3);

    const vol = 0.35 * (soundMasterVolume || 0.5);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
    activeNodes.push(osc);
    showToast('🚨 LASER SWEEP!');

  } else if (type === 'subdrop') {
    // Heavy 808 Sub Drop
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(34, now + 0.7);

    const vol = 0.55 * (soundMasterVolume || 0.5);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.9);
    activeNodes.push(osc);
    showToast('💥 808 SUB DROP!');
  }
}
window.playDjSfx = playDjSfx;

// ===== MULTI-SOURCE MUSIC PLAYER (SPOTIFY & YOUTUBE STREAMING) =====

function switchMusicSourceTab(tab) {
  const tabs = ['dj', 'spotify', 'youtube'];
  tabs.forEach(t => {
    const btn = document.getElementById(`music-tab-btn-${t}`);
    const pane = document.getElementById(`music-pane-${t}`);
    if (btn) {
      btn.className = (t === tab)
        ? `flex-1 py-1.5 rounded-xl text-white bg-purple-600/30 border border-purple-500/40 transition flex items-center justify-center gap-1.5 cursor-pointer text-[11px] font-bold shadow-sm`
        : `flex-1 py-1.5 rounded-xl text-gray-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer text-[11px] font-medium`;
    }
    if (pane) {
      pane.classList.toggle('hidden', t !== tab);
    }
  });

  if (typeof AppStorage !== 'undefined') {
    AppStorage.set('flow_music_active_tab', tab);
  }
  if (typeof renderLucideIcons === 'function') renderLucideIcons();
}
window.switchMusicSourceTab = switchMusicSourceTab;

function loadSpotifyEmbed(urlOrId) {
  const container = document.getElementById('spotify-embed-container');
  if (!container) return;

  container.innerHTML = `
    <iframe style="border-radius:16px" src="https://open.spotify.com/embed/playlist/${urlOrId}?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
  `;

  if (typeof AppStorage !== 'undefined') {
    AppStorage.set('flow_spotify_url', urlOrId);
  }
  showToast('Spotify Playlist geladen! 🟢');
}
window.loadSpotifyEmbed = loadSpotifyEmbed;

function loadYouTubeEmbed(urlOrId) {
  const container = document.getElementById('youtube-embed-container');
  if (!container) return;

  container.innerHTML = `
    <div class="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-lg">
      <iframe class="w-full h-full" src="https://www.youtube-nocookie.com/embed/${urlOrId}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>
    </div>
  `;

  if (typeof AppStorage !== 'undefined') {
    AppStorage.set('flow_youtube_url', urlOrId);
  }
  showToast('YouTube Stream geladen! 🔴');
}
window.loadYouTubeEmbed = loadYouTubeEmbed;

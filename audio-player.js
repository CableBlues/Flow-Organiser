// audio-player.js: Noodle Studio Audio Player & DJ Tool Engine
// ============================================================================

var djDecks = {
  a: {
    audio: null,
    track: null,
    isPlaying: false,
    pitch: 1.0,
    bpm: 126,
    volume: 1.0,
    low: 1.0,
    mid: 1.0,
    high: 1.0,
    filter: 0.5,
    cueTime: 0,
    hotCues: [null, null, null, null],
    loopActive: false,
    loopLength: 4,
    loopStart: 0,
    loopEnd: 0,
    jogRotation: 0,
    keylock: true
  },
  b: {
    audio: null,
    track: null,
    isPlaying: false,
    pitch: 1.0,
    bpm: 85,
    volume: 1.0,
    low: 1.0,
    mid: 1.0,
    high: 1.0,
    filter: 0.5,
    cueTime: 0,
    hotCues: [null, null, null, null],
    loopActive: false,
    loopLength: 4,
    loopStart: 0,
    loopEnd: 0,
    jogRotation: 0,
    keylock: true
  }
};

// ============================================================================
// 1. FORMATIERUNG & UTILS
// ============================================================================
function formatAudioTime(secs) {
  if (isNaN(secs) || secs < 0) return '00:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
window.formatAudioTime = formatAudioTime;

// ============================================================================
// 2. TAB 3: EIGENE TRACKS / PLAYLIST PLAYER
// ============================================================================

function handleMusicFilesUpload(event) {
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
  newTracks.forEach(preloadMusicTrackDuration);

  renderMusicPlaylist();

  if (wasEmpty) {
    if (typeof stopAmbientSound === 'function') stopAmbientSound(true);
    currentTrackIndex = isPlayerShuffleEnabled && playlistTracks.length > 1
      ? Math.floor(Math.random() * playlistTracks.length)
      : 0;
    playMusicTrack(currentTrackIndex);
  } else {
    showToast(`${newTracks.length} Track(s) geladen! 🎧`);
  }
  event.target.value = '';
}
window.handleMusicFilesUpload = handleMusicFilesUpload;
window.handleUserSoundFile = handleMusicFilesUpload;

function preloadMusicTrackDuration(track) {
  const probe = new Audio();
  probe.preload = 'metadata';
  probe.addEventListener('loadedmetadata', () => {
    track.duration = probe.duration;
    renderMusicPlaylist();
    updateMusicNowPlayingDisplay();
  });
  probe.src = track.url;
}

function renderMusicPlaylist() {
  const container = document.getElementById('music-playlist-container');
  if (!container) return;

  if (playlistTracks.length === 0) {
    container.innerHTML = `<div class="text-center py-2 text-xs text-gray-500 italic">Noch keine Tracks geladen. Klicke auf 'Laden', um deine Musik abzuspielen.</div>`;
    return;
  }

  container.innerHTML = playlistTracks.map((track, idx) => {
    const isActive = idx === currentTrackIndex && activeUserAudio && !activeUserAudio.paused;
    const isSelected = idx === currentTrackIndex;
    const durStr = track.duration ? formatAudioTime(track.duration) : '--:--';
    return `
      <div onclick="playMusicTrack(${idx})" class="p-1.5 px-2 rounded-xl border transition flex items-center justify-between gap-2 cursor-pointer ${isSelected ? 'bg-purple-500/20 border-purple-500/40 text-white' : 'bg-black/30 hover:bg-white/5 border-white/5 text-gray-300'}">
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-[10px] font-mono ${isActive ? 'text-emerald-400 font-bold' : 'text-gray-500'} w-4 shrink-0">${idx + 1}.</span>
          <div class="truncate text-xs font-semibold ${isSelected ? 'text-purple-200' : ''}">${track.name}</div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-[9px] font-mono text-gray-400">${durStr}</span>
          <button onclick="removeMusicTrack(${idx}, event)" aria-label="Titel löschen" class="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-300 transition" title="Löschen">
            <i data-lucide="x" class="w-3 h-3"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (typeof renderLucideIcons === 'function') renderLucideIcons();
}
window.renderMusicPlaylist = renderMusicPlaylist;
window.renderTrackList = renderMusicPlaylist;

function playMusicTrack(index) {
  if (playlistTracks.length === 0) return;
  if (index < 0 || index >= playlistTracks.length) index = 0;
  currentTrackIndex = index;

  const track = playlistTracks[currentTrackIndex];

  if (activeUserAudio) {
    try {
      activeUserAudio.pause();
      activeUserAudio.src = '';
    } catch(e) {}
  }

  const audio = new Audio(track.url);
  audio.volume = isPlayerMuted ? 0 : (soundMasterVolume * 0.75);
  activeUserAudio = audio;

  audio.addEventListener('timeupdate', () => {
    if (activeUserAudio !== audio) return;
    updateMusicProgressUI(audio);
  });

  audio.addEventListener('ended', () => {
    if (playerRepeatMode === 'one') {
      playMusicTrack(currentTrackIndex);
    } else if (playerRepeatMode === 'off' && !isPlayerShuffleEnabled && currentTrackIndex === playlistTracks.length - 1) {
      updateMusicPlayBtnUI(false);
    } else {
      playNextMusicTrack();
    }
  });

  audio.play().then(() => {
    updateMusicPlayBtnUI(true);
    updateMusicNowPlayingDisplay();
    renderMusicPlaylist();
  }).catch(err => {
    console.warn('[AudioPlayer] Playback error:', err);
  });
}
window.playMusicTrack = playMusicTrack;
window.playTrack = playMusicTrack;

function toggleMusicPlayback() {
  if (!activeUserAudio) {
    if (playlistTracks.length > 0) playMusicTrack(currentTrackIndex);
    return;
  }

  if (activeUserAudio.paused) {
    activeUserAudio.play().then(() => {
      updateMusicPlayBtnUI(true);
      renderMusicPlaylist();
    }).catch(e => console.warn(e));
  } else {
    activeUserAudio.pause();
    updateMusicPlayBtnUI(false);
    renderMusicPlaylist();
  }
}
window.toggleMusicPlayback = toggleMusicPlayback;
window.togglePlaylistPlayback = toggleMusicPlayback;

function playNextMusicTrack() {
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
  playMusicTrack(nextIndex);
}
window.playNextMusicTrack = playNextMusicTrack;
window.playNextTrackWithCrossfade = playNextMusicTrack;

function playPrevMusicTrack() {
  if (playlistTracks.length === 0) return;
  if (activeUserAudio && activeUserAudio.currentTime > 3) {
    activeUserAudio.currentTime = 0;
    return;
  }
  let prevIndex = currentTrackIndex - 1;
  if (prevIndex < 0) prevIndex = playlistTracks.length - 1;
  playMusicTrack(prevIndex);
}
window.playPrevMusicTrack = playPrevMusicTrack;
window.playPreviousTrack = playPrevMusicTrack;

function seekMusicTrack(val) {
  if (!activeUserAudio || !activeUserAudio.duration) return;
  const pct = parseFloat(val);
  activeUserAudio.currentTime = (pct / 100) * activeUserAudio.duration;
}
window.seekMusicTrack = seekMusicTrack;

function setMusicPlayerVolume(val) {
  soundMasterVolume = parseFloat(val);
  if (activeUserAudio) {
    activeUserAudio.volume = isPlayerMuted ? 0 : (soundMasterVolume * 0.75);
  }
}
window.setMusicPlayerVolume = setMusicPlayerVolume;
window.setSoundVolume = setMusicPlayerVolume;

function toggleMusicShuffle() {
  isPlayerShuffleEnabled = !isPlayerShuffleEnabled;
  const btn = document.getElementById('music-btn-shuffle');
  if (btn) {
    btn.className = isPlayerShuffleEnabled
      ? 'p-1 rounded-lg bg-purple-500/30 text-purple-300 border border-purple-400/40 cursor-pointer transition'
      : 'p-1 rounded-lg text-gray-400 hover:text-white transition cursor-pointer';
  }
  showToast(isPlayerShuffleEnabled ? 'Zufallswiedergabe aktiv 🔀' : 'Zufallswiedergabe aus');
}
window.toggleMusicShuffle = toggleMusicShuffle;
window.togglePlayerShuffle = toggleMusicShuffle;

function toggleMusicRepeat() {
  if (playerRepeatMode === 'all') playerRepeatMode = 'one';
  else if (playerRepeatMode === 'one') playerRepeatMode = 'off';
  else playerRepeatMode = 'all';

  const btn = document.getElementById('music-btn-repeat');
  if (btn) {
    if (playerRepeatMode === 'all') {
      btn.className = 'p-1 rounded-lg bg-purple-500/30 text-purple-300 border border-purple-400/40 cursor-pointer transition';
      btn.title = 'Alles wiederholen';
    } else if (playerRepeatMode === 'one') {
      btn.className = 'p-1 rounded-lg bg-purple-500/50 text-purple-100 border border-purple-300 font-bold cursor-pointer transition';
      btn.title = 'Titel wiederholen';
    } else {
      btn.className = 'p-1 rounded-lg text-gray-400 hover:text-white transition cursor-pointer';
      btn.title = 'Keine Wiederholung';
    }
  }
}
window.toggleMusicRepeat = toggleMusicRepeat;
window.cyclePlayerRepeatMode = toggleMusicRepeat;

function removeMusicTrack(idx, event) {
  if (event) event.stopPropagation();
  if (idx < 0 || idx >= playlistTracks.length) return;

  const wasPlaying = idx === currentTrackIndex && activeUserAudio && !activeUserAudio.paused;
  const [removedTrack] = playlistTracks.splice(idx, 1);
  if (removedTrack && removedTrack.url && String(removedTrack.url).startsWith('blob:')) {
    try { URL.revokeObjectURL(removedTrack.url); } catch(e) {}
  }

  if (playlistTracks.length === 0) {
    if (activeUserAudio) {
      activeUserAudio.pause();
      activeUserAudio = null;
    }
    currentTrackIndex = 0;
    updateMusicPlayBtnUI(false);
    updateMusicNowPlayingDisplay();
    renderMusicPlaylist();
    return;
  }

  if (idx < currentTrackIndex) {
    currentTrackIndex--;
  } else if (idx === currentTrackIndex) {
    currentTrackIndex = Math.min(currentTrackIndex, playlistTracks.length - 1);
    if (wasPlaying) {
      playMusicTrack(currentTrackIndex);
      return;
    }
  }

  updateMusicNowPlayingDisplay();
  renderMusicPlaylist();
}
window.removeMusicTrack = removeMusicTrack;
window.removeTrackFromPlaylist = removeMusicTrack;

function updateMusicPlayBtnUI(isPlaying) {
  const btn = document.getElementById('music-play-pause-btn');
  if (btn) {
    btn.innerHTML = isPlaying
      ? '<i data-lucide="pause" class="w-3.5 h-3.5"></i>'
      : '<i data-lucide="play" class="w-3.5 h-3.5"></i>';
    if (typeof renderLucideIcons === 'function') renderLucideIcons();
  }
}

function updateMusicNowPlayingDisplay() {
  const titleEl = document.getElementById('music-now-playing-title');
  const timeEl = document.getElementById('music-now-playing-time');
  const track = playlistTracks[currentTrackIndex];

  if (titleEl) {
    titleEl.innerText = track ? track.name : 'Kein Track aktiv';
  }
  if (timeEl && track && activeUserAudio) {
    const cur = formatAudioTime(activeUserAudio.currentTime);
    const dur = track.duration ? formatAudioTime(track.duration) : '--:--';
    timeEl.innerText = `${cur} / ${dur}`;
  }
}

function updateMusicProgressUI(audio) {
  if (!audio || !audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100 || 0;
  const slider = document.getElementById('music-progress-slider');
  if (slider) slider.value = pct;

  const timeEl = document.getElementById('music-now-playing-time');
  if (timeEl) {
    const cur = formatAudioTime(audio.currentTime);
    const dur = formatAudioTime(audio.duration);
    timeEl.innerText = `${cur} / ${dur}`;
  }
}

// ============================================================================
// 3. MULTI-SOURCE STREAMING (SPOTIFY & YOUTUBE)
// ============================================================================

function switchMusicSourceTab(tab) {
  const tabs = ['dj', 'spotify', 'youtube'];
  tabs.forEach(t => {
    const btn = document.getElementById(`music-tab-btn-${t}`);
    const pane = document.getElementById(`music-pane-${t}`);
    if (btn) {
      btn.className = (t === tab)
        ? `flex-1 py-1 rounded-lg text-white bg-purple-600/30 border border-purple-500/40 transition flex items-center justify-center gap-1.5 cursor-pointer text-[11px] font-bold shadow-sm`
        : `flex-1 py-1 rounded-lg text-gray-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer text-[11px] font-medium`;
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
  let val = urlOrId;
  if (!val) {
    const input = document.getElementById('spotify-url-input');
    val = input ? input.value.trim() : '';
  }
  if (!val) return;

  const container = document.getElementById('spotify-embed-container');
  if (!container) return;

  let embedUrl = val;
  if (val.includes('open.spotify.com/')) {
    embedUrl = val.replace('open.spotify.com/', 'open.spotify.com/embed/');
  } else if (!val.includes('spotify.com')) {
    embedUrl = `https://open.spotify.com/embed/playlist/${val}`;
  }

  container.innerHTML = `
    <iframe style="border-radius:16px" src="${embedUrl}?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
  `;

  if (typeof AppStorage !== 'undefined') {
    AppStorage.set('flow_spotify_url', val);
  }
  showToast('Spotify Playlist geladen! 🟢');
}
window.loadSpotifyEmbed = loadSpotifyEmbed;

function loadYoutubeEmbed(urlOrId) {
  let val = urlOrId;
  if (!val) {
    const input = document.getElementById('youtube-url-input');
    val = input ? input.value.trim() : '';
  }
  if (!val) return;

  const container = document.getElementById('youtube-embed-container');
  if (!container) return;

  let videoId = val;
  const match = val.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    videoId = match[1];
  }

  container.innerHTML = `
    <div class="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-lg">
      <iframe class="w-full h-full" src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>
    </div>
  `;

  if (typeof AppStorage !== 'undefined') {
    AppStorage.set('flow_youtube_url', val);
  }
  showToast('YouTube Stream geladen! 🔴');
}
window.loadYoutubeEmbed = loadYoutubeEmbed;
window.loadYouTubeEmbed = loadYoutubeEmbed;

// ============================================================================
// 4. TAB 4: 2-DECK PRO DJ MIXER & AUTOMIX WORKSTATION
// ============================================================================

// Demo Synthesized Focus Stems
const BUILTIN_DJ_STEMS = [
  { id: 'deep_house', name: 'Deep House 126 BPM', bpm: 126, color: 'cyan', emoji: '⚡' },
  { id: 'lofi_chill', name: 'Lofi Chill 85 BPM', bpm: 85, color: 'purple', emoji: '☕' },
  { id: 'cyber_wave', name: 'Cyber Wave 128 BPM', bpm: 128, color: 'cyan', emoji: '🌌' },
  { id: 'tech_groove', name: 'Tech Groove 130 BPM', bpm: 130, color: 'purple', emoji: '🥁' },
  { id: 'ambient_flow', name: 'Ambient Chill 118 BPM', bpm: 118, color: 'cyan', emoji: '🍃' }
];

var djAutomix = {
  enabled: false,
  durationSec: 8,
  isTransitioning: false,
  activeDeck: 'a',
  timer: null
};

function initDjDecks() {
  if (!djDecks.a.track) {
    loadDjBuiltinTrack('a', 'deep_house', false);
  }
  if (!djDecks.b.track) {
    loadDjBuiltinTrack('b', 'lofi_chill', false);
  }
  setDjCrossfader(0.5);
  updateDjDeckUI('a');
  updateDjDeckUI('b');
}
window.initDjDecks = initDjDecks;

function createSyntheticBeatAudio(bpm = 124, type = 'techno') {
  initAudioContext();
  if (!audioCtx) return null;

  const sampleRate = audioCtx.sampleRate || 44100;
  const barSec = (60 / bpm) * 4;
  const loopSec = barSec * 4; // 16 beats loop
  const buffer = audioCtx.createBuffer(2, Math.floor(sampleRate * loopSec), sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  const beatSec = 60 / bpm;
  const totalBeats = 16;

  for (let b = 0; b < totalBeats; b++) {
    const startSample = Math.floor(b * beatSec * sampleRate);
    
    // Kick on every beat
    const kickSamples = Math.floor(0.18 * sampleRate);
    for (let i = 0; i < kickSamples; i++) {
      if (startSample + i < left.length) {
        const t = i / sampleRate;
        const freq = 130 * Math.exp(-t * 26) + 45;
        const env = Math.exp(-t * 18);
        const val = Math.sin(2 * Math.PI * freq * t) * env * 0.75;
        left[startSample + i] += val;
        right[startSample + i] += val;
      }
    }

    // Hi-Hat on off-beats
    const hatSample = Math.floor((b + 0.5) * beatSec * sampleRate);
    const hatLen = Math.floor(0.06 * sampleRate);
    for (let i = 0; i < hatLen; i++) {
      if (hatSample + i < left.length) {
        const env = Math.exp(-(i / sampleRate) * 55);
        const noise = (Math.random() * 2 - 1) * env * 0.35;
        left[hatSample + i] += noise;
        right[hatSample + i] += noise;
      }
    }

    // Snare / Clap on beats 2 and 4
    if (b % 2 === 1) {
      const snareSamples = Math.floor(0.14 * sampleRate);
      for (let i = 0; i < snareSamples; i++) {
        if (startSample + i < left.length) {
          const t = i / sampleRate;
          const noise = (Math.random() * 2 - 1) * Math.exp(-t * 28) * 0.45;
          const tone = Math.sin(2 * Math.PI * 180 * t) * Math.exp(-t * 32) * 0.35;
          left[startSample + i] += noise + tone;
          right[startSample + i] += noise + tone;
        }
      }
    }
  }

  const wavBlob = audioBufferToWavBlob(buffer);
  return URL.createObjectURL(wavBlob);
}

function audioBufferToWavBlob(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1;
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const dataLen = buffer.length * blockAlign;
  const bufferLen = 44 + dataLen;
  const arrayBuffer = new ArrayBuffer(bufferLen);
  const view = new DataView(arrayBuffer);

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLen, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLen, true);

  const channels = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = Math.max(-1, Math.min(1, channels[ch][i]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      view.setInt16(offset, sample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function loadDjBuiltinTrack(deckId, presetKey = 'deep_house', notify = true) {
  const deck = djDecks[deckId];
  if (!deck) return;

  const stem = BUILTIN_DJ_STEMS.find(s => s.id === presetKey) || BUILTIN_DJ_STEMS[0];
  const url = createSyntheticBeatAudio(stem.bpm, stem.id);

  if (deck.audio) {
    try { deck.audio.pause(); } catch(e) {}
  }
  if (deck.track && deck.track.url && String(deck.track.url).startsWith('blob:')) {
    try { URL.revokeObjectURL(deck.track.url); } catch(e) {}
  }

  const track = {
    url: url,
    name: stem.name,
    fullName: stem.name,
    isBuiltin: true
  };

  deck.track = track;
  deck.bpm = stem.bpm;
  deck.audio = new Audio(track.url);
  deck.audio.loop = true;
  deck.audio.playbackRate = deck.pitch;

  bindDjAudioEvents(deckId);
  updateDjDeckUI(deckId);

  if (notify) {
    showToast(`Deck ${deckId.toUpperCase()}: "${stem.name}" geladen! 🎛️`);
  }
}
window.loadDjBuiltinTrack = loadDjBuiltinTrack;

function handleDjDeckUpload(deckId, event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const deck = djDecks[deckId];
  if (!deck) return;

  if (deck.audio) {
    try { deck.audio.pause(); } catch(e) {}
  }
  if (deck.track && deck.track.url && String(deck.track.url).startsWith('blob:')) {
    try { URL.revokeObjectURL(deck.track.url); } catch(e) {}
  }

  const track = {
    url: URL.createObjectURL(file),
    name: file.name.replace(/\.[^/.]+$/, ''),
    fullName: file.name,
    isBuiltin: false
  };

  deck.track = track;
  deck.audio = new Audio(track.url);
  deck.audio.playbackRate = deck.pitch;

  bindDjAudioEvents(deckId);
  updateDjDeckUI(deckId);

  showToast(`Deck ${deckId.toUpperCase()}: "${track.name}" geladen! 🎛️`);
  event.target.value = '';
}
window.handleDjDeckUpload = handleDjDeckUpload;

function bindDjAudioEvents(deckId) {
  const deck = djDecks[deckId];
  if (!deck || !deck.audio) return;

  deck.audio.addEventListener('timeupdate', () => {
    if (!deck.audio || !deck.audio.duration) return;

    if (deck.loopActive && deck.loopEnd > deck.loopStart && deck.audio.currentTime >= deck.loopEnd) {
      deck.audio.currentTime = deck.loopStart;
    }

    deck.jogRotation = (deck.jogRotation + 3) % 360;
    const jog = document.getElementById(`dj-vinyl-disc-${deckId}`);
    if (jog && deck.isPlaying) {
      jog.style.transform = `rotate(${deck.jogRotation}deg)`;
    }

    const timeEl = document.getElementById(`dj-time-deck-${deckId}`);
    if (timeEl) timeEl.innerText = formatAudioTime(deck.audio.currentTime);
    const seekSlider = document.getElementById(`dj-seek-deck-${deckId}`);
    if (seekSlider) seekSlider.value = (deck.audio.currentTime / deck.audio.duration) * 100 || 0;

    if (djAutomix.enabled && !djAutomix.isTransitioning && deck.isPlaying) {
      const remain = deck.audio.duration - deck.audio.currentTime;
      if (remain <= (djAutomix.durationSec || 8) && remain > 0.5) {
        triggerDjAutomixNow();
      }
    }
  });

  deck.audio.addEventListener('ended', () => {
    deck.isPlaying = false;
    updateDjPlayBtnUI(deckId, false);
    if (djAutomix.enabled) {
      triggerDjAutomixNow();
    }
  });
}

function updateDjDeckUI(deckId) {
  const deck = djDecks[deckId];
  if (!deck) return;

  const titleEl = document.getElementById(`dj-title-deck-${deckId}`);
  if (titleEl) titleEl.innerText = deck.track ? deck.track.name : 'Kein Track geladen';

  const bpmEl = document.getElementById(`dj-bpm-deck-${deckId}`);
  if (bpmEl) bpmEl.innerText = `${Math.round(deck.bpm * deck.pitch)} BPM`;

  const pitchEl = document.getElementById(`dj-pitch-val-${deckId}`);
  if (pitchEl) {
    const pct = (deck.pitch - 1.0) * 100;
    pitchEl.innerText = `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%`;
  }
}

function updateDjPlayBtnUI(deckId, isPlaying) {
  const btn = document.getElementById(`dj-play-btn-${deckId}`);
  if (btn) {
    btn.innerHTML = isPlaying ? `<i data-lucide="pause" class="w-3.5 h-3.5"></i>` : `<i data-lucide="play" class="w-3.5 h-3.5"></i>`;
    btn.classList.toggle('ring-2', isPlaying);
    btn.classList.toggle('ring-white/50', isPlaying);
    if (typeof renderLucideIcons === 'function') renderLucideIcons();
  }
}

function toggleDjDeckPlayback(deckId) {
  const deck = djDecks[deckId];
  if (!deck || !deck.audio) {
    loadDjBuiltinTrack(deckId, deckId === 'a' ? 'deep_house' : 'lofi_chill');
    return;
  }

  if (deck.audio.paused) {
    if (typeof initAudioContext === 'function') initAudioContext();
    deck.audio.play().then(() => {
      deck.isPlaying = true;
      updateDjPlayBtnUI(deckId, true);
    }).catch(e => console.warn(e));
  } else {
    deck.audio.pause();
    deck.isPlaying = false;
    updateDjPlayBtnUI(deckId, false);
  }
}
window.toggleDjDeckPlayback = toggleDjDeckPlayback;

function cueDjDeck(deckId) {
  const deck = djDecks[deckId];
  if (!deck || !deck.audio) return;
  deck.audio.currentTime = deck.cueTime || 0;
  if (deck.audio.paused) {
    toggleDjDeckPlayback(deckId);
  }
  playDjSfx('cue_click');
}
window.cueDjDeck = cueDjDeck;

function syncDjDeck(deckId) {
  const otherId = deckId === 'a' ? 'b' : 'a';
  const thisDeck = djDecks[deckId];
  const otherDeck = djDecks[otherId];
  if (!thisDeck || !thisDeck.audio) return;

  if (otherDeck && otherDeck.bpm) {
    thisDeck.bpm = otherDeck.bpm;
    thisDeck.pitch = otherDeck.pitch;
    thisDeck.audio.playbackRate = thisDeck.pitch;

    const slider = document.getElementById(`dj-pitch-slider-${deckId}`);
    if (slider) slider.value = ((thisDeck.pitch - 1.0) * 100).toFixed(1);
    
    updateDjDeckUI(deckId);
    showToast(`Deck ${deckId.toUpperCase()} auf ${Math.round(thisDeck.bpm * thisDeck.pitch)} BPM synchronisiert! ⚡`);
  }
}
window.syncDjDeck = syncDjDeck;

function seekDjDeck(deckId, val) {
  const deck = djDecks[deckId];
  if (!deck || !deck.audio || !deck.audio.duration) return;
  const pct = parseFloat(val);
  deck.audio.currentTime = (pct / 100) * deck.audio.duration;
}
window.seekDjDeck = seekDjDeck;

function setDjPitch(deckId, val) {
  const deck = djDecks[deckId];
  if (!deck) return;
  const pct = parseFloat(val);
  deck.pitch = 1.0 + (pct / 100);
  if (deck.audio) {
    deck.audio.playbackRate = deck.pitch;
  }
  updateDjDeckUI(deckId);
}
window.setDjPitch = setDjPitch;

function nudgeDjPitch(deckId, delta) {
  const slider = document.getElementById(`dj-pitch-slider-${deckId}`);
  if (!slider) return;
  let cur = parseFloat(slider.value) || 0;
  cur = Math.max(-8, Math.min(8, cur + delta));
  slider.value = cur.toFixed(1);
  setDjPitch(deckId, cur);
}
window.nudgeDjPitch = nudgeDjPitch;

function setDjEq(deckId, type, val) {
  const deck = djDecks[deckId];
  if (!deck) return;
  const gain = parseFloat(val);
  if (type === 'low') deck.low = gain;
  if (type === 'mid') deck.mid = gain;
  if (type === 'high') deck.high = gain;
}
window.setDjEq = setDjEq;

function setDjFilter(deckId, val) {
  const deck = djDecks[deckId];
  if (!deck) return;
  deck.filter = parseFloat(val);
  const label = document.getElementById(`dj-filter-val-${deckId}`);
  if (label) {
    if (deck.filter < 0.45) label.innerText = 'LPF';
    else if (deck.filter > 0.55) label.innerText = 'HPF';
    else label.innerText = 'OFF';
  }
}
window.setDjFilter = setDjFilter;

function setDjCrossfader(val) {
  const x = parseFloat(val);
  const gainA = Math.cos(x * 0.5 * Math.PI);
  const gainB = Math.sin(x * 0.5 * Math.PI);
  const master = (typeof soundMasterVolume === 'number') ? soundMasterVolume : 0.5;

  if (djDecks.a && djDecks.a.audio) {
    djDecks.a.audio.volume = Math.max(0, Math.min(1, gainA * master));
  }
  if (djDecks.b && djDecks.b.audio) {
    djDecks.b.audio.volume = Math.max(0, Math.min(1, gainB * master));
  }

  const slider = document.getElementById('dj-crossfader-slider');
  if (slider && parseFloat(slider.value) !== x) {
    slider.value = x;
  }
}
window.setDjCrossfader = setDjCrossfader;

// ============================================================================
// 5. AUTOMIX & SMART SHUFFLE ENGINE
// ============================================================================

function toggleDjAutomix() {
  djAutomix.enabled = !djAutomix.enabled;
  const btn = document.getElementById('dj-automix-toggle-btn');
  if (btn) {
    btn.className = djAutomix.enabled
      ? 'px-2.5 py-1 bg-emerald-500/25 border border-emerald-400/80 text-emerald-200 rounded-xl text-[10px] font-bold transition flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.35)] cursor-pointer'
      : 'px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 rounded-xl text-[10px] font-medium transition flex items-center gap-1.5 cursor-pointer';
  }
  showToast(djAutomix.enabled ? 'Automix Aktiviert! 🎛️⚡ Nahtloser Übergang' : 'Automix Deaktiviert');
}
window.toggleDjAutomix = toggleDjAutomix;

function setDjAutomixDuration(sec) {
  djAutomix.durationSec = parseInt(sec, 10) || 8;
  [4, 8, 16].forEach(s => {
    const b = document.getElementById(`dj-automix-dur-${s}`);
    if (b) {
      b.className = (s === djAutomix.durationSec)
        ? 'px-2 py-0.5 rounded-lg bg-emerald-500/30 text-emerald-200 border border-emerald-400/50 text-[9px] font-bold'
        : 'px-2 py-0.5 rounded-lg bg-white/5 text-gray-400 hover:text-white border border-white/5 text-[9px] font-medium';
    }
  });
}
window.setDjAutomixDuration = setDjAutomixDuration;

function triggerDjAutomixNow() {
  if (djAutomix.isTransitioning) return;
  djAutomix.isTransitioning = true;

  const slider = document.getElementById('dj-crossfader-slider');
  const currentPos = slider ? parseFloat(slider.value) : 0.5;
  const targetDeck = currentPos < 0.5 ? 'b' : 'a';
  const targetPos = targetDeck === 'b' ? 1.0 : 0.0;
  const startPos = currentPos;

  if (!djDecks[targetDeck].isPlaying) {
    toggleDjDeckPlayback(targetDeck);
  }

  const durationMs = (djAutomix.durationSec || 8) * 1000;
  const startTime = performance.now();

  function animateFader(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1.0, elapsed / durationMs);
    const ease = 0.5 - 0.5 * Math.cos(progress * Math.PI);
    const newPos = startPos + (targetPos - startPos) * ease;
    
    setDjCrossfader(newPos);

    if (progress < 1.0) {
      requestAnimationFrame(animateFader);
    } else {
      djAutomix.isTransitioning = false;
      const outgoingDeck = targetDeck === 'b' ? 'a' : 'b';
      if (djDecks[outgoingDeck].isPlaying) {
        toggleDjDeckPlayback(outgoingDeck);
      }
      showToast(`Automix abgeschlossen: Jetzt auf Deck ${targetDeck.toUpperCase()}! 🎧`);
    }
  }

  requestAnimationFrame(animateFader);
  showToast(`Automix Übergang zu Deck ${targetDeck.toUpperCase()} (${djAutomix.durationSec}s) gestartet! 🎛️`);
}
window.triggerDjAutomixNow = triggerDjAutomixNow;

function djShuffleTracks() {
  const stems = [...BUILTIN_DJ_STEMS].sort(() => Math.random() - 0.5);
  loadDjBuiltinTrack('a', stems[0].id, false);
  loadDjBuiltinTrack('b', stems[1].id, false);
  showToast('DJ Shuffle: Frische Stems & Rhythmen geladen! 🔀');
}
window.djShuffleTracks = djShuffleTracks;

// ============================================================================
// 6. HOT CUES, LOOPS & JOGWHEEL INTERACTION
// ============================================================================

function setDjHotCue(deckId, index) {
  const deck = djDecks[deckId];
  if (!deck || !deck.audio) return;
  deck.hotCues[index] = deck.audio.currentTime;
  const pad = document.getElementById(`dj-hotcue-btn-${deckId}-${index}`);
  if (pad) {
    pad.classList.add('bg-amber-400/30', 'border-amber-400', 'text-amber-200');
  }
  showToast(`Deck ${deckId.toUpperCase()}: Hot Cue ${index + 1} bei ${formatAudioTime(deck.audio.currentTime)} gesetzt! 📍`);
}
window.setDjHotCue = setDjHotCue;

function jumpDjHotCue(deckId, index) {
  const deck = djDecks[deckId];
  if (!deck || !deck.audio) return;
  if (deck.hotCues[index] === null) {
    setDjHotCue(deckId, index);
    return;
  }
  deck.audio.currentTime = deck.hotCues[index];
  if (deck.audio.paused) {
    toggleDjDeckPlayback(deckId);
  }
  playDjSfx('cue_click');
}
window.jumpDjHotCue = jumpDjHotCue;

function toggleDjLoop(deckId, beats = 4) {
  const deck = djDecks[deckId];
  if (!deck || !deck.audio) return;

  deck.loopActive = !deck.loopActive;
  deck.loopLength = beats;

  if (deck.loopActive) {
    deck.loopStart = deck.audio.currentTime;
    const beatDuration = 60 / (deck.bpm * deck.pitch);
    deck.loopEnd = deck.loopStart + (beatDuration * beats);
  }

  const loopBtn = document.getElementById(`dj-loop-btn-${deckId}-${beats}`);
  if (loopBtn) {
    loopBtn.classList.toggle('bg-emerald-500/30', deck.loopActive);
    loopBtn.classList.toggle('border-emerald-400', deck.loopActive);
  }
  showToast(`Deck ${deckId.toUpperCase()}: ${beats}-Beat Loop ${deck.loopActive ? 'Aktiv 🔁' : 'Aus'}`);
}
window.toggleDjLoop = toggleDjLoop;

function handleDjJogTouch(deckId, delta) {
  const deck = djDecks[deckId];
  if (!deck || !deck.audio) return;
  deck.audio.currentTime = Math.max(0, deck.audio.currentTime + delta);
  playDjSfx('scratch_mini');
}
window.handleDjJogTouch = handleDjJogTouch;

// ============================================================================
// 7. REAL-TIME DJ SOUND FX
// ============================================================================

function playDjSfx(type) {
  if (typeof initAudioContext === 'function') initAudioContext();
  if (typeof audioCtx === 'undefined' || !audioCtx) return;

  const now = audioCtx.currentTime;
  const dest = (typeof getMasterAudioDestination === 'function') ? (getMasterAudioDestination() || audioCtx.destination) : audioCtx.destination;

  if (type === 'airhorn') {
    const hornPitches = [466.16, 622.25, 932.33];
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
      gain.connect(dest);
      osc.onended = () => { try { osc.disconnect(); gain.disconnect(); } catch(e) {} };
      osc.start(now);
      osc.stop(now + 0.6);
    });
    showToast('📢 AIRHORN BLAST!');
  } else if (type === 'scratch' || type === 'scratch_mini') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(type === 'scratch_mini' ? 400 : 800, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.06);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.12);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.Q.setValueAtTime(3, now);

    const vol = (type === 'scratch_mini' ? 0.15 : 0.35) * (soundMasterVolume || 0.5);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    osc.onended = () => { try { osc.disconnect(); filter.disconnect(); gain.disconnect(); } catch(e) {} };
    osc.start(now);
    osc.stop(now + 0.2);
    if (type !== 'scratch_mini') showToast('⚡ VINYL SCRATCH!');
  } else if (type === 'laser') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.3);

    const vol = 0.35 * (soundMasterVolume || 0.5);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    osc.connect(gain);
    gain.connect(dest);
    osc.onended = () => { try { osc.disconnect(); gain.disconnect(); } catch(e) {} };
    osc.start(now);
    osc.stop(now + 0.35);
    showToast('🚨 LASER SWEEP!');
  } else if (type === 'subdrop') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(34, now + 0.7);

    const vol = 0.55 * (soundMasterVolume || 0.5);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

    osc.connect(gain);
    gain.connect(dest);
    osc.onended = () => { try { osc.disconnect(); gain.disconnect(); } catch(e) {} };
    osc.start(now);
    osc.stop(now + 0.9);
    showToast('💥 808 SUB DROP!');
  } else if (type === 'riser') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 1.2);

    const vol = 0.3 * (soundMasterVolume || 0.5);
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(vol, now + 1.0);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);

    osc.connect(gain);
    gain.connect(dest);
    osc.onended = () => { try { osc.disconnect(); gain.disconnect(); } catch(e) {} };
    osc.start(now);
    osc.stop(now + 1.3);
    showToast('🌪️ NOISE RISER!');
  } else if (type === 'cue_click') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    gain.gain.setValueAtTime(0.2 * (soundMasterVolume || 0.5), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(dest);
    osc.onended = () => { try { osc.disconnect(); gain.disconnect(); } catch(e) {} };
    osc.start(now);
    osc.stop(now + 0.05);
  }
window.playDjSfx = playDjSfx;
if (typeof window !== 'undefined') window.djDecks = djDecks;
if (typeof globalThis !== 'undefined') globalThis.djDecks = djDecks;



function handleUserSoundFile(event) {
  const files = event.target.files; if (!files || files.length === 0) return;
  stopAmbientSound(true);
  
  playlistTracks = Array.from(files).map(file => ({
    url: URL.createObjectURL(file),
    name: file.name
  }));
  
  // Standardmäßig zufällige Wiedergabe (Shuffle) aktivieren falls gewünscht
  if (isPlayerShuffleEnabled && playlistTracks.length > 1) {
    currentTrackIndex = Math.floor(Math.random() * playlistTracks.length);
  } else {
    currentTrackIndex = 0;
  }
  
  const playerContainer = document.getElementById('custom-playlist-player');
  if (playerContainer) playerContainer.classList.remove('hidden');
  
  playTrack(currentTrackIndex);
}

// Integriert Mitzähler und Fortschrittsüberwachung für geladene Tracks
function attachAudioEvents(audio) {
  audio.addEventListener('timeupdate', () => {
    if (activeUserAudio !== audio) return; 
    const pct = (audio.currentTime / audio.duration) * 100 || 0;
    const bar = document.getElementById('player-progress-bar');
    if (bar) bar.style.width = `${pct}%`;
    
    const currentEl = document.getElementById('player-time-current');
    if (currentEl) currentEl.innerText = formatAudioTime(audio.currentTime);
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

// Erlaubt das Klicken/Springen in der interaktiven Fortschrittsleiste
function handleProgressBarClick(event) {
  if (!activeUserAudio) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const width = rect.width;
  const ratio = clickX / width;
  activeUserAudio.currentTime = ratio * activeUserAudio.duration;
}

// Deck-Steuerung zur Wiedergabe geladener Tracks mit 11-Sekunden-Crossfade
function playTrack(index) {
  if (playlistTracks.length === 0) return;
  if (index < 0 || index >= playlistTracks.length) index = 0;
  currentTrackIndex = index;
  
  const track = playlistTracks[currentTrackIndex];
  
  let oldAudio = activeUserAudio;
  
  const audio = new Audio(track.url);
  audio.loop = false;
  audio.volume = 0; // Startet bei Null für einen sanften Crossfade-Einblendeffekt
  activeUserAudio = audio;
  attachAudioEvents(audio);
  
  // Am Ende des Tracks automatisch den nächsten mit Crossfade anstoßen
  audio.addEventListener('ended', () => {
    playNextTrackWithCrossfade();
  });
  
  audio.play().then(() => {
    updatePlayPauseButtonUI(true);
    
    // Sanfter, linearer Crossfade Fade-In über exakt 11 Sekunden (11000ms)
    const targetVolume = soundMasterVolume * 0.7;
    const fadeDuration = 11000; 
    const steps = 55;
    const stepTime = fadeDuration / steps;
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
  }).catch(e => {
    console.error("Fehler beim Abspielen:", e);
  });
  
  // Alten Track parallel über exakt 11 Sekunden (11000ms) ausblenden und stoppen
  if (oldAudio) {
    const fadeDuration = 11000;
    const steps = 55;
    const stepTime = fadeDuration / steps;
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
      } catch(e) {
        clearInterval(fadeOutInterval);
      }
    }, stepTime);
  }
  
  const nameLabel = document.getElementById('user-sound-name');
  if (nameLabel) nameLabel.innerText = "🎵 " + track.name;
  
  renderTrackList(); // Markierung und Liste aktualisieren
  updateSoundscapeUI();
  showToast(tr({ de: "Spiele Track: " + track.name, en: "Playing track: " + track.name, es: "Reproduciendo: " + track.name, el: "Αναπαραγωγή: " + track.name, fr: "Lecture : " + track.name, it: "Riproduzione: " + track.name }));
}

function togglePlaylistPlayback() {
  if (!activeUserAudio) return;
  if (activeUserAudio.paused) {
    activeUserAudio.play();
    updatePlayPauseButtonUI(true);
  } else {
    activeUserAudio.pause();
    updatePlayPauseButtonUI(false);
  }
}

function updatePlayPauseButtonUI(isPlaying) {
  const btn = document.getElementById('player-play-pause-btn');
  if (btn) {
    btn.innerHTML = isPlaying 
      ? '<i data-lucide="pause" class="w-3.5 h-3.5"></i>' 
      : '<i data-lucide="play" class="w-3.5 h-3.5 text-purple-300"></i>';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

// Gleichzeitiger 11-Sekunden-Crossfade und Shuffler
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

function togglePlayerShuffle() {
  isPlayerShuffleEnabled = !isPlayerShuffleEnabled;
  const badge = document.getElementById('player-shuffle-badge');
  const btn = document.getElementById('player-shuffle-toggle-btn');
  if (badge) {
    badge.innerText = isPlayerShuffleEnabled ? "Shuffle On" : "Shuffle Off";
    if (isPlayerShuffleEnabled) {
      badge.className = 'text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase tracking-wider font-mono';
      btn.className = 'p-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 rounded-lg cursor-pointer transition';
    } else {
      badge.className = 'text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 border border-white/10 font-bold uppercase tracking-wider font-mono';
      btn.className = 'p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg cursor-pointer transition';
    }
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function setSoundVolume(val) {
  soundMasterVolume = parseFloat(val);
  
  if (soundGainNode && audioCtx) {
    soundGainNode.gain.setValueAtTime(soundMasterVolume * 1.0, audioCtx.currentTime);
  }
  
  if (activeUserAudio) {
    activeUserAudio.volume = soundMasterVolume * 0.7;
  }
}

// Dezente und professionelle Queue-Ansicht ohne die Bezeichnung Playlist zu verwenden
function renderTrackList() {
  const container = document.getElementById('track-list-container');
  if (!container) return;
  container.innerHTML = '';
  
  playlistTracks.forEach((track, idx) => {
    const item = document.createElement('button');
    const isActive = idx === currentTrackIndex;
    
    item.className = `w-full text-left px-2 py-1.5 rounded text-[10px] transition duration-150 cursor-pointer truncate ${
      isActive 
        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold shadow-inner' 
        : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium'
    }`;
    
    item.onclick = (e) => {
      e.stopPropagation();
      playTrack(idx);
    };
    
    item.innerText = `${idx + 1}. ${track.name}`;
    container.appendChild(item);
  });
}

function updateSoundscapeUI() {
  ['rain', 'ocean', 'campfire', 'birds', 'stream', 'temple', 'cafe', 'clock', 'purr', 'train', 'space', 'arcade', 'waterfall', 'guitarpad', 'monastery', 'keyboard', 'storm', 'frogs'].forEach(st => {
    const btn = document.getElementById("sound-btn-" + st);
    if (btn) {
      if (st === currentSoundType) btn.className = 'p-1.5 bg-blue-500/30 border border-blue-400 rounded-xl text-left text-xs text-white font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm animate-pulse';
      else btn.className = 'p-1.5 bg-white/5 hover:bg-blue-500/20 border border-white/10 rounded-xl text-left text-xs text-gray-200 font-semibold transition cursor-pointer flex items-center gap-1.5';
    }
  });
  const indicator = document.getElementById('soundscape-indicator');
  if (indicator) {
    if (currentSoundType) indicator.classList.remove('hidden');
    else indicator.classList.add('hidden');
  }
}
 

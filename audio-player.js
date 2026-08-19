// ===== AUDIO-PLAYER: Laden & Verwalten der Playlist =====

// Laedt neue Dateien HINZU (statt die bestehende Playlist zu ersetzen), damit nichts
// versehentlich verloren geht. Wenn gerade schon etwas laeuft, wird die Wiedergabe nicht
// unterbrochen - die neuen Tracks werden einfach an die Warteschlange angehaengt.
function handleUserSoundFile(event) {
  const files = event.target.files; if (!files || files.length === 0) return;

  const wasEmpty = playlistTracks.length === 0;
  const newTracks = Array.from(files).map(file => ({
    url: URL.createObjectURL(file),
    name: file.name,
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
      de: `${newTracks.length} Track(s) zur Playlist hinzugefügt`,
      en: `${newTracks.length} track(s) added to playlist`,
      es: `${newTracks.length} pista(s) añadidas a la lista`,
      el: `${newTracks.length} κομμάτια προστέθηκαν στη λίστα`,
      fr: `${newTracks.length} piste(s) ajoutée(s) à la playlist`,
      it: `${newTracks.length} brano/i aggiunti alla playlist`
    }));
  }
  event.target.value = ''; // erlaubt erneutes Auswaehlen derselben Datei(en)
}

// Ermittelt im Hintergrund die Laufzeit eines Tracks, ohne die Wiedergabe zu beeinflussen,
// und aktualisiert danach die Anzeige in der Track-Liste.
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

// Entfernt einen einzelnen Track aus der Playlist. Laeuft der entfernte Track gerade,
// wird automatisch zum naechsten gewechselt (bzw. gestoppt, falls es der letzte war).
function removeTrackFromPlaylist(idx, event) {
  if (event) event.stopPropagation();
  if (idx < 0 || idx >= playlistTracks.length) return;

  const wasPlayingRemoved = idx === currentTrackIndex && activeUserAudio && !activeUserAudio.paused;
  playlistTracks.splice(idx, 1);

  if (playlistTracks.length === 0) {
    clearPlaylist(); return;
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

// Leert die komplette Playlist und stoppt die Wiedergabe.
function clearPlaylist() {
  if (activeUserAudio) { activeUserAudio.pause(); activeUserAudio = null; }
  playlistTracks = []; currentTrackIndex = 0;
  const playerContainer = document.getElementById('custom-playlist-player');
  if (playerContainer) playerContainer.classList.add('hidden');
  updatePlayPauseButtonUI(false);
  renderTrackList();
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

// ===== Deck-Steuerung =====

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

  // Am Ende des Tracks automatisch weiter (abhängig vom Wiederholmodus)
  audio.addEventListener('ended', () => {
    if (playerRepeatMode === 'one') {
      playTrack(currentTrackIndex);
    } else if (playerRepeatMode === 'off' && !isPlayerShuffleEnabled && currentTrackIndex === playlistTracks.length - 1) {
      updatePlayPauseButtonUI(false); // letzter Track, kein Repeat -> stoppen
    } else {
      playNextTrackWithCrossfade();
    }
  });

  audio.play().then(() => {
    updatePlayPauseButtonUI(true);

    // Sanfter, linearer Crossfade Fade-In über exakt 11 Sekunden (11000ms)
    const targetVolume = isPlayerMuted ? 0 : soundMasterVolume * 0.7;
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
      } catch (e) {
        clearInterval(fadeOutInterval);
      }
    }, stepTime);
  }

  const nameLabel = document.getElementById('user-sound-name');
  if (nameLabel) nameLabel.innerText = "🎵 " + track.name;

  renderTrackList(); // Markierung und Liste aktualisieren
  updatePlayerHeaderInfo();
  updateSoundscapeUI();
  showToast(tr({ de: "Spiele Track: " + track.name, en: "Playing track: " + track.name, es: "Reproduciendo: " + track.name, el: "Αναπαραγωγή: " + track.name, fr: "Lecture : " + track.name, it: "Riproduzione: " + track.name }));
}

function togglePlaylistPlayback() {
  if (!activeUserAudio) {
    if (playlistTracks.length > 0) playTrack(currentTrackIndex);
    return;
  }
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
      ? '<i data-lucide="pause" class="w-4 h-4"></i>'
      : '<i data-lucide="play" class="w-4 h-4 text-purple-300"></i>';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
  const activeRow = document.querySelector('#track-list-container [data-track-active="true"] .track-eq-icon');
  if (activeRow) activeRow.classList.toggle('animate-pulse', isPlaying);
}

// Gleichzeitiger 11-Sekunden-Crossfade und Shuffler zum naechsten Track
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

// NEU: Zurueck zum vorherigen Track (bisher fehlte diese Funktion komplett - es gab nur
// einen "Weiter"-Button). Innerhalb der ersten 3 Sekunden eines Tracks springt "Zurueck" zum
// vorherigen Titel, danach (wie bei den meisten Playern ueblich) erst an den Trackanfang.
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

// NEU: Wiederholmodus (Aus -> Alle -> Einzeltitel -> Aus ...), bisher gab es diese
// Funktion gar nicht.
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
    ? 'p-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 rounded-lg cursor-pointer transition'
    : 'p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg cursor-pointer transition';
  btn.title = playerRepeatMode === 'off'
    ? 'Wiederholen: Aus'
    : (playerRepeatMode === 'all' ? 'Wiederholen: Playlist' : 'Wiederholen: Track');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// NEU: eigene Lautstärkeregelung + Mute direkt im Player-Panel (bisher musste man dafür
// in das separate Sounds-Panel wechseln, obwohl die Lautstärke geteilt genutzt wird).
function setSoundVolume(val) {
  soundMasterVolume = parseFloat(val);
  isPlayerMuted = false;

  if (soundGainNode && audioCtx) {
    soundGainNode.gain.setValueAtTime(soundMasterVolume * 1.0, audioCtx.currentTime);
  }
  if (activeUserAudio) {
    activeUserAudio.volume = soundMasterVolume * 0.7;
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
    if (activeUserAudio) activeUserAudio.volume = soundMasterVolume * 0.7;
    if (soundGainNode && audioCtx) soundGainNode.gain.setValueAtTime(soundMasterVolume, audioCtx.currentTime);
  }
  syncVolumeSlidersUI();
}

// Haelt beide Lautstärkeregler (Sounds-Panel & Musik-Panel) sowie den Mute-Button synchron.
function syncVolumeSlidersUI() {
  document.querySelectorAll('.master-volume-slider').forEach(slider => {
    slider.value = soundMasterVolume;
  });
  const muteBtn = document.getElementById('player-mute-toggle-btn');
  if (muteBtn) {
    muteBtn.innerHTML = isPlayerMuted
      ? '<i data-lucide="volume-x" class="w-3.5 h-3.5"></i>'
      : '<i data-lucide="volume-2" class="w-3.5 h-3.5"></i>';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

// ===== Playlist-Anzeige =====

// Professionelle, gut sichtbare Queue-Ansicht mit Cover-Icon, Dauer, Drag&Drop-Sortierung
// und Entfernen-Button pro Track.
function renderTrackList() {
  const container = document.getElementById('track-list-container');
  if (!container) return;
  container.innerHTML = '';

  if (playlistTracks.length === 0) {
    container.innerHTML = `<div class="text-center text-[10px] text-gray-500 py-3 italic">${tr({ de: 'Noch keine Tracks geladen', en: 'No tracks loaded yet', es: 'Aún no hay pistas cargadas', el: 'Δεν έχουν φορτωθεί κομμάτια', fr: 'Aucune piste chargée', it: 'Nessun brano caricato' })}</div>`;
    return;
  }

  playlistTracks.forEach((track, idx) => {
    const isActive = idx === currentTrackIndex;
    const item = document.createElement('div');
    item.draggable = true;
    item.dataset.trackActive = isActive ? 'true' : 'false';
    item.className = `group flex items-center gap-1.5 w-full px-2 py-1.5 rounded-lg text-[10px] transition duration-150 cursor-grab active:cursor-grabbing ${
      isActive
        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold shadow-inner'
        : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium border border-transparent'
    }`;

    item.ondragstart = (e) => { draggedTrackIndex = idx; e.dataTransfer.effectAllowed = 'move'; item.classList.add('opacity-40'); };
    item.ondragend = () => { item.classList.remove('opacity-40'); };
    item.ondragover = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
    item.ondrop = (e) => {
      e.preventDefault();
      if (draggedTrackIndex === null || draggedTrackIndex === idx) return;
      // Track-Referenz des aktuell spielenden Titels merken, um seinen neuen Index nach dem
      // Verschieben zuverlässig wiederzufinden (robuster als reine Index-Arithmetik).
      const activeTrackRef = playlistTracks[currentTrackIndex];
      const [moved] = playlistTracks.splice(draggedTrackIndex, 1);
      let insertAt = draggedTrackIndex < idx ? idx - 1 : idx;
      playlistTracks.splice(insertAt, 0, moved);
      currentTrackIndex = playlistTracks.indexOf(activeTrackRef);
      draggedTrackIndex = null;
      renderTrackList();
    };

    const durationLabel = track.duration ? formatAudioTime(track.duration) : '--:--';

    item.innerHTML = `
      <i data-lucide="grip-vertical" class="w-3 h-3 text-gray-600 shrink-0 opacity-0 group-hover:opacity-100 transition"></i>
      <i data-lucide="${isActive ? 'volume-2' : 'music'}" class="track-eq-icon w-3 h-3 shrink-0 ${isActive ? 'text-purple-300 animate-pulse' : 'text-gray-600'}"></i>
      <span class="flex-1 min-w-0 truncate" title="${track.name.replace(/"/g, '&quot;')}">${idx + 1}. ${track.name}</span>
      <span class="shrink-0 font-mono text-[9px] text-gray-500">${durationLabel}</span>
      <button class="shrink-0 p-0.5 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition cursor-pointer" title="Aus Playlist entfernen">
        <i data-lucide="x" class="w-3 h-3 pointer-events-none"></i>
      </button>
    `;

    item.querySelector('span.flex-1').onclick = (e) => { e.stopPropagation(); playTrack(idx); };
    item.querySelector('button').onclick = (e) => removeTrackFromPlaylist(idx, e);

    container.appendChild(item);
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// NEU: Kopfzeile des Players zeigt Trackanzahl und Gesamtspieldauer der Playlist an.
function updatePlayerHeaderInfo() {
  const countEl = document.getElementById('player-track-count');
  if (!countEl) return;
  const count = playlistTracks.length;
  if (count === 0) { countEl.innerText = ''; return; }
  const totalSecs = playlistTracks.reduce((sum, t) => sum + (t.duration || 0), 0);
  const totalLabel = totalSecs > 0 ? ` · ${formatAudioTime(totalSecs)}` : '';
  countEl.innerText = `${count} ${count === 1 ? 'Track' : 'Tracks'}${totalLabel}`;
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

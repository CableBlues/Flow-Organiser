// Globale Audio-Variablen
var audioCtx = null;
var currentSoundType = null;
var soundGainNode = null;
var soundOscillators = [];
var soundMasterVolume = 0.5;
var activeUserAudio = null; // Speichert das aktive HTML5-Audio-Objekt
var localSoundCache = {}; 
var activeNodes = [];
var activeTimeouts = [];
var noiseBuffers = {};
var pendingCrossfadeNodes = [];
var pendingCrossfadeGains = [];

// Playlist-Zustände für eigene Tracks
var playlistTracks = [];
var currentTrackIndex = 0;
var isPlayerShuffleEnabled = true; // standardmäßig aktiv (zufällige Wiedergabe)
var playerRepeatMode = 'all'; // 'off' | 'all' | 'one'
var isPlayerMuted = false;
var volumeBeforeMute = 0.5;
var draggedTrackIndex = null;
var masterGainNode = null;

function getMasterAudioDestination() {
  initAudioContext();
  if (!audioCtx) return null;
  if (!masterGainNode) {
    masterGainNode = audioCtx.createGain();
    masterGainNode.gain.setValueAtTime(1.0, audioCtx.currentTime);
    masterGainNode.connect(audioCtx.destination);
  }
  return masterGainNode;
}
window.getMasterAudioDestination = getMasterAudioDestination;

function initAudioContext() {
  try {
    if (!audioCtx || audioCtx.state === 'closed') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    if (audioCtx && !masterGainNode) {
      masterGainNode = audioCtx.createGain();
      masterGainNode.gain.setValueAtTime(1.0, audioCtx.currentTime);
      masterGainNode.connect(audioCtx.destination);
    }
  } catch (e) {
    console.warn("AudioContext init warning:", e);
  }
}

// Mobiler Audio-Unlock für iOS Safari & Android beim ersten Benutzerkontakt
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  const unlockMobileAudio = () => {
    initAudioContext();
    if (typeof window.removeEventListener === 'function') {
      window.removeEventListener('touchstart', unlockMobileAudio);
      window.removeEventListener('touchend', unlockMobileAudio);
      window.removeEventListener('pointerdown', unlockMobileAudio);
      window.removeEventListener('click', unlockMobileAudio);
    }
  };
  window.addEventListener('touchstart', unlockMobileAudio, { passive: true, once: true });
  window.addEventListener('touchend', unlockMobileAudio, { passive: true, once: true });
  window.addEventListener('pointerdown', unlockMobileAudio, { passive: true, once: true });
  window.addEventListener('click', unlockMobileAudio, { passive: true, once: true });

  // Nahtloses Reaktivieren beim Zurückkehren aus dem Hintergrund (iOS Safari & Android)
  if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && audioCtx && audioCtx.state === 'suspended' && (currentSoundType || (activeUserAudio && !activeUserAudio.paused))) {
        audioCtx.resume().catch(() => {});
      }
    });
  }
}

// Hilfsfunktion: Erzeugt lückenlose Rausch-Loops im Arbeitsspeicher
function getNoiseBuffer(type) {
  initAudioContext();
  if (!audioCtx) return null;
  if (noiseBuffers[type]) return noiseBuffers[type];
  
  const sampleRate = audioCtx.sampleRate || 44100;
  const bufferSize = sampleRate * 4;
  const buffer = audioCtx.createBuffer(2, bufferSize, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);
  
  if (type === 'pink') {
    let b0_l=0, b1_l=0, b2_l=0, b3_l=0, b4_l=0, b5_l=0, b6_l=0;
    let b0_r=0, b1_r=0, b2_r=0, b3_r=0, b4_r=0, b5_r=0, b6_r=0;
    for (let i = 0; i < bufferSize; i++) {
      let white_l = Math.random() * 2 - 1;
      b0_l = 0.99886 * b0_l + white_l * 0.0555179;
      b1_l = 0.99332 * b1_l + white_l * 0.0750759;
      b2_l = 0.96900 * b2_l + white_l * 0.1538520;
      b3_l = 0.86650 * b3_l + white_l * 0.3104856;
      b4_l = 0.55000 * b4_l + white_l * 0.5329522;
      b5_l = -0.7616 * b5_l - white_l * 0.0168980;
      left[i] = (b0_l + b1_l + b2_l + b3_l + b4_l + b5_l + b6_l + white_l * 0.5362) * 0.11;
      b6_l = white_l * 0.115926;
      
      let white_r = Math.random() * 2 - 1;
      b0_r = 0.99886 * b0_r + white_r * 0.0555179;
      b1_r = 0.99332 * b1_r + white_r * 0.0750759;
      b2_r = 0.96900 * b2_r + white_r * 0.1538520;
      b3_r = 0.86650 * b3_r + white_r * 0.3104856;
      b4_r = 0.55000 * b4_r + white_r * 0.5329522;
      b5_r = -0.7616 * b5_r - white_r * 0.0168980;
      right[i] = (b0_r + b1_r + b2_r + b3_r + b4_r + b5_r + b6_r + white_r * 0.5362) * 0.11;
      b6_r = white_r * 0.115926;
    }
  } else if (type === 'brown') {
    let lastOut_l = 0.0, lastOut_r = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      let white_l = Math.random() * 2 - 1;
      left[i] = (lastOut_l + (0.02 * white_l)) / 1.02;
      lastOut_l = left[i];
      left[i] *= 3.5;
      
      let white_r = Math.random() * 2 - 1;
      right[i] = (lastOut_r + (0.02 * white_r)) / 1.02;
      lastOut_r = right[i];
      right[i] *= 3.5;
    }
  }
  noiseBuffers[type] = buffer;
  return buffer;
}

function clearActiveTimeouts() {
  activeTimeouts.forEach(clearTimeout);
  activeTimeouts = [];
}

// Hauptfunktion zum Abspielen der 18 Naturgeräusche (mit integriertem Crossfade-Support)
function playAmbientSound(type, crossfade = false) {
  initAudioContext();
  if (!audioCtx) return;

  if (crossfade && currentSoundType) {
    const oldGain = soundGainNode;
    const oldNodes = [...activeNodes];

    if (oldGain) {
      pendingCrossfadeGains.push(oldGain);
      const now = audioCtx.currentTime;
      try {
        oldGain.gain.cancelScheduledValues(now);
        oldGain.gain.setValueAtTime(oldGain.gain.value, now);
        oldGain.gain.linearRampToValueAtTime(0.0001, now + 4.0); // Blendet den alten Sound aus
      } catch (e) {
        console.warn('[Audio] Crossfade ramp error:', e);
      }
    }

    if (oldNodes.length > 0) {
      pendingCrossfadeNodes.push(...oldNodes);
    }

    const crossTimeout = setTimeout(() => {
      oldNodes.forEach(node => {
        try { if (typeof node.stop === 'function') node.stop(0); } catch (e) { console.warn('[Audio] crossfade oldNode.stop error:', e); }
        try { node.disconnect(); } catch (e) { console.warn('[Audio] crossfade oldNode.disconnect error:', e); }
      });
      try { if (oldGain) oldGain.disconnect(); } catch (e) { console.warn('[Audio] crossfade oldGain.disconnect error:', e); }
      
      pendingCrossfadeNodes = pendingCrossfadeNodes.filter(n => !oldNodes.includes(n));
      pendingCrossfadeGains = pendingCrossfadeGains.filter(g => g !== oldGain);
    }, 4200);
    activeTimeouts.push(crossTimeout);

    activeNodes = [];
    currentSoundType = type;

    soundGainNode = audioCtx.createGain();
    soundGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    soundGainNode.gain.linearRampToValueAtTime(soundMasterVolume * 1.0, audioCtx.currentTime + 4.0); // Auf volle Lautstärke
    soundGainNode.connect(getMasterAudioDestination() || audioCtx.destination);
  } else {
    stopAmbientSound(true);
    currentSoundType = type;

    soundGainNode = audioCtx.createGain();
    soundGainNode.gain.setValueAtTime(soundMasterVolume * 1.0, audioCtx.currentTime);
    soundGainNode.connect(getMasterAudioDestination() || audioCtx.destination);
  }

  // Generatoren anstoßen
  startAmbientGeneratorForType(type);

  updateSoundscapeUI();
  lastSelectedSound = type;
}

// Ducking-Regler auf 1.0 festgeschrieben (Gleiche Lautstärke)
function duckAmbientVolume(ratio) {
  if (soundGainNode && audioCtx) {
    try {
      soundGainNode.gain.setValueAtTime(soundGainNode.gain.value, audioCtx.currentTime);
      soundGainNode.gain.linearRampToValueAtTime(soundMasterVolume * 1.0, audioCtx.currentTime + 0.35);
    } catch (e) {
      console.warn('[Audio] duckAmbientVolume error:', e);
    }
  }
  if (activeUserAudio) {
    try { activeUserAudio.volume = soundMasterVolume * 0.7; } catch (e) { console.warn('[Audio] duck activeUserAudio error:', e); }
  }
}

function restoreAmbientVolume() {
  if (soundGainNode && audioCtx) {
    try {
      soundGainNode.gain.setValueAtTime(soundGainNode.gain.value, audioCtx.currentTime);
      soundGainNode.gain.linearRampToValueAtTime(soundMasterVolume * 1.0, audioCtx.currentTime + 0.6);
    } catch (e) {
      console.warn('[Audio] restoreAmbientVolume error:', e);
    }
  }
  if (activeUserAudio) {
    try { activeUserAudio.volume = soundMasterVolume * 0.7; } catch (e) { console.warn('[Audio] restore activeUserAudio error:', e); }
  }
}

// Sanfter, gleitender Lautstärke-Fade-Out am Sitzungsende
function fadeOutAmbientSound(durationSeconds = 4.5) {
  if (soundGainNode && audioCtx) {
    try {
      const now = audioCtx.currentTime;
      soundGainNode.gain.setValueAtTime(soundGainNode.gain.value, now);
      soundGainNode.gain.linearRampToValueAtTime(0.0001, now + durationSeconds);
    } catch (e) {
      console.warn('[Audio] Fade-Out Fehler:', e);
    }
  }
  if (activeUserAudio) {
    let steps = 25;
    let stepTime = (durationSeconds * 1000) / steps;
    let currentVol = activeUserAudio.volume;
    let volStep = currentVol / steps;
    let fadeInterval = setInterval(() => {
      if (activeUserAudio && activeUserAudio.volume > volStep) {
        activeUserAudio.volume -= volStep;
      } else {
        clearInterval(fadeInterval);
        try { if (activeUserAudio) activeUserAudio.pause(); } catch (e) { console.warn('[Audio] fadeOut activeUserAudio.pause error:', e); }
      }
    }, stepTime);
  }
  
  setTimeout(() => {
    stopAmbientSound(true); 
  }, durationSeconds * 1000 + 100);
}

// Fröhliche Dur-Erfolgs-Jingles (C-Dur / F-Dur / G-Dur Arpeggios mit glockenreinem Kalimba- / Marimba-Charakter)
function playCheerfulSuccessJingle() {
  initAudioContext();
  if (!audioCtx || isPlayerMuted) return;
  try {
    const now = audioCtx.currentTime;
    // Harmonische Dur-Akkordfolgen zur Auswahl
    const chordProgressions = [
      [523.25, 659.25, 783.99, 1046.50], // C5, E5, G5, C6 (C-Dur)
      [587.33, 739.99, 880.00, 1174.66], // D5, F#5, A5, D6 (D-Dur)
      [698.46, 880.00, 1046.50, 1396.91], // F5, A5, C6, F6 (F-Dur)
      [783.99, 987.77, 1174.66, 1567.98]  // G5, B5, D6, G6 (G-Dur)
    ];
    const notes = chordProgressions[Math.floor(Math.random() * chordProgressions.length)];
    
    notes.forEach((freq, i) => {
      const startTime = now + (i * 0.065);
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      
      const vol = 0.22 * (soundMasterVolume || 0.5);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  } catch (e) {
    console.warn('[Audio] playCheerfulSuccessJingle warning:', e);
  }
}
window.playCheerfulSuccessJingle = playCheerfulSuccessJingle;

function triggerHapticFeedback(pattern = [15, 30, 15]) {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch (e) {
    // Haptik nicht unterstützt oder geblockt
  }
}
window.triggerHapticFeedback = triggerHapticFeedback;

function updateSoundscapeUI() {
  const sounds = [
    'piano', 'lofi', 'chimes', 'space', 'guitar', 'singingbowl', 'musicbox',
    'breeze', 'campfire', 'birds', 'cafe', 'clock', 'lofi_sunshine', 'summer_meadow',
    'bossa_nova', 'techno', 'drumnbass', 'afrobeats', 'swing', 'jazz_piano', 'rhodes', 'hypnotic_riff'
  ];
  sounds.forEach(st => {
    const btn = document.getElementById("sound-btn-" + st);
    if (btn) {
      if (typeof currentSoundType !== 'undefined' && st === currentSoundType) {
        btn.className = 'p-1.5 bg-purple-500/30 border border-purple-400 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5 shadow-[0_0_12px_rgba(168,85,247,0.3)] animate-pulse';
      } else {
        btn.className = 'p-1.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 rounded-xl text-left transition cursor-pointer flex items-center gap-1.5 min-w-0 h-8.5';
      }
    }
  });
  const indicator = document.getElementById('soundscape-indicator');
  if (indicator) {
    if (typeof currentSoundType !== 'undefined' && currentSoundType) indicator.classList.remove('hidden');
    else indicator.classList.add('hidden');
  }
}
window.updateSoundscapeUI = updateSoundscapeUI;


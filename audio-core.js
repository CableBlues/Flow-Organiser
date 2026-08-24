// Globale Audio-Variablen
let audioCtx = null;
let currentSoundType = null;
let soundGainNode = null;
let soundOscillators = [];
let soundMasterVolume = 0.5;
let activeUserAudio = null; // Speichert das aktive HTML5-Audio-Objekt
let localSoundCache = {}; 
let activeNodes = [];
let activeTimeouts = [];
let noiseBuffers = {};

// Playlist-Zustände für eigene Tracks
let playlistTracks = [];
let currentTrackIndex = 0;
let isPlayerShuffleEnabled = true; // standardmäßig aktiv (zufällige Wiedergabe)
let playerRepeatMode = 'all'; // 'off' | 'all' | 'one'
let isPlayerMuted = false;
let volumeBeforeMute = 0.5;
let draggedTrackIndex = null;

function initAudioContext() {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } catch (e) {
    console.error("AudioContext konnte nicht initialisiert werden:", e);
  }
}

// Mobiler Audio-Unlock für iOS Safari & Android beim ersten Benutzerkontakt
if (typeof window !== 'undefined') {
  const unlockMobileAudio = () => {
    initAudioContext();
    window.removeEventListener('touchstart', unlockMobileAudio);
    window.removeEventListener('touchend', unlockMobileAudio);
    window.removeEventListener('pointerdown', unlockMobileAudio);
    window.removeEventListener('click', unlockMobileAudio);
  };
  window.addEventListener('touchstart', unlockMobileAudio, { passive: true, once: true });
  window.addEventListener('touchend', unlockMobileAudio, { passive: true, once: true });
  window.addEventListener('pointerdown', unlockMobileAudio, { passive: true, once: true });
  window.addEventListener('click', unlockMobileAudio, { passive: true, once: true });
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
      const now = audioCtx.currentTime;
      oldGain.gain.setValueAtTime(oldGain.gain.value, now);
      oldGain.gain.linearRampToValueAtTime(0.0001, now + 4.0); // Blendet den alten Sound aus
    }

    setTimeout(() => {
      oldNodes.forEach(node => {
        try { node.stop(); } catch(e) {}
        try { node.disconnect(); } catch(e) {}
      });
      try { oldGain.disconnect(); } catch(e) {}
    }, 4200);

    activeNodes = [];
    currentSoundType = type;

    soundGainNode = audioCtx.createGain();
    soundGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    soundGainNode.gain.linearRampToValueAtTime(soundMasterVolume * 1.0, audioCtx.currentTime + 4.0); // Auf volle Lautstärke
    soundGainNode.connect(audioCtx.destination);
  } else {
    stopAmbientSound(true);
    currentSoundType = type;

    soundGainNode = audioCtx.createGain();
    soundGainNode.gain.setValueAtTime(soundMasterVolume * 1.0, audioCtx.currentTime);
    soundGainNode.connect(audioCtx.destination);
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
    } catch(e) {}
  }
  if (activeUserAudio) {
    try { activeUserAudio.volume = soundMasterVolume * 0.7; } catch(e) {}
  }
}

function restoreAmbientVolume() {
  if (soundGainNode && audioCtx) {
    try {
      soundGainNode.gain.setValueAtTime(soundGainNode.gain.value, audioCtx.currentTime);
      soundGainNode.gain.linearRampToValueAtTime(soundMasterVolume * 1.0, audioCtx.currentTime + 0.6);
    } catch(e) {}
  }
  if (activeUserAudio) {
    try { activeUserAudio.volume = soundMasterVolume * 0.7; } catch(e) {}
  }
}

// Sanfter, gleitender Lautstärke-Fade-Out am Sitzungsende
function fadeOutAmbientSound(durationSeconds = 4.5) {
  if (soundGainNode && audioCtx) {
    try {
      const now = audioCtx.currentTime;
      soundGainNode.gain.setValueAtTime(soundGainNode.gain.value, now);
      soundGainNode.gain.linearRampToValueAtTime(0.0001, now + durationSeconds);
    } catch(e) {
      console.error("Fade-Out Fehler:", e);
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
        try { if (activeUserAudio) activeUserAudio.pause(); } catch(e) {}
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
  } catch (e) {}
}
window.playCheerfulSuccessJingle = playCheerfulSuccessJingle;

// Globale Audio-Variablen
let audioCtx = null;
let currentSoundType = null;
let soundGainNode = null;
let soundOscillators = [];
let soundMasterVolume = 0.5;
let activeUserAudio = null; // Speichert das aktive HTML5-Audio-Objekt (Eigene MP3s)
let localSoundCache = {}; // Cache für bereits generierte Audio-Data-URIs
let activeNodes = [];
let activeTimeouts = [];
let noiseBuffers = {};

// Playlist-Zustände für eigene Musiktracks
let playlistTracks = [];
let currentTrackIndex = 0;

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
  } else if (type === 'white_static') {
    for (let i = 0; i < bufferSize; i++) {
      left[i] = (Math.random() * 2 - 1) * 0.15;
      right[i] = (Math.random() * 2 - 1) * 0.15;
    }
  }
  noiseBuffers[type] = buffer;
  return buffer;
}

function clearActiveTimeouts() {
  activeTimeouts.forEach(clearTimeout);
  activeTimeouts = [];
}

// Hauptfunktion zum lückenlosen Abspielen der Naturgeräusche
function playAmbientSound(type) {
  stopAmbientSound(true);
  currentSoundType = type;

  initAudioContext();
  if (!audioCtx) return;

  soundGainNode = audioCtx.createGain();
  let baseVolume = 0.45;
  if (type === 'alpha') baseVolume = 0.25;
  if (type === 'ocean') baseVolume = 0.55;
  if (type === 'fire') baseVolume = 0.5;

  soundGainNode.gain.setValueAtTime(soundMasterVolume * baseVolume, audioCtx.currentTime);
  soundGainNode.connect(audioCtx.destination);

  if (type === 'rain') {
    const source = audioCtx.createBufferSource();
    source.buffer = getNoiseBuffer('pink');
    source.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, audioCtx.currentTime);

    source.connect(filter);
    filter.connect(soundGainNode);
    source.start();
    activeNodes.push(source);

  } else if (type === 'ocean') {
    const source = audioCtx.createBufferSource();
    source.buffer = getNoiseBuffer('brown');
    source.loop = true;

    const waveGain = audioCtx.createGain();
    waveGain.gain.setValueAtTime(0.5, audioCtx.currentTime);

    const lfo = audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.08, audioCtx.currentTime);

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(0.35, audioCtx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    source.connect(waveGain);
    waveGain.connect(soundGainNode);

    lfo.start();
    source.start();
    activeNodes.push(lfo, source);

  } else if (type === 'alpha') {
    const oscL = audioCtx.createOscillator();
    const oscR = audioCtx.createOscillator();
    const merger = audioCtx.createChannelMerger(2);

    oscL.frequency.setValueAtTime(200, audioCtx.currentTime);
    oscR.frequency.setValueAtTime(210, audioCtx.currentTime);

    const pad1 = audioCtx.createOscillator();
    const pad2 = audioCtx.createOscillator();
    const padFilter = audioCtx.createBiquadFilter();
    const padGain = audioCtx.createGain();

    pad1.type = 'triangle';
    pad2.type = 'triangle';
    pad1.frequency.setValueAtTime(100, audioCtx.currentTime);
    pad2.frequency.setValueAtTime(150, audioCtx.currentTime);

    padFilter.type = 'lowpass';
    padFilter.frequency.setValueAtTime(110, audioCtx.currentTime);
    padGain.gain.setValueAtTime(0.3, audioCtx.currentTime);

    pad1.connect(padFilter);
    pad2.connect(padFilter);
    padFilter.connect(padGain);

    oscL.connect(merger, 0, 0);
    oscR.connect(merger, 0, 1);
    padGain.connect(merger, 0, 0);
    padGain.connect(merger, 0, 1);

    merger.connect(soundGainNode);

    oscL.start();
    oscR.start();
    pad1.start();
    pad2.start();
    activeNodes.push(oscL, oscR, pad1, pad2);

  } else if (type === 'wind') {
    const source = audioCtx.createBufferSource();
    source.buffer = getNoiseBuffer('pink');
    source.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(2.2, audioCtx.currentTime);

    const lfo = audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.06, audioCtx.currentTime);

    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(260, audioCtx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    filter.frequency.setValueAtTime(650, audioCtx.currentTime);

    source.connect(filter);
    filter.connect(soundGainNode);

    lfo.start();
    source.start();
    activeNodes.push(lfo, source);

  } else if (type === 'birds') { // Waldgezwitscher (Vögel)
    const source = audioCtx.createBufferSource();
    source.buffer = getNoiseBuffer('pink');
    source.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, audioCtx.currentTime);

    source.connect(filter);
    filter.connect(soundGainNode);
    source.start();
    activeNodes.push(source);

    scheduleBird();

  } else if (type === 'thunder') { // Gewitter
    const source = audioCtx.createBufferSource();
    source.buffer = getNoiseBuffer('pink');
    source.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, audioCtx.currentTime);

    source.connect(filter);
    filter.connect(soundGainNode);
    source.start();
    activeNodes.push(source);

    scheduleThunder();

  } else if (type === 'fire') {
    const source = audioCtx.createBufferSource();
    source.buffer = getNoiseBuffer('brown');
    source.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, audioCtx.currentTime);

    source.connect(filter);
    filter.connect(soundGainNode);
    source.start();
    activeNodes.push(source);

    scheduleCrackle();

  } else if (type === 'cafe') { // Cozy Café
    const source = audioCtx.createBufferSource();
    source.buffer = getNoiseBuffer('pink');
    source.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, audioCtx.currentTime);

    source.connect(filter);
    filter.connect(soundGainNode);
    source.start();
    activeNodes.push(source);

    scheduleClink();

  } else if (type === 'crickets') { // Sommerwiese (Grillen)
    const source = audioCtx.createBufferSource();
    source.buffer = getNoiseBuffer('pink');
    source.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, audioCtx.currentTime);

    source.connect(filter);
    filter.connect(soundGainNode);
    source.start();
    activeNodes.push(source);

    scheduleCricket();

  } else if (type === 'white') { // 9. Weißes Rauschen
    const source = audioCtx.createBufferSource();
    source.buffer = getNoiseBuffer('white_static');
    source.loop = true;
    source.connect(soundGainNode);
    source.start();
    activeNodes.push(source);

  } else if (type === 'purr') { // 10. Katzen-Schnurren
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    const purrGain = audioCtx.createGain();
    
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(45, audioCtx.currentTime);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(90, audioCtx.currentTime);
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(80, audioCtx.currentTime);
    
    // Schnurr-Vibrato (ca. 0.28Hz Atemrhythmus)
    lfo.frequency.setValueAtTime(0.28, audioCtx.currentTime);
    lfoGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    purrGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    
    lfo.connect(lfoGain);
    lfoGain.connect(purrGain.gain);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(purrGain);
    purrGain.connect(soundGainNode);
    
    lfo.start();
    osc1.start();
    osc2.start();
    activeNodes.push(lfo, osc1, osc2);

  } else if (type === 'jungle') { // 11. Dschungel-Nacht
    const source = audioCtx.createBufferSource();
    source.buffer = getNoiseBuffer('pink');
    source.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, audioCtx.currentTime);

    source.connect(filter);
    filter.connect(soundGainNode);
    source.start();
    activeNodes.push(source);

    scheduleJungleSounds();

  } else if (type === 'train') { // 12. Zugfahrt
    const source = audioCtx.createBufferSource();
    source.buffer = getNoiseBuffer('brown');
    source.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, audioCtx.currentTime);

    source.connect(filter);
    filter.connect(soundGainNode);
    source.start();
    activeNodes.push(source);

    scheduleTrain();

  } else if (type === 'library') { // 13. Bibliothek
    const source = audioCtx.createBufferSource();
    source.buffer = getNoiseBuffer('pink');
    source.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, audioCtx.currentTime);

    source.connect(filter);
    filter.connect(soundGainNode);
    source.start();
    activeNodes.push(source);

    schedulePageRustle();

  } else if (type === 'keyboard') { // 14. Tastatur-Tippen
    const source = audioCtx.createBufferSource();
    source.buffer = getNoiseBuffer('pink');
    source.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, audioCtx.currentTime);

    source.connect(filter);
    filter.connect(soundGainNode);
    source.start();
    activeNodes.push(source);

    scheduleTypeClicks();

  } else if (type === 'spaceship') { // 15. Spaceship
    const osc = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const waveGain = audioCtx.createGain();
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(75, audioCtx.currentTime);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(112.5, audioCtx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, audioCtx.currentTime);
    waveGain.gain.setValueAtTime(0.4, audioCtx.currentTime);

    lfo.frequency.setValueAtTime(0.15, audioCtx.currentTime);
    lfoGain.gain.setValueAtTime(0.15, audioCtx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(soundGainNode);

    lfo.start();
    osc.start();
    osc2.start();
    activeNodes.push(lfo, osc, osc2);

  } else if (type === 'sub') { // 16. Unterwasser (Submarine)
    const source = audioCtx.createBufferSource();
    source.buffer = getNoiseBuffer('brown');
    source.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(90, audioCtx.currentTime);

    source.connect(filter);
    filter.connect(soundGainNode);
    source.start();
    activeNodes.push(source);

    scheduleUnderwaterBubbles();
  }

  updateSoundscapeUI();
  
  // Letzten gespielten Sound im state merken
  lastSelectedSound = type;
  
  const toastLabel = { 
    de: 'Focus Sound gestartet 🎧', 
    en: 'Focus Sound started 🎧', 
    es: 'Sonido de enfoque iniciado 🎧', 
    el: 'Ήχος εστίασης ξεκίνησε 🎧' 
  }[currentLang] || 'Sound started 🎧';
  showToast(toastLabel);
}

// --- PROZEDURALE SOUND-BERECHNER ---

function scheduleThunder() {
  if (currentSoundType !== 'thunder') return;
  let timeout = setTimeout(() => {
    playThunder();
    scheduleThunder();
  }, 9000 + Math.random() * 14000);
  activeTimeouts.push(timeout);
}

function playThunder() {
  if (!audioCtx || currentSoundType !== 'thunder') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(40 + Math.random() * 25, now);
  
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(75, now);
  filter.Q.setValueAtTime(4, now);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(soundGainNode);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.35 + Math.random() * 0.35, now + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 3.5 + Math.random() * 2.0);

  osc.start(now);
  osc.stop(now + 6.0);
}

function scheduleBird() {
  if (currentSoundType !== 'birds') return;
  let timeout = setTimeout(() => {
    playBird();
    scheduleBird();
  }, 2200 + Math.random() * 3800);
  activeTimeouts.push(timeout);
}

function playBird() {
  if (!audioCtx || currentSoundType !== 'birds') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc2.type = 'sine';

  let baseFreq = 2200 + Math.random() * 900;
  osc.frequency.setValueAtTime(baseFreq, now);
  osc2.frequency.setValueAtTime(baseFreq * 1.5, now);

  osc.frequency.linearRampToValueAtTime(baseFreq + 600, now + 0.15);
  osc.frequency.exponentialRampToValueAtTime(baseFreq - 150, now + 0.3);
  osc2.frequency.linearRampToValueAtTime(baseFreq * 1.5 + 400, now + 0.15);
  osc2.frequency.exponentialRampToValueAtTime(baseFreq * 1.5 - 150, now + 0.3);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.04, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

  const panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
  osc.connect(gain);
  osc2.connect(gain);

  if (panner) {
    panner.pan.setValueAtTime(Math.random() * 1.6 - 0.8, now);
    gain.connect(panner);
    panner.connect(soundGainNode);
  } else {
    gain.connect(soundGainNode);
  }

  osc.start(now);
  osc2.start(now);
  osc.stop(now + 0.35);
  osc2.stop(now + 0.35);
}

function scheduleCrackle() {
  if (currentSoundType !== 'fire') return;
  let timeout = setTimeout(() => {
    playCrackle();
    scheduleCrackle();
  }, 40 + Math.random() * 260);
  activeTimeouts.push(timeout);
}

function playCrackle() {
  if (!audioCtx || currentSoundType !== 'fire') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'triangle';
  filter.type = 'bandpass';
  filter.frequency.value = 1600 + Math.random() * 3200;
  filter.Q.value = 4;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(soundGainNode);

  osc.frequency.setValueAtTime(110 + Math.random() * 200, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.012 + Math.random() * 0.03, now + 0.001);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.008 + Math.random() * 0.01);

  osc.start(now);
  osc.stop(now + 0.03);
}

function scheduleClink() {
  if (currentSoundType !== 'cafe') return;
  let timeout = setTimeout(() => {
    playClink();
    scheduleClink();
  }, 1500 + Math.random() * 4500);
  activeTimeouts.push(timeout);
}

function playClink() {
  if (!audioCtx || currentSoundType !== 'cafe') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(2600 + Math.random() * 2000, now);

  osc.connect(gain);
  gain.connect(soundGainNode);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.006 + Math.random() * 0.01, now + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06 + Math.random() * 0.1);

  osc.start(now);
  osc.stop(now + 0.25);
}

function scheduleCricket() {
  if (currentSoundType !== 'crickets') return;
  let timeout = setTimeout(() => {
    playCricket();
    scheduleCricket();
  }, 1000 + Math.random() * 1800);
  activeTimeouts.push(timeout);
}

function playCricket() {
  if (!audioCtx || currentSoundType !== 'crickets') return;
  const now = audioCtx.currentTime;
  const carrier = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  carrier.type = 'sine';
  carrier.frequency.setValueAtTime(4100 + Math.random() * 300, now);

  carrier.connect(gain);
  gain.connect(soundGainNode);

  let startTime = now;
  for (let i = 0; i < 4; i++) {
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.006, startTime + 0.002);
    gain.gain.linearRampToValueAtTime(0, startTime + 0.015);
    startTime += 0.022;
  }

  carrier.start(now);
  carrier.stop(startTime);
}

// 11. Dschungel-Nacht Zirpen & Geräusche
function scheduleJungleSounds() {
  if (currentSoundType !== 'jungle') return;
  let timeout = setTimeout(() => {
    playCricket();
    if (Math.random() > 0.6) playBird();
    scheduleJungleSounds();
  }, 800 + Math.random() * 1500);
  activeTimeouts.push(timeout);
}

// 12. Zugfahrt Glei-Stoßgeräusche (Clack-Clack)
function scheduleTrain() {
  if (currentSoundType !== 'train') return;
  let timeout = setTimeout(() => {
    playTrainClack();
    scheduleTrain();
  }, 1600 + Math.random() * 600);
  activeTimeouts.push(timeout);
}

function playTrainClack() {
  if (!audioCtx || currentSoundType !== 'train') return;
  const now = audioCtx.currentTime;
  
  // Stoß 1
  const osc1 = audioCtx.createOscillator();
  const gain1 = audioCtx.createGain();
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(60, now);
  osc1.frequency.exponentialRampToValueAtTime(25, now + 0.12);
  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(0.08, now + 0.01);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  
  osc1.connect(gain1);
  gain1.connect(soundGainNode);
  osc1.start(now);
  osc1.stop(now + 0.15);

  // Stoß 2
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(55, now + 0.08);
  osc2.frequency.exponentialRampToValueAtTime(25, now + 0.2);
  gain2.gain.setValueAtTime(0, now + 0.08);
  gain2.gain.linearRampToValueAtTime(0.06, now + 0.09);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
  
  osc2.connect(gain2);
  gain2.connect(soundGainNode);
  osc2.start(now + 0.08);
  osc2.stop(now + 0.22);
}

// 13. Bibliothek Seitenrascheln
function schedulePageRustle() {
  if (currentSoundType !== 'library') return;
  let timeout = setTimeout(() => {
    playPageRustle();
    schedulePageRustle();
  }, 6000 + Math.random() * 12000);
  activeTimeouts.push(timeout);
}

function playPageRustle() {
  if (!audioCtx || currentSoundType !== 'library') return;
  const now = audioCtx.currentTime;
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();
  
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1500 + Math.random() * 1000, now);
  filter.Q.setValueAtTime(3, now);
  
  const osc = audioCtx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(80, now);
  
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.015, now + 0.1);
  gain.gain.linearRampToValueAtTime(0.008, now + 0.22);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
  
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(soundGainNode);
  osc.start(now);
  osc.stop(now + 0.5);
}

// 14. Office mechanical keyboard clicks
function scheduleTypeClicks() {
  if (currentSoundType !== 'keyboard') return;
  let timeout = setTimeout(() => {
    playTypeClick();
    scheduleTypeClicks();
  }, 80 + Math.random() * 260);
  activeTimeouts.push(timeout);
}

function playTypeClick() {
  if (!audioCtx || currentSoundType !== 'keyboard') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(750 + Math.random() * 350, now);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1100 + Math.random() * 700, now);
  filter.Q.setValueAtTime(5, now);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(soundGainNode);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.015, now + 0.001);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);

  osc.start(now);
  osc.stop(now + 0.02);
}

// 16. Unterwasser Blubbern (Bubble sweeps)
function scheduleUnderwaterBubbles() {
  if (currentSoundType !== 'sub') return;
  let timeout = setTimeout(() => {
    playBubble();
    scheduleUnderwaterBubbles();
  }, 1000 + Math.random() * 2400);
  activeTimeouts.push(timeout);
}

function playBubble() {
  if (!audioCtx || currentSoundType !== 'sub') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(380 + Math.random() * 150, now + 0.42);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(140, now);
  filter.frequency.exponentialRampToValueAtTime(380, now + 0.42);
  filter.Q.setValueAtTime(6, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.05, now + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(soundGainNode);

  osc.start(now);
  osc.stop(now + 0.45);
}

// --- STOP & LAUTSTÄRKE ---

function stopAmbientSound(silent = false) {
  clearActiveTimeouts();

  if (activeNodes.length > 0) {
    if (soundGainNode && audioCtx) {
      try {
        soundGainNode.gain.setValueAtTime(soundGainNode.gain.value, audioCtx.currentTime);
        soundGainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
      } catch(e) {}
    }
    const nodesToStop = [...activeNodes];
    setTimeout(() => {
      nodesToStop.forEach(node => {
        try { node.stop(); } catch(e) {}
        try { node.disconnect(); } catch(e) {}
      });
    }, 250);
    activeNodes = [];
  }

  // Eigene Playlist-Tracks stoppen
  if (activeUserAudio) {
    try {
      activeUserAudio.pause();
      activeUserAudio.src = "";
    } catch(e) {}
    activeUserAudio = null;
  }

  currentSoundType = null;
  updateSoundscapeUI();
  
  const nameLabel = document.getElementById('user-sound-name'); 
  if (nameLabel) nameLabel.classList.add('hidden');
  
  if (!silent) {
    const toastLabel = { 
      de: 'Focus Sound gestoppt', 
      en: 'Focus Sound stopped', 
      es: 'Sonido de enfoque detenido', 
      el: 'Ήχος εστίασης σταμάτησε' 
    }[currentLang] || 'Sound stopped';
    showToast(toastLabel);
  }
}

// MULTI-PLAYLIST PLAYER VERWALTUNG
function handleUserSoundFile(event) {
  const files = event.target.files; if (!files || files.length === 0) return;
  stopAmbientSound(true);
  
  // Playlist-Dateien in RAM einlesen
  playlistTracks = Array.from(files).map(file => ({
    url: URL.createObjectURL(file),
    name: file.name
  }));
  
  currentTrackIndex = 0;
  
  // Zeige den Playlist-Player an
  const playerContainer = document.getElementById('custom-playlist-player');
  if (playerContainer) playerContainer.classList.remove('hidden');
  
  playTrack(currentTrackIndex);
}

function playTrack(index) {
  if (playlistTracks.length === 0) return;
  if (index < 0 || index >= playlistTracks.length) index = 0;
  currentTrackIndex = index;
  
  const track = playlistTracks[currentTrackIndex];
  
  if (activeUserAudio) {
    try { activeUserAudio.pause(); } catch(e) {}
  }
  
  const audio = new Audio(track.url);
  audio.loop = false; // Nach Ende soll der nächste Song kommen
  audio.volume = soundMasterVolume * 0.7;
  activeUserAudio = audio;
  
  // Automatisch nächstes Lied starten, sobald aktuelles endet
  audio.addEventListener('ended', () => {
    playNextTrackWithCrossfade();
  });
  
  audio.play().then(() => {
    updatePlayPauseButtonUI(true);
  }).catch(e => {
    console.error("Fehler beim Abspielen des Tracks:", e);
  });
  
  const nameLabel = document.getElementById('user-sound-name');
  if (nameLabel) nameLabel.innerText = `🎵 ${track.name}`;
  
  updateSoundscapeUI();
  showToast(currentLang === 'de' ? `Spiele Musik: ${track.name}` : `Playing music: ${track.name}`);
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

function playNextTrackWithCrossfade() {
  if (playlistTracks.length === 0) return;
  let nextIndex = currentTrackIndex + 1;
  if (nextIndex >= playlistTracks.length) nextIndex = 0;
  
  // Crossfade ausfaden (sanfte Lautstärkenabsenkung)
  if (activeUserAudio) {
    const oldAudio = activeUserAudio;
    let fadeInterval = setInterval(() => {
      if (oldAudio.volume > 0.05) {
        oldAudio.volume -= 0.05;
      } else {
        clearInterval(fadeInterval);
        try { oldAudio.pause(); } catch(e) {}
      }
    }, 50);
  }
  
  playTrack(nextIndex);
}

function setSoundVolume(val) {
  soundMasterVolume = parseFloat(val);
  
  if (soundGainNode && audioCtx) {
    let multiplier = 0.45;
    if (currentSoundType === 'alpha') multiplier = 0.25;
    if (currentSoundType === 'ocean') multiplier = 0.55;
    if (currentSoundType === 'fire') multiplier = 0.5;
    soundGainNode.gain.setValueAtTime(soundMasterVolume * multiplier, audioCtx.currentTime);
  }
  
  if (activeUserAudio) {
    activeUserAudio.volume = soundMasterVolume * 0.7;
  }
}

function updateSoundscapeUI() {
  // Synchronisiert alle 16 Naturgeräusche mit den Buttons in der index.html
  ['rain', 'ocean', 'birds', 'thunder', 'wind', 'fire', 'cafe', 'crickets', 'white', 'purr', 'jungle', 'train', 'library', 'keyboard', 'spaceship', 'sub'].forEach(st => {
    const btn = document.getElementById(`sound-btn-${st}`);
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

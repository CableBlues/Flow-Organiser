let audioCtx = null;
let currentSoundType = null;
let soundGainNode = null;
let soundOscillators = [];
let soundMasterVolume = 0.5;
let activeUserAudio = null;
let customSoundIntervals = []; // Für rhythmische Ereignisse (Vögel, Tassengeklirr, Grillen)

function initAudioContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playAmbientSound(type) {
  initAudioContext(); stopAmbientSound(true);
  currentSoundType = type; soundGainNode = audioCtx.createGain();
  soundGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  soundGainNode.connect(audioCtx.destination);
  soundGainNode.gain.linearRampToValueAtTime(soundMasterVolume * 0.25, audioCtx.currentTime + 1.5);

  const bufferSize = audioCtx.sampleRate * 2;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  // 1. REGEN, WIND, OZEAN, WALD, CAFÉ (Rauschen als Basis)
  if (['rain', 'ocean', 'wind', 'forest', 'cafe', 'fire'].includes(type)) {
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'rain') {
        lastOut = (lastOut * 0.95) + (white * 0.05); output[i] = lastOut * 3; // Pink Noise
      } else if (type === 'ocean' || type === 'forest' || type === 'cafe' || type === 'fire') {
        lastOut = (lastOut * 0.98) + (white * 0.02); output[i] = lastOut * 4; // Brown Noise
      } else {
        output[i] = white * 0.15; // White Noise
      }
    }

    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer; noiseSource.loop = true;
    const filter = audioCtx.createBiquadFilter();

    if (type === 'rain') {
      filter.type = 'lowpass'; filter.frequency.setValueAtTime(800, audioCtx.currentTime);
    } else if (type === 'ocean') {
      filter.type = 'lowpass'; filter.frequency.setValueAtTime(300, audioCtx.currentTime);
      // Ozeanwellen LFO (Modulation der Lautstärke)
      const lfo = audioCtx.createOscillator(); lfo.type = 'sine'; lfo.frequency.setValueAtTime(0.08, audioCtx.currentTime);
      const lfoGain = audioCtx.createGain(); lfoGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      lfo.connect(lfoGain); lfoGain.connect(soundGainNode.gain); lfo.start();
      soundOscillators.push(lfo);
    } else if (type === 'wind') {
      filter.type = 'bandpass'; filter.frequency.setValueAtTime(600, audioCtx.currentTime); filter.Q.setValueAtTime(2.0, audioCtx.currentTime);
      // Wind-Böen LFO
      const lfo = audioCtx.createOscillator(); lfo.type = 'sine'; lfo.frequency.setValueAtTime(0.15, audioCtx.currentTime);
      const lfoGain = audioCtx.createGain(); lfoGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      lfo.connect(lfoGain); lfoGain.connect(soundGainNode.gain); lfo.start();
      soundOscillators.push(lfo);
    } else if (type === 'forest') {
      filter.type = 'lowpass'; filter.frequency.setValueAtTime(400, audioCtx.currentTime);
      // Wald-Vogelgezwitscher Synthesizer
      triggerProceduralBirds();
    } else if (type === 'cafe') {
      filter.type = 'bandpass'; filter.frequency.setValueAtTime(250, audioCtx.currentTime); filter.Q.setValueAtTime(0.8, audioCtx.currentTime);
      // Tassengeklirr & Café-Geräusche
      triggerProceduralCafeClinks();
    } else if (type === 'fire') {
      filter.type = 'lowpass'; filter.frequency.setValueAtTime(200, audioCtx.currentTime);
      // Kaminfeuer Knister-Synthesizer
      triggerProceduralCampfireCrackle();
    }

    noiseSource.connect(filter); filter.connect(soundGainNode); noiseSource.start();
    soundOscillators.push(noiseSource);

  // 2. BINAURALE ALPHA-BEATS
  } else if (type === 'alpha') {
    const oscL = audioCtx.createOscillator(); const oscR = audioCtx.createOscillator();
    const merger = audioCtx.createChannelMerger(2);
    oscL.frequency.setValueAtTime(200, audioCtx.currentTime);
    oscR.frequency.setValueAtTime(210, audioCtx.currentTime); // 10Hz Fokus-Differenz
    oscL.connect(merger, 0, 0); oscR.connect(merger, 0, 1);
    merger.connect(soundGainNode); oscL.start(); oscR.start();
    soundOscillators.push(oscL, oscR);

  // 3. SOMMERWIESE (Grillen zirpen)
  } else if (type === 'crickets') {
    // Sanfter Wind im Hintergrund
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut * 0.98) + (white * 0.02); output[i] = lastOut * 2;
    }
    const windSource = audioCtx.createBufferSource(); windSource.buffer = noiseBuffer; windSource.loop = true;
    const filter = audioCtx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.setValueAtTime(350, audioCtx.currentTime);
    windSource.connect(filter); filter.connect(soundGainNode); windSource.start();
    soundOscillators.push(windSource);
    
    // Grillenzirpen starten
    triggerProceduralCrickets();
  }

  updateSoundscapeUI();
  const toastLabel = { de: 'Focus Sound gestartet 🎧', en: 'Focus Sound started 🎧', es: 'Sonido de enfoque iniciado 🎧', el: 'Ήχος εστίασης ξεκίνησε 🎧' }[currentLang];
  showToast(`${toastLabel}`);
}

// WALD: Generiert zufälliges prozedurales Vogelgezwitscher
function triggerProceduralBirds() {
  const interval = setInterval(() => {
    if (currentSoundType !== 'forest') return;
    try {
      const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(soundGainNode); osc.type = 'sine';
      const baseFreq = 1800 + Math.random() * 1200;
      osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, audioCtx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(baseFreq - 400, audioCtx.currentTime + 0.25);
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.015, audioCtx.currentTime + 0.05);
      gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.25);
      osc.start(); osc.stop(audioCtx.currentTime + 0.25);
    } catch(e) {}
  }, 4000 + Math.random() * 6000);
  customSoundIntervals.push(interval);
}

// CAFÉ: Simuliert das zufällige Klirren von Tassen/Geschirr
function triggerProceduralCafeClinks() {
  const interval = setInterval(() => {
    if (currentSoundType !== 'cafe') return;
    try {
      const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter(); filter.type = 'highpass'; filter.frequency.setValueAtTime(2500, audioCtx.currentTime);
      osc.connect(filter); filter.connect(gain); gain.connect(soundGainNode);
      osc.type = 'sine'; osc.frequency.setValueAtTime(3000 + Math.random() * 1500, audioCtx.currentTime);
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.005, audioCtx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
      osc.start(); osc.stop(audioCtx.currentTime + 0.15);
    } catch(e) {}
  }, 3000 + Math.random() * 5000);
  customSoundIntervals.push(interval);
}

// FEUER: Erzeugt ein zufälliges Kaminfeuer-Knistern
function triggerProceduralCampfireCrackle() {
  const interval = setInterval(() => {
    if (currentSoundType !== 'fire') return;
    try {
      const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter(); filter.type = 'highpass'; filter.frequency.setValueAtTime(4000, audioCtx.currentTime);
      osc.connect(filter); filter.connect(gain); gain.connect(soundGainNode);
      osc.type = 'triangle'; osc.frequency.setValueAtTime(100 + Math.random() * 200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.02);
      osc.start(); osc.stop(audioCtx.currentTime + 0.03);
    } catch(e) {}
  }, 100 + Math.random() * 400);
  customSoundIntervals.push(interval);
}

// GRILLEN: Erzeugt ein typisches, zitterndes Grillenzirpen
function triggerProceduralCrickets() {
  const interval = setInterval(() => {
    if (currentSoundType !== 'crickets') return;
    try {
      const now = audioCtx.currentTime;
      // Grillen-Impulse (4 kurze Zirps hintereinander)
      for (let i = 0; i < 4; i++) {
        const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
        const lfo = audioCtx.createOscillator(); const lfoGain = audioCtx.createGain();
        osc.type = 'sine'; osc.frequency.setValueAtTime(4200, now + i * 0.08);
        lfo.type = 'sine'; lfo.frequency.setValueAtTime(45, now + i * 0.08); // Schnelles Zittern
        lfoGain.gain.setValueAtTime(150, now + i * 0.08);
        lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
        osc.connect(gain); gain.connect(soundGainNode);
        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.015, now + i * 0.08 + 0.01);
        gain.gain.linearRampToValueAtTime(0, now + i * 0.08 + 0.06);
        lfo.start(now + i * 0.08); osc.start(now + i * 0.08);
        lfo.stop(now + i * 0.08 + 0.06); osc.stop(now + i * 0.08 + 0.06);
      }
    } catch(e) {}
  }, 1200 + Math.random() * 800);
  customSoundIntervals.push(interval);
}

function stopAmbientSound(silent = false) {
  customSoundIntervals.forEach(interval => clearInterval(interval));
  customSoundIntervals = [];

  if (soundGainNode && audioCtx) {
    const activeGain = soundGainNode; const activeOscs = [...soundOscillators];
    const activeAudio = activeUserAudio;
    activeGain.gain.setValueAtTime(activeGain.gain.value, audioCtx.currentTime);
    activeGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);
    setTimeout(() => {
      activeOscs.forEach(osc => { try { osc.stop(); } catch(e) {} });
      if (activeAudio) {
        try {
          activeAudio.pause(); activeAudio.src = "";
        } catch(e) {}
      }
    }, 850);
  }
  soundOscillators = []; activeUserAudio = null; currentSoundType = null; updateSoundscapeUI();
  const nameLabel = document.getElementById('user-sound-name'); if (nameLabel) nameLabel.classList.add('hidden');
  if (!silent) {
    const toastLabel = { de: 'Focus Sound gestoppt', en: 'Focus Sound stopped', es: 'Sonido de enfoque detenido', el: 'Ήχος εστίασης σταμάτησε' }[currentLang];
    showToast(toastLabel);
  }
}

function handleUserSoundFile(event) {
  const file = event.target.files?.[0]; if (!file) return;
  initAudioContext(); stopAmbientSound(true);
  const fileUrl = URL.createObjectURL(file);
  const audio = new Audio(fileUrl); audio.loop = true; activeUserAudio = audio;
  currentSoundType = 'custom'; soundGainNode = audioCtx.createGain();
  soundGainNode.gain.setValueAtTime(0, audioCtx.currentTime); soundGainNode.connect(audioCtx.destination);
  soundGainNode.gain.linearRampToValueAtTime(soundMasterVolume * 0.25, audioCtx.currentTime + 1.5);
  const source = audioCtx.createMediaElementSource(audio); source.connect(soundGainNode);
  audio.play().catch(e => { showToast("Fehler beim Abspielen der Datei."); });
  const nameLabel = document.getElementById('user-sound-name');
  if (nameLabel) { nameLabel.innerText = `🎵 ${file.name}`; nameLabel.classList.remove('hidden'); }
  updateSoundscapeUI(); showToast(currentLang === 'de' ? `Eigener Sound gestartet: ${file.name}` : `Custom sound started: ${file.name}`);
}

function setSoundVolume(val) {
  soundMasterVolume = parseFloat(val);
  if (soundGainNode && audioCtx) soundGainNode.gain.setValueAtTime(soundMasterVolume * 0.25, audioCtx.currentTime);
}

function updateSoundscapeUI() {
  ['rain', 'ocean', 'alpha', 'wind', 'forest', 'fire', 'cafe', 'crickets'].forEach(st => {
    const btn = document.getElementById(`sound-btn-${st}`);
    if (btn) {
      if (st === currentSoundType) btn.className = 'p-2 bg-blue-500/30 border border-blue-400 rounded-xl text-left text-xs text-white font-bold transition cursor-pointer flex items-center gap-2 shadow-sm animate-pulse';
      else btn.className = 'p-2 bg-white/5 hover:bg-blue-500/20 border border-white/10 rounded-xl text-left text-xs text-gray-200 font-semibold transition cursor-pointer flex items-center gap-2';
    }
  });
  const indicator = document.getElementById('soundscape-indicator');
  if (indicator) {
    if (currentSoundType) indicator.classList.remove('hidden');
    else indicator.classList.add('hidden');
  }
}
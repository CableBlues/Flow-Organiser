// audio-scheduler-3.js: Sound-Scheduler fuer Typewriter, Storm, Frogs + Stop/Volume-Funktionen

function scheduleTypewriterClicks() {
  if (currentSoundType !== 'keyboard') return;
  let timeout = setTimeout(() => {
    playTypewriterClick();
    scheduleTypewriterClicks();
  }, 100 + Math.random() * 450);
  activeTimeouts.push(timeout);
}

function playTypewriterClick() {
  if (!audioCtx || currentSoundType !== 'keyboard') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(800 + Math.random() * 600, now);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1300 + Math.random() * 900, now);
  filter.Q.setValueAtTime(7, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.4, now + 0.001); 
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(soundGainNode);

  osc.start(now);
  osc.stop(now + 0.02);

  if (Math.random() > 0.95) {
    setTimeout(playTypewriterBell, 200);
  }
}

function playTypewriterBell() {
  if (!audioCtx || currentSoundType !== 'keyboard') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(2400, now);
  
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.25, now + 0.005); 
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
  
  osc.connect(gain);
  gain.connect(soundGainNode);
  
  osc.start(now);
  osc.stop(now + 0.7);
}

function scheduleStormThunderRumbles() {
  if (currentSoundType !== 'storm') return;
  let timeout = setTimeout(() => {
    playStormThunder();
    scheduleStormThunderRumbles();
  }, 10000 + Math.random() * 15000);
  activeTimeouts.push(timeout);
}

function playStormThunder() {
  if (!audioCtx || currentSoundType !== 'storm') return;
  const now = audioCtx.currentTime;
  const source = audioCtx.createBufferSource();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();
  
  source.buffer = getNoiseBuffer('brown');
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(45 + Math.random() * 30, now);
  
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.65 + Math.random() * 0.25, now + 1.2); 
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 7.5);
  
  source.connect(filter);
  filter.connect(gain);
  gain.connect(soundGainNode);
  
  source.start(now);
  source.stop(now + 8.0);
}

function scheduleFrogsChirpsAndCroaks() {
  if (currentSoundType !== 'frogs') return;
  let timeout = setTimeout(() => {
    if (Math.random() > 0.4) playFrogCroak();
    if (Math.random() > 0.2) playTeichCricketChirp();
    scheduleFrogsChirpsAndCroaks();
  }, 1500 + Math.random() * 2500);
  activeTimeouts.push(timeout);
}

function playFrogCroak() {
  if (!audioCtx || currentSoundType !== 'frogs') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(80 + Math.random() * 40, now);
  
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(140, now);
  filter.Q.setValueAtTime(6, now);
  
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.25, now + 0.02); 
  gain.gain.linearRampToValueAtTime(0.05, now + 0.12);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
  
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(soundGainNode);
  
  osc.start(now);
  osc.stop(now + 0.28);
}

function playTeichCricketChirp() {
  if (!audioCtx || currentSoundType !== 'frogs') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(3900 + Math.random() * 400, now);
  
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.005); 
  gain.gain.linearRampToValueAtTime(0, now + 0.025);
  
  osc.connect(gain);
  gain.connect(soundGainNode);
  
  osc.start(now);
  osc.stop(now + 0.03);
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
 
 

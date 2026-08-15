// --- SOUND-SCHEDULER ---

function scheduleCampfireCrackles() {
  if (currentSoundType !== 'campfire') return;
  let timeout = setTimeout(() => {
    playCampfireCrack();
    if (Math.random() > 0.94) playAcousticPluck();
    scheduleCampfireCrackles();
  }, 35 + Math.random() * 240);
  activeTimeouts.push(timeout);
}

function playCampfireCrack() {
  if (!audioCtx || currentSoundType !== 'campfire') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'triangle';
  filter.type = 'bandpass';
  filter.frequency.value = 1900 + Math.random() * 3200;
  filter.Q.value = 6;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(soundGainNode);

  osc.frequency.setValueAtTime(90 + Math.random() * 210, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.04 + Math.random() * 0.04, now + 0.001); 
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.008 + Math.random() * 0.012);

  osc.start(now);
  osc.stop(now + 0.03);
}

function playAcousticPluck() {
  if (!audioCtx || currentSoundType !== 'campfire') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'triangle';
  const notes = [146.83, 196.00, 246.94, 293.66, 329.63]; 
  const pitch = notes[Math.floor(Math.random() * notes.length)];
  osc.frequency.setValueAtTime(pitch, now);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(450, now);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(soundGainNode);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.25, now + 0.015); 
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

  osc.start(now);
  osc.stop(now + 2.0);
}

function scheduleForestBirds() {
  if (currentSoundType !== 'birds') return;
  let timeout = setTimeout(() => {
    playBirdSinging();
    scheduleForestBirds();
  }, 1600 + Math.random() * 2800);
  activeTimeouts.push(timeout);
}

function playBirdSinging() {
  if (!audioCtx || currentSoundType !== 'birds') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  let baseFreq = 2100 + Math.random() * 900;
  osc.frequency.setValueAtTime(baseFreq, now);

  osc.frequency.linearRampToValueAtTime(baseFreq + 600, now + 0.12);
  osc.frequency.exponentialRampToValueAtTime(baseFreq - 200, now + 0.28);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.04); 
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

  const panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
  osc.connect(gain);

  if (panner) {
    panner.pan.setValueAtTime(Math.random() * 1.4 - 0.7, now);
    gain.connect(panner);
    panner.connect(soundGainNode);
  } else {
    gain.connect(soundGainNode);
  }

  osc.start(now);
  osc.stop(now + 0.35);
}

function scheduleStreamWaterGurgles() {
  if (currentSoundType !== 'stream') return;
  let timeout = setTimeout(() => {
    playWaterBubble();
    scheduleStreamWaterGurgles();
  }, 100 + Math.random() * 300);
  activeTimeouts.push(timeout);
}

function playWaterBubble() {
  if (!audioCtx || currentSoundType !== 'stream') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(230 + Math.random() * 200, now);
  osc.frequency.exponentialRampToValueAtTime(600 + Math.random() * 250, now + 0.25);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(450, now);
  filter.frequency.exponentialRampToValueAtTime(700, now + 0.25);
  filter.Q.setValueAtTime(4, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.15, now + 0.06); 
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(soundGainNode);

  osc.start(now);
  osc.stop(now + 0.3);
}

function scheduleTempleElements() {
  if (currentSoundType !== 'temple') return;
  let timeout = setTimeout(() => {
    if (Math.random() > 0.3) playWindChime();
    if (Math.random() > 0.75) playBambooFountainThump();
    scheduleTempleElements();
  }, 2000 + Math.random() * 3200);
  activeTimeouts.push(timeout);
}

function playWindChime() {
  if (!audioCtx || currentSoundType !== 'temple') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  const freqs = [1900, 2300, 2700, 3200];
  const f = freqs[Math.floor(Math.random() * freqs.length)] + (Math.random() * 100 - 50);
  osc.frequency.setValueAtTime(f, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.01); 
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

  const panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
  osc.connect(gain);

  if (panner) {
    panner.pan.setValueAtTime(Math.random() * 1.6 - 0.8, now);
    gain.connect(panner);
    panner.connect(soundGainNode);
  } else {
    gain.connect(soundGainNode);
  }

  osc.start(now);
  osc.stop(now + 1.8);
}

function playBambooFountainThump() {
  if (!audioCtx || currentSoundType !== 'temple') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(100, now);
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(150, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.35, now + 0.005); 
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(soundGainNode);

  osc.start(now);
  osc.stop(now + 0.22);
}

function scheduleCafeCupClinks() {
  if (currentSoundType !== 'cafe') return;
  let timeout = setTimeout(() => {
    playCafeClink();
    scheduleCafeCupClinks();
  }, 2000 + Math.random() * 4200);
  activeTimeouts.push(timeout);
}

function playCafeClink() {
  if (!audioCtx || currentSoundType !== 'cafe') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(2900 + Math.random() * 1900, now);

  osc.connect(gain);
  gain.connect(soundGainNode);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.08 + Math.random() * 0.08, now + 0.002); 
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06 + Math.random() * 0.1);

  osc.start(now);
  osc.stop(now + 0.25);
}

let lastClockTickHigh = false;
function scheduleTickTockRhythm() {
  if (currentSoundType !== 'clock') return;
  let timeout = setTimeout(() => {
    playClockTick();
    scheduleTickTockRhythm();
  }, 1000);
  activeTimeouts.push(timeout);
}

function playClockTick() {
  if (!audioCtx || currentSoundType !== 'clock') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  const pitch = lastClockTickHigh ? 780 : 580;
  lastClockTickHigh = !lastClockTickHigh;
  
  osc.frequency.setValueAtTime(pitch, now);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(pitch, now);
  filter.Q.setValueAtTime(8, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.35, now + 0.001); 
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(soundGainNode);

  osc.start(now);
  osc.stop(now + 0.04);

  if (Math.random() > 0.90) {
    playClockGong();
  }
}

function playClockGong() {
  if (!audioCtx || currentSoundType !== 'clock') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(115, now);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(180, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.45, now + 0.08); 
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(soundGainNode);

  osc.start(now);
  osc.stop(now + 3.0);
}

function scheduleTrainSteamChuffs() {
  if (currentSoundType !== 'train') return;
  let timeout = setTimeout(() => {
    playTrainChuff();
    if (Math.random() > 0.75) playTrainTrackClack();
    scheduleTrainSteamChuffs();
  }, 400); 
  activeTimeouts.push(timeout);
}

function playTrainChuff() {
  if (!audioCtx || currentSoundType !== 'train') return;
  const now = audioCtx.currentTime;
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();
  const source = audioCtx.createBufferSource();

  source.buffer = getNoiseBuffer('pink');
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(180, now);
  filter.frequency.linearRampToValueAtTime(90, now + 0.12);
  filter.Q.setValueAtTime(3.5, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.45, now + 0.015); 
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(soundGainNode);

  source.start(now);
  source.stop(now + 0.2);
}

function playTrainTrackClack() {
  if (!audioCtx || currentSoundType !== 'train') return;
  const now = audioCtx.currentTime;
  
  const playClickNode = (pitch, delay) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, now + delay);
    osc.frequency.exponentialRampToValueAtTime(25, now + delay + 0.08);
    gain.gain.setValueAtTime(0, now + delay);
    gain.gain.linearRampToValueAtTime(0.25, now + delay + 0.005); 
    gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.08);
    osc.connect(gain);
    gain.connect(soundGainNode);
    osc.start(now + delay);
    osc.stop(now + delay + 0.1);
  };

  playClickNode(55, 0);
  playClickNode(48, 0.07);
}

function scheduleArcadeChiptunes() {
  if (currentSoundType !== 'arcade') return;
  let timeout = setTimeout(() => {
    playArcadeBeep();
    scheduleArcadeChiptunes();
  }, 900 + Math.random() * 2000);
  activeTimeouts.push(timeout);
}

function playArcadeBeep() {
  if (!audioCtx || currentSoundType !== 'arcade') return;
  const now = audioCtx.currentTime;
  
  const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 523.25]; 
  const startPitch = notes[Math.floor(Math.random() * notes.length)];
  
  let timeOffset = 0;
  for (let i = 0; i < 5; i++) { 
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'square';
    const pitch = startPitch * (1 + (i * 0.25));
    osc.frequency.setValueAtTime(pitch, now + timeOffset);
    
    gain.gain.setValueAtTime(0, now + timeOffset);
    gain.gain.linearRampToValueAtTime(0.15, now + timeOffset + 0.005); 
    gain.gain.exponentialRampToValueAtTime(0.0001, now + timeOffset + 0.08);
    
    osc.connect(gain);
    gain.connect(soundGainNode);
    
    osc.start(now + timeOffset);
    osc.stop(now + timeOffset + 0.1);
    
    timeOffset += 0.08;
  }
}

function scheduleGuitarPadMelody() {
  if (currentSoundType !== 'guitarpad') return;
  let timeout = setTimeout(() => {
    playGuitarPadChord();
    scheduleGuitarPadMelody();
  }, 3500 + Math.random() * 1500);
  activeTimeouts.push(timeout);
}

function playGuitarPadChord() {
  if (!audioCtx || currentSoundType !== 'guitarpad') return;
  const now = audioCtx.currentTime;
  
  const chords = [
    [130.81, 196.00, 261.63, 329.63, 392.00, 523.25],
    [146.83, 196.00, 293.66, 392.00, 440.00, 587.33]
  ];
  const notes = chords[Math.floor(Math.random() * chords.length)];
  
  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + (idx * 0.06));
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    
    gain.gain.setValueAtTime(0, now + (idx * 0.06) + 0.03); 
    gain.gain.linearRampToValueAtTime(0.2, now + (idx * 0.06) + 0.03); 
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(soundGainNode);
    
    osc.start(now);
    osc.stop(now + 4.0);
  });
}

function scheduleMonasteryElements() {
  if (currentSoundType !== 'monastery') return;
  let timeout = setTimeout(() => {
    if (Math.random() > 0.3) playZenSingingBowl();
    if (Math.random() > 0.7) playMonasteryOhmChant();
    scheduleMonasteryElements();
  }, 4000 + Math.random() * 4000);
  activeTimeouts.push(timeout);
}

function playZenSingingBowl() {
  if (!audioCtx || currentSoundType !== 'monastery') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, now);
  
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.3, now + 0.02); 
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);
  
  osc.connect(gain);
  gain.connect(soundGainNode);
  
  osc.start(now);
  osc.stop(now + 4.0);
}

function playMonasteryOhmChant() {
  if (!audioCtx || currentSoundType !== 'monastery') return;
  const now = audioCtx.currentTime;
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();
  
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(65.41, now);
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(130.81, now);
  
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(380, now);
  filter.Q.setValueAtTime(6, now);
  
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.25, now + 0.8); 
  gain.gain.linearRampToValueAtTime(0.25, now + 2.5);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);
  
  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(soundGainNode);
  
  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 4.0);
  osc2.stop(now + 4.0);
}

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

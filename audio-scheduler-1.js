// audio-scheduler-1.js: Sound-Scheduler fuer Campfire, Birds, Stream, Temple, Cafe, Clock

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


// audio-generators.js: Startet die sanften Klangerzeuger & Melodie-Generatoren je nach Sound-Typ

function startAmbientGeneratorForType(type) {
  if (!audioCtx) return;

  if (type === 'piano') {
    // Sanftes, warmes generatives Piano
    scheduleGentlePianoMelody();

  } else if (type === 'lofi') {
    // Entspannte Lofi 7th-Chords & Tape-Atmosphäre
    scheduleLofiTapeChords();

  } else if (type === 'chimes') {
    // Sanftes Windspiel im Wind
    scheduleZenWindChimes();

  } else if (type === 'space') {
    // Warmer 432Hz Cosmic Synth Pad Drone
    startCosmicSpaceDrone();

  } else if (type === 'guitar') {
    // Zart gezupfte Akustik-Gitarre
    scheduleAcousticGuitarMelody();

  } else if (type === 'singingbowl') {
    // Tiefe tibetische Klangschalen mit binauralem Schwebungston
    scheduleSingingBowls();

  } else if (type === 'musicbox') {
    // Verträumte Spieluhr-Melodie
    scheduleMusicBoxLullaby();

  } else if (type === 'breeze') {
    // Warmes Blättersäuseln im Sommerwind (kein Regen/Wasser!)
    startForestBreezeSound();

  } else if (type === 'campfire') {
    // Warmes, sanftes Kaminfeuer
    const source = audioCtx.createBufferSource();
    source.buffer = getNoiseBuffer('brown');
    source.loop = true;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, audioCtx.currentTime);
    source.connect(filter);
    filter.connect(soundGainNode);
    source.start();
    activeNodes.push(source);
    scheduleCampfireCrackles();

  } else if (type === 'birds') {
    // Morgenwald mit sanfter Brise und zartem Zwitschern
    const source = audioCtx.createBufferSource();
    source.buffer = getNoiseBuffer('pink');
    source.loop = true;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, audioCtx.currentTime);
    source.connect(filter);
    filter.connect(soundGainNode);
    source.start();
    activeNodes.push(source);
    scheduleForestBirds();

  } else if (type === 'cafe') {
    // Sanftes, gemütliches Hintergrund-Café
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
    scheduleCafeCupClinks();

  } else if (type === 'clock') {
    // Gleichmäßiges, beruhigendes Pendel-Ticken
    scheduleTickTockRhythm();

  } else if (type === 'lofi_sunshine') {
    // Fröhliche Lofi Sunshine Chords & Vibes
    scheduleLofiSunshineMusic();

  } else if (type === 'summer_meadow') {
    // Sommerwiese mit Waldvögeln & lauer Sommerbrise
    const source = audioCtx.createBufferSource();
    source.buffer = getNoiseBuffer('pink');
    source.loop = true;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, audioCtx.currentTime);
    source.connect(filter);
    filter.connect(soundGainNode);
    source.start();
    activeNodes.push(source);
    scheduleSummerMeadowNature();

  } else if (type === 'bossa_nova') {
    // Sommerliche Bossa Nova Akkorde & Rhythmus
    scheduleBossaNovaGuitar();
  }
}

// -------------------------------------------------------------
// SOUNDSCAPE HILFSGENERATOREN (DRONES & WINDE)
// -------------------------------------------------------------

function startCosmicSpaceDrone() {
  if (!audioCtx || currentSoundType !== 'space') return;
  const now = audioCtx.currentTime;

  const freqs = [65.4, 98.0, 130.8, 196.0]; // C2, G2, C3, G3 (harmonisch & erdend)
  const masterFilter = audioCtx.createBiquadFilter();
  masterFilter.type = 'lowpass';
  masterFilter.frequency.setValueAtTime(280, now);

  const lfo = audioCtx.createOscillator();
  const lfoGain = audioCtx.createGain();
  lfo.frequency.setValueAtTime(0.06, now); // Sehr langsames Atmen
  lfoGain.gain.setValueAtTime(90, now);
  lfo.connect(lfoGain);
  lfoGain.connect(masterFilter.frequency);
  lfo.start(now);
  activeNodes.push(lfo);

  masterFilter.connect(soundGainNode);

  freqs.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq + (Math.random() * 0.4 - 0.2), now); // Leichte Schwebung

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18 / freqs.length, now + 3.0);

    osc.connect(gain);
    gain.connect(masterFilter);
    osc.start(now);
    activeNodes.push(osc);
  });
}

function startForestBreezeSound() {
  if (!audioCtx || currentSoundType !== 'breeze') return;
  const now = audioCtx.currentTime;

  const source = audioCtx.createBufferSource();
  source.buffer = getNoiseBuffer('pink');
  source.loop = true;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(320, now);
  filter.Q.setValueAtTime(1.8, now);

  const lfo = audioCtx.createOscillator();
  const lfoGain = audioCtx.createGain();
  lfo.frequency.setValueAtTime(0.09, now); // Sanftes Blätterschwanken
  lfoGain.gain.setValueAtTime(160, now);

  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.35, now + 2.5);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(soundGainNode);

  lfo.start(now);
  source.start(now);
  activeNodes.push(lfo, source);
}

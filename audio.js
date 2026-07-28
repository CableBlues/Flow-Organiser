let audioCtx = null;
let currentSoundType = null;
let soundGainNode = null;
let soundOscillators = [];
let soundMasterVolume = 0.5;
let activeUserAudio = null; // Hier speichern wir das aktive HTML5-Audio-Objekt

// Zuverlässige Audio-Loops von Wikimedia Commons
const SOUND_URLS = {
  rain: "https://upload.wikimedia.org/wikipedia/commons/8/80/Bourne_woods_rain_2020-05-10_0757.mp3",
  ocean: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Het_kabbelen_van_water_-_SoundCloud_-_Beeld_en_Geluid.ogg",
  wind: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Bourne_woods_windy_2020-05-05_0753.mp3",
  forest: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Bourne_Woods_2020-05-29_0758.mp3",
  fire: "https://upload.wikimedia.org/wikipedia/commons/5/52/Campfire_sound_ambience.ogg",
  cafe: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Bertoldsbrunnen_mit_Tram.mp3",
  crickets: "https://upload.wikimedia.org/wikipedia/commons/1/12/Cicada_calling_in_Irving%2C_TX_in_June_of_2012.ogg"
};

function initAudioContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playAmbientSound(type) {
  stopAmbientSound(true); // Vorherigen Sound sauber stoppen
  currentSoundType = type;

  if (type === 'alpha') {
    // Binaurale Alpha-Schwingungen benötigen den AudioContext
    initAudioContext();
    soundGainNode = audioCtx.createGain();
    soundGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    soundGainNode.connect(audioCtx.destination);
    soundGainNode.gain.linearRampToValueAtTime(soundMasterVolume * 0.25, audioCtx.currentTime + 1.5);

    const oscL = audioCtx.createOscillator(); const oscR = audioCtx.createOscillator();
    const merger = audioCtx.createChannelMerger(2);
    oscL.frequency.setValueAtTime(200, audioCtx.currentTime);
    oscR.frequency.setValueAtTime(210, audioCtx.currentTime);
    oscL.connect(merger, 0, 0); oscR.connect(merger, 0, 1);
    merger.connect(soundGainNode); oscL.start(); oscR.start();
    soundOscillators.push(oscL, oscR);
  } else if (SOUND_URLS[type]) {
    // Umgehung der CORS-Sperre: Wir spielen die Datei direkt ab (ohne AudioContext)
    const audio = new Audio(SOUND_URLS[type]);
    audio.loop = true;
    // Regulierung der Lautstärke direkt am Element (0.0 bis 1.0)
    audio.volume = soundMasterVolume * 0.5; 
    activeUserAudio = audio;
    
    audio.play().catch(e => {
      console.log("Audio-Wiedergabe verzögert:", e);
      showToast("Fokus Sound wird geladen...");
    });
  }

  updateSoundscapeUI();
  const toastLabel = { de: 'Focus Sound gestartet 🎧', en: 'Focus Sound started 🎧', es: 'Sonido de enfoque iniciado 🎧', el: 'Ήχος εστίασης ξεκίνησε 🎧' }[currentLang];
  showToast(`${toastLabel}`);
}

function stopAmbientSound(silent = false) {
  // 1. Synthetischen Sound (Alpha) stoppen
  if (soundGainNode && audioCtx) {
    const activeGain = soundGainNode;
    const activeOscs = [...soundOscillators];
    activeGain.gain.setValueAtTime(activeGain.gain.value, audioCtx.currentTime);
    activeGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
    setTimeout(() => {
      activeOscs.forEach(osc => { try { osc.stop(); } catch(e) {} });
    }, 350);
  }
  soundOscillators = [];

  // 2. Realen Natur-Sound stoppen
  if (activeUserAudio) {
    try {
      activeUserAudio.pause();
      activeUserAudio.src = "";
    } catch(e) {}
    activeUserAudio = null;
  }

  currentSoundType = null;
  updateSoundscapeUI();
  
  const nameLabel = document.getElementById('user-sound-name'); if (nameLabel) nameLabel.classList.add('hidden');
  if (!silent) {
    const toastLabel = { de: 'Focus Sound gestoppt', en: 'Focus Sound stopped', es: 'Sonido de enfoque detenido', el: 'Ήχος εστίασης σταμάτησε' }[currentLang];
    showToast(toastLabel);
  }
}

function handleUserSoundFile(event) {
  const file = event.target.files?.[0]; if (!file) return;
  stopAmbientSound(true);
  const fileUrl = URL.createObjectURL(file);
  
  const audio = new Audio(fileUrl);
  audio.loop = true;
  audio.volume = soundMasterVolume * 0.5;
  activeUserAudio = audio;
  
  audio.play().catch(e => { showToast("Fehler beim Abspielen der Datei."); });
  const nameLabel = document.getElementById('user-sound-name');
  if (nameLabel) { nameLabel.innerText = `🎵 ${file.name}`; nameLabel.classList.remove('hidden'); }
  updateSoundscapeUI(); showToast(currentLang === 'de' ? `Eigener Sound gestartet: ${file.name}` : `Custom sound started: ${file.name}`);
}

function setSoundVolume(val) {
  soundMasterVolume = parseFloat(val);
  
  // Lautstärke für Alpha-Beats anpassen
  if (soundGainNode && audioCtx) {
    soundGainNode.gain.setValueAtTime(soundMasterVolume * 0.25, audioCtx.currentTime);
  }
  
  // Lautstärke für Natur-Sounds anpassen
  if (activeUserAudio) {
    activeUserAudio.volume = soundMasterVolume * 0.5;
  }
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
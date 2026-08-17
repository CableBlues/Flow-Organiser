// gamification.js Teil 2/2: Klick-Interaktion, XP/Explosion-Effekte, Game-Loop
function onGameCanvasClick(event) {
  if (!gameActive || !gameCamera || !gameScene) return;

  const rect = gameRenderer.domElement.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(x, y), gameCamera);

  const intersects = raycaster.intersectObjects(gameInteractiveObjects, true);

  if (intersects.length > 0) {
    let clickedObj = intersects[0].object;
    while (clickedObj.parent && clickedObj.parent !== gameScene) {
      clickedObj = clickedObj.parent;
    }

    triggerGameTaskCompletion(clickedObj);
  }
}

function triggerGameTaskCompletion(obj) {
  const { category, index, text } = obj.userData;
  if (!category || index === undefined) return;

  playGameSound('pop');
  trigger3DExplosionParticles(obj.position, obj.material ? obj.material.color : new THREE.Color(0xff00ff));

  gameScene.remove(obj);
  gameInteractiveObjects = gameInteractiveObjects.filter(item => item !== obj);

  awardPlayerXp(25);

  if (typeof handleCompleteTask === 'function') {
    handleCompleteTask(category, index);
  }

  setTimeout(() => {
    if (gameActive) {
      generateTaskObjects3D();
    }
  }, 1300);
}

function trigger3DExplosionParticles(pos, color) {
  const count = 40;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = [];

  for (let i = 0; i < count; i++) {
    positions[i * 3] = pos.x;
    positions[i * 3 + 1] = pos.y;
    positions[i * 3 + 2] = pos.z;

    velocities.push(
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 0.2 + 0.1,
      (Math.random() - 0.5) * 0.2
    );
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: color,
    size: 0.28,
    transparent: true,
    opacity: 1.0,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(geometry, material);
  gameScene.add(particleSystem);

  let ticks = 0;
  const pAnim = () => {
    ticks++;
    const posArr = particleSystem.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3] += velocities[i * 3];
      posArr[i * 3 + 1] += velocities[i * 3 + 1];
      posArr[i * 3 + 2] += velocities[i * 3 + 2];
      velocities[i * 3 + 1] -= 0.003; 
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;
    material.opacity -= 0.02;

    if (ticks < 60 && material.opacity > 0) {
      requestAnimationFrame(pAnim);
    } else {
      gameScene.remove(particleSystem);
      geometry.dispose();
      material.dispose();
    }
  };
  pAnim();
}

function awardPlayerXp(amount) {
  playerXp += amount;
  if (playerXp >= 100) {
    playerLevel++;
    playerXp = playerXp - 100;
    playGameSound('levelUp');
    if (typeof triggerConfetti === 'function') {
      triggerConfetti();
    }
    showToast(currentLang === 'de' ? `STUFE AUFGESTIEGEN! Du bist jetzt Level ${playerLevel}! 👑` : `LEVEL UP! You are now Level ${playerLevel}! 👑`);
  }
  localStorage.setItem('flow_game_level', playerLevel);
  localStorage.setItem('flow_game_xp', playerXp);
  updateGameHud();
}

function switchGameWorld(worldName) {
  currentGameWorld = worldName;
  if (gameActive) {
    shutdownGameEngine();
    initGameEngine();
    playGameSound('worldChange');
  }
}

function toggleGameMute() {
  gameSfxEnabled = !gameSfxEnabled;
  const icon = document.getElementById('game-sound-icon');
  const text = document.getElementById('game-sound-text');

  if (gameSfxEnabled) {
    if (icon) icon.setAttribute('data-lucide', 'volume-2');
    if (text) text.innerText = "Game SFX An";
    showToast(currentLang === 'de' ? "Spielsounds aktiviert 🔊" : "Game sound unmuted 🔊");
  } else {
    if (icon) icon.setAttribute('data-lucide', 'volume-x');
    if (text) text.innerText = "Game SFX Aus";
    showToast(currentLang === 'de' ? "Spielsounds stummgeschaltet 🔇" : "Game sound muted 🔇");
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function updateGameHud() {
  const levelEl = document.getElementById('game-player-level');
  const barEl = document.getElementById('game-player-xp-bar');

  if (levelEl) levelEl.innerText = `LVL ${playerLevel}`;
  if (barEl) barEl.style.width = `${playerXp}%`;
}

function playGameSound(type) {
  if (!gameSfxEnabled) return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const playTone = (freq, duration, delay = 0, nodeType = 'sine', volume = 0.08) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = nodeType;
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(volume, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + duration + 0.05);
    };

    if (type === 'pop') {
      playTone(380, 0.12, 0, 'triangle');
      playTone(520, 0.18, 0.05, 'sine');
    } else if (type === 'levelUp') {
      const scale = [523.25, 659.25, 783.99, 1046.50];
      scale.forEach((f, i) => {
        playTone(f, 0.4, i * 0.1, 'sine', 0.1);
      });
    } else if (type === 'enter') {
      playTone(180, 0.6, 0, 'sawtooth', 0.05);
      playTone(320, 0.8, 0.1, 'triangle', 0.05);
    } else if (type === 'exit') {
      playTone(280, 0.4, 0, 'triangle', 0.05);
      playTone(140, 0.5, 0.08, 'sine', 0.05);
    } else if (type === 'worldChange') {
      playTone(440, 0.2, 0, 'sine');
      playTone(880, 0.3, 0.08, 'sine');
    }
  } catch (e) {
    console.error("Audio trigger failed in game module:", e);
  }
}

function animateGameLoop() {
  if (!gameActive) return;
  gameFrameId = requestAnimationFrame(animateGameLoop);

  const time = Date.now() * 0.001;

  if (gameControls) gameControls.update();

  gameInteractiveObjects.forEach(obj => {
    obj.rotation.y += 0.01;
    obj.rotation.x += 0.005;

    const offset = obj.userData.pulseOffset || 0;
    obj.position.y = obj.userData.originalY + Math.sin(time * 2.0 + offset) * 0.25;
  });

  if (gameRenderer && gameScene && gameCamera) {
    gameRenderer.render(gameScene, gameCamera);
  }
} 
 

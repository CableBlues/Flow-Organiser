// gamification.js: 3D Gamification Suite & Photorealistic Spatial Worlds for Flow Organiser
// =========================================================================================

var gameScene, gameCamera, gameRenderer, gameControls;
var gameActive = false;
var gameInteractiveObjects = [];
var currentGameWorld = 'orbit_deck'; // 'orbit_deck', 'floating_island', 'task_metropolis', 'galaxy_runner', 'quest_adventure'
var gameSfxEnabled = true;
var gameFrameId = null;
var gameParticles = [];
var gameExplosionParticles = [];
var gameAnimatedObjects = [];
var gameTime = 0;
var gameRaycaster, gameMouse;
var gameHoveredObject = null;
var gameActiveTaskItem = null;

var playerLevel = parseInt(localStorage.getItem('flow_game_level')) || 1;
var playerXp = parseInt(localStorage.getItem('flow_game_xp')) || 0;
var playerCombo = 0;
var lastComboTime = 0;

// Farbpaletten & Beleuchtungs-Presets für die 5 Welten
const worldPresets = {
  orbit_deck: {
    name: 'Sci-Fi Orbit-Deck',
    icon: '🌌',
    bg: 0x03030c,
    fog: 0x050518,
    ambient: 0x181a3a,
    primaryLight: 0x38bdf8,
    accentLight: 0xa855f7,
    groundColor: 0x0a0c1e
  },
  floating_island: {
    name: 'Cozy Floating Island',
    icon: '🏝️',
    bg: 0x0a192f,
    fog: 0x0c2340,
    ambient: 0x224466,
    primaryLight: 0xfde047,
    accentLight: 0x34d399,
    groundColor: 0x164e63
  },
  task_metropolis: {
    name: '3D Task-Metropole',
    icon: '🏙️',
    bg: 0x080914,
    fog: 0x0c0e20,
    ambient: 0x202440,
    primaryLight: 0x60a5fa,
    accentLight: 0xf59e0b,
    groundColor: 0x111827
  },
  galaxy_runner: {
    name: 'Galaxy Runner Cockpit',
    icon: '🚀',
    bg: 0x020208,
    fog: 0x040412,
    ambient: 0x12142e,
    primaryLight: 0xec4899,
    accentLight: 0x06b6d4,
    groundColor: 0x000000
  },
  quest_adventure: {
    name: 'Chronicles of Flow (RPG)',
    icon: '⚔️',
    bg: 0x0b0914,
    fog: 0x0e0b1a,
    ambient: 0x2e1f3d,
    primaryLight: 0xfbbf24,
    accentLight: 0x818cf8,
    groundColor: 0x1c1917
  }
};

let threeJsLoadPromise = null;
function ensureThreeJsLoaded() {
  if (window.THREE && window.THREE.OrbitControls) {
    return Promise.resolve();
  }
  if (threeJsLoadPromise) return threeJsLoadPromise;

  threeJsLoadPromise = new Promise((resolve, reject) => {
    if (window.THREE && window.THREE.OrbitControls) {
      resolve();
      return;
    }
    const threeScript = document.createElement('script');
    threeScript.src = './vendor/three.min.js';
    threeScript.onload = () => {
      const controlsScript = document.createElement('script');
      controlsScript.src = './vendor/OrbitControls.js';
      controlsScript.onload = () => resolve();
      controlsScript.onerror = () => {
        // Fallback CDN falls noetig
        const cdnControls = document.createElement('script');
        cdnControls.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
        cdnControls.onload = () => resolve();
        cdnControls.onerror = reject;
        document.head.appendChild(cdnControls);
      };
      document.head.appendChild(controlsScript);
    };
    threeScript.onerror = () => {
      const fallbackThree = document.createElement('script');
      fallbackThree.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      fallbackThree.onload = () => {
        const cdnControls = document.createElement('script');
        cdnControls.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
        cdnControls.onload = () => resolve();
        cdnControls.onerror = reject;
        document.head.appendChild(cdnControls);
      };
      fallbackThree.onerror = reject;
      document.head.appendChild(fallbackThree);
    };
    document.head.appendChild(threeScript);
  });
  return threeJsLoadPromise;
}

// ----------------------------------------------------------------------------
// TOGGLE & INITIALISIERUNG
// ----------------------------------------------------------------------------
function toggleGameMode() {
  const container = document.getElementById('game-mode-container');
  if (!container) return;

  gameActive = !gameActive;

  if (gameActive) {
    container.classList.remove('hidden');
    ensureThreeJsLoaded().then(() => {
      initGameEngine();
      updateGameHud();
      playSynthGameSound('enter');
      if (typeof stopAmbientSound === 'function') stopAmbientSound(true);
    }).catch((err) => {
      console.warn('Game engine load error:', err);
      if (typeof showToast === 'function') showToast('3D-Spielmodus konnte nicht geladen werden.');
      gameActive = false;
      container.classList.add('hidden');
    });
  } else {
    container.classList.add('hidden');
    shutdownGameEngine();
    playSynthGameSound('exit');
    if (typeof renderBoard === 'function') renderBoard();
  }
}
window.toggleGameMode = toggleGameMode;

function switchGameWorld(worldId) {
  if (!worldPresets[worldId]) return;
  currentGameWorld = worldId;
  
  // UI Tabs aktualisieren
  document.querySelectorAll('[data-world-tab]').forEach(tab => {
    const isActive = tab.getAttribute('data-world-tab') === worldId;
    tab.className = isActive
      ? 'px-3 py-1.5 rounded-xl bg-purple-600 border border-purple-400 text-white font-bold text-xs transition cursor-pointer shadow-md flex items-center gap-1.5'
      : 'px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5';
  });

  if (gameActive) {
    shutdownGameEngine();
    initGameEngine();
    updateGameHud();
    playSynthGameSound('warp');
  }
}
window.switchGameWorld = switchGameWorld;

// ----------------------------------------------------------------------------
// 3D ENGINE INITIALISIERUNG
// ----------------------------------------------------------------------------
function initGameEngine() {
  const parent = document.getElementById('game-canvas-parent');
  if (!parent) return;
  parent.innerHTML = '';

  gameRaycaster = new THREE.Raycaster();
  gameMouse = new THREE.Vector2();

  const cfg = worldPresets[currentGameWorld] || worldPresets.orbit_deck;

  gameScene = new THREE.Scene();
  gameScene.background = new THREE.Color(cfg.bg);
  gameScene.fog = new THREE.FogExp2(cfg.fog, 0.018);

  gameCamera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
  
  gameRenderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  gameRenderer.setSize(window.innerWidth, window.innerHeight);
  gameRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  gameRenderer.shadowMap.enabled = true;
  gameRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
  parent.appendChild(gameRenderer.domElement);

  gameControls = new THREE.OrbitControls(gameCamera, gameRenderer.domElement);
  gameControls.enableDamping = true;
  gameControls.dampingFactor = 0.06;
  gameControls.maxPolarAngle = Math.PI / 2 - 0.01;
  gameControls.minDistance = 3;
  gameControls.maxDistance = 80;

  // Basis-Beleuchtung
  const hemiLight = new THREE.HemisphereLight(cfg.ambient, 0x080810, 0.9);
  gameScene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(cfg.primaryLight, 1.4);
  dirLight.position.set(15, 25, 15);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  gameScene.add(dirLight);

  const pointLight = new THREE.PointLight(cfg.accentLight, 1.2, 40);
  pointLight.position.set(-10, 8, -5);
  gameScene.add(pointLight);

  // Event Listeners
  window.addEventListener('resize', onGameResize);
  gameRenderer.domElement.addEventListener('pointermove', onGamePointerMove);
  gameRenderer.domElement.addEventListener('pointerdown', onGameCanvasClick);

  // Welt-spezifischer Aufbau
  if (currentGameWorld === 'orbit_deck') {
    buildOrbitDeckWorld();
  } else if (currentGameWorld === 'floating_island') {
    buildFloatingIslandWorld();
  } else if (currentGameWorld === 'task_metropolis') {
    buildTaskMetropolisWorld();
  } else if (currentGameWorld === 'galaxy_runner') {
    buildGalaxyRunnerWorld();
  } else if (currentGameWorld === 'quest_adventure') {
    if (typeof buildQuestAdventureWorld === 'function') {
      buildQuestAdventureWorld();
    } else {
      buildOrbitDeckWorld();
    }
  }

  gameActive = true;
  animateGameLoop();
}

  mainLight.position.set(15, 35, 20);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;
  gameScene.add(mainLight);

  if (currentGameWorld === 'cyberpunk') {
    const pLight1 = new THREE.PointLight(0x00f2fe, 3.5, 40);
    pLight1.position.set(-14, 6, -10);
    gameScene.add(pLight1);

    const pLight2 = new THREE.PointLight(0xec4899, 3.5, 40);
    pLight2.position.set(14, 6, 10);
    gameScene.add(pLight2);
  } else if (currentGameWorld === 'rpg') {
    const torch1 = new THREE.PointLight(0xffaa00, 3, 30);
    torch1.position.set(-12, 5, -6);
    gameScene.add(torch1);

    const torch2 = new THREE.PointLight(0xff6600, 3, 30);
    torch2.position.set(12, 5, -6);
    gameScene.add(torch2);
  } else if (currentGameWorld === 'zen') {
    const sunLight = new THREE.PointLight(0x10b981, 2.5, 45);
    sunLight.position.set(0, 18, 0);
    gameScene.add(sunLight);
  }
}

function build3DWorldEnvironment() {
  gameInteractiveObjects = [];
  gameParticles = [];
  gameExplosionParticles = [];

  if (currentGameWorld === 'cyberpunk') {
    buildCyberpunkEnvironment();
  } else if (currentGameWorld === 'rpg') {
    buildRpgGuildhallEnvironment();
  } else if (currentGameWorld === 'zen') {
    buildZenOasisEnvironment();
  }

  generate3DInteractiveTasks();
}

function buildCyberpunkEnvironment() {
  const floorGeo = new THREE.PlaneGeometry(140, 140);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x080814,
    roughness: 0.12,
    metalness: 0.9
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  gameScene.add(floor);

  const grid = new THREE.GridHelper(140, 70, 0x06b6d4, 0x2e1065);
  grid.position.y = 0.02;
  gameScene.add(grid);

  for (let i = 0; i < 28; i++) {
    const h = 12 + Math.random() * 30;
    const w = 2.5 + Math.random() * 3.5;
    const spireGeo = new THREE.BoxGeometry(w, h, w);
    const spireMat = new THREE.MeshStandardMaterial({
      color: 0x0e0e1a,
      roughness: 0.25,
      metalness: 0.8
    });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    const angle = (i / 28) * Math.PI * 2;
    const dist = 32 + Math.random() * 20;
    spire.position.set(Math.cos(angle) * dist, h / 2, Math.sin(angle) * dist);
    spire.castShadow = true;
    gameScene.add(spire);

    const trimGeo = new THREE.BoxGeometry(w * 1.03, 0.5, w * 1.03);
    const trimMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00f2fe : 0xec4899 });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.set(spire.position.x, h - 0.25, spire.position.z);
    gameScene.add(trim);
  }

  createAmbientParticles(0x06b6d4, 0xec4899, 1400);
}

function buildRpgGuildhallEnvironment() {
  const floorGeo = new THREE.PlaneGeometry(120, 120);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x18100c, roughness: 0.85, metalness: 0.15 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  gameScene.add(floor);

  for (let i = 0; i < 14; i++) {
    const pillarGeo = new THREE.CylinderGeometry(1.4, 1.6, 18, 10);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x2a201c, roughness: 0.9 });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    const angle = (i / 14) * Math.PI * 2;
    const dist = 24;
    pillar.position.set(Math.cos(angle) * dist, 9, Math.sin(angle) * dist);
    pillar.castShadow = true;
    gameScene.add(pillar);
  }

  const ringGeo = new THREE.RingGeometry(3.5, 4.0, 36);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.04;
  gameScene.add(ring);

  createAmbientParticles(0xf59e0b, 0xd97706, 800);
}

function buildZenOasisEnvironment() {
  const islandGeo = new THREE.CylinderGeometry(22, 18, 4.5, 36);
  const islandMat = new THREE.MeshStandardMaterial({ color: 0x122416, roughness: 0.8 });
  const island = new THREE.Mesh(islandGeo, islandMat);
  island.position.y = -2.25;
  island.receiveShadow = true;
  gameScene.add(island);

  const waterGeo = new THREE.RingGeometry(22.5, 50, 48);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    roughness: 0.1,
    metalness: 0.85,
    transparent: true,
    opacity: 0.7
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.y = -4.0;
  gameScene.add(water);

  createAmbientParticles(0x38bdf8, 0xf472b6, 900);
}

function createAmbientParticles(col1, col2, count) {
  const geom = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i += 3) {
    pos[i] = (Math.random() - 0.5) * 90;
    pos[i + 1] = Math.random() * 30;
    pos[i + 2] = (Math.random() - 0.5) * 90;
  }
  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: col1,
    size: 0.3,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  const system = new THREE.Points(geom, mat);
  gameScene.add(system);
  gameParticles.push(system);
}

// Erzeuge gestochen scharfe Hologramm-Labels auf 3D-Canvas-Texturen
function create3DTaskBillboardSprite(taskText, category) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');

  // Background Glass Pill
  ctx.fillStyle = 'rgba(12, 12, 24, 0.92)';
  ctx.roundRect(10, 10, 492, 160, 24);
  ctx.fill();

  // Glow Border
  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 4;
  ctx.roundRect(10, 10, 492, 160, 24);
  ctx.stroke();

  // Category Badge
  ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
  ctx.roundRect(24, 24, 160, 34, 10);
  ctx.fill();
  ctx.fillStyle = '#67e8f9';
  ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`[ ${category.toUpperCase()} ]`, 36, 48);

  // XP Reward Badge
  ctx.fillStyle = 'rgba(236, 72, 153, 0.25)';
  ctx.roundRect(340, 24, 148, 34, 10);
  ctx.fill();
  ctx.fillStyle = '#f472b6';
  ctx.font = 'bold 17px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('+35 XP 🌟', 360, 48);

  // Main Task Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
  let displayText = taskText.length > 28 ? taskText.substring(0, 26) + '...' : taskText;
  ctx.fillText(displayText, 28, 105);

  // Subtitle Click Action
  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('⚡ Klick zum Lösen & Schaden austeilen', 28, 142);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  ctx.font = 'bold 30px sans-serif';
  
  const words = String(taskText).split(' ');
  let line = '';
  let y = 110;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 440 && n > 0) {
      ctx.fillText(line, 32, y);
      line = words[n] + ' ';
      y += 40;
      if (y > 200) break;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 32, y);

  return new THREE.CanvasTexture(canvas);
}

// ----------------------------------------------------------------------------
// 3D AUFGABEN-SPAWNER
// ----------------------------------------------------------------------------
function spawn3DTasksInOrbit() {
  gameInteractiveObjects = [];
  const tasks = getAllOpenTasksList();
  if (tasks.length === 0) return;

  const count = tasks.length;
  const radius = 14;

  tasks.forEach((t, i) => {
    const angle = (i / count) * Math.PI * 2;
    const group = new THREE.Group();
    group.position.set(Math.cos(angle) * radius, 3 + Math.sin(i) * 1.5, Math.sin(angle) * radius);
    group.lookAt(0, 3, 0);

    const crystalGeo = new THREE.OctahedronGeometry(1.2, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.9
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalMesh.castShadow = true;
    group.add(crystalMesh);

    const cardTex = create3DTaskCardTexture(t.text, t.cat);
    const cardGeo = new THREE.PlaneGeometry(3.6, 1.8);
    const cardMat = new THREE.MeshBasicMaterial({ map: cardTex, transparent: true, side: THREE.DoubleSide });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    cardMesh.position.y = 2.2;
    group.add(cardMesh);

    group.userData = {
      taskData: t,
      baseY: group.position.y,
      seed: i,
      mainMesh: crystalMesh,
      cardMesh: cardMesh
    };

    gameScene.add(group);
    gameInteractiveObjects.push(group);
  });
}

function spawn3DTasksAsLanterns() {
  gameInteractiveObjects = [];
  const tasks = getAllOpenTasksList();
  if (tasks.length === 0) return;

  tasks.forEach((t, i) => {
    const angle = (i / tasks.length) * Math.PI * 2;
    const r = 7 + (i % 3) * 3;
    const group = new THREE.Group();
    group.position.set(Math.cos(angle) * r, 2.5 + Math.sin(i * 2) * 0.8, Math.sin(angle) * r);

    const lanternGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.4, 8);
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      emissive: 0xd97706,
      emissiveIntensity: 0.8,
      roughness: 0.3
    });
    const lanternMesh = new THREE.Mesh(lanternGeo, lanternMat);
    group.add(lanternMesh);

    const cardTex = create3DTaskCardTexture(t.text, t.cat);
    const cardGeo = new THREE.PlaneGeometry(3.0, 1.5);
    const cardMat = new THREE.MeshBasicMaterial({ map: cardTex, transparent: true, side: THREE.DoubleSide });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    cardMesh.position.y = 1.8;
    group.add(cardMesh);

    group.userData = {
      taskData: t,
      baseY: group.position.y,
      seed: i,
      mainMesh: lanternMesh,
      cardMesh: cardMesh
    };

    gameScene.add(group);
    gameInteractiveObjects.push(group);
  });
}

function spawn3DTasksAsCityProjects() {
  gameInteractiveObjects = [];
  const tasks = getAllOpenTasksList();
  if (tasks.length === 0) return;

  const cols = Math.ceil(Math.sqrt(tasks.length));
  tasks.forEach((t, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const posX = (col - cols / 2) * 7 + 4;
    const posZ = (row - cols / 2) * 7 + 4;

    const group = new THREE.Group();
    group.position.set(posX, 0, posZ);

    const height = 3 + (i % 4) * 2;
    const bldgGeo = new THREE.BoxGeometry(3.2, height, 3.2);
    const bldgMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x1e3a8a,
      roughness: 0.3,
      metalness: 0.7
    });
    const bldgMesh = new THREE.Mesh(bldgGeo, bldgMat);
    bldgMesh.position.y = height / 2;
    bldgMesh.castShadow = true;
    bldgMesh.receiveShadow = true;
    group.add(bldgMesh);

    const cardTex = create3DTaskCardTexture(t.text, t.cat);
    const cardGeo = new THREE.PlaneGeometry(3.6, 1.8);
    const cardMat = new THREE.MeshBasicMaterial({ map: cardTex, transparent: true, side: THREE.DoubleSide });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    cardMesh.position.y = height + 1.4;
    group.add(cardMesh);

    group.userData = {
      taskData: t,
      baseY: 0,
      seed: i,
      mainMesh: bldgMesh,
      cardMesh: cardMesh
    };

    gameScene.add(group);
    gameInteractiveObjects.push(group);
  });
}

function spawn3DTasksAsFlightBeacons() {
  gameInteractiveObjects = [];
  const tasks = getAllOpenTasksList();
  if (tasks.length === 0) return;

  tasks.forEach((t, i) => {
    const group = new THREE.Group();
    const lane = ((i % 3) - 1) * 6;
    const dist = -15 - i * 14;
    group.position.set(lane, 2.5 + (i % 2) * 1.5, dist);

    const beaconGeo = new THREE.DodecahedronGeometry(1.4, 0);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xbe185d,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.8
    });
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    group.add(beaconMesh);

    const cardTex = create3DTaskCardTexture(t.text, t.cat);
    const cardGeo = new THREE.PlaneGeometry(4.0, 2.0);
    const cardMat = new THREE.MeshBasicMaterial({ map: cardTex, transparent: true, side: THREE.DoubleSide });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    cardMesh.position.y = 2.4;
    group.add(cardMesh);

    group.userData = {
      taskData: t,
      baseY: group.position.y,
      seed: i,
      mainMesh: beaconMesh,
      cardMesh: cardMesh
    };

    gameScene.add(group);
    gameInteractiveObjects.push(group);
  });
}

// ----------------------------------------------------------------------------
// 3D GEOMETRIE HILFSFUNKTIONEN
// ----------------------------------------------------------------------------
function createStarfieldParticles(count, spread) {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * spread;
    positions[i + 1] = Math.random() * spread * 0.6;
    positions[i + 2] = (Math.random() - 0.5) * spread;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.4, transparent: true, opacity: 0.8 });
  const points = new THREE.Points(geo, mat);
  gameScene.add(points);
  return points;
}

function createPetalParticles(count) {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 30;
    positions[i + 1] = 1 + Math.random() * 15;
    positions[i + 2] = (Math.random() - 0.5) * 30;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0xf472b6, size: 0.35, transparent: true, opacity: 0.9 });
  const points = new THREE.Points(geo, mat);
  gameScene.add(points);
  gameAnimatedObjects.push({
    update(time) {
      const pos = points.geometry.attributes.position.array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] -= 0.03;
        if (pos[i] < 0) pos[i] = 15;
      }
      points.geometry.attributes.position.needsUpdate = true;
    }
  });
}

function createWarpTunnelParticles(count) {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 35;
    positions[i + 1] = (Math.random() - 0.5) * 20;
    positions[i + 2] = -Math.random() * 120;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.6, transparent: true, opacity: 0.9 });
  const points = new THREE.Points(geo, mat);
  gameScene.add(points);
  return points;
}

function createToriiGate() {
  const group = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
  
  const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5, 8), woodMat);
  p1.position.set(-2, 2.5, 0);
  const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5, 8), woodMat);
  p2.position.set(2, 2.5, 0);
  
  const top = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.4, 0.5), woodMat);
  top.position.set(0, 4.8, 0);
  
  group.add(p1);
  group.add(p2);
  group.add(top);
  return group;
}

function createStylizedTree() {
  const group = new THREE.Group();
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
  const leavesMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.7 });

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 3, 8), trunkMat);
  trunk.position.y = 1.5;
  group.add(trunk);

  const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6, 1), leavesMat);
  leaves.position.y = 3.5;
  group.add(leaves);
  return group;
}

function createCityClockTower() {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6, roughness: 0.3 });
  
  const body = new THREE.Mesh(new THREE.BoxGeometry(4, 14, 4), mat);
  body.position.y = 7;
  group.add(body);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(3.5, 4, 4), mat);
  roof.position.y = 16;
  roof.rotation.y = Math.PI / 4;
  group.add(roof);
  return group;
}

function spawnMetropolisBuildings() {
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * Math.PI * 2;
    const r = 16 + (i % 2) * 5;
    const h = 4 + (i % 5) * 2.5;
    const bldg = new THREE.Mesh(
      new THREE.BoxGeometry(3, h, 3),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.8 })
    );
    bldg.position.set(Math.cos(angle) * r, h / 2, Math.sin(angle) * r);
    bldg.castShadow = true;
    bldg.receiveShadow = true;
    gameScene.add(bldg);
  }
}

function createCockpitMesh() {
  const group = new THREE.Group();
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, metalness: 0.9, roughness: 0.2 });
  
  const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6, 0.4), frameMat);
  leftPillar.position.set(-3.5, 2, 0);
  leftPillar.rotation.z = -0.2;
  
  const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6, 0.4), frameMat);
  rightPillar.position.set(3.5, 2, 0);
  rightPillar.rotation.z = 0.2;
  
  const dash = new THREE.Mesh(new THREE.BoxGeometry(8, 1.2, 2), frameMat);
  dash.position.set(0, -0.5, 0);

  group.add(leftPillar);
  group.add(rightPillar);
  group.add(dash);
  return group;
}

// ----------------------------------------------------------------------------
// GAME LOOP & INTERAKTIONEN
// ----------------------------------------------------------------------------
function animateGameLoop() {
  if (!gameActive || !gameRenderer || !gameScene || !gameCamera) return;

  gameTime += 0.016;

  // 1. Schwebende Aufgaben animieren
  gameInteractiveObjects.forEach(group => {
    const { baseY, seed, mainMesh, cardMesh } = group.userData;
    group.position.y = baseY + Math.sin(gameTime * 2 + seed) * 0.25;

    if (mainMesh) {
      mainMesh.rotation.y += 0.015;
      mainMesh.rotation.x += 0.008;
    }

    if (cardMesh) {
      cardMesh.lookAt(gameCamera.position);
    }

    if (gameHoveredObject === group) {
      group.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.15);
    } else {
      group.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
    }
  });

  // 2. Welt-spezifische animierte Objekte
  gameAnimatedObjects.forEach(obj => {
    if (obj.update) obj.update(gameTime);
  });

  // 3. Partikel-Explosionen updaten
  for (let i = gameExplosionParticles.length - 1; i >= 0; i--) {
    const p = gameExplosionParticles[i];
    p.mesh.position.add(p.velocity);
    p.mesh.scale.multiplyScalar(0.94);
    p.life -= 0.03;
    if (p.life <= 0) {
      gameScene.remove(p.mesh);
      if (p.mesh.geometry) p.mesh.geometry.dispose();
      if (p.mesh.material) p.mesh.material.dispose();
      gameExplosionParticles.splice(i, 1);
    }
  }

  // 4. OrbitControls
  if (gameControls) gameControls.update();

  gameRenderer.render(gameScene, gameCamera);
  gameFrameId = requestAnimationFrame(animateGameLoop);
}

function onGamePointerMove(event) {
  if (!gameActive || !gameCamera || !gameScene) return;

  const rect = gameRenderer.domElement.getBoundingClientRect();
  gameMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  gameMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  gameRaycaster.setFromCamera(gameMouse, gameCamera);
  const intersects = gameRaycaster.intersectObjects(gameInteractiveObjects, true);

  if (intersects.length > 0) {
    let topGroup = intersects[0].object;
    while (topGroup.parent && topGroup.parent !== gameScene) {
      topGroup = topGroup.parent;
    }
    gameHoveredObject = topGroup;
    document.body.style.cursor = 'pointer';
  } else {
    gameHoveredObject = null;
    document.body.style.cursor = 'default';
  }
}

function onGameCanvasClick(event) {
  if (!gameActive || !gameCamera || !gameScene) return;

  const rect = gameRenderer.domElement.getBoundingClientRect();
  gameMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  gameMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  gameRaycaster.setFromCamera(gameMouse, gameCamera);
  const intersects = gameRaycaster.intersectObjects(gameInteractiveObjects, true);

  if (intersects.length > 0) {
    let topGroup = intersects[0].object;
    while (topGroup.parent && topGroup.parent !== gameScene) {
      topGroup = topGroup.parent;
    }
    handle3DTaskClick(topGroup, intersects[0].point);
  }
}

function handle3DTaskClick(taskGroup, hitPoint) {
  const data = taskGroup.userData.taskData;
  if (!data) return;

  gameActiveTaskItem = data;

  if (gameControls) {
    gameControls.target.lerp(taskGroup.position, 0.4);
  }

  playSynthGameSound('select');
  createExplosionVFX(hitPoint || taskGroup.position, 0xa855f7, 16);

  const bannerText = document.getElementById('game-active-quest-text');
  if (bannerText) {
    bannerText.innerHTML = `
      <div class="flex items-center justify-between gap-3 text-left">
        <div>
          <span class="text-[10px] text-purple-300 font-mono uppercase font-bold">[ ${escapeHtml(t(data.cat))} ]</span>
          <h3 class="text-sm font-bold text-white leading-tight">${escapeHtml(data.text)}</h3>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button onclick="completeTaskIn3D('${data.cat}', ${data.index})" class="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl transition cursor-pointer shadow-md flex items-center gap-1">
            <span>✓ Erledigen</span>
          </button>
          <button onclick="startFocusFor3DTask('${escapeHtml(data.text)}', '${data.cat}')" class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md flex items-center gap-1">
            <span>⚡ Fokus</span>
          </button>
        </div>
      </div>
    `;
  }
}

function completeTaskIn3D(cat, idx) {
  if (typeof toggleItem === 'function') {
    toggleItem(cat, idx);
    playSynthGameSound('complete');
    addGameXP(120);

    if (typeof triggerSparkleEffect === 'function') triggerSparkleEffect();

    setTimeout(() => {
      if (gameActive) {
        shutdownGameEngine();
        initGameEngine();
      }
    }, 400);
  }
}
window.completeTaskIn3D = completeTaskIn3D;

function startFocusFor3DTask(taskText, cat) {
  if (typeof startZenWithTask === 'function') {
    startZenWithTask(taskText, cat);
  }
  if (typeof toggleGameMode === 'function') {
    toggleGameMode();
  }
}
window.startFocusFor3DTask = startFocusFor3DTask;

function createExplosionVFX(pos, colorHex, count = 20) {
  for (let i = 0; i < count; i++) {
    const geo = new THREE.SphereGeometry(0.12, 6, 6);
    const mat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    gameScene.add(mesh);

    gameExplosionParticles.push({
      mesh: mesh,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.2) * 0.4,
        (Math.random() - 0.5) * 0.4
      ),
      life: 1.0
    });
  }
}

function onGameResize() {
  if (!gameCamera || !gameRenderer) return;
  gameCamera.aspect = window.innerWidth / window.innerHeight;
  gameCamera.updateProjectionMatrix();
  gameRenderer.setSize(window.innerWidth, window.innerHeight);
}

// ----------------------------------------------------------------------------
// XP & HUD SYSTEM
// ----------------------------------------------------------------------------
function addGameXP(amount) {
  playerXp += amount;
  const needed = playerLevel * 250;
  if (playerXp >= needed) {
    playerXp -= needed;
    playerLevel++;
    playSynthGameSound('levelup');
    if (typeof showToast === 'function') {
      showToast(`🎉 Level Up! Du bist jetzt Level ${playerLevel}! 👑`);
    }
  }
  localStorage.setItem('flow_game_level', playerLevel);
  localStorage.setItem('flow_game_xp', playerXp);
  updateGameHud();
}

function updateGameHud() {
  const lvlEl = document.getElementById('game-player-level');
  const barEl = document.getElementById('game-player-xp-bar');
  if (lvlEl) lvlEl.innerText = `LVL ${playerLevel}`;
  if (barEl) {
    const pct = Math.min(100, Math.round((playerXp / (playerLevel * 250)) * 100));
    barEl.style.width = `${pct}%`;
  }
}

// ----------------------------------------------------------------------------
// SYNTH GAME SOUNDS (Web Audio API)
// ----------------------------------------------------------------------------
function playSynthGameSound(type) {
  if (!gameSfxEnabled || (typeof window.AudioContext === 'undefined' && typeof window.webkitAudioContext === 'undefined')) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'enter') {
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'warp') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.4);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'select') {
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'complete') {
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      osc.frequency.setValueAtTime(1046.50, now + 0.3);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'levelup') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.5);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  } catch (e) {}
}

// ----------------------------------------------------------------------------
// MEMORY SHUTDOWN & CLEANUP
// ----------------------------------------------------------------------------
function shutdownGameEngine() {
  gameActive = false;
  if (gameFrameId) {
    cancelAnimationFrame(gameFrameId);
    gameFrameId = null;
  }

  window.removeEventListener('resize', onGameResize);
  if (gameRenderer && gameRenderer.domElement) {
    gameRenderer.domElement.removeEventListener('pointermove', onGamePointerMove);
    gameRenderer.domElement.removeEventListener('pointerdown', onGameCanvasClick);
  }

  if (gameScene) {
    gameScene.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach(mat => {
          ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'specularMap', 'alphaMap'].forEach(prop => {
            if (mat[prop] && typeof mat[prop].dispose === 'function') mat[prop].dispose();
          });
          mat.dispose();
        });
      }
    });
  }

  if (gameRenderer) {
    gameRenderer.dispose();
    if (gameRenderer.forceContextLoss) {
      try { gameRenderer.forceContextLoss(); } catch (e) {}
    }
  }

  gameInteractiveObjects = [];
  gameParticles = [];
  gameExplosionParticles = [];
  gameAnimatedObjects = [];
  gameScene = null;
  gameCamera = null;
  gameRenderer = null;
  gameControls = null;
  gameHoveredObject = null;
  document.body.style.cursor = 'default';
}
window.shutdownGameEngine = shutdownGameEngine;


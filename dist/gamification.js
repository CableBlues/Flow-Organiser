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
window.worldPresets = worldPresets;

let threeJsLoadPromise = null;
function ensureThreeJsLoaded() {
  if (typeof window !== 'undefined' && window.THREE && (window.THREE.OrbitControls || (typeof THREE !== 'undefined' && THREE.OrbitControls))) {
    return Promise.resolve();
  }
  if (threeJsLoadPromise) return threeJsLoadPromise;

  threeJsLoadPromise = new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.THREE && (window.THREE.OrbitControls || (typeof THREE !== 'undefined' && THREE.OrbitControls))) {
      resolve();
      return;
    }

    function loadScript(src) {
      return new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => res();
        s.onerror = (e) => rej(e);
        document.head.appendChild(s);
      });
    }

    loadScript('vendor/three.min.js')
      .catch(() => loadScript('./vendor/three.min.js'))
      .catch(() => loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'))
      .then(() => {
        return loadScript('vendor/OrbitControls.js')
          .catch(() => loadScript('./vendor/OrbitControls.js'))
          .catch(() => loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js'));
      })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        threeJsLoadPromise = null;
        reject(err);
      });
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
  gameScene.fog = new THREE.FogExp2(cfg.fog, 0.015);

  gameCamera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 300);
  gameCamera.position.set(0, 16, 28);
  gameCamera.lookAt(0, 2, 0);
  
  gameRenderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  gameRenderer.setSize(window.innerWidth, window.innerHeight);
  gameRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  gameRenderer.shadowMap.enabled = true;
  gameRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
  parent.appendChild(gameRenderer.domElement);

  gameControls = new THREE.OrbitControls(gameCamera, gameRenderer.domElement);
  gameControls.enableDamping = true;
  gameControls.dampingFactor = 0.06;
  gameControls.target.set(0, 2, 0);
  gameControls.maxPolarAngle = Math.PI / 2 - 0.01;
  gameControls.minDistance = 3;
  gameControls.maxDistance = 100;
  gameControls.update();

  // Globale Beleuchtung (Ambient, Hemisphäre & Direktional)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  gameScene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(cfg.primaryLight || 0x38bdf8, 0x111122, 1.2);
  gameScene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
  dirLight.position.set(20, 35, 20);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  gameScene.add(dirLight);

  const pointLight = new THREE.PointLight(cfg.accentLight || 0xa855f7, 2.0, 50);
  pointLight.position.set(-10, 10, -5);
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

// ----------------------------------------------------------------------------
// 3D WELTEN-GENERATOREN (HOCHQUALITATIVE ENVIRONMENTS)
// ----------------------------------------------------------------------------

function buildOrbitDeckWorld() {
  gameInteractiveObjects = [];
  gameParticles = [];
  gameExplosionParticles = [];

  // Sci-Fi Holographic Floor
  const floorGeo = new THREE.CylinderGeometry(40, 42, 2, 48);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a18,
    roughness: 0.15,
    metalness: 0.85
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = -1;
  floor.receiveShadow = true;
  gameScene.add(floor);

  // Holographic Deck Grid
  const grid = new THREE.GridHelper(70, 35, 0x00f2fe, 0x818cf8);
  grid.position.y = 0.02;
  gameScene.add(grid);

  // Outer Sci-Fi Holo-Rings
  for (let i = 0; i < 3; i++) {
    const ringGeo = new THREE.RingGeometry(38 + i * 8, 39 + i * 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: i === 0 ? 0x00f2fe : (i === 1 ? 0x818cf8 : 0xec4899),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05 + i * 0.02;
    gameScene.add(ring);
  }

  // Sci-Fi Command Pillars
  for (let i = 0; i < 12; i++) {
    const h = 8 + (i % 3) * 4;
    const pillarGeo = new THREE.BoxGeometry(2, h, 2);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x121226,
      roughness: 0.2,
      metalness: 0.9
    });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    const angle = (i / 12) * Math.PI * 2;
    const dist = 32;
    pillar.position.set(Math.cos(angle) * dist, h / 2, Math.sin(angle) * dist);
    pillar.castShadow = true;
    gameScene.add(pillar);

    // Glowing Neon Cap
    const capGeo = new THREE.BoxGeometry(2.1, 0.4, 2.1);
    const capMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(pillar.position.x, h, pillar.position.z);
    gameScene.add(cap);
  }

  createAmbientParticles(0x00f2fe, 0x818cf8, 1200);
  generate3DInteractiveTasks();
}

function buildFloatingIslandWorld() {
  gameInteractiveObjects = [];
  gameParticles = [];
  gameExplosionParticles = [];

  // Floating Zen Island
  const islandGeo = new THREE.CylinderGeometry(26, 16, 8, 36);
  const islandMat = new THREE.MeshStandardMaterial({
    color: 0x0d2818,
    roughness: 0.8,
    metalness: 0.1
  });
  const island = new THREE.Mesh(islandGeo, islandMat);
  island.position.y = -4;
  island.receiveShadow = true;
  gameScene.add(island);

  // Water / Crystal Lake
  const lakeGeo = new THREE.CircleGeometry(14, 32);
  const lakeMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    roughness: 0.05,
    metalness: 0.9,
    transparent: true,
    opacity: 0.85
  });
  const lake = new THREE.Mesh(lakeGeo, lakeMat);
  lake.rotation.x = -Math.PI / 2;
  lake.position.y = 0.03;
  gameScene.add(lake);

  // Floating Crystals & Zen Lanterns
  for (let i = 0; i < 8; i++) {
    const crystalGeo = new THREE.OctahedronGeometry(1.5 + Math.random() * 0.8, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x059669,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.7
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    const angle = (i / 8) * Math.PI * 2;
    const dist = 19;
    crystal.position.set(Math.cos(angle) * dist, 4 + Math.sin(i) * 1.5, Math.sin(angle) * dist);
    gameScene.add(crystal);
    gameParticles.push(crystal);
  }

  createAmbientParticles(0x34d399, 0x6ee7b7, 1000);
  generate3DInteractiveTasks();
}

function buildTaskMetropolisWorld() {
  gameInteractiveObjects = [];
  gameParticles = [];
  gameExplosionParticles = [];

  // Dark City Grid Floor
  const floorGeo = new THREE.PlaneGeometry(160, 160);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x05050d,
    roughness: 0.1,
    metalness: 0.9
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  gameScene.add(floor);

  const grid = new THREE.GridHelper(160, 80, 0x00f2fe, 0xec4899);
  grid.position.y = 0.02;
  gameScene.add(grid);

  // 3D Skyscrapers & Cyber Spires
  for (let i = 0; i < 30; i++) {
    const h = 16 + Math.random() * 38;
    const w = 3.5 + Math.random() * 4;
    const spireGeo = new THREE.BoxGeometry(w, h, w);
    const spireMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a16,
      roughness: 0.2,
      metalness: 0.8
    });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    const angle = (i / 30) * Math.PI * 2;
    const dist = 36 + Math.random() * 24;
    spire.position.set(Math.cos(angle) * dist, h / 2, Math.sin(angle) * dist);
    spire.castShadow = true;
    gameScene.add(spire);

    // Neon Rooftop Light
    const trimGeo = new THREE.BoxGeometry(w * 1.04, 0.6, w * 1.04);
    const trimMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00f2fe : 0xec4899 });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.set(spire.position.x, h - 0.3, spire.position.z);
    gameScene.add(trim);
  }

  createAmbientParticles(0x00f2fe, 0xec4899, 1500);
  generate3DInteractiveTasks();
}

function buildGalaxyRunnerWorld() {
  gameInteractiveObjects = [];
  gameParticles = [];
  gameExplosionParticles = [];

  // Hyperspace Tunnel Rings
  for (let i = 0; i < 15; i++) {
    const ringGeo = new THREE.TorusGeometry(12 + i * 1.5, 0.4, 16, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0xec4899 : 0x8b5cf6,
      transparent: true,
      opacity: 0.85
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.z = -50 + i * 15;
    gameScene.add(ring);
    gameParticles.push(ring);
  }

  // Warp Speedlines
  const geom = new THREE.BufferGeometry();
  const count = 2000;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i += 3) {
    pos[i] = (Math.random() - 0.5) * 80;
    pos[i + 1] = (Math.random() - 0.5) * 40;
    pos[i + 2] = (Math.random() - 0.5) * 120;
  }
  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.4,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  const warpStars = new THREE.Points(geom, mat);
  gameScene.add(warpStars);
  gameParticles.push(warpStars);

  generate3DInteractiveTasks();
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

// ----------------------------------------------------------------------------
// AUFGABEN-DATEN & 3D TEXTUREN
// ----------------------------------------------------------------------------

function getAllOpenTasksList() {
  const result = [];
  const curItems = (typeof getCurrentWorkspaceItems === 'function') 
    ? getCurrentWorkspaceItems() 
    : (typeof state !== 'undefined' && state && state.items ? state.items : {});
  
  if (curItems && typeof curItems === 'object') {
    Object.keys(curItems).forEach(cat => {
      if (cat === 'done') return;
      const list = curItems[cat];
      if (!Array.isArray(list)) return;

      list.forEach((item, idx) => {
        const taskText = typeof item === 'string' ? item : (item && item.task ? item.task : '');
        if (taskText && taskText.trim()) {
          result.push({
            id: `${cat}_${idx}`,
            cat: cat,
            index: idx,
            text: taskText.trim()
          });
        }
      });
    });
  }

  if (result.length === 0) {
    result.push(
      { id: 'daily_0', cat: 'daily', index: 0, text: 'Tagesfokus setzen 🎯' },
      { id: 'todo_0', cat: 'todo', index: 0, text: 'Wichtige Aufgabe erledigen ⚡' },
      { id: 'weekly_0', cat: 'weekly', index: 0, text: 'Wochenziel erreichen 🏆' },
      { id: 'notes_0', cat: 'notes', index: 0, text: 'Gedanken notieren 💡' }
    );
  }
  return result;
}

function generate3DInteractiveTasks() {
  if (currentGameWorld === 'floating_island') {
    spawn3DTasksAsLanterns();
  } else if (currentGameWorld === 'task_metropolis') {
    spawn3DTasksAsCityProjects();
  } else if (currentGameWorld === 'galaxy_runner') {
    spawn3DTasksAsFlightBeacons();
  } else {
    spawn3DTasksInOrbit();
  }
}

// Erzeuge gestochen scharfe Hologramm-Labels auf 3D-Canvas-Texturen (1024x512 Retina Ultra-HD)
function create3DTaskCardTexture(taskText, category) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Background Glass Pill
  ctx.fillStyle = 'rgba(10, 10, 24, 0.96)';
  if (ctx.roundRect) {
    ctx.roundRect(16, 16, 992, 480, 40);
  } else {
    ctx.rect(16, 16, 992, 480);
  }
  ctx.fill();

  // Vibrant Neon Glow Border
  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 8;
  if (ctx.roundRect) {
    ctx.roundRect(16, 16, 992, 480, 40);
  } else {
    ctx.rect(16, 16, 992, 480);
  }
  ctx.stroke();

  // Category Badge
  ctx.fillStyle = 'rgba(6, 182, 212, 0.35)';
  if (ctx.roundRect) ctx.roundRect(40, 36, 320, 64, 18);
  else ctx.rect(40, 36, 320, 64);
  ctx.fill();
  ctx.fillStyle = '#67e8f9';
  ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
  const catLabel = (typeof t === 'function') ? t(category) : category;
  ctx.fillText(`[ ${String(catLabel || category).toUpperCase()} ]`, 60, 80);

  // XP Reward Badge
  ctx.fillStyle = 'rgba(236, 72, 153, 0.35)';
  if (ctx.roundRect) ctx.roundRect(700, 36, 280, 64, 18);
  else ctx.rect(700, 36, 280, 64);
  ctx.fill();
  ctx.fillStyle = '#f472b6';
  ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('+35 XP 🌟', 730, 80);

  // Main Task Text (Große, gestochen scharfe Schrift)
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 12;
  const rawText = String(taskText || '').trim();
  const fontSize = rawText.length > 35 ? 42 : 52;
  ctx.font = `bold ${fontSize}px "Plus Jakarta Sans", sans-serif`;

  const words = rawText.split(' ');
  let line = '';
  let y = 190;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 900 && n > 0) {
      ctx.fillText(line, 50, y);
      line = words[n] + ' ';
      y += (fontSize + 16);
      if (y > 360) {
        line += '...';
        break;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 50, y);
  ctx.shadowBlur = 0;

  // Subtitle Click Action
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  if (ctx.roundRect) ctx.roundRect(40, 400, 944, 70, 16);
  else ctx.rect(40, 400, 944, 70);
  ctx.fill();

  ctx.fillStyle = '#a5f3fc';
  ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('⚡ Klick zum Lösen / Fokus starten', 60, 446);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

// ----------------------------------------------------------------------------
// 3D AUFGABEN-SPAWNER
// ----------------------------------------------------------------------------
function spawn3DTasksInOrbit() {
  gameInteractiveObjects = [];
  const tasks = getAllOpenTasksList();
  if (tasks.length === 0) return;

  const count = tasks.length;

  tasks.forEach((t, i) => {
    const angle = (i / count) * Math.PI * 2;
    const r = count > 8 ? (12 + (i % 2) * 5.5) : 13;
    const yOffset = 3.2 + (i % 3) * 1.5;

    const group = new THREE.Group();
    group.position.set(Math.cos(angle) * r, yOffset, Math.sin(angle) * r);
    group.lookAt(0, yOffset, 0);

    const crystalGeo = new THREE.OctahedronGeometry(1.4, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.7,
      roughness: 0.1,
      metalness: 0.9
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalMesh.castShadow = true;
    group.add(crystalMesh);

    const cardTex = create3DTaskCardTexture(t.text, t.cat);
    const cardGeo = new THREE.PlaneGeometry(6.0, 3.0);
    const cardMat = new THREE.MeshBasicMaterial({ 
      map: cardTex, 
      transparent: true, 
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    cardMesh.position.y = 2.6;
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
    const r = 8 + (i % 2) * 4;
    const yOffset = 2.8 + (i % 3) * 1.2;

    const group = new THREE.Group();
    group.position.set(Math.cos(angle) * r, yOffset, Math.sin(angle) * r);

    const lanternGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.6, 8);
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      emissive: 0xd97706,
      emissiveIntensity: 0.9,
      roughness: 0.3
    });
    const lanternMesh = new THREE.Mesh(lanternGeo, lanternMat);
    group.add(lanternMesh);

    const cardTex = create3DTaskCardTexture(t.text, t.cat);
    const cardGeo = new THREE.PlaneGeometry(5.6, 2.8);
    const cardMat = new THREE.MeshBasicMaterial({ 
      map: cardTex, 
      transparent: true, 
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    cardMesh.position.y = 2.4;
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
    const posX = (col - cols / 2) * 8 + 4;
    const posZ = (row - cols / 2) * 8 + 4;

    const group = new THREE.Group();
    group.position.set(posX, 0, posZ);

    const height = 4 + (i % 4) * 2.5;
    const bldgGeo = new THREE.BoxGeometry(3.6, height, 3.6);
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
    const cardGeo = new THREE.PlaneGeometry(5.8, 2.9);
    const cardMat = new THREE.MeshBasicMaterial({ 
      map: cardTex, 
      transparent: true, 
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    cardMesh.position.y = height + 1.8;
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
    const lane = ((i % 3) - 1) * 7;
    const dist = -15 - i * 16;
    group.position.set(lane, 3.0 + (i % 2) * 1.8, dist);

    const beaconGeo = new THREE.DodecahedronGeometry(1.6, 0);
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
    const cardGeo = new THREE.PlaneGeometry(6.2, 3.1);
    const cardMat = new THREE.MeshBasicMaterial({ 
      map: cardTex, 
      transparent: true, 
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    cardMesh.position.y = 2.8;
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
    if (!group || !group.userData) return;
    const baseY = typeof group.userData.baseY === 'number' ? group.userData.baseY : 0;
    const seed = typeof group.userData.seed === 'number' ? group.userData.seed : 0;
    const mainMesh = group.userData.mainMesh;
    const cardMesh = group.userData.cardMesh;

    group.position.y = baseY + Math.sin(gameTime * 2 + seed) * 0.25;

    if (mainMesh) {
      mainMesh.rotation.y += 0.015;
      mainMesh.rotation.x += 0.008;
    }

    if (cardMesh && gameCamera) {
      cardMesh.lookAt(gameCamera.position);
    }

    if (gameHoveredObject === group) {
      group.scale.lerp(new THREE.Vector3(1.4, 1.4, 1.4), 0.2);
    } else {
      group.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
    }
  });

  // 2. Welt-spezifische animierte Objekte
  gameAnimatedObjects.forEach(obj => {
    if (obj && typeof obj.update === 'function') {
      try { obj.update(gameTime); } catch (e) {}
    }
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
    try { gameRenderer.dispose(); } catch (e) {}
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
if (typeof window !== 'undefined') {
  window.worldPresets = worldPresets;
  window.toggleGameMode = toggleGameMode;
  window.switchGameWorld = switchGameWorld;
  window.addGameXP = addGameXP;
  window.updateGameHud = updateGameHud;
  window.shutdownGameEngine = shutdownGameEngine;
}
if (typeof globalThis !== 'undefined') {
  globalThis.worldPresets = worldPresets;
  globalThis.toggleGameMode = toggleGameMode;
  globalThis.switchGameWorld = switchGameWorld;
  globalThis.addGameXP = addGameXP;
  globalThis.updateGameHud = updateGameHud;
  globalThis.shutdownGameEngine = shutdownGameEngine;
}


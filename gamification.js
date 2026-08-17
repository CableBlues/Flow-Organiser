// gamification.js Teil 1/2: 3D-Spielmodus Setup, Welt-Aufbau & Task-Objekte
// =========================================================================
// FLOW 3D GAMIFICATION MODULE (gamification.js)
// Professional Modular Three.js Game Engine integration for task completion
// =========================================================================

let gameScene, gameCamera, gameRenderer, gameControls;
let gameActive = false;
let gameInteractiveObjects = [];
let currentGameWorld = 'space';
let gameSfxEnabled = true;
let gameFrameId = null;

let playerLevel = parseInt(localStorage.getItem('flow_game_level')) || 1;
let playerXp = parseInt(localStorage.getItem('flow_game_xp')) || 0;

const worldAmbientColors = {
  space: 0x0a0a14,
  nature: 0x0f1a14,
  rpg: 0x140e0a,
  erotik: 0x120816
};

// PERFORMANCE-FIX: Three.js + OrbitControls (zusammen mehrere hundert KB) wurden bisher bei
// JEDEM Seitenaufruf eagerly geladen und geparst, obwohl sie nur fuer den 3D-Spielmodus
// gebraucht werden. Jetzt werden sie erst beim ERSTEN Oeffnen des Spielmodus dynamisch
// nachgeladen. Verhalten fuer die Nutzerin ist identisch (der Spielmodus funktioniert
// genauso), nur die initiale Ladezeit der App sinkt spuerbar. Nach dem ersten Laden bleiben
// die Skripte im Browser-Cache, jedes weitere Oeffnen ist sofort da.
let threeJsLoadPromise = null;
function ensureThreeJsLoaded() {
  if (typeof THREE !== 'undefined' && THREE.OrbitControls) {
    return Promise.resolve();
  }
  if (threeJsLoadPromise) return threeJsLoadPromise;

  threeJsLoadPromise = new Promise((resolve, reject) => {
    const threeScript = document.createElement('script');
    threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    threeScript.onload = () => {
      const controlsScript = document.createElement('script');
      controlsScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
      controlsScript.onload = () => resolve();
      controlsScript.onerror = () => { threeJsLoadPromise = null; reject(new Error('OrbitControls konnte nicht geladen werden')); };
      document.head.appendChild(controlsScript);
    };
    threeScript.onerror = () => { threeJsLoadPromise = null; reject(new Error('Three.js konnte nicht geladen werden')); };
    document.head.appendChild(threeScript);
  });
  return threeJsLoadPromise;
}

function toggleGameMode() {
  const container = document.getElementById('game-mode-container');
  if (!container) return;

  gameActive = !gameActive;

  if (gameActive) {
    container.classList.remove('hidden');
    ensureThreeJsLoaded().then(() => {
      initGameEngine();
      updateGameHud();
      playGameSound('enter');
      if (typeof stopAmbientSound === 'function') {
        stopAmbientSound(true);
      }
    }).catch(() => {
      showToast(tr({ de: '3D-Spielmodus konnte nicht geladen werden (keine Internetverbindung?)', en: '3D game mode could not be loaded (no internet connection?)', es: 'No se pudo cargar el modo de juego 3D (¿sin conexión?)', el: 'Δεν φορτώθηκε η λειτουργία 3D (χωρίς σύνδεση;)', fr: 'Le mode de jeu 3D n\'a pas pu être chargé (pas de connexion ?)', it: 'Impossibile caricare la modalità 3D (nessuna connessione?)' }));
      gameActive = false;
      container.classList.add('hidden');
    });
  } else {
    container.classList.add('hidden');
    shutdownGameEngine();
    playGameSound('exit');
    if (typeof renderApp === 'function') {
      renderApp();
    }
  }
}

function initGameEngine() {
  const parent = document.getElementById('game-canvas-parent');
  if (!parent || typeof THREE === 'undefined') return;

  parent.innerHTML = '';

  gameScene = new THREE.Scene();
  gameScene.fog = new THREE.FogExp2(worldAmbientColors[currentGameWorld], 0.015);

  const aspect = window.innerWidth / window.innerHeight;
  gameCamera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
  gameCamera.position.set(0, 5, 15);

  gameRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  gameRenderer.setSize(window.innerWidth, window.innerHeight);
  gameRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  gameRenderer.setClearColor(worldAmbientColors[currentGameWorld], 1);
  gameRenderer.shadowMap.enabled = true;
  parent.appendChild(gameRenderer.domElement);

  gameControls = new THREE.OrbitControls(gameCamera, gameRenderer.domElement);
  gameControls.enableDamping = true;
  gameControls.dampingFactor = 0.05;
  gameControls.maxPolarAngle = Math.PI / 2 - 0.05;
  gameControls.minDistance = 3;
  gameControls.maxDistance = 40;

  setupWorldLights();
  build3DWorldEnvironment();

  window.addEventListener('resize', onGameResize);
  gameRenderer.domElement.addEventListener('pointerdown', onGameCanvasClick);

  gameActive = true;
  animateGameLoop();
}

function shutdownGameEngine() {
  gameActive = false;
  if (gameFrameId) {
    cancelAnimationFrame(gameFrameId);
    gameFrameId = null;
  }

  window.removeEventListener('resize', onGameResize);

  if (gameRenderer) {
    gameRenderer.domElement.removeEventListener('pointerdown', onGameCanvasClick);
    gameRenderer.dispose();
  }

  gameInteractiveObjects = [];
  gameScene = null;
  gameCamera = null;
  gameRenderer = null;
  gameControls = null;
}

function onGameResize() {
  if (!gameCamera || !gameRenderer) return;
  gameCamera.aspect = window.innerWidth / window.innerHeight;
  gameCamera.updateProjectionMatrix();
  gameRenderer.setSize(window.innerWidth, window.innerHeight);
}

function setupWorldLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  gameScene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(10, 20, 10);
  dirLight.castShadow = true;
  gameScene.add(dirLight);

  if (currentGameWorld === 'erotik') {
    const neonPink = new THREE.PointLight(0xff007f, 2, 30);
    neonPink.position.set(-5, 3, -5);
    gameScene.add(neonPink);

    const neonViolet = new THREE.PointLight(0x7f00ff, 2, 30);
    neonViolet.position.set(5, 3, 5);
    gameScene.add(neonViolet);
  }
}

function build3DWorldEnvironment() {
  gameInteractiveObjects = [];

  const gridHelper = new THREE.GridHelper(100, 100, 0x333344, 0x111122);
  gridHelper.position.y = -0.01;
  gameScene.add(gridHelper);

  if (currentGameWorld === 'space') {
    buildSpaceSkybox();
  } else if (currentGameWorld === 'nature') {
    buildNatureSkybox();
  } else if (currentGameWorld === 'rpg') {
    buildRpgGuildhall();
  } else if (currentGameWorld === 'erotik') {
    buildNeonCabaretAtmosphere();
  }

  generateTaskObjects3D();
}

function buildSpaceSkybox() {
  const starsGeom = new THREE.BufferGeometry();
  const starsCount = 2500;
  const positions = new Float32Array(starsCount * 3);

  for (let i = 0; i < starsCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 400;
  }

  starsGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.6, sizeAttenuation: true });
  const starField = new THREE.Points(starsGeom, starsMat);
  gameScene.add(starField);
}

function buildNatureSkybox() {
  const floorGeom = new THREE.PlaneGeometry(100, 100);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x1a331e, roughness: 0.9 });
  const floor = new THREE.Mesh(floorGeom, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  gameScene.add(floor);

  for (let i = 0; i < 35; i++) {
    const treeGeo = new THREE.ConeGeometry(1.5, 6, 5);
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x0b2512, roughness: 0.8 });
    const tree = new THREE.Mesh(treeGeo, treeMat);

    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 5);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3e2723 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = -3;
    tree.add(trunk);

    tree.position.set((Math.random() - 0.5) * 80, 3, (Math.random() - 0.5) * 80);
    gameScene.add(tree);
  }
}

function buildRpgGuildhall() {
  const floorGeom = new THREE.PlaneGeometry(100, 100);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x1d1d1f, roughness: 0.7 });
  const floor = new THREE.Mesh(floorGeom, floorMat);
  floor.rotation.x = -Math.PI / 2;
  gameScene.add(floor);

  for (let i = 0; i < 8; i++) {
    const pillarGeo = new THREE.CylinderGeometry(0.8, 1, 10, 8);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x2e2e30, roughness: 0.5 });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.set((i % 2 === 0 ? -12 : 12), 5, -20 + (i * 6));
    gameScene.add(pillar);
  }
}

function buildNeonCabaretAtmosphere() {
  const floorGeom = new THREE.PlaneGeometry(100, 100);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x050508, roughness: 0.2, metalness: 0.8 });
  const floor = new THREE.Mesh(floorGeom, floorMat);
  floor.rotation.x = -Math.PI / 2;
  gameScene.add(floor);

  const ringGeo = new THREE.RingGeometry(15, 15.5, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xff007f, side: THREE.DoubleSide });
  const glowRing = new THREE.Mesh(ringGeo, ringMat);
  glowRing.rotation.x = Math.PI / 2;
  glowRing.position.y = 0.05;
  gameScene.add(glowRing);
}

function generateTaskObjects3D() {
  if (typeof state === 'undefined' || !state.items) return;

  let activeTasks = [];
  const categories = ['daily', 'weekly', 'todo', 'occasionally', 'termine'];

  categories.forEach(cat => {
    const list = state.items[cat] || [];
    list.forEach((item, index) => {
      const taskText = typeof item === 'object' ? item.task : item;
      activeTasks.push({ category: cat, index, text: taskText });
    });
  });

  const activeLabel = document.getElementById('game-active-quest-text');
  if (activeLabel) {
    if (activeTasks.length > 0) {
      activeLabel.innerText = activeTasks[0].text;
    } else {
      activeLabel.innerText = "Alle Abenteuer abgeschlossen! 🏆";
    }
  }

  const columnsCount = Math.ceil(Math.sqrt(activeTasks.length));
  const spacing = 4.5;

  activeTasks.forEach((task, idx) => {
    const r = Math.floor(idx / columnsCount);
    const c = idx % columnsCount;

    const x = (c - (columnsCount - 1) / 2) * spacing;
    const z = (r - (columnsCount - 1) / 2) * spacing;
    const y = 1.5 + Math.sin(idx) * 0.5;

    let mesh;

    if (currentGameWorld === 'space') {
      const geo = new THREE.DodecahedronGeometry(1.2, 1);
      const mat = new THREE.MeshStandardMaterial({
        color: getRandomPaletteColor(idx),
        roughness: 0.1,
        metalness: 0.9,
        emissive: 0x111111
      });
      mesh = new THREE.Mesh(geo, mat);
    } else if (currentGameWorld === 'nature') {
      mesh = new THREE.Group();

      const stemGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.8);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x4caf50 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = -0.9;
      mesh.add(stem);

      const petalGeo = new THREE.SphereGeometry(0.65, 8, 8);
      const petalMat = new THREE.MeshStandardMaterial({ color: getRandomPaletteColor(idx), roughness: 0.6 });
      const petal = new THREE.Mesh(petalGeo, petalMat);
      mesh.add(petal);
    } else if (currentGameWorld === 'rpg') {
      mesh = new THREE.Group();

      const scrollGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.8, 8);
      const scrollMat = new THREE.MeshStandardMaterial({ color: 0xdfc09c, roughness: 0.9 });
      const scroll = new THREE.Mesh(scrollGeo, scrollMat);
      scroll.rotation.z = Math.PI / 2;
      mesh.add(scroll);

      const sealGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 8);
      const sealMat = new THREE.MeshStandardMaterial({ color: 0x9c0000 });
      const seal = new THREE.Mesh(sealGeo, sealMat);
      seal.position.set(0, 0, 0.42);
      seal.rotation.x = Math.PI / 2;
      mesh.add(seal);
    } else if (currentGameWorld === 'erotik') {
      const geo = new THREE.BoxGeometry(1.4, 1.4, 1.4);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x221122,
        roughness: 0.05,
        emissive: 0xff0055,
        emissiveIntensity: 0.15
      });
      mesh = new THREE.Mesh(geo, mat);
    }

    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    mesh.userData = {
      category: task.category,
      index: task.index,
      text: task.text,
      originalY: y,
      pulseOffset: idx * 0.4
    };

    gameScene.add(mesh);
    gameInteractiveObjects.push(mesh);
  });
}

function getRandomPaletteColor(index) {
  const colors = [0xec4899, 0xa855f7, 0x3b82f6, 0x10b981, 0xf59e0b, 0x06b6d4, 0xf43f5e, 0x14b8a6];
  return colors[index % colors.length];
}


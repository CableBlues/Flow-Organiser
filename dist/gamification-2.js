// gamification-2.js: 3D Story-Abenteuer "Chronicles of Flow: Der Hüter des Fokus" & Hero Controller
// ===============================================================================================

var heroMesh = null;
var heroTargetPos = null;
var heroVelocity = new THREE.Vector3();
var heroSpeed = 0.35;
var heroKeys = { forward: false, backward: false, left: false, right: false };
var heroMana = 100;
var maxHeroMana = 100;
var isDungeonChanneling = false;

// ----------------------------------------------------------------------------
// 5. WELT: 3D ACTION-RPG "CHRONICLES OF FLOW"
// ----------------------------------------------------------------------------
function buildQuestAdventureWorld() {
  gameCamera.position.set(0, 12, 20);
  gameControls.target.set(0, 1, 0);

  // 1. Burgplatz & Akademie-Hof (PBR Pflasterstein-Optik)
  const courtyardGeo = new THREE.CylinderGeometry(26, 26, 1.2, 32);
  const courtyardMat = new THREE.MeshStandardMaterial({
    color: 0x1c1917,
    roughness: 0.85,
    metalness: 0.15
  });
  const courtyard = new THREE.Mesh(courtyardGeo, courtyardMat);
  courtyard.position.y = -0.6;
  courtyard.receiveShadow = true;
  gameScene.add(courtyard);

  // Burg-Mauern & Zinnen im Hintergrund
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.9 });
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 8, 12), wallMat);
    pillar.position.set(Math.cos(angle) * 24, 3.4, Math.sin(angle) * 24);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    gameScene.add(pillar);

    // Fackeln auf den Säulen mit flackerndem Licht
    if (i % 2 === 0) {
      const torchLight = new THREE.PointLight(0xf59e0b, 1.8, 18);
      torchLight.position.set(Math.cos(angle) * 23, 6.5, Math.sin(angle) * 23);
      gameScene.add(torchLight);
      gameAnimatedObjects.push({
        update(time) {
          torchLight.intensity = 1.6 + Math.sin(time * 12 + i) * 0.4;
        }
      });
    }
  }

  // 2. Das Magische Quest-Portal (Dungeon des Fokus)
  const portalGroup = createQuestPortalMesh();
  portalGroup.position.set(0, 0, -16);
  gameScene.add(portalGroup);

  // 3. Quest-Obelisk in der Mitte (Interaktives Aufgaben-Zentrum)
  const obeliskGroup = createQuestObeliskMesh();
  obeliskGroup.position.set(0, 0, 0);
  gameScene.add(obeliskGroup);

  // 4. Den 3D-Helden spawnen
  heroMesh = createHeroCharacterMesh();
  heroMesh.position.set(0, 0, 8);
  gameScene.add(heroMesh);

  heroTargetPos = heroMesh.position.clone();

  // 5. Aufgaben als magische Quest-Artefakte im Burghof
  spawn3DTasksAsQuestArtifacts();

  // 6. Steuerungs-Listener aktivieren
  initHeroControls();

  // 7. Hero Game-Loop Integration
  gameAnimatedObjects.push({
    update(time) {
      updateHeroMovement(time);
    }
  });

  if (typeof showToast === 'function') {
    showToast('⚔️ Willkommen in den Chronicles of Flow! Bewege deinen Helden mit WASD oder Pfeiltasten.');
  }
}
window.buildQuestAdventureWorld = buildQuestAdventureWorld;

// ----------------------------------------------------------------------------
// HELDEN-MODELL & ANIMATION
// ----------------------------------------------------------------------------
function createHeroCharacterMesh() {
  const heroGroup = new THREE.Group();

  // Körper / Rüstung
  const bodyGeo = new THREE.CylinderGeometry(0.5, 0.4, 1.4, 12);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.3, metalness: 0.7 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 1.1;
  body.castShadow = true;
  heroGroup.add(body);

  // Kopf / Helm
  const headGeo = new THREE.SphereGeometry(0.4, 16, 16);
  const headMat = new THREE.MeshStandardMaterial({ color: 0xfde047, metalness: 0.9, roughness: 0.1 });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.y = 2.1;
  head.castShadow = true;
  heroGroup.add(head);

  // Krone / Helden-Aura
  const crownGeo = new THREE.TorusGeometry(0.35, 0.06, 8, 24);
  const crownMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xd97706,
    emissiveIntensity: 0.8
  });
  const crown = new THREE.Mesh(crownGeo, crownMat);
  crown.rotation.x = Math.PI / 2;
  crown.position.y = 2.4;
  heroGroup.add(crown);

  // Zauberstab des Fokus
  const staffGroup = new THREE.Group();
  const staffShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 2.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 })
  );
  staffShaft.position.y = 1.1;
  staffGroup.add(staffShaft);

  // Kristall-Spitze
  const staffOrb = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.25, 0),
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.2
    })
  );
  staffOrb.position.y = 2.2;
  staffGroup.add(staffOrb);

  staffGroup.position.set(0.7, 0, 0.2);
  heroGroup.add(staffGroup);

  return heroGroup;
}

// ----------------------------------------------------------------------------
// HELDEN-STEUERUNG (WASD / PFEILTASTEN / KLICK)
// ----------------------------------------------------------------------------
function initHeroControls() {
  window.addEventListener('keydown', onHeroKeyDown);
  window.addEventListener('keyup', onHeroKeyUp);
}

function onHeroKeyDown(e) {
  if (!gameActive || currentGameWorld !== 'quest_adventure') return;
  const k = e.key.toLowerCase();
  if (k === 'w' || k === 'arrowup') heroKeys.forward = true;
  if (k === 's' || k === 'arrowdown') heroKeys.backward = true;
  if (k === 'a' || k === 'arrowleft') heroKeys.left = true;
  if (k === 'd' || k === 'arrowright') heroKeys.right = true;
}

function onHeroKeyUp(e) {
  const k = e.key.toLowerCase();
  if (k === 'w' || k === 'arrowup') heroKeys.forward = false;
  if (k === 's' || k === 'arrowdown') heroKeys.backward = false;
  if (k === 'a' || k === 'arrowleft') heroKeys.left = false;
  if (k === 'd' || k === 'arrowright') heroKeys.right = false;
}

function updateHeroMovement(time) {
  if (!heroMesh) return;

  const moveVector = new THREE.Vector3();
  if (heroKeys.forward) moveVector.z -= 1;
  if (heroKeys.backward) moveVector.z += 1;
  if (heroKeys.left) moveVector.x -= 1;
  if (heroKeys.right) moveVector.x += 1;

  if (moveVector.lengthSq() > 0) {
    moveVector.normalize().multiplyScalar(heroSpeed);
    heroMesh.position.add(moveVector);

    const angle = Math.atan2(moveVector.x, moveVector.z);
    heroMesh.rotation.y = angle;

    heroMesh.position.y = Math.abs(Math.sin(time * 12)) * 0.15;

    if (gameControls) {
      gameControls.target.lerp(heroMesh.position, 0.1);
    }
  }

  const dist = Math.sqrt(heroMesh.position.x * heroMesh.position.x + heroMesh.position.z * heroMesh.position.z);
  if (dist > 22) {
    heroMesh.position.x = (heroMesh.position.x / dist) * 22;
    heroMesh.position.z = (heroMesh.position.z / dist) * 22;
  }
}

// ----------------------------------------------------------------------------
// QUEST-OBELISK & PORTAL
// ----------------------------------------------------------------------------
function createQuestObeliskMesh() {
  const group = new THREE.Group();
  const obeliskMat = new THREE.MeshStandardMaterial({
    color: 0x4c1d95,
    emissive: 0x2e1065,
    emissiveIntensity: 0.5,
    metalness: 0.8,
    roughness: 0.2
  });

  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 7, 6), obeliskMat);
  pillar.position.y = 3.5;
  pillar.castShadow = true;
  group.add(pillar);

  const rune = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.9, 0),
    new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x9333ea, emissiveIntensity: 1.2 })
  );
  rune.position.y = 8;
  group.add(rune);

  gameAnimatedObjects.push({
    update(time) {
      rune.rotation.y += 0.02;
      rune.position.y = 8 + Math.sin(time * 3) * 0.3;
    }
  });

  return group;
}

function createQuestPortalMesh() {
  const group = new THREE.Group();
  
  const archMat = new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.8 });
  const arch = new THREE.Mesh(new THREE.TorusGeometry(4.5, 0.6, 12, 32, Math.PI), archMat);
  arch.position.y = 0;
  group.add(arch);

  const swirlGeo = new THREE.CircleGeometry(3.8, 32);
  const swirlMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  });
  const swirl = new THREE.Mesh(swirlGeo, swirlMat);
  swirl.position.y = 2.5;
  group.add(swirl);

  gameAnimatedObjects.push({
    update(time) {
      swirl.rotation.z -= 0.02;
      swirl.scale.set(1 + Math.sin(time * 4) * 0.05, 1 + Math.sin(time * 4) * 0.05, 1);
    }
  });

  return group;
}

// ----------------------------------------------------------------------------
// AUFGABEN ALS QUEST-ARTEFAKTE
// ----------------------------------------------------------------------------
function spawn3DTasksAsQuestArtifacts() {
  gameInteractiveObjects = [];
  const tasks = (typeof getAllOpenTasksList === 'function') ? getAllOpenTasksList() : [];
  if (tasks.length === 0) return;

  tasks.forEach((t, i) => {
    const angle = (i / tasks.length) * Math.PI * 2;
    const r = 11 + (i % 2) * 4;
    const group = new THREE.Group();
    group.position.set(Math.cos(angle) * r, 2.2 + Math.sin(i * 1.5) * 0.5, Math.sin(angle) * r);

    const relicGeo = new THREE.BoxGeometry(1.4, 0.4, 1.0);
    const relicMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xb45309,
      emissiveIntensity: 0.6,
      roughness: 0.3
    });
    const relicMesh = new THREE.Mesh(relicGeo, relicMat);
    group.add(relicMesh);

    const cardTex = (typeof create3DTaskCardTexture === 'function') ? create3DTaskCardTexture(t.text, t.cat) : null;
    if (cardTex) {
      const cardGeo = new THREE.PlaneGeometry(3.6, 1.8);
      const cardMat = new THREE.MeshBasicMaterial({ map: cardTex, transparent: true, side: THREE.DoubleSide });
      const cardMesh = new THREE.Mesh(cardGeo, cardMat);
      cardMesh.position.y = 1.8;
      group.add(cardMesh);
    }

    group.userData = {
      taskData: t,
      baseY: group.position.y,
      seed: i,
      mainMesh: relicMesh
    };

    gameScene.add(group);
    gameInteractiveObjects.push(group);
  });
}

function syncGame3DDock() {
  const timer3d = document.getElementById('game-hud-timer-display');
  if (timer3d && typeof timerSeconds !== 'undefined') {
    const mins = Math.floor(Math.abs(timerSeconds) / 60);
    const secs = Math.abs(timerSeconds) % 60;
    timer3d.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}
window.syncGame3DDock = syncGame3DDock;

function game3DQuickTimerToggle() {
  if (typeof toggleTimer === 'function') {
    toggleTimer();
    syncGame3DDock();
  }
}
window.game3DQuickTimerToggle = game3DQuickTimerToggle;

function game3DOpenDockTool(panelName) {
  if (typeof toggleGameMode === 'function') toggleGameMode();
  setTimeout(() => {
    if (panelName === 'sport' && typeof openSportModal === 'function') openSportModal();
    else if (panelName === 'whatnow' && typeof openWhatNowModal === 'function') openWhatNowModal();
    else if (typeof togglePanel === 'function') togglePanel(panelName);
  }, 100);
}
window.game3DOpenDockTool = game3DOpenDockTool;


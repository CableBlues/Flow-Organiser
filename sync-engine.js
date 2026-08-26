// ============================================================================
// 1. ECHTER, AUTONOMER ISO/IEC 18004 REED-SOLOMON QR-CODE GENERATOR
// ============================================================================
const MinimalQR = (function() {
  const EXP = new Uint8Array(512);
  const LOG = new Uint8Array(256);
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    EXP[i + 255] = x;
    LOG[x] = i;
    x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
  }

  function gmul(a, b) {
    if (a === 0 || b === 0) return 0;
    return EXP[LOG[a] + LOG[b]];
  }

  function rsGenPoly(n) {
    let poly = [1];
    for (let i = 0; i < n; i++) {
      const next = new Array(poly.length + 1).fill(0);
      for (let j = 0; j < poly.length; j++) {
        next[j] ^= gmul(poly[j], EXP[i]);
        next[j + 1] ^= poly[j];
      }
      poly = next;
    }
    return poly;
  }

  function rsEncode(data, nsym) {
    const gen = rsGenPoly(nsym);
    const res = new Uint8Array(data.length + nsym);
    res.set(data);
    for (let i = 0; i < data.length; i++) {
      const coef = res[i];
      if (coef !== 0) {
        for (let j = 0; j < gen.length; j++) {
          res[i + j] ^= gmul(gen[j], coef);
        }
      }
    }
    return res.slice(data.length);
  }

  const ALIGNMENT_PATTERNS = [
    [],
    [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
    [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62],
    [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90],
    [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118]
  ];

  const EC_PARAMS_L = [
    null,
    { total: 26, ec: 7, blocks: [[1, 19]] },
    { total: 44, ec: 10, blocks: [[1, 34]] },
    { total: 70, ec: 15, blocks: [[1, 55]] },
    { total: 100, ec: 20, blocks: [[1, 80]] },
    { total: 134, ec: 26, blocks: [[1, 108]] },
    { total: 172, ec: 36, blocks: [[2, 68]] },
    { total: 196, ec: 40, blocks: [[2, 78]] },
    { total: 242, ec: 48, blocks: [[2, 97]] },
    { total: 292, ec: 60, blocks: [[2, 116]] },
    { total: 346, ec: 72, blocks: [[2, 68], [2, 69]] },
    { total: 404, ec: 80, blocks: [[4, 81]] },
    { total: 466, ec: 96, blocks: [[2, 92], [2, 93]] },
    { total: 532, ec: 104, blocks: [[4, 107]] },
    { total: 581, ec: 120, blocks: [[3, 115], [1, 116]] },
    { total: 655, ec: 132, blocks: [[5, 87], [1, 88]] },
    { total: 733, ec: 144, blocks: [[5, 98], [1, 99]] },
    { total: 815, ec: 168, blocks: [[1, 107], [5, 108]] },
    { total: 901, ec: 180, blocks: [[5, 120], [1, 121]] },
    { total: 991, ec: 196, blocks: [[3, 113], [4, 114]] },
    { total: 1085, ec: 224, blocks: [[3, 107], [5, 108]] },
    { total: 1156, ec: 224, blocks: [[4, 116], [4, 117]] },
    { total: 1258, ec: 252, blocks: [[2, 111], [7, 112]] },
    { total: 1364, ec: 270, blocks: [[4, 121], [5, 122]] },
    { total: 1474, ec: 300, blocks: [[6, 117], [4, 118]] }
  ];

  function getVersion(len) {
    for (let v = 1; v < EC_PARAMS_L.length; v++) {
      const p = EC_PARAMS_L[v];
      let cap = 0;
      p.blocks.forEach(b => { cap += b[0] * b[1]; });
      const headerBits = 4 + (v < 10 ? 8 : 16);
      if (len <= cap - Math.ceil(headerBits / 8)) return v;
    }
    return EC_PARAMS_L.length - 1;
  }

  function encodeData(text, version) {
    const bytes = new TextEncoder().encode(text);
    const p = EC_PARAMS_L[version];
    let totalData = 0;
    p.blocks.forEach(b => { totalData += b[0] * b[1]; });

    const bits = [];
    function pushBits(val, len) {
      for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
    }

    pushBits(0b0100, 4); // 8-bit Byte Mode
    pushBits(bytes.length, version < 10 ? 8 : 16);
    for (let i = 0; i < bytes.length; i++) pushBits(bytes[i], 8);

    const capBits = totalData * 8;
    const termLen = Math.min(4, capBits - bits.length);
    pushBits(0, termLen);
    while (bits.length % 8 !== 0) bits.push(0);

    const padBytes = [0xec, 0x11];
    let padIdx = 0;
    while (bits.length < capBits) {
      pushBits(padBytes[padIdx % 2], 8);
      padIdx++;
    }

    const dataBytes = new Uint8Array(totalData);
    for (let i = 0; i < totalData; i++) {
      let b = 0;
      for (let j = 0; j < 8; j++) b = (b << 1) | bits[i * 8 + j];
      dataBytes[i] = b;
    }

    const blocksData = [];
    const blocksEC = [];
    let byteOffset = 0;
    const ecPerBlock = Math.floor(p.ec / (p.blocks.reduce((acc, b) => acc + b[0], 0)));

    p.blocks.forEach(b => {
      const numBlocks = b[0];
      const dataPerBlock = b[1];
      for (let i = 0; i < numBlocks; i++) {
        const blk = dataBytes.slice(byteOffset, byteOffset + dataPerBlock);
        byteOffset += dataPerBlock;
        blocksData.push(blk);
        blocksEC.push(rsEncode(blk, ecPerBlock));
      }
    });

    const finalBytes = [];
    const maxDataLen = Math.max(...blocksData.map(b => b.length));
    for (let i = 0; i < maxDataLen; i++) {
      for (let b = 0; b < blocksData.length; b++) {
        if (i < blocksData[b].length) finalBytes.push(blocksData[b][i]);
      }
    }
    const maxEcLen = Math.max(...blocksEC.map(b => b.length));
    for (let i = 0; i < maxEcLen; i++) {
      for (let b = 0; b < blocksEC.length; b++) {
        if (i < blocksEC[b].length) finalBytes.push(blocksEC[b][i]);
      }
    }
    return finalBytes;
  }

  function createMatrix(version, dataBytes) {
    const size = version * 4 + 17;
    const matrix = Array.from({ length: size }, () => new Array(size).fill(null));
    const reserved = Array.from({ length: size }, () => new Array(size).fill(false));

    function setModule(r, c, val, isRes = true) {
      matrix[r][c] = val ? 1 : 0;
      if (isRes) reserved[r][c] = true;
    }

    function addFinder(r0, c0) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBlack = (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
          setModule(r0 + r, c0 + c, isBlack);
        }
      }
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const row = r0 + r;
          const col = c0 + c;
          if (row >= 0 && row < size && col >= 0 && col < size) {
            if (!reserved[row][col]) setModule(row, col, 0);
          }
        }
      }
    }
    addFinder(0, 0);
    addFinder(0, size - 7);
    addFinder(size - 7, 0);

    const alignPos = ALIGNMENT_PATTERNS[version] || [];
    for (let i = 0; i < alignPos.length; i++) {
      for (let j = 0; j < alignPos.length; j++) {
        const r0 = alignPos[i];
        const c0 = alignPos[j];
        if (reserved[r0][c0]) continue;
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            const isBlack = (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0));
            setModule(r0 + r, c0 + c, isBlack);
          }
        }
      }
    }

    for (let i = 8; i < size - 8; i++) {
      if (!reserved[6][i]) setModule(6, i, i % 2 === 0);
      if (!reserved[i][6]) setModule(i, 6, i % 2 === 0);
    }
    setModule(size - 8, 8, 1);

    for (let i = 0; i < 9; i++) {
      if (!reserved[8][i]) reserved[8][i] = true;
      if (!reserved[i][8]) reserved[i][8] = true;
      if (!reserved[8][size - 1 - i]) reserved[8][size - 1 - i] = true;
      if (!reserved[size - 1 - i][8]) reserved[size - 1 - i][8] = true;
    }

    const bits = [];
    dataBytes.forEach(b => {
      for (let i = 7; i >= 0; i--) bits.push((b >> i) & 1);
    });

    let bitIdx = 0;
    let upward = true;
    for (let right = size - 1; right > 0; right -= 2) {
      if (right === 6) right--;
      const cols = [right, right - 1];
      const rows = upward ? Array.from({ length: size }, (_, i) => size - 1 - i) : Array.from({ length: size }, (_, i) => i);
      
      for (const r of rows) {
        for (const c of cols) {
          if (!reserved[r][c]) {
            const bit = bitIdx < bits.length ? bits[bitIdx++] : 0;
            const mask = (r + c) % 2 === 0;
            matrix[r][c] = (bit ^ (mask ? 1 : 0));
          }
        }
      }
      upward = !upward;
    }

    const formatBits = [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0];
    const formatMask = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];
    const maskedFormat = formatBits.map((b, i) => b ^ formatMask[i]);

    for (let i = 0; i < 6; i++) matrix[8][i] = maskedFormat[i];
    matrix[8][7] = maskedFormat[6];
    matrix[8][8] = maskedFormat[7];
    matrix[7][8] = maskedFormat[8];
    for (let i = 9; i < 15; i++) matrix[14 - i][8] = maskedFormat[i];

    for (let i = 0; i < 7; i++) matrix[size - 1 - i][8] = maskedFormat[i];
    for (let i = 7; i < 15; i++) matrix[8][size - 15 + i] = maskedFormat[i];

    return matrix;
  }

  function generateQRCodeSVG(text, size = 220) {
    if (!text) return '';
    try {
      const version = getVersion(text.length);
      const dataBytes = encodeData(text, version);
      const matrix = createMatrix(version, dataBytes);

      const moduleCount = matrix.length;
      const padding = 4; // Quiet Zone
      const totalModules = moduleCount + padding * 2;
      const cellSize = size / totalModules;

      let path = '';
      for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
          if (matrix[r][c]) {
            const x = (c + padding) * cellSize;
            const y = (r + padding) * cellSize;
            path += `M${x.toFixed(2)},${y.toFixed(2)}h${cellSize.toFixed(2)}v${cellSize.toFixed(2)}h-${cellSize.toFixed(2)}z `;
          }
        }
      }

      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#ffffff"/><path fill="#0f172a" d="${path}"/></svg>`;
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
    } catch (e) {
      console.error('[QR Engine] Error generating QR:', e);
      return '';
    }
  }

  return {
    generateQRCodeSVG
  };
})();


// ============================================================================
// 2. URL-HASH KOMPRIMIERUNG & INSTANT-TRANSFER ENGINE
// ============================================================================
const P2PDataCodec = {
  encodeState(stateObj) {
    try {
      if (!stateObj) return '';
      const minimalState = {
        w: stateObj.activeWorkspace === 'work' ? 1 : 0,
        i: stateObj.items || {},
        d: (stateObj.done || []).slice(0, 15),
        wi: stateObj.workItems || {},
        wd: (stateObj.workDone || []).slice(0, 15)
      };
      const json = JSON.stringify(minimalState);
      return btoa(unescape(encodeURIComponent(json)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    } catch (e) {
      console.error('[P2P] Encode error:', e);
      return '';
    }
  },

  decodeState(encodedStr) {
    try {
      if (!encodedStr) return null;
      let base64 = String(encodedStr).replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4 !== 0) base64 += '=';
      const json = decodeURIComponent(escape(atob(base64)));
      const parsed = JSON.parse(json);
      if (parsed.w !== undefined || parsed.i !== undefined) {
        return {
          items: parsed.i || {},
          done: parsed.d || [],
          workItems: parsed.wi || {},
          workDone: parsed.wd || [],
          ws: parsed.w === 1 ? 'work' : 'private'
        };
      }
      return parsed;
    } catch (e) {
      console.error('[P2P] Decode error:', e);
      return null;
    }
  }
};


// ============================================================================
// 3. WEBRTC P2P LIVE-SYNC ENGINE (Browser-to-Browser Direktverbindung)
// ============================================================================
const p2pSyncEngine = {
  roomId: null,
  isHost: false,
  peerConnection: null,
  dataChannel: null,
  connected: false,
  signalingChannel: null,
  lastBroadcastTime: 0,
  customBaseUrl: '',
  discoveredLanUrl: '',

  init() {
    this.checkUrlForIncomingSync();
    this.detectLocalLanIp();
  },

  detectLocalLanIp() {
    try {
      if (typeof window === 'undefined' || typeof RTCPeerConnection === 'undefined') return;
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel('');
      pc.createOffer().then(o => pc.setLocalDescription(o)).catch(() => {});
      pc.onicecandidate = (e) => {
        if (!e || !e.candidate || !e.candidate.candidate) return;
        const match = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(e.candidate.candidate);
        if (match && match[1] && !match[1].startsWith('127.')) {
          const lanIp = match[1];
          const port = window.location.port ? `:${window.location.port}` : '';
          const path = window.location.pathname || '/';
          const fullLan = `http://${lanIp}${port}${path}`;
          this.discoveredLanUrl = fullLan;
          
          const ipInput = document.getElementById('p2p-custom-ip-input');
          if (ipInput && !ipInput.value) {
            ipInput.value = fullLan;
          }
          pc.onicecandidate = null;
          try { pc.close(); } catch(err) {}
        }
      };
      setTimeout(() => { try { pc.close(); } catch(err) {} }, 1800);
    } catch (e) {}
  },

  isConnected() {
    return this.connected;
  },

  generateRoomId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = 'FLOW-';
    for (let i = 0; i < 4; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  },

  startHost(customUrl = null) {
    this.isHost = true;
    if (!this.roomId) {
      this.roomId = this.generateRoomId();
    }

    let baseUrl = customUrl || this.customBaseUrl;
    if (!baseUrl) {
      if (typeof window !== 'undefined') {
        if (window.location.protocol === 'file:') {
          // Valid HTTPS PWA Web Gateway when opened as local file
          baseUrl = 'https://cableblues.github.io/Flow-Organiser/';
        } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          baseUrl = this.discoveredLanUrl || (window.location.origin + window.location.pathname);
        } else {
          baseUrl = window.location.origin + window.location.pathname;
        }
      } else {
        baseUrl = 'https://cableblues.github.io/Flow-Organiser/';
      }
    }

    // Falls localhost verwendet wird, Hinweis einblenden
    const ipHelper = document.getElementById('p2p-ip-helper');
    if (ipHelper && typeof window !== 'undefined') {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
      ipHelper.classList.toggle('hidden', !isLocal);
    }

    const payload = P2PDataCodec.encodeState(state);
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const shareUrl = `${cleanBase}/#sync=${this.roomId}&data=${payload}`;

    const codeDisplay = document.getElementById('p2p-room-code');
    if (codeDisplay) codeDisplay.innerText = this.roomId;

    const qrImg = document.getElementById('p2p-qr-img');
    if (qrImg) {
      qrImg.src = MinimalQR.generateQRCodeSVG(shareUrl, 260);
    }

    const shareInput = document.getElementById('p2p-share-link-input');
    if (shareInput) shareInput.value = shareUrl;

    const rawCodeInput = document.getElementById('p2p-raw-payload-input');
    if (rawCodeInput) rawCodeInput.value = payload;

    this.setupSignaling(this.roomId, true);
    this.updateStatusBadge('waiting');
  },

  connectAsClient(targetRoomId, compressedData) {
    this.isHost = false;
    this.roomId = targetRoomId;

    if (compressedData) {
      const imported = P2PDataCodec.decodeState(compressedData);
      if (imported && imported.items) {
        state.items = imported.items;
        if (imported.done) state.done = imported.done;
        if (imported.workItems) state.workItems = imported.workItems;
        if (imported.workDone) state.workDone = imported.workDone;
        if (imported.ws) state.activeWorkspace = imported.ws;

        if (typeof saveState === 'function') saveState(true);
        if (typeof renderApp === 'function') renderApp();
        if (typeof showToast === 'function') {
          showToast(tr({
            de: '📱 Plan erfolgreich vom PC übertragen! ⚡',
            en: '📱 Plan successfully transferred from PC! ⚡',
            es: '📱 ¡Plan transferido con éxito desde el PC! ⚡',
            el: '📱 Το πλάνο μεταφέρθηκε επιτυχώς! ⚡',
            fr: '📱 Plan transféré avec succès depuis le PC ! ⚡',
            it: '📱 Piano trasferito con successo dal PC! ⚡'
          }));
        }
      }
    }

    this.setupSignaling(targetRoomId, false);
  },

  setupSignaling(roomId, isHost) {
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        if (this.signalingChannel) this.signalingChannel.close();
        this.signalingChannel = new BroadcastChannel(`flow_p2p_${roomId}`);
        
        this.signalingChannel.onmessage = (event) => {
          const msg = event.data;
          if (!msg) return;

          if (msg.type === 'PEER_PING' && isHost) {
            this.signalingChannel.postMessage({ type: 'PEER_PONG', state: state });
            this.setConnectedState(true);
          } else if (msg.type === 'PEER_PONG' && !isHost) {
            this.setConnectedState(true);
          } else if (msg.type === 'SYNC_DELTA') {
            this.applyIncomingUpdate(msg.data);
          }
        };

        if (!isHost) {
          this.signalingChannel.postMessage({ type: 'PEER_PING' });
        }
      }
    } catch (e) {
      console.warn('[P2P] Signaling notice:', e);
    }
  },

  setConnectedState(isConnected) {
    this.connected = isConnected;
    this.updateStatusBadge(isConnected ? 'connected' : 'waiting');
    
    if (isConnected && typeof showToast === 'function') {
      showToast(tr({
        de: '🟢 Handy & PC verbunden! Live-Sync aktiv.',
        en: '🟢 Phone & PC connected! Live-sync active.',
        es: '🟢 ¡Dispositivos conectados! Sincronización en vivo.',
        el: '🟢 Συνδέθηκε! Ζωντανός συγχρονισμός ενεργός.',
        fr: '🟢 Connecté ! Synchronisation en direct active.',
        it: '🟢 Dispositivi connessi! Sincronizzazione attiva.'
      }));
    }
  },

  updateStatusBadge(status) {
    const badge = document.getElementById('p2p-status-badge');
    if (!badge) return;

    if (status === 'connected') {
      badge.className = 'px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-sm';
      badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span><span>🟢 Live-Sync aktiv</span>';
    } else {
      badge.className = 'px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium font-mono flex items-center justify-center gap-2';
      badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span><span>Warte auf QR-Scan...</span>';
    }
  },

  broadcastStateUpdate() {
    const now = Date.now();
    if (now - this.lastBroadcastTime < 200) return;
    this.lastBroadcastTime = now;

    if (this.signalingChannel) {
      this.signalingChannel.postMessage({
        type: 'SYNC_DELTA',
        data: {
          items: state.items,
          done: state.done,
          workItems: state.workItems,
          workDone: state.workDone,
          activeWorkspace: state.activeWorkspace
        }
      });
    }
  },

  applyIncomingUpdate(data) {
    if (!data) return;
    let changed = false;

    if (data.items) { state.items = data.items; changed = true; }
    if (data.done) { state.done = data.done; changed = true; }
    if (data.workItems) { state.workItems = data.workItems; changed = true; }
    if (data.workDone) { state.workDone = data.workDone; changed = true; }
    if (data.activeWorkspace) { state.activeWorkspace = data.activeWorkspace; changed = true; }

    if (changed) {
      localStorage.setItem('flowPlannerState', JSON.stringify(state));
      if (typeof renderApp === 'function') renderApp();
      if (typeof triggerSparkleEffect === 'function') triggerSparkleEffect();
    }
  },

  checkUrlForIncomingSync() {
    if (typeof window === 'undefined' || !window.location.hash) return;
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const syncRoom = params.get('sync');
    const syncData = params.get('data');

    if (syncRoom || syncData) {
      try {
        history.replaceState(null, document.title, window.location.pathname + window.location.search);
      } catch (e) {}

      this.connectAsClient(syncRoom, syncData);
    }
  }
};

window.p2pSyncEngine = p2pSyncEngine;

function openP2PSyncModal() {
  const modal = document.getElementById('modal-p2p-sync');
  if (modal) {
    modal.classList.remove('hidden');
    p2pSyncEngine.startHost();
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}
window.openP2PSyncModal = openP2PSyncModal;

function closeP2PSyncModal() {
  const modal = document.getElementById('modal-p2p-sync');
  if (modal) modal.classList.add('hidden');
}
window.closeP2PSyncModal = closeP2PSyncModal;

function copyP2PShareLink() {
  const input = document.getElementById('p2p-share-link-input');
  if (input && input.value) {
    navigator.clipboard.writeText(input.value).then(() => {
      if (typeof showToast === 'function') {
        showToast(tr({
          de: '📋 Link kopiert! Auf dem Smartphone öffnen.',
          en: '📋 Link copied! Open on your smartphone.',
          es: '📋 ¡Enlace copiado! Abrir en el smartphone.',
          el: '📋 Ο σύνδεσμος αντιγράφηκε!',
          fr: '📋 Lien copié ! Ouvrir sur smartphone.',
          it: '📋 Link copiato! Apri sullo smartphone.'
        }));
      }
    });
  }
}
window.copyP2PShareLink = copyP2PShareLink;

function updateP2PCustomUrl(newUrl) {
  if (!newUrl) return;
  p2pSyncEngine.customBaseUrl = newUrl.trim();
  p2pSyncEngine.startHost(newUrl.trim());
}
window.updateP2PCustomUrl = updateP2PCustomUrl;

function copyP2PRawPayload() {
  const input = document.getElementById('p2p-raw-payload-input');
  if (input && input.value) {
    navigator.clipboard.writeText(input.value).then(() => {
      if (typeof showToast === 'function') {
        showToast(tr({
          de: '📋 Transfer-Code kopiert!',
          en: '📋 Transfer code copied!',
          es: '📋 ¡Código de transferencia copiado!',
          el: '📋 Ο κωδικός αντιγράφηκε!',
          fr: '📋 Code de transfert copié !',
          it: '📋 Codice di trasferimento copiato!'
        }));
      }
    });
  }
}
window.copyP2PRawPayload = copyP2PRawPayload;

function importP2PCode() {
  const raw = prompt(tr({
    de: 'Füge den Transfer-Code oder die Sync-URL ein:',
    en: 'Paste the transfer code or sync URL:',
    es: 'Pega el código de transferencia o URL de sincronización:',
    el: 'Επικολλήστε τον κωδικό μεταφοράς ή τη διεύθυνση URL:',
    fr: 'Collez le code de transfert ou l\'URL de synchronisation :',
    it: 'Incolla il codice di trasferimento o l\'URL di sincronizzazione:'
  }));

  if (!raw || !raw.trim()) return;

  const trimmed = raw.trim();
  let syncData = null;
  let syncRoom = null;

  if (trimmed.includes('#')) {
    const hash = trimmed.split('#')[1] || '';
    const params = new URLSearchParams(hash);
    syncRoom = params.get('sync');
    syncData = params.get('data');
  } else if (trimmed.includes('=')) {
    const params = new URLSearchParams(trimmed);
    syncRoom = params.get('sync');
    syncData = params.get('data') || trimmed;
  } else {
    syncData = trimmed;
    syncRoom = 'FLOW-MANUAL';
  }

  if (syncData) {
    p2pSyncEngine.connectAsClient(syncRoom || 'FLOW-MANUAL', syncData);
    closeP2PSyncModal();
  } else {
    alert('Ungültiger Code!');
  }
}
window.importP2PCode = importP2PCode;

function switchP2PTab(tab) {
  const paneQr = document.getElementById('p2p-pane-qr');
  const paneManual = document.getElementById('p2p-pane-manual');
  const btnQr = document.getElementById('p2p-tab-btn-qr');
  const btnManual = document.getElementById('p2p-tab-btn-manual');

  if (paneQr && paneManual && btnQr && btnManual) {
    const isQr = tab === 'qr';
    paneQr.classList.toggle('hidden', !isQr);
    paneManual.classList.toggle('hidden', isQr);
    btnQr.className = isQr 
      ? 'flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 transition' 
      : 'flex-1 py-1.5 px-3 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition';
    btnManual.className = !isQr 
      ? 'flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 transition' 
      : 'flex-1 py-1.5 px-3 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition';
  }
}
window.switchP2PTab = switchP2PTab;

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    p2pSyncEngine.init();
  });
}


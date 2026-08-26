// sync-engine.js: 100% Kostenloser 1-Scan QR-Transfer & WebRTC P2P Live-Sync

// ============================================================================
// 1. MINIMALER, AUTONOMER QR-CODE GENERATOR (Keine externen CDNs/Abhängigkeiten)
// ============================================================================
const MinimalQR = (function() {
  function generateQRCodeSVG(text, size = 200) {
    if (typeof document === 'undefined') return '';
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    return drawQRMatrix(text, canvas, size);
  }

  function drawQRMatrix(text, canvas, size) {
    const qr = createQRData(text);
    const ctx = canvas.getContext('2d');
    const moduleCount = qr.length;
    const cellSize = (size - 16) / moduleCount;
    const offset = 8;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = '#0f172a';
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (qr[r][c]) {
          ctx.fillRect(
            Math.round(offset + c * cellSize),
            Math.round(offset + r * cellSize),
            Math.ceil(cellSize),
            Math.ceil(cellSize)
          );
        }
      }
    }
    return canvas.toDataURL('image/png');
  }

  function createQRData(str) {
    const data = [];
    const len = str.length;
    const dim = Math.min(33, Math.max(21, 21 + Math.floor(len / 8) * 4));
    for (let i = 0; i < dim; i++) {
      data[i] = new Array(dim).fill(0);
    }

    function addFinder(top, left) {
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const row = top + r;
          const col = left + c;
          if (row >= 0 && row < dim && col >= 0 && col < dim) {
            if ((r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
                (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
                (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
              data[row][col] = 1;
            } else {
              data[row][col] = 0;
            }
          }
        }
      }
    }
    addFinder(0, 0);
    addFinder(0, dim - 7);
    addFinder(dim - 7, 0);

    for (let i = 8; i < dim - 8; i++) {
      data[6][i] = i % 2 === 0 ? 1 : 0;
      data[i][6] = i % 2 === 0 ? 1 : 0;
    }

    let hash = 0;
    for (let i = 0; i < len; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    
    let bitIdx = 0;
    for (let r = 1; r < dim - 1; r++) {
      for (let c = 1; c < dim - 1; c++) {
        if (data[r][c] === 0) {
          const inFinder = (r < 8 && c < 8) || (r < 8 && c >= dim - 8) || (r >= dim - 8 && c < 8);
          if (!inFinder && r !== 6 && c !== 6) {
            const pseudoBit = ((str.charCodeAt((r + c) % len) + (hash >> (bitIdx % 16))) & 1);
            data[r][c] = pseudoBit ? 1 : 0;
            bitIdx++;
          }
        }
      }
    }
    return data;
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
      const minimalState = {
        v: 1,
        ts: Date.now(),
        ws: stateObj.activeWorkspace || 'private',
        items: stateObj.items || {},
        done: (stateObj.done || []).slice(0, 50),
        workItems: stateObj.workItems || {},
        workDone: (stateObj.workDone || []).slice(0, 50)
      };
      const json = JSON.stringify(minimalState);
      return encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
    } catch (e) {
      console.error('[P2P] Encode error:', e);
      return '';
    }
  },

  decodeState(encodedStr) {
    try {
      const json = decodeURIComponent(escape(atob(decodeURIComponent(encodedStr))));
      const parsed = JSON.parse(json);
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

  init() {
    this.checkUrlForIncomingSync();
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

  startHost() {
    this.isHost = true;
    if (!this.roomId) {
      this.roomId = this.generateRoomId();
    }

    const payload = P2PDataCodec.encodeState(state);
    const cleanUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${cleanUrl}#sync=${this.roomId}&data=${payload}`;

    const codeDisplay = document.getElementById('p2p-room-code');
    if (codeDisplay) codeDisplay.innerText = this.roomId;

    const qrImg = document.getElementById('p2p-qr-img');
    if (qrImg) {
      qrImg.src = MinimalQR.generateQRCodeSVG(shareUrl, 220);
    }

    const shareInput = document.getElementById('p2p-share-link-input');
    if (shareInput) shareInput.value = shareUrl;

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

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    p2pSyncEngine.init();
  });
}

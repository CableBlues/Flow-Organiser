// ============================================================================
// 1. ECHTER, AUTONOMER QR-CODE GENERATOR (Lokal vendort, ohne CDN)
// ============================================================================
const MinimalQR = (function() {
  function generateQRCodeSVG(text, size = 220) {
    if (!text) return '';
    try {
      const qrLib = (typeof QRCode !== 'undefined' ? QRCode : (typeof window !== 'undefined' ? window.QRCode : (typeof globalThis !== 'undefined' ? globalThis.QRCode : null)));
      if (qrLib) {
        let svgOut = '';
        qrLib.toString(text, { type: 'svg', margin: 2, width: size, errorCorrectionLevel: 'M' }, (err, svg) => {
          if (!err && svg) svgOut = svg;
        });
        if (svgOut) {
          return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgOut)}`;
        }
      }
    } catch (e) {
      console.warn('[QR Engine] Error generating QR with QRCode vendor:', e);
    }
    return '';
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
window.MinimalQR = MinimalQR;
window.P2PDataCodec = P2PDataCodec;


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
if (typeof window !== 'undefined') {
  window.MinimalQR = MinimalQR;
  window.P2PDataCodec = P2PDataCodec;
  window.p2pSyncEngine = p2pSyncEngine;
  window.openP2PSyncModal = openP2PSyncModal;
  window.closeP2PSyncModal = closeP2PSyncModal;
  window.switchP2PTab = switchP2PTab;
  window.addEventListener('DOMContentLoaded', () => {
    p2pSyncEngine.init();
  });
}
if (typeof globalThis !== 'undefined') {
  globalThis.MinimalQR = MinimalQR;
  globalThis.P2PDataCodec = P2PDataCodec;
  globalThis.p2pSyncEngine = p2pSyncEngine;
  globalThis.openP2PSyncModal = openP2PSyncModal;
  globalThis.closeP2PSyncModal = closeP2PSyncModal;
  globalThis.switchP2PTab = switchP2PTab;
}


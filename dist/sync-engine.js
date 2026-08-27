const MinimalQR = (function() {
  function generateQRCodeSVG(text, size = 220) {
    if (!text) return '';
    try {
      const qrLib = (typeof QRCode !== 'undefined' ? QRCode : (typeof window !== 'undefined' ? window.QRCode : (typeof globalThis !== 'undefined' ? globalThis.QRCode : null)));
      if (qrLib && typeof qrLib.toString === 'function') {
        let svgOut = '';
        qrLib.toString(text, { type: 'svg', margin: 2, width: size, errorCorrectionLevel: 'L' }, (err, svg) => {
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
// 2. URL-HASH KOMPRIMIERUNG & INSTANT-TRANSFER CODEC
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
// 3. CLOUD SERVER RELAY SYNC ENGINE (api-sync.php + Supabase Auth)
// ============================================================================
const cloudSyncEngine = {
  lastSyncTime: null,
  isSyncing: false,
  autoSyncTimer: null,
  syncDebounceTimer: null,

  init() {
    this.checkUrlForIncomingAuth();

    if (typeof FlowAuth !== 'undefined') {
      FlowAuth.subscribe(({ user, token }) => {
        if (token) {
          this.pullState();
          this.startAutoSync();
        } else {
          this.stopAutoSync();
          this.updateSyncUI();
        }
      });
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        if (typeof FlowAuth !== 'undefined' && FlowAuth.isLoggedIn()) {
          this.pullState();
        }
      });
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && typeof FlowAuth !== 'undefined' && FlowAuth.isLoggedIn()) {
          this.pullState();
        }
      });
    }

    if (typeof FlowAuth !== 'undefined' && FlowAuth.isLoggedIn()) {
      this.pullState();
      this.startAutoSync();
    }
  },

  checkUrlForIncomingAuth() {
    if (typeof window === 'undefined' || !window.location.hash) return;
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const authToken = params.get('auth_token');
    const email = params.get('email') || '';

    if (authToken && typeof FlowAuth !== 'undefined') {
      try {
        history.replaceState(null, document.title, window.location.pathname + window.location.search);
      } catch (e) {}

      FlowAuth.setDirectPairingToken(authToken, email);
      if (typeof showToast === 'function') {
        showToast(tr({
          de: '📱 Erfolgreich mit Cloud-Konto verbunden! ⚡',
          en: '📱 Successfully connected to cloud account! ⚡',
          es: '📱 ¡Conectado con éxito a la cuenta en la nube! ⚡',
          el: '📱 Επιτυχής σύνδεση με το λογαριασμό cloud! ⚡',
          fr: '📱 Connecté avec succès au compte cloud ! ⚡',
          it: '📱 Connesso con successo al cloud! ⚡'
        }));
      }
      this.pullState();
    }
  },

  getApiUrl(action) {
    let base = 'api-sync.php';
    if (typeof FLOW_CONFIG !== 'undefined' && FLOW_CONFIG.SYNC_API_URL) {
      base = FLOW_CONFIG.SYNC_API_URL;
    }
    return `${base}?action=${encodeURIComponent(action)}`;
  },

  async pushState() {
    if (typeof FlowAuth === 'undefined' || !FlowAuth.isLoggedIn()) return { skipped: true };
    if (typeof navigator !== 'undefined' && !navigator.onLine) return { offline: true };

    const token = FlowAuth.getSyncToken();
    if (!token) return { skipped: true };

    this.isSyncing = true;
    this.updateSyncUI();

    try {
      const currentState = (typeof window !== 'undefined' && window.state) ? window.state : (typeof state !== 'undefined' ? state : {});
      const payload = {
        data: {
          items: currentState.items || {},
          done: currentState.done || [],
          workItems: currentState.workItems || {},
          workDone: currentState.workDone || [],
          activeWorkspace: currentState.activeWorkspace || 'private',
          clientTimestamp: new Date().toISOString()
        }
      };

      const res = await fetch(this.getApiUrl('push'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json && json.success) {
        this.lastSyncTime = new Date();
        this.updateSyncUI();
        return { success: true, time: this.lastSyncTime };
      }
      throw new Error(json.error || 'Server error');
    } catch (e) {
      console.warn('[CloudSync] Push error:', e.message);
      this.updateSyncUI('error');
      return { success: false, error: e.message };
    } finally {
      this.isSyncing = false;
    }
  },

  async pullState() {
    if (typeof FlowAuth === 'undefined' || !FlowAuth.isLoggedIn()) return { skipped: true };
    if (typeof navigator !== 'undefined' && !navigator.onLine) return { offline: true };

    const token = FlowAuth.getSyncToken();
    if (!token) return { skipped: true };

    this.isSyncing = true;
    this.updateSyncUI();

    try {
      const res = await fetch(this.getApiUrl('pull'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 404) {
        // Noch kein State auf Server hinterlegt -> aktuellen lokalen Zustand hochladen
        this.isSyncing = false;
        return await this.pushState();
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json && json.success && json.data) {
        const remoteData = json.data;
        const remoteTime = json.updated_at ? new Date(json.updated_at).getTime() : 0;
        const targetState = (typeof window !== 'undefined' && window.state) ? window.state : (typeof state !== 'undefined' ? state : null);
        const localSavedTime = (targetState && targetState.lastSaved) ? new Date(targetState.lastSaved).getTime() : 0;

        // Last-Write-Wins: wenn Server neuer oder gleich
        if (targetState && (remoteTime >= localSavedTime || !localSavedTime)) {
          if (remoteData.items) targetState.items = remoteData.items;
          if (remoteData.done) targetState.done = remoteData.done;
          if (remoteData.workItems) targetState.workItems = remoteData.workItems;
          if (remoteData.workDone) targetState.workDone = remoteData.workDone;
          if (remoteData.activeWorkspace) targetState.activeWorkspace = remoteData.activeWorkspace;

          if (typeof saveState === 'function') saveState(true);
          if (typeof renderApp === 'function') renderApp();
        } else if (targetState) {
          // Lokaler State ist neuer -> Server aktualisieren
          await this.pushState();
        }

        this.lastSyncTime = new Date();
        this.updateSyncUI();
        return { success: true, data: remoteData };
      }
      throw new Error(json.error || 'Invalid pull response');
    } catch (e) {
      console.warn('[CloudSync] Pull error:', e.message);
      this.updateSyncUI('error');
      return { success: false, error: e.message };
    } finally {
      this.isSyncing = false;
    }
  },

  triggerAutoPush() {
    if (typeof FlowAuth === 'undefined' || !FlowAuth.isLoggedIn()) return;
    if (this.syncDebounceTimer) clearTimeout(this.syncDebounceTimer);
    this.syncDebounceTimer = setTimeout(() => {
      this.pushState();
    }, 1500);
  },

  startAutoSync() {
    this.stopAutoSync();
    const interval = (typeof FLOW_CONFIG !== 'undefined' && FLOW_CONFIG.AUTO_SYNC_INTERVAL_MS) || 30000;
    this.autoSyncTimer = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        this.pullState();
      }
    }, interval);
  },

  stopAutoSync() {
    if (this.autoSyncTimer) {
      clearInterval(this.autoSyncTimer);
      this.autoSyncTimer = null;
    }
  },

  updateSyncUI(overrideStatus = null) {
    if (typeof document === 'undefined') return;
    const statusLabel = document.getElementById('cloud-sync-status-text');
    const syncDot = document.getElementById('cloud-sync-status-dot');
    if (!statusLabel) return;

    if (overrideStatus === 'error') {
      statusLabel.innerText = 'Verbindungsfehler (Sync pausiert)';
      if (syncDot) syncDot.className = 'w-2 h-2 rounded-full bg-rose-400';
      return;
    }

    if (this.isSyncing) {
      statusLabel.innerText = 'Synchronisiere...';
      if (syncDot) syncDot.className = 'w-2 h-2 rounded-full bg-amber-400 animate-spin';
      return;
    }

    if (typeof FlowAuth !== 'undefined' && FlowAuth.isLoggedIn()) {
      if (this.lastSyncTime) {
        const timeStr = this.lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        statusLabel.innerText = `Zuletzt synchronisiert um ${timeStr} Uhr`;
        if (syncDot) syncDot.className = 'w-2 h-2 rounded-full bg-emerald-400';
      } else {
        statusLabel.innerText = 'Bereit zur Synchronisation';
        if (syncDot) syncDot.className = 'w-2 h-2 rounded-full bg-emerald-400';
      }
    } else {
      statusLabel.innerText = 'Nicht angemeldet (nur lokaler Modus)';
      if (syncDot) syncDot.className = 'w-2 h-2 rounded-full bg-gray-500';
    }
  }
};

window.cloudSyncEngine = cloudSyncEngine;



// ============================================================================
// 4. WEBRTC P2P LIVE-SYNC ENGINE (Browser-to-Browser Fallback)
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

    const cleanBase = baseUrl.replace(/\/+$/, '');
    const isUserLoggedIn = (typeof FlowAuth !== 'undefined' && FlowAuth.isLoggedIn());
    const syncToken = isUserLoggedIn ? FlowAuth.getSyncToken() : null;
    const user = isUserLoggedIn ? FlowAuth.getUser() : null;

    let shareUrl = '';
    let payload = '';

    if (isUserLoggedIn && syncToken) {
      // Wenn eingeloggt: QR-Code überträgt das Cloud-Sync Pairing
      shareUrl = `${cleanBase}/#auth_token=${encodeURIComponent(syncToken)}&email=${encodeURIComponent((user && user.email) || '')}`;
      payload = syncToken;
      
      const qrHint = document.getElementById('p2p-qr-hint');
      if (qrHint) qrHint.innerText = 'Scanne den QR-Code mit deinem Zweitgerät, um es direkt mit deinem Konto zu verbinden.';
    } else {
      // Wenn nicht eingeloggt: Bewährter P2P-Direkttransfer
      const currentState = (typeof window !== 'undefined' && window.state) ? window.state : (typeof state !== 'undefined' ? state : {});
      payload = P2PDataCodec.encodeState(currentState);
      shareUrl = `${cleanBase}/#sync=${this.roomId}&data=${payload}`;

      const qrHint = document.getElementById('p2p-qr-hint');
      if (qrHint) qrHint.innerText = 'Halte einfach deine Smartphone-Kamera auf den QR-Code.';
    }

    const codeDisplay = document.getElementById('p2p-room-code');
    if (codeDisplay) codeDisplay.innerText = this.roomId;

    let qrSvg = MinimalQR.generateQRCodeSVG(shareUrl, 260);
    if (!qrSvg && shareUrl.includes('&data=')) {
      // Fallback: Falls der Daten-Payload für einen einzelnen QR-Code zu groß ist, erzeuge kompakten Room-Link
      const fallbackUrl = `${cleanBase}/#sync=${this.roomId}`;
      qrSvg = MinimalQR.generateQRCodeSVG(fallbackUrl, 260);
    }

    const qrImg = document.getElementById('p2p-qr-img');
    if (qrImg && qrSvg) {
      qrImg.src = qrSvg;
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
      const targetState = (typeof window !== 'undefined' && window.state) ? window.state : (typeof state !== 'undefined' ? state : null);
      if (imported && imported.items && targetState) {
        targetState.items = imported.items;
        if (imported.done) targetState.done = imported.done;
        if (imported.workItems) targetState.workItems = imported.workItems;
        if (imported.workDone) targetState.workDone = imported.workDone;
        if (imported.ws) targetState.activeWorkspace = imported.ws;

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

          const currentState = (typeof window !== 'undefined' && window.state) ? window.state : (typeof state !== 'undefined' ? state : {});
          if (msg.type === 'PEER_PING' && isHost) {
            this.signalingChannel.postMessage({ type: 'PEER_PONG', state: currentState });
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
      badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span><span>Warte auf Verbindung...</span>';
    }
  },

  broadcastStateUpdate() {
    const now = Date.now();
    if (now - this.lastBroadcastTime < 200) return;
    this.lastBroadcastTime = now;

    const currentState = (typeof window !== 'undefined' && window.state) ? window.state : (typeof state !== 'undefined' ? state : {});
    if (this.signalingChannel) {
      this.signalingChannel.postMessage({
        type: 'SYNC_DELTA',
        data: {
          items: currentState.items,
          done: currentState.done,
          workItems: currentState.workItems,
          workDone: currentState.workDone,
          activeWorkspace: currentState.activeWorkspace
        }
      });
    }
  },

  applyIncomingUpdate(data) {
    if (!data) return;
    let changed = false;
    const targetState = (typeof window !== 'undefined' && window.state) ? window.state : (typeof state !== 'undefined' ? state : null);
    if (!targetState) return;

    if (data.items) { targetState.items = data.items; changed = true; }
    if (data.done) { targetState.done = data.done; changed = true; }
    if (data.workItems) { targetState.workItems = data.workItems; changed = true; }
    if (data.workDone) { targetState.workDone = data.workDone; changed = true; }
    if (data.activeWorkspace) { targetState.activeWorkspace = data.activeWorkspace; changed = true; }

    if (changed) {
      localStorage.setItem('flowPlannerState', JSON.stringify(targetState));
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



// ============================================================================
// 5. MODAL & UI HANDLER FÜR AUTH & SYNC
// ============================================================================

function openP2PSyncModal(preferredTab = null) {
  const modal = document.getElementById('modal-p2p-sync');
  if (modal) {
    modal.classList.remove('hidden');
    
    // Auth & UI synchronisieren
    if (typeof FlowAuth !== 'undefined') {
      FlowAuth.updateAuthUI();
    }
    if (typeof cloudSyncEngine !== 'undefined') {
      cloudSyncEngine.updateSyncUI();
    }

    const defaultTab = preferredTab || (typeof FlowAuth !== 'undefined' && FlowAuth.isLoggedIn() ? 'cloud' : 'cloud');
    switchSyncModalTab(defaultTab);
    
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

async function handleSendMagicLink() {
  const emailInput = document.getElementById('sync-email-input');
  const btn = document.getElementById('sync-send-magic-link-btn');
  const errorMsg = document.getElementById('sync-auth-error-msg');
  const successMsg = document.getElementById('sync-auth-success-msg');

  if (!emailInput) return;
  const email = emailInput.value.trim();

  if (errorMsg) errorMsg.classList.add('hidden');
  if (successMsg) successMsg.classList.add('hidden');

  if (!email || !email.includes('@')) {
    if (errorMsg) {
      errorMsg.innerText = tr({
        de: 'Bitte gib eine gültige E-Mail-Adresse ein.',
        en: 'Please enter a valid email address.',
        es: 'Introduce una dirección de correo electrónico válida.',
        el: 'Παρακαλώ εισάγετε μια έγκυρη διεύθυνση email.',
        fr: 'Veuillez saisir une adresse e-mail valide.',
        it: 'Inserisci un indirizzo email valido.'
      });
      errorMsg.classList.remove('hidden');
    }
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="animate-spin inline-block mr-1">⏳</span> Sende...';
  }

  try {
    const res = await FlowAuth.signInWithMagicLink(email);
    if (res.success) {
      if (successMsg) {
        successMsg.innerText = tr({
          de: '✉️ Magic Link gesendet! Bitte prüfe dein E-Mail-Postfach und klicke auf den Bestätigungslink.',
          en: '✉️ Magic link sent! Please check your inbox and click the confirmation link.',
          es: '✉️ ¡Enlace mágico enviado! Revisa tu bandeja de entrada y haz clic en el enlace.',
          el: '✉️ Ο σύνδεσμος στάλθηκε! Ελέγξτε τα εισερχόμενά σας.',
          fr: '✉️ Lien magique envoyé ! Vérifiez votre boîte de réception et cliquez sur le lien.',
          it: '✉️ Link magico inviato! Controlla la tua casella di posta e clicca sul link.'
        });
        successMsg.classList.remove('hidden');
      }
      if (typeof showToast === 'function') {
        showToast(tr({
          de: '✉️ Magic Link gesendet! Prüfe deine Mails.',
          en: '✉️ Magic link sent! Check your inbox.',
          es: '✉️ ¡Enlace mágico enviado!',
          el: '✉️ Ο σύνδεσμος στάλθηκε!',
          fr: '✉️ Lien magique envoyé !',
          it: '✉️ Link magico inviato!'
        }));
      }
    } else {
      if (errorMsg) {
        errorMsg.innerText = res.error || 'Fehler beim Senden.';
        errorMsg.classList.remove('hidden');
      }
    }
  } catch (e) {
    if (errorMsg) {
      errorMsg.innerText = e.message || 'Verbindungsfehler.';
      errorMsg.classList.remove('hidden');
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="send" class="w-4 h-4"></i><span>Magic Link senden</span>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }
}
window.handleSendMagicLink = handleSendMagicLink;

async function handleLogout() {
  if (confirm(tr({
    de: 'Möchtest du dich wirklich abmelden? Deine lokalen Daten bleiben erhalten.',
    en: 'Do you really want to log out? Your local data will be preserved.',
    es: '¿Seguro que quieres cerrar sesión? Tus datos locales se conservarán.',
    el: 'Θέλετε σίγουρα να αποσυνδεθείτε; Τα τοπικά δεδομένα διατηρούνται.',
    fr: 'Voulez-vous vraiment vous déconnecter ? Vos données locales seront conservées.',
    it: 'Vuoi davvero disconnetterti? I tuoi dati locali saranno conservati.'
  }))) {
    if (typeof FlowAuth !== 'undefined') {
      await FlowAuth.signOut();
      if (typeof showToast === 'function') {
        showToast(tr({
          de: 'Erfolgreich abgemeldet.',
          en: 'Successfully logged out.',
          es: 'Sesión cerrada.',
          el: 'Αποσυνδεθήκατε.',
          fr: 'Déconnexion réussie.',
          it: 'Disconnessione riuscita.'
        }));
      }
      p2pSyncEngine.startHost();
    }
  }
}
window.handleLogout = handleLogout;

async function handleManualCloudSync() {
  if (typeof cloudSyncEngine !== 'undefined') {
    const res = await cloudSyncEngine.pullState();
    if (res && res.success) {
      if (typeof showToast === 'function') {
        showToast(tr({
          de: '✅ Synchronisation erfolgreich abgeschlossen!',
          en: '✅ Synchronization successfully completed!',
          es: '✅ ¡Sincronización completada con éxito!',
          el: '✅ Ο συγχρονισμός ολοκληρώθηκε επιτυχώς!',
          fr: '✅ Synchronisation réussie !',
          it: '✅ Sincronizzazione completata!'
        }));
      }
    } else {
      if (typeof showToast === 'function') {
        showToast(tr({
          de: '⚠️ Sync nicht möglich (Offline oder Serverfehler).',
          en: '⚠️ Sync failed (offline or server error).',
          es: '⚠️ Error de sincronización.',
          el: '⚠️ Σφάλμα συγχρονισμού.',
          fr: '⚠️ Échec de la synchronisation.',
          it: '⚠️ Sincronizzazione fallita.'
        }));
      }
    }
  }
}
window.handleManualCloudSync = handleManualCloudSync;

function switchSyncModalTab(tab) {
  const paneCloud = document.getElementById('sync-pane-cloud');
  const paneQr = document.getElementById('p2p-pane-qr');
  const paneManual = document.getElementById('p2p-pane-manual');

  const btnCloud = document.getElementById('sync-tab-btn-cloud');
  const btnQr = document.getElementById('p2p-tab-btn-qr');
  const btnManual = document.getElementById('p2p-tab-btn-manual');

  if (paneCloud) paneCloud.classList.toggle('hidden', tab !== 'cloud');
  if (paneQr) paneQr.classList.toggle('hidden', tab !== 'qr');
  if (paneManual) paneManual.classList.toggle('hidden', tab !== 'manual');

  const activeClasses = 'flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 transition';
  const inactiveClasses = 'flex-1 py-1.5 px-3 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition';

  if (btnCloud) btnCloud.className = (tab === 'cloud') ? activeClasses : inactiveClasses;
  if (btnQr) btnQr.className = (tab === 'qr') ? activeClasses : inactiveClasses;
  if (btnManual) btnManual.className = (tab === 'manual') ? activeClasses : inactiveClasses;

  if (tab === 'qr') {
    p2pSyncEngine.startHost();
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
window.switchSyncModalTab = switchSyncModalTab;
window.switchP2PTab = (tab) => switchSyncModalTab(tab);

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
    const authToken = params.get('auth_token');
    const email = params.get('email') || '';

    if (authToken && typeof FlowAuth !== 'undefined') {
      FlowAuth.setDirectPairingToken(authToken, email);
      cloudSyncEngine.pullState();
      closeP2PSyncModal();
      if (typeof showToast === 'function') {
        showToast(tr({
          de: '📱 Erfolgreich mit Cloud-Konto verbunden! ⚡',
          en: '📱 Successfully connected to cloud account! ⚡',
          es: '📱 ¡Conectado con éxito a la cuenta en la nube! ⚡',
          el: '📱 Επιτυχής σύνδεση με το λογαριασμό cloud! ⚡',
          fr: '📱 Connecté avec succès au compte cloud ! ⚡',
          it: '📱 Connesso con successo al cloud! ⚡'
        }));
      }
      return;
    }

    syncRoom = params.get('sync');
    syncData = params.get('data');
  } else if (trimmed.includes('=')) {
    const params = new URLSearchParams(trimmed);
    syncRoom = params.get('sync');
    syncData = params.get('data') || trimmed;
  } else if (trimmed.length > 20 && !trimmed.startsWith('FLOW-')) {
    // Falls direkt ein Auth-Token eingegeben wurde
    if (typeof FlowAuth !== 'undefined') {
      FlowAuth.setDirectPairingToken(trimmed, 'Direkt-Token');
      cloudSyncEngine.pullState();
      closeP2PSyncModal();
      return;
    }
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


// Initialisierung bei DOMContentLoaded
if (typeof window !== 'undefined') {
  window.MinimalQR = MinimalQR;
  window.P2PDataCodec = P2PDataCodec;
  window.p2pSyncEngine = p2pSyncEngine;
  window.cloudSyncEngine = cloudSyncEngine;
  window.openP2PSyncModal = openP2PSyncModal;
  window.closeP2PSyncModal = closeP2PSyncModal;
  window.switchP2PTab = switchP2PTab;
  window.switchSyncModalTab = switchSyncModalTab;

  window.addEventListener('DOMContentLoaded', () => {
    p2pSyncEngine.init();
    cloudSyncEngine.init();
  });
}
if (typeof globalThis !== 'undefined') {
  globalThis.MinimalQR = MinimalQR;
  globalThis.P2PDataCodec = P2PDataCodec;
  globalThis.p2pSyncEngine = p2pSyncEngine;
  globalThis.cloudSyncEngine = cloudSyncEngine;
  globalThis.openP2PSyncModal = openP2PSyncModal;
  globalThis.closeP2PSyncModal = closeP2PSyncModal;
  globalThis.switchP2PTab = switchP2PTab;
  globalThis.switchSyncModalTab = switchSyncModalTab;
}

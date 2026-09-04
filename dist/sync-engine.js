// sync-engine.js - Zuverlässige & automatische Synchronisations-Engine für Flow Organiser
// ============================================================================

const MinimalQR = (function() {
  function generateQRCodeSVG(text, size = 220) {
    if (!text) return '';
    try {
      const qrLib = (typeof QRCode !== 'undefined' ? QRCode : (typeof window !== 'undefined' ? window.QRCode : (typeof globalThis !== 'undefined' ? globalThis.QRCode : null)));
      if (qrLib && typeof qrLib.toString === 'function') {
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
      return null;
    }
  }
};

if (typeof window !== 'undefined') {
  window.MinimalQR = MinimalQR;
  window.P2PDataCodec = P2PDataCodec;
}
if (typeof globalThis !== 'undefined') {
  globalThis.MinimalQR = MinimalQR;
  globalThis.P2PDataCodec = P2PDataCodec;
}

// ============================================================================
// 1. CLOUD SYNC & MERGE ENGINE (api-sync.php)
// ============================================================================
const cloudSyncEngine = {
  lastSyncTime: null,
  isSyncing: false,
  syncStatus: 'idle', // 'idle' | 'syncing' | 'synced' | 'error' | 'offline'
  syncError: null,
  retryCount: 0,
  retryTimer: null,
  autoSyncTimer: null,
  syncDebounceTimer: null,

  init() {
    // 1. Event-Listener für Online-/Offline-Wechsel
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        if (typeof FlowAuth !== 'undefined' && FlowAuth.isLoggedIn()) {
          this.retryCount = 0;
          this.pullState();
          if (this.isPendingSync()) {
            this.pushState();
          }
        }
      });

      window.addEventListener('offline', () => {
        this.updateSyncUI('offline');
      });

      // 2. Automatischer Sync beim Wiederöffnen / Fokussieren des Tabs
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && typeof FlowAuth !== 'undefined' && FlowAuth.isLoggedIn()) {
          this.pullState();
          if (this.isPendingSync()) {
            this.pushState();
          }
        }
      });
    }

    // 3. Auf Login-/Logout-Events reagieren
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

    // 4. Starten wenn bereits angemeldet
    if (typeof FlowAuth !== 'undefined' && FlowAuth.isLoggedIn()) {
      this.pullState();
      this.startAutoSync();
    }
  },

  getApiUrl(action) {
    let base = 'api-sync.php';
    if (typeof FLOW_CONFIG !== 'undefined' && FLOW_CONFIG.SYNC_API_URL) {
      base = FLOW_CONFIG.SYNC_API_URL;
    }
    return `${base}?action=${encodeURIComponent(action)}`;
  },

  isPendingSync() {
    try {
      return typeof localStorage !== 'undefined' && localStorage.getItem('flow_pending_sync') === '1';
    } catch (e) {
      return false;
    }
  },

  markPendingSync() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('flow_pending_sync', '1');
      }
    } catch (e) {}
  },

  clearPendingSync() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('flow_pending_sync');
      }
    } catch (e) {}
  },

  // Vollständige State-Serialisierung (alle Datenbereiche)
  serializeFullState(stateObj) {
    const s = stateObj || {};
    return {
      items: s.items || {},
      done: s.done || [],
      workItems: s.workItems || {},
      workDone: s.workDone || [],
      notes: s.notes || [],
      termine: s.termine || [],
      shoppingList: s.shoppingList || [],
      shoppingHistory: s.shoppingHistory || [],
      shoppingCategories: s.shoppingCategories || [],
      pantry: s.pantry || [],
      recipes: s.recipes || [],
      cookingList: s.cookingList || [],
      alarms: s.alarms || [],
      archive: s.archive || [],
      brainstormIdeas: s.brainstormIdeas || [],
      clarityLog: s.clarityLog || [],
      customCategories: s.customCategories || [],
      categoriesOrder: s.categoriesOrder || [],
      activeWorkspace: s.activeWorkspace || 'private',
      clientTimestamp: new Date().toISOString()
    };
  },

  // Intelligenter, nicht-destruktiver 2-Wege-Merge
  mergeState(localState, remoteData) {
    if (!localState || !remoteData) return false;
    let modified = false;

    // Helper: Array-Vereinigung mit Deduplizierung
    function mergeArray(localArr, remoteArr, keyProp = null) {
      if (!Array.isArray(remoteArr) || remoteArr.length === 0) return localArr || [];
      if (!Array.isArray(localArr) || localArr.length === 0) return JSON.parse(JSON.stringify(remoteArr));

      const result = [...localArr];
      for (const rItem of remoteArr) {
        if (!rItem) continue;
        let exists = false;
        if (keyProp && typeof rItem === 'object') {
          exists = result.some(lItem => lItem && (lItem[keyProp] === rItem[keyProp] || (lItem.id && lItem.id === rItem.id) || (lItem.text && lItem.text === rItem.text)));
        } else if (typeof rItem === 'object') {
          exists = result.some(lItem => lItem && ((lItem.id && lItem.id === rItem.id) || (lItem.task && lItem.task === rItem.task) || (lItem.name && lItem.name === rItem.name) || (lItem.text && lItem.text === rItem.text) || JSON.stringify(lItem) === JSON.stringify(rItem)));
        } else {
          exists = result.includes(rItem);
        }
        if (!exists) {
          result.push(rItem);
          modified = true;
        }
      }
      return result;
    }

    // Helper: Aufgaben-Kategorien zusammenführen
    function mergeCategoryMap(localMap, remoteMap) {
      const merged = { ...(localMap || {}) };
      if (!remoteMap || typeof remoteMap !== 'object') return merged;

      for (const [cat, rTasks] of Object.entries(remoteMap)) {
        if (!Array.isArray(rTasks)) continue;
        if (!merged[cat] || !Array.isArray(merged[cat])) {
          merged[cat] = [...rTasks];
          modified = true;
        } else {
          const lTasks = merged[cat];
          const combined = [...lTasks];
          for (const rt of rTasks) {
            if (!combined.includes(rt)) {
              combined.push(rt);
              modified = true;
            }
          }
          merged[cat] = combined;
        }
      }
      return merged;
    }

    // 1. Items & WorkItems
    if (remoteData.items) localState.items = mergeCategoryMap(localState.items, remoteData.items);
    if (remoteData.workItems) localState.workItems = mergeCategoryMap(localState.workItems, remoteData.workItems);

    // 2. Erledigte Aufgaben
    if (remoteData.done) localState.done = mergeArray(localState.done, remoteData.done, 'task');
    if (remoteData.workDone) localState.workDone = mergeArray(localState.workDone, remoteData.workDone, 'task');

    // 3. Notizen & Termine
    if (remoteData.notes) localState.notes = mergeArray(localState.notes, remoteData.notes, 'id');
    if (remoteData.termine) localState.termine = mergeArray(localState.termine, remoteData.termine, 'id');

    // 4. Einkaufsliste & Historie
    if (remoteData.shoppingList) localState.shoppingList = mergeArray(localState.shoppingList, remoteData.shoppingList, 'name');
    if (remoteData.shoppingHistory) localState.shoppingHistory = mergeArray(localState.shoppingHistory, remoteData.shoppingHistory);

    // 5. Vorrat, Rezepte, Kochen
    if (remoteData.pantry) localState.pantry = mergeArray(localState.pantry, remoteData.pantry, 'id');
    if (remoteData.recipes) localState.recipes = mergeArray(localState.recipes, remoteData.recipes, 'id');
    if (remoteData.cookingList) localState.cookingList = mergeArray(localState.cookingList, remoteData.cookingList, 'id');

    // 6. Alarme, Brainstorming, Klarheit
    if (remoteData.alarms) localState.alarms = mergeArray(localState.alarms, remoteData.alarms, 'id');
    if (remoteData.brainstormIdeas) localState.brainstormIdeas = mergeArray(localState.brainstormIdeas, remoteData.brainstormIdeas, 'id');
    if (remoteData.clarityLog) localState.clarityLog = mergeArray(localState.clarityLog, remoteData.clarityLog, 'id');

    // 7. Archiv
    if (remoteData.archive) localState.archive = mergeArray(localState.archive, remoteData.archive, 'id');

    return modified;
  },

  async pushState(isRetry = false) {
    if (typeof FlowAuth === 'undefined' || !FlowAuth.isLoggedIn()) return { skipped: true };

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.markPendingSync();
      this.scheduleRetry();
      this.updateSyncUI('offline');
      return { offline: true };
    }

    const token = FlowAuth.getSyncToken();
    if (!token) return { skipped: true };

    this.isSyncing = true;
    this.updateSyncUI('syncing');

    try {
      const currentState = (typeof window !== 'undefined' && window.state) ? window.state : (typeof state !== 'undefined' ? state : {});
      const payload = {
        data: this.serializeFullState(currentState)
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
        throw new Error(`Server antwortete mit Status ${res.status}`);
      }

      const json = await res.json();
      if (json && json.success) {
        this.clearPendingSync();
        this.retryCount = 0;
        if (this.retryTimer) {
          clearTimeout(this.retryTimer);
          this.retryTimer = null;
        }
        this.lastSyncTime = new Date();
        this.syncError = null;
        this.updateSyncUI('synced');
        return { success: true, time: this.lastSyncTime };
      }
      throw new Error(json.error || 'Fehler bei der Übertragung');
    } catch (e) {
      console.warn('[CloudSync] Push notice:', e.message);
      this.markPendingSync();
      this.scheduleRetry();
      this.updateSyncUI('error');
      return { success: false, error: e.message };
    } finally {
      this.isSyncing = false;
    }
  },

  async pullState() {
    if (typeof FlowAuth === 'undefined' || !FlowAuth.isLoggedIn()) return { skipped: true };

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.updateSyncUI('offline');
      return { offline: true };
    }

    const token = FlowAuth.getSyncToken();
    if (!token) return { skipped: true };

    this.isSyncing = true;
    this.updateSyncUI('syncing');

    try {
      const res = await fetch(this.getApiUrl('pull'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 404) {
        // Noch kein State auf Server -> aktuellen Zustand hochladen
        this.isSyncing = false;
        return await this.pushState();
      }

      if (!res.ok) {
        throw new Error(`Server antwortete mit Status ${res.status}`);
      }

      const json = await res.json();
      if (json && json.success && json.data) {
        const remoteData = json.data;
        const targetState = (typeof window !== 'undefined' && window.state) ? window.state : (typeof state !== 'undefined' ? state : null);

        if (targetState) {
          // Sicherheits-Backup vor Merge anlegen
          try {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('flow_backup_before_sync', JSON.stringify(targetState));
            }
          } catch (err) {}

          // Intelligenter Merge
          const hasChanges = this.mergeState(targetState, remoteData);

          if (typeof saveState === 'function') saveState(true);
          if (typeof renderApp === 'function') renderApp();

          // Falls lokaler Zustand neue Elemente hatte, Server aktualisieren
          if (hasChanges || this.isPendingSync()) {
            this.pushState();
          }
        }

        this.retryCount = 0;
        if (this.retryTimer) {
          clearTimeout(this.retryTimer);
          this.retryTimer = null;
        }
        this.lastSyncTime = new Date();
        this.syncError = null;
        this.updateSyncUI('synced');
        return { success: true, data: remoteData };
      }
      throw new Error(json.error || 'Ungültige Serverantwort');
    } catch (e) {
      console.warn('[CloudSync] Pull notice:', e.message);
      this.scheduleRetry();
      this.updateSyncUI('error');
      return { success: false, error: e.message };
    } finally {
      this.isSyncing = false;
    }
  },

  scheduleRetry() {
    if (this.retryTimer) clearTimeout(this.retryTimer);
    // Exponential Backoff: 3s, 6s, 12s, max 30s
    const delay = Math.min(3000 * Math.pow(2, this.retryCount), 30000);
    this.retryCount++;

    this.retryTimer = setTimeout(() => {
      if (typeof FlowAuth !== 'undefined' && FlowAuth.isLoggedIn()) {
        if (this.isPendingSync()) {
          this.pushState(true);
        } else {
          this.pullState();
        }
      }
    }, delay);
  },

  triggerAutoPush() {
    if (typeof FlowAuth === 'undefined' || !FlowAuth.isLoggedIn()) return;
    this.markPendingSync();
    if (this.syncDebounceTimer) clearTimeout(this.syncDebounceTimer);
    this.syncDebounceTimer = setTimeout(() => {
      this.pushState();
    }, 1200);
  },

  startAutoSync() {
    this.stopAutoSync();
    const interval = (typeof FLOW_CONFIG !== 'undefined' && FLOW_CONFIG.AUTO_SYNC_INTERVAL_MS) || 20000;
    this.autoSyncTimer = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        if (this.isPendingSync()) {
          this.pushState();
        } else {
          this.pullState();
        }
      }
    }, interval);
  },

  stopAutoSync() {
    if (this.autoSyncTimer) {
      clearInterval(this.autoSyncTimer);
      this.autoSyncTimer = null;
    }
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  },

  updateSyncUI(overrideStatus = null) {
    if (typeof document === 'undefined') return;
    const statusLabel = document.getElementById('cloud-sync-status-text');
    const syncDot = document.getElementById('cloud-sync-status-dot');
    const modalStatusBadge = document.getElementById('p2p-status-badge');

    const isLoggedIn = (typeof FlowAuth !== 'undefined' && FlowAuth.isLoggedIn());

    let statusText = 'Bereit zur Synchronisation';
    let dotClass = 'w-2 h-2 rounded-full bg-emerald-400';
    let badgeHtml = '<span class="w-2 h-2 rounded-full bg-emerald-400"></span><span>✓ Synchronisiert</span>';
    let badgeClass = 'px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2';

    if (!isLoggedIn) {
      statusText = 'Nicht angemeldet (nur lokaler Modus)';
      dotClass = 'w-2 h-2 rounded-full bg-gray-500';
      badgeHtml = '<span class="w-2 h-2 rounded-full bg-gray-500"></span><span>Lokaler Modus</span>';
      badgeClass = 'px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs font-medium flex items-center justify-center gap-2';
    } else if (overrideStatus === 'error' || overrideStatus === 'offline') {
      statusText = '⚠ Synchronisation konnte nicht abgeschlossen werden – wir versuchen es erneut.';
      dotClass = 'w-2 h-2 rounded-full bg-amber-400 animate-pulse';
      badgeHtml = '<span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span><span>⚠ Sync pausiert – erneuter Versuch...</span>';
      badgeClass = 'px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center justify-center gap-2';
    } else if (this.isSyncing || overrideStatus === 'syncing') {
      statusText = 'Synchronisiere...';
      dotClass = 'w-2 h-2 rounded-full bg-amber-400 animate-spin';
      badgeHtml = '<span class="w-2 h-2 rounded-full bg-amber-400 animate-spin"></span><span>Synchronisiere...</span>';
      badgeClass = 'px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center justify-center gap-2';
    } else if (this.lastSyncTime) {
      const timeStr = this.lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      statusText = `✓ Synchronisiert (${timeStr} Uhr)`;
      dotClass = 'w-2 h-2 rounded-full bg-emerald-400';
      badgeHtml = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span><span>✓ Synchronisiert (${timeStr} Uhr)</span>`;
      badgeClass = 'px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2';
    }

    if (statusLabel) statusLabel.innerText = statusText;
    if (syncDot) syncDot.className = dotClass;
    if (modalStatusBadge) {
      modalStatusBadge.className = badgeClass;
      modalStatusBadge.innerHTML = badgeHtml;
    }
  }
};

window.cloudSyncEngine = cloudSyncEngine;

// ============================================================================
// 2. MODAL & UI HANDLER FÜR AUTH & KOPPLUNG
// ============================================================================

function openP2PSyncModal(preferredTab = null) {
  const modal = document.getElementById('modal-p2p-sync');
  if (modal) {
    modal.classList.remove('hidden');

    if (typeof FlowAuth !== 'undefined') {
      FlowAuth.updateAuthUI();
    }
    if (typeof cloudSyncEngine !== 'undefined') {
      cloudSyncEngine.updateSyncUI();
    }

    const defaultTab = preferredTab || (typeof FlowAuth !== 'undefined' && FlowAuth.isLoggedIn() ? 'account' : 'account');
    switchSyncModalTab(defaultTab);

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}
window.openP2PSyncModal = openP2PSyncModal;

function closeP2PSyncModal() {
  const modal = document.getElementById('modal-p2p-sync');
  if (modal) modal.classList.add('hidden');
}
window.closeP2PSyncModal = closeP2PSyncModal;

function switchSyncModalTab(tab) {
  const paneAccount = document.getElementById('sync-pane-cloud') || document.getElementById('sync-pane-account');
  const panePair = document.getElementById('p2p-pane-qr') || document.getElementById('sync-pane-pair');

  const btnAccount = document.getElementById('sync-tab-btn-cloud') || document.getElementById('sync-tab-btn-account');
  const btnPair = document.getElementById('p2p-tab-btn-qr') || document.getElementById('sync-tab-btn-pair');

  const isAccount = (tab === 'account' || tab === 'cloud');
  const isPair = (tab === 'pair' || tab === 'qr' || tab === 'manual');

  if (paneAccount) paneAccount.classList.toggle('hidden', !isAccount);
  if (panePair) panePair.classList.toggle('hidden', !isPair);

  const activeClasses = 'flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm';
  const inactiveClasses = 'flex-1 py-2 px-3 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5';

  if (btnAccount) btnAccount.className = isAccount ? activeClasses : inactiveClasses;
  if (btnPair) btnPair.className = isPair ? activeClasses : inactiveClasses;

  if (isPair && typeof FlowAuth !== 'undefined' && FlowAuth.isLoggedIn()) {
    handleCreatePairCode();
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}
window.switchSyncModalTab = switchSyncModalTab;
window.switchP2PTab = (tab) => switchSyncModalTab(tab);

// 1. E-Mail & Passwort Login
async function handleEmailAuth() {
  const emailInput = document.getElementById('sync-email-input');
  const passwordInput = document.getElementById('sync-password-input');
  const btn = document.getElementById('sync-auth-submit-btn');
  const errorMsg = document.getElementById('sync-auth-error-msg');
  const successMsg = document.getElementById('sync-auth-success-msg');

  if (!emailInput || !passwordInput) return;
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

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

  if (!password || password.length < 4) {
    if (errorMsg) {
      errorMsg.innerText = tr({
        de: 'Bitte gib ein Passwort / PIN mit mindestens 4 Zeichen ein.',
        en: 'Please enter a password / PIN with at least 4 characters.',
        es: 'Introduce una contraseña / PIN de al menos 4 caracteres.',
        el: 'Εισάγετε κωδικό πρόσβασης με τουλάχιστον 4 χαρακτήρες.',
        fr: 'Veuillez saisir un mot de passe d\'au moins 4 caractères.',
        it: 'Inserisci una password di almeno 4 caratteri.'
      });
      errorMsg.classList.remove('hidden');
    }
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="animate-spin inline-block mr-1">⏳</span> Anmelden...';
  }

  try {
    const res = await FlowAuth.signInWithCredentials(email, password);
    if (res.success) {
      if (typeof showToast === 'function') {
        showToast(tr({
          de: '✓ Erfolgreich angemeldet! Synchronisation läuft...',
          en: '✓ Successfully signed in! Syncing...',
          es: '✓ ¡Inicio de sesión correcto!',
          el: '✓ Επιτυχής σύνδεση!',
          fr: '✓ Connexion réussie !',
          it: '✓ Accesso riuscito!'
        }));
      }
      await cloudSyncEngine.pullState();
    } else {
      if (errorMsg) {
        errorMsg.innerText = res.error || 'Anmeldung fehlgeschlagen.';
        errorMsg.classList.remove('hidden');
      }
    }
  } catch (e) {
    if (errorMsg) {
      errorMsg.innerText = 'Verbindungsfehler beim Anmelden.';
      errorMsg.classList.remove('hidden');
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="log-in" class="w-4 h-4"></i><span>Anmelden / Registrieren</span>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }
}
window.handleEmailAuth = handleEmailAuth;
window.handleSendMagicLink = handleEmailAuth;

// 2. 6-Stelligen Code auf Gerät A generieren
async function handleCreatePairCode() {
  const codeDisplay = document.getElementById('pair-code-display') || document.getElementById('p2p-room-code');
  const qrImg = document.getElementById('p2p-qr-img');

  if (codeDisplay) {
    codeDisplay.innerText = 'Code wird geladen...';
  }

  try {
    const res = await FlowAuth.createPairingCode();
    if (res && res.success && res.code) {
      if (codeDisplay) {
        // Formatieren als: 123 456
        const formatted = `${res.code.slice(0, 3)} ${res.code.slice(3)}`;
        codeDisplay.innerText = formatted;
      }

      if (qrImg) {
        const qrSvg = MinimalQR.generateQRCodeSVG(res.code, 240);
        if (qrSvg) qrImg.src = qrSvg;
      }
    } else {
      if (codeDisplay) codeDisplay.innerText = 'Kopplung bereit';
    }
  } catch (e) {
    if (codeDisplay) codeDisplay.innerText = 'Fehler beim Laden';
  }
}
window.handleCreatePairCode = handleCreatePairCode;

// 3. 6-Stelligen Code auf Gerät B eingeben & einlösen
async function handleConfirmPairCode() {
  const input = document.getElementById('pair-code-input');
  const btn = document.getElementById('pair-code-submit-btn');
  const errorMsg = document.getElementById('pair-code-error-msg');

  if (!input) return;
  const rawCode = input.value.replace(/\s+/g, '').trim();

  if (errorMsg) errorMsg.classList.add('hidden');

  if (!rawCode || !/^\d{6}$/.test(rawCode)) {
    if (errorMsg) {
      errorMsg.innerText = tr({
        de: 'Bitte gib den 6-stelligen Zahlencode ein.',
        en: 'Please enter the 6-digit number code.',
        es: 'Introduce el código numérico de 6 dígitos.',
        el: 'Εισάγετε τον 6ψήφιο αριθμητικό κωδικό.',
        fr: 'Veuillez saisir le code à 6 chiffres.',
        it: 'Inserisci il codice numerico a 6 cifre.'
      });
      errorMsg.classList.remove('hidden');
    }
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="animate-spin inline-block mr-1">⏳</span> Verbinde...';
  }

  try {
    const res = await FlowAuth.confirmPairingCode(rawCode);
    if (res && res.success) {
      if (typeof showToast === 'function') {
        showToast(tr({
          de: '📱 Gerät erfolgreich verbunden! ⚡',
          en: '📱 Device successfully connected! ⚡',
          es: '📱 ¡Dispositivo conectado con éxito! ⚡',
          el: '📱 Η συσκευή συνδέθηκε επιτυχώς! ⚡',
          fr: '📱 Appareil connecté avec succès ! ⚡',
          it: '📱 Dispositivo connesso con successo! ⚡'
        }));
      }
      closeP2PSyncModal();
      await cloudSyncEngine.pullState();
    } else {
      if (errorMsg) {
        errorMsg.innerText = res.error || 'Ungültiger oder abgelaufener Code.';
        errorMsg.classList.remove('hidden');
      }
    }
  } catch (e) {
    if (errorMsg) {
      errorMsg.innerText = 'Verbindungsfehler beim Koppeln.';
      errorMsg.classList.remove('hidden');
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="link-2" class="w-4 h-4"></i><span>Gerät verbinden</span>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }
}
window.handleConfirmPairCode = handleConfirmPairCode;

async function handleManualCloudSync() {
  if (typeof cloudSyncEngine !== 'undefined') {
    const res = await cloudSyncEngine.pullState();
    if (res && res.success) {
      if (typeof showToast === 'function') {
        showToast(tr({
          de: '✓ Synchronisiert',
          en: '✓ Synchronized',
          es: '✓ Sincronizado',
          el: '✓ Συγχρονίστηκε',
          fr: '✓ Synchronisé',
          it: '✓ Sincronizzato'
        }));
      }
    } else {
      if (typeof showToast === 'function') {
        showToast(tr({
          de: '⚠ Synchronisation konnte nicht abgeschlossen werden – wir versuchen es erneut.',
          en: '⚠ Sync could not be completed – retrying.',
          es: '⚠ Error de sincronización – reintentando.',
          el: '⚠ Σφάλμα συγχρονισμού – προσπάθεια ξανά.',
          fr: '⚠ Échec de la synchronisation – nouvel essai.',
          it: '⚠ Sincronizzazione fallita – nuovo tentativo.'
        }));
      }
    }
  }
}
window.handleManualCloudSync = handleManualCloudSync;

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
    }
  }
}
window.handleLogout = handleLogout;

// Initialisierung bei DOMContentLoaded
if (typeof window !== 'undefined') {
  window.MinimalQR = MinimalQR;
  window.cloudSyncEngine = cloudSyncEngine;
  window.openP2PSyncModal = openP2PSyncModal;
  window.closeP2PSyncModal = closeP2PSyncModal;
  window.switchP2PTab = switchP2PTab;
  window.switchSyncModalTab = switchSyncModalTab;

  window.addEventListener('DOMContentLoaded', () => {
    cloudSyncEngine.init();
  });
}
if (typeof globalThis !== 'undefined') {
  globalThis.MinimalQR = MinimalQR;
  globalThis.cloudSyncEngine = cloudSyncEngine;
  globalThis.openP2PSyncModal = openP2PSyncModal;
  globalThis.closeP2PSyncModal = closeP2PSyncModal;
  globalThis.switchP2PTab = switchP2PTab;
  globalThis.switchSyncModalTab = switchSyncModalTab;
}

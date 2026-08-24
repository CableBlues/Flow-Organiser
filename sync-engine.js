// sync-engine.js: Zuverlässige, permanente Multi-Device Synchronisation & Smartphone-Kopplung

const SYNC_STORAGE_KEY = 'flowPlannerSyncAccount';
const CLOUD_API_BASE = 'https://api.restful-api.dev/objects';

const syncEngine = {
  account: null, // { id, username, pin, lastSync, passHash }
  autoSyncTimer: null,
  syncInProgress: false,
  lastSavedTimestamp: null,

  init() {
    this.loadAccount();
    this.updateUI();
    if (this.account && this.account.id) {
      this.startAutoSync();
      setTimeout(() => this.pullFromCloud(true), 800);
    }
  },

  loadAccount() {
    try {
      const saved = localStorage.getItem(SYNC_STORAGE_KEY);
      if (saved) {
        this.account = JSON.parse(saved);
      }
    } catch (e) {
      this.account = null;
    }
  },

  saveAccount() {
    if (this.account) {
      localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(this.account));
    } else {
      localStorage.removeItem(SYNC_STORAGE_KEY);
    }
    this.updateUI();
  },

  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  },

  async apiFetch(url, options = {}, timeoutMs = 8000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const resp = await fetch(url, { ...options, credentials: 'omit', signal: controller.signal });
      clearTimeout(timer);
      return resp;
    } catch (e) {
      clearTimeout(timer);
      return null;
    }
  },

  // -------------------------------------------------------------
  // KONTO REGISTRIERUNG & ANMELDUNG (MIT ECHTER PRÜFUNG)
  // -------------------------------------------------------------

  async signUp(username, password) {
    username = (username || '').trim();
    password = (password || '').trim();

    if (!username || username.length < 2) {
      showToast(tr({
        de: 'Bitte einen gültigen Benutzernamen eingeben (mind. 2 Zeichen)!',
        en: 'Please enter a valid username (min. 2 characters)!'
      }));
      return false;
    }
    if (!password || password.length < 4) {
      showToast(tr({
        de: 'Passwort muss mindestens 4 Zeichen lang sein!',
        en: 'Password must be at least 4 characters long!'
      }));
      return false;
    }

    const passHash = this.hashCode(password + '_flow_salt2026');
    const userSlug = 'flow_acc_' + username.toLowerCase().replace(/[^a-z0-9]/g, '_');

    showToast(tr({ de: 'Erstelle Konto in der Cloud... ☁️', en: 'Creating cloud account... ☁️' }));

    // Bestehende Cloud-ID erneuern oder erstellen
    const payload = {
      name: userSlug,
      data: {
        username: username,
        passHash: passHash,
        state: state,
        categoriesOrder: categoriesOrder,
        updatedAt: new Date().toISOString()
      }
    };

    const resp = await this.apiFetch(CLOUD_API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!resp || !resp.ok) {
      showToast(tr({
        de: 'Verbindung zur Cloud fehlgeschlagen. Bitte erneut versuchen!',
        en: 'Cloud connection failed. Please try again!'
      }));
      return false;
    }

    const data = await resp.json();
    this.account = {
      id: data.id,
      username: username,
      passHash: passHash,
      pin: 'FLOW-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      lastSync: new Date().toISOString()
    };

    this.saveAccount();
    showToast(tr({
      de: `✅ Konto für "${username}" erfolgreich erstellt & synchronisiert!`,
      en: `✅ Account created & synchronized as "${username}"!`
    }));

    this.startAutoSync();
    this.updateUI();
    return true;
  },

  async signIn(username, password) {
    username = (username || '').trim();
    password = (password || '').trim();

    if (!username || !password) {
      showToast(tr({
        de: 'Bitte Benutzername und Passwort eingeben!',
        en: 'Please enter username and password!'
      }));
      return false;
    }

    const passHash = this.hashCode(password + '_flow_salt2026');
    showToast(tr({ de: 'Prüfe Anmeldedaten... 🔄', en: 'Verifying credentials... 🔄' }));

    // Wenn lokale Account-ID vorhanden ist, direkt prüfen
    if (this.account && this.account.id && this.account.username.toLowerCase() === username.toLowerCase()) {
      if (this.account.passHash === passHash) {
        await this.pullFromCloud();
        showToast(tr({
          de: `✅ Willkommen zurück, ${username}! Daten synchronisiert.`,
          en: `✅ Welcome back, ${username}! Data synchronized.`
        }));
        this.startAutoSync();
        this.updateUI();
        return true;
      } else {
        showToast(tr({ de: '❌ Falsches Passwort!', en: '❌ Incorrect password!' }));
        return false;
      }
    }

    // Falls auf neuem Gerät (z. B. Smartphone): Prüfe über Kopplungs-Code / ID
    showToast(tr({
      de: 'Tipp: Nutze auf dem Smartphone einfach den 1-Klick Kopplungs-Code!',
      en: 'Tip: On mobile, simply use the 1-Click Pairing Code!'
    }));
    return false;
  },

  signOut() {
    this.account = null;
    this.saveAccount();
    if (this.autoSyncTimer) {
      clearInterval(this.autoSyncTimer);
      this.autoSyncTimer = null;
    }
    this.updateUI();
    showToast(tr({
      de: 'Erfolgreich abgemeldet. (Lokaler Modus)',
      en: 'Successfully signed out. (Local mode)'
    }));
  },

  // -------------------------------------------------------------
  // CLOUD PUSH & PULL
  // -------------------------------------------------------------

  async pushToCloud() {
    if (!this.account || !this.account.id) return false;
    try {
      const nowIso = new Date().toISOString();
      this.lastSavedTimestamp = nowIso;

      const payload = {
        name: 'flow_user_data',
        data: {
          username: this.account.username || 'Mein Gerät',
          state: state,
          categoriesOrder: categoriesOrder,
          updatedAt: nowIso
        }
      };

      const resp = await this.apiFetch(`${CLOUD_API_BASE}/${this.account.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (resp && resp.ok) {
        this.lastSyncTime = new Date();
        this.account.lastSync = this.lastSyncTime.toISOString();
        this.saveAccount();
        return true;
      }
    } catch (e) {
      console.warn('Push error:', e);
    }
    return false;
  },

  async pullFromCloud(silent = false) {
    if (!this.account || !this.account.id) return false;
    try {
      const resp = await this.apiFetch(`${CLOUD_API_BASE}/${this.account.id}`);
      if (!resp || !resp.ok) return false;

      const data = await resp.json();
      if (data && data.data && data.data.state) {
        const remoteState = data.data.state;
        const remoteTime = data.data.updatedAt;

        if (!this.lastSavedTimestamp || (remoteTime && new Date(remoteTime) > new Date(this.lastSavedTimestamp))) {
          this.lastSavedTimestamp = remoteTime || new Date().toISOString();
          saveHistory();
          state = remoteState;
          if (Array.isArray(data.data.categoriesOrder) && data.data.categoriesOrder.length) {
            categoriesOrder = data.data.categoriesOrder;
            saveCategoriesOrder();
          }
          saveState();
          renderApp();
          if (typeof populateHelperTaskSelect === 'function') populateHelperTaskSelect();
          this.lastSyncTime = new Date();
          this.account.lastSync = this.lastSyncTime.toISOString();
          this.saveAccount();
          return true;
        }
      }
    } catch (e) {
      console.warn('Pull error:', e);
    }
    return false;
  },

  async syncNow(silent = false) {
    if (!this.account || !this.account.id) {
      if (!silent) openSyncModal('pair');
      return;
    }
    if (this.syncInProgress) return;
    this.syncInProgress = true;

    if (!silent) {
      showToast(tr({ de: 'Synchronisiere mit Cloud... ☁️', en: 'Syncing with cloud... ☁️' }));
    }

    const pulled = await this.pullFromCloud(silent);
    const pushed = await this.pushToCloud();

    this.syncInProgress = false;
    this.updateUI();

    if (!silent) {
      if (pushed || pulled) {
        showToast(tr({ de: '✅ Erfolgreich synchronisiert!', en: '✅ Successfully synced!' }));
      } else {
        showToast(tr({ de: 'Sync-Verbindung bereit & aktuell ✓', en: 'Sync connection ready & updated ✓' }));
      }
    }
  },

  startAutoSync() {
    if (this.autoSyncTimer) clearInterval(this.autoSyncTimer);
    this.autoSyncTimer = setInterval(() => {
      if (this.account && this.account.id && !this.syncInProgress) {
        this.pullFromCloud(true);
      }
    }, 15000);
  },

  // -------------------------------------------------------------
  // 1-KLICK KOPPLUNG (PC ↔ HANDY)
  // -------------------------------------------------------------

  async ensureCloudSyncObject() {
    if (this.account && this.account.id) {
      await this.pushToCloud();
      return this.account.id;
    }

    // Neues Cloud-Objekt für dieses Gerät erstellen
    const pin = 'FLOW-' + Math.floor(1000 + Math.random() * 9000);
    const payload = {
      name: 'flow_device_sync',
      data: {
        pin: pin,
        username: 'Mein Gerät',
        state: state,
        categoriesOrder: categoriesOrder,
        updatedAt: new Date().toISOString()
      }
    };

    const resp = await this.apiFetch(CLOUD_API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (resp && resp.ok) {
      const data = await resp.json();
      this.account = {
        id: data.id,
        username: 'Mein Gerät',
        pin: pin,
        createdAt: new Date().toISOString(),
        lastSync: new Date().toISOString()
      };
      this.saveAccount();
      this.startAutoSync();
      return data.id;
    }
    return null;
  },

  async publishPairingCode() {
    const cloudId = await this.ensureCloudSyncObject();
    const codeDisplay = document.getElementById('sync-pairing-code-display');
    const qrImg = document.getElementById('sync-qr-code-img');
    const linkInput = document.getElementById('sync-copy-link-input');

    if (!cloudId) {
      if (codeDisplay) codeDisplay.innerText = 'Verbindung wird aufgebaut...';
      return;
    }

    if (codeDisplay) {
      codeDisplay.innerText = cloudId;
    }

    const currentUrl = window.location.href.split('?')[0];
    const pairUrl = `${currentUrl}?sync=${encodeURIComponent(cloudId)}`;

    if (linkInput) linkInput.value = pairUrl;

    if (qrImg) {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(pairUrl)}&color=10b981&bgcolor=111116`;
    }
  },

  async pairWithCode(inputVal) {
    inputVal = (inputVal || '').trim();
    if (!inputVal) {
      showToast(tr({
        de: 'Bitte einen Kopplungs-Code oder Link eingeben!',
        en: 'Please enter a pairing code or link!'
      }));
      return false;
    }

    // Extrahiere syncId falls ein Link eingegeben wurde
    let syncId = inputVal;
    if (inputVal.includes('sync=')) {
      try {
        const url = new URL(inputVal);
        syncId = url.searchParams.get('sync') || inputVal;
      } catch (e) {}
    }

    showToast(tr({ de: 'Verbinde mit Gerät... 📱', en: 'Connecting to device... 📱' }));

    const resp = await this.apiFetch(`${CLOUD_API_BASE}/${syncId}`);
    if (resp && resp.ok) {
      const data = await resp.json();
      if (data && data.data && data.data.state) {
        saveHistory();
        state = data.data.state;
        if (Array.isArray(data.data.categoriesOrder) && data.data.categoriesOrder.length) {
          categoriesOrder = data.data.categoriesOrder;
          saveCategoriesOrder();
        }
        saveState();
        renderApp();
        if (typeof populateHelperTaskSelect === 'function') populateHelperTaskSelect();

        this.account = {
          id: syncId,
          username: data.data.username || 'Verbundenes Gerät',
          createdAt: new Date().toISOString(),
          lastSync: new Date().toISOString()
        };
        this.saveAccount();
        this.startAutoSync();
        this.updateUI();

        showToast(tr({
          de: '🎉 Erfolgreich mit PC gekoppelt! Alle Daten synchronisiert.',
          en: '🎉 Successfully paired with PC! All data synchronized.'
        }));
        return true;
      }
    }

    showToast(tr({
      de: '❌ Kopplungs-Code nicht gefunden. Bitte überprüfe den Code!',
      en: '❌ Pairing code not found. Please check the code!'
    }));
    return false;
  },

  updateUI() {
    const isAuth = !!(this.account && this.account.id);
    const authBtnIcon = document.getElementById('header-sync-btn-icon');
    const modalUserText = document.getElementById('sync-modal-user-text');
    const modalStatusBadge = document.getElementById('sync-modal-status-badge');
    const modalLoggedBox = document.getElementById('sync-modal-logged-box');
    const modalNotLoggedBox = document.getElementById('sync-modal-not-logged-box');
    const lastSyncSpan = document.getElementById('sync-modal-last-time');

    if (authBtnIcon) {
      authBtnIcon.className = isAuth
        ? 'w-3.5 h-3.5 text-emerald-400 animate-pulse'
        : 'w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-400';
    }

    if (modalUserText) {
      modalUserText.innerText = isAuth
        ? (this.account.username || 'Verbundenes Gerät')
        : tr({ de: 'Nicht verbunden (Lokaler Modus)', en: 'Not connected (Local mode)' });
    }

    if (modalStatusBadge) {
      modalStatusBadge.className = isAuth
        ? 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-mono'
        : 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-gray-400 border border-white/10 flex items-center gap-1 font-mono';
      modalStatusBadge.innerHTML = isAuth
        ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> 🟢 Live-Sync aktiv'
        : '⚪ Offline / Lokal';
    }

    if (modalLoggedBox) modalLoggedBox.classList.toggle('hidden', !isAuth);
    if (modalNotLoggedBox) modalNotLoggedBox.classList.toggle('hidden', isAuth);

    if (lastSyncSpan) {
      if (isAuth && this.account.lastSync) {
        const d = new Date(this.account.lastSync);
        lastSyncSpan.innerText = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      } else {
        lastSyncSpan.innerText = '--:--';
      }
    }
  }
};

// Automatisches Push-Debounce beim Speichern des Zustands
let _syncPushTimer = null;
const originalSaveState = window.saveState;
window.saveState = function() {
  if (typeof originalSaveState === 'function') originalSaveState();
  if (syncEngine.account && syncEngine.account.id) {
    clearTimeout(_syncPushTimer);
    _syncPushTimer = setTimeout(() => {
      syncEngine.pushToCloud();
    }, 800);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  syncEngine.init();

  const urlParams = new URLSearchParams(window.location.search);
  const syncParam = urlParams.get('sync') || urlParams.get('pair');
  if (syncParam) {
    setTimeout(() => {
      syncEngine.pairWithCode(syncParam);
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 800);
  }
});

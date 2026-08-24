// sync-engine.js: Kostenlose Multi-Device Synchronisation & Benutzerverwaltung

const SYNC_STORAGE_KEY = 'flowPlannerSyncAccount';
const KV_ENDPOINT_BASE = 'https://kvdb.io/6P7T9s8uN2D4wL5kR1mE/'; // Kostenlose, schnelle KV-Cloud für Flow Planner

const syncEngine = {
  account: null,
  autoSyncTimer: null,
  syncInProgress: false,
  lastSyncTime: null,

  init() {
    this.loadAccount();
    this.updateUI();
    if (this.account && this.account.username) {
      this.startAutoSync();
      setTimeout(() => this.syncNow(true), 1200);
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

  getUserStorageKey(username, password) {
    const raw = `flow_user_${username.toLowerCase().trim()}_${password}`;
    return 'flow_' + this.hashCode(raw) + '_' + this.hashCode(raw + '_salt2026');
  },

  async signUp(username, password) {
    username = (username || '').trim();
    if (!username || !password || password.length < 4) {
      showToast(tr({
        de: 'Bitte Benutzername und mind. 4-stelliges Passwort eingeben!',
        en: 'Please enter username and min. 4-character password!'
      }));
      return false;
    }

    const key = this.getUserStorageKey(username, password);
    const pairingCode = 'FLOW-' + Math.floor(1000 + Math.random() * 9000);

    this.account = {
      username,
      key,
      pairingCode,
      createdAt: new Date().toISOString(),
      lastSync: new Date().toISOString()
    };

    this.saveAccount();
    showToast(tr({
      de: `✅ Konto für "${username}" erstellt & angemeldet!`,
      en: `✅ Account created & signed in as "${username}"!`
    }));

    await this.pushToCloud();
    this.startAutoSync();
    this.updateUI();
    return true;
  },

  async signIn(username, password) {
    username = (username || '').trim();
    if (!username || !password) {
      showToast(tr({
        de: 'Bitte Benutzername und Passwort eingeben!',
        en: 'Please enter username and password!'
      }));
      return false;
    }

    const key = this.getUserStorageKey(username, password);
    const pairingCode = 'FLOW-' + Math.floor(1000 + Math.random() * 9000);

    this.account = {
      username,
      key,
      pairingCode,
      lastSync: new Date().toISOString()
    };

    this.saveAccount();
    showToast(tr({
      de: `Verbinde mit Konto "${username}"... 🔄`,
      en: `Connecting to account "${username}"... 🔄`
    }));

    const pulled = await this.pullFromCloud();
    if (pulled) {
      showToast(tr({
        de: `✅ Willkommen zurück, ${username}! Daten synchronisiert.`,
        en: `✅ Welcome back, ${username}! Data synchronized.`
      }));
    } else {
      await this.pushToCloud();
      showToast(tr({
        de: `✅ Angemeldet als "${username}"!`,
        en: `✅ Signed in as "${username}"!`
      }));
    }

    this.startAutoSync();
    this.updateUI();
    return true;
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

  async pushToCloud() {
    if (!this.account || !this.account.key) return false;
    try {
      const payload = {
        state: state,
        categoriesOrder: categoriesOrder,
        savedAt: new Date().toISOString(),
        version: 3
      };

      const kvResp = await fetch(KV_ENDPOINT_BASE + this.account.key, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (kvResp.ok) {
        this.lastSyncTime = new Date();
        this.account.lastSync = this.lastSyncTime.toISOString();
        this.saveAccount();
        return true;
      }
    } catch (e) {
      console.warn('Sync push warning:', e);
    }
    return false;
  },

  async pullFromCloud() {
    if (!this.account || !this.account.key) return false;
    try {
      let data = null;
      const kvResp = await fetch(KV_ENDPOINT_BASE + this.account.key);
      if (kvResp.ok) {
        data = await kvResp.json();
      }

      if (data && data.state) {
        saveHistory();
        state = data.state;
        if (Array.isArray(data.categoriesOrder) && data.categoriesOrder.length) {
          categoriesOrder = data.categoriesOrder;
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
    } catch (e) {
      console.warn('Sync pull warning:', e);
    }
    return false;
  },

  async syncNow(silent = false) {
    if (!this.account) {
      if (!silent) openSyncModal();
      return;
    }
    if (this.syncInProgress) return;
    this.syncInProgress = true;

    if (!silent) {
      showToast(tr({ de: 'Synchronisiere mit Cloud... ☁️', en: 'Syncing with cloud... ☁️' }));
    }

    const pulled = await this.pullFromCloud();
    const pushed = await this.pushToCloud();

    this.syncInProgress = false;
    this.updateUI();

    if (!silent) {
      if (pushed || pulled) {
        showToast(tr({ de: '✅ Erfolgreich synchronisiert!', en: '✅ Successfully synced!' }));
      } else {
        showToast(tr({ de: 'Sync-Verbindung bereit.', en: 'Sync connection ready.' }));
      }
    }
  },

  startAutoSync() {
    if (this.autoSyncTimer) clearInterval(this.autoSyncTimer);
    this.autoSyncTimer = setInterval(() => {
      if (this.account && !this.syncInProgress) {
        this.pullFromCloud();
      }
    }, 30000);
  },

  async pairWithCode(code) {
    code = (code || '').trim().toUpperCase();
    if (!code || code.length < 5) {
      showToast(tr({
        de: 'Bitte einen gültigen Kopplungs-Code eingeben (z. B. FLOW-7492)!',
        en: 'Please enter a valid pairing code (e.g. FLOW-7492)!'
      }));
      return false;
    }

    const pairKey = 'flow_pair_' + this.hashCode(code);
    showToast(tr({ de: 'Kopplung wird gesucht... 📱', en: 'Searching pairing... 📱' }));

    try {
      const resp = await fetch(KV_ENDPOINT_BASE + pairKey);
      if (resp.ok) {
        const pairData = await resp.json();
        if (pairData && pairData.account) {
          this.account = pairData.account;
          this.saveAccount();
          await this.pullFromCloud();
          showToast(tr({
            de: `🎉 Erfolgreich mit "${this.account.username}" gekoppelt!`,
            en: `🎉 Successfully paired with "${this.account.username}"!`
          }));
          this.startAutoSync();
          this.updateUI();
          return true;
        }
      }
    } catch (e) {}

    showToast(tr({
      de: 'Kopplungs-Code nicht gefunden oder abgelaufen.',
      en: 'Pairing code not found or expired.'
    }));
    return false;
  },

  async publishPairingCode() {
    if (!this.account) return;
    const code = this.account.pairingCode || ('FLOW-' + Math.floor(1000 + Math.random() * 9000));
    this.account.pairingCode = code;
    this.saveAccount();

    const pairKey = 'flow_pair_' + this.hashCode(code);
    try {
      await fetch(KV_ENDPOINT_BASE + pairKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account: this.account, createdAt: new Date().toISOString() })
      });
    } catch (e) {}

    const codeDisplay = document.getElementById('sync-pairing-code-display');
    if (codeDisplay) codeDisplay.innerText = code;
    
    const currentUrl = window.location.href.split('?')[0];
    const pairUrl = `${currentUrl}?pair=${encodeURIComponent(code)}`;
    const qrImg = document.getElementById('sync-qr-code-img');
    if (qrImg) {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(pairUrl)}&color=10b981&bgcolor=111116`;
    }
  },

  updateUI() {
    const isAuth = !!(this.account && this.account.username);
    const authBtnText = document.getElementById('header-sync-btn-text');
    const authBtnIcon = document.getElementById('header-sync-btn-icon');
    const panelStatus = document.getElementById('panel-sync-status');
    const panelUsername = document.getElementById('panel-sync-username');

    if (authBtnText) {
      authBtnText.innerText = isAuth ? this.account.username : t('login_btn');
    }
    if (authBtnIcon) {
      if (isAuth) {
        authBtnIcon.classList.remove('text-emerald-400', 'text-gray-400');
        authBtnIcon.classList.add('text-emerald-300');
      }
    }
    if (panelStatus) {
      panelStatus.innerText = isAuth ? '🟢 Live-Sync aktiv' : '⚪ Nicht angemeldet';
    }
    if (panelUsername) {
      panelUsername.innerText = isAuth ? this.account.username : 'Lokaler Speicher';
    }

    const modalUserText = document.getElementById('sync-modal-user-text');
    const modalAuthBox = document.getElementById('sync-modal-auth-box');
    const modalLoggedBox = document.getElementById('sync-modal-logged-box');
    const lastSyncSpan = document.getElementById('sync-modal-last-time');

    if (modalUserText) {
      modalUserText.innerText = isAuth ? `Angemeldet als ${this.account.username}` : 'Nicht angemeldet (Lokaler Modus)';
    }
    if (modalAuthBox) modalAuthBox.classList.toggle('hidden', isAuth);
    if (modalLoggedBox) modalLoggedBox.classList.toggle('hidden', !isAuth);
    if (lastSyncSpan && this.account && this.account.lastSync) {
      const d = new Date(this.account.lastSync);
      lastSyncSpan.innerText = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  syncEngine.init();

  const urlParams = new URLSearchParams(window.location.search);
  const pairParam = urlParams.get('pair');
  if (pairParam) {
    setTimeout(() => {
      syncEngine.pairWithCode(pairParam);
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 1000);
  }
});

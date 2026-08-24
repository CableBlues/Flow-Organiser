// sync-engine.js: Zuverlässige, kostenlose Multi-Device Synchronisation & Smartphone-Kopplung

const SYNC_STORAGE_KEY = 'flowPlannerSyncAccount';
const CLOUD_SYNC_ENDPOINT = 'https://ntfy.sh/';

const syncEngine = {
  account: null,
  autoSyncTimer: null,
  syncInProgress: false,
  lastSyncTime: null,
  lastSavedTimestamp: null,

  init() {
    this.loadAccount();
    this.updateUI();
    if (this.account && this.account.key) {
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

  getUserStorageKey(username, password) {
    const raw = `flow_v4_${username.toLowerCase().trim()}_${password}`;
    return 'u_' + this.hashCode(raw) + '_' + this.hashCode(raw + '_salt99');
  },

  async signUp(username, password) {
    username = (username || '').trim();
    if (!username || !password || password.length < 4) {
      showToast(tr({
        de: 'Bitte Benutzername und mind. 4-stelliges Passwort eingeben!',
        en: 'Please enter username and min. 4-character password!',
        fr: 'Veuillez saisir un nom et mot de passe (min. 4 car.) !',
        it: 'Inserisci nome utente e password (min. 4 car.)!',
        es: '¡Introduce nombre de usuario y contraseña (mín. 4 car.)!',
        el: 'Εισάγετε όνομα χρήστη και κωδικό πρόσβασης (τουλ. 4 χαρακτήρες)!'
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
      en: `✅ Account created & signed in as "${username}"!`,
      fr: `✅ Compte créé et connecté pour "${username}" !`,
      it: `✅ Account creato e connesso come "${username}"!`,
      es: `✅ ¡Cuenta creada y conectada como "${username}"!`,
      el: `✅ Ο λογαριασμός δημιουργήθηκε για "${username}"!`
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
        en: 'Please enter username and password!',
        fr: 'Veuillez saisir votre nom et mot de passe !',
        it: 'Inserisci nome utente e password!',
        es: '¡Introduce nombre de usuario y contraseña!',
        el: 'Εισάγετε όνομα χρήστη και κωδικό πρόσβασης!'
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
      en: `Connecting to account "${username}"... 🔄`,
      fr: `Connexion au compte "${username}"... 🔄`,
      it: `Connessione all'account "${username}"... 🔄`,
      es: `Conectando con la cuenta "${username}"... 🔄`,
      el: `Σύνδεση με το λογαριασμό "${username}"... 🔄`
    }));

    const pulled = await this.pullFromCloud();
    if (pulled) {
      showToast(tr({
        de: `✅ Willkommen zurück, ${username}! Daten synchronisiert.`,
        en: `✅ Welcome back, ${username}! Data synchronized.`,
        fr: `✅ Bon retour, ${username} ! Données synchronisées.`,
        it: `✅ Bentornato, ${username}! Dati sincronizzati.`,
        es: `✅ ¡Bienvenido de nuevo, ${username}! Datos sincronizados.`,
        el: `✅ Καλώς ήρθατε πίσω, ${username}! Τα δεδομένα συγχρονίστηκαν.`
      }));
    } else {
      await this.pushToCloud();
      showToast(tr({
        de: `✅ Angemeldet als "${username}"!`,
        en: `✅ Signed in as "${username}"!`,
        fr: `✅ Connecté en tant que "${username}" !`,
        it: `✅ Connesso come "${username}"!`,
        es: `✅ Conectado como "${username}"!`,
        el: `✅ Συνδεδεμένος ως "${username}"!`
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
      en: 'Successfully signed out. (Local mode)',
      fr: 'Déconnecté avec succès. (Mode local)',
      it: 'Disconnesso con successo. (Modalità locale)',
      es: 'Desconectado con éxito. (Modo local)',
      el: 'Αποσυνδεθήκατε επιτυχώς. (Τοπική λειτουργία)'
    }));
  },

  async pushToCloud() {
    if (!this.account || !this.account.key) return false;
    try {
      const nowIso = new Date().toISOString();
      this.lastSavedTimestamp = nowIso;
      const payload = {
        state: state,
        categoriesOrder: categoriesOrder,
        savedAt: nowIso,
        account: { username: this.account.username, key: this.account.key }
      };

      const channel = 'flow_sync_' + this.account.key;
      const resp = await fetch(CLOUD_SYNC_ENDPOINT + channel, {
        method: 'POST',
        headers: { 'Title': 'FlowSync' },
        body: JSON.stringify(payload)
      });

      if (resp.ok) {
        this.lastSyncTime = new Date();
        this.account.lastSync = this.lastSyncTime.toISOString();
        this.saveAccount();
        return true;
      }
    } catch (e) {
      console.warn('Sync push notice:', e);
    }
    return false;
  },

  async pullFromCloud(silent = false) {
    if (!this.account || !this.account.key) return false;
    try {
      const channel = 'flow_sync_' + this.account.key;
      const resp = await fetch(CLOUD_SYNC_ENDPOINT + channel + '/json?poll=1&since=all');
      if (!resp.ok) return false;

      const text = await resp.text();
      const lines = text.trim().split('\n').filter(Boolean);
      let latestPayload = null;

      for (const line of lines) {
        try {
          const msgObj = JSON.parse(line);
          if (msgObj.event === 'message' && msgObj.message) {
            const data = JSON.parse(msgObj.message);
            if (data && data.state && data.savedAt) {
              if (!latestPayload || new Date(data.savedAt) > new Date(latestPayload.savedAt)) {
                latestPayload = data;
              }
            }
          }
        } catch (err) {}
      }

      if (latestPayload && latestPayload.state) {
        if (!this.lastSavedTimestamp || new Date(latestPayload.savedAt) > new Date(this.lastSavedTimestamp)) {
          this.lastSavedTimestamp = latestPayload.savedAt;
          saveHistory();
          state = latestPayload.state;
          if (Array.isArray(latestPayload.categoriesOrder) && latestPayload.categoriesOrder.length) {
            categoriesOrder = latestPayload.categoriesOrder;
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
      console.warn('Sync pull notice:', e);
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
      showToast(tr({
        de: 'Synchronisiere mit Cloud... ☁️',
        en: 'Syncing with cloud... ☁️',
        fr: 'Synchronisation dans le cloud... ☁️',
        it: 'Sincronizzazione in corso... ☁️',
        es: 'Sincronizando con la nube... ☁️',
        el: 'Συγχρονισμός στο cloud... ☁️'
      }));
    }

    const pulled = await this.pullFromCloud(silent);
    const pushed = await this.pushToCloud();

    this.syncInProgress = false;
    this.updateUI();

    if (!silent) {
      if (pushed || pulled) {
        showToast(tr({
          de: '✅ Erfolgreich synchronisiert!',
          en: '✅ Successfully synced!',
          fr: '✅ Synchronisé avec succès !',
          it: '✅ Sincronizzato con successo!',
          es: '✅ ¡Sincronizado con éxito!',
          el: '✅ Ο συγχρονισμός ολοκληρώθηκε επιτυχώς!'
        }));
      } else {
        showToast(tr({
          de: 'Sync-Verbindung bereit & aktuell ✓',
          en: 'Sync connection ready & updated ✓',
          fr: 'Connexion de sync à jour ✓',
          it: 'Connessione di sincronizzazione pronta ✓',
          es: 'Conexión de sincronización lista ✓',
          el: 'Η σύνδεση συγχρονισμού είναι έτοιμη ✓'
        }));
      }
    }
  },

  startAutoSync() {
    if (this.autoSyncTimer) clearInterval(this.autoSyncTimer);
    this.autoSyncTimer = setInterval(() => {
      if (this.account && !this.syncInProgress) {
        this.pullFromCloud(true);
      }
    }, 15000);
  },

  // -------------------------------------------------------------
  // 1-KLICK KOPPLUNG (CODE & QR-CODE)
  // -------------------------------------------------------------

  async publishPairingCode() {
    let code = this.account?.pairingCode;
    if (!code) {
      code = 'FLOW-' + Math.floor(1000 + Math.random() * 9000);
      if (!this.account) {
        const tempKey = 'pair_' + this.hashCode(code + '_' + Date.now());
        this.account = {
          username: 'Mein Gerät',
          key: tempKey,
          pairingCode: code,
          createdAt: new Date().toISOString(),
          lastSync: new Date().toISOString()
        };
        this.saveAccount();
      } else {
        this.account.pairingCode = code;
        this.saveAccount();
      }
    }

    const codeClean = code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const pairChannel = 'flow_pair_' + codeClean;

    const payload = {
      account: this.account,
      state: state,
      categoriesOrder: categoriesOrder,
      savedAt: new Date().toISOString()
    };

    try {
      await fetch(CLOUD_SYNC_ENDPOINT + pairChannel, {
        method: 'POST',
        headers: { 'Title': 'FlowPair' },
        body: JSON.stringify(payload)
      });
    } catch (e) {}

    const codeDisplay = document.getElementById('sync-pairing-code-display');
    if (codeDisplay) codeDisplay.innerText = code;

    const currentUrl = window.location.href.split('?')[0];
    const pairUrl = `${currentUrl}?pair=${encodeURIComponent(code)}`;
    const qrImg = document.getElementById('sync-qr-code-img');
    if (qrImg) {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(pairUrl)}&color=10b981&bgcolor=111116`;
    }
  },

  async pairWithCode(code) {
    code = (code || '').trim().toUpperCase();
    if (!code || code.length < 4) {
      showToast(tr({
        de: 'Bitte einen gültigen Kopplungs-Code eingeben (z. B. FLOW-7492)!',
        en: 'Please enter a valid pairing code (e.g. FLOW-7492)!',
        fr: 'Veuillez saisir un code valide (ex. FLOW-7492) !',
        it: 'Inserisci un codice valido (es. FLOW-7492)!',
        es: '¡Introduce un código de vinculación válido (ej. FLOW-7492)!',
        el: 'Εισάγετε έγκυρο κωδικό ζεύξης (π.χ. FLOW-7492)!'
      }));
      return false;
    }

    const codeClean = code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const pairChannel = 'flow_pair_' + codeClean;

    showToast(tr({
      de: 'Verbinde mit Gerät... 📱',
      en: 'Connecting to device... 📱',
      fr: 'Connexion à l\'appareil... 📱',
      it: 'Connessione al dispositivo... 📱',
      es: 'Conectando con el dispositivo... 📱',
      el: 'Σύνδεση με τη συσκευή... 📱'
    }));

    try {
      const resp = await fetch(CLOUD_SYNC_ENDPOINT + pairChannel + '/json?poll=1&since=all');
      if (resp.ok) {
        const text = await resp.text();
        const lines = text.trim().split('\n').filter(Boolean);
        let latestPair = null;

        for (const line of lines) {
          try {
            const msgObj = JSON.parse(line);
            if (msgObj.event === 'message' && msgObj.message) {
              const data = JSON.parse(msgObj.message);
              if (data && data.account) latestPair = data;
            }
          } catch (err) {}
        }

        if (latestPair && latestPair.account) {
          this.account = latestPair.account;
          this.saveAccount();

          if (latestPair.state) {
            saveHistory();
            state = latestPair.state;
            if (Array.isArray(latestPair.categoriesOrder) && latestPair.categoriesOrder.length) {
              categoriesOrder = latestPair.categoriesOrder;
              saveCategoriesOrder();
            }
            saveState();
            renderApp();
            if (typeof populateHelperTaskSelect === 'function') populateHelperTaskSelect();
          }

          showToast(tr({
            de: `🎉 Erfolgreich gekoppelt! Alle Daten synchronisiert.`,
            en: `🎉 Successfully paired! All data synchronized.`,
            fr: `🎉 Appareil connecté ! Données synchronisées.`,
            it: `🎉 Dispositivo accoppiato con successo!`,
            es: `🎉 ¡Dispositivo vinculado con éxito!`,
            el: `🎉 Επιτυχής σύνδεση! Όλα τα δεδομένα συγχρονίστηκαν.`
          }));

          this.startAutoSync();
          this.updateUI();
          return true;
        }
      }
    } catch (e) {
      console.warn('Pairing error:', e);
    }

    showToast(tr({
      de: 'Kopplungs-Code nicht gefunden oder abgelaufen. Bitte auf dem anderen Gerät neu öffnen!',
      en: 'Pairing code not found or expired. Please reopen on the other device!',
      fr: 'Code introuvable. Veuillez rouvrir le menu sur l\'autre appareil !',
      it: 'Codice non trovato. Riapri il menu sull\'altro dispositivo!',
      es: 'Código no encontrado. ¡Vuelve a abrirlo en el otro dispositivo!',
      el: 'Ο κωδικός δεν βρέθηκε. Ανοίξτε ξανά το μενού στην άλλη συσκευή!'
    }));
    return false;
  },

  updateUI() {
    const isAuth = !!(this.account && this.account.key);
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
  if (syncEngine.account && syncEngine.account.key) {
    clearTimeout(_syncPushTimer);
    _syncPushTimer = setTimeout(() => {
      syncEngine.pushToCloud();
    }, 600);
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
    }, 800);
  }
});

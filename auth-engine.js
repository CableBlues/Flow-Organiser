// auth-engine.js - Robuste & einfache Authentifizierungs- & Kopplungs-Engine für Flow Organiser
// ============================================================================

const FlowAuth = (function() {
  let supabaseClient = null;
  let currentUser = null;
  let currentSession = null;
  let customSyncToken = null;
  const listeners = [];

  function getConfig() {
    if (typeof FLOW_CONFIG !== 'undefined') {
      return FLOW_CONFIG;
    }
    if (typeof window !== 'undefined' && window.FLOW_CONFIG) {
      return window.FLOW_CONFIG;
    }
    return {
      SUPABASE_URL: 'https://flow-organiser.supabase.co',
      SUPABASE_ANON_KEY: 'dummy_anon_key',
      SYNC_API_URL: 'api-sync.php'
    };
  }

  function getApiUrl(action) {
    const config = getConfig();
    const base = config.SYNC_API_URL || 'api-sync.php';
    return `${base}?action=${encodeURIComponent(action)}`;
  }

  function getSupabaseLib() {
    if (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function') {
      return supabase;
    }
    if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
      return window.supabase;
    }
    if (typeof globalThis !== 'undefined' && globalThis.supabase && typeof globalThis.supabase.createClient === 'function') {
      return globalThis.supabase;
    }
    return null;
  }

  function init() {
    try {
      // 1. Prüfe auf hinterlegten Custom Token (z.B. durch Login oder 6-stellige Kopplung)
      if (typeof localStorage !== 'undefined') {
        const storedToken = localStorage.getItem('flow_sync_token');
        const storedEmail = localStorage.getItem('flow_sync_email');
        if (storedToken) {
          customSyncToken = storedToken;
          currentUser = { id: storedToken, email: storedEmail || 'Angemeldet', isTokenOnly: true };
        }
      }

      // 2. Initialisiere optionalen Supabase Client (falls konfiguriert)
      const supaLib = getSupabaseLib();
      const config = getConfig();

      if (supaLib && config && config.SUPABASE_URL && config.SUPABASE_ANON_KEY && !config.SUPABASE_ANON_KEY.includes('dummy_anon_key')) {
        supabaseClient = supaLib.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });

        // Bestehende Session abfragen & URL Hash prüfen
        supabaseClient.auth.getSession().then(({ data, error }) => {
          if (!error && data && data.session) {
            setSession(data.session);
          }
        }).catch(err => {
          console.warn('[FlowAuth] Could not retrieve Supabase session:', err.message);
        });

        // Listener für Login / Logout Events
        supabaseClient.auth.onAuthStateChange((event, session) => {
          setSession(session);
        });
      }
    } catch (e) {
      console.warn('[FlowAuth] Initialization notice (offline-safe):', e.message);
    }
  }

  function setSession(session) {
    currentSession = session;
    currentUser = session ? session.user : (customSyncToken ? { id: customSyncToken, email: (typeof localStorage !== 'undefined' ? localStorage.getItem('flow_sync_email') : '') || 'Geräte-Kopplung' } : null);
    
    if (session && session.user && typeof localStorage !== 'undefined') {
      localStorage.setItem('flow_sync_token', session.user.id);
      localStorage.setItem('flow_sync_email', session.user.email || '');
    }

    notifyListeners();
    updateAuthUI();
  }

  function subscribe(fn) {
    if (typeof fn === 'function') {
      listeners.push(fn);
    }
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }

  function notifyListeners() {
    listeners.forEach(fn => {
      try {
        fn({ user: currentUser, session: currentSession, token: getSyncToken() });
      } catch (e) {
        console.error('[FlowAuth] Listener error:', e);
      }
    });
  }

  // ==========================================================================
  // 1. ANMELDUNG MIT E-MAIL & PASSWORT / PIN (Autark via api-sync.php)
  // ==========================================================================
  async function signInWithCredentials(email, password) {
    if (!email || !email.trim() || !email.includes('@')) {
      return { success: false, error: 'Bitte gib eine gültige E-Mail-Adresse ein.' };
    }
    if (!password || password.length < 4) {
      return { success: false, error: 'Bitte gib ein Passwort / PIN mit mindestens 4 Zeichen ein.' };
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return { success: false, error: 'Keine Internetverbindung. Bitte stelle eine Verbindung her.' };
    }

    // 1. Wenn Supabase konfiguriert ist, direkt über Supabase Auth anmelden oder registrieren
    if (!supabaseClient) {
      init();
    }

    if (supabaseClient) {
      try {
        let authRes = await supabaseClient.auth.signInWithPassword({
          email: trimmedEmail,
          password: password
        });

        if (authRes.error) {
          const errMsg = authRes.error.message || '';
          
          if (errMsg.toLowerCase().includes('email not confirmed') || errMsg.toLowerCase().includes('email_not_confirmed')) {
            return {
              success: false,
              error: 'E-Mail noch nicht bestätigt. Bitte klicke auf den Bestätigungslink in deiner E-Mail oder deaktiviere "Confirm email" im Supabase Dashboard (Authentication -> Providers -> Email).'
            };
          }

          // Wenn User nicht existiert oder fehlerhafte Anmeldedaten (Auto-Registrierung wie im PHP-Backend)
          if (errMsg.toLowerCase().includes('invalid login credentials') || errMsg.toLowerCase().includes('user not found') || authRes.error.status === 400) {
            const signUpRes = await supabaseClient.auth.signUp({
              email: trimmedEmail,
              password: password
            });

            if (signUpRes.error) {
              const signErr = signUpRes.error.message || '';
              if (signErr.toLowerCase().includes('already registered')) {
                return { success: false, error: 'Passwort falsch. Bitte überprüfe dein Passwort.' };
              }
              return { success: false, error: signErr || 'Registrierung fehlgeschlagen.' };
            }

            if (signUpRes.data && signUpRes.data.user) {
              if (signUpRes.data.session) {
                setSession(signUpRes.data.session);
                return { success: true, email: trimmedEmail, token: signUpRes.data.user.id };
              } else {
                // Bestätigungs-E-Mail erforderlich
                return {
                  success: false,
                  error: 'Konto erstellt! Bitte bestätige die E-Mail von Supabase oder deaktiviere "Confirm email" im Supabase Dashboard.'
                };
              }
            }
          }
          return { success: false, error: authRes.error.message || 'Anmeldung fehlgeschlagen.' };
        }

        if (authRes.data && authRes.data.user) {
          setSession(authRes.data.session || { user: authRes.data.user });
          return { success: true, email: trimmedEmail, token: authRes.data.user.id };
        }
      } catch (err) {
        console.warn('[FlowAuth] Supabase Auth notice:', err);
        return { success: false, error: err.message || getFriendlyNetworkErrorMessage() };
      }
    }

    // 2. Fallback für lokale PHP-Server (z.B. XAMPP)
    try {
      const res = await fetch(getApiUrl('auth_login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: password })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, error: json.error || 'Anmeldung fehlgeschlagen.' };
      }

      setDirectPairingToken(json.token, trimmedEmail);
      return { success: true, email: trimmedEmail, token: json.token };
    } catch (e) {
      return { success: false, error: getFriendlyNetworkErrorMessage() };
    }
  }

  function getFriendlyNetworkErrorMessage() {
    if (typeof window !== 'undefined' && window.location) {
      if (window.location.protocol === 'file:') {
        return 'App über file:// geöffnet (PHP nicht ausführbar). Bitte über http://localhost/QuizProject/Flow-Organiser/ öffnen.';
      }
      if (window.location.hostname.includes('github.io')) {
        return 'GitHub Pages führt kein PHP aus (api-sync.php). Trage Supabase in config.js ein oder hoste mit PHP-Backend.';
      }
    }
    return 'Server nicht erreichbar. Bitte prüfe, ob Apache/PHP läuft oder die Internetverbindung aktiv ist.';
  }

  // ==========================================================================
  // 2. TEMPORÄRER 6-STELLIGER KOPPLUNGSCODE (Gerät A generiert Code)
  // ==========================================================================
  async function createPairingCode() {
    const token = getSyncToken();
    if (!token) {
      return { success: false, error: 'Bitte melde dich zuerst an.' };
    }

    try {
      const res = await fetch(getApiUrl('create_pair_code'), {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, error: json.error || 'Code-Erstellung fehlgeschlagen.' };
      }

      return { success: true, code: json.code, expiresIn: json.expires_in_seconds };
    } catch (e) {
      return { success: false, error: getFriendlyNetworkErrorMessage() };
    }
  }

  // ==========================================================================
  // 3. 6-STELLIGEN KOPPLUNGSCODE EINLÖSEN (Gerät B gibt Code ein)
  // ==========================================================================
  async function confirmPairingCode(code) {
    if (!code || !/^\d{6}$/.test(String(code).trim())) {
      return { success: false, error: 'Bitte gib den 6-stelligen Zahlencode ein.' };
    }

    const cleanCode = String(code).trim();

    try {
      const res = await fetch(getApiUrl('confirm_pair_code'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, error: json.error || 'Kopplungscode ungültig oder abgelaufen.' };
      }

      setDirectPairingToken(json.token, 'Gekoppeltes Gerät');
      return { success: true, token: json.token };
    } catch (e) {
      return { success: false, error: getFriendlyNetworkErrorMessage() };
    }
  }

  // Legacy Magic Link Unterstützung (falls Supabase konfiguriert ist)
  async function signInWithMagicLink(email) {
    if (!email || !email.trim() || !email.includes('@')) {
      return { success: false, error: 'Bitte gib eine gültige E-Mail-Adresse ein.' };
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return { success: false, error: 'Keine Internetverbindung. Bitte später erneut versuchen.' };
    }

    const supaLib = getSupabaseLib();
    if (!supabaseClient && supaLib) {
      init();
    }

    if (supabaseClient) {
      try {
        let redirectUrl = 'https://cableblues.github.io/Flow-Organiser/';
        if (typeof window !== 'undefined' && window.location && window.location.origin) {
          redirectUrl = window.location.origin + window.location.pathname;
        }

        const { data, error } = await supabaseClient.auth.signInWithOtp({
          email: trimmedEmail,
          options: { emailRedirectTo: redirectUrl }
        });

        if (error) {
          return { success: false, error: error.message || 'Fehler beim Senden des Magic Links.' };
        }
        return { success: true, data: data };
      } catch (e) {
        return { success: false, error: e.message || 'Verbindungsfehler beim Anfordern des Magic Links.' };
      }
    }

    // Fallback auf lokales Konto falls kein Supabase konfiguriert ist
    return await signInWithCredentials(trimmedEmail, 'flow_noodle_pass');
  }

  async function signOut() {
    try {
      if (supabaseClient) {
        await supabaseClient.auth.signOut();
      }
    } catch (e) {
      console.warn('[FlowAuth] SignOut error:', e);
    }

    currentSession = null;
    currentUser = null;
    customSyncToken = null;

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('flow_sync_token');
      localStorage.removeItem('flow_sync_email');
      localStorage.removeItem('flow_pending_sync');
    }

    notifyListeners();
    updateAuthUI();
    return { success: true };
  }

  function setDirectPairingToken(token, email = '') {
    if (!token || typeof token !== 'string') return;
    const cleanToken = token.trim();
    customSyncToken = cleanToken;
    currentUser = { id: cleanToken, email: email || 'Gekoppeltes Gerät', isTokenOnly: true };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('flow_sync_token', cleanToken);
      if (email) localStorage.setItem('flow_sync_email', email);
    }

    notifyListeners();
    updateAuthUI();
  }

  function getSyncToken() {
    if (currentUser && currentUser.id) {
      return currentUser.id;
    }
    if (customSyncToken) {
      return customSyncToken;
    }
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('flow_sync_token') || null;
    }
    return null;
  }

  function getUser() {
    return currentUser;
  }

  function getSession() {
    return currentSession;
  }

  function isLoggedIn() {
    return !!getSyncToken();
  }

  function updateAuthUI() {
    if (typeof document === 'undefined') return;

    const loggedIn = isLoggedIn();
    const user = getUser();
    const email = user ? user.email : '';

    // Dezent Anzeige im Header Sync-Button
    const headerSyncBtn = document.getElementById('header-sync-btn') || document.querySelector('button[onclick*="openP2PSyncModal"]');
    if (headerSyncBtn) {
      let badge = headerSyncBtn.querySelector('.sync-auth-indicator');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'sync-auth-indicator absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#0a0a0f] transition-all duration-300';
        headerSyncBtn.appendChild(badge);
      }
      if (loggedIn) {
        badge.className = 'sync-auth-indicator absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0a0f] shadow-[0_0_8px_rgba(52,211,153,0.8)]';
        badge.title = `Eingeloggt als: ${email || 'Verbunden'}`;
      } else {
        badge.className = 'sync-auth-indicator absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gray-500/40 border border-[#0a0a0f]';
        badge.title = 'Nicht angemeldet (nur lokaler Modus)';
      }
    }

    // Modal UI Status
    const loginSection = document.getElementById('sync-auth-logged-out-section');
    const loggedInSection = document.getElementById('sync-auth-logged-in-section');
    const userEmailDisplay = document.getElementById('sync-auth-user-email');

    if (loginSection && loggedInSection) {
      loginSection.classList.toggle('hidden', loggedIn);
      loggedInSection.classList.toggle('hidden', !loggedIn);
      if (userEmailDisplay && email) {
        userEmailDisplay.innerText = email;
      }
    }
  }

  return {
    init,
    signInWithCredentials,
    createPairingCode,
    confirmPairingCode,
    signInWithMagicLink,
    signOut,
    getUser,
    getSession,
    getSyncToken,
    isLoggedIn,
    setDirectPairingToken,
    subscribe,
    updateAuthUI,
    getSupabaseClient: () => supabaseClient,
    _setSupabaseClientForTesting: (mock) => { supabaseClient = mock; }
  };
})();

if (typeof window !== 'undefined') {
  window.FlowAuth = FlowAuth;
  window.addEventListener('DOMContentLoaded', () => {
    FlowAuth.init();
  });
}
if (typeof globalThis !== 'undefined') {
  globalThis.FlowAuth = FlowAuth;
}

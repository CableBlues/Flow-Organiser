// auth-engine.js - Supabase Magic Link Authentication Engine für Flow Organiser
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
      // 1. Prüfe auf hinterlegten Custom Token (z.B. durch QR-Code Kopplung)
      if (typeof localStorage !== 'undefined') {
        const storedToken = localStorage.getItem('flow_sync_token');
        const storedEmail = localStorage.getItem('flow_sync_email');
        if (storedToken) {
          customSyncToken = storedToken;
          if (storedEmail && !currentUser) {
            currentUser = { id: storedToken, email: storedEmail, isTokenOnly: true };
          }
        }
      }

      // 2. Initialisiere Supabase Client
      const supaLib = getSupabaseLib();
      const config = getConfig();

      if (supaLib && config && config.SUPABASE_URL && config.SUPABASE_ANON_KEY) {
        supabaseClient = supaLib.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });

        // 3. Bestehende Session abfragen & URL Hash prüfen
        supabaseClient.auth.getSession().then(({ data, error }) => {
          if (!error && data && data.session) {
            setSession(data.session);
          }
        }).catch(err => {
          console.warn('[FlowAuth] Could not retrieve session (offline or unconfigured):', err.message);
        });

        // 4. Listener für Login / Logout Events
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
    currentUser = session ? session.user : (customSyncToken ? { id: customSyncToken, email: localStorage.getItem('flow_sync_email') || 'Geräte-Kopplung' } : null);
    
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

  async function signInWithMagicLink(email) {
    if (!email || !email.trim() || !email.includes('@')) {
      return { success: false, error: 'Bitte gib eine gültige E-Mail-Adresse ein.' };
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Offline-Prüfung
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return { success: false, error: 'Keine Internetverbindung. Bitte später erneut versuchen.' };
    }

    const supaLib = getSupabaseLib();
    if (!supabaseClient && supaLib) {
      init();
    }

    if (!supabaseClient) {
      return { success: false, error: 'Supabase Authentifizierungs-Dienst ist offline oder nicht konfiguriert.' };
    }

    try {
      let redirectUrl = 'https://cableblues.github.io/Flow-Organiser/';
      if (typeof window !== 'undefined' && window.location && window.location.origin) {
        redirectUrl = window.location.origin + window.location.pathname;
      }

      const { data, error } = await supabaseClient.auth.signInWithOtp({
        email: trimmedEmail,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        return { success: false, error: error.message || 'Fehler beim Senden des Magic Links.' };
      }

      return { success: true, data: data };
    } catch (e) {
      return { success: false, error: e.message || 'Verbindungsfehler beim Anfordern des Magic Links.' };
    }
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
    signInWithMagicLink,
    signOut,
    getUser,
    getSession,
    getSyncToken,
    isLoggedIn,
    setDirectPairingToken,
    subscribe,
    updateAuthUI,
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

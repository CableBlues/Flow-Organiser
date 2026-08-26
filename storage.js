// storage.js: Zentrale, robuste Storage-Abstraktion mit JSON-Safeguards und Logging
const AppStorage = {
  get(key, defaultValue = null) {
    try {
      const val = localStorage.getItem(key);
      if (val === null || val === undefined) return defaultValue;
      return JSON.parse(val);
    } catch (e) {
      console.warn(`[AppStorage] Fehler beim Lesen von '${key}':`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`[AppStorage] Fehler beim Schreiben von '${key}':`, e);
      return false;
    }
  },

  getString(key, defaultValue = '') {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? val : defaultValue;
    } catch (e) {
      console.warn(`[AppStorage] Fehler beim Lesen des Strings '${key}':`, e);
      return defaultValue;
    }
  },

  setString(key, value) {
    try {
      localStorage.setItem(key, String(value));
      return true;
    } catch (e) {
      console.error(`[AppStorage] Fehler beim Schreiben des Strings '${key}':`, e);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`[AppStorage] Fehler beim Löschen von '${key}':`, e);
      return false;
    }
  }
};

// ===== GLOBALER CRASH-HANDLER & PRODUCTION ERROR BOUNDARY =====
window.addEventListener('error', (event) => {
  console.error('[Flow Global Error Boundary]:', event.error || event.message);
  const appContainer = document.getElementById('app');
  if (appContainer && appContainer.innerHTML.trim() === '') {
    showCrashRecoveryScreen(event.message);
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.warn('[Flow Unhandled Promise Rejection]:', event.reason);
});

function showCrashRecoveryScreen(errorMsg = '') {
  let overlay = document.getElementById('flow-crash-recovery-overlay');
  if (overlay) return;
  overlay = document.createElement('div');
  overlay.id = 'flow-crash-recovery-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:#0d0d14;color:#fff;z-index:999999;display:flex;align-items:center;justify-content:center;padding:24px;font-family:sans-serif;text-align:center;';
  overlay.innerHTML = `
    <div style="max-width:440px;background:#151522;border:1px solid rgba(168,85,247,0.3);padding:32px;border-radius:24px;box-shadow:0 20px 40px rgba(0,0,0,0.8);">
      <div style="font-size:3rem;margin-bottom:12px;">🌊</div>
      <h2 style="font-size:1.3rem;font-weight:bold;margin-bottom:8px;">Flow sicher neu starten</h2>
      <p style="font-size:0.85rem;color:#a1a1aa;margin-bottom:20px;line-height:1.5;">Ein Browser-Skript hat sich kurz verschluckt. Deine Aufgaben und Daten sind sicher gespeichert.</p>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <button onclick="window.location.reload()" style="padding:12px 20px;background:linear-gradient(135deg,#06b6d4,#10b981);color:#000;border:none;border-radius:12px;font-weight:bold;cursor:pointer;font-size:0.9rem;">App neu laden 🔄</button>
        <button onclick="window.location.reload(true)" style="padding:10px 16px;background:rgba(255,255,255,0.06);color:#ccc;border:1px solid rgba(255,255,255,0.12);border-radius:12px;cursor:pointer;font-size:0.8rem;">Sicherer Neustart 🛡️</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

if (typeof window !== 'undefined') {
  window.AppStorage = AppStorage;
  window.showCrashRecoveryScreen = showCrashRecoveryScreen;
}
if (typeof globalThis !== 'undefined') {
  globalThis.AppStorage = AppStorage;
  globalThis.showCrashRecoveryScreen = showCrashRecoveryScreen;
}

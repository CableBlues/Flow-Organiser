/**
 * updater-client.js - Automatischer Update-Checker für die Noodle Desktop-App
 * ============================================================================
 * Nutzt das kostenlose @tauri-apps/plugin-updater & GitHub Releases.
 * Funktioniert ausschließlich in der nativen Tauri Desktop-App.
 * ============================================================================
 */

async function checkForAppUpdate(promptUser = false) {
  if (typeof window === 'undefined' || !window.__TAURI__) {
    // Läuft im regulären Web-Browser / PWA -> kein Desktop-Updater nötig
    return;
  }

  try {
    const { check } = await import('@tauri-apps/plugin-updater');
    const { relaunch } = await import('@tauri-apps/plugin-process');

    console.log('🔍 [Tauri Updater] Suche nach Updates via GitHub Releases...');
    const update = await check();

    if (update && update.available) {
      console.log(`✨ [Tauri Updater] Neues Update gefunden: Version ${update.version}`);
      
      const shouldUpdate = promptUser 
        ? confirm(`Ein neues Noodle-Update (Version ${update.version}) ist verfügbar. Jetzt aktualisieren?`) 
        : true;

      if (shouldUpdate) {
        if (typeof showToast === 'function') {
          showToast(`Lade Noodle Update ${update.version} herunter... 🚀`);
        }
        await update.downloadAndInstall();
        if (typeof showToast === 'function') {
          showToast('Update bereit! App wird neu gestartet...');
        }
        await relaunch();
      }
    } else {
      console.log('✓ [Tauri Updater] App ist auf dem neuesten Stand.');
      if (promptUser && typeof showToast === 'function') {
        showToast('Noodle ist bereits auf der neuesten Version! ✨');
      }
    }
  } catch (error) {
    console.warn('[Tauri Updater] Update-Prüfung nicht verfügbar oder offline:', error);
  }
}

if (typeof window !== 'undefined') {
  window.checkForAppUpdate = checkForAppUpdate;
}

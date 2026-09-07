/**
 * ============================================================================
 * Noodle - Monetarisierungs- & Abo-Struktur (monetization.js)
 * ============================================================================
 * HINWEIS ZUM LAUNCH-STATUS:
 * Dieses Modul bereitet die Strukturen für spätere Pro-Funktionen und Upgrades
 * vor. Zum Launch ist FLOW_CONFIG.MONETIZATION_ENABLED = false und ADS_ENABLED = false.
 * 
 * Es wird KEIN Werbe- oder Zahlungs-SDK geladen und KEIN Checkout ausgelöst.
 * Klicks auf "Pro"-Teaser rufen ausschließlich handleUpgradeClick() auf,
 * welche einen freundlichen "Bald verfügbar"-Toast anzeigt.
 * ============================================================================
 */

function handleUpgradeClick(featureName) {
  const cfg = (typeof FLOW_CONFIG !== 'undefined') ? FLOW_CONFIG : (typeof DEFAULT_CONFIG !== 'undefined' ? DEFAULT_CONFIG : {});
  
  if (!cfg.MONETIZATION_ENABLED) {
    if (typeof showToast === 'function') {
      showToast(typeof tr === 'function' ? tr({
        de: '✨ Pro-Funktionen sind bald verfügbar.',
        en: '✨ Pro features coming soon.',
        fr: '✨ Les fonctionnalités Pro arrivent bientôt.',
        it: '✨ Le funzionalità Pro saranno presto disponibili.',
        es: '✨ Las funciones Pro estarán disponibles pronto.',
        el: '✨ Οι λειτουργίες Pro θα είναι σύντομα διαθέσιμες.'
      }) : 'Pro-Funktionen sind bald verfügbar.');
    }
    return;
  }

  // TODO (erst nach rechtlicher Freigabe implementieren):
  // Hier folgt später die echte Checkout-Weiterleitung
  // (z. B. Stripe Checkout Session oder Paddle Checkout öffnen)
  console.info('[Monetization] Checkout requested for:', featureName || 'pro_plan');
}

/**
 * Prüft den aktuellen Plan-Status des Nutzers ('free' | 'pro')
 */
function isProUser() {
  const s = (typeof window !== 'undefined' && window.state) ? window.state : (typeof state !== 'undefined' ? state : null);
  return Boolean(s && s.userPlan === 'pro');
}

/**
 * Gibt den aktuellen Plan-Namen zurück
 */
function getUserPlan() {
  const s = (typeof window !== 'undefined' && window.state) ? window.state : (typeof state !== 'undefined' ? state : null);
  return (s && s.userPlan) ? s.userPlan : 'free';
}

if (typeof window !== 'undefined') {
  window.handleUpgradeClick = handleUpgradeClick;
  window.isProUser = isProUser;
  window.getUserPlan = getUserPlan;
}

if (typeof globalThis !== 'undefined') {
  globalThis.handleUpgradeClick = handleUpgradeClick;
  globalThis.isProUser = isProUser;
  globalThis.getUserPlan = getUserPlan;
}

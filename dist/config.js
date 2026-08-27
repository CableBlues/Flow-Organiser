// config.js - Zentrale Konfiguration für Flow Organiser (Supabase & Sync API)
// ============================================================================

(function() {
  const DEFAULT_CONFIG = {
    // Supabase Projekt-Konfiguration (vom Admin / Host anpassbar oder via Env/Storage überschreibbar)
    SUPABASE_URL: (typeof window !== 'undefined' && window.__FLOW_SUPABASE_URL) || 'https://flow-organiser.supabase.co',
    SUPABASE_ANON_KEY: (typeof window !== 'undefined' && window.__FLOW_SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_flow_organiser',
    
    // Lokaler / Webserver Relay-Endpunkt
    SYNC_API_URL: 'api-sync.php',
    
    // Auto-Sync Intervall (ms)
    AUTO_SYNC_INTERVAL_MS: 30000
  };

  // Erlaube optionales lokales Überschreiben für Entwickler / Self-Host-Instanzen
  try {
    if (typeof localStorage !== 'undefined') {
      const storedConfig = localStorage.getItem('flow_custom_config');
      if (storedConfig) {
        const parsed = JSON.parse(storedConfig);
        if (parsed && typeof parsed === 'object') {
          Object.assign(DEFAULT_CONFIG, parsed);
        }
      }
    }
  } catch (e) {
    // Ignorieren falls localStorage gesperrt oder ungültig
  }

  if (typeof window !== 'undefined') {
    window.FLOW_CONFIG = DEFAULT_CONFIG;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.FLOW_CONFIG = DEFAULT_CONFIG;
  }
})();

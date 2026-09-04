import { describe, it, expect, beforeEach, vi } from 'vitest';

// 1. Data, Tasks & State Setup
import '../data-tasks.js';
import '../data-translations-1.js';
import '../data-translations-2.js';
import '../data-translations.js';
import '../config.js';
import '../auth-engine.js';
import '../storage.js';
import '../state.js';
import '../sync-engine.js';

describe('Vollständige & Zuverlässige Synchronisation (Multi-Device & Offline)', () => {
  let serverDatabase = {};
  let pairCodes = {};

  beforeEach(async () => {
    localStorage.clear();
    await FlowAuth.signOut();
    serverDatabase = {};
    pairCodes = {};
    vi.restoreAllMocks();

    globalThis.fetch = vi.fn(async (url, options = {}) => {
      const parsedUrl = new URL(url, 'http://localhost/Flow-Organiser/');
      const action = parsedUrl.searchParams.get('action');
      const authHeader = options.headers?.['Authorization'] || '';
      const token = authHeader.replace(/^Bearer\s+/i, '');

      // 1. Auth: Login & Register
      if (action === 'auth_login' || action === 'auth') {
        const body = JSON.parse(options.body || '{}');
        const email = body.email;
        const password = body.password;
        if (!email || !email.includes('@')) {
          return { ok: false, status: 400, json: async () => ({ success: false, error: 'Ungültige E-Mail' }) };
        }
        const userToken = `token_for_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
        return {
          ok: true,
          status: 200,
          json: async () => ({ success: true, email, token: userToken })
        };
      }

      // 2. Create Pair Code
      if (action === 'create_pair_code') {
        if (!token) return { ok: false, status: 401, json: async () => ({ success: false, error: 'Unauthorized' }) };
        const code = '849201';
        pairCodes[code] = { token, expiresAt: Date.now() + 600000 };
        return {
          ok: true,
          status: 200,
          json: async () => ({ success: true, code, expires_in_seconds: 600 })
        };
      }

      // 3. Confirm Pair Code
      if (action === 'confirm_pair_code') {
        const body = JSON.parse(options.body || '{}');
        const code = body.code;
        if (pairCodes[code]) {
          const t = pairCodes[code].token;
          delete pairCodes[code];
          return {
            ok: true,
            status: 200,
            json: async () => ({ success: true, token: t })
          };
        }
        return { ok: false, status: 404, json: async () => ({ success: false, error: 'Code ungültig' }) };
      }

      // 4. Push State
      if (action === 'push') {
        if (!token) return { ok: false, status: 401, json: async () => ({ success: false, error: 'Unauthorized' }) };
        const body = JSON.parse(options.body || '{}');
        serverDatabase[token] = {
          data: body.data,
          updated_at: new Date().toISOString()
        };
        return {
          ok: true,
          status: 200,
          json: async () => ({ success: true, time: serverDatabase[token].updated_at })
        };
      }

      // 5. Pull State
      if (action === 'pull') {
        if (!token) return { ok: false, status: 401, json: async () => ({ success: false, error: 'Unauthorized' }) };
        if (!serverDatabase[token]) {
          return { ok: false, status: 404, json: async () => ({ success: false, error: 'No state' }) };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            data: serverDatabase[token].data,
            updated_at: serverDatabase[token].updated_at
          })
        };
      }

      return { ok: false, status: 400, json: async () => ({ success: false, error: 'Unknown action' }) };
    });
  });

  describe('1. Authentifizierung & 6-stellige Gerätekopplung', () => {
    it('erlaubt unkomplizierte Anmeldung mit E-Mail und Passwort', async () => {
      const res = await FlowAuth.signInWithCredentials('max@mustermann.de', 'meinpasswort');
      expect(res.success).toBe(true);
      expect(FlowAuth.isLoggedIn()).toBe(true);
      expect(FlowAuth.getSyncToken()).toBe('token_for_max_mustermann_de');
      expect(FlowAuth.getUser().email).toBe('max@mustermann.de');
    });

    it('ermöglicht 1-Schritt-Gerätekopplung mit 6-stelligem Code zwischen Gerät A und B', async () => {
      // Gerät A meldet sich an
      await FlowAuth.signInWithCredentials('anna@test.de', 'geheim123');
      const pairRes = await FlowAuth.createPairingCode();
      expect(pairRes.success).toBe(true);
      expect(pairRes.code).toBe('849201');

      // Gerät B meldet sich ab und löst den Code ein
      await FlowAuth.signOut();
      expect(FlowAuth.isLoggedIn()).toBe(false);

      const confirmRes = await FlowAuth.confirmPairingCode('849201');
      expect(confirmRes.success).toBe(true);
      expect(FlowAuth.isLoggedIn()).toBe(true);
      expect(FlowAuth.getSyncToken()).toBe('token_for_anna_test_de');
    });

    it('signOut setzt den Auth-Status vollständig zurück', async () => {
      FlowAuth.setDirectPairingToken('custom_token', 'user@test.de');
      expect(FlowAuth.isLoggedIn()).toBe(true);

      await FlowAuth.signOut();
      expect(FlowAuth.isLoggedIn()).toBe(false);
      expect(FlowAuth.getSyncToken()).toBeNull();
    });
  });

  describe('2. A → Server → B und B → Server → A Synchronisation', () => {
    it('überträgt alle Datenbereiche zuverlässig von Gerät A zu Gerät B', async () => {
      // 1. Gerät A initialisieren und Aufgaben anlegen
      await FlowAuth.signInWithCredentials('team@flow.de', 'pass123');
      window.state = {
        items: { daily: ['E-Mails beantworten', 'Projektplan erstellen'] },
        done: [{ task: 'Frühstücken', time: '08:00' }],
        notes: [{ id: 'n1', text: 'Wichtige Notiz für heute' }],
        termine: [{ id: 't1', title: 'Meeting 14 Uhr', date: '2026-09-04' }],
        shoppingList: [{ name: 'Hafermilch', checked: false }],
        pantry: [{ id: 'p1', name: 'Reis' }],
        brainstormIdeas: [{ id: 'b1', text: 'Neue App-Idee', tag: 'idea' }],
        activeWorkspace: 'private'
      };

      const pushRes = await cloudSyncEngine.pushState();
      expect(pushRes.success).toBe(true);

      // 2. Gerät B startet mit leerem Zustand und zieht die Daten
      window.state = { items: {}, done: [], notes: [], termine: [], shoppingList: [], brainstormIdeas: [], pantry: [] };
      const pullRes = await cloudSyncEngine.pullState();
      expect(pullRes.success).toBe(true);

      expect(window.state.items.daily).toEqual(['E-Mails beantworten', 'Projektplan erstellen']);
      expect(window.state.done).toHaveLength(1);
      expect(window.state.notes[0].text).toBe('Wichtige Notiz für heute');
      expect(window.state.termine[0].title).toBe('Meeting 14 Uhr');
      expect(window.state.shoppingList[0].name).toBe('Hafermilch');
      expect(window.state.brainstormIdeas[0].text).toBe('Neue App-Idee');
    });

    it('überträgt Änderungen von Gerät B zurück zu Gerät A', async () => {
      await FlowAuth.signInWithCredentials('team@flow.de', 'pass123');
      
      // Gerät B hakt eine Aufgabe ab und fügt einen neuen Termin hinzu
      window.state = {
        items: { daily: ['E-Mails beantworten'] },
        done: [{ task: 'Projektplan erstellen', time: '11:30' }],
        termine: [{ id: 't2', title: 'Zahnarzt', date: '2026-09-10' }]
      };
      await cloudSyncEngine.pushState();

      // Gerät A synchronisiert
      window.state = {
        items: { daily: ['E-Mails beantworten'] },
        done: [],
        termine: []
      };
      await cloudSyncEngine.pullState();

      expect(window.state.done).toHaveLength(1);
      expect(window.state.done[0].task).toBe('Projektplan erstellen');
      expect(window.state.termine[0].title).toBe('Zahnarzt');
    });
  });

  describe('3. Offline → Online & Auto-Retry', () => {
    it('behält Offline-Änderungen in der Warteschlange und synchronisiert sie bei Wiederverbindung', async () => {
      await FlowAuth.signInWithCredentials('offline.user@flow.de', 'securepass');

      // Offline schalten
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);

      window.state = {
        items: { daily: ['Offline erstellte Aufgabe'] },
        done: []
      };

      cloudSyncEngine.triggerAutoPush();
      expect(cloudSyncEngine.isPendingSync()).toBe(true);

      const pushRes = await cloudSyncEngine.pushState();
      expect(pushRes.offline).toBe(true);
      expect(cloudSyncEngine.isPendingSync()).toBe(true);

      // Wieder online gehen
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
      const onlinePushRes = await cloudSyncEngine.pushState();
      expect(onlinePushRes.success).toBe(true);
      expect(cloudSyncEngine.isPendingSync()).toBe(false);
    });

    it('führt automatischen Retry bei temporärem Netzwerkfehler durch', async () => {
      await FlowAuth.signInWithCredentials('retry.user@flow.de', 'securepass');
      window.state = { items: { daily: ['Retry Task'] } };

      // 1. Aufruf schlägt mit Server-Fehler 500 fehl
      globalThis.fetch = vi.fn().mockRejectedValueOnce(new Error('Network disconnected'));

      const failedRes = await cloudSyncEngine.pushState();
      expect(failedRes.success).toBe(false);
      expect(cloudSyncEngine.isPendingSync()).toBe(true);
      expect(cloudSyncEngine.retryCount).toBe(1);
      expect(cloudSyncEngine.retryTimer).not.toBeNull();
    });
  });

  describe('4. Konfliktfreie Zusammenführung (Non-Destructive Merge)', () => {
    it('vereinigt gleichzeitige Änderungen von Gerät A und Gerät B ohne Datenverlust', () => {
      const localState = {
        items: { daily: ['Aufgabe von Gerät A'] },
        notes: [{ id: 'n_a', text: 'Notiz von Gerät A' }],
        shoppingList: [{ name: 'Brot' }]
      };

      const remoteData = {
        items: { daily: ['Aufgabe von Gerät B'] },
        notes: [{ id: 'n_b', text: 'Notiz von Gerät B' }],
        shoppingList: [{ name: 'Kaffee' }]
      };

      const changed = cloudSyncEngine.mergeState(localState, remoteData);
      expect(changed).toBe(true);

      // Beide Aufgaben müssen vorhanden sein
      expect(localState.items.daily).toContain('Aufgabe von Gerät A');
      expect(localState.items.daily).toContain('Aufgabe von Gerät B');

      // Beide Notizen müssen vorhanden sein
      expect(localState.notes.map(n => n.text)).toEqual(expect.arrayContaining(['Notiz von Gerät A', 'Notiz von Gerät B']));

      // Beide Einkaufs-Items müssen vorhanden sein
      expect(localState.shoppingList.map(s => s.name)).toEqual(expect.arrayContaining(['Brot', 'Kaffee']));
    });
  });

  describe('5. Lokaler Modus ohne Anmeldung', () => {
    it('funktioniert 100% lokal ohne Fehler wenn nicht angemeldet', () => {
      expect(FlowAuth.isLoggedIn()).toBe(false);

      window.state = {
        items: { daily: ['Lokaler Task 1', 'Lokaler Task 2'] },
        done: []
      };

      expect(() => saveState()).not.toThrow();
      const stored = JSON.parse(localStorage.getItem('flowPlannerV3'));
      expect(stored.items.daily).toEqual(['Lokaler Task 1', 'Lokaler Task 2']);
    });
  });
});

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

    it('Test J: Neues Gerät koppeln per 6-stelligem Code (A generiert Code -> B gibt Code ein -> B hat vollen Zugriff)', async () => {
      // 1. Gerät A meldet sich an und generiert einen 6-stelligen Code
      await FlowAuth.signInWithCredentials('anna@test.de', 'geheim123');
      const pairRes = await FlowAuth.createPairingCode();
      expect(pairRes.success).toBe(true);
      expect(pairRes.code).toBe('849201');

      // 2. Gerät B meldet sich ab und löst den 6-stelligen Code ein
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

  describe('2. Bidirektionale Synchronisation (Test A & Test B)', () => {
    it('Test A: Gerät A → Server → Gerät B (Neue Aufgabe auf A erstellen, danach Sync, auf B pullen -> exakt vorhanden)', async () => {
      // 1. Gerät A initialisieren und Aufgaben anlegen
      await FlowAuth.signInWithCredentials('team@flow.de', 'pass123');
      window.state = {
        _tombstones: {},
        items: {
          daily: [
            { id: 't_daily_1', task: 'E-Mails beantworten', createdAt: '2026-09-04T10:00:00Z', updatedAt: '2026-09-04T10:00:00Z' },
            { id: 't_daily_2', task: 'Projektplan erstellen', createdAt: '2026-09-04T10:05:00Z', updatedAt: '2026-09-04T10:05:00Z' }
          ]
        },
        done: [{ id: 'd_1', task: 'Frühstücken', time: '08:00', createdAt: '2026-09-04T08:00:00Z', updatedAt: '2026-09-04T08:00:00Z' }],
        notes: [{ id: 'n1', text: 'Wichtige Notiz für heute', createdAt: '2026-09-04T10:00:00Z', updatedAt: '2026-09-04T10:00:00Z' }],
        termine: [{ id: 't1', title: 'Meeting 14 Uhr', date: '2026-09-04', createdAt: '2026-09-04T10:00:00Z', updatedAt: '2026-09-04T10:00:00Z' }],
        shoppingList: [{ id: 's1', name: 'Hafermilch', checked: false, createdAt: '2026-09-04T10:00:00Z', updatedAt: '2026-09-04T10:00:00Z' }],
        pantry: [{ id: 'p1', name: 'Reis', createdAt: '2026-09-04T10:00:00Z', updatedAt: '2026-09-04T10:00:00Z' }],
        brainstormIdeas: [{ id: 'b1', text: 'Neue App-Idee', tag: 'idea', createdAt: '2026-09-04T10:00:00Z', updatedAt: '2026-09-04T10:00:00Z' }],
        activeWorkspace: 'private'
      };

      const pushRes = await cloudSyncEngine.pushState();
      expect(pushRes.success).toBe(true);

      // 2. Gerät B startet mit leerem Zustand und zieht die Daten
      window.state = { _tombstones: {}, items: {}, done: [], notes: [], termine: [], shoppingList: [], brainstormIdeas: [], pantry: [] };
      const pullRes = await cloudSyncEngine.pullState();
      expect(pullRes.success).toBe(true);

      expect(window.state.items.daily.map(t => (typeof t === 'object' ? t.task : t))).toEqual(['E-Mails beantworten', 'Projektplan erstellen']);
      expect(window.state.done).toHaveLength(1);
      expect(window.state.notes[0].text).toBe('Wichtige Notiz für heute');
      expect(window.state.termine[0].title).toBe('Meeting 14 Uhr');
      expect(window.state.shoppingList[0].name).toBe('Hafermilch');
      expect(window.state.brainstormIdeas[0].text).toBe('Neue App-Idee');
    });

    it('Test B: Gerät B → Server → Gerät A (Auf B Aufgabe abhaken/ändern -> auf A sofort sichtbar)', async () => {
      await FlowAuth.signInWithCredentials('team@flow.de', 'pass123');
      
      // Gerät B hakt eine Aufgabe ab und fügt einen neuen Termin hinzu
      window.state = {
        _tombstones: {},
        items: { daily: [{ id: 't_daily_1', task: 'E-Mails beantworten', updatedAt: '2026-09-04T10:00:00Z' }] },
        done: [{ id: 'd_2', task: 'Projektplan erstellen', time: '11:30', updatedAt: '2026-09-04T11:30:00Z' }],
        termine: [{ id: 't2', title: 'Zahnarzt', date: '2026-09-10', updatedAt: '2026-09-04T11:30:00Z' }]
      };
      await cloudSyncEngine.pushState();

      // Gerät A synchronisiert
      window.state = {
        _tombstones: {},
        items: { daily: [{ id: 't_daily_1', task: 'E-Mails beantworten', updatedAt: '2026-09-04T10:00:00Z' }] },
        done: [],
        termine: []
      };
      await cloudSyncEngine.pullState();

      expect(window.state.done).toHaveLength(1);
      expect(window.state.done[0].task).toBe('Projektplan erstellen');
      expect(window.state.termine[0].title).toBe('Zahnarzt');
    });
  });

  describe('3. Änderungen & Löschungen mit Tombstones (Test C, Test D, Test G)', () => {
    it('Test C: Bearbeitung (A ändert Text von Aufgabe X -> B empfängt exakte Änderung)', () => {
      const localState = {
        _tombstones: {},
        items: {
          daily: [
            { id: 'task_100', task: 'Milch kaufen (alt)', createdAt: '2026-09-04T10:00:00Z', updatedAt: '2026-09-04T10:00:00Z' }
          ]
        }
      };

      const remoteData = {
        _tombstones: {},
        items: {
          daily: [
            { id: 'task_100', task: 'Hafermilch kaufen (neu)', createdAt: '2026-09-04T10:00:00Z', updatedAt: '2026-09-04T10:30:00Z' }
          ]
        }
      };

      const changed = cloudSyncEngine.mergeState(localState, remoteData);
      expect(changed).toBe(true);
      expect(localState.items.daily).toHaveLength(1);
      expect(localState.items.daily[0].task).toBe('Hafermilch kaufen (neu)');
      expect(localState.items.daily[0].id).toBe('task_100');
    });

    it('Test D: Löschen (A löscht Aufgabe Y -> auf B gelöscht und taucht NIE wieder auf dank Tombstone)', () => {
      // Gerät A hat task_200 gelöscht und in _tombstones vermerkt
      const remoteData = {
        _tombstones: {
          'task_200': '2026-09-04T12:00:00Z'
        },
        items: {
          daily: [
            { id: 'task_201', task: 'Verbleibende Aufgabe', createdAt: '2026-09-04T10:00:00Z', updatedAt: '2026-09-04T10:00:00Z' }
          ]
        }
      };

      // Gerät B hat task_200 noch lokal
      const localState = {
        _tombstones: {},
        items: {
          daily: [
            { id: 'task_200', task: 'Zu löschende Aufgabe', createdAt: '2026-09-04T09:00:00Z', updatedAt: '2026-09-04T09:00:00Z' },
            { id: 'task_201', task: 'Verbleibende Aufgabe', createdAt: '2026-09-04T10:00:00Z', updatedAt: '2026-09-04T10:00:00Z' }
          ]
        }
      };

      const changed = cloudSyncEngine.mergeState(localState, remoteData);
      expect(changed).toBe(true);
      expect(localState.items.daily).toHaveLength(1);
      expect(localState.items.daily[0].id).toBe('task_201');
      expect(localState._tombstones['task_200']).toBe('2026-09-04T12:00:00Z');

      // Erneuter Sync / Re-merge reanimiert die gelöschte Aufgabe nicht
      const secondMerge = cloudSyncEngine.mergeState(localState, remoteData);
      expect(localState.items.daily).toHaveLength(1);
      expect(localState.items.daily[0].id).toBe('task_201');
    });

    it('Test G: Gleichzeitige Bearbeitung (A ändert X um 14:15, B ändert X um 14:30 -> 14:30 gewinnt deterministisch via LWW)', () => {
      // Gerät A hat Version um 14:15 Uhr gespeichert
      const localState = {
        _tombstones: {},
        items: {
          daily: [
            { id: 'task_shared', task: 'Version A (14:15)', createdAt: '2026-09-04T10:00:00Z', updatedAt: '2026-09-04T14:15:00Z' }
          ]
        }
      };

      // Gerät B hat Version um 14:30 Uhr gespeichert (neuer!)
      const remoteData = {
        _tombstones: {},
        items: {
          daily: [
            { id: 'task_shared', task: 'Version B (14:30 - gewinnt)', createdAt: '2026-09-04T10:00:00Z', updatedAt: '2026-09-04T14:30:00Z' }
          ]
        }
      };

      const changed = cloudSyncEngine.mergeState(localState, remoteData);
      expect(changed).toBe(true);
      expect(localState.items.daily[0].task).toBe('Version B (14:30 - gewinnt)');
    });
  });

  describe('4. Gleichzeitige unabhängige Änderungen (Test F: Zero Data Loss)', () => {
    it('Test F: Gleichzeitige unabhängige Erstellung (A erstellt X, B erstellt Y -> beide behalten X und Y, Zero Data Loss)', () => {
      const localState = {
        _tombstones: {},
        items: { daily: [{ id: 'task_a1', task: 'Aufgabe von Gerät A', createdAt: '2026-09-04T14:00:00Z', updatedAt: '2026-09-04T14:00:00Z' }] },
        notes: [{ id: 'note_a1', text: 'Notiz A', createdAt: '2026-09-04T14:00:00Z', updatedAt: '2026-09-04T14:00:00Z' }],
        shoppingList: [{ id: 'shop_a1', name: 'Brot', createdAt: '2026-09-04T14:00:00Z', updatedAt: '2026-09-04T14:00:00Z' }]
      };

      const remoteData = {
        _tombstones: {},
        items: { daily: [{ id: 'task_b1', task: 'Aufgabe von Gerät B', createdAt: '2026-09-04T14:05:00Z', updatedAt: '2026-09-04T14:05:00Z' }] },
        notes: [{ id: 'note_b1', text: 'Notiz B', createdAt: '2026-09-04T14:05:00Z', updatedAt: '2026-09-04T14:05:00Z' }],
        shoppingList: [{ id: 'shop_b1', name: 'Kaffee', createdAt: '2026-09-04T14:05:00Z', updatedAt: '2026-09-04T14:05:00Z' }]
      };

      const changed = cloudSyncEngine.mergeState(localState, remoteData);
      expect(changed).toBe(true);

      // Beide Aufgaben sind da
      const dailyTasks = localState.items.daily.map(t => (typeof t === 'object' ? t.task : t));
      expect(dailyTasks).toContain('Aufgabe von Gerät A');
      expect(dailyTasks).toContain('Aufgabe von Gerät B');

      // Beide Notizen sind da
      const notes = localState.notes.map(n => n.text);
      expect(notes).toContain('Notiz A');
      expect(notes).toContain('Notiz B');

      // Beide Shopping-Items sind da
      const shopping = localState.shoppingList.map(s => s.name);
      expect(shopping).toContain('Brot');
      expect(shopping).toContain('Kaffee');
    });
  });

  describe('5. Offline-Queue & Auto-Retry (Test E & Test I)', () => {
    it('Test E: Offline-Queue (Offline auf A Aufgaben erstellen, online gehen -> automatisch synchronisiert)', async () => {
      await FlowAuth.signInWithCredentials('offline.user@flow.de', 'securepass');

      // Offline schalten
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);

      window.state = {
        _tombstones: {},
        items: { daily: [{ id: 't_off', task: 'Offline erstellte Aufgabe', createdAt: '2026-09-04T15:00:00Z', updatedAt: '2026-09-04T15:00:00Z' }] },
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

    it('Test I: Netzwerkfehler & Backoff Retry (Server antwortet mit Fehler -> retryTimer und flow_pending_sync aktiv)', async () => {
      await FlowAuth.signInWithCredentials('retry.user@flow.de', 'securepass');
      window.state = { _tombstones: {}, items: { daily: [{ id: 't_retry', task: 'Retry Task' }] } };

      // 1. Aufruf schlägt mit Server-Fehler / Verbindungsabbruch fehl
      globalThis.fetch = vi.fn().mockRejectedValueOnce(new Error('Network disconnected'));

      const failedRes = await cloudSyncEngine.pushState();
      expect(failedRes.success).toBe(false);
      expect(cloudSyncEngine.isPendingSync()).toBe(true);
      expect(cloudSyncEngine.retryCount).toBe(1);
      expect(cloudSyncEngine.retryTimer).not.toBeNull();
    });
  });

  describe('6. Persistenz & Lokaler Modus (Test H)', () => {
    it('Test H: App schließen während Sync / Re-Open (State bleibt persistent in LocalStorage und synct beim nächsten Start)', () => {
      window.state = {
        _tombstones: { 'old_tomb': '2026-09-01T00:00:00Z' },
        items: { daily: [{ id: 'reopen_task', task: 'Persistente Aufgabe vor Schließen' }] },
        done: []
      };

      // Speichern wie vor Schließen der App
      saveState();

      // Simulation App-Neustart: State wird aus LocalStorage geladen
      const loadedRaw = JSON.parse(localStorage.getItem('flowPlannerV3'));
      const restoredState = migrateState(loadedRaw, 'de');

      expect(restoredState.items.daily[0].task).toBe('Persistente Aufgabe vor Schließen');
      expect(restoredState._tombstones['old_tomb']).toBe('2026-09-01T00:00:00Z');
    });

    it('migriert ältere String-Aufgaben automatisch zu Objekten mit stabiler ID und Zeitstempel bei Serialisierung/Sync', () => {
      const oldRaw = {
        version: 3,
        items: {
          daily: ['Alte String Aufgabe 1', 'Alte String Aufgabe 2'],
          todo: ['Altes Todo']
        },
        done: [{ task: 'Erledigt' }]
      };

      const migrated = migrateState(oldRaw, 'de');
      expect(migrated.version).toBe(3);
      expect(migrated._tombstones).toBeDefined();

      // Serialisierung für den Sync normalisiert alle Einträge auf eindeutige IDs & Zeitstempel
      const serialized = cloudSyncEngine.serializeFullState(migrated);
      expect(serialized._tombstones).toBeDefined();
      expect(serialized.items.daily).toHaveLength(2);
      expect(serialized.items.todo).toHaveLength(1);
    });

    it('funktioniert 100% lokal ohne Fehler wenn nicht angemeldet', () => {
      expect(FlowAuth.isLoggedIn()).toBe(false);

      window.state = {
        _tombstones: {},
        items: { daily: [{ id: 'loc1', task: 'Lokaler Task 1' }] },
        done: []
      };

      expect(() => saveState()).not.toThrow();
      const stored = JSON.parse(localStorage.getItem('flowPlannerV3'));
      expect(stored.items.daily[0].task).toBe('Lokaler Task 1');
    });
  });
});


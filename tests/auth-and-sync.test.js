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

describe('Supabase Magic Link Auth & Cloud Server Relay Sync Engine', () => {
  beforeEach(async () => {
    localStorage.clear();
    await FlowAuth.signOut();
    vi.restoreAllMocks();
  });

  describe('1. Supabase Magic Link Authentication (auth-engine.js)', () => {
    it('rejects invalid or empty email addresses without making API calls', async () => {
      const resEmpty = await FlowAuth.signInWithMagicLink('');
      expect(resEmpty.success).toBe(false);
      expect(resEmpty.error).toBeDefined();

      const resInvalid = await FlowAuth.signInWithMagicLink('not-an-email');
      expect(resInvalid.success).toBe(false);
      expect(resInvalid.error).toContain('gültige E-Mail');
    });

    it('correctly dispatches signInWithOtp to Supabase client when email is valid', async () => {
      const mockSignInWithOtp = vi.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: null
      });

      FlowAuth._setSupabaseClientForTesting({
        auth: {
          signInWithOtp: mockSignInWithOtp,
          signOut: vi.fn().mockResolvedValue({ error: null }),
          getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
          onAuthStateChange: vi.fn()
        }
      });

      const res = await FlowAuth.signInWithMagicLink('flow.tester@example.com');
      expect(res.success).toBe(true);
      expect(mockSignInWithOtp).toHaveBeenCalledTimes(1);
      expect(mockSignInWithOtp).toHaveBeenCalledWith(expect.objectContaining({
        email: 'flow.tester@example.com',
        options: expect.objectContaining({
          emailRedirectTo: expect.any(String)
        })
      }));
    });

    it('safely handles and surfaces Supabase errors', async () => {
      FlowAuth._setSupabaseClientForTesting({
        auth: {
          signInWithOtp: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Rate limit exceeded for email sending.' }
          }),
          signOut: vi.fn().mockResolvedValue({ error: null }),
          getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
          onAuthStateChange: vi.fn()
        }
      });

      const res = await FlowAuth.signInWithMagicLink('test@example.com');
      expect(res.success).toBe(false);
      expect(res.error).toBe('Rate limit exceeded for email sending.');
    });

    it('direct pairing token sets sync token and user state correctly', () => {
      FlowAuth.setDirectPairingToken('custom_test_sync_token_12345', 'phone@test.de');
      expect(FlowAuth.isLoggedIn()).toBe(true);
      expect(FlowAuth.getSyncToken()).toBe('custom_test_sync_token_12345');
      expect(FlowAuth.getUser().email).toBe('phone@test.de');
      expect(localStorage.getItem('flow_sync_token')).toBe('custom_test_sync_token_12345');
    });

    it('signOut clears auth state, localStorage tokens and notifies listeners', async () => {
      FlowAuth.setDirectPairingToken('token_to_remove', 'user@example.com');
      expect(FlowAuth.isLoggedIn()).toBe(true);

      let listenerNotified = false;
      const unsubscribe = FlowAuth.subscribe(({ token }) => {
        if (!token) listenerNotified = true;
      });

      await FlowAuth.signOut();
      expect(FlowAuth.isLoggedIn()).toBe(false);
      expect(FlowAuth.getSyncToken()).toBeNull();
      expect(localStorage.getItem('flow_sync_token')).toBeNull();
      expect(listenerNotified).toBe(true);
      unsubscribe();
    });
  });

  describe('2. Cloud Relay Sync Engine (api-sync.php Integration)', () => {
    it('skips sync push/pull if user is not logged in', async () => {
      await FlowAuth.signOut();
      expect(FlowAuth.isLoggedIn()).toBe(false);

      const pushRes = await cloudSyncEngine.pushState();
      expect(pushRes.skipped).toBe(true);

      const pullRes = await cloudSyncEngine.pullState();
      expect(pullRes.skipped).toBe(true);
    });

    it('pushes local state with Authorization header to api-sync.php?action=push', async () => {
      FlowAuth.setDirectPairingToken('auth_token_for_push_test', 'tester@sync.de');
      window.state = {
        items: { daily: ['Einkaufen', 'Sport'] },
        done: [{ task: 'Aufstehen', time: '08:00' }],
        workItems: { work_focus: ['Projekt Release'] },
        workDone: [],
        activeWorkspace: 'work'
      };

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true, time: new Date().toISOString() })
      });
      globalThis.fetch = mockFetch;

      const pushRes = await cloudSyncEngine.pushState();
      expect(pushRes.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toContain('api-sync.php?action=push');
      expect(options.method).toBe('POST');
      expect(options.headers['Authorization']).toBe('Bearer auth_token_for_push_test');

      const sentBody = JSON.parse(options.body);
      expect(sentBody.data.items.daily).toEqual(['Einkaufen', 'Sport']);
      expect(sentBody.data.workItems.work_focus).toEqual(['Projekt Release']);
      expect(sentBody.data.activeWorkspace).toBe('work');
    });

    it('pulls remote state from api-sync.php and applies Last-Write-Wins merge', async () => {
      FlowAuth.setDirectPairingToken('auth_token_for_pull_test', 'tester@sync.de');
      window.state = {
        items: { daily: ['Alter Task'] },
        done: [],
        workItems: {},
        workDone: [],
        activeWorkspace: 'private',
        lastSaved: '2026-01-01T10:00:00.000Z'
      };

      const mockRemoteState = {
        items: { daily: ['Neuer Server Task 1', 'Neuer Server Task 2'] },
        done: [{ task: 'Server erledigt', time: '11:00' }],
        workItems: { work_focus: ['Wichtige Aufgabe'] },
        workDone: [],
        activeWorkspace: 'work'
      };

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: mockRemoteState,
          updated_at: '2026-08-27T20:00:00.000Z' // newer timestamp
        })
      });
      globalThis.fetch = mockFetch;

      const pullRes = await cloudSyncEngine.pullState();
      expect(pullRes.success).toBe(true);
      expect(window.state.items.daily).toEqual(['Neuer Server Task 1', 'Neuer Server Task 2']);
      expect(window.state.workItems.work_focus).toEqual(['Wichtige Aufgabe']);
      expect(window.state.activeWorkspace).toBe('work');
    });

    it('pulls 404 (first time user on new account) and automatically uploads local state', async () => {
      FlowAuth.setDirectPairingToken('brand_new_user_token_123', 'newbie@sync.de');
      window.state = {
        items: { daily: ['Lokaler Initial-Plan'] },
        done: [],
        workItems: {},
        workDone: [],
        activeWorkspace: 'private'
      };

      const mockFetch = vi.fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: async () => ({ success: false, error: 'No sync state found' })
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true, time: new Date().toISOString() })
        });
      globalThis.fetch = mockFetch;

      const pullRes = await cloudSyncEngine.pullState();
      expect(pullRes.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch.mock.calls[0][0]).toContain('action=pull');
      expect(mockFetch.mock.calls[1][0]).toContain('action=push');
    });
  });

  describe('3. Offline- & Local-First Invariant (Hard Requirement 1)', () => {
    it('app operates 100% locally and without network errors when offline and logged out', async () => {
      await FlowAuth.signOut();
      expect(FlowAuth.isLoggedIn()).toBe(false);

      window.state = {
        items: { daily: ['Offline Item 1', 'Offline Item 2'] },
        done: [],
        workItems: {},
        workDone: [],
        activeWorkspace: 'private'
      };

      // saveState should succeed writing to localStorage without exceptions
      expect(() => saveState()).not.toThrow();

      const stored = JSON.parse(localStorage.getItem('flowPlannerV3'));
      expect(stored.items.daily).toEqual(['Offline Item 1', 'Offline Item 2']);
    });
  });
});

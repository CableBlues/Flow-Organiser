import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

import '../data-tasks.js';
import '../state.js';

describe('State Management & Versioned Migration (Production Code)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('migrateState returns valid v3 default state when given null or empty object', () => {
    const migrated = window.migrateState(null, 'de');
    expect(migrated).toBeDefined();
    expect(migrated.version).toBe(3);
    expect(migrated.activeWorkspace).toBe('private');
    expect(Array.isArray(migrated.items.daily)).toBe(true);
    expect(migrated.items.daily.length).toBeGreaterThan(0);
    expect(Array.isArray(migrated.items.notes)).toBe(true);
    expect(Array.isArray(migrated.shoppingList)).toBe(true);
    expect(migrated.cooking).toBeDefined();
    expect(migrated.clarity).toBeDefined();
  });

  it('migrates legacy v1 state with string notes and missing structures to full v3', () => {
    const legacyV1State = {
      lastDate: '2025-01-01',
      items: {
        daily: ['Medis', 'Zähne morgens'],
        weekly: ['Staubsaugen'],
        todo: [],
        notes: 'Erste Notiz\nZweite Notiz'
      },
      done: ['Duschen']
    };

    const migrated = window.migrateState(legacyV1State, 'de');
    expect(migrated.version).toBe(3);
    expect(Array.isArray(migrated.items.notes)).toBe(true);
    expect(migrated.items.notes).toEqual(['Erste Notiz', 'Zweite Notiz']);
    expect(migrated.activeWorkspace).toBe('private');
    expect(migrated.workItems).toBeDefined();
    expect(Array.isArray(migrated.workItems.work_focus)).toBe(true);
    expect(Array.isArray(migrated.shoppingList)).toBe(true);
    expect(Array.isArray(migrated.cooking.recipes)).toBe(true);
  });

  it('deduplicates multilingual variants of daily face washing task', () => {
    const stateWithDuplicates = {
      items: {
        daily: ['Gesicht waschen', 'Wash face', 'Lavarse la cara', 'Bett machen']
      }
    };
    const migrated = window.migrateState(stateWithDuplicates, 'de');
    const faceTasks = migrated.items.daily.filter(t => ['Gesicht waschen', 'Wash face', 'Lavarse la cara'].includes(t));
    expect(faceTasks).toHaveLength(1);
    expect(migrated.items.daily).toContain('Bett machen');
  });

  it('saveState safely catches QuotaExceededError and performs emergency archive trim', () => {
    // Fill state with huge archive
    window.state = window.migrateState(null, 'de');
    window.state.archive = new Array(100).fill({ task: 'Old Task' });
    window.state.shoppingHistory = new Array(100).fill({ item: 'Old Item' });

    let attempts = 0;
    const proto = window.Storage ? window.Storage.prototype : Object.getPrototypeOf(localStorage);
    const originalSetItem = proto.setItem;
    proto.setItem = function(k, v) {
      attempts++;
      if (attempts === 1) {
        throw new Error('QuotaExceededError');
      }
      return originalSetItem.call(this, k, v);
    };

    try {
      expect(() => window.saveState()).not.toThrow();
      expect(attempts).toBe(2);
      expect(window.state.archive.length).toBeLessThanOrEqual(50);
    } finally {
      proto.setItem = originalSetItem;
    }
  });
});

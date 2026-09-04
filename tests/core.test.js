import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

import '../utils.js';
import '../storage.js';
import '../data-tasks.js';
import '../state.js';

describe('Noodle Core Suite (tests/core.test.js)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. XSS-Schutz (echte escapeHtml-Funktion aus utils.js)', () => {
    it('maskiert HTML-Tags, Attribute und Quotes sicher', () => {
      const dangerous = '<script>alert("xss")</script>';
      expect(window.escapeHtml(dangerous)).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    });

    it('maskiert kaufmännisches Und (&)', () => {
      expect(window.escapeHtml('Tomaten & Äpfel')).toBe('Tomaten &amp; Äpfel');
    });

    it('behandelt null und undefined sicher als Leerstring', () => {
      expect(window.escapeHtml(null)).toBe('');
      expect(window.escapeHtml(undefined)).toBe('');
    });

    it('konvertiert numerische Eingaben sauber in String', () => {
      expect(window.escapeHtml(42)).toBe('42');
      expect(window.escapeHtml(0)).toBe('0');
    });
  });

  describe('2. AppStorage-Abstraktion (echtes AppStorage aus storage.js)', () => {
    it('speichert und parst JSON-Arrays und Objekte', () => {
      const sample = [{ id: '1', task: 'Echte Core Tests ausführen', done: false }];
      const success = window.AppStorage.set('core_tasks', sample);
      expect(success).toBe(true);

      const result = window.AppStorage.get('core_tasks');
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].task).toBe('Echte Core Tests ausführen');
    });

    it('fängt korruptes JSON sauber mit Fallback ab', () => {
      localStorage.setItem('corrupted_key', '{not_valid_json');
      const fallback = window.AppStorage.get('corrupted_key', { fallback: true });
      expect(fallback).toEqual({ fallback: true });
    });
  });

  describe('3. Versionierte State-Migration (echtes migrateState aus state.js)', () => {
    it('erzeugt vollständige v3-Standardstruktur bei leerem State', () => {
      const fresh = window.migrateState(null, 'de');
      expect(fresh).toBeDefined();
      expect(fresh.version).toBe(3);
      expect(fresh.activeWorkspace).toBe('private');
      expect(Array.isArray(fresh.items.daily)).toBe(true);
      expect(fresh.items.daily.length).toBeGreaterThan(0);
      expect(Array.isArray(fresh.shoppingList)).toBe(true);
    });

    it('migriert Legacy-Notizen von String zu Array verlustfrei', () => {
      const legacy = {
        items: {
          daily: ['Medis'],
          notes: 'Zeile 1\nZeile 2'
        }
      };
      const migrated = window.migrateState(legacy, 'de');
      expect(Array.isArray(migrated.items.notes)).toBe(true);
      expect(migrated.items.notes).toEqual(['Zeile 1', 'Zeile 2']);
    });
  });
});

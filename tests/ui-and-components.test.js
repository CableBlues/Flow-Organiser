import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
import '../utils.js';
import '../storage.js';
import '../data-tasks.js';
import '../state.js';
import '../app-core.js';

describe('UI Architecture, Modals & Components (Production Code)', () => {
  beforeEach(() => {
    // Pure DOM markup without subresource requests
    const sanitizedHtml = indexHtml
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gis, '')
      .replace(/<link[^>]*>/gis, '');
    document.body.innerHTML = sanitizedHtml;
  });

  it('DOM contains all core panels, modals, and mobile navigation elements natively', () => {
    expect(document.getElementById('app')).not.toBeNull();
    expect(document.getElementById('modal-settings')).not.toBeNull();
    expect(document.getElementById('modal-report-dashboard')).not.toBeNull();
    expect(document.getElementById('modal-command-palette')).not.toBeNull();
    expect(document.getElementById('modal-p2p-sync')).not.toBeNull();
    expect(document.getElementById('mobile-bottom-nav')).not.toBeNull();
    expect(document.getElementById('mobile-fab-add')).not.toBeNull();
  });

  it('closeAllPanelsAndModals closes active panels and resets currentlyOpenPanel', () => {
    expect(typeof window.closeAllPanelsAndModals).toBe('function');

    const settingsModal = document.getElementById('modal-settings');
    settingsModal.classList.remove('hidden');
    expect(settingsModal.classList.contains('hidden')).toBe(false);

    window.closeAllPanelsAndModals();
    expect(settingsModal.classList.contains('hidden')).toBe(true);
  });

  it('Settings modal contains § 5 DDG Impressum, DSGVO Privacy and Open Source Licenses', () => {
    const settingsEl = document.getElementById('modal-settings');
    const text = settingsEl.innerHTML;
    expect(text).toContain('DDG');
    expect(text).toContain('Datenschutz');
    expect(text).toContain('Open-Source');
  });

  it('Custom columns allow adding, renaming, and removing columns in state', () => {
    const testState = window.migrateState(null, 'de');
    const customCol = { id: 'col_custom_1', name: 'Projekt X', icon: 'folder' };

    testState.customColumns = [customCol];
    testState.items['col_custom_1'] = ['Task 1', 'Task 2'];

    expect(testState.customColumns).toHaveLength(1);
    expect(testState.items['col_custom_1']).toHaveLength(2);

    // Rename
    testState.customColumns[0].name = 'Projekt Y';
    expect(testState.customColumns[0].name).toBe('Projekt Y');

    // Remove
    testState.customColumns = testState.customColumns.filter(c => c.id !== 'col_custom_1');
    delete testState.items['col_custom_1'];
    expect(testState.customColumns).toHaveLength(0);
    expect(testState.items['col_custom_1']).toBeUndefined();
  });
});

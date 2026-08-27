import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

import '../utils-data.js';
import '../data-tasks.js';
import '../storage.js';
import '../state.js';
import '../utils.js';
import '../app-core.js';

describe('Curated 15 Human & Spatial Themes (Production Code)', () => {
  it('applies all 15 curated themes with deep background harmony', () => {
    const curatedThemes = [
      'honey-chamomile', 'peach-cashmere', 'terracotta-sun', 'cozy-amber', 'matcha-latte',
      'sage-breeze', 'eucalyptus-dew', 'lavender-cloud', 'sakura-blossom', 'lagoon-serenity',
      'aurora-violet', 'spatial-orbit', 'spatial-island', 'spatial-sanctuary', 'glacier-frost'
    ];
    curatedThemes.forEach(theme => {
      setTheme(theme);
      expect(document.body.classList.contains(`theme-${theme}`)).toBe(true);
      expect(localStorage.getItem('flowPlannerTheme')).toBe(theme);
    });
  });

  it('smoothly maps legacy theme aliases to the closest curated theme', () => {
    setTheme('aurora');
    expect(document.body.classList.contains('theme-aurora-violet')).toBe(true);

    setTheme('sage');
    expect(document.body.classList.contains('theme-sage-breeze')).toBe(true);

    setTheme('cozy');
    expect(document.body.classList.contains('theme-cozy-amber')).toBe(true);
  });
});

describe('Multilingual Icon Detection with Unicode Accents (Production Code)', () => {
  it('resolves task icons correctly across 6 languages with diacritics', () => {
    expect(window.getTaskIconDetails('Medis').icon).toBe('pill');
    expect(window.getTaskIconDetails('Médicaments').icon).toBe('pill');
    expect(window.getTaskIconDetails('Medicación').icon).toBe('pill');
    expect(window.getTaskIconDetails('Φάρμακα').icon).toBe('pill');
    expect(window.getTaskIconDetails('Farmaci').icon).toBe('pill');
    expect(window.getTaskIconDetails('Meds').icon).toBe('pill');

    expect(window.getTaskIconDetails('Geschirr spülen').icon).toBe('utensils');
    expect(window.getTaskIconDetails('Faire la vaisselle').icon).toBe('utensils');
    expect(window.getTaskIconDetails('Lavar los platos').icon).toBe('utensils');
    expect(window.getTaskIconDetails('Lavare i piatti').icon).toBe('utensils');
    expect(window.getTaskIconDetails('Πλύσιμο πιάτων').icon).toBe('utensils');

    expect(window.getTaskIconDetails('Wäsche aufhängen').icon).toBe('shirt');
    expect(window.getTaskIconDetails('Nägel schneiden').icon).toBe('scissors');
    expect(window.getTaskIconDetails('Klo putzen').icon).toBe('sparkles');
  });
});

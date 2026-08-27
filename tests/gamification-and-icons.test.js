import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

import '../utils-data.js';
import '../data-tasks.js';
import '../storage.js';
import '../state.js';
import '../utils.js';
import '../app-core.js';

describe('6 Distinct & Unique Human Themes (Production Code)', () => {
  it('applies all 6 distinct themes with unique character and contrast', () => {
    const distinctThemes = ['honey', 'sage', 'aurora', 'peach', 'ocean', 'terracotta'];
    distinctThemes.forEach(theme => {
      setTheme(theme);
      expect(document.body.classList.contains(`theme-${theme}`)).toBe(true);
      expect(localStorage.getItem('flowPlannerTheme')).toBe(theme);
    });
  });

  it('smoothly maps legacy theme aliases to the 6 distinct themes', () => {
    setTheme('honey-chamomile');
    expect(document.body.classList.contains('theme-honey')).toBe(true);

    setTheme('sage-breeze');
    expect(document.body.classList.contains('theme-sage')).toBe(true);

    setTheme('aurora-violet');
    expect(document.body.classList.contains('theme-aurora')).toBe(true);

    setTheme('peach-cashmere');
    expect(document.body.classList.contains('theme-peach')).toBe(true);

    setTheme('lagoon');
    expect(document.body.classList.contains('theme-ocean')).toBe(true);

    setTheme('terracotta-sun');
    expect(document.body.classList.contains('theme-terracotta')).toBe(true);
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

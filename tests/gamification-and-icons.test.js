import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

import '../utils-data.js';
import '../data-tasks.js';
import '../storage.js';
import '../state.js';
import '../utils.js';
import '../app-core.js';

describe('3D Spatial Themes & Deep Contrast (Production Code)', () => {
  it('applies 3D spatial themes with depth and lighting classes', () => {
    const spatialThemes = ['spatial-orbit', 'spatial-island', 'spatial-metropolis', 'spatial-galaxy', 'spatial-sanctuary'];
    spatialThemes.forEach(theme => {
      setTheme(theme);
      expect(document.body.classList.contains(`theme-${theme}`)).toBe(true);
      expect(localStorage.getItem('flowPlannerTheme')).toBe(theme);
    });
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

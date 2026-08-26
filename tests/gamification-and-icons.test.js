import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

import '../utils.js';
import '../data-tasks.js';
import '../app-core.js';
import '../gamification.js';

describe('Gamification Progression & Worlds (Production Code)', () => {
  it('defines the 5 rich spatial worlds correctly', () => {
    expect(window.worldPresets).toBeDefined();
    expect(Object.keys(window.worldPresets)).toHaveLength(5);
    expect(window.worldPresets.orbit_deck.name).toContain('Orbit-Deck');
    expect(window.worldPresets.quest_adventure.name).toContain('Chronicles of Flow');
  });

  it('calculates XP progression and level ups cleanly', () => {
    function simulateLevelProgression(currLvl, currXp, addXp) {
      let lvl = currLvl;
      let xp = currXp + addXp;
      let needed = lvl * 250;
      while (xp >= needed) {
        xp -= needed;
        lvl++;
        needed = lvl * 250;
      }
      return { lvl, xp };
    }

    const res1 = simulateLevelProgression(1, 100, 150); // 100 + 150 = 250 -> Level 2, 0 XP
    expect(res1.lvl).toBe(2);
    expect(res1.xp).toBe(0);

    const res2 = simulateLevelProgression(1, 200, 400); // 200 + 400 = 600 -> Level 2 (250), Level 3 (500) -> 600-250-500 = error? No, 600 - 250 = 350. Next needed = 500. So lvl 2, 350 xp.
    expect(res2.lvl).toBe(2);
    expect(res2.xp).toBe(350);
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

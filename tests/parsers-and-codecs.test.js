import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

import '../utils.js';
import '../data-tasks.js';
import '../app-core.js';
import '../app-tasks.js';
import '../app-shopping.js';

describe('Multi-Format & Calendar Parsers (Production Code)', () => {
  it('parseTextIntoItems parses markdown checklists and numbers', () => {
    const raw = `- [ ] Küche aufräumen\n- [x] Wäsche waschen\n* Müll rausbringen\n1. Einkaufen gehen`;
    const parsed = window.parseTextIntoItems(raw);
    expect(parsed).toHaveLength(4);
    expect(parsed[0]).toBe('Küche aufräumen');
    expect(parsed[1]).toBe('Wäsche waschen');
    expect(parsed[2]).toBe('Müll rausbringen');
    expect(parsed[3]).toBe('Einkaufen gehen');
  });

  it('parseTextIntoItems parses JSON task arrays and objects', () => {
    const rawJson = `[{"task": "Workout im Gym"}, {"title": "Meditation"}]`;
    const parsed = window.parseTextIntoItems(rawJson);
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toBe('Workout im Gym');
    expect(parsed[1]).toBe('Meditation');
  });

  it('parseIcsCalendar extracts events with summary, location, and dates', () => {
    const icsText = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:20260825T143000Z
SUMMARY:Sprint Review
LOCATION:Teams Meeting
END:VEVENT
BEGIN:VEVENT
DTSTART:20260826T090000Z
SUMMARY:Zahnarzt
END:VEVENT
END:VCALENDAR`;

    const events = window.parseIcsCalendar(icsText);
    expect(events).toBeDefined();
    expect(events).toHaveLength(2);
    expect(events[0].name).toContain('Sprint Review');
    expect(events[0].name).toContain('Teams Meeting');
    expect(events[0].time).toBe('14:30');
    expect(events[1].date).toBe('2026-08-26');
  });
});

describe('Shopping Department Classifier (Production Code)', () => {
  it('categorizes items into departments produce, dairy, bakery, meat, pantry', () => {
    expect(window.getDepartmentForItem('Frische Bio-Tomaten')).toBe('produce');
    expect(window.getDepartmentForItem('Hafermilch Barista')).toBe('dairy');
    expect(window.getDepartmentForItem('Vollkornbrot')).toBe('bakery');
    expect(window.getDepartmentForItem('Rinderhackfleisch')).toBe('meat');
    expect(window.getDepartmentForItem('Olivenöl Extra Vergine')).toBe('pantry');
    expect(window.getDepartmentForItem('Unbekanntes Produkt XYZ')).toBe('other');
  });
});

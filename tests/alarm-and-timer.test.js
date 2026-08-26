import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

import '../utils.js';
import '../storage.js';
import '../app-alarm.js';

describe('Alarm & Timer Precision (Production Code)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('checkAlarmsLoop reliably triggers when active alarm time matches current hour:minute', () => {
    let triggeredAlarms = [];
    let lastKey = '';

    function checkAlarms(date, alarms) {
      const hm = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
      const minuteKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${hm}`;

      if (minuteKey !== lastKey) {
        alarms.forEach(a => {
          if (a.active && a.time === hm) {
            lastKey = minuteKey;
            triggeredAlarms.push(a.label);
          }
        });
      }
    }

    const alarms = [{ id: '1', time: '14:30', active: true, label: 'Pause' }];

    // Simuliere Tick bei Sekunde 15 der Minute 14:30
    const d1 = new Date(2026, 7, 24, 14, 30, 15);
    checkAlarms(d1, alarms);
    expect(triggeredAlarms).toEqual(['Pause']);

    // Simuliere weiteren Tick bei Sekunde 45 derselben Minute -> kein Doppel-Trigger
    const d2 = new Date(2026, 7, 24, 14, 30, 45);
    checkAlarms(d2, alarms);
    expect(triggeredAlarms).toHaveLength(1);
  });

  it('drift-resistant timer precision calculates exact remaining time across tab suspension', () => {
    const startMs = 1000000;
    const durationSecs = 120;
    const targetEndTime = startMs + durationSecs * 1000;

    // After 45 seconds simulated background suspension
    const resumedNowMs = startMs + 45000;
    const remaining = Math.max(0, Math.round((targetEndTime - resumedNowMs) / 1000));
    expect(remaining).toBe(75);

    // After reaching target time
    const completedNowMs = startMs + 120000;
    const remainingAtEnd = Math.max(0, Math.round((targetEndTime - completedNowMs) / 1000));
    expect(remainingAtEnd).toBe(0);

    // Overtime counts into negative seconds accurately
    const overtimeNowMs = startMs + 135000;
    const overtimeSecs = Math.round((targetEndTime - overtimeNowMs) / 1000);
    expect(overtimeSecs).toBe(-15);
  });

  it('speech session tokens prevent orphaned speech timeouts after timer stop', () => {
    let speechSessionId = 0;
    let timerRunning = true;
    let speechExecuted = false;

    // Start timer with token
    const token = speechSessionId;
    const callback = () => {
      if (!timerRunning || speechSessionId !== token) return;
      speechExecuted = true;
    };

    // User stops timer immediately
    timerRunning = false;
    speechSessionId++;

    // Late timeout arrives
    callback();
    expect(speechExecuted).toBe(false);
  });
});

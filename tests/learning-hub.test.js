import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

import '../config.js';
import '../utils.js';
import '../data-translations-1.js';
import '../data-translations-2.js';
import '../data-translations.js';
import '../storage.js';
import '../data-tasks.js';
import '../state.js';
import '../helper-learning.js';
import '../app-reports.js';

describe('Deep Learning & Quiz-Labor Engine', () => {
  beforeEach(() => {
    const sanitizedHtml = indexHtml
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gis, '')
      .replace(/<link[^>]*>/gis, '');
    document.body.innerHTML = sanitizedHtml;
    window.state = window.migrateState(null, 'de');
    globalThis.state = window.state;
    globalThis.TRANSLATIONS = typeof TRANSLATIONS !== 'undefined' ? TRANSLATIONS : { de: {}, en: {} };
  });

  it('Curated packs are properly defined with deep explanations and mnemonics', () => {
    expect(window.CURATED_LEARNING_PACKS).toBeDefined();
    const packKeys = Object.keys(window.CURATED_LEARNING_PACKS);
    expect(packKeys.length).toBeGreaterThanOrEqual(5);

    const adhdPack = window.CURATED_LEARNING_PACKS['adhd_neuro'];
    expect(adhdPack).toBeDefined();
    expect(adhdPack.title).toBeTruthy();
    expect(adhdPack.questions.length).toBeGreaterThanOrEqual(3);

    adhdPack.questions.forEach(q => {
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBe(4);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(4);
      expect(q.explanation).toBeTruthy();
      expect(q.mnemonic).toBeTruthy();
      expect(q.pitfall).toBeTruthy();
    });
  });

  it('Dynamic question generator generates 5 structured questions for any custom topic', () => {
    expect(typeof window.generateDynamicQuestionsForTopic).toBe('function');
    const customQuestions = window.generateDynamicQuestionsForTopic('Maschinelles Lernen');
    expect(customQuestions).toHaveLength(5);
    customQuestions.forEach((q) => {
      expect(q.question).toContain('Maschinelles Lernen');
      expect(q.options).toHaveLength(4);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(4);
      expect(q.explanation).toBeTruthy();
      expect(q.mnemonic).toBeTruthy();
      expect(q.pitfall).toBeTruthy();
    });
  });

  it('selectLearningPack initializes session properly and handles answers', () => {
    window.LearningHubEngine.selectLearningPack('adhd_neuro');
    const session = window.LearningHubEngine.getSession();
    expect(session.packId).toBe('adhd_neuro');
    expect(session.currentIndex).toBe(0);
    expect(session.score).toBe(0);
    expect(session.isFinished).toBe(false);

    const pack = window.CURATED_LEARNING_PACKS['adhd_neuro'];
    const q = pack.questions[0];
    const correctIdx = q.correct;

    // Beantworte korrekt
    window.LearningHubEngine.handleSelectAnswer(correctIdx);
    expect(session.answers[q.id].selected).toBe(correctIdx);
    expect(session.answers[q.id].isCorrect).toBe(true);
    expect(session.score).toBe(1);

    // Gehe zur nächsten Frage
    window.LearningHubEngine.nextLearningQuestion();
    expect(session.currentIndex).toBe(1);
  });

  it('Wrong answers add question to mistakesArchive', () => {
    window.LearningHubEngine.selectLearningPack('stoicism_mental_models');
    const pack = window.CURATED_LEARNING_PACKS['stoicism_mental_models'];
    const q = pack.questions[0];
    const correctIdx = q.correct;
    const wrongIdx = (correctIdx + 1) % 4;

    window.LearningHubEngine.handleSelectAnswer(wrongIdx);
    const session = window.LearningHubEngine.getSession();
    expect(session.score).toBe(0);
    expect(session.answers[q.id].isCorrect).toBe(false);
    expect(session.mistakesArchive.some(m => m.id === q.id)).toBe(true);
  });

  it('Bookmarking toggles saved questions list', () => {
    window.LearningHubEngine.selectLearningPack('adhd_neuro');
    const session = window.LearningHubEngine.getSession();
    const q = session.questions[0];
    const initialBookmarkState = !!session.bookmarked[q.id];

    window.LearningHubEngine.toggleBookmarkCurrentQuestion();
    expect(session.bookmarked[q.id]).toBe(!initialBookmarkState);

    window.LearningHubEngine.toggleBookmarkCurrentQuestion();
    expect(session.bookmarked[q.id]).toBe(initialBookmarkState);
  });

  it('Modal and Dashboard tab switching works seamlessly', () => {
    const modal = document.getElementById('modal-learning-hub');
    expect(modal).not.toBeNull();

    window.openLearningHubModal();
    expect(modal.classList.contains('hidden')).toBe(false);

    window.closeLearningHubModal();
    expect(modal.classList.contains('hidden')).toBe(true);

    // Dashboard main tab switching
    const dashModal = document.getElementById('modal-report-dashboard');
    window.openReportDashboard();
    expect(dashModal.classList.contains('hidden')).toBe(false);

    window.switchDashboardMainTab('learning');
    const dashLearnSec = document.getElementById('dash-section-learning');
    const dashStatsSec = document.getElementById('dash-section-stats');
    expect(dashLearnSec.classList.contains('hidden')).toBe(false);
    expect(dashStatsSec.classList.contains('hidden')).toBe(true);

    window.switchDashboardMainTab('stats');
    expect(dashLearnSec.classList.contains('hidden')).toBe(true);
    expect(dashStatsSec.classList.contains('hidden')).toBe(false);

    window.closeReportDashboard();
    expect(dashModal.classList.contains('hidden')).toBe(true);
  });
});
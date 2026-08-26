import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Offline Capability & PWA Assets (Production Code)', () => {
  const rootDir = path.resolve(__dirname, '..');

  it('PWA Manifest is valid and defines standalone display and icon shortcuts', () => {
    const manifestPath = path.join(rootDir, 'manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    expect(manifest.name).toBe('Flow Organiser');
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons).toBeDefined();
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
  });

  it('Root Service Worker sw.js: 100% of all ASSETS_TO_CACHE entries physically exist in root', () => {
    const swPath = path.join(rootDir, 'sw.js');
    expect(fs.existsSync(swPath)).toBe(true);

    const swContent = fs.readFileSync(swPath, 'utf8');
    const match = swContent.match(/const ASSETS_TO_CACHE = \[([\s\S]*?)\];/);
    expect(match).not.toBeNull();

    const assetStrings = match[1]
      .split('\n')
      .map(line => line.trim().replace(/^['"]|['"],?$/g, ''))
      .filter(line => line.length > 0 && line !== './');

    expect(assetStrings.length).toBeGreaterThan(30);

    assetStrings.forEach(assetPath => {
      const cleanPath = assetPath.replace(/^\.\//, '');
      const fullPath = path.join(rootDir, cleanPath);
      const exists = fs.existsSync(fullPath);
      expect(exists, `Datei fehlt im Quellverzeichnis für sw.js Cache: ${cleanPath}`).toBe(true);
      const stat = fs.statSync(fullPath);
      expect(stat.size, `Datei ist leer: ${cleanPath}`).toBeGreaterThan(0);
    });
  });

  it('Production Release dist/sw.js: 100% of all ASSETS_TO_CACHE entries physically exist in dist/', () => {
    const distDir = path.join(rootDir, 'dist');
    const distSwPath = path.join(distDir, 'sw.js');
    expect(fs.existsSync(distSwPath)).toBe(true);

    const swContent = fs.readFileSync(distSwPath, 'utf8');
    const match = swContent.match(/const ASSETS_TO_CACHE = \[([\s\S]*?)\];/);
    expect(match).not.toBeNull();

    const assetStrings = match[1]
      .split('\n')
      .map(line => line.trim().replace(/^['"]|['"],?$/g, ''))
      .filter(line => line.length > 0 && line !== './');

    expect(assetStrings.length).toBeGreaterThan(20);

    assetStrings.forEach(assetPath => {
      const cleanPath = assetPath.replace(/^\.\//, '');
      const fullPath = path.join(distDir, cleanPath);
      const exists = fs.existsSync(fullPath);
      expect(exists, `Datei fehlt im dist/ Release für sw.js Cache: ${cleanPath}`).toBe(true);
      const stat = fs.statSync(fullPath);
      expect(stat.size, `Datei ist leer: ${cleanPath}`).toBeGreaterThan(0);
    });
  });

  it('All local vendor files exist and have non-trivial size (> 1KB)', () => {
    const vendorFiles = [
      'tailwindcss.js',
      'lucide.min.js',
      'three.min.js',
      'OrbitControls.js',
      'qrcode.min.js',
      'html2canvas.min.js'
    ];

    vendorFiles.forEach(file => {
      const filePath = path.join(rootDir, 'vendor', file);
      expect(fs.existsSync(filePath)).toBe(true);
      const stat = fs.statSync(filePath);
      expect(stat.size).toBeGreaterThan(1024);
    });
  });

  it('All local font weight files exist and have non-trivial size (> 10KB)', () => {
    const fontFiles = [
      'plus-jakarta-sans-400.ttf',
      'plus-jakarta-sans-500.ttf',
      'plus-jakarta-sans-600.ttf',
      'plus-jakarta-sans-700.ttf',
      'space-grotesk-500.ttf',
      'space-grotesk-700.ttf',
      'caveat-400.ttf',
      'caveat-700.ttf',
      'playfair-display-400.ttf',
      'playfair-display-700.ttf'
    ];

    fontFiles.forEach(file => {
      const filePath = path.join(rootDir, 'fonts', file);
      expect(fs.existsSync(filePath)).toBe(true);
      const stat = fs.statSync(filePath);
      expect(stat.size).toBeGreaterThan(10240);
    });
  });
});

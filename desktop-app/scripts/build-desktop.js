import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');
const distDir = path.join(rootDir, 'dist');

console.log('🔄 [Desktop Build] Aktualisiere Web-Assets aus dist/...');

try {
  // 1. Root-Build ausführen falls nötig
  execSync('node build.js', { cwd: rootDir, stdio: 'inherit' });
  console.log('✓ [Desktop Build] Web-Distribution erfolgreich aktualisiert.');
} catch (e) {
  console.error('❌ [Desktop Build] Fehler beim Erstellen der Web-Distribution:', e.message);
  process.exit(1);
}

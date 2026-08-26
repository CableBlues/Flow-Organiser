const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');

console.log('====================================================');
console.log('📦 FLOW ORGANISER PRODUCTION BUNDLER');
console.log('====================================================\n');

// 1. Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 2. Copy static files & vendor directory
const staticDirs = ['vendor'];
staticDirs.forEach(dir => {
  const src = path.join(rootDir, dir);
  const dest = path.join(distDir, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`✓ Verzeichnis kopiert: ${dir}/`);
  }
});

const staticFiles = ['manifest.json', 'favicon.svg', 'icon-192.svg', 'icon-512.svg', 'service-worker.js', 'sw.js'];
staticFiles.forEach(file => {
  const src = path.join(rootDir, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Datei kopiert: ${file}`);
  }
});

// Copy all app JS files
const allJsFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.js') && f !== 'build.js');
allJsFiles.forEach(jsFile => {
  const src = path.join(rootDir, jsFile);
  const dest = path.join(distDir, jsFile);
  fs.copyFileSync(src, dest);
});
console.log(`✓ ${allJsFiles.length} JavaScript-Module nach dist/ kopiert`);

// Copy index.html
let indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml, 'utf8');
console.log('✓ Produktions-Release erfolgreich nach dist/ gebaut!');

console.log('\n====================================================');
console.log('🎉 BUILD ERFOLGREICH ABGESCHLOSSEN (Bereit für Hosting)');
console.log('====================================================');

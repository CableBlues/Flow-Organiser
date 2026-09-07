import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');
const assetLinksPath = path.join(rootDir, '.well-known', 'assetlinks.json');

const fingerprint = process.argv[2];

if (!fingerprint) {
  console.log('Verwendung: node generate-assetlinks.js <SHA256_FINGERPRINT>');
  console.log('Beispiel: node generate-assetlinks.js 14:6D:E9:7D:0F:52:...:AA');
  process.exit(1);
}

const cleanedFingerprint = fingerprint.trim().toUpperCase();

const assetLinksContent = [
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "app.noodlestudio.flow",
      "sha256_cert_fingerprints": [
        cleanedFingerprint
      ]
    }
  }
];

// Ensure .well-known exists
const wellKnownDir = path.dirname(assetLinksPath);
if (!fs.existsSync(wellKnownDir)) {
  fs.mkdirSync(wellKnownDir, { recursive: true });
}

fs.writeFileSync(assetLinksPath, JSON.stringify(assetLinksContent, null, 2), 'utf8');
console.log(`✓ .well-known/assetlinks.json erfolgreich aktualisiert mit Fingerprint: ${cleanedFingerprint}`);

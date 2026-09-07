# Noodle Desktop App (Tauri v2)

Native, ressourcensparende Desktop-App für Windows, macOS und Linux.
**100% kostenlos, ohne Store-Zwang, ohne Lizenzkosten.**

---

## 1. Voraussetzungen (einmalig & kostenlos)

1. **Rust-Toolchain installieren**:
   - Download von [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)
   - Windows: Den Installer `rustup-init.exe` ausführen (Standard-Installation wählen).
2. **C++ Build Tools (Windows)**:
   - Microsoft C++ Build Tools (wird bei der Rust-Installation automatisch angeboten).

---

## 2. Lokale Entwicklung & Testen

Im Ordner `desktop-app/`:

```bash
cd desktop-app
npm install
npm run dev
```

Dies startet Noodle in einem nativen Anwendungsfenster mit vollem Zugriff auf lokale Systemfunktionen.

---

## 3. Installierbare Desktop-App bauen (kostenlos)

```bash
npm run build
```

Das Skript:
1. Erstellt den frischen Web-Produktions-Bundle (`node build.js`).
2. Kompiliert das native Programm über Tauri (`.exe` / `.msi` unter Windows, `.dmg` / `.app` unter macOS, `.deb` / `.AppImage` unter Linux).
3. Die fertigen Installationsdateien liegen im Verzeichnis:
   `desktop-app/src-tauri/target/release/bundle/`

---

## 4. Kostenlose Auto-Updates via GitHub Releases einrichten

1. **Signierschlüssel lokal erzeugen (einmalig, geheim halten):**
   ```bash
   npx tauri signer generate -w ~/.tauri/noodle-update-key.key
   ```
2. Den ausgegebenen **öffentlichen Schlüssel** (`pubkey`) in `src-tauri/tauri.conf.json` eintragen:
   ```json
   "plugins": {
     "updater": {
       "pubkey": "DEIN_OEFFENTLICHER_SCHLUESSEL_HIER",
       "endpoints": [
         "https://github.com/CableBlues/Flow-Organiser/releases/latest/download/latest.json"
       ]
     }
   }
   ```
3. **Release mit Update-Signatur bauen:**
   - Powershell:
     ```powershell
     $env:TAURI_SIGNING_PRIVATE_KEY = Get-Content "$HOME\.tauri\noodle-update-key.key" -Raw
     npm run build
     ```
   - Bash:
     ```bash
     export TAURI_SIGNING_PRIVATE_KEY="$(cat ~/.tauri/noodle-update-key.key)"
     npm run build
     ```
4. Die erzeugten Dateien (`latest.json`, `.sig`, Installer) einfach als neues GitHub-Release hochladen. Installierte Desktop-Apps erkennen und installieren neue Updates beim Start automatisch.

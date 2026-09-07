# Noodle Android TWA (Trusted Web Activity)

Erzeuge aus Noodle eine vollwertige Android-App (APK) mit Google Bubblewrap.
**100% kostenlos, ohne Google Play Konto, direkt lokal testbar.**

---

## Funktionsweise & Vorteil von TWA

- Die Android-App lädt und zeigt live deine Noodle-Web-App (PWA).
- **Keine separaten App-Updates nötig**: Änderungen an Funktionen, Design oder Fehlerbehebungen auf GitHub Pages sind für Android-Nutzer sofort live.
- Die App öffnet im vollwertigen Standalone-Modus (ohne Browser-URL-Leiste) wie eine native Android-App.

---

## 1. Voraussetzungen installieren (einmalig & kostenlos)

1. **Node.js**: Ist bereits auf deinem System vorhanden.
2. **Java JDK 17+**: Download von [https://adoptium.net/](https://adoptium.net/) (Temurin OpenJDK).
3. **Android Command Line Tools / SDK**: (Wird von Bubblewrap beim ersten Start automatisch eingerichtet oder kann über Android Studio bezogen werden).
4. **Bubblewrap CLI installieren:**
   ```bash
   npm install -g @bubblewrap/cli
   ```

---

## 2. Android-Projekt initialisieren

Im Ordner `android-twa/`:

```bash
cd android-twa
bubblewrap init --manifest=https://cableblues.github.io/Flow-Organiser/manifest.json
```

- Bubblewrap übernimmt App-Name, Icons und Farben automatisch aus dem `manifest.json`.
- Bei der Frage nach dem Keystore erzeugt Bubblewrap automatisch einen kostenlosen lokalen Signierschlüssel (`noodle-release-key.keystore`).

---

## 3. Digital Asset Links einbinden (`.well-known/assetlinks.json`)

Nach der Initialisierung zeigt Bubblewrap den **SHA-256 Fingerprint** deines Schlüssels an (kann jederzeit über `bubblewrap fingerprint` aufgerufen werden).

Trage diesen Fingerabdruck in die Datei `.well-known/assetlinks.json` im Hauptverzeichnis ein oder nutze das Hilfsskript:

```bash
node scripts/generate-assetlinks.js DEIN:SHA256:FINGERPRINT:HIER
```

Sobald diese Datei auf GitHub Pages unter `https://cableblues.github.io/Flow-Organiser/.well-known/assetlinks.json` erreichbar ist, wird die App auf dem Android-Gerät ohne Adressleiste (Vollbild-App) ausgeführt.

---

## 4. APK bauen & auf eigenem Android-Handy testen

```bash
bubblewrap build
```

Das erzeugt eine signierte APK-Datei `app-release-signed.apk`.

### Installation auf dem eigenen Smartphone (per USB-Kabel):
1. Auf dem Android-Handy die **Entwickleroptionen** und **USB-Debugging** aktivieren.
2. Handy per USB an den PC anschließen.
3. Installieren mit:
   ```bash
   adb install app-release-signed.apk
   ```
*(Alternativ kann die APK auch per E-Mail, Cloud-Drive oder Messenger an das Smartphone gesendet und dort mit einem Klick installiert werden).*

---

## 5. Wann muss eine neue APK gebaut werden?

- **Bei normalen Web-Code-Updates**: **Nie** (die TWA lädt den aktuellen Stand direkt aus dem Web).
- **Nur bei**: Änderung des App-Namens, neuen Android-Systemberechtigungen oder geändertem App-Icon auf dem Homescreen.

@echo off
:: Setzt die Codepage auf UTF-8, um Emojis, Umlaute und Sonderzeichen fehlerfrei zu bündeln
chcp 65001 > nul

set "OUTPUT=flow_code_bundle.txt"

:: Löscht ein eventuell bereits vorhandenes altes Quellcode-Bundle
if exist "%OUTPUT%" del "%OUTPUT%"

echo Erstelle Quellcode-Bundle: %OUTPUT% ...
echo.

:: Liste aller zu bündelnden Projektdateien (data.js wird bewusst ausgelassen)
set "FILES=index.html styles.css state.js utils.js audio.js timer.js helper.js app.js sport.js"

:: Schleife über alle definierten Dateien
for %%F in (%FILES%) do (
    if exist "%%F" (
        echo Bündele %%F ...
        echo --- START OF FILE %%F --- >> "%OUTPUT%"
        type "%%F" >> "%OUTPUT%"
        echo. >> "%OUTPUT%"
        echo --- END OF FILE --- >> "%OUTPUT%"
        echo. >> "%OUTPUT%"
    ) else (
        echo [HINWEIS] "%%F" wurde im aktuellen Verzeichnis nicht gefunden. Überspringe...
    )
)

echo.
echo Bündelung erfolgreich abgeschlossen!
echo Die Datei "%OUTPUT%" ist bereit.
echo.
pause
@echo off
set OUTPUT_FILE=projekt_code.txt

:: Falls die Datei schon existiert, löschen, um nicht doppelt zu schreiben
if exist %OUTPUT_FILE% del %OUTPUT_FILE%

echo Erstelle Bundle... bitte warten.

:: Schleife durch alle relevanten Dateitypen
for %%f in (*.js *.css *.html) do (
    if "%%f" neq "%OUTPUT_FILE%" (
        echo ========================================== >> %OUTPUT_FILE%
        echo DATEI: %%f >> %OUTPUT_FILE%
        echo ========================================== >> %OUTPUT_FILE%
        echo. >> %OUTPUT_FILE%
        
        type "%%f" >> %OUTPUT_FILE%
        
        echo. >> %OUTPUT_FILE%
        echo. >> %OUTPUT_FILE%
    )
)

echo Fertig! Die Datei "%OUTPUT_FILE%" wurde erstellt.
pause
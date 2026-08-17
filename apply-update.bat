@echo off
setlocal
echo Lese Update-Daten aus update_data.txt...
set "PS_FILE=%temp%\flow_updater.ps1"
echo $data = [System.IO.File]::ReadAllText('update_data.txt') > "%PS_FILE%"
echo $pattern = '(?s)--- FILE: (.*?) ---\r?\n(.*?)\r?\n--- END ---' >> "%PS_FILE%"
echo $matches = [Regex]::Matches($data, $pattern) >> "%PS_FILE%"
echo foreach ($m in $matches) { >> "%PS_FILE%"
echo     $fn = $m.Groups[1].Value.Trim() >> "%PS_FILE%"
echo     $content = $m.Groups[2].Value.Trim() >> "%PS_FILE%"
echo     $path = Join-Path $pwd $fn >> "%PS_FILE%"
echo     [System.IO.File]::WriteAllText($path, $content) >> "%PS_FILE%"
echo     Write-Host "AKTUALISIERT: $fn" -ForegroundColor Cyan >> "%PS_FILE%"
echo } >> "%PS_FILE%"
powershell -ExecutionPolicy Bypass -File "%PS_FILE%"
del "%PS_FILE%"
echo.
echo ✅ Update erfolgreich angewendet!
pause
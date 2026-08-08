<# : Batch-Portion
@echo off
title Flow Code-Manager
powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-Expression (Get-Content '%~f0' -Raw)"
exit /b
#>

# === POWERSHELL-PORTION ===
Clear-Host
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "            FLOW CODE-MANAGER (.BAT)              " -ForegroundColor White
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " 1 : Dateien aus flow_code_bundle.txt entpacken (Empfangen)"
Write-Host " 2 : Letztes Update rueckgaengig machen (Undo / Rollback)"
Write-Host " 3 : Lokale Dateien in flow_code_bundle.txt packen (Senden)"
Write-Host "==================================================" -ForegroundColor Cyan
$choice = Read-Host "Waehle eine Option (1, 2 oder 3)"

$bundlePath = "flow_code_bundle.txt"
$backupDir = "backups"
$filesToPack = @("index.html", "styles.css", "app.js", "timer.js", "helper.js", "state.js", "utils.js", "audio.js", "sport.js")

if ($choice -eq "1") {
    if (-not (Test-Path $bundlePath)) {
        Write-Host "Fehler: $bundlePath wurde nicht gefunden!" -ForegroundColor Red
        Read-Host "Druecke Enter zum Beenden"
        exit
    }
    
    $content = [System.IO.File]::ReadAllText($bundlePath, [System.Text.Encoding]::UTF8)
    $pattern = '(?s)--- START OF FILE\s+(.*?)\s+---\r?\n(.*?)--- END OF FILE ---'
    $matches = [regex]::Matches($content, $pattern)
    
    if ($matches.Count -eq 0) {
        Write-Host "Keine gueltigen Dateiinhalte im Buendel gefunden." -ForegroundColor Red
        Read-Host "Druecke Enter zum Beenden"
        exit
    }
    
    # 1. Automatisches Backup erstellen
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir | Out-Null
    }
    
    $timestamp = (Get-Date).ToString("yyyyMMdd_HHmmss")
    $thisBackup = Join-Path $backupDir "backup_$timestamp"
    New-Item -ItemType Directory -Path $thisBackup | Out-Null
    
    Write-Host "Erstelle Sicherheits-Backup in $thisBackup..." -ForegroundColor Yellow
    foreach ($m in $matches) {
        $filename = $m.Groups[1].Value.Trim()
        if (Test-Path $filename) {
            Copy-Item $filename (Join-Path $thisBackup $filename) -Force
            Write-Host "-> Backup gesichert: $filename" -ForegroundColor Gray
        }
    }
    
    # 2. Dateien entpacken
    Write-Host "`nEntpacke $($matches.Count) Datei(en)..." -ForegroundColor Green
    foreach ($m in $matches) {
        $filename = $m.Groups[1].Value.Trim()
        $fileContent = $m.Groups[2].Value.Trim()
        [System.IO.File]::WriteAllText($filename, $fileContent, [System.Text.Encoding]::UTF8)
        Write-Host "-> Aktualisiert: $filename" -ForegroundColor Green
    }
    
    Write-Host "`nErfolgreich aktualisiert! 🎉" -ForegroundColor Green
    Read-Host "Druecke Enter zum Beenden"
}
elseif ($choice -eq "2") {
    if (-not (Test-Path $backupDir)) {
        Write-Host "Fehler: Kein Backup-Ordner gefunden. Kein Undo moeglich!" -ForegroundColor Red
        Read-Host "Druecke Enter zum Beenden"
        exit
    }
    
    $folders = Get-ChildItem $backupDir | Where-Object { $_.PSIsContainer -and $_.Name -like "backup_*" } | Sort-Object LastWriteTime -Descending
    if (-not $folders) {
        Write-Host "Fehler: Keine Backups verfuegbar!" -ForegroundColor Red
        Read-Host "Druecke Enter zum Beenden"
        exit
    }
    
    $latest = $folders[0]
    Write-Host "Stelle vorherigen Zustand wieder her aus: $($latest.Name)..." -ForegroundColor Yellow
    
    foreach ($file in (Get-ChildItem $latest.FullName)) {
        Copy-Item $file.FullName $file.Name -Force
        Write-Host "<- Wiederhergestellt: $($file.Name)" -ForegroundColor Green
    }
    
    Remove-Item $latest.FullName -Recurse -Force
    Write-Host "`nUndo erfolgreich abgeschlossen! 🎉" -ForegroundColor Green
    Read-Host "Druecke Enter zum Beenden"
}
elseif ($choice -eq "3") {
    Write-Host "Packe deine lokalen Dateien in $bundlePath zusammen..." -ForegroundColor Yellow
    $sb = New-Object System.Text.StringBuilder
    
    foreach ($file in $filesToPack) {
        if (Test-Path $file) {
            [void]$sb.AppendLine("--- START OF FILE $file ---")
            $fileContent = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)
            [void]$sb.AppendLine($fileContent)
            [void]$sb.AppendLine("--- END OF FILE ---")
            [void]$sb.AppendLine("")
            Write-Host "-> $file erfolgreich verpackt" -ForegroundColor Gray
        }
    }
    
    [System.IO.File]::WriteAllText($bundlePath, $sb.ToString(), [System.Text.Encoding]::UTF8)
    Write-Host "`nErfolgreich gebuendelt! Du kannst die Datei '$bundlePath' jetzt einfach in jedem neuen Chat hochladen. 🚀" -ForegroundColor Green
    Read-Host "Druecke Enter zum Beenden"
}
else {
    Write-Host "Ungueltige Option." -ForegroundColor Red
    Read-Host "Druecke Enter zum Beenden"
}
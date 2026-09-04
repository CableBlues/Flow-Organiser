<?php
// api-sync.php: Abgesicherter lokaler / Webserver Sync- & Authentifizierungs-Endpunkt für Flow-Organiser
// 100% autark, ohne externe Abhängigkeiten

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');

// 1. DYNAMISCHES & SICHERES CORS WHITELISTING
$httpOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
$originAllowed = false;

if (!empty($httpOrigin)) {
    $parsedOrigin = parse_url($httpOrigin);
    $originHost = $parsedOrigin['host'] ?? '';
    $originScheme = $parsedOrigin['scheme'] ?? 'http';
    
    // Erlaube localhost, loopback, private LAN-Netzwerke (z.B. Smartphone greift auf lokalen PC zu) & GitHub Pages
    if (
        $originHost === 'localhost' ||
        $originHost === '127.0.0.1' ||
        $originHost === 'cableblues.github.io' ||
        preg_match('/^192\.168\.\d{1,3}\.\d{1,3}$/', $originHost) ||
        preg_match('/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/', $originHost) ||
        preg_match('/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/', $originHost)
    ) {
        $originAllowed = true;
        header("Access-Control-Allow-Origin: $httpOrigin");
        header('Vary: Origin');
    }
} else {
    // Bei Same-Origin oder direkten Aufrufen
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Sync-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// 2. RATE LIMITING (Maximal 120 Anfragen pro Minute pro IP)
$baseDir = __DIR__ . '/data_sync/';
$rateLimitDir = $baseDir . '.rate_limit/';
$usersDir = $baseDir . '.users/';
$pairsDir = $baseDir . '.pair_codes/';

foreach ([$baseDir, $rateLimitDir, $usersDir, $pairsDir] as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
}

$clientIp = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
$clientIpSafe = preg_replace('/[^a-zA-Z0-9_.-]/', '_', $clientIp);
$rateLimitFile = $rateLimitDir . 'rl_' . md5($clientIpSafe) . '.json';

$now = time();
$rateData = ['count' => 0, 'window_start' => $now];

if (file_exists($rateLimitFile)) {
    $rawRate = @file_get_contents($rateLimitFile);
    if ($rawRate) {
        $decodedRate = @json_decode($rawRate, true);
        if ($decodedRate && isset($decodedRate['window_start'], $decodedRate['count'])) {
            if ($now - $decodedRate['window_start'] < 60) {
                $rateData = $decodedRate;
            }
        }
    }
}

$rateData['count']++;
if ($rateData['count'] > 120) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Zu viele Anfragen. Bitte kurz warten.']);
    exit;
}
@file_put_contents($rateLimitFile, json_encode($rateData));

// Helper: JSON Payload sicher auslesen
function getJsonPayload() {
    $raw = file_get_contents('php://input');
    if (!$raw || strlen($raw) > 5 * 1024 * 1024) return null; // Max 5MB
    return json_decode($raw, true);
}

// Helper: Atomares Speichern
function atomicFileWrite($targetPath, $content) {
    $tempPath = $targetPath . '.' . bin2hex(random_bytes(6)) . '.tmp';
    $written = @file_put_contents($tempPath, $content, LOCK_EX);
    if ($written === false) return false;
    return @rename($tempPath, $targetPath);
}

// 3. AUTHENTIFIZIERUNG: TOKEN-EXTRAKTION
function extractSyncToken() {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+([a-zA-Z0-9_\-\.]{16,128})/i', $authHeader, $matches)) {
        return $matches[1];
    }
    if (!empty($_SERVER['HTTP_X_SYNC_TOKEN'])) {
        $token = trim($_SERVER['HTTP_X_SYNC_TOKEN']);
        if (preg_match('/^[a-zA-Z0-9_\-\.]{16,128}$/', $token)) {
            return $token;
        }
    }
    $candidate = $_GET['token'] ?? $_GET['key'] ?? '';
    if (!empty($candidate) && preg_match('/^[a-zA-Z0-9_\-\.]{16,128}$/', $candidate)) {
        return $candidate;
    }
    return null;
}

$action = $_GET['action'] ?? '';

// ============================================================================
// AKTION: AUTH_LOGIN / AUTH_REGISTER (Einfacher, sicherer E-Mail + Passwort Login)
// ============================================================================
if ($action === 'auth_login' || $action === 'auth') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'POST erforderlich.']);
        exit;
    }

    $payload = getJsonPayload();
    $email = trim(strtolower($payload['email'] ?? ''));
    $password = (string)($payload['password'] ?? '');

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Bitte eine gültige E-Mail-Adresse eingeben.']);
        exit;
    }

    if (strlen($password) < 4) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Das Passwort muss mindestens 4 Zeichen lang sein.']);
        exit;
    }

    $userHash = hash('sha256', 'flow_user_' . $email);
    $userFile = $usersDir . $userHash . '.json';

    if (file_exists($userFile)) {
        $userData = json_decode(file_get_contents($userFile), true);
        if (!$userData || !isset($userData['password_hash'])) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Benutzerkonto beschädigt.']);
            exit;
        }

        if (!password_verify($password, $userData['password_hash'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Passwort oder E-Mail ist nicht korrekt.']);
            exit;
        }

        $token = $userData['sync_token'];
    } else {
        // Neues Konto automatisch anlegen
        $token = bin2hex(random_bytes(32)); // 64-Zeichen Token
        $userData = [
            'email' => $email,
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            'sync_token' => $token,
            'created_at' => date('c')
        ];
        atomicFileWrite($userFile, json_encode($userData, JSON_UNESCAPED_UNICODE));
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'email' => $email,
        'token' => $token,
        'message' => 'Erfolgreich angemeldet'
    ]);
    exit;
}

// ============================================================================
// AKTION: CREATE_PAIR_CODE (Gerät A generiert 6-stelligen temporären Kopplungscode)
// ============================================================================
if ($action === 'create_pair_code') {
    $token = extractSyncToken();
    if (!$token) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Nicht autorisiert.']);
        exit;
    }

    // 6-stelligen Code generieren (100000 - 999999)
    $pairCode = (string)random_int(100000, 999999);
    $codeHash = hash('sha256', 'pair_code_' . $pairCode);
    $codeFile = $pairsDir . $codeHash . '.json';

    $codeData = [
        'token' => $token,
        'created_at' => $now,
        'expires_at' => $now + 600 // 10 Minuten gültig
    ];

    atomicFileWrite($codeFile, json_encode($codeData));

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'code' => $pairCode,
        'expires_in_seconds' => 600
    ]);
    exit;
}

// ============================================================================
// AKTION: CONFIRM_PAIR_CODE (Gerät B löst den 6-stelligen Code ein)
// ============================================================================
if ($action === 'confirm_pair_code') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'POST erforderlich.']);
        exit;
    }

    $payload = getJsonPayload();
    $rawCode = trim($payload['code'] ?? '');

    if (!preg_match('/^\d{6}$/', $rawCode)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Ungültiger 6-stelliger Code.']);
        exit;
    }

    $codeHash = hash('sha256', 'pair_code_' . $rawCode);
    $codeFile = $pairsDir . $codeHash . '.json';

    if (!file_exists($codeFile)) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Kopplungscode ist ungültig oder abgelaufen.']);
        exit;
    }

    $codeData = json_decode(file_get_contents($codeFile), true);
    if (!$codeData || empty($codeData['token']) || ($codeData['expires_at'] ?? 0) < $now) {
        @unlink($codeFile);
        http_response_code(410);
        echo json_encode(['success' => false, 'error' => 'Kopplungscode ist abgelaufen. Bitte neuen Code anfordern.']);
        exit;
    }

    // Code sofort verbrauchen (Single-Use-Sicherheit)
    @unlink($codeFile);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'token' => $codeData['token'],
        'message' => 'Gerät erfolgreich gekoppelt'
    ]);
    exit;
}

// ============================================================================
// TOKEN-VALIDIERUNG FÜR STATE PUSH & PULL
// ============================================================================
$token = extractSyncToken();
if (!$token) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Authentifizierungstoken erforderlich.']);
    exit;
}

// Deterministischer Hash verhindert Path Traversal
$safeFileKey = hash('sha256', 'flow_sync_salt_' . $token);
$filePath = $baseDir . $safeFileKey . '.json';

// ============================================================================
// AKTION: PUSH (State speichern)
// ============================================================================
if ($action === 'push') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'POST für Push erforderlich.']);
        exit;
    }

    $json = getJsonPayload();
    if (!$json || !isset($json['data'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Ungültige JSON-Nutzlast. Erwartet: { data: ... }']);
        exit;
    }

    $dataToSave = [
        'data' => $json['data'],
        'updated_at' => date('c'),
        'version' => 4
    ];

    $saved = atomicFileWrite($filePath, json_encode($dataToSave, JSON_UNESCAPED_UNICODE));
    if (!$saved) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Fehler beim Speichern des Zustands.']);
        exit;
    }

    http_response_code(200);
    echo json_encode(['success' => true, 'time' => date('c')]);
    exit;
}

// ============================================================================
// AKTION: PULL (State laden)
// ============================================================================
if ($action === 'pull') {
    if (!file_exists($filePath)) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Noch kein Sync-Zustand vorhanden.']);
        exit;
    }

    $content = @file_get_contents($filePath);
    $decoded = @json_decode($content, true);
    if (!$decoded || !isset($decoded['data'])) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Beschädigter Sync-Zustand.']);
        exit;
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $decoded['data'],
        'updated_at' => $decoded['updated_at'] ?? null
    ]);
    exit;
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => 'Unbekannte Aktion. Gültig: auth, auth_login, create_pair_code, confirm_pair_code, push, pull']);



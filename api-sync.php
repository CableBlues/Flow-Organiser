<?php
// api-sync.php: Abgesicherter lokaler / Webserver Sync-Endpunkt für Flow-Organiser
// 100% autark, ohne externe Abhängigkeiten

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');

// 1. CORS WHITELISTING (Kein unsicheres Access-Control-Allow-Origin: *)
$allowedOrigins = [
    'http://localhost',
    'http://127.0.0.1',
    'https://cableblues.github.io'
];

$httpOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
$originAllowed = false;

if (!empty($httpOrigin)) {
    $parsedOrigin = parse_url($httpOrigin);
    $originHost = ($parsedOrigin['scheme'] ?? 'http') . '://' . ($parsedOrigin['host'] ?? '');
    
    foreach ($allowedOrigins as $allowed) {
        if ($originHost === $allowed || str_starts_with($httpOrigin, $allowed . ':')) {
            $originAllowed = true;
            header("Access-Control-Allow-Origin: $httpOrigin");
            header('Vary: Origin');
            break;
        }
    }
}

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Sync-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// 2. RATE LIMITING (Maximal 60 Anfragen pro Minute pro IP)
$rateLimitDir = __DIR__ . '/data_sync/.rate_limit/';
if (!is_dir($rateLimitDir)) {
    @mkdir($rateLimitDir, 0750, true);
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
if ($rateData['count'] > 60) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Too many requests. Please try again later.']);
    exit;
}
@file_put_contents($rateLimitFile, json_encode($rateData));

// 3. SICHERE VERZEICHNIS-STRUKTUR
$dataDir = __DIR__ . '/data_sync/';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0750, true);
}

// 4. TOKEN- & KEY-VALIDIERUNG
// Extrahiere Token aus Authorization-Header, X-Sync-Token oder GET/POST Parameter
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

$token = extractSyncToken();
if (!$token) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Authentication token required (min 16 alphanumeric characters).']);
    exit;
}

// Deterministischer, sicherer Hash für den Dateinamen (verhindert Path Traversal)
$safeFileKey = hash('sha256', 'flow_sync_salt_' . $token);
$filePath = $dataDir . $safeFileKey . '.json';

$action = $_GET['action'] ?? '';

// 5. AKTION: PUSH (State speichern)
if ($action === 'push') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed. Use POST for push.']);
        exit;
    }

    $input = file_get_contents('php://input');
    if (!$input || strlen($input) > 2 * 1024 * 1024) { // Max 2MB Payload
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Payload empty or exceeds 2MB limit']);
        exit;
    }

    $json = json_decode($input, true);
    if (!$json || !isset($json['data'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON payload. Expected { data: ... }']);
        exit;
    }

    $dataToSave = [
        'data' => $json['data'],
        'updated_at' => date('c'),
        'version' => 3
    ];

    $saved = @file_put_contents($filePath, json_encode($dataToSave, JSON_UNESCAPED_UNICODE));
    if ($saved === false) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to persist state']);
        exit;
    }

    http_response_code(200);
    echo json_encode(['success' => true, 'time' => date('c')]);
    exit;
}

// 6. AKTION: PULL (State laden)
if ($action === 'pull') {
    if (!file_exists($filePath)) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'No sync state found for this token']);
        exit;
    }

    $content = @file_get_contents($filePath);
    $decoded = @json_decode($content, true);
    if (!$decoded || !isset($decoded['data'])) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Corrupt sync state']);
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
echo json_encode(['success' => false, 'error' => 'Unknown action. Valid actions: push, pull']);


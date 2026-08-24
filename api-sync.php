<?php
// api-sync.php: Optionaler lokaler / Webserver Sync-Endpunkt für Flow-Organiser
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$dataDir = __DIR__ . '/data_sync/';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}

$action = $_GET['action'] ?? '';

if ($action === 'push') {
    $input = file_get_contents('php://input');
    $json = json_decode($input, true);
    if (!$json || empty($json['key']) || !isset($json['data'])) {
        echo json_encode(['success' => false, 'error' => 'Invalid payload']);
        exit;
    }

    $safeKey = preg_replace('/[^a-zA-Z0-9_-]/', '', $json['key']);
    $filePath = $dataDir . $safeKey . '.json';
    file_put_contents($filePath, json_encode($json['data']));
    echo json_encode(['success' => true, 'time' => date('c')]);
    exit;
}

if ($action === 'pull') {
    $key = $_GET['key'] ?? '';
    $safeKey = preg_replace('/[^a-zA-Z0-9_-]/', '', $key);
    if (!$safeKey) {
        echo json_encode(['success' => false, 'error' => 'Key missing']);
        exit;
    }

    $filePath = $dataDir . $safeKey . '.json';
    if (!file_exists($filePath)) {
        echo json_encode(['success' => false, 'error' => 'Not found']);
        exit;
    }

    $content = file_get_contents($filePath);
    $data = json_decode($content, true);
    echo json_encode(['success' => true, 'data' => $data]);
    exit;
}

echo json_encode(['success' => false, 'error' => 'Unknown action']);

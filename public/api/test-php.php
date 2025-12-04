<?php
header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'message' => 'PHP está funcionando correctamente',
    'php_version' => phpversion(),
    'curl_available' => function_exists('curl_init'),
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'timestamp' => date('Y-m-d H:i:s')
]);

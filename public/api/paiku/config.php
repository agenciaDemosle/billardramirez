<?php
/**
 * Configuración de Paiku
 */

// Configuración de CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Token de Paiku (del .env o configuración)
define('PAIKU_TOKEN', 'tkpu84e1e040c4aa7be0a1b234750852');

// URLs de Paiku
define('PAIKU_BASE_URL', 'https://app.payku.cl'); // Producción
// define('PAIKU_BASE_URL', 'https://des.payku.cl'); // Sandbox para pruebas

// Configuración de la moneda (Chile usa CLP)
define('PAIKU_CURRENCY', 'CLP');

// ID del método de pago de Paiku (verificar en el panel de Paiku)
define('PAIKU_PAYMENT_METHOD', 1); // Ajustar según tu configuración

// URL base de tu sitio
// define('SITE_URL', 'http://localhost:5173'); // En desarrollo
define('SITE_URL', 'https://billardramirez.cl'); // En producción

/**
 * Función para hacer peticiones a la API de Paiku
 */
function paiku_request($endpoint, $method = 'GET', $data = null) {
    $url = PAIKU_BASE_URL . $endpoint;

    $headers = [
        'Authorization: Bearer ' . PAIKU_TOKEN,
        'Content-Type: application/json',
        'Accept: application/json'
    ];

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
    }

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);

    curl_close($ch);

    if ($error) {
        return [
            'success' => false,
            'error' => $error,
            'http_code' => $http_code
        ];
    }

    $decoded = json_decode($response, true);

    return [
        'success' => $http_code >= 200 && $http_code < 300,
        'data' => $decoded,
        'http_code' => $http_code,
        'raw_response' => $response
    ];
}

/**
 * Función para registrar logs (útil para debugging)
 */
function paiku_log($message, $data = null) {
    $log_file = __DIR__ . '/paiku.log';
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "[$timestamp] $message";

    if ($data) {
        $log_entry .= "\n" . json_encode($data, JSON_PRETTY_PRINT);
    }

    $log_entry .= "\n" . str_repeat('-', 80) . "\n";

    file_put_contents($log_file, $log_entry, FILE_APPEND);
}

/**
 * Función para enviar respuesta JSON
 */
function send_json_response($data, $status_code = 200) {
    http_response_code($status_code);
    echo json_encode($data);
    exit();
}

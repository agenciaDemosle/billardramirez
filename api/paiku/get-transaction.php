<?php
/**
 * Endpoint para obtener el estado de una transacción
 *
 * Permite al frontend consultar el estado de una transacción por order_id
 */

require_once __DIR__ . '/config.php';

// Solo permitir método GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_json_response([
        'success' => false,
        'error' => 'Método no permitido. Use GET.'
    ], 405);
}

// Obtener order_id del query string
$order_id = $_GET['order_id'] ?? null;

if (!$order_id) {
    send_json_response([
        'success' => false,
        'error' => 'order_id es requerido'
    ], 400);
}

// Buscar archivo de transacción
$transaction_file = __DIR__ . '/transactions/' . $order_id . '.json';

if (!file_exists($transaction_file)) {
    send_json_response([
        'success' => false,
        'error' => 'Transacción no encontrada',
        'order_id' => $order_id
    ], 404);
}

// Leer datos de la transacción
$transaction_data = json_decode(file_get_contents($transaction_file), true);

// Si tenemos un transaction_id de Paiku, consultar el estado actual
if (isset($transaction_data['paiku_id']) && !empty($transaction_data['paiku_id'])) {
    $paiku_id = $transaction_data['paiku_id'];

    // Consultar estado en Paiku
    $response = paiku_request('/api/transaction/' . $paiku_id, 'GET');

    if ($response['success'] && isset($response['data'])) {
        $paiku_transaction = $response['data'];

        // Actualizar estado local
        $transaction_data['paiku_status'] = $paiku_transaction['status'] ?? $transaction_data['paiku_status'] ?? 'pending';
        $transaction_data['paiku_updated'] = date('Y-m-d H:i:s');
        $transaction_data['paiku_full_data'] = $paiku_transaction;

        // Guardar actualización
        file_put_contents($transaction_file, json_encode($transaction_data, JSON_PRETTY_PRINT));
    }
}

// Preparar respuesta limpia para el frontend
$response_data = [
    'success' => true,
    'order_id' => $transaction_data['order_id'] ?? $order_id,
    'status' => $transaction_data['paiku_status'] ?? 'pending',
    'transaction_id' => $transaction_data['paiku_id'] ?? null,
    'amount' => $transaction_data['amount'] ?? 0,
    'email' => $transaction_data['email'] ?? '',
    'created_at' => $transaction_data['created_at'] ?? null,
    'updated_at' => $transaction_data['updated_at'] ?? null,
    'verified' => $transaction_data['paiku_verified'] ?? false
];

send_json_response($response_data);

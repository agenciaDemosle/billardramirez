<?php
/**
 * Endpoint para crear una transacción con Paiku
 *
 * Este endpoint recibe los datos del checkout y crea una transacción en Paiku
 * Devuelve la URL de pago para redirigir al usuario
 */

require_once __DIR__ . '/config.php';

// Solo permitir método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_response([
        'success' => false,
        'error' => 'Método no permitido. Use POST.'
    ], 405);
}

// Obtener datos del request
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validar datos requeridos
$required_fields = ['email', 'order_id', 'amount', 'billing', 'line_items'];
foreach ($required_fields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        send_json_response([
            'success' => false,
            'error' => "Campo requerido faltante: $field"
        ], 400);
    }
}

// Registrar log de la solicitud
paiku_log('Creando transacción de Paiku', $data);

// Preparar datos para Paiku
$order_id = $data['order_id'];
$email = $data['email'];
$amount = intval($data['amount']); // Paiku requiere el monto como entero (en centavos)
$billing = $data['billing'];
$line_items = $data['line_items'];

// Crear descripción del pedido
$subject = "Pedido #$order_id - Billard Ramirez";
if (isset($line_items[0])) {
    $first_product = $line_items[0]['name'] ?? 'Productos';
    $items_count = count($line_items);
    if ($items_count > 1) {
        $subject = "$first_product y " . ($items_count - 1) . " más";
    } else {
        $subject = $first_product;
    }
}

// URLs de retorno y notificación
$url_return = SITE_URL . '/pedido-confirmado?order=' . $order_id;
$url_notify = SITE_URL . '/api/paiku/webhook.php';

// Datos para la transacción de Paiku
$paiku_data = [
    'email' => $email,
    'order' => $order_id,
    'subject' => substr($subject, 0, 200), // Máximo 200 caracteres
    'amount' => $amount,
    'currency' => PAIKU_CURRENCY,
    'payment' => PAIKU_PAYMENT_METHOD,
    'urlreturn' => $url_return,
    'urlnotify' => $url_notify,
    'additional_parameters' => [
        'billing_first_name' => $billing['first_name'] ?? '',
        'billing_last_name' => $billing['last_name'] ?? '',
        'billing_phone' => $billing['phone'] ?? '',
        'billing_address' => $billing['address_1'] ?? '',
        'billing_city' => $billing['city'] ?? '',
    ]
];

// Crear transacción en Paiku
$response = paiku_request('/api/transaction', 'POST', $paiku_data);

// Registrar respuesta
paiku_log('Respuesta de Paiku', $response);

// Verificar respuesta
if (!$response['success']) {
    send_json_response([
        'success' => false,
        'error' => 'Error al crear la transacción con Paiku',
        'details' => $response['data'] ?? 'Sin detalles',
        'http_code' => $response['http_code']
    ], 500);
}

$paiku_response = $response['data'];

// Verificar que tengamos la URL de pago
if (!isset($paiku_response['url']) || empty($paiku_response['url'])) {
    paiku_log('Error: URL de pago no encontrada', $paiku_response);
    send_json_response([
        'success' => false,
        'error' => 'No se obtuvo la URL de pago de Paiku',
        'details' => $paiku_response
    ], 500);
}

// Guardar los datos de la transacción en un archivo temporal
// (en producción, esto debería ir a una base de datos)
$transaction_file = __DIR__ . '/transactions/' . $order_id . '.json';
if (!is_dir(__DIR__ . '/transactions')) {
    mkdir(__DIR__ . '/transactions', 0777, true);
}

$transaction_data = [
    'order_id' => $order_id,
    'paiku_id' => $paiku_response['id'] ?? null,
    'paiku_url' => $paiku_response['url'] ?? null,
    'status' => $paiku_response['status'] ?? 'pending',
    'amount' => $amount,
    'email' => $email,
    'billing' => $billing,
    'line_items' => $line_items,
    'created_at' => date('Y-m-d H:i:s'),
    'updated_at' => date('Y-m-d H:i:s')
];

file_put_contents($transaction_file, json_encode($transaction_data, JSON_PRETTY_PRINT));

// Responder con éxito
send_json_response([
    'success' => true,
    'transaction_id' => $paiku_response['id'] ?? null,
    'payment_url' => $paiku_response['url'] ?? null,
    'status' => $paiku_response['status'] ?? 'pending',
    'order_id' => $order_id
]);

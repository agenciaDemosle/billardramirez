<?php
/**
 * Webhook de Paiku
 *
 * Este endpoint recibe las notificaciones de Paiku cuando una transacción cambia de estado
 * Paiku enviará información sobre el resultado del pago (success, failed, pending)
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/send-email.php';

// Solo permitir método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    paiku_log('Webhook: Método no permitido', $_SERVER['REQUEST_METHOD']);
    send_json_response([
        'success' => false,
        'error' => 'Método no permitido'
    ], 405);
}

// Obtener datos del webhook
$input = file_get_contents('php://input');
$webhook_data = json_decode($input, true);

// Registrar el webhook recibido
paiku_log('Webhook recibido de Paiku', [
    'data' => $webhook_data,
    'headers' => getallheaders()
]);

// Validar que tengamos los datos necesarios
if (!isset($webhook_data['order']) || !isset($webhook_data['status'])) {
    paiku_log('Webhook: Datos inválidos', $webhook_data);
    send_json_response([
        'success' => false,
        'error' => 'Datos de webhook inválidos'
    ], 400);
}

$order_id = $webhook_data['order'];
$transaction_id = $webhook_data['transaction_id'] ?? $webhook_data['payment_key'] ?? null;
$status = $webhook_data['status']; // success, failed, pending
$verification_key = $webhook_data['verification_key'] ?? null;

// Cargar datos de la transacción
$transaction_file = __DIR__ . '/transactions/' . $order_id . '.json';

if (!file_exists($transaction_file)) {
    paiku_log('Webhook: Transacción no encontrada', ['order_id' => $order_id]);
    send_json_response([
        'success' => false,
        'error' => 'Transacción no encontrada'
    ], 404);
}

$transaction_data = json_decode(file_get_contents($transaction_file), true);

// Actualizar estado de la transacción
$transaction_data['paiku_status'] = $status;
$transaction_data['paiku_transaction_id'] = $transaction_id;
$transaction_data['paiku_verification_key'] = $verification_key;
$transaction_data['updated_at'] = date('Y-m-d H:i:s');
$transaction_data['webhook_data'] = $webhook_data;

// Si el pago fue exitoso, verificar con la API de Paiku
if ($status === 'success' && $transaction_id) {
    paiku_log('Verificando transacción exitosa con Paiku', ['transaction_id' => $transaction_id]);

    // Consultar la transacción en Paiku para confirmar
    $verify_response = paiku_request('/api/transaction/' . $transaction_id, 'GET');

    if ($verify_response['success']) {
        $paiku_transaction = $verify_response['data'];
        $transaction_data['paiku_verified'] = true;
        $transaction_data['paiku_full_data'] = $paiku_transaction;

        paiku_log('Transacción verificada exitosamente', $paiku_transaction);
    } else {
        paiku_log('Error al verificar transacción', $verify_response);
        $transaction_data['paiku_verified'] = false;
    }
}

// Guardar datos actualizados
file_put_contents($transaction_file, json_encode($transaction_data, JSON_PRETTY_PRINT));

// Procesar según el estado del pago
if ($status === 'success' && $transaction_data['paiku_verified']) {
    // Pago exitoso y verificado - Crear orden en WooCommerce
    paiku_log('Pago exitoso, creando orden en WooCommerce...', ['order_id' => $order_id]);

    // Verificar si ya se creó una orden de WooCommerce
    if (!isset($transaction_data['woocommerce_order_id']) || empty($transaction_data['woocommerce_order_id'])) {
        // Cargar helper de WooCommerce
        require_once __DIR__ . '/woocommerce-helper.php';

        // Crear orden en WooCommerce
        $woo_result = create_woocommerce_order($transaction_data);

        if ($woo_result['success']) {
            // Guardar ID de la orden de WooCommerce
            $transaction_data['woocommerce_order_id'] = $woo_result['order_id'];
            $transaction_data['woocommerce_order_number'] = $woo_result['order_number'] ?? null;
            $transaction_data['woocommerce_created_at'] = date('Y-m-d H:i:s');

            // Guardar actualización
            file_put_contents($transaction_file, json_encode($transaction_data, JSON_PRETTY_PRINT));

            paiku_log('Orden creada exitosamente en WooCommerce', [
                'paiku_order_id' => $order_id,
                'woo_order_id' => $woo_result['order_id'],
                'woo_order_number' => $woo_result['order_number'] ?? null
            ]);

            // Agregar nota a la orden de WooCommerce
            add_woocommerce_order_note(
                $woo_result['order_id'],
                "Pago confirmado por Paiku. ID de transacción: {$transaction_id}"
            );

            // Enviar email de confirmación al cliente
            send_order_confirmation_email($transaction_data);
        } else {
            paiku_log('Error al crear orden en WooCommerce', [
                'paiku_order_id' => $order_id,
                'error' => $woo_result['error'] ?? 'Error desconocido'
            ]);

            // Marcar error pero no fallar el webhook
            $transaction_data['woocommerce_error'] = $woo_result['error'] ?? 'Error al crear orden';
            file_put_contents($transaction_file, json_encode($transaction_data, JSON_PRETTY_PRINT));
        }
    } else {
        paiku_log('La orden de WooCommerce ya existe', [
            'paiku_order_id' => $order_id,
            'woo_order_id' => $transaction_data['woocommerce_order_id']
        ]);
    }

} elseif ($status === 'failed') {
    // Pago fallido - Registrar
    paiku_log('Pago fallido', [
        'order_id' => $order_id,
        'transaction_id' => $transaction_id,
        'webhook_data' => $webhook_data
    ]);

    // Si existe una orden en WooCommerce, actualizar a fallida
    if (isset($transaction_data['woocommerce_order_id'])) {
        require_once __DIR__ . '/woocommerce-helper.php';
        update_woocommerce_order_status(
            $transaction_data['woocommerce_order_id'],
            'failed',
            'Pago rechazado por Paiku'
        );
    }

} elseif ($status === 'pending') {
    // Pago pendiente - Solo registrar
    paiku_log('Pago pendiente', [
        'order_id' => $order_id,
        'transaction_id' => $transaction_id
    ]);
}

// Responder a Paiku que recibimos el webhook correctamente
send_json_response([
    'success' => true,
    'message' => 'Webhook procesado correctamente',
    'order_id' => $order_id,
    'status' => $status
]);

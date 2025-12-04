<?php
/**
 * Helper para crear órdenes en WooCommerce
 */

// Credenciales de WooCommerce - billardramirez.cl/demosle
define('WOO_URL', 'https://billardramirez.cl/demosle/wp-json/wc/v3');
define('WOO_CONSUMER_KEY', 'ck_57c51a3c2900ff48d7575214327f91f0061cf49e');
define('WOO_CONSUMER_SECRET', 'cs_780649d7149b939bfc874b7ac8301ca501300d20');

/**
 * Hacer petición a la API de WooCommerce
 */
function woo_request($endpoint, $method = 'GET', $data = null) {
    $url = WOO_URL . $endpoint;

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_USERPWD, WOO_CONSUMER_KEY . ':' . WOO_CONSUMER_SECRET);
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

    $headers = [
        'Content-Type: application/json',
        'Accept: application/json'
    ];

    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
    } elseif ($method === 'PUT') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
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
 * Crear orden en WooCommerce desde datos de transacción de Paiku
 */
function create_woocommerce_order($transaction_data) {
    // Preparar datos de facturación
    $billing = $transaction_data['billing'] ?? [];

    // Preparar líneas de items
    $line_items = [];
    foreach ($transaction_data['line_items'] ?? [] as $item) {
        $line_items[] = [
            'product_id' => $item['product_id'] ?? 0,
            'variation_id' => $item['variation_id'] ?? 0,
            'quantity' => $item['quantity'] ?? 1,
        ];
    }

    // Calcular shipping
    $shipping_cost = $transaction_data['shipping_cost'] ?? 0;

    // Preparar datos de la orden
    $order_data = [
        'payment_method' => 'paiku',
        'payment_method_title' => 'Paiku - Pago en Línea',
        'set_paid' => true, // Marcar como pagada porque Paiku confirmó el pago
        'billing' => [
            'first_name' => $billing['first_name'] ?? '',
            'last_name' => $billing['last_name'] ?? '',
            'address_1' => $billing['address_1'] ?? '',
            'address_2' => $billing['address_2'] ?? '',
            'city' => $billing['city'] ?? '',
            'state' => $billing['state'] ?? '',
            'postcode' => $billing['postcode'] ?? '',
            'country' => 'CL',
            'email' => $transaction_data['email'] ?? '',
            'phone' => $billing['phone'] ?? '',
        ],
        'shipping' => [
            'first_name' => $billing['first_name'] ?? '',
            'last_name' => $billing['last_name'] ?? '',
            'address_1' => $billing['address_1'] ?? '',
            'address_2' => $billing['address_2'] ?? '',
            'city' => $billing['city'] ?? '',
            'state' => $billing['state'] ?? '',
            'postcode' => $billing['postcode'] ?? '',
            'country' => 'CL',
        ],
        'line_items' => $line_items,
        'shipping_lines' => [
            [
                'method_id' => 'flat_rate',
                'method_title' => $shipping_cost > 0 ? 'Envío Estándar' : 'Envío Gratis',
                'total' => (string)$shipping_cost,
            ],
        ],
        'meta_data' => [
            [
                'key' => '_paiku_transaction_id',
                'value' => $transaction_data['paiku_id'] ?? ''
            ],
            [
                'key' => '_paiku_order_id',
                'value' => $transaction_data['order_id'] ?? ''
            ],
            [
                'key' => '_paiku_verification_key',
                'value' => $transaction_data['paiku_verification_key'] ?? ''
            ],
            [
                'key' => '_payment_gateway',
                'value' => 'paiku'
            ]
        ],
        'status' => 'processing', // Estado: procesando
    ];

    // Crear orden en WooCommerce
    $response = woo_request('/orders', 'POST', $order_data);

    if (!$response['success']) {
        paiku_log('Error al crear orden en WooCommerce', [
            'error' => $response['data'] ?? 'Sin detalles',
            'http_code' => $response['http_code'],
            'transaction_data' => $transaction_data
        ]);

        return [
            'success' => false,
            'error' => 'Error al crear orden en WooCommerce',
            'details' => $response
        ];
    }

    $order = $response['data'];

    paiku_log('Orden creada exitosamente en WooCommerce', [
        'woo_order_id' => $order['id'] ?? null,
        'paiku_order_id' => $transaction_data['order_id'] ?? null
    ]);

    return [
        'success' => true,
        'order' => $order,
        'order_id' => $order['id'] ?? null,
        'order_number' => $order['number'] ?? null
    ];
}

/**
 * Actualizar estado de orden en WooCommerce
 */
function update_woocommerce_order_status($order_id, $status, $note = '') {
    $data = [
        'status' => $status
    ];

    if ($note) {
        $data['customer_note'] = $note;
    }

    $response = woo_request('/orders/' . $order_id, 'PUT', $data);

    if (!$response['success']) {
        paiku_log('Error al actualizar estado de orden en WooCommerce', [
            'order_id' => $order_id,
            'status' => $status,
            'error' => $response['data'] ?? 'Sin detalles'
        ]);

        return false;
    }

    paiku_log('Estado de orden actualizado en WooCommerce', [
        'order_id' => $order_id,
        'new_status' => $status
    ]);

    return true;
}

/**
 * Agregar nota a orden de WooCommerce
 */
function add_woocommerce_order_note($order_id, $note) {
    $data = [
        'note' => $note,
        'customer_note' => true
    ];

    $response = woo_request('/orders/' . $order_id . '/notes', 'POST', $data);

    return $response['success'];
}

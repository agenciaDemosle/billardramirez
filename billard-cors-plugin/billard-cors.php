<?php
/**
 * Plugin Name: Billard CORS Enable
 * Plugin URI: https://billardramirez.cl
 * Description: Habilita CORS para permitir que el frontend acceda a la API de WooCommerce
 * Version: 1.0.0
 * Author: Billard Ramirez
 * License: GPL v2 or later
 */

// Evitar acceso directo
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Agregar headers CORS a todas las respuestas REST API
 */
function billard_cors_headers() {
    // Dominios permitidos
    $allowed_origins = array(
        'https://billardramirez.cl',
        'http://billardramirez.cl',
        'https://www.billardramirez.cl',
        'http://www.billardramirez.cl',
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:4173',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
    );

    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

    // Verificar si el origen está permitido
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        // Permitir el dominio principal por defecto
        header("Access-Control-Allow-Origin: https://billardramirez.cl");
    }

    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-WP-Nonce");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 86400");
}

/**
 * Manejar preflight requests (OPTIONS)
 */
function billard_handle_preflight() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        billard_cors_headers();
        status_header(200);
        exit();
    }
}

// Ejecutar temprano para manejar OPTIONS
add_action('init', 'billard_handle_preflight', 1);

/**
 * Agregar headers CORS a REST API
 */
function billard_rest_cors_headers($response) {
    billard_cors_headers();
    return $response;
}

add_filter('rest_pre_serve_request', function($served, $result, $request, $server) {
    billard_cors_headers();
    return $served;
}, 10, 4);

/**
 * También agregar headers a respuestas normales de REST
 */
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        billard_cors_headers();
        return $value;
    });
}, 15);

/**
 * Permitir credenciales en WooCommerce REST API
 */
add_filter('woocommerce_rest_check_permissions', function($permission, $context, $object_id, $post_type) {
    return $permission;
}, 10, 4);

/**
 * Agregar headers específicos para WooCommerce Store API
 */
add_action('woocommerce_store_api_checkout_update_customer_from_request', function() {
    billard_cors_headers();
});

/**
 * Headers para cualquier request de WooCommerce
 */
add_action('woocommerce_api_loaded', function() {
    billard_cors_headers();
});

<?php
/**
 * Plugin Name: WooCommerce CORS & Auth Fix
 * Description: Habilita CORS y autenticación para la API de WooCommerce
 * Version: 1.1
 * Author: Billard Ramirez
 */

// Prevenir acceso directo
if (!defined('ABSPATH')) {
    exit;
}

// Habilitar CORS para la API REST de WordPress/WooCommerce
add_action('rest_api_init', function() {
    // Remover headers predeterminados que puedan causar conflictos
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');

    // Agregar nuestros propios headers CORS
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, X-WP-Nonce');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');

        // Manejar preflight requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit();
        }

        return $value;
    });
}, 15);

// Deshabilitar completamente la autenticación para WooCommerce API en requests GET
add_filter('woocommerce_rest_check_permissions', function($permission, $context, $object_id, $post_type) {
    // Permitir lectura sin autenticación
    if ($context === 'read') {
        return true;
    }
    return $permission;
}, 10, 4);

// Permitir autenticación básica para la API REST
add_filter('rest_authentication_errors', function($result) {
    // Para requests de WooCommerce, permitir sin autenticación si es GET
    if (strpos($_SERVER['REQUEST_URI'], '/wp-json/wc/') !== false) {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            return true;
        }
    }

    return $result;
}, 5);

// Fix para autenticación básica en algunos servidores
add_filter('determine_current_user', function($user_id) {
    // Si ya tenemos un usuario autenticado, no hacer nada
    if ($user_id) {
        return $user_id;
    }

    // Verificar si hay credenciales en el header Authorization
    $auth_header = null;

    // Diferentes formas de obtener el header de autorización
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $auth_header = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $auth_header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } elseif (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) {
            $auth_header = $headers['Authorization'];
        }
    }

    // Si encontramos el header de autorización
    if ($auth_header && strpos($auth_header, 'Basic ') === 0) {
        $credentials = base64_decode(substr($auth_header, 6));
        list($username, $password) = explode(':', $credentials, 2);

        // Intentar autenticar con las credenciales
        $user = wp_authenticate($username, $password);

        if (!is_wp_error($user)) {
            return $user->ID;
        }
    }

    return $user_id;
}, 20);

// Agregar log para debugging (opcional - comentar en producción)
add_action('rest_api_init', function() {
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('WooCommerce CORS Fix Plugin Loaded');
        error_log('Request Method: ' . $_SERVER['REQUEST_METHOD']);
        error_log('Request URI: ' . $_SERVER['REQUEST_URI']);
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            error_log('Authorization Header Present');
        }
    }
});

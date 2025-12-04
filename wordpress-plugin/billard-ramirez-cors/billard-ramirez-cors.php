<?php
/**
 * Plugin Name: Billard Ramirez CORS Handler
 * Plugin URI: https://billardramirez.cl
 * Description: Habilita CORS para la API de WooCommerce y WordPress REST API
 * Version: 1.0.0
 * Author: Billard Ramirez
 * Author URI: https://billardramirez.cl
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

// Evitar acceso directo
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Clase principal del plugin CORS
 */
class Billard_Ramirez_CORS {

    /**
     * Dominios permitidos
     */
    private $allowed_origins = [
        'https://franciscal46.sg-host.com',
        'https://billardramirez.cl',
        'http://localhost:5173',
        'http://localhost:3000',
    ];

    /**
     * Constructor
     */
    public function __construct() {
        // Agregar headers CORS a todas las peticiones REST API
        add_action('rest_api_init', [$this, 'add_cors_headers']);

        // Manejar peticiones OPTIONS (preflight)
        add_action('init', [$this, 'handle_preflight']);
    }

    /**
     * Agregar headers CORS a las respuestas de la API REST
     */
    public function add_cors_headers() {
        $origin = $this->get_origin();

        if ($this->is_origin_allowed($origin)) {
            remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
            add_filter('rest_pre_serve_request', function($value) use ($origin) {
                header('Access-Control-Allow-Origin: ' . $origin);
                header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
                header('Access-Control-Allow-Credentials: true');
                header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, X-WP-Nonce');
                header('Access-Control-Expose-Headers: X-WP-Total, X-WP-TotalPages');
                header('Access-Control-Max-Age: 86400');
                return $value;
            });
        }
    }

    /**
     * Manejar peticiones OPTIONS (preflight)
     */
    public function handle_preflight() {
        // Solo procesar si es una petición OPTIONS
        if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
            return;
        }

        $origin = $this->get_origin();

        // Verificar si la petición es para la API REST
        $request_uri = $_SERVER['REQUEST_URI'] ?? '';
        if (strpos($request_uri, '/wp-json/') === false) {
            return;
        }

        if ($this->is_origin_allowed($origin)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, X-WP-Nonce');
            header('Access-Control-Expose-Headers: X-WP-Total, X-WP-TotalPages');
            header('Access-Control-Max-Age: 86400');
            header('Content-Length: 0');
            header('Content-Type: text/plain');
            http_response_code(204);
            exit;
        }
    }

    /**
     * Obtener el origen de la petición
     */
    private function get_origin() {
        return $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
    }

    /**
     * Verificar si el origen está permitido
     */
    private function is_origin_allowed($origin) {
        if (empty($origin)) {
            return false;
        }

        // Remover trailing slash para comparación
        $origin = rtrim($origin, '/');

        foreach ($this->allowed_origins as $allowed) {
            $allowed = rtrim($allowed, '/');
            if ($origin === $allowed) {
                return true;
            }
        }

        return false;
    }
}

// Inicializar el plugin
new Billard_Ramirez_CORS();

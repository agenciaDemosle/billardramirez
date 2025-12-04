<?php
/**
 * Plugin Name: Billard Ramirez - Personalización de Tacos
 * Plugin URI: https://billardramirez.cl
 * Description: Gestiona la personalización de tacos con grabado láser y guarda metadata en pedidos de WooCommerce
 * Version: 1.0.0
 * Author: Billard Ramirez
 * Author URI: https://billardramirez.cl
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * WC requires at least: 5.0
 * WC tested up to: 9.4
 */

// Evitar acceso directo
if (!defined('ABSPATH')) {
    exit;
}

// Declarar compatibilidad con HPOS (High-Performance Order Storage) de WooCommerce
add_action('before_woocommerce_init', function() {
    if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
    }
});

/**
 * Clase principal del plugin de personalización
 */
class Billard_Ramirez_Customization {

    /**
     * Opción para guardar el precio del grabado láser
     */
    const OPTION_LASER_PRICE = 'billard_ramirez_laser_engraving_price';

    /**
     * Constructor
     */
    public function __construct() {
        // Hooks de admin
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);

        // Registrar endpoint REST API
        add_action('rest_api_init', [$this, 'register_rest_routes']);

        // Hooks de WooCommerce para metadata
        add_action('woocommerce_add_cart_item_data', [$this, 'add_cart_item_data'], 10, 3);
        add_filter('woocommerce_get_item_data', [$this, 'display_cart_item_data'], 10, 2);
        add_action('woocommerce_checkout_create_order_line_item', [$this, 'save_order_item_meta'], 10, 4);
        add_action('woocommerce_before_calculate_totals', [$this, 'add_custom_price'], 10, 1);
    }

    /**
     * Agregar página de administración
     */
    public function add_admin_menu() {
        add_submenu_page(
            'woocommerce',
            'Personalización de Tacos',
            'Personalización Tacos',
            'manage_woocommerce',
            'billard-customization',
            [$this, 'render_admin_page']
        );
    }

    /**
     * Registrar configuraciones
     */
    public function register_settings() {
        register_setting('billard_customization_settings', self::OPTION_LASER_PRICE, [
            'type' => 'number',
            'default' => 10000,
            'sanitize_callback' => 'absint'
        ]);

        add_settings_section(
            'billard_customization_main',
            'Configuración de Personalización',
            [$this, 'settings_section_callback'],
            'billard-customization'
        );

        add_settings_field(
            'laser_engraving_price',
            'Precio Grabado Láser (CLP)',
            [$this, 'laser_price_field_callback'],
            'billard-customization',
            'billard_customization_main'
        );
    }

    /**
     * Renderizar página de administración
     */
    public function render_admin_page() {
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

            <div class="notice notice-info">
                <p><strong>Instrucciones:</strong> Configure aquí el precio del grabado láser para los tacos. Este valor será utilizado automáticamente por el frontend.</p>
            </div>

            <form method="post" action="options.php">
                <?php
                settings_fields('billard_customization_settings');
                do_settings_sections('billard-customization');
                submit_button('Guardar Configuración');
                ?>
            </form>

            <div class="card" style="max-width: 800px; margin-top: 20px;">
                <h2>Información del Plugin</h2>
                <p>Este plugin gestiona la personalización de tacos con las siguientes características:</p>
                <ul style="list-style-type: disc; margin-left: 20px;">
                    <li>Precio configurable del grabado láser</li>
                    <li>API REST para obtener el precio desde el frontend</li>
                    <li>Guardado automático de metadata en pedidos de WooCommerce</li>
                    <li>Visualización de personalización en carrito y pedidos</li>
                </ul>

                <h3>Endpoint API</h3>
                <p><code>GET <?php echo esc_url(rest_url('billard/v1/customization/laser-price')); ?></code></p>
                <p>Respuesta: <code>{"price": 10000, "formatted": "$10.000"}</code></p>
            </div>
        </div>
        <?php
    }

    /**
     * Callback para sección de configuración
     */
    public function settings_section_callback() {
        echo '<p>Configure los precios y opciones de personalización para los productos.</p>';
    }

    /**
     * Callback para campo de precio del grabado láser
     */
    public function laser_price_field_callback() {
        $value = get_option(self::OPTION_LASER_PRICE, 10000);
        ?>
        <input
            type="number"
            name="<?php echo esc_attr(self::OPTION_LASER_PRICE); ?>"
            value="<?php echo esc_attr($value); ?>"
            min="0"
            step="100"
            class="regular-text"
        />
        <p class="description">Precio en pesos chilenos (CLP) para el servicio de grabado láser en tacos.</p>
        <?php
    }

    /**
     * Registrar rutas REST API
     */
    public function register_rest_routes() {
        register_rest_route('billard/v1', '/customization/laser-price', [
            'methods' => 'GET',
            'callback' => [$this, 'get_laser_price'],
            'permission_callback' => '__return_true'
        ]);

        // Endpoint para formulario de contacto
        register_rest_route('billard/v1', '/contact', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_contact_form'],
            'permission_callback' => '__return_true'
        ]);

        // Endpoint para formulario de cotización
        register_rest_route('billard/v1', '/quote', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_quote_form'],
            'permission_callback' => '__return_true'
        ]);
    }

    /**
     * Manejar formulario de contacto
     */
    public function handle_contact_form($request) {
        $params = $request->get_json_params();

        // Validar campos requeridos
        $required = ['name', 'email', 'phone', 'subject', 'message'];
        foreach ($required as $field) {
            if (empty($params[$field])) {
                return new WP_Error('missing_field', "Campo requerido: {$field}", ['status' => 400]);
            }
        }

        // Validar email
        if (!is_email($params['email'])) {
            return new WP_Error('invalid_email', 'Email inválido', ['status' => 400]);
        }

        // Sanitizar datos
        $name = sanitize_text_field($params['name']);
        $email = sanitize_email($params['email']);
        $phone = sanitize_text_field($params['phone']);
        $subject = sanitize_text_field($params['subject']);
        $message = sanitize_textarea_field($params['message']);

        $business_email = 'contacto@billardramirez.cl';

        // Email al negocio
        $business_subject = "Nuevo mensaje de contacto: {$subject}";
        $business_body = $this->get_contact_business_email($name, $email, $phone, $subject, $message);
        $business_headers = [
            'Content-Type: text/html; charset=UTF-8',
            "From: Billard Ramírez <noreply@billardramirez.cl>",
            "Reply-To: {$name} <{$email}>"
        ];

        $sent_business = wp_mail($business_email, $business_subject, $business_body, $business_headers);

        // Email de confirmación al cliente
        $client_subject = "Hemos recibido tu mensaje - Billard Ramírez";
        $client_body = $this->get_contact_client_email($name, $subject);
        $client_headers = [
            'Content-Type: text/html; charset=UTF-8',
            "From: Billard Ramírez <noreply@billardramirez.cl>",
            "Reply-To: {$business_email}"
        ];

        wp_mail($email, $client_subject, $client_body, $client_headers);

        if ($sent_business) {
            return ['success' => true, 'message' => 'Mensaje enviado correctamente'];
        } else {
            return new WP_Error('send_failed', 'Error al enviar el mensaje', ['status' => 500]);
        }
    }

    /**
     * Manejar formulario de cotización
     */
    public function handle_quote_form($request) {
        $params = $request->get_json_params();

        // Validar campos requeridos
        $required = ['name', 'email', 'phone', 'deliveryAddress', 'tableSize', 'tableType', 'installationNeeded'];
        foreach ($required as $field) {
            if (empty($params[$field])) {
                return new WP_Error('missing_field', "Campo requerido: {$field}", ['status' => 400]);
            }
        }

        // Validar email
        if (!is_email($params['email'])) {
            return new WP_Error('invalid_email', 'Email inválido', ['status' => 400]);
        }

        // Sanitizar datos
        $name = sanitize_text_field($params['name']);
        $email = sanitize_email($params['email']);
        $phone = sanitize_text_field($params['phone']);
        $address = sanitize_text_field($params['deliveryAddress']);
        $tableSize = sanitize_text_field($params['tableSize']);
        $tableType = sanitize_text_field($params['tableType']);
        $installation = sanitize_text_field($params['installationNeeded']);
        $budget = isset($params['budget']) ? sanitize_text_field($params['budget']) : '';
        $comments = isset($params['comments']) ? sanitize_textarea_field($params['comments']) : '';

        // Mapear valores
        $tableSizeLabels = [
            '7ft' => '7 pies (2.13m)',
            '8ft' => '8 pies (2.44m)',
            '9ft' => '9 pies (2.74m)',
            '12ft' => '12 pies (3.66m)'
        ];
        $tableTypeLabels = [
            'recreativa' => 'Mesa Recreativa',
            'semi-profesional' => 'Mesa Semi-Profesional',
            'profesional' => 'Mesa Profesional',
            'comercial' => 'Mesa Comercial'
        ];
        $installationLabels = [
            'si' => 'Sí, necesita instalación',
            'no' => 'No necesita instalación',
            'consultar' => 'Requiere asesoría'
        ];
        $budgetLabels = [
            '500-1000' => '$500.000 - $1.000.000',
            '1000-2000' => '$1.000.000 - $2.000.000',
            '2000-3000' => '$2.000.000 - $3.000.000',
            '3000+' => 'Más de $3.000.000'
        ];

        $tableSizeDisplay = $tableSizeLabels[$tableSize] ?? $tableSize;
        $tableTypeDisplay = $tableTypeLabels[$tableType] ?? $tableType;
        $installationDisplay = $installationLabels[$installation] ?? $installation;
        $budgetDisplay = isset($budgetLabels[$budget]) ? $budgetLabels[$budget] : 'No especificado';

        $business_email = 'contacto@billardramirez.cl';

        // Email al negocio
        $business_subject = "Nueva solicitud de cotización - {$tableTypeDisplay} {$tableSizeDisplay}";
        $business_body = $this->get_quote_business_email($name, $email, $phone, $address, $tableSizeDisplay, $tableTypeDisplay, $installationDisplay, $budgetDisplay, $comments);
        $business_headers = [
            'Content-Type: text/html; charset=UTF-8',
            "From: Billard Ramírez <noreply@billardramirez.cl>",
            "Reply-To: {$name} <{$email}>"
        ];

        $sent_business = wp_mail($business_email, $business_subject, $business_body, $business_headers);

        // Email de confirmación al cliente
        $client_subject = "Hemos recibido tu solicitud de cotización - Billard Ramírez";
        $client_body = $this->get_quote_client_email($name, $tableSizeDisplay, $tableTypeDisplay, $installationDisplay);
        $client_headers = [
            'Content-Type: text/html; charset=UTF-8',
            "From: Billard Ramírez <noreply@billardramirez.cl>",
            "Reply-To: {$business_email}"
        ];

        wp_mail($email, $client_subject, $client_body, $client_headers);

        if ($sent_business) {
            return ['success' => true, 'message' => 'Cotización enviada correctamente'];
        } else {
            return new WP_Error('send_failed', 'Error al enviar la cotización', ['status' => 500]);
        }
    }

    /**
     * Plantilla email contacto para negocio
     */
    private function get_contact_business_email($name, $email, $phone, $subject, $message) {
        $date = date('d/m/Y H:i');
        $message_formatted = nl2br(esc_html($message));

        return <<<HTML
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:'Lato',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f5f5f5;line-height:1.6;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
<tr><td style="background-color:#000000;padding:40px 30px;text-align:center;">
<h1 style="margin:0;color:#ffffff;font-family:'Cormorant',Georgia,serif;font-size:32px;font-weight:400;letter-spacing:4px;">BILLARD RAMÍREZ</h1>
<p style="margin:12px 0 0;color:#b0a171;font-size:12px;letter-spacing:3px;text-transform:uppercase;">Desde 1986</p>
</td></tr>
<tr><td style="padding:40px 30px 20px;border-bottom:1px solid #e1e1e1;">
<h2 style="margin:0;color:#000000;font-family:'Cormorant',Georgia,serif;font-size:24px;font-weight:400;">Nuevo mensaje de contacto</h2>
<p style="margin:10px 0 0;color:#666666;font-size:14px;">Recibido el {$date}</p>
</td></tr>
<tr><td style="padding:30px;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:15px 0;border-bottom:1px solid #e1e1e1;">
<p style="margin:0 0 5px;color:#999999;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Nombre</p>
<p style="margin:0;color:#000000;font-size:16px;font-weight:600;">{$name}</p>
</td></tr>
<tr><td style="padding:15px 0;border-bottom:1px solid #e1e1e1;">
<p style="margin:0 0 5px;color:#999999;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Email</p>
<p style="margin:0;"><a href="mailto:{$email}" style="color:#b0a171;font-size:16px;text-decoration:none;">{$email}</a></p>
</td></tr>
<tr><td style="padding:15px 0;border-bottom:1px solid #e1e1e1;">
<p style="margin:0 0 5px;color:#999999;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Teléfono</p>
<p style="margin:0;"><a href="tel:{$phone}" style="color:#b0a171;font-size:16px;text-decoration:none;">{$phone}</a></p>
</td></tr>
<tr><td style="padding:15px 0;border-bottom:1px solid #e1e1e1;">
<p style="margin:0 0 5px;color:#999999;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Asunto</p>
<p style="margin:0;color:#000000;font-size:16px;font-weight:600;">{$subject}</p>
</td></tr>
</table>
</td></tr>
<tr><td style="padding:0 30px 30px;">
<div style="background-color:#f9f9f9;border-left:3px solid #b0a171;padding:20px;border-radius:0 4px 4px 0;">
<p style="margin:0 0 10px;color:#999999;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Mensaje</p>
<p style="margin:0;color:#333333;font-size:15px;line-height:1.8;">{$message_formatted}</p>
</div>
</td></tr>
<tr><td style="padding:0 30px 40px;text-align:center;">
<a href="mailto:{$email}?subject=Re: {$subject}" style="display:inline-block;background-color:#000000;color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:4px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:2px;">Responder</a>
</td></tr>
<tr><td style="background-color:#f9f9f9;padding:25px 30px;text-align:center;border-top:1px solid #e1e1e1;">
<p style="margin:0;color:#999999;font-size:12px;">Este mensaje fue enviado desde el formulario de contacto de billardramirez.cl</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
HTML;
    }

    /**
     * Plantilla email contacto para cliente
     */
    private function get_contact_client_email($name, $subject) {
        return <<<HTML
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:'Lato',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f5f5f5;line-height:1.6;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
<tr><td style="background-color:#000000;padding:40px 30px;text-align:center;">
<h1 style="margin:0;color:#ffffff;font-family:'Cormorant',Georgia,serif;font-size:32px;font-weight:400;letter-spacing:4px;">BILLARD RAMÍREZ</h1>
<p style="margin:12px 0 0;color:#b0a171;font-size:12px;letter-spacing:3px;text-transform:uppercase;">Desde 1986</p>
</td></tr>
<tr><td style="padding:50px 30px 30px;text-align:center;">
<div style="width:80px;height:80px;background-color:#000000;border-radius:50%;margin:0 auto 25px;line-height:80px;">
<span style="color:#b0a171;font-size:36px;">✓</span>
</div>
<h2 style="margin:0 0 15px;color:#000000;font-family:'Cormorant',Georgia,serif;font-size:28px;font-weight:400;">Mensaje Recibido</h2>
<p style="margin:0;color:#666666;font-size:16px;max-width:400px;margin:0 auto;">
Hola <strong style="color:#000000;">{$name}</strong>, hemos recibido tu mensaje correctamente.
</p>
</td></tr>
<tr><td style="padding:0 30px 30px;">
<div style="background-color:#f9f9f9;border-radius:4px;padding:25px;text-align:center;">
<p style="margin:0 0 8px;color:#999999;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Asunto de tu consulta</p>
<p style="margin:0;color:#000000;font-size:18px;font-weight:600;">{$subject}</p>
</div>
</td></tr>
<tr><td style="padding:0 30px 40px;text-align:center;">
<p style="margin:0 0 25px;color:#666666;font-size:15px;line-height:1.8;">
Nuestro equipo revisará tu mensaje y te responderemos a la brevedad posible.<br>
El tiempo de respuesta habitual es de <strong style="color:#000000;">24 a 48 horas hábiles</strong>.
</p>
<div style="border-top:1px solid #e1e1e1;padding-top:25px;margin-top:10px;">
<p style="margin:0 0 15px;color:#999999;font-size:12px;text-transform:uppercase;letter-spacing:1px;">¿Necesitas atención inmediata?</p>
<a href="https://wa.me/56965839601" style="display:inline-block;background-color:#000000;color:#ffffff;text-decoration:none;padding:14px 35px;border-radius:4px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:2px;margin-right:10px;">WhatsApp</a>
<a href="tel:+56965839601" style="display:inline-block;background-color:#ffffff;color:#000000;text-decoration:none;padding:14px 35px;border-radius:4px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:2px;border:1px solid #000000;">Llamar</a>
</div>
</td></tr>
<tr><td style="background-color:#000000;padding:35px 30px;text-align:center;">
<p style="margin:0 0 15px;color:#ffffff;font-size:14px;font-weight:600;letter-spacing:1px;">Billard Ramírez</p>
<p style="margin:0 0 5px;color:#888888;font-size:13px;">Especialistas en mesas de pool desde 1986</p>
<p style="margin:20px 0 0;">
<a href="https://billardramirez.cl" style="color:#b0a171;font-size:13px;text-decoration:none;">billardramirez.cl</a>
<span style="color:#444444;margin:0 10px;">|</span>
<a href="mailto:contacto@billardramirez.cl" style="color:#b0a171;font-size:13px;text-decoration:none;">contacto@billardramirez.cl</a>
</p>
<p style="margin:15px 0 0;color:#666666;font-size:11px;">+56 9 6583 9601 · Maximiliano Ibáñez 1436, Quinta Normal</p>
</td></tr>
</table>
<p style="margin:20px 0 0;color:#999999;font-size:11px;text-align:center;">Este es un correo automático. Por favor no respondas directamente a este mensaje.</p>
</td></tr>
</table>
</body>
</html>
HTML;
    }

    /**
     * Plantilla email cotización para negocio
     */
    private function get_quote_business_email($name, $email, $phone, $address, $tableSize, $tableType, $installation, $budget, $comments) {
        $date = date('d/m/Y H:i');
        $comments_formatted = $comments ? nl2br(esc_html($comments)) : '<em style="color:#999;">Sin comentarios adicionales</em>';

        return <<<HTML
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:'Lato',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f5f5f5;line-height:1.6;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
<tr><td style="background-color:#000000;padding:40px 30px;text-align:center;">
<h1 style="margin:0;color:#ffffff;font-family:'Cormorant',Georgia,serif;font-size:32px;font-weight:400;letter-spacing:4px;">BILLARD RAMÍREZ</h1>
<p style="margin:12px 0 0;color:#b0a171;font-size:12px;letter-spacing:3px;text-transform:uppercase;">Desde 1986</p>
</td></tr>
<tr><td style="padding:40px 30px 20px;border-bottom:1px solid #e1e1e1;">
<h2 style="margin:0;color:#000000;font-family:'Cormorant',Georgia,serif;font-size:24px;font-weight:400;">Nueva Solicitud de Cotización</h2>
<p style="margin:10px 0 0;color:#666666;font-size:14px;">Recibida el {$date}</p>
</td></tr>
<tr><td style="padding:30px;">
<h3 style="margin:0 0 20px;color:#b0a171;font-size:12px;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #e1e1e1;padding-bottom:10px;">Datos del Cliente</h3>
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
<span style="color:#999999;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Nombre</span><br>
<span style="color:#000000;font-size:16px;font-weight:600;">{$name}</span>
</td></tr>
<tr><td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
<span style="color:#999999;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Email</span><br>
<a href="mailto:{$email}" style="color:#b0a171;font-size:16px;text-decoration:none;">{$email}</a>
</td></tr>
<tr><td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
<span style="color:#999999;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Teléfono</span><br>
<a href="tel:{$phone}" style="color:#b0a171;font-size:16px;text-decoration:none;">{$phone}</a>
</td></tr>
<tr><td style="padding:12px 0;">
<span style="color:#999999;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Dirección de Entrega</span><br>
<span style="color:#000000;font-size:16px;">{$address}</span>
</td></tr>
</table>
</td></tr>
<tr><td style="padding:0 30px 30px;">
<h3 style="margin:0 0 20px;color:#b0a171;font-size:12px;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #e1e1e1;padding-bottom:10px;">Mesa Solicitada</h3>
<div style="background-color:#f9f9f9;border-left:3px solid #b0a171;padding:20px;border-radius:0 4px 4px 0;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td width="50%" style="padding:8px 0;">
<span style="color:#999999;font-size:11px;text-transform:uppercase;">Tipo</span><br>
<strong style="color:#000000;font-size:15px;">{$tableType}</strong>
</td>
<td width="50%" style="padding:8px 0;">
<span style="color:#999999;font-size:11px;text-transform:uppercase;">Tamaño</span><br>
<strong style="color:#000000;font-size:15px;">{$tableSize}</strong>
</td>
</tr>
<tr>
<td width="50%" style="padding:8px 0;">
<span style="color:#999999;font-size:11px;text-transform:uppercase;">Instalación</span><br>
<strong style="color:#000000;font-size:15px;">{$installation}</strong>
</td>
<td width="50%" style="padding:8px 0;">
<span style="color:#999999;font-size:11px;text-transform:uppercase;">Presupuesto</span><br>
<strong style="color:#000000;font-size:15px;">{$budget}</strong>
</td>
</tr>
</table>
</div>
</td></tr>
<tr><td style="padding:0 30px 30px;">
<h3 style="margin:0 0 15px;color:#b0a171;font-size:12px;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #e1e1e1;padding-bottom:10px;">Comentarios</h3>
<p style="margin:0;color:#333333;font-size:15px;line-height:1.8;">{$comments_formatted}</p>
</td></tr>
<tr><td style="padding:0 30px 40px;text-align:center;">
<a href="mailto:{$email}?subject=Cotización Mesa de Pool - Billard Ramírez" style="display:inline-block;background-color:#000000;color:#ffffff;text-decoration:none;padding:14px 30px;border-radius:4px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:2px;margin-right:10px;">Responder</a>
<a href="tel:{$phone}" style="display:inline-block;background-color:#b0a171;color:#ffffff;text-decoration:none;padding:14px 30px;border-radius:4px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:2px;">Llamar</a>
</td></tr>
<tr><td style="background-color:#f9f9f9;padding:25px 30px;text-align:center;border-top:1px solid #e1e1e1;">
<p style="margin:0;color:#999999;font-size:12px;">Este mensaje fue enviado desde el formulario de cotización de billardramirez.cl</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
HTML;
    }

    /**
     * Plantilla email cotización para cliente
     */
    private function get_quote_client_email($name, $tableSize, $tableType, $installation) {
        return <<<HTML
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:'Lato',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f5f5f5;line-height:1.6;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
<tr><td style="background-color:#000000;padding:40px 30px;text-align:center;">
<h1 style="margin:0;color:#ffffff;font-family:'Cormorant',Georgia,serif;font-size:32px;font-weight:400;letter-spacing:4px;">BILLARD RAMÍREZ</h1>
<p style="margin:12px 0 0;color:#b0a171;font-size:12px;letter-spacing:3px;text-transform:uppercase;">Desde 1986</p>
</td></tr>
<tr><td style="padding:50px 30px 30px;text-align:center;">
<div style="width:80px;height:80px;background-color:#000000;border-radius:50%;margin:0 auto 25px;line-height:80px;">
<span style="color:#b0a171;font-size:36px;">✓</span>
</div>
<h2 style="margin:0 0 15px;color:#000000;font-family:'Cormorant',Georgia,serif;font-size:28px;font-weight:400;">Cotización Recibida</h2>
<p style="margin:0;color:#666666;font-size:16px;max-width:400px;margin:0 auto;">
Hola <strong style="color:#000000;">{$name}</strong>, hemos recibido tu solicitud de cotización.
</p>
</td></tr>
<tr><td style="padding:0 30px 30px;">
<div style="background-color:#f9f9f9;border-radius:4px;padding:25px;">
<p style="margin:0 0 15px;color:#b0a171;font-size:12px;text-transform:uppercase;letter-spacing:2px;text-align:center;">Resumen de tu solicitud</p>
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:10px 0;border-bottom:1px solid #e1e1e1;">
<span style="color:#999999;font-size:12px;">Tipo de mesa</span><br>
<strong style="color:#000000;">{$tableType}</strong>
</td></tr>
<tr><td style="padding:10px 0;border-bottom:1px solid #e1e1e1;">
<span style="color:#999999;font-size:12px;">Tamaño</span><br>
<strong style="color:#000000;">{$tableSize}</strong>
</td></tr>
<tr><td style="padding:10px 0;">
<span style="color:#999999;font-size:12px;">Instalación</span><br>
<strong style="color:#000000;">{$installation}</strong>
</td></tr>
</table>
</div>
</td></tr>
<tr><td style="padding:0 30px 40px;">
<h3 style="margin:0 0 20px;color:#000000;font-family:'Cormorant',Georgia,serif;font-size:20px;font-weight:400;text-align:center;">¿Qué sigue?</h3>
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:12px 0;">
<table cellpadding="0" cellspacing="0"><tr>
<td style="width:40px;vertical-align:top;">
<div style="width:28px;height:28px;background-color:#000000;color:#b0a171;border-radius:50%;text-align:center;line-height:28px;font-weight:600;font-size:13px;">1</div>
</td>
<td style="color:#666666;font-size:14px;vertical-align:middle;">Nuestro equipo revisará tu solicitud</td>
</tr></table>
</td></tr>
<tr><td style="padding:12px 0;">
<table cellpadding="0" cellspacing="0"><tr>
<td style="width:40px;vertical-align:top;">
<div style="width:28px;height:28px;background-color:#000000;color:#b0a171;border-radius:50%;text-align:center;line-height:28px;font-weight:600;font-size:13px;">2</div>
</td>
<td style="color:#666666;font-size:14px;vertical-align:middle;">Prepararemos una cotización personalizada</td>
</tr></table>
</td></tr>
<tr><td style="padding:12px 0;">
<table cellpadding="0" cellspacing="0"><tr>
<td style="width:40px;vertical-align:top;">
<div style="width:28px;height:28px;background-color:#000000;color:#b0a171;border-radius:50%;text-align:center;line-height:28px;font-weight:600;font-size:13px;">3</div>
</td>
<td style="color:#666666;font-size:14px;vertical-align:middle;">Te contactaremos en <strong style="color:#000;">24-48 horas hábiles</strong></td>
</tr></table>
</td></tr>
</table>
</td></tr>
<tr><td style="padding:0 30px 40px;text-align:center;">
<div style="border-top:1px solid #e1e1e1;padding-top:30px;">
<p style="margin:0 0 20px;color:#999999;font-size:12px;text-transform:uppercase;letter-spacing:1px;">¿Necesitas atención inmediata?</p>
<a href="https://wa.me/56965839601" style="display:inline-block;background-color:#000000;color:#ffffff;text-decoration:none;padding:14px 35px;border-radius:4px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:2px;margin-right:10px;">WhatsApp</a>
<a href="tel:+56965839601" style="display:inline-block;background-color:#ffffff;color:#000000;text-decoration:none;padding:14px 35px;border-radius:4px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:2px;border:1px solid #000000;">Llamar</a>
</div>
</td></tr>
<tr><td style="background-color:#000000;padding:35px 30px;text-align:center;">
<p style="margin:0 0 15px;color:#ffffff;font-size:14px;font-weight:600;letter-spacing:1px;">Billard Ramírez</p>
<p style="margin:0 0 5px;color:#888888;font-size:13px;">Especialistas en mesas de pool desde 1986</p>
<p style="margin:20px 0 0;">
<a href="https://billardramirez.cl" style="color:#b0a171;font-size:13px;text-decoration:none;">billardramirez.cl</a>
<span style="color:#444444;margin:0 10px;">|</span>
<a href="mailto:contacto@billardramirez.cl" style="color:#b0a171;font-size:13px;text-decoration:none;">contacto@billardramirez.cl</a>
</p>
<p style="margin:15px 0 0;color:#666666;font-size:11px;">+56 9 6583 9601 · Maximiliano Ibáñez 1436, Quinta Normal</p>
</td></tr>
</table>
<p style="margin:20px 0 0;color:#999999;font-size:11px;text-align:center;">Este es un correo automático. Por favor no respondas directamente a este mensaje.</p>
</td></tr>
</table>
</body>
</html>
HTML;
    }

    /**
     * Obtener precio del grabado láser via API
     */
    public function get_laser_price() {
        $price = get_option(self::OPTION_LASER_PRICE, 10000);

        return [
            'price' => intval($price),
            'formatted' => '$' . number_format($price, 0, ',', '.')
        ];
    }

    /**
     * Agregar datos personalizados al item del carrito
     */
    public function add_cart_item_data($cart_item_data, $product_id, $variation_id) {
        // Verificar si hay datos de personalización en la petición
        if (isset($_POST['customization'])) {
            $customization = json_decode(stripslashes($_POST['customization']), true);

            if (isset($customization['laserEngraving']) && $customization['laserEngraving']['enabled']) {
                $cart_item_data['laser_engraving'] = [
                    'text' => sanitize_text_field($customization['laserEngraving']['text']),
                    'price' => intval($customization['laserEngraving']['price'])
                ];

                // Hacer el item único para que no se agrupe con otros
                $cart_item_data['unique_key'] = md5(microtime() . rand());
            }
        }

        return $cart_item_data;
    }

    /**
     * Mostrar datos personalizados en el carrito
     */
    public function display_cart_item_data($item_data, $cart_item) {
        if (isset($cart_item['laser_engraving'])) {
            $item_data[] = [
                'key' => 'Grabado Láser',
                'value' => '"' . esc_html($cart_item['laser_engraving']['text']) . '" (+$' . number_format($cart_item['laser_engraving']['price'], 0, ',', '.') . ')',
                'display' => ''
            ];
        }

        return $item_data;
    }

    /**
     * Agregar precio personalizado al producto en el carrito
     */
    public function add_custom_price($cart) {
        if (is_admin() && !defined('DOING_AJAX')) {
            return;
        }

        foreach ($cart->get_cart() as $cart_item_key => $cart_item) {
            if (isset($cart_item['laser_engraving'])) {
                $product = $cart_item['data'];
                $original_price = floatval($product->get_price());
                $laser_price = floatval($cart_item['laser_engraving']['price']);
                $new_price = $original_price + $laser_price;

                $product->set_price($new_price);
            }
        }
    }

    /**
     * Guardar metadata personalizada en el item del pedido
     */
    public function save_order_item_meta($item, $cart_item_key, $values, $order) {
        if (isset($values['laser_engraving'])) {
            $item->add_meta_data('Grabado Láser', $values['laser_engraving']['text'], true);
            $item->add_meta_data('_laser_engraving_text', $values['laser_engraving']['text'], false);
            $item->add_meta_data('_laser_engraving_price', $values['laser_engraving']['price'], false);
        }
    }
}

// Inicializar el plugin
function billard_ramirez_customization_init() {
    // Verificar que WooCommerce esté activo
    if (class_exists('WooCommerce')) {
        new Billard_Ramirez_Customization();
    } else {
        add_action('admin_notices', function() {
            ?>
            <div class="notice notice-error">
                <p><strong>Billard Ramirez Personalización:</strong> Este plugin requiere que WooCommerce esté instalado y activado.</p>
            </div>
            <?php
        });
    }
}

add_action('plugins_loaded', 'billard_ramirez_customization_init');

<?php
/**
 * Envío de emails de confirmación de pedido
 * Billard Ramírez
 */

/**
 * Envía email de confirmación de pedido al cliente
 */
function send_order_confirmation_email($transaction_data) {
    $customer = $transaction_data['customer'] ?? [];
    $items = $transaction_data['items'] ?? [];
    $totals = $transaction_data['totals'] ?? [];

    $to = $customer['email'] ?? null;

    if (!$to) {
        paiku_log('Email: No hay email del cliente', $transaction_data);
        return false;
    }

    $customer_name = trim(($customer['firstName'] ?? '') . ' ' . ($customer['lastName'] ?? ''));
    $order_id = $transaction_data['order_id'] ?? 'N/A';
    $woo_order_id = $transaction_data['woocommerce_order_id'] ?? $order_id;

    $subject = "Confirmación de tu pedido #{$woo_order_id} - Billard Ramírez";

    // Construir HTML del email
    $html = get_order_email_template($transaction_data, $customer_name, $woo_order_id);

    // Headers para email HTML
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: Billard Ramírez <ventas@billardramirez.cl>',
        'Reply-To: ventas@billardramirez.cl',
        'X-Mailer: PHP/' . phpversion()
    ];

    $result = mail($to, $subject, $html, implode("\r\n", $headers));

    paiku_log('Email enviado', [
        'to' => $to,
        'subject' => $subject,
        'result' => $result ? 'success' : 'failed'
    ]);

    // También enviar copia al negocio
    $business_email = 'contacto@billardramirez.cl';
    $business_subject = "Nuevo pedido #{$woo_order_id} - {$customer_name}";
    mail($business_email, $business_subject, $html, implode("\r\n", $headers));

    return $result;
}

/**
 * Genera la plantilla HTML del email
 */
function get_order_email_template($transaction_data, $customer_name, $order_id) {
    $customer = $transaction_data['customer'] ?? [];
    $items = $transaction_data['items'] ?? [];
    $totals = $transaction_data['totals'] ?? [];

    $subtotal = number_format($totals['subtotal'] ?? 0, 0, ',', '.');
    $shipping = number_format($totals['shipping'] ?? 0, 0, ',', '.');
    $total = number_format($totals['total'] ?? 0, 0, ',', '.');

    // Construir filas de productos
    $items_html = '';
    foreach ($items as $item) {
        $item_total = number_format(($item['price'] ?? 0) * ($item['quantity'] ?? 1), 0, ',', '.');
        $item_price = number_format($item['price'] ?? 0, 0, ',', '.');
        $items_html .= "
        <tr>
            <td style='padding: 15px; border-bottom: 1px solid #e5e7eb;'>
                <div style='display: flex; align-items: center;'>
                    <div>
                        <p style='margin: 0; font-weight: 600; color: #1f2937;'>{$item['name']}</p>
                        <p style='margin: 5px 0 0; font-size: 14px; color: #6b7280;'>Cantidad: {$item['quantity']}</p>
                    </div>
                </div>
            </td>
            <td style='padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; color: #1f2937;'>
                \${$item_total}
            </td>
        </tr>";
    }

    $address = $customer['address'] ?? '';
    $city = $customer['city'] ?? '';
    $region = $customer['region'] ?? '';
    $phone = $customer['phone'] ?? '';

    $html = <<<HTML
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Pedido</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">BILLARD RAMÍREZ</h1>
                            <p style="margin: 10px 0 0; color: #c9a227; font-size: 14px; letter-spacing: 2px;">DESDE 1986</p>
                        </td>
                    </tr>

                    <!-- Confirmación -->
                    <tr>
                        <td style="padding: 40px 30px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                            <div style="width: 80px; height: 80px; background-color: #10b981; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                                <span style="color: #ffffff; font-size: 40px;">✓</span>
                            </div>
                            <h2 style="margin: 0 0 10px; color: #1f2937; font-size: 24px;">¡Gracias por tu compra!</h2>
                            <p style="margin: 0; color: #6b7280; font-size: 16px;">Hola {$customer_name}, hemos recibido tu pedido correctamente.</p>
                        </td>
                    </tr>

                    <!-- Número de orden -->
                    <tr>
                        <td style="padding: 30px; background-color: #f9fafb; text-align: center;">
                            <p style="margin: 0 0 5px; color: #6b7280; font-size: 14px;">Número de pedido</p>
                            <p style="margin: 0; color: #1e3a5f; font-size: 28px; font-weight: 700;">#{$order_id}</p>
                        </td>
                    </tr>

                    <!-- Productos -->
                    <tr>
                        <td style="padding: 30px;">
                            <h3 style="margin: 0 0 20px; color: #1f2937; font-size: 18px; font-weight: 600;">Resumen del pedido</h3>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                {$items_html}
                            </table>

                            <!-- Totales -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                                <tr>
                                    <td style="padding: 10px 0; color: #6b7280;">Subtotal</td>
                                    <td style="padding: 10px 0; text-align: right; color: #1f2937;">\${$subtotal}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #6b7280;">Envío</td>
                                    <td style="padding: 10px 0; text-align: right; color: #1f2937;">\${$shipping}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 0; color: #1f2937; font-size: 18px; font-weight: 700; border-top: 2px solid #e5e7eb;">Total</td>
                                    <td style="padding: 15px 0; text-align: right; color: #1e3a5f; font-size: 18px; font-weight: 700; border-top: 2px solid #e5e7eb;">\${$total}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Dirección de envío -->
                    <tr>
                        <td style="padding: 30px; background-color: #f9fafb;">
                            <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 18px; font-weight: 600;">Dirección de envío</h3>
                            <p style="margin: 0; color: #6b7280; line-height: 1.6;">
                                {$customer_name}<br>
                                {$address}<br>
                                {$city}, {$region}<br>
                                Tel: {$phone}
                            </p>
                        </td>
                    </tr>

                    <!-- Próximos pasos -->
                    <tr>
                        <td style="padding: 30px;">
                            <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 18px; font-weight: 600;">¿Qué sigue?</h3>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 10px 0;">
                                        <span style="display: inline-block; width: 30px; height: 30px; background-color: #1e3a5f; color: #ffffff; border-radius: 50%; text-align: center; line-height: 30px; font-weight: 600; margin-right: 15px;">1</span>
                                        <span style="color: #6b7280;">Estamos preparando tu pedido</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;">
                                        <span style="display: inline-block; width: 30px; height: 30px; background-color: #1e3a5f; color: #ffffff; border-radius: 50%; text-align: center; line-height: 30px; font-weight: 600; margin-right: 15px;">2</span>
                                        <span style="color: #6b7280;">Te notificaremos cuando sea despachado</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;">
                                        <span style="display: inline-block; width: 30px; height: 30px; background-color: #1e3a5f; color: #ffffff; border-radius: 50%; text-align: center; line-height: 30px; font-weight: 600; margin-right: 15px;">3</span>
                                        <span style="color: #6b7280;">Recibirás tu pedido en 2-5 días hábiles</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- CTA -->
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <a href="https://billardramirez.cl/tienda" style="display: inline-block; background-color: #c9a227; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">Seguir comprando</a>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #1e3a5f; padding: 30px; text-align: center;">
                            <p style="margin: 0 0 10px; color: #ffffff; font-weight: 600;">Billard Ramírez</p>
                            <p style="margin: 0 0 5px; color: #94a3b8; font-size: 14px;">Especialistas en mesas de pool desde 1986</p>
                            <p style="margin: 15px 0 0; color: #94a3b8; font-size: 14px;">
                                <a href="https://wa.me/56962548541" style="color: #c9a227; text-decoration: none;">WhatsApp: +56 9 6254 8541</a>
                            </p>
                            <p style="margin: 5px 0 0; color: #94a3b8; font-size: 14px;">
                                <a href="mailto:ventas@billardramirez.cl" style="color: #c9a227; text-decoration: none;">ventas@billardramirez.cl</a>
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;

    return $html;
}

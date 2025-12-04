<?php
/**
 * BILLARD RAMÍREZ - Contact Form Handler
 */

// Cargar WordPress para usar wp_mail()
$wp_load_paths = [
    dirname(dirname(dirname(dirname(__FILE__)))) . '/demosle/wp-load.php',
    dirname(dirname(dirname(dirname(__FILE__)))) . '/wp-load.php',
    '/home/u123456789/domains/billardramirez.cl/public_html/demosle/wp-load.php',
];

$wp_loaded = false;
foreach ($wp_load_paths as $path) {
    if (file_exists($path)) {
        require_once($path);
        $wp_loaded = true;
        break;
    }
}

// Headers CORS
header('Access-Control-Allow-Origin: https://billardramirez.cl');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Datos inválidos']);
    exit;
}

$required = ['name', 'email', 'phone', 'subject', 'message'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "Campo requerido: {$field}"]);
        exit;
    }
}

if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email inválido']);
    exit;
}

$name = htmlspecialchars(trim($data['name']), ENT_QUOTES, 'UTF-8');
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars(trim($data['phone']), ENT_QUOTES, 'UTF-8');
$subject = htmlspecialchars(trim($data['subject']), ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars(trim($data['message']), ENT_QUOTES, 'UTF-8');

$to = 'contacto@billardramirez.cl';
$email_subject = "Contacto Web: {$subject}";
$date = date('d/m/Y H:i');
$message_formatted = nl2br($message);

// Color verde
$green = '#22c55e';

// Email para el negocio
$email_body = <<<HTML
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f5f5f5;line-height:1.6;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
<tr><td style="background-color:#000000;padding:40px 30px;text-align:center;">
<h1 style="margin:0;color:#ffffff;font-family:Georgia,serif;font-size:28px;font-weight:400;letter-spacing:3px;">BILLARD RAMÍREZ</h1>
<p style="margin:12px 0 0;color:{$green};font-size:11px;letter-spacing:2px;text-transform:uppercase;">Mesas de pool, accesorios y más</p>
</td></tr>
<tr><td style="padding:40px 30px 20px;border-bottom:1px solid #e1e1e1;">
<h2 style="margin:0;color:#000000;font-size:22px;font-weight:600;">Nuevo mensaje de contacto</h2>
<p style="margin:10px 0 0;color:#666666;font-size:14px;">Recibido el {$date}</p>
</td></tr>
<tr><td style="padding:30px;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:15px 0;border-bottom:1px solid #e1e1e1;">
<p style="margin:0 0 5px;color:#999999;font-size:12px;text-transform:uppercase;">Nombre</p>
<p style="margin:0;color:#000000;font-size:16px;font-weight:600;">{$name}</p>
</td></tr>
<tr><td style="padding:15px 0;border-bottom:1px solid #e1e1e1;">
<p style="margin:0 0 5px;color:#999999;font-size:12px;text-transform:uppercase;">Email</p>
<p style="margin:0;"><a href="mailto:{$email}" style="color:{$green};font-size:16px;text-decoration:none;">{$email}</a></p>
</td></tr>
<tr><td style="padding:15px 0;border-bottom:1px solid #e1e1e1;">
<p style="margin:0 0 5px;color:#999999;font-size:12px;text-transform:uppercase;">Teléfono</p>
<p style="margin:0;"><a href="tel:{$phone}" style="color:{$green};font-size:16px;text-decoration:none;">{$phone}</a></p>
</td></tr>
<tr><td style="padding:15px 0;border-bottom:1px solid #e1e1e1;">
<p style="margin:0 0 5px;color:#999999;font-size:12px;text-transform:uppercase;">Asunto</p>
<p style="margin:0;color:#000000;font-size:16px;font-weight:600;">{$subject}</p>
</td></tr>
</table>
</td></tr>
<tr><td style="padding:0 30px 30px;">
<div style="background-color:#f9f9f9;border-left:3px solid {$green};padding:20px;border-radius:0 4px 4px 0;">
<p style="margin:0 0 10px;color:#999999;font-size:12px;text-transform:uppercase;">Mensaje</p>
<p style="margin:0;color:#333333;font-size:15px;line-height:1.8;">{$message_formatted}</p>
</div>
</td></tr>
<tr><td style="padding:0 30px 40px;text-align:center;">
<a href="mailto:{$email}?subject=Re: {$subject}" style="display:inline-block;background-color:#000000;color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:4px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:2px;">Responder</a>
</td></tr>
<tr><td style="background-color:#f9f9f9;padding:20px 30px;text-align:center;border-top:1px solid #e1e1e1;">
<p style="margin:0;color:#999999;font-size:12px;">Mensaje desde billardramirez.cl</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
HTML;

// Email de confirmación al cliente
$client_body = <<<HTML
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f5f5f5;line-height:1.6;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
<tr><td style="background-color:#000000;padding:40px 30px;text-align:center;">
<h1 style="margin:0;color:#ffffff;font-family:Georgia,serif;font-size:28px;font-weight:400;letter-spacing:3px;">BILLARD RAMÍREZ</h1>
<p style="margin:12px 0 0;color:{$green};font-size:11px;letter-spacing:2px;text-transform:uppercase;">Mesas de pool, accesorios y más</p>
</td></tr>
<tr><td style="padding:50px 30px 30px;text-align:center;">
<div style="width:70px;height:70px;background-color:{$green};border-radius:50%;margin:0 auto 25px;line-height:70px;">
<span style="color:#ffffff;font-size:32px;">&#10003;</span>
</div>
<h2 style="margin:0 0 15px;color:#000000;font-size:26px;font-weight:600;">Mensaje Recibido</h2>
<p style="margin:0;color:#666666;font-size:16px;">
Hola <strong style="color:#000000;">{$name}</strong>, hemos recibido tu mensaje.
</p>
</td></tr>
<tr><td style="padding:0 30px 30px;">
<div style="background-color:#f9f9f9;border-radius:4px;padding:25px;text-align:center;">
<p style="margin:0 0 8px;color:#999999;font-size:12px;text-transform:uppercase;">Tu consulta</p>
<p style="margin:0;color:#000000;font-size:18px;font-weight:600;">{$subject}</p>
</div>
</td></tr>
<tr><td style="padding:0 30px 40px;text-align:center;">
<p style="margin:0 0 25px;color:#666666;font-size:15px;line-height:1.8;">
Te responderemos a la brevedad.<br>
Tiempo de respuesta: <strong style="color:#000000;">24 a 48 horas hábiles</strong>.
</p>
<div style="border-top:1px solid #e1e1e1;padding-top:25px;margin-top:10px;">
<p style="margin:0 0 15px;color:#999999;font-size:12px;text-transform:uppercase;">Atención inmediata</p>
<a href="https://wa.me/56965839601" style="display:inline-block;background-color:{$green};color:#ffffff;text-decoration:none;padding:14px 35px;border-radius:4px;font-size:13px;font-weight:600;text-transform:uppercase;margin-right:10px;">WhatsApp</a>
<a href="tel:+56965839601" style="display:inline-block;background-color:#ffffff;color:#000000;text-decoration:none;padding:14px 35px;border-radius:4px;font-size:13px;font-weight:600;text-transform:uppercase;border:1px solid #000000;">Llamar</a>
</div>
</td></tr>
<tr><td style="background-color:#000000;padding:30px;text-align:center;">
<p style="margin:0 0 10px;color:#ffffff;font-size:14px;font-weight:600;">Billard Ramírez</p>
<p style="margin:0 0 15px;color:#888888;font-size:13px;">Mesas de pool, accesorios y más</p>
<p style="margin:0;">
<a href="https://billardramirez.cl" style="color:{$green};font-size:13px;text-decoration:none;">billardramirez.cl</a>
<span style="color:#444444;margin:0 10px;">|</span>
<a href="mailto:contacto@billardramirez.cl" style="color:{$green};font-size:13px;text-decoration:none;">contacto@billardramirez.cl</a>
</p>
<p style="margin:15px 0 0;color:#666666;font-size:11px;">+56 9 6583 9601 - Maximiliano Ibáñez 1436, Quinta Normal</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
HTML;

// Headers - IMPORTANTE: usar email real del dominio como From
$headers = [
    'Content-Type: text/html; charset=UTF-8',
    'From: Billard Ramírez <contacto@billardramirez.cl>',
    "Reply-To: {$name} <{$email}>",
];

$client_headers = [
    'Content-Type: text/html; charset=UTF-8',
    'From: Billard Ramírez <contacto@billardramirez.cl>',
    'Reply-To: contacto@billardramirez.cl',
];

// Enviar emails
if ($wp_loaded && function_exists('wp_mail')) {
    $sent = wp_mail($to, $email_subject, $email_body, $headers);
    wp_mail($email, "Hemos recibido tu mensaje - Billard Ramírez", $client_body, $client_headers);
} else {
    $sent = mail($to, $email_subject, $email_body, implode("\r\n", $headers));
    mail($email, "Hemos recibido tu mensaje - Billard Ramírez", $client_body, implode("\r\n", $client_headers));
}

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Mensaje enviado correctamente']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error al enviar el mensaje']);
}

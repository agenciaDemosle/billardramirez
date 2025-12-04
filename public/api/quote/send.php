<?php
/**
 * BILLARD RAMÍREZ - Quote Form Handler
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

$required = ['name', 'email', 'phone', 'deliveryAddress', 'tableSize', 'tableType', 'installationNeeded'];
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
$address = htmlspecialchars(trim($data['deliveryAddress']), ENT_QUOTES, 'UTF-8');
$tableSize = htmlspecialchars(trim($data['tableSize']), ENT_QUOTES, 'UTF-8');
$tableType = htmlspecialchars(trim($data['tableType']), ENT_QUOTES, 'UTF-8');
$installation = htmlspecialchars(trim($data['installationNeeded']), ENT_QUOTES, 'UTF-8');
$budget = isset($data['budget']) ? htmlspecialchars(trim($data['budget']), ENT_QUOTES, 'UTF-8') : '';
$comments = isset($data['comments']) ? htmlspecialchars(trim($data['comments']), ENT_QUOTES, 'UTF-8') : '';

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
$comments_formatted = $comments ? nl2br($comments) : '<em style="color:#999;">Sin comentarios</em>';

$to = 'contacto@billardramirez.cl';
$email_subject = "Cotización: {$tableTypeDisplay} {$tableSizeDisplay}";
$date = date('d/m/Y H:i');

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
<h2 style="margin:0;color:#000000;font-size:22px;font-weight:600;">Nueva Solicitud de Cotización</h2>
<p style="margin:10px 0 0;color:#666666;font-size:14px;">Recibida el {$date}</p>
</td></tr>
<tr><td style="padding:30px;">
<h3 style="margin:0 0 20px;color:{$green};font-size:12px;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #e1e1e1;padding-bottom:10px;">Datos del Cliente</h3>
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
<span style="color:#999999;font-size:12px;text-transform:uppercase;">Nombre</span><br>
<span style="color:#000000;font-size:16px;font-weight:600;">{$name}</span>
</td></tr>
<tr><td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
<span style="color:#999999;font-size:12px;text-transform:uppercase;">Email</span><br>
<a href="mailto:{$email}" style="color:{$green};font-size:16px;text-decoration:none;">{$email}</a>
</td></tr>
<tr><td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
<span style="color:#999999;font-size:12px;text-transform:uppercase;">Teléfono</span><br>
<a href="tel:{$phone}" style="color:{$green};font-size:16px;text-decoration:none;">{$phone}</a>
</td></tr>
<tr><td style="padding:12px 0;">
<span style="color:#999999;font-size:12px;text-transform:uppercase;">Dirección de Entrega</span><br>
<span style="color:#000000;font-size:16px;">{$address}</span>
</td></tr>
</table>
</td></tr>
<tr><td style="padding:0 30px 30px;">
<h3 style="margin:0 0 20px;color:{$green};font-size:12px;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #e1e1e1;padding-bottom:10px;">Mesa Solicitada</h3>
<div style="background-color:#f9f9f9;border-left:3px solid {$green};padding:20px;border-radius:0 4px 4px 0;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td width="50%" style="padding:8px 0;">
<span style="color:#999999;font-size:11px;text-transform:uppercase;">Tipo</span><br>
<strong style="color:#000000;font-size:15px;">{$tableTypeDisplay}</strong>
</td>
<td width="50%" style="padding:8px 0;">
<span style="color:#999999;font-size:11px;text-transform:uppercase;">Tamaño</span><br>
<strong style="color:#000000;font-size:15px;">{$tableSizeDisplay}</strong>
</td>
</tr>
<tr>
<td width="50%" style="padding:8px 0;">
<span style="color:#999999;font-size:11px;text-transform:uppercase;">Instalación</span><br>
<strong style="color:#000000;font-size:15px;">{$installationDisplay}</strong>
</td>
<td width="50%" style="padding:8px 0;">
<span style="color:#999999;font-size:11px;text-transform:uppercase;">Presupuesto</span><br>
<strong style="color:#000000;font-size:15px;">{$budgetDisplay}</strong>
</td>
</tr>
</table>
</div>
</td></tr>
<tr><td style="padding:0 30px 30px;">
<h3 style="margin:0 0 15px;color:{$green};font-size:12px;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #e1e1e1;padding-bottom:10px;">Comentarios</h3>
<p style="margin:0;color:#333333;font-size:15px;line-height:1.8;">{$comments_formatted}</p>
</td></tr>
<tr><td style="padding:0 30px 40px;text-align:center;">
<a href="mailto:{$email}?subject=Cotización Mesa de Pool - Billard Ramírez" style="display:inline-block;background-color:#000000;color:#ffffff;text-decoration:none;padding:14px 30px;border-radius:4px;font-size:13px;font-weight:600;text-transform:uppercase;margin-right:10px;">Responder</a>
<a href="tel:{$phone}" style="display:inline-block;background-color:{$green};color:#ffffff;text-decoration:none;padding:14px 30px;border-radius:4px;font-size:13px;font-weight:600;text-transform:uppercase;">Llamar</a>
</td></tr>
<tr><td style="background-color:#f9f9f9;padding:20px 30px;text-align:center;border-top:1px solid #e1e1e1;">
<p style="margin:0;color:#999999;font-size:12px;">Cotización desde billardramirez.cl</p>
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
<h2 style="margin:0 0 15px;color:#000000;font-size:26px;font-weight:600;">Cotización Recibida</h2>
<p style="margin:0;color:#666666;font-size:16px;">
Hola <strong style="color:#000000;">{$name}</strong>, hemos recibido tu solicitud.
</p>
</td></tr>
<tr><td style="padding:0 30px 30px;">
<div style="background-color:#f9f9f9;border-radius:4px;padding:25px;">
<p style="margin:0 0 15px;color:{$green};font-size:12px;text-transform:uppercase;letter-spacing:2px;text-align:center;">Tu solicitud</p>
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:10px 0;border-bottom:1px solid #e1e1e1;">
<span style="color:#999999;font-size:12px;">Tipo de mesa</span><br>
<strong style="color:#000000;">{$tableTypeDisplay}</strong>
</td></tr>
<tr><td style="padding:10px 0;border-bottom:1px solid #e1e1e1;">
<span style="color:#999999;font-size:12px;">Tamaño</span><br>
<strong style="color:#000000;">{$tableSizeDisplay}</strong>
</td></tr>
<tr><td style="padding:10px 0;">
<span style="color:#999999;font-size:12px;">Instalación</span><br>
<strong style="color:#000000;">{$installationDisplay}</strong>
</td></tr>
</table>
</div>
</td></tr>
<tr><td style="padding:0 30px 40px;">
<h3 style="margin:0 0 20px;color:#000000;font-size:18px;font-weight:600;text-align:center;">¿Qué sigue?</h3>
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:12px 0;">
<table cellpadding="0" cellspacing="0"><tr>
<td style="width:40px;vertical-align:top;">
<div style="width:28px;height:28px;background-color:{$green};color:#fff;border-radius:50%;text-align:center;line-height:28px;font-weight:600;font-size:13px;">1</div>
</td>
<td style="color:#666666;font-size:14px;vertical-align:middle;">Nuestro equipo revisará tu solicitud</td>
</tr></table>
</td></tr>
<tr><td style="padding:12px 0;">
<table cellpadding="0" cellspacing="0"><tr>
<td style="width:40px;vertical-align:top;">
<div style="width:28px;height:28px;background-color:{$green};color:#fff;border-radius:50%;text-align:center;line-height:28px;font-weight:600;font-size:13px;">2</div>
</td>
<td style="color:#666666;font-size:14px;vertical-align:middle;">Prepararemos una cotización personalizada</td>
</tr></table>
</td></tr>
<tr><td style="padding:12px 0;">
<table cellpadding="0" cellspacing="0"><tr>
<td style="width:40px;vertical-align:top;">
<div style="width:28px;height:28px;background-color:{$green};color:#fff;border-radius:50%;text-align:center;line-height:28px;font-weight:600;font-size:13px;">3</div>
</td>
<td style="color:#666666;font-size:14px;vertical-align:middle;">Te contactaremos en <strong style="color:#000;">24-48 horas hábiles</strong></td>
</tr></table>
</td></tr>
</table>
</td></tr>
<tr><td style="padding:0 30px 40px;text-align:center;">
<div style="border-top:1px solid #e1e1e1;padding-top:30px;">
<p style="margin:0 0 20px;color:#999999;font-size:12px;text-transform:uppercase;">Atención inmediata</p>
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

// Headers - usar email real del dominio
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
    wp_mail($email, "Cotización recibida - Billard Ramírez", $client_body, $client_headers);
} else {
    $sent = mail($to, $email_subject, $email_body, implode("\r\n", $headers));
    mail($email, "Cotización recibida - Billard Ramírez", $client_body, implode("\r\n", $client_headers));
}

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Cotización enviada correctamente']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error al enviar la cotización']);
}

<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors in output
ini_set('log_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Handle preflight
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    // Only allow POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit();
    }

    // Get POST data
    $data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email']);
    exit();
}

$email = $data['email'];
$productId = $data['productId'] ?? '';
$productName = $data['productName'] ?? '';
$tags = $data['tags'] ?? [];

// Mailchimp Configuration
// IMPORTANTE: Configurar estas variables en el servidor
$apiKey = getenv('MAILCHIMP_API_KEY') ?: '';
$listId = getenv('MAILCHIMP_LIST_ID') ?: '';

if (empty($apiKey) || empty($listId)) {
    http_response_code(500);
    echo json_encode(['error' => 'Mailchimp not configured']);
    exit();
}
$dataCenter = substr($apiKey, strpos($apiKey, '-') + 1);

// Create subscriber hash
$subscriberHash = md5(strtolower($email));

// Mailchimp API endpoint
$url = "https://{$dataCenter}.api.mailchimp.com/3.0/lists/{$listId}/members/{$subscriberHash}";

// Prepare data for Mailchimp
// According to Mailchimp API v3.0 documentation
$mailchimpData = [
    'email_address' => $email,
    'status_if_new' => 'subscribed',
    'status' => 'subscribed', // Ensure status is set
];

// Only add merge fields if they have values AND they exist in Mailchimp
if (!empty($productId) || !empty($productName)) {
    $mailchimpData['merge_fields'] = array_filter([
        'PRODUCT_ID' => $productId,
        'PRODUCT_NAME' => $productName,
    ]);
}

// Initialize cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_USERPWD, 'user:' . $apiKey);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($mailchimpData));

// Execute request
$result = curl_exec($ch);
$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Parse response
$response = json_decode($result, true);

// Check if successful
if ($statusCode === 200) {
    // Success - now add tags if provided (separate API call)
    if (!empty($tags)) {
        $tagsUrl = "https://{$dataCenter}.api.mailchimp.com/3.0/lists/{$listId}/members/{$subscriberHash}/tags";

        // Format tags correctly for Mailchimp API
        $tagsData = [
            'tags' => array_map(function($tag) {
                return [
                    'name' => $tag,
                    'status' => 'active'
                ];
            }, $tags)
        ];

        $chTags = curl_init($tagsUrl);
        curl_setopt($chTags, CURLOPT_USERPWD, 'user:' . $apiKey);
        curl_setopt($chTags, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($chTags, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($chTags, CURLOPT_TIMEOUT, 10);
        curl_setopt($chTags, CURLOPT_POST, true);
        curl_setopt($chTags, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($chTags, CURLOPT_POSTFIELDS, json_encode($tagsData));

        curl_exec($chTags);
        curl_close($chTags);
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Suscripción exitosa',
        'email' => $email
    ]);
} else {
    // Error - return detailed information for debugging
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Error al suscribir a Mailchimp',
        'status_code' => $statusCode,
        'mailchimp_response' => $response,
        'details' => $response['detail'] ?? 'Error desconocido',
        'title' => $response['title'] ?? null,
        'errors' => $response['errors'] ?? null,
        'debug' => [
            'api_key_prefix' => substr($apiKey, 0, 10) . '...',
            'list_id' => $listId,
            'data_center' => $dataCenter,
            'email' => $email,
            'curl_error' => $curlError ?: null
        ]
    ]);
}

} catch (Exception $e) {
    // Catch any unexpected errors
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error interno del servidor',
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}

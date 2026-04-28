<?php
/**
 * Script to save contact messages to a JSON file.
 */

$file = '../assets/data/messages.json';

// Get POST data
$json = file_get_contents('php://input');
$newMessage = json_decode($json, true);

if ($newMessage) {
    // Load existing messages
    $currentData = json_decode(file_get_contents($file), true);
    
    if (!isset($currentData['messages'])) {
        $currentData['messages'] = [];
    }
    
    // Add timestamp and ID
    $newMessage['id'] = time();
    $newMessage['received_at'] = date('Y-m-d H:i:s');
    
    $currentData['messages'][] = $newMessage;
    
    // Save back to file
    if (file_put_contents($file, json_encode($currentData, JSON_PRETTY_PRINT))) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Mensaje guardado"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "No se pudo escribir en el archivo"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Datos invalidos"]);
}
?>

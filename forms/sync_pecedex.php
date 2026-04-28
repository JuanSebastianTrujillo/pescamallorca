<?php
/**
 * Sync user's Pecedex progress with the server.
 */

$file = '../assets/data/user_progress.json';

// Get POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

$userId = $data['user_id'] ?? null;
$localCaught = $data['caught_list'] ?? [];
$shouldMerge = $data['merge'] ?? false;

if ($userId) {
    // Load existing data
    $allProgress = json_decode(file_get_contents($file), true);
    if (!$allProgress) $allProgress = [];
    
    $serverCaught = $allProgress[$userId] ?? [];
    
    if ($shouldMerge) {
        // Al iniciar sesión, fusionamos local + nube
        $finalCaught = array_values(array_unique(array_merge($serverCaught, $localCaught)));
    } else {
        // Al realizar una acción (capturar/reset), el cliente manda la verdad absoluta
        $finalCaught = array_values(array_unique($localCaught));
    }
    
    // Guardar
    $allProgress[$userId] = $finalCaught;
    
    if (file_put_contents($file, json_encode($allProgress, JSON_PRETTY_PRINT))) {
        http_response_code(200);
        echo json_encode([
            "status" => "success", 
            "caught_list" => $finalCaught
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Error al guardar"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Falta user_id"]);
}
?>

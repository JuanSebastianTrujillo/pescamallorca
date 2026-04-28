<?php
/**
 * Simple script to save comments to a JSON file.
 * NOTE: In a real production environment, you should validate and sanitize inputs.
 */

// File path
$file = '../assets/data/comments.json';

// Get POST data
$json = file_get_contents('php://input');
$newComment = json_decode($json, true);

if ($newComment) {
    // Load existing comments
    $currentData = json_decode(file_get_contents($file), true);
    
    // Add new comment
    if (!isset($currentData['comments'])) {
        $currentData['comments'] = [];
    }
    
    // Check if ID already exists to avoid duplicates
    $exists = false;
    foreach ($currentData['comments'] as $c) {
        if ($c['id'] == $newComment['id']) {
            $exists = true;
            break;
        }
    }
    
    if (!$exists) {
        $currentData['comments'][] = $newComment;
        
        // Save back to file
        file_put_contents($file, json_encode($currentData, JSON_PRETTY_PRINT));
        
        echo json_encode(['status' => 'success', 'message' => 'Comentario guardado']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Comentario duplicado']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Datos inválidos']);
}
?>

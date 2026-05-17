<?php
// Chat endpoint con Gemini - Backend seguro
// POST JSON: { "message": "...", "lang": "es" }
// Responde con: { "response": "...", "error": null }

header('Content-Type: application/json; charset=utf-8');

function getEnvValue($name) {
    $value = getenv($name);
    if ($value !== false) return $value;
    $envFile = __DIR__ . '/.env';
    if (file_exists($envFile)) {
        $env = parse_ini_file($envFile);
        if (!empty($env[$name])) return $env[$name];
    }
    return null;
}

function safeHttpPost($url, $body, $headers = []) {
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        $resp = curl_exec($ch);
        $err = curl_error($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return ['body' => $resp, 'error' => $err, 'code' => $code];
    }

    if (stripos($url, 'http://') === 0 || stripos($url, 'https://') === 0) {
        $parts = parse_url($url);
        if (!$parts || empty($parts['host'])) {
            return ['body' => false, 'error' => 'Invalid URL', 'code' => null];
        }
        $scheme = $parts['scheme'];
        $host = $parts['host'];
        $port = isset($parts['port']) ? $parts['port'] : ($scheme === 'https' ? 443 : 80);
        $path = ($parts['path'] ?? '/') . (isset($parts['query']) ? '?' . $parts['query'] : '');
        $transport = $scheme === 'https' ? 'ssl' : 'tcp';

        $headerLines = $headers;
        $hasHost = false;
        $hasContentLength = false;
        $hasConnection = false;
        foreach ($headerLines as $line) {
            if (stripos($line, 'Host:') === 0) $hasHost = true;
            if (stripos($line, 'Content-Length:') === 0) $hasContentLength = true;
            if (stripos($line, 'Connection:') === 0) $hasConnection = true;
        }
        if (!$hasHost) $headerLines[] = 'Host: ' . $host;
        if (!$hasContentLength) $headerLines[] = 'Content-Length: ' . strlen($body);
        if (!$hasConnection) $headerLines[] = 'Connection: close';
        if (!preg_grep('/^User-Agent:/i', $headerLines)) {
            $headerLines[] = 'User-Agent: PHP safeHttpPost';
        }

        $request = "POST $path HTTP/1.1\r\n" . implode("\r\n", $headerLines) . "\r\n\r\n" . $body;
        $contextOpts = [];
        if ($transport === 'ssl') {
            $contextOpts['ssl'] = [
                'verify_peer' => false,
                'verify_peer_name' => false,
            ];
        }
        $context = stream_context_create($contextOpts);
        $socket = @stream_socket_client("$transport://$host:$port", $errno, $errstr, 30, STREAM_CLIENT_CONNECT, $context);
        if (!$socket) {
            return ['body' => false, 'error' => "Socket error: $errno $errstr", 'code' => null];
        }
        fwrite($socket, $request);
        $response = '';
        while (!feof($socket)) {
            $response .= fgets($socket, 1024);
        }
        fclose($socket);

        $parts = preg_split('/\r\n\r\n/', $response, 2);
        if (count($parts) < 2) {
            return ['body' => false, 'error' => 'No response body received', 'code' => null];
        }
        $rawHeaders = $parts[0];
        $respBody = $parts[1];
        $code = null;
        if (preg_match('#HTTP/\d+\.\d+\s+(\d+)#', strtok($rawHeaders, "\r\n"), $match)) {
            $code = intval($match[1]);
        }
        return ['body' => $respBody, 'error' => null, 'code' => $code];
    }

    return ['body' => false, 'error' => 'Unsupported URL scheme', 'code' => null];
}

function searchLocalData($userMessage) {
    // Search in local JSON files for relevant context based on keywords
    $projectRoot = dirname(__DIR__);
    $lang = isset($GLOBALS['active_lang']) ? $GLOBALS['active_lang'] : 'es';
    $dataFiles = [
        $projectRoot . "/assets/data/especies_{$lang}.json",
        $projectRoot . "/assets/data/zonas_{$lang}.json",
        $projectRoot . '/assets/data/rampas.json',
        $projectRoot . '/assets/data/tiendas.json'
    ];
    
    $allContext = [];
    $messageWords = preg_split('/\s+/i', strtolower($userMessage));
    
    foreach ($dataFiles as $file) {
        if (!file_exists($file)) continue;
        
        $content = json_decode(file_get_contents($file), true);
        if (empty($content)) continue;
        
        // If it's a schema.org @graph structure (especies, zonas)
        if (isset($content['@graph']) && is_array($content['@graph'])) {
            foreach ($content['@graph'] as $item) {
                $relevance = 0;
                $itemName = '';
                
                // Check if item matches user keywords
                if (isset($item['name'])) {
                    $itemName = $item['name'];
                    foreach ($messageWords as $word) {
                        if (strlen($word) > 2 && stripos($itemName, $word) !== false) {
                            $relevance += 2;
                        }
                    }
                }
                
                // Also check in description
                if (isset($item['description'])) {
                    foreach ($messageWords as $word) {
                        if (strlen($word) > 2 && stripos($item['description'], $word) !== false) {
                            $relevance += 1;
                        }
                    }
                }
                
                // Check in additionalProperty values (Dieta, Estacionalidad, etc)
                if (isset($item['additionalProperty']) && is_array($item['additionalProperty'])) {
                    foreach ($item['additionalProperty'] as $prop) {
                        if (isset($prop['value'])) {
                            foreach ($messageWords as $word) {
                                if (strlen($word) > 2 && stripos($prop['value'], $word) !== false) {
                                    $relevance += 1;
                                }
                            }
                        }
                    }
                }
                
                if ($relevance > 0) {
                    $allContext[] = [
                        'relevance' => $relevance,
                        'data' => $item,
                        'source' => basename($file)
                    ];
                }
            }
        }
        // If it's a flat array (rampas, tiendas)
        else if (is_array($content)) {
            foreach ($content as $item) {
                $relevance = 0;
                if (is_array($item)) {
                    foreach ($messageWords as $word) {
                        if (strlen($word) > 2) {
                            foreach ($item as $value) {
                                if (is_string($value) && stripos($value, $word) !== false) {
                                    $relevance += 1;
                                }
                            }
                        }
                    }
                }
                
                if ($relevance > 0) {
                    $allContext[] = [
                        'relevance' => $relevance,
                        'data' => $item,
                        'source' => basename($file)
                    ];
                }
            }
        }
    }
    
    // Sort by relevance and return top results
    usort($allContext, function($a, $b) {
        return $b['relevance'] - $a['relevance'];
    });
    
    return array_slice($allContext, 0, 3); // Return top 3 matches
}

function formatContextForPrompt($contextItems) {
    // Format retrieved data as readable context for the prompt
    if (empty($contextItems)) return '';
    
    $formatted = "\n\n--- Local Knowledge Base (Pesca Mallorca Database) ---\n";
    foreach ($contextItems as $item) {
        $data = $item['data'];
        $source = $item['source'];
        
        $formatted .= "\nFrom " . $source . ":\n";
        
        if (isset($data['name'])) {
            $formatted .= "Name: " . $data['name'] . "\n";
        }
        if (isset($data['description'])) {
            $formatted .= "Description: " . $data['description'] . "\n";
        }
        if (isset($data['alternateName'])) {
            $formatted .= "Scientific: " . $data['alternateName'] . "\n";
        }
        
        // Add relevant properties
        if (isset($data['additionalProperty']) && is_array($data['additionalProperty'])) {
            foreach (array_slice($data['additionalProperty'], 0, 5) as $prop) {
                if (isset($prop['name']) && isset($prop['value'])) {
                    $formatted .= $prop['name'] . ": " . $prop['value'] . "\n";
                }
            }
        }
    }
    $formatted .= "--- End of Local Knowledge ---\n";
    
    return $formatted;
}

function geminiChat($apiKey, $userMessage, $systemPrompt = null) {
    // Retrieve relevant local data
    $contextItems = searchLocalData($userMessage);
    $contextString = formatContextForPrompt($contextItems);
    
    if (!$systemPrompt) {
        $systemPrompt = "You are a knowledgeable assistant for Pesca Mallorca, a website about fishing in Mallorca. "
                      . "You have access to a local database with information about fish species, fishing zones, boat ramps, and shops. "
                      . "Use the provided local knowledge base to answer questions accurately. "
                      . "If you cite specific data (species names, sizes, seasons, locations), base it on the local database provided below. "
                      . "Be friendly, knowledgeable, and concise. Answer in the same language as the user."
                      . $contextString;
    }

    $payload = json_encode([
        'contents' => [
            [
                'parts' => [
                    ['text' => $userMessage]
                ]
            ]
        ],
        'systemInstruction' => [
            'parts' => [
                ['text' => $systemPrompt]
            ]
        ],
        'generationConfig' => [
            'temperature' => 0.7,
            'maxOutputTokens' => 512
        ]
    ]);

    $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . urlencode($apiKey);
    $result = safeHttpPost($url, $payload, ['Content-Type: application/json']);
    $resp = $result['body'];
    $err = $result['error'];
    $code = $result['code'];

    if ($resp === false || $resp === null) {
        return ['error' => 'Request failed', 'details' => $err, 'code' => $code];
    }

    $json = json_decode($resp, true);
    if (isset($json['error'])) {
        return ['error' => 'Gemini error', 'details' => $json['error'], 'code' => $code];
    }

    $textOut = null;
    if (isset($json['candidates'][0]['content']['parts'][0]['text'])) {
        $textOut = $json['candidates'][0]['content']['parts'][0]['text'];
    }

    if ($textOut === null) {
        return ['error' => 'No response from Gemini', 'response' => $json];
    }

    return ['text' => $textOut];
}

// Main logic
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

// Set active lang globally for context search
$activeLang = isset($data['lang']) ? preg_replace('/[^a-z]/', '', strtolower($data['lang'])) : 'es';
if (!in_array($activeLang, ['es', 'en', 'ca', 'de'])) {
    $activeLang = 'es';
}
$GLOBALS['active_lang'] = $activeLang;

if (!$data || !isset($data['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing message', 'response' => null]);
    exit;
}

$userMessage = trim((string)$data['message']);
if (empty($userMessage)) {
    http_response_code(400);
    echo json_encode(['error' => 'Empty message', 'response' => null]);
    exit;
}

// Limit message length to prevent abuse
if (strlen($userMessage) > 1000) {
    http_response_code(400);
    echo json_encode(['error' => 'Message too long (max 1000 chars)', 'response' => null]);
    exit;
}

$apiKey = getEnvValue('GOOGLE_API_KEY');
if (!$apiKey) {
    http_response_code(500);
    echo json_encode(['error' => 'GOOGLE_API_KEY not configured', 'response' => null]);
    exit;
}

$systemPrompt = isset($data['system']) ? (string)$data['system'] : null;
$result = geminiChat($apiKey, $userMessage, $systemPrompt);

if (isset($result['error'])) {
    http_response_code(502);
    echo json_encode([
        'error' => $result['error'],
        'response' => null,
        'details' => $result['details'] ?? null
    ]);
    exit;
}

echo json_encode([
    'error' => null,
    'response' => $result['text']
]);

?>

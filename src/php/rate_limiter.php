<?php
// rate_limiter.php

//debugline- after remove
file_put_contents(__DIR__ . '/rl.log', date('c') . " — limiter loaded\n", FILE_APPEND);


// Connect to Redis
$redis = new Redis();
$redis->connect('redis', 6379);

// Build a key per client IP
$ip    = $_SERVER['REMOTE_ADDR'];
$key   = "rate:{$ip}";
$limit = 100;   // max requests
$ttl   = 60;    // per seconds

// Increment and fetch the count
$count = $redis->incr($key);

// On first hit, set the expiry
if ($count === 1) {
    $redis->expire($key, $ttl);
}

// If over the limit, return 429 and exit
if ($count > $limit) {
    header('Content-Type: application/json', true, 429);
    echo json_encode([
        'success' => false,
        'message' => 'Too many requests – slow down.',
        'retry_after' => $redis->ttl($key)  // seconds until counter resets
    ]);
    exit;
}
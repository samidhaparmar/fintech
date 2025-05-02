<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

// Include DB config (replace with your file name)
require_once("config.php"); //$pdo + $conn

// Read JSON input
$file_json = file_get_contents('php://input');
$data = json_decode($file_json, true);

if (!isset($data)) {
    echo json_encode(['success' => false, 'message' => 'ERROR! DATA NOT RECEIVED']);
    exit;
}

$email    = $data['email'] ;
$password = $data['password'];
$date     = date("Y/m/d");

if (empty($email) || empty($password)) {
    $response = [
        'success' => false,
        'message' => 'Please enter email and password.',
        'data'    => 'no data'
    ];
    echo json_encode($response);
    exit;
}

// ADDED: validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
    exit;
}


// 1) Check if admin
$stmt = $pdo->prepare("SELECT email, password FROM admin WHERE email = :email LIMIT 1");  // CHANGED to PDO
$stmt->execute(['email' => $email]);                                                    // CHANGED to bound param
$admin = $stmt->fetch();

if ($admin) {
    // Verify hashed password (unchanged)
    if (password_verify($password, $admin['password'])) {
        // (Optional) update last_login via PDO
        // $upd = $pdo->prepare("UPDATE admin SET last_login = :date WHERE email = :email");
        // $upd->execute(['date' => $date, 'email' => $email]);

        // JWT generation (unchanged)
        $admin_json   = json_encode(['email' => $admin['email']], true);
        $header       = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
        $payload      = json_encode([
            "admin_email" => $admin['email'],
            "data"        => $admin_json,
            "exp"         => time() + (60 * 60 * 12)
        ]);
        $jwt_key           = "admin101202";
        $base64_header     = base64_encode($header);
        $base64_payload    = base64_encode($payload);
        $signature         = hash_hmac('sha256', "$base64_header.$base64_payload", $jwt_key, true);
        $base64_signature  = base64_encode($signature);
        $jwt_token         = "$base64_header.$base64_payload.$base64_signature";

        echo json_encode([
            'success' => true,
            'message' => 'Admin Login successful!',
            'data'    => 'no data',
            'token'   => $jwt_token,
            'role'    => 'Admin'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Wrong password for Admin!']);
    }
    exit;

}

// 2) If not admin, check normal user
/* ── 2) Check User via PDO ────────────────────────────────────────────────── */
$stmt = $pdo->prepare("
    SELECT id, first_name, last_name, email, phone_number, dob, password
      FROM users
     WHERE email = :email
     LIMIT 1
");                                                                                     // CHANGED to PDO + explicit columns
$stmt->execute(['email' => $email]);                                                    // CHANGED to bound param
$user = $stmt->fetch();

if ($user) {
    // Verify hashed password (unchanged)
    if (password_verify($password, $user['password'])) {
        // ADDED: update last_login via PDO
        $upd = $pdo->prepare("UPDATE users SET updated_at = :date WHERE email = :email");
        $upd->execute(['date' => $date, 'email' => $email]);

        // Prepare user data JSON (unchanged)
        $user_json = json_encode([
            'id'           => $user['id'],
            'first_name'   => $user['first_name'],
            'last_name'    => $user['last_name'],
            'email'        => $user['email'],
            'phone_number' => $user['phone_number'],
            'dob'          => $user['dob']
        ], true);

        // JWT generation (unchanged)
        $header           = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
        $payload          = json_encode([
            "user_email" => $user['email'],
            "data"       => $user_json,
            "exp"        => time() + (60 * 60 * 24)
        ]);
        $jwt_key           = "userFinSolutions2023";
        $base64_header     = base64_encode($header);
        $base64_payload    = base64_encode($payload);
        $signature         = hash_hmac('sha256', "$base64_header.$base64_payload", $jwt_key, true);
        $base64_signature  = base64_encode($signature);
        $jwt_token         = "$base64_header.$base64_payload.$base64_signature";

        echo json_encode([
            'success' => true,
            'message' => 'User Login successful!',
            'data'    => 'no data',
            'token'   => $jwt_token,
            'role'    => 'User'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Wrong password for User!']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'User Not Found!']);
}

?>
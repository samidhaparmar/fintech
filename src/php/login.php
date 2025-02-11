<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

// Include DB config (replace with your file name)
require_once("config.php");

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

// 1) Check if admin
$query_admin = "SELECT * FROM `admin` WHERE email = '$email'";
$result_admin = mysqli_query($conn, $query_admin);

if (mysqli_num_rows($result_admin) > 0) {
    // We found an admin row
    $admin = mysqli_fetch_assoc($result_admin);

    // Verify hashed password
    if (password_verify($password, $admin['password'])) {
        // Update last login
        // $update_admin_time = "UPDATE `admin` SET last_login='$date' WHERE email = '$email'";
        
        // if (mysqli_query($conn, $update_admin_time)) {
            // Create admin token
            $admin_json = json_encode([
                'email' => $admin['email']
            ], true);

            $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
            $payload = json_encode([
                "admin_email" => $admin['email'],
                "data"        => $admin_json,
                "exp"         => time() + (60 * 60 * 12) // 12 hours
            ]);

            $jwt_key = "admin101202"; // secret key for admin
            // Encode
            $base64_header  = base64_encode($header);
            $base64_payload = base64_encode($payload);

            // Signature
            $signature        = hash_hmac('sha256', "$base64_header.$base64_payload", $jwt_key, true);
            $base64_signature = base64_encode($signature);

            // JWT token
            $jwt_token = "$base64_header.$base64_payload.$base64_signature";

            $response_admin = [
                'success' => true,
                'message' => 'Admin Login successful!',
                'data'    => 'no data',
                'token'   => $jwt_token,
                "role"    => 'Admin'
            ];
            echo json_encode($response_admin);

        // } else {
        //     $response = [
        //         'success' => false,
        //         'message' => 'Something went wrong updating admin login time.'
        //     ];
        //     echo json_encode($response);
        // }
    } else {
        $response = [
            'success' => false,
            'message' => 'Wrong password for Admin!'
        ];
        echo json_encode($response);
    }
    exit;
}

// 2) If not admin, check normal user
$query_user = "SELECT * FROM `users` WHERE email = '$email'";
$result_user = mysqli_query($conn, $query_user);

if (mysqli_num_rows($result_user) > 0) {
    $user = mysqli_fetch_assoc($result_user);

    // Verify hashed password
    // e.g., password_verify($password, $user['password'])
    if (password_verify($password, $user['password'])) {
        // Update last_login
        $update_user_time = "UPDATE `users` SET updated_at = '$date' WHERE email = '$email'";

        if (mysqli_query($conn, $update_user_time)) {
            // Prepare user data as JSON
            $user_json = json_encode([
                'id'         => $user['id'],
                'first_name' => $user['first_name'],
                'last_name'  => $user['last_name'],
                'email'      => $user['email'],
                'phone_number' => $user['phone_number'],
                'dob'        => $user['dob'] 
            ], true);

            // Create JWT
            $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
            $payload = json_encode([
                "user_email" => $user['email'],
                "data"       => $user_json,
                "exp"        => time() + (60 * 60 * 24) // 12 hours
            ]);

            $jwt_key = "userFinSolutions2023"; // secret key for normal user
            // Encode
            $base64_header  = base64_encode($header);
            $base64_payload = base64_encode($payload);

            // Signature
            $signature        = hash_hmac('sha256', "$base64_header.$base64_payload", $jwt_key, true);
            $base64_signature = base64_encode($signature);

            // Combine to form JWT
            $jwt_token = "$base64_header.$base64_payload.$base64_signature";

            $response_user = [
                'success' => true,
                'message' => 'User Login successful!',
                'data'    => 'no data',
                'token'   => $jwt_token,
                "role"    => 'User'
            ];
            echo json_encode($response_user);
        } else {
            $response = [
                'success' => false,
                'message' => 'Something went wrong updating user login time.'
            ];
            echo json_encode($response);
        }
    } else {
        $response = [
            'success' => false,
            'message' => 'Wrong password for User!'
        ];
        echo json_encode($response);
    }
} else {
    $response = [
        'success' => false,
        'message' => 'User Not Found!'
    ];
    echo json_encode($response);
}

?>
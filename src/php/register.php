<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once("config.php");

// Name of your users table
$table = "users";

// Get JSON input
$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

if (isset($data)) {
    // Extract fields from request
    $first_name    = mysqli_real_escape_string($conn, $data['first_name']);
    $last_name     = mysqli_real_escape_string($conn, $data['last_name']);
    $phone_number  = mysqli_real_escape_string($conn, $data['phone_number']);
    $email         = mysqli_real_escape_string($conn, $data['email']);
    $password      = $data['password'];
    $confirm_password = $data['confirm_password'];
    $dob           = mysqli_real_escape_string($conn, $data['dob']);

    // Check if passwords match
    if ($password !== $confirm_password) {
        echo json_encode([
            'success' => false,
            'message' => 'Error: Passwords do not match.'
        ]);
        exit;
    }

    // Hash the password before storing
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Check if the email already exists
    $check_query = "SELECT * FROM `$table` WHERE email = '$email'";
    $check_result = mysqli_query($conn, $check_query);

    if (mysqli_num_rows($check_result) > 0) {
        // Email already taken
        echo json_encode([
            'success' => false,
            'message' => 'Error: Email already exists. Please use a different email.'
        ]);
        exit;
    }

    // Insert the new user into the database using the hashed password
    $sql = " INSERT INTO `$table` (`first_name`, `last_name`, `phone_number`, `email`, `dob`, `password`, `created_at`, `updated_at`) 
        VALUES ('$first_name', '$last_name', '$phone_number', '$email', '$dob', '$hashedPassword', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
    if (mysqli_query($conn, $sql)) {
        echo json_encode([
            'success' => true,
            'message' => 'Registration successful!'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error inserting user: ' . mysqli_error($conn)
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error: No data received.'
    ]);
}
?>
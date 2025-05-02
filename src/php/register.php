<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once("config.php");  // provides $pdo + legacy $conn
require_once __DIR__ . '/rate_limiter.php';//



$table = "users";

// Read & decode JSON input
$data = json_decode(file_get_contents('php://input'), true);

// ADDED: guard against no data
if (empty($data)) {
    echo json_encode(['success' => false, 'message' => 'Error: No data received.']);
    exit;
}

// ADDED: trim inputs and set defaults
$first_name       = trim($data['first_name']        ?? '');
$last_name        = trim($data['last_name']         ?? '');
$phone_number     = trim($data['phone_number']      ?? '');
$email            = trim($data['email']             ?? '');
$dob              = trim($data['dob']               ?? '');
$password         =            $data['password']     ?? '';
$confirm_password =            $data['confirm_password'] ?? '';

// ADDED: validate required fields
if (!$first_name || !$last_name || !$phone_number || !$email || !$dob || !$password || !$confirm_password) {
    echo json_encode(['success' => false, 'message' => 'Error: All fields are required.']);
    exit;
}

// ADDED: validate name format
if (!ctype_alpha(str_replace(' ', '', $first_name)) || !ctype_alpha(str_replace(' ', '', $last_name))) {
    echo json_encode(['success' => false, 'message' => 'Error: Names must contain letters only.']);
    exit;
}

// ADDED: validate phone number is digits
if (!ctype_digit($phone_number)) {
    echo json_encode(['success' => false, 'message' => 'Error: Phone number must contain digits only.']);
    exit;
}

// ADDED: validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Error: Invalid email format.']);
    exit;
}

// ADDED: password match & length check
if ($password !== $confirm_password) {
    echo json_encode(['success' => false, 'message' => 'Error: Passwords do not match.']);
    exit;
}
if (strlen($password) < 8) {
    echo json_encode(['success' => false, 'message' => 'Error: Password must be at least 8 characters.']);
    exit;
}

// CHANGED: check email uniqueness via PDO
$stmt = $pdo->prepare("SELECT 1 FROM `$table` WHERE email = :email LIMIT 1");
$stmt->execute(['email' => $email]);
if ($stmt->fetchColumn()) {
    echo json_encode(['success' => false, 'message' => 'Error: Email already exists. Please use a different email.']);
    exit;
}

// CHANGED: insert new user with prepared statement + password_hash
$ins = $pdo->prepare("
    INSERT INTO `$table`
      (first_name, last_name, phone_number, email, dob, password, created_at, updated_at)
    VALUES
      (:first, :last, :phone, :email, :dob, :pwd, NOW(), NOW())
");
$ins->execute([
    'first' => $first_name,
    'last'  => $last_name,
    'phone' => $phone_number,
    'email' => $email,
    'dob'   => $dob,
    'pwd'   => password_hash($password, PASSWORD_BCRYPT),
]);

echo json_encode(['success' => true, 'message' => 'Registration successful!']);
<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
require_once("../config.php");

$file_json = file_get_contents('php://input');
$data = json_decode($file_json, true);

if(isset($data)){

    $token = $data['token'];

    $key = "admin101202";
    $tokenParts = explode('.', $token);
	$header = base64_decode($tokenParts[0]);
	$payload = base64_decode($tokenParts[1]);
    $json_payload = json_decode($payload, true);
    $user_data = $json_payload['data'];
	$signature_provided = $tokenParts[2];

	// check the expiration time - note this will cause an error if there is no 'exp' claim in the jwt
	$expiration = json_decode($payload)->exp;
	$is_token_expired = ($expiration - time()) < 0;

	// build a signature based on the header and payload using the secret
	$base64_header = base64_encode($header);
	$base64_payload = base64_encode($payload);
	$signature = hash_hmac('SHA256', $base64_header . "." . $base64_payload, $key, true);
    $base64_signature = base64_encode($signature);

	// verify it matches the signature provided in the jwt
	$is_signature_valid = ($base64_signature === $signature_provided);
	
	if ($is_token_expired || !$is_signature_valid) {
        $response = array('success' => true, 'message' => 'Token is expired !!!  or invalid token!!', 'data' => 'no data');
        echo json_encode($response);
    }else{

        $sql = "SELECT users.first_name, users.last_name, users.created_at FROM `users` ORDER BY users.id DESC";
        $result = mysqli_query($conn, $sql);

        if ($result) {
            $data = array();
            while ($row = mysqli_fetch_assoc($result)) {
                // Build the data array with the base64-encoded image data
                $data[] = [
                    'name' => $row['first_name'],
                    'surname' => $row['last_name'],
                    'register_date' => $row['created_at'],
                ];
            }
            $response = ['success' => true, 'message' => 'Users got successfuly!', 'data' => $data];
            echo json_encode($response);
        }else{
            $response = ['success' => false, 'message' => 'Error!'];
            echo json_encode($response);
        }
    }
}else{
    echo json_encode(['success' => false, 'message' => 'ERROR !!!! DATA NOT RECIEVED']);
}
?>

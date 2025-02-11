<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

$file_json = file_get_contents('php://input');
$data = json_decode($file_json, true);

if(isset($data)){
    $token = $data['token'];

    $key_admin = "admin101202";
    $key_user = "userFinSolutions2023";
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
	$signature_user = hash_hmac('SHA256', $base64_header . "." . $base64_payload, $key_user, true);
    $signature_admin = hash_hmac('SHA256', $base64_header . "." . $base64_payload, $key_admin, true);
    $base64_signature_user = base64_encode($signature_user);
    $base64_signature_admin = base64_encode($signature_admin);

	// verify it matches the signature provided in the jwt
	$is_signature_valid = (($base64_signature_user === $signature_provided) || ($base64_signature_admin === $signature_provided));
	
	if ($is_token_expired || !$is_signature_valid) {
        $response = array('success' => false, 'message' => 'Token is expired !!!  or invalid token!!', 'data' => 'no data');
        echo json_encode($response);
    }else{
        $response = array('success' => true, 'message' => 'Token is valid !!', 'data' => 'no data');
        echo json_encode($response);
    }
}else{
    echo json_encode(['success' => false, 'message' => 'ERROR !!!! DATA NOT RECIEVED']);
}

?>

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
    $key = "admin101202";
    $tokenParts = explode('.', $token);
	$header = $tokenParts[0];
	$payload = base64_decode($tokenParts[1]);
    $json_payload = json_decode($payload, true);
    $user_data = $json_payload['data'];
	$signature_provided = $tokenParts[2];

	// check the expiration time - note this will cause an error if there is no 'exp' claim in the jwt
	$expiration = json_decode($payload)->exp;
	$json_payload['exp'] = time() - 3600;

	$modified_payload = json_encode($json_payload);
    $base64_modified_payload = base64_encode($modified_payload);

    $modified_token = $header. '.' . $base64_modified_payload . '.' . $signature_provided;

    echo json_encode(['success' => true, 'token' => $modified_token]);

}else{
    echo json_encode(['success' => false, 'message' => 'ERROR !!!! DATA NOT RECIEVED']);
}

?>
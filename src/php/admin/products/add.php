<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
require_once("../../config.php");

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
        $response = array('success' => false, 'message' => 'Token is expired !!!  or invalid token!!', 'data' => 'no data');
        echo json_encode($response);
    }else{
        $product = $data['product'];
        $category = $data['category'];
        $itr = $data['itr'];
        $fee = $data['fee'];
        $eligibility = $data['eligibility'];
        $description = $data['description'];
        $benefits = $data['benefits'];

        $query = "SELECT * FROM `products` WHERE `name` = '$product'";
        $result = mysqli_query($conn, $query);
        if (mysqli_num_rows($result) == 1) {
            $response = ['success' => false, 'message' => 'Product already exists.', 'data' => 'no data'];
            echo json_encode($response);
            exit;
        }

        $sql2 = "INSERT INTO `products` 
                (`id`, `name`, `description`, `image`, `itr`, `fee`, `eligibility`, `benefits`, `category_id`) 
                VALUES 
                (NULL, '$product', '$description', NULL, '$itr', '$fee', '$eligibility', '$benefits', (SELECT `id` FROM categories WHERE `name`='$category'));";

        if(mysqli_query($conn, $sql2)){
            $response = ['success' => true, 'message' => 'Product Added successful!'];
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

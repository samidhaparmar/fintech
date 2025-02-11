<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
require_once("../../config.php");

$file_json = file_get_contents('php://input');
$data = json_decode($file_json, true);
      

if(isset($_POST)){

    // $token = $data["token"];

    // $key = "admin101202";
    // $tokenParts = explode('.', $token);
	// $header = base64_decode($tokenParts[0]);
	// $payload = base64_decode($tokenParts[1]);
    // $json_payload = json_decode($payload, true);
    // $user_data = $json_payload['data'];
	// $signature_provided = $tokenParts[2];

	// // check the expiration time - note this will cause an error if there is no 'exp' claim in the jwt
	// $expiration = json_decode($payload)->exp;
	// $is_token_expired = ($expiration - time()) < 0;

	// // build a signature based on the header and payload using the secret
	// $base64_header = base64_encode($header);
	// $base64_payload = base64_encode($payload);
	// $signature = hash_hmac('SHA256', $base64_header . "." . $base64_payload, $key, true);
    // $base64_signature = base64_encode($signature);

	// // verify it matches the signature provided in the jwt
	// $is_signature_valid = ($base64_signature === $signature_provided);
	
	// if ($is_token_expired || !$is_signature_valid) {
    //     $response = array('success' => false, 'message' => 'Token is expired !!!  or invalid token!!', 'data' => 'no data');
    //     echo json_encode($response);
    // }else{
        $model = $_POST["model"];
        $image = $_FILES['img']['tmp_name'];
        $blob = addslashes(file_get_contents($image));

        $sql = "UPDATE `products` SET `image`= '$blob' WHERE `name` = '$model'";

        if(mysqli_query($conn, $sql)){?>
            <script>
                alert("Image Added Successfuly!!!");
                window.location.href = '../../../html/admin/products/add_img.html';
            </script>
            <?php
        }else{?>
            <script>
                alert("Erro While adding Data!!!");
            </script>
            <?php
        }
    // }
}else{
    echo json_encode(['success' => false, 'message' => 'ERROR !!!! DATA NOT RECIEVED']);
}
?>

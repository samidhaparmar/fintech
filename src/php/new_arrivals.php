<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
// header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
require_once("config.php");

$sql = "SELECT cars.model, cars.brand, car_image.img FROM `cars` JOIN `car_image` ON cars.model = car_image.model ORDER BY cars.car_id DESC LIMIT 4";
$result = mysqli_query($conn, $sql);

if ($result) {
    $data = array();
    while ($row = mysqli_fetch_assoc($result)) {
        // Convert the BLOB data to base64 encoding
        $imageData = base64_encode($row['img']);

        // Build the data array with the base64-encoded image data
        $data[] = [
            'model' => $row['model'],
            'brand' => $row['brand'],
            'image' => $imageData,
        ];
    }
    $response = ['success' => true, 'message' => 'Car got successfuly!', 'data' => $data];
    echo json_encode($response);
}else{
    $response = ['success' => false, 'message' => 'Error!'];
    echo json_encode($response);
}

?>
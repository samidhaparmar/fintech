<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
require_once("config.php");

$file_json = file_get_contents('php://input');
$data = json_decode($file_json, true);

if(isset($data)){
    $category = $data['category'];

    if($category){
        $query = "SELECT * FROM products
                WHERE category_id IN (SELECT id FROM categories WHERE name = '$category')";
                        $result = mysqli_query($conn, $query);
        
        if ($result) {
            $data = array();
            while ($row = mysqli_fetch_assoc($result)) {
                // Convert the BLOB data to base64 encoding
                if ($row['image']){
                    $imageData = base64_encode($row['image']);
                }else{
                    $imageData = NULL;
                }

                // Build the data array with the base64-encoded image data
                $data[] = [
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'itr' => $row['itr'],
                    'fee' => $row['fee'],
                    'eligibility' => $row['eligibility'],
                    'benefits' => $row['benefits'],
                    'image' => $imageData,
                ];
            }
            $response = ['success' => true, 'message' => 'Car got successfuly!', 'data' => $data];
            echo json_encode($response);
        }else{
            $response = ['success' => false, 'message' => 'Error!'];
            echo json_encode($response);
        }
    }else{
        $response = ['success' => false, 'message' => 'error in company name!!'];
        echo json_encode($response);
    } 
}else{
    echo json_encode(['success' => false, 'message' => 'ERROR !!!! DATA NOT RECIEVED']);
}
?>
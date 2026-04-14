<?php
include_once __DIR__ . '/../../utils/cors.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
    exit();
}

include_once __DIR__ . '/../../config/database.php';
include_once __DIR__ . '/../../models/Achievement.php';

$database = new Database();
$db = $database->getConnection();
$achievement = new Achievement($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->title_ar) && !empty($data->title_en)) {
    $achievement->title_ar = $data->title_ar;
    $achievement->title_en = $data->title_en;

    if ($achievement->create()) {
        http_response_code(201);
        echo json_encode(["success" => true, "message_en" => "Achievement created successfully.", "message_ar" => "تم إضافة الإنجاز بنجاح."]);
    } else {
        http_response_code(503);
        echo json_encode(["success" => false, "message_en" => "Unable to create achievement.", "message_ar" => "تعذر إضافة الإنجاز."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message_en" => "Please provide both Arabic and English titles.", "message_ar" => "يرجى تقديم العنوانين باللغتين العربية والإنجليزية."]);
}
?>

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

if (!empty($data->id)) {
    $achievement->id = $data->id;

    if ($achievement->delete()) {
        http_response_code(200);
        echo json_encode(["success" => true, "message_en" => "Achievement deleted successfully.", "message_ar" => "تم حذف الإنجاز بنجاح."]);
    } else {
        http_response_code(503);
        echo json_encode(["success" => false, "message_en" => "Unable to delete achievement.", "message_ar" => "تعذر حذف الإنجاز."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message_en" => "Missing achievement ID.", "message_ar" => "معرّف الإنجاز مفقود."]);
}
?>

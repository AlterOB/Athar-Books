<?php
// Initialize headers and CORS
include_once __DIR__ . '/../../utils/cors.php';
header("Content-Type: application/json; charset=UTF-8");

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
    exit();
}

include_once __DIR__ . '/../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Read JSON body
$data = json_decode(file_get_contents("php://input"));

if (empty($data->admin_id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message_en" => "Admin ID is required.", "message_ar" => "معرّف المدير مطلوب."]);
    exit();
}

$admin_id = htmlspecialchars(strip_tags(trim($data->admin_id)));

// Check if ID exists in admins table
$stmt = $db->prepare("SELECT id FROM admins WHERE id = :id LIMIT 1");
$stmt->bindParam(':id', $admin_id);
$stmt->execute();

if ($stmt->rowCount() > 0) {
    http_response_code(200);
    echo json_encode(["success" => true, "message_en" => "Access granted.", "message_ar" => "تم الدخول بنجاح."]);
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "message_en" => "Invalid admin ID.", "message_ar" => "معرّف المدير غير صحيح."]);
}
?>

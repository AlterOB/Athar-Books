<?php
include_once __DIR__ . '/../../utils/cors.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
    exit();
}

include_once __DIR__ . '/../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (empty($data->id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message_en" => "Book ID is required.", "message_ar" => "معرّف الكتاب مطلوب."]);
    exit();
}

$id = (int) $data->id;

$stmt = $db->prepare("DELETE FROM books WHERE id = :id");
$stmt->bindParam(':id', $id, PDO::PARAM_INT);

if ($stmt->execute() && $stmt->rowCount() > 0) {
    echo json_encode(["success" => true, "message_en" => "Book deleted successfully.", "message_ar" => "تم حذف الكتاب بنجاح."]);
} else {
    http_response_code(404);
    echo json_encode(["success" => false, "message_en" => "Book not found or already deleted.", "message_ar" => "الكتاب غير موجود أو تم حذفه بالفعل."]);
}
?>

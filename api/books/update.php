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

if (empty($data->id) || empty($data->book_number) || empty($data->title)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message_en" => "ID, book number and title are required.", "message_ar" => "المعرّف ورقم الكتاب والعنوان مطلوبة."]);
    exit();
}

$id          = (int) $data->id;
$book_number = (int) $data->book_number;
$title       = htmlspecialchars(strip_tags(trim($data->title)));
$copies      = isset($data->copies) ? (int) $data->copies : 1;
$is_available = isset($data->is_available) ? (int) $data->is_available : 1;

// Check unique book_number (excluding current book)
$check = $db->prepare("SELECT id FROM books WHERE book_number = :book_number AND id != :id LIMIT 1");
$check->bindParam(':book_number', $book_number, PDO::PARAM_INT);
$check->bindParam(':id', $id, PDO::PARAM_INT);
$check->execute();
if ($check->rowCount() > 0) {
    http_response_code(409);
    echo json_encode(["success" => false, "message_en" => "Another book with this number already exists.", "message_ar" => "يوجد كتاب آخر بهذا الرقم بالفعل."]);
    exit();
}

$stmt = $db->prepare("UPDATE books SET book_number = :book_number, title = :title, copies = :copies, is_available = :is_available WHERE id = :id");
$stmt->bindParam(':book_number', $book_number, PDO::PARAM_INT);
$stmt->bindParam(':title', $title);
$stmt->bindParam(':copies', $copies, PDO::PARAM_INT);
$stmt->bindParam(':is_available', $is_available, PDO::PARAM_INT);
$stmt->bindParam(':id', $id, PDO::PARAM_INT);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message_en" => "Book updated successfully.", "message_ar" => "تم تحديث الكتاب بنجاح."]);
} else {
    http_response_code(503);
    echo json_encode(["success" => false, "message_en" => "Failed to update book.", "message_ar" => "فشل في تحديث الكتاب."]);
}
?>

<?php
include_once __DIR__ . '/../../utils/cors.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
    exit();
}

include_once __DIR__ . '/../../config/database.php';
include_once __DIR__ . '/../../models/Book.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (empty($data->book_number) || empty($data->title)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message_en" => "Book number and title are required.", "message_ar" => "رقم الكتاب والعنوان مطلوبان."]);
    exit();
}

$book_number = (int) $data->book_number;
$title       = htmlspecialchars(strip_tags(trim($data->title)));
$copies      = isset($data->copies) ? (int) $data->copies : 1;
$is_available = isset($data->is_available) ? (int) $data->is_available : 1;

// Check unique book_number
$check = $db->prepare("SELECT id FROM books WHERE book_number = :book_number LIMIT 1");
$check->bindParam(':book_number', $book_number, PDO::PARAM_INT);
$check->execute();
if ($check->rowCount() > 0) {
    http_response_code(409);
    echo json_encode(["success" => false, "message_en" => "A book with this number already exists.", "message_ar" => "يوجد كتاب بهذا الرقم بالفعل."]);
    exit();
}

$stmt = $db->prepare("INSERT INTO books (book_number, title, copies, is_available) VALUES (:book_number, :title, :copies, :is_available)");
$stmt->bindParam(':book_number', $book_number, PDO::PARAM_INT);
$stmt->bindParam(':title', $title);
$stmt->bindParam(':copies', $copies, PDO::PARAM_INT);
$stmt->bindParam(':is_available', $is_available, PDO::PARAM_INT);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(["success" => true, "message_en" => "Book added successfully.", "message_ar" => "تم إضافة الكتاب بنجاح.", "id" => (int)$db->lastInsertId()]);
} else {
    http_response_code(503);
    echo json_encode(["success" => false, "message_en" => "Failed to add book.", "message_ar" => "فشل في إضافة الكتاب."]);
}
?>

<?php
// Initialize headers and CORS
include_once __DIR__ . '/../../utils/cors.php';
header("Content-Type: application/json; charset=UTF-8");

// This endpoint accepts POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed. Use POST."]);
    exit();
}

// Includes
include_once __DIR__ . '/../../config/database.php';
include_once __DIR__ . '/../../models/BorrowRequest.php';

// Instantiate DB & connect
$database = new Database();
$db = $database->getConnection();

// Instantiate BorrowRequest object
$request = new BorrowRequest($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (empty($data->member_number) || empty($data->book_id)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message_en" => "Please provide both member number and book ID.",
        "message_ar" => "يرجى إدخال رقم العضوية ورقم الكتاب."
    ]);
    exit();
}

// Sanitize
$member_number = htmlspecialchars(strip_tags($data->member_number));
$book_id = (int) $data->book_id;

// Create the request
$result = $request->create($member_number, $book_id);

if ($result['success']) {
    http_response_code(201);
} else {
    http_response_code(400);
}

echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>

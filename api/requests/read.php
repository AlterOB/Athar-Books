<?php
// Initialize headers and CORS
include_once __DIR__ . '/../../utils/cors.php';
header("Content-Type: application/json; charset=UTF-8");

// Includes
include_once __DIR__ . '/../../config/database.php';
include_once __DIR__ . '/../../models/BorrowRequest.php';

// Instantiate DB & connect
$database = new Database();
$db = $database->getConnection();

// Instantiate BorrowRequest object
$request = new BorrowRequest($db);

// Query all requests
$stmt = $request->getAll();
$num = $stmt->rowCount();

$requests_arr = array();
$requests_arr["records"] = array();

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    extract($row);
    $request_item = array(
        "id" => $id,
        "member_number" => $member_number,
        "first_name" => $first_name,
        "last_name" => $last_name,
        "email" => $email,
        "book_id" => $book_id,
        "book_title" => $book_title,
        "status" => $status,
        "created_at" => $created_at
    );
    array_push($requests_arr["records"], $request_item);
}

http_response_code(200);
echo json_encode($requests_arr, JSON_UNESCAPED_UNICODE);
?>

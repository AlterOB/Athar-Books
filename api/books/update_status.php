<?php
// Initialize headers and CORS
include_once __DIR__ . '/../../utils/cors.php';
header("Content-Type: application/json; charset=UTF-8");

// This endpoint accepts POST requests
if($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed. Use POST."]);
    exit();
}

// Includes
include_once __DIR__ . '/../../config/database.php';
include_once __DIR__ . '/../../models/Book.php';

// Instantiate DB & connect
$database = new Database();
$db = $database->getConnection();

// Instantiate book object
$book = new Book($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Ensure data is not empty
if (!empty($data->id) && isset($data->is_available)) {
    // Validate is_available
    if($data->is_available !== 0 && $data->is_available !== 1) {
        http_response_code(400); // Bad Request
        echo json_encode(array("message" => "Invalid status value. Must be 0 or 1."));
        exit();
    }
    
    // Set ID property of book to be edited
    if ($book->updateAvailability($data->id, $data->is_available)) {
        http_response_code(200); // 200 OK
        echo json_encode(array(
            "message" => "Book status successfully updated.",
            "book_id" => $data->id,
            "new_status" => $data->is_available
        ));
    } else {
        http_response_code(503); // Service Unavailable
        echo json_encode(array("message" => "Unable to update book status."));
    }
} else {
    // Details incomplete
    http_response_code(400); // Bad request
    echo json_encode(array("message" => "Unable to update book. Data is incomplete. Please provide 'id' and 'is_available'."));
}
?>

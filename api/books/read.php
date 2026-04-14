<?php
// Initialize headers and CORS
include_once __DIR__ . '/../../utils/cors.php';
header("Content-Type: application/json; charset=UTF-8");

// Includes
include_once __DIR__ . '/../../utils/cors.php';
include_once __DIR__ . '/../../config/database.php';
include_once __DIR__ . '/../../models/Book.php';

// Instantiate DB & connect
$database = new Database();
$db = $database->getConnection();

// Instantiate book object
$book = new Book($db);

// If ?all=1 is passed (admin), return all books; otherwise only available
$showAll = isset($_GET['all']) && $_GET['all'] == '1';
$stmt = $showAll ? $book->getAllBooks() : $book->getAvailableBooks();
$num = $stmt->rowCount();

if ($num > 0) {
    $books_arr = array();
    $books_arr["records"] = array();
    
    // Fetch records
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Extract row to variables
        extract($row);
        
        $book_item = array(
            "id" => $id,
            "book_number" => $book_number,
            "title" => $title,
            "copies" => $copies,
            "is_available" => $is_available
        );
        
        array_push($books_arr["records"], $book_item);
    }
    
    // Set 200 OK
    http_response_code(200);
    echo json_encode($books_arr, JSON_UNESCAPED_UNICODE);
} else {
    // No books found
    http_response_code(404);
    echo json_encode(
        array("message" => "لا توجد كتب متاحة حالياً.")
    );
}
?>

<?php
class Book {
    private $conn;
    private $table_name = "books";

    public $id;
    public $book_number;
    public $title;
    public $copies;
    public $is_available;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all available books
    public function getAvailableBooks() {
        $query = "SELECT id, book_number, title, copies, is_available 
                  FROM " . $this->table_name . " 
                  WHERE is_available = 1 
                  ORDER BY book_number ASC";
                  
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Get all books (for admin/all view)
    public function getAllBooks() {
        $query = "SELECT id, book_number, title, copies, is_available 
                  FROM " . $this->table_name . " 
                  ORDER BY book_number ASC";
                  
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Update book availability (soft delete)
    public function updateAvailability($id, $status) {
        $query = "UPDATE " . $this->table_name . " 
                  SET is_available = :status 
                  WHERE id = :id";
                  
        $stmt = $this->conn->prepare($query);
        
        // Sanitize inputs
        $id = htmlspecialchars(strip_tags($id));
        $status = htmlspecialchars(strip_tags($status));
        
        $stmt->bindParam(':status', $status, PDO::PARAM_INT);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>

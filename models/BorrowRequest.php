<?php
class BorrowRequest {
    private $conn;
    private $table_name = "borrow_requests";

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create a new borrow request
    public function create($member_number, $book_id) {
        // 1. Look up member info
        $memberQuery = "SELECT first_name, last_name, email FROM members WHERE member_number = :member_number LIMIT 1";
        $memberStmt = $this->conn->prepare($memberQuery);
        $memberStmt->bindParam(':member_number', $member_number);
        $memberStmt->execute();

        if ($memberStmt->rowCount() === 0) {
            return ['success' => false, 'message_en' => 'Member not found.', 'message_ar' => 'العضو غير موجود.'];
        }
        $member = $memberStmt->fetch(PDO::FETCH_ASSOC);

        // 2. Look up book info
        $bookQuery = "SELECT id, title, is_available FROM books WHERE book_number = :book_id LIMIT 1";
        $bookStmt = $this->conn->prepare($bookQuery);
        $bookStmt->bindParam(':book_id', $book_id, PDO::PARAM_INT);
        $bookStmt->execute();

        if ($bookStmt->rowCount() === 0) {
            return ['success' => false, 'message_en' => 'Book not found.', 'message_ar' => 'الكتاب غير موجود.'];
        }
        $book = $bookStmt->fetch(PDO::FETCH_ASSOC);

        if ((int)$book['is_available'] === 0) {
            return ['success' => false, 'message_en' => 'This book is currently unavailable.', 'message_ar' => 'هذا الكتاب غير متاح حالياً.'];
        }

        // 3. Insert the borrow request
        $insertQuery = "INSERT INTO " . $this->table_name . " 
                        (member_number, first_name, last_name, email, book_id, book_title, status)
                        VALUES (:member_number, :first_name, :last_name, :email, :book_id, :book_title, 'pending')";
        $insertStmt = $this->conn->prepare($insertQuery);
        $insertStmt->bindParam(':member_number', $member_number);
        $insertStmt->bindParam(':first_name', $member['first_name']);
        $insertStmt->bindParam(':last_name', $member['last_name']);
        $insertStmt->bindParam(':email', $member['email']);
        $insertStmt->bindParam(':book_id', $book['id'], PDO::PARAM_INT);
        $insertStmt->bindParam(':book_title', $book['title']);

        if ($insertStmt->execute()) {
            return ['success' => true, 'message_en' => 'Borrowing request submitted successfully!', 'message_ar' => 'تم إرسال طلب الاستعارة بنجاح!'];
        }
        return ['success' => false, 'message_en' => 'Unable to submit request.', 'message_ar' => 'تعذر إرسال الطلب.'];
    }

    // Get all borrow requests (for admin)
    public function getAll() {
        $query = "SELECT id, member_number, first_name, last_name, email, book_id, book_title, status, created_at
                  FROM " . $this->table_name . "
                  ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}
?>

<?php
class Achievement {
    private $conn;
    private $table_name = "achievements";

    public $id;
    public $title_ar;
    public $title_en;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all achievements
    public function getAll() {
        $query = "SELECT id, title_ar, title_en FROM " . $this->table_name . " ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Create achievement
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET title_ar=:title_ar, title_en=:title_en";
        $stmt = $this->conn->prepare($query);
        
        $this->title_ar = htmlspecialchars(strip_tags($this->title_ar));
        $this->title_en = htmlspecialchars(strip_tags($this->title_en));
        
        $stmt->bindParam(":title_ar", $this->title_ar);
        $stmt->bindParam(":title_en", $this->title_en);
        
        if($stmt->execute()) { return true; }
        return false;
    }

    // Update achievement
    public function update() {
        $query = "UPDATE " . $this->table_name . " SET title_ar=:title_ar, title_en=:title_en WHERE id=:id";
        $stmt = $this->conn->prepare($query);
        
        $this->title_ar = htmlspecialchars(strip_tags($this->title_ar));
        $this->title_en = htmlspecialchars(strip_tags($this->title_en));
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        $stmt->bindParam(":title_ar", $this->title_ar);
        $stmt->bindParam(":title_en", $this->title_en);
        $stmt->bindParam(":id", $this->id);
        
        if($stmt->execute()) { return true; }
        return false;
    }

    // Delete achievement
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id=:id";
        $stmt = $this->conn->prepare($query);
        
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(":id", $this->id);
        
        if($stmt->execute() && $stmt->rowCount() > 0) { return true; }
        return false;
    }
}
?>

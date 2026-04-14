<?php
include_once __DIR__ . '/../../utils/cors.php';
header("Content-Type: application/json; charset=UTF-8");

include_once __DIR__ . '/../../config/database.php';
include_once __DIR__ . '/../../models/Achievement.php';

$database = new Database();
$db = $database->getConnection();
$achievement = new Achievement($db);

$stmt = $achievement->getAll();
$num = $stmt->rowCount();

if ($num > 0) {
    $achievements_arr = array();
    $achievements_arr["records"] = array();
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $item = array(
            "id" => $id,
            "title_ar" => html_entity_decode($title_ar),
            "title_en" => html_entity_decode($title_en)
        );
        array_push($achievements_arr["records"], $item);
    }
    
    http_response_code(200);
    echo json_encode($achievements_arr, JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "No achievements found."));
}
?>

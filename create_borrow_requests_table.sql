-- ============================================================
-- Athar Educational Club - Borrow Requests Table
-- ============================================================
-- Run this AFTER create_members_table.sql has been executed.

USE athar_library;

CREATE TABLE IF NOT EXISTS borrow_requests (
    id              INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    member_number   VARCHAR(4)          NOT NULL,
    first_name      VARCHAR(100)        NOT NULL,
    last_name       VARCHAR(100)        NOT NULL,
    email           VARCHAR(255)        NOT NULL,
    book_id         INT UNSIGNED        NOT NULL,
    book_title      VARCHAR(500)        NOT NULL,
    status          ENUM('pending','approved','rejected','returned')
                                        NOT NULL DEFAULT 'pending',
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP
                                                 ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_member_number (member_number),
    INDEX idx_book_id       (book_id),
    INDEX idx_status        (status)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

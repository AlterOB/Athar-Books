-- ============================================================
-- Athar Educational Club - Admins Table
-- ============================================================
-- Run this against the athar_library database.
-- Insert admin IDs manually; there is no self-registration.

USE athar_library;

CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(20) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- Insert admin IDs manually, e.g.:
-- INSERT INTO admins (id) VALUES ('1234');

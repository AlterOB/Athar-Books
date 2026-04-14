-- ============================================================
-- Athar Educational Club - Achievements Table
-- ============================================================
-- Run this against the athar_library database.

USE athar_library;

CREATE TABLE IF NOT EXISTS achievements (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title_ar VARCHAR(1000) NOT NULL,
    title_en VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserting the existing hardcoded achievements
INSERT INTO achievements (title_ar, title_en) VALUES 
('تأسيس تعاونات دائمة مع نادي إرم ومجتمع بنيان', 'Establishing lasting partnerships with Iram Club and Binyan Community'),
('تأسيس مكتبة أثر، تحتوي على أكثر من ٥٠ كتاب ورقي جاهز للإعارة', 'Establishing Athar Library with over 50 physical books ready for borrowing'),
('ملتقى أثر الصيفي الأول', 'First Athar Summer Forum'),
('جلسات نقاشية وندوات أدبية وثقافية', 'Discussion sessions and literary and cultural seminars'),
('مسابقات ثقافية متنوعة', 'Diverse cultural competitions'),
('مبادرات أثر', 'Athar initiatives');

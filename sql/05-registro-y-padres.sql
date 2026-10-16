-- =============================================================
-- 05: Registro de cuentas y portal de padres
--   * Nuevo rol PADRE en usuarios
--   * Vínculo usuario -> apoderado (para que el padre vea a sus hijos)
-- Se puede ejecutar varias veces sin romper nada.
-- =============================================================
USE sistema_estudiantes;

ALTER TABLE usuarios
    MODIFY COLUMN rol ENUM('ADMIN','SECRETARIA','PADRE') NOT NULL;

SET @col := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
             WHERE TABLE_SCHEMA = 'sistema_estudiantes'
               AND TABLE_NAME = 'usuarios'
               AND COLUMN_NAME = 'apoderado_id');
SET @sql := IF(@col = 0,
    'ALTER TABLE usuarios ADD COLUMN apoderado_id BIGINT NULL AFTER rol',
    'SELECT "columna apoderado_id ya existe"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @fk := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
            WHERE TABLE_SCHEMA = 'sistema_estudiantes'
              AND TABLE_NAME = 'usuarios'
              AND CONSTRAINT_NAME = 'fk_usuarios_apoderado');
SET @sql := IF(@fk = 0,
    'ALTER TABLE usuarios ADD CONSTRAINT fk_usuarios_apoderado FOREIGN KEY (apoderado_id) REFERENCES apoderados (id) ON UPDATE CASCADE ON DELETE SET NULL',
    'SELECT "fk_usuarios_apoderado ya existe"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Emails vacíos guardados como '' chocan con la restricción UNIQUE: se pasan a NULL
UPDATE usuarios SET email = NULL WHERE email = '';


USE sistema_estudiantes;

ALTER TABLE estudiantes
    MODIFY COLUMN nivel ENUM('INICIAL','PRIMARIA','SECUNDARIA','EGRESADO') NOT NULL;

SET @col := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
             WHERE TABLE_SCHEMA = 'sistema_estudiantes'
               AND TABLE_NAME = 'estudiantes'
               AND COLUMN_NAME = 'carrera_tecnica');
SET @sql := IF(@col = 0,
    'ALTER TABLE estudiantes ADD COLUMN carrera_tecnica VARCHAR(60) NULL AFTER estado_matricula',
    'SELECT "columna carrera_tecnica ya existe"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;


SET @col := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
             WHERE TABLE_SCHEMA = 'sistema_estudiantes'
               AND TABLE_NAME = 'estudiantes'
               AND COLUMN_NAME = 'promocion');
SET @sql := IF(@col = 0,
    'ALTER TABLE estudiantes ADD COLUMN promocion VARCHAR(60) NULL AFTER carrera_tecnica',
    'SELECT "columna promocion ya existe"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;


INSERT INTO estudiantes
    (tipo_documento, numero_documento, apellido_paterno, apellido_materno, nombres,
     sexo, fecha_nacimiento, nivel, grado, seccion, anio_cursado, estado_matricula,
     carrera_tecnica, promocion)
VALUES
    ('DNI','45829103','MENDOZA','VALDIVIA','RICARDO','M','2005-04-11','EGRESADO','EGRESADO','-',2023,'DEFINITIVA','Computación e Informática','San José'),
    ('DNI','71203948','QUISPE','RAMOS','MARIA ELENA','F','2005-09-02','EGRESADO','EGRESADO','-',2023,'DEFINITIVA','Gastronomía','San José'),
    ('DNI','39384721','SANCHEZ','PINEDA','JORGE','M','2004-01-15','EGRESADO','EGRESADO','-',2022,'DEFINITIVA','Electrónica Industrial','Santa Rosa'),
    ('DNI','42881023','TORRES','CASTRO','ANDREA','F','2004-06-20','EGRESADO','EGRESADO','-',2022,'DEFINITIVA','Contabilidad','Santa Rosa'),
    ('DNI','40924185','ESPINOZA','LEON','JULIO CESAR','M','2003-11-08','EGRESADO','EGRESADO','-',2021,'DEFINITIVA','Mecánica Automotriz','San Martín')
ON DUPLICATE KEY UPDATE numero_documento = numero_documento;

SELECT nivel, COUNT(*) AS total FROM estudiantes GROUP BY nivel;

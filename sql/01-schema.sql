

DROP DATABASE IF EXISTS sistema_estudiantes;
CREATE DATABASE sistema_estudiantes
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE sistema_estudiantes;


CREATE TABLE usuarios (
    id              BIGINT       NOT NULL AUTO_INCREMENT,
    username        VARCHAR(60)  NOT NULL,
    password_hash   VARCHAR(100) NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    email           VARCHAR(120) NULL,
    rol             ENUM('ADMIN','SECRETARIA') NOT NULL,
    activo          BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_usuarios PRIMARY KEY (id),
    CONSTRAINT uk_usuarios_username UNIQUE (username),
    CONSTRAINT uk_usuarios_email    UNIQUE (email)
) ENGINE=InnoDB;


CREATE TABLE apoderados (
    id               BIGINT       NOT NULL AUTO_INCREMENT,
    dni              VARCHAR(15)  NOT NULL,
    nombres          VARCHAR(100) NOT NULL,
    apellidos        VARCHAR(100) NOT NULL,
    telefono         VARCHAR(20)  NOT NULL,
    email            VARCHAR(120) NULL,
    parentesco       ENUM('MADRE','PADRE','TUTOR','ABUELO','ABUELA','TIO','TIA','OTRO') NOT NULL,
    direccion        VARCHAR(200) NULL,
    creado_en        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_apoderados PRIMARY KEY (id),
    CONSTRAINT uk_apoderados_dni UNIQUE (dni),
    INDEX ix_apoderados_apellidos (apellidos)
) ENGINE=InnoDB;


CREATE TABLE estudiantes (
    id                  BIGINT       NOT NULL AUTO_INCREMENT,
    codigo_estudiante   VARCHAR(20)  NULL,
    tipo_documento      ENUM('DNI','CARNET_EXTRANJERIA','PASAPORTE') NOT NULL DEFAULT 'DNI',
    numero_documento    VARCHAR(15)  NOT NULL,
    apellido_paterno    VARCHAR(60)  NOT NULL,
    apellido_materno    VARCHAR(60)  NOT NULL,
    nombres             VARCHAR(120) NOT NULL,
    sexo                ENUM('M','F') NOT NULL,
    fecha_nacimiento    DATE         NOT NULL,
    telefono            VARCHAR(20)  NULL,
    direccion           VARCHAR(200) NULL,

    nivel               ENUM('INICIAL','PRIMARIA','SECUNDARIA','EGRESADO') NOT NULL,
    grado               VARCHAR(30)  NOT NULL,
    seccion             VARCHAR(5)   NOT NULL,
    anio_cursado        INT          NOT NULL,

    estado_matricula    ENUM('DEFINITIVA','PROVISIONAL','RETIRADO','TRASLADADO') NOT NULL DEFAULT 'DEFINITIVA',
    carrera_tecnica     VARCHAR(60)  NULL,
    promocion           VARCHAR(60)  NULL,
    apoderado_id        BIGINT       NULL,
    creado_por          BIGINT       NULL,
    creado_en           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_estudiantes PRIMARY KEY (id),
    CONSTRAINT uk_estudiantes_numero_doc UNIQUE (numero_documento),
    CONSTRAINT uk_estudiantes_codigo     UNIQUE (codigo_estudiante),

    CONSTRAINT fk_estudiantes_apoderado
        FOREIGN KEY (apoderado_id) REFERENCES apoderados (id)
        ON UPDATE CASCADE ON DELETE SET NULL,

    CONSTRAINT fk_estudiantes_creado_por
        FOREIGN KEY (creado_por) REFERENCES usuarios (id)
        ON UPDATE CASCADE ON DELETE SET NULL,

    INDEX ix_estudiantes_nivel_grado_secc (nivel, grado, seccion),
    INDEX ix_estudiantes_apellidos        (apellido_paterno, apellido_materno),
    INDEX ix_estudiantes_anio             (anio_cursado)
) ENGINE=InnoDB;


SHOW TABLES;

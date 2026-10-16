CREATE TABLE pagos (
    id              BIGINT       NOT NULL AUTO_INCREMENT,
    apoderado_id    BIGINT       NOT NULL,
    descripcion     VARCHAR(255) NOT NULL,
    monto           DECIMAL(10,2) NOT NULL,
    fecha_pago      DATE         NOT NULL,
    concepto        ENUM('PENSION','CUOTA_EXTRA','UNIFORME','MATERIALES','OTRO') NOT NULL,
    estado          ENUM('PAGADO','PENDIENTE','ATRASADO') NOT NULL DEFAULT 'PENDIENTE',
    comprobante     VARCHAR(100) NULL,
    observaciones   VARCHAR(500) NULL,
    creado_en       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_pagos PRIMARY KEY (id),
    CONSTRAINT fk_pagos_apoderado
        FOREIGN KEY (apoderado_id) REFERENCES apoderados (id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    INDEX ix_pagos_apoderado (apoderado_id),
    INDEX ix_pagos_fecha (fecha_pago),
    INDEX ix_pagos_estado (estado)
) ENGINE=InnoDB;

CREATE TABLE asistencias_reuniones (
    id              BIGINT       NOT NULL AUTO_INCREMENT,
    apoderado_id    BIGINT       NOT NULL,
    titulo_reunion  VARCHAR(255) NOT NULL,
    fecha_reunion   DATE         NOT NULL,
    hora_reunion    TIME         NULL,
    asistio         BOOLEAN      NOT NULL DEFAULT FALSE,
    observaciones   VARCHAR(500) NULL,
    creado_en       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_asistencias PRIMARY KEY (id),
    CONSTRAINT fk_asistencias_apoderado
        FOREIGN KEY (apoderado_id) REFERENCES apoderados (id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    INDEX ix_asistencias_apoderado (apoderado_id),
    INDEX ix_asistencias_fecha (fecha_reunion),
    INDEX ix_asistencias_asistio (asistio)
) ENGINE=InnoDB;

SHOW TABLES;

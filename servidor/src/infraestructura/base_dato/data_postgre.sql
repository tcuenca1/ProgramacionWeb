CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100),
    telefono VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS evento_outbox (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(255) NOT NULL,
    playload JSONB NOT NULL,
    publicado BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS auditoria_evento (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    publicado BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS administrador (
    nivel_acceso INT NOT NULL,
    departamento VARCHAR(100) NOT NULL
) INHERITS (usuario);

CREATE TABLE IF NOT EXISTS personal (
    turno VARCHAR(50) NOT NULL,
    codigo_empleado VARCHAR(50) NOT NULL
) INHERITS (usuario);

CREATE TABLE IF NOT EXISTS invitado (
    motivo_visita VARCHAR(255) NOT NULL,
    fecha_expiracion TIMESTAMP NOT NULL
) INHERITS (usuario);
    
INSERT INTO administrador (nombre, contrasena, tipo, nivel_acceso, departamento, ciudad, telefono) 
VALUES ('juan', 'perez', 'Administrador', 3, 'Sistemas', 'Bogotá', '3001234567');

INSERT INTO personal (nombre, contrasena, tipo, turno, codigo_empleado, ciudad, telefono) 
VALUES ('personal1', 'perspass123', 'Personal', 'Matutino', 'EMP-001', 'Medellín', '3109876543');

INSERT INTO invitado (nombre, contrasena, tipo, motivo_visita, fecha_expiracion, ciudad, telefono) 
VALUES ('invitado1', 'invpass123', 'Invitado', 'Reunión de negocios', '2026-12-31 23:59:59', 'Cali', '3201112233');

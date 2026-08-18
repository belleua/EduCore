-- Esquema inicial - Sprint 1
-- Cubre HU-01, HU-02, HU-03, HU-04, HU-05, HU-07, HU-08, HU-10, HU-11

CREATE TABLE IF NOT EXISTS escuelas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    direccion VARCHAR(255) NOT NULL,
    contacto VARCHAR(100) NOT NULL,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

-- HU-02 / HU-03: roles = administrador, docente, padre, estudiante
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('administrador', 'docente', 'padre', 'estudiante')),
    escuela_id INTEGER REFERENCES escuelas(id),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

-- HU-04 / HU-05: expediente digital del estudiante
CREATE TABLE IF NOT EXISTS estudiantes (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    documento_identidad VARCHAR(30) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    grado VARCHAR(30) NOT NULL,
    tutor_id INTEGER REFERENCES usuarios(id),
    escuela_id INTEGER NOT NULL REFERENCES escuelas(id),
    registrado_por INTEGER REFERENCES usuarios(id),
    creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (documento_identidad, escuela_id)
);

-- HU-07 / HU-08: inscripcion en linea
CREATE TABLE IF NOT EXISTS inscripciones (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER REFERENCES estudiantes(id),
    solicitado_por INTEGER NOT NULL REFERENCES usuarios(id),
    escuela_id INTEGER NOT NULL REFERENCES escuelas(id),
    grado VARCHAR(30) NOT NULL,
    periodo VARCHAR(20) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Aprobada', 'Rechazada')),
    motivo_rechazo VARCHAR(255),
    revisado_por INTEGER REFERENCES usuarios(id),
    creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
    revisado_en TIMESTAMP
);

-- HU-10 / HU-11: calificaciones
CREATE TABLE IF NOT EXISTS calificaciones (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER NOT NULL REFERENCES estudiantes(id),
    docente_id INTEGER NOT NULL REFERENCES usuarios(id),
    curso VARCHAR(100) NOT NULL,
    asignatura VARCHAR(100) NOT NULL,
    periodo VARCHAR(20) NOT NULL,
    calificacion NUMERIC(5,2) NOT NULL CHECK (calificacion >= 0 AND calificacion <= 100),
    creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Crear tabla alumnos
CREATE TABLE IF NOT EXISTS alumnos (
  id BIGINT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  cedula VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255),
  curso VARCHAR(100),
  usuario VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  bloqueado BOOLEAN DEFAULT FALSE,
  mensajeBloqueo TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla docentes
CREATE TABLE IF NOT EXISTS docentes (
  id BIGINT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255),
  cedula VARCHAR(20),
  email VARCHAR(255),
  usuario VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  asignaturas TEXT[] DEFAULT ARRAY[]::TEXT[],
  cambiosBloqueados BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla asignaturas
CREATE TABLE IF NOT EXISTS asignaturas (
  id BIGINT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  docente VARCHAR(255),
  curso VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla calificaciones
CREATE TABLE IF NOT EXISTS calificaciones (
  id BIGINT PRIMARY KEY DEFAULT nextval('calificaciones_id_seq'),
  alumno_id BIGINT REFERENCES alumnos(id) ON DELETE CASCADE,
  asignatura_id BIGINT REFERENCES asignaturas(id) ON DELETE CASCADE,
  calificacion DECIMAL(4,2),
  fecha DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

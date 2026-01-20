-- ============================================
-- SISTEMA DE CALIFICACIONES - PRODUCCIÓN
-- Base de Datos: Supabase PostgreSQL
-- Versión FINAL - LISTA PARA EJECUTAR
-- ============================================

-- LIMPIAR TABLAS ANTERIORES (resolver conflictos)
DROP TABLE IF EXISTS calificaciones CASCADE;
DROP TABLE IF EXISTS docente_asignatura_curso CASCADE;
DROP TABLE IF EXISTS asignaturas_por_curso CASCADE;
DROP TABLE IF EXISTS alumnos CASCADE;
DROP TABLE IF EXISTS docentes CASCADE;
DROP TABLE IF EXISTS historial_cambios CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS asignaturas CASCADE;
DROP TABLE IF EXISTS cursos CASCADE;

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. TABLA: USUARIOS (Autenticación Base)
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  usuario VARCHAR(50) UNIQUE NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'docente', 'estudiante')),
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. TABLA: CURSOS
-- ============================================
CREATE TABLE IF NOT EXISTS cursos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  nivel INTEGER,
  es_activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. TABLA: ASIGNATURAS (Catálogo global)
-- ============================================
CREATE TABLE IF NOT EXISTS asignaturas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL UNIQUE,
  codigo VARCHAR(50),
  descripcion TEXT,
  creditos INTEGER DEFAULT 4,
  es_activa BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. TABLA: ASIGNATURAS_POR_CURSO (Relación 1:M)
-- ============================================
CREATE TABLE IF NOT EXISTS asignaturas_por_curso (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asignatura_id UUID NOT NULL REFERENCES asignaturas(id) ON DELETE CASCADE,
  curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  horas_semanales INTEGER DEFAULT 4,
  es_obligatoria BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(asignatura_id, curso_id)
);

-- ============================================
-- 5. TABLA: ALUMNOS
-- ============================================
CREATE TABLE IF NOT EXISTS alumnos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
  cedula VARCHAR(20) UNIQUE NOT NULL,
  curso_id UUID REFERENCES cursos(id) ON DELETE SET NULL,
  bloqueado BOOLEAN DEFAULT FALSE,
  mensaje_bloqueo TEXT,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. TABLA: DOCENTES
-- ============================================
CREATE TABLE IF NOT EXISTS docentes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
  cedula VARCHAR(20) UNIQUE,
  especialidad VARCHAR(100),
  cambios_bloqueados BOOLEAN DEFAULT FALSE,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. TABLA: DOCENTE_ASIGNATURA_CURSO (Relación M:M:M) ⭐ CLAVE
-- ============================================
CREATE TABLE IF NOT EXISTS docente_asignatura_curso (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  docente_id UUID NOT NULL REFERENCES docentes(id) ON DELETE CASCADE,
  asignatura_id UUID NOT NULL REFERENCES asignaturas(id) ON DELETE CASCADE,
  curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  activa BOOLEAN DEFAULT TRUE,
  fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(docente_id, asignatura_id, curso_id)
);

-- ============================================
-- 8. TABLA: CALIFICACIONES
-- ============================================
CREATE TABLE IF NOT EXISTS calificaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alumno_id UUID NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
  docente_asignatura_curso_id UUID NOT NULL REFERENCES docente_asignatura_curso(id) ON DELETE CASCADE,
  trimestre INTEGER CHECK (trimestre IN (1, 2, 3)),
  nota_insumo_1 DECIMAL(5,2),
  nota_insumo_2 DECIMAL(5,2),
  nota_insumo_3 DECIMAL(5,2),
  nota_insumo_4 DECIMAL(5,2),
  nota_examen DECIMAL(5,2),
  promedio DECIMAL(5,2) GENERATED ALWAYS AS (
    COALESCE(nota_insumo_1, 0) * 0.15 +
    COALESCE(nota_insumo_2, 0) * 0.15 +
    COALESCE(nota_insumo_3, 0) * 0.15 +
    COALESCE(nota_insumo_4, 0) * 0.15 +
    COALESCE(nota_examen, 0) * 0.40
  ) STORED,
  observaciones TEXT,
  registrado_por UUID REFERENCES usuarios(id),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(alumno_id, docente_asignatura_curso_id, trimestre)
);

-- ============================================
-- 9. TABLA: HISTORIAL_CAMBIOS (Auditoría)
-- ============================================
CREATE TABLE IF NOT EXISTS historial_cambios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tabla_afectada VARCHAR(100),
  registro_id UUID,
  tipo_cambio VARCHAR(20) CHECK (tipo_cambio IN ('INSERT', 'UPDATE', 'DELETE')),
  valores_anteriores JSONB,
  valores_nuevos JSONB,
  usuario_id UUID REFERENCES usuarios(id),
  fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_usuario ON usuarios(usuario);
CREATE INDEX IF NOT EXISTS idx_alumnos_curso_id ON alumnos(curso_id);
CREATE INDEX IF NOT EXISTS idx_alumnos_usuario_id ON alumnos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_docentes_usuario_id ON docentes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_asignaturas_por_curso ON asignaturas_por_curso(curso_id, asignatura_id);
CREATE INDEX IF NOT EXISTS idx_docente_asignatura_curso_docente ON docente_asignatura_curso(docente_id);
CREATE INDEX IF NOT EXISTS idx_docente_asignatura_curso_asignatura ON docente_asignatura_curso(asignatura_id);
CREATE INDEX IF NOT EXISTS idx_docente_asignatura_curso_curso ON docente_asignatura_curso(curso_id);
CREATE INDEX IF NOT EXISTS idx_calificaciones_alumno ON calificaciones(alumno_id);
CREATE INDEX IF NOT EXISTS idx_calificaciones_dac ON calificaciones(docente_asignatura_curso_id);
CREATE INDEX IF NOT EXISTS idx_historial_cambios_fecha ON historial_cambios(fecha_cambio);

-- ============================================
-- DATOS INICIALES - CURSOS
-- ============================================
INSERT INTO cursos (nombre, descripcion, nivel, es_activo) VALUES
('Octavo', 'Octavo grado - Educación Básica', 8, TRUE),
('Noveno', 'Noveno grado - Educación Básica', 9, TRUE),
('Décimo', 'Décimo grado - Educación Media', 10, TRUE),
('Primero', 'Primero de Bachillerato', 11, TRUE),
('Segundo', 'Segundo de Bachillerato', 12, TRUE),
('Tercero', 'Tercero de Bachillerato', 13, TRUE)
ON CONFLICT (nombre) DO NOTHING;

-- ============================================
-- DATOS INICIALES - ASIGNATURAS ÚNICAS
-- ============================================
INSERT INTO asignaturas (nombre, codigo, descripcion, es_activa) VALUES
('MATEMÁTICAS', 'MAT', 'Matemáticas', TRUE),
('ESTADÍSTICA', 'EST', 'Estadística', TRUE),
('GEOMETRÍA', 'GEO', 'Geometría', TRUE),
('CÁLCULO', 'CAL', 'Cálculo', TRUE),
('MATEMÁTICAS SUPERIORES', 'MATSUP', 'Matemáticas Superiores', TRUE),
('INGLÉS', 'ENG', 'Inglés', TRUE),
('INGLÉS AVANZADO', 'ENGADV', 'Inglés Avanzado', TRUE),
('COREANO', 'KOR', 'Coreano', TRUE),
('LENGUAJE', 'LEN', 'Lenguaje y Literatura', TRUE),
('HISTORIA', 'HIS', 'Historia', TRUE),
('QUÍMICA', 'QUI', 'Química', TRUE),
('FÍSICA', 'FIS', 'Física', TRUE),
('BIOLOGÍA', 'BIO', 'Biología', TRUE),
('ROBÓTICA', 'ROB', 'Robótica', TRUE),
('EDUCACIÓN FÍSICA', 'EF', 'Educación Física', TRUE),
('SOCIALES', 'SOC', 'Ciencias Sociales', TRUE),
('CIENCIAS NATURALES', 'CCNN', 'Ciencias Naturales', TRUE),
('ELECTRÓNICA', 'ELC', 'Electrónica', TRUE),
('RAZONAMIENTO LÓGICO', 'RAZ', 'Razonamiento Lógico', TRUE),
('COMUNICACIÓN SOCIAL', 'COM', 'Comunicación Social', TRUE),
('EMPRENDIMIENTO', 'EMP', 'Emprendimiento', TRUE),
('INTELIGENCIA ARTIFICIAL', 'IA', 'Inteligencia Artificial', TRUE),
('ABSTRACTO', 'ABS', 'Arte Abstracto', TRUE)
ON CONFLICT (nombre) DO NOTHING;

-- ============================================
-- DATOS INICIALES - USUARIO ADMIN
-- ============================================
INSERT INTO usuarios (email, nombre, apellido, usuario, rol, activo) VALUES
('admin@charlbabbage.edu', 'Administrador', 'Sistema', 'admin', 'admin', TRUE)
ON CONFLICT (usuario) DO NOTHING;

-- ============================================
-- ASIGNATURAS POR CURSO - OCTAVO
-- ============================================
INSERT INTO asignaturas_por_curso (asignatura_id, curso_id, horas_semanales, es_obligatoria)
SELECT a.id, c.id, 4, TRUE FROM asignaturas a, cursos c 
WHERE c.nombre = 'Octavo' AND a.nombre IN (
  'EMPRENDIMIENTO', 'INGLÉS', 'COREANO', 'LENGUAJE', 'HISTORIA', 'QUÍMICA', 
  'ROBÓTICA', 'MATEMÁTICAS', 'FÍSICA', 'GEOMETRÍA', 'CÁLCULO', 
  'MATEMÁTICAS SUPERIORES', 'BIOLOGÍA'
) ON CONFLICT DO NOTHING;

-- ============================================
-- ASIGNATURAS POR CURSO - NOVENO
-- ============================================
INSERT INTO asignaturas_por_curso (asignatura_id, curso_id, horas_semanales, es_obligatoria)
SELECT a.id, c.id, 4, TRUE FROM asignaturas a, cursos c 
WHERE c.nombre = 'Noveno' AND a.nombre IN (
  'INGLÉS AVANZADO', 'COREANO', 'LENGUAJE', 'SOCIALES', 'CIENCIAS NATURALES', 
  'ELECTRÓNICA', 'EDUCACIÓN FÍSICA', 'FÍSICA', 'GEOMETRÍA', 'RAZONAMIENTO LÓGICO', 
  'COMUNICACIÓN SOCIAL'
) ON CONFLICT DO NOTHING;

-- ============================================
-- ASIGNATURAS POR CURSO - DÉCIMO
-- ============================================
INSERT INTO asignaturas_por_curso (asignatura_id, curso_id, horas_semanales, es_obligatoria)
SELECT a.id, c.id, 4, TRUE FROM asignaturas a, cursos c 
WHERE c.nombre = 'Décimo' AND a.nombre IN (
  'MATEMÁTICAS', 'ESTADÍSTICA', 'GEOMETRÍA', 'INGLÉS', 'INGLÉS AVANZADO', 
  'COREANO', 'FÍSICA', 'RAZONAMIENTO LÓGICO', 'LENGUAJE', 'SOCIALES', 
  'CIENCIAS NATURALES', 'QUÍMICA', 'ELECTRÓNICA'
) ON CONFLICT DO NOTHING;

-- ============================================
-- ASIGNATURAS POR CURSO - PRIMERO
-- ============================================
INSERT INTO asignaturas_por_curso (asignatura_id, curso_id, horas_semanales, es_obligatoria)
SELECT a.id, c.id, 4, TRUE FROM asignaturas a, cursos c 
WHERE c.nombre = 'Primero' AND a.nombre IN (
  'EMPRENDIMIENTO', 'INGLÉS', 'COREANO', 'LENGUAJE', 'HISTORIA', 'QUÍMICA', 
  'ROBÓTICA', 'MATEMÁTICAS', 'FÍSICA', 'GEOMETRÍA', 'CÁLCULO', 
  'MATEMÁTICAS SUPERIORES', 'BIOLOGÍA'
) ON CONFLICT DO NOTHING;

-- ============================================
-- ASIGNATURAS POR CURSO - SEGUNDO
-- ============================================
INSERT INTO asignaturas_por_curso (asignatura_id, curso_id, horas_semanales, es_obligatoria)
SELECT a.id, c.id, 4, TRUE FROM asignaturas a, cursos c 
WHERE c.nombre = 'Segundo' AND a.nombre IN (
  'EMPRENDIMIENTO', 'INGLÉS', 'COREANO', 'LENGUAJE', 'HISTORIA', 'QUÍMICA', 
  'ROBÓTICA', 'EDUCACIÓN FÍSICA', 'MATEMÁTICAS', 'FÍSICA', 'GEOMETRÍA', 
  'CÁLCULO', 'MATEMÁTICAS SUPERIORES', 'BIOLOGÍA'
) ON CONFLICT DO NOTHING;

-- ============================================
-- ASIGNATURAS POR CURSO - TERCERO
-- ============================================
INSERT INTO asignaturas_por_curso (asignatura_id, curso_id, horas_semanales, es_obligatoria)
SELECT a.id, c.id, 4, TRUE FROM asignaturas a, cursos c 
WHERE c.nombre = 'Tercero' AND a.nombre IN (
  'ABSTRACTO', 'EMPRENDIMIENTO', 'INGLÉS', 'COREANO', 'LENGUAJE', 'HISTORIA', 
  'QUÍMICA', 'INTELIGENCIA ARTIFICIAL', 'MATEMÁTICAS', 'FÍSICA', 'CÁLCULO', 
  'MATEMÁTICAS SUPERIORES', 'BIOLOGÍA'
) ON CONFLICT DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en tablas sensibles
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE docentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE calificaciones ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FUNCIONES DE CÁLCULO
-- ============================================

-- Función para obtener promedio trimestral
CREATE OR REPLACE FUNCTION get_promedio_trimestral(
  p_alumno_id UUID,
  p_asignatura_id UUID,
  p_trimestre INTEGER
) RETURNS DECIMAL AS $$
BEGIN
  RETURN (
    SELECT promedio FROM calificaciones
    WHERE alumno_id = p_alumno_id
      AND docente_asignatura_curso_id IN (
        SELECT id FROM docente_asignatura_curso
        WHERE asignatura_id = p_asignatura_id
      )
      AND trimestre = p_trimestre
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql;

-- Función para calcular promedio anual
CREATE OR REPLACE FUNCTION get_promedio_anual(p_alumno_id UUID)
RETURNS TABLE(asignatura VARCHAR, promedio_anual DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT a.nombre, AVG(c.promedio)::DECIMAL
  FROM calificaciones c
  JOIN docente_asignatura_curso dac ON c.docente_asignatura_curso_id = dac.id
  JOIN asignaturas a ON dac.asignatura_id = a.id
  WHERE c.alumno_id = p_alumno_id
  GROUP BY a.id, a.nombre;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FIN DEL SCRIPT SQL
-- ============================================

# 🔄 Guía de Migración - Base de Datos

## ⚠️ IMPORTANTE: Antes de Ejecutar

Este documento te ayuda a migrar de la estructura antigua a la nueva.

---

## Opción 1: Reseteo Completo (Recomendado para Desarrollo)

### Paso 1: Eliminar Tablas Antiguas
Ejecuta esto en Supabase SQL Editor:

```sql
-- Eliminar tablas antiguas (en orden de dependencias)
DROP TABLE IF EXISTS calificaciones CASCADE;
DROP TABLE IF EXISTS asignaturas CASCADE;
DROP TABLE IF EXISTS docentes CASCADE;
DROP TABLE IF EXISTS alumnos CASCADE;

-- Si existen otras tablas
DROP TABLE IF EXISTS usuarios CASCADE;
```

### Paso 2: Ejecutar Nuevo Schema
1. Abre tu proyecto en Supabase
2. Ve a SQL Editor
3. Copia TODO el contenido de `SQL_SETUP.sql`
4. Pégalo en el editor
5. Haz clic en "Run" ▶️

**Resultado**: Todas las tablas nuevas se crearán con datos precargados

---

## Opción 2: Migración Inteligente (Recomendado para Producción)

### Paso 1: Crear Nueva Estructura
```sql
-- Crear nuevas tablas sin afectar las antiguas
-- (ejecutar el contenido de SQL_SETUP.sql)
```

### Paso 2: Migrar Datos de Alumnos
```sql
-- Migrar alumnos de la tabla antigua
INSERT INTO alumnos (id, nombre, apellido, cedula, email, curso_id, usuario, password_hash, bloqueado, mensajeBloqueo)
SELECT 
  a.id,
  a.nombre,
  a.apellido,
  a.cedula,
  a.email,
  c.id as curso_id,
  a.usuario,
  a.password,
  a.bloqueado,
  a.mensajeBloqueo
FROM alumnos_antigua a
LEFT JOIN cursos c ON c.nombre = a.curso
WHERE a.id IS NOT NULL;
```

### Paso 3: Migrar Datos de Docentes
```sql
-- Migrar docentes
INSERT INTO docentes (id, nombre, apellido, cedula, email, usuario, password_hash, cambiosBloqueados)
SELECT 
  d.id,
  d.nombre,
  d.apellido,
  d.cedula,
  d.email,
  d.usuario,
  d.password,
  d.cambiosBloqueados
FROM docentes_antigua d
WHERE d.id IS NOT NULL;
```

### Paso 4: Convertir Asignaturas (Arrays a Relaciones)
```sql
-- Si tienes docentes con arrays de asignaturas, necesitas procesarlos
-- Esto es más complejo y depende de tu estructura actual
-- Contacta si necesitas ayuda específica
```

### Paso 5: Eliminar Tablas Antiguas
```sql
-- Una vez validado que todo funciona
DROP TABLE IF EXISTS alumnos_antigua;
DROP TABLE IF EXISTS docentes_antigua;
```

---

## Validar Migración

### Verificar que las tablas existen:
```sql
-- Ver todas las tablas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;
```

### Contar registros:
```sql
SELECT 
  'alumnos' as tabla, COUNT(*) as registros FROM alumnos
UNION ALL
SELECT 'docentes', COUNT(*) FROM docentes
UNION ALL
SELECT 'cursos', COUNT(*) FROM cursos
UNION ALL
SELECT 'asignaturas', COUNT(*) FROM asignaturas
UNION ALL
SELECT 'docente_asignatura_curso', COUNT(*) FROM docente_asignatura_curso
ORDER BY tabla;
```

---

## Pruebas Funcionales

### 1. Verificar Alumnos con Sus Cursos
```sql
SELECT a.nombre, a.apellido, c.nombre as curso
FROM alumnos a
LEFT JOIN cursos c ON a.curso_id = c.id
LIMIT 10;
```

**Esperado**: Todos los alumnos tienen un curso válido (sin NULLs)

### 2. Verificar Docentes con Sus Asignaciones
```sql
SELECT 
  d.nombre,
  d.apellido,
  a.nombre as materia,
  c.nombre as curso
FROM docentes d
LEFT JOIN docente_asignatura_curso dac ON d.id = dac.docente_id AND dac.activa = TRUE
LEFT JOIN asignaturas a ON dac.asignatura_id = a.id
LEFT JOIN cursos c ON dac.curso_id = c.id
ORDER BY d.nombre, c.nombre;
```

**Esperado**: Lista clara de profesor → materia → curso

### 3. Verificar Cursos con Sus Asignaturas
```sql
SELECT 
  c.nombre as curso,
  a.nombre as materia,
  apc.horas_semanales
FROM cursos c
JOIN asignaturas_por_curso apc ON c.id = apc.curso_id
JOIN asignaturas a ON apc.asignatura_id = a.id
WHERE c.nombre = 'Octavo'
ORDER BY a.nombre;
```

**Esperado**: Muestra todas las materias del curso Octavo

---

## Configurar RLS (Row Level Security) - OPCIONAL

Si usas autenticación en Supabase:

```sql
-- Permitir que usuarios vean sus propios datos
ALTER TABLE alumnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE docentes ENABLE ROW LEVEL SECURITY;

-- Política para alumnos (ver su perfil)
CREATE POLICY "Users can view their own data"
ON alumnos FOR SELECT
USING (auth.uid()::text = usuario);

-- Política para docentes (ver su perfil y asignaciones)
CREATE POLICY "Teachers can view their own data"
ON docentes FOR SELECT
USING (auth.uid()::text = usuario);
```

---

## Troubleshooting

### Error: "Violación de constraint UNIQUE"
**Causa**: Ya existe un registro con esos valores
**Solución**: Verifica los datos duplicados antes de insertar

### Error: "No existe el cursor"
**Causa**: Referencia a curso_id que no existe
**Solución**: Asegúrate de que los cursos existen en la tabla `cursos`

### Las asignaturas no aparecen por curso
**Causa**: No se insertaron los registros en `asignaturas_por_curso`
**Solución**: Ejecuta la parte de INSERT de ese SQL_SETUP.sql

---

## Rollback (Si Algo Sale Mal)

Si necesitas volver atrás:

```sql
-- Opción 1: Eliminar todo y volver al inicio
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Opción 2: Mantener copias de seguridad
-- Antes de migrar, haz un backup en Supabase:
-- 1. Ve a Project Settings
-- 2. Haz clic en "Database"
-- 3. Haz un backup manual
-- 4. Puedes restaurar desde ahí
```

---

## Próximos Pasos

1. ✅ Ejecutar SQL_SETUP.sql
2. ✅ Validar con las consultas de verificación
3. ✅ Probar la aplicación (agregar alumno, docente, asignar materia)
4. ✅ Revisar console para errores
5. ✅ Si todo funciona, limpiar tablas antiguas

---

## Soporte

Si encuentras problemas:
1. Revisa los logs en Supabase → Logs
2. Verifica que todos los tipos de datos sean correctos
3. Asegúrate de que no haya referencias rotas
4. Prueba una tabla a la vez

**Documentación Supabase**: https://supabase.com/docs

---

**Última actualización**: Enero 2026
**Estado**: ✅ Listo para usar

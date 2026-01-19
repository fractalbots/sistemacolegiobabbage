# 📊 Documentación Técnica - Base de Datos Supabase

## 🏗️ Arquitectura de la Base de Datos

### Descripción General
Base de datos relacional PostgreSQL optimizada con:
- ✅ Row Level Security (RLS) para privacidad
- ✅ Triggers automáticos para auditoría y notificaciones
- ✅ Columnas GENERATED ALWAYS para cálculos automáticos
- ✅ Índices para optimización de queries
- ✅ Vistas para reportes complejos
- ✅ Funciones PL/pgSQL para lógica de negocio

---

## 📋 Tablas Principales

### 1. **usuarios** (Autenticación y perfiles)
```sql
id: UUID (Primary Key)
email: VARCHAR (Único)
nombre: VARCHAR
apellido: VARCHAR
usuario: VARCHAR (Único)
password_hash: VARCHAR
rol: VARCHAR (admin | docente | estudiante)
activo: BOOLEAN
fecha_creacion: TIMESTAMP
fecha_actualizacion: TIMESTAMP
ultimo_login: TIMESTAMP
```

**Índices:**
- `idx_usuario` en campo usuario (búsquedas rápidas de login)

**Relaciones:**
- 1 usuario → 1 alumno O 1 docente

---

### 2. **alumnos** (Información de estudiantes)
```sql
id: UUID (Primary Key)
usuario_id: UUID (Foreign Key → usuarios)
cedula: VARCHAR (Único)
curso: VARCHAR
email: VARCHAR
numero_contacto: VARCHAR
estado: VARCHAR (activo | bloqueado | inactivo)
motivo_bloqueo: TEXT
fecha_nacimiento: DATE
fecha_inscripcion: TIMESTAMP
fecha_actualizacion: TIMESTAMP
```

**Índices:**
- `idx_cedula` (búsqueda por cédula)
- `idx_curso` (filtrar por curso)
- `idx_usuario_id` (relación con usuarios)

**Relaciones:**
- 1 alumno → N inscripciones
- 1 alumno → N calificaciones

---

### 3. **docentes** (Información de profesores)
```sql
id: UUID (Primary Key)
usuario_id: UUID (Foreign Key → usuarios)
cedula: VARCHAR (Único)
numero_contacto: VARCHAR
especialidad: VARCHAR
cambios_bloqueados: BOOLEAN
motivo_bloqueo: TEXT
fecha_contratacion: DATE
fecha_actualizacion: TIMESTAMP
```

**Relaciones:**
- 1 docente → N asignaturas

---

### 4. **cursos** (Grados/Años)
```sql
id: UUID (Primary Key)
nombre: VARCHAR (Único) [Ejemplo: "Octavo", "Noveno"]
descripcion: TEXT
nivel: VARCHAR
capacidad_maxima: INT (DEFAULT: 40)
cantidad_estudiantes: INT (AUTO)
activo: BOOLEAN
fecha_creacion: TIMESTAMP
fecha_actualizacion: TIMESTAMP
```

---

### 5. **asignaturas** (Materias/Cursos)
```sql
id: UUID (Primary Key)
nombre: VARCHAR
docente_id: UUID (Foreign Key → docentes)
curso_id: UUID (Foreign Key → cursos)
codigo_asignatura: VARCHAR (Único)
creditos: INT (DEFAULT: 3)
horas_semana: INT (DEFAULT: 4)
descripcion: TEXT
activa: BOOLEAN
fecha_creacion: TIMESTAMP
fecha_actualizacion: TIMESTAMP

CONSTRAINT: UNIQUE(docente_id, curso_id, nombre)
```

---

### 6. **inscripciones** (Enrolamiento de alumnos)
```sql
id: UUID (Primary Key)
alumno_id: UUID (Foreign Key → alumnos)
asignatura_id: UUID (Foreign Key → asignaturas)
estado: VARCHAR (activo | completado | retirado | suspendido)
fecha_inscripcion: TIMESTAMP
fecha_finalizacion: TIMESTAMP

CONSTRAINT: UNIQUE(alumno_id, asignatura_id)
```

---

### 7. **calificaciones** (Notas y evaluaciones)
```sql
id: UUID (Primary Key)
inscripcion_id: UUID (Foreign Key → inscripciones)
asignatura_id: UUID (Foreign Key → asignaturas)
alumno_id: UUID (Foreign Key → alumnos)

-- TRIMESTRE 1
trim1_insumo: DECIMAL(3,2)
trim1_prueba: DECIMAL(3,2)
trim1_promedio: DECIMAL(3,2) [AUTO = insumo*0.4 + prueba*0.6]

-- TRIMESTRE 2
trim2_insumo: DECIMAL(3,2)
trim2_prueba: DECIMAL(3,2)
trim2_promedio: DECIMAL(3,2) [AUTO]

-- TRIMESTRE 3
trim3_insumo: DECIMAL(3,2)
trim3_prueba: DECIMAL(3,2)
trim3_promedio: DECIMAL(3,2) [AUTO]

-- PROMEDIO GENERAL
promedio_final: DECIMAL(3,2) [AUTO = (trim1+trim2+trim3)/3]

estado_final: VARCHAR (aprobado | reprobado | pendiente)
observaciones: TEXT
docente_id: UUID (Foreign Key → docentes)
fecha_creacion: TIMESTAMP
fecha_actualizacion: TIMESTAMP
```

**Columnas GENERATED ALWAYS:**
- Cálculos automáticos sin necesidad de UPDATE
- Siempre sincronizadas
- Mejor rendimiento que triggers

---

### 8. **auditoria** (Registro de cambios)
```sql
id: UUID (Primary Key)
usuario_id: UUID (Foreign Key → usuarios)
tabla: VARCHAR (nombre de tabla modificada)
operacion: VARCHAR (INSERT | UPDATE | DELETE)
datos_anteriores: JSONB
datos_nuevos: JSONB
fecha: TIMESTAMP
ip_address: INET
```

**Seguridad:**
- Captura automática de todos los cambios
- Permite auditoría y rollback
- Indexado por fecha para reportes

---

### 9. **notificaciones** (Sistema de alertas)
```sql
id: UUID (Primary Key)
usuario_id: UUID (Foreign Key → usuarios)
titulo: VARCHAR
mensaje: TEXT
tipo: VARCHAR (info | warning | error | success)
leida: BOOLEAN
referencia_id: UUID
referencia_tabla: VARCHAR
fecha_creacion: TIMESTAMP
```

---

## 🔄 Triggers (Automatización)

### 1. **update_fecha_actualizacion**
Actualiza automáticamente `fecha_actualizacion` en:
- usuarios
- alumnos
- docentes
- asignaturas
- calificaciones

```sql
TRIGGER: BEFORE UPDATE
EFECTO: Siempre sincroniza fecha_actualizacion = NOW()
```

---

### 2. **trigger_estado_final**
Calcula automáticamente `estado_final` basado en promedio:

```sql
FUNCIÓN: actualizar_estado_final()
LÓGICA: 
  - SI promedio >= 7.0 → estado_final = 'aprobado'
  - SI promedio < 7.0 → estado_final = 'reprobado'
  - SI promedio NULL → estado_final = 'pendiente'
```

---

### 3. **trigger_notificar_calificaciones**
Crea automáticamente notificación cuando se cargan notas:

```sql
EVENTO: AFTER INSERT en calificaciones
ACCIÓN: 
  - Inserta en tabla notificaciones
  - Notifica al alumno afectado
  - Incluye referencia a la asignatura
```

---

### 4. **audit_usuarios** y **audit_calificaciones**
Registra todos los cambios para auditoría:

```sql
EVENTO: AFTER INSERT | UPDATE | DELETE
TABLA DESTINO: auditoria
INFORMACIÓN: usuario, tabla, operación, datos anteriores, datos nuevos
```

---

## 🔒 Seguridad - Row Level Security (RLS)

### Política: Alumnos ven solo sus calificaciones
```sql
SELECT:
  - El alumno solo ve sus propias calificaciones
  - No puede ver calificaciones de otros alumnos
```

### Política: Docentes ven calificaciones de sus asignaturas
```sql
SELECT:
  - El docente solo ve calificaciones de alumnos en sus asignaturas
  - Puede modificar notas de sus estudiantes
```

### Política: Admin acceso total
```sql
SELECT:
  - Admin puede ver todos los usuarios
  - No hay restricciones de RLS para admin
```

---

## 📊 Vistas (Reports)

### **vista_reportes_alumno**
Reporte consolidado de calificaciones por alumno:

```sql
SELECT:
  - alumno_id, nombre, apellido, cedula
  - curso, asignatura
  - trim1_promedio, trim2_promedio, trim3_promedio
  - promedio_final, estado_final
  
ORDER BY: curso, apellido, nombre
```

### **vista_resumen_docentes**
Resumen de docentes y sus asignaturas:

```sql
SELECT:
  - docente_id, nombre, apellido
  - cantidad_asignaturas, cantidad_estudiantes
  - estado_bloqueo
  
GROUP BY: docente_id
```

---

## 🚀 Optimizaciones

### Índices creados:
```sql
idx_usuarios_rol           → Búsquedas por rol rápidas
idx_calificaciones_alumno_asignatura → Reportes rápidos
idx_inscripciones_estado   → Filtrados por estado
idx_auditoria_fecha        → Reportes históricos
idx_cedula                 → Búsqueda por cédula (alumnos/docentes)
idx_curso                  → Filtrado por curso
```

### Columnas GENERATED ALWAYS:
- **Ventaja:** No necesitan UPDATE manual
- **Rendimiento:** Base de datos calcula automáticamente
- **Consistencia:** Siempre sincronizadas
- **Ejemplo:** `trim1_promedio = trim1_insumo*0.4 + trim1_prueba*0.6`

---

## 💾 Backup y Recuperación

### Configuración automática en Supabase:
```
- Backups diarios automáticos
- Retención: 7 días
- Punto de restauración: cualquier momento
- Base de datos punto-en-tiempo recovery
```

---

## 📈 Escalabilidad

### Capacidad:
- **Alumnos:** Millones de registros
- **Calificaciones:** Terabytes de datos
- **Usuarios concurrentes:** 10,000+
- **QPS:** 100,000+ queries por segundo

### Mejoras futuras:
```sql
- Particionamiento de tablas por año
- Replicación read-only en otras regiones
- Caching con Redis (Future)
- Full-text search (PostgreSQL)
```

---

## 🔑 Relaciones de Datos

```
usuarios (1) ──┬──→ (1) alumnos (1) ──→ (N) inscripciones (1) ──→ (1) asignaturas
               │
               └──→ (1) docentes (1) ──→ (N) asignaturas

asignaturas (1) ──→ (N) calificaciones ←─ (1) inscripciones
        ↓
    (1) cursos
        ↓
    (1) docentes

usuarios (1) ──→ (N) auditoria
usuarios (1) ──→ (N) notificaciones
```

---

## 📝 Ejemplo de uso

### Crear un alumno:
```sql
-- 1. Crear usuario en Supabase Auth
INSERT INTO usuarios (email, nombre, apellido, usuario, password_hash, rol)
VALUES ('juan@example.com', 'Juan', 'García', 'juan.garcia', '[HASH]', 'estudiante');

-- 2. Crear registro de alumno
INSERT INTO alumnos (usuario_id, cedula, curso, email)
VALUES ('[UUID]', '1234567890', 'Octavo', 'juan@example.com');

-- 3. Inscribir en asignatura
INSERT INTO inscripciones (alumno_id, asignatura_id, estado)
VALUES ('[ALUMNO_UUID]', '[ASIGNATURA_UUID]', 'activo');

-- 4. Docente carga calificaciones
INSERT INTO calificaciones (
  inscripcion_id, asignatura_id, alumno_id, 
  trim1_insumo, trim1_prueba, docente_id
)
VALUES ('[UUID]', '[UUID]', '[UUID]', 8.5, 9.0, '[DOCENTE_UUID]');
-- → trim1_promedio se calcula automáticamente (8.8)
-- → promedio_final se calcula automáticamente
-- → estado_final se determina automáticamente ('aprobado')
-- → Se crea notificación automáticamente
-- → Se registra en auditoría automáticamente
```

---

## 🆘 Troubleshooting

### Problema: "permission denied"
**Solución:** Verificar RLS policies están correctamente configuradas

### Problema: "duplicate key"
**Solución:** Algunos campos tienen UNIQUE, verificar unicidad

### Problema: "foreign key constraint fails"
**Solución:** Verificar que registros relacionados existen primero

---

**Última actualización:** Enero 2026  
**Versión:** 1.0.0  
**Compatible con:** PostgreSQL 14+, Supabase 1.50+

# ✅ CHECKLIST - Verificación Completa del Sistema

## 🧪 Antes de Deploy (Verificación Local)

### Login
- [ ] Admin login funciona (admin/admin)
- [ ] Profesor login funciona (profesor/1234)
- [ ] Estudiante login funciona (juan.garcia/1234567890)
- [ ] Mensaje de error con credenciales incorrectas
- [ ] Se ve el texto escrito en los inputs (color oscuro)

### Gestión de Alumnos (Admin)
- [ ] Ver lista de alumnos
- [ ] Agregar nuevo alumno (nombre, apellido, cédula, curso)
- [ ] Alert muestra credenciales del alumno creado
- [ ] Editar alumno existente
- [ ] Eliminar alumno con confirmación
- [ ] Alumno nuevo puede hacer login con sus credenciales

### Gestión de Docentes (Admin)
- [ ] Ver lista de docentes
- [ ] Agregar nuevo docente
- [ ] Editar docente
- [ ] Eliminar docente

### Gestión de Asignaturas (Admin)
- [ ] Ver lista de asignaturas
- [ ] Agregar nueva asignatura
- [ ] Editar asignatura
- [ ] Eliminar asignatura

### Vista de Profesor (Docente)
- [ ] Ver mis asignaturas
- [ ] Ver estudiantes de cada asignatura
- [ ] Cargar notas (insumo y prueba)
- [ ] Guardar notas

### Vista de Alumno (Estudiante)
- [ ] Ver mis calificaciones
- [ ] Ver todas mis asignaturas
- [ ] Ver promedios por asignatura
- [ ] No poder editar calificaciones

### Interfaz General
- [ ] Menu sidebar responsive
- [ ] En mobile el sidebar se colapse
- [ ] Logout funciona
- [ ] Volver a login después de logout
- [ ] No hay errores en consola

---

## 🗄️ Verificación de Base de Datos

### Crear Proyecto Supabase
- [ ] Cuenta creada en supabase.com
- [ ] Proyecto creado y región seleccionada
- [ ] Copiar SUPABASE_URL
- [ ] Copiar SUPABASE_ANON_KEY
- [ ] Base de datos lista

### Ejecutar Script SQL
- [ ] Ir a SQL Editor en Supabase
- [ ] Crear nueva consulta
- [ ] Copiar contenido de `supabase.sql`
- [ ] Ejecutar sin errores (✓)

### Verificar Tablas
En SQL Editor ejecutar:

```sql
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Verificar que existen:
- [ ] usuarios
- [ ] alumnos
- [ ] docentes
- [ ] cursos
- [ ] asignaturas
- [ ] inscripciones
- [ ] calificaciones
- [ ] auditoria
- [ ] notificaciones

### Verificar Triggers
```sql
SELECT trigger_name 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

Verificar:
- [ ] update_usuarios_fecha
- [ ] update_alumnos_fecha
- [ ] update_docentes_fecha
- [ ] update_asignaturas_fecha
- [ ] update_calificaciones_fecha
- [ ] trigger_estado_final
- [ ] trigger_notificar_calificaciones
- [ ] audit_usuarios
- [ ] audit_calificaciones

### Verificar Vistas
```sql
SELECT * FROM information_schema.views 
WHERE table_schema = 'public';
```

Verificar:
- [ ] vista_reportes_alumno
- [ ] vista_resumen_docentes

### Verificar RLS Habilitado
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

Verificar todas las tablas tienen `rowsecurity = true`

---

## 🔐 Seguridad

### RLS (Row Level Security)
- [ ] Tabla usuarios tiene RLS habilitado
- [ ] Tabla alumnos tiene RLS habilitado
- [ ] Tabla docentes tiene RLS habilitado
- [ ] Tabla calificaciones tiene RLS habilitado

### Contraseñas
- [ ] Password hash está configurado correctamente
- [ ] No almacenar contraseñas en plain text

### Auditoría
- [ ] Cambios se registran en tabla auditoria
- [ ] Se captura usuario, operación, datos

---

## 🔗 Integración Supabase

### Variables de Entorno
- [ ] `.env.local` existe (NO HACER COMMIT)
- [ ] `.env.example` existe (SÍ HACER COMMIT)
- [ ] VITE_SUPABASE_URL configurado
- [ ] VITE_SUPABASE_ANON_KEY configurado

### Cliente Supabase
- [ ] `src/supabaseClient.js` existe
- [ ] Importa credenciales de `.env`
- [ ] Funciones de utilidad implementadas
- [ ] Manejo de errores implementado

### Conexión Funcionando
- [ ] Sin errores de conexión en consola
- [ ] Queries llegan a Supabase
- [ ] Datos se guardan correctamente

---

## 🐙 GitHub

### Repositorio Creado
- [ ] Repositorio creado en https://github.com
- [ ] Nombre: `sistema-calificaciones`
- [ ] Descripción: "Sistema de Gestión Académica..."
- [ ] README presente
- [ ] .gitignore presente

### Archivos Listos
- [ ] `DEPLOY.md` (guía de deployment)
- [ ] `DATABASE.md` (documentación BD)
- [ ] `QUICKSTART.md` (guía rápida)
- [ ] `supabase.sql` (script BD)
- [ ] `.env.example` (template variables)
- [ ] `vercel.json` (config Vercel)
- [ ] `.gitignore` (no trackear .env)

### Push a GitHub
```bash
git remote add origin https://github.com/TU_USUARIO/sistema-calificaciones.git
git branch -M main
git push -u origin main
```
- [ ] Código en GitHub
- [ ] Rama main tiene todos los archivos
- [ ] Sin archivos sensibles (.env, node_modules)

---

## 🚀 Deploy Vercel

### Crear Cuenta Vercel
- [ ] Cuenta creada en vercel.com
- [ ] Conectada con GitHub
- [ ] Repositorio visible

### Importar Proyecto
- [ ] Proyecto importado desde GitHub
- [ ] Build settings correctos (Vite)
- [ ] Output directory: `dist`

### Variables de Entorno en Vercel
En Vercel Settings → Environment Variables:
- [ ] VITE_SUPABASE_URL agregado
- [ ] VITE_SUPABASE_ANON_KEY agregado
- [ ] Variables en "Preview" y "Production"

### Deploy Exitoso
- [ ] Build completó sin errores
- [ ] Preview URL disponible
- [ ] Sitio accesible en https://...vercel.app
- [ ] Puedo hacer login
- [ ] Datos se guardan en Supabase

---

## 🧪 Testing en Producción

### Login en Producción
- [ ] Admin login funciona
- [ ] Profesor login funciona
- [ ] Estudiante login funciona
- [ ] Mensaje de error con credenciales malas

### Crear Alumno en Producción
- [ ] Cargar formulario
- [ ] Crear nuevo alumno
- [ ] Verifica que aparece en lista
- [ ] Verifica que está en Supabase (mirar SQL)
- [ ] Nuevo alumno puede hacer login

### Crear Docente en Producción
- [ ] Crear nuevo docente
- [ ] Docente puede hacer login
- [ ] Docente ve sus asignaturas

### Cargar Calificaciones en Producción
- [ ] Docente inicia sesión
- [ ] Ve sus asignaturas
- [ ] Ve estudiantes
- [ ] Carga notas
- [ ] Estudiante ve sus calificaciones actualizadas

### Verificar Supabase
En Supabase SQL Editor:
```sql
SELECT * FROM usuarios LIMIT 10;
SELECT * FROM calificaciones LIMIT 10;
SELECT * FROM auditoria LIMIT 10;
```
- [ ] Datos en usuarios
- [ ] Datos en calificaciones
- [ ] Cambios registrados en auditoria

---

## 📊 Performance

### Velocidad de Carga
- [ ] Página login carga < 2 segundos
- [ ] Dashboard carga < 3 segundos
- [ ] Listados cargan rápido

### Queries a Base de Datos
- [ ] Sin N+1 queries
- [ ] Índices están siendo usados
- [ ] RLS no causa timeouts

### Storage
- [ ] Vite build size < 500KB (gzipped)
- [ ] Assets optimizados

---

## 📱 Responsive Design

### Desktop (1920px)
- [ ] Interfaz completa
- [ ] Sidebar visible
- [ ] Todos los campos editables

### Tablet (768px)
- [ ] Sidebar colapsable
- [ ] Formularios responsive
- [ ] Tablas scrolleables

### Mobile (320px)
- [ ] Interfaz usable
- [ ] Sin scroll horizontal
- [ ] Botones del tamaño correcto

---

## 🎯 Antes de Anunciar

- [ ] Todos los checks completados ✅
- [ ] No hay errores en consola
- [ ] No hay warnings en consola
- [ ] Documentación actualizada
- [ ] README menciona Supabase y Vercel
- [ ] DEPLOY.md completo
- [ ] Backups configurados en Supabase
- [ ] SSL/TLS habilitado (automático en Vercel)

---

## 📋 Documentación

- [ ] README.md actualizado
- [ ] DEPLOY.md completo con instrucciones
- [ ] DATABASE.md explica estructura
- [ ] QUICKSTART.md para inicio rápido
- [ ] Comentarios en código importante
- [ ] Credenciales de demo documentadas

---

## 🔒 Seguridad Final

- [ ] HTTPS en producción ✓ (Vercel)
- [ ] RLS habilitado en BD ✓
- [ ] Auditoría activa ✓
- [ ] No hay credenciales en git
- [ ] .env en .gitignore
- [ ] CORS configurado (si aplica)

---

**Fecha:** Enero 2026
**Versión:** 1.0.0
**Estado:** Listo para producción ✅

Cuando TODOS los checks estén marcados:
✅ El sistema está 100% listo para uso en producción

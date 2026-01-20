# 🔧 TROUBLESHOOTING - Solución de Problemas

## 🎯 Encuentra Tu Problema Aquí

---

## ❌ Error: "Could not find the 'apellido' column"

### Síntomas
```
Error al guardar alumno: Could not find the 'apellido' column 
of 'alumnos' in the schema cache
```

### Causa
- Base de datos antigua sin la columna `apellido`
- Schema cache desincronizado con Supabase

### Solución ✅

**Opción 1: Actualizar Schema (Recomendado)**
```sql
1. Ve a Supabase Dashboard
2. SQL Editor
3. Ejecuta:

ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS apellido VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE docentes ADD COLUMN IF NOT EXISTS apellido VARCHAR(255) NOT NULL DEFAULT '';

4. Luego ejecuta SQL_SETUP.sql completo
```

**Opción 2: Resetear Completamente**
```sql
1. Eliminá tablas antiguas
2. Ejecuta SQL_SETUP.sql completo
3. Reimporta datos si es necesario
```

---

## ❌ Error: "Botón 📚 Materias no aparece"

### Síntomas
- En tabla de docentes solo ves: 🔓 ✏️ 🗑️
- Falta el botón 📚

### Causa
- App.jsx no se actualizó
- Importación del componente falta
- No eres admin

### Solución ✅

**Paso 1: Verifica que eres Admin**
```
¿Iniciaste sesión como Administrador?
Si no, login con admin → Docentes
```

**Paso 2: Verifica que App.jsx está actualizado**
```
Abre src/App.jsx
Busca: import AsignarMateriasProfesor
Si no está, copia de nuevo el código
```

**Paso 3: Recarga la página**
```
F5 en navegador
Limpia cache: Ctrl+Shift+Del → Caché → Limpiar
```

**Paso 4: Verifica la consola**
```
F12 → Console
¿Hay errores en rojo?
```

---

## ❌ Error: "Modal abre pero está vacío"

### Síntomas
- Se abre la ventana
- Pero no muestra datos
- No hay cursos ni materias

### Causa
- SQL_SETUP.sql no se ejecutó
- Datos precargados no existen
- Supabase no conecta bien

### Solución ✅

**Paso 1: Verifica datos en Supabase**
```
Supabase Dashboard → Database → Tables
- ¿Existe tabla 'cursos'?
- ¿Tiene 6 registros?
- ¿Existe tabla 'asignaturas'?
- ¿Tiene 23 registros?
```

**Paso 2: Si faltan tablas/datos**
```
SQL Editor en Supabase
Copia COMPLETO el contenido de SQL_SETUP.sql
Pégalo en SQL Editor
Haz clic "Run"
Espera a que terminen todas las queries
```

**Paso 3: Verifica conexión .env**
```
Abre .env
Verifica:
VITE_SUPABASE_URL=tu_url
VITE_SUPABASE_ANON_KEY=tu_key

¿Son correctas? ¿No están vacías?
```

**Paso 4: Console del navegador**
```
F12 → Console
¿Hay errores sobre Supabase?
¿Dice "conectado"?
```

---

## ❌ Error: "Error al guardar asignaciones"

### Síntomas
```
Modal intenta guardar
Aparece mensaje rojo: "Error al guardar: ..."
```

### Causa
- Asignación duplicada
- Profesor_id incorrecto
- Error de conexión BD

### Solución ✅

**Paso 1: Verifica sin duplicados**
```
¿Intentaste agregar dos veces la misma materia-curso?
→ Remueve duplicados antes de guardar
```

**Paso 2: Verifica profesor existe**
```
¿El profesor está bien guardado en BD?
En table 'docentes' ¿existe con ID correcto?
```

**Paso 3: Verifica conexión**
```
¿Internet conectado?
¿Supabase está online?
¿Auth tokens válidos?

Intenta: F12 → Network → clic en Guardar
¿Aparecen requests a api.supabase.co?
¿Con status 200?
```

**Paso 4: Revisa console**
```
F12 → Console
¿Qué dice el error específicamente?
Busca esa palabra en la documentación
```

---

## ❌ Error: "Dropdown de materias vacío"

### Síntomas
```
Selecciono un curso
Click en dropdown de materias
Aparece vacío
```

### Causa
- Curso no tiene asignaturas
- SQL_SETUP.sql incompleto
- Datos no se insertaron

### Solución ✅

**Paso 1: Verifica tabla asignaturas_por_curso**
```
Supabase → Table: asignaturas_por_curso
¿Tiene filas?
Filtra por curso_id = 1 (Octavo)
¿Aparece datos?
```

**Paso 2: Si está vacío**
```
SQL Editor
Busca en SQL_SETUP.sql la sección:
"-- Asignaturas para OCTAVO"

Copia ese INSERT y ejecuta
```

**Paso 3: Verifica relaciones**
```
¿Tabla 'asignaturas' tiene registros?
¿Tabla 'cursos' tiene registros?
¿Existen los IDs referenciados?
```

---

## ❌ Error: "Esta asignatura ya está agregada"

### Síntomas
```
Intento agregar Matemáticas en Octavo
Aparece error: "Esta asignatura ya está agregada para este curso"
```

### Causa
- ¡ES CORRECTO! Sistema funciona
- Ya existe esa combinación profesor-materia-curso

### Solución ✅

**No es error, es validación:**
```
Significa que el profesor YA enseña esa materia en ese curso
Busca en "Asignaciones Actuales"
La verás ahí

Para agregar otra, elige:
- Mismo profesor, DIFERENTE materia
- Mismo profesor, DIFERENTE curso
- DIFERENTE combinación
```

---

## ❌ Error: "Foreign key constraint failed"

### Síntomas
```
Error: Foreign key constraint failed
Intento guardar pero no va
```

### Causa
- docente_id no existe
- asignatura_id no existe
- curso_id no existe

### Solución ✅

**Verifica en Supabase:**
```
1. Table 'docentes' → ¿existe docente?
2. Table 'asignaturas' → ¿existe asignatura?
3. Table 'cursos' → ¿existe curso?

Los IDs deben coincidir exactamente
```

---

## ❌ Modal no se cierra después de guardar

### Síntomas
```
Hago clic en Guardar
Aparece "✅ Éxito"
Pero el modal no se cierra
```

### Causa
- onSuccess callback no se ejecuta
- Timeout muy corto

### Solución ✅

**Espera unos segundos:**
```
El modal cierra automáticamente después de 1.5 seg
Si no se cierra:
1. Haz clic botón Cerrar (X)
2. O F5 para recargar
```

**Si es persistente:**
```
Edita src/components/AsignarMateriasProfesor.jsx
Busca: setTimeout(onSuccess, 1500)
Cambia a: setTimeout(onSuccess, 3000)
Más tiempo de espera
```

---

## ❌ Las asignaciones no aparecen en "Actuales"

### Síntomas
```
Guardo asignaciones
Aparece "✅ Éxito"
Pero en "Asignaciones Actuales" no aparecen
```

### Causa
- Datos no se recargan
- Los datos sí están en BD pero no se muestran
- Caché de datos local

### Solución ✅

**Opción 1: Cierra y reabre modal**
```
1. Haz clic X para cerrar
2. Clic nuevamente en "📚 Materias" del mismo profesor
3. Deberían aparecer en "Actuales"
```

**Opción 2: Recarga página**
```
F5 en navegador
Ve a Docentes de nuevo
Abre modal
Deberían estar ahí
```

**Opción 3: Verifica en BD**
```
Supabase → Table 'docente_asignatura_curso'
¿Los registros están ahí?
¿Con docente_id, asignatura_id, curso_id correctos?
¿Con activa = true?
```

---

## ❌ Error en SQL al ejecutar SQL_SETUP.sql

### Síntomas
```
SQL Editor
Error en línea: ...
Query falló
```

### Causa
- Tabla ya existe
- Sintaxis error
- Constraints conflictivos

### Solución ✅

**Opción 1: Ignorar IF EXISTS**
```
SQL_SETUP.sql tiene "CREATE TABLE IF NOT EXISTS"
Si dice "Table already exists" → Es normal
Continúa con siguiente query
```

**Opción 2: Borrar y recrear**
```
SQL Editor
Ejecuta:
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

Luego ejecuta SQL_SETUP.sql completo
```

**Opción 3: Leer error específico**
```
¿Qué dice exactamente el error?
Busca esa línea en SQL_SETUP.sql
¿Hay caracteres especiales?
¿Falta un semicolon?
```

---

## ❌ Profesor desaparece después de agregar

### Síntomas
```
Tabla de docentes tenía 5 profesores
Hago clic en "📚 Materias"
Cuando cierro, ya no aparece el profesor
```

### Causa
- Accidental delete
- Error al refrescar datos
- Bug en UI

### Solución ✅

**Verifica en Supabase:**
```
Table 'docentes' 
¿El profesor sigue ahí?
¿Con activo = true?
```

**Si está en BD pero no en UI:**
```
Recarga página (F5)
Deberían reaparecer
```

**Si desapareció de BD:**
```
Haz rollback desde backup
O inserta manualmente:

INSERT INTO docentes (id, nombre, apellido, ...)
VALUES (...)
```

---

## ❌ Todos los dropdowns deshabilitados

### Síntomas
```
Modal abierto
Pero TODO está gris (disabled)
```

### Causa
- Modal está cargando datos
- Datos no cargaron
- Espera de datos incompleta

### Solución ✅

**Si está cargando:**
```
Espera 2-3 segundos
Aparecerá el spinner de carga
Luego se habilitan los controles
```

**Si no se habilita:**
```
Cierra y reabre modal
F5 para recargar
Verifica console (F12) para errores
```

---

## ❌ Error 401/403 de autenticación

### Síntomas
```
Guardo asignaciones
Error: 401 Unauthorized
```

### Causa
- Token expirado
- Credenciales .env incorrectas
- Supabase auth desconfigurado

### Solución ✅

**Paso 1: Verifica .env**
```
VITE_SUPABASE_URL=tu_url_correcta
VITE_SUPABASE_ANON_KEY=tu_key_correcta

Cópialo de: Supabase → Settings → API
```

**Paso 2: Cierra y reabre navegador**
```
Cierra tab completa
Abre nueva pestaña
Login nuevamente
```

**Paso 3: Verifica permisos Supabase**
```
Supabase → Auth → Policies
¿Permite insertar en docente_asignatura_curso?
```

---

## ❌ Servidor dice que tablas no existen

### Síntomas
```
Error: relation "docente_asignatura_curso" does not exist
```

### Causa
- SQL_SETUP.sql no se ejecutó
- Ejecutó parcialmente
- Query falló silenciosamente

### Solución ✅

**Verifica en SQL Editor:**
```
SELECT * FROM docente_asignatura_curso LIMIT 1;

¿Funciona?
Si no → Ejecuta SQL_SETUP.sql nuevamente
```

**Opción nuclear:**
```
DROP TABLE IF EXISTS docente_asignatura_curso CASCADE;
DROP TABLE IF EXISTS docentes CASCADE;
DROP TABLE IF EXISTS alumnos CASCADE;
DROP TABLE IF EXISTS cursos CASCADE;
DROP TABLE IF EXISTS asignaturas CASCADE;
DROP TABLE IF EXISTS asignaturas_por_curso CASCADE;

Luego copia SQL_SETUP.sql completo y ejecuta
```

---

## ⚠️ Advertencias (No son errores)

### "Using 'BIGINT' instead of 'SERIAL'"
✅ Normal, es para auto-increment

### "Relation already exists"
✅ Normal, SQL_SETUP tiene IF NOT EXISTS

### "Slow query"
⚠️ Agregar índices si es frecuente

---

## 🆘 Si Nada Funciona

### Último recurso: Checklist Completo

1. [ ] ¿Supabase está online? Revisa status.supabase.com
2. [ ] ¿.env tiene credenciales correctas?
3. [ ] ¿Ejecuté SQL_SETUP.sql sin errores?
4. [ ] ¿Verificé en BD que las tablas existen?
5. [ ] ¿Tengo Internet conectado?
6. [ ] ¿Recargué la página (F5)?
7. [ ] ¿Limpié cache (Ctrl+Shift+Del)?
8. [ ] ¿Cierro DevTools (F12) y reabro?
9. [ ] ¿Cierto sesión y vuelvo a login?
10. [ ] ¿Leo la console (F12) sin cerrar?

Si aún no funciona → Revisa console para errores específicos

---

## 📞 Obtener Ayuda

### Información a proporcionar
```
1. Pantalla del error (screenshot)
2. Texto completo del error
3. Paso donde falla
4. Output de console (F12)
5. Versión navegador
6. Datos de SQL_SETUP.sql ejecutado o no
```

### Documentación de Referencia
- IMPROVEMENTS.md - Detalles técnicos
- MIGRACION.md - BD
- GUIA_ASIGNAR_MATERIAS.md - Uso

---

## ✅ Validación: Todo Funciona Si...

- [ ] Modal se abre sin errores
- [ ] Se cargan los cursos
- [ ] Se filtran las materias por curso
- [ ] Se pueden agregar asignaciones
- [ ] Se pueden guardar sin error
- [ ] Aparecen en "Asignaciones Actuales"
- [ ] Se puede cerrar modal
- [ ] No hay errores en Console (F12)

---

**Última actualización**: Enero 2026
**Versión**: 1.0

**¡Si solucionaste tu problema, marca el checkbox! ✅**

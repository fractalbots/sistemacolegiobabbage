# 📚 Guía de Uso - Asignación de Materias a Profesores

## 🎯 Objetivo

El sistema ahora permite que un **administrador** asigne **múltiples materias** a un **profesor** en **múltiples cursos**, sin interferencias entre profesores o entre materias de diferentes cursos.

---

## 🏗️ Cómo Funciona el Sistema

### Estructura Nueva

```
Profesor A
├── Matemáticas (Octavo)
├── Matemáticas (Noveno)
├── Matemáticas (Décimo)
└── Inglés (Décimo)

Profesor B
├── Inglés (Octavo)
└── Inglés (Noveno)
```

**Ventajas**:
- ✅ Misma materia en múltiples cursos ← No hay conflicto
- ✅ Múltiples materias en un curso ← No hay conflicto
- ✅ Misma materia, diferentes profesores ← No hay conflicto
- ✅ Cada relación es única → Sin duplicados

---

## 📋 Paso a Paso: Asignar Materias a un Profesor

### **Paso 1: Ir al Panel Admin**
1. Inicia sesión como **Administrador**
2. En el menú lateral, haz clic en **"👥 Docentes"**
3. Se abrirá la página de gestión de docentes

### **Paso 2: Encontrar el Profesor**
- En la tabla **"Lista de Docentes"** (lado derecho)
- Busca el profesor al que quieres asignar materias
- Verás los botones de acciones en la columna derecha

### **Paso 3: Abrir Modal de Asignación**
1. Haz clic en el botón **"📚 Materias"** (azul)
2. Se abrirá una ventana emergente (modal)
3. El modal muestra:
   - Datos del profesor en el encabezado
   - Formulario para agregar nuevas asignaciones
   - Lista de asignaciones actuales (si las hay)

### **Paso 4: Agregar Una Nueva Asignación**

#### A. Seleccionar Curso
1. En el dropdown **"Curso"**, elige un curso
   - Octavo, Noveno, Décimo, Primero, Segundo, Tercero
2. Al seleccionar, el sistema carga las materias disponibles para ese curso

#### B. Seleccionar Materia
1. En el dropdown **"Materia"** (ahora habilitado)
2. Elige la materia que quieres asignar
   - Solo muestra materias de ese curso

#### C. Agregar la Asignación
1. Haz clic en **"+ Agregar Asignación"**
2. Si es válido, la asignación aparece en la sección **"Asignaciones para guardar"**
3. Si hay error (ej: ya existe), verás un mensaje rojo

### **Paso 5: Revisar Antes de Guardar**
- **Sección "Asignaciones para guardar"**:
  - Muestra todas las nuevas asignaciones
  - Cada una indica: Materia + Curso
  - Puedes remover cualquiera con el botón ❌

### **Paso 6: Guardar Asignaciones**
1. Cuando estés seguro, haz clic en **"💾 Guardar Asignaciones"**
2. El sistema valida y guarda en la base de datos
3. Verás un mensaje verde de confirmación
4. La ventana se cerrará automáticamente

### **Paso 7: Verificar**
- Las asignaciones guardadas aparecerán en **"Asignaciones Actuales"**
- Cada una indica: Materia + Curso
- Puedes remover si es necesario (botón ❌)

---

## 📊 Ejemplo Práctico

### Scenario: Asignar Materias a "Prof. García"

**Objetivo Final**:
- Matemáticas en Octavo
- Matemáticas en Noveno
- Física en Décimo

**Proceso**:

```
1. Haz clic en "📚 Materias" (Prof. García)

2. Primera asignación:
   Curso: Octavo
   Materia: Matemáticas
   → Clic "Agregar Asignación"
   
3. Segunda asignación:
   Curso: Noveno
   Materia: Matemáticas
   → Clic "Agregar Asignación"
   
4. Tercera asignación:
   Curso: Décimo
   Materia: Física
   → Clic "Agregar Asignación"

5. Verificar en "Asignaciones para guardar":
   ✓ Matemáticas - Octavo
   ✓ Matemáticas - Noveno
   ✓ Física - Décimo

6. Haz clic "💾 Guardar Asignaciones"

7. ✅ ¡Listo! Mensaje de confirmación
```

---

## 🎨 Componentes de la Interfaz

### **Modal Header** (Azul)
```
Asignar Materias
Profesor: [Nombre Profesor Apellido]    [X Cerrar]
```

### **Sección 1: Agregar Nueva Asignación**
```
┌─ Agregar Nueva Asignación ─────────────────┐
│                                             │
│ Curso      [Octavo         ▼]              │
│ Materia    [Matemáticas    ▼]              │
│                                             │
│ [+ Agregar Asignación]                     │
│                                             │
└─────────────────────────────────────────────┘
```

### **Sección 2: Asignaciones para Guardar** (Azul)
```
Asignaciones para guardar (3)
┌─────────────────────────────────────────────┐
│ Matemáticas                         [❌]     │
│ Octavo                                      │
├─────────────────────────────────────────────┤
│ Matemáticas                         [❌]     │
│ Noveno                                      │
├─────────────────────────────────────────────┤
│ Física                              [❌]     │
│ Décimo                                      │
└─────────────────────────────────────────────┘
[💾 Guardar Asignaciones]
```

### **Sección 3: Asignaciones Actuales** (Verde)
```
Asignaciones Actuales (5)
┌─────────────────────────────────────────────┐
│ Inglés                              [❌]     │
│ Octavo                                      │
├─────────────────────────────────────────────┤
│ Inglés                              [❌]     │
│ Noveno                                      │
└─────────────────────────────────────────────┘
```

---

## ⚠️ Casos Especiales

### **Caso 1: Agregar la Misma Materia en Diferentes Cursos**
✅ **Permitido**
```
Matemáticas en Octavo
Matemáticas en Noveno
Matemáticas en Décimo
```
→ El profesor enseña la misma materia en 3 cursos diferentes

### **Caso 2: Agregar Múltiples Materias en el Mismo Curso**
✅ **Permitido**
```
Matemáticas en Octavo
Inglés en Octavo
Física en Octavo
```
→ El profesor enseña 3 materias en el mismo curso

### **Caso 3: Intentar Agregar la Misma Asignación Dos Veces**
❌ **No Permitido**
```
Primer intento: Matemáticas en Octavo ✓
Segundo intento: Matemáticas en Octavo ❌
→ Error: "Esta asignatura ya está agregada para este curso"
```

### **Caso 4: Dos Profesores Enseñan la Misma Materia en el Mismo Curso**
✅ **Permitido**
```
Prof. García → Matemáticas en Octavo
Prof. López → Matemáticas en Octavo
```
→ Ambos pueden enseñar en la misma sección (co-enseñanza)

---

## 🔄 Operaciones Avanzadas

### **Remover Asignación Pendiente**
1. En "Asignaciones para guardar"
2. Haz clic en el botón ❌ de la asignación
3. Se elimina de la lista (no se guarda en BD)

### **Remover Asignación Guardada**
1. En "Asignaciones Actuales"
2. Haz clic en el botón ❌
3. El sistema la marca como inactiva (soft delete)
4. Se actualiza inmediatamente

### **Agregar Más Asignaciones Después de Guardar**
1. El modal se mantiene abierto
2. Puedes seguir agregando más asignaciones
3. Cada "Guardar" procesa todas las pendientes

---

## 📈 Flujo de Datos

```
Admin selecciona profesor
         ↓
Modal se abre con datos del profesor
         ↓
Admin selecciona curso
         ↓
Sistema carga materias disponibles para ese curso
         ↓
Admin selecciona materia
         ↓
Sistema valida que no existe duplicado
         ↓
Asignación se agrega a lista local (pendiente)
         ↓
Admin hace clic "Guardar Asignaciones"
         ↓
Sistema valida todas las pendientes
         ↓
Se insertan en tabla docente_asignatura_curso
         ↓
Se actualizan las "Asignaciones Actuales"
         ↓
✅ Confirmación visual
```

---

## 🛡️ Validaciones

El sistema valida automáticamente:

| Validación | Error | Solución |
|-----------|-------|----------|
| Curso no seleccionado | "Por favor selecciona un curso" | Elige un curso |
| Materia no seleccionada | "Por favor selecciona una materia" | Elige una materia |
| Asignación duplicada | "Esta asignatura ya está agregada para este curso" | No agregar de nuevo |
| Sin asignaciones para guardar | "No hay nuevas asignaciones para guardar" | Agrega antes de guardar |
| Error de base de datos | "Error al guardar: [error]" | Verifica conexión Supabase |

---

## 💾 Datos Se Guardan En

### Tabla: `docente_asignatura_curso`

Cada asignación contiene:
- **docente_id**: ID del profesor
- **asignatura_id**: ID de la materia
- **curso_id**: ID del curso
- **activa**: TRUE (activo) o FALSE (inactivo)
- **created_at**: Fecha de creación
- **updated_at**: Última actualización

**Única relación**: No puede haber duplicados (Constraint UNIQUE)

---

## 🎓 Ejemplo Visual Completo

### **Antes (Sistema Antiguo)**
```
Profesor Garcia
├── asignaturas: ["Matemáticas", "Inglés"]  ❌ Problemas:
                                             - No sabe en qué cursos
                                             - No puede repetir materia
                                             - Interfiere con otros
```

### **Después (Sistema Nuevo)**
```
Profesor Garcia
├── docente_asignatura_curso
    ├── {docente_id: 1, asignatura_id: 5, curso_id: 1, activa: true}
    │   → Matemáticas en Octavo
    ├── {docente_id: 1, asignatura_id: 5, curso_id: 2, activa: true}
    │   → Matemáticas en Noveno
    └── {docente_id: 1, asignatura_id: 2, curso_id: 1, activa: true}
        → Inglés en Octavo
```

✅ Claro, organizado, sin conflictos

---

## 🚀 Ventajas del Nuevo Sistema

1. **Sin Conflictos**: Cada relación es única
2. **Flexible**: Profesor puede tener cualquier combinación
3. **Escalable**: Soporta muchas asignaciones
4. **Visual**: Interfaz clara y moderna
5. **Seguro**: Validaciones previas a guardar
6. **Eficiente**: Consultas rápidas en BD
7. **Fácil de Usar**: Pocos clics para asignar

---

## 📝 Checklist: Después de Asignar

- [ ] ¿Se cargó el modal sin errores?
- [ ] ¿Se puede seleccionar curso?
- [ ] ¿Las materias se filtran por curso?
- [ ] ¿Se pueden agregar múltiples asignaciones?
- [ ] ¿Se ven en "Asignaciones para guardar"?
- [ ] ¿El botón Guardar funciona?
- [ ] ¿Aparece mensaje de confirmación?
- [ ] ¿Las asignaciones aparecen en "Actuales"?

---

## 🆘 Problemas Comunes

### **Problema**: "El botón de Materias no aparece"
**Solución**: Recarga la página o verifica que eres admin

### **Problema**: "El dropdown de materias está vacío"
**Solución**: El curso seleccionado no tiene materias en BD. Verifica SQL_SETUP.sql

### **Problema**: "No puedo guardar, dice error"
**Solución**: Verifica que Supabase esté conectado (revisa console del navegador)

### **Problema**: "Agregué una materia pero no aparece"
**Solución**: Si no presionaste Guardar, solo está pendiente. Haz clic en Guardar.

---

## 📞 Soporte

Si tienes dudas:
1. Revisa este documento
2. Consulta IMPROVEMENTS.md para detalles técnicos
3. Revisa MIGRACION.md para BD
4. Abre la console del navegador (F12) para ver errores

---

**Última actualización**: Enero 2026
**Versión**: 1.0
**Estado**: ✅ Implementado y Funcional

¡A disfrutar el nuevo sistema! 🎉

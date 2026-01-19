# Sistema de Calificaciones - Versión Desarrollo Local

Versión simplificada del sistema para pruebas y desarrollo local. Sin dependencias externas ni configuraciones complejas.

## Requisitos
- Node.js 16+
- npm

## Instalación

```bash
cd sistema-calificaciones-dev
npm install
```

## Ejecutar localmente

```bash
npm run dev
```

El proyecto se abrirá en `http://localhost:5173`

## Credenciales de Demo

**Admin:**
- Usuario: `admin`
- Contraseña: `admin`

**Profesor:**
- Usuario: `profesor`
- Contraseña: `1234`

**Estudiante (precargado):**
- Usuario: `juan.garcia`
- Contraseña: `1234567890` (su cédula)

### Cómo agregar nuevos alumnos
Cuando un admin agrega un nuevo alumno desde el panel:
- **Usuario generado automáticamente:** `nombre.apellido` (en minúsculas)
- **Contraseña:** La cédula que ingresó el admin

Ejemplo: Si creas un alumno "María López" con cédula "9876543210":
- Usuario: `maria.lopez`
- Contraseña: `9876543210`

## Características

✓ Gestión de Alumnos  
✓ Gestión de Docentes  
✓ Gestión de Asignaturas  
✓ Gestión de Cursos  
✓ Interfaz Responsiva  
✓ Sin bases de datos externas  
✓ Todo funciona localmente  

## Archivos Esenciales

```
src/
├── App.jsx          # Componente principal
├── App.css          # Estilos de la app
├── index.css        # Estilos globales
└── main.jsx         # Entrada de React

package.json         # Dependencias
vite.config.js       # Configuración de Vite
index.html          # HTML base
```

## Notas

- Los datos se guardan en memoria durante la sesión
- Para producción, agregar localStorage o una base de datos real
- Actualmente no usa backend externo (todo es local)
- Las credenciales de acceso están hardcodeadas para demo

## Build para Producción

```bash
npm run build
```

Los archivos compilados estarán en `dist/`

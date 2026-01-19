# 🚀 GUÍA DE DEPLOY - Sistema de Calificaciones

## Paso 1: Preparar Supabase

### 1.1 Crear proyecto en Supabase
1. Ir a https://supabase.com y crear una cuenta
2. Crear nuevo proyecto
3. Seleccionar región más cercana a tu ubicación
4. Copiar credenciales:
   - `VITE_SUPABASE_URL`: URL del proyecto
   - `VITE_SUPABASE_ANON_KEY`: Clave anónima

### 1.2 Ejecutar script SQL
1. En Supabase, ir a SQL Editor
2. Crear nueva consulta
3. Copiar contenido de `supabase.sql`
4. Ejecutar (✓)

### 1.3 Configurar variables en Supabase
1. Ir a Project Settings → Database
2. Configurar Database Extensions (UUID, pgcrypto)
3. Verificar que todas las tablas fueron creadas

---

## Paso 2: Preparar Repositorio GitHub

### 2.1 Inicializar Git
```bash
cd sistema-calificaciones-dev
git init
git add .
git commit -m "Inicial: Sistema de calificaciones"
```

### 2.2 Crear repositorio en GitHub
1. Ir a https://github.com/new
2. Nombre: `sistema-calificaciones`
3. Descripción: "Sistema de Gestión Académica con React, Vite, Supabase y Vercel"
4. Hacer público
5. NO inicializar README, .gitignore, ni license (ya existen)
6. Crear repositorio

### 2.3 Conectar repositorio
```bash
git remote add origin https://github.com/TU_USUARIO/sistema-calificaciones.git
git branch -M main
git push -u origin main
```

---

## Paso 3: Deploy en Vercel

### 3.1 Conectar Vercel
1. Ir a https://vercel.com
2. Crear cuenta (con GitHub si es posible)
3. Hacer clic en "Add New..." → "Project"
4. Seleccionar repositorio `sistema-calificaciones`
5. Importar

### 3.2 Configurar variables de entorno
En Vercel, ir a Settings → Environment Variables

Agregar:
```
VITE_SUPABASE_URL = tu_supabase_url
VITE_SUPABASE_ANON_KEY = tu_supabase_key
```

### 3.3 Deploy
1. El deploy se inicia automáticamente
2. Esperar a que termine (puedes ver el progreso)
3. Una vez completado, tu URL será: `https://sistema-calificaciones-[random].vercel.app`

---

## Paso 4: Verificación

### 4.1 Verificar base de datos
```sql
-- Ejecutar en Supabase SQL Editor
SELECT * FROM public.usuarios LIMIT 1;
SELECT * FROM public.alumnos LIMIT 1;
```

### 4.2 Verificar deploy
- Abre tu URL de Vercel
- Prueba login con credenciales de demo
- Intenta crear un alumno nuevo
- Verifica que se guarde en Supabase

### 4.3 Monitoreo
- Vercel: Ver logs en Deploy → Details
- Supabase: Ver queries en Database → Query Performance

---

## 🔒 Seguridad - Próximos Pasos

### Antes de producción:
1. [ ] Cambiar contraseña de admin
2. [ ] Configurar dominios personalizados
3. [ ] Habilitar CORS en Supabase
4. [ ] Configurar backups automáticos
5. [ ] Agregar SSL/TLS
6. [ ] Implementar 2FA para admins
7. [ ] Configurar límites de rate limiting

### Configurar RLS correctamente:
```sql
-- Solo usuarios autenticados pueden ver sus datos
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.docentes ENABLE ROW LEVEL SECURITY;
```

---

## 📝 Variables de Entorno

Archivo `.env.local`:
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔄 Workflow de desarrollo

### Actualizar código:
```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
```

Vercel desplegará automáticamente.

### Actualizar base de datos:
1. Ejecutar script SQL en Supabase
2. Probar localmente con `npm run dev`
3. Hacer commit y push

---

## 📊 Estructura de carpetas deployment

```
sistema-calificaciones/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── supabaseClient.js ← Cliente Supabase
├── .env.example ← Copiar a .env.local
├── .gitignore ← Protege variables secretas
├── vercel.json ← Configuración Vercel
├── supabase.sql ← Script de base de datos
├── package.json
└── vite.config.js
```

---

## 🆘 Solución de problemas

### Error: "VITE_SUPABASE_URL is not defined"
- Asegúrate de agregar variables en Vercel → Settings → Environment Variables
- Reinicia el deploy después de agregar variables

### Error de CORS
- Ir a Supabase → Project Settings → CORS
- Agregar dominio de Vercel: `https://tu-app.vercel.app`

### Tablas no existen
- Ejecutar el script `supabase.sql` completo en SQL Editor
- Verificar que no hay errores en la ejecución

---

## 📞 Contacto soporte
- Vercel: https://vercel.com/support
- Supabase: https://supabase.com/docs

---

**Última actualización:** Enero 2026
**Versión:** 1.0.0

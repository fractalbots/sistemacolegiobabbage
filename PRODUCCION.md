# 🚀 GUÍA COMPLETA DE DEPLOY - Sistema de Calificaciones

## ✅ Checklist Pre-Deploy

- [ ] Variables de entorno configuradas en `.env.example`
- [ ] `vite.config.js` optimizado para producción
- [ ] `vercel.json` configurado con headers de seguridad
- [ ] `supabaseClient.js` con validación de variables
- [ ] `.gitignore` configurado correctamente
- [ ] Base de datos Supabase lista

---

## FASE 1: Preparar Supabase

### 1.1 Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión o crea cuenta
3. Haz clic en "New Project"
4. Completa los datos:
   - **Name**: `sistema-calificaciones`
   - **Password**: Contraseña fuerte
   - **Region**: Selecciona la más cercana a ti
5. Haz clic en "Create new project"
6. Espera a que se cree (2-5 minutos)

### 1.2 Obtener Credenciales
1. En el dashboard de Supabase, ve a **Settings → API**
2. Copia las siguientes credenciales:
   - **Project URL**: Guárdala (será `VITE_SUPABASE_URL`)
   - **Anon public key**: Guárdala (será `VITE_SUPABASE_ANON_KEY`)

### 1.3 Crear Tablas en Supabase
1. En Supabase, ve a **SQL Editor**
2. Haz clic en "New Query"
3. Copia todo el contenido de `supabase.sql`
4. Pégalo en el editor
5. Haz clic en el botón **▶ Run** (o presiona Ctrl+Enter)
6. Verifica que todas las tablas se crearon sin errores

---

## FASE 2: Preparar GitHub

### 2.1 Inicializar Git Localmente
```bash
cd c:\Users\FractalBots\Desktop\sistema-calificaciones-dev

# Inicializar repositorio
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "Initial commit: Sistema de Calificaciones listo para producción"
```

### 2.2 Crear Repositorio en GitHub
1. Ve a [github.com/new](https://github.com/new)
2. Completa:
   - **Repository name**: `sistema-calificaciones`
   - **Description**: `Sistema de Gestión Académica con React, Vite, Supabase y Vercel`
   - **Visibility**: Public
3. **NO inicialices** con README, .gitignore o license (ya existen)
4. Haz clic en "Create repository"
5. Copia la URL que te muestra (algo como `https://github.com/TU_USUARIO/sistema-calificaciones.git`)

### 2.3 Conectar Repositorio Local
```bash
# Agregar remote
git remote add origin https://github.com/TU_USUARIO/sistema-calificaciones.git

# Renombrar rama a main (si no lo está)
git branch -M main

# Hacer push
git push -u origin main
```

---

## FASE 3: Deploy en Vercel

### 3.1 Conectar Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con GitHub (recomendado)
3. Haz clic en "Add New..." → "Project"
4. Selecciona el repositorio `sistema-calificaciones`
5. Haz clic en "Import"

### 3.2 Configurar Variables de Entorno
En la página de configuración de Vercel:

1. En la sección **Environment Variables**
2. Agrega las siguientes variables (una por una):

| Variable | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | Tu URL de Supabase (ej: `https://xyzabc.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Tu clave anónima de Supabase |

3. Haz clic en "Deploy"

### 3.3 Esperar Deployment
- Vercel comenzará a compilar automáticamente
- Puedes ver el progreso en la consola
- El proceso toma 2-5 minutos
- Una vez completado, tu URL será: `https://sistema-calificaciones-[algo].vercel.app`

---

## FASE 4: Verificación Post-Deploy

### 4.1 Verificar Conectividad
1. Abre tu URL en navegador
2. Deberías ver la aplicación cargada
3. Abre la consola del navegador (F12)
4. No debería haber errores de Supabase

### 4.2 Probar Base de Datos
1. En Supabase, ve a **SQL Editor**
2. Ejecuta una query simple:
```sql
SELECT COUNT(*) as total FROM usuarios;
```
3. Debería responder `0` (tabla vacía)

### 4.3 Probar Funcionalidades Críticas
- [ ] Página de login carga sin errores
- [ ] Puedes crear un usuario
- [ ] Puedes iniciar sesión
- [ ] Los datos se guardan en Supabase

---

## FASE 5: Optimizaciones de Producción (Opcional)

### 5.1 Configurar Dominio Personalizado (en Vercel)
1. En Vercel, ve a **Project Settings → Domains**
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar DNS

### 5.2 Configurar Backups Automáticos (en Supabase)
1. En Supabase, ve a **Settings → Backups**
2. Configura backups automáticos diarios

### 5.3 Monitorear Errores (Opcional)
1. Integra Sentry o similar para monitoreo de errores en producción
2. Configura alertas de desempeño

---

## 🚨 Troubleshooting

### Error: "Variables de entorno de Supabase no configuradas"
**Solución:**
1. En Vercel, verifica que las variables estén en la sección correcta
2. Vuelve a hacer deploy después de agregar las variables
3. Espera 2-3 minutos después de agregar variables

### Error: "CORS error" al conectar a Supabase
**Solución:**
1. En Supabase, ve a **Settings → API → CORS**
2. Agrega tu URL de Vercel a la lista blanca
3. Agrega también `http://localhost:3000` para desarrollo local

### Error: "Unauthorized" en operaciones de base de datos
**Solución:**
1. Verifica que estés usando la clave anónima (no la de servicio)
2. Comprueba las políticas RLS en Supabase
3. Ve a **Authentication → Policies** y verifica permisos

---

## 📊 URLs Importantes

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Tu Aplicación**: https://sistema-calificaciones-[algo].vercel.app
- **Documentación Supabase**: https://supabase.com/docs
- **Documentación Vercel**: https://vercel.com/docs

---

## 🔐 Mejores Prácticas de Seguridad

1. **Nunca** expongas las credenciales en el código
2. Usa solo la clave anónima en el frontend
3. Implementa Row Level Security (RLS) en todas las tablas
4. Usa funciones de servidor (RPC) para operaciones sensibles
5. Valida todas las entradas en el servidor
6. Habilita autenticación multifactor en Supabase y Vercel

---

## 📝 Próximos Pasos

1. Crear usuarios de prueba
2. Cargar datos de ejemplo
3. Configurar roles y permisos (RLS)
4. Implementar respaldos automáticos
5. Configurar monitoreo y alertas
6. Configurar dominio personalizado

---

**¡Tu aplicación está lista para producción! 🎉**

# 🎯 Guía Rápida - Deploy Sistema de Calificaciones

## ⚡ 5 minutos para tener la app en producción

### Paso 1: Crear cuenta Supabase (2 min)
```
1. Ir a https://supabase.com
2. Sign up con GitHub
3. Crear nuevo proyecto
4. Copiar SUPABASE_URL y SUPABASE_ANON_KEY
```

### Paso 2: Configurar BD (1 min)
```
1. En Supabase → SQL Editor → New Query
2. Copiar contenido de supabase.sql
3. Ejecutar (Ctrl+Enter)
4. ✅ Listo, tablas creadas con seguridad y triggers
```

### Paso 3: Push a GitHub (1 min)
```bash
cd sistema-calificaciones-dev
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/sistema-calificaciones.git
git push -u origin main
```

### Paso 4: Deploy en Vercel (1 min)
```
1. Ir a https://vercel.com
2. Importar proyecto desde GitHub
3. Agregar environment variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
4. Deploy
5. ✅ ¡App lista en producción!
```

---

## 🔐 Características de Seguridad Implementadas

### ✅ Row Level Security (RLS)
- Alumnos solo ven sus calificaciones
- Docentes solo ven sus asignaturas
- Admin ve todo

### ✅ Triggers Automáticos
- Auditoría de cambios
- Cálculos automáticos de promedios
- Notificaciones al cargar calificaciones
- Actualización automática de timestamps

### ✅ Columnas Calculated
- `trim1_promedio`, `trim2_promedio`, `trim3_promedio`
- `promedio_final`
- `estado_final` (aprobado/reprobado automático)
- GENERATED ALWAYS (sin UPDATE manual)

### ✅ Índices para Rendimiento
- Búsqueda rápida de usuarios por cedula
- Filtrado rápido por curso
- Reportes sin lag

### ✅ Vistas para Reportes
- `vista_reportes_alumno` → calificaciones consolidadas
- `vista_resumen_docentes` → carga de trabajo

---

## 📊 Estructura BD

```
usuarios (autenticación)
  ├── alumnos (estudiantes)
  │   └── inscripciones (enrolamiento)
  │       └── calificaciones (notas)
  └── docentes (profesores)
      └── asignaturas (materias)

+ auditoría (registro de cambios)
+ notificaciones (alertas)
```

---

## 🎮 Credenciales de Prueba

```
Admin:
  Usuario: admin
  Contraseña: admin

Profesor:
  Usuario: profesor
  Contraseña: 1234

Estudiante:
  Usuario: juan.garcia
  Contraseña: 1234567890
```

---

## 📁 Archivos Importantes

| Archivo | Descripción |
|---------|------------|
| `supabase.sql` | Script BD completo con RLS y triggers |
| `src/supabaseClient.js` | Cliente Supabase configurado |
| `.env.example` | Template de variables de entorno |
| `vercel.json` | Configuración para Vercel |
| `DATABASE.md` | Documentación técnica completa |
| `DEPLOY.md` | Guía paso a paso |

---

## 🚀 Tecnología Stack

```
Frontend:
  - React 19.2
  - Vite 7.2.4
  - Tailwind CSS (CDN)
  - Lucide React Icons

Backend:
  - Supabase (PostgreSQL)
  - Row Level Security
  - Triggers automáticos
  - Real-time subscriptions

Deploy:
  - Vercel (Edge Computing)
  - GitHub (Version Control)
  - SSL/TLS automático
```

---

## ✨ Características Especiales

### 1. Cálculos Automáticos
Los promedios se calculan automáticamente sin necesidad de código:
```sql
trim1_promedio = trim1_insumo * 0.4 + trim1_prueba * 0.6
promedio_final = (trim1 + trim2 + trim3) / 3
estado_final = SI promedio >= 7 ENTONCES 'aprobado' SINO 'reprobado'
```

### 2. Auditoría Total
Cada cambio queda registrado en `auditoria` table:
- Quién cambió
- Qué cambió
- Cuándo cambió
- Valores anteriores y nuevos

### 3. Seguridad en BD
No necesita validaciones en frontend:
- RLS previene acceso no autorizado
- Constraints UNIQUE previenen duplicados
- Foreign Keys previenen datos huérfanos
- Triggers mantienen integridad

### 4. Notificaciones Automáticas
Cuando se cargan calificaciones:
- Se crea notificación automáticamente
- Alumno recibe alerta
- Se registra en auditoría

---

## 🔄 Workflow Típico

### Admin agrega alumno:
```
1. Admin ingresa datos en formulario
2. Sistema genera usuario automáticamente: nombre.apellido
3. Contraseña = cédula ingresada
4. Se crea registro en tabla alumnos
5. Se registra en auditoría
```

### Docente carga notas:
```
1. Docente ingresa insumo y prueba del alumno
2. Sistema calcula promedio trimestral (GENERATED)
3. Sistema calcula promedio final (GENERATED)
4. Sistema determina estado (aprobado/reprobado) (GENERATED)
5. Se crea notificación automática para alumno
6. Se registra cambio en auditoría
7. Alumno ve calificaciones al entrar
```

### Alumno ve calificaciones:
```
1. Alumno inicia sesión con usuario y cédula
2. Sistema busca inscripciones del alumno
3. Muestra todas sus asignaturas y calificaciones
4. RLS asegura que solo ve sus datos
```

---

## 🎓 Próximas Mejoras

- [ ] Integración con email (notificaciones por correo)
- [ ] Dashboard con gráficos de rendimiento
- [ ] Exportación de reportes a PDF/Excel
- [ ] Mobile app (React Native)
- [ ] Integración con sistemas de pago
- [ ] Portal para padres
- [ ] Sistema de mensajería entre usuarios
- [ ] Respaldo automático a Google Drive

---

## 📞 Soporte

### Errores comunes:

**"Cannot find module '@supabase/supabase-js'"**
```bash
npm install @supabase/supabase-js
```

**"VITE_SUPABASE_URL is not defined"**
→ Agregar variables en Vercel Settings

**"Cannot INSERT into tabla"**
→ RLS policy está bloqueando, verificar en Supabase

---

## 📚 Recursos

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- React Docs: https://react.dev
- PostgreSQL Docs: https://postgresql.org/docs

---

**¡Listo para producción! 🚀**

Fecha: Enero 2026
Versión: 1.0.0

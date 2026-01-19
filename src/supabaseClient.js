import { createClient } from '@supabase/supabase-js';

// Obtener credenciales de variables de entorno
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar que las variables de entorno existan - Crítico en producción
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  const errorMsg = '❌ ERROR: Variables de entorno de Supabase no configuradas. Verifica tu archivo .env';
  console.error(errorMsg);
  if (import.meta.env.PROD) {
    throw new Error(errorMsg);
  }
}

// Crear cliente de Supabase con opciones de producción
export const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Funciones de utilidad para autenticación

/**
 * Registrar nuevo usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @param {object} userData - Datos adicionales (nombre, apellido, usuario, rol)
 */
export const registrarUsuario = async (email, password, userData) => {
  try {
    // Registrar en Auth de Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) throw authError;

    // Crear registro en tabla usuarios
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{
        id: authData.user.id,
        email,
        nombre: userData.nombre,
        apellido: userData.apellido,
        usuario: userData.usuario,
        rol: userData.rol || 'estudiante',
        password_hash: authData.user.id // En producción, usar función RPC para hash
      }]);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error registrando usuario:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Iniciar sesión
 * @param {string} email - Email
 * @param {string} password - Contraseña
 */
export const iniciarSesion = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Obtener datos del usuario
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;

    return { success: true, data: userData, user: data.user };
  } catch (error) {
    console.error('Error iniciando sesión:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Cerrar sesión
 */
export const cerrarSesion = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error cerrando sesión:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener usuario actual
 */
export const obtenerUsuarioActual = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    if (!user) return null;

    // Obtener datos completos del usuario
    const { data, error: dataError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .single();

    if (dataError) throw dataError;

    return data;
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return null;
  }
};

/**
 * Obtener todas las calificaciones de un alumno
 */
export const obtenerCalificacionesAlumno = async (alumnoId) => {
  try {
    const { data, error } = await supabase
      .from('vista_reportes_alumno')
      .select('*')
      .eq('alumno_id', alumnoId);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error obteniendo calificaciones:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener asignaturas de un docente
 */
export const obtenerAsignaturasDocente = async (docenteId) => {
  try {
    const { data, error } = await supabase
      .from('asignaturas')
      .select('*')
      .eq('docente_id', docenteId)
      .eq('activa', true);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error obteniendo asignaturas:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Cargar calificaciones (solo docentes)
 */
export const cargarCalificaciones = async (inscripcionId, calificaciones) => {
  try {
    const { data, error } = await supabase
      .from('calificaciones')
      .insert([{
        inscripcion_id: inscripcionId,
        ...calificaciones
      }]);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error cargando calificaciones:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Suscribirse a cambios en tiempo real
 */
export const suscribirseACambios = (tabla, callback) => {
  try {
    const subscription = supabase
      .channel(`${tabla}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tabla
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return subscription;
  } catch (error) {
    console.error('Error suscribiéndose a cambios:', error);
    return null;
  }
};

export default supabase;

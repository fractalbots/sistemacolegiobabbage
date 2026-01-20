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

// ============================================================
// FUNCIONES PARA GESTIÓN DE PROFESORES Y MATERIAS
// ============================================================

/**
 * Obtener todas las asignaturas disponibles en un curso
 * @param {number} cursoId - ID del curso
 */
export const obtenerAsignaturasDelCurso = async (cursoId) => {
  try {
    const { data, error } = await supabase
      .from('asignaturas_por_curso')
      .select(`
        id,
        asignatura_id,
        curso_id,
        horas_semanales,
        es_obligatoria,
        asignaturas(id, nombre, codigo)
      `)
      .eq('curso_id', cursoId)
      .eq('es_obligatoria', true);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error obteniendo asignaturas del curso:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener todas las asignaciones de un profesor
 * @param {number} docenteId - ID del docente
 */
export const obtenerAsignacionesProfesor = async (docenteId) => {
  try {
    const { data, error } = await supabase
      .from('docente_asignatura_curso')
      .select(`
        id,
        docente_id,
        asignatura_id,
        curso_id,
        activa,
        asignaturas(id, nombre, codigo),
        cursos(id, nombre, nivel)
      `)
      .eq('docente_id', docenteId)
      .eq('activa', true)
      .order('cursos(nivel)', { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error obteniendo asignaciones:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Asignar materia(s) a un profesor en un curso
 * @param {number} docenteId - ID del docente
 * @param {array} asignaciones - Array de {asignatura_id, curso_id}
 */
export const asignarMateriasAlProfesor = async (docenteId, asignaciones) => {
  try {
    const registros = asignaciones.map(a => ({
      docente_id: docenteId,
      asignatura_id: a.asignatura_id,
      curso_id: a.curso_id,
      activa: true
    }));

    const { data, error } = await supabase
      .from('docente_asignatura_curso')
      .insert(registros)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error asignando materias:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Remover asignación de materia de un profesor
 * @param {number} asignacionId - ID de la asignación
 */
export const removerAsignacionProfesor = async (asignacionId) => {
  try {
    const { error } = await supabase
      .from('docente_asignatura_curso')
      .update({ activa: false })
      .eq('id', asignacionId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error removiendo asignación:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Crear o actualizar un docente
 * @param {object} docenteData - {nombre, apellido, cedula, email, usuario, password_hash, especialidad}
 * @param {number} docenteId - ID del docente (opcional, si se proporciona actualiza)
 */
export const guardarDocente = async (docenteData, docenteId = null) => {
  try {
    const datos = {
      ...docenteData,
      updated_at: new Date().toISOString()
    };

    let response;
    if (docenteId) {
      // Actualizar
      response = await supabase
        .from('docentes')
        .update(datos)
        .eq('id', docenteId)
        .select();
    } else {
      // Crear
      response = await supabase
        .from('docentes')
        .insert([datos])
        .select();
    }

    const { data, error } = response;

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error guardando docente:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener todos los docentes con sus asignaciones
 */
export const obtenerDocentesConAsignaciones = async () => {
  try {
    const { data: docentes, error: docentesError } = await supabase
      .from('docentes')
      .select('*')
      .eq('activo', true)
      .order('nombre', { ascending: true });

    if (docentesError) throw docentesError;

    // Obtener asignaciones para cada docente
    const docentesConAsignaciones = await Promise.all(
      docentes.map(async (docente) => {
        const { data: asignaciones } = await obtenerAsignacionesProfesor(docente.id);
        return {
          ...docente,
          asignaciones: asignaciones || []
        };
      })
    );

    return { success: true, data: docentesConAsignaciones };
  } catch (error) {
    console.error('Error obteniendo docentes:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Crear o actualizar un alumno
 * @param {object} alumnoData - {nombre, apellido, cedula, email, curso_id, usuario, password_hash, bloqueado, mensajeBloqueo}
 * @param {number} alumnoId - ID del alumno (opcional, si se proporciona actualiza)
 */
export const guardarAlumno = async (alumnoData, alumnoId = null) => {
  try {
    const datos = {
      ...alumnoData,
      updated_at: new Date().toISOString()
    };

    let response;
    if (alumnoId) {
      // Actualizar
      response = await supabase
        .from('alumnos')
        .update(datos)
        .eq('id', alumnoId)
        .select();
    } else {
      // Crear
      response = await supabase
        .from('alumnos')
        .insert([datos])
        .select();
    }

    const { data, error } = response;

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error guardando alumno:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener todas las materias de un profesor en un curso específico
 * @param {number} docenteId - ID del docente
 * @param {number} cursoId - ID del curso
 */
export const obtenerMateriasProfesorEnCurso = async (docenteId, cursoId) => {
  try {
    const { data, error } = await supabase
      .from('docente_asignatura_curso')
      .select(`
        id,
        asignaturas(id, nombre, codigo)
      `)
      .eq('docente_id', docenteId)
      .eq('curso_id', cursoId)
      .eq('activa', true);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error obteniendo materias del profesor:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener información detallada de un curso con sus asignaturas
 * @param {number} cursoId - ID del curso
 */
export const obtenerCursoConAsignaturas = async (cursoId) => {
  try {
    const { data: cursoData, error: cursoError } = await supabase
      .from('cursos')
      .select('*')
      .eq('id', cursoId)
      .single();

    if (cursoError) throw cursoError;

    const { data: asignaturasData, error: asignaturasError } = await supabase
      .from('asignaturas_por_curso')
      .select(`
        id,
        asignatura_id,
        horas_semanales,
        es_obligatoria,
        asignaturas(id, nombre, codigo)
      `)
      .eq('curso_id', cursoId);

    if (asignaturasError) throw asignaturasError;

    return { success: true, data: { curso: cursoData, asignaturas: asignaturasData } };
  } catch (error) {
    console.error('Error obteniendo curso con asignaturas:', error);
    return { success: false, error: error.message };
  }
};

export default supabase;

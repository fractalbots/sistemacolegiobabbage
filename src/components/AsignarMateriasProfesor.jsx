import React, { useState, useEffect } from 'react';
import { Plus, X, Save, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

/**
 * Componente para asignar múltiples materias y cursos a un profesor
 * - Un profesor puede tener múltiples materias en múltiples cursos
 * - Una materia puede repetirse en diferentes cursos
 * - Interfaz clara para evitar conflictos
 */
const AsignarMateriasProfesor = ({ profesorId, profesorNombre, onClose, onSuccess }) => {
  const [cursos, setCursos] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [asignaturasDisponibles, setAsignaturasDisponibles] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState('');
  const [selectedAsignatura, setSelectedAsignatura] = useState('');
  const [asignacionesActuales, setAsignacionesActuales] = useState([]);
  const [novaAsignacion, setNovaAsignacion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError('');

        // Cargar cursos
        const { data: cursosData, error: cursosError } = await supabase
          .from('cursos')
          .select('*')
          .eq('activo', true)
          .order('nivel', { ascending: true });

        if (cursosError) throw cursosError;
        setCursos(cursosData || []);

        // Cargar asignaturas
        const { data: asignaturasData, error: asignaturasError } = await supabase
          .from('asignaturas')
          .select('*')
          .eq('activa', true)
          .order('nombre', { ascending: true });

        if (asignaturasError) throw asignaturasError;
        setAsignaturas(asignaturasData || []);
        setAsignaturasDisponibles(asignaturasData || []);

        // Cargar asignaciones actuales del profesor
        const { data: asignacionesData, error: asignacionesError } = await supabase
          .from('docente_asignatura_curso')
          .select(`
            id,
            asignatura_id,
            curso_id,
            asignaturas(nombre),
            cursos(nombre)
          `)
          .eq('docente_id', profesorId)
          .eq('activa', true);

        if (asignacionesError) throw asignacionesError;
        setAsignacionesActuales(asignacionesData || []);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('Error al cargar los datos: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [profesorId]);

  // Filtrar asignaturas disponibles para el curso seleccionado
  useEffect(() => {
    if (selectedCurso) {
      const filtrarAsignaturas = async () => {
        try {
          const { data, error } = await supabase
            .from('asignaturas_por_curso')
            .select('asignatura_id, asignaturas(id, nombre)')
            .eq('curso_id', selectedCurso)
            .eq('es_obligatoria', true);

          if (error) throw error;
          const asignaturasDelCurso = data?.map(item => item.asignaturas) || [];
          setAsignaturasDisponibles(asignaturasDelCurso);
          setSelectedAsignatura('');
        } catch (err) {
          console.error('Error filtrando asignaturas:', err);
          setError('Error al filtrar asignaturas: ' + err.message);
        }
      };

      filtrarAsignaturas();
    }
  }, [selectedCurso]);

  // Agregar nueva asignación (local)
  const agregarAsignacion = () => {
    if (!selectedCurso || !selectedAsignatura) {
      setError('Por favor selecciona un curso y una asignatura');
      return;
    }

    // Verificar si ya existe
    const existe = novaAsignacion.some(
      a => a.curso_id === parseInt(selectedCurso) && a.asignatura_id === parseInt(selectedAsignatura)
    );

    if (existe) {
      setError('Esta asignatura ya está agregada para este curso');
      return;
    }

    const cursoNombre = cursos.find(c => c.id === parseInt(selectedCurso))?.nombre;
    const asignaturaNombre = asignaturasDisponibles.find(a => a.id === parseInt(selectedAsignatura))?.nombre;

    setNovaAsignacion([
      ...novaAsignacion,
      {
        curso_id: parseInt(selectedCurso),
        asignatura_id: parseInt(selectedAsignatura),
        curso_nombre: cursoNombre,
        asignatura_nombre: asignaturaNombre
      }
    ]);

    setError('');
    setSelectedCurso('');
    setSelectedAsignatura('');
  };

  // Remover asignación nueva
  const removerAsignacion = (index) => {
    setNovaAsignacion(novaAsignacion.filter((_, i) => i !== index));
  };

  // Remover asignación existente
  const removerAsignacionExistente = async (asignacionId) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('docente_asignatura_curso')
        .update({ activa: false })
        .eq('id', asignacionId);

      if (error) throw error;

      setAsignacionesActuales(asignacionesActuales.filter(a => a.id !== asignacionId));
      setSuccess('Asignación removida exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error removiendo asignación:', err);
      setError('Error al remover: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Guardar todas las nuevas asignaciones
  const guardarAsignaciones = async () => {
    if (novaAsignacion.length === 0) {
      setError('No hay nuevas asignaciones para guardar');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const asignacionesAGuardar = novaAsignacion.map(a => ({
        docente_id: profesorId,
        asignatura_id: a.asignatura_id,
        curso_id: a.curso_id,
        activa: true
      }));

      const { data, error } = await supabase
        .from('docente_asignatura_curso')
        .insert(asignacionesAGuardar)
        .select();

      if (error) throw error;

      // Agregar las nuevas asignaciones al estado
      const nuevasAsignacionesConDetalles = data.map(item => ({
        ...item,
        asignaturas: asignaturasDisponibles.find(a => a.id === item.asignatura_id),
        cursos: cursos.find(c => c.id === item.curso_id)
      }));

      setAsignacionesActuales([...asignacionesActuales, ...nuevasAsignacionesConDetalles]);
      setNovaAsignacion([]);
      setSuccess(`✅ ${asignacionesAGuardar.length} asignación(es) guardada(s) exitosamente`);

      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    } catch (err) {
      console.error('Error guardando asignaciones:', err);
      setError('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 flex flex-col items-center">
          <Loader className="w-8 h-8 text-blue-600 animate-spin mb-4" />
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Asignar Materias</h2>
            <p className="text-blue-100">Profesor: {profesorNombre}</p>
          </div>
          <button onClick={onClose} className="hover:bg-blue-800 p-2 rounded">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Mensajes de error y éxito */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {/* Formulario para agregar nuevas asignaciones */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold text-lg mb-4">Agregar Nueva Asignación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Curso</label>
                <select
                  value={selectedCurso}
                  onChange={(e) => setSelectedCurso(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona un curso...</option>
                  {cursos.map(curso => (
                    <option key={curso.id} value={curso.id}>
                      {curso.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Materia</label>
                <select
                  value={selectedAsignatura}
                  onChange={(e) => setSelectedAsignatura(e.target.value)}
                  disabled={!selectedCurso}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Selecciona una materia...</option>
                  {asignaturasDisponibles.map(asignatura => (
                    <option key={asignatura.id} value={asignatura.id}>
                      {asignatura.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={agregarAsignacion}
              disabled={!selectedCurso || !selectedAsignatura}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-2 rounded-lg flex items-center justify-center space-x-2 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar Asignación</span>
            </button>
          </div>

          {/* Nueva asignaciones pendientes */}
          {novaAsignacion.length > 0 && (
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h3 className="font-semibold text-lg mb-4 text-blue-900">Asignaciones para guardar ({novaAsignacion.length})</h3>
              <div className="space-y-2">
                {novaAsignacion.map((asignacion, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded border border-blue-200">
                    <div>
                      <p className="font-medium text-gray-800">{asignacion.asignatura_nombre}</p>
                      <p className="text-sm text-gray-600">Curso: {asignacion.curso_nombre}</p>
                    </div>
                    <button
                      onClick={() => removerAsignacion(index)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={guardarAsignaciones}
                disabled={saving}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg flex items-center justify-center space-x-2 transition"
              >
                {saving ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                <span>{saving ? 'Guardando...' : 'Guardar Asignaciones'}</span>
              </button>
            </div>
          )}

          {/* Asignaciones actuales */}
          {asignacionesActuales.length > 0 && (
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <h3 className="font-semibold text-lg mb-4 text-green-900">Asignaciones Actuales ({asignacionesActuales.length})</h3>
              <div className="space-y-2">
                {asignacionesActuales.map((asignacion) => (
                  <div key={asignacion.id} className="flex items-center justify-between bg-white p-3 rounded border border-green-200">
                    <div>
                      <p className="font-medium text-gray-800">{asignacion.asignaturas?.nombre}</p>
                      <p className="text-sm text-gray-600">Curso: {asignacion.cursos?.nombre}</p>
                    </div>
                    <button
                      onClick={() => removerAsignacionExistente(asignacion.id)}
                      disabled={saving}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 disabled:opacity-50 p-2 rounded"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {asignacionesActuales.length === 0 && novaAsignacion.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No hay asignaciones. Agrega una nueva asignación para comenzar.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsignarMateriasProfesor;

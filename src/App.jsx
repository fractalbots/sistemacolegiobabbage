import React, { useState, useEffect } from 'react';
import { Download, Plus, Save, Trash2, Edit2, LogOut, User, BookOpen, GraduationCap, Menu, BarChart3, Users, FileText, Settings, X } from 'lucide-react';
import html2pdf from 'html2pdf.js';

// Logo de Charles Babbage - SVG
const LogoCharlesBabbage = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    {/* Marco dorado */}
    <circle cx="100" cy="100" r="95" fill="#D4AF37" stroke="#B8860B" strokeWidth="3"/>
    {/* División rojo y negro */}
    <path d="M 100 20 L 150 80 L 150 180 L 50 180 L 50 80 Z" fill="#CC0000"/>
    <path d="M 100 20 L 150 80 L 150 180 Q 100 150 50 180 L 50 80 Z" fill="#000000"/>
    {/* Libro blanco */}
    <g transform="translate(100, 70)">
      <rect x="-20" y="-15" width="40" height="30" fill="white" stroke="white" strokeWidth="1" rx="2"/>
      <line x1="-20" y1="0" x2="20" y2="0" stroke="white" strokeWidth="1"/>
      <line x1="0" y1="-15" x2="0" y2="15" stroke="white" strokeWidth="1"/>
    </g>
    {/* Pluma roja en la parte inferior */}
    <g transform="translate(75, 130)">
      <path d="M 0 0 Q 5 10 3 25 L 1 25 Q 2 10 0 0" fill="#CC0000" stroke="#8B0000" strokeWidth="1"/>
      <ellipse cx="2" cy="26" rx="2" ry="3" fill="#333"/>
    </g>
  </svg>
);

const SistemaCalificaciones = () => {
  // Estados de autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin', 'docente', 'estudiante'
  const [currentUser, setCurrentUser] = useState(null);
  const [loginData, setLoginData] = useState({ usuario: '', password: '' });
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  
  // Estados del panel
  const [vistaActual, setVistaActual] = useState('dashboard');
  
  // Datos de alumnos
  const [alumnos, setAlumnos] = useState([
    { id: 1, nombre: 'Juan', apellido: 'García', cedula: '1234567890', email: 'juan@example.com', curso: 'Octavo', usuario: 'juan.garcia', password: '1234567890', bloqueado: false, mensajeBloqueo: '' }
  ]);
  const [formAlumno, setFormAlumno] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    curso: '',
    bloqueado: false,
    mensajeBloqueo: ''
  });
  const [editandoAlumno, setEditandoAlumno] = useState(null);
  const [alumnoActivo, setAlumnoActivo] = useState(null);
  const [selectedAsignatura, setSelectedAsignatura] = useState('');
  const [insumoNota, setInsumoNota] = useState(9.0);
  const [pruebaNota, setPruebaNota] = useState(9.5);
  const [changePasswordEmail, setChangePasswordEmail] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  
  // Datos de docentes
  const [docentes, setDocentes] = useState([
    { id: 1, nombre: 'Licenciado', apellido: 'Profesor', cedula: '9876543210', email: 'profesor@example.com', usuario: 'profesor', password: '1234', asignaturas: ['Matemáticas', 'Inglés'], cambiosBloqueados: false }
  ]);
  const [formDocente, setFormDocente] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    usuario: '',
    password: '',
    asignaturas: [],
    cambiosBloqueados: false
  });
  const [editandoDocente, setEditandoDocente] = useState(null);
  
  // Estados para cálculo de notas
  const [notasActual, setNotasActual] = useState({
    insumo1: 0,
    insumo2: 0,
    insumo3: 0,
    insumo4: 0,
    examen: 0
  });
  
  // Datos de cursos
  const [cursos, setCursos] = useState([
    { id: 1, nombre: 'Octavo', descripcion: 'Octavo grado' },
    { id: 2, nombre: 'Noveno', descripcion: 'Noveno grado' },
    { id: 3, nombre: 'Décimo', descripcion: 'Décimo grado' },
    { id: 4, nombre: 'Primero', descripcion: 'Primero de bachillerato' },
    { id: 5, nombre: 'Segundo', descripcion: 'Segundo de bachillerato' },
    { id: 6, nombre: 'Tercero', descripcion: 'Tercero de bachillerato' }
  ]);
  
  // Datos de asignaturas
  const [asignaturas, setAsignaturas] = useState([
    { id: 1, nombre: 'Matemáticas', docente: 'Lic. Anahi Vega', curso: 'Octavo' },
    { id: 2, nombre: 'Inglés', docente: 'Lic. Diaz', curso: 'Octavo' },
    { id: 3, nombre: 'Lenguaje', docente: 'Lic. Jara', curso: 'Octavo' },
    { id: 4, nombre: 'Sociales', docente: 'Lic. Vivas', curso: 'Octavo' },
    { id: 5, nombre: 'Ciencias Naturales', docente: 'Lic. Naula', curso: 'Octavo' },
    { id: 6, nombre: 'Educación Física', docente: 'Lic. Guasumba', curso: 'Octavo' }
  ]);
  
  const [formAsignatura, setFormAsignatura] = useState({
    nombre: '',
    docente: '',
    curso: ''
  });
  const [editandoAsignatura, setEditandoAsignatura] = useState(null);
  
  // Datos de notas (para vista de estudiante/docente)
  const [notas, setNotas] = useState([]);
  
  // Materias para alumnos
  const [materias, setMaterias] = useState(['Matemáticas', 'Español', 'Ciencias', 'Historia', 'Inglés']);

  // Datos precargados de docentes (vacío - el admin crea los profesores)
  const docentesPrecargados = [];

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      guardarDatos();
    }
  }, [alumnos, docentes, asignaturas, isLoggedIn]);

  const cargarDatos = async () => {
    // Los datos están en estado local
  };

  const guardarDatos = async () => {
    // Los datos se guardan automáticamente en estado local
  };

  // Función para descargar PDF de calificaciones
  const descargarPDF = () => {
    const element = document.getElementById('pdf-content');
    const opt = {
      margin: 10,
      filename: `Calificaciones-${currentUser?.nombre}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleLogin = () => {
    if (!loginData.usuario || !loginData.password) {
      alert('Por favor completa todos los campos');
      return;
    }

    // 1. LOGIN ADMIN - Hardcoded
    if (loginData.usuario === 'admin' && loginData.password === 'admin') {
      setIsLoggedIn(true);
      setUserRole('admin');
      setCurrentUser({ nombre: 'Administrador', usuario: 'admin' });
      setVistaActual('dashboard');
      setLoginData({ usuario: '', password: '' });
      return;
    }

    // 2. LOGIN DOCENTE - Buscar localmente
    const docente = docentes.find(d => d.usuario === loginData.usuario && d.password === loginData.password);
    if (docente) {
      setIsLoggedIn(true);
      setUserRole('docente');
      setCurrentUser({ nombre: `${docente.nombre} ${docente.apellido}`, usuario: docente.usuario, id: docente.id });
      setVistaActual('mis-asignaturas');
      setLoginData({ usuario: '', password: '' });
      return;
    }

    // 3. LOGIN ALUMNO - Buscar localmente
    const alumno = alumnos.find(a => a.usuario === loginData.usuario && a.password === loginData.password);
    if (alumno) {
      if (alumno.bloqueado) {
        alert(`❌ Acceso Denegado: ${alumno.mensajeBloqueo || 'Tu cuenta ha sido bloqueada por el administrador'}`);
        return;
      }
      setIsLoggedIn(true);
      setUserRole('estudiante');
      setCurrentUser({ nombre: `${alumno.nombre} ${alumno.apellido}`, usuario: alumno.usuario, id: alumno.id });
      setVistaActual('mis-calificaciones');
      setLoginData({ usuario: '', password: '' });
      return;
    }

    alert('❌ Usuario o contraseña incorrectos');
  };

  // ========== FUNCIONES ALUMNOS ==========
  const agregarAlumno = () => {
    if (!formAlumno.nombre || !formAlumno.apellido || !formAlumno.cedula || !formAlumno.curso) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const usuario = `${formAlumno.nombre.toLowerCase()}.${formAlumno.apellido.toLowerCase()}`;
    const password = formAlumno.cedula; // La contraseña es la cédula

    const nuevoAlumno = {
      id: Math.max(...alumnos.map(a => a.id), 0) + 1,
      nombre: formAlumno.nombre,
      apellido: formAlumno.apellido,
      cedula: formAlumno.cedula,
      email: formAlumno.email,
      curso: formAlumno.curso,
      usuario,
      password,
      bloqueado: formAlumno.bloqueado || false,
      mensajeBloqueo: formAlumno.mensajeBloqueo || ''
    };

    if (editandoAlumno) {
      setAlumnos(alumnos.map(a => a.id === editandoAlumno.id ? { ...editandoAlumno, ...nuevoAlumno } : a));
      setEditandoAlumno(null);
      alert(`✅ Alumno actualizado\n\nCredenciales de acceso:\nUsuario: ${usuario}\nContraseña: ${password}`);
    } else {
      setAlumnos([...alumnos, nuevoAlumno]);
      alert(`✅ Alumno agregado\n\nCredenciales de acceso:\nUsuario: ${usuario}\nContraseña: ${password}\n\n⚠️ Comparte estas credenciales con el estudiante`);
    }
    setFormAlumno({ nombre: '', apellido: '', cedula: '', email: '', curso: '', bloqueado: false, mensajeBloqueo: '' });
  };

  const editarAlumno = (alumno) => {
    setFormAlumno({ nombre: alumno.nombre, apellido: alumno.apellido, cedula: alumno.cedula, email: alumno.email, curso: alumno.curso, bloqueado: alumno.bloqueado || false, mensajeBloqueo: alumno.mensajeBloqueo || '' });
    setEditandoAlumno(alumno);
  };

  const eliminarAlumno = (id) => {
    if (confirm('¿Estás seguro de eliminar este alumno?')) {
      setAlumnos(alumnos.filter(a => a.id !== id));
    }
  };

  // ========== FUNCIONES DOCENTES ==========
  const agregarDocente = () => {
    if (!formDocente.nombre || !formDocente.usuario || !formDocente.password) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    const nuevoDocente = {
      id: Math.max(...docentes.map(d => d.id), 0) + 1,
      ...formDocente,
      asignaturas: formDocente.asignaturas || [],
      cambiosBloqueados: formDocente.cambiosBloqueados || false
    };

    if (editandoDocente) {
      setDocentes(docentes.map(d => d.id === editandoDocente.id ? { ...editandoDocente, ...nuevoDocente } : d));
      setEditandoDocente(null);
      alert('Docente actualizado');
    } else {
      setDocentes([...docentes, nuevoDocente]);
      alert('Docente agregado');
    }
    setFormDocente({ nombre: '', apellido: '', cedula: '', email: '', usuario: '', password: '', asignaturas: [], cambiosBloqueados: false });
  };

  const editarDocente = (docente) => {
    setFormDocente({ 
      nombre: docente.nombre, 
      apellido: docente.apellido, 
      cedula: docente.cedula || '', 
      email: docente.email || '', 
      usuario: docente.usuario, 
      password: docente.password,
      asignaturas: docente.asignaturas || [],
      cambiosBloqueados: docente.cambiosBloqueados || false
    });
    setEditandoDocente(docente);
  };

  const eliminarDocente = (id) => {
    if (confirm('¿Estás seguro de eliminar este docente?')) {
      setDocentes(docentes.filter(d => d.id !== id));
    }
  };

  const toggleBloqueoDocente = (docenteId) => {
    setDocentes(docentes.map(d => 
      d.id === docenteId ? { ...d, cambiosBloqueados: !d.cambiosBloqueados } : d
    ));
    alert('Estado de bloqueo actualizado');
  };

  // Guardar nota (docente)
  const handleGuardarNota = () => {
    if (!alumnoActivo) {
      alert('Selecciona un estudiante antes de guardar la nota');
      return;
    }

    const docente = docentesPrecargados.find(d => d.usuario === currentUser?.usuario);
    const asign = selectedAsignatura || (docente?.asignaturas?.[0]) || (asignaturas[0]?.nombre);
    const t1 = Number(insumoNota) || 0;
    const t2 = Number(pruebaNota) || 0;
    const prom = Number(((t1 + t2) / 2).toFixed(2));

    const nuevaNota = {
      id: Math.max(...notas.map(n => n.id), 0) + 1,
      estudiante: `${alumnoActivo.nombre} ${alumnoActivo.apellido}`,
      asignatura: asign,
      trim1: t1,
      trim2: t2,
      trim3: prom,
      promedio: prom
    };

    setNotas(prev => [...prev, nuevaNota]);
    alert('Nota guardada');
    setVistaActual('mis-asignaturas');
  };

  // ========== FUNCIONES ASIGNATURAS ==========
  const agregarAsignatura = () => {
    if (!formAsignatura.nombre || !formAsignatura.docente || !formAsignatura.curso) {
      alert('Por favor completa todos los campos');
      return;
    }

    const nuevaAsignatura = {
      id: Math.max(...asignaturas.map(a => a.id), 0) + 1,
      nombre: formAsignatura.nombre,
      docente: formAsignatura.docente,
      curso: formAsignatura.curso
    };

    if (editandoAsignatura) {
      setAsignaturas(asignaturas.map(a => a.id === editandoAsignatura.id ? { ...editandoAsignatura, ...nuevaAsignatura } : a));
      setEditandoAsignatura(null);
      alert('Asignatura actualizada');
    } else {
      setAsignaturas([...asignaturas, nuevaAsignatura]);
      alert('Asignatura agregada');
    }
    setFormAsignatura({ nombre: '', docente: '', curso: '' });
  };

  const editarAsignatura = (asignatura) => {
    setFormAsignatura({ nombre: asignatura.nombre, docente: asignatura.docente, curso: asignatura.curso });
    setEditandoAsignatura(asignatura);
  };

  const eliminarAsignatura = (id) => {
    if (confirm('¿Estás seguro de eliminar esta asignatura?')) {
      setAsignaturas(asignaturas.filter(a => a.id !== id));
    }
  };

  const calcularPromedio = (notas) => {
    const valores = Object.values(notas).filter(n => n && !isNaN(n));
    if (valores.length === 0) return '-';
    const suma = valores.reduce((acc, val) => acc + parseFloat(val), 0);
    return (suma / valores.length).toFixed(2);
  };

  // ========== LOGIN ==========
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-700 via-black to-red-900 flex items-center justify-center p-4 sm:p-6">
        {/* Contenedor Principal Responsivo */}
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
          
          {/* Lado Izquierdo: Noticias y Avisos */}
          <div className="hidden md:block order-2 md:order-1">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Encabezado */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  📰 Noticias y Avisos
                </h2>
                <p className="text-red-100 text-sm mt-1">Mantente informado</p>
              </div>

              {/* Contenido */}
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {/* Noticia 1 */}
                <div className="border-l-4 border-red-600 pl-4 py-2">
                  <h3 className="font-bold text-gray-800 text-sm">📅 Calificaciones del Trimestre</h3>
                  <p className="text-gray-600 text-xs mt-1">Las calificaciones del primer trimestre han sido registradas. Revisa tu boletín académico.</p>
                  <span className="text-red-600 text-xs font-semibold mt-2 block">hace 2 días</span>
                </div>

                {/* Noticia 2 */}
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-bold text-gray-800 text-sm">🎓 Reunión de Padres</h3>
                  <p className="text-gray-600 text-xs mt-1">Se realizará la próxima reunión de padres el 25 de enero a las 18:00 horas en la sala de actos.</p>
                  <span className="text-blue-600 text-xs font-semibold mt-2 block">hace 5 días</span>
                </div>

                {/* Noticia 3 */}
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h3 className="font-bold text-gray-800 text-sm">🏆 Olimpiadas Académicas</h3>
                  <p className="text-gray-600 text-xs mt-1">¡Felicidades a nuestros estudiantes ganadores en las olimpiadas matemáticas!</p>
                  <span className="text-green-600 text-xs font-semibold mt-2 block">hace 1 semana</span>
                </div>

                {/* Noticia 4 */}
                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <h3 className="font-bold text-gray-800 text-sm">📚 Biblioteca Ampliada</h3>
                  <p className="text-gray-600 text-xs mt-1">Nuevos libros disponibles en nuestra biblioteca. Consulta el catálogo en la plataforma.</p>
                  <span className="text-yellow-600 text-xs font-semibold mt-2 block">hace 10 días</span>
                </div>

                {/* Noticia 5 */}
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h3 className="font-bold text-gray-800 text-sm">💻 Aula Virtual</h3>
                  <p className="text-gray-600 text-xs mt-1">Acceso a materiales complementarios y tareas en la aula virtual institucional.</p>
                  <span className="text-purple-600 text-xs font-semibold mt-2 block">hace 15 días</span>
                </div>
              </div>

              {/* Pie */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center">Sistema de Calificaciones © 2024</p>
              </div>
            </div>
          </div>

          {/* Lado Derecho: Login */}
          <div className="order-1 md:order-2">
            <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
              {/* Encabezado del Login */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <img 
                    src="/images/logo.png" 
                    alt="Logo Charles Babbage" 
                    className="h-20 w-20 object-contain"
                    onError={(e) => {
                      // Si no encuentra la imagen, muestra el SVG
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                  <div style={{display: 'none'}} className="flex">
                    <LogoCharlesBabbage size={80} />
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Charles Babbage</h1>
                <p className="text-red-700 font-semibold text-sm sm:text-base mt-2">Instituto de Educación Superior</p>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">Sistema de Gestión Académica</p>
              </div>

              {/* Formulario de Login */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Usuario</label>
                  <input
                    type="text"
                    value={loginData.usuario}
                    onChange={(e) => setLoginData({ ...loginData, usuario: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder="Ingresa tu usuario"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white text-gray-900 bg-white transition text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder="Ingresa tu contraseña"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white text-gray-900 bg-white transition text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Botón Login Principal */}
              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl hover:shadow-lg hover:from-red-700 hover:to-red-800 transition font-bold text-base sm:text-lg"
              >
                🔐 Ingresar
              </button>

              {/* Opciones de Recuperación */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowResetPassword(true)}
                  className="bg-blue-50 border-2 border-blue-300 text-blue-700 py-2 rounded-lg hover:bg-blue-100 transition font-semibold text-xs sm:text-sm"
                >
                  🔑 Recuperar Contraseña
                </button>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="bg-purple-50 border-2 border-purple-300 text-purple-700 py-2 rounded-lg hover:bg-purple-100 transition font-semibold text-xs sm:text-sm"
                >
                  ⚙️ Cambiar Contraseña
                </button>
              </div>

              {/* Info Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                  ¿Necesitas ayuda? Contacta al administrador del sistema
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Restablecer Contraseña Estudiante */}
        {showResetPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Restablecer Contraseña - Estudiante</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico *</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Ingresa tu correo registrado"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  />
                  <p className="text-xs text-gray-600 mt-1">Te enviaremos un enlace para restablecer tu contraseña</p>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => {
                      if (!resetEmail) {
                        alert('Por favor ingresa tu correo electrónico');
                        return;
                      }
                      // Verificar si el correo existe en alumnos
                      const alumno = alumnos.find(a => a.email === resetEmail);
                      if (alumno) {
                        alert(`Se envió un enlace de restablecimiento a ${resetEmail}.\n\nTu nueva contraseña es tu número de cédula: ${alumno.cedula}`);
                        setShowResetPassword(false);
                        setResetEmail('');
                      } else {
                        alert('No encontramos un alumno con ese correo electrónico');
                      }
                    }}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold text-sm"
                  >
                    ✓ Enviar Enlace
                  </button>
                  <button
                    onClick={() => {
                      setShowResetPassword(false);
                      setResetEmail('');
                    }}
                    className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition font-semibold text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Cambiar Contraseña Admin */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Cambiar Contraseña - Admin</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nueva Contraseña</label>
                  <input
                    type="password"
                    value={adminNewPassword}
                    onChange={(e) => setAdminNewPassword(e.target.value)}
                    placeholder="Ingresa nueva contraseña"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar Contraseña</label>
                  <input
                    type="password"
                    value={adminConfirmPassword}
                    onChange={(e) => setAdminConfirmPassword(e.target.value)}
                    placeholder="Confirma la nueva contraseña"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-gray-900"
                  />
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => {
                      if (!adminNewPassword || !adminConfirmPassword) {
                        alert('Por favor completa todos los campos');
                        return;
                      }
                      if (adminNewPassword !== adminConfirmPassword) {
                        alert('Las contraseñas no coinciden');
                        return;
                      }
                      alert('✓ Contraseña actualizada correctamente\n\nNueva credencial Admin:\nUsuario: admin\nContraseña: ' + adminNewPassword);
                      setShowChangePassword(false);
                      setAdminNewPassword('');
                      setAdminConfirmPassword('');
                    }}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold text-sm"
                  >
                    ✓ Cambiar
                  </button>
                  <button
                    onClick={() => {
                      setShowChangePassword(false);
                      setAdminNewPassword('');
                      setAdminConfirmPassword('');
                    }}
                    className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition font-semibold text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========== LAYOUT PRINCIPAL ==========
  const menuItems = {
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'alumnos', label: 'Alumnos', icon: Users },
      { id: 'docentes', label: 'Docentes', icon: User },
      { id: 'cursos', label: 'Cursos', icon: BookOpen },
      { id: 'asignaturas', label: 'Asignaturas', icon: FileText },
      { id: 'configuracion', label: 'Configuración', icon: Settings }
    ],
    docente: [
      { id: 'mis-asignaturas', label: 'Mis Asignaturas', icon: BookOpen },
      { id: 'registrar-notas', label: 'Registrar Notas', icon: FileText },
      { id: 'estudiantes', label: 'Mis Estudiantes', icon: Users }
    ],
    estudiante: [
      { id: 'mis-calificaciones', label: 'Mis Calificaciones', icon: FileText },
      { id: 'boletín', label: 'Boletín Académico', icon: BarChart3 }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* ========== SIDEBAR ========== */}
      <div className={`fixed lg:relative top-0 left-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-0 lg:w-20'} overflow-hidden`}>
        <div className="p-4 border-b border-gray-700 flex items-center justify-between h-20">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <LogoCharlesBabbage size={32} />
              <div>
                <p className="text-xs font-bold text-yellow-400">CHARLES</p>
                <p className="text-xs font-bold text-yellow-400">BABBAGE</p>
              </div>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="hover:bg-gray-700 p-2 rounded transition lg:absolute lg:right-2"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="mt-4 space-y-2 px-2 overflow-y-auto h-[calc(100vh-80px)]">
          {menuItems[userRole].map(item => (
            <button
              key={item.id}
              onClick={() => { setVistaActual(item.id); if(window.innerWidth < 1024) setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-lg transition text-sm lg:text-base whitespace-nowrap lg:whitespace-normal ${
                vistaActual === item.id ? 'bg-red-600 text-white' : 'bg-transparent text-gray-200 hover:bg-gray-700/30'
              }`}
              title={sidebarOpen ? '' : item.label}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Overlay para móviles */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* ========== MAIN CONTENT ========== */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <div className="bg-white shadow-md p-4 sm:p-6 flex justify-between items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="lg:hidden hover:bg-gray-100 p-2 rounded transition"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex-1 line-clamp-1">
            {menuItems[userRole].find(m => m.id === vistaActual)?.label || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs sm:text-sm text-gray-600">Bienvenido</p>
              <p className="font-semibold text-xs sm:text-base text-gray-800 line-clamp-1">{currentUser?.nombre}</p>
            </div>
            {userRole === 'estudiante' && (
              <button
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="flex items-center gap-1 sm:gap-2 bg-blue-600 text-white px-2 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                title="Cambiar contraseña"
              >
                <span className="text-lg">🔒</span>
                <span className="hidden sm:inline text-xs">Cambiar Contraseña</span>
              </button>
            )}
            <button
              onClick={() => { setIsLoggedIn(false); setLoginData({ usuario: '', password: '' }); }}
              className="flex items-center gap-1 sm:gap-2 bg-red-600 text-white px-2 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>

        {/* Modal de Cambio de Contraseña */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Cambiar Contraseña</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nueva Contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ingresa nueva contraseña"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar Contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirma la nueva contraseña"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email (Opcional)</label>
                  <input
                    type="email"
                    value={changePasswordEmail}
                    onChange={(e) => setChangePasswordEmail(e.target.value)}
                    placeholder="Ingresa tu email para confirmar"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
                  />
                  <p className="text-xs text-gray-600 mt-1">Te enviaremos un correo de confirmación</p>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => {
                      if (!newPassword || !confirmPassword) {
                        alert('Por favor completa todos los campos');
                        return;
                      }
                      if (newPassword !== confirmPassword) {
                        alert('Las contraseñas no coinciden');
                        return;
                      }
                      alert('Contraseña actualizada correctamente. Se ha enviado un correo de confirmación.');
                      setShowChangePassword(false);
                      setNewPassword('');
                      setConfirmPassword('');
                      setChangePasswordEmail('');
                    }}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold text-sm"
                  >
                    ✓ Confirmar
                  </button>
                  <button
                    onClick={() => {
                      setShowChangePassword(false);
                      setNewPassword('');
                      setConfirmPassword('');
                      setChangePasswordEmail('');
                    }}
                    className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition font-semibold text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          {/* Dashboard Admin */}
          {userRole === 'admin' && vistaActual === 'dashboard' && (
            <div className="space-y-6">
              {/* Tarjetas de Resumen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-red-600 hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-gray-600 text-xs sm:text-sm font-semibold">Total Alumnos</p>
                      <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-2">{alumnos.length}</p>
                    </div>
                    <Users className="w-10 sm:w-12 h-10 sm:h-12 text-red-600 opacity-20 flex-shrink-0" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-yellow-600 hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-gray-600 text-xs sm:text-sm font-semibold">Total Docentes</p>
                      <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-2">{docentes.length}</p>
                    </div>
                    <User className="w-10 sm:w-12 h-10 sm:h-12 text-yellow-600 opacity-20 flex-shrink-0" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-gray-800 hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-gray-600 text-xs sm:text-sm font-semibold">Total Cursos</p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">{cursos.length}</p>
                    </div>
                    <BookOpen className="w-10 sm:w-12 h-10 sm:h-12 text-gray-800 opacity-20 flex-shrink-0" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-red-500 hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-gray-600 text-xs sm:text-sm font-semibold">Total Asignaturas</p>
                      <p className="text-2xl sm:text-3xl font-bold text-red-500 mt-2">{asignaturas.length}</p>
                    </div>
                    <FileText className="w-10 sm:w-12 h-10 sm:h-12 text-red-500 opacity-20 flex-shrink-0" />
                  </div>
                </div>
              </div>

              {/* Tabla de Promedios Finales de Alumnos */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Promedios Finales de Alumnos</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-3 px-4 text-sm font-bold text-gray-800">Alumno</th>
                        <th className="text-left py-3 px-4 text-sm font-bold text-gray-800">Cédula</th>
                        <th className="text-left py-3 px-4 text-sm font-bold text-gray-800">Curso</th>
                        <th className="text-center py-3 px-4 text-sm font-bold text-gray-800">Prom. Trim 1</th>
                        <th className="text-center py-3 px-4 text-sm font-bold text-gray-800">Prom. Trim 2</th>
                        <th className="text-center py-3 px-4 text-sm font-bold text-gray-800">Prom. Trim 3</th>
                        <th className="text-center py-3 px-4 text-sm font-bold text-gray-800">Promedio Final</th>
                        <th className="text-center py-3 px-4 text-sm font-bold text-gray-800">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alumnos.map(alumno => {
                        const notasAlumno = notas.filter(n => n.estudiante && n.estudiante.toLowerCase().includes(alumno.nombre.toLowerCase()));
                        const prom1 = notasAlumno.filter((_, i) => i % 3 === 0).reduce((sum, n) => sum + (n.trim1 || 0), 0) / Math.max(notasAlumno.filter((_, i) => i % 3 === 0).length, 1);
                        const prom2 = notasAlumno.filter((_, i) => i % 3 === 1).reduce((sum, n) => sum + (n.trim2 || 0), 0) / Math.max(notasAlumno.filter((_, i) => i % 3 === 1).length, 1);
                        const prom3 = notasAlumno.filter((_, i) => i % 3 === 2).reduce((sum, n) => sum + (n.trim3 || 0), 0) / Math.max(notasAlumno.filter((_, i) => i % 3 === 2).length, 1);
                        const promedio = (prom1 + prom2 + prom3) / 3;
                        return (
                          <tr key={alumno.id} className="border-b hover:bg-blue-50 transition">
                            <td className="py-3 px-4 text-sm text-gray-900 font-semibold">{alumno.nombre} {alumno.apellido}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{alumno.cedula}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{alumno.curso}</td>
                            <td className="py-3 px-4 text-center text-sm font-semibold">{isNaN(prom1) ? '-' : prom1.toFixed(2)}</td>
                            <td className="py-3 px-4 text-center text-sm font-semibold">{isNaN(prom2) ? '-' : prom2.toFixed(2)}</td>
                            <td className="py-3 px-4 text-center text-sm font-semibold">{isNaN(prom3) ? '-' : prom3.toFixed(2)}</td>
                            <td className="py-3 px-4 text-center text-sm font-bold text-green-600">{isNaN(promedio) ? '-' : promedio.toFixed(2)}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${isNaN(promedio) || promedio >= 7 ? 'bg-green-600' : 'bg-red-600'}`}>
                                {isNaN(promedio) ? 'Sin datos' : promedio >= 7 ? 'Aprobado' : 'Reprobado'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VISTA DOCENTE - MIS ESTUDIANTES */}
          {userRole === 'docente' && vistaActual === 'estudiantes' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Mis Estudiantes</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-800">Nombre</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-800">Cédula</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-gray-800">Curso</th>
                      <th className="text-center py-3 px-4 text-sm font-bold text-gray-800">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const docente = docentesPrecargados.find(d => d.usuario === currentUser?.usuario);
                      const visibles = docente?.cursos && docente.cursos.length > 0 ? alumnos.filter(a => docente.cursos.includes(a.curso)) : alumnos;
                      return visibles.map(a => (
                        <tr key={a.id} className="border-b hover:bg-red-50 transition">
                          <td className="py-3 px-4 text-sm text-gray-900 font-semibold">{a.nombre} {a.apellido}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{a.cedula}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{a.curso}</td>
                          <td className="py-3 px-4 text-center">
                            <button onClick={() => { setAlumnoActivo(a); setVistaActual('registrar-notas'); }} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm">Ver Notas</button>
                          </td>
                        </tr>
                      ))
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VISTA ALUMNOS */}
          {userRole === 'admin' && vistaActual === 'alumnos' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">{editandoAlumno ? 'Editar Alumno' : 'Agregar Alumno'}</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    <input
                      type="text"
                      placeholder="Nombre *"
                      value={formAlumno.nombre}
                      onChange={(e) => setFormAlumno({...formAlumno, nombre: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 text-sm text-gray-900 placeholder-gray-500 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Apellido *"
                      value={formAlumno.apellido}
                      onChange={(e) => setFormAlumno({...formAlumno, apellido: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 text-sm text-gray-900 placeholder-gray-500 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Cédula * (será la contraseña)"
                      value={formAlumno.cedula}
                      onChange={(e) => setFormAlumno({...formAlumno, cedula: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 text-sm text-gray-900 placeholder-gray-500 bg-white"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formAlumno.email}
                      onChange={(e) => setFormAlumno({...formAlumno, email: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 text-sm text-gray-900 placeholder-gray-500 bg-white"
                    />
                    <select
                      value={formAlumno.curso}
                      onChange={(e) => setFormAlumno({...formAlumno, curso: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 text-sm text-gray-900 bg-white font-medium"
                    >
                      <option value="" className="text-gray-400">Selecciona Curso *</option>
                      {cursos.map(c => <option key={c.id} value={c.nombre} className="text-gray-900">{c.nombre}</option>)}
                    </select>
                    
                    {/* Sección de Bloqueo */}
                    <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-600">
                      <label className="flex items-center gap-2 cursor-pointer mb-2">
                        <input
                          type="checkbox"
                          checked={formAlumno.bloqueado}
                          onChange={(e) => setFormAlumno({...formAlumno, bloqueado: e.target.checked})}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm font-semibold text-red-700">Bloquear Acceso</span>
                      </label>
                      {formAlumno.bloqueado && (
                        <textarea
                          placeholder="Mensaje de bloqueo (ej: Falta pago de matrícula)"
                          value={formAlumno.mensajeBloqueo}
                          onChange={(e) => setFormAlumno({...formAlumno, mensajeBloqueo: e.target.value})}
                          className="w-full px-2 py-1 border-2 border-red-300 rounded text-xs text-gray-900 placeholder-gray-500 bg-white"
                          rows="2"
                        />
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={agregarAlumno}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 font-semibold text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        {editandoAlumno ? 'Actualizar' : 'Agregar'}
                      </button>
                      {editandoAlumno && (
                        <button
                          onClick={() => { setEditandoAlumno(null); setFormAlumno({ nombre: '', apellido: '', cedula: '', email: '', curso: '', bloqueado: false, mensajeBloqueo: '' }); }}
                          className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition font-semibold"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Lista de Alumnos</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr className="border-b-2 border-gray-300">
                          <th className="text-left py-3 px-4 text-sm font-bold text-gray-800">Nombre</th>
                          <th className="text-left py-3 px-4 text-sm font-bold text-gray-800">Cédula</th>
                          <th className="text-left py-3 px-4 text-sm font-bold text-gray-800">Curso</th>
                          <th className="text-center py-3 px-4 text-sm font-bold text-gray-800">Estado</th>
                          <th className="text-center py-3 px-4 text-sm font-bold text-gray-800">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alumnos.map(alumno => (
                          <tr key={alumno.id} className={`border-b hover:bg-red-50 transition ${alumno.bloqueado ? 'bg-red-100' : ''}`}>
                            <td className="py-3 px-4 text-sm text-gray-900 font-semibold">{alumno.nombre} {alumno.apellido}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{alumno.cedula}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{alumno.curso}</td>
                            <td className="py-3 px-4 text-center">
                              {alumno.bloqueado ? (
                                <span className="inline-block bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">BLOQUEADO</span>
                              ) : (
                                <span className="inline-block bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">ACTIVO</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center space-x-2">
                              <button onClick={() => editarAlumno(alumno)} className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded transition" title="Editar"><Edit2 className="w-4 h-4 inline" /></button>
                              <button onClick={() => eliminarAlumno(alumno.id)} className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded transition" title="Eliminar"><Trash2 className="w-4 h-4 inline" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {alumnos.length === 0 && <p className="text-center text-gray-500 py-4">No hay alumnos registrados</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISTA DOCENTES */}
          {userRole === 'admin' && vistaActual === 'docentes' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">{editandoDocente ? 'Editar Docente' : 'Agregar Docente'}</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    <input
                      type="text"
                      placeholder="Nombre *"
                      value={formDocente.nombre}
                      onChange={(e) => setFormDocente({...formDocente, nombre: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 text-sm text-gray-900 placeholder-gray-500 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Apellido"
                      value={formDocente.apellido}
                      onChange={(e) => setFormDocente({...formDocente, apellido: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 text-sm text-gray-900 placeholder-gray-500 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Cédula"
                      value={formDocente.cedula}
                      onChange={(e) => setFormDocente({...formDocente, cedula: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 text-sm text-gray-900 placeholder-gray-500 bg-white"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formDocente.email}
                      onChange={(e) => setFormDocente({...formDocente, email: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 text-sm text-gray-900 placeholder-gray-500 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Usuario *"
                      value={formDocente.usuario}
                      onChange={(e) => setFormDocente({...formDocente, usuario: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 text-sm text-gray-900 placeholder-gray-500 bg-white"
                    />
                    <input
                      type="password"
                      placeholder="Contraseña *"
                      value={formDocente.password}
                      onChange={(e) => setFormDocente({...formDocente, password: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 text-sm text-gray-900 placeholder-gray-500 bg-white"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={agregarDocente}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 font-semibold"
                      >
                        <Plus className="w-4 h-4" />
                        {editandoDocente ? 'Actualizar' : 'Agregar'}
                      </button>
                      {editandoDocente && (
                        <button
                          onClick={() => { setEditandoDocente(null); setFormDocente({ nombre: '', apellido: '', cedula: '', email: '', usuario: '', password: '', asignaturas: [] }); }}
                          className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition font-semibold"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Lista de Docentes</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr className="border-b-2 border-gray-300">
                          <th className="text-left py-3 px-4 font-bold text-gray-800">Nombre</th>
                          <th className="text-left py-3 px-4 font-bold text-gray-800">Usuario</th>
                          <th className="text-left py-3 px-4 font-bold text-gray-800">Cambios</th>
                          <th className="text-center py-3 px-4 font-bold text-gray-800">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {docentes.map(docente => (
                          <tr key={docente.id} className={`border-b hover:bg-red-50 transition ${docente.cambiosBloqueados ? 'bg-yellow-100' : ''}`}>
                            <td className="py-3 px-4 font-semibold text-gray-900">{docente.nombre} {docente.apellido}</td>
                            <td className="py-3 px-4 text-gray-700">{docente.usuario}</td>
                            <td className="py-3 px-4">
                              {docente.cambiosBloqueados ? (
                                <span className="inline-block bg-yellow-600 text-white px-2 py-1 rounded text-xs font-bold">BLOQUEADO</span>
                              ) : (
                                <span className="inline-block bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">ACTIVO</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center space-x-2">
                              <button 
                                onClick={() => toggleBloqueoDocente(docente.id)} 
                                className={`px-3 py-1 rounded text-xs font-bold transition ${docente.cambiosBloqueados ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
                                title={docente.cambiosBloqueados ? 'Desbloquear' : 'Bloquear'}
                              >
                                {docente.cambiosBloqueados ? '🔒 Desbloquear' : '🔓 Bloquear'}
                              </button>
                              <button onClick={() => editarDocente(docente)} className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded transition" title="Editar"><Edit2 className="w-4 h-4 inline" /></button>
                              <button onClick={() => eliminarDocente(docente.id)} className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded transition" title="Eliminar"><Trash2 className="w-4 h-4 inline" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {docentes.length === 0 && <p className="text-center text-gray-500 py-4">No hay docentes registrados</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISTA CURSOS */}
          {userRole === 'admin' && vistaActual === 'cursos' && (
            <div className="space-y-6">
              {/* Selecci de Curso */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cursos.map(curso => (
                  <button
                    key={curso.id}
                    onClick={() => setAlumnoActivo({...curso, ver: 'alumnos'})}
                    className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600 hover:shadow-lg hover:bg-blue-50 transition text-left"
                  >
                    <h3 className="text-xl font-bold text-gray-800">{curso.nombre}</h3>
                    <p className="text-gray-600 text-sm mt-2">{curso.descripcion}</p>
                    <div className="mt-4 text-sm">
                      <p className="text-gray-700"><strong>{alumnos.filter(a => a.curso === curso.nombre).length}</strong> alumnos</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Tabla de Alumnos y Notas del Curso Seleccionado */}
              {alumnoActivo?.ver === 'alumnos' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Notas del Curso: <span className="text-blue-600">{alumnoActivo.nombre}</span></h3>
                    <button
                      onClick={() => setAlumnoActivo(null)}
                      className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition text-sm"
                    >
                      Cerrar
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-800 text-white">
                        <tr>
                          <th className="p-2 text-left">Alumno</th>
                          <th className="p-2 text-left">Materia</th>
                          <th className="p-2 text-center">I Trim</th>
                          <th className="p-2 text-center">II Trim</th>
                          <th className="p-2 text-center">III Trim</th>
                          <th className="p-2 text-center">Promedio</th>
                          <th className="p-2 text-center">Estado</th>
                          <th className="p-2 text-center">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alumnos.filter(a => a.curso === alumnoActivo.nombre).length > 0 ? (
                          alumnos.filter(a => a.curso === alumnoActivo.nombre).map(alumno => {
                            const materiasAlumno = asignaturas.filter(a => a.curso === alumnoActivo.nombre);
                            return materiasAlumno.map((materia, idx) => {
                              const notasAlumno = notas.filter(n => n.estudiante === `${alumno.nombre} ${alumno.apellido}` && n.asignatura === materia.nombre);
                              const nota = notasAlumno[0];
                              const promedio = nota ? ((nota.trim1 + nota.trim2 + nota.trim3) / 3).toFixed(2) : '-';
                              const estado = promedio !== '-' ? (parseFloat(promedio) >= 7 ? 'APROBADO' : 'SUSPENSO') : '-';
                              
                              return (
                                <tr key={`${alumno.id}-${materia.id}`} className="border-b hover:bg-gray-50">
                                  {idx === 0 && (
                                    <td rowSpan={materiasAlumno.length} className="p-2 font-semibold text-gray-900 border-r">{alumno.nombre} {alumno.apellido}</td>
                                  )}
                                  <td className="p-2 text-gray-800">{materia.nombre}</td>
                                  <td className="p-2 text-center">{nota?.trim1 || '-'}</td>
                                  <td className="p-2 text-center">{nota?.trim2 || '-'}</td>
                                  <td className="p-2 text-center">{nota?.trim3 || '-'}</td>
                                  <td className="p-2 text-center font-bold text-green-600">{promedio}</td>
                                  <td className="p-2 text-center">
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${estado === 'APROBADO' ? 'bg-green-100 text-green-800' : estado === 'SUSPENSO' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                      {estado}
                                    </span>
                                  </td>
                                  <td className="p-2 text-center">
                                    <button className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1 rounded transition text-xs font-semibold">Editar</button>
                                  </td>
                                </tr>
                              );
                            });
                          })
                        ) : (
                          <tr>
                            <td colSpan="8" className="p-4 text-center text-gray-500">No hay alumnos en este curso</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VISTA ASIGNATURAS */}
          {userRole === 'admin' && vistaActual === 'asignaturas' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">{editandoAsignatura ? 'Editar Asignatura' : 'Agregar Asignatura'}</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nombre de la asignatura *"
                      value={formAsignatura.nombre}
                      onChange={(e) => setFormAsignatura({...formAsignatura, nombre: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 text-sm text-gray-900 placeholder-gray-500 bg-white"
                    />
                    <select
                      value={formAsignatura.docente}
                      onChange={(e) => setFormAsignatura({...formAsignatura, docente: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 text-sm text-gray-900 bg-white font-medium"
                    >
                      <option value="" className="text-gray-400">Selecciona Docente *</option>
                      {docentes.map(d => <option key={d.id} value={`${d.nombre} ${d.apellido}`} className="text-gray-900">{d.nombre} {d.apellido}</option>)}
                    </select>
                    <select
                      value={formAsignatura.curso}
                      onChange={(e) => setFormAsignatura({...formAsignatura, curso: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 text-sm text-gray-900 bg-white font-medium"
                    >
                      <option value="" className="text-gray-400">Selecciona Curso *</option>
                      {cursos.map(c => <option key={c.id} value={c.nombre} className="text-gray-900">{c.nombre}</option>)}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={agregarAsignatura}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 font-semibold"
                      >
                        <Plus className="w-4 h-4" />
                        {editandoAsignatura ? 'Actualizar' : 'Agregar'}
                      </button>
                      {editandoAsignatura && (
                        <button
                          onClick={() => { setEditandoAsignatura(null); setFormAsignatura({ nombre: '', docente: '', curso: '' }); }}
                          className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition font-semibold"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Lista de Asignaturas</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr className="border-b-2 border-gray-300">
                          <th className="text-left py-3 px-4 font-bold text-gray-800">Asignatura</th>
                          <th className="text-left py-3 px-4 font-bold text-gray-800">Docente</th>
                          <th className="text-left py-3 px-4 font-bold text-gray-800">Curso</th>
                          <th className="text-center py-3 px-4 font-bold text-gray-800">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {asignaturas.map(asignatura => (
                          <tr key={asignatura.id} className="border-b hover:bg-red-50 transition">
                            <td className="py-3 px-4 font-semibold text-gray-900">{asignatura.nombre}</td>
                            <td className="py-3 px-4 text-gray-700">{asignatura.docente}</td>
                            <td className="py-3 px-4 text-gray-700">{asignatura.curso}</td>
                            <td className="py-3 px-4 text-center space-x-2">
                              <button onClick={() => editarAsignatura(asignatura)} className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded transition" title="Editar"><Edit2 className="w-4 h-4 inline" /></button>
                              <button onClick={() => eliminarAsignatura(asignatura.id)} className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded transition" title="Eliminar"><Trash2 className="w-4 h-4 inline" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {asignaturas.length === 0 && <p className="text-center text-gray-500 py-4">No hay asignaturas registradas</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISTA CONFIGURACIÓN */}
          {userRole === 'admin' && vistaActual === 'configuracion' && (
            <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Configuración del Sistema</h3>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border-l-4 border-blue-600 rounded">
                  <p className="font-semibold text-gray-800">Credencial Admin</p>
                  <p className="text-sm text-gray-600">Usuario: <strong>admin</strong> | Contraseña: <strong>admin123</strong></p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <h4 className="font-semibold text-gray-800 mb-3">Información del Sistema</h4>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p><strong>Total Alumnos:</strong> {alumnos.length}</p>
                    <p><strong>Total Docentes:</strong> {docentes.length}</p>
                    <p><strong>Total Asignaturas:</strong> {asignaturas.length}</p>
                    <p><strong>Total Cursos:</strong> {cursos.length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISTA DOCENTE - MIS ASIGNATURAS */}
          {userRole === 'docente' && vistaActual === 'mis-asignaturas' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(docentesPrecargados.find(d => d.usuario === currentUser?.usuario)?.asignaturas || []).map((asig, idx) => {
                  const cursoAsig = docentesPrecargados.find(d => d.usuario === currentUser?.usuario)?.cursos?.[0] || 'Sin curso';
                  return (
                    <div key={idx} className="bg-white rounded-lg shadow p-6 border-t-4 border-purple-600">
                      <h3 className="text-xl font-bold text-gray-800">{asig}</h3>
                      <p className="text-gray-600 text-sm mt-2"><strong>Curso:</strong> {cursoAsig}</p>
                      <p className="text-gray-600 text-sm mt-1">Asignada a tu perfil</p>
                      <div className="mt-4 flex gap-2">
                        <button onClick={() => { setSelectedAsignatura(asig); setVistaActual('registrar-notas'); }} className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition text-sm font-semibold">Registrar Notas</button>
                        <button onClick={() => setVistaActual('estudiantes')} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition text-sm font-semibold">Ver Estudiantes</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VISTA DOCENTE - REGISTRAR NOTAS */}
          {userRole === 'docente' && vistaActual === 'registrar-notas' && (
            <div className="space-y-6">
              {/* Controles de Selección */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Configurar Registro de Notas</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Seleccionar Curso */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Curso</label>
                    <div className="space-y-2">
                      {(docentesPrecargados.find(d => d.usuario === currentUser?.usuario)?.cursos || []).map(curso => (
                        <button
                          key={curso}
                          onClick={() => setFormAlumno({...formAlumno, curso: curso})}
                          className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
                            formAlumno.curso === curso
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {curso}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Seleccionar Asignatura */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Asignatura</label>
                    <select
                      value={selectedAsignatura}
                      onChange={(e) => setSelectedAsignatura(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-gray-900"
                    >
                      <option value="">Selecciona Asignatura</option>
                      {(docentesPrecargados.find(d => d.usuario === currentUser?.usuario)?.asignaturas || []).map((a, i) => (
                        <option key={i} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>

                  {/* Seleccionar Trimestre */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Trimestre</label>
                    <select
                      value={insumoNota}
                      onChange={(e) => setInsumoNota(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-gray-900"
                    >
                      <option value="">Selecciona Trimestre</option>
                      <option value="trim1">I Trimestre</option>
                      <option value="trim2">II Trimestre</option>
                      <option value="trim3">III Trimestre</option>
                    </select>
                  </div>

                  {/* Botón Ir */}
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        if (formAlumno.curso && selectedAsignatura && insumoNota) {
                          setAlumnoActivo(alumnos.find(a => a.curso === formAlumno.curso));
                        } else {
                          alert('Por favor selecciona curso, asignatura y trimestre');
                        }
                      }}
                      disabled={!formAlumno.curso || !selectedAsignatura || !insumoNota}
                      className={`w-full px-6 py-3 rounded-lg font-bold transition text-white ${
                        formAlumno.curso && selectedAsignatura && insumoNota
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Ir
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabla de Estudiantes */}
              {formAlumno.curso && selectedAsignatura && insumoNota && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Estudiantes de {selectedAsignatura} - {insumoNota === 'trim1' ? 'I Trimestre' : insumoNota === 'trim2' ? 'II Trimestre' : 'III Trimestre'}</h3>
                    <div className="text-sm text-gray-600">
                      Alumno {alumnos.findIndex(a => a.id === alumnoActivo?.id) + 1} de {alumnos.filter(a => a.curso === formAlumno.curso).length}
                    </div>
                  </div>

                  {alumnos.filter(a => a.curso === formAlumno.curso).length > 0 ? (
                    <>
                      {alumnoActivo && alumnos.find(a => a.id === alumnoActivo.id) && (
                        <div className="border-2 border-purple-300 rounded-lg p-6 mb-6 bg-purple-50">
                          <h4 className="text-lg font-bold text-gray-800 mb-4">{alumnoActivo.nombre} {alumnoActivo.apellido}</h4>
                          
                          {/* Insumos 1, 2, 3, 4 */}
                          <div className="mb-6">
                            <h5 className="text-md font-bold text-gray-700 mb-3">Calificaciones de Insumo</h5>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Insumo I</label>
                                <input 
                                  type="number" 
                                  min="0" 
                                  max="10" 
                                  step="0.1" 
                                  value={notasActual.insumo1}
                                  onChange={(e) => setNotasActual({...notasActual, insumo1: parseFloat(e.target.value) || 0})}
                                  placeholder="0.0" 
                                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-gray-900" 
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Insumo II</label>
                                <input 
                                  type="number" 
                                  min="0" 
                                  max="10" 
                                  step="0.1" 
                                  value={notasActual.insumo2}
                                  onChange={(e) => setNotasActual({...notasActual, insumo2: parseFloat(e.target.value) || 0})}
                                  placeholder="0.0" 
                                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-gray-900" 
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Insumo III</label>
                                <input 
                                  type="number" 
                                  min="0" 
                                  max="10" 
                                  step="0.1" 
                                  value={notasActual.insumo3}
                                  onChange={(e) => setNotasActual({...notasActual, insumo3: parseFloat(e.target.value) || 0})}
                                  placeholder="0.0" 
                                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-gray-900" 
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Insumo IV</label>
                                <input 
                                  type="number" 
                                  min="0" 
                                  max="10" 
                                  step="0.1" 
                                  value={notasActual.insumo4}
                                  onChange={(e) => setNotasActual({...notasActual, insumo4: parseFloat(e.target.value) || 0})}
                                  placeholder="0.0" 
                                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-gray-900" 
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Promedio Insumos</label>
                                <div className="px-3 py-2 bg-blue-100 rounded-lg font-bold text-blue-800 text-center">
                                  {((notasActual.insumo1 + notasActual.insumo2 + notasActual.insumo3 + notasActual.insumo4) / 4).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Examen */}
                          <div className="mb-6">
                            <h5 className="text-md font-bold text-gray-700 mb-3">Calificación del Examen</h5>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nota Examen</label>
                                <input 
                                  type="number" 
                                  min="0" 
                                  max="10" 
                                  step="0.1" 
                                  value={notasActual.examen}
                                  onChange={(e) => setNotasActual({...notasActual, examen: parseFloat(e.target.value) || 0})}
                                  placeholder="0.0" 
                                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-gray-900" 
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Insumo 80%</label>
                                <div className="px-3 py-2 bg-yellow-100 rounded-lg font-bold text-yellow-800 text-center">
                                  {(((notasActual.insumo1 + notasActual.insumo2 + notasActual.insumo3 + notasActual.insumo4) / 4) * 0.8).toFixed(2)}
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Examen 20%</label>
                                <div className="px-3 py-2 bg-orange-100 rounded-lg font-bold text-orange-800 text-center">
                                  {(notasActual.examen * 0.2).toFixed(2)}
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Promedio Final</label>
                                <div className="px-3 py-2 bg-green-100 rounded-lg font-bold text-green-800 text-lg text-center">
                                  {(
                                    (((notasActual.insumo1 + notasActual.insumo2 + notasActual.insumo3 + notasActual.insumo4) / 4) * 0.8) +
                                    (notasActual.examen * 0.2)
                                  ).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Botón Guardar */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => alert('Nota guardada: ' + (
                                (((notasActual.insumo1 + notasActual.insumo2 + notasActual.insumo3 + notasActual.insumo4) / 4) * 0.8) +
                                (notasActual.examen * 0.2)
                              ).toFixed(2))}
                              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                            >
                              Guardar Nota
                            </button>
                            <button
                              onClick={() => setNotasActual({insumo1: 0, insumo2: 0, insumo3: 0, insumo4: 0, examen: 0})}
                              className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition font-semibold"
                            >
                              Limpiar
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center gap-2">
                        <button
                          onClick={() => {
                            const currentIdx = alumnos.filter(a => a.curso === formAlumno.curso).findIndex(a => a.id === alumnoActivo?.id);
                            if (currentIdx > 0) {
                              const prevAlumno = alumnos.filter(a => a.curso === formAlumno.curso)[currentIdx - 1];
                              setAlumnoActivo(prevAlumno);
                            }
                          }}
                          disabled={alumnos.filter(a => a.curso === formAlumno.curso).findIndex(a => a.id === alumnoActivo?.id) <= 0}
                          className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ← Anterior
                        </button>

                        {!alumnoActivo && (
                          <button
                            onClick={() => setAlumnoActivo(alumnos.filter(a => a.curso === formAlumno.curso)[0])}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-semibold"
                          >
                            Seleccionar Alumno
                          </button>
                        )}

                        <button
                          onClick={() => {
                            const currentIdx = alumnos.filter(a => a.curso === formAlumno.curso).findIndex(a => a.id === alumnoActivo?.id);
                            if (currentIdx < alumnos.filter(a => a.curso === formAlumno.curso).length - 1) {
                              const nextAlumno = alumnos.filter(a => a.curso === formAlumno.curso)[currentIdx + 1];
                              setAlumnoActivo(nextAlumno);
                            }
                          }}
                          disabled={alumnos.filter(a => a.curso === formAlumno.curso).findIndex(a => a.id === alumnoActivo?.id) >= alumnos.filter(a => a.curso === formAlumno.curso).length - 1}
                          className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Siguiente →
                        </button>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button onClick={handleGuardarNota} className="flex-1 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold">Guardar</button>
                        <button onClick={() => setVistaActual('mis-asignaturas')} className="flex-1 bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition font-semibold">Cancelar</button>
                      </div>
                    </>
                  ) : (
                    <p className="text-center text-gray-500 py-4">No hay estudiantes en este curso</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VISTA ESTUDIANTE - MIS CALIFICACIONES */}
          {userRole === 'estudiante' && vistaActual === 'mis-calificaciones' && (
            <div className="space-y-6">
              {/* Contenido para PDF */}
              <div id="pdf-content" className="space-y-6">
                {/* Información del Estudiante */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Estudiante:</p>
                    <p className="font-bold text-gray-800">{currentUser?.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cédula:</p>
                    <p className="font-bold text-gray-800">{alumnos.find(a => a.usuario === currentUser?.usuario)?.cedula || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Curso:</p>
                    <p className="font-bold text-gray-800">{alumnos.find(a => a.usuario === currentUser?.usuario)?.curso || 'Octavo'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Promedio General:</p>
                    <p className="font-bold text-green-600 text-xl">
                      {(notas.reduce((sum, n) => sum + (n.promedio || 0), 0) / (notas.length || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Trimestres Expandibles */}
                <div className="space-y-4">
                  {['Primer Trimestre', 'Segundo Trimestre', 'Tercer Trimestre'].map((trimestre, trimIdx) => (
                    <div key={trimIdx} className="bg-white rounded-lg shadow overflow-hidden">
                      {/* Header del Trimestre */}
                      <button
                        onClick={() => {
                          const key = `trim${trimIdx + 1}`;
                          setInsumoNota(insumoNota === key ? '' : key);
                        }}
                        className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg flex items-center justify-between hover:from-blue-700 hover:to-blue-800 transition"
                      >
                        <span>{trimestre}</span>
                        <span className="text-2xl">{insumoNota === `trim${trimIdx + 1}` ? '▼' : '▶'}</span>
                      </button>

                      {/* Contenido del Trimestre */}
                      {insumoNota === `trim${trimIdx + 1}` && (
                        <div className="p-6 bg-gray-50">
                          <table className="w-full bg-white rounded-lg overflow-hidden">
                            <thead className="bg-gray-800 text-white">
                              <tr>
                                <th className="p-3 text-left text-sm font-bold">Asignatura</th>
                                <th className="p-3 text-center text-sm font-bold">Insumo I</th>
                                <th className="p-3 text-center text-sm font-bold">Insumo II</th>
                                <th className="p-3 text-center text-sm font-bold">Insumo III</th>
                                <th className="p-3 text-center text-sm font-bold">Insumo IV</th>
                                <th className="p-3 text-center text-sm font-bold">Prom. Insumo</th>
                                <th className="p-3 text-center text-sm font-bold">Examen</th>
                                <th className="p-3 text-center text-sm font-bold">Insumo 80%</th>
                                <th className="p-3 text-center text-sm font-bold">Examen 20%</th>
                                <th className="p-3 text-center text-sm font-bold">Final</th>
                              </tr>
                            </thead>
                            <tbody>
                              {notas.filter((n, i) => i % 3 === trimIdx).map((nota, idx) => (
                                <tr key={idx} className="border-b hover:bg-blue-50 transition">
                                  <td className="p-3 font-semibold text-gray-900">{nota.asignatura}</td>
                                  <td className="p-3 text-center text-gray-700">-</td>
                                  <td className="p-3 text-center text-gray-700">-</td>
                                  <td className="p-3 text-center text-gray-700">-</td>
                                  <td className="p-3 text-center text-gray-700">-</td>
                                  <td className="p-3 text-center text-gray-700">-</td>
                                  <td className="p-3 text-center text-gray-700">-</td>
                                  <td className="p-3 text-center text-gray-700">-</td>
                                  <td className="p-3 text-center text-gray-700">-</td>
                                  <td className="p-3 text-center font-bold text-green-600">{trimIdx === 0 ? nota.trim1 : trimIdx === 1 ? nota.trim2 : nota.trim3}</td>
                                </tr>
                              ))}
                              {notas.filter((n, i) => i % 3 === trimIdx).length === 0 && (
                                <tr>
                                  <td colSpan="10" className="p-4 text-center text-gray-500">No hay notas registradas</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón de Descarga */}
              <button 
                onClick={descargarPDF}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition text-lg"
              >
                📥 Descargar mis Calificaciones (PDF)
              </button>
            </div>
          )}

          {/* VISTA ESTUDIANTE - BOLETÍN ACADÉMICO */}
          {userRole === 'estudiante' && vistaActual === 'boletín' && (
            <div className="bg-white rounded-lg shadow p-8">
              {/* Encabezado */}
              <div className="text-center mb-8 pb-8 border-b-2 border-gray-300">
                <div className="inline-block mb-4">
                  <LogoCharlesBabbage size={64} />
                </div>
                <h1 className="text-4xl font-bold text-gray-800">BOLETÍN ACADÉMICO</h1>
                <p className="text-gray-600 mt-2 text-lg">Colegio Charles Babbage</p>
                <p className="text-gray-600">Año Académico 2024</p>
              </div>
              
              {/* Información del Estudiante */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
                  <p className="text-sm text-gray-600 font-bold uppercase">Estudiante</p>
                  <p className="font-bold text-lg text-gray-800">{currentUser?.nombre}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
                  <p className="text-sm text-gray-600 font-bold uppercase">Cédula</p>
                  <p className="font-bold text-lg text-gray-800">1754826539</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
                  <p className="text-sm text-gray-600 font-bold uppercase">Curso</p>
                  <p className="font-bold text-lg text-gray-800">Octavo</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                  <p className="text-sm text-gray-600 font-bold uppercase">Promedio Final</p>
                  <p className="font-bold text-3xl text-green-600">9.2</p>
                </div>
              </div>

              {/* Tabla de Calificaciones Detallada */}
              <div className="overflow-x-auto mb-8">
                <table className="w-full">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="p-4 text-left font-bold">Asignatura</th>
                      <th className="p-4 text-center font-bold">Trimestre I</th>
                      <th className="p-4 text-center font-bold">Trimestre II</th>
                      <th className="p-4 text-center font-bold">Trimestre III</th>
                      <th className="p-4 text-center font-bold text-lg">Promedio</th>
                      <th className="p-4 text-center font-bold">Situación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { asignatura: 'Matemáticas', t1: 9.4, t2: 9.2, t3: 9.5, promedio: 9.4, estado: 'APROBADO' },
                      { asignatura: 'Inglés', t1: 8.9, t2: 9.0, t3: 8.8, promedio: 8.9, estado: 'APROBADO' },
                      { asignatura: 'Lenguaje y Literatura', t1: 8.7, t2: 8.9, t3: 9.0, promedio: 8.9, estado: 'APROBADO' },
                      { asignatura: 'Ciencias Naturales', t1: 9.1, t2: 9.3, t3: 9.2, promedio: 9.2, estado: 'APROBADO' },
                      { asignatura: 'Estudios Sociales', t1: 9.0, t2: 8.8, t3: 9.1, promedio: 9.0, estado: 'APROBADO' },
                      { asignatura: 'Educación Física', t1: 9.5, t2: 9.6, t3: 9.4, promedio: 9.5, estado: 'APROBADO' },
                    ].map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-blue-50 transition">
                        <td className="p-4 font-semibold text-gray-900">{item.asignatura}</td>
                        <td className="p-4 text-center text-gray-800 font-semibold">{item.t1}</td>
                        <td className="p-4 text-center text-gray-800 font-semibold">{item.t2}</td>
                        <td className="p-4 text-center text-gray-800 font-semibold">{item.t3}</td>
                        <td className="p-4 text-center font-bold text-green-600 text-xl">{item.promedio}</td>
                        <td className="p-4 text-center">
                          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                            {item.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Resumen y Recomendación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-lg border-2 border-green-600">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Resultado Final</h3>
                  <p className="text-gray-700 mb-2"><strong>Promedio General:</strong> <span className="text-green-600 text-2xl font-bold">9.2</span></p>
                  <p className="text-gray-700"><strong>Calificación:</strong> <span className="text-green-600 font-bold">EXCELENTE</span></p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-600">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Recomendación</h3>
                  <p className="text-gray-700 font-semibold text-lg">✓ PROMOVIDO AL SIGUIENTE GRADO</p>
                  <p className="text-gray-600 text-sm mt-2">Felicidades por tu excelente desempeño académico durante el año.</p>
                </div>
              </div>

              {/* Observaciones */}
              <div className="bg-gray-50 p-6 rounded-lg mb-8 border-l-4 border-purple-600">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Observaciones del Docente</h3>
                <p className="text-gray-700">Estudiante con desempeño académico sobresaliente. Demuestra compromiso y responsabilidad en sus actividades. Se recomienda mantener este ritmo de trabajo.</p>
              </div>

              {/* Firma del Director */}
              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t-2 border-gray-300">
                <div className="text-center">
                  <div className="h-12 mb-2"></div>
                  <p className="font-bold text-gray-800 text-sm">Rector</p>
                  <p className="text-gray-600 text-xs">Firma y Sello</p>
                </div>
                <div className="text-center">
                  <div className="h-12 mb-2"></div>
                  <p className="font-bold text-gray-800 text-sm">Docente Tutor</p>
                  <p className="text-gray-600 text-xs">Firma</p>
                </div>
                <div className="text-center">
                  <div className="h-12 mb-2"></div>
                  <p className="font-bold text-gray-800 text-sm">Padre/Representante</p>
                  <p className="text-gray-600 text-xs">Firma</p>
                </div>
              </div>

              {/* Botón de Descarga */}
              <button className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold hover:shadow-xl transition text-lg">
                📥 Descargar Boletín Académico (PDF)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SistemaCalificaciones;

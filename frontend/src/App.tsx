import React, { useState } from 'react';
import { ActiveTab, Student, ActivityItem, CalendarEvent } from './types';
import { INITIAL_STUDENTS, RECENT_ACTIVITIES, CALENDAR_EVENTS } from './data';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import InicialView from './components/InicialView';
import PrimariaView from './components/PrimariaView';
import SecundariaView from './components/SecundariaView';
import EgresadosView from './components/EgresadosView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import { 
  X, BadgeAlert, CheckCircle2, AlertCircle, HelpCircle, 
  Settings2, BookOpen, GraduationCap, School, MapPin, 
  Calendar, Phone, Mail, FileSpreadsheet, Lock 
} from 'lucide-react';

export default function App() {
  // Session authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');

  // Main Datasets
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [activities, setActivities] = useState<ActivityItem[]>(RECENT_ACTIVITIES);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(CALENDAR_EVENTS);

  // Global UI States
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modal Visibility States
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Active Selected Entity States (For editing or detailed viewing)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // School Year Configurations State
  const [schoolYear, setSchoolYear] = useState('2024');
  const [directorName, setDirectorName] = useState('Hna. Ruth María Guedes');
  const [academicPeriod, setAcademicPeriod] = useState('Segundo Bimestre');

  // Interactive Toast message state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Helper to show brief user notifications
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Authentications handlers
  const handleLoginSuccess = (email: string) => {
    setCurrentUserEmail(email);
    setIsLoggedIn(true);
    showToast('Sesión Iniciada con éxito. ¡Bienvenido, Admin!', 'success');
  };

  const handleRegisterSuccess = (email: string) => {
    setCurrentUserEmail(email);
    setIsLoggedIn(true);
    showToast('Cuenta de Administrador creada exitosamente.', 'success');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUserEmail('');
    setSearchQuery('');
    setAuthScreen('login');
    showToast('Has cerrado tu sesión académica de forma segura.', 'info');
  };

  // CRUD Operations on Students
  const handleEnrollStudent = (newStudent: Student) => {
    // Generate code ID
    const randomId = `FE3-${newStudent.level.slice(0,3).toUpperCase()}-${Math.floor(100+Math.random()*900)}`;
    const studentWithId: Student = {
      ...newStudent,
      id: randomId,
    };

    setStudents([studentWithId, ...students]);
    setIsEnrollModalOpen(false);

    // Register active log item
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'inscripcion',
      title: 'Inscripción procesada',
      subtitle: `${studentWithId.fullName} (${studentWithId.level} - ${studentWithId.grade})`,
      time: 'Hace unos instantes',
    };
    setActivities([newAct, ...activities]);
    showToast(`Matrícula exitosa: ${studentWithId.fullName}`, 'success');
  };

  const handleUpdateStudent = (updated: Student) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
    setIsEditModalOpen(false);
    setEditingStudent(null);
    showToast(`Ficha académica actualizada: ${updated.fullName}`, 'success');
  };

  const handleDeleteStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    if (window.confirm(`¿Está seguro que desea desmatricular o eliminar el registro de ${student.fullName}?`)) {
      setStudents(prev => prev.filter(s => s.id !== studentId));
      showToast(`Registro eliminado: ${student.fullName}`, 'info');

      // Add to log activities
      const newAct: ActivityItem = {
        id: `act-${Date.now()}`,
        type: 'alerta',
        title: 'Baja de estudiante',
        subtitle: `${student.fullName} fue removido del sistema.`,
        time: 'Hace un momento',
      };
      setActivities([newAct, ...activities]);
    }
  };

  const triggerExportSimulation = (reportName: string = 'Listado Estudiantes') => {
    showToast(`Generando archivo Excel del reporte '${reportName}'...`, 'info');
    setTimeout(() => {
      // Create mockup element trigger download
      const content = `ID,Estudiante,DNI,Nivel,Grado,Estado\n` + 
        students.map(s => `"${s.id}","${s.fullName}","${s.dni}","${s.level}","${s.grade}","${s.status}"`).join('\n');
      
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `FeYAlegria3_${reportName.replace(/\s+/g, '')}_2024.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`Descarga completada con éxito.`, 'success');
    }, 1200);
  };

  // Modal setup values helper for current screen
  const getDefaultLevelAndGrade = () => {
    if (activeTab === 'inicial-3') return { level: 'Inicial' as const, grade: '3 Años' };
    if (activeTab === 'inicial-4') return { level: 'Inicial' as const, grade: '4 Años' };
    if (activeTab === 'inicial-5') return { level: 'Inicial' as const, grade: '5 Años' };
    if (activeTab === 'primaria') return { level: 'Primaria' as const, grade: '4° Primaria - B' };
    if (activeTab === 'secundaria') return { level: 'Secundaria' as const, grade: '5° - A' };
    if (activeTab === 'egresados') return { level: 'Egresado' as const, grade: 'Egresado' };
    return { level: 'Inicial' as const, grade: '3 Años' };
  };

  // Render view panels dynamically
  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            students={students}
            activities={activities}
            searchQuery={searchQuery}
            onEnrollClick={() => setIsEnrollModalOpen(true)}
            onExportClick={() => triggerExportSimulation('Reporte_General')}
            onCycleClick={() => setIsCycleModalOpen(true)}
            onEditStudent={(st) => {
              setEditingStudent(st);
              setIsEditModalOpen(true);
            }}
            onDeleteStudent={handleDeleteStudent}
            onViewStudent={(st) => {
              setViewingStudent(st);
              setIsViewModalOpen(true);
            }}
          />
        );

      case 'inicial-3':
        return (
          <InicialView 
            students={students}
            ageGroup="3 Años"
            searchQuery={searchQuery}
            calendarEvents={calendarEvents}
            onAddStudent={() => setIsEnrollModalOpen(true)}
            onEditStudent={(st) => {
              setEditingStudent(st);
              setIsEditModalOpen(true);
            }}
            onDeleteStudent={handleDeleteStudent}
            onExportClick={() => triggerExportSimulation('Inicial_3Anos')}
          />
        );

      case 'inicial-4':
        return (
          <InicialView 
            students={students}
            ageGroup="4 Años"
            searchQuery={searchQuery}
            calendarEvents={calendarEvents}
            onAddStudent={() => setIsEnrollModalOpen(true)}
            onEditStudent={(st) => {
              setEditingStudent(st);
              setIsEditModalOpen(true);
            }}
            onDeleteStudent={handleDeleteStudent}
            onExportClick={() => triggerExportSimulation('Inicial_4Anos')}
          />
        );

      case 'inicial-5':
        return (
          <InicialView 
            students={students}
            ageGroup="5 Años"
            searchQuery={searchQuery}
            calendarEvents={calendarEvents}
            onAddStudent={() => setIsEnrollModalOpen(true)}
            onEditStudent={(st) => {
              setEditingStudent(st);
              setIsEditModalOpen(true);
            }}
            onDeleteStudent={handleDeleteStudent}
            onExportClick={() => triggerExportSimulation('Inicial_5Anos')}
          />
        );

      case 'primaria':
        return (
          <PrimariaView 
            students={students}
            searchQuery={searchQuery}
            onAddStudent={() => setIsEnrollModalOpen(true)}
            onEditStudent={(st) => {
              setEditingStudent(st);
              setIsEditModalOpen(true);
            }}
            onDeleteStudent={handleDeleteStudent}
            onCardAction={(procName) => showToast(`Trámite '${procName}' ejecutado mock exitosamente.`, 'success')}
          />
        );

      case 'secundaria':
        return (
          <SecundariaView 
            students={students}
            searchQuery={searchQuery}
            onAddStudent={() => setIsEnrollModalOpen(true)}
            onEditStudent={(st) => {
              setEditingStudent(st);
              setIsEditModalOpen(true);
            }}
            onDeleteStudent={handleDeleteStudent}
            onViewStudent={(st) => {
              setViewingStudent(st);
              setIsViewModalOpen(true);
            }}
            onGenerateReportPDF={() => triggerExportSimulation('Consolidado_Areas_Secundaria')}
          />
        );

      case 'egresados':
        return (
          <EgresadosView 
            students={students}
            searchQuery={searchQuery}
            onAddStudent={() => setIsEnrollModalOpen(true)}
            onEditStudent={(st) => {
              setEditingStudent(st);
              setIsEditModalOpen(true);
            }}
            onDeleteStudent={handleDeleteStudent}
            onContactEmail={(st) => showToast(`Enviando correo formal a red de egresados para: ${st.fullName}`, 'info')}
            onCardAction={(topic) => showToast(`Inscripción al '${topic}' realizada.`, 'success')}
          />
        );

      case 'ayuda':
        return (
          <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-4xl mx-auto space-y-6 font-sans">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <HelpCircle className="text-brand-red" size={24} />
              Manual de Soporte Técnico y Funcional
            </h2>
            
            <div className="space-y-4 text-xs font-semibold text-gray-700 leading-relaxed">
              <p>Este sistema de <strong>Gestión Académica de la Sede Fe y Alegría 3</strong> permite la consulta centralizada de los niveles Inicial, Primaria y Secundaria de forma segura.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-extrabold text-brand-red text-xs mb-2">Matrículas & Fichas</h4>
                  <p className="text-[11px] text-gray-500 font-medium">Use el botón "Agregar Estudiante" para matricular nuevos ingresos. El formulario reconoce de manera inteligente qué nivel está visualizando para prellendar campos de grado.</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-extrabold text-brand-red text-xs mb-2">Exportaciones a Excel/CSV</h4>
                  <p className="text-[11px] text-gray-500 font-medium font-serif">Al dar click en imprimir o descargar consolidados, se genera al vuelo un archivo de descarga real .CSV con cabecera legible por Microsoft Excel.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-[11px] text-gray-400">Para coordinar actualizaciones técnicas de base de datos o reportar bajas masivas, por favor contactar al especialista de soporte:</p>
                <div className="mt-2.5 space-y-1 text-[11px] font-mono text-gray-500 flex flex-col sm:flex-row gap-4">
                  <span className="flex items-center gap-1.5"><Phone size={12} /> (01) 480-1283 Sede Central</span>
                  <span className="flex items-center gap-1.5"><Mail size={12} /> coordinacion@feyalegria3.edu.pe</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Panel en mantenimiento</div>;
    }
  };

  // Handle Login and screen redirect transitions
  if (!isLoggedIn) {
    if (authScreen === 'login') {
      return (
        <LoginView 
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegister={() => setAuthScreen('register')}
        />
      );
    } else {
      return (
        <RegisterView 
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateToLogin={() => setAuthScreen('login')}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex font-sans antialiased">
      
      {/* Toast Alert pop-up system */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-bounce bg-white border border-gray-100 rounded-xl max-w-sm shadow-xl p-4 flex gap-3 ring-1 ring-black/5">
          {toast.type === 'success' ? (
            <span className="text-green-600 shrink-0"><CheckCircle2 size={18} /></span>
          ) : (
            <span className="text-amber-500 shrink-0"><AlertCircle size={18} /></span>
          )}
          <div>
            <p className="text-xs font-bold text-gray-900 leading-tight">{toast.message}</p>
            <p className="text-[9px] text-gray-400 mt-1">Sede Fe y Alegría 3 - Verificado</p>
          </div>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 select-none ml-auto shrink-0 self-start text-xs font-bold">✕</button>
        </div>
      )}

      {/* Sidebar navigation panel */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={(t) => {
          setActiveTab(t);
          setSearchQuery('');
        }}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        userEmail={currentUserEmail}
        onLogout={handleLogout}
      />

      {/* Main Content Area Container */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        
        {/* Fixed Header */}
        <Header 
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onLogout={handleLogout}
          userEmail={currentUserEmail}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenNotifications={() => showToast('Abriendo registro completo de alertas...', 'info')}
        />

        {/* Dynamic Inner Body */}
        <main className="flex-1 p-6 md:p-8 pt-24 pb-12 overflow-x-hidden">
          {renderMainContent()}
        </main>
      </div>

      {/* ================= MODAL LAYERS AREA ================= */}

      {/* 1. Agregar Estudiante (Matrícula Nueva) Modal */}
      {isEnrollModalOpen && (
        <EnrollModal 
          onClose={() => setIsEnrollModalOpen(false)}
          onSubmit={handleEnrollStudent}
          defaultValues={getDefaultLevelAndGrade()}
        />
      )}

      {/* 2. Editar Estudiante Modal */}
      {isEditModalOpen && editingStudent && (
        <EditModal 
          student={editingStudent}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingStudent(null);
          }}
          onSubmit={handleUpdateStudent}
        />
      )}

      {/* 3. Ver Ficha de Estudiante Modal */}
      {isViewModalOpen && viewingStudent && (
        <ViewModal 
          student={viewingStudent}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewingStudent(null);
          }}
        />
      )}

      {/* 4. Configurar Ciclo Lectivo Modal */}
      {isCycleModalOpen && (
        <CycleModal 
          schoolYear={schoolYear}
          setSchoolYear={setSchoolYear}
          directorName={directorName}
          setDirectorName={setDirectorName}
          academicPeriod={academicPeriod}
          setAcademicPeriod={setAcademicPeriod}
          onClose={() => setIsCycleModalOpen(false)}
          onSave={() => {
            setIsCycleModalOpen(false);
            showToast('Configuraciones escolares registradas para el año escolar.', 'success');
          }}
        />
      )}

      {/* 5. Ajustes del Sistema Académico General Modal */}
      {isSettingsModalOpen && (
        <SettingsModal 
          onClose={() => setIsSettingsModalOpen(false)}
          schoolYear={schoolYear}
          directorName={directorName}
          academicPeriod={academicPeriod}
        />
      )}
    </div>
  );
}

// ---------------- SUB-COMPONENTS: MODALS ----------------

// Enroll student modal dialog form
function EnrollModal({ 
  onClose, 
  onSubmit, 
  defaultValues 
}: { 
  onClose: () => void; 
  onSubmit: (student: Student) => void;
  defaultValues: { level: 'Inicial' | 'Primaria' | 'Secundaria' | 'Egresado'; grade: string }
}) {
  const [fullName, setFullName] = useState('');
  const [dni, setDni] = useState('');
  const [level, setLevel] = useState<Student['level']>(defaultValues.level);
  const [grade, setGrade] = useState(defaultValues.grade);
  const [status, setStatus] = useState<'ACTIVO' | 'PENDIENTE'>('ACTIVO');
  const [career, setCareer] = useState('Computación e Informática');
  const [email, setEmail] = useState('');
  const [yearGrad, setYearGrad] = useState(2023);

  // Form submit trigger
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !dni.trim()) {
      alert('Por favor, ingrese el nombre del escolar y su DNI.');
      return;
    }
    if (dni.length !== 8) {
      alert('El DNI escolar debe tener exactamente 8 cifras numéricas.');
      return;
    }

    const payload: Student = {
      id: '', // Generated in parent App React loop
      fullName,
      dni,
      level,
      grade: level === 'Egresado' ? 'Egresado' : grade,
      status: level === 'Egresado' ? 'FINALIZADO' : status,
      technicalCareer: (level === 'Secundaria' || level === 'Egresado') ? career : undefined,
      email: level === 'Egresado' ? email : undefined,
      gradYear: level === 'Egresado' ? yearGrad : undefined,
    };
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-md w-full p-6 animate-zoom-in space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="font-extrabold text-sm text-gray-900">Inscripción / Matrícula Nueva</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-50 rounded-lg text-gray-400 select-none">✕</button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-semibold">
          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest block">Nombre Completo del Estudiante</label>
            <input 
              type="text" 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none"
              placeholder="Ej. Cáceres Romero, David Alejandro"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest block">DNI (8 dígitos)</label>
              <input 
                type="text" 
                maxLength={8}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none font-mono"
                placeholder="74859102"
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest block">Nivel Educativo</label>
              <select 
                value={level} 
                onChange={(e) => {
                  const val = e.target.value as Student['level'];
                  setLevel(val);
                  if (val === 'Inicial') setGrade('3 Años');
                  else if (val === 'Primaria') setGrade('4° Primaria - B');
                  else if (val === 'Secundaria') setGrade('5° - A');
                  else setGrade('Egresado');
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none"
              >
                <option value="Inicial">Inicial</option>
                <option value="Primaria">Primaria</option>
                <option value="Secundaria">Secundaria</option>
                <option value="Egresado">Egresado</option>
              </select>
            </div>
          </div>

          {level !== 'Egresado' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest block">Grado / Sección</label>
                {level === 'Inicial' ? (
                  <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 outline-none">
                    <option>3 Años</option>
                    <option>4 Años</option>
                    <option>5 Años</option>
                  </select>
                ) : level === 'Primaria' ? (
                  <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 outline-none">
                    <option>3° Primaria - A</option>
                    <option>4° Primaria - B</option>
                    <option>5° Primaria - C</option>
                    <option>6° Primaria - A</option>
                  </select>
                ) : (
                  <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 outline-none">
                    <option>3° - C</option>
                    <option>4° - B</option>
                    <option>5° - A</option>
                    <option>5° - B</option>
                  </select>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest block">Estado Matrícula</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none"
                >
                  <option value="ACTIVO">ACTIVO (Regular)</option>
                  <option value="PENDIENTE">PENDIENTE (Documentación)</option>
                </select>
              </div>
            </div>
          )}

          {/* Conditional field for technical vocational specialties */}
          {(level === 'Secundaria' || level === 'Egresado') && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest block">Carrera / Especialidad Técnica</label>
              <select 
                value={career} 
                onChange={(e) => setCareer(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 outline-none border focus:border-brand-red"
              >
                <option>Computación e Informática</option>
                <option>Contabilidad</option>
                <option>Electrónica Industrial</option>
                <option>Gastronomía</option>
                <option>Mecánica Automotriz</option>
              </select>
            </div>
          )}

          {/* Conditional fields for Egresados */}
          {level === 'Egresado' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest block">Año Graduación</label>
                <input 
                  type="number" 
                  min={2000} 
                  max={2024}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 outline-none"
                  value={yearGrad} 
                  onChange={(e) => setYearGrad(parseInt(e.target.value))} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-widest block">Correo de Contacto</label>
                <input 
                  type="email" 
                  placeholder="exalumno@email.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 outline-none"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose}
              className="bg-gray-100 font-bold text-gray-700 py-2 px-4 rounded-lg select-none hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="bg-brand-red hover:bg-brand-red-hover text-white font-bold py-2 px-4 rounded-lg shadow-sm"
            >
              Matricular Estudiante
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit student details modal form
function EditModal({ 
  student, 
  onClose, 
  onSubmit 
}: { 
  student: Student; 
  onClose: () => void; 
  onSubmit: (student: Student) => void 
}) {
  const [fullName, setFullName] = useState(student.fullName);
  const [dni, setDni] = useState(student.dni);
  const [grade, setGrade] = useState(student.grade);
  const [status, setStatus] = useState(student.status);
  const [career, setCareer] = useState(student.technicalCareer || 'Computación e Informática');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dni.length !== 8) {
      alert('DNI de escolar debe poseer 8 dígitos exactos.');
      return;
    }

    const payload: Student = {
      ...student,
      fullName,
      dni,
      grade,
      status,
      technicalCareer: (student.level === 'Secundaria' || student.level === 'Egresado') ? career : undefined,
    };
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-md w-full p-6 space-y-4 font-sans text-xs">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="font-extrabold text-sm text-gray-900">Editar Expediente Académico</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-50 rounded-lg text-gray-400 select-none">✕</button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4 font-semibold">
          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest block">Nombre Completo del Escolar</label>
            <input 
              type="text" 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:border-brand-red"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest block">DNI</label>
              <input 
                type="text" 
                maxLength={8}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:border-brand-red font-mono"
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest block">Estado Matrícula</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 outline-none"
              >
                <option value="ACTIVO">ACTIVO</option>
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="FINALIZADO">FINALIZADO</option>
              </select>
            </div>
          </div>

          {student.level !== 'Egresado' && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest block">Asignación Grado / Aula</label>
              <input 
                type="text" 
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 outline-none"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
            </div>
          )}

          {/* Conditional field for technical vocational specialties */}
          {(student.level === 'Secundaria' || student.level === 'Egresado') && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest block">Carrera / Especialidad Técnica</label>
              <select 
                value={career} 
                onChange={(e) => setCareer(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 outline-none"
              >
                <option>Computación e Informática</option>
                <option>Contabilidad</option>
                <option>Electrónica Industrial</option>
                <option>Gastronomía</option>
                <option>Mecánica Automotriz</option>
                <option>Computación</option>
                <option>Electrónica</option>
                <option>Diseño Ind.</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose}
              className="bg-gray-100 font-bold text-gray-700 py-2 px-4 rounded-lg select-none hover:bg-gray-200"
            >
              Descartar
            </button>
            <button 
              type="submit"
              className="bg-brand-red hover:bg-brand-red-hover text-white font-bold py-2 px-4 rounded-lg shadow-sm"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// View Student full profile datasheet card modal
function ViewModal({ student, onClose }: { student: Student; onClose: () => void }) {
  const initials = student.fullName.split(',').map(part => part.trim()[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-3xl border border-gray-200 max-w-sm w-full p-6 space-y-5 animate-zoom-in font-sans">
        <div className="flex justify-between items-center border-b border-gray-50 pb-3">
          <span className="text-[10px] font-black uppercase text-brand-red tracking-widest bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
            FE Y ALEGRÍA Sede 3
          </span>
          <button onClick={onClose} className="p-1 hover:bg-gray-50 rounded-full text-gray-400 font-bold">✕</button>
        </div>

        <div className="flex flex-col items-center text-center space-y-3">
          {/* Mock photo with initials */}
          <div className="w-16 h-16 rounded-full bg-brand-red text-white flex items-center justify-center font-black text-xl shadow-xs">
            {initials || "FE"}
          </div>
          <div>
            <h4 className="font-extrabold text-base text-gray-900 leading-snug">{student.fullName}</h4>
            <span className="text-[10px] text-gray-400 font-mono tracking-wider">Código Matrícula: #{student.id}</span>
          </div>
        </div>

        {/* Structured Datasheet Grid */}
        <div className="bg-gray-50 p-4 rounded-xl space-y-3.5 text-xs font-semibold text-gray-700">
          <div className="flex justify-between border-b border-gray-200/50 pb-2">
            <span className="text-gray-400 font-semibold">Identificación DNI:</span>
            <span className="text-gray-900 font-mono font-bold">{student.dni}</span>
          </div>

          <div className="flex justify-between border-b border-gray-200/50 pb-2">
            <span className="text-gray-400 font-semibold">Nivel Educativo:</span>
            <span className="text-gray-900">{student.level}</span>
          </div>

          <div className="flex justify-between border-b border-gray-200/50 pb-2">
            <span className="text-gray-400 font-semibold">Aula / Sección:</span>
            <span className="bg-white px-2 py-0.5 rounded border border-gray-200/60 font-bold text-gray-900 text-[10px]">{student.grade}</span>
          </div>

          {(student.level === 'Secundaria' || student.level === 'Egresado') && (
            <div className="flex justify-between border-b border-gray-200/50 pb-2">
              <span className="text-gray-400 font-semibold">Carrera Técnica:</span>
              <span className="text-blue-700 font-bold text-right truncate max-w-[180px]">{student.technicalCareer || "Computación"}</span>
            </div>
          )}

          <div className="flex justify-between pb-1">
            <span className="text-gray-400 font-semibold">Estado de Matrícula:</span>
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[9px] font-black border border-green-100">
              {student.status}
            </span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-brand-red hover:bg-brand-red-hover text-white py-2 px-4 rounded-lg text-xs font-bold shadow-xs transition-colors"
        >
          Aceptar y Cerrar
        </button>
      </div>
    </div>
  );
}

// Configurar Ciclo Lectivo Modal Form
function CycleModal({
  schoolYear,
  setSchoolYear,
  directorName,
  setDirectorName,
  academicPeriod,
  setAcademicPeriod,
  onClose,
  onSave,
}: {
  schoolYear: string;
  setSchoolYear: (yr: string) => void;
  directorName: string;
  setDirectorName: (dir: string) => void;
  academicPeriod: string;
  setAcademicPeriod: (per: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-100 max-w-md w-full font-sans text-xs space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
            <Settings2 size={16} className="text-brand-red" />
            Configurar Ciclo Escolar Activo
          </h3>
          <button onClick={onClose} className="text-gray-400 text-sm">✕</button>
        </div>

        <div className="space-y-4 font-semibold">
          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider block">Año Escolar Lectivo</label>
            <select 
              value={schoolYear} 
              onChange={(e) => setSchoolYear(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3"
            >
              <option>2024</option>
              <option>2025</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider block">Bimestre / periodo Activo</label>
            <select 
              value={academicPeriod} 
              onChange={(e) => setAcademicPeriod(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3"
            >
              <option>Primer Bimestre</option>
              <option>Segundo Bimestre</option>
              <option>Tercer Bimestre</option>
              <option>Cuarto Bimestre</option>
              <option>Vacacional / Recuperación</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider block">Director Académico Firmante</label>
            <input 
              type="text" 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-brand-red"
              value={directorName}
              onChange={(e) => setDirectorName(e.target.value)}
            />
          </div>

          <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-[10px] text-brand-red leading-relaxed">
            <p><strong>Nota:</strong> Modificar estas directivas cambia automáticamente la cabecera académica de exportación en boletas impresas al instante.</p>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
            <button onClick={onClose} className="bg-gray-100 font-bold text-gray-700 py-2 px-4 rounded-lg">Descartar</button>
            <button onClick={onSave} className="bg-brand-red hover:bg-brand-red-hover text-white font-bold py-2 px-4 rounded-lg shadow-sm">
              Confirmar y Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// General System diagnostics Settings Modal
function SettingsModal({ 
  onClose,
  schoolYear,
  directorName,
  academicPeriod
}: { 
  onClose: () => void;
  schoolYear: string;
  directorName: string;
  academicPeriod: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full font-sans text-xs space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="font-extrabold text-sm text-gray-900">Ajustes Generales del Sistema</h3>
          <button onClick={onClose} className="text-gray-400">✕</button>
        </div>

        <div className="space-y-3 font-semibold text-gray-600">
          <div className="flex justify-between pb-1 text-[11px] border-b border-gray-50">
            <span>Sede Registrada:</span>
            <span className="font-bold text-gray-900">Fe y Alegría N° 3</span>
          </div>
          <div className="flex justify-between pb-1 text-[11px] border-b border-gray-50">
            <span>Año Lectivo:</span>
            <span className="font-bold text-gray-900">{schoolYear}</span>
          </div>
          <div className="flex justify-between pb-1 text-[11px] border-b border-gray-50">
            <span>Periodo Escolar:</span>
            <span className="font-bold text-gray-900">{academicPeriod}</span>
          </div>
          <div className="flex justify-between pb-1 text-[11px] border-b border-gray-50">
            <span>Director Coordinador:</span>
            <span className="font-bold text-gray-900">{directorName}</span>
          </div>
          <div className="flex justify-between pb-1 text-[11px] border-b border-gray-50">
            <span>Licencia Académica:</span>
            <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100 text-[9px]">Vigente 2024</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-brand-red hover:bg-brand-red-hover text-white py-2 px-4 rounded-lg font-bold shadow-xs mt-3"
        >
          Cerrar Configuración
        </button>
      </div>
    </div>
  );
}

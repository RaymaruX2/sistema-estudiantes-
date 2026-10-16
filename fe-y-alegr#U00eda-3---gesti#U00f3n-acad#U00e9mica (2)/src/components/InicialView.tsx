import React from 'react';
import { Student, CalendarEvent } from '../types';
import { Users, CheckCircle, Clock, CalendarDays, Calendar, Download, Trash2, Edit3, UserPlus, Filter } from 'lucide-react';

interface InicialViewProps {
  students: Student[];
  ageGroup: '3 Años' | '4 Años' | '5 Años';
  searchQuery: string;
  calendarEvents: CalendarEvent[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onExportClick: () => void;
}

export default function InicialView({
  students,
  ageGroup,
  searchQuery,
  calendarEvents,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onExportClick,
}: InicialViewProps) {
  // Filter students based on ageGroup and search query
  const filtered = students.filter(student => {
    if (student.level !== 'Inicial') return false;
    
    // Check age group
    if (student.grade !== ageGroup) return false;

    const term = searchQuery.toLowerCase();
    return (
      student.fullName.toLowerCase().includes(term) ||
      student.dni.includes(term) ||
      (student.id && student.id.toLowerCase().includes(term))
    );
  });

  // Calculate dynamic statistics
  const total = filtered.length;
  const activeCount = filtered.filter(s => s.status === 'ACTIVO').length;
  const pendingCount = filtered.filter(s => s.status === 'PENDIENTE').length;

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header and Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex text-xs gap-2 mb-2 font-semibold text-gray-400">
            <span>Gestión Académica</span>
            <span>/</span>
            <span>Nivel Inicial</span>
            <span>/</span>
            <span className="text-brand-red">{ageGroup}</span>
          </nav>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Gestión de Nivel Inicial ({ageGroup})</h2>
          <p className="text-gray-500 text-xs mt-1">Administración de matrícula, asistencia y registros de infantes.</p>
        </div>
        <button 
          onClick={onAddStudent}
          className="bg-brand-red hover:bg-brand-red-hover text-white px-5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <UserPlus size={15} />
          Agregar Estudiante
        </button>
      </div>

      {/* Stats Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
          <div className="bg-red-50 p-2.5 rounded-lg text-brand-red">
            <Users size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Registrados</p>
            <p className="text-xl font-bold text-gray-900">{total}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
          <div className="bg-green-50 p-2.5 rounded-lg text-green-600">
            <CheckCircle size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Activos</p>
            <p className="text-xl font-bold text-gray-900">{activeCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
          <div className="bg-amber-50 p-2.5 rounded-lg text-amber-600">
            <Clock size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pendientes</p>
            <p className="text-xl font-bold text-gray-900">{pendingCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
          <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
            <CalendarDays size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Asistencia Hoy</p>
            <p className="text-xl font-bold text-gray-900">92%</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Student list and Calendar */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-sm text-gray-950">Lista de Estudiantes (Sección Única)</h3>
          <div className="flex gap-1.5">
            <button className="p-2 text-gray-400 hover:text-brand-red transition-all cursor-pointer" title="Configurar filtros">
              <Filter size={16} />
            </button>
            <button 
              onClick={onExportClick}
              className="p-2 text-gray-400 hover:text-brand-red transition-all cursor-pointer" 
              title="Descargar consolidados excel"
            >
              <Download size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100/80">
                <th className="px-6 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Nombre Completo</th>
                <th className="px-6 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">DNI / Identificación</th>
                <th className="px-6 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">F. Nacimiento</th>
                <th className="px-6 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filtered.length > 0 ? (
                filtered.map((item, index) => {
                  const initials = item.fullName.split(',').map(part => part.trim()[0]).join('').slice(0, 2).toUpperCase();
                  const avatarColorClasses = [
                    'bg-red-50 text-brand-red',
                    'bg-blue-50 text-blue-600',
                    'bg-green-50 text-green-600',
                    'bg-purple-50 text-purple-600',
                    'bg-orange-50 text-orange-600'
                  ];
                  const avatarColor = avatarColorClasses[index % avatarColorClasses.length];

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${avatarColor}`}>
                          {initials || "AL"}
                        </div>
                        <span className="font-bold text-gray-900">{item.fullName}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium font-mono">{item.dni}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          item.status === 'ACTIVO' 
                            ? 'bg-green-50 text-green-700 border-green-100' 
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{item.birthDate || "15/03/2021"}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => onEditStudent(item)}
                            className="p-1 px-2 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors inline-flex items-center gap-1 font-semibold text-[11px]" 
                            title="Editar Datos"
                          >
                            <Edit3 size={12} /> Editar
                          </button>
                          <button 
                            onClick={() => onDeleteStudent(item.id)}
                            className="p-1 px-2 text-gray-400 hover:text-brand-red hover:bg-gray-100 rounded transition-colors inline-flex items-center gap-1 font-semibold text-[11px]" 
                            title="Desmatricular student"
                          >
                            <Trash2 size={12} /> Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No hay alumnos registrados en el grupo de {ageGroup} ({ageGroup}).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-gray-50/40 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-500 font-semibold">
          <span>Mostrando {filtered.length} de {filtered.length} registros</span>
          <div className="flex gap-1.5">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-white disabled:opacity-50" disabled>Anterior</button>
            <button className="px-3 py-1 bg-brand-red text-white rounded font-bold">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-white" disabled>Siguiente</button>
          </div>
        </div>
      </div>

      {/* Auxiliary Grid panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 relative overflow-hidden shadow-xs">
          <h3 className="font-bold text-sm text-gray-900 mb-5">Calendario Escolar</h3>
          <div className="space-y-4 relative z-10">
            {calendarEvents.map((evt) => (
              <div key={evt.id} className="flex items-start gap-4">
                <div className="bg-red-50 text-brand-red px-2.5 py-1.5 rounded-lg flex flex-col justify-center items-center font-bold min-w-[50px] shrink-0 text-center">
                  <span className="text-[10px] uppercase tracking-wider truncate font-black">{evt.month}</span>
                  <span className="text-base font-extrabold -mt-1 leading-none">{evt.day}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{evt.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 truncate">{evt.location} - {evt.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute -bottom-8 -right-8 opacity-5">
            <Calendar size={160} className="stroke-brand-red" />
          </div>
        </div>

        {/* Attendance Breakdown bar module */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">Resumen de Asistencia</h3>
            <p className="text-[11px] text-gray-400 font-medium">Asistencia porcentual promedio del grupo de {ageGroup}.</p>
            
            <div className="flex items-end gap-3 h-32 mt-5 mb-3">
              <div className="flex-1 flex flex-col items-center">
                <div className="bg-red-100 hover:bg-brand-red w-full rounded-t-md transition-all relative group" style={{ height: '85%' }}>
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] bg-gray-900 text-white font-bold p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">85%</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="bg-red-100 hover:bg-brand-red w-full rounded-t-md transition-all relative group" style={{ height: '92%' }}>
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] bg-gray-900 text-white font-bold p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">92%</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="bg-red-100 hover:bg-brand-red w-full rounded-t-md transition-all relative group" style={{ height: '78%' }}>
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] bg-gray-900 text-white font-bold p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">78%</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="bg-brand-red w-full rounded-t-md transition-all relative group" style={{ height: '95%' }}>
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] bg-gray-900 text-white font-bold p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">95%</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="bg-gray-100 w-full h-1" style={{ height: '0%' }}></div>
              </div>
            </div>

            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase font-mono px-1">
              <span>Jul</span>
              <span>Ago</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Student } from '../types';
import { UserPlus, Filter, TrendingUp, Users, Edit3, Trash2, Mail, FileText, CalendarCheck, HelpCircle } from 'lucide-react';

interface PrimariaViewProps {
  students: Student[];
  searchQuery: string;
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onCardAction: (actionName: string) => void;
  datosReales?: boolean;
}

export default function PrimariaView({
  students,
  searchQuery,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onCardAction,
  datosReales = false,
}: PrimariaViewProps) {
  // Filters State
  const [gradeFilter, setGradeFilter] = useState('Todos los grados');
  const [sectionFilter, setSectionFilter] = useState('Todas las secciones');
  
  // Real applied filters (triggered on click "Aplicar Filtros")
  const [appliedGrade, setAppliedGrade] = useState('Todos los grados');
  const [appliedSection, setAppliedSection] = useState('Todas las secciones');

  const handleApplyFilters = () => {
    setAppliedGrade(gradeFilter);
    setAppliedSection(sectionFilter);
  };

  // Filter students based on category 'Primaria', search query, and applied select options
  const filtered = students.filter(student => {
    if (student.level !== 'Primaria') return false;

    // Search query matched
    const term = searchQuery.toLowerCase();
    const matchesSearch = 
      student.fullName.toLowerCase().includes(term) ||
      student.dni.includes(term) ||
      student.id.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    // Applied grade select options
    if (appliedGrade !== 'Todos los grados') {
      const numberPart = appliedGrade.split('°')[0]; // e.g., '1', '2', '3'
      if (!student.grade.includes(numberPart)) return false;
    }

    // Applied section select options
    if (appliedSection !== 'Todas las secciones') {
      const sectionLetter = appliedSection.split(' ')[1]; // e.g., 'A', 'B', 'C'
      if (!student.grade.includes(sectionLetter)) return false;
    }

    return true;
  });

  // Calculate dynamic stats
  const totalStudentsCount = filtered.length;
  // Map simulated Total which matches original 482
  const fakeTotal = datosReales
    ? students.filter(s => s.level === 'Primaria').length
    : 482 + (totalStudentsCount - 7);

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header View title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Gestión de Nivel Primaria</h2>
          <p className="text-gray-500 text-xs mt-1">Administración de escolares, expedientes de notas, y secciones de la institución.</p>
        </div>
        <button 
          onClick={onAddStudent}
          className="bg-brand-red hover:bg-brand-red-hover text-white px-5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <UserPlus size={15} />
          Agregar Estudiante
        </button>
      </div>

      {/* Bento Grid - Filters and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Search & Filters module */}
        <div className="md:col-span-8 bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
          <h3 className="font-bold text-sm text-gray-950 mb-4 flex items-center gap-2">
            <Filter size={15} className="text-brand-red" />
            Filtros de Búsqueda
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Grado Académico</label>
              <select 
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="w-full rounded-lg border-gray-200 focus:border-brand-red focus:ring-brand-red/10 text-xs py-2 px-3 bg-white outline-none"
              >
                <option>Todos los grados</option>
                <option>1° Primaria</option>
                <option>2° Primaria</option>
                <option>3° Primaria</option>
                <option>4° Primaria</option>
                <option>5° Primaria</option>
                <option>6° Primaria</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Sección</label>
              <select 
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                className="w-full rounded-lg border-gray-200 focus:border-brand-red focus:ring-brand-red/10 text-xs py-2 px-3 bg-white outline-none"
              >
                <option>Todas las secciones</option>
                <option>Sección A</option>
                <option>Sección B</option>
                <option>Sección C</option>
              </select>
            </div>

            <div className="flex items-end">
              <button 
                onClick={handleApplyFilters}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-lg text-xs font-bold transition-all h-[36px]"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Level Stats Summary */}
        <div className="md:col-span-4 bg-brand-red text-white rounded-xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h3 className="font-bold text-xs uppercase tracking-widest text-red-100">Total Estudiantes</h3>
            <p className="text-4xl font-black mt-2 mb-2">{fakeTotal}</p>
            <div className="flex items-center gap-1.5 text-xs text-red-100 font-bold">
              <TrendingUp size={14} />
              <span>+12 nuevos este mes</span>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-10">
            <Users size={120} className="stroke-[1.5]" />
          </div>
        </div>
      </div>

      {/* Main Table: Students table list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-sm text-gray-950">Listado de Estudiantes Primaria</h3>
          <span className="text-xs text-gray-400 font-semibold bg-white border border-gray-100 py-1 px-3 rounded-lg shadow-3xs">
            Mostrando 1 - {filtered.length} de {filtered.length} alumnos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-400 font-black border-b border-gray-100">
                <th className="px-6 py-4">Nombre Completo</th>
                <th className="px-6 py-4">DNI / Identificación</th>
                <th className="px-6 py-4">Grado / Sección</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filtered.length > 0 ? (
                filtered.map((item, idx) => {
                  const initials = item.fullName.split(',').map(part => part.trim()[0]).join('').slice(0, 2).toUpperCase();
                  
                  let badgeStyling = "text-green-700 bg-green-50 border-green-100";
                  if (item.status === 'PENDIENTE') badgeStyling = "text-amber-700 bg-amber-50 border-amber-100";
                  if (String(item.status) === 'REVISION') badgeStyling = "text-yellow-700 bg-yellow-50 border-yellow-10 border";

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-50 text-brand-red flex items-center justify-center font-bold text-[10px] shrink-0">
                            {initials || "AV"}
                          </div>
                          <span className="font-bold text-gray-900">{item.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium font-mono">{item.dni}</td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md text-[10px] font-bold border border-gray-100">
                          {item.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${badgeStyling}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => onEditStudent(item)}
                            className="p-1 px-2 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors inline-flex items-center gap-1 font-semibold text-[11px]"
                          >
                            <Edit3 size={12} /> Editar
                          </button>
                          <button 
                            onClick={() => onDeleteStudent(item.id)}
                            className="p-1 px-2 text-gray-400 hover:text-brand-red hover:bg-gray-50 rounded transition-colors inline-flex items-center gap-1 font-semibold text-[11px]"
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
                    No se encontraron estudiantes para los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="px-6 py-3.5 border-t border-gray-100 flex justify-between items-center bg-gray-50/40 text-[11px] text-gray-500 font-semibold">
          <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50" disabled>Anterior</button>
          <div className="flex gap-2">
            <button className="w-6 h-6 flex items-center justify-center rounded bg-brand-red text-white text-[10px] font-bold">1</button>
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-[10px]" disabled>2</button>
          </div>
          <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50" disabled>Siguiente</button>
        </div>
      </div>

      {/* Link Cards Panel - Secondary Procedures */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => onCardAction('Descarga de Reportes de Notas')}
          className="p-5 bg-white border border-gray-200 rounded-xl flex items-center gap-4 cursor-pointer hover:border-brand-red/30 hover:shadow-xs transition-all group"
        >
          <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
            <FileText size={18} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-gray-900">Reportes de Notas</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Descargar consolidados PDF</p>
          </div>
        </div>

        <div 
          onClick={() => onCardAction('Registro de Asistencia')}
          className="p-5 bg-white border border-gray-200 rounded-xl flex items-center gap-4 cursor-pointer hover:border-brand-red/30 hover:shadow-xs transition-all group"
        >
          <div className="w-11 h-11 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
            <CalendarCheck size={18} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-gray-900">Registro de Asistencia</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Control diario por sección</p>
          </div>
        </div>

        <div 
          onClick={() => onCardAction('Citaciones y Comunicados')}
          className="p-5 bg-white border border-gray-200 rounded-xl flex items-center gap-4 cursor-pointer hover:border-brand-red/30 hover:shadow-xs transition-all group"
        >
          <div className="w-11 h-11 rounded-lg bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors shrink-0">
            <Mail size={18} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-gray-900">Citaciones</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Comunicados a padres</p>
          </div>
        </div>
      </div>
    </div>
  );
}

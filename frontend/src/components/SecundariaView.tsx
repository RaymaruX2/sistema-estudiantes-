import React, { useState } from 'react';
import { Student } from '../types';
import { UserPlus, Eye, Edit3, Trash2, Shield, FileText, BarChart3, ChevronRight, Download } from 'lucide-react';

interface SecundariaViewProps {
  students: Student[];
  searchQuery: string;
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onViewStudent: (student: Student) => void;
  onGenerateReportPDF: () => void;
}

export default function SecundariaView({
  students,
  searchQuery,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onViewStudent,
  onGenerateReportPDF,
}: SecundariaViewProps) {
  // Filter states
  const [grado, setGrado] = useState('Todos los grados');
  const [seccion, setSeccion] = useState('Todas las secciones');
  const [carrera, setCarrera] = useState('Todas las especialidades');

  // Filter student dataset based on Secundaria levels and dropdown filters
  const filtered = students.filter(student => {
    if (student.level !== 'Secundaria') return false;

    // Search matches DNI, Name or ID
    const term = searchQuery.toLowerCase();
    const matchesSearch = 
      student.fullName.toLowerCase().includes(term) ||
      student.dni.includes(term) ||
      student.id.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    // Grado Filter
    if (grado !== 'Todos los grados') {
      const gNum = grado.split('°')[0]; // '5'
      if (!student.grade.includes(gNum)) return false;
    }

    // Sección Filter
    if (seccion !== 'Todas las secciones') {
      const sLetter = seccion.split(' ')[1]; // 'A'
      if (!student.grade.includes(sLetter)) return false;
    }

    // Carrera Filter
    if (carrera !== 'Todas las especialidades') {
      const cStr = student.technicalCareer || '';
      if (carrera === 'Computación e Informática' && !cStr.includes('Computación')) return false;
      if (carrera === 'Contabilidad' && !cStr.includes('Contabilidad')) return false;
      if (carrera === 'Electrónica' && !cStr.includes('Electrónica')) return false;
      if (carrera === 'Diseño Industrial' && !cStr.includes('Diseño')) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header section with breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1 text-gray-400 text-xs mb-2 font-semibold">
            <span>Gestión Académica</span>
            <ChevronRight size={12} />
            <span className="text-brand-red font-bold">Nivel Secundaria</span>
          </nav>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Gestión de Nivel Secundaria</h2>
          <p className="text-gray-500 text-xs mt-1">Administración de estudiantes, grados, secciones y especialidades técnicas vocacionales.</p>
        </div>
        <button 
          onClick={onAddStudent}
          className="bg-brand-red hover:bg-brand-red-hover text-white px-5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <UserPlus size={15} />
          Agregar Estudiante
        </button>
      </div>

      {/* Bento Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-xl border border-gray-200 shadow-3xs flex flex-col gap-2">
          <label className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">Grado</label>
          <select 
            value={grado}
            onChange={(e) => setGrado(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-all"
          >
            <option>Todos los grados</option>
            <option>1° Secundaria</option>
            <option>2° Secundaria</option>
            <option>3° Secundaria</option>
            <option>4° Secundaria</option>
            <option>5° Secundaria</option>
          </select>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-gray-200 shadow-3xs flex flex-col gap-2">
          <label className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">Sección</label>
          <select 
            value={seccion}
            onChange={(e) => setSeccion(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-all"
          >
            <option>Todas las secciones</option>
            <option>Sección A</option>
            <option>Sección B</option>
            <option>Sección C</option>
          </select>
        </div>

        <div className="md:col-span-2 bg-white p-4.5 rounded-xl border border-gray-200 shadow-3xs flex flex-col gap-2">
          <label className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">Carrera Técnica</label>
          <select 
            value={carrera}
            onChange={(e) => setCarrera(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-all"
          >
            <option>Todas las especialidades</option>
            <option>Computación e Informática</option>
            <option>Contabilidad</option>
            <option>Electrónica</option>
            <option>Diseño Industrial</option>
          </select>
        </div>
      </div>

      {/* Stats Overview - Asymmetric Side Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Students Table */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs flex flex-col">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-sm text-gray-950">Lista de Estudiantes Secundaria</h3>
            <span className="text-xs text-gray-500 font-semibold bg-white px-2.5 py-1 border border-gray-200 rounded-md">
              Mostrando {filtered.length} estudiantes
            </span>
          </div>

          <div className="overflow-x-auto creative-scroll">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-400 font-bold border-b border-gray-200">
                  <th className="px-6 py-3.5">Nombre Completo</th>
                  <th className="px-6 py-3.5">DNI</th>
                  <th className="px-6 py-3.5">Grado / Sec.</th>
                  <th className="px-6 py-3.5">Carrera Técnica</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filtered.length > 0 ? (
                  filtered.map((item) => {
                    const initials = item.fullName.split(',').map(part => part.trim()[0]).join('').slice(0, 2).toUpperCase();
                    
                    // Specific career chip colors requested in specs
                    let careerStyle = "bg-gray-100 text-gray-700";
                    if (item.technicalCareer?.includes("Computación")) careerStyle = "bg-blue-50 text-blue-700 font-bold border border-blue-100";
                    if (item.technicalCareer?.includes("Contabilidad")) careerStyle = "bg-green-50 text-green-700 font-bold border border-green-100";
                    if (item.technicalCareer?.includes("Electrónica")) careerStyle = "bg-amber-50 text-amber-700 font-bold border border-amber-100";
                    if (item.technicalCareer?.includes("Diseño")) careerStyle = "bg-purple-50 text-purple-700 font-bold border border-purple-100";

                    return (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 text-brand-red flex items-center justify-center font-extrabold text-[10px]">
                            {initials || "AC"}
                          </div>
                          <span className="font-bold text-gray-900">{item.fullName}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-mono font-medium">{item.dni}</td>
                        <td className="px-6 py-4 text-gray-600 font-semibold">{item.grade}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wide inline-block ${careerStyle}`}>
                            {item.technicalCareer || "General"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button 
                              onClick={() => onViewStudent(item)}
                              className="p-1 px-2 hover:bg-gray-50 rounded text-gray-500 hover:text-brand-red font-semibold text-[11px] inline-flex items-center gap-1.5"
                              title="Ver"
                            >
                              <Eye size={12} /> Ver
                            </button>
                            <button 
                              onClick={() => onEditStudent(item)}
                              className="p-1 px-2 hover:bg-gray-50 rounded text-gray-500 hover:text-blue-600 font-semibold text-[11px] inline-flex items-center gap-1.5"
                              title="Editar"
                            >
                              Editar
                            </button>
                            <button 
                              onClick={() => onDeleteStudent(item.id)}
                              className="p-1 px-2 hover:bg-gray-50 rounded text-gray-400 hover:text-brand-red font-semibold text-[11px] inline-flex items-center gap-1.5"
                              title="Eliminar"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      No hay estudiantes registrados con los criterios seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-auto border-t border-gray-100 px-6 py-3.5 flex items-center justify-between bg-white text-[11px] text-gray-500 font-semibold">
            <span>Página 1 de 1</span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs hover:bg-gray-50 disabled:opacity-50" disabled>Anterior</button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs hover:bg-gray-50 disabled:opacity-50" disabled>Siguiente</button>
            </div>
          </div>
        </div>

        {/* Right Side: Bento stack of stats cards */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Level Summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
            <h4 className="font-extrabold text-sm text-gray-950 mb-4">Resumen de Nivel</h4>
            <div className="space-y-4 text-xs font-semibold">
              <div className="flex justify-between items-center pb-2.5 border-b border-gray-50">
                <span className="text-gray-400">Total Estudiantes</span>
                <span className="font-black text-gray-900">482</span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-gray-50">
                <span className="text-gray-400">Más Solicitada</span>
                <span className="bg-red-50 text-brand-red px-2 py-0.5 rounded-md text-[10px] font-black border border-red-100">Computación</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Egresados Proyectados</span>
                <span className="font-black text-gray-900">92</span>
              </div>
            </div>
          </div>

          {/* Carreras PDF Report call to action */}
          <div className="bg-brand-red-light border border-red-100 text-brand-red rounded-xl p-6 shadow-xs relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-black text-sm text-brand-red mb-2">Reporte de Carreras</h4>
              <p className="text-gray-600 text-xs mb-4 leading-normal">Descarga de forma segura el consolidado completo de especialidades técnicas profesionales 2024.</p>
              <button 
                onClick={onGenerateReportPDF}
                className="w-full bg-brand-red text-white hover:bg-brand-red-hover font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs group"
              >
                <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                Generar PDF
              </button>
            </div>
          </div>

          {/* Distribución ProgressBar indicators */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
            <h4 className="font-bold text-[10px] text-gray-400 uppercase tracking-widest mb-4">Distribución Técnica</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold text-gray-700">
                  <span>Computación</span>
                  <span>35%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold text-gray-700">
                  <span>Contabilidad</span>
                  <span>28%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold text-gray-700">
                  <span>Otras Carreras</span>
                  <span>37%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-400 rounded-full" style={{ width: '37%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

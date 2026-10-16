import React, { useState } from 'react';
import { Student } from '../types';
import { UserPlus, ArrowRight, Award, GraduationCap, Mail, Edit3, Trash2, Filter } from 'lucide-react';

interface EgresadosViewProps {
  students: Student[];
  searchQuery: string;
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onContactEmail: (student: Student) => void;
  onCardAction: (actionName: string) => void;
}

export default function EgresadosView({
  students,
  searchQuery,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onContactEmail,
  onCardAction,
}: EgresadosViewProps) {
  const [selectedYear, setSelectedYear] = useState('Todos los años');
  const [selectedCareer, setSelectedCareer] = useState('Todas las especialidades');

  // Filter students matching type 'Egresado'
  const filtered = students.filter(student => {
    if (student.level !== 'Egresado') return false;

    // Search input match
    const term = searchQuery.toLowerCase();
    const matchesSearch = 
      student.fullName.toLowerCase().includes(term) ||
      student.dni.includes(term) ||
      (student.email && student.email.toLowerCase().includes(term));

    if (!matchesSearch) return false;

    // Filter year
    if (selectedYear !== 'Todos los años') {
      if (student.gradYear !== parseInt(selectedYear)) return false;
    }

    // Filter speciality
    if (selectedCareer !== 'Todas las especialidades') {
      const spec = student.technicalCareer || '';
      if (selectedCareer === 'Computación e Informática' && !spec.includes('Computación')) return false;
      if (selectedCareer === 'Gastronomía' && !spec.includes('Gastronomía')) return false;
      if (selectedCareer === 'Electrónica Industrial' && !spec.includes('Electrónica')) return false;
      if (selectedCareer === 'Contabilidad' && !spec.includes('Contabilidad')) return false;
      if (selectedCareer === 'Mecánica Automotriz' && !spec.includes('Mecánica')) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header and top buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-gray-400 text-xs mb-2 font-semibold">
            <span>Gestión Académica</span>
            <span>/</span>
            <span className="text-brand-red font-bold">Egresados (Exalumnos)</span>
          </nav>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Egresados (Exalumnos)</h2>
          <p className="text-gray-500 text-xs mt-1">Directorio de egresados de especialidades técnicas y seguimiento de colocación profesional.</p>
        </div>
        <button 
          onClick={onAddStudent}
          className="bg-brand-red hover:bg-brand-red-hover text-white px-5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <UserPlus size={15} />
          Registrar Egreso
        </button>
      </div>

      {/* Row stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-xs flex items-center gap-5">
          <div className="p-3 bg-red-100 text-brand-red rounded-xl">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Egresados Colegio</p>
            <p className="text-2xl font-bold text-gray-950 mt-0.5">3,850</p>
          </div>
        </div>

        {/* Labor employment bar ratio */}
        <div className="md:col-span-2 bg-white p-6 border border-gray-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2.5">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inserción Laboral / Académica Superior</p>
              <h3 className="text-2xl font-extrabold text-gray-905 mt-0.5">76.4%</h3>
            </div>
            <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2.5 py-0.5 rounded-full border border-green-100 uppercase">Estable</span>
          </div>
          <div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-red rounded-full" style={{ width: '76.4%' }}></div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 font-medium">Alumnos laborando o cursando estudios superiores a 1 año de su egreso.</p>
          </div>
        </div>
      </div>

      {/* Dynamic filtering panel */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
        <h3 className="font-bold text-xs text-gray-900 mb-4 flex items-center gap-2">
          <Filter size={14} className="text-brand-red" />
          Filtros de Red de Egresados
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Año de Promoción</label>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white border border-gray-200 text-xs py-2 px-3 rounded-lg outline-none focus:border-brand-red"
            >
              <option>Todos los años</option>
              <option>2023</option>
              <option>2022</option>
              <option>2021</option>
              <option>2020</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Especialidad Técnica</label>
            <select 
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
              className="bg-white border border-gray-200 text-xs py-2 px-3 rounded-lg outline-none focus:border-brand-red"
            >
              <option>Todas las especialidades</option>
              <option>Computación e Informática</option>
              <option>Gastronomía</option>
              <option>Electrónica Industrial</option>
              <option>Contabilidad</option>
              <option>Mecánica Automotriz</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory ex-students list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-sm text-gray-950">Directorio de Graduados</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-400 font-bold border-b border-gray-100">
                <th className="px-6 py-3.5">Exalumno</th>
                <th className="px-6 py-3.5">DNI</th>
                <th className="px-6 py-3.5">Especialidad Técnica</th>
                <th className="px-6 py-3.5">Año Promoción</th>
                <th className="px-6 py-3.5">Contacto</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filtered.length > 0 ? (
                filtered.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{student.fullName}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono">{student.dni}</td>
                    <td className="px-6 py-4">
                      <span className="bg-red-50 text-brand-red border border-red-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        {student.technicalCareer || "Educación Básica"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-black">{student.gradYear || "2023"}</td>
                    <td className="px-6 py-4 text-gray-500 font-medium font-mono">{student.email || "consultar@feyalegria.edu.pe"}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => onContactEmail(student)}
                          className="p-1 px-2.5 hover:bg-gray-100 text-gray-500 hover:text-brand-red rounded font-bold text-[11px] inline-flex items-center gap-1.5"
                          title="Contactar Egreso"
                        >
                          <Mail size={12} /> Email
                        </button>
                        <button 
                          onClick={() => onEditStudent(student)}
                          className="p-1 px-2 hover:bg-gray-100 text-gray-400 hover:text-blue-600 rounded font-semibold text-[11px]"
                          title="Modificar ficha"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => onDeleteStudent(student.id)}
                          className="p-1 px-2 hover:bg-gray-100 text-gray-400 hover:text-red-600 rounded font-semibold text-[11px]"
                          title="Eliminar de exalumnos"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No hay egresados que coincidan con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alumni News community callout block */}
      <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 md:max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs text-brand-red bg-red-50 px-2 py-0.5 rounded-md border border-red-100 font-bold mb-1">
            <Award size={13} />
            Programa de Mentoría Exalumnos
          </div>
          <h4 className="font-extrabold text-sm text-gray-900">Comunidad y Red de Colocación Profesional Fe y Alegría 3</h4>
          <p className="text-gray-500 text-xs leading-normal">
            Conectamos a nuestros graduados técnicos con becas de estudio y oportunidades de empleo. Próximo evento: 
            <span className="font-bold text-gray-800"> Workshop de Empleabilidad & Empleo 2024 (28 de Noviembre)</span>.
          </p>
        </div>
        <button 
          onClick={() => onCardAction('Workshop de Empleabilidad 2024')}
          className="bg-brand-red text-white hover:bg-brand-red-hover font-bold text-xs py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0"
        >
          Participar
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

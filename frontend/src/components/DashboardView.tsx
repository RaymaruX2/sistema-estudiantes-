import React from 'react';
import { Student, ActivityItem } from '../types';
import { Users, TrendingUp, Award, Calendar, Download, UserPlus, Eye, Filter } from 'lucide-react';

interface DashboardViewProps {
  students: Student[];
  activities: ActivityItem[];
  searchQuery: string;
  onEnrollClick: () => void;
  onExportClick: () => void;
  onCycleClick: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onViewStudent: (student: Student) => void;
  /** true cuando los datos vienen del servidor: se muestran los totales reales */
  datosReales?: boolean;
}

export default function DashboardView({
  students,
  activities,
  searchQuery,
  onEnrollClick,
  onExportClick,
  onCycleClick,
  onEditStudent,
  onDeleteStudent,
  onViewStudent,
  datosReales = false,
}: DashboardViewProps) {
  // Let's filter students for lists
  const filteredStudents = students.filter(student => {
    const term = searchQuery.toLowerCase();
    return (
      student.fullName.toLowerCase().includes(term) ||
      student.id.toLowerCase().includes(term) ||
      student.dni.includes(term)
    );
  });

  // Calculate stats dynamically based on actual state!
  const totalInDb = students.length;
  // Scale factor to simulate original 1432
  const fakeMultiplier = 1; 
  const countEgresados = students.filter(s => s.level === 'Egresado').length;
  const totalEstudiantes = datosReales
    ? totalInDb - countEgresados
    : 1432 + (totalInDb - 21); // Adjust dynamically relative to initial count of 21

  // Nivel counts
  const countInicial = students.filter(s => s.level === 'Inicial').length;
  const countPrimaria = students.filter(s => s.level === 'Primaria').length;
  const countSecundaria = students.filter(s => s.level === 'Secundaria').length;

  const fakeInicial = datosReales ? countInicial : 210 + (countInicial - 8);
  const fakePrimaria = datosReales ? countPrimaria : 640 + (countPrimaria - 7);
  const fakeSecundaria = datosReales ? countSecundaria : 582 + (countSecundaria - 5);

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Bento Grid - Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Main Metric: Total Students */}
        <div className="md:col-span-2 bg-white p-6 border border-gray-200 rounded-xl shadow-xs">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 font-bold text-xs uppercase tracking-wider">Total Estudiantes</p>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-1">{totalEstudiantes.toLocaleString()}</h2>
            </div>
            <div className="bg-red-50 p-2.5 rounded-xl text-brand-red">
              <Users size={24} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500 mb-1">Inicial</p>
              <p className="font-bold text-gray-900">{fakeInicial}</p>
              <div className="w-full bg-gray-100 h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-red-400 h-1 rounded-full" style={{ width: `${(fakeInicial/Math.max(totalEstudiantes, 1))*100}%` }}></div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Primaria</p>
              <p className="font-bold text-gray-900">{fakePrimaria}</p>
              <div className="w-full bg-gray-100 h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-red-600 h-1 rounded-full" style={{ width: `${(fakePrimaria/Math.max(totalEstudiantes, 1))*100}%` }}></div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Secundaria</p>
              <p className="font-bold text-gray-900">{fakeSecundaria}</p>
              <div className="w-full bg-gray-100 h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-red-800 h-1 rounded-full" style={{ width: `${(fakeSecundaria/Math.max(totalEstudiantes, 1))*100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Metric: Alumni */}
        <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-wider">Egresados (Total)</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">{datosReales ? countEgresados.toLocaleString('es-PE') : '3,850'}</h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-green-600 mt-3 font-semibold">
            <TrendingUp size={14} />
            <span>+125 este año</span>
          </div>
          <div className="text-right mt-3 text-brand-red opacity-10 flex justify-end">
            <Award size={48} className="stroke-[1]" />
          </div>
        </div>

        {/* Secondary Metric: Retention Rate */}
        <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-wider">Tasa Retención</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">98.4%</h2>
          </div>
          {/* Asymmetric indicator blocks */}
          <div className="relative h-12 flex items-end gap-1.5 mt-3">
            <div className="bg-gray-100 w-full h-4 rounded-t-sm"></div>
            <div className="bg-gray-100 w-full h-8 rounded-t-sm"></div>
            <div className="bg-gray-100 w-full h-6 rounded-t-sm"></div>
            <div className="bg-brand-red w-full h-11 rounded-t-sm"></div>
          </div>
        </div>
      </div>

      {/* Dashboard Main Visual Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-base text-gray-900">Tendencias de Matrícula</h3>
              <select className="text-xs font-semibold bg-white border border-gray-200 rounded-lg py-1 px-3 outline-none text-gray-600">
                <option>Últimos 5 años</option>
                <option>Últimos 10 años</option>
              </select>
            </div>
            
            <div className="p-6">
              {/* Responsive SVG Line Chart */}
              <div className="h-64 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#af101a" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#af101a" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="800" y2="50" stroke="#f3f3f3" strokeWidth="1" />
                  <line x1="0" y1="100" x2="800" y2="100" stroke="#f3f3f3" strokeWidth="1" />
                  <line x1="0" y1="150" x2="800" y2="150" stroke="#f3f3f3" strokeWidth="1" />

                  {/* Gradient Area */}
                  <path 
                    d="M 50 150 Q 200 135 350 100 T 650 65 T 750 45 L 750 200 L 50 200 Z" 
                    fill="url(#chartGradient)" 
                  />
                  
                  {/* Line Path */}
                  <path 
                    d="M 50 150 Q 200 135 350 100 T 650 65 T 750 45" 
                    fill="none" 
                    stroke="#af101a" 
                    strokeLinecap="round" 
                    strokeWidth="3.5" 
                  />

                  {/* Projection Line */}
                  <path 
                    d="M 650 65 Q 700 55 750 42" 
                    fill="none" 
                    stroke="#af101a" 
                    strokeDasharray="4,4" 
                    strokeLinecap="round" 
                    strokeWidth="2" 
                    opacity="0.6"
                  />

                  {/* Data Points */}
                  <circle cx="50" cy="150" fill="#fff" stroke="#af101a" strokeWidth="2.5" r="5" />
                  <circle cx="218" cy="132" fill="#fff" stroke="#af101a" strokeWidth="2.5" r="5" className="hover:r-7 transition-all cursor-pointer" />
                  <circle cx="386" cy="102" fill="#fff" stroke="#af101a" strokeWidth="2.5" r="5" />
                  <circle cx="554" cy="74" fill="#fff" stroke="#af101a" strokeWidth="2.5" r="5" />
                  <circle cx="722" cy="48" fill="#fff" stroke="#af101a" strokeWidth="2.5" r="5" />
                </svg>

                {/* X Axis labels */}
                <div className="flex justify-between mt-4 text-[11px] text-gray-400 font-bold px-4">
                  <span>2020</span>
                  <span>2021</span>
                  <span>2022</span>
                  <span>2023</span>
                  <span>2024</span>
                </div>
              </div>

              {/* Chart Legend */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl flex gap-8">
                <div className="flex items-center gap-2">
                  <span className="w-3" style={{ height: '3px', backgroundColor: '#af101a', display: 'inline-block', borderRadius: '1.5px' }}></span>
                  <span className="text-xs font-semibold text-gray-700">Matrícula Regular</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 border-b-2 border-dashed border-brand-red/60" style={{ height: '1px', display: 'inline-block' }}></span>
                  <span className="text-xs font-semibold text-gray-500">Proyección 2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button 
              onClick={onEnrollClick}
              className="bg-brand-red hover:bg-brand-red-hover text-white p-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-xs group"
            >
              <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xs">Nueva Matrícula</span>
            </button>
            <button 
              onClick={onExportClick}
              className="bg-white border border-brand-red text-brand-red p-4 rounded-xl flex items-center justify-center gap-3 hover:bg-red-50 transition-colors"
            >
              <Download size={18} />
              <span className="font-bold text-xs">Exportar Reportes</span>
            </button>
            <button 
              onClick={onCycleClick}
              className="bg-white border border-gray-200 text-gray-700 p-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <Calendar size={18} />
              <span className="font-bold text-xs">Configurar Ciclo</span>
            </button>
          </div>
        </div>

        {/* Right Column: Actividad Reciente */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs h-full flex flex-col justify-between">
            <div>
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-base text-gray-900">Actividad Reciente</h3>
                <span className="text-gray-400 font-bold text-xs">Historial</span>
              </div>
              <div className="divide-y divide-gray-100">
                {activities.slice(0, 5).map((item) => {
                  let colorClass = "bg-red-50 text-brand-red";
                  if (item.type === 'nota') colorClass = "bg-blue-50 text-blue-600";
                  if (item.type === 'inscripcion') colorClass = "bg-green-50 text-green-600";
                  if (item.type === 'boletin') colorClass = "bg-purple-50 text-purple-600";
                  if (item.type === 'reunion') colorClass = "bg-amber-50 text-amber-600";

                  return (
                    <div key={item.id} className="p-4 flex gap-3.5 hover:bg-gray-50/50 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${colorClass}`}>
                        {item.title[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-900 font-semibold truncate">{item.title}</p>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">{item.subtitle}</p>
                        <span className="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-wider block">{item.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
              <span className="text-xs font-bold text-brand-red hover:underline cursor-pointer uppercase tracking-wider">
                Ver todo el historial
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table: Student Master */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <h3 className="font-bold text-base text-gray-900">Listado Maestro de Estudiantes</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 inline-flex items-center gap-1.5 shadow-2xs">
              <Filter size={12} />
              Filtros
            </button>
            <button 
              onClick={onExportClick}
              className="px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 shadow-2xs"
            >
              Imprimir Lista
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-400 font-black border-b border-gray-100">
                <th className="px-6 py-4">Estudiante</th>
                <th className="px-6 py-4">ID Registro</th>
                <th className="px-6 py-4">Nivel / Grado</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredStudents.length > 0 ? (
                // Show dashboard highlights of students
                filteredStudents.slice(0, 4).map((student) => {
                  let badgeColor = "bg-green-50 text-green-700 border-green-100";
                  if (student.status === 'PENDIENTE') badgeColor = "bg-amber-50 text-amber-700 border-amber-100";
                  if (student.status === 'FINALIZADO') badgeColor = "bg-gray-100 text-gray-600 border-gray-200";
                  if (String(student.status) === 'REVISION') badgeColor = "bg-orange-50 text-orange-700 border-orange-100";

                  return (
                    <tr key={student.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-gray-900">{student.fullName}</td>
                      <td className="px-6 py-3.5 text-mono font-medium text-gray-500">#{student.id}</td>
                      <td className="px-6 py-3.5 text-gray-600">
                        {student.level} / {student.grade}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black border ${badgeColor}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right space-x-1">
                        <button 
                          onClick={() => onViewStudent(student)}
                          className="p-1 text-gray-400 hover:text-brand-red transition-colors inline-block"
                          title="Ver Ficha"
                        >
                          <Eye size={15} />
                        </button>
                        <button 
                          onClick={() => onEditStudent(student)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors inline-block text-[11px] font-semibold"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => onDeleteStudent(student.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors inline-block text-[11px] font-semibold"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No se encontraron estudiantes que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3.5 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-500 font-semibold bg-gray-50/40">
          <span>Mostrando {Math.min(4, filteredStudents.length)} de {filteredStudents.length} registros</span>
          <div className="flex gap-4">
            <span className="text-gray-300 select-none">Anterior</span>
            <span className="text-brand-red cursor-pointer hover:underline">Siguiente</span>
          </div>
        </div>
      </div>
    </div>
  );
}

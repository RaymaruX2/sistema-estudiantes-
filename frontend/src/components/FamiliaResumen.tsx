import React from 'react';
import { CalendarCheck, GraduationCap, Wallet, AlertTriangle } from 'lucide-react';
import { DetalleApoderado, ETIQUETA_CONCEPTO, fechaCorta, soles } from '../api';
import { textoGrado } from '../mappers';
import { BadgeEstadoPago, claseFilaTh, Tarjeta, Vacio } from './ui';

/** Hijos, pagos y asistencias de un apoderado. Se usa en la ficha del apoderado y en el portal del padre. */
export default function FamiliaResumen({ d }: { d: DetalleApoderado }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Tarjeta destacado titulo="Hijos registrados" valor={d.hijos.length} detalle="Estudiantes a cargo" icono={<GraduationCap size={18} />} />
        <Tarjeta titulo="Total pagado" valor={soles(d.totalPagado)} detalle="Pagos confirmados" icono={<Wallet size={18} />} />
        <Tarjeta titulo="Por pagar" valor={soles(d.totalPendiente)} detalle="Pendientes y atrasados" icono={<AlertTriangle size={18} />} />
        <Tarjeta titulo="Asistencia a reuniones" valor={`${d.porcentajeAsistencia}%`}
                 detalle={`${d.reunionesAsistidas} de ${d.reunionesTotales} reuniones`} icono={<CalendarCheck size={18} />} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-sm text-gray-950">Hijos / estudiantes a cargo</h3>
        </div>
        {d.hijos.length === 0 ? <Vacio texto="Sin estudiantes asignados" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={claseFilaTh}>
                  <th className="px-6 py-3">Estudiante</th><th className="px-6 py-3">DNI</th>
                  <th className="px-6 py-3">Nivel</th><th className="px-6 py-3">Grado / Sección</th><th className="px-6 py-3">Edad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {d.hijos.map((h) => (
                  <tr key={h.id}>
                    <td className="px-6 py-3 font-bold text-gray-900">{h.nombreCompleto}</td>
                    <td className="px-6 py-3 font-mono text-gray-500">{h.numeroDocumento}</td>
                    <td className="px-6 py-3 text-gray-600 font-semibold">{h.nivel}</td>
                    <td className="px-6 py-3">
                      <span className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md text-[10px] font-bold border border-gray-100">{textoGrado(h)}</span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{h.edad} años</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50"><h3 className="font-bold text-sm text-gray-950">Pagos</h3></div>
          {d.pagos.length === 0 ? <Vacio texto="Sin pagos registrados" /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={claseFilaTh}>
                    <th className="px-6 py-3">Fecha</th><th className="px-6 py-3">Concepto</th>
                    <th className="px-6 py-3">Descripción</th><th className="px-6 py-3 text-right">Monto</th><th className="px-6 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {d.pagos.map((p) => (
                    <tr key={p.id}>
                      <td className="px-6 py-3 text-gray-500">{fechaCorta(p.fechaPago)}</td>
                      <td className="px-6 py-3 font-semibold text-gray-700">{ETIQUETA_CONCEPTO[p.concepto]}</td>
                      <td className="px-6 py-3 text-gray-600">{p.descripcion}</td>
                      <td className="px-6 py-3 text-right font-bold text-gray-900">{soles(p.monto)}</td>
                      <td className="px-6 py-3"><BadgeEstadoPago estado={p.estado} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50"><h3 className="font-bold text-sm text-gray-950">Reuniones</h3></div>
          {d.asistencias.length === 0 ? <Vacio texto="Sin reuniones registradas" /> : (
            <ul className="divide-y divide-gray-100 text-xs">
              {d.asistencias.map((r) => (
                <li key={r.id} className="px-6 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-900">{r.tituloReunion}</p>
                    <p className="text-[11px] text-gray-400">{fechaCorta(r.fechaReunion)}{r.horaReunion ? ` · ${r.horaReunion.slice(0, 5)}` : ''}</p>
                  </div>
                  {r.asistio
                    ? <span className="px-2 py-0.5 rounded-full text-[9px] font-black border uppercase text-green-700 bg-green-50 border-green-100">Asistió</span>
                    : <span className="px-2 py-0.5 rounded-full text-[9px] font-black border uppercase text-red-700 bg-red-50 border-red-100">No asistió</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

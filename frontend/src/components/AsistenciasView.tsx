import React, { useCallback, useEffect, useState } from 'react';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import { api, AsistenciaApi, AsistenciaRequest, fechaCorta, Pagina } from '../api';
import SelectorApoderado from './SelectorApoderado';
import {
  Campo, Cargando, claseBotonPrimario, claseBotonSecundario, claseFilaTh, claseInput,
  MensajeError, Modal, Paginador, Vacio,
} from './ui';

interface Props {
  searchQuery: string;
  avisar: (mensaje: string, tipo?: 'success' | 'info' | 'error') => void;
}

export default function AsistenciasView({ searchQuery, avisar }: Props) {
  const [pagina, setPagina] = useState(0);
  const [datos, setDatos] = useState<Pagina<AsistenciaApi> | null>(null);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState<AsistenciaApi | 'nuevo' | null>(null);

  const cargar = useCallback(() => {
    setError('');
    api.asistencias({ q: searchQuery, page: pagina, size: 20 }).then(setDatos).catch((e) => setError(e.message));
  }, [searchQuery, pagina]);

  useEffect(() => { setPagina(0); }, [searchQuery]);
  useEffect(() => { cargar(); }, [cargar]);

  const eliminar = async (a: AsistenciaApi) => {
    if (!window.confirm(`¿Eliminar el registro de "${a.tituloReunion}" de ${a.apoderadoNombre}?`)) return;
    try {
      await api.eliminarAsistencia(a.id);
      avisar('Registro de asistencia eliminado', 'info');
      cargar();
    } catch (e) {
      avisar((e as Error).message, 'error');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-gray-900">Asistencia a reuniones</h2>
          <p className="text-xs text-gray-500 font-medium">Control de asistencia de los apoderados a reuniones del colegio.</p>
        </div>
        <button className={claseBotonPrimario} onClick={() => setEditando('nuevo')}><Plus size={14} /> Registrar asistencia</button>
      </div>

      <MensajeError mensaje={error} />

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        {!datos ? <Cargando /> : datos.contenido.length === 0 ? <Vacio texto="No hay registros que coincidan" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={claseFilaTh}>
                  <th className="px-6 py-4">Apoderado</th><th className="px-6 py-4">Fecha</th><th className="px-6 py-4">Reunión</th>
                  <th className="px-6 py-4">Asistencia</th><th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {datos.contenido.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{a.apoderadoNombre}</p>
                      <p className="text-[10px] font-mono text-gray-400">DNI {a.apoderadoDni}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{fechaCorta(a.fechaReunion)}{a.horaReunion ? ` · ${a.horaReunion.slice(0, 5)}` : ''}</td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">{a.tituloReunion}</td>
                    <td className="px-6 py-4">
                      {a.asistio
                        ? <span className="px-2 py-0.5 rounded-full text-[9px] font-black border uppercase text-green-700 bg-green-50 border-green-100">Asistió</span>
                        : <span className="px-2 py-0.5 rounded-full text-[9px] font-black border uppercase text-red-700 bg-red-50 border-red-100">No asistió</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setEditando(a)} className="p-1 px-2 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded inline-flex items-center gap-1 font-semibold text-[11px]">
                          <Edit3 size={12} /> Editar
                        </button>
                        <button onClick={() => eliminar(a)} className="p-1 px-2 text-gray-400 hover:text-brand-red hover:bg-gray-50 rounded inline-flex items-center gap-1 font-semibold text-[11px]">
                          <Trash2 size={12} /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {datos && <Paginador pagina={datos.pagina} totalPaginas={datos.totalPaginas} total={datos.totalElementos} onCambiar={setPagina} />}
      </div>

      {editando && (
        <FormAsistencia
          asistencia={editando === 'nuevo' ? null : editando}
          onClose={() => setEditando(null)}
          onGuardado={(nuevo) => {
            setEditando(null);
            avisar(nuevo ? 'Asistencia registrada' : 'Asistencia actualizada');
            cargar();
          }}
        />
      )}
    </div>
  );
}

function FormAsistencia({ asistencia, onClose, onGuardado }: {
  asistencia: AsistenciaApi | null;
  onClose: () => void;
  onGuardado: (nuevo: boolean) => void;
}) {
  const [f, setF] = useState<AsistenciaRequest>({
    apoderadoId: asistencia?.apoderadoId ?? (null as unknown as number),
    tituloReunion: asistencia?.tituloReunion || '',
    fechaReunion: asistencia?.fechaReunion || new Date().toISOString().slice(0, 10),
    horaReunion: asistencia?.horaReunion ? asistencia.horaReunion.slice(0, 5) : '',
    asistio: asistencia?.asistio ?? true,
    observaciones: asistencia?.observaciones || '',
  });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const set = <K extends keyof AsistenciaRequest>(k: K, v: AsistenciaRequest[K]) => setF((p) => ({ ...p, [k]: v }));

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.apoderadoId) { setError('Elige el apoderado'); return; }
    setError('');
    setGuardando(true);
    try {
      const datos = { ...f, horaReunion: f.horaReunion || null, observaciones: f.observaciones || null };
      if (asistencia) await api.actualizarAsistencia(asistencia.id, datos);
      else await api.crearAsistencia(datos);
      onGuardado(!asistencia);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal titulo={asistencia ? 'Editar asistencia' : 'Registrar asistencia'} onClose={onClose} ancho="max-w-lg">
      <form onSubmit={enviar} className="space-y-4 text-xs font-semibold">
        <MensajeError mensaje={error} />
        <Campo etiqueta="Apoderado *">
          <SelectorApoderado valor={f.apoderadoId} onCambiar={(id) => set('apoderadoId', id as number)} requerido textoVacio="-- Elige un apoderado --" />
        </Campo>
        <Campo etiqueta="Reunión *">
          <input className={claseInput} required maxLength={255} placeholder="Ej. Reunión de padres - I Bimestre" value={f.tituloReunion}
                 onChange={(e) => set('tituloReunion', e.target.value)} />
        </Campo>
        <div className="grid grid-cols-3 gap-4">
          <Campo etiqueta="Fecha *">
            <input type="date" className={claseInput} required value={f.fechaReunion} onChange={(e) => set('fechaReunion', e.target.value)} />
          </Campo>
          <Campo etiqueta="Hora">
            <input type="time" className={claseInput} value={f.horaReunion || ''} onChange={(e) => set('horaReunion', e.target.value)} />
          </Campo>
          <Campo etiqueta="¿Asistió? *">
            <select className={claseInput} value={f.asistio ? 'si' : 'no'} onChange={(e) => set('asistio', e.target.value === 'si')}>
              <option value="si">Sí asistió</option>
              <option value="no">No asistió</option>
            </select>
          </Campo>
        </div>
        <Campo etiqueta="Observaciones">
          <textarea className={claseInput} rows={2} maxLength={500} value={f.observaciones || ''} onChange={(e) => set('observaciones', e.target.value)} />
        </Campo>
        <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className={claseBotonSecundario}>Cancelar</button>
          <button type="submit" disabled={guardando} className={claseBotonPrimario}>{guardando ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </Modal>
  );
}

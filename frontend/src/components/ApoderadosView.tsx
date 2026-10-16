import React, { useCallback, useEffect, useState } from 'react';
import { Edit3, Eye, Plus, Search, Trash2, Users } from 'lucide-react';
import { api, ApoderadoApi, ApoderadoRequest, DetalleApoderado, Pagina, PARENTESCOS } from '../api';
import FamiliaResumen from './FamiliaResumen';
import { limpiarCacheApoderados } from './SelectorApoderado';
import {
  Campo, Cargando, claseBotonPrimario, claseBotonSecundario, claseFilaTh, claseInput,
  MensajeError, Modal, Paginador, Vacio,
} from './ui';

interface Props {
  searchQuery: string;
  avisar: (mensaje: string, tipo?: 'success' | 'info' | 'error') => void;
}

export default function ApoderadosView({ searchQuery, avisar }: Props) {
  const [pagina, setPagina] = useState(0);
  const [datos, setDatos] = useState<Pagina<ApoderadoApi> | null>(null);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState<ApoderadoApi | 'nuevo' | null>(null);
  const [detalle, setDetalle] = useState<DetalleApoderado | null>(null);

  const cargar = useCallback(() => {
    setError('');
    api.apoderados({ q: searchQuery, page: pagina, size: 20 }).then(setDatos).catch((e) => setError(e.message));
  }, [searchQuery, pagina]);

  useEffect(() => { setPagina(0); }, [searchQuery]);
  useEffect(() => { cargar(); }, [cargar]);

  const verDetalle = async (a: ApoderadoApi) => {
    try {
      setDetalle(await api.detalleApoderado(a.id));
    } catch (e) {
      avisar((e as Error).message, 'error');
    }
  };

  const eliminar = async (a: ApoderadoApi) => {
    if (!window.confirm(`¿Eliminar a ${a.nombreCompleto}?\n\nTambién se eliminarán sus pagos y asistencias, y sus hijos quedarán sin apoderado.`)) return;
    try {
      await api.eliminarApoderado(a.id);
      limpiarCacheApoderados();
      avisar(`Apoderado eliminado: ${a.nombreCompleto}`, 'info');
      cargar();
    } catch (e) {
      avisar((e as Error).message, 'error');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-gray-900">Padres y apoderados</h2>
          <p className="text-xs text-gray-500 font-medium">Responsables de los estudiantes, sus pagos y su asistencia a reuniones.</p>
        </div>
        <button className={claseBotonPrimario} onClick={() => setEditando('nuevo')}>
          <Plus size={14} /> Nuevo apoderado
        </button>
      </div>

      <MensajeError mensaje={error} />

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2 text-xs text-gray-500 font-semibold">
          <Search size={14} /> {searchQuery ? <>Resultados para “{searchQuery}”</> : 'Usa el buscador de arriba para filtrar por DNI, nombre o teléfono'}
        </div>
        {!datos ? <Cargando /> : datos.contenido.length === 0 ? <Vacio texto="No se encontraron apoderados" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={claseFilaTh}>
                  <th className="px-6 py-4">Apoderado</th><th className="px-6 py-4">DNI</th><th className="px-6 py-4">Parentesco</th>
                  <th className="px-6 py-4">Teléfono</th><th className="px-6 py-4">Email</th><th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {datos.contenido.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <button onClick={() => verDetalle(a)} className="flex items-center gap-3 text-left">
                        <div className="w-8 h-8 rounded-full bg-red-50 text-brand-red flex items-center justify-center font-bold text-[10px] shrink-0">
                          {(a.nombres[0] || '') + (a.apellidos[0] || '')}
                        </div>
                        <span className="font-bold text-gray-900 hover:text-brand-red">{a.nombreCompleto}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-500">{a.dni}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md text-[10px] font-bold border border-gray-100">{a.parentesco}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{a.telefono}</td>
                    <td className="px-6 py-4 text-gray-500">{a.email || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => verDetalle(a)} className="p-1 px-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded inline-flex items-center gap-1 font-semibold text-[11px]">
                          <Eye size={12} /> Ver
                        </button>
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
        <FormApoderado
          apoderado={editando === 'nuevo' ? null : editando}
          onClose={() => setEditando(null)}
          onGuardado={(a, nuevo) => {
            setEditando(null);
            limpiarCacheApoderados();
            avisar(nuevo ? `Apoderado registrado: ${a.nombreCompleto}` : `Apoderado actualizado: ${a.nombreCompleto}`);
            cargar();
          }}
        />
      )}

      {detalle && (
        <Modal titulo={`Ficha de ${detalle.apoderado.nombreCompleto}`} onClose={() => setDetalle(null)} ancho="max-w-5xl">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-600 font-semibold">
            <span className="inline-flex items-center gap-1"><Users size={12} /> {detalle.apoderado.parentesco}</span>
            <span>DNI {detalle.apoderado.dni}</span>
            <span>Tel. {detalle.apoderado.telefono}</span>
            {detalle.apoderado.email && <span>{detalle.apoderado.email}</span>}
            {detalle.apoderado.direccion && <span>{detalle.apoderado.direccion}</span>}
          </div>
          <FamiliaResumen d={detalle} />
        </Modal>
      )}
    </div>
  );
}

function FormApoderado({ apoderado, onClose, onGuardado }: {
  apoderado: ApoderadoApi | null;
  onClose: () => void;
  onGuardado: (a: ApoderadoApi, nuevo: boolean) => void;
}) {
  const [f, setF] = useState<ApoderadoRequest>({
    dni: apoderado?.dni || '',
    nombres: apoderado?.nombres || '',
    apellidos: apoderado?.apellidos || '',
    telefono: apoderado?.telefono || '',
    email: apoderado?.email || '',
    parentesco: apoderado?.parentesco || 'MADRE',
    direccion: apoderado?.direccion || '',
  });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const set = <K extends keyof ApoderadoRequest>(k: K, v: ApoderadoRequest[K]) => setF((p) => ({ ...p, [k]: v }));

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      const datos = { ...f, email: f.email || null, direccion: f.direccion || null };
      const r = apoderado ? await api.actualizarApoderado(apoderado.id, datos) : await api.crearApoderado(datos);
      onGuardado(r, !apoderado);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal titulo={apoderado ? 'Editar apoderado' : 'Nuevo apoderado'} onClose={onClose}>
      <form onSubmit={enviar} className="space-y-4 text-xs font-semibold">
        <MensajeError mensaje={error} />
        <div className="grid grid-cols-2 gap-4">
          <Campo etiqueta="DNI *">
            <input className={`${claseInput} font-mono`} required maxLength={15} value={f.dni}
                   onChange={(e) => set('dni', e.target.value.replace(/\s/g, ''))} />
          </Campo>
          <Campo etiqueta="Parentesco *">
            <select className={claseInput} value={f.parentesco} onChange={(e) => set('parentesco', e.target.value as ApoderadoRequest['parentesco'])}>
              {PARENTESCOS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Campo>
        </div>
        <Campo etiqueta="Nombres *">
          <input className={claseInput} required maxLength={100} value={f.nombres} onChange={(e) => set('nombres', e.target.value)} />
        </Campo>
        <Campo etiqueta="Apellidos *">
          <input className={claseInput} required maxLength={100} value={f.apellidos} onChange={(e) => set('apellidos', e.target.value)} />
        </Campo>
        <div className="grid grid-cols-2 gap-4">
          <Campo etiqueta="Teléfono *">
            <input className={claseInput} required pattern="\d{6,15}" title="Solo números (6 a 15 dígitos)" value={f.telefono}
                   onChange={(e) => set('telefono', e.target.value.replace(/\D/g, ''))} />
          </Campo>
          <Campo etiqueta="Email">
            <input type="email" className={claseInput} maxLength={120} value={f.email || ''} onChange={(e) => set('email', e.target.value)} />
          </Campo>
        </div>
        <Campo etiqueta="Dirección">
          <input className={claseInput} maxLength={200} value={f.direccion || ''} onChange={(e) => set('direccion', e.target.value)} />
        </Campo>
        <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className={claseBotonSecundario}>Cancelar</button>
          <button type="submit" disabled={guardando} className={claseBotonPrimario}>{guardando ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </Modal>
  );
}

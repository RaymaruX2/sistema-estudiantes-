import React, { useCallback, useEffect, useState } from 'react';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import {
  api, ConceptoPago, ETIQUETA_CONCEPTO, ETIQUETA_ESTADO_PAGO, EstadoPago, fechaCorta, Pagina, PagoApi, PagoRequest, soles,
} from '../api';
import SelectorApoderado from './SelectorApoderado';
import {
  BadgeEstadoPago, Campo, Cargando, claseBotonPrimario, claseBotonSecundario, claseFilaTh, claseInput,
  MensajeError, Modal, Paginador, Vacio,
} from './ui';

interface Props {
  searchQuery: string;
  avisar: (mensaje: string, tipo?: 'success' | 'info' | 'error') => void;
}

const hoy = () => new Date().toISOString().slice(0, 10);

export default function PagosView({ searchQuery, avisar }: Props) {
  const [pagina, setPagina] = useState(0);
  const [estado, setEstado] = useState<EstadoPago | ''>('');
  const [datos, setDatos] = useState<Pagina<PagoApi> | null>(null);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState<PagoApi | 'nuevo' | null>(null);

  const cargar = useCallback(() => {
    setError('');
    api.pagos({ q: searchQuery, estado, page: pagina, size: 20 }).then(setDatos).catch((e) => setError(e.message));
  }, [searchQuery, estado, pagina]);

  useEffect(() => { setPagina(0); }, [searchQuery, estado]);
  useEffect(() => { cargar(); }, [cargar]);

  const eliminar = async (p: PagoApi) => {
    if (!window.confirm(`¿Eliminar el pago "${p.descripcion}" de ${p.apoderadoNombre}?`)) return;
    try {
      await api.eliminarPago(p.id);
      avisar('Pago eliminado', 'info');
      cargar();
    } catch (e) {
      avisar((e as Error).message, 'error');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-gray-900">Pagos</h2>
          <p className="text-xs text-gray-500 font-medium">Pensiones, cuotas y otros pagos de los apoderados.</p>
        </div>
        <div className="flex gap-2">
          <select className={`${claseInput} w-44`} value={estado} onChange={(e) => setEstado(e.target.value as EstadoPago | '')}>
            <option value="">Todos los estados</option>
            {(Object.keys(ETIQUETA_ESTADO_PAGO) as EstadoPago[]).map((e) => <option key={e} value={e}>{ETIQUETA_ESTADO_PAGO[e]}</option>)}
          </select>
          <button className={claseBotonPrimario} onClick={() => setEditando('nuevo')}><Plus size={14} /> Registrar pago</button>
        </div>
      </div>

      <MensajeError mensaje={error} />

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        {!datos ? <Cargando /> : datos.contenido.length === 0 ? <Vacio texto="No hay pagos que coincidan" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={claseFilaTh}>
                  <th className="px-6 py-4">Apoderado</th><th className="px-6 py-4">Fecha</th><th className="px-6 py-4">Concepto</th>
                  <th className="px-6 py-4">Descripción</th><th className="px-6 py-4 text-right">Monto</th>
                  <th className="px-6 py-4">Estado</th><th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {datos.contenido.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{p.apoderadoNombre}</p>
                      <p className="text-[10px] font-mono text-gray-400">DNI {p.apoderadoDni}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{fechaCorta(p.fechaPago)}</td>
                    <td className="px-6 py-4 font-semibold text-gray-700">{ETIQUETA_CONCEPTO[p.concepto]}</td>
                    <td className="px-6 py-4 text-gray-600">{p.descripcion}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">{soles(p.monto)}</td>
                    <td className="px-6 py-4"><BadgeEstadoPago estado={p.estado} /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setEditando(p)} className="p-1 px-2 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded inline-flex items-center gap-1 font-semibold text-[11px]">
                          <Edit3 size={12} /> Editar
                        </button>
                        <button onClick={() => eliminar(p)} className="p-1 px-2 text-gray-400 hover:text-brand-red hover:bg-gray-50 rounded inline-flex items-center gap-1 font-semibold text-[11px]">
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
        <FormPago
          pago={editando === 'nuevo' ? null : editando}
          onClose={() => setEditando(null)}
          onGuardado={(nuevo) => {
            setEditando(null);
            avisar(nuevo ? 'Pago registrado' : 'Pago actualizado');
            cargar();
          }}
        />
      )}
    </div>
  );
}

function FormPago({ pago, onClose, onGuardado }: { pago: PagoApi | null; onClose: () => void; onGuardado: (nuevo: boolean) => void }) {
  const [f, setF] = useState<PagoRequest>({
    apoderadoId: pago?.apoderadoId ?? (null as unknown as number),
    descripcion: pago?.descripcion || '',
    monto: pago?.monto ?? (undefined as unknown as number),
    fechaPago: pago?.fechaPago || hoy(),
    concepto: pago?.concepto || 'PENSION',
    estado: pago?.estado || 'PAGADO',
    comprobante: pago?.comprobante || '',
    observaciones: pago?.observaciones || '',
  });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const set = <K extends keyof PagoRequest>(k: K, v: PagoRequest[K]) => setF((p) => ({ ...p, [k]: v }));

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.apoderadoId) { setError('Elige el apoderado'); return; }
    setError('');
    setGuardando(true);
    try {
      const datos = { ...f, comprobante: f.comprobante || null, observaciones: f.observaciones || null };
      if (pago) await api.actualizarPago(pago.id, datos);
      else await api.crearPago(datos);
      onGuardado(!pago);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal titulo={pago ? 'Editar pago' : 'Registrar pago'} onClose={onClose} ancho="max-w-lg">
      <form onSubmit={enviar} className="space-y-4 text-xs font-semibold">
        <MensajeError mensaje={error} />
        <Campo etiqueta="Apoderado *">
          <SelectorApoderado valor={f.apoderadoId} onCambiar={(id) => set('apoderadoId', id as number)} requerido textoVacio="-- Elige un apoderado --" />
        </Campo>
        <Campo etiqueta="Descripción *">
          <input className={claseInput} required maxLength={255} placeholder="Ej. Pensión de marzo" value={f.descripcion}
                 onChange={(e) => set('descripcion', e.target.value)} />
        </Campo>
        <div className="grid grid-cols-3 gap-4">
          <Campo etiqueta="Monto (S/) *">
            <input type="number" className={claseInput} required min="0.01" step="0.01" value={f.monto ?? ''}
                   onChange={(e) => set('monto', e.target.value === '' ? (undefined as unknown as number) : Number(e.target.value))} />
          </Campo>
          <Campo etiqueta="Fecha *">
            <input type="date" className={claseInput} required value={f.fechaPago} onChange={(e) => set('fechaPago', e.target.value)} />
          </Campo>
          <Campo etiqueta="Estado *">
            <select className={claseInput} value={f.estado} onChange={(e) => set('estado', e.target.value as EstadoPago)}>
              {(Object.keys(ETIQUETA_ESTADO_PAGO) as EstadoPago[]).map((k) => <option key={k} value={k}>{ETIQUETA_ESTADO_PAGO[k]}</option>)}
            </select>
          </Campo>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Campo etiqueta="Concepto *">
            <select className={claseInput} value={f.concepto} onChange={(e) => set('concepto', e.target.value as ConceptoPago)}>
              {(Object.keys(ETIQUETA_CONCEPTO) as ConceptoPago[]).map((k) => <option key={k} value={k}>{ETIQUETA_CONCEPTO[k]}</option>)}
            </select>
          </Campo>
          <Campo etiqueta="N° de comprobante">
            <input className={claseInput} maxLength={100} value={f.comprobante || ''} onChange={(e) => set('comprobante', e.target.value)} />
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

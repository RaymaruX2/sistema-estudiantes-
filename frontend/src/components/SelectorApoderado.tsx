import React, { useEffect, useMemo, useState } from 'react';
import { api, ApoderadoApi } from '../api';
import { claseInput } from './ui';

let cache: ApoderadoApi[] | null = null;

export function limpiarCacheApoderados() {
  cache = null;
}

/** Selector con buscador de apoderados (por DNI o nombre). */
export default function SelectorApoderado({ valor, onCambiar, requerido = false, textoVacio = '-- Sin apoderado --' }: {
  valor: number | null;
  onCambiar: (id: number | null) => void;
  requerido?: boolean;
  textoVacio?: string;
}) {
  const [lista, setLista] = useState<ApoderadoApi[]>(cache || []);
  const [filtro, setFiltro] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (cache) return;
    api.apoderadosTodos()
      .then((l) => { cache = l; setLista(l); })
      .catch((e) => setError(e.message));
  }, []);

  const visibles = useMemo(() => {
    const t = filtro.trim().toLowerCase();
    if (!t) return lista;
    return lista.filter((a) => a.id === valor || a.dni.includes(t) || a.nombreCompleto.toLowerCase().includes(t));
  }, [lista, filtro, valor]);

  return (
    <div className="space-y-1.5">
      <input className={claseInput} placeholder="Buscar apoderado por DNI o nombre..." value={filtro}
             onChange={(e) => setFiltro(e.target.value)} />
      <select className={claseInput} required={requerido} value={valor ?? ''}
              onChange={(e) => onCambiar(e.target.value ? Number(e.target.value) : null)}>
        <option value="">{textoVacio}</option>
        {visibles.map((a) => (
          <option key={a.id} value={a.id}>{a.dni} - {a.nombreCompleto} ({a.parentesco})</option>
        ))}
      </select>
      {error && <p className="text-[10px] text-brand-red font-semibold">{error}</p>}
    </div>
  );
}

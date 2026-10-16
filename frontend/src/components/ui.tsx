import React from 'react';
import { AlertCircle, ChevronLeft, ChevronRight, Loader2, ServerOff } from 'lucide-react';

// Clases reutilizadas para que todo se vea igual al diseño original
export const claseInput =
  'w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-all font-medium';
export const claseBotonPrimario =
  'bg-brand-red hover:bg-brand-red-hover text-white font-bold py-2 px-4 rounded-lg shadow-sm text-xs inline-flex items-center justify-center gap-1.5 disabled:opacity-60';
export const claseBotonSecundario =
  'bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 py-2 px-4 rounded-lg text-xs inline-flex items-center justify-center gap-1.5';
export const claseTh = 'px-6 py-4';
export const claseFilaTh = 'bg-gray-50 text-[10px] uppercase tracking-wider text-gray-400 font-black border-b border-gray-100';

export function Modal({ titulo, onClose, children, ancho = 'max-w-md' }: {
  titulo: string;
  onClose: () => void;
  children: React.ReactNode;
  ancho?: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`bg-white rounded-xl shadow-2xl border border-gray-100 ${ancho} w-full p-6 space-y-4 max-h-[92vh] overflow-y-auto font-sans`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="font-extrabold text-sm text-gray-900">{titulo}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-50 rounded-lg text-gray-400 select-none" aria-label="Cerrar">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Campo({ etiqueta, children, className = '' }: { etiqueta: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-[10px] text-gray-400 uppercase tracking-widest block font-semibold">{etiqueta}</label>
      {children}
    </div>
  );
}

export function MensajeError({ mensaje }: { mensaje: string }) {
  if (!mensaje) return null;
  return (
    <div className="bg-red-50 border border-red-100 p-3 rounded-lg flex items-start gap-2.5 text-xs text-brand-red">
      <span className="mt-0.5 shrink-0"><AlertCircle size={14} /></span>
      <p className="font-semibold leading-normal">{mensaje}</p>
    </div>
  );
}

export function Cargando({ texto = 'Cargando...' }: { texto?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-xs text-gray-400 font-semibold">
      <Loader2 size={16} className="animate-spin" /> {texto}
    </div>
  );
}

export function Vacio({ texto }: { texto: string }) {
  return <div className="text-center py-12 text-xs text-gray-400 font-semibold">{texto}</div>;
}

export function Paginador({ pagina, totalPaginas, total, onCambiar }: {
  pagina: number;
  totalPaginas: number;
  total: number;
  onCambiar: (p: number) => void;
}) {
  if (totalPaginas <= 1) {
    return <div className="px-6 py-3 border-t border-gray-100 text-[11px] text-gray-400 font-semibold">{total} registro(s)</div>;
  }
  return (
    <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-semibold">
      <button disabled={pagina === 0} onClick={() => onCambiar(pagina - 1)} className="inline-flex items-center gap-1 disabled:opacity-40 hover:text-brand-red">
        <ChevronLeft size={14} /> Anterior
      </button>
      <span>Página {pagina + 1} de {totalPaginas} · {total} registros</span>
      <button disabled={pagina + 1 >= totalPaginas} onClick={() => onCambiar(pagina + 1)} className="inline-flex items-center gap-1 disabled:opacity-40 hover:text-brand-red">
        Siguiente <ChevronRight size={14} />
      </button>
    </div>
  );
}

/** Aviso que se muestra en las pantallas que necesitan el servidor cuando la app está en modo demostración. */
export function RequiereServidor({ modulo }: { modulo: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-10 max-w-xl mx-auto text-center space-y-3 shadow-xs">
      <div className="mx-auto w-12 h-12 rounded-full bg-red-50 text-brand-red flex items-center justify-center">
        <ServerOff size={22} />
      </div>
      <h3 className="font-extrabold text-gray-900">{modulo} necesita el servidor</h3>
      <p className="text-xs text-gray-500 leading-relaxed">
        Estás en <strong>modo demostración</strong>. Esta sección guarda información real (padres, pagos, asistencias, cuentas)
        y se activa cuando el frontend se conecta al backend configurando la variable <code className="bg-gray-100 px-1 rounded">VITE_API_URL</code>.
      </p>
    </div>
  );
}

export function BadgeEstadoPago({ estado }: { estado: 'PAGADO' | 'PENDIENTE' | 'ATRASADO' }) {
  const estilos = {
    PAGADO: 'text-green-700 bg-green-50 border-green-100',
    PENDIENTE: 'text-amber-700 bg-amber-50 border-amber-100',
    ATRASADO: 'text-red-700 bg-red-50 border-red-100',
  }[estado];
  const texto = { PAGADO: 'Pagado', PENDIENTE: 'Pendiente', ATRASADO: 'Atrasado' }[estado];
  return <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${estilos}`}>{texto}</span>;
}

export function Tarjeta({ titulo, valor, detalle, destacado = false, icono }: {
  titulo: string;
  valor: React.ReactNode;
  detalle?: React.ReactNode;
  destacado?: boolean;
  icono?: React.ReactNode;
}) {
  return (
    <div className={`p-5 rounded-xl shadow-xs border ${destacado ? 'bg-brand-red text-white border-brand-red' : 'bg-white border-gray-200'}`}>
      <div className="flex justify-between items-start">
        <p className={`text-[10px] font-bold uppercase tracking-wider ${destacado ? 'text-red-100' : 'text-gray-400'}`}>{titulo}</p>
        {icono && <span className={destacado ? 'text-red-100' : 'text-brand-red'}>{icono}</span>}
      </div>
      <p className={`text-2xl font-black mt-1 ${destacado ? '' : 'text-gray-950'}`}>{valor}</p>
      {detalle && <p className={`text-[11px] mt-1 font-semibold ${destacado ? 'text-red-100' : 'text-gray-400'}`}>{detalle}</p>}
    </div>
  );
}

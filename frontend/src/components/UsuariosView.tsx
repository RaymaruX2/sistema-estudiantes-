import React, { useEffect, useState } from 'react';
import { CheckCircle2, Edit3, Plus, Trash2 } from 'lucide-react';
import { api, Rol, UsuarioApi, UsuarioRequest } from '../api';
import SelectorApoderado from './SelectorApoderado';
import {
  Campo, Cargando, claseBotonPrimario, claseBotonSecundario, claseFilaTh, claseInput, MensajeError, Modal, Vacio,
} from './ui';

interface Props {
  usuarioActual: UsuarioApi;
  avisar: (mensaje: string, tipo?: 'success' | 'info' | 'error') => void;
}

const ESTILO_ROL: Record<Rol, string> = {
  ADMIN: 'text-brand-red bg-red-50 border-red-100',
  SECRETARIA: 'text-blue-700 bg-blue-50 border-blue-100',
  PADRE: 'text-green-700 bg-green-50 border-green-100',
};

export default function UsuariosView({ usuarioActual, avisar }: Props) {
  const [lista, setLista] = useState<UsuarioApi[] | null>(null);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState<UsuarioApi | 'nuevo' | null>(null);

  const cargar = () => {
    setError('');
    api.usuarios().then(setLista).catch((e) => setError(e.message));
  };
  useEffect(cargar, []);

  const aprobar = async (u: UsuarioApi) => {
    try {
      await api.aprobarUsuario(u.id);
      avisar(`Cuenta de ${u.username} aprobada`);
      cargar();
    } catch (e) {
      avisar((e as Error).message, 'error');
    }
  };

  const eliminar = async (u: UsuarioApi) => {
    if (!window.confirm(`¿Eliminar la cuenta de ${u.nombreCompleto} (${u.username})?`)) return;
    try {
      await api.eliminarUsuario(u.id);
      avisar('Usuario eliminado', 'info');
      cargar();
    } catch (e) {
      avisar((e as Error).message, 'error');
    }
  };

  const pendientes = lista?.filter((u) => !u.activo).length || 0;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-gray-900">Usuarios del sistema</h2>
          <p className="text-xs text-gray-500 font-medium">Cuentas del personal y de los padres. Solo administradores.</p>
        </div>
        <button className={claseBotonPrimario} onClick={() => setEditando('nuevo')}><Plus size={14} /> Nuevo usuario</button>
      </div>

      {pendientes > 0 && (
        <div className="bg-amber-50 border border-amber-100 text-amber-800 text-xs font-semibold rounded-lg p-3">
          Hay {pendientes} cuenta(s) esperando aprobación.
        </div>
      )}
      <MensajeError mensaje={error} />

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        {!lista ? <Cargando /> : lista.length === 0 ? <Vacio texto="Sin usuarios" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={claseFilaTh}>
                  <th className="px-6 py-4">Usuario</th><th className="px-6 py-4">Nombre</th><th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Rol</th><th className="px-6 py-4">Estado</th><th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {lista.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 font-mono">{u.username}</td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">
                      {u.nombreCompleto}
                      {u.apoderadoNombre && <p className="text-[10px] text-gray-400 font-medium">Apoderado: {u.apoderadoNombre}</p>}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{u.email || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${ESTILO_ROL[u.rol]}`}>{u.rol}</span>
                    </td>
                    <td className="px-6 py-4">
                      {u.activo
                        ? <span className="text-green-700 font-bold">Activo</span>
                        : <span className="px-2 py-0.5 rounded-full text-[9px] font-black border uppercase text-amber-700 bg-amber-50 border-amber-100">Pendiente</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        {!u.activo && (
                          <button onClick={() => aprobar(u)} className="p-1 px-2 text-green-700 hover:bg-green-50 rounded inline-flex items-center gap-1 font-bold text-[11px]">
                            <CheckCircle2 size={12} /> Aprobar
                          </button>
                        )}
                        <button onClick={() => setEditando(u)} className="p-1 px-2 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded inline-flex items-center gap-1 font-semibold text-[11px]">
                          <Edit3 size={12} /> Editar
                        </button>
                        {u.id !== usuarioActual.id && (
                          <button onClick={() => eliminar(u)} className="p-1 px-2 text-gray-400 hover:text-brand-red hover:bg-gray-50 rounded inline-flex items-center gap-1 font-semibold text-[11px]">
                            <Trash2 size={12} /> Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editando && (
        <FormUsuario
          usuario={editando === 'nuevo' ? null : editando}
          onClose={() => setEditando(null)}
          onGuardado={(nuevo) => {
            setEditando(null);
            avisar(nuevo ? 'Usuario creado' : 'Usuario actualizado');
            cargar();
          }}
        />
      )}
    </div>
  );
}

function FormUsuario({ usuario, onClose, onGuardado }: { usuario: UsuarioApi | null; onClose: () => void; onGuardado: (nuevo: boolean) => void }) {
  const [f, setF] = useState<UsuarioRequest>({
    username: usuario?.username || '',
    nombreCompleto: usuario?.nombreCompleto || '',
    email: usuario?.email || '',
    rol: usuario?.rol || 'SECRETARIA',
    activo: usuario?.activo ?? true,
    password: '',
    apoderadoId: usuario?.apoderadoId ?? null,
  });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const set = <K extends keyof UsuarioRequest>(k: K, v: UsuarioRequest[K]) => setF((p) => ({ ...p, [k]: v }));

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      const datos: UsuarioRequest = {
        ...f,
        email: f.email || null,
        password: f.password || undefined,
        apoderadoId: f.rol === 'PADRE' ? f.apoderadoId : null,
      };
      if (usuario) await api.actualizarUsuario(usuario.id, datos);
      else await api.crearUsuario(datos);
      onGuardado(!usuario);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal titulo={usuario ? 'Editar usuario' : 'Nuevo usuario'} onClose={onClose}>
      <form onSubmit={enviar} className="space-y-4 text-xs font-semibold">
        <MensajeError mensaje={error} />
        <div className="grid grid-cols-2 gap-4">
          <Campo etiqueta="Usuario *">
            <input className={`${claseInput} font-mono`} required maxLength={60} readOnly={!!usuario} value={f.username}
                   onChange={(e) => set('username', e.target.value.trim())} />
          </Campo>
          <Campo etiqueta="Rol *">
            <select className={claseInput} value={f.rol} onChange={(e) => set('rol', e.target.value as Rol)}>
              <option value="ADMIN">ADMIN</option>
              <option value="SECRETARIA">SECRETARIA</option>
              <option value="PADRE">PADRE</option>
            </select>
          </Campo>
        </div>
        <Campo etiqueta="Nombre completo *">
          <input className={claseInput} required maxLength={150} value={f.nombreCompleto} onChange={(e) => set('nombreCompleto', e.target.value)} />
        </Campo>
        <Campo etiqueta="Email">
          <input type="email" className={claseInput} maxLength={120} value={f.email || ''} onChange={(e) => set('email', e.target.value)} />
        </Campo>
        {f.rol === 'PADRE' && (
          <Campo etiqueta="Apoderado vinculado *">
            <SelectorApoderado valor={f.apoderadoId} onCambiar={(id) => set('apoderadoId', id)} requerido textoVacio="-- Elige el apoderado --" />
          </Campo>
        )}
        <Campo etiqueta={usuario ? 'Nueva contraseña (vacío = no cambiar)' : 'Contraseña * (mínimo 8 caracteres)'}>
          <input type="password" className={claseInput} required={!usuario} minLength={8} autoComplete="new-password"
                 value={f.password || ''} onChange={(e) => set('password', e.target.value)} />
        </Campo>
        <label className="flex items-center gap-2 text-gray-700">
          <input type="checkbox" checked={f.activo} onChange={(e) => set('activo', e.target.checked)} /> Cuenta activa
        </label>
        <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className={claseBotonSecundario}>Cancelar</button>
          <button type="submit" disabled={guardando} className={claseBotonPrimario}>{guardando ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </Modal>
  );
}

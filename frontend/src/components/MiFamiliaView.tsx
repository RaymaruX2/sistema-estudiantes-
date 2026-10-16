import React, { useEffect, useState } from 'react';
import { api, DetalleApoderado, UsuarioApi } from '../api';
import FamiliaResumen from './FamiliaResumen';
import { Cargando, MensajeError } from './ui';

/** Portal del padre: sus hijos, sus pagos y su asistencia a reuniones. */
export default function MiFamiliaView({ usuario }: { usuario: UsuarioApi }) {
  const [d, setD] = useState<DetalleApoderado | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.miFamilia().then(setD).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-lg font-black text-gray-900">Hola, {usuario.nombreCompleto}</h2>
        <p className="text-xs text-gray-500 font-medium">
          Aquí puedes ver a tus hijos, el estado de tus pagos y tu asistencia a las reuniones del colegio.
        </p>
      </div>
      <MensajeError mensaje={error} />
      {!d && !error && <Cargando />}
      {d && <FamiliaResumen d={d} />}
    </div>
  );
}

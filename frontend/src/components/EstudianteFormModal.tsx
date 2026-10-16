import React, { useState } from 'react';
import { api, CARRERAS_TECNICAS, EstudianteApi, EstudianteRequest, GRADOS, NivelApi, SECCIONES } from '../api';
import SelectorApoderado from './SelectorApoderado';
import { Campo, claseBotonPrimario, claseBotonSecundario, claseInput, MensajeError, Modal } from './ui';

/** Formulario completo de matrícula / edición conectado al servidor. */
export default function EstudianteFormModal({ estudiante, nivelInicial, gradoInicial, onClose, onGuardado }: {
  estudiante: EstudianteApi | null;
  nivelInicial: NivelApi;
  gradoInicial?: string;
  onClose: () => void;
  onGuardado: (e: EstudianteApi, nuevo: boolean) => void;
}) {
  const [f, setF] = useState<EstudianteRequest>(() => estudiante ? {
    codigoEstudiante: estudiante.codigoEstudiante,
    tipoDocumento: estudiante.tipoDocumento,
    numeroDocumento: estudiante.numeroDocumento,
    apellidoPaterno: estudiante.apellidoPaterno,
    apellidoMaterno: estudiante.apellidoMaterno,
    nombres: estudiante.nombres,
    sexo: estudiante.sexo,
    fechaNacimiento: estudiante.fechaNacimiento,
    telefono: estudiante.telefono,
    direccion: estudiante.direccion,
    nivel: estudiante.nivel,
    grado: estudiante.grado,
    seccion: estudiante.seccion,
    anioCursado: estudiante.anioCursado,
    estadoMatricula: estudiante.estadoMatricula,
    carreraTecnica: estudiante.carreraTecnica,
    promocion: estudiante.promocion,
    apoderadoId: estudiante.apoderadoId,
  } : {
    codigoEstudiante: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    nombres: '',
    sexo: 'M',
    fechaNacimiento: '',
    telefono: '',
    direccion: '',
    nivel: nivelInicial,
    grado: nivelInicial === 'EGRESADO' ? 'EGRESADO' : (gradoInicial || GRADOS[nivelInicial][0].valor),
    seccion: nivelInicial === 'EGRESADO' ? '-' : 'A',
    anioCursado: new Date().getFullYear(),
    estadoMatricula: 'DEFINITIVA',
    carreraTecnica: '',
    promocion: '',
    apoderadoId: null,
  });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const set = <K extends keyof EstudianteRequest>(k: K, v: EstudianteRequest[K]) => setF((p) => ({ ...p, [k]: v }));

  const cambiarNivel = (nivel: NivelApi) => {
    setF((p) => ({
      ...p,
      nivel,
      grado: nivel === 'EGRESADO' ? 'EGRESADO' : GRADOS[nivel][0].valor,
      seccion: nivel === 'EGRESADO' ? '-' : (p.seccion === '-' ? 'A' : p.seccion),
    }));
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      const datos: EstudianteRequest = {
        ...f,
        codigoEstudiante: f.codigoEstudiante || null,
        telefono: f.telefono || null,
        direccion: f.direccion || null,
        carreraTecnica: f.carreraTecnica || null,
        promocion: f.promocion || null,
      };
      const r = estudiante ? await api.actualizarEstudiante(estudiante.id, datos) : await api.crearEstudiante(datos);
      onGuardado(r, !estudiante);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGuardando(false);
    }
  };

  const conCarrera = f.nivel === 'SECUNDARIA' || f.nivel === 'EGRESADO';

  return (
    <Modal titulo={estudiante ? 'Editar Expediente Académico' : 'Inscripción / Matrícula Nueva'} onClose={onClose} ancho="max-w-2xl">
      <form onSubmit={enviar} className="space-y-4 text-xs font-semibold">
        <MensajeError mensaje={error} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Campo etiqueta="Apellido paterno *">
            <input className={claseInput} required maxLength={60} value={f.apellidoPaterno} onChange={(e) => set('apellidoPaterno', e.target.value)} />
          </Campo>
          <Campo etiqueta="Apellido materno *">
            <input className={claseInput} required maxLength={60} value={f.apellidoMaterno} onChange={(e) => set('apellidoMaterno', e.target.value)} />
          </Campo>
          <Campo etiqueta="Nombres *">
            <input className={claseInput} required maxLength={120} value={f.nombres} onChange={(e) => set('nombres', e.target.value)} />
          </Campo>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Campo etiqueta="Tipo doc.">
            <select className={claseInput} value={f.tipoDocumento} onChange={(e) => set('tipoDocumento', e.target.value as EstudianteRequest['tipoDocumento'])}>
              <option value="DNI">DNI</option>
              <option value="CARNET_EXTRANJERIA">Carné ext.</option>
              <option value="PASAPORTE">Pasaporte</option>
            </select>
          </Campo>
          <Campo etiqueta="N° documento *">
            <input className={`${claseInput} font-mono`} required maxLength={15} value={f.numeroDocumento}
                   onChange={(e) => set('numeroDocumento', f.tipoDocumento === 'DNI' ? e.target.value.replace(/\D/g, '') : e.target.value)} />
          </Campo>
          <Campo etiqueta="Sexo *">
            <select className={claseInput} value={f.sexo} onChange={(e) => set('sexo', e.target.value as 'M' | 'F')}>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </Campo>
          <Campo etiqueta="Nacimiento *">
            <input type="date" className={claseInput} required value={f.fechaNacimiento}
                   max={new Date().toISOString().slice(0, 10)} onChange={(e) => set('fechaNacimiento', e.target.value)} />
          </Campo>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Campo etiqueta="Nivel *">
            <select className={claseInput} value={f.nivel} onChange={(e) => cambiarNivel(e.target.value as NivelApi)}>
              <option value="INICIAL">Inicial</option>
              <option value="PRIMARIA">Primaria</option>
              <option value="SECUNDARIA">Secundaria</option>
              <option value="EGRESADO">Egresado</option>
            </select>
          </Campo>
          {f.nivel !== 'EGRESADO' ? (
            <>
              <Campo etiqueta="Grado *">
                <select className={claseInput} value={f.grado} onChange={(e) => set('grado', e.target.value)}>
                  {GRADOS[f.nivel].map((g) => <option key={g.valor} value={g.valor}>{g.etiqueta}</option>)}
                </select>
              </Campo>
              <Campo etiqueta="Sección *">
                <select className={claseInput} value={f.seccion} onChange={(e) => set('seccion', e.target.value)}>
                  {SECCIONES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Campo>
              <Campo etiqueta="Estado matrícula">
                <select className={claseInput} value={f.estadoMatricula} onChange={(e) => set('estadoMatricula', e.target.value as EstudianteRequest['estadoMatricula'])}>
                  <option value="DEFINITIVA">Definitiva</option>
                  <option value="PROVISIONAL">Provisional</option>
                  <option value="RETIRADO">Retirado</option>
                  <option value="TRASLADADO">Trasladado</option>
                </select>
              </Campo>
            </>
          ) : (
            <>
              <Campo etiqueta="Año de egreso *">
                <input type="number" className={claseInput} required min={1950} max={2100} value={f.anioCursado}
                       onChange={(e) => set('anioCursado', Number(e.target.value))} />
              </Campo>
              <Campo etiqueta="Promoción" className="col-span-2">
                <input className={claseInput} maxLength={60} value={f.promocion || ''} onChange={(e) => set('promocion', e.target.value)} />
              </Campo>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {f.nivel !== 'EGRESADO' && (
            <Campo etiqueta="Año escolar *">
              <input type="number" className={claseInput} required min={2000} max={2100} value={f.anioCursado}
                     onChange={(e) => set('anioCursado', Number(e.target.value))} />
            </Campo>
          )}
          <Campo etiqueta="Código de estudiante">
            <input className={`${claseInput} font-mono`} maxLength={20} value={f.codigoEstudiante || ''} onChange={(e) => set('codigoEstudiante', e.target.value)} />
          </Campo>
          {conCarrera && (
            <Campo etiqueta="Carrera técnica">
              <select className={claseInput} value={f.carreraTecnica || ''} onChange={(e) => set('carreraTecnica', e.target.value)}>
                <option value="">-- Ninguna --</option>
                {CARRERAS_TECNICAS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Campo>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo etiqueta="Teléfono">
            <input className={claseInput} maxLength={20} value={f.telefono || ''} onChange={(e) => set('telefono', e.target.value)} />
          </Campo>
          <Campo etiqueta="Dirección">
            <input className={claseInput} maxLength={200} value={f.direccion || ''} onChange={(e) => set('direccion', e.target.value)} />
          </Campo>
        </div>

        <Campo etiqueta="Apoderado responsable">
          <SelectorApoderado valor={f.apoderadoId} onCambiar={(id) => set('apoderadoId', id)} />
        </Campo>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className={claseBotonSecundario}>Cancelar</button>
          <button type="submit" disabled={guardando} className={claseBotonPrimario}>
            {guardando ? 'Guardando...' : estudiante ? 'Guardar Cambios' : 'Matricular Estudiante'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

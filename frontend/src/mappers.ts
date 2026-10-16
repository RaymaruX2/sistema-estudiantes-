import { EstudianteApi, GRADOS } from './api';
import { Student } from './types';

const NIVEL: Record<EstudianteApi['nivel'], Student['level']> = {
  INICIAL: 'Inicial', PRIMARIA: 'Primaria', SECUNDARIA: 'Secundaria', EGRESADO: 'Egresado',
};

const ESTADO: Record<EstudianteApi['estadoMatricula'], Student['status']> = {
  DEFINITIVA: 'ACTIVO', PROVISIONAL: 'PENDIENTE', RETIRADO: 'FINALIZADO', TRASLADADO: 'FINALIZADO',
};

function titulo(s: string) {
  return s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

/** Texto de grado que usan las pantallas: "3 Años", "4° Primaria - B", "5° - A", "Egresado". */
export function textoGrado(e: Pick<EstudianteApi, 'nivel' | 'grado' | 'seccion'>): string {
  if (e.nivel === 'EGRESADO') return 'Egresado';
  const lista = GRADOS[e.nivel];
  const idx = lista.findIndex((g) => g.valor === e.grado);
  if (e.nivel === 'INICIAL') return idx >= 0 ? lista[idx].etiqueta : e.grado;
  const num = idx >= 0 ? `${idx + 1}°` : e.grado;
  return e.nivel === 'PRIMARIA' ? `${num} Primaria - ${e.seccion}` : `${num} - ${e.seccion}`;
}

/** Convierte un estudiante del backend al formato que usan las vistas existentes. */
export function aStudent(e: EstudianteApi): Student {
  const [a, m, d] = (e.fechaNacimiento || '').split('-');
  return {
    id: e.codigoEstudiante || `FE3-${String(e.id).padStart(4, '0')}`,
    backendId: e.id,
    raw: e,
    fullName: titulo(`${e.apellidoPaterno} ${e.apellidoMaterno}, ${e.nombres}`),
    dni: e.numeroDocumento,
    level: NIVEL[e.nivel],
    grade: textoGrado(e),
    status: e.nivel === 'EGRESADO' ? 'FINALIZADO' : ESTADO[e.estadoMatricula],
    birthDate: d ? `${d}/${m}/${a}` : undefined,
    technicalCareer: e.carreraTecnica || undefined,
    gradYear: e.nivel === 'EGRESADO' ? e.anioCursado : undefined,
  };
}

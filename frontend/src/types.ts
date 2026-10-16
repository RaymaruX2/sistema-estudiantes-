import type { EstudianteApi } from './api';

export type LevelType = 'inicial-3' | 'inicial-4' | 'inicial-5' | 'primaria' | 'secundaria' | 'egresados';

export type ActiveTab = 'dashboard' | LevelType | 'ayuda' | 'login' | 'register'
  | 'apoderados' | 'pagos' | 'asistencias' | 'usuarios' | 'mi-familia';

export interface Student {
  id: string;
  fullName: string;
  dni: string;
  level: 'Inicial' | 'Primaria' | 'Secundaria' | 'Egresado';
  grade: string; // e.g., '3 años', '4 años', '5 años', '4° Primaria - B', '5° - A'
  status: 'ACTIVO' | 'PENDIENTE' | 'FINALIZADO' | 'REVISION';
  email?: string;
  birthDate?: string;
  technicalCareer?: string; // e.g. 'Computación', 'Contabilidad', 'Electrónica', 'Diseño Ind.', 'Gastronomía'
  gradYear?: number;
  /** Id real en la base de datos (solo cuando hay servidor conectado) */
  backendId?: number;
  /** Datos completos del backend */
  raw?: EstudianteApi;
}

export interface ActivityItem {
  id: string;
  type: 'nota' | 'inscripcion' | 'alerta' | 'boletin' | 'reunion';
  title: string;
  subtitle: string;
  time: string;
}

export interface CalendarEvent {
  id: string;
  month: string;
  day: string;
  title: string;
  location: string;
  time: string;
}

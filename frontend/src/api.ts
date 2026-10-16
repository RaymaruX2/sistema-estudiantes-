// Cliente de la API REST del backend (Spring Boot).
// Si VITE_API_URL no está configurada, la app funciona en "modo demostración" con datos de ejemplo.

export const API_URL: string = ((import.meta.env.VITE_API_URL as string | undefined) || '').trim().replace(/\/+$/, '');
export const MODO_DEMO = API_URL === '';

// ------------------------------------------------------------------ tipos

export type Rol = 'ADMIN' | 'SECRETARIA' | 'PADRE';
export type NivelApi = 'INICIAL' | 'PRIMARIA' | 'SECUNDARIA' | 'EGRESADO';
export type EstadoMatricula = 'DEFINITIVA' | 'PROVISIONAL' | 'RETIRADO' | 'TRASLADADO';
export type EstadoPago = 'PAGADO' | 'PENDIENTE' | 'ATRASADO';
export type ConceptoPago = 'PENSION' | 'CUOTA_EXTRA' | 'UNIFORME' | 'MATERIALES' | 'OTRO';
export type Parentesco = 'MADRE' | 'PADRE' | 'TUTOR' | 'ABUELO' | 'ABUELA' | 'TIO' | 'TIA' | 'OTRO';

export interface Pagina<T> {
  contenido: T[];
  pagina: number;
  tamanio: number;
  totalElementos: number;
  totalPaginas: number;
}

export interface UsuarioApi {
  id: number;
  username: string;
  nombreCompleto: string;
  email: string | null;
  rol: Rol;
  activo: boolean;
  apoderadoId: number | null;
  apoderadoNombre: string | null;
  creadoEn: string | null;
}

export interface EstudianteApi {
  id: number;
  codigoEstudiante: string | null;
  tipoDocumento: 'DNI' | 'CARNET_EXTRANJERIA' | 'PASAPORTE';
  numeroDocumento: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  nombreCompleto: string;
  sexo: 'M' | 'F';
  fechaNacimiento: string;
  edad: number;
  telefono: string | null;
  direccion: string | null;
  nivel: NivelApi;
  grado: string;
  seccion: string;
  anioCursado: number;
  estadoMatricula: EstadoMatricula;
  carreraTecnica: string | null;
  promocion: string | null;
  apoderadoId: number | null;
  apoderadoNombre: string | null;
  apoderadoTelefono: string | null;
}

export type EstudianteRequest = Omit<EstudianteApi,
  'id' | 'nombreCompleto' | 'edad' | 'apoderadoNombre' | 'apoderadoTelefono'>;

export interface ApoderadoApi {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  telefono: string;
  email: string | null;
  parentesco: Parentesco;
  direccion: string | null;
}

export type ApoderadoRequest = Omit<ApoderadoApi, 'id' | 'nombreCompleto'>;

export interface PagoApi {
  id: number;
  apoderadoId: number;
  apoderadoNombre: string;
  apoderadoDni: string;
  descripcion: string;
  monto: number;
  fechaPago: string;
  concepto: ConceptoPago;
  estado: EstadoPago;
  comprobante: string | null;
  observaciones: string | null;
}

export type PagoRequest = Omit<PagoApi, 'id' | 'apoderadoNombre' | 'apoderadoDni'>;

export interface AsistenciaApi {
  id: number;
  apoderadoId: number;
  apoderadoNombre: string;
  apoderadoDni: string;
  tituloReunion: string;
  fechaReunion: string;
  horaReunion: string | null;
  asistio: boolean;
  observaciones: string | null;
}

export type AsistenciaRequest = Omit<AsistenciaApi, 'id' | 'apoderadoNombre' | 'apoderadoDni'>;

export interface DetalleApoderado {
  apoderado: ApoderadoApi;
  hijos: EstudianteApi[];
  pagos: PagoApi[];
  asistencias: AsistenciaApi[];
  totalPagado: number;
  totalPendiente: number;
  reunionesAsistidas: number;
  reunionesTotales: number;
  porcentajeAsistencia: number;
}

export interface Resumen {
  INICIAL: number;
  PRIMARIA: number;
  SECUNDARIA: number;
  EGRESADO: number;
  TOTAL: number;
  APODERADOS: number;
  USUARIOS_PENDIENTES: number;
}

export interface Sesion {
  token: string;
  expiraEnSegundos: number;
  usuario: UsuarioApi;
}

export interface SolicitudRegistro {
  tipo: 'PADRE' | 'PERSONAL';
  nombreCompleto: string;
  dni?: string;
  username?: string;
  email?: string;
  password: string;
  confirmarPassword: string;
}

export interface UsuarioRequest {
  username: string;
  nombreCompleto: string;
  email: string | null;
  rol: Rol;
  activo: boolean;
  password?: string;
  apoderadoId: number | null;
}

// ------------------------------------------------------------- etiquetas

export const ETIQUETA_CONCEPTO: Record<ConceptoPago, string> = {
  PENSION: 'Pensión', CUOTA_EXTRA: 'Cuota Extra', UNIFORME: 'Uniforme', MATERIALES: 'Materiales', OTRO: 'Otro',
};
export const ETIQUETA_ESTADO_PAGO: Record<EstadoPago, string> = {
  PAGADO: 'Pagado', PENDIENTE: 'Pendiente', ATRASADO: 'Atrasado',
};
export const PARENTESCOS: Parentesco[] = ['MADRE', 'PADRE', 'TUTOR', 'ABUELO', 'ABUELA', 'TIO', 'TIA', 'OTRO'];
export const GRADOS: Record<Exclude<NivelApi, 'EGRESADO'>, { valor: string; etiqueta: string }[]> = {
  INICIAL: [
    { valor: 'GRUPO_3_ANIOS', etiqueta: '3 Años' },
    { valor: 'GRUPO_4_ANIOS', etiqueta: '4 Años' },
    { valor: 'GRUPO_5_ANIOS', etiqueta: '5 Años' },
  ],
  PRIMARIA: ['PRIMERO', 'SEGUNDO', 'TERCERO', 'CUARTO', 'QUINTO', 'SEXTO']
    .map((g, i) => ({ valor: g, etiqueta: `${i + 1}° Primaria` })),
  SECUNDARIA: ['PRIMERO', 'SEGUNDO', 'TERCERO', 'CUARTO', 'QUINTO']
    .map((g, i) => ({ valor: g, etiqueta: `${i + 1}° Secundaria` })),
};
export const SECCIONES = ['A', 'B', 'C', 'D', 'E'];
export const CARRERAS_TECNICAS = [
  'Computación e Informática', 'Contabilidad', 'Electrónica Industrial', 'Gastronomía',
  'Mecánica Automotriz', 'Diseño Industrial', 'Confección Textil', 'Carpintería',
];

export function soles(n: number | null | undefined): string {
  return 'S/ ' + Number(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fechaCorta(iso: string | null | undefined): string {
  if (!iso) return '—';
  const [a, m, d] = iso.split('-');
  return d && m && a ? `${d}/${m}/${a}` : iso;
}

// ----------------------------------------------------------------- sesión

const CLAVE_TOKEN = 'feya3.token';
let token: string | null = leerToken();
let alExpirarSesion: (() => void) | null = null;

function leerToken(): string | null {
  try {
    return localStorage.getItem(CLAVE_TOKEN);
  } catch {
    return null;
  }
}

function guardarToken(t: string | null) {
  token = t;
  try {
    if (t) localStorage.setItem(CLAVE_TOKEN, t);
    else localStorage.removeItem(CLAVE_TOKEN);
  } catch {
    /* almacenamiento no disponible: la sesión dura mientras la pestaña esté abierta */
  }
}

export function hayToken() {
  return !!token;
}

export function onSesionExpirada(cb: () => void) {
  alExpirarSesion = cb;
}

// ------------------------------------------------------------- peticiones

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function pedir<T>(metodo: string, ruta: string, cuerpo?: unknown): Promise<T> {
  if (MODO_DEMO) throw new ApiError('No hay servidor configurado (modo demostración)', 0);
  let res: Response;
  try {
    res = await fetch(API_URL + '/api' + ruta, {
      method: metodo,
      headers: {
        ...(cuerpo !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
      },
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. Revisa tu conexión o intenta más tarde.', 0);
  }
  if (res.status === 204) return undefined as T;
  const datos = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401 && token && !ruta.startsWith('/auth/login')) {
      guardarToken(null);
      alExpirarSesion?.();
    }
    throw new ApiError((datos && datos.error) || `Error ${res.status}`, res.status);
  }
  return datos as T;
}

const qs = (params: Record<string, string | number | undefined | null>) => {
  const p = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  return p.length ? '?' + p.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&') : '';
};

export const api = {
  // auth
  async login(usuario: string, password: string): Promise<Sesion> {
    const s = await pedir<Sesion>('POST', '/auth/login', { usuario, password });
    guardarToken(s.token);
    return s;
  },
  logout() {
    guardarToken(null);
  },
  yo: () => pedir<UsuarioApi>('GET', '/auth/yo'),
  registro: (s: SolicitudRegistro) =>
    pedir<{ mensaje: string; pendiente: boolean; usuario: UsuarioApi }>('POST', '/auth/registro', s),

  // estudiantes
  resumen: () => pedir<Resumen>('GET', '/resumen'),
  estudiantes: (p: { q?: string; nivel?: NivelApi; page?: number; size?: number } = {}) =>
    pedir<Pagina<EstudianteApi>>('GET', '/estudiantes' + qs(p)),
  async todosLosEstudiantes(): Promise<EstudianteApi[]> {
    const todos: EstudianteApi[] = [];
    for (let page = 0; page < 100; page++) {
      const p = await api.estudiantes({ page, size: 500 });
      todos.push(...p.contenido);
      if (page + 1 >= p.totalPaginas) break;
    }
    return todos;
  },
  crearEstudiante: (e: EstudianteRequest) => pedir<EstudianteApi>('POST', '/estudiantes', e),
  actualizarEstudiante: (id: number, e: EstudianteRequest) => pedir<EstudianteApi>('PUT', `/estudiantes/${id}`, e),
  eliminarEstudiante: (id: number) => pedir<void>('DELETE', `/estudiantes/${id}`),

  // apoderados
  apoderados: (p: { q?: string; page?: number; size?: number } = {}) =>
    pedir<Pagina<ApoderadoApi>>('GET', '/apoderados' + qs(p)),
  apoderadosTodos: () => pedir<ApoderadoApi[]>('GET', '/apoderados/todos'),
  detalleApoderado: (id: number) => pedir<DetalleApoderado>('GET', `/apoderados/${id}/detalle`),
  crearApoderado: (a: ApoderadoRequest) => pedir<ApoderadoApi>('POST', '/apoderados', a),
  actualizarApoderado: (id: number, a: ApoderadoRequest) => pedir<ApoderadoApi>('PUT', `/apoderados/${id}`, a),
  eliminarApoderado: (id: number) => pedir<void>('DELETE', `/apoderados/${id}`),

  // pagos
  pagos: (p: { q?: string; estado?: EstadoPago | ''; page?: number; size?: number } = {}) =>
    pedir<Pagina<PagoApi>>('GET', '/pagos' + qs(p)),
  crearPago: (p: PagoRequest) => pedir<PagoApi>('POST', '/pagos', p),
  actualizarPago: (id: number, p: PagoRequest) => pedir<PagoApi>('PUT', `/pagos/${id}`, p),
  eliminarPago: (id: number) => pedir<void>('DELETE', `/pagos/${id}`),

  // asistencias
  asistencias: (p: { q?: string; page?: number; size?: number } = {}) =>
    pedir<Pagina<AsistenciaApi>>('GET', '/asistencias' + qs(p)),
  crearAsistencia: (a: AsistenciaRequest) => pedir<AsistenciaApi>('POST', '/asistencias', a),
  actualizarAsistencia: (id: number, a: AsistenciaRequest) => pedir<AsistenciaApi>('PUT', `/asistencias/${id}`, a),
  eliminarAsistencia: (id: number) => pedir<void>('DELETE', `/asistencias/${id}`),

  // usuarios (solo ADMIN)
  usuarios: () => pedir<UsuarioApi[]>('GET', '/usuarios'),
  crearUsuario: (u: UsuarioRequest) => pedir<UsuarioApi>('POST', '/usuarios', u),
  actualizarUsuario: (id: number, u: UsuarioRequest) => pedir<UsuarioApi>('PUT', `/usuarios/${id}`, u),
  aprobarUsuario: (id: number) => pedir<UsuarioApi>('POST', `/usuarios/${id}/aprobar`),
  eliminarUsuario: (id: number) => pedir<void>('DELETE', `/usuarios/${id}`),

  // portal del padre
  miFamilia: () => pedir<DetalleApoderado>('GET', '/padre/mi-familia'),
};

/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL del backend, por ejemplo https://sistema-estudiantes.up.railway.app */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

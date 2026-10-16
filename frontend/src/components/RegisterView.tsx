import React, { useState } from 'react';
import { ArrowLeft, UserPlus, ShieldAlert, BadgeCheck, Users, Briefcase } from 'lucide-react';
import { api, MODO_DEMO } from '../api';

interface RegisterViewProps {
  /** Modo demostración: entra directamente con el email registrado */
  onRegisterSuccess: (email: string) => void;
  /** Con servidor: vuelve al login mostrando este mensaje */
  onRegistroServidor?: (mensaje: string) => void;
  onNavigateToLogin: () => void;
}

const claseCampo =
  'w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-all font-medium';
const claseEtiqueta = 'text-[10px] font-bold text-gray-400 uppercase tracking-wider block';

export default function RegisterView({ onRegisterSuccess, onRegistroServidor, onNavigateToLogin }: RegisterViewProps) {
  const [tipo, setTipo] = useState<'PADRE' | 'PERSONAL'>('PADRE');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !password.trim()) {
      setError('Por favor llene todos los campos requeridos.');
      return;
    }
    if (tipo === 'PADRE' && dni.length < 8) {
      setError('Ingresa tu DNI (8 dígitos).');
      return;
    }
    if (tipo === 'PERSONAL' && username.trim().length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (MODO_DEMO) {
      setSuccess('Creando su sesión. Por favor espere...');
      setTimeout(() => onRegisterSuccess(email || `${dni || username}@demo`), 1200);
      return;
    }

    setEnviando(true);
    try {
      const r = await api.registro({
        tipo,
        nombreCompleto: fullName.trim(),
        dni: tipo === 'PADRE' ? dni : undefined,
        username: tipo === 'PERSONAL' ? username.trim() : undefined,
        email: email.trim() || undefined,
        password,
        confirmarPassword: confirmPassword,
      });
      setSuccess(r.mensaje);
      setTimeout(() => onRegistroServidor?.(r.mensaje), 2200);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setEnviando(false);
    }
  };

  const botonTipo = (valor: 'PADRE' | 'PERSONAL', texto: string, Icono: typeof Users) => (
    <button
      type="button"
      onClick={() => { setTipo(valor); setError(''); }}
      className={`flex flex-col items-center gap-1 py-3 rounded-lg border text-xs font-bold transition-all ${
        tipo === valor ? 'border-brand-red bg-red-50 text-brand-red' : 'border-gray-200 text-gray-500 hover:border-gray-300'
      }`}
    >
      <Icono size={18} /> {texto}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900 selection:bg-brand-red selection:text-white">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden p-8 space-y-6">

        <button
          onClick={onNavigateToLogin}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-red font-bold transition-colors mb-2 cursor-pointer"
        >
          <ArrowLeft size={14} />
          Volver al Inicio de Sesión
        </button>

        <div className="flex flex-col items-center text-center">
          <img alt="Logo Fe y Alegría 3" className="h-14 w-14 mb-3 object-contain" src="/logo-feyalegria3.jpeg" />
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Crear cuenta</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Fe y Alegría 3</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 p-3 rounded-lg flex items-start gap-2.5 text-xs text-brand-red">
            <span className="mt-0.5 shrink-0"><ShieldAlert size={14} /></span>
            <p className="font-semibold leading-normal">{error}</p>
          </div>
        )}

        {success ? (
          <div className="bg-green-50 border border-green-100 p-5 rounded-xl flex flex-col items-center text-center gap-2 text-xs text-green-700">
            <BadgeCheck size={36} className="text-green-600 animate-bounce" />
            <p className="font-black text-sm">¡Registro exitoso!</p>
            <p className="font-semibold text-gray-500">{success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {botonTipo('PADRE', 'Padre / apoderado', Users)}
              {botonTipo('PERSONAL', 'Personal del colegio', Briefcase)}
            </div>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
              {tipo === 'PADRE'
                ? 'Usa el DNI con el que estás registrado como apoderado. Podrás ver a tus hijos, tus pagos y tu asistencia a reuniones.'
                : 'Tu cuenta quedará pendiente hasta que un administrador la apruebe.'}
            </p>

            <div className="space-y-1.5">
              <label className={claseEtiqueta}>Nombre completo</label>
              <input type="text" required className={claseCampo} placeholder="Ej. María Quispe Ramos"
                     value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {tipo === 'PADRE' ? (
                <div className="space-y-1.5">
                  <label className={claseEtiqueta}>DNI (8 dígitos)</label>
                  <input type="text" maxLength={8} required className={`${claseCampo} font-mono`} placeholder="74859102"
                         value={dni} onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))} />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className={claseEtiqueta}>Nombre de usuario</label>
                  <input type="text" maxLength={60} required className={`${claseCampo} font-mono`} placeholder="mquispe"
                         autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))} />
                </div>
              )}
              <div className="space-y-1.5">
                <label className={claseEtiqueta}>Correo (opcional)</label>
                <input type="email" className={claseCampo} placeholder="correo@ejemplo.com" autoComplete="email"
                       value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={claseEtiqueta}>Contraseña</label>
                <input type="password" required minLength={8} className={`${claseCampo} font-mono`} placeholder="••••••••"
                       autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className={claseEtiqueta}>Confirmar</label>
                <input type="password" required minLength={8} className={`${claseCampo} font-mono`} placeholder="••••••••"
                       autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="w-full mt-2 bg-brand-red hover:bg-brand-red-hover text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <UserPlus size={14} />
              {enviando ? 'Enviando...' : 'Crear cuenta'}
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <span onClick={onNavigateToLogin} className="text-brand-red font-bold hover:underline cursor-pointer">
              Inicia sesión aquí
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

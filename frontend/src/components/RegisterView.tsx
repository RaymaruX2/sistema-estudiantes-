import React, { useState } from 'react';
import { ArrowLeft, UserPlus, ShieldAlert, BadgeCheck } from 'lucide-react';

interface RegisterViewProps {
  onRegisterSuccess: (email: string) => void;
  onNavigateToLogin: () => void;
}

export default function RegisterView({ onRegisterSuccess, onNavigateToLogin }: RegisterViewProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Subdirector Académico');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !dni.trim() || !password.trim()) {
      setError('Por favor llene todos los campos requeridos.');
      return;
    }

    if (dni.length !== 8) {
      setError('El DNI debe tener exactamente 8 caracteres numéricos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      onRegisterSuccess(email);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900 selection:bg-brand-red selection:text-white">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden p-8 space-y-6">
        
        {/* Navigation back */}
        <button 
          onClick={onNavigateToLogin}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-red font-bold transition-colors mb-2 cursor-pointer"
        >
          <ArrowLeft size={14} />
          Volver al Inicio de Sesión
        </button>

        <div className="flex flex-col items-center text-center">
          <img 
            alt="Logo Fe y Alegría 3" 
            className="h-14 w-14 mb-3 object-contain" 
            src="/logo-feyalegria3.jpeg"
          />
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Registro de Administrador</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Solicitud de Credenciales</p>
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
            <p className="font-black text-sm">¡Registro Existoso!</p>
            <p className="font-semibold text-gray-500">Creando su sesión de administrador. Por favor espere...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Nombre Completo del Admin</label>
              <input 
                type="text" 
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-all font-medium"
                placeholder="Ej. Mg. Javier Tello Romero"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">DNI (8 dígitos)</label>
                <input 
                  type="text" 
                  maxLength={8}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-all font-mono font-medium"
                  placeholder="74859102"
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Cargo Académico</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-[11px] focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-all font-bold text-gray-700"
                >
                  <option>Director General</option>
                  <option>Subdirector Académico</option>
                  <option>Secretaria General</option>
                  <option>Coordinador Técnico</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Correo Institucional</label>
              <input 
                type="email" 
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-all font-medium"
                placeholder="ejemplo@feyalegria3.edu.pe"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Contraseña</label>
                <input 
                  type="password" 
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-all font-mono"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Confirmar</label>
                <input 
                  type="password" 
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-all font-mono"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full mt-2 bg-brand-red hover:bg-brand-red-hover text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserPlus size={14} />
              Crear Nuevo Registro
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            ¿Ya tienes cuenta asignada?{' '}
            <span 
              onClick={onNavigateToLogin}
              className="text-brand-red font-bold hover:underline cursor-pointer"
            >
              Inicia sesión aquí
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

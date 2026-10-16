import React, { useState } from 'react';
import { ShieldAlert, LogIn, Sparkles, Check } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (email: string) => void;
  onNavigateToRegister: () => void;
}

export default function LoginView({ onLoginSuccess, onNavigateToRegister }: LoginViewProps) {
  const [email, setEmail] = useState('director@feyalegria3.edu.pe');
  const [password, setPassword] = useState('*********');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Por favor complete todos los campos obligatorios.');
      return;
    }

    setIsLoading(true);
    // Simulate real authentications delay
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(email);
    }, 800);
  };

  const handleDemoBypass = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('director@feyalegria3.edu.pe');
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased text-gray-900 selection:bg-brand-red selection:text-white">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden p-8 space-y-6 relative">
        
        {/* Absolute branding tag */}
        <div className="absolute top-0 right-0 bg-red-100 text-brand-red border-l border-b border-red-100 text-[9px] px-3.5 py-1 rounded-bl-xl font-bold uppercase tracking-wider">
          Sede Central 3
        </div>

        {/* Central Logo */}
        <div className="flex flex-col items-center text-center">
          <img 
            alt="Logo Fe y Alegría 3" 
            className="h-16 w-16 mb-4 object-contain" 
            src="/logo-feyalegria3.jpeg"
          />
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Portal de Gestión Académica</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Fe y Alegría 3</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 p-3 rounded-lg flex items-start gap-2.5 text-xs text-brand-red">
            <span className="mt-0.5 shrink-0"><ShieldAlert size={14} /></span>
            <p className="font-semibold leading-normal">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Correo Electrónico</label>
            <input 
              type="email" 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-all font-medium"
              placeholder="director@feyalegria3.edu.pe"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Contraseña</label>
              <span className="text-[10px] font-semibold text-brand-red hover:underline cursor-pointer">¿Olvidó contraseña?</span>
            </div>
            <input 
              type="password" 
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red outline-none transition-all font-mono"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-brand-red hover:bg-brand-red-hover text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <span className="inline-block animate-spin rounded-full border-2 border-white/30 border-t-white h-4 w-4"></span>
            ) : (
              <>
                <LogIn size={14} />
                Ingresar al Portal
              </>
            )}
          </button>
        </form>

        <div className="relative flex py-1.5 items-center">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink mx-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest">O</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        {/* Demo Fast Bypass */}
        <button 
          onClick={handleDemoBypass}
          disabled={isLoading}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-lg text-xs font-bold transition-all border border-gray-200/50 flex items-center justify-center gap-1.5"
        >
          <Sparkles size={14} className="text-amber-500 fill-amber-500" />
          Acceso Rápido de Demostración
        </button>

        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            ¿No tienes cuenta de administrador?{' '}
            <span 
              onClick={onNavigateToRegister}
              className="text-brand-red font-bold hover:underline cursor-pointer"
            >
              Registrarse aquí
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

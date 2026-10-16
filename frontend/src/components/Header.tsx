import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { Bell, Settings, Search, Menu, LogOut, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onMenuToggle: () => void;
  onLogout: () => void;
  userEmail?: string;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  /** Nombre y rol del usuario conectado */
  nombreUsuario?: string;
  rolUsuario?: string;
}

export default function Header({
  activeTab,
  searchQuery,
  setSearchQuery,
  onMenuToggle,
  onLogout,
  userEmail = 'director@feyalegria3.edu.pe',
  onOpenSettings,
  onOpenNotifications,
  nombreUsuario = 'Admin Institucional',
  rolUsuario,
}: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Resumen Institucional';
      case 'inicial-3':
        return 'Nivel Inicial - 3 Años';
      case 'inicial-4':
        return 'Nivel Inicial - 4 Años';
      case 'inicial-5':
        return 'Nivel Inicial - 5 Años';
      case 'primaria':
        return 'Gestión de Nivel Primaria';
      case 'secundaria':
        return 'Gestión de Nivel Secundaria';
      case 'egresados':
        return 'Egresados (Exalumnos)';
      case 'ayuda':
        return 'Ayuda y Soporte';
      case 'apoderados':
        return 'Padres y Apoderados';
      case 'pagos':
        return 'Pagos';
      case 'asistencias':
        return 'Asistencia a Reuniones';
      case 'usuarios':
        return 'Usuarios del Sistema';
      case 'mi-familia':
        return 'Mi Familia';
      default:
        return 'Gestión Académica';
    }
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'inicial-3':
      case 'inicial-4':
      case 'inicial-5':
        return 'Buscar infante por nombre o DNI...';
      case 'primaria':
        return 'Buscar escolar de primaria...';
      case 'secundaria':
        return 'Buscar estudiante de secundaria...';
      case 'egresados':
        return 'Buscar egresado...';
      case 'apoderados':
        return 'Buscar apoderado por DNI, nombre o teléfono...';
      case 'pagos':
        return 'Buscar pago por apoderado, DNI o descripción...';
      case 'asistencias':
        return 'Buscar por apoderado o reunión...';
      default:
        return 'Buscar estudiante o registro...';
    }
  };

  const notifications = [
    { id: 1, text: 'Notas actualizadas de 5° Sec - A', type: 'info', time: 'Hace 15m' },
    { id: 2, text: 'Alerta: 3 faltas continuas de Alarcón Mateo', type: 'alert', time: 'Hace 2h' },
    { id: 3, text: 'Nueva ficha de matrícula pendiente en 4 años', type: 'pending', time: 'Hace 4h' },
  ];

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-30 font-sans antialiased">
      {/* Left side: Menu hamburger (mobile) & Title */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight truncate">
          {getTitle()}
        </h1>
      </div>

      {/* Right side: Search, Config, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Search tool */}
        <div className="relative hidden lg:block w-72">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </span>
          <input 
            type="text"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red focus:bg-white outline-none transition-all"
            placeholder={getPlaceholder()}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Search button for mobile only (focus trigger) */}
        <div className="lg:hidden relative">
          <input 
            type="text"
            className="w-24 sm:w-40 bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-[11px] focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red focus:bg-white focus:w-48 outline-none transition-all"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 text-gray-500 hover:text-brand-red hover:bg-gray-50 rounded-full transition-colors relative"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-red rounded-full ring-2 ring-white"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-xl shadow-lg ring-1 ring-black/5 z-50 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 font-bold text-xs text-gray-700 border-b border-gray-100 flex justify-between items-center">
                <span>Notificaciones Recientes</span>
                <span className="text-[10px] text-brand-red font-medium cursor-pointer hover:underline">Marcar leídas</span>
              </div>
              <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-3.5 hover:bg-gray-50 transition-colors flex items-start gap-2.5">
                    {notif.type === 'alert' ? (
                      <span className="text-amber-500 shrink-0 mt-0.5"><AlertTriangle size={14} /></span>
                    ) : (
                      <span className="text-brand-red shrink-0 mt-0.5"><CheckCircle size={14} /></span>
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-gray-700 font-medium leading-normal">{notif.text}</p>
                      <span className="text-[10px] text-gray-400 mt-0.5 block">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 bg-gray-50 text-center border-t border-gray-50">
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-[10px] font-bold text-brand-red hover:underline"
                >
                  Cerrar panel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings modal trigger */}
        <button 
          onClick={onOpenSettings}
          className="p-2 text-gray-500 hover:text-brand-red hover:bg-gray-50 rounded-full transition-colors"
          title="Configuración de Sistema"
        >
          <Settings size={18} />
        </button>

        {/* Profile Avatar */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 text-left focus:outline-none focus:ring-2 focus:ring-brand-red/10 rounded-full p-1"
          >
            <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200">
              <img 
                className="h-full w-full object-cover" 
                alt="Avatar de Administrador" 
                src="/avatar.svg"
              />
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-lg ring-1 ring-black/5 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p className="text-xs font-bold text-gray-900">{nombreUsuario}</p>
                <p className="text-[10px] text-gray-500 truncate mt-0.5">{userEmail}</p>
                <span className="inline-flex items-center gap-1 text-[9px] bg-red-100 text-brand-red font-bold px-1.5 py-0.5 rounded-full mt-2">
                  <ShieldCheck size={10} /> {rolUsuario || 'Sede Central'}
                </span>
              </div>
              <div className="p-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenSettings();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-brand-red rounded-lg transition-colors flex items-center gap-2"
                >
                  <Settings size={14} /> Ajustes Académicos
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogOut size={14} /> Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

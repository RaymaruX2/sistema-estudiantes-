import React from 'react';
import { ActiveTab } from '../types';
import { 
  LayoutDashboard, 
  Baby,
  School,
  GraduationCap,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userEmail?: string;
  onLogout: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  setIsOpen, 
  userEmail,
  onLogout 
}: SidebarProps) {
  
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Panel de Control', icon: LayoutDashboard },
    { id: 'inicial-3' as ActiveTab, label: 'Nivel Inicial', icon: Baby, isParent: true },
    { id: 'primaria' as ActiveTab, label: 'Nivel Primaria', icon: School },
    { id: 'secundaria' as ActiveTab, label: 'Nivel Secundaria', icon: School },
    { id: 'egresados' as ActiveTab, label: 'Egresados', icon: GraduationCap },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    // On mobile, close sidebar on click
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const isLevelActive = (tabId: ActiveTab) => {
    if (tabId === 'inicial-3') {
      return activeTab === 'inicial-3' || activeTab === 'inicial-4' || activeTab === 'inicial-5';
    }
    return activeTab === tabId;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-full flex flex-col bg-white border-r border-gray-200 w-64 z-40 
        transition-all duration-300 md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="px-6 h-16 flex items-center justify-between border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <img 
              alt="Logo Fe y Alegría 3" 
              className="h-8 w-8 object-contain" 
              src="/logo-feyalegria3.jpeg"
            />
            <div className="flex flex-col">
              <span className="text-base font-black text-brand-red leading-tight">Fe y Alegría 3</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Gestión Académica</span>
            </div>
          </div>
          <button 
            className="md:hidden p-1 rounded hover:bg-gray-100 text-gray-500"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isLevelActive(item.id);
            const Icon = item.icon;

            if (item.id === 'inicial-3') {
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => handleTabClick('inicial-3')}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all
                      ${active 
                        ? 'text-brand-red bg-brand-red-light font-bold border-l-4 border-brand-red' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-brand-red'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span>Nivel Inicial</span>
                    </div>
                  </button>

                  {/* Submenu for Ages */}
                  <div className="ml-11 pl-2 border-l border-gray-100 flex flex-col space-y-1 pb-2">
                    <button
                      onClick={() => handleTabClick('inicial-3')}
                      className={`text-left text-xs py-1.5 transition-all ${
                        activeTab === 'inicial-3' ? 'text-brand-red font-bold' : 'text-gray-500 hover:text-brand-red'
                      }`}
                    >
                      3 Años
                    </button>
                    <button
                      onClick={() => handleTabClick('inicial-4')}
                      className={`text-left text-xs py-1.5 transition-all ${
                        activeTab === 'inicial-4' ? 'text-brand-red font-bold' : 'text-gray-500 hover:text-brand-red'
                      }`}
                    >
                      4 Años
                    </button>
                    <button
                      onClick={() => handleTabClick('inicial-5')}
                      className={`text-left text-xs py-1.5 transition-all ${
                        activeTab === 'inicial-5' ? 'text-brand-red font-bold' : 'text-gray-500 hover:text-brand-red'
                      }`}
                    >
                      5 Años
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all
                  ${active 
                    ? 'text-brand-red bg-brand-red-light font-bold border-l-4 border-brand-red' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-brand-red'
                  }
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Area with Help & Logout */}
        <div className="p-4 border-t border-gray-100 space-y-1 bg-gray-50">
          <button 
            onClick={() => handleTabClick('ayuda')}
            className={`
              w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all
              ${activeTab === 'ayuda' 
                ? 'text-brand-red bg-brand-red-light font-bold' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-brand-red'
              }
            `}
          >
            <HelpCircle size={18} />
            <span>Ayuda</span>
          </button>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-brand-red rounded-lg transition-all"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>

          {userEmail && (
            <div className="pt-2 px-4 text-[10px] text-gray-400 font-mono truncate text-center">
              Sesión: {userEmail}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

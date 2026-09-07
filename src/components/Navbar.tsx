import React from 'react';
import { Sparkles, MessageSquare, CreditCard, Layers, Settings, User as UserIcon, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { User } from 'firebase/auth';
import { UserProfile } from '../types';

interface NavbarProps {
  currentTab: 'home' | 'plans' | 'create' | 'cards' | 'chat';
  onSelectTab: (tab: 'home' | 'plans' | 'create' | 'cards' | 'chat') => void;
  user: User | null;
  profile: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  isBackendOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  profile,
  onOpenAuth,
  onLogout,
  onOpenSettings,
  isBackendOnline
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B2B40]/95 backdrop-blur-md border-b border-[#FBBF24]/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Logo TDI */}
          <div 
            id="nav-brand"
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* TDI Logo Icon */}
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-[#FF8C00] via-[#FBBF24] to-[#FF8C00] p-0.5 shadow-md shadow-[#FF8C00]/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#0B2B40] rounded-[10px] flex items-center justify-center">
                <span className="font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C00] to-[#FBBF24] text-xl tracking-tight">
                  TDI
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                  TDI
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-[#FF8C00]/20 text-[#FF8C00] border border-[#FF8C00]/40">
                  Inteligente
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium tracking-wide">
                Tarjeta Digital Interactiva
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              id="nav-tab-home"
              onClick={() => onSelectTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'home'
                  ? 'bg-white/10 text-[#FBBF24] border-b-2 border-[#FBBF24]'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              Inicio
            </button>
            <button
              id="nav-tab-plans"
              onClick={() => onSelectTab('plans')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'plans'
                  ? 'bg-white/10 text-[#FBBF24] border-b-2 border-[#FBBF24]'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <CreditCard className="w-4 h-4 text-[#FBBF24]" />
              Planes
            </button>
            <button
              id="nav-tab-create"
              onClick={() => onSelectTab('create')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'create'
                  ? 'bg-[#FF8C00] text-white shadow-md shadow-[#FF8C00]/30'
                  : 'bg-gradient-to-r from-[#FF8C00]/90 to-[#FF8C00] text-white hover:brightness-110'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Crear Tarjeta
            </button>
            <button
              id="nav-tab-cards"
              onClick={() => onSelectTab('cards')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'cards'
                  ? 'bg-white/10 text-[#FBBF24] border-b-2 border-[#FBBF24]'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4 text-[#FBBF24]" />
              Mis Tarjetas
            </button>
            <button
              id="nav-tab-pulpo"
              onClick={() => onSelectTab('chat')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                currentTab === 'chat'
                  ? 'bg-[#FBBF24] text-[#0B2B40] font-bold shadow-md shadow-[#FBBF24]/20'
                  : 'bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              <img 
                src="/pulpo-avatar.jpg" 
                alt="Pulpo" 
                className="w-5 h-5 rounded-full object-cover border border-[#FF8C00]"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <span>Pulpo IA 🐙</span>
            </button>
          </nav>

          {/* Right Controls: Backend Status & User */}
          <div className="flex items-center gap-3">
            {/* Backend Server Status Indicator */}
            <button
              id="btn-backend-settings"
              onClick={onOpenSettings}
              title="Configuración de Servidor Render"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/30 border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:border-white/30 transition-colors"
            >
              <span className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="hidden sm:inline">Render</span>
              <Settings className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-1 pr-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#FF8C00] flex items-center justify-center text-white text-xs font-bold">
                    {(user.displayName || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden md:inline text-xs font-medium text-slate-200 truncate max-w-[100px]">
                  {user.displayName || 'Usuario'}
                </span>
                <button
                  id="btn-logout"
                  onClick={onLogout}
                  title="Cerrar Sesión"
                  className="text-slate-400 hover:text-red-300 transition-colors ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="btn-open-login"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span>Ingresar</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-white/10">
          <button
            onClick={() => onSelectTab('home')}
            className={`text-xs font-semibold px-2 py-1 rounded ${
              currentTab === 'home' ? 'text-[#FBBF24] bg-white/10' : 'text-slate-300'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => onSelectTab('plans')}
            className={`text-xs font-semibold px-2 py-1 rounded ${
              currentTab === 'plans' ? 'text-[#FBBF24] bg-white/10' : 'text-slate-300'
            }`}
          >
            Planes
          </button>
          <button
            onClick={() => onSelectTab('create')}
            className={`text-xs font-bold px-3 py-1 rounded bg-[#FF8C00] text-white shadow`}
          >
            Crear
          </button>
          <button
            onClick={() => onSelectTab('cards')}
            className={`text-xs font-semibold px-2 py-1 rounded ${
              currentTab === 'cards' ? 'text-[#FBBF24] bg-white/10' : 'text-slate-300'
            }`}
          >
            Tarjetas
          </button>
          <button
            onClick={() => onSelectTab('chat')}
            className={`text-xs font-bold px-2.5 py-1 rounded flex items-center gap-1 ${
              currentTab === 'chat' ? 'bg-[#FBBF24] text-[#0B2B40]' : 'text-slate-300'
            }`}
          >
            <span>Pulpo 🐙</span>
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import { 
  Zap, 
  Activity, 
  Navigation, 
  ShieldAlert, 
  Eye, 
  Volume2, 
  VolumeX, 
  Play, 
  Radio, 
  Home,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    isMuted, 
    toggleSound, 
    startAmbulanceSimulation,
    simulation,
    greenCorridorActive
  } = useApp();

  const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'landing', label: 'Overview', icon: <Home className="w-4 h-4" /> },
    { id: 'command_center', label: 'Command Center', icon: <Activity className="w-4 h-4" /> },
    { id: 'driver_hud', label: 'Driver HUD', icon: <Navigation className="w-4 h-4" /> },
    { id: 'citizen_portal', label: 'Citizen Portal', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'ai_detector', label: 'AI Scanner', icon: <Eye className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div 
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform">
            <span className="text-xl">🚑</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base sm:text-lg tracking-tight text-white">
                ResQRoute
              </span>
              <span className="font-mono text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                AI
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium -mt-0.5 hidden sm:block">
              Smart Traffic & Green Corridor
            </div>
          </div>
        </div>

        {/* Center Nav Items */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800/90">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentView === item.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Actions: Sound, Simulation Trigger, Status */}
        <div className="flex items-center gap-2.5">
          
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute High-Tech Audio' : 'Mute Audio'}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* 1-Click Simulation Button */}
          <button
            onClick={startAmbulanceSimulation}
            disabled={simulation.isActive}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-1.5 ${
              simulation.isActive
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:scale-105'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">1-Click Live Demo</span>
            <span className="sm:hidden">Demo</span>
          </button>

        </div>

      </div>

      {/* Mobile Sub-Nav */}
      <div className="flex md:hidden items-center justify-around px-2 py-2 border-t border-slate-800/80 bg-slate-950/95 overflow-x-auto text-[11px]">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shrink-0 ${
              currentView === item.id
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'text-slate-400'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};

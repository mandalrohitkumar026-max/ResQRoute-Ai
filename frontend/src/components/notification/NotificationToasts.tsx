import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  Zap, 
  ShieldAlert, 
  RotateCw, 
  Hospital, 
  Info, 
  X 
} from 'lucide-react';

export const NotificationToasts: React.FC = () => {
  const { notifications, dismissNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {notifications.slice(0, 4).map(notif => {
        let borderClass = 'border-slate-800';
        let bgClass = 'bg-slate-950/95';
        let icon = <Info className="w-4 h-4 text-cyan-400" />;

        if (notif.type === 'emergency') {
          borderClass = 'border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.3)]';
          icon = <ShieldAlert className="w-4 h-4 text-rose-400" />;
        } else if (notif.type === 'green_corridor') {
          borderClass = 'border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
          icon = <Zap className="w-4 h-4 text-emerald-400" />;
        } else if (notif.type === 'incident') {
          borderClass = 'border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.3)]';
          icon = <AlertTriangle className="w-4 h-4 text-amber-400" />;
        } else if (notif.type === 'reroute') {
          borderClass = 'border-blue-500/60 shadow-[0_0_20px_rgba(59,130,246,0.3)]';
          icon = <RotateCw className="w-4 h-4 text-blue-400" />;
        } else if (notif.type === 'hospital') {
          borderClass = 'border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.3)]';
          icon = <Hospital className="w-4 h-4 text-cyan-400" />;
        }

        return (
          <div
            key={notif.id}
            className={`pointer-events-auto p-3.5 rounded-2xl ${bgClass} border ${borderClass} backdrop-blur-xl shadow-2xl transition-all animate-slide-left text-xs flex items-start gap-3`}
          >
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
              {icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-white text-[12px] truncate">{notif.title}</span>
                <span className="text-[9px] font-mono text-slate-500 shrink-0">{notif.timestamp}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                {notif.message}
              </p>
            </div>

            <button
              onClick={() => dismissNotification(notif.id)}
              className="text-slate-500 hover:text-slate-300 p-1 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

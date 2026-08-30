import React from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Pause, RotateCcw, Sparkles, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

export const SimulationOverlay: React.FC = () => {
  const { simulation, pauseAmbulanceSimulation, startAmbulanceSimulation, resetAmbulanceSimulation } = useApp();

  if (!simulation.isActive && simulation.step === 0) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-3xl bg-slate-950/95 backdrop-blur-2xl border-2 border-emerald-500/60 rounded-3xl p-4 sm:p-5 shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-slide-up">
      
      {/* Progress Bar Header */}
      <div className="flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider">
            SIH LIVE EMERGENCY SIMULATION
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-slate-300 font-bold">
          <span>Stage {simulation.step} of 12</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400">{simulation.progressPercent}% Complete</span>
        </div>
      </div>

      {/* Dynamic Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mt-2.5">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-700 ease-out shadow-[0_0_12px_#10b981]"
          style={{ width: `${simulation.progressPercent}%` }}
        />
      </div>

      {/* Stage Title & Description */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm sm:text-base font-black text-white">
            {simulation.stepTitle}
          </h4>
          <p className="text-xs text-slate-300 mt-0.5 max-w-xl line-clamp-2">
            {simulation.stepDescription}
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {simulation.isActive ? (
            <button
              onClick={pauseAmbulanceSimulation}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              title="Pause Simulation"
            >
              <Pause className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={startAmbulanceSimulation}
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950"
              title="Resume Simulation"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
          )}

          <button
            onClick={resetAmbulanceSimulation}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

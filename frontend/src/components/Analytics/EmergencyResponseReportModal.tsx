import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Clock, 
  Zap, 
  ShieldCheck, 
  Download, 
  X, 
  TrendingUp, 
  Navigation, 
  Flame, 
  Award,
  Sparkles,
  Share2
} from 'lucide-react';

export const EmergencyResponseReportModal: React.FC = () => {
  const { simulation, closeReportModal } = useApp();
  const report = simulation.reportData;

  useEffect(() => {
    if (report) {
      // Trigger celebratory confetti on report appearance
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore
      }
    }
  }, [report]);

  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.3)] max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={closeReportModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
            <Award className="w-4 h-4" />
            <span>Mission Accomplished • Incident #{report.incidentId}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Emergency Response Performance Report
          </h2>

          <p className="text-xs text-slate-300">
            Autonomous AI Route Optimization & Green Wave Signal Wave Analysis
          </p>
        </div>

        {/* Primary Impact Hero Stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Baseline ETA</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-400 line-through mt-0.5">
              {report.initialEtaFormatted}
            </div>
            <span className="text-[10px] text-slate-500">Standard Traffic</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Optimized ETA</span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-300 mt-0.5">
              {report.optimizedEtaFormatted}
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">ResQRoute AI</span>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-cyan-400">Critical Time Saved</span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-300 mt-0.5">
              {report.timeSavedFormatted}
            </div>
            <span className="text-[10px] text-cyan-400 font-semibold">+{report.efficiencyGainPercent}% Efficiency</span>
          </div>
        </div>

        {/* Breakdown Metric Rows */}
        <div className="mt-6 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-slate-300">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Smart Signals Synchronized:</span>
            </div>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {report.signalsOptimizedCount} Intersections
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Congestion / Hazards Avoided:</span>
            </div>
            <span className="font-mono font-bold text-amber-400 text-sm">
              {report.incidentsAvoidedCount} Blocked Sectors
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-slate-300">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>Distance Travelled:</span>
            </div>
            <span className="font-mono font-bold text-white text-sm">
              {report.distanceTravelledKm} km (Avg {report.averageSpeedKmH} km/h)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Carbon & Fuel Emission Saved:</span>
            </div>
            <span className="font-mono font-bold text-purple-300 text-sm">
              ~{report.carbonEmissionSavedKg} kg CO₂
            </span>
          </div>

        </div>

        {/* Emergency Unit & Route Log */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          <div><strong className="text-slate-200">Vehicle:</strong> {report.vehicleCallSign}</div>
          <div><strong className="text-slate-200">Origin:</strong> {report.startLocationName}</div>
          <div><strong className="text-slate-200">Destination:</strong> {report.destinationName}</div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
          >
            <Download className="w-4 h-4" />
            <span>Export / Print Report</span>
          </button>

          <button
            onClick={closeReportModal}
            className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Done / Return to Dashboard</span>
          </button>
        </div>

      </div>
    </div>
  );
};

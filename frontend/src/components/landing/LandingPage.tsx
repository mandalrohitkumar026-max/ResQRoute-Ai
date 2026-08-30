import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Zap, 
  ShieldCheck, 
  Navigation, 
  Eye, 
  Activity, 
  Flame, 
  Sparkles, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  Building2, 
  Compass, 
  Cpu, 
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CityMap } from '../Map/CityMap';

export const LandingPage: React.FC = () => {
  const { setCurrentView, startAmbulanceSimulation } = useApp();

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 text-center space-y-6 max-w-5xl mx-auto">
        
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-pulse">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Smart City & SIH Hackathon AI Emergency Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-none">
          RESQROUTE <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">AI</span>
        </h1>

        <p className="text-xl sm:text-2xl font-bold text-slate-200">
          “Intelligent routing for every second that matters.”
        </p>

        <p className="text-sm sm:text-base text-slate-400 max-w-3xl mx-auto leading-relaxed">
          AI-powered traffic intelligence and emergency route optimization for faster, safer urban response. Dynamic weighted route scoring, autonomous Green Corridor signal synchronization, and real-time computer vision incident detection.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <button
            onClick={() => setCurrentView('command_center')}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all hover:scale-105 flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            <span>Launch Command Center</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentView('driver_hud')}
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 hover:border-emerald-500/50 shadow-xl transition-all flex items-center gap-2"
          >
            <span>🚑 Emergency Driver HUD</span>
          </button>

          <button
            onClick={startAmbulanceSimulation}
            className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm shadow-[0_0_25px_rgba(225,29,72,0.4)] transition-all flex items-center gap-2 animate-bounce"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>1-Click Ambulance Demo</span>
          </button>
        </div>

        {/* Key Quick Stats Bar */}
        <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Avg Time Saved</div>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1">37.5%</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Per emergency dispatch</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Signal Pre-emption</div>
            <div className="text-2xl font-black font-mono text-cyan-400 mt-1">&lt; 15 ms</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Green wave sync latency</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Hazard AI Vision</div>
            <div className="text-2xl font-black font-mono text-amber-400 mt-1">96.4%</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Object defect accuracy</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Live Intersections</div>
            <div className="text-2xl font-black font-mono text-purple-400 mt-1">10+ Nodes</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Dynamic cycle priority</div>
          </div>
        </div>

      </section>

      {/* Interactive Map Live Preview Banner */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>Live Smart City Telemetry Grid</span>
            </h3>
            <p className="text-xs text-slate-400">
              Real-time map simulation showing traffic densities, active ambulance corridors, and signal wave states.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('command_center')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>Open Fullscreen Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="h-[420px] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
          <CityMap heightClass="h-full" showControls={true} />
        </div>
      </section>

      {/* Core Feature Pillars */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Pioneering Smart City Emergency Intelligence
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Built specifically to solve ambulance gridlock, traffic signal delays, and uncoordinated emergency response in high-density urban areas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
              🚑 AI Green Corridor Waves
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates vehicle trajectory speeds and pre-emptively switches upcoming traffic signals into priority green waves, releasing cycles immediately upon vehicle crossing.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-xl space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
              🧠 Multi-Factor Route Scoring
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Weighted optimization scoring across travel time (40%), congestion (25%), road risk (15%), distance (10%), and blockages (10%) with dynamic mid-route re-routing.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all shadow-xl space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
              👁️ AI Computer Vision Scanner
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant hazard detection on CCTV cameras and citizen uploads. Identifies multi-car collisions, waterlogging, and potholes with automatic route diversion.
            </p>
          </div>

        </div>
      </section>

      {/* Role Navigation Cards */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-white text-center">
          Explore Operational Roles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div
            onClick={() => setCurrentView('command_center')}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500 cursor-pointer transition-all shadow-lg flex items-center justify-between group"
          >
            <div>
              <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                Traffic Control Center
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Citywide dashboard & signal overrides
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </div>

          <div
            onClick={() => setCurrentView('driver_hud')}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500 cursor-pointer transition-all shadow-lg flex items-center justify-between group"
          >
            <div>
              <div className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                Emergency Driver Cockpit
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Turn-by-turn navigation & SOS mode
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
          </div>

          <div
            onClick={() => setCurrentView('citizen_portal')}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500 cursor-pointer transition-all shadow-lg flex items-center justify-between group"
          >
            <div>
              <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                Citizen Incident Portal
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Report hazards & view hospitals
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </div>

        </div>
      </section>

    </div>
  );
};

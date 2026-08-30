import React from 'react';
import { useApp } from '../../context/AppContext';
import { CityMap } from '../Map/CityMap';
import { VehicleType } from '../../types';
import { 
  Navigation, 
  AlertCircle, 
  Zap, 
  Volume2, 
  VolumeX, 
  Compass, 
  MapPin, 
  Hospital, 
  Flame, 
  Shield, 
  Radio, 
  RotateCw, 
  ChevronRight, 
  CornerUpRight, 
  CornerUpLeft, 
  ArrowUp, 
  CheckCircle2, 
  Flag,
  Sparkles,
  Gauge
} from 'lucide-react';

export const DriverHUD: React.FC = () => {
  const {
    driverVehicleType,
    setDriverVehicleType,
    selectedVehicle,
    selectedFacility,
    setSelectedFacilityId,
    facilities,
    routes,
    activeRoute,
    selectedRouteIndex,
    setSelectedRouteIndex,
    isPrioritySosActive,
    togglePrioritySos,
    greenCorridorActive,
    toggleGreenCorridor,
    currentManeuverIndex,
    advanceManeuver,
    recalculateActiveRoutes,
    signalTimeline
  } = useApp();

  const currentStep = activeRoute?.navigationSteps[currentManeuverIndex] || activeRoute?.navigationSteps[0];
  const nextStep = activeRoute?.navigationSteps[currentManeuverIndex + 1];

  // Helper for turn direction icon
  const renderTurnIcon = (direction?: string) => {
    switch (direction) {
      case 'left':
      case 'slight_left':
        return <CornerUpLeft className="w-8 h-8 text-emerald-400" />;
      case 'right':
      case 'slight_right':
        return <CornerUpRight className="w-8 h-8 text-emerald-400" />;
      case 'arrive':
        return <Flag className="w-8 h-8 text-cyan-400" />;
      default:
        return <ArrowUp className="w-8 h-8 text-emerald-400" />;
    }
  };

  const nextLockedSignal = signalTimeline.find(s => s.status === 'CURRENT_LOCK' || s.status === 'QUEUED');

  return (
    <div className="space-y-6">
      
      {/* Top Cockpit Header: Vehicle Type & Destination Selector */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Vehicle Type Switcher */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
            Unit Type:
          </span>
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => setDriverVehicleType('ambulance')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                driverVehicleType === 'ambulance'
                  ? 'bg-rose-600 text-white shadow-[0_0_15px_#e11d48]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🚑</span>
              <span>Ambulance</span>
            </button>

            <button
              onClick={() => setDriverVehicleType('fire_truck')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                driverVehicleType === 'fire_truck'
                  ? 'bg-amber-600 text-white shadow-[0_0_15px_#d97706]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🚒</span>
              <span>Fire Truck</span>
            </button>

            <button
              onClick={() => setDriverVehicleType('police')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                driverVehicleType === 'police'
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_#2563eb]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🚓</span>
              <span>Police</span>
            </button>
          </div>
        </div>

        {/* Destination Facility Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
            Destination:
          </span>
          <select
            value={selectedFacility?.id || ''}
            onChange={(e) => setSelectedFacilityId(e.target.value)}
            className="w-full md:w-72 bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:border-emerald-500 transition-all cursor-pointer"
          >
            {facilities.map(fac => (
              <option key={fac.id} value={fac.id}>
                {fac.type === 'hospital' ? '🏥 ' : (fac.type === 'fire_station' ? '🚒 ' : '🚓 ')}
                {fac.name} ({fac.capacityStatus})
              </option>
            ))}
          </select>

          <button
            onClick={recalculateActiveRoutes}
            title="Recalculate AI Routes"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Cockpit HUD Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Turn-by-Turn Navigation Card & SOS Mode (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col">
          
          {/* Turn-by-Turn Navigation HUD Card */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            
            {/* Top Navigation Step Status */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-1.5 font-mono text-emerald-400 font-bold">
                  <Compass className="w-4 h-4 animate-spin-slow" />
                  <span>GPS NAVIGATION LOCK</span>
                </div>
                <div className="font-mono text-slate-300">
                  Step {currentManeuverIndex + 1} of {activeRoute?.navigationSteps.length || 5}
                </div>
              </div>

              {/* Big Maneuver Instruction Banner */}
              <div className="mt-4 flex items-start gap-4 p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  {renderTurnIcon(currentStep?.turnDirection)}
                </div>
                <div className="flex-1">
                  <div className="text-xl sm:text-2xl font-black text-white font-mono leading-tight">
                    In {currentStep?.distanceMeters || 350} m
                  </div>
                  <div className="text-sm font-semibold text-slate-200 mt-1">
                    {currentStep?.instruction || 'Proceed straight along emergency corridor'}
                  </div>
                  <div className="text-xs text-emerald-400 font-mono mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{currentStep?.streetName || 'Central Expressway'}</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Next Step Preview */}
              {nextStep && (
                <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Then:</span>
                    <span className="text-slate-300 font-medium">{nextStep.instruction}</span>
                  </div>
                  <span className="font-mono text-slate-400 shrink-0">+{nextStep.distanceMeters}m</span>
                </div>
              )}

              {/* Speed & Live Green Wave Signal Alert */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    Current Speed
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-black font-mono text-white">{selectedVehicle.speedKmH || 52}</span>
                    <span className="text-xs text-slate-400 font-mono">km/h</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium mt-0.5">Optimal Wave Speed</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    Green Corridor
                  </span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-black font-mono text-emerald-400">
                      {greenCorridorActive ? 'LOCKED' : 'READY'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {nextLockedSignal ? `${nextLockedSignal.signalName.split('—')[0]}` : '5 Signals synched'}
                  </span>
                </div>
              </div>
            </div>

            {/* Advance Step Button for Driver Simulation */}
            <div className="mt-4">
              <button
                onClick={advanceManeuver}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all shadow-md"
              >
                <span>Complete Maneuver / Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Massive Emergency SOS / Priority Mode Button */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-2xl text-center flex flex-col items-center justify-center relative overflow-hidden">
            {isPrioritySosActive && (
              <div className="absolute inset-0 bg-red-600/20 animate-pulse pointer-events-none"></div>
            )}

            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Emergency Dispatch Override
            </div>

            <button
              onClick={togglePrioritySos}
              className={`w-full py-5 rounded-2xl font-black text-base sm:text-lg tracking-wider uppercase transition-all shadow-2xl flex items-center justify-center gap-3 relative overflow-hidden ${
                isPrioritySosActive
                  ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white shadow-[0_0_40px_#ef4444] animate-bounce scale-[1.02]'
                  : 'bg-gradient-to-r from-rose-700 to-red-800 hover:from-rose-600 hover:to-red-700 text-white shadow-[0_0_25px_rgba(225,29,72,0.4)]'
              }`}
            >
              <AlertCircle className="w-6 h-6 animate-pulse" />
              <span>{isPrioritySosActive ? '🚨 SOS PRIORITY MODE ACTIVE' : 'EMERGENCY SOS PRIORITY'}</span>
            </button>

            <div className="mt-3 text-[11px] text-slate-400">
              {isPrioritySosActive
                ? 'Pre-empting all municipal traffic signals & broadcasting urgent right-of-way.'
                : 'Click to override traffic grid and force instant Green Corridor priority waves.'}
            </div>
          </div>

          {/* Route Options Switcher */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="text-xs font-bold text-white mb-2 flex items-center justify-between">
              <span>Alternative Routes</span>
              <span className="text-[10px] text-emerald-400 font-mono">Dynamic AI Ranking</span>
            </div>

            <div className="space-y-2">
              {routes.map((route, idx) => (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteIndex(idx)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                    idx === selectedRouteIndex
                      ? 'bg-slate-950 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${idx === selectedRouteIndex ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                    <span className="font-semibold text-slate-200 text-[11px]">{route.name}</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-emerald-400 font-bold">{route.etaFormatted}</span>
                    <span className="text-slate-400 text-[11px]">{route.distanceKm} km</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Map HUD View (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Top ETA & Telemetry Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-lg text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total ETA</span>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-0.5">
                {activeRoute?.etaFormatted || '07:42'}
              </div>
              <span className="text-[10px] text-slate-400">Optimal green wave</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-lg text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Distance</span>
              <div className="text-xl sm:text-2xl font-black font-mono text-white mt-0.5">
                {activeRoute?.distanceKm || 4.8} <span className="text-xs text-slate-400">km</span>
              </div>
              <span className="text-[10px] text-slate-400">To trauma bay</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-lg text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Traffic Density</span>
              <div className="text-xl sm:text-2xl font-black font-mono text-amber-400 mt-0.5">
                {activeRoute?.trafficDensityPercent || 18}%
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">Low Congestion</span>
            </div>
          </div>

          {/* Map View */}
          <div className="h-[520px] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <CityMap heightClass="h-full" showControls={false} />
          </div>

        </div>

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CityMap } from '../Map/CityMap';
import { 
  AlertTriangle, 
  Activity, 
  Clock, 
  Zap, 
  ShieldAlert, 
  Radio, 
  Flame, 
  TrendingUp, 
  Building2, 
  Navigation2, 
  Sliders, 
  CheckCircle, 
  RefreshCw, 
  ChevronRight, 
  Sparkles,
  Info,
  Car,
  Volume2,
  VolumeX,
  Play,
  Share2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { HOURLY_TRAFFIC_FORECAST, CONGESTION_BY_AREA } from '../../data/mockCityData';

export const CommandDashboard: React.FC = () => {
  const {
    vehicles,
    signals,
    roads,
    incidents,
    facilities,
    selectedVehicle,
    setSelectedVehicleId,
    selectedFacility,
    setSelectedFacilityId,
    routes,
    activeRoute,
    selectedRouteIndex,
    setSelectedRouteIndex,
    greenCorridorActive,
    toggleGreenCorridor,
    signalTimeline,
    setFocusedCoordinates,
    overrideSignalState,
    resolveIncident,
    toggleRoadBlockage,
    recalculateActiveRoutes,
    startAmbulanceSimulation,
    simulation
  } = useApp();

  const [incidentFilter, setIncidentFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [activeTab, setActiveTab] = useState<'routing' | 'signals' | 'forecast' | 'fleet'>('routing');

  // Stats calculation
  const activeEmergencies = vehicles.filter(v => v.status === 'EMERGENCY' || v.status === 'EN_ROUTE').length;
  const avgCongestion = Math.round(roads.reduce((acc, r) => acc + r.congestionPercent, 0) / roads.length);
  const blockedRoadsCount = roads.filter(r => r.isBlocked).length;
  const activeCorridorsCount = greenCorridorActive ? 1 : 0;
  const avgResponseTime = '06m 45s';

  const filteredIncidents = incidents.filter(i => {
    if (i.status === 'RESOLVED') return false;
    if (incidentFilter === 'ALL') return true;
    return i.severity === incidentFilter;
  });

  const incidentTypesData = [
    { name: 'Accidents', count: incidents.filter(i => i.type === 'accident').length, color: '#ef4444' },
    { name: 'Congestion', count: incidents.filter(i => i.type === 'traffic_congestion').length, color: '#f59e0b' },
    { name: 'Road Hazard', count: incidents.filter(i => i.type === 'pothole' || i.type === 'road_blockage').length, color: '#8b5cf6' },
    { name: 'Floods / Other', count: incidents.filter(i => i.type === 'flooded_road' || i.type === 'vehicle_breakdown').length, color: '#06b6d4' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Notification / 1-Click SIH Demo Action Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900/90 to-blue-950/70 border border-emerald-500/30 p-4 sm:p-5 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                SIH Hackathon Presentation Demo
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Autonomous Smart Emergency Response & AI Green Corridor
            </h2>
            <p className="text-xs text-slate-300">
              Run the full 12-stage interactive simulation with roadblock bypass, dynamic route re-scoring, and signal wave synchronization.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={startAmbulanceSimulation}
            disabled={simulation.isActive}
            className={`w-full md:w-auto px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
              simulation.isActive 
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700' 
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-[1.02]'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{simulation.isActive ? 'Simulation In Progress...' : 'Simulate Ambulance Emergency'}</span>
          </button>
        </div>
      </div>

      {/* Top 5 KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Active Emergencies */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-rose-500/40 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Active Emergencies</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition-all">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white">{activeEmergencies}</span>
            <span className="text-xs text-rose-400 font-semibold animate-pulse">Code Red</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Units deployed in sector
          </div>
        </div>

        {/* KPI 2: Traffic Congestion */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-amber-500/40 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Avg Traffic Congestion</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-all">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400">{avgCongestion}%</span>
            <span className="text-xs text-slate-400 font-medium">Moderate</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Across 25 city road arteries
          </div>
        </div>

        {/* KPI 3: Blocked Roads */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-red-500/40 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Road Closures</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400 group-hover:bg-red-500/20 transition-all">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-red-400">{blockedRoadsCount}</span>
            <span className="text-xs text-red-400/80">Active Obstructions</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Vikas Marg underpass detour
          </div>
        </div>

        {/* KPI 4: Avg Response Time */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-cyan-500/40 transition-all group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Avg Response Time</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-all">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">{avgResponseTime}</span>
            <span className="text-xs text-emerald-400 font-semibold">-38% vs baseline</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            AI route acceleration active
          </div>
        </div>

        {/* KPI 5: Active Green Corridors */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-emerald-500/40 transition-all group col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Green Corridors</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">{activeCorridorsCount}</span>
            <span className={`text-xs font-bold ${greenCorridorActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`}>
              {greenCorridorActive ? 'ENGAGED' : 'STANDBY'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Signal pre-emption wave
          </div>
        </div>
      </div>

      {/* Main Grid: Map Centerpiece + Live Incident & Routing Sidebars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Live Incidents & Road Management Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col">
          
          {/* Incident Feed Card */}
          <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Live Emergency Incidents</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60 font-semibold">
                {filteredIncidents.length} Active
              </span>
            </div>

            {/* Severity Filter Pills */}
            <div className="flex items-center gap-1.5 mt-3 text-[11px]">
              {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => setIncidentFilter(sev)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    incidentFilter === sev 
                      ? 'bg-slate-800 text-white border border-slate-600 font-bold' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            {/* Scrollable Incident List */}
            <div className="mt-3 space-y-2.5 overflow-y-auto max-h-[380px] pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {filteredIncidents.map(inc => (
                <div
                  key={inc.id}
                  onClick={() => setFocusedCoordinates(inc.location)}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-rose-500/50 transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                        inc.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                        inc.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      }`}>
                        {inc.severity}
                      </span>
                      <span className="text-[10px] text-slate-500">{inc.reportedAt}</span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400">
                      {inc.distanceKm ? `${inc.distanceKm} km away` : 'Near Sector 4'}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-100 mt-1.5 group-hover:text-rose-300 transition-colors">
                    {inc.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {inc.locationName}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1 text-slate-400">
                      <span>Source:</span>
                      <span className="font-mono text-emerald-400 font-semibold">{inc.reporter}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resolveIncident(inc.id);
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-700 transition-all"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              ))}

              {filteredIncidents.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500">
                  No active incidents in this filter category.
                </div>
              )}
            </div>
          </div>

          {/* Quick Road Control / Simulation Injector */}
          <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-bold text-white">
              <span>Road Grid Choke Point Toggles</span>
              <span className="text-[10px] text-slate-400 font-normal">Click to toggle blockage</span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              {roads.slice(0, 4).map(road => (
                <div key={road.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-200 text-[11px]">{road.name}</span>
                    <span className="text-[10px] text-slate-500">Density: {road.congestionPercent}%</span>
                  </div>

                  <button
                    onClick={() => toggleRoadBlockage(road.id)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                      road.isBlocked 
                        ? 'bg-rose-500 text-white shadow-[0_0_10px_#f43f5e]' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {road.isBlocked ? '⛔ BLOCKED' : 'OPEN'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center & Right: Live Map + Tabbed Intelligence Panel (8 cols) */}
        <div className="lg:col-span-8 space-y-4 flex flex-col">
          
          {/* Map Centerpiece (height ~ 480px) */}
          <div className="h-[460px] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <CityMap heightClass="h-full" showControls={true} />
          </div>

          {/* Tabbed Navigation: Route Optimization, Signal Wave, Forecast, Fleet */}
          <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl">
            
            {/* Tabs Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('routing')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'routing'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Navigation2 className="w-3.5 h-3.5" />
                  AI Route Scoring Engine
                </button>

                <button
                  onClick={() => setActiveTab('signals')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'signals'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  Green Corridor Timeline
                </button>

                <button
                  onClick={() => setActiveTab('forecast')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'forecast'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Traffic Forecast & Analytics
                </button>

                <button
                  onClick={() => setActiveTab('fleet')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'fleet'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Car className="w-3.5 h-3.5" />
                  Fleet Telemetry
                </button>
              </div>

              {/* Green Corridor Manual Toggle Button */}
              <button
                onClick={toggleGreenCorridor}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  greenCorridorActive
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_#10b981] animate-pulse'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{greenCorridorActive ? 'Green Wave ACTIVE' : 'Arm Green Corridor'}</span>
              </button>
            </div>

            {/* Tab 1: AI Route Scoring Engine */}
            {activeTab === 'routing' && (
              <div className="mt-4 space-y-4">
                
                {/* 3 Routes Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {routes.map((route, idx) => {
                    const isSelected = idx === selectedRouteIndex;
                    return (
                      <div
                        key={route.id}
                        onClick={() => setSelectedRouteIndex(idx)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'bg-slate-950 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                            : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        {route.isRecommended && (
                          <div className="absolute -top-2.5 right-3 bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md">
                            ★ RECOMMENDED
                          </div>
                        )}

                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                            {route.name}
                          </div>

                          <div className="mt-2.5 flex items-baseline justify-between">
                            <div>
                              <div className="text-[10px] text-slate-400">Estimated ETA</div>
                              <div className="text-lg font-black font-mono text-emerald-400">{route.etaFormatted}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] text-slate-400">Distance</div>
                              <div className="text-sm font-bold font-mono text-white">{route.distanceKm} km</div>
                            </div>
                          </div>

                          <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] text-slate-300 pt-2 border-t border-slate-800/80">
                            <div>Traffic: <span className="font-bold text-amber-400">{route.trafficDensityPercent}%</span></div>
                            <div>Risk: <span className="font-bold text-slate-200">{route.roadRiskLevel}</span></div>
                          </div>
                        </div>

                        {/* Weighted Route Score Badge */}
                        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">Composite Score:</span>
                          <span className="font-mono font-bold text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50">
                            {route.routeScore} pts
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* AI Explanation Callout Card */}
                {activeRoute && (
                  <div className="p-3.5 rounded-xl bg-slate-950/90 border border-emerald-500/30 shadow-md">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>AI Multi-Factor Decision Matrix Explanation</span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                      {activeRoute.aiExplanation}
                    </p>

                    {/* Formula Breakdown Badges */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-300">Weighted Score Weights:</span>
                      <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Travel Time (40%)</span>
                      <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Traffic Density (25%)</span>
                      <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Road Risk (15%)</span>
                      <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Distance (10%)</span>
                      <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Obstacle Penalty (10%)</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Green Corridor Timeline */}
            {activeTab === 'signals' && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Signals Synchronized Along Active Route:</span>
                  <span className="font-mono text-emerald-400 font-bold">{signalTimeline.length} Intersections Locked</span>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {signalTimeline.length > 0 ? (
                    signalTimeline.map((item, idx) => (
                      <div
                        key={item.signalId}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                          item.status === 'CURRENT_LOCK'
                            ? 'bg-emerald-950/50 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                            : item.status === 'PASSED'
                            ? 'bg-slate-950/40 border-slate-800/50 opacity-60'
                            : 'bg-slate-950/80 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-[10px] text-slate-300">
                            0{idx + 1}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{item.signalName}</span>
                              {item.status === 'CURRENT_LOCK' && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500 text-slate-950 animate-pulse">
                                  PRIORITY GREEN LOCK
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">{item.roadName}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-right">
                          <div>
                            <div className="text-[10px] text-slate-400">Distance</div>
                            <div className="font-mono font-bold text-white">{item.distanceKm} km</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">ETA to Signal</div>
                            <div className="font-mono font-bold text-emerald-400">{item.etaSeconds}s</div>
                          </div>

                          {/* Quick manual signal override button */}
                          <button
                            onClick={() => overrideSignalState(item.signalId, 'PRIORITY_GREEN')}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-all text-[10px] font-semibold"
                            title="Force Priority Green Wave"
                          >
                            ⚡ Force
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs text-slate-500">
                      Activate Green Corridor to view the live signal pre-emption timeline.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Traffic Forecast & Analytics */}
            {activeTab === 'forecast' && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Traffic Congestion Prediction Chart */}
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
                    <span>Traffic Forecast (+15m, +30m, +60m)</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Neural ML Model</span>
                  </div>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={HOURLY_TRAFFIC_FORECAST}>
                        <defs>
                          <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="timeLabel" stroke="#64748b" fontSize={10} />
                        <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 11 }}
                          formatter={(val) => [`${val}%`, 'Predicted Congestion']}
                        />
                        <Area type="monotone" dataKey="predictedCongestionPercent" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#forecastGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Congestion by Area Chart */}
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
                    <span>Congestion Hotspots by Sector</span>
                    <span className="text-[10px] text-amber-400 font-mono">Live Sensor Grid</span>
                  </div>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={CONGESTION_BY_AREA}>
                        <XAxis dataKey="area" stroke="#64748b" fontSize={9} interval={0} />
                        <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 11 }}
                          formatter={(val) => [`${val}%`, 'Congestion Index']}
                        />
                        <Bar dataKey="current" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}

            {/* Tab 4: Fleet Telemetry */}
            {activeTab === 'fleet' && (
              <div className="mt-4 space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {vehicles.map(veh => (
                  <div
                    key={veh.id}
                    onClick={() => {
                      setSelectedVehicleId(veh.id);
                      setFocusedCoordinates(veh.currentLocation);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      selectedVehicle.id === veh.id
                        ? 'bg-slate-950 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-sm">
                        {veh.type === 'ambulance' ? '🚑' : (veh.type === 'fire_truck' ? '🚒' : '🚓')}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{veh.name}</span>
                          <span className="font-mono text-[10px] text-emerald-400">({veh.callSign})</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {veh.destinationName ? `Heading to: ${veh.destinationName}` : 'Patrol Standby'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="text-[10px] text-slate-400">Speed</div>
                        <div className="font-mono font-bold text-white">{veh.speedKmH} km/h</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Status</div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          veh.status === 'EMERGENCY' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {veh.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrafficSignal, EmergencyVehicle, Facility, IncidentReport, RoadSegment } from '../../types';
import L from 'leaflet';
import { 
  Layers, 
  Crosshair, 
  Radio, 
  ShieldAlert, 
  Sparkles,
  Zap,
  CheckCircle2,
  Navigation
} from 'lucide-react';

interface CityMapProps {
  heightClass?: string;
  showControls?: boolean;
  interactiveControls?: boolean;
}

export const CityMap: React.FC<CityMapProps> = ({ 
  heightClass = 'h-full min-h-[500px]',
  showControls = true,
  interactiveControls = true 
}) => {
  const { 
    facilities, 
    signals, 
    roads, 
    vehicles, 
    incidents, 
    selectedVehicle, 
    setSelectedVehicleId, 
    selectedFacility,
    setSelectedFacilityId,
    focusedCoordinates, 
    routes, 
    selectedRouteIndex,
    greenCorridorActive,
    overrideSignalState,
    toggleRoadBlockage
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Map layer filter states
  const [showTrafficDensity, setShowTrafficDensity] = useState(true);
  const [showSignals, setShowSignals] = useState(true);
  const [showFacilities, setShowFacilities] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [focusedCoordinates.lat, focusedCoordinates.lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Dark Matter tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add zoom control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup on unmount handled gracefully
    };
  }, []);

  // Update map view when focusedCoordinates changes
  useEffect(() => {
    if (mapInstanceRef.current && focusedCoordinates) {
      mapInstanceRef.current.panTo([focusedCoordinates.lat, focusedCoordinates.lng], {
        animate: true,
        duration: 0.8
      });
    }
  }, [focusedCoordinates]);

  // Render all map overlays whenever data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Draw Roads / Traffic Density Layers
    if (showTrafficDensity) {
      roads.forEach(road => {
        let color = '#10b981'; // free flow (green)
        let weight = 4;
        let dashArray: string | undefined = undefined;

        if (road.isBlocked) {
          color = '#ef4444'; // Red blocked
          weight = 6;
          dashArray = '6, 6';
        } else if (road.congestionPercent > 70) {
          color = '#f97316'; // Heavy (orange/red)
          weight = 5;
        } else if (road.congestionPercent > 40) {
          color = '#eab308'; // Moderate (yellow)
          weight = 4;
        }

        const polyline = L.polyline(road.path, {
          color,
          weight,
          opacity: road.isBlocked ? 0.9 : 0.65,
          dashArray,
          lineJoin: 'round'
        });

        polyline.bindPopup(`
          <div class="p-2 bg-slate-900 text-white rounded text-xs">
            <div class="font-bold text-sm text-slate-100">${road.name}</div>
            <div class="mt-1 flex items-center justify-between text-slate-300">
              <span>Congestion:</span>
              <span class="font-mono font-bold ${road.congestionPercent > 60 ? 'text-red-400' : 'text-emerald-400'}">${road.congestionPercent}%</span>
            </div>
            <div class="flex items-center justify-between text-slate-300">
              <span>Avg Speed:</span>
              <span class="font-mono">${road.currentSpeedKmH} km/h (Limit: ${road.speedLimitKmH})</span>
            </div>
            ${road.isBlocked ? `<div class="mt-2 text-rose-400 font-semibold text-[11px] bg-rose-950/60 p-1 rounded border border-rose-800/50">⛔ BLOCKED: ${road.blockageReason || 'Obstacle'}</div>` : ''}
          </div>
        `);

        layerGroup.addLayer(polyline);
      });
    }

    // 2. Draw Active Calculated Routes
    if (showRoutes && routes.length > 0) {
      routes.forEach((route, idx) => {
        const isSelected = idx === selectedRouteIndex;
        let color = isSelected ? (greenCorridorActive ? '#00ff9d' : '#38bdf8') : '#64748b';
        let weight = isSelected ? (greenCorridorActive ? 8 : 6) : 3;
        let opacity = isSelected ? 0.95 : 0.45;
        let dashArray = isSelected ? (greenCorridorActive ? undefined : undefined) : '4, 8';

        // Glow shadow for selected route
        if (isSelected) {
          const glowPolyline = L.polyline(route.pathCoordinates, {
            color: greenCorridorActive ? '#10b981' : '#0ea5e9',
            weight: weight + 6,
            opacity: 0.3,
            lineCap: 'round',
            lineJoin: 'round'
          });
          layerGroup.addLayer(glowPolyline);
        }

        const routePolyline = L.polyline(route.pathCoordinates, {
          color,
          weight,
          opacity,
          dashArray,
          lineCap: 'round',
          lineJoin: 'round'
        });

        routePolyline.bindPopup(`
          <div class="p-2 bg-slate-900 text-white rounded text-xs">
            <div class="font-bold text-sm ${isSelected ? 'text-emerald-400' : 'text-slate-300'}">${route.name}</div>
            <div class="mt-1 text-slate-300">Distance: <span class="font-mono font-bold text-white">${route.distanceKm} km</span></div>
            <div class="text-slate-300">ETA: <span class="font-mono font-bold text-emerald-400">${route.etaFormatted}</span></div>
            <div class="text-slate-300">Traffic: <span class="font-mono font-bold">${route.trafficDensityPercent}% (${route.trafficLevel})</span></div>
            <div class="mt-1 text-[11px] text-slate-400 italic">${route.aiExplanation}</div>
          </div>
        `);

        layerGroup.addLayer(routePolyline);
      });
    }

    // 3. Draw Smart Traffic Signals
    if (showSignals) {
      signals.forEach(signal => {
        const isPriority = signal.state === 'PRIORITY_GREEN';
        const lightColor = signal.state === 'RED' ? '#ef4444' : (signal.state === 'YELLOW' ? '#eab308' : '#10b981');

        const signalHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            ${isPriority ? `
              <div class="absolute -inset-2 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
              <div class="absolute -inset-3 border-2 border-emerald-400 rounded-full animate-pulse"></div>
            ` : ''}
            <div class="w-7 h-7 rounded-full bg-slate-950 border-2 ${isPriority ? 'border-emerald-400 shadow-[0_0_15px_#10b981]' : 'border-slate-700 shadow-md'} flex flex-col items-center justify-center">
              <div class="w-3.5 h-3.5 rounded-full" style="background-color: ${isPriority ? '#00ff9d' : lightColor}; box-shadow: 0 0 8px ${lightColor};"></div>
            </div>
            <div class="absolute -bottom-4 bg-slate-900/90 text-[9px] font-mono font-bold px-1 rounded text-slate-300 border border-slate-700">
              ${signal.timerSeconds}s
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-signal-icon',
          html: signalHtml,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([signal.location.lat, signal.location.lng], { icon: customIcon });

        marker.bindPopup(`
          <div class="p-3 bg-slate-950 text-white rounded-lg border border-slate-800 text-xs w-56">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-200 text-sm">🚦 ${signal.name}</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${signal.state === 'PRIORITY_GREEN' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50' : 'bg-slate-800 text-slate-400'}">
                ${signal.state}
              </span>
            </div>
            <div class="text-[11px] text-slate-400 mt-1">${signal.roadName}</div>
            <div class="mt-2 text-slate-300 flex items-center justify-between text-[11px]">
              <span>Cycle Timer:</span>
              <span class="font-mono font-bold text-amber-400">${signal.timerSeconds}s</span>
            </div>
            <div class="flex items-center justify-between text-slate-300 text-[11px]">
              <span>Corridor Lock:</span>
              <span class="font-mono ${signal.isGreenCorridorLocked ? 'text-emerald-400 font-bold' : 'text-slate-500'}">
                ${signal.isGreenCorridorLocked ? 'ACTIVE WAVE' : 'STANDBY'}
              </span>
            </div>
          </div>
        `);

        layerGroup.addLayer(marker);
      });
    }

    // 4. Draw Facilities (Hospitals, Police, Fire)
    if (showFacilities) {
      facilities.forEach(fac => {
        let emoji = '🏥';
        let borderColor = 'border-cyan-500';
        let glowColor = 'shadow-[0_0_12px_#06b6d4]';

        if (fac.type === 'fire_station') {
          emoji = '🚒';
          borderColor = 'border-amber-500';
          glowColor = 'shadow-[0_0_12px_#f59e0b]';
        } else if (fac.type === 'police_station') {
          emoji = '🚓';
          borderColor = 'border-blue-500';
          glowColor = 'shadow-[0_0_12px_#3b82f6]';
        }

        const isDestination = selectedFacility?.id === fac.id;

        const facHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            ${isDestination ? `
              <div class="absolute -inset-3 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
              <div class="absolute -inset-4 border-2 border-cyan-400 rounded-full animate-pulse"></div>
            ` : ''}
            <div class="w-8 h-8 rounded-full bg-slate-950 border-2 ${borderColor} ${glowColor} flex items-center justify-center text-sm">
              ${emoji}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-fac-icon',
          html: facHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([fac.location.lat, fac.location.lng], { icon: customIcon });

        marker.bindPopup(`
          <div class="p-3 bg-slate-950 text-white rounded-lg border border-slate-800 text-xs w-60">
            <div class="font-bold text-slate-100 text-sm flex items-center gap-1.5">
              <span>${emoji}</span> ${fac.name}
            </div>
            <div class="text-[11px] text-slate-400 mt-1">${fac.address}</div>
            <div class="mt-2 space-y-1 text-slate-300 text-[11px]">
              <div class="flex justify-between">
                <span>Status:</span>
                <span class="font-bold ${fac.capacityStatus === 'AVAILABLE' ? 'text-emerald-400' : 'text-amber-400'}">${fac.capacityStatus}</span>
              </div>
              ${fac.icuBedsAvailable !== undefined ? `
                <div class="flex justify-between">
                  <span>ICU Beds:</span>
                  <span class="font-mono font-bold text-cyan-400">${fac.icuBedsAvailable} available</span>
                </div>
              ` : ''}
              ${fac.traumaLevel ? `
                <div class="flex justify-between">
                  <span>Capability:</span>
                  <span class="font-mono text-slate-300">${fac.traumaLevel}</span>
                </div>
              ` : ''}
              <div class="flex justify-between">
                <span>Direct Line:</span>
                <span class="font-mono text-slate-400">${fac.contactNumber}</span>
              </div>
            </div>
          </div>
        `);

        marker.on('click', () => {
          setSelectedFacilityId(fac.id);
        });

        layerGroup.addLayer(marker);
      });
    }

    // 5. Draw Incidents
    if (showIncidents) {
      incidents.forEach(inc => {
        if (inc.status === 'RESOLVED') return;

        let emoji = '🚨';
        let badgeColor = 'bg-red-500';
        if (inc.type === 'road_blockage') emoji = '⛔';
        else if (inc.type === 'pothole') emoji = '⚠️';
        else if (inc.type === 'flooded_road') emoji = '🌊';
        else if (inc.type === 'traffic_congestion') emoji = '🚗';
        else if (inc.type === 'vehicle_breakdown') emoji = '🔧';

        const incHtml = `
          <div class="relative flex items-center justify-center cursor-pointer">
            <div class="absolute -inset-2 bg-rose-600 rounded-full animate-ping opacity-70"></div>
            <div class="w-8 h-8 rounded-full bg-rose-950 border-2 border-rose-500 shadow-[0_0_15px_#f43f5e] flex items-center justify-center text-sm">
              ${emoji}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-inc-icon',
          html: incHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([inc.location.lat, inc.location.lng], { icon: customIcon });

        marker.bindPopup(`
          <div class="p-3 bg-slate-950 text-white rounded-lg border border-rose-900/50 text-xs w-64">
            <div class="flex items-center justify-between">
              <span class="font-bold text-rose-300 text-sm">${emoji} ${inc.title}</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${inc.severity === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-black'}">
                ${inc.severity}
              </span>
            </div>
            <div class="text-[11px] text-slate-400 mt-1">${inc.locationName}</div>
            <div class="mt-2 text-slate-300 text-[11px]">${inc.description}</div>
            <div class="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Source: ${inc.reporter}</span>
              ${inc.confidenceScore ? `<span class="text-emerald-400 font-mono">Conf: ${inc.confidenceScore}%</span>` : ''}
            </div>
          </div>
        `);

        layerGroup.addLayer(marker);
      });
    }

    // 6. Draw Emergency Vehicles
    if (showVehicles) {
      vehicles.forEach(veh => {
        let emoji = '🚑';
        if (veh.type === 'fire_truck') emoji = '🚒';
        else if (veh.type === 'police') emoji = '🚓';

        const isSelected = selectedVehicle.id === veh.id;
        const isEmergency = veh.status === 'EMERGENCY' || veh.status === 'EN_ROUTE';

        const vehHtml = `
          <div class="relative flex items-center justify-center cursor-pointer">
            ${isEmergency ? `
              <div class="absolute -inset-3 bg-red-500 rounded-full animate-ping opacity-80"></div>
              <div class="absolute -inset-4 border-2 border-emerald-400 rounded-full animate-pulse"></div>
            ` : ''}
            <div class="w-10 h-10 rounded-full bg-slate-950 border-2 ${isSelected ? 'border-emerald-400 shadow-[0_0_20px_#00ff9d]' : 'border-blue-400 shadow-lg'} flex flex-col items-center justify-center text-sm font-bold">
              <span>${emoji}</span>
              <span class="text-[8px] font-mono text-emerald-300 -mt-1 leading-none">${veh.callSign}</span>
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-veh-icon',
          html: vehHtml,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        const marker = L.marker([veh.currentLocation.lat, veh.currentLocation.lng], { icon: customIcon });

        marker.bindPopup(`
          <div class="p-3 bg-slate-950 text-white rounded-lg border border-slate-800 text-xs w-60">
            <div class="flex items-center justify-between">
              <span class="font-bold text-emerald-400 text-sm">${emoji} ${veh.name}</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${veh.status === 'EMERGENCY' ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-600 text-white'}">
                ${veh.status}
              </span>
            </div>
            <div class="mt-2 space-y-1 text-slate-300 text-[11px]">
              <div class="flex justify-between">
                <span>Speed:</span>
                <span class="font-mono font-bold text-white">${veh.speedKmH} km/h</span>
              </div>
              <div class="flex justify-between">
                <span>Green Corridor:</span>
                <span class="font-mono font-bold ${veh.greenCorridorActive ? 'text-emerald-400' : 'text-slate-500'}">
                  ${veh.greenCorridorActive ? 'ACTIVE ⚡' : 'OFF'}
                </span>
              </div>
              ${veh.destinationName ? `
                <div class="mt-1 pt-1 border-t border-slate-800 text-slate-400 text-[10px]">
                  Target: <span class="text-slate-200">${veh.destinationName}</span>
                </div>
              ` : ''}
            </div>
          </div>
        `);

        marker.on('click', () => {
          setSelectedVehicleId(veh.id);
        });

        layerGroup.addLayer(marker);
      });
    }

  }, [
    roads, 
    signals, 
    facilities, 
    incidents, 
    vehicles, 
    routes, 
    selectedRouteIndex, 
    greenCorridorActive, 
    selectedVehicle, 
    selectedFacility,
    showTrafficDensity, 
    showSignals, 
    showFacilities, 
    showIncidents, 
    showVehicles, 
    showRoutes
  ]);

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex flex-col`}>
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* High-Tech Map Overlay Controls */}
      {showControls && (
        <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800/80 shadow-xl">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 pr-2 border-r border-slate-700/80">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Map Layers</span>
          </div>

          <button
            onClick={() => setShowTrafficDensity(!showTrafficDensity)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              showTrafficDensity 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Traffic Density
          </button>

          <button
            onClick={() => setShowSignals(!showSignals)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              showSignals 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Signals ({signals.length})
          </button>

          <button
            onClick={() => setShowFacilities(!showFacilities)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              showFacilities 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Facilities ({facilities.length})
          </button>

          <button
            onClick={() => setShowIncidents(!showIncidents)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              showIncidents 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]' 
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            Incidents ({incidents.filter(i => i.status !== 'RESOLVED').length})
          </button>

          <button
            onClick={() => setShowVehicles(!showVehicles)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              showVehicles 
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            Emergency Units ({vehicles.length})
          </button>
        </div>
      )}

      {/* Floating Status Badges & Quick Stats */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
        {greenCorridorActive && (
          <div className="flex items-center gap-2 bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] backdrop-blur-md animate-pulse">
            <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>AI GREEN CORRIDOR ENGAGED</span>
          </div>
        )}

        <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800/80 px-3 py-1.5 rounded-xl text-[11px] text-slate-300 flex items-center gap-3 shadow-lg">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
            <span className="font-mono text-emerald-400 font-bold">GRID LIVE</span>
          </div>
          <span className="text-slate-600">|</span>
          <div>Active Fleet: <span className="font-mono font-bold text-white">{vehicles.length}</span></div>
          <span className="text-slate-600">|</span>
          <div>Corridor Latency: <span className="font-mono text-cyan-400">12ms</span></div>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-950/90 backdrop-blur-md border border-slate-800/80 px-3 py-2 rounded-xl text-[11px] text-slate-300 shadow-xl hidden md:flex items-center gap-4">
        <span className="font-bold text-slate-400 text-[10px] tracking-wider uppercase">Legend</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1 bg-emerald-400 rounded"></div>
          <span>Free Traffic</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1 bg-amber-400 rounded"></div>
          <span>Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1 bg-orange-500 rounded"></div>
          <span>Congested</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1 bg-rose-500 border-dashed border-t rounded"></div>
          <span>Road Closure</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1 bg-[#00ff9d] shadow-[0_0_8px_#00ff9d] rounded"></div>
          <span className="text-emerald-400 font-semibold">Green Wave Route</span>
        </div>
      </div>
    </div>
  );
};

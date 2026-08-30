import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { 
  EmergencyVehicle, 
  TrafficSignal, 
  RoadSegment, 
  Facility, 
  IncidentReport, 
  RouteOption, 
  VehicleType, 
  Coordinates,
  EmergencyResponseReportData
} from '../types';
import { 
  INITIAL_FACILITIES, 
  INITIAL_SIGNALS, 
  INITIAL_ROADS, 
  INITIAL_VEHICLES, 
  INITIAL_INCIDENTS,
  CITY_CENTER
} from '../data/mockCityData';
import { calculateRoutes, formatEta } from '../services/routeOptimizer';
import { evaluateGreenCorridor, SignalTimelineItem } from '../services/greenCorridor';
import { sounds } from '../services/soundEffects';

export type AppView = 'landing' | 'command_center' | 'driver_hud' | 'citizen_portal' | 'ai_detector';

export interface ToastNotification {
  id: string;
  type: 'emergency' | 'green_corridor' | 'incident' | 'reroute' | 'hospital' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

export interface SimulationState {
  isActive: boolean;
  step: number; // 0 to 12
  stepTitle: string;
  stepDescription: string;
  progressPercent: number;
  reportData: EmergencyResponseReportData | null;
}

interface AppContextType {
  // Navigation / View
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Sound
  isMuted: boolean;
  toggleSound: () => void;

  // Core Data
  facilities: Facility[];
  signals: TrafficSignal[];
  roads: RoadSegment[];
  vehicles: EmergencyVehicle[];
  incidents: IncidentReport[];

  // Selection & Focus
  selectedVehicleId: string;
  setSelectedVehicleId: (id: string) => void;
  selectedVehicle: EmergencyVehicle;
  selectedFacilityId: string;
  setSelectedFacilityId: (id: string) => void;
  selectedFacility: Facility | undefined;
  focusedCoordinates: Coordinates;
  setFocusedCoordinates: (coords: Coordinates) => void;

  // Routes
  routes: RouteOption[];
  activeRoute: RouteOption | null;
  selectedRouteIndex: number;
  setSelectedRouteIndex: (idx: number) => void;
  recalculateActiveRoutes: () => void;

  // Green Corridor
  greenCorridorActive: boolean;
  toggleGreenCorridor: () => void;
  signalTimeline: SignalTimelineItem[];

  // Driver HUD Specifics
  driverVehicleType: VehicleType;
  setDriverVehicleType: (type: VehicleType) => void;
  isPrioritySosActive: boolean;
  togglePrioritySos: () => void;
  currentManeuverIndex: number;
  advanceManeuver: () => void;

  // Incident Actions
  addIncident: (incident: Omit<IncidentReport, 'id' | 'reportedAt'>) => void;
  resolveIncident: (id: string) => void;
  toggleRoadBlockage: (roadId: string) => void;
  updateRoadCongestion: (roadId: string, congestion: number) => void;

  // Signal Controls
  overrideSignalState: (signalId: string, newState: 'RED' | 'GREEN' | 'PRIORITY_GREEN') => void;

  // Notifications
  notifications: ToastNotification[];
  dismissNotification: (id: string) => void;
  addNotification: (type: ToastNotification['type'], title: string, message: string) => void;

  // 1-Click SIH Simulation
  simulation: SimulationState;
  startAmbulanceSimulation: () => void;
  pauseAmbulanceSimulation: () => void;
  resetAmbulanceSimulation: () => void;
  closeReportModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [facilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [signals, setSignals] = useState<TrafficSignal[]>(INITIAL_SIGNALS);
  const [roads, setRoads] = useState<RoadSegment[]>(INITIAL_ROADS);
  const [vehicles, setVehicles] = useState<EmergencyVehicle[]>(INITIAL_VEHICLES);
  const [incidents, setIncidents] = useState<IncidentReport[]>(INITIAL_INCIDENTS);

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('veh-1');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('hosp-1');
  const [focusedCoordinates, setFocusedCoordinates] = useState<Coordinates>(CITY_CENTER);

  const [driverVehicleType, setDriverVehicleType] = useState<VehicleType>('ambulance');
  const [isPrioritySosActive, setIsPrioritySosActive] = useState<boolean>(false);
  const [currentManeuverIndex, setCurrentManeuverIndex] = useState<number>(0);

  const [greenCorridorActive, setGreenCorridorActive] = useState<boolean>(false);
  const [signalTimeline, setSignalTimeline] = useState<SignalTimelineItem[]>([]);

  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);

  const [notifications, setNotifications] = useState<ToastNotification[]>([
    {
      id: 'notif-init-1',
      type: 'info',
      title: 'ResQRoute AI Active',
      message: 'Smart Traffic Command & Green Wave Engine initialized in Metro Center.',
      timestamp: 'Just now'
    }
  ]);

  const [simulation, setSimulation] = useState<SimulationState>({
    isActive: false,
    step: 0,
    stepTitle: '',
    stepDescription: '',
    progressPercent: 0,
    reportData: null
  });

  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
  const selectedFacility = facilities.find(f => f.id === selectedFacilityId) || facilities[0];

  const addNotification = useCallback((type: ToastNotification['type'], title: string, message: string) => {
    const newNotif: ToastNotification = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 7)]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const toggleSound = useCallback(() => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  // Compute routes whenever selected vehicle/facility/roads/incidents change
  const recalculateActiveRoutes = useCallback(() => {
    if (!selectedVehicle || !selectedFacility) return;
    const computed = calculateRoutes({
      origin: selectedVehicle.currentLocation,
      destination: selectedFacility.location,
      vehicleType: driverVehicleType,
      roads,
      signals,
      incidents
    });
    setRoutes(computed);
  }, [selectedVehicle, selectedFacility, driverVehicleType, roads, signals, incidents]);

  useEffect(() => {
    recalculateActiveRoutes();
  }, [recalculateActiveRoutes]);

  const activeRoute = routes[selectedRouteIndex] || routes[0] || null;

  // Evaluate Green Corridor
  useEffect(() => {
    if (!activeRoute || !greenCorridorActive) {
      setSignalTimeline([]);
      return;
    }
    const { updatedSignals, timeline } = evaluateGreenCorridor(
      selectedVehicle.currentLocation,
      selectedVehicle.speedKmH,
      activeRoute,
      signals
    );
    setSignals(updatedSignals);
    setSignalTimeline(timeline);
  }, [greenCorridorActive, selectedVehicle.currentLocation, selectedVehicle.speedKmH, activeRoute]);

  const toggleGreenCorridor = useCallback(() => {
    setGreenCorridorActive(prev => {
      const next = !prev;
      if (next) {
        sounds.playGreenWaveChime();
        addNotification('green_corridor', '🚑 AI Green Corridor Activated', 'Signals synchronized into green wave priority for ' + selectedVehicle.callSign);
      } else {
        addNotification('info', 'Green Corridor Deactivated', 'Signals restored to standard municipal cycles.');
      }
      return next;
    });
  }, [selectedVehicle.callSign, addNotification]);

  const togglePrioritySos = useCallback(() => {
    setIsPrioritySosActive(prev => {
      const next = !prev;
      if (next) {
        sounds.playEmergencySirenAlert();
        setGreenCorridorActive(true);
        addNotification('emergency', '🚨 SOS EMERGENCY PRIORITY ENGAGED', 'Highest dispatch priority broadcasted to all traffic intersections.');
      } else {
        addNotification('info', 'SOS Mode Disengaged', 'Vehicle returned to standard patrol standby.');
      }
      return next;
    });
  }, [addNotification]);

  const advanceManeuver = useCallback(() => {
    if (!activeRoute) return;
    setCurrentManeuverIndex(prev => {
      const next = prev + 1;
      if (next >= activeRoute.navigationSteps.length) {
        sounds.playArrivalSuccess();
        addNotification('hospital', '🏥 Destination Reached', 'Ambulance arrived safely at ' + selectedFacility.name);
        return prev;
      }
      sounds.playClickBeep();
      return next;
    });
  }, [activeRoute, selectedFacility.name, addNotification]);

  const addIncident = useCallback((incident: Omit<IncidentReport, 'id' | 'reportedAt'>) => {
    const newInc: IncidentReport = {
      ...incident,
      id: 'inc-' + Date.now(),
      reportedAt: 'Just now'
    };
    setIncidents(prev => [newInc, ...prev]);
    sounds.playRerouteChirp();
    addNotification('incident', '🚨 New Incident Logged: ' + newInc.title, newInc.locationName + ' - AI re-evaluating optimal routes.');
    setFocusedCoordinates(newInc.location);
  }, [addNotification]);

  const resolveIncident = useCallback((id: string) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'RESOLVED' as const } : inc));
    addNotification('info', 'Incident Marked Resolved', 'Road clearance confirmed by traffic patrol.');
  }, [addNotification]);

  const toggleRoadBlockage = useCallback((roadId: string) => {
    setRoads(prev => prev.map(r => {
      if (r.id === roadId) {
        const nextBlocked = !r.isBlocked;
        return {
          ...r,
          isBlocked: nextBlocked,
          congestionPercent: nextBlocked ? 100 : 25,
          currentSpeedKmH: nextBlocked ? 0 : 45
        };
      }
      return r;
    }));
    sounds.playRerouteChirp();
    addNotification('reroute', '🔄 Road Closure Status Updated', 'AI route weights updated across all city sectors.');
  }, [addNotification]);

  const updateRoadCongestion = useCallback((roadId: string, congestion: number) => {
    setRoads(prev => prev.map(r => r.id === roadId ? { ...r, congestionPercent: congestion } : r));
  }, []);

  const overrideSignalState = useCallback((signalId: string, newState: 'RED' | 'GREEN' | 'PRIORITY_GREEN') => {
    setSignals(prev => prev.map(s => s.id === signalId ? { ...s, state: newState, isGreenCorridorLocked: newState === 'PRIORITY_GREEN' } : s));
    sounds.playClickBeep();
    addNotification('info', 'Traffic Signal Manual Override', `Signal ${signalId} set to ${newState}`);
  }, [addNotification]);

  // Periodic subtle background simulation updates (traffic density fluctuation, signal clock ticks)
  useEffect(() => {
    const interval = setInterval(() => {
      // Tick signal timers
      setSignals(prev => prev.map(s => {
        if (s.isGreenCorridorLocked) {
          return { ...s, timerSeconds: Math.max(1, s.timerSeconds - 1) };
        }
        if (s.timerSeconds <= 1) {
          const nextState = s.state === 'GREEN' ? 'YELLOW' : (s.state === 'YELLOW' ? 'RED' : 'GREEN');
          const nextTimer = nextState === 'YELLOW' ? 4 : (nextState === 'RED' ? 25 : 35);
          return { ...s, state: nextState, timerSeconds: nextTimer };
        }
        return { ...s, timerSeconds: s.timerSeconds - 1 };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 1-Click SIH Live Presentation Demo Automation
  const startAmbulanceSimulation = useCallback(() => {
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);

    // Switch view to command center or driver hud so user sees action
    setCurrentView('command_center');
    setSelectedVehicleId('veh-1');
    setSelectedFacilityId('hosp-1');
    setGreenCorridorActive(false);
    setIsPrioritySosActive(false);

    // Reset vehicle to start
    setVehicles(prev => prev.map(v => v.id === 'veh-1' ? {
      ...v,
      currentLocation: { lat: 28.6210, lng: 77.2040 },
      status: 'EMERGENCY',
      speedKmH: 0,
      etaSeconds: 462,
      greenCorridorActive: false
    } : v));

    setSimulation({
      isActive: true,
      step: 1,
      stepTitle: '🚨 Stage 1: Critical Emergency Call Received',
      stepDescription: 'Incoming emergency call from Sector 4: Severe cardiac patient requiring immediate trauma admission.',
      progressPercent: 5,
      reportData: null
    });

    sounds.playEmergencySirenAlert();
    addNotification('emergency', '🚨 CODE RED: Emergency Call Dispatched', 'Ambulance AMB-07 designated to Sector 4 incident.');

    let currentStep = 1;
    let progress = 5;

    simIntervalRef.current = setInterval(() => {
      currentStep += 1;
      progress = Math.min(100, Math.round((currentStep / 12) * 100));

      if (currentStep === 2) {
        setSimulation(prev => ({
          ...prev,
          step: 2,
          stepTitle: '🏥 Stage 2: Destination Locked & ICU Reserved',
          stepDescription: 'Selected Apex Super-Speciality Trauma Centre (14 ICU beds available, Level 1 Trauma Care).',
          progressPercent: progress
        }));
        addNotification('hospital', '🏥 Destination Confirmed', 'Apex Trauma Centre notified. Emergency Bay 01 cleared.');
      } else if (currentStep === 3) {
        setSimulation(prev => ({
          ...prev,
          step: 3,
          stepTitle: '🔍 Stage 3: AI Grid Analysis & Hazard Detection',
          stepDescription: 'AI scanned 25 road segments. Detected multi-car collision & roadblock on Vikas Marg Underpass.',
          progressPercent: progress
        }));
        sounds.playRerouteChirp();
        addNotification('incident', '⚠️ Hazard Identified on Grid', 'Vikas Marg blocked. Weighted AI avoiding hazardous sector.');
      } else if (currentStep === 4) {
        setSimulation(prev => ({
          ...prev,
          step: 4,
          stepTitle: '🧠 Stage 4: Multi-Factor Route Optimization',
          stepDescription: 'Weighted engine evaluated 3 corridors across travel time (40%), congestion (25%), risk (15%), distance (10%), blockage (10%).',
          progressPercent: progress
        }));
      } else if (currentStep === 5) {
        setSelectedRouteIndex(0);
        setSimulation(prev => ({
          ...prev,
          step: 5,
          stepTitle: '✨ Stage 5: Optimal Corridor Alpha Selected',
          stepDescription: 'Corridor Alpha (Copernicus Flyover) chosen: 4.8 km, 28% lower congestion, saves 4m 24s compared to alternative.',
          progressPercent: progress
        }));
        addNotification('reroute', '✨ AI Route Computed', 'Fastest route selected via Copernicus Flyover.');
      } else if (currentStep === 6) {
        setGreenCorridorActive(true);
        sounds.playGreenWaveChime();
        setSimulation(prev => ({
          ...prev,
          step: 6,
          stepTitle: '🟢 Stage 6: AI Green Corridor Activated',
          stepDescription: '5 Smart Traffic Signals synchronized into priority green wave along vehicle trajectory.',
          progressPercent: progress
        }));
        addNotification('green_corridor', '🟢 AI Green Corridor Active', 'Signals 01, 02, 04, 05, 06 locked for emergency pass.');
      } else if (currentStep === 7) {
        // Vehicle starts moving
        setVehicles(prev => prev.map(v => v.id === 'veh-1' ? {
          ...v,
          status: 'EN_ROUTE',
          speedKmH: 54,
          currentLocation: { lat: 28.6250, lng: 77.2175 },
          greenCorridorActive: true
        } : v));
        setFocusedCoordinates({ lat: 28.6250, lng: 77.2175 });
        setSimulation(prev => ({
          ...prev,
          step: 7,
          stepTitle: '🚑 Stage 7: Ambulance En-Route (Speed: 54 km/h)',
          stepDescription: 'Smooth traversal through Connaught Radial (Signal 01) & Barakhamba Junction (Signal 02).',
          progressPercent: progress
        }));
      } else if (currentStep === 8) {
        // Inject sudden roadblock mid-way
        setVehicles(prev => prev.map(v => v.id === 'veh-1' ? {
          ...v,
          currentLocation: { lat: 28.6292, lng: 77.2245 },
          speedKmH: 52
        } : v));
        setFocusedCoordinates({ lat: 28.6292, lng: 77.2245 });
        setSimulation(prev => ({
          ...prev,
          step: 8,
          stepTitle: '⚠️ Stage 8: Mid-Route Event Injected',
          stepDescription: 'Live CCTV AI detected sudden stalled tanker near Mandi House. Dynamic re-scoring triggered in real-time.',
          progressPercent: progress
        }));
        sounds.playRerouteChirp();
        addNotification('reroute', '🔄 Real-Time Dynamic Reroute', 'AI adjusted trajectory across Copernicus Flyover upper ramp.');
      } else if (currentStep === 9) {
        setVehicles(prev => prev.map(v => v.id === 'veh-1' ? {
          ...v,
          currentLocation: { lat: 28.6328, lng: 77.2300 },
          speedKmH: 58,
          etaSeconds: 120
        } : v));
        setFocusedCoordinates({ lat: 28.6328, lng: 77.2300 });
        setSimulation(prev => ({
          ...prev,
          step: 9,
          stepTitle: '⚡ Stage 9: Flying Past Copernicus Overpass',
          stepDescription: 'Elevated flyover cleared with continuous Green Wave priority lock on Signal 05.',
          progressPercent: progress
        }));
      } else if (currentStep === 10) {
        setVehicles(prev => prev.map(v => v.id === 'veh-1' ? {
          ...v,
          currentLocation: { lat: 28.6362, lng: 77.2326 },
          speedKmH: 42,
          etaSeconds: 40
        } : v));
        setFocusedCoordinates({ lat: 28.6362, lng: 77.2326 });
        setSimulation(prev => ({
          ...prev,
          step: 10,
          stepTitle: '🏥 Stage 10: Entering Hospital Emergency Corridor',
          stepDescription: 'Signal 06 holding Priority Green. Trauma resuscitation squad alerted and standing by.',
          progressPercent: progress
        }));
      } else if (currentStep === 11) {
        setVehicles(prev => prev.map(v => v.id === 'veh-1' ? {
          ...v,
          currentLocation: { lat: 28.6385, lng: 77.2320 },
          status: 'ARRIVED',
          speedKmH: 0,
          etaSeconds: 0,
          greenCorridorActive: false
        } : v));
        setFocusedCoordinates({ lat: 28.6385, lng: 77.2320 });
        setGreenCorridorActive(false);
        sounds.playArrivalSuccess();
        setSimulation(prev => ({
          ...prev,
          step: 11,
          stepTitle: '🏁 Stage 11: Safely Arrived at Trauma Centre!',
          stepDescription: 'Patient successfully handed over to Emergency Critical Care team.',
          progressPercent: progress
        }));
        addNotification('hospital', '✅ Emergency Complete', 'Ambulance AMB-07 reached Trauma Centre in 07:18 (4m 24s saved).');
      } else if (currentStep >= 12) {
        if (simIntervalRef.current) clearInterval(simIntervalRef.current);
        const reportData: EmergencyResponseReportData = {
          incidentId: 'INC-SIM-07',
          vehicleId: 'veh-1',
          vehicleCallSign: 'AMB-07 (ALS)',
          startLocationName: 'Sector 4 Emergency Point (Kingsway)',
          destinationName: 'Apex Super-Speciality Trauma Centre',
          initialEtaFormatted: '11:42',
          initialEtaSeconds: 702,
          optimizedEtaFormatted: '07:18',
          optimizedEtaSeconds: 438,
          timeSavedFormatted: '04:24',
          timeSavedSeconds: 264,
          efficiencyGainPercent: 37.5,
          distanceTravelledKm: 4.8,
          signalsOptimizedCount: 6,
          incidentsAvoidedCount: 2,
          averageSpeedKmH: 52.4,
          carbonEmissionSavedKg: 1.84,
          timestamp: new Date().toLocaleTimeString()
        };

        setSimulation(prev => ({
          ...prev,
          isActive: false,
          step: 12,
          stepTitle: '📊 Stage 12: Emergency Analytics Report Generated',
          stepDescription: 'Comprehensive performance breakdown ready for presentation.',
          progressPercent: 100,
          reportData
        }));
      }
    }, 2800); // 2.8s per stage for engaging, smooth demo presentation
  }, [addNotification]);

  const pauseAmbulanceSimulation = useCallback(() => {
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
    setSimulation(prev => ({ ...prev, isActive: false }));
  }, []);

  const resetAmbulanceSimulation = useCallback(() => {
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
    setSimulation({
      isActive: false,
      step: 0,
      stepTitle: '',
      stepDescription: '',
      progressPercent: 0,
      reportData: null
    });
    setGreenCorridorActive(false);
    setIsPrioritySosActive(false);
    setVehicles(INITIAL_VEHICLES);
    setSignals(INITIAL_SIGNALS);
    setRoads(INITIAL_ROADS);
  }, []);

  const closeReportModal = useCallback(() => {
    setSimulation(prev => ({ ...prev, reportData: null }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        isMuted,
        toggleSound,
        facilities,
        signals,
        roads,
        vehicles,
        incidents,
        selectedVehicleId,
        setSelectedVehicleId,
        selectedVehicle,
        selectedFacilityId,
        setSelectedFacilityId,
        selectedFacility,
        focusedCoordinates,
        setFocusedCoordinates,
        routes,
        activeRoute,
        selectedRouteIndex,
        setSelectedRouteIndex,
        recalculateActiveRoutes,
        greenCorridorActive,
        toggleGreenCorridor,
        signalTimeline,
        driverVehicleType,
        setDriverVehicleType,
        isPrioritySosActive,
        togglePrioritySos,
        currentManeuverIndex,
        advanceManeuver,
        addIncident,
        resolveIncident,
        toggleRoadBlockage,
        updateRoadCongestion,
        overrideSignalState,
        notifications,
        dismissNotification,
        addNotification,
        simulation,
        startAmbulanceSimulation,
        pauseAmbulanceSimulation,
        resetAmbulanceSimulation,
        closeReportModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

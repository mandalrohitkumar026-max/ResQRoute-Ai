export type VehicleType = 'ambulance' | 'fire_truck' | 'police';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type SignalState = 'RED' | 'YELLOW' | 'GREEN' | 'PRIORITY_GREEN';

export type IncidentType = 
  | 'accident' 
  | 'road_blockage' 
  | 'pothole' 
  | 'traffic_congestion' 
  | 'flooded_road' 
  | 'vehicle_breakdown';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface EmergencyVehicle {
  id: string;
  name: string;
  type: VehicleType;
  callSign: string;
  status: 'EMERGENCY' | 'EN_ROUTE' | 'STANDBY' | 'ARRIVED';
  speedKmH: number;
  currentLocation: Coordinates;
  heading: number; // in degrees
  destinationId?: string;
  destinationName?: string;
  destinationCoords?: Coordinates;
  assignedRouteId?: string;
  etaSeconds: number;
  greenCorridorActive: boolean;
  batteryOrFuelPercent: number;
  assignedIncidentId?: string;
}

export interface TrafficSignal {
  id: string;
  name: string;
  location: Coordinates;
  state: SignalState;
  timerSeconds: number;
  normalCycleSeconds: number;
  roadName: string;
  isGreenCorridorLocked: boolean;
  lockedByVehicleId?: string;
  countdownToGreen?: number;
  junctionType: '4-way' | '3-way' | 'rotary' | 'highway_merge';
}

export interface RoadSegment {
  id: string;
  name: string;
  startCoords: Coordinates;
  endCoords: Coordinates;
  path: [number, number][]; // lat, lng points
  lengthKm: number;
  speedLimitKmH: number;
  currentSpeedKmH: number;
  congestionPercent: number; // 0 - 100
  laneCount: number;
  isBlocked: boolean;
  blockageReason?: string;
  riskFactor: number; // 0.0 - 1.0
  surfaceQuality: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'POOR';
  weatherImpact: 'NONE' | 'RAIN' | 'FOG' | 'WATERLOGGED';
}

export interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'fire_station' | 'police_station';
  location: Coordinates;
  address: string;
  contactNumber: string;
  capacityStatus: 'AVAILABLE' | 'HIGH_DEMAND' | 'FULL';
  icuBedsAvailable?: number;
  traumaLevel?: string;
  activeUnitsCount: number;
}

export interface IncidentReport {
  id: string;
  title: string;
  type: IncidentType;
  severity: PriorityLevel;
  location: Coordinates;
  locationName: string;
  distanceKm?: number;
  etaToArrival?: string;
  reportedAt: string;
  reporter: 'CITIZEN' | 'AI_VISION' | 'TRAFFIC_POLICE' | 'SYSTEM_SENSOR';
  confidenceScore?: number; // percentage, e.g., 94%
  imageUrl?: string;
  description: string;
  status: 'REPORTED' | 'DISPATCHED' | 'IN_PROGRESS' | 'RESOLVED';
  recommendedActions: string[];
  affectedRoadIds: string[];
}

export interface NavigationStep {
  id: string;
  instruction: string;
  distanceMeters: number;
  durationSeconds: number;
  turnDirection: 'straight' | 'left' | 'right' | 'slight_left' | 'slight_right' | 'u_turn' | 'arrive';
  streetName: string;
  signalId?: string;
  isCompleted?: boolean;
}

export interface RouteOption {
  id: string;
  name: string;
  isRecommended: boolean;
  distanceKm: number;
  durationSeconds: number;
  etaFormatted: string;
  trafficDensityPercent: number;
  trafficLevel: 'Low' | 'Medium' | 'High' | 'Severe';
  roadRiskLevel: 'Low' | 'Medium' | 'High';
  roadRiskScore: number;
  roadBlockagesCount: number;
  signalsCount: number;
  signalsOnRoute: string[]; // signal IDs
  pathCoordinates: [number, number][];
  routeScore: number; // calculated score based on weights
  aiExplanation: string;
  scoreBreakdown: {
    travelTimeScore: number;
    trafficScore: number;
    riskScore: number;
    distanceScore: number;
    blockageScore: number;
  };
  navigationSteps: NavigationStep[];
}

export interface EmergencyResponseReportData {
  incidentId: string;
  vehicleId: string;
  vehicleCallSign: string;
  startLocationName: string;
  destinationName: string;
  initialEtaFormatted: string;
  initialEtaSeconds: number;
  optimizedEtaFormatted: string;
  optimizedEtaSeconds: number;
  timeSavedFormatted: string;
  timeSavedSeconds: number;
  efficiencyGainPercent: number;
  distanceTravelledKm: number;
  signalsOptimizedCount: number;
  incidentsAvoidedCount: number;
  averageSpeedKmH: number;
  carbonEmissionSavedKg: number;
  timestamp: string;
}

export interface TrafficForecastHour {
  timeLabel: string;
  predictedCongestionPercent: number;
  historicalAveragePercent: number;
  weatherRisk: 'Clear' | 'Rain' | 'Fog' | 'Peak Rush';
}

export interface VisionDetectionResult {
  detected: boolean;
  hazardType: IncidentType;
  label: string;
  confidence: number;
  severity: PriorityLevel;
  boundingBoxes: {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    confidence: number;
  }[];
  recommendedActions: string[];
  estimatedDelayMinutes: number;
}

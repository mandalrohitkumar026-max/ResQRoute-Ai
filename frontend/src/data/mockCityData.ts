import { 
  EmergencyVehicle, 
  TrafficSignal, 
  RoadSegment, 
  Facility, 
  IncidentReport, 
  TrafficForecastHour 
} from '../types';

export const CITY_CENTER = { lat: 28.6280, lng: 77.2180 };

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'hosp-1',
    name: 'Apex Super-Speciality & Trauma Centre',
    type: 'hospital',
    location: { lat: 28.6385, lng: 77.2320 },
    address: 'Sector 9, Medical Corridor',
    contactNumber: '+91 11 4055 9901',
    capacityStatus: 'AVAILABLE',
    icuBedsAvailable: 14,
    traumaLevel: 'Level 1 Trauma Care',
    activeUnitsCount: 4
  },
  {
    id: 'hosp-2',
    name: 'Metro City General Hospital',
    type: 'hospital',
    location: { lat: 28.6210, lng: 77.2040 },
    address: 'Kingsway Avenue, Downtown West',
    contactNumber: '+91 11 4022 8844',
    capacityStatus: 'HIGH_DEMAND',
    icuBedsAvailable: 3,
    traumaLevel: 'Level 2 Trauma Care',
    activeUnitsCount: 2
  },
  {
    id: 'hosp-3',
    name: 'St. Jude Critical Care Institute',
    type: 'hospital',
    location: { lat: 28.6440, lng: 77.2120 },
    address: 'North Tech Zone, Outer Ring',
    contactNumber: '+91 11 4899 3300',
    capacityStatus: 'AVAILABLE',
    icuBedsAvailable: 9,
    traumaLevel: 'Level 1 Trauma Care',
    activeUnitsCount: 3
  },
  {
    id: 'hosp-4',
    name: 'Greenfield Emergency Medical Center',
    type: 'hospital',
    location: { lat: 28.6150, lng: 77.2390 },
    address: 'East River Road, Sector 3',
    contactNumber: '+91 11 4233 1188',
    capacityStatus: 'AVAILABLE',
    icuBedsAvailable: 18,
    traumaLevel: 'Level 2 Trauma Care',
    activeUnitsCount: 1
  },
  {
    id: 'hosp-5',
    name: 'Lifeline Heart & Children Hospital',
    type: 'hospital',
    location: { lat: 28.6320, lng: 77.2460 },
    address: 'Eastern Bypass, Near Eco Park',
    contactNumber: '+91 11 4988 7722',
    capacityStatus: 'FULL',
    icuBedsAvailable: 0,
    traumaLevel: 'Specialized Cardiac',
    activeUnitsCount: 0
  },
  {
    id: 'fire-1',
    name: 'Central Fire HQ & Rescue Station',
    type: 'fire_station',
    location: { lat: 28.6260, lng: 77.2150 },
    address: 'Central Square, Gate 4',
    contactNumber: '101',
    capacityStatus: 'AVAILABLE',
    activeUnitsCount: 6
  },
  {
    id: 'fire-2',
    name: 'Industrial Zone Fire Brigade',
    type: 'fire_station',
    location: { lat: 28.6420, lng: 77.2410 },
    address: 'East Hub, Logistics Way',
    contactNumber: '101-EXT-2',
    capacityStatus: 'AVAILABLE',
    activeUnitsCount: 3
  },
  {
    id: 'fire-3',
    name: 'South Sector Fire Depot',
    type: 'fire_station',
    location: { lat: 28.6120, lng: 77.2190 },
    address: 'South Ring Radial, Sector 12',
    contactNumber: '101-EXT-3',
    capacityStatus: 'AVAILABLE',
    activeUnitsCount: 4
  },
  {
    id: 'pol-1',
    name: 'City Police Command Headquarters',
    type: 'police_station',
    location: { lat: 28.6295, lng: 77.2240 },
    address: 'Civic Centre Boulevard',
    contactNumber: '112',
    capacityStatus: 'AVAILABLE',
    activeUnitsCount: 12
  },
  {
    id: 'pol-2',
    name: 'North Ring Traffic Patrol Base',
    type: 'police_station',
    location: { lat: 28.6460, lng: 77.2280 },
    address: 'Grand Trunk Expressway Junction',
    contactNumber: '112-EXT-8',
    capacityStatus: 'AVAILABLE',
    activeUnitsCount: 5
  },
  {
    id: 'pol-3',
    name: 'West Precinct Police Post',
    type: 'police_station',
    location: { lat: 28.6180, lng: 77.2080 },
    address: 'Old Cantonment Road',
    contactNumber: '112-EXT-5',
    capacityStatus: 'AVAILABLE',
    activeUnitsCount: 4
  }
];

export const INITIAL_SIGNALS: TrafficSignal[] = [
  {
    id: 'sig-1',
    name: 'Signal 01 — Connaught Radial',
    location: { lat: 28.6230, lng: 77.2140 },
    state: 'GREEN',
    timerSeconds: 35,
    normalCycleSeconds: 60,
    roadName: 'Radial Ave & Central Cross',
    isGreenCorridorLocked: false,
    junctionType: '4-way'
  },
  {
    id: 'sig-2',
    name: 'Signal 02 — Barakhamba Junction',
    location: { lat: 28.6275, lng: 77.2220 },
    state: 'RED',
    timerSeconds: 18,
    normalCycleSeconds: 60,
    roadName: 'Barakhamba Marg & KG Marg',
    isGreenCorridorLocked: false,
    junctionType: '4-way'
  },
  {
    id: 'sig-3',
    name: 'Signal 03 — Tolstoy Marg Crossing',
    location: { lat: 28.6250, lng: 77.2200 },
    state: 'GREEN',
    timerSeconds: 42,
    normalCycleSeconds: 60,
    roadName: 'Tolstoy Marg',
    isGreenCorridorLocked: false,
    junctionType: '4-way'
  },
  {
    id: 'sig-4',
    name: 'Signal 04 — Mandi House Rotary',
    location: { lat: 28.6310, lng: 77.2270 },
    state: 'RED',
    timerSeconds: 24,
    normalCycleSeconds: 75,
    roadName: 'Copernicus Marg & Sikandra Rd',
    isGreenCorridorLocked: false,
    junctionType: 'rotary'
  },
  {
    id: 'sig-5',
    name: 'Signal 05 — ITO Expressway Entry',
    location: { lat: 28.6340, lng: 77.2330 },
    state: 'GREEN',
    timerSeconds: 50,
    normalCycleSeconds: 80,
    roadName: 'Vikas Marg & Bahadur Shah Zafar Marg',
    isGreenCorridorLocked: false,
    junctionType: '4-way'
  },
  {
    id: 'sig-6',
    name: 'Signal 06 — Trauma Hospital Gate 1',
    location: { lat: 28.6375, lng: 77.2315 },
    state: 'RED',
    timerSeconds: 12,
    normalCycleSeconds: 45,
    roadName: 'Hospital Emergency Corridor',
    isGreenCorridorLocked: false,
    junctionType: '3-way'
  },
  {
    id: 'sig-7',
    name: 'Signal 07 — North Expressway Junction',
    location: { lat: 28.6410, lng: 77.2210 },
    state: 'RED',
    timerSeconds: 29,
    normalCycleSeconds: 60,
    roadName: 'North Ring Radial',
    isGreenCorridorLocked: false,
    junctionType: 'highway_merge'
  },
  {
    id: 'sig-8',
    name: 'Signal 08 — St. Jude Medical Link',
    location: { lat: 28.6435, lng: 77.2160 },
    state: 'GREEN',
    timerSeconds: 38,
    normalCycleSeconds: 60,
    roadName: 'Tech Boulevard',
    isGreenCorridorLocked: false,
    junctionType: '4-way'
  },
  {
    id: 'sig-9',
    name: 'Signal 09 — Riverfront Eastern Link',
    location: { lat: 28.6220, lng: 77.2360 },
    state: 'RED',
    timerSeconds: 15,
    normalCycleSeconds: 60,
    roadName: 'East River Road & Sector 3 Bridge',
    isGreenCorridorLocked: false,
    junctionType: '4-way'
  },
  {
    id: 'sig-10',
    name: 'Signal 10 — Civic Centre Radial',
    location: { lat: 28.6300, lng: 77.2180 },
    state: 'GREEN',
    timerSeconds: 28,
    normalCycleSeconds: 60,
    roadName: 'Parliament St & Ashoka Rd',
    isGreenCorridorLocked: false,
    junctionType: '4-way'
  }
];

export const INITIAL_ROADS: RoadSegment[] = [
  {
    id: 'rd-1',
    name: 'Kingsway Arterial',
    startCoords: { lat: 28.6210, lng: 77.2040 },
    endCoords: { lat: 28.6230, lng: 77.2140 },
    path: [[28.6210, 77.2040], [28.6218, 77.2085], [28.6230, 77.2140]],
    lengthKm: 1.2,
    speedLimitKmH: 50,
    currentSpeedKmH: 42,
    congestionPercent: 28,
    laneCount: 3,
    isBlocked: false,
    riskFactor: 0.15,
    surfaceQuality: 'EXCELLENT',
    weatherImpact: 'NONE'
  },
  {
    id: 'rd-2',
    name: 'Central Boulevard Radial',
    startCoords: { lat: 28.6230, lng: 77.2140 },
    endCoords: { lat: 28.6275, lng: 77.2220 },
    path: [[28.6230, 77.2140], [28.6250, 77.2175], [28.6275, 77.2220]],
    lengthKm: 1.1,
    speedLimitKmH: 60,
    currentSpeedKmH: 48,
    congestionPercent: 32,
    laneCount: 4,
    isBlocked: false,
    riskFactor: 0.12,
    surfaceQuality: 'EXCELLENT',
    weatherImpact: 'NONE'
  },
  {
    id: 'rd-3',
    name: 'Barakhamba Emergency Transit',
    startCoords: { lat: 28.6275, lng: 77.2220 },
    endCoords: { lat: 28.6310, lng: 77.2270 },
    path: [[28.6275, 77.2220], [28.6292, 77.2245], [28.6310, 77.2270]],
    lengthKm: 0.85,
    speedLimitKmH: 50,
    currentSpeedKmH: 45,
    congestionPercent: 25,
    laneCount: 3,
    isBlocked: false,
    riskFactor: 0.10,
    surfaceQuality: 'EXCELLENT',
    weatherImpact: 'NONE'
  },
  {
    id: 'rd-4',
    name: 'Copernicus Medical Flyover',
    startCoords: { lat: 28.6310, lng: 77.2270 },
    endCoords: { lat: 28.6340, lng: 77.2330 },
    path: [[28.6310, 77.2270], [28.6328, 77.2300], [28.6340, 77.2330]],
    lengthKm: 0.95,
    speedLimitKmH: 60,
    currentSpeedKmH: 54,
    congestionPercent: 18,
    laneCount: 3,
    isBlocked: false,
    riskFactor: 0.08,
    surfaceQuality: 'EXCELLENT',
    weatherImpact: 'NONE'
  },
  {
    id: 'rd-5',
    name: 'Trauma Centre Direct Corridor',
    startCoords: { lat: 28.6340, lng: 77.2330 },
    endCoords: { lat: 28.6385, lng: 77.2320 },
    path: [[28.6340, 77.2330], [28.6362, 77.2326], [28.6385, 77.2320]],
    lengthKm: 0.7,
    speedLimitKmH: 45,
    currentSpeedKmH: 40,
    congestionPercent: 20,
    laneCount: 2,
    isBlocked: false,
    riskFactor: 0.05,
    surfaceQuality: 'EXCELLENT',
    weatherImpact: 'NONE'
  },
  // Alternative routes with roadblocks & heavy traffic
  {
    id: 'rd-alt-1',
    name: 'Old Ring Road (Bottleneck Zone)',
    startCoords: { lat: 28.6230, lng: 77.2140 },
    endCoords: { lat: 28.6300, lng: 77.2180 },
    path: [[28.6230, 77.2140], [28.6260, 77.2155], [28.6300, 77.2180]],
    lengthKm: 1.4,
    speedLimitKmH: 40,
    currentSpeedKmH: 14,
    congestionPercent: 78,
    laneCount: 2,
    isBlocked: false,
    riskFactor: 0.65,
    surfaceQuality: 'MODERATE',
    weatherImpact: 'NONE'
  },
  {
    id: 'rd-alt-2',
    name: 'North Ring Radial',
    startCoords: { lat: 28.6300, lng: 77.2180 },
    endCoords: { lat: 28.6385, lng: 77.2320 },
    path: [[28.6300, 77.2180], [28.6360, 77.2210], [28.6400, 77.2270], [28.6385, 77.2320]],
    lengthKm: 2.3,
    speedLimitKmH: 50,
    currentSpeedKmH: 22,
    congestionPercent: 64,
    laneCount: 3,
    isBlocked: false,
    riskFactor: 0.45,
    surfaceQuality: 'GOOD',
    weatherImpact: 'NONE'
  },
  {
    id: 'rd-blocked-1',
    name: 'Vikas Marg Underpass',
    startCoords: { lat: 28.6275, lng: 77.2220 },
    endCoords: { lat: 28.6385, lng: 77.2320 },
    path: [[28.6275, 77.2220], [28.6310, 77.2350], [28.6385, 77.2320]],
    lengthKm: 1.8,
    speedLimitKmH: 50,
    currentSpeedKmH: 0,
    congestionPercent: 100,
    laneCount: 2,
    isBlocked: true,
    blockageReason: 'Multi-car collision & oil spill under flyover',
    riskFactor: 0.95,
    surfaceQuality: 'POOR',
    weatherImpact: 'NONE'
  }
];

export const INITIAL_VEHICLES: EmergencyVehicle[] = [
  {
    id: 'veh-1',
    name: 'Ambulance Unit 07 (ALS)',
    type: 'ambulance',
    callSign: 'AMB-07',
    status: 'STANDBY',
    speedKmH: 0,
    currentLocation: { lat: 28.6210, lng: 77.2040 },
    heading: 45,
    destinationId: 'hosp-1',
    destinationName: 'Apex Super-Speciality & Trauma Centre',
    destinationCoords: { lat: 28.6385, lng: 77.2320 },
    etaSeconds: 462, // 7 min 42s
    greenCorridorActive: false,
    batteryOrFuelPercent: 92
  },
  {
    id: 'veh-2',
    name: 'Ambulance Unit 02 (Cardiac)',
    type: 'ambulance',
    callSign: 'AMB-02',
    status: 'EN_ROUTE',
    speedKmH: 48,
    currentLocation: { lat: 28.6310, lng: 77.2270 },
    heading: 65,
    destinationId: 'hosp-3',
    destinationName: 'St. Jude Critical Care Institute',
    destinationCoords: { lat: 28.6440, lng: 77.2120 },
    etaSeconds: 310,
    greenCorridorActive: true,
    batteryOrFuelPercent: 84
  },
  {
    id: 'veh-3',
    name: 'Heavy Rescue Engine 01',
    type: 'fire_truck',
    callSign: 'FIRE-01',
    status: 'STANDBY',
    speedKmH: 0,
    currentLocation: { lat: 28.6260, lng: 77.2150 },
    heading: 90,
    etaSeconds: 0,
    greenCorridorActive: false,
    batteryOrFuelPercent: 95
  },
  {
    id: 'veh-4',
    name: 'Traffic Police Interceptor 04',
    type: 'police',
    callSign: 'POL-04',
    status: 'EN_ROUTE',
    speedKmH: 58,
    currentLocation: { lat: 28.6410, lng: 77.2210 },
    heading: 180,
    destinationName: 'North Ring Incident Area',
    destinationCoords: { lat: 28.6300, lng: 77.2180 },
    etaSeconds: 190,
    greenCorridorActive: false,
    batteryOrFuelPercent: 78
  },
  {
    id: 'veh-5',
    name: 'Rapid Response Trauma Unit 11',
    type: 'ambulance',
    callSign: 'AMB-11',
    status: 'STANDBY',
    speedKmH: 0,
    currentLocation: { lat: 28.6150, lng: 77.2390 },
    heading: 320,
    destinationId: 'hosp-4',
    destinationName: 'Greenfield Emergency Medical Center',
    destinationCoords: { lat: 28.6150, lng: 77.2390 },
    etaSeconds: 0,
    greenCorridorActive: false,
    batteryOrFuelPercent: 88
  }
];

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'inc-1',
    title: 'Severe 3-Vehicle Collision & Fuel Leak',
    type: 'accident',
    severity: 'CRITICAL',
    location: { lat: 28.6290, lng: 77.2285 },
    locationName: 'Vikas Marg Underpass, Pillar 42',
    distanceKm: 2.4,
    etaToArrival: '04:15',
    reportedAt: '3 mins ago',
    reporter: 'AI_VISION',
    confidenceScore: 96,
    description: 'Two passenger sedans collided with a commercial truck; fluid leak detected on roadway.',
    status: 'DISPATCHED',
    recommendedActions: [
      'Redirect emergency traffic to Copernicus Flyover',
      'Alert Traffic Command to lock Vikas Marg eastbound',
      'Auto-recalculate active emergency routes'
    ],
    affectedRoadIds: ['rd-blocked-1']
  },
  {
    id: 'inc-2',
    title: 'Heavy Gridlock & Choke Point',
    type: 'traffic_congestion',
    severity: 'HIGH',
    location: { lat: 28.6245, lng: 77.2150 },
    locationName: 'Old Ring Road Radial, Sector 4',
    distanceKm: 4.1,
    etaToArrival: '08:40',
    reportedAt: '12 mins ago',
    reporter: 'SYSTEM_SENSOR',
    confidenceScore: 91,
    description: 'Vehicle breakdown occupying 2 central lanes; queue extending 800m.',
    status: 'IN_PROGRESS',
    recommendedActions: [
      'Prioritize green cycle on Signal 01 & 03',
      'Divert ambulances to Kingsway Corridor'
    ],
    affectedRoadIds: ['rd-alt-1']
  },
  {
    id: 'inc-3',
    title: 'Deep Asphalt Pothole & Road Hazard',
    type: 'pothole',
    severity: 'MEDIUM',
    location: { lat: 28.6345, lng: 77.2195 },
    locationName: 'North Ring Radial, Lane 1',
    distanceKm: 5.8,
    etaToArrival: '11:20',
    reportedAt: '25 mins ago',
    reporter: 'CITIZEN',
    confidenceScore: 88,
    description: 'Deep trench created by burst water pipeline; slowing speeds to 15 km/h.',
    status: 'REPORTED',
    recommendedActions: [
      'Display hazard warning on driver HUD',
      'Notify Municipal Road Maintenance'
    ],
    affectedRoadIds: ['rd-alt-2']
  },
  {
    id: 'inc-4',
    title: 'Flash Waterlogging after Heavy Rainfall',
    type: 'flooded_road',
    severity: 'MEDIUM',
    location: { lat: 28.6215, lng: 77.2370 },
    locationName: 'East River Road Under-bridge',
    distanceKm: 6.9,
    etaToArrival: '14:50',
    reportedAt: '38 mins ago',
    reporter: 'CITIZEN',
    confidenceScore: 84,
    description: 'Water depth ~ 1.5 ft; sedans cannot pass safely.',
    status: 'REPORTED',
    recommendedActions: [
      'Reroute light vehicles',
      'Deploy drainage pump squad'
    ],
    affectedRoadIds: []
  },
  {
    id: 'inc-5',
    title: 'Commercial Truck Axle Breakdown',
    type: 'vehicle_breakdown',
    severity: 'LOW',
    location: { lat: 28.6430, lng: 77.2350 },
    locationName: 'Outer Ring Eastern Radial',
    distanceKm: 7.8,
    etaToArrival: '18:10',
    reportedAt: '45 mins ago',
    reporter: 'TRAFFIC_POLICE',
    confidenceScore: 99,
    description: 'Truck parked on shoulder with hazard lights on.',
    status: 'IN_PROGRESS',
    recommendedActions: [
      'Traffic tow vehicle dispatched'
    ],
    affectedRoadIds: []
  }
];

export const CCTV_FEED_PRESETS = [
  {
    id: 'cam-1',
    name: 'CCTV-04: Vikas Marg Underpass',
    junctionName: 'Vikas Marg & Copernicus Link',
    location: { lat: 28.6290, lng: 77.2285 },
    hazardType: 'accident' as const,
    severity: 'CRITICAL' as const,
    confidence: 96,
    defaultImage: 'https://images.unsplash.com/photo-1543465077-db45d34b88a5?auto=format&fit=crop&w=800&q=80',
    detectedObjects: [
      { label: 'Damaged Vehicle #1', confidence: 0.98, x: 22, y: 38, width: 32, height: 28 },
      { label: 'Damaged Truck #2', confidence: 0.95, x: 52, y: 30, width: 38, height: 42 },
      { label: 'Fluid Hazard', confidence: 0.91, x: 40, y: 68, width: 24, height: 16 }
    ],
    recommendation: 'Block Vikas Marg eastbound; trigger AI Green Corridor diversion via Copernicus Flyover.'
  },
  {
    id: 'cam-2',
    name: 'CCTV-12: Central Avenue Flyover',
    junctionName: 'Barakhamba Marg & KG Junction',
    location: { lat: 28.6275, lng: 77.2220 },
    hazardType: 'traffic_congestion' as const,
    severity: 'HIGH' as const,
    confidence: 93,
    defaultImage: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    detectedObjects: [
      { label: 'Severe Gridlock Queue', confidence: 0.94, x: 15, y: 25, width: 70, height: 50 },
      { label: 'Stopped Bus', confidence: 0.92, x: 45, y: 40, width: 25, height: 25 }
    ],
    recommendation: 'Extend green wave timing by 25 seconds for approaching AMB-07.'
  },
  {
    id: 'cam-3',
    name: 'CCTV-08: North Ring Radial Roadbed',
    junctionName: 'North Ring & Sector 7 Crossing',
    location: { lat: 28.6345, lng: 77.2195 },
    hazardType: 'pothole' as const,
    severity: 'MEDIUM' as const,
    confidence: 89,
    defaultImage: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    detectedObjects: [
      { label: 'Road Surface Fracture', confidence: 0.89, x: 30, y: 45, width: 40, height: 30 }
    ],
    recommendation: 'Limit emergency vehicle lane to Lane 2 & 3; notify public transit.'
  },
  {
    id: 'cam-4',
    name: 'CCTV-19: Eastern Under-bridge Subway',
    junctionName: 'Riverfront Radial Underpass',
    location: { lat: 28.6215, lng: 77.2370 },
    hazardType: 'flooded_road' as const,
    severity: 'MEDIUM' as const,
    confidence: 91,
    defaultImage: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    detectedObjects: [
      { label: 'Standing Water Depth >1ft', confidence: 0.92, x: 10, y: 50, width: 80, height: 40 }
    ],
    recommendation: 'Re-route ambulances through Upper Radial Flyover.'
  }
];

export const HOURLY_TRAFFIC_FORECAST: TrafficForecastHour[] = [
  { timeLabel: 'Now', predictedCongestionPercent: 58, historicalAveragePercent: 55, weatherRisk: 'Clear' },
  { timeLabel: '+15m', predictedCongestionPercent: 68, historicalAveragePercent: 60, weatherRisk: 'Peak Rush' },
  { timeLabel: '+30m', predictedCongestionPercent: 74, historicalAveragePercent: 66, weatherRisk: 'Peak Rush' },
  { timeLabel: '+45m', predictedCongestionPercent: 65, historicalAveragePercent: 62, weatherRisk: 'Clear' },
  { timeLabel: '+60m', predictedCongestionPercent: 51, historicalAveragePercent: 54, weatherRisk: 'Clear' },
  { timeLabel: '+90m', predictedCongestionPercent: 42, historicalAveragePercent: 45, weatherRisk: 'Clear' }
];

export const CONGESTION_BY_AREA = [
  { area: 'Downtown Core', current: 78, avg: 65 },
  { area: 'Medical Corridor', current: 32, avg: 45 },
  { area: 'Expressway Flyover', current: 24, avg: 40 },
  { area: 'Old Ring Radial', current: 82, avg: 70 },
  { area: 'Tech Zone East', current: 46, avg: 52 },
  { area: 'Riverfront Link', current: 62, avg: 50 },
];

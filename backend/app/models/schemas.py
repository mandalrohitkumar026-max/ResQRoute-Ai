"""
Data schemas and Pydantic models for ResQRoute AI
"""
from typing import List, Optional, Tuple, Literal
from pydantic import BaseModel, Field

# Common Types
VehicleType = Literal['ambulance', 'fire_truck', 'police']
PriorityLevel = Literal['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
SignalState = Literal['RED', 'YELLOW', 'GREEN', 'PRIORITY_GREEN']
IncidentType = Literal[
    'accident', 
    'road_blockage', 
    'pothole', 
    'traffic_congestion', 
    'flooded_road', 
    'vehicle_breakdown'
]
FacilityType = Literal['hospital', 'fire_station', 'police_station']
CapacityStatus = Literal['AVAILABLE', 'HIGH_DEMAND', 'FULL']
SurfaceQuality = Literal['EXCELLENT', 'GOOD', 'MODERATE', 'POOR']
WeatherImpact = Literal['NONE', 'RAIN', 'FOG', 'WATERLOGGED']
VehicleStatus = Literal['EMERGENCY', 'EN_ROUTE', 'STANDBY', 'ARRIVED']
IncidentStatus = Literal['REPORTED', 'DISPATCHED', 'IN_PROGRESS', 'RESOLVED']
ReporterType = Literal['CITIZEN', 'AI_VISION', 'TRAFFIC_POLICE', 'SYSTEM_SENSOR']

class Coordinates(BaseModel):
    lat: float
    lng: float

# Emergency Vehicle Model
class EmergencyVehicle(BaseModel):
    id: str
    name: str
    type: VehicleType
    callSign: str
    status: VehicleStatus
    speedKmH: float
    currentLocation: Coordinates
    heading: float = 0.0
    destinationId: Optional[str] = None
    destinationName: Optional[str] = None
    destinationCoords: Optional[Coordinates] = None
    assignedRouteId: Optional[str] = None
    etaSeconds: int = 0
    greenCorridorActive: bool = False
    batteryOrFuelPercent: int = 100
    assignedIncidentId: Optional[str] = None

class VehicleUpdateLocationRequest(BaseModel):
    lat: float
    lng: float
    speedKmH: Optional[float] = None
    heading: Optional[float] = None

class VehicleDispatchEmergencyRequest(BaseModel):
    destinationId: str
    destinationName: str
    destinationCoords: Coordinates
    incidentId: Optional[str] = None

# Traffic Signal Model
class TrafficSignal(BaseModel):
    id: str
    name: str
    location: Coordinates
    state: SignalState
    timerSeconds: int
    normalCycleSeconds: int = 60
    roadName: str
    isGreenCorridorLocked: bool = False
    lockedByVehicleId: Optional[str] = None
    countdownToGreen: Optional[int] = None
    junctionType: Literal['4-way', '3-way', 'rotary', 'highway_merge'] = '4-way'

class SignalStateUpdateRequest(BaseModel):
    state: SignalState
    isGreenCorridorLocked: Optional[bool] = None
    lockedByVehicleId: Optional[str] = None
    timerSeconds: Optional[int] = None

# Road Segment Model
class RoadSegment(BaseModel):
    id: str
    name: str
    startCoords: Coordinates
    endCoords: Coordinates
    path: List[Tuple[float, float]]
    lengthKm: float
    speedLimitKmH: float
    currentSpeedKmH: float
    congestionPercent: float  # 0 to 100
    laneCount: int = 2
    isBlocked: bool = False
    blockageReason: Optional[str] = None
    riskFactor: float = 0.0   # 0.0 to 1.0
    surfaceQuality: SurfaceQuality = 'GOOD'
    weatherImpact: WeatherImpact = 'NONE'

# Facility Model
class Facility(BaseModel):
    id: str
    name: str
    type: FacilityType
    location: Coordinates
    address: str
    contactNumber: str
    capacityStatus: CapacityStatus = 'AVAILABLE'
    icuBedsAvailable: Optional[int] = None
    traumaLevel: Optional[str] = None
    activeUnitsCount: int = 0

# Incident Model
class IncidentReport(BaseModel):
    id: str
    title: str
    type: IncidentType
    severity: PriorityLevel
    location: Coordinates
    locationName: str
    distanceKm: Optional[float] = None
    etaToArrival: Optional[str] = None
    reportedAt: str
    reporter: ReporterType
    confidenceScore: Optional[float] = None
    imageUrl: Optional[str] = None
    description: str
    status: IncidentStatus = 'REPORTED'
    recommendedActions: List[str] = []
    affectedRoadIds: List[str] = []

class IncidentCreateRequest(BaseModel):
    title: str
    type: IncidentType
    severity: PriorityLevel = 'HIGH'
    location: Coordinates
    locationName: str
    reporter: ReporterType = 'CITIZEN'
    description: str
    imageUrl: Optional[str] = None
    confidenceScore: Optional[float] = None
    affectedRoadIds: Optional[List[str]] = []

# Navigation & Routing Models
class NavigationStep(BaseModel):
    id: str
    instruction: str
    distanceMeters: int
    durationSeconds: int
    turnDirection: Literal['straight', 'left', 'right', 'slight_left', 'slight_right', 'u_turn', 'arrive']
    streetName: str
    signalId: Optional[str] = None
    isCompleted: Optional[bool] = False

class ScoreBreakdown(BaseModel):
    travelTimeScore: float
    trafficScore: float
    riskScore: float
    distanceScore: float
    blockageScore: float

class RouteOption(BaseModel):
    id: str
    name: str
    isRecommended: bool
    distanceKm: float
    durationSeconds: int
    etaFormatted: str = "00:00"
    trafficDensityPercent: float
    trafficLevel: Literal['Low', 'Medium', 'High', 'Severe']
    roadRiskLevel: Literal['Low', 'Medium', 'High']
    roadRiskScore: float
    roadBlockagesCount: int
    signalsCount: int
    signalsOnRoute: List[str]
    pathCoordinates: List[Tuple[float, float]]
    routeScore: float
    aiExplanation: str
    scoreBreakdown: ScoreBreakdown
    navigationSteps: List[NavigationStep]

class RouteCalculationRequest(BaseModel):
    origin: Coordinates
    destination: Coordinates
    vehicleType: VehicleType = 'ambulance'
    avoidBlockages: bool = True

# Green Corridor Models
class GreenCorridorLockRequest(BaseModel):
    vehicleId: str
    routeId: Optional[str] = None
    signalIds: List[str] = []
    speedKmH: float = 55.0

class GreenCorridorStatus(BaseModel):
    active: bool
    vehicleId: Optional[str] = None
    targetSpeedKmH: float = 55.0
    signalsControlledCount: int = 0
    signalsLocked: List[str] = []
    etaSavedSeconds: int = 0

# Vision Detection Models
class VisionBoundingBox(BaseModel):
    x: int
    y: int
    width: int
    height: int
    label: str
    confidence: float

class VisionDetectionRequest(BaseModel):
    imageData: Optional[str] = None  # Base64 or image URL
    sourceType: Literal['cctv', 'upload', 'drone'] = 'upload'
    locationHint: Optional[str] = None

class VisionDetectionResult(BaseModel):
    detected: bool
    hazardType: IncidentType
    label: str
    confidence: float
    severity: PriorityLevel
    boundingBoxes: List[VisionBoundingBox]
    recommendedActions: List[str]
    estimatedDelayMinutes: int

# Post-Incident Performance Analytics Model
class EmergencyResponseReportData(BaseModel):
    incidentId: str
    vehicleId: str
    vehicleCallSign: str
    startLocationName: str
    destinationName: str
    initialEtaFormatted: str
    initialEtaSeconds: int
    optimizedEtaFormatted: str
    optimizedEtaSeconds: int
    timeSavedFormatted: str
    timeSavedSeconds: int
    efficiencyGainPercent: float
    distanceTravelledKm: float
    signalsOptimizedCount: int
    incidentsAvoidedCount: int
    averageSpeedKmH: float
    carbonEmissionSavedKg: float
    timestamp: str

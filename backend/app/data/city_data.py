"""
City network mock database and in-memory store for ResQRoute AI
"""
from typing import Dict, List
import copy
from ..models.schemas import (
    Facility, TrafficSignal, RoadSegment, EmergencyVehicle, IncidentReport
)

INITIAL_FACILITIES: List[Facility] = [
    Facility(
        id='hosp-1',
        name='Apex Super-Speciality & Trauma Centre',
        type='hospital',
        location={'lat': 28.6385, 'lng': 77.2320},
        address='Sector 9, Medical Corridor',
        contactNumber='+91 11 4055 9901',
        capacityStatus='AVAILABLE',
        icuBedsAvailable=14,
        traumaLevel='Level 1 Trauma Care',
        activeUnitsCount=4
    ),
    Facility(
        id='hosp-2',
        name='Metro City General Hospital',
        type='hospital',
        location={'lat': 28.6210, 'lng': 77.2040},
        address='Kingsway Avenue, Downtown West',
        contactNumber='+91 11 4022 8844',
        capacityStatus='HIGH_DEMAND',
        icuBedsAvailable=3,
        traumaLevel='Level 2 Trauma Care',
        activeUnitsCount=2
    ),
    Facility(
        id='hosp-3',
        name='St. Jude Critical Care Institute',
        type='hospital',
        location={'lat': 28.6440, 'lng': 77.2120},
        address='North Tech Zone, Outer Ring',
        contactNumber='+91 11 4899 3300',
        capacityStatus='AVAILABLE',
        icuBedsAvailable=9,
        traumaLevel='Level 1 Trauma Care',
        activeUnitsCount=3
    ),
    Facility(
        id='hosp-4',
        name='Greenfield Emergency Medical Center',
        type='hospital',
        location={'lat': 28.6150, 'lng': 77.2390},
        address='East River Road, Sector 3',
        contactNumber='+91 11 4233 1188',
        capacityStatus='AVAILABLE',
        icuBedsAvailable=18,
        traumaLevel='Level 2 Trauma Care',
        activeUnitsCount=1
    ),
    Facility(
        id='fire-st-1',
        name='Central Fire & Disaster Management Station',
        type='fire_station',
        location={'lat': 28.6310, 'lng': 77.2100},
        address='Station Road, Connaught Place',
        contactNumber='+91 11 2341 2222',
        capacityStatus='AVAILABLE',
        activeUnitsCount=6
    ),
    Facility(
        id='pol-st-1',
        name='Traffic Police Headquarters & Control Hub',
        type='police_station',
        location={'lat': 28.6240, 'lng': 77.2280},
        address='Ashoka Road, Central Secretariat',
        contactNumber='+91 11 2301 5555',
        capacityStatus='AVAILABLE',
        activeUnitsCount=8
    )
]

INITIAL_SIGNALS: List[TrafficSignal] = [
    TrafficSignal(
        id='sig-1',
        name='Kingsway & Janpath Junction',
        location={'lat': 28.6230, 'lng': 77.2140},
        state='RED',
        timerSeconds=24,
        normalCycleSeconds=60,
        roadName='Kingsway Avenue',
        isGreenCorridorLocked=False,
        junctionType='4-way'
    ),
    TrafficSignal(
        id='sig-2',
        name='Central Ring & Copernicus Marg',
        location={'lat': 28.6275, 'lng': 77.2220},
        state='YELLOW',
        timerSeconds=6,
        normalCycleSeconds=70,
        roadName='Copernicus Marg',
        isGreenCorridorLocked=False,
        junctionType='4-way'
    ),
    TrafficSignal(
        id='sig-3',
        name='Vikas Marg Underpass Entry',
        location={'lat': 28.6250, 'lng': 77.2200},
        state='RED',
        timerSeconds=42,
        normalCycleSeconds=90,
        roadName='Vikas Marg Road',
        isGreenCorridorLocked=False,
        junctionType='rotary'
    ),
    TrafficSignal(
        id='sig-4',
        name='Barakhamba Crossing',
        location={'lat': 28.6310, 'lng': 77.2270},
        state='GREEN',
        timerSeconds=18,
        normalCycleSeconds=65,
        roadName='Barakhamba Road',
        isGreenCorridorLocked=False,
        junctionType='4-way'
    ),
    TrafficSignal(
        id='sig-5',
        name='Mandi House Roundabout Hub',
        location={'lat': 28.6340, 'lng': 77.2330},
        state='RED',
        timerSeconds=33,
        normalCycleSeconds=80,
        roadName='Sikandra Road',
        isGreenCorridorLocked=False,
        junctionType='rotary'
    ),
    TrafficSignal(
        id='sig-6',
        name='Trauma Center Sector 9 Approach',
        location={'lat': 28.6375, 'lng': 77.2315},
        state='GREEN',
        timerSeconds=29,
        normalCycleSeconds=50,
        roadName='Hospital Access Way',
        isGreenCorridorLocked=False,
        junctionType='3-way'
    ),
    TrafficSignal(
        id='sig-7',
        name='Outer Ring Road Expressway Merge',
        location={'lat': 28.6410, 'lng': 77.2210},
        state='RED',
        timerSeconds=15,
        normalCycleSeconds=60,
        roadName='Outer Ring Road',
        isGreenCorridorLocked=False,
        junctionType='highway_merge'
    ),
    TrafficSignal(
        id='sig-8',
        name='Paharganj Flyover Descent',
        location={'lat': 28.6360, 'lng': 77.2140},
        state='GREEN',
        timerSeconds=22,
        normalCycleSeconds=55,
        roadName='Flyover Arterial',
        isGreenCorridorLocked=False,
        junctionType='3-way'
    ),
    TrafficSignal(
        id='sig-9',
        name='Pragati Maidan Gate 4 Crossing',
        location={'lat': 28.6200, 'lng': 77.2340},
        state='RED',
        timerSeconds=38,
        normalCycleSeconds=75,
        roadName='Mathura Road',
        isGreenCorridorLocked=False,
        junctionType='4-way'
    ),
    TrafficSignal(
        id='sig-10',
        name='Connaught Circus Inner Radial 3',
        location={'lat': 28.6300, 'lng': 77.2180},
        state='RED',
        timerSeconds=12,
        normalCycleSeconds=60,
        roadName='Radial Road 3',
        isGreenCorridorLocked=False,
        junctionType='rotary'
    )
]

INITIAL_ROADS: List[RoadSegment] = [
    RoadSegment(
        id='road-1',
        name='Kingsway Corridor Alpha',
        startCoords={'lat': 28.6210, 'lng': 77.2040},
        endCoords={'lat': 28.6275, 'lng': 77.2220},
        path=[(28.6210, 77.2040), (28.6230, 77.2140), (28.6275, 77.2220)],
        lengthKm=2.1,
        speedLimitKmH=60,
        currentSpeedKmH=48,
        congestionPercent=22,
        laneCount=3,
        isBlocked=False,
        riskFactor=0.15,
        surfaceQuality='EXCELLENT',
        weatherImpact='NONE'
    ),
    RoadSegment(
        id='road-2',
        name='Vikas Marg Underpass Arterial',
        startCoords={'lat': 28.6250, 'lng': 77.2200},
        endCoords={'lat': 28.6295, 'lng': 77.2300},
        path=[(28.6250, 77.2200), (28.6270, 77.2250), (28.6295, 77.2300)],
        lengthKm=1.4,
        speedLimitKmH=50,
        currentSpeedKmH=8,
        congestionPercent=88,
        laneCount=2,
        isBlocked=True,
        blockageReason='Multi-vehicle accident blocking both lanes',
        riskFactor=0.92,
        surfaceQuality='MODERATE',
        weatherImpact='NONE'
    ),
    RoadSegment(
        id='road-3',
        name='Copernicus Marg High-Speed Flyover',
        startCoords={'lat': 28.6275, 'lng': 77.2220},
        endCoords={'lat': 28.6340, 'lng': 77.2330},
        path=[(28.6275, 77.2220), (28.6310, 77.2270), (28.6340, 77.2330)],
        lengthKm=1.6,
        speedLimitKmH=70,
        currentSpeedKmH=54,
        congestionPercent=18,
        laneCount=3,
        isBlocked=False,
        riskFactor=0.08,
        surfaceQuality='EXCELLENT',
        weatherImpact='NONE'
    ),
    RoadSegment(
        id='road-4',
        name='Hospital Emergency Medical Corridor',
        startCoords={'lat': 28.6340, 'lng': 77.2330},
        endCoords={'lat': 28.6385, 'lng': 77.2320},
        path=[(28.6340, 77.2330), (28.6360, 77.2325), (28.6385, 77.2320)],
        lengthKm=0.6,
        speedLimitKmH=45,
        currentSpeedKmH=42,
        congestionPercent=10,
        laneCount=2,
        isBlocked=False,
        riskFactor=0.05,
        surfaceQuality='EXCELLENT',
        weatherImpact='NONE'
    ),
    RoadSegment(
        id='road-5',
        name='North Ring Road Expressway Bypass',
        startCoords={'lat': 28.6210, 'lng': 77.2040},
        endCoords={'lat': 28.6410, 'lng': 77.2210},
        path=[(28.6210, 77.2040), (28.6300, 77.2180), (28.6360, 77.2210), (28.6410, 77.2210)],
        lengthKm=3.4,
        speedLimitKmH=80,
        currentSpeedKmH=62,
        congestionPercent=35,
        laneCount=4,
        isBlocked=False,
        riskFactor=0.20,
        surfaceQuality='GOOD',
        weatherImpact='NONE'
    )
]

INITIAL_VEHICLES: List[EmergencyVehicle] = [
    EmergencyVehicle(
        id='amb-1',
        name='ALS Mobile ICU Cardiac Unit 01',
        type='ambulance',
        callSign='MEDIC-ALPHA-1',
        status='STANDBY',
        speedKmH=0,
        currentLocation={'lat': 28.6210, 'lng': 77.2040},
        heading=45.0,
        destinationId='hosp-1',
        destinationName='Apex Super-Speciality & Trauma Centre',
        destinationCoords={'lat': 28.6385, 'lng': 77.2320},
        assignedRouteId='corridor-alpha',
        etaSeconds=420,
        greenCorridorActive=False,
        batteryOrFuelPercent=94,
        assignedIncidentId='inc-1'
    ),
    EmergencyVehicle(
        id='amb-2',
        name='Rapid Response Trauma Unit 11',
        type='ambulance',
        callSign='MEDIC-TANGO-4',
        status='STANDBY',
        speedKmH=0,
        currentLocation={'lat': 28.6150, 'lng': 77.2390},
        heading=310.0,
        etaSeconds=0,
        greenCorridorActive=False,
        batteryOrFuelPercent=88
    ),
    EmergencyVehicle(
        id='fire-1',
        name='Heavy Rescue Tender Fire Unit 3',
        type='fire_truck',
        callSign='BRAVO-LADDER-3',
        status='STANDBY',
        speedKmH=0,
        currentLocation={'lat': 28.6310, 'lng': 77.2100},
        heading=90.0,
        etaSeconds=0,
        greenCorridorActive=False,
        batteryOrFuelPercent=98
    ),
    EmergencyVehicle(
        id='pol-1',
        name='Corridor Escort Police Interceptor',
        type='police',
        callSign='PATROL-SIERRA-9',
        status='STANDBY',
        speedKmH=0,
        currentLocation={'lat': 28.6240, 'lng': 77.2280},
        heading=180.0,
        etaSeconds=0,
        greenCorridorActive=False,
        batteryOrFuelPercent=91
    )
]

INITIAL_INCIDENTS: List[IncidentReport] = [
    IncidentReport(
        id='inc-1',
        title='Cardiac Arrest Emergency - Sector 4 Residence',
        type='accident',
        severity='CRITICAL',
        location={'lat': 28.6210, 'lng': 77.2040},
        locationName='Kingsway Avenue, Downtown West',
        reportedAt='2 mins ago',
        reporter='CITIZEN',
        confidenceScore=98.0,
        description='Elderly patient with acute myocardial infarction. Oxygen and ALS resuscitation required immediately.',
        status='DISPATCHED',
        recommendedActions=['Activate Green Corridor Alpha', 'Alert Apex Cath Lab', 'Pre-empt Signals 1, 2, 4, 5, 6'],
        affectedRoadIds=['road-1']
    ),
    IncidentReport(
        id='inc-2',
        title='Major Vehicle Collision & Fuel Spill',
        type='road_blockage',
        severity='CRITICAL',
        location={'lat': 28.6290, 'lng': 77.2285},
        locationName='Vikas Marg Underpass Junction',
        reportedAt='11 mins ago',
        reporter='AI_VISION',
        confidenceScore=96.4,
        imageUrl='https://images.unsplash.com/photo-1543393470-b2c833b98dce?auto=format&fit=crop&w=600&q=80',
        description='Two multi-axle freight carriers involved in head-on crash. Both lanes completely blocked.',
        status='IN_PROGRESS',
        recommendedActions=['Close Vikas Marg Underpass', 'Reroute Emergency Vehicles to Corridor Alpha', 'Deploy Fire Engine Bravo-3'],
        affectedRoadIds=['road-2']
    ),
    IncidentReport(
        id='inc-3',
        title='Deep Pothole & Road Hazard',
        type='pothole',
        severity='MEDIUM',
        location={'lat': 28.6360, 'lng': 77.2140},
        locationName='Paharganj Flyover Descent Lane 2',
        reportedAt='35 mins ago',
        reporter='CITIZEN',
        confidenceScore=89.0,
        description='Substantial crater after overnight pipe repair. Vehicles swerving sharply to avoid tire blowouts.',
        status='REPORTED',
        recommendedActions=['Mark road risk score +30%', 'Dispatch repair team'],
        affectedRoadIds=['road-5']
    ),
    IncidentReport(
        id='inc-4',
        title='Flash Waterlogging & Monsoon Puddle Choke',
        type='flooded_road',
        severity='HIGH',
        location={'lat': 28.6200, 'lng': 77.2340},
        locationName='Mathura Road Underpass approach',
        reportedAt='52 mins ago',
        reporter='SYSTEM_SENSOR',
        confidenceScore=92.0,
        description='Water depth exceeding 30cm, reducing traffic throughput by 65%.',
        status='REPORTED',
        recommendedActions=['Pump deployed', 'Speed limit reduced to 25 km/h'],
        affectedRoadIds=[]
    )
]

class CityDataStore:
    """Thread-safe in-memory database instance for the backend"""
    def __init__(self):
        self.reset()
        
    def reset(self):
        self.facilities: Dict[str, Facility] = {f.id: copy.deepcopy(f) for f in INITIAL_FACILITIES}
        self.signals: Dict[str, TrafficSignal] = {s.id: copy.deepcopy(s) for s in INITIAL_SIGNALS}
        self.roads: Dict[str, RoadSegment] = {r.id: copy.deepcopy(r) for r in INITIAL_ROADS}
        self.vehicles: Dict[str, EmergencyVehicle] = {v.id: copy.deepcopy(v) for v in INITIAL_VEHICLES}
        self.incidents: Dict[str, IncidentReport] = {i.id: copy.deepcopy(i) for i in INITIAL_INCIDENTS}

# Global singleton in-memory database
city_db = CityDataStore()

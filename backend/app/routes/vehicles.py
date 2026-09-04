"""
Emergency Fleet Management & Telemetry Endpoints
"""
from typing import List
from fastapi import APIRouter, HTTPException
from ..models.schemas import (
    EmergencyVehicle, VehicleUpdateLocationRequest, VehicleDispatchEmergencyRequest
)
from ..data.city_data import city_db

router = APIRouter(prefix="/vehicles", tags=["Emergency Vehicles"])

@router.get("", response_model=List[EmergencyVehicle])
def get_all_vehicles():
    """Retrieve all emergency fleet vehicles with live status and coordinates"""
    return list(city_db.vehicles.values())

@router.get("/{vehicle_id}", response_model=EmergencyVehicle)
def get_vehicle(vehicle_id: str):
    """Retrieve details for a specific emergency vehicle"""
    vehicle = city_db.vehicles.get(vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail=f"Vehicle '{vehicle_id}' not found")
    return vehicle

@router.put("/{vehicle_id}/location", response_model=EmergencyVehicle)
def update_vehicle_location(vehicle_id: str, req: VehicleUpdateLocationRequest):
    """Update vehicle live GPS location, speed, and heading"""
    vehicle = city_db.vehicles.get(vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail=f"Vehicle '{vehicle_id}' not found")
    
    vehicle.currentLocation.lat = req.lat
    vehicle.currentLocation.lng = req.lng
    if req.speedKmH is not None:
        vehicle.speedKmH = req.speedKmH
    if req.heading is not None:
        vehicle.heading = req.heading
        
    return vehicle

@router.post("/{vehicle_id}/dispatch", response_model=EmergencyVehicle)
def dispatch_vehicle_emergency(vehicle_id: str, req: VehicleDispatchEmergencyRequest):
    """Dispatch emergency vehicle to destination and activate emergency priority"""
    vehicle = city_db.vehicles.get(vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail=f"Vehicle '{vehicle_id}' not found")
    
    vehicle.status = 'EMERGENCY'
    vehicle.destinationId = req.destinationId
    vehicle.destinationName = req.destinationName
    vehicle.destinationCoords = req.destinationCoords
    vehicle.greenCorridorActive = True
    vehicle.assignedIncidentId = req.incidentId
    vehicle.speedKmH = 54.0
    
    return vehicle

@router.post("/{vehicle_id}/standby", response_model=EmergencyVehicle)
def reset_vehicle_standby(vehicle_id: str):
    """Return emergency vehicle to standby status"""
    vehicle = city_db.vehicles.get(vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail=f"Vehicle '{vehicle_id}' not found")
    
    vehicle.status = 'STANDBY'
    vehicle.greenCorridorActive = False
    vehicle.speedKmH = 0.0
    vehicle.destinationId = None
    vehicle.destinationName = None
    vehicle.destinationCoords = None
    
    return vehicle

"""
Traffic Signals & Green Wave Pre-emption Endpoints
"""
from typing import List
from fastapi import APIRouter, HTTPException
from ..models.schemas import (
    TrafficSignal, SignalStateUpdateRequest, GreenCorridorLockRequest, GreenCorridorStatus
)
from ..data.city_data import city_db
from ..services.green_corridor import GreenCorridorEngine

router = APIRouter(prefix="/signals", tags=["Traffic Signals & Green Corridor"])

@router.get("", response_model=List[TrafficSignal])
def get_all_signals():
    """List all traffic signals with current state and timers"""
    return list(city_db.signals.values())

@router.get("/{signal_id}", response_model=TrafficSignal)
def get_signal(signal_id: str):
    """Get status of a specific traffic signal"""
    sig = city_db.signals.get(signal_id)
    if not sig:
        raise HTTPException(status_code=404, detail=f"Signal '{signal_id}' not found")
    return sig

@router.put("/{signal_id}/state", response_model=TrafficSignal)
def update_signal_state(signal_id: str, req: SignalStateUpdateRequest):
    """Manually command or update traffic signal state"""
    sig = city_db.signals.get(signal_id)
    if not sig:
        raise HTTPException(status_code=404, detail=f"Signal '{signal_id}' not found")
        
    sig.state = req.state
    if req.isGreenCorridorLocked is not None:
        sig.isGreenCorridorLocked = req.isGreenCorridorLocked
    if req.lockedByVehicleId is not None:
        sig.lockedByVehicleId = req.lockedByVehicleId
    if req.timerSeconds is not None:
        sig.timerSeconds = req.timerSeconds
        
    return sig

@router.post("/green-corridor/lock", response_model=GreenCorridorStatus)
def lock_green_corridor(req: GreenCorridorLockRequest):
    """Lock signals along a corridor into PRIORITY_GREEN wave for an emergency vehicle"""
    vehicle = city_db.vehicles.get(req.vehicleId)
    if not vehicle:
        raise HTTPException(status_code=404, detail=f"Vehicle '{req.vehicleId}' not found")
        
    vehicle.greenCorridorActive = True
    vehicle.speedKmH = req.speedKmH
    
    signals_to_lock = req.signalIds
    if not signals_to_lock:
        # Default to Alpha corridor signals (1, 2, 4, 5, 6)
        signals_to_lock = ['sig-1', 'sig-2', 'sig-4', 'sig-5', 'sig-6']
        
    locked = []
    for sig_id in signals_to_lock:
        sig = city_db.signals.get(sig_id)
        if sig:
            sig.state = 'PRIORITY_GREEN'
            sig.isGreenCorridorLocked = True
            sig.lockedByVehicleId = vehicle.id
            sig.countdownToGreen = 0
            locked.append(sig_id)

    return GreenCorridorStatus(
        active=True,
        vehicleId=vehicle.id,
        targetSpeedKmH=req.speedKmH,
        signalsControlledCount=len(locked),
        signalsLocked=locked,
        etaSavedSeconds=264  # ~4m 24s saved
    )

@router.post("/green-corridor/release", response_model=GreenCorridorStatus)
def release_green_corridor(vehicle_id: str = None):
    """Restore normal municipal cycle for all signals locked by emergency corridor"""
    released = []
    for sig in city_db.signals.values():
        if sig.isGreenCorridorLocked and (vehicle_id is None or sig.lockedByVehicleId == vehicle_id):
            sig.state = 'GREEN'
            sig.isGreenCorridorLocked = False
            sig.lockedByVehicleId = None
            sig.countdownToGreen = None
            sig.timerSeconds = sig.normalCycleSeconds // 2
            released.append(sig.id)

    if vehicle_id and vehicle_id in city_db.vehicles:
        city_db.vehicles[vehicle_id].greenCorridorActive = False

    return GreenCorridorStatus(
        active=False,
        vehicleId=vehicle_id,
        signalsControlledCount=len(released),
        signalsLocked=[]
    )

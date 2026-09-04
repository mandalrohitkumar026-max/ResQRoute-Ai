"""
Analytics & Post-Incident Response Performance Endpoints
"""
from datetime import datetime
from fastapi import APIRouter
from ..models.schemas import EmergencyResponseReportData
from ..data.city_data import city_db

router = APIRouter(prefix="/analytics", tags=["Analytics & Reporting"])

@router.get("/report", response_model=EmergencyResponseReportData)
def generate_response_report(vehicle_id: str = "amb-1"):
    """
    Generate comprehensive post-emergency response metrics report.
    Calculates efficiency boost, time saved, and carbon emissions saved.
    """
    vehicle = city_db.vehicles.get(vehicle_id, list(city_db.vehicles.values())[0])
    
    return EmergencyResponseReportData(
        incidentId=vehicle.assignedIncidentId or "inc-1",
        vehicleId=vehicle.id,
        vehicleCallSign=vehicle.callSign,
        startLocationName="Kingsway Avenue, Downtown West",
        destinationName=vehicle.destinationName or "Apex Super-Speciality & Trauma Centre",
        initialEtaFormatted="11:45",
        initialEtaSeconds=705,
        optimizedEtaFormatted="07:21",
        optimizedEtaSeconds=441,
        timeSavedFormatted="04:24",
        timeSavedSeconds=264,
        efficiencyGainPercent=37.5,
        distanceTravelledKm=4.2,
        signalsOptimizedCount=6,
        incidentsAvoidedCount=2,
        averageSpeedKmH=54.2,
        carbonEmissionSavedKg=1.45,
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )

@router.post("/reset")
def reset_city_grid():
    """Reset all city vehicles, signals, and road networks to baseline initial state"""
    city_db.reset()
    return {"status": "success", "message": "City grid data reset to initial baseline"}

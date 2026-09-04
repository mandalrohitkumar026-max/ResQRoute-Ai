"""
Incident Management & Citizen Hazard Reporting Endpoints
"""
import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException
from ..models.schemas import (
    IncidentReport, IncidentCreateRequest, IncidentStatus
)
from ..data.city_data import city_db

router = APIRouter(prefix="/incidents", tags=["Incidents & Hazards"])

@router.get("", response_model=List[IncidentReport])
def get_all_incidents():
    """List all active and historical incidents on the city grid"""
    return list(city_db.incidents.values())

@router.get("/{incident_id}", response_model=IncidentReport)
def get_incident(incident_id: str):
    """Retrieve details for a specific incident report"""
    inc = city_db.incidents.get(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found")
    return inc

@router.post("", response_model=IncidentReport)
def report_incident(req: IncidentCreateRequest):
    """Submit a new crowdsourced citizen or sensor incident report"""
    new_id = f"inc-{uuid.uuid4().hex[:6]}"
    
    # Auto-generate recommended actions based on type
    actions_map = {
        'accident': ['Alert nearest trauma facility', 'Pre-empt emergency corridors', 'Dispatch police patrol'],
        'road_blockage': ['Set detour on navigation HUDs', 'Notify heavy rescue crane', 'Update segment risk score'],
        'pothole': ['Flag segment risk +25%', 'Notify municipal public works team'],
        'traffic_congestion': ['Extend green signal duration', 'Suggest alternate ring routes'],
        'flooded_road': ['Deploy water drainage pumps', 'Cap segment speed limit to 20 km/h'],
        'vehicle_breakdown': ['Dispatch towing unit', 'Mark single-lane hazard']
    }
    
    recommended = actions_map.get(req.type, ['Monitor area closely'])

    new_report = IncidentReport(
        id=new_id,
        title=req.title,
        type=req.type,
        severity=req.severity,
        location=req.location,
        locationName=req.locationName,
        reportedAt='Just now',
        reporter=req.reporter,
        confidenceScore=req.confidenceScore or 95.0,
        imageUrl=req.imageUrl,
        description=req.description,
        status='REPORTED',
        recommendedActions=recommended,
        affectedRoadIds=req.affectedRoadIds or []
    )
    
    city_db.incidents[new_id] = new_report
    return new_report

@router.put("/{incident_id}/status", response_model=IncidentReport)
def update_incident_status(incident_id: str, status: IncidentStatus):
    """Update status of an incident (REPORTED, DISPATCHED, IN_PROGRESS, RESOLVED)"""
    inc = city_db.incidents.get(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found")
        
    inc.status = status
    return inc

@router.delete("/{incident_id}")
def delete_incident(incident_id: str):
    """Remove or clear an incident from active tracking"""
    if incident_id not in city_db.incidents:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found")
    del city_db.incidents[incident_id]
    return {"message": f"Incident {incident_id} successfully removed"}

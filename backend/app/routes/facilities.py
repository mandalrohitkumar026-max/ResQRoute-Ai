"""
Emergency Facilities & Hospital Directory Endpoints
"""
from typing import List
from fastapi import APIRouter, HTTPException
from ..models.schemas import Facility
from ..data.city_data import city_db

router = APIRouter(prefix="/facilities", tags=["Facilities & Hospitals"])

@router.get("", response_model=List[Facility])
def get_all_facilities():
    """List all emergency medical centers, trauma hubs, and stations"""
    return list(city_db.facilities.values())

@router.get("/{facility_id}", response_model=Facility)
def get_facility(facility_id: str):
    """Retrieve details and ICU bed availability for a specific hospital"""
    facility = city_db.facilities.get(facility_id)
    if not facility:
        raise HTTPException(status_code=404, detail=f"Facility '{facility_id}' not found")
    return facility

@router.put("/{facility_id}/icu-beds", response_model=Facility)
def update_icu_beds(facility_id: str, available_beds: int):
    """Update live ICU bed capacity count for a trauma hospital"""
    facility = city_db.facilities.get(facility_id)
    if not facility:
        raise HTTPException(status_code=404, detail=f"Facility '{facility_id}' not found")
        
    facility.icuBedsAvailable = max(0, available_beds)
    if facility.icuBedsAvailable == 0:
        facility.capacityStatus = 'FULL'
    elif facility.icuBedsAvailable <= 3:
        facility.capacityStatus = 'HIGH_DEMAND'
    else:
        facility.capacityStatus = 'AVAILABLE'
        
    return facility

"""
AI Route Optimization & Road Network Endpoints
"""
from typing import List
from fastapi import APIRouter
from ..models.schemas import (
    RouteCalculationRequest, RouteOption, RoadSegment
)
from ..data.city_data import city_db
from ..services.route_optimizer import RouteOptimizer

router = APIRouter(prefix="/routes", tags=["Route Optimization"])

@router.get("/segments", response_model=List[RoadSegment])
def get_road_segments():
    """List all city road segments with live congestion and speed metrics"""
    return list(city_db.roads.values())

@router.post("/calculate", response_model=List[RouteOption])
def calculate_optimal_routes(req: RouteCalculationRequest):
    """
    Calculate multi-factor weighted routes between origin and destination.
    Evaluates travel time, traffic density, road risk, distance, and road blockages.
    """
    routes = RouteOptimizer.calculate_routes(
        origin=req.origin,
        destination=req.destination,
        vehicle_type=req.vehicleType,
        roads=list(city_db.roads.values()),
        signals=list(city_db.signals.values()),
        incidents=list(city_db.incidents.values()),
        avoid_blockages=req.avoidBlockages
    )
    return routes

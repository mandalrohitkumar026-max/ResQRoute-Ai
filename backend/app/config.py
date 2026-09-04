"""
Application Configuration and Constants
"""
import os
from typing import List

class Settings:
    PROJECT_NAME: str = "ResQRoute AI - Smart Traffic & Emergency Corridor Backend"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    
    # Server configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    # CORS configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"
    ]
    
    # Smart City Geographical Anchor (Delhi Smart City Grid)
    CITY_CENTER_LAT: float = 28.6280
    CITY_CENTER_LNG: float = 77.2180
    
    # Multi-Factor Weighted Routing Parameters
    WEIGHT_TRAVEL_TIME: float = 0.40
    WEIGHT_TRAFFIC_DENSITY: float = 0.25
    WEIGHT_ROAD_RISK: float = 0.15
    WEIGHT_DISTANCE: float = 0.10
    WEIGHT_BLOCKAGE: float = 0.10
    
    # Green Corridor Configuration
    CORRIDOR_WAVE_SPEED_KMH: float = 55.0  # Speed target for green wave pre-emption
    PREEMPTION_BUFFER_SECONDS: int = 15     # Pre-emption green lead time before arrival

settings = Settings()

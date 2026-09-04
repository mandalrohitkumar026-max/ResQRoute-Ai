"""
ResQRoute AI — Smart Traffic & Emergency Route Optimizer Backend
Main FastAPI Application Entrypoint
"""
import asyncio
import json
from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import (
    vehicles, signals, routes, incidents, facilities, vision, analytics
)
from app.data.city_data import city_db

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-driven multi-factor emergency route optimization and autonomous green corridor signal pre-emption engine.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(vehicles.router, prefix=settings.API_V1_PREFIX)
app.include_router(signals.router, prefix=settings.API_V1_PREFIX)
app.include_router(routes.router, prefix=settings.API_V1_PREFIX)
app.include_router(incidents.router, prefix=settings.API_V1_PREFIX)
app.include_router(facilities.router, prefix=settings.API_V1_PREFIX)
app.include_router(vision.router, prefix=settings.API_V1_PREFIX)
app.include_router(analytics.router, prefix=settings.API_V1_PREFIX)

# WebSocket Connection Manager for Live Telemetry
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

@app.get("/")
def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs",
        "endpoints": {
            "health": "/api/health",
            "vehicles": "/api/vehicles",
            "signals": "/api/signals",
            "routes": "/api/routes/calculate",
            "incidents": "/api/incidents",
            "facilities": "/api/facilities",
            "vision": "/api/vision/detect",
            "analytics": "/api/analytics/report",
            "telemetry_ws": "/ws/telemetry"
        }
    }

@app.get("/api/health")
def health_check():
    """Health check endpoint for container orchestrators and ping probes"""
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "active_vehicles": len(city_db.vehicles),
        "traffic_signals": len(city_db.signals),
        "monitored_roads": len(city_db.roads),
        "active_incidents": len(city_db.incidents)
    }

@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time telemetry streaming.
    Pushes vehicle location updates, signal locks, and corridor status.
    """
    await manager.connect(websocket)
    try:
        # Send initial state snapshot on connection
        await websocket.send_json({
            "type": "INITIAL_STATE",
            "vehicles": [v.model_dump() for v in city_db.vehicles.values()],
            "signals": [s.model_dump() for s in city_db.signals.values()]
        })
        
        while True:
            # Listen for client heartbeat or commands
            data = await websocket.receive_text()
            try:
                parsed = json.loads(data)
                if parsed.get("action") == "PING":
                    await websocket.send_json({"type": "PONG"})
                elif parsed.get("action") == "BROADCAST":
                    await manager.broadcast(parsed.get("payload", {}))
            except json.JSONDecodeError:
                pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)

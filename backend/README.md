# ResQRoute AI — Backend Service

Intelligent REST & WebSocket backend powering **ResQRoute AI**'s autonomous Green Corridor signal synchronization, 5-factor weighted emergency routing engine, and computer vision hazard detection.

---

## 🚀 Tech Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (High-performance Python async framework)
- **Server**: [Uvicorn](https://www.uvicorn.org/) (Lightning-fast ASGI web server)
- **Validation**: [Pydantic v2](https://docs.pydantic.dev/) (Strict type enforcement & data schemas)
- **Algorithms**: Multi-factor routing graph algorithms, Haversine spatial calculations, green wave arrival time estimation
- **WebSockets**: Real-time vehicle GPS streaming and traffic signal state broadcasting

---

## ⚡ Quick Start

### 1. Requirements
Ensure Python 3.10+ is installed:
```bash
python --version
```

### 2. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Launch Development Server
You can launch the server using the included script:
```powershell
.\run.ps1
```
Or directly with Uvicorn:
```bash
uvicorn main:app --reload --port 8000
```

The API will be live at **`http://localhost:8000`**.

---

## 📖 Interactive API Documentation

Once the server is running, visit:
- **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and live resource counts |
| `GET` | `/api/vehicles` | List all emergency vehicles with live status & GPS |
| `GET` | `/api/vehicles/{id}` | Get specific emergency vehicle details |
| `PUT` | `/api/vehicles/{id}/location` | Update vehicle GPS coordinates, speed, and heading |
| `POST` | `/api/vehicles/{id}/dispatch` | Dispatch emergency unit and activate priority status |
| `POST` | `/api/vehicles/{id}/standby` | Reset vehicle to standby status |
| `GET` | `/api/signals` | List all 10 traffic signals with live countdowns & states |
| `GET` | `/api/signals/{id}` | Get status for a specific traffic signal |
| `PUT` | `/api/signals/{id}/state` | Manually command signal state (`RED`, `YELLOW`, `GREEN`, `PRIORITY_GREEN`) |
| `POST` | `/api/signals/green-corridor/lock` | Pre-empt and lock signals into autonomous `PRIORITY_GREEN` wave |
| `POST` | `/api/signals/green-corridor/release`| Release green corridor and restore municipal cycle |
| `GET` | `/api/routes/segments` | List all road segments with congestion % and risk score |
| `POST` | `/api/routes/calculate` | **Multi-Factor Route Optimizer**: Computes 3 weighted corridors |
| `GET` | `/api/incidents` | List active citizen & AI vision incidents |
| `POST` | `/api/incidents` | Report a new road hazard or accident |
| `PUT` | `/api/incidents/{id}/status` | Update incident status (`REPORTED`, `DISPATCHED`, `IN_PROGRESS`, `RESOLVED`) |
| `GET` | `/api/facilities` | List hospitals, ICU bed counts, fire and police stations |
| `PUT` | `/api/facilities/{id}/icu-beds`| Update available ICU bed capacity |
| `POST` | `/api/vision/detect` | AI Computer Vision hazard scanner (YOLOv8 simulation) |
| `GET` | `/api/analytics/report` | Post-incident emergency performance report (time saved, % efficiency) |
| `POST` | `/api/analytics/reset` | Reset simulation grid data to initial state |
| `WS` | `/ws/telemetry` | Real-time WebSocket connection for live vehicle & signal telemetry |

---

## 🧪 Sample Usage Examples

### 1. Multi-Factor Route Optimization
```bash
curl -X POST "http://localhost:8000/api/routes/calculate" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {"lat": 28.6210, "lng": 77.2040},
    "destination": {"lat": 28.6385, "lng": 77.2320},
    "vehicleType": "ambulance",
    "avoidBlockages": true
  }'
```

### 2. Autonomous Green Corridor Wave Lock
```bash
curl -X POST "http://localhost:8000/api/signals/green-corridor/lock" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleId": "amb-1",
    "signalIds": ["sig-1", "sig-2", "sig-4", "sig-5", "sig-6"],
    "speedKmH": 55.0
  }'
```

### 3. AI Computer Vision Hazard Scanner
```bash
curl -X POST "http://localhost:8000/api/vision/detect" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceType": "cctv"
  }'
```

---

## 📁 Architecture Overview

```text
backend/
├── main.py                     # App entry point, CORS, routers & WebSocket
├── requirements.txt            # Python dependencies
├── run.ps1                     # PowerShell launch helper
├── README.md                   # This documentation file
└── app/
    ├── config.py               # Settings, constants & routing weights
    ├── data/
    │   └── city_data.py        # Seeded city network & thread-safe store
    ├── models/
    │   └── schemas.py          # Pydantic data validation schemas
    ├── services/
    │   ├── route_optimizer.py  # 5-factor weighted route calculation
    │   ├── green_corridor.py   # Green wave pre-emption & arrival engine
    │   └── vision_service.py   # Computer vision hazard detection
    └── routes/
        ├── vehicles.py         # Fleet telemetry endpoints
        ├── signals.py          # Signal wave control endpoints
        ├── routes.py           # Route calculation endpoints
        ├── incidents.py        # Citizen & sensor hazard reports
        ├── facilities.py       # Hospitals and ICU bed directory
        ├── vision.py           # AI vision detection endpoint
        └── analytics.py        # Performance & response reporting
```

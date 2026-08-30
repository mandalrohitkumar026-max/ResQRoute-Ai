# ResQRoute AI — Smart Traffic & Emergency Route Optimizer

> **“Intelligent routing for every second that matters.”**  
> *AI-powered traffic intelligence, multi-factor emergency route optimization, and autonomous Green Corridor signal synchronization for modern Smart Cities and SIH Hackathons.*

---

## 🌟 Key System Capabilities

### 1. 🚑 Autonomous AI Green Corridor
- **Predictive Arrival Calculations**: Projects emergency vehicle time-of-arrival ($t_{\text{arrival}} = \frac{d}{v}$) for each upcoming intersection.
- **Wave Pre-emption**: Pre-emptively commands upcoming traffic signals into `PRIORITY_GREEN` mode, holding an unobstructed clear corridor.
- **Cycle Restoration**: Immediately restores standard municipal timing cycles once the emergency unit clears the crossing.
- **Live Signal Timeline**: Visual indicator showing distance, time-to-lock, and green wave countdown.

### 2. 🧠 Multi-Factor AI Route Optimization Engine
Unlike basic single-metric navigation systems, ResQRoute AI evaluates 5 weighted urban dynamics:

$$\text{Route Score} = (\text{TravelTime} \times 0.40) + (\text{TrafficDensity} \times 0.25) + (\text{RoadRisk} \times 0.15) + (\text{Distance} \times 0.10) + (\text{RoadBlockage} \times 0.10)$$

- Generates **Fastest Recommended Route** alongside **Alternative Route 1** and **Alternative Route 2**.
- **Transparent AI Decision Matrix**: Clear natural-language reasoning cards explaining *why* the recommended route was selected (e.g. *"Selected because it has 28% lower congestion and avoids 2 reported underpass collisions"*).
- **Dynamic Mid-Route Recalculation**: Recomputes optimal detours in real time when sudden traffic choke points or incidents emerge.

### 3. 🚨 Dedicated Operational Interfaces
- **Command Control Center**:
  - Live interactive dark CartoDB city map with layer toggles (Traffic density heatmap, Signals, Facilities, Fleet, Incidents).
  - 5 Animated Top KPI Cards (Active Emergencies, Congestion %, Road Closures, Avg Response Time, Active Green Corridors).
  - Live Incident Feed with priority filtering, click-to-focus map navigation, and quick dispatch buttons.
  - Neural ML Traffic Forecast (+15m, +30m, +60m) and Sector Congestion charts.
- **Emergency Driver Cockpit HUD**:
  - Vehicle Selector (Ambulance ALS/Cardiac, Fire Rescue Tender, High-Speed Police Patrol).
  - Destination Selector (Level 1 Trauma Centers, ICUs, Stations).
  - Turn-by-Turn Navigation HUD with maneuver guidance, distance countdowns, and optimal wave speed gauges.
  - Massive Emergency SOS / Priority Mode button with audio/visual sirens.
- **Citizen Incident Portal**:
  - Crowdsourced hazard submission (Accidents, Roadblocks, Potholes, Floods, Gridlocks, Breakdowns).
  - Integrated Computer Vision defect scanner for image uploads.
  - GPS Coordinate Pinpointing & nearby hospital directory with live ICU bed counts.
- **AI Computer Vision Incident Detection**:
  - Sub-second neural hazard detection on live CCTV feeds or custom image uploads with bounding boxes, confidence metrics (e.g. 96%), and one-click injection into the city map.

### 4. 🏆 1-Click SIH Live Presentation Demo
- Built-in automated 12-stage interactive walkthrough showcasing the complete end-to-end emergency cycle:
  1. Critical Cardiac Call Received
  2. Apex Trauma Center Locked & ICU Bed Reserved
  3. AI Grid Scan & Roadblock Detection
  4. 5-Factor Weighted Route Scoring
  5. Optimal Corridor Alpha Chosen
  6. AI Green Corridor Wave Synchronized
  7. Ambulance En-Route at 54 km/h
  8. Mid-Route Obstacle Injected on Grid
  9. Real-Time Dynamic Reroute Alert
  10. Hospital Emergency Corridor Approach
  11. Arrival at Trauma Bay
  12. Comprehensive **Emergency Response Performance Report** modal with celebratory confetti and printable metrics (37.5% efficiency boost, 4m 24s saved, 6 signals synchronized).

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Canvas Confetti.
- **Mapping**: Leaflet with CartoDB Dark Matter tiles and custom animated SVG/CSS tactical markers.
- **Audio Engine**: Web Audio API synthesized procedural sounds (Sirens, Green wave chimes, Alert chirps, Arrival fanfare).
- **Optimization Engine**: Graph-based multi-factor weighted routing algorithm with dynamic penalization.
- **AI Vision Pipeline**: Simulated YOLOv8 hazard detection with real-time bounding boxes and confidence scores.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 📋 Hackathon Presentation Flow (5-7 Minutes)

1. **Overview**: Open Landing Page to introduce the Smart City problem and core metrics.
2. **Command Dashboard**: Click *Launch Command Center* to present the live city map, KPI cards, and dynamic signal states.
3. **1-Click Live Demo**: Click *“Simulate Ambulance Emergency”* to showcase the 12-stage automated simulation with signal flipping, roadblock detour, and real-time rerouting.
4. **Driver HUD**: Switch to *Driver HUD* to demonstrate the cockpit navigation, turn-by-turn maneuvers, and the massive Emergency SOS button.
5. **AI Vision Module**: Switch to *AI Scanner* to test CCTV feeds and image upload bounding boxes.
6. **Citizen Portal**: Show how public reports instantly affect routing weights.
7. **Emergency Report**: Review the post-response analytics report highlighting 37.5% time saved.

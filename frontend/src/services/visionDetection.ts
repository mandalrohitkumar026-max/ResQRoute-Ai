import { VisionDetectionResult, IncidentType, PriorityLevel } from '../types';

export function analyzeIncidentImage(imageSrc: string, fileName?: string): Promise<VisionDetectionResult> {
  return new Promise((resolve) => {
    // Simulate AI inference delay (500ms - 1000ms)
    setTimeout(() => {
      // Analyze file characteristics or default to accident / hazard
      const name = (fileName || imageSrc).toLowerCase();

      let hazardType: IncidentType = 'accident';
      let label = 'Severe Vehicle Collision';
      let severity: PriorityLevel = 'CRITICAL';
      let confidence = 94.8;
      let boxes = [
        { x: 25, y: 35, width: 35, height: 30, label: 'Damaged Vehicle (Class: Sedan)', confidence: 0.96 },
        { x: 55, y: 40, width: 30, height: 35, label: 'Impact Hazard (Class: Barrier)', confidence: 0.93 },
        { x: 38, y: 68, width: 28, height: 18, label: 'Road Fluid Leak', confidence: 0.91 }
      ];
      let actions = [
        'Redirect emergency traffic away from accident sector',
        'Dispatch Nearest ALS Ambulance & Fire Tender',
        'Initiate Green Wave diversion along Copernicus Flyover',
        'Alert Traffic Command Center to close affected lane'
      ];
      let delayMins = 18;

      if (name.includes('pothole') || name.includes('road') && name.includes('damage')) {
        hazardType = 'pothole';
        label = 'Deep Asphalt Pit / Crater Hazard';
        severity = 'MEDIUM';
        confidence = 91.2;
        boxes = [
          { x: 30, y: 45, width: 40, height: 30, label: 'Road Fracture (Depth > 15cm)', confidence: 0.92 }
        ];
        actions = [
          'Alert Drivers via Cockpit HUD to slow down',
          'Notify Municipal Road Repair Crew',
          'Divert heavy emergency trucks to outer lane'
        ];
        delayMins = 8;
      } else if (name.includes('flood') || name.includes('water')) {
        hazardType = 'flooded_road';
        label = 'Flash Waterlogging & Submerged Roadway';
        severity = 'HIGH';
        confidence = 93.4;
        boxes = [
          { x: 15, y: 50, width: 70, height: 38, label: 'Water Depth > 1.2ft', confidence: 0.94 }
        ];
        actions = [
          'Close underpass to low-clearance vehicles',
          'Deploy high-clearance emergency rescue units',
          'Recalculate elevated flyover routes'
        ];
        delayMins = 25;
      } else if (name.includes('traffic') || name.includes('jam') || name.includes('congestion')) {
        hazardType = 'traffic_congestion';
        label = 'Severe Multi-Lane Gridlock Choke';
        severity = 'HIGH';
        confidence = 96.0;
        boxes = [
          { x: 10, y: 20, width: 80, height: 60, label: 'Vehicle Queue Density 92%', confidence: 0.97 }
        ];
        actions = [
          'Trigger AI Green Wave on preceding signals',
          'Recalculate route for incoming emergency vehicles'
        ];
        delayMins = 15;
      } else if (name.includes('breakdown') || name.includes('truck')) {
        hazardType = 'vehicle_breakdown';
        label = 'Stationary Vehicle Obstruction';
        severity = 'MEDIUM';
        confidence = 92.5;
        boxes = [
          { x: 35, y: 40, width: 40, height: 35, label: 'Stalled Commercial Vehicle', confidence: 0.95 }
        ];
        actions = [
          'Dispatch police towing unit',
          'Advise approaching ambulances of lane restriction'
        ];
        delayMins = 10;
      }

      resolve({
        detected: true,
        hazardType,
        label,
        confidence,
        severity,
        boundingBoxes: boxes,
        recommendedActions: actions,
        estimatedDelayMinutes: delayMins
      });
    }, 700);
  });
}

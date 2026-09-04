"""
AI Computer Vision Incident Detection Service
Simulates sub-second YOLOv8 neural hazard detection on CCTV feeds or custom image uploads
"""
import random
from typing import Dict, Any, List
from ..models.schemas import (
    VisionDetectionResult, VisionBoundingBox, PriorityLevel, IncidentType
)

# Preset hazard templates representing typical urban camera detections
HAZARD_TEMPLATES = [
    {
        'hazardType': 'accident',
        'label': 'Multi-Vehicle Collision Detected',
        'severity': 'CRITICAL',
        'confidence': 96.4,
        'boxes': [
            {'x': 180, 'y': 140, 'width': 220, 'height': 160, 'label': 'Car Frontal Impact', 'confidence': 0.97},
            {'x': 340, 'y': 165, 'width': 190, 'height': 140, 'label': 'Carrier Choke Point', 'confidence': 0.95},
            {'x': 260, 'y': 280, 'width': 130, 'height': 50, 'label': 'Debris Field', 'confidence': 0.88}
        ],
        'recommendedActions': [
            'Reroute approaching ambulances away from sector',
            'Pre-empt Sector 9 Green Corridor bypass',
            'Dispatch Quick Reaction Police Patrol'
        ],
        'estimatedDelayMinutes': 18
    },
    {
        'hazardType': 'road_blockage',
        'label': 'Overturned Truck / Lane Barrier Breach',
        'severity': 'HIGH',
        'confidence': 93.8,
        'boxes': [
            {'x': 120, 'y': 110, 'width': 310, 'height': 190, 'label': 'Heavy Freight Barrier', 'confidence': 0.94},
            {'x': 410, 'y': 220, 'width': 90, 'height': 80, 'label': 'Traffic Cone / Flare', 'confidence': 0.89}
        ],
        'recommendedActions': [
            'Command upcoming signal to hold cross-traffic',
            'Dispatch Heavy Fire Rescue Crane',
            'Send detour notice to navigation HUDs'
        ],
        'estimatedDelayMinutes': 25
    },
    {
        'hazardType': 'flooded_road',
        'label': 'Monsoon Waterlogging & Submerged Manhole',
        'severity': 'MEDIUM',
        'confidence': 91.2,
        'boxes': [
            {'x': 80, 'y': 190, 'width': 440, 'height': 150, 'label': 'Standing Water Depth >35cm', 'confidence': 0.92}
        ],
        'recommendedActions': [
            'Alert civil maintenance for drainage pumps',
            'Reduce segment speed limit to 20 km/h'
        ],
        'estimatedDelayMinutes': 12
    }
]

class VisionDetectionService:
    """Processes camera frames and returns neural object detection hazards"""

    @staticmethod
    def detect_hazard(image_data: str = None, source_type: str = "upload") -> VisionDetectionResult:
        # Select appropriate hazard template
        template = HAZARD_TEMPLATES[0] if source_type == "cctv" else random.choice(HAZARD_TEMPLATES)
        
        boxes = [
            VisionBoundingBox(
                x=b['x'],
                y=b['y'],
                width=b['width'],
                height=b['height'],
                label=b['label'],
                confidence=b['confidence']
            )
            for b in template['boxes']
        ]

        return VisionDetectionResult(
            detected=True,
            hazardType=template['hazardType'],
            label=template['label'],
            confidence=template['confidence'],
            severity=template['severity'],
            boundingBoxes=boxes,
            recommendedActions=template['recommendedActions'],
            estimatedDelayMinutes=template['estimatedDelayMinutes']
        )

"""
AI Computer Vision Incident Detection Endpoint
"""
from fastapi import APIRouter
from ..models.schemas import VisionDetectionRequest, VisionDetectionResult
from ..services.vision_service import VisionDetectionService

router = APIRouter(prefix="/vision", tags=["AI Vision Detection"])

@router.post("/detect", response_model=VisionDetectionResult)
def detect_traffic_hazard(req: VisionDetectionRequest):
    """
    Sub-second neural hazard detection on live CCTV feeds or uploaded images.
    Returns detected hazard, bounding boxes, confidence score, and suggested actions.
    """
    result = VisionDetectionService.detect_hazard(
        image_data=req.imageData,
        source_type=req.sourceType
    )
    return result

"""
Autonomous AI Green Corridor Synchronization Engine
Calculates vehicle ETA to upcoming intersections and pre-empts traffic signals into PRIORITY_GREEN wave.
"""
from typing import List, Dict, Any, Optional
from ..models.schemas import Coordinates, TrafficSignal, EmergencyVehicle
from ..services.route_optimizer import calculate_distance_km
from ..config import settings

class GreenCorridorEngine:
    """Orchestrates traffic signal wave synchronization along emergency corridors"""

    @staticmethod
    def calculate_eta_to_signal(
        vehicle_coords: Coordinates,
        signal_coords: Coordinates,
        speed_kmh: float = 55.0
    ) -> Dict[str, Any]:
        """Calculates distance and estimated arrival seconds to upcoming signal"""
        distance_km = calculate_distance_km(vehicle_coords, signal_coords)
        effective_speed = max(10.0, speed_kmh)
        eta_seconds = int((distance_km / effective_speed) * 3600)
        
        # When ETA is within the preemption window, signal should enter PRIORITY_GREEN
        should_preempt = eta_seconds <= (settings.PREEMPTION_BUFFER_SECONDS + 25)
        
        return {
            'distance_km': distance_km,
            'eta_seconds': eta_seconds,
            'should_preempt': should_preempt,
            'countdown_to_green': max(0, eta_seconds - settings.PREEMPTION_BUFFER_SECONDS)
        }

    @staticmethod
    def synchronize_corridor(
        signals_map: Dict[str, TrafficSignal],
        corridor_signal_ids: List[str],
        vehicle: EmergencyVehicle
    ) -> Dict[str, Any]:
        """Updates signal states along the corridor based on vehicle position"""
        locked_signals: List[str] = []
        restored_signals: List[str] = []

        for sig_id in corridor_signal_ids:
            signal = signals_map.get(sig_id)
            if not signal:
                continue

            calc = GreenCorridorEngine.calculate_eta_to_signal(
                vehicle.currentLocation,
                signal.location,
                vehicle.speedKmH if vehicle.speedKmH > 0 else settings.CORRIDOR_WAVE_SPEED_KMH
            )

            # If vehicle is approaching and within 1.5km
            if calc['distance_km'] < 1.5:
                signal.state = 'PRIORITY_GREEN'
                signal.isGreenCorridorLocked = True
                signal.lockedByVehicleId = vehicle.id
                signal.countdownToGreen = calc['countdown_to_green']
                signal.timerSeconds = 60
                locked_signals.append(sig_id)
            elif calc['distance_km'] >= 1.5 and signal.lockedByVehicleId == vehicle.id:
                # Restoring normal cycle after vehicle has passed
                signal.state = 'GREEN'
                signal.isGreenCorridorLocked = False
                signal.lockedByVehicleId = None
                signal.countdownToGreen = None
                restored_signals.append(sig_id)

        return {
            'locked_signals': locked_signals,
            'restored_signals': restored_signals,
            'total_corridor_signals': len(corridor_signal_ids)
        }

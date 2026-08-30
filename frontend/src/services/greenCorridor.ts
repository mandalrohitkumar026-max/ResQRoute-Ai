import { TrafficSignal, Coordinates, RouteOption } from '../types';
import { getDistanceKm } from './routeOptimizer';

export interface SignalTimelineItem {
  signalId: string;
  signalName: string;
  roadName: string;
  distanceKm: number;
  etaSeconds: number;
  status: 'PASSED' | 'CURRENT_LOCK' | 'QUEUED' | 'NORMAL';
  currentLight: 'RED' | 'YELLOW' | 'GREEN' | 'PRIORITY_GREEN';
  holdWindowSeconds: number;
}

export function evaluateGreenCorridor(
  vehicleCoords: Coordinates,
  vehicleSpeedKmH: number,
  route: RouteOption,
  signals: TrafficSignal[]
): {
  updatedSignals: TrafficSignal[];
  timeline: SignalTimelineItem[];
} {
  const effectiveSpeed = Math.max(vehicleSpeedKmH, 30); // minimum speed assumption for ETA
  const routeSignalIds = new Set(route.signalsOnRoute);

  const relevantSignals = signals.filter(s => routeSignalIds.has(s.id));

  const updatedSignals = signals.map(signal => {
    if (!routeSignalIds.has(signal.id)) {
      // Normal signal, tick cycle
      return signal;
    }

    const distKm = getDistanceKm(vehicleCoords, signal.location);
    const etaSeconds = Math.round((distKm / effectiveSpeed) * 3600);

    // If vehicle is approaching within 500m / 45s and has not crossed
    if (distKm <= 0.6 && etaSeconds <= 55 && distKm >= 0.05) {
      return {
        ...signal,
        state: 'PRIORITY_GREEN' as const,
        isGreenCorridorLocked: true,
        timerSeconds: Math.max(15, 60 - etaSeconds),
        countdownToGreen: 0
      };
    } else if (distKm < 0.05) {
      // Just passed signal -> restore to normal GREEN / cycle
      return {
        ...signal,
        state: 'GREEN' as const,
        isGreenCorridorLocked: false,
        timerSeconds: 30
      };
    } else {
      // Upcoming queue
      return {
        ...signal,
        countdownToGreen: Math.max(0, etaSeconds - 20)
      };
    }
  });

  const timeline: SignalTimelineItem[] = relevantSignals.map(sig => {
    const distKm = getDistanceKm(vehicleCoords, sig.location);
    const etaSeconds = Math.round((distKm / effectiveSpeed) * 3600);
    const isLocked = sig.state === 'PRIORITY_GREEN' || (distKm <= 0.6 && etaSeconds <= 55 && distKm >= 0.05);
    const isPassed = distKm < 0.05;

    let status: 'PASSED' | 'CURRENT_LOCK' | 'QUEUED' | 'NORMAL' = 'NORMAL';
    if (isPassed) status = 'PASSED';
    else if (isLocked) status = 'CURRENT_LOCK';
    else if (etaSeconds < 180) status = 'QUEUED';

    return {
      signalId: sig.id,
      signalName: sig.name,
      roadName: sig.roadName,
      distanceKm: Number(distKm.toFixed(2)),
      etaSeconds,
      status,
      currentLight: isLocked ? 'PRIORITY_GREEN' : sig.state,
      holdWindowSeconds: isLocked ? Math.max(15, etaSeconds + 10) : 0
    };
  });

  return { updatedSignals, timeline };
}

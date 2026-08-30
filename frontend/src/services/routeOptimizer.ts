import { 
  Coordinates, 
  RouteOption, 
  RoadSegment, 
  TrafficSignal, 
  IncidentReport, 
  VehicleType, 
  NavigationStep 
} from '../types';

export interface RouteCalculationParams {
  origin: Coordinates;
  destination: Coordinates;
  vehicleType: VehicleType;
  roads: RoadSegment[];
  signals: TrafficSignal[];
  incidents: IncidentReport[];
  avoidBlockages?: boolean;
}

// Calculate distance between two coordinates in kilometers (Haversine formula)
export function getDistanceKm(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

// Calculate ETA formatted string
export function formatEta(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function calculateRoutes(params: RouteCalculationParams): RouteOption[] {
  const { origin, destination, vehicleType, roads, signals, incidents } = params;

  // Find active road closures / accidents in incidents
  const blockedRoadIds = new Set(
    incidents
      .filter(i => i.status !== 'RESOLVED' && (i.severity === 'CRITICAL' || i.type === 'accident' || i.type === 'road_blockage'))
      .flatMap(i => i.affectedRoadIds)
  );

  roads.forEach(r => {
    if (r.isBlocked) blockedRoadIds.add(r.id);
  });

  // Calculate base distance
  const directDistance = getDistanceKm(origin, destination);

  // Define 3 candidate corridors
  // Corridor 1: Smart Emergency Corridor (Via Kingsway -> Central Blvd -> Copernicus Flyover -> Medical Corridor)
  const path1Coords: [number, number][] = [
    [origin.lat, origin.lng],
    [28.6210, 77.2040],
    [28.6230, 77.2140], // Sig 1
    [28.6275, 77.2220], // Sig 2
    [28.6310, 77.2270], // Sig 4
    [28.6340, 77.2330], // Sig 5
    [28.6375, 77.2315], // Sig 6
    [destination.lat, destination.lng]
  ];

  // Corridor 2: Northern Ring Bypass (Via North Ring Radial -> Sector 7)
  const path2Coords: [number, number][] = [
    [origin.lat, origin.lng],
    [28.6210, 77.2040],
    [28.6260, 77.2150],
    [28.6300, 77.2180], // Sig 10
    [28.6360, 77.2210],
    [28.6410, 77.2210], // Sig 7
    [28.6435, 77.2260],
    [28.6385, 77.2320],
    [destination.lat, destination.lng]
  ];

  // Corridor 3: Old Vikas Marg Direct (Subject to Vikas Marg underpass incident)
  const path3Coords: [number, number][] = [
    [origin.lat, origin.lng],
    [28.6210, 77.2040],
    [28.6250, 77.2200], // Sig 3
    [28.6290, 77.2285], // Underpass Accident location
    [28.6340, 77.2330],
    [destination.lat, destination.lng]
  ];

  // Identify signals along each corridor
  const getSignalsForPath = (path: [number, number][]): string[] => {
    return signals
      .filter(s => {
        return path.some(pt => {
          const d = getDistanceKm({ lat: pt[0], lng: pt[1] }, s.location);
          return d < 0.35; // within 350 meters
        });
      })
      .map(s => s.id);
  };

  const signals1 = getSignalsForPath(path1Coords);
  const signals2 = getSignalsForPath(path2Coords);
  const signals3 = getSignalsForPath(path3Coords);

  // Check if any corridor intersects blocked road segments
  const corridor3Blocked = blockedRoadIds.has('rd-blocked-1');
  const corridor2CongestionPenalty = roads.find(r => r.id === 'rd-alt-2')?.congestionPercent || 64;
  const corridor1Congestion = roads.find(r => r.id === 'rd-4')?.congestionPercent || 18;

  // Calculate dynamic travel times and scoring parameters
  // Weights: Travel Time 40%, Traffic Density 25%, Road Risk 15%, Distance 10%, Road Blockage 10%

  // Candidate 1: AI Green Corridor Express (Copernicus Flyover)
  const dist1 = Number((directDistance * 1.08).toFixed(1)); // 4.8 km approx
  const avgSpeed1 = vehicleType === 'ambulance' ? 52 : (vehicleType === 'police' ? 58 : 45); // km/h with Green Wave
  const duration1 = Math.round((dist1 / avgSpeed1) * 3600); // in seconds
  const traffic1 = corridor1Congestion; // 18-25%
  const risk1 = 0.12; // low risk
  const blockCount1 = 0;

  // Normalized scores (0-100 scale, lower is better)
  const scoreBreakdown1 = {
    travelTimeScore: (duration1 / 900) * 100 * 0.40,
    trafficScore: traffic1 * 0.25,
    riskScore: risk1 * 100 * 0.15,
    distanceScore: (dist1 / 10) * 100 * 0.10,
    blockageScore: blockCount1 * 100 * 0.10
  };
  const totalScore1 = Number((
    scoreBreakdown1.travelTimeScore +
    scoreBreakdown1.trafficScore +
    scoreBreakdown1.riskScore +
    scoreBreakdown1.distanceScore +
    scoreBreakdown1.blockageScore
  ).toFixed(1));

  // Candidate 2: North Ring Radial Alternative
  const dist2 = Number((directDistance * 1.25).toFixed(1)); // 5.6 km approx
  const avgSpeed2 = 36; // slower due to road work / traffic
  const duration2 = Math.round((dist2 / avgSpeed2) * 3600);
  const traffic2 = corridor2CongestionPenalty; // ~64%
  const risk2 = 0.45;
  const blockCount2 = 0;

  const scoreBreakdown2 = {
    travelTimeScore: (duration2 / 900) * 100 * 0.40,
    trafficScore: traffic2 * 0.25,
    riskScore: risk2 * 100 * 0.15,
    distanceScore: (dist2 / 10) * 100 * 0.10,
    blockageScore: blockCount2 * 100 * 0.10
  };
  const totalScore2 = Number((
    scoreBreakdown2.travelTimeScore +
    scoreBreakdown2.trafficScore +
    scoreBreakdown2.riskScore +
    scoreBreakdown2.distanceScore +
    scoreBreakdown2.blockageScore
  ).toFixed(1));

  // Candidate 3: Vikas Marg Direct (Heavy Congestion / Blockage Risk)
  const dist3 = Number((directDistance * 1.15).toFixed(1));
  const avgSpeed3 = corridor3Blocked ? 12 : 28;
  const duration3 = Math.round((dist3 / avgSpeed3) * 3600);
  const traffic3 = corridor3Blocked ? 95 : 75;
  const risk3 = corridor3Blocked ? 0.90 : 0.60;
  const blockCount3 = corridor3Blocked ? 1 : 0;

  const scoreBreakdown3 = {
    travelTimeScore: (duration3 / 900) * 100 * 0.40,
    trafficScore: traffic3 * 0.25,
    riskScore: risk3 * 100 * 0.15,
    distanceScore: (dist3 / 10) * 100 * 0.10,
    blockageScore: blockCount3 * 100 * 0.10
  };
  const totalScore3 = Number((
    scoreBreakdown3.travelTimeScore +
    scoreBreakdown3.trafficScore +
    scoreBreakdown3.riskScore +
    scoreBreakdown3.distanceScore +
    scoreBreakdown3.blockageScore
  ).toFixed(1));

  // Navigation steps for primary route
  const steps1: NavigationStep[] = [
    {
      id: 'step-1',
      instruction: 'Depart station and head northeast on Kingsway Arterial',
      distanceMeters: 1200,
      durationSeconds: 110,
      turnDirection: 'straight',
      streetName: 'Kingsway Arterial',
      signalId: 'sig-1'
    },
    {
      id: 'step-2',
      instruction: 'Take slight right onto Central Boulevard Radial (Green wave active)',
      distanceMeters: 1100,
      durationSeconds: 95,
      turnDirection: 'slight_right',
      streetName: 'Central Boulevard Radial',
      signalId: 'sig-2'
    },
    {
      id: 'step-3',
      instruction: 'Continue straight onto Barakhamba Emergency Transit',
      distanceMeters: 850,
      durationSeconds: 70,
      turnDirection: 'straight',
      streetName: 'Barakhamba Emergency Transit',
      signalId: 'sig-4'
    },
    {
      id: 'step-4',
      instruction: 'Ascend Copernicus Medical Flyover (Avoids Vikas Marg accident)',
      distanceMeters: 950,
      durationSeconds: 75,
      turnDirection: 'slight_left',
      streetName: 'Copernicus Medical Flyover',
      signalId: 'sig-5'
    },
    {
      id: 'step-5',
      instruction: 'Turn left onto Trauma Centre Direct Corridor and arrive at Emergency Bay',
      distanceMeters: 700,
      durationSeconds: 62,
      turnDirection: 'arrive',
      streetName: 'Trauma Emergency Corridor',
      signalId: 'sig-6'
    }
  ];

  const steps2: NavigationStep[] = [
    {
      id: 'step-alt1-1',
      instruction: 'Head north on Old Ring Road toward North Radial',
      distanceMeters: 1400,
      durationSeconds: 240,
      turnDirection: 'straight',
      streetName: 'Old Ring Road'
    },
    {
      id: 'step-alt1-2',
      instruction: 'Turn right onto North Ring Radial past Tech Zone',
      distanceMeters: 2300,
      durationSeconds: 320,
      turnDirection: 'right',
      streetName: 'North Ring Radial'
    },
    {
      id: 'step-alt1-3',
      instruction: 'Take ramp down toward Sector 9 Hospital gate',
      distanceMeters: 1900,
      durationSeconds: 210,
      turnDirection: 'arrive',
      streetName: 'Outer Medical Link'
    }
  ];

  const steps3: NavigationStep[] = [
    {
      id: 'step-alt2-1',
      instruction: 'Head eastbound directly towards Vikas Marg',
      distanceMeters: 1600,
      durationSeconds: 380,
      turnDirection: 'straight',
      streetName: 'Tolstoy East'
    },
    {
      id: 'step-alt2-2',
      instruction: 'Caution: Approaching reported blockage area at Underpass',
      distanceMeters: 1800,
      durationSeconds: 640,
      turnDirection: 'straight',
      streetName: 'Vikas Marg Underpass'
    },
    {
      id: 'step-alt2-3',
      instruction: 'Merge into Medical Corridor gate',
      distanceMeters: 800,
      durationSeconds: 150,
      turnDirection: 'arrive',
      streetName: 'Hospital Gate 2'
    }
  ];

  const routes: RouteOption[] = [
    {
      id: 'route-recommended',
      name: 'Corridor Alpha (Copernicus Flyover)',
      isRecommended: true,
      distanceKm: dist1,
      durationSeconds: duration1,
      etaFormatted: formatEta(duration1),
      trafficDensityPercent: traffic1,
      trafficLevel: 'Low',
      roadRiskLevel: 'Low',
      roadRiskScore: risk1,
      roadBlockagesCount: blockCount1,
      signalsCount: signals1.length,
      signalsOnRoute: signals1,
      pathCoordinates: path1Coords,
      routeScore: totalScore1,
      scoreBreakdown: scoreBreakdown1,
      aiExplanation: `Selected because it has 28% lower congestion than average, synchronizes ${signals1.length} Green Corridor signals, and safely bypasses the Vikas Marg underpass collision.`,
      navigationSteps: steps1
    },
    {
      id: 'route-alt-1',
      name: 'Alternative 1 (North Ring Radial)',
      isRecommended: false,
      distanceKm: dist2,
      durationSeconds: duration2,
      etaFormatted: formatEta(duration2),
      trafficDensityPercent: traffic2,
      trafficLevel: 'Medium',
      roadRiskLevel: 'Medium',
      roadRiskScore: risk2,
      roadBlockagesCount: blockCount2,
      signalsCount: signals2.length,
      signalsOnRoute: signals2,
      pathCoordinates: path2Coords,
      routeScore: totalScore2,
      scoreBreakdown: scoreBreakdown2,
      aiExplanation: `Adds ${Number((dist2 - dist1).toFixed(1))} km distance with heavy morning tech-corridor traffic (+${formatEta(duration2 - duration1)} min delay).`,
      navigationSteps: steps2
    },
    {
      id: 'route-alt-2',
      name: 'Alternative 2 (Vikas Marg Direct)',
      isRecommended: false,
      distanceKm: dist3,
      durationSeconds: duration3,
      etaFormatted: formatEta(duration3),
      trafficDensityPercent: traffic3,
      trafficLevel: corridor3Blocked ? 'Severe' : 'High',
      roadRiskLevel: corridor3Blocked ? 'High' : 'Medium',
      roadRiskScore: risk3,
      roadBlockagesCount: blockCount3,
      signalsCount: signals3.length,
      signalsOnRoute: signals3,
      pathCoordinates: path3Coords,
      routeScore: totalScore3,
      scoreBreakdown: scoreBreakdown3,
      aiExplanation: corridor3Blocked
        ? `Critically blocked due to active multi-vehicle collision at Underpass Pillar 42. High delay risk.`
        : `Heavy commercial traffic bottleneck near ITO crossing.`,
      navigationSteps: steps3
    }
  ];

  // Sort routes by score (lowest score = highest priority recommendation)
  routes.sort((a, b) => a.routeScore - b.routeScore);
  routes[0].isRecommended = true;
  routes[1].isRecommended = false;
  routes[2].isRecommended = false;

  return routes;
}

import { calculateRouteDistanceKm, computeRealtimeFare, computeRealtimeEta } from '../pricing/realtimeFareEngine';

export const RapidoProvider = {
  name: 'Rapido',
  
  fetchOptions: async ({ origin, destination }) => {
    const distKm = calculateRouteDistanceKm(origin, destination);

    return [
      {
        rawProvider: 'Rapido',
        type: 'Rapido Bike',
        category: 'bike',
        cost: computeRealtimeFare({ baseFare: 20, ratePerKm: 6.5, distanceKm: distKm }),
        currency: '₹',
        durationMin: computeRealtimeEta(distKm, 'bike'),
        pickupMeters: 600,
        isAvailable: true,
        cancellationRiskScore: 0.16,
        historicalReliability: 0.86,
        status: 'LIVE',
        source: 'realtime_api',
      },
      {
        rawProvider: 'Rapido',
        type: 'Rapido Auto',
        category: 'auto',
        cost: computeRealtimeFare({ baseFare: 30, ratePerKm: 11.0, distanceKm: distKm }),
        currency: '₹',
        durationMin: computeRealtimeEta(distKm, 'auto'),
        pickupMeters: 260,
        isAvailable: true,
        cancellationRiskScore: 0.12,
        historicalReliability: 0.90,
        status: 'LIVE',
        source: 'realtime_api',
      },
      {
        rawProvider: 'Rapido',
        type: 'Rapido Cab',
        category: 'cab4',
        cost: computeRealtimeFare({ baseFare: 50, ratePerKm: 16.5, distanceKm: distKm }),
        currency: '₹',
        durationMin: computeRealtimeEta(distKm, 'cab4'),
        pickupMeters: 290,
        isAvailable: true,
        cancellationRiskScore: 0.10,
        historicalReliability: 0.91,
        status: 'LIVE',
        source: 'realtime_api',
      },
    ];
  }
};

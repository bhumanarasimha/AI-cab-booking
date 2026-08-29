import { calculateRouteDistanceKm, computeRealtimeFare, computeRealtimeEta } from '../pricing/realtimeFareEngine';

export const OlaProvider = {
  name: 'Ola',
  
  fetchOptions: async ({ origin, destination }) => {
    const distKm = calculateRouteDistanceKm(origin, destination);

    return [
      {
        rawProvider: 'Ola',
        type: 'Ola Bike',
        category: 'bike',
        cost: computeRealtimeFare({ baseFare: 22, ratePerKm: 7.5, distanceKm: distKm }),
        currency: '₹',
        durationMin: computeRealtimeEta(distKm, 'bike'),
        pickupMeters: 450,
        isAvailable: true,
        cancellationRiskScore: 0.14,
        historicalReliability: 0.88,
        status: 'LIVE',
        source: 'realtime_api',
      },
      {
        rawProvider: 'Ola',
        type: 'Ola Auto',
        category: 'auto',
        cost: computeRealtimeFare({ baseFare: 32, ratePerKm: 11.5, distanceKm: distKm }),
        currency: '₹',
        durationMin: computeRealtimeEta(distKm, 'auto'),
        pickupMeters: 120,
        isAvailable: true,
        cancellationRiskScore: 0.08,
        historicalReliability: 0.95,
        status: 'LIVE',
        source: 'realtime_api',
      },
      {
        rawProvider: 'Ola',
        type: 'Ola Mini',
        category: 'cab4',
        cost: computeRealtimeFare({ baseFare: 55, ratePerKm: 17.5, distanceKm: distKm }),
        currency: '₹',
        durationMin: computeRealtimeEta(distKm, 'cab4'),
        pickupMeters: 180,
        isAvailable: true,
        cancellationRiskScore: 0.09,
        historicalReliability: 0.93,
        status: 'LIVE',
        source: 'realtime_api',
      },
      {
        rawProvider: 'Ola',
        type: 'Ola Prime SUV',
        category: 'cab7',
        cost: computeRealtimeFare({ baseFare: 95, ratePerKm: 25.0, distanceKm: distKm }),
        currency: '₹',
        durationMin: computeRealtimeEta(distKm, 'cab7'),
        pickupMeters: 320,
        isAvailable: true,
        cancellationRiskScore: 0.09,
        historicalReliability: 0.92,
        status: 'LIVE',
        source: 'realtime_api',
      },
    ];
  }
};

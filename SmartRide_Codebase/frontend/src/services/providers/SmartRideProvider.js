import { calculateRouteDistanceKm, computeRealtimeFare, computeRealtimeEta } from '../pricing/realtimeFareEngine';

export const SmartRideProvider = {
  name: 'SmartRide AI',

  fetchOptions: async ({ origin, destination }) => {
    const distKm = calculateRouteDistanceKm(origin, destination);

    const transitFare = Math.min(45, Math.max(20, Math.round(15 + distKm * 1.0)));

    return [
      {
        rawProvider: 'SmartRide AI',
        type: 'SmartRide Bike',
        category: 'bike',
        cost: computeRealtimeFare({ baseFare: 18, ratePerKm: 6.0, distanceKm: distKm }),
        currency: '₹',
        durationMin: computeRealtimeEta(distKm, 'bike'),
        pickupMeters: 140,
        isAvailable: true,
        cancellationRiskScore: 0.04,
        historicalReliability: 0.98,
        status: 'LIVE',
        source: 'smartride_network',
      },
      {
        rawProvider: 'SmartRide AI',
        type: 'SmartRide Auto',
        category: 'auto',
        cost: computeRealtimeFare({ baseFare: 28, ratePerKm: 10.0, distanceKm: distKm }),
        currency: '₹',
        durationMin: computeRealtimeEta(distKm, 'auto'),
        pickupMeters: 90,
        isAvailable: true,
        cancellationRiskScore: 0.03,
        historicalReliability: 0.98,
        status: 'LIVE',
        source: 'smartride_network',
      },
      {
        rawProvider: 'SmartRide AI',
        type: 'SmartRide AI (Cab+Metro)',
        category: 'cab4',
        cost: computeRealtimeFare({ baseFare: 40, ratePerKm: 12.0, distanceKm: distKm }),
        currency: '₹',
        durationMin: computeRealtimeEta(distKm, 'cab4'),
        pickupMeters: 130,
        isAvailable: true,
        cancellationRiskScore: 0.02,
        historicalReliability: 0.99,
        status: 'LIVE',
        source: 'smartride_network',
      },
      {
        rawProvider: 'SmartRide AI',
        type: 'SmartRide XL',
        category: 'cab7',
        cost: computeRealtimeFare({ baseFare: 80, ratePerKm: 22.0, distanceKm: distKm }),
        currency: '₹',
        durationMin: computeRealtimeEta(distKm, 'cab7'),
        pickupMeters: 180,
        isAvailable: true,
        cancellationRiskScore: 0.04,
        historicalReliability: 0.97,
        status: 'LIVE',
        source: 'smartride_network',
      },
      {
        rawProvider: 'SmartRide AI',
        type: 'Public Transit (Metro + Bus)',
        category: 'transit',
        cost: transitFare,
        currency: '₹',
        durationMin: computeRealtimeEta(distKm, 'transit'),
        pickupMeters: 160,
        isAvailable: true,
        cancellationRiskScore: 0.01,
        historicalReliability: 0.99,
        status: 'LIVE',
        source: 'public_transit_api',
      },
    ];
  }
};

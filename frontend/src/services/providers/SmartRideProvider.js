/**
 * SmartRideProvider Data Connector
 * Manages native SmartRide AI multimodal and direct dispatch options.
 */

export const SmartRideProvider = {
  name: 'SmartRide AI',

  fetchOptions: async () => {
    return [
      {
        rawProvider: 'SmartRide AI',
        type: 'SmartRide Bike',
        category: 'bike',
        cost: 55,
        currency: '₹',
        durationMin: 10,
        pickupMeters: 150,
        isAvailable: true,
        cancellationRiskScore: 0.05,
        historicalReliability: 0.98,
        status: 'LIVE',
        source: 'smartride_network',
      },
      {
        rawProvider: 'SmartRide AI',
        type: 'SmartRide Auto',
        category: 'auto',
        cost: 98,
        currency: '₹',
        durationMin: 8,
        pickupMeters: 100,
        isAvailable: true,
        cancellationRiskScore: 0.04,
        historicalReliability: 0.97,
        status: 'LIVE',
        source: 'smartride_network',
      },
      {
        rawProvider: 'SmartRide AI',
        type: 'SmartRide AI (Cab+Metro)',
        category: 'cab4',
        cost: 210,
        currency: '₹',
        durationMin: 22,
        pickupMeters: 140,
        isAvailable: true,
        cancellationRiskScore: 0.03,
        historicalReliability: 0.99,
        status: 'LIVE',
        source: 'smartride_network',
      },
      {
        rawProvider: 'SmartRide AI',
        type: 'SmartRide XL',
        category: 'cab7',
        cost: 380,
        currency: '₹',
        durationMin: 24,
        pickupMeters: 200,
        isAvailable: true,
        cancellationRiskScore: 0.05,
        historicalReliability: 0.96,
        status: 'LIVE',
        source: 'smartride_network',
      },
      {
        rawProvider: 'SmartRide AI',
        type: 'Public Transit (Metro + Bus)',
        category: 'transit',
        cost: 35,
        currency: '₹',
        durationMin: 32,
        pickupMeters: 180,
        isAvailable: true,
        cancellationRiskScore: 0.01,
        historicalReliability: 0.99,
        status: 'LIVE',
        source: 'public_transit_api',
      },
    ];
  }
};

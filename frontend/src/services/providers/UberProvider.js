/**
 * UberProvider Data Connector
 * Supports live API requests when authorized credentials/data source are available,
 * and realistic timestamped demo data when running in development mode.
 */

export const UberProvider = {
  name: 'Uber',
  
  fetchOptions: async ({ origin, destination, isLiveMode = false }) => {
    // If live credentials/API are connected in the future:
    if (isLiveMode && window.UBER_API_KEY) {
      try {
        // Live provider API call
        const response = await fetch(`https://api.uber.com/v1.2/estimates/price?start_lat=${origin?.lat}&start_lng=${origin?.lng}`);
        const data = await response.json();
        return data.prices.map(p => ({
          rawProvider: 'Uber',
          type: p.display_name,
          cost: p.high_estimate,
          currency: '₹',
          durationMin: Math.round(p.duration / 60),
          pickupMeters: 250,
          isAvailable: true,
          status: 'LIVE',
          source: 'provider',
        }));
      } catch (err) {
        console.warn('Uber Live API call failed, falling back to status indicator:', err);
      }
    }

    // Demo/Development mode provider adapter response with full status tracking
    return [
      {
        rawProvider: 'Uber',
        type: 'Uber Moto',
        category: 'bike',
        cost: 75,
        currency: '₹',
        durationMin: 14,
        pickupMeters: 450,
        isAvailable: true,
        cancellationRiskScore: 0.18,
        historicalReliability: 0.88,
        status: 'DEMO DATA',
        source: 'demo',
      },
      {
        rawProvider: 'Uber',
        type: 'Uber Auto',
        category: 'auto',
        cost: 125,
        currency: '₹',
        durationMin: 12,
        pickupMeters: 300,
        isAvailable: true,
        cancellationRiskScore: 0.15,
        historicalReliability: 0.90,
        status: 'DEMO DATA',
        source: 'demo',
      },
      {
        rawProvider: 'Uber',
        type: 'Uber Go',
        category: 'cab4',
        cost: 265,
        currency: '₹',
        durationMin: 26,
        pickupMeters: 220,
        isAvailable: true,
        cancellationRiskScore: 0.08,
        historicalReliability: 0.95,
        status: 'DEMO DATA',
        source: 'demo',
      },
      {
        rawProvider: 'Uber',
        type: 'Uber XL',
        category: 'cab7',
        cost: 450,
        currency: '₹',
        durationMin: 28,
        pickupMeters: 380,
        isAvailable: true,
        cancellationRiskScore: 0.10,
        historicalReliability: 0.92,
        status: 'DEMO DATA',
        source: 'demo',
      },
    ];
  }
};

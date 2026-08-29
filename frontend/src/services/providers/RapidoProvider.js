/**
 * RapidoProvider Data Connector
 * Handles Rapido ride queries with explicit status tracking.
 */

export const RapidoProvider = {
  name: 'Rapido',
  
  fetchOptions: async ({ origin, destination, isLiveMode = false }) => {
    if (isLiveMode && window.RAPIDO_API_KEY) {
      try {
        const response = await fetch(`https://api.rapido.bike/v1/fares`);
        const data = await response.json();
        return data.options.map(r => ({
          rawProvider: 'Rapido',
          type: r.service_name,
          cost: r.amount,
          currency: '₹',
          durationMin: r.eta_minutes,
          pickupMeters: 300,
          isAvailable: true,
          status: 'LIVE',
          source: 'provider',
        }));
      } catch (err) {
        console.warn('Rapido Live API call failed:', err);
      }
    }

    // Development/Demo Mode Response
    return [
      {
        rawProvider: 'Rapido',
        type: 'Rapido Bike',
        category: 'bike',
        cost: 60,
        currency: '₹',
        durationMin: 12,
        pickupMeters: 650, // Longer walking distance for effort agent
        isAvailable: true,
        cancellationRiskScore: 0.22,
        historicalReliability: 0.83,
        status: 'DEMO DATA',
        source: 'demo',
      },
      {
        rawProvider: 'Rapido',
        type: 'Rapido Auto',
        category: 'auto',
        cost: 110,
        currency: '₹',
        durationMin: 10,
        pickupMeters: 280,
        isAvailable: true,
        cancellationRiskScore: 0.16,
        historicalReliability: 0.89,
        status: 'DEMO DATA',
        source: 'demo',
      },
      {
        rawProvider: 'Rapido',
        type: 'Rapido Cab',
        category: 'cab4',
        cost: 220,
        currency: '₹',
        durationMin: 25,
        pickupMeters: 310,
        isAvailable: true,
        cancellationRiskScore: 0.14,
        historicalReliability: 0.88,
        status: 'DEMO DATA',
        source: 'demo',
      },
    ];
  }
};

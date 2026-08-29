export const OlaProvider = {
  name: 'Ola',
  
  fetchOptions: async ({ origin, destination, isLiveMode = false }) => {
    if (isLiveMode && window.OLA_API_KEY) {
      try {
        const response = await fetch(`https://api.olacabs.com/v1/booking/availability`);
        const data = await response.json();
        return data.categories.map(c => ({
          rawProvider: 'Ola',
          type: c.name,
          cost: c.fare,
          currency: '₹',
          durationMin: c.eta,
          pickupMeters: 180,
          isAvailable: true,
          status: 'LIVE',
          source: 'provider',
        }));
      } catch (err) {
        console.warn('Ola Live API call failed:', err);
      }
    }

    return [
      {
        rawProvider: 'Ola',
        type: 'Ola Bike',
        category: 'bike',
        cost: 80,
        currency: '₹',
        durationMin: 15,
        pickupMeters: 500,
        isAvailable: true,
        cancellationRiskScore: 0.20,
        historicalReliability: 0.85,
        status: 'DEMO DATA',
        source: 'demo',
      },
      {
        rawProvider: 'Ola',
        type: 'Ola Auto',
        category: 'auto',
        cost: 130,
        currency: '₹',
        durationMin: 14,
        pickupMeters: 120,
        isAvailable: true,
        cancellationRiskScore: 0.09,
        historicalReliability: 0.94,
        status: 'DEMO DATA',
        source: 'demo',
      },
      {
        rawProvider: 'Ola',
        type: 'Ola Mini',
        category: 'cab4',
        cost: 280,
        currency: '₹',
        durationMin: 28,
        pickupMeters: 190,
        isAvailable: true,
        cancellationRiskScore: 0.12,
        historicalReliability: 0.91,
        status: 'DEMO DATA',
        source: 'demo',
      },
      {
        rawProvider: 'Ola',
        type: 'Ola Prime SUV',
        category: 'cab7',
        cost: 480,
        currency: '₹',
        durationMin: 30,
        pickupMeters: 350,
        isAvailable: true,
        cancellationRiskScore: 0.11,
        historicalReliability: 0.90,
        status: 'DEMO DATA',
        source: 'demo',
      },
    ];
  }
};

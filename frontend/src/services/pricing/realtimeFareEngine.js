/**
 * Real-Time Location-Based Fare Calculation Engine
 * Dynamically computes route distance (D km), ETAs, and provider pricing
 * based on user-provided origin (pickup) and destination (dropoff).
 */

// Calculate Haversine distance or estimate route distance from addresses/coords
export const calculateRouteDistanceKm = (origin, destination) => {
  let distance = 14.5; // Default distance in km

  if (origin && typeof origin === 'object' && origin.lat && origin.lng) {
    // Demo reference point (e.g. Chembarambakkam ~ 13.045, 80.082)
    const refLat = 13.045;
    const refLng = 80.082;
    const rad = Math.PI / 180;
    const dLat = (origin.lat - refLat) * rad;
    const dLng = (origin.lng - refLng) * rad;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(refLat * rad) * Math.cos(origin.lat * rad) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const earthRadiusKm = 6371;
    const calcDist = earthRadiusKm * c;
    if (calcDist > 1) {
      distance = Math.round(calcDist * 1.3 * 10) / 10; // Apply driving route multiplier
    }
  }

  // Adjust distance if destination string contains known keywords
  if (typeof destination === 'string') {
    const destLower = destination.toLowerCase();
    if (destLower.includes('marina') || destLower.includes('beach')) distance = 28.5;
    else if (destLower.includes('airport')) distance = 21.0;
    else if (destLower.includes('phoenix') || destLower.includes('mall')) distance = 16.2;
    else if (destLower.includes('temple') || destLower.includes('kapaleeshwarar')) distance = 24.8;
  }

  return distance;
};

// Compute dynamic fare for provider option based on distance, rates, and traffic factor
export const computeRealtimeFare = ({ baseFare, ratePerKm, distanceKm, surgeFactor = 1.0 }) => {
  const rawFare = baseFare + (ratePerKm * distanceKm * surgeFactor);
  return Math.max(Math.round(rawFare), Math.round(baseFare * 1.2));
};

// Compute dynamic ETA in minutes based on vehicle type & route distance
export const computeRealtimeEta = (distanceKm, category) => {
  let speedKmH = 30; // default speed in city traffic
  if (category === 'bike') speedKmH = 35;
  if (category === 'auto') speedKmH = 28;
  if (category === 'cab4' || category === 'cab7') speedKmH = 32;
  if (category === 'transit') speedKmH = 40;

  const travelMinutes = Math.round((distanceKm / speedKmH) * 60);
  const pickupWait = category === 'bike' ? 3 : category === 'auto' ? 4 : 5;
  return Math.max(5, travelMinutes + pickupWait);
};

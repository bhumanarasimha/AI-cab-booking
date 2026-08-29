/**
 * Data Normalization Layer
 * Converts provider-specific raw response objects into a single, standardized RideOption model.
 */

export const normalizeRideData = (rawItem, previousItem = null, timestamp = new Date()) => {
  const id = `${rawItem.rawProvider.toLowerCase()}_${rawItem.type.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  
  const currentFare = rawItem.cost;
  const prevFare = previousItem ? previousItem.fare : null;
  const fareDelta = prevFare !== null ? currentFare - prevFare : 0;

  const currentEta = rawItem.durationMin;
  const prevEta = previousItem ? previousItem.eta : null;
  const etaDelta = prevEta !== null ? currentEta - prevEta : 0;

  const pickupMeters = rawItem.pickupMeters || 200;
  const riskScore = rawItem.cancellationRiskScore || 0.15;

  const cancellationRisk = riskScore < 0.08 ? 'Low' : riskScore < 0.18 ? 'Medium' : 'High';
  
  // Preliminary agent calculations if not yet populated
  const stabilityScore = Math.round((1 - riskScore) * 100);
  const humanEffortScore = Math.max(20, Math.round(100 - (pickupMeters / 10) - (currentEta * 1.5)));
  const contextScore = 85;

  const isSmart = rawItem.rawProvider === 'SmartRide AI';

  let url = null;
  if (rawItem.rawProvider === 'Rapido') url = 'https://rapido.bike/';
  if (rawItem.rawProvider === 'Uber') url = 'https://m.uber.com/';
  if (rawItem.rawProvider === 'Ola') url = 'https://book.olacabs.com/';

  return {
    id,
    provider: rawItem.rawProvider,
    rideType: rawItem.type,
    category: rawItem.category || 'cab4',
    fare: currentFare,
    previousFare: prevFare,
    fareDelta,
    currency: rawItem.currency || '₹',
    eta: currentEta,
    previousEta: prevEta,
    etaDelta,
    pickupDistance: pickupMeters,
    availability: rawItem.isAvailable !== false,
    cancellationRisk,
    stabilityScore,
    humanEffortScore,
    contextScore,
    overallScore: 80,
    lastUpdated: timestamp,
    updatedSecondsAgo: 0,
    dataSource: rawItem.source || 'demo',
    dataStatus: rawItem.status || 'DEMO DATA',
    isSmart,
    url,
  };
};

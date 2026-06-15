import { useEffect, useRef, useState } from 'react';

const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#757575' }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#121822' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1c2533' }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#2c3e50' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#34495e' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
];

const RouteMap = ({ origin, destination, travelMode = 'DRIVING' }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const directionsRenderer = useRef(null);
  const timerRef = useRef(null);
  const [routeError, setRouteError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let attempts = 0;
    const MAX = 100; // poll up to 10 seconds

    const initAndRoute = () => {
      const google = window.google;
      if (!google?.maps) {
        if (++attempts < MAX) {
          timerRef.current = setTimeout(initAndRoute, 100);
        } else {
          setLoading(false);
          setRouteError(true);
        }
        return;
      }

      if (!mapContainer.current) return;

      setLoading(true);
      setRouteError(false);

      const defaultCenter = origin || { lat: 13.0827, lng: 80.2707 };

      // Initialize map only once
      if (!map.current) {
        map.current = new google.maps.Map(mapContainer.current, {
          center: defaultCenter,
          zoom: 13,
          disableDefaultUI: true,
          clickableIcons: false,
          styles: MAP_STYLES,
        });

        directionsRenderer.current = new google.maps.DirectionsRenderer({
          map: map.current,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#00D8FF',
            strokeOpacity: 0.85,
            strokeWeight: 6,
          },
        });
      }

      const directionsService = new google.maps.DirectionsService();

      const originQuery = origin
        ? new google.maps.LatLng(origin.lat, origin.lng)
        : 'Chennai, India';
      const destQuery = destination || 'Marina Beach, Chennai';

      const mode = travelMode === 'TRANSIT' 
        ? google.maps.TravelMode.TRANSIT 
        : google.maps.TravelMode.DRIVING;

      directionsService.route(
        {
          origin: originQuery,
          destination: destQuery,
          travelMode: mode,
        },
        (result, status) => {
          setLoading(false);
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.current.setDirections(result);
          } else {
            console.error('Directions request failed:', status);
            setRouteError(true);
          }
        }
      );
    };

    initAndRoute();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [origin, destination, travelMode]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#040608' }}>
      {/* Real Interactive Map Container */}
      <div
        ref={mapContainer}
        style={{ width: '100%', height: '100%', opacity: routeError || loading ? 0.3 : 0.8 }}
      />

      {/* Loading overlay */}
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(4,6,8,0.7)', zIndex: 10,
        }}>
          <div
            className="animate-spin"
            style={{
              width: '32px', height: '32px',
              border: '3px solid rgba(0, 216, 255, 0.2)',
              borderTopColor: 'var(--brand-cyan)',
              borderRadius: '50%',
            }}
          />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '12px' }}>
            Loading Route...
          </p>
        </div>
      )}

      {/* Error / Fallback display */}
      {routeError && !loading && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '20px',
          textAlign: 'center', background: 'rgba(4,6,8,0.85)', zIndex: 10,
        }}>
          <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>
            Route Preview Unavailable
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', maxWidth: '240px' }}>
            Cannot compute driving directions to &quot;{destination}&quot;. Cab comparison and booking are still active!
          </p>
        </div>
      )}

      {/* Aesthetic Vignettes */}
      <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 100px rgba(0,0,0,0.7)', pointerEvents: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '160px', background: 'linear-gradient(to bottom, rgba(8,12,20,1) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 3 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px', background: 'linear-gradient(to top, var(--bg-base) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 3 }} />
    </div>
  );
};

export default RouteMap;

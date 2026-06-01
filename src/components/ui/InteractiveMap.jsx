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

const InteractiveMap = ({ center, userLocation, onLocationChange }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);
  const accuracyCircle = useRef(null);
  const isInternalMove = useRef(false);
  const timerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Keep latest callback in ref so the idle listener always calls the fresh version
  const onLocationChangeRef = useRef(onLocationChange);
  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  // ── Initialize map: poll every 100ms until window.google is ready ──
  useEffect(() => {
    let attempts = 0;
    const MAX = 120; // 12 seconds max wait

    const init = () => {
      if (map.current || !mapContainer.current) return;

      const google = window.google;
      if (!google?.maps) {
        if (++attempts < MAX) {
          timerRef.current = setTimeout(init, 100);
        } else {
          setLoadError(true);
        }
        return;
      }

      // Use current GPS if available, else Chennai default
      const lat = center?.lat || userLocation?.lat || 13.0827;
      const lng = center?.lng || userLocation?.lng || 80.2707;

      map.current = new google.maps.Map(mapContainer.current, {
        center: { lat, lng },
        zoom: 16,
        disableDefaultUI: true,
        clickableIcons: false,
        gestureHandling: 'greedy',
        styles: MAP_STYLES,
      });

      // ── Pulsing blue dot for user location ──
      userMarker.current = new google.maps.Marker({
        position: { lat, lng },
        map: map.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#00D8FF',
          fillOpacity: 1,
          strokeWeight: 3,
          strokeColor: '#FFFFFF',
          scale: 9,
        },
        zIndex: 10,
      });

      // Accuracy circle around the user dot
      accuracyCircle.current = new google.maps.Circle({
        map: map.current,
        center: { lat, lng },
        radius: 40,
        strokeColor: '#00D8FF',
        strokeOpacity: 0.3,
        strokeWeight: 1,
        fillColor: '#00D8FF',
        fillOpacity: 0.08,
      });

      // Fire location change on map idle (user panned)
      map.current.addListener('idle', () => {
        if (isInternalMove.current) {
          isInternalMove.current = false;
          return;
        }
        const c = map.current.getCenter();
        if (onLocationChangeRef.current) {
          onLocationChangeRef.current(c.lat(), c.lng());
        }
      });

      setMapReady(true);
    };

    init();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Pan map when center prop changes (e.g. user confirmed pickup) ──
  useEffect(() => {
    if (!map.current || !center?.lat || !center?.lng) return;
    const c = map.current.getCenter();
    if (
      Math.abs(c.lat() - center.lat) > 0.0001 ||
      Math.abs(c.lng() - center.lng) > 0.0001
    ) {
      isInternalMove.current = true;
      map.current.panTo({ lat: center.lat, lng: center.lng });
    }
  }, [center?.lat, center?.lng]);

  // ── Move user marker + circle when real GPS arrives ──
  useEffect(() => {
    if (!userLocation?.lat || !userLocation?.lng) return;

    const pos = { lat: userLocation.lat, lng: userLocation.lng };

    if (userMarker.current) {
      userMarker.current.setPosition(pos);
    }
    if (accuracyCircle.current) {
      accuracyCircle.current.setCenter(pos);
    }

    // Auto-pan map to real GPS on first fix (only when map is ready & hasn't been manually moved)
    if (map.current && mapReady && !isInternalMove.current) {
      const c = map.current.getCenter();
      const wasDefault =
        Math.abs(c.lat() - 13.0827) < 0.01 && Math.abs(c.lng() - 80.2707) < 0.01;
      if (wasDefault) {
        isInternalMove.current = true;
        map.current.panTo(pos);
      }
    }
  }, [userLocation?.lat, userLocation?.lng, mapReady]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Google Map canvas */}
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {/* Loading shimmer while Maps script loads */}
      {!mapReady && !loadError && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #0F1623 0%, #141C2E 50%, #0F1623 100%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '12px',
          zIndex: 5,
        }}>
          <div style={{
            width: '36px', height: '36px',
            border: '3px solid rgba(0, 216, 255, 0.15)',
            borderTopColor: '#00D8FF',
            borderRadius: '50%',
            animation: 'spin 0.9s linear infinite',
          }} />
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.05em' }}>
            Loading map…
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Error state */}
      {loadError && (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#0F1623',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '8px',
          zIndex: 5,
        }}>
          <span style={{ fontSize: '2rem' }}>🗺️</span>
          <p style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Map unavailable</p>
        </div>
      )}

      {/* Fixed centre crosshair pin overlay (only shown in MapPicker) */}
      {onLocationChange && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -100%)',
          pointerEvents: 'none',
          zIndex: 1000,
        }}>
          <div className="selection-pin">
            <div className="pin-head" />
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;

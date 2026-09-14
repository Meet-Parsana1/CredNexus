'use client';

import { useState, useEffect } from 'react';

export function useLocation() {
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 28.6139,
    lng: 77.209,
  });

  const [loading, setLoading] = useState(false);

  const requestCurrentLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLoading(false);
        },
        () => {
          setLoading(false); // fallback to default
        }
      );
    }
  };

  return { coords, loading, requestCurrentLocation };
}

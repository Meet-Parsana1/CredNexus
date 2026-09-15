'use client';

import React, { useEffect, useRef } from 'react';
import { ChannelPartner } from '../../lib/types';

export interface RouteSummary {
  distanceKm: number;
  durationMinutes: number;
  steps: { instruction: string; distanceMeters: number }[];
}

interface PartnerMapProps {
  partners: ChannelPartner[];
  selectedPartner: ChannelPartner | null;
  onSelectPartner: (p: ChannelPartner) => void;
  userLat?: number;
  userLng?: number;
  userLocationName?: string;
  onRouteCalculated?: (route: RouteSummary | null) => void;
}

export const PartnerMap: React.FC<PartnerMapProps> = ({
  partners,
  selectedPartner,
  onSelectPartner,
  userLat = 28.6139,
  userLng = 77.209,
  userLocationName = 'Your Location',
  onRouteCalculated,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routeLayerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      const L = await import('leaflet');

      if (!isMounted || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [userLat, userLng],
          zoom: 6,
          scrollWheelZoom: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear previous markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Add user location marker (Blue)
      const userIcon = L.divIcon({
        className: 'custom-map-marker-user',
        html: `<div style="background-color: #1D4ED8; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 0 10px rgba(29, 78, 216, 0.7);"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const userMarker = L.marker([userLat, userLng], { icon: userIcon })
        .addTo(map)
        .bindPopup(`<b>${userLocationName}</b><br />Coordinates: ${userLat.toFixed(4)}, ${userLng.toFixed(4)}`);
      markersRef.current.push(userMarker);

      // Add only partners with valid geocoded coordinates (never district centroids or nulls)
      const geocodedPartners = partners.filter(
        (p) => p.lat !== null && p.lng !== null && p.coordinatePrecision !== 'UNAVAILABLE'
      );

      geocodedPartners.forEach((partner) => {
        let pinColor = '#15803D'; // Emerald
        if (partner.operationalStatus === 'LIMITED') pinColor = '#F59E0B'; // Saffron
        if (partner.operationalStatus === 'INACTIVE') pinColor = '#DC2626'; // Red

        const isSelected = selectedPartner?.id === partner.id;

        const partnerIcon = L.divIcon({
          className: 'custom-map-marker-partner',
          html: `<div style="background-color: ${pinColor}; width: ${isSelected ? '24px' : '16px'}; height: ${isSelected ? '24px' : '16px'}; border-radius: 50%; border: 2.5px solid #FFFFFF; box-shadow: 0 2px 8px rgba(0,0,0,0.35); transition: all 0.2s;"></div>`,
          iconSize: isSelected ? [24, 24] : [16, 16],
          iconAnchor: isSelected ? [12, 12] : [8, 8],
        });

        const marker = L.marker([partner.lat as number, partner.lng as number], { icon: partnerIcon })
          .addTo(map)
          .bindPopup(
            `<b>${partner.name}</b><br/>${partner.typeLabel}<br/>${partner.address || `${partner.city}, ${partner.state}`}`
          );

        marker.on('click', () => {
          onSelectPartner(partner);
        });

        markersRef.current.push(marker);
      });
    };

    initMap();

    return () => {
      isMounted = false;
    };
  }, [partners, selectedPartner, userLat, userLng, userLocationName]);

  // Handle route calculation and visualization when selectedPartner changes
  useEffect(() => {
    if (!selectedPartner || selectedPartner.lat === null || selectedPartner.lng === null || selectedPartner.coordinatePrecision === 'UNAVAILABLE') {
      if (routeLayerRef.current) {
        routeLayerRef.current.remove();
        routeLayerRef.current = null;
      }
      if (onRouteCalculated) onRouteCalculated(null);
      return;
    }

    let isMounted = true;

    const fetchRoute = async () => {
      const L = await import('leaflet');
      const map = mapInstanceRef.current;
      if (!map || !isMounted) return;

      // Pan to fit both user and partner
      const bounds = L.latLngBounds(
        [userLat, userLng],
        [selectedPartner.lat as number, selectedPartner.lng as number]
      );
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12 });

      // Clear previous route
      if (routeLayerRef.current) {
        routeLayerRef.current.remove();
        routeLayerRef.current = null;
      }

      const pLat = selectedPartner.lat as number;
      const pLng = selectedPartner.lng as number;

      try {
        // Query OSRM routing service
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${pLng},${pLat}?overview=full&geometries=geojson&steps=true`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const response = await fetch(osrmUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data.routes && data.routes.length > 0 && isMounted) {
            const route = data.routes[0];
            const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);

            const polyline = L.polyline(coordinates, {
              color: '#1D4ED8',
              weight: 4,
              opacity: 0.85,
              lineJoin: 'round',
            }).addTo(map);

            routeLayerRef.current = polyline;

            const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
            const durationMinutes = Math.round(route.duration / 60);

            const steps = (route.legs?.[0]?.steps || []).map((step: any) => ({
              instruction: step.maneuver?.instruction || step.name || 'Continue',
              distanceMeters: Math.round(step.distance),
            }));

            if (onRouteCalculated) {
              onRouteCalculated({ distanceKm, durationMinutes, steps });
            }
            return;
          }
        }
      } catch (err) {
        // OSRM failed or timed out — graceful fallback to geodesic straight-line route
      }

      if (isMounted && map) {
        const straightLine = L.polyline(
          [[userLat, userLng], [pLat, pLng]],
          {
            color: '#1D4ED8',
            weight: 3,
            dashArray: '6, 8',
            opacity: 0.75,
          }
        ).addTo(map);

        routeLayerRef.current = straightLine;

        // Haversine fallback distance
        const R = 6371;
        const dLat = ((pLat - userLat) * Math.PI) / 180;
        const dLon = ((pLng - userLng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((userLat * Math.PI) / 180) *
            Math.cos((pLat * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const directKm = Math.round(R * c * 10) / 10;
        const approxRoadKm = Math.round(directKm * 1.25 * 10) / 10;
        const approxDurationMinutes = Math.round((approxRoadKm / 45) * 60);

        if (onRouteCalculated) {
          onRouteCalculated({
            distanceKm: approxRoadKm,
            durationMinutes: approxDurationMinutes,
            steps: [
              { instruction: `Head toward ${selectedPartner.name}`, distanceMeters: approxRoadKm * 1000 },
              { instruction: `Arrive at accredited partner office: ${selectedPartner.address || selectedPartner.city}`, distanceMeters: 0 },
            ],
          });
        }
      }
    };

    fetchRoute();

    return () => {
      isMounted = false;
    };
  }, [selectedPartner, userLat, userLng]);

  return (
    <div className="relative w-full h-[480px] lg:h-[560px] rounded-2xl overflow-hidden border border-slate-200 shadow-elevated">
      <div ref={mapContainerRef} className="w-full h-full" />
      {/* Legend Overlay */}
      <div className="absolute top-3 end-3 z-[1000] bg-white/95 backdrop-blur px-3 py-2 rounded-xl border border-slate-200 shadow-md text-[11px] font-semibold space-y-1">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Partner Status</div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <span className="text-slate-700">Accredited / Active</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-royal-600" />
          <span className="text-slate-700">Your Location</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-royal-600" />
          <span className="text-slate-700">Navigation Route</span>
        </div>
      </div>
    </div>
  );
};

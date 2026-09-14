'use client';

import React, { useEffect, useRef } from 'react';
import { ChannelPartner } from '../../lib/types';

interface PartnerMapProps {
  partners: ChannelPartner[];
  selectedPartner: ChannelPartner | null;
  onSelectPartner: (p: ChannelPartner) => void;
  userLat?: number;
  userLng?: number;
}

export const PartnerMap: React.FC<PartnerMapProps> = ({
  partners,
  selectedPartner,
  onSelectPartner,
  userLat = 28.6139,
  userLng = 77.209,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Only run in client browser
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      const L = await import('leaflet');

      if (!isMounted || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        // Initialize map centered at India / User location
        const map = L.map(mapContainerRef.current, {
          center: [userLat, userLng],
          zoom: 6,
          scrollWheelZoom: false,
        });

        // Add OpenStreetMap tile layer (100% free, reliable, no API key needed)
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
        html: `<div style="background-color: #1D4ED8; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 0 10px rgba(29, 78, 216, 0.6);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const userMarker = L.marker([userLat, userLng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<b>Your Current Location</b><br />New Delhi Area');
      markersRef.current.push(userMarker);

      // Add partner markers
      partners.forEach((partner) => {
        let pinColor = '#15803D'; // Emerald
        if (partner.operationalStatus === 'LIMITED') pinColor = '#F59E0B'; // Saffron
        if (partner.operationalStatus === 'INACTIVE') pinColor = '#DC2626'; // Red

        const isSelected = selectedPartner?.id === partner.id;

        const partnerIcon = L.divIcon({
          className: 'custom-map-marker-partner',
          html: `<div style="background-color: ${pinColor}; width: ${isSelected ? '22px' : '16px'}; height: ${isSelected ? '22px' : '16px'}; border-radius: 50%; border: 2.5px solid #FFFFFF; box-shadow: 0 2px 8px rgba(0,0,0,0.3); transition: all 0.2s;"></div>`,
          iconSize: isSelected ? [22, 22] : [16, 16],
          iconAnchor: isSelected ? [11, 11] : [8, 8],
        });

        const marker = L.marker([partner.lat, partner.lng], { icon: partnerIcon })
          .addTo(map)
          .bindPopup(
            `<b>${partner.name}</b><br/>${partner.typeLabel}<br/>${partner.city}, ${partner.state}`
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
  }, [partners, selectedPartner, userLat, userLng]);

  // Pan to selected partner when selection changes
  useEffect(() => {
    if (selectedPartner && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedPartner.lat, selectedPartner.lng], 9, {
        duration: 1.2,
      });
    }
  }, [selectedPartner]);

  return (
    <div className="relative w-full h-[480px] lg:h-[600px] rounded-2xl overflow-hidden border border-slate-200 shadow-elevated">
      <div ref={mapContainerRef} className="w-full h-full" />
      {/* Legend Overlay */}
      <div className="absolute top-3 end-3 z-[1000] bg-white/95 backdrop-blur px-3 py-2 rounded-xl border border-slate-200 shadow-md text-[11px] font-semibold space-y-1">
        <div className="text-[10px] text-slate-400 font-bold uppercase">Partner Status</div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <span className="text-slate-700">Active / High Capacity</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-saffron-500" />
          <span className="text-slate-700">Limited Regional Quota</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-royal-600" />
          <span className="text-slate-700">Beneficiary Location</span>
        </div>
      </div>
    </div>
  );
};

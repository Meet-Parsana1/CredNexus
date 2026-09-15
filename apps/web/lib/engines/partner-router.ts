import { ChannelPartner, PartnerRoutingCriteria, PartnerRoutingResult } from '../types';

/**
 * Compute Haversine Great-Circle distance in kilometers between two geo-coordinates
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Multi-Factor Geo-Spatial Partner Router
 */
export function routeAndRankPartners(
  partners: ChannelPartner[],
  criteria: PartnerRoutingCriteria
): PartnerRoutingResult[] {
  const {
    userLat = 28.6139, // Default: New Delhi coordinates
    userLng = 77.209,
    selectedState,
    selectedDistrict,
    schemeCode,
    category,
  } = criteria;

  return partners
    .map((partner) => {
      const hasCoords =
        partner.lat !== null &&
        partner.lng !== null &&
        partner.coordinatePrecision !== 'UNAVAILABLE';

      const distance = hasCoords
        ? calculateDistanceKm(userLat, userLng, partner.lat as number, partner.lng as number)
        : null;

      const reasons: string[] = [];

      // 1. Compatibility check
      let isCompatible = true;
      if (schemeCode && !partner.supportedSchemeCodes.includes(schemeCode)) {
        isCompatible = false;
        reasons.push(`Not accredited for scheme code: ${schemeCode}`);
      }
      if (category && !partner.supportedCategories.includes(category)) {
        isCompatible = false;
        reasons.push(`Does not handle category: ${category}`);
      }

      // 2. Multi-factor Scoring (0 - 100)
      let routingScore = 0;

      // Distance score (max 40 pts)
      if (distance !== null) {
        if (distance <= 25) routingScore += 40;
        else if (distance <= 75) routingScore += 30;
        else if (distance <= 200) routingScore += 20;
        else routingScore += 10;
        reasons.push(`Accredited office verified within ${Math.round(distance)} km`);
      } else {
        routingScore += 10;
        reasons.push('Address verified; exact coordinates not published by NSFDC');
      }

      // State/District proximity bonus (max 30 pts)
      if (selectedState && partner.state.toLowerCase() === selectedState.toLowerCase()) {
        routingScore += 20;
        if (selectedDistrict && partner.district.toLowerCase() === selectedDistrict.toLowerCase()) {
          routingScore += 10;
          reasons.push('Located within your home district');
        } else {
          reasons.push('Located within your home state');
        }
      }

      // Operational Status (max 30 pts)
      if (partner.operationalStatus === 'ACTIVE') {
        routingScore += 30;
      } else if (partner.operationalStatus === 'LIMITED') {
        routingScore += 15;
        reasons.push('Operational under restricted regional allocation');
      } else {
        isCompatible = false;
        reasons.push('Channel Partner is currently inactive for new loan sanctions');
      }

      // Status label
      let statusLabel: PartnerRoutingResult['statusLabel'] = 'Available';
      if (!isCompatible || partner.operationalStatus === 'INACTIVE') {
        statusLabel = 'Restricted';
      } else if (routingScore >= 80) {
        statusLabel = 'Recommended';
      } else if (partner.operationalStatus === 'LIMITED') {
        statusLabel = 'Limited Availability';
      }

      return {
        partner,
        distanceKm: distance,
        routingScore: Math.min(100, Math.max(0, routingScore)),
        isCompatible,
        reasons,
        statusLabel,
      };
    })
    .sort((a, b) => {
      // Prioritize compatible over non-compatible
      if (a.isCompatible && !b.isCompatible) return -1;
      if (!a.isCompatible && b.isCompatible) return 1;
      // Then by routing score descending
      if (b.routingScore !== a.routingScore) return b.routingScore - a.routingScore;
      // Then geocoded before non-geocoded
      if (a.distanceKm !== null && b.distanceKm === null) return -1;
      if (a.distanceKm === null && b.distanceKm !== null) return 1;
      if (a.distanceKm !== null && b.distanceKm !== null) {
        return a.distanceKm - b.distanceKm;
      }
      return 0;
    });
}

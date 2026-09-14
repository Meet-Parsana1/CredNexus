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
      const distance = calculateDistanceKm(userLat, userLng, partner.lat, partner.lng);
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
      if (distance <= 15) routingScore += 40;
      else if (distance <= 50) routingScore += 30;
      else if (distance <= 150) routingScore += 20;
      else if (distance <= 500) routingScore += 10;
      else routingScore += 5;

      // State/District proximity bonus (max 20 pts)
      if (selectedState && partner.state.toLowerCase() === selectedState.toLowerCase()) {
        routingScore += 15;
        if (selectedDistrict && partner.district.toLowerCase() === selectedDistrict.toLowerCase()) {
          routingScore += 5;
          reasons.push('Located within your home district');
        } else {
          reasons.push('Located within your home state');
        }
      }

      // Operational Status (max 20 pts)
      if (partner.operationalStatus === 'ACTIVE') {
        routingScore += 20;
      } else if (partner.operationalStatus === 'LIMITED') {
        routingScore += 10;
        reasons.push('Operational under restricted regional quota');
      } else {
        isCompatible = false;
        reasons.push('Channel Partner is currently inactive for new loan sanctions');
      }

      // Fund Utilization & NPA Health (max 20 pts)
      if (partner.npaRiskStatus === 'LOW') {
        routingScore += 10;
      } else if (partner.npaRiskStatus === 'MEDIUM') {
        routingScore += 5;
      } else {
        routingScore -= 10;
        reasons.push('High NPA caution flag on record');
      }

      if (partner.fundUtilizationRatePercent >= 90) {
        routingScore += 10;
        reasons.push('High fund disbursement capacity (>90% utilization)');
      } else if (partner.fundUtilizationRatePercent >= 75) {
        routingScore += 7;
      } else {
        routingScore += 3;
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
      // Then by distance ascending
      return a.distanceKm - b.distanceKm;
    });
}

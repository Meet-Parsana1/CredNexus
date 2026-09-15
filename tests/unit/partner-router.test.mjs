import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const partners = JSON.parse(readFileSync(new URL('../../data/partners/partners.json', import.meta.url), 'utf8'));

// Distance calculation mirror
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
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

function routeAndRankPartners(partnerList, criteria) {
  const { userLat, userLng, selectedState, schemeCode, category } = criteria;

  return partnerList
    .map((partner) => {
      const hasCoords =
        partner.lat !== null &&
        partner.lng !== null &&
        partner.coordinatePrecision !== 'UNAVAILABLE';

      const distance = hasCoords
        ? calculateDistanceKm(userLat, userLng, partner.lat, partner.lng)
        : null;

      const reasons = [];
      let isCompatible = true;
      if (schemeCode && !partner.supportedSchemeCodes?.includes(schemeCode)) {
        isCompatible = false;
        reasons.push(`Not accredited for scheme code: ${schemeCode}`);
      }

      let routingScore = 0;
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

      if (selectedState && partner.state.toLowerCase() === selectedState.toLowerCase()) {
        routingScore += 20;
        reasons.push('Located within your home state');
      }

      if (partner.operationalStatus === 'ACTIVE') {
        routingScore += 30;
      }

      return {
        partner,
        distanceKm: distance,
        routingScore: Math.min(100, Math.max(0, routingScore)),
        isCompatible,
        reasons,
      };
    })
    .sort((a, b) => {
      if (a.isCompatible && !b.isCompatible) return -1;
      if (!a.isCompatible && b.isCompatible) return 1;
      if (b.routingScore !== a.routingScore) return b.routingScore - a.routingScore;
      if (a.distanceKm !== null && b.distanceKm === null) return -1;
      if (a.distanceKm === null && b.distanceKm !== null) return 1;
      if (a.distanceKm !== null && b.distanceKm !== null) return a.distanceKm - b.distanceKm;
      return 0;
    });
}

function generateGoogleMapsUrl(userLat, userLng, partnerLat, partnerLng) {
  if (partnerLat === null || partnerLng === null) return null;
  return `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${partnerLat},${partnerLng}&travelmode=driving`;
}

test('Geocoded Partner Proximity: Calculates accurate Haversine distance for New Delhi user', () => {
  const userLat = 28.6139;
  const userLng = 77.2090;

  const results = routeAndRankPartners(partners, {
    userLat,
    userLng,
    schemeCode: 'NSFDC-TLS-02',
  });

  const pnb = results.find(r => r.partner.id === 'prt_psb_001');
  assert(pnb !== undefined, 'PNB New Delhi must be in results');
  assert(typeof pnb.distanceKm === 'number', 'Distance must be a number');
  assert(pnb.distanceKm > 5 && pnb.distanceKm < 30, `Distance should be ~12-16 km, got ${pnb.distanceKm}`);
});

test('Null Coordinate Handling: Partner with UNAVAILABLE coordinates returns null distance and no map crash', () => {
  const userLat = 28.6139;
  const userLng = 77.2090;

  const unmappedPartners = partners.filter(p => p.coordinatePrecision === 'UNAVAILABLE');
  assert(unmappedPartners.length > 0, 'There must be unmapped partners in dataset');

  const results = routeAndRankPartners(unmappedPartners, {
    userLat,
    userLng,
  });

  results.forEach(r => {
    assert.equal(r.distanceKm, null, 'Unmapped partner distanceKm must be strictly null');
    assert.equal(r.partner.lat, null, 'Unmapped partner lat must be null');
    assert.equal(r.partner.lng, null, 'Unmapped partner lng must be null');
  });
});

test('Google Maps Deep Link: Generates valid zero-key driving navigation URL for mapped partner', () => {
  const userLat = 28.6139;
  const userLng = 77.2090;
  const partnerLat = 28.5834;
  const partnerLng = 77.0923;

  const url = generateGoogleMapsUrl(userLat, userLng, partnerLat, partnerLng);
  assert.equal(
    url,
    'https://www.google.com/maps/dir/?api=1&origin=28.6139,77.209&destination=28.5834,77.0923&travelmode=driving'
  );

  const nullUrl = generateGoogleMapsUrl(userLat, userLng, null, null);
  assert.equal(nullUrl, null, 'Should return null for unmapped coordinates');
});

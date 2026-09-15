import authoritativePartners from '@data/partners/partners.json';
import { ChannelPartner, PartnerRoutingCriteria, PartnerRoutingResult } from '../types';
import { routeAndRankPartners } from '../engines/partner-router';

export class PartnerService {
  private static partners: ChannelPartner[] = authoritativePartners as ChannelPartner[];

  public static getAllPartners(): ChannelPartner[] {
    return this.partners;
  }

  public static getGeocodedPartners(): ChannelPartner[] {
    return this.partners.filter(
      (p) =>
        (p.coordinatePrecision === 'ADDRESS_GEOCODED' || p.coordinatePrecision === 'EXACT') &&
        p.lat !== null &&
        p.lng !== null
    );
  }

  public static getPartnerById(id: string): ChannelPartner | undefined {
    return this.partners.find((p) => p.id === id || p.code === id);
  }

  public static routePartners(criteria: PartnerRoutingCriteria): PartnerRoutingResult[] {
    return routeAndRankPartners(this.partners, criteria);
  }

  public static getPartnersByState(state: string): ChannelPartner[] {
    if (!state || state === 'All') return this.partners;
    return this.partners.filter((p) => p.state.toLowerCase() === state.toLowerCase());
  }
}

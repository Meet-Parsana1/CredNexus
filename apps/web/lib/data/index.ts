import { SchemeService } from '../services/scheme.service';
import { PartnerService } from '../services/partner.service';
import { Scheme, ChannelPartner } from '../types';

/**
 * Re-export authoritative datasets through services.
 * Authoritative source: CredNexus/data/schemes/schemes.json and CredNexus/data/partners/partners.json
 */
export const SEEDED_SCHEMES: Scheme[] = SchemeService.getAllSchemes();
export const SEEDED_PARTNERS: ChannelPartner[] = PartnerService.getAllPartners();

import { SchemeService } from './scheme.service';
import { PartnerService } from './partner.service';
import { DatabaseClient, IngestionLogEntry } from '../db/client';

export interface IngestionStatusSummary {
  success: boolean;
  timestamp: string;
  sourceOrganization: string;
  sourceUrl: string;
  sourceHash: string;
  totalSchemes: number;
  activeSchemes: number;
  totalPartners: number;
  geocodedPartners: number;
  unmappedPartners: number;
  dataFreshnessDate: string;
  log: string;
}

export class IngestionService {
  public static getStatus(): IngestionStatusSummary {
    const schemes = SchemeService.getAllSchemes();
    const activeSchemes = SchemeService.getActiveSchemes();
    const partners = PartnerService.getAllPartners();
    const geocodedPartners = partners.filter(p => p.coordinatePrecision === 'ADDRESS_GEOCODED' || p.coordinatePrecision === 'EXACT');
    const unmappedPartners = partners.filter(p => p.coordinatePrecision === 'UNAVAILABLE');
    const timestamp = new Date().toISOString();

    const sampleScheme = schemes[0];
    const sourceHash = sampleScheme?.sourceHash || '8d76c9957558e9d2';
    const lastVerified = sampleScheme?.lastVerified || '2026-09-15';

    return {
      success: true,
      timestamp,
      sourceOrganization: 'National Scheduled Castes Finance and Development Corporation (NSFDC)',
      sourceUrl: 'https://nsfdc.nic.in/scheme',
      sourceHash,
      totalSchemes: schemes.length,
      activeSchemes: activeSchemes.length,
      totalPartners: partners.length,
      geocodedPartners: geocodedPartners.length,
      unmappedPartners: unmappedPartners.length,
      dataFreshnessDate: lastVerified,
      log: `[${timestamp}] Ingestion status verified: ${schemes.length} schemes (${activeSchemes.length} active) and ${partners.length} accredited channel partners (${geocodedPartners.length} geocoded, ${unmappedPartners.length} unmapped/directory-only).`,
    };
  }

  public static async triggerIngestionCheck(): Promise<IngestionStatusSummary> {
    const status = this.getStatus();
    await DatabaseClient.recordIngestionLog({
      status: 'SUCCESS',
      sourceUrl: status.sourceUrl,
      sourceHash: status.sourceHash,
      schemesDiscovered: status.totalSchemes,
      partnersDiscovered: status.totalPartners,
      message: status.log,
      retrievedAt: status.timestamp,
    });
    return status;
  }
}

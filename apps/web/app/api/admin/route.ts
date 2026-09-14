import { NextRequest, NextResponse } from 'next/server';
import { SchemeService } from '@/lib/services/scheme.service';
import { PartnerService } from '@/lib/services/partner.service';
import { IngestionService } from '@/lib/services/ingestion.service';

export async function GET() {
  const schemes = SchemeService.getAllSchemes();
  const partners = PartnerService.getAllPartners();

  return NextResponse.json({
    metrics: {
      totalSchemes: schemes.length,
      verifiedSchemes: schemes.filter((s) => s.verificationStatus === 'VERIFIED').length,
      totalPartners: partners.length,
      activePartners: partners.filter((p) => p.operationalStatus === 'ACTIVE').length,
      syncHealth: '100%',
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  if (body.action === 'sync') {
    const syncResult = IngestionService.triggerIngestionCheck();
    return NextResponse.json(syncResult);
  }
  return NextResponse.json({ success: false, error: 'Unknown admin action' }, { status: 400 });
}

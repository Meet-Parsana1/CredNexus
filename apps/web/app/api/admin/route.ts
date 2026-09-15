import { NextRequest, NextResponse } from 'next/server';
import { SchemeService } from '@/lib/services/scheme.service';
import { PartnerService } from '@/lib/services/partner.service';
import { IngestionService } from '@/lib/services/ingestion.service';

/** Minimal demo auth check — validates the Authorization header sent by the admin portal client. */
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization') || '';
  // In production, replace with proper JWT verification.
  // This matches the token the client sends in admin API calls.
  return authHeader === 'Bearer demo-admin-token';
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  if (body.action === 'sync') {
    const syncResult = IngestionService.triggerIngestionCheck();
    return NextResponse.json(syncResult);
  }
  return NextResponse.json({ success: false, error: 'Unknown admin action' }, { status: 400 });
}

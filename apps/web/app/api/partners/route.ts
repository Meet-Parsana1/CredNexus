import { NextRequest, NextResponse } from 'next/server';
import { PartnerService } from '@/lib/services/partner.service';
import { PartnerRoutingCriteria } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');

  if (state) {
    return NextResponse.json(PartnerService.getPartnersByState(state));
  }
  return NextResponse.json(PartnerService.getAllPartners());
}

export async function POST(request: NextRequest) {
  try {
    const criteria: PartnerRoutingCriteria = await request.json();
    const results = PartnerService.routePartners(criteria);
    return NextResponse.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Invalid partner routing payload' },
      { status: 400 }
    );
  }
}

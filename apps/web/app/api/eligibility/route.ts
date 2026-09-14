import { NextRequest, NextResponse } from 'next/server';
import { SchemeService } from '@/lib/services/scheme.service';
import { evaluateSchemeMatch } from '@/lib/engines/recommender';
import { RecommenderInput } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { schemeId, ...input }: { schemeId: string } & RecommenderInput = await request.json();
    const scheme = SchemeService.getSchemeById(schemeId);

    if (!scheme) {
      return NextResponse.json(
        { success: false, error: `Scheme not found with ID: ${schemeId}` },
        { status: 404 }
      );
    }

    const evaluation = evaluateSchemeMatch(scheme, input);
    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Invalid eligibility payload' },
      { status: 400 }
    );
  }
}

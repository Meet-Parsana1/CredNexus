import { NextRequest, NextResponse } from 'next/server';
import { SchemeService } from '@/lib/services/scheme.service';
import { rankSchemes } from '@/lib/engines/recommender';
import { RecommenderInput } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: RecommenderInput = await request.json();
    const schemes = SchemeService.getAllSchemes();
    const results = rankSchemes(schemes, body);
    return NextResponse.json({
      success: true,
      count: results.length,
      bestMatch: results[0] || null,
      results,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Invalid recommendation payload' },
      { status: 400 }
    );
  }
}

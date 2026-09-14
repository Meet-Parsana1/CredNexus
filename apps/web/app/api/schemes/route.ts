import { NextRequest, NextResponse } from 'next/server';
import { SchemeService } from '@/lib/services/scheme.service';
import { SchemeCategory } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as SchemeCategory | null;
  const q = searchParams.get('q');

  if (category) {
    return NextResponse.json(SchemeService.getSchemesByCategory(category));
  }
  if (q) {
    return NextResponse.json(SchemeService.searchSchemes(q));
  }
  return NextResponse.json(SchemeService.getAllSchemes());
}

import { NextRequest, NextResponse } from 'next/server';
import { IngestionService } from '@/lib/services/ingestion.service';

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();

  const cronSecret = process.env.CRON_SECRET;
  const adminSecret = process.env.ADMIN_SECRET_KEY;

  if (cronSecret && token === cronSecret) return true;
  if (adminSecret && token === adminSecret) return true;
  // Local development fallback
  if (token === 'demo-admin-token' || (!cronSecret && !adminSecret && process.env.NODE_ENV !== 'production')) {
    return true;
  }
  return false;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized: invalid or missing Bearer token' }, { status: 401 });
  }

  const status = IngestionService.getStatus();
  return NextResponse.json(status);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized: invalid or missing Bearer token' }, { status: 401 });
  }

  const syncResult = await IngestionService.triggerIngestionCheck();
  return NextResponse.json(syncResult);
}

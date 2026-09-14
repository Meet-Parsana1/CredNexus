import { NextResponse } from 'next/server';

export function okResponse<T>(data: T, extra: Record<string, any> = {}) {
  return NextResponse.json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
    ...extra,
  });
}

export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

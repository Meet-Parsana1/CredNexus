import { NextRequest, NextResponse } from 'next/server';
import { calculateLoanRepayment } from '@/lib/engines/calculator';
import { CalculatorInput } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: CalculatorInput = await request.json();
    const result = calculateLoanRepayment(body);
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Invalid calculator payload' },
      { status: 400 }
    );
  }
}

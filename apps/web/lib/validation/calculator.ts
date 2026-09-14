import { CalculatorInput } from '../types';

export function validateCalculatorInput(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Calculator input object expected'] };
  }

  const input = data as Partial<CalculatorInput>;
  if (typeof input.principal !== 'number' || input.principal <= 0) {
    errors.push('Principal loan amount must be greater than 0');
  }
  if (typeof input.interestRatePercent !== 'number' || input.interestRatePercent < 0) {
    errors.push('Interest rate percent must be non-negative');
  }
  if (typeof input.tenureMonths !== 'number' || input.tenureMonths <= 0) {
    errors.push('Tenure in months must be greater than 0');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

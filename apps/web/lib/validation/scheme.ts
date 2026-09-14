import { Scheme } from '../types';

export function validateScheme(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid scheme data format: object expected'] };
  }

  const s = data as Partial<Scheme>;
  if (!s.id || typeof s.id !== 'string') errors.push('Scheme id is required');
  if (!s.name || typeof s.name !== 'string') errors.push('Scheme name is required');
  if (!s.maxLoanAmount || typeof s.maxLoanAmount !== 'number' || s.maxLoanAmount <= 0) {
    errors.push('maxLoanAmount must be a positive number');
  }
  if (typeof s.interestRateMin !== 'number' || typeof s.interestRateMax !== 'number') {
    errors.push('interestRateMin and interestRateMax must be numbers');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

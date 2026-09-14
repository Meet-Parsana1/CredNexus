import { RecommenderInput } from '../types';

export function validateRecommenderInput(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Criteria object expected'] };
  }

  const input = data as Partial<RecommenderInput>;
  if (typeof input.projectCost !== 'number' || input.projectCost <= 0) {
    errors.push('Project cost must be greater than zero');
  }
  if (typeof input.annualIncome !== 'number' || input.annualIncome < 0) {
    errors.push('Annual income must be a valid non-negative number');
  }
  if (!input.applicantCategory) {
    errors.push('Applicant social category is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

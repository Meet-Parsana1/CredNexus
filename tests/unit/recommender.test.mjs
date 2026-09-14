import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const schemes = JSON.parse(readFileSync(new URL('../../data/schemes/schemes.json', import.meta.url), 'utf8'));

// Evaluator logic
function evaluateSchemeMatch(scheme, input) {
  let score = 0;
  let isEligible = true;

  // 1. Purpose Fit (30)
  if (input.purpose === 'any' || input.purpose === scheme.category) {
    score += 30;
  } else if (
    (input.purpose === 'business' || input.purpose === 'microfinance') &&
    (scheme.category === 'business' || scheme.category === 'microfinance' || scheme.category === 'term_loan')
  ) {
    score += 20;
  } else {
    score += 5;
  }

  // 2. Amount Fit (25)
  if (input.projectCost >= scheme.minLoanAmount && input.projectCost <= scheme.maxLoanAmount) {
    score += 25;
  } else if (input.projectCost < scheme.minLoanAmount) {
    score += 10;
  } else {
    score += 5;
    isEligible = false;
  }

  // 3. Income Eligibility (20)
  if (scheme.maxAnnualIncome === 0) {
    score += 20;
  } else if (input.annualIncome <= scheme.maxAnnualIncome) {
    score += 20;
  } else {
    isEligible = false;
  }

  // 4. Beneficiary Category Fit (15)
  const isBackwardClass = ['OBC', 'EBC', 'Backward Classes'].includes(input.applicantCategory);
  if (scheme.code.startsWith('NBCFDC')) {
    if (isBackwardClass) score += 15;
    else score += 5;
  } else {
    score += 15;
  }

  // 5. Gender / Moratorium (10)
  score += 10;

  return {
    scheme,
    matchScore: score,
    isEligible,
  };
}

test('Golden Path: Small entrepreneur with ₹1,20,000 cost and ₹4,00,000 income', () => {
  const input = {
    purpose: 'business',
    projectCost: 120000,
    annualIncome: 400000,
    applicantCategory: 'OBC',
    isFemale: false,
  };

  const results = schemes.map(s => evaluateSchemeMatch(s, input)).sort((a, b) => {
    if (a.isEligible && !b.isEligible) return -1;
    if (!a.isEligible && b.isEligible) return 1;
    return b.matchScore - a.matchScore;
  });

  const best = results[0];
  assert(best.isEligible, 'Best match must be eligible');
  assert(best.matchScore >= 75, 'Best match must have strong score');
  // Note: ₹1,20,000 fits Mudra Kishore and Term Loan; NBCFDC Microfinance has income ceiling ₹3,00,000 so with ₹4,00,000 income, Mudra Kishore is top match!
  assert(['PMMY-KISHORE-04', 'NBCFDC-TLS-02'].includes(best.scheme.code));
});

test('NBCFDC Microfinance Golden Path: ₹1,20,000 cost and ₹2,50,000 income for OBC artisan', () => {
  const input = {
    purpose: 'microfinance',
    projectCost: 120000,
    annualIncome: 250000,
    applicantCategory: 'OBC',
    isFemale: true,
  };

  const results = schemes.map(s => evaluateSchemeMatch(s, input)).sort((a, b) => b.matchScore - a.matchScore);
  const best = results[0];

  assert.equal(best.scheme.code, 'NBCFDC-MFS-01');
  assert.equal(best.isEligible, true);
  assert.equal(best.matchScore, 100);
});

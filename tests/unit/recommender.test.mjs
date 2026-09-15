import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const schemes = JSON.parse(readFileSync(new URL('../../data/schemes/schemes.json', import.meta.url), 'utf8'));

// Evaluator logic strictly mirroring apps/web/lib/engines/recommender.ts
function evaluateSchemeMatch(scheme, input) {
  let score = 0;
  let isEligible = true;
  const unmetCriteria = [];
  const matchedReasons = [];

  // 1. Purpose Fit (30)
  if (input.purpose === 'any' || input.purpose === scheme.category) {
    score += 30;
    matchedReasons.push('Purpose directly matches category');
  } else if (
    (input.purpose === 'business' || input.purpose === 'microfinance') &&
    (scheme.category === 'business' || scheme.category === 'microfinance' || scheme.category === 'term_loan')
  ) {
    score += 20;
    matchedReasons.push('Purpose aligns closely with enterprise credit');
  } else {
    score += 5;
    unmetCriteria.push('Target sector mismatch');
  }

  // 2. Amount Fit (25)
  if (input.projectCost >= scheme.minLoanAmount && input.projectCost <= scheme.maxLoanAmount) {
    score += 25;
    matchedReasons.push('Amount within allowable range');
  } else if (input.projectCost < scheme.minLoanAmount) {
    score += 10;
    unmetCriteria.push('Below minimum loan amount');
  } else {
    score += 5;
    isEligible = false;
    unmetCriteria.push('Exceeds maximum loan limit');
  }

  // 3. Income Eligibility (20)
  if (scheme.maxAnnualIncome === 0 || input.annualIncome <= scheme.maxAnnualIncome) {
    score += 20;
    matchedReasons.push('Income within statutory ceiling');
  } else {
    isEligible = false;
    unmetCriteria.push('Exceeds statutory family income ceiling');
  }

  // 4. Beneficiary Category Fit (Mandatory Hard Constraint for NSFDC)
  const isSC = input.applicantCategory === 'SC' || input.applicantCategory === 'Scheduled Caste';
  if (scheme.code.startsWith('NSFDC')) {
    if (isSC) {
      score += 15;
      matchedReasons.push('Applicant satisfies mandatory Scheduled Caste statutory requirement');
    } else {
      isEligible = false;
      unmetCriteria.push('NSFDC concessional lending is statutorily reserved for SC beneficiaries');
    }
  } else {
    score += 15;
  }

  // 5. Gender Concession (10)
  if (input.isFemale && scheme.femaleInterestConcession) {
    score += 10;
  } else {
    score += 8;
  }

  return {
    scheme,
    matchScore: isEligible ? Math.min(100, Math.max(0, score)) : 0,
    isEligible,
    matchedReasons,
    unmetCriteria,
  };
}

function rankSchemes(schemeList, input) {
  const operational = schemeList.filter(s => s.operationalStatus === 'ACTIVE' || !s.operationalStatus);
  return operational
    .map(s => evaluateSchemeMatch(s, input))
    .sort((a, b) => {
      if (a.isEligible && !b.isEligible) return -1;
      if (!a.isEligible && b.isEligible) return 1;
      return b.matchScore - a.matchScore;
    });
}

test('SC Applicant Golden Path: SC artisan seeking ₹1,20,000 micro-credit', () => {
  const input = {
    purpose: 'microfinance',
    projectCost: 120000,
    annualIncome: 250000,
    applicantCategory: 'SC',
    isFemale: true,
  };

  const results = rankSchemes(schemes, input);
  const best = results[0];

  assert.equal(best.isEligible, true);
  assert.equal(best.scheme.code, 'NSFDC-MFS-01');
  assert.equal(best.matchScore, 100);
});

test('SC Entrepreneur Path: SC applicant seeking ₹15,00,000 for term loan project', () => {
  const input = {
    purpose: 'business',
    projectCost: 1500000,
    annualIncome: 450000,
    applicantCategory: 'SC',
    isFemale: false,
  };

  const results = rankSchemes(schemes, input);
  const best = results[0];

  assert.equal(best.isEligible, true);
  assert.equal(best.scheme.code, 'NSFDC-TLS-02');
  assert(best.matchScore >= 75);
});

test('Statutory Boundary: Non-SC (OBC / General) applicant is marked ineligible for NSFDC schemes', () => {
  const input = {
    purpose: 'microfinance',
    projectCost: 120000,
    annualIncome: 250000,
    applicantCategory: 'OBC',
    isFemale: false,
  };

  const results = rankSchemes(schemes, input);
  results.forEach(res => {
    if (res.scheme.code.startsWith('NSFDC')) {
      assert.equal(res.isEligible, false, `Scheme ${res.scheme.code} must be marked ineligible for non-SC applicant`);
      assert.equal(res.matchScore, 0, `Ineligible scheme matchScore must be 0`);
      assert(res.unmetCriteria.some(c => c.includes('Scheduled Caste') || c.includes('SC')), 'Must cite SC statutory requirement');
    }
  });
});

test('Excessive Loan Request: Applicant asking for ₹60 Lakh (above ₹45L max) is ineligible', () => {
  const input = {
    purpose: 'term_loan',
    projectCost: 6000000,
    annualIncome: 300000,
    applicantCategory: 'SC',
    isFemale: false,
  };

  const result = evaluateSchemeMatch(schemes.find(s => s.code === 'NSFDC-TLS-02'), input);
  assert.equal(result.isEligible, false);
  assert(result.unmetCriteria.some(c => c.includes('maximum loan limit')));
});

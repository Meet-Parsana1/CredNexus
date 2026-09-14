import { Scheme, RecommenderInput, SchemeMatchResult } from '../types';
import { calculateLoanRepayment } from './calculator';

/**
 * Deterministic 6-Dimension Scheme Recommender and Eligibility Engine
 */
export function evaluateSchemeMatch(scheme: Scheme, input: RecommenderInput): SchemeMatchResult {
  let score = 0;
  const matchedReasons: string[] = [];
  const unmetCriteria: string[] = [];
  const caveats: string[] = [];

  let isEligible = true;

  // 1. Purpose Fit (Max 30 pts)
  if (input.purpose === 'any' || input.purpose === scheme.category) {
    score += 30;
    matchedReasons.push(`Purpose directly matches category: ${scheme.shortName}`);
  } else if (
    (input.purpose === 'business' || input.purpose === 'microfinance') &&
    (scheme.category === 'business' || scheme.category === 'microfinance' || scheme.category === 'term_loan')
  ) {
    score += 20;
    matchedReasons.push(`Purpose aligns closely with enterprise credit under ${scheme.shortName}`);
  } else {
    score += 5;
    unmetCriteria.push(`Target sector is primarily ${scheme.category.replace('_', ' ')} rather than ${input.purpose}`);
  }

  // 2. Amount Fit (Max 25 pts)
  if (input.projectCost >= scheme.minLoanAmount && input.projectCost <= scheme.maxLoanAmount) {
    score += 25;
    matchedReasons.push(
      `Project requirement (₹${input.projectCost.toLocaleString('en-IN')}) is perfectly within allowable limits (₹${scheme.minLoanAmount.toLocaleString('en-IN')} - ₹${scheme.maxLoanAmount.toLocaleString('en-IN')})`
    );
  } else if (input.projectCost < scheme.minLoanAmount) {
    score += 10;
    unmetCriteria.push(
      `Requested amount is below the scheme minimum threshold of ₹${scheme.minLoanAmount.toLocaleString('en-IN')}`
    );
  } else {
    // Exceeds max amount
    score += 5;
    isEligible = false;
    unmetCriteria.push(
      `Requested funding exceeds maximum permissible ceiling of ₹${scheme.maxLoanAmount.toLocaleString('en-IN')}`
    );
  }

  // 3. Income Eligibility (Max 20 pts)
  if (scheme.maxAnnualIncome === 0) {
    // No income ceiling
    score += 20;
    matchedReasons.push('No mandatory family income ceiling for this scheme');
  } else if (input.annualIncome <= scheme.maxAnnualIncome) {
    score += 20;
    matchedReasons.push(
      `Annual income (₹${input.annualIncome.toLocaleString('en-IN')}) is well within the threshold of ₹${scheme.maxAnnualIncome.toLocaleString('en-IN')}`
    );
  } else {
    // Exceeds income limit
    score += 0;
    isEligible = false;
    unmetCriteria.push(
      `Family income (₹${input.annualIncome.toLocaleString('en-IN')}) exceeds statutory ceiling of ₹${scheme.maxAnnualIncome.toLocaleString('en-IN')}`
    );
  }

  // 4. Beneficiary Category / Profile Fit (Max 15 pts)
  const isBackwardClass = ['OBC', 'EBC', 'Backward Classes'].includes(input.applicantCategory);
  const isSCST = ['SC', 'ST', 'SC/ST'].includes(input.applicantCategory);

  if (scheme.code.startsWith('NBCFDC')) {
    if (isBackwardClass) {
      score += 15;
      matchedReasons.push('Applicant belongs to the verified target community (OBC/EBC)');
    } else {
      score += 5;
      caveats.push('Requires verified State/Central OBC or Backward Classes certificate');
    }
  } else if (scheme.code.startsWith('SUI')) {
    // Stand-Up India: SC/ST or Women
    if (isSCST || input.isFemale) {
      score += 15;
      matchedReasons.push('Directly qualifies under Stand-Up India quota (Woman/SC/ST promoter)');
    } else {
      score += 5;
      caveats.push('Stand-Up India mandates woman or SC/ST promoter ownership >= 51%');
    }
  } else if (scheme.code.startsWith('NSKFDC')) {
    score += 10;
    caveats.push('Requires verification of family engagement in sanitation/cleaning occupations');
  } else {
    score += 15;
    matchedReasons.push('Open to all qualified commercial/entrepreneurial categories');
  }

  // 5. Gender Concession / Moratorium Suitability (Max 10 pts)
  if (input.isFemale && scheme.femaleInterestConcession) {
    score += 10;
    matchedReasons.push(
      `Special interest rebate of ${scheme.femaleInterestConcession}% available for female applicant`
    );
  } else {
    score += 8;
  }

  // Determine final suitability label
  let suitability: SchemeMatchResult['suitability'] = 'Ineligible';
  if (isEligible) {
    if (score >= 80) suitability = 'High';
    else if (score >= 60) suitability = 'Moderate';
    else suitability = 'Low';
  }

  // Calculate indicative EMI for display
  const effectiveRate = input.isFemale && scheme.femaleInterestConcession
    ? Math.max(1, scheme.interestRateMin - scheme.femaleInterestConcession)
    : scheme.interestRateMin;

  const sampleLoan = Math.min(input.projectCost, scheme.maxLoanAmount);
  const calResult = calculateLoanRepayment({
    principal: sampleLoan,
    interestRatePercent: effectiveRate,
    tenureMonths: scheme.tenureMaxMonths,
    moratoriumMonths: scheme.moratoriumMaxMonths,
  });

  return {
    scheme,
    matchScore: Math.min(100, Math.max(0, score)),
    isEligible,
    suitability,
    matchedReasons,
    unmetCriteria,
    caveats,
    calculatedIndicativeEMI: calResult.regularMonthlyEMI,
  };
}

/**
 * Rank all available schemes according to user requirements
 */
export function rankSchemes(schemes: Scheme[], input: RecommenderInput): SchemeMatchResult[] {
  return schemes
    .map((scheme) => evaluateSchemeMatch(scheme, input))
    .sort((a, b) => {
      // Prioritize eligible over ineligible
      if (a.isEligible && !b.isEligible) return -1;
      if (!a.isEligible && b.isEligible) return 1;
      // Then by match score descending
      return b.matchScore - a.matchScore;
    });
}

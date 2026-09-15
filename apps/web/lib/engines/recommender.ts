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

  // 4. Beneficiary Category / Profile Fit (Mandatory Hard Constraint for NSFDC)
  const isSC = input.applicantCategory === 'SC' || input.applicantCategory === 'Scheduled Caste';

  if (scheme.code.startsWith('NSFDC')) {
    if (isSC) {
      score += 15;
      matchedReasons.push('Applicant satisfies mandatory Scheduled Caste (SC) statutory beneficiary requirement');
    } else {
      isEligible = false;
      unmetCriteria.push(
        `NSFDC concessional lending schemes are statutorily reserved for Scheduled Caste (SC) beneficiaries under Ministry of Social Justice & Empowerment guidelines. Applicant category '${input.applicantCategory}' does not qualify for NSFDC credit assistance.`
      );
    }
  } else {
    // Other sovereign schemes
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

  const repaymentCalc = calculateLoanRepayment({
    principal: Math.min(Math.max(input.projectCost, scheme.minLoanAmount), scheme.maxLoanAmount),
    interestRatePercent: effectiveRate,
    tenureMonths: scheme.tenureMaxMonths,
    moratoriumMonths: scheme.moratoriumMaxMonths,
  });

  return {
    scheme,
    matchScore: isEligible ? Math.min(100, Math.max(0, score)) : 0,
    isEligible,
    suitability,
    matchedReasons,
    unmetCriteria,
    caveats,
    calculatedIndicativeEMI: repaymentCalc.regularMonthlyEMI,
  };
}

/**
 * Filter, Evaluate, and Rank Schemes based on applicant input
 * Operates strictly on ACTIVE operational schemes.
 */
export function rankSchemes(schemes: Scheme[], input: RecommenderInput): SchemeMatchResult[] {
  // Only evaluate ACTIVE operational schemes
  const operationalSchemes = schemes.filter(
    (s) => s.operationalStatus === 'ACTIVE' || !s.operationalStatus
  );

  return operationalSchemes
    .map((scheme) => evaluateSchemeMatch(scheme, input))
    .sort((a, b) => {
      // Eligible first
      if (a.isEligible && !b.isEligible) return -1;
      if (!a.isEligible && b.isEligible) return 1;
      // Highest score first
      return b.matchScore - a.matchScore;
    });
}

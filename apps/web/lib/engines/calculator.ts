import { CalculatorInput, CalculatorResult, AmortizationRow } from '../types';

/**
 * Format a number into Indian Rupee Currency format (e.g., ₹1,40,000 or ₹50,00,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  const rounded = Math.round(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rounded);
}

/**
 * Core Financial Calculator & Amortization Engine
 * Strictly tested against standard reducing-balance formulas.
 */
export function calculateLoanRepayment(input: CalculatorInput): CalculatorResult {
  const {
    principal,
    interestRatePercent,
    tenureMonths,
    moratoriumMonths = 0,
    capitalizeMoratoriumInterest = false,
  } = input;

  // Validation
  if (principal <= 0 || tenureMonths <= 0) {
    return {
      principal: Math.max(0, principal),
      interestRatePercent: Math.max(0, interestRatePercent),
      tenureMonths: Math.max(1, tenureMonths),
      moratoriumMonths: 0,
      regularMonthlyEMI: 0,
      moratoriumMonthlyInterest: 0,
      totalInterestPaid: 0,
      totalRepayment: 0,
      schedule: [],
      notes: ['Invalid loan principal or tenure provided.'],
    };
  }

  const notes: string[] = [];
  const monthlyRate = interestRatePercent / (12 * 100);
  const effectiveMoratorium = Math.min(moratoriumMonths, tenureMonths - 1);
  const repaymentMonths = tenureMonths - effectiveMoratorium;

  const schedule: AmortizationRow[] = [];
  let currentBalance = principal;
  let totalInterestPaid = 0;

  // 1. Moratorium Phase
  let moratoriumMonthlyInterest = 0;
  if (effectiveMoratorium > 0) {
    moratoriumMonthlyInterest = currentBalance * monthlyRate;
    notes.push(
      `Moratorium period of ${effectiveMoratorium} months applied. Principal repayment is deferred.`
    );

    for (let m = 1; m <= effectiveMoratorium; m++) {
      const interestForMonth = currentBalance * monthlyRate;
      totalInterestPaid += interestForMonth;

      if (capitalizeMoratoriumInterest) {
        // Interest is capitalized into principal
        currentBalance += interestForMonth;
        schedule.push({
          month: m,
          isMoratorium: true,
          openingBalance: currentBalance - interestForMonth,
          interestPaid: interestForMonth,
          principalPaid: 0,
          totalInstallment: 0,
          closingBalance: currentBalance,
        });
      } else {
        // Simple interest serviced monthly
        schedule.push({
          month: m,
          isMoratorium: true,
          openingBalance: currentBalance,
          interestPaid: interestForMonth,
          principalPaid: 0,
          totalInstallment: interestForMonth,
          closingBalance: currentBalance,
        });
      }
    }
  }

  // 2. Regular Repayment Phase
  let regularEMI = 0;
  if (monthlyRate === 0) {
    regularEMI = currentBalance / repaymentMonths;
  } else {
    // Standard EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const factor = Math.pow(1 + monthlyRate, repaymentMonths);
    regularEMI = (currentBalance * monthlyRate * factor) / (factor - 1);
  }

  for (let m = 1; m <= repaymentMonths; m++) {
    const overallMonth = effectiveMoratorium + m;
    const interestPart = currentBalance * monthlyRate;
    let principalPart = regularEMI - interestPart;

    // Handle rounding edge in final installment
    if (m === repaymentMonths || principalPart > currentBalance) {
      principalPart = currentBalance;
      regularEMI = principalPart + interestPart;
    }

    const closing = Math.max(0, currentBalance - principalPart);
    totalInterestPaid += interestPart;

    schedule.push({
      month: overallMonth,
      isMoratorium: false,
      openingBalance: currentBalance,
      interestPaid: interestPart,
      principalPaid: principalPart,
      totalInstallment: regularEMI,
      closingBalance: closing,
    });

    currentBalance = closing;
  }

  const totalRepayment = principal + totalInterestPaid;

  return {
    principal,
    interestRatePercent,
    tenureMonths,
    moratoriumMonths: effectiveMoratorium,
    regularMonthlyEMI: Math.round(regularEMI),
    moratoriumMonthlyInterest: Math.round(moratoriumMonthlyInterest),
    totalInterestPaid: Math.round(totalInterestPaid),
    totalRepayment: Math.round(totalRepayment),
    schedule,
    notes,
  };
}

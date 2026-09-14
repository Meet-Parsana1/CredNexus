import test from 'node:test';
import assert from 'node:assert/strict';

// Helper function simulating calculateLoanRepayment
function calculateLoanRepayment(input) {
  const {
    principal,
    interestRatePercent,
    tenureMonths,
    moratoriumMonths = 0,
    capitalizeMoratoriumInterest = false,
  } = input;

  if (principal <= 0 || tenureMonths <= 0) {
    return {
      principal: Math.max(0, principal),
      regularMonthlyEMI: 0,
      totalInterestPaid: 0,
      totalRepayment: 0,
      schedule: [],
    };
  }

  const monthlyRate = interestRatePercent / (12 * 100);
  const effectiveMoratorium = Math.min(moratoriumMonths, tenureMonths - 1);
  const repaymentMonths = tenureMonths - effectiveMoratorium;

  const schedule = [];
  let currentBalance = principal;
  let totalInterestPaid = 0;

  let moratoriumMonthlyInterest = 0;
  if (effectiveMoratorium > 0) {
    moratoriumMonthlyInterest = currentBalance * monthlyRate;

    for (let m = 1; m <= effectiveMoratorium; m++) {
      const interestForMonth = currentBalance * monthlyRate;
      totalInterestPaid += interestForMonth;

      if (capitalizeMoratoriumInterest) {
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

  let regularEMI = 0;
  if (monthlyRate === 0) {
    regularEMI = currentBalance / repaymentMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, repaymentMonths);
    regularEMI = (currentBalance * monthlyRate * factor) / (factor - 1);
  }

  for (let m = 1; m <= repaymentMonths; m++) {
    const overallMonth = effectiveMoratorium + m;
    const interestPart = currentBalance * monthlyRate;
    let principalPart = regularEMI - interestPart;

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

  return {
    principal,
    regularMonthlyEMI: Math.round(regularEMI),
    moratoriumMonthlyInterest: Math.round(moratoriumMonthlyInterest),
    totalInterestPaid: Math.round(totalInterestPaid),
    totalRepayment: Math.round(principal + totalInterestPaid),
    schedule,
  };
}

test('Standard EMI Calculation without Moratorium', () => {
  // Principal: ₹1,00,000, 12% p.a., 12 months
  // Standard monthly rate = 1%, (1+r)^12 = 1.126825... EMI is approx ₹8,885
  const res = calculateLoanRepayment({
    principal: 100000,
    interestRatePercent: 12,
    tenureMonths: 12,
    moratoriumMonths: 0,
  });

  assert.equal(res.regularMonthlyEMI, 8885);
  assert.equal(res.schedule.length, 12);
  assert.equal(res.schedule[11].closingBalance, 0);
  assert(res.totalInterestPaid > 0);
  assert.equal(res.totalRepayment, 100000 + res.totalInterestPaid);
});

test('NBCFDC Microfinance Loan with 3-Month Moratorium', () => {
  // Principal: ₹1,40,000, 6.5% p.a., 36 months, 3 months moratorium
  const res = calculateLoanRepayment({
    principal: 140000,
    interestRatePercent: 6.5,
    tenureMonths: 36,
    moratoriumMonths: 3,
  });

  assert.equal(res.schedule.length, 36);
  // First 3 months are moratorium
  assert.equal(res.schedule[0].isMoratorium, true);
  assert.equal(res.schedule[1].isMoratorium, true);
  assert.equal(res.schedule[2].isMoratorium, true);
  assert.equal(res.schedule[3].isMoratorium, false);

  // Closing balance after month 3 remains original principal since interest was serviced
  assert.equal(res.schedule[2].closingBalance, 140000);
  // Closing balance at end of tenure is 0
  assert.equal(res.schedule[35].closingBalance, 0);
});

test('Zero / Negative principal edge cases', () => {
  const res = calculateLoanRepayment({
    principal: 0,
    interestRatePercent: 7,
    tenureMonths: 24,
    moratoriumMonths: 0,
  });
  assert.equal(res.regularMonthlyEMI, 0);
  assert.equal(res.schedule.length, 0);
});

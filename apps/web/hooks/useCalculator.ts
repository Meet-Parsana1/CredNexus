'use client';

import { useState, useMemo } from 'react';
import { calculateLoanRepayment } from '../lib/engines/calculator';
import { CalculatorInput, CalculatorResult } from '../lib/types';

export function useCalculator(initialInput: CalculatorInput) {
  const [input, setInput] = useState<CalculatorInput>(initialInput);

  const result: CalculatorResult = useMemo(() => {
    return calculateLoanRepayment(input);
  }, [input]);

  return {
    input,
    setInput,
    result,
  };
}

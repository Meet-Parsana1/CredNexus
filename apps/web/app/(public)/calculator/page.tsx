'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Calculator, 
  HelpCircle, 
  ArrowRight, 
  FileSpreadsheet, 
  Info, 
  CheckCircle2, 
  Layers, 
  PieChart 
} from 'lucide-react';
import { useLanguage } from '../../../lib/i18n/context';
import { SEEDED_SCHEMES } from '../../../lib/data';
import { calculateLoanRepayment, formatINR } from '../../../lib/engines/calculator';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

function CalculatorContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const paramScheme = searchParams?.get('scheme') || 'custom';
  const matchingScheme = SEEDED_SCHEMES.find((sch) => sch.id === paramScheme);

  const initialAmount = Number(searchParams?.get('amount')) || (matchingScheme ? matchingScheme.maxLoanAmount : 125000);
  const initialRate = Number(searchParams?.get('rate')) || (matchingScheme ? matchingScheme.interestRateMin : 6.5);
  const initialTenure = Number(searchParams?.get('tenure')) || (matchingScheme ? matchingScheme.tenureMaxMonths : 36);
  const initialMoratorium = Number(searchParams?.get('moratorium')) || (matchingScheme ? matchingScheme.moratoriumMaxMonths : 3);

  const [principal, setPrincipal] = useState(initialAmount);
  const [interestRate, setInterestRate] = useState(initialRate);
  const [tenureMonths, setTenureMonths] = useState(initialTenure);
  const [moratoriumMonths, setMoratoriumMonths] = useState(initialMoratorium);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(matchingScheme ? matchingScheme.id : 'custom');
  const [showAmortization, setShowAmortization] = useState(false);

  // Pre-fill from scheme dropdown
  const handleSchemeSelect = (id: string) => {
    setSelectedSchemeId(id);
    if (id === 'custom') return;
    const s = SEEDED_SCHEMES.find((sch) => sch.id === id);
    if (s) {
      setPrincipal(s.maxLoanAmount);
      setInterestRate(s.interestRateMin);
      setTenureMonths(s.tenureMaxMonths);
      setMoratoriumMonths(s.moratoriumMaxMonths);
    }
  };

  const result = calculateLoanRepayment({
    principal,
    interestRatePercent: interestRate,
    tenureMonths,
    moratoriumMonths,
    capitalizeMoratoriumInterest: false,
  });

  const principalPercent = result.totalRepayment > 0 
    ? Math.round((principal / result.totalRepayment) * 100) 
    : 100;
  const interestPercent = 100 - principalPercent;

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mathematical Financial Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-navy-800">
            Concessional EMI &amp; Moratorium Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Accurately model monthly installments, interest savings under subsidized apex schemes, and principal grace moratoriums.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-elevated space-y-5">
            {/* Scheme Preset Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Pre-populate with Scheme Parameters:
              </label>
              <select
                value={selectedSchemeId}
                onChange={(e) => handleSchemeSelect(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-1 focus:ring-royal-500 focus:outline-none"
              >
                <option value="custom">Custom Parameters (User Input)</option>
                {SEEDED_SCHEMES.map((sch) => (
                  <option key={sch.id} value={sch.id}>
                    {sch.name} ({sch.interestRateMin}% &bull; up to {formatINR(sch.maxLoanAmount)})
                  </option>
                ))}
              </select>
            </div>

            {/* Principal Slider & Input */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Loan Principal:</span>
                <span className="font-extrabold text-navy-800 text-base font-tabular">
                  {formatINR(principal)}
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={5000000}
                step={10000}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full accent-royal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-tabular">
                <span>₹10,000</span>
                <span>₹1.4 Lakh (Micro)</span>
                <span>₹15 Lakh</span>
                <span>₹50 Lakh (Term)</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Annual Interest Rate (%):</span>
                <span className="font-extrabold text-royal-600 text-base font-tabular">
                  {interestRate}%
                </span>
              </div>
              <input
                type="range"
                min={3.5}
                max={15.0}
                step={0.25}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-royal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-tabular">
                <span>4.0% (Edu Female)</span>
                <span>6.5% (NBCFDC Micro)</span>
                <span>8.0% (Term Loan)</span>
                <span>12.0%+ (Commercial)</span>
              </div>
            </div>

            {/* Tenure */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Loan Tenure:</span>
                <span className="font-extrabold text-navy-800 text-base font-tabular">
                  {tenureMonths} Months ({Math.round((tenureMonths / 12) * 10) / 10} Yrs)
                </span>
              </div>
              <input
                type="range"
                min={6}
                max={120}
                step={6}
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full accent-royal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-tabular">
                <span>12 Mo (1 Yr)</span>
                <span>36 Mo (3 Yrs)</span>
                <span>60 Mo (5 Yrs)</span>
                <span>120 Mo (10 Yrs)</span>
              </div>
            </div>

            {/* Moratorium Grace Period */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  Moratorium Grace Period:
                  <span className="text-[10px] text-slate-400 font-normal">(Principal deferred)</span>
                </span>
                <span className="font-extrabold text-emerald-700 text-base font-tabular">
                  {moratoriumMonths} Months
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.min(18, tenureMonths - 1)}
                step={1}
                value={moratoriumMonths}
                onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-tabular">
                <span>0 (Immediate)</span>
                <span>3 Mo (Micro)</span>
                <span>6 Mo (Term)</span>
                <span>12 Mo (Edu)</span>
              </div>
            </div>
          </div>

          {/* Results Summary Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-navy-900 text-white rounded-2xl p-6 sm:p-7 shadow-elevated border border-navy-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-navy-800">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Repayment Breakdown
                </span>
                <Badge variant="emerald" size="sm">Reducing Balance</Badge>
              </div>

              {/* Highlight EMI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-navy-950/70 p-4 rounded-xl border border-navy-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Regular Monthly Installment (EMI)
                  </span>
                  <div className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400 font-tabular mt-1">
                    {formatINR(result.regularMonthlyEMI)}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Effective after {moratoriumMonths} months moratorium
                  </span>
                </div>

                <div className="bg-navy-950/70 p-4 rounded-xl border border-navy-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Moratorium Monthly Interest
                  </span>
                  <div className="text-xl sm:text-2xl font-display font-extrabold text-saffron-400 font-tabular mt-1">
                    {formatINR(result.moratoriumMonthlyInterest)}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Serviced monthly during grace period
                  </span>
                </div>
              </div>

              {/* Financial Totals */}
              <div className="space-y-2.5 pt-2 text-xs border-t border-navy-800">
                <div className="flex justify-between text-slate-300">
                  <span>Principal Amount:</span>
                  <span className="text-white font-bold font-tabular">{formatINR(result.principal)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Total Interest Paid:</span>
                  <span className="text-saffron-400 font-bold font-tabular">{formatINR(result.totalInterestPaid)}</span>
                </div>
                <div className="flex justify-between text-base text-white pt-2 border-t border-navy-800">
                  <span className="font-extrabold">Total Outflow (P + I):</span>
                  <span className="text-emerald-400 font-extrabold font-tabular">{formatINR(result.totalRepayment)}</span>
                </div>
              </div>

              {/* Visual Proportion Bar */}
              <div className="pt-2">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-semibold">
                  <span className="text-white">Principal ({principalPercent}%)</span>
                  <span className="text-saffron-400">Total Interest ({interestPercent}%)</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden bg-navy-950 flex">
                  <div className="bg-royal-500 h-full transition-all" style={{ width: `${principalPercent}%` }} />
                  <div className="bg-saffron-500 h-full transition-all" style={{ width: `${interestPercent}%` }} />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setShowAmortization(!showAmortization)}
                  className="w-full justify-center bg-transparent text-white border-slate-700 hover:bg-navy-800"
                  icon={<FileSpreadsheet className="w-4 h-4 text-emerald-400" />}
                >
                  {showAmortization ? 'Hide Month-by-Month Schedule' : 'View Full Amortization Table'}
                </Button>
              </div>
            </div>

            {/* Moratorium Note Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 text-xs text-slate-600 space-y-2">
              <h4 className="font-bold text-navy-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-royal-600" />
                How CredNexus Models Moratorium:
              </h4>
              <p className="leading-relaxed">
                Under NBCFDC guidelines, during the moratorium (grace) period of 1 to 6 months, only simple interest is charged so that new entrepreneurs or students can set up their enterprise before beginning capital repayments.
              </p>
            </div>
          </div>
        </div>

        {/* Amortization Schedule Drawer / Table */}
        {showAmortization && (
          <div className="mt-12 bg-white rounded-2xl border border-slate-200 shadow-elevated p-6 sm:p-8 animate-in fade-in-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-slate-100">
              <div>
                <h3 className="font-display font-extrabold text-xl text-navy-800">
                  Full Amortization Schedule
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed breakdown of opening balance, interest, principal repayment, and closing balance for each month.
                </p>
              </div>
              <Badge variant="navy" size="sm">
                {result.schedule.length} Total Installments
              </Badge>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-xs text-start border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                    <th className="p-3 text-start">Month</th>
                    <th className="p-3 text-end">Opening Balance</th>
                    <th className="p-3 text-end">Installment Paid</th>
                    <th className="p-3 text-end">Principal Paid</th>
                    <th className="p-3 text-end">Interest Paid</th>
                    <th className="p-3 text-end">Closing Balance</th>
                    <th className="p-3 text-center">Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-tabular">
                  {result.schedule.map((row) => (
                    <tr
                      key={row.month}
                      className={row.isMoratorium ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-slate-50'}
                    >
                      <td className="p-3 font-semibold text-slate-900">{row.month}</td>
                      <td className="p-3 text-end text-slate-700">{formatINR(row.openingBalance)}</td>
                      <td className="p-3 text-end font-bold text-navy-800">{formatINR(row.totalInstallment)}</td>
                      <td className="p-3 text-end text-emerald-700 font-semibold">{formatINR(row.principalPaid)}</td>
                      <td className="p-3 text-end text-saffron-700 font-semibold">{formatINR(row.interestPaid)}</td>
                      <td className="p-3 text-end font-bold text-slate-900">{formatINR(row.closingBalance)}</td>
                      <td className="p-3 text-center">
                        {row.isMoratorium ? (
                          <Badge variant="saffron" size="sm">Grace (Moratorium)</Badge>
                        ) : (
                          <Badge variant="emerald" size="sm">Active Repayment</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">
          Loading EMI Calculator...
        </div>
      }
    >
      <CalculatorContent />
    </Suspense>
  );
}

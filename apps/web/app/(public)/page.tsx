'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
      ArrowRight,
      Calculator,
      MapPin,
      ShieldCheck,
      CheckCircle2,
      HelpCircle,
      BookOpen,
      Users,
      Building2,
      Globe2,
      Coins,
      ChevronRight,
      ArrowUpRight,
      Search,
      Layers,
      Percent,
      Compass,
      FileCheck,
} from 'lucide-react';
import { useLanguage } from '../../lib/i18n/context';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DataFreshnessIndicator } from '../../components/ui/DataFreshnessIndicator';
import { SEEDED_SCHEMES, SEEDED_PARTNERS } from '../../lib/data';
import { calculateLoanRepayment, formatINR } from '../../lib/engines/calculator';
import { SchemeCategory } from '../../lib/types';

export default function HomePage() {
      const { t } = useLanguage();
      const router = useRouter();

      // Interactive "Find My Scheme" workflow query state
      const [selectedPurpose, setSelectedPurpose] = useState<SchemeCategory | 'any'>('business');
      const [selectedAmount, setSelectedAmount] = useState<number>(120000);
      const [customAmountText, setCustomAmountText] = useState<string>('');

      // Quick interactive calculator section state
      const [calcAmount, setCalcAmount] = useState<number>(140000);
      const [calcTenure, setCalcTenure] = useState<number>(36);
      const [calcMoratorium, setCalcMoratorium] = useState<number>(3);

      const quickCalc = calculateLoanRepayment({
            principal: calcAmount,
            interestRatePercent: 6.5,
            tenureMonths: calcTenure,
            moratoriumMonths: calcMoratorium,
      });

      const handleLaunchRecommender = () => {
            const amountToUse = customAmountText
                  ? Number(customAmountText.replace(/[^0-9]/g, '')) || selectedAmount
                  : selectedAmount;
            router.push(`/recommend?purpose=${selectedPurpose}&amount=${amountToUse}`);
      };

      const purposeOptions: { id: SchemeCategory | 'any'; label: string; sub: string }[] = [
            { id: 'business', label: 'Start or Grow Business', sub: 'Mudra & Enterprise Loans' },
            { id: 'microfinance', label: 'Micro-Credit & Artisan', sub: 'Self-Help Groups & Individuals ≤ ₹1.4L' },
            { id: 'term_loan', label: 'Medium Term Loan', sub: 'Capital Assets & Machinery ≤ ₹50L' },
            { id: 'education', label: 'Higher Education', sub: 'Domestic & Overseas Professional Studies' },
            { id: 'green_sanitation', label: 'Green & Sanitation', sub: 'Mechanized Equipment & Clean Tech' },
            { id: 'any', label: 'Explore All Types', sub: 'Full Concessional Spectrum' },
      ];

      const capitalPresets = [
            { label: '₹50,000', value: 50000 },
            { label: '₹1,20,000', value: 120000 },
            { label: '₹3,00,000', value: 300000 },
            { label: '₹5,00,000', value: 500000 },
            { label: '₹15,00,000', value: 1500000 },
            { label: '₹50,00,000', value: 5000000 },
      ];

      return (
            <div className="flex flex-col min-h-screen bg-slate-50">
                  {/* =========================================================================
          1. EDITORIAL HERO SECTION — FULL-WIDTH ASYMMETRIC PRODUCT INTERFACE
          ========================================================================= */}
                  <section className="relative bg-white border-b border-slate-200 pt-10 pb-16 lg:pt-16 lg:pb-20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              {/* Eyebrow / Trust Indicator */}
                              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                                    <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-600" />
                                          <span className="uppercase tracking-wider font-bold text-navy-900">
                                                CredNexus
                                          </span>
                                          <span className="text-slate-300">|</span>
                                          <span className="text-slate-600">
                                                Sovereign Concessional Credit Infrastructure
                                          </span>
                                          <span className="text-slate-300 hidden sm:inline">|</span>
                                          <span className="text-slate-500 hidden sm:inline">
                                                MoSJE &amp; Central Apex Corporations
                                          </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                          <DataFreshnessIndicator status="VERIFIED" compact />
                                    </div>
                              </div>

                              {/* Main Editorial Headline & Context */}
                              <div className="pt-10 pb-8 max-w-4xl">
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-navy-900 tracking-tight leading-[1.12]">
                                          Find the financial support that fits your situation.
                                    </h1>
                                    <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
                                          CredNexus connects marginalized entrepreneurs, artisans, students, and small
                                          business owners directly to verified government concessional loan schemes,
                                          reducing-balance moratorium terms, and accredited channel partners.
                                    </p>
                              </div>

                              {/* Integrated Product Journey: "Find My Scheme" Direct Entry */}
                              <div className="mt-4 bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-8">
                                    <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                                          <div>
                                                <span className="text-[11px] font-bold tracking-wider uppercase text-royal-700">
                                                      Step 1 &bull; Direct Scheme Query
                                                </span>
                                                <h2 className="text-base sm:text-lg font-bold text-navy-900 mt-0.5">
                                                      What kind of financing are you looking for?
                                                </h2>
                                          </div>
                                          <span className="text-xs text-slate-500 hidden md:block">
                                                No login required &bull; Deterministic matching
                                          </span>
                                    </div>

                                    {/* Purpose Selector Chips */}
                                    <div className="mt-5">
                                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                                                {purposeOptions.map((opt) => {
                                                      const isSelected = selectedPurpose === opt.id;
                                                      return (
                                                            <button
                                                                  key={opt.id}
                                                                  type="button"
                                                                  onClick={() => setSelectedPurpose(opt.id)}
                                                                  className={`text-left p-3 rounded-xl border transition-all ${
                                                                        isSelected
                                                                              ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                                                                              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
                                                                  }`}
                                                            >
                                                                  <div className="text-xs font-bold leading-snug">
                                                                        {opt.label}
                                                                  </div>
                                                                  <div
                                                                        className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}
                                                                  >
                                                                        {opt.sub}
                                                                  </div>
                                                            </button>
                                                      );
                                                })}
                                          </div>
                                    </div>

                                    {/* Amount Selector & Primary Action */}
                                    <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                                          <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between">
                                                      <span className="text-xs font-semibold text-slate-700">
                                                            Estimated Capital Requirement:
                                                      </span>
                                                      <span className="text-sm font-bold font-tabular text-navy-900">
                                                            {customAmountText
                                                                  ? customAmountText
                                                                  : formatINR(selectedAmount)}
                                                      </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                      {capitalPresets.map((preset) => (
                                                            <button
                                                                  key={preset.value}
                                                                  type="button"
                                                                  onClick={() => {
                                                                        setSelectedAmount(preset.value);
                                                                        setCustomAmountText('');
                                                                  }}
                                                                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                                                                        selectedAmount === preset.value &&
                                                                        !customAmountText
                                                                              ? 'bg-royal-600 text-white border-royal-600'
                                                                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                                                  }`}
                                                            >
                                                                  {preset.label}
                                                            </button>
                                                      ))}
                                                      <div className="relative inline-flex items-center">
                                                            <span className="absolute left-2.5 text-xs text-slate-400 font-bold">
                                                                  ₹
                                                            </span>
                                                            <input
                                                                  type="text"
                                                                  placeholder="Other Amount"
                                                                  value={customAmountText}
                                                                  onChange={(e) => setCustomAmountText(e.target.value)}
                                                                  className="pl-6 pr-3 py-1 text-xs border border-slate-200 rounded-lg bg-white w-28 focus:outline-none focus:border-royal-500"
                                                            />
                                                      </div>
                                                </div>
                                          </div>

                                          {/* Action Buttons */}
                                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 lg:pt-0">
                                                <button
                                                      type="button"
                                                      onClick={handleLaunchRecommender}
                                                      className="px-6 py-3 rounded-xl bg-royal-600 hover:bg-royal-700 text-white text-sm font-bold shadow-sm transition-all inline-flex items-center justify-center gap-2"
                                                >
                                                      <span>Find Matching Schemes</span>
                                                      <ArrowRight className="w-4 h-4" />
                                                </button>
                                                <Link
                                                      href="/schemes"
                                                      className="px-4 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold text-center transition-colors"
                                                >
                                                      Browse Scheme Registry
                                                </Link>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* =========================================================================
          2. HORIZONTAL DATA & TRUST STRIP (NO GENERIC MARKETING CARDS)
          ========================================================================= */}
                  <section className="bg-slate-900 text-white border-b border-slate-800">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800 py-6 sm:py-8">
                                    <div className="py-4 md:py-0 md:px-6 first:pl-0">
                                          <div className="text-2xl sm:text-3xl font-display font-extrabold text-white font-tabular">
                                                {SEEDED_SCHEMES.length} Schemes
                                          </div>
                                          <div className="text-xs font-bold uppercase tracking-wider text-saffron-400 mt-1">
                                                Official NSFDC Registry
                                          </div>
                                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                                Statutory concessional lending published by NSFDC / MoSJE.
                                          </p>
                                    </div>

                                    <div className="py-4 md:py-0 md:px-6">
                                          <div className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400 font-tabular">
                                                {SEEDED_PARTNERS.length} Partners
                                          </div>
                                          <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 mt-1">
                                                Accredited SCAs &amp; Banks
                                          </div>
                                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                                State Channelising Agencies, Public Sector Banks, and RRBs.
                                          </p>
                                    </div>

                                    <div className="py-4 md:py-0 md:px-6">
                                          <div className="text-2xl sm:text-3xl font-display font-extrabold text-white font-tabular">
                                                ₹10K – ₹45L
                                          </div>
                                          <div className="text-xs font-bold uppercase tracking-wider text-royal-400 mt-1">
                                                Concessional Loan Limits
                                          </div>
                                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                                Covering microfinance groups to large capital investments.
                                          </p>
                                    </div>

                                    <div className="py-4 md:py-0 md:px-6 last:pr-0">
                                          <div className="text-2xl sm:text-3xl font-display font-extrabold text-saffron-400 font-tabular">
                                                1 – 12 Months
                                          </div>
                                          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-1">
                                                Statutory Moratorium
                                          </div>
                                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                                Standard grace terms with reducing-balance protection.
                                          </p>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* =========================================================================
          3. WHAT CAN CREDNEXUS HELP YOU DO? — STRUCTURED EDITORIAL WORKFLOW
          ========================================================================= */}
                  <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="max-w-3xl">
                                    <span className="text-xs font-bold uppercase tracking-wider text-royal-600">
                                          The Decision Architecture
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-navy-900 mt-1.5">
                                          Everything needed to make an informed borrowing decision.
                                    </h2>
                                    <p className="text-sm text-slate-600 mt-2">
                                          CredNexus resolves the four systematic points of failure where marginalized
                                          borrowers typically encounter application rejections or predatory debt.
                                    </p>
                              </div>

                              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {/* Step 1 */}
                                    <div className="space-y-3 pt-4 border-t-2 border-royal-600">
                                          <span className="text-xs font-bold text-royal-600">01 / DISCOVERY</span>
                                          <h3 className="text-base font-bold text-navy-900">
                                                Identify Eligible Schemes
                                          </h3>
                                          <p className="text-xs text-slate-600 leading-relaxed">
                                                Instantly filter across sovereign schemes based on your project cost,
                                                social category, and household income ceiling.
                                          </p>
                                          <Link
                                                href="/recommend"
                                                className="inline-flex items-center gap-1 text-xs font-bold text-royal-600 hover:text-royal-700"
                                          >
                                                Start Matcher <ArrowRight className="w-3.5 h-3.5" />
                                          </Link>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="space-y-3 pt-4 border-t-2 border-emerald-600">
                                          <span className="text-xs font-bold text-emerald-700">02 / ELIGIBILITY</span>
                                          <h3 className="text-base font-bold text-navy-900">
                                                Understand Detailed Rules
                                          </h3>
                                          <p className="text-xs text-slate-600 leading-relaxed">
                                                Review plain-language checklists of age limits, target demographics, and
                                                required documentation without legal jargon.
                                          </p>
                                          <Link
                                                href="/eligibility"
                                                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                                          >
                                                Check Criteria <ArrowRight className="w-3.5 h-3.5" />
                                          </Link>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="space-y-3 pt-4 border-t-2 border-navy-800">
                                          <span className="text-xs font-bold text-navy-800">03 / MATHEMATICS</span>
                                          <h3 className="text-base font-bold text-navy-900">
                                                Calculate Exact Repayments
                                          </h3>
                                          <p className="text-xs text-slate-600 leading-relaxed">
                                                Simulate month-by-month installments with reducing balance calculations,
                                                moratorium holidays, and subsidized rate comparisons.
                                          </p>
                                          <Link
                                                href="/calculator"
                                                className="inline-flex items-center gap-1 text-xs font-bold text-navy-800 hover:text-navy-900"
                                          >
                                                Compute EMI <ArrowRight className="w-3.5 h-3.5" />
                                          </Link>
                                    </div>

                                    {/* Step 4 */}
                                    <div className="space-y-3 pt-4 border-t-2 border-saffron-500">
                                          <span className="text-xs font-bold text-saffron-700">04 / APPLICATION</span>
                                          <h3 className="text-base font-bold text-navy-900">
                                                Locate Authorized Partners
                                          </h3>
                                          <p className="text-xs text-slate-600 leading-relaxed">
                                                Pinpoint accredited State Channelising Agencies (SCAs), Public Sector
                                                Banks, and Regional Rural Banks with active fund limits.
                                          </p>
                                          <Link
                                                href="/partners"
                                                className="inline-flex items-center gap-1 text-xs font-bold text-saffron-700 hover:text-saffron-800"
                                          >
                                                Find Partner Desks <ArrowRight className="w-3.5 h-3.5" />
                                          </Link>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* =========================================================================
          4. STATUTORY SCHEME REGISTRY OVERVIEW — EDITORIAL DATA ROWS
          ========================================================================= */}
                  <section className="py-16 bg-slate-50 border-b border-slate-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                                    <div>
                                          <span className="text-xs font-bold uppercase tracking-wider text-royal-600">
                                                Statutory Scheme Registry
                                          </span>
                                          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-navy-900 mt-1">
                                                Verified Central Corporation Portfolios
                                          </h2>
                                          <p className="text-xs sm:text-sm text-slate-600 mt-1">
                                                Every scheme is verified against official Ministry of Social Justice and
                                                Empowerment guidelines.
                                          </p>
                                    </div>
                                    <Link
                                          href="/schemes"
                                          className="inline-flex items-center gap-1 text-xs font-bold text-royal-600 hover:text-royal-700"
                                    >
                                          View All {SEEDED_SCHEMES.length} Verified Schemes{' '}
                                          <ArrowRight className="w-4 h-4" />
                                    </Link>
                              </div>

                              {/* Scheme Data Rows (Editorial Grid) */}
                              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-200 overflow-hidden shadow-xs">
                                    {SEEDED_SCHEMES.map((scheme) => (
                                          <div
                                                key={scheme.id}
                                                className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                                          >
                                                <div className="lg:w-2/5 space-y-1.5">
                                                      <div className="flex items-center gap-2">
                                                            <Badge
                                                                  variant={
                                                                        scheme.category === 'microfinance'
                                                                              ? 'royal'
                                                                              : scheme.category === 'education'
                                                                                ? 'emerald'
                                                                                : 'navy'
                                                                  }
                                                                  size="sm"
                                                            >
                                                                  {scheme.category.replace('_', ' ').toUpperCase()}
                                                            </Badge>
                                                            <span className="text-[11px] font-mono text-slate-400">
                                                                  {scheme.code}
                                                            </span>
                                                      </div>
                                                      <h3 className="text-base font-bold text-navy-900">
                                                            {scheme.name}
                                                      </h3>
                                                      <p className="text-xs text-slate-600 line-clamp-1">
                                                            {scheme.tagline}
                                                      </p>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4 text-xs lg:w-2/5">
                                                      <div>
                                                            <span className="text-[10px] text-slate-400 uppercase font-bold block">
                                                                  Max Loan Limit
                                                            </span>
                                                            <span className="text-sm font-extrabold text-navy-900 font-tabular">
                                                                  {formatINR(scheme.maxLoanAmount)}
                                                            </span>
                                                      </div>
                                                      <div>
                                                            <span className="text-[10px] text-slate-400 uppercase font-bold block">
                                                                  Interest Rate
                                                            </span>
                                                            <span className="text-sm font-extrabold text-royal-600 font-tabular">
                                                                  {scheme.interestRateMin}% – {scheme.interestRateMax}%
                                                            </span>
                                                      </div>
                                                      <div>
                                                            <span className="text-[10px] text-slate-400 uppercase font-bold block">
                                                                  Moratorium
                                                            </span>
                                                            <span className="text-sm font-semibold text-slate-700">
                                                                  {scheme.moratoriumMaxMonths > 0
                                                                        ? `${scheme.moratoriumMaxMonths} Months`
                                                                        : 'Nil'}
                                                            </span>
                                                      </div>
                                                </div>

                                                <div className="flex items-center gap-2 lg:w-1/5 lg:justify-end">
                                                      <Link href={`/schemes/${scheme.id}`}>
                                                            <Button variant="outline" size="sm">
                                                                  Details
                                                            </Button>
                                                      </Link>
                                                      <Link href={`/calculator?scheme=${scheme.id}`}>
                                                            <Button variant="primary" size="sm">
                                                                  Calc EMI
                                                            </Button>
                                                      </Link>
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </section>

                  {/* =========================================================================
          5. FINANCIAL CALCULATOR SECTION — CONCESSIONAL REPAYMENT CLARITY
          ========================================================================= */}
                  <section className="py-16 sm:py-20 bg-navy-900 text-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                                    <div className="lg:col-span-5 space-y-4">
                                          <span className="text-xs font-bold uppercase tracking-wider text-saffron-400">
                                                Financial Transparency
                                          </span>
                                          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                                                Understand your actual monthly installment before applying.
                                          </h2>
                                          <p className="text-sm text-slate-300 leading-relaxed">
                                                Statutory schemes offer repayment holidays (moratorium) where
                                                beneficiaries are not required to repay principal during initial
                                                enterprise setup.
                                          </p>
                                          <div className="pt-2">
                                                <Link href="/calculator">
                                                      <Button variant="primary" size="md" className="gap-2">
                                                            <Calculator className="w-4 h-4" /> Open Full Calculator
                                                            &amp; Amortization Schedule
                                                      </Button>
                                                </Link>
                                          </div>
                                    </div>

                                    <div className="lg:col-span-7 bg-navy-800 border border-navy-700 rounded-2xl p-6 sm:p-8">
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-5">
                                                      <div>
                                                            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                                                                  <span>Loan Amount</span>
                                                                  <span className="text-white font-bold font-tabular">
                                                                        {formatINR(calcAmount)}
                                                                  </span>
                                                            </div>
                                                            <input
                                                                  type="range"
                                                                  min={10000}
                                                                  max={140000}
                                                                  step={5000}
                                                                  value={calcAmount}
                                                                  onChange={(e) =>
                                                                        setCalcAmount(Number(e.target.value))
                                                                  }
                                                                  className="w-full accent-royal-400 cursor-pointer"
                                                            />
                                                            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                                                  <span>₹10,000</span>
                                                                  <span>₹1,40,000 (Micro Ceiling)</span>
                                                            </div>
                                                      </div>

                                                      <div>
                                                            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                                                                  <span>Repayment Tenure</span>
                                                                  <span className="text-white font-bold">
                                                                        {calcTenure} Months ({calcTenure / 12} Yrs)
                                                                  </span>
                                                            </div>
                                                            <input
                                                                  type="range"
                                                                  min={12}
                                                                  max={36}
                                                                  step={6}
                                                                  value={calcTenure}
                                                                  onChange={(e) =>
                                                                        setCalcTenure(Number(e.target.value))
                                                                  }
                                                                  className="w-full accent-royal-400 cursor-pointer"
                                                            />
                                                      </div>

                                                      <div>
                                                            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                                                                  <span>Moratorium Grace Period</span>
                                                                  <span className="text-emerald-400 font-bold">
                                                                        {calcMoratorium} Months
                                                                  </span>
                                                            </div>
                                                            <input
                                                                  type="range"
                                                                  min={0}
                                                                  max={6}
                                                                  step={1}
                                                                  value={calcMoratorium}
                                                                  onChange={(e) =>
                                                                        setCalcMoratorium(Number(e.target.value))
                                                                  }
                                                                  className="w-full accent-emerald-400 cursor-pointer"
                                                            />
                                                      </div>
                                                </div>

                                                <div className="bg-navy-950/80 rounded-xl p-5 border border-navy-700 flex flex-col justify-between space-y-4">
                                                      <div>
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                                                  Estimated Monthly EMI
                                                            </span>
                                                            <div className="text-3xl font-extrabold text-emerald-400 font-tabular mt-1">
                                                                  {formatINR(quickCalc.regularMonthlyEMI)}
                                                                  <span className="text-xs text-slate-400 font-normal">
                                                                        {' '}
                                                                        / mo
                                                                  </span>
                                                            </div>
                                                      </div>

                                                      <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-navy-800">
                                                            <div className="flex justify-between">
                                                                  <span>Interest Rate:</span>
                                                                  <span className="font-bold text-white">
                                                                        6.5% Concessional
                                                                  </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                  <span>Moratorium Interest:</span>
                                                                  <span className="font-bold text-slate-200">
                                                                        Simple Interest
                                                                  </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                  <span>Total Repayment:</span>
                                                                  <span className="font-bold text-white font-tabular">
                                                                        {formatINR(quickCalc.totalRepayment)}
                                                                  </span>
                                                            </div>
                                                      </div>

                                                      <Link
                                                            href={`/calculator?amount=${calcAmount}&tenure=${calcTenure}&moratorium=${calcMoratorium}`}
                                                            className="block"
                                                      >
                                                            <Button
                                                                  variant="secondary"
                                                                  size="sm"
                                                                  className="w-full text-xs"
                                                            >
                                                                  View Full Schedule
                                                            </Button>
                                                      </Link>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* =========================================================================
          6. CHANNEL PARTNER NETWORKS & GEO-SPATIAL MAP TEASER
          ========================================================================= */}
                  <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
                                    <div>
                                          <span className="text-xs font-bold uppercase tracking-wider text-royal-600">
                                                Institutional Delivery Layer
                                          </span>
                                          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-navy-900 mt-1">
                                                Authorized Channel Partner Network
                                          </h2>
                                          <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
                                                Schemes are not disbursed directly by the central government. Borrowers
                                                must submit their dossiers to accredited regional channel partners.
                                          </p>
                                    </div>
                                    <Link href="/partners">
                                          <Button variant="outline" className="gap-2">
                                                <MapPin className="w-4 h-4 text-royal-600" /> Open Interactive Partner
                                                Map
                                          </Button>
                                    </Link>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                                          <div className="text-xs font-bold text-royal-700 uppercase">
                                                State Channelising Agencies
                                          </div>
                                          <div className="text-sm font-extrabold text-navy-900">SCAs</div>
                                          <p className="text-xs text-slate-600">
                                                Designated state corporations (e.g. DSFDC, GBCDC, MPBCDC) implementing
                                                backward class programs.
                                          </p>
                                    </div>

                                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                                          <div className="text-xs font-bold text-emerald-700 uppercase">
                                                Public Sector Banks
                                          </div>
                                          <div className="text-sm font-extrabold text-navy-900">PSBs</div>
                                          <p className="text-xs text-slate-600">
                                                Nationalized banks (PNB, SBI, Bank of Baroda) managing Mudra, Stand-Up
                                                India, and refinance windows.
                                          </p>
                                    </div>

                                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                                          <div className="text-xs font-bold text-navy-800 uppercase">
                                                Regional Rural Banks
                                          </div>
                                          <div className="text-sm font-extrabold text-navy-900">RRBs</div>
                                          <p className="text-xs text-slate-600">
                                                Grassroots rural banks (Baroda Gujarat Gramin Bank, Aryavart Bank) with
                                                deep agrarian reach.
                                          </p>
                                    </div>

                                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                                          <div className="text-xs font-bold text-saffron-700 uppercase">
                                                Microfinance Networks
                                          </div>
                                          <div className="text-sm font-extrabold text-navy-900">NBFC-MFIs</div>
                                          <p className="text-xs text-slate-600">
                                                Accredited microfinance institutions delivering community micro-credit
                                                to women SHGs.
                                          </p>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* =========================================================================
          7. EDITORIAL FOOTER CALLOUT
          ========================================================================= */}
                  <section className="py-16 bg-slate-100 text-center">
                        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-navy-900">
                                    Make your financial decision with total clarity.
                              </h2>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                    Begin with your project capital requirement or explore the full statutory scheme
                                    registry. No ads, no commercial lead generation, and no fees.
                              </p>
                              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                                    <Link href="/recommend">
                                          <Button size="lg" variant="primary" className="gap-2">
                                                Launch Scheme Matcher <ArrowRight className="w-4 h-4" />
                                          </Button>
                                    </Link>
                                    <Link href="/partners">
                                          <Button size="lg" variant="outline">
                                                Locate Nearby Partner Desks
                                          </Button>
                                    </Link>
                              </div>
                        </div>
                  </section>
            </div>
      );
}

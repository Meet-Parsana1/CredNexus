'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Calculator, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  HelpCircle, 
  BookOpen, 
  Users, 
  Building2, 
  Globe2, 
  Coins,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '../../lib/i18n/context';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DataFreshnessIndicator } from '../../components/ui/DataFreshnessIndicator';
import { SEEDED_SCHEMES } from '../../lib/data';
import { calculateLoanRepayment, formatINR } from '../../lib/engines/calculator';

export default function HomePage() {
  const { t } = useLanguage();

  // Quick interactive calculator teaser on the homepage
  const [quickAmount, setQuickAmount] = useState(140000);
  const [quickTenure, setQuickTenure] = useState(36);
  const quickCalc = calculateLoanRepayment({
    principal: quickAmount,
    interestRatePercent: 6.5,
    tenureMonths: quickTenure,
    moratoriumMonths: 3,
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-blue-50/40 pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-royal-50 border border-royal-200 text-royal-700 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-royal-600" />
                <span>{t('hero.badge')}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-navy-800 tracking-tight leading-[1.15]">
                {t('hero.title')}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                {t('hero.subtitle')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link href="/recommend">
                  <Button size="lg" variant="primary" icon={<Sparkles className="w-4 h-4" />}>
                    {t('hero.ctaFind')}
                  </Button>
                </Link>
                <Link href="/schemes">
                  <Button size="lg" variant="outline" icon={<ArrowRight className="w-4 h-4" />}>
                    {t('hero.ctaExplore')}
                  </Button>
                </Link>
                <Link href="/calculator">
                  <Button size="lg" variant="ghost" icon={<Calculator className="w-4 h-4 text-royal-600" />}>
                    {t('nav.calculator')}
                  </Button>
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
                <div>
                  <div className="text-xl sm:text-2xl font-display font-extrabold text-navy-800 font-tabular">
                    {t('hero.stat1')}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {t('hero.stat1Label')}
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-display font-extrabold text-royal-600 font-tabular">
                    {t('hero.stat2')}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {t('hero.stat2Label')}
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-display font-extrabold text-emerald-700 font-tabular">
                    {t('hero.stat3')}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {t('hero.stat3Label')}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card / Interactive Preview */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-white p-6 shadow-elevated border border-slate-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Live Matching Engine
                    </span>
                  </div>
                  <Badge variant="royal" size="sm">Rule-Driven &bull; Deterministic</Badge>
                </div>

                <div className="mt-5 space-y-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="flex justify-between text-slate-500">
                      <span>Persona Case:</span>
                      <span className="font-semibold text-slate-700">Marginalized Artisan / Trader</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Project Capital:</span>
                      <span className="font-bold text-navy-800">₹1,20,000</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Family Income:</span>
                      <span className="font-semibold text-slate-700">&le; ₹3,00,000 / annum</span>
                    </div>
                  </div>

                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                          Top Recommended Match (92%)
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                          NBCFDC Micro Finance Scheme
                        </h4>
                      </div>
                      <Badge variant="emerald" size="sm">Eligible</Badge>
                    </div>

                    <div className="mt-3 space-y-1.5 text-[11px] text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Project cost within ₹1.40 Lakh ceiling</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Concessional rate at 6.5% with 3-month moratorium</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Disbursed via authorized State Channelising Agency (SCA)</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href="/recommend" className="w-full block">
                      <Button variant="secondary" size="md" className="w-full justify-between">
                        <span>Test Your Own Eligibility</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Problem Narrative Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-royal-600">
              The SIH 2026 Challenge
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-navy-800">
              From Fragmentation &amp; Confusion &rarr; To Actionable Confidence
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Beneficiaries often fail to benefit from concessional government funds not due to lack of schemes, but due to fragmented access, obscure eligibility rules, and opaque partner routing.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-display font-bold text-base text-navy-800">
                Scheme Mismatch
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Beneficiaries confuse micro-credit (&le; ₹1.4L) with large commercial term loans (&le; ₹50L), resulting in rejected applications or unviable interest burdens.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-saffron-100 text-saffron-700 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-display font-bold text-base text-navy-800">
                Hidden Moratorium Terms
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Borrowers do not understand how grace periods (3-12 months) and simple vs. capitalized interest impact their monthly repayment installments.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-royal-100 text-royal-700 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-display font-bold text-base text-navy-800">
                Unclear Channel Partner Routing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Not all bank branches or agencies can process specific apex schemes. Borrowers walk into unaccredited branches without finding the right desk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars of CredNexus */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-royal-600">
              Platform Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-navy-800">
              Built on 4 Non-Negotiable Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card hover:shadow-elevated transition-all space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-royal-50 text-royal-600 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-navy-800 mb-1">
                  Smart Scheme Recommender
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Progressive disclosure wizard evaluating project needs, income limits, community criteria, and loan sizes with transparent match scores.
                </p>
              </div>
              <Link href="/recommend" className="pt-3 text-xs font-semibold text-royal-600 hover:text-royal-700 inline-flex items-center gap-1">
                Launch Wizard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card hover:shadow-elevated transition-all space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-navy-800 mb-1">
                  EMI &amp; Moratorium Math
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mathematically verified reducing balance calculations with principal grace periods and full month-by-month repayment schedules.
                </p>
              </div>
              <Link href="/calculator" className="pt-3 text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1">
                Compute Repayment <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card hover:shadow-elevated transition-all space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-navy-800 mb-1">
                  Partner Locator &amp; Router
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Geo-spatial locator mapping SCAs, PSBs, RRBs, and MFIs with real accreditation matching, distance calculation, and status flags.
                </p>
              </div>
              <Link href="/partners" className="pt-3 text-xs font-semibold text-navy-800 hover:text-navy-900 inline-flex items-center gap-1">
                Explore Partners <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card hover:shadow-elevated transition-all space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron-700 flex items-center justify-center mb-4">
                  <Globe2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-navy-800 mb-1">
                  12-Language Accessibility
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Full localization across 12 Indian languages with native scripts and true bidirectional RTL layout for Urdu users.
                </p>
              </div>
              <span className="pt-3 text-xs font-semibold text-saffron-800 inline-flex items-center gap-1">
                Instant Toggle in Header <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Schemes Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-royal-600">
                Official Portfolio
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-navy-800 mt-1">
                Featured Verified Concessional Schemes
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Every detail is anchored in official apex guidelines with transparent source attribution.
              </p>
            </div>
            <Link href="/schemes">
              <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All {SEEDED_SCHEMES.length} Schemes
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SEEDED_SCHEMES.slice(0, 3).map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={scheme.category === 'microfinance' ? 'royal' : scheme.category === 'education' ? 'emerald' : 'navy'} size="sm">
                      {scheme.category.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <DataFreshnessIndicator status={scheme.verificationStatus} compact />
                  </div>

                  <h3 className="font-display font-bold text-base text-navy-800">
                    {scheme.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {scheme.tagline}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Max Loan Limit</span>
                      <span className="font-bold text-navy-800 font-tabular">{formatINR(scheme.maxLoanAmount)}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Interest Rate</span>
                      <span className="font-bold text-royal-600 font-tabular">{scheme.interestRateMin}% - {scheme.interestRateMax}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link href={`/schemes/${scheme.id}`} className="text-xs font-bold text-royal-600 hover:text-royal-700 inline-flex items-center gap-1">
                    Details &bull; Eligibility <ArrowRight className="w-3 h-3" />
                  </Link>
                  <Link href={`/calculator?amount=${scheme.maxLoanAmount}&rate=${scheme.interestRateMin}&tenure=${scheme.tenureMaxMonths}&moratorium=${scheme.moratoriumMaxMonths}`}>
                    <Button variant="ghost" size="sm" icon={<Calculator className="w-3 h-3 text-royal-600" />}>
                      Calc EMI
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Quick Calculator Demo Bar */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <Badge variant="emerald" size="sm">Financial Transparency</Badge>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white leading-tight">
                Instant Concessional Loan Calculator
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Test reducing balance payments with 3-month grace moratorium for NBCFDC Microfinance (&le; ₹1,40,000 at 6.5% interest).
              </p>
              <div className="pt-2">
                <Link href="/calculator">
                  <Button variant="primary" size="md" icon={<Calculator className="w-4 h-4" />}>
                    Open Comprehensive Calculator
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 bg-navy-800/90 rounded-2xl p-6 border border-navy-700 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Loan Amount:</span>
                      <span className="text-white font-bold">{formatINR(quickAmount)}</span>
                    </label>
                    <input
                      type="range"
                      min={10000}
                      max={140000}
                      step={5000}
                      value={quickAmount}
                      onChange={(e) => setQuickAmount(Number(e.target.value))}
                      className="w-full mt-2 accent-royal-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Tenure:</span>
                      <span className="text-white font-bold">{quickTenure} Months (3 Yrs)</span>
                    </label>
                    <input
                      type="range"
                      min={12}
                      max={36}
                      step={6}
                      value={quickTenure}
                      onChange={(e) => setQuickTenure(Number(e.target.value))}
                      className="w-full mt-2 accent-royal-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="bg-navy-950/60 rounded-xl p-4 border border-navy-700 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Estimated Monthly EMI
                    </span>
                    <div className="text-2xl font-extrabold text-emerald-400 font-tabular mt-1">
                      {formatINR(quickCalc.regularMonthlyEMI)} / mo
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300 pt-2 border-t border-navy-800">
                    <div className="flex justify-between">
                      <span>Grace Moratorium:</span>
                      <span className="text-white font-semibold">3 Months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Repayment:</span>
                      <span className="text-white font-bold font-tabular">{formatINR(quickCalc.totalRepayment)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-blue-50/50 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Empowering Grassroots Livelihoods
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800">
            Ready to find your eligible government scheme?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Take 2 minutes to describe your project or educational goals. CredNexus will match you to the right scheme and authorized partner with complete mathematical clarity.
          </p>
          <div className="flex justify-center items-center gap-3 pt-4">
            <Link href="/recommend">
              <Button size="lg" variant="primary" icon={<Sparkles className="w-4 h-4" />}>
                Start Scheme Matcher
              </Button>
            </Link>
            <Link href="/partners">
              <Button size="lg" variant="outline" icon={<MapPin className="w-4 h-4 text-navy-800" />}>
                Locate Channel Partners
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

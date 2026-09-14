'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Calculator, 
  MapPin, 
  Bookmark, 
  BookmarkCheck, 
  RefreshCw,
  Building2,
  GraduationCap,
  Store,
  Briefcase,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../../lib/i18n/context';
import { useAuth } from '../../../lib/store/auth';
import { SEEDED_SCHEMES } from '../../../lib/data';
import { rankSchemes } from '../../../lib/engines/recommender';
import { formatINR } from '../../../lib/engines/calculator';
import { RecommenderInput, SchemeCategory, SchemeMatchResult } from '../../../lib/types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { DataFreshnessIndicator } from '../../../components/ui/DataFreshnessIndicator';

export default function RecommendPage() {
  const { t } = useLanguage();
  const { isSchemeSaved, toggleSaveScheme } = useAuth();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  // Form State
  const [formData, setFormData] = useState<RecommenderInput>({
    purpose: 'business',
    projectCost: 120000,
    annualIncome: 300000,
    applicantCategory: 'OBC',
    isFemale: false,
    state: 'Delhi',
  });

  const [results, setResults] = useState<SchemeMatchResult[] | null>(null);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Execute ranking engine
      const ranked = rankSchemes(SEEDED_SCHEMES, formData);
      setResults(ranked);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setResults(null);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-royal-50 border border-royal-200 text-royal-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-royal-600" />
            <span>AI &amp; Rules-Driven Matcher</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-navy-800">
            Smart Scheme Recommender
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Answer a few transparent questions about your financing requirement. Our deterministic rules engine matches you to eligible apex schemes.
          </p>
        </div>

        {!results ? (
          /* Wizard Card */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-elevated p-6 sm:p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>Step {step} of {totalSteps}</span>
                <span>{Math.round((step / totalSteps) * 100)}% Completed</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-royal-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Purpose */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in-50">
                <div>
                  <h3 className="text-base font-bold text-navy-800">
                    What do you need financing for?
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select your primary requirement so we can match targeted sectoral schemes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    {
                      id: 'microfinance' as SchemeCategory,
                      title: 'Microfinance / Petty Trade',
                      desc: 'Street vending, artisanal craft, tiny grocery (&le; ₹1.40 Lakh)',
                      icon: Store,
                    },
                    {
                      id: 'business' as SchemeCategory,
                      title: 'Small Enterprise / Mudra',
                      desc: 'Inventory expansion, retail shop, small workshop (&le; ₹10 Lakh)',
                      icon: Briefcase,
                    },
                    {
                      id: 'term_loan' as SchemeCategory,
                      title: 'General Term Loan / Machinery',
                      desc: 'Manufacturing unit, service center, transport vehicle (&le; ₹50 Lakh)',
                      icon: Building2,
                    },
                    {
                      id: 'education' as SchemeCategory,
                      title: 'Higher Studies & Degree Courses',
                      desc: 'Professional engineering, medical, or overseas education (&le; ₹20 Lakh)',
                      icon: GraduationCap,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = formData.purpose === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setFormData({ ...formData, purpose: item.id })}
                        className={`p-4 rounded-xl border text-start transition-all cursor-pointer ${
                          isSelected
                            ? 'border-royal-600 bg-royal-50/60 ring-2 ring-royal-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-royal-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-navy-800">{item.title}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Project Cost */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in-50">
                <div>
                  <h3 className="text-base font-bold text-navy-800">
                    Estimated Funding / Project Requirement
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    What is the total capital or tuition amount you need?
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-600">Selected Amount:</span>
                    <span className="text-xl font-display font-extrabold text-navy-800 font-tabular">
                      {formatINR(formData.projectCost)}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={10000}
                    max={2500000}
                    step={10000}
                    value={formData.projectCost}
                    onChange={(e) => setFormData({ ...formData, projectCost: Number(e.target.value) })}
                    className="w-full accent-royal-600 cursor-pointer"
                  />

                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-tabular">
                    <span>₹10,000</span>
                    <span>₹5,00,000</span>
                    <span>₹15,00,000</span>
                    <span>₹25,00,000</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[50000, 120000, 300000, 500000, 1500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setFormData({ ...formData, projectCost: amt })}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                        formData.projectCost === amt
                          ? 'bg-navy-800 text-white border-navy-800'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {formatINR(amt)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Annual Income */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in-50">
                <div>
                  <h3 className="text-base font-bold text-navy-800">
                    Annual Gross Family Income
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Government concessional schemes have statutory income criteria (e.g. ₹3L or ₹5L).
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-600">Annual Family Income:</span>
                    <span className="text-xl font-display font-extrabold text-emerald-700 font-tabular">
                      {formatINR(formData.annualIncome)}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={50000}
                    max={1000000}
                    step={25000}
                    value={formData.annualIncome}
                    onChange={(e) => setFormData({ ...formData, annualIncome: Number(e.target.value) })}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />

                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-tabular">
                    <span>₹50,000</span>
                    <span>₹3,00,000 (Micro Cap)</span>
                    <span>₹5,00,000 (Term/Edu Cap)</span>
                    <span>₹10,00,000</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5 font-bold text-royal-800 mb-1">
                    <ShieldCheck className="w-4 h-4 text-royal-600" />
                    Income Guideline Reminder
                  </div>
                  <span>
                    NBCFDC Microfinance limits annual family income to <strong>₹3,00,000</strong>. General Term Loans and Education Loans allow up to <strong>₹5,00,000</strong>.
                  </span>
                </div>
              </div>
            )}

            {/* Step 4: Profile & Category */}
            {step === 4 && (
              <div className="space-y-5 animate-in fade-in-50">
                <div>
                  <h3 className="text-base font-bold text-navy-800">
                    Beneficiary Community &amp; Applicant Details
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Specific apex corporations cater to backward classes, SC/ST, or female entrepreneurs.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Social Category:
                    </label>
                    <select
                      value={formData.applicantCategory}
                      onChange={(e) => setFormData({ ...formData, applicantCategory: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-1 focus:ring-royal-500 focus:outline-none"
                    >
                      <option value="OBC">Other Backward Class (OBC / EBC)</option>
                      <option value="SC/ST">Scheduled Caste / Tribe (SC/ST)</option>
                      <option value="General">General / Other Category</option>
                      <option value="Minority">Minority Community</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      State of Residence:
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-1 focus:ring-royal-500 focus:outline-none"
                    >
                      <option value="Delhi">Delhi (NCT)</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="West Bengal">West Bengal</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFemale}
                      onChange={(e) => setFormData({ ...formData, isFemale: e.target.checked })}
                      className="w-4 h-4 rounded text-royal-600 focus:ring-royal-500 accent-royal-600"
                    />
                    <span className="text-xs font-semibold text-navy-800">
                      Applicant is a Woman Entrepreneur / Student (unlocks 0.5% interest concession)
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              {step > 1 ? (
                <Button variant="outline" size="sm" onClick={handleBack} icon={<ArrowLeft className="w-3.5 h-3.5" />}>
                  Back
                </Button>
              ) : <div />}

              <Button
                variant={step === totalSteps ? 'primary' : 'secondary'}
                size="md"
                onClick={handleNext}
                icon={step === totalSteps ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              >
                {step === totalSteps ? 'Find Matching Schemes' : 'Continue'}
              </Button>
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="space-y-8 animate-in fade-in-50">
            {/* Top match callout */}
            {results.length > 0 && (
              <div className="bg-white rounded-2xl border-2 border-royal-500 p-6 sm:p-8 shadow-elevated space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Badge variant="royal" size="md">
                      BEST MATCH &bull; {results[0].matchScore}% SCORE
                    </Badge>
                    <Badge variant={results[0].isEligible ? 'emerald' : 'red'} size="md">
                      {results[0].isEligible ? 'Eligible' : 'Conditions Unmet'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSaveScheme(results[0].scheme.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-navy-800 p-2 rounded-lg border border-slate-200"
                    >
                      {isSchemeSaved(results[0].scheme.id) ? (
                        <>
                          <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4" />
                          <span>Save Scheme</span>
                        </>
                      )}
                    </button>
                    <Button variant="ghost" size="sm" onClick={handleReset} icon={<RefreshCw className="w-3 h-3" />}>
                      Edit Inputs
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-display font-extrabold text-navy-800">
                        {results[0].scheme.name}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        {results[0].scheme.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Max Loan</span>
                      <span className="font-extrabold text-navy-800 text-sm font-tabular">{formatINR(results[0].scheme.maxLoanAmount)}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Interest Rate</span>
                      <span className="font-extrabold text-royal-600 text-sm font-tabular">{results[0].scheme.interestRateMin}% - {results[0].scheme.interestRateMax}%</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Moratorium</span>
                      <span className="font-extrabold text-navy-800 text-sm font-tabular">{results[0].scheme.moratoriumMaxMonths} Months</span>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-emerald-800 font-bold uppercase block">Indicative EMI</span>
                      <span className="font-extrabold text-emerald-700 text-sm font-tabular">{formatINR(results[0].calculatedIndicativeEMI || 0)} / mo</span>
                    </div>
                  </div>

                  {/* Why this scheme explanation */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
                    <h4 className="font-bold text-navy-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Deterministic Recommendation Rationale:
                    </h4>
                    <ul className="space-y-1 text-slate-600 pl-5 list-disc">
                      {results[0].matchedReasons.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>

                    {results[0].unmetCriteria.length > 0 && (
                      <div className="pt-2 border-t border-slate-200">
                        <span className="font-bold text-red-600 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Unmet Criteria:
                        </span>
                        <ul className="space-y-1 text-red-700 pl-5 list-disc mt-1">
                          {results[0].unmetCriteria.map((c, idx) => (
                            <li key={idx}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                  <Link href={`/schemes/${results[0].scheme.id}`}>
                    <Button variant="secondary" size="md">
                      View Full Scheme Details
                    </Button>
                  </Link>
                  <Link href={`/calculator?amount=${formData.projectCost}&rate=${results[0].scheme.interestRateMin}&tenure=${results[0].scheme.tenureMaxMonths}&moratorium=${results[0].scheme.moratoriumMaxMonths}`}>
                    <Button variant="outline" size="md" icon={<Calculator className="w-4 h-4 text-royal-600" />}>
                      Full Amortization Schedule
                    </Button>
                  </Link>
                  <Link href={`/partners?scheme=${results[0].scheme.code}&state=${formData.state}`}>
                    <Button variant="emerald" size="md" icon={<MapPin className="w-4 h-4" />}>
                      Find Authorized Channel Partner
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Other Ranked Alternatives */}
            <div className="space-y-4 pt-4">
              <h3 className="font-display font-bold text-lg text-navy-800">
                Alternative Schemes Evaluated ({results.slice(1).length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.slice(1).map((item) => (
                  <div
                    key={item.scheme.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-card transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="neutral" size="sm">
                          {item.matchScore}% Score
                        </Badge>
                        <Badge variant={item.isEligible ? 'emerald' : 'red'} size="sm">
                          {item.isEligible ? 'Eligible' : 'Ineligible'}
                        </Badge>
                      </div>

                      <h4 className="font-bold text-navy-800 text-sm">
                        {item.scheme.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {item.scheme.tagline}
                      </p>

                      <div className="text-xs text-slate-600 pt-2 border-t border-slate-100 flex justify-between font-tabular">
                        <span>Max: {formatINR(item.scheme.maxLoanAmount)}</span>
                        <span>Rate: {item.scheme.interestRateMin}%</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <Link href={`/schemes/${item.scheme.id}`} className="text-xs font-bold text-royal-600 hover:text-royal-700">
                        Inspect Rules &rarr;
                      </Link>
                      <button
                        onClick={() => toggleSaveScheme(item.scheme.id)}
                        className="text-slate-400 hover:text-navy-800"
                      >
                        {isSchemeSaved(item.scheme.id) ? (
                          <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

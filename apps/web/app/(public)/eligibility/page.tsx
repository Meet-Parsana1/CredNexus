'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  Info, 
  Calculator, 
  MapPin 
} from 'lucide-react';
import { useLanguage } from '../../../lib/i18n/context';
import { SEEDED_SCHEMES } from '../../../lib/data';
import { evaluateSchemeMatch } from '../../../lib/engines/recommender';
import { formatINR } from '../../../lib/engines/calculator';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export default function EligibilityPage() {
  const { t } = useLanguage();

  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(SEEDED_SCHEMES[0].id);
  const [projectCost, setProjectCost] = useState<number>(120000);
  const [annualIncome, setAnnualIncome] = useState<number>(280000);
  const [category, setCategory] = useState<string>('OBC');
  const [isFemale, setIsFemale] = useState<boolean>(false);

  const selectedScheme = SEEDED_SCHEMES.find((s) => s.id === selectedSchemeId) || SEEDED_SCHEMES[0];

  const evaluation = evaluateSchemeMatch(selectedScheme, {
    purpose: selectedScheme.category,
    projectCost,
    annualIncome,
    applicantCategory: category,
    isFemale,
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Auditable Transparent Rule Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-navy-800">
            Standalone Scheme Eligibility Checker
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Test your criteria against statutory scheme conditions. Never trust black-box decisions; see the exact underlying rule for every verdict.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Select Scheme to Check:
            </label>
            <select
              value={selectedSchemeId}
              onChange={(e) => setSelectedSchemeId(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:outline-none focus:ring-1 focus:ring-royal-500"
            >
              {SEEDED_SCHEMES.map((sch) => (
                <option key={sch.id} value={sch.id}>
                  {sch.name} (Max: {formatINR(sch.maxLoanAmount)} &bull; Income Cap: {sch.maxAnnualIncome > 0 ? formatINR(sch.maxAnnualIncome) : 'None'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Your Project / Loan Requirement:
              </label>
              <input
                type="number"
                value={projectCost}
                onChange={(e) => setProjectCost(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-royal-500 font-tabular font-semibold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Formatted: {formatINR(projectCost)}
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Your Annual Family Income:
              </label>
              <input
                type="number"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-royal-500 font-tabular font-semibold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Formatted: {formatINR(annualIncome)}
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Applicant Social Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-medium"
              >
                <option value="OBC">Other Backward Class (OBC)</option>
                <option value="SC/ST">Scheduled Caste / Tribe (SC/ST)</option>
                <option value="General">General Category</option>
                <option value="Minority">Minority Community</option>
              </select>
            </div>

            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 w-full cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={isFemale}
                  onChange={(e) => setIsFemale(e.target.checked)}
                  className="w-4 h-4 rounded text-royal-600 accent-royal-600"
                />
                <span className="text-xs font-semibold text-navy-800">
                  Female Borrower / Student
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Evaluation Output Card */}
        <div className={`rounded-2xl border-2 p-6 sm:p-8 shadow-elevated transition-all ${
          evaluation.isEligible
            ? 'bg-emerald-50/50 border-emerald-500'
            : 'bg-red-50/40 border-red-400'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              {evaluation.isEligible ? (
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-navy-800">
                  {evaluation.isEligible ? 'Meets Eligibility Requirements' : 'Does Not Currently Meet Criteria'}
                </h3>
                <p className="text-xs text-slate-500">
                  Evaluation against {selectedScheme.code} statutory guidelines
                </p>
              </div>
            </div>

            <Badge variant={evaluation.isEligible ? 'emerald' : 'red'} size="md">
              Score: {evaluation.matchScore} / 100
            </Badge>
          </div>

          <div className="mt-5 space-y-4 text-xs">
            {/* Matched Rules */}
            <div className="space-y-2">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Satisfied Conditions:
              </span>
              <ul className="space-y-1.5 pl-5 list-disc text-slate-700">
                {evaluation.matchedReasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Unmet Rules */}
            {evaluation.unmetCriteria.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <span className="font-bold text-red-700 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                  <XCircle className="w-4 h-4 text-red-600" />
                  Unmet Conditions (Reason for Ineligibility):
                </span>
                <ul className="space-y-1.5 pl-5 list-disc text-red-700 font-medium">
                  {evaluation.unmetCriteria.map((u, i) => (
                    <li key={i}>{u}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Caveats */}
            {evaluation.caveats.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <span className="font-bold text-saffron-800 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                  <AlertTriangle className="w-4 h-4 text-saffron-600" />
                  Important Verification Caveats:
                </span>
                <ul className="space-y-1.5 pl-5 list-disc text-slate-700">
                  {evaluation.caveats.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
            <Link href={`/schemes/${selectedScheme.id}`}>
              <Button variant="secondary" size="sm">
                View Official Scheme Dossier
              </Button>
            </Link>
            <Link href={`/partners?scheme=${selectedScheme.code}`}>
              <Button variant="emerald" size="sm" icon={<MapPin className="w-3.5 h-3.5" />}>
                Locate Accredited Channel Partner
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

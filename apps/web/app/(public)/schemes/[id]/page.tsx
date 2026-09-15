'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Calculator, 
  MapPin, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  ShieldCheck, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n/context';
import { useAuth } from '../../../../lib/store/auth';
import { SEEDED_SCHEMES } from '../../../../lib/data';
import { formatINR } from '../../../../lib/engines/calculator';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { DataFreshnessIndicator } from '../../../../components/ui/DataFreshnessIndicator';

export default function SchemeDetailPage() {
  const params = useParams();
  const schemeId = params?.id as string;
  const { t } = useLanguage();
  const { isSchemeSaved, toggleSaveScheme } = useAuth();

  const scheme = SEEDED_SCHEMES.find((s) => s.id === schemeId);

  if (!scheme) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-navy-900 mb-2">Scheme Not Found</h1>
          <p className="text-sm text-slate-600 mb-6">
            The requested scheme could not be found or may have been updated.
          </p>
          <Link href="/schemes">
            <Button variant="primary">Browse All Schemes</Button>
          </Link>
        </div>
      </div>
    );
  }

  const saved = isSchemeSaved(scheme.id);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/schemes" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-royal-600">
            <ArrowLeft className="w-4 h-4" /> Back to Schemes
          </Link>
          <DataFreshnessIndicator 
            status={scheme.verificationStatus} 
            lastVerified={scheme.lastVerified}
            source={scheme.source}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="royal">{scheme.category.replace('_', ' ').toUpperCase()}</Badge>
                <Badge variant="emerald" className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Official Scheme
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">{scheme.name}</h1>
              <p className="text-slate-600 mt-1">{scheme.tagline}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleSaveScheme(scheme.id)}
                className="gap-1.5"
              >
                {saved ? <BookmarkCheck className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
                {saved ? 'Saved' : 'Save Scheme'}
              </Button>
              <Link href={`/calculator?scheme=${scheme.id}`}>
                <Button variant="primary" size="sm" className="gap-1.5">
                  <Calculator className="w-4 h-4" /> Calculate EMI
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100 bg-slate-50/50 rounded-xl px-4 mt-6">
            <div>
              <span className="text-xs text-slate-500 block mb-1">Max Loan Amount</span>
              <span className="text-lg font-bold text-navy-900">{formatINR(scheme.maxLoanAmount)}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block mb-1">Interest Rate</span>
              <span className="text-lg font-bold text-royal-600">{scheme.interestRateMin}% - {scheme.interestRateMax}%</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block mb-1">Tenure</span>
              <span className="text-lg font-bold text-navy-900">{scheme.tenureMinMonths} - {scheme.tenureMaxMonths} mos</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block mb-1">Moratorium</span>
              <span className="text-lg font-bold text-emerald-600">
                {scheme.moratoriumMaxMonths > 0 ? `${scheme.moratoriumMaxMonths} mos` : 'Nil'}
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-navy-900 mb-3">About the Scheme</h2>
              <p className="text-slate-700 leading-relaxed">{scheme.description}</p>
              {scheme.objective && (
                <p className="text-sm text-slate-600 mt-2 italic bg-slate-50 p-3 rounded-lg border-l-4 border-royal-500">
                  Objective: {scheme.objective}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/70">
                <h3 className="font-semibold text-navy-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Eligibility Criteria
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>Target Groups: <strong>{scheme.targetBeneficiaries?.join(', ') || scheme.targetGroup}</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>Annual Income Ceiling: <strong>{scheme.maxAnnualIncome > 0 ? formatINR(scheme.maxAnnualIncome) : 'No ceiling specified'}</strong></span>
                  </li>
                  {scheme.femaleInterestConcession && (
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>Special Concession: <strong>{scheme.femaleInterestConcession}% rebate for women beneficiaries</strong></span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/70">
                <h3 className="font-semibold text-navy-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-royal-600" /> Required Documents
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  {scheme.requiredDocuments?.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-royal-500 mt-1.5 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-royal-50/50 rounded-xl p-6 border border-royal-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-royal-950 text-base">Official Application Route</h3>
                  <p className="text-xs text-royal-800 mt-1 max-w-2xl leading-relaxed">
                    Under statutory guidelines, beneficiaries do not submit loan applications directly to NSFDC corporate headquarters. Applications are formally received and processed through accredited State Channelising Agencies (SCAs), Public Sector Banks, and Regional Rural Banks in your state.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {scheme.sourceUrl && (
                    <a href={scheme.sourceUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        View Official NSFDC Source
                      </Button>
                    </a>
                  )}
                  <Link href={`/eligibility?scheme=${scheme.id}&amount=${scheme.maxLoanAmount}`}>
                    <Button variant="outline" size="sm">Check Match</Button>
                  </Link>
                  <Link href={`/partners?scheme=${scheme.code}&category=${scheme.category}`}>
                    <Button variant="primary" size="sm" className="gap-1.5">
                      <MapPin className="w-4 h-4" /> Locate Channel Partner
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

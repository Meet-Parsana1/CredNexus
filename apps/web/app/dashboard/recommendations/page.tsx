'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2, Calculator, MapPin } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { formatINR } from '../../../lib/engines/calculator';

export default function RecommendationsHistoryPage() {
  const mockHistory = [
    {
      date: '2026-03-10',
      purpose: 'Microfinance / Retail Artisan Trade',
      projectCost: 120000,
      annualIncome: 300000,
      bestMatch: 'NBCFDC Micro Finance Scheme',
      score: 92,
      schemeId: 'sch_nbcfdc_micro',
      schemeCode: 'NBCFDC-MFS-01',
      rate: '6.5%',
    },
    {
      date: '2026-02-18',
      purpose: 'Small Business Equipment / Working Capital',
      projectCost: 450000,
      annualIncome: 350000,
      bestMatch: 'Pradhan Mantri MUDRA Yojana (Kishore)',
      score: 88,
      schemeId: 'sch_pmmy_kishore',
      schemeCode: 'PMMY-KISHORE-04',
      rate: '8.5% - 10.5%',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-display font-extrabold text-navy-800">
            Recommendation History
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Previous requirement matching sessions and calculated loan recommendations.
          </p>
        </div>
        <Link href="/recommend">
          <Button variant="primary" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
            Run New Match
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {mockHistory.map((item, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-slate-400 font-medium">Session Date: {item.date}</span>
              <Badge variant="emerald" size="sm">{item.score}% Match Score</Badge>
            </div>

            <div className="space-y-1 text-xs">
              <h3 className="font-bold text-base text-navy-800">{item.bestMatch}</h3>
              <p className="text-slate-600">Requirement: {item.purpose}</p>
              <div className="flex gap-4 text-slate-700 font-tabular pt-1">
                <span>Capital: <strong>{formatINR(item.projectCost)}</strong></span>
                <span>Family Income: <strong>{formatINR(item.annualIncome)}</strong></span>
                <span>Indicative Rate: <strong>{item.rate}</strong></span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-200">
              <Link href={`/schemes/${item.schemeId}`} className="text-xs font-bold text-royal-600 hover:underline">
                View Scheme Rules &rarr;
              </Link>
              <div className="flex items-center gap-2">
                <Link href={`/calculator?amount=${item.projectCost}&rate=6.5&tenure=36&moratorium=3`}>
                  <Button variant="ghost" size="sm" icon={<Calculator className="w-3.5 h-3.5 text-royal-600" />}>
                    EMI
                  </Button>
                </Link>
                <Link href={`/partners?scheme=${item.schemeCode}`}>
                  <Button variant="emerald" size="sm" icon={<MapPin className="w-3.5 h-3.5" />}>
                    Find Partner
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

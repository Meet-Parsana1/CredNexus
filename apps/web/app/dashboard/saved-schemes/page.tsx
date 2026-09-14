'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, Trash2, ArrowRight, Calculator, MapPin } from 'lucide-react';
import { useAuth } from '../../../lib/store/auth';
import { SEEDED_SCHEMES } from '../../../lib/data';
import { formatINR } from '../../../lib/engines/calculator';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { DataFreshnessIndicator } from '../../../components/ui/DataFreshnessIndicator';

export default function SavedSchemesPage() {
  const { user, toggleSaveScheme } = useAuth();

  const savedSchemes = SEEDED_SCHEMES.filter((s) => user?.savedSchemeIds?.includes(s.id));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-display font-extrabold text-navy-800">
            Saved &amp; Shortlisted Schemes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare terms, calculate repayment, or proceed to channel partner applications.
          </p>
        </div>
        <Badge variant="royal" size="sm">{savedSchemes.length} Saved</Badge>
      </div>

      {savedSchemes.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-sm text-navy-800">No Schemes Saved Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse our verified scheme catalog and click "Save Scheme" on any item you wish to compare.
          </p>
          <Link href="/schemes">
            <Button variant="primary" size="sm">
              Explore Scheme Catalog
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {savedSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="navy" size="sm">{scheme.category.toUpperCase()}</Badge>
                  <DataFreshnessIndicator status={scheme.verificationStatus} compact />
                </div>
                <h3 className="font-bold text-base text-navy-800">
                  {scheme.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-1">
                  {scheme.tagline}
                </p>
                <div className="flex flex-wrap gap-4 text-xs font-tabular pt-1 text-slate-700">
                  <span>Max Limit: <strong>{formatINR(scheme.maxLoanAmount)}</strong></span>
                  <span>Interest: <strong>{scheme.interestRateMin}% - {scheme.interestRateMax}%</strong></span>
                  <span>Moratorium: <strong>{scheme.moratoriumMaxMonths} Mo</strong></span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <Link href={`/schemes/${scheme.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
                <Link href={`/calculator?amount=${scheme.maxLoanAmount}&rate=${scheme.interestRateMin}&tenure=${scheme.tenureMaxMonths}&moratorium=${scheme.moratoriumMaxMonths}`}>
                  <Button variant="ghost" size="sm" icon={<Calculator className="w-3.5 h-3.5 text-royal-600" />}>
                    EMI
                  </Button>
                </Link>
                <Link href={`/partners?scheme=${scheme.code}`}>
                  <Button variant="emerald" size="sm" icon={<MapPin className="w-3.5 h-3.5" />}>
                    Partner
                  </Button>
                </Link>
                <button
                  onClick={() => toggleSaveScheme(scheme.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="Remove saved scheme"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

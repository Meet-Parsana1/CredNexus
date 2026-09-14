import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator, MapPin, Bookmark, BookmarkCheck } from 'lucide-react';
import { Scheme } from '../../lib/types';
import { formatINR } from '../../lib/engines/calculator';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { DataFreshnessIndicator } from '../ui/DataFreshnessIndicator';

interface SchemeCardProps {
  scheme: Scheme;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  isSaved = false,
  onToggleSave,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
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
          {onToggleSave && (
            <button
              onClick={() => onToggleSave(scheme.id)}
              className="text-slate-400 hover:text-navy-800 transition-colors p-1"
              aria-label="Save scheme"
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-emerald-600" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        <div>
          <h3 className="font-display font-bold text-base text-navy-800">
            {scheme.name}
          </h3>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {scheme.tagline}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Maximum Limit
            </span>
            <span className="font-extrabold text-navy-800 font-tabular text-sm">
              {formatINR(scheme.maxLoanAmount)}
            </span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Concessional Rate
            </span>
            <span className="font-extrabold text-royal-600 font-tabular text-sm">
              {scheme.interestRateMin}% - {scheme.interestRateMax}%
            </span>
          </div>
        </div>

        <div className="space-y-1 text-xs text-slate-500 pt-1">
          <div className="flex justify-between">
            <span>Moratorium Grace:</span>
            <span className="font-semibold text-slate-700">{scheme.moratoriumMaxMonths} Months</span>
          </div>
          <div className="flex justify-between">
            <span>Family Income Cap:</span>
            <span className="font-semibold text-slate-700">
              {scheme.maxAnnualIncome > 0 ? formatINR(scheme.maxAnnualIncome) : 'No Ceiling'}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <DataFreshnessIndicator status={scheme.verificationStatus} lastVerified={scheme.lastVerified} compact />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link href={`/schemes/${scheme.id}`} className="text-xs font-bold text-royal-600 hover:text-royal-700 inline-flex items-center gap-1">
          Details &bull; Criteria <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <div className="flex items-center gap-1.5">
          <Link href={`/calculator?amount=${scheme.maxLoanAmount}&rate=${scheme.interestRateMin}&tenure=${scheme.tenureMaxMonths}&moratorium=${scheme.moratoriumMaxMonths}`}>
            <Button variant="ghost" size="sm" icon={<Calculator className="w-3 h-3 text-royal-600" />}>
              EMI
            </Button>
          </Link>
          <Link href={`/partners?scheme=${scheme.code}`}>
            <Button variant="outline" size="sm" icon={<MapPin className="w-3 h-3 text-navy-800" />}>
              Partner
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

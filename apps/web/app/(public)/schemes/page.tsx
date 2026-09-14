'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Calculator, 
  MapPin, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../../lib/i18n/context';
import { useAuth } from '../../../lib/store/auth';
import { SEEDED_SCHEMES } from '../../../lib/data';
import { formatINR } from '../../../lib/engines/calculator';
import { SchemeCategory } from '../../../lib/types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { DataFreshnessIndicator } from '../../../components/ui/DataFreshnessIndicator';

export default function SchemesPage() {
  const { t } = useLanguage();
  const { isSchemeSaved, toggleSaveScheme } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxLoanFilter, setMaxLoanFilter] = useState<number>(5000000);
  const [sortBy, setSortBy] = useState<'recommended' | 'amount_asc' | 'amount_desc' | 'interest_asc'>('recommended');

  const categories = [
    { id: 'All', label: 'All Schemes' },
    { id: 'microfinance', label: 'Microfinance (≤ ₹1.4L)' },
    { id: 'term_loan', label: 'Term Loans (≤ ₹50L)' },
    { id: 'education', label: 'Education Loans' },
    { id: 'business', label: 'Mudra / Business' },
    { id: 'green_sanitation', label: 'Green & Sanitation' },
  ];

  const filteredSchemes = useMemo(() => {
    let list = SEEDED_SCHEMES.filter((sch) => {
      const matchesCategory = selectedCategory === 'All' || sch.category === selectedCategory;
      const matchesSearch =
        !searchTerm.trim() ||
        sch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sch.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sch.eligibleActivities.some((act) => act.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesAmount = sch.minLoanAmount <= maxLoanFilter;

      return matchesCategory && matchesSearch && matchesAmount;
    });

    if (sortBy === 'amount_asc') list.sort((a, b) => a.maxLoanAmount - b.maxLoanAmount);
    if (sortBy === 'amount_desc') list.sort((a, b) => b.maxLoanAmount - a.maxLoanAmount);
    if (sortBy === 'interest_asc') list.sort((a, b) => a.interestRateMin - b.interestRateMin);

    return list;
  }, [searchTerm, selectedCategory, maxLoanFilter, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-royal-50 text-royal-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-royal-600" />
            <span>Official Government Apex Corporations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-navy-800">
            Concessional Credit Schemes Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Explore verified government credit initiatives with statutory interest rate limits, moratorium durations, and authorized Channel Partner desks.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative sm:col-span-2">
              <Search className="absolute start-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search scheme name, artisan trade, or keywords..."
                className="w-full text-xs ps-9 pe-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-royal-500"
              />
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none font-medium text-slate-700"
              >
                <option value="recommended">Sort by: Recommended</option>
                <option value="interest_asc">Lowest Interest Rate</option>
                <option value="amount_asc">Loan Limit: Low to High</option>
                <option value="amount_desc">Loan Limit: High to Low</option>
              </select>
            </div>

            {/* Quick Recommender CTA */}
            <div>
              <Link href="/recommend" className="block w-full">
                <Button variant="primary" size="md" className="w-full text-xs">
                  Match for My Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-navy-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => {
            const isSaved = isSchemeSaved(scheme.id);
            return (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between"
              >
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
                    <button
                      onClick={() => toggleSaveScheme(scheme.id)}
                      className="text-slate-400 hover:text-navy-800 transition-colors p-1"
                      aria-label="Save scheme"
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base text-navy-800">
                      {scheme.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {scheme.tagline}
                    </p>
                  </div>

                  {/* Financial Stats Grid */}
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

                {/* Card Footer Actions */}
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
          })}
        </div>
      </div>
    </div>
  );
}

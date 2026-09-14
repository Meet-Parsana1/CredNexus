'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Bookmark, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Calculator, 
  MapPin,
  Clock,
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../lib/store/auth';
import { SEEDED_SCHEMES, SEEDED_PARTNERS } from '../../lib/data';
import { formatINR } from '../../lib/engines/calculator';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function DashboardOverviewPage() {
  const { user, applications } = useAuth();

  const savedCount = user?.savedSchemeIds?.length || 0;
  const savedSchemes = SEEDED_SCHEMES.filter((s) => user?.savedSchemeIds?.includes(s.id));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-navy-800">
              Welcome back, {user?.name || 'Ramesh Patel'}
            </h1>
            <Badge variant="emerald" size="sm">OBC Verified</Badge>
          </div>
          <p className="text-xs text-slate-500">
            Profile registered in {user?.district || 'Ahmedabad'}, {user?.state || 'Gujarat'}. Target family income: {formatINR(user?.annualIncome || 380000)} / yr.
          </p>
        </div>

        <Link href="/recommend">
          <Button variant="primary" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
            New Scheme Match
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Saved Schemes</span>
            <Bookmark className="w-4 h-4 text-royal-600" />
          </div>
          <div className="text-2xl font-extrabold text-navy-800 font-tabular">
            {savedCount}
          </div>
          <Link href="/dashboard/saved-schemes" className="text-[11px] text-royal-600 hover:underline font-semibold block">
            View shortlisted &rarr;
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Guided Applications</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-tabular">
            {applications.length}
          </div>
          <Link href="/dashboard/applications" className="text-[11px] text-emerald-700 hover:underline font-semibold block">
            Check partner routing &rarr;
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Max Pre-Eligible Limit</span>
            <ShieldCheck className="w-4 h-4 text-saffron-600" />
          </div>
          <div className="text-2xl font-extrabold text-navy-800 font-tabular">
            ₹50 Lakh
          </div>
          <span className="text-[11px] text-slate-400 block">
            Under Term Loan &amp; PMMY
          </span>
        </div>
      </div>

      {/* Active Guided Application Card */}
      {applications.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-navy-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-royal-600" />
              Active Partner Guidance Dossier
            </h3>
            <Badge variant="emerald" size="sm">
              GUIDED TO PARTNER
            </Badge>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Target Scheme:</span>
              <span className="font-bold text-navy-800">{applications[0].schemeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Assigned Branch:</span>
              <span className="font-bold text-slate-700">{applications[0].partnerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Projected Capital:</span>
              <span className="font-bold text-emerald-700 font-tabular">{formatINR(applications[0].projectAmount)}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
            {applications[0].statusNotes}
          </div>
        </div>
      )}

      {/* Shortlisted Schemes Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-sm text-navy-800">
            Shortlisted Schemes ({savedSchemes.length})
          </h3>
          <Link href="/dashboard/saved-schemes" className="text-xs font-semibold text-royal-600 hover:underline">
            Manage All
          </Link>
        </div>

        {savedSchemes.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            You haven't saved any schemes yet. Browse the scheme directory to save items.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedSchemes.map((s) => (
              <div key={s.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                <Badge variant="navy" size="sm">{s.category.toUpperCase()}</Badge>
                <h4 className="font-bold text-xs text-navy-800">{s.name}</h4>
                <div className="flex justify-between text-xs text-slate-600 pt-1 font-tabular">
                  <span>Limit: {formatINR(s.maxLoanAmount)}</span>
                  <span>Rate: {s.interestRateMin}%</span>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                  <Link href={`/schemes/${s.id}`} className="text-[11px] font-bold text-royal-600 hover:underline">
                    View Details
                  </Link>
                  <Link href={`/calculator?amount=${s.maxLoanAmount}&rate=${s.interestRateMin}&tenure=${s.tenureMaxMonths}&moratorium=${s.moratoriumMaxMonths}`}>
                    <span className="text-[11px] text-slate-500 hover:text-navy-800">Calc EMI</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

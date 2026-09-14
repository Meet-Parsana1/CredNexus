'use client';

import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Calculator, 
  MapPin, 
  FileText, 
  Globe2, 
  Award,
  ShieldCheck 
} from 'lucide-react';
import { useLanguage } from '../../../lib/i18n/context';
import { formatINR } from '../../../lib/engines/calculator';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { DataFreshnessIndicator } from '../../../components/ui/DataFreshnessIndicator';

export default function EducationPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-3xl p-8 sm:p-12 text-white shadow-elevated relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <GraduationCap className="w-4 h-4" />
              <span>Concessional Educational Financing</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
              Higher Studies in India &amp; Abroad without Debt Anxiety
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Empowering students from marginalized and backward communities to pursue technical, professional, and postgraduate degrees at concessional 4.0% - 4.5% interest rates with moratorium covering course duration + 1 year.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/schemes/sch_nbcfdc_edu">
                <Button variant="emerald" size="md">
                  View Education Loan Scheme
                </Button>
              </Link>
              <Link href="/calculator?amount=1500000&rate=4.0&tenure=120&moratorium=12">
                <Button variant="outline" size="md" className="bg-transparent text-white border-slate-600 hover:bg-navy-700">
                  Estimate Repayment
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Comparison: Domestic vs Abroad Studies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Studies in India */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-royal-600">
                Domestic Higher Studies
              </span>
              <Badge variant="royal" size="sm">Up to ₹15,00,000</Badge>
            </div>
            <h3 className="font-display font-bold text-xl text-navy-800">
              Professional &amp; Technical Courses in India
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Covers approved degree programs including B.Tech/B.E., MBBS, MBA, MCA, M.Tech, Law, and recognized doctoral research at UGC/AICTE/MCI accredited institutions.
            </p>
            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Interest Rate:</span>
                <span className="font-bold text-royal-700">4.5% p.a. (4.0% for female students)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Moratorium Duration:</span>
                <span className="font-bold text-navy-800">Course duration + 6 to 12 months</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Repayment Window:</span>
                <span className="font-bold text-navy-800">Up to 10 years after moratorium</span>
              </div>
            </div>
          </div>

          {/* Studies Abroad */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                Overseas Higher Education
              </span>
              <Badge variant="emerald" size="sm">Up to ₹20,00,000</Badge>
            </div>
            <h3 className="font-display font-bold text-xl text-navy-800">
              Master's &amp; Doctorate at Top Global Universities
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides assistance towards international tuition fees, hostel boarding, equipment, laptop, and mandatory student health insurance for STEM and management degrees.
            </p>
            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Interest Rate:</span>
                <span className="font-bold text-emerald-700">4.5% p.a. (4.0% for female students)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Moratorium Duration:</span>
                <span className="font-bold text-navy-800">Course duration + 1 year after getting job</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Repayment Window:</span>
                <span className="font-bold text-navy-800">Up to 10 years after moratorium</span>
              </div>
            </div>
          </div>
        </div>

        {/* Documentation & Channel Partner Routing */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-navy-800">
              Checklist for Education Loan Application
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Prepare these verified documents before meeting your State Channelising Agency or Public Sector Bank Lead Branch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-navy-800">
                <FileText className="w-4 h-4 text-royal-600" />
                Admission &amp; Fee Proof
              </div>
              <p className="text-slate-500">Official offer letter and certified semester fee schedule from institution.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-navy-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Community &amp; Income Proof
              </div>
              <p className="text-slate-500">Competent revenue authority certificate proving annual family income &le; ₹5,00,000.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-navy-800">
                <BookOpen className="w-4 h-4 text-royal-600" />
                Academic Transcripts
              </div>
              <p className="text-slate-500">10th, 12th, or undergraduate degree mark sheets demonstrating qualifying merit.</p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <Link href="/partners?category=education">
              <Button variant="primary" size="md" icon={<MapPin className="w-4 h-4" />}>
                Locate Education Loan Channel Partners
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

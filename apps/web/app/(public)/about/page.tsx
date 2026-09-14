'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, Users, Target, Globe2, Award, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <Badge variant="royal" size="md">Team Brainwired &bull; SIH 2026</Badge>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800">
            About CredNexus
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Intelligent digital bridge connecting marginalized entrepreneurs and students to government concessional credit schemes and authorized Channel Partners.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card space-y-4">
          <h2 className="font-display font-bold text-xl text-navy-800">
            The Problem We Solve
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            In India, national apex corporations like NBCFDC, NSFDC, and NSKFDC provide subsidized loans at interest rates as low as 4% to 8% to uplift backward classes, sanitation workers, and small traders. However, beneficiaries struggle to identify which scheme fits their requirements, distinguish micro-credit from term loans, understand grace moratoriums, or find which local agency has active funding.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>CredNexus</strong> replaces this fragmented offline maze with an intuitive, 12-language digital platform featuring deterministic rules matching, mathematical EMI/moratorium calculations, and geo-spatial Channel Partner routing.
          </p>
        </div>

        {/* 3 Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-navy-800">No Hallucinated Data</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every scheme parameter, interest rate, and income ceiling is strictly anchored to official corporation guidelines.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-royal-50 text-royal-600 flex items-center justify-center font-bold">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-navy-800">12 Indian Languages</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              True digital inclusion with localized interfaces, regional scripts, and native Bidirectional RTL support for Urdu.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-navy-800">Auditable Scoring</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Match scores are generated deterministically across purpose, capital requirements, income ceilings, and borrower profiles.
            </p>
          </div>
        </div>

        {/* SIH Note */}
        <div className="bg-navy-900 text-white rounded-2xl p-8 border border-navy-800 text-center space-y-4 shadow-elevated">
          <h3 className="font-display font-bold text-xl text-white">
            Created for Smart India Hackathon 2026
          </h3>
          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            Proudly designed and engineered by <strong>Team Brainwired</strong> adhering strictly to modern fintech UI/UX principles, WCAG accessibility, and data integrity standards.
          </p>
          <div className="pt-2">
            <Link href="/schemes">
              <Button variant="emerald" size="md">
                Explore Scheme Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Search, 
  Calculator, 
  MapPin, 
  CheckCircle2, 
  BookmarkCheck, 
  ArrowRight 
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function HowItWorksPage() {
  const steps = [
    {
      step: '1',
      title: 'Tell Us Your Need',
      desc: 'Enter your project scope (micro-enterprise, term loan, or higher education) and annual income in the guided wizard.',
      icon: Search,
    },
    {
      step: '2',
      title: 'Get Matched Reliably',
      desc: 'Our deterministic multi-dimensional rules engine evaluates your project against statutory criteria and returns clear match scores.',
      icon: Sparkles,
    },
    {
      step: '3',
      title: 'Understand Eligibility',
      desc: 'Review transparent reasons why a scheme fits, any unmet conditions, and required documentary certifications.',
      icon: CheckCircle2,
    },
    {
      step: '4',
      title: 'Estimate Repayment & Grace',
      desc: 'Calculate precise monthly installments with principal grace moratoriums modeled through reducing balance equations.',
      icon: Calculator,
    },
    {
      step: '5',
      title: 'Locate the Right Partner',
      desc: 'CredNexus routes you to authorized State Channelising Agencies (SCAs) or Public Sector Banks with active disbursement capacity.',
      icon: MapPin,
    },
    {
      step: '6',
      title: 'Save & Track in Dashboard',
      desc: 'Persist your shortlisted schemes, recommendation dossiers, and guided application states directly in your user dashboard.',
      icon: BookmarkCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-royal-600">
            Platform Workflow
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800">
            How CredNexus Works
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            From confusion to confidence in six simple, transparent, and verifiable steps.
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((s, index) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-card transition-all flex flex-col sm:flex-row items-start sm:items-center gap-5"
              >
                <div className="w-12 h-12 rounded-2xl bg-royal-50 text-royal-700 flex items-center justify-center font-display font-extrabold text-lg flex-shrink-0">
                  {s.step}
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-display font-bold text-base text-navy-800">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                <div className="hidden sm:flex w-10 h-10 rounded-xl bg-slate-50 text-slate-500 items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-royal-600" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <Link href="/recommend">
            <Button variant="primary" size="lg" icon={<Sparkles className="w-4 h-4" />}>
              Try Scheme Matcher Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

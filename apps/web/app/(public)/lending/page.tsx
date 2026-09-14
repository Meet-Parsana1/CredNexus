'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Compass, 
  CheckCircle2, 
  FileText, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Info,
  ShieldAlert,
  Building2 
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function LendingGuidePage() {
  const steps = [
    {
      num: '01',
      title: 'Scheme Discovery & Alignment',
      desc: 'Beneficiaries distinguish between tiny microfinance (up to ₹1.40L for street trades) and substantial term loans (up to ₹50L for manufacturing) to match their real project cost.',
      icon: Compass,
    },
    {
      num: '02',
      title: 'Eligibility & Income Verification',
      desc: 'Evaluate statutory income ceilings (e.g. ₹3 Lakh for Microfinance or ₹5 Lakh for Term/Education schemes) and target community classifications before proceeding.',
      icon: CheckCircle2,
    },
    {
      num: '03',
      title: 'Repayment & Moratorium Modeling',
      desc: 'Understand the difference between repayment during grace periods and standard installments. CredNexus calculates your reducing-balance EMI in advance.',
      icon: Clock,
    },
    {
      num: '04',
      title: 'Dossier Preparation',
      desc: 'Gather required identity documents, income certificates from Tehsildar/Revenue officers, project reports/machinery quotations, and caste/community certificates.',
      icon: FileText,
    },
    {
      num: '05',
      title: 'Routing to Authorized Channel Partner',
      desc: 'Locate accredited State Channelising Agencies (SCAs), Public Sector Banks (PSBs), or Regional Rural Banks (RRBs) authorized to process your loan category.',
      icon: MapPin,
    },
    {
      num: '06',
      title: 'Physical Submission & Sanction Guidance',
      desc: 'Submit your prepared dossier directly at the partner branch. Track your internal guidance status within your CredNexus dashboard.',
      icon: Building2,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-royal-600">
            End-to-End Beneficiary Journey
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800">
            The Concessional Lending Process Explained
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            A clear step-by-step roadmap to transition from fragmented offline confusion to successful institutional loan sanction.
          </p>
        </div>

        {/* Regulatory Disclosure Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-3.5 text-xs text-slate-700">
          <Info className="w-5 h-5 text-royal-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-navy-800 block">
              Important Financial Disclosure:
            </span>
            <p className="leading-relaxed">
              CredNexus is an intelligent matching, discovery, and channel-partner routing digital layer. CredNexus <strong>does not sanction, disburse, or directly lend funds</strong>. All concessional funds are sanctioned and disbursed by authorized Channel Partners (State Channelising Agencies, Public Sector Banks, and Regional Rural Banks) under official Government guidelines.
            </p>
          </div>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-display font-extrabold text-royal-600 font-tabular">
                      {s.num}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-royal-50 text-royal-600 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-base text-navy-800">
                    {s.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-4">
          <h3 className="font-display font-bold text-xl text-navy-800">
            Start Your Journey Today
          </h3>
          <p className="text-xs text-slate-600 max-w-lg mx-auto">
            Experience our 12-language rule matcher and find your eligible channel partner within minutes.
          </p>
          <div className="flex justify-center items-center gap-3 pt-2">
            <Link href="/recommend">
              <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                Find My Scheme
              </Button>
            </Link>
            <Link href="/partners">
              <Button variant="outline" size="md">
                Locate Nearby Partner
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

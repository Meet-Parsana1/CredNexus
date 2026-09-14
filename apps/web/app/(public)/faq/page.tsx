'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does CredNexus directly sanction or disburse loans?',
      a: 'No. CredNexus is an intelligent access, eligibility-matching, and channel-partner discovery platform. All loan applications are evaluated, sanctioned, and disbursed by authorized Channel Partners (State Channelising Agencies, Public Sector Banks, and Regional Rural Banks) under official government apex guidelines.',
    },
    {
      q: 'What is the difference between Micro Finance and General Term Loans under NBCFDC?',
      a: 'The Micro Finance Scheme is targeted at tiny businesses, artisans, and street traders with funding requirements up to ₹1,40,000, concessional interest rates around 6.5%, and an annual family income ceiling of ₹3,00,000. The General Term Loan Scheme supports larger enterprise projects up to ₹50,00,000 with a higher income ceiling of ₹5,00,000 and longer repayment tenures up to 7 years.',
    },
    {
      q: 'How does the Moratorium Grace Period work?',
      a: 'During the moratorium (grace) period (typically 3 to 12 months depending on the scheme), principal repayment is deferred so borrowers can establish their enterprise or complete their studies. Simple interest is charged during this period without penalty, and regular equated monthly installments (EMIs) begin only once the moratorium expires.',
    },
    {
      q: 'Are female applicants eligible for special interest rebates?',
      a: 'Yes. Most NBCFDC concessional schemes, including the Micro Finance Scheme and Education Loan Scheme, provide a special 0.5% interest rate rebate for female borrowers or students.',
    },
    {
      q: 'How does the Geo-Spatial Channel Partner Router decide which branch to recommend?',
      a: 'The router uses a multi-factor ranking algorithm that considers: (1) geographic distance from your location, (2) scheme accreditation (whether the partner is authorized to process your specific loan), (3) operational status, and (4) historical fund utilization and low NPA risk ratings.',
    },
    {
      q: 'Which 12 languages are supported on CredNexus?',
      a: 'The platform supports English, Hindi, Gujarati, Marathi, Bengali, Urdu (with full native Bidirectional RTL layout), Telugu, Tamil, Kannada, Malayalam, Punjabi, and Odia.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-royal-600">
            Frequently Asked Questions
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800">
            Clear Answers to Common Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Everything you need to know about concessional credit schemes, eligibility rules, and authorized Channel Partners.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute start-4 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search FAQs (e.g., moratorium, income limit, partner)..."
            className="w-full text-xs ps-11 pe-4 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-500"
          />
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-start flex items-center justify-between gap-4 font-bold text-sm text-navy-800 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-royal-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

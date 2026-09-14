import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, ExternalLink, Globe2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900 text-slate-300 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="light" />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              CredNexus is an intelligent, multilingual digital platform built by <strong>Team Brainwired</strong> for <strong>Smart India Hackathon (SIH) 2026</strong>. Dedicated to empowering marginalized entrepreneurs, artisans, and students through verified concessional credit schemes.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded-xl px-3 py-2 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Strict Data Integrity &bull; Official Scheme Records</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Core Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/recommend" className="text-slate-400 hover:text-white transition-colors">
                  Scheme Recommender
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="text-slate-400 hover:text-white transition-colors">
                  Explore All Schemes
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-slate-400 hover:text-white transition-colors">
                  EMI & Moratorium Calculator
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-slate-400 hover:text-white transition-colors">
                  Geo-Spatial Partner Locator
                </Link>
              </li>
              <li>
                <Link href="/eligibility" className="text-slate-400 hover:text-white transition-colors">
                  Eligibility Checker
                </Link>
              </li>
            </ul>
          </div>

          {/* Sectors */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Specialized Focus
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/schemes?category=microfinance" className="text-slate-400 hover:text-white transition-colors">
                  Micro Finance (&le; ₹1.4L)
                </Link>
              </li>
              <li>
                <Link href="/schemes?category=term_loan" className="text-slate-400 hover:text-white transition-colors">
                  Term Loans (&le; ₹50L)
                </Link>
              </li>
              <li>
                <Link href="/education" className="text-slate-400 hover:text-white transition-colors">
                  Education Loans (India/Abroad)
                </Link>
              </li>
              <li>
                <Link href="/lending" className="text-slate-400 hover:text-white transition-colors">
                  End-to-End Lending Journey
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-slate-400 hover:text-white transition-colors">
                  How CredNexus Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Portal & System */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Transparency & Data
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
                  About Brainwired & Mission
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-400 hover:text-white transition-colors">
                  FAQ & Support
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-400 hover:text-white transition-colors">
                  Admin Management
                </Link>
              </li>
              <li>
                <a
                  href="https://www.nbcfdc.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  NBCFDC Official Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} CredNexus &bull; Built for SIH 2026 by Team Brainwired.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5 text-royal-400" />
              12 Scheduled Languages Supported
            </span>
            <span>&bull;</span>
            <span>Independent Academic SIH Prototype</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

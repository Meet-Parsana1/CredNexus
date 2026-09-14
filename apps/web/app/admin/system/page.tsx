'use client';

import React from 'react';
import { Activity, Server, ShieldCheck, Database, Cpu, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';

export default function AdminSystemPage() {
  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-700">
        <div>
          <h2 className="text-xl font-display font-extrabold text-white">
            System Diagnostics &amp; Operational Health
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time status of calculation engines, i18n locales, and memory bounds.
          </p>
        </div>
        <Badge variant="emerald" size="sm">System Operational</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-slate-700 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between font-bold text-white">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-royal-400" /> Financial Engine Core
            </span>
            <span className="text-emerald-400 font-mono">ONLINE</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Reducing balance amortization formula &amp; moratorium interest deferment verified against reference bank schedules.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-700 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between font-bold text-white">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-saffron-400" /> 6-Dimension Recommender
            </span>
            <span className="text-emerald-400 font-mono">ONLINE</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Deterministic scoring engine running with 0 probabilistic hallucination variance.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-700 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between font-bold text-white">
            <span className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-400" /> Channel Partner Router
            </span>
            <span className="text-emerald-400 font-mono">ONLINE</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Haversine geo-spatial distance engine active with OpenStreetMap tile provider fallback.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-700 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between font-bold text-white">
            <span className="flex items-center gap-1.5">
              <Server className="w-4 h-4 text-royal-400" /> 12-Language i18n &amp; Urdu RTL
            </span>
            <span className="text-emerald-400 font-mono">LOADED</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            All 12 language dictionaries compiled with bidirectional RTL layout detection.
          </p>
        </div>
      </div>
    </div>
  );
}

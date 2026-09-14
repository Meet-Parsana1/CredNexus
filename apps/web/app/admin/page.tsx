'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Building2, 
  Database, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  RefreshCw,
  ExternalLink 
} from 'lucide-react';
import { SEEDED_SCHEMES, SEEDED_PARTNERS } from '../../lib/data';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export default function AdminOverviewPage() {
  const verifiedSchemesCount = SEEDED_SCHEMES.filter(
    (s) => s.verificationStatus === 'VERIFIED'
  ).length;

  const activePartnersCount = SEEDED_PARTNERS.filter(
    (p) => p.operationalStatus === 'ACTIVE'
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white">
            System Administration &amp; Data Verification
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit trail, data freshness monitoring, and statutory scheme validation status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="emerald" size="sm">Pipeline Active</Badge>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Schemes</span>
            <Layers className="w-4 h-4 text-royal-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-tabular">
            {SEEDED_SCHEMES.length}
          </div>
          <span className="text-[11px] text-emerald-400 block font-medium">
            {verifiedSchemesCount} Officially Verified
          </span>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Channel Partners</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-tabular">
            {SEEDED_PARTNERS.length}
          </div>
          <span className="text-[11px] text-emerald-400 block font-medium">
            {activePartnersCount} Fully Operational
          </span>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Supported Languages</span>
            <Activity className="w-4 h-4 text-saffron-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-tabular">
            12
          </div>
          <span className="text-[11px] text-slate-400 block">
            With Urdu RTL Support
          </span>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Data Sync Health</span>
            <Database className="w-4 h-4 text-royal-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-tabular">
            100%
          </div>
          <span className="text-[11px] text-slate-400 block">
            0 Pipeline Failures
          </span>
        </div>
      </div>

      {/* Audit & Freshness Table */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700">
          <h3 className="font-bold text-sm text-white">
            Scheme Data Freshness &amp; Verification Registry
          </h3>
          <Link href="/admin/schemes" className="text-xs text-royal-400 hover:underline">
            Manage Registry &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700 font-semibold uppercase text-[10px]">
                <th className="p-3 text-start">Scheme Name</th>
                <th className="p-3 text-start">Category</th>
                <th className="p-3 text-start">Apex Source</th>
                <th className="p-3 text-start">Last Verified</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 text-slate-300">
              {SEEDED_SCHEMES.map((s) => (
                <tr key={s.id} className="hover:bg-slate-700/50">
                  <td className="p-3 font-semibold text-white">{s.name}</td>
                  <td className="p-3 uppercase text-[10px] text-slate-400">{s.category}</td>
                  <td className="p-3">{s.source}</td>
                  <td className="p-3 font-tabular">{s.lastVerified}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {s.verificationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

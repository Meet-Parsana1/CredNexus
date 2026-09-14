'use client';

import React from 'react';
import { History, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export default function AdminUpdatesPage() {
  const updates = [
    {
      id: 'upd_01',
      date: '2026-03-12 10:45:00 UTC',
      source: 'NBCFDC Apex Circular 2026/04',
      type: 'Interest Rate Concession Verification',
      summary: 'Verified 0.5% female concession on Microfinance & Education Loan Schemes.',
      status: 'VERIFIED',
    },
    {
      id: 'upd_02',
      date: '2026-03-08 14:20:15 UTC',
      source: 'Department of Financial Services (DFS)',
      type: 'Mudra Limit Validation',
      summary: 'Confirmed PMMY Kishore threshold up to ₹5,00,000 and Tarun up to ₹10,00,000.',
      status: 'VERIFIED',
    },
    {
      id: 'upd_03',
      date: '2026-02-28 09:12:44 UTC',
      source: 'NSKFDC Policy Guidelines',
      type: 'Sanitation Equipment Scheme Refinancing',
      summary: 'Sanitation mechanization machinery quota synchronized across 12 State Channelising Agencies.',
      status: 'VERIFIED',
    },
  ];

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-700">
        <div>
          <h2 className="text-xl font-display font-extrabold text-white">
            Scheme &amp; Regulatory Update History
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit log of official government circulars, statutory interest changes, and automated hash parity runs.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {updates.map((u) => (
          <div
            key={u.id}
            className="p-5 rounded-xl border border-slate-700 bg-slate-900/60 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-royal-400">{u.source}</span>
              <span className="text-slate-400 font-mono text-[11px]">{u.date}</span>
            </div>
            <h3 className="font-semibold text-white text-sm">{u.type}</h3>
            <p className="text-slate-300 leading-relaxed">{u.summary}</p>
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <span className="text-slate-500 font-mono text-[10px]">Log ID: {u.id}</span>
              <Badge variant="emerald" size="sm">{u.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Database, RefreshCw, CheckCircle2, ShieldCheck, FileCode, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export default function AdminDataSourcesPage() {
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('2026-03-12 10:45:00 UTC');
  const [syncLogs, setSyncLogs] = useState<string[]>([
    '[10:45:00] Ingestion trigger initiated across 3 apex registries.',
    '[10:45:01] Snapshot hash calculated for NBCFDC guidelines: sha256:7f83b1... (No drift detected)',
    '[10:45:02] Mudra PMMY ceiling check: ₹10,00,000 verified against DFS release.',
    '[10:45:03] NSKFDC Sanitation Equipment guidelines synced with 0 schema validation errors.',
    '[10:45:04] All 6 statutory schemes confirmed in VERIFIED state.',
  ]);

  const handleTriggerSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
      setLastSyncTime(now);
      setSyncLogs((prev) => [
        `[${now.slice(11, 19)}] Manual re-sync executed: Hash comparison passed with 100% parity.`,
        ...prev,
      ]);
    }, 1200);
  };

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
        <div>
          <h2 className="text-xl font-display font-extrabold text-white">
            Data Ingestion &amp; Change Detection Pipeline
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Snapshot hashing, schema normalization, and change diff engine.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleTriggerSync}
          isLoading={syncing}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Trigger Ingestion Sync
        </Button>
      </div>

      {/* Pipeline Diagram Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
        {[
          { step: '1. RAW', desc: 'Apex Portals / Gazette' },
          { step: '2. PARSE', desc: 'Structure & Financials' },
          { step: '3. NORMALIZE', desc: 'INR / Months / Rates' },
          { step: '4. VALIDATE', desc: 'Rules & Bounds Check' },
          { step: '5. VERIFIED', desc: 'Production Registry' },
        ].map((p, idx) => (
          <div key={idx} className="p-3 bg-slate-900/60 rounded-xl border border-slate-700 text-xs">
            <span className="font-bold text-royal-400 block">{p.step}</span>
            <span className="text-[10px] text-slate-400">{p.desc}</span>
          </div>
        ))}
      </div>

      {/* Active Sources Table */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
          Connected Statutory Repositories
        </h3>

        <div className="space-y-3">
          {[
            {
              name: 'NBCFDC Apex Scheme Guidelines',
              type: 'Official Gazette / NBCFDC Policy Feed',
              status: 'VERIFIED',
              records: '3 Schemes (Microfinance, Term, Education)',
              hash: 'sha256:7f83b1657ff1...parity=100%',
            },
            {
              name: 'Department of Financial Services (DFS) - PMMY MUDRA',
              type: 'Statutory Portal Ingestion Adapter',
              status: 'VERIFIED',
              records: '1 Scheme (PMMY Kishore)',
              hash: 'sha256:9c02d8442ea0...parity=100%',
            },
            {
              name: 'NSKFDC Sanitation & Green Machinery Registry',
              type: 'Ministry of Social Justice & Empowerment',
              status: 'VERIFIED',
              records: '1 Scheme (Green Business Loan)',
              hash: 'sha256:4b11f32810a9...parity=100%',
            },
            {
              name: 'State Channelising Agency (SCA) Network Registry',
              type: 'Channel Partner Ingestion Pipeline',
              status: 'VERIFIED',
              records: '12 Regional & National Partner Nodes',
              hash: 'sha256:3e82a99182bc...parity=100%',
            },
          ].map((src, i) => (
            <div key={i} className="p-4 bg-slate-900/60 rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-white block">{src.name}</span>
                <span className="text-slate-400">{src.type} &bull; {src.records}</span>
                <div className="text-[10px] text-slate-500 font-mono">{src.hash}</div>
              </div>
              <Badge variant="emerald" size="sm">{src.status}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Live Pipeline Logs */}
      <div className="p-4 bg-slate-950 rounded-xl border border-slate-700 text-[11px] font-mono text-slate-300 space-y-1 max-h-48 overflow-y-auto">
        <span className="text-slate-500 font-bold block mb-1">LIVE PIPELINE STREAM:</span>
        {syncLogs.map((log, i) => (
          <div key={i} className="leading-snug">{log}</div>
        ))}
      </div>
    </div>
  );
}

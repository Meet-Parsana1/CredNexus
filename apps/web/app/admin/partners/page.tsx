'use client';

import React, { useState } from 'react';
import { Building2, Search, Power, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SEEDED_PARTNERS } from '../../../lib/data';
import { ChannelPartner } from '../../../lib/types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<ChannelPartner[]>(SEEDED_PARTNERS);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = partners.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setPartners(
      partners.map((p) => {
        if (p.id === id) {
          const next =
            p.operationalStatus === 'ACTIVE'
              ? 'LIMITED'
              : p.operationalStatus === 'LIMITED'
              ? 'INACTIVE'
              : 'ACTIVE';
          return { ...p, operationalStatus: next };
        }
        return p;
      })
    );
  };

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
        <div>
          <h2 className="text-xl font-display font-extrabold text-white">
            Channel Partner Routing Control
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage operational states, fund disbursement quotas, and NPA risk indicators.
          </p>
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search partner or city..."
            className="text-xs p-2.5 rounded-xl border border-slate-600 bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-royal-500 w-48 sm:w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-start">
          <thead>
            <tr className="text-slate-400 border-b border-slate-700 font-semibold uppercase text-[10px]">
              <th className="p-3 text-start">Partner Organization</th>
              <th className="p-3 text-start">Type / State</th>
              <th className="p-3 text-center">Fund Capacity</th>
              <th className="p-3 text-center">NPA Rating</th>
              <th className="p-3 text-center">Operational Status</th>
              <th className="p-3 text-center">Toggle State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-slate-300">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-700/40">
                <td className="p-3">
                  <div className="font-semibold text-white">{p.name}</div>
                  <div className="text-[10px] text-slate-400">{p.city}, {p.district}</div>
                </td>
                <td className="p-3">
                  <span className="text-royal-400 font-bold">{p.type}</span>
                  <div className="text-[10px] text-slate-400">{p.state}</div>
                </td>
                <td className="p-3 text-center font-bold text-emerald-400 font-tabular">
                  {p.fundUtilizationRatePercent}%
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.npaRiskStatus === 'LOW'
                        ? 'bg-emerald-950 text-emerald-400'
                        : 'bg-amber-950 text-saffron-400'
                    }`}
                  >
                    {p.npaRiskStatus}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.operationalStatus === 'ACTIVE'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : p.operationalStatus === 'LIMITED'
                        ? 'bg-amber-950 text-saffron-400 border border-saffron-800'
                        : 'bg-red-950 text-red-400 border border-red-800'
                    }`}
                  >
                    {p.operationalStatus}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => toggleStatus(p.id)}
                    className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white"
                    title="Toggle Operational Status"
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

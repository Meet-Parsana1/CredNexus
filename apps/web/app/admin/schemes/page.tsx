'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, Plus, Search, Edit2, ShieldCheck, Check, Trash2 } from 'lucide-react';
import { SEEDED_SCHEMES } from '../../../lib/data';
import { Scheme } from '../../../lib/types';
import { formatINR } from '../../../lib/engines/calculator';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export default function AdminSchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>(SEEDED_SCHEMES);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);

  const filtered = schemes.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdate = (updated: Scheme) => {
    setSchemes(schemes.map((s) => (s.id === updated.id ? updated : s)));
    setEditingScheme(null);
  };

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
        <div>
          <h2 className="text-xl font-display font-extrabold text-white">
            Scheme Catalog Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure statutory parameters, income limits, and official apex corporation attributions.
          </p>
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search scheme..."
            className="text-xs p-2.5 rounded-xl border border-slate-600 bg-slate-900 text-white focus:outline-none focus:ring-1 focus:ring-royal-500 w-48 sm:w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-start">
          <thead>
            <tr className="text-slate-400 border-b border-slate-700 font-semibold uppercase text-[10px]">
              <th className="p-3 text-start">Scheme Name / Code</th>
              <th className="p-3 text-end">Max Limit</th>
              <th className="p-3 text-end">Interest Rate</th>
              <th className="p-3 text-end">Income Cap</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-slate-300 font-tabular">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-700/40">
                <td className="p-3">
                  <div className="font-semibold text-white">{s.name}</div>
                  <div className="text-[10px] text-slate-400">{s.code}</div>
                </td>
                <td className="p-3 text-end font-bold text-white">{formatINR(s.maxLoanAmount)}</td>
                <td className="p-3 text-end text-royal-400">{s.interestRateMin}% - {s.interestRateMax}%</td>
                <td className="p-3 text-end">
                  {s.maxAnnualIncome > 0 ? formatINR(s.maxAnnualIncome) : 'None'}
                </td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {s.verificationStatus}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => setEditingScheme(s)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
                    title="Edit statutory parameters"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-50">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">
              Edit Scheme: {editingScheme.name}
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Max Loan Ceiling (₹):</label>
                <input
                  type="number"
                  value={editingScheme.maxLoanAmount}
                  onChange={(e) =>
                    setEditingScheme({ ...editingScheme, maxLoanAmount: Number(e.target.value) })
                  }
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-tabular"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Min Interest Rate (%):</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingScheme.interestRateMin}
                  onChange={(e) =>
                    setEditingScheme({ ...editingScheme, interestRateMin: Number(e.target.value) })
                  }
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-tabular"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Max Moratorium (Months):</label>
                <input
                  type="number"
                  value={editingScheme.moratoriumMaxMonths}
                  onChange={(e) =>
                    setEditingScheme({ ...editingScheme, moratoriumMaxMonths: Number(e.target.value) })
                  }
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-tabular"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Verification Status:</label>
                <select
                  value={editingScheme.verificationStatus}
                  onChange={(e) =>
                    setEditingScheme({ ...editingScheme, verificationStatus: e.target.value as any })
                  }
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                >
                  <option value="VERIFIED">VERIFIED</option>
                  <option value="DEMO_ILLUSTRATIVE">DEMO_ILLUSTRATIVE</option>
                  <option value="EXTERNAL_SYNC">EXTERNAL_SYNC</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingScheme(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleUpdate(editingScheme)}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

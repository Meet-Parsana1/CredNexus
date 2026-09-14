'use client';

import React from 'react';
import { FileText, Building2, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { formatINR } from '../../../lib/engines/calculator';

export default function AdminApplicationsPage() {
  const applications = [
    {
      id: 'app_demo_101',
      beneficiary: 'Ramesh Patel',
      category: 'OBC',
      income: 380000,
      scheme: 'NBCFDC Micro Finance Scheme',
      partner: 'Bank of Baroda - Financial Inclusion Hub',
      amount: 120000,
      status: 'GUIDED_TO_PARTNER',
      updatedAt: '2026-03-10',
    },
    {
      id: 'app_demo_102',
      beneficiary: 'Sunita Devi',
      category: 'SC/ST',
      income: 240000,
      scheme: 'Stand-Up India Greenfield Scheme',
      partner: 'Punjab National Bank - MSME Hub',
      amount: 1500000,
      status: 'READY_TO_APPLY',
      updatedAt: '2026-03-08',
    },
    {
      id: 'app_demo_103',
      beneficiary: 'Aarav Mukherjee',
      category: 'OBC',
      income: 450000,
      scheme: 'NBCFDC Concessional Education Loan Scheme',
      partner: 'West Bengal Backward Classes Dev Corp',
      amount: 1400000,
      status: 'GUIDED_TO_PARTNER',
      updatedAt: '2026-03-05',
    },
  ];

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-700">
        <div>
          <h2 className="text-xl font-display font-extrabold text-white">
            Beneficiary Application &amp; Guidance Dossiers
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Overview of guidance dossiers generated for authorized Channel Partner branches.
          </p>
        </div>
        <Badge variant="emerald" size="sm">{applications.length} Active Dossiers</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-start">
          <thead>
            <tr className="text-slate-400 border-b border-slate-700 font-semibold uppercase text-[10px]">
              <th className="p-3 text-start">Applicant / Category</th>
              <th className="p-3 text-start">Target Scheme</th>
              <th className="p-3 text-start">Routed Channel Partner</th>
              <th className="p-3 text-end">Project Capital</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-slate-300">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-slate-700/40">
                <td className="p-3">
                  <div className="font-semibold text-white">{app.beneficiary}</div>
                  <div className="text-[10px] text-slate-400">{app.category} &bull; Income: {formatINR(app.income)}</div>
                </td>
                <td className="p-3 font-medium text-slate-200">{app.scheme}</td>
                <td className="p-3 text-slate-300">{app.partner}</td>
                <td className="p-3 text-end font-bold text-emerald-400 font-tabular">{formatINR(app.amount)}</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {app.status.replace(/_/g, ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

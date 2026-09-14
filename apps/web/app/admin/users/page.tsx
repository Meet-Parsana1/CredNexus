'use client';

import React from 'react';
import { Users, ShieldCheck, Mail, MapPin } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { formatINR } from '../../../lib/engines/calculator';

export default function AdminUsersPage() {
  const users = [
    {
      id: 'usr_01',
      name: 'Ramesh Patel',
      email: 'ramesh.patel@example.com',
      role: 'Beneficiary (Entrepreneur)',
      category: 'OBC',
      income: 380000,
      state: 'Gujarat',
      savedCount: 2,
    },
    {
      id: 'usr_02',
      name: 'Priya Sharma',
      email: 'admin.officer@nbcfdc.gov.in',
      role: 'Scheme Officer (Admin)',
      category: 'Official Desk',
      income: 0,
      state: 'New Delhi',
      savedCount: 0,
    },
    {
      id: 'usr_03',
      name: 'Fatima Begum',
      email: 'fatima.b@example.com',
      role: 'Beneficiary (Weaver Artisan)',
      category: 'OBC / Minority',
      income: 180000,
      state: 'Uttar Pradesh',
      savedCount: 3,
    },
  ];

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-700">
        <div>
          <h2 className="text-xl font-display font-extrabold text-white">
            User Directory &amp; Role Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Registered beneficiary accounts, applicant social profiles, and officer administrative roles.
          </p>
        </div>
        <Badge variant="royal" size="sm">{users.length} Registered Personas</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-start">
          <thead>
            <tr className="text-slate-400 border-b border-slate-700 font-semibold uppercase text-[10px]">
              <th className="p-3 text-start">User Profile</th>
              <th className="p-3 text-start">Role</th>
              <th className="p-3 text-start">State / Category</th>
              <th className="p-3 text-end">Income Bracket</th>
              <th className="p-3 text-center">Shortlists</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-slate-300">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-700/40">
                <td className="p-3">
                  <div className="font-semibold text-white">{u.name}</div>
                  <div className="text-[10px] text-slate-400">{u.email}</div>
                </td>
                <td className="p-3 font-medium text-slate-300">{u.role}</td>
                <td className="p-3">
                  <span className="text-white font-medium">{u.state}</span>
                  <div className="text-[10px] text-slate-400">{u.category}</div>
                </td>
                <td className="p-3 text-end font-tabular text-emerald-400">
                  {u.income > 0 ? formatINR(u.income) : 'N/A'}
                </td>
                <td className="p-3 text-center font-bold text-white font-tabular">
                  {u.savedCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

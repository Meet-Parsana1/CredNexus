'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldAlert, 
  Layers, 
  Building2, 
  Database, 
  Users,
  FileCheck,
  History,
  Cpu,
  Activity,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../lib/store/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navLinks = [
    { href: '/admin', label: 'Admin Metrics', icon: Activity },
    { href: '/admin/schemes', label: 'Scheme Registry', icon: Layers },
    { href: '/admin/partners', label: 'Channel Partners', icon: Building2 },
    { href: '/admin/applications', label: 'Applications', icon: FileCheck },
    { href: '/admin/updates', label: 'Regulatory Audit', icon: History },
    { href: '/admin/users', label: 'User Directory', icon: Users },
    { href: '/admin/data-sources', label: 'Data Ingestion & Sync', icon: Database },
    { href: '/admin/system', label: 'System Health', icon: Cpu },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Admin Sidebar */}
          <aside className="lg:col-span-3 bg-slate-800/90 rounded-2xl border border-slate-700 p-5 shadow-xl space-y-6">
            <div className="space-y-1 pb-4 border-b border-slate-700">
              <div className="flex items-center gap-2 text-saffron-400">
                <ShieldAlert className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Admin Portal
                </span>
              </div>
              <h3 className="font-bold text-sm text-white">
                Officer Console
              </h3>
              <p className="text-[11px] text-slate-400">
                Statutory Scheme &amp; Partner Control Layer
              </p>
            </div>

            <nav className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-royal-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-700 space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Beneficiary View</span>
              </Link>
            </div>
          </aside>

          {/* Admin Main Body */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}

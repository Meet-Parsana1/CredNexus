'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Bookmark, 
  Sparkles, 
  FileText, 
  User, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../lib/store/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded, logout } = useAuth();

  // Authorization guard: redirect unauthenticated users to login
  // Wait for isLoaded to avoid flash-redirect while localStorage is being hydrated
  useEffect(() => {
    if (isLoaded && !user) {
      router.replace('/login');
    }
  }, [isLoaded, user, router]);


  const links = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/saved-schemes', label: 'Saved Schemes', icon: Bookmark },
    { href: '/dashboard/recommendations', label: 'Recommendations', icon: Sparkles },
    { href: '/dashboard/applications', label: 'Applications & Guidance', icon: FileText },
    { href: '/dashboard/profile', label: 'My Profile', icon: User },
  ];

  // Show nothing while localStorage is being read (or while redirect is in progress)
  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-royal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6">
            <div className="space-y-1 pb-4 border-b border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Beneficiary Portal
              </span>
              <h3 className="font-bold text-sm text-navy-800 truncate">
                {user?.name || 'Ramesh Patel'}
              </h3>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>

            <nav className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-royal-50 text-royal-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-navy-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-royal-600' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Main Dashboard Area */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}

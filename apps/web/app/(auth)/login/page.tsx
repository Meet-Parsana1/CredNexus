'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, ShieldCheck, Lock, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { useAuth } from '../../../lib/store/auth';
import { Button } from '../../../components/ui/Button';
import { BrandLogo } from '../../../components/layout/BrandLogo';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('ramesh.patel@example.com');
  const [password, setPassword] = useState('demo1234');
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>('user');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, selectedRole);
    if (selectedRole === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  const handleQuickDemo = (role: 'user' | 'admin') => {
    setSelectedRole(role);
    if (role === 'admin') {
      setEmail('admin.officer@nbcfdc.gov.in');
      login('admin.officer@nbcfdc.gov.in', 'admin');
      router.push('/admin');
    } else {
      setEmail('ramesh.patel@example.com');
      login('ramesh.patel@example.com', 'user');
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <BrandLogo />
        </div>
        <h2 className="text-2xl font-display font-extrabold text-navy-800">
          Sign in to CredNexus
        </h2>
        <p className="text-xs text-slate-500">
          Access your personalized scheme recommendations, saved schemes, and application dossiers.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-elevated rounded-2xl border border-slate-200 sm:px-10 space-y-6">
          {/* Quick Demo Selector */}
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs space-y-2">
            <span className="font-bold text-royal-800 block text-[11px] uppercase tracking-wider">
              Instant SIH Demo Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('user')}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:border-royal-500 text-start shadow-xs transition-colors"
              >
                <span className="font-bold text-navy-800 block">Beneficiary</span>
                <span className="text-[10px] text-slate-500">Ramesh Patel (OBC)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:border-royal-500 text-start shadow-xs transition-colors"
              >
                <span className="font-bold text-navy-800 block">Admin Portal</span>
                <span className="text-[10px] text-slate-500">Priya Sharma (Officer)</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-royal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-royal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Access Mode / Persona:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer ${
                  selectedRole === 'user' ? 'border-royal-600 bg-royal-50 font-bold text-royal-800' : 'border-slate-200'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    checked={selectedRole === 'user'}
                    onChange={() => setSelectedRole('user')}
                    className="hidden"
                  />
                  <span>Beneficiary</span>
                </label>
                <label className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer ${
                  selectedRole === 'admin' ? 'border-royal-600 bg-royal-50 font-bold text-royal-800' : 'border-slate-200'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    checked={selectedRole === 'admin'}
                    onChange={() => setSelectedRole('admin')}
                    className="hidden"
                  />
                  <span>Scheme Admin</span>
                </label>
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            <span>Don&apos;t have an account? </span>
            <Link href="/register" className="font-semibold text-royal-600 hover:underline">
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

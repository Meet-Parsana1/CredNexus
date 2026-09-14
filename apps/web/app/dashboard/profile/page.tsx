'use client';

import React, { useState } from 'react';
import { User, Globe2, MapPin, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../../../lib/store/auth';
import { useLanguage } from '../../../lib/i18n/context';
import { SUPPORTED_LANGUAGES } from '../../../lib/i18n/languages';
import { formatINR } from '../../../lib/engines/calculator';
import { Button } from '../../../components/ui/Button';

export default function ProfilePage() {
  const { user } = useAuth();
  const { locale, setLocale } = useLanguage();

  const [name, setName] = useState(user?.name || 'Ramesh Patel');
  const [email, setEmail] = useState(user?.email || 'ramesh.patel@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [income, setIncome] = useState(user?.annualIncome || 380000);
  const [state, setState] = useState(user?.state || 'Gujarat');
  const [district, setDistrict] = useState(user?.district || 'Ahmedabad');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-display font-extrabold text-navy-800">
            Beneficiary Profile Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your criteria determine automated statutory eligibility checks and partner distance calculations.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Beneficiary Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-royal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-royal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-royal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Annual Family Income (Statutory Ceiling Check)
            </label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-royal-500 font-tabular font-bold"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Formatted: {formatINR(income)}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Home State
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-medium"
            >
              <option value="Gujarat">Gujarat</option>
              <option value="Delhi">Delhi</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="West Bengal">West Bengal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              District
            </label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-royal-500"
            />
          </div>
        </div>

        {/* Preferred Language Selection */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-navy-800 mb-2">
            Preferred Platform Language (12 Supported Indian Languages):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLocale(l.code)}
                className={`p-2.5 rounded-xl border text-xs text-start transition-colors ${
                  locale === l.code
                    ? 'border-royal-600 bg-royal-50 text-royal-800 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="block font-semibold">{l.nativeName}</span>
                <span className="text-[10px] text-slate-400">{l.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <Button type="submit" variant="primary" size="md">
            Update Profile Preferences
          </Button>
          {savedSuccess && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <Check className="w-4 h-4" /> Changes successfully saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

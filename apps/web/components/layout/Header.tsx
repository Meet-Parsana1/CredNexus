'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Calculator, 
  Compass, 
  MapPin, 
  BookOpen, 
  ShieldAlert, 
  User, 
  Menu, 
  X,
  LayoutDashboard,
  GraduationCap
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../../lib/i18n/context';
import { useAuth } from '../../lib/store/auth';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/schemes', label: t('nav.schemes'), icon: Compass },
    { href: '/recommend', label: t('nav.findScheme'), icon: Sparkles, highlight: true },
    { href: '/calculator', label: t('nav.calculator'), icon: Calculator },
    { href: '/partners', label: t('nav.partners'), icon: MapPin },
    { href: '/education', label: t('nav.education'), icon: GraduationCap },
    { href: '/how-it-works', label: t('nav.howItWorks'), icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <BrandLogo />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    link.highlight
                      ? 'bg-royal-50 text-royal-700 hover:bg-royal-100'
                      : isActive
                      ? 'text-royal-600 bg-slate-50 font-bold'
                      : 'text-slate-600 hover:text-navy-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${link.highlight ? 'text-royal-600' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center gap-2.5">
            <LanguageSelector />

            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" icon={<LayoutDashboard className="w-3.5 h-3.5" />}>
                    {t('nav.dashboard')}
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="secondary" size="sm" icon={<ShieldAlert className="w-3.5 h-3.5" />}>
                      Admin
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="primary" size="sm" icon={<User className="w-3.5 h-3.5" />}>
                  {t('nav.login')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <LanguageSelector />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-navy-800 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive ? 'bg-royal-50 text-royal-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 text-royal-600" />
                {link.label}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold bg-slate-50 text-navy-800"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  {t('nav.dashboard')} ({user.name})
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold bg-navy-800 text-white"
                  >
                    <ShieldAlert className="w-4 h-4 text-saffron-400" />
                    Admin Portal
                  </Link>
                )}
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-royal-600 text-white"
              >
                <User className="w-4 h-4" />
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

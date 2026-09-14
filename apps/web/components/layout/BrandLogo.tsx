import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BrandLogoProps {
  className?: string;
  variant?: 'default' | 'light' | 'mark';
  href?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'default',
  href = '/',
}) => {
  const content = (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon Mark */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-navy-800 text-white shadow-sm overflow-hidden flex-shrink-0 border border-navy-700">
        <svg
          viewBox="0 0 40 40"
          className="w-8 h-8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 25 C14 18, 22 17, 28 20 C24 23, 20 25, 20 29 C20 33, 26 34, 30 31"
            stroke="#F8FAFC"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="28" cy="20" r="3" fill="#1D4ED8" />
          <circle cx="22" cy="30" r="3" fill="#15803D" />
          <circle cx="32" cy="26" r="2.5" fill="#F59E0B" />
        </svg>
      </div>

      {variant !== 'mark' && (
        <div className="flex flex-col">
          <span
            className={`font-display font-extrabold text-xl tracking-tight leading-none ${
              variant === 'light' ? 'text-white' : 'text-navy-800'
            }`}
          >
            Cred<span className="text-royal-600">Nexus</span>
          </span>
          <span
            className={`text-[9px] font-semibold tracking-wider uppercase mt-1 ${
              variant === 'light' ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            SCHEMES &bull; PARTNERS
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
};

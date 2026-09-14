import React from 'react';

interface BadgeProps {
  variant?: 'navy' | 'royal' | 'emerald' | 'saffron' | 'neutral' | 'red';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  className = '',
  icon,
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium gap-1',
    md: 'text-xs px-2.5 py-1 font-semibold gap-1.5',
  };

  const variantClasses = {
    navy: 'bg-navy-100 text-navy-800 border border-navy-200',
    royal: 'bg-royal-50 text-royal-700 border border-royal-200',
    emerald: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    saffron: 'bg-saffron-50 text-saffron-800 border border-saffron-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    red: 'bg-red-50 text-red-700 border border-red-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

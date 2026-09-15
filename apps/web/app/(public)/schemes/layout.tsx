import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Concessional Schemes Directory - CredNexus',
  description:
    'Browse all verified government concessional credit schemes for OBC, SC, ST, minority, and women entrepreneurs. Filter by category, income, and loan amount.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

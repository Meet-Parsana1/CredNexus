import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Eligibility Checker - CredNexus',
  description:
    'Check your eligibility for government concessional credit schemes. Provide your category, income, and state to get matched.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

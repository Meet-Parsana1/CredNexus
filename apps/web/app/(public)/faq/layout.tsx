import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - CredNexus',
  description:
    'Find answers to common questions about concessional government credit schemes, eligibility, Channel Partners, and the application process.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

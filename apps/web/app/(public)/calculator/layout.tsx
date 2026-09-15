import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'EMI and Moratorium Calculator - CredNexus',
  description:
    'Accurately model monthly installments, moratorium periods, and total interest for concessional government loan schemes.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Lending Partners and Apex Institutions - CredNexus',
  description:
    'Overview of NBCFDC, NSFDC, NMDFC, and other apex lending institutions behind the concessional credit schemes on CredNexus.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

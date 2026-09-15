import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Channel Partner Locator - CredNexus',
  description:
    'Find authorized NBCFDC, NSFDC, and NMDFC Channel Partners near you. View contact details and map location.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

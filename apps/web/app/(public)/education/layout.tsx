import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Financial Literacy Hub - CredNexus Education',
  description:
    'Learn about concessional credit, loan terminology, and how to apply for government schemes. Resources in multiple Indian languages.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

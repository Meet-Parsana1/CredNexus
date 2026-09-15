import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'How CredNexus Works - 4-Step Process',
  description:
    'See how CredNexus helps you discover, verify, calculate, and apply for concessional government credit schemes in four simple steps.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

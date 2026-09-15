import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'About CredNexus - SIH 2026 Initiative by Team Brainwired',
  description:
    'Learn how CredNexus bridges marginalized entrepreneurs and students with verified government concessional credit schemes and authorized Channel Partners across India.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

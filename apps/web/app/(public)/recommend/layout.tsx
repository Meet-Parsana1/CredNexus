import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Find Your Scheme - CredNexus AI Recommender',
  description:
    'Answer a few questions and let the CredNexus matching engine identify the best government concessional credit schemes for your profile.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

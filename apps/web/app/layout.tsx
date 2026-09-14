import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '../lib/i18n/context';
import { AuthProvider } from '../lib/store/auth';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { AIAssistantWidget } from '../components/ai/AIAssistantWidget';

export const metadata: Metadata = {
  title: 'CredNexus — AI-Driven Concessional Scheme Matching & Channel Partner Locator',
  description:
    'Bridging marginalized entrepreneurs, students, and beneficiaries with verified government concessional credit schemes and authorized Channel Partners. SIH 2026 Initiative by Team Brainwired.',
  icons: {
    icon: '/logos/crednexus-logo-mark.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&family=Noto+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-royal-100 selection:text-royal-900">
        <LanguageProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <AIAssistantWidget />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

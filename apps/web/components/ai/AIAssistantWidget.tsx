'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  HelpCircle, 
  ArrowRight, 
  Compass, 
  Calculator, 
  MapPin, 
  ShieldCheck 
} from 'lucide-react';
import { useLanguage } from '../../lib/i18n/context';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  quickActions?: { label: string; href: string }[];
}

export const AIAssistantWidget: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `Hello! I am CredNexus Assistant. I can help guide you through government concessional loan schemes, check eligibility rules, or locate accredited Channel Partners in your state.`,
      quickActions: [
        { label: 'Find a Scheme for My Business', href: '/recommend' },
        { label: 'Calculate Loan EMI & Moratorium', href: '/calculator' },
        { label: 'Find Nearby Channel Partner', href: '/partners' },
        { label: 'Education Loans in India/Abroad', href: '/education' },
      ],
    },
  ]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
    };

    const lower = text.toLowerCase();
    let reply = '';
    let quickActions: { label: string; href: string }[] = [];

    // Deterministic Rule-Based Intent Extraction
    if (lower.includes('emi') || lower.includes('calculate') || lower.includes('interest') || lower.includes('repay')) {
      reply = `You can use our verified EMI & Moratorium Calculator! For example, under the NBCFDC Microfinance Scheme at 6.5% interest with a 3-month moratorium, you can preview the full month-by-month repayment schedule.`;
      quickActions = [{ label: 'Open EMI Calculator', href: '/calculator' }];
    } else if (lower.includes('education') || lower.includes('study') || lower.includes('college') || lower.includes('abroad')) {
      reply = `Under the NBCFDC Education Loan Scheme, eligible students can receive up to ₹15 Lakh for studies in India and up to ₹20 Lakh for overseas courses at a concessional rate of 4.5% (4.0% for female students) with moratorium covering course duration + up to 12 months.`;
      quickActions = [
        { label: 'Explore Education Scheme', href: '/schemes/sch_nbcfdc_edu' },
        { label: 'Education Overview', href: '/education' }
      ];
    } else if (lower.includes('partner') || lower.includes('bank') || lower.includes('branch') || lower.includes('where') || lower.includes('near')) {
      reply = `CredNexus routes beneficiaries to authorized Channel Partners: State Channelising Agencies (SCAs), Public Sector Banks (PSBs like PNB, BOB, SBI), Regional Rural Banks (RRBs), and accredited NBFC-MFIs. We check geo-distance and scheme accreditation.`;
      quickActions = [{ label: 'View Partner Locator Map', href: '/partners' }];
    } else if (lower.includes('eligib') || lower.includes('qualif') || lower.includes('rule') || lower.includes('income')) {
      reply = `Scheme eligibility depends on verifiable criteria such as annual family income (e.g. ₹3 Lakh for Microfinance, ₹5 Lakh for Term Loans), target community category, and project scope. You can test your eligibility directly with our rule checker.`;
      quickActions = [
        { label: 'Smart Scheme Recommender', href: '/recommend' },
        { label: 'Standalone Eligibility Checker', href: '/eligibility' }
      ];
    } else {
      reply = `I can help match your project requirements to the right scheme and authorized Channel Partner. Choose one of our verified tools below to get started:`;
      quickActions = [
        { label: 'Start Scheme Wizard', href: '/recommend' },
        { label: 'Browse 6 Verified Schemes', href: '/schemes' },
        { label: 'Locate Channel Partner', href: '/partners' }
      ];
    }

    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'assistant',
      text: reply,
      quickActions,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInputMessage('');
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 end-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-navy-800 text-white rounded-full shadow-elevated hover:bg-navy-900 active:scale-95 transition-all border border-navy-700"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-royal-400" />
            <span className="absolute -top-1 -end-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -end-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          </div>
          <span className="text-xs font-bold tracking-wide">CredNexus Assistant</span>
        </button>
      )}

      {/* Assistant Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 end-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px] animate-in fade-in-50 zoom-in-95">
          {/* Header */}
          <div className="bg-navy-800 text-white px-4 py-3.5 flex items-center justify-between border-b border-navy-700">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-royal-600 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold leading-tight">CredNexus Assistant</h3>
                <p className="text-[10px] text-slate-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Deterministic &bull; Official Scheme Data
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-navy-700 transition-colors"
              aria-label="Close assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-royal-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* Quick actions if any */}
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1.5 w-full">
                    {msg.quickActions.map((action, i) => (
                      <Link
                        key={i}
                        href={action.href}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center justify-between px-3 py-2 bg-white hover:bg-royal-50 border border-slate-200 hover:border-royal-200 rounded-xl text-royal-700 font-medium transition-colors group shadow-xs"
                      >
                        <span>{action.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about schemes, EMI, or partners..."
              className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-royal-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2 bg-royal-600 text-white rounded-xl hover:bg-royal-700 disabled:opacity-40 transition-colors"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

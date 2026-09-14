'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  MapPin, 
  Search, 
  Filter, 
  Building2, 
  Phone, 
  Mail, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Navigation, 
  Layers, 
  ChevronRight, 
  Award, 
  ShieldCheck 
} from 'lucide-react';
import { useLanguage } from '../../../lib/i18n/context';
import { SEEDED_PARTNERS, SEEDED_SCHEMES } from '../../../lib/data';
import { routeAndRankPartners } from '../../../lib/engines/partner-router';
import { ChannelPartner, PartnerType } from '../../../lib/types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { DataFreshnessIndicator } from '../../../components/ui/DataFreshnessIndicator';

// Dynamic import for Leaflet map to avoid SSR errors
const DynamicPartnerMap = dynamic(
  () => import('../../../components/partner/PartnerMap').then((mod) => mod.PartnerMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[480px] lg:h-[600px] bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-medium">
        Loading Interactive Channel Partner Map...
      </div>
    ),
  }
);

function PartnersContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const initialScheme = searchParams?.get('scheme') || '';
  const initialState = searchParams?.get('state') || 'All';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string>(initialState);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedSchemeCode, setSelectedSchemeCode] = useState<string>(initialScheme);
  const [selectedPartner, setSelectedPartner] = useState<ChannelPartner | null>(null);

  // States list from dataset
  const states = useMemo(() => {
    const set = new Set(SEEDED_PARTNERS.map((p) => p.state));
    return ['All', ...Array.from(set)];
  }, []);

  // Filter & rank partners using the routing engine
  const rankedPartners = useMemo(() => {
    const criteria = {
      userLat: 28.6139,
      userLng: 77.209,
      selectedState: selectedState !== 'All' ? selectedState : undefined,
      schemeCode: selectedSchemeCode || undefined,
    };

    let list = routeAndRankPartners(SEEDED_PARTNERS, criteria);

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (r) =>
          r.partner.name.toLowerCase().includes(q) ||
          r.partner.city.toLowerCase().includes(q) ||
          r.partner.district.toLowerCase().includes(q) ||
          r.partner.typeLabel.toLowerCase().includes(q)
      );
    }

    if (selectedType !== 'All') {
      list = list.filter((r) => r.partner.type === selectedType);
    }

    return list;
  }, [searchTerm, selectedState, selectedType, selectedSchemeCode]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 text-navy-800 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-royal-600" />
            <span>Geo-Spatial Routing &amp; Channel Partner Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-navy-800">
            Authorized Channel Partner Locator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            CredNexus maps State Channelising Agencies (SCAs), Public Sector Banks, RRBs, and NBFC-MFIs based on geographical distance, scheme accreditation, and fund disbursement capacity.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute start-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search partner, city, or district..."
                className="w-full text-xs ps-9 pe-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-royal-500"
              />
            </div>

            {/* State Filter */}
            <div>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-royal-500 font-medium"
              >
                <option value="All">All Indian States</option>
                {states.filter((s) => s !== 'All').map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Partner Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-royal-500 font-medium"
              >
                <option value="All">All Partner Types</option>
                <option value="SCA">State Channelising Agency (SCA)</option>
                <option value="PSB">Public Sector Bank (PSB)</option>
                <option value="RRB">Regional Rural Bank (RRB)</option>
                <option value="NBFC_MFI">NBFC - Microfinance Institution</option>
              </select>
            </div>

            {/* Scheme Accreditation Filter */}
            <div>
              <select
                value={selectedSchemeCode}
                onChange={(e) => setSelectedSchemeCode(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-royal-500 font-medium"
              >
                <option value="">Any Government Scheme</option>
                {SEEDED_SCHEMES.map((sch) => (
                  <option key={sch.code} value={sch.code}>
                    {sch.shortName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Map & Listing Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Map */}
          <div className="lg:col-span-7">
            <DynamicPartnerMap
              partners={rankedPartners.map((r) => r.partner)}
              selectedPartner={selectedPartner}
              onSelectPartner={(p) => setSelectedPartner(p)}
              userLat={28.6139}
              userLng={77.209}
            />
            <div className="mt-3 text-xs text-slate-500 flex items-center justify-between px-1">
              <span>Showing {rankedPartners.length} matching partner offices</span>
              <span className="text-[11px] text-slate-400">Map tiles &copy; OpenStreetMap (No API keys required)</span>
            </div>
          </div>

          {/* Accessible Partner Card List */}
          <div className="lg:col-span-5 space-y-4 max-h-[640px] overflow-y-auto pe-1">
            {rankedPartners.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-saffron-500 mx-auto" />
                <h4 className="font-bold text-navy-800 text-sm">No Channel Partners Match Filters</h4>
                <p className="text-xs text-slate-500">
                  Try clearing the specific state or scheme filter to see accredited national institutions.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedState('All');
                    setSelectedType('All');
                    setSelectedSchemeCode('');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              rankedPartners.map(({ partner, distanceKm, routingScore, isCompatible, reasons, statusLabel }) => {
                const isSelected = selectedPartner?.id === partner.id;
                return (
                  <div
                    key={partner.id}
                    onClick={() => setSelectedPartner(partner)}
                    className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-royal-600 ring-2 ring-royal-500/20 shadow-elevated'
                        : 'border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge variant={partner.type === 'SCA' ? 'navy' : partner.type === 'PSB' ? 'royal' : 'emerald'} size="sm">
                            {partner.typeLabel}
                          </Badge>
                          <h3 className="font-bold text-sm text-navy-800 mt-1.5 leading-snug">
                            {partner.name}
                          </h3>
                        </div>
                        <div className="text-end flex-shrink-0">
                          <span className="text-xs font-bold text-royal-600 block font-tabular">
                            ~{distanceKm} km
                          </span>
                          <span className="text-[10px] text-slate-400">approx. distance</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600">
                        {partner.address}, {partner.city}, {partner.district}, {partner.state} - {partner.pincode}
                      </p>

                      {/* Operational Metrics */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fund Utilization</span>
                          <span className="font-bold text-emerald-700">{partner.fundUtilizationRatePercent}%</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">NPA Risk Rating</span>
                          <span className="font-bold text-navy-800">{partner.npaRiskStatus}</span>
                        </div>
                      </div>

                      {/* Reasons & Accreditation */}
                      {reasons.length > 0 && (
                        <div className="text-[11px] text-slate-600 space-y-1 bg-blue-50/60 p-2.5 rounded-lg">
                          {reasons.map((r, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-royal-600 flex-shrink-0" />
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Contact and Links */}
                      <div className="pt-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3 text-slate-500">
                          {partner.contactPhone && (
                            <span className="inline-flex items-center gap-1 text-[11px]">
                              <Phone className="w-3 h-3" /> {partner.contactPhone}
                            </span>
                          )}
                        </div>
                        {partner.website && (
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-royal-600 hover:underline inline-flex items-center gap-1 text-[11px] font-semibold"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Official Portal <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PartnersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">
          Loading Channel Partner Directory...
        </div>
      }
    >
      <PartnersContent />
    </Suspense>
  );
}

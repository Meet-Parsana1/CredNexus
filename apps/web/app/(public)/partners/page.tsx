'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  MapPin, Search, Filter, Building2, Phone, 
  ExternalLink, CheckCircle2, AlertCircle, Navigation, 
  Layers, ChevronRight, ShieldCheck, LocateFixed, Info,
  Clock, Route
} from 'lucide-react';
import { useLanguage } from '../../../lib/i18n/context';
import { SEEDED_PARTNERS, SEEDED_SCHEMES } from '../../../lib/data';
import { routeAndRankPartners } from '../../../lib/engines/partner-router';
import { ChannelPartner, PartnerType, SchemeCategory } from '../../../lib/types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { DataFreshnessIndicator } from '../../../components/ui/DataFreshnessIndicator';
import { RouteSummary } from '../../../components/partner/PartnerMap';

// Dynamic import to avoid SSR errors for Leaflet
const DynamicPartnerMap = dynamic(
  () => import('../../../components/partner/PartnerMap').then((mod) => mod.PartnerMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[480px] lg:h-[560px] bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-medium text-sm">
        Loading Interactive Channel Partner Map...
      </div>
    ),
  }
);

const INDIA_DEFAULT_LAT = 22.5937; // Geographic center of India
const INDIA_DEFAULT_LNG = 78.9629;

function PartnersContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const initialScheme = searchParams?.get('scheme') || '';
  const initialState = searchParams?.get('state') || 'All';
  const initialCategory = (searchParams?.get('category') as SchemeCategory | null) || undefined;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string>(initialState);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedSchemeCode, setSelectedSchemeCode] = useState<string>(initialScheme);
  const [selectedPartner, setSelectedPartner] = useState<ChannelPartner | null>(null);
  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);

  // Real browser geolocation
  const [userLat, setUserLat] = useState<number>(INDIA_DEFAULT_LAT);
  const [userLng, setUserLng] = useState<number>(INDIA_DEFAULT_LNG);
  const [userLocationName, setUserLocationName] = useState<string>('India (Default)');
  const [geoStatus, setGeoStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable'>('idle');

  // Address search state
  const [addressQuery, setAddressQuery] = useState('');
  const [searchingAddress, setSearchingAddress] = useState(false);

  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('unavailable');
      return;
    }
    setGeoStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setUserLocationName(`Your Location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        setGeoStatus('granted');
      },
      (_err) => {
        setGeoStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const searchByAddress = async () => {
    if (!addressQuery.trim()) return;
    setSearchingAddress(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressQuery + ', India')}&format=json&limit=1&countrycodes=in`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'CredNexus-SIH2026/1.0 (contact@crednexus.gov.in)' },
      });
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const displayName = data[0].display_name?.split(',').slice(0, 2).join(', ') || addressQuery;
        setUserLat(lat);
        setUserLng(lng);
        setUserLocationName(displayName);
        setGeoStatus('granted');
      }
    } catch (_err) {
      // Geocode failed silently
    } finally {
      setSearchingAddress(false);
    }
  };

  const states = useMemo(() => {
    const set = new Set(SEEDED_PARTNERS.map((p) => p.state));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const rankedPartners = useMemo(() => {
    const criteria = {
      userLat,
      userLng,
      selectedState: selectedState !== 'All' ? selectedState : undefined,
      schemeCode: selectedSchemeCode || undefined,
      category: initialCategory || undefined,
    };

    let list = routeAndRankPartners(SEEDED_PARTNERS, criteria);

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (r) =>
          r.partner.name.toLowerCase().includes(q) ||
          r.partner.city.toLowerCase().includes(q) ||
          r.partner.district.toLowerCase().includes(q) ||
          r.partner.state.toLowerCase().includes(q) ||
          r.partner.typeLabel.toLowerCase().includes(q)
      );
    }

    if (selectedType !== 'All') {
      list = list.filter((r) => r.partner.type === selectedType);
    }

    return list;
  }, [searchTerm, selectedState, selectedType, selectedSchemeCode, userLat, userLng, initialCategory]);

  const geocodedCount = rankedPartners.filter((r) => r.distanceKm !== null).length;
  const directoryOnlyCount = rankedPartners.length - geocodedCount;

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 text-navy-800 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-royal-600" />
            <span>Official NSFDC Accredited Channel Partner Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-navy-800">
            Locate an Authorised Channel Partner
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Find State Channelising Agencies (SCAs), Public Sector Banks, Regional Rural Banks and NBFC-MFIs authorised by NSFDC to disburse concessional credit to Scheduled Caste beneficiaries.
          </p>
        </div>

        {/* Geolocation / Address Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Enter your address or locality to sort by proximity..."
              value={addressQuery}
              onChange={(e) => setAddressQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchByAddress()}
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-royal-500 bg-slate-50"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={searchByAddress}
              disabled={searchingAddress}
              icon={<Search className="w-3.5 h-3.5" />}
            >
              {searchingAddress ? 'Searching...' : 'Search'}
            </Button>
          </div>
          <div className="shrink-0">
            <Button
              variant={geoStatus === 'granted' ? 'emerald' : 'secondary'}
              size="sm"
              onClick={requestGeolocation}
              disabled={geoStatus === 'requesting'}
              icon={<LocateFixed className="w-3.5 h-3.5" />}
            >
              {geoStatus === 'requesting' ? 'Locating...' : geoStatus === 'granted' ? 'Location Active' : 'Use My Location'}
            </Button>
          </div>
          {geoStatus === 'denied' && (
            <p className="text-[11px] text-red-600 font-medium">
              Location access denied. Please search by address above.
            </p>
          )}
          {geoStatus === 'granted' && (
            <p className="text-[11px] text-emerald-700 font-semibold">
              ✓ {userLocationName}
            </p>
          )}
        </div>

        {/* NSFDC Data Note */}
        <div className="bg-blue-50/60 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3 text-xs">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span className="text-slate-700 leading-relaxed">
            <strong>Coordinate Availability:</strong> {geocodedCount} of {rankedPartners.length} partners have verified geographic coordinates and are shown on the map. {directoryOnlyCount > 0 && `${directoryOnlyCount} partner(s) appear in the directory only — official coordinates are not published by NSFDC for those offices.`} Distance and navigation is available only for mapped partners.
          </span>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Search Partners
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Name, city, state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-royal-500 bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Filter by State / UT
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-royal-500 font-medium"
            >
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Partner Category
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-royal-500 font-medium"
            >
              <option value="All">All Categories</option>
              <option value="SCA">State Channelising Agency (SCA)</option>
              <option value="PSB">Public Sector Bank (PSB)</option>
              <option value="RRB">Regional Rural Bank (RRB)</option>
              <option value="NBFC_MFI">NBFC - Microfinance Institution</option>
              <option value="COOPERATIVE_BANK">Co-operative Bank</option>
              <option value="SMALL_FINANCE_BANK">Small Finance Bank</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Accredited Scheme
            </label>
            <select
              value={selectedSchemeCode}
              onChange={(e) => setSelectedSchemeCode(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-royal-500 font-medium"
            >
              <option value="">All NSFDC Schemes</option>
              {SEEDED_SCHEMES.map((sch) => (
                <option key={sch.code} value={sch.code}>
                  {sch.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Map & Listing Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Map */}
          <div className="lg:col-span-7 space-y-4">
            <DynamicPartnerMap
              partners={rankedPartners.map((r) => r.partner)}
              selectedPartner={selectedPartner}
              onSelectPartner={(p) => {
                setSelectedPartner(p);
                setRouteSummary(null);
              }}
              userLat={userLat}
              userLng={userLng}
              userLocationName={userLocationName}
              onRouteCalculated={(route) => setRouteSummary(route)}
            />
            <div className="text-xs text-slate-500 flex items-center justify-between px-1">
              <span>
                {rankedPartners.length} partners in registry
                {geocodedCount > 0 && ` · ${geocodedCount} shown on map`}
              </span>
              <span className="text-[11px] text-slate-400">
                Map © OpenStreetMap · Routing © OSRM (no API keys)
              </span>
            </div>

            {/* Route Summary Panel */}
            {routeSummary && selectedPartner && (
              <div className="bg-white rounded-2xl border border-royal-200 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-navy-800 text-sm flex items-center gap-2">
                    <Route className="w-4 h-4 text-royal-600" />
                    Route to {selectedPartner.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-tabular">
                    <span className="flex items-center gap-1 text-navy-800 font-bold">
                      <Navigation className="w-3.5 h-3.5 text-royal-600" />
                      {routeSummary.distanceKm} km
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      ~{routeSummary.durationMinutes} min
                    </span>
                  </div>
                </div>

                {/* Turn-by-turn directions */}
                {routeSummary.steps.length > 0 && (
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {routeSummary.steps.slice(0, 6).map((step, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] text-slate-600">
                        <span className="w-4 h-4 bg-royal-100 text-royal-700 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="flex-1">{step.instruction}</span>
                        {step.distanceMeters > 0 && (
                          <span className="text-slate-400 font-tabular shrink-0">
                            {step.distanceMeters >= 1000
                              ? `${(step.distanceMeters / 1000).toFixed(1)} km`
                              : `${step.distanceMeters} m`}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Start Navigation deep-link */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${selectedPartner.lat},${selectedPartner.lng}&travelmode=driving`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Start Navigation in Google Maps
                </a>
              </div>
            )}
          </div>

          {/* Partner Card List */}
          <div className="lg:col-span-5 space-y-3 max-h-[720px] overflow-y-auto pe-1">
            {rankedPartners.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-saffron-500 mx-auto" />
                <h4 className="font-bold text-navy-800 text-sm">No Partners Match Current Filters</h4>
                <p className="text-xs text-slate-500">
                  Try clearing filters to see the full NSFDC accredited partner registry.
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
                const isMapped = distanceKm !== null;
                return (
                  <div
                    key={partner.id}
                    onClick={() => {
                      setSelectedPartner(partner);
                      setRouteSummary(null);
                    }}
                    className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-royal-600 ring-2 ring-royal-500/20 shadow-elevated'
                        : 'border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <Badge
                            variant={partner.type === 'SCA' ? 'navy' : partner.type === 'PSB' ? 'royal' : 'emerald'}
                            size="sm"
                          >
                            {partner.typeLabel}
                          </Badge>
                          <h3 className="font-bold text-sm text-navy-800 mt-1.5 leading-snug">
                            {partner.name}
                          </h3>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {isMapped ? (
                            <>
                              <span className="text-xs font-bold text-royal-600 block font-tabular">
                                ~{distanceKm} km
                              </span>
                              <span className="text-[10px] text-slate-400">approx. distance</span>
                            </>
                          ) : (
                            <>
                              <span className="text-xs font-medium text-slate-500 block">Directory</span>
                              <span className="text-[10px] text-slate-400">No map pin</span>
                            </>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {[partner.address, partner.city, partner.district, partner.state, partner.pincode]
                          .filter(Boolean)
                          .join(', ')}
                      </p>

                      {/* Availability Note */}
                      {partner.availabilityNote && (
                        <p className="text-[10px] text-slate-500 italic">
                          {partner.availabilityNote}
                        </p>
                      )}

                      {/* Routing reasons */}
                      {reasons.length > 0 && (
                        <div className="text-[11px] text-slate-600 space-y-1 bg-blue-50/60 p-2 rounded-lg">
                          {reasons.slice(0, 2).map((r, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-royal-600 flex-shrink-0" />
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Contact and Links */}
                      <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                        <div className="flex items-center gap-3 text-slate-500">
                          {partner.contactPhone && (
                            <span className="inline-flex items-center gap-1 text-[11px]">
                              <Phone className="w-3 h-3" /> {partner.contactPhone}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
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
                          {isMapped && (
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${partner.lat},${partner.lng}&travelmode=driving`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 hover:underline inline-flex items-center gap-1 text-[11px] font-semibold"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Navigate <Navigation className="w-3 h-3" />
                            </a>
                          )}
                        </div>
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

import React from 'react';
import { Phone, ExternalLink, CheckCircle2 } from 'lucide-react';
import { ChannelPartner } from '../../lib/types';
import { Badge } from '../ui/Badge';

interface PartnerCardProps {
  partner: ChannelPartner;
  distanceKm: number;
  isSelected?: boolean;
  reasons?: string[];
  onSelect?: (partner: ChannelPartner) => void;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({
  partner,
  distanceKm,
  isSelected = false,
  reasons = [],
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect?.(partner)}
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
};

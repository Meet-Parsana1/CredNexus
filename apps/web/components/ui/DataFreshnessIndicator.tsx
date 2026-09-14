import React from 'react';
import { ShieldCheck, Database, AlertCircle, ExternalLink } from 'lucide-react';
import { VerificationStatus } from '../../lib/types';
import { Badge } from './Badge';

interface DataFreshnessIndicatorProps {
  status: VerificationStatus;
  lastVerified?: string;
  source?: string;
  sourceUrl?: string;
  compact?: boolean;
}

export const DataFreshnessIndicator: React.FC<DataFreshnessIndicatorProps> = ({
  status,
  lastVerified,
  source,
  sourceUrl,
  compact = false,
}) => {
  if (status === 'VERIFIED') {
    return (
      <div className={`inline-flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
        <Badge variant="emerald" size={compact ? 'sm' : 'md'} icon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}>
          Verified Official Scheme
        </Badge>
        {lastVerified && (
          <span className="text-slate-500 text-xs font-normal">
            Updated: {lastVerified}
          </span>
        )}
        {source && !compact && (
          <span className="text-slate-400 text-xs hidden md:inline-flex items-center gap-1">
            &bull; Source: {source}
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-royal-600 hover:underline inline-flex items-center"
              >
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            )}
          </span>
        )}
      </div>
    );
  }

  if (status === 'EXTERNAL_SYNC') {
    return (
      <div className={`inline-flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
        <Badge variant="royal" size={compact ? 'sm' : 'md'} icon={<Database className="w-3.5 h-3.5 text-royal-600" />}>
          Connected API Sync
        </Badge>
        {lastVerified && (
          <span className="text-slate-500 text-xs">
            Synced: {lastVerified}
          </span>
        )}
      </div>
    );
  }

  // DEMO_ILLUSTRATIVE fallback
  return (
    <div className={`inline-flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
      <Badge variant="saffron" size={compact ? 'sm' : 'md'} icon={<AlertCircle className="w-3.5 h-3.5 text-saffron-600" />}>
        Illustrative Demo Seed
      </Badge>
      {lastVerified && (
        <span className="text-slate-500 text-xs">
          Last verified: {lastVerified}
        </span>
      )}
    </div>
  );
};

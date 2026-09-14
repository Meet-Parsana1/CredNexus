'use client';

import { useMemo } from 'react';
import { PartnerService } from '../lib/services/partner.service';
import { PartnerRoutingCriteria, PartnerRoutingResult } from '../lib/types';

export function usePartners(criteria: PartnerRoutingCriteria): PartnerRoutingResult[] {
  return useMemo(() => {
    return PartnerService.routePartners(criteria);
  }, [criteria]);
}

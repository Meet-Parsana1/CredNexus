'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Building2, 
  AlertCircle, 
  ExternalLink 
} from 'lucide-react';
import { useAuth } from '../../../lib/store/auth';
import { formatINR } from '../../../lib/engines/calculator';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export default function ApplicationsPage() {
  const { applications } = useAuth();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-display font-extrabold text-navy-800">
            Application Dossiers &amp; Partner Guidance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track guidance dossiers generated for accredited Channel Partner branch visits.
          </p>
        </div>
        <Badge variant="emerald" size="sm">
          {applications.length} Active Dossiers
        </Badge>
      </div>

      <div className="space-y-6">
        {applications.map((app) => (
          <div
            key={app.id}
            className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Dossier ID: {app.id} &bull; Generated: {app.createdAt}
                </span>
                <h3 className="font-bold text-base text-navy-800 mt-0.5">
                  {app.schemeName}
                </h3>
              </div>
              <Badge variant="emerald" size="md">
                Status: GUIDED TO PARTNER
              </Badge>
            </div>

            {/* Application Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Stated Project Purpose:</span>
                <span className="font-semibold text-navy-800">{app.purpose}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Target Capital Requirement:</span>
                <span className="font-bold text-emerald-700 font-tabular">{formatINR(app.projectAmount)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Designated Channel Partner:</span>
                <span className="font-semibold text-navy-800 flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-royal-600" />
                  {app.partnerName}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Last Status Update:</span>
                <span className="font-medium text-slate-700">{app.updatedAt}</span>
              </div>
            </div>

            {/* Document Checklist */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-navy-800 block">Dossier Checklist Verification:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {app.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {doc.uploaded ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0" />
                    )}
                    <span className={doc.uploaded ? 'text-slate-800 font-medium' : 'text-slate-500'}>
                      {doc.name} {doc.uploaded ? '(Verified)' : '(Carry Original Copy)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Note */}
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-slate-700">
              <span className="font-bold text-navy-800 block mb-0.5">Next Recommended Action:</span>
              <p>{app.statusNotes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

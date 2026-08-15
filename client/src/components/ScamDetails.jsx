import React from 'react';
import { UserCheck, AlertOctagon, Key, FileText, ShieldAlert, Building2, Zap, Share2 } from 'lucide-react';

const TYPE_ICONS = {
  ScamActor: UserCheck,
  ScamCampaign: AlertOctagon,
  Indicator: Key,
  ScamType: FileText,
  Incident: ShieldAlert,
  Organization: Building2,
};

const TYPE_COLORS = {
  ScamActor: 'text-red-400 border-red-800/80 bg-red-950/40',
  ScamCampaign: 'text-amber-400 border-amber-800/80 bg-amber-950/40',
  Indicator: 'text-emerald-400 border-emerald-800/80 bg-emerald-950/40',
  ScamType: 'text-purple-400 border-purple-800/80 bg-purple-950/40',
  Incident: 'text-orange-400 border-orange-800/80 bg-orange-950/40',
  Organization: 'text-blue-400 border-blue-800/80 bg-blue-950/40',
};

export default function ScamDetails({ selectedNode, overlaps = [] }) {
  if (!selectedNode) {
    return (
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-center space-y-3">
        <Zap className="w-8 h-8 text-emerald-500 mx-auto opacity-70 animate-pulse" />
        <h4 className="font-semibold text-slate-200 text-sm">Intel Inspector Panel Ready</h4>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Click on any node in the investigation graph to inspect scam properties, financial loss metrics, and shared indicator links.
        </p>
      </div>
    );
  }

  const IconComponent = TYPE_ICONS[selectedNode.type] || UserCheck;
  const badgeStyle = TYPE_COLORS[selectedNode.type] || 'text-cyan-400 border-cyan-800 bg-cyan-950/40';
  const details = selectedNode.details || {};

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 space-y-6 shadow-2xl">
      {/* Inspector Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl shadow-inner">
          <IconComponent className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-100">{selectedNode.name}</h3>
          <span className={`text-xs px-2.5 py-0.5 border rounded-full font-medium ${badgeStyle}`}>
            {selectedNode.type}
          </span>
        </div>
      </div>

      {/* Target Intel Breakdown */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <span>🔍</span> Target Intel Breakdown
        </h4>
        <div className="space-y-2 text-sm bg-slate-950 p-4 rounded-xl border border-slate-800/80">
          {Object.entries(details).map(([key, value]) => {
            if (key === 'id') return null;
            return (
              <div key={key} className="flex justify-between border-b border-slate-800/40 pb-1.5 last:border-0">
                <span className="text-slate-400 text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                <span className="font-semibold text-slate-200 text-xs text-right max-w-[200px] truncate">
                  {Array.isArray(value) ? value.join(', ') : String(value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shared Indicator Overlap Alert (Highlighting Graph Native Value) */}
      {overlaps.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="p-4 bg-emerald-950/40 border border-emerald-800/70 rounded-xl space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Share2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Shared Indicator Detected
              </h4>
            </div>

            {overlaps.map((overlap, idx) => (
              <div key={idx} className="text-xs text-slate-300 leading-relaxed space-y-1.5 bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                <p className="font-medium text-slate-200">
                  <span className="font-bold text-amber-300">{overlap.sourceCampaign}</span> and{' '}
                  <span className="font-bold text-amber-300">{overlap.relatedCampaign}</span> both use{' '}
                  <span className="font-mono text-emerald-300 font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-emerald-900">
                    {overlap.sharedIndicator}
                  </span>.
                </p>
                <div className="text-[11px] text-slate-400 flex justify-between items-center pt-1 border-t border-slate-800/60">
                  <span>Linked Syndicates:</span>
                  <span className="font-semibold text-red-400">{overlap.sourceActor} ➔ {overlap.relatedActor}</span>
                </div>
              </div>
            ))}

            <p className="text-[11px] text-slate-400 italic pt-1 border-t border-emerald-900/40">
              💡 <strong>Why Graph Database?</strong> Traverses multi-hop indicator overlap in 1 openCypher pattern query, bypassing complex relational self-joins.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

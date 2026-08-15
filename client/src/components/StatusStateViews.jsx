import React from 'react';
import { Loader2, AlertCircle, SearchX } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-4">
      <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      <p className="text-slate-300 text-sm font-medium">Traversing Scam Intelligence Graph in CognoDB...</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-950/40 border border-red-800/60 rounded-2xl space-y-4 text-center">
      <AlertCircle className="w-10 h-10 text-red-400" />
      <h4 className="text-lg font-bold text-red-200">Database Connection Failed</h4>
      <p className="text-xs text-red-300 max-w-md">{message || 'Unable to connect to backend or CognoDB over Bolt.'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-3 text-center">
      <SearchX className="w-10 h-10 text-slate-500" />
      <h4 className="text-slate-300 font-semibold">No Scam Entity Selected</h4>
      <p className="text-slate-400 text-xs max-w-sm">
        Use the search bar above to search for a scam actor, campaign, phone number, UPI ID, or domain to explore connected investigation relationships.
      </p>
    </div>
  );
}
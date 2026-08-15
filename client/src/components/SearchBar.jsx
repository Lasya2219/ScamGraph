import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, Key, UserCheck, AlertOctagon } from 'lucide-react';
import { searchScamEntities } from '../services/api';

const EXAMPLE_SEARCHES = [
  { label: 'Syndicate Alpha', query: 'Syndicate Alpha' },
  { label: 'fastpay-mule@example.test', query: 'fastpay-mule@example.test' },
  { label: 'PhishCraft Network', query: 'PhishCraft Network' },
  { label: 'bank-verify.example.test', query: 'bank-verify' },
];

export default function SearchBar({ onSelectEntity }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEntities = async () => {
      setLoading(true);
      try {
        const data = await searchScamEntities(query);
        setResults(data);
      } catch (err) {
        console.error('Failed to search scam entities', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchEntities, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const handleQuickSearch = async (quickQuery) => {
    setQuery(quickQuery);
    try {
      const data = await searchScamEntities(quickQuery);
      if (data.length > 0) {
        onSelectEntity(data[0]);
        setResults([]);
      }
    } catch (err) {
      console.error('Failed quick search', err);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-3">
      {/* Search Input Container */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-emerald-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search scam actor, campaign, phone number, UPI ID, or domain..."
          className="w-full pl-12 pr-12 py-3.5 bg-slate-900 text-slate-100 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/80 focus:border-emerald-500 shadow-2xl placeholder-slate-400 text-sm font-medium transition"
        />
        {loading && (
          <div className="absolute right-4 w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>

      {/* Quick Search Intel Presets */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Quick Intel Queries:</span>
        {EXAMPLE_SEARCHES.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickSearch(item.query)}
            className="px-2.5 py-1 bg-slate-900/90 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-slate-800 hover:border-emerald-700/60 rounded-lg transition text-[11px] font-mono flex items-center gap-1"
          >
            <span>🔍</span> {item.label}
          </button>
        ))}
      </div>

      {/* Autocomplete Dropdown */}
      {results.length > 0 && (
        <ul className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700/90 rounded-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto divide-y divide-slate-800/80">
          {results.map((entity) => (
            <li
              key={entity.id}
              onClick={() => {
                onSelectEntity(entity);
                setQuery(entity.name || entity.value);
                setResults([]);
              }}
              className="px-4 py-3.5 hover:bg-slate-800/90 cursor-pointer flex justify-between items-center transition"
            >
              <div className="flex items-center space-x-3">
                <span className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400">
                  {entity.type === 'Indicator' ? <Key className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                </span>
                <div>
                  <div className="font-semibold text-slate-100 text-sm">{entity.name || entity.value}</div>
                  <div className="text-xs text-slate-400">
                    {entity.indicatorType || entity.originRegion || 'Cyber Crime Entity'}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 bg-slate-950 text-emerald-400 border border-emerald-900/60 rounded-md font-mono">
                {entity.type}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
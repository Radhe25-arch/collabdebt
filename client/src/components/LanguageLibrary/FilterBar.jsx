import React from 'react';
import { Filter, X } from 'lucide-react';

export default function FilterBar({ filters, setFilters, paradigmOptions, usageOptions, difficultyOptions }) {
  const toggleFilter = (key, value) => {
    setFilters(prev => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const clearFilters = () => {
    setFilters({ paradigm: [], usage: [], difficulty: [], search: "" });
  };

  const hasFilters = filters.paradigm.length > 0 || filters.usage.length > 0 || filters.difficulty.length > 0;

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="SEARCH 250+ LANGUAGES..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-[4px] px-4 py-2.5 text-white placeholder:text-[#333] focus:outline-none focus:border-cyber transition-all font-mono text-xs"
          />
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-3 py-2 text-crimson hover:text-white transition-colors font-mono text-[10px] font-black uppercase tracking-wider"
          >
            <X size={12} /> CLEAR FILTERS
          </button>
        )}
      </div>

      {/* Filter Groups */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Paradigm */}
        <div className="space-y-2">
          <label className="font-mono text-[9px] font-black text-[#555] uppercase tracking-[0.2em] block mb-2">BY PARADIGM</label>
          <div className="flex flex-wrap gap-1.5 h-24 overflow-y-auto custom-scrollbar pr-2">
            {paradigmOptions.map(p => (
              <button
                key={p}
                onClick={() => toggleFilter('paradigm', p)}
                className={`px-2 py-1 rounded-[2px] font-mono text-[9px] font-bold uppercase transition-all border ${
                  filters.paradigm.includes(p) 
                    ? 'bg-cyber/20 border-cyber text-cyber' 
                    : 'bg-white/[0.02] border-white/[0.06] text-[#444] hover:text-white hover:border-white/20'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Usage */}
        <div className="space-y-2">
          <label className="font-mono text-[9px] font-black text-[#555] uppercase tracking-[0.2em] block mb-2">BY USAGE</label>
          <div className="flex flex-wrap gap-1.5 h-24 overflow-y-auto custom-scrollbar pr-2">
            {usageOptions.map(u => (
              <button
                key={u}
                onClick={() => toggleFilter('usage', u)}
                className={`px-2 py-1 rounded-[2px] font-mono text-[9px] font-bold uppercase transition-all border ${
                  filters.usage.includes(u) 
                    ? 'bg-emerald/20 border-emerald text-emerald' 
                    : 'bg-white/[0.02] border-white/[0.06] text-[#444] hover:text-white hover:border-white/20'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <label className="font-mono text-[9px] font-black text-[#555] uppercase tracking-[0.2em] block mb-2">BY DIFFICULTY</label>
          <div className="flex flex-wrap gap-1.5">
            {difficultyOptions.map(d => (
              <button
                key={d}
                onClick={() => toggleFilter('difficulty', d)}
                className={`px-3 py-1.5 rounded-[2px] font-mono text-[9px] font-bold uppercase transition-all border ${
                  filters.difficulty.includes(d) 
                    ? 'bg-violet/20 border-violet text-violet' 
                    : 'bg-white/[0.02] border-white/[0.06] text-[#444] hover:text-white hover:border-white/20'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

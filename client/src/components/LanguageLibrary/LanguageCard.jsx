import React from 'react';
import { ChevronRight, Calendar, User } from 'lucide-react';

export default function LanguageCard({ lang, onClick }) {
  // 4-tier progress mockup (real integration would check user enrollment)
  const progress = [0, 0, 0, 0]; 

  return (
    <div 
      onClick={() => onClick(lang)}
      className="blade p-4 group cursor-pointer hover:border-cyber/40 transition-all duration-300 relative overflow-hidden"
    >
      {/* Accent on hover */}
      <div className="absolute top-0 left-0 w-[2px] h-0 bg-cyber group-hover:h-full transition-all duration-300" />
      
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-black text-lg text-white uppercase tracking-tight group-hover:text-cyber transition-colors">
          {lang.name}
        </h3>
        <span className="font-mono text-[10px] font-black text-[#333] group-hover:text-[#666] tracking-[0.1em]">
          EST. {lang.year}
        </span>
      </div>

      <p className="text-[#555] text-xs leading-relaxed line-clamp-2 h-8 mb-4">
        {lang.description}
      </p>

      {/* 4-Tier Visualizer */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4].map((tier) => (
          <div 
            key={tier} 
            className="flex-1 h-[3px] rounded-[1px] relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <div 
              className="absolute inset-0 bg-cyber/40 w-0 group-hover:w-full transition-all duration-700 delay-[tier*100ms]" 
              style={{ transitionDelay: `${tier * 100}ms` }}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {lang.paradigms.slice(0, 2).map(p => (
          <span 
            key={p} 
            className="px-1.5 py-0.5 rounded-[1px] bg-white/[0.02] border border-white/[0.04] font-mono text-[8px] font-bold text-[#444] uppercase tracking-wider"
          >
            {p}
          </span>
        ))}
        {lang.paradigms.length > 2 && (
          <span className="font-mono text-[8px] font-bold text-[#333]">+ {lang.paradigms.length - 2}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
        <div className="flex items-center gap-1.5">
          <User size={10} className="text-[#333]" />
          <span className="font-mono text-[9px] font-bold text-[#444] uppercase truncate max-w-[100px]">
            {lang.creator}
          </span>
        </div>
        <ChevronRight size={14} className="text-[#333] group-hover:text-cyber group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
}

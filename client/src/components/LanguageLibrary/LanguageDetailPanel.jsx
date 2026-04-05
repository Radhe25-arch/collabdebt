import React from 'react';
import { X, Play, BookOpen, Layers, Shield, Zap, ArrowRight, CornerDownRight } from 'lucide-react';
import { Button, BadgeTag } from '@/components/ui';

export default function LanguageDetailPanel({ lang, onClose, onStartLearning }) {
  if (!lang) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-black/80 backdrop-blur-xl border-l border-white/[0.08] z-50 p-6 flex flex-col shadow-2xl animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="font-mono text-[10px] font-black text-cyber uppercase tracking-[0.2em] block mb-2 underline decoration-cyber/30 underline-offset-4">
            SYLLABUS // {lang.year}
          </span>
          <h2 className="font-black text-4xl text-white uppercase tracking-tight leading-none mb-4 group lowercase">
            {lang.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {lang.paradigms.map(p => <BadgeTag key={p} variant="gray">{p}</BadgeTag>)}
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-white/10 rounded-[4px] transition-colors text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Description */}
      <p className="text-[#666] text-sm leading-relaxed mb-8">
        {lang.description}
      </p>

      {/* Curriculum Tiers */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
        {[1, 2, 3, 4].map((level) => {
          const tier = lang.tier[level];
          return (
            <div key={level} className="blade p-4 group hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 rounded-[2px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-mono text-[10px] font-black text-white">
                  L{level}
                </div>
                <h4 className="font-mono text-[11px] font-black text-[#555] uppercase tracking-widest group-hover:text-white transition-colors">
                  {tier.title}
                </h4>
              </div>
              <ul className="space-y-1.5 ml-9">
                {tier.topics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CornerDownRight size={10} className="text-[#333] mt-1 shrink-0" />
                    <span className="text-[12px] text-[#444] group-hover:text-[#888] font-medium leading-tight">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Footer / CTA */}
      <div className="mt-8 pt-6 border-t border-white/[0.08]">
        <Button 
          variant="primary" 
          fullWidth 
          size="lg"
          onClick={() => onStartLearning(lang)}
        >
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center gap-2">
              <Zap size={14} className="fill-current" />
              START MASTERING {lang.name}
            </span>
            <ArrowRight size={14} />
          </div>
        </Button>
        <p className="text-center font-mono text-[9px] text-[#333] uppercase tracking-[0.2em] mt-4">
          ESTIMATED COMPLETION: 18.4 HOURS
        </p>
      </div>
    </div>
  );
}

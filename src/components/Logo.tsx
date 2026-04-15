import React from 'react';
import { Terminal } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 font-display font-bold tracking-tighter ${className}`}>
      <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
        <Terminal size={20} strokeWidth={2.5} />
      </div>
      <span>SkillForge</span>
    </div>
  );
}

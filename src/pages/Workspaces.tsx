import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Cloud, Terminal, Play, Settings2, Clock, Cpu, MemoryStick, ChevronRight, Share2, StopCircle } from 'lucide-react';

const WORKSPACES = [
  { id: 1, name: "Rust Concurrency Project", env: "Rust 1.75 + Cargo", status: "running", time: "Active now", cpu: "45%", ram: "1.2GB", color: "from-orange-500" },
  { id: 2, name: "Go Microservices", env: "Go 1.21 + Docker", status: "stopped", time: "Last used 2 days ago", cpu: "-", ram: "-", color: "from-blue-400" },
  { id: 3, name: "React Frontend Migration", env: "Node 20 + Vite", status: "stopped", time: "Last used 1 week ago", cpu: "-", ram: "-", color: "from-indigo-400" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function Workspaces() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <Cloud className="text-indigo-500" size={32} /> Cloud Workspaces
          </h1>
          <p className="text-zinc-500 mt-2 font-mono text-sm tracking-wide">Instant, fully-configured, isolated development environments.</p>
        </div>
        <button className="group relative overflow-hidden rounded-xl bg-white text-black font-mono font-bold px-6 py-3 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          <div className="flex items-center gap-2">
            <Terminal size={18} /> New Workspace
          </div>
        </button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {WORKSPACES.map((ws) => (
          <motion.div 
            key={ws.id}
            variants={itemVariants}
            className={`group rounded-2xl border transition-all duration-300 flex flex-col bg-zinc-950/50 backdrop-blur-xl relative overflow-hidden ${
              ws.status === 'running' 
                ? 'border-indigo-500/30 hover:border-indigo-500/60 shadow-[0_0_30px_rgba(79,70,229,0.05)]' 
                : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'
            }`}
          >
            {/* Top gradient bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${ws.color} to-transparent opacity-50`} />

            <div className="p-6 pb-0 flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                  ws.status === 'running' 
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}>
                  <Terminal size={24} />
                </div>
                <Badge variant="outline" className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 ${
                  ws.status === 'running' 
                    ? 'border-green-500/30 bg-green-500/10 text-green-400 flex items-center gap-1.5' 
                    : 'border-zinc-700 bg-black text-zinc-500'
                }`}>
                  {ws.status === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                  {ws.status === 'running' ? 'Running' : 'Stopped'}
                </Badge>
              </div>
              
              <h3 className="text-xl font-display font-medium text-white mb-2 group-hover:text-indigo-400 transition-colors">
                {ws.name}
              </h3>
              <p className="text-xs text-zinc-500 font-mono mb-6">{ws.env}</p>

              {ws.status === 'running' && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 bg-black/40 border border-zinc-800/80 rounded-xl">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-zinc-500 mb-1.5 font-mono">
                      <Cpu size={12} /> Compute
                    </div>
                    <div className="text-sm font-mono text-zinc-300 font-medium">
                      {ws.cpu} <span className="text-green-500 text-xs ml-1">Normal</span>
                    </div>
                  </div>
                  <div className="p-3 bg-black/40 border border-zinc-800/80 rounded-xl">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-zinc-500 mb-1.5 font-mono">
                      <MemoryStick size={12} /> Memory
                    </div>
                    <div className="text-sm font-mono text-zinc-300 font-medium">
                      {ws.ram} <span className="text-zinc-600 text-xs ml-1">/ 8GB</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 pb-4">
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-4">
                <Clock size={12} /> {ws.time}
              </div>
              
              <div className="flex gap-3">
                {ws.status === 'running' ? (
                  <>
                    <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2.5 text-sm font-mono font-bold transition-colors flex items-center justify-center gap-2">
                      Enter IDE <ChevronRight size={16} />
                    </button>
                    <button className="w-11 h-11 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-red-400 transition-colors" title="Stop">
                      <StopCircle size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button className="flex-1 bg-white hover:bg-zinc-200 text-black rounded-xl py-2.5 text-sm font-mono font-bold transition-colors flex items-center justify-center gap-2">
                      <Play size={16} className="fill-current" /> Start
                    </button>
                    <button className="w-11 h-11 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                      <Settings2 size={18} />
                    </button>
                  </>
                )}
                <button className="w-11 h-11 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

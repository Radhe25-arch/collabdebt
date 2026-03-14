'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  GitBranch, 
  Box, 
  Shield, 
  Activity, 
  Zap, 
  Code2, 
  Terminal,
  ExternalLink,
  ChevronRight,
  Search,
  AlertCircle
} from 'lucide-react'

const REPOS = [
  {
    id: '1',
    name: 'collabdebt-core',
    url: 'https://github.com/collabdebt/core',
    health: 92,
    stack: ['TypeScript', 'Next.js', 'Prisma', 'PostgreSQL'],
    debtCount: 4,
    lastScan: '2m ago'
  },
  {
    id: '2',
    name: 'analytics-engine',
    url: 'https://github.com/collabdebt/analytics',
    health: 64,
    stack: ['Rust', 'Python', 'AWS Lambda'],
    debtCount: 18,
    lastScan: '1h ago'
  },
  {
    id: '3',
    name: 'cli-tooling',
    url: 'https://github.com/collabdebt/cli',
    health: 81,
    stack: ['Go', 'Cobra'],
    debtCount: 7,
    lastScan: '4h ago'
  }
]

export default function ReposPage() {
  const [showConnect, setShowConnect] = useState(false)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-1 uppercase">Repository Fleet</h2>
          <p className="text-zinc-500 font-medium text-sm">Managing {REPOS.length} active service units.</p>
        </div>
        <button 
          onClick={() => setShowConnect(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-500 text-white font-black text-sm hover:bg-indigo-600 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
        >
          <Plus size={18} />
          CONNECT REPOSITORY
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {REPOS.map((repo, i) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-zinc-900/40 border border-white/5 rounded-[32px] p-8 flex flex-col lg:flex-row lg:items-center gap-8 card-hover"
          >
            {/* Health Radial (Simplified) */}
            <div className="relative flex-shrink-0">
               <div className="w-24 h-24 rounded-full border-[6px] border-zinc-800 flex items-center justify-center relative">
                  <div className="text-2xl font-black text-white">{repo.health}</div>
                  <div className="text-[10px] font-black text-zinc-500 absolute -bottom-4 bg-zinc-900 px-2 rounded-full border border-white/5 uppercase">HEALTH</div>
                  {/* Dynamic Ring */}
                  <svg className="absolute inset-0 -rotate-90 w-full h-full">
                    <circle 
                      cx="48" cy="48" r="45" 
                      fill="transparent" 
                      stroke={repo.health > 80 ? '#6366f1' : repo.health > 50 ? '#f59e0b' : '#ef4444'} 
                      strokeWidth="6" 
                      strokeDasharray="283" 
                      strokeDashoffset={283 - (283 * repo.health) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
               </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors">{repo.name}</h3>
                <a href={repo.url} target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-white transition-colors">
                  <ExternalLink size={16} />
                </a>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {repo.stack.map(tech => (
                  <span key={tech} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 group-hover:text-indigo-400 transition-all">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-zinc-800 text-indigo-400">
                    <Shield size={14} />
                  </div>
                  <div className="text-xs font-bold">
                    <div className="text-white">{repo.debtCount} Items</div>
                    <div className="text-zinc-600 uppercase text-[9px]">Debt Detected</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-zinc-800 text-emerald-400">
                    <Activity size={14} />
                  </div>
                  <div className="text-xs font-bold">
                    <div className="text-white">Active</div>
                    <div className="text-zinc-600 uppercase text-[9px]">Activity Pulse</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-zinc-800 text-amber-400">
                    <Zap size={14} />
                  </div>
                  <div className="text-xs font-bold">
                    <div className="text-white">{repo.lastScan}</div>
                    <div className="text-zinc-600 uppercase text-[9px]">Last Intelligence Scan</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex lg:flex-col gap-3">
               <button className="flex-1 lg:flex-initial px-6 py-3 rounded-xl bg-zinc-800 text-white font-black text-xs hover:bg-zinc-700 transition-all">
                  VIEW REPORT
               </button>
               <button className="flex-1 lg:flex-initial px-6 py-3 rounded-xl bg-white text-black font-black text-xs hover:bg-zinc-200 transition-all shadow-xl">
                  SCAN NOW
               </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showConnect && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConnect(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-2xl" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[48px] p-12 overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
              
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-indigo-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl mb-6 -rotate-6">
                  <GitBranch size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Connect Repository</h3>
                <p className="text-zinc-500 font-medium">Link your repository for automated analysis.</p>
              </div>

              <div className="space-y-4">
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input 
                      type="text" 
                      placeholder="github.com/org/repo-name"
                      className="w-full bg-black/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white font-mono text-sm outline-none focus:border-indigo-500/50 transition-all"
                    />
                 </div>
                 <div className="flex gap-3">
                   <button className="flex-1 py-4 rounded-2xl bg-zinc-800 text-zinc-400 font-black text-sm uppercase tracking-widest hover:text-white transition-all">Cancel</button>
                   <button className="flex-[2] py-4 rounded-2xl bg-indigo-500 text-white font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl">Initialize Uplink</button>
                 </div>
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-3">
                 <AlertCircle className="text-indigo-400" size={18} />
                 <p className="text-[10px] font-black text-indigo-400/80 uppercase tracking-wider leading-relaxed">
                   CollabDebt requires read access to your codebase to quantify debt markers and architectural drift.
                 </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { 
  Activity, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Plus, 
  Target, 
  Zap,
  TrendingDown,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'

const SPRINTS = [
  {
    id: '1',
    name: 'Velocity Surge Q2-W3',
    status: 'Active',
    start: 'Mar 10',
    end: 'Mar 24',
    progress: 68,
    resolved: 14,
    remaining: 6,
    health: 'Stable'
  },
  {
    id: '2',
    name: 'Core Refactor Cycle',
    status: 'Upcoming',
    start: 'Mar 26',
    end: 'Apr 08',
    progress: 0,
    resolved: 0,
    remaining: 12,
    health: 'Planned'
  },
  {
    id: '3',
    name: 'Security Shield Audit',
    status: 'Historical',
    start: 'Feb 24',
    end: 'Mar 09',
    progress: 100,
    resolved: 22,
    remaining: 0,
    health: 'Resolved'
  }
]

export default function SprintsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-1 uppercase text-gradient-indigo">Execution Cycles</h2>
          <p className="text-zinc-500 font-medium text-sm">Managing operational sprints for debt resolution.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-500 text-white font-black text-sm hover:bg-indigo-600 transition-all shadow-xl">
          <Plus size={18} />
          INITIALIZE CYCLE
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {SPRINTS.map((sprint, i) => (
          <motion.div
            key={sprint.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-8 rounded-[40px] border transition-all card-hover group relative overflow-hidden ${
              sprint.status === 'Active' 
                ? 'bg-zinc-900/60 border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.1)]' 
                : 'bg-zinc-900/20 border-white/5'
            }`}
          >
            {sprint.status === 'Active' && (
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
            )}

            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
              {/* Progress Circle Visual */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full border-[4px] border-zinc-800 flex items-center justify-center relative">
                  <span className="text-lg font-black text-white">{sprint.progress}%</span>
                  <svg className="absolute inset-0 -rotate-90 w-full h-full">
                    <circle 
                      cx="40" cy="40" r="38" 
                      fill="transparent" 
                      stroke={sprint.status === 'Active' ? '#6366f1' : '#27272a'} 
                      strokeWidth="4" 
                      strokeDasharray="238" 
                      strokeDashoffset={238 - (238 * sprint.progress) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{sprint.name}</h3>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                    sprint.status === 'Active' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' :
                    sprint.status === 'Upcoming' ? 'bg-amber-500/10 border-amber-500 text-amber-500' :
                    'bg-zinc-800 border-white/5 text-zinc-500'
                  }`}>
                    {sprint.status}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">
                   <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {sprint.start} — {sprint.end}
                   </div>
                   <div className="flex items-center gap-1.5">
                      <Target size={12} className="text-indigo-500" />
                      {sprint.resolved} NEUTRALIZED
                   </div>
                   <div className="flex items-center gap-1.5">
                      <Activity size={12} className="text-rose-500" />
                      {sprint.remaining} REMAINING
                   </div>
                </div>

                <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${sprint.progress}%` }}
                     className={`h-full rounded-full transition-all ${
                       sprint.status === 'Active' ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)]' : 'bg-zinc-700'
                     }`}
                   />
                </div>
              </div>

              <div className="flex lg:flex-col gap-3">
                 <button className="flex-1 lg:flex-initial px-6 py-3 rounded-xl bg-zinc-800 text-white font-black text-xs hover:bg-zinc-700 transition-all uppercase tracking-widest">
                    SYNC STATUS
                 </button>
                 <button className={`flex-1 lg:flex-initial px-6 py-3 rounded-xl font-black text-xs transition-all uppercase tracking-widest ${
                   sprint.status === 'Active' ? 'bg-white text-black hover:bg-zinc-200 shadow-xl' : 'bg-zinc-900 border border-white/5 text-zinc-500'
                 }`}>
                    VIEW DETAILS
                 </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-10 rounded-[48px] bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden group">
         <div className="relative z-10 max-w-2xl">
            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Intelligence Suggestion</h3>
            <p className="text-zinc-500 font-medium mb-8 leading-relaxed">
              Based on your current velocity and debt load in <span className="text-indigo-400 font-bold">core-api</span>, we suggest initializing a 10-day sprint focusing on <span className="text-white font-bold">authentication bottlenecks</span>. This could resolve 24% of your total debt cost.
            </p>
            <button className="px-8 py-4 rounded-2xl bg-indigo-500 text-white font-black text-sm hover:bg-indigo-600 transition-all shadow-2xl flex items-center gap-3">
               INITIALIZE RECOMMENDED CYCLE
               <ArrowRight size={18} />
            </button>
         </div>
         <TrendingDown className="absolute -bottom-10 -right-10 text-indigo-500/10" size={300} />
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  MoreHorizontal, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Search,
  Filter,
  BarChart2,
  GitBranch,
  Terminal,
  Zap,
  User,
  Layers
} from 'lucide-react'

const COLUMNS = [
  { id: 'detected', label: 'Detected', color: 'indigo' },
  { id: 'triaged', label: 'Triaged', color: 'amber' },
  { id: 'in_progress', label: 'In Progress', color: 'blue' },
  { id: 'resolved', label: 'Resolved', color: 'emerald' },
]

const INITIAL_DEBT = [
  { 
    id: '1', 
    title: 'Deprecated JWT Provider', 
    repo: 'core-api', 
    severity: 'high', 
    status: 'detected', 
    cost: '2d',
    tags: ['Security', 'Infra']
  },
  { 
    id: '2', 
    title: 'N+1 Query in Customer GraphQL', 
    repo: 'web-gateway', 
    severity: 'critical', 
    status: 'in_progress', 
    cost: '3d',
    tags: ['Performance']
  },
  { 
    id: '3', 
    title: 'Refactor Legacy Payment Handler', 
    repo: 'billing-service', 
    severity: 'medium', 
    status: 'triaged', 
    cost: '5d',
    tags: ['Refactor']
  },
  { 
    id: '4', 
    title: 'Redundant Redux Action Types', 
    repo: 'frontend-main', 
    severity: 'low', 
    status: 'resolved', 
    cost: '1d',
    tags: ['DX']
  },
  { 
    id: '5', 
    title: 'Missing Error Boundary in Dashboard', 
    repo: 'frontend-main', 
    severity: 'medium', 
    status: 'detected', 
    cost: '4h',
    tags: ['UI/UX']
  },
]

export default function DebtBoardPage() {
  const [items, setItems] = useState(INITIAL_DEBT)

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-6">
      {/* Board Header / Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
            <input 
              type="text" 
              placeholder="Search debt items..."
              className="bg-zinc-900/50 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:border-indigo-500/50 outline-none w-64 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white transition-all">
            <Filter size={14} />
            <span className="text-xs font-bold">Filters</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white font-black text-xs hover:bg-indigo-600 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Plus size={16} />
            REPORT DEBT
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {COLUMNS.map((col) => (
          <div key={col.id} className="min-w-[320px] flex flex-col bg-zinc-900/20 rounded-[32px] border border-white/5 overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  col.color === 'indigo' ? 'bg-indigo-500' : 
                  col.color === 'amber' ? 'bg-amber-500' : 
                  col.color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'
                }`} />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">{col.label}</h3>
                <span className="text-[10px] font-black text-zinc-600 bg-zinc-800/50 px-2 py-0.5 rounded-full border border-white/5">
                  {items.filter(i => i.status === col.id).length}
                </span>
              </div>
              <button className="text-zinc-600 hover:text-white">
                <Plus size={16} />
              </button>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto no-scrollbar">
              <AnimatePresence>
                {items
                  .filter(i => i.status === col.id)
                  .map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.02 }}
                      className="group p-5 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-indigo-500/50 cursor-grab active:cursor-grabbing transition-all shadow-xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                         <MoreHorizontal size={14} className="text-zinc-500 hover:text-white" />
                      </div>
                      
                      <div className="flex gap-2 mb-3">
                        {item.tags.map(tag => (
                          <span key={tag} className="text-[9px] font-black text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h4 className="text-sm font-bold text-white mb-4 leading-snug group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h4>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-zinc-600">
                             <GitBranch size={12} />
                             <span className="text-[10px] font-bold uppercase">{item.repo}</span>
                          </div>
                          <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${
                             item.severity === 'critical' ? 'text-rose-500' : 
                             item.severity === 'high' ? 'text-amber-500' : 'text-zinc-500'
                          }`}>
                             <AlertTriangle size={10} />
                             {item.severity}
                          </div>
                        </div>
                        
                        <div className="flex -space-x-2">
                           <div className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center">
                              <User size={12} className="text-zinc-500" />
                           </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-zinc-600">
                         <div className="flex items-center gap-1">
                            <Clock size={10} />
                            EST: {item.cost}
                         </div>
                         <div className="flex items-center gap-1 text-emerald-500/50">
                            <Zap size={10} />
                            ROI: 2.4x
                         </div>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
        
        {/* Add Suggestion Column */}
        <div className="min-w-[320px] flex flex-col bg-zinc-950/20 border border-white/5 border-dashed rounded-[32px] p-8 items-center justify-center text-center group cursor-pointer hover:bg-zinc-900/10 transition-all">
           <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-600 group-hover:scale-110 group-hover:text-indigo-400 group-hover:border-indigo-500/50 transition-all mb-4">
              <Plus size={24} />
           </div>
           <h3 className="font-bold text-zinc-500 uppercase tracking-widest text-xs">Add Workspace</h3>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { Zap, Plus, ChevronDown, ChevronRight, Sparkles, Calendar, CheckCircle, Clock, Activity, Target, BrainCircuit, History, X, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'

export default function SprintsPage() {
  const { sprints, debtItems } = useStore()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showNewSprint, setShowNewSprint] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  const activeSprint = useMemo(() => sprints.find(s => s.status === 'active'), [sprints])
  const pastSprints = useMemo(() => sprints.filter(s => s.status === 'completed'), [sprints])

  const sprintProgress = useMemo(() => {
    if (!activeSprint) return { progress: 0, daysRemaining: 0 }
    const start = new Date(activeSprint.start_date).getTime()
    const end = new Date(activeSprint.end_date).getTime()
    const now = new Date().getTime()
    const total = end - start
    const elapsed = now - start
    const progress = Math.min(100, Math.max(0, (elapsed / total) * 100))
    const daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)))
    return { progress, daysRemaining }
  }, [activeSprint])

  const velocity = useMemo(() => {
    // Simple velocity: average fixed items per completed sprint
    if (pastSprints.length === 0) return 42.8
    const totalFixed = debtItems.filter(d => 
      pastSprints.some(s => s.id === d.sprint_id) && d.status === 'fixed'
    ).length
    return (totalFixed / pastSprints.length * 10).toFixed(1)
  }, [pastSprints, debtItems])

  const handleAI = () => {
    setAiLoading(true)
    setTimeout(() => setAiLoading(false), 2500)
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-[0.2em]">
            <Clock size={14} /> Temporal Dynamics
          </div>
          <h1 className="text-4xl font-display font-black text-white tracking-tighter">Cycle <span className="text-gradient-yellow">Phases.</span></h1>
        </div>
        <div className="flex items-center gap-3">
           <div className="glass-card px-4 py-2 flex items-center gap-2 text-xs font-bold text-slate-400">
              <Activity size={14} className="text-yellow-400" /> Current Velocity: {velocity} pts
           </div>
           <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={() => setShowNewSprint(true)} 
             className="btn-primary-yellow px-6 py-2.5 text-sm shadow-[0_0_20px_rgba(234,179,8,0.2)]"
           >
             <Plus size={16} /> Initiate Cycle
           </motion.button>
        </div>
      </div>

      {/* Active Phase Unit */}
      {activeSprint && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass shadow-2xl rounded-[32px] p-8 relative overflow-hidden group border border-white/10"
        >
          {/* Animated Background Pulse */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/[0.03] to-transparent pointer-events-none" />
          <motion.div 
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 blur-[100px] -mr-32 -mt-32 rounded-full"
          />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[24px] glass border-yellow-500/20 flex items-center justify-center text-yellow-500 shadow-xl group-hover:scale-110 transition-transform">
                <Zap size={32} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">{activeSprint.name}</h2>
                  <span className="badge-yellow text-[9px] font-black tracking-widest px-3">ACTIVE PHASE</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={12} className="text-yellow-400/60" />
                  {new Date(activeSprint.start_date).toLocaleDateString()} — {new Date(activeSprint.end_date).toLocaleDateString()}
                  <span className="w-1 h-1 rounded-full bg-slate-700 mx-1" />
                  {sprintProgress.daysRemaining} Cycles Remaining
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {[
                { label: 'Total Load', value: debtItems.filter(d => d.sprint_id === activeSprint.id).length, color: 'white' },
                { label: 'Active Repairs', value: debtItems.filter(d => d.sprint_id === activeSprint.id && d.status === 'in_progress').length, color: '#fbbf24' },
                { label: 'Stabilized', value: debtItems.filter(d => d.sprint_id === activeSprint.id && d.status === 'fixed').length, color: '#10b981' },
              ].map(s => (
                <div key={s.label} className="glass p-4 rounded-2xl min-w-[120px] border-white/5">
                  <div className="text-2xl font-display font-black" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Temporal Progress Tracker */}
          <div className="space-y-4">
             <div className="flex justify-between items-end">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temporal Progress</p>
                   <h3 className="text-sm font-bold text-white uppercase">{Math.round(sprintProgress.progress)}% Completion</h3>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phase Orbit</p>
                   <p className="text-xs font-mono font-bold text-yellow-400">{14 - sprintProgress.daysRemaining} / 14 SOLS</p>
                </div>
             </div>
             <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${sprintProgress.progress}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ 
                    background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                    boxShadow: '0 0 20px rgba(245,158,11,0.5)'
                  }}
                >
                   {/* Animated Flow Effect */}
                   <motion.div 
                     animate={{ x: ['0%', '100%'] }}
                     transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                     className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                   />
                </motion.div>
             </div>
          </div>
        </motion.div>
      )}

      {/* Neural Insights Section */}
      {activeSprint?.ai_recommendation && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 border-yellow-500/20 relative overflow-hidden group shadow-[0_0_50px_rgba(234,179,8,0.05)]"
        >
          {/* Holographic Texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
          
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-14 h-14 rounded-2xl glass border-yellow-500/30 flex items-center justify-center text-yellow-400 relative">
               <BrainCircuit size={28} />
               <motion.div 
                 animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="absolute inset-0 rounded-2xl border border-yellow-400/40"
               />
            </div>
            <div className="flex-1 space-y-4">
               <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1 flex items-center gap-2">
                     Neural Insight Generator <Sparkles size={14} className="text-yellow-400" />
                  </h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed italic border-l-2 border-yellow-500/20 pl-4 py-1">
                    "{activeSprint.ai_recommendation}"
                  </p>
               </div>
               
               <div className="flex flex-wrap gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAI} 
                    disabled={aiLoading} 
                    className="btn-primary-yellow px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-yellow-500/10"
                  >
                    {aiLoading ? (
                      <span className="flex items-center gap-3">
                        <RefreshCw size={14} className="animate-spin" /> Recalibrating Cores...
                      </span>
                    ) : (
                      <><Target size={14} /> Commit AI Directive</>
                    )}
                  </motion.button>
                  <button className="glass px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all">
                     View Alternatives
                  </button>
               </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Archives Section */}
      <div className="glass-card p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <History size={16} className="text-slate-500" /> Cycle Archives
           </h2>
           <div className="badge-cyan text-[8px] font-black uppercase tracking-widest px-2">v4.2 Protocol</div>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar-horizontal">
           <table className="w-full">
              <thead>
                 <tr className="border-b border-white/5">
                    {['Phase Designation', 'Temporal Range', 'Cores Fixed', 'Stability', ''].map(h => (
                      <th key={h} className="text-left py-4 px-4 text-[9px] font-black uppercase tracking-widest text-slate-500">{h}</th>
                    ))}
                 </tr>
              </thead>
              <tbody>
                 <AnimatePresence mode="popLayout">
                    {pastSprints.map((sprint, i) => (
                      <motion.tr 
                        key={sprint.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                        onClick={() => setExpanded(expanded === sprint.name ? null : sprint.name)}
                      >
                        <td className="py-5 px-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg glass border-white/5 flex items-center justify-center text-slate-500 group-hover:text-yellow-400 group-hover:border-yellow-500/20 transition-all">
                                 < Zap size={16} />
                              </div>
                              <span className="text-xs font-black text-white uppercase tracking-tight">{sprint.name}</span>
                           </div>
                        </td>
                        <td className="py-5 px-4 font-mono text-[10px] text-slate-500">
                           {new Date(sprint.start_date).toLocaleDateString()} — {new Date(sprint.end_date).toLocaleDateString()}
                        </td>
                        <td className="py-5 px-4">
                           <span className="text-xs font-black text-emerald-400">
                              {debtItems.filter(d => d.sprint_id === sprint.id && d.status === 'fixed').length} Fxd
                           </span>
                        </td>
                        <td className="py-5 px-4">
                           <span className="badge-low text-[9px] font-black tracking-widest">NEUTRALIZED</span>
                        </td>
                        <td className="py-5 px-4 text-right">
                           <div className="w-8 h-8 rounded-lg glass flex items-center justify-center text-slate-600 group-hover:text-white transition-colors">
                             {expanded === sprint.name ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                           </div>
                        </td>
                      </motion.tr>
                    ))}
                 </AnimatePresence>
              </tbody>
           </table>
        </div>
      </div>

      {/* Cycle Initiation Modal */}
      <AnimatePresence>
        {showNewSprint && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) setShowNewSprint(false) }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="glass border-white/10 max-w-lg w-full rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                 <X size={20} className="text-slate-600 cursor-pointer hover:text-white transition-colors" onClick={() => setShowNewSprint(false)} />
              </div>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-[24px] glass border-yellow-500/20 flex items-center justify-center mx-auto text-yellow-400 mb-4 shadow-xl">
                   <Target size={32} />
                </div>
                <h2 className="text-xl font-display font-black text-white uppercase tracking-tight">Cycle Initiation</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Deploy New Temporal Phase</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Phase Designation</label>
                  <input className="glass-card w-full p-4 text-sm font-bold bg-transparent outline-none focus:ring-1 focus:ring-yellow-500/30 text-white placeholder:text-slate-700" placeholder="e.g. CYCLE_DELTA_14" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Epoch Start</label>
                    <input className="glass-card w-full p-4 text-xs font-bold bg-transparent outline-none focus:ring-1 focus:ring-yellow-500/30 text-white" type="date" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Epoch End</label>
                    <input className="glass-card w-full p-4 text-xs font-bold bg-transparent outline-none focus:ring-1 focus:ring-yellow-500/30 text-white" type="date" />
                  </div>
                </div>
                <div className="pt-4 flex gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary-yellow flex-1 py-4 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-yellow-500/20"
                  >
                    Authorize Cycle
                  </motion.button>
                  <button onClick={() => setShowNewSprint(false)} className="glass px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white">Abort</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

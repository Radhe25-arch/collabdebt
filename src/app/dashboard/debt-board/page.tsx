'use client'

import { useState, useMemo } from 'react'
import { ThumbsUp, Filter, Plus, X, ExternalLink, User, GitPullRequest, MessageSquare, Loader2, Sparkles, Box, History, Clock } from 'lucide-react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useStore } from '@/store/useStore'
import type { DebtItem, DebtSeverity, DebtStatus } from '@/types'

const COLUMNS: { id: DebtStatus; label: string; color: string; desc: string }[] = [
  { id: 'identified', label: 'ANOMALY', color: '#94a3b8', desc: 'Awaiting classification' },
  { id: 'planned', label: 'ORBITAL', color: '#00f2ff', desc: 'Slotted for fixing' },
  { id: 'in_progress', label: 'UNSTABLE', color: '#ffd600', desc: 'Core repair active' },
  { id: 'fixed', label: 'STABLE', color: '#00ff88', desc: 'Neutralized' },
]

function SeverityBadge({ s }: { s: DebtSeverity }) {
  const cls = s === 'critical' ? 'badge-critical' : s === 'high' ? 'badge-high' : s === 'medium' ? 'badge-medium' : 'badge-low'
  return <span className={`${cls} text-[9px] font-black uppercase tracking-[0.1em]`}>{s}</span>
}

function DebtCard({ item, onClick }: { item: DebtItem; onClick: () => void }) {
  const { updateDebtItem } = useStore()
  const [voted, setVoted] = useState(false)
  
  const handleVote = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!voted) {
      updateDebtItem(item.id, { votes: (item.votes || 0) + 1 })
      setVoted(true)
    }
  }

  const glowColor = item.severity === 'critical' ? 'rgba(255,59,92,0.15)' : 'rgba(0,242,255,0.05)'

  return (
    <motion.div 
      layoutId={item.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, boxShadow: `0 10px 30px ${glowColor}` }}
      className="glass-card group p-5 cursor-pointer relative overflow-hidden transition-all duration-500" 
      onClick={onClick}
    >
      {/* Dynamic Glow Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="flex items-start justify-between gap-4 mb-4">
        <SeverityBadge s={item.severity} />
        <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
           <Clock size={10} className="text-slate-500" />
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.fix_days}d Est</span>
        </div>
      </div>

      <h3 className="text-sm font-bold text-white mb-2 leading-relaxed group-hover:text-cyan-400 transition-colors">{item.title}</h3>
      <div className="flex items-center gap-2 mb-4">
         <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/40" />
         <p className="font-mono text-[10px] text-slate-500 truncate">{item.file_path}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={handleVote}
          className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg transition-all ${voted ? 'text-cyan-400 bg-cyan-400/10' : 'text-slate-500 hover:text-white'}`}
        >
          <ThumbsUp size={12} className={voted ? 'fill-current' : ''} /> {item.votes || 0}
        </motion.button>
        
        {item.cost_usd > 0 && (
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-white">${item.cost_usd.toLocaleString()}</span>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Gravity/mo</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function DebtModal({ item, onClose }: { item: DebtItem; onClose: () => void }) {
  const { mutateDebtItemStatus, team } = useStore()
  const [status, setStatus] = useState<DebtStatus>(item.status)
  const [assignedTo, setAssignedTo] = useState(item.assigned_to || '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await mutateDebtItemStatus(item.id, status)
      // Assignment still handled by local store or separate mutation if needed,
      // but for now focus on status which is the primary board interaction.
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-[32px] p-8 shadow-2xl relative"
      >
        {/* Holographic Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-cyan-500/40 rounded-full blur-[2px]" />
        
        <div className="flex items-start justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
             <SeverityBadge s={item.severity} />
             <div className="badge-cyan text-[10px] uppercase font-black px-2 py-0.5">{item.type}</div>
          </div>
          <motion.button 
            whileHover={{ rotate: 90 }}
            onClick={onClose} 
            className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/5 transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </motion.button>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-display font-black text-white mb-3 tracking-tight">{item.title}</h2>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">{item.description}</p>
        </div>

        {/* Technical Coordinate */}
        <div className="glass-card p-5 mb-8 flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-xl glass border-cyan-500/20 flex items-center justify-center text-cyan-400">
             <Box size={20} />
          </div>
          <div className="flex-1 min-w-0">
             <div className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-1">Spatial Coordinate</div>
             <code className="font-mono text-xs text-cyan-400/80 block truncate">
               {item.file_path} <span className="text-slate-600 font-bold">L:{item.line_start}</span>
             </code>
          </div>
          <button className="glass p-2 hover:text-cyan-400">
             <ExternalLink size={14} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="glass-card p-4 space-y-1">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gravity Impact</p>
             <p className="text-xl font-display font-black text-yellow-400">${item.cost_usd.toLocaleString()}<span className="text-[10px] ml-1 text-slate-500">/MO</span></p>
          </div>
          <div className="glass-card p-4 space-y-1">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Repair Cycle</p>
             <p className="text-xl font-display font-black text-cyan-400">{item.fix_days}<span className="text-[10px] ml-1 text-slate-500">SOLS</span></p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Stability Status</label>
            <select className="glass-card w-full p-4 text-sm font-bold bg-transparent outline-none focus:ring-1 focus:ring-cyan-500/30" value={status} onChange={e => setStatus(e.target.value as DebtStatus)}>
              {COLUMNS.map(s => (
                <option key={s.id} value={s.id} className="bg-[#020609]">{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Assigned Entity</label>
            <select className="glass-card w-full p-4 text-sm font-bold bg-transparent outline-none focus:ring-1 focus:ring-cyan-500/30" value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
              <option value="" className="bg-[#020609]">Unassigned</option>
              {team.map(m => (
                <option key={m.id} value={m.id} className="bg-[#020609]">{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave} 
            disabled={loading}
            className="btn-primary flex-1 py-4 font-black uppercase tracking-[0.2em] text-xs shadow-[0_0_30px_rgba(0,242,255,0.2)]"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Commit Changes'}
          </motion.button>
          <button onClick={onClose} className="glass p-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white">Cancel</button>
        </div>
      </motion.div>
    </div>
  )
}

export default function DebtBoardPage() {
  const { debtItems, repos } = useStore()
  const [selectedItem, setSelectedItem] = useState<DebtItem | null>(null)
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [filterRepo, setFilterRepo] = useState<string>('all')

  const filtered = useMemo(() => {
    return debtItems.filter(d => {
      if (filterSeverity !== 'all' && d.severity !== filterSeverity) return false
      if (filterRepo !== 'all' && d.repo_id !== filterRepo) return false
      return true
    })
  }, [debtItems, filterSeverity, filterRepo])

  const openItems = debtItems.filter(d => d.status !== 'fixed')
  const totalCost = openItems.reduce((s, d) => s + (d.cost_usd || 0), 0)

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-[0.2em]">
            <History size={14} /> Temporal Space Board
          </div>
          <h1 className="text-4xl font-display font-black text-white tracking-tighter">Debt <span className="text-gradient-cyan">Board.</span></h1>
        </div>
        <div className="glass-card px-6 py-3 flex items-center gap-4">
           <div className="text-center border-r border-white/5 pr-4">
              <div className="text-lg font-black text-white">{openItems.length}</div>
              <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Cores</div>
           </div>
           <div className="text-center">
              <div className="text-lg font-black text-cyan-400">${totalCost.toLocaleString()}</div>
              <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Gravity Surge</div>
           </div>
        </div>
      </div>

      {/* Control Module */}
      <div className="glass shadow-2xl p-4 rounded-[24px] flex flex-wrap items-center gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-400/[0.02] pointer-events-none" />
        <div className="w-10 h-10 rounded-xl glass border-white/5 flex items-center justify-center text-slate-500">
           <Filter size={18} />
        </div>
        
        <select className="glass-card bg-transparent px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 outline-none focus:ring-1 focus:ring-cyan-500/30" value={filterRepo} onChange={e => setFilterRepo(e.target.value)}>
          <option value="all" className="bg-[#020609]">All Cores</option>
          {repos.map(r => <option key={r.id} value={r.id} className="bg-[#020609]">{r.name}</option>)}
        </select>

        <select className="glass-card bg-transparent px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 outline-none focus:ring-1 focus:ring-cyan-500/30" value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
          <option value="all" className="bg-[#020609]">All Severity</option>
          {['critical', 'high', 'medium', 'low'].map(s => <option key={s} value={s} className="bg-[#020609]">{s.toUpperCase()}</option>)}
        </select>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary ml-auto px-6 py-2.5 text-xs font-black uppercase tracking-[0.2em]"
        >
          <Plus size={16} /> Deploy Anomaly
        </motion.button>
      </div>

      {/* Kanban Environment */}
      <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar-horizontal items-start">
        <LayoutGroup>
          {COLUMNS.map(col => {
            const items = filtered.filter(d => d.status === col.id)
            return (
              <div key={col.id} className="w-[320px] shrink-0 flex flex-col gap-4">
                <div className="px-4 py-3 glass border-white/5 rounded-2xl flex items-center justify-between relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: col.color }} />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: col.color }}>
                      {col.label}
                    </span>
                    <p className="text-[8px] font-bold text-slate-600 tracking-wide uppercase mt-0.5">{col.desc}</p>
                  </div>
                  <span className="w-6 h-6 rounded-lg glass border-white/5 flex items-center justify-center text-[10px] font-black text-slate-400">
                    {items.length}
                  </span>
                </div>
                
                <div className="space-y-4 min-h-[500px] p-1 rounded-3xl">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {items.map(item => (
                      <DebtCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
                    ))}
                  </AnimatePresence>
                  {items.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-12 flex flex-col items-center justify-center grayscale opacity-20"
                    >
                      <Sparkles size={32} className="text-slate-500 mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Zero Gravity</span>
                    </motion.div>
                  )}
                </div>
              </div>
            )
          })}
        </LayoutGroup>
      </div>

      {/* Depth Modal */}
      <AnimatePresence>
        {selectedItem && <DebtModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </AnimatePresence>
    </div>
  )
}

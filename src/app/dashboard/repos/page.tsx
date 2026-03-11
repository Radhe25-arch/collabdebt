'use client'

import { useState, useMemo } from 'react'
import { GitBranch, Plus, RefreshCw, Settings, X, Github, Database, Shield, Zap, Search, LayoutGrid, List } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'

const HEALTH_COLOR = (s: number) => s > 70 ? '#00f2ff' : s > 40 ? '#ffd600' : '#ff3b5c'
const HEALTH_LABEL = (s: number) => s > 70 ? 'STABLE' : s > 40 ? 'CAUTION' : 'CRITICAL'

const PROVIDER_ICONS: Record<string, React.FC<{ size: number; className?: string }>> = {
  github: ({ size, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
  gitlab: ({ size, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#FC6D26" className={className}><path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"/></svg>,
  bitbucket: ({ size, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#2684FF" className={className}><path d="M.778 1.211a.768.768 0 0 0-.768.892l3.263 19.81a1.044 1.044 0 0 0 1.021.86H19.77a.769.769 0 0 0 .77-.646l3.266-20.02a.769.769 0 0 0-.77-.896zM14.52 15.53H9.522L8.17 8.466h7.561z"/></svg>,
}

export default function ReposPage() {
  const { repos, debtItems } = useStore()
  const [connectOpen, setConnectOpen] = useState(false)
  const [scanning, setScanning] = useState<string | null>(null)

  const triggerScan = (id: string) => {
    setScanning(id)
    setTimeout(() => setScanning(null), 3000)
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-[0.2em]">
            <Database size={14} /> Neural Repository Shield
          </div>
          <h1 className="text-4xl font-display font-black text-white tracking-tighter">Data <span className="text-gradient-emerald">Vault.</span></h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="glass-card px-4 py-2 flex items-center gap-4">
              <div className="flex -space-x-2">
                 {[...Array(3)].map((_, i) => (
                   <div key={i} className="w-6 h-6 rounded-full border-2 border-[#020609] bg-slate-800 flex items-center justify-center">
                      <Shield size={10} className="text-emerald-400" />
                   </div>
                 ))}
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{repos.length} Protected Cores</span>
           </div>
        </div>
      </div>

      {/* Control Module */}
      <div className="glass shadow-2xl p-4 rounded-[24px] flex flex-wrap items-center gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-400/[0.02] pointer-events-none" />
        <div className="w-10 h-10 rounded-xl glass border-white/5 flex items-center justify-center text-slate-500">
           <Search size={18} />
        </div>
        <input 
          className="bg-transparent flex-1 min-w-[200px] px-2 text-sm font-bold text-white outline-none placeholder:text-slate-600 uppercase tracking-widest" 
          placeholder="Lookup core data by designation..."
        />
        <div className="flex gap-2">
           <button className="glass p-2 text-emerald-400 transition-all"><LayoutGrid size={16} /></button>
           <button className="glass p-2 text-slate-500 hover:text-white transition-all"><List size={16} /></button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {repos.map(repo => {
            const ProviderIcon = PROVIDER_ICONS[repo.provider] || Github
            const hc = HEALTH_COLOR(repo.health_score)
            const hl = HEALTH_LABEL(repo.health_score)
            
            const openDebtCount = debtItems.filter(d => d.repo_id === repo.id && d.status !== 'fixed').length
            const fixedDebtCount = debtItems.filter(d => d.repo_id === repo.id && d.status === 'fixed').length

            return (
              <motion.div 
                key={repo.id} 
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="glass-card group p-6 relative overflow-hidden transition-all duration-500 hover:border-emerald-500/30"
              >
                {/* Scanner Glow */}
                {scanning === repo.id && (
                  <motion.div 
                    initial={{ top: '0%' }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent blur-[2px] z-10"
                  />
                )}

                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl glass border-white/10 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <ProviderIcon size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-tight">{repo.name}</h3>
                      <p className="font-mono text-[9px] text-slate-500 mt-1">{repo.full_name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: hc }}>{hl}</span>
                     <span className="text-2xl font-display font-black text-white">{repo.health_score}<span className="text-[10px] text-slate-500">%</span></span>
                  </div>
                </div>

                <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden mb-8">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${repo.health_score}%` }}
                     transition={{ duration: 1, ease: 'easeOut' }}
                     className="h-full rounded-full"
                     style={{ 
                        background: `linear-gradient(90deg, ${hc}, ${hc}88)`,
                        boxShadow: `0 0 15px ${hc}60`
                     }}
                   />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { label: 'Anomalies', value: openDebtCount, color: '#ff3b5c' },
                    { label: 'Resolved', value: fixedDebtCount, color: '#00ff88' },
                    { label: 'Neural Link', value: 'Active', color: '#00f2ff' },
                  ].map(s => (
                    <div key={s.label} className="glass p-3 rounded-xl text-center space-y-1">
                      <div className="text-lg font-black" style={{ color: s.color }}>{s.value}</div>
                      <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => triggerScan(repo.id)} 
                    disabled={scanning === repo.id}
                    className="flex-1 glass py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 hover:bg-emerald-400/5 transition-all flex items-center justify-center gap-3"
                  >
                    {scanning === repo.id ? (
                      <><RefreshCw size={14} className="animate-spin" /> Analyzing Cores...</>
                    ) : (
                      <><RefreshCw size={14} /> Synchronize Hub</>
                    )}
                  </motion.button>
                  <button className="glass w-12 h-12 flex items-center justify-center rounded-2xl text-slate-500 hover:text-white transition-all">
                    <Settings size={18} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Connect Core Card */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setConnectOpen(true)}
          className="glass-card group flex flex-col items-center justify-center gap-4 min-h-[320px] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-emerald-400/[0.01] pointer-events-none" />
          <div className="w-16 h-16 rounded-[24px] glass border-emerald-500/20 flex items-center justify-center text-slate-600 group-hover:text-emerald-400 group-hover:bg-emerald-400/5 transition-all shadow-2xl">
            <Plus size={32} />
          </div>
          <div className="text-center">
             <p className="text-xs font-black text-white uppercase tracking-[0.2em]">Enlist New Core</p>
             <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-2">v4.0 Protocol Compatibility</p>
          </div>
        </motion.button>
      </div>

      {/* Connect Modal */}
      <AnimatePresence>
        {connectOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) setConnectOpen(false) }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="glass border-white/10 max-w-lg w-full rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                 <X size={20} className="text-slate-600 cursor-pointer hover:text-white transition-colors" onClick={() => setConnectOpen(false)} />
              </div>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-[24px] glass border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400 mb-4 shadow-xl">
                   <Zap size={32} />
                </div>
                <h2 className="text-xl font-display font-black text-white uppercase tracking-tight">Core Integration</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Select External Uplink Protocol</p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {['GitHub', 'GitLab', 'Bitbucket'].map((t, i) => {
                  const Icon = PROVIDER_ICONS[t.toLowerCase()] || Github
                  return (
                    <button key={t} className={`flex flex-col items-center gap-3 p-4 glass rounded-2xl border-white/5 transition-all ${i === 0 ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400' : 'text-slate-500 hover:text-white'}`}>
                      <Icon size={24} className={i === 0 ? 'text-emerald-400' : 'text-slate-500'} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{t}</span>
                    </button>
                  )
                })}
              </div>

              <div className="space-y-6">
                <div className="glass-card p-4 text-center border-dashed border-white/10">
                   <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-6 px-4">
                     Authorize the CollabDebt Neural Engine to access and scan your designated codebases for structural anomalies.
                   </p>
                   <motion.button 
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     className="btn-primary-emerald w-full py-4 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-emerald-500/20"
                   >
                     Initiate Handshake
                   </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

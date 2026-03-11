'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts'
import { TrendingDown, AlertTriangle, CheckCircle, DollarSign, ArrowRight, Zap, Sparkles, Cpu, Activity, ShieldCheck, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'

const SEVERITY_COLORS = { 
  critical: '#ff3b5c', 
  high: '#ff9600', 
  medium: '#ffd600', 
  low: '#00f2ff' 
}

// ── Neural Health Pulse (Mini) ──────────────────────────────────────────────
function NeuralHealthPulse({ score }: { score: number }) {
  const color = score > 70 ? '#00f2ff' : score > 40 ? '#ffd600' : '#ff3b5c'
  
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Pulse Rings */}
      <motion.div 
        className="absolute inset-0 border-2 rounded-full"
        style={{ borderColor: `${color}20` }}
        animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.div 
        className="absolute inset-0 border-2 rounded-full"
        style={{ borderColor: `${color}10` }}
        animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
      />
      
      {/* Main Glass Circle */}
      <div className="w-32 h-32 rounded-full glass border-white/10 flex flex-col items-center justify-center relative z-10 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl font-display font-black"
          style={{ 
             color, 
             textShadow: `0 0 20px ${color}80` 
          }}
        >
          {score}
        </motion.div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Health Score</span>
      </div>

      {/* Floating Nodes */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ 
            background: color, 
            filter: `blur(1px) drop-shadow(0 0 5px ${color})`,
            transformOrigin: '50% 80px' 
          }}
          animate={{
            rotate: [i * 90, i * 90 + 360],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { debtItems, sprints } = useStore()
  const activeSprint = sprints.find(s => s.status === 'active') || sprints[0]
  
  const openItems = debtItems.filter(d => d.status !== 'fixed')
  const fixedThisSprint = activeSprint ? debtItems.filter(d => d.status === 'fixed' && d.sprint_id === activeSprint.id).length : 0
  const totalCost = openItems.reduce((sum, d) => sum + d.cost_usd, 0)
  
  const criticalCount = openItems.filter(d => d.severity === 'critical').length
  const highCount = openItems.filter(d => d.severity === 'high').length
  const mediumCount = openItems.filter(d => d.severity === 'medium').length
  const lowCount = openItems.filter(d => d.severity === 'low').length
  
  const healthScore = useMemo(() => {
    const totalOpen = openItems.length
    if (totalOpen === 0) return 100
    const weighted = Math.max(0, 100 - ((criticalCount * 25) + (highCount * 15) + (mediumCount * 5) + (lowCount * 1)) / totalOpen * 10)
    return Math.round(weighted)
  }, [openItems, criticalCount, highCount, mediumCount, lowCount])

  // Derive Weekly Stats from actual debt items
  const weeklyStats = useMemo(() => {
    const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7']
    return weeks.map((w, i) => {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - (7 * (6 - i)))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)

      const added = debtItems.filter(d => {
        const dDate = new Date(d.created_at)
        return dDate >= weekStart && dDate < weekEnd
      }).length

      const fixed = debtItems.filter(d => {
        if (!d.fixed_at) return false
        const fDate = new Date(d.fixed_at)
        return fDate >= weekStart && fDate < weekEnd
      }).length

      return { week: w, added, fixed }
    })
  }, [debtItems])

  // Derive Activity from recent debt items and fixed status
  const recentActivity = useMemo(() => {
    return [...debtItems]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6)
      .map((item, i) => ({
        id: item.id,
        type: item.status === 'fixed' ? 'fixed' : 'added',
        user: item.created_by === 'scanner' ? 'Scanner' : 'Manual',
        action: item.status === 'fixed' ? 'fixed' : 'detected',
        item: item.title,
        time: i === 0 ? 'Just now' : `${i * 15}m ago`,
        color: item.status === 'fixed' ? '#00ff88' : '#ff3b5c'
      }))
  }, [debtItems])

  const [currentTime, setCurrentTime] = useState('20:42:11')
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-[0.2em]">
            <Activity size={14} /> Mission Intelligence Board
          </div>
          <h1 className="text-4xl font-display font-black text-white tracking-tighter">System <span className="text-gradient-cyan">Overview.</span></h1>
        </div>
        <div className="flex items-center gap-3">
           <div className="glass-card px-4 py-2 flex items-center gap-2 text-xs font-bold text-slate-400">
              <Globe size={14} className="text-cyan-400" /> UST: {currentTime}
           </div>
           <Link href="/dashboard/debt-board" className="btn-primary px-6 py-2.5 text-sm">
             Open Flight Deck <ArrowRight size={16} />
           </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Neural Health', value: healthScore, suffix: '%', icon: Cpu, color: healthScore > 70 ? 'cyan' : 'red', sub: 'Calculated in real-time' },
          { label: 'Unstable Cores', value: openItems.length, icon: AlertTriangle, color: 'yellow', sub: '+2 discovered today' },
          { label: 'Cores Fixed', value: fixedThisSprint, icon: ShieldCheck, color: 'emerald', sub: 'Sprint 14 progress: 42%' },
          { label: 'Debt Gravity', value: `$${(totalCost / 1000).toFixed(1)}K`, icon: DollarSign, color: 'cyan', sub: 'Estimated monthly cost' },
        ].map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 group cursor-pointer hover:border-cyan-500/30 transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-4">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{m.label}</p>
                  <h3 className="text-3xl font-display font-black text-white">
                    {m.value}<span className="text-sm font-bold text-slate-500 ml-1">{m.suffix}</span>
                  </h3>
               </div>
               <div className={`p-3 rounded-xl glass border-${m.color}-500/20 text-${m.color}-400 group-hover:scale-110 transition-transform shadow-xl`}>
                  <m.icon size={20} />
               </div>
            </div>
            <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 leading-none">
               <span className={`w-1 h-1 rounded-full bg-${m.color}-500 animate-pulse`} /> {m.sub}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Centerpiece Intelligence Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Neural Analysis */}
        <div className="lg:col-span-2 glass-card p-8 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4">
              <div className="badge-cyan text-[10px] uppercase font-black">Neural Live Link</div>
           </div>
           
           <NeuralHealthPulse score={healthScore} />

           <div className="flex-1 space-y-6 w-full">
              <div>
                <h2 className="text-xl font-display font-extrabold text-white mb-1 tracking-tight">Spatial Health Analysis</h2>
                <p className="text-xs text-slate-400 font-medium">Distribution of technical debt across severity layers.</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Critical Errors', count: criticalCount, color: '#ff3b5c', pct: (criticalCount / (openItems.length || 1)) * 100 },
                  { label: 'High Complexity', count: highCount, color: '#ff9600', pct: (highCount / (openItems.length || 1)) * 100 },
                  { label: 'Medium Friction', count: mediumCount, color: '#ffd600', pct: (mediumCount / (openItems.length || 1)) * 100 },
                  { label: 'Low Latency', count: lowCount, color: '#00f2ff', pct: (lowCount / (openItems.length || 1)) * 100 },
                ].map(s => (
                  <div key={s.label} className="space-y-1.5">
                    <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
                       <span className="text-slate-400">{s.label}</span>
                       <span style={{ color: s.color }}>{s.count} Items</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${s.pct}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ 
                             background: s.color,
                             boxShadow: `0 0 10px ${s.color}60`
                          }}
                       />
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Live Feed */}
        <div className="glass-card p-6 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Atmospheric Feed</h2>
             <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          
           <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {recentActivity.map((a, i) => (
              <motion.div 
                key={a.id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 border-l-2 border-white/5 pl-4 py-1 hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                   <div className="text-[11px] font-bold text-white mb-0.5">
                      {a.user} <span className="text-slate-500 font-medium">{a.action}</span>
                   </div>
                   <div className="text-[10px] font-mono text-cyan-400/80 truncate opacity-60 hover:opacity-100 transition-opacity">
                      {a.item}
                   </div>
                   <div className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1.5">{a.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button className="mt-6 w-full py-2 glass rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">
             Access Archives
          </button>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid lg:grid-cols-2 gap-6 pb-8">
        <div className="glass-card p-6">
           <div className="flex items-center justify-between mb-8">
             <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Gravitational Accumulation</h2>
             <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                   <div className="w-2 h-2 rounded-full bg-cyan-500" /> Fixed
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                   <div className="w-2 h-2 rounded-full bg-red-500" /> Added
                </div>
             </div>
           </div>
           
           <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={weeklyStats}>
                <defs>
                  <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff3b5c" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff3b5c" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFixed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" stroke="#475569" fontSize={10} fontStyle="bold" axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} fontStyle="bold" axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{ background: '#020609', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="added" stroke="#ff3b5c" fillOpacity={1} fill="url(#colorAdded)" strokeWidth={3} />
                <Area type="monotone" dataKey="fixed" stroke="#00f2ff" fillOpacity={1} fill="url(#colorFixed)" strokeWidth={3} />
              </AreaChart>
           </ResponsiveContainer>
        </div>

        <div className="glass-card p-6 flex flex-col">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Critical Fix Priorities</h2>
              <Link href="/dashboard/debt-board" className="badge-cyan text-[10px] px-2">Launch Fixer</Link>
           </div>
           
           <div className="space-y-3 flex-1">
             {debtItems.filter(d => d.status !== 'fixed' && d.severity === 'critical').slice(0, 4).map((item, i) => (
               <motion.div 
                 key={item.id}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="flex items-center gap-4 p-4 glass rounded-2xl hover:bg-white/5 transition-all group"
               >
                 <div className="w-10 h-10 rounded-xl glass border-red-500/20 flex items-center justify-center text-red-500 shadow-lg group-hover:scale-110 transition-transform">
                   <Cpu size={20} />
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{item.title}</p>
                    <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">{item.file_path}</p>
                 </div>
                 <div className="text-right">
                    <div className="text-xs font-black text-white">${item.cost_usd.toLocaleString()}</div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase">Per Mo.</div>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>
      </div>

    </div>
  )
}

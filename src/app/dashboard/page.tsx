'use client'

import { motion } from 'framer-motion'
import { 
  Activity, 
  BarChart3, 
  ChevronRight, 
  Code2, 
  Cpu, 
  GitBranch, 
  Plus, 
  ShieldAlert, 
  Terminal, 
  Zap,
  TrendingUp,
  Clock,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { useStore } from '@/store/useStore'

export default function DashboardPage() {
  const { debtItems, repos, team } = useStore()
  
  const health = repos.length > 0 ? Math.round(repos.reduce((acc, r) => acc + r.health_score, 0) / repos.length) : 100
  const activeDebt = debtItems.filter(d => d.status !== 'fixed')
  const totalCost = activeDebt.reduce((acc, d) => acc + (d.cost_usd || 0), 0)
  
  const stats = [
    { label: 'Overall Health', value: health, unit: '%', trend: 'Live', icon: Activity, color: 'emerald' },
    { label: 'Debt Items', value: activeDebt.length, unit: '', trend: `${debtItems.length} Total`, icon: ShieldAlert, color: 'indigo' },
    { label: 'Recovery ROI', value: (totalCost / 4200 || 2.4).toFixed(1), unit: 'x', trend: 'Real-time', icon: TrendingUp, color: 'blue' },
    { label: 'Ship Velocity', value: '0.9', unit: 'ms/pr', trend: '+12%', icon: Zap, color: 'amber' },
  ]

  const recentDebt = [...debtItems]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 card-hover relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-2.5 rounded-xl bg-zinc-800 text-indigo-400 shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] font-black text-indigo-500/80 bg-indigo-500/5 px-2 py-0.5 rounded-full border border-indigo-500/10">
                {stat.trend}
              </span>
            </div>
            <div className="relative z-10">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">{stat.value}</span>
                <span className="text-sm font-bold text-zinc-600 uppercase">{stat.unit}</span>
              </div>
              <div className="text-xs font-bold text-zinc-500 mt-1 uppercase tracking-widest">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Debt Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
              <Terminal size={18} className="text-indigo-500" />
              SMART SCAN REPORT
            </h2>
            <Link href="/dashboard/debt-board" className="text-xs font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="bg-zinc-900/40 border border-white/5 rounded-[32px] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black text-zinc-600 uppercase tracking-widest bg-white/[0.02]">
                  <th className="px-8 py-5">Issue / Repository</th>
                  <th className="px-8 py-5">Severity</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Cost Impact</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentDebt.map((item) => (
                  <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-0 cursor-pointer">
                    <td className="px-8 py-6">
                      <div className="font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{item.title}</div>
                      <div className="text-xs text-zinc-600 font-medium flex items-center gap-1.5 mt-1">
                        <GitBranch size={10} />
                        {item.repo?.name || 'unknown'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black border uppercase ${
                        item.severity === 'critical' ? 'bg-rose-500/10 border-rose-500 text-rose-500' :
                        item.severity === 'high' ? 'bg-amber-500/10 border-amber-500 text-amber-500' :
                        'bg-zinc-800 border-white/5 text-zinc-400'
                      }`}>
                        {item.severity}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'identified' ? 'bg-indigo-500' : 'bg-emerald-500'
                        }`} />
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">{item.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right font-mono font-bold text-indigo-400">
                      {item.fix_days}d
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info / Team Sidebar inside dashboard */}
        <div className="space-y-6">
          <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
            <Cpu size={18} className="text-indigo-500" />
            FLEET CORE
          </h2>
          
          <div className="space-y-4">
            {team.map((member) => (
              <div key={member.id} className="p-4 rounded-2xl bg-zinc-900/40 border border-white/5 flex items-center gap-4 transition-all hover:border-white/10 group">
                <div className="relative">
                  {member.avatar_url ? (
                    <img src={member.avatar_url} className="h-10 w-10 rounded-full border-2 border-white/5" alt="" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 shadow-xl" />
                  )}
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${
                    member.online ? 'bg-emerald-500' : 'bg-zinc-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{member.name}</div>
                  <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">{member.role}</div>
                </div>
                <button className="p-2 rounded-lg bg-white/5 text-zinc-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                  <Plus size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-[32px] bg-gradient-to-b from-indigo-500 to-indigo-700 relative overflow-hidden group shadow-2xl">
             <div className="relative z-10">
               <div className="text-white font-black text-xl mb-2 uppercase">PRO PLAN</div>
               <p className="text-indigo-100 text-xs font-bold mb-4">Unlock advanced automated scans and team health scoring.</p>
               <button className="w-full py-2.5 rounded-xl bg-white text-indigo-600 font-black text-sm hover:scale-105 active:scale-95 transition-all">
                 UPGRADE NOW
               </button>
             </div>
             <ShieldAlert className="absolute -bottom-4 -right-4 text-white/10" size={120} />
          </div>
        </div>
      </div>
    </div>
  )
}

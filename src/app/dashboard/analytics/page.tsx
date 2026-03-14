'use client'

import { motion } from 'framer-motion'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Zap, 
  ShieldAlert, 
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

const DATA_TREND = [
  { name: 'Mon', debt: 45, velocity: 85 },
  { name: 'Tue', debt: 52, velocity: 78 },
  { name: 'Wed', debt: 48, velocity: 82 },
  { name: 'Thu', debt: 61, velocity: 65 },
  { name: 'Fri', debt: 55, velocity: 72 },
  { name: 'Sat', debt: 42, velocity: 88 },
  { name: 'Sun', debt: 38, velocity: 94 },
]

const DATA_DISTRIBUTION = [
  { name: 'Security', value: 400, color: '#6366f1' },
  { name: 'Performance', value: 300, color: '#f59e0b' },
  { name: 'Maintenance', value: 300, color: '#10b981' },
  { name: 'Refactor', value: 200, color: '#ef4444' },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-1 uppercase">Advanced Intelligence</h2>
          <p className="text-zinc-500 font-medium text-sm">Real-time quantification of architectural friction.</p>
        </div>
        <div className="flex gap-2">
           {['7D', '30D', '90D', 'ALL'].map(t => (
             <button key={t} className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
               t === '30D' ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-zinc-900 border-white/5 text-zinc-600 hover:text-white'
             }`}>
               {t}
             </button>
           ))}
        </div>
      </div>

      {/* ROI & Cost Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Market Velocity Impact', value: '14.2', unit: '%', trend: 'down', icon: Zap, color: 'indigo' },
          { label: 'Annualized Debt Cost', value: '42.8', unit: 'k', trend: 'up', icon: DollarSign, color: 'rose' },
          { label: 'Refactor Efficiency', value: '98.4', unit: '%', trend: 'up', icon: Target, color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="p-8 rounded-[32px] bg-zinc-900/40 border border-white/5 relative overflow-hidden group shadow-xl">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <stat.icon size={80} className={`text-${stat.color}-500`} />
             </div>
             <div className="relative z-10">
                <div className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">{stat.label}</div>
                <div className="flex items-baseline gap-2 mb-4">
                   <div className="text-4xl font-black text-white">{stat.value}</div>
                   <div className="text-sm font-bold text-zinc-600">{stat.unit}</div>
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-black uppercase ${
                  stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.trend === 'up' ? 'Improving' : 'Attention Required'}
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Velocity vs Debt Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-[40px] bg-zinc-900/40 border border-white/5 shadow-2xl overflow-hidden relative">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-lg font-black tracking-tight text-white uppercase">Velocity Correlation</h3>
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-indigo-500" />
                   <span className="text-[10px] font-black text-zinc-500">DEBT LOAD</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500" />
                   <span className="text-[10px] font-black text-zinc-500">SHIP VELOCITY</span>
                </div>
             </div>
           </div>
           
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={DATA_TREND}>
                 <defs>
                   <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                 <XAxis 
                   dataKey="name" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#52525b', fontSize: 10, fontWeight: 700 }} 
                   dy={10}
                 />
                 <YAxis 
                   hide
                 />
                 <Tooltip 
                   contentStyle={{ background: '#09090b', border: '1px solid #ffffff10', borderRadius: '16px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)' }}
                   itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                 />
                 <Area type="monotone" dataKey="debt" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorDebt)" />
                 <Area type="monotone" dataKey="velocity" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVelocity)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Categories Distribution */}
        <div className="p-8 rounded-[40px] bg-zinc-900/40 border border-white/5 shadow-2xl relative overflow-hidden">
           <h3 className="text-lg font-black tracking-tight text-white uppercase mb-8">Source Distribution</h3>
           
           <div className="h-[250px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={DATA_DISTRIBUTION}
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {DATA_DISTRIBUTION.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
           </div>

           <div className="mt-6 space-y-3">
              {DATA_DISTRIBUTION.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-zinc-500">{item.name}</span>
                  </div>
                  <span className="text-white">{(item.value / 1200 * 100).toFixed(0)}%</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Table of Impactful Debt */}
      <div className="p-8 rounded-[40px] bg-zinc-900/40 border border-white/5 shadow-2xl">
         <h3 className="text-lg font-black tracking-tight text-white uppercase mb-8">High Impact Targets</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Auth Logic Sink', impact: 'High', roi: '14x', effort: '2d' },
              { title: 'Legacy DB Schema', impact: 'Medium', roi: '8x', effort: '5d' },
              { title: 'N+1 Query Hotfix', impact: 'Critical', roi: '22x', effort: '4h' },
              { title: 'CSS Redundancy', impact: 'Low', roi: '3x', effort: '1d' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-indigo-500/30 transition-all card-hover group">
                 <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{item.roi} ROI</div>
                 <h4 className="font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                 <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="text-[10px] font-black text-zinc-600 uppercase">Impact: {item.impact}</div>
                    <div className="text-[10px] font-black text-zinc-400 uppercase">{item.effort}</div>
                 </div>
              </div>
            ))}
         </div>
      </div>

    </div>
  )
}

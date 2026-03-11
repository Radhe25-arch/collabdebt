'use client'

import { useState, useMemo } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { Award, Clock, Download, TrendingUp } from 'lucide-react'
import { useStore } from '@/store/useStore'

const DEBT_BY_TYPE = [
  { name: 'TODO/FIXME', value: 12, color: '#ffd600' },
  { name: 'Deprecated', value: 7, color: '#ff9600' },
  { name: 'Complexity', value: 5, color: '#7c3aed' },
  { name: 'Duplicate', value: 4, color: '#00e5ff' },
  { name: 'Dead Code', value: 3, color: '#6b8fa8' },
  { name: 'Security', value: 2, color: '#ff3b5c' },
]

const DEBT_BY_MODULE = [
  { module: 'src/auth/', items: 8, cost: 4800 },
  { module: 'src/payments/', items: 6, cost: 3200 },
  { module: 'src/api/', items: 5, cost: 2100 },
  { module: 'src/hooks/', items: 4, cost: 900 },
  { module: 'src/components/', items: 3, cost: 600 },
]

const TREND_DATA = [
  { week: 'W1', total: 32, fixed: 5 },
  { week: 'W2', total: 38, fixed: 12 },
  { week: 'W3', total: 35, fixed: 18 },
  { week: 'W4', total: 40, fixed: 24 },
  { week: 'W5', total: 36, fixed: 30 },
  { week: 'W6', total: 33, fixed: 36 },
  { week: 'W7', total: 28, fixed: 40 },
]

const VELOCITY = [
  { sprint: 'S10', velocity: 6 },
  { sprint: 'S11', velocity: 7 },
  { sprint: 'S12', velocity: 5 },
  { sprint: 'S13', velocity: 9 },
  { sprint: 'S14', velocity: 8 },
]

export default function AnalyticsPage() {
  const { debtItems, team, sprints } = useStore()
  const leaderboard = useMemo(() => [...team].sort((a, b) => (b.items_fixed || 0) - (a.items_fixed || 0)), [team])

  const openItems = useMemo(() => debtItems.filter(d => d.status !== 'fixed'), [debtItems])
  const fixedItems = useMemo(() => debtItems.filter(d => d.status === 'fixed'), [debtItems])
  
  const debtByType = useMemo(() => {
    const types = ['todo', 'deprecated', 'complexity', 'duplicate', 'dead_code', 'security', 'performance']
    const colors = ['#ffd600', '#ff9600', '#7c3aed', '#00e5ff', '#6b8fa8', '#ff3b5c', '#00ff88']
    return types.map((t, i) => ({
      name: t.toUpperCase(),
      value: debtItems.filter(d => d.type === t).length,
      color: colors[i]
    })).filter(t => t.value > 0)
  }, [debtItems])

  const debtByModule = useMemo(() => {
    const modules: Record<string, { items: number, cost: number }> = {}
    debtItems.forEach(d => {
      const parts = d.file_path.split('/')
      const mod = parts.length > 1 ? parts.slice(0, 2).join('/') + '/' : 'root/'
      if (!modules[mod]) modules[mod] = { items: 0, cost: 0 }
      modules[mod].items++
      modules[mod].cost += d.cost_usd || 0
    })
    return Object.entries(modules).map(([name, data]) => ({ module: name, ...data }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 5)
  }, [debtItems])

  const weeklyStats = useMemo(() => {
    const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7']
    return weeks.map((w, i) => {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - (7 * (6 - i)))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)

      const total = debtItems.filter(d => {
        const dDate = new Date(d.created_at)
        return dDate < weekEnd
      }).length

      const fixedCount = debtItems.filter(d => {
        if (!d.fixed_at) return false
        const fDate = new Date(d.fixed_at)
        return fDate < weekEnd
      }).length

      return { week: w, total, fixed: fixedCount }
    })
  }, [debtItems])

  const avgFixTime = useMemo(() => {
    const times = fixedItems.map(d => {
      const start = new Date(d.created_at).getTime()
      const end = new Date(d.fixed_at!).getTime()
      return (end - start) / (1000 * 60 * 60 * 24)
    })
    return times.length ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1) : '0'
  }, [fixedItems])

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Analytics</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Last 12 weeks · All repositories</p>
        </div>
        <button className="btn-ghost text-sm">
          <Download size={15} /> Export PDF
        </button>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Open Debt', value: openItems.length, icon: TrendingUp, color: '#ff3b5c', sub: 'Active anomalies' },
          { label: 'Resolved Cores', value: fixedItems.length, icon: TrendingUp, color: '#00ff88', sub: 'Neuturalized depth' },
          { label: 'Avg Fix Time', value: `${avgFixTime}d`, icon: Clock, color: '#ffd600', sub: 'Mean time to stable' },
          { label: 'Fleet Champion', value: leaderboard[0]?.name.split(' ')[0] || 'N/A', icon: Award, color: '#7c3aed', sub: `${leaderboard[0]?.items_fixed || 0} items fixed` },
        ].map((m, i) => (
          <div key={i} className="metric-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="metric-label">{m.label}</p>
                <p className="text-xl font-bold font-display mt-1" style={{ color: m.color }}>{m.value}</p>
              </div>
              <div className="p-2.5 rounded-lg" style={{ background: `${m.color}15` }}>
                <m.icon size={18} style={{ color: m.color }} />
              </div>
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Debt by module + Team leaderboard */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-semibold mb-4">Debt by Module</h2>
          <div className="space-y-3">
            {debtByModule.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <code className="font-mono text-xs w-36 truncate" style={{ color: 'var(--text-muted)' }}>{m.module}</code>
                <div className="flex-1 progress-bar h-2">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, (m.items / 10) * 100)}%`, background: 'linear-gradient(90deg, var(--cyan), #7c3aed)' }} />
                </div>
                <span className="text-xs font-mono w-6 text-right" style={{ color: 'var(--text)' }}>{m.items}</span>
                <span className="text-xs font-mono w-16 text-right" style={{ color: 'var(--yellow)' }}>${m.cost.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Team Leaderboard</h2>
          <div className="space-y-3">
            {leaderboard.map((member, i) => (
              <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <span className="w-6 text-center text-sm font-bold font-display"
                  style={{ color: i === 0 ? '#ffd600' : i === 1 ? '#aab8c2' : i === 2 ? '#cd7f32' : 'var(--text-dim)' }}>
                  #{i + 1}
                </span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(0,229,255,0.1)', color: 'var(--cyan)' }}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{member.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold font-display" style={{ color: 'var(--green)' }}>{member.items_fixed}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>items fixed</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend + Type charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card">
          <h2 className="font-semibold mb-4">Debt Trend — 12 Weeks</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border-bright)', borderRadius: '8px', fontSize: 12 }}
                labelStyle={{ color: 'var(--text)' }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Line type="monotone" dataKey="total" name="Total Debt" stroke="var(--red)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="fixed" name="Fixed Cumulative" stroke="var(--green)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Debt by Type</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={debtByType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                {debtByType.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border-bright)', borderRadius: '8px', fontSize: 12 }}
                labelStyle={{ color: 'var(--text)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {debtByType.map(t => (
              <div key={t.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: t.color }} />
                <span className="truncate" style={{ color: 'var(--text-muted)' }}>{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sprint velocity */}
      <div className="card">
        <h2 className="font-semibold mb-4">Sprint Velocity Over Time</h2>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={VELOCITY}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="sprint" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border-bright)', borderRadius: '8px', fontSize: 12 }} />
            <Bar dataKey="velocity" name="Items Fixed" fill="rgba(0,229,255,0.7)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

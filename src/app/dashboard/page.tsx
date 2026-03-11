'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TrendingDown, AlertTriangle, CheckCircle, DollarSign, ArrowRight, Zap } from 'lucide-react'
import { MOCK_DEBT_ITEMS, MOCK_SPRINT, MOCK_WEEKLY_STATS, MOCK_ACTIVITY } from '@/lib/mock-data'

const SEVERITY_COLORS = { critical: '#ff3b5c', high: '#ff9600', medium: '#ffd600', low: '#00ff88' }

export default function DashboardPage() {
  const openItems = MOCK_DEBT_ITEMS.filter(d => d.status !== 'fixed')
  const fixedThisSprint = MOCK_DEBT_ITEMS.filter(d => d.status === 'fixed').length
  const totalCost = openItems.reduce((sum, d) => sum + d.cost_usd, 0)
  const criticalCount = openItems.filter(d => d.severity === 'critical').length
  const highCount = openItems.filter(d => d.severity === 'high').length
  const mediumCount = openItems.filter(d => d.severity === 'medium').length
  const lowCount = openItems.filter(d => d.severity === 'low').length
  const healthScore = 42

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Overview</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Debt health across all repos — last 30 days</p>
        </div>
        <Link href="/dashboard/debt-board" className="btn-primary text-sm">
          View Debt Board <ArrowRight size={14} />
        </Link>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Debt Score', value: healthScore, suffix: '/100', color: '#ff3b5c', icon: TrendingDown, sub: '↓ 8 from last week' },
          { label: 'Open Debt Items', value: openItems.length, color: '#ffd600', icon: AlertTriangle, sub: '+2 this week' },
          { label: 'Fixed This Sprint', value: fixedThisSprint, color: '#00ff88', icon: CheckCircle, sub: '↑ 1 vs last sprint' },
          { label: 'Monthly Cost Est.', value: `$${(totalCost / 1000).toFixed(1)}K`, color: 'var(--cyan)', icon: DollarSign, sub: '$2.1K saved vs last month', raw: true },
        ].map((m, i) => (
          <div key={i} className="metric-card animate-fadeInUp" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="metric-label">{m.label}</p>
                <p className="metric-value mt-1" style={{ color: m.color }}>
                  {m.raw ? m.value : m.value}{!m.raw && m.suffix}
                </p>
              </div>
              <div className="p-2.5 rounded-lg" style={{ background: `${m.color}15` }}>
                <m.icon size={18} style={{ color: m.color }} />
              </div>
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Health score + Activity */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Health Score */}
        <div className="lg:col-span-2 card">
          <h2 className="font-semibold mb-4">Debt Health Score</h2>
          <div className="flex items-center gap-8">
            {/* SVG Gauge */}
            <div className="relative w-36 h-36 shrink-0">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none"
                  stroke="#ff3b5c" strokeWidth="10"
                  strokeDasharray={`${(healthScore / 100) * 314} 314`}
                  strokeLinecap="round" className="transition-all duration-700" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-display" style={{ color: '#ff3b5c' }}>{healthScore}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/ 100</span>
              </div>
            </div>
            {/* Breakdown */}
            <div className="flex-1 space-y-3">
              {[
                { label: 'Critical', count: criticalCount, color: '#ff3b5c', pct: (criticalCount / openItems.length) * 100 },
                { label: 'High', count: highCount, color: '#ff9600', pct: (highCount / openItems.length) * 100 },
                { label: 'Medium', count: mediumCount, color: '#ffd600', pct: (mediumCount / openItems.length) * 100 },
                { label: 'Low', count: lowCount, color: '#00ff88', pct: (lowCount / openItems.length) * 100 },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="w-14 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                  <div className="flex-1 progress-bar h-1.5">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                  <span className="w-4 text-xs font-mono font-bold" style={{ color: s.color }}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity feed */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Live Activity</h2>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>View all →</span>
          </div>
          <div className="space-y-3">
            {MOCK_ACTIVITY.map(a => (
              <div key={a.id} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: a.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs">
                    <span className="font-semibold">{a.user}</span>
                    <span style={{ color: 'var(--text-muted)' }}> {a.action} </span>
                    <span className="font-mono truncate">{a.item}</span>
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-dim)' }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Debt added vs fixed */}
        <div className="card">
          <h2 className="font-semibold mb-4">Debt Added vs Fixed</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MOCK_WEEKLY_STATS} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border-bright)', borderRadius: '8px', fontSize: 12 }}
                labelStyle={{ color: 'var(--text)' }} />
              <Bar dataKey="added" name="Added" fill="rgba(255,59,92,0.7)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="fixed" name="Fixed" fill="rgba(0,255,136,0.7)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top critical items */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Top Critical Items</h2>
            <Link href="/dashboard/debt-board" className="text-xs" style={{ color: 'var(--cyan)' }}>View all →</Link>
          </div>
          <div className="space-y-3">
            {MOCK_DEBT_ITEMS.filter(d => d.status !== 'fixed').slice(0, 4).map(item => (
              <Link key={item.id} href="/dashboard/debt-board"
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <span className={item.severity === 'critical' ? 'badge-critical' : item.severity === 'high' ? 'badge-high' : 'badge-medium'}>
                  {item.severity.toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{item.title}</p>
                  <p className="font-mono text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{item.file_path}</p>
                </div>
                <span className="text-xs font-mono font-semibold shrink-0" style={{ color: 'var(--yellow)' }}>
                  ${item.cost_usd.toLocaleString()}/mo
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Sprint widget */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(0,229,255,0.08)' }}>
              <Zap size={18} style={{ color: 'var(--cyan)' }} />
            </div>
            <div>
              <h2 className="font-semibold">{MOCK_SPRINT.name}</h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {new Date(MOCK_SPRINT.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} —{' '}
                {new Date(MOCK_SPRINT.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
          <Link href="/dashboard/sprints" className="btn-ghost text-xs py-1.5 px-3">View sprint</Link>
        </div>
        <div className="progress-bar mb-3">
          <div className="progress-fill-green h-full rounded-full" style={{ width: '40%', background: 'linear-gradient(90deg, var(--green), #00c9ff)' }} />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {[
            { label: 'Debt items planned', value: 4, color: 'var(--cyan)' },
            { label: 'In progress', value: 2, color: 'var(--yellow)' },
            { label: 'Blocked', value: 0, color: 'var(--red)' },
          ].map(s => (
            <div key={s.label} className="text-center p-3 rounded-lg" style={{ background: 'var(--surface)' }}>
              <div className="text-xl font-bold font-display" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { AlertTriangle, CheckCircle, DollarSign, TrendingDown, ArrowRight, GitBranch } from 'lucide-react'
import { useStore } from '@/store/useStore'

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'var(--red)',
  high: 'var(--orange)',
  medium: 'var(--yellow)',
  low: 'var(--green)',
}

const STATUS_LABELS: Record<string, string> = {
  identified: 'Identified',
  planned: 'Planned',
  in_progress: 'In Progress',
  fixed: 'Fixed',
}

export default function DashboardPage() {
  const { debtItems, sprints, repos } = useStore()
  const activeSprint = sprints.find(s => s.status === 'active') || sprints[0]

  const openItems = useMemo(() => debtItems.filter(d => d.status !== 'fixed'), [debtItems])
  const criticalItems = useMemo(() => openItems.filter(d => d.severity === 'critical'), [openItems])
  const totalCost = useMemo(() => openItems.reduce((s, d) => s + (d.cost_usd || 0), 0), [openItems])
  const fixedItems = useMemo(() => debtItems.filter(d => d.status === 'fixed'), [debtItems])

  const weeklyData = useMemo(() => {
    const weeks: Record<string, { week: string; detected: number; resolved: number }> = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i * 7)
      const k = `W${7 - i}`
      weeks[k] = { week: k, detected: 0, resolved: 0 }
    }
    debtItems.forEach(item => {
      const w = Math.abs(Math.ceil((Date.now() - new Date(item.created_at).getTime()) / (7 * 86400000)))
      const key = `W${7 - Math.min(w, 6)}`
      if (weeks[key]) weeks[key].detected++
    })
    fixedItems.forEach(item => {
      if (!item.fixed_at) return
      const w = Math.abs(Math.ceil((Date.now() - new Date(item.fixed_at).getTime()) / (7 * 86400000)))
      const key = `W${7 - Math.min(w, 6)}`
      if (weeks[key]) weeks[key].resolved++
    })
    return Object.values(weeks)
  }, [debtItems, fixedItems])

  const recentItems = useMemo(() =>
    [...debtItems]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6),
    [debtItems]
  )

  const healthScore = repos.length > 0
    ? Math.round(repos.reduce((s, r) => s + r.health_score, 0) / repos.length)
    : 0

  const metrics = [
    { label: 'Open Issues', value: openItems.length, icon: AlertTriangle, color: 'var(--red)', sub: `${criticalItems.length} critical` },
    { label: 'Resolved', value: fixedItems.length, icon: CheckCircle, color: 'var(--green)', sub: 'All time' },
    { label: 'Monthly Cost', value: `$${(totalCost / 1000).toFixed(1)}k`, icon: DollarSign, color: 'var(--yellow)', sub: 'Estimated impact' },
    { label: 'Avg Health', value: `${healthScore}%`, icon: TrendingDown, color: 'var(--blue)', sub: `${repos.length} repos` },
  ]

  return (
    <div className="space-y-6 max-w-6xl">

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between mb-3">
              <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 500 }}>{m.label}</span>
              <m.icon size={14} style={{ color: m.color }} />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text)' }}>
              {m.value}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Trend chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Weekly Trend</h2>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Last 7 weeks</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyData} margin={{ top: 0, right: 2, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDetected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--red)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--red)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--green)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--green)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: 12, color: 'var(--text)' }}
                cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
              />
              <Area type="monotone" dataKey="detected" stroke="var(--red)" strokeWidth={1.5} fill="url(#colorDetected)" name="Detected" />
              <Area type="monotone" dataKey="resolved" stroke="var(--green)" strokeWidth={1.5} fill="url(#colorResolved)" name="Resolved" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Active sprint */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Active Sprint</h2>
            <Link href="/dashboard/sprints" style={{ fontSize: '11px', color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: 4 }}>
              View <ArrowRight size={11} />
            </Link>
          </div>
          {activeSprint ? (
            <div className="space-y-4">
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{activeSprint.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: 2 }}>
                  {new Date(activeSprint.start_date).toLocaleDateString()} — {new Date(activeSprint.end_date).toLocaleDateString()}
                </div>
              </div>

              {/* Progress bar */}
              {(() => {
                const now = Date.now()
                const start = new Date(activeSprint.start_date).getTime()
                const end = new Date(activeSprint.end_date).getTime()
                const pct = Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)))
                const daysLeft = Math.max(0, Math.round((end - now) / 86400000))
                return (
                  <div>
                    <div className="flex justify-between mb-1.5" style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      <span>{pct}% elapsed</span>
                      <span>{daysLeft}d remaining</span>
                    </div>
                    <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'var(--blue)', borderRadius: '2px' }} />
                    </div>
                  </div>
                )
              })()}

              <div className="grid grid-cols-2 gap-2">
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: '6px', padding: '10px' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>
                    {debtItems.filter(d => d.sprint_id === activeSprint.id && d.status === 'fixed').length}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: 2 }}>Fixed</div>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: '6px', padding: '10px' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>
                    {debtItems.filter(d => d.sprint_id === activeSprint.id && d.status !== 'fixed').length}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: 2 }}>Remaining</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--text-dim)', paddingTop: 8 }}>
              No active sprint. <Link href="/dashboard/sprints" style={{ color: 'var(--blue)' }}>Create one →</Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent debt items + repos */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Recent issues */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Recent Issues</h2>
            <Link href="/dashboard/debt-board" style={{ fontSize: '11px', color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {recentItems.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>No debt items yet.</p>
          ) : (
            <div>
              {recentItems.map((item, i) => (
                <div
                  key={item.id}
                  className="table-row"
                  style={{ gap: '10px' }}
                >
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: SEVERITY_COLORS[item.severity] }} />
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
                      {item.file_path?.split('/').slice(-2).join('/')}
                    </div>
                  </div>
                  <span className={`badge badge-${item.severity === 'critical' ? 'critical' : item.severity === 'high' ? 'high' : item.severity === 'medium' ? 'medium' : 'low'}`}>
                    {item.severity}
                  </span>
                  <span className="badge badge-muted">{STATUS_LABELS[item.status] || item.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Repositories */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Repositories</h2>
            <Link href="/dashboard/repos" style={{ fontSize: '11px', color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: 4 }}>
              All <ArrowRight size={11} />
            </Link>
          </div>
          {repos.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>No repos connected.</p>
          ) : (
            <div className="space-y-1">
              {repos.slice(0, 6).map(repo => {
                const repoOpen = debtItems.filter(d => d.repo_id === repo.id && d.status !== 'fixed').length
                const color = repo.health_score > 70 ? 'var(--green)' : repo.health_score > 40 ? 'var(--yellow)' : 'var(--red)'
                return (
                  <div key={repo.id} className="table-row" style={{ gap: '10px' }}>
                    <GitBranch size={13} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: '12px', fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {repo.name}
                    </span>
                    {repoOpen > 0 && (
                      <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{repoOpen} open</span>
                    )}
                    <span style={{ fontSize: '12px', fontWeight: 600, color }}>
                      {repo.health_score}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

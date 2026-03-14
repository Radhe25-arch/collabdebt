'use client'

import { useState, useMemo } from 'react'
import { Crown, Eye, AlertTriangle, TrendingDown, DollarSign, Sparkles, Download, Share2, X } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useStore } from '@/store/useStore'
import type { TeamMember } from '@/types'

const COLORS = ['#00e5ff', '#00ff88', '#7c3aed', '#ffd600']

function InspectModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  const { debtItems } = useStore()
  
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box animate-fadeInUp max-w-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
              style={{ background: 'rgba(0,229,255,0.1)', color: 'var(--cyan)' }}>
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="font-semibold">{member.name}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{member.role} · {member.user_code}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/5">
            <X size={18} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        <div className="p-3 rounded-xl mb-4 text-xs" style={{ background: 'rgba(255,214,0,0.06)', border: '1px solid rgba(255,214,0,0.15)' }}>
          <span style={{ color: 'var(--yellow)' }}>⚠ Silent Inspect Mode</span>
          <span style={{ color: 'var(--text-muted)' }}> — {member.name} does not see this view</span>
        </div>

        {member.current_file && (
          <div className="mb-4">
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Currently editing</p>
            <div className="p-3 rounded-lg font-mono text-xs" style={{ background: 'var(--surface)', color: 'var(--cyan)' }}>
              {member.current_file}
            </div>
          </div>
        )}

        <div className="mb-4">
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Recent Fleet Actions</p>
          <div className="space-y-2">
            {debtItems.filter(d => d.assigned_to === member.id)
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .slice(0, 5)
              .map((d, i) => (
              <div key={i} className="flex items-center gap-3 text-xs py-1.5">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: d.status === 'fixed' ? 'var(--green)' : 'var(--cyan)' }} />
                <span style={{ color: 'var(--text-muted)' }}>{d.status === 'fixed' ? 'Neutralized' : 'Targeted'}</span>
                <span className="flex-1 font-mono truncate">{d.title}</span>
                <span style={{ color: 'var(--text-dim)' }}>{new Date(d.created_at).toLocaleDateString()}</span>
              </div>
            ))}
            {debtItems.filter(d => d.assigned_to === member.id).length === 0 && (
              <div className="flex items-center gap-3 text-xs py-1.5 text-slate-500">
                No recent solo actions recorded.
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl text-center" style={{ background: 'var(--surface)' }}>
            <div className="text-xl font-bold font-display" style={{ color: 'var(--green)' }}>{member.items_fixed}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Items fixed</div>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ background: 'var(--surface)' }}>
            <div className="text-xl font-bold font-display" style={{ color: 'var(--red)' }}>{member.items_created}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Items created</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ManagerPage() {
  const { debtItems, team } = useStore()
  const [inspecting, setInspecting] = useState<TeamMember | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiReport, setAiReport] = useState<string | null>(null)

  const criticalDebt = useMemo(() => debtItems.filter(d => d.severity === 'critical' && d.status !== 'fixed'), [debtItems])
  const totalCost = useMemo(() => debtItems.filter(d => d.status !== 'fixed').reduce((s, d) => s + (d.cost_usd || 0), 0), [debtItems])
  const topROI = useMemo(() => [...debtItems].filter(d => d.status !== 'fixed').sort((a, b) => (b.cost_usd || 0) - (a.cost_usd || 0)).slice(0, 3), [debtItems])
  const potentialSavings = topROI.reduce((s, d) => s + (d.cost_usd || 0), 0)

  const productivityData = useMemo(() => {
    const weeks = ['W1', 'W2', 'W3', 'W4', 'W5']
    return weeks.map((w, i) => {
      const data: any = { week: w }
      team.slice(0, 4).forEach(m => {
        data[m.name.split(' ')[0]] = Math.floor(Math.random() * 5) + 1 // Keep some variability for demo
      })
      return data
    })
  }, [team])

  const generateReport = () => {
    setAiLoading(true)
    setTimeout(() => {
      setAiReport(`Based on current fleet analysis, neutralize these top ${topROI.length} cores to recover **$${potentialSavings.toLocaleString()}/month**:

${topROI.map((d, i) => `${i + 1}. **${d.title}** — Estimated savings: $${(d.cost_usd || 0).toLocaleString()}/month.`).join('\n')}

**Strategic Directive:** Prioritize high-cost anomalies in the next cycle. Projected efficiency gain: +${Math.round((potentialSavings / totalCost) * 100) || 0}% recovery rate.`)
      setAiLoading(false)
    }, 2000)
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <Crown size={20} style={{ color: '#7c3aed' }} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Manager View</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>System intelligence dashboard</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="btn-ghost text-sm"><Download size={14} /> Export PDF</button>
          <button className="btn-ghost text-sm"><Share2 size={14} /> Share</button>
        </div>
      </div>

      {/* Critical alert banner */}
      {criticalDebt.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,59,92,0.08)', border: '1px solid rgba(255,59,92,0.2)' }}>
          <AlertTriangle size={16} style={{ color: 'var(--red)' }} />
          <p className="text-sm">
            <span className="font-semibold" style={{ color: 'var(--red)' }}>{criticalDebt.length} critical debt items</span>
            <span style={{ color: 'var(--text-muted)' }}> found in the last 24 hours. Immediate attention required.</span>
          </p>
        </div>
      )}

      {/* Cost impact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Monthly Cost', value: `$${(totalCost / 1000).toFixed(1)}K`, color: 'var(--red)', icon: DollarSign, sub: `${debtItems.filter(d => d.status !== 'fixed').length} active anomalies`, glow: 'rgba(255,59,92,0.1)' },
          { label: 'Delivery Slowdown', value: `${Math.min(60, debtItems.length * 2)}%`, color: 'var(--yellow)', icon: TrendingDown, sub: 'Estimated productivity impact', glow: 'rgba(255,214,0,0.1)' },
          { label: 'Savings Potential', value: `$${(potentialSavings / 1000).toFixed(1)}K`, color: 'var(--green)', icon: DollarSign, sub: 'Monthly ROI from top 3', glow: 'rgba(0,255,136,0.1)' },
        ].map((m, i) => (
          <div key={i} className="glass p-6 rounded-[24px] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all">
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${m.glow} 0%, transparent 70%)` }} />
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--text-dim)' }}>{m.label}</p>
                <p className="text-3xl font-display font-black" style={{ color: m.color }}>{m.value}</p>
              </div>
              <div className="p-3 rounded-2xl" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                <m.icon size={20} style={{ color: m.color }} />
              </div>
            </div>
            <p className="text-[10px] font-bold mt-4 relative z-10" style={{ color: 'var(--text-muted)' }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Team heatmap */}
      <div className="card">
        <h2 className="font-semibold mb-4">Live Team Heatmap</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {team.map(member => (
            <div key={member.id} className="p-4 rounded-xl border transition-all hover:border-[#234860]"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: 'rgba(0,229,255,0.1)', color: 'var(--cyan)' }}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{member.name.split(' ')[0]}</div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{member.role}</div>
                  </div>
                </div>
                <div className={member.online ? 'dot-online' : 'dot-offline'} />
              </div>
              {member.current_file && (
                <p className="font-mono text-[10px] mb-3 truncate" style={{ color: 'var(--text-muted)' }}>
                  {member.current_file}
                </p>
              )}
              {!member.current_file && (
                <p className="text-[10px] mb-3" style={{ color: 'var(--text-dim)' }}>Offline</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                  {member.online ? 'Active now' : 'Idle > 30min'}
                </span>
                <button onClick={() => setInspecting(member)}
                  className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg transition-all hover:bg-[rgba(0,229,255,0.1)]"
                  style={{ color: 'var(--cyan)' }}>
                  <Eye size={10} /> Inspect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Productivity chart */}
      <div className="card">
        <h2 className="font-semibold mb-4">Productivity — Items Fixed per Week</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={productivityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="week" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border-bright)', borderRadius: '8px', fontSize: 12 }}
              labelStyle={{ color: 'var(--text)' }} />
            {team.slice(0, COLORS.length).map((m, i) => (
              <Bar key={m.id} dataKey={m.name.split(' ')[0]} fill={COLORS[i]} radius={[3, 3, 0, 0]} barSize={16} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI ROI Report */}
      <div className="card" style={{ border: '1px solid rgba(124,58,237,0.2)' }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(124,58,237,0.1)' }}>
              <Sparkles size={18} style={{ color: '#7c3aed' }} />
            </div>
            <div>
              <h3 className="font-semibold">AI ROI Report</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Generate a business-ready report: which debt items to fix, in what order, for maximum ROI.
              </p>
            </div>
          </div>
          <button onClick={generateReport} disabled={aiLoading} className="btn-primary text-sm shrink-0">
            {aiLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Generating...
              </span>
            ) : (
              <><Sparkles size={14} /> Generate Report</>
            )}
          </button>
        </div>
        {aiReport && (
          <div className="mt-4 p-4 rounded-xl text-sm" style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}>
            {aiReport.split('\n').map((line, i) => (
              <p key={i} className={line.startsWith('**') ? 'font-semibold text-white mb-1 mt-2' : 'mb-1'}>{line}</p>
            ))}
          </div>
        )}
      </div>

      {inspecting && <InspectModal member={inspecting} onClose={() => setInspecting(null)} />}
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { Zap, Plus, X, Calendar, Target, BrainCircuit, History, Loader2, RefreshCw } from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function SprintsPage() {
  const { sprints, debtItems } = useStore()
  const [showNew, setShowNew] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  const activeSprint = useMemo(() => sprints.find(s => s.status === 'active'), [sprints])
  const pastSprints = useMemo(() => sprints.filter(s => s.status === 'completed'), [sprints])

  const sprintProgress = useMemo(() => {
    if (!activeSprint) return { progress: 0, daysRemaining: 0 }
    const start = new Date(activeSprint.start_date).getTime()
    const end = new Date(activeSprint.end_date).getTime()
    const now = Date.now()
    const progress = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100))
    const daysRemaining = Math.max(0, Math.ceil((end - now) / 86400000))
    return { progress, daysRemaining }
  }, [activeSprint])

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>Temporal Cycles</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Track debt resolution phases and velocity.</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn-primary py-1.5 px-4 text-xs">
          <Plus size={14} /> Initiate Cycle
        </button>
      </div>

      {/* Active Phase */}
      {activeSprint ? (
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div style={{
                width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(234,179,8,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--yellow)', border: '1px solid rgba(234,179,8,0.2)'
              }}>
                < Zap size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>{activeSprint.name}</h2>
                  <span className="badge badge-yellow">ACTIVE</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={12} />
                  {new Date(activeSprint.start_date).toLocaleDateString()} — {new Date(activeSprint.end_date).toLocaleDateString()}
                  <span>·</span>
                  {sprintProgress.daysRemaining} days remaining
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {[
                { label: 'Load', value: debtItems.filter(d => d.sprint_id === activeSprint.id).length },
                { label: 'Fixed', value: debtItems.filter(d => d.sprint_id === activeSprint.id && d.status === 'fixed').length },
                { label: 'Open', value: debtItems.filter(d => d.sprint_id === activeSprint.id && d.status !== 'fixed').length },
              ].map(s => (
                <div key={s.label} style={{ minWidth: '80px', padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>{s.value}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Cycle Progress</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--yellow)' }}>{Math.round(sprintProgress.progress)}%</span>
            </div>
            <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${sprintProgress.progress}%`, height: '100%', background: 'var(--yellow)', borderRadius: '3px' }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="card mb-8 py-12 text-center">
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No active cycle. Initiate a new one to start tracking.</p>
        </div>
      )}

      {/* AI Insights */}
      {activeSprint?.ai_recommendation && (
        <div className="card mb-8" style={{ borderLeft: '3px solid var(--yellow)' }}>
          <div className="flex gap-4">
            <div style={{ color: 'var(--yellow)', flexShrink: 0 }}><BrainCircuit size={20} /></div>
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Neural Insight</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '16px' }}>
                "{activeSprint.ai_recommendation}"
              </p>
              <button
                className="btn-primary py-1.5 px-3 text-[11px]"
                onClick={() => { setAiLoading(true); setTimeout(() => setAiLoading(false), 2000) }}
                disabled={aiLoading}
              >
                {aiLoading ? <RefreshCw size={12} className="animate-spin" /> : <Target size={12} />}
                Execute Directive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid for Past Sprints */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={15} style={{ color: 'var(--text-dim)' }} /> Cycle Archives
          </h2>
        </div>
        <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['Designation', 'Range', 'Resolved', 'Stability'].map(h => (
                <th key={h} style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-dim)', padding: '12px 20px', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pastSprints.map(s => (
              <tr key={s.id} className="table-row-no-gap" style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>{s.name}</td>
                <td style={{ padding: '14px 20px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {new Date(s.start_date).toLocaleDateString()} – {new Date(s.end_date).toLocaleDateString()}
                </td>
                <td style={{ padding: '14px 20px', fontSize: '12px', color: 'var(--green)', fontWeight: 600 }}>
                  {debtItems.filter(d => d.sprint_id === s.id && d.status === 'fixed').length} items
                </td>
                <td style={{ padding: '14px 20px' }}><span className="badge badge-green">STABLE</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Sprint Modal */}
      {showNew && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowNew(false)}>
          <div className="modal-box" style={{ maxWidth: '400px' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Initiate Cycle</h2>
              <X size={16} style={{ cursor: 'pointer', color: 'var(--text-dim)' }} onClick={() => setShowNew(false)} />
            </div>
            <form className="space-y-4">
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Designation
                </label>
                <input className="input" placeholder="e.g. CYCLE_DELTA_14" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Start Date
                  </label>
                  <input className="input" type="date" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                    End Date
                  </label>
                  <input className="input" type="date" />
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" className="btn-primary w-full py-2.5 justify-center">
                  Deploy Temporal Phase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

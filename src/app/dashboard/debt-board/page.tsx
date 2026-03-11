'use client'

import { useState, useMemo } from 'react'
import { ThumbsUp, Plus, X, ExternalLink, Loader2, Search, ChevronDown } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { DebtItem, DebtSeverity, DebtStatus } from '@/types'

const COLUMNS: { id: DebtStatus; label: string }[] = [
  { id: 'identified', label: 'Identified' },
  { id: 'planned', label: 'Planned' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'fixed', label: 'Fixed' },
]

const SEV_COLOR: Record<string, string> = {
  critical: 'var(--red)',
  high: 'var(--orange)',
  medium: 'var(--yellow)',
  low: 'var(--green)',
}

function SeverityBadge({ s }: { s: DebtSeverity }) {
  const cls = s === 'critical' ? 'badge-critical' : s === 'high' ? 'badge-high' : s === 'medium' ? 'badge-medium' : 'badge-low'
  return <span className={`badge ${cls}`}>{s}</span>
}

function DebtCard({ item, onClick }: { item: DebtItem; onClick: () => void }) {
  const { updateDebtItem } = useStore()
  const [voted, setVoted] = useState(false)

  return (
    <div
      onClick={onClick}
      className="card cursor-pointer hover:border-[var(--border-hover)] mb-2"
      style={{ padding: '12px' }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <SeverityBadge s={item.severity} />
        {item.cost_usd > 0 && (
          <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
            ${item.cost_usd.toLocaleString()}/mo
          </span>
        )}
      </div>

      <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', lineHeight: '1.4', marginBottom: '6px' }}>
        {item.title}
      </h3>

      {item.file_path && (
        <p style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '8px' }}>
          {item.file_path}
        </p>
      )}

      <div className="flex items-center justify-between" style={{ borderTop: '1px solid var(--border)', paddingTop: '8px', marginTop: '8px' }}>
        <button
          onClick={e => { e.stopPropagation(); if (!voted) { updateDebtItem(item.id, { votes: (item.votes || 0) + 1 }); setVoted(true) } }}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '11px', color: voted ? 'var(--blue)' : 'var(--text-dim)',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0
          }}
        >
          <ThumbsUp size={11} /> {item.votes || 0}
        </button>
        <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{item.fix_days}d est.</span>
      </div>
    </div>
  )
}

function DebtModal({ item, onClose }: { item: DebtItem; onClose: () => void }) {
  const { mutateDebtItemStatus, team } = useStore()
  const [status, setStatus] = useState<DebtStatus>(item.status)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try { await mutateDebtItemStatus(item.id, status) } catch (err) { console.error(err) }
    setLoading(false)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <SeverityBadge s={item.severity} />
            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-dim)' }}>
              {item.type}
            </span>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px', lineHeight: 1.4 }}>
          {item.title}
        </h2>

        {item.description && (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.6 }}>
            {item.description}
          </p>
        )}

        {item.file_path && (
          <div className="code-block mb-4">
            {item.file_path}
            {item.line_start && ` :${item.line_start}–${item.line_end}`}
          </div>
        )}

        {/* Meta row */}
        <div
          style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px',
            background: 'var(--bg-tertiary)', borderRadius: '6px', padding: '12px', marginBottom: '16px'
          }}
        >
          {[
            { label: 'Cost/mo', value: `$${(item.cost_usd || 0).toLocaleString()}` },
            { label: 'Est. fix', value: `${item.fix_days}d` },
            { label: 'Votes', value: item.votes || 0 },
          ].map(m => (
            <div key={m.label}>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="mb-4">
          <label style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            Status
          </label>
          <select
            className="input"
            value={status}
            onChange={e => setStatus(e.target.value as DebtStatus)}
          >
            {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>

        {item.pr_url && (
          <a href={item.pr_url} target="_blank" rel="noreferrer"
            className="btn-ghost mb-4"
            style={{ display: 'inline-flex', fontSize: '12px' }}
          >
            <ExternalLink size={12} /> View PR
          </a>
        )}

        <div className="flex items-center justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 size={13} className="animate-spin" /> : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DebtBoardPage() {
  const { debtItems } = useStore()
  const [selected, setSelected] = useState<DebtItem | null>(null)
  const [search, setSearch] = useState('')
  const [filterSev, setFilterSev] = useState<string>('all')

  const filtered = useMemo(() =>
    debtItems
      .filter(d => filterSev === 'all' || d.severity === filterSev)
      .filter(d => !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.file_path?.toLowerCase().includes(search.toLowerCase())),
    [debtItems, search, filterSev]
  )

  return (
    <div style={{ maxWidth: '1400px' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5" style={{ flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', maxWidth: '280px' }}>
          <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            className="input"
            style={{ paddingLeft: '30px', fontSize: '12px' }}
            placeholder="Search issues..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input"
          style={{ width: 'auto', fontSize: '12px', padding: '6px 10px' }}
          value={filterSev}
          onChange={e => setFilterSev(e.target.value)}
        >
          <option value="all">All severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
            {filtered.length} of {debtItems.length} issues
          </span>
        </div>
      </div>

      {/* Kanban columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', alignItems: 'start' }}>
        {COLUMNS.map(col => {
          const colItems = filtered.filter(d => d.status === col.id)
          return (
            <div key={col.id}>
              {/* Column header */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 10px', marginBottom: '8px',
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  borderRadius: '6px'
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>{col.label}</span>
                <span
                  style={{
                    marginLeft: 'auto', fontSize: '11px', fontWeight: 600,
                    background: 'var(--bg-tertiary)', color: 'var(--text-muted)',
                    padding: '1px 6px', borderRadius: '4px'
                  }}
                >
                  {colItems.length}
                </span>
              </div>

              {/* Cards */}
              <div style={{ minHeight: '120px' }}>
                {colItems.map(item => (
                  <DebtCard key={item.id} item={item} onClick={() => setSelected(item)} />
                ))}
                {colItems.length === 0 && (
                  <div
                    style={{
                      textAlign: 'center', padding: '24px 12px',
                      fontSize: '12px', color: 'var(--text-dim)',
                      border: '1px dashed var(--border)', borderRadius: '6px'
                    }}
                  >
                    No items
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {selected && <DebtModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

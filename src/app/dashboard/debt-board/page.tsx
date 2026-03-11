'use client'

import { useState } from 'react'
import { ThumbsUp, Filter, Plus, X, ExternalLink, User, GitPullRequest, MessageSquare } from 'lucide-react'
import { MOCK_DEBT_ITEMS } from '@/lib/mock-data'
import type { DebtItem, DebtSeverity, DebtStatus } from '@/types'

const COLUMNS: { id: DebtStatus; label: string; color: string }[] = [
  { id: 'identified', label: 'IDENTIFIED', color: 'var(--text-muted)' },
  { id: 'planned', label: 'PLANNED', color: 'var(--cyan)' },
  { id: 'in_progress', label: 'IN PROGRESS', color: 'var(--yellow)' },
  { id: 'fixed', label: 'FIXED', color: 'var(--green)' },
]

function SeverityBadge({ s }: { s: DebtSeverity }) {
  const cls = s === 'critical' ? 'badge-critical' : s === 'high' ? 'badge-high' : s === 'medium' ? 'badge-medium' : 'badge-low'
  return <span className={cls}>{s.toUpperCase()}</span>
}

function DebtCard({ item, onClick }: { item: DebtItem; onClick: () => void }) {
  const [votes, setVotes] = useState(item.votes)
  const [voted, setVoted] = useState(false)
  return (
    <div className="debt-card p-4" onClick={onClick}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <SeverityBadge s={item.severity} />
        {item.sprint_id && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,229,255,0.08)', color: 'var(--cyan)' }}>
            Sprint 14
          </span>
        )}
      </div>
      <p className="text-sm font-medium mb-1 leading-snug">{item.title}</p>
      <p className="font-mono text-[10px] mb-3 truncate" style={{ color: 'var(--text-muted)' }}>{item.file_path}:{item.line_start}</p>
      <div className="flex items-center justify-between">
        <button onClick={e => { e.stopPropagation(); if (!voted) { setVotes(v => v + 1); setVoted(true) } }}
          className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg transition-all ${voted ? 'text-[#00e5ff] bg-[rgba(0,229,255,0.1)]' : ''}`}
          style={voted ? {} : { color: 'var(--text-muted)' }}>
          <ThumbsUp size={12} /> {votes}
        </button>
        <div className="flex items-center gap-2">
          {item.cost_usd > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,214,0,0.1)', color: 'var(--yellow)' }}>
              ${item.cost_usd.toLocaleString()}/mo
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function DebtModal({ item, onClose }: { item: DebtItem; onClose: () => void }) {
  const [status, setStatus] = useState(item.status)
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeInUp">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <SeverityBadge s={item.severity} />
            <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}>
              {item.type}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/5 transition-colors shrink-0">
            <X size={18} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        <h2 className="font-display text-lg font-bold mb-3">{item.title}</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{item.description}</p>

        {/* File path */}
        <div className="flex items-center gap-2 p-3 rounded-lg mb-4" style={{ background: 'var(--surface)' }}>
          <code className="font-mono text-xs flex-1" style={{ color: 'var(--cyan)' }}>
            {item.file_path}:{item.line_start}–{item.line_end}
          </code>
          <a href="#" className="p-1 rounded hover:bg-white/10" style={{ color: 'var(--text-muted)' }}>
            <ExternalLink size={13} />
          </a>
        </div>

        {/* Cost + fix time */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--surface)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Monthly Cost</p>
            <p className="font-bold font-display" style={{ color: 'var(--yellow)' }}>${item.cost_usd.toLocaleString()}/mo</p>
          </div>
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--surface)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Fix Estimate</p>
            <p className="font-bold font-display" style={{ color: 'var(--cyan)' }}>{item.fix_days}d</p>
          </div>
        </div>

        {/* Vote */}
        <div className="flex items-center gap-3 mb-4">
          <button className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            <ThumbsUp size={14} /> {item.votes} votes
          </button>
        </div>

        {/* Status + assign */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Status</label>
            <select className="input text-sm" value={status} onChange={e => setStatus(e.target.value as DebtStatus)}>
              {(['identified', 'planned', 'in_progress', 'fixed'] as DebtStatus[]).map(s => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Assign to</label>
            <select className="input text-sm">
              <option value="">Unassigned</option>
              <option value="user-1">Arjun Kumar</option>
              <option value="user-2">Priya Sharma</option>
              <option value="user-3">Rahul Mehta</option>
            </select>
          </div>
        </div>

        {/* PR link */}
        <div className="mb-4">
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Link PR</label>
          <div className="relative">
            <GitPullRequest size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
            <input className="input pl-8 text-sm" placeholder="https://github.com/..." defaultValue={item.pr_url || ''} />
          </div>
        </div>

        {/* Comments */}
        <div className="mb-4">
          <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
            <MessageSquare size={12} className="inline mr-1" />Comments
          </label>
          <textarea className="input resize-none text-sm" rows={3} placeholder="Add a comment..." />
        </div>

        <div className="flex gap-3">
          <button className="btn-primary flex-1 justify-center">Save changes</button>
          <button onClick={onClose} className="btn-ghost px-4">Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default function DebtBoardPage() {
  const [selectedItem, setSelectedItem] = useState<DebtItem | null>(null)
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterRepo, setFilterRepo] = useState<string>('all')

  const filtered = MOCK_DEBT_ITEMS.filter(d => {
    if (filterSeverity !== 'all' && d.severity !== filterSeverity) return false
    if (filterStatus !== 'all' && d.status !== filterStatus) return false
    if (filterRepo !== 'all' && d.repo_id !== filterRepo) return false
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Debt Board</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{MOCK_DEBT_ITEMS.filter(d => d.status !== 'fixed').length} open items · ${MOCK_DEBT_ITEMS.filter(d => d.status !== 'fixed').reduce((s, d) => s + d.cost_usd, 0).toLocaleString()}/month total cost</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <Filter size={15} style={{ color: 'var(--text-muted)' }} />
        {[
          { label: 'Repo', value: filterRepo, setter: setFilterRepo, opts: [['all', 'All Repos'], ['repo-1', 'api-server'], ['repo-2', 'frontend-app'], ['repo-3', 'payments-service']] },
          { label: 'Severity', value: filterSeverity, setter: setFilterSeverity, opts: [['all', 'All Severity'], ['critical', 'Critical'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low']] },
          { label: 'Status', value: filterStatus, setter: setFilterStatus, opts: [['all', 'All Status'], ['identified', 'Identified'], ['planned', 'Planned'], ['in_progress', 'In Progress'], ['fixed', 'Fixed']] },
        ].map(f => (
          <select key={f.label} className="input text-xs py-1.5 w-auto"
            value={f.value} onChange={e => f.setter(e.target.value)}>
            {f.opts.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
          </select>
        ))}
        <button className="btn-primary text-xs py-1.5 px-3 ml-auto">
          <Plus size={13} /> Add Item
        </button>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(col => {
          const items = filtered.filter(d => d.status === col.id)
          return (
            <div key={col.id} className="kanban-col shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold tracking-widest" style={{ color: col.color }}>
                  {col.label}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: 'var(--border)', color: 'var(--text-muted)' }}>
                  {items.length}
                </span>
              </div>
              <div className="space-y-3">
                {items.map(item => (
                  <DebtCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
                ))}
                {items.length === 0 && (
                  <div className="text-center py-8 text-xs" style={{ color: 'var(--text-dim)' }}>No items</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Debt detail modal */}
      {selectedItem && <DebtModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  )
}

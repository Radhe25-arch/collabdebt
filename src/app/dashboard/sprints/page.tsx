'use client'

import { useState } from 'react'
import { Zap, Plus, ChevronDown, ChevronRight, Sparkles, Calendar, CheckCircle } from 'lucide-react'
import { MOCK_SPRINT, MOCK_DEBT_ITEMS } from '@/lib/mock-data'

const PAST_SPRINTS = [
  { name: 'Sprint 13', start: '2024-05-01', end: '2024-05-14', fixed: 6, velocity: 7, status: 'completed' },
  { name: 'Sprint 12', start: '2024-04-17', end: '2024-04-30', fixed: 9, velocity: 8, status: 'completed' },
  { name: 'Sprint 11', start: '2024-04-03', end: '2024-04-16', fixed: 4, velocity: 5, status: 'completed' },
]

export default function SprintsPage() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showNewSprint, setShowNewSprint] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiShown, setAiShown] = useState(true)

  const sprintDays = 14
  const daysPassed = 7
  const progress = (daysPassed / sprintDays) * 100

  const handleAI = () => {
    setAiLoading(true)
    setTimeout(() => setAiLoading(false), 1800)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Sprints</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Plan and track debt reduction across sprints</p>
        </div>
        <button onClick={() => setShowNewSprint(true)} className="btn-primary text-sm">
          <Plus size={14} /> New Sprint
        </button>
      </div>

      {/* Current sprint */}
      <div className="card-glow" style={{ border: '1px solid rgba(0,229,255,0.2)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ background: 'rgba(0,229,255,0.08)' }}>
              <Zap size={20} style={{ color: 'var(--cyan)' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg">{MOCK_SPRINT.name}</h2>
                <span className="badge-cyan text-[10px]">ACTIVE</span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                <Calendar size={10} className="inline mr-1" />
                {new Date(MOCK_SPRINT.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} —{' '}
                {new Date(MOCK_SPRINT.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                · 7 days remaining
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
            <span>Sprint progress</span>
            <span>{daysPassed}/{sprintDays} days</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill-green h-full rounded-full transition-all" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--green), #00c9ff)' }} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Debt Items', value: 4, color: 'var(--cyan)' },
            { label: 'In Progress', value: 2, color: 'var(--yellow)' },
            { label: 'Blocked', value: 0, color: 'var(--red)' },
          ].map(s => (
            <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: 'var(--surface)' }}>
              <div className="text-2xl font-bold font-display" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendation */}
      {aiShown && (
        <div className="card animate-fadeInUp" style={{ border: '1px solid rgba(0,229,255,0.15)', background: 'rgba(0,229,255,0.03)' }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg mt-0.5" style={{ background: 'rgba(0,229,255,0.1)' }}>
                <Sparkles size={18} style={{ color: 'var(--cyan)' }} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">AI Sprint Recommender</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {MOCK_SPRINT.ai_recommendation}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {MOCK_DEBT_ITEMS.filter(d => d.sprint_id).map(item => (
                    <span key={item.id} className="text-xs px-2 py-1 rounded-lg font-mono"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                      {item.title.slice(0, 30)}...
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAI} disabled={aiLoading} className="btn-primary text-sm py-2 px-4">
              {aiLoading ? (
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />Generating...</span>
              ) : (
                <><Sparkles size={14} /> Apply recommendation</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Past sprints */}
      <div className="card">
        <h2 className="font-semibold mb-4">Past Sprints</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Sprint', 'Dates', 'Debt Fixed', 'Velocity', 'Status', ''].map(h => (
                  <th key={h} className="text-left pb-3 pr-4 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PAST_SPRINTS.map(sprint => (
                <>
                  <tr key={sprint.name} className="border-b cursor-pointer hover:bg-white/5 transition-colors"
                    style={{ borderColor: 'var(--border)' }}
                    onClick={() => setExpanded(expanded === sprint.name ? null : sprint.name)}>
                    <td className="py-3 pr-4 font-semibold">{sprint.name}</td>
                    <td className="py-3 pr-4 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(sprint.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(sprint.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3 pr-4 font-bold font-display" style={{ color: 'var(--green)' }}>{sprint.fixed}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 progress-bar h-1.5">
                          <div className="h-full rounded-full" style={{ width: `${(sprint.velocity / 10) * 100}%`, background: 'var(--cyan)' }} />
                        </div>
                        <span className="text-xs font-mono">{sprint.velocity}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="badge-low">completed</span>
                    </td>
                    <td className="py-3">
                      {expanded === sprint.name ? <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />}
                    </td>
                  </tr>
                  {expanded === sprint.name && (
                    <tr>
                      <td colSpan={6} className="pb-3">
                        <div className="p-3 rounded-xl mt-1" style={{ background: 'var(--surface)' }}>
                          <p className="text-xs mb-2 font-semibold" style={{ color: 'var(--text-muted)' }}>Items completed in {sprint.name}</p>
                          {MOCK_DEBT_ITEMS.filter(d => d.status === 'fixed').slice(0, 2).map(item => (
                            <div key={item.id} className="flex items-center gap-2 py-1.5">
                              <CheckCircle size={12} style={{ color: 'var(--green)' }} />
                              <span className="text-xs">{item.title}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New sprint modal */}
      {showNewSprint && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowNewSprint(false) }}>
          <div className="modal-box animate-fadeInUp">
            <h2 className="font-display text-lg font-bold mb-4">New Sprint</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Sprint Name</label>
                <input className="input" placeholder="Sprint 15" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Start Date</label>
                  <input className="input" type="date" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>End Date</label>
                  <input className="input" type="date" />
                </div>
              </div>
              <div className="flex gap-3">
                <button className="btn-primary flex-1 justify-center">Create Sprint</button>
                <button onClick={() => setShowNewSprint(false)} className="btn-ghost px-4">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

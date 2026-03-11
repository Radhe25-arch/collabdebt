'use client'

import { useState } from 'react'
import { GitBranch, Plus, RefreshCw, Settings, X, Github } from 'lucide-react'
import { MOCK_REPOS } from '@/lib/mock-data'

const HEALTH_COLOR = (s: number) => s > 70 ? '#00ff88' : s > 40 ? '#ffd600' : '#ff3b5c'
const HEALTH_LABEL = (s: number) => s > 70 ? 'Healthy' : s > 40 ? 'Moderate' : 'Critical'

const PROVIDER_ICONS: Record<string, React.FC<{ size: number }>> = {
  github: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
  gitlab: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#FC6D26"><path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"/></svg>,
  bitbucket: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="#2684FF"><path d="M.778 1.211a.768.768 0 0 0-.768.892l3.263 19.81a1.044 1.044 0 0 0 1.021.86H19.77a.769.769 0 0 0 .77-.646l3.266-20.02a.769.769 0 0 0-.77-.896zM14.52 15.53H9.522L8.17 8.466h7.561z"/></svg>,
}

export default function ReposPage() {
  const [connectOpen, setConnectOpen] = useState(false)
  const [scanning, setScanning] = useState<string | null>(null)

  const triggerScan = (id: string) => {
    setScanning(id)
    setTimeout(() => setScanning(null), 2000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Repositories</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{MOCK_REPOS.length} connected repos</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {MOCK_REPOS.map(repo => {
          const ProviderIcon = PROVIDER_ICONS[repo.provider]
          const hc = HEALTH_COLOR(repo.health_score)
          return (
            <div key={repo.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <ProviderIcon size={22} />
                  <div>
                    <h3 className="font-semibold">{repo.name}</h3>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{repo.full_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-lg"
                  style={{ background: `${hc}15`, color: hc }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: hc }} />
                  {repo.health_score} · {HEALTH_LABEL(repo.health_score)}
                </div>
              </div>

              <div className="progress-bar mb-3">
                <div className="h-full rounded-full transition-all" style={{ width: `${repo.health_score}%`, background: `linear-gradient(90deg, ${hc}, ${hc}88)` }} />
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                {[
                  { label: 'Open', value: 5, color: 'var(--red)' },
                  { label: 'Fixed', value: 8, color: 'var(--green)' },
                  { label: 'Last scan', value: '30m', color: 'var(--text-muted)' },
                ].map(s => (
                  <div key={s.label} className="p-2 rounded-lg" style={{ background: 'var(--surface)' }}>
                    <div className="font-bold font-display text-sm" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={() => triggerScan(repo.id)} disabled={scanning === repo.id}
                  className="btn-ghost text-xs py-1.5 flex-1 justify-center">
                  {scanning === repo.id ? (
                    <><RefreshCw size={12} className="animate-spin" /> Scanning...</>
                  ) : (
                    <><RefreshCw size={12} /> Scan now</>
                  )}
                </button>
                <button className="p-2 rounded-lg border transition-all hover:border-[#234860]" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  <Settings size={14} />
                </button>
              </div>
            </div>
          )
        })}

        {/* Connect repo card */}
        <button onClick={() => setConnectOpen(true)}
          className="card flex flex-col items-center justify-center gap-3 min-h-48 border-dashed cursor-pointer hover:border-[#234860] transition-colors"
          style={{ borderStyle: 'dashed' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--surface)' }}>
            <Plus size={22} style={{ color: 'var(--text-muted)' }} />
          </div>
          <p className="font-semibold" style={{ color: 'var(--text-muted)' }}>Connect repository</p>
          <p className="text-xs text-center" style={{ color: 'var(--text-dim)' }}>GitHub, GitLab, or Bitbucket</p>
        </button>
      </div>

      {connectOpen && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setConnectOpen(false) }}>
          <div className="modal-box animate-fadeInUp">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold">Connect Repository</h2>
              <button onClick={() => setConnectOpen(false)}><X size={18} style={{ color: 'var(--text-muted)' }} /></button>
            </div>
            {/* Tabs */}
            <div className="flex rounded-lg p-1 mb-6" style={{ background: 'var(--surface)' }}>
              {['GitHub', 'GitLab', 'Bitbucket'].map((t, i) => (
                <button key={t} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${i === 0 ? '' : ''}`}
                  style={i === 0 ? { background: 'var(--card)', color: 'var(--cyan)' } : { color: 'var(--text-muted)' }}>
                  {t}
                </button>
              ))}
            </div>
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--surface)' }}>
                <Github size={24} style={{ color: 'var(--text)' }} />
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                Install the CollabDebt GitHub App to connect your repositories and enable automatic scanning.
              </p>
              <button className="btn-primary">
                <Github size={16} /> Install GitHub App
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

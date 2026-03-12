'use client'

import { useState, useMemo } from 'react'
import { UserPlus, Search, Crown, MessageSquare, Mail, X, Shield, Plus, Loader2 } from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function TeamPage() {
  const { team, currentUser, isAdmin } = useStore()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const filtered = useMemo(() => {
    return team.filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
    )
  }, [team, search])

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setInviteOpen(false)
    }, 1000)
  }

  const isManager = currentUser?.role === 'manager' || isAdmin()

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>Fleet Command</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Manage your engineering personnel and roles.</p>
        </div>
        {isManager && (
          <button onClick={() => setInviteOpen(true)} className="btn-primary py-1.5 px-4 text-xs">
            <UserPlus size={14} /> Enlist Personnel
          </button>
        )}
      </div>

      {/* Control bar */}
      <div className="flex items-center gap-3 mb-6">
        <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
          <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            className="input"
            style={{ paddingLeft: '32px', fontSize: '12px' }}
            placeholder="Scan by identity or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-dim)' }}>
          {filtered.length} personnel active
        </div>
      </div>

      {/* Team List */}
      <div className="card overflow-hidden p-0" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Personnel</th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Status</th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Role</th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Activity</th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Fleet ID</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {filtered.map((member) => (
              <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs"
                      style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{member.name}</div>
                      <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${member.online ? 'bg-green-500' : 'bg-zinc-600'}`} />
                    <span className="text-xs" style={{ color: member.online ? 'var(--green)' : 'var(--text-dim)' }}>
                      {member.online ? 'Active' : 'Offline'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${member.role === 'manager' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                      {member.role === 'manager' ? 'Command' : 'Engineer'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px]" style={{ color: 'var(--text-dim)' }}>
                      <span>Neutralized Tasks</span>
                      <span>{member.items_fixed}</span>
                    </div>
                    <div className="w-24 h-1 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: `${Math.min(100, (member.items_fixed / 20) * 100)}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-[10px]" style={{ color: 'var(--text-dim)' }}>
                  {member.user_code}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--text-dim)' }}>
                    <Mail size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transmissions */}
      <div className="mt-12">
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={14} style={{ color: 'var(--text-dim)' }} /> Pending Transmissions
        </h2>
        <div className="space-y-2">
          {[
            { email: 'commander_alpha@acme.space', rank: 'Captain', status: 'Pending' },
            { email: 'officer_gamma@labs.io', rank: 'Navigator', status: 'En route' },
          ].map((inv, i) => (
            <div key={i} className="table-row">
              <Mail size={13} style={{ color: 'var(--text-dim)' }} />
              <div className="flex-1">
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)' }}>{inv.email}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Rank: {inv.rank}</div>
              </div>
              <span className="badge badge-muted">{inv.status}</span>
              <button className="p-1.5 text-zinc-500 hover:text-red-500 transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {inviteOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setInviteOpen(false)}>
          <div className="modal-box" style={{ maxWidth: '400px' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Enlist Personnel</h2>
              <X size={16} style={{ cursor: 'pointer', color: 'var(--text-dim)' }} onClick={() => setInviteOpen(false)} />
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Email Address
                </label>
                <input className="input" type="email" placeholder="jane@company.com" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Command Rank
                </label>
                <select className="input">
                  <option value="developer">Fleet Engineer</option>
                  <option value="manager">Command Officer</option>
                  <option value="viewer">Fleet Observer</option>
                </select>
              </div>
              <div className="pt-4">
                <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 justify-center">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Authorize Enlistment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

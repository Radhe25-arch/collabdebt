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

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((member) => (
          <div key={member.id} className="card group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div style={{
                  width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-tertiary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', border: '1px solid var(--border)'
                }}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{member.name}</span>
                    {member.role === 'manager' && <Crown size={11} className="text-yellow-500" />}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {member.role === 'manager' ? 'Command Officer' : 'Fleet Engineer'}
                  </div>
                </div>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full ${member.online ? 'bg-green-500' : 'bg-zinc-700'}`} />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div style={{ background: 'var(--bg-tertiary)', padding: '10px', borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '2px', textTransform: 'uppercase' }}>Items Fixed</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--purple)' }}>{member.items_fixed}</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '10px', borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '2px', textTransform: 'uppercase' }}>Fleet ID</div>
                <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', marginTop: '4px' }}>{member.user_code}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="btn-ghost flex-1 py-1.5 text-[11px] font-semibold">
                <Mail size={12} /> Contact
              </button>
              <button className="btn-ghost p-1.5">
                <Shield size={12} className="text-zinc-500" />
              </button>
            </div>
          </div>
        ))}
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

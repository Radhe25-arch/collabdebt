'use client'

import { useState } from 'react'
import { UserPlus, Search, MoreHorizontal, Crown, MessageSquare, UserCheck, X } from 'lucide-react'
import { MOCK_TEAM } from '@/lib/mock-data'

export default function TeamPage() {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = MOCK_TEAM.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.user_code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Team</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{MOCK_TEAM.length} members · 2 pending invites</p>
        </div>
        <button onClick={() => setInviteOpen(true)} className="btn-primary text-sm">
          <UserPlus size={14} /> Invite Member
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
        <input className="input pl-9" placeholder="Search by name or CD# code"
          value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>

      {/* Member list */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Member', 'Role', 'CD# Code', 'Items Fixed', 'Status', ''].map(h => (
                  <th key={h} className="text-left pb-3 px-4 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(member => (
                <tr key={member.id} className="border-b hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                        style={{ background: 'rgba(0,229,255,0.1)', color: 'var(--cyan)' }}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium flex items-center gap-2">
                          {member.name}
                          {member.role === 'manager' && <Crown size={12} style={{ color: '#ffd600' }} />}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={member.role === 'manager' ? 'badge-medium' : 'badge-cyan'} style={member.role === 'manager' ? { background: 'rgba(255,214,0,0.1)', borderColor: 'rgba(255,214,0,0.3)', color: '#ffd600' } : {}}>
                      {member.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{member.user_code}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold font-display" style={{ color: 'var(--green)' }}>{member.items_fixed}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={member.online ? 'dot-online' : 'dot-offline'} />
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{member.online ? 'Online' : 'Offline'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" style={{ color: 'var(--text-muted)' }}>
                        <MessageSquare size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" style={{ color: 'var(--text-muted)' }}>
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending invites */}
      <div className="card">
        <h2 className="font-semibold mb-3">Pending Invites</h2>
        {[
          { email: 'dev@acme.com', role: 'developer', sent: '2d ago' },
          { email: 'qa@acme.com', role: 'viewer', sent: '5d ago' },
        ].map((inv, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
            <div>
              <div className="text-sm font-medium">{inv.email}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Invited as {inv.role} · {inv.sent}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge-medium text-[10px]">Pending</span>
              <button className="p-1 rounded hover:bg-white/5" style={{ color: 'var(--text-dim)' }}><X size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Invite modal */}
      {inviteOpen && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setInviteOpen(false) }}>
          <div className="modal-box animate-fadeInUp">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold">Invite Member</h2>
              <button onClick={() => setInviteOpen(false)}><X size={18} style={{ color: 'var(--text-muted)' }} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Email address</label>
                <input className="input" type="email" placeholder="colleague@company.com" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Role</label>
                <select className="input">
                  <option value="developer">Developer</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button className="btn-primary flex-1 justify-center">
                  <UserCheck size={14} /> Send Invite
                </button>
                <button onClick={() => setInviteOpen(false)} className="btn-ghost px-4">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

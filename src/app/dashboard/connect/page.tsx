'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search, Filter, Crown, Star, GitBranch, MessageSquare,
  UserPlus, X, Check, Sparkles, Users, Lock, ArrowRight, Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

// ── Types ─────────────────────────────────────────────────────────────────
import { useStore } from '@/store/useStore'
import { TeamMember, UserWithProfile } from '@/types'

// ── Filter options ────────────────────────────────────────────────────────
const ROLE_FILTERS = [
  { id: 'frontend', label: 'Frontend', icon: '🖥️' },
  { id: 'backend', label: 'Backend', icon: '⚙️' },
  { id: 'fullstack', label: 'Full-Stack', icon: '🔧' },
  { id: 'mobile', label: 'Mobile', icon: '📱' },
  { id: 'devops', label: 'DevOps', icon: '☁️' },
  { id: 'ml_engineer', label: 'ML/AI', icon: '🤖' },
  { id: 'data_engineer', label: 'Data', icon: '🗄️' },
  { id: 'security', label: 'Security', icon: '🔒' },
  { id: 'designer', label: 'Designer', icon: '🎨' },
  { id: 'manager', label: 'Manager', icon: '👥' },
]

const EXP_FILTERS = [
  { id: 'student', label: 'Student' },
  { id: 'junior', label: 'Junior' },
  { id: 'mid', label: 'Mid-level' },
  { id: 'senior', label: 'Senior' },
  { id: 'staff', label: 'Staff+' },
]

const GOAL_FILTERS = [
  { id: 'find_collab', label: 'Open to collaborate' },
  { id: 'freelance', label: 'Available for freelance' },
  { id: 'mentor', label: 'Mentoring' },
  { id: 'opensource', label: 'Open Source' },
]

const EXP_LABEL: Record<string, string> = {
  student: 'Student', junior: '1–3 yrs', mid: '3–6 yrs',
  senior: '6–10 yrs', staff: 'Staff+', founder: 'Founder',
}

function ProfileCard({ profile, isPremium, onConnect }: {
  profile: TeamMember & UserWithProfile
  isPremium: boolean
  onConnect: (id: string) => void
}) {
  const [requested, setRequested] = useState(false)

  const handleConnect = () => {
    if (!isPremium) return
    setRequested(true)
    onConnect(profile.id)
  }

  return (
    <div className="card hover:border-cyan-500/30 transition-all group relative overflow-hidden"
      style={{ border: '1px solid var(--border)' }}>
      {/* Online indicator */}
      {profile.online && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--green)' }} />
          <span className="text-[10px]" style={{ color: 'var(--green)' }}>Online</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold shrink-0 relative"
          style={{ background: 'rgba(0,229,255,0.12)', color: 'var(--cyan)' }}>
          {profile.name.split(' ').map(n => n[0]).join('')}
          {profile.plan !== 'free' && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: profile.plan === 'team' ? '#a855f7' : 'var(--cyan)' }}>
              <Crown size={8} color="#000" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 pr-16">
          <div className="font-semibold text-sm">{profile.name}</div>
          {profile.username && (
            <div className="text-xs" style={{ color: 'var(--text-dim)' }}>@{profile.username}</div>
          )}
          <div className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text-dim)' }}>{profile.user_code}</div>
        </div>
      </div>

      {/* Roles + experience */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {(profile.tech_roles || []).map(r => {
          const rf = ROLE_FILTERS.find(x => x.id === r)
          return rf ? (
            <span key={r} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', color: 'var(--cyan)' }}>
              {rf.icon} {rf.label}
            </span>
          ) : null
        })}
        {profile.experience_level && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'rgba(255,214,0,0.08)', border: '1px solid rgba(255,214,0,0.2)', color: '#ffd600' }}>
            {EXP_LABEL[profile.experience_level]}
          </span>
        )}
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{profile.bio}</p>
      )}

      {/* Skills */}
      {(profile.skills || []).length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {(profile.skills || []).slice(0, 5).map(s => (
            <span key={s} className="text-[10px] px-2 py-0.5 rounded font-mono"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              {s}
            </span>
          ))}
          {(profile.skills || []).length > 5 && (
            <span className="text-[10px] px-2 py-0.5 rounded" style={{ color: 'var(--text-dim)' }}>
              +{profile.skills!.length - 5}
            </span>
          )}
        </div>
      )}

      {/* Goals */}
      {(profile.collab_goals || []).length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {(profile.collab_goals || []).map(g => {
            const gf = GOAL_FILTERS.find(x => x.id === g)
            return gf ? (
              <span key={g} className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(0,255,136,0.07)', border: '1px solid rgba(0,255,136,0.2)', color: 'var(--green)' }}>
                ✓ {gf.label}
              </span>
            ) : null
          })}
        </div>
      )}

      {/* Action */}
      {isPremium ? (
        <button
          onClick={handleConnect}
          disabled={requested}
          className="w-full py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          style={requested
            ? { background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', color: 'var(--green)' }
            : { background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.25)', color: 'var(--cyan)' }}>
          {requested ? <><Check size={12} /> Request sent</> : <><UserPlus size={12} /> Connect</>}
        </button>
      ) : (
        <Link href="/dashboard/billing?upgrade=pro"
          className="w-full py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7' }}>
          <Lock size={11} /> Upgrade to connect
        </Link>
      )}
    </div>
  )
}

export default function ConnectPage() {
  const { currentUser, team } = useStore()
  const isPremium = currentUser?.plan === 'pro' || currentUser?.plan === 'team' || currentUser?.plan === 'enterprise'
  
  const [search, setSearch] = useState('')
  const [roleFilters, setRoleFilters] = useState<string[]>([])
  const [expFilters, setExpFilters] = useState<string[]>([])
  const [goalFilters, setGoalFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const handleConnect = useCallback((id: string) => {
    console.log('Connect request to', id)
    // TODO: insert into connections table
  }, [])

  const toggleFilter = (val: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(val) ? list.filter(x => x !== val) : [...list, val])
  }

  const activeFilterCount = roleFilters.length + expFilters.length + goalFilters.length
  const filtered = (team as (TeamMember & UserWithProfile)[]).filter(p => {
    const matchSearch = !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.username?.toLowerCase().includes(search.toLowerCase()) ||
      (p.skills || []).some(s => s.toLowerCase().includes(search.toLowerCase()))

    const matchRole = roleFilters.length === 0 ||
      roleFilters.some(r => (p.tech_roles || []).includes(r as any))

    const matchExp = expFilters.length === 0 ||
      expFilters.includes(p.experience_level || '')

    const matchGoal = goalFilters.length === 0 ||
      goalFilters.some(g => (p.collab_goals || []).includes(g as any))

    return matchSearch && matchRole && matchExp && matchGoal
  })

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-2xl font-bold">CollabConnect™</h1>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.25)', color: 'var(--cyan)' }}>
              <Crown size={10} /> Premium
            </div>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Find developers, designers, and engineers to build together.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          <Users size={15} />
          <span>{filtered.length} devs online</span>
        </div>
      </div>

      {/* Upgrade banner for free users */}
      {!isPremium && (
        <div className="rounded-xl p-4 flex items-center gap-4"
          style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.25)' }}>
          <div className="p-2 rounded-lg" style={{ background: 'rgba(168,85,247,0.15)' }}>
            <Sparkles size={18} style={{ color: '#a855f7' }} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm" style={{ color: '#a855f7' }}>CollabConnect™ is a premium feature</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Upgrade to Pro or Team to send connection requests and collaborate on projects.
            </div>
          </div>
          <Link href="/dashboard/billing?upgrade=pro"
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
            style={{ background: '#a855f7', borderColor: '#a855f7' }}>
            Upgrade now <ArrowRight size={12} />
          </Link>
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
          <input
            className="input pl-9 text-sm w-full"
            placeholder="Search by name, skill, or @username..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-ghost text-sm py-2 px-4 flex items-center gap-2 relative"
          style={showFilters ? { borderColor: 'var(--cyan)', color: 'var(--cyan)' } : {}}>
          <Filter size={14} /> Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{ background: 'var(--cyan)', color: '#000' }}>
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card space-y-5">
          {/* Role filters */}
          <div>
            <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>ROLE</div>
            <div className="flex flex-wrap gap-2">
              {ROLE_FILTERS.map(r => {
                const active = roleFilters.includes(r.id)
                return (
                  <button key={r.id}
                    onClick={() => toggleFilter(r.id, roleFilters, setRoleFilters)}
                    className="text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
                    style={{
                      background: active ? 'rgba(0,229,255,0.1)' : 'var(--surface)',
                      border: `1px solid ${active ? 'var(--cyan)' : 'var(--border)'}`,
                      color: active ? 'var(--cyan)' : 'var(--text-muted)',
                      fontWeight: active ? 600 : 400,
                    }}>
                    {r.icon} {r.label}
                    {active && <X size={10} />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Experience */}
          <div>
            <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>EXPERIENCE</div>
            <div className="flex flex-wrap gap-2">
              {EXP_FILTERS.map(e => {
                const active = expFilters.includes(e.id)
                return (
                  <button key={e.id}
                    onClick={() => toggleFilter(e.id, expFilters, setExpFilters)}
                    className="text-xs px-3 py-1.5 rounded-lg transition-all"
                    style={{
                      background: active ? 'rgba(255,214,0,0.1)' : 'var(--surface)',
                      border: `1px solid ${active ? '#ffd600' : 'var(--border)'}`,
                      color: active ? '#ffd600' : 'var(--text-muted)',
                      fontWeight: active ? 600 : 400,
                    }}>
                    {e.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Goals */}
          <div>
            <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>LOOKING FOR</div>
            <div className="flex flex-wrap gap-2">
              {GOAL_FILTERS.map(g => {
                const active = goalFilters.includes(g.id)
                return (
                  <button key={g.id}
                    onClick={() => toggleFilter(g.id, goalFilters, setGoalFilters)}
                    className="text-xs px-3 py-1.5 rounded-lg transition-all"
                    style={{
                      background: active ? 'rgba(0,255,136,0.08)' : 'var(--surface)',
                      border: `1px solid ${active ? 'var(--green)' : 'var(--border)'}`,
                      color: active ? 'var(--green)' : 'var(--text-muted)',
                      fontWeight: active ? 600 : 400,
                    }}>
                    {g.label}
                  </button>
                )
              })}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button onClick={() => { setRoleFilters([]); setExpFilters([]); setGoalFilters([]) }}
              className="text-xs flex items-center gap-1.5" style={{ color: 'var(--red)' }}>
              <X size={11} /> Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
          <Users size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No developers match your filters.</p>
          <button onClick={() => { setSearch(''); setRoleFilters([]); setExpFilters([]); setGoalFilters([]) }}
            className="text-xs mt-2 underline" style={{ color: 'var(--cyan)' }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(profile => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              isPremium={isPremium}
              onConnect={handleConnect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

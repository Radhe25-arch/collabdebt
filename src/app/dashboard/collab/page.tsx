'use client'

import { useState, useMemo } from 'react'
import { Search, Lock, Filter, X, MessageSquare, Github, Globe } from 'lucide-react'
import Link from 'next/link'
import { useStore } from '@/store/useStore'

const ROLE_FILTERS = ['All', 'Frontend', 'Backend', 'Fullstack', 'Mobile', 'DevOps', 'ML / AI', 'Security', 'Data']
const LANG_FILTERS = ['All', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C#', 'Swift', 'Kotlin']
const GOAL_LABELS: Record<string, string> = {
  fix_debt: 'Fix Debt', find_collab: 'Collaborate', learn: 'Learning',
  hire: 'Hiring', opensource: 'Open Source', mentor: 'Mentor'
}

type ProfileMock = {
  id: string
  name: string
  username: string
  role: string
  bio: string
  skills: string[]
  goals: string[]
  available: boolean
}

// Mock profiles for UI (real data comes from Supabase users table with collab_public = true)
const MOCK_PROFILES: ProfileMock[] = [
  { id: '1', name: 'Arjun Mehta', username: 'arjunm_dev', role: 'Backend Developer', bio: 'Go + Postgres specialist. 7 years in fintech. Love working on distributed systems.', skills: ['Go', 'Python', 'SQL'], goals: ['find_collab', 'opensource'], available: true },
  { id: '2', name: 'Priya Sharma', username: 'priyasharma', role: 'Fullstack Developer', bio: 'Next.js, Node, and AWS. Currently building an AI-first SaaS. Looking for co-founders.', skills: ['TypeScript', 'Python'], goals: ['find_collab', 'hire'], available: true },
  { id: '3', name: 'Luca Bianchi', username: 'lucab', role: 'ML / AI Engineer', bio: 'ML infra at a healthcare startup. PyTorch, ONNX, HuggingFace. Open to OSS collaboration.', skills: ['Python', 'Rust'], goals: ['opensource', 'mentor'], available: false },
  { id: '4', name: 'Sofia Petrova', username: 'sofiap', role: 'Frontend Developer', bio: 'React + TypeScript. Design systems, accessibility, and performance. Mentor to junior devs.', skills: ['TypeScript', 'Swift'], goals: ['mentor', 'learn'], available: true },
  { id: '5', name: 'Kenji Nakamura', username: 'kenjin', role: 'DevOps', bio: 'Kubernetes, Terraform, observability. Building internal dev platform at a Series B startup.', skills: ['Go', 'Python', 'Shell'], goals: ['find_collab', 'fix_debt'], available: true },
  { id: '6', name: 'Amara Diallo', username: 'amaradev', role: 'Mobile Developer', bio: 'React Native and Flutter. Cross-platform, offline-first apps. Open to startup collabs.', skills: ['TypeScript', 'Kotlin', 'Swift'], goals: ['find_collab', 'opensource'], available: false },
]

function ProfileCard({ profile, isPro }: { profile: ProfileMock; isPro: boolean }) {
  const initials = profile.name.split(' ').map(n => n[0]).join('')

  if (!isPro) {
    return (
      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: '8px', padding: '20px', filter: 'blur(3px)', userSelect: 'none',
        pointerEvents: 'none', position: 'relative'
      }}>
        {/* Blurred preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-tertiary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text)' }}>{profile.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>@{profile.username}</div>
          </div>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{profile.bio}</p>
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
      borderRadius: '8px', padding: '20px', transition: 'border-color 0.15s'
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-tertiary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)',
            border: '1px solid var(--border)'
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text)' }}>{profile.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>@{profile.username} · {profile.role}</div>
          </div>
        </div>
        <div style={{
          width: '7px', height: '7px', borderRadius: '50%', marginTop: '6px',
          background: profile.available ? 'var(--green)' : 'var(--border-hover)'
        }} title={profile.available ? 'Available' : 'Busy'} />
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '12px' }}>
        {profile.bio}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '14px' }}>
        {profile.skills.map(s => (
          <span key={s} className="badge badge-muted">{s}</span>
        ))}
        {profile.goals.map(g => (
          <span key={g} style={{
            display: 'inline-flex', alignItems: 'center', padding: '2px 7px', borderRadius: '4px',
            fontSize: '10px', fontWeight: 600, background: 'rgba(0,112,243,0.08)', color: 'var(--blue)'
          }}>
            {GOAL_LABELS[g]}
          </span>
        ))}
      </div>

      <button style={{
        width: '100%', padding: '7px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
        background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        transition: 'all 0.15s'
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
      >
        <MessageSquare size={12} /> Reach out
      </button>
    </div>
  )
}

export default function CollabConnectPage() {
  const { currentUser } = useStore()
  const isPro = currentUser?.plan === 'pro' || currentUser?.plan === 'team' || currentUser?.plan === 'enterprise'

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [langFilter, setLangFilter] = useState('All')
  const [goalFilter, setGoalFilter] = useState('all')
  const [availableOnly, setAvailableOnly] = useState(false)

  const filtered = useMemo(() => MOCK_PROFILES.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.bio.toLowerCase().includes(search.toLowerCase())) return false
    if (roleFilter !== 'All' && !p.role.includes(roleFilter)) return false
    if (langFilter !== 'All' && !p.skills.includes(langFilter)) return false
    if (goalFilter !== 'all' && !p.goals.includes(goalFilter)) return false
    if (availableOnly && !p.available) return false
    return true
  }), [search, roleFilter, langFilter, goalFilter, availableOnly])

  return (
    <div style={{ maxWidth: '1000px' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>CollabConnect</h1>
          {!isPro && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '100px',
              background: 'rgba(245,166,35,0.1)', color: 'var(--yellow)', border: '1px solid rgba(245,166,35,0.2)'
            }}>
              <Lock size={9} /> Pro feature
            </span>
          )}
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Discover engineers open to collaboration. Filter by role, language, and goals.
        </p>
      </div>

      {/* Pro gate banner */}
      {!isPro && (
        <div style={{
          background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.2)',
          borderRadius: '8px', padding: '16px 20px', marginBottom: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
              Unlock full access to CollabConnect
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              See full profiles, reach out directly, and get matched based on your skills and goals.
            </div>
          </div>
          <Link href="/dashboard/billing" style={{
            padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600,
            background: 'var(--yellow)', color: '#000', textDecoration: 'none', whiteSpace: 'nowrap'
          }}>
            Upgrade to Pro
          </Link>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '280px' }}>
          <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            className="input"
            style={{ paddingLeft: '30px', fontSize: '12px' }}
            placeholder="Search engineers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          className="input"
          style={{ width: 'auto', fontSize: '12px', padding: '6px 10px' }}
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
        >
          {ROLE_FILTERS.map(r => <option key={r}>{r}</option>)}
        </select>

        <select
          className="input"
          style={{ width: 'auto', fontSize: '12px', padding: '6px 10px' }}
          value={langFilter}
          onChange={e => setLangFilter(e.target.value)}
        >
          {LANG_FILTERS.map(l => <option key={l}>{l}</option>)}
        </select>

        <select
          className="input"
          style={{ width: 'auto', fontSize: '12px', padding: '6px 10px' }}
          value={goalFilter}
          onChange={e => setGoalFilter(e.target.value)}
        >
          <option value="all">All goals</option>
          {Object.entries(GOAL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>

        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={e => setAvailableOnly(e.target.checked)}
            style={{ accentColor: 'var(--blue)' }}
          />
          Available only
        </label>

        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-dim)' }}>
          {filtered.length} engineers
        </span>
      </div>

      {/* Profile grid */}
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
          {filtered.map((profile, i) => (
            <ProfileCard key={profile.id} profile={profile} isPro={isPro || i < 1} />
          ))}
        </div>

        {/* Blur overlay for non-pro */}
        {!isPro && (
          <div style={{
            position: 'absolute', inset: '60px 0 0 0',
            background: 'linear-gradient(to bottom, transparent 0%, var(--bg) 40%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
            paddingBottom: '60px', pointerEvents: 'none'
          }}>
          </div>
        )}
        {!isPro && (
          <div style={{ textAlign: 'center', marginTop: '-60px', position: 'relative', paddingBottom: '40px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Lock size={28} style={{ color: 'var(--text-dim)', margin: '0 auto 8px' }} />
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                {filtered.length - 1} more engineers match your filters
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Upgrade to Pro to see full profiles and reach out directly.
              </div>
            </div>
            <Link href="/dashboard/billing" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 24px', borderRadius: '7px', fontSize: '13px', fontWeight: 600,
              background: 'var(--text)', color: 'var(--bg)', textDecoration: 'none'
            }}>
              Upgrade to Pro
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

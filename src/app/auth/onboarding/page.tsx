'use client'

import { useState } from 'react'
import { Check, ChevronRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store/useStore'
import toast from 'react-hot-toast'

const ROLES = [
  'Frontend Developer', 'Backend Developer', 'Fullstack Developer',
  'Mobile Developer', 'DevOps / SRE', 'Data Engineer',
  'ML / AI Engineer', 'Security Engineer', 'QA Engineer',
  'Engineering Manager', 'Architect', 'Product Engineer',
]

const LANGUAGES = [
  'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java',
  'C#', 'C/C++', 'Ruby', 'PHP', 'Swift', 'Kotlin',
  'Scala', 'Elixir', 'Dart', 'R', 'SQL', 'Shell',
]

const GOALS = [
  { id: 'fix_debt', label: 'Fix existing technical debt', desc: 'I want to track and resolve debt in my codebase' },
  { id: 'find_collab', label: 'Find collaborators', desc: 'I want to work with other engineers on shared problems' },
  { id: 'learn', label: 'Learn best practices', desc: 'I want to improve code quality across my team' },
  { id: 'hire', label: 'Hire engineers', desc: 'I\'m looking for developers to join my project or team' },
  { id: 'opensource', label: 'Open source work', desc: 'I want to contribute to or maintain open source projects' },
  { id: 'mentor', label: 'Mentor others', desc: 'I want to help junior engineers grow' },
]

type Step = 'role' | 'languages' | 'goals' | 'bio'

export default function OnboardingPage() {
  const supabase = createClient()
  const { currentUser, setCurrentUser } = useStore()
  const [step, setStep] = useState<Step>('role')
  const [loading, setLoading] = useState(false)

  const [selected, setSelected] = useState({
    roles: [] as string[],
    languages: [] as string[],
    goals: [] as string[],
    bio: '',
  })

  const toggleMulti = (key: 'roles' | 'languages' | 'goals', val: string) => {
    setSelected(s => ({
      ...s,
      [key]: s[key].includes(val) ? s[key].filter(v => v !== val) : [...s[key], val]
    }))
  }

  const steps: Step[] = ['role', 'languages', 'goals', 'bio']
  const stepIdx = steps.indexOf(step)

  const canNext = {
    role: selected.roles.length > 0,
    languages: selected.languages.length > 0,
    goals: selected.goals.length > 0,
    bio: true,
  }

  const handleNext = () => {
    const next = steps[stepIdx + 1]
    if (next) setStep(next)
    else handleFinish()
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth/signup'; return }

      const payload = {
        id: user.id,
        email: user.email,
        name: currentUser?.name || user.user_metadata?.name || 'User',
        username: currentUser?.username || user.user_metadata?.username || 'user' + user.id.slice(0, 4),
        user_code: currentUser?.user_code || 'CD#' + Math.floor(1000 + Math.random() * 9000),
        plan: 'free',
        role: 'developer',
        onboarding_done: true,
        bio: selected.bio,
        tech_roles: selected.roles,
        skills: selected.languages,
        collab_goals: selected.goals,
        last_seen: new Date().toISOString(),
        created_at: user.created_at,
      }

      const { error } = await supabase.from('users').upsert(payload)
      if (error) throw error

      if (currentUser) {
        setCurrentUser({ ...currentUser, onboarding_done: true, role: 'developer', plan: 'free' } as any)
      }

      window.location.href = '/dashboard'
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Something went wrong, please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top left, #0a192f 0%, #020609 100%)', 
      display: 'flex',
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0, 242, 255, 0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="glass border border-white/5 rounded-[32px] p-10 shadow-2xl relative z-10" style={{ width: '100%', maxWidth: '640px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '6px', background: 'var(--blue)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff'
          }}>CD</div>
          <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)' }}>CollabDebt</span>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '48px' }}>
          {steps.map((s, i) => (
            <div key={s} style={{
              flex: 1, 
              height: '4px', 
              borderRadius: '2px', 
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              background: i <= stepIdx ? 'var(--blue)' : 'var(--border)',
              boxShadow: i <= stepIdx ? '0 0 10px rgba(0,112,243,0.3)' : 'none'
            }} />
          ))}
        </div>

        {/* Step: Role */}
        {step === 'role' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px' }}>
              What do you do?
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Select your engineering roles (You can pick multiple).
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
              {ROLES.map(role => {
                const active = selected.roles.includes(role)
                return (
                  <button
                    key={role}
                    onClick={() => toggleMulti('roles', role)}
                    style={{
                      padding: '12px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 600,
                      textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                      background: active ? 'rgba(0,112,243,0.1)' : 'white/[0.02]',
                      border: `1px solid ${active ? 'var(--blue)' : 'rgba(255,255,255,0.05)'}`,
                      color: active ? 'var(--blue)' : 'var(--text-muted)',
                    }}
                  >
                    {active && <span style={{ marginRight: '8px' }}>✓</span>}
                    {role}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step: Languages */}
        {step === 'languages' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px' }}>
              What languages do you know?
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Select all that apply. This helps with collaboration matching.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {LANGUAGES.map(lang => {
                const active = selected.languages.includes(lang)
                return (
                  <button
                    key={lang}
                    onClick={() => toggleMulti('languages', lang)}
                    style={{
                      padding: '7px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: 500,
                      cursor: 'pointer', transition: 'all 0.15s',
                      background: active ? 'rgba(0,112,243,0.1)' : 'var(--bg-secondary)',
                      border: `1px solid ${active ? 'var(--blue)' : 'var(--border)'}`,
                      color: active ? 'var(--blue)' : 'var(--text-muted)',
                    }}
                  >
                    {active && <span style={{ marginRight: '4px' }}>✓</span>}
                    {lang}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step: Goals */}
        {step === 'goals' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px' }}>
              What are you here for?
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Pick your primary goals. You can select multiple.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {GOALS.map(g => {
                const active = selected.goals.includes(g.id)
                return (
                  <button
                    key={g.id}
                    onClick={() => toggleMulti('goals', g.id)}
                    style={{
                      padding: '14px 16px', borderRadius: '8px', textAlign: 'left',
                      cursor: 'pointer', transition: 'all 0.15s',
                      background: active ? 'rgba(0,112,243,0.07)' : 'var(--bg-secondary)',
                      border: `1px solid ${active ? 'var(--blue)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', gap: '12px',
                    }}
                  >
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
                      background: active ? 'var(--blue)' : 'var(--bg-tertiary)',
                      border: `1px solid ${active ? 'var(--blue)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {active && <Check size={11} style={{ color: '#fff' }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: active ? 'var(--blue)' : 'var(--text)' }}>{g.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>{g.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step: Bio */}
        {step === 'bio' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px' }}>
              Tell the community about yourself
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              This shows on your profile and in CollabConnect discovery. Optional but recommended.
            </p>
            <textarea
              value={selected.bio}
              onChange={e => setSelected(s => ({ ...s, bio: e.target.value }))}
              placeholder="e.g. Senior engineer at Stripe. Passionate about distributed systems, Rust, and DX tooling."
              rows={5}
              style={{
                width: '100%', padding: '12px', fontSize: '13px', lineHeight: 1.7,
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: '8px', color: 'var(--text)', resize: 'vertical',
                fontFamily: 'inherit', outline: 'none',
              }}
            />
            <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px' }}>
              {selected.bio.length} / 400 characters
            </p>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '32px' }}>
          {stepIdx > 0 ? (
            <button
              onClick={() => setStep(steps[stepIdx - 1])}
              className="btn-ghost"
              style={{ fontSize: '13px' }}
            >
              Back
            </button>
          ) : <span />}

          <button
            onClick={handleNext}
            disabled={!canNext[step] || loading}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            {stepIdx < steps.length - 1 ? (
              <><span>Continue</span><ChevronRight size={14} /></>
            ) : (
              <span>Finish setup</span>
            )}
          </button>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '16px' }}>
          Step {stepIdx + 1} of {steps.length}
        </p>
      </div>
    </div>
  )
}

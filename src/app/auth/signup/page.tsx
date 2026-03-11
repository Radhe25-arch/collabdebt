'use client'

import { useState, useEffect, useRef } from 'react'
import { Github, Eye, EyeOff, Loader2, Check, X, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store/useStore'
import toast from 'react-hot-toast'

type Tab = 'signin' | 'signup'
type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid'

export default function AuthPage() {
  const supabase = createClient()
  const { setCurrentUser } = useStore()
  const [tab, setTab] = useState<Tab>('signin')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle')
  const usernameTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  // Username availability check
  useEffect(() => {
    if (tab !== 'signup') return
    const raw = form.username.trim()
    if (!raw) { setUsernameStatus('idle'); return }
    if (!/^[a-zA-Z0-9._-]{3,30}$/.test(raw)) { setUsernameStatus('invalid'); return }
    setUsernameStatus('checking')
    if (usernameTimer.current) clearTimeout(usernameTimer.current)
    usernameTimer.current = setTimeout(async () => {
      const { data } = await supabase.from('users').select('username').eq('username', raw).single()
      setUsernameStatus(data ? 'taken' : 'available')
    }, 500)
  }, [form.username, tab])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.username || !form.email || !form.password) {
      toast.error('All fields are required'); return
    }
    if (usernameStatus !== 'available') {
      toast.error('Please choose a valid, available username'); return
    }
    setLoading('signup')
    const { error, data } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name, username: form.username } }
    })
    setLoading(null)
    if (error) { toast.error(error.message); return }
    if (data.user) {
      setCurrentUser({
        id: data.user.id, email: data.user.email || '',
        name: form.name, username: form.username,
        user_code: 'CD#' + Math.floor(1000 + Math.random() * 9000),
        plan: 'free', role: 'developer', onboarding_done: false,
        avatar_url: undefined, created_at: data.user.created_at,
        last_seen: new Date().toISOString()
      })
      window.location.href = '/auth/onboarding'
    }
  }

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Enter your credentials'); return }
    setLoading('signin')
    const { error, data } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    setLoading(null)
    if (error) { toast.error('Invalid credentials'); return }
    if (data.user) {
      setCurrentUser({
        id: data.user.id, email: data.user.email || '',
        name: data.user.user_metadata?.name || 'User',
        username: data.user.user_metadata?.username || '',
        user_code: 'CD#' + data.user.id.slice(0, 4).toUpperCase(),
        plan: 'free', role: 'developer', onboarding_done: true,
        avatar_url: data.user.user_metadata?.avatar_url,
        created_at: data.user.created_at, last_seen: new Date().toISOString()
      })
      window.location.href = '/dashboard'
    }
  }

  const handleOAuth = async (provider: 'github' | 'google') => {
    setLoading(provider)
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${location.origin}/dashboard` } })
  }

  const UsernameIcon = () => {
    if (usernameStatus === 'checking') return <Loader2 size={13} className="animate-spin" style={{ color: 'var(--text-dim)' }} />
    if (usernameStatus === 'available') return <Check size={13} style={{ color: 'var(--green)' }} />
    if (usernameStatus === 'taken') return <X size={13} style={{ color: 'var(--red)' }} />
    if (usernameStatus === 'invalid') return <AlertCircle size={13} style={{ color: 'var(--yellow)' }} />
    return null
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '36px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '6px', background: 'var(--blue)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 700, color: '#fff'
          }}>CD</div>
          <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)' }}>CollabDebt</span>
        </div>

        {/* Toggle */}
        <div style={{
          display: 'flex', borderRadius: '8px',
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          padding: '3px', marginBottom: '28px'
        }}>
          {(['signin', 'signup'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setForm({ name: '', username: '', email: '', password: '' }); setUsernameStatus('idle') }}
              style={{
                flex: 1, padding: '7px', borderRadius: '6px', fontSize: '13px', fontWeight: 500,
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                background: tab === t ? 'var(--bg)' : 'transparent',
                color: tab === t ? 'var(--text)' : 'var(--text-muted)',
                boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
              }}
            >
              {t === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        {/* OAuth */}
        <button
          onClick={() => handleOAuth('github')}
          disabled={!!loading}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '10px', borderRadius: '7px', fontSize: '13px', fontWeight: 500,
            background: 'var(--bg-secondary)', border: '1px solid var(--border)', cursor: 'pointer',
            color: 'var(--text)', marginBottom: '16px'
          }}
        >
          {loading === 'github' ? <Loader2 size={14} className="animate-spin" /> : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          )}
          Continue with GitHub
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {/* Form */}
        <form onSubmit={tab === 'signin' ? handleSignin : handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {tab === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '5px' }}>
                Full name <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <input className="input" placeholder="Jane Doe" value={form.name} onChange={set('name')} required />
            </div>
          )}

          {tab === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '5px' }}>
                Username <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  fontSize: '13px', color: 'var(--text-dim)'
                }}>@</span>
                <input
                  className="input"
                  style={{ paddingLeft: '26px', paddingRight: '32px' }}
                  placeholder="janedoe"
                  value={form.username}
                  onChange={set('username')}
                  required
                />
                <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                  <UsernameIcon />
                </div>
              </div>
              {usernameStatus === 'taken' && <p style={{ fontSize: '11px', color: 'var(--red)', marginTop: '4px' }}>Username already taken</p>}
              {usernameStatus === 'invalid' && <p style={{ fontSize: '11px', color: 'var(--yellow)', marginTop: '4px' }}>3–30 chars, letters/numbers/._- only</p>}
              {usernameStatus === 'available' && <p style={{ fontSize: '11px', color: 'var(--green)', marginTop: '4px' }}>@{form.username} is available</p>}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '5px' }}>
              Email <span style={{ color: 'var(--red)' }}>*</span>
            </label>
            <input className="input" type="email" placeholder="you@company.com" value={form.email} onChange={set('email')} required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '5px' }}>
              Password <span style={{ color: 'var(--red)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type={showPass ? 'text' : 'password'}
                placeholder="Min 8 characters"
                value={form.password}
                onChange={set('password')}
                style={{ paddingRight: '36px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: 0
                }}
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={!!loading || (tab === 'signup' && usernameStatus !== 'available')}
            style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
          >
            {loading === 'signin' || loading === 'signup'
              ? <Loader2 size={14} className="animate-spin" />
              : tab === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        {tab === 'signin' && (
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-dim)', marginTop: '16px' }}>
            <a href="#" style={{ color: 'var(--blue)', textDecoration: 'none' }}>Forgot password?</a>
          </p>
        )}

        <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '24px', textAlign: 'center', lineHeight: 1.6 }}>
          By continuing, you agree to our{' '}
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>Terms</a>
          {' '}and{' '}
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}

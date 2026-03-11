'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Github, Mail, Eye, EyeOff, ArrowRight, Loader2, Chrome } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const OAUTH_PROVIDERS = [
  { id: 'github', label: 'Continue with GitHub', icon: Github },
  { id: 'google', label: 'Continue with Google', icon: Chrome },
]

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [tab, setTab] = useState<'signup' | 'login'>('signup')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '', username: '', email: '', password: '', bio: ''
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleOAuth = async (provider: 'github' | 'google') => {
    setLoading(provider)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        queryParams: provider === 'google' ? { access_type: 'offline', prompt: 'consent' } : undefined,
      },
    })
    if (error) { toast.error(error.message); setLoading(null) }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all required fields'); return
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters'); return
    }
    setLoading('email')

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        data: { name: form.name, username: form.username, bio: form.bio },
      },
    })

    if (error) { toast.error(error.message); setLoading(null); return }

    // If email confirmation is disabled, user gets a session immediately
    if (data.session) {
      // Upsert profile then go to onboarding
      await fetch('/api/profile/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, username: form.username, bio: form.bio }),
      })
      await fetch('/api/email/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email }),
      })
      router.push('/auth/onboarding')
      return
    }

    // Email confirmation required — go to verify page
    await fetch('/api/email/welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email }),
    })
    router.push(`/auth/verify?email=${encodeURIComponent(form.email)}`)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Please enter email and password'); return }
    setLoading('email')

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) { toast.error('Incorrect email or password'); setLoading(null); return }

    // router.refresh() forces Next.js to re-check middleware with new session cookies
    // then router.push navigates — without refresh(), middleware sees stale cache
    router.refresh()
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: 'var(--bg)' }}>

      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 30%, rgba(0,229,255,0.05) 0%, transparent 70%)' }} />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm"
              style={{ background: 'var(--cyan)', color: 'var(--bg)' }}>CD</div>
            <span className="font-display font-bold text-xl">CollabDebt</span>
          </Link>
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {/* Tabs */}
          <div className="flex rounded-xl p-1 mb-7" style={{ background: 'var(--surface)' }}>
            {(['signup', 'login'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize"
                style={tab === t
                  ? { background: 'var(--card)', color: 'var(--cyan)', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }
                  : { color: 'var(--text-muted)' }}>
                {t === 'signup' ? 'Sign up' : 'Sign in'}
              </button>
            ))}
          </div>

          <h2 className="font-display font-bold text-xl mb-1">
            {tab === 'signup' ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            {tab === 'signup' ? 'Start fixing technical debt today — free forever' : 'Sign in to your CollabDebt workspace'}
          </p>

          {/* OAuth */}
          <div className="space-y-3 mb-5">
            {OAUTH_PROVIDERS.map(({ id, label, icon: Icon }) => (
              <button key={id}
                onClick={() => handleOAuth(id as 'github' | 'google')}
                disabled={loading !== null}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium transition-all hover:border-cyan-500"
                style={{ background: 'var(--surface)', border: '1px solid var(--border-bright)', color: 'var(--text)' }}>
                {loading === id
                  ? <Loader2 size={16} className="animate-spin" />
                  : <Icon size={16} />}
                {loading === id ? `Connecting to ${id}...` : label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-dim)' }}>or continue with email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          <form onSubmit={tab === 'signup' ? handleSignup : handleLogin} className="space-y-4">
            {tab === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    Full Name <span style={{ color: 'var(--red)' }}>*</span>
                  </label>
                  <input value={form.name} onChange={set('name')}
                    className="input" placeholder="Arjun Kumar"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    Username <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>(optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-dim)' }}>@</span>
                    <input value={form.username} onChange={set('username')}
                      className="input pl-7" placeholder="arjun_k"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                  </div>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--text-dim)' }}>A unique CD#XXXX code will be auto-assigned</p>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Email address <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <input value={form.email} onChange={set('email')}
                type="email" className="input" placeholder="arjun@acme.com"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Password <span style={{ color: 'var(--red)' }}>*</span>
                {tab === 'login' && (
                  <Link href="/auth/reset" className="float-right text-[10px] hover:underline" style={{ color: 'var(--cyan)' }}>
                    Forgot password?
                  </Link>
                )}
              </label>
              <div className="relative">
                <input value={form.password} onChange={set('password')}
                  type={showPass ? 'text' : 'password'}
                  className="input pr-10" placeholder={tab === 'signup' ? 'Min 8 characters' : '••••••••'}
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
                  style={{ color: 'var(--text-dim)' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Bio <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>(optional · {form.bio.length}/160)</span>
                </label>
                <textarea value={form.bio} onChange={set('bio')}
                  className="input resize-none h-16 text-sm" placeholder="Backend dev @ Acme"
                  maxLength={160}
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              </div>
            )}

            <button type="submit" disabled={loading !== null}
              className="btn-primary w-full justify-center py-3 mt-2"
              style={loading === 'email' ? { opacity: 0.7 } : {}}>
              {loading === 'email'
                ? <><Loader2 size={16} className="animate-spin" /> {tab === 'signup' ? 'Creating account...' : 'Signing in...'}</>
                : <>{tab === 'signup' ? 'Create your account' : 'Sign in to CollabDebt'} <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: 'var(--text-dim)' }}>
            {tab === 'signup' ? (
              <>
                By creating an account you agree to our{' '}
                <a href="https://support.collabdebt.com/terms" className="underline hover:text-white">Terms</a>
                {' '}and{' '}
                <a href="https://support.collabdebt.com/privacy" className="underline hover:text-white">Privacy Policy</a>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <button onClick={() => setTab('signup')} className="underline hover:text-white" style={{ color: 'var(--cyan)' }}>Sign up free</button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

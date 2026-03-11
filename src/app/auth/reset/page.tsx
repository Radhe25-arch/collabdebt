'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Eye, EyeOff, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

function ResetContent() {
  const router = useRouter()
  const params = useSearchParams()
  const supabase = createClient()
  const hasToken = params.get('code') !== null

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { toast.error('Enter your email'); return }
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    })
    if (error) { toast.error(error.message) }
    else { setSent(true) }
    setLoading(false)
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { toast.error('Passwords do not match'); return }
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { toast.error(error.message) }
    else {
      toast.success('Password updated! Please sign in.')
      router.push('/auth/login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      <div className="relative w-full max-w-md">
        <div className="rounded-2xl p-8" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <Link href="/auth/login" className="flex items-center gap-1.5 text-sm mb-6"
            style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={14} /> Back to sign in
          </Link>

          {!hasToken && !sent && (
            <>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(0,229,255,0.1)' }}>
                <Mail size={22} style={{ color: 'var(--cyan)' }} />
              </div>
              <h1 className="font-display font-bold text-2xl mb-1">Reset your password</h1>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                Enter your email — we&apos;ll send a reset link.
              </p>
              <form onSubmit={handleRequestReset} className="space-y-4">
                <input value={email} onChange={e => setEmail(e.target.value)}
                  type="email" className="input" placeholder="arjun@acme.com"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                  {loading ? <><Loader2 size={15} className="animate-spin" /> Sending...</> : 'Send reset link'}
                </button>
              </form>
            </>
          )}

          {sent && !hasToken && (
            <div className="text-center py-4">
              <CheckCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--green)' }} />
              <h2 className="font-display font-bold text-xl mb-2">Check your email</h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                We sent a password reset link to <span style={{ color: 'var(--cyan)' }}>{email}</span>.<br />
                The link expires in 1 hour.
              </p>
            </div>
          )}

          {hasToken && (
            <>
              <h1 className="font-display font-bold text-2xl mb-1">Set new password</h1>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Choose a strong password for your account.</p>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>New password</label>
                  <div className="relative">
                    <input value={password} onChange={e => setPassword(e.target.value)}
                      type={showPass ? 'text' : 'password'} className="input pr-10"
                      placeholder="Min 8 characters"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Confirm password</label>
                  <input value={confirm} onChange={e => setConfirm(e.target.value)}
                    type="password" className="input" placeholder="Repeat password"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                  {loading ? <><Loader2 size={15} className="animate-spin" /> Updating...</> : 'Update password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }} />}>
      <ResetContent />
    </Suspense>
  )
}
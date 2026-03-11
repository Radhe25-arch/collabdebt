'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Mail, RefreshCw, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

function VerifyContent() {
  const params = useSearchParams()
  const router = useRouter()
  const supabase = createClient()
  const email = params.get('email') || ''
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  useEffect(() => {
    const interval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email_confirmed_at) {
        router.push('/dashboard')
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [router, supabase])

  const resendEmail = async () => {
    setResending(true)
    const { error } = await supabase.auth.resend({ type: 'signup', email })
    if (error) { toast.error(error.message) }
    else { setResent(true); toast.success('Verification email resent!') }
    setResending(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      <div className="relative w-full max-w-md text-center">
        <div className="rounded-2xl p-10" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)' }}>
            <Mail size={28} style={{ color: 'var(--cyan)' }} />
          </div>

          <h1 className="font-display font-bold text-2xl mb-2">Check your inbox</h1>
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
            We sent a verification link to
          </p>
          <p className="font-mono text-sm mb-8" style={{ color: 'var(--cyan)' }}>{email}</p>

          <div className="space-y-3">
            <a href="https://mail.google.com" target="_blank" rel="noopener"
              className="btn-primary w-full justify-center py-3">
              <Mail size={16} /> Open Gmail
            </a>

            <button onClick={resendEmail} disabled={resending || resent}
              className="btn-ghost w-full justify-center py-2.5 text-sm"
              style={resent ? { color: 'var(--green)', borderColor: 'rgba(0,255,136,0.3)' } : {}}>
              {resending
                ? <><RefreshCw size={14} className="animate-spin" /> Sending...</>
                : resent
                  ? <><CheckCircle size={14} /> Email sent!</>
                  : 'Resend verification email'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
            <Link href="/auth/signup" className="text-sm hover:underline flex items-center justify-center gap-1.5"
              style={{ color: 'var(--text-muted)' }}>
              <ArrowLeft size={13} /> Change email address
            </Link>
          </div>

          <p className="text-xs mt-4" style={{ color: 'var(--text-dim)' }}>
            Checking automatically every 3 seconds...
          </p>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }} />}>
      <VerifyContent />
    </Suspense>
  )
}
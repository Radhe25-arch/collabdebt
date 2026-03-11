'use client'

import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const STEPS = [
  {
    title: 'Welcome to CollabDebt!',
    desc: 'This is your engineering intelligence dashboard. Let\'s take a quick 30-second tour.',
    target: null,
    icon: '👋',
  },
  {
    title: 'Your Debt Overview',
    desc: 'This section shows your real-time debt health score and how much it\'s costing your team each month.',
    target: '.metric-card',
    icon: '📊',
  },
  {
    title: 'Debt Board',
    desc: 'Click "Debt Board" in the sidebar to see all debt items in a Kanban view. Vote, assign, and track fixes.',
    target: null,
    icon: '📋',
  },
  {
    title: 'Code Editor',
    desc: 'Our Monaco-based editor highlights debt directly in your code. AI fix suggestions are just Ctrl+K away.',
    target: null,
    icon: '💻',
  },
  {
    title: 'Connect a Repo',
    desc: 'Go to Repositories and connect your GitHub repo. First scan happens automatically in under 30 seconds.',
    target: null,
    icon: '🔗',
  },
  {
    title: 'You\'re all set!',
    desc: 'Start by connecting a repository. Your first debt report will be ready in under a minute.',
    target: null,
    icon: '🚀',
  },
]

interface OnboardingGuideProps {
  onComplete: () => void
}

export default function OnboardingGuide({ onComplete }: OnboardingGuideProps) {
  const [step, setStep] = useState(0)
  const supabase = createClient()

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const finish = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('users').update({ onboarding_done: true }).eq('id', user.id)
    }
    onComplete()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(5,10,15,0.85)', backdropFilter: 'blur(4px)' }}>

      <div className="w-full max-w-md animate-fadeInUp"
        style={{ background: 'var(--card)', border: '1px solid var(--border-bright)', borderRadius: '20px', overflow: 'hidden' }}>

        {/* Top accent */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #00e5ff, #7c3aed)' }} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{current.icon}</div>
              <div>
                <div className="text-xs font-mono mb-0.5" style={{ color: 'var(--cyan)' }}>
                  Step {step + 1} of {STEPS.length}
                </div>
                <h3 className="font-display font-bold text-lg">{current.title}</h3>
              </div>
            </div>
            <button onClick={finish} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 rounded-full mb-5" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: 'var(--cyan)' }} />
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
            {current.desc}
          </p>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="btn-ghost text-sm py-2 px-4 disabled:opacity-30">
              <ChevronLeft size={15} /> Back
            </button>

            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full transition-all"
                  style={{ background: i === step ? 'var(--cyan)' : 'var(--border)' }} />
              ))}
            </div>

            {isLast ? (
              <button onClick={finish} className="btn-primary text-sm py-2 px-4">
                <Zap size={15} /> Get started
              </button>
            ) : (
              <button onClick={() => setStep(s => s + 1)} className="btn-primary text-sm py-2 px-4">
                Next <ChevronRight size={15} />
              </button>
            )}
          </div>

          {/* Skip link */}
          <div className="text-center mt-4">
            <button onClick={finish} className="text-xs hover:underline" style={{ color: 'var(--text-dim)' }}>
              Skip tour
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

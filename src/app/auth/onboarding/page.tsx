'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  ChevronRight, 
  Loader2, 
  Zap, 
  Shield, 
  Users, 
  Terminal, 
  GitBranch, 
  Cpu, 
  ArrowRight,
  Sparkles,
  Search,
  Layout,
  Globe
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store/useStore'
import toast from 'react-hot-toast'
import Link from 'next/link'

const ROLES = [
  'Frontend Developer', 'Backend Developer', 'Fullstack Developer',
  'Mobile Developer', 'DevOps / SRE', 'Data Engineer',
  'ML / AI Engineer', 'Security Engineer', 'QA Engineer',
  'Engineering Manager', 'Architect', 'Product Engineer',
]

const LANGUAGES = [
  'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java',
  'C#', 'C/C++', 'Ruby', 'PHP', 'Swift', 'Kotlin',
]

const GOALS = [
  { id: 'fix_debt', label: 'Resolve Tech Debt', desc: 'Prioritize and fix existing codebase issues' },
  { id: 'health', label: 'Monitor Health', desc: 'Track repository health and velocity metrics' },
  { id: 'team', label: 'Team Velocity', desc: 'Improve ship speed across the organization' },
  { id: 'scan', label: 'Automated Scanning', desc: 'Neural scans for proactive issue detection' },
]

const TEAM_SIZES = ['Solo', '2-10 devs', '11-50 devs', '51-200 devs', '200+ devs']

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7

export default function OnboardingPage() {
  const supabase = createClient()
  const { user, setUser } = useStore()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [scanStatus, setScanStatus] = useState(0)

  const [formData, setFormData] = useState({
    name: '',
    role: [] as string[],
    stack: [] as string[],
    goals: [] as string[],
    teamSize: '',
    repoUrl: '',
    bio: '',
  })

  // Simulated Neural Scan
  useEffect(() => {
    if (step === 6) {
      const interval = setInterval(() => {
        setScanStatus(s => {
          if (s >= 100) {
            clearInterval(interval)
            return 100
          }
          return s + 2
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [step])

  const toggleMulti = (key: 'role' | 'stack' | 'goals', val: string) => {
    setFormData(s => ({
      ...s,
      [key]: s[key].includes(val) ? s[key].filter(v => v !== val) : [...s[key], val]
    }))
  }

  const handleNext = () => {
    if (step < 7) setStep((s) => (s + 1) as Step)
    else handleFinish()
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser()
      if (!supabaseUser) {
        toast.error('Session expired. Please sign in again.')
        return
      }

      const payload = {
        id: supabaseUser.id,
        name: formData.name || supabaseUser.user_metadata?.name,
        tech_roles: formData.role,
        skills: formData.stack,
        collab_goals: formData.goals,
        team_size: formData.teamSize,
        bio: formData.bio,
        onboarding_done: true,
        last_seen: new Date().toISOString(),
      }

      const { error } = await supabase.from('users').upsert(payload)
      if (error) throw error

      setUser({ ...supabaseUser, ...payload } as any)
      window.location.href = '/dashboard'
    } catch (err: any) {
      toast.error(err.message || 'Failed to finish onboarding')
    } finally {
      setLoading(false)
    }
  }

  const StepWrapper = ({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-2xl px-6"
    >
      <div className="mb-10">
        <h2 className="text-3xl font-black tracking-tight text-white mb-3">{title}</h2>
        <p className="text-zinc-500 font-medium">{subtitle}</p>
      </div>
      {children}
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Premium Background */}
      <div className="mesh-bg">
        <div className="mesh-blob blob-1" />
        <div className="mesh-blob blob-2 opacity-5" />
      </div>
      <div className="noise-overlay" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">CollabDebt</span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= step ? 'w-8 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'w-2 bg-zinc-800'
              }`} 
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <StepWrapper key="1" title="Welcome to the workspace." subtitle="Let's start by getting your name.">
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData(s => ({ ...s, name: e.target.value }))}
              placeholder="e.g. Satoshi Nakamoto"
              className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-indigo-500/50 rounded-2xl p-6 text-xl font-bold outline-none transition-all placeholder:text-zinc-700"
              autoFocus
            />
          </StepWrapper>
        )}

        {step === 2 && (
          <StepWrapper key="2" title="Define your role." subtitle="Select one or more professional titles.">
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map(role => {
                const active = formData.role.includes(role)
                return (
                  <button
                    key={role}
                    onClick={() => toggleMulti('role', role)}
                    className={`p-4 rounded-xl text-sm font-bold border transition-all text-left ${
                      active ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                    }`}
                  >
                    {role}
                  </button>
                )
              })}
            </div>
          </StepWrapper>
        )}

        {step === 3 && (
          <StepWrapper key="3" title="Your tech stack." subtitle="Choose your primary development languages.">
            <div className="flex flex-wrap gap-3">
              {LANGUAGES.map(lang => {
                const active = formData.stack.includes(lang)
                return (
                  <button
                    key={lang}
                    onClick={() => toggleMulti('stack', lang)}
                    className={`px-6 py-3 rounded-full text-sm font-bold border transition-all ${
                      active ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                    }`}
                  >
                    {lang}
                  </button>
                )
              })}
            </div>
          </StepWrapper>
        )}

        {step === 4 && (
          <StepWrapper key="4" title="Strategic goals." subtitle="What do you want to accomplish first?">
            <div className="space-y-3">
              {GOALS.map(goal => {
                const active = formData.goals.includes(goal.id)
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleMulti('goals', goal.id)}
                    className={`w-full p-6 rounded-2xl border transition-all text-left flex items-center gap-4 ${
                      active ? 'bg-indigo-500/10 border-indigo-500 shadow-lg' : 'bg-zinc-900/40 border-zinc-800'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center ${active ? 'bg-indigo-500 border-indigo-400' : 'border-zinc-700'}`}>
                      {active && <Check size={14} className="text-white" />}
                    </div>
                    <div>
                      <div className={`font-bold ${active ? 'text-white' : 'text-zinc-300'}`}>{goal.label}</div>
                      <div className="text-xs text-zinc-500 font-medium">{goal.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </StepWrapper>
        )}

        {step === 5 && (
          <StepWrapper key="5" title="Direct repository uplink." subtitle="Connect your first repository for a health scan.">
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input 
                  type="text" 
                  value={formData.repoUrl}
                  onChange={(e) => setFormData(s => ({ ...s, repoUrl: e.target.value }))}
                  placeholder="https://github.com/org/repo"
                  className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-indigo-500/50 rounded-2xl py-4 pl-12 pr-4 text-white font-mono text-sm outline-none transition-all placeholder:text-zinc-700"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {TEAM_SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => setFormData(s => ({ ...s, teamSize: size }))}
                    className={`py-3 rounded-xl text-xs font-black border transition-all ${
                      formData.teamSize === size ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </StepWrapper>
        )}

        {step === 6 && (
          <StepWrapper key="6" title="Neural Scan in progress..." subtitle="Quantifying tech debt and architectural inconsistencies.">
            <div className="space-y-12 py-10">
              <div className="flex justify-between items-end mb-2">
                <div className="text-4xl font-black text-indigo-400">{scanStatus}%</div>
                <div className="text-xs font-mono text-zinc-600 uppercase tracking-widest">Deep Analysis Initialized</div>
              </div>
              <div className="h-4 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${scanStatus}%` }}
                  className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Complexity Index', value: 'High' },
                  { label: 'Deprecated APIs', value: '14' },
                  { label: 'N+1 Patterns', value: 'Active' },
                  { label: 'Security Holes', value: '2' },
                ].map((stat, i) => (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: scanStatus > (i * 25) ? 1 : 0 }}
                    key={stat.label} 
                    className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4"
                  >
                    <div className="text-[10px] uppercase tracking-tighter text-zinc-600 mb-1">{stat.label}</div>
                    <div className="font-bold text-zinc-300">{stat.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </StepWrapper>
        )}

        {step === 7 && (
          <StepWrapper key="7" title="All set for launch." subtitle="Your workspace is primed and ready.">
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-[32px] p-10 text-center relative overflow-hidden">
               <div className="relative z-10">
                 <div className="w-20 h-20 bg-indigo-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl mb-8 -rotate-6">
                   <Shield size={40} className="text-white" />
                 </div>
                 <h4 className="text-2xl font-black mb-4">PROFILE SYNCED</h4>
                 <p className="text-zinc-500 font-medium mb-8">Redirecting to CollabDebt Dashboard in a moment.</p>
               </div>
               <Sparkles className="absolute top-4 right-4 text-indigo-500/20" size={100} />
            </div>
          </StepWrapper>
        )}
      </AnimatePresence>

      {/* Footer Navigation */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-between border-t border-white/5 bg-black/20 backdrop-blur-xl">
        <button 
          onClick={() => setStep(s => Math.max(1, s - 1) as Step)}
          disabled={step === 1}
          className="text-sm font-bold text-zinc-500 hover:text-white disabled:opacity-0 transition-all px-4 py-2"
        >
          Back
        </button>
        <button 
          onClick={handleNext}
          disabled={(step === 1 && !formData.name) || (step === 6 && scanStatus < 100) || loading}
          className="bg-white text-black px-10 py-3 rounded-full font-black text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:scale-100"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              {step < 7 ? 'Continue' : 'Launch Dashboard'}
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

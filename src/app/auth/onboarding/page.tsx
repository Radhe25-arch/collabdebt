'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Check, Loader2, Crown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import Link from 'next/link'

// ── Tech categories ────────────────────────────────────────────────────────
const TECH_ROLES = [
  { id: 'frontend', label: 'Frontend Developer', icon: '🖥️', desc: 'React, Vue, Angular, CSS' },
  { id: 'backend', label: 'Backend Developer', icon: '⚙️', desc: 'Node, Python, Go, Java' },
  { id: 'fullstack', label: 'Full-Stack Developer', icon: '🔧', desc: 'End-to-end product builder' },
  { id: 'mobile', label: 'Mobile Developer', icon: '📱', desc: 'iOS, Android, React Native' },
  { id: 'devops', label: 'DevOps / SRE', icon: '☁️', desc: 'CI/CD, Kubernetes, Cloud infra' },
  { id: 'data_engineer', label: 'Data Engineer', icon: '🗄️', desc: 'Pipelines, Spark, dbt' },
  { id: 'ml_engineer', label: 'ML / AI Engineer', icon: '🤖', desc: 'Models, training, inference' },
  { id: 'data_scientist', label: 'Data Scientist', icon: '📊', desc: 'Analysis, stats, notebooks' },
  { id: 'security', label: 'Security Engineer', icon: '🔒', desc: 'Pen testing, AppSec, SIEM' },
  { id: 'qa', label: 'QA / Test Engineer', icon: '🧪', desc: 'Automation, quality assurance' },
  { id: 'architect', label: 'Software Architect', icon: '🏗️', desc: 'System design, tech strategy' },
  { id: 'manager', label: 'Engineering Manager', icon: '👥', desc: 'Team leadership, roadmaps' },
  { id: 'product', label: 'Product Manager', icon: '🎯', desc: 'Vision, roadmap, stakeholders' },
  { id: 'designer', label: 'UI/UX Designer', icon: '🎨', desc: 'Figma, design systems' },
  { id: 'blockchain', label: 'Blockchain Developer', icon: '⛓️', desc: 'Smart contracts, Web3, DeFi' },
  { id: 'embedded', label: 'Embedded / IoT', icon: '🔌', desc: 'Firmware, hardware, C/C++' },
]

const EXPERIENCE_LEVELS = [
  { id: 'student', label: 'Student', desc: '0–1 years' },
  { id: 'junior', label: 'Junior', desc: '1–3 years' },
  { id: 'mid', label: 'Mid-level', desc: '3–6 years' },
  { id: 'senior', label: 'Senior', desc: '6–10 years' },
  { id: 'staff', label: 'Staff / Principal', desc: '10+ years' },
  { id: 'founder', label: 'Founder / CTO', desc: 'Building something' },
]

const TOP_SKILLS = [
  'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'C#', 'C++',
  'React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'Node.js', 'Django', 'FastAPI',
  'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST', 'gRPC',
  'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform',
  'React Native', 'Flutter', 'Swift', 'Kotlin',
  'PyTorch', 'TensorFlow', 'LangChain', 'OpenAI',
  'Git', 'Linux', 'Figma', 'Agile / Scrum',
]

const COLLAB_GOALS = [
  { id: 'fix_debt', label: 'Fix tech debt on my project' },
  { id: 'find_collab', label: 'Find collaborators for a side project' },
  { id: 'hire', label: 'Hire / build a team' },
  { id: 'freelance', label: 'Find freelance work' },
  { id: 'opensource', label: 'Contribute to open source' },
  { id: 'learn', label: 'Learn from others' },
  { id: 'mentor', label: 'Mentor others' },
]

const STEPS = ['Role', 'Experience', 'Skills', 'Goals', 'Plan']

// Premium plans — "Connect" feature is premium
const CONNECT_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    perMonth: '/forever',
    features: ['1 repo', '50 debt items', '2 AI hrs/mo', 'Debt board & sprints'],
    connect: false,
    cta: 'Start free',
    color: 'var(--border)',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹499',
    perMonth: '/month',
    features: ['5 repos', '500 debt items', '10 AI hrs/mo', 'CollabConnect™ — find devs', 'Private collab sessions', 'Priority support'],
    connect: true,
    cta: 'Upgrade to Pro',
    color: 'var(--cyan)',
    popular: true,
  },
  {
    id: 'team',
    name: 'Team',
    price: '₹1,499',
    perMonth: '/month',
    features: ['Unlimited repos', '25 members', 'CollabConnect™ + filters', 'Team collab sessions', 'Manager dashboard', 'Analytics'],
    connect: true,
    cta: 'Upgrade to Team',
    color: '#a855f7',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  // Form state
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [experience, setExperience] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [goals, setGoals] = useState<string[]>([])
  const [chosenPlan, setChosenPlan] = useState('free')

  const toggleMulti = (val: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(val) ? list.filter(x => x !== val) : [...list, val])
  }

  const canNext = () => {
    if (step === 0) return selectedRoles.length > 0
    if (step === 1) return experience !== ''
    if (step === 2) return selectedSkills.length >= 1
    if (step === 3) return goals.length > 0
    return true
  }

  const handleFinish = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      // Save tech profile to users table
      await supabase.from('users').update({
        tech_roles: selectedRoles,
        experience_level: experience,
        skills: selectedSkills,
        collab_goals: goals,
        plan: chosenPlan,
        onboarding_done: true,
      }).eq('id', user.id)

      // If paid plan — go to billing
      if (chosenPlan !== 'free') {
        router.push(`/dashboard/billing?upgrade=${chosenPlan}`)
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong, please try again')
    } finally {
      setSaving(false)
    }
  }

  const chipStyle = (active: boolean, color = 'var(--cyan)') => ({
    background: active ? `${color}18` : 'var(--surface)',
    border: `1px solid ${active ? color : 'var(--border)'}`,
    color: active ? color : 'var(--text-muted)',
    cursor: 'pointer',
    borderRadius: '10px',
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: active ? 600 : 400,
    transition: 'all 0.15s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  })

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: 'var(--bg)' }}>

      {/* Grid bg */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,229,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.025) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

      <div className="relative w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm"
              style={{ background: 'var(--cyan)', color: 'var(--bg)' }}>CD</div>
            <span className="font-display font-bold text-xl">CollabDebt</span>
          </Link>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all"
                  style={i < step
                    ? { background: 'var(--green)', color: '#000' }
                    : i === step
                      ? { background: 'var(--cyan)', color: '#000' }
                      : { background: 'var(--surface)', color: 'var(--text-dim)', border: '1px solid var(--border)' }}>
                  {i < step ? <Check size={11} /> : i + 1}
                </div>
                <span className="text-xs hidden sm:block"
                  style={{ color: i === step ? 'var(--text)' : 'var(--text-dim)' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-8 h-px" style={{ background: i < step ? 'var(--green)' : 'var(--border)' }} />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>

          {/* ─── Step 0: Roles ──────────────────────────────────────── */}
          {step === 0 && (
            <div>
              <h2 className="font-display font-bold text-2xl mb-1">What do you do?</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                Select all that apply — you can pick multiple roles.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TECH_ROLES.map(role => {
                  const active = selectedRoles.includes(role.id)
                  return (
                    <button key={role.id}
                      onClick={() => toggleMulti(role.id, selectedRoles, setSelectedRoles)}
                      className="flex flex-col items-start p-4 rounded-xl text-left transition-all"
                      style={{
                        background: active ? 'rgba(0,229,255,0.07)' : 'var(--surface)',
                        border: `1px solid ${active ? 'var(--cyan)' : 'var(--border)'}`,
                      }}>
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <span className="text-xl">{role.icon}</span>
                        {active && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: 'var(--cyan)' }}>
                            <Check size={11} color="#000" />
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-semibold" style={{ color: active ? 'var(--cyan)' : 'var(--text)' }}>
                        {role.label}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>{role.desc}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ─── Step 1: Experience ─────────────────────────────────── */}
          {step === 1 && (
            <div>
              <h2 className="font-display font-bold text-2xl mb-1">How experienced are you?</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>This helps match you with the right collaborators.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {EXPERIENCE_LEVELS.map(level => {
                  const active = experience === level.id
                  return (
                    <button key={level.id}
                      onClick={() => setExperience(level.id)}
                      className="flex flex-col items-start p-4 rounded-xl text-left transition-all"
                      style={{
                        background: active ? 'rgba(0,229,255,0.07)' : 'var(--surface)',
                        border: `1px solid ${active ? 'var(--cyan)' : 'var(--border)'}`,
                      }}>
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-sm font-bold" style={{ color: active ? 'var(--cyan)' : 'var(--text)' }}>
                          {level.label}
                        </span>
                        {active && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: 'var(--cyan)' }}>
                            <Check size={11} color="#000" />
                          </div>
                        )}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-dim)' }}>{level.desc}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ─── Step 2: Skills ─────────────────────────────────────── */}
          {step === 2 && (
            <div>
              <h2 className="font-display font-bold text-2xl mb-1">What&apos;s in your stack?</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                Pick your top skills (select as many as you like).
                <span className="ml-2 font-mono text-xs" style={{ color: 'var(--cyan)' }}>
                  {selectedSkills.length} selected
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {TOP_SKILLS.map(skill => {
                  const active = selectedSkills.includes(skill)
                  return (
                    <button key={skill}
                      onClick={() => toggleMulti(skill, selectedSkills, setSelectedSkills)}
                      style={chipStyle(active)}>
                      {active && <Check size={11} />}
                      {skill}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ─── Step 3: Goals ──────────────────────────────────────── */}
          {step === 3 && (
            <div>
              <h2 className="font-display font-bold text-2xl mb-1">What brings you here?</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Select all that apply.</p>
              <div className="space-y-2.5">
                {COLLAB_GOALS.map(goal => {
                  const active = goals.includes(goal.id)
                  return (
                    <button key={goal.id}
                      onClick={() => toggleMulti(goal.id, goals, setGoals)}
                      className="w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all"
                      style={{
                        background: active ? 'rgba(0,229,255,0.07)' : 'var(--surface)',
                        border: `1px solid ${active ? 'var(--cyan)' : 'var(--border)'}`,
                      }}>
                      <div className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                        style={{ background: active ? 'var(--cyan)' : 'var(--border)', transition: 'all 0.15s' }}>
                        {active && <Check size={11} color="#000" />}
                      </div>
                      <span className="text-sm font-medium" style={{ color: active ? 'var(--text)' : 'var(--text-muted)' }}>
                        {goal.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ─── Step 4: Plan — CollabConnect is premium ────────────── */}
          {step === 4 && (
            <div>
              <h2 className="font-display font-bold text-2xl mb-1">Choose your plan</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>CollabConnect™</span> — find & work with devs — is a paid feature.
                You can always upgrade later.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {CONNECT_PLANS.map(plan => {
                  const active = chosenPlan === plan.id
                  return (
                    <button key={plan.id}
                      onClick={() => setChosenPlan(plan.id)}
                      className="flex flex-col text-left p-5 rounded-xl transition-all relative"
                      style={{
                        background: active ? `${plan.color}10` : 'var(--surface)',
                        border: `1.5px solid ${active ? plan.color : 'var(--border)'}`,
                      }}>
                      {plan.popular && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: plan.color, color: '#000' }}>
                          POPULAR
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-bold text-base" style={{ color: active ? plan.color : 'var(--text)' }}>
                            {plan.name}
                          </div>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="font-display text-xl font-bold">{plan.price}</span>
                            <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{plan.perMonth}</span>
                          </div>
                        </div>
                        <div className="w-5 h-5 rounded-full flex items-center justify-center mt-1"
                          style={{ background: active ? plan.color : 'var(--border)', transition: 'all 0.15s' }}>
                          {active && <Check size={11} color="#000" />}
                        </div>
                      </div>

                      {plan.connect && (
                        <div className="flex items-center gap-1.5 mb-3 px-2 py-1 rounded-lg"
                          style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)' }}>
                          <Crown size={11} style={{ color: 'var(--cyan)' }} />
                          <span className="text-[10px] font-bold" style={{ color: 'var(--cyan)' }}>CollabConnect™ included</span>
                        </div>
                      )}

                      <ul className="space-y-1.5">
                        {plan.features.map(f => (
                          <li key={f} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                            <Check size={10} className="shrink-0 mt-0.5" style={{ color: plan.connect ? 'var(--cyan)' : 'var(--green)' }} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => step > 0 ? setStep(s => s - 1) : router.push('/dashboard')}
              className="btn-ghost text-sm py-2 px-4 flex items-center gap-2">
              <ArrowLeft size={14} />
              {step === 0 ? 'Skip for now' : 'Back'}
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                className="btn-primary text-sm py-2.5 px-6 flex items-center gap-2"
                style={!canNext() ? { opacity: 0.5, cursor: 'not-allowed' } : {}}>
                Continue <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={saving}
                className="btn-primary text-sm py-2.5 px-6 flex items-center gap-2">
                {saving
                  ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
                  : <>{chosenPlan === 'free' ? 'Go to dashboard' : 'Continue to payment'} <ArrowRight size={14} /></>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

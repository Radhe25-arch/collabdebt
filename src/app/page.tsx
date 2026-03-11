'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Github, Zap, BarChart3, Users, GitBranch, Bot, Shield,
  ChevronRight, Play, Check, Star, ArrowRight, Menu, X,
  TrendingDown, AlertTriangle, Clock, DollarSign
} from 'lucide-react'

// ── Matrix Rain Canvas ───────────────────────────────────────────────────────
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const cols = Math.floor(canvas.width / 20)
    const drops = Array(cols).fill(1)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?'
    const draw = () => {
      ctx.fillStyle = 'rgba(5, 10, 15, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#00e5ff'
      ctx.font = '14px JetBrains Mono, monospace'
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * 20, y * 20)
        if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      })
    }
    const interval = setInterval(draw, 50)
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)
    return () => { clearInterval(interval); window.removeEventListener('resize', handleResize) }
  }, [])
  return <canvas ref={canvasRef} className="matrix-canvas" />
}

// ── Terminal Animation ───────────────────────────────────────────────────────
const TERMINAL_LINES = [
  { text: '$ collabdebt scan --repo acme/api-server', type: 'prompt', delay: 0 },
  { text: 'Connecting to GitHub...', type: 'info', delay: 800 },
  { text: '✓ Repository cloned (2.4s)', type: 'output', delay: 1400 },
  { text: 'Running tree-sitter AST parse...', type: 'info', delay: 2000 },
  { text: 'Running semgrep pattern matching...', type: 'info', delay: 2800 },
  { text: '⚠ CRITICAL: Token race condition — src/auth/token.ts:47', type: 'error', delay: 3600 },
  { text: '⚠ HIGH: N+1 query detected — src/api/users/dashboard.ts:123', type: 'error', delay: 4200 },
  { text: '! MEDIUM: Deprecated react-query v3 usage', type: 'info', delay: 4800 },
  { text: 'Sending findings to Claude AI...', type: 'info', delay: 5400 },
  { text: '✓ AI explanations generated', type: 'output', delay: 6000 },
  { text: '─────────────────────────────────────────', type: 'info', delay: 6400 },
  { text: '  Total debt cost: $4,200/month', type: 'error', delay: 6800 },
  { text: '  Items found: 7  |  Critical: 2  |  High: 3', type: 'info', delay: 7200 },
  { text: '✓ Dashboard updated. PR comment posted.', type: 'output', delay: 7800 },
]

function TerminalHero() {
  const [visibleLines, setVisibleLines] = useState(0)
  useEffect(() => {
    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    })
  }, [])
  const getClass = (type: string) => {
    if (type === 'prompt') return 'text-[#00e5ff]'
    if (type === 'output') return 'text-green-400'
    if (type === 'error') return 'text-[#ff3b5c]'
    return 'text-[#6b8fa8]'
  }
  return (
    <div className="terminal max-w-2xl w-full mx-auto">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a3040]">
        <div className="w-3 h-3 rounded-full bg-[#ff3b5c]" />
        <div className="w-3 h-3 rounded-full bg-[#ffd600]" />
        <div className="w-3 h-3 rounded-full bg-[#00ff88]" />
        <span className="ml-2 text-[#3d6070] text-xs">collabdebt — scan</span>
      </div>
      <div className="space-y-1 min-h-48">
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={`terminal-line animate-fadeIn ${getClass(line.type)}`}>
            <span>{line.text}</span>
          </div>
        ))}
        {visibleLines < TERMINAL_LINES.length && (
          <span className="animate-cursor text-[#00e5ff]">▊</span>
        )}
      </div>
    </div>
  )
}

// ── Stat Counter ─────────────────────────────────────────────────────────────
function StatCounter({ end, label, prefix = '', suffix = '' }: { end: number; label: string; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const step = end / 60
    const timer = setInterval(() => {
      setCount(c => { const next = c + step; return next >= end ? end : next })
    }, 20)
    return () => clearInterval(timer)
  }, [end])
  return (
    <div className="text-center">
      <div className="text-3xl font-bold font-display text-[#00e5ff]">
        {prefix}{Math.floor(count).toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-[#6b8fa8] mt-1">{label}</div>
    </div>
  )
}

// ── Pricing Data ─────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'free', name: 'Free', monthly: 0, yearly: 0,
    features: ['1 repository', '3 team members', '50 debt items', 'Basic code editor', 'GitHub integration', 'Email alerts'],
    cta: 'Get started free',
  },
  {
    id: 'pro', name: 'Pro', monthly: 19, yearly: 159,
    popular: true,
    features: ['Unlimited repos', '10 team members', 'Unlimited debt items', 'AI assistant (2hr/day)', 'Full Monaco editor', 'PR comments', 'Advanced analytics'],
    cta: 'Upgrade to Pro',
  },
  {
    id: 'team', name: 'Team', monthly: 49, yearly: 399,
    features: ['Everything in Pro', '25 team members', 'Collab sessions', 'Manager dashboard', 'Employee tracking', 'AI sprint balancer', 'Priority support'],
    cta: 'Upgrade to Team',
  },
  {
    id: 'enterprise', name: 'Enterprise', monthly: 99, yearly: 799,
    features: ['Everything in Team', 'Unlimited members', 'Silent inspect mode', 'SSO / SAML', 'AI assistant unlimited', 'Dedicated support', 'Custom integrations'],
    cta: 'Contact Sales',
  },
]

const FEATURES = [
  { icon: Zap, title: 'Auto Debt Scanner', desc: 'Scans every push. Finds TODOs, dead code, complexity hotspots, deprecated libraries — zero config.', color: '#00e5ff' },
  { icon: DollarSign, title: 'Business Impact Score', desc: 'Every debt item gets a $/month cost. Managers finally understand. Budgets get approved.', color: '#00ff88' },
  { icon: Users, title: 'Team Voting', desc: 'Team upvotes the debt that matters most. Democratic prioritization with real signal.', color: '#ffd600' },
  { icon: BarChart3, title: 'Manager Dashboard', desc: 'Live heatmaps, productivity scores, AI ROI reports. Built for engineering managers.', color: '#7c3aed' },
  { icon: GitBranch, title: 'PR Integration', desc: 'Automatic PR comments showing debt added vs fixed, with cost impact. Works on every merge.', color: '#ff3b5c' },
  { icon: Bot, title: 'AI Coding Assistant', desc: 'Inline fix suggestions, refactor assistance, and sprint recommendations powered by Claude.', color: '#00e5ff' },
]

// ── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  const [yearly, setYearly] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <div className="relative overflow-x-hidden" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl border-b border-[#1a3040]' : ''}`}
        style={{ background: scrolled ? 'rgba(5,10,15,0.95)' : 'transparent' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm"
              style={{ background: 'var(--cyan)', color: 'var(--bg)' }}>CD</div>
            <span className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>CollabDebt</span>
            <span className="badge-cyan text-[10px] px-1.5 py-0.5">BETA</span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            {['Features', 'How it works', 'Pricing'].map(item => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase().replace(' ', '-'))}
                className="hover:text-white transition-colors cursor-pointer">
                {item}
              </button>
            ))}
            <a href="https://support.collabdebt.com" target="_blank" rel="noopener" className="hover:text-white transition-colors">Docs</a>
          </div>

          {/* Right: status + CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--green)' }}>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              All systems operational
            </div>
            <Link href="/auth/login" className="btn-ghost text-sm py-2 px-4">Sign in</Link>
            <Link href="/auth/signup" className="btn-primary text-sm py-2 px-4">Start free</Link>
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2" style={{ color: 'var(--text-muted)' }} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#1a3040] p-4 space-y-3" style={{ background: 'var(--surface)' }}>
            {['Features', 'How it works', 'Pricing', 'Docs'].map(item => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase().replace(' ', '-'))}
                className="block w-full text-left py-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                {item}
              </button>
            ))}
            <div className="flex gap-3 pt-2">
              <Link href="/auth/login" className="btn-ghost text-sm flex-1 justify-center">Sign in</Link>
              <Link href="/auth/signup" className="btn-primary text-sm flex-1 justify-center">Start free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-6 scanlines overflow-hidden">
        <MatrixRain />
        {/* Radial gradient */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(0,229,255,0.06) 0%, transparent 70%), radial-gradient(ellipse 60% 60% at 80% 80%, rgba(124,58,237,0.06) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-5xl w-full text-center space-y-8">
          {/* Terminal */}
          <div className="animate-fadeInUp">
            <TerminalHero />
          </div>

          {/* Badge */}
          <div className="animate-fadeInUp delay-200 flex justify-center">
            <span className="badge-cyan text-sm px-4 py-1.5">
              Public beta — free for teams under 5
            </span>
          </div>

          {/* Headline */}
          <div className="animate-fadeInUp delay-300 space-y-4">
            <h1 className="font-display font-bold leading-tight" style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}>
              Technical debt is{' '}
              <span style={{ color: 'var(--red)' }}>silently killing</span>
              <br />your team
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              CollabDebt detects, quantifies, and helps your team fix technical debt — in real time.
              AI-powered. Business-aware. Built for engineering teams.
            </p>
          </div>

          {/* CTAs */}
          <div className="animate-fadeInUp delay-400 flex flex-wrap items-center justify-center gap-4">
            <Link href="/auth/signup" className="btn-primary text-base px-8 py-3">
              Explore CollabDebt <ArrowRight size={18} />
            </Link>
            <button onClick={() => {}} className="btn-ghost text-base px-8 py-3">
              <Play size={16} /> Watch 2-min demo
            </button>
          </div>

          {/* Stats */}
          <div className="animate-fadeInUp delay-500 grid grid-cols-3 gap-8 max-w-lg mx-auto pt-4">
            <StatCounter end={24800} label="debt items tracked" suffix="+" />
            <StatCounter end={43} label="velocity increase" suffix="%" />
            <StatCounter end={512} label="engineering teams" suffix="+" />
          </div>
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────── */}
      <div className="border-y py-3 overflow-hidden" style={{ borderColor: 'var(--border)', background: 'rgba(0,229,255,0.02)' }}>
        <div className="flex gap-8 animate-ticker whitespace-nowrap">
          {[...Array(2)].map((_, repeat) =>
            ['GITHUB', 'GITLAB', 'BITBUCKET', 'RAZORPAY', 'JIRA', 'SLACK', 'LINEAR', 'CLAUDE AI', 'SUPABASE', 'VERCEL'].map((item, i) => (
              <span key={`${repeat}-${i}`} className="flex items-center gap-4 text-xs font-mono font-semibold tracking-widest" style={{ color: 'var(--text-dim)' }}>
                <span style={{ color: 'var(--cyan)' }}>·</span> {item}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── PROBLEM ─────────────────────────────────────────────── */}
      <section id="problem" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-cyan mb-4 inline-block">The Problem</span>
            <h2 className="font-display text-4xl font-bold">The $1.52 trillion problem<br />nobody is solving right</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { color: 'var(--red)', icon: Clock, title: 'Features take 3x longer', cost: '+180 hrs/month', desc: 'Every new feature drags through layers of undocumented shortcuts and legacy hacks.' },
              { color: 'var(--yellow)', icon: AlertTriangle, title: 'Managers don\'t get it', cost: '0 alignment', desc: 'Developers speak in code complexity. Managers speak in dollars. Nobody translates.' },
              { color: '#7c3aed', icon: BarChart3, title: 'Jira isn\'t built for this', cost: '200+ orphaned tickets', desc: 'Debt tickets get created, deprioritized, forgotten. Jira has no debt-specific workflow.' },
              { color: 'var(--cyan)', icon: TrendingDown, title: 'Velocity dies silently', cost: '$12K+ annual', desc: 'Teams slow down gradually. Nobody notices until it\'s a crisis. No visibility, no action.' },
            ].map((card, i) => (
              <div key={i} className="card group hover:scale-[1.01] transition-transform" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg mt-0.5" style={{ background: `${card.color}15`, border: `1px solid ${card.color}30` }}>
                    <card.icon size={20} style={{ color: card.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold">{card.title}</h3>
                      <span className="font-mono text-xs px-2 py-1 rounded shrink-0" style={{ background: `${card.color}15`, color: card.color }}>
                        {card.cost}
                      </span>
                    </div>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{card.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Code snippet */}
          <div className="terminal max-w-2xl mx-auto">
            <div className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>src/auth/auth.service.ts</div>
            <pre className="text-xs leading-relaxed overflow-x-auto" style={{ color: '#e2f0f9' }}>{
`async function refreshToken(userId: string) {
  // TODO: handle race condition when multiple tabs
  // refresh simultaneously — this causes logout
  const token = await db.tokens.findOne({ userId })
  
  // FIXME: this doesn't handle expired refresh tokens
  // properly, users get logged out randomly
  if (!token) return null
  
  // HACK: sleep 100ms to avoid duplicate refresh calls
  // This is terrible, but it works... sometimes
  await sleep(100)
  return generateNewToken(token)
}`}</pre>
            <div className="mt-3 pt-3 border-t border-[#1a3040] flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="text-[#ff3b5c]">⚠ 3 debt items detected</span>
              <span>Est. cost: <span className="text-[#ffd600]">$4,200/month</span></span>
              <span>Added: <span>847 days ago</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6" style={{ background: 'var(--surface)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-cyan mb-4 inline-block">Features</span>
            <h2 className="font-display text-4xl font-bold">14 features no competitor<br />has combined</h2>
          </div>

          {/* Live debt board preview */}
          <div className="card mb-16 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-sm">Live Debt Board — api-server</span>
              <span className="badge-critical">7 open items</span>
            </div>
            <div className="grid gap-3">
              {[
                { severity: 'critical', file: 'src/auth/token.ts:47', title: 'Token expiry race condition', votes: 14, cost: '$4,200' },
                { severity: 'high', file: 'src/api/users/dashboard.ts:123', title: 'N+1 query in user dashboard', votes: 9, cost: '$1,800' },
                { severity: 'medium', file: 'src/hooks/useUserData.ts:1', title: 'Deprecated react-query v3 usage', votes: 5, cost: '$600' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                  <span className={item.severity === 'critical' ? 'badge-critical' : item.severity === 'high' ? 'badge-high' : 'badge-medium'}>
                    {item.severity.toUpperCase()}
                  </span>
                  <span className="font-mono text-xs flex-1 truncate" style={{ color: 'var(--text-muted)' }}>{item.file}</span>
                  <span className="text-sm flex-1 hidden md:block">{item.title}</span>
                  <span className="font-mono text-xs" style={{ color: 'var(--yellow)' }}>{item.cost}/mo</span>
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>▲ {item.votes}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => (
              <div key={i} className="card group cursor-pointer overflow-hidden relative"
                style={{ animationDelay: `${i * 80}ms` }}>
                <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${feat.color}, transparent)` }} />
                <div className="p-2 rounded-lg w-fit mb-3" style={{ background: `${feat.color}15` }}>
                  <feat.icon size={22} style={{ color: feat.color }} />
                </div>
                <h3 className="font-semibold mb-2">{feat.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-cyan mb-4 inline-block">How it works</span>
            <h2 className="font-display text-4xl font-bold">From zero to debt-free<br />in three steps</h2>
          </div>
          <div className="relative grid md:grid-cols-3 gap-8">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />
            {[
              { n: '01', title: 'Connect your repo', desc: 'Install the GitHub App or add your GitLab/Bitbucket webhook. Takes 60 seconds. Zero config needed.', icon: Github },
              { n: '02', title: 'Scan and discover', desc: 'CollabDebt scans every file using tree-sitter + semgrep + Claude AI. Dollar cost estimates generated automatically.', icon: Zap },
              { n: '03', title: 'Collaborate and fix', desc: 'Your team sees the debt board. Votes on priorities. Fixes together in real-time collab sessions.', icon: Users },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-display font-bold border-2 relative"
                  style={{ borderColor: 'var(--cyan)', color: 'var(--cyan)', background: 'rgba(0,229,255,0.06)' }}>
                  {step.n}
                </div>
                <h3 className="font-display font-semibold text-lg">{step.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6" style={{ background: 'var(--surface)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge-cyan mb-4 inline-block">Pricing</span>
            <h2 className="font-display text-4xl font-bold mb-6">Simple, transparent pricing</h2>
            {/* Toggle */}
            <div className="inline-flex items-center gap-3 p-1 rounded-full border" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
              <button onClick={() => setYearly(false)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!yearly ? 'text-[#050a0f]' : ''}`}
                style={!yearly ? { background: 'var(--cyan)' } : { color: 'var(--text-muted)' }}>
                Monthly
              </button>
              <button onClick={() => setYearly(true)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${yearly ? 'text-[#050a0f]' : ''}`}
                style={yearly ? { background: 'var(--cyan)' } : { color: 'var(--text-muted)' }}>
                Yearly
              </button>
              {yearly && <span className="badge-low text-xs mr-1">Save 2 months</span>}
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {PLANS.map((plan) => (
              <div key={plan.id} className={`card relative flex flex-col ${plan.popular ? 'ring-1 ring-[#00e5ff]' : ''}`}
                style={plan.popular ? { boxShadow: '0 0 30px rgba(0,229,255,0.1)' } : {}}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge-cyan text-[10px] px-2 whitespace-nowrap">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="font-display font-bold text-lg mb-2">{plan.name}</h3>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold font-display" style={{ color: 'var(--cyan)' }}>
                      ${yearly ? plan.yearly : plan.monthly * 12 === plan.yearly * 12 ? plan.monthly : plan.monthly}
                    </span>
                    <span className="text-sm pb-1" style={{ color: 'var(--text-muted)' }}>/{yearly ? 'yr' : 'mo'}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--green)' }} />
                      <span style={{ color: 'var(--text-muted)' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                {plan.id === 'free' ? (
                  <Link href="/auth/signup" className="btn-ghost text-sm text-center justify-center">
                    {plan.cta}
                  </Link>
                ) : plan.id === 'enterprise' ? (
                  <a href="mailto:support@collabdebt.com" className="btn-ghost text-sm text-center justify-center">
                    {plan.cta}
                  </a>
                ) : (
                  <Link href="/auth/signup" className={`text-sm text-center justify-center ${plan.popular ? 'btn-primary' : 'btn-ghost'}`}>
                    {plan.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold">Trusted by engineering teams</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: 'We had $47K in unquantified debt. CollabDebt surfaced it in 3 minutes and gave us a sprint plan. Our manager finally approved the cleanup budget.', name: 'Rohan Verma', role: 'Engineering Lead @ Zepto' },
              { quote: 'The PR comments changed everything. Our code review process now includes debt impact by default. We\'ve reduced new debt creation by 60%.', name: 'Aisha Khan', role: 'Senior Dev @ CRED' },
              { quote: 'The manager dashboard is scary accurate. I can see exactly which parts of the codebase are slowing us down and present it to the CEO in plain English.', name: 'Vikram Nair', role: 'CTO @ Razorpay' },
            ].map((t, i) => (
              <div key={i} className="card">
                <div className="flex gap-1 mb-3">
                  {Array(5).fill(0).map((_, j) => <Star key={j} size={14} fill="#ffd600" style={{ color: '#ffd600' }} />)}
                </div>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold font-display"
                    style={{ background: 'var(--border)', color: 'var(--cyan)' }}>
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,229,255,0.04) 0%, transparent 70%)' }} />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-display text-4xl font-bold mb-4">Ready to kill your debt?</h2>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Join 500+ engineering teams. Free to start.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="btn-primary text-base px-8 py-3">
              <Github size={18} /> Start with GitHub — Free
            </Link>
            <Link href="/auth/signup" className="btn-ghost text-base px-8 py-3">
              Sign up with email
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t py-12 px-6" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs"
                  style={{ background: 'var(--cyan)', color: 'var(--bg)' }}>CD</div>
                <span className="font-display font-bold">CollabDebt</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Technical debt, finally solved.</p>
            </div>
            {[
              { heading: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
              { heading: 'Resources', links: ['Docs', 'GitHub', 'Status'] },
              { heading: 'Company', links: ['About', 'Privacy', 'Terms'] },
            ].map(col => (
              <div key={col.heading}>
                <div className="font-semibold text-sm mb-3">{col.heading}</div>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="https://support.collabdebt.com" className="text-sm transition-colors hover:text-white" style={{ color: 'var(--text-muted)' }}>
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t flex items-center justify-between gap-4 flex-wrap" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>© 2024 CollabDebt. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {[Github, ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>].map((Icon, i) => (
                <a key={i} href="#" className="transition-colors hover:text-white" style={{ color: 'var(--text-muted)' }}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

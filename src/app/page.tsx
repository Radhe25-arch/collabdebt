'use client'

import Link from 'next/link'
import { ArrowRight, GitBranch, BarChart3, Users, Zap, Shield, Check, Terminal } from 'lucide-react'

const FEATURES = [
  {
    icon: Terminal,
    title: 'Debt Scanner',
    desc: 'Automatically detect TODOs, deprecated APIs, N+1 queries, and security vulnerabilities across all your repos.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    desc: 'Track velocity, cost impact, and resolution trends. Know exactly how much technical debt is costing your team.',
  },
  {
    icon: GitBranch,
    title: 'Sprint Integration',
    desc: 'Assign debt items to sprints and track resolution alongside your regular feature work.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    desc: 'Every engineer sees the same board. Vote, assign, comment, and prioritize as a team.',
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    desc: 'Changes reflect instantly for everyone. No refresh needed, no data drift.',
  },
  {
    icon: Shield,
    title: 'CollabConnect',
    desc: 'Discover engineers who want to help. Filter by language, role, and availability. (Pro)',
  },
]

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['1 repository', '50 debt items', 'Basic analytics', '3 team members'],
    cta: 'Get started',
    href: '/auth/signup',
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per user/month',
    features: ['Unlimited repos', 'Unlimited items', 'Advanced analytics', 'Sprints', 'CollabConnect'],
    cta: 'Start free trial',
    href: '/auth/signup',
    highlight: true,
  },
  {
    name: 'Team',
    price: '$29',
    period: 'per user/month',
    features: ['Everything in Pro', 'Manager view', 'AI recommendations', 'Priority support', 'Custom integrations'],
    cta: 'Contact us',
    href: '/auth/signup',
  },
]

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', padding: '16px 40px',
        borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: 'auto' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '6px', background: 'var(--blue)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 700, color: '#fff'
          }}>CD</div>
          <span style={{ fontWeight: 700, fontSize: '15px' }}>CollabDebt</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="#features" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>Features</Link>
          <Link href="#pricing" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>Pricing</Link>
          <Link href="/auth/signup" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>Sign in</Link>
          <Link href="/auth/signup" style={{
            fontSize: '13px', fontWeight: 600, padding: '7px 16px',
            background: 'var(--text)', color: 'var(--bg)', borderRadius: '6px', textDecoration: 'none'
          }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 40px 80px', maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontSize: '12px', fontWeight: 500, color: 'var(--blue)',
          background: 'rgba(0,112,243,0.1)', padding: '4px 12px', borderRadius: '100px',
          marginBottom: '28px', border: '1px solid rgba(0,112,243,0.2)'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--blue)', display: 'inline-block' }} />
          Now with real-time collaboration
        </div>

        <h1 style={{
          fontSize: '52px', fontWeight: 800, lineHeight: 1.15,
          letterSpacing: '-1.5px', marginBottom: '20px', color: 'var(--text)'
        }}>
          Manage technical debt<br />
          <span style={{ color: 'var(--text-muted)' }}>like a product team.</span>
        </h1>

        <p style={{
          fontSize: '17px', color: 'var(--text-muted)', lineHeight: 1.7,
          marginBottom: '36px', maxWidth: '560px', margin: '0 auto 36px'
        }}>
          CollabDebt gives engineering teams a shared workspace to detect, track, and resolve technical debt — 
          with real-time updates, sprint integration, and cost impact analysis.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/auth/signup" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '14px', fontWeight: 600, padding: '11px 24px',
            background: 'var(--text)', color: 'var(--bg)', borderRadius: '7px', textDecoration: 'none'
          }}>
            Start for free <ArrowRight size={14} />
          </Link>
          <Link href="#features" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '14px', fontWeight: 500, padding: '11px 24px',
            border: '1px solid var(--border)', borderRadius: '7px', textDecoration: 'none',
            color: 'var(--text-muted)'
          }}>
            See how it works
          </Link>
        </div>
      </section>

      {/* Code block preview */}
      <section style={{ padding: '0 40px 80px', maxWidth: '860px', margin: '0 auto' }}>
        <div style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          borderRadius: '10px', overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '12px 16px', borderBottom: '1px solid var(--border)'
          }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => (
              <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
            ))}
            <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
              debt-scanner.ts
            </span>
          </div>
          <div style={{ padding: '24px 24px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', lineHeight: '1.8' }}>
            {[
              { indent: 0, text: <><span style={{ color: '#888' }}>// </span><span style={{ color: 'var(--yellow)' }}>TODO: refactor auth to use JWT refresh tokens — est 2d</span></> },
              { indent: 0, text: <><span style={{ color: 'var(--red)' }}>const</span> <span style={{ color: 'var(--blue)' }}>data</span> = await fetchUser(id)  <span style={{ color: '#888' }}>// N+1 query detected ⚠</span></> },
              { indent: 0, text: <><span style={{ color: '#888' }}>// </span><span style={{ color: 'var(--orange)' }}>DEPRECATED: remove legacy payment handler</span></> },
              { indent: 0, text: <><span style={{ color: 'var(--green)' }}>// ✓ debt resolved — PR #247 merged</span></> },
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px' }}>
                <span style={{ color: 'var(--text-dim)', userSelect: 'none', minWidth: '20px' }}>{i + 1}</span>
                <span>{l.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '60px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px' }}>
          Everything your team needs
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '48px' }}>
          A complete platform for engineering teams serious about code health.
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px',
          background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden'
        }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ padding: '28px 24px', background: 'var(--bg-secondary)' }}>
              <f.icon size={18} style={{ color: 'var(--blue)', marginBottom: '14px' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '60px 40px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px' }}>
          Simple pricing
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '48px' }}>
          Start free. Scale when your team grows.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {PLANS.map((plan, i) => (
            <div
              key={i}
              style={{
                background: plan.highlight ? 'var(--bg-secondary)' : 'var(--bg)',
                border: `1px solid ${plan.highlight ? 'var(--blue)' : 'var(--border)'}`,
                borderRadius: '10px', padding: '28px 24px'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>
                {plan.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '6px' }}>
                <span style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px' }}>{plan.price}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '24px' }}>{plan.period}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <Check size={13} style={{ color: 'var(--green)', flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} style={{
                display: 'block', textAlign: 'center', padding: '9px 16px',
                background: plan.highlight ? 'var(--blue)' : 'transparent',
                color: plan.highlight ? '#fff' : 'var(--text)',
                border: `1px solid ${plan.highlight ? 'var(--blue)' : 'var(--border)'}`,
                borderRadius: '6px', fontSize: '13px', fontWeight: 600, textDecoration: 'none'
              }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '32px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '22px', height: '22px', borderRadius: '4px', background: 'var(--blue)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: 700, color: '#fff'
          }}>CD</div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>© 2025 CollabDebt</span>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Privacy', 'Terms', 'GitHub'].map(l => (
            <Link key={l} href="#" style={{ fontSize: '12px', color: 'var(--text-dim)', textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  GitBranch, 
  Users, 
  Zap, 
  Shield, 
  Terminal, 
  Activity,
  Code2,
  Cpu,
  Globe,
  Layers,
  Lock,
  ChevronRight,
  ArrowRight,
  Check,
  Search,
  Sparkles,
  Layout
} from 'lucide-react'
import { useRef } from 'react'
import Link from 'next/link'

const FEATURES = [
  {
    icon: Terminal,
    title: 'Debt Scanner',
    desc: 'Automatically detect TODOs, deprecated APIs, N+1 queries, and security vulnerabilities across all your repos.',
    color: 'emerald'
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    desc: 'Track velocity, cost impact, and resolution trends. Know exactly how much technical debt is costing your team.',
    color: 'blue'
  },
  {
    icon: GitBranch,
    title: 'Sprint Integration',
    desc: 'Assign debt items to sprints and track resolution alongside your regular feature work.',
    color: 'indigo'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    desc: 'Every engineer sees the same board. Vote, assign, comment, and prioritize as a team.',
    color: 'violet'
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    desc: 'Changes reflect instantly for everyone. No refresh needed, no data drift.',
    color: 'amber'
  },
  {
    icon: Shield,
    title: 'CollabConnect',
    desc: 'Discover engineers who want to help. Filter by language, role, and availability. (Pro)',
    color: 'rose'
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
  const containerRef = useRef<HTMLDivElement>(null)
  
  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#09090b] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Animated Mesh Background */}
      <div className="mesh-bg">
        <div className="mesh-blob blob-1" />
        <div className="mesh-blob blob-2" />
        <div className="mesh-blob blob-3" />
      </div>
      <div className="noise-overlay" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              <Zap size={18} className="text-white" />
            </motion.div>
            <span className="font-bold text-lg tracking-tight text-white">CollabDebt</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'Documentation'].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link 
              href="/auth/signup" 
              className="group relative px-6 py-2.5 bg-white text-black rounded-full text-sm font-bold overflow-hidden transition-all hover:pr-10"
            >
              <span>Get started</span>
              <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-10 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
          >
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            V4.0 — Now with Smart Code Health Analysis
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.95]"
          >
            SHIP QUALITY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-200 to-zinc-500">WITHOUT DEBT.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
          >
            The engineering intelligence platform that automatically detects, <br className="hidden md:block" />
            quantifies, and helps resolve technical debt in real-time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link 
              href="/auth/signup" 
              className="w-full sm:w-auto px-10 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-black text-lg transition-all shadow-[0_20px_40px_-10px_rgba(99,102,241,0.5)] hover:-translate-y-1 active:scale-95"
            >
              Start Building Free
            </Link>
            <Link 
              href="#features" 
              className="w-full sm:w-auto px-10 py-4 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 text-zinc-300 rounded-2xl font-bold text-lg transition-all backdrop-blur-xl hover:bg-zinc-800"
            >
              Watch the Demo
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">ENGINEERING INTELLIGENCE.</h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto font-medium">
            Everything your team needs to maintain a healthy codebase and high velocity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-all card-hover overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl`}>
                  <feature.icon className="text-indigo-400" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed font-medium transition-colors group-hover:text-zinc-400">
                  {feature.desc}
                </p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 text-white/5 font-mono text-8xl pointer-events-none select-none">
                0{i + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">TRANSPARENT PRICING.</h2>
            <p className="text-zinc-500 text-lg font-medium">Clean code shouldn&apos;t break the bank.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANS.map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className={`p-10 rounded-[32px] border transition-all ${
                  plan.highlight 
                    ? 'bg-zinc-900 border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.1)]' 
                    : 'bg-zinc-950 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="text-sm font-bold text-indigo-400 mb-4 uppercase tracking-widest">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-black">{plan.price}</span>
                  <span className="text-zinc-500 font-medium lowercase">/{plan.period.split('/')[1] || plan.period}</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-zinc-400 font-medium">
                      <Check size={18} className="text-indigo-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link 
                  href={plan.href}
                  className={`block text-center py-4 rounded-2xl font-black text-base transition-all ${
                    plan.highlight
                      ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg'
                      : 'bg-white text-black hover:bg-zinc-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-20 bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Zap size={24} className="text-indigo-500" />
              <span className="font-bold text-xl tracking-tight">CollabDebt</span>
            </div>
            <p className="text-zinc-500 max-w-sm font-medium">
              The engineering intelligence platform for high-velocity teams.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-zinc-400">Product</h4>
            <ul className="space-y-4 text-zinc-500 font-medium">
              <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-zinc-400">Company</h4>
            <ul className="space-y-4 text-zinc-500 font-medium">
              <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-600 text-sm font-medium">
          <p>© 2025 CollabDebt Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

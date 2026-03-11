'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  Github, Zap, BarChart3, Users, GitBranch, Bot, Shield,
  ChevronRight, Play, Check, Star, ArrowRight, Menu, X,
  TrendingDown, AlertTriangle, Clock, DollarSign, Sparkles,
  MousePointer2, Globe, Cpu
} from 'lucide-react'

// ── Antigravity Floating Particle Field ──────────────────────────────────────
function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            scale: Math.random() * 2
          }}
          animate={{
            y: [null, '-20%', '120%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10
          }}
        />
      ))}
    </div>
  )
}

// ── Neural Pulse (Unique Feature) ───────────────────────────────────────────
function NeuralPulse() {
  return (
    <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
      {/* Outer rings */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 border border-cyan-500/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
      
      {/* Central Hub */}
      <motion.div 
        className="w-32 h-32 rounded-full glass flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(0,242,255,0.2)]"
        animate={{
          y: [-10, 10, -10],
          boxShadow: [
            "0 0 20px rgba(0,242,255,0.2)",
            "0 0 50px rgba(0,242,255,0.4)",
            "0 0 20px rgba(0,242,255,0.2)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cpu size={48} className="text-cyan-400" />
      </motion.div>

      {/* Floating nodes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-12 h-12 glass rounded-xl flex items-center justify-center text-cyan-400 shadow-xl"
          initial={{ rotate: i * 60 }}
          animate={{
            rotate: i * 60 + 360,
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '50% 150px' }}
        >
          <motion.div animate={{ rotate: -(i * 60 + 360) }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
            {i % 2 === 0 ? <Zap size={16} /> : <Sparkles size={16} />}
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

// ── Terminal Animation ───────────────────────────────────────────────────────
const TERMINAL_LINES = [
  { text: '$ collabdebt init --ai-pulse', type: 'prompt', delay: 0 },
  { text: '📡 Initializing neural link...', type: 'info', delay: 800 },
  { text: '✓ Antigravity core engaged (0.4s)', type: 'output', delay: 1400 },
  { text: '🧠 Analyzing spatial debt distribution...', type: 'info', delay: 2000 },
  { text: '🌊 Scanning auth/service.ts (84% complexity)', type: 'error', delay: 2800 },
  { text: '✨ AI Suggestion: Refactor into spatial micro-hooks', type: 'output', delay: 3600 },
  { text: '─────────────────────────────────────────', type: 'info', delay: 4200 },
  { text: '  Current Orbit: Healthy', type: 'output', delay: 4800 },
  { text: '  Potential Savings: $14,200', type: 'info', delay: 5400 },
]

function TerminalHero() {
  const [visibleLines, setVisibleLines] = useState(0)
  useEffect(() => {
    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    })
  }, [])
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="terminal max-w-lg w-full"
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold ml-2">CollabConnect™ Core</span>
      </div>
      <div className="space-y-1.5 min-h-[160px]">
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="terminal-line">
            <span className={
              line.type === 'prompt' ? 'text-cyan-400' : 
              line.type === 'output' ? 'text-emerald-400' : 
              line.type === 'error' ? 'text-red-400' : 
              'text-slate-500'
            }>
              {line.text}
            </span>
          </div>
        ))}
        {visibleLines < TERMINAL_LINES.length && (
          <span className="animate-cursor text-cyan-400">▊</span>
        )}
      </div>
    </motion.div>
  )
}

// ── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className="relative min-h-screen bg-[#03080c] text-slate-200 selection:bg-cyan-500/30">
      <ParticleField />
      
      {/* ── Navbar ──────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className={`glass px-6 h-16 rounded-2xl flex items-center justify-between border-white/5 transition-all ${scrolled ? 'shadow-2xl translate-y-2' : ''}`}>
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl glass border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 group-hover:scale-110 transition-transform">
                CD
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">CollabDebt</span>
              <div className="badge-cyan py-0 px-2 rounded-md">Realtime</div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {['Features', 'Pricing', 'Network'].map(item => (
                <button key={item} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">{item}</button>
              ))}
              <div className="h-4 w-px bg-white/10" />
              <Link href="/auth/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">SignIn</Link>
              <Link href="/auth/signup" className="btn-primary py-2 px-5 rounded-xl">Launch App</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            style={{ opacity, scale }}
            className="space-y-8 relative z-10"
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest"
            >
              <Sparkles size={14} /> The Future of Technical Debt
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-6xl md:text-8xl font-extrabold leading-[0.9] text-white tracking-tighter"
            >
              Zero Gravity <br />
              <span className="text-gradient-cyan">Development.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-400 max-w-lg leading-relaxed"
            >
              Stop fighting legacy code. CollabDebt uses neural-scan technology to quantify, 
              prioritize, and eliminate technical debt in real-time. Experience the anti-gravity workflow.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link href="/auth/signup" className="btn-primary text-base px-8 py-4">
                Get Started Free <ArrowRight size={20} />
              </Link>
              <button className="btn-ghost text-base px-8 py-4 glass">
                <Play size={18} /> Watch Demo
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5"
            >
              {[
                { label: 'Neural Scans', val: '4.2M' },
                { label: 'Debt Liquidated', val: '$1.4B' },
                { label: 'Uptime', val: '99.9%' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-white">{s.val}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Visuals */}
          <div className="relative flex items-center justify-center py-20 lg:py-0">
            <NeuralPulse />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full animate-glow" />
            <div className="absolute top-0 right-0 z-20 float-slow">
              <TerminalHero />
            </div>
          </div>
        </div>
      </section>

      {/* ── Brand Marquee ───────────────────────────────────────── */}
      <div className="py-12 glass border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
          <div className="flex gap-16 animate-ticker whitespace-nowrap font-display font-bold text-xl text-slate-400">
            {[...Array(2)].map((_, repeat) => (
              <div key={repeat} className="flex gap-16">
                <span>MICROSOFT</span>
                <span>GOOGLE</span>
                <span>ANTHROPIC</span>
                <span>OPENAI</span>
                <span>VERCEL</span>
                <span>SUPABASE</span>
                <span>STRIPE</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features Grid ───────────────────────────────────────── */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-4 mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight">The Future Operating System <br /> for Code Health.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">CollabDebt isn't just a scanner. It's a spatial redistribution layer for your codebase.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: Cpu, title: 'Neural AST Mapping', 
                desc: 'Understands your code contextually. Not just regex, but deep semantic understanding.',
                color: 'cyan'
              },
              { 
                icon: Globe, title: 'Global Sync', 
                desc: 'Realtime collaboration across timezones. Your debt board is alive and breathing.',
                color: 'purple'
              },
              { 
                icon: MousePointer2, title: 'Spatial Prioritization', 
                desc: 'Drag, drop, and vote in a high-fidelity interface designed for performance.',
                color: 'green'
              },
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card group"
              >
                <div className={`w-14 h-14 rounded-2xl glass mb-6 flex items-center justify-center text-${f.color}-400 group-hover:scale-110 transition-transform`}>
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Spatial Dashboard Preview ─────────────────────────────── */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="glass rounded-[40px] p-4 border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative"
          >
            <div className="bg-[#03080c] rounded-[32px] overflow-hidden aspect-[16/10] relative shadow-inner">
               <div className="absolute inset-0 bg-dot-grid" />
               <div className="absolute inset-0 flex items-center justify-center flex-col space-y-6">
                  <div className="badge-cyan py-1 px-4 text-xs font-bold">Preview Live Env</div>
                  <h3 className="text-5xl font-display font-bold text-white tracking-tighter">Liquid Interface.</h3>
                  <p className="text-slate-400 text-center max-w-md">Experience a dashboard that responds to your team's rhythm. Floating cards, holographic charts, and neural health scores.</p>
                  <Link href="/auth/signup" className="btn-primary">Explore Interface</Link>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto glass rounded-[50px] p-20 text-center relative overflow-hidden border-cyan-500/10">
          <div className="absolute inset-0 mesh-cyan opacity-20" />
          <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-8 tracking-tighter relative z-10">
            Escape the Gravity <br /> of Legacy Code.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/auth/signup" className="btn-primary text-lg px-10 py-5">
               Engage Neural Scan
            </Link>
            <Link href="/auth/signup" className="btn-ghost text-lg px-10 py-5 glass">
               Contact Flight Support
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 text-slate-500">
          <div>
             <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl glass border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400">CD</div>
                <span className="font-display font-bold text-xl text-white">CollabDebt</span>
             </div>
             <p className="max-w-xs text-sm leading-relaxed">Quantifying technical debt through neural spatial analysis. Built for teams that move at warp speed.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-12">
            <div>
               <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Orbit</h4>
               <ul className="space-y-4 text-sm font-medium">
                  <li><button className="hover:text-cyan-400 transition-colors">Neural Scans</button></li>
                  <li><button className="hover:text-cyan-400 transition-colors">Global Sync</button></li>
                  <li><button className="hover:text-cyan-400 transition-colors">Antigravity Core</button></li>
               </ul>
            </div>
            <div>
               <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Support</h4>
               <ul className="space-y-4 text-sm font-medium">
                  <li><button className="hover:text-cyan-400 transition-colors">Documentation</button></li>
                  <li><button className="hover:text-cyan-400 transition-colors">Flight Logs</button></li>
                  <li><button className="hover:text-cyan-400 transition-colors">Network Status</button></li>
               </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/5 flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.2em]">
           <span>© 2026 CollabConnect™ Industries</span>
           <span>Universal Standard Time</span>
        </div>
      </footer>
    </div>
  )
}

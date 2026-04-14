import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ChevronRight, Code2, Zap, Trophy, MessageSquare,
  Cloud, Shield, Target, Cpu, Terminal, Users, Star, BarChart2,
  Sparkles, Play, CheckCircle, Globe, TrendingUp, BookOpen, Swords,
} from 'lucide-react';
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion';

/* ── helpers ─────────────────────────────────────────────────────── */
function useCounter(end: number, duration = 2, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const controls = animate(0, end, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: v => setVal(Math.round(v)),
    });
    return controls.stop;
  }, [end, duration, start]);
  return val;
}

/* ── ANIMATED COUNTER ────────────────────────────────────────────── */
function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const count = useCounter(value, 2, inView);
  return (
    <div ref={ref} className="text-center">
      <div
        className="text-4xl md:text-5xl font-bold mb-2 tabular-nums"
        style={{
          fontFamily: 'Geist Mono, monospace',
          background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.6) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {count.toLocaleString()}{suffix}
      </div>
      <p style={{ color: '#737373', fontSize: '14px' }}>{label}</p>
    </div>
  );
}

/* ── TYPEWRITER ─────────────────────────────────────────────────── */
const WORDS = ['Developers.', 'Architects.', 'Engineers.', 'Founders.', 'Learners.'];
function Typewriter() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = WORDS[idx];
    let timer: ReturnType<typeof setTimeout>;
    if (!deleting && text.length < word.length) {
      timer = setTimeout(() => setText(word.slice(0, text.length + 1)), 60);
    } else if (!deleting && text.length === word.length) {
      timer = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && text.length > 0) {
      timer = setTimeout(() => setText(word.slice(0, text.length - 1)), 35);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setIdx(i => (i + 1) % WORDS.length);
    }
    return () => clearTimeout(timer);
  }, [text, deleting, idx]);

  return (
    <span style={{
      background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #a78bfa 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}>
      {text}
      <span
        style={{
          display: 'inline-block',
          width: '3px',
          height: '1em',
          background: '#6366f1',
          marginLeft: '4px',
          verticalAlign: 'middle',
          borderRadius: '1px',
          animation: 'pulse 1s infinite',
        }}
      />
    </span>
  );
}

/* ── FLOATING CODE CARD ──────────────────────────────────────────── */
function FloatingCard({ style, children }: { style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'rgba(12,12,12,0.92)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── BENTO CARD ──────────────────────────────────────────────────── */
function BentoCard({
  className = '',
  children,
  glowColor = 'rgba(99,102,241,0.15)',
}: {
  className?: string;
  children: React.ReactNode;
  glowColor?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl p-6 ${className}`}
      style={{
        background: 'rgba(10,10,10,0.8)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
        boxShadow: hovered
          ? `0 0 40px ${glowColor}, 0 20px 60px rgba(0,0,0,0.4)`
          : '0 4px 20px rgba(0,0,0,0.2)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {hovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${glowColor}, transparent)` }}
        />
      )}
      {children}
    </motion.div>
  );
}

/* ── SECTION REVEAL ──────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── LABEL CHIP ──────────────────────────────────────────────────── */
function Chip({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ElementType }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
      style={{
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.2)',
        color: '#818cf8',
        fontFamily: 'Geist Mono, monospace',
        letterSpacing: '0.05em',
      }}
    >
      {Icon && <Icon size={11} />}
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* ─────────────────────  MAIN LANDING  ────────────────────────────── */
/* ─────────────────────────────────────────────────────────────────── */
export function Landing() {
  const { scrollYProgress } = useScroll();
  const heroY     = useTransform(scrollYProgress, [0, 0.4], [0, -80]);
  const floatY1   = useTransform(scrollYProgress, [0, 0.4], [0, -120]);
  const floatY2   = useTransform(scrollYProgress, [0, 0.4], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <div className="flex flex-col items-center relative" style={{ background: '#030303', color: '#f5f5f5' }}>

      {/* ════════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Aurora background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 90% 70% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 65%),
              radial-gradient(ellipse 60% 50% at 80% 40%, rgba(168,85,247,0.1) 0%, transparent 55%),
              radial-gradient(ellipse 60% 50% at 15% 70%, rgba(59,130,246,0.08) 0%, transparent 55%)
            `,
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)
            `,
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 100%)',
          }}
        />

        {/* Floating card — left */}
        <motion.div
          className="absolute top-1/4 left-6 xl:left-20 hidden lg:block animate-float"
          style={{ y: floatY1, zIndex: 5 }}
        >
          <FloatingCard style={{ padding: '16px 20px', minWidth: '220px' }}>
            <div className="flex items-center gap-2 mb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
              <div className="flex gap-1">
                {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
              </div>
              <span style={{ fontSize: '11px', color: '#525252', fontFamily: 'Geist Mono, monospace' }}>build.log</span>
            </div>
            <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', lineHeight: '1.7' }}>
              <span style={{ color: '#6366f1' }}>Compiling</span><span style={{ color: '#737373' }}> core_engine v2.4.1</span><br/>
              <span style={{ color: '#6366f1' }}>Compiling</span><span style={{ color: '#737373' }}> distributed_sync</span><br/>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>✓ Finished</span><span style={{ color: '#525252' }}> in 0.84s</span>
            </div>
          </FloatingCard>
        </motion.div>

        {/* Floating card — right */}
        <motion.div
          className="absolute bottom-1/3 right-6 xl:right-20 hidden lg:block animate-float-slow"
          style={{ y: floatY2, zIndex: 5 }}
        >
          <FloatingCard style={{ padding: '16px 20px', minWidth: '200px' }}>
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={13} style={{ color: '#22c55e' }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#a3a3a3' }}>XP Earned Today</span>
            </div>
            <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: '24px', fontWeight: 700, color: '#22c55e', marginBottom: '4px' }}>+1,840</div>
            <div style={{ fontSize: '11px', color: '#525252' }}>↑ 23% from yesterday</div>
          </FloatingCard>
        </motion.div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-10"
            style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              fontSize: '12px',
              color: '#818cf8',
              fontFamily: 'Geist Mono, monospace',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px rgba(34,197,94,0.8)' }} className="animate-pulse" />
            25,000+ developers online right now
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-[clamp(48px,8vw,96px)] font-bold leading-[1.02] tracking-[-0.04em] mb-6"
            style={{ color: '#ffffff' }}
          >
            Built for
            <br />
            <Typewriter />
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ color: '#737373' }}
          >
            The platform where elite engineers are forged. Master 300+ languages,
            battle peers live, and ship career-defining projects — all
            in one place.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/app">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                  color: '#ffffff',
                  boxShadow: '0 0 0 1px rgba(99,102,241,0.4), 0 8px 30px rgba(99,102,241,0.3)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 1px rgba(99,102,241,0.6), 0 12px 40px rgba(99,102,241,0.4)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 1px rgba(99,102,241,0.4), 0 8px 30px rgba(99,102,241,0.3)';
                }}
              >
                Start Building Free
                <ArrowRight size={15} />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#a3a3a3',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.18)';
                (e.currentTarget as HTMLElement).style.color = '#f5f5f5';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLElement).style.color = '#a3a3a3';
              }}
            >
              <Play size={13} fill="currentColor" />
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Trusted logos row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 flex flex-col items-center gap-4"
          >
            <p style={{ fontSize: '12px', color: '#404040', fontFamily: 'Geist Mono, monospace', letterSpacing: '0.08em' }}>
              TRUSTED BY ENGINEERS AT
            </p>
            <div className="flex items-center gap-8 flex-wrap justify-center">
              {['Google', 'Meta', 'Stripe', 'Vercel', 'Linear', 'Figma'].map(name => (
                <span
                  key={name}
                  style={{ fontSize: '13px', fontWeight: 600, color: '#2a2a2a', letterSpacing: '0.06em' }}
                >
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: '#2a2a2a' }}
        >
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, transparent, rgba(99,102,241,0.4))' }} />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 2 — STATS
      ════════════════════════════════════════════════ */}
      <section className="w-full border-y py-20 relative overflow-hidden"
               style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(8,8,8,0.8)' }}>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12">
          <AnimatedStat value={25000}  suffix="+"  label="Active Learners" />
          <AnimatedStat value={300}    suffix="+"  label="Languages Supported" />
          <AnimatedStat value={1}      suffix="M+" label="Problems Solved" />
          <AnimatedStat value={98}     suffix="%"  label="Satisfaction Rate" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 3 — MARQUEE
      ════════════════════════════════════════════════ */}
      <section className="w-full py-8 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none"
             style={{ background: 'linear-gradient(to right, #030303, transparent)' }} />
        <div className="absolute inset-y-0 right-0 w-32 z-10 pointer-events-none"
             style={{ background: 'linear-gradient(to left, #030303, transparent)' }} />
        <div className="flex animate-marquee gap-16 whitespace-nowrap">
          {[...Array(3)].map((_, gi) =>
            ['Rust', 'Go', 'TypeScript', 'Zig', 'C++', 'Haskell', 'Python', 'Elixir', 'Kotlin', 'Swift', 'Scala', 'Julia'].map((lang, i) => (
              <span
                key={`${gi}-${i}`}
                className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest"
                style={{ color: '#2e2e3a', fontFamily: 'Geist Mono, monospace' }}
              >
                <span style={{ color: '#4040a0', opacity: 0.5 }}>◆</span> {lang}
              </span>
            ))
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 4 — HOW IT WORKS
      ════════════════════════════════════════════════ */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <Reveal className="text-center mb-20">
          <Chip icon={Sparkles}>How It Works</Chip>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-[-0.04em] mb-4"
            style={{ color: '#ffffff' }}
          >
            From zero to elite,
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #818cf8, #6366f1, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>step by step.</span>
          </h2>
          <p style={{ color: '#737373', fontSize: '17px', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
            A structured path that adapts to your pace and ambition.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              num: '01',
              icon: BookOpen,
              title: 'Choose Your Path',
              desc: 'Select from 300+ languages and domains. Our adaptive engine builds a personalized curriculum from day one.',
              color: '#6366f1',
            },
            {
              num: '02',
              icon: Cpu,
              title: 'Code in the Cloud',
              desc: 'Instant Docker-backed workspaces. No setup, no friction — just you and your editor, live in seconds.',
              color: '#8b5cf6',
            },
            {
              num: '03',
              icon: Swords,
              title: 'Battle & Rank Up',
              desc: 'Challenge peers in real-time algorithmic duels. Earn XP, climb the leaderboard, and prove your worth.',
              color: '#a78bfa',
            },
          ].map((step, i) => (
            <React.Fragment key={step.num}>
              <Reveal delay={i * 0.12}>
                <div
                  className="rounded-2xl p-7 h-full relative overflow-hidden card-hover"
                  style={{
                    background: 'rgba(10,10,10,0.8)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div
                    className="text-xs font-bold mb-6 inline-block"
                    style={{
                      fontFamily: 'Geist Mono, monospace',
                      color: step.color,
                      padding: '4px 10px',
                      background: `${step.color}14`,
                      borderRadius: '6px',
                      border: `1px solid ${step.color}30`,
                    }}
                  >
                    {step.num}
                  </div>
                  <step.icon size={22} style={{ color: step.color, marginBottom: '14px' }} />
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#f5f5f5' }}>{step.title}</h3>
                  <p style={{ color: '#737373', fontSize: '14px', lineHeight: 1.7 }}>{step.desc}</p>
                  <div
                    className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${step.color}18 0%, transparent 70%)`,
                    }}
                  />
                </div>
              </Reveal>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 5 — BENTO GRID
      ════════════════════════════════════════════════ */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <Reveal className="text-center mb-16">
          <Chip icon={Zap}>Platform Features</Chip>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-[-0.04em] mb-4"
            style={{ color: '#ffffff' }}
          >
            Everything you need.
            <br />Nothing you don't.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* AI Mentor — large */}
          <Reveal delay={0} className="md:col-span-2">
            <BentoCard className="h-64 md:h-72" glowColor="rgba(99,102,241,0.2)">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <MessageSquare size={18} style={{ color: '#818cf8' }} />
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)', fontFamily: 'Geist Mono, monospace' }}>
                  Live
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#f5f5f5' }}>Socratic AI Mentor</h3>
              <p style={{ color: '#737373', fontSize: '14px', lineHeight: 1.7, maxWidth: '400px' }}>
                Context-aware guidance that reads your code and asks the right questions — teaching you how to think, not just what to type.
              </p>
              {/* Mock chat */}
              <div className="mt-5 space-y-2">
                <div className="flex gap-2 items-start">
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(99,102,241,0.3)', flexShrink: 0, marginTop: 2 }} />
                  <div className="px-3 py-1.5 rounded-xl rounded-tl-sm text-xs" style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.15)' }}>
                    What's the time complexity of your current approach?
                  </div>
                </div>
              </div>
            </BentoCard>
          </Reveal>

          {/* Battles */}
          <Reveal delay={0.08}>
            <BentoCard className="h-64 md:h-72" glowColor="rgba(239,68,68,0.15)">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <Swords size={18} style={{ color: '#f87171' }} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#f5f5f5' }}>Live Battles</h3>
              <p style={{ color: '#737373', fontSize: '14px', lineHeight: 1.7 }}>
                Real-time 1v1 algorithmic duels. Your rank is your resume.
              </p>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#22c55e' }}>8/10</div>
                  <span style={{ fontSize: '11px', color: '#525252' }}>Tests passing</span>
                </div>
                <span style={{ fontSize: '12px', color: '#f87171', fontFamily: 'Geist Mono, monospace' }}>02:34</span>
              </div>
            </BentoCard>
          </Reveal>

          {/* Tournaments */}
          <Reveal delay={0.04}>
            <BentoCard className="h-56" glowColor="rgba(251,191,36,0.12)">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)' }}>
                <Trophy size={18} style={{ color: '#fbbf24' }} />
              </div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: '#f5f5f5' }}>Tournaments</h3>
              <p style={{ color: '#737373', fontSize: '13px', lineHeight: 1.6 }}>Massive events with XP prize pools and global rankings.</p>
            </BentoCard>
          </Reveal>

          {/* 300+ Languages */}
          <Reveal delay={0.1}>
            <BentoCard className="h-56" glowColor="rgba(168,85,247,0.15)">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                <Globe size={18} style={{ color: '#c084fc' }} />
              </div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: '#f5f5f5' }}>300+ Languages</h3>
              <p style={{ color: '#737373', fontSize: '13px', lineHeight: 1.6 }}>From mainstream to esoteric. If it compiles, we teach it.</p>
            </BentoCard>
          </Reveal>

          {/* Enterprise — large */}
          <Reveal delay={0.16} className="md:col-span-1">
            <BentoCard className="h-56" glowColor="rgba(34,197,94,0.12)">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                <Shield size={18} style={{ color: '#4ade80' }} />
              </div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: '#f5f5f5' }}>Enterprise Grade</h3>
              <p style={{ color: '#737373', fontSize: '13px', lineHeight: 1.6 }}>SSO, team analytics, and org-wide upskilling dashboards.</p>
            </BentoCard>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 6 — SOCIAL PROOF
      ════════════════════════════════════════════════ */}
      <section className="w-full py-28 relative overflow-hidden"
               style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(6,6,6,0.9)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <Reveal className="text-center mb-16">
            <Chip icon={Star}>Testimonials</Chip>
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.04em]" style={{ color: '#ffffff' }}>
              Loved by engineers
              <br />worldwide.
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                avatar: 'A',
                name: 'Arjun Sharma',
                role: 'SDE-2 @ Google',
                text: 'SkillForge is the only platform that actually felt like real engineering work. The battles are brutally fun.',
                accent: '#6366f1',
              },
              {
                avatar: 'M',
                name: 'Maria González',
                role: 'Staff Engineer @ Stripe',
                text: 'The AI Mentor is genuinely uncanny. It pushed me to think deeper about every problem, not just solve it.',
                accent: '#8b5cf6',
              },
              {
                avatar: 'K',
                name: 'Kenji Tanaka',
                role: 'Senior Dev @ Linear',
                text: 'I\'ve tried every learning platform. Nothing comes close to the quality and depth SkillForge offers.',
                accent: '#a78bfa',
              },
            ].map((t, i) => (
              <div key={i}>
              <Reveal delay={i * 0.1}>
                <div
                  className="rounded-2xl p-6 h-full card-hover"
                  style={{
                    background: 'rgba(10,10,10,0.8)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="flex gap-1 mb-5">
                    {Array(5).fill(0).map((_, si) => (
                      <Star key={si} size={12} fill={t.accent} style={{ color: t.accent }} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: '#a3a3a3' }}>"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: `${t.accent}20`, border: `1px solid ${t.accent}40`, color: t.accent }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: '#f5f5f5' }}>{t.name}</div>
                      <div className="text-xs" style={{ color: '#525252' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 7 — FINAL CTA
      ════════════════════════════════════════════════ */}
      <section className="w-full py-40 relative overflow-hidden flex flex-col items-center text-center px-4">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.15) 0%, transparent 70%)
            `,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '56px 56px',
          }}
        />

        <Reveal className="relative z-10 max-w-3xl">
          <Chip icon={Sparkles}>Get Started</Chip>
          <h2
            className="text-5xl md:text-7xl font-bold tracking-[-0.05em] mb-6"
            style={{ color: '#ffffff', lineHeight: 1.0 }}
          >
            Start your
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 40%, #a78bfa 80%, #818cf8 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradient-shift 4s ease infinite',
            }}>
              journey today.
            </span>
          </h2>
          <p className="text-lg mb-12" style={{ color: '#525252' }}>
            Free forever. No credit card required. Just start building.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/app">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                  color: '#ffffff',
                  boxShadow: '0 0 0 1px rgba(99,102,241,0.4), 0 12px 40px rgba(99,102,241,0.35)',
                }}
              >
                Create Free Account
                <ArrowRight size={16} />
              </motion.button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6">
            {['No credit card', 'Free forever', '25K+ members'].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: '#525252' }}>
                <CheckCircle size={11} style={{ color: '#6366f1' }} />
                {item}
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}

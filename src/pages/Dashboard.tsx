import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Play, Trophy, Target, Flame, ArrowRight, Code2, Cpu,
  TrendingUp, BookOpen, CheckCircle2, Circle, Zap, Star,
  BarChart2, Clock, Users, Activity,
} from 'lucide-react';
import { motion, useInView, animate } from 'framer-motion';

/* ── helpers ─────────────────────────────────────────────────── */
function useCounter(end: number, duration = 1.5, start = false) {
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

/* ── STAT CARD ────────────────────────────────────────────────── */
function StatCard({
  label,
  value,
  suffix = '',
  icon: Icon,
  accent,
  trend,
  delay = 0,
}: {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ElementType;
  accent: string;
  trend?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useCounter(value, 1.4, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(10,10,10,0.8)',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}14`, border: `1px solid ${accent}30` }}
        >
          <Icon size={16} style={{ color: accent }} />
        </div>
        {trend && (
          <span
            className="text-xs flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(34,197,94,0.08)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.15)', fontFamily: 'Geist Mono, monospace' }}
          >
            <TrendingUp size={9} /> {trend}
          </span>
        )}
      </div>
      <div
        className="text-2xl font-bold mb-1 tabular-nums"
        style={{ color: '#f5f5f5', fontFamily: 'Geist Mono, monospace' }}
      >
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs" style={{ color: '#525252' }}>{label}</div>
    </motion.div>
  );
}

/* ── XP RING ──────────────────────────────────────────────────── */
function XPRing({ pct = 83 }: { pct?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const R = 54;
  const CIRCUMF = 2 * Math.PI * R;

  return (
    <div ref={ref} className="relative flex items-center justify-center" style={{ width: 144, height: 144 }}>
      <svg width="144" height="144" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="72" cy="72" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <motion.circle
          cx="72" cy="72" r={R}
          fill="none"
          stroke="url(#xp-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRCUMF}
          initial={{ strokeDashoffset: CIRCUMF }}
          animate={inView ? { strokeDashoffset: CIRCUMF * (1 - pct / 100) } : {}}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
        <defs>
          <linearGradient id="xp-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div
          className="text-2xl font-bold tabular-nums"
          style={{ color: '#f5f5f5', fontFamily: 'Geist Mono, monospace' }}
        >
          {pct}%
        </div>
        <div className="text-[10px] mt-0.5" style={{ color: '#525252' }}>to Lv 43</div>
      </div>
    </div>
  );
}

/* ── MINI SPARKLINE ───────────────────────────────────────────── */
function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const norm = (v: number) => ((v - min) / (max - min || 1)) * 32;
  const w = 64;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${32 - norm(v)}`).join(' ');
  return (
    <svg width={w} height="32" style={{ overflow: 'visible' }}>
      <polyline points={points} fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ── ACTIVITY HEATMAP ─────────────────────────────────────────── */
function ActivityHeatmap() {
  const weeks = 26;
  const days = 7;
  const data = Array.from({ length: weeks * days }, () => Math.floor(Math.random() * 5));
  const colors = ['#111111', '#1e1b4b', '#3730a3', '#4f46e5', '#6366f1'];

  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {Array.from({ length: weeks }, (_, w) => (
        <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {Array.from({ length: days }, (_, d) => {
            const val = data[w * days + d];
            return (
              <div
                key={d}
                title={`${val} contributions`}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: colors[val],
                  transition: 'opacity 0.2s',
                  cursor: 'default',
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ── COURSE ROW ───────────────────────────────────────────────── */
function CourseRow({
  title,
  domain,
  progress,
  icon: Icon,
  accent,
}: {
  title: string;
  domain: string;
  progress: number;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <motion.div
      whileHover={{ x: 2 }}
      className="flex items-center gap-4 py-3 cursor-pointer group"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
        style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}
      >
        <Icon size={15} style={{ color: accent }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm font-medium truncate" style={{ color: '#e5e5e5' }}>{title}</span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-md flex-shrink-0"
            style={{ background: `${accent}12`, color: accent, border: `1px solid ${accent}25`, fontFamily: 'Geist Mono, monospace' }}
          >
            {domain}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              style={{ background: `linear-gradient(90deg, ${accent}, ${accent}cc)` }}
            />
          </div>
          <span className="text-xs flex-shrink-0 tabular-nums" style={{ color: '#525252', fontFamily: 'Geist Mono, monospace' }}>
            {progress}%
          </span>
        </div>
      </div>
      <button
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}
      >
        <Play size={12} fill="#818cf8" style={{ color: '#818cf8', marginLeft: 1 }} />
      </button>
    </motion.div>
  );
}

/* ── QUEST ROW ────────────────────────────────────────────────── */
function QuestRow({ title, progress, total, xp, done }: { title: string; progress: number; total: number; xp: number; done?: boolean }) {
  const pct = (progress / total) * 100;
  return (
    <div className="flex items-center gap-3 py-2.5">
      {done ? (
        <CheckCircle2 size={15} style={{ color: '#6366f1', flexShrink: 0 }} />
      ) : (
        <Circle size={15} style={{ color: '#2a2a2a', flexShrink: 0 }} />
      )}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium" style={{ color: done ? '#3a3a3a' : '#a3a3a3', textDecoration: done ? 'line-through' : 'none' }}>
            {title}
          </span>
          <span className="text-[10px] font-semibold" style={{ color: '#6366f1', fontFamily: 'Geist Mono, monospace' }}>
            +{xp} XP
          </span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: done ? '#6366f1' : 'rgba(99,102,241,0.4)',
              transition: 'width 1s ease',
            }}
          />
        </div>
      </div>
      <span className="text-[10px] flex-shrink-0" style={{ color: '#404040', fontFamily: 'Geist Mono, monospace' }}>
        {progress}/{total}
      </span>
    </div>
  );
}

/* ── LEADERBOARD ROW ──────────────────────────────────────────── */
function LeaderboardRow({ rank, name, xp, avatar, isYou }: { rank: number; name: string; xp: number; avatar: string; isYou?: boolean }) {
  const medals = ['🥇', '🥈', '🥉'];
  return (
    <div
      className="flex items-center gap-3 py-2.5 px-3 rounded-xl transition-colors"
      style={{
        background: isYou ? 'rgba(99,102,241,0.08)' : 'transparent',
        border: isYou ? '1px solid rgba(99,102,241,0.15)' : '1px solid transparent',
      }}
    >
      <span className="text-sm w-5 text-center flex-shrink-0" style={{ fontFamily: 'Geist Mono, monospace', color: '#404040' }}>
        {rank <= 3 ? medals[rank - 1] : rank}
      </span>
      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${avatar}&backgroundColor=1a1a2e`} alt={name} />
      </div>
      <span className="flex-1 text-xs font-medium truncate" style={{ color: isYou ? '#818cf8' : '#a3a3a3' }}>
        {isYou ? 'You' : name}
      </span>
      <span className="text-[10px] tabular-nums flex-shrink-0" style={{ color: '#525252', fontFamily: 'Geist Mono, monospace' }}>
        {xp.toLocaleString()} XP
      </span>
    </div>
  );
}

/* ── WIDGET SHELL ─────────────────────────────────────────────── */
function Widget({ title, children, action, href }: { title: string; children: React.ReactNode; action?: string; href?: string }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'rgba(10,10,10,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold" style={{ color: '#e5e5e5' }}>{title}</h2>
        {action && href && (
          <Link to={href} className="flex items-center gap-1 text-xs transition-colors" style={{ color: '#525252' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#818cf8')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#525252')}>
            {action} <ArrowRight size={10} />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* ──────────────────── MAIN DASHBOARD ────────────────────────────── */
/* ─────────────────────────────────────────────────────────────────── */
const HOURS = new Date().getHours();
const GREETING = HOURS < 12 ? 'Good morning' : HOURS < 18 ? 'Good afternoon' : 'Good evening';

const SPARKLINE_DATA = [820, 950, 790, 1100, 1340, 980, 1450, 1230, 1680, 1840];

export function Dashboard() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-6 pb-8">
      {/* ── HERO GREETING ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm" style={{ color: '#525252' }}>{GREETING}</p>
            <span style={{ fontSize: '13px', color: '#403020' }}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-[-0.03em]" style={{ color: '#f5f5f5' }}>
            Welcome back, <span style={{
              background: 'linear-gradient(135deg, #818cf8, #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Developer</span> 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#525252' }}>
            You're in the top 5% of learners this week. Keep it up.
          </p>
        </div>

        {/* Quick action */}
        <Link to="/app/battles">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              color: '#fff',
              boxShadow: '0 0 0 1px rgba(99,102,241,0.4), 0 4px 16px rgba(99,102,241,0.25)',
            }}
          >
            <Zap size={14} fill="currentColor" />
            Quick Battle
          </motion.button>
        </Link>
      </motion.div>

      {/* ── STATS ROW ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Day Streak"        value={14}     suffix="d"  icon={Flame}      accent="#f97316" trend="+2d"   delay={0}    />
        <StatCard label="Total XP Earned"   value={12450}  suffix=""   icon={Trophy}     accent="#6366f1" trend="+840"  delay={0.06} />
        <StatCard label="Courses Completed" value={8}      suffix=""   icon={BookOpen}   accent="#22c55e" delay={0.12} />
        <StatCard label="Global Rank"       value={1024}   suffix=""   icon={Star}       accent="#fbbf24" trend="↑12"   delay={0.18} />
      </div>

      {/* ── MAIN 2-COL GRID ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* LEFT COL — 2/3 */}
        <div className="lg:col-span-2 space-y-5">

          {/* XP & Level Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{ background: 'rgba(10,10,10,0.8)', border: '1px solid rgba(99,102,241,0.15)' }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 60% 60% at 80% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)',
              }}
            />
            <div className="flex items-center gap-8 relative z-10 flex-wrap">
              <XPRing pct={83} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', fontFamily: 'Geist Mono, monospace' }}>
                    Level 42
                  </span>
                  <span className="text-[10px]" style={{ color: '#404040' }}>→</span>
                  <span className="text-[10px]" style={{ color: '#404040', fontFamily: 'Geist Mono, monospace' }}>Level 43</span>
                </div>
                <h2 className="text-xl font-bold mb-1" style={{ color: '#f5f5f5' }}>Senior Architect</h2>
                <p className="text-sm mb-4" style={{ color: '#525252' }}>2,550 XP remaining to unlock Level 43</p>

                {/* XP bar */}
                <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '83%' }}
                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                    style={{ background: 'linear-gradient(90deg, #6366f1, #818cf8, #a78bfa)' }}
                  />
                </div>
                <div className="flex justify-between text-xs" style={{ color: '#404040', fontFamily: 'Geist Mono, monospace' }}>
                  <span>12,450 XP</span>
                  <span>15,000 XP</span>
                </div>
              </div>

              {/* Sparkline */}
              <div className="hidden sm:flex flex-col items-center gap-1">
                <Sparkline data={SPARKLINE_DATA} />
                <span className="text-[10px]" style={{ color: '#404040' }}>XP / day</span>
              </div>
            </div>
          </motion.div>

          {/* Continue Learning */}
          <Widget title="Continue Learning" action="View all" href="/app/courses">
            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              <CourseRow title="Advanced Rust Concurrency"   domain="Systems"      progress={68} icon={Cpu}   accent="#f97316" />
              <CourseRow title="Microservices with Go"       domain="Architecture" progress={32} icon={Code2} accent="#6366f1" />
              <CourseRow title="TypeScript Generics Deep Dive" domain="Frontend"   progress={91} icon={Code2} accent="#22c55e" />
            </div>
          </Widget>

          {/* Activity Heatmap */}
          <Widget title="Coding Activity — Last 6 Months">
            <div className="overflow-x-auto pb-1">
              <ActivityHeatmap />
            </div>
            <div className="flex items-center justify-end gap-2 mt-3">
              <span className="text-[10px]" style={{ color: '#404040' }}>Less</span>
              {['#111', '#1e1b4b', '#3730a3', '#4f46e5', '#6366f1'].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
              ))}
              <span className="text-[10px]" style={{ color: '#404040' }}>More</span>
            </div>
          </Widget>
        </div>

        {/* RIGHT COL — 1/3 */}
        <div className="space-y-5">
          {/* Daily Quests */}
          <Widget title="Daily Quests">
            <div className="space-y-1">
              <QuestRow title="Complete 2 Lessons"   progress={1} total={2} xp={50}  />
              <QuestRow title="Win a Battle"         progress={0} total={1} xp={100} />
              <QuestRow title="Help in Forum"        progress={3} total={3} xp={75}  done />
              <QuestRow title="Run 5 Code Challenges" progress={4} total={5} xp={60}  />
            </div>
            <div
              className="mt-4 pt-4 flex justify-between items-center"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              <span className="text-xs" style={{ color: '#525252' }}>Daily progress</span>
              <span className="text-xs font-semibold" style={{ color: '#6366f1', fontFamily: 'Geist Mono, monospace' }}>125 / 285 XP</span>
            </div>
          </Widget>

          {/* Global Leaderboard Mini */}
          <Widget title="Global Top" action="Full board" href="/app/leaderboard">
            <div className="space-y-0.5">
              <LeaderboardRow rank={1} name="alex_code"   xp={98240} avatar="alex"   />
              <LeaderboardRow rank={2} name="priya_dev"   xp={94180} avatar="priya"  />
              <LeaderboardRow rank={3} name="kenji_sys"   xp={91330} avatar="kenji"  />
              <div className="my-2" style={{ borderTop: '1px dashed rgba(255,255,255,0.05)' }} />
              <LeaderboardRow rank={1024} name="you" xp={12450} avatar="Felix" isYou />
            </div>
          </Widget>

          {/* Upcoming Events */}
          <Widget title="Upcoming Events">
            <div className="space-y-3">
              {[
                { title: 'Weekly Algorithm Battle', time: 'Today, 8:00 PM', accent: '#ef4444', type: 'Battle' },
                { title: 'System Design AMA',        time: 'Tomorrow, 2:00 PM', accent: '#6366f1', type: 'Live' },
                { title: 'Rust Workshop Series',     time: 'Fri, 6:00 PM',  accent: '#f97316', type: 'Course' },
              ].map((ev, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: ev.accent, boxShadow: `0 0 6px ${ev.accent}` }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: '#a3a3a3' }}>{ev.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock size={9} style={{ color: '#404040' }} />
                      <span className="text-[10px]" style={{ color: '#404040' }}>{ev.time}</span>
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded-full"
                        style={{ background: `${ev.accent}14`, color: ev.accent, border: `1px solid ${ev.accent}25`, fontFamily: 'Geist Mono, monospace' }}
                      >
                        {ev.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Widget>
        </div>
      </div>
    </div>
  );
}

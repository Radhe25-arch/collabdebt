import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Icons from '@/assets/icons';

// ── Badge ──────────────────────────────────────────────────────────────────────
function Badge({ children, color = 'blue' }) {
  const colors = {
    blue:  'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colors[color]}`}>
      {children}
    </span>
  );
}

// ── StatCard ───────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, accent = 'blue' }) {
  const accents = {
    blue:   'text-blue-600 bg-blue-50',
    green:  'text-green-600 bg-green-50',
    amber:  'text-amber-600 bg-amber-50',
    purple: 'text-purple-600 bg-purple-50',
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${accents[accent]}`}>
        <Icon size={18} />
      </div>
      <div className="text-2xl font-bold text-slate-900 font-display">{value}</div>
      <div className="text-sm font-semibold text-slate-700 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}

// ── FeatureCard ────────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, accent = 'blue', badge }) {
  const accents = {
    blue:   'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    green:  'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white',
    amber:  'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
    purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
  };
  const badgeColors = { blue: 'blue', green: 'green', amber: 'amber', purple: 'blue' };
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg transition-all cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${accents[accent]}`}>
          <Icon size={20} />
        </div>
        {badge && <Badge color={badgeColors[accent]}>{badge}</Badge>}
      </div>
      <h3 className="font-display font-bold text-slate-900 text-base mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

// ── LiveActivity ticker ────────────────────────────────────────────────────────
function LiveActivity() {
  const items = [
    { user: 'Arjun S.',  action: 'won a 1v1 battle',          xp: '+300 XP',  avatar: 'AS', color: 'bg-blue-600' },
    { user: 'Neha K.',   action: 'reached Level 5 in Python', xp: 'BADGE',    avatar: 'NK', color: 'bg-green-600' },
    { user: 'Marco D.',  action: 'solved Linked List',        xp: '+50 XP',   avatar: 'MD', color: 'bg-amber-600' },
    { user: 'Sofia R.',  action: 'enrolled in Go course',     xp: 'ENROLLED', avatar: 'SR', color: 'bg-purple-600' },
    { user: 'Alex M.',   action: 'hit a 14-day streak',       xp: '+200 XP',  avatar: 'AM', color: 'bg-blue-600' },
    { user: 'Priya J.',  action: 'entered top 10 global',     xp: '#9 RANK',  avatar: 'PJ', color: 'bg-green-600' },
  ];
  return (
    <div className="overflow-hidden border-y border-slate-100 bg-white py-3">
      <motion.div
        animate={{ x: [0, -1500] }}
        transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
        className="flex gap-8 whitespace-nowrap"
      >
        {[...items, ...items, ...items].map((a, i) => (
          <div key={i} className="flex items-center gap-2.5 text-sm">
            <div className={`w-6 h-6 rounded-full ${a.color} text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0`}>
              {a.avatar}
            </div>
            <span className="font-semibold text-slate-700">{a.user}</span>
            <span className="text-slate-400">{a.action}</span>
            <span className="text-blue-600 font-semibold text-xs bg-blue-50 px-2 py-0.5 rounded-full">{a.xp}</span>
            <span className="text-slate-200 mx-2">·</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ── Dashboard Preview mock ─────────────────────────────────────────────────────
function DashboardPreview() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden select-none">
      {/* Window chrome */}
      <div className="h-9 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <div className="ml-3 bg-slate-200 rounded h-5 flex items-center px-2 max-w-[200px] w-full">
          <span className="text-slate-400 text-[10px] font-mono truncate">skillforge.io/dashboard</span>
        </div>
      </div>

      <div className="flex" style={{ minHeight: 320 }}>
        {/* Mini sidebar */}
        <div className="w-14 bg-white border-r border-slate-100 flex flex-col items-center py-4 gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
            <Icons.Code size={14} className="text-white" />
          </div>
          {[Icons.Home, Icons.Book, Icons.Zap, Icons.Trophy, Icons.Users].map((Ic, idx) => (
            <div
              key={idx}
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${idx === 0 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300'}`}
            >
              <Ic size={14} />
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="flex-1 p-4 bg-slate-50/60">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-bold text-slate-900">Good morning, Arjun 👋</div>
              <div className="text-xs text-slate-400">14-day streak · Rank #12</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">AS</div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: 'XP Total',     val: '42,900', color: 'text-blue-600' },
              { label: 'Battles Won',  val: '142',    color: 'text-green-600' },
              { label: 'Global Rank',  val: '#12',    color: 'text-amber-600' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 p-2.5 shadow-sm">
                <div className={`text-base font-bold font-display ${s.color}`}>{s.val}</div>
                <div className="text-[10px] text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Quest */}
          <div className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm mb-2">
            <div className="flex items-center gap-2 mb-2">
              <Icons.Target size={13} className="text-blue-600" />
              <span className="text-xs font-semibold text-slate-700">Active Quest</span>
              <span className="ml-auto text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">2/3</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '66%' }}
                transition={{ delay: 1, duration: 1.4, ease: 'easeOut' }}
                className="h-full bg-blue-600 rounded-full"
              />
            </div>
          </div>

          {/* Live battle */}
          <div className="bg-white rounded-xl border border-red-100 p-3 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700">Live Battle</span>
            <span className="text-[10px] text-slate-400 ml-auto font-mono">vs ShadowCoder — 02:44</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Testimonial ────────────────────────────────────────────────────────────────
function Testimonial({ quote, name, role, avatarColor }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col h-full">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-5">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full ${avatarColor} text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}>
          {name[0]}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-800">{name}</div>
          <div className="text-xs text-slate-400">{role}</div>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  // Animated counters
  const [count, setCount] = useState({ users: 0, battles: 0, courses: 0 });
  useEffect(() => {
    const targets = { users: 24700, battles: 183000, courses: 48 };
    const duration = 1800;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCount({
        users:   Math.round(targets.users   * e),
        battles: Math.round(targets.battles * e),
        courses: Math.round(targets.courses * e),
      });
      if (p < 1) requestAnimationFrame(tick);
    };
    const t = setTimeout(() => requestAnimationFrame(tick), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:shadow-blue-200 transition-shadow">
              <Icons.Code size={15} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-slate-900 tracking-tight">SkillForge</span>
          </motion.button>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Curriculum',  to: '/courses' },
              { label: 'Speed Test',  to: '/typing-test' },
              { label: '1v1 Arena',   to: '/battles' },
              { label: 'AI Mentor',   to: '/mentor',       badge: 'PRO' },
              { label: 'Leaderboard', to: '/leaderboard' },
              { label: 'Community',   to: '/community' },
            ].map(({ label, to, badge }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                {label}
                {badge && (
                  <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded-full leading-none">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors px-3 py-2"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:shadow-blue-200 transition-all"
            >
              Get started free
            </button>
          </motion.div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative overflow-hidden pt-20 pb-20 px-6">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Copy */}
            <motion.div style={{ y: heroY }} className="flex-1 text-center lg:text-left">

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <Badge color="blue">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse inline-block" />
                  24,000+ developers competing live
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-display font-black text-slate-900 leading-tight mb-5"
                style={{ fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)' }}
              >
                Level up your coding<br />
                <span className="text-blue-600 animate-shimmer-text">through competition.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
              >
                Real-time 1v1 battles, structured courses, and an AI mentor that knows your skill gaps. Built for developers who learn by doing.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-3 justify-center lg:justify-start"
              >
                <button
                  onClick={() => navigate('/register')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-xl shadow-md hover:shadow-blue-200 transition-all text-sm flex items-center gap-2"
                >
                  Start for free
                  <Icons.ChevronRight size={16} />
                </button>
                <button
                  onClick={() => navigate('/courses')}
                  className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-7 py-3.5 rounded-xl border border-slate-200 transition-all text-sm flex items-center gap-2 shadow-sm"
                >
                  <Icons.Book size={16} className="text-slate-400" />
                  Browse courses
                </button>
              </motion.div>

              {/* Social proof avatars */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-3 mt-8 justify-center lg:justify-start"
              >
                <div className="flex -space-x-2">
                  {['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500', 'bg-red-500'].map((c, i) => (
                    <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white flex items-center justify-center text-[9px] text-white font-bold`}>
                      {['A','N','M','S','P'][i]}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-slate-400">
                  Join <span className="font-semibold text-slate-700">24,700+</span> developers
                </span>
              </motion.div>
            </motion.div>

            {/* Dashboard preview */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 w-full max-w-lg mx-auto"
            >
              <DashboardPreview />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── LIVE TICKER ── */}
      <LiveActivity />

      {/* ── STATS ── */}
      <section className="py-16 px-6 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { label: 'Developers',    value: count.users.toLocaleString()   + '+', icon: Icons.Users,  accent: 'blue',   sub: 'Active this month' },
              { label: 'Battles Fought',value: count.battles.toLocaleString() + '+', icon: Icons.Zap,    accent: 'green',  sub: 'Since launch' },
              { label: 'Courses',       value: count.courses + '',                    icon: Icons.Book,   accent: 'amber',  sub: '8 languages covered' },
              { label: 'Avg Rating',    value: '4.9 ★',                              icon: Icons.Trophy, accent: 'purple', sub: 'From 2,400 reviews' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <StatCard {...s} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge color="blue">Everything you need</Badge>
            <h2 className="font-display font-black text-slate-900 text-3xl md:text-4xl mt-4 mb-3">
              One platform. Every edge.
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-base leading-relaxed">
              From structured learning to live battles — the only coding platform built around actual competition.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Icons.Zap,      title: '1v1 Real-time Battles',  desc: 'Challenge opponents in live coding duels. Ranked matchmaking, ELO rating, and post-battle replays.',          accent: 'blue',   badge: 'Popular' },
              { icon: Icons.Book,     title: 'Structured Curriculum',   desc: 'Topic-by-topic courses across Python, JS, Go, Rust and more. Built around what interviews actually ask.',      accent: 'green' },
              { icon: Icons.Terminal, title: 'AI Mentor',               desc: 'Your personal coach that knows your weak spots, suggests targeted practice, and reviews your code in depth.',  accent: 'purple', badge: 'Beta' },
              { icon: Icons.Trophy,   title: 'Tournaments',             desc: 'Weekly bracket tournaments with global leaderboards and prizes. Beginner to elite divisions.',                 accent: 'amber' },
              { icon: Icons.Target,   title: 'Quests & XP',             desc: 'Daily and weekly challenges keep your streak alive and your skills sharp. Every action earns XP.',            accent: 'blue' },
              { icon: Icons.Users,    title: 'Community & Rooms',       desc: 'Study rooms, peer reviews, and a feed of developers sharing solutions and learning in public.',                accent: 'green' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <FeatureCard {...f} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI MENTOR CALLOUT ── */}
      <section className="py-20 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-14">

          {/* Code panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full max-w-lg"
          >
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-700">
              <div className="h-9 flex items-center px-4 gap-2 border-b border-slate-700/60 bg-slate-800">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-slate-400 text-xs font-mono">ai_mentor.js</span>
              </div>
              <div className="p-5 font-mono text-sm leading-loose">
                <div className="text-slate-500">{'// AI Suggestion: optimization detected'}</div>
                <div className="mt-2">
                  <span className="text-purple-400">const </span>
                  <span className="text-blue-300">efficiency</span>
                  <span className="text-slate-300"> = (base, load) =&gt; {'{'}</span>
                </div>
                <div className="ml-5 text-slate-300">
                  <span className="text-blue-300">return </span>
                  base * Math.pow(Math.E, -0.12 * load);
                </div>
                <div className="text-slate-300">{'};'}</div>
                <div className="mt-5 p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icons.Terminal size={11} className="text-white" />
                    </div>
                    <p className="text-blue-200 text-xs leading-relaxed">
                      This reduces memory overhead by <span className="font-bold text-blue-300">22%</span> vs your last attempt. Want to apply the refactor?
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => navigate('/mentor')}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                    >
                      Apply fix
                    </button>
                    <button
                      onClick={() => navigate('/mentor')}
                      className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-lg font-medium transition-colors"
                    >
                      Explain more
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-5"
          >
            <Badge color="blue">AI Mentor — Beta</Badge>
            <h2 className="font-display font-black text-slate-900 text-3xl md:text-4xl leading-tight">
              A mentor that actually<br />understands your code.
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Not just a linter. Your AI Mentor tracks your patterns across every session, identifies recurring mistakes, and nudges you toward senior-level thinking.
            </p>
            <ul className="space-y-3">
              {[
                'Personalized weak-spot detection',
                'Code review with reasoning, not just errors',
                'Suggested problems based on your skill gaps',
                'Progress graph across languages and topics',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icons.Check size={11} className="text-blue-600" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow-blue-200 transition-all text-sm flex items-center gap-2"
            >
              Try AI Mentor free
              <Icons.ChevronRight size={15} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge color="green">Testimonials</Badge>
            <h2 className="font-display font-black text-slate-900 text-3xl mt-4">
              What developers say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                quote: 'SkillForge is the only platform where I feel real competitive pressure. Within 3 weeks I went from struggling with arrays to confidently solving graph problems.',
                name: 'Arjun Shah', role: 'SDE at Swiggy', avatarColor: 'bg-blue-600',
              },
              {
                quote: 'The AI Mentor figured out I was bad at recursion before I did. It kept quietly serving me recursion problems until I was solid. Sneaky and effective.',
                name: 'Neha Kulkarni', role: 'CS Grad, IIT Bombay', avatarColor: 'bg-green-600',
              },
              {
                quote: 'I prepped for FAANG interviews mostly on SkillForge. Battle mode trains you to think fast under pressure — nothing else really does that.',
                name: 'Marco Diaz', role: 'Software Engineer, Google', avatarColor: 'bg-amber-600',
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex"
              >
                <Testimonial {...t} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-100">
              <Icons.Code size={24} className="text-white" />
            </div>
            <h2 className="font-display font-black text-slate-900 text-4xl md:text-5xl leading-tight mb-4">
              Your skills deserve<br />
              <span className="text-blue-600">proof.</span>
            </h2>
            <p className="text-slate-500 text-base mb-8 max-w-md mx-auto leading-relaxed">
              Stop collecting certificates. Start building a portfolio that speaks for itself.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => navigate('/register')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md hover:shadow-blue-200 transition-all text-sm flex items-center gap-2"
              >
                Create free account
                <Icons.ChevronRight size={16} />
              </button>
              <button
                onClick={() => navigate('/battles')}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-3.5 rounded-xl transition-all text-sm flex items-center gap-2"
              >
                <Icons.Zap size={15} />
                Watch a live battle
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-5">No credit card. No BS. Just code.</p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-50 border-t border-slate-100 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">

            {/* Brand */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                  <Icons.Code size={13} className="text-white" />
                </div>
                <span className="font-display font-bold text-slate-900">SkillForge</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                The competitive coding platform for developers who want to grow fast.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
              {[
                { heading: 'Product', links: [
                  { label: 'Courses',     to: '/courses' },
                  { label: '1v1 Arena',   to: '/battles' },
                  { label: 'Tournaments', to: '/tournaments' },
                  { label: 'AI Mentor',   to: '/mentor' },
                  { label: 'Leaderboard', to: '/leaderboard' },
                ]},
                { heading: 'Community', links: [
                  { label: 'Community', to: '/community' },
                  { label: 'Friends',   to: '/friends' },
                  { label: 'Quests',    to: '/quests' },
                  { label: 'Rooms',     to: '/rooms' },
                ]},
                { heading: 'Account', links: [
                  { label: 'Sign in',  to: '/login' },
                  { label: 'Register', to: '/register' },
                  { label: 'Settings', to: '/settings' },
                  { label: 'Portfolio',to: '/portfolio' },
                ]},
              ].map(({ heading, links }) => (
                <div key={heading}>
                  <div className="font-semibold text-slate-700 mb-3">{heading}</div>
                  <ul className="space-y-2">
                    {links.map(({ label, to }) => (
                      <li key={label}>
                        <Link to={to} className="text-slate-400 hover:text-slate-700 transition-colors">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-100">
            <p className="text-xs text-slate-400">© 2026 SkillForge. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-slate-400">
              <a href="#" className="hover:text-slate-700 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Documentation</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

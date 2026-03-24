import { useNavigate } from 'react-router-dom';
import Icons from '@/assets/icons';

const STATS = [
  { value: '48,291', label: 'Developers' },
  { value: '127',    label: 'Free Courses' },
  { value: '312',    label: 'Tournaments' },
  { value: '2.1M',   label: 'XP Earned' },
  { value: '100%',   label: 'Free Forever' },
];

const LANGUAGES = [
  { slug: 'javascript', label: 'JavaScript',    icon: Icons.Code,     color: '#F7DF1E', bg: 'rgba(247,223,30,0.1)',    border: 'rgba(247,223,30,0.25)' },
  { slug: 'python',     label: 'Python',         icon: Icons.Terminal, color: '#4B8BBE', bg: 'rgba(75,139,190,0.12)',   border: 'rgba(75,139,190,0.3)'  },
  { slug: 'cpp',        label: 'C++',             icon: Icons.Code,     color: '#6db3f2', bg: 'rgba(109,179,242,0.1)',   border: 'rgba(109,179,242,0.25)'},
  { slug: 'java',       label: 'Java',            icon: Icons.Terminal, color: '#ED8B00', bg: 'rgba(237,139,0,0.1)',     border: 'rgba(237,139,0,0.25)'  },
  { slug: 'typescript', label: 'TypeScript',      icon: Icons.Code,     color: '#3178C6', bg: 'rgba(49,120,198,0.1)',    border: 'rgba(49,120,198,0.25)' },
  { slug: 'rust',       label: 'Rust',            icon: Icons.Shield,   color: '#CE422B', bg: 'rgba(206,66,43,0.1)',     border: 'rgba(206,66,43,0.25)'  },
  { slug: 'go',         label: 'Go',              icon: Icons.Terminal, color: '#00ACD7', bg: 'rgba(0,172,215,0.1)',     border: 'rgba(0,172,215,0.25)'  },
  { slug: 'kotlin',     label: 'Kotlin',          icon: Icons.Code,     color: '#7F52FF', bg: 'rgba(127,82,255,0.1)',    border: 'rgba(127,82,255,0.25)' },
  { slug: 'swift',      label: 'Swift',           icon: Icons.Code,     color: '#FA7343', bg: 'rgba(250,115,67,0.1)',    border: 'rgba(250,115,67,0.25)' },
  { slug: 'c',          label: 'C',               icon: Icons.Terminal, color: '#9e9e9e', bg: 'rgba(158,158,158,0.08)', border: 'rgba(158,158,158,0.2)' },
  { slug: 'dsa',        label: 'Data Structures', icon: Icons.Target,   color: '#00D9B5', bg: 'rgba(0,217,181,0.1)',     border: 'rgba(0,217,181,0.25)'  },
  { slug: 'web-dev',    label: 'Web Dev',          icon: Icons.Globe,    color: '#9D65F5', bg: 'rgba(157,101,245,0.1)',   border: 'rgba(157,101,245,0.25)'},
  { slug: 'sql',        label: 'SQL',              icon: Icons.Book,     color: '#E48E00', bg: 'rgba(228,142,0,0.1)',     border: 'rgba(228,142,0,0.25)'  },
  { slug: 'bash',       label: 'Bash / Shell',     icon: Icons.Terminal, color: '#4EAA25', bg: 'rgba(78,170,37,0.1)',     border: 'rgba(78,170,37,0.25)'  },
  { slug: 'php',        label: 'PHP',              icon: Icons.Code,     color: '#8892BF', bg: 'rgba(136,146,191,0.1)',   border: 'rgba(136,146,191,0.25)'},
  { slug: 'ruby',       label: 'Ruby',             icon: Icons.Code,     color: '#CC342D', bg: 'rgba(204,52,45,0.1)',     border: 'rgba(204,52,45,0.25)'  },
];

const FEATURES = [
  { icon: Icons.Zap,       title: 'XP & Leveling',       desc: 'Every lesson, quiz and challenge earns XP. Progress through 10 tiers — Beginner to Legend — with a live bar tracking each milestone.' },
  { icon: Icons.Leaderboard, title: 'Live Leaderboards',  desc: 'Global, weekly, and per-language rankings. Your position updates in real time. Even rank #2000 is visible — nobody disappears.' },
  { icon: Icons.Target,    title: 'Accuracy Tracking',    desc: 'Every answer logs your hit rate. Watch your accuracy improve per language with breakdowns on your public profile.' },
  { icon: Icons.Clock,     title: 'Speed Metrics',        desc: 'Time-per-problem, average completion speed, tournament response times. Every millisecond is on record.' },
  { icon: Icons.Tournament,title: 'Weekly Tournaments',   desc: 'Three formats every Monday: Coding Challenge, Quiz Battle, Speed Course. Free entry. Real competition. Permanent winner badges.' },
  { icon: Icons.TrendingUp,title: 'Progress Analytics',   desc: 'GitHub-style heatmaps, streak counters, skill radar charts. One shareable public profile with everything you\'ve earned.' },
];

const LB_PREVIEW = [
  { rank: 1, username: 'sarthak_k',   level: 42, xp: 24880, lang: 'Rust',       label: 'Legend',    acc: 96 },
  { rank: 2, username: 'priya_react', level: 38, xp: 22410, lang: 'TypeScript', label: 'Expert',    acc: 93 },
  { rank: 3, username: 'arjun_m',     level: 31, xp: 19350, lang: 'Python',     label: 'Pro',       acc: 91 },
  { rank: 4, username: 'neha_v',      level: 24, xp: 14200, lang: 'Go',         label: 'Developer', acc: 88 },
];

const TESTIMONIALS = [
  { name: 'Rahul K.', role: 'Frontend Dev · Mumbai',     text: 'Went from zero JS to landing my first frontend role in 7 months. Tournaments kept me accountable — you cannot fake an accuracy score.', lang: 'JavaScript', level: 'Lv 22' },
  { name: 'Priya S.', role: 'CS Student · Bangalore',    text: 'The leaderboard is genuinely dangerous. I ended up grinding 2 extra hours of Python just to beat my friend. Level 29 in 4 months.',   lang: 'Python',     level: 'Lv 29' },
  { name: 'Amit N.',  role: 'Working Professional · Delhi', text: 'Every other platform charges thousands. SkillForge gave me DSA, Rust basics, and three tournament wins — completely free.',           lang: 'DSA',        level: 'Lv 18' },
];

function RankIcon({ rank }) {
  const medals = {
    1: { bg: 'rgba(255,215,0,0.12)',   border: 'rgba(255,215,0,0.3)',   color: '#FFD700' },
    2: { bg: 'rgba(192,192,192,0.12)', border: 'rgba(192,192,192,0.3)', color: '#C0C0C0' },
    3: { bg: 'rgba(205,127,50,0.12)',  border: 'rgba(205,127,50,0.3)',  color: '#CD7F32' },
  };
  const m = medals[rank];
  if (m) return (
    <div style={{ width:32, height:32, borderRadius:'50%', background:m.bg, border:`1px solid ${m.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      <Icons.Trophy size={13} style={{ color: m.color }} />
    </div>
  );
  return (
    <div style={{ width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      <span className="font-mono text-xs text-arena-dim">#{rank}</span>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-arena-bg text-arena-text font-body">

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 bg-arena-bg/92 backdrop-blur-lg border-b border-arena-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-purple-teal flex items-center justify-center">
            <Icons.Code size={13} className="text-white" />
          </div>
          <span className="font-display font-bold text-base text-gradient tracking-tight">SkillForge</span>
        </div>
        <div className="hidden md:flex items-center gap-0.5">
          {[['Languages','#languages'],['Features','#features'],['Leaderboard','#leaderboard'],['Tournaments','#tournaments']].map(([l,h]) => (
            <a key={l} href={h} className="font-mono text-xs text-arena-muted hover:text-arena-text transition-colors px-3 py-2 rounded-md hover:bg-arena-bg3">{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/login')}    className="btn-secondary text-xs px-4 py-2">Log In</button>
          <button onClick={() => navigate('/register')} className="btn-primary  text-xs px-4 py-2">Get Started</button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-14 overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-arena-purple/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4  w-[300px] h-[300px] rounded-full bg-arena-teal/5  blur-3xl pointer-events-none" />
        <div className="absolute top-1/2  right-1/4  w-[250px] h-[250px] rounded-full bg-arena-purple/4 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-arena-purple/10 border border-arena-border rounded-full px-4 py-1.5 mb-8 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-arena-teal animate-pulse" />
            <span className="font-mono text-xs text-arena-purple2 tracking-widest">12,847 DEVS ONLINE NOW</span>
          </div>

          <h1 className="font-display font-black leading-none mb-6 animate-fade-up delay-100"
              style={{ fontSize: 'clamp(40px,7vw,78px)', letterSpacing: '-3px' }}>
            Your Free Path to<br />
            <span className="text-gradient">Tech Mastery.</span>
          </h1>

          <p className="text-arena-muted leading-relaxed mb-10 animate-fade-up delay-200 max-w-lg mx-auto"
             style={{ fontSize: '17px' }}>
            Learn every coding language on the planet — structured courses, live competitions,
            XP that actually means something. Zero cost. No catch.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap animate-fade-up delay-300">
            <button onClick={() => navigate('/register')} className="btn-primary px-8 py-3.5 text-base glow-purple">
              <Icons.ArrowRight size={16} /> Start Learning Free
            </button>
            <button onClick={() => navigate('/courses')} className="btn-secondary px-8 py-3.5 text-base">
              <Icons.Book size={16} /> Browse Languages
            </button>
          </div>

          {/* XP demo card */}
          <div className="mt-14 max-w-sm mx-auto animate-fade-up delay-400">
            <div className="arena-card p-4 text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icons.Zap size={14} className="text-arena-purple2" />
                  <span className="font-mono text-xs text-arena-purple2 font-bold">Level 7 · Developer</span>
                </div>
                <span className="font-mono text-xs text-arena-dim">3,420 / 5,000 XP</span>
              </div>
              <div className="xp-bar-track"><div className="xp-bar-fill" style={{ width: '68%' }} /></div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="badge-tag badge-purple"><Icons.Fire size={10} /> 7-day streak</span>
                <span className="badge-tag badge-teal"><Icons.Trophy size={10} /> Top 10 this week</span>
                <span className="badge-tag badge-gold"><Icons.Award size={10} /> JS Certified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS TICKER ─── */}
      <div className="bg-arena-bg2 border-y border-arena-border py-5 overflow-hidden">
        <div className="animate-ticker flex gap-16 whitespace-nowrap w-max">
          {[...STATS,...STATS].map((s,i) => (
            <div key={i} className="flex items-center gap-3 flex-shrink-0">
              <span className="font-display font-bold text-xl text-gradient">{s.value}</span>
              <span className="font-mono text-xs text-arena-muted tracking-widest uppercase">{s.label}</span>
              <span className="text-arena-border ml-8">|</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── LANGUAGES ─── */}
      <section id="languages" className="py-24 px-6 bg-arena-bg2 border-b border-arena-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <span className="badge-tag badge-teal font-mono tracking-widest uppercase text-xs mb-4 inline-block">Course Library</span>
              <h2 className="font-display font-black" style={{ fontSize:'clamp(28px,5vw,48px)', letterSpacing:'-1.5px' }}>
                Every Language.<br />All Free.
              </h2>
              <p className="text-arena-muted mt-3 max-w-md text-sm leading-relaxed">
                Structured from first principles. No prerequisites needed for any track.
              </p>
            </div>
            <button onClick={() => navigate('/courses')} className="btn-secondary text-sm">
              View All Courses <Icons.ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {LANGUAGES.map(({ slug, label, icon: Ic, color, bg, border }) => (
              <button key={slug} onClick={() => navigate(`/courses?category=${slug}`)}
                className="arena-card p-4 flex items-center gap-3 text-left group hover:-translate-y-1">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                     style={{ background: bg, border: `1px solid ${border}` }}>
                  <Ic size={15} style={{ color }} />
                </div>
                <div>
                  <span className="font-body text-sm font-medium text-arena-text block">{label}</span>
                  <span className="font-mono text-xs text-arena-dim">Free · All levels</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-tag badge-purple font-mono tracking-widest uppercase text-xs mb-4 inline-block">Platform</span>
            <h2 className="font-display font-black mb-4" style={{ fontSize:'clamp(28px,5vw,48px)', letterSpacing:'-1.5px' }}>
              Built Different.<br />For Developers.
            </h2>
            <p className="text-arena-muted max-w-md mx-auto text-sm leading-relaxed">
              Not another video course you forget in three days. SkillForge is engineered so you actually retain and improve.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Ic, title, desc }) => (
              <div key={title} className="arena-card p-6 group hover:-translate-y-1">
                <div className="w-10 h-10 rounded-lg bg-arena-purple/15 border border-arena-border flex items-center justify-center mb-4 group-hover:bg-arena-purple/25 transition-colors">
                  <Ic size={18} className="text-arena-purple2" />
                </div>
                <h3 className="font-display font-bold text-base mb-2">{title}</h3>
                <p className="text-arena-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 px-6 bg-arena-bg2 border-y border-arena-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-tag badge-teal font-mono tracking-widest uppercase text-xs mb-4 inline-block">How It Works</span>
            <h2 className="font-display font-black" style={{ fontSize:'clamp(28px,5vw,48px)', letterSpacing:'-1.5px' }}>Three Steps. One Goal.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: '01', icon: Icons.Profile,  title: 'Pick Your Language',   desc: 'Choose from 16+ coding languages. Structured path from zero to real projects. No prerequisites, no upsells.' },
              { n: '02', icon: Icons.Zap,      title: 'Learn, Code, Earn XP',  desc: 'Complete lessons and quizzes at your pace. Every action adds XP and updates your accuracy stats.' },
              { n: '03', icon: Icons.Trophy,   title: 'Compete and Rise',      desc: 'Enter weekly tournaments, track your speed and accuracy, climb the leaderboard. Earned, not bought.' },
            ].map(({ n, icon: Ic, title, desc }) => (
              <div key={n} className="arena-card p-6 text-center">
                <div className="font-mono text-xs text-arena-dim tracking-widest mb-4">{n}</div>
                <div className="w-12 h-12 rounded-xl bg-purple-grad flex items-center justify-center mx-auto mb-4 glow-purple">
                  <Ic size={20} className="text-white" />
                </div>
                <h3 className="font-display font-bold text-base mb-2">{title}</h3>
                <p className="text-arena-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LEADERBOARD PREVIEW ─── */}
      <section id="leaderboard" className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="badge-tag badge-gold font-mono tracking-widest uppercase text-xs mb-4 inline-block">Leaderboard</span>
            <h2 className="font-display font-black mb-4" style={{ fontSize:'clamp(28px,5vw,48px)', letterSpacing:'-1.5px' }}>Your Rank.<br />Your Proof.</h2>
            <p className="text-arena-muted mb-4 text-sm leading-relaxed">
              Global rankings, weekly boards, per-language leaderboards.
              Every entry shows accuracy and speed — not just farmed XP.
            </p>
            <p className="text-arena-muted mb-6 text-sm">Weekly boards reset every Monday. Fresh shot at the top, every week.</p>
            <div className="flex flex-wrap gap-2">
              {['Global','Weekly','JavaScript','Python','Rust','Friends'].map((l,i) => (
                <span key={l} className={`badge-tag ${i===0?'badge-purple':'badge-gray'} font-mono text-xs`}>{l}</span>
              ))}
            </div>
          </div>

          <div className="arena-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-arena-border">
              <span className="font-display font-bold text-sm">Global Leaderboard</span>
              <span className="font-mono text-xs text-arena-dim">This Week</span>
            </div>
            <div className="grid grid-cols-4 gap-2 px-5 py-2 border-b border-arena-border/40">
              <span className="col-span-2 font-mono text-xs text-arena-dim uppercase tracking-widest">Developer</span>
              <span className="font-mono text-xs text-arena-dim uppercase tracking-widest text-right">Accuracy</span>
              <span className="font-mono text-xs text-arena-dim uppercase tracking-widest text-right">XP</span>
            </div>
            <div className="divide-y divide-arena-border/40">
              {LB_PREVIEW.map(({ rank, username, level, xp, lang, label, acc }) => (
                <div key={rank} className="flex items-center gap-3 px-5 py-3.5 hover:bg-arena-bg3/50 transition-colors">
                  <RankIcon rank={rank} />
                  <div className="w-7 h-7 rounded-full bg-arena-bg3 border border-arena-border flex items-center justify-center flex-shrink-0">
                    <span className="font-mono text-xs text-arena-muted">{username.slice(0,2).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-arena-text truncate">{username}</p>
                    <p className="font-mono text-xs text-arena-dim">{label} · Lv{level} · {lang}</p>
                  </div>
                  <span className="font-mono text-xs text-arena-teal w-12 text-right">{acc}%</span>
                  <div className="flex items-center gap-1 text-arena-purple2 w-16 justify-end">
                    <Icons.Zap size={10} />
                    <span className="font-mono text-xs font-bold">{xp.toLocaleString()}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-3 px-5 py-3.5 bg-arena-teal/5 border-l-2 border-l-arena-teal">
                <Icons.Target size={14} className="text-arena-teal flex-shrink-0" />
                <div className="w-7 h-7 rounded-full bg-arena-teal/10 border border-arena-border2 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono text-xs text-arena-teal">YO</span>
                </div>
                <div className="flex-1">
                  <p className="font-mono text-xs text-arena-teal">you (rank #847)</p>
                  <p className="font-mono text-xs text-arena-dim">Apprentice · Lv8 · JavaScript</p>
                </div>
                <span className="font-mono text-xs text-arena-teal w-12 text-right">74%</span>
                <div className="flex items-center gap-1 text-arena-teal w-16 justify-end">
                  <Icons.Zap size={10} />
                  <span className="font-mono text-xs font-bold">3,420</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TOURNAMENTS ─── */}
      <section id="tournaments" className="py-24 px-6 bg-arena-bg2 border-y border-arena-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge-tag badge-teal font-mono tracking-widest uppercase text-xs mb-4 inline-block">Tournaments</span>
            <h2 className="font-display font-black" style={{ fontSize:'clamp(28px,5vw,48px)', letterSpacing:'-1.5px' }}>New Tournament.<br />Every Monday.</h2>
            <p className="text-arena-muted mt-4 max-w-md mx-auto text-sm">Three formats. Unlimited entries. Winner badges that never expire.</p>
          </div>
          <div className="arena-card p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 badge-tag badge-teal mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-arena-teal animate-pulse" />
                    <span className="font-mono text-xs">WEEK #47 — ACTIVE NOW</span>
                  </div>
                  <h3 className="font-display font-bold text-xl">3,241 participants competing</h3>
                  <p className="text-arena-muted text-sm mt-1">Ends Sunday 23:59 UTC</p>
                </div>
                <button onClick={() => navigate('/register')} className="btn-teal px-6 py-3">
                  <Icons.Trophy size={15} /> Join Free
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: Icons.Terminal, label: 'Coding Challenge', desc: 'Solve language-specific problems under time pressure.', xp: '+500 XP', metric: 'Best time wins' },
                  { icon: Icons.Target,   label: 'Quiz Battle',       desc: 'Fast-fire questions on syntax, concepts and debugging.',  xp: '+300 XP', metric: 'Accuracy ranked' },
                  { icon: Icons.Zap,      label: 'Speed Course',      desc: 'Complete a mini-module faster than everyone else.',       xp: '+200 XP', metric: 'Speed tracked' },
                ].map(({ icon: Ic, label, desc, xp, metric }) => (
                  <div key={label} className="bg-arena-bg3 border border-arena-border rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Ic size={16} className="text-arena-muted" />
                      <span className="font-mono text-xs font-bold text-arena-text">{label}</span>
                    </div>
                    <p className="text-arena-muted text-xs leading-relaxed mb-3">{desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-arena-teal font-bold">{xp}</span>
                      <span className="font-mono text-xs text-arena-dim">{metric}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 1v1 BATTLE TEASER ─── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="badge-tag badge-red font-mono tracking-widest uppercase text-xs mb-4 inline-block">1v1 Battle Mode</span>
            <h2 className="font-display font-black mb-4" style={{ fontSize:'clamp(28px,5vw,48px)', letterSpacing:'-1.5px' }}>
              Challenge Anyone.<br />Anytime.
            </h2>
            <p className="text-arena-muted mb-6 text-sm leading-relaxed">
              Pick a language, set a timer, and go head-to-head against another dev.
              Your code runs live. Score is based on correctness + speed. Loser's streak takes a hit.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {['Real-time code eval','XP wagered','Accuracy tracked','Streak on the line'].map(f => (
                <span key={f} className="badge-tag badge-gray font-mono text-xs">
                  <Icons.Check size={9} /> {f}
                </span>
              ))}
            </div>
            <button onClick={() => navigate('/register')} className="btn-primary px-6 py-3">
              <Icons.Zap size={15} /> Start a Battle
            </button>
          </div>

          {/* Battle card preview */}
          <div className="arena-card overflow-hidden">
            <div className="px-5 py-3 border-b border-arena-border flex items-center justify-between">
              <span className="font-display font-bold text-sm">Live Battle</span>
              <span className="badge-tag badge-red font-mono text-xs"><span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block mr-1 animate-pulse" />LIVE</span>
            </div>
            <div className="p-5">
              {/* Timer */}
              <div className="text-center mb-5">
                <div className="font-mono font-black text-4xl text-arena-teal" style={{ letterSpacing: '-2px' }}>12:34</div>
                <div className="w-full h-1 bg-arena-bg3 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-arena-teal rounded-full" style={{ width: '41%' }} />
                </div>
              </div>
              {/* Players */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { name: 'sarthak_k', lvl: 42, score: 4, total: 5, acc: 94, you: true },
                  { name: 'priya_r',   lvl: 38, score: 3, total: 5, acc: 88, you: false },
                ].map(p => (
                  <div key={p.name} className={`bg-arena-bg3 border rounded-xl p-3 ${p.you ? 'border-arena-teal/40' : 'border-arena-border'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${p.you ? 'bg-arena-teal/20 text-arena-teal' : 'bg-arena-bg border border-arena-border text-arena-muted'}`}>
                        {p.name.slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className={`font-mono text-xs font-bold ${p.you ? 'text-arena-teal' : 'text-arena-text'}`}>{p.name}{p.you && ' (you)'}</p>
                        <p className="font-mono text-xs text-arena-dim">Lv{p.lvl}</p>
                      </div>
                    </div>
                    <div className="font-mono text-2xl font-black text-arena-text mb-1">{p.score}<span className="text-arena-dim text-sm">/{p.total}</span></div>
                    <div className="xp-bar-track"><div className="xp-bar-fill" style={{ width: `${(p.score/p.total)*100}%` }} /></div>
                    <p className="font-mono text-xs text-arena-dim mt-1">Accuracy: <span className="text-arena-teal">{p.acc}%</span></p>
                  </div>
                ))}
              </div>
              <div className="bg-arena-bg3 rounded-lg p-3 text-center">
                <span className="font-mono text-xs text-arena-dim">Problem 4/5 · </span>
                <span className="font-mono text-xs text-arena-purple2">JavaScript · Hard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 px-6 bg-arena-bg2 border-y border-arena-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge-tag badge-purple font-mono tracking-widest uppercase text-xs mb-4 inline-block">Community</span>
            <h2 className="font-display font-black" style={{ fontSize:'clamp(26px,4vw,40px)', letterSpacing:'-1px' }}>
              From Developers Who Actually Used It
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ name, role, text, lang, level }) => (
              <div key={name} className="arena-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_,i) => <Icons.Star key={i} size={12} className="text-arena-teal" />)}
                  </div>
                  <p className="text-arena-muted text-sm leading-relaxed mb-5">"{text}"</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-arena-border/50">
                  <div className="w-8 h-8 rounded-full bg-arena-purple/20 border border-arena-border flex items-center justify-center flex-shrink-0">
                    <span className="font-mono text-xs text-arena-purple2">{name.slice(0,2).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs text-arena-text">{name}</p>
                    <p className="font-mono text-xs text-arena-dim">{role}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="badge-tag badge-purple font-mono text-xs">{lang}</span>
                    <span className="font-mono text-xs text-arena-dim">{level}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-28 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="badge-tag badge-teal font-mono tracking-widest uppercase text-xs mb-6 inline-block">Free · No Cards · No Tricks</span>
          <h2 className="font-display font-black mb-4" style={{ fontSize:'clamp(32px,6vw,60px)', letterSpacing:'-2px' }}>
            Pick a Language.<br />Start Today.
          </h2>
          <p className="text-arena-muted mb-10 leading-relaxed">
            Join 48,291 developers already on the platform. Your first lesson is one click away.
          </p>
          <button onClick={() => navigate('/register')} className="btn-primary px-10 py-4 text-base glow-purple">
            <Icons.ArrowRight size={18} /> Create Free Account
          </button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-arena-border bg-arena-bg">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-purple-teal flex items-center justify-center">
                <Icons.Code size={12} className="text-white" />
              </div>
              <span className="font-display font-bold text-sm text-gradient">SkillForge</span>
            </div>
            <p className="font-mono text-xs text-arena-dim leading-relaxed">
              Learn every coding language. Free forever. No paywalls, no ads, no subscriptions.
            </p>
          </div>
          {[
            { h: 'Languages', links: ['JavaScript','Python','C++','Java','TypeScript','Rust','Go','Kotlin'] },
            { h: 'Platform',  links: ['Leaderboard','Tournaments','1v1 Battles','Daily Quests','Hall of Fame'] },
            { h: 'Company',   links: ['About','Blog','Careers','Privacy','Terms'] },
          ].map(({ h, links }) => (
            <div key={h}>
              <h4 className="font-mono text-xs text-arena-dim uppercase tracking-widest mb-4">{h}</h4>
              <ul className="space-y-2">
                {links.map(l => (
                  <li key={l}><a href="#" className="font-body text-xs text-arena-dim hover:text-arena-text transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-arena-border">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3">
            <p className="font-mono text-xs text-arena-dim">© 2025 SkillForge. Built for developers, by developers.</p>
            <div className="flex gap-3">
              {[Icons.Globe, Icons.Code, Icons.Users].map((Ic, i) => (
                <button key={i} className="w-7 h-7 rounded border border-arena-border flex items-center justify-center text-arena-dim hover:text-arena-text hover:border-arena-purple/40 transition-colors">
                  <Ic size={12} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Avatar } from '@/components/ui';
import {
  Zap, BookOpen, Target, Trophy, Play, ArrowRight, Terminal,
  Users, Check, TrendingUp, Flame, ChevronRight
} from 'lucide-react';
import api from '@/lib/api';
import { format, subDays } from 'date-fns';

const LEVEL_NAMES = ['Beginner','Apprentice','Coder','Developer','Senior Dev','Architect','Pro','Expert','Master','Legend'];
const THRESHOLDS  = [0,500,1200,2500,4500,7500,12000,18000,26000,36000];

// ─── ACTIVITY HEATMAP ──────────────────────────────────────
function ActivityHeatmap({ logs }) {
  const days = Array.from({ length: 84 }, (_, i) => subDays(new Date(), 83 - i));
  const logMap = {};
  (logs || []).forEach(l => { logMap[l.date?.slice(0, 10)] = l.xpEarned; });

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  const getColor = d => {
    const key = format(d, 'yyyy-MM-dd');
    const xp = logMap[key] || 0;
    if (!xp)    return 'rgba(255,255,255,0.04)';
    if (xp < 100) return 'rgba(59,130,246,0.2)';
    if (xp < 300) return 'rgba(59,130,246,0.4)';
    if (xp < 600) return 'rgba(59,130,246,0.65)';
    return '#3B82F6';
  };

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto pb-2 custom-scrollbar">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map(day => (
              <div
                key={day.toISOString()}
                title={`${format(day, 'MMM d')} — ${logMap[format(day, 'yyyy-MM-dd')] || 0} XP`}
                style={{
                  width: 11, height: 11,
                  background: getColor(day),
                  borderRadius: '2px',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className="font-mono text-[9px] font-bold text-[#444] tracking-[0.15em] uppercase">LESS</span>
        {['rgba(255,255,255,0.04)','rgba(59,130,246,0.2)','rgba(59,130,246,0.4)','rgba(59,130,246,0.65)','#3B82F6'].map((c, i) => (
          <div key={i} style={{ width: 11, height: 11, background: c, borderRadius: '2px' }} />
        ))}
        <span className="font-mono text-[9px] font-bold text-[#444] tracking-[0.15em] uppercase ml-1">MORE</span>
      </div>
    </div>
  );
}

// ─── BLADE STAT CARD ──────────────────────────────────────
function StatCard({ label, value, icon: Icon, accent = 'cyber' }) {
  const accentColors = {
    cyber:   'text-cyber',
    emerald: 'text-emerald',
    violet:  'text-violet',
    amber:   'text-amber-400',
  };
  return (
    <div className="blade p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold text-[#666] uppercase tracking-[0.15em]">{label}</span>
        {Icon && <Icon size={14} strokeWidth={1.5} className={accentColors[accent]} />}
      </div>
      <div className="font-mono font-black text-2xl text-white tracking-tight">{value}</div>
    </div>
  );
}

// ─── COURSE PROGRESS CARD ─────────────────────────────────
function CourseProgressCard({ enrollment, onContinue }) {
  const course = enrollment?.course;
  if (!course) return null;
  return (
    <div
      className="blade p-5 cursor-pointer hover:border-white/20 transition-all duration-150 group"
      onClick={() => onContinue(course.slug)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="font-mono text-[9px] font-bold text-[#444] uppercase tracking-[0.2em]">CONTINUE LEARNING</span>
          <h3 className="font-bold text-base text-white mt-1.5 leading-tight group-hover:text-cyber transition-colors duration-150">
            {course.title}
          </h3>
        </div>
        <div className="w-9 h-9 rounded-[4px] border border-cyber/20 flex items-center justify-center flex-shrink-0 group-hover:border-cyber/40 transition-colors">
          <Play size={14} strokeWidth={1.5} className="text-cyber ml-0.5" />
        </div>
      </div>

      <div className="w-full h-px bg-white/[0.06] mb-4">
        <div className="h-px bg-cyber transition-all duration-500" style={{ width: `${enrollment.progress}%` }} />
      </div>

      <div className="flex justify-between items-center">
        <span className="font-mono text-[11px] font-bold text-[#666] uppercase tracking-wider">
          {enrollment.progress}% COMPLETE
        </span>
        <span className="font-mono text-[11px] font-black text-cyber flex items-center gap-1 group-hover:gap-2 transition-all duration-150">
          RESUME <ArrowRight size={11} strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [tournament, setTournament] = useState(null);
  const [activeBattle, setActiveBattle] = useState(null);
  const [loading, setLoading] = useState(true);

  const lvl    = Math.min(user?.level || 1, 10);
  const xp     = user?.xp || 0;
  const nextXP = THRESHOLDS[lvl] || xp;
  const prevXP = THRESHOLDS[lvl - 1] || 0;
  const xpPct  = Math.min(((xp - prevXP) / (nextXP - prevXP)) * 100, 100);

  useEffect(() => {
    Promise.all([
      api.get('/users/me/stats'),
      api.get('/leaderboard/global?limit=5'),
      api.get('/tournaments/current'),
      api.get('/battles'),
    ]).then(([s, lb, t, b]) => {
      setStats(s.data);
      setTopUsers(lb.data.users || []);
      setMyRank(lb.data.myRank);
      setTournament(t.data.tournament);
      const live = (b.data.battles || []).find(x => ['ACTIVE','PENDING','CONFIGURING'].includes(x.status));
      setActiveBattle(live);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const recentEnrollment = stats?.enrollments
    ?.filter(e => !e.completedAt)
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const lessonsThisWeek = stats?.activityLogs
    ?.filter(l => new Date(l.date) >= weekAgo)
    ?.reduce((s, l) => s + l.lessons, 0) || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 border border-white/10 border-t-cyber rounded-full animate-spin" />
          <span className="font-mono text-[10px] text-[#444] uppercase tracking-[0.2em]">LOADING...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">

      {/* ── Command Header ── */}
      <div className="blade p-6 bg-grid relative overflow-hidden">
        {/* Hairline top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-cyber/30" />
        <div className="flex items-end justify-between flex-wrap gap-4 relative z-10">
          <div>
            <p className="font-mono text-[10px] font-bold text-[#444] uppercase tracking-[0.2em] mb-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}
            </p>
            <h1 className="font-black text-2xl md:text-3xl text-white tracking-tight">
              Welcome back, <span className="text-cyber">{user?.username}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {user?.streak > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 border border-amber-400/20 bg-amber-400/[0.04] rounded-[4px]">
                <Flame size={13} strokeWidth={1.5} className="text-amber-400" />
                <span className="font-mono text-[11px] font-black text-amber-400 uppercase tracking-wider">
                  {user.streak} DAY STREAK
                </span>
              </div>
            )}
            <button
              onClick={() => navigate('/courses')}
              className="btn-primary text-[11px]"
            >
              <BookOpen size={13} strokeWidth={1.5} />
              START COURSE
            </button>
          </div>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="TOTAL XP"       value={xp.toLocaleString()}                         icon={Zap}        accent="amber" />
        <StatCard label="COURSES DONE"   value={user?.coursesCompleted || 0}                  icon={BookOpen}   accent="cyber" />
        <StatCard label="AVG ACCURACY"   value={`${stats?.user?.accuracy || 0}%`}             icon={Target}     accent="emerald" />
        <StatCard label="GLOBAL RANK"    value={myRank ? `#${myRank.toLocaleString()}` : '--'} icon={Trophy}     accent="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left Column ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Active Battle Alert */}
          {activeBattle && (
            <div className="blade p-5 border-l-2 border-l-crimson flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-[4px] border border-crimson/30 flex items-center justify-center flex-shrink-0">
                  <Zap size={16} strokeWidth={1.5} className="text-crimson" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    BATTLE <span className="text-crimson">{activeBattle.status}</span>
                  </h4>
                  <p className="text-xs text-[#666] mt-0.5">
                    Challenge vs {activeBattle.challenger?.username === user?.username
                      ? activeBattle.challenged?.username
                      : activeBattle.challenger?.username}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/battles/${activeBattle.id}`)}
                className="btn-primary whitespace-nowrap"
              >
                JOIN MATCH <ArrowRight size={11} strokeWidth={2} />
              </button>
            </div>
          )}

          {/* Recent Course */}
          {recentEnrollment && (
            <CourseProgressCard
              enrollment={recentEnrollment}
              onContinue={slug => navigate(`/courses/${slug}`)}
            />
          )}

          {/* Activity Heatmap */}
          <div className="blade p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-sm text-white uppercase tracking-tight">LEARNING ACTIVITY</h3>
                <p className="text-[#666] text-xs mt-0.5">XP EARNED — LAST 12 WEEKS</p>
              </div>
            </div>
            <ActivityHeatmap logs={stats?.activityLogs} />
          </div>

          {/* Achievements */}
          <div className="blade p-6">
            <h3 className="font-mono text-[11px] font-black text-white uppercase tracking-[0.1em] mb-5">
              RECENT ACHIEVEMENTS
            </h3>
            {(!stats?.badges || stats.badges.length === 0) ? (
              <div className="p-8 text-center border border-white/[0.04] rounded-[4px]"
                style={{ background: 'rgba(255,255,255,0.01)' }}>
                <p className="font-mono text-[11px] text-[#444] uppercase tracking-wider">
                  NO BADGES YET — COMPLETE COURSES TO UNLOCK
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stats.badges.slice(0, 8).map(({ badge }) => (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center justify-center p-4 border border-white/[0.06] rounded-[4px] hover:border-white/[0.12] transition-all duration-150 text-center"
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                  >
                    <div className="w-10 h-10 rounded-[4px] border border-cyber/20 flex items-center justify-center mb-3">
                      <Trophy size={16} strokeWidth={1.5} className="text-cyber" />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-white leading-tight block uppercase">
                      {badge.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Learning Tracks */}
          <div className="blade p-6">
            <h3 className="font-mono text-[11px] font-black text-white uppercase tracking-[0.1em] mb-5">
              POPULAR LEARNING TRACKS
            </h3>
            <div className="flex flex-wrap gap-2">
              {['JAVASCRIPT','SYSTEM DESIGN','PYTHON','REACT','DEVOPS','RUST','CLOUD','CYBERSECURITY'].map(tag => (
                <button
                  key={tag}
                  onClick={() => navigate('/courses')}
                  className="px-3 py-1.5 rounded-[4px] border border-white/[0.08] bg-white/[0.02] font-mono text-[10px] font-bold text-[#666] hover:border-cyber/30 hover:text-cyber hover:bg-cyber/[0.04] transition-all duration-150 tracking-wider"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: Terminal, label: 'AI MENTOR', desc: 'Debug with AI', to: '/mentor', accent: 'cyber' },
              { icon: Users,    label: 'MULTIPLAYER', desc: 'Collaborate live', to: '/rooms', accent: 'violet' },
              { icon: Target,   label: 'DAILY QUESTS', desc: 'Earn bonus XP', to: '/quests', accent: 'emerald' },
            ].map(({ icon: Icon, label, desc, to, accent }) => (
              <div
                key={to}
                onClick={() => navigate(to)}
                className="blade p-5 cursor-pointer hover:border-white/20 transition-all duration-150 group flex flex-col"
              >
                <div className={`w-9 h-9 rounded-[4px] border border-white/[0.08] flex items-center justify-center mb-4 group-hover:border-${accent}/30 transition-colors`}>
                  <Icon size={15} strokeWidth={1.5} className={`text-${accent}`} />
                </div>
                <h4 className="font-mono text-[11px] font-black text-white tracking-[0.1em] mb-1">{label}</h4>
                <p className="text-[#666] text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="space-y-5">

          {/* Level Progress */}
          <div className="blade p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] font-bold text-[#666] uppercase tracking-[0.15em]">LEVEL PROGRESS</span>
              <span className="font-mono text-[11px] font-black text-white">LV {lvl}</span>
            </div>
            <div className="h-px bg-white/[0.06] mb-1">
              <div
                className="h-px bg-cyber transition-all duration-700"
                style={{ width: `${xpPct}%`, transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)' }}
              />
            </div>
            <p className="font-mono text-[10px] font-bold text-[#555] uppercase tracking-wider mt-3">
              {xp.toLocaleString()} / {nextXP.toLocaleString()} XP → LV {lvl + 1}
            </p>
          </div>

          {/* Weekly Goal */}
          <div className="blade p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] font-bold text-[#666] uppercase tracking-[0.15em]">WEEKLY GOAL</span>
              <Target size={13} strokeWidth={1.5} className="text-cyber" />
            </div>
            <div className="flex items-end gap-1 mb-3">
              <span className="font-mono font-black text-3xl text-white leading-none">{lessonsThisWeek}</span>
              <span className="font-mono text-xs font-bold text-[#555] mb-1 uppercase">/ 5 LESSONS</span>
            </div>
            <div className="h-px bg-white/[0.06] mb-3">
              <div
                className={`h-px transition-all duration-700 ${lessonsThisWeek >= 5 ? 'bg-emerald' : 'bg-cyber'}`}
                style={{ width: `${Math.min((lessonsThisWeek / 5) * 100, 100)}%`,transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)' }}
              />
            </div>
            {lessonsThisWeek >= 5 && (
              <p className="font-mono text-[10px] font-black text-emerald flex items-center gap-1 uppercase tracking-wider">
                <Check size={10} strokeWidth={2.5} /> GOAL REACHED
              </p>
            )}
          </div>

          {/* Live Tournament */}
          <div className="blade p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-crimson/30" />
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-[1px] bg-crimson animate-pulse" />
              <span className="font-mono text-[9px] font-black text-crimson uppercase tracking-[0.2em]">LIVE EVENT</span>
            </div>
            <h3 className="font-bold text-white text-sm mb-1">
              {tournament ? tournament.title : 'Weekend Coding Challenge'}
            </h3>
            <p className="font-mono text-[11px] text-[#555] mb-5 uppercase tracking-wider">
              {tournament ? tournament._count?.entries : 854} ENGINEERS COMPETING
            </p>
            <button
              onClick={() => navigate('/tournaments')}
              className="w-full btn-primary justify-center text-[11px]"
            >
              COMPETE NOW
            </button>
          </div>

          {/* Top Learners */}
          <div className="blade overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="font-mono text-[10px] font-black text-white uppercase tracking-[0.1em]">TOP LEARNERS</span>
              <button
                onClick={() => navigate('/leaderboard')}
                className="font-mono text-[10px] font-bold text-cyber hover:text-white transition-colors uppercase tracking-wider"
              >
                FULL BOARD
              </button>
            </div>
            <div>
              {(topUsers || []).slice(0, 5).map((u, i) => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors duration-150"
                  style={{ borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                >
                  <span className={`font-mono text-[11px] font-black w-4 text-center ${
                    i === 0 ? 'text-amber-400' : i === 1 ? 'text-[#999]' : i === 2 ? 'text-amber-700' : 'text-[#444]'
                  }`}>
                    {i + 1}
                  </span>
                  <Avatar user={u} size={26} />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[11px] font-black text-white truncate uppercase">{u.username}</p>
                    <p className="font-mono text-[9px] font-bold text-[#555] uppercase tracking-wider">{(u.xp || 0).toLocaleString()} XP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

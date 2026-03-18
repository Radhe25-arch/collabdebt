import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { StatCard, Card, XPBar, BadgeTag, Avatar, ProgressBar } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import { format, subDays } from 'date-fns';

const LEVEL_NAMES   = ['Beginner','Apprentice','Coder','Developer','Senior Dev','Architect','Pro','Expert','Master','Legend'];
const THRESHOLDS    = [0,500,1200,2500,4500,7500,12000,18000,26000,36000];

// ─── ACTIVITY HEATMAP ──────────────────────────────────────
function ActivityHeatmap({ logs }) {
  const days = Array.from({ length: 84 }, (_, i) => subDays(new Date(), 83 - i));
  const logMap = {};
  (logs || []).forEach((l) => { logMap[l.date?.slice(0, 10)] = l.xpEarned; });

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  const getColor = (d) => {
    const key = format(d, 'yyyy-MM-dd');
    const xp = logMap[key] || 0;
    if (!xp) return 'bg-arena-bg3 border-arena-border/30';
    if (xp < 100)  return 'bg-arena-purple/30 border-arena-purple/20';
    if (xp < 300)  return 'bg-arena-purple/60 border-arena-purple/40';
    if (xp < 600)  return 'bg-arena-purple border-arena-purple/60';
    return 'bg-arena-teal border-arena-teal/40';
  };

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.toISOString()}
                title={`${format(day, 'MMM d')} — ${logMap[format(day, 'yyyy-MM-dd')] || 0} XP`}
                className={`w-3 h-3 rounded-sm border ${getColor(day)} transition-colors cursor-default`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="font-mono text-xs text-arena-dim">Less</span>
        {['bg-arena-bg3', 'bg-arena-purple/30', 'bg-arena-purple/60', 'bg-arena-purple', 'bg-arena-teal'].map((c) => (
          <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span className="font-mono text-xs text-arena-dim">More</span>
      </div>
    </div>
  );
}

// ─── COURSE PROGRESS CARD ──────────────────────────────────
function CourseProgressCard({ enrollment, onContinue }) {
  const course = enrollment?.course;
  if (!course) return null;
  return (
    <div
      className="arena-card p-5 cursor-pointer hover:-translate-y-1 transition-transform"
      onClick={() => onContinue(course.slug)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="font-mono text-xs text-arena-dim uppercase tracking-widest">Continue Learning</span>
          <h3 className="font-display font-bold text-sm mt-1">{course.title}</h3>
        </div>
        <div className="w-8 h-8 rounded-lg bg-arena-purple/15 border border-arena-border flex items-center justify-center flex-shrink-0">
          <Icons.Book size={14} className="text-arena-purple2" />
        </div>
      </div>
      <ProgressBar value={enrollment.progress} max={100} color="grad" height={4} className="mb-2" />
      <div className="flex justify-between">
        <span className="font-mono text-xs text-arena-dim">{enrollment.progress}% complete</span>
        <span className="font-mono text-xs text-arena-teal flex items-center gap-1">
          <Icons.ArrowRight size={10} /> Resume
        </span>
      </div>
    </div>
  );
}

// ─── WEEKLY GOAL WIDGET ────────────────────────────────────
function WeeklyGoal({ lessonsThisWeek = 0, goal = 5 }) {
  const pct = Math.min((lessonsThisWeek / goal) * 100, 100);
  return (
    <div className="arena-card p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-xs text-arena-dim uppercase tracking-widest">Weekly Goal</span>
        <Icons.Target size={14} className="text-arena-muted" />
      </div>
      <div className="flex items-baseline gap-1 mb-3">
        <span className="font-display font-bold text-2xl text-arena-text">{lessonsThisWeek}</span>
        <span className="font-mono text-sm text-arena-dim">/ {goal} lessons</span>
      </div>
      <ProgressBar value={lessonsThisWeek} max={goal} color={pct >= 100 ? 'teal' : 'purple'} height={6} />
      {pct >= 100 && (
        <span className="font-mono text-xs text-arena-teal mt-2 flex items-center gap-1">
          <Icons.Check size={10} /> Goal reached this week
        </span>
      )}
    </div>
  );
}

// ─── TOURNAMENT CARD WIDGET ────────────────────────────────
function TournamentWidget({ tournament, onJoin }) {
  if (!tournament) return (
    <div className="arena-card p-5">
      <span className="font-mono text-xs text-arena-dim">No active tournament</span>
    </div>
  );
  return (
    <div className="arena-card p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-arena-purple/5 rounded-full -translate-y-8 translate-x-8" />
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-arena-teal animate-pulse" />
        <span className="font-mono text-xs text-arena-teal tracking-widest uppercase">Live Tournament</span>
      </div>
      <h3 className="font-display font-bold text-sm mb-1">{tournament.title}</h3>
      <p className="font-mono text-xs text-arena-dim mb-4">
        {tournament._count?.entries || 0} participants
      </p>
      <button onClick={() => onJoin(tournament.id)} className="btn-primary text-xs px-4 py-2 w-full">
        <Icons.Tournament size={13} /> Join Now
      </button>
    </div>
  );
}

// ─── ACTIVE BATTLE WIDGET ──────────────────────────────────
function ActiveBattleWidget({ battle, onJoin }) {
  if (!battle) return null;
  const isPending = battle.status === 'PENDING';
  const isConfig  = battle.status === 'CONFIGURING';
  const isActive  = battle.status === 'ACTIVE';

  return (
    <div
      className={`arena-card p-5 cursor-pointer border-l-4 transition-all hover:bg-arena-bg3/60 ${
        isActive ? 'border-l-arena-teal bg-arena-teal/5' :
        isPending ? 'border-l-yellow-400 bg-yellow-500/5' :
        'border-l-arena-purple bg-arena-purple/5'
      }`}
      onClick={() => onJoin(battle.id)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full animate-pulse ${
            isActive ? 'bg-arena-teal' : isPending ? 'bg-yellow-400' : 'bg-arena-purple2'
          }`} />
          <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">
            {isActive ? 'Live Battle' : isPending ? 'Incoming Challenge' : 'Configure Match'}
          </span>
        </div>
        <Icons.Zap size={14} className={isActive ? 'text-arena-teal' : 'text-arena-dim'} />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-mono text-sm font-bold text-white truncate">Vs {battle.challenger?.username === 'Me' ? battle.challenged?.username : battle.challenger?.username}</p>
          <p className="font-mono text-[11px] text-white/40 mt-1">
            {isActive ? 'Battle is live! Go and solve.' : isPending ? 'Someone challenged you!' : 'Waiting to start...'}
          </p>
        </div>
        <button className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-white hover:bg-white/10 transition-colors">
          Join →
        </button>
      </div>
    </div>
  );
}

// ─── RECENT BADGES ─────────────────────────────────────────
function RecentBadges({ badges }) {
  if (!badges?.length) return (
    <div className="arena-card p-5">
      <span className="font-mono text-xs text-arena-dim uppercase tracking-widest block mb-3">Recent Badges</span>
      <p className="font-mono text-xs text-arena-dim">Complete courses to earn badges</p>
    </div>
  );
  return (
    <div className="arena-card p-5">
      <span className="font-mono text-xs text-arena-dim uppercase tracking-widest block mb-4">Recent Badges</span>
      <div className="grid grid-cols-4 gap-3">
        {badges.slice(0, 8).map(({ badge, awardedAt }) => (
          <div key={badge.id} title={badge.name} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-lg bg-arena-purple/15 border border-arena-border flex items-center justify-center">
              <Icons.Award size={18} className="text-arena-purple2" />
            </div>
            <span className="font-mono text-xs text-arena-dim text-center leading-none truncate w-full">{badge.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LEADERBOARD PREVIEW ───────────────────────────────────
function LeaderboardPreview({ topUsers, myRank }) {
  const navigate = useNavigate();
  return (
    <div className="arena-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-arena-border">
        <span className="font-mono text-xs text-arena-dim uppercase tracking-widest">Top Learners</span>
        <button onClick={() => navigate('/leaderboard')} className="font-mono text-xs text-arena-purple2 hover:text-arena-teal transition-colors">
          Full board
        </button>
      </div>
      <div className="divide-y divide-arena-border/50">
        {(topUsers || []).slice(0, 5).map((u, i) => (
          <div key={u.id} className="flex items-center gap-3 px-5 py-2.5">
            <span className={`font-mono text-xs font-bold w-4 text-center ${
              i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-600' : 'text-arena-dim'
            }`}>{i + 1}</span>
            <Avatar user={u} size={24} />
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs text-arena-text truncate">{u.username}</p>
            </div>
            <div className="flex items-center gap-1 text-arena-purple2">
              <Icons.Zap size={10} />
              <span className="font-mono text-xs">{u.xp?.toLocaleString()}</span>
            </div>
          </div>
        ))}
        {myRank && (
          <div className="flex items-center gap-3 px-5 py-2.5 bg-arena-purple/5">
            <span className="font-mono text-xs font-bold w-4 text-arena-teal text-center">#{myRank}</span>
            <span className="font-mono text-xs text-arena-teal">You</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats]           = useState(null);
  const [topUsers, setTopUsers]      = useState([]);
  const [myRank, setMyRank]          = useState(null);
  const [tournament, setTournament]  = useState(null);
  const [activeBattle, setActiveBattle] = useState(null);
  const [loading, setLoading]        = useState(true);

  const lvl    = Math.min(user?.level || 1, 10);
  const xp     = user?.xp || 0;
  const nextXP = THRESHOLDS[lvl] || xp;
  const prevXP = THRESHOLDS[lvl - 1] || 0;

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
      // Find the most relevant active/pending battle
      const live = (b.data.battles || []).find(x => ['ACTIVE', 'PENDING', 'CONFIGURING'].includes(x.status));
      setActiveBattle(live);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const recentEnrollment = stats?.enrollments
    ?.filter((e) => !e.completedAt)
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const lessonsThisWeek = stats?.activityLogs
    ?.filter((l) => new Date(l.date) >= weekAgo)
    ?.reduce((s, l) => s + l.lessons, 0) || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-arena-dim font-mono text-sm animate-pulse">loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-black text-2xl">
            Welcome back, <span className="text-gradient">{user?.username}</span>
          </h1>
          <p className="font-mono text-xs text-arena-dim mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2">
            <Icons.Fire size={14} className="text-orange-400" />
            <span className="font-mono text-xs font-bold text-orange-400">{user?.streak || 0} day streak</span>
          </div>
        </div>
      </div>

      {/* XP Bar — full width */}
      <div className="arena-card p-5">
        <XPBar
          current={xp - prevXP}
          max={nextXP - prevXP}
          level={lvl}
          levelName={LEVEL_NAMES[lvl - 1]}
          showLabel
        />
        <p className="font-mono text-xs text-arena-dim mt-2">
          {(nextXP - xp).toLocaleString()} XP to {LEVEL_NAMES[Math.min(lvl, 9)]}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total XP"
          value={xp.toLocaleString()}
          icon={<Icons.Zap size={14} className="text-arena-purple2" />}
        />
        <StatCard
          label="Courses Done"
          value={user?.coursesCompleted || 0}
          icon={<Icons.Book size={14} className="text-arena-teal" />}
        />
        <StatCard
          label="Quiz Accuracy"
          value={`${stats?.user?.accuracy || 0}%`}
          icon={<Icons.Target size={14} className="text-arena-muted" />}
        />
        <StatCard
          label="Global Rank"
          value={myRank ? `#${myRank.toLocaleString()}` : '--'}
          icon={<Icons.Trophy size={14} className="text-yellow-400" />}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col — main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Active Battle */}
          {activeBattle && (
            <ActiveBattleWidget battle={activeBattle} onJoin={(id) => navigate(`/battles/${id}`)} />
          )}

          {/* Continue learning */}
          {recentEnrollment && (
            <CourseProgressCard enrollment={recentEnrollment} onContinue={(slug) => navigate(`/courses/${slug}`)} />
          )}

          {/* Activity heatmap */}
          <div className="arena-card p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-arena-dim uppercase tracking-widest">Activity Heatmap</span>
              <span className="font-mono text-xs text-arena-dim">Last 12 weeks</span>
            </div>
            <ActivityHeatmap logs={stats?.activityLogs} />
          </div>

          {/* Recent badges */}
          <RecentBadges badges={stats?.badges} />
        </div>

        {/* Right col — sidebar widgets */}
        <div className="space-y-4">
          <WeeklyGoal lessonsThisWeek={lessonsThisWeek} goal={5} />

          <TournamentWidget
            tournament={tournament}
            onJoin={(id) => navigate(`/tournaments/${id}`)}
          />

          <LeaderboardPreview topUsers={topUsers} myRank={myRank} />

          {/* Quick actions */}
          <div className="arena-card p-5">
            <span className="font-mono text-xs text-arena-dim uppercase tracking-widest block mb-3">Quick Actions</span>
            <div className="space-y-2">
              {[
                { label: 'Browse Courses',    icon: Icons.Book,        to: '/courses' },
                { label: 'View Leaderboard',  icon: Icons.Leaderboard, to: '/leaderboard' },
                { label: 'My Profile',        icon: Icons.Profile,     to: '/profile' },
              ].map(({ label, icon: Ic, to }) => (
                <button
                  key={to}
                  onClick={() => navigate(to)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-arena-bg3 transition-colors text-left group"
                >
                  <Ic size={14} className="text-arena-dim group-hover:text-arena-purple2 transition-colors" />
                  <span className="font-mono text-xs text-arena-muted group-hover:text-arena-text transition-colors">{label}</span>
                  <Icons.ChevronRight size={12} className="ml-auto text-arena-dim" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

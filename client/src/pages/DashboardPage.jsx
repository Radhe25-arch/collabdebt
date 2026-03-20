import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Avatar, ProgressBar } from '@/components/ui';
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
    if (!xp) return 'bg-slate-100 border-slate-200';
    if (xp < 100)  return 'bg-blue-200 border-blue-300';
    if (xp < 300)  return 'bg-blue-400 border-blue-500';
    if (xp < 600)  return 'bg-blue-600 border-blue-700';
    return 'bg-blue-800 border-blue-900';
  };

  return (
    <div>
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1.5">
            {week.map((day) => (
              <div
                key={day.toISOString()}
                title={`${format(day, 'MMM d')} — ${logMap[format(day, 'yyyy-MM-dd')] || 0} XP`}
                className={`w-3.5 h-3.5 rounded-sm border ${getColor(day)} transition-colors cursor-default`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Less</span>
        {['bg-slate-100', 'bg-blue-200', 'bg-blue-400', 'bg-blue-600', 'bg-blue-800'].map((c) => (
          <div key={c} className={`w-3.5 h-3.5 rounded-sm ${c}`} />
        ))}
        <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase ml-1">More</span>
      </div>
    </div>
  );
}

// Course Progress Card
function CourseProgressCard({ enrollment, onContinue }) {
  const course = enrollment?.course;
  if (!course) return null;
  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all group"
      onClick={() => onContinue(course.slug)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Continue Learning</span>
          <h3 className="font-bold text-lg text-slate-900 mt-1.5 leading-tight group-hover:text-blue-600 transition-colors">{course.title}</h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <Icons.Play size={16} className="text-blue-600 ml-1" />
        </div>
      </div>
      
      <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
        <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${enrollment.progress}%` }} />
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-slate-500">{enrollment.progress}% complete</span>
        <span className="text-sm font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
          Resume <Icons.ArrowRight size={14} />
        </span>
      </div>
    </div>
  );
}

// Stats Card Utility
function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-500">{label}</span>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
          {icon}
        </div>
      </div>
      <div className="font-display font-bold text-2xl text-slate-900 tracking-tight">{value}</div>
    </div>
  );
}

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
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-fade-in font-sans">
      
      {/* ── Header ── */}
      <div className="flex items-end justify-between flex-wrap gap-6 bg-blue-600 rounded-3xl p-8 text-white shadow-lg overflow-hidden relative">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <p className="font-semibold text-blue-200 mb-1 uppercase tracking-widest text-xs">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="font-display font-black text-3xl md:text-4xl tracking-tight">
            Welcome back, {user?.username}
          </h1>
        </div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-2 flex items-center gap-2">
            <Icons.Fire size={16} className="text-amber-300" />
            <span className="font-bold text-sm text-white">{user?.streak || 0} Day Streak</span>
          </div>
          <button onClick={() => navigate('/courses')} className="bg-white text-blue-700 px-6 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
            Start a Course
          </button>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Experience" value={xp.toLocaleString()} icon={<Icons.Zap size={14} className="text-amber-500" />} />
        <StatCard label="Completed Courses" value={user?.coursesCompleted || 0} icon={<Icons.Book size={14} className="text-blue-500" />} />
        <StatCard label="Avg. Accuracy" value={`${stats?.user?.accuracy || 0}%`} icon={<Icons.Target size={14} className="text-emerald-500" />} />
        <StatCard label="Global Rank" value={myRank ? `#${myRank.toLocaleString()}` : '--'} icon={<Icons.Trophy size={14} className="text-purple-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── Left Column (Content) ── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Battle Alert */}
          {activeBattle && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Icons.Zap size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Battle is {activeBattle.status.toLowerCase()}!</h4>
                  <p className="text-sm text-slate-600">You have a live challenge waiting against {activeBattle.challenger?.username === user?.username ? activeBattle.challenged?.username : activeBattle.challenger?.username}.</p>
                </div>
              </div>
              <button onClick={() => navigate(`/battles/${activeBattle.id}`)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap">
                Join Match →
              </button>
            </div>
          )}

          {/* Recent Course */}
          {recentEnrollment && (
            <CourseProgressCard enrollment={recentEnrollment} onContinue={(slug) => navigate(`/courses/${slug}`)} />
          )}

          {/* Activity Heatmap */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Learning Activity</h3>
                <p className="text-sm text-slate-500">Your XP earnings over the last 12 weeks</p>
              </div>
            </div>
            <ActivityHeatmap logs={stats?.activityLogs} />
          </div>

          {/* Badges */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 mb-6">Recent Achievements</h3>
            {(!stats?.badges || stats.badges.length === 0) ? (
              <div className="p-8 text-center border border-slate-200 border-dashed rounded-xl bg-slate-50">
                <p className="text-sm text-slate-500 italic">No badges earned yet. Complete courses to unlock achievements.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.badges.slice(0, 8).map(({ badge }) => (
                  <div key={badge.id} className="flex flex-col items-center justify-center p-4 border border-slate-100 rounded-xl bg-slate-50 text-center hover:bg-slate-100 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3 shadow-md">
                      <Icons.Award size={20} className="text-blue-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 leading-tight block">{badge.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div onClick={() => navigate('/mentor')} className="bg-white border border-slate-200 p-6 rounded-2xl cursor-pointer hover:shadow-md hover:border-blue-300 transition-all flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Icons.Cpu size={20} /></div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">AI Mentor</h4>
              <p className="text-xs text-slate-500">Get debugging help</p>
            </div>
            <div onClick={() => navigate('/rooms')} className="bg-white border border-slate-200 p-6 rounded-2xl cursor-pointer hover:shadow-md hover:border-indigo-300 transition-all flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Icons.Users size={20} /></div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Multiplayer Room</h4>
              <p className="text-xs text-slate-500">Collaborate live</p>
            </div>
            <div onClick={() => navigate('/quests')} className="bg-white border border-slate-200 p-6 rounded-2xl cursor-pointer hover:shadow-md hover:border-amber-300 transition-all flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Icons.Target size={20} /></div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Daily Quests</h4>
              <p className="text-xs text-slate-500">Earn bonus XP</p>
            </div>
          </div>
        </div>

        {/* ── Right Column (Widgets) ── */}
        <div className="space-y-6">
          
          {/* Level Progress */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Level {lvl}</h3>
            <div className="w-full bg-slate-100 rounded-full h-3 mb-3 overflow-hidden">
              <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${Math.min(((xp - prevXP) / (nextXP - prevXP)) * 100, 100)}%` }} />
            </div>
            <p className="text-xs font-bold text-slate-500 tracking-wide">
              {xp.toLocaleString()} / {nextXP.toLocaleString()} XP to Level {lvl + 1}
            </p>
          </div>

          {/* Weekly Goal */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Weekly Goal</h3>
              <Icons.Target size={16} className="text-blue-600" />
            </div>
            <div className="flex items-end gap-1 mb-3">
              <span className="font-display font-black text-3xl text-slate-900 leading-none">{lessonsThisWeek}</span>
              <span className="text-sm font-bold text-slate-400 mb-1">/ 5 lessons</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
              <div className={`h-2 rounded-full ${lessonsThisWeek >= 5 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${Math.min((lessonsThisWeek / 5) * 100, 100)}%` }} />
            </div>
            {lessonsThisWeek >= 5 && <p className="text-xs font-bold text-emerald-600 flex items-center gap-1"><Icons.Check size={12}/> Goal reached!</p>}
          </div>

          {/* Live Tournament */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-0" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live Event</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{tournament ? tournament.title : 'Weekend Coding Challenge'}</h3>
              <p className="text-sm text-slate-500 mb-6">{tournament ? tournament._count?.entries : 854} hackers participating</p>
              <button onClick={() => navigate('/tournaments')} className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-slate-800 transition-colors">
                Compete Now
              </button>
            </div>
          </div>

          {/* Top Learners */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Top Learners</h3>
              <button onClick={() => navigate('/leaderboard')} className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Full Board</button>
            </div>
            <div className="divide-y divide-slate-50">
              {(topUsers || []).slice(0, 5).map((u, i) => (
                <div key={u.id} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors">
                  <span className={`font-bold text-sm w-4 text-center ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-700' : 'text-slate-300'}`}>{i + 1}</span>
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <Avatar user={u} size={28} />
                    <div>
                      <p className="text-sm font-bold text-slate-900 truncate leading-tight">{u.username}</p>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{(u.xp || 0).toLocaleString()} XP</p>
                    </div>
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

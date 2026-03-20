import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Avatar, XPBar, BadgeTag, Button, Spinner, ProgressBar } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import { format, subDays } from 'date-fns';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

const LEVEL_NAMES = ['Beginner','Apprentice','Coder','Developer','Senior Dev','Architect','Pro','Expert','Master','Legend'];
const THRESHOLDS  = [0,500,1200,2500,4500,7500,12000,18000,26000,36000];

const RARITY_COLORS = {
  common:    'bg-slate-50 border-slate-200 text-slate-600',
  rare:      'bg-blue-50 border-blue-200 text-blue-700',
  epic:      'bg-indigo-50 border-indigo-200 text-indigo-700',
  legendary: 'bg-amber-50 border-amber-200 text-amber-700',
};

// ─── SKILL RADAR ───────────────────────────────────────────
function SkillRadar({ skills }) {
  const data = Object.entries(skills || {}).map(([cat, s]) => ({
    subject: cat.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase()).slice(0,10),
    value: Math.min(Math.round((s.completed / Math.max(s.total, 1)) * 100), 100),
    fullMark: 100,
  }));

  if (!data.length) return (
    <div className="flex items-center justify-center p-12 bg-slate-50 border border-slate-200 border-dashed rounded-3xl">
      <p className="font-semibold text-sm text-slate-500">Complete courses to build your skill map</p>
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data}>
        <PolarGrid stroke="#E2E8F0" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700, fontFamily: 'sans-serif', textTransform: 'uppercase' }} />
        <Radar name="Skills" dataKey="value" stroke="#2563EB" fill="#3B82F6" fillOpacity={0.15} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// ─── ACTIVITY HEATMAP ──────────────────────────────────────
function Heatmap({ logs }) {
  const days = Array.from({ length: 84 }, (_, i) => subDays(new Date(), 83 - i));
  const logMap = {};
  (logs || []).forEach((l) => { logMap[l.date?.slice(0,10)] = l.xpEarned; });
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i+7));
  
  const col = (d) => {
    const xp = logMap[format(d, 'yyyy-MM-dd')] || 0;
    if (!xp) return 'bg-slate-50 border-slate-100/50';
    if (xp < 100) return 'bg-blue-100 border-blue-200';
    if (xp < 300) return 'bg-blue-300 border-blue-400';
    if (xp < 600) return 'bg-blue-500 border-blue-600';
    return 'bg-blue-700 border-blue-800';
  };

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-4 scrollbar-hide">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1.5">
          {week.map((day) => (
            <div key={day.toISOString()} title={`${format(day,'MMM d')} — ${logMap[format(day, 'yyyy-MM-dd')] || 0} XP`}
              className={`w-4 h-4 rounded-sm border ${col(day)} transition-colors cursor-default`} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN PROFILE ─────────────────────────────────────────
export default function ProfilePage() {
  const { username } = useParams();
  const { user: me } = useAuthStore();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('overview');
  const [following, setFollowing] = useState(false);

  const targetUser = username || me?.username;
  const isMe       = !username || username === me?.username;

  useEffect(() => {
    Promise.all([
      api.get(`/users/${targetUser}`),
      api.get('/users/me/stats'),
    ]).then(([u, s]) => {
      setData({ profile: u.data.user, stats: isMe ? s.data : null });
    }).catch(() => {}).finally(() => setLoading(false));
  }, [targetUser]);

  const handleFollow = async () => {
    try {
      if (following) await api.delete(`/users/${data.profile.id}/follow`);
      else await api.post(`/users/${data.profile.id}/follow`);
      setFollowing(!following);
    } catch (_) {}
  };

  if (loading) return (
    <div className="flex justify-center py-24"><div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" /></div>
  );
  if (!data) return (
    <div className="max-w-4xl mx-auto py-24 text-center">
      <h2 className="font-display font-black text-2xl text-slate-900 mb-2">Profile Not Found</h2>
      <p className="text-slate-500">The developer you are looking for does not exist.</p>
    </div>
  );

  const { profile, stats } = data;
  const lvl    = Math.min(profile.level || 1, 10);
  const xp     = profile.xp || 0;
  const nextXP = THRESHOLDS[lvl] || xp;
  const prevXP = THRESHOLDS[lvl-1] || 0;
  const accuracy = profile.totalQuizAttempts > 0
    ? Math.round((profile.correctQuizAnswers / profile.totalQuizAttempts) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24 font-sans animate-fade-in relative z-10 pt-4">
      {/* Profile Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 opacity-50 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pt-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar user={profile} size={96} className="border-4 border-white shadow-lg shrink-0" />
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <h1 className="font-display font-black text-3xl text-slate-900 tracking-tight">{profile.fullName || profile.username}</h1>
                {profile.streak > 6 && (
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shadow-sm">
                    <Icons.Fire size={14} className="text-amber-500" />
                    <span className="font-bold text-xs text-amber-600 block leading-none">{profile.streak} <span className="text-[10px] uppercase font-bold text-amber-500/70 tracking-widest">Days</span></span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4 flex-wrap">
                <span className="font-bold text-sm text-slate-500 block">@{profile.username}</span>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">{LEVEL_NAMES[lvl-1]}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">Global #{profile.rank?.toLocaleString() || '--'}</span>
              </div>
              {profile.bio && <p className="text-base text-slate-600 max-w-lg leading-relaxed">{profile.bio}</p>}
              {!profile.bio && <p className="text-sm font-medium text-slate-400 italic">No biography provided.</p>}
            </div>
          </div>
          
          <div className="flex gap-3">
            {!isMe && (
              <button onClick={handleFollow} className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-sm ${following ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                {following ? <><Icons.Check size={16}/> Following</> : <><Icons.Plus size={16}/> Follow</>}
              </button>
            )}
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/u/${profile.username}`);
                toast.success('Profile link copied!');
              }}
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-full font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
            >
              <Icons.Copy size={16} /> Share
            </button>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-8 pt-6 border-t border-slate-100 relative z-10">
          <div className="flex items-end justify-between mb-2">
            <span className="font-bold text-slate-900 leading-none">Level {lvl}</span>
            <span className="text-xs font-bold text-slate-400 tracking-wider">
              {xp.toLocaleString()} / {nextXP.toLocaleString()} XP
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${Math.min(((xp - prevXP) / (nextXP - prevXP)) * 100, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Experience', value: xp.toLocaleString(), icon: Icons.Zap, color: 'text-amber-500', bg: 'bg-amber-100' },
          { label: 'Courses Completed', value: profile.coursesCompleted || 0, icon: Icons.Book, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Quiz Accuracy', value: `${accuracy}%`, icon: Icons.Target, color: 'text-indigo-600', bg: 'bg-indigo-100' },
          { label: 'Current Streak', value: `${profile.streak||0} Days`, icon: Icons.Fire, color: 'text-orange-500', bg: 'bg-orange-100' },
        ].map(({ label, value, icon: Ic, color, bg }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center mb-4`}>
              <Ic size={18} className={color} />
            </div>
            <div className="font-display font-black text-2xl text-slate-900 tracking-tight mb-1">{value}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full p-1.5 shadow-inner">
        {['overview', 'badges', 'courses', 'activity'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-3 px-6 rounded-full font-bold text-sm tracking-wide capitalize transition-all ${
              tab === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* OVERVIEW PANEL */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold text-sm text-slate-500 uppercase tracking-widest">Skill Competency Map</span>
            </div>
            <SkillRadar skills={stats?.skills || {}} />
          </div>
          
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold text-sm text-slate-500 uppercase tracking-widest">Learning Density</span>
            </div>
            <Heatmap logs={stats?.activityLogs || []} />
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 font-bold text-xs text-slate-400 uppercase tracking-widest">
              <span>12 Weeks Ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>
      )}

      {/* BADGES PANEL */}
      {tab === 'badges' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm animate-fade-in">
          <div className="mb-8">
            <span className="font-bold text-sm text-slate-500 uppercase tracking-widest">Badge Collection</span>
            <span className="ml-2 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">{profile.badges?.length || 0} Total</span>
          </div>

          {(profile.badges?.length || 0) === 0 ? (
            <div className="py-20 text-center border border-slate-200 border-dashed rounded-2xl bg-slate-50">
              <p className="font-semibold text-sm text-slate-500">No badges acquired yet. Complete lessons and tournaments.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {profile.badges.map(({ badge, awardedAt }) => (
                <div key={badge.id} className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all hover:scale-105 ${RARITY_COLORS[badge.rarity]||RARITY_COLORS.common}`}>
                  <div className="w-14 h-14 rounded-full bg-white/50 backdrop-blur shadow-sm border border-black/5 flex items-center justify-center mb-4">
                    <Icons.Award size={24} className="text-current" />
                  </div>
                  <span className="font-bold text-sm text-center leading-tight mb-1">{badge.name}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{badge.rarity}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* COURSES PANEL */}
      {tab === 'courses' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm animate-fade-in">
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="font-bold text-sm text-slate-500 uppercase tracking-widest">Enrolled Courses</span>
          </div>
          <div className="divide-y divide-slate-100">
            {(profile.enrollments || []).length === 0 ? (
              <div className="px-8 py-16 text-center">
                <p className="font-semibold text-sm text-slate-500">Not currently enrolled in any courses.</p>
              </div>
            ) : profile.enrollments.map((e) => (
              <div key={e.id} className="flex items-center justify-between px-8 py-5 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                    <Icons.Book size={20} className="text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-lg text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{e.course?.title}</p>
                    {e.completedAt && <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Completed {format(new Date(e.completedAt), 'MMM d, yyyy')}</p>}
                  </div>
                </div>
                <div>
                  {e.completedAt ? (
                     <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-200 flex flex-col sm:flex-row items-center justify-center">Done</span>
                  ) : (
                    <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-200">Study</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVITY PANEL */}
      {tab === 'activity' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm animate-fade-in">
          <span className="font-bold text-sm text-slate-500 uppercase tracking-widest block mb-8">XP History Ledger</span>
          <div className="mb-10 p-6 bg-slate-50 border border-slate-100 rounded-2xl">
            <Heatmap logs={stats?.activityLogs || []} />
          </div>
          
          <div className="space-y-3">
            {(stats?.activityLogs||[]).slice(0,14).filter(l => l.xpEarned > 0).length === 0 ? (
              <p className="font-semibold text-sm text-slate-500 text-center py-8">No recent XP earnings found.</p>
            ) : (
              (stats?.activityLogs||[]).slice(0,14).filter(l => l.xpEarned > 0).map((l, i) => (
                <div key={l.id || i} className="flex items-center gap-4 py-4 px-6 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                    <Icons.Zap size={14} className="text-blue-600" />
                  </div>
                  <span className="font-bold text-sm text-slate-600">{format(new Date(l.date), 'MMMM d, yyyy')}</span>
                  <div className="flex-1 border-b border-dashed border-slate-200 mx-4" />
                  <span className="font-black text-lg text-blue-600">{l.xpEarned > 0 ? '+' : ''}{l.xpEarned} XP</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

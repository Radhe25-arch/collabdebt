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
  common:    'border-arena-border text-arena-muted',
  rare:      'border-arena-purple/40 text-arena-purple2',
  epic:      'border-arena-teal/40 text-arena-teal',
  legendary: 'border-yellow-500/40 text-yellow-400',
};

// ─── SKILL RADAR ───────────────────────────────────────────
function SkillRadar({ skills }) {
  const data = Object.entries(skills || {}).map(([cat, s]) => ({
    subject: cat.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase()).slice(0,10),
    value: Math.min(Math.round((s.completed / Math.max(s.total, 1)) * 100), 100),
    fullMark: 100,
  }));

  if (!data.length) return (
    <div className="flex items-center justify-center h-48">
      <p className="font-mono text-xs text-arena-dim">Complete courses to build your skill map</p>
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(124,58,237,0.2)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9896AA', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
        <Radar name="Skills" dataKey="value" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.25} strokeWidth={2} />
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
    if (!xp) return 'bg-arena-bg3';
    if (xp < 100) return 'bg-arena-purple/30';
    if (xp < 300) return 'bg-arena-purple/60';
    if (xp < 600) return 'bg-arena-purple';
    return 'bg-arena-teal';
  };
  return (
    <div className="flex gap-1 overflow-x-auto">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((day) => (
            <div key={day.toISOString()} title={format(day,'MMM d')}
              className={`w-3 h-3 rounded-sm ${col(day)}`} />
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
    <div className="flex justify-center py-24"><Spinner size={24} className="text-arena-purple2" /></div>
  );
  if (!data) return null;

  const { profile, stats } = data;
  const lvl    = Math.min(profile.level || 1, 10);
  const xp     = profile.xp || 0;
  const nextXP = THRESHOLDS[lvl] || xp;
  const prevXP = THRESHOLDS[lvl-1] || 0;
  const accuracy = profile.totalQuizAttempts > 0
    ? Math.round((profile.correctQuizAnswers / profile.totalQuizAttempts) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile header */}
      <div className="arena-card p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-5">
            <Avatar user={profile} size={64} />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-display font-black text-xl">{profile.fullName || profile.username}</h1>
                {profile.streak > 6 && (
                  <div className="flex items-center gap-1 text-orange-400">
                    <Icons.Fire size={14} />
                    <span className="font-mono text-xs font-bold">{profile.streak}d</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs text-arena-dim">@{profile.username}</span>
                <span className="text-arena-border">·</span>
                <BadgeTag variant="purple">{LEVEL_NAMES[lvl-1]}</BadgeTag>
                <BadgeTag variant="gray">Rank #{(profile.rank||0).toLocaleString()}</BadgeTag>
              </div>
              {profile.bio && <p className="font-body text-sm text-arena-muted max-w-sm">{profile.bio}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            {!isMe && (
              <Button onClick={handleFollow} variant={following ? 'secondary' : 'primary'} size="sm">
                {following ? <><Icons.Check size={13}/> Following</> : <><Icons.Plus size={13}/> Follow</>}
              </Button>
            )}
            <button
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/u/${profile.username}`)}
              className="btn-secondary text-xs px-3 py-2"
            >
              <Icons.Copy size={12} /> Share
            </button>
          </div>
        </div>

        {/* XP bar */}
        <div className="mt-5">
          <XPBar current={xp - prevXP} max={nextXP - prevXP} level={lvl} levelName={LEVEL_NAMES[lvl-1]} />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total XP',    value: xp.toLocaleString(),             icon: Icons.Zap,       color: 'text-arena-purple2' },
          { label: 'Courses Done', value: profile.coursesCompleted || 0,   icon: Icons.Book,      color: 'text-arena-teal' },
          { label: 'Quiz Accuracy',value: `${accuracy}%`,                 icon: Icons.Target,    color: 'text-arena-muted' },
          { label: 'Streak',       value: `${profile.streak||0} days`,    icon: Icons.Fire,      color: 'text-orange-400' },
        ].map(({ label, value, icon: Ic, color }) => (
          <div key={label} className="arena-card p-4 text-center">
            <Ic size={14} className={`${color} mx-auto mb-1`} />
            <div className="font-display font-bold text-lg text-arena-text">{value}</div>
            <div className="font-mono text-xs text-arena-dim">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-arena-bg2 border border-arena-border rounded-xl p-1">
        {['overview', 'badges', 'courses', 'activity'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg font-mono text-xs capitalize transition-all ${
              tab === t ? 'bg-arena-purple text-white' : 'text-arena-muted hover:text-arena-text'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="arena-card p-5">
            <span className="font-mono text-xs text-arena-dim uppercase tracking-widest block mb-4">Skill Map</span>
            <SkillRadar skills={stats?.skills || {}} />
          </div>
          <div className="arena-card p-5">
            <span className="font-mono text-xs text-arena-dim uppercase tracking-widest block mb-4">Activity Heatmap</span>
            <Heatmap logs={stats?.activityLogs || []} />
            <div className="flex justify-between mt-3 font-mono text-xs text-arena-dim">
              <span>12 weeks ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>
      )}

      {/* BADGES */}
      {tab === 'badges' && (
        <div className="arena-card p-5">
          <span className="font-mono text-xs text-arena-dim uppercase tracking-widest block mb-5">Badge Collection ({profile.badges?.length || 0})</span>
          {(profile.badges?.length || 0) === 0 ? (
            <p className="font-mono text-xs text-arena-dim text-center py-8">No badges yet. Complete courses to earn them.</p>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {profile.badges.map(({ badge, awardedAt }) => (
                <div key={badge.id} className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${RARITY_COLORS[badge.rarity]||'border-arena-border text-arena-muted'}`}>
                  <div className="w-10 h-10 rounded-xl bg-arena-bg3 flex items-center justify-center">
                    <Icons.Award size={18} className="text-current" />
                  </div>
                  <span className="font-mono text-xs text-center leading-tight">{badge.name}</span>
                  <span className="font-mono text-xs text-arena-dim capitalize">{badge.rarity}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* COURSES */}
      {tab === 'courses' && (
        <div className="arena-card overflow-hidden">
          <div className="px-5 py-3 border-b border-arena-border">
            <span className="font-mono text-xs text-arena-dim uppercase tracking-widest">Enrolled Courses</span>
          </div>
          <div className="divide-y divide-arena-border/40">
            {(profile.enrollments || []).length === 0 ? (
              <p className="px-5 py-8 font-mono text-xs text-arena-dim">No enrollments yet</p>
            ) : profile.enrollments.map((e) => (
              <div key={e.id} className="flex items-center gap-4 px-5 py-3">
                <div className="w-8 h-8 rounded-lg bg-arena-purple/15 border border-arena-border flex items-center justify-center flex-shrink-0">
                  <Icons.Book size={13} className="text-arena-purple2" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-arena-text truncate">{e.course?.title}</p>
                </div>
                {e.completedAt
                  ? <BadgeTag variant="teal">Done</BadgeTag>
                  : <BadgeTag variant="gray">In Progress</BadgeTag>
                }
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVITY */}
      {tab === 'activity' && (
        <div className="arena-card p-5">
          <span className="font-mono text-xs text-arena-dim uppercase tracking-widest block mb-5">Full Activity Log</span>
          <Heatmap logs={stats?.activityLogs || []} />
          <div className="mt-4 space-y-2">
            {(stats?.activityLogs||[]).slice(0,14).filter(l => l.xpEarned > 0).map((l) => (
              <div key={l.id} className="flex items-center gap-3 py-2 border-b border-arena-border/40 last:border-0">
                <Icons.Zap size={11} className="text-arena-purple2" />
                <span className="font-mono text-xs text-arena-dim">{format(new Date(l.date), 'MMM d, yyyy')}</span>
                <span className="font-mono text-xs text-arena-purple2 ml-auto">+{l.xpEarned} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

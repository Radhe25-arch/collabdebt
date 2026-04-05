import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Avatar, XPBar, BadgeTag, Button, Spinner } from '@/components/ui';
import { Zap, BookOpen, Target, Flame, Trophy, Copy, UserPlus, UserCheck } from 'lucide-react';
import api from '@/lib/api';
import { format, subDays } from 'date-fns';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

const LEVEL_NAMES = ['BEGINNER','APPRENTICE','CODER','DEVELOPER','SENIOR DEV','ARCHITECT','PRO','EXPERT','MASTER','LEGEND'];
const THRESHOLDS  = [0,500,1200,2500,4500,7500,12000,18000,26000,36000];

const RARITY_COLOR = {
  common:    { text: '#666', border: 'rgba(255,255,255,0.08)', bg: 'rgba(255,255,255,0.02)' },
  rare:      { text: '#60A5FA', border: 'rgba(59,130,246,0.2)', bg: 'rgba(59,130,246,0.06)' },
  epic:      { text: '#A78BFA', border: 'rgba(124,58,237,0.2)', bg: 'rgba(124,58,237,0.06)' },
  legendary: { text: '#FBBF24', border: 'rgba(245,158,11,0.2)', bg: 'rgba(245,158,11,0.06)' },
};

function SkillRadar({ skills }) {
  const data = Object.entries(skills || {}).map(([cat, s]) => ({
    subject: cat.replace(/-/g,' ').toUpperCase().slice(0, 8),
    value: Math.min(Math.round((s.completed / Math.max(s.total, 1)) * 100), 100),
    fullMark: 100,
  }));
  if (!data.length) return (
    <div className="flex items-center justify-center h-48">
      <p className="font-mono text-[10px] text-[#444] uppercase tracking-wider">COMPLETE COURSES TO UNLOCK SKILL MAP</p>
    </div>
  );
  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.06)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#444', fontSize: 9, fontFamily: 'JetBrains Mono', fontWeight: 700 }} />
        <Radar name="Skills" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.12} strokeWidth={1.5} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

function Heatmap({ logs }) {
  const days = Array.from({ length: 84 }, (_, i) => subDays(new Date(), 83 - i));
  const logMap = {};
  (logs || []).forEach(l => { logMap[l.date?.slice(0, 10)] = l.xpEarned; });
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  const getColor = d => {
    const xp = logMap[format(d, 'yyyy-MM-dd')] || 0;
    if (!xp)      return 'rgba(255,255,255,0.04)';
    if (xp < 100) return 'rgba(59,130,246,0.2)';
    if (xp < 300) return 'rgba(59,130,246,0.45)';
    if (xp < 600) return 'rgba(59,130,246,0.7)';
    return '#3B82F6';
  };

  return (
    <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-2">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map(day => (
            <div
              key={day.toISOString()}
              title={`${format(day, 'MMM d')} — ${logMap[format(day, 'yyyy-MM-dd')] || 0} XP`}
              style={{ width: 11, height: 11, background: getColor(day), borderRadius: '2px', flexShrink: 0 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { username } = useParams();
  const { user: me } = useAuthStore();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('OVERVIEW');
  const [following, setFollowing] = useState(false);

  const targetUser = username || me?.username;
  const isMe = !username || username === me?.username;

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
      else           await api.post(`/users/${data.profile.id}/follow`);
      setFollowing(v => !v);
    } catch {}
  };

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <Spinner size={20} className="text-cyber" />
        <span className="font-mono text-[10px] text-[#444] uppercase tracking-[0.2em]">LOADING PROFILE...</span>
      </div>
    </div>
  );
  if (!data) return null;

  const { profile, stats } = data;
  const lvl    = Math.min(profile.level || 1, 10);
  const xp     = profile.xp || 0;
  const nextXP = THRESHOLDS[lvl] || xp;
  const prevXP = THRESHOLDS[lvl - 1] || 0;
  const accuracy = profile.totalQuizAttempts > 0
    ? Math.round((profile.correctQuizAnswers / profile.totalQuizAttempts) * 100) : 0;

  const TABS = ['OVERVIEW', 'BADGES', 'COURSES', 'ACTIVITY'];

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-16 animate-fade-in">

      {/* Profile Header */}
      <div className="blade p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-cyber/20" />
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-5">
            <Avatar user={profile} size={64} />
            <div>
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="font-black text-xl text-white uppercase tracking-tight">
                  {profile.fullName || profile.username}
                </h1>
                {profile.streak > 6 && (
                  <span className="flex items-center gap-1 font-mono text-[11px] font-black text-amber-400">
                    <Flame size={12} strokeWidth={1.5} />{profile.streak}D
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-mono text-[10px] text-[#555] uppercase">@{profile.username}</span>
                <BadgeTag variant="purple">{LEVEL_NAMES[lvl - 1]}</BadgeTag>
                <BadgeTag variant="gray">RANK #{(profile.rank || 0).toLocaleString()}</BadgeTag>
              </div>
              {profile.bio && <p className="text-sm text-[#666] max-w-sm leading-relaxed">{profile.bio}</p>}
            </div>
          </div>

          <div className="flex gap-2">
            {!isMe && (
              <Button onClick={handleFollow} variant={following ? 'secondary' : 'primary'} size="sm">
                {following
                  ? <><UserCheck size={12} strokeWidth={1.5} /> FOLLOWING</>
                  : <><UserPlus size={12} strokeWidth={1.5} /> FOLLOW</>}
              </Button>
            )}
            <button
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/u/${profile.username}`)}
              className="btn-secondary text-[10px] px-3 py-2"
            >
              <Copy size={11} strokeWidth={1.5} /> SHARE
            </button>
          </div>
        </div>

        <div className="mt-5">
          <XPBar current={xp - prevXP} max={nextXP - prevXP} level={lvl} levelName={LEVEL_NAMES[lvl - 1]} />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'TOTAL XP',     value: xp.toLocaleString(),          Icon: Zap,    color: 'text-amber-400' },
          { label: 'COURSES DONE', value: profile.coursesCompleted || 0, Icon: BookOpen, color: 'text-cyber' },
          { label: 'ACCURACY',     value: `${accuracy}%`,               Icon: Target, color: 'text-emerald' },
          { label: 'STREAK',       value: `${profile.streak || 0}D`,    Icon: Flame,  color: 'text-amber-400' },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className="blade p-4 text-center">
            <Icon size={14} strokeWidth={1.5} className={`${color} mx-auto mb-2`} />
            <div className="font-mono font-black text-xl text-white">{value}</div>
            <div className="font-mono text-[9px] font-bold text-[#555] uppercase tracking-[0.15em] mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Tab Bar */}
      <div
        className="flex items-center gap-0 border border-white/[0.08] rounded-[4px] overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 font-mono text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-150 border-r border-white/[0.06] last:border-r-0 ${
              tab === t ? 'bg-cyber/[0.1] text-cyber' : 'text-[#555] hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="blade p-5">
            <h3 className="font-mono text-[10px] font-black text-[#555] uppercase tracking-[0.2em] mb-4">SKILL MAP</h3>
            <SkillRadar skills={stats?.skills || {}} />
          </div>
          <div className="blade p-5">
            <h3 className="font-mono text-[10px] font-black text-[#555] uppercase tracking-[0.2em] mb-4">ACTIVITY — 12 WEEKS</h3>
            <Heatmap logs={stats?.activityLogs || []} />
            <div className="flex justify-between mt-3">
              <span className="font-mono text-[9px] text-[#333] uppercase">12 WEEKS AGO</span>
              <span className="font-mono text-[9px] text-[#333] uppercase">TODAY</span>
            </div>
          </div>
        </div>
      )}

      {/* BADGES */}
      {tab === 'BADGES' && (
        <div className="blade p-5">
          <h3 className="font-mono text-[10px] font-black text-[#555] uppercase tracking-[0.2em] mb-5">
            BADGE COLLECTION ({profile.badges?.length || 0})
          </h3>
          {!(profile.badges?.length) ? (
            <p className="font-mono text-[11px] text-[#444] text-center py-10 uppercase tracking-wider">
              NO BADGES YET — COMPLETE COURSES TO EARN THEM
            </p>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {profile.badges.map(({ badge }) => {
                const rc = RARITY_COLOR[badge.rarity] || RARITY_COLOR.common;
                return (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center gap-2 p-4 rounded-[4px] text-center"
                    style={{ border: `1px solid ${rc.border}`, background: rc.bg }}
                  >
                    <div
                      className="w-10 h-10 rounded-[4px] flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                      <Trophy size={16} strokeWidth={1.5} style={{ color: rc.text }} />
                    </div>
                    <span className="font-mono text-[10px] font-bold leading-tight uppercase" style={{ color: rc.text }}>
                      {badge.name}
                    </span>
                    <span className="font-mono text-[9px] font-bold text-[#444] uppercase tracking-wider">
                      {badge.rarity}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* COURSES */}
      {tab === 'COURSES' && (
        <div className="blade overflow-hidden">
          <div className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="font-mono text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">ENROLLED COURSES</h3>
          </div>
          <div>
            {!(profile.enrollments?.length) ? (
              <p className="px-5 py-10 font-mono text-[11px] text-[#444] uppercase tracking-wider text-center">NO ENROLLMENTS YET</p>
            ) : profile.enrollments.map((e, i) => (
              <div
                key={e.id}
                className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors duration-150"
                style={{ borderBottom: i < profile.enrollments.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
              >
                <div className="w-8 h-8 rounded-[4px] border border-cyber/20 bg-cyber/[0.06] flex items-center justify-center flex-shrink-0">
                  <BookOpen size={13} strokeWidth={1.5} className="text-cyber" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate font-medium">{e.course?.title}</p>
                </div>
                {e.completedAt
                  ? <BadgeTag variant="teal">DONE</BadgeTag>
                  : <BadgeTag variant="gray">IN PROGRESS</BadgeTag>
                }
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVITY */}
      {tab === 'ACTIVITY' && (
        <div className="blade p-5">
          <h3 className="font-mono text-[10px] font-black text-[#555] uppercase tracking-[0.2em] mb-5">FULL ACTIVITY LOG</h3>
          <Heatmap logs={stats?.activityLogs || []} />
          <div className="mt-5 space-y-1">
            {(stats?.activityLogs || []).slice(0, 14).filter(l => l.xpEarned > 0).map(l => (
              <div
                key={l.id}
                className="flex items-center gap-3 py-2.5 px-1"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <Zap size={11} strokeWidth={1.5} className="text-amber-400" />
                <span className="font-mono text-[11px] font-bold text-[#555] uppercase">{format(new Date(l.date), 'MMM d, yyyy')}</span>
                <span className="font-mono text-[11px] font-black text-cyber ml-auto">+{l.xpEarned} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

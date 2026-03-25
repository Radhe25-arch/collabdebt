import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { Avatar, BadgeTag, Spinner } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';

const TABS = [
  { key: 'global',   label: 'Global',     icon: Icons.Globe },
  { key: 'weekly',   label: 'Weekly',     icon: Icons.Calendar },
  { key: 'friends',  label: 'Friends',    icon: Icons.Users },
];

const CATEGORIES = [
  { slug: 'web-dev',    label: 'Web Dev' },
  { slug: 'python',     label: 'Python' },
  { slug: 'javascript', label: 'JavaScript' },
  { slug: 'dsa',        label: 'DSA' },
];

const LEVEL_NAMES = ['Beginner','Apprentice','Coder','Developer','Senior Dev','Architect','Pro','Expert','Master','Legend'];

function RankDisplay({ rank }) {
  if (rank === 1) return (
    <div className="w-8 h-8 rounded-full bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center">
      <Icons.Trophy size={13} className="text-yellow-400" />
    </div>
  );
  if (rank === 2) return (
    <div className="w-8 h-8 rounded-full bg-slate-500/15 border border-slate-500/30 flex items-center justify-center">
      <Icons.Trophy size={13} className="text-slate-400" />
    </div>
  );
  if (rank === 3) return (
    <div className="w-8 h-8 rounded-full bg-amber-700/15 border border-amber-700/30 flex items-center justify-center">
      <Icons.Trophy size={13} className="text-amber-600" />
    </div>
  );
  return (
    <div className="w-8 h-8 flex items-center justify-center">
      <span className="font-mono text-xs text-slate-500">#{rank}</span>
    </div>
  );
}

function LeaderboardRow({ entry, isMe }) {
  const lvl = Math.min(entry.level || 1, 10);
  return (
    <div className={`flex items-center gap-4 px-5 py-3.5 border-b border-slate-200/40 last:border-0 transition-colors ${
      isMe ? 'bg-indigo-600/5 border-l-2 border-l-arena-teal' : 'hover:bg-slate-100/50'
    }`}>
      <RankDisplay rank={entry.rank} />
      <Avatar user={entry} size={36} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-mono text-sm font-bold ${isMe ? 'text-indigo-600' : 'text-slate-900'}`}>
            {entry.username}
            {isMe && <span className="text-xs text-indigo-600 ml-1">(you)</span>}
          </span>
          {entry.streak > 6 && (
            <div className="flex items-center gap-0.5 text-orange-400">
              <Icons.Fire size={11} />
              <span className="font-mono text-xs">{entry.streak}</span>
            </div>
          )}
        </div>
        <span className="font-mono text-xs text-slate-500">{LEVEL_NAMES[lvl - 1]} · Level {lvl}</span>
      </div>

      {/* Courses completed */}
      <div className="hidden md:flex flex-col items-end">
        <span className="font-mono text-xs text-slate-900">{entry.coursesCompleted || 0}</span>
        <span className="font-mono text-xs text-slate-500">courses</span>
      </div>

      {/* XP */}
      <div className="flex items-center gap-1.5 min-w-[90px] justify-end">
        <Icons.Zap size={11} className="text-blue-700" />
        <span className={`font-mono text-sm font-bold ${isMe ? 'text-indigo-600' : 'text-blue-700'}`}>
          {(entry.xp || entry.weeklyXP || 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const { user } = useAuthStore();
  const [tab, setTab]             = useState('global');
  const [catSlug, setCatSlug]     = useState(null);
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(false);

  const fetchData = async (t, cat) => {
    setLoading(true);
    try {
      let url = `/leaderboard/${t}`;
      if (t === 'category' && cat) url = `/leaderboard/category/${cat}`;
      const res = await api.get(url);
      setData(res.data);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchData(tab, catSlug);
  }, [tab, catSlug]);

  const entries = data?.users || [];
  const myRank  = data?.myRank;
  const myEntry = entries.find((e) => e.id === user?.id);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-display font-black text-2xl mb-1">Leaderboard</h1>
        <p className="font-mono text-xs text-slate-500">// compete globally, weekly, or by category</p>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
        {TABS.map(({ key, label, icon: Ic }) => (
          <button
            key={key}
            onClick={() => { setTab(key); setCatSlug(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-mono transition-all ${
              tab === key && !catSlug
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ic size={13} />
            {label}
          </button>
        ))}
        <button
          onClick={() => { setTab('category'); if (!catSlug) setCatSlug(CATEGORIES[0].slug); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-mono transition-all ${
            tab === 'category'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Icons.Target size={13} />
          Category
        </button>
      </div>

      {/* Category selector */}
      {tab === 'category' && (
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(({ slug, label }) => (
            <button
              key={slug}
              onClick={() => setCatSlug(slug)}
              className={`badge-tag font-mono text-xs transition-all ${
                catSlug === slug ? 'badge-purple' : 'badge-gray hover:badge-purple'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Top 3 podium */}
      {!loading && entries.length >= 3 && (
        <div className="grid grid-cols-3 gap-3">
          {[entries[1], entries[0], entries[2]].map((e, i) => {
            const podPos   = [2, 1, 3][i];
            const heights  = ['h-20', 'h-28', 'h-16'];
            const colors   = ['bg-slate-500/10 border-slate-500/20', 'bg-yellow-500/10 border-yellow-500/20', 'bg-amber-700/10 border-amber-700/20'];
            return (
              <div key={e.id} className={`arena-card p-4 flex flex-col items-center ${i === 1 ? 'ring-1 ring-yellow-500/30' : ''}`}>
                <RankDisplay rank={podPos} />
                <Avatar user={e} size={40} className="mt-2 mb-2" />
                <span className="font-mono text-xs text-slate-900 font-bold truncate w-full text-center">{e.username}</span>
                <div className="flex items-center gap-1 mt-1">
                  <Icons.Zap size={9} className="text-blue-700" />
                  <span className="font-mono text-xs text-blue-700">{(e.xp || e.weeklyXP || 0).toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table */}
      <div className="arena-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">
            {tab === 'weekly' ? 'This Week' : tab === 'category' ? catSlug?.toUpperCase() : 'All Time'} Rankings
          </span>
          <span className="font-mono text-xs text-slate-500">{entries.length} users</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size={24} className="text-blue-700" />
          </div>
        ) : entries.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-mono text-xs text-slate-500">No data yet. Be the first on the board.</p>
          </div>
        ) : (
          <div>
            {entries.map((e) => (
              <LeaderboardRow key={e.id} entry={e} isMe={e.id === user?.id} />
            ))}
          </div>
        )}

        {/* My rank if not visible */}
        {!loading && myRank && !myEntry && (
          <div className="border-t border-dashed border-slate-200">
            <div className="flex items-center gap-4 px-5 py-3.5 bg-indigo-600/5">
              <span className="font-mono text-xs text-indigo-600 font-bold">#{myRank}</span>
              <Avatar user={user} size={36} />
              <div className="flex-1">
                <span className="font-mono text-xs text-indigo-600">{user?.username} (you)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icons.Zap size={11} className="text-indigo-600" />
                <span className="font-mono text-sm font-bold text-indigo-600">{user?.xp?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

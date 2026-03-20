import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { Avatar } from '@/components/ui';
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
    <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-300 shadow-sm flex items-center justify-center">
      <Icons.Trophy size={18} className="text-amber-500" />
    </div>
  );
  if (rank === 2) return (
    <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-300 shadow-sm flex items-center justify-center">
      <Icons.Trophy size={18} className="text-slate-500" />
    </div>
  );
  if (rank === 3) return (
    <div className="w-10 h-10 rounded-full bg-amber-50 border-2 border-amber-700/30 shadow-sm flex items-center justify-center">
      <Icons.Trophy size={18} className="text-amber-700" />
    </div>
  );
  return (
    <div className="w-10 h-10 flex items-center justify-center text-center">
      <span className="font-bold text-slate-400">#{rank}</span>
    </div>
  );
}

function LeaderboardRow({ entry, isMe }) {
  const lvl = Math.min(entry.level || 1, 10);
  return (
    <div className={`flex items-center gap-5 px-6 py-4 border-b border-slate-100 last:border-0 transition-colors ${
      isMe ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-slate-50'
    }`}>
      <RankDisplay rank={entry.rank} />
      <Avatar user={entry} size={44} className="shadow-sm border border-slate-200 ring-2 ring-white" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-bold text-lg ${isMe ? 'text-blue-700' : 'text-slate-900'} leading-none`}>
            {entry.username}
            {isMe && <span className="text-xs text-blue-600 ml-2 uppercase tracking-widest bg-blue-100 px-2 py-0.5 rounded-full">You</span>}
          </span>
          {entry.streak > 6 && (
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <Icons.Fire size={12} className="text-amber-500" />
              <span className="font-bold text-xs text-amber-600">{entry.streak}</span>
            </div>
          )}
        </div>
        <span className="text-sm font-medium text-slate-500 mt-1 block">{LEVEL_NAMES[lvl - 1]} · Level {lvl}</span>
      </div>

      <div className="hidden md:flex flex-col items-end mr-8">
        <span className="font-bold text-slate-900 text-lg leading-none">{entry.coursesCompleted || 0}</span>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Courses</span>
      </div>

      <div className="flex flex-col items-end justify-center min-w-[90px]">
        <span className={`font-black text-2xl leading-none ${isMe ? 'text-blue-600' : 'text-slate-900'}`}>
          {(entry.xp || entry.weeklyXP || 0).toLocaleString()} <span className="text-sm font-bold text-slate-400">XP</span>
        </span>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const { user } = useAuthStore();
  const [tab, setTab]         = useState('global');
  const [catSlug, setCatSlug] = useState(null);
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);

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
    <div className="space-y-8 max-w-4xl mx-auto pb-20 font-sans animate-fade-in">
      {/* Header */}
      <div className="text-center pt-4">
        <span className="bg-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block">
          RANKINGS
        </span>
        <h1 className="font-display font-black text-4xl text-slate-900 mb-2 tracking-tight">Leaderboard</h1>
        <p className="text-slate-500 max-w-lg mx-auto">Compete globally or among friends. Climb the ranks to prove your mastery.</p>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-2xl p-1.5 shadow-inner mx-auto max-w-xl">
        {TABS.map(({ key, label, icon: Ic }) => (
          <button
            key={key}
            onClick={() => { setTab(key); setCatSlug(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-bold transition-all ${
              tab === key && !catSlug
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Ic size={16} />
            {label}
          </button>
        ))}
        <button
          onClick={() => { setTab('category'); if (!catSlug) setCatSlug(CATEGORIES[0].slug); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-bold transition-all ${
            tab === 'category'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Icons.Target size={16} />
          Category
        </button>
      </div>

      {/* Category selector */}
      {tab === 'category' && (
        <div className="flex gap-2 flex-wrap justify-center animate-fade-in">
          {CATEGORIES.map(({ slug, label }) => (
            <button
              key={slug}
              onClick={() => setCatSlug(slug)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                catSlug === slug ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Top 3 podium */}
      {!loading && entries.length >= 3 && (
        <div className="grid grid-cols-3 gap-6 pt-6">
          {[entries[1], entries[0], entries[2]].map((e, i) => {
            const podPos   = [2, 1, 3][i];
            const heights  = ['pt-6', 'pt-2 scale-105 z-10 -mt-4', 'pt-8'];
            const colors   = ['bg-gradient-to-b from-slate-100 to-white border-slate-200', 'bg-gradient-to-b from-amber-50 to-white border-amber-200 shadow-lg', 'bg-gradient-to-b from-orange-50 to-white border-orange-200'];
            
            return (
              <div key={e.id} className={`rounded-3xl border flex flex-col items-center p-6 transition-transform hover:-translate-y-1 ${heights[i]} ${colors[i]} shadow-sm`}>
                <RankDisplay rank={podPos} />
                <Avatar user={e} size={72} className="mt-4 mb-3 shadow-md border-2 border-white" />
                <span className="font-bold text-slate-900 text-lg truncate w-full text-center tracking-tight">{e.username}</span>
                <div className="flex items-center gap-1.5 mt-2 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                  <Icons.Zap size={14} className={i === 1 ? "text-amber-500" : "text-blue-500"} />
                  <span className={`font-black text-sm ${i === 1 ? "text-amber-600" : "text-blue-600"}`}>{(e.xp || e.weeklyXP || 0).toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <span className="font-bold text-sm text-slate-500 uppercase tracking-widest">
            {tab === 'weekly' ? 'This Week\'s' : tab === 'category' ? catSlug?.toUpperCase() : 'All Time'} Ranking
          </span>
          <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{entries.length} Hackers</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-medium text-slate-500">No data found in this category.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {entries.map((e) => (
              <LeaderboardRow key={e.id} entry={e} isMe={e.id === user?.id} />
            ))}
          </div>
        )}

        {/* My rank if not visible */}
        {!loading && myRank && !myEntry && (
          <div className="border-t border-slate-200 bg-blue-50">
            <div className="flex items-center gap-5 px-6 py-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <span className="font-black text-blue-600">#{myRank}</span>
              </div>
              <Avatar user={user} size={44} className="border-2 border-white shadow-sm" />
              <div className="flex-1">
                <span className="font-bold text-lg text-blue-700 leading-none block">{user?.username} <span className="text-xs uppercase tracking-widest ml-1 bg-blue-100 px-2 py-0.5 rounded-full text-blue-600">You</span></span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-black text-2xl text-blue-600">
                  {user?.xp?.toLocaleString()} <span className="text-sm font-bold text-blue-400">XP</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

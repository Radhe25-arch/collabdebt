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
    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg shadow-slate-100">
      <Icons.Trophy size={14} className="text-yellow-400" />
    </div>
  );
  if (rank === 2) return (
    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
      <Icons.Trophy size={14} className="text-slate-400" />
    </div>
  );
  if (rank === 3) return (
    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
      <Icons.Trophy size={14} className="text-amber-700" />
    </div>
  );
  return (
    <div className="w-9 h-9 flex items-center justify-center">
      <span className="font-mono text-xs font-bold text-slate-400">#{rank}</span>
    </div>
  );
}

function LeaderboardRow({ entry, isMe }) {
  const lvl = Math.min(entry.level || 1, 10);
  return (
    <div className={`flex items-center gap-4 px-6 py-4 border-b border-slate-100 last:border-0 transition-all ${
      isMe ? 'bg-blue-50/30' : 'hover:bg-slate-50'
    }`}>
      <RankDisplay rank={entry.rank} />
      <Avatar user={entry} size={36} className="bg-slate-100 rounded-full" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold truncate ${isMe ? 'text-blue-600' : 'text-slate-900'}`}>
            {entry.username}
            {isMe && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded ml-2 uppercase tracking-widest font-black text-[8px]">YOU</span>}
          </span>
          {entry.streak > 6 && (
            <div className="flex items-center gap-1 text-blue-500">
              <Icons.Zap size={10} />
              <span className="font-mono text-[10px] font-bold">{entry.streak}</span>
            </div>
          )}
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{LEVEL_NAMES[lvl - 1]} · LVL {lvl}</p>
      </div>

      <div className="flex items-center gap-2 justify-end min-w-[100px]">
        <Icons.Zap size={12} className="text-slate-900" />
        <span className={`font-mono text-sm font-black ${isMe ? 'text-blue-600' : 'text-slate-900'}`}>
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
  const [loading, setLoading]     = useState(true);

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

  return (
    <div className="max-w-4xl mx-auto pb-24 pt-10 px-6 space-y-12">
      
      {/* ── HEADER ── */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Icons.Leaderboard size={20} className="text-blue-600" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Standings</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hall of Fame</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Refuting the Status Quo through code execution.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {TABS.map(({ key, label, icon: Ic }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setCatSlug(null); }}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${
                tab === key && !catSlug
                  ? 'bg-white shadow-sm text-slate-900'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Ic size={12} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Podium Side (Refined) */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest border-l-2 border-slate-900 pl-4 py-1">Top Performers</h2>
          <div className="space-y-3">
             {entries.slice(0, 3).map((e, i) => (
                <div key={e.id} className="sf-card p-4 flex items-center justify-between border-slate-200 hover:border-blue-400 transition-all group">
                   <div className="flex items-center gap-3">
                      <RankDisplay rank={i + 1} />
                      <div>
                         <p className="text-sm font-black text-slate-900 truncate uppercase tracking-tight">{e.username}</p>
                         <p className="text-[10px] font-bold text-blue-600 mt-0.5">{(e.xp || 0).toLocaleString()} XP</p>
                      </div>
                   </div>
                </div>
             ))}
          </div>
          
          <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Weekly Yields</p>
             <h4 className="font-bold text-lg leading-tight">Total System XP Generated: <span className="text-blue-400">1.2M+</span></h4>
             <p className="text-xs text-slate-400 leading-relaxed">Top players this week will unlock the <span className="text-white font-bold">'Precision Engineer'</span> badge automatically.</p>
          </div>
        </div>

        {/* List Side */}
        <div className="lg:col-span-2">
          <div className="sf-card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Ranking Pool</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">{entries.length} Nodes</span>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Spinner size={24} className="text-slate-300" /></div>
            ) : entries.length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-sm italic font-medium">No system data available for this segment.</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {entries.map((e) => (
                  <LeaderboardRow key={e.id} entry={e} isMe={e.id === user?.id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

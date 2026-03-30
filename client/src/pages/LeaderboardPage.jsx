import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store';
import { Avatar, Spinner } from '@/components/ui';
import Icons from '@/assets/icons';

// ─── SEEDED PRNG (Mulberry32) ─────────────────────────────
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ─── DATA POOLS ───────────────────────────────────────────
const FIRST_NAMES = [
  'Aarav','Aditi','Alex','Amira','Ananya','Arjun','Aisha','Benjamin','Carlos','Chen',
  'Clara','Daniel','David','Elena','Emma','Ethan','Fatima','Gabriel','Hannah','Hugo',
  'Isabella','James','Jordan','Kai','Liam','Lucia','Maria','Mateo','Maya','Mei',
  'Mohammed','Nadia','Nathan','Neha','Noah','Olivia','Omar','Priya','Quinn','Rafael',
  'Ravi','Sakura','Samuel','Sara','Sofia','Soren','Tanya','Theo','Uma','Viktor',
  'Wei','Xander','Yuki','Zara','Zoe','Marco','Skyler','Thorsten','Ava','Charlotte',
  'Sophia','Amelia','Harper','Lucas','Elijah','Aiden','Juan','Ahmed','Ali','Miguel',
  'Luna','Leo','Mila','Aria','Riley','Chloe','Layla','Lily','Eleanor','Grace',
  'Ryan','Owen','Dylan','Jack','Luke','Jayden','Isaac','Andrew','Joshua','Nathan',
  'Caleb','Hunter','Connor','Adrian','Nolan','Axel','Jasper','Rowan','Felix','Silas',
];
const LAST_NAMES = [
  'Rivera','Chen','Thorne','Vance','Park','Hayes','OShea','Lin','Shah','Kulkarni',
  'Diaz','Garcia','Martinez','Rodriguez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor',
  'Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark',
  'Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Torres',
  'Nguyen','Hill','Flores','Green','Adams','Nelson','Baker','Hall','Campbell','Mitchell',
  'Patel','Kim','Nakamura','Tanaka','Mueller','Fischer','Schmidt','Weber','Ivanov','Petrov',
  'Singh','Sharma','Gupta','Verma','Khan','Ali','Ahmed','Yamamoto','Sato','Suzuki',
  'Olsen','Berg','Larsen','Johansson','Eriksson','Costa','Santos','Oliveira','Silva','Ferreira',
  'Novak','Kowalski','Horvat','Brown','Davis','Miller','Jones','Williams','Johnson','Smith',
  'Fox','Reed','Ross','Cole','Blake','Quinn','Nash','Grant','Wells','Burns',
];

const BADGE_MAP = [
  { name: 'Code Warrior',       emoji: '⚔️',  color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200' },
  { name: 'Speed Demon',        emoji: '⚡',   color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200' },
  { name: 'Bug Hunter',         emoji: '🐛',   color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
  { name: 'Algorithm Pro',      emoji: '🧮',   color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  { name: 'Full Stack',         emoji: '🏗️',  color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
  { name: 'Open Source',        emoji: '🌐',   color: 'text-cyan-600',   bg: 'bg-cyan-50',   border: 'border-cyan-200' },
  { name: 'Night Owl',          emoji: '🦉',   color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { name: 'Early Bird',         emoji: '🐦',   color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { name: 'Team Player',        emoji: '🤝',   color: 'text-teal-600',   bg: 'bg-teal-50',   border: 'border-teal-200' },
  { name: 'Streak Master',      emoji: '🔥',   color: 'text-rose-600',   bg: 'bg-rose-50',   border: 'border-rose-200' },
  { name: 'Quiz Champion',      emoji: '🏆',   color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { name: 'Fast Learner',       emoji: '📚',   color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-200' },
  { name: 'Pythonista',         emoji: '🐍',   color: 'text-sky-600',    bg: 'bg-sky-50',    border: 'border-sky-200' },
  { name: 'JS Ninja',           emoji: '🥷',   color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { name: 'Data Wizard',        emoji: '🧙',   color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { name: 'Security Expert',    emoji: '🛡️',  color: 'text-slate-600',  bg: 'bg-slate-50',  border: 'border-slate-200' },
  { name: 'Cloud Architect',    emoji: '☁️',   color: 'text-blue-500',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  { name: 'Mobile Dev',         emoji: '📱',   color: 'text-pink-600',   bg: 'bg-pink-50',   border: 'border-pink-200' },
  { name: 'DevOps Pro',         emoji: '🔧',   color: 'text-gray-600',   bg: 'bg-gray-50',   border: 'border-gray-200' },
  { name: 'AI Engineer',        emoji: '🤖',   color: 'text-fuchsia-600',bg: 'bg-fuchsia-50',border: 'border-fuchsia-200' },
];

const XP_THRESHOLDS = [0, 500, 1200, 2500, 4500, 7500, 12000, 18000, 26000, 36000];
const LEVEL_NAMES = ['Beginner', 'Apprentice', 'Coder', 'Developer', 'Senior Dev', 'Architect', 'Pro', 'Expert', 'Master', 'Legend'];
const LEVEL_COLORS = [
  'text-slate-500', 'text-green-600', 'text-teal-600', 'text-blue-600', 'text-indigo-600',
  'text-violet-600', 'text-purple-600', 'text-amber-600', 'text-rose-600', 'text-red-600',
];

function getLevel(xp) {
  let level = 1;
  for (let l = 0; l < XP_THRESHOLDS.length; l++) {
    if (xp >= XP_THRESHOLDS[l]) level = l + 1;
  }
  return Math.min(level, 10);
}

// ─── GENERATE 25K USERS (deterministic) ───────────────────
function generateUsers(count, seed = 77777) {
  const rng = mulberry32(seed);
  const users = [];
  const usedNames = new Set();

  for (let i = 0; i < count; i++) {
    const fIdx = Math.floor(rng() * FIRST_NAMES.length);
    const lIdx = Math.floor(rng() * LAST_NAMES.length);
    const firstName = FIRST_NAMES[fIdx];
    const lastName = LAST_NAMES[lIdx];
    const suffix = Math.floor(rng() * 9999);

    let username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}${suffix}`;
    while (usedNames.has(username)) {
      username += Math.floor(rng() * 10);
    }
    usedNames.add(username);

    // XP distribution: exponential-ish curve — more people at lower XP
    const raw = rng();
    const xp = Math.floor(Math.pow(raw, 0.6) * 48000) + Math.floor(rng() * 2000);
    const level = getLevel(xp);
    const streak = Math.floor(Math.pow(rng(), 1.5) * 365);
    const badge = BADGE_MAP[Math.floor(rng() * BADGE_MAP.length)];
    const coursesCompleted = Math.floor(rng() * level * 4);
    const joinedDaysAgo = Math.floor(rng() * 730) + 1;

    users.push({
      id: `sf_user_${i}`,
      username,
      fullName: `${firstName} ${lastName}`,
      xp,
      level,
      streak,
      badge,
      coursesCompleted,
      joinedDaysAgo,
      avatarHue: Math.floor(rng() * 360),
    });
  }

  // Sort by XP descending
  users.sort((a, b) => b.xp - a.xp);
  users.forEach((u, i) => { u.rank = i + 1; });
  return users;
}

// ─── TABS ─────────────────────────────────────────────────
const TABS = [
  { key: 'global', label: 'Global',  icon: Icons.Globe },
  { key: 'weekly', label: 'Weekly',  icon: Icons.Calendar },
  { key: 'rising', label: 'Rising',  icon: Icons.TrendingUp },
];

const PER_PAGE = 100;

// ─── USER AVATAR (deterministic color) ────────────────────
function UserAvatar({ user, size = 36 }) {
  if (user.avatarUrl) {
    return <img src={user.avatarUrl} alt="" className="rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  const hue = user.avatarHue || (user.username?.charCodeAt(0) * 7) % 360;
  const initials = (user.fullName || user.username || '??').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white text-xs tracking-tight"
      style={{
        width: size, height: size,
        background: `linear-gradient(135deg, hsl(${hue}, 70%, 55%), hsl(${(hue + 40) % 360}, 60%, 45%))`,
      }}
    >
      {initials}
    </div>
  );
}

// ─── RANK DISPLAY ─────────────────────────────────────────
function RankDisplay({ rank }) {
  if (rank === 1) return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-200/50">
      <Icons.Trophy size={16} className="text-white" />
    </div>
  );
  if (rank === 2) return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center shadow-lg shadow-slate-200/50">
      <Icons.Trophy size={16} className="text-white" />
    </div>
  );
  if (rank === 3) return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-200/50">
      <Icons.Trophy size={16} className="text-white" />
    </div>
  );
  return (
    <div className="w-10 h-10 flex items-center justify-center">
      <span className="font-mono text-xs font-black text-slate-400">#{rank.toLocaleString()}</span>
    </div>
  );
}

// ─── LEADERBOARD ROW ──────────────────────────────────────
function LeaderboardRow({ entry, isMe }) {
  const lvl = Math.min(entry.level || 1, 10);
  const badge = entry.badge || BADGE_MAP[0];

  return (
    <div className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 border-b border-slate-100 last:border-0 transition-all ${
      isMe ? 'bg-blue-50/60 border-l-4 !border-l-blue-500' : 'hover:bg-slate-50/80'
    }`}>
      <RankDisplay rank={entry.rank} />
      <UserAvatar user={entry} size={38} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-bold truncate ${isMe ? 'text-blue-600' : 'text-slate-900'}`}>
            {entry.fullName || entry.username}
          </span>
          {isMe && (
            <span className="text-[8px] bg-blue-600 text-white px-1.5 py-0.5 rounded uppercase tracking-widest font-black">YOU</span>
          )}
          {entry.streak > 30 && (
            <span className="flex items-center gap-0.5 text-orange-500">
              <Icons.Fire size={10} />
              <span className="font-mono text-[10px] font-bold">{entry.streak}d</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${LEVEL_COLORS[lvl - 1]}`}>
            {LEVEL_NAMES[lvl - 1]}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-[10px] font-mono text-slate-400">LVL {lvl}</span>
          {badge && (
            <>
              <span className="text-slate-300">·</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${badge.bg} ${badge.border} ${badge.color}`}>
                {badge.emoji} {badge.name}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 justify-end min-w-[80px]">
        <Icons.Zap size={12} className="text-amber-500" />
        <span className={`font-mono text-sm font-black ${isMe ? 'text-blue-600' : 'text-slate-900'}`}>
          {(entry.xp || 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

// ─── YOUR RANK CARD ───────────────────────────────────────
function YourRankCard({ user, rank, totalUsers }) {
  if (!user || !rank) return null;
  const lvl = Math.min(user.level || 1, 10);
  const percentile = ((1 - rank / totalUsers) * 100).toFixed(1);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-blue-50 p-5 sm:p-6 shadow-sm">
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
      <div className="relative flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white font-black text-lg">#{rank.toLocaleString()}</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Your Global Ranking</p>
            <p className="text-lg font-black text-slate-900">{user.fullName || user.username}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-xs font-bold ${LEVEL_COLORS[lvl - 1]}`}>{LEVEL_NAMES[lvl - 1]}</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-mono text-slate-500">Level {lvl}</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                <Icons.Zap size={10} className="text-amber-500" /> {(user.xp || 0).toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-center px-4 py-2 rounded-xl bg-white border border-blue-100 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Percentile</p>
            <p className="text-xl font-black text-blue-600">Top {percentile}%</p>
          </div>
          <div className="text-center px-4 py-2 rounded-xl bg-white border border-blue-100 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Streak</p>
            <p className="text-xl font-black text-orange-500 flex items-center justify-center gap-1">
              <Icons.Fire size={16} /> {user.streak || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────
export default function LeaderboardPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState('global');
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);
  const [searchQuery, setSearchQuery] = useState('');

  // Generate 25K users (memoized, only computed once)
  const allUsers = useMemo(() => generateUsers(25000), []);

  // Merge real user into the list
  const { mergedUsers, myRank } = useMemo(() => {
    if (!user) return { mergedUsers: allUsers, myRank: null };

    const userXp = user.xp || 0;
    // Find where the user would slot in
    let insertIdx = allUsers.findIndex(u => u.xp <= userXp);
    if (insertIdx === -1) insertIdx = allUsers.length;
    const rank = insertIdx + 1;

    // Build merged list with user inserted at proper position
    const merged = [...allUsers];
    merged.splice(insertIdx, 0, {
      id: user.id,
      username: user.username,
      fullName: user.fullName || user.username,
      avatarUrl: user.avatarUrl,
      xp: userXp,
      level: user.level || 1,
      streak: user.streak || 0,
      badge: BADGE_MAP[Math.floor(((user.username?.charCodeAt(0) || 0) * 7) % BADGE_MAP.length)],
      coursesCompleted: user.coursesCompleted || 0,
      isRealUser: true,
    });

    // Re-rank
    merged.forEach((u, i) => { u.rank = i + 1; });

    return { mergedUsers: merged, myRank: rank };
  }, [allUsers, user]);

  // Filter by tab
  const filteredUsers = useMemo(() => {
    let list = mergedUsers;

    if (tab === 'weekly') {
      // Simulate weekly by using a different sort — top gainers (higher streaks = more active)
      list = [...mergedUsers].sort((a, b) => {
        const aWeekly = Math.floor((a.xp * (a.streak || 1)) / 100);
        const bWeekly = Math.floor((b.xp * (b.streak || 1)) / 100);
        return bWeekly - aWeekly;
      }).map((u, i) => ({ ...u, rank: i + 1 }));
    } else if (tab === 'rising') {
      // Rising stars: lower level but high XP relative to level
      list = [...mergedUsers]
        .filter(u => u.level <= 6)
        .sort((a, b) => b.xp - a.xp)
        .map((u, i) => ({ ...u, rank: i + 1 }));
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(u =>
        u.username?.toLowerCase().includes(q) ||
        u.fullName?.toLowerCase().includes(q)
      ).map((u, i) => ({ ...u, rank: i + 1 }));
    }

    return list;
  }, [mergedUsers, tab, searchQuery]);

  const visibleUsers = filteredUsers.slice(0, visibleCount);
  const hasMore = visibleCount < filteredUsers.length;

  const loadMore = () => setVisibleCount(v => Math.min(v + PER_PAGE, filteredUsers.length));

  // Reset visible count when tab changes
  useEffect(() => {
    setVisibleCount(PER_PAGE);
  }, [tab, searchQuery]);

  // Top 3 for podium
  const podium = filteredUsers.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto pb-24 pt-6 px-4 sm:px-6 space-y-8">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Icons.Leaderboard size={16} className="text-white" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Standings</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hall of Fame</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {filteredUsers.length.toLocaleString()} engineers competing worldwide
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {TABS.map(({ key, label, icon: Ic }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${
                tab === key
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

      {/* ── YOUR RANK CARD ── */}
      {user && myRank && (
        <YourRankCard user={user} rank={myRank} totalUsers={mergedUsers.length} />
      )}

      {/* ── CONTENT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Podium Side */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest border-l-2 border-slate-900 pl-4 py-1">
            Top Performers
          </h2>
          <div className="space-y-3">
            {podium.map((e, i) => (
              <div key={e.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 transition-all group shadow-sm">
                <div className="flex items-center gap-3">
                  <RankDisplay rank={i + 1} />
                  <UserAvatar user={e} size={40} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 truncate">{e.fullName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-bold ${LEVEL_COLORS[e.level - 1]}`}>
                        {LEVEL_NAMES[e.level - 1]}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[10px] font-bold text-blue-600">{(e.xp || 0).toLocaleString()} XP</span>
                    </div>
                    {e.badge && (
                      <span className={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${e.badge.bg} ${e.badge.border} ${e.badge.color}`}>
                        {e.badge.emoji} {e.badge.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Card */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Platform Stats</p>
            <h4 className="font-bold text-lg leading-tight">
              Total XP Generated: <span className="text-blue-400">12.8M+</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Users</p>
                <p className="text-lg font-black text-white mt-1">25,001</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Avg Level</p>
                <p className="text-lg font-black text-blue-400 mt-1">5.2</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              Top players this week unlock the <span className="text-white font-bold">'Precision Engineer'</span> badge automatically.
            </p>
          </div>

          {/* Level Distribution */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Level Distribution</p>
            {LEVEL_NAMES.map((name, i) => {
              const count = allUsers.filter(u => u.level === i + 1).length;
              const pct = ((count / allUsers.length) * 100).toFixed(1);
              return (
                <div key={name} className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold w-20 ${LEVEL_COLORS[i]}`}>{name}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 w-12 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* List Side */}
        <div className="lg:col-span-2">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search players..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 ring-blue-50 transition-all"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="px-6 py-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {tab === 'global' ? 'Global Rankings' : tab === 'weekly' ? 'Weekly Leaders' : 'Rising Stars'}
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                Showing {visibleUsers.length.toLocaleString()} of {filteredUsers.length.toLocaleString()}
              </span>
            </div>

            {visibleUsers.length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-sm italic font-medium">
                No players match your search.
              </div>
            ) : (
              <div>
                {visibleUsers.map((e) => (
                  <LeaderboardRow
                    key={e.id + '_' + e.rank}
                    entry={e}
                    isMe={e.isRealUser || e.id === user?.id}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            {hasMore && (
              <div className="px-6 py-4 border-t border-slate-100 text-center">
                <button
                  onClick={loadMore}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Load More
                  <span className="text-slate-400 font-normal">
                    ({Math.min(PER_PAGE, filteredUsers.length - visibleCount).toLocaleString()} more)
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}

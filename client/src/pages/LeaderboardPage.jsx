import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store';
import { Avatar } from '@/components/ui';
import { Globe, Calendar, TrendingUp, Search, Flame, Zap, Trophy, ChevronRight } from 'lucide-react';

// ─── SEEDED PRNG ──────────────────────────────────────────
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const FIRST_NAMES = [
  'Aarav','Aditi','Alex','Amira','Ananya','Arjun','Aisha','Benjamin','Carlos','Chen',
  'Clara','Daniel','David','Elena','Emma','Ethan','Fatima','Gabriel','Hannah','Hugo',
  'Isabella','James','Jordan','Kai','Liam','Lucia','Maria','Mateo','Maya','Mei',
  'Mohammed','Nadia','Nathan','Neha','Noah','Olivia','Omar','Priya','Quinn','Rafael',
  'Ravi','Sakura','Samuel','Sara','Sofia','Soren','Tanya','Theo','Uma','Viktor',
  'Wei','Xander','Yuki','Zara','Zoe','Marco','Skyler','Thorsten','Ava','Charlotte',
  'Sophia','Amelia','Harper','Lucas','Elijah','Aiden','Juan','Ahmed','Ali','Miguel',
  'Luna','Leo','Mila','Aria','Riley','Chloe','Layla','Lily','Eleanor','Grace',
];
const LAST_NAMES = [
  'Rivera','Chen','Thorne','Vance','Park','Hayes','OShea','Lin','Shah','Kulkarni',
  'Diaz','Garcia','Martinez','Rodriguez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor',
  'Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark',
  'Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Torres',
  'Nguyen','Hill','Flores','Green','Adams','Nelson','Baker','Hall','Campbell','Mitchell',
  'Patel','Kim','Nakamura','Tanaka','Mueller','Fischer','Schmidt','Weber','Ivanov','Petrov',
  'Singh','Sharma','Gupta','Verma','Khan','Ali','Ahmed','Yamamoto','Sato','Suzuki',
];

const BADGE_POOL = [
  'CODE WARRIOR','SPEED DEMON','BUG HUNTER','ALGORITHM PRO','FULL STACK',
  'OPEN SOURCE','NIGHT OWL','EARLY BIRD','TEAM PLAYER','STREAK MASTER',
  'QUIZ CHAMPION','FAST LEARNER','PYTHONISTA','JS NINJA','DATA WIZARD',
  'SEC EXPERT','CLOUD ARCH','MOBILE DEV','DEVOPS PRO','AI ENGINEER',
];

const XP_THRESHOLDS = [0,500,1200,2500,4500,7500,12000,18000,26000,36000];
const LEVEL_NAMES   = ['BEGINNER','APPRENTICE','CODER','DEVELOPER','SENIOR DEV','ARCHITECT','PRO','EXPERT','MASTER','LEGEND'];

function getLevel(xp) {
  let level = 1;
  for (let l = 0; l < XP_THRESHOLDS.length; l++) {
    if (xp >= XP_THRESHOLDS[l]) level = l + 1;
  }
  return Math.min(level, 10);
}

function getLevelColor(lvl) {
  const colors = [
    '#555','#10B981','#06B6D4','#3B82F6','#6366F1',
    '#8B5CF6','#A855F7','#F59E0B','#EF4444','#DC2626',
  ];
  return colors[lvl - 1] || '#555';
}

function generateUsers(count, seed = 77777) {
  const rng = mulberry32(seed);
  const users = [];
  const usedNames = new Set();

  for (let i = 0; i < count; i++) {
    const firstName = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
    const lastName  = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
    const suffix    = Math.floor(rng() * 9999);
    let username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}${suffix}`;
    while (usedNames.has(username)) username += Math.floor(rng() * 10);
    usedNames.add(username);

    const raw = rng();
    const xp  = Math.floor(Math.pow(raw, 0.6) * 48000) + Math.floor(rng() * 2000);
    const level  = getLevel(xp);
    const streak = Math.floor(Math.pow(rng(), 1.5) * 365);
    const badge  = BADGE_POOL[Math.floor(rng() * BADGE_POOL.length)];

    users.push({
      id: `sf_user_${i}`,
      username,
      fullName: `${firstName} ${lastName}`,
      xp, level, streak, badge,
      coursesCompleted: Math.floor(rng() * level * 4),
      avatarHue: Math.floor(rng() * 360),
    });
  }
  users.sort((a, b) => b.xp - a.xp);
  users.forEach((u, i) => { u.rank = i + 1; });
  return users;
}

const TABS = [
  { key: 'global', label: 'GLOBAL',  Icon: Globe },
  { key: 'weekly', label: 'WEEKLY',  Icon: Calendar },
  { key: 'rising', label: 'RISING',  Icon: TrendingUp },
];

const PER_PAGE = 100;

// ─── USER AVATAR (deterministic) ─────────────────────────
function UserAvatar({ user, size = 36 }) {
  if (user.avatarUrl) {
    return <img src={user.avatarUrl} alt="" className="rounded-[4px] object-cover border border-white/10" style={{ width: size, height: size }} />;
  }
  const hue = user.avatarHue || (user.username?.charCodeAt(0) * 7) % 360;
  const initials = (user.fullName || user.username || '??').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div
      className="rounded-[4px] flex items-center justify-center font-mono font-black border border-white/10 flex-shrink-0"
      style={{
        width: size, height: size,
        fontSize: Math.max(size * 0.33, 9),
        background: `linear-gradient(135deg, hsl(${hue},40%,18%), hsl(${(hue+40)%360},35%,14%))`,
        color: `hsl(${hue},55%,65%)`,
      }}
    >
      {initials}
    </div>
  );
}

// ─── RANK DISPLAY ─────────────────────────────────────────
function RankBadge({ rank }) {
  if (rank === 1) return (
    <div className="w-9 h-9 rounded-[4px] flex items-center justify-center flex-shrink-0 metallic-gold">
      <Trophy size={14} strokeWidth={1.5} style={{ color: 'rgba(255,215,0,0.7)' }} />
    </div>
  );
  if (rank === 2) return (
    <div className="w-9 h-9 rounded-[4px] flex items-center justify-center flex-shrink-0 metallic-silver">
      <Trophy size={14} strokeWidth={1.5} style={{ color: 'rgba(192,192,192,0.7)' }} />
    </div>
  );
  if (rank === 3) return (
    <div className="w-9 h-9 rounded-[4px] flex items-center justify-center flex-shrink-0 metallic-bronze">
      <Trophy size={14} strokeWidth={1.5} style={{ color: 'rgba(205,127,50,0.7)' }} />
    </div>
  );
  return (
    <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
      <span className="font-mono text-[11px] font-black text-[#444]">#{rank.toLocaleString()}</span>
    </div>
  );
}

// ─── LEADERBOARD ROW ──────────────────────────────────────
function LeaderboardRow({ entry, isMe }) {
  const lvl = Math.min(entry.level || 1, 10);
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 transition-all duration-150 ${
        isMe
          ? 'bg-cyber/[0.05] border-l-2 border-l-cyber'
          : 'hover:bg-white/[0.02]'
      }`}
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <RankBadge rank={entry.rank} />
      <UserAvatar user={entry} size={34} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-mono text-[12px] font-black truncate uppercase ${isMe ? 'text-cyber' : 'text-white'}`}>
            {entry.fullName || entry.username}
          </span>
          {isMe && (
            <span className="font-mono text-[8px] font-black bg-cyber text-black px-1.5 py-0.5 rounded-[2px] uppercase tracking-wider">YOU</span>
          )}
          {entry.streak > 30 && (
            <span className="flex items-center gap-0.5 text-amber-400">
              <Flame size={10} strokeWidth={1.5} />
              <span className="font-mono text-[10px] font-bold">{entry.streak}D</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider" style={{ color: getLevelColor(lvl) }}>
            {LEVEL_NAMES[lvl - 1]}
          </span>
          <span className="text-[#333]">·</span>
          <span className="font-mono text-[9px] font-bold text-[#444] uppercase">LV {lvl}</span>
          {entry.badge && (
            <>
              <span className="text-[#333]">·</span>
              <span className="font-mono text-[8px] font-bold text-[#555] uppercase">{entry.badge}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 justify-end min-w-[80px]">
        <Zap size={11} strokeWidth={1.5} className="text-amber-400" />
        <span className={`font-mono text-sm font-black ${isMe ? 'text-cyber' : 'text-white'}`}>
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
    <div className="blade p-5 border-l-2 border-l-cyber">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[4px] border border-cyber/30 bg-cyber/[0.06] flex items-center justify-center flex-shrink-0">
            <span className="font-mono font-black text-sm text-cyber">#{rank.toLocaleString()}</span>
          </div>
          <div>
            <p className="font-mono text-[9px] font-black text-cyber uppercase tracking-[0.2em] mb-1">YOUR GLOBAL RANKING</p>
            <p className="font-bold text-base text-white uppercase tracking-tight">{user.fullName || user.username}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-mono text-[10px] font-bold uppercase" style={{ color: getLevelColor(lvl) }}>
                {LEVEL_NAMES[lvl - 1]}
              </span>
              <span className="text-[#333]">·</span>
              <span className="font-mono text-[10px] font-bold text-[#555] uppercase flex items-center gap-1">
                <Zap size={9} strokeWidth={1.5} className="text-amber-400" /> {(user.xp || 0).toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="text-center px-4 py-2 rounded-[4px] border border-white/[0.08] bg-white/[0.02]">
            <p className="font-mono text-[9px] font-black text-[#555] uppercase tracking-[0.15em] mb-1">PERCENTILE</p>
            <p className="font-mono text-lg font-black text-cyber">TOP {percentile}%</p>
          </div>
          <div className="text-center px-4 py-2 rounded-[4px] border border-white/[0.08] bg-white/[0.02]">
            <p className="font-mono text-[9px] font-black text-[#555] uppercase tracking-[0.15em] mb-1">STREAK</p>
            <p className="font-mono text-lg font-black text-amber-400 flex items-center justify-center gap-1">
              <Flame size={14} strokeWidth={1.5} /> {user.streak || 0}
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

  const allUsers = useMemo(() => generateUsers(25000), []);

  const { mergedUsers, myRank } = useMemo(() => {
    if (!user) return { mergedUsers: allUsers, myRank: null };
    const userXp = user.xp || 0;
    let insertIdx = allUsers.findIndex(u => u.xp <= userXp);
    if (insertIdx === -1) insertIdx = allUsers.length;
    const rank = insertIdx + 1;
    const merged = [...allUsers];
    merged.splice(insertIdx, 0, {
      id: user.id, username: user.username,
      fullName: user.fullName || user.username,
      avatarUrl: user.avatarUrl, xp: userXp,
      level: user.level || 1, streak: user.streak || 0,
      badge: 'SKILLFORGER',
      coursesCompleted: user.coursesCompleted || 0,
      isRealUser: true,
    });
    merged.forEach((u, i) => { u.rank = i + 1; });
    return { mergedUsers: merged, myRank: rank };
  }, [allUsers, user]);

  const filteredUsers = useMemo(() => {
    let list = mergedUsers;
    if (tab === 'weekly') {
      list = [...mergedUsers].sort((a, b) => {
        const aW = Math.floor((a.xp * (a.streak || 1)) / 100);
        const bW = Math.floor((b.xp * (b.streak || 1)) / 100);
        return bW - aW;
      }).map((u, i) => ({ ...u, rank: i + 1 }));
    } else if (tab === 'rising') {
      list = [...mergedUsers]
        .filter(u => u.level <= 6)
        .sort((a, b) => b.xp - a.xp)
        .map((u, i) => ({ ...u, rank: i + 1 }));
    }
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

  useEffect(() => { setVisibleCount(PER_PAGE); }, [tab, searchQuery]);

  const podium = filteredUsers.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto pb-24 pt-4 px-2 sm:px-0 space-y-6 animate-fade-in">

      {/* ── HEADER ── */}
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-[4px] border border-cyber/30 flex items-center justify-center">
              <Trophy size={13} strokeWidth={1.5} className="text-cyber" />
            </div>
            <span className="font-mono text-[9px] font-black text-[#444] uppercase tracking-[0.25em]">GLOBAL STANDINGS</span>
          </div>
          <h1 className="font-black text-2xl text-white tracking-tight uppercase">HALL OF FAME</h1>
          <p className="font-mono text-[11px] text-[#555] font-bold mt-1 uppercase tracking-wider">
            {filteredUsers.length.toLocaleString()} ENGINEERS COMPETING
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          className="flex items-center gap-0 border border-white/[0.08] rounded-[4px] overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 py-2 px-4 font-mono text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-150 ${
                tab === key
                  ? 'bg-cyber/[0.1] text-cyber border-r border-white/[0.06] last:border-r-0'
                  : 'text-[#555] hover:text-white border-r border-white/[0.06] last:border-r-0'
              }`}
            >
              <Icon size={11} strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── YOUR RANK ── */}
      {user && myRank && (
        <YourRankCard user={user} rank={myRank} totalUsers={mergedUsers.length} />
      )}

      {/* ── CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT — Podium + Stats */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-mono text-[10px] font-black text-[#555] uppercase tracking-[0.2em] border-l-2 border-white/20 pl-3 py-0.5">
            TOP PERFORMERS
          </h2>

          <div className="space-y-2">
            {podium.map((e, i) => (
              <div
                key={e.id}
                className={`p-4 rounded-[4px] border transition-all duration-150 hover:border-white/20 ${
                  i === 0 ? 'metallic-gold' : i === 1 ? 'metallic-silver' : 'metallic-bronze'
                }`}
              >
                <div className="flex items-center gap-3">
                  <RankBadge rank={i + 1} />
                  <UserAvatar user={e} size={38} />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[12px] font-black text-white truncate uppercase">{e.fullName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[9px] font-bold uppercase" style={{ color: getLevelColor(e.level) }}>
                        {LEVEL_NAMES[e.level - 1]}
                      </span>
                      <span className="text-[#333]">·</span>
                      <span className="font-mono text-[10px] font-bold text-cyber">{(e.xp || 0).toLocaleString()} XP</span>
                    </div>
                    {e.badge && (
                      <span className="font-mono text-[8px] font-bold text-[#555] uppercase tracking-wider">{e.badge}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Platform Stats */}
          <div className="blade p-5 space-y-4">
            <p className="font-mono text-[9px] font-black text-[#444] uppercase tracking-[0.25em]">PLATFORM STATS</p>
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-[#555] uppercase">TOTAL XP GENERATED</span>
              <div className="font-mono font-black text-xl text-cyber">12.8M+</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-[4px] border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <p className="font-mono text-[9px] font-bold text-[#555] uppercase tracking-wider">ACTIVE USERS</p>
                <p className="font-mono text-lg font-black text-white mt-1">25,001</p>
              </div>
              <div className="p-3 rounded-[4px] border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <p className="font-mono text-[9px] font-bold text-[#555] uppercase tracking-wider">AVG LEVEL</p>
                <p className="font-mono text-lg font-black text-cyber mt-1">5.2</p>
              </div>
            </div>
            <p className="font-mono text-[10px] text-[#444] leading-relaxed">
              TOP WEEKLY PLAYERS UNLOCK{' '}
              <span className="text-white font-bold">'PRECISION ENGINEER'</span>{' '}
              BADGE AUTOMATICALLY.
            </p>
          </div>

          {/* Level Distribution */}
          <div className="blade p-5 space-y-3">
            <p className="font-mono text-[9px] font-black text-[#444] uppercase tracking-[0.25em]">LEVEL DISTRIBUTION</p>
            {LEVEL_NAMES.map((name, i) => {
              const count = allUsers.filter(u => u.level === i + 1).length;
              const pct = ((count / allUsers.length) * 100).toFixed(1);
              return (
                <div key={name} className="flex items-center gap-2">
                  <span className="font-mono text-[9px] font-bold w-24 uppercase" style={{ color: getLevelColor(i + 1) }}>
                    {name}
                  </span>
                  <div className="flex-1 h-px bg-white/[0.06]">
                    <div className="h-px" style={{ width: `${pct}%`, background: getLevelColor(i + 1) }} />
                  </div>
                  <span className="font-mono text-[9px] font-bold text-[#444] w-10 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Main list */}
        <div className="lg:col-span-2">
          {/* Search */}
          <div className="mb-4 relative">
            <Search size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH PLAYERS..."
              className="w-full pl-9 pr-4 py-2.5 rounded-[4px] border border-white/[0.08] bg-white/[0.02] font-mono text-[11px] font-bold text-white placeholder:text-[#333] focus:outline-none focus:border-cyber transition-all duration-150 uppercase tracking-wider"
            />
          </div>

          <div className="blade overflow-hidden">
            <div
              className="px-4 py-3 flex justify-between items-center"
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.01)',
              }}
            >
              <span className="font-mono text-[9px] font-black text-[#555] uppercase tracking-[0.2em]">
                {tab === 'global' ? 'GLOBAL RANKINGS' : tab === 'weekly' ? 'WEEKLY LEADERS' : 'RISING STARS'}
              </span>
              <span className="font-mono text-[9px] font-bold text-[#444] uppercase">
                {visibleUsers.length.toLocaleString()} / {filteredUsers.length.toLocaleString()}
              </span>
            </div>

            {visibleUsers.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-mono text-[11px] text-[#444] uppercase tracking-wider">NO PLAYERS MATCH SEARCH</p>
              </div>
            ) : (
              <div>
                {visibleUsers.map(e => (
                  <LeaderboardRow
                    key={e.id + '_' + e.rank}
                    entry={e}
                    isMe={e.isRealUser || e.id === user?.id}
                  />
                ))}
              </div>
            )}

            {hasMore && (
              <div
                className="px-4 py-4 text-center"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <button
                  onClick={() => setVisibleCount(v => Math.min(v + PER_PAGE, filteredUsers.length))}
                  className="btn-secondary text-[10px]"
                >
                  LOAD MORE
                  <span className="text-[#444] font-normal normal-case">
                    ({Math.min(PER_PAGE, filteredUsers.length - visibleCount).toLocaleString()} MORE)
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

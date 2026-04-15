import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flame, Medal, Target, Zap, ChevronUp, Minus, Search, ArrowUpRight } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function Leaderboard() {
  const { stats } = useGameStore();

  const LEADERBOARD_DATA = [
    { rank: 1, name: "Alex Chen", handle: "@alex_code", xp: 98240, level: 89, streak: 142, trend: 'up', isCurrentUser: false },
    { rank: 2, name: "Sarah Jenkins", handle: "@sarah_dev", xp: 94180, level: 85, streak: 89, trend: 'up', isCurrentUser: false },
    { rank: 3, name: "Marcus Doe", handle: "@marcus_sys", xp: 91330, level: 84, streak: 56, trend: 'flat', isCurrentUser: false },
    { rank: 4, name: "Elena Rostova", handle: "@elenar", xp: 88500, level: 82, streak: 210, trend: 'up', isCurrentUser: false },
    { rank: 5, name: "David Kim", handle: "@dkim", xp: 85200, level: 80, streak: 12, trend: 'down', isCurrentUser: false },
    // ... gap
    { rank: stats.rank, name: "You", handle: "@developer", xp: stats.totalXp, level: stats.level, streak: stats.streak, trend: 'up', isCurrentUser: true },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <Trophy className="text-yellow-500" size={32} /> Global Rankings
          </h1>
          <p className="text-zinc-500 mt-2 font-mono text-sm tracking-wide uppercase">The world's top 1% engineering elite</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono">
            <span className="text-zinc-500">Season 4</span>
            <span className="text-green-500 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> LIVE</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono">
            <span className="text-zinc-500">Ends In</span>
            <span className="text-white">12d 04h</span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/50 overflow-hidden backdrop-blur-xl">
        <div className="p-1">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-8 py-5 text-[10px] font-mono text-zinc-600 uppercase tracking-widest border-b border-zinc-900/50 bg-black/20 font-bold">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-5">Developer</div>
            <div className="col-span-2 text-right">Lvl</div>
            <div className="col-span-2 text-right">Streak</div>
            <div className="col-span-2 text-right">Total XP</div>
          </div>

          {/* Rows */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col p-2 space-y-1"
          >
            {LEADERBOARD_DATA.map((user, i) => (
              <React.Fragment key={user.rank}>
                {i === 5 && (
                  <div className="py-8 flex justify-center items-center">
                    <div className="flex gap-2">
                      {[1,2,3].map(dot => <div key={dot} className="w-1 h-1 bg-zinc-800 rounded-full" />)}
                    </div>
                  </div>
                )}
                <motion.div 
                  variants={itemVariants}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center rounded-2xl transition-all duration-300 group ${
                    user.isCurrentUser 
                      ? 'bg-indigo-600/10 border border-indigo-500/30 shadow-[0_0_40px_rgba(79,70,229,0.1)]' 
                      : 'border border-transparent hover:bg-zinc-900/50 hover:border-zinc-800'
                  }`}
                >
                  <div className="col-span-1 flex justify-center items-center gap-2">
                    {user.rank === 1 ? <Medal className="text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" size={26} /> :
                     user.rank === 2 ? <Medal className="text-slate-300 drop-shadow-[0_0_15px_rgba(203,213,225,0.4)]" size={24} /> :
                     user.rank === 3 ? <Medal className="text-amber-700 drop-shadow-[0_0_15px_rgba(180,83,9,0.3)]" size={22} /> :
                     <div className="flex flex-col items-center">
                       <span className={`font-mono text-sm font-bold ${user.isCurrentUser ? 'text-white' : 'text-zinc-600'}`}>{user.rank}</span>
                       {user.trend === 'up' && <ChevronUp size={10} className="text-green-600" />}
                     </div>}
                  </div>
                  
                  <div className="col-span-5 flex items-center gap-4">
                    <div className="relative">
                      <div className={`w-11 h-11 rounded-full bg-zinc-900 overflow-hidden border-2 transition-all group-hover:scale-110 ${user.rank <= 3 ? 'border-yellow-500/30' : 'border-zinc-800'}`}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.handle}`} alt={user.name} />
                      </div>
                      {user.isCurrentUser && <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-zinc-950 shadow-lg" />}
                    </div>
                    <div>
                      <p className={`font-display font-bold text-sm ${user.isCurrentUser ? 'text-indigo-400' : 'text-white'}`}>
                        {user.name}
                      </p>
                      <p className="text-[10px] text-zinc-600 font-mono mt-0.5 group-hover:text-zinc-400 transition-colors uppercase tracking-widest font-bold">
                        {user.handle}
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-right">
                    <span className={`font-mono text-xs font-bold ${user.isCurrentUser ? 'text-indigo-400' : 'text-zinc-500'}`}>
                      {user.level}
                    </span>
                  </div>
                  
                  <div className="col-span-2 flex items-center justify-end gap-1.5 font-mono text-xs">
                    <Flame size={14} className={`${user.streak > 100 ? 'text-orange-500 animate-pulse' : 'text-zinc-700'}`} />
                    <span className={user.streak > 100 ? 'text-orange-400 font-bold' : 'text-zinc-500'}>{user.streak}</span>
                  </div>
                  
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <span className={`font-mono font-bold tracking-tight text-sm ${user.isCurrentUser ? 'text-white' : 'text-zinc-300'}`}>
                      {user.xp.toLocaleString()}
                    </span>
                    <Zap size={14} className={`${user.rank <= 3 ? 'text-yellow-500' : 'text-zinc-800'}`} />
                  </div>
                </motion.div>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flame, Medal, Target, Zap, ChevronUp, Minus } from 'lucide-react';

const LEADERBOARD_DATA = [
  { rank: 1, name: "Alex Chen", handle: "@alexc", xp: 45200, level: 89, streak: 142, trend: 'up', isCurrentUser: false },
  { rank: 2, name: "Sarah Jenkins", handle: "@sarahj", xp: 42100, level: 85, streak: 89, trend: 'up', isCurrentUser: false },
  { rank: 3, name: "Marcus Doe", handle: "@marcusd", xp: 41050, level: 84, streak: 56, trend: 'flat', isCurrentUser: false },
  { rank: 4, name: "Elena Rostova", handle: "@elenar", xp: 39800, level: 82, streak: 210, trend: 'up', isCurrentUser: false },
  { rank: 5, name: "David Kim", handle: "@dkim", xp: 38500, level: 80, streak: 12, trend: 'down', isCurrentUser: false },
  // ... gap
  { rank: 1024, name: "You", handle: "@developer", xp: 12450, level: 42, streak: 14, trend: 'up', isCurrentUser: true },
];

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
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <Trophy className="text-yellow-500" size={32} /> Global Rankings
          </h1>
          <p className="text-zinc-500 mt-2 font-mono text-sm tracking-wide">Compete with the top 1% of engineers worldwide.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono">
            <span className="text-zinc-400">Season 4</span>
            <span className="text-green-500 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono">
            <span className="text-zinc-400">Ends in:</span>
            <span className="text-white">12d 14h</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 overflow-hidden backdrop-blur-xl">
        <div className="p-1">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs font-mono text-zinc-500 uppercase tracking-wider border-b border-zinc-800/50 bg-black/20 rounded-t-xl">
            <div className="col-span-1 text-center font-semibold">Rank</div>
            <div className="col-span-5 font-semibold">Developer</div>
            <div className="col-span-2 text-right font-semibold">Level</div>
            <div className="col-span-2 text-right font-semibold">Streak</div>
            <div className="col-span-2 text-right font-semibold">XP</div>
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
                  <div className="py-6 flex justify-center items-center">
                    <div className="flex gap-2">
                      {[1,2,3].map(dot => (
                        <div key={dot} className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                      ))}
                    </div>
                  </div>
                )}
                <motion.div 
                  variants={itemVariants}
                  className={\`grid grid-cols-12 gap-4 px-4 py-3.5 items-center rounded-xl transition-all duration-200 group \${
                    user.isCurrentUser 
                      ? 'bg-indigo-600/10 border border-indigo-500/30 shadow-[0_0_20px_rgba(79,70,229,0.1)]' 
                      : 'border border-transparent hover:bg-zinc-900/50 hover:border-zinc-800'
                  }\`}
                >
                  <div className="col-span-1 flex justify-center items-center gap-2">
                    {user.rank === 1 ? <Medal className="text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" size={24} /> :
                     user.rank === 2 ? <Medal className="text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.5)]" size={22} /> :
                     user.rank === 3 ? <Medal className="text-amber-700 drop-shadow-[0_0_10px_rgba(180,83,9,0.5)]" size={20} /> :
                     <div className="flex items-center gap-2">
                       <span className="font-mono text-sm text-zinc-400 font-bold w-6 text-center">{user.rank}</span>
                       {user.trend === 'up' && <ChevronUp size={12} className="text-green-500" />}
                       {user.trend === 'down' && <ChevronUp size={12} className="text-red-500 rotate-180" />}
                       {user.trend === 'flat' && <Minus size={12} className="text-zinc-600" />}
                     </div>}
                  </div>
                  
                  <div className="col-span-5 flex items-center gap-4">
                    <div className="relative">
                      <div className={\`w-10 h-10 rounded-full bg-zinc-900 overflow-hidden border-2 \${user.rank <= 3 ? 'border-yellow-500/50' : 'border-zinc-800'}\`}>
                        <img src={\`https://api.dicebear.com/7.x/avataaars/svg?seed=\${user.handle}\`} alt={user.name} />
                      </div>
                      {user.rank <= 3 && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                          <Target size={10} className="text-yellow-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className={\`font-display font-medium \${user.isCurrentUser ? 'text-indigo-400' : 'text-white'}\`}>
                        {user.name}
                      </p>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5 group-hover:text-zinc-400 transition-colors">
                        {user.handle}
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-right">
                    <Badge variant="outline" className={\`font-mono rounded bg-zinc-950/50 \${user.isCurrentUser ? 'border-indigo-500/30 text-indigo-400' : 'border-zinc-800 text-zinc-400'}\`}>
                      Lvl {user.level}
                    </Badge>
                  </div>
                  
                  <div className="col-span-2 flex items-center justify-end gap-1.5 font-mono text-sm">
                    <Flame size={14} className={\`\${user.streak > 100 ? 'text-orange-500 animate-pulse' : 'text-zinc-500'}\`} />
                    <span className={user.streak > 100 ? 'text-orange-400' : 'text-zinc-400'}>{user.streak}</span>
                  </div>
                  
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <span className={\`font-mono font-bold tracking-tight \${user.isCurrentUser ? 'text-white' : 'text-zinc-300'}\`}>
                      {user.xp.toLocaleString()}
                    </span>
                    <Zap size={14} className={\`\${user.rank <= 3 ? 'text-yellow-500' : 'text-zinc-600'}\`} />
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

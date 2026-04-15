import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flame, Target, Zap, CheckCircle2, Star, Calendar, ArrowRight } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function Quests() {
  const { quests, completeQuest } = useGameStore();

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
          <Target className="text-indigo-500" size={32} /> Daily & Weekly Quests
        </h1>
        <p className="text-zinc-500 mt-2 font-mono text-sm tracking-wide uppercase">Engineered for consistent progress</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Main Quest List */}
        <motion.div variants={itemVariants} className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <Calendar className="text-zinc-500" size={18} /> Active Quests
            </h2>
          </div>
          
          <div className="space-y-4">
            {quests.map((quest) => (
              <div 
                key={quest.id} 
                className={`group p-6 rounded-2xl border transition-all duration-300 ${
                  quest.done 
                    ? 'border-green-500/20 bg-green-500/5' 
                    : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-5">
                    <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-500 ${
                      quest.done 
                        ? 'bg-green-500 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                        : 'bg-zinc-800 border-zinc-700 group-hover:border-zinc-500 group-hover:bg-zinc-700'
                    }`}>
                      {quest.done ? <CheckCircle2 size={20} className="text-black" /> : <Zap size={20} className="text-zinc-500 group-hover:text-indigo-400" />}
                    </div>
                    <div>
                      <h3 className={`font-display font-bold text-lg ${quest.done ? 'text-zinc-500 line-through' : 'text-white'}`}>
                        {quest.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="outline" className={`font-mono text-[10px] uppercase tracking-wider py-0 px-2 ${quest.done ? 'border-green-500/20 text-green-500/60' : 'border-zinc-800 text-zinc-500'}`}>
                          {quest.title.includes('Lesson') ? 'Curriculum' : quest.title.includes('Battle') ? 'Combat' : 'Community'}
                        </Badge>
                        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">+{quest.xp} XP reward</span>
                      </div>
                    </div>
                  </div>
                  
                  {!quest.done && (
                    <button 
                      onClick={() => completeQuest(quest.id)}
                      className="text-xs font-mono font-bold text-indigo-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      Complete <ArrowRight size={14} />
                    </button>
                  )}
                </div>
                
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex-1 h-1.5 bg-black rounded-full overflow-hidden border border-zinc-800 p-0">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(quest.progress / quest.total) * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full ${quest.done ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-600 to-blue-500'}`} 
                    />
                  </div>
                  <span className="text-xs font-mono text-zinc-500 w-12 text-right">{quest.progress}/{quest.total}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rewards Sidebar */}
        <motion.div variants={itemVariants} className="space-y-8">
          <section className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-display font-bold text-white mb-6 flex items-center gap-2">
              <Trophy className="text-yellow-500" size={18} /> Bonus Rewards
            </h2>
            <div className="space-y-4">
              {[
                { title: "Streak Master", req: "15 Day Streak", xp: 500, done: false },
                { title: "Speed Demon", req: "Lesson in < 5m", xp: 250, done: true },
                { title: "Arena Legend", req: "5 Win Streak", xp: 1000, done: false },
              ].map((r, i) => (
                <div key={i} className={`p-4 rounded-xl border ${r.done ? 'border-zinc-800 bg-zinc-950/50' : 'border-zinc-800/50 bg-black/20'} space-y-2`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-bold ${r.done ? 'text-zinc-500' : 'text-zinc-300'}`}>{r.title}</span>
                    {r.done && <CheckCircle2 size={12} className="text-green-500" />}
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-mono text-zinc-600">{r.req}</span>
                    <span className={`text-[10px] font-mono ${r.done ? 'text-zinc-600' : 'text-indigo-400'}`}>+{r.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
            <Star className="text-indigo-400 mb-4" size={24} />
            <h3 className="text-white font-display font-bold text-sm mb-2">Weekend Challenge</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-4">Complete 10 lessons this weekend to earn a "Polyglot" limited edition badge and 2,000 XP.</p>
            <div className="text-[10px] font-mono text-indigo-400 font-bold tracking-widest uppercase">2 Days Remaining</div>
          </section>
        </motion.div>
      </motion.div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Gift, Star, CheckCircle2, Zap, Trophy } from 'lucide-react';

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
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
          <Target className="text-indigo-500" size={32} /> Quests & Rewards
        </h1>
        <p className="text-zinc-500 mt-2 font-mono text-sm tracking-wide">Complete daily and weekly challenges to earn bonus XP and badges.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants} className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-display font-medium text-white flex items-center gap-2">
              <Trophy className="text-zinc-400" size={20} /> Daily Quests
            </h2>
            <div className="text-xs font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">Resets in 4h 12m</div>
          </div>
          
          <div className="space-y-4">
            {[
              { id: 1, title: "Solve 3 Algorithm Challenges", progress: 2, total: 3, xp: 150, type: "Coding", done: false, icon: Zap, color: "text-yellow-500" },
              { id: 2, title: "Review 5 PRs in Forum", progress: 5, total: 5, xp: 200, type: "Community", done: true, icon: CheckCircle2, color: "text-green-500" },
              { id: 3, title: "Complete a Course Module", progress: 0, total: 1, xp: 300, type: "Learning", done: false, icon: Star, color: "text-indigo-400" },
            ].map((quest) => (
              <div 
                key={quest.id} 
                className={`p-4 rounded-xl border transition-all duration-300 \${
                  quest.done 
                    ? 'border-green-500/20 bg-green-500/5' 
                    : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 \${quest.done ? 'text-green-500' : 'text-zinc-600'}`}>
                      <quest.icon size={18} />
                    </div>
                    <div>
                      <p className={`font-medium \${quest.done ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>{quest.title}</p>
                      <Badge variant="outline" className={`mt-1.5 font-mono text-[10px] uppercase tracking-wider \${quest.done ? 'border-green-500/30 text-green-500 bg-green-500/10' : 'border-zinc-700 text-zinc-400 bg-black'}`}>
                        {quest.type}
                      </Badge>
                    </div>
                  </div>
                  <div className={`font-mono text-sm font-bold \${quest.done ? 'text-green-500' : 'text-indigo-400'}`}>
                    +{quest.xp} XP
                  </div>
                </div>
                <div className="flex items-center gap-4 pl-8">
                  <div className="h-1.5 flex-1 bg-black rounded-full overflow-hidden border border-zinc-800">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `\${(quest.progress / quest.total) * 100}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full \${quest.done ? 'bg-green-500' : 'bg-indigo-500'}`} 
                    />
                  </div>
                  <span className="text-xs font-mono text-zinc-500 w-10 text-right">{quest.progress}/{quest.total}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-2xl border border-yellow-500/20 bg-gradient-to-b from-yellow-500/10 to-zinc-950 p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(234,179,8,0.15),transparent_50%)]" />
          
          <div className="relative z-10">
            <h2 className="text-xl font-display font-medium text-white flex items-center gap-2 mb-8">
              <Star className="text-yellow-500 fill-yellow-500/20" size={20} /> Weekly Epic
            </h2>
            
            <div className="space-y-6 text-center">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-tr from-yellow-500 to-orange-500 p-1 shadow-[0_0_30px_rgba(234,179,8,0.3)] group-hover:shadow-[0_0_50px_rgba(234,179,8,0.5)] transition-shadow duration-500">
                <div className="w-full h-full bg-zinc-950 rounded-xl flex items-center justify-center">
                  <Gift size={40} className="text-yellow-500" strokeWidth={1.5} />
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-lg text-white">Master of Concurrency</h3>
                <p className="text-sm text-zinc-400 mt-2 font-mono leading-relaxed">Finish the Advanced Rust Concurrency course before Sunday midnight.</p>
              </div>
              
              <div className="space-y-2 text-left bg-black/40 p-4 rounded-xl border border-yellow-500/20">
                <div className="flex justify-between text-sm font-medium font-mono text-zinc-400">
                  <span>Progress</span>
                  <span className="text-yellow-500">33%</span>
                </div>
                <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "33%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-yellow-500" 
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-yellow-500/20">
                <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Reward</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-500 font-mono font-bold text-xl shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                  <Zap size={20} className="fill-current" /> +5,000 XP
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

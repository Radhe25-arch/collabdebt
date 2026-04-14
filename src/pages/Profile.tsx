import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Flame, Star, Hexagon, Code2, GitMerge, Terminal, Zap, CheckCircle2 } from 'lucide-react';

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

export function Profile() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Profile Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-8 items-start md:items-end relative p-8 rounded-3xl overflow-hidden border border-zinc-800/50 bg-zinc-950/30"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl" />
        
        <div className="relative w-32 h-32 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shadow-[0_0_40px_rgba(99,102,241,0.3)] z-10">
          <div className="w-full h-full bg-zinc-950 rounded-[14px] overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full object-cover scale-110" />
          </div>
        </div>
        
        <div className="flex-1 relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-4xl font-display font-bold text-white tracking-tight">Felix Developer</h1>
            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 font-mono text-xs px-2 shadow-[0_0_10px_rgba(99,102,241,0.2)]">PRO</Badge>
          </div>
          <p className="text-lg text-zinc-500 font-mono mb-6">@felix_dev</p>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm font-mono bg-black/40 border border-zinc-800 px-3 py-1.5 rounded-lg text-zinc-300">
              <Trophy className="text-yellow-500" size={16} /> Level 42
            </div>
            <div className="flex items-center gap-2 text-sm font-mono bg-black/40 border border-zinc-800 px-3 py-1.5 rounded-lg text-zinc-300">
              <Star className="text-indigo-400" size={16} /> 12,450 XP
            </div>
            <div className="flex items-center gap-2 text-sm font-mono bg-black/40 border border-zinc-800 px-3 py-1.5 rounded-lg text-zinc-300">
              <Flame className="text-orange-500" size={16} /> 14 Day Streak
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Skills Radar / Bars */}
        <motion.div variants={itemVariants} className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-display font-medium text-white mb-6">Skill Competency</h2>
          <div className="space-y-6">
            {[
              { skill: "Systems Programming", sub: "Rust, C++", level: 85, color: "bg-orange-500" },
              { skill: "Backend Architecture", sub: "Go, Node", level: 92, color: "bg-blue-500" },
              { skill: "Frontend", sub: "React, Vue", level: 78, color: "bg-indigo-500" },
              { skill: "Cloud Infrastructure", sub: "AWS, K8s", level: 65, color: "bg-yellow-500" },
              { skill: "Machine Learning", sub: "Python", level: 40, color: "bg-emerald-500" },
            ].map((item, i) => (
              <div key={i} className="space-y-2 group">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">{item.skill}</div>
                    <div className="text-xs text-zinc-500 font-mono mt-0.5">{item.sub}</div>
                  </div>
                  <span className="text-zinc-500 font-mono text-xs">{item.level}%</span>
                </div>
                <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `\${item.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full \${item.color}`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div variants={itemVariants} className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-display font-medium text-white mb-6">Earned Badges</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: "Rustacean", icon: Code2, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
              { name: "Gopher", icon: Terminal, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
              { name: "Architect", icon: GitMerge, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
              { name: "100 Days", icon: Flame, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
              { name: "Top 1%", icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
              { name: "Mentor", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
              { name: "Pioneer", icon: Zap, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-center group cursor-pointer">
                <div className={`w-14 h-14 rounded-xl \${badge.bg} flex items-center justify-center border \${badge.border} transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]`}>
                  <badge.icon size={24} className={badge.color} strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase">{badge.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

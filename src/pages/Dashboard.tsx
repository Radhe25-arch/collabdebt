import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Trophy, Flame, Target, ChevronRight, Play, 
  Search, BookOpen, Clock, Star, Swords, Sparkles,
  ArrowUpRight, TrendingUp, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/useGameStore';
import { MOCK_COURSES, LEADERBOARD_TOP, UPCOMING_EVENTS } from '@/data/mockData';

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

function StatCard({ icon: Icon, label, value, trend, color }: any) {
  return (
    <motion.div 
      variants={itemVariants}
      className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all duration-300 group relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} blur-3xl opacity-10 group-hover:opacity-20 transition-opacity`} />
      <div className="flex items-start justify-between relative z-10">
        <div className={`p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 ${color.replace('from-', 'text-').split(' ')[0]}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[10px] font-mono text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
            <TrendingUp size={10} /> {trend}
          </div>
        )}
      </div>
      <div className="mt-4 relative z-10">
        <div className="text-2xl font-display font-bold text-white tracking-tight">{value}</div>
        <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider mt-1">{label}</div>
      </div>
    </motion.div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const { stats, coursesCompleted, courseProgress, quests } = useGameStore();
  const [battleLoading, setBattleLoading] = useState(false);

  const startQuickBattle = () => {
    setBattleLoading(true);
    setTimeout(() => {
      setBattleLoading(false);
      navigate('/app/battles');
    }, 2000);
  };

  // Logic to find the most recently accessed course
  const lastAccessedCourseId = Object.entries(courseProgress)
    .sort(([, a], [, b]) => b.lastAccessed - a.lastAccessed)[0]?.[0];
  
  const currentCourse = MOCK_COURSES.find(c => c.id === lastAccessedCourseId) || MOCK_COURSES[0];
  const progress = courseProgress[currentCourse.id] || { completedLessons: [], lastAccessed: 0 };
  const progressPct = Math.round((progress.completedLessons.length / currentCourse.totalLessons) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            Welcome back, <span className="text-indigo-400">Developer</span> <Sparkles className="text-yellow-500" size={24} />
          </h1>
          <p className="text-zinc-500 mt-2 font-mono text-sm tracking-wide">Season 4 • Day 14 of your streak</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={startQuickBattle}
            disabled={battleLoading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold px-6 h-11 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all hover:scale-105 active:scale-95"
          >
            {battleLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Finding Match...
              </span>
            ) : (
              <span className="flex items-center gap-2 shadow-sm">
                <Swords size={18} /> Quick Battle
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard icon={Zap} label="Growth Points" value={stats.totalXp.toLocaleString()} trend="+1.2k" color="from-yellow-500/20 to-orange-500/5" />
        <StatCard icon={Trophy} label="Global Rank" value={`#${stats.rank}`} trend="-12" color="from-indigo-500/20 to-blue-500/5" />
        <StatCard icon={Flame} label="Daily Streak" value={`${stats.streak} Days`} trend="Hot" color="from-orange-500/20 to-red-500/5" />
        <StatCard icon={Target} label="Accuracy" value="94.2%" trend="+0.4%" color="from-green-500/20 to-emerald-500/5" />
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Continue Learning */}
        <div className="lg:col-span-8 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-display font-medium text-white flex items-center gap-2">
                <BookOpen className="text-zinc-500" size={20} /> Continue Learning
              </h2>
              <Link to="/app/courses" className="text-xs font-mono text-zinc-500 hover:text-indigo-400 transition-colors flex items-center gap-1">
                View Curriculum <ChevronRight size={14} />
              </Link>
            </div>
            
            <Link to={`/app/courses/${currentCourse.id}`} className="block group">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden transition-all duration-500 group-hover:border-zinc-700/50 group-hover:shadow-[0_0_50px_rgba(0,0,0,0.3)]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-600/10 to-transparent blur-3xl" />
                
                <div className="flex flex-col md:flex-row gap-8 relative z-10">
                  <div className="w-full md:w-32 h-32 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <currentCourse.icon size={48} className="text-indigo-400" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider border-indigo-500/30 text-indigo-400 px-2 py-0">
                        {currentCourse.domain}
                      </Badge>
                      <span className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                        <Clock size={12} /> {currentCourse.duration} remaining
                      </span>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {currentCourse.title}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-zinc-400">{progressPct}% Complete</span>
                        <span className="text-zinc-500">{progress.completedLessons.length}/{currentCourse.totalLessons} Lessons</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-700/30">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPct}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full relative"
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center text-white group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-300">
                      <Play size={20} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>

          {/* Activity/Events Section */}
          <section>
            <h2 className="text-xl font-display font-medium text-white mb-5 flex items-center gap-2">
              <Zap className="text-zinc-500" size={20} /> Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {UPCOMING_EVENTS.map((event, i) => (
                <div key={i} className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-4 hover:bg-zinc-900 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: event.accent }} />
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{event.type}</span>
                  </div>
                  <div className="font-semibold text-white text-sm mb-1 group-hover:text-indigo-400 transition-colors">{event.title}</div>
                  <div className="text-xs text-zinc-600 font-mono">{event.time}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Quests & Leaderboard */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-display font-bold text-white mb-6 flex items-center gap-2">
              <Target className="text-indigo-400" size={18} /> Daily Quests
            </h2>
            <div className="space-y-4">
              {quests.map((q) => (
                <div key={q.id} className="flex gap-4">
                  <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${q.done ? 'bg-green-500 border-green-500' : 'border-zinc-700'}`}>
                    {q.done && <Zap size={10} className="text-black fill-black" />}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${q.done ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>{q.title}</div>
                    <div className="text-[10px] font-mono text-zinc-600 mt-0.5">{q.progress}/{q.total} • +{q.xp} XP</div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-zinc-500 hover:text-white font-mono text-xs border border-dashed border-zinc-800" onClick={() => navigate('/app/quests')}>
              View All Quests
            </Button>
          </section>

          <section className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-display font-bold text-white mb-6 flex items-center gap-2">
              <Users className="text-indigo-400" size={18} /> Global Top
            </h2>
            <div className="space-y-5">
              {LEADERBOARD_TOP.map((user, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 font-mono text-xs text-zinc-600 font-bold">#0{user.rank}</div>
                  <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-xs font-bold text-zinc-200 truncate">@{user.name}</div>
                    <div className="text-[10px] font-mono text-zinc-500">{user.xp.toLocaleString()} XP</div>
                  </div>
                  {i === 0 && <Trophy size={14} className="text-yellow-500" />}
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-zinc-500 hover:text-white font-mono text-xs border border-zinc-800 bg-black/20" onClick={() => navigate('/app/leaderboard')}>
              Full Leaderboard
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}

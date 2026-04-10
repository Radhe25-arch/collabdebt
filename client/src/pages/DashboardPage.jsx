import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store';
import { Avatar, Button, Spinner } from '@/components/ui';
import {
  Zap, BookOpen, Target, Trophy, Play, ArrowRight, Terminal,
  Users, Check, TrendingUp, Flame, ChevronRight, Activity,
  Layout, Sparkles, Clock, Cpu, Shield, Layers, Code, Bell
} from 'lucide-react';
import api from '@/lib/api';

const LEVEL_NAMES = ['Beginner','Apprentice','Coder','Developer','Senior Dev','Architect','Pro','Expert','Master','Legend'];
const THRESHOLDS  = [0,500,1200,2500,4500,7500,12000,18000,26000,36000];

// ─── MINIMALIST TELEMETRY CARD ──────────────────────────
function StatCard({ label, value, icon: Icon, subtext }) {
  return (
    <div className="bg-[#0A0A0A] rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-colors group">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
           <span className="text-sm font-medium text-slate-400">{label}</span>
           <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-colors">
              <Icon size={16} className="text-slate-300" />
           </div>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
           <p className="text-3xl font-bold text-white tracking-tight leading-none">{value}</p>
           {subtext && <span className="text-xs font-medium text-slate-500">{subtext}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ─────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const lvl    = Math.min(user?.level || 1, 10);
  const xp     = user?.xp || 0;
  const nextXP = THRESHOLDS[lvl] || xp;
  const prevXP = THRESHOLDS[lvl - 1] || 0;
  const xpPct  = Math.min(((xp - prevXP) / (nextXP - prevXP)) * 100, 100);

  useEffect(() => {
    Promise.all([
      api.get('/users/me/stats'),
      api.get('/leaderboard/global?limit=5'),
    ]).then(([s, lb]) => {
      setStats(s.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const recentEnrollment = stats?.enrollments
    ?.filter(e => !e.completedAt)
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
       <Spinner size={32} className="text-white opacity-20" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-32 space-y-10">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-white/10">
        <div className="flex items-center gap-6">
          <Avatar user={user} size={80} className="rounded-2xl border border-white/10" />
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome back, {user?.username}</h1>
            <p className="text-sm font-medium text-slate-400">Continue building your skills and tracking your progress.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <Button className="rounded-full h-10 px-6 bg-white text-black hover:bg-slate-200 border-none text-sm font-medium transition-transform active:scale-95" onClick={() => navigate('/courses')}>
             Browse courses
           </Button>
        </div>
      </div>

      {/* ── STATS MATRIX ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Experience" value={xp.toLocaleString()} icon={Zap} subtext="XP Earned" />
        <StatCard label="Courses Completed" value={user?.coursesCompleted || 0} icon={Layers} />
        <StatCard label="Arena Rating" value="Unranked" icon={Target} />
        <StatCard label="Current Streak" value={`${user?.streak || 0}`} icon={Flame} subtext="Days" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── MAIN CONTENT AREA ── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* RECENT COURSE */}
          {recentEnrollment ? (
            <div className="bg-[#0A0A0A] rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
               <div className="relative z-10 w-full md:w-4/5">
                  <div className="flex items-center gap-2 mb-6">
                     <div className="w-2 h-2 rounded-full bg-blue-500" />
                     <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Continue Learning</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">{recentEnrollment.course?.title}</h3>
                  <p className="text-slate-400 mb-8 max-w-xl font-normal text-base leading-relaxed tracking-tight line-clamp-2">
                     {recentEnrollment.course?.description}
                  </p>
                  
                  <div className="space-y-3 mb-10">
                     <div className="flex justify-between items-end">
                        <span className="text-sm font-medium text-white">{recentEnrollment.progress}% Complete</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${recentEnrollment.progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-blue-500" 
                        />
                     </div>
                  </div>

                  <Button 
                    className="rounded-full h-11 px-8 bg-white text-black hover:bg-slate-200 border-none font-medium text-sm transition-transform active:scale-95"
                    onClick={() => navigate(`/courses/${recentEnrollment.course?.slug}`)}
                  >
                    Resume course
                  </Button>
               </div>
               
               {/* Decorative background element */}
               <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
            </div>
          ) : (
            <div className="bg-[#0A0A0A] rounded-3xl p-10 border border-white/10 text-center flex flex-col items-center">
               <BookOpen size={48} className="text-slate-600 mb-6" />
               <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Ready to start?</h3>
               <p className="text-slate-400 mb-8 max-w-md">You haven't enrolled in any courses yet. Explore our curriculum to find the right learning path for you.</p>
               <Button className="rounded-full h-11 px-8 bg-white text-black hover:bg-slate-200 font-medium border-none" onClick={() => navigate('/courses')}>
                 Explore Curriculum
               </Button>
            </div>
          )}

          {/* ACTIVITY OVERVIEW */}
          <div className="bg-[#0A0A0A] rounded-3xl p-8 border border-white/10">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white tracking-tight">Activity Overview</h3>
                <span className="text-sm font-medium text-slate-500">Last 90 days</span>
             </div>
             
             {/* Simple visual representation of activity (similar to Github contribution graph concept but simpler) */}
             <div className="h-40 flex items-end gap-2">
                {Array.from({ length: 45 }).map((_, i) => {
                  const h = 10 + Math.random() * 90;
                  return (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-sm bg-white/${i % 7 === 0 ? '10' : '5'} hover:bg-white/20 transition-colors`}
                      style={{ height: `${h}%` }}
                    />
                  );
                })}
             </div>
             <div className="flex justify-between mt-6 text-xs font-medium text-slate-500">
                <span>Start</span>
                <span>Current</span>
             </div>
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <div className="space-y-8">
          
          {/* LEVEL PROGRESS */}
          <div className="bg-[#0A0A0A] rounded-3xl p-8 border border-white/10">
             <h4 className="text-sm font-semibold text-slate-400 mb-6 uppercase tracking-wider">Your Progress</h4>
             
             <div className="space-y-8">
                <div className="flex flex-col gap-3">
                   <div className="flex justify-between items-end mb-2">
                      <span className="text-3xl font-bold text-white">{lvl}</span>
                      <span className="text-sm font-medium text-blue-400">{LEVEL_NAMES[lvl-1]}</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${xpPct}%` }}
                        className="h-full bg-blue-500" 
                      />
                   </div>
                   <div className="flex justify-between text-xs font-medium text-slate-500 mt-1">
                      <span>{xp.toLocaleString()} XP</span>
                      <span>Next level: {nextXP.toLocaleString()} XP</span>
                   </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                   <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-300">Global Ranking</p>
                      <p className="text-sm font-bold text-white">#128</p>
                   </div>
                </div>
             </div>
          </div>

          {/* NOTIFICATIONS / ACTIVITY */}
          <div className="bg-[#0A0A0A] rounded-3xl p-8 border border-white/10">
             <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Recent Activity</h4>
                <Bell size={14} className="text-slate-500" />
             </div>
             <div className="space-y-5">
                {[
                  { title: 'Course Enrolled', desc: 'Started Advanced System Design' },
                  { title: 'Level Up', desc: 'You reached Level 4 Developer' },
                  { title: 'Achievement Unlocked', desc: 'Completed 7-day streak' }
                ].map((a, i) => (
                  <div key={i} className="flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5">
                        <Check size={12} className="text-blue-400" />
                     </div>
                     <div>
                        <p className="text-sm font-semibold text-white">{a.title}</p>
                        <p className="text-xs font-medium text-slate-500 mt-1">{a.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}


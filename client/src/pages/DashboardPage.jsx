import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Avatar, Button, Spinner } from '@/components/ui';
import {
  Zap, BookOpen, Target, Trophy, Play, ArrowRight, Terminal,
  Users, Check, TrendingUp, Flame, ChevronRight, Activity,
  Layout, Sparkles, Clock
} from 'lucide-react';
import api from '@/lib/api';
import { format, subDays } from 'date-fns';

const LEVEL_NAMES = ['Beginner','Apprentice','Coder','Developer','Senior Dev','Architect','Pro','Expert','Master','Legend'];
const THRESHOLDS  = [0,500,1200,2500,4500,7500,12000,18000,26000,36000];

// ─── PREMIUM STAT CARD ────────────────────────────────────
function StatCard({ label, value, icon: Icon, trend, color = 'blue' }) {
  return (
    <div className="bg-[#1e293b] rounded-[32px] border border-white/5 p-8 hover:bg-[#1e293b]/80 transition-all group overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/5 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-${color}-500/10 transition-colors`} />
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className={`w-12 h-12 rounded-2xl bg-${color}-500/10 flex items-center justify-center`}>
          <Icon className={`text-${color}-500`} size={22} />
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</p>
          <p className="text-2xl font-black text-white tracking-tight leading-none">{value}</p>
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-2 relative z-10">
          <span className="text-[10px] font-bold py-1 px-3 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/10">
            {trend}
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Growth</span>
        </div>
      )}
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────
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
       <Spinner size={32} className="text-blue-500" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-10 animate-fade-in">
      
      {/* ── COMMAND CENTER HEADER ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-white/5">
        <div className="flex items-center gap-6">
          <Avatar user={user} size={84} className="rounded-[32px] border-4 border-[#1e293b]" />
          <div>
            <div className="flex items-center gap-3 mb-2">
               <h1 className="text-3xl font-black text-white tracking-tight">System Console</h1>
               <div className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Active Operative</span>
               </div>
            </div>
            <p className="text-slate-500 font-medium">Hello, {user?.username}. Accessing your technical architecture logs.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <Button variant="secondary" className="rounded-2xl h-12 px-6" onClick={() => navigate('/settings')}>System Settings</Button>
           <Button className="rounded-2xl h-12 px-8 bg-blue-600 hover:bg-blue-500 glow-blue border-none" onClick={() => navigate('/courses')}>
             Initialize Module
           </Button>
        </div>
      </div>

      {/* ── CORE TELEMETRY GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Technical XP" value={xp.toLocaleString()} icon={Zap} trend="+12%" color="blue" />
        <StatCard label="Modules Done" value={user?.coursesCompleted || 0} icon={BookOpen} trend="Steady" color="emerald" />
        <StatCard label="Battle Wins" value="42" icon={Trophy} trend="+4" color="violet" />
        <StatCard label="System Streak" value={`${user?.streak || 0} Days`} icon={Flame} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── LEFT ARCHITECTURE COLUMN ── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* ACTIVE MODULE */}
          {recentEnrollment && (
            <div className="bg-[#1e293b] rounded-[40px] p-10 border border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Activity size={120} className="text-blue-500" />
               </div>
               <div className="relative z-10">
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-[0.3em]">RESUME ARCHITECTURE</span>
                  <h3 className="text-4xl font-black text-white mt-4 mb-2 tracking-tight">{recentEnrollment.course?.title}</h3>
                  <p className="text-slate-500 mb-10 max-w-lg leading-relaxed">{recentEnrollment.course?.description}</p>
                  
                  <div className="flex flex-col gap-4 mb-10">
                     <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-slate-400 capitalize">{recentEnrollment.progress}% Mastered</span>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{recentEnrollment.course?._count?.lessons || 24} Lessons Remaining</span>
                     </div>
                     <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${recentEnrollment.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-blue-600 rounded-full shadow-[0_0_12px_#2563eb]" 
                        />
                     </div>
                  </div>

                  <Button 
                    className="rounded-2xl h-14 px-10 bg-blue-600 hover:bg-blue-500 border-none glow-blue font-bold text-white flex items-center gap-3"
                    onClick={() => navigate(`/courses/${recentEnrollment.course?.slug}`)}
                  >
                    Resume Execution <ArrowRight size={18} />
                  </Button>
               </div>
            </div>
          )}

          {/* SYSTEM ACTIVITY FLOW */}
          <div className="bg-[#1e293b] rounded-[40px] p-10 border border-white/5">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">System Activity</h3>
                  <p className="text-slate-500 text-sm mt-1">Telemetry collected from your last 90 global cycles.</p>
               </div>
               <Button variant="secondary" size="sm" className="rounded-xl px-4">Export Logs</Button>
            </div>
            
            <div className="h-48 flex items-end gap-1.5 overflow-hidden">
               {Array.from({ length: 48 }).map((_, i) => {
                 const h = 20 + Math.random() * 80;
                 return (
                   <div 
                     key={i} 
                     className="flex-1 rounded-t-lg bg-blue-600/10 hover:bg-blue-600/30 transition-colors relative group"
                     style={{ height: `${h}%` }}
                   >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-2 py-1 bg-blue-600 rounded text-[9px] font-bold text-white uppercase tracking-widest shadow-lg pointer-events-none">
                         Log #{i+1}
                      </div>
                   </div>
                 );
               })}
            </div>
            <div className="flex justify-between mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
               <span>Cycle START</span>
               <span>CURRENT_EPOC</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT TELEMETRY COLUMN ── */}
        <div className="space-y-8">
          
          {/* PROGRESS SYNC */}
          <div className="bg-[#1e293b] rounded-[40px] p-8 border border-white/5">
             <div className="flex items-center gap-3 mb-8">
                <Target size={20} className="text-emerald-500" />
                <h4 className="text-base font-bold text-white uppercase tracking-wide">Level Ascension</h4>
             </div>
             
             <div className="flex flex-col items-center py-6">
                <div className="relative w-40 h-40 flex items-center justify-center">
                   <svg className="w-full h-full -rotate-90">
                      <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                      <circle 
                        cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={452} strokeDashoffset={452 - (452 * xpPct) / 100}
                        strokeLinecap="round" className="text-blue-500 drop-shadow-[0_0_8px_#3b82f6]" 
                      />
                   </svg>
                   <div className="absolute flex flex-col items-center">
                      <span className="text-sm font-bold text-slate-500 leading-none">Level</span>
                      <span className="text-4xl font-black text-white leading-tight">{lvl}</span>
                   </div>
                </div>
                <p className="mt-8 text-xs font-bold text-slate-500 uppercase tracking-widest">Next Target: {nextXP.toLocaleString()} XP</p>
             </div>
          </div>

          {/* UPCOMING EVENTS */}
          <div className="bg-blue-600 rounded-[40px] p-8 text-white relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 p-10 opacity-20 rotate-12 group-hover:scale-110 transition-transform">
                <Trophy size={140} />
             </div>
             <div className="relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Priority Alert</span>
                <h4 className="text-xl font-black mt-3 mb-2 tracking-tight">Arena Finals</h4>
                <p className="text-sm font-medium opacity-80 mb-8 leading-relaxed">The global architecture battle concludes in 24 hours. Submit your kernels now.</p>
                <Button className="w-full h-12 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 border-none font-bold shadow-xl">Join Battlefield</Button>
             </div>
          </div>

          {/* RECOMMENDATIONS */}
          <div className="bg-[#1e293b] rounded-[40px] p-8 border border-white/5">
             <h4 className="text-sm font-black text-white mb-8 flex items-center gap-3 uppercase tracking-widest">
                <Sparkles size={16} className="text-blue-400" /> Suggested Ops
             </h4>
             <div className="space-y-4">
                {[
                  { t: 'High-Freq Trading', l: 'Expert' },
                  { t: 'Distributed DB', l: 'Master' },
                  { t: 'Cloud Security', l: 'Senior' }
                ].map(op => (
                  <div key={op.t} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 cursor-pointer transition-all">
                     <div>
                        <p className="text-[13px] font-bold text-white mb-1 leading-none">{op.t}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">{op.l}</p>
                     </div>
                     <ChevronRight size={14} className="text-slate-600" />
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

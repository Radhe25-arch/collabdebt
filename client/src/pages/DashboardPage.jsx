import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store';
import { Avatar, Button, Spinner } from '@/components/ui';
import {
  Zap, BookOpen, Target, Trophy, Play, ArrowRight, Terminal,
  Users, Check, TrendingUp, Flame, ChevronRight, Activity,
  Layout, Sparkles, Clock, Cpu, Shield, Layers, Code
} from 'lucide-react';
import api from '@/lib/api';

const LEVEL_NAMES = ['Beginner','Apprentice','Coder','Developer','Senior Dev','Architect','Pro','Expert','Master','Legend'];
const THRESHOLDS  = [0,500,1200,2500,4500,7500,12000,18000,26000,36000];

// ─── INDUSTRIAL STAT CARD ────────────────────────────────
function StatCard({ label, value, icon: Icon, trend, color = 'blue' }) {
  const colors = {
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/10 shadow-blue-500/5',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/10 shadow-emerald-500/5',
    violet: 'text-violet-500 bg-violet-500/10 border-violet-500/10 shadow-violet-500/5',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/10 shadow-amber-500/5'
  };

  return (
    <div className="bg-[#050505] rounded-[24px] border border-white/5 p-8 transition-all hover:bg-[#0a0a0a] group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity">
        <Icon size={120} />
      </div>
      <div className="flex items-center gap-5 relative z-10 mb-8">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colors[color]} border`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{label}</p>
          <p className="text-3xl font-black text-white tracking-tighter leading-none italic uppercase">{value}</p>
        </div>
      </div>
      {trend && (
        <div className="flex items-center justify-between relative z-10 pt-4 border-t border-white/5">
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Performance Flow</span>
           <span className={`text-[10px] font-black uppercase tracking-widest ${trend.includes('+') ? 'text-emerald-500' : 'text-blue-500'}`}>{trend} Target</span>
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
    <div className="max-w-7xl mx-auto pb-32 space-y-12 animate-fade-in">
      
      {/* ── COMMAND CONSOLE HEADER ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 pb-12 border-b border-white/5">
        <div className="flex items-center gap-8">
          <div className="relative">
             <div className="absolute inset-0 bg-blue-600/30 blur-2xl rounded-full" />
             <Avatar user={user} size={96} className="rounded-[32px] border-2 border-white/5 relative z-10" />
          </div>
          <div>
            <div className="flex items-center gap-4 mb-3">
               <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Operational Console</h1>
               <div className="px-4 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Live Trace Active</span>
               </div>
            </div>
            <p className="text-slate-500 font-bold text-sm tracking-widest uppercase italic">// Operative: {user?.username} | ID: {user?.id?.slice(-8).toUpperCase()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <Button variant="secondary" className="rounded-2xl h-14 px-8 border-white/10 hover:bg-white/5 text-xs font-black tracking-[0.2em] uppercase" onClick={() => navigate('/settings')}>Initialize Sync</Button>
           <Button className="rounded-2xl h-14 px-10 bg-blue-600 hover:bg-blue-500 glow-blue border-none text-xs font-black tracking-[0.2em] uppercase" onClick={() => navigate('/courses')}>
             Load Module
           </Button>
        </div>
      </div>

      {/* ── CORE TELEMETRY ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Technical XP" value={xp.toLocaleString()} icon={Zap} trend="+12.4k" color="blue" />
        <StatCard label="Modules Finished" value={user?.coursesCompleted || 0} icon={Layers} trend="Steady" color="emerald" />
        <StatCard label="Arena Wins" value="42" icon={Shield} trend="+4.0" color="violet" />
        <StatCard label="Uptime Streak" value={`${user?.streak || 0} Days`} icon={Flame} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── SYSTEM FLOW COLUMN ── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PRIMARY TASK RELEASE */}
          {recentEnrollment && (
            <div className="bg-[#050505] rounded-[48px] p-12 border border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                  <Cpu size={160} className="text-blue-500" />
               </div>
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                     <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                     <span className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em]">RESUME OPERATIONAL MODULE</span>
                  </div>
                  <h3 className="text-5xl font-black text-white mt-4 mb-4 tracking-tighter italic uppercase leading-none">{recentEnrollment.course?.title}</h3>
                  <p className="text-slate-500 mb-12 max-w-xl font-medium text-lg leading-relaxed">{recentEnrollment.course?.description}</p>
                  
                  <div className="flex flex-col gap-6 mb-12">
                     <div className="flex justify-between items-end">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] italic">{recentEnrollment.progress}% Mastered</span>
                        <span className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic">Sequence Ready</span>
                     </div>
                     <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${recentEnrollment.progress}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-blue-600 rounded-full shadow-[0_0_20px_#2563eb]" 
                        />
                     </div>
                  </div>

                  <Button 
                    className="rounded-2xl h-16 px-12 bg-white text-black hover:bg-slate-100 border-none font-black text-sm tracking-[0.2em] uppercase flex items-center gap-4 transition-all hover:scale-105 italic"
                    onClick={() => navigate(`/courses/${recentEnrollment.course?.slug}`)}
                  >
                    Execute Module <ArrowRight size={20} />
                  </Button>
               </div>
            </div>
          )}

          {/* TELEMETRY FLOW GRAPH */}
          <div className="bg-[#050505] rounded-[48px] p-12 border border-white/5">
            <div className="flex items-center justify-between mb-12">
               <div>
                  <h3 className="text-2xl font-black text-white tracking-tighter italic uppercase">Telemetry Stream</h3>
                  <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest italic">// Cycle metrics from the last 128 global epochs.</p>
               </div>
               <Button variant="secondary" size="sm" className="rounded-xl px-6 border-white/5 text-[10px] font-bold tracking-widest uppercase italic">Export Logs</Button>
            </div>
            
            <div className="h-48 flex items-end gap-2 overflow-hidden">
               {Array.from({ length: 64 }).map((_, i) => {
                 const h = 10 + Math.random() * 90;
                 return (
                   <div 
                     key={i} 
                     className="flex-1 rounded-t-sm bg-blue-600/10 hover:bg-blue-600/40 transition-colors relative group"
                     style={{ height: `${h}%` }}
                   >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-3 py-1.5 bg-blue-600 rounded-lg text-[10px] font-black text-white uppercase tracking-widest shadow-2xl pointer-events-none z-20">
                         LOG_SEQ_{i.toString().padStart(3, '0')}
                      </div>
                   </div>
                 );
               })}
            </div>
            <div className="flex justify-between mt-8 text-[11px] font-black text-slate-700 uppercase tracking-[0.3em] px-2 italic">
               <span>EPOCH_START</span>
               <span>CYCLE_CURRENT</span>
            </div>
          </div>
        </div>

        {/* ── ASCENSION MATRIX ── */}
        <div className="space-y-8">
          
          {/* LEVEL MATRIX */}
          <div className="bg-[#050505] rounded-[48px] p-10 border border-white/5 relative overflow-hidden">
             <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
             <div className="flex items-center gap-4 mb-10 relative z-10">
                <Target size={20} className="text-emerald-500 shadow-[0_0_10px_#10b981]" />
                <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] italic">Ascension Matrix</h4>
             </div>
             
             <div className="flex flex-col items-center py-8 relative z-10">
                <div className="relative w-48 h-48 flex items-center justify-center">
                   <svg className="w-full h-full -rotate-90">
                      <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                      <circle 
                        cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={552} strokeDashoffset={552 - (552 * xpPct) / 100}
                        strokeLinecap="round" className="text-blue-600 drop-shadow-[0_0_15px_#2563eb]" 
                      />
                   </svg>
                   <div className="absolute flex flex-col items-center">
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Rank</span>
                      <span className="text-6xl font-black text-white leading-tight italic uppercase">{lvl}</span>
                   </div>
                </div>
                <div className="mt-10 flex flex-col items-center gap-2">
                   <span className="text-[12px] font-black text-white italic uppercase tracking-[0.2em]">{LEVEL_NAMES[lvl-1] || 'OPERATIVE'}</span>
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] italic">TARGET: {nextXP.toLocaleString()} XP</span>
                </div>
             </div>
          </div>

          {/* CRITICAL ALERT */}
          <div className="bg-blue-600 rounded-[48px] p-10 text-white relative overflow-hidden group">
             <div className="absolute -top-12 -right-12 p-12 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                <Trophy size={180} />
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <Activity size={16} className="text-white animate-pulse" />
                   <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/80 italic">Priority Sequence</span>
                </div>
                <h4 className="text-3xl font-black mt-3 mb-4 tracking-tighter italic uppercase leading-none">The Arena Final.</h4>
                <p className="text-sm font-bold text-white/80 mb-10 leading-relaxed italic uppercase tracking-widest underline">Termination in 23:54:12. Submit your kernels immediately for global ranking.</p>
                <Button className="w-full h-16 rounded-[24px] bg-black text-white hover:bg-slate-900 border-none font-black text-[11px] tracking-[0.3em] uppercase shadow-2xl transition-all hover:scale-[1.02] italic">
                   Deploy to Battlefield
                </Button>
             </div>
          </div>

          {/* RECOMMENDED OPS */}
          <div className="bg-[#050505] rounded-[48px] p-10 border border-white/5">
             <h4 className="text-[11px] font-black text-white mb-10 flex items-center gap-4 uppercase tracking-[0.3em] italic">
                <Sparkles size={18} className="text-blue-500" /> RECOMMENDED OPS
             </h4>
             <div className="space-y-4">
                {[
                  { t: 'High-Freq Trading', l: 'Expert' },
                  { t: 'Distributed DB', l: 'Master' },
                  { t: 'Cloud Security', l: 'Senior' }
                ].map((op, i) => (
                  <div key={op.t} className="flex items-center justify-between p-5 bg-white/[0.02] rounded-[24px] border border-white/5 hover:border-blue-500/30 hover:bg-blue-600/5 cursor-pointer transition-all group">
                     <div>
                        <p className="text-[14px] font-black text-white mb-1 tracking-tight italic uppercase">{op.t}</p>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none italic group-hover:text-blue-500 transition-colors">{op.l} Architecture</p>
                     </div>
                     <ChevronRight size={16} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

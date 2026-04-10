import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store';
import { Avatar, Button, Spinner } from '@/components/ui';
import {
  Zap, BookOpen, Target, Trophy, Play, ArrowRight, Terminal,
  Users, Check, TrendingUp, Flame, ChevronRight, Activity,
  Layout, Sparkles, Clock, Cpu, Shield, Layers, Code, Command
} from 'lucide-react';
import api from '@/lib/api';

const LEVEL_NAMES = ['Beginner','Apprentice','Coder','Developer','Senior Dev','Architect','Pro','Expert','Master','Legend'];
const THRESHOLDS  = [0,500,1200,2500,4500,7500,12000,18000,26000,36000];

// ─── MINIMALIST TELEMETRY CARD ──────────────────────────
function TelemetryCard({ label, value, icon: Icon, trend, color = 'white' }) {
  return (
    <div className="bg-[#050505] rounded-[16px] border border-white/5 p-8 transition-all hover:bg-[#0a0a0c] hover:border-white/10 group relative">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
           <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] italic">{label}</span>
           <Icon size={16} className="text-slate-600 group-hover:text-white transition-colors" />
        </div>
        <div className="flex items-baseline gap-2">
           <p className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{value}</p>
           {trend && <span className="text-[10px] font-bold text-emerald-500/80 italic">{trend}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── COMMAND CENTER DASHBOARD ───────────────────────────
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
    <div className="max-w-7xl mx-auto pb-40 space-y-16 animate-reveal">
      
      {/* ── MINIMALIST OPERATIONAL HEADER ── */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-10 pb-16 border-b border-white/5">
        <div className="flex items-center gap-10">
          <Avatar user={user} size={100} className="rounded-[24px] border border-white/10 grayscale" />
          <div>
            <div className="flex items-center gap-4 mb-4">
               <h1 className="text-5xl font-black text-white tracking-[-0.05em] uppercase italic leading-none">Command Center</h1>
               <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Live Session</span>
               </div>
            </div>
            <p className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-[0.3em] italic">Operative_UID: {user?.id?.slice(-12).toUpperCase()} // Status: Optimal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <Button className="rounded-full h-14 px-12 bg-white text-black hover:bg-slate-200 border-none text-[11px] font-bold tracking-[0.2em] uppercase transition-transform hover:scale-[1.02]" onClick={() => navigate('/courses')}>
             Load Operational Module
           </Button>
        </div>
      </div>

      {/* ── CORE TELEMETRY MATRIX ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TelemetryCard label="Operational XP" value={xp.toLocaleString()} icon={Zap} trend="+2.4k" />
        <TelemetryCard label="Modules_Final" value={user?.coursesCompleted || 0} icon={Layers} />
        <TelemetryCard label="Arena_Protocol" value="4.2" icon={Shield} trend="Active" />
        <TelemetryCard label="Cycle_Streak" value={`${user?.streak || 0}d`} icon={Flame} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* ── MAIN SYSTEM FLOW ── */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* PRIMARY TASK RELEASE */}
          {recentEnrollment && (
            <div className="bg-[#050505] rounded-[32px] p-16 border border-white/5 relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-10">
                     <span className="text-[10px] font-mono font-bold text-blue-500 uppercase tracking-[0.4em] italic underline">Active_Operation</span>
                  </div>
                  <h3 className="text-6xl font-black text-white mb-6 tracking-[-0.06em] uppercase leading-none italic">{recentEnrollment.course?.title}</h3>
                  <p className="text-slate-500 mb-16 max-w-xl font-medium text-lg leading-relaxed tracking-tight">{recentEnrollment.course?.description}</p>
                  
                  <div className="space-y-4 mb-16">
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest italic">{recentEnrollment.progress}% Mastered</span>
                        <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest italic">Node: Execution</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${recentEnrollment.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-white opacity-80" 
                        />
                     </div>
                  </div>

                  <div className="flex items-center gap-10">
                     <Button 
                       className="rounded-full h-16 px-12 bg-white text-black hover:bg-slate-100 border-none font-bold text-[11px] tracking-[0.2em] uppercase italic"
                       onClick={() => navigate(`/courses/${recentEnrollment.course?.slug}`)}
                     >
                       RESUME EXECUTION
                     </Button>
                     <p className="text-[10px] font-mono font-bold text-slate-700 uppercase tracking-widest italic animate-pulse underline">Awaiting Input Control...</p>
                  </div>
               </div>
            </div>
          )}

          {/* SYSTEM METRICS GRAPHIC */}
          <div className="bg-[#050505] rounded-[32px] p-16 border border-white/5">
             <div className="flex items-center justify-between mb-16">
                <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Operational Sync</h3>
                <span className="text-[10px] font-mono font-bold text-slate-700 uppercase tracking-[0.3em] italic">Export_Raw_Telemetry</span>
             </div>
             
             <div className="h-40 flex items-end gap-1.5">
                {Array.from({ length: 90 }).map((_, i) => {
                  const h = 5 + Math.random() * 95;
                  return (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-sm bg-white/${i % 10 === 0 ? '20' : '5'} hover:bg-white/40 transition-colors`}
                      style={{ height: `${h}%` }}
                    />
                  );
                })}
             </div>
             <div className="flex justify-between mt-8 text-[9px] font-mono font-bold text-slate-800 uppercase tracking-[0.4em] italic">
                <span>EPOCH_INIT</span>
                <span>SYSTEM_CYCLE_STABLE</span>
                <span>EPOCH_CURRENT</span>
             </div>
          </div>
        </div>

        {/* ── ASCENSION MATRIX (SIDEBAR) ── */}
        <div className="space-y-12">
          
          {/* LEVEL MATRIX — MINIMALIST LINEAR */}
          <div className="bg-[#050505] rounded-[32px] p-12 border border-white/5 relative bg-subtle-grid">
             <h4 className="text-[10px] font-mono font-bold text-slate-600 mb-12 uppercase tracking-[0.3em] italic">Ascension_Matrix</h4>
             
             <div className="space-y-10">
                <div className="flex flex-col gap-4">
                   <div className="flex justify-between items-end">
                      <span className="text-4xl font-black text-white italic uppercase">{lvl}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase italic">Rank: {LEVEL_NAMES[lvl-1]}</span>
                   </div>
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${xpPct}%` }}
                        className="h-full bg-white opacity-60" 
                      />
                   </div>
                   <div className="flex justify-between text-[9px] font-mono font-bold text-slate-700 uppercase italic">
                      <span>{xp.toLocaleString()} XP</span>
                      <span>Target: {nextXP.toLocaleString()}</span>
                   </div>
                </div>

                <div className="pt-10 border-t border-white/5 space-y-6">
                   <p className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest italic">Global_Ranking</p>
                   <div className="flex items-center justify-between">
                      <p className="text-base font-black text-white italic uppercase tracking-tighter">Pos: #128</p>
                      <p className="text-[10px] font-mono font-bold text-blue-500 uppercase italic underline">View_Hierarchy</p>
                   </div>
                </div>
             </div>
          </div>

          {/* ARENA PROTOCOL */}
          <div className="bg-white rounded-[32px] p-12 text-black transition-transform hover:scale-[1.02] cursor-pointer">
             <div className="flex items-center gap-3 mb-8">
                <Activity size={16} className="text-black" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em]">Arena_Final</span>
             </div>
             <h4 className="text-4xl font-black mb-8 tracking-[-0.06em] italic uppercase leading-none">The Battlefield.</h4>
             <p className="text-[11px] font-bold text-black/60 mb-12 uppercase tracking-[0.2em] italic leading-relaxed">System termination in 23 hours. Initialize submission immediately.</p>
             <Button className="w-full h-16 rounded-full bg-black text-white hover:bg-slate-900 border-none font-bold text-[11px] tracking-[0.3em] uppercase italic">
                INITIATE COMBAT
             </Button>
          </div>

          {/* SYSTEM ALERTS */}
          <div className="bg-[#050505] rounded-[32px] p-12 border border-white/5">
             <h4 className="text-[10px] font-mono font-bold text-slate-600 mb-10 uppercase tracking-[0.3em] italic">System_Alerts</h4>
             <div className="space-y-6">
                {[
                  { t: 'Module_Update', d: 'New Architect course available.' },
                  { t: 'Registry_Sync', d: 'Your portfolio has been indexed.' },
                  { t: 'Security_Patch', d: 'Node build 14.2 operational.' }
                ].map((a, i) => (
                  <div key={a.t} className="flex gap-4">
                     <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1 flex-shrink-0" />
                     <div>
                        <p className="text-[11px] font-bold text-white uppercase italic tracking-widest">{a.t}</p>
                        <p className="text-[10px] font-medium text-slate-600 italic">{a.d}</p>
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

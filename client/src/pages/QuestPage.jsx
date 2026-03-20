import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { ProgressBar, BadgeTag } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function QuestPage() {
  const { user } = useAuthStore();
  const [quests, setQuests]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/quests').then((r) => setQuests(r.data.quests || [])).finally(() => setLoading(false));
  }, []);

  const handleClaim = async (questId) => {
    try {
      const res = await api.post(`/quests/${questId}/claim`);
      toast.success(`Claimed ${res.data.xpAwarded} XP!`);
      const r = await api.get('/quests');
      setQuests(r.data.quests || []);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to claim reward');
    }
  };

  const activeQuests = quests.filter(q => q.status === 'ACTIVE');
  const completedQuests = quests.filter(q => q.status === 'COMPLETED');
  const claimedQuests = quests.filter(q => q.status === 'CLAIMED');

  return (
    <div className="max-w-5xl mx-auto pb-24 font-sans animate-fade-in space-y-12 pt-8 px-4">
      {/* ─── HEADER ─── */}
      <div className="relative">
        <div className="absolute top-[-40px] left-[-20px] w-32 h-32 bg-blue-600/10 blur-[60px] pointer-events-none" />
        <span className="bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full mb-6 inline-block border border-blue-500/10">
          Global Objectives
        </span>
        <h1 className="font-display font-black text-5xl text-white mb-4 tracking-tight">Active Quests.</h1>
        <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
          Complete these tactical assignments to provision bonus experience and advance your node's rank.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-white/5 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : quests.length === 0 ? (
        <div className="bg-[#0A0A0F]/60 border border-white/5 border-dashed rounded-[32px] p-24 text-center backdrop-blur-sm">
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-inner">
            <Icons.Target size={36} className="text-slate-700" />
          </div>
          <h3 className="font-display font-black text-2xl text-white mb-3">No Active Objectives</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed uppercase tracking-wider font-mono">
            New quests provisioning at 00:00 UTC. Check back soon.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Actionable Quests */}
          {(activeQuests.length > 0 || completedQuests.length > 0) && (
            <div className="space-y-6">
              <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] pl-1">Priority Operations</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...completedQuests, ...activeQuests].map(q => (
                  <div key={q.id} className="group relative bg-[#0A0A0F]/60 border border-white/5 rounded-[32px] p-8 shadow-2xl hover:border-blue-500/20 transition-all duration-500 backdrop-blur-md overflow-hidden">
                    {/* Background glow when completed */}
                    {q.status === 'COMPLETED' && (
                       <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] pointer-events-none" />
                    )}
                    
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 ${q.status === 'COMPLETED' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5 border border-white/5'}`}>
                        {q.type === 'COURSE_COMPLETE' ? <Icons.BookOpen size={24} className={q.status === 'COMPLETED' ? 'text-emerald-500' : 'text-blue-500'} /> :
                         q.type === 'BATTLE_WIN' ? <Icons.Zap size={24} className={q.status === 'COMPLETED' ? 'text-emerald-500' : 'text-amber-500'} /> :
                         <Icons.Target size={24} className={q.status === 'COMPLETED' ? 'text-emerald-500' : 'text-blue-500'} />}
                      </div>
                      <div className="bg-[#11111A] text-blue-500 font-mono text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-white/5 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                        +{q.xpReward} XP
                      </div>
                    </div>
                    
                    <div className="relative z-10 mb-8">
                      <h3 className="font-display font-black text-2xl text-white mb-2 tracking-tight group-hover:text-blue-400 transition-colors uppercase">{q.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">{q.description}</p>
                    </div>
                    
                    <div className="relative z-10">
                      {q.status === 'COMPLETED' ? (
                        <button onClick={() => handleClaim(q.id)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[11px] py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 transform hover:-translate-y-1 active:scale-95">
                          Provision Reward
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">
                            <span>Operational Progress</span>
                            <span className="text-white">{Math.round((q.progress / q.target) * 100)}%</span>
                          </div>
                          <div className="w-full bg-white/5 h-[6px] rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000" style={{ width: `${Math.min((q.progress / q.target) * 100, 100)}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Claimed Quests */}
          {claimedQuests.length > 0 && (
            <div className="space-y-6 pt-12 border-t border-white/5">
              <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] pl-1 text-center">Cycle History</h2>
              <div className="flex flex-wrap justify-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-500 pb-10">
                {claimedQuests.map(q => (
                  <div key={q.id} className="bg-white/3 border border-white/5 rounded-2xl px-6 py-4 flex items-center gap-4 group hover:bg-white/5 transition-all">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-white/5">
                      <Icons.Check size={14} className="text-slate-600 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">{q.title}</h3>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.1em] mt-0.5">Reward Deployed: {q.xpReward} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

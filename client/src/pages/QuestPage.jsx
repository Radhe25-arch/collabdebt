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
    <div className="max-w-4xl mx-auto pb-20 font-sans animate-fade-in space-y-8 pt-4">
      {/* Header */}
      <div>
        <span className="bg-amber-100 text-amber-700 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block shadow-sm">
          CHALLENGES
        </span>
        <h1 className="font-display font-black text-4xl text-slate-900 mb-2 tracking-tight">Daily Quests</h1>
        <p className="text-lg text-slate-600 max-w-xl">Complete specific objectives to earn bonus experience and rare badges.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin" /></div>
      ) : quests.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-20 text-center">
          <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-6">
            <Icons.Target size={32} className="text-slate-300" />
          </div>
          <h3 className="font-display font-black text-2xl text-slate-900 mb-2">No Active Quests</h3>
          <p className="text-slate-500 text-lg max-w-sm mx-auto">Check back tomorrow for new daily objectives.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Actionable Quests */}
          {(activeQuests.length > 0 || completedQuests.length > 0) && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Available</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...completedQuests, ...activeQuests].map(q => (
                  <div key={q.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    {q.status === 'COMPLETED' && (
                       <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
                    )}
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${q.status === 'COMPLETED' ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-50 border border-slate-100'}`}>
                        {q.type === 'COURSE_COMPLETE' ? <Icons.Book size={20} className={q.status === 'COMPLETED' ? 'text-emerald-600' : 'text-blue-600'} /> :
                         q.type === 'BATTLE_WIN' ? <Icons.Zap size={20} className={q.status === 'COMPLETED' ? 'text-emerald-600' : 'text-amber-500'} /> :
                         <Icons.Target size={20} className={q.status === 'COMPLETED' ? 'text-emerald-600' : 'text-indigo-600'} />}
                      </div>
                      <div className="bg-amber-100 text-amber-700 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full border border-amber-200">
                        +{q.xpReward} XP
                      </div>
                    </div>
                    
                    <h3 className="font-display font-bold text-lg text-slate-900 mb-1 leading-tight">{q.title}</h3>
                    <p className="text-sm text-slate-500 mb-6 font-medium">{q.description}</p>
                    
                    {q.status === 'COMPLETED' ? (
                      <button onClick={() => handleClaim(q.id)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm animate-pulse-slow">
                        Claim Reward
                      </button>
                    ) : (
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                          <span>Progress</span>
                          <span>{q.progress} / {q.target}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div className={`h-2.5 rounded-full ${q.progress > 0 ? 'bg-blue-600' : 'bg-slate-300'}`} style={{ width: `${Math.min((q.progress / q.target) * 100, 100)}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Claimed Quests */}
          {claimedQuests.length > 0 && (
            <div className="space-y-4 pt-8 border-t border-slate-100">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Completed Today</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60 hover:opacity-100 transition-opacity">
                {claimedQuests.map(q => (
                  <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                      <Icons.Check size={16} className="text-slate-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 line-through decoration-slate-400">{q.title}</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Claimed {q.xpReward} XP</p>
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

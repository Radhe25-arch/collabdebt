import { useState, useEffect } from 'react';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';
 
export default function QuestPage() {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const loadQuests = async () => {
    try {
      const r = await api.get('/quests');
      setQuests(r.data.quests || []);
    } catch (err) {
      console.error('Failed to load quests', err);
      toast.error('Could not load quests');
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { loadQuests(); }, []);
 
  // Backend returns each quest with a `userProgress` field:
  // userProgress = { progress, completed, xpAwarded, completedAt } | null
  const mapped = quests.map(q => {
    const up = q.userProgress;
    const progress  = up?.progress  ?? 0;
    const completed = up?.completed  ?? false;
    const xpAwarded = up?.xpAwarded  ?? 0;
    // If xpAwarded > 0, reward already given (CLAIMED). If completed but no xp yet = COMPLETED. Else ACTIVE.
    let status = 'ACTIVE';
    if (xpAwarded > 0 || (completed && up?.completedAt)) status = 'CLAIMED';
    else if (completed) status = 'COMPLETED';
    return { ...q, _progress: progress, _completed: completed, _xpAwarded: xpAwarded, status };
  });
 
  const activeQuests    = mapped.filter(q => q.status === 'ACTIVE');
  const completedQuests = mapped.filter(q => q.status === 'COMPLETED');
  const claimedQuests   = mapped.filter(q => q.status === 'CLAIMED');
 
  const QuestIcon = ({ type, status }) => {
    const cls =
      status === 'CLAIMED'    ? 'text-slate-500' :
      status === 'COMPLETED'  ? 'text-emerald-400' :
                                'text-blue-400';
    if (['LESSON_COMPLETE', 'COURSE_ENROLL', 'COURSE_COMPLETE'].includes(type))
      return <Icons.BookOpen size={22} className={cls} />;
    if (type === 'QUIZ_PASS')
      return <Icons.Zap size={22} className={cls} />;
    if (['BATTLE_WIN', 'TOURNAMENT_JOIN'].includes(type))
      return <Icons.Target size={22} className={cls} />;
    return <Icons.Star size={22} className={cls} />;
  };
 
  const diffBadge = d =>
    d === 'EASY'   ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/20' :
    d === 'MEDIUM' ? 'bg-amber-900/30   text-amber-400   border border-amber-500/20'   :
                     'bg-rose-900/30    text-rose-400    border border-rose-500/20';
 
  return (
    <div className="max-w-5xl mx-auto pb-24 font-sans animate-fade-in space-y-10 pt-4 px-4">
 
      {/* ─── HEADER ─── */}
      <div>
        <span className="bg-blue-600/10 text-blue-400 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-5 inline-block border border-blue-500/10">
          Daily Quests
        </span>
        <h1 className="font-display font-black text-4xl md:text-5xl text-white mb-3 tracking-tight">
          Active Quests.
        </h1>
        <p className="text-slate-400 max-w-lg leading-relaxed">
          Complete daily objectives to earn XP, badges, and climb the leaderboard.
          New quests refresh every day at midnight UTC.
        </p>
      </div>
 
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : quests.length === 0 ? (
        <div className="bg-white/5 border border-white/10 border-dashed rounded-[32px] p-20 text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Icons.Target size={32} className="text-slate-600" />
          </div>
          <h3 className="font-display font-black text-2xl text-white mb-2">No Quests Today</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            New quests are generated daily at 00:00 UTC. Check back soon!
          </p>
        </div>
      ) : (
        <div className="space-y-10">
 
          {/* ── Active + Ready-to-claim quests ── */}
          {(activeQuests.length > 0 || completedQuests.length > 0) && (
            <div className="space-y-5">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">
                Today's Objectives
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {[...completedQuests, ...activeQuests].map(q => {
                  const pct = Math.min(Math.round((q._progress / q.target) * 100), 100);
                  return (
                    <div
                      key={q.id}
                      className={`group relative bg-[#0A0A0F]/80 border rounded-[28px] p-7 transition-all duration-300 backdrop-blur-md overflow-hidden ${
                        q.status === 'COMPLETED'
                          ? 'border-emerald-500/20 hover:border-emerald-500/40'
                          : 'border-white/5 hover:border-blue-500/20'
                      }`}
                    >
                      {q.status === 'COMPLETED' && (
                        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 blur-[40px] pointer-events-none" />
                      )}
 
                      {/* Top row */}
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-105 ${
                          q.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 border-emerald-500/20'
                            : 'bg-white/5 border-white/5'
                        }`}>
                          <QuestIcon type={q.type} status={q.status} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ${diffBadge(q.difficulty)}`}>
                            {q.difficulty}
                          </span>
                          <div className="bg-black/30 text-blue-400 font-mono text-[11px] font-black px-3 py-1.5 rounded-xl border border-white/5">
                            +{q.xpReward} XP
                          </div>
                        </div>
                      </div>
 
                      {/* Title + description */}
                      <div className="mb-6">
                        <h3 className="font-display font-black text-xl text-white mb-1.5 tracking-tight group-hover:text-blue-400 transition-colors">
                          {q.title}
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{q.description}</p>
                      </div>
 
                      {/* Bottom: completed = reward auto-granted label, active = progress bar */}
                      {q.status === 'COMPLETED' ? (
                        <div className="w-full bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-black text-[11px] uppercase tracking-widest py-3.5 rounded-2xl text-center">
                          ✓ Completed — XP Awarded!
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest">
                            <span>Progress</span>
                            <span className="text-white">{q._progress}/{q.target} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
 
          {/* ── Claimed quests (already done) ── */}
          {claimedQuests.length > 0 && (
            <div className="space-y-4 pt-8 border-t border-white/5">
              <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.25em] text-center">
                Completed Today
              </h2>
              <div className="flex flex-wrap gap-3 justify-center opacity-50 hover:opacity-100 transition-opacity duration-300">
                {claimedQuests.map(q => (
                  <div
                    key={q.id}
                    className="bg-white/5 border border-white/5 rounded-2xl px-5 py-3 flex items-center gap-3"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-900/40 flex items-center justify-center shrink-0">
                      <Icons.Check size={13} className="text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wide">{q.title}</h3>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-wider mt-0.5">
                        +{q._xpAwarded || q.xpReward} XP earned
                      </p>
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

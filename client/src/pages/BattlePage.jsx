import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Avatar, Button, BadgeTag, Spinner, ProgressBar, Modal } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const LEVEL_NAMES  = ['Beginner','Apprentice','Coder','Developer','Senior Dev','Architect','Pro','Expert','Master','Legend'];
const BATTLE_DURATION = 30 * 60; // 30 minutes in seconds

// ─── REPORT CARD ─────────────────────────────────────────
function BattleReportCard({ battle, myId, onClose, onRematch }) {
  const me    = battle.challengerId === myId ? battle.challenger : battle.challenged;
  const opp   = battle.challengerId === myId ? battle.challenged : battle.challenger;
  const mySub = battle.challengerId === myId ? battle.challengerSubmission : battle.challengedSubmission;
  const oppSub= battle.challengerId === myId ? battle.challengedSubmission : battle.challengerSubmission;
  const iWon  = battle.winnerId === myId;
  const isDraw= !battle.winnerId;

  const myAcc  = mySub  ? Math.round((mySub.passed  / mySub.total)  * 100) : 0;
  const oppAcc = oppSub ? Math.round((oppSub.passed / oppSub.total) * 100) : 0;
  const myLvl  = Math.min(me?.level  || 1, 10);

  const resultLabel = isDraw ? 'DRAW' : iWon ? 'VICTORY' : 'DEFEAT';
  const resultColor = isDraw
    ? { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', glow: '' }
    : iWon
    ? { text: 'text-indigo-600',   bg: 'bg-indigo-600/10',   border: 'border-indigo-600/30',   glow: 'glow-teal'   }
    : { text: 'text-red-400',      bg: 'bg-red-500/10',       border: 'border-red-500/30',       glow: ''            };

  // Breakdown per problem
  const problems = mySub?.problems || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl overflow-hidden animate-fade-up shadow-2xl">

        {/* Header strip */}
        <div className={`px-6 py-4 ${resultColor.bg} border-b ${resultColor.border} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            {iWon  && <Icons.Trophy size={22} className="text-yellow-400" />}
            {!iWon && !isDraw && <Icons.Target size={22} className="text-red-400" />}
            {isDraw && <Icons.Award size={22} className="text-yellow-400" />}
            <div>
              <p className={`font-display font-black text-2xl ${resultColor.text}`} style={{ letterSpacing: '-1px' }}>
                {resultLabel}
              </p>
              <p className="font-mono text-xs text-slate-500">
                {battle.language?.toUpperCase()} · {battle.difficulty?.toUpperCase()} · {battle.totalProblems} problems
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 transition-colors p-1">
            <Icons.X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* XP Delta */}
          {battle.xpAwarded != null && (
            <div className={`flex items-center justify-center gap-3 py-3 rounded-xl ${resultColor.bg} border ${resultColor.border}`}>
              <Icons.Zap size={16} className={resultColor.text} />
              <span className={`font-display font-black text-2xl ${resultColor.text}`}>
                {iWon ? '+' : isDraw ? '±' : ''}{battle.xpAwarded} XP
              </span>
              {iWon && <span className="font-mono text-xs text-slate-500">added to your profile</span>}
            </div>
          )}

          {/* Head-to-head stat comparison */}
          <div>
            <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-3">Head-to-Head</p>
            <div className="sf-card overflow-hidden">
              {/* Players header */}
              <div className="grid grid-cols-3 gap-2 px-4 py-3 border-b border-slate-200 bg-slate-100/40">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold border ${iWon ? 'border-indigo-600/60 bg-indigo-600/10 text-indigo-600' : 'border-slate-200 bg-slate-100 text-slate-600'}`}>
                    {(me?.username||'?').slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-mono text-xs font-bold text-slate-900 truncate">{me?.username}</p>
                    <p className="font-mono text-xs text-slate-500">Lv{myLvl}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">VS</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <div>
                    <p className="font-mono text-xs font-bold text-slate-900 text-right truncate">{opp?.username}</p>
                    <p className="font-mono text-xs text-slate-500 text-right">Lv{Math.min(opp?.level||1,10)}</p>
                  </div>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold border border-slate-200 bg-slate-100 text-slate-600">
                    {(opp?.username||'?').slice(0,2).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Stats rows */}
              {[
                {
                  label: 'Problems Solved',
                  my:    `${mySub?.passed||0}/${mySub?.total||0}`,
                  opp:   `${oppSub?.passed||0}/${oppSub?.total||0}`,
                  myBetter: (mySub?.passed||0) >= (oppSub?.passed||0),
                },
                {
                  label: 'Accuracy',
                  my:    `${myAcc}%`,
                  opp:   `${oppAcc}%`,
                  myBetter: myAcc >= oppAcc,
                },
                {
                  label: 'Avg Time / Problem',
                  my:    mySub?.timeMs  ? `${(mySub.timeMs/1000).toFixed(1)}s`  : '–',
                  opp:   oppSub?.timeMs ? `${(oppSub.timeMs/1000).toFixed(1)}s` : '–',
                  myBetter: (mySub?.timeMs||9999) <= (oppSub?.timeMs||9999),
                  lowerBetter: true,
                },
                {
                  label: 'XP Before Battle',
                  my:    (me?.xp||0).toLocaleString(),
                  opp:   (opp?.xp||0).toLocaleString(),
                  myBetter: null,
                },
              ].map(({ label, my, opp: oppV, myBetter }) => (
                <div key={label} className="grid grid-cols-3 gap-2 px-4 py-3 border-b border-slate-200/50 last:border-0">
                  <span className={`font-mono text-sm font-bold ${myBetter === true ? 'text-indigo-600' : myBetter === false ? 'text-slate-900' : 'text-slate-900'}`}>
                    {my}
                  </span>
                  <span className="font-mono text-xs text-slate-500 text-center self-center">{label}</span>
                  <span className={`font-mono text-sm font-bold text-right ${myBetter === false ? 'text-indigo-600' : myBetter === true ? 'text-slate-900' : 'text-slate-900'}`}>
                    {oppV}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Problem-by-problem breakdown */}
          {problems.length > 0 && (
            <div>
              <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-3">Problem Breakdown</p>
              <div className="space-y-2">
                {problems.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 bg-slate-100/50 border border-slate-200/50 rounded-xl">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                      p.passed ? 'bg-indigo-600/15 text-indigo-600 border border-indigo-600/30' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {p.passed ? '✓' : '✗'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs text-slate-900 truncate">{p.title || `Problem ${i+1}`}</p>
                      <p className="font-mono text-xs text-slate-500">{p.difficulty}</p>
                    </div>
                    <div className="text-right">
                      {p.timeMs && <p className="font-mono text-xs text-slate-500">{(p.timeMs/1000).toFixed(1)}s</p>}
                      <p className={`font-mono text-xs font-bold ${p.passed ? 'text-indigo-600' : 'text-red-400'}`}>
                        {p.passed ? `+${p.xp||50} XP` : '—'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={onClose}>
              <Icons.ArrowLeft size={14} /> Back to Battles
            </Button>
            {onRematch && (
              <Button variant="primary" className="flex-1 glow-purple" onClick={onRematch}>
                <Icons.Zap size={14} /> Rematch
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TIMER ───────────────────────────────────────────────
function BattleTimer({ endsAt, onExpire }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const tick = () => {
      const target = new Date(endsAt).getTime();
      const now = Date.now();
      const secs = Math.max(0, Math.floor((target - now) / 1000));
      setRemaining(secs);
      if (secs === 0) onExpire?.();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt, onExpire]);

  const mins  = Math.floor(remaining / 60);
  const secs  = remaining % 60;
  const urgent = remaining < 300;
  const color = urgent ? 'text-red-500' : remaining < 600 ? 'text-amber-500' : 'text-indigo-600';

  return (
    <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-2xl border border-slate-100 shadow-sm">
      <Icons.Clock size={16} className={urgent ? 'animate-pulse text-red-500' : 'text-slate-400'} />
      <div className={`font-mono font-black tabular-nums text-2xl tracking-tighter ${color}`}>
        {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
      </div>
      {urgent && <span className="font-mono text-[9px] font-bold text-red-400 animate-pulse tracking-widest hidden lg:block">CRITICAL</span>}
    </div>
  );
}

// ─── PLAYER CARD (RECONSTRUCTED) ──────────────────────────
function PlayerCard({ user, submission, isMe, isWinner, isLoser, isFetching }) {
  const lvl     = Math.min(user?.level || 1, 10);
  const accuracy = user?.totalQuizAttempts > 0
    ? Math.round((user.correctQuizAnswers / user.totalQuizAttempts) * 100) : 0;
  const hasSub  = !!submission;
  const pct     = hasSub ? Math.round((submission.passed / submission.total) * 100) : 0;

  return (
    <div className={`bg-white p-5 rounded-3xl border transition-all relative overflow-hidden ${
      isWinner ? 'border-amber-200 shadow-lg shadow-amber-50' : 'border-slate-100 shadow-sm'
    } ${isLoser ? 'opacity-60' : ''}`}>
      {isWinner && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400" />
      )}
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar user={user} size={48} className={`ring-2 ${isMe ? 'ring-indigo-100' : 'ring-slate-50'}`} />
          {isWinner && <Icons.Trophy size={16} className="absolute -top-1 -right-1 text-amber-500 fill-amber-500" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-900 truncate tracking-tight">{user?.username}</span>
            {isMe && <span className="text-[9px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full uppercase">You</span>}
          </div>
          <p className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lv{lvl} • {LEVEL_NAMES[lvl-1]}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-widest">Progress</span>
          <span className="text-xs font-black text-slate-900">{pct}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 py-1">
           <div className="text-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-tight">XP</p>
              <p className="text-xs font-black text-slate-700">{(user?.xp||0).toLocaleString()}</p>
           </div>
           <div className="text-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-tight">Acc</p>
              <p className="text-xs font-black text-slate-700">{accuracy}%</p>
           </div>
           <div className="text-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-tight">Streak</p>
              <p className="text-xs font-black text-slate-700">{user?.streak||0}d</p>
           </div>
        </div>

        <div className="flex items-center gap-2">
          {isFetching ? (
             <div className="flex items-center gap-1.5 text-indigo-600 font-mono text-[9px] font-bold animate-pulse">
               <Spinner size={10} /> EVALUATING...
             </div>
          ) : (
             <span className="font-mono text-[10px] font-bold text-slate-500">
               {hasSub ? `${submission.passed}/${submission.total} SOLVED` : 'WAITING FOR INPUT'}
             </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN BATTLE PAGE ─────────────────────────────────────
export default function BattlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [battle, setBattle]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [code, setCode]           = useState('');
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [currentProblem, setCurrentProblem] = useState(0);
  const [results, setResults]     = useState([]);
  const [testOutput, setTestOutput] = useState(null);
  const [running, setRunning]     = useState(false);
  const pollRef = useRef(null);

  const fetchBattle = useCallback(async () => {
    try {
      const res = await api.get(`/battles/${id}`);
      const b   = res.data.battle;
      setBattle(b);
      if (b.status === 'COMPLETED' || b.status === 'ENDED') {
        clearInterval(pollRef.current);
        setShowReport(true);
      }
    } catch {
      toast.error('Sector access denied');
      navigate('/battles');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchBattle();
    pollRef.current = setInterval(fetchBattle, 2000); // Higher frequency polling
    return () => clearInterval(pollRef.current);
  }, [fetchBattle]);

  const handleRunTests = async () => {
    if (!code.trim()) return;
    setRunning(true);
    try {
      const res = await api.post(`/battles/${id}/test`, {
        code, language: selectedLang, problemIndex: currentProblem,
      });
      setTestOutput(res.data);
    } catch {
      toast.error('Execution fault');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) { toast.error('Empty payload detected'); return; }
    setSubmitting(true);
    try {
      const res = await api.post(`/battles/${id}/submit`, {
        code, language: selectedLang, problemIndex: currentProblem,
      });
      const r = res.data;
      setResults(prev => {
        const next = [...prev];
        next[currentProblem] = r;
        return next;
      });
      if (r.passed) {
        toast.success(`Module ${currentProblem + 1} Cleared!`);
        if (currentProblem < (battle?.totalProblems || 5) - 1) setCurrentProblem(p => p + 1);
      } else {
        toast.error('Validation failed');
      }
      fetchBattle();
    } catch {
      toast.error('Comm fault');
    } finally {
      setSubmitting(false);
    }
  };

  const surrender = async () => {
     if (!window.confirm('Surrender mission?')) return;
     try {
       await api.post(`/battles/${id}/surrender`);
       fetchBattle();
     } catch {
       toast.error('Surrender sequence failed');
     }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center animate-bounce">
          <Icons.Zap size={32} className="text-indigo-600 fill-indigo-600" />
        </div>
        <p className="font-mono text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Calibrating Arena...</p>
      </div>
    </div>
  );

  if (!battle) return null;

  const isChallenger  = battle.challengerId === user?.id;
  const me            = isChallenger ? battle.challenger  : battle.challenged;
  const opponent      = isChallenger ? battle.challenged  : battle.challenger;
  const mySub         = isChallenger ? battle.challengerSubmission : battle.challengedSubmission;
  const oppSub        = isChallenger ? battle.challengedSubmission : battle.challengerSubmission;
  const problem       = battle.problems?.[currentProblem];
  const isActive      = battle.status === 'ACTIVE';
  const isCompleted   = battle.status === 'COMPLETED' || battle.status === 'ENDED';

  return (
    <div className="h-screen bg-slate-50 text-slate-900 font-body flex flex-col overflow-hidden">

      {/* ─── FIXED HEADER ─── */}
      <header className="h-20 flex items-center justify-between px-10 bg-white border-b border-slate-100 flex-shrink-0 z-30">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/battles')} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all">
            <Icons.ArrowLeft size={18} />
          </button>
          <div className="h-10 w-px bg-slate-100" />
          <div>
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-600 animate-pulse' : 'bg-slate-200'}`} />
              <h1 className="font-black text-xl tracking-tight uppercase leading-none">{isActive ? 'Live Engagement' : battle.status}</h1>
            </div>
            <div className="flex gap-2 mt-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
               <span className="text-indigo-600">{battle.language || 'POLYLANG'}</span> • <span>{battle.difficulty || 'ELITE'} DIFFICULTY</span>
            </div>
          </div>
        </div>

        {/* Precision Timer */}
        {isActive && battle.endsAt && (
          <BattleTimer endsAt={battle.endsAt} onExpire={fetchBattle} />
        )}

        <div className="flex items-center gap-3">
          {isCompleted && (
            <Button variant="primary" className="rounded-2xl shadow-lg shadow-indigo-100" onClick={() => setShowReport(true)}>
              <Icons.TrendingUp size={14} /> View Transcript
            </Button>
          )}
          {isActive && (
            <button onClick={surrender}
              className="px-6 py-2.5 rounded-2xl border border-red-100 text-red-500 font-bold text-xs hover:bg-red-50 transition-all uppercase tracking-widest">
              Surrender
            </button>
          )}
        </div>
      </header>

      {/* ─── ARENA GRID ─── */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        
        {/* Opponent Tracking Sidebar (Left/Top) */}
        <aside className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-row lg:flex-col p-4 lg:p-6 gap-4 lg:space-y-6 z-20 overflow-x-auto lg:overflow-y-auto custom-scrollbar">
          <div className="flex-shrink-0 w-64 lg:w-full space-y-3">
             <label className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Your Status</label>
             <PlayerCard user={me} submission={mySub} isMe={true} isFetching={submitting} />
          </div>
          <div className="hidden lg:block h-px bg-slate-50" />
          <div className="flex-shrink-0 w-64 lg:w-full space-y-3">
             <label className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Target Status</label>
             <PlayerCard user={opponent} submission={oppSub} isMe={false} />
          </div>
          <div className="hidden lg:block flex-1" />
          <div className="hidden lg:block bg-slate-50 p-5 rounded-3xl space-y-3">
             <p className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">Protocol Stats</p>
             <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">Language</span>
                <span className="font-black text-slate-900 uppercase">{battle.language}</span>
             </div>
             <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">Modules</span>
                <span className="font-black text-slate-900 uppercase">0{currentProblem + 1} / 0{battle.totalProblems || 5}</span>
             </div>
          </div>
        </aside>

        {/* Content Area (Middle & Right) */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
            
            {/* Module Logic (Middle) */}
            <section className="w-full md:w-[45%] lg:w-[40%] flex flex-col bg-slate-50/50 border-b md:border-b-0 md:border-r border-slate-100 overflow-y-auto custom-scrollbar">
               <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-8">
                 {problem ? (
                   <>
                     <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Module Phase 0{currentProblem + 1}</span>
                          <BadgeTag variant={problem.difficulty === 'HARD' ? 'red' : 'teal'} className="text-[9px]">{problem.difficulty}</BadgeTag>
                        </div>
                        <h2 className="font-black text-2xl tracking-tight text-slate-900">{problem.title}</h2>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{problem.description}</p>
                     </div>

                     <div className="space-y-4">
                        <label className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Execution Examples</label>
                        {problem.examples?.map((ex, i) => (
                          <div key={i} className="bg-white border border-slate-100 rounded-3xl p-5 space-y-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-4">
                               <div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Input</p>
                                 <code className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{ex.input}</code>
                               </div>
                               <div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Output</p>
                                 <code className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{ex.output}</code>
                               </div>
                            </div>
                            {ex.explanation && <p className="text-[11px] text-slate-400 italic pt-1">{ex.explanation}</p>}
                          </div>
                        ))}
                     </div>

                     <div className="space-y-3">
                        <label className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Constraints</label>
                        <div className="bg-white border border-slate-100 p-5 rounded-3xl space-y-2">
                           {problem.constraints?.map((c, i) => (
                             <div key={i} className="flex gap-3 items-start text-xs text-slate-500 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-1 flex-shrink-0" />
                                <span>{c}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                   </>
                 ) : (
                   <div className="flex flex-col items-center justify-center h-full text-center p-10 space-y-4 opacity-50">
                      <Icons.Target size={40} className="text-slate-200" />
                      <p className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">Tactical Data Link Offline</p>
                   </div>
                 )}
               </div>
            </section>

            {/* IDE Section (Right) */}
            <section className="flex-1 flex flex-col bg-white overflow-hidden relative">
               <div className="h-14 flex items-center justify-between px-6 bg-slate-50/30 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                     <span className="w-3 h-3 rounded-full bg-red-400/20 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-red-400" /></span>
                     <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logic Terminal</span>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={handleRunTests} disabled={!isActive || running || !code.trim()}
                       className="px-4 py-1.5 rounded-xl bg-white border border-slate-100 text-[10px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all flex items-center gap-2">
                       {running ? <Spinner size={10} /> : <Icons.Play size={10} />} RUN TESTS
                     </button>
                     <button onClick={handleSubmit} disabled={!isActive || submitting || !code.trim()}
                       className="px-5 py-1.5 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 disabled:opacity-30 transition-all flex items-center gap-2">
                       {submitting ? <Spinner size={10} /> : <Icons.Zap size={10} className="fill-white" />} SUBMIT
                     </button>
                  </div>
               </div>

               <div className="flex-1 overflow-hidden relative bg-white">
                 <textarea
                   value={code}
                   onChange={e => setCode(e.target.value)}
                   disabled={!isActive}
                   className="w-full h-full p-8 outline-none border-none resize-none font-mono text-sm text-slate-700 leading-relaxed custom-scrollbar"
                   style={{ background: 'transparent' }}
                   placeholder={`// Input elite ${selectedLang} logic here...`}
                   spellCheck={false}
                 />
               </div>

               {/* RECONSTRUCTED TEST OUTPUT */}
               {testOutput && (
                 <div className="absolute bottom-6 left-6 right-6 bg-slate-900 p-6 rounded-[2rem] shadow-2xl animate-in slide-in-from-bottom-5 duration-500 max-h-64 overflow-y-auto">
                    <div className="flex items-center justify-between mb-4 px-2">
                       <span className="font-mono text-[10px] font-bold text-white/40 uppercase tracking-widest">Execution Transcript</span>
                       <button onClick={() => setTestOutput(null)} className="text-white/40 hover:text-white transition-colors"><Icons.X size={14} /></button>
                    </div>
                    <div className="space-y-2">
                       {testOutput.results?.map((r, i) => (
                         <div key={i} className={`p-4 rounded-2xl flex items-center justify-between font-mono text-xs ${r.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            <div className="flex items-center gap-3">
                               <span>{r.passed ? '✅' : '❌'} PHASE {i+1}</span>
                               {!r.passed && <p className="opacity-60 text-[10px]">Expected: {r.expected} | Got: {r.actual}</p>}
                            </div>
                            <span className="text-[10px] font-black">{r.passed ? 'VALIDATED' : 'FAULT'}</span>
                         </div>
                       ))}
                    </div>
                 </div>
               )}
            </section>

          </div>
        </div>
      </main>

      {/* REPORT OVERLAY */}
      {showReport && battle && (
        <BattleReportCard
          battle={battle}
          myId={user?.id}
          onClose={() => { setShowReport(false); navigate('/battles'); }}
          onRematch={() => navigate('/battles?rematch=' + (isChallenger ? opponent?.id : me?.id))}
        />
      )}
    </div>
  );
}

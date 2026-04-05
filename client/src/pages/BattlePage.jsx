import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Avatar, Button, BadgeTag, Spinner } from '@/components/ui';
import {
  ArrowLeft, Clock, Zap, Trophy, Target, X, ChevronRight,
  Play, Send, AlertTriangle, RotateCcw, TrendingUp
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const LEVEL_NAMES = ['BEGINNER','APPRENTICE','CODER','DEVELOPER','SENIOR DEV','ARCHITECT','PRO','EXPERT','MASTER','LEGEND'];

// ─── BATTLE REPORT CARD ───────────────────────────────────
function BattleReportCard({ battle, myId, onClose, onRematch }) {
  const me    = battle.challengerId === myId ? battle.challenger : battle.challenged;
  const opp   = battle.challengerId === myId ? battle.challenged : battle.challenger;
  const mySub = battle.challengerId === myId ? battle.challengerSubmission : battle.challengedSubmission;
  const oppSub= battle.challengerId === myId ? battle.challengedSubmission : battle.challengerSubmission;
  const iWon  = battle.winnerId === myId;
  const isDraw= !battle.winnerId;

  const myAcc  = mySub  ? Math.round((mySub.passed  / mySub.total)  * 100) : 0;
  const oppAcc = oppSub ? Math.round((oppSub.passed / oppSub.total) * 100) : 0;

  const resultLabel = isDraw ? 'DRAW' : iWon ? 'VICTORY' : 'DEFEAT';
  const resultColor = isDraw ? '#F59E0B' : iWon ? '#10B981' : '#DC2626';

  const problems = mySub?.problems || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/90 backdrop-blur-[40px] animate-fade-in">
      <div
        className="w-full max-w-2xl rounded-[4px] overflow-hidden animate-fade-up"
        style={{
          background: 'rgba(0,0,0,0.95)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{
            borderBottom: `1px solid ${resultColor}30`,
            background: `${resultColor}08`,
          }}
        >
          <div className="flex items-center gap-3">
            {iWon && <Trophy size={18} strokeWidth={1.5} style={{ color: resultColor }} />}
            {!iWon && !isDraw && <Target size={18} strokeWidth={1.5} style={{ color: resultColor }} />}
            {isDraw && <Zap size={18} strokeWidth={1.5} style={{ color: resultColor }} />}
            <div>
              <p className="font-mono font-black text-xl tracking-tight" style={{ color: resultColor }}>
                {resultLabel}
              </p>
              <p className="font-mono text-[10px] text-[#555] uppercase tracking-wider">
                {battle.language?.toUpperCase()} · {battle.difficulty?.toUpperCase()} · {battle.totalProblems} PROBLEMS
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* XP Delta */}
          {battle.xpAwarded != null && (
            <div
              className="flex items-center justify-center gap-3 py-3 rounded-[4px]"
              style={{ background: `${resultColor}08`, border: `1px solid ${resultColor}25` }}
            >
              <Zap size={14} strokeWidth={1.5} style={{ color: resultColor }} />
              <span className="font-mono font-black text-2xl" style={{ color: resultColor }}>
                {iWon ? '+' : isDraw ? '±' : ''}{battle.xpAwarded} XP
              </span>
              {iWon && <span className="font-mono text-[11px] text-[#555] uppercase">ADDED TO PROFILE</span>}
            </div>
          )}

          {/* Head-to-Head */}
          <div>
            <p className="font-mono text-[9px] text-[#444] uppercase tracking-[0.2em] mb-3">HEAD-TO-HEAD</p>
            <div className="blade overflow-hidden">
              <div className="grid grid-cols-3 gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-[2px] border flex items-center justify-center font-mono text-[10px] font-black"
                    style={{ borderColor: iWon ? '#10B98140' : 'rgba(255,255,255,0.1)', color: iWon ? '#10B981' : '#666' }}>
                    {(me?.username||'?').slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-mono text-[11px] font-black text-white truncate uppercase">{me?.username}</p>
                    <p className="font-mono text-[9px] text-[#555] uppercase">LV{Math.min(me?.level||1,10)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <span className="font-mono text-[10px] font-black text-[#444] uppercase tracking-widest">VS</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <div className="text-right">
                    <p className="font-mono text-[11px] font-black text-white text-right truncate uppercase">{opp?.username}</p>
                    <p className="font-mono text-[9px] text-[#555] text-right uppercase">LV{Math.min(opp?.level||1,10)}</p>
                  </div>
                  <div className="w-6 h-6 rounded-[2px] border border-white/10 flex items-center justify-center font-mono text-[10px] font-black text-[#666]">
                    {(opp?.username||'?').slice(0,2).toUpperCase()}
                  </div>
                </div>
              </div>

              {[
                { label: 'PROBLEMS SOLVED', my: `${mySub?.passed||0}/${mySub?.total||0}`, opp: `${oppSub?.passed||0}/${oppSub?.total||0}`, myBetter: (mySub?.passed||0) >= (oppSub?.passed||0) },
                { label: 'ACCURACY', my: `${myAcc}%`, opp: `${oppAcc}%`, myBetter: myAcc >= oppAcc },
                { label: 'AVG TIME', my: mySub?.timeMs ? `${(mySub.timeMs/1000).toFixed(1)}S` : '–', opp: oppSub?.timeMs ? `${(oppSub.timeMs/1000).toFixed(1)}S` : '–', myBetter: (mySub?.timeMs||9999) <= (oppSub?.timeMs||9999) },
                { label: 'XP BEFORE', my: (me?.xp||0).toLocaleString(), opp: (opp?.xp||0).toLocaleString(), myBetter: null },
              ].map(({ label, my, opp: oppV, myBetter }) => (
                <div key={label} className="grid grid-cols-3 gap-2 px-4 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span className="font-mono text-sm font-black" style={{ color: myBetter === true ? '#10B981' : '#FFFFFF' }}>{my}</span>
                  <span className="font-mono text-[9px] text-[#444] text-center uppercase tracking-wider self-center">{label}</span>
                  <span className="font-mono text-sm font-black text-right" style={{ color: myBetter === false ? '#10B981' : '#FFFFFF' }}>{oppV}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Problem Breakdown */}
          {problems.length > 0 && (
            <div>
              <p className="font-mono text-[9px] text-[#444] uppercase tracking-[0.2em] mb-3">PROBLEM BREAKDOWN</p>
              <div className="space-y-1.5">
                {problems.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-[4px] border border-white/[0.04]"
                    style={{ background: p.passed ? 'rgba(16,185,129,0.04)' : 'rgba(220,38,38,0.04)' }}>
                    <div className={`w-5 h-5 rounded-[2px] flex items-center justify-center text-[10px] font-mono font-black flex-shrink-0 ${
                      p.passed ? 'border border-emerald/30 text-emerald' : 'border border-crimson/30 text-crimson'
                    }`}>
                      {p.passed ? '✓' : '✗'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[11px] text-white truncate uppercase">{p.title || `PROBLEM ${i+1}`}</p>
                      <p className="font-mono text-[9px] text-[#555] uppercase">{p.difficulty}</p>
                    </div>
                    <div className="text-right">
                      {p.timeMs && <p className="font-mono text-[10px] text-[#555]">{(p.timeMs/1000).toFixed(1)}S</p>}
                      <p className={`font-mono text-[10px] font-black ${p.passed ? 'text-emerald' : 'text-crimson'}`}>
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
            <button onClick={onClose} className="btn-secondary flex-1">
              <ArrowLeft size={13} strokeWidth={1.5} /> BACK TO BATTLES
            </button>
            {onRematch && (
              <button onClick={onRematch} className="btn-primary flex-1">
                <RotateCcw size={13} strokeWidth={1.5} /> REMATCH
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BATTLE TIMER ─────────────────────────────────────────
function BattleTimer({ endsAt, onExpire }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const tick = () => {
      const secs = Math.max(0, Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000));
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

  return (
    <div
      className="flex items-center gap-3 px-4 py-2 rounded-[4px]"
      style={{
        border: `1px solid ${urgent ? 'rgba(220,38,38,0.3)' : 'rgba(255,255,255,0.08)'}`,
        background: urgent ? 'rgba(220,38,38,0.06)' : 'rgba(255,255,255,0.02)',
      }}
    >
      <Clock size={14} strokeWidth={1.5} className={urgent ? 'text-crimson animate-pulse' : 'text-[#555]'} />
      <div className={`font-mono font-black tabular-nums text-xl tracking-tighter ${urgent ? 'text-crimson' : 'text-white'}`}>
        {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
      </div>
      {urgent && <span className="font-mono text-[9px] font-black text-crimson uppercase tracking-[0.2em] hidden lg:block">CRITICAL</span>}
    </div>
  );
}

// ─── PLAYER CARD ──────────────────────────────────────────
function PlayerCard({ user, submission, isMe, isWinner, isLoser, isFetching }) {
  const lvl     = Math.min(user?.level || 1, 10);
  const hasSub  = !!submission;
  const pct     = hasSub ? Math.round((submission.passed / submission.total) * 100) : 0;

  return (
    <div
      className="rounded-[4px] p-4 relative"
      style={{
        border: `1px solid ${isWinner ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.06)'}`,
        background: isWinner ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.02)',
        opacity: isLoser ? 0.55 : 1,
      }}
    >
      {/* Winner accent line */}
      {isWinner && <div className="absolute top-0 left-0 right-0 h-px bg-emerald/40" />}

      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Avatar user={user} size={40} />
          {isWinner && (
            <Trophy size={12} strokeWidth={1.5} className="absolute -top-1 -right-1 text-amber-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-sm text-white truncate uppercase">{user?.username}</span>
            {isMe && <span className="font-mono text-[8px] font-black bg-cyber/20 text-cyber px-1.5 py-0.5 rounded-[2px] uppercase">YOU</span>}
          </div>
          <p className="font-mono text-[9px] font-bold text-[#555] uppercase tracking-wider mt-0.5">
            LV{lvl} · {LEVEL_NAMES[lvl - 1]}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[9px] font-bold text-[#555] uppercase tracking-wider">PROGRESS</span>
          <span className="font-mono text-[11px] font-black text-white">{pct}%</span>
        </div>
        <div className="h-px bg-white/[0.06]">
          <div
            className="h-px bg-cyber"
            style={{ width: `${pct}%`, transition: 'width 1s cubic-bezier(0.16,1,0.3,1)' }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-1 mb-3">
        {[
          { label: 'XP', value: (user?.xp||0).toLocaleString() },
          { label: 'ACC', value: `${user?.totalQuizAttempts > 0 ? Math.round((user.correctQuizAnswers/user.totalQuizAttempts)*100) : 0}%` },
          { label: 'STK', value: `${user?.streak||0}D` },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="font-mono text-[8px] font-bold text-[#444] uppercase tracking-wider">{label}</p>
            <p className="font-mono text-[11px] font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {isFetching ? (
          <div className="flex items-center gap-1.5 text-cyber animate-pulse">
            <Spinner size={10} className="text-cyber" />
            <span className="font-mono text-[9px] font-black uppercase tracking-wider">EVALUATING...</span>
          </div>
        ) : (
          <span className="font-mono text-[9px] font-bold text-[#555] uppercase tracking-wider">
            {hasSub ? `${submission.passed}/${submission.total} SOLVED` : 'AWAITING INPUT'}
          </span>
        )}
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
      toast.error('SECTOR ACCESS DENIED');
      navigate('/battles');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchBattle();
    pollRef.current = setInterval(fetchBattle, 2000);
    return () => clearInterval(pollRef.current);
  }, [fetchBattle]);

  const handleRunTests = async () => {
    if (!code.trim()) return;
    setRunning(true);
    try {
      const res = await api.post(`/battles/${id}/test`, { code, language: selectedLang, problemIndex: currentProblem });
      setTestOutput(res.data);
    } catch { toast.error('EXECUTION FAULT'); }
    finally { setRunning(false); }
  };

  const handleSubmit = async () => {
    if (!code.trim()) { toast.error('EMPTY PAYLOAD'); return; }
    setSubmitting(true);
    try {
      const res = await api.post(`/battles/${id}/submit`, { code, language: selectedLang, problemIndex: currentProblem });
      const r = res.data;
      if (r.passed) {
        toast.success(`MODULE ${currentProblem + 1} CLEARED`);
        if (currentProblem < (battle?.totalProblems || 5) - 1) setCurrentProblem(p => p + 1);
      } else {
        toast.error('VALIDATION FAILED');
      }
      fetchBattle();
    } catch { toast.error('COMM FAULT'); }
    finally { setSubmitting(false); }
  };

  const surrender = async () => {
    if (!window.confirm('SURRENDER MISSION?')) return;
    try {
      await api.post(`/battles/${id}/surrender`);
      fetchBattle();
    } catch { toast.error('SURRENDER SEQUENCE FAILED'); }
  };

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-[4px] border border-white/10 flex items-center justify-center">
          <Zap size={18} strokeWidth={1.5} className="text-cyber" />
        </div>
        <p className="font-mono text-[10px] font-black text-[#444] uppercase tracking-[0.3em]">CALIBRATING ARENA...</p>
      </div>
    </div>
  );

  if (!battle) return null;

  const isChallenger = battle.challengerId === user?.id;
  const me           = isChallenger ? battle.challenger  : battle.challenged;
  const opponent     = isChallenger ? battle.challenged  : battle.challenger;
  const mySub        = isChallenger ? battle.challengerSubmission : battle.challengedSubmission;
  const oppSub       = isChallenger ? battle.challengedSubmission : battle.challengerSubmission;
  const problem      = battle.problems?.[currentProblem];
  const isActive     = battle.status === 'ACTIVE';
  const isCompleted  = battle.status === 'COMPLETED' || battle.status === 'ENDED';

  return (
    <div className="h-screen bg-black text-white font-sans flex flex-col overflow-hidden">

      {/* ─── HEADER HUD ─── */}
      <header
        className="h-14 flex items-center justify-between px-6 flex-shrink-0 z-30 hud-bracket hud-bracket--tl hud-bracket--tr relative"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.95)' }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/battles')}
            className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-white/[0.08] text-[#555] hover:text-white hover:border-white/20 transition-all duration-150"
          >
            <ArrowLeft size={15} strokeWidth={1.5} />
          </button>
          <div className="h-6 w-px bg-white/[0.06]" />
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-[1px] ${isActive ? 'bg-emerald animate-pulse' : 'bg-[#333]'}`} />
              <h1 className="font-mono font-black text-sm uppercase tracking-[0.1em]">
                {isActive ? 'LIVE ENGAGEMENT' : battle.status}
              </h1>
            </div>
            <div className="flex gap-2 font-mono text-[9px] font-bold uppercase tracking-widest text-[#444]">
              <span className="text-cyber">{battle.language || 'POLYLANG'}</span>
              <span>·</span>
              <span>{battle.difficulty || 'ELITE'} DIFFICULTY</span>
            </div>
          </div>
        </div>

        {isActive && battle.endsAt && (
          <BattleTimer endsAt={battle.endsAt} onExpire={fetchBattle} />
        )}

        <div className="flex items-center gap-2">
          {isCompleted && (
            <button className="btn-primary text-[10px]" onClick={() => setShowReport(true)}>
              <TrendingUp size={12} strokeWidth={1.5} /> VIEW TRANSCRIPT
            </button>
          )}
          {isActive && (
            <button
              onClick={surrender}
              className="font-mono text-[10px] font-black px-4 py-2 rounded-[4px] border border-crimson/30 text-crimson hover:bg-crimson/[0.08] transition-all duration-150 uppercase tracking-wider"
            >
              SURRENDER
            </button>
          )}
        </div>
      </header>

      {/* ─── ARENA GRID ─── */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">

        {/* Sidebar — Players */}
        <aside
          className="w-full lg:w-72 flex flex-row lg:flex-col p-4 gap-4 lg:gap-5 z-20 overflow-x-auto lg:overflow-y-auto custom-scrollbar lg:space-y-5"
          style={{ borderRight: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex-shrink-0 w-60 lg:w-full">
            <p className="font-mono text-[9px] font-black text-[#444] uppercase tracking-[0.2em] mb-2">YOUR STATUS</p>
            <PlayerCard user={me} submission={mySub} isMe={true} isFetching={submitting} />
          </div>

          <div className="flex-shrink-0 w-60 lg:w-full">
            <p className="font-mono text-[9px] font-black text-[#444] uppercase tracking-[0.2em] mb-2">OPPONENT STATUS</p>
            <PlayerCard user={opponent} submission={oppSub} isMe={false} />
          </div>

          <div className="hidden lg:block flex-1" />

          {/* Protocol Stats */}
          <div
            className="hidden lg:block p-4 rounded-[4px]"
            style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}
          >
            <p className="font-mono text-[9px] font-black text-[#444] uppercase tracking-[0.2em] mb-3">PROTOCOL STATS</p>
            {[
              { label: 'LANGUAGE', value: battle.language?.toUpperCase() || '—' },
              { label: 'MODULES', value: `0${currentProblem + 1} / 0${battle.totalProblems || 5}` },
              { label: 'STATUS', value: battle.status },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="font-mono text-[9px] text-[#555] uppercase tracking-wider">{label}</span>
                <span className="font-mono text-[10px] font-black text-white uppercase">{value}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">

            {/* Problem Panel */}
            <section
              className="w-full md:w-[42%] flex flex-col overflow-y-auto custom-scrollbar"
              style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="px-6 py-5 space-y-6">
                {problem ? (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] font-bold text-cyber uppercase tracking-[0.15em]">
                          MODULE PHASE 0{currentProblem + 1}
                        </span>
                        <BadgeTag variant={problem.difficulty === 'HARD' ? 'red' : 'teal'}>
                          {problem.difficulty}
                        </BadgeTag>
                      </div>
                      <h2 className="font-black text-lg tracking-tight text-white uppercase">{problem.title}</h2>
                      <p className="text-sm text-[#888] leading-relaxed mt-2">{problem.description}</p>
                    </div>

                    {/* Examples */}
                    <div>
                      <p className="font-mono text-[9px] font-black text-[#444] uppercase tracking-[0.2em] mb-3">EXECUTION EXAMPLES</p>
                      {problem.examples?.map((ex, i) => (
                        <div key={i} className="blade p-4 mb-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="font-mono text-[9px] font-bold text-[#555] uppercase tracking-wider mb-1">INPUT</p>
                              <code className="font-mono text-xs text-cyber bg-cyber/[0.06] px-2 py-0.5 rounded-[2px]">{ex.input}</code>
                            </div>
                            <div>
                              <p className="font-mono text-[9px] font-bold text-[#555] uppercase tracking-wider mb-1">OUTPUT</p>
                              <code className="font-mono text-xs text-emerald bg-emerald/[0.06] px-2 py-0.5 rounded-[2px]">{ex.output}</code>
                            </div>
                          </div>
                          {ex.explanation && <p className="font-mono text-[10px] text-[#444] italic pt-2">{ex.explanation}</p>}
                        </div>
                      ))}
                    </div>

                    {/* Constraints */}
                    {problem.constraints?.length > 0 && (
                      <div>
                        <p className="font-mono text-[9px] font-black text-[#444] uppercase tracking-[0.2em] mb-3">CONSTRAINTS</p>
                        <div className="blade p-4 space-y-2">
                          {problem.constraints.map((c, i) => (
                            <div key={i} className="flex gap-3 items-start">
                              <span className="w-1 h-1 rounded-[1px] bg-[#333] mt-1.5 flex-shrink-0" />
                              <span className="font-mono text-xs text-[#666]">{c}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center opacity-40">
                    <Target size={32} strokeWidth={1} className="text-[#333] mb-3" />
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#444]">TACTICAL DATA LINK OFFLINE</p>
                  </div>
                )}
              </div>
            </section>

            {/* IDE Section */}
            <section className="flex-1 flex flex-col overflow-hidden relative" style={{ background: '#000' }}>
              {/* IDE Toolbar */}
              <div
                className="h-12 flex items-center justify-between px-4 flex-shrink-0"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-white/[0.06]" />
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-white/[0.06]" />
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-white/[0.06]" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#444] uppercase tracking-wider">LOGIC TERMINAL</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunTests}
                    disabled={!isActive || running || !code.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-white/[0.08] font-mono text-[10px] font-black text-[#666] hover:text-white hover:border-white/20 disabled:opacity-30 transition-all duration-150 uppercase tracking-wider"
                  >
                    {running ? <Spinner size={9} className="text-white" /> : <Play size={10} strokeWidth={1.5} />}
                    RUN TESTS
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!isActive || submitting || !code.trim()}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-[4px] bg-cyber/[0.1] border border-cyber/30 font-mono text-[10px] font-black text-cyber hover:bg-cyber/20 disabled:opacity-30 transition-all duration-150 uppercase tracking-wider"
                  >
                    {submitting ? <Spinner size={9} className="text-cyber" /> : <Send size={10} strokeWidth={1.5} />}
                    SUBMIT
                  </button>
                </div>
              </div>

              {/* Code editor */}
              <div className="flex-1 overflow-hidden relative">
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  disabled={!isActive}
                  className="w-full h-full p-6 outline-none border-none resize-none font-mono text-sm text-[#E0E0E0] leading-relaxed custom-scrollbar disabled:opacity-50"
                  style={{ background: 'transparent', tabSize: 2 }}
                  placeholder={`// ${selectedLang} — input logic here...`}
                  spellCheck={false}
                />
              </div>

              {/* Test Output Panel */}
              {testOutput && (
                <div
                  className="absolute bottom-4 left-4 right-4 max-h-56 overflow-y-auto custom-scrollbar rounded-[4px] animate-fade-up"
                  style={{
                    background: 'rgba(0,0,0,0.95)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <div
                    className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span className="font-mono text-[10px] font-black text-[#555] uppercase tracking-[0.15em]">EXECUTION TRANSCRIPT</span>
                    <button onClick={() => setTestOutput(null)} className="text-[#555] hover:text-white transition-colors">
                      <X size={12} strokeWidth={1.5} />
                    </button>
                  </div>
                  <div className="p-3 space-y-1.5">
                    {testOutput.results?.map((r, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 rounded-[4px] flex items-center justify-between font-mono text-xs"
                        style={{
                          background: r.passed ? 'rgba(16,185,129,0.06)' : 'rgba(220,38,38,0.06)',
                          border: `1px solid ${r.passed ? 'rgba(16,185,129,0.15)' : 'rgba(220,38,38,0.15)'}`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span style={{ color: r.passed ? '#10B981' : '#DC2626' }}>
                            {r.passed ? '✓' : '✗'} PHASE {i+1}
                          </span>
                          {!r.passed && (
                            <span className="text-[#555] text-[10px]">EXPECTED: {r.expected} | GOT: {r.actual}</span>
                          )}
                        </div>
                        <span className="text-[10px] font-black" style={{ color: r.passed ? '#10B981' : '#DC2626' }}>
                          {r.passed ? 'VALIDATED' : 'FAULT'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Report Overlay */}
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


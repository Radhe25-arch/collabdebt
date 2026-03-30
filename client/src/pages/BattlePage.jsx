import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Avatar, Button, BadgeTag, Spinner, ProgressBar, Modal } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const LEVEL_NAMES  = ['Beginner','Apprentice','Coder','Developer','Senior Dev','Architect','Pro','Expert','Master','Legend'];
const BATTLE_DURATION = 30 * 60; // 30 minutes in seconds

// ─── TIMER ───────────────────────────────────────────────
function BattleTimer({ endsAt, onExpire }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const tick = () => {
      const secs = Math.max(0, Math.floor((new Date(endsAt) - Date.now()) / 1000));
      setRemaining(secs);
      if (secs === 0) onExpire?.();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt, onExpire]);

  const mins  = Math.floor(remaining / 60);
  const secs  = remaining % 60;
  const pct   = (remaining / BATTLE_DURATION) * 100;
  const color = remaining < 300 ? '#f87171' : remaining < 600 ? '#facc15' : '#00D9B5';
  const urgent = remaining < 300;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`font-mono font-black tabular-nums ${urgent ? 'animate-pulse' : ''}`}
           style={{ fontSize: 44, letterSpacing: '-2px', color }}>
        {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
      </div>
      <div className="w-40 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000"
             style={{ width: `${pct}%`, background: color }} />
      </div>
      {urgent && <span className="font-mono text-xs text-red-400 animate-pulse tracking-widest">TIME RUNNING OUT</span>}
    </div>
  );
}

// ─── PLAYER CARD ─────────────────────────────────────────
function PlayerCard({ user, submission, isMe, isWinner, isLoser, isFetching }) {
  const lvl     = Math.min(user?.level || 1, 10);
  const accuracy = user?.totalQuizAttempts > 0
    ? Math.round((user.correctQuizAnswers / user.totalQuizAttempts) * 100) : 0;
  const hasSub  = !!submission;
  const pct     = hasSub ? Math.round((submission.passed / submission.total) * 100) : 0;

  return (
    <div className={`sf-card p-5 relative overflow-hidden flex-1 transition-all ${
      isWinner ? 'ring-2 ring-yellow-400/50 bg-yellow-500/5' :
      isLoser  ? 'opacity-60' : ''
    }`}>
      {/* Winner crown */}
      {isWinner && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500" />
      )}
      {isWinner && (
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <Icons.Trophy size={14} className="text-yellow-400" />
          <span className="font-mono text-xs text-yellow-400 font-bold">WINNER</span>
        </div>
      )}

      {/* Player info */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`relative w-11 h-11 rounded-full flex items-center justify-center font-mono font-bold text-sm border-2 ${
          isWinner ? 'border-yellow-400/60 bg-yellow-500/10 text-yellow-400' :
          isMe     ? 'border-indigo-600/60  bg-indigo-600/10  text-indigo-600' :
                     'border-slate-200   bg-slate-100      text-slate-600'
        }`}>
          {user?.avatarUrl
            ? <img src={user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
            : (user?.username || '?').slice(0,2).toUpperCase()
          }
          {isMe && (
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center border border-sf-bg text-sf-bg text-xs">
              ✓
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`font-mono font-bold text-sm truncate ${isMe ? 'text-indigo-600' : 'text-slate-900'}`}>
              {user?.username || 'Unknown'}
            </span>
            {isMe && <BadgeTag variant="teal" className="text-xs">You</BadgeTag>}
          </div>
          <span className="font-mono text-xs text-slate-500">{LEVEL_NAMES[lvl-1]} · Lv{lvl}</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'XP',       value: (user?.xp||0).toLocaleString(), icon: Icons.Zap,      color: 'text-blue-700' },
          { label: 'Accuracy', value: `${accuracy}%`,                  icon: Icons.Target,   color: 'text-indigo-600'   },
          { label: 'Streak',   value: `${user?.streak||0}d`,           icon: Icons.Fire,     color: 'text-orange-400'   },
        ].map(({ label, value, icon: Ic, color }) => (
          <div key={label} className="bg-slate-100/60 border border-slate-200/50 rounded-lg p-2 text-center">
            <Ic size={11} className={`${color} mx-auto mb-1`} />
            <p className="font-mono text-sm font-bold text-slate-900">{isFetching ? '…' : value}</p>
            <p className="font-mono text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Submission result */}
      {hasSub ? (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-xs text-slate-500">Problems solved</span>
            <span className={`font-mono text-sm font-bold ${pct >= 80 ? 'text-indigo-600' : pct >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {submission.passed}/{submission.total}
            </span>
          </div>
          <ProgressBar value={pct} max={100} color={pct >= 80 ? 'teal' : pct >= 50 ? 'yellow' : 'red'} height={5} />
          <div className="flex gap-2 mt-3 flex-wrap">
            {submission.timeMs && (
              <span className="badge-tag badge-gray font-mono text-xs">
                <Icons.Clock size={9} /> {(submission.timeMs/1000).toFixed(1)}s avg
              </span>
            )}
            {submission.accuracy != null && (
              <span className="badge-tag badge-teal font-mono text-xs">
                <Icons.Target size={9} /> {submission.accuracy}% acc
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-slate-500">
          {isFetching
            ? <><Spinner size={13} /> <span className="font-mono text-xs">Evaluating...</span></>
            : <span className="font-mono text-xs">Waiting for submission...</span>
          }
        </div>
      )}
    </div>
  );
}

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
      toast.error('Battle not found');
      navigate('/battles');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchBattle();
    pollRef.current = setInterval(fetchBattle, 4000);
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
      toast.error('Test runner error');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) { toast.error('Write some code first'); return; }
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
        toast.success(`Problem ${currentProblem + 1} solved! +${r.xp || 50} XP`);
        if (currentProblem < (battle?.totalProblems || 5) - 1) setCurrentProblem(p => p + 1);
      } else {
        toast.error(`${r.passed}/${r.total} test cases passed`);
      }
      fetchBattle();
    } catch {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSurrender = async () => {
    if (!window.confirm('Surrender this battle? You will lose XP.')) return;
    try {
      await api.post(`/battles/${id}/surrender`);
      fetchBattle();
    } catch { toast.error('Failed'); }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size={32} className="text-blue-700" />
        <p className="font-mono text-sm text-slate-500">Loading battle...</p>
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

  const LANGUAGES_AVAILABLE = ['javascript', 'python', 'cpp', 'java', 'typescript', 'rust', 'go'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-body flex flex-col">

      {/* ─── TOP BAR ─── */}
      <div className="h-14 flex items-center justify-between px-6 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/battles')} className="text-slate-500 hover:text-slate-900 transition-colors p-1 rounded hover:bg-slate-100">
            <Icons.ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-400 animate-pulse' : 'bg-sf-dim'}`} />
            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">
              {isActive ? 'LIVE BATTLE' : battle.status}
            </span>
          </div>
          {battle.language && (
            <span className="badge-tag badge-purple font-mono text-xs">{battle.language}</span>
          )}
          {battle.difficulty && (
            <span className={`badge-tag font-mono text-xs ${battle.difficulty === 'HARD' ? 'badge-red' : battle.difficulty === 'MEDIUM' ? 'badge-gold' : 'badge-teal'}`}>
              {battle.difficulty}
            </span>
          )}
        </div>

        {/* Timer */}
        {isActive && battle.endsAt && (
          <BattleTimer endsAt={battle.endsAt} onExpire={fetchBattle} />
        )}

        <div className="flex items-center gap-2">
          {isCompleted && (
            <Button variant="primary" size="sm" onClick={() => setShowReport(true)}>
              <Icons.TrendingUp size={13} /> Report Card
            </Button>
          )}
          {isActive && (
            <Button variant="secondary" size="sm" onClick={handleSurrender}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10">
              Surrender
            </Button>
          )}
        </div>
      </div>

      {/* ─── PLAYER STATUS BAR ─── */}
      <div className="flex gap-0 border-b border-slate-200 flex-shrink-0">
        {/* Me */}
        <div className={`flex-1 flex items-center gap-3 px-5 py-3 ${isChallenger ? 'bg-indigo-600/5 border-r-2 border-r-sf-teal' : 'border-r border-slate-200'}`}>
          <div className="w-8 h-8 rounded-full bg-indigo-600/15 border border-indigo-600/30 flex items-center justify-center font-mono text-xs font-bold text-indigo-600 flex-shrink-0">
            {(me?.username||'?').slice(0,2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-indigo-600 truncate">{me?.username}</span>
              <BadgeTag variant="teal" className="text-xs">You</BadgeTag>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-500">
                {mySub ? `${mySub.passed}/${mySub.total} solved` : 'Not submitted'}
              </span>
              {mySub?.accuracy != null && (
                <span className="font-mono text-xs text-indigo-600">{mySub.accuracy}% acc</span>
              )}
            </div>
          </div>
          {/* Problem indicators */}
          <div className="flex gap-1">
            {Array.from({ length: battle.totalProblems || 5 }, (_, i) => (
              <div key={i} className={`w-5 h-5 rounded text-xs font-mono font-bold flex items-center justify-center cursor-pointer transition-all ${
                results[i]?.passed ? 'bg-indigo-600/20 text-indigo-600 border border-indigo-600/30' :
                results[i]        ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                i === currentProblem ? 'bg-blue-600/20 text-blue-700 border border-blue-600/30' :
                'bg-slate-100 text-slate-500 border border-slate-200/50'
              }`} onClick={() => setCurrentProblem(i)}>
                {i+1}
              </div>
            ))}
          </div>
        </div>

        {/* VS divider */}
        <div className="flex items-center justify-center px-4 bg-slate-100/50">
          <span className="font-mono text-xs text-slate-500">VS</span>
        </div>

        {/* Opponent */}
        <div className={`flex-1 flex items-center gap-3 px-5 py-3 ${!isChallenger ? 'bg-indigo-600/5 border-l-2 border-l-sf-teal' : 'border-l border-slate-200'} flex-row-reverse`}>
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-mono text-xs font-bold text-slate-600 flex-shrink-0">
            {(opponent?.username||'?').slice(0,2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0 text-right">
            <p className="font-mono text-sm font-bold text-slate-900 truncate">{opponent?.username || 'Opponent'}</p>
            <div className="flex items-center gap-3 justify-end">
              {oppSub?.accuracy != null && (
                <span className="font-mono text-xs text-indigo-600">{oppSub.accuracy}% acc</span>
              )}
              <span className="font-mono text-xs text-slate-500">
                {oppSub ? `${oppSub.passed}/${oppSub.total} solved` : 'Not submitted'}
              </span>
            </div>
          </div>
          {/* Opp problem indicators */}
          <div className="flex gap-1">
            {Array.from({ length: battle.totalProblems || 5 }, (_, i) => {
              const solved = (oppSub?.passed || 0) > i;
              return (
                <div key={i} className={`w-5 h-5 rounded text-xs font-mono font-bold flex items-center justify-center ${
                  solved ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-100 text-slate-500 border border-slate-200/50'
                }`}>
                  {i+1}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── MAIN ARENA ─── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* Left: Problem */}
        <div className="w-[38%] flex flex-col border-r border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200 flex-shrink-0">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Problem {currentProblem + 1}</span>
            <div className="flex gap-1">
              {Array.from({ length: battle.totalProblems || 5 }, (_, i) => (
                <button key={i} onClick={() => setCurrentProblem(i)}
                  className={`w-6 h-6 rounded text-xs font-mono font-bold transition-all ${
                    results[i]?.passed ? 'bg-indigo-600/20 text-indigo-600' :
                    results[i]        ? 'bg-red-500/10 text-red-400' :
                    i === currentProblem ? 'bg-blue-600/20 text-blue-700' :
                    'text-slate-500 hover:text-slate-900'
                  }`}>
                  {i+1}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {problem ? (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="font-display font-bold text-base">{problem.title}</h2>
                    <span className={`badge-tag font-mono text-xs ${
                      problem.difficulty === 'HARD' ? 'badge-red' :
                      problem.difficulty === 'MEDIUM' ? 'badge-gold' : 'badge-teal'
                    }`}>{problem.difficulty}</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{problem.description}</p>
                </div>

                {problem.examples?.length > 0 && (
                  <div>
                    <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-2">Examples</p>
                    {problem.examples.map((ex, i) => (
                      <div key={i} className="bg-slate-100 border border-slate-200/50 rounded-lg p-3 mb-2 code-block text-xs">
                        <p><span className="text-indigo-600">Input:</span>  {ex.input}</p>
                        <p><span className="text-indigo-600">Output:</span> {ex.output}</p>
                        {ex.explanation && <p className="text-slate-500 mt-1">{ex.explanation}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {problem.constraints?.length > 0 && (
                  <div>
                    <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-2">Constraints</p>
                    <ul className="space-y-1">
                      {problem.constraints.map((c, i) => (
                        <li key={i} className="font-mono text-xs text-slate-600 flex items-start gap-2">
                          <span className="text-blue-700 mt-0.5">·</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* XP reward */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50">
                  <Icons.Zap size={12} className="text-blue-700" />
                  <span className="font-mono text-xs text-slate-500">Solve to earn</span>
                  <span className="font-mono text-xs text-blue-700 font-bold">+{problem.xpReward || 100} XP</span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-40">
                <p className="font-mono text-sm text-slate-500">No problem loaded</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Code editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor toolbar */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-b border-slate-200 flex-shrink-0">
            <select
              value={selectedLang}
              onChange={e => setSelectedLang(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 text-slate-900 focus:outline-none focus:border-blue-500 transition-all text-sm text-xs w-auto py-1.5"
              disabled={!isActive}
            >
              {LANGUAGES_AVAILABLE.map(l => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
            <div className="flex-1" />
            <button onClick={handleRunTests} disabled={!isActive || running || !code.trim()}
              className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5">
              {running ? <Spinner size={11} /> : <Icons.Play size={11} />}
              Run Tests
            </button>
            <button onClick={handleSubmit} disabled={!isActive || submitting || !code.trim()}
              className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5">
              {submitting ? <Spinner size={11} /> : <Icons.Zap size={11} />}
              Submit
            </button>
          </div>

          {/* Code area */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              disabled={!isActive}
              className="flex-1 w-full bg-slate-50 resize-none outline-none p-4 font-mono text-sm text-slate-900 leading-relaxed"
              style={{ fontFamily: "'JetBrains Mono', Consolas, monospace", minHeight: 0 }}
              placeholder={isActive
                ? `// Write your ${selectedLang} solution here\n// Problem ${currentProblem + 1} of ${battle.totalProblems || 5}\n`
                : battle.status === 'WAITING' ? '// Waiting for opponent to join...' : '// Battle has ended'
              }
              spellCheck={false}
            />

            {/* Test output */}
            {testOutput && (
              <div className="border-t border-slate-200 flex-shrink-0 max-h-52 overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200/50">
                  <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Test Results</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-xs font-bold ${testOutput.passed === testOutput.total ? 'text-indigo-600' : 'text-red-400'}`}>
                      {testOutput.passed}/{testOutput.total} passed
                    </span>
                    <button onClick={() => setTestOutput(null)} className="text-slate-500 hover:text-slate-900">
                      <Icons.X size={12} />
                    </button>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  {(testOutput.results || []).map((r, i) => (
                    <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-lg text-xs font-mono ${
                      r.passed ? 'bg-indigo-600/8 border border-indigo-600/20' : 'bg-red-500/8 border border-red-500/20'
                    }`}>
                      <span className={r.passed ? 'text-indigo-600 mt-0.5' : 'text-red-400 mt-0.5'}>{r.passed ? '✓' : '✗'}</span>
                      <div>
                        <p className="text-slate-900">Case {i+1}</p>
                        {!r.passed && r.expected && (
                          <>
                            <p className="text-slate-500">Expected: <span className="text-indigo-600">{r.expected}</span></p>
                            <p className="text-slate-500">Got: <span className="text-red-400">{r.actual}</span></p>
                          </>
                        )}
                        {r.error && <p className="text-red-400">{r.error}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── REPORT CARD OVERLAY ─── */}
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

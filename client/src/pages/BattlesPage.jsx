import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Avatar, Modal, Spinner } from '@/components/ui';
import { Zap, Trophy, TrendingUp, Search, ChevronRight, Plus } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const LANGUAGES = [
  'javascript','typescript','python','java','cpp','c','csharp','go','rust',
  'kotlin','swift','php','ruby','dart','bash','sql',
];

const TIMER_OPTIONS = [
  { label: '5 MIN',  value: 300 },
  { label: '10 MIN', value: 600 },
  { label: '15 MIN', value: 900 },
  { label: '30 MIN', value: 1800 },
  { label: '45 MIN', value: 2700 },
  { label: '60 MIN', value: 3600 },
];

const MODE_OPTIONS = [
  { id: 'system', label: 'SYSTEM GENERATED', desc: 'AI picks a unique problem. Never repeated.' },
  { id: 'custom', label: 'CUSTOM PROBLEM',   desc: 'Write your own challenge for the opponent.' },
];

const STATUS_STYLE = {
  PENDING:    { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  CONFIGURING:{ color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)' },
  ACTIVE:     { color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
  COMPLETED:  { color: '#666',    bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.06)' },
  ENDED:      { color: '#666',    bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.06)' },
  CANCELLED:  { color: '#DC2626', bg: 'rgba(220,38,38,0.06)', border: 'rgba(220,38,38,0.15)' },
};

// ─── HOST CONFIG PANEL ────────────────────────────────────
function HostConfigPanel({ battle, onStart, onRefresh }) {
  const [mode, setMode]           = useState('system');
  const [language, setLanguage]   = useState('javascript');
  const [timeLimit, setTimeLimit] = useState(1800);
  const [customProblem, setCustomProblem] = useState('');
  const [configuring, setConfiguring] = useState(false);

  const handleStart = async () => {
    setConfiguring(true);
    try {
      const body = { mode, language, timeLimit };
      if (mode === 'custom') body.problemText = customProblem;
      await api.post(`/battles/${battle.id}/configure`, body);
      toast.success('PARAMETERS LOCKED — REDIRECTING');
      await onRefresh();
      onStart();
    } catch { toast.error('CONFIGURATION FAILED'); }
    finally { setConfiguring(false); }
  };

  return (
    <div className="space-y-6">
      {/* Opponent */}
      <div className="flex items-center gap-4 p-4 rounded-[4px] border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <Avatar user={battle.challenged} size={44} />
        <div className="min-w-0">
          <p className="font-mono text-[9px] font-bold text-cyber uppercase tracking-[0.2em] mb-0.5">OPPONENT IDENTITY</p>
          <h4 className="font-black text-lg text-white uppercase tracking-tight">{battle.challenged?.username}</h4>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-[4px] border border-emerald/20 bg-emerald/[0.06]">
          <div className="w-1.5 h-1.5 rounded-[1px] bg-emerald animate-pulse" />
          <span className="font-mono text-[10px] font-black text-emerald uppercase">READY</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mode Selection */}
        <div>
          <p className="font-mono text-[9px] font-black text-[#444] uppercase tracking-[0.2em] mb-3">ENGAGEMENT CORE</p>
          <div className="space-y-2">
            {MODE_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setMode(opt.id)}
                className="flex items-start gap-3 p-4 rounded-[4px] text-left border w-full transition-all duration-150"
                style={{
                  border: `1px solid ${mode === opt.id ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  background: mode === opt.id ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.02)',
                }}
              >
                <div className={`mt-1 w-3.5 h-3.5 rounded-[2px] border flex-shrink-0 flex items-center justify-center ${
                  mode === opt.id ? 'border-cyber bg-cyber/20' : 'border-white/20'
                }`}>
                  {mode === opt.id && <div className="w-1.5 h-1.5 rounded-[1px] bg-cyber" />}
                </div>
                <div>
                  <p className="font-mono text-[11px] font-black text-white uppercase tracking-wider">{opt.label}</p>
                  <p className="font-mono text-[10px] text-[#555] mt-0.5">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {/* Language */}
          <div>
            <p className="font-mono text-[9px] font-black text-[#444] uppercase tracking-[0.2em] mb-3">LANGUAGE RUNTIME</p>
            <div className="flex flex-wrap gap-1.5">
              {LANGUAGES.slice(0, 8).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className="px-3 py-1.5 rounded-[4px] font-mono text-[10px] font-black transition-all duration-150 uppercase tracking-wider border"
                  style={{
                    border: `1px solid ${language === lang ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    background: language === lang ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)',
                    color: language === lang ? '#3B82F6' : '#666',
                  }}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Time Limit */}
          <div>
            <p className="font-mono text-[9px] font-black text-[#444] uppercase tracking-[0.2em] mb-3">TEMPORAL BOUNDS</p>
            <div className="flex flex-wrap gap-1.5">
              {TIMER_OPTIONS.slice(0, 4).map(t => (
                <button
                  key={t.value}
                  onClick={() => setTimeLimit(t.value)}
                  className="px-3 py-1.5 rounded-[4px] font-mono text-[10px] font-black transition-all duration-150 uppercase tracking-wider border"
                  style={{
                    border: `1px solid ${timeLimit === t.value ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    background: timeLimit === t.value ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)',
                    color: timeLimit === t.value ? '#3B82F6' : '#666',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Problem */}
      {mode === 'custom' && (
        <div className="animate-fade-in">
          <p className="font-mono text-[9px] font-black text-[#444] uppercase tracking-[0.2em] mb-3">CUSTOM LOGIC PARAMETERS</p>
          <textarea
            className="w-full rounded-[4px] border border-white/[0.08] p-4 font-mono text-sm text-white placeholder:text-[#333] outline-none focus:border-cyber transition-all duration-150 min-h-[140px]"
            style={{ background: 'rgba(255,255,255,0.02)', resize: 'vertical' }}
            placeholder="// inject problem description and constraints..."
            value={customProblem}
            onChange={e => setCustomProblem(e.target.value)}
          />
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={configuring}
        className="w-full btn-primary py-3 text-xs justify-center disabled:opacity-50"
      >
        {configuring ? <Spinner size={14} /> : <Zap size={14} strokeWidth={1.5} />}
        LOCK PARAMETERS & ENGAGE
      </button>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────
export default function BattlesPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [battles, setBattles]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [opponent, setOpponent] = useState('');
  const [sending, setSending]   = useState(false);
  const [activeConfigBattle, setActiveConfigBattle] = useState(null);

  const fetchBattles = useCallback(async () => {
    try {
      const r = await api.get('/battles');
      const bList = r.data.battles || [];
      setBattles(bList);
      const needsConfig = bList.find(b => b.status === 'CONFIGURING' && b.challengerId === user?.id);
      if (needsConfig && (!activeConfigBattle || activeConfigBattle.id !== needsConfig.id)) {
        setActiveConfigBattle(needsConfig);
      } else if (!needsConfig) {
        setActiveConfigBattle(null);
      }
    } catch { }
    finally { setLoading(false); }
  }, [user?.id, activeConfigBattle]);

  useEffect(() => {
    fetchBattles();
    const id = setInterval(fetchBattles, 3000);
    return () => clearInterval(id);
  }, [fetchBattles]);

  const handleChallenge = async () => {
    if (!opponent.trim()) return;
    setSending(true);
    try {
      const r = await api.post('/battles', { challengedUsername: opponent });
      toast.success('CHALLENGE SENT');
      setModal(false);
      setOpponent('');
      setBattles(prev => [r.data.battle, ...prev]);
    } catch (err) {
      toast.error(err.response?.data?.error || 'COULD NOT SEND CHALLENGE');
    }
    setSending(false);
  };

  const handleRespond = async (battleId, accept) => {
    try {
      await api.post(`/battles/${battleId}/respond`, { accept });
      toast.success(accept ? 'ACCEPTED — WAITING FOR HOST' : 'CHALLENGE DECLINED');
      fetchBattles();
      if (accept) navigate(`/battles/${battleId}`);
    } catch { toast.error('ACTION FAILED'); }
  };

  const pendingIncoming = battles.filter(b => b.status === 'PENDING' && b.challengedId === user?.id);
  const otherBattles    = battles.filter(b => b.status !== 'PENDING' || b.challengerId === user?.id);

  const completedBattles = battles.filter(b => b.status === 'COMPLETED');
  const wins = completedBattles.filter(b => b.winnerId === user?.id).length;
  const winRate = completedBattles.length ? `${Math.round((wins / completedBattles.length) * 100)}%` : '0%';

  return (
    <div className="max-w-5xl mx-auto pb-20 pt-4 space-y-6 animate-fade-in">

      {/* ─── HEADER ─── */}
      <div className="blade p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-[4px] border border-cyber/30 flex items-center justify-center">
              <Zap size={15} strokeWidth={1.5} className="text-cyber" />
            </div>
            <div>
              <h1 className="font-mono font-black text-xl text-white uppercase tracking-[0.05em]">BATTLE ARENA</h1>
              <p className="font-mono text-[9px] font-bold text-[#444] uppercase tracking-[0.2em]">ELITE SECTION · ALPHA</p>
            </div>
          </div>
          <p className="text-sm text-[#666] max-w-sm">
            Challenge engineers, solve logic puzzles, claim your ranking.
          </p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary px-6 py-3 text-xs">
          <Plus size={13} strokeWidth={1.5} /> NEW CHALLENGE
        </button>
      </div>

      {/* ─── STATS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { label: 'BATTLES FOUGHT', value: completedBattles.length, Icon: Trophy },
          { label: 'VICTORIES',      value: wins,                     Icon: TrendingUp },
          { label: 'WIN RATE',       value: winRate,                   Icon: Zap },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="blade p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[9px] font-bold text-[#555] uppercase tracking-[0.15em]">{label}</span>
              <Icon size={13} strokeWidth={1.5} className="text-[#333]" />
            </div>
            <div className="font-mono font-black text-2xl text-white">{value}</div>
          </div>
        ))}
      </div>

      {/* ─── INCOMING CHALLENGES ─── */}
      {pendingIncoming.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-[1px] bg-crimson animate-pulse" />
            <h2 className="font-mono text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">URGENT INBOUND REQUESTS</h2>
          </div>
          {pendingIncoming.map(b => (
            <div
              key={b.id}
              className="blade p-5 flex flex-col sm:flex-row items-center gap-5"
              style={{ borderLeft: '2px solid rgba(220,38,38,0.4)' }}
            >
              <Avatar user={b.challenger} size={48} />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-mono font-black text-sm text-white uppercase">
                  {b.challenger?.username} <span className="font-normal text-[#555]">INITIATED A BATTLE</span>
                </h3>
                <p className="text-xs text-[#666] mt-0.5">Ready to defend your ranking?</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => handleRespond(b.id, true)} className="btn-primary flex-1 sm:flex-none text-[10px]">
                  ACCEPT
                </button>
                <button
                  onClick={() => handleRespond(b.id, false)}
                  className="flex-1 sm:flex-none px-5 py-2 rounded-[4px] border border-white/[0.08] font-mono text-[11px] font-black text-[#555] hover:text-white hover:border-white/20 transition-all duration-150 uppercase tracking-wider"
                >
                  DECLINE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── BATTLE HISTORY ─── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">BATTLE TRANSCRIPT</h2>
          <span className="font-mono text-[9px] font-bold text-[#333] uppercase tracking-wider">REAL-TIME</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size={24} className="text-cyber" />
          </div>
        ) : otherBattles.length === 0 ? (
          <div
            className="py-20 text-center rounded-[4px] border border-dashed border-white/[0.06]"
            style={{ background: 'rgba(255,255,255,0.01)' }}
          >
            <Zap size={28} strokeWidth={1} className="text-[#222] mx-auto mb-3" />
            <p className="font-mono text-[11px] font-bold text-[#444] uppercase tracking-[0.2em]">NO TRANSCRIPTS DETECTED</p>
          </div>
        ) : (
          <div className="space-y-2">
            {otherBattles.map(b => {
              const opp      = b.challengerId === user?.id ? b.challenged : b.challenger;
              const isWinner = b.winnerId === user?.id;
              const isDraw   = b.status === 'COMPLETED' && !b.winnerId;
              const isActive = b.status === 'ACTIVE';
              const style    = STATUS_STYLE[b.status] || STATUS_STYLE.COMPLETED;

              return (
                <div
                  key={b.id}
                  onClick={() => navigate(`/battles/${b.id}`)}
                  className="blade flex flex-col sm:flex-row sm:items-center gap-4 p-4 cursor-pointer hover:border-white/20 transition-all duration-150 group"
                >
                  <Avatar user={opp} size={40} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-mono font-black text-sm text-white uppercase group-hover:text-cyber transition-colors duration-150">{opp?.username}</span>
                      <span
                        className="font-mono text-[9px] font-black px-2 py-0.5 rounded-[2px] uppercase tracking-[0.1em]"
                        style={{ color: style.color, background: style.bg, border: `1px solid ${style.border}` }}
                      >
                        {b.status}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] font-bold text-[#444] uppercase tracking-wider">
                      {formatDistanceToNow(new Date(b.createdAt), { addSuffix: true }).toUpperCase()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <div className="text-right">
                      {b.status === 'COMPLETED' ? (
                        <div className="font-mono text-sm font-black" style={{ color: isWinner ? '#10B981' : isDraw ? '#F59E0B' : '#DC2626' }}>
                          {isWinner ? 'VICTORY' : isDraw ? 'DRAW' : 'DEFEAT'}
                        </div>
                      ) : isActive ? (
                        <div className="flex items-center gap-1.5 font-mono text-[10px] font-black text-emerald">
                          <span className="w-1.5 h-1.5 rounded-[1px] bg-emerald animate-pulse" /> LIVE
                        </div>
                      ) : null}
                    </div>
                    <div className="w-8 h-8 rounded-[4px] border border-white/[0.06] flex items-center justify-center text-[#333] group-hover:border-cyber/30 group-hover:text-cyber transition-all duration-150">
                      <ChevronRight size={14} strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── CONFIG MODAL ─── */}
      {activeConfigBattle && (
        <Modal open={true} onClose={() => setActiveConfigBattle(null)} title="MATCH CALIBRATION REQUIRED" width="max-w-2xl">
          <HostConfigPanel
            battle={activeConfigBattle}
            onStart={() => { const bid = activeConfigBattle.id; setActiveConfigBattle(null); navigate(`/battles/${bid}`); }}
            onRefresh={fetchBattles}
          />
        </Modal>
      )}

      {/* ─── NEW CHALLENGE MODAL ─── */}
      <Modal open={modal} onClose={() => setModal(false)} title="TARGET SELECTION">
        <div className="space-y-5">
          <p className="font-mono text-[11px] text-[#555] text-center uppercase tracking-wider">
            INPUT OPERATIVE CODENAME TO INITIATE ENGAGEMENT
          </p>
          <div className="relative">
            <Search size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
            <input
              type="text"
              value={opponent}
              onChange={e => setOpponent(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleChallenge()}
              placeholder="SEARCH OPERATIVE..."
              className="w-full pl-9 pr-4 py-3 rounded-[4px] border border-white/[0.08] bg-white/[0.02] font-mono text-[12px] font-bold text-white placeholder:text-[#333] focus:outline-none focus:border-cyber transition-all duration-150 uppercase tracking-wider"
            />
          </div>
          <button
            onClick={handleChallenge}
            disabled={sending || !opponent.trim()}
            className="w-full btn-primary py-3 text-xs justify-center disabled:opacity-40"
          >
            {sending ? <Spinner size={13} /> : <Zap size={13} strokeWidth={1.5} />}
            LAUNCH CHALLENGE
          </button>
        </div>
      </Modal>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Avatar, BadgeTag, Button, Modal, Input, Spinner } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const LANGUAGES = [
  'javascript','typescript','python','java','cpp','c','csharp','go','rust',
  'kotlin','swift','php','ruby','dart','bash','sql','html','css'
];

const TIMER_OPTIONS = [
  { label: '5 min',  value: 300 },
  { label: '10 min', value: 600 },
  { label: '15 min', value: 900 },
  { label: '30 min', value: 1800 },
  { label: '45 min', value: 2700 },
  { label: '60 min', value: 3600 },
];

const MODE_OPTIONS = [
  { id: 'system', label: 'System Generated', desc: 'AI picks a unique problem. Never repeated.' },
  { id: 'custom', label: 'Custom Problem', desc: 'Write your own challenge for the opponent.' },
];

export default function BattlesPage() {
  const navigate  = useNavigate();
  const { user }  = useAuthStore();
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
      
      // AUTO-POPUP LOGIC: Find if any battle needs configuration by ME (the challenger)
      const needsConfig = bList.find(b => b.status === 'CONFIGURING' && b.challengerId === user?.id);
      if (needsConfig && (!activeConfigBattle || activeConfigBattle.id !== needsConfig.id)) {
        setActiveConfigBattle(needsConfig);
      } else if (!needsConfig) {
        setActiveConfigBattle(null);
      }
    } catch (err) { console.error('Poll error', err); }
    finally { setLoading(false); }
  }, [user?.id, activeConfigBattle]);

  useEffect(() => {
    fetchBattles();
    const id = setInterval(fetchBattles, 3000); // Poll every 3s
    return () => clearInterval(id);
  }, [fetchBattles]);

  const handleChallenge = async () => {
    if (!opponent.trim()) return;
    setSending(true);
    try {
      const r = await api.post('/battles', { challengedUsername: opponent });
      toast.success('Challenge sent! Watching for response...');
      setModal(false);
      setOpponent('');
      setBattles(prev => [r.data.battle, ...prev]);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not send challenge');
    }
    setSending(false);
  };

  const pendingIncoming = battles.filter(b => b.status === 'PENDING' && b.challengedId === user?.id);
  const otherBattles = battles.filter(b => b.status !== 'PENDING' || b.challengerId === user?.id);

  const handleRespond = async (battleId, accept) => {
    try {
      await api.post(`/battles/${battleId}/respond`, { accept });
      toast.success(accept ? 'Accepted! Waiting for host.' : 'Challenge declined.');
      fetchBattles();
      if (accept) navigate(`/battles/${battleId}`);
    } catch (err) { toast.error('Action failed'); }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 pt-6 px-4 space-y-10 animate-fade-in">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100 transform -rotate-3">
               <Icons.Zap size={22} className="text-white fill-white" />
             </div>
             <div>
               <h1 className="font-display font-black text-3xl text-slate-900 tracking-tight leading-none uppercase">Battle Arena</h1>
               <p className="font-mono text-[10px] font-bold text-indigo-600 tracking-[0.2em] mt-1 ml-0.5">ELITE SECTION • ALPHA VERSION</p>
             </div>
          </div>
          <p className="font-body text-sm text-slate-500 max-w-sm ml-1">
            Reconstructed for peak performance. Challenge the best, solve logic puzzles, and claim your place in the rankings.
          </p>
        </div>
        <button onClick={() => setModal(true)} 
          className="flex items-center justify-center gap-2 px-10 py-4 rounded-2xl bg-slate-900 text-white font-bold shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-100 transition-all active:scale-95 group overflow-hidden relative">
          <Icons.Zap size={16} className="group-hover:animate-pulse relative z-10" />
          <span className="relative z-10">New Challenge</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>
      </div>

      {/* ─── STATS RECONSTRUCTED ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Battles Fought', value: battles.filter(b => b.status === 'COMPLETED').length, icon: Icons.Trophy, color: 'indigo' },
          { label: 'Victories', value: battles.filter(b => b.status === 'COMPLETED' && b.winnerId === user?.id).length, icon: Icons.Target, color: 'emerald' },
          { label: 'Success Rate', value: (() => {
            const done = battles.filter(b => b.status === 'COMPLETED');
            const wins = done.filter(b => b.winnerId === user?.id).length;
            return done.length ? `${Math.round((wins/done.length)*100)}%` : '0%';
          })(), icon: Icons.TrendingUp, color: 'blue' },
        ].map((stat) => (
          <div key={stat.label} className="group bg-white p-7 rounded-[2rem] border border-slate-100/80 shadow-sm hover:shadow-md transition-all">
            <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight mb-0.5">{stat.value}</div>
            <div className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ─── ACTION QUEUE ─── */}
      {pendingIncoming.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
             <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
             <h2 className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">Urgent Inbound Requests</h2>
          </div>
          {pendingIncoming.map(b => (
            <div key={b.id} className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white border border-slate-200 rounded-[2rem] shadow-lg shadow-slate-100 animate-in slide-in-from-left-4 duration-500">
              <Avatar user={b.challenger} size={56} className="ring-4 ring-slate-50 shadow-sm" />
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold text-lg text-slate-900 mb-0.5">{b.challenger?.username} <span className="font-normal text-slate-400">Initiated a Battle</span></h3>
                <p className="text-sm text-slate-500 font-body">Ready to defend your ranking? The match is waiting for your signal.</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button onClick={() => handleRespond(b.id, true)} className="flex-1 md:flex-none px-8 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Accept</button>
                <button onClick={() => handleRespond(b.id, false)} className="flex-1 md:flex-none px-8 py-3.5 rounded-2xl bg-slate-50 text-slate-500 font-bold hover:bg-slate-100 transition-all">Ignore</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── BATTLE HISTORY ─── */}
      <div className="space-y-5">
        <div className="flex items-center justify-between px-2">
          <h2 className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Battle Transcript</h2>
          <BadgeTag variant="gray" className="text-[9px] font-bold opacity-60">UPDATED REAL-TIME</BadgeTag>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size={32} className="text-indigo-600" /></div>
        ) : otherBattles.length === 0 ? (
          <div className="p-20 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
            <Icons.Zap size={40} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold font-mono text-xs uppercase tracking-widest">No Active Transcripts Detected</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {otherBattles.map((b) => {
              const opp = b.challengerId === user?.id ? b.challenged : b.challenger;
              const isWinner = b.winnerId === user?.id;
              const isDraw   = b.status === 'COMPLETED' && !b.winnerId;
              const isActive = b.status === 'ACTIVE';

              return (
                <div key={b.id} onClick={() => navigate(`/battles/${b.id}`)}
                  className="group flex flex-col sm:flex-row sm:items-center gap-5 p-5 bg-white border border-slate-100 rounded-3xl hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 hover:-translate-y-0.5 transition-all cursor-pointer relative overflow-hidden">
                  <Avatar user={opp} size={44} className="rounded-2xl ring-2 ring-slate-50 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-3 mb-1">
                      <span className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{opp?.username}</span>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest border ${statusColor[b.status]}`}>{b.status}</span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400/80">{formatDistanceToNow(new Date(b.createdAt), { addSuffix: true })}</p>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-4 sm:pt-0 border-t sm:border-0 border-slate-50">
                    <div className="text-right">
                      {b.status === 'COMPLETED' ? (
                        <div className={`text-sm font-black tracking-tighter ${isWinner ? 'text-emerald-500' : isDraw ? 'text-indigo-600' : 'text-red-400'}`}>
                          {isWinner ? 'DOMINATION' : isDraw ? 'STALEMATE' : 'DEFEATED'}
                        </div>
                      ) : isActive ? (
                        <div className="flex items-center gap-2 text-indigo-600 font-mono text-[9px] font-bold bg-indigo-50 px-3 py-1 rounded-full">
                          <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping" /> ENGAGED
                        </div>
                      ) : (
                        <div className="text-[9px] font-mono font-bold text-slate-300 tracking-[0.2em] italic">ARCHIVED DATA</div>
                      )}
                    </div>
                    <div className="w-9 h-9 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                      <Icons.ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── AUTO-POPUP CONFIGURATION MODAL ─── */}
      {activeConfigBattle && (
        <Modal open={true} onClose={() => setActiveConfigBattle(null)} title="Match Calibration Required" size="xl">
          <HostConfigPanel 
            battle={activeConfigBattle} 
            onStart={() => {
              const bid = activeConfigBattle.id;
              setActiveConfigBattle(null);
              navigate(`/battles/${bid}`);
            }} 
            onRefresh={fetchBattles} 
          />
        </Modal>
      )}

      {/* ─── NEW CHALLENGE MODAL ─── */}
      <Modal open={modal} onClose={() => setModal(false)} title="Target Selection">
        <div className="p-4 space-y-6">
          <div className="text-center font-body text-sm text-slate-500 leading-relaxed max-w-[320px] mx-auto">
            Input the operative's unique codename to initiate a high-stakes logical engagement.
          </div>
          <Input 
            label="X-Codename" borderless
            placeholder="Search operative..." 
            value={opponent} onChange={(e) => setOpponent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChallenge()}
            icon={<Icons.Search size={16} className="text-slate-400" />}
            className="rounded-[1.5rem] bg-slate-50 py-4 px-6 border-transparent focus:bg-white focus:border-indigo-100"
          />
          <Button onClick={handleChallenge} variant="primary" className="w-full py-5 rounded-[1.5rem] shadow-xl shadow-slate-100 text-base font-black tracking-widest uppercase" loading={sending}>
            Launch Sector Challenge
          </Button>
        </div>
      </Modal>
    </div>
  );
}

// ─── RECONSTRUCTED HOST CONFIG PANEL ──────────────────────────────
function HostConfigPanel({ battle, onStart, onRefresh }) {
  const [mode, setMode]         = useState('system');
  const [language, setLanguage] = useState('javascript');
  const [timeLimit, setTimeLimit] = useState(1800);
  const [customProblem, setCustomProblem] = useState('');
  const [configuring, setConfiguring] = useState(false);

  const handleStart = async () => {
    setConfiguring(true);
    try {
      const body = { mode, language, timeLimit };
      if (mode === 'custom') body.problemText = customProblem;
      await api.post(`/battles/${battle.id}/configure`, body);
      toast.success('Battle parameters locked. Redirecting...');
      await onRefresh();
      onStart();
    } catch (err) { toast.error('Configuration failed'); }
    finally { setConfiguring(false); }
  };

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden animate-in zoom-in-95 duration-500 max-w-3xl mx-auto">
      <div className="px-10 py-8 space-y-10">
        
        {/* Opponent Identity */}
        <div className="flex items-center gap-5 p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100">
          <Avatar user={battle.challenged} size={48} className="ring-4 ring-white shadow-sm" />
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">Opponent Identity</p>
            <h4 className="font-black text-xl text-slate-900 tracking-tight">{battle.challenged?.username}</h4>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="font-mono text-[10px] font-bold">READY</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Mode Selection */}
          <div className="space-y-4">
             <label className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Engagement Core</label>
             <div className="space-y-3">
                {MODE_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => setMode(opt.id)}
                    className={`flex items-start gap-4 p-5 rounded-[1.5rem] text-left border transition-all relative overflow-hidden group ${
                      mode === opt.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'
                    }`}>
                    <div className={`mt-1.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${mode === opt.id ? 'bg-white border-white' : 'border-slate-200'}`}>
                      {mode === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                    </div>
                    <div>
                      <p className={`font-black text-xs uppercase tracking-tight ${mode === opt.id ? 'text-white' : 'text-slate-900'}`}>{opt.label}</p>
                      <p className={`text-[10px] mt-1 leading-relaxed font-medium ${mode === opt.id ? 'text-indigo-100' : 'text-slate-500'}`}>{opt.desc}</p>
                    </div>
                  </button>
                ))}
             </div>
          </div>

          <div className="space-y-8">
            {/* Runtime Selection */}
            <div>
              <label className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-4 block">Language Runtime</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.slice(0, 7).map(lang => (
                  <button key={lang} onClick={() => setLanguage(lang)}
                    className={`px-4 py-2.5 rounded-[1.2rem] font-mono text-[10px] font-bold transition-all border ${
                      language === lang ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-100' : 'bg-slate-50 text-slate-500 border-transparent hover:bg-slate-100'
                    }`}>{lang.toUpperCase()}</button>
                ))}
              </div>
            </div>

            {/* Time Bound */}
            <div>
              <label className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-4 block">Temporal Bounds</label>
              <div className="flex flex-wrap gap-2">
                {TIMER_OPTIONS.slice(0, 4).map(t => (
                  <button key={t.value} onClick={() => setTimeLimit(t.value)}
                    className={`px-5 py-2.5 rounded-[1.2rem] text-[10px] font-bold transition-all border ${
                      timeLimit === t.value ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-500 border-transparent hover:bg-slate-100'
                    }`}>{t.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {mode === 'custom' && (
          <div className="animate-in slide-in-from-top-4 duration-500">
            <label className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-3 block">Custom Logic Parameters</label>
            <textarea className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] p-6 text-sm text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-100 min-h-[160px] transition-all"
              placeholder="Inject problem description and constraints for your opponent..." value={customProblem} onChange={e => setCustomProblem(e.target.value)}
            />
          </div>
        )}

        <button onClick={handleStart} disabled={configuring}
          className="w-full py-5 rounded-[2rem] bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl shadow-indigo-100/50">
          {configuring ? <Spinner size={16} /> : <Icons.Zap size={18} className="fill-white" />} 
          Lock Parameters & Engange
        </button>
      </div>
    </div>
  );
}

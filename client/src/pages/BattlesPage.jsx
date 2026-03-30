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

  useEffect(() => {
    api.get('/battles').then((r) => setBattles(r.data.battles || [])).finally(() => setLoading(false));
  }, []);

  const handleChallenge = async () => {
    if (!opponent.trim()) return;
    setSending(true);
    try {
      const r = await api.post('/battles', { challengedUsername: opponent });
      toast.success('Challenge sent! Waiting for opponent to accept.');
      setModal(false);
      setOpponent('');
      setBattles(prev => [r.data.battle, ...prev]);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not send challenge');
    }
    setSending(false);
  };

  const pendingIncoming = battles.filter(b => b.status === 'PENDING' && b.challengedId === user?.id);
  const configuringBattles = battles.filter(b => b.status === 'CONFIGURING' && b.challengerId === user?.id);
  const otherBattles = battles.filter(b => !pendingIncoming.includes(b) && !configuringBattles.includes(b));

  const handleRespond = async (battleId, accept) => {
    try {
      await api.post(`/battles/${battleId}/respond`, { accept });
      toast.success(accept ? 'Accepted! Waiting for host to configure.' : 'Challenge declined.');
      const r = await api.get('/battles');
      setBattles(r.data.battles || []);
      if (accept) navigate(`/battles/${battleId}`);
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const statusColor = {
    PENDING:     'bg-purple-100 text-purple-700 border-purple-200',
    CONFIGURING: 'bg-blue-100 text-blue-700 border-blue-200',
    ACTIVE:      'bg-green-100 text-green-700 border-green-200',
    COMPLETED:   'bg-slate-100 text-slate-700 border-slate-200',
    DECLINED:    'bg-red-100 text-red-700 border-red-200',
    EXPIRED:     'bg-slate-100 text-slate-400 border-slate-200',
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-4 space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-200">
              <Icons.Zap size={20} className="text-white fill-white" />
            </div>
            <h1 className="font-display font-black text-3xl text-slate-900 tracking-tight uppercase">Battle Arena</h1>
          </div>
          <p className="font-body text-sm text-slate-500 max-w-sm">Enter the high-stakes arena. Challenge peers, solve logic puzzles, and climb the rankings.</p>
        </div>
        <button onClick={() => setModal(true)} className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 group">
          <Icons.Zap size={16} className="group-hover:animate-pulse" /> Create Challenge
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Battles Fought', value: battles.filter(b => b.status === 'COMPLETED').length, icon: Icons.Trophy, color: 'text-blue-600' },
          { label: 'Victories', value: battles.filter(b => b.status === 'COMPLETED' && b.winnerId === user?.id).length, icon: Icons.Target, color: 'text-green-600' },
          { label: 'Win Rate', value: (() => {
            const done = battles.filter(b => b.status === 'COMPLETED');
            const wins = done.filter(b => b.winnerId === user?.id).length;
            return done.length ? `${Math.round((wins/done.length)*100)}%` : '0%';
          })(), icon: Icons.TrendingUp, color: 'text-purple-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl bg-slate-50 border border-slate-100 ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Incoming / Host Actions */}
      {(pendingIncoming.length > 0 || configuringBattles.length > 0) && (
        <div className="space-y-6">
          <h2 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Action Required</h2>
          
          {pendingIncoming.map(b => (
            <div key={b.id} className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-200">
              <Avatar user={b.challenger} size={48} className="ring-4 ring-blue-500/30" />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-lg leading-tight mb-1">{b.challenger?.username} challenged you!</h3>
                <p className="text-sm text-blue-100">Ready to prove your skills? The arena awaits your response.</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => handleRespond(b.id, true)} className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition-all">Accept Match</button>
                <button onClick={() => handleRespond(b.id, false)} className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-blue-700/50 text-white font-bold hover:bg-blue-700 transition-all">Decline</button>
              </div>
            </div>
          ))}

          {configuringBattles.map(b => (
            <HostConfigPanel key={b.id} battle={b} onStart={() => navigate(`/battles/${b.id}`)} onRefresh={async () => {
              const r = await api.get('/battles');
              setBattles(r.data.battles || []);
            }} />
          ))}
        </div>
      )}

      {/* Main Container */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">Battle Transcript</h2>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase">Global History</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size={24} className="text-blue-600" /></div>
        ) : otherBattles.length === 0 ? (
          <div className="p-16 text-center bg-white border border-slate-100 rounded-3xl border-dashed">
            <Icons.Zap size={32} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No archived battles found in your sector.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {otherBattles.map((b) => {
              const opp = b.challengerId === user?.id ? b.challenged : b.challenger;
              const isWinner = b.winnerId === user?.id;
              const isDraw   = b.status === 'COMPLETED' && !b.winnerId;
              const isActive = b.status === 'ACTIVE';

              return (
                <div key={b.id} onClick={() => navigate(`/battles/${b.id}`)}
                  className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                  <Avatar user={opp} size={40} className="rounded-xl ring-2 ring-slate-50 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{opp?.username}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border ${statusColor[b.status]}`}>{b.status}</span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400">{formatDistanceToNow(new Date(b.createdAt), { addSuffix: true })}</p>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-slate-50">
                    <div className="text-right">
                      {b.status === 'COMPLETED' ? (
                        <div className={`text-sm font-black tracking-tight ${isWinner ? 'text-yellow-500' : isDraw ? 'text-blue-600' : 'text-red-400'}`}>
                          {isWinner ? 'VICTORY' : isDraw ? 'DRAW' : 'DEFEAT'}
                        </div>
                      ) : isActive ? (
                        <div className="flex items-center gap-2 text-indigo-600 font-mono text-[10px] font-bold">
                          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" /> IN PROGRESS
                        </div>
                      ) : (
                        <div className="text-[10px] font-mono font-bold text-slate-400">ARCHIVED</div>
                      )}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Icons.ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Challenge Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="New Sector Challenge">
        <div className="p-2 space-y-6">
          <div className="text-center font-body text-sm text-slate-500 leading-relaxed max-w-[280px] mx-auto">
            Specify a target operative to initiate a coding engagement.
          </div>
          <Input 
            label="X-Username" borderless
            placeholder="Search operative..." 
            value={opponent} onChange={(e) => setOpponent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChallenge()}
            icon={<Icons.Search size={14} className="text-slate-400" />}
          />
          <Button onClick={handleChallenge} variant="primary" className="w-full py-4 rounded-2xl shadow-lg shadow-blue-100" loading={sending}>
            Launch Challenge
          </Button>
        </div>
      </Modal>
    </div>
  );
}

// ─── HOST CONFIGURATION PANEL ──────────────────────────────
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
      toast.success('Initiating match sequence...');
      await onRefresh();
      onStart();
    } catch (err) { toast.error(err.response?.data?.error || 'System fault'); }
    setConfiguring(false);
  };

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 animate-in zoom-in-95 duration-500">
      <div className="px-8 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
          <span className="font-mono text-[10px] font-bold text-white uppercase tracking-[0.2em]">Match Configuration — Host Active</span>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
          <Avatar user={battle.challenged} size={40} className="ring-2 ring-blue-500/20" />
          <div className="min-w-0">
            <h4 className="font-bold text-white tracking-tight">{battle.challenged?.username}</h4>
            <p className="text-[11px] text-slate-400 font-mono">Opponent Ready · Channel Secure</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
             <label className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Core Engagement Mode</label>
             <div className="grid grid-cols-1 gap-2">
                {MODE_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => setMode(opt.id)}
                    className={`flex items-start gap-3 p-4 rounded-2xl text-left border transition-all ${
                      mode === opt.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'
                    }`}>
                    <div className={`mt-1 w-3 h-3 rounded-full border-2 ${mode === opt.id ? 'bg-white border-white' : 'border-slate-600'}`} />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-tight">{opt.label}</p>
                      <p className={`text-[10px] mt-0.5 leading-relaxed ${mode === opt.id ? 'text-blue-100' : 'text-slate-500'}`}>{opt.desc}</p>
                    </div>
                  </button>
                ))}
             </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Programming Runtime</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.slice(0, 8).map(lang => (
                  <button key={lang} onClick={() => setLanguage(lang)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold transition-all border ${
                      language === lang ? 'bg-white text-slate-900 border-white' : 'text-slate-400 border-white/10 hover:border-white/30'
                    }`}>{lang}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Temporal Bound (Timer)</label>
              <div className="flex flex-wrap gap-2">
                {TIMER_OPTIONS.slice(0, 4).map(t => (
                  <button key={t.value} onClick={() => setTimeLimit(t.value)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                      timeLimit === t.value ? 'bg-blue-600 text-white border-blue-600' : 'text-slate-400 border-white/10 hover:border-white/30'
                    }`}>{t.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {mode === 'custom' && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <label className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Operative Instructions (Problem)</label>
            <textarea className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500 min-h-[120px] transition-all"
              placeholder="Inject custom logic parameters for the opponent..." value={customProblem} onChange={e => setCustomProblem(e.target.value)}
            />
          </div>
        )}

        <button onClick={handleStart} disabled={configuring}
          className="w-full py-4 rounded-2xl bg-white text-slate-900 font-black uppercase tracking-widest text-xs hover:bg-blue-50 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
          {configuring ? <Spinner size={14} /> : <Icons.Zap size={14} className="fill-slate-900" />} Initiate Engagement Sequence
        </button>
      </div>
    </div>
  );
}

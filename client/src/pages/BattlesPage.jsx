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
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  const statusColor = {
    PENDING:     'bg-amber-100 text-amber-700 border-amber-200',
    CONFIGURING: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    ACTIVE:      'bg-emerald-100 text-emerald-700 border-emerald-200',
    COMPLETED:   'bg-slate-100 text-slate-700 border-slate-200',
    DECLINED:    'bg-red-100 text-red-700 border-red-200',
    EXPIRED:     'bg-slate-100 text-slate-500 border-slate-200',
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20 font-sans animate-fade-in">
      <div className="flex items-end justify-between border-b border-slate-200 pb-6 pt-4">
        <div>
           <span className="bg-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block">
            1V1 ARENA
          </span>
          <h1 className="font-display font-black text-4xl text-slate-900 mb-2 tracking-tight">Battles</h1>
          <p className="text-lg text-slate-600">Challenge any developer in real-time. Prove your speed and syntax.</p>
        </div>
        <button onClick={() => setModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2">
          <Icons.Zap size={16} /> Challenge
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Battles Fought', icon: Icons.Activity, value: battles.filter(b => b.status === 'COMPLETED').length },
          { label: 'Wins', icon: Icons.Trophy, value: battles.filter(b => b.status === 'COMPLETED' && b.winnerId === user?.id).length },
          { label: 'Win Rate', icon: Icons.Target, value: (() => {
            const done = battles.filter(b => b.status === 'COMPLETED');
            const wins = done.filter(b => b.winnerId === user?.id).length;
            return done.length ? `${Math.round((wins/done.length)*100)}%` : '—';
          })() },
        ].map(({ label, icon: Ic, value }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-sm">
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-50 flex items-center justify-center mb-3">
              <Ic size={18} className="text-blue-600" />
            </div>
            <div className="font-display font-black text-3xl text-slate-900 mb-1 leading-none tracking-tight">{value}</div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest">{label}</div>
          </div>
        ))}
      </div>

      {pendingIncoming.length > 0 && (
        <div className="bg-white border border-amber-200 rounded-3xl overflow-hidden shadow-lg shadow-amber-900/5">
          <div className="px-6 py-4 border-b border-amber-100 bg-amber-50">
            <span className="font-bold text-sm text-amber-700 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Incoming Challenges
            </span>
          </div>
          <div className="divide-y divide-amber-50/50">
            {pendingIncoming.map(b => (
              <div key={b.id} className="flex items-center gap-5 px-6 py-5 bg-white">
                <Avatar user={b.challenger} size={48} className="border-2 border-slate-100 shadow-sm" />
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-lg text-slate-900 leading-tight">{b.challenger?.username}</span>
                  <p className="text-sm font-medium text-slate-500">wants to battle you in a live match!</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleRespond(b.id, true)} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-sm">Accept Match</button>
                  <button onClick={() => handleRespond(b.id, false)} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {configuringBattles.map(b => (
        <HostConfigPanel key={b.id} battle={b} onStart={() => navigate(`/battles/${b.id}`)} onRefresh={async () => {
          const r = await api.get('/battles');
          setBattles(r.data.battles || []);
        }} />
      ))}

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" /></div>
      ) : otherBattles.length === 0 && pendingIncoming.length === 0 && configuringBattles.length === 0 ? (
        <div className="border border-slate-200 border-dashed rounded-3xl p-20 text-center bg-slate-50/50">
          <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-6">
            <Icons.Zap size={32} className="text-slate-300" />
          </div>
          <h3 className="font-display font-black text-2xl text-slate-900 mb-2">No Battle History</h3>
          <p className="text-slate-500 text-lg max-w-sm mx-auto mb-8">Ready to test your skills? Challenge a friend to your first 1v1 match.</p>
          <button onClick={() => setModal(true)} className="bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-blue-700 shadow-sm">
            Start a Battle
          </button>
        </div>
      ) : otherBattles.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <span className="font-bold text-sm text-slate-500 uppercase tracking-widest">Match History</span>
          </div>
          <div className="divide-y divide-slate-100">
            {otherBattles.map((b) => {
              const opp = b.challengerId === user?.id ? b.challenged : b.challenger;
              const isWinner = b.winnerId === user?.id;
              const isDraw   = b.status === 'COMPLETED' && !b.winnerId;
              const isActive = b.status === 'ACTIVE';
              const isConfig = b.status === 'CONFIGURING';

              return (
                <div
                  key={b.id}
                  className="flex items-center gap-5 px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors group"
                  onClick={() => navigate(`/battles/${b.id}`)}
                >
                  <Avatar user={opp} size={44} className="border border-slate-200 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-slate-900">{opp?.username}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${statusColor[b.status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {b.status}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 mt-1 block uppercase tracking-wider">
                      {formatDistanceToNow(new Date(b.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    {b.status === 'COMPLETED' && (
                      <span className={`font-black text-sm px-3 py-1 rounded-full ${isWinner ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : isDraw ? 'bg-slate-100 text-slate-500 border border-slate-200' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {isWinner ? 'VICTORY' : isDraw ? 'DRAW' : 'DEFEAT'}
                      </span>
                    )}
                    {isActive && (
                      <span className="flex items-center gap-1.5 font-bold text-xs text-emerald-600 tracking-widest uppercase bg-emerald-50 px-3 py-1 border border-emerald-100 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE
                      </span>
                    )}
                    {isConfig && (
                      <span className="font-bold text-xs text-indigo-600 tracking-widest uppercase bg-indigo-50 px-3 py-1 border border-indigo-100 rounded-full">Configuring</span>
                    )}
                    <Icons.ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Challenge Developer">
        <div className="space-y-6">
          <p className="text-sm text-slate-600">Enter the exact username of the developer you want to challenge to a 1v1 coding battle.</p>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Username</label>
            <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="e.g. sarthak_k"
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChallenge()}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setModal(false)} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-sm">Cancel</button>
            <button onClick={handleChallenge} disabled={sending} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2">
              <Icons.Zap size={16} /> <span>{sending ? 'Sending...' : 'Issue Challenge'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

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
      toast.success('Battle started! Timer is running.');
      await onRefresh();
      onStart();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to start');
    }
    setConfiguring(false);
  };

  return (
    <div className="bg-white border-2 border-indigo-500 rounded-3xl overflow-hidden shadow-xl shadow-indigo-500/10">
      <div className="px-6 py-4 border-b border-indigo-100 bg-indigo-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          <span className="font-bold text-xs text-indigo-700 uppercase tracking-widest">Configuration Required — You Are Host</span>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <Avatar user={battle.challenged} size={40} className="border border-white shadow-sm" />
          <div>
            <p className="font-bold text-base text-slate-900">{battle.challenged?.username}</p>
            <p className="text-sm font-medium text-slate-500">has accepted! Configure the match rules to begin.</p>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Problem Mode</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MODE_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setMode(opt.id)}
                className={`p-4 rounded-2xl text-left border-2 transition-all ${mode === opt.id ? 'bg-indigo-50 border-indigo-500 shadow-sm' : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
              >
                <p className={`font-bold text-sm mb-1 ${mode === opt.id ? 'text-indigo-900' : 'text-slate-900'}`}>{opt.label}</p>
                <p className="font-medium text-xs text-slate-500">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {mode === 'custom' && (
          <div className="animate-fade-in">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Problem Statement</label>
            <textarea
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 min-h-[120px]"
              placeholder="Describe the challenge parameters, example inputs, constraints..."
              value={customProblem}
              onChange={(e) => setCustomProblem(e.target.value)}
            />
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Language</label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${language === lang ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >{lang}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Time Limit</label>
          <div className="flex flex-wrap gap-2">
            {TIMER_OPTIONS.map(t => (
              <button
                key={t.value}
                onClick={() => setTimeLimit(t.value)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border ${timeLimit === t.value ? 'bg-blue-50 text-blue-700 border-blue-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >{t.label}</button>
            ))}
          </div>
        </div>

        <button onClick={handleStart} disabled={configuring} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl text-base shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all flex items-center justify-center gap-2">
          <Icons.Play size={18} /> {configuring ? 'Configuring...' : 'Begin Match'}
        </button>
      </div>
    </div>
  );
}

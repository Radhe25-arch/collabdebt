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

  // Separate incoming pending challenges
  const pendingIncoming = battles.filter(b => b.status === 'PENDING' && b.challengedId === user?.id);
  const configuringBattles = battles.filter(b => b.status === 'CONFIGURING' && b.challengerId === user?.id);
  const otherBattles = battles.filter(b => !pendingIncoming.includes(b) && !configuringBattles.includes(b));

  const handleRespond = async (battleId, accept) => {
    try {
      await api.post(`/battles/${battleId}/respond`, { accept });
      toast.success(accept ? 'Accepted! Waiting for host to configure.' : 'Challenge declined.');
      // Refresh
      const r = await api.get('/battles');
      setBattles(r.data.battles || []);
      if (accept) navigate(`/battles/${battleId}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  const statusColor = {
    PENDING:     'purple',
    CONFIGURING: 'blue',
    ACTIVE:      'teal',
    COMPLETED:   'gray',
    DECLINED:    'red',
    EXPIRED:     'gray',
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl mb-1">1v1 Battles</h1>
          <p className="font-mono text-xs text-slate-500">Challenge any developer. Full report after every battle.</p>
        </div>
        <Button onClick={() => setModal(true)} variant="primary">
          <Icons.Zap size={14} /> Challenge
        </Button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Battles Fought', value: battles.filter(b => b.status === 'COMPLETED').length },
          { label: 'Wins', value: battles.filter(b => b.status === 'COMPLETED' && b.winnerId === user?.id).length },
          { label: 'Win Rate', value: (() => {
            const done = battles.filter(b => b.status === 'COMPLETED');
            const wins = done.filter(b => b.winnerId === user?.id).length;
            return done.length ? `${Math.round((wins/done.length)*100)}%` : '—';
          })() },
        ].map(({ label, value }) => (
          <div key={label} className="arena-card p-4 text-center">
            <div className="font-display font-bold text-xl text-slate-900">{value}</div>
            <div className="font-mono text-xs text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Incoming Challenges */}
      {pendingIncoming.length > 0 && (
        <div className="arena-card overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 bg-blue-600/5">
            <span className="font-mono text-xs text-blue-700 uppercase tracking-widest">Incoming Challenges</span>
          </div>
          <div className="divide-y divide-arena-border/40">
            {pendingIncoming.map(b => (
              <div key={b.id} className="flex items-center gap-4 px-5 py-4">
                <Avatar user={b.challenger} size={36} />
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-sm font-bold text-slate-900">{b.challenger?.username}</span>
                  <p className="font-mono text-xs text-slate-500">wants to battle you!</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleRespond(b.id, true)} className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-indigo-600/20 text-indigo-600 border border-indigo-600/30 hover:bg-indigo-600/30 transition-colors">Accept</button>
                  <button onClick={() => handleRespond(b.id, false)} className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors">Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Configuring Battles (Host must configure) */}
      {configuringBattles.map(b => (
        <HostConfigPanel key={b.id} battle={b} onStart={() => navigate(`/battles/${b.id}`)} onRefresh={async () => {
          const r = await api.get('/battles');
          setBattles(r.data.battles || []);
        }} />
      ))}

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size={24} className="text-blue-700" /></div>
      ) : otherBattles.length === 0 && pendingIncoming.length === 0 && configuringBattles.length === 0 ? (
        <div className="arena-card p-16 text-center">
          <Icons.Zap size={32} className="text-slate-500 mx-auto mb-4" />
          <p className="font-display font-bold mb-2">No battles yet</p>
          <p className="font-mono text-xs text-slate-500 mb-6">Challenge a friend to your first 1v1</p>
          <Button onClick={() => setModal(true)} variant="primary">
            <Icons.Zap size={14} /> Start a Battle
          </Button>
        </div>
      ) : otherBattles.length > 0 && (
        <div className="arena-card overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Battle History</span>
          </div>
          <div className="divide-y divide-arena-border/40">
            {otherBattles.map((b) => {
              const opp = b.challengerId === user?.id ? b.challenged : b.challenger;
              const isWinner = b.winnerId === user?.id;
              const isDraw   = b.status === 'COMPLETED' && !b.winnerId;
              const isActive = b.status === 'ACTIVE';
              const isConfig = b.status === 'CONFIGURING';

              return (
                <div
                  key={b.id}
                  className="flex items-center gap-4 px-5 py-3.5 cursor-pointer hover:bg-slate-100/50 transition-colors"
                  onClick={() => navigate(`/battles/${b.id}`)}
                >
                  <Avatar user={opp} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900">{opp?.username}</span>
                      <BadgeTag variant={statusColor[b.status] || 'gray'}>
                        {b.status}
                      </BadgeTag>
                    </div>
                    <span className="font-mono text-xs text-slate-500">
                      {formatDistanceToNow(new Date(b.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {b.status === 'COMPLETED' && (
                      <span className={`font-mono font-bold text-sm ${isWinner ? 'text-yellow-400' : isDraw ? 'text-blue-700' : 'text-red-400'}`}>
                        {isWinner ? 'WON' : isDraw ? 'DRAW' : 'LOST'}
                      </span>
                    )}
                    {isActive && (
                      <span className="flex items-center gap-1 font-mono text-xs text-indigo-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" /> LIVE
                      </span>
                    )}
                    {isConfig && (
                      <span className="font-mono text-xs text-blue-400">Configuring</span>
                    )}
                    <Icons.ChevronRight size={14} className="text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Challenge Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Challenge a Developer">
        <div className="space-y-4">
          <p className="font-mono text-xs text-slate-600">Enter the username of the developer you want to challenge to a 1v1 coding battle.</p>
          <Input
            label="Opponent Username"
            placeholder="e.g. sarthak_k"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChallenge()}
            icon={<Icons.Terminal size={14} />}
          />
          <div className="flex gap-3 pt-2">
            <Button onClick={() => setModal(false)} variant="secondary" className="flex-1">Cancel</Button>
            <Button onClick={handleChallenge} variant="teal" className="flex-1" loading={sending}>
              <Icons.Zap size={14} /> Send Challenge
            </Button>
          </div>
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
      toast.success('Battle started! Timer is running.');
      await onRefresh();
      onStart();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to start');
    }
    setConfiguring(false);
  };

  return (
    <div className="arena-card overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-200 bg-blue-500/5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="font-mono text-xs text-blue-400 uppercase tracking-widest">Configure Match — You Are The Host</span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 border border-slate-200">
          <Avatar user={battle.challenged} size={32} />
          <div>
            <p className="font-mono text-sm font-bold text-white">{battle.challenged?.username}</p>
            <p className="font-mono text-xs text-slate-500">Opponent accepted. Configure and start the match.</p>
          </div>
        </div>

        {/* Problem Mode */}
        <div>
          <label className="font-mono text-xs text-slate-500 uppercase tracking-widest block mb-2">Problem Mode</label>
          <div className="grid grid-cols-2 gap-3">
            {MODE_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setMode(opt.id)}
                className={`p-3 rounded-xl text-left border transition-all ${mode === opt.id ? 'bg-blue-600/10 border-blue-600/40' : 'bg-slate-100 border-slate-200 hover:border-white/20'}`}
              >
                <p className="font-mono text-xs font-bold text-white">{opt.label}</p>
                <p className="font-mono text-[10px] text-slate-500 mt-1">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom problem input */}
        {mode === 'custom' && (
          <div>
            <label className="font-mono text-xs text-slate-500 uppercase tracking-widest block mb-2">Problem Description</label>
            <textarea
              className="w-full w-full bg-white border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 text-slate-900 focus:outline-none focus:border-blue-500 transition-all text-sm p-3 text-sm min-h-[100px] resize-y"
              placeholder="Write the problem statement for your opponent..."
              value={customProblem}
              onChange={(e) => setCustomProblem(e.target.value)}
            />
          </div>
        )}

        {/* Language */}
        <div>
          <label className="font-mono text-xs text-slate-500 uppercase tracking-widest block mb-2">Language</label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${language === lang ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 border border-slate-200 hover:text-white'}`}
              >{lang}</button>
            ))}
          </div>
        </div>

        {/* Timer */}
        <div>
          <label className="font-mono text-xs text-slate-500 uppercase tracking-widest block mb-2">Timer</label>
          <div className="flex flex-wrap gap-2">
            {TIMER_OPTIONS.map(t => (
              <button
                key={t.value}
                onClick={() => setTimeLimit(t.value)}
                className={`px-4 py-2 rounded-lg font-mono text-xs transition-all ${timeLimit === t.value ? 'bg-indigo-600 text-black font-bold' : 'bg-slate-100 text-slate-500 border border-slate-200 hover:text-white'}`}
              >{t.label}</button>
            ))}
          </div>
        </div>

        {/* Start */}
        <Button onClick={handleStart} variant="primary" className="w-full" loading={configuring}>
          <Icons.Zap size={14} /> Start Battle Now
        </Button>
      </div>
    </div>
  );
}

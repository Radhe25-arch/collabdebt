import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Avatar, BadgeTag, Button, Modal, Input, Spinner } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

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
      toast.success('Challenge sent!');
      setModal(false);
      setOpponent('');
      navigate(`/battles/${r.data.battle.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not send challenge');
    }
    setSending(false);
  };

  const statusColor = {
    PENDING:   'badge-purple',
    ACTIVE:    'badge-teal',
    COMPLETED: 'badge-gray',
    DECLINED:  'badge-red',
    EXPIRED:   'badge-gray',
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl mb-1">1v1 Battles</h1>
          <p className="font-mono text-xs text-arena-dim">// challenge any developer · full report card after every battle</p>
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
            <div className="font-display font-bold text-xl text-arena-text">{value}</div>
            <div className="font-mono text-xs text-arena-dim mt-1">{label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size={24} className="text-arena-purple2" /></div>
      ) : battles.length === 0 ? (
        <div className="arena-card p-16 text-center">
          <Icons.Zap size={32} className="text-arena-dim mx-auto mb-4" />
          <p className="font-display font-bold mb-2">No battles yet</p>
          <p className="font-mono text-xs text-arena-dim mb-6">Challenge a friend to your first 1v1</p>
          <Button onClick={() => setModal(true)} variant="primary">
            <Icons.Zap size={14} /> Start a Battle
          </Button>
        </div>
      ) : (
        <div className="arena-card overflow-hidden">
          <div className="px-5 py-3 border-b border-arena-border">
            <span className="font-mono text-xs text-arena-dim uppercase tracking-widest">Battle History</span>
          </div>
          <div className="divide-y divide-arena-border/40">
            {battles.map((b) => {
              const opponent = b.challengerId === user?.id ? b.challenged : b.challenger;
              const isWinner = b.winnerId === user?.id;
              const isDraw   = b.status === 'COMPLETED' && !b.winnerId;
              const isActive = b.status === 'ACTIVE';
              const isPending = b.status === 'PENDING' && b.challengedId === user?.id;

              return (
                <div
                  key={b.id}
                  className="flex items-center gap-4 px-5 py-3.5 cursor-pointer hover:bg-arena-bg3/50 transition-colors"
                  onClick={() => navigate(`/battles/${b.id}`)}
                >
                  <Avatar user={opponent} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-arena-text">{opponent?.username}</span>
                      <BadgeTag variant={statusColor[b.status]?.replace('badge-','') || 'gray'}>
                        {b.status}
                      </BadgeTag>
                    </div>
                    <span className="font-mono text-xs text-arena-dim">
                      {formatDistanceToNow(new Date(b.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {b.status === 'COMPLETED' && (
                      <span className={`font-mono font-bold text-sm ${isWinner ? 'text-yellow-400' : isDraw ? 'text-arena-purple2' : 'text-red-400'}`}>
                        {isWinner ? 'WON' : isDraw ? 'DRAW' : 'LOST'}
                      </span>
                    )}
                    {isActive && (
                      <span className="flex items-center gap-1 font-mono text-xs text-arena-teal">
                        <span className="w-1.5 h-1.5 rounded-full bg-arena-teal animate-pulse" /> LIVE
                      </span>
                    )}
                    {isPending && (
                      <span className="font-mono text-xs text-arena-purple2">Respond</span>
                    )}
                    <Icons.ChevronRight size={14} className="text-arena-dim" />
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
          <p className="font-mono text-xs text-arena-muted">Enter the username of the developer you want to challenge to a 1v1 coding battle.</p>
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

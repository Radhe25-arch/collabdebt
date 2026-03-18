// TournamentsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeTag, Spinner } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import { format, formatDistanceToNow } from 'date-fns';

function TournamentStatusBadge({ status }) {
  const map = {
    ACTIVE:   { label: 'Live',     variant: 'teal' },
    UPCOMING: { label: 'Upcoming', variant: 'purple' },
    ENDED:    { label: 'Ended',    variant: 'gray' },
  };
  const { label, variant } = map[status] || { label: status, variant: 'gray' };
  return <BadgeTag variant={variant}>{label}</BadgeTag>;
}

function TypeIcon({ type }) {
  const map = {
    CODING_CHALLENGE: Icons.Terminal,
    QUIZ_BATTLE:      Icons.Target,
    SPEED_COURSE:     Icons.Zap,
  };
  const Ic = map[type] || Icons.Trophy;
  return <Ic size={14} className="text-arena-muted" />;
}

function TournamentCard({ t, onJoin }) {
  const navigate = useNavigate();
  const isActive  = t.status === 'ACTIVE';
  const isEnded   = t.status === 'ENDED';

  return (
    <div
      className={`arena-card p-5 cursor-pointer hover:-translate-y-1 transition-transform ${isActive ? 'ring-1 ring-arena-teal/20' : ''}`}
      onClick={() => navigate(`/tournaments/${t.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <TypeIcon type={t.type} />
          <TournamentStatusBadge status={t.status} />
        </div>
        {isActive && <span className="w-2 h-2 rounded-full bg-arena-teal animate-pulse" />}
      </div>

      <h3 className="font-display font-bold text-base mb-1">{t.title}</h3>
      <p className="font-mono text-xs text-arena-dim mb-4">
        {t.type.replace(/_/g, ' ')}
      </p>

      <div className="flex items-center justify-between text-xs font-mono text-arena-dim mb-4">
        <div className="flex items-center gap-1">
          <Icons.Users size={11} />
          <span>{t._count?.entries || 0} participants</span>
        </div>
        <div className="flex items-center gap-1">
          <Icons.Zap size={11} className="text-arena-purple2" />
          <span className="text-arena-purple2">+{t.xpBonus} XP</span>
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs font-mono text-arena-dim mb-4">
        <Icons.Clock size={11} />
        {isActive ? (
          <span>Ends {formatDistanceToNow(new Date(t.endsAt), { addSuffix: true })}</span>
        ) : isEnded ? (
          <span>Ended {format(new Date(t.endsAt), 'MMM d, yyyy')}</span>
        ) : (
          <span>Starts {formatDistanceToNow(new Date(t.startsAt), { addSuffix: true })}</span>
        )}
      </div>

      {isActive && (
        <button
          onClick={(e) => { e.stopPropagation(); onJoin(t.id); }}
          className="btn-teal w-full py-2 text-xs"
        >
          <Icons.Tournament size={13} /> Join Tournament
        </button>
      )}
      {isEnded && (
        <button className="btn-secondary w-full py-2 text-xs">
          <Icons.Trophy size={13} /> View Results
        </button>
      )}
    </div>
  );
}

export default function TournamentsPage() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading]          = useState(true);
  const [filter, setFilter]            = useState('all');

  useEffect(() => {
    api.get('/tournaments').then((r) => setTournaments(r.data.tournaments || [])).finally(() => setLoading(false));
  }, []);

  const handleJoin = async (id) => {
    try {
      await api.post(`/tournaments/${id}/join`);
      navigate(`/tournaments/${id}`);
    } catch (err) {
      if (err.response?.status === 409) navigate(`/tournaments/${id}`);
    }
  };

  const filtered = filter === 'all' ? tournaments : tournaments.filter((t) => t.status === filter.toUpperCase());

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-display font-black text-2xl mb-1">Tournaments</h1>
        <p className="font-mono text-xs text-arena-dim">// new tournament every monday · free entry · earn bonus XP</p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {['all', 'active', 'upcoming', 'ended'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`badge-tag font-mono text-xs capitalize transition-all ${
              filter === f ? 'badge-purple' : 'badge-gray hover:text-arena-text'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={24} className="text-arena-purple2" /></div>
      ) : filtered.length === 0 ? (
        <div className="arena-card p-16 text-center">
          <Icons.Trophy size={32} className="text-arena-dim mx-auto mb-3" />
          <p className="font-mono text-sm text-arena-dim">No tournaments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((t) => <TournamentCard key={t.id} t={t} onJoin={handleJoin} />)}
        </div>
      )}
    </div>
  );
}

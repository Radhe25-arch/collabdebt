import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import { format, formatDistanceToNow } from 'date-fns';

function TournamentStatusBadge({ status }) {
  const map = {
    ACTIVE:   { label: 'Live',     variant: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    UPCOMING: { label: 'Upcoming', variant: 'bg-blue-100 text-blue-700 border-blue-200' },
    ENDED:    { label: 'Ended',    variant: 'bg-slate-100 text-slate-600 border-slate-200' },
  };
  const { label, variant } = map[status] || { label: status, variant: 'bg-slate-100 text-slate-600 border-slate-200' };
  return <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${variant}`}>{label}</span>;
}

function TypeIcon({ type }) {
  const map = {
    CODING_CHALLENGE: Icons.Terminal,
    QUIZ_BATTLE:      Icons.Target,
    SPEED_COURSE:     Icons.Zap,
  };
  const Ic = map[type] || Icons.Trophy;
  return <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
    <Ic size={18} className="text-slate-600" />
  </div>;
}

function TournamentCard({ t, onJoin }) {
  const navigate = useNavigate();
  const isActive  = t.status === 'ACTIVE';
  const isEnded   = t.status === 'ENDED';

  return (
    <div
      className={`bg-white border rounded-3xl p-6 cursor-pointer hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all group flex flex-col ${isActive ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200 hover:-translate-y-1'}`}
      onClick={() => navigate(`/tournaments/${t.id}`)}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <TypeIcon type={t.type} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isActive && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                {t.type.replace(/_/g, ' ')}
              </span>
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
              {t.title}
            </h3>
          </div>
        </div>
        <TournamentStatusBadge status={t.status} />
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between mb-5">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Entries</span>
          <span className="font-black text-slate-900 flex items-center gap-1.5 mt-0.5"><Icons.Users size={14} className="text-slate-400"/> {t._count?.entries || 0}</span>
        </div>
        <div className="w-px h-8 bg-slate-200" />
        <div className="flex flex-col items-end">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Base Reward</span>
          <span className="font-black text-amber-600 flex items-center gap-1 mt-0.5"><Icons.Zap size={14} /> +{t.xpBonus} XP</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-6 mt-auto">
        <Icons.Clock size={16} className={isActive ? "text-emerald-500" : "text-slate-400"} />
        {isActive ? (
          <span className="text-emerald-600">Ends {formatDistanceToNow(new Date(t.endsAt), { addSuffix: true })}</span>
        ) : isEnded ? (
           <span>Ended {format(new Date(t.endsAt), 'MMM d, yyyy')}</span>
        ) : (
          <span>Starts {formatDistanceToNow(new Date(t.startsAt), { addSuffix: true })}</span>
        )}
      </div>

      {isActive && (
        <button
          onClick={(e) => { e.stopPropagation(); onJoin(t.id); }}
          className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Icons.Link size={16} /> Enter Arena
        </button>
      )}
      {isEnded && (
        <button className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
          <Icons.Trophy size={16} className="text-slate-400" /> View Results
        </button>
      )}
      {t.status === 'UPCOMING' && (
        <button className="w-full bg-blue-50 border border-blue-100 text-blue-700 font-bold py-3.5 rounded-xl text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
          <Icons.Bell size={16} /> Remind Me
        </button>
      )}
    </div>
  );
}

export default function TournamentsPage() {
  const navigate = useNavigate();
  const [tournaments, setTournaments]  = useState([]);
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
    <div className="space-y-8 max-w-5xl mx-auto pb-20 font-sans animate-fade-in">
      
      {/* Header */}
      <div className="text-center pt-4 mb-8">
        <span className="bg-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block">
          GLOBAL COMPETITIONS
        </span>
        <h1 className="font-display font-black text-4xl text-slate-900 mb-3 tracking-tight">Code Tournaments</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          New tournaments launch every Monday. Compete in coding challenges and speed drills to win epic XP payouts and permanent profile badges.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center justify-center gap-2">
        {['all', 'active', 'upcoming', 'ended'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold capitalize transition-all border ${
              filter === f ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-16 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
            <Icons.Trophy size={32} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Tournaments Found</h3>
          <p className="text-slate-500">Check back later or change your filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((t) => <TournamentCard key={t.id} t={t} onJoin={handleJoin} />)}
        </div>
      )}
    </div>
  );
}

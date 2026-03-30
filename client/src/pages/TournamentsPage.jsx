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
  return <Ic size={14} className="text-slate-600" />;
}

function TournamentCard({ t, onJoin }) {
  const navigate = useNavigate();
  const isActive  = t.status === 'Sf_ACTIVE' || t.status === 'ACTIVE'; // Handling different status mappings
  const isEnded   = t.status === 'ENDED';

  return (
    <div
      className={`sf-card p-6 cursor-pointer hover:border-blue-300 transition-all group ${isActive ? 'bg-blue-50/10' : ''}`}
      onClick={() => navigate(`/tournaments/${t.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-white transition-colors">
            <TypeIcon type={t.type} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-[15px]">{t.title}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.type.replace(/_/g, ' ')}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
            <TournamentStatusBadge status={t.status} />
            {isActive && <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 border border-green-100">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[9px] font-bold text-green-600 uppercase tracking-tight">Active</span>
            </div>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 pt-2">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prize Pool</p>
          <div className="flex items-center gap-1.5">
             <Icons.Zap size={11} className="text-orange-500" />
             <span className="text-sm font-bold text-slate-700">+{t.xpBonus} XP</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stability</p>
          <div className="flex items-center gap-1.5">
             <Icons.Users size={11} className="text-slate-400" />
             <span className="text-sm font-bold text-slate-700">{t._count?.entries || 0} Joined</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-[11px] font-medium text-slate-400">
          {isActive ? `Expires ${formatDistanceToNow(new Date(t.endsAt), { addSuffix: true })}` : 'Archived Results'}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onJoin(t.id); }}
          className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Icons.ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default function TournamentsPage() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading]          = useState(true);

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

  return (
    <div className="max-w-6xl mx-auto pb-24 pt-10 px-6 space-y-10">
      
      {/* ── HEADER ── */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                <Icons.Trophy size={18} />
             </div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Automated Arena</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">System Tournaments</h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">100 Daily Protocols generated by SkillForge Prime. Win global ranking slots for massive XP rewards.</p>
        </div>

        <div className="hidden lg:flex items-center gap-12">
            <div className="text-right">
                <div className="text-2xl font-black text-slate-900">100</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Daily Capacity</div>
            </div>
            <div className="text-right">
                <div className="text-2xl font-black text-blue-600">Active</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">System Load</div>
            </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-32"><Spinner size={24} className="text-slate-300" /></div>
      ) : tournaments.length === 0 ? (
        <div className="sf-card p-24 text-center border-dashed">
          <Icons.Trophy size={48} className="text-slate-100 mx-auto mb-6" />
          <h3 className="text-lg font-bold text-slate-900">Protocols Offline</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">The tournament lattice is currently being recalibrated. Check back in T-minus 10 minutes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((t) => <TournamentCard key={t.id} t={t} onJoin={handleJoin} />)}
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-12 text-center">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Refresh every 24 hours at 00:00 UTC</p>
      </div>

    </div>
  );
}

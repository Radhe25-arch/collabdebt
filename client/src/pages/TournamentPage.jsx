import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Avatar, BadgeTag, Spinner, Button } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import { format, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const LEVEL_NAMES = ['Beginner','Apprentice','Coder','Developer','Senior Dev','Architect','Pro','Expert','Master','Legend'];

export default function TournamentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tournament, setTournament]   = useState(null);
  const [scoreboard, setScoreboard]   = useState([]);
  const [joined, setJoined]           = useState(false);
  const [loading, setLoading]         = useState(true);
  const pollRef = useRef(null);

  const fetchData = async () => {
    const [t, s] = await Promise.all([
      api.get(`/tournaments/${id}`),
      api.get(`/tournaments/${id}/scoreboard`),
    ]);
    setTournament(t.data.tournament);
    setScoreboard(s.data.scoreboard || []);
  };

  useEffect(() => {
    api.get(`/tournaments/current`)
      .then((r) => { if (r.data.userEntry?.tournamentId === id) setJoined(true); })
      .catch(() => {});

    fetchData().finally(() => setLoading(false));

    // Poll scoreboard every 30s if active
    pollRef.current = setInterval(() => {
      api.get(`/tournaments/${id}/scoreboard`)
        .then((r) => setScoreboard(r.data.scoreboard || []))
        .catch(() => {});
    }, 30000);

    return () => clearInterval(pollRef.current);
  }, [id]);

  const handleJoin = async () => {
    try {
      await api.post(`/tournaments/${id}/join`);
      setJoined(true);
      toast.success('Joined tournament. Good luck.');
    } catch (err) {
      if (err.response?.status === 409) setJoined(true);
      else toast.error('Failed to join');
    }
  };

  if (loading) return (
    <div className="flex justify-center py-24"><Spinner size={28} className="text-blue-700" /></div>
  );

  if (!tournament) return (
    <div className="text-center py-24">
      <p className="font-mono text-sm text-slate-500">Tournament not found</p>
    </div>
  );

  const isActive = tournament.status === 'ACTIVE';
  const myEntry  = scoreboard.find((e) => e.user?.id === user?.id);

  const typeMap = {
    CODING_CHALLENGE: { icon: Icons.Terminal, label: 'Coding Challenge' },
    QUIZ_BATTLE:      { icon: Icons.Target,   label: 'Quiz Battle' },
    SPEED_COURSE:     { icon: Icons.Zap,       label: 'Speed Course' },
  };
  const { icon: TypeIc, label: typeLabel } = typeMap[tournament.type] || { icon: Icons.Trophy, label: tournament.type };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back */}
      <button onClick={() => navigate('/tournaments')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-mono text-xs transition-colors">
        <Icons.ArrowLeft size={13} /> back to tournaments
      </button>

      {/* Header card */}
      <div className="arena-card p-6 relative overflow-hidden">
        {isActive && <div className="absolute inset-0 bg-indigo-600/2 pointer-events-none" />}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <TypeIc size={16} className="text-slate-600" />
            <BadgeTag variant={isActive ? 'teal' : 'gray'}>
              {isActive ? 'Live' : tournament.status}
            </BadgeTag>
            {isActive && <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />}
          </div>

          <h1 className="font-display font-black text-2xl mb-1">{tournament.title}</h1>
          <p className="font-mono text-xs text-slate-500 mb-6">{typeLabel}</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-200">
              <div className="font-display font-bold text-lg text-slate-900">{tournament._count?.entries || 0}</div>
              <div className="font-mono text-xs text-slate-500">Participants</div>
            </div>
            <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-200">
              <div className="font-display font-bold text-lg text-blue-700">+{tournament.xpBonus}</div>
              <div className="font-mono text-xs text-slate-500">Winner XP</div>
            </div>
            <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-200">
              <div className="font-display font-bold text-sm text-slate-900">
                {isActive ? formatDistanceToNow(new Date(tournament.endsAt)) : format(new Date(tournament.endsAt), 'MMM d')}
              </div>
              <div className="font-mono text-xs text-slate-500">{isActive ? 'Remaining' : 'Ended'}</div>
            </div>
          </div>

          {isActive && !joined && (
            <Button onClick={handleJoin} variant="teal" className="w-full py-3">
              <Icons.Tournament size={15} />
              Join This Tournament — Free
            </Button>
          )}
          {joined && (
            <div className="flex items-center gap-2 justify-center py-3 rounded-lg border border-indigo-600/30 bg-indigo-600/5">
              <Icons.Check size={14} className="text-indigo-600" />
              <span className="font-mono text-sm text-indigo-600">You are competing</span>
            </div>
          )}
        </div>
      </div>

      {/* My rank if participating */}
      {myEntry && (
        <div className="arena-card p-4 flex items-center gap-4 bg-blue-600/5 border-blue-600/30">
          <Icons.Target size={14} className="text-blue-700" />
          <div>
            <span className="font-mono text-xs text-slate-500">Your rank</span>
            <div className="font-display font-bold text-lg text-blue-700">#{myEntry.rank}</div>
          </div>
          <div className="flex-1" />
          <div className="text-right">
            <span className="font-mono text-xs text-slate-500">Score</span>
            <div className="font-display font-bold text-lg text-slate-900">{myEntry.score}</div>
          </div>
        </div>
      )}

      {/* Live Scoreboard */}
      <div className="arena-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Live Scoreboard</span>
          {isActive && (
            <div className="flex items-center gap-1.5 text-indigo-600">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              <span className="font-mono text-xs">Updates every 30s</span>
            </div>
          )}
        </div>

        {scoreboard.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-mono text-xs text-slate-500">No submissions yet. Be the first.</p>
          </div>
        ) : (
          <div className="divide-y divide-arena-border/40">
            {scoreboard.map((entry) => {
              const isMe = entry.user?.id === user?.id;
              const lvl  = Math.min(entry.user?.level || 1, 10);
              return (
                <div key={`${entry.rank}-${entry.user?.id}`}
                  className={`flex items-center gap-4 px-5 py-3.5 ${isMe ? 'bg-indigo-600/5' : ''}`}
                >
                  <div className={`w-7 font-mono text-xs font-bold text-center ${
                    entry.rank === 1 ? 'text-yellow-400' :
                    entry.rank === 2 ? 'text-slate-400' :
                    entry.rank === 3 ? 'text-amber-600' : 'text-slate-500'
                  }`}>
                    {entry.rank <= 3 ? (
                      <Icons.Trophy size={13} className="mx-auto" />
                    ) : `#${entry.rank}`}
                  </div>
                  <Avatar user={entry.user} size={30} />
                  <div className="flex-1 min-w-0">
                    <span className={`font-mono text-xs font-bold ${isMe ? 'text-indigo-600' : 'text-slate-900'}`}>
                      {entry.user?.username}
                    </span>
                    <div className="font-mono text-xs text-slate-500">{LEVEL_NAMES[(lvl - 1)]} · Lv{lvl}</div>
                  </div>
                  <div className="font-display font-bold text-base text-slate-900">{entry.score}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

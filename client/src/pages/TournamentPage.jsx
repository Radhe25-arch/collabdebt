import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, BadgeTag, Spinner } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function TournamentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [scoreboard, setScoreboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [userEntry, setUserEntry] = useState(null);

  const fetchData = async () => {
    try {
      const [tRes, sRes] = await Promise.all([
        api.get(`/tournaments/${id}`),
        api.get(`/tournaments/${id}/scoreboard`),
      ]);
      setTournament(tRes.data.tournament);
      setScoreboard(sRes.data.scoreboard || []);
      
      // Check if user is in scoreboard
      // (Backend normally returns userEntry in getCurrent, but for detail we check list)
    } catch {
      toast.error('Failed to load tournament segment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await api.post(`/tournaments/${id}/join`);
      toast.success('Joined Protocol Successful');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Join failed');
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <div className="flex justify-center p-32"><Spinner size={24} className="text-slate-400" /></div>;
  if (!tournament) return <div className="text-center p-20">Protocol not found</div>;

  const isActive = tournament.status === 'ACTIVE';

  return (
    <div className="max-w-5xl mx-auto pb-24 pt-10 px-6 space-y-12">
      
      {/* ── BREADCRUMB ── */}
      <button onClick={() => navigate('/tournaments')} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors">
        <Icons.ArrowRight size={12} className="rotate-180" /> Back to Collective
      </button>

      {/* ── HERO ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <BadgeTag variant="teal">{tournament.type.replace(/_/g, ' ')}</BadgeTag>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol {tournament.id.slice(-6).toUpperCase()}</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{tournament.title}</h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xl">
              {tournament.description || "Deploy your full logic potential to secure ranking nodes. Each submission contributes to your global SkillForge authority."}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-4">
             <div className="p-5 sf-card-premium border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Max Yield</p>
                <div className="flex items-center gap-2">
                   <Icons.Zap size={14} className="text-blue-600" />
                   <span className="text-xl font-black text-slate-900">+{tournament.xpBonus} XP</span>
                </div>
             </div>
             <div className="p-5 sf-card-premium border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Stability</p>
                <div className="flex items-center gap-2">
                   <Icons.Users size={14} className="text-slate-400" />
                   <span className="text-xl font-black text-slate-900">{tournament._count?.entries || 0}</span>
                </div>
             </div>
             <div className="p-5 sf-card-premium border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Time Left</p>
                <div className="flex items-center gap-2 text-blue-600">
                   <Icons.Clock size={14} />
                   <span className="text-sm font-black uppercase tracking-tight">{isActive ? formatDistanceToNow(new Date(tournament.endsAt)) : 'Closed'}</span>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <div className="p-8 sf-card bg-slate-900 text-white relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                 <div>
                   <h3 className="font-bold text-lg mb-1">Join Segment</h3>
                   <p className="text-xs text-slate-400 leading-relaxed font-medium">Verify your intent to join this daily ranking protocol.</p>
                 </div>
                 
                 {isActive ? (
                   <button 
                    onClick={handleJoin}
                    disabled={joining}
                    className="w-full py-4 bg-white text-slate-900 font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/40"
                   >
                     {joining ? 'Initializing...' : 'Authorize Participation'}
                   </button>
                 ) : (
                   <div className="w-full py-4 bg-slate-800 text-slate-500 font-bold text-center rounded-xl text-xs uppercase tracking-widest">Protocol Terminated</div>
                 )}
                 <p className="text-[9px] font-bold text-slate-500 uppercase text-center tracking-widest italic font-mono">Consuming bandwidth: 0.2 kbps</p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl" />
           </div>
           
           <div className="p-6 sf-card border-slate-200 space-y-4">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Rank Rewards</h4>
              <div className="space-y-3">
                 {[
                   { rank: 'Top 1%', reward: '2.5x Multiplier', icon: '1st' },
                   { rank: 'Top 10%', reward: '1.5x Multiplier', icon: '2nd' },
                   { rank: 'Participation', reward: '+50 XP Fixed', icon: '3rd' }
                 ].map((r, i) => (
                   <div key={i} className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-500">{r.rank}</span>
                      <span className="text-blue-600">{r.reward}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* ── SCOREBOARD ── */}
      <div className="space-y-8">
        <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] border-l-4 border-blue-600 pl-6 py-1">Real-time Ranking Standings</h2>
        <div className="sf-card overflow-hidden">
           <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">Rank</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Architect</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Yield Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {scoreboard.map((e) => (
                  <tr key={e.user.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                        e.rank === 1 ? 'bg-slate-900 text-yellow-400' : 
                        e.rank === 2 ? 'bg-slate-100 text-slate-600' :
                        e.rank === 3 ? 'bg-slate-50 text-amber-700' : 'text-slate-400'
                      }`}>
                        #{e.rank}
                      </div>
                    </td>
                    <td className="px-8 py-4">
                       <div className="flex items-center gap-3">
                          <Avatar user={e.user} size={32} className="rounded-full bg-slate-100" />
                          <div>
                             <p className="text-sm font-bold text-slate-900 leading-none mb-1 uppercase tracking-tight">{e.user.username}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">LVL {e.user.level}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Icons.Zap size={12} className="text-blue-600" />
                          <span className="font-mono text-sm font-black text-slate-900 tracking-tighter">{e.score.toLocaleString()}</span>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
           {scoreboard.length === 0 && <div className="py-20 text-center text-slate-400 text-xs italic font-medium">No live submissions in this segment yet.</div>}
        </div>
      </div>

    </div>
  );
}
